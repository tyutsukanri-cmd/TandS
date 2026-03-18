import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import './globals.css'
import { I18nProvider } from '@/components/I18nProvider'
import Navbar from '@/components/Navbar'

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
    <html lang="ja">
      <body>
        <I18nProvider>
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main style={{ flex: 1 }}>{children}</main>
            {/* 其他店铺链接区域（全站统一，位于版权声明上方） */}
            <section style={{ padding: '0 0 10px' }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div
                  style={{
                    width: '1000px',
                    height: '80px',
                    borderTop: '2px solid #000',
                    borderBottom: '2px solid #000',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '36px',
                    padding: '0 16px',
                    backgroundColor: 'transparent',
                  }}
                >
                  <Link href="/about-us" className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '14px', whiteSpace: 'nowrap' }}>
                    会社案内
                  </Link>

                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '50px', overflow: 'hidden' }}>
                    <Image src="/img/111.jpg" alt="111" width={80} height={80} style={{ height: '60px', width: 'auto' }} />
                    <Image src="/img/222.png" alt="222" width={80} height={80} style={{ height: '60px', width: 'auto' }} />

                    <div style={{ width: '1px', height: '50px', backgroundColor: '#000', margin: '0 36px' }} />

                    <a href="https://jp.mercari.com/shops/profile/eTf4mP8gpkEr6MGWNzsTBj" target="_blank" rel="noopener noreferrer">
                      <Image src="/img/333.png" alt="333" width={140} height={80} style={{ height: '60px', width: 'auto' }} />
                    </a>

                    <a href="https://store.shopping.yahoo.co.jp/ttsj2/?device=pc" target="_blank" rel="noopener noreferrer">
                      <Image src="/img/444.png" alt="444" width={80} height={80} style={{ height: '60px', width: 'auto' }} />
                    </a>
                    <a href="https://www.amazon.co.jp/stores/TS/page/D33C3D64-19EC-4FBC-BA5D-9307DA6C70A1" target="_blank" rel="noopener noreferrer">
                      <Image src="/img/555.png" alt="555" width={80} height={80} style={{ height: '60px', width: 'auto' }} />
                    </a>
                    <a href="https://www.temu.com/mall.html?mall_id=634418219411496" target="_blank" rel="noopener noreferrer">
                      <Image src="/img/666.png" alt="666" width={80} height={80} style={{ height: '60px', width: 'auto' }} />
                    </a>
                  </div>
                </div>
              </div>
            </section>
            <footer
              style={{
                textAlign: 'center',
                padding: '20px',
                backgroundColor: '#f8f9fa',
                borderTop: '1px solid #e9ecef',
                color: '#6c757d',
                fontSize: '14px',
              }}
            >
              © 2026 T&S Fashion. All Rights Reserved.
            </footer>
          </div>
        </I18nProvider>
      </body>
    </html>
  )
}

