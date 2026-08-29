/**
 * Created by 六一 on 2026-08-13 00:00:00.
 * 行动管理类（单例风格，全部静态）
 * 负责管理玩家与敌人的行动流程。
 */
class PADAction {
    /**
     * 玩家行动：结算后依次执行玩家攻击与治疗
     * @param combos 本次连锁消除的 combo 结果数组（用于查找治疗元素）
     */
    static playerAction(combos: PADCombo[], onComplete?: Function): void {
        // 排除放错位置的敌人数据（isEnemy=true），只保留真正的玩家
        const players = Batter.players.filter((p) => {
            if (p.actor.isEnemy) {
                console.log(`[PADAction] 跳过非玩家数据：${p.actor.name}（isEnemy=true）`);
            }
            return true;
        });

        // 玩家攻击：每个玩家角色攻击完成后再攻击下一个，串行播放
        const atkPlayers = players.filter((p) => !!p.atkAniPRtext);

        // 无攻击准备的玩家直接重置标记
        for (const player of players) {
            if (!player.atkAniPRtext) player.isAllAtk = false;
        }

        // 治疗准备：先计算本次连锁 combo 数影响的治疗量并增加准备量（now=true 立即完成数字跳动）
        let healElementID = PADAction._findHealElementID(combos);
        if (healElementID >= 0) {
            // 对每个有治疗准备的玩家，计算 combo 数影响的治疗量并增加准备量
            for (const player of players) {
                if (!player.healAniPRtext) continue;
                const comboHeal = Math.floor((Number(player.healAniPRtext.text) || 0) * (PADPuzzle.lastResult.lastComboCount - 1) * Game.player.data.comboBonus);
                if (comboHeal > 0) {
                    PADanim.playerHealPR(player, comboHeal, healElementID, true);
                }
            }
        }

        // 是否存在需要执行的攻击 / 治疗
        const hasAttack = atkPlayers.length > 0;
        const hasHeal = players.some((p) => !!(p.healAniPR && p.healAniPRtext));

        // 攻击与治疗两条异步链都完成后，才解除输入锁（允许玩家再次操作）；
        // 无攻击 / 无治疗直接视为该阶段已完成
        let attackDone = !hasAttack;
        let healDone = !hasHeal;
        const tryFinish = (): void => {
            if (attackDone && healDone) {
                PADBattle.PADgame.setBusy(false);
                onComplete?.();
            }
        };

        // 开始治疗：合计治疗量，治疗动画飞向队伍血条并回血（完成后可选执行后续回调）
        const startHeal = (onDone?: () => void): void => {
            const finish = (): void => {
                healDone = true;
                if (onDone) onDone();
                else tryFinish();
            };
            if (!hasHeal) {
                finish();
                return;
            }
            PADanim.playerHeal(finish);
        };

        // 串行播放每个有攻击准备玩家的攻击准备动画（数字跳动），全部播放完进入实际攻击阶段
        const prepareAttack = (index: number): void => {
            // 终止条件：所有玩家的攻击准备动画均已播放完
            if (index >= atkPlayers.length) {
                // 重置伤害累计
                PADanim.resetDamageAccumulator();
                // 先治疗（治疗数字先显示），治疗数字淡出+回血完成后再攻击（伤害数字后显示）
                startHeal(() => {
                    PADAction._executeAttacks(atkPlayers, 0, () => {
                        // 显示每个敌人累计的总伤害数字
                        PADanim.flushDamageNumbers();
                        attackDone = true;
                        tryFinish();
                    });
                });
                return;
            }
            const player = atkPlayers[index];
            // 当前准备动画完成后的回调：重置标记，并处理下一个玩家
            const onDone = (): void => {
                prepareAttack(index + 1);
            };
            // 计算连锁 combo 加成
            let damage: number = Number(player.atkAniPRtext.text);
            const comboCount = PADPuzzle.lastResult.lastComboCount;
            const comboBonus = Game.player.data.comboBonus;
            const beforeCombo = damage;
            damage = Math.floor(damage * (comboCount - 1) * comboBonus);
            console.log(`[伤害计算] ${player.actor.name} combo连锁加成：攻击准备值=${beforeCombo}，combo数=${comboCount}，comboBonus=${comboBonus}，本次加成=${damage}，累加后=${beforeCombo + damage}`);
            // 如果需要逐个显示 combo 结算，true 改 false
            PADanim.playerAtkPR(player, damage, true, onDone);
        };

        // 无攻击：跳过攻击准备与 1 秒等待，直接完成攻击阶段并立即播放治疗
        if (!hasAttack) {
            startHeal();
            return;
        }

        // 等待 1 秒后开始攻击
        setTimeout(() => {
            prepareAttack(0);
        }, 1000);
    }

