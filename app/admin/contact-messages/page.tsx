'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useI18n } from '@/components/I18nProvider'

type ContactMessage = {
  id: number
  lastName: string
  firstName: string
  email: string
  content: string
  isRead: boolean
  createdAt: string
}

export default function AdminContactMessagesPage() {
  const router = useRouter()
  const { t } = useI18n()
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState<Record<number, boolean>>({})
  const selectedIds = useMemo(() => Object.keys(selected).filter((k) => selected[Number(k)]).map((k) => Number(k)), [selected])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await fetch('/api/admin/contact-messages')
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          router.push('/login')
          return
        }
        throw new Error('获取失败')
      }
      const data = await res.json()
      setMessages(data.messages || [])
      setUnreadCount(data.unreadCount || 0)
    } catch (e: any) {
      setError(e?.message || '网络错误，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggleAll = (checked: boolean) => {
    const next: Record<number, boolean> = {}
    for (const m of messages) next[m.id] = checked
    setSelected(next)
  }

  const markRead = async (ids: number[]) => {
    if (ids.length === 0) return
    await fetch('/api/admin/contact-messages', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    })
  }

  const del = async () => {
    if (selectedIds.length === 0) return
    if (!confirm(`${t('common.delete')} ${selectedIds.length} ?`)) return
    try {
      setError('')
      const res = await fetch('/api/admin/contact-messages', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) throw new Error(data?.error || '删除失败')
      setSelected({})
      await fetchMessages()
    } catch (e: any) {
      setError(e?.message || '删除失败')
    }
  }

  return (
    <div className="container" style={{ marginTop: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h1>
            {t('admin.contactMessages')}
            {unreadCount > 0 && (
              <span style={{ marginLeft: '10px', color: '#dc3545', fontSize: '14px', fontWeight: 700 }}>
                {t('admin.contact.unread')} {unreadCount}
              </span>
            )}
          </h1>
          <button type="button" className="btn" onClick={() => router.push('/admin/dashboard')}>
            {t('common.back')}
          </button>
        </div>

        <div className="card" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button type="button" className="btn" onClick={() => toggleAll(true)} disabled={loading || messages.length === 0}>
              全选
            </button>
            <button type="button" className="btn" onClick={() => toggleAll(false)} disabled={loading || messages.length === 0}>
              取消全选
            </button>
            <button type="button" className="btn btn-primary" onClick={del} disabled={loading || selectedIds.length === 0}>
              {t('common.delete')}
            </button>
          </div>
          <button type="button" className="btn" onClick={fetchMessages} disabled={loading}>
            刷新
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: '#666' }}>{t('common.loading')}</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: '#666' }}>{t('admin.contact.none')}</p>
          </div>
        ) : (
          <div className="card">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>
                    <input
                      type="checkbox"
                      checked={messages.length > 0 && selectedIds.length === messages.length}
                      onChange={(e) => toggleAll(e.target.checked)}
                      aria-label="全选"
                    />
                  </th>
                  <th>ID</th>
                  <th>姓名</th>
                  <th>Email</th>
                  <th>内容</th>
                  <th>时间</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((m) => (
                  <tr
                    key={m.id}
                    style={{
                      background: m.isRead ? 'transparent' : 'rgba(255, 223, 128, 0.25)',
                    }}
                    onClick={async () => {
                      if (m.isRead) return
                      await markRead([m.id]).catch(() => null)
                      await fetchMessages()
                    }}
                    title={m.isRead ? '' : '点击标记已读'}
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={Boolean(selected[m.id])}
                        onChange={(e) => setSelected((prev) => ({ ...prev, [m.id]: e.target.checked }))}
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`选择 ${m.id}`}
                      />
                    </td>
                    <td>#{m.id}</td>
                    <td>
                      {m.lastName}
                      {m.firstName} {!m.isRead && <span style={{ marginLeft: '8px', color: '#dc3545', fontSize: '12px' }}>{t('admin.contact.unread')}</span>}
                    </td>
                    <td>{m.email}</td>
                    <td style={{ maxWidth: '520px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.content}</td>
                    <td>{new Date(m.createdAt).toLocaleString('zh-CN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>提示：点击未读行可标记为已读</div>
          </div>
        )}
      </div>
  )
}

