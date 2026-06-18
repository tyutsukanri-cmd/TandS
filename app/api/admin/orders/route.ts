import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)

    const { searchParams } = new URL(request.url)
    const start = searchParams.get('start') || ''
    const end = searchParams.get('end') || ''
    const sort = (searchParams.get('sort') || 'desc').toLowerCase() === 'asc' ? 'asc' : 'desc'

    const where: any = {}
    if (start || end) {
      where.orderDate = {}
      if (start) where.orderDate.gte = start
      if (end) where.orderDate.lte = end
    }

    const orders = await prisma.orderGroup.findMany({
      where,
      include: {
        user: { select: { username: true, companyName: true } },
      },
      orderBy: { createdAt: sort as any },
    })

    return NextResponse.json(orders)
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
      { error: error.message || '获取订单失败' },
      { status: 500 }
    )
  }
}

