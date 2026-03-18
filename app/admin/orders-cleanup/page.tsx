'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

type OrderGroup = {
  id: number
  orderNumber: string
  createdAt: string
  user: { username: string }
}

export default function AdminOrdersCleanupPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<OrderGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [deleting, setDeleting] = useState(false)
  const selectedOrderNumbers = useMemo(() => Object.keys(selected).filter((k) => selected[k]), [selected])

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        setLoading(true)
        setError('')
        const res = await fetch('/api/admin/orders?sort=asc')
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            router.push('/login')
            return
          }
          throw new Error('获取订单失败')
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
  }, [router])

  const toggleAll = (checked: boolean) => {
    const next: Record<string, boolean> = {}
    for (const o of orders) next[o.orderNumber] = checked
    setSelected(next)
  }

  const doDelete = async () => {
    if (selectedOrderNumbers.length === 0) return
    if (!confirm(`确定删除所选 ${selectedOrderNumbers.length} 个订单的图片文件夹吗？订单履历仍会保留，但图片将无法恢复。`)) return

    setDeleting(true)
    setError('')
    try {
      for (const orderNumber of selectedOrderNumbers) {
        const res = await fetch(`/api/admin/orders/${encodeURIComponent(orderNumber)}/images`, { method: 'DELETE' })
        if (!res.ok) {
          const data = await res.json().catch(() => null)
          throw new Error(data?.error || `删除失败：${orderNumber}`)
        }
      }
      // 删除后保留订单记录，但从勾选中移除
      setSelected({})
      alert('删除完成')
    } catch (e: any) {
      setError(e?.message || '删除失败')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="container" style={{ marginTop: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h1>订单图片清理</h1>
          <button type="button" className="btn" onClick={() => router.push('/admin/dashboard')}>
            返回
          </button>
        </div>

        <div className="card" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ fontSize: '12px', color: '#666' }}>按时间从最旧到最新排列（仅删除图片文件夹，不删除订单记录）</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" className="btn" onClick={() => toggleAll(true)} disabled={loading || deleting || orders.length === 0}>
              全选
            </button>
            <button type="button" className="btn" onClick={() => toggleAll(false)} disabled={loading || deleting || orders.length === 0}>
              取消全选
            </button>
            <button type="button" className="btn btn-primary" onClick={doDelete} disabled={loading || deleting || selectedOrderNumbers.length === 0}>
              删除
            </button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
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
                  <th style={{ width: '60px' }}>
                    <input
                      type="checkbox"
                      checked={selectedOrderNumbers.length === orders.length}
                      onChange={(e) => toggleAll(e.target.checked)}
                      aria-label="全选"
                    />
                  </th>
                  <th>订单号</th>
                  <th>用户名</th>
                  <th>下单时间</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={Boolean(selected[o.orderNumber])}
                        onChange={(e) => setSelected((prev) => ({ ...prev, [o.orderNumber]: e.target.checked }))}
                        aria-label={`选择 ${o.orderNumber}`}
                      />
                    </td>
                    <td style={{ textDecoration: 'underline' }}>{o.orderNumber}</td>
                    <td>{o.user.username}</td>
                    <td>{new Date(o.createdAt).toLocaleString('zh-CN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
  )
}

