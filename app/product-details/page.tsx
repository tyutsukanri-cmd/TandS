'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { allocateDisplayId, createCartId, loadCartItems, saveCartItems } from '@/lib/cart'
import { getCatalogProduct } from '@/lib/cartCatalog'

type ProductTab = {
  id: number
  name: string
  colors: string[]
  // 每个颜色对应一组轮播图
  imagesByColor: Record<string, string[]>
  // 下方 700×300 的展示图
  bottomImage: string
}

// 商品描述数据
const PRODUCT_DESCRIPTIONS: Record<number, string> = {
  0: `■ 素材について
本製品は100％高品質コットン素材を使用し、柔らかく肌触りの良い仕上がりとなっています。
通気性にも優れており、長時間の着用でも快適です。

■ 生地の厚さ
約 6.7ozの生地を採用。
程よい厚みで、透けにくく耐久性にも優れています。

■ デザイン
シンプルで合わせやすいデザイン。
ストリート、カジュアル、日常コーデまで幅広く活躍します。

■ カラー
ブラック
ホワイト
アプリコット
ピンク
グレー
ネイビー
ピンクグラデーション
ブルーグラデーション
グリーングラデーション

ベーシックカラーで様々なスタイルに合わせやすい仕様です。

■ サイズについて
ゆったりとしたシルエットで、男女問わず着用可能です。
製品は手作業で測定しているため、1〜2cm程度の誤差が生じる場合がございます。予めご了承ください。

■ 注意事項
モニター環境により、実際の商品と色味が若干異なる場合がございます。`,
  1: `■ 素材について
本製品は100％高品質コットン素材を使用し、柔らかく肌触りの良い仕上がりとなっています。
通気性にも優れており、長時間の着用でも快適です。

■ 生地の厚さ
約8.2ozの生地を採用。
程よい厚みで、透けにくく耐久性にも優れています。

■ デザイン
シンプルで合わせやすいデザイン。
ストリート、カジュアル、日常コーデまで幅広く活躍します。

■ カラー
ブラック

様々なスタイルに合わせやすい仕様です。

■ サイズについて
ゆったりとしたシルエットで、男女問わず着用可能です。
製品は手作業で測定しているため、1〜2cm程度の誤差が生じる場合がございます。予めご了承ください。

■ 注意事項
モニター環境により、実際の商品と色味が若干異なる場合がございます。`,
  2: `■ 素材について
本製品は100％高品質コットン素材を使用し、柔らかく肌触りの良い仕上がりとなっています。
通気性にも優れており、長時間の着用でも快適です。

■ 生地の厚さ
約7.0ozの生地を採用。
程よい厚みで、透けにくく耐久性にも優れています。

■ デザイン
シンプルで合わせやすいデザイン。
ストリート、カジュアル、日常コーデまで幅広く活躍します。

■ カラー
ブラック
ホワイト

ベーシックカラーで様々なスタイルに合わせやすい仕様です。

■ サイズについて
ゆったりとしたシルエットで、男女問わず着用可能です。
製品は手作業で測定しているため、1〜2cm程度の誤差が生じる場合がございます。予めご了承ください。

■ 注意事項
モニター環境により、実際の商品と色味が若干異なる場合がございます。`,
  3: `■ 素材について
本製品は100％高品質コットン素材を使用し、柔らかく肌触りの良い仕上がりとなっています。
通気性にも優れており、長時間の着用でも快適です。

■ 生地の厚さ
約 8.1ozの生地を採用。
程よい厚みで、透けにくく耐久性にも優れています。

■ デザイン
シンプルで合わせやすいデザイン。
ストリート、カジュアル、日常コーデまで幅広く活躍します。

■ カラー
ブラック
ホワイト
ワインレッド
グレーアプリコット
コーヒーブラウン

ベーシックカラーで様々なスタイルに合わせやすい仕様です。

■ サイズについて
ゆったりとしたシルエットで、男女問わず着用可能です。
製品は手作業で測定しているため、1〜2cm程度の誤差が生じる場合がございます。予めご了承ください。

■ 注意事項
モニター環境により、実際の商品と色味が若干異なる場合がございます。`,
  4: `■ 素材について
本製品は100％高品質スウェット素材を使用し、柔らかく肌触りの良い仕上がりとなっています。
通気性にも優れており、長時間の着用でも快適です。

■ 生地の厚さ
程よい厚みで、透けにくく耐久性にも優れています。

■ デザイン
シンプルで合わせやすいデザイン。
ストリート、カジュアル、日常コーデまで幅広く活躍します。

■ カラー
ブラック
ホワイト

ベーシックカラーで様々なスタイルに合わせやすい仕様です。

■ サイズについて
ゆったりとしたシルエットで、男女問わず着用可能です。
製品は手作業で測定しているため、1〜2cm程度の誤差が生じる場合がございます。予めご了承ください。

■ 注意事項
モニター環境により、実際の商品と色味が若干異なる場合がございます。`,
  5: `■ 素材について
本製品は100％高品質スウェット素材を使用し、柔らかく肌触りの良い仕上がりとなっています。
通気性にも優れており、長時間の着用でも快適です。

■ 生地の厚さ
程よい厚みで、透けにくく耐久性にも優れています。

■ デザイン
シンプルで合わせやすいデザイン。
ストリート、カジュアル、日常コーデまで幅広く活躍します。

■ カラー
ブラック
ホワイト
グレー
ベーシックカラーで様々なスタイルに合わせやすい仕様です。

■ サイズについて
ゆったりとしたシルエットで、男女問わず着用可能です。
製品は手作業で測定しているため、1〜2cm程度の誤差が生じる場合がございます。予めご了承ください。

■ 注意事項
モニター環境により、実際の商品と色味が若干異なる場合がございます。`,
  6: `■ 生地の厚さ
本製品は 12オンスの厚手キャンバス生地 を使用しています。
しっかりとした厚みがあり、耐久性に優れているため長くご使用いただけます。
型崩れしにくく、荷物を入れてもきれいなシルエットを保ちます。

■ カラー
ブラック
ホワイト

用途：通勤、通学、ショッピング、エコバッグ
■ 大容量で実用的
雑誌、タブレット、ノート、買い物用品なども収納できる大容量サイズ。
通勤・通学・ショッピングなど、さまざまなシーンで活躍します。

■デザイン

無駄のないミニマルデザインで、
カジュアル・ストリート・日常コーデなど幅広いスタイルに合わせやすい仕様です。

■ 丈夫な持ち手

持ち手部分はしっかり縫製されており、
重い荷物を入れても安心して持ち運びできます。

■ サイズについて
40*34㎝　（底なし）
製品は手作業で測定しているため、1〜2cm程度の誤差が生じる場合がございます。予めご了承ください。

■ 注意事項
モニター環境により、実際の商品と色味が若干異なる場合がございます。製品は手作業で測定しているため、1〜2cm程度の誤差が生じる場合がございます。`,
  7: `■ 生地の厚さ
本製品は 12オンスの厚手キャンバス生地 を使用しています。
しっかりとした厚みがあり、耐久性に優れているため長くご使用いただけます。
型崩れしにくく、荷物を入れてもきれいなシルエットを保ちます。

■ カラー
ナチュラル

用途：通勤、通学、ショッピング、エコバッグ
■ 大容量で実用的
雑誌、タブレット、ノート、買い物用品なども収納できる大容量サイズ。
通勤・通学・ショッピングなど、さまざまなシーンで活躍します。

■デザイン

無駄のないミニマルデザインで、
カジュアル・ストリート・日常コーデなど幅広いスタイルに合わせやすい仕様です。

■ 丈夫な持ち手

持ち手部分はしっかり縫製されており、
重い荷物を入れても安心して持ち運びできます。

■ サイズについて
30*40㎝*10㎝　（底あり）
製品は手作業で測定しているため、1〜2cm程度の誤差が生じる場合がございます。予めご了承ください。

■ 注意事項
モニター環境により、実際の商品と色味が若干異なる場合がございます。製品は手作業で測定しているため、1〜2cm程度の誤差が生じる場合がございます。`,
}

