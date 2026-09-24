'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { allocateDisplayId, createCartId, loadCartItems, saveCartItems } from '@/lib/cart'
import { getCatalogProduct } from '@/lib/cartCatalog'

type ProductTab = {
  id: number
  name: string
  colors: string[]
  // 每个颜色对应一组轮播图
  imagesByColor: Record<string, string[]>
  // 下方 700×300 的展示图
  bottomImage: string
}

// 商品描述数据
const PRODUCT_DESCRIPTIONS: Record<number, string> = {
  0: `【コンセプト】
極上の着心地と、美しいシルエット。
毎日着たくなる、洗練された大人のベーシックTシャツ。
厳選された上質なコットンを100%使用し、シンプルだからこそ素材とディテールにこだわり抜いたワンランク上の定番アイテム。1枚での着用はもちろん、インナーとしても映える万能な1着です。

【DETAIL】
■ 素材（FABRIC）
・上質なコットン100%：肌に優しく馴染む、柔らかく滑らかなプレミアムな肌触り。
・優れた通気性と快適性：長時間着用しても蒸れにくく、シーズンを問わずストレスフリーな着心地を提供します。
■ 生地感（THICKNESS & WEIGHT）
・6.7oz（オンス）ヘビーウェイト：しっかりとした肉厚感のある生地を採用。
・高い耐久性と透け防止：1枚で着用しても透けにくく、度重なる洗濯でも型崩れしにくいタフな仕上がりです。
■ デザイン＆シルエット（DESIGN & SILHOUETTE）
・タイムレスなミニマルデザイン：テイストを選ばず、ストリート、カジュアル、きれいめまで幅広くコーディネート可能。
・ジェンダーレスなリラックスフィット：絶妙なニュアンスを生み出すゆったりとしたシルエットで、男女問わずスマートに着用いただけます。
■ カラーバリエーション（COLOR）
スタイルを選ばない王道のベーシックカラーから、スタイリングのアクセントになるニュアンスグラデーションまで豊富にラインナップ。
・ブラック / ホワイト / アプリコット / ピンク / グレー / ネイビー
・ピンクグラデーション / ブルーグラデーション / グリーングラデーション

【SIZE & INFORMATION】
■ サイズについて
※ユニセックスでお使いいただけるリラックスシルエットです。
※商品寸法は手作業で採寸しているため、1〜2cm程度の個体差が生じる場合がございます。予めご了承ください。
■ 注意事項
※ご覧いただくモニター環境や光の加減により、掲載画像と実際の商品で色味が若干異なる場合がございます。
`,
  1: `【コンセプト】
着込むほどに増す、ヴィンテージな風合い。
8.2ozの超重磅生地が醸し出す、洗練された大人のストリートラグジュアリー。
独自のカッティングとウォッシュ加工（製品洗い）を施し、新品でありながら長年愛用したかのような味わい深い表情に仕上げた1着。シンプルながらも圧倒的な存在感を放ち、大人のスタイリングにこなれ感をプラスします。

【DETAIL】
■ 素材＆加工（FABRIC & WASH PROCESS）
・上質なウォッシュドコットン100%：100%高級コットンを使用し、特殊なウォッシュ加工を施すことで、肌に馴染む柔らかさと独特の立体的な風合いを実現。
・経年変化を楽しむ：着用や洗濯を重ねるごとに味わいが増し、自分だけの1着へと育てていく楽しみを味わえます。
■ 生地感（THICKNESS & WEIGHT）
・8.2oz（オンス）超ヘビーウェイト：一般的Tシャツの領域を超えた、重厚感のある8.2オンス生地を採用。
・圧倒的なタフさと透け感ゼロ：肉厚で仕立て映えし、透ける心配が一切ありません。度重なる着用でも首元がヨレにくく、優れた耐久性を誇ります。
■ デザイン＆シルエット（DESIGN & SILHOUETTE）
・こなれ感を演出するトレンドシルエット：肩を落とした絶妙なリラックスフィットで、1枚でスタイリングが完成する現代的な仕上がり。
・万能な汎用性：ストリートスタイルから大人の日常コーデまで、洗練された印象を与えます。
■ カラーバリエーション（COLOR）
・ウォッシュドブラック（Washed Black）
深みのあるブラックにウォッシュ加工を施すことで、絶妙なスモーキー感と褪せ感を表現した上品なカラーリング。

【SIZE & INFORMATION】
■ サイズについて
※ユニセックスでお使いいただけるゆったりとしたリラックスシルエットです。
※ウォッシュ加工（製品洗い）の特性上、また手作業で採寸しているため、サイズに1〜2cm程度の個体差が生じる場合がございます。予めご了承ください。
■ 注意事項
※特殊なウォッシュ加工を施しているため、1点1点の色落ち感や風合いが微細に異なります。ヴィンテージ特有の味としてお楽しみください。
※ご覧いただくモニター環境や光の加減により、掲載画像と実際の商品で色味が若干異なる場合がございます。
`,
  2: `【コンセプト】
イージーケアと上質な着心地を両立。
1枚でもインナーでも決まる、洗練された大人のロングスリーブTシャツ。
コットンの柔らかさとポリエステルの機能性を兼ね備えたハイブリッド素材を採用。7.0ozのしっかりとした生地感で、秋口から春先までロングシーズン快適に着用できる万能な定番アイテムです。

【DETAIL】
■ 素材（FABRIC）
・T/C（ポリエステル60% / コットン40%）混紡素材：肌触りの良いコットンの風合いを残しながら、ポリエステルの耐久性と軽量性をプラス。
・優れた吸汗速乾性とイージーケア：通気性が高く、長時間の着用でもサラリとした快適な着心地をキープ。洗濯後も乾きやすく、シワになりにくいイージーケア仕様です。
■ 生地感（THICKNESS & WEIGHT）
・7.0oz（オンス）ヘビーウェイト：長袖Tシャツに最適な、程よい肉厚感とハリのある生地を採用。
・優れた耐久性と透け防止：1枚で着用しても透けにくく、度重なる洗濯でも襟元や袖口がヨレにくいタフな仕上がりです。
■ デザイン＆シルエット（DESIGN & SILHOUETTE）
・ミニマルな洗練デザイン：タイムレスなデザインで、ストリート、カジュアル、きれいめスタイルのインナーまで幅広く対応。
・ジェンダーレスなリラックスフィット：肩や身幅にほどよいゆとりを持たせたトレンドシルエットで、男女問わずスマートに着用いただけます。
■ カラーバリエーション（COLOR）
スタイリングを選ばない王道のベーシックカラーを展開。
・ホワイト
・ブラック

【SIZE & INFORMATION】
■ サイズについて
※ユニセックスでお使いいただけるリラックスシルエットです。
※商品寸法は手作業で採寸しているため、1〜2cm程度の個体差が生じる場合がございます。予めご了承ください。
■ 注意事項
※ご覧いただくモニター環境や光の加減により、掲載画像と実際の商品で色味が若干異なる場合がございます。
`,
  3: `【コンセプト】
ブランド最高峰の品質と、計算し尽くされたオーバーシルエット。
1枚でスタイルを格上げする、プレミアム・ヘビーウェイトTシャツ。
当ラインナップの中で最高品質を誇る、こだわりを凝縮したフラッグシップモデル。8.1ozという圧巻の超ヘビーウェイト生地を採用しながらも、野暮ったさを一切感じさせない上品なハリ感と美しいドレープ（落ち感）を実現。圧倒的な存在感を放つ、大人のための最高峰の1着です。

【DETAIL】
■ 素材（PREMIUM FABRIC）
・厳選 T/Cハイブリッド素材（ポリエステル60% / コットン40%）：コットンの肌触りの良さにポリエステルの機能性を融合。8.1ozの重厚感を感じさせない滑らかな肌触りと高級感のある風合いに仕上げました。
・優れた速乾性とイージーケア：シワになりにくく、洗濯後の乾きも早いハイパフォーマンス仕様。通気性にも優れ、終日快適な着用感をキープします。
■ 生地感（THICKNESS & WEIGHT）
・8.1oz（オンス）最高峰超ヘビーウェイト：極限まで肉厚感を高めた8.1オンス生地。体のラインを拾わない美しい立ち姿をキープします。
・完全透け防止＆抜群のタフネス：1枚での着用も安心の透け感ゼロ。度重なる着用や洗濯でも首元がヨレず、美しいシルエットが長く続きます。
■ デザイン＆シルエット（DESIGN & SILHOUETTE）
・洗練された絶妙なビッグシルエット：肩を大きく落としたドロップショルダーと身幅に贅沢なゆとりを持たせたカッティング。リラックス感がありながらも品のある仕上がりです。
・ジェンダーレスデザイン：ストリート、モード、カジュアルまで、男女問わず1枚でトレンド感のあるスタイリングが完成します。
■ カラーバリエーション（COLOR）
王道のベーシックカラーから、深みと気品のあるニュアンスカラーまで厳選したカラーラインナップ。
・ホワイト
・ブラック
・ワインレッド
・グレーアプリコット
・コーヒーブラウン

【SIZE & INFORMATION】
■ サイズについて
※ゆったりとしたトレンド感のあるビッグシルエット（ユニセックス仕様）です。
※商品寸法は手作業で採寸しているため、1〜2cm程度の個体差が生じる場合がございます。予めご了承ください。
■ 注意事項
※ご覧いただくモニター環境や光の加減により、掲載画像と実際の商品で色味が若干異なる場合がございます。
`,
  4: `【コンセプト】
軽やかで暖かい、デイリーウェアの理想形。
洗練されたシルエットとイージーケアを兼ね備えた、大人の万能スウェット。
コットンの優しい肌触りとポリエステルの機能性を融合させた高密度T/Cスウェット生地を採用。程よい肉厚感とハリがありながらも軽やかな着心地で、1枚着としてはもちろん、アウターのインナーとしてもシーズンを問わず活躍する1着です。

【DETAIL】
■ 素材（FABRIC）
・T/C混紡スウェット（ポリエステル60% / コットン40%）：肌触りの良いコットンの風合いを生かしつつ、ポリエステルの軽量性と耐久性をプラス。
・抜群の速乾性とイージーケア：洗濯後も乾きやすく、スウェット特有の「洗濯時に乾きにくい」ストレスを大幅に軽減。型崩れやシワになりにくく、日常のお手入れも簡単です。
■ 生地感＆着心地（THICKNESS & COMFORT）
・絶妙なミドルウェイト生地：厚すぎず薄すぎない絶妙な生地感で、ゴワつきを感じさせない快適な着用感。
・優れた耐久性：首元、袖口、裾のリブ部分もしっかりとした仕上がりで、度重なる着用や洗濯でもヨレにくいタフさを備えています。
■ デザイン＆シルエット（DESIGN & SILHOUETTE）
・ミニマルな洗練デザイン：無駄を削ぎ落としたシンプルなデザインで、ストリートからきれいめカジュアルまで幅広いコーディネートにマッチ。
・ジェンダーレスなリラックスフィット：身幅と肩周りに適度なゆとりを持たせた現代的なシルエットで、男女問わずスマートに着用いただけます。
■ カラーバリエーション（COLOR）
どんなスタイリングにも馴染む王道のベーシックカラーを展開。
・ホワイト
・ブラック

【SIZE & INFORMATION】
■ サイズについて
※ユニセックスでお使いいただけるゆったりとしたリラックスシルエットです。
※商品寸法は手作業で採寸しているため、1〜2cm程度の個体差が生じる場合がございます。予めご了承ください。
■ 注意事項
※ご覧いただくモニター環境や光の加減により、掲載画像と実際の商品で色味が若干異なる場合がございます。
`,
  5: `【コンセプト】
綺麗なフードの立ち上がりと、軽やかな着心地。
1枚でスタイリングが決まる、洗練された大人のデイリーパーカー。
コットンの柔らかい風合いとポリエステルの機能性を融合させた高密度T/Cスウェット素材を採用。フードの立体感とシルエットの美しさにこだわり、カジュアルすぎず品良く着用できる万能な定番プルオーバーパーカーです。

【DETAIL】
■ 素材（FABRIC）
・T/C混紡スウェット（ポリエステル60% / コットン40%）：肌触りの良いコットンの優しさに、ポリエステルの軽量性と耐久性をプラス。
・抜群の速乾性とイージーケア：パーカーの最大の悩みである「フード部分やポケットが乾きにくい」問題を高い速乾性で解決。型崩れしにくく、日常のお手入れも簡単です。
■ 生地感＆フードディテール（THICKNESS & HOOD）
・絶妙なミドルウェイト生地：しっかりとした肉厚感がありながらも軽量で、長時間の着用でも肩がこらない快適な着心地。
・立体的な美麗フード：首元に程よいボリュームを持たせ、フードが美しく立つこだわり設計。1枚着としてはもちろん、アウターと重ね着した際も首周りを華やかに演出します。
■ デザイン＆シルエット（DESIGN & SILHOUETTE）
・洗練されたミニマルデザイン：王道のカンガルーポケット仕様で、余計な装飾を削ぎ落としたシンプルなデザイン。
・ジェンダーレスなリラックスフィット：身幅と肩周りに適度なゆとりを持たせたトレンドシルエットで、男女問わずスマートに着用いただけます。
■ カラーバリエーション（COLOR）
スタイリングを選ばない王道のベーシックカラーを展開。
・ホワイト
・ブラック

【SIZE & INFORMATION】
■ サイズについて
※ユニセックスでお使いいただけるゆったりとしたリラックスシルエットです。
※商品寸法は手作業で採寸しているため、1〜2cm程度の個体差が生じる場合がございます。予めご了承ください。
■ 注意事項
※ご覧いただくモニター環境や光の加減により、掲載画像と実際の商品で色味が若干異なる場合がございます。
`,
  6: `【コンセプト】
タフに使える、12オンスの重磅キャンバス。
洗練されたミニマルフォルムが日常に溶け込む、万能キャンバストート。
しっかりとした厚みと耐久性を誇る12オンスの高品質キャンバス生地を採用。無駄を極限まで削ぎ落としたミニマルなデザインで、通勤・通学から休日のお出かけ、エコバッグまで、シーンを選ばず活躍する頼れる定番アイテムです。

【DETAIL】
■ 生地感＆耐久性（FABRIC & WEIGHT）
・12oz（オンス）厚手ヘビーキャンバス：透け感がなく、型崩れしにくい高密度な肉厚生地を採用。
・優れた耐久性：使うほどに味わいが増し、重い荷物を入れても綺麗なシルエットを維持します。
■ 収納力＆デザイン（CAPACITY & DESIGN）
・抜群の収納力（A4 / タブレット対応）：雑誌、ノート、タブレット、日常の買い物用品までしっかり収まる大容量設計。
・洗練されたフラットデザイン：マチ（底）を排したスマートな縦型フォルムで、カジュアルからストリート、スッキリとした日常コーデまで幅広くマッチします。
■ 持ち手ディテール（HANDLE）
・タフな補強縫製：持ち手部分は負荷がかかりにくいようしっかりとクロス補強縫製を施しており、重量のある荷物でも安心して持ち運びいただけます。
■ カラーバリエーション（COLOR）
スタイリングを選ばない王道のベーシックカラー。
・ホワイト
・ブラック

【SIZE & SPEC】
■ サイズ
・本体：タテ 約40cm × ヨコ 約34cm（マチなし / フラット仕様）
※通勤、通学、デイリーユース、ショッピングバッグなど幅広い用途に対応します。
※製品寸法は手作業で採寸しているため、1〜2cm程度の個体差が生じる場合がございます。予めご了承ください。
■ 注意事項
※ご覧いただくモニター環境や光の加減により、掲載画像と実際の商品で色味が若干異なる場合がございます。
`,
  7: `【コンセプト】
たっぷり入る10cmの底マチ設計。
12オンスのタフな素材感が魅力の、ナチュラル＆万能キャンバストート。
しっかりとした厚みと高い耐久性を誇る12オンスの高級キャンバス生地を採用。10cmの底マチ（立体構造）を施すことで、厚みのある荷物もすっきりと収納可能に。素材本来の温もりを感じるナチュラルカラーで、通勤・通学からショッピング、エコバッグまで幅広いシーンで頼れる1着（1個）です。

【DETAIL】
■ 生地感＆耐久性（FABRIC & WEIGHT）
・12oz（オンス）厚手ヘビーキャンバス：しっかりとした肉厚感があり、荷物を入れても型崩れや底落ちがしにくい堅牢な生地。
・抜群の耐久性：使い込むほどにキャンバス特有の味わいが増し、長期間タフにご愛用いただけます。
■ 収納力＆デザイン（CAPACITY & DESIGN）
・立体的な10cm底マチ仕様：A4サイズの書類、雑誌、タブレットはもちろん、お弁当箱や水筒など幅のある荷物も安定して持ち運べる大容量設計。
・洗練されたミニマルデザイン：余計な装飾を省いたシンプルなデザインで、カジュアル、ストリート、ナチュラルコーデまでテイストを選ばずマッチします。
■ 持ち手ディテール（HANDLE）
・タフな補強縫製：負荷がかかりやすい持ち手付け根部分をしっかりと補強縫製。重い荷物を入れた際も安心して持ち運べます。
■ カラー（COLOR）
・ナチュラル（Natural）
素材本来の風合いを生かした、柔らかく温かみのある王道のナチュラルカラー。スタイリングに優しく馴染みます。

【SIZE & SPEC】
■ サイズ
・本体：約 30cm × 40cm × マチ10cm（底マチあり）
※通勤、通学、デイリーユース、ショッピングバッグなど幅広い用途に対応します。
※製品寸法は手作業で採寸しているため、1〜2cm程度の個体差が生じる場合がございます。予めご了承ください。
■ 注意事項
※ご覧いただくモニター環境や光の加減により、掲載画像と実際の商品で色味が若干異なる場合がございます。
`,
}

