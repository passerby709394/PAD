var GameBattleAI = (function () {
    function GameBattleAI() {
    }
    GameBattleAI.init = function () {
    };
    GameBattleAI.start = function () {
    };
    GameBattleAI.stop = function () {
    };
    GameBattleAI.action = function (battler, onActionComplete) {
        this.currentBattler = battler;
        this.currentBattler.battleCommandType = null;
        this.isInAction = false;
        this.tryUseItem();
        this.tryUseSkill();
        this.tryAtk();
        GameBattleAction.doAction(battler, onActionComplete);
    };
    GameBattleAI.tryUseSkill = function () {
        if (this.isInAction)
            return;
        if (MathUtils.rand(100) < this.currentBattler.actor.tryUseSkillProbability) {
            var battler = this.currentBattler;
            var actor = battler.actor;
            if (!GameBattleHelper.canUseSkill(battler))
                return;
            var canUseSkills = [];
            for (var i = 0; i < actor.skills.length; i++) {
                var skill = actor.skills[i];
                if (!GameBattleHelper.canUseOneSkill(battler, skill, false))
                    continue;
                var isHostileSkill = GameBattleHelper.isHostileSkill(skill);
                var skillTarget = this.getSkillTarget(skill, isHostileSkill);
                if (!skillTarget)
                    continue;
                canUseSkills.push({ skill: skill, target: skillTarget });
            }
            if (canUseSkills.length > 0) {
                var canUseSkill = canUseSkills[MathUtils.rand(canUseSkills.length)];
                this.doUseSkill(canUseSkill.skill, canUseSkill.target);
            }
        }
    };
    GameBattleAI.tryUseItem = function () {
        if (this.isInAction)
            return;
        if (MathUtils.rand(100) < this.currentBattler.actor.tryUseItemProbability) {
            var packageItems = this.packageItems;
            var myPartyBattlers = this.currentBattler.isEnemy ? GameBattle.enemyBattlers : GameBattle.playerBattlers;
            for (var i = 0; i < packageItems.length; i++) {
                var item = packageItems[i];
                if (!GameBattleHelper.canUseOneItem(this.currentBattler, item))
                    continue;
                if (item.releaseSkill)
                    continue;
                for (var p = 0; p < myPartyBattlers.length; p++) {
                    var myPartyBattler = myPartyBattlers[p];
                    if (!myPartyBattler)
                        continue;
                    var myPartyActor = myPartyBattler.actor;
                    if (GameBattleHelper.isCanHitByItem(myPartyBattler, item) != 0)
                        continue;
                    for (var s = 0; s < item.addStatus.length; s++) {
                        var addStatus = item.addStatus[s];
                        if (GameBattleHelper.canSuperpositionLayer(myPartyBattler, addStatus)) {
                            this.doUseItem(item, myPartyBattler);
                            return;
                        }
                    }
                    for (var s = 0; s < item.removeStatus.length; s++) {
                        var removeStatus = item.removeStatus[s];
                        if (GameBattleHelper.isIncludeStatus(myPartyBattler, removeStatus)) {
                            this.doUseItem(item, myPartyBattler);
                            return;
                        }
                    }
                    if ((item.recoveryHP > 0 && (myPartyActor.MaxHP - myPartyActor.hp >= item.recoveryHP || myPartyActor.hp / myPartyActor.MaxHP < 0.5)) ||
                        (item.recoverySP > 0 && (myPartyActor.MaxSP - myPartyActor.sp >= item.recoverySP || myPartyActor.sp / myPartyActor.MaxSP < 0.5))) {
                        this.doUseItem(item, myPartyBattler);
                        return;
                    }
                }
            }
        }
    };
    GameBattleAI.tryAtk = function () {
        if (this.isInAction)
            return;
        var battler = this.currentBattler;
        var actor = battler.actor;
        var targetPartyBattlers = battler.isEnemy ? GameBattle.playerBattlers : GameBattle.enemyBattlers;
        targetPartyBattlers = targetPartyBattlers.concat();
        for (var i = 0; i < targetPartyBattlers.length; i++) {
            if (!targetPartyBattlers[i]) {
                targetPartyBattlers.splice(i, 1);
                i--;
                break;
            }
        }
        if (battler.battleCommandType == null) {
            if (battler.actor.atkMode == 0) {
                this.doUseAttack(targetPartyBattlers[MathUtils.rand(targetPartyBattlers.length)]);
            }
            else {
                if (!GameBattleHelper.canUseSkill(battler))
                    return;
                var skill = actor.atkSkill;
                if (!skill || !GameBattleHelper.canUseOneSkill(battler, skill, false))
                    return;
                var skillTarget = targetPartyBattlers[MathUtils.rand(targetPartyBattlers.length)];
                if (!skillTarget)
                    return;
                this.doUseSkill(skill, skillTarget);
            }
        }
    };
    GameBattleAI.doUseAttack = function (target) {
        this.isInAction = true;
        this.currentBattler.battleCommandType = 0;
        this.currentBattler.battleCommandApplyTarget = target;
    };
    GameBattleAI.doUseSkill = function (skill, skillTarget) {
        this.isInAction = true;
        this.currentBattler.battleCommandUseSkill = skill;
        this.currentBattler.battleCommandType = 1;
        this.currentBattler.battleCommandApplyTarget = skillTarget;
    };
    GameBattleAI.doUseItem = function (item, target) {
        this.isInAction = true;
        this.currentBattler.battleCommandUseItem = item;
        this.currentBattler.battleCommandType = 2;
        this.currentBattler.battleCommandApplyTarget = target;
    };
    GameBattleAI.getSkillTarget = function (skill, isHostileSkill) {
        var realTarget;
        var currentBattlerActor = this.currentBattler.actor;
        var targetArr = [];
        if (isHostileSkill) {
            targetArr = this.currentBattler.isEnemy ? GameBattle.playerBattlers.concat() : GameBattle.enemyBattlers.concat();
        }
        else if (skill.targetType == 0) {
            targetArr = [this.currentBattler];
        }
        else {
            targetArr = this.currentBattler.isEnemy ? GameBattle.enemyBattlers.concat() : GameBattle.playerBattlers.concat();
        }
        for (var i = 0; i < targetArr.length; i++) {
            var target = targetArr[i];
            if (!target || GameBattleHelper.isCanHitBySkill(this.currentBattler, target, skill) != 0) {
                targetArr.splice(i, 1);
                i--;
                continue;
            }
        }
        if (targetArr.length == 0)
            return;
        if (!skill.useDamage) {
            for (var s = 0; s < skill.addStatus.length; s++) {
                var st = skill.addStatus[s];
                for (var i = 0; i < targetArr.length; i++) {
                    realTarget = targetArr[i];
                    if (GameBattleHelper.canSuperpositionLayer(realTarget, st)) {
                        return realTarget;
                    }
                }
            }
            if (skill.addStatus.length > 0) {
                return null;
            }
            for (var s = 0; s < skill.removeStatus.length; s++) {
                var st = skill.removeStatus[s];
                for (var i = 0; i < targetArr.length; i++) {
                    realTarget = targetArr[i];
                    if (GameBattleHelper.isIncludeStatus(realTarget, st)) {
                        return realTarget;
                    }
                }
            }
            if (skill.removeStatus.length > 0) {
                return null;
            }
        }
        if (!isHostileSkill && skill.useDamage) {
            var skillDamage = skill.damageValue;
            if (skill.useAddition) {
                var actorAttributeValue = skill.additionMultipleType == 0 ? currentBattlerActor.ATK : currentBattlerActor.MAG;
                var addDamageValue = skill.additionMultiple / 100 * actorAttributeValue;
                skillDamage += addDamageValue;
            }
            if (skill.damageType == 3) {
                for (var i = 0; i < targetArr.length; i++) {
                    realTarget = targetArr[i];
                    var targetActor = realTarget.actor;
                    if (targetActor.MaxHP - targetActor.hp >= skillDamage || targetActor.hp / targetActor.MaxHP < 0.5) {
                        return realTarget;
                    }
                }
                return null;
            }
            else if (skill.damageType == 4) {
                for (var i = 0; i < targetArr.length; i++) {
                    realTarget = targetArr[i];
                    var targetActor = realTarget.actor;
                    if (targetActor.MaxSP - targetActor.sp >= skillDamage || targetActor.sp / targetActor.MaxSP < 0.5) {
                        return realTarget;
                    }
                }
                return null;
            }
            else {
                return targetArr[0];
            }
        }
        if (isHostileSkill) {
            return targetArr[MathUtils.rand(targetArr.length)];
        }
        else {
            return this.currentBattler;
        }
    };
    Object.defineProperty(GameBattleAI, "packageItems", {
        get: function () {
            var items = [];
            if (this.currentBattler.isEnemy) {
                for (var i = 0; i < GameBattleData.enemyPackageItems.length; i++) {
                    items.push(GameBattleData.enemyPackageItems[i].item);
                }
            }
            else {
                for (var i = 0; i < Game.player.data.package.length; i++) {
                    var itemDS = Game.player.data.package[i];
                    if (itemDS.isEquip)
                        continue;
                    items.push(itemDS.item);
                }
            }
            return items;
        },
        enumerable: false,
        configurable: true
    });
    return GameBattleAI;
}());
//# sourceMappingURL=GameBattleAI.js.map