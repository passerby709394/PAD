# PAD 项目上下文总结（供后续对话使用）

> 本文件是项目上下文的快照，用于新对话快速恢复状态。对话开始前先读本文件 + `AGENTS.md`。

## 1. 项目是什么

- 基于 **GameCreator 引擎**（国产可视化游戏引擎，官网 gamecreator.com.cn）的 **智龙迷城（P&D）风格三消转珠战斗**。
- 由官方模板「苍之羽 - Feather of Cyan」改造而来，开发语言 **TypeScript**。

## 2. 关键路径

| 内容 | 路径 |
|---|---|
| 仓库 | `C:\PAD`（git），远程 `https://github.com/passerby709394/PAD.git`（私有，分支 main） |
| 项目本体 | `C:\PAD\PAD` |
| 自研玩法代码 | `C:\PAD\PAD\Game\game\project\PAD\` |
| 引擎运行时库 | `C:\PAD\PAD\GameCreatorLib\`（`gamecreator.js` + `API\*.d.ts`） |
| 引擎 API 文档 | `C:\PAD\GameCreatorLib.md`（查 API 先看这里） |
| 游戏资源 | `C:\PAD\PAD\asset\`（**不入 git**） |
| 编译产物 | `C:\PAD\PAD\out\Game.js`（`npm run build` 生成，不入库） |
| 项目规则 | `C:\PAD\AGENTS.md` |

## 3. 自研代码文件分工

| 文件 | 职责 |
|---|---|
| `PADBattle.ts` | 战斗主流程（`init`/`next` 状态机、自定义指令 15002 开始战斗/15003 结束战斗） |
| `PADBoard.ts` | 棋盘/面板 |
| `PADElement.ts` | 珠子/元素定义（`dataIDs`、`TYPES`、`MODULE_ID=2`） |
| `PADMatcher.ts` | 消除匹配检测 |
| `PADPuzzle.ts` | 转珠/拼图逻辑（`lastResult.lastComboCount` = 本次连锁数） |
| `PADAction.ts` | 动作/技能（`playerAction`/`enemyAction`） |
| `PADanim.ts` | 动画（HP 变化、攻击/治疗动画、伤害/治疗飘字） |
| `PADhelper.ts` | 工具函数 + 伤害/治疗计算钩子 |
| `PADStatus.ts` | 状态系统（加状态、状态对伤害的影响） |
| `PADCondition.ts` | 敌人技能条件判断与选技能 |
| `Batter.ts` | 战斗者（敌我共用，`camp` 区分） |
| `Test.ts` | 测试 |

## 4. 战斗流程

- `PADBattle.next()` 状态机：`battleStep` 1=等待玩家 → 2=执行（`playerAction` → `enemyAction` → `next()`）→ 3=结算（胜负判定、重置 `enemyCanAction`、`battleRound++` 回到 1）。
- `PADBattle.battleRound`：当前回合数（从 1 起，结算后 +1）。
- `PADAction.playerAction(combos, onComplete)`：**先治疗（治疗数字先显示）→ 攻击（动画全部播完后一次性结算伤害）**；攻击与治疗两条异步链都完成才 `onComplete`（解除输入锁）。
- `PADAction.enemyAction`：遍历存活敌人（`isEnemy` 过滤、`enemyCanAction`、HP>0），`aiUseTimer` 倒计时减 1；归零后按当前技能分叉：`skill.isHeal` → 治疗，否则 → 攻击。
- 敌人技能选择：`PADCondition.selectSkill(enemy, startIndex, onDone)` —— 按条件片段事件（异步）选技能，`skillTimes` 用尽视为不满足，全部不满足兜底选起始技能。

## 5. 敌人技能数据

- `Module_Skill`（`CustomModuleRuntime.ts`）：`totalCD`（冷却回合）、`releaseActionID`（释放动作）、`releaseTimes`（连击次数）、`isHeal`（是否治疗）、`elementType1`（元素）、`isAll`（是否全体）、`atkBonus`（攻击倍率）、`heal`（治疗量，固定值）、`releaseAnimation`（释放特效）、`hitAnimation`（命中特效）等。
- `DataStructure_enemySkills`：`{ skill: Module_Skill, condition: string(片段事件数据), skillTimes: number(限制使用次数, 0=不限) }`。`Module_Actor.skills` 是该结构数组（敌人），`skillsPlayer` 仍是 `Module_Skill[]`（玩家，暂未做）。

## 6. 伤害 / 治疗计算（核心）

### 伤害链路（玩家打敌人）

1. **消除元素数加成**（`PADhelper.calcAttackReady`）：`ATK × (1 + (combo元素数-3) × elementBonus)`。
2. **combo 连锁加成**（`PADAction.prepareAttack`）：`atkAniPRtext × (lastComboCount-1) × comboBonus` 累加。
3. **最终伤害**：`changeHP` → `damageToEnemy` 钩子（状态 + 属性克制）。

### `Batter.changeHP(source, change, duration, type=0, onComplete): number`

返回**钩子计算后的最终带符号值**（飘字用）。内部按 camp 分派：

```ts
camp===0 && change<0 → finalChange = -damageToEnemy(source, this, -change, type)  // 敌人受伤害
camp===1 && change>0 → finalChange =  healToPlayer(source, source, change)        // 玩家治疗
camp===1 && change<0 → finalChange = -damageToPlayer(this, source, -change, type) // 玩家受伤害
camp===0 && change>0 → finalChange =  healToEnemy(source, this, change)           // 敌人治疗
```

### 钩子（`PADhelper`）

- `damageToEnemy(player, enemy, damage, type)`：先调 `PADStatus.calcStatusDamage`，再做属性克制（`restrain==敌方元素 → ×2`，`restrained==敌方元素 → ×0.5`）。
- `damageToPlayer(player, enemy, damage, type)`：暂空（原样返回）。
- `healToPlayer` / `healToEnemy`：暂空（原样返回）。
- `calcEnemyDamage(enemy, skill)` = `lvToValue(level,"ATK",actor) × skill.atkBonus`。
- `lvToValue(lv, property, actor)`：等级线性插值算属性值。

### 飘字用钩子后最终值

- 玩家单体/全体攻击：`finalDamage = PADhelper.damageToEnemy(...)` 直接算（不再走 changeHP 扣血），`accumulateDamage(target, finalDamage)` 按敌人累计。
- 玩家攻击动画全部播完后：`PADanim.applyAccumulatedDamage(onComplete)` 一次性扣血（`startHpAnimation(target, -total, 500)`）+ 飘 `-总伤害`。
- 敌人攻击（连击）：每次释放 `damageToPlayer(...)` 累加到 `totalFinalDamage`，全部释放完后一次性 `startHpAnimation(players[0], -total, 500)` 扣血 + 飘字。
- 玩家治疗：`finalHeal = changeHP(...)` 返回值，用最终值飘字；**治疗数字淡出 + 回血完成**都满足才触发后续（避免与伤害数字重叠）。

## 7. 状态系统（`PADStatus`）

- `Module_Status` 字段（`CustomModuleRuntime.ts`）：`isHP`（使用生命值条件）、`isTypeBonus`（使用属性系数）、`isHitsBonus`（连击）、`isCrossBonus`（十字）、`isRowBonus`（行）、`isColBonus`（列）、`isNumBonus`（消除数量）、`battler`（比较对象 0=敌人 1=玩家）、`compareHP`（比较逻辑 0:`>` 1:`>=` 2:`==` 3:`<=` 4:`<`）、`valueHP`（比较百分比）、`hpHitBonus`（伤害系数）、`hpHitedBonus`（受伤害系数）、`type`（属性）、`typeHitBonus`（伤害系数）、`typeHitedBonus`（受伤害系数）、`typeHits`（达到连击数）、`hitValue`/`compareHit`/`hitBonus`、`crossBonus`/`rowBonus`/`colBonus`/`Nums`/`typeForNum`/`NumBonus`、`layer`（状态层数）等。
- `PADStatus.calcStatusDamage(source, target, damage, type): number`：遍历 source/target 的状态应用系数。内部两个嵌套函数：
  - `conditionHP(battler)`：`isHP` 状态按 `compareHP` 判断 HP（用 `uihpSlider.value` vs `uihpSlider.max×valueHP/100`）；`battler.camp==source.camp` → 乘 `hpHitBonus`，`==target.camp` → 乘 `hpHitedBonus`。
  - `isTypeBonus(battler)`：`isTypeBonus` 状态，满足 `type == status.type` 且 `lastComboCount >= status.typeHits` 时，source 乘 `typeHitBonus`，target 乘 `typeHitedBonus`。
  - 调用：`conditionHP(source); conditionHP(target); isTypeBonus(source); isTypeBonus(target);`（其它系数块待实现）。
- `PADStatus.addEnemyStatus` / `addPlayerStatus`：加状态 + UI（`GUI_1005`）。
- **注意**：`Batter.status`（运行时状态数组）需手动通过 `addPlayerStatus`/`addEnemyStatus` 填充；`actor.status`（角色数据里的状态）不会自动同步到 `batter.status`。

## 8. HP 条件用「回合开始前」血量快照

- `Batter.turnStartHP`：本回合行动开始前的血量快照。
- `playerAction` 开头：`for (enemy) enemy.turnStartHP = enemy.hp; for (player) player.turnStartHP = player.hp;`
- `enemyAction` 开头：同样再记录一次。
- 状态 HP 条件判断用 `turnStartHP`（避免玩家 A/B/C 逐次扣血导致判断读到的 HP 递减失真）。

## 9. 飘字时序（避免数字重叠）

- `PADanim._showFloatingText(text, x, y, color, onFadeComplete?)`：通用飘字，淡出 800ms，完成后回调。
- `_showHealText` / `_showDamageText`：治疗绿色 `+N` / 伤害红色 `-N`，飘在目标上方（敌人用 avatar，玩家用 cardImage）。
- 全局飘字计数 `_activeFloatingCount` + `waitForFloatingDone(cb)`：`enemyAction` 开头等待玩家回合伤害数字淡出完再行动，避免敌人治疗/攻击数字与玩家伤害数字重叠。
- 玩家回合顺序：治疗数字（绿）→ 淡出 → 攻击动画 → 一次性结算伤害数字（红）。

## 10. 已知坑 / 注意事项

1. **tsconfig `target: ES5`、无 `downlevelIteration`**：**不能 `for...of` 遍历 Map**（TS2569 编译错误），用 `Map.forEach`。
2. **`startTriggerFragmentEvent(feData, trigger, execute, cb)`**：`trigger`/`execute` 必须传 `Game.player.sceneObject`，传 `null` 会崩在 `trigger.triggerLines`。
3. **GCAnimation 异步加载**：先 `once(EventObject.LOADED)` 再设 `ani.id`，加载完成后再 `addChild`/定位/读 `width`/`totalFrame`/`fps`；移动时长要在 LOADED 回调里算。
4. **敌人初始选技能**（`Batter.init` 里 `PADCondition.selectSkill(enemy, 0)`）要在敌人完全初始化（`push` 之后）调用；玩家未创建时 `PADCondition.player` 为 null。
5. **HP 条件满血触发**：`compareHP` 用 `>` 时 `valueHP` 不能设 100（100 不大于 100），`>=` 才行。
6. **Batter.status 需手动填充**（见第 7 节）。
7. **git push 需本地代理 `http://127.0.0.1:21882` 开启**，否则 push/pull 失败；本地 commit 不受影响。
8. **Batter.ts 有 5 个既有编译报错**：`PADPuzzle._isBusy` 私有字段被外部/静态访问 —— **用户明确「不要动」**。
9. `asset/`、`out/`、`备份/`、`*.rar`、`*.zip`、`node_modules/` 等不入库；未跟踪目录 `_odai_probe/`、`deepseek-plug/`、`docs/`、`工程示例/` 与项目无关，勿提交。

