import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import path from 'path'
import archiver from 'archiver'
import { PassThrough, Readable } from 'stream'
import { access } from 'fs/promises'

export const runtime = 'nodejs'

function safeSegment(s: string) {
  return String(s || '')
    .replace(/[\\/:*?"<>|]/g, '-')
    .replace(/\s+/g, '')
    .slice(0, 80)
}

export async function GET(request: NextRequest, ctx: { params: { orderNumber: string } }) {
  try {
    await requireAdmin(request)
    const orderNumber = decodeURIComponent(ctx.params.orderNumber || '')
    if (!orderNumber) return NextResponse.json({ error: '缺少订单号' }, { status: 400 })

    const order = await prisma.orderGroup.findUnique({
      where: { orderNumber },
      include: { user: { select: { username: true } } },
    })
    if (!order) return NextResponse.json({ error: '订单不存在' }, { status: 404 })

    const username = order.user.username
    const folderName = order.folderName
    const dirOnDisk = path.join(process.cwd(), 'public', 'uploaded', safeSegment(username), safeSegment(folderName))

    // 目录不存在则直接返回 404
    await access(dirOnDisk)

    const archive = archiver('zip', { zlib: { level: 9 } })
    const out = new PassThrough()
    archive.on('error', (err) => {
      out.destroy(err)
    })
    archive.pipe(out)
    // zip 内部目录名：<username>/<folderName>
    archive.directory(dirOnDisk, `${username}/${folderName}`)
    archive.finalize()

    const webStream = Readable.toWeb(out) as unknown as ReadableStream
    const zipName = `${orderNumber}.zip`
    const encodedZipName = encodeURIComponent(zipName)

    return new NextResponse(webStream, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${zipName}"; filename*=UTF-8''${encodedZipName}`,
      },
    })
  } catch (error: any) {
    if (error?.code === 'ENOENT') return NextResponse.json({ error: '图片文件夹不存在或已被清理' }, { status: 404 })
    if (error.message === '未登录') return NextResponse.json({ error: '请先登录' }, { status: 401 })
    if (error.message === '需要管理员权限') return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    return NextResponse.json({ error: error.message || '下载失败' }, { status: 500 })
  }
}

