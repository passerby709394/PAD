var GameBattleData = (function () {
    function GameBattleData() {
    }
    GameBattleData.dead = function (battler) {
        if (battler.isDead)
            return;
        battler.isDead = true;
        battler.actor.hp = 0;
        GameBattleData.removeAllStatus(battler);
        EventUtils.happen(GameBattleData, GameBattleData.EVENT_BATTLER_DEAD, [battler]);
        var battleActor = battler.actor;
        if (battler.isEnemy && battleActor.dropEnabled) {
            this.rewardRecord.gold += battleActor.dropGold;
            this.rewardRecord.exp += battleActor.dropExp;
            for (var i = 0; i < battleActor.dropItems.length; i++) {
                var dropItemDS = battleActor.dropItems[i];
                if (MathUtils.rand(100) < dropItemDS.dropProbability) {
                    this.rewardRecord.items.push({ itemID: dropItemDS.item, num: dropItemDS.num });
                }
            }
            for (var i = 0; i < battleActor.dropEquips.length; i++) {
                var dropEquipDS = battleActor.dropEquips[i];
                if (MathUtils.rand(100) < dropEquipDS.dropProbability) {
                    var newEquip = ObjectUtils.depthClone(dropEquipDS.equip);
                    this.rewardRecord.equips.push(newEquip);
                }
            }
        }
    };
    GameBattleData.partyDeadReward = function () {
        var enemyParty = GameBattle.enemyParty;
        if (enemyParty.dropEnabled) {
            this.rewardRecord.gold += enemyParty.dropGold;
            this.rewardRecord.exp += enemyParty.dropExp;
            for (var i = 0; i < enemyParty.dropItems.length; i++) {
                var dropItemDS = enemyParty.dropItems[i];
                if (MathUtils.rand(100) < dropItemDS.dropProbability) {
                    this.rewardRecord.items.push({ itemID: dropItemDS.item, num: dropItemDS.num });
                }
            }
            for (var i = 0; i < enemyParty.dropEquips.length; i++) {
                var dropEquipDS = enemyParty.dropEquips[i];
                if (MathUtils.rand(100) < dropEquipDS.dropProbability) {
                    var newEquip = ObjectUtils.depthClone(dropEquipDS.equip);
                    this.rewardRecord.equips.push(newEquip);
                }
            }
        }
    };
    GameBattleData.initEnemyPartyPackageItem = function (enemyParty) {
        if (enemyParty.takeItemsSetting) {
            this.enemyPackageItems = ObjectUtils.depthClone(enemyParty.takeItems);
        }
        else {
            this.enemyPackageItems = [];
        }
    };
    GameBattleData.costItem = function (fromBattler, item) {
        if (item.isConsumables) {
            if (fromBattler.isEnemy) {
                GameBattleData.costEnemyPartyPackageItem(item);
            }
            else {
                if (!ProjectPlayer.getItem(item.id)) {
                    return false;
                }
                ProjectPlayer.changeItemNumber(item.id, -1, false);
            }
        }
        return true;
    };
    GameBattleData.costEnemyPartyPackageItem = function (item) {
        var itemDSIndex = ArrayUtils.matchAttributes(this.enemyPackageItems, { item: item }, true, "==", true)[0];
        if (itemDSIndex != null) {
            var itemDS = this.enemyPackageItems[itemDSIndex];
            itemDS.number--;
            if (itemDS.number == 0) {
                this.enemyPackageItems.splice(itemDSIndex, 1);
            }
        }
    };
    GameBattleData.forwardAllBattlersSkillCDAndStatusTime = function (battleRound) {
        var allBattlers = GameBattleHelper.allBattlers;
        for (var i in allBattlers) {
            var battler = allBattlers[i];
            var actor = battler.actor;
            battler.commandControlComplete = false;
            if (actor.atkMode == 1 && actor.atkSkill) {
                if (actor.atkSkill.currentCD > 0)
                    actor.atkSkill.currentCD--;
            }
            for (var s = 0; s < actor.skills.length; s++) {
                var skill = actor.skills[s];
                if (skill.currentCD > 0)
                    skill.currentCD--;
            }
            if (battleRound != 1) {
                this.forwardStatusTime(battler);
            }
        }
    };
    GameBattleData.useSkill = function (battler, skill) {
        battler.actor.sp -= skill.costSP;
        battler.actor.hp -= skill.costHP;
        skill.currentCD = skill.totalCD;
    };
    GameBattleData.addStatus = function (targetBattler, statusID, fromBattler, force) {
        if (fromBattler === void 0) { fromBattler = null; }
        if (force === void 0) { force = false; }
        var systemStatus = GameData.getModuleData(10, statusID);
        if (!systemStatus)
            return false;
        if (!force && MathUtils.rand(100) >= systemStatus.statusHit) {
            return false;
        }
        if (fromBattler == null)
            fromBattler = targetBattler;
        var targetBattlerActor = targetBattler.actor;
        var targetIsImmuneThisStatus = targetBattlerActor.selfImmuneStatus.indexOf(statusID) != -1;
        if (!force && targetIsImmuneThisStatus)
            return false;
        ;
        var thisStatus = ArrayUtils.matchAttributes(targetBattlerActor.status, { id: statusID }, true)[0];
        var firstAddStatus = false;
        if (thisStatus) {
            thisStatus.currentLayer += 1;
            if (thisStatus.currentLayer > thisStatus.maxlayer)
                thisStatus.currentLayer = thisStatus.maxlayer;
        }
        else {
            firstAddStatus = true;
            thisStatus = GameData.newModuleData(10, statusID);
            thisStatus.fromBattlerID = fromBattler.inBattleID;
            targetBattlerActor.status.push(thisStatus);
        }
        if (thisStatus.animation)
            targetBattler.playAnimation(thisStatus.animation, true, true);
        thisStatus.currentDuration = thisStatus.totalDuration;
        Game.refreshActorAttribute(targetBattlerActor, GameBattleHelper.getLevelByActor(targetBattlerActor));
        EventUtils.happen(GameBattleData, GameBattleData.EVENT_ADD_STATUS, [fromBattler, targetBattler, statusID, thisStatus, force]);
        if (firstAddStatus && thisStatus.eventSetting && thisStatus.addEvent)
            CommandPage.startTriggerFragmentEvent(thisStatus.addEvent, fromBattler, targetBattler);
        return true;
    };
    GameBattleData.removeStatus = function (targetBattler, statusID) {
        var systemStatus = GameData.getModuleData(10, statusID);
        if (!systemStatus)
            return false;
        var targetBattlerActor = targetBattler.actor;
        var thisStatusIdx = ArrayUtils.matchAttributes(targetBattlerActor.status, { id: statusID }, true, "==", true)[0];
        if (thisStatusIdx != null) {
            var removedStatus = targetBattlerActor.status.splice(thisStatusIdx, 1)[0];
            if (systemStatus.animation) {
                if (ArrayUtils.matchAttributes(targetBattlerActor.status, { animation: systemStatus.animation }, true, "==", true).length == 0) {
                    targetBattler.stopAnimation(systemStatus.animation);
                }
            }
            EventUtils.happen(GameBattleData, GameBattleData.EVENT_REMOVE_STATUS, [targetBattler, statusID, removedStatus]);
            if (systemStatus.eventSetting && systemStatus.removeEvent)
                CommandPage.startTriggerFragmentEvent(systemStatus.removeEvent, targetBattler, targetBattler);
            return true;
        }
        return false;
    };
    GameBattleData.removeAllStatus = function (battler, excludeSelfStatus) {
        if (excludeSelfStatus === void 0) { excludeSelfStatus = false; }
        var statusArr = battler.actor.status;
        for (var i = 0; i < statusArr.length; i++) {
            var status = statusArr[i];
            if (excludeSelfStatus && battler.actor.selfStatus.indexOf(status.id) != -1) {
                continue;
            }
            if (status.animation)
                battler.stopAnimation(status.animation);
            var systemStatus = GameData.getModuleData(10, status.id);
            EventUtils.happen(GameBattleData, GameBattleData.EVENT_REMOVE_STATUS, [battler, status.id, status]);
            if (systemStatus.eventSetting && systemStatus.removeEvent)
                CommandPage.startTriggerFragmentEvent(systemStatus.removeEvent, battler, battler);
            statusArr.splice(i, 1);
            i--;
        }
    };
    GameBattleData.removeAllBattlerStatusByFromBattler = function (fromBattler) {
        var targetBattlers = fromBattler.isEnemy ? GameBattle.playerBattlers : GameBattle.enemyBattlers;
        targetBattlers = GameBattleHelper.getNotNullBattlers(targetBattlers);
        for (var i = 0; i < targetBattlers.length; i++) {
            var targetBattler = targetBattlers[i];
            var statusArr = targetBattler.actor.status;
            var isRemoveStatus = false;
            for (var s = 0; s < statusArr.length; s++) {
                var status = statusArr[s];
                if (status.fromBattlerID == fromBattler.inBattleID) {
                    if (this.removeStatus(targetBattler, status.id)) {
                        s--;
                        isRemoveStatus = true;
                    }
                }
                if (isRemoveStatus)
                    Game.refreshActorAttribute(targetBattler.actor);
            }
        }
    };
    GameBattleData.getHitResult = function (actionType, fromBattler, targetBattler, skill) {
        if (skill === void 0) { skill = null; }
        var fromActor = fromBattler.actor;
        var targetActor = targetBattler.actor;
        var isHitSuccess = true;
        if (actionType <= 1) {
            var hitType = void 0;
            var dodType = void 0;
            if (actionType == 0 && (fromActor.atkMode == 0 || !fromActor.atkSkill)) {
                hitType = 1;
                dodType = 1;
            }
            else if (actionType == 0 && fromActor.atkMode == 1 && fromActor.atkSkill) {
                skill = fromActor.atkSkill;
                hitType = fromActor.atkSkill.hitType;
                dodType = fromActor.atkSkill.dodType;
            }
            else if (skill) {
                hitType = skill.hitType;
                dodType = skill.dodType;
            }
            var fromHit = void 0, targetDod = void 0;
            if (hitType == 0 && skill)
                fromHit = skill.hit;
            else
                fromHit = fromActor.HIT;
            if (dodType == 0)
                targetDod = 0;
            else
                targetDod = targetActor.DOD;
            isHitSuccess = MathUtils.rand(100) < (fromHit - targetDod);
        }
        else if (actionType == 2) {
            isHitSuccess = true;
        }
        return isHitSuccess;
    };
    GameBattleData.calculationHitResult = function (fromBattler, targetBattler, isHitSuccess, actionType, skill, item, status, damagePer) {
        if (skill === void 0) { skill = null; }
        if (item === void 0) { item = null; }
        if (status === void 0) { status = null; }
        if (damagePer === void 0) { damagePer = null; }
        EventUtils.happen(GameBattleData, GameBattleData.EVENT_CALC_HIT_RESULT_START, [fromBattler, targetBattler, isHitSuccess, actionType, skill, item, status]);
        var res;
        var fromActor = fromBattler.actor;
        var targetBattlerActor = targetBattler.actor;
        var addTargetBattlerStatusArr = [];
        var addFromBattlerStatusArr = [];
        var removeTargetBattlerStatusArr = [];
        var targetOriStatus = targetBattlerActor.status.concat();
        var damageType = -2;
        var hpChangeValue = 0;
        var spChangeValue = 0;
        var hitRemoveStatus = false;
        var critPer;
        var magCritPer;
        var isCrit;
        var isMagCrit;
        if (isHitSuccess) {
            isCrit = MathUtils.rand(100) < fromActor.CRIT ? true : false;
            isMagCrit = MathUtils.rand(100) < fromActor.MagCrit ? true : false;
            critPer = isCrit ? 2 : 1;
            magCritPer = isMagCrit ? 2 : 1;
            if (actionType == 0) {
                addFromBattlerStatusArr = addFromBattlerStatusArr.concat(fromActor.hitTargetSelfAddStatus);
                addTargetBattlerStatusArr = addTargetBattlerStatusArr.concat(fromActor.hitTargetStatus);
            }
            else if (actionType == 1) {
                if (skill.statusSetting)
                    addTargetBattlerStatusArr = addTargetBattlerStatusArr.concat(skill.addStatus);
                if (skill.statusSetting)
                    removeTargetBattlerStatusArr = removeTargetBattlerStatusArr.concat(skill.removeStatus);
            }
            else if (actionType == 2) {
                addTargetBattlerStatusArr = addTargetBattlerStatusArr.concat(item.addStatus);
                removeTargetBattlerStatusArr = removeTargetBattlerStatusArr.concat(item.removeStatus);
            }
            for (var i = 0; i < addTargetBattlerStatusArr.length; i++) {
                var addStatusID = addTargetBattlerStatusArr[i];
                GameBattleData.addStatus(targetBattler, addStatusID, fromBattler);
            }
            for (var i = 0; i < removeTargetBattlerStatusArr.length; i++) {
                var removeStatusID = removeTargetBattlerStatusArr[i];
                GameBattleData.removeStatus(targetBattler, removeStatusID);
            }
            for (var i = 0; i < addFromBattlerStatusArr.length; i++) {
                var addStatusID = addFromBattlerStatusArr[i];
                GameBattleData.addStatus(fromBattler, addStatusID, fromBattler);
            }
            if (addTargetBattlerStatusArr.length > 0 || removeTargetBattlerStatusArr.length > 0) {
                var level = GameBattleHelper.getLevelByActor(targetBattlerActor);
                Game.refreshActorAttribute(targetBattlerActor, level);
            }
            if (addFromBattlerStatusArr.length > 0) {
                var level = GameBattleHelper.getLevelByActor(targetBattlerActor);
                Game.refreshActorAttribute(targetBattlerActor, level);
            }
        }
        if (!isHitSuccess) {
            damageType = -1;
            res = { damageType: -1, damage: hpChangeValue, isCrit: false };
        }
        else if (actionType == 0) {
            damageType = 0;
            hpChangeValue = -Math.max(1, fromActor.ATK - targetBattlerActor.DEF) * critPer;
            if (targetBattler.battleCommandType == 3 && GameBattleHelper.canUseDefense(targetBattler))
                hpChangeValue = Math.floor(hpChangeValue / 2);
            res = { damageType: 0, damage: hpChangeValue, isCrit: isCrit };
            hitRemoveStatus = true;
        }
        else if (actionType == 1) {
            var skillDamage = 0;
            if (skill.useDamage) {
                var damageShowCrit = false;
                damageType = skill.damageType;
                skillDamage = skill.damageValue;
                if (skill.useAddition) {
                    var actorAttributeValue = skill.additionMultipleType == 0 ? fromActor.ATK : fromActor.MAG;
                    var addDamageValue = skill.additionMultiple / 100 * actorAttributeValue;
                    skillDamage += addDamageValue;
                }
                if (damageType == 0) {
                    hpChangeValue = -Math.max(1, skillDamage - targetBattlerActor.DEF) * critPer;
                    if (targetBattler.battleCommandType == 3 && GameBattleHelper.canUseDefense(targetBattler))
                        hpChangeValue = Math.floor(hpChangeValue / 2);
                    hitRemoveStatus = true;
                    damageShowCrit = isCrit;
                }
                else if (damageType == 1) {
                    hpChangeValue = -Math.max(1, skillDamage - targetBattlerActor.MagDef) * magCritPer;
                    hpChangeValue *= GameBattleHelper.getElementEffectivenessPer(targetBattler, skill.elementType) * 0.01;
                    hitRemoveStatus = true;
                    damageShowCrit = isMagCrit;
                }
                else if (damageType == 2) {
                    hpChangeValue = -Math.max(1, skillDamage);
                    hitRemoveStatus = true;
                }
                else if (damageType == 3) {
                    hpChangeValue = Math.max(0, skillDamage) * magCritPer;
                    damageShowCrit = isMagCrit;
                    if (GameBattleHelper.isResurrectionSkill(skill) && targetBattler.isDead && hpChangeValue > 0) {
                        targetBattler.isDead = false;
                    }
                }
                else if (damageType == 4) {
                    spChangeValue = Math.max(0, skillDamage) * magCritPer;
                    damageShowCrit = isMagCrit;
                }
                if (hpChangeValue != 0) {
                    res = { damageType: damageType, damage: hpChangeValue, isCrit: damageShowCrit };
                }
                else if (spChangeValue != 0) {
                    res = { damageType: damageType, damage: spChangeValue, isCrit: damageShowCrit };
                }
            }
        }
        else if (actionType == 2) {
            if (item.recoveryHP) {
                damageType = 3;
                hpChangeValue = item.recoveryHP;
                res = { damageType: damageType, damage: hpChangeValue, isCrit: false };
                if (item.applyDeadBattler && targetBattler.isDead && hpChangeValue > 0) {
                    targetBattler.isDead = false;
                }
            }
            if (item.recoverySP) {
                spChangeValue = item.recoverySP;
                if (damageType != 3) {
                    damageType = 4;
                    res = { damageType: damageType, damage: spChangeValue, isCrit: false };
                }
            }
        }
        else if (actionType == 3) {
            damageType = status.damageType;
            var damageShowCrit = false;
            var statusDamage = status.damageValue;
            if (status.useAddition) {
                var actorAttributeValue = status.additionMultipleType == 0 ? fromActor.ATK : fromActor.MAG;
                var addDamageValue = status.additionMultiple / 100 * actorAttributeValue;
                statusDamage += addDamageValue;
            }
            statusDamage *= status.currentLayer;
            if (damageType == 0) {
                hpChangeValue = -Math.max(1, statusDamage - targetBattlerActor.DEF);
                hitRemoveStatus = true;
                damageShowCrit = isCrit;
            }
            else if (damageType == 1) {
                hpChangeValue = -Math.max(1, statusDamage - targetBattlerActor.MagDef);
                hpChangeValue *= GameBattleHelper.getElementEffectivenessPer(targetBattler, status.elementType) * 0.01;
                hitRemoveStatus = true;
                damageShowCrit = isMagCrit;
            }
            else if (damageType == 2) {
                hpChangeValue = -Math.max(1, statusDamage);
                hitRemoveStatus = true;
            }
            else if (damageType == 3) {
                hpChangeValue = Math.max(0, statusDamage) * magCritPer;
                damageShowCrit = isMagCrit;
            }
            else if (damageType == 4) {
                spChangeValue = Math.max(0, statusDamage) * magCritPer;
                damageShowCrit = isMagCrit;
            }
            if (hpChangeValue != 0) {
                res = { damageType: damageType, damage: hpChangeValue, isCrit: damageShowCrit };
            }
            else if (spChangeValue != 0) {
                res = { damageType: damageType, damage: spChangeValue, isCrit: damageShowCrit };
            }
        }
        if (damageType <= 2) {
            if (GameBattleHelper.isHostileRelationship(fromBattler, targetBattler) && res && res.damage < 0) {
                var fromBattlerDamagePer = GameBattleHelper.getDamagePer(fromBattler);
                var targetBattlerStrikePer = GameBattleHelper.getStrikePer(targetBattler);
                res.damage = hpChangeValue = hpChangeValue * fromBattlerDamagePer * 0.01 * targetBattlerStrikePer * 0.01;
            }
            if (damagePer != null && res && res.damage < 0) {
                res.damage = hpChangeValue = hpChangeValue * damagePer * 0.01;
            }
        }
        if (damageType >= 0 && damageType <= 2 && res && Math.abs(res.damage) < 1) {
            res.damage = hpChangeValue = -1;
        }
        if (WorldData.useCustomDamageLogic) {
            if (isHitSuccess) {
                var lastHP = targetBattlerActor.hp;
                hitRemoveStatus = false;
                CustomGameNumber.customDamageLogic_actionType = actionType;
                CustomGameNumber.customDamageLogic_skill = skill;
                CustomGameNumber.customDamageLogic_item = item;
                CustomGameNumber.customDamageLogic_status = status;
                CommandPage.startTriggerFragmentEvent(WorldData.customDamageLogicEvent, fromBattler, targetBattler);
                if (lastHP > targetBattlerActor.hp)
                    hitRemoveStatus = true;
            }
        }
        else {
            hpChangeValue = Math.trunc(hpChangeValue);
            spChangeValue = Math.trunc(spChangeValue);
            if (hpChangeValue != 0)
                targetBattlerActor.hp += hpChangeValue;
            if (spChangeValue != 0)
                targetBattlerActor.sp += spChangeValue;
        }
        targetBattlerActor.hp = Math.max(Math.min(targetBattlerActor.hp, targetBattlerActor.MaxHP), 0);
        targetBattlerActor.sp = Math.max(Math.min(targetBattlerActor.sp, targetBattlerActor.MaxSP), 0);
        if (hitRemoveStatus) {
            var hitRemoveStatusSuccess = false;
            if ((actionType == 0 || actionType == 1 || actionType == 3) && damageType <= 2) {
                for (var i = 0; i < targetOriStatus.length; i++) {
                    var needRemoveStatus = targetOriStatus[i];
                    if (needRemoveStatus.removeWhenInjured && MathUtils.rand(100) < needRemoveStatus.removePer) {
                        if (GameBattleData.removeStatus(targetBattler, needRemoveStatus.id))
                            hitRemoveStatusSuccess = true;
                    }
                }
                if (hitRemoveStatusSuccess) {
                    var level = GameBattleHelper.getLevelByActor(targetBattlerActor);
                    Game.refreshActorAttribute(targetBattlerActor, level);
                }
            }
        }
        EventUtils.happen(GameBattleData, GameBattleData.EVENT_CALC_HIT_RESULT_OVER, [fromBattler, targetBattler, res === null || res === void 0 ? void 0 : res.damageType, res === null || res === void 0 ? void 0 : res.damage, res === null || res === void 0 ? void 0 : res.isCrit]);
        return res;
    };
    GameBattleData.changeBattlerHP = function (battle, changeValue) {
        battle.actor.hp += changeValue;
        battle.actor.hp = Math.max(Math.min(battle.actor.hp, battle.actor.MaxHP), 0);
    };
    GameBattleData.changeBattlerSP = function (battle, changeValue) {
        battle.actor.sp += changeValue;
        battle.actor.sp = Math.max(Math.min(battle.actor.sp, battle.actor.MaxSP), 0);
    };
    GameBattleData.forwardStatusTime = function (battler) {
        var isRemoveStatus = false;
        for (var s = 0; s < battler.actor.status.length; s++) {
            var status = battler.actor.status[s];
            status.currentDuration--;
            if (status.currentDuration <= 0) {
                var isRemove = GameBattleData.removeStatus(battler, status.id);
                if (isRemove) {
                    s--;
                    isRemoveStatus = true;
                }
            }
        }
        if (isRemoveStatus) {
            Game.refreshActorAttribute(battler.actor);
        }
    };
    GameBattleData.EVENT_CALC_HIT_RESULT_START = "GameBattleDataEVENT_CALC_HIT_RESULT_START";
    GameBattleData.EVENT_CALC_HIT_RESULT_OVER = "GameBattleDataEVENT_CALC_HIT_RESULT_OVER";
    GameBattleData.EVENT_ADD_STATUS = "GameBattleDataEVENT_ADD_STATUS";
    GameBattleData.EVENT_REMOVE_STATUS = "GameBattleDataEVENT_REMOVE_STATUS";
    GameBattleData.EVENT_BATTLER_DEAD = "GameBattleDataEVENT_BATTLER_DEAD";
    GameBattleData.rewardRecord = { gold: 0, exp: 0, items: [], equips: [] };
    return GameBattleData;
}());
//# sourceMappingURL=GameBattleData.js.map