import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import * as bcrypt from 'bcryptjs'
import { generateToken } from '@/lib/auth'
import { z } from 'zod'

const registerSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  companyName: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = registerSchema.parse(body)

    // 检查用户名是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { username: data.username },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'ユーザー名は既に存在します' },
        { status: 400 }
      )
    }

    // 加密密码
    const passwordHash = await bcrypt.hash(data.password, 10)

    // 创建用户
    const user = await prisma.user.create({
      data: {
        username: data.username,
        passwordHash,
        phone: data.phone,
        email: data.email,
        companyName: data.companyName,
        role: 'user',
      },
    })

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
        { error: '入力データの形式が正しくありません', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: error.message || '登録に失敗しました' },
      { status: 500 }
    )
  }
}

