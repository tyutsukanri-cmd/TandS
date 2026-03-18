import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export const runtime = 'nodejs'

const schema = z.object({
  lastName: z.string().trim().min(1),
  firstName: z.string().trim().min(1),
  email: z.string().trim().email(),
  content: z.string().trim().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = schema.parse(body)

    const msg = await prisma.contactMessage.create({
      data: {
        lastName: data.lastName,
        firstName: data.firstName,
        email: data.email,
        content: data.content,
      },
    })

    return NextResponse.json({ success: true, id: msg.id })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: '输入数据格式错误', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: error.message || '提交失败' }, { status: 500 })
  }
}

