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

### 方式一：控制台导入仓库

将仓库导入 Vercel，框架选择 Next.js，保持默认构建命令 `next build` 即可发布。

### 方式二：命令行发布

```bash
npm run deploy:vercel
```

## 公众号

<img width="15%" src="./images/person/WechatIMG418.jpg" />
