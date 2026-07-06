---
title: 前端转 Python:用 uv 搭一套像 pnpm 一样顺手的环境
date: 2026-07-04
author: lixiaobai
---

> **📚 本系列共三篇(前端转 Python 环境搭建)**
> 1. [选型总览] Python 环境全景:各套方案的优劣势与选型指南
> 2. **【实操】用 uv 搭一套像 pnpm 一样顺手的环境** ← 你在这里
> 3. [实操] 在已有 uv 的机器上再装一套 conda(共存不冲突)
>
> 建议按顺序阅读:先选型,再搭 uv,按需加 conda。

> 写给和我一样从前端(Node 生态)转过来、第一次接触 Python 的新手。
> 目标:用最接近 `nvm + nrm + pnpm` 的心智模型,把 Python 环境一次搭好。

---

## 0. 先说结论

如果你会用 `pnpm`,那么在 Python 世界里,**`uv`** 就是为你准备的工具:

- 它用 Rust 写成,速度极快;
- **一个工具同时干了 `nvm`(管版本)+ `pnpm`(装依赖)+ 虚拟环境管理三件事**;
- 心智模型几乎和 pnpm 一一对应,新手最省心。

本文最终搭出来的组合是:**uv + 清华镜像 + Python 3.12**。

---

## 1. 为什么 Python 环境和前端不一样

这是最关键、也最容易踩坑的一点,先讲清楚。

**前端:** 每个项目自带独立的 `node_modules`,项目之间天然隔离,你几乎感觉不到"隔离"这件事的存在。

**Python:** 默认情况下,你 `pip install` 的所有包都会装进那一个"全局 Python"里。A 项目要 `requests 2.0`、B 项目要 `requests 3.0`,它们会互相打架、互相污染。

所以 Python 世界多出一个前端没有的概念——**虚拟环境(virtual environment)**:你要为每个项目单独开一个隔离空间,类似给每个项目一份专属的 `node_modules`。

你听过的一大堆工具(venv / conda / poetry / pyenv…),很多其实都是在解决"版本管理"和"环境隔离"这两个问题。`uv` 的好处是:**它把这些都自动化了,你基本不用手动想"隔离"这回事。**

---

## 2. Node → Python 概念对照表

把你已经会的东西直接映射过来,理解起来最快:

| 作用 | 你熟悉的前端工具 | Python 对应 |
|------|----------------|-------------|
| 管理语言版本 | **nvm** | pyenv / conda / **uv** |
| 切换镜像源 | **nrm** | 改 pip 的 `index-url`(没有专门工具,配一下就行) |
| 安装依赖 | **npm / yarn / pnpm** | pip / poetry / **uv** |
| 项目隔离(node_modules) | 自动生成 `node_modules` | **venv**(手动建)/ conda env / **uv 自动建 `.venv`** |
| 锁文件 | `package-lock.json` / `pnpm-lock.yaml` | `requirements.txt` / `poetry.lock` / **`uv.lock`** |
| 项目清单 | `package.json` | `pyproject.toml` |
| 交互式笔记本 | (前端没有对应物) | Jupyter Notebook(当成一个包,装进环境即可) |

**一句话:** `uv` 一个工具,覆盖了上表里 nvm、pnpm、venv 三列的活。

---

## 3. 为什么选 uv,而不是 conda / poetry / venv

| 方案 | 定位 | 适合谁 |
|------|------|--------|
| **uv**(本文推荐) | 全能、极快、心智模型贴近 pnpm | 通用开发、后端、写脚本、学基础 |
| conda / miniconda | 自带一套生态,擅长科学计算的二进制依赖 | 重度数据科学 / 机器学习 / 重度 Jupyter |
| poetry | 依赖与打包管理,思路和 uv 类似但更慢、更早 | 已有 poetry 项目 |
| venv + pip | Python 自带,最原始,需手动激活/退出环境 | 想理解底层原理 / 极简场景 |
| pyenv | 只管版本(像 nvm),不管依赖 | 需要和其他工具搭配 |

**选择建议:**

- **通用开发 / 后端 / 写脚本 / 学基础语法** → 用 **uv**(本文方案)。
- **主要做 numpy、pandas、机器学习、重度 Jupyter** → 可以考虑 **conda/miniconda**,它处理科学计算的二进制依赖更省事。
- 一般开发顺带偶尔用 Jupyter,uv 完全够(`uv add jupyter` 即可)。

---

## 4. 完整安装步骤(Windows)

> 环境说明:本文命令基于 Windows 11。安装 uv 本体这一步用 **PowerShell** 最稳。

### 第 1 步:安装 uv 本体

打开 PowerShell,执行官方安装命令:

```powershell
irm https://astral.sh/uv/install.ps1 | iex
```