## 11. Git 状态（对话结束时）

- 最新备份提交：`2581d74`（`feat: 状态伤害计算封装到 PADStatus，状态字段拆分伤害/受伤害系数`），已 push 到 GitHub。
- 备份命令：`git add PAD/ && git commit -m "中文说明" && git push origin main`（只提交 `PAD/` 下内容，勿动未跟踪无关目录）。
- 刚完成 `isTypeBonus` 的 `typeHits` 连击数条件（**未提交**）。
- 待做：其它系数（连击 `isHitsBonus`、十字 `isCrossBonus`、行 `isRowBonus`、列 `isColBonus`、消除数量 `isNumBonus`）、玩家技能（`skillsPlayer`）、结算界面等。

## 12. 常用引擎 API 备忘

- `GameData.getModuleData(moduleID, dataID)`：取模块数据（元素=2，队伍=3，角色=4，技能=5）。
- `Game.player.data`：玩家数据；`Game.player.sceneObject`：玩家场景对象。
- `PADBattle.battleUI`：战斗界面（`PlayerHP` 血条、`PlayerHPimage` 血条图、`Enemy0-3`/`PlayerActor0-4` 等组件）。
- `CommandPage.startTriggerFragmentEvent` / `CommandPage.executeEvent` / `trigger.pause` / `trigger.offset(1)`：事件系统。
- `Tween.to(target, {props}, duration, ease, callback)`：补间动画。
- `Callback.New(fn, caller)`：引擎回调对象。
- `GameUI.load(1004)`：界面 1004（飘字字体模板 `text` 组件）。
