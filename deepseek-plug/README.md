# dsh-write-touch

DSH 宿主插件：在 `write` / `edit` 落盘后，对目标文件做一次**字节级原地重写（内容不变）**，补发 Windows 的 `FILE_NOTIFY_CHANGE_LAST_WRITE` 事件，让 **GameCreator 等编辑器无需重启即可自动重编译**。

对应设计文档：`docs/DSH插件-文件写入优化.md` 第 5 节「方案 C」。

## 为什么需要它

| 工具 | 落盘方式 | Windows 事件 | GameCreator 反应 |
|---|---|---|---|
| Trae（普通编辑器） | 原地写 | `LAST_WRITE` | 立刻重编译 |
| DSH write/edit | 原子替换（写临时文件 + rename） | `FILE_NAME` | 不重编译 |

DSH 的 `rename` 触发的是编辑器**不监听**的改名/替换事件；本插件在原子替换成功后再补一次原地写，发出编辑器**监听**的 `LAST_WRITE`。

## 方案选择：C2「写后 touch」

- 保留 DSH 的原子替换（崩溃安全不变），不改写沙箱围栏 / 版本守卫。
- 写/改成功后原地重写相同字节；`WriteFile` 写 ≥1 字节即更新最后写入时间 → 触发 `LAST_WRITE`。
- touch 后回填最新版本号，保证「同一文件连续写两次不重读」不会被误判为 stale。

> 文档里的 C1「原地写模式」需要重写 DSH 的 `writeFileAtomic`，会放弃原子替换与 Windows ACL 保留逻辑；本插件未采用。若后续验证表明必须走 C1，可在此包内扩展 `mode`。

## 验证状态

已实测确认：DSH 写/改 `.ts` 后，GameCreator 脚本编辑器能像 Trae 一样感知到外部改动（`LAST_WRITE` 事件生效）。

## 安装

插件按 DSH profile 的 bundle 机制安装。以本机 `web` profile 为例：

```powershell
# 方式一：CLI（若本包已发布到 npm / git）
dsh plugin --profile web add dsh-write-touch

# 方式二：本地安装（当前为本地产物）
#   1) 把本目录拷贝/软链到 C:\Users\Administrator\.dsh\profiles\web\node_modules\dsh-write-touch
#   2) 在 web profile 的 package.json 里加入依赖与 bundle：
#        "dependencies": { "dsh-write-touch": "link:../../../../deepseek-plug" }
#        "dsh.profile.bundles": [ ..., "dsh-write-touch" ]
#   3) 重启 dsh web
```

挂载声明（已随包附带 `cordis.patch.yml`）：

```yaml
- insert:
    - id: write-touch
      name: 'dsh-write-touch'
```

## 配置

在 profile 的 `cordis.patch.yml` 里对该插件 id 覆盖配置（默认值已够用）：

```yaml
- id: write-touch
  config:
    enabled: true          # 默认 true
    extensions: [".ts"]    # 命中这些后缀才 touch；[] = 所有文件
```

| 字段 | 默认 | 说明 |
|---|---|---|
| `enabled` | `true` | 是否启用 |
| `extensions` | `[".ts"]` | 写后 touch 的文件后缀白名单；空数组 = 全部 |

## 实现要点（供维护者）

- 挂载点：`ctx.fs`（`@deepseek-ai/dsh-fs` 服务），包装实例方法 `writeText` / `editText`。
  - 工具层每次动态调用 `ctx.fs.writeText(...)`，包装实例方法即可生效；
  - 后端无论挂 `dsh-fs-local` 还是 `dsh-fs-sandbox` 都成立，因为沙箱 `writeText` 内部走 `super.writeText`，不会二次触发包装。
- 版本一致性：touch 会改 mtime/ctime，导致 DSH 的 `version`（`dev:ino:size:mtimeNs:ctimeNs`）变化；插件在 touch 后 `ctx.fs.stat()` 重新探测并回填 `outcome.version`，避免 `fs-observation-policy` 记录的版本落后。
- 幂等：同一 `fs` 实例只包装一次（`Symbol.for` 标记），HMR / 重复装载安全。
- 无运行时依赖：只 import `node:fs/promises`，不 import 任何 `@deepseek-ai/*` 包；`fs` 服务经 `ctx.inject(['fs'], …)` 按需获取。

## 目录

```
deepseek-plug/
├─ package.json                # name=dsh-write-touch, dsh.bundle.patch → cordis.patch.yml
├─ cordis.patch.yml            # 挂载声明（insert id: write-touch）
├─ dsh.plugin.json             # 插件元信息（可选，供插件清单/市场发现）
├─ lib/index.js                # 插件实现（ESM，entry）
├─ README.md
└─ LICENSE
```
