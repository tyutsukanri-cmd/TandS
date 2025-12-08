import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '中通商事',
  description: '服装展示、用户登录注册、下单管理平台',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}

