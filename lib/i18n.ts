export type Locale = 'ja' | 'zh-CN'

export const DEFAULT_LOCALE: Locale = 'ja'

export const LOCALE_LABEL: Record<Locale, string> = {
  ja: '日本語',
  'zh-CN': '中文',
}

export type I18nKey =
  | 'nav.home'
  | 'nav.about'
  | 'nav.productDetails'
  | 'nav.myCart'
  | 'nav.orders'
  | 'auth.welcome'
  | 'auth.admin'
  | 'auth.logout'
  | 'auth.login'
  | 'auth.register'
  | 'lang.switchToJa'
  | 'lang.switchToZh'
  | 'admin.dashboard'
  | 'admin.orders'
  | 'admin.orderCleanup'
  | 'admin.users'
  | 'admin.contactMessages'
  | 'common.loading'
  | 'common.back'
  | 'common.submit'
  | 'common.delete'
  | 'common.query'
  | 'orders.title'
  | 'orders.empty'
  | 'orders.listHint'
  | 'myCart.title'
  | 'myCart.submit'
  | 'myCart.empty'
  | 'myCart.notice'
  | 'about.title'
  | 'about.leftTitle'
  | 'about.contactTitle'
  | 'about.lastName'
  | 'about.firstName'
  | 'about.email'
  | 'about.content'
  | 'about.ph.lastName'
  | 'about.ph.firstName'
  | 'about.ph.email'
  | 'about.ph.content'
  | 'about.sent'
  | 'about.sendFailed'
  | 'admin.contact.unread'
  | 'admin.contact.none'

export const MESSAGES: Record<Locale, Record<I18nKey, string>> = {
  ja: {
    'nav.home': 'HOME',
    'nav.about': '会社案内',
    'nav.productDetails': '商品詳細',
    'nav.myCart': 'カート',
    'nav.orders': '注文',
    'auth.welcome': 'ようこそ',
    'auth.admin': '管理画面',
    'auth.logout': 'ログアウト',
    'auth.login': 'ログイン',
    'auth.register': '新規登録',
    'lang.switchToJa': '日本語',
    'lang.switchToZh': '中文',
    'admin.dashboard': '管理画面',
    'admin.orders': '注文管理',
    'admin.orderCleanup': '画像クリーンアップ',
    'admin.users': 'ユーザー管理',
    'admin.contactMessages': 'お問い合わせ',
    'common.loading': '読み込み中...',
    'common.back': '戻る',
    'common.submit': '送信',
    'common.delete': '削除',
    'common.query': '検索',
    'orders.title': '注文',
    'orders.empty': '現在、注文はありません',
    'orders.listHint': '注文一覧（注文番号をクリックして詳細を表示）',
    'myCart.title': 'カート',
    'myCart.submit': '送信',
    'myCart.empty': '商品がありません。商品を追加してください',
    'myCart.notice': 'このページで商品情報を必ずご確認ください。送信後は注文内容を変更できません。変更が必要な場合はご連絡ください：ttsj-service@tyu-tsu-shyoji.com',
    'about.title': '私たちについて',
    'about.leftTitle': '会社紹介',
    'about.contactTitle': 'ご不明点があればお問い合わせください',
    'about.lastName': '姓',
    'about.firstName': '名',
    'about.email': 'メール',
    'about.content': '内容',
    'about.ph.lastName': '姓を入力してください',
    'about.ph.firstName': '名を入力してください',
    'about.ph.email': 'メールアドレスを入力してください',
    'about.ph.content': 'お問い合わせ内容を入力してください',
    'about.sent': '送信しました',
    'about.sendFailed': '送信に失敗しました',
    'admin.contact.unread': '未読',
    'admin.contact.none': 'お問い合わせはありません',
  },
  'zh-CN': {
    'nav.home': 'HOME',
    'nav.about': 'About Us',
    'nav.productDetails': 'Product Details',
    'nav.myCart': 'My Cart',
    'nav.orders': 'Order',
    'auth.welcome': '欢迎',
    'auth.admin': '管理后台',
    'auth.logout': '登出',
    'auth.login': '登录',
    'auth.register': '注册',
    'lang.switchToJa': '日本語',
    'lang.switchToZh': '中文',
    'admin.dashboard': '管理后台',
    'admin.orders': '订单管理',
    'admin.orderCleanup': '订单图片清理',
    'admin.users': '用户管理',
    'admin.contactMessages': '客户留言',
    'common.loading': '加载中...',
    'common.back': '返回',
    'common.submit': '提交',
    'common.delete': '删除',
    'common.query': '查询',
    'orders.title': '订单',
    'orders.empty': '当前没有订单',
    'orders.listHint': '订单列表（点击订单名查看详细信息）',
    'myCart.title': '购物车',
    'myCart.submit': '提交',
    'myCart.empty': '当前没有商品，请添加商品',
    'myCart.notice': '请在当前页面确认好所有商品的信息，一经提交后，将不能再对下单商品进行更改。如需更改请联系：XXXXXXXXXXX',
    'about.title': '会社介绍',
    'about.leftTitle': '关于我们',
    'about.contactTitle': '如有疑问请联系我们',
    'about.lastName': '姓',
    'about.firstName': '名',
    'about.email': '邮箱',
    'about.content': '内容',
    'about.ph.lastName': '请输入姓',
    'about.ph.firstName': '请输入名',
    'about.ph.email': '请输入邮箱地址',
    'about.ph.content': '请输入咨询内容',
    'about.sent': '提交成功',
    'about.sendFailed': '提交失败',
    'admin.contact.unread': '未读',
    'admin.contact.none': '暂无留言',
  },
}

export function t(locale: Locale, key: I18nKey, vars?: Record<string, string | number>) {
  const base = MESSAGES[locale]?.[key] ?? MESSAGES[DEFAULT_LOCALE][key] ?? String(key)
  if (!vars) return base
  return Object.keys(vars).reduce((acc, k) => acc.replaceAll(`{${k}}`, String(vars[k])), base)
}

