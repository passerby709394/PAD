var GameBattleHelper = (function () {
    function GameBattleHelper() {
    }
    GameBattleHelper.getLevelByActor = function (actor) {
        var playerActorDS = ArrayUtils.matchAttributes(Game.player.data.party, { actor: actor }, true)[0];
        if (playerActorDS) {
            return playerActorDS.lv;
        }
        else {
            var allBattlers = this.allBattlers;
            var battler = ArrayUtils.matchAttributes(allBattlers, { actor: actor }, true)[0];
            if (battler)
                return battler.level;
        }
        return 1;
    };
    Object.defineProperty(GameBattleHelper, "allBattlers", {
        get: function () {
            var battlers = GameBattle.playerBattlers.concat(GameBattle.enemyBattlers);
            return this.getNotNullBattlers(battlers);
        },
        enumerable: false,
        configurable: true
    });
    GameBattleHelper.getTeamBattlers = function (battler, includeSelf) {
        var p;
        if (battler.isEnemy)
            p = GameBattle.enemyBattlers;
        else
            p = GameBattle.playerBattlers;
        if (!includeSelf) {
            p = p.concat();
            ArrayUtils.remove(p, battler);
        }
        return this.getNotNullBattlers(p);
    };
    GameBattleHelper.getHostileBattlers = function (battler) {
        var p;
        if (!battler.isEnemy)
            p = GameBattle.enemyBattlers;
        else
            p = GameBattle.playerBattlers;
        return this.getNotNullBattlers(p);
    };
    GameBattleHelper.getBattlerByActor = function (actor) {
        if (!GameBattleHelper.isInBattle)
            return null;
        var allBattlers = this.allBattlers;
        return ArrayUtils.matchAttributes(allBattlers, { actor: actor }, true)[0];
    };
    GameBattleHelper.getNotNullBattlers = function (battlers) {
        var notNullBattlers = [];
        for (var i = 0; i < battlers.length; i++) {
            var battler = battlers[i];
            if (battler) {
                notNullBattlers.push(battler);
            }
        }
        return notNullBattlers;
    };
    GameBattleHelper.getCanSelectBattlers = function (battlers) {
        var canSelectBattlers = [];
        for (var i = 0; i < battlers.length; i++) {
            var battler = battlers[i];
            if (battler && this.canSelectedTarget(battler)) {
                canSelectBattlers.push(battler);
            }
        }
        return canSelectBattlers;
    };
    GameBattleHelper.getAttackTarget = function (thisBattler) {
        if (!thisBattler.battleCommandApplyTarget) {
            return null;
        }
        var canAttack = this.isCanHitByAttack(thisBattler, thisBattler.battleCommandApplyTarget);
        if (canAttack)
            return thisBattler.battleCommandApplyTarget;
        var targetPartyBattlers = thisBattler.battleCommandApplyTarget.isEnemy ? GameBattle.enemyBattlers : GameBattle.playerBattlers;
        targetPartyBattlers = this.getNotNullBattlers(targetPartyBattlers);
        var canHitTargets = [];
        for (var i = 0; i < targetPartyBattlers.length; i++) {
            var nextTargetBattler = targetPartyBattlers[i];
            if (nextTargetBattler == thisBattler)
                continue;
            if (this.isCanHitByAttack(thisBattler, nextTargetBattler)) {
                canHitTargets.push(nextTargetBattler);
            }
        }
        if (canHitTargets.length == 0)
            return null;
        else
            return canHitTargets[MathUtils.rand(canHitTargets.length)];
    };
    GameBattleHelper.getSkillTargets = function (thisBattler, useSkill, ifNoTargetGetOtherTarget) {
        if (useSkill.targetType == 0) {
            return [thisBattler];
        }
        else if (useSkill.targetType == 1 || useSkill.targetType == 2) {
            var canSkillState = this.isCanHitBySkill(thisBattler, thisBattler.battleCommandApplyTarget, useSkill);
            if (canSkillState == 0)
                return [thisBattler.battleCommandApplyTarget];
            else if (canSkillState == 2 || !ifNoTargetGetOtherTarget)
                return null;
            var targetPartyBattlers = void 0;
            if (useSkill.targetType == 1)
                targetPartyBattlers = thisBattler.isEnemy ? GameBattle.enemyBattlers : GameBattle.playerBattlers;
            else
                targetPartyBattlers = thisBattler.isEnemy ? GameBattle.playerBattlers : GameBattle.enemyBattlers;
            targetPartyBattlers = this.getNotNullBattlers(targetPartyBattlers);
            targetPartyBattlers.sort(function (a, b) {
                return a.actor.ActionSpeed > b.actor.ActionSpeed ? -1 : 1;
            });
            for (var i = 0; i < targetPartyBattlers.length; i++) {
                var nextTargetBattler = targetPartyBattlers[i];
                if (this.isCanHitBySkill(thisBattler, nextTargetBattler, useSkill) == 0) {
                    return [nextTargetBattler];
                }
            }
            return null;
        }
        else if (useSkill.targetType == 3 || useSkill.targetType == 4) {
            var targetPartyBattlers = void 0;
            if (useSkill.targetType == 3)
                targetPartyBattlers = thisBattler.isEnemy ? GameBattle.enemyBattlers : GameBattle.playerBattlers;
            else
                targetPartyBattlers = thisBattler.isEnemy ? GameBattle.playerBattlers : GameBattle.enemyBattlers;
            targetPartyBattlers = this.getNotNullBattlers(targetPartyBattlers);
            var canHitTargets = [];
            for (var i = 0; i < targetPartyBattlers.length; i++) {
                var nextTargetBattler = targetPartyBattlers[i];
                if (this.isCanHitBySkill(thisBattler, nextTargetBattler, useSkill) == 0) {
                    canHitTargets.push(nextTargetBattler);
                }
            }
            return canHitTargets;
        }
        else if (useSkill.targetType == 5 || useSkill.targetType == 6) {
            var canHitTargets = [];
            var targetNum = useSkill.targetNum;
            var canSkillState = this.isCanHitBySkill(thisBattler, thisBattler.battleCommandApplyTarget, useSkill);
            if (canSkillState == 0) {
                canHitTargets.push(thisBattler.battleCommandApplyTarget);
            }
            else if (canSkillState == 2 || !ifNoTargetGetOtherTarget)
                targetNum--;
            if (canHitTargets.length == targetNum)
                return canHitTargets;
            var targetPartyBattlers = void 0;
            if (useSkill.targetType == 5)
                targetPartyBattlers = thisBattler.isEnemy ? GameBattle.enemyBattlers : GameBattle.playerBattlers;
            else
                targetPartyBattlers = thisBattler.isEnemy ? GameBattle.playerBattlers : GameBattle.enemyBattlers;
            targetPartyBattlers = this.getNotNullBattlers(targetPartyBattlers);
            targetPartyBattlers.sort(function (a, b) {
                return a.actor.ActionSpeed > b.actor.ActionSpeed ? -1 : 1;
            });
            for (var i = 0; i < targetPartyBattlers.length; i++) {
                var nextTargetBattler = targetPartyBattlers[i];
                if (nextTargetBattler == thisBattler.battleCommandApplyTarget)
                    continue;
                if (canHitTargets.length == targetNum)
                    break;
                var canSkillState_1 = this.isCanHitBySkill(thisBattler, nextTargetBattler, useSkill);
                if (canSkillState_1 == 0) {
                    canHitTargets.push(nextTargetBattler);
                }
                else if (canSkillState_1 == 2 || !ifNoTargetGetOtherTarget) {
                    targetNum--;
                }
            }
            return canHitTargets;
        }
    };
    GameBattleHelper.getItemTarget = function (thisBattler, useItem) {
        var canUseItemState = this.isCanHitByItem(thisBattler.battleCommandApplyTarget, useItem);
        if (canUseItemState == 0)
            return thisBattler.battleCommandApplyTarget;
        else if (canUseItemState == 2)
            return null;
        var targetPartyBattlers = thisBattler.isEnemy ? GameBattle.enemyBattlers : GameBattle.playerBattlers;
        targetPartyBattlers = this.getNotNullBattlers(targetPartyBattlers);
        targetPartyBattlers.sort(function (a, b) {
            return a.actor.ActionSpeed > b.actor.ActionSpeed ? -1 : 1;
        });
        for (var i = 0; i < targetPartyBattlers.length; i++) {
            var nextTargetBattler = targetPartyBattlers[i];
            var canUseItemState_1 = this.isCanHitByItem(nextTargetBattler, useItem);
            if (canUseItemState_1 == 0) {
                return nextTargetBattler;
            }
            else if (canUseItemState_1 == 2) {
                return null;
            }
        }
    };
    Object.defineProperty(GameBattleHelper, "isInBattle", {
        get: function () {
            return GameBattle.state != 0;
        },
        enumerable: false,
        configurable: true
    });
    GameBattleHelper.isInPlayerParty = function (battler) {
        return ProjectPlayer.getPlayerActorIndexByActor(battler.actor) >= 0;
    };
    GameBattleHelper.isFriendlyRelationship = function (battler1, battler2) {
        return battler1.isEnemy == battler2.isEnemy;
    };
    GameBattleHelper.isHostileRelationship = function (battler1, battler2) {
        return battler1.isEnemy != battler2.isEnemy;
    };
    Object.defineProperty(GameBattleHelper, "isOpendBattleMenu", {
        get: function () {
            var battlerMenu = GameUI.get(14);
            if (battlerMenu && battlerMenu.stage) {
                return true;
            }
            var commonMenu = GameUI.get(15);
            if (commonMenu && commonMenu.stage) {
                return true;
            }
            return false;
        },
        enumerable: false,
        configurable: true
    });
    GameBattleHelper.isCanHitByAttack = function (fromBattler, targetBattler) {
        if (!targetBattler || targetBattler.isDead || (!this.hasSeeInvisible(fromBattler) && this.hasInvisible(targetBattler)))
            return false;
        return true;
    };
    GameBattleHelper.isCanHitBySkill = function (fromBattler, targetBattler, fromSkill) {
        if (this.isHostileRelationship(fromBattler, targetBattler) && !this.hasSeeInvisible(fromBattler) && this.hasInvisible(targetBattler)) {
            return 1;
        }
        if (targetBattler.isDead) {
            if (this.isResurrectionSkill(fromSkill))
                return 0;
            return 1;
        }
        else if (this.isResurrectionSkill(fromSkill)) {
            return 2;
        }
        return 0;
    };
    GameBattleHelper.isCanHitByItem = function (targetBattler, fromItem) {
        if (targetBattler.isDead) {
            if (fromItem.applyDeadBattler)
                return 0;
            return 1;
        }
        else if (fromItem.applyDeadBattler) {
            return 2;
        }
        return 0;
    };
    GameBattleHelper.isMeleeAction = function (battler, actionType, skill) {
        return actionType == 0 || (skill && skill == battler.actor.atkSkill && GameBattleHelper.isMeleeSkill(skill));
    };
    GameBattleHelper.canSelectedTarget = function (targetBattler) {
        if (!targetBattler.isEnemy)
            return true;
        var allowSelectDeadBattler = GameBattle.setting.removeDeadBattler || (!GameBattle.setting.removeDeadBattler && GameBattle.setting.allowSelectDeadEnemy);
        if (allowSelectDeadBattler)
            return true;
        return !targetBattler.isDead;
    };
    GameBattleHelper.isHostileSkill = function (skill) {
        return skill.skillType <= 1 && (skill.targetType == 2 || skill.targetType == 4 || skill.targetType == 6);
    };
    GameBattleHelper.isFriendlySkill = function (skill) {
        return skill.skillType <= 1 && !this.isHostileSkill(skill);
    };
    GameBattleHelper.isMeleeSkill = function (skill) {
        return (skill.isMelee && skill.skillType == 0 && (skill.targetType == 2 || skill.targetType == 4 || skill.targetType == 6));
    };
    GameBattleHelper.canMultipleHitSkill = function (skill) {
        return (skill.targetType != 0 && skill.skillType == 0 && !skill.isMelee) || (skill.targetType == 1 || skill.targetType == 2);
    };
    GameBattleHelper.isTargetEnemySkill = function (skill) {
        return skill.targetType == 2 || skill.targetType == 4 || skill.targetType == 6;
    };
    GameBattleHelper.isResurrectionSkill = function (skill) {
        return !GameBattleHelper.isTargetEnemySkill(skill) && skill.applyDeadBattler;
    };
    GameBattleHelper.isPhysicalAttack = function (actionType, skill) {
        if (skill === void 0) { skill = null; }
        return actionType == 0 || (actionType == 1 && skill && skill.useDamage && skill.damageType == 0);
    };
    GameBattleHelper.getBattlerStatus = function (battler, statusID) {
        return ArrayUtils.matchAttributes(battler.actor.status, { id: statusID }, true)[0];
    };
    GameBattleHelper.isIncludeStatus = function (battler, statusID) {
        return ArrayUtils.matchAttributes(battler.actor.status, { id: statusID }, true).length == 1;
    };
    GameBattleHelper.canSuperpositionLayer = function (battler, statusID) {
        var status = ArrayUtils.matchAttributes(battler.actor.status, { id: statusID }, true)[0];
        if (status && status.currentLayer >= status.maxlayer)
            return false;
        return true;
    };
    GameBattleHelper.getForceActionType = function (battler) {
        var status = ArrayUtils.matchAttributes(battler.actor.status, { forceAction: 1 }, true)[0];
        if (status)
            return 1;
        status = ArrayUtils.matchAttributes(battler.actor.status, { forceAction: 2 }, true)[0];
        if (status)
            return 2;
        return 0;
    };
    GameBattleHelper.canAction = function (battler) {
        return this.getForceActionType(battler) == 0 && (this.canAttack(battler) || this.canUseSkill(battler) || this.canUseItem(battler) || this.canUseDefense(battler));
    };
    GameBattleHelper.canAttack = function (battler, force) {
        if (force === void 0) { force = false; }
        if (battler.isDead)
            return false;
        var actor = battler.actor;
        if (!force && (actor.atkMode == 1 && (!actor.atkSkill || actor.atkSkill.currentCD != 0 || actor.atkSkill.costSP > battler.actor.sp || actor.atkSkill.costHP >= battler.actor.hp)))
            return false;
        return ArrayUtils.matchAttributes(battler.actor.status, { cantAtk: true }, true).length == 0;
    };
    GameBattleHelper.canUseSkill = function (battler) {
        if (battler.isDead)
            return false;
        if (ArrayUtils.matchAttributes(battler.actor.status, { cantUseSkill: true }, true).length == 1)
            return false;
        return true;
    };
    GameBattleHelper.canUseOneSkill = function (battler, skill, checkUseSkillCommconCondition, calcSkillCost) {
        if (checkUseSkillCommconCondition === void 0) { checkUseSkillCommconCondition = true; }
        if (calcSkillCost === void 0) { calcSkillCost = true; }
        if (checkUseSkillCommconCondition && !this.canUseSkill(battler))
            return false;
        if (skill.skillType == 2)
            return false;
        return !(skill.currentCD != 0 || skill.costSP > battler.actor.sp || skill.costHP >= battler.actor.hp);
    };
    GameBattleHelper.canUseItem = function (battler) {
        if (battler.isDead)
            return false;
        if (ArrayUtils.matchAttributes(battler.actor.status, { cantUseItem: true }, true).length == 1)
            return false;
        return true;
    };
    GameBattleHelper.canUseOneItem = function (battler, item, checkUseItemCommconCondition) {
        if (checkUseItemCommconCondition === void 0) { checkUseItemCommconCondition = true; }
        if (!item.isUse || item.useType == 1)
            return false;
        if (checkUseItemCommconCondition && !this.canUseItem(battler))
            return false;
        if (battler.isDead)
            return false;
        return true;
    };
    GameBattleHelper.canUseDefense = function (battler) {
        if (battler.isDead)
            return false;
        if (ArrayUtils.matchAttributes(battler.actor.status, { cantUseDefense: true }, true).length == 1)
            return false;
        return true;
    };
    GameBattleHelper.getCounterattackDamagePer = function (fromBattler, targetBattler) {
        if (this.getSpecialBattleEffects(fromBattler, 1).length > 0) {
            return null;
        }
        if (!this.canAttack(targetBattler, true))
            return null;
        var specialBattleEffects = this.getSpecialBattleEffects(targetBattler, 0);
        if (specialBattleEffects.length == 0)
            return null;
        specialBattleEffects.sort(function (a, b) { return a.counterattackDmagePer > b.counterattackDmagePer ? -1 : 1; });
        for (var i = 0; i < specialBattleEffects.length; i++) {
            if (MathUtils.rand(100) < specialBattleEffects[i].counterattackPer) {
                return specialBattleEffects[i].counterattackDmagePer;
            }
        }
        return null;
    };
    GameBattleHelper.getReturnAttackDamagePer = function (fromBattler, targetBattler) {
        if (this.getSpecialBattleEffects(fromBattler, 3).length > 0) {
            return null;
        }
        var specialBattleEffects = this.getSpecialBattleEffects(targetBattler, 2);
        if (specialBattleEffects.length == 0) {
            return null;
        }
        specialBattleEffects.sort(function (a, b) { return a.returnDamagePer > b.returnDamagePer ? -1 : 1; });
        for (var i = 0; i < specialBattleEffects.length; i++) {
            if (MathUtils.rand(100) < specialBattleEffects[i].returnPer) {
                return specialBattleEffects[i].returnDamagePer;
            }
        }
        return null;
    };
    GameBattleHelper.getSuckPer = function (fromBattler, damageType, isHP, isMelee) {
        var type = isHP ? 4 : 5;
        var specialBattleEffects = this.getSpecialBattleEffects(fromBattler, type);
        for (var i = 0; i < specialBattleEffects.length; i++) {
            var specialBattleEffect = specialBattleEffects[i];
            if ((specialBattleEffect.suckCondition <= 2 && damageType != specialBattleEffect.suckCondition) ||
                (specialBattleEffect.suckCondition == 3 && !isMelee)) {
                specialBattleEffects.splice(i, 1);
                i--;
            }
        }
        if (specialBattleEffects.length == 0)
            return null;
        var suckPer = 0;
        for (var i_1 = 0; i_1 < specialBattleEffects.length; i_1++) {
            suckPer += specialBattleEffects[i_1].suckPer;
        }
        return suckPer;
    };
    GameBattleHelper.getNormalAttackTimes = function (fromBattler) {
        var specialBattleEffects = this.getSpecialBattleEffects(fromBattler, 6);
        for (var i = 0; i < specialBattleEffects.length; i++) {
            if (MathUtils.rand(100) < specialBattleEffects[i].attackTimesPer) {
                return 2;
            }
        }
        return 1;
    };
    GameBattleHelper.hasInvisible = function (fromBattler) {
        var specialBattleEffects = this.getSpecialBattleEffects(fromBattler, 7);
        return specialBattleEffects.length != 0;
    };
    GameBattleHelper.hasSeeInvisible = function (fromBattler) {
        var specialBattleEffects = this.getSpecialBattleEffects(fromBattler, 8);
        return specialBattleEffects.length != 0;
    };
    GameBattleHelper.getDamagePer = function (fromBattler) {
        var specialBattleEffects = this.getSpecialBattleEffects(fromBattler, 9);
        var damagePer = 100;
        for (var i = 0; i < specialBattleEffects.length; i++) {
            damagePer *= specialBattleEffects[i].damagePer * 0.01;
        }
        return damagePer;
    };
    GameBattleHelper.getStrikePer = function (fromBattler) {
        var specialBattleEffects = this.getSpecialBattleEffects(fromBattler, 10);
        var strikePer = 100;
        for (var i = 0; i < specialBattleEffects.length; i++) {
            strikePer *= specialBattleEffects[i].strikePer * 0.01;
        }
        return strikePer;
    };
    GameBattleHelper.getResurrectionHealthPer = function (fromBattler) {
        var specialBattleEffects = this.getSpecialBattleEffects(fromBattler, 11);
        for (var i = 0; i < specialBattleEffects.length; i++) {
            if (MathUtils.rand(100) < specialBattleEffects[i].resurrectionPer) {
                return specialBattleEffects[i].healthPer;
            }
        }
        return null;
    };
    GameBattleHelper.getElementEffectivenessPer = function (fromBattler, elementType) {
        var specialBattleEffects = this.getSpecialBattleEffects(fromBattler, 12);
        var v = 100;
        for (var i = 0; i < specialBattleEffects.length; i++) {
            if (specialBattleEffects[i].elementType == elementType) {
                v *= specialBattleEffects[i].effectiveness * 0.01;
            }
        }
        return v;
    };
    Object.defineProperty(GameBattleHelper, "nextPlayerControlBattler", {
        get: function () {
            for (var i = 0; i < GameBattle.playerBattlers.length; i++) {
                var battler = GameBattle.playerBattlers[i];
                if (!GameBattleHelper.canAction(battler) && !WorldData.forceSendActionCommand) {
                    battler.commandControlComplete = true;
                    battler.battleCommandType = null;
                    continue;
                }
                if (battler.actor.AI || battler.commandControlComplete)
                    continue;
                return battler;
            }
        },
        enumerable: false,
        configurable: true
    });
    GameBattleHelper.getSpecialBattleEffects = function (battler, specialType, fromBattleClass, fromBattleActor) {
        if (fromBattleClass === void 0) { fromBattleClass = null; }
        if (fromBattleActor === void 0) { fromBattleActor = null; }
        if (!fromBattleActor)
            fromBattleActor = battler.actor;
        if (!fromBattleClass)
            fromBattleClass = GameData.getModuleData(7, fromBattleActor.class);
        var specialBattleEffects = [];
        if (fromBattleActor && fromBattleActor.specialAbility) {
            specialBattleEffects = specialBattleEffects.concat(ArrayUtils.matchAttributes(fromBattleActor.specialBattleEffect, { type: specialType }, false));
        }
        if (fromBattleClass && fromBattleClass.specialAbility) {
            specialBattleEffects = specialBattleEffects.concat(ArrayUtils.matchAttributes(fromBattleClass.specialBattleEffect, { type: specialType }, false));
        }
        var fromBattleEquips = fromBattleActor.equips;
        for (var i = 0; i < fromBattleEquips.length; i++) {
            var equip = fromBattleEquips[i];
            if (!equip || !equip.specialAbility)
                continue;
            specialBattleEffects = specialBattleEffects.concat(ArrayUtils.matchAttributes(equip.specialBattleEffect, { type: specialType }, false));
        }
        var fromBattleSkills = battler.actor.skills;
        if (battler.actor.atkMode == 1 && battler.actor.atkSkill)
            fromBattleSkills = fromBattleSkills.concat(battler.actor.atkSkill);
        for (var i = 0; i < fromBattleSkills.length; i++) {
            var skill = fromBattleSkills[i];
            if (!skill.specialAbility)
                continue;
            specialBattleEffects = specialBattleEffects.concat(ArrayUtils.matchAttributes(skill.specialBattleEffect, { type: specialType }, false));
        }
        for (var i = 0; i < battler.actor.status.length; i++) {
            var status = battler.actor.status[i];
            if (!status.specialAbility)
                continue;
            specialBattleEffects = specialBattleEffects.concat(ArrayUtils.matchAttributes(status.specialBattleEffect, { type: specialType }, false));
        }
        return specialBattleEffects;
    };
    return GameBattleHelper;
}());
//# sourceMappingURL=GameBattleHelper.js.map