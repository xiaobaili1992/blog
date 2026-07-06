---
title: TailwindCSS 工作场景使用手册
date: 2026-07-06
author: lixiaobai
---

这份文档面向第一次把 TailwindCSS 应用到项目中的开发者。重点不是背完整 API，而是帮助你在真实项目里快速判断“我要改哪个样式”，然后找到对应的 Tailwind class。

## 1. TailwindCSS 的核心思路

TailwindCSS 是 utility-first CSS 框架。它不是让你先写很多语义化 CSS 类名，比如 `.card`、`.title`、`.button-primary`，而是让你直接在 HTML、React、Vue 组件里组合很多单一职责的 class。

```html
<div class="flex items-center gap-3 rounded-lg bg-white p-4 text-sm text-gray-700 shadow">
  内容
</div>
```

上面这段可以拆成：

```txt
布局 display        flex grid block hidden
对齐 align          items-center justify-between
间距 spacing        p-4 px-6 mt-2 gap-3
尺寸 sizing         w-64 h-10 max-w-md size-8
文字 typography     text-sm font-medium leading-6 text-gray-700
背景 background     bg-white bg-blue-500
边框 border         border border-gray-200 rounded-lg
效果 effects        shadow opacity-80
状态 states         hover:bg-blue-600 focus:ring-2 disabled:opacity-50
响应式 responsive   md:flex lg:grid-cols-4
```

工作里改样式时，不要先想“我要写什么 CSS 类名”，而是先想：

```txt
我要改的是哪个 CSS 属性？
它属于布局、间距、尺寸、文字、颜色、边框、状态还是响应式？
```

## 2. 项目安装和入口写法

如果是 Vite 项目，TailwindCSS v4 常见安装方式如下：

```bash
npm install tailwindcss @tailwindcss/vite
```

`vite.config.ts`：

```ts
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss()],
})
```

CSS 入口文件：

```css
@import "tailwindcss";
```

然后在 HTML、React、Vue 中直接写 class。

如果你接手的是老项目，可能会看到：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

也可能看到：

```js
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,vue}'],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

这通常是 TailwindCSS v3 或兼容迁移中的写法。实际工作中要先看项目版本，不要直接把 v3/v4 配置方式混用。

## 3. 间距 spacing

间距是日常最常改的样式。

```html
<div class="p-4">四周 padding</div>
<div class="px-4 py-2">左右 16px，上下 8px</div>
<div class="mt-6 mb-2">上 margin、下 margin</div>
<div class="space-y-3">子元素纵向间距</div>
<div class="gap-4">flex/grid 子项间距</div>
```

记忆方式：

```txt
p  = padding
m  = margin
x  = left + right
y  = top + bottom
t  = top
r  = right
b  = bottom
l  = left
gap = flex/grid 子项之间的间距
space-y = 子元素之间的纵向间距
space-x = 子元素之间的横向间距
```

常用数字和像素的大致关系：

```txt
1  = 4px
2  = 8px
3  = 12px
4  = 16px
5  = 20px
6  = 24px
8  = 32px
10 = 40px
12 = 48px
16 = 64px
20 = 80px
24 = 96px
```

常见工作场景：

```html
<!-- 卡片内边距太小，改大 -->
<div class="rounded-lg border bg-white p-6">
  卡片内容
</div>

<!-- 标题和描述之间加一点距离 -->
<h2 class="text-lg font-semibold">用户管理</h2>
<p class="mt-1 text-sm text-gray-500">管理系统用户和权限</p>

<!-- 列表项之间保持统一间距 -->
<ul class="space-y-3">
  <li>第一项</li>
  <li>第二项</li>
</ul>
```

## 4. 尺寸 sizing

常用尺寸：

```html
<div class="w-full">宽度 100%</div>
<div class="w-64">固定宽度</div>
<div class="max-w-md">最大宽度</div>
<div class="h-screen">高度等于视口</div>
<div class="min-h-screen">最小高度等于视口</div>
<img class="size-10" />
```

常见 class：

```txt
w-full       width: 100%
h-full       height: 100%
w-screen     width: 100vw
h-screen     height: 100vh
min-h-screen min-height: 100vh
max-w-md     最大宽度
size-10      width 和 height 同时设置
```

工作场景：

```html
<!-- 固定宽度侧边栏 -->
<aside class="w-64 shrink-0 border-r bg-white">
  侧边栏
</aside>

