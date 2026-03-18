'use client'

import { useEffect, useMemo, useState } from 'react'
import { useI18n } from '@/components/I18nProvider'
import Image from 'next/image'
import { getPrintBaseImages } from '@/lib/printCatalog'
import { getTabIdByName } from '@/lib/cartCatalog'

type OrderItem = {
  id: number
  productName: string
  color: string
  size: string
  quantity: number
  image1Pos: string | null
  image2Pos: string | null
  image3Pos: string | null
  image4Pos: string | null
  note: string | null
}

type OrderGroup = {
  id: number
  orderNumber: string
  createdAt: string
  items: OrderItem[]
}

export default function OrdersPage() {
  const { t } = useI18n()
  const [orders, setOrders] = useState<OrderGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeOrderNumber, setActiveOrderNumber] = useState<string>('')

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        setLoading(true)
        setError('')
        const res = await fetch('/api/orders')
        if (!res.ok) {
          const data = await res.json().catch(() => null)
          throw new Error(data?.error || '获取订单失败')
        }
        const data = (await res.json()) as OrderGroup[]
        if (!alive) return
        setOrders(data)
      } catch (e: any) {
        if (!alive) return
        setError(e?.message || '网络错误，请稍后重试')
      } finally {
        if (!alive) return
        setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const sp = new URLSearchParams(window.location.search)
    const initialOrderNumber = sp.get('orderNumber') || ''
    if (initialOrderNumber) setActiveOrderNumber(initialOrderNumber)
  }, [])

  const activeOrder = useMemo(() => orders.find((o) => o.orderNumber === activeOrderNumber) || null, [orders, activeOrderNumber])

  return (
    <div className="container" style={{ paddingTop: '20px', paddingBottom: '40px' }}>
        <h1 style={{ marginBottom: '16px', fontSize: '24px' }}>{t('orders.title')}</h1>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: '#666' }}>{t('common.loading')}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: '#666' }}>{t('orders.empty')}</p>
          </div>
        ) : activeOrder ? (
          <div style={{ maxWidth: '1100px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '14px', color: '#333', fontWeight: 700, textDecoration: 'underline' }}>{activeOrder.orderNumber}</div>
              <button type="button" className="btn" onClick={() => setActiveOrderNumber('')}>
                {t('common.back')}
              </button>
            </div>

            <div className="card" style={{ marginBottom: '16px' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>商品名</th>
                    <th>颜色</th>
                    <th>尺码</th>
                    <th>数量</th>
                    <th>印图位置1</th>
                    <th>印图位置2</th>
                    <th>印图位置3</th>
                    <th>印图位置4</th>
                  </tr>
                </thead>
                <tbody>
                  {activeOrder.items.map((it) => (
                    <tr key={it.id}>
                      <td>{it.productName}</td>
                      <td>{it.color}</td>
                      <td>{it.size}</td>
                      <td>{it.quantity}</td>
                      <td>{it.image1Pos || '-'}</td>
                      <td>{it.image2Pos || '-'}</td>
                      <td>{it.image3Pos || '-'}</td>
                      <td>{it.image4Pos || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {(() => {
              const first = activeOrder.items[0]
              if (!first) return null
              const tabId = getTabIdByName(first.productName)
              if (tabId === null) return null
              const base = getPrintBaseImages(tabId, first.color)
              return (
                <div
                  style={{
                    display: 'flex',
                    gap: '16px',
                    marginTop: '8px',
                  }}
                >
                  <div
                    style={{
                      width: '260px',
                      height: '260px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      position: 'relative',
                      overflow: 'hidden',
                      backgroundColor: '#f8f8f8',
                    }}
                  >
                    <Image src={base.left} alt="印图展示正面" fill style={{ objectFit: 'contain' }} />
                  </div>
                  <div
                    style={{
                      width: '260px',
                      height: '260px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      position: 'relative',
                      overflow: 'hidden',
                      backgroundColor: '#f8f8f8',
                    }}
                  >
                    <Image src={base.right} alt="印图展示背面" fill style={{ objectFit: 'contain' }} />
                  </div>
                </div>
              )
            })()}
          </div>
        ) : (
          <div style={{ maxWidth: '800px' }}>
            <div className="card">
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>{t('orders.listHint')}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {orders.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => setActiveOrderNumber(o.orderNumber)}
                    style={{
                      textAlign: 'left',
                      border: 0,
                      background: 'transparent',
                      padding: 0,
                      color: '#111',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                  >
                    {o.orderNumber}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
  )
}

