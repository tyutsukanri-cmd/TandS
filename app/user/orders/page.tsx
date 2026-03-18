'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Order {
  id: number
  productName: string
  size: string
  color: string
  quantity: number
  createdAt: string
  product: {
    imageUrl: string | null
  }
}

export default function UserOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders')
      if (res.ok) {
        const data = await res.json()
        setOrders(data)
      } else if (res.status === 401) {
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

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '40px' }}>
        加载中...
      </div>
    )
  }

  return (
    <div className="container" style={{ marginTop: '30px' }}>
        <h1 style={{ marginBottom: '30px' }}>我的订单</h1>
        {error ? (
          <div className="error-message">{error}</div>
        ) : orders.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ marginBottom: '20px', color: '#666' }}>暂无订单</p>
            <Link href="/" className="btn btn-primary">
              去购物
            </Link>
          </div>
        ) : (
          <div className="card">
            <table className="table">
              <thead>
                <tr>
                  <th>订单ID</th>
                  <th>商品</th>
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
  )
}