    /**
     * 串行执行每个玩家的实际攻击（单体或全体）
     */
    private static _executeAttacks(atkPlayers: Batter[], index: number, onAllDone?: Function): void {
        // 终止条件：所有玩家都已处理完毕（攻击完成的时间点）
        if (index >= atkPlayers.length) {
            onAllDone?.();
            return;
        }
        const player = atkPlayers[index];
        // 当前动画完成后的回调：重置标记，并处理下一个玩家
        const onComplete = (): void => {
            player.isAllAtk = false;
            PADAction._executeAttacks(atkPlayers, index + 1, onAllDone);
        };
        // 播放对应的攻击动画，并传入完成回调
        if (player.isAllAtk) {
            PADanim.playerAllAtk(player, onComplete);
        } else {
            PADanim.playerSingleAtk(player, onComplete);
        }
    }

    /**
     * 查找本次连锁中治疗元素的数据 ID（isHeal=true 的元素）
     */
    private static _findHealElementID(combos: PADCombo[]): number {
        let healElementID = -1;
        for (const combo of combos) {
            for (const id of PADElement.dataIDs) {
                if (GameData.getModuleData(PADElement.MODULE_ID, id).name === combo.type) {
                    healElementID = id;
                    break;
                }
            }
            if (healElementID >= 0 && GameData.getModuleData(PADElement.MODULE_ID, healElementID).isHeal) break;
        }
        return healElementID;
    }

    /**
     * 敌人行动：遍历存活敌人，倒计时减 1；倒计时归零的敌人使用当前技能攻击（串行）
     * @param combos 本次连锁消除的 combo 结果数组（暂未使用，保留扩展）
     * @param onComplete 全部敌人行动完成后的回调
     */
    static enemyAction(combos: PADCombo[], onComplete?: Function): void {
        // 只处理生命不为零和可以行动的敌人
        const aliveEnemies = Batter.enemys.filter((e) => {
            // 非敌人数据（放错位置）：在筛选阶段排除并提示，避免误触发行动
            if (!e.actor.isEnemy) {
                console.log(`[PADAction] 跳过非敌人数据：${e.actor.name}（isEnemy=false）`);
            }
            return e.uihpSlider && e.enemyCanAction && e.uihpSlider.value > 0;
        });
        const process = (index: number): void => {
            if (index >= aliveEnemies.length) {
                //行动后设置所有敌人不能行动
                for (const enemy of aliveEnemies) {
                    enemy.enemyCanAction = false; 
                    
                }                
                onComplete?.();
                return;
            }
            const enemy = aliveEnemies[index];
            const skills = enemy.actor.skills;
            // 无技能或无倒计时组件：直接处理下一个
            if (!skills || skills.length === 0 || !enemy.aiUseTimer) {
                process(index + 1);
                return;
            }
            // 1. 回合数 X 减 1
            const current = parseInt(enemy.aiUseTimer.text, 10) || 0;
            const next = current - 1;
            // 2. 回合数不等于 0：更新倒计时并直接处理下一个
            if (next > 0) {
                enemy.aiUseTimer.text = String(next) + "回合后行动";
                process(index + 1);
                return;
            }
            // 3. 回合数等于 0：用当前技能
            const usedIndex = enemy.skillIndex % skills.length;
            let skill = skills[usedIndex].skill;
            
            // 技能使用后：记录使用次数并选中下一个满足条件的技能
            const afterUse = (): void => {
                enemy.skillUsedCounts[usedIndex] = (enemy.skillUsedCounts[usedIndex] || 0) + 1;
                PADCondition.selectSkill(enemy, (enemy.skillIndex + 1) % skills.length, () => {
                    process(index + 1);
                });
            };

            // 4. 治疗技能 / 攻击技能分叉
            if (skill.isHeal) {
                // 治疗技能：回复生命值（不受玩家血量影响）
                PADanim.enemyHeal(enemy, skill, afterUse);
            } else if (Batter.players[0].hp > 0) {
                // 攻击技能：玩家生命大于零才攻击
                PADanim.enemyAttack(enemy, skill, afterUse);
            } else {
                process(index + 1);
            }

        };
        // 等待玩家回合的飘字（伤害数字）淡出后再处理敌人，避免敌人治疗/攻击数字与之重叠
        PADanim.waitForFloatingDone(() => process(0));
    }    
}
