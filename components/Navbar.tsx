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
        </div>
      </div>
    </nav>
  )
}

