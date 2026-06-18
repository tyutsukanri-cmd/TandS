'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useI18n } from '@/components/I18nProvider'

export default function AboutUsPage() {
  const { t } = useI18n()
  const [lastName, setLastName] = useState('')
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [content, setContent] = useState('')
  const [sending, setSending] = useState(false)

  return (
    <div className="container" style={{ paddingTop: '20px', paddingBottom: '40px' }}>
        {/* 页面大标题 */}
        <h1 style={{ marginBottom: '24px', fontSize: '28px' }}>{t('about.title')}</h1>

        {/* 上方 1000 x 700 框 */}
        <div
          style={{
            width: '1000px',
            height: '500px',
            margin: '0 auto 40px',
            display: 'flex',
            gap: '24px',
          }}
        >
          {/* 左侧关于我们信息块 */}
          <div
            style={{
              width: '200px',
              height: '100%',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div>
              <div style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>{t('about.leftTitle')}</div>
              <div style={{ fontSize: '12px', color: '#5f6368', marginBottom: '12px' }}>会社名：中通商事株式会社</div>
              <div style={{ fontSize: '12px', color: '#5f6368', marginBottom: '12px' }}>代表者：代表取締役　黎　兵</div>
              <div style={{ fontSize: '12px', color: '#5f6368', marginBottom: '12px' }}>設　立：2018年11月9日</div>
              <div style={{ fontSize: '12px', color: '#5f6368', marginBottom: '12px' }}>資本金：600万円</div>
              <div style={{ fontSize: '12px', color: '#5f6368', marginBottom: '12px' }}>本　社：〒455-0874</div>
              <div style={{ fontSize: '12px', color: '#5f6368', marginBottom: '12px' }}>愛知県名古屋市港区西福田5丁目1905番地</div>
              <div style={{ fontSize: '12px', color: '#5f6368', marginBottom: '12px' }}>工　場：〒455-0834</div>
              <div style={{ fontSize: '12px', color: '#5f6368', marginBottom: '12px' }}>愛知県名古屋市港区神宮寺</div>
              <div style={{ fontSize: '12px', color: '#5f6368', marginBottom: '12px' }}>大阪倉庫：〒590-0412</div>
              <div style={{ fontSize: '12px', color: '#5f6368', marginBottom: '12px' }}>大阪府泉南郡熊取町紺屋</div>
              <div style={{ fontSize: '12px', color: '#5f6368', marginBottom: '12px' }}>従業員数：40人</div>

              
            </div>
          </div>

          {/* 右侧 4 张图片区域 */}
          <div
            style={{
              flex: 1,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gridTemplateRows: '1fr 1fr',
              gap: '16px',
            }}
          >
            {[
              { src: '/img/g1.jpg', alt: '公司图片 g1' },
              { src: '/img/g2.jpg', alt: '公司图片 g2' },
              { src: '/img/g3.jpg', alt: '公司图片 g3' },
              { src: '/img/g4.jpg', alt: '公司图片 g4' },
            ].map((img) => (
              <div
                key={img.src}
                style={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  position: 'relative',
                  overflow: 'hidden',
                  backgroundColor: '#ffffff',
                }}
              >
                <Image src={img.src} alt={img.alt} fill style={{ objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        </div>

        {/* POD工場介绍框 */}
        <div
          style={{
            width: '1000px',
            margin: '40px auto',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: '24px',
          }}
        >
          <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>PODプリント工場のご紹介</div>
          <div style={{ fontSize: '14px', lineHeight: 1.7, color: '#333' }}>
            当社のPOD（Print on Demand）工場は、受注後すぐに1枚からプリント生産を開始できるスピーディーな生産体制を強みとしています。
            小ロットから対応できるため、ブランドオーナー様や企業様が在庫リスクを抑えながら商品展開できる仕組みを提供しています。
            <br /><br />
            独自のプリント技術と最新設備を導入することで、鮮やかな発色と優れた洗濯耐久性を実現。
            デザインの細部まで美しく再現し、長くご愛用いただける高品質なプリント製品をお届けします。
            <br /><br />
            アパレルブランドのオリジナル商品をはじめ、イベントグッズやアーティスト物販、企業ノベルティなど、さまざまな用途に対応。
            「必要なときに、必要な分だけ」生産できるPODサービスで、お客様のビジネスをサポートします。
          </div>
        </div>

        {/* 下方 1000 宽表单框 */}
        <div
          style={{
            width: '1000px',
            margin: '0 auto',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: '24px 24px 20px',
          }}
        >
          <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>{t('about.contactTitle')}</div>

          <form
            onSubmit={async (e) => {
              e.preventDefault()
              if (sending) return
              setSending(true)
              try {
                const res = await fetch('/api/contact', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ lastName, firstName, email, content }),
                })
                const data = await res.json().catch(() => null)
                if (!res.ok) throw new Error(data?.error || t('about.sendFailed'))
                alert(t('about.sent'))
                setLastName('')
                setFirstName('')
                setEmail('')
                setContent('')
              } catch (err: any) {
                alert(err?.message || t('about.sendFailed'))
              } finally {
                setSending(false)
              }
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px 24px',
                marginBottom: '16px',
              }}
            >
              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px' }}>{t('about.lastName')}</label>
                <input
                  type="text"
                  placeholder={t('about.ph.lastName')}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    fontSize: '14px',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px' }}>{t('about.firstName')}</label>
                <input
                  type="text"
                  placeholder={t('about.ph.firstName')}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    fontSize: '14px',
                  }}
                />
              </div>
              <div style={{ gridColumn: '1 / 3' }}>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px' }}>{t('about.email')}</label>
                <input
                  type="email"
                  placeholder={t('about.ph.email')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    fontSize: '14px',
                  }}
                />
              </div>
              <div style={{ gridColumn: '1 / 3' }}>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px' }}>{t('about.content')}</label>
                <textarea
                  placeholder={t('about.ph.content')}
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    fontSize: '14px',
                    resize: 'vertical',
                  }}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '14px' }} disabled={sending}>
              {t('common.submit')}
            </button>
          </form>
        </div>
      </div>
  )
}

