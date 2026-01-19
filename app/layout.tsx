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
      <body>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <main style={{ flex: 1 }}>
            {children}
          </main>
          <footer style={{
            textAlign: 'center',
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderTop: '1px solid #e9ecef',
            color: '#6c757d',
            fontSize: '14px'
          }}>
            © 2025 T&S Fashion. All Rights Reserved.
          </footer>
        </div>
      </body>
    </html>
  )
}