// 与 page.tsx 中 6 个商品分类对应的选项卡数据
const PRODUCT_TABS: ProductTab[] = [
  {
    id: 0,
    name: 'ベーシックTシャツ',
    colors: ['ホワイト', 'ブラック', 'アプリコット', 'ピンク', 'グレー', 'ネイビー', 'ピンクグラデーション', 'ブルーグラデーション', 'グリーングラデーション'],
    imagesByColor: {
      ホワイト: ['/01duant/wc11.png', '/01duant/wc1.png', '/01duant/wc2.png', '/01duant/wc3.png'],
      ブラック: ['/01duant/bc11.png', '/01duant/bc1.png', '/01duant/bc2.png', '/01duant/bc3.png'],
      アプリコット: ['/01duant/ac11.png', '/01duant/ac1.png', '/01duant/ac2.png', '/01duant/ac3.png'],
      ピンク: ['/01duant/04-1.png', '/01duant/04-2.png', '/01duant/04-3.png', '/01duant/04-4.png'],
      グレー: ['/01duant/05-1.png', '/01duant/05-2.png', '/01duant/05-3.png', '/01duant/05-4.png'],
      ネイビー: ['/01duant/06-1.png', '/01duant/06-2.png', '/01duant/06-3.png', '/01duant/06-4.png'],
      ピンクグラデーション: ['/01duant/07-1.png', '/01duant/07-2.png', '/01duant/07-3.png', '/01duant/07-4.png'],
      ブルーグラデーション: ['/01duant/08-1.png', '/01duant/08-2.png', '/01duant/08-3.png', '/01duant/08-4.png'],
      グリーングラデーション: ['/01duant/09-1.png', '/01duant/09-2.png', '/01duant/09-3.png', '/01duant/09-4.png'],
    },
    bottomImage: '/01duant/dtb1.png',
  },
  {
    id: 1,
    name: 'ウォッシュTシャツ',
    colors: ['ブラック'],
    imagesByColor: {
      ブラック: ['/02shuixi/s1.png', '/02shuixi/s2.jpg', '/02shuixi/s3.jpg', '/02shuixi/s4.jpg'],
    },
    bottomImage: '/02shuixi/b1.png',
  },
  {
    id: 2,
    name: '長袖Tシャツ',
    colors: ['ホワイト', 'ブラック'],
    imagesByColor: {
      ホワイト: ['/03changxiut/wc1.png', '/03changxiut/wc2.jpg', '/03changxiut/wc3.jpg', '/03changxiut/wc4.png'],
      ブラック: ['/03changxiut/bc1.png', '/03changxiut/bc2.jpg', '/03changxiut/bc3.jpg', '/03changxiut/bc4.png'],
    },
    bottomImage: '/03changxiut/b1.png',
  },
  {
    id: 3,
    name: 'オーバーサイズ',
    colors: ['ホワイト', 'ブラック', 'ワインレッド', 'グレーアプリコット', 'コーヒーブラウン'],
    imagesByColor: {
      ホワイト: ['/04obat/o1.png'],
      ブラック: ['/04obat/o2.png'],
      ワインレッド: ['/04obat/o3.png'],
      グレーアプリコット: ['/04obat/o4.png'],
      コーヒーブラウン:['/04obat/o5.png'],
    },
    bottomImage: '/04obat/bbbb1.png',
  },
  {
    id: 4,
    name: 'スウェット',
    colors: ['ホワイト', 'ブラック'],
    imagesByColor: {
      ホワイト: ['/05yuanlingweiyi/ww1.png', '/05yuanlingweiyi/ww2.jpg', '/05yuanlingweiyi/ww3.jpg', '/05yuanlingweiyi/ww4.jpg'],
      ブラック: ['/05yuanlingweiyi/bw1.png', '/05yuanlingweiyi/bw2.jpg', '/05yuanlingweiyi/bw3.jpg', '/05yuanlingweiyi/bw4.jpg'],
    },
    bottomImage: '/05yuanlingweiyi/bbbb1.png',
  },
  {
    id: 5,
    name: 'パ一カ一',
    colors: ['ホワイト', 'ブラック'],
    imagesByColor: {
      ホワイト: ['/06daimaoweiyi/ww1.png', '/06daimaoweiyi/ww2.jpg', '/06daimaoweiyi/ww3.jpg', '/06daimaoweiyi/ww4.jpg'],
      ブラック: ['/06daimaoweiyi/bw1.png', '/06daimaoweiyi/bw2.jpg', '/06daimaoweiyi/bw3.jpg', '/06daimaoweiyi/bw4.jpg'],
    },
    bottomImage: '/06daimaoweiyi/bbbbbb11.png',
  },
  {
    id: 6,
    name: 'トートバッグ①',
    colors: ['ブラック'],
    imagesByColor: {
      ホワイト: ['/07bao1/bai1.png'],
      ブラック: ['/07bao1/hei1.png'],
    },
    bottomImage: '/07bao1/wudi1.jpg',
  },
  {
    id: 7,
    name: 'トートバッグ②',
    colors: ['ナチュラル'],
    imagesByColor: {
      ナチュラル: ['/08bao2/mi1.png'],
    },
    bottomImage: '/08bao2/youdi1.jpg',
  },
]

