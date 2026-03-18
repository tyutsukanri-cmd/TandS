'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: number
  username: string
  passwordHash: string
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

  const handleResetPassword = async (userId: number, username: string) => {
    const newPassword = prompt(`请为用户 ${username} 输入新密码:`)
    if (!newPassword || newPassword.trim() === '') {
      return
    }

    try {
      const res = await fetch(`/api/admin/users/${userId}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: newPassword.trim() }),
      })

      if (res.ok) {
        alert(`用户 ${username} 的密码已成功重置！`)
      } else if (res.status === 401 || res.status === 403) {
        router.push('/login')
      } else {
        const error = await res.json()
        setError(error.error || '重置密码失败')
      }
    } catch (error) {
      setError('网络错误，请稍后重试')
    }
  }

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '40px' }}>
        加载中...
      </div>
    )
  }

  return (
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
                  <th>操作</th>
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
                    <td>
                      <button
                        onClick={() => handleResetPassword(user.id, user.username)}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          background: '#28a745',
                          color: 'white',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        重置密码
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

