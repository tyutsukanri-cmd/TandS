'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function Home() {

  return (
    <>
      {/* 全宽 hero 图片 + 标题文案 */}
      <section
        style={{
          position: 'relative',
          width: '100%',
          height: '420px',
          marginTop: '-16px',
          marginBottom: '40px',
          overflow: 'hidden',
        }}
      >
        <Image
          src="/img/cullen-jones-PQi3Zp1qksc-unsplash.jpg"
          alt="TandS 首页形象图"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div className="container">
            <div
              style={{
                maxWidth: '900px',
                backgroundColor: 'rgba(0, 0, 0, 0.45)',
                padding: '40px 50px',
                borderRadius: '12px',
                textAlign: 'center',
              }}
            >
              <h1
                style={{
                  fontSize: '42px',
                  marginBottom: '24px',
                  color: '#ffffff',
                }}
              >
                ご自身のデザインと好きな絵を身にまとう
              </h1>
              <p
                style={{
                  fontSize: '20px',
                  color: '#f1f3f4',
                  lineHeight: 1.7,
                  marginBottom: '30px',
                }}
              >
                大量ご注文の場合はご相談に応じます。
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>

              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container" style={{ paddingBottom: '40px' }}>
        <section style={{ marginBottom: '40px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(1000px, 1000px))',
              gap: '20px',
              justifyContent: 'center',
            }}
          >
            {(() => {
              type Side = 'left' | 'right'
              type NormalBlock = {
                id: string
                variant: 'normal'
                title: string
                desc: string
                textSide: Side
                images: string[]
                showButton: boolean
                styles: {
                  card: { width: number; height: number; padding: number; gap: number }
                  text: { width: number; gap: number }
                  images: { gap: number }
                  imageTile: { borderRadius: number }
                  button: { padding: string; fontSize: string }
                }
              }
              type ImagesOnlyBlock = {
                id: string
                variant: 'imagesOnly'
                images: string[]
                styles: {
                  card: { width: number; height: number; borderSize: number }
                  images: { gap: number }
                }
              }
              type Block = NormalBlock | ImagesOnlyBlock

              const blocks: Block[] = [
                {
                  id: 'block-1',
                  variant: 'normal',
                  title: 'Tシャツ',
                  desc: '綿100％　肌にやさしい素材',
                  textSide: 'left',
                  images: ['/images/wdt1.png', '/images/Bdt1.png', '/images/adt1.png'],
                  showButton: true,
                  styles: {
                    card: { width: 1000, height: 300, padding: 16, gap: 16 },
                    text: { width: 150, gap: 10 },
                    images: { gap: 12 },
                    imageTile: { borderRadius: 8 },
                    button: { padding: '8px 12px', fontSize: '14px' },
                  },
                },
                {
                  id: 'block-2',
                  variant: 'normal',
                  title: 'ウォッシュTシャツ',
                  desc: '綿100％・ウォッシュ加工',
                  textSide: 'right',
                  images: ['/images/bsdt1.png', '/images/bsdt2.png'],
                  showButton: true,
                  styles: {
                    card: { width: 1000, height: 300, padding: 16, gap: 16 },
                    text: { width: 150, gap: 10 },
                    images: { gap: 12 },
                    imageTile: { borderRadius: 8 },
                    button: { padding: '8px 12px', fontSize: '14px' },
                  },
                },
                {
                  id: 'block-3',
                  variant: 'normal',
                  title: '長袖Tシャツ',
                  desc: '綿100％　肌にやさしい素材',
                  textSide: 'left',
                  images: ['/images/03wct1.png', '/images/03bct1.png'],
                  showButton: true,
                  styles: {
                    card: { width: 1000, height: 300, padding: 16, gap: 16 },
                    text: { width: 150, gap: 10 },
                    images: { gap: 12 },
                    imageTile: { borderRadius: 8 },
                    button: { padding: '8px 12px', fontSize: '14px' },
                  },
                },
                {
                  id: 'block-4',
                  variant: 'normal',
                  title: 'オーバーサイズ',
                  desc: '綿100％・ウォッシュ加工',
                  textSide: 'right',
                  images: ['/images/04wot1.png', '/images/04bot1.png'],
                  showButton: true,
                  styles: {
                    card: { width: 1000, height: 300, padding: 16, gap: 16 },
                    text: { width: 150, gap: 10 },
                    images: { gap: 12 },
                    imageTile: { borderRadius: 8 },
                    button: { padding: '8px 12px', fontSize: '14px' },
                  },
                },
                {
                  id: 'block-5',
                  variant: 'imagesOnly',
                  images: ['/images/z9ss1.png', '/images/z9ss2.png', '/images/z9ss3.png'],
                  styles: {
                    card: { width: 1000, height: 300, borderSize: 2 },
                    images: { gap: 0 },
                  },
                },
                {
                  id: 'block-6',
                  variant: 'normal',
                  title: 'スウェット',
                  desc: '綿混素材・快適でお手入れ簡単',
                  textSide: 'left',
                  images: ['/images/05ww1.png', '/images/05bw1.png'],
                  showButton: true,
                  styles: {
                    card: { width: 1000, height: 300, padding: 16, gap: 16 },
                    text: { width: 150, gap: 10 },
                    images: { gap: 12 },
                    imageTile: { borderRadius: 8 },
                    button: { padding: '8px 12px', fontSize: '14px' },
                  },
                },
                {
                  id: 'block-7',
                  variant: 'normal',
                  title: 'パーカー',
                  desc: '綿混素材・快適でお手入れ簡単',
                  textSide: 'right',
                  images: ['/images/06wwm1.png', '/images/06bwm1.png'],
                  showButton: true,
                  styles: {
                    card: { width: 1000, height: 300, padding: 16, gap: 16 },
                    text: { width: 150, gap: 10 },
                    images: { gap: 12 },
                    imageTile: { borderRadius: 8 },
                    button: { padding: '8px 12px', fontSize: '14px' },
                  },
                },
              ]

              return blocks.map((item) => {
                if (item.variant === 'imagesOnly') {
                  return (
                    <div
                      key={item.id}
                      className="card"
                      style={{
                        width: item.styles.card.width,
                        height: item.styles.card.height,
                        padding: 0,
                        display: 'flex',
                        gap: item.styles.images.gap,
                        borderTop: `${item.styles.card.borderSize}px solid #000`,
                        borderBottom: `${item.styles.card.borderSize}px solid #000`,
                        borderRadius: 0,
                        overflow: 'hidden',
                      }}
                    >
                      {item.images.map((src) => (
                        <div
                          key={src}
                          style={{
                            flex: 1,
                            position: 'relative',
                            
                          }}
                        >
                          <Image src={src} alt="展示图" fill style={{ objectFit: 'contain' }} />
                        </div>
                      ))}
                    </div>
                  )
                }

                const textBlock = (
                  <div
                    style={{
                      width: item.styles.text.width,
                      flexShrink: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      gap: item.styles.text.gap,
                    }}
                  >
                    <div>
                      <h3 style={{ fontSize: '18px', color: '#202124', marginBottom: '6px' }}>{item.title}</h3>
                      <p style={{ fontSize: '14px', color: '#5f6368' }}>{item.desc}</p>
                    </div>
                    {item.showButton && (
                      <Link
                        href={`/product-details?tab=${['block-1','block-2','block-3','block-4','block-5','block-6','block-7','block-8'].indexOf(item.id)}`}
                        className="btn btn-primary"
                        style={{ padding: item.styles.button.padding, fontSize: item.styles.button.fontSize }}
                      >
                        詳しい情報
                      </Link>
                    )}
                  </div>
                )

                const imageBlock = (
                  <div
                    style={{
                      flex: 1,
                      display: 'flex',
                      gap: item.styles.images.gap,
                      height: '100%',
                    }}
                  >
                    {item.images.map((src) => (
                      <div
                        key={src}
                        style={{
                          flex: 1,
                          position: 'relative',
                          borderRadius: item.styles.imageTile.borderRadius,
                          overflow: 'hidden',
                          
                        }}
                      >
                        <Image src={src} alt={`${item.title} 图片`} fill style={{ objectFit: 'contain' }} />
                      </div>
                    ))}
                  </div>
                )

                return (
                  <div
                    key={item.id}
                    className="card"
                    style={{
                      width: item.styles.card.width,
                      height: item.styles.card.height,
                      display: 'flex',
                      alignItems: 'stretch',
                      gap: item.styles.card.gap,
                      padding: item.styles.card.padding,
                      cursor: 'default',
                    }}
                  >
                    {item.textSide === 'left' ? (
                      <>
                        {textBlock}
                        {imageBlock}
                      </>
                    ) : (
                      <>
                        {imageBlock}
                        {textBlock}
                      </>
                    )}
                  </div>
                )
              })
            })()}
          </div>
        </section>
      </div>
    </>
  )
}

