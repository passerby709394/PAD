# Git 使用指南（PAD 项目）

## 速查：最常用的两条

### ① 备份到 GitHub（每次改完代码后执行）

```bash
cd C:\PAD
git add -A
git commit -m "改动说明"
git push
```

### ② 还原最近版本（按需选一条）

```bash
git restore .              # 丢弃「未提交」的改动
git reset --hard HEAD~1    # 撤销「最近一次提交」并丢弃其改动
git reset --soft HEAD~1    # 撤销「最近一次提交」但保留改动（可重改再提交）
git reset --hard <提交号>  # 回退到某个历史提交（<提交号> 用 git log 查）
```

> 若回退的是**已推送到 GitHub** 的提交，回退后再执行 `git push --force` 让远程同步。

---

## 仓库信息

| 项目 | 值 |
|---|---|
| 本地仓库路径 | `C:\PAD` |
| 远程仓库 | https://github.com/passerby709394/PAD （私有） |
| 默认分支 | `main` |
| 提交身份 | `6.1 <263473041@qq.com>` |
| git 代理 | `http://127.0.0.1:21882`（已设为全局） |
| 忽略（不入库） | `PAD/asset/`、`PAD/out/`、`PAD/bin_release/`、`PAD/gcUserData/`、`*.rar`、`*.zip`、`备份/`、`node_modules/` |

> ⚠️ **`PAD/asset/`（游戏资源，约 175MB）只保存在本地，不进入 git/GitHub。**
> 换电脑或重装后，需从本地压缩包备份（`PAD.rar`、`备份/*.rar`）解压，覆盖到 `PAD/asset/` 下。

---

## 一、手动推送改动到 GitHub

每次改完代码后，在 `C:\PAD` 目录下依次执行：

```bash
cd C:\PAD
git status                 # 1. 查看有哪些改动
git add -A                 # 2. 暂存所有改动（也可以 git add 具体文件）
git commit -m "改动说明"   # 3. 提交到本地仓库
git push                   # 4. 推送到 GitHub（已跟踪 origin/main，直接 push 即可）
```

- 提交说明建议用中文写清楚改了什么，方便以后回退时定位。
- 首次推送会弹出 Git Credential Manager 登录窗口，之后凭据会被记住，不再提示。

---

## 二、还原最近版本

### 情况 1：还没提交，想丢弃工作区里未提交的改动

```bash
cd C:\PAD
git status                          # 先看清楚改了哪些文件
git restore <文件名>                # 丢弃某个文件的改动（回到最近一次提交状态）
git restore .                       # 丢弃全部未提交改动（⚠️ 不可恢复）
```

### 情况 2：想回退到之前的某个提交

先看历史（每条前面那串十六进制就是「提交号」）：

```bash
git log --oneline
# 例如：
# e9e2ffe init: GameCreator 智龙迷城(PAD) 三消战斗项目初始提交
```

回退方式（二选一）：

```bash
# ① 软回退：撤销提交，但改动保留在工作区（可重新修改后再提交）
git reset --soft HEAD~1             # 回退到上一个提交
git reset --soft <提交号>           # 回退到指定提交

# ② 硬回退：彻底回到该提交，丢弃之后的所有改动（⚠️ 不可恢复，慎用）
git reset --hard <提交号>
```

> 如果这些提交**已经推送到 GitHub**，硬回退后需要强制推送让远程一致：
> ```bash
> git push --force
> ```

### 情况 3：只想撤销「某一次」已推送的提交（保留历史，推荐）

```bash
git revert <提交号>                 # 生成一个反向提交，撤销该次改动
git push                            # 推送到远程
```

### 情况 4：从 GitHub 恢复整个仓库（换电脑 / 本地损坏）

```bash
git clone https://github.com/passerby709394/PAD.git
```

> 克隆下来的仓库**不包含 `PAD/asset/`**（它不入库）。需要另外把 `PAD.rar` 或 `备份/` 里的资源解压，覆盖到克隆目录的 `PAD/asset/` 下，项目才完整。

---

## 三、常见问题

### 推送失败 / 连不上 github.com
先确认代理软件（`127.0.0.1:21882`）正在运行。git 已配置全局代理；若换了代理端口，重新设置：

```bash
git config --global http.proxy http://127.0.0.1:<新端口>
git config --global https.proxy http://127.0.0.1:<新端口>

# 彻底取消代理（不使用代理直连时）：
git config --global --unset http.proxy
git config --global --unset https.proxy
```

### 查看改动内容
```bash
git log --oneline                   # 提交历史（简洁）
git diff                            # 未提交改动的内容
git diff <提交号>                   # 与某个提交的差异
```

### 磁盘占用过大时清理本地仓库
```bash
git -C C:\PAD gc --prune=now --aggressive   # 清理不可达对象并压缩
```