<!-- 头像 -->
<img class="size-10 rounded-full" src="/avatar.png" alt="" />

<!-- 页面内容限制最大宽度并居中 -->
<main class="mx-auto max-w-6xl px-6">
  内容
</main>
```

## 5. 布局 layout

### Flex 布局

Flex 是后台系统、表单、导航栏、按钮组里最常见的布局方式。

```html
<div class="flex items-center justify-between">
  <span>左侧</span>
  <button>右侧</button>
</div>
```

常用 class：

```txt
flex              display: flex
inline-flex       display: inline-flex
flex-col          纵向排列
flex-row          横向排列
items-start       交叉轴起点对齐
items-center      交叉轴居中
items-end         交叉轴终点对齐
justify-start     主轴起点对齐
justify-center    主轴居中
justify-between   两端对齐
justify-end       主轴终点对齐
flex-1            占据剩余空间
shrink-0          不允许压缩
grow              允许增长
```

工作场景：

```html
<!-- 一行左标题右按钮 -->
<div class="flex items-center justify-between gap-4">
  <div>
    <h2 class="text-lg font-semibold text-gray-900">用户管理</h2>
    <p class="text-sm text-gray-500">管理系统用户和权限</p>
  </div>
  <button class="shrink-0 rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
    新增用户
  </button>
</div>
```

### Grid 布局

Grid 适合卡片列表、仪表盘、复杂页面分栏。

```html
<div class="grid grid-cols-3 gap-4">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>
```

常用 class：

```txt
grid          display: grid
grid-cols-1   一列
grid-cols-2   两列
grid-cols-3   三列
gap-4         网格间距
col-span-2    占两列
```

工作场景：

```html
<!-- 响应式卡片列表 -->
<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
  <article class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
    卡片内容
  </article>
</div>
```

## 6. 定位 position 和层级 z-index

常用 class：

```txt
relative   position: relative
absolute   position: absolute
fixed      position: fixed
sticky     position: sticky
inset-0    top/right/bottom/left 全部为 0
top-0      top: 0
right-0    right: 0
bottom-0   bottom: 0
left-0     left: 0
z-10       z-index: 10
z-50       z-index: 50
```

工作场景：

```html
<!-- 卡片右上角关闭按钮 -->
<div class="relative rounded-lg border bg-white p-4">
  <button class="absolute right-2 top-2 rounded p-1 hover:bg-gray-100">
    x
  </button>
  内容
</div>

<!-- 固定顶部导航 -->
<header class="sticky top-0 z-50 border-b bg-white">
  顶部导航
</header>
```

## 7. 溢出 overflow

常用 class：

```txt
overflow-hidden   超出隐藏
overflow-auto     超出时显示滚动条
overflow-y-auto   纵向滚动
overflow-x-auto   横向滚动
truncate          单行省略
```

工作场景：

```html
<!-- 表格横向滚动 -->
<div class="overflow-x-auto">
  <table class="min-w-full">
    ...
  </table>
</div>

<!-- 弹窗内容超过高度时滚动 -->
<div class="max-h-[calc(100dvh-160px)] overflow-y-auto">
  弹窗内容
</div>
```

## 8. 文字 typography

常用 class：

```txt
text-xs       很小文字
text-sm       小号文字
text-base     默认字号
text-lg       较大文字
text-xl       标题
text-2xl      大标题
font-normal   常规字重
font-medium   中等字重
font-semibold 半粗
font-bold     加粗
leading-5     行高
leading-6     行高
text-left     左对齐
text-center   居中
text-right    右对齐
truncate      单行省略
whitespace-nowrap 不换行
break-words   长单词换行
```

注意：`text-*` 有两种含义。

```txt
text-sm        字号
text-gray-600 文字颜色
```

工作场景：

```html
<h1 class="text-2xl font-bold text-gray-900">页面标题</h1>
<p class="mt-2 text-sm leading-6 text-gray-600">
  这里是一段描述文字。
</p>
```

表格里常见文字：

```html
<td class="px-4 py-3 text-sm text-gray-700">
  张三
