import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json(
        { error: '无效的商品ID' },
        { status: 400 }
      )
    }

    const product = await prisma.product.findUnique({
      where: { id },
    })

    if (!product) {
      return NextResponse.json(
        { error: '商品不存在' },
        { status: 404 }
      )
    }

    // 解析JSON字符串
    const productWithParsedData = {
      ...product,
      sizes: JSON.parse(product.sizes),
      colors: JSON.parse(product.colors),
    }

    return NextResponse.json(productWithParsedData)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || '获取商品详情失败' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 验证管理员权限
    await requireAdmin(request)

    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json(
        { error: '无效的商品ID' },
        { status: 400 }
      )
    }

    // 检查商品是否存在
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        orders: true,
      },
    })

    if (!product) {
      return NextResponse.json(
        { error: '商品不存在' },
        { status: 404 }
      )
    }

    // 检查是否有关联订单
    if (product.orders.length > 0) {
      return NextResponse.json(
        { error: `无法删除：该商品有 ${product.orders.length} 个关联订单，请先处理订单` },
        { status: 400 }
      )
    }

    // 删除商品
    await prisma.product.delete({
      where: { id },
    })

    return NextResponse.json({ message: '商品已删除' })
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
      { error: error.message || '删除商品失败' },
      { status: 500 }
    )
  }
}

