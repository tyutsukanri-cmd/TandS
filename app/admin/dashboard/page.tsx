'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

interface Stats {
  totalOrders: number
  totalUsers: number
  totalProducts: number
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // 获取订单统计
      const ordersRes = await fetch('/api/admin/orders')
      const orders = ordersRes.ok ? await ordersRes.json() : []

      // 获取用户统计
      const usersRes = await fetch('/api/admin/users')
      const users = usersRes.ok ? await usersRes.json() : []

      // 获取商品统计
      const productsRes = await fetch('/api/products')
      const products = productsRes.ok ? await productsRes.json() : []

      setStats({
        totalOrders: orders.length,
        totalUsers: users.length,
        totalProducts: products.length,
      })
    } catch (error) {
      console.error('获取统计数据失败:', error)
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
        <h1 style={{ marginBottom: '30px' }}>管理后台</h1>
        {stats && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}>
            <div className="card">
              <h3 style={{ color: '#666', marginBottom: '10px' }}>总订单数</h3>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#0070f3' }}>
                {stats.totalOrders}
              </div>
            </div>
            <div className="card">
              <h3 style={{ color: '#666', marginBottom: '10px' }}>总用户数</h3>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#28a745' }}>
                {stats.totalUsers}
              </div>
            </div>
            <div className="card">
              <h3 style={{ color: '#666', marginBottom: '10px' }}>商品总数</h3>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#ffc107' }}>
                {stats.totalProducts}
              </div>
            </div>
          </div>
        )}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          <div className="card">
            <h2 style={{ marginBottom: '20px' }}>订单管理</h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              查看所有订单，导出Excel文件
            </p>
            <Link href="/admin/orders" className="btn btn-primary" style={{ marginRight: '10px' }}>
              查看订单
            </Link>
            <button onClick={handleExportExcel} className="btn btn-secondary">
              导出Excel
            </button>
          </div>
          <div className="card">
            <h2 style={{ marginBottom: '20px' }}>用户管理</h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              查看所有注册用户信息
            </p>
            <Link href="/admin/users" className="btn btn-primary">
              查看用户
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

