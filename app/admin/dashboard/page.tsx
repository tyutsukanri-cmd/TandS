'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useI18n } from '@/components/I18nProvider'

interface Stats {
  totalOrders: number
  totalUsers: number
  totalProducts: number
  unreadContacts: number
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { t } = useI18n()

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

      const contactsRes = await fetch('/api/admin/contact-messages')
      const contactsData = contactsRes.ok ? await contactsRes.json() : { unreadCount: 0 }

      setStats({
        totalOrders: orders.length,
        totalUsers: users.length,
        totalProducts: products.length,
        unreadContacts: contactsData?.unreadCount ?? 0,
      })
    } catch (error) {
      console.error('获取统计数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '40px' }}>
        {t('common.loading')}
      </div>
    )
  }

  return (
    <div className="container" style={{ marginTop: '30px' }}>
        <h1 style={{ marginBottom: '30px' }}>{t('admin.dashboard')}</h1>
        {stats && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}>
            <div className="card">
              <h3 style={{ color: '#666', marginBottom: '10px' }}>{t('admin.orders')}</h3>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#0070f3' }}>
                {stats.totalOrders}
              </div>
            </div>
            <div className="card">
              <h3 style={{ color: '#666', marginBottom: '10px' }}>{t('admin.users')}</h3>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#28a745' }}>
                {stats.totalUsers}
              </div>
            </div>
            <div className="card">
              <h3 style={{ color: '#666', marginBottom: '10px' }}>Products</h3>
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
            <h2 style={{ marginBottom: '20px' }}>{t('admin.orders')}</h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              {t('admin.orders')}（{t('common.query')} / ダウンロード / ZIP）
            </p>
            <Link href="/admin/orders" className="btn btn-primary">
              {t('admin.orders')}
            </Link>
          </div>
          <div className="card">
            <h2 style={{ marginBottom: '20px' }}>{t('admin.orderCleanup')}</h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              删除订单对应的图片文件夹，定期清理节省存储（订单履历仍保留）
            </p>
            <Link href="/admin/orders-cleanup" className="btn btn-primary">
              进入清理
            </Link>
          </div>
          <div className="card">
            <h2 style={{ marginBottom: '20px' }}>
              {t('admin.contactMessages')}
              {stats && stats.unreadContacts > 0 && (
                <span style={{ marginLeft: '10px', color: '#dc3545', fontSize: '14px', fontWeight: 700 }}>
                  {t('admin.contact.unread')} {stats.unreadContacts}
                </span>
              )}
            </h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>about-us 提交的数据会显示在这里</p>
            <Link href="/admin/contact-messages" className="btn btn-primary">
              {t('admin.contactMessages')}
            </Link>
          </div>
          <div className="card">
            <h2 style={{ marginBottom: '20px' }}>{t('admin.users')}</h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              查看所有注册用户信息
            </p>
            <Link href="/admin/users" className="btn btn-primary">
              查看用户
            </Link>
          </div>
                  </div>
      </div>
  )
}

