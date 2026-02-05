>`package.json` 是前端工程化的“身份证”和“说明书”。它不仅是 Node.js 管理依赖的核心配置文件，更是现代前端工程化构建、分发、协作的基石。作为一名前端开发者，你是否曾经对 `peerDependencies` 和 `devDependencies` 的区别感到困惑？是否想知道如何编写一个既支持 CommonJS 又支持 ES Module 的组件库？或者如何配置 `sideEffects` 来优化你的打包体积？
本文将结合**实战业务项目、CLI脚手架、UI组件库、工具库、请求库**等不同场景，深度梳理 `package.json` 中每一个核心属性的作用与最佳实践。

---

## 📑 目录
[一、基础元信息：你是谁？](#一-基础元信息你是谁)
[二、入口与执行：怎么找到你？](#二-入口与执行怎么找到你)
[三、依赖管理：你需要什么？](#三-依赖管理你需要什么)
[四、工程配置：怎么构建和优化？](#四-工程配置怎么构建和优化)
[五、发布与分发：怎么交付？](#五-发布与分发怎么交付)
[六、场景实战：不同类型项目的配置模板](#六-场景实战不同类型项目的配置模板)
[七、总结](#七总结)

---

### 一、 基础元信息：你是谁？
这部分定义了项目最基本的信息，主要用于 NPM 仓库的检索、识别和法律声明。
| 属性 | 作用 | 使用场景与建议 |
| :--- | :--- | :--- |
| **`name`** | 项目/包的名称。 | **必须符合命名规范**（小写、连字符）。<br>👉 **实战**：发布到 NPM 时唯一，配合 Scoped 使用（如 `@company/utils`）。 |
| **`version`** | 版本号。 | 遵循 [Semver](https://semver.org/lang/zh-CN/) 规范（主版本.次版本.修订版）。<br>👉 **实战**：组件库升级需谨慎修改主版本号，避免 Breaking Change。 |
| **`description`** | 项目描述。 | **NPM 搜索的关键**。帮助用户快速理解包的功能。 |
| **`keywords`** | 关键词数组。 | 提高 NPM 搜索权重。 |
| **`author`** | 作者信息。 | 格式可以是字符串或对象 `{ "name": "xxx", "email": "xxx" }`。 |
| **`license`** | 开源协议。 | **非常重要**！<br>👉 **实战**：企业内部项目通常用 `UNLICENSED` 或私有协议；开源项目推荐 `MIT` 或 `Apache-2.0`。 |
| **`homepage`** | 项目主页地址。 | 通常指向 GitHub Pages 或官网文档。 |
| **`repository`** | 代码仓库地址。 | 方便用户查阅源码和提交 Issue，格式通常为 JSON 对象指定 type 和 url。 |
| **`bugs`** | 问题追踪地址。 | 通常指向 GitHub Issues。 |

---

### 二、 入口与执行：怎么找到你？
这部分决定了 Node.js 或打包工具如何找到你的代码，以及如何执行命令。
| 属性 | 作用 | 使用场景与建议 |
| :--- | :--- | :--- |
| **`main`** | CommonJS 规范的入口文件。 | 传统的 Node.js 打包入口，默认 `index.js`。(旧写法) |
| **`module`** | ES Module (ESM) 规范的入口文件。 | **现代构建工具**优先识别此字段，用于 Tree-shaking。(旧写法) |
| **`types`** | TypeScript 类型定义文件。 | 指向 `.d.ts` 文件。<br>👉 **UI库/工具库**：TS 用户的刚需，没这个字段 TS 项目会报错。(旧写法) |
| **`exports`** | **(推荐)** 条件导出主入口。 | 更强大的控制力，支持定义子路径、条件加载（如 `import` vs `require`）。<br>👉 **组件库/工具库**：必须使用 `exports` 来精确控制导出路径，防止内部文件被引用。(新写法，建议和main、module、types一起保留) |
| **`browser`** | 浏览器环境的入口。 | 当打包工具目标为浏览器时，优先使用此字段。<br>👉 **请求库**：如 `axios` 在浏览器端和 Node 端有不同的入口实现。 |
| **`bin`** | 命令行工具的可执行文件。 | **键值对**形式，如 `"cli": "./bin/cli.js"`。<br>👉 **脚手架**：核心字段，安装后会全局（或在 node_modules/.bin）生成命令。 |
| **`workspaces`** | Monorepo 工作区配置。 | **现代工程化核心**。指定本地子包路径（如 `packages/*`），允许 `npm install` 自动提升依赖。 |
| **`packageManager`** | 指定使用的包管理器。 | 如 `"packageManager": "pnpm@10.28.1"`。<br>👉 **实战**：确保所有团队成员使用相同的包管理器版本，避免依赖安装不一致。 |

---

### 三、 依赖管理：你需要什么？
这是 `package.json` 最复杂的部分，也是最容易被误用的地方。
| 属性 | 作用 | 使用场景与建议 |
| :--- | :--- | :--- |
| **`dependencies`** | 生产环境依赖。 | **业务代码运行必须的包**。<br>👉 **实战**：React、Vue、Lodash、Axios。 |
| **`devDependencies`** | 开发环境依赖。 | **构建、测试、Lint 工具**。<br>👉 **实战**：Webpack、Vite、Jest、ESLint、TypeScript。**注意**：你的库被安装时，这些不会随之安装。 |
| **`peerDependencies`** | 同伴依赖。 | **宿主环境必须提供的包**。不自动安装，仅提示版本范围，防止多次打包导致包体积变大。<br>👉 **UI组件库**：核心！如果你做一个 `Button` 组件依赖 React，必须把 React 放在这里，而不是 `dependencies`，防止安装多个 React 实例导致 Context 失效。 |
| **`optionalDependencies`** | 可选依赖。 | 安装失败不会中断整个安装流程。<br>👉 **工具库**：如支持 `chalk` 彩色输出，但如果安装失败，库依然能降级运行（仅无颜色）。 |
| **`bundledDependencies`** | 打包依赖。 | 发布时将指定的包打包进你的包内（很少用）。<br>👉 **特殊场景**：当某个依赖很难在 NPM 下载到时使用。 |

---

### 四、 工程配置：怎么构建和优化？
这些属性直接影响项目的构建行为和最终产物体积。
| 属性 | 作用 | 使用场景与建议 |
| :--- | :--- | :--- |
| **`scripts`** | NPM 脚本命令。 | 自动化的核心。支持 `pre`、`post` 生命周期钩子。<br>👉 **实战**：`"build": "vite build"`, `"lint": "eslint src"`。 |
| **`config`** | 配置字段。 | 供 scripts 使用的配置变量，通过 `npm_package_config_xxx` 读取。 |
| **`sideEffects`** | 副作用标记。 | **告诉 Webpack/Rollup 哪些文件可以安全地进行 Tree-shaking**。<br>👉 **UI组件库/工具库**：设为 `false` 表示所有代码无副作用，可按需删除未引用代码。若包含 CSS 文件（如 `import './style.css'`），需设为 `["*.css"]` 以免样式丢失。 |
| **`files`** | 发布文件白名单。 | 控制发布到 NPM 的文件列表。默认包含所有非忽略文件。<br>👉 **组件库/工具库**：**必须配置**！只发布 `dist`, `lib`, `README.md` 等，不要把源码 `src` 或测试 `__tests__` 发布出去，减少包体积。 也可以使用.npmignore文件来实现 |
| **`engines`** | 引擎版本限制。 | 指定 Node 或 npm 版本。<br>👉 **实战**：`{ "node": ">=20.0.0" }`，防止低版本 Node 运行项目导致报错。 |

---

### 五、 发布与分发：怎么交付？
当你完成开发，准备将代码交付给世界或团队时，这些属性至关重要。
| 属性 | 作用 | 使用场景与建议 |
| :--- | :--- | :--- |
| **`private`** | 私有标识。 | 设为 `true` 时，防止 `npm publish` 意外发布敏感代码。<br>👉 **实战项目**：企业业务代码**必须**设为 `true`。 |
| **`publishConfig`** | 发布配置。 | 可以指定发布地址、Tag、访问权限。<br>👉 **实战**：发布到私有 NPM 仓库时，需指定 `"registry": "http://npm.company.com"`；或指定 `"access": "public"`（针对 Scoped 包）。 |
| **`os`** | 操作系统兼容性。 | 黑名单或白名单。 |
| **`cpu`** | CPU 架构兼容性。 | 如 `['!arm']`。 |

---

### 六、 场景实战：不同类型项目的配置模板
#### 1. 🏢 实战业务项目
*特点：不发布到 NPM，看重构建效率、开发体验。*
```json
{
  "name": "my-business-app",
  "version": "1.0.0",
  "private": true,        // 🔒 核心：防止误发
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src"
  },
  "dependencies": {
    "react": "^18.0.0",
    "react-router-dom": "^6.0.0"
  },
  "devDependencies": {
    "vite": "^4.0.0",
    "typescript": "^5.0.0"
  },
  "engines": {
    "node": ">=16.0.0"
  }
}
```

#### 2. 🛠️ CLI 脚手架
*特点：需全局运行，依赖重量级工具链，强调 `bin` 字段。*
```json
{
  "name": "create-awesome-app",
  "version": "2.0.0",
  "bin": {
    "create-awesome-app": "./dist/cli.js"  // ⚡ 核心：定义命令
  },
  "files": [
    "dist"                                  // ⚡ 核心：只发构建后文件
  ],
  "dependencies": {
    "chalk": "^5.0.0",                     // 彩色输出
    "commander": "^10.0.0",                // 命令解析
    "inquirer": "^9.0.0",                  // 交互式提问
    "download-git-repo": "^3.0.0"          // 拉取模板
  },
  "publishConfig": {
    "access": "public"
  }
}
```

#### 3. 🎨 UI 组件库
*特点：按需加载、Tree-shaking、多格式支持、Peer Dependencies。*
```json
{
  "name": "awesome-ui",
  "version": "1.0.0",
  "main": "./dist/index.js",
  "module": "./dist/index.esm.js",         // ESM 入口
  "types": "./dist/index.d.ts",            // TS 类型
  "exports": {
    ".": {
      "import": "./dist/index.esm.js",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./styles": "./dist/style.css"         // ⚡ 核心：单独导出样式
  },
  "sideEffects": [
    "*.css",                                // ⚡ 核心：告诉打包工具 CSS 有副作用，不要删除
    "*.less"
  ],
  "peerDependencies": {
    "react": ">=16.8.0",
    "react-dom": ">=16.8.0"                // ⚡ 核心：由宿主环境提供 React
  },
  "devDependencies": {
    "react": "^18.0.0",                    // 仅用于开发时测试
    "vite": "^4.0.0",
    "sass": "^1.0.0"
  },
  "files": [
    "dist"                                 // ⚡ 核心：只发布产物
  ]
}
```

#### 4. 📦 工具函数库
*特点：纯逻辑、体积最小化、高度 Tree-shaking。*
```json
{
  "name": "my-awesome-utils",
  "version": "1.0.0",
  "module": "./dist/esm/index.js",
  "main": "./dist/cjs/index.js",
  "types": "./dist/types/index.d.ts",
  "sideEffects": false,                   // ⚡ 核心：完全无副作用，可随意 Tree-shaking
  "files": [
    "dist"
  ]
  // 通常 dependencies 为 0，或极少
}
```

#### 5. 🌐 请求库
*特点：环境适配、底层能力。*
```json
{
  "name": "my-request",
  "version": "1.0.0",
  "main": "lib/node.js",
  "browser": "lib/browser.js",            // ⚡ 核心：区分浏览器和 Node 环境
  "react-native": "lib/react-native.js", // 适配 RN
  "types": "index.d.ts",
  "dependencies": {
    "axios": "^1.0.0"
  },
  "sideEffects": false
}
```

---

### 七、总结
`package.json` 不仅仅是一个配置文件，它是前端项目的**DNA**。
*   对于**业务开发**，关注 `scripts` 和 `dependencies`，保证开发效率和稳定性。
*   对于**库开发者**，必须精通 `exports`, `main`, `module`, `types`, `sideEffects`, 

>`files` 以及 `peerDependencies`，这直接决定了你的库是否好用、体积是否够小、以及是否兼容用户的构建环境。
合理配置每一个属性，不仅能避免潜在的错误，还能极大地提升用户体验和专业度。希望这份梳理能让你在下一场技术评审或 Code Review 中，对 `package.json` 的掌控更加游刃有余。

---

希望这篇教程对你有所帮助！如有问题，欢迎交流讨论
