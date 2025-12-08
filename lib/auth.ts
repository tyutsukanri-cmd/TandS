import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'
import { prisma } from './prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production'

export interface TokenPayload {
  userId: number
  username: string
  role: string
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload
  } catch {
    return null
  }
}

export async function getCurrentUser(request: NextRequest): Promise<TokenPayload | null> {
  const token = request.cookies.get('token')?.value
  if (!token) return null
  return verifyToken(token)
}

export async function requireAuth(request: NextRequest): Promise<TokenPayload> {
  const user = await getCurrentUser(request)
  if (!user) {
    throw new Error('未登录')
  }
  return user
}

export async function requireAdmin(request: NextRequest): Promise<TokenPayload> {
  const user = await requireAuth(request)
  if (user.role !== 'admin') {
    throw new Error('需要管理员权限')
  }
  return user
}

