export type CartCatalogProduct = {
  tabId: number
  name: string
  colors: string[]
  imagesByColor: Record<string, string[]>
  sizes: string[]
}

export const CART_CATALOG: CartCatalogProduct[] = [
  {
    tabId: 0,
    name: 'Tシャツ',
    colors: ['ホワイト', 'ブラック', 'アプリコット'],
    imagesByColor: {
      ホワイト: ['/01duant/wc11.png', '/01duant/wc1.png', '/01duant/wc2.png', '/01duant/wc3.png'],
      ブラック: ['/01duant/bc11.png', '/01duant/bc1.png', '/01duant/bc2.png', '/01duant/bc3.png'],
      アプリコット: ['/01duant/ac11.png', '/01duant/ac1.png', '/01duant/ac2.png', '/01duant/ac3.png'],
    },
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
  },
  {
    tabId: 1,
    name: 'ウォッシュTシャツ',
    colors: ['ブラック'],
    imagesByColor: {
      ブラック: ['/02shuixi/s1.png', '/02shuixi/s2.jpg', '/02shuixi/s3.jpg', '/02shuixi/s4.jpg'],
    },
    sizes: ['M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'],
  },
  {
    tabId: 2,
    name: '長袖Tシャツ',
    colors: ['ホワイト', 'ブラック'],
    imagesByColor: {
      ホワイト: ['/03changxiut/wc1.png', '/03changxiut/wc2.jpg', '/03changxiut/wc3.jpg', '/03changxiut/wc4.png'],
      ブラック: ['/03changxiut/bc1.png', '/03changxiut/bc2.jpg', '/03changxiut/bc3.jpg', '/03changxiut/bc4.png'],
    },
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
  },
  {
    tabId: 3,
    name: 'オーバーサイズ',
    colors: ['ホワイト', 'ブラック', 'ワインレッド', 'グレーアプリコット', 'コーヒーブラウン'],
    imagesByColor: {
      ホワイト: ['/04obat/o1.png'],
      ブラック: ['/04obat/o2.png'],
      ワインレッド: ['/04obat/o3.png'],
      グレーアプリコット: ['/04obat/o4.png'],
      コーヒーブラウン: ['/04obat/o5.png'],
    },
    sizes: ['M', 'L', 'XL'],
  },
  {
    tabId: 4,
    name: 'スウェット',
    colors: ['ホワイト', 'ブラック'],
    imagesByColor: {
      ホワイト: ['/05yuanlingweiyi/ww1.png', '/05yuanlingweiyi/ww2.jpg', '/05yuanlingweiyi/ww3.jpg', '/05yuanlingweiyi/ww4.jpg'],
      ブラック: ['/05yuanlingweiyi/bw1.png', '/05yuanlingweiyi/bw2.jpg', '/05yuanlingweiyi/bw3.jpg', '/05yuanlingweiyi/bw4.jpg'],
    },
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
  },
  {
    tabId: 5,
    name: 'パ一カ一',
    colors: ['ホワイト', 'ブラック'],
    imagesByColor: {
      ホワイト: ['/06daimaoweiyi/ww1.png', '/06daimaoweiyi/ww2.jpg', '/06daimaoweiyi/ww3.jpg', '/06daimaoweiyi/ww4.jpg'],
      ブラック: ['/06daimaoweiyi/bw1.png', '/06daimaoweiyi/bw2.jpg', '/06daimaoweiyi/bw3.jpg', '/06daimaoweiyi/bw4.jpg'],
    },
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
  },
  {
    tabId: 6,
    name: 'トートバッグ①',
    colors: ['ホワイト', 'ブラック'],
    imagesByColor: {
      ホワイト: ['/07bao1/bai2.png'],
      ブラック: ['/07bao1/hei2.png'],
    },
    sizes: ['30*35cm'],
  },
  {
    tabId: 7,
    name: 'トートバッグ②',
    colors: ['ナチュラル'],
    imagesByColor: {
      ナチュラル: ['/08bao2/mi2.png'],
    },
    sizes: ['30*40*10cm'],
  },
]

export function getCatalogProduct(tabId: number) {
  return CART_CATALOG.find((p) => p.tabId === tabId) ?? CART_CATALOG[0]
}

export function getFirstImage(tabId: number, color: string) {
  const p = getCatalogProduct(tabId)
  const images = p.imagesByColor[color] ?? p.imagesByColor[p.colors[0]] ?? []
  return images[0] ?? ''
}

export function getTabIdByName(name: string) {
  const found = CART_CATALOG.find((p) => p.name === name)
  return found ? found.tabId : null
}


