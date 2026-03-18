import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request)
    const body = await request.json().catch(() => null)
    const name = String(body?.name || '').trim()
    const description = String(body?.description || '').trim()
    const colors: string[] = Array.isArray(body?.colors) ? body.colors.map((c: any) => String(c).trim()).filter(Boolean) : []
    const sizes: string[] = Array.isArray(body?.sizes) ? body.sizes.map((s: any) => String(s).trim()).filter(Boolean) : []
    const colorImages = (body?.colorImages ?? {}) as Record<string, { filePath: string }[]>
    const sizeChartUrl = body?.sizeChartUrl ? String(body.sizeChartUrl) : null
    const printFrontUrl = body?.printFrontUrl ? String(body.printFrontUrl) : ''
    const printBackUrl = body?.printBackUrl ? String(body.printBackUrl) : ''

    if (!name) {
      return NextResponse.json({ error: '商品名称不能为空' }, { status: 400 })
    }
    if (!description) {
      return NextResponse.json({ error: '商品说明不能为空' }, { status: 400 })
    }
    if (colors.length === 0) {
      return NextResponse.json({ error: '请至少设置一个颜色' }, { status: 400 })
    }
    if (sizes.length === 0) {
      return NextResponse.json({ error: '请至少设置一个尺码' }, { status: 400 })
    }
    if (!printFrontUrl || !printBackUrl) {
      return NextResponse.json({ error: '请上传印图展示用的正面图和背面图' }, { status: 400 })
    }

    const normalizedColorImages: Record<string, string[]> = {}
    for (const key of Object.keys(colorImages)) {
      const k = String(key).trim()
      if (!k) continue
      const imgs = Array.isArray(colorImages[key]) ? colorImages[key] : []
      const paths = imgs
        .map((it: any) => String(it?.filePath || ''))
        .filter((p: string) => !!p)
      if (paths.length > 0) {
        normalizedColorImages[k] = paths
      }
    }

    const created = await prisma.product.create({
      data: {
        name,
        description,
        colors: JSON.stringify(colors),
        sizes: JSON.stringify(sizes),
        imageUrl: null,
        colorImages: Object.keys(normalizedColorImages).length ? JSON.stringify(normalizedColorImages) : null,
        sizeChartUrl,
        printFrontUrl,
        printBackUrl,
      },
    })

    return NextResponse.json({ success: true, product: created })
  } catch (error: any) {
    if (error?.message === '未登录') {
      return NextResponse.json({ error: '请先登录' }, { status: 401 })
    }
    if (error?.message === '需要管理员权限') {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }
    return NextResponse.json({ error: error?.message || '保存失败' }, { status: 500 })
  }
}

