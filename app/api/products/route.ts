import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    })

    // 解析JSON字符串
    const productsWithParsedData = products.map((product) => ({
      ...product,
      sizes: JSON.parse(product.sizes),
      colors: JSON.parse(product.colors),
      colorImages: product.colorImages ? JSON.parse(product.colorImages) : {},
    }))

    return NextResponse.json(productsWithParsedData)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || '获取商品列表失败' },
      { status: 500 }
    )
  }
}

