# 故障排查指南

## 问题：网站已部署但看不到商品

### 可能的原因

1. **数据库未初始化**（最常见）
   - PostgreSQL 数据库已创建，但表结构和数据未初始化
   - 需要运行数据库迁移和 seed

2. **数据库连接失败**
   - `DATABASE_URL` 环境变量配置错误
   - 数据库服务未启动

3. **API 路由错误**
   - 服务器端错误未正确处理

---

## 解决步骤

### 步骤 1: 检查浏览器控制台

1. 打开网站：https://tands-c5lq.onrender.com/
2. 按 `F12` 打开开发者工具
3. 查看 **Console** 标签页，看是否有错误信息
4. 查看 **Network** 标签页，检查 `/api/products` 请求的状态

### 步骤 2: 检查 Render 日志

1. 登录 Render Dashboard
2. 进入你的 Web Service
3. 点击 **Logs** 标签页
4. 查看是否有错误信息，特别是：
   - 数据库连接错误
   - Prisma 相关错误
   - API 路由错误

### 步骤 3: 初始化数据库（最可能需要的步骤）

如果数据库表未创建或没有数据，需要通过 Render Shell 初始化：

#### 方法 A: 使用初始化脚本（最简单，推荐）✨

1. 在 Render Dashboard 中，进入你的 Web Service
2. 点击右上角的 **Shell** 按钮
3. 运行一条命令即可：

```bash
npm run db:init
```

这个脚本会自动执行所有初始化步骤并验证结果。

#### 方法 B: 手动执行步骤

如果方法 A 不工作，可以手动执行：

```bash
# 生成 Prisma 客户端
npm run db:generate

# 推送数据库结构（创建表）
npm run db:push

# 填充初始数据（创建管理员和商品）
npm run db:seed
```

#### 方法 B: 修改 Build Command（自动初始化）

在 Render Dashboard 的 Web Service 设置中，修改 **Build Command**：

```bash
npm install && npm run db:generate && npm run db:push && npm run db:seed
```

然后重新部署。

### 步骤 4: 验证数据库连接

在 Render Shell 中运行：

```bash
# 检查环境变量
echo $DATABASE_URL

# 测试数据库连接（如果安装了 psql）
psql $DATABASE_URL -c "SELECT 1;"
```

### 步骤 5: 检查环境变量

确保在 Render Dashboard 的 **Environment** 部分设置了：

```
JWT_SECRET=你的随机密钥
DATABASE_URL=postgresql://...
NODE_ENV=production
```

---

## 快速诊断命令

在 Render Shell 中运行以下命令来诊断问题：

```bash
# 1. 检查数据库连接
node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.$connect().then(() => console.log('✅ 数据库连接成功')).catch(e => console.error('❌ 数据库连接失败:', e.message))"

# 2. 检查商品数量
node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.product.count().then(count => console.log('商品数量:', count)).catch(e => console.error('错误:', e.message)).finally(() => prisma.$disconnect())"

# 3. 检查表是否存在
node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.\$queryRaw\`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'\`.then(tables => console.log('表列表:', tables)).catch(e => console.error('错误:', e.message)).finally(() => prisma.$disconnect())"
```

---

## 常见错误及解决方案

### 错误 1: "P1001: Can't reach database server"

**原因**: 数据库连接失败

**解决**:
- 检查 `DATABASE_URL` 是否正确
- 确保 PostgreSQL 数据库服务正在运行
- 检查网络连接

### 错误 2: "P2021: Table does not exist" 或 "The table `public.users` does not exist"

**原因**: 数据库表未创建

**解决**:
```bash
# 方法 1: 使用初始化脚本（推荐）
npm run db:init

# 方法 2: 手动创建表
npm run db:generate
npm run db:push
npm run db:seed
```

### 错误 3: "获取商品列表失败" 或空数组

**原因**: 数据库中没有商品数据

**解决**:
```bash
npm run db:seed
```

### 错误 4: API 返回 500 错误

**原因**: 服务器端错误

**解决**:
1. 查看 Render 日志获取详细错误信息
2. 检查 Prisma 客户端是否已生成：`npm run db:generate`
3. 检查数据库连接

---

## 验证修复

修复后，访问以下 URL 验证：

1. **首页**: https://tands-c5lq.onrender.com/
   - 应该显示商品列表

2. **API 端点**: https://tands-c5lq.onrender.com/api/products
   - 应该返回 JSON 格式的商品数组

3. **管理员登录**: https://tands-c5lq.onrender.com/login
   - 用户名: `admin`
   - 密码: `admin`

---

## 预防措施

为了避免将来出现类似问题，建议：

1. **在 Build Command 中包含数据库初始化**:
   ```
   npm install && npm run db:generate && npm run db:push && npm run db:seed
   ```

2. **添加健康检查端点**（可选）:
   创建一个 `/api/health` 端点来检查数据库连接状态

3. **设置自动部署后的脚本**:
   在 Render 的部署后脚本中运行数据库初始化

---

## 需要帮助？

如果以上步骤都无法解决问题，请提供：
1. Render 日志中的错误信息
2. 浏览器控制台的错误信息
3. `/api/products` API 的响应内容

