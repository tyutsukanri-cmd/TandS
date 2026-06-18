# 快速启动指南

## 第一步：安装依赖

```bash
npm install
```

## 第二步：配置环境变量

创建 `.env` 文件（复制 `.env.example` 或手动创建）：

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
```

## 第三步：初始化数据库

```bash
# 生成 Prisma 客户端
npm run db:generate

# 创建数据库表
npm run db:push

# 填充初始数据（创建管理员账户和示例商品）
npm run db:seed
```

## 第四步：启动项目

```bash
npm run dev
```

访问 [http://localhost:3300](http://localhost:3300)

## 默认登录信息

- **管理员账户**:
  - 用户名: `admin`
  - 密码: `admin`

## 测试流程

1. 访问首页查看商品列表
2. 注册一个新用户
3. 登录后查看商品详情
4. 选择一个商品并下单（选择尺码、颜色、数量）
5. 查看"我的订单"
6. 使用管理员账户登录
7. 进入管理后台查看所有订单和用户
8. 导出订单为 Excel 文件

## 注意事项

- 商品图片需要手动添加到 `public/images/` 目录（可选）
- 如果遇到数据库错误，删除 `dev.db` 文件后重新运行 `npm run db:push` 和 `npm run db:seed`

