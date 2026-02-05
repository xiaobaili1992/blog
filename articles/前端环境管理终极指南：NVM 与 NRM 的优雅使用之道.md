>作为前端开发者，你是否遇到过这样的窘境：
>*   旧项目跑不起来，提示“Node 版本过高”？
>*   新项目因为依赖 `node-sass`，死活不能升级 Node 版本？
>*   `npm install` 速度慢如蜗牛，甚至经常中断报错？

>这些问题不仅浪费时间，更极大地消磨开发耐心。我强烈建议在你的工具箱中装备两件“神器”：**NVM (Node Version Manager)** 和 **NRM (NPM Registry Manager)**。
NVM 让你能在同一台电脑上无缝切换多个 Node 版本，完美解决版本兼容问题；NRM 则能让你在几毫秒内切换 npm 的下载源，彻底告别网络困扰。本文将手把手带你从零开始掌握这两大利器。

---

## 目录
[一、NVM：Node 版本管理大师](#一-nvm-node-版本管理大师)
1. 什么是 NVM？
2. 如何安装 NVM？
3. NVM 核心配置（国内加速）
4. NVM 常用命令大全

[二、NRM：NPM 源切换加速器](#二-nrm-npm-源切换加速器)
1. 什么是 NRM？
2. 如何安装 NRM？
3. NRM 常用命令大全

[三、总结与最佳实践](#三-总结与最佳实践)

---

### <a id="一-nvm-node-版本管理大师"></a>一、 NVM：Node 版本管理大师

#### 1. 什么是 NVM？
NVM (Node Version Manager) 是一个允许你在同一台机器上安装和切换不同版本 Node.js 的命令行工具。它就像一个“多系统启动盘”，让你在开发不同项目时，一键切换到对应的 Node 环境。

#### 2. 如何安装 NVM？
**Windows 用户**

Windows 用户不能直接使用 Unix 版本的 nvm，请使用专门为 Windows 开发的 `nvm-windows`。
1.  访问 [nvm-windows GitHub 发布页](https://github.com/coreybutler/nvm-windows/releases)。
2.  下载最新的 `nvm-setup.exe` 安装包。
3.  双击安装，**一路 Next 即可**（建议保持默认安装路径，避免出现权限问题）。

**Mac / Linux 用户**

推荐使用 curl 或 wget 安装。
打开终端，执行以下命令（推荐使用 curl）：
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```
或者使用 wget：
```bash
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

> 💡 **注意**：安装完成后，请重启终端或执行 `source ~/.bashrc` (或 `source ~/.zshrc`) 使配置生效。

#### 3. NVM 核心配置：设置国内镜像源

Node.js 官方下载服务器在国外，下载速度极慢。为了拥有丝滑的体验，我们需要配置镜像源。
*   **Windows 用户**：
    找到 NVM 的安装目录（通常在 `C:\Users\你的用户名\AppData\Roaming\nvm`），打开 `settings.txt` 文件，添加以下两行：
    ```text
    node_mirror: https://npmmirror.com/mirrors/node/
    npm_mirror: https://npmmirror.com/mirrors/npm/
    ```
*   **Mac / Linux 用户**：
    在终端执行：
    ```bash
    export NVM_NODEJS_ORG_MIRROR=https://npmmirror.com/mirrors/node/
    ```
    *(建议将此行加入 `~/.bashrc` 或 `~/.zshrc` 永久生效)*

#### 4. NVM 常用命令大全
| 命令 | 作用 | 示例/说明 |
| :--- | :--- | :--- |
| `nvm list` / `nvm ls` | 查看已安装的所有 Node 版本 | 当前使用的版本前面会有 `*` 号 |
| `nvm install <version>` | 安装指定版本的 Node | `nvm install 18.16.0` |
| `nvm use <version>` | 切换到指定版本的 Node | `nvm use 16` (切换到 16.x.x 最新版) |
| `nvm uninstall <version>` | 卸载指定版本 | `nvm uninstall 14.0.0` |
| `nvm alias default <version>` | 设置默认 Node 版本 | 设置终端打开时默认使用的版本 |
| `nvm current` | 显示当前正在使用的版本 | - |

---

### <a id="二-nrm-npm-源切换加速器"></a>二、 NRM：NPM 源切换加速器

#### 1. 什么是 NRM？
NRM (NPM Registry Manager) 是一个专门用来管理和快速切换 npm registry（注册表/源）的工具。它无需你去手动修改配置文件，一个命令就能在官方源、淘宝源、公司私有源之间自由穿梭。

#### 2. 如何安装 NRM？
**⚠️ 前提条件**：你需要先安装 Node.js 和 npm。
打开终端/命令行，执行全局安装命令：
```bash
npm install -g nrm
```

> 💡 **Windows 用户提示**：如果在 PowerShell 中报错，建议以管理员身份运行 CMD 或 PowerShell。

#### 3. NRM 常用命令大全
| 命令 | 作用 | 示例/说明 |
| :--- | :--- | :--- |
| `nrm ls` | 列出所有可用的源 | 带 `*` 号的为当前使用的源 |
| `nrm use <registry>` | 切换到指定源 | `nrm use taobao` (瞬间切换到淘宝源) |
| `nrm test <registry>` | 测试指定源的响应速度 | `nrm test npm` (查看哪个源更快) |
| `nrm add <name> <url>` | 添加自定义源（如公司私服） | `nrm add company http://npm.company.com` |
| `nrm del <name>` | 删除自定义源 | `nrm del company` |
| `nrm current` | 显示当前使用的源名称 | - |

---

## <a id="三-总结与最佳实践"></a>三、总结与最佳实践
1.  **组合使用，效率翻倍**：
    *   用 **NVM** 控制大环境（Node 版本）。
    *   用 **NRM** 控制管道速度（NPM 源）。

2.  **开发规范**：
    *   在 `package.json` 或项目 README 中注明项目需要的 Node 版本（使用 `engines` 字段）。
    *   公司项目优先配置公司私有源（`nrm add`），开源项目或个人开发切换至淘宝源。

3.  **遇到问题**：
    *   装不上依赖？先看 Node 版本对不对（用 nvm 切换）。
    *   下载太慢？先看源对不对（用 nrm 切换）。

>掌握了 NVM 和 NRM，你就拥有了驾驭复杂前端环境的能力。从今天开始，告别“环境配置一小时，开发五分钟”的痛苦吧！

---

希望这篇教程对你有所帮助！如有问题，欢迎交流讨论
