'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { allocateDisplayId, CartItem, createCartId, loadCartItems, saveCartItems } from '@/lib/cart'
import { CART_CATALOG, getCatalogProduct } from '@/lib/cartCatalog'
import { getPrintBaseImages } from '@/lib/printCatalog'
import { useRouter } from 'next/navigation'
import { useI18n } from '@/components/I18nProvider'

type MeUser = { id: number; username: string; role: string }

const MAX_QTY = 200

function clampQuantity(n: number) {
  if (!Number.isFinite(n)) return 1
  return Math.min(MAX_QTY, Math.max(1, Math.floor(n)))
}

function OverlaySelect({
  value,
  options,
  onChange,
  width = 150,
}: {
  value: string
  options: string[]
  onChange: (v: string) => void
  width?: number
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current) return
      if (!(e.target instanceof Node)) return
      if (!rootRef.current.contains(e.target)) setOpen(false)
    }
    window.addEventListener('mousedown', onDown)
    return () => window.removeEventListener('mousedown', onDown)
  }, [open])

  return (
    <div ref={rootRef} style={{ position: 'relative', width }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          width: '100%',
          height: '22px',
          border: '1px solid #d0d7de',
          borderRadius: '6px',
          background: '#fff',
          textAlign: 'left',
          padding: '0 10px',
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          cursor: 'pointer',
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value || '请选择'}</span>
        <span style={{ color: '#57606a', fontSize: '12px' }}>▾</span>
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: '26px',
            left: 0,
            right: 0,
            zIndex: 50,
            border: '1px solid #d0d7de',
            borderRadius: '8px',
            background: '#fff',
            boxShadow: '0 8px 24px rgba(140,149,159,0.2)',
            maxHeight: '240px',
            overflowY: 'auto',
            padding: '6px',
          }}
        >
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt)
                setOpen(false)
              }}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '8px 10px',
                borderRadius: '6px',
                border: 0,
                background: opt === value ? 'rgba(244,162,97,0.18)' : '#fff',
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function MyCartPage() {
  const router = useRouter()
  const { t } = useI18n()
  const [items, setItems] = useState<CartItem[]>([])
  const [me, setMe] = useState<MeUser | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [addTabId, setAddTabId] = useState(CART_CATALOG[0]?.tabId ?? 0)
  const [hydrated, setHydrated] = useState(false)
  const [qtyNotice, setQtyNotice] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const qtyNoticeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showMaxQtyNotice = () => {
    setQtyNotice(`MAX数量${MAX_QTY}`)
    if (qtyNoticeTimerRef.current) clearTimeout(qtyNoticeTimerRef.current)
    qtyNoticeTimerRef.current = setTimeout(() => setQtyNotice(''), 1600)
  }

  useEffect(() => {
    setItems(loadCartItems())
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    saveCartItems(items)
  }, [items, hydrated])

  useEffect(() => {
    let alive = true
    fetch('/api/user/me')
      .then(async (r) => {
        if (!r.ok) return null
        const data = await r.json()
        return (data?.user ?? null) as MeUser | null
      })
      .then((u) => {
        if (!alive) return
        setMe(u)
      })
      .catch(() => {
        if (!alive) return
        setMe(null)
      })
    return () => {
      alive = false
    }
  }, [])

  const productOptions = useMemo(() => CART_CATALOG.map((p) => p.name), [])

  const addProductOptions = useMemo(
    () =>
      CART_CATALOG.map((p) => ({
        name: p.name,
        tabId: p.tabId,
      })),
    []
  )

  const addProductName = useMemo(() => {
    const p = getCatalogProduct(addTabId)
    return p?.name ?? CART_CATALOG[0]?.name ?? ''
  }, [addTabId])

  const submitNext = async () => {
    if (submitting) return
    if (!me?.username) {
      alert('ログインしてから送信してください')
      router.push('/login')
      return
    }
    if (items.length === 0) {
      alert('商品がありません')
      return
    }

    setSubmitting(true)
    try {
      const payloadItems = items.map((it) => {
        const p = getCatalogProduct(it.productTabId)
        return {
          productName: p?.name ?? '',
          size: it.size,
          color: it.color,
          quantity: it.quantity,
          positions: it.positions,
          note: it.note,
          print: it.print,
        }
      })
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: payloadItems }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) throw new Error(data?.error || '送信に失敗しました')

      // 下单成功后清空购物车（不可再编辑）
      setItems([])
      saveCartItems([])

      const orderNumber = data?.order?.orderNumber as string | undefined
      if (orderNumber) {
        router.push(`/orders?orderNumber=${encodeURIComponent(orderNumber)}`)
      } else {
        router.push('/orders')
      }
    } catch (e: any) {
      alert(e?.message || '送信に失敗しました')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container" style={{ paddingTop: '20px', paddingBottom: '40px' }}>
        {qtyNotice && (
          <div
            style={{
              position: 'fixed',
              top: '78px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1000,
              background: 'rgba(0,0,0,0.78)',
              color: '#fff',
              fontSize: '36px',
              padding: '20px 40px',
              borderRadius: '999px',
            }}
          >
            {qtyNotice}
          </div>
        )}

        {/* 1000px 内容居中 */}
        <div style={{ width: '1000px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <h1 style={{ marginBottom: '10px', fontSize: '26px' }}>{t('myCart.title')}</h1>
          </div>

          {/* 顶部信息条 1000x25 */}
          <div
            style={{
              width: '1000px',
              height: '25px',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              background: '#fafafa',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 10px',
              marginBottom: '12px',
            }}
          >
            <div style={{ fontSize: '12px', color: '#333' }}>{me?.username ? <>用户：{me.username}</> : <span />}</div>
            <button
              type="button"
              className="btn btn-primary"
              style={{ height: '22px', padding: '0 14px', fontSize: '12px' }}
              onClick={submitNext}
              disabled={submitting}
            >
              {t('myCart.submit')}
            </button>
          </div>

          {/* 提示框 */}
          <div
            style={{
              width: '1000px',
              border: '1px solid #ffe08a',
              borderRadius: '10px',
              background: '#fff8db',
              padding: '12px',
              marginBottom: '12px',
              fontSize: '12px',
              color: '#5f6368',
              lineHeight: 1.6,
            }}
          >
            {t('myCart.notice')}
          </div>

          {/* 商品列表（新增的在 “点击添加商品” 上面） */}
          <div style={{ width: '1000px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {items.length === 0 && (
              <div
                style={{
                  width: '1000px',
                  border: '1px dashed #d0d7de',
                  borderRadius: '10px',
                  padding: '16px',
                  color: '#5f6368',
                  fontSize: '14px',
                  background: '#fff',
                }}
              >
                {t('myCart.empty')}
              </div>
            )}

            {items.map((it) => {
              const product = getCatalogProduct(it.productTabId)
              const productName = product.name
              const colors = product.colors
              const sizes = product.sizes
              const safeColor = colors.includes(it.color) ? it.color : colors[0]
              const safeSize = sizes.includes(it.size) ? it.size : sizes[0] ?? ''
              const imageUrl = getPrintBaseImages(it.productTabId, safeColor).left

              return (
                <div
                  key={it.cartId}
                  style={{
                    width: '1000px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '10px',
                    padding: '12px',
                    background: '#fff',
                  }}
                >
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    {/* 左侧图片 60x100 */}
                    <div
                      style={{
                        width: '60px',
                        height: '100px',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        background: '#f8f8f8',
                        position: 'relative',
                        overflow: 'hidden',
                        flex: '0 0 auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {imageUrl ? (
                        <Image src={imageUrl} alt={productName} fill style={{ objectFit: 'contain' }} />
                      ) : (
                        <span style={{ fontSize: '10px', color: '#999' }}>No Image</span>
                      )}
                    </div>

                  {/* 中间：名字/颜色/尺码/数量 */}
                  <div style={{ height: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '320px' }}>
                    <div style={{ height: '25px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '44px', fontSize: '12px', color: '#333' }}>商品</div>
                      <OverlaySelect
                        value={productName}
                        options={productOptions}
                        onChange={(name) => {
                          const next = [...items]
                          const idx = next.findIndex((x) => x.cartId === it.cartId)
                          if (idx === -1) return
                          const selected = CART_CATALOG.find((p) => p.name === name) ?? CART_CATALOG[0]
                          next[idx] = {
                            ...next[idx],
                            productTabId: selected.tabId,
                            color: selected.colors[0] ?? '',
                            size: selected.sizes[0] ?? '',
                          }
                          setItems(next)
                        }}
                        width={220}
                      />
                    </div>

                    <div style={{ height: '25px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '44px', fontSize: '12px', color: '#333' }}>カラー</div>
                      <OverlaySelect
                        value={safeColor}
                        options={colors}
                        onChange={(color) => {
                          const next = [...items]
                          const idx = next.findIndex((x) => x.cartId === it.cartId)
                          if (idx === -1) return
                          next[idx] = { ...next[idx], color }
                          setItems(next)
                        }}
                        width={220}
                      />
                    </div>

                    <div style={{ height: '25px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '44px', fontSize: '12px', color: '#333' }}>サイズ</div>
                      <OverlaySelect
                        value={safeSize}
                        options={sizes}
                        onChange={(size) => {
                          const next = [...items]
                          const idx = next.findIndex((x) => x.cartId === it.cartId)
                          if (idx === -1) return
                          next[idx] = { ...next[idx], size }
                          setItems(next)
                        }}
                        width={220}
                      />
                    </div>

                    <div style={{ height: '25px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '44px', fontSize: '12px', color: '#333' }}>数量</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <input
                          value={String(it.quantity ?? 1)}
                          inputMode="numeric"
                          onChange={(e) => {
                            const raw = Number(e.target.value)
                            if (raw > MAX_QTY) showMaxQtyNotice()
                            const n = clampQuantity(raw)
                            const next = [...items]
                            const idx = next.findIndex((x) => x.cartId === it.cartId)
                            if (idx === -1) return
                            next[idx] = { ...next[idx], quantity: n }
                            setItems(next)
                          }}
                          style={{
                            width: '70px',
                            height: '22px',
                            border: '1px solid #d0d7de',
                            borderRadius: '6px',
                            padding: '0 8px',
                            fontSize: '12px',
                          }}
                        />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <button
                            type="button"
                            onClick={() => {
                              const next = [...items]
                              const idx = next.findIndex((x) => x.cartId === it.cartId)
                              if (idx === -1) return
                              const current = next[idx].quantity ?? 1
                              if (current >= MAX_QTY) {
                                showMaxQtyNotice()
                                next[idx] = { ...next[idx], quantity: MAX_QTY }
                              } else {
                                next[idx] = { ...next[idx], quantity: clampQuantity(current + 1) }
                              }
                              setItems(next)
                            }}
                            style={{
                              width: '22px',
                              height: '10px',
                              border: '1px solid #d0d7de',
                              borderRadius: '4px',
                              background: '#fff',
                              fontSize: '10px',
                              lineHeight: '10px',
                              cursor: 'pointer',
                            }}
                            aria-label="1つ増やす"
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const next = [...items]
                              const idx = next.findIndex((x) => x.cartId === it.cartId)
                              if (idx === -1) return
                              next[idx] = { ...next[idx], quantity: clampQuantity((next[idx].quantity ?? 1) - 1) }
                              setItems(next)
                            }}
                            style={{
                              width: '22px',
                              height: '10px',
                              border: '1px solid #d0d7de',
                              borderRadius: '4px',
                              background: '#fff',
                              fontSize: '10px',
                              lineHeight: '10px',
                              cursor: 'pointer',
                            }}
                            aria-label="1つ減らす"
                          >
                            ▼
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 位置1-4（只读） */}
                  <div style={{ height: '100px', display: 'grid', gridTemplateColumns: '72px 180px', gridTemplateRows: 'repeat(4, 25px)', columnGap: '8px' }}>
                    {[
                      ['位置1', it.positions?.p1 ?? ''],
                      ['位置2', it.positions?.p2 ?? ''],
                      ['位置3', it.positions?.p3 ?? ''],
                      ['位置4', it.positions?.p4 ?? ''],
                    ].map(([label, v]) => (
                      <div key={label} style={{ display: 'contents' }}>
                        <div style={{ height: '25px', display: 'flex', alignItems: 'center', fontSize: '12px', color: '#333' }}>{label}</div>
                        <div
                          style={{
                            height: '22px',
                            border: '1px solid #d0d7de',
                            borderRadius: '6px',
                            background: '#f6f8fa',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0 8px',
                            fontSize: '12px',
                            color: '#57606a',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                          title={v}
                        >
                          {v}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 右侧：编辑印花/备注/删除 */}
                  <div style={{ marginLeft: 'auto', height: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '320px' }}>
                    <button
                      type="button"
                      className="btn"
                      style={{ height: '25px', padding: '0 12px', fontSize: '12px' }}
                      onClick={() => {
                        router.push(`/print-design?cartId=${encodeURIComponent(it.cartId)}`)
                      }}
                    >
                      クリックしてプリントを編集
                    </button>

                    <div style={{ height: '50px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '40px', fontSize: '12px', color: '#333' }}>コメント</div>
                      <input
                        value={it.note ?? ''}
                        onChange={(e) => {
                          const next = [...items]
                          const idx = next.findIndex((x) => x.cartId === it.cartId)
                          if (idx === -1) return
                          next[idx] = { ...next[idx], note: e.target.value }
                          setItems(next)
                        }}
                        placeholder="コメントを入力してください"
                        style={{
                          flex: 1,
                          height: '32px',
                          border: '1px solid #d0d7de',
                          borderRadius: '8px',
                          padding: '0 10px',
                          fontSize: '12px',
                        }}
                      />
                    </div>

                    <button
                      type="button"
                      className="btn"
                      style={{ height: '25px', padding: '0 12px', fontSize: '12px', borderColor: '#dc3545', color: '#dc3545' }}
                      onClick={async () => {
                        const filePaths = [
                          it.print?.p1?.filePath,
                          it.print?.p2?.filePath,
                          it.print?.p3?.filePath,
                          it.print?.p4?.filePath,
                        ]
                          .filter(Boolean)
                          .map((p) => String(p).split('?')[0])

                        for (const fp of filePaths) {
                          try {
                            await fetch('/api/uploads/png', {
                              method: 'DELETE',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ filePath: fp }),
                            })
                          } catch {}
                        }

                        setItems((prev) => prev.filter((x) => x.cartId !== it.cartId))
                      }}
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
              )
            })}

            {/* 点击添加商品 */}
            <div style={{ width: '1000px', display: 'flex', justifyContent: 'center', marginTop: '4px' }}>
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setAddOpen((v) => !v)}
                  style={{
                    width: '160px',
                    height: '36px',
                    borderRadius: '999px',
                    border: '1px solid #d0d7de',
                    background: '#fff',
                    fontSize: '12px',
                    fontWeight: 600,
                    lineHeight: '36px',
                    cursor: 'pointer',
                  }}
                  aria-label="商品を追加"
                  title="商品を追加"
                >
                  クリックして商品を追加
                </button>

                {addOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '52px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '320px',
                      border: '1px solid #d0d7de',
                      borderRadius: '10px',
                      background: '#fff',
                      boxShadow: '0 8px 24px rgba(140,149,159,0.2)',
                      padding: '12px',
                      zIndex: 60,
                    }}
                  >
                    <div style={{ fontSize: '12px', color: '#333', marginBottom: '8px' }}>商品を選択</div>
                    <OverlaySelect
                      value={addProductName}
                      options={addProductOptions.map((x) => x.name)}
                      onChange={(name) => {
                        const selected = CART_CATALOG.find((p) => p.name === name) ?? CART_CATALOG[0]
                        setAddTabId(selected.tabId)
                      }}
                      width={296}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                      <button type="button" className="btn" style={{ height: '28px', padding: '0 12px', fontSize: '12px' }} onClick={() => setAddOpen(false)}>
                        キャンセル
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        style={{ height: '28px', padding: '0 12px', fontSize: '12px' }}
                        onClick={() => {
                          const p = getCatalogProduct(addTabId)
                          const displayId = allocateDisplayId(me?.username ?? 'guest')
                          const next: CartItem = {
                            cartId: createCartId(),
                            displayId,
                            productTabId: p.tabId,
                            color: p.colors[0] ?? '',
                            size: p.sizes[0] ?? '',
                            quantity: 1,
                            positions: { p1: '', p2: '', p3: '', p4: '' },
                            note: '',
                          }
                          setItems((prev) => [...prev, next])
                          setAddOpen(false)
                        }}
                      >
                        追加
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

