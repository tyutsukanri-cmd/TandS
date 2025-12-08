'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'

interface Product {
  id: number
  name: string
  description: string | null
  imageUrl: string | null
  sizes: string[]
  colors: string[]
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set())

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products')
      if (res.ok) {
        const data = await res.json()
        setProducts(data)
      }
    } catch (error) {
      console.error('获取商品列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <h1 style={{ marginBottom: '30px', fontSize: '32px' }}>商品展示</h1>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>加载中...</div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>暂无商品</div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px'
          }}>
            {products.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`}>
                <div className="card" style={{
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  height: '100%'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  <div style={{
                    width: '100%',
                    height: '400px',
                    backgroundColor: '#f0f0f0',
                    borderRadius: '4px',
                    marginBottom: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}>
                    {product.imageUrl && !imageErrors.has(product.id) ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        onError={() => {
                          setImageErrors(prev => new Set(prev).add(product.id))
                        }}
                      />
                    ) : (
                      <span style={{ color: '#999' }}>暂无图片</span>
                    )}
                  </div>
                  <h3 style={{ marginBottom: '10px', fontSize: '20px' }}>
                    {product.name}
                  </h3>
                  <p style={{
                    color: '#666',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    marginBottom: '10px'
                  }}>
                    {product.description || '暂无描述'}
                  </p>
                  <div style={{ fontSize: '12px', color: '#999' }}>
                    尺码: {product.sizes.join(', ')} | 颜色: {product.colors.join(', ')}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

