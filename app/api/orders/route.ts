import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'

const createOrderSchema = z.object({
  productId: z.number(),
  productName: z.string(),
  size: z.string(),
  color: z.string(),
  quantity: z.number().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const body = await request.json()
    const data = createOrderSchema.parse(body)

    // 验证商品是否存在
    const product = await prisma.product.findUnique({
      where: { id: data.productId },
    })

    if (!product) {
      return NextResponse.json(
        { error: '商品不存在' },
        { status: 404 }
      )
    }

    // 验证尺码和颜色是否有效
    const sizes = JSON.parse(product.sizes)
    const colors = JSON.parse(product.colors)

    if (!sizes.includes(data.size)) {
      return NextResponse.json(
        { error: '无效的尺码' },
        { status: 400 }
      )
    }

    if (!colors.includes(data.color)) {
      return NextResponse.json(
        { error: '无效的颜色' },
        { status: 400 }
      )
    }

    // 创建订单
    const order = await prisma.order.create({
      data: {
        userId: user.userId,
        productId: data.productId,
        productName: data.productName,
        size: data.size,
        color: data.color,
        quantity: data.quantity,
      },
      include: {
        product: true,
        user: {
          select: {
            username: true,
            companyName: true,
          },
        },
      },
    })

    return NextResponse.json({ success: true, order })
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

    const orders = await prisma.order.findMany({
      where: { userId: user.userId },
      include: {
        product: true,
      },
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

