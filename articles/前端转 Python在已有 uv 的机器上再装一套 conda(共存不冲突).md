---
title: 前端转 Python:在已有 uv 的机器上再装一套 conda(共存不冲突)
date: 2026-07-05
author: lixiaobai
---

> **📚 本系列共三篇(前端转 Python 环境搭建)**
> 1. [选型总览] Python 环境全景:各套方案的优劣势与选型指南
> 2. [实操] 用 uv 搭一套像 pnpm 一样顺手的环境
> 3. **【实操】在已有 uv 的机器上再装一套 conda(共存不冲突)** ← 你在这里
>
> 建议按顺序阅读:先选型,再搭 uv,按需加 conda。

> 承接上一篇《前端转 Python:用 uv 搭一套像 pnpm 一样顺手的环境》。
> 本文解决一个新问题:**机器上已经装好了 uv,还能不能再装 conda?会不会打架?**
> 结论先给:**能共存,不冲突**,只要装的时候避开一个 PATH 的坑即可。

---

## 0. 先说结论

- uv 和 conda 是**两套互相独立**的工具,装在不同目录、各管各的 Python,谁也不覆盖谁。
- 唯一的"摩擦点"是 **PATH / 自动激活**:conda 默认会改 shell 启动脚本,一开终端就自动进它的 `base` 环境。关掉它就清爽了。
- 分工原则:**平时后端/脚本用 uv,数据科学/机器学习再 `conda activate`。同一个项目只用一套,别混。**

---

## 1. 为什么它们不会冲突

| | uv | conda |
|---|---|---|
| 装在哪 | `C:\Users\<你>\.local\bin` | 独立目录(如 `C:\Users\<你>\miniconda3`) |
| 管的 Python | 自己下载的 3.12.x | 自己那一套 base Python |
| 怎么用 | `uv run ...` | `conda activate xxx` 后直接 `python` |
| 锁文件 / 清单 | `uv.lock` / `pyproject.toml` | `environment.yml` |

文件层面互不干扰。要处理的只有一件事:别让 conda 抢占你的默认 `python`,也别让它一开终端就自动激活。下面的安装参数就是干这个的。

---

## 2. Miniconda 还是 Anaconda?

| 方案 | 内容 | 下载量 | 适合 |
|------|------|--------|------|
| **Miniconda**(推荐) | 只带 conda + Python + 少量必需包 | 约 100MB | 新手、磁盘友好,要什么自己 `conda install` |
| Anaconda | 自带几百个预装包(numpy/pandas/Jupyter/Spyder…) | 约 3GB | 想开箱即用、不想逐个装包 |

本文选 **Miniconda**:干净、够用,需要的库随时装。

---

## 3. 安装步骤(Windows,已装 uv 的前提下)

### 第 1 步:下载安装包

官方地址(也可换清华镜像加速):

```bash
# 官方
https://repo.anaconda.com/miniconda/Miniconda3-latest-Windows-x86_64.exe
# 清华镜像(国内更快)
https://mirrors.tuna.tsinghua.edu.cn/anaconda/miniconda/Miniconda3-latest-Windows-x86_64.exe
```

### 第 2 步:静默安装(带上"避坑三参数")

用命令行静默安装到用户目录,关键是后面三个参数:

```powershell
Miniconda3-latest-Windows-x86_64.exe /InstallationType=JustMe /RegisterPython=0 /AddToPath=0 /S /D=C:\Users\<你>\miniconda3
```

| 参数 | 作用 | 为什么重要 |
|------|------|-----------|
| `/InstallationType=JustMe` | 只给当前用户装 | 不需要管理员,干净 |
| `/RegisterPython=0` | **不**把 conda 的 python 注册成系统默认 | 避免抢占你的默认 `python` |
| `/AddToPath=0` | **不**写进 PATH | 避免污染 PATH、和 uv 抢位置 |
| `/S` | 静默安装 | 无需点下一步 |
| `/D=...` | 安装目录(必须放最后、不加引号) | 指定到用户目录 |

> 图形界面安装也行,但记得**取消勾选** "Add to PATH" 和 "Register as system Python" 这两项,效果一样。

