# 个人博客

基于 Next.js 16+ 的 Markdown 博客，聚焦前端 + AI 实战，记录开发经验与行业感悟。

## 本地运行

```bash
npm install
npm run dev
```

访问 `http://localhost:3000`。

## 新增文章

1. 在 `articles/` 目录新增 `*.md` 文件（文件名即路由名）
2. 执行构建命令生成页面：

```bash
npm run generate
```

例如：`articles/现代前端渲染架构演进：从 CSR 到 RSC 的深度解析.md`
会生成路由 `/articles/现代前端渲染架构演进：从%20CSR%20到%20RSC%20的深度解析`。

## Vercel 发布

### 1. 先创建vercel账号，建议使用github账号登录

### 2. 在当前项目的根目录下使用shell命令登录，命令如下：

```bash
npx vercel login
// or
npm i vercel -g
vercel login
```

### 3. 登录成功，执行命令行发布

```bash
npm run deploy:vercel
```

## 公众号

<img width="15%" src="./images/person/WechatIMG418.jpg" />
