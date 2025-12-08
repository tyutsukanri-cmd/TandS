import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('开始初始化数据库...')

  // 创建管理员用户
  const adminPasswordHash = await bcrypt.hash('admin', 10)
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      passwordHash: adminPasswordHash,
      phone: '13800138000',
      email: 'admin@example.com',
      companyName: '管理员公司',
      role: 'admin',
    },
  })
  console.log('管理员用户已创建:', admin.username)

  // 创建示例商品
  const products = [
    {
      name: 'Tシャツ',
      description: '商品说明',
      imageUrl: '/images/1tsyatsu.jpg',
      sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL', 'XXXL']),
      colors: JSON.stringify(['Black', 'White']),
    },
    {
      name: 'ウォッシュTシャツ',
      description: '商品说明',
      imageUrl: '/images/2otsyatsu.jpg',
      sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'XXXXL', 'XXXXXL']),
      colors: JSON.stringify(['Black', 'White']),
    },
    {
      name: 'オーバーサイズTシャツ',
      description: '商品说明',
      imageUrl: '/images/3odatsyatsu.jpg',
      sizes: JSON.stringify(['M', 'L', 'XL']),
      colors: JSON.stringify(['Black', 'White']),
    },
    {
      name: 'ソロナTシャツ',
      description: '商品说明',
      imageUrl: '/images/4sorona.jpg',
      sizes: JSON.stringify(['M', 'L']),
      colors: JSON.stringify(['Black', 'White']),
    },
    {
      name: '長袖Tシャツ',
      description: '商品说明',
      imageUrl: '/images/5nagat.jpg',
      sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
      colors: JSON.stringify(['Black', 'White']),
    },
    {
      name: 'スウェット',
      description: '商品说明',
      imageUrl: '/images/6sut.jpg',
      sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL', 'XXXL']),
      colors: JSON.stringify(['Black', 'White']),
    },
    {
      name: 'パーカー',
      description: '商品说明',
      imageUrl: '/images/7paka.jpg',
      sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL', 'XXXL']),
      colors: JSON.stringify(['Black', 'White']),
    },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { name: product.name },
      update: {
        description: product.description,
        imageUrl: product.imageUrl,
        sizes: product.sizes,
        colors: product.colors,
      },
      create: product,
    })
  }
  console.log(`已创建 ${products.length} 个示例商品`)

  console.log('数据库初始化完成！')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

