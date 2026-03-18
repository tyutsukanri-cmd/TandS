import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import path from 'path'
import { rm } from 'fs/promises'

export const runtime = 'nodejs'

function safeSegment(s: string) {
  return String(s || '')
    .replace(/[\\/:*?"<>|]/g, '-')
    .replace(/\s+/g, '')
    .slice(0, 80)
}

export async function DELETE(request: NextRequest, ctx: { params: { orderNumber: string } }) {
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
    const base = path.join(process.cwd(), 'public', 'uploaded', safeSegment(username))
    const target = path.join(base, safeSegment(folderName))
    const resolvedBase = path.resolve(base)
    const resolvedTarget = path.resolve(target)
    if (!resolvedTarget.startsWith(resolvedBase)) {
      return NextResponse.json({ error: '无效路径' }, { status: 400 })
    }

    await rm(resolvedTarget, { recursive: true, force: true })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.message === '未登录') return NextResponse.json({ error: '请先登录' }, { status: 401 })
    if (error.message === '需要管理员权限') return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    return NextResponse.json({ error: error.message || '删除失败' }, { status: 500 })
  }
}

