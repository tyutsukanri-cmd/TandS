import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)

    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        phone: true,
        email: true,
        companyName: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            orders: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // 添加订单数量
    const usersWithOrderCount = users.map((user) => ({
      ...user,
      orderCount: user._count.orders,
    }))

    return NextResponse.json(usersWithOrderCount)
  } catch (error: any) {
    if (error.message === '未登录') {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      )
    }
    if (error.message === '需要管理员权限') {
      return NextResponse.json(
        { error: '需要管理员权限' },
        { status: 403 }
      )
    }
    return NextResponse.json(
      { error: error.message || '获取用户列表失败' },
      { status: 500 }
    )
  }
}

