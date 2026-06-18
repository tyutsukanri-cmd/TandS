export type CartItem = {
  cartId: string
  displayId?: string
  productTabId: number
  color: string
  size: string
  quantity: number
  positions: { p1: string; p2: string; p3: string; p4: string }
  note: string
  print?: {
    p1?: { fileName?: string; filePath?: string; x: number; y: number; scale: number }
    p2?: { fileName?: string; filePath?: string; x: number; y: number; scale: number }
    p3?: { fileName?: string; filePath?: string; x: number; y: number; scale: number }
    p4?: { fileName?: string; filePath?: string; x: number; y: number; scale: number }
  }
}

const STORAGE_KEY = 'tands_cart_items_v1'

export function loadCartItems(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed as CartItem[]
  } catch {
    return []
  }
}

export function saveCartItems(items: CartItem[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function createCartId() {
  return `cart_${Date.now()}_${Math.random().toString(16).slice(2)}`
}

function seqKey(username: string) {
  return `tands_cart_seq_${username}`
}

export function allocateDisplayId(username: string) {
  const u = username || 'guest'
  if (typeof window === 'undefined') return `${u}-01`
  const key = seqKey(u)
  const raw = window.localStorage.getItem(key)
  const current = raw ? Number(raw) : 0
  const next = Number.isFinite(current) && current > 0 ? current + 1 : 1
  window.localStorage.setItem(key, String(next))
  return `${u}-${String(next).padStart(2, '0')}`
}

