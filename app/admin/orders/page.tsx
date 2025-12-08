'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

interface Order {
  id: number
  productName: string
  size: string
  color: string
  quantity: number
  createdAt: string
  user: {
    username: string
    companyName: string | null
  }
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders')
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

  const handleExportExcel = () => {
    window.location.href = '/api/admin/orders/export'
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container" style={{ textAlign: 'center', padding: '40px' }}>
          加载中...
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="container" style={{ marginTop: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1>订单管理</h1>
          <button onClick={handleExportExcel} className="btn btn-primary">
            导出Excel
          </button>
        </div>
        {error ? (
          <div className="error-message">{error}</div>
        ) : orders.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: '#666' }}>暂无订单</p>
          </div>
        ) : (
          <div className="card">
            <table className="table">
              <thead>
                <tr>
                  <th>订单ID</th>
                  <th>用户名</th>
                  <th>公司名</th>
                  <th>商品名</th>
                  <th>尺码</th>
                  <th>颜色</th>
                  <th>数量</th>
                  <th>下单时间</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.user.username}</td>
                    <td>{order.user.companyName || '-'}</td>
                    <td>{order.productName}</td>
                    <td>{order.size}</td>
                    <td>{order.color}</td>
                    <td>{order.quantity}</td>
                    <td>{new Date(order.createdAt).toLocaleString('zh-CN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}

