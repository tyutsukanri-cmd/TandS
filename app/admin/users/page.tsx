'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

interface User {
  id: number
  username: string
  phone: string | null
  email: string | null
  companyName: string | null
  role: string
  createdAt: string
  orderCount: number
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users')
      if (res.ok) {
        const data = await res.json()
        setUsers(data)
      } else if (res.status === 401 || res.status === 403) {
        router.push('/login')
      } else {
        setError('获取用户列表失败')
      }
    } catch (error) {
      setError('网络错误，请稍后重试')
    } finally {
      setLoading(false)
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

  return (
    <>
      <Navbar />
      <div className="container" style={{ marginTop: '30px' }}>
        <h1 style={{ marginBottom: '30px' }}>用户管理</h1>
        {error ? (
          <div className="error-message">{error}</div>
        ) : users.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: '#666' }}>暂无用户</p>
          </div>
        ) : (
          <div className="card">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>用户名</th>
                  <th>联系方式</th>
                  <th>邮箱</th>
                  <th>公司名</th>
                  <th>角色</th>
                  <th>订单数</th>
                  <th>注册时间</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>#{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.phone || '-'}</td>
                    <td>{user.email || '-'}</td>
                    <td>{user.companyName || '-'}</td>
                    <td>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        background: user.role === 'admin' ? '#dc3545' : '#0070f3',
                        color: 'white'
                      }}>
                        {user.role === 'admin' ? '管理员' : '用户'}
                      </span>
                    </td>
                    <td>{user.orderCount}</td>
                    <td>{new Date(user.createdAt).toLocaleString('zh-CN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}

