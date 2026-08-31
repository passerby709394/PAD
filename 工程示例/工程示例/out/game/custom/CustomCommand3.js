(function (CommandExecute) {
    CommandExecute.recordBeforeBattleState = {};
    var overHandle;
    function customCommand_9001(commandPage, cmd, trigger, triggerPlayer, playerInput, cp) {
        if (GameBattle.state != 0 || overHandle) {
            trigger.pause = true;
            Callback.CallLater(customCommand_9001, this, [commandPage, cmd, trigger, triggerPlayer, playerInput, cp]);
            return;
        }
        var enemyParty = GameData.getModuleData(11, cp.useVar ? Game.player.variable.getVariable(cp.enemyPartyVarID) : cp.enemyParty);
        if (!enemyParty || enemyParty.enemys.length == 0)
            return;
        CommandExecute.recordBeforeBattleState.lastBgmURL = GameAudio.lastBgmURL;
        CommandExecute.recordBeforeBattleState.lastBGMPitch = GameAudio.lastBGMPitch;
        CommandExecute.recordBeforeBattleState.lastBGMVolume = GameAudio.lastBGMVolume;
        CommandExecute.recordBeforeBattleState.lastBgsURL = GameAudio.lastBgsURL;
        CommandExecute.recordBeforeBattleState.lastBGSPitch = GameAudio.lastBGSPitch;
        CommandExecute.recordBeforeBattleState.lastBGSVolume = GameAudio.lastBGSVolume;
        CommandExecute.recordBeforeBattleState.battleTriggerID = trigger.id;
        CommandExecute.recordBeforeBattleState.battleSceneID = Game.currentScene.id;
        trigger.offset(1);
        trigger.pause = true;
        GameBattle.init(cp);
        GameCommand.startCommonCommand(14020, [], null, trigger.trigger, trigger.executor);
    }
    CommandExecute.customCommand_9001 = customCommand_9001;
    function customCommand_9002(commandPage, cmd, trigger, triggerPlayer, playerInput, cp) {
        var _this_1 = this;
        if (GameBattle.state == 0)
            return;
        overHandle = true;
        var isWin;
        if (cp.battleOverMode == 0) {
            isWin = GameBattle.resultIsWin;
        }
        else {
            GameBattle.resultIsWin = isWin = (cp.battleOverMode == 1 ? true : false);
        }
        if (GameBattle.setting.battleResultSwitch && GameBattle.setting.battleFailHandleType == 1)
            Game.player.variable.setSwitch(GameBattle.setting.battleResultSwitch, isWin ? 1 : 0);
        GameBattle.stop(function () {
            if (CommandExecute.recordBeforeBattleState.lastBgmURL)
                GameAudio.playBGM(CommandExecute.recordBeforeBattleState.lastBgmURL, CommandExecute.recordBeforeBattleState.lastBGMVolume, 99999, true, 500, CommandExecute.recordBeforeBattleState.lastBGMPitch);
            else
                GameAudio.stopBGM(true, 500);
            if (CommandExecute.recordBeforeBattleState.lastBgsURL)
                GameAudio.playBGS(CommandExecute.recordBeforeBattleState.lastBgsURL, CommandExecute.recordBeforeBattleState.lastBGSVolume, 99999, true, 500, CommandExecute.recordBeforeBattleState.lastBGSPitch);
            else
                GameAudio.stopBGS(true, 500);
            EventUtils.happen(GameBattle, GameBattle.EVENT_BATTLE_OVER, [GameBattle.resultIsWin]);
            GameCommand.startCommonCommand(14023, [], Callback.New(function () {
                Game.layer.addChildAt(Game.layer.imageLayer, 1);
                overHandle = false;
                if (CommandExecute.recordBeforeBattleState.battleSceneID == Game.currentScene.id) {
                    GameCommand.inputMessageAndContinueExecute([], true, 0, CommandExecute.recordBeforeBattleState.battleTriggerID);
                }
            }, _this_1), Game.player.sceneObject, Game.player.sceneObject);
        });
    }
    CommandExecute.customCommand_9002 = customCommand_9002;
    function getBattleActors(type, battlerIndex) {
        var arr = [];
        if (type == 0) {
            arr = [GameBattle.playerBattlers[battlerIndex]];
        }
        else if (type == 1) {
            arr = [GameBattle.enemyBattlers[battlerIndex]];
        }
        else if (type == 2) {
            arr = [GameBattleAction.fromBattler];
        }
        else if (type == 3) {
            arr = [GameBattleAction.hitBattler];
        }
        else if (type == 4) {
            arr = GameBattle.playerBattlers;
        }
        else if (type == 5) {
            arr = GameBattle.enemyBattlers;
        }
        return arr;
    }
    function customCommand_9004(commandPage, cmd, trigger, triggerPlayer, playerInput, cp) {
        if (!GameBattleHelper.isInBattle)
            return;
        var battlerIndex = MathUtils.int(cp.battlerIndexUseVar ? Game.player.variable.getVariable(cp.battlerIndexVarID) : cp.battlerIndex);
        if (battlerIndex < 0)
            return;
        var battlers = getBattleActors(cp.inPartyType, battlerIndex);
        if (battlers.length == 0)
            return;
        var value = MathUtils.int(cp.valueUseVar ? Game.player.variable.getVariable(cp.valueVarID) : cp.value);
        for (var i = 0; i < battlers.length; i++) {
            var battler = battlers[i];
            if (!battler || battler.isDead)
                continue;
            var actor = battler.actor;
            actor.hp += cp.symbol == 0 ? value : -value;
            actor.hp = Math.max(Math.min(actor.hp, actor.MaxHP), 0);
        }
    }
    CommandExecute.customCommand_9004 = customCommand_9004;
    function customCommand_9005(commandPage, cmd, trigger, triggerPlayer, playerInput, cp) {
        if (!GameBattleHelper.isInBattle)
            return;
        var battlerIndex = MathUtils.int(cp.battlerIndexUseVar ? Game.player.variable.getVariable(cp.battlerIndexVarID) : cp.battlerIndex);
        if (battlerIndex < 0)
            return;
        var battlers = getBattleActors(cp.inPartyType, battlerIndex);
        if (battlers.length == 0)
            return;
        var value = MathUtils.int(cp.valueUseVar ? Game.player.variable.getVariable(cp.valueVarID) : cp.value);
        for (var i = 0; i < battlers.length; i++) {
            var battler = battlers[i];
            if (!battler || battler.isDead)
                continue;
            var actor = battler.actor;
            actor.sp += cp.symbol == 0 ? value : -value;
            actor.sp = Math.max(Math.min(actor.sp, actor.MaxSP), 0);
        }
    }
    CommandExecute.customCommand_9005 = customCommand_9005;
    function customCommand_9006(commandPage, cmd, trigger, triggerPlayer, playerInput, cp) {
        if (!GameBattleHelper.isInBattle)
            return;
        var battlerIndex = MathUtils.int(cp.battlerIndexUseVar ? Game.player.variable.getVariable(cp.battlerIndexVarID) : cp.battlerIndex);
        if (battlerIndex < 0)
            return;
        var battlers = getBattleActors(cp.inPartyType, battlerIndex);
        if (battlers.length == 0)
            return;
        var statusID = MathUtils.int(cp.statusUseVar ? Game.player.variable.getVariable(cp.statusIDVarID) : cp.statusID);
        for (var i = 0; i < battlers.length; i++) {
            var battler = battlers[i];
            if (!battler || battler.isDead)
                continue;
            var actor = battler.actor;
            if (cp.symbol == 0) {
                GameBattleData.addStatus(battler, statusID, battler, cp.force);
            }
            else if (cp.symbol == 1) {
                GameBattleData.removeStatus(battler, statusID);
            }
            else if (cp.symbol == 2) {
                GameBattleData.removeAllStatus(battler);
            }
            var level = GameBattleHelper.getLevelByActor(actor);
            Game.refreshActorAttribute(actor, level);
        }
    }
    CommandExecute.customCommand_9006 = customCommand_9006;
    function customCommand_9007(commandPage, cmd, trigger, triggerPlayer, playerInput, cp) {
        if (!GameBattleHelper.isInBattle)
            return;
        var battlerIndex = MathUtils.int(cp.battlerIndexUseVar ? Game.player.variable.getVariable(cp.battlerIndexVarID) : cp.battlerIndex);
        if (battlerIndex < 0)
            return;
        var battlers = getBattleActors(cp.inPartyType, battlerIndex);
        for (var i = 0; i < battlers.length; i++) {
            var battler = battlers[i];
            var value = MathUtils.int(cp.valueUseVar ? Game.player.variable.getVariable(cp.valueVarID) : cp.value);
            if (cp.type <= 2)
                value = -value;
            GameBattleAction.showDamage(battler, cp.type, value, cp.isCrit);
        }
    }
    CommandExecute.customCommand_9007 = customCommand_9007;
    function customCommand_9008(commandPage, cmd, trigger, triggerPlayer, playerInput, cp) {
        if (!GameBattleHelper.isInBattle)
            return;
        var actorID = MathUtils.int(cp.useVar ? Game.player.variable.getVariable(cp.actorIDVarID) : cp.actorID);
        var presetActorData = GameData.getModuleData(6, actorID);
        if (!presetActorData)
            return;
        var lv = MathUtils.int(cp.lvUseVar ? Game.player.variable.getVariable(cp.lvVarID) : cp.lv);
        lv = Math.max(1, Math.min(lv, presetActorData.MaxLv));
        var newBattlerInPartyIndex;
        var newActor;
        newBattlerInPartyIndex = GameBattle.battleUI.getEnemyPartyEmptyPostion();
        if (newBattlerInPartyIndex == -1)
            return;
        var enemyRefBattlerUI = GameBattle.battleUI.getRefEnemyBattlerUI(newBattlerInPartyIndex);
        if (!enemyRefBattlerUI)
            return;
        var newBattler = Battler.createBattler("enemy" + newBattlerInPartyIndex, enemyRefBattlerUI);
        GameBattle.enemyBattlers[newBattlerInPartyIndex] = newBattler;
        newActor = GameData.newModuleData(6, actorID);
        newBattler.setData(newActor, lv, true);
        if (cp.createAni)
            newBattler.playAnimation(cp.createAni, false, true);
        if (cp.saveNewInPartyIndex) {
            Game.player.variable.setVariable(cp.newInPartyIndexVarID, newBattlerInPartyIndex);
        }
    }
    CommandExecute.customCommand_9008 = customCommand_9008;
    function customCommand_9009(commandPage, cmd, trigger, triggerPlayer, playerInput, cp) {
        var _a;
        if (!GameBattleHelper.isInBattle)
            return;
        if (GameBattleAction.inAction)
            return;
        var battler;
        if (cp.inPartyType <= 1) {
            battler = getBattleActors(cp.inPartyType, cp.battlerIndex)[0];
        }
        else {
            var actorID = MathUtils.int(cp.useVar ? Game.player.variable.getVariable(cp.actorIDVarID) : cp.actorID);
            battler = ArrayUtils.matchAttributesD2(GameBattle.playerBattlers, "actor", { id: actorID }, true)[0];
        }
        if (!battler)
            return;
        if (cp.symbol == 0) {
            battler.battleCommandType = 0;
        }
        else if (cp.symbol == 1) {
            var skillID = cp.skillUseVar ? Game.player.variable.getVariable(cp.skillIDVarID) : cp.skillID;
            var skill = ArrayUtils.matchAttributes(battler.actor.skills, { id: skillID }, true)[0];
            if (!skill) {
                if (cp.forceUse) {
                    skill = GameData.newModuleData(8, skillID);
                    if (!skill)
                        return;
                }
                else {
                    return;
                }
            }
            battler.battleCommandType = 1;
            battler.battleCommandUseSkill = skill;
        }
        else if (cp.symbol == 2) {
            var itemID = cp.itemUseVar ? Game.player.variable.getVariable(cp.itemIDVarID) : cp.itemID;
            var item = void 0;
            if (battler.isEnemy) {
                item = (_a = ArrayUtils.matchAttributesD2(GameBattle.enemyParty.takeItems, "item", { id: itemID }, true)[0]) === null || _a === void 0 ? void 0 : _a.item;
            }
            else {
                item = ProjectPlayer.getItem(itemID);
            }
            if (!item) {
                if (cp.forceUse) {
                    item = GameData.newModuleData(1, itemID);
                    if (!battler.isEnemy) {
                        ProjectPlayer.addItemByInstance(item, false);
                    }
                    if (!item)
                        return;
                }
                else {
                    return;
                }
            }
            battler.battleCommandType = 2;
            if (item.releaseSkill && item.skill && GameData.getModuleData(8, item.skill)) {
                battler.battleCommandType = 1;
                battler.battleCommandUseSkillFromItem = item;
                battler.battleCommandUseSkill = GameData.newModuleData(8, item.skill);
            }
            battler.battleCommandUseItem = item;
        }
        else if (cp.symbol == 3) {
            battler.battleCommandType = 3;
        }
        else if (cp.symbol == 4) {
            battler.battleCommandType = 3;
            battler.battleCommandApplyTarget = battler;
        }
        if (cp.target == 0) {
            if (battler.battleCommandApplyTarget) {
                var allBattlers = GameBattleHelper.allBattlers;
                if (allBattlers.indexOf(battler.battleCommandApplyTarget) == -1) {
                    battler.battleCommandApplyTarget = battler.battleCommandApplyTarget.isEnemy ?
                        GameBattle.enemyBattlers[MathUtils.rand(GameBattle.enemyBattlers.length)] : GameBattle.playerBattlers[MathUtils.rand(GameBattle.playerBattlers.length)];
                }
            }
            else {
                cp.target = 1;
            }
        }
        if (cp.target == 1) {
            var isHostileRelationship = void 0;
            if (cp.symbol == 0) {
                isHostileRelationship = true;
            }
            else if (cp.symbol == 1) {
                isHostileRelationship = GameBattleHelper.isHostileSkill(battler.battleCommandUseSkill);
            }
            else if (cp.symbol == 2) {
                isHostileRelationship = battler.battleCommandUseItem.releaseSkill ? GameBattleHelper.isHostileSkill(battler.battleCommandUseSkill) : false;
            }
            if (isHostileRelationship) {
                var targetBattlers = GameBattleHelper.getHostileBattlers(battler);
                battler.battleCommandApplyTarget = targetBattlers[MathUtils.rand(targetBattlers.length)];
            }
            else {
                var targetBattlers = GameBattleHelper.getTeamBattlers(battler, true);
                battler.battleCommandApplyTarget = targetBattlers[MathUtils.rand(targetBattlers.length)];
            }
        }
        else if (cp.target == 2 || cp.target == 3) {
            var battlerIndex = MathUtils.int(cp.battlerIndexUseVar1 ? Game.player.variable.getVariable(cp.battlerIndexVarID1) : cp.battlerIndex1);
            if (battlerIndex < 0)
                return;
            battler.battleCommandApplyTarget = getBattleActors(cp.target == 2 ? 0 : 1, battlerIndex)[0];
        }
        if (!battler.battleCommandApplyTarget)
            return;
        trigger.offset(1);
        trigger.pause = true;
        GameBattleAction.doAction(battler, Callback.New(function () {
            CommandPage.executeEvent(trigger);
        }, this));
    }
    CommandExecute.customCommand_9009 = customCommand_9009;
    function customCommand_10001(commandPage, cmd, trigger, triggerPlayer, playerInput, p) {
        var equipID = p.useVar1 ? Game.player.variable.getVariable(p.equipIDVarID) : p.equipID;
        var num = p.useVar2 ? Game.player.variable.getVariable(p.numVarID) : p.num;
        if (!GameData.getModuleData(9, equipID))
            return;
        if (p.attributeRand && p.equipRandSetting.length > 0 && p.symbol == 0) {
            var equipAttributeNames = ["maxHP", "maxSP", "atk", "def", "mag", "magDef", "dod", "actionSpeed", "hit", "crit", "magCrit"];
            for (var n = 0; n < num; n++) {
                var newEquip = GameData.newModuleData(9, equipID, true);
                for (var i = 0; i < p.equipRandSetting.length; i++) {
                    var thisSetting = p.equipRandSetting[i];
                    var thisPer = thisSetting.probability;
                    if (MathUtils.rand(100) < thisPer) {
                        if (thisSetting.type == 12) {
                            for (var s = 0; s < equipAttributeNames.length; s++) {
                                if (thisSetting.usePer) {
                                    var per = (MathUtils.rand(thisSetting.maxValue - thisSetting.minValue) + thisSetting.minValue) / 100;
                                    var newValue = newEquip[equipAttributeNames[s]] * per;
                                    newEquip[equipAttributeNames[s]] = Math.ceil(newValue);
                                }
                                else {
                                    if (newEquip[equipAttributeNames[s]]) {
                                        var newValue = MathUtils.rand(thisSetting.maxFixValue - thisSetting.minFixValue) + thisSetting.minFixValue;
                                        newEquip[equipAttributeNames[s]] += Math.ceil(newValue);
                                    }
                                }
                            }
                            for (var s = 0; s < newEquip.customAttributes.length; s++) {
                                var equipCustomAttribute = newEquip.customAttributes[s];
                                if (thisSetting.usePer) {
                                    var per = (MathUtils.rand(thisSetting.maxValue - thisSetting.minValue) + thisSetting.minValue) / 100;
                                    if (equipCustomAttribute) {
                                        var newValue = equipCustomAttribute.value * per;
                                        equipCustomAttribute.value = Math.ceil(newValue);
                                    }
                                }
                                else {
                                    if (equipCustomAttribute) {
                                        var newValue = MathUtils.rand(thisSetting.maxFixValue - thisSetting.minFixValue) + thisSetting.minFixValue;
                                        equipCustomAttribute.value += Math.ceil(newValue);
                                    }
                                }
                            }
                        }
                        else {
                            if (thisSetting.type == 11) {
                                var equipCustomAttribute = ArrayUtils.matchAttributes(newEquip.customAttributes, { attribute: thisSetting.extAttribute }, true)[0];
                                if (!equipCustomAttribute) {
                                    equipCustomAttribute = new DataStructure_customAttribute;
                                    equipCustomAttribute.attribute = thisSetting.extAttribute;
                                    equipCustomAttribute.type = 0;
                                    equipCustomAttribute.value = 0;
                                    newEquip.customAttributes.push(equipCustomAttribute);
                                }
                                if (thisSetting.usePer) {
                                    var per = (MathUtils.rand(thisSetting.maxValue - thisSetting.minValue) + thisSetting.minValue) / 100;
                                    var newValue = equipCustomAttribute.value * per;
                                    equipCustomAttribute.value = Math.ceil(newValue);
                                }
                                else {
                                    var newValue = MathUtils.rand(thisSetting.maxFixValue - thisSetting.minFixValue) + thisSetting.minFixValue;
                                    equipCustomAttribute.value += Math.ceil(newValue);
                                }
                            }
                            else {
                                if (thisSetting.usePer) {
                                    var per = (MathUtils.rand(thisSetting.maxValue - thisSetting.minValue) + thisSetting.minValue) / 100;
                                    var newValue = newEquip[equipAttributeNames[thisSetting.type]] * per;
                                    newEquip[equipAttributeNames[thisSetting.type]] = Math.ceil(newValue);
                                }
                                else {
                                    var newValue = MathUtils.rand(thisSetting.maxFixValue - thisSetting.minFixValue) + thisSetting.minFixValue;
                                    newEquip[equipAttributeNames[thisSetting.type]] += Math.ceil(newValue);
                                }
                            }
                        }
                    }
                }
                ProjectPlayer.addEquipByInstance(newEquip);
            }
        }
        else {
            ProjectPlayer.changeItemNumber(equipID, p.symbol == 0 ? num : -num, true, true);
        }
    }
    CommandExecute.customCommand_10001 = customCommand_10001;
    function customCommand_10002(commandPage, cmd, trigger, triggerPlayer, playerInput, cp) {
        var actorID = MathUtils.int(cp.useVar ? Game.player.variable.getVariable(cp.actorIDVarID) : cp.actorID);
        var presetActorData = GameData.getModuleData(6, actorID);
        if (!presetActorData)
            return;
        if (cp.type == 0) {
            var addPlayerActorDS = void 0;
            if (cp.isRestoreActor) {
                var restoreActor = Game.player.data.actorRecords[CustomCompData.getSuperNumber(cp.actorStoreIndex)];
                if (restoreActor) {
                    addPlayerActorDS = restoreActor;
                    ProjectPlayer.addPlayerActorByDS(restoreActor, true, false);
                }
            }
            else {
                var lv = MathUtils.int(cp.lvUseVar ? Game.player.variable.getVariable(cp.lvVarID) : cp.lv);
                lv = Math.max(1, Math.min(lv, presetActorData.MaxLv));
                var actorDS = ProjectPlayer.addPlayerActorByActorID(actorID, lv);
                actorDS.dissolutionEnabled = cp.allowDissolution;
                addPlayerActorDS = actorDS;
            }
            if (addPlayerActorDS && cp.applyBattle && GameBattleHelper.isInBattle) {
                var newBattlerInPartyIndex = void 0;
                newBattlerInPartyIndex = ArrayUtils.getNullPosition(GameBattle.playerBattlers);
                if (newBattlerInPartyIndex == -1)
                    return;
                var playerRefBattlerUI = GameBattle.battleUI.getRefPlayerBattlerUI(newBattlerInPartyIndex);
                if (!playerRefBattlerUI)
                    return;
                var newBattler = Battler.createBattler("player" + newBattlerInPartyIndex, playerRefBattlerUI);
                GameBattle.playerBattlers[newBattlerInPartyIndex] = newBattler;
                newBattler.setData(addPlayerActorDS.actor, addPlayerActorDS.lv, false);
                GameBattle.battleUI.initActorInfoList();
            }
        }
        else {
            if (Game.player.data.party.length <= 1)
                return;
            var inPartyIndex = void 0;
            if (cp.awayType == 0) {
                inPartyIndex = ProjectPlayer.getPlayerActorFirstPositionByActorID(actorID);
            }
            else {
                inPartyIndex = CustomCompData.getSuperNumber(cp.inPartyIndex);
            }
            if (inPartyIndex < 0 || inPartyIndex >= Game.player.data.party.length)
                return;
            var awayActor = ProjectPlayer.getPlayerActorDSByInPartyIndex(inPartyIndex);
            if (awayActor && cp.applyBattle && GameBattleHelper.isInBattle) {
                var battler = GameBattleHelper.getBattlerByActor(awayActor.actor);
                if (battler) {
                    Battler.removeBattler(battler);
                    GameBattle.playerBattlers.splice(GameBattle.playerBattlers.indexOf(battler), 1);
                }
                GameBattle.battleUI.initActorInfoList();
            }
            ProjectPlayer.removePlayerActorByInPartyIndex(inPartyIndex);
            if (awayActor && cp.isSaveActor) {
                Game.player.data.actorRecords[CustomCompData.getSuperNumber(cp.saveTo)] = awayActor;
            }
        }
    }
    CommandExecute.customCommand_10002 = customCommand_10002;
    function customCommand_10003(commandPage, cmd, trigger, triggerPlayer, playerInput, cp) {
        var actor = Game.getActorByCheckType(cp.actorCheckType, cp.useVar, cp.actorID, cp.actorIDVarID, cp.actorInPartyIndexVarIDUseVar, cp.actorInPartyIndex, cp.actorInPartyIndexVarID, cp.enemyInPartyIndexVarIDUseVar, cp.enemyInPartyIndex, cp.enemyInPartyIndexVarID);
        if (!actor)
            return;
        var skillID = MathUtils.int(cp.skillUseVar ? Game.player.variable.getVariable(cp.skillIDVarID) : cp.skillID);
        if (cp.symbol == 0) {
            Game.actorLearnSkill(actor, skillID);
        }
        else if (cp.symbol == 1) {
            Game.actorForgetSkill(actor, skillID);
        }
        else if (cp.symbol == 2) {
            Game.actorForgetAllSkills(actor);
        }
        else if (cp.symbol == 3) {
            var skill = actor.skills[MathUtils.rand(actor.skills.length)];
            if (skill) {
                var skillID_1 = skill.id;
                Game.actorForgetSkill(actor, skillID_1);
            }
        }
        else if (cp.symbol == 4) {
            Game.actorReplaceAttackSkill(actor, skillID);
        }
        else if (cp.symbol == 5) {
            actor.atkMode = 0;
            actor.atkSkill = null;
        }
    }
    CommandExecute.customCommand_10003 = customCommand_10003;
    function customCommand_10004(commandPage, cmd, trigger, triggerPlayer, playerInput, cp) {
        var actor = Game.getActorByCheckType(cp.actorCheckType, cp.useVar, cp.actorID, cp.actorIDVarID, cp.actorInPartyIndexVarIDUseVar, cp.actorInPartyIndex, cp.actorInPartyIndexVarID, cp.enemyInPartyIndexVarIDUseVar, cp.enemyInPartyIndex, cp.enemyInPartyIndexVarID);
        if (!actor)
            return;
        var equipID = MathUtils.int(cp.equipUseVar ? Game.player.variable.getVariable(cp.equipIDVarID) : cp.equipID);
        var inPartyActorDS = ProjectPlayer.getPlayerActorDSByActor(actor);
        var inPartyActorIndex = ProjectPlayer.getPlayerActorIndexByActor(actor);
        var takeOffEquip;
        if (cp.symbol == 0) {
            if (inPartyActorDS && cp.fromPlayerPackage) {
                var fromPackageEquip = ProjectPlayer.getItemDS(equipID, true, true);
                if (fromPackageEquip)
                    ProjectPlayer.wearPlayerActorEquip(inPartyActorIndex, fromPackageEquip.equip);
            }
            else {
                if (GameData.getModuleData(9, equipID)) {
                    var newEquip = GameData.newModuleData(9, equipID);
                    Game.wearActorEquip(actor, newEquip);
                }
            }
        }
        else if (cp.symbol == 1 || cp.symbol == 3) {
            if (cp.usePartID) {
                if (inPartyActorDS && cp.symbol == 1)
                    takeOffEquip = ProjectPlayer.takeOffPlayerActorEquipByPartID(inPartyActorIndex, cp.partID);
                else
                    takeOffEquip = Game.takeOffActorEquipByPartID(actor, cp.partID);
            }
            else {
                var thisEquip = Game.getActorEquipByEquipID(actor, equipID);
                if (thisEquip) {
                    var thisEquipPartID = thisEquip.partID;
                    if (inPartyActorDS && cp.symbol == 1)
                        takeOffEquip = ProjectPlayer.takeOffPlayerActorEquipByPartID(inPartyActorIndex, thisEquipPartID);
                    else
                        takeOffEquip = Game.takeOffActorEquipByPartID(actor, thisEquipPartID);
                }
            }
        }
        else if (cp.symbol == 2 || cp.symbol == 4) {
            if (inPartyActorDS && cp.symbol == 2)
                ProjectPlayer.takeOffPlayerActorAllEquips(inPartyActorIndex);
            else
                Game.takeOffActorAllEquips(actor);
        }
        Game.refreshActorAttribute(actor, GameBattleHelper.getLevelByActor(actor));
        if (cp.isTakeOffEquipSaveToVar) {
            var takeOffEquipID = takeOffEquip ? takeOffEquip.id : -1;
            Game.player.variable.setVariable(cp.takeOffEquipSaveToVar, takeOffEquipID);
        }
    }
    CommandExecute.customCommand_10004 = customCommand_10004;
    function customCommand_10005(commandPage, cmd, trigger, triggerPlayer, playerInput, cp) {
        var actors = [];
        if (cp.actorCheckType == 5) {
            actors = ProjectPlayer.getPlayerActors();
        }
        else if (cp.actorCheckType == 6) {
            if (!GameBattleHelper.isInBattle)
                return;
            actors = GameBattle.getEnemyActors();
        }
        else {
            var actor = Game.getActorByCheckType(cp.actorCheckType, cp.useVar, cp.actorID, cp.actorIDVarID, cp.actorInPartyIndexVarIDUseVar, cp.actorInPartyIndex, cp.actorInPartyIndexVarID, cp.enemyInPartyIndexVarIDUseVar, cp.enemyInPartyIndex, cp.enemyInPartyIndexVarID);
            if (!actor)
                return;
            actors = [actor];
        }
        var value = MathUtils.int(cp.valueUseVar ? Game.player.variable.getVariable(cp.valueVarID) : cp.value);
        for (var i = 0; i < actors.length; i++) {
            var actor = actors[i];
            var inPartyActorDS = ProjectPlayer.getPlayerActorDSByActor(actor);
            var inPartyActorIndex = ProjectPlayer.getPlayerActorIndexByActor(actor);
            switch (cp.attributeType) {
                case 0:
                    actor.increaseMaxHP += value;
                    break;
                case 1:
                    actor.increaseMaxSP += value;
                    break;
                case 2:
                    actor.increaseATK += value;
                    break;
                case 3:
                    actor.increaseMag += value;
                    break;
                case 4:
                    actor.increaseDEF += value;
                    break;
                case 5:
                    actor.increaseMagDef += value;
                    break;
                case 6:
                    if (inPartyActorIndex != -1) {
                        var res = ProjectPlayer.increaseExpByIndex(inPartyActorIndex, value);
                        if (res && res.isLevelUp) {
                            if (actor.levelUpEvent)
                                CommandPage.startTriggerFragmentEvent(actor.levelUpEvent, Game.player.sceneObject, Game.player.sceneObject);
                            var actorClass = GameData.getModuleData(7, actor.class);
                            if (actorClass && actorClass.levelUpEvent)
                                CommandPage.startTriggerFragmentEvent(actorClass.levelUpEvent, Game.player.sceneObject, Game.player.sceneObject);
                        }
                    }
                    break;
                case 7:
                    if (inPartyActorIndex != -1) {
                        inPartyActorDS.lv += value;
                        if (value > 0) {
                            if (actor.levelUpEvent)
                                CommandPage.startTriggerFragmentEvent(actor.levelUpEvent, Game.player.sceneObject, Game.player.sceneObject);
                            var actorClass = GameData.getModuleData(7, actor.class);
                            if (actorClass && actorClass.levelUpEvent)
                                CommandPage.startTriggerFragmentEvent(actorClass.levelUpEvent, Game.player.sceneObject, Game.player.sceneObject);
                        }
                        ProjectPlayer.initPlayerActor(inPartyActorIndex);
                    }
                    break;
                case 8:
                    if (inPartyActorIndex != -1) {
                        inPartyActorDS.lv -= value;
                        ProjectPlayer.initPlayerActor(inPartyActorIndex);
                    }
                    break;
                case 9:
                    actor.hp += value;
                    if (actor.hp <= 0) {
                        if (cp.allowDead) {
                            actor.dead = true;
                        }
                        else {
                            actor.hp = 1;
                        }
                    }
                    break;
                case 10:
                    actor.sp += value;
                    break;
                case 11:
                    actor.increaseActionSpeed += value;
                    break;
                case 12:
                    actor.increaseDod += value;
                    break;
                case 13:
                    if (!actor.increaseExtendAttributes[cp.extAttribute])
                        actor.increaseExtendAttributes[cp.extAttribute] = 0;
                    actor.increaseExtendAttributes[cp.extAttribute] += value;
                    break;
            }
            Game.refreshActorAttribute(actor, GameBattleHelper.getLevelByActor(actor));
        }
    }
    CommandExecute.customCommand_10005 = customCommand_10005;
    var changeActorNameInfo = {};
    function customCommand_10006(commandPage, cmd, trigger, triggerPlayer, playerInput, cp) {
        var actor = Game.getActorByCheckType(cp.actorCheckType, cp.useVar, cp.actorID, cp.actorIDVarID, cp.actorInPartyIndexVarIDUseVar, cp.actorInPartyIndex, cp.actorInPartyIndexVarID, null, null, null);
        if (!actor)
            return;
        var newName = cp.valueUseVar ? Game.player.variable.getString(cp.valueVarID) : cp.value;
        for (var i = 0; i < Game.player.data.party.length; i++) {
            var inPartyActor = Game.player.data.party[i];
            var actorID = inPartyActor.actor.id;
            if (actorID == actor.id) {
                inPartyActor.actor.name = newName;
            }
        }
        changeActorNameInfo[actor.id] = newName;
    }
    CommandExecute.customCommand_10006 = customCommand_10006;
    if (!Config.BEHAVIOR_EDIT_MODE) {
        SinglePlayerGame.regSaveCustomData("___changeActorName", Callback.New(function () {
            return changeActorNameInfo;
        }, null));
        EventUtils.addEventListener(ClientWorld, ClientWorld.EVENT_INITED, Callback.New(function () {
            EventUtils.addEventListener(GameGate, GameGate.EVENT_IN_SCENE_STATE_CHANGE, Callback.New(function () {
                if (GameGate.gateState == GameGate.STATE_3_IN_SCENE_COMPLETE) {
                    var restoryChangeActorNameInfo = SinglePlayerGame.getSaveCustomData("___changeActorName");
                    if (restoryChangeActorNameInfo) {
                        changeActorNameInfo = restoryChangeActorNameInfo;
                        for (var i = 0; i < Game.player.data.party.length; i++) {
                            var actorID = Game.player.data.party[i].actor.id;
                            if (changeActorNameInfo[actorID]) {
                                Game.player.data.party[i].actor.name = changeActorNameInfo[actorID];
                            }
                        }
                    }
                }
            }, null));
        }, null), true);
    }
    function customCommand_10007(commandPage, cmd, trigger, triggerPlayer, playerInput, cp) {
        var actor = Game.getActorByCheckType(cp.actorCheckType, cp.useVar, cp.actorID, cp.actorIDVarID, cp.actorInPartyIndexVarIDUseVar, cp.actorInPartyIndex, cp.actorInPartyIndexVarID, null, null, null);
        if (!actor)
            return;
        var classID = cp.valueUseVar ? Game.player.variable.getVariable(cp.valueVarID) : cp.value;
        actor.class = classID;
        for (var i in actor) {
            if (i.indexOf("_cache") != -1) {
                delete actor[i];
            }
        }
        Game.refreshActorAttribute(actor, GameBattleHelper.getLevelByActor(actor));
    }
    CommandExecute.customCommand_10007 = customCommand_10007;
    function customCommand_10008(commandPage, cmd, trigger, triggerPlayer, playerInput, cp) {
        var actors;
        if (cp.actorCheckType == 5) {
            actors = ProjectPlayer.getPlayerActors();
        }
        else if (cp.actorCheckType == 6) {
            if (!GameBattleHelper.isInBattle)
                return;
            actors = GameBattle.getEnemyActors();
        }
        else {
            var actor = Game.getActorByCheckType(cp.actorCheckType, cp.useVar, cp.actorID, cp.actorIDVarID, cp.actorInPartyIndexVarIDUseVar, cp.actorInPartyIndex, cp.actorInPartyIndexVarID, cp.enemyInPartyIndexVarIDUseVar, cp.enemyInPartyIndex, cp.enemyInPartyIndexVarID);
            if (!actor)
                return;
            actors = [actor];
        }
        for (var i = 0; i < actors.length; i++) {
            var actor = actors[i];
            if (actor.dead)
                actor.dead = false;
            actor.hp = actor.MaxHP;
            actor.sp = actor.MaxSP;
            if (GameBattleHelper.isInBattle) {
                var battler = GameBattleHelper.getBattlerByActor(actor);
                if (battler && battler.isDead)
                    battler.isDead = false;
            }
        }
    }
    CommandExecute.customCommand_10008 = customCommand_10008;
    function customCommand_10009(commandPage, cmd, trigger, triggerPlayer, playerInput, cp) {
        var actor = Game.getActorByCheckType(cp.actorCheckType, cp.useVar, cp.actorID, cp.actorIDVarID, cp.actorInPartyIndexVarIDUseVar, cp.actorInPartyIndex, cp.actorInPartyIndexVarID, null, null, null);
        if (!actor)
            return;
        if (cp.faceEnabled) {
            var faceURL = cp.faceUseVar ? Game.player.variable.getString(cp.faceVarID) : cp.face;
            actor.face = faceURL;
        }
        if (cp.avatarEnabled) {
            var avatarID = cp.avatarUseVar ? Game.player.variable.getVariable(cp.avatarVarID) : cp.avatar;
            actor.avatar = avatarID;
        }
        if (cp.battlerEnabled) {
            var battlerID = cp.battlerUseVar ? Game.player.variable.getVariable(cp.battlerVarID) : cp.battler;
            actor.bttlerAvatar = battlerID;
            if (GameBattleHelper.isInBattle) {
                var battler = GameBattleHelper.getBattlerByActor(actor);
                if (battler)
                    battler.avatar.id = battlerID;
            }
        }
    }
    CommandExecute.customCommand_10009 = customCommand_10009;
    function customCommand_10010(commandPage, cmd, trigger, triggerPlayer, playerInput, cp) {
        var actor = Game.getActorByCheckType(cp.actorCheckType, cp.useVar, cp.actorID, cp.actorIDVarID, cp.actorInPartyIndexVarIDUseVar, cp.actorInPartyIndex, cp.actorInPartyIndexVarID, null, null, null);
        if (!actor)
            return;
        var skillID = MathUtils.int(cp.skillUseVar ? Game.player.variable.getVariable(cp.skillIDVarID) : cp.skillID);
        var skills = actor.skills.concat(actor.atkSkill);
        var skill = ArrayUtils.matchAttributes(skills, { id: skillID }, true)[0];
        if (skill) {
            CustomCompData.setData(skill, cp.attributes);
        }
    }
    CommandExecute.customCommand_10010 = customCommand_10010;
    function customCommand_10011(commandPage, cmd, trigger, triggerPlayer, playerInput, cp) {
        var actor = Game.getActorByCheckType(cp.actorCheckType, cp.useVar, cp.actorID, cp.actorIDVarID, cp.actorInPartyIndexVarIDUseVar, cp.actorInPartyIndex, cp.actorInPartyIndexVarID, null, null, null);
        if (!actor)
            return;
        var varName;
        if (cp.attrInfo.selectMode == 1) {
            var mode = cp.attrInfo.inputModeInfo.mode;
            var constName = cp.attrInfo.inputModeInfo.constName;
            var varNameIndex = cp.attrInfo.inputModeInfo.varNameIndex;
            varName = mode == 0 ? constName : Game.player.variable.getString(varNameIndex);
        }
        else {
            varName = cp.attrInfo.varName;
        }
        if (actor[varName] == undefined)
            return;
        var count = function (oldValue, value) {
            if (typeof oldValue != "number" || typeof value != "number")
                return value;
            var v;
            if (!cp.attrInfo.operationType)
                v = value;
            switch (cp.attrInfo.operationType) {
                case 1:
                    v = oldValue + value;
                    break;
                case 2:
                    v = oldValue - value;
                    break;
                case 3:
                    v = oldValue * value;
                    break;
                case 4:
                    v = oldValue / value;
                    break;
                case 5:
                    v = oldValue % value;
                    break;
                case 6:
                    v = Math.pow(oldValue, value);
                    break;
            }
            return cp.attrInfo.isRounded ? MathUtils.int(v) : v;
        };
        if (cp.attrInfo.valueType == 0) {
            var v = cp.attrInfo.value;
            if (v) {
                if (cp.attrInfo.selectMode == 1 && cp.attrInfo.inputModeInfo.typeIndex == 3) {
                    try {
                        v.value = JSON.parse(v.value);
                    }
                    catch (e) {
                        v.value = {};
                    }
                }
                actor[varName] = count(actor[varName], v.value);
            }
        }
        else {
            var v = cp.attrInfo.value;
            if (v && v.value) {
                var varID = v.value;
                switch (v.varType) {
                    case 0:
                        actor[varName] = count(actor[varName], Game.player.variable.getVariable(varID));
                        break;
                    case 1:
                        actor[varName] = Game.player.variable.getString(varID);
                        break;
                    case 2:
                        actor[varName] = Game.player.variable.getSwitch(varID);
                        break;
                }
            }
        }
        Game.refreshActorAttribute(actor, GameBattleHelper.getLevelByActor(actor));
    }
    CommandExecute.customCommand_10011 = customCommand_10011;
    function customCommand_10012(commandPage, cmd, trigger, triggerPlayer, playerInput, cp) {
        trigger.pause = true;
        trigger.offset(1);
        ProjectSceneParty.collectQueueMembers(false, function () {
            GameCommand.inputMessageAndContinueExecute([], true, 0, trigger.id);
        });
    }
    CommandExecute.customCommand_10012 = customCommand_10012;
})(CommandExecute || (CommandExecute = {}));
//# sourceMappingURL=CustomCommand3.js.map