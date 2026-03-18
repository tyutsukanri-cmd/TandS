'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
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
35*35㎝　（底なし）
製品は手作業で測定しているため、1〜2cm程度の誤差が生じる場合がございます。予めご了承ください。

■ 注意事項
モニター環境により、実際の商品と色味が若干異なる場合がございます。製品は手作業で測定しているため、1〜2cm程度の誤差が生じる場合がございます。`,
}

// 与 page.tsx 中 6 个商品分类对应的选项卡数据
const PRODUCT_TABS: ProductTab[] = [
  {
    id: 0,
    name: 'Tシャツ',
    colors: ['ホワイト', 'ブラック', 'アプリコット'],
    imagesByColor: {
      ホワイト: ['/01duant/wc11.png', '/01duant/wc1.png', '/01duant/wc2.png', '/01duant/wc3.png'],
      ブラック: ['/01duant/bc11.png', '/01duant/bc1.png', '/01duant/bc2.png', '/01duant/bc3.png'],
      アプリコット: ['/01duant/ac11.png', '/01duant/ac1.png', '/01duant/ac2.png', '/01duant/ac3.png'],
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
    colors: ['ホワイト', 'ブラック'],
    imagesByColor: {
      ホワイト: ['/07bao1/bai1.png'],
      ブラック: ['/07bao1/hei1.png'],
    },
    bottomImage: '/07bao1/wudi1.jpg',
  },
]

function ProductDetailsContent() {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab')
  const initialTab = tabParam !== null ? Math.min(Math.max(0, parseInt(tabParam, 10)), PRODUCT_TABS.length - 1) : 0
  const router = useRouter()

  const [activeTab, setActiveTab] = useState(initialTab)
  const [selectedColor, setSelectedColor] = useState('白')
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)

  useEffect(() => {
    const t = tabParam !== null ? Math.min(Math.max(0, parseInt(tabParam, 10)), PRODUCT_TABS.length - 1) : 0
    setActiveTab(t)
  }, [tabParam])

  // 若当前商品不包含当前选中的颜色，则自动切换到第一个颜色
  useEffect(() => {
    const available = PRODUCT_TABS[activeTab]?.colors ?? []
    if (available.length === 0) return
    if (!available.includes(selectedColor)) {
      setSelectedColor(available[0])
    }
  }, [activeTab, selectedColor])

  const product = PRODUCT_TABS[activeTab]
  const carouselImages = product.imagesByColor[selectedColor] ?? product.imagesByColor['白'] ?? []
  const safeCarouselIndex = carouselImages.length > 0 ? Math.min(carouselIndex, carouselImages.length - 1) : 0
  const mainImageUrl = carouselImages[safeCarouselIndex] || ''
  const bottomImageUrl = product.bottomImage || ''

  // 切换商品/颜色时，轮播回到第一张
  useEffect(() => {
    setCarouselIndex(0)
  }, [activeTab, selectedColor])

  // 5 秒自动轮播（仅当该颜色下有多张图）
  useEffect(() => {
    if (carouselImages.length <= 1) return
    const t = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % carouselImages.length)
    }, 5000)
    return () => clearInterval(t)
  }, [carouselImages.length])

  return (
    <div className="container" style={{ paddingTop: '20px', paddingBottom: '40px' }}>
        <h1 style={{ marginBottom: '24px', fontSize: '28px' }}>商品詳細</h1>

        {/* 下沉式选项卡（默认显示） */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#333', marginBottom: '10px' }}>商品を選択してください</div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              padding: '16px',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              backgroundColor: '#fafafa',
            }}
          >
            {PRODUCT_TABS.map((tab) => (
              <Link key={tab.id} href={`/product-details?tab=${tab.id}`} onClick={() => setActiveTab(tab.id)}>
                <button
                  type="button"
                  className="btn"
                  style={{
                    padding: '8px 16px',
                    backgroundColor: activeTab === tab.id ? '#f4a261' : '#fff',
                    color: activeTab === tab.id ? '#fff' : '#333',
                    border: '1px solid #ddd',
                  }}
                >
                  {tab.name}
                </button>
              </Link>
            ))}
          </div>
        </div>

        {/* 商品名 */}
        <h2 style={{ marginBottom: '20px', fontSize: '22px' }}>{product.name}</h2>

        {/* 1000×600 主框（无底色） */}
        <div
          style={{
            width: '1000px',
            height: '500px',
            marginBottom: '24px',
            display: 'flex',
            gap: '24px',
          }}
        >
          {/* 左侧 300×600 图框（短袖T恤：按颜色轮播 + 圆点控制） */}
          <div
            style={{
              width: '300px',
              height: '500px',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f8f8f8',
              position: 'relative',
            }}
          >
            {mainImageUrl ? (
              <Image src={mainImageUrl} alt={`${product.name} ${selectedColor}`} width={280} height={460} style={{ objectFit: 'contain' }} />
            ) : (
              <span style={{ color: '#999', fontSize: '14px' }}>图片链接占位（后续补充）</span>
            )}

            {/* 圆点（仅当该颜色下 >=2 张图时显示） */}
            {carouselImages.length >= 2 && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: 0,
                  right: 0,
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                {carouselImages.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCarouselIndex(idx)}
                    aria-label={`切换到第 ${idx + 1} 张`}
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '999px',
                      border: '1px solid rgba(0,0,0,0.25)',
                      backgroundColor: idx === safeCarouselIndex ? '#f4a261' : 'rgba(255,255,255,0.85)',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* 右侧区域 */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* 商品描述 约 276px（与颜色150+加入购物车150+间距共600） */}
            <div
              style={{
                height: isDescriptionExpanded ? 'auto' : '276px',
                padding: '16px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#fff',
                position: 'relative',
                zIndex: isDescriptionExpanded ? 100 : 1,
                boxShadow: isDescriptionExpanded ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
              }}
            >
              {/* 标题 */}
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#333',
                  marginBottom: '12px',
                }}
              >
                商品説明
              </div>
              
              {/* 内容区域 */}
              <div
                style={{
                  height: isDescriptionExpanded ? 'auto' : '200px',
                  overflowY: isDescriptionExpanded ? 'visible' : 'auto',
                }}
              >
                <div style={{ fontSize: '14px', lineHeight: 1.6, color: '#333', whiteSpace: 'pre-line' }}>
                  {PRODUCT_DESCRIPTIONS[product.id] || '商品説明がありません'}
                </div>
              </div>
              
              {/* 展开/收起按钮 - 始终固定在底部 */}
              {PRODUCT_DESCRIPTIONS[product.id] && (
                <div style={{ textAlign: 'center', marginTop: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    style={{
                      padding: '6px 16px',
                      backgroundColor: '#f4a261',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                  >
                    {isDescriptionExpanded ? '表示を戻す' : '全文を表示'}
                  </button>
                </div>
              )}
            </div>

            {/* 颜色选择 150px */}
            <div
              style={{
                height: '150px',
                padding: '16px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ fontSize: '14px', fontWeight: 600 }}>カラー</div>
              <div style={{ display: 'flex', gap: '12px' }}>
                {product.colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    style={{
                      padding: '8px 20px',
                      border: `2px solid ${selectedColor === color ? '#f4a261' : '#ddd'}`,
                      borderRadius: '6px',
                      backgroundColor: selectedColor === color ? 'rgba(244,162,97,0.2)' : '#fff',
                      cursor: 'pointer',
                      fontSize: product.id === 3 ? '12px' : '14px',
                    }}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* 加入购物车 150px */}
            <div
              style={{
                height: '150px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  ;(async () => {
                    const catalogProduct = getCatalogProduct(activeTab)
                    const color = catalogProduct.colors.includes(selectedColor) ? selectedColor : catalogProduct.colors[0]
                    const size = catalogProduct.sizes[0] ?? ''

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
                style={{ padding: '12px 32px', fontSize: '16px' }}
              >
                カートに追加
              </button>
            </div>
          </div>
        </div>

        {/* 下方居中 700×300 框 */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <div
            style={{
              width: '700px',
              height: '300px',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              overflow: 'hidden',
              position: 'relative',
              backgroundColor: '#f8f8f8',
            }}
          >
            {bottomImageUrl ? (
              <Image src={bottomImageUrl} alt={`${product.name} 展示图`} fill style={{ objectFit: 'fill' }} />
            ) : (
              <span style={{ color: '#999', fontSize: '14px' }}>图片链接占位（根据选项卡选择商品变化，后续补充）</span>
            )}
          </div>
        </div>
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