</td>
```

## 9. 颜色 color

常用颜色写法：

```html
<div class="bg-white text-gray-900">内容</div>
<button class="bg-blue-600 text-white hover:bg-blue-700">保存</button>
<p class="text-red-500">错误提示</p>
```

颜色深浅记忆：

```txt
50        很浅背景
100/200   浅背景、浅边框
300/400   次要状态
500       标准色
600/700   hover、强调
800/900   深色文字、强对比
```

常见工作选择：

```txt
页面背景        bg-gray-50
卡片背景        bg-white
主文字          text-gray-900
次级文字        text-gray-500
边框            border-gray-200
主按钮          bg-blue-600 text-white hover:bg-blue-700
危险按钮        bg-red-600 text-white hover:bg-red-700
成功提示        text-green-600
错误提示        text-red-500
```

## 10. 背景 background

常用 class：

```txt
bg-white
bg-gray-50
bg-blue-600
bg-transparent
bg-black/50
```

透明度可以使用 `/`：

```html
<div class="bg-black/50">半透明黑色遮罩</div>
<div class="bg-blue-600/10">浅蓝背景</div>
```

工作场景：

```html
<!-- 弹窗遮罩 -->
<div class="fixed inset-0 bg-black/50"></div>

<!-- 标签 -->
<span class="rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
  正常
</span>
```

## 11. 边框 border 和圆角 radius

常用 class：

```txt
border             默认 1px 边框
border-0           无边框
border-t           上边框
border-b           下边框
border-gray-200    边框颜色
rounded            默认圆角
rounded-md         中等圆角
rounded-lg         较大圆角
rounded-full       胶囊或圆形
```

工作场景：

```html
<!-- 卡片 -->
<div class="rounded-lg border border-gray-200 bg-white p-4">
  卡片内容
</div>

<!-- 头像圆形 -->
<img class="size-10 rounded-full" src="/avatar.png" alt="" />

<!-- 分隔线 -->
<div class="border-t border-gray-200"></div>
```

## 12. 阴影 shadow 和视觉效果

常用 class：

```txt
shadow       默认阴影
shadow-sm    小阴影
shadow-md    中等阴影
shadow-lg    大阴影
opacity-50   透明度 50%
transition   过渡
duration-200 过渡时间
```

工作场景：

```html
<button class="rounded-md bg-blue-600 px-4 py-2 text-white shadow-sm transition hover:bg-blue-700">
  保存
</button>
```

## 13. 表单 input、select、textarea

输入框常用写法：

```html
<input
  class="h-10 w-full rounded-md border border-gray-300 px-3 text-sm
         focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
/>
```

textarea：

```html
<textarea
  class="min-h-28 w-full rounded-md border border-gray-300 px-3 py-2 text-sm
         focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
></textarea>
```

禁用状态：

```html
<input
  disabled
  class="h-10 w-full rounded-md border border-gray-300 bg-gray-50 px-3 text-sm
         text-gray-500 disabled:cursor-not-allowed disabled:opacity-70"
/>
```

## 14. 按钮 button

主按钮：

```html
<button
  class="inline-flex h-10 items-center justify-center rounded-md bg-blue-600 px-4 text-sm font-medium text-white
         transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
         disabled:cursor-not-allowed disabled:opacity-50"
>
  保存
</button>
```

次按钮：

```html
<button
  class="inline-flex h-10 items-center justify-center rounded-md border border-gray-300 bg-white px-4 text-sm font-medium
         text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
>
  取消
</button>
```

危险按钮：

```html
<button
  class="inline-flex h-10 items-center justify-center rounded-md bg-red-600 px-4 text-sm font-medium text-white
         transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
>
  删除
</button>
```

## 15. 状态 variants

状态写法是在 class 前加前缀。

```html
<button
  class="rounded-md bg-blue-600 px-4 py-2 text-white transition
         hover:bg-blue-700
         active:bg-blue-800
         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
         disabled:cursor-not-allowed disabled:opacity-50"
>
  保存
</button>
```

常用状态：

```txt
hover:          鼠标悬停
focus:          聚焦
focus-visible:  键盘聚焦
active:         按下
disabled:       禁用
checked:        checkbox/radio 选中
first:          第一个元素
last:           最后一个元素
odd:            奇数行
even:           偶数行
group-hover:    父元素 hover 影响子元素
peer-checked:   兄弟 input 状态影响元素
```

`group-hover` 示例：

```html
<a class="group block rounded-lg p-4 hover:bg-gray-50">
  <h3 class="text-gray-900 group-hover:text-blue-600">标题</h3>
  <p class="text-gray-500">描述</p>
</a>
```

`peer-checked` 示例：

```html
<label class="flex items-center gap-2">
  <input type="checkbox" class="peer" />
  <span class="text-gray-600 peer-checked:text-blue-600">启用通知</span>
