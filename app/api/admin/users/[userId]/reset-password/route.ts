import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    await requireAdmin(request)

    const { password } = await request.json()
    const userId = parseInt(params.userId)

    if (!password || password.trim() === '') {
      return NextResponse.json(
        { error: '密码不能为空' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: '密码长度至少6位' },
        { status: 400 }
      )
    }

    // 生成新的密码哈希
    const passwordHash = await bcrypt.hash(password.trim(), 10)

    // 更新用户密码
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash }
    })

    return NextResponse.json({ message: '密码重置成功' })
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
      { error: error.message || '重置密码失败' },
      { status: 500 }
    )
  }
}