> `irm` 是 `Invoke-RestMethod`(下载脚本),`iex` 是 `Invoke-Expression`(执行脚本)。
> uv 是一个独立小程序,不依赖系统里预装的 Python。

装完**关掉并重开一个终端**(让 PATH 生效),然后验证:

```powershell
uv --version
```

能打印出版本号就说明装好了。

### 第 2 步:用 uv 安装 Python 3.12

```powershell
uv python install 3.12
```

> 注意:uv 会自己下载一份干净的 Python,**不会**去碰系统里那个一运行就弹 Microsoft Store 的"假 python"(那其实是 Windows 的 App 执行别名占位符,不是真解释器)。

### 第 3 步:配置国内镜像(相当于 nrm 切淘宝源)

给 uv 配一个全局默认镜像,以后**所有项目**装包都走清华源,又快又稳。

新建配置文件 `C:\Users\<你的用户名>\AppData\Roaming\uv\uv.toml`,内容:

```toml
[[index]]
url = "https://pypi.tuna.tsinghua.edu.cn/simple"
default = true
```

> 配一次,以后不用再管。想换阿里源,把 url 换成 `https://mirrors.aliyun.com/pypi/simple` 即可。

---

## 5. 在一个项目里实际用起来

假设你有个项目目录,里面已经有 `stats.py` 和 `test_stats.py`。把它初始化成 uv 项目:

### 初始化项目

```bash
uv init
```

生成 `pyproject.toml`(≈ `package.json`)。

### 添加开发依赖(以 pytest 为例)

```bash
uv add --dev pytest
```

uv 会自动:
1. 建好隔离环境 `.venv/`(≈ `node_modules`,不用提交到 git);
2. 装上 pytest;
3. 把依赖写进 `uv.lock`(≈ `pnpm-lock.yaml`)。

### 跑测试 / 跑脚本

```bash
uv run pytest -v
uv run stats.py
```

> `uv run` 会**自动**使用项目环境,你**不需要**手动"激活/退出虚拟环境",这点比传统 venv 省心太多。

---

## 6. 日常命令速查(对照前端)

| 你要做的事 | 前端习惯 | uv 命令 |
|-----------|---------|---------|
| 新建项目 | `pnpm init` | `uv init myproject` |
| 加依赖 | `pnpm add axios` | `uv add requests` |
| 加开发依赖 | `pnpm add -D vitest` | `uv add --dev pytest` |
| 移除依赖 | `pnpm remove axios` | `uv remove requests` |
| 按锁文件装齐依赖 | `pnpm install` | `uv sync` |
| 跑脚本 / 命令 | `pnpm run xxx` | `uv run xxx` |
| 安装某个 Python 版本 | `nvm install 20` | `uv python install 3.12` |
| 给项目指定 Python 版本 | `nvm use 20` | `uv python pin 3.12` |
| 查看已装的 Python | `nvm ls` | `uv python list` |

**核心记忆点:** 一个 `uv` 走天下,几乎所有命令都能在 pnpm/nvm 里找到对应,不用背"激活环境"那套老流程。

---

## 7. 验证环境是否搭好

依次执行,达到以下结果就说明环境完全可用:

| 命令 | 期望结果 |
|------|---------|
| `uv --version` | 打印出 uv 版本号 |
| `uv run python --version` | 显示 `Python 3.12.x` |
| `uv run pytest -v` | 项目里的测试全部 `PASSED` |

---

## 8. 常见问题(FAQ)

**Q:命令行敲 `python` 弹出 Microsoft Store 怎么办?**
那是 Windows 的"App 执行别名"占位符,不是真 Python。用 uv 之后一律通过 `uv run python` 来跑,别直接敲 `python`。想彻底关掉那个弹窗:设置 → 应用 → 高级应用设置 → 应用执行别名 → 关掉 python / python3。

**Q:`.venv` 要不要提交到 git?**
不要,和 `node_modules` 一样加进 `.gitignore`。要提交的是 `pyproject.toml` 和 `uv.lock`,别人 `uv sync` 就能还原环境。

**Q:以后想用 Jupyter Notebook?**
在项目里 `uv add jupyter`,然后 `uv run jupyter notebook`。

**Q:装包还是很慢?**
确认第 3 步的镜像配置文件路径和内容正确;临时想给单条命令换源,可以用 `uv add --index https://pypi.tuna.tsinghua.edu.cn/simple <包名>`。

---

## 9. 一句话总结

> 前端用 `nvm + nrm + pnpm`,Python 新手直接上 **`uv`** 就好——一个工具全包了,命令还和 pnpm 高度对应。配上清华镜像,国内用起来又快又顺。

---

*本文面向从前端转 Python 的新手,如有帮助欢迎转发。*
