'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { useI18n } from '@/components/I18nProvider'

interface User {
  id: number
  username: string
  role: string
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { locale, setLocale, t } = useI18n()

  const navItems = [
    { label: t('nav.home'), href: '/' },
    { label: t('nav.about'), href: '/about-us' },
    { label: t('nav.productDetails'), href: '/product-details' },
    { label: t('nav.myCart'), href: '/my-cart' },
    { label: t('nav.orders'), href: '/orders' },
  ]

  useEffect(() => {
    fetchUser()
  }, [])

  // 监听路由变化，重新获取用户信息
  useEffect(() => {
    fetchUser()
  }, [pathname])

  // 移动端菜单：切换页面后自动关闭
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // 监听页面可见性变化，当用户从其他标签页回来时更新状态
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchUser()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const fetchUser = async () => {
    try {
      // 添加小延迟确保cookie已经设置
      await new Promise(resolve => setTimeout(resolve, 100))
      const res = await fetch('/api/user/me')
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
      setUser(null)
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
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        borderBottom: '1px solid #eee',
        padding: '10px 0',
        marginBottom: '10px',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
          <Image
            src="/logo/TS-2.png"
            alt="TandS Logo"
            width={140}
            height={40}
            priority
            style={{ height: '40px', width: 'auto' }}
          />
        </Link>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '30px',
          }}
        >
          <div
            className="r-nav-links"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              fontSize: '14px',
              textTransform: 'uppercase',
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(calc(-50% + 2cm), -50%)',
              whiteSpace: 'nowrap',
            }}
          >
            {navItems.map((item) => {
              const active =
                item.href === '/'
                  ? pathname === '/'
                  : pathname?.startsWith(item.href)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    paddingBottom: '4px',
                    borderBottom: active ? '2px solid #000' : '2px solid transparent',
                    color: '#000',
                    fontWeight: active ? 600 : 500,
                  }}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>

          <div
            className="r-nav-auth"
            style={{
              display: 'flex',
              gap: '20px',
              alignItems: 'center',
              fontSize: '14px',
              textTransform: 'uppercase',
            }}
          >
            {user ? (
              <>
                <span style={{ fontSize: '14px', color: '#000' }}>
                  {t('auth.welcome')}, {user.username}
                </span>
                {user.role === 'admin' && (
                  <Link
                    href="/admin/dashboard"
                    style={{
                      paddingBottom: '4px',
                      borderBottom: pathname?.startsWith('/admin') ? '2px solid #000' : '2px solid transparent',
                      color: '#000',
                      fontWeight: pathname?.startsWith('/admin') ? 600 : 500,
                    }}
                  >
                    {t('auth.admin')}
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  style={{
                    background: 'none',
                    padding: 0,
                    paddingBottom: '4px',
                    fontSize: '14px',
                    textTransform: 'uppercase',
                    color: '#000',
                    fontWeight: 500,
                  }}
                >
                  {t('auth.logout')}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  style={{
                    paddingBottom: '4px',
                    borderBottom: pathname === '/login' ? '2px solid #000' : '2px solid transparent',
                    color: '#000',
                    fontWeight: pathname === '/login' ? 600 : 500,
                  }}
                >
                  {t('auth.login')}
                </Link>
                <Link
                  href="/register"
                  style={{
                    paddingBottom: '4px',
                    borderBottom: pathname === '/register' ? '2px solid #000' : '2px solid transparent',
                    color: '#000',
                    fontWeight: pathname === '/register' ? 600 : 500,
                  }}
                >
                  {t('auth.register')}
                </Link>
              </>
            )}
          </div>
          {/* 移动端汉堡按钮 */}
          <button
            type="button"
            className="r-hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="menu"
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '5px',
              background: 'none',
              border: 'none',
              padding: '8px',
              cursor: 'pointer',
            }}
          >
            <span style={{ display: 'block', width: '22px', height: '2px', backgroundColor: '#000' }} />
            <span style={{ display: 'block', width: '22px', height: '2px', backgroundColor: '#000' }} />
            <span style={{ display: 'block', width: '22px', height: '2px', backgroundColor: '#000' }} />
          </button>
        </div>
        {/* 移动端下拉菜单 */}
        {menuOpen && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: '#fff',
              borderTop: '1px solid #eee',
              boxShadow: '0 8px 16px rgba(0,0,0,0.12)',
              padding: '8px 20px 16px',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 60,
            }}
          >
            {navItems.map((item) => {
              const active =
                item.href === '/'
                  ? pathname === '/'
                  : pathname?.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    padding: '12px 0',
                    borderBottom: '1px solid #f0f0f0',
                    color: '#000',
                    fontSize: '15px',
                    fontWeight: active ? 600 : 400,
                    backgroundColor: active ? '#f5f5f5' : 'transparent',
                  }}
                >
                  {item.label}
                </Link>
              )
            })}
            {user ? (
              <>
                <div style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0', fontSize: '14px', color: '#666' }}>
                  {t('auth.welcome')}, {user.username}
                </div>
                {user.role === 'admin' && (
                  <Link
                    href="/admin/dashboard"
                    onClick={() => setMenuOpen(false)}
                    style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0', color: '#000', fontSize: '15px' }}
                  >
                    {t('auth.admin')}
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout()
                    setMenuOpen(false)
                  }}
                  style={{ background: 'none', border: 'none', textAlign: 'left', padding: '12px 0', color: '#000', fontSize: '15px', cursor: 'pointer' }}
                >
                  {t('auth.logout')}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0', color: '#000', fontSize: '15px' }}
                >
                  {t('auth.login')}
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  style={{ padding: '12px 0', color: '#000', fontSize: '15px' }}
                >
                  {t('auth.register')}
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

