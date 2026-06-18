import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)
    const { searchParams } = new URL(request.url)
    const includeRead = searchParams.get('includeRead') !== '0'

    const where: any = {}
    if (!includeRead) where.isRead = false

    const [messages, unreadCount] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.contactMessage.count({ where: { isRead: false } }),
    ])

    return NextResponse.json({ messages, unreadCount })
  } catch (error: any) {
    if (error.message === '未登录') return NextResponse.json({ error: '请先登录' }, { status: 401 })
    if (error.message === '需要管理员权限') return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    return NextResponse.json({ error: error.message || '获取失败' }, { status: 500 })
  }
}

const patchSchema = z.object({
  ids: z.array(z.number().int()).min(1),
})

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin(request)
    const body = await request.json()
    const data = patchSchema.parse(body)
    await prisma.contactMessage.updateMany({
      where: { id: { in: data.ids } },
      data: { isRead: true },
    })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.message === '未登录') return NextResponse.json({ error: '请先登录' }, { status: 401 })
    if (error.message === '需要管理员权限') return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    if (error instanceof z.ZodError) return NextResponse.json({ error: '输入数据格式错误' }, { status: 400 })
    return NextResponse.json({ error: error.message || '更新失败' }, { status: 500 })
  }
}

const deleteSchema = z.object({
  ids: z.array(z.number().int()).min(1),
})

export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin(request)
    const body = await request.json()
    const data = deleteSchema.parse(body)
    await prisma.contactMessage.deleteMany({
      where: { id: { in: data.ids } },
    })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.message === '未登录') return NextResponse.json({ error: '请先登录' }, { status: 401 })
    if (error.message === '需要管理员权限') return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    if (error instanceof z.ZodError) return NextResponse.json({ error: '输入数据格式错误' }, { status: 400 })
    return NextResponse.json({ error: error.message || '删除失败' }, { status: 500 })
  }
}

