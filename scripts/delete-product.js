// 删除商品的脚本
// 使用方法: node scripts/delete-product.js <商品ID或商品名称>

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const args = process.argv.slice(2)
  
  if (args.length === 0) {
    console.log('使用方法: node scripts/delete-product.js <商品ID或商品名称>')
    console.log('\n示例:')
    console.log('  node scripts/delete-product.js 1')
    console.log('  node scripts/delete-product.js "经典白衬衫"')
    process.exit(1)
  }

  const identifier = args[0]
  const isNumeric = /^\d+$/.test(identifier)

  try {
    let product
    if (isNumeric) {
      // 通过 ID 查找
      product = await prisma.product.findUnique({
        where: { id: parseInt(identifier) },
        include: { orders: true }
      })
    } else {
      // 通过名称查找
      product = await prisma.product.findUnique({
        where: { name: identifier },
        include: { orders: true }
      })
    }

    if (!product) {
      console.log(`❌ 商品不存在: ${identifier}`)
      process.exit(1)
    }

    // 检查是否有关联订单
    if (product.orders.length > 0) {
      console.log(`❌ 无法删除：该商品有 ${product.orders.length} 个关联订单`)
      console.log('   请先处理这些订单，或使用 Prisma Studio 手动删除')
      process.exit(1)
    }

    // 显示商品信息
    console.log('\n📦 商品信息:')
    console.log(`   ID: ${product.id}`)
    console.log(`   名称: ${product.name}`)
    console.log(`   描述: ${product.description || '无'}`)
    console.log(`   图片: ${product.imageUrl || '无'}`)

    // 确认删除
    console.log('\n⚠️  确定要删除这个商品吗？')
    console.log('   按 Ctrl+C 取消，或等待 3 秒后自动删除...')
    
    await new Promise(resolve => setTimeout(resolve, 3000))

    // 删除商品
    await prisma.product.delete({
      where: { id: product.id }
    })

    console.log('\n✅ 商品已成功删除！')
  } catch (error) {
    console.error('❌ 删除失败:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

