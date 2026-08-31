# DSH 写文件不触发 GameCreator 引擎自动重编译 —— 问题与方案总结

## 1. 背景

- 项目：`C:\PAD`，GameCreator 引擎（国产可视化游戏引擎），开发语言 TypeScript。
- 游戏预览由 `Game.html` 加载**分文件产物** `out/game/project/**/*.js`。
  - 这些分文件 `.js` 由 **GameCreator 编辑器**编译生成（不是 `npm run build` 生成的 `out/Game.js` 打包产物）。
  - `npm run build`（`tsc -b tsconfig.json`）产出的是 `out/Game.js`，与编辑器预览走的分文件产物是两套东西。

## 2. 现象

| 工具 | 改 `.ts` 后 | 引擎反应 |
|---|---|---|
| Trae（普通编辑器） | 原地写文件 | **立刻**重编译，预览立刻更新 |
| DeepSeek Harness（write/edit 工具） | 原子替换文件 | **不**重编译，必须重启编辑器/重新预览才能看到 |

## 3. 根因（已从源码确认）

DSH 的 `write`/`edit` 落盘走「**原子替换**」：先写临时文件，再 `rename()` 覆盖目标。证据（DSH 源码）：

- `@deepseek-ai/dsh-atomic-write/lib/index.js` → `writeFileAtomic`：`writeFile(temp)` + `rename(temp, filename)`
- `@deepseek-ai/dsh-fs-local/lib/index.js` → Windows 上用 staging 目录 + `replaceFileWin32`

而 Trae 是「**原地写**」：直接打开目标文件写内容。

Windows 文件监听（`ReadDirectoryChangesW`）区分两类事件：

- `FILE_NOTIFY_CHANGE_LAST_WRITE`（文件内容被**原地写**）→ 引擎监听这个 → 触发重编译
- `FILE_NOTIFY_CHANGE_FILE_NAME`（文件被**改名/替换**）→ 引擎**没**监听 → 不触发

DSH 的 `rename` 触发的是第二类事件，所以引擎不重编译。

## 4. 目标

让 DSH 写文件后，GameCreator 引擎能像 Trae 一样自动重编译，无需重启。

## 5. 方案 C：写一个 DSH 插件

### 5.1 插件要做什么

让 DSH 的文件写操作触发 `FILE_NOTIFY_CHANGE_LAST_WRITE`（即「原地写」事件），或主动通知编辑器重编译。

### 5.2 两条实现路线

- **C1 原地写模式**：改造 write/edit 的落盘，直接 `truncate + write + close` 目标文件，放弃原子替换的崩溃安全（普通编辑器都这么干，代码文件可接受）。
- **C2 写后 touch**：保留原子替换（安全），写完后对目标文件做一次**字节级原地重写**（`ReadAllBytes` + `WriteAllBytes`，内容不变）或更新 mtime，补发 `LAST_WRITE` 事件。

### 5.3 可挂载的 DSH 内部位置（供实现者参考）

- `@deepseek-ai/dsh-tool-fs` —— write/edit 工具实现
- `@deepseek-ai/dsh-fs` —— 文件系统 provider 接口（注释明确「mutations are atomic」）
- `@deepseek-ai/dsh-fs-local` —— 本地实现（`writeFileAtomic` / `replaceFileWin32`）
- `@deepseek-ai/dsh-fs-sandbox` —— 沙箱包装（atomic write/edit）
- `@deepseek-ai/dsh-atomic-write` —— 原子写工具

### 5.4 ⚠️ 必须先验证的关键假设

实测：对 `.ts` 做一次字节级原地重写（内容不变），**60 秒内 `out/game/project/PAD/PADPuzzle.js` 没有重编译**。两种可能：

1. 编辑器监听**只在「游戏预览运行中」才激活**——测试时预览没在跑，所以没触发；
2. 编辑器**根本不监听外部写入**，Trae 是靠别的机制（如 GameCreator 的 LSP/插件/主动通知）让编辑器感知的。

**实现插件前，必须先在「预览运行中」状态下验证**：外部对 `.ts` 的原地写能否触发重编译。

- 若能 → 走 C1 或 C2 即可。
- 若不能 → 说明 Trae 有额外集成，插件需要改成「**主动通知编辑器重编译**」（需要摸清 GameCreator 编辑器的接口，成本更高）。

## 6. 已确认、后续不必重做的事

- 根因已确认（DSH 原子写 vs 编辑器监听，见第 3 节）。
- 「加空格在 Trae 保存」**有丢改动风险**（Trae 缓冲区陈旧时会用旧内容覆盖 DSH 改动），不可靠。
- 单纯「原地重写 touch」在**非预览**状态下不触发重编译（见 5.4）。