</label>
```

## 16. 响应式 responsive

TailwindCSS 是 mobile-first。

没有前缀的 class 对所有屏幕生效；`sm:`、`md:`、`lg:` 是从这个断点及以上生效。

```html
<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
  ...
</div>
```

含义：

```txt
手机：1 列
md 及以上：2 列
lg 及以上：4 列
```

常见断点：

```txt
sm  >= 40rem
md  >= 48rem
lg  >= 64rem
xl  >= 80rem
2xl >= 96rem
```

工作记法：

```txt
先写手机样式，再往大屏覆盖。
```

正确示例：

```html
<div class="text-center sm:text-left">
  手机居中，sm 以上左对齐
</div>
```

容易误解的写法：

```html
<div class="sm:text-center">
  这不是“只在手机居中”，而是 sm 以上居中
</div>
```

## 17. 暗色模式 dark mode

暗色模式使用 `dark:` 前缀。

```html
<div class="bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
  内容
</div>
```

常见组合：

```txt
bg-white dark:bg-gray-900
text-gray-900 dark:text-gray-100
text-gray-500 dark:text-gray-400
border-gray-200 dark:border-gray-700
```

工作场景：

```html
<div class="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
  <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">标题</h2>
  <p class="text-sm text-gray-500 dark:text-gray-400">描述文字</p>
</div>
```

## 18. 任意值 arbitrary values

设计稿里经常有特殊数值，比如 `13px`、`37px`、特殊颜色。这时可以用方括号。

```html
<div class="w-[376px] rounded-[10px] bg-[#1677ff]">
  内容
</div>
```

复杂值：

```html
<div class="grid grid-cols-[240px_minmax(0,1fr)]">
  ...
</div>

<div class="max-h-[calc(100dvh-64px)] overflow-y-auto">
  ...
</div>
```

建议：

```txt
少量特殊值可以用方括号。
反复出现的值应该沉淀到主题变量或组件样式。
```

## 19. 自定义主题 theme

TailwindCSS v4 更偏 CSS-first，可以在 CSS 中使用 `@theme` 定义设计变量。

```css
@import "tailwindcss";

@theme {
  --color-brand-50: #eff6ff;
  --color-brand-500: #3b82f6;
  --color-brand-600: #2563eb;

  --breakpoint-3xl: 120rem;
}
```

然后使用：

```html
<button class="bg-brand-500 hover:bg-brand-600">
  保存
</button>
```

适合自定义的内容：

```txt
品牌色
业务状态色
统一断点
统一字体
统一阴影
统一圆角
```

## 20. `@apply` 的使用边界

`@apply` 可以把一串 utility 合成一个 CSS 类。

```css
.btn-primary {
  @apply rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700;
}
```

适合使用 `@apply` 的场景：

```txt
项目里非常稳定、重复很多次的按钮、标签、表单样式
第三方库只能传一个 class 名
需要覆盖外部组件内部结构
```

不适合：

```txt
每个页面临时写一堆 .card .title .desc
把 Tailwind 写回传统 CSS 模式
```

在 React、Vue 组件项目中，通常更推荐把样式封装进组件：

```tsx
function Button({ children }) {
  return (
    <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
      {children}
    </button>
  )
}
```

## 21. 常见页面结构模板

### 后台管理页面

```html
<div class="flex min-h-screen bg-gray-50">
  <aside class="w-64 shrink-0 border-r bg-white">
    侧边栏
  </aside>

  <main class="flex-1 overflow-auto p-6">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">用户管理</h1>
        <p class="mt-1 text-sm text-gray-500">管理系统用户和权限</p>
      </div>
      <button class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
        新增用户
      </button>
    </div>

    <div class="rounded-lg border border-gray-200 bg-white">
      内容区域
    </div>
  </main>
</div>
```

### 卡片列表

```html
<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
  <article class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
    <h3 class="text-base font-semibold text-gray-900">项目名称</h3>
    <p class="mt-1 text-sm text-gray-500">项目描述信息</p>
  </article>
</div>
```

### 表单

```html
<form class="space-y-5">
  <div>
    <label class="mb-1 block text-sm font-medium text-gray-700">
      用户名
    </label>
    <input
      class="h-10 w-full rounded-md border border-gray-300 px-3 text-sm
             focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
    />
  </div>

  <div class="flex justify-end gap-3">
    <button class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
      取消
    </button>
    <button class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
      保存
    </button>
  </div>
