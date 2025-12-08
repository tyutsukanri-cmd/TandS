# 服装展示与下单管理平台

一个基于 Next.js 的本地服装展示与下单管理平台，支持用户注册登录、商品展示、订单管理、Excel 导出等功能。

## 功能特性

### 用户功能
- ✅ 用户注册（用户名、密码、联系方式、邮箱、公司名）
- ✅ 用户登录（JWT 认证）
- ✅ 商品浏览（卡片式展示）
- ✅ 商品详情查看
- ✅ 下单功能（选择尺码、颜色、数量）
- ✅ 查看个人订单历史

### 管理员功能
- ✅ 管理后台首页（数据统计）
- ✅ 查看所有订单
- ✅ 查看所有用户
- ✅ 导出订单为 Excel 文件

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **后端**: Next.js API Routes
- **数据库**: SQLite (通过 Prisma ORM)
- **认证**: JWT (JSON Web Token)
- **密码加密**: bcryptjs
- **Excel 导出**: xlsx
- **数据验证**: Zod
- **样式**: CSS (全局样式)

## 项目结构

```
TandS/
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   │   ├── auth/         # 认证相关（登录、注册、登出）
│   │   ├── products/     # 商品相关
│   │   ├── orders/       # 订单相关
│   │   ├── admin/        # 管理员相关
│   │   └── user/         # 用户相关
│   ├── admin/            # 管理员页面
│   ├── login/            # 登录页面
│   ├── register/         # 注册页面
│   ├── product/          # 商品详情页
│   ├── user/             # 用户页面
│   ├── layout.tsx        # 根布局
│   ├── page.tsx          # 首页
│   └── globals.css       # 全局样式
├── components/            # 组件
│   └── Navbar.tsx        # 导航栏组件
├── lib/                  # 工具库
│   ├── auth.ts           # 认证工具函数
│   └── prisma.ts         # Prisma 客户端
├── prisma/               # 数据库相关
│   ├── schema.prisma     # 数据库模型
│   └── seed.ts           # 种子数据
├── public/               # 静态资源
│   └── images/          # 商品图片（需要手动添加）
└── package.json          # 项目依赖
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env`：

```bash
cp .env.example .env
```

`.env` 文件内容：

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
```

### 3. 初始化数据库

```bash
# 生成 Prisma 客户端
npm run db:generate

# 推送数据库结构
npm run db:push

# 填充种子数据（创建管理员账户和示例商品）
npm run db:seed
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3300](http://localhost:3300)

## 默认账户

系统预置了一个管理员账户：

- **用户名**: `admin`
- **密码**: `admin`

⚠️ **注意**: 生产环境请务必修改管理员密码！

## 商品图片

商品图片需要手动添加到 `public/images/` 目录。系统会尝试加载以下图片：

- `/images/shirt-white.jpg` - 经典白衬衫
- `/images/tshirt.jpg` - 休闲T恤
- `/images/suit.jpg` - 商务西装
- `/images/jeans.jpg` - 牛仔裤
- `/images/jacket.jpg` - 运动夹克

如果图片不存在，页面会显示"暂无图片"占位符。

## API 路由说明

### 认证相关

- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/logout` - 用户登出
- `GET /api/user/me` - 获取当前用户信息

### 商品相关

- `GET /api/products` - 获取商品列表
- `GET /api/products/[id]` - 获取商品详情

### 订单相关

- `POST /api/orders` - 创建订单（需登录）
- `GET /api/orders` - 获取当前用户的订单（需登录）

### 管理员相关

- `GET /api/admin/orders` - 获取所有订单（需管理员权限）
- `GET /api/admin/orders/export` - 导出订单为 Excel（需管理员权限）
- `GET /api/admin/users` - 获取所有用户（需管理员权限）

## 数据库模型

### User (用户表)
- `id` - 用户ID
- `username` - 用户名（唯一）
- `passwordHash` - 密码哈希
- `phone` - 联系方式
- `email` - 邮箱
- `companyName` - 公司名
- `role` - 角色（"user" 或 "admin"）
- `createdAt` - 创建时间

### Product (商品表)
- `id` - 商品ID
- `name` - 商品名称（唯一）
- `description` - 描述
- `imageUrl` - 图片URL
- `sizes` - 可选尺码（JSON字符串）
- `colors` - 可选颜色（JSON字符串）
- `createdAt` - 创建时间

### Order (订单表)
- `id` - 订单ID
- `userId` - 用户ID
- `productId` - 商品ID
- `productName` - 商品名称（冗余字段）
- `size` - 选择的尺码
- `color` - 选择的颜色
- `quantity` - 数量
- `createdAt` - 下单时间

## 开发说明

### 添加新商品

可以通过以下方式添加商品：

1. **通过 Prisma Studio**（推荐）:
   ```bash
   npx prisma studio
   ```

2. **修改 seed.ts 文件**，然后重新运行：
   ```bash
   npm run db:seed
   ```

3. **通过 API**（需要管理员权限，当前版本未实现）

### 修改管理员密码

1. 使用 Prisma Studio：
   ```bash
   npx prisma studio
   ```
   找到 admin 用户，修改 `passwordHash` 字段（需要使用 bcrypt 加密）

2. 或者修改 `prisma/seed.ts` 中的密码，然后重新运行 seed

### 生产环境部署

1. 修改 `.env` 中的 `JWT_SECRET` 为强随机字符串
2. 修改管理员密码
3. 考虑使用 PostgreSQL 或 MySQL 替代 SQLite
4. 配置 HTTPS
5. 设置适当的 CORS 策略

## 常见问题

### Q: 数据库文件在哪里？
A: SQLite 数据库文件位于项目根目录的 `dev.db`（开发环境）

### Q: 如何重置数据库？
A: 删除 `dev.db` 文件，然后重新运行 `npm run db:push` 和 `npm run db:seed`

### Q: Excel 导出功能不工作？
A: 确保已安装 `xlsx` 包，检查浏览器是否允许下载文件

### Q: 图片不显示？
A: 确保图片文件存在于 `public/images/` 目录，并且文件名与 `seed.ts` 中的 `imageUrl` 匹配

## 后续扩展建议

- [ ] 商品管理功能（增删改查）
- [ ] 订单状态管理（待处理、已发货、已完成等）
- [ ] 商品价格字段
- [ ] 购物车功能
- [ ] 订单支付功能
- [ ] 商品搜索和筛选
- [ ] 用户头像上传
- [ ] 邮件通知功能
- [ ] 数据统计图表
- [ ] 多语言支持

## 许可证

MIT

## 贡献

欢迎提交 Issue 和 Pull Request！

"# TandS" 
