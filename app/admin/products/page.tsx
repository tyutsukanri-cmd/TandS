'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type Product = {
  id: number
  name: string
  description: string | null
  colors: string[]
  sizes: string[]
  createdAt: string
}

export default function AdminProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await fetch('/api/products')
      if (res.status === 401 || res.status === 403) {
        router.push('/login')
        return
      }
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.error || '获取商品列表失败')
      }
      const data = await res.json()
      setProducts(data)
    } catch (e: any) {
      setError(e?.message || '网络错误，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`确定要删除商品「${name}」吗？此操作不可恢复。`)) return
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        throw new Error(data?.error || '删除失败')
      }
      await fetchProducts()
    } catch (e: any) {
      alert(e?.message || '删除失败')
    }
  }

  return (
    <div className="container" style={{ marginTop: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h1>商品管理</h1>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" className="btn" onClick={() => router.push('/admin/dashboard')}>
              返回
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => router.push('/admin/products/new')}
            >
              ＋ 添加商品
            </button>
          </div>
        </div>

        {error && <div className="error-message" style={{ marginBottom: '16px' }}>{error}</div>}

        {loading ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: '#666' }}>加载中...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: '#666', marginBottom: '16px' }}>暂无商品</p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => router.push('/admin/products/new')}
            >
              ＋ 添加商品
            </button>
          </div>
        ) : (
          <div className="card">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>名称</th>
                  <th>颜色</th>
                  <th>尺码</th>
                  <th>创建时间</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>#{p.id}</td>
                    <td>{p.name}</td>
                    <td>{Array.isArray(p.colors) ? p.colors.join(' / ') : ''}</td>
                    <td>{Array.isArray(p.sizes) ? p.sizes.join(' / ') : ''}</td>
                    <td>{new Date(p.createdAt).toLocaleString('zh-CN')}</td>
                    <td>
                      <button
                        type="button"
                        className="btn"
                        style={{ marginRight: '8px' }}
                        onClick={() => router.push(`/product/${p.id}`)}
                      >
                        查看
                      </button>
                      <button
                        type="button"
                        className="btn"
                        style={{ borderColor: '#dc3545', color: '#dc3545' }}
                        onClick={() => handleDelete(p.id, p.name)}
                      >
                        删除
                      </button>
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

