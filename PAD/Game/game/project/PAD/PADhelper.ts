/**
 * Created by 六一 on 2026-08-09 20:36:07.
 * PAD辅助方法
 */
class PADhelper {
    /**
     * 根据等级获得数值
     * @param lv 角色现在的等级
     * @param property 需要计算的属性名字
     * @param actor 角色数据模块
     * @returns 计算后的整数值
     */
    static lvToValue(lv:number,property:string,actor:Module_Actor):number{
        //防止等级超过上限
        if(lv>actor.MaxLevel)lv=actor.MaxLevel;
        // 注意：Module_Actor 中最大属性名为 "Max" + 属性名（如 MaxHP），大小写敏感，不能写成 "MAX"+属性
        let maxproperty:string="Max"+property;
        return Math.floor(
            actor[property] +
            (actor[maxproperty] - actor[property]) /
            (actor.MaxLevel - 1) *
            (lv - 1)
        );        
    }

    /**
     * 计算攻击准备：遍历所有玩家角色，对角色数据 ElementType1 与本次消除 combo.type 相同的玩家，
     * 计算其攻击准备值（playerAtkPR 需要的 change 参数）
     * @param combo 本次消除的 combo（combo.type 属性类型，combo.indexes 元素索引数组）
     * @returns 每个匹配玩家对应的 { player, change } 数组
     */
    static calcAttackReady(combo: PADCombo): { player: Batter; change: number }[] {
        const result: { player: Batter; change: number }[] = [];
        for (const player of Batter.players) {
            // 角色属性与本次消除 combo 属性一致时，进入攻击准备
            if (GameData.getModuleData(2,player.actor.ElementType1).name !== combo.type) continue;
            // 攻击准备值 = ATK * (100% + (本次combo消除元素数 - 3) * 25%)
            let elementBonus=GameData.getModuleData(2,player.actor.ElementType1).elementBonus;
            const baseATK = PADhelper.lvToValue(player.level,"ATK",player.actor);
            const bonusRate = 1 + (combo.indexes.length - 3) * elementBonus;
            const change = Math.floor(baseATK * bonusRate);
            console.log(`[伤害计算] ${player.actor.name} 消除元素数加成：基础ATK=${baseATK}，消除元素数=${combo.indexes.length}，倍率=${bonusRate.toFixed(2)}，攻击准备值=${change}`);
            result.push({ player, change });
        }
        return result;
    }

