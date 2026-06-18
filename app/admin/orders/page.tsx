'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

interface OrderGroup {
  id: number
  orderNumber: string
  orderDate: string
  sequence: number
  folderName: string
  createdAt: string
  user: {
    username: string
    companyName: string | null
  }
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderGroup[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const toYyyymmdd = (d: string) => d.replaceAll('-', '')

  const canQuery = useMemo(() => {
    if (!startDate || !endDate) return false
    return toYyyymmdd(startDate) <= toYyyymmdd(endDate)
  }, [startDate, endDate])

  const fetchOrders = async () => {
    try {
      setError('')
      setLoading(true)
      const qs = new URLSearchParams()
      if (startDate) qs.set('start', toYyyymmdd(startDate))
      if (endDate) qs.set('end', toYyyymmdd(endDate))
      const res = await fetch(`/api/admin/orders?${qs.toString()}`)
      if (res.ok) {
        const data = await res.json()
        setOrders(data)
      } else if (res.status === 401 || res.status === 403) {
        router.push('/login')
      } else {
        setError('获取订单失败')
      }
    } catch (error) {
      setError('网络错误，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container" style={{ marginTop: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h1>订单管理</h1>
          <button type="button" className="btn" onClick={() => router.push('/admin/dashboard')}>
            返回
          </button>
        </div>

        <div className="card" style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ fontSize: '12px', color: '#666' }}>开始时间</div>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ height: '34px' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ fontSize: '12px', color: '#666' }}>结束时间</div>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ height: '34px' }} />
            </div>
            <button type="button" className="btn btn-primary" style={{ height: '34px' }} onClick={fetchOrders} disabled={!canQuery || loading}>
              查询
            </button>
            {!canQuery && (startDate || endDate) && <div style={{ fontSize: '12px', color: '#dc3545' }}>请确认开始时间不晚于结束时间</div>}
          </div>
        </div>

        {error ? (
          <div className="error-message">{error}</div>
        ) : loading ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: '#666' }}>加载中...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: '#666' }}>暂无订单</p>
          </div>
        ) : (
          <div className="card">
            <table className="table">
              <thead>
                <tr>
                  <th>订单名</th>
                  <th>用户名</th>
                  <th>公司名</th>
                  <th>下单时间</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td style={{ textDecoration: 'underline', cursor: 'default' }}>{order.orderNumber}</td>
                    <td>{order.user.username}</td>
                    <td>{order.user.companyName || '-'}</td>
                    <td>{new Date(order.createdAt).toLocaleString('zh-CN')}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          className="btn btn-primary"
                          style={{ height: '28px', padding: '0 10px', fontSize: '12px' }}
                          onClick={() => {
                            window.location.href = `/api/admin/orders/${encodeURIComponent(order.orderNumber)}/export`
                          }}
                        >
                          下载文件
                        </button>
                        <button
                          type="button"
                          className="btn"
                          style={{ height: '28px', padding: '0 10px', fontSize: '12px' }}
                          onClick={() => {
                            window.location.href = `/api/admin/orders/${encodeURIComponent(order.orderNumber)}/images/zip`
                          }}
                        >
                          下载图片
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
  )
}

