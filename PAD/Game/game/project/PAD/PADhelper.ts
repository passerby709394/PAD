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
            const change = Math.floor(PADhelper.lvToValue(player.level,"ATK",player.actor) * (1 + (combo.indexes.length - 3) * elementBonus));
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
        let finalDamage=damage;
        let enemyType=enemy.actor.ElementType1;
        let atkTpye=GameData.getModuleData(2,type) as Module_Element;
        if(atkTpye.restrain==enemyType)finalDamage*=2;
        if(atkTpye.restrained==enemyType)finalDamage*=0.5;
        console.log("敌人受到的伤害扣除前的钩子：",finalDamage)
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
        // 暂时为空方法，后期拓展（如护甲减免、属性克制、减伤buff等）
        console.log("玩家受到的伤害扣除前的钩子：")
        return damage;
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
        console.log("玩家治疗前的钩子")
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
}