function ProductDetailsContent() {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab')
  const initialTab = tabParam !== null ? Math.min(Math.max(0, parseInt(tabParam, 10)), PRODUCT_TABS.length - 1) : 0
  const router = useRouter()

  const [activeTab, setActiveTab] = useState(initialTab)
  const [selectedColor, setSelectedColor] = useState('白')
  const [selectedSize, setSelectedSize] = useState('S')
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)

  useEffect(() => {
    const t = tabParam !== null ? Math.min(Math.max(0, parseInt(tabParam, 10)), PRODUCT_TABS.length - 1) : 0
    setActiveTab(t)
  }, [tabParam])

  // 新版布局配置：各商品 001 目录、颜色数（01～NN 文件夹与色卡 inc/01～NN 对应）、尺码表
  const NEW_LAYOUT: Record<number, { base: string; colorCount: number; chima: string }> = {
    0: { base: '/01duant/001', colorCount: 9, chima: '/01duant/001/chima.png' },
    1: { base: '/02shuixi/001', colorCount: 1, chima: '/02shuixi/001/chima.png' },
    2: { base: '/03changxiut/001', colorCount: 2, chima: '/03changxiut/001/chima.png' },
    3: { base: '/04obat/001', colorCount: 5, chima: '/04obat/001/chima.png' },
    4: { base: '/05yuanlingweiyi/001', colorCount: 2, chima: '/05yuanlingweiyi/001/chima.png' },
    5: { base: '/06daimaoweiyi/001', colorCount: 2, chima: '/06daimaoweiyi/001/chima.png' },
    6: { base: '/07bao1/001', colorCount: 1, chima: '/07bao1/001/chima.jpg' },
    7: { base: '/08bao2/001', colorCount: 1, chima: '/08bao2/001/chima.jpg' },
  }
  const layoutCfg = NEW_LAYOUT[activeTab]
  const layoutColors = PRODUCT_TABS[activeTab].colors.slice(0, layoutCfg.colorCount)
  const layoutColorIdx = Math.max(0, layoutColors.indexOf(selectedColor))
  const layoutFolder = String(layoutColorIdx + 1).padStart(2, '0')
  const layoutSizes = getCatalogProduct(activeTab).sizes
  const pad2 = (n: number) => String(n).padStart(2, '0')
  const categoryLabel = activeTab <= 5 ? 'T-SHIRTS' : 'TOTE BAG'

  // 切换商品时，尺寸回到该商品的第一个尺码，颜色回到该商品新布局的第一个颜色
  useEffect(() => {
    const p = getCatalogProduct(activeTab)
    setSelectedSize(p.sizes[0] ?? '')
    const cfg = NEW_LAYOUT[activeTab]
    if (cfg) {
      const cols = PRODUCT_TABS[activeTab].colors.slice(0, cfg.colorCount)
      setSelectedColor((prev) => (cols.includes(prev) ? prev : cols[0]))
    }
  }, [activeTab])

  // 若当前商品不包含当前选中的颜色，则自动切换到第一个颜色
  useEffect(() => {
    const available = PRODUCT_TABS[activeTab]?.colors ?? []
    if (available.length === 0) return
    if (!available.includes(selectedColor)) {
      setSelectedColor(available[0])
    }
  }, [activeTab, selectedColor])

  const product = PRODUCT_TABS[activeTab]

  return (
    <div className="container" style={{ paddingTop: '20px', paddingBottom: '40px' }}>
        {/* 商品选项卡：无边框无底色，纯黑字，选中黑底白字，整体缩小 */}
        <div style={{ marginBottom: '16px' }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
            }}
          >
            {PRODUCT_TABS.map((tab) => (
              <Link key={tab.id} href={`/product-details?tab=${tab.id}`} onClick={() => setActiveTab(tab.id)}>
                <button
                  type="button"
                  style={{
                    padding: '4px 10px',
                    fontSize: '12px',
                    backgroundColor: activeTab === tab.id ? '#000' : 'transparent',
                    color: activeTab === tab.id ? '#fff' : '#000',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  {tab.name}
                </button>
              </Link>
            ))}
          </div>
        </div>

        {layoutCfg && (
          /* 新版布局：1200宽，左6图，右详情 */
          <div style={{ width: '1200px', maxWidth: '100%', margin: '0 auto' }}>
            <style>{`.pdesc-scroll::-webkit-scrollbar{width:6px}.pdesc-scroll::-webkit-scrollbar-track{background:transparent}.pdesc-scroll::-webkit-scrollbar-thumb{background:#000;border-radius:3px}`}</style>
            <div className="r-detail-flex" style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
              {/* 左侧6图：1 2第一行，3 4第二行，5 6第三行 */}
              <div style={{ width: 'calc(50% - 15px)', display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '15px', rowGap: '10px' }}>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <img
                    key={n}
                    src={`${layoutCfg.base}/${layoutFolder}/0${n}.png`}
                    alt={`${product.name} ${selectedColor} ${n}`}
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                ))}
              </div>
              {/* 右侧详情 */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '14px', color: '#333' }}>{pad2(activeTab + 1)} / {pad2(PRODUCT_TABS.length)}</div>
                <div style={{ height: '16px' }} />
                <div style={{ fontSize: '12px', letterSpacing: '2px', color: '#666' }}>{categoryLabel}</div>
                <div style={{ fontSize: '28px', fontWeight: 700, color: '#111', marginTop: '8px', marginBottom: '16px' }}>{product.name}</div>
                {/* 说明区：上下黑线，中间可滚动 */}
                <div style={{ borderTop: '2px solid #000' }} />
                <div
                  className="pdesc-scroll"
                  style={{
                    height: isDescriptionExpanded ? 'auto' : '180px',
                    overflowY: isDescriptionExpanded ? 'visible' : 'auto',
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#000 transparent',
                    padding: '12px 8px 12px 0',
                  }}
                >
                  <div style={{ fontSize: '13px', lineHeight: 1.8, color: '#333', whiteSpace: 'pre-line' }}>
                    {PRODUCT_DESCRIPTIONS[product.id] || '商品説明がありません'}
                  </div>
                </div>
                <div style={{ borderBottom: '2px solid #000' }} />
                <div style={{ textAlign: 'right', marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    style={{ background: 'none', border: 'none', padding: 0, fontSize: '13px', color: '#111', cursor: 'pointer' }}
                  >
                    {isDescriptionExpanded ? '表示を戻す' : '全文を表示'}
                  </button>
                </div>
                {/* 颜色 */}
                <div style={{ fontSize: '12px', color: '#333', marginTop: '20px' }}>カラー</div>
                <div className="r-wrap-row" style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  {layoutColors.map((color, idx) => {
                    const sw = String(idx + 1).padStart(2, '0')
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        title={color}
                        style={{
                          padding: 0,
                          border: selectedColor === color ? '2px solid #000' : '2px solid transparent',
                          background: 'none',
                          cursor: 'pointer',
                          width: '52px',
                          height: '52px',
                        }}
                      >
                        <img src={`${layoutCfg.base}/inc/${sw}.png`} alt={color} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      </button>
                    )
                  })}
                </div>
                <div style={{ fontSize: '13px', color: '#111', marginTop: '8px' }}>{selectedColor}</div>
                {/* 尺寸 */}
                <div style={{ fontSize: '12px', color: '#333', marginTop: '20px' }}>サイズ</div>
                <div className="r-wrap-row" style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  {layoutSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      style={{
                        minWidth: '44px',
                        padding: '6px 10px',
                        fontSize: '13px',
                        backgroundColor: selectedSize === size ? '#000' : '#fff',
                        color: selectedSize === size ? '#fff' : '#111',
                        border: '1px solid #000',
                        borderRadius: '2px',
                        cursor: 'pointer',
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {/* 尺码表 */}
                <img src={layoutCfg.chima} alt="サイズ表" style={{ width: '100%', height: 'auto', display: 'block', marginTop: '16px' }} />
                {/* 加入购物车 */}
                <button
                  type="button"
                  onClick={() => {
                    ;(async () => {
                      const catalogProduct = getCatalogProduct(activeTab)
                      const color = catalogProduct.colors.includes(selectedColor) ? selectedColor : catalogProduct.colors[0]
                      const size = catalogProduct.sizes.includes(selectedSize) ? selectedSize : catalogProduct.sizes[0] ?? ''

                      let username = 'guest'
                      try {
                        const r = await fetch('/api/user/me')
                        if (r.ok) {
                          const data = await r.json()
                          username = data?.user?.username ?? 'guest'
                        }
                      } catch {}

                      const displayId = allocateDisplayId(username)
                      const nextItems = loadCartItems()
                      nextItems.push({
                        cartId: createCartId(),
                        displayId,
                        productTabId: activeTab,
                        color,
                        size,
                        quantity: 1,
                        positions: { p1: '', p2: '', p3: '', p4: '' },
                        note: '',
                      })
                      saveCartItems(nextItems)
                      router.push('/my-cart')
                    })()
                  }}
                  style={{
                    width: '100%',
                    marginTop: '16px',
                    padding: '12px 0',
                    fontSize: '15px',
                    backgroundColor: '#000',
                    color: '#fff',
                    border: '1px solid #000',
                    borderRadius: '2px',
                    cursor: 'pointer',
                  }}
                >
                  カートに追加
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
  )
}

export default function ProductDetailsPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '40px', textAlign: 'center' }}>読み込み中…</div>}>
      <ProductDetailsContent />
    </Suspense>
  )
}
