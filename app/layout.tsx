import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import './globals.css'
import { I18nProvider } from '@/components/I18nProvider'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'オリジナルTシャツ　T＆S',
  description: 'アパレル商品の展示・受注管理システム',
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
            <section style={{ padding: '0 0 10px', backgroundColor: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'center', backgroundColor: '#fff' }}>
                <div
                  className="r-footer-bar"
                  style={{
                    width: '1200px',
                    maxWidth: '100%',
                    height: '80px',
                    borderBottom: '2px solid #000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 16px',
                    backgroundColor: '#fff',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginLeft: '20px' }}>
                    <Image src="/img/111.jpg" alt="111" width={80} height={50} style={{ height: '50px', width: 'auto' }} />
                    <Image src="/img/222.png" alt="222" width={80} height={50} style={{ height: '50px', width: 'auto' }} />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <a href="https://jp.mercari.com/shops/profile/eTf4mP8gpkEr6MGWNzsTBj" target="_blank" rel="noopener noreferrer">
                      <Image src="/img/333.png" alt="333" width={140} height={50} style={{ height: '50px', width: 'auto' }} />
                    </a>

                    <a href="https://store.shopping.yahoo.co.jp/ttsj2/?device=pc" target="_blank" rel="noopener noreferrer">
                      <Image src="/img/444.png" alt="444" width={80} height={50} style={{ height: '50px', width: 'auto' }} />
                    </a>
                    <a href="https://www.amazon.co.jp/stores/TS/page/D33C3D64-19EC-4FBC-BA5D-9307DA6C70A1" target="_blank" rel="noopener noreferrer">
                      <Image src="/img/555.png" alt="555" width={80} height={50} style={{ height: '50px', width: 'auto' }} />
                    </a>
                    <a href="https://www.temu.com/mall.html?mall_id=634418219411496" target="_blank" rel="noopener noreferrer">
                      <Image src="/img/666.png" alt="666" width={80} height={50} style={{ height: '50px', width: 'auto' }} />
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

