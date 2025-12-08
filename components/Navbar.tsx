'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface User {
  id: number
  username: string
  role: string
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/user/me')
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('登出失败:', error)
    }
  }

  return (
    <nav style={{
      background: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      padding: '15px 0',
      marginBottom: '30px'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link href="/" style={{ fontSize: '50px', fontWeight: 'bold', color: '#0070f3' }}>
          T&S
        </Link>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          {user ? (
            <>
              <span>欢迎, {user.username}</span>
              {user.role === 'admin' && (
                <Link href="/admin/dashboard" className="btn btn-secondary">
                  管理后台
                </Link>
              )}
              <Link href="/user/orders" className="btn btn-secondary">
                我的订单
              </Link>
              <button onClick={handleLogout} className="btn btn-danger">
                登出
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-secondary">
                登录
              </Link>
              <Link href="/register" className="btn btn-primary">
                注册
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

