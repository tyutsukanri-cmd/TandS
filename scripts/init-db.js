// 数据库初始化脚本
// 用于在 Render 部署后初始化数据库
// 使用方法: node scripts/init-db.js

const { execSync } = require('child_process')
const { PrismaClient } = require('@prisma/client')

async function main() {
  console.log('🚀 开始初始化数据库...\n')

  try {
    // 1. 生成 Prisma 客户端
    console.log('📦 步骤 1/3: 生成 Prisma 客户端...')
    execSync('npm run db:generate', { stdio: 'inherit' })
    console.log('✅ Prisma 客户端生成成功\n')

    // 2. 推送数据库结构
    console.log('📊 步骤 2/3: 创建数据库表...')
    execSync('npm run db:push', { stdio: 'inherit' })
    console.log('✅ 数据库表创建成功\n')

    // 3. 填充初始数据
    console.log('🌱 步骤 3/3: 填充初始数据...')
    execSync('npm run db:seed', { stdio: 'inherit' })
    console.log('✅ 初始数据填充成功\n')

    // 4. 验证数据
    console.log('🔍 验证数据库初始化...')
    const prisma = new PrismaClient()
    
    const userCount = await prisma.user.count()
    const productCount = await prisma.product.count()
    
    console.log(`✅ 用户数量: ${userCount}`)
    console.log(`✅ 商品数量: ${productCount}`)
    
    if (userCount > 0 && productCount > 0) {
      console.log('\n🎉 数据库初始化完成！')
    } else {
      console.log('\n⚠️  警告: 数据库表已创建，但数据可能未正确填充')
    }

    await prisma.$disconnect()
  } catch (error) {
    console.error('\n❌ 数据库初始化失败:')
    console.error(error.message)
    process.exit(1)
  }
}

main()

