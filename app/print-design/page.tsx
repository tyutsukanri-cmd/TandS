'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { CartItem, loadCartItems, saveCartItems } from '@/lib/cart'
import { getCatalogProduct } from '@/lib/cartCatalog'
import { getPrintBaseImages } from '@/lib/printCatalog'

type PosKey = 'p1' | 'p2' | 'p3' | 'p4'

function yyyymmdd(d = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}${m}${day}`
}

function safeFileSegment(s: string) {
  return s.replace(/[\\/:*?"<>|]/g, '-').replace(/\s+/g, '').slice(0, 80)
}

function posSuffix(pos: PosKey) {
  if (pos === 'p1') return '01'
  if (pos === 'p2') return '02'
  if (pos === 'p3') return '03'
  return '04'
}

function getDefaultPrint(tabId: number) {
  // tabId: 0..7 对应 8 个商品
  if (tabId === 0) {
    return {
      p1: { x: 350, y: 190, scale: 0.6 },
      p2: { x: 165, y: 175, scale: 2 },
      p3: { x: 155, y: 450, scale: 0.6 },
      p4: { x: 135, y: 185, scale: 2.1 },
    }
  }
  if (tabId === 1) {
    return {
      p1: { x: 335, y: 210, scale: 0.6 },
      p2: { x: 165, y: 175, scale: 2 },
      p3: { x: 145, y: 450, scale: 0.8 },
      p4: { x: 130, y: 185, scale: 2.1 },
    }
  }
  if (tabId === 2) {
    return {
      p1: { x: 350, y: 180, scale: 0.7 },
      p2: { x: 160, y: 145, scale: 2.1 },
      p3: { x: 125, y: 440, scale: 0.9 },
      p4: { x: 100, y: 100, scale: 2.5 },
    }
  }
  if (tabId === 3) {
    return {
      p1: { x: 320, y: 170, scale: 0.7 },
      p2: { x: 160, y: 155, scale: 2.1 },
      p3: { x: 130, y: 430, scale: 0.9 },
      p4: { x: 145, y: 160, scale: 2 },
    }
  }
  if (tabId === 4) {
    return {
      p1: { x: 310, y: 160, scale: 0.7 },
      p2: { x: 155, y: 155, scale: 2 },
      p3: { x: 0, y: 0, scale: 1 }, // 位置3锁定，不使用
      p4: { x: 145, y: 140, scale: 2 },
    }
  }
  if (tabId === 5) {
    return {
      p1: { x: 320, y: 270, scale: 0.6 },
      p2: { x: 170, y: 245, scale: 2 },
      p3: { x: 0, y: 0, scale: 1 }, // 位置3锁定，不使用
      p4: { x: 135, y: 195, scale: 1.9 },
    }
  }
  if (tabId === 6) {
    return {
      p1: { x: 220, y: 360, scale: 1.3 },
      p2: { x: 0, y: 0, scale: 1 }, // 位置2锁定，不使用
      p3: { x: 0, y: 0, scale: 1 }, // 位置3锁定，不使用
      p4: { x: 210, y: 360, scale: 1.1 },
    }
  }
  if (tabId === 7) {
    return {
      p1: { x: 220, y: 360, scale: 1.3 },
      p2: { x: 0, y: 0, scale: 1 }, // 位置2锁定，不使用
      p3: { x: 0, y: 0, scale: 1 }, // 位置3锁定，不使用
      p4: { x: 210, y: 360, scale: 1.1 },
    }
  }
  // 默认情况（不应该到达这里）
  return {
    p1: { x: 320, y: 270, scale: 0.6 },
    p2: { x: 170, y: 245, scale: 2 },
    p3: { x: 0, y: 0, scale: 1 }, // 位置3锁定，不使用
    p4: { x: 135, y: 195, scale: 1.9 },
  }
}

export default function PrintDesignPage() {
  const router = useRouter()
  const [cartId, setCartId] = useState('')

  const [items, setItems] = useState<CartItem[]>([])
  const [current, setCurrent] = useState<CartItem | null>(null)
  const [username, setUsername] = useState<string>('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const inputRefs = useRef<Record<PosKey, HTMLInputElement | null>>({
    p1: null,
    p2: null,
    p3: null,
    p4: null,
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    const sp = new URLSearchParams(window.location.search)
    setCartId(sp.get('cartId') || '')
  }, [])

  useEffect(() => {
    const loaded = loadCartItems()
    setItems(loaded)
    const found = loaded.find((x) => x.cartId === cartId) ?? null
    setCurrent(found)
  }, [cartId])

  useEffect(() => {
    fetch('/api/user/me')
      .then(async (r) => {
        if (!r.ok) return ''
        const data = await r.json()
        return (data?.user?.username ?? '') as string
      })
      .then(setUsername)
      .catch(() => setUsername(''))
  }, [])

  const product = useMemo(() => {
    if (!current) return null
    return getCatalogProduct(current.productTabId)
  }, [current])

  const baseImages = useMemo(() => {
    if (!current) return { left: '/images/weizhi1.png', right: '/images/weizhi2.png' }
    return getPrintBaseImages(current.productTabId, current.color)
  }, [current])

  const print = current?.print ?? {}

  const defaults = useMemo(() => getDefaultPrint(current?.productTabId ?? 0), [current?.productTabId])

  const mergedPrint = useMemo(() => {
    return {
      p1: { ...defaults.p1, ...(print.p1 ?? {}) },
      p2: { ...defaults.p2, ...(print.p2 ?? {}) },
      p3: { ...defaults.p3, ...(print.p3 ?? {}) },
      p4: { ...defaults.p4, ...(print.p4 ?? {}) },
    }
  }, [defaults, print.p1, print.p2, print.p3, print.p4])

  const setPos = (pos: PosKey, patch: Partial<{ fileName?: string; filePath?: string; x: number; y: number; scale: number }>) => {
    if (!current) return
    const next: CartItem = {
      ...current,
      print: {
        ...(current.print ?? {}),
        [pos]: {
          ...(defaults as any)[pos],
          ...((current.print ?? {})[pos] ?? {}),
          ...patch,
        },
      },
    }
    setCurrent(next)
  }

  const deletePos = async (pos: PosKey) => {
    if (!current) return
    const fp = current.print?.[pos]?.filePath
    const filePath = fp ? fp.split('?')[0] : ''
    if (filePath) {
      try {
        await fetch('/api/uploads/png', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filePath }),
        })
      } catch {}
    }
    setPos(pos, { fileName: '', filePath: '' })
  }

  const triggerUpload = (pos: PosKey) => {
    const el = inputRefs.current[pos]
    if (el) el.value = ''
    el?.click()
  }

  const onPickFile = async (pos: PosKey, file: File | null) => {
    setError('')
    if (!current || !product) return
    if (!file) return
    if (file.type !== 'image/png' && !file.name.toLowerCase().endsWith('.png')) {
      setError('PNG形式の画像のみアップロードできます。')
      return
    }
    if (!username) {
      setError('ログインしてから画像をアップロードしてください。')
      return
    }

    // 商品 5/6（圆领卫衣/连帽卫衣）强制锁定位置3
    if ((current.productTabId === 4 || current.productTabId === 5) && pos === 'p3') {
      setError('この商品は印刷できません。')
      return
    }
    // 商品 7/8（トートバッグ①/②）强制锁定位置2和3
    if ((current.productTabId === 6 || current.productTabId === 7) && (pos === 'p2' || pos === 'p3')) {
      setError('この商品は印刷できません。')
      return
    }

    const suffix = posSuffix(pos)
    const prefix = safeFileSegment(current.displayId || username)
    const baseName = `${prefix}-${safeFileSegment(product.name)}-${safeFileSegment(current.size)}-${safeFileSegment(current.color)}-${suffix}.png`
    const dateFolder = yyyymmdd()
    const form = new FormData()
    form.append('file', file)
    form.append('fileName', baseName)
    form.append('dateFolder', dateFolder)

    setSaving(true)
    try {
      const res = await fetch('/api/uploads/png', { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error || 'アップロードに失敗しました')
      }
      const filePath = data?.filePath as string
      const fileName = data?.fileName as string

      // my-cart 位置框显示：原图名-01~04 的形式（仅显示名，不含路径）
      // 同一路径重复上传时，用 query 参数强制刷新缓存
      const bustedPath = `${filePath}${filePath.includes('?') ? '&' : '?'}v=${Date.now()}`
      setPos(pos, { fileName, filePath: bustedPath })
    } catch (e: any) {
      setError(e?.message || 'アップロードに失敗しました')
    } finally {
      setSaving(false)
    }
  }

  const submit = () => {
    if (!current) return
    const next = items.map((x) => (x.cartId === current.cartId ? current : x))

    // 同步位置1-4不可编辑框内容（展示用）
    const p1 = current.print?.p1?.fileName ?? ''
    const p2 = current.print?.p2?.fileName ?? ''
    const p3 = current.print?.p3?.fileName ?? ''
    const p4 = current.print?.p4?.fileName ?? ''

    const next2 = next.map((x) =>
      x.cartId === current.cartId
        ? {
            ...current,
            positions: {
              p1,
              p2,
              p3,
              p4,
            },
          }
        : x
    )

    saveCartItems(next2)
    router.push('/my-cart')
  }

  return (
    <div style={{ paddingTop: '20px', paddingBottom: '40px' }}>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '0 20px' }}>
          <div style={{ width: '1500px' }}>
          <h1 style={{ marginBottom: '12px', fontSize: '26px' }}>プリントデザインプレビュー</h1>

          {/* 顶部 1500x400：左说明 + 右两张固定说明图 */}
          <div style={{ width: '1500px', height: '400px', display: 'flex', gap: '12px', marginBottom: '12px' }}>
            <div
              style={{
                width: '300px',
                height: '400px',
                border: '1px solid #e0e0e0',
                borderRadius: '10px',
                padding: '12px',
                background: '#fff',
                fontSize: '14px',
                color: '#333',
              }}
            >
              プリント説明
              <p>右図のように、該当する位置のボタンをクリックして画像をアップロードし、デザインのプレビューをご確認ください。
                  X（左右）、Y（上下）、S（サイズ）の数値で画像の位置とサイズを調整できます。
                  表示はデザインプレビュー用です。実際の印刷仕上がりについては、別途お問い合わせください。</p>
              
              {current && product && (
                <div style={{ marginTop: '10px', fontSize: '12px', color: '#57606a', lineHeight: 1.6 }}>
                  選択中の商品：{product.name}
                  <br />
                  カラー：{current.color}
                  <br />
                  サイズ：{current.size}
                </div>
              )}
              {error && <div style={{ marginTop: '10px', color: '#dc3545', fontSize: '12px' }}>{error}</div>}
            </div>

            <div style={{ flex: 1, height: '400px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div
                style={{
                  width: '100%',
                  height: '400px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '10px',
                  background: '#f8f8f8',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Image src="/images/weizhi1.png" alt="weizhi1" fill style={{ objectFit: 'contain' }} />
              </div>
              <div
                style={{
                  width: '100%',
                  height: '400px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '10px',
                  background: '#f8f8f8',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Image src="/images/weizhi2.png" alt="weizhi2" fill style={{ objectFit: 'contain' }} />
              </div>
            </div>
          </div>

          {/* 下方 1500x700：左预览 + 中预览 + 右控制区（不需要滚动条） */}
          <div style={{ width: '1500px', height: '700px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
            {/* 左预览 560x700 */}
            <div
              style={{
                width: '560px',
                height: '700px',
                border: '1px solid #e0e0e0',
                borderRadius: '10px',
                background: '#f8f8f8',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Image src={baseImages.left} alt="left-preview" fill style={{ objectFit: 'contain', transform: 'scale(1.12)', transformOrigin: 'center' }} />

              {/* 位置1/2/3 叠加在左图 */}
              {(['p1', 'p2', 'p3'] as PosKey[]).map((pos) => {
                const pp = mergedPrint[pos]
                const src = current?.print?.[pos]?.filePath
                if (!src) return null
                return (
                  <div
                    key={pos}
                    style={{
                      position: 'absolute',
                      left: `${pp.x}px`,
                      top: `${pp.y}px`,
                      width: `${120 * pp.scale}px`,
                      height: `${120 * pp.scale}px`,
                      pointerEvents: 'none',
                    }}
                  >
                    <Image src={src} alt={pos} fill style={{ objectFit: 'contain' }} />
                  </div>
                )
              })}
            </div>

            {/* 右预览 560x700 */}
            <div
              style={{
                width: '560px',
                height: '700px',
                border: '1px solid #e0e0e0',
                borderRadius: '10px',
                background: '#f8f8f8',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Image src={baseImages.right} alt="right-preview" fill style={{ objectFit: 'contain', transform: 'scale(1.12)', transformOrigin: 'center' }} />

              {/* 位置4 叠加在右图 */}
              {(() => {
                const pos: PosKey = 'p4'
                const pp = mergedPrint[pos]
                const src = current?.print?.[pos]?.filePath
                if (!src) return null
                return (
                  <div
                    style={{
                      position: 'absolute',
                      left: `${pp.x}px`,
                      top: `${pp.y}px`,
                      width: `${140 * pp.scale}px`,
                      height: `${140 * pp.scale}px`,
                      pointerEvents: 'none',
                    }}
                  >
                    <Image src={src} alt={pos} fill style={{ objectFit: 'contain' }} />
                  </div>
                )
              })()}
            </div>

            {/* 控制区 356x700 */}
            <div
              style={{
                width: '356px',
                height: '700px',
                border: '1px solid #e0e0e0',
                borderRadius: '10px',
                padding: '10px',
                background: '#fff',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              {(['p1', 'p2', 'p3', 'p4'] as PosKey[]).map((pos) => {
                const suffix = posSuffix(pos)
                const shownName = current?.print?.[pos]?.fileName ?? ''
                const locked = ((current?.productTabId === 4 || current?.productTabId === 5) && pos === 'p3') || 
                 ((current?.productTabId === 6 || current?.productTabId === 7) && (pos === 'p2' || pos === 'p3'))
                return (
                  <div key={pos} style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingBottom: '10px', borderBottom: '1px solid #f0f0f0' }}>
                    <div style={{ fontSize: '12px', color: '#333', fontWeight: 600 }}>位置{suffix}</div>
                    <input
                      value={shownName}
                      onChange={(e) => setPos(pos, { fileName: e.target.value })}
                      style={{
                        width: '100%',
                        height: '28px',
                        border: '1px solid #d0d7de',
                        borderRadius: '8px',
                        background: '#fff',
                        padding: '0 8px',
                        fontSize: '12px',
                      }}
                    />
                    <input
                      ref={(el) => {
                        inputRefs.current[pos] = el
                      }}
                      type="file"
                      accept="image/png"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? null
                        // 清空 value，确保用户可以重复选择同一个文件名触发 onChange
                        e.target.value = ''
                        onPickFile(pos, file)
                      }}
                    />
                    <button
                      type="button"
                      className="btn"
                      style={{ height: '30px', fontSize: '12px', borderColor: locked ? '#dc3545' : undefined, color: locked ? '#dc3545' : undefined }}
                      onClick={() => {
                        if (locked) {
                          setError('この商品はプリントに対応していません')
                          return
                        }
                        triggerUpload(pos)
                      }}
                      disabled={saving}
                    >
                      画像をアップロード
                    </button>

                    {/* 可调整参数：改这里即可影响叠加位置/大小（你之后也可以让我换成拖拽） */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <div style={{ fontSize: '11px', color: '#57606a' }}>X</div>
                        <input
                          type="number"
                          value={mergedPrint[pos].x}
                          onChange={(e) => setPos(pos, { x: Number(e.target.value) })}
                          style={{ width: '78px', height: '24px', border: '1px solid #d0d7de', borderRadius: '6px', padding: '0 6px', fontSize: '12px' }}
                        />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <div style={{ fontSize: '11px', color: '#57606a' }}>Y</div>
                        <input
                          type="number"
                          value={mergedPrint[pos].y}
                          onChange={(e) => setPos(pos, { y: Number(e.target.value) })}
                          style={{ width: '78px', height: '24px', border: '1px solid #d0d7de', borderRadius: '6px', padding: '0 6px', fontSize: '12px' }}
                        />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <div style={{ fontSize: '11px', color: '#57606a' }}>S</div>
                        <input
                          type="number"
                          step="0.05"
                          value={mergedPrint[pos].scale}
                          onChange={(e) => setPos(pos, { scale: Number(e.target.value) })}
                          style={{ width: '78px', height: '24px', border: '1px solid #d0d7de', borderRadius: '6px', padding: '0 6px', fontSize: '12px' }}
                        />
                      </div>
                      <button
                        type="button"
                        className="btn"
                        style={{ height: '24px', padding: '0 10px', fontSize: '12px', borderColor: '#dc3545', color: '#dc3545' }}
                        onClick={() => deletePos(pos)}
                        disabled={saving}
                      >
                        削除
                      </button>
                    </div>
                  </div>
                )
              })}

              <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button type="button" className="btn btn-primary" style={{ height: '36px' }} onClick={submit} disabled={!current}>
                  送信
                </button>
                <button type="button" className="btn" style={{ height: '36px' }} onClick={() => router.push('/my-cart')}>
                  戻る
                </button>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
  )
}

