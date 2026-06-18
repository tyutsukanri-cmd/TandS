import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import * as bcrypt from 'bcryptjs'
import { generateToken } from '@/lib/auth'
import { z } from 'zod'

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = loginSchema.parse(body)

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { username: data.username },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'ユーザー名またはパスワードが正しくありません' },
        { status: 401 }
      )
    }

    // 验证密码
    const isValid = await bcrypt.compare(data.password, user.passwordHash)
    if (!isValid) {
      return NextResponse.json(
        { error: 'ユーザー名またはパスワードが正しくありません' },
        { status: 401 }
      )
    }

    // 生成token
    const token = generateToken({
      userId: user.id,
      username: user.username,
      role: user.role,
    })

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    })

    // 设置cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7天
    })

    return response
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '力データの形式が正しくありません', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: error.message || 'ログインに失敗しました' },
      { status: 500 }
    )
  }
}

