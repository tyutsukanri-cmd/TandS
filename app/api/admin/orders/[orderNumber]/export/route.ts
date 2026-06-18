import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import * as XLSX from 'xlsx'

export const runtime = 'nodejs'

function encodeFilename(name: string) {
  return encodeURIComponent(name)
}

export async function GET(_request: NextRequest, ctx: { params: { orderNumber: string } }) {
  try {
    await requireAdmin(_request)
    const orderNumber = decodeURIComponent(ctx.params.orderNumber || '')
    if (!orderNumber) return NextResponse.json({ error: '缺少订单号' }, { status: 400 })

    const order = await prisma.orderGroup.findUnique({
      where: { orderNumber },
      include: {
        user: { select: { username: true, companyName: true } },
        items: true,
      },
    })

    if (!order) return NextResponse.json({ error: '订单不存在' }, { status: 404 })

    const rows = order.items.map((it) => ({
      用户名: order.user.username,
      公司名: order.user.companyName || '',
      下单时间: new Date(order.createdAt).toLocaleString('zh-CN'),
      商品名: it.productName,
      颜色: it.color,
      尺码: it.size,
      数量: it.quantity,
      印图位置1: it.image1Pos || '',
      印图位置2: it.image2Pos || '',
      印图位置3: it.image3Pos || '',
      印图位置4: it.image4Pos || '',
      备注: it.note || '',
    }))

    const worksheet = XLSX.utils.json_to_sheet(rows)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, '订单明细')

    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

    const filenameAscii = `${orderNumber}.xlsx`
    const filenameCn = `${orderNumber}.xlsx`
    const encodedFilename = encodeFilename(filenameCn)

    return new NextResponse(excelBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filenameAscii}"; filename*=UTF-8''${encodedFilename}`,
      },
    })
  } catch (error: any) {
    if (error.message === '未登录') return NextResponse.json({ error: '请先登录' }, { status: 401 })
    if (error.message === '需要管理员权限') return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    return NextResponse.json({ error: error.message || '导出失败' }, { status: 500 })
  }
}

