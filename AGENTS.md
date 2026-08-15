# PAD 项目规则

> 本文件是 DeepSeek Harness（DSH）的项目规则文件，格式兼容 Claude Code（CLAUDE.md）与 Codex（AGENTS.md）。AI 会自动加载它，作为开发本项目时的默认约定。

## 1. 项目是什么

- 基于 **GameCreator 引擎**（国产可视化游戏引擎，官网 gamecreator.com.cn，作者「黑暗之神KDS」）。
- 玩法：**智龙迷城（Puzzle & Dragons）风格的三消转珠战斗**，由官方模板「苍之羽 - Feather of Cyan（RPG-No Combat）」改造而来。
- 开发语言：**TypeScript**。

## 2. 关键路径

| 内容 | 路径 |
|---|---|
| 项目本体 | `C:\PAD\PAD` |
| 自研玩法代码 | `C:\PAD\PAD\Game\game\project\PAD\` |
| 引擎运行时库 | `C:\PAD\PAD\GameCreatorLib\`（`gamecreator.js` + `API\*.d.ts` 类型声明） |
| 引擎 API 文档 | `C:\PAD\GameCreatorLib.md`（约 252 页，查 API 先看这里） |
| 游戏资源 | `C:\PAD\PAD\asset\`（**不入 git，仅本地保存**） |
| 编译产物 | `C:\PAD\PAD\out\Game.js`（`npm run build` 生成，不入库） |

## 3. 自研代码结构（三消战斗核心）

核心逻辑集中在 `Game\game\project\PAD\`，按文件名大致分工（以源码为准）：

- `PADBattle.ts` —— 战斗主流程
- `PADBoard.ts` —— 棋盘/面板
- `PADElement.ts` —— 珠子/元素定义
- `PADMatcher.ts` —— 消除匹配检测
- `PADPuzzle.ts` —— 转珠/拼图逻辑
- `PADAction.ts` —— 动作/技能
- `PADanim.ts` —— 动画
- `PADhelper.ts` —— 工具函数
- `Batter.ts` —— 战斗者

> 以上分工是按文件名推断，具体行为以源码和 `GameCreatorLib.md` 为准。修改前先用 read 读相关文件。

## 4. 版本控制（git）

- 仓库：`C:\PAD`（`.git` 在此）；远程 `https://github.com/passerby709394/PAD`（私有）；分支 `main`。
- **`PAD/asset/` 不入库**（约 175MB 资源仅本地保存，另有 `.rar` 备份）。切勿 `git add` 它。
- 其它忽略项见 `C:\PAD\.gitignore`（`out/`、`bin_release/`、`gcUserData/`、`*.rar`、`*.zip`、`备份/`、`node_modules/`，以及工具/示例：`mugen_pazdora-master/`、UI素材、`GameCreatorLib.md`、`.trae/`）。
- 提交信息用中文，写明改了什么，例如 `feat: 调整战斗伤害公式`。
- git 已配置走本地代理 `http://127.0.0.1:21882`；代理未开启时 push/pull 会失败。
- 完成一轮重要改动后，主动备份：`git add -A && git commit -m "说明" && git push`。

## 5. 开发约定

- 全程 TypeScript，不引入与项目无关的依赖。
- 改代码前先 read 目标文件及其关联文件，理解现状再改。
- 引擎 API 不确定时，先查 `C:\PAD\GameCreatorLib.md`（用 grep 搜索类名/方法名）。
- 用 edit 做精准替换，不做不必要的整文件重写。
- 完成后说明改了什么、影响哪些文件，并提示是否需要提交备份。

## 6. 重要提醒

- `asset/` 资源不入 git——别因为「看着像项目一部分」就提交它。
- 不要把密钥、token、服务器/数据库配置等敏感信息写进代码或提交。