### 第 3 步:关掉"自动激活 base"

这是共存体验的关键一步。装完执行:

```powershell
C:\Users\<你>\miniconda3\Scripts\conda.exe config --set auto_activate_base false
```

这样开终端不会自动进 conda 的 base 环境,你想用时再手动 `conda activate`。

### 第 4 步:配置国内镜像(清华源)

```powershell
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free
conda config --set show_channel_urls yes
```

### 第 5 步:接入 shell(让 `conda` 命令能直接敲)

因为装的时候没写 PATH,得手动让 conda 接管一次 shell:

```powershell
C:\Users\<你>\miniconda3\Scripts\conda.exe init
```

然后**重开终端**。之后 `conda --version`、`conda activate` 就能直接用了。

---

## 4. uv 和 conda 怎么分工

两套都接入 shell 后,按场景选用,**同一个项目只用一套**:

| 场景 | 用哪套 | 典型命令 |
|------|--------|---------|
| 后端 / 写脚本 / 学基础语法 | **uv** | `uv run xxx` |
| 数据科学 / 机器学习 / 重度 Jupyter | **conda** | `conda create -n ds python=3.12` → `conda activate ds` |

**判断口诀:** 装的库大多是纯 Python(Web 框架、请求库、工具库)→ uv;装的库带大量编译型科学依赖(numpy/pandas/科学计算/CUDA 相关)→ conda 更省事。

### conda 常用命令(对照前端 + uv)

| 你要做的事 | 前端习惯 | uv | conda |
|-----------|---------|-----|-------|
| 建一个隔离环境 | (自动 node_modules) | `uv init` | `conda create -n myenv python=3.12` |
| 进入环境 | (不用) | (不用,`uv run` 自动) | `conda activate myenv` |
| 退出环境 | (不用) | (不用) | `conda deactivate` |
| 装依赖 | `pnpm add x` | `uv add x` | `conda install x` |
| 查看所有环境 | `nvm ls` | `uv python list` | `conda env list` |
| 删除环境 | 删 node_modules | 删 `.venv` | `conda remove -n myenv --all` |

---

## 5. 验证共存成功

依次执行,达到下面结果就说明两套都好用、且互不干扰:

| 命令 | 期望结果 |
|------|---------|
| `uv --version` | 打印 uv 版本号(说明 uv 没被破坏) |
| `conda --version` | 打印 conda 版本号 |
| `conda env list` | 列出 `base` 环境 |
| 新开终端不自动进 `(base)` | 命令行提示符前**没有** `(base)` 字样 |

---

## 6. 常见问题(FAQ)

**Q:装了 conda 会不会把我的 uv 弄坏?**
不会。两者装在不同目录、各自管理自己的 Python。只要装 conda 时用了 `/RegisterPython=0 /AddToPath=0`,uv 完全不受影响。

**Q:一开终端就显示 `(base)`,怎么去掉?**
执行 `conda config --set auto_activate_base false`,重开终端即可。

**Q:conda 和 uv 的项目能放同一个文件夹吗?**
技术上可以,但**强烈不建议**。同一个项目只用一套,避免两套虚拟环境和锁文件互相干扰、把自己绕晕。

**Q:conda 装包很慢?**
确认第 4 步的清华镜像配好了。也可以用更快的 `mamba`(conda 的加速替代):`conda install -n base mamba`,之后把 `conda install` 换成 `mamba install`。

**Q:什么时候我该彻底用 conda 而不是 uv?**
当你发现某些科学计算库(尤其带 C/Fortran/CUDA 编译的)用 uv/pip 装总失败或很麻烦时,conda 的预编译二进制包会省心很多。日常后端和脚本仍然优先 uv。

---

## 7. 一句话总结

> uv 和 conda 可以在同一台机器上和平共处。装 conda 时记住"三件套":`/RegisterPython=0`、`/AddToPath=0`、`auto_activate_base false`。之后**后端脚本走 uv,数据科学走 conda**,井水不犯河水。

---

*本文承接 uv 环境搭建篇,面向从前端转 Python 的新手。如有帮助欢迎转发。*
