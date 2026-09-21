'use client'

import Link from 'next/link'

export default function Home() {

  return (
    <>
      {/* 菜单下方大图：1200px框居中，左侧40%填色#EAE7E6，右侧60%放图 */}
      <section
        style={{
          width: '100%',
          backgroundColor: '#fff',
          marginTop: '-16px',
          marginBottom: '0',
        }}
      >
        <div
          style={{
            width: '1200px',
            maxWidth: '100%',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'stretch',
          }}
        >
          <div
            style={{
              width: '40%',
              backgroundColor: '#EAE7E6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px',
            }}
          >
            <div>
              <div style={{ fontSize: '14px', letterSpacing: '2px', color: '#333', marginBottom: '12px' }}>
                T&S FASHION
              </div>
              <div style={{ fontSize: '52px', fontWeight: 400, lineHeight: 1.15, color: '#111', fontFamily: "'Bodoni MT', Didot, 'Didot LT STD', 'Playfair Display', Georgia, serif", letterSpacing: '1px' }}>
                WEAR
                <br />
                YOUR
                <br />
                STORY
              </div>
              <div style={{ marginTop: '24px', fontSize: '14px', color: '#333' }}>
                ご自身のデザインと好きな絵を身にまとう.
              </div>
              <Link
                href="/product-details"
                style={{
                  display: 'inline-block',
                  marginTop: '24px',
                  fontSize: '14px',
                  color: '#111',
                  borderBottom: '1px solid #111',
                  paddingBottom: '4px',
                }}
              >
                商品をすべて見る →
              </Link>
            </div>
          </div>
          <div style={{ width: '60%' }}>
            <img
              src="/img/1up.png"
              alt="TandS 首页形象图"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
        </div>
      </section>

      {/* 下方1200宽 4x3 共12个正方形格子：上左右各留6px余白 */}
      <section style={{ width: '100%', backgroundColor: '#fff' }}>
        <div
          style={{
            width: '1200px',
            maxWidth: '100%',
            margin: '0 auto',
            padding: '6px 6px 0',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '6px',
            }}
          >
            {/* 1号：图 */}
            <div style={{ aspectRatio: '1 / 1', overflow: 'hidden', backgroundColor: '#fff' }}>
              <img src="/img/0-6.png" alt="1" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            {/* 2号：文 背景#F1F4F3 */}
            <div style={{ aspectRatio: '1 / 1', overflow: 'hidden', backgroundColor: '#F1F4F3', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
              <div>
                <div style={{ fontSize: '14px', color: '#333', marginBottom: '8px' }}>01</div>
                <div style={{ height: '16px' }} />
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#111', marginBottom: '8px' }}>ベーシックTシャツ</div>
                <div style={{ fontSize: '12px', color: '#333', lineHeight: 1.7 }}>
                  100％高品質コットン
                  <br />
                  柔らかく肌触りの良い仕上がりとなっています
                </div>
                <div style={{ height: '16px' }} />
                <Link href="/product-details?tab=0" style={{ fontSize: '13px', color: '#111', borderBottom: '1px solid #111', paddingBottom: '2px' }}>
                  商品をすべて見る →
                </Link>
              </div>
            </div>
            {/* 3号：图 */}
            <div style={{ aspectRatio: '1 / 1', overflow: 'hidden', backgroundColor: '#fff' }}>
              <img src="/img/0-1.png" alt="3" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            {/* 4号：文 背景#D3D3D7 */}
            <div style={{ aspectRatio: '1 / 1', overflow: 'hidden', backgroundColor: '#D3D3D7', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
              <div>
                <div style={{ fontSize: '14px', color: '#333', marginBottom: '8px' }}>02</div>
                <div style={{ height: '16px' }} />
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#111', marginBottom: '8px' }}>ウォッシュTシャツ</div>
                <div style={{ fontSize: '12px', color: '#333', lineHeight: 1.7 }}>
                  100％高品質コットン
                  <br />
                  通気性にも優れており、長時間の着用でも快適です
                </div>
                <div style={{ height: '16px' }} />
                <Link href="/product-details?tab=1" style={{ fontSize: '13px', color: '#111', borderBottom: '1px solid #111', paddingBottom: '2px' }}>
                  商品をすべて見る →
                </Link>
              </div>
            </div>
            {/* 5号：文 背景#F1F4F3 */}
            <div style={{ aspectRatio: '1 / 1', overflow: 'hidden', backgroundColor: '#F1F4F3', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
              <div>
                <div style={{ fontSize: '14px', color: '#333', marginBottom: '8px' }}>03</div>
                <div style={{ height: '16px' }} />
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#111', marginBottom: '8px' }}>長袖Tシャツ</div>
                <div style={{ fontSize: '12px', color: '#333', lineHeight: 1.7 }}>
                  100％高品質コットン
                  <br />
                  柔らかく肌触りの良い仕上がりとなっています
                </div>
                <div style={{ height: '16px' }} />
                <Link href="/product-details?tab=2" style={{ fontSize: '13px', color: '#111', borderBottom: '1px solid #111', paddingBottom: '2px' }}>
                  商品をすべて見る →
                </Link>
              </div>
            </div>
            {/* 6号：图 */}
            <div style={{ aspectRatio: '1 / 1', overflow: 'hidden', backgroundColor: '#fff' }}>
              <img src="/img/0-5.png" alt="6" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            {/* 7号：文 背景#D3D3D7 */}
            <div style={{ aspectRatio: '1 / 1', overflow: 'hidden', backgroundColor: '#D3D3D7', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
              <div>
                <div style={{ fontSize: '14px', color: '#333', marginBottom: '8px' }}>04</div>
                <div style={{ height: '16px' }} />
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#111', marginBottom: '8px' }}>オーバーサイズ</div>
                <div style={{ fontSize: '12px', color: '#333', lineHeight: 1.7 }}>
                  100％高品質コットン
                  <br />
                  程よい厚みで、透けにくく耐久性にも優れています
                </div>
                <div style={{ height: '16px' }} />
                <Link href="/product-details?tab=3" style={{ fontSize: '13px', color: '#111', borderBottom: '1px solid #111', paddingBottom: '2px' }}>
                  商品をすべて見る →
                </Link>
              </div>
            </div>
            {/* 8号：图 */}
            <div style={{ aspectRatio: '1 / 1', overflow: 'hidden', backgroundColor: '#fff' }}>
              <img src="/img/0-2.png" alt="8" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            {/* 9号：图 */}
            <div style={{ aspectRatio: '1 / 1', overflow: 'hidden', backgroundColor: '#fff' }}>
              <img src="/img/0-4.png" alt="9" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            {/* 10号：文 背景#F1F4F3 */}
            <div style={{ aspectRatio: '1 / 1', overflow: 'hidden', backgroundColor: '#F1F4F3', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
              <div>
                <div style={{ fontSize: '14px', color: '#333', marginBottom: '8px' }}>05</div>
                <div style={{ height: '16px' }} />
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#111', marginBottom: '8px' }}>スウェット</div>
                <div style={{ fontSize: '12px', color: '#333', lineHeight: 1.7 }}>
                  本製品は100％高品質スウェット素材を使用し
                  <br />
                  柔らかく肌触りの良い仕上がりとなっています
                </div>
                <div style={{ height: '16px' }} />
                <Link href="/product-details?tab=5" style={{ fontSize: '13px', color: '#111', borderBottom: '1px solid #111', paddingBottom: '2px' }}>
                  商品をすべて見る →
                </Link>
              </div>
            </div>
            {/* 11号：图 */}
            <div style={{ aspectRatio: '1 / 1', overflow: 'hidden', backgroundColor: '#fff' }}>
              <img src="/img/0-3.png" alt="11" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            {/* 12号：文 背景#D3D3D7 */}
            <div style={{ aspectRatio: '1 / 1', overflow: 'hidden', backgroundColor: '#D3D3D7', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
              <div>
                <div style={{ fontSize: '14px', color: '#333', marginBottom: '8px' }}>06</div>
                <div style={{ height: '16px' }} />
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#111', marginBottom: '8px' }}>パーカー</div>
                <div style={{ fontSize: '12px', color: '#333', lineHeight: 1.7 }}>
                  本製品は100％高品質スウェット素材を使用し
                  <br />
                  柔らかく肌触りの良い仕上がりとなっています
                </div>
                <div style={{ height: '16px' }} />
                <Link href="/product-details?tab=6" style={{ fontSize: '13px', color: '#111', borderBottom: '1px solid #111', paddingBottom: '2px' }}>
                  商品をすべて見る →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 最下方：1200宽，2down.png平铺整框，文字直接压在背景图左侧 */}
      <section style={{ width: '100%', backgroundColor: '#fff', paddingBottom: '40px' }}>
        <div
          style={{
            width: '1200px',
            maxWidth: '100%',
            margin: '0 auto',
            padding: '6px 6px 6px',
          }}
        >
          <div style={{ position: 'relative', overflow: 'hidden', height: '146px', backgroundColor: '#000' }}>
            <img
              src="/img/2down.png"
              alt="custom wholesale"
              style={{ position: 'absolute', top: 0, right: 0, height: '100%', width: 'auto', maxWidth: 'none', display: 'block' }}
            />
            <div
              style={{
                position: 'relative',
                zIndex: 1,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                height: '146px',
                padding: '10px 0 10px 8%',
              }}
            >
              <div>
                <div style={{ fontSize: '18px', fontWeight: 700, lineHeight: 1.2, marginBottom: '6px', whiteSpace: 'nowrap' }}>
                  CUSTOM & WHOLESALE
                </div>
                <div style={{ fontSize: '11px', lineHeight: 1.6 }}>
                  オリジナルデザイン 大量注文も
                  <br />
                  お気軽にご相談ください。
                </div>
                <div style={{ height: '6px' }} />
                <Link
                  href="/about-us#contact-bottom"
                  style={{ fontSize: '11px', color: '#fff', borderBottom: '1px solid #fff', paddingBottom: '2px' }}
                >
                  お問い合わせ →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