    /**
     * 敌人受到的伤害扣除前的钩子
     * @param player 攻击方（玩家）战斗者实例
     * @param enemy 受击方（敌人）战斗者实例
     * @param damage 原始伤害（必须为正数）
     * @param type 伤害的类型ID
     * @returns 计算后的最终伤害（正数）
     */
    static damageToEnemy(player: Batter, enemy: Batter, damage: number,type:number): number {       
        console.log(`[伤害计算] ${player.actor.name} → ${enemy.actor.name}，基础伤害=${damage}`);
        // 计算状态对伤害的影响
        let finalDamage = PADStatus.calcStatusDamage(Batter.players[0], enemy, damage, type);
        //属性克制计算
        let enemyType=enemy.actor.ElementType1;
        let atkTpye=GameData.getModuleData(2,type) as Module_Element;
        if(atkTpye.restrain==enemyType){
            console.log(`[伤害计算] 属性克制：${atkTpye.name} 克制 ${(GameData.getModuleData(2,enemyType) as Module_Element).name}，伤害×2`);
            finalDamage*=2;
        }
        if(atkTpye.restrained==enemyType){
            console.log(`[伤害计算] 属性被克制：${atkTpye.name} 被 ${(GameData.getModuleData(2,enemyType) as Module_Element).name} 克制，伤害×0.5`);
            finalDamage*=0.5;
        }
        console.log(`[伤害计算] 最终伤害=${finalDamage}`);
        return finalDamage;
    }
    /**
     * 玩家受到的伤害扣除前的钩子
     * @param player 受到攻击方（玩家）战斗者实例
     * @param enemy 攻击方（敌人）战斗者实例
     * @param damage 原始伤害（必须为正数）
     * @param type 伤害的类型ID
     * @returns 计算后的最终伤害（正数）
     */
    static damageToPlayer(player: Batter, enemy: Batter, damage: number,type:number): number {  
        //玩家受到的伤害扣除前的钩子     
        let finalDamage = PADStatus.calcStatusDamage(enemy,Batter.players[0],  damage, type);
        console.log(`[伤害计算] ${enemy.actor.name} → ${player.actor.name}，基础伤害=${damage}，最终伤害=${damage}`);
        return finalDamage;
    }
    /**
     * 玩家治疗前的钩子
     * @param player 玩家战斗者实例
     * @param enemy 敌人战斗者实例
     * @param heal 治疗量（必须为正数）
     * @returns 计算后的最终治疗量（正数）
     */
    static healToPlayer(player: Batter,enemy: Batter, heal: number): number {       
        // 暂时为空方法，后期拓展（如护甲减免、属性克制、减伤buff等）
        console.log(`[治疗计算] 玩家治疗，基础治疗=${heal}，最终治疗=${heal}`);
        return heal;
    }
    /**
     * 敌人治疗前的钩子
     * @param source 治疗者（敌人）战斗者实例
     * @param target 被治疗的敌人战斗者实例
     * @param heal 治疗量（必须为正数）
     * @returns 计算后的最终治疗量（正数）
     */
    static healToEnemy(source: Batter, target: Batter, heal: number): number {       
        // 暂时为空方法，后期拓展（如治疗加成、减疗buff等）
        console.log(`[治疗计算] ${source.actor.name} → ${target.actor.name}，基础治疗=${heal}，最终治疗=${heal}`);
        return heal;
    }

    /**
     * 计算治疗准备：计算本次消除的治疗量（暂时为空方法，后期拓展）
     * @param player 被治疗的玩家战斗者实例
     * @param combo 本次消除的 combo（combo.type 属性类型，combo.indexes 元素索引数组）
     * @param healElementID 治疗元素在自定义模块中的数据ID（isHeal=true 的元素）
     * @returns 每个被治疗玩家对应的 { player, change } 数组（change 为治疗量，正数）
     */
    static calcHealReady(player: Batter, combo: PADCombo, healElementID: number): { player: Batter; change: number } {
        let change=0;
        let elementBonus=GameData.getModuleData(2,healElementID).elementBonus;
        // 治疗量 = 消除元素数 * 治疗元素属性值
        change=PADhelper.lvToValue(player.level,"Heal",player.actor)*(1+(combo.indexes.length-3)*elementBonus);
        change=Math.floor(change);
        return {player,change};
    }

    /**
     * 计算敌人攻击伤害
     * @param enemy 敌人战斗者实例
     * @param skill 使用的技能数据
     * @returns 伤害（正数）
     */
    static calcEnemyDamage(enemy: Batter, skill: Module_Skill):number{
        let damage:number=PADhelper.lvToValue(enemy.level, "ATK", enemy.actor) * skill.atkBonus;
        
        return Math.floor(damage)
    } 
    /**
     * 检测是否结束游戏
     * return true：结束游戏，false：继续游戏
     */
    static checkGameOver(){
        let allEnemyDead = true;
        for (const enemy of Batter.enemys) {
            if (enemy.hp > 0) {
                allEnemyDead  = false;
                break;
            }            
        }
        let allPlayerDead=true;
        if (Batter.players[0].hp>0)allPlayerDead= false;
        if (allEnemyDead || allPlayerDead) {
            
//关闭战斗，后续补结算界面
            if(allEnemyDead && !allPlayerDead){
                //战斗胜利
                PADBattle.win=true;
            }  
            if(!allEnemyDead && allPlayerDead){
                //战斗失败
                PADBattle.win=false;
            }                                
            Game.layer.uiLayer.removeChild(PADBattle.battleUI);
            PADBattle.battleUI.dispose(); 
            PADBattle.PADgame.dispose()       
            //继续事件触发器
            PADBattle.start()
            return true;
        }else{
            return false;
        }
    }       
}