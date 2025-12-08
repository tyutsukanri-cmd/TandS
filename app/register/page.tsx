'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    phone: '',
    email: '',
    companyName: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (res.ok) {
        router.push('/')
        router.refresh()
      } else {
        setError(data.error || '注册失败')
      }
    } catch (error) {
      setError('网络错误，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="container" style={{ maxWidth: '500px', marginTop: '50px' }}>
        <div className="card">
          <h1 style={{ marginBottom: '30px', textAlign: 'center' }}>用户注册</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>用户名 *</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                minLength={3}
                placeholder="至少3个字符"
              />
            </div>
            <div className="form-group">
              <label>密码 *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                placeholder="至少6个字符"
              />
            </div>
            <div className="form-group">
              <label>联系方式</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="手机号码（可选）"
              />
            </div>
            <div className="form-group">
              <label>邮箱</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="邮箱地址（可选）"
              />
            </div>
            <div className="form-group">
              <label>公司名</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="公司名称（可选）"
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '10px' }}
              disabled={loading}
            >
              {loading ? '注册中...' : '注册'}
            </button>
          </form>
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <span style={{ color: '#666' }}>已有账号？</span>{' '}
            <Link href="/login" style={{ color: '#0070f3' }}>
              立即登录
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

