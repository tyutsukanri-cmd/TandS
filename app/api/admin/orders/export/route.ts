import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import * as XLSX from 'xlsx'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)

    const orders = await prisma.orderGroup.findMany({
      include: {
        user: { select: { username: true, companyName: true } },
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    // 准备Excel数据
    const excelData = orders.flatMap((order: any) =>
      (order.items || []).map((it: any) => ({
        订单名: order.orderNumber,
        用户名: order.user.username,
        公司名: order.user.companyName || '',
        下单时间: new Date(order.createdAt).toLocaleString('zh-CN'),
        商品名: it.productName,
        尺码: it.size,
        颜色: it.color,
        数量: it.quantity,
        印图位置1: it.image1Pos || '',
        印图位置2: it.image2Pos || '',
        印图位置3: it.image3Pos || '',
        印图位置4: it.image4Pos || '',
        备注: it.note || '',
      }))
    )

    // 创建工作簿
    const worksheet = XLSX.utils.json_to_sheet(excelData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, '订单列表')

    // 生成Excel文件
    const excelBuffer = XLSX.write(workbook, {
      type: 'buffer',
      bookType: 'xlsx',
    })

    // 生成文件名（使用英文避免编码问题）
    const dateStr = new Date().toISOString().split('T')[0]
    const filename = `orders_${dateStr}.xlsx`
    const encodedFilename = encodeURIComponent(`订单列表_${dateStr}.xlsx`)

    // 返回文件（使用 RFC 5987 标准支持中文文件名）
    return new NextResponse(excelBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"; filename*=UTF-8''${encodedFilename}`,
      },
    })
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
      { error: error.message || '导出失败' },
      { status: 500 }
    )
  }
}

