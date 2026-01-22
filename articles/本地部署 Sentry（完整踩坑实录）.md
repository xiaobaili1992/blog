> 📚 本文记录一次真实的 Sentry 接入与本地部署过程，包含 Vite + React 项目接入、本地自托管 Sentry 的完整流程、Docker Compose 启停的所有坑、以及 Kafka/ClickHouse/Snuba/Web unhealthy 的真实问题分析。
---
## 📋 目录
- [一、为什么要用 Sentry](#一为什么要用-sentry)
- [二、前端项目背景](#二前端项目背景)
- [三、本地部署 Sentry](#三本地部署-sentry)
- [四、必须掌握的 Sentry 正确启停方式](#四必须掌握的-sentry-正确启停方式)
- [五、Web unhealthy 的最终解决关键](#五web-unhealthy-的最终解决关键)
- [六、首次进入 Sentry Web 的配置填写建议](#六首次进入-sentry-web-的配置填写建议)
- [七、关闭终端会不会关闭 Sentry](#七关闭终端会不会关闭-sentry)
- [八、经验总结(非常重要)](#八经验总结)
---
## 一、为什么要用 Sentry？
在前端项目中，我们常见的问题是：
- ❌ 线上 JS 报错用户不反馈
- ❌ Promise reject、白屏、资源加载失败无法复现
- ❌ 只知道"出错了"，不知道：哪个用户、哪个页面、哪次发布引入的
### Sentry 能解决什么？
| 能力 | 说明 |
|------|------|
| 🚨 自动捕获 JS Runtime Error | 无需手动 try-catch |
| 📄 记录 Stack Trace、SourceMap | 精准定位代码位置 |
| 👤 关联用户、环境、版本 | 追溯问题影响范围 |
| 🏢 可本地部署 | 适合企业/内网/隐私场景 |
---
## 二、前端项目背景
### 项目初始化方式
```bash
npm create vite@latest my-react-app -- --template react
```
### 技术栈
- Vite
- React
- TypeScript / JavaScript
- 本地开发 + 私有部署 Sentry
---
## 三、本地部署 Sentry
### 📋 前置条件
安装 Docker，会自动安装 Docker Compose。
当前版本信息：
- Docker 版本：29.1.3
- Docker Compose 版本：5.0.0

[下载 Docker Desktop](https://www.docker.com/products/docker-desktop/)

---
### 1️⃣ 获取 Sentry self-hosted
```bash
git clone https://github.com/getsentry/self-hosted.git
cd self-hosted
```
---
### 2️⃣ 初始化安装
```bash
./install.sh
```
---
### ⚠️ 报错处理大全
#### ❌ 报错 1：Docker Hub 访问超时
```bash
#3 [internal] load metadata for docker.io/library/debian:bookworm-slim
#3 ERROR: failed to authorize: DeadlineExceeded: failed to fetch oauth 
token: Post "https://auth.docker.io/token" : dial tcp 108.160.169.185:443: i/o timeout
```
**问题原因：**
Docker 在拉取 debian:bookworm-slim 时，无法访问 Docker Hub 的鉴权服务 auth.docker.io。这是网络访问 Docker Hub 被阻断/超时导致的。
**解决方案：**
**方法 1：使用 VPN**
```bash
# 开启 VPN 后重新执行
./install.sh
```
**方法 2：使用 Docker Hub 镜像加速器（国内用户必备）**
```bash
# 修改 Docker daemon 配置
vim ~/.docker/daemon.json
# 输入以下内容
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn" ,
    "https://mirror.ccs.tencentyun.com" ,
    "https://hub-mirror.c.163.com"
  ]
}
```
**方法 3：手动拉镜像**
```bash
docker pull debian:bookworm-slim
# 成功后再次执行
./install.sh
```
---
#### ❌ 报错 2：内存不足
```bash
FAIL: Required minimum RAM available to Docker is 14000 MB, found 7837 MB
```
**问题原因：**
本地的 Docker 内存不够。Sentry self-hosted 官方的"最低内存校验"要求：Docker 至少 14GB 可用内存。
**解决方案：**
在 Docker Desktop 中调整虚拟机内存分配，确保至少有 14GB 可用内存。
调整完内存之后，再次执行：
```bash
./install.sh
```
---
#### ❌ 报错 3：Bash 版本过低
```bash
FAIL: Expected minimum bash version to be 4.4.0 but found 3.2.57(1)-release
```
**问题原因：**
这不是 Docker、不是 Sentry、也不是你操作的问题，而是 macOS 的"老坑"——系统自带 Bash 太旧。
**解决方案：**
```bash
# 安装新版 Bash
brew install bash
# 安装完之后验证版本
/opt/homebrew/bin/bash --version
# 把新 bash 设为默认 shell
# 添加到系统 shell 列表
sudo sh -c 'echo /opt/homebrew/bin/bash >> /etc/shells'
# 切换当前用户 shell
chsh -s /opt/homebrew/bin/bash
# 重开终端
bash --version
# 安装新版的 Bash，然后执行
./install.sh
# 或者
/opt/homebrew/bin/bash install.sh
```
---
#### ❌ 报错 4：GitHub archive 下载 403
```bash
#7 ERROR: process "/bin/sh -c pip install https://github.com/getsentry/sentry-nodestore-s3/archive/main.zip" 
did not complete successfully: exit code: 1
```
**问题原因：**
GitHub 对 archive 下载做了跳转，Docker 内 pip 无法正确处理 302，还是网络问题，当前 VPN 网络不稳定。
**解决方案：**
👉 这是 Sentry 官方已知问题，可直接忽略
后续镜像已不强依赖该包，不影响核心功能。
临时解决：重新执行 `./install.sh` 即可（网络稳定时）

---
#### ❌ 报错 5：ClickHouse / Kafka 拉取失败
```bash
failed to fetch oauth token: Post "https://auth.docker.io/token" :
dial tcp 202.160.128.40:443: i/o timeout
```
**问题原因：**
ClickHouse / Kafka 拉取失败（超时），Docker Desktop 网络不稳定，国内/公司网络对 Docker Hub 有延迟。
**解决方案：**
```bash
# 提前手动拉取，避免 compose 阶段阻塞
docker pull altinity/clickhouse-server:25.3.6.10034.altinitystable
# 执行成功之后，再执行
/opt/homebrew/bin/bash install.sh
```
---
#### ❌ 报错 6：Web unhealthy（核心大坑）⚠️
```bash
dependency failed to start: container sentry-self-hosted-web-1 is unhealthy
```
**问题表现：**
Sentry 启动后 Web 一直 unhealthy，而且通常要等 5 分钟以上 才报错。

---
### 🔍 排查过程
#### 1️⃣ Web 日志看起来"完全正常"
```
uWSGI running on 0.0.0.0:9000
```
但 healthcheck 仍失败。
#### 2️⃣ Healthcheck 是什么？
```bash
GET http://127.0.0.1:9000/_health/
```
在容器内验证：
```bash
docker compose exec web python -c \
"import urllib.request; print(urllib.request.urlopen('http://127.0.0.1:9000/_health/').read().decode())"
```
输出：
```bash
ok
```
👉 说明 Web 本身是健康的

---
### ❗ 真正原因（非常关键）
Sentry web 启动依赖的不是"服务是否 running"，而是：
- ✅ Kafka 是否 ready
- ✅ ClickHouse 是否 ready
- ✅ Snuba 是否 bootstrap 完成
- ✅ 数据库 migration 是否完成
而：
```bash
docker compose down
docker compose up -d
```
❌ 不会保证启动顺序
**正确操作顺序：**
```bash
# 彻底停掉所有容器
docker compose down -v
# 只启动基础依赖（不启动 Web）
docker compose up -d kafka postgres redis clickhouse
# 检查 Kafka 是否 healthy
docker compose ps kafka
# 查看日志
docker compose logs kafka --tail=200
# 以上没问题，重新执行
/opt/homebrew/bin/bash install.sh
```
---
## 四、必须掌握的 Sentry 正确启停方式
### ❌ 错误方式（极易复现问题）
```bash
docker compose down
docker compose up -d
```
---
### ✅ 正确方式一（推荐）
```bash
docker compose stop
docker compose start
```
👉 不会破坏状态，最快、最稳
---
### ✅ 正确方式二（down 之后的恢复流程）
```bash
# 1. 先启动基础依赖
docker compose up -d redis postgres kafka clickhouse
# 2. 等待它们全部 healthy
# 3. Snuba bootstrap
docker compose run --rm snuba-api bootstrap --force
# 4. Web upgrade（数据库迁移）
docker compose run --rm web upgrade
# 5. 启动所有服务
docker compose up -d
```
---
### 🚫 千万不要做
```bash
docker compose down -v
```
⚠️ 这会直接删库（ClickHouse / Kafka / Postgres）

---
## 五、Web unhealthy 的最终解决关键
你最终需要执行这一步：
```bash
docker compose run --rm web upgrade
```
👉 这是 Sentry self-hosted 的"灵魂命令"
它会执行以下操作：
| 操作 | 说明 |
|------|------|
| 📋 执行 DB migration | 更新数据库结构 |
| ✅ 校验 Snuba | 确保 Snuba 正常工作 |
| 🔄 初始化 Kafka topics | 创建必要的消息队列 |
| 🔧 修复不一致状态 | 恢复系统一致性 |
执行之后：
```bash
/_health/ → ok  ✅
```
---
## 六、首次进入 Sentry Web 的配置填写建议
### 访问地址
```
http://localhost:9000
```
### 推荐填写方式
| 配置项 | 推荐值 | 说明 |
|--------|--------|------|
| Root URL | http://localhost:9000 | Web 访问地址 |
| Admin Email | 填写你常用邮箱 | 接收错误通知 |
| SMTP | 可全部留空 | 本地测试无需配置 |
| Allow Registration | ❌ 关闭 | 本地环境建议关闭 |
| Usage Statistics / Beacon | 随意 | 不影响功能 |

👉 直接下一步即可，不会影响错误监控
Sentry 自带 SMTP mock，本地测试不影响使用

---
## 七、关闭终端会不会关闭 Sentry
### ✅ 使用 -d（后台运行）
```bash
docker compose up -d
```
✔️ 关闭终端不会影响

---
### ❌ 前台模式
```bash
docker compose up
```
❌ 关闭终端 = 服务停止

---

## 八、经验总结
### 🔴 Sentry self-hosted 本质是：
```
一个小型分布式系统
    ↓
Kafka + ClickHouse + Snuba 驱动
    ↓
启动顺序 > 启动命令
```
---
### ✅ 记住三句话：
1. 永远优先用 stop / start
2. Web unhealthy → 先跑 web upgrade
3. 不要轻易 down -v
---
### 📌 你现在的状态
| 状态 | 完成情况 |
|------|----------|
| ✔️ 本地 Sentry 已稳定运行 | ✅ |
| ✔️ Web health 正常 | ✅ |
| ✔️ 已踩完 90% 新手坑 | ✅ |

---

希望这篇教程对你有所帮助！如有问题，欢迎交流讨论。