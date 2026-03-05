>Git 是每位开发者的必备技能，但面对琳琅满目的命令，我们常常会感到记忆模糊。别担心，这篇教程摒弃了枯燥的字典式罗列，而是基于真实的**工作场景**进行分类。无论你是初学者还是资深开发者，这份清单都能成为你案头的得力助手。

---
## 📑 目录
- [一、项目起步：初始化与配置](#一项目起步初始化与配置)
- [二、日常开发：高频核心流程](#二日常开发高频核心流程)
- [三、分支管理：多线作战的艺术](#三分支管理多线作战的艺术)
- [四、暂存现场：临时任务的救星](#四暂存现场临时任务的救星)
- [五、同步协作：拉取与冲突解决](#五同步协作拉取与冲突解决)
- [六、代码整合：合并与挑选](#六代码整合合并与挑选)
- [七、纠错回退：后悔药怎么吃](#七纠错回退后悔药怎么吃)
- [八、版本标记：里程碑管理](#八版本标记里程碑管理)
- [九、追踪排查：找 Bug 与看历史](#九追踪排查找-bug-与看历史)
- [十、经典实战：紧急修复全流程](#十经典实战紧急修复全流程)
- [十一、提交规范：让历史更清晰](#十一提交规范让历史更清晰)
- [十二、忽略文件：.gitignore 配置指南](#十二忽略文件gitignore-配置指南)
- [十三、git学习：像玩游戏闯关一样学习git](#十三git学习像玩游戏闯关一样学习git)

---
### 一、项目起步：初始化与配置
**场景**：新入职一家公司，或者从零开始参与一个开源项目。
*   **克隆远程仓库**
    最常用的操作，将远程代码拉取到本地。
    ```bash
    # 默认克隆主分支
    git clone <远程仓库地址>
    # 只克隆指定分支，节省时间和空间
    git clone -b <分支名> <远程仓库地址>
    ```
*   **关联远程仓库**
    如果你本地已经建了文件夹，想关联到远程空仓库。
    ```bash
    git init
    git remote add origin <远程仓库地址>
    git remote -v  # 查看关联情况
    ```
### 二、日常开发：高频核心流程
**场景**： coding 中最频繁的操作，写代码 -> 检查 -> 提交 -> 推送。
*   **查看状态与比对**
    提交前务必检查，防止提交不该提交的文件。
    ```bash
    git status            # 查看当前变动状态
    git status -s         # 简洁模式（推荐）
    
    # 查看差异（关键！）
    git diff              # 查看工作区 vs 暂存区（未 add 的改动）
    git diff --cached     # 查看暂存区 vs 本地仓库（已 add 未 commit 的改动）
    ```
*   **提交代码**
    将代码保存到本地仓库的“快照”中。
    ```bash
    git add .             # 添加所有变动到暂存区
    
    # 提交
    git commit -m "feat: 新增登录功能"
    
    # 跳过校验（通常用于绕过 ESLint 等钩子检查，慎用）
    git commit -m "feat: 新增登录功能" --no-verify
    
    # 修改上一次提交备注（未 push 前有效）
    git commit --amend -m "feat: 新增登录功能（优化版）"
    ```
*   **推送到远程**
    将本地提交同步到服务器。
    ```bash
    git push              # 推送当前分支
    git push -u origin <分支名>  # 首次推送并建立追踪关系
    ```
### 三、分支管理：多线作战的艺术
**场景**：开发新功能、修复 Bug、清理无用分支。
*   **分支查看与切换**
    ```bash
    git branch        # 查看本地分支
    git branch -a     # 查看所有分支（含远程）
    
    # 切换分支
    git checkout <分支名>
    # 推荐现代语法（语义更清晰）
    git switch <分支名>
    
    # 创建并切换
    git checkout -b <新分支名>
    git switch -c <新分支名>
    ```
*   **删除分支**
    ```bash
    # 删除本地分支
    git branch -d <分支名>   # 安全删除（已合并）
    git branch -D <分支名>   # 强制删除（未合并也删）
    
    # 删除远程分支
    git push origin --delete <分支名>
    ```
*   **清理本地残留**
    **场景**：同事删除了远程分支，你本地 `git branch -a` 还能看到。
    ```bash
    git fetch -p   # 拉取最新信息并清理无效的远程引用
    ```
### 四、暂存现场：临时任务的救星
**场景**：正在写功能，产品经理突然让你修个紧急 Bug，不想提交半成品代码。
*   **基础操作**
    ```bash
    git stash            # 暂存当前修改
    git stash list       # 查看暂存列表
    git stash pop        # 恢复最近一次暂存并删除记录
    git stash apply      # 恢复暂存但保留记录（安全起见推荐用这个）
    ```
    *   **进阶操作**
    ```bash
    git stash save "开发到一半的登录功能"  # 带备注，方便识别
    git stash pop stash@{1}              # 恢复指定暂存
    ```
    > **注意**：在 PowerShell 终端中，引用 `stash@{0}` 时需要加引号。
    ```bash
    git stash pop 'stash@{1}' # 添加引号
    ```
### 五、同步协作：拉取与冲突解决
**场景**：团队协作，拉取最新代码，处理令人头疼的冲突。
*   **常规拉取**
    ```bash
    git pull origin <分支名>
    ```
*   **强拉覆盖本地（慎用！）**
    **场景**：本地开发乱了，想完全放弃本地修改，同步线上最新版。
    ```bash
    git fetch --all
    git reset --hard origin/<分支名>
    git pull
    ```
*   **标准冲突解决流程**
    1. `git pull` 发现有冲突，pull 失败。
    2. `git stash` 暂存当前修改。
    3. `git pull` 拉取最新代码。
    4. `git stash pop` 恢复暂存的修改。
    5. 检查合并结果，解决冲突。
    6. `git add <冲突文件>` 标记解决冲突的文件。
    7. `git commit -m "resolve conflicts"` 提交合并。
### 六、代码整合：合并与挑选
**场景**：功能开发完成，合入主分支；或者只想合并某几个特定的提交。
*   **Merge 合并（最常用）**
    ```bash
    git checkout <目标分支>   # 如 master
    git merge <功能分支>      # 合并分支
    # 如果有冲突，按上述流程解决即可
    ```
*   **Cherry-pick（精准打击）**
    **场景**：只想把测试环境的某个修复补丁合入生产环境，而不合并整个分支。
    ```bash
    git cherry-pick <commitId>       # 合并单次提交
    git cherry-pick <id1>..<id2>     # 合并区间提交
    ```
### 七、纠错回退：后悔药怎么吃
**场景**：提交错了、代码改崩了、需要回滚版本。
*   **撤销修改**
    ```bash
    git restore <文件名>          # 丢弃工作区修改（未 add 前）
    git restore --staged <文件名> # 撤销 add，保留修改
    ```
*   **版本回退**
    ```bash
    # 回退到指定版本，丢弃之后的所有修改（危险）
    git reset --hard <commitId>
    
    # 回退到指定版本，保留修改在工作区（安全）
    git reset --soft <commitId>
    
    # 回退后强制推送到远程（极危险，团队协作慎用）
    git push -f
    ```
*   **Revert 撤销（推荐）**
    **场景**：已经 push 了，想撤销某次提交，但不能改变历史记录。
    ```bash
    git revert <commitId>   # 会生成一个新的提交来抵消指定提交
    ```
### 八、版本标记：里程碑管理
**场景**：项目上线，打版本标签。
```bash
git tag -a v1.0 -m "正式版上线"  # 创建标签
git push origin v1.0             # 推送标签
git tag -d v1.0                  # 删除本地标签
git push origin --delete v1.0    # 删除远程标签
```
### 九、追踪排查：找 Bug 与看历史
**场景**：排查问题是哪次提交引入的。
*   **查看日志**
    ```bash
    git log --oneline  # 简洁日志
    git blame <文件名> # 查看文件每一行是谁修改的，以及修改时间；也可以直接使用VS Code插件GitLens来查看
    ```
*   **二分查找**
    **场景**：不知道哪个 commit 引入了 Bug。
    ```bash
    git bisect start
    git bisect bad            # 当前版本有 bug
    git bisect good <好的ID>  # 指定一个没问题的版本
    # Git 会自动切换版本，你只需不断标记 good 或 bad
    git bisect reset          # 结束查找
    ```
### 十、经典实战：紧急修复全流程
**场景**：正在 `release/v1.0.1` 分支开发功能，突然线上 `master` 出 Bug 了。
```bash
# 1. 暂存当前开发进度
git stash save "开发进度保存"
# 2. 切换主分支并更新
git checkout master
git pull
# 3. 创建修复分支
git checkout -b hotfix/bug-101
# 4. 修复、提交、推送
git add .
git commit -m "fix: 修复线上支付Bug"
git push origin hotfix/bug-101
# 5. (修复完成后) 回到开发分支，恢复进度
git checkout release/v1.0.1
git stash pop
```
### 十一、提交规范：让历史更清晰
**场景**：团队协作时，每个人提交信息风格不一（如 "update", "fix", "aaa"），导致排查问题困难，无法自动生成变更日志。
业界广泛使用 **Angular 规范** 或 **Conventional Commits** 规范。格式如下：
> **`<type>(<scope>): <subject>`**
#### 1. 常用 Type（类型）说明
| 类型 | 含义 | 示例 |
| :--- | :--- | :--- |
| **feat** | 新功能 | `feat: 增加用户注册功能` |
| **fix** | 修复 Bug | `fix: 修复登录失败的问题` |
| **docs** | 文档变更 | `docs: 更新 README.md` |
| **style** | 代码格式（不影响逻辑，如空格、分号） | `style: 格式化代码缩进` |
| **refactor** | 重构（既不是新增功能，也不是修 Bug） | `refactor: 重构用户模块代码` |
| **perf** | 性能优化 | `perf: 优化首页加载速度` |
| **test** | 增加测试 | `test: 增加登录单元测试` |
| **chore** | 构建过程或辅助工具的变动 | `chore: 更新 webpack 配置` |
| **revert** | 回滚提交 | `revert: 回滚登录功能` |
#### 2. 完整示例
```bash
# 示例 1：简单的新增功能
git commit -m "feat: 增加微信支付接口"
# 示例 2：带范围 的修复
git commit -m "fix(user): 修改用户头像无法上传的问题"
# 示例 3：破坏性更新（!）
git commit -m "feat!: 重构 API 接口，不兼容旧版本"
```
> **提示**：可以使用`commitlint` `commitizen` `husky` `lint-staged` 等工具辅助生成规范的提交信息，确保团队成员遵循统一的提交规范。
> 详细配置可以参考另一篇文章 [从零开始：搭建企业级前端规范化指南](https://github.com/xiaobaili1992/blog/blob/main/articles/%E4%BB%8E%E9%9B%B6%E5%BC%80%E5%A7%8B%EF%BC%9A%E6%90%AD%E5%BB%BA%E4%BC%81%E4%B8%9A%E7%BA%A7%E5%89%8D%E7%AB%AF%E8%A7%84%E8%8C%83%E5%8C%96%E6%8C%87%E5%8D%97.md)
### 十二、忽略文件：.gitignore 配置指南
**场景**：有些文件（如密码配置、编译产物、IDE配置）不应该提交到代码库。`.gitignore` 文件就是用来定义哪些文件可以被 Git “无视”。
#### 1. 语法规则
*   `#`：注释。
*   `*`：匹配任意字符。
*   `?`：匹配单个字符。
*   `[]`：匹配字符列表。
*   `!`：取反（不忽略该文件）。
*   `/`：目录分隔符。开头表示根目录，末尾表示目录。
#### 2. 常见配置模板
建议在项目初始化时就配置好，以下是一个涵盖前后端及 IDE 的通用模板：
```gitignore
# ------------ 操作系统 ------------
.DS_Store      # Mac 系统文件
Thumbs.db      # Windows 系统文件
# ------------ IDE 与编辑器 ------------
.idea/         # JetBrains 系列
.vscode/       # VS Code
*.suo          # Visual Studio
*.ntvs*
*.njsproj
*.sln
# ------------ Node.js 前端项目 ------------
node_modules/  # 依赖包（这是最常见的忽略项）
dist/          # 打包产物
npm-debug.log*
yarn-debug.log*
yarn-error.log*
# ------------ 环境配置与敏感信息 ------------
.env           # 环境变量（通常含数据库密码等，严禁提交）
.env.local
.env.*.local
# ------------ Java 后端项目 ------------
target/        # Maven 产物
*.class        # Java 字节码
*.jar
*.war
*.log          # 日志文件
# ------------ Python ------------
__pycache__/
*.py[cod]
venv/
```
#### 3. 强制添加被忽略的文件
如果某个文件已经被 `.gitignore` 忽略了，但你确实需要提交它（例如一个示例配置文件）：
```bash
git add -f <文件名>
```
### 十三、git学习：像玩游戏闯关一样学习git
```
https://learngitbranching.js.org/?locale=zh_CN
```
---
## 🎉 总结
Git 的命令繁多，但并不需要全部死记硬背。掌握最核心的 `add`、`commit`、`push`、`pull` 和 `branch` 基本能应对 80% 的工作。对于进阶操作，如 `rebase`、`cherry-pick` 和 `bisect`，理解其背后的逻辑比记忆参数更重要。
建议将本文收藏，在遇到特定场景时（如代码回退、冲突解决）随时查阅。随着使用频率的增加，这些命令终将变成你的肌肉记忆。

---
希望这篇教程对你有所帮助！如有问题，欢迎交流讨论。
