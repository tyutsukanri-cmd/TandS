'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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
        setError(data.error || '登録に失敗しました')
      }
    } catch (error) {
      setError('ネットワークエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container" style={{ maxWidth: '500px', marginTop: '50px' }}>
        <div className="card">
          <h1 style={{ marginBottom: '30px', textAlign: 'center' }}>ユーザー登録</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>ユーザー名 *</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                minLength={3}
                placeholder="少なくとも3文字"
              />
            </div>
            <div className="form-group">
              <label>パスワード *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                placeholder="少なくとも6文字"
              />
            </div>
            <div className="form-group">
              <label>連絡先</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="電話番号（任意）"
              />
            </div>
            <div className="form-group">
              <label>メールアドレス</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="メールアドレス（任意）"
              />
            </div>
            <div className="form-group">
              <label>会社名</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="会社名（任意）"
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '10px' }}
              disabled={loading}
            >
                {loading ? '登録中...' : '登録'}
            </button>
          </form>
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <span style={{ color: '#666' }}>アカウントをお持ちですか？</span>{' '}
            <Link href="/login" style={{ color: '#0070f3' }}>
              今すぐログインする  
            </Link>
          </div>
        </div>
      </div>
  )
}

