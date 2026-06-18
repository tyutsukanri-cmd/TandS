'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

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
        setError('商品なし')
      }
    } catch (error) {
      setError('商品情報の取得失敗')
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
      setError('サイズとカラーを選択してください')
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
        alert('注文の送信が完了しました')
        router.push('/user/orders')
      } else {
        setError(data.error || '注文に失敗しました')
      }
    } catch (error) {
      setError('ネットワークエラーです。しばらくしてから再度お試しください。')
    }
  }

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '40px' }}>
        読み込み中…
      </div>
    )
  }

  if (error && !product) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '40px' }}>
        <div className="error-message">{error}</div>
        <Link href="/" className="btn btn-primary" style={{ marginTop: '20px' }}>
          トップページに戻る
        </Link>
      </div>
    )
  }

  return (
    <div className="container" style={{ maxWidth: '900px', marginTop: '30px' }}>
      <Link href="/" style={{ color: '#0070f3', marginBottom: '20px', display: 'inline-block' }}>
        ← 商品一覧に戻る
      </Link>

      {product && (
        <div style={{ display: 'flex', gap: '30px', marginBottom: '40px' }}>
          <div style={{ flex: 1 }}>
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
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>{product.name}</h1>
            <p style={{ color: '#666', lineHeight: '1.8', marginBottom: '30px' }}>
              {product.description || '暂无描述'}
            </p>

            <div className="card" style={{ marginBottom: '20px' }}>
              <h3 style={{ marginBottom: '15px' }}>规格を選択してください</h3>
              <div className="form-group">
                <label>サイズ</label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                >
                  {product.sizes.map((size: string) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>カラー</label>
                <select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                >
                  {product.colors.map((color: string) => (
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
                {user ? '今すぐ注文する' : 'ログインして注文'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

