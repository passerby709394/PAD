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
    static playerAction(combos: PADCombo[]): void {
        // 玩家攻击：每个玩家角色攻击完成后再攻击下一个，串行播放
        const atkPlayers = Batter.players.filter((p) => !!p.atkAniPRtext);

        // 无攻击准备的玩家直接重置标记
        for (const player of Batter.players) {
            if (!player.atkAniPRtext) player.isAllAtk = false;
        }

        // 串行播放每个有攻击准备玩家的攻击准备动画（数字跳动），全部播放完进入实际攻击阶段
        const prepareAttack = (index: number): void => {
            // 终止条件：所有玩家的攻击准备动画均已播放完
            if (index >= atkPlayers.length) {
                PADAction._executeAttacks(atkPlayers, 0);
                return;
            }
            const player = atkPlayers[index];
            // 当前准备动画完成后的回调：重置标记，并处理下一个玩家
            const onDone = (): void => {
                player.isAllAtk = false;
                prepareAttack(index + 1);
            };
            // 计算连锁 combo 加成
            let damage: number = Number(player.atkAniPRtext.text);
            damage = Math.floor(damage * (PADPuzzle.lastResult.lastComboCount - 1) * Game.player.data.comboBonus);
            // 如果需要逐个显示 combo 结算，true 改 false
            PADanim.playerAtkPR(player, damage, true, onDone);
        };

        // 等待 1 秒后开始攻击
        setTimeout(() => {
            prepareAttack(0);
        }, 1000);

        // 治疗玩家：先计算本次连锁 combo 数影响的治疗量并增加准备量，再执行治疗
        let healElementID = PADAction._findHealElementID(combos);
        if (healElementID >= 0) {
            // 对每个有治疗准备的玩家，计算 combo 数影响的治疗量并增加准备量（now=true 立即完成数字跳动）
            for (const player of Batter.players) {
                if (!player.healAniPRtext) continue;
                const comboHeal = Math.floor((Number(player.healAniPRtext.text) || 0) * (PADPuzzle.lastResult.lastComboCount - 1) * Game.player.data.comboBonus);
                if (comboHeal > 0) {
                    PADanim.playerHealPR(player, comboHeal, healElementID, true);
                }
            }
        }
        // 执行治疗（合计所有治疗准备量，治疗动画飞向队伍血条并回血）
        setTimeout(() => {
            PADanim.playerHeal();
        }, 2000);
    }

    /**
     * 串行执行每个玩家的实际攻击（单体或全体）
     */
    private static _executeAttacks(atkPlayers: Batter[], index: number): void {
// 终止条件：所有玩家都已处理完毕（攻击完成的时间点）
        if (index >= atkPlayers.length) {
            // 攻击完成后的逻辑
            PADBattle.next();
            return;
        }
        const player = atkPlayers[index];
        // 当前动画完成后的回调：重置标记，并处理下一个玩家
        const onComplete = (): void => {
            player.isAllAtk = false;
            PADAction._executeAttacks(atkPlayers, index + 1);
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
}