// 与 page.tsx 中 6 个商品分类对应的选项卡数据
const PRODUCT_TABS: ProductTab[] = [
  {
    id: 0,
    name: 'ベーシックTシャツ',
    colors: ['ホワイト', 'ブラック', 'アプリコット', 'ピンク', 'グレー', 'ネイビー', 'ピンクグラデーション', 'ブルーグラデーション', 'グリーングラデーション'],
    imagesByColor: {
      ホワイト: ['/01duant/wc11.png', '/01duant/wc1.png', '/01duant/wc2.png', '/01duant/wc3.png'],
      ブラック: ['/01duant/bc11.png', '/01duant/bc1.png', '/01duant/bc2.png', '/01duant/bc3.png'],
      アプリコット: ['/01duant/ac11.png', '/01duant/ac1.png', '/01duant/ac2.png', '/01duant/ac3.png'],
      ピンク: ['/01duant/04-1.png', '/01duant/04-2.png', '/01duant/04-3.png', '/01duant/04-4.png'],
      グレー: ['/01duant/05-1.png', '/01duant/05-2.png', '/01duant/05-3.png', '/01duant/05-4.png'],
      ネイビー: ['/01duant/06-1.png', '/01duant/06-2.png', '/01duant/06-3.png', '/01duant/06-4.png'],
      ピンクグラデーション: ['/01duant/07-1.png', '/01duant/07-2.png', '/01duant/07-3.png', '/01duant/07-4.png'],
      ブルーグラデーション: ['/01duant/08-1.png', '/01duant/08-2.png', '/01duant/08-3.png', '/01duant/08-4.png'],
      グリーングラデーション: ['/01duant/09-1.png', '/01duant/09-2.png', '/01duant/09-3.png', '/01duant/09-4.png'],
    },
    bottomImage: '/01duant/dtb1.png',
  },
  {
    id: 1,
    name: 'ウォッシュTシャツ',
    colors: ['ブラック'],
    imagesByColor: {
      ブラック: ['/02shuixi/s1.png', '/02shuixi/s2.jpg', '/02shuixi/s3.jpg', '/02shuixi/s4.jpg'],
    },
    bottomImage: '/02shuixi/b1.png',
  },
  {
    id: 2,
    name: '長袖Tシャツ',
    colors: ['ホワイト', 'ブラック'],
    imagesByColor: {
      ホワイト: ['/03changxiut/wc1.png', '/03changxiut/wc2.jpg', '/03changxiut/wc3.jpg', '/03changxiut/wc4.png'],
      ブラック: ['/03changxiut/bc1.png', '/03changxiut/bc2.jpg', '/03changxiut/bc3.jpg', '/03changxiut/bc4.png'],
    },
    bottomImage: '/03changxiut/b1.png',
  },
  {
    id: 3,
    name: 'オーバーサイズ',
    colors: ['ホワイト', 'ブラック', 'ワインレッド', 'グレーアプリコット', 'コーヒーブラウン'],
    imagesByColor: {
      ホワイト: ['/04obat/o1.png'],
      ブラック: ['/04obat/o2.png'],
      ワインレッド: ['/04obat/o3.png'],
      グレーアプリコット: ['/04obat/o4.png'],
      コーヒーブラウン:['/04obat/o5.png'],
    },
    bottomImage: '/04obat/bbbb1.png',
  },
  {
    id: 4,
    name: 'スウェット',
    colors: ['ホワイト', 'ブラック'],
    imagesByColor: {
      ホワイト: ['/05yuanlingweiyi/ww1.png', '/05yuanlingweiyi/ww2.jpg', '/05yuanlingweiyi/ww3.jpg', '/05yuanlingweiyi/ww4.jpg'],
      ブラック: ['/05yuanlingweiyi/bw1.png', '/05yuanlingweiyi/bw2.jpg', '/05yuanlingweiyi/bw3.jpg', '/05yuanlingweiyi/bw4.jpg'],
    },
    bottomImage: '/05yuanlingweiyi/bbbb1.png',
  },
  {
    id: 5,
    name: 'パ一カ一',
    colors: ['ホワイト', 'ブラック'],
    imagesByColor: {
      ホワイト: ['/06daimaoweiyi/ww1.png', '/06daimaoweiyi/ww2.jpg', '/06daimaoweiyi/ww3.jpg', '/06daimaoweiyi/ww4.jpg'],
      ブラック: ['/06daimaoweiyi/bw1.png', '/06daimaoweiyi/bw2.jpg', '/06daimaoweiyi/bw3.jpg', '/06daimaoweiyi/bw4.jpg'],
    },
    bottomImage: '/06daimaoweiyi/bbbbbb11.png',
  },
  {
    id: 6,
    name: 'トートバッグ①',
    colors: ['ブラック'],
    imagesByColor: {
      ホワイト: ['/07bao1/bai1.png'],
      ブラック: ['/07bao1/hei1.png'],
    },
    bottomImage: '/07bao1/wudi1.jpg',
  },
  {
    id: 7,
    name: 'トートバッグ②',
    colors: ['ナチュラル'],
    imagesByColor: {
      ナチュラル: ['/08bao2/mi1.png'],
    },
    bottomImage: '/08bao2/youdi1.jpg',
  },
]

