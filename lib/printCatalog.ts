export function getPrintBaseImages(tabId: number, color: string) {
  // 返回 { left, right }：左图/右图底图
  // 若找不到，就回退到默认说明图
  const fallback = { left: '/images/weizhi1.png', right: '/images/weizhi2.png' }

  // 1) 短袖T恤 public/01duant
  if (tabId === 0) {
    if (color === 'ホワイト') return { left: '/01duant/wz1.png', right: '/01duant/wb1.png' }
    if (color === 'ブラック') return { left: '/01duant/bz1.png', right: '/01duant/bb1.png' }
    if (color === 'アプリコット') return { left: '/01duant/az1.png', right: '/01duant/ab1.png' }
    return fallback
  }

  // 2) 水洗短T恤 public/02shuixi（只有黑色）
  if (tabId === 1) {
    return { left: '/02shuixi/sz1.png', right: '/02shuixi/sb1.png' }
  }

  // 3) 长袖T恤 public/03changxiut
  if (tabId === 2) {
    if (color === 'ホワイト') return { left: '/03changxiut/ww1.png', right: '/03changxiut/ww2.png' }
    if (color === 'ブラック') return { left: '/03changxiut/bb1.png', right: '/03changxiut/bb2.png' }
    return fallback
  }

  // 4) オーバーサイズ public/04obat
  if (tabId === 3) {
    if (color === 'ホワイト') return { left: '/04obat/011.png', right: '/04obat/012.png' }
    if (color === 'ブラック') return { left: '/04obat/021.png', right: '/04obat/022.png' }
    if (color === 'ワインレッド') return { left: '/04obat/031.png', right: '/04obat/032.png' }
    if (color === 'グレーアプリコット') return { left: '/04obat/041.png', right: '/04obat/042.png' }
    if (color === 'コーヒーブラウン') return { left: '/04obat/051.png', right: '/04obat/052.png' }
    return fallback
  }

  // 5) 圆领卫衣 public/05yuanlingweiyi
  if (tabId === 4) {
    if (color === 'ホワイト') return { left: '/05yuanlingweiyi/wwww1.png', right: '/05yuanlingweiyi/wwww2.png' }
    if (color === 'ブラック') return { left: '/05yuanlingweiyi/bbb1.png', right: '/05yuanlingweiyi/bbb2.png' }
    return fallback
  }

  // 6) 连帽卫衣 public/06daimaoweiyi
  if (tabId === 5) {
    if (color === 'ホワイト') return { left: '/06daimaoweiyi/wwww1.png', right: '/06daimaoweiyi/wwww2.png' }
    if (color === 'ブラック') return { left: '/06daimaoweiyi/bbbb1.png', right: '/06daimaoweiyi/bbbb2.png' }
    return fallback
  }

  return fallback
}

