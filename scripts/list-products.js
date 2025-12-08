// 列出所有商品的脚本
// 使用方法: node scripts/list-products.js

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { id: 'asc' }
    })

    if (products.length === 0) {
      console.log('📦 当前没有商品')
      return
    }

    console.log(`\n📦 当前共有 ${products.length} 个商品:\n`)
    console.log('ID | 商品名称 | 描述')
    console.log('─'.repeat(60))
    
    products.forEach(product => {
      const desc = (product.description || '无描述').substring(0, 30)
      console.log(`${product.id.toString().padEnd(3)} | ${product.name.padEnd(15)} | ${desc}`)
    })

    console.log('\n💡 删除商品: node scripts/delete-product.js <ID或名称>')
    console.log('   示例: node scripts/delete-product.js 1')
    console.log('   示例: node scripts/delete-product.js "经典白衬衫"\n')
  } catch (error) {
    console.error('❌ 获取商品列表失败:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

main()

