import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const me = await requireAdmin(request)

    const userId = parseInt(params.userId, 10)
    if (isNaN(userId)) {
      return NextResponse.json({ error: '用户ID无效' }, { status: 400 })
    }

    const target = await prisma.user.findUnique({ where: { id: userId } })
    if (!target) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 })
    }

    // 管理员账号不能删除
    if (target.role === 'admin') {
      return NextResponse.json({ error: '管理员账号不能删除' }, { status: 403 })
    }

    // 不能删除自己
    if (target.id === me.userId) {
      return NextResponse.json({ error: '不能删除自己的账号' }, { status: 403 })
    }

    // 有订单的用户不能删除（外键约束）
    const orderCount = await prisma.orderGroup.count({ where: { userId } })
    if (orderCount > 0) {
      return NextResponse.json(
        { error: `该用户有 ${orderCount} 个订单，不能删除` },
        { status: 400 }
      )
    }

    await prisma.user.delete({ where: { id: userId } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.message === 'まだログインしていません') {
      return NextResponse.json({ error: '请先登录' }, { status: 401 })
    }
    if (error.message === '管理者権限が必要です') {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }
    return NextResponse.json(
      { error: error.message || '删除用户失败' },
      { status: 500 }
    )
  }
}
