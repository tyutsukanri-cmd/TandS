# ConoHa VPS 部署指南

本指南详细介绍如何将 T&S Fashion 项目部署到 ConoHa VPS。

---

## 目录

1. [租用 ConoHa VPS](#1-租用-conoha-vps)
2. [初始化服务器](#2-初始化服务器)
3. [安装必要软件](#3-安装必要软件)
4. [配置 PostgreSQL 数据库](#4-配置-postgresql-数据库)
5. [部署项目代码](#5-部署项目代码)
6. [配置 PM2 进程管理](#6-配置-pm2-进程管理)
7. [配置 Nginx 反向代理](#7-配置-nginx-反向代理)
8. [配置 SSL 证书（HTTPS）](#8-配置-ssl-证书https)
9. [域名绑定](#9-域名绑定)
10. [日常维护](#10-日常维护)
11. [常见问题](#11-常见问题)

---

## 1. 租用 ConoHa VPS

### 1.1 访问官网

打开 https://www.conoha.jp/vps/

### 1.2 注册账号

1. 点击「今すぐお申し込み」
2. 填写邮箱、密码
3. 完成手机验证
4. 填写个人信息（可使用中国信息）

### 1.3 选择配置

**推荐配置**（本项目）：

| 项目 | 推荐值 | 说明 |
|------|--------|------|
| **内存** | 1GB 或 2GB | 1GB 最低要求，2GB 更稳定 |
| **CPU** | 2核 | 足够使用 |
| **SSD** | 100GB | 足够 |
| **OS** | Ubuntu 22.04 | 最稳定，教程最多 |
| **地区** | 东京 | 对国内访问较快 |

**价格参考**（2024年）：
- 1GB 内存：约 ¥682/月（约 ¥33/人民币）
- 2GB 内存：约 ¥1,848/月（约 ¥89/人民币）

### 1.4 支付方式

- 信用卡（Visa/Mastercard/JCB）
- PayPal
- コンビニ支払い（便利店）

### 1.5 获取服务器信息

创建完成后，记录以下信息：
- **IP 地址**：例如 `163.44.xxx.xxx`
- **root 密码**：创建时设置的密码

---

## 2. 初始化服务器

### 2.1 连接服务器

**Windows 用户**：使用 PowerShell 或 Windows Terminal

```bash
ssh root@你的服务器IP
```

首次连接会提示是否信任，输入 `yes`，然后输入密码。

**如果连接超时**：可能需要在 ConoHa 控制台开启 SSH 端口（22）

### 2.2 更新系统

```bash
apt update && apt upgrade -y
```

### 2.3 创建普通用户（推荐，更安全）

```bash
# 创建用户
adduser deploy

# 设置密码（记住这个密码）
# 其他信息可以直接回车跳过

# 赋予 sudo 权限
usermod -aG sudo deploy

# 切换到新用户
su - deploy
```

### 2.4 配置 SSH 密钥登录（可选但推荐）

在你的**本地电脑**（Windows）上：

```powershell
# 生成密钥（如果没有）
ssh-keygen -t ed25519 -C "your-email@example.com"

# 查看公钥
cat ~/.ssh/id_ed25519.pub
```

复制公钥内容，然后在**服务器**上：

```bash
# 以 deploy 用户登录
mkdir -p ~/.ssh
nano ~/.ssh/authorized_keys
# 粘贴公钥内容，保存退出（Ctrl+O, Enter, Ctrl+X）

chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

### 2.5 配置防火墙

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

输入 `y` 确认。

---

## 3. 安装必要软件

### 3.1 安装 Node.js 20

```bash
# 安装 nvm（Node 版本管理器）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# 重新加载配置
source ~/.bashrc

# 安装 Node.js 20
nvm install 20

# 验证安装
node -v  # 应显示 v20.x.x
npm -v   # 应显示 10.x.x
```

### 3.2 安装 PostgreSQL

```bash
# 安装 PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# 启动并设置开机自启
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 验证状态
sudo systemctl status postgresql
```

### 3.3 安装 Nginx

```bash
sudo apt install nginx -y

# 启动并设置开机自启
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 3.4 安装 PM2（进程管理）

```bash
npm install -g pm2
```

### 3.5 安装 Git

```bash
sudo apt install git -y
```

---

## 4. 配置 PostgreSQL 数据库

### 4.1 进入 PostgreSQL

```bash
sudo -u postgres psql
```

### 4.2 创建数据库和用户

在 PostgreSQL 命令行中执行：

```sql
-- 创建数据库
CREATE DATABASE tands_db;

-- 创建用户（修改密码为你自己的强密码）
CREATE USER tands_user WITH ENCRYPTED PASSWORD '你的强密码';

-- 授权
GRANT ALL PRIVILEGES ON DATABASE tands_db TO tands_user;

-- 授予 schema 权限（PostgreSQL 15+ 需要）
\c tands_db
GRANT ALL ON SCHEMA public TO tands_user;

-- 退出
\q
```

### 4.3 记录数据库连接信息

你的 `DATABASE_URL` 将是：

```
postgresql://tands_user:你的强密码@localhost:5432/tands_db
```

---

## 5. 部署项目代码

### 5.1 创建项目目录

```bash
sudo mkdir -p /var/www
sudo chown deploy:deploy /var/www
cd /var/www
```

### 5.2 克隆代码

**方法 A：从 GitHub 克隆**（如果你的代码在 GitHub）

```bash
git clone https://github.com/你的用户名/TandS.git
cd TandS
```

**方法 B：从本地上传**（如果代码不在 GitHub）

在你的**本地电脑**（Windows PowerShell）：

```powershell
# 压缩项目（排除 node_modules）
cd C:\Users\user\Desktop
tar --exclude='TandS/node_modules' --exclude='TandS/.next' -cvzf TandS.tar.gz TandS

# 上传到服务器
scp TandS.tar.gz deploy@你的服务器IP:/var/www/
```

在**服务器**上：

```bash
cd /var/www
tar -xvzf TandS.tar.gz
rm TandS.tar.gz
cd TandS
```

### 5.3 配置环境变量

```bash
nano .env
```

添加以下内容：

```env
DATABASE_URL="postgresql://tands_user:你的强密码@localhost:5432/tands_db"
JWT_SECRET="生成一个随机字符串作为密钥"
NODE_ENV="production"
```

生成随机密钥的方法：

```bash
# 在服务器上执行
openssl rand -base64 32
```

保存退出：`Ctrl+O`, `Enter`, `Ctrl+X`

### 5.4 安装依赖

```bash
npm install
```

### 5.5 初始化数据库

```bash
# 生成 Prisma 客户端
npm run db:generate

# 创建数据库表
npm run db:push

# 填充初始数据
npm run db:seed
```

### 5.6 构建项目

```bash
npm run build
```

### 5.7 测试运行

```bash
npm start
```

如果看到类似 `Ready on http://localhost:3000` 的消息，说明成功！

按 `Ctrl+C` 停止。

---

## 6. 配置 PM2 进程管理

PM2 可以让你的应用在后台持续运行，并在崩溃时自动重启。

### 6.1 创建 PM2 配置文件

```bash
nano ecosystem.config.js
```

添加以下内容：

```javascript
module.exports = {
  apps: [{
    name: 'tands',
    script: 'server.js',
    cwd: '/var/www/TandS',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

### 6.2 启动应用

```bash
pm2 start ecosystem.config.js
```

### 6.3 常用 PM2 命令

```bash
# 查看状态
pm2 status

# 查看日志
pm2 logs tands

# 重启应用
pm2 restart tands

# 停止应用
pm2 stop tands

# 查看监控
pm2 monit
```

### 6.4 设置开机自启

```bash
pm2 startup
# 执行它输出的命令

pm2 save
```

---

## 7. 配置 Nginx 反向代理

Nginx 将作为反向代理，把 80/443 端口的请求转发给 Node.js 应用。

### 7.1 创建 Nginx 配置

```bash
sudo nano /etc/nginx/sites-available/tands
```

添加以下内容（先用 IP 访问，后面再配置域名）：

```nginx
server {
    listen 80;
    server_name 你的服务器IP;

    # 日志
    access_log /var/log/nginx/tands_access.log;
    error_log /var/log/nginx/tands_error.log;

    # 最大上传大小
    client_max_body_size 10M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 7.2 启用配置

```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/tands /etc/nginx/sites-enabled/

# 删除默认配置（可选）
sudo rm /etc/nginx/sites-enabled/default

# 测试配置
sudo nginx -t

# 重载 Nginx
sudo systemctl reload nginx
```

### 7.3 测试访问

在浏览器中打开：`http://你的服务器IP`

你应该能看到网站了！

---

## 8. 配置 SSL 证书（HTTPS）

**注意**：SSL 证书需要域名，不能用 IP 地址。如果你没有域名，可以跳过此步骤。

### 8.1 安装 Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 8.2 获取证书

```bash
sudo certbot --nginx -d 你的域名.com -d www.你的域名.com
```

按提示操作：
1. 输入邮箱
2. 同意条款（A）
3. 选择是否接收邮件（Y/N）
4. 选择是否强制 HTTPS（推荐选 2）

### 8.3 自动续期

Certbot 会自动设置续期，可以测试：

```bash
sudo certbot renew --dry-run
```

---

## 9. 域名绑定

### 9.1 购买域名

推荐的域名注册商：
- **国内**：阿里云、腾讯云、Namesilo
- **国外**：Namecheap、Cloudflare、Google Domains

### 9.2 配置 DNS

在域名注册商的 DNS 管理页面添加：

| 类型 | 名称 | 值 | TTL |
|------|------|-----|-----|
| A | @ | 你的服务器IP | 600 |
| A | www | 你的服务器IP | 600 |

### 9.3 修改 Nginx 配置

```bash
sudo nano /etc/nginx/sites-available/tands
```

将 `server_name` 修改为你的域名：

```nginx
server_name 你的域名.com www.你的域名.com;
```

重载 Nginx：

```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## 10. 日常维护

### 10.1 更新代码

**方法 A：Git 更新**

```bash
cd /var/www/TandS
git pull origin main
npm install
npm run build
pm2 restart tands
```

**方法 B：重新上传**

在本地打包上传，然后：

```bash
cd /var/www/TandS
npm install
npm run build
pm2 restart tands
```

### 10.2 更新数据库数据

如果修改了 `seed.ts`：

```bash
cd /var/www/TandS
npm run db:seed
pm2 restart tands
```

### 10.3 查看日志

```bash
# 应用日志
pm2 logs tands

# Nginx 访问日志
sudo tail -f /var/log/nginx/tands_access.log

# Nginx 错误日志
sudo tail -f /var/log/nginx/tands_error.log
```

### 10.4 监控资源

```bash
# 查看内存和 CPU
htop

# 查看磁盘
df -h

# PM2 监控
pm2 monit
```

### 10.5 备份数据库

```bash
# 备份
pg_dump -U tands_user -h localhost tands_db > backup_$(date +%Y%m%d).sql

# 恢复
psql -U tands_user -h localhost tands_db < backup_20241217.sql
```

---

## 11. 常见问题

### Q1: 无法连接服务器（SSH 超时）

**解决**：
1. 检查 ConoHa 防火墙设置，确保 22 端口开放
2. 检查服务器 ufw 状态：`sudo ufw status`
3. 尝试从 ConoHa 控制台的「コンソール」直接登录

### Q2: npm install 卡住或失败

**解决**：
```bash
# 使用淘宝镜像
npm config set registry https://registry.npmmirror.com

# 或使用 yarn
npm install -g yarn
yarn install
```

### Q3: 数据库连接失败

**解决**：
1. 检查 PostgreSQL 是否运行：`sudo systemctl status postgresql`
2. 检查 DATABASE_URL 格式是否正确
3. 测试连接：`psql -U tands_user -h localhost -d tands_db`

### Q4: 网站显示 502 Bad Gateway

**解决**：
1. 检查应用是否运行：`pm2 status`
2. 检查端口是否正确：应用在 3000，Nginx 转发到 3000
3. 查看日志：`pm2 logs tands`

### Q5: 内存不足

**解决**：
```bash
# 查看内存使用
free -m

# 创建 swap 空间（1GB 内存的 VPS 推荐）
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### Q6: 图片上传失败

**解决**：
检查 Nginx 的 `client_max_body_size` 配置，增大限制。

---

## 快速命令速查表

```bash
# === 服务管理 ===
pm2 status                    # 查看应用状态
pm2 restart tands             # 重启应用
pm2 logs tands                # 查看日志
sudo systemctl restart nginx  # 重启 Nginx

# === 部署更新 ===
cd /var/www/TandS
git pull
npm install
npm run build
pm2 restart tands

# === 数据库 ===
npm run db:seed               # 重新填充数据
sudo -u postgres psql         # 进入 PostgreSQL

# === 系统 ===
htop                          # 资源监控
df -h                         # 磁盘空间
sudo reboot                   # 重启服务器
```

---

## 总结

完成以上步骤后，你的网站将会：

✅ 运行在 ConoHa VPS 上  
✅ 使用 PM2 保持持续运行  
✅ 通过 Nginx 提供反向代理  
✅ （可选）使用 HTTPS 加密  

如果遇到问题，可以参考「常见问题」部分或查看日志排查。

---

*最后更新：2024年12月*

