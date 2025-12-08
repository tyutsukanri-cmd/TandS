'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

interface Product {
  id: number
  name: string
  description: string | null
  imageUrl: string | null
  sizes: string[]
  colors: string[]
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [user, setUser] = useState<any>(null)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    fetchProduct()
    fetchUser()
  }, [params.id])

  const fetchProduct = async () => {
    try {
      setImageError(false) // 重置图片错误状态
      const res = await fetch(`/api/products/${params.id}`)
      if (res.ok) {
        const data = await res.json()
        setProduct(data)
        if (data.sizes.length > 0) setSelectedSize(data.sizes[0])
        if (data.colors.length > 0) setSelectedColor(data.colors[0])
      } else {
        setError('商品不存在')
      }
    } catch (error) {
      setError('获取商品信息失败')
    } finally {
      setLoading(false)
    }
  }

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/user/me')
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      }
    } catch (error) {
      // 用户未登录
    }
  }

  const handleOrder = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    if (!selectedSize || !selectedColor) {
      setError('请选择尺码和颜色')
      return
    }

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product!.id,
          productName: product!.name,
          size: selectedSize,
          color: selectedColor,
          quantity,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        alert('订单提交成功！')
        router.push('/user/orders')
      } else {
        setError(data.error || '下单失败')
      }
    } catch (error) {
      setError('网络错误，请稍后重试')
    }
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

  if (error && !product) {
    return (
      <>
        <Navbar />
        <div className="container" style={{ textAlign: 'center', padding: '40px' }}>
          <div className="error-message">{error}</div>
          <Link href="/" className="btn btn-primary" style={{ marginTop: '20px' }}>
            返回首页
          </Link>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="container" style={{ maxWidth: '900px', marginTop: '30px' }}>
        <Link href="/" style={{ color: '#0070f3', marginBottom: '20px', display: 'inline-block' }}>
          ← 返回商品列表
        </Link>
        {product && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginTop: '20px' }}>
            <div>
              <div style={{
                width: '100%',
                height: '500px',
                backgroundColor: '#f0f0f0',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                {product.imageUrl && !imageError ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    onError={() => {
                      setImageError(true)
                    }}
                  />
                ) : (
                  <span style={{ color: '#999' }}>暂无图片</span>
                )}
              </div>
            </div>
            <div>
              <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>{product.name}</h1>
              <p style={{ color: '#666', lineHeight: '1.8', marginBottom: '30px' }}>
                {product.description || '暂无描述'}
              </p>

              <div className="card" style={{ marginBottom: '20px' }}>
                <h3 style={{ marginBottom: '15px' }}>选择规格</h3>
                <div className="form-group">
                  <label>尺码</label>
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                  >
                    {product.sizes.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>颜色</label>
                  <select
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                  >
                    {product.colors.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>数量</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  />
                </div>
                {error && <div className="error-message">{error}</div>}
                <button
                  onClick={handleOrder}
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '10px' }}
                >
                  {user ? '立即下单' : '登录后下单'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