</form>
```

## 22. 推荐 class 书写顺序

为了让 class 更容易读，建议按这个顺序组织：

```txt
1. display/position：flex relative grid
2. size：w-full h-10 max-w-md
3. spacing：p-4 mt-2 gap-3
4. layout align：items-center justify-between
5. visual：rounded border bg shadow
6. text：text-sm font-medium text-gray-700
7. state：hover: focus: disabled:
8. responsive：md: lg:
```

示例：

```html
<button
  class="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 md:h-11"
>
  保存
</button>
```

## 23. 最该优先记住的一组 class

先把下面这些记住，日常改样式够用大部分场景。

```txt
布局：flex grid hidden block relative absolute fixed
对齐：items-center justify-center justify-between
间距：p px py m mt mb gap space-y
尺寸：w-full h-full h-screen min-h-screen max-w size
文字：text-sm text-lg font-medium font-semibold text-gray-*
颜色：bg-* border-* text-*
边框：border rounded-md rounded-lg rounded-full
效果：shadow opacity transition
状态：hover: focus: active: disabled:
响应式：sm: md: lg: xl:
特殊值：[13px] [calc(...)] bg-[#1677ff]
```

## 24. 工作中排查样式问题的思路

当页面样式不符合预期时，按下面顺序排查：

```txt
1. 是布局问题吗？
   看 flex、grid、items-*、justify-*、flex-1、shrink-0。

2. 是间距问题吗？
   看 p-*、m-*、gap-*、space-y-*。

3. 是尺寸问题吗？
   看 w-*、h-*、min-h-*、max-w-*、size-*。

4. 是文字问题吗？
   看 text-*、font-*、leading-*、truncate、whitespace-*。

5. 是颜色或边框问题吗？
   看 bg-*、text-*、border-*、rounded-*。

6. 是交互状态问题吗？
   看 hover:*、focus:*、active:*、disabled:*。

7. 是响应式问题吗？
   看 sm:*、md:*、lg:* 是否覆盖了基础样式。

8. 是样式没有生效吗？
   检查 class 是否拼错、是否被后面的 class 覆盖、动态 class 是否能被 Tailwind 扫描到。
```

## 25. 常见错误

### 错误 1：误解响应式前缀

```html
<div class="sm:text-center">
  ...
</div>
```

这不是“手机居中”，而是 `sm` 及以上居中。

如果想手机居中、大屏左对齐：

```html
<div class="text-center sm:text-left">
  ...
</div>
```

### 错误 2：动态拼接 class 导致样式没生成

不推荐：

```tsx
const color = 'blue'
return <div className={`bg-${color}-500`}>内容</div>
```

更推荐：

```tsx
const colorClass = {
  blue: 'bg-blue-500',
  red: 'bg-red-500',
  green: 'bg-green-500',
}[color]

return <div className={colorClass}>内容</div>
```

### 错误 3：class 太长但没有组件化

如果同一串按钮样式在多个地方重复，可以提取组件。

```tsx
function PrimaryButton({ children }) {
  return (
    <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
      {children}
    </button>
  )
}
```

### 错误 4：任意值滥用

不建议整个项目到处都是：

```html
<div class="mt-[17px] w-[371px] rounded-[9px] text-[13px]">
  ...
</div>
```

除非设计系统明确要求，否则优先使用 Tailwind 的标准间距和尺寸。

## 26. 最实用的记忆方式

把 TailwindCSS 当作 CSS 属性速记表：

```txt
display: flex            -> flex
align-items: center      -> items-center
justify-content: between -> justify-between
padding: 16px            -> p-4
margin-top: 24px         -> mt-6
width: 100%              -> w-full
font-size: 14px          -> text-sm
font-weight: 600         -> font-semibold
border-radius            -> rounded-md
box-shadow               -> shadow-sm
background-color         -> bg-*
color                    -> text-*
```

实际开发时，最有效的方法是：

```txt
看到设计稿或页面问题，先判断它属于“间距、尺寸、布局、文字、颜色、状态、响应式”哪一类，再套对应前缀。
```

## 27. 官方文档参考

- Styling with utility classes: https://tailwindcss.com/docs/styling-with-utility-classes
- Installation with Vite: https://tailwindcss.com/docs/installation/using-vite
- Responsive design: https://tailwindcss.com/docs/responsive-design
- Hover, focus, and other states: https://tailwindcss.com/docs/hover-focus-and-other-states
- Theme variables: https://tailwindcss.com/docs/theme
