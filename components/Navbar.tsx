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
    { label: t('nav.home'), href: '/', icon: '/inc/home.png' },
    { label: t('nav.about'), href: '/about-us', icon: '/inc/gongsi.png' },
    { label: t('nav.productDetails'), href: '/product-details', icon: '/inc/xiangqing.png' },
    { label: t('nav.myCart'), href: '/my-cart', icon: '/inc/gouwuche.png' },
    { label: t('nav.orders'), href: '/orders', icon: '/inc/dingdan.png' },
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
        overflow: 'hidden',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        padding: '10px 0',
        marginBottom: '10px',
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: "url('/img/a638ca8ce0beb62b097aca52d3d869b6.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'blur(10px)',
          transform: 'scale(1.08)',
          zIndex: 0,
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          zIndex: 0,
        }}
      />
      <div
        className="container"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1,
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
              backgroundColor: 'rgba(255, 255, 255, 0.75)',
              borderRadius: '999px',
              padding: '6px 10px',
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
                    borderBottom: active ? '2px solid #1a73e8' : '2px solid transparent',
                    color: active ? '#1a73e8' : '#5f6368',
                    fontWeight: active ? 600 : 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Image
                    src={item.icon}
                    alt={item.label}
                    width={16}
                    height={16}
                    style={{ width: '16px', height: '16px' }}
                  />
                  {item.label}
                </Link>
              )
            })}
          </div>

          <div
            style={{
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
              padding: '6px 10px',
              borderRadius: '999px',
              backgroundColor: 'rgba(255, 255, 255, 0.75)',
            }}
          >
            {user ? (
              <>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#5f6368' }}>
                  <Image
                    src="/inc/yonghu.png"
                    alt="user icon"
                    width={16}
                    height={16}
                    style={{ width: '16px', height: '16px' }}
                  />
                  {t('auth.welcome')}, {user.username}
                </span>
                {user.role === 'admin' && (
                  <Link href="/admin/dashboard" className="btn btn-secondary">
                    {t('auth.admin')}
                  </Link>
                )}
                <button onClick={handleLogout} className="btn btn-danger">
                  {t('auth.logout')}
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn btn-secondary">
                  {t('auth.login')}
                </Link>
                <Link href="/register" className="btn btn-primary">
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

