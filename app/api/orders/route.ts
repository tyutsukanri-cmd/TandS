import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'
import path from 'path'
import { mkdir, rename } from 'fs/promises'

export const runtime = 'nodejs'

function yyyymmdd(d = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}${m}${day}`
}

function safeSegment(s: string) {
  return String(s || '')
    .replace(/[\\/:*?"<>|]/g, '-')
    .replace(/\s+/g, '')
    .slice(0, 80)
}

const cartItemSchema = z.object({
  productName: z.string().min(1),
  size: z.string().min(1),
  color: z.string().min(1),
  quantity: z.number().int().min(1),
  positions: z
    .object({
      p1: z.string().optional().default(''),
      p2: z.string().optional().default(''),
      p3: z.string().optional().default(''),
      p4: z.string().optional().default(''),
    })
    .optional()
    .default({ p1: '', p2: '', p3: '', p4: '' }),
  note: z.string().optional().default(''),
  print: z
    .object({
      p1: z.object({ filePath: z.string().optional() }).optional(),
      p2: z.object({ filePath: z.string().optional() }).optional(),
      p3: z.object({ filePath: z.string().optional() }).optional(),
      p4: z.object({ filePath: z.string().optional() }).optional(),
    })
    .optional(),
})

const createOrderGroupSchema = z.object({
  items: z.array(cartItemSchema).min(1),
})

function stripQuery(u: string) {
  return u.split('?')[0]
}

function parseUploadedPath(filePath: string) {
  // /uploaded/<username>/<folder>/<file>
  const fp = stripQuery(filePath)
  if (!fp.startsWith('/uploaded/')) return null
  const parts = fp.slice('/uploaded/'.length).split('/').map((p) => decodeURIComponent(p))
  if (parts.length < 3) return null
  const [username, folder, ...rest] = parts
  const fileName = rest.join('/')
  return { username, folder, fileName }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const body = await request.json()
    const data = createOrderGroupSchema.parse(body)

    const today = yyyymmdd()
    const existingCount = await prisma.orderGroup.count({
      where: { userId: user.userId, orderDate: today },
    })
    const sequence = existingCount + 1
    const orderNumber = `${safeSegment(user.username)}${today}-${sequence}`
    const folderName = `${today}-${sequence}`

    // 先创建订单头 + 明细（图片路径稍后可能会移动更新）
    const created = await prisma.orderGroup.create({
      data: {
        userId: user.userId,
        orderNumber,
        orderDate: today,
        sequence,
        folderName,
        items: {
          create: data.items.map((it) => ({
            productName: it.productName,
            size: it.size,
            color: it.color,
            quantity: it.quantity,
            note: it.note || null,
            image1Path: it.print?.p1?.filePath ? stripQuery(it.print.p1.filePath) : null,
            image1Pos: it.positions?.p1 || null,
            image2Path: it.print?.p2?.filePath ? stripQuery(it.print.p2.filePath) : null,
            image2Pos: it.positions?.p2 || null,
            image3Path: it.print?.p3?.filePath ? stripQuery(it.print.p3.filePath) : null,
            image3Pos: it.positions?.p3 || null,
            image4Path: it.print?.p4?.filePath ? stripQuery(it.print.p4.filePath) : null,
            image4Pos: it.positions?.p4 || null,
          })),
        },
      },
      include: {
        items: true,
        user: { select: { username: true, companyName: true } },
      },
    })

    // 将图片从 /uploaded/<username>/<yyyymmdd>/ 移动到 /uploaded/<username>/<folderName>/
    const destDirOnDisk = path.join(process.cwd(), 'public', 'uploaded', safeSegment(user.username), folderName)
    await mkdir(destDirOnDisk, { recursive: true })

    const moveMap = new Map<string, string>() // oldUrl -> newUrl
    for (const it of created.items) {
      const paths = [it.image1Path, it.image2Path, it.image3Path, it.image4Path].filter(Boolean) as string[]
      for (const p of paths) {
        if (moveMap.has(p)) continue
        const parsed = parseUploadedPath(p)
        if (!parsed) continue
        if (parsed.username !== user.username) continue
        const srcOnDisk = path.join(process.cwd(), 'public', 'uploaded', parsed.username, parsed.folder, parsed.fileName)
        const dstOnDisk = path.join(process.cwd(), 'public', 'uploaded', parsed.username, folderName, parsed.fileName)
        try {
          await rename(srcOnDisk, dstOnDisk)
          const newUrl = `/uploaded/${encodeURIComponent(parsed.username)}/${encodeURIComponent(folderName)}/${encodeURIComponent(parsed.fileName)}`
          moveMap.set(p, newUrl)
        } catch {
          // 如果移动失败（例如文件不存在），保持原路径
        }
      }
    }

    if (moveMap.size > 0) {
      // Prisma 不支持在 updateMany 里根据不同记录/字段映射更新，这里逐条更新即可（数量通常不大）
      for (const it of created.items) {
        const next1 = it.image1Path && moveMap.get(it.image1Path) ? moveMap.get(it.image1Path)! : it.image1Path
        const next2 = it.image2Path && moveMap.get(it.image2Path) ? moveMap.get(it.image2Path)! : it.image2Path
        const next3 = it.image3Path && moveMap.get(it.image3Path) ? moveMap.get(it.image3Path)! : it.image3Path
        const next4 = it.image4Path && moveMap.get(it.image4Path) ? moveMap.get(it.image4Path)! : it.image4Path
        if (next1 !== it.image1Path || next2 !== it.image2Path || next3 !== it.image3Path || next4 !== it.image4Path) {
          await prisma.orderItem.update({
            where: { id: it.id },
            data: {
              image1Path: next1,
              image2Path: next2,
              image3Path: next3,
              image4Path: next4,
            },
          })
        }
      }
    }

    const refreshed = await prisma.orderGroup.findUnique({
      where: { id: created.id },
      include: { items: true, user: { select: { username: true, companyName: true } } },
    })

    return NextResponse.json({ success: true, order: refreshed })
  } catch (error: any) {
    if (error.message === '未登录') {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      )
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '输入数据格式错误', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: error.message || '创建订单失败' },
      { status: 500 }
    )
  }
}

// 获取当前用户的订单
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request)

    const orders = await prisma.orderGroup.findMany({
      where: { userId: user.userId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(orders)
  } catch (error: any) {
    if (error.message === '未登录') {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { error: error.message || '获取订单失败' },
      { status: 500 }
    )
  }
}

