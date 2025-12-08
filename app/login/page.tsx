'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (res.ok) {
        // 根据用户角色跳转
        if (data.user.role === 'admin') {
          router.push('/admin/dashboard')
        } else {
          router.push('/')
        }
        router.refresh()
      } else {
        setError(data.error || '登录失败')
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
      <div className="container" style={{ maxWidth: '400px', marginTop: '50px' }}>
        <div className="card">
          <h1 style={{ marginBottom: '30px', textAlign: 'center' }}>用户登录</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>用户名</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="请输入用户名"
              />
            </div>
            <div className="form-group">
              <label>密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="请输入密码"
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '10px' }}
              disabled={loading}
            >
              {loading ? '登录中...' : '登录'}
            </button>
          </form>
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <span style={{ color: '#666' }}>还没有账号？</span>{' '}
            <Link href="/register" style={{ color: '#0070f3' }}>
              立即注册
            </Link>
          </div>
          <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '4px', fontSize: '14px' }}>
            <strong>测试账号：</strong><br />
            管理员：admin / admin<br />
            普通用户：请先注册
          </div>
        </div>
      </div>
    </>
  )
}

