# Render 部署指南

## 环境变量配置

在 Render 上部署时，需要在 **Environment** 部分设置以下环境变量：

### 必需的环境变量

#### 1. `JWT_SECRET` ✅ **必需**
- **用途**: JWT token 加密密钥，用于用户认证
- **生成方式**: 使用随机字符串生成器，建议至少 32 个字符
- **示例值**: `your-super-secret-jwt-key-change-this-in-production-1234567890`
- **安全提示**: ⚠️ 生产环境必须使用强随机字符串，不要使用默认值！

**生成随机密钥的方法：**
```bash
# 使用 Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 或使用在线工具生成随机字符串
```

#### 2. `DATABASE_URL` ✅ **必需**
- **用途**: Prisma 数据库连接字符串
- **当前配置**: 使用 SQLite（开发环境）
- **生产环境建议**: 使用 PostgreSQL（Render 提供免费 PostgreSQL）

**SQLite（开发/测试用）：**
```
file:./dev.db
```

**PostgreSQL（生产环境推荐）：**
```
postgresql://username:password@hostname:5432/database_name?schema=public
```

**Render PostgreSQL 配置步骤：**
1. 在 Render Dashboard 创建 PostgreSQL 数据库
2. 复制 **Internal Database URL** 或 **External Database URL**
3. 设置为 `DATABASE_URL` 环境变量

### 可选的环境变量

#### 3. `NODE_ENV` 
- **用途**: 标识运行环境
- **值**: `production`（生产环境）
- **说明**: Render 通常会自动设置，但可以手动指定

---

## ❌ 不需要的环境变量

以下环境变量**本项目不需要**：

- ❌ `NEXTAUTH_SECRET` - 本项目不使用 NextAuth
- ❌ `NEXTAUTH_URL` - 本项目不使用 NextAuth
- ❌ 自定义 API 密钥 - 本项目没有使用

---

## Render 部署步骤

### 1. 准备数据库

#### 选项 A: 使用 Render PostgreSQL（推荐）

1. 在 Render Dashboard 创建 **PostgreSQL** 数据库
2. 复制数据库连接字符串
3. 在环境变量中设置 `DATABASE_URL`

#### 选项 B: 继续使用 SQLite（不推荐生产环境）

- SQLite 文件系统在 Render 上可能不稳定
- 数据可能在重启后丢失
- 仅用于测试

### 2. 在 Render 创建 Web Service

1. 连接你的 GitHub 仓库
2. 设置以下配置：
   - **Build Command**: `npm install && npm run db:generate && npm run db:push && npm run db:seed`
     - ⚠️ **重要**: 必须包含数据库初始化步骤，否则会出现"表不存在"的错误
   - **Start Command**: `npm start`（使用自定义 server.js，自动绑定到 PORT 环境变量）
   - **Environment**: `Node`
   - **Port**: Render 会自动设置 `PORT` 环境变量（通常是 10000），server.js 会自动读取并绑定

**注意**: 
- 项目已包含 `server.js` 启动脚本，确保服务正确绑定到 Render 指定的端口（0.0.0.0:PORT）
- 如果部署后出现"表不存在"错误，说明数据库未初始化，需要运行 `npm run db:init` 或手动执行初始化步骤

### 3. 设置环境变量

在 Render Dashboard 的 **Environment** 部分添加：

```
JWT_SECRET=你的随机密钥（至少32字符）
DATABASE_URL=你的数据库连接字符串
NODE_ENV=production
```

### 4. 部署后初始化数据库（如果 Build Command 未包含）

如果 Build Command 中没有包含数据库初始化，或者部署后出现"表不存在"错误：

#### 方法 A: 使用初始化脚本（推荐）

在 Render Shell 中运行：

```bash
npm run db:init
```

这个命令会自动执行：
1. 生成 Prisma 客户端
2. 创建数据库表
3. 填充初始数据
4. 验证初始化结果

#### 方法 B: 手动执行步骤

在 Render Shell 中依次运行：

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

#### 方法 C: 修改 Build Command（推荐用于新部署）

在 Render Dashboard 的 Web Service 设置中，修改 **Build Command** 为：

```bash
npm install && npm run db:generate && npm run db:push && npm run db:seed
```

然后重新部署。

---

## 数据库迁移（从 SQLite 到 PostgreSQL）

如果要从 SQLite 迁移到 PostgreSQL：

1. **更新 `prisma/schema.prisma`**：
   ```prisma
   datasource db {
     provider = "postgresql"  // 从 "sqlite" 改为 "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. **重新生成 Prisma 客户端**：
   ```bash
   npm run db:generate
   ```

3. **推送数据库结构**：
   ```bash
   npm run db:push
   ```

4. **填充初始数据**：
   ```bash
   npm run db:seed
   ```

---

## 安全检查清单

部署到生产环境前，请确保：

- [ ] ✅ 修改了 `JWT_SECRET` 为强随机字符串
- [ ] ✅ 修改了管理员默认密码（用户名: admin, 密码: admin）
- [ ] ✅ 使用 PostgreSQL 而不是 SQLite
- [ ] ✅ 设置了 `NODE_ENV=production`
- [ ] ✅ 检查了所有环境变量都已正确配置

---

## 常见问题

### Q: 部署后数据库连接失败？
A: 检查 `DATABASE_URL` 是否正确，确保数据库已创建并运行。

### Q: JWT 认证不工作？
A: 确保 `JWT_SECRET` 已设置，并且值足够长（至少 32 字符）。

### Q: 静态文件（图片）无法访问？
A: 确保图片文件已提交到 Git 仓库的 `public/images/` 目录。

### Q: 部署后需要重新运行 seed 吗？
A: 是的，首次部署需要运行 `npm run db:seed` 来创建初始数据。

### Q: 端口扫描超时错误（Port scan timeout）？
A: 项目已包含 `server.js` 启动脚本，会自动绑定到 Render 的 `PORT` 环境变量（通常是 10000）。确保：
- 使用 `npm start` 作为启动命令（不要使用 `next start`）
- `server.js` 文件已提交到 Git 仓库
- Render 会自动设置 `PORT` 环境变量，无需手动配置

---

## 快速参考

**必需的环境变量：**
```
JWT_SECRET=你的随机密钥
DATABASE_URL=你的数据库连接字符串
```

**不需要的环境变量：**
```
NEXTAUTH_SECRET ❌
NEXTAUTH_URL ❌
```

