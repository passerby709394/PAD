/**
 * 敌人技能激活条件上下文
 *片段执行完毕后，战斗逻辑读取判断结果决定是否激活该技能。
 * 执行片段前先 reset() 重置判断结果，并写入本次执行上下文；片段内的自定义指令负责改写判断结果；
 * enemy:本次行动的敌人战斗者 player:玩家队伍代表战斗者 canUse:是否激活技能
 * 默认激活技能
 */
class PADCondition {
    /** 本次行动的敌人战斗者（Batter） */
    static enemy: Batter = null;
    /** 队伍代表战斗者（队伍共享一条血条，即 players[0]） */
    static player: Batter = null;
    /** 当前待判断的技能数据（Module_Skill） */
    static skill: Module_Skill = null;

    /** 判断结果：是否激活技能。片段内自定义指令改写它；执行前由 reset() 重置为 false（激活） */
    static canUse: boolean = true;

    /** 敌人当前生命值 */
    static enemyHP: number = 0;
    /** 敌人最大生命值（当前等级血条上限） */
    static enemyMaxHP: number = 0;
    /** 玩家当前生命值（队伍共享血条） */
    static playerHP: number = 0;
    /** 玩家最大生命值（队伍血条上限） */
    static playerMaxHP: number = 0;
    /** 当前回合数（从第 1 回合起） */
    static turn: number = 0;

    /** 重置本次条件判断：清空上下文与快照，判断结果恢复默认（激活）。必须在 startTriggerFragmentEvent 之前调用 */
    static reset(): void {
        PADCondition.enemy = null;
        PADCondition.player = null;
        PADCondition.skill = null;
        PADCondition.canUse = true;
        PADCondition.enemyHP = 0;
        PADCondition.enemyMaxHP = 0;
        PADCondition.playerHP = 0;
        PADCondition.playerMaxHP = 0;
        PADCondition.turn = 0;
    }

    /**
     * 选中敌人下一个满足条件的技能（异步：条件为片段事件）。
     * 从 startIndex 开始循环查找第一个满足条件（或 condition 为空）的技能，设置 enemy.skillIndex 与倒计时文本；
     * 若所有技能条件都不满足，打印提示后兜底选中起始技能 startIndex。
     * @param enemy 目标敌人
     * @param startIndex 查找起始索引（0 ~ skills.length-1）
     * @param onDone 选中完成后的回调（可选）
     */
    static selectSkill(enemy: Batter, startIndex: number, onDone?: Function): void {
        const skills = enemy.actor.skills;
        if (!skills || skills.length === 0) {
            onDone?.();
            return;
        }
        const n = skills.length;
        // 应用选中结果：记录技能索引并更新倒计时文本
        const apply = (index: number): void => {
            enemy.skillIndex = index;
            enemy.aiUseTimer.text = String(skills[index].skill.totalCD) + "回合后行动";
        };
        // 当前技能不满足（条件不满足或使用次数用尽）：尝试下一个，全部不满足则兜底选中起始技能
        const reject = (offset: number): void => {
            if (offset + 1 >= n) {
                console.log(`[PADCondition] 敌人「${enemy.actor.name}」所有技能条件均不满足或使用次数用尽，兜底选择技能索引 ${startIndex}`);
                apply(startIndex);
                onDone?.();
            } else {
                tryIndex(offset + 1);
            }
        };
        // 从 startIndex 开始逐个尝试，offset 为相对偏移量
        const tryIndex = (offset: number): void => {
            const i = (startIndex + offset) % n;
            const entry = skills[i];
            // 使用次数限制：skillTimes > 0 且已用满 → 视为不满足
            const used = enemy.skillUsedCounts[i] || 0;
            if (entry.skillTimes > 0 && used >= entry.skillTimes) {
                reject(offset);
                return;
            }
            // 空 condition = 无条件 = 直接满足
            if (!entry.condition) {
                apply(i);
                onDone?.();
                return;
            }
            // 有条件：重置上下文并执行片段事件，片段内自定义指令改写 canUse（true=满足）
            PADCondition.reset();
            PADCondition.enemy = enemy;
            PADCondition.player = Batter.players.length > 0 ? Batter.players[0] : null;
            PADCondition.skill = entry.skill;
            // 记录生命值与回合数快照，供片段事件读取
            PADCondition.enemyHP = enemy.uihpSlider ? enemy.uihpSlider.value : 0;
            PADCondition.enemyMaxHP = enemy.uihpSlider ? enemy.uihpSlider.max : 0;
            PADCondition.playerHP = PADCondition.player && PADCondition.player.uihpSlider ? PADCondition.player.uihpSlider.value : 0;
            PADCondition.playerMaxHP = PADCondition.player && PADCondition.player.uihpSlider ? PADCondition.player.uihpSlider.max : 0;
            PADCondition.turn = PADBattle.battleRound;
            CommandPage.startTriggerFragmentEvent(entry.condition, Game.player.sceneObject, Game.player.sceneObject, Callback.New(() => {
                if (PADCondition.canUse) {
                    apply(i);
                    onDone?.();
                } else {
                    reject(offset);
                }
            }, null));
        };
        tryIndex(0);
    }
}