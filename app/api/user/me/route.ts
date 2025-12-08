import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      )
    }
    return NextResponse.json({ user })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || '获取用户信息失败' },
      { status: 500 }
    )
  }
}