function ProductDetailsContent() {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab')
  const initialTab = tabParam !== null ? Math.min(Math.max(0, parseInt(tabParam, 10)), PRODUCT_TABS.length - 1) : 0
  const router = useRouter()

  const [activeTab, setActiveTab] = useState(initialTab)
  const [selectedColor, setSelectedColor] = useState('白')
  const [selectedSize, setSelectedSize] = useState('S')
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)

  useEffect(() => {
    const t = tabParam !== null ? Math.min(Math.max(0, parseInt(tabParam, 10)), PRODUCT_TABS.length - 1) : 0
    setActiveTab(t)
  }, [tabParam])

  // 新版布局配置：各商品 001 目录、颜色数（01～NN 文件夹与色卡 inc/01～NN 对应）、尺码表
  const NEW_LAYOUT: Record<number, { base: string; colorCount: number; chima: string }> = {
    0: { base: '/01duant/001', colorCount: 9, chima: '/01duant/001/chima.png' },
    1: { base: '/02shuixi/001', colorCount: 1, chima: '/02shuixi/001/chima.png' },
    2: { base: '/03changxiut/001', colorCount: 2, chima: '/03changxiut/001/chima.png' },
    3: { base: '/04obat/001', colorCount: 5, chima: '/04obat/001/chima.png' },
    4: { base: '/05yuanlingweiyi/001', colorCount: 2, chima: '/05yuanlingweiyi/001/chima.png' },
    5: { base: '/06daimaoweiyi/001', colorCount: 2, chima: '/06daimaoweiyi/001/chima.png' },
    6: { base: '/07bao1/001', colorCount: 1, chima: '/07bao1/001/chima.jpg' },
    7: { base: '/08bao2/001', colorCount: 1, chima: '/08bao2/001/chima.jpg' },
  }
  const layoutCfg = NEW_LAYOUT[activeTab]
  const layoutColors = PRODUCT_TABS[activeTab].colors.slice(0, layoutCfg.colorCount)
  const layoutColorIdx = Math.max(0, layoutColors.indexOf(selectedColor))
  const layoutFolder = String(layoutColorIdx + 1).padStart(2, '0')
  const layoutSizes = getCatalogProduct(activeTab).sizes
  const pad2 = (n: number) => String(n).padStart(2, '0')
  const categoryLabel = activeTab <= 5 ? 'T-SHIRTS' : 'TOTE BAG'

  // 切换商品时，尺寸回到该商品的第一个尺码，颜色回到该商品新布局的第一个颜色
  useEffect(() => {
    const p = getCatalogProduct(activeTab)
    setSelectedSize(p.sizes[0] ?? '')
    const cfg = NEW_LAYOUT[activeTab]
    if (cfg) {
      const cols = PRODUCT_TABS[activeTab].colors.slice(0, cfg.colorCount)
      setSelectedColor((prev) => (cols.includes(prev) ? prev : cols[0]))
    }
  }, [activeTab])

  // 若当前商品不包含当前选中的颜色，则自动切换到第一个颜色
  useEffect(() => {
    const available = PRODUCT_TABS[activeTab]?.colors ?? []
    if (available.length === 0) return
    if (!available.includes(selectedColor)) {
      setSelectedColor(available[0])
    }
  }, [activeTab, selectedColor])

  const product = PRODUCT_TABS[activeTab]

  return (
    <div className="container" style={{ paddingTop: '20px', paddingBottom: '40px' }}>
        {/* 商品选项卡：无边框无底色，纯黑字，选中黑底白字，整体缩小 */}
        <div style={{ marginBottom: '16px' }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
            }}
          >
            {PRODUCT_TABS.map((tab) => (
              <Link key={tab.id} href={`/product-details?tab=${tab.id}`} onClick={() => setActiveTab(tab.id)}>
                <button
                  type="button"
                  style={{
                    padding: '4px 10px',
                    fontSize: '12px',
                    backgroundColor: activeTab === tab.id ? '#000' : 'transparent',
                    color: activeTab === tab.id ? '#fff' : '#000',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  {tab.name}
                </button>
              </Link>
            ))}
          </div>
        </div>

        {layoutCfg && (
          /* 新版布局：1200宽，左6图，右详情 */
          <div style={{ width: '1200px', maxWidth: '100%', margin: '0 auto' }}>
            <style>{`.pdesc-scroll::-webkit-scrollbar{width:6px}.pdesc-scroll::-webkit-scrollbar-track{background:transparent}.pdesc-scroll::-webkit-scrollbar-thumb{background:#000;border-radius:3px}`}</style>
            <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
              {/* 左侧6图：1 2第一行，3 4第二行，5 6第三行 */}
              <div style={{ width: 'calc(50% - 15px)', display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '15px', rowGap: '10px' }}>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <img
                    key={n}
                    src={`${layoutCfg.base}/${layoutFolder}/0${n}.png`}
                    alt={`${product.name} ${selectedColor} ${n}`}
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                ))}
              </div>
              {/* 右侧详情 */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '14px', color: '#333' }}>{pad2(activeTab + 1)} / {pad2(PRODUCT_TABS.length)}</div>
                <div style={{ height: '16px' }} />
                <div style={{ fontSize: '12px', letterSpacing: '2px', color: '#666' }}>{categoryLabel}</div>
                <div style={{ fontSize: '28px', fontWeight: 700, color: '#111', marginTop: '8px', marginBottom: '16px' }}>{product.name}</div>
                {/* 说明区：上下黑线，中间可滚动 */}
                <div style={{ borderTop: '2px solid #000' }} />
                <div
                  className="pdesc-scroll"
                  style={{
                    height: isDescriptionExpanded ? 'auto' : '180px',
                    overflowY: isDescriptionExpanded ? 'visible' : 'auto',
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#000 transparent',
                    padding: '12px 8px 12px 0',
                  }}
                >
                  <div style={{ fontSize: '13px', lineHeight: 1.8, color: '#333', whiteSpace: 'pre-line' }}>
                    {PRODUCT_DESCRIPTIONS[product.id] || '商品説明がありません'}
                  </div>
                </div>
                <div style={{ borderBottom: '2px solid #000' }} />
                <div style={{ textAlign: 'right', marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    style={{ background: 'none', border: 'none', padding: 0, fontSize: '13px', color: '#111', cursor: 'pointer' }}
                  >
                    {isDescriptionExpanded ? '表示を戻す' : '全文を表示'}
                  </button>
                </div>
                {/* 颜色 */}
                <div style={{ fontSize: '12px', color: '#333', marginTop: '20px' }}>カラー</div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  {layoutColors.map((color, idx) => {
                    const sw = String(idx + 1).padStart(2, '0')
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        title={color}
                        style={{
                          padding: 0,
                          border: selectedColor === color ? '2px solid #000' : '2px solid transparent',
                          background: 'none',
                          cursor: 'pointer',
                          width: '52px',
                          height: '52px',
                        }}
                      >
                        <img src={`${layoutCfg.base}/inc/${sw}.png`} alt={color} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      </button>
                    )
                  })}
                </div>
                <div style={{ fontSize: '13px', color: '#111', marginTop: '8px' }}>{selectedColor}</div>
                {/* 尺寸 */}
                <div style={{ fontSize: '12px', color: '#333', marginTop: '20px' }}>サイズ</div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  {layoutSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      style={{
                        minWidth: '44px',
                        padding: '6px 10px',
                        fontSize: '13px',
                        backgroundColor: selectedSize === size ? '#000' : '#fff',
                        color: selectedSize === size ? '#fff' : '#111',
                        border: '1px solid #000',
                        borderRadius: '2px',
                        cursor: 'pointer',
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {/* 尺码表 */}
                <img src={layoutCfg.chima} alt="サイズ表" style={{ width: '100%', height: 'auto', display: 'block', marginTop: '16px' }} />
                {/* 加入购物车 */}
                <button
                  type="button"
                  onClick={() => {
                    ;(async () => {
                      const catalogProduct = getCatalogProduct(activeTab)
                      const color = catalogProduct.colors.includes(selectedColor) ? selectedColor : catalogProduct.colors[0]
                      const size = catalogProduct.sizes.includes(selectedSize) ? selectedSize : catalogProduct.sizes[0] ?? ''

                      let username = 'guest'
                      try {
                        const r = await fetch('/api/user/me')
                        if (r.ok) {
                          const data = await r.json()
                          username = data?.user?.username ?? 'guest'
                        }
                      } catch {}

                      const displayId = allocateDisplayId(username)
                      const nextItems = loadCartItems()
                      nextItems.push({
                        cartId: createCartId(),
                        displayId,
                        productTabId: activeTab,
                        color,
                        size,
                        quantity: 1,
                        positions: { p1: '', p2: '', p3: '', p4: '' },
                        note: '',
                      })
                      saveCartItems(nextItems)
                      router.push('/my-cart')
                    })()
                  }}
                  style={{
                    width: '100%',
                    marginTop: '16px',
                    padding: '12px 0',
                    fontSize: '15px',
                    backgroundColor: '#000',
                    color: '#fff',
                    border: '1px solid #000',
                    borderRadius: '2px',
                    cursor: 'pointer',
                  }}
                >
                  カートに追加
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
  )
}

export default function ProductDetailsPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '40px', textAlign: 'center' }}>読み込み中…</div>}>
      <ProductDetailsContent />
    </Suspense>
  )
}
