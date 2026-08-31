














var ProjectGame = (function (_super) {
    __extends(ProjectGame, _super);
    function ProjectGame() {
        var _this_1 = _super.call(this) || this;
        _this_1.EVENT_REMOVE_ACTOR_ITEM = "GameEVENT_REMOVE_ACTOR_ITEM";
        _this_1.EVENT_CARRY_ACTOR_ITEM = "GameEVENT_CARRY_ACTOR_ITEM";
        _this_1.EVENT_LEARN_SKILL = "GameEVENT_LEARN_SKILL";
        _this_1.EVENT_FORGET_SKILL = "GameEVENT_FORGET_SKILL";
        _this_1.EVENT_REPLACE_ATTACK_SKILL = "GameEVENT_REPLACE_ATTACK_SKILL";
        _this_1.EVENT_WEAR_ACTOR_EQUIP = "GameEVENT_WEAR_ACTOR_EQUIP";
        _this_1.EVENT_TAKE_OFF_ACTOR_EQUIP = "GameEVENT_TAKE_OFF_ACTOR_EQUIP";
        _this_1.extendAttributeSettings = [];
        EventUtils.addEventListenerFunction(GameGate, GameGate.EVENT_IN_SCENE_STATE_CHANGE, _this_1.onInSceneStateChange, _this_1);
        return _this_1;
    }
    ProjectGame.prototype.init = function () {
        this.player = new ProjectPlayer();
        EventUtils.addEventListenerFunction(Game, Game.EVENT_PAUSE_CHANGE, this.onPauseChange, this);
    };
    Object.defineProperty(ProjectGame.prototype, "gameTime", {
        get: function () {
            var gameStartTime;
            if (ProjectGame.gamePauseStartTime) {
                var dTime = Date.now() - ProjectGame.gamePauseStartTime.getTime();
                gameStartTime = new Date(ProjectGame.gameStartTime.getTime() + dTime);
            }
            else {
                gameStartTime = ProjectGame.gameStartTime;
            }
            return new Date().getTime() - gameStartTime.getTime();
        },
        enumerable: false,
        configurable: true
    });
    ProjectGame.prototype.getActorByCheckType = function (actorCheckType, actorIDUseVar, actorID, actorIDVarID, actorInPartyIndexVarIDUseVar, actorInPartyIndex, actorInPartyIndexVarID, enemyInPartyIndexVarIDUseVar, enemyInPartyIndex, enemyInPartyIndexVarID) {
        if (actorCheckType == 0) {
            var pActorID = MathUtils.int(actorIDUseVar ? Game.player.variable.getVariable(actorIDVarID) : actorID);
            var playerActorDS = ProjectPlayer.getPlayerActorDSByActorID(pActorID);
            return playerActorDS ? playerActorDS.actor : null;
        }
        else if (actorCheckType == 1) {
            var pActorInPartyIndex = MathUtils.int(actorInPartyIndexVarIDUseVar ? Game.player.variable.getVariable(actorInPartyIndexVarID) : actorInPartyIndex);
            var playerActorDS = ProjectPlayer.getPlayerActorDSByInPartyIndex(pActorInPartyIndex);
            return playerActorDS ? playerActorDS.actor : null;
        }
        else if (actorCheckType == 2) {
            if (!GameBattleHelper.isInBattle)
                return null;
            var pEnemyActorInPartyIndex = MathUtils.int(enemyInPartyIndexVarIDUseVar ? Game.player.variable.getVariable(enemyInPartyIndexVarID) : enemyInPartyIndex);
            var battler = GameBattle.enemyBattlers[pEnemyActorInPartyIndex];
            if (battler)
                return battler.actor;
            return null;
        }
        else if (actorCheckType == 3) {
            if (!GameBattleHelper.isInBattle)
                return null;
            var battler = GameBattleAction.fromBattler;
            if (battler)
                return battler.actor;
            return null;
        }
        else if (actorCheckType == 4) {
            if (!GameBattleHelper.isInBattle)
                return null;
            var battler = GameBattleAction.hitBattler;
            if (battler)
                return battler.actor;
            return null;
        }
    };
    ProjectGame.prototype.getActorSkillBySkillID = function (actor, skillID) {
        return ArrayUtils.matchAttributes(actor.skills, { id: skillID }, true)[0];
    };
    ProjectGame.prototype.actorLearnSkill = function (actor, skillID, happenEvent) {
        if (happenEvent === void 0) { happenEvent = true; }
        var skill = this.getActorSkillBySkillID(actor, skillID);
        if (skill || !GameData.getModuleData(8, skillID))
            return;
        var newSkill = GameData.newModuleData(8, skillID);
        actor.skills.push(newSkill);
        if (happenEvent)
            EventUtils.happen(Game, Game.EVENT_LEARN_SKILL, [actor, newSkill]);
        return newSkill;
    };
    ProjectGame.prototype.actorForgetSkill = function (actor, skillID, happenEvent) {
        if (happenEvent === void 0) { happenEvent = true; }
        var skill = this.getActorSkillBySkillID(actor, skillID);
        if (!skill || !GameData.getModuleData(8, skillID))
            return;
        actor.skills.splice(actor.skills.indexOf(skill), 1);
        if (happenEvent)
            EventUtils.happen(Game, Game.EVENT_FORGET_SKILL, [actor, skill]);
        return skill;
    };
    ProjectGame.prototype.actorForgetAllSkills = function (actor, happenEvent) {
        if (happenEvent === void 0) { happenEvent = true; }
        var forgetSkills = actor.skills.concat();
        actor.skills.length = 0;
        for (var i = 0; i < forgetSkills.length; i++) {
            if (happenEvent)
                EventUtils.happen(Game, Game.EVENT_FORGET_SKILL, [actor, forgetSkills[i]]);
        }
        return forgetSkills;
    };
    ProjectGame.prototype.actorReplaceAttackSkill = function (actor, skillID, happenEvent) {
        if (happenEvent === void 0) { happenEvent = true; }
        if (!GameData.getModuleData(8, skillID))
            return;
        var newSkill = GameData.newModuleData(8, skillID);
        actor.atkSkill = newSkill;
        actor.atkMode = 1;
        if (happenEvent)
            EventUtils.happen(Game, Game.EVENT_REPLACE_ATTACK_SKILL, [actor, newSkill]);
        return newSkill;
    };
    ProjectGame.prototype.getActorEquipByPartID = function (actor, partID) {
        return ArrayUtils.matchAttributes(actor.equips, { partID: partID }, true)[0];
    };
    ProjectGame.prototype.getActorEquipByEquipID = function (actor, equipID) {
        return ArrayUtils.matchAttributes(actor.equips, { id: equipID }, true)[0];
    };
    ProjectGame.prototype.wearActorEquip = function (actor, newEquip, happenEvent) {
        if (happenEvent === void 0) { happenEvent = true; }
        if (newEquip) {
            var takeOffEquip = this.takeOffActorEquipByPartID(actor, newEquip.partID);
            actor.equips.push(newEquip);
            if (happenEvent)
                EventUtils.happen(Game, Game.EVENT_WEAR_ACTOR_EQUIP, [actor, newEquip.partID, takeOffEquip, newEquip]);
            return { success: true, takeOffEquip: takeOffEquip };
        }
    };
    ProjectGame.prototype.takeOffActorEquipByPartID = function (actor, partID, happenEvent) {
        if (happenEvent === void 0) { happenEvent = true; }
        var idx = ArrayUtils.matchAttributes(actor.equips, { partID: partID }, true, "==", true)[0];
        if (idx == null)
            return null;
        var takeOffEquip = actor.equips.splice(idx, 1)[0];
        if (takeOffEquip && happenEvent)
            EventUtils.happen(Game, Game.EVENT_TAKE_OFF_ACTOR_EQUIP, [actor, partID, takeOffEquip]);
        return takeOffEquip;
    };
    ProjectGame.prototype.takeOffActorAllEquips = function (actor, happenEvent) {
        if (happenEvent === void 0) { happenEvent = true; }
        var takeOffEquipArr = actor.equips.concat();
        actor.equips.length = 0;
        for (var i = 0; i < takeOffEquipArr.length; i++) {
            var takeOffEquip = takeOffEquipArr[i];
            if (happenEvent)
                EventUtils.happen(Game, Game.EVENT_TAKE_OFF_ACTOR_EQUIP, [actor, takeOffEquip.partID, takeOffEquip]);
        }
        return takeOffEquipArr;
    };
    ProjectGame.prototype.getLevelUpNeedExp = function (actor, lv) {
        return Math.floor(this.getGrowValueByLv(actor, "needEXPGrow", lv));
    };
    ProjectGame.prototype.refreshActorAttribute = function (actor, lv) {
        if (lv === void 0) { lv = null; }
        if (lv == null)
            lv = GameBattleHelper.getLevelByActor(actor);
        var res = this.clacActorAttribute(actor, lv);
        if (res) {
            actor.MaxHP = Math.floor(res.MaxHP);
            actor.MaxSP = Math.floor(res.MaxSP);
            actor.ATK = Math.floor(res.ATK);
            actor.DEF = Math.floor(res.DEF);
            actor.MAG = Math.floor(res.MAG);
            actor.MagDef = Math.floor(res.MagDef);
            actor.HIT = Math.floor(res.HIT);
            actor.DOD = Math.floor(res.DOD);
            actor.CRIT = Math.floor(res.CRIT);
            actor.MagCrit = Math.floor(res.MagCrit);
            actor.extendAttributes = res.extendAttributes;
            actor.ActionSpeed = Math.floor(res.ActionSpeed);
            var statusMaxHP = Math.floor(res.statusAddMaxHP);
            if (statusMaxHP > 0) {
                actor.hp += statusMaxHP;
            }
            actor.hp = Math.min(actor.MaxHP, Math.max(actor.hp, 0));
            actor.sp = Math.min(actor.MaxSP, Math.max(actor.sp, 0));
        }
    };
    ProjectGame.prototype.clacActorAttribute = function (actor, lv, previewChangeMode, previewChangeEquipID, previewChangeEquip, previewChangeSkillIndex, previewChangeSkill) {
        if (previewChangeMode === void 0) { previewChangeMode = 0; }
        if (previewChangeEquipID === void 0) { previewChangeEquipID = 0; }
        if (previewChangeEquip === void 0) { previewChangeEquip = null; }
        if (previewChangeSkillIndex === void 0) { previewChangeSkillIndex = 0; }
        if (previewChangeSkill === void 0) { previewChangeSkill = null; }
        var systemActor = GameData.getModuleData(6, actor.id);
        if (!systemActor)
            return;
        var actorClass = GameData.getModuleData(7, actor.class);
        var fromStatusMaxHP = 0;
        var fromStatusMaxHPper_BUFF = 1.0;
        var fromStatusMaxHPper_DEBUFF = 1.0;
        var maxhp;
        var maxsp;
        var mag;
        var agi;
        var pow;
        var end;
        var magDef;
        var hit;
        var crit;
        var magCrit;
        var actionSpeed;
        var atk;
        var def;
        var dod;
        var extendAttributesFixed = [];
        var extendAttributesAdditionPercentage = [];
        var extendAttributesMultiplicationPercentage = [];
        var extendAttributeLen = GameData.getLength(14);
        for (var i = 1; i <= extendAttributeLen; i++) {
            extendAttributesFixed[i] = 0;
            extendAttributesAdditionPercentage[i] = 0;
            extendAttributesMultiplicationPercentage[i] = 1;
        }
        if (actor.growUpEnabled) {
            maxhp = Math.floor(this.getGrowValueByLv(actor, "MaxHPGrow", lv) + actor.increaseMaxHP);
            maxsp = Math.floor(this.getGrowValueByLv(actor, "MaxSPGrow", lv) + actor.increaseMaxSP);
            atk = Math.floor(this.getGrowValueByLv(actor, "ATKGrow", lv, actorClass) + actor.increaseATK);
            def = Math.floor(this.getGrowValueByLv(actor, "DEFGrow", lv, actorClass) + actor.increaseDEF);
            mag = Math.floor(this.getGrowValueByLv(actor, "MAGGrow", lv, actorClass) + actor.increaseMag);
            magDef = Math.floor(this.getGrowValueByLv(actor, "MAGDEFGrow", lv, actorClass) + actor.increaseMagDef);
            dod = Math.floor(this.getGrowValueByLv(actor, "DODGrow", lv, actorClass) + actor.increaseDod);
            actionSpeed = Math.floor(this.getGrowValueByLv(actor, "ActionSpeedGrow", lv, actorClass) + actor.increaseActionSpeed);
            crit = actor.increaseCRIT;
            magCrit = actor.increaseMagCrit;
            if (actorClass.isCustomAttribute) {
                for (var i = 0; i < actorClass.customAttributes.length; i++) {
                    var customAttribute = actorClass.customAttributes[i];
                    extendAttributesFixed[customAttribute.attribute] = Math.floor(this.getGrowValueByLv(actor, "", lv, actorClass, customAttribute));
                }
            }
        }
        else {
            maxhp = this.getActorInitAttirubte(actor, "MaxHP") + actor.increaseMaxHP;
            maxsp = this.getActorInitAttirubte(actor, "MaxSP") + actor.increaseMaxSP;
            mag = this.getActorInitAttirubte(actor, "MAG") + actor.increaseMag;
            magDef = this.getActorInitAttirubte(actor, "MagDef") + actor.increaseMagDef;
            atk = this.getActorInitAttirubte(actor, "ATK") + actor.increaseATK;
            def = this.getActorInitAttirubte(actor, "DEF") + actor.increaseDEF;
            dod = this.getActorInitAttirubte(actor, "DOD") + actor.increaseDod;
            crit = this.getActorInitAttirubte(actor, "CRIT") + actor.increaseCRIT;
            magCrit = this.getActorInitAttirubte(actor, "MagCrit") + actor.increaseMagCrit;
            actionSpeed = this.getActorInitAttirubte(actor, "ActionSpeed") + actor.increaseActionSpeed;
            this.slotExtendAttributes(actor, extendAttributesFixed, extendAttributesAdditionPercentage, extendAttributesMultiplicationPercentage);
        }
        for (var i = 1; i <= actor.increaseExtendAttributes.length; i++) {
            var increaseExtendAttribute = actor.increaseExtendAttributes[i];
            if (increaseExtendAttribute)
                extendAttributesFixed[i] += increaseExtendAttribute;
        }
        hit = this.getActorInitAttirubte(actor, "HIT");
        ArrayUtils.removeSameObjectD2(actor.equips, "id", false);
        ArrayUtils.removeSameObjectD2(actor.skills, "id", false);
        ArrayUtils.removeSameObjectD2(actor.status, "id", false);
        if (actor.passiveStatus) {
            actor.selfStatus = actor.selfStatus1.concat();
            actor.selfImmuneStatus = actor.selfImmuneStatus1.concat();
            actor.hitTargetStatus = actor.hitTargetStatus1.concat();
            actor.hitTargetSelfAddStatus = actor.hitTargetSelfAddStatus1.concat();
        }
        else {
            actor.selfStatus.length = 0;
            actor.selfImmuneStatus.length = 0;
            actor.hitTargetStatus.length = 0;
            actor.hitTargetSelfAddStatus.length = 0;
        }
        if (actorClass && actorClass.passiveStatus) {
            actor.selfStatus = actor.selfStatus.concat(actorClass.selfStatus);
            actor.selfImmuneStatus = actor.selfImmuneStatus.concat(actorClass.selfImmuneStatus);
            actor.hitTargetStatus = actor.hitTargetStatus.concat(actorClass.hitTargetStatus);
            actor.hitTargetSelfAddStatus = actor.hitTargetSelfAddStatus.concat(actorClass.hitTargetSelfAddStatus);
        }
        var equipPartsLength = GameData.getLength(19);
        for (var i = 1; i <= equipPartsLength; i++) {
            var equip = void 0;
            if (previewChangeMode == 2 && previewChangeEquipID == i) {
                equip = previewChangeEquip;
            }
            else {
                equip = Game.getActorEquipByPartID(actor, i);
            }
            if (equip) {
                maxhp += equip.maxHP;
                maxsp += equip.maxSP;
                atk += equip.atk;
                def += equip.def;
                mag += equip.mag;
                magDef += equip.magDef;
                hit += equip.hit;
                dod += equip.dod;
                crit += equip.crit;
                magCrit += equip.magCrit;
                actionSpeed += equip.actionSpeed;
                if (equip.passiveStatus) {
                    actor.selfStatus = actor.selfStatus.concat(equip.selfStatus);
                    actor.selfImmuneStatus = actor.selfImmuneStatus.concat(equip.selfImmuneStatus);
                    actor.hitTargetStatus = actor.hitTargetStatus.concat(equip.hitTargetStatus);
                    actor.hitTargetSelfAddStatus = actor.hitTargetSelfAddStatus.concat(equip.hitTargetSelfAddStatus);
                }
                this.slotExtendAttributes(equip, extendAttributesFixed, extendAttributesAdditionPercentage, extendAttributesMultiplicationPercentage);
            }
        }
        var skills = actor.skills;
        if (actor.atkMode == 1 && actor.atkSkill)
            skills = skills.concat(actor.atkSkill);
        for (var i = 0; i < skills.length; i++) {
            var actorSkill = void 0;
            if (previewChangeMode == 1 && previewChangeSkillIndex == i) {
                actorSkill = previewChangeSkill;
            }
            else {
                actorSkill = skills[i];
            }
            if (actorSkill.passiveAttribute) {
                maxhp += actorSkill.maxHP;
                maxsp += actorSkill.maxSP;
                atk += actorSkill.atk;
                def += actorSkill.def;
                mag += actorSkill.mag;
                magDef += actorSkill.magDef;
                hit += actorSkill.hit1;
                dod += actorSkill.dod;
                crit += actorSkill.crit;
                magCrit += actorSkill.magCrit;
                actionSpeed += actorSkill.actionSpeed;
                this.slotExtendAttributes(actorSkill, extendAttributesFixed, extendAttributesAdditionPercentage, extendAttributesMultiplicationPercentage);
            }
            if (actorSkill.passiveStatus) {
                actor.selfStatus = actor.selfStatus.concat(actorSkill.selfStatus);
                actor.selfImmuneStatus = actor.selfImmuneStatus.concat(actorSkill.selfImmuneStatus);
                actor.hitTargetStatus = actor.hitTargetStatus.concat(actorSkill.hitTargetStatus);
                actor.hitTargetSelfAddStatus = actor.hitTargetSelfAddStatus.concat(actorSkill.hitTargetSelfAddStatus);
            }
        }
        var stHPPer_BUFF = 1.0;
        var stHPPer_DEBUFF = 1.0;
        var stSPPer_BUFF = 1.0;
        var stSPPer_DEBUFF = 1.0;
        var stATKPer_BUFF = 1.0;
        var stATKPer_DEBUFF = 1.0;
        var stDEFPer_BUFF = 1.0;
        var stDEFPer_DEBUFF = 1.0;
        var stMAGPer_BUFF = 1.0;
        var stMAGPer_DEBUFF = 1.0;
        var stMagDefPer_BUFF = 1.0;
        var stMagDefPer_DEBUFF = 1.0;
        var stHitPer_BUFF = 1.0;
        var stHitPer_DEBUFF = 1.0;
        var stCritPer_BUFF = 1.0;
        var stCritPer_DEBUFF = 1.0;
        var stMagCritPer_BUFF = 1.0;
        var stMagCritPer_DEBUFF = 1.0;
        var stActionSpeedPer_BUFF = 1.0;
        var stActionSpeedPer_DEBUFF = 1.0;
        for (var i = 0; i < actor.status.length; i++) {
            var status = actor.status[i];
            if (status.maxHPPer > 100)
                stHPPer_BUFF *= ((status.maxHPPer - 100) * status.currentLayer + 100) * 0.01;
            else if (status.maxHPPer < 100)
                stHPPer_DEBUFF *= Math.pow(status.maxHPPer / 100, status.currentLayer);
            if (status.maxSPPer > 100)
                stSPPer_BUFF *= ((status.maxSPPer - 100) * status.currentLayer + 100) * 0.01;
            else if (status.maxSPPer < 100)
                stSPPer_DEBUFF *= Math.pow(status.maxSPPer / 100, status.currentLayer);
            if (status.atkPer > 100)
                stATKPer_BUFF *= ((status.atkPer - 100) * status.currentLayer + 100) * 0.01;
            else if (status.atkPer < 100)
                stATKPer_DEBUFF *= Math.pow(status.atkPer / 100, status.currentLayer);
            if (status.defPer > 100)
                stDEFPer_BUFF *= ((status.defPer - 100) * status.currentLayer + 100) * 0.01;
            else if (status.defPer < 100)
                stDEFPer_DEBUFF *= Math.pow(status.defPer / 100, status.currentLayer);
            if (status.magPer > 100)
                stMAGPer_BUFF *= ((status.magPer - 100) * status.currentLayer + 100) * 0.01;
            else if (status.magPer < 100)
                stMAGPer_DEBUFF *= Math.pow(status.magPer / 100, status.currentLayer);
            if (status.magDefPer > 100)
                stMagDefPer_BUFF *= ((status.magDefPer - 100) * status.currentLayer + 100) * 0.01;
            else if (status.magDefPer < 100)
                stMagDefPer_DEBUFF *= Math.pow(status.magDefPer / 100, status.currentLayer);
            if (status.actionSpeedPer > 100)
                stActionSpeedPer_BUFF *= ((status.actionSpeedPer - 100) * status.currentLayer + 100) * 0.01;
            else if (status.actionSpeedPer < 100)
                stActionSpeedPer_DEBUFF *= Math.pow(status.actionSpeedPer / 100, status.currentLayer);
            if (status.hitPer > 100)
                stHitPer_BUFF *= ((status.hitPer - 100) * status.currentLayer + 100) * 0.01;
            else if (status.hitPer < 100)
                stHitPer_DEBUFF *= Math.pow(status.hitPer / 100, status.currentLayer);
            if (status.critPer > 100)
                stCritPer_BUFF *= ((status.critPer - 100) * status.currentLayer + 100) * 0.01;
            else if (status.critPer < 100)
                stCritPer_DEBUFF *= Math.pow(status.critPer / 100, status.currentLayer);
            if (status.magCritPer > 100)
                stMagCritPer_BUFF *= ((status.magCritPer - 100) * status.currentLayer + 100) * 0.01;
            else if (status.magCritPer < 100)
                stMagCritPer_DEBUFF *= Math.pow(status.magCritPer / 100, status.currentLayer);
            maxhp += status.maxHP * status.currentLayer;
            maxsp += status.maxSP * status.currentLayer;
            atk += status.atk * status.currentLayer;
            def += status.def * status.currentLayer;
            mag += status.mag * status.currentLayer;
            magDef += status.magDef * status.currentLayer;
            hit += status.hit * status.currentLayer;
            crit += status.crit * status.currentLayer;
            magCrit += status.magCrit * status.currentLayer;
            actionSpeed += status.actionSpeed * status.currentLayer;
            if (status.totalDuration != 0 && !status.addMaxHPUsed) {
                fromStatusMaxHP += status.maxHP * status.currentLayer;
                if (status.maxHPPer > 100)
                    fromStatusMaxHPper_BUFF *= ((status.maxHPPer - 100) * status.currentLayer + 100) * 0.01;
                else if (status.maxHPPer < 100)
                    fromStatusMaxHPper_DEBUFF *= Math.pow(status.maxHPPer / 100, status.currentLayer);
                status.addMaxHPUsed = true;
            }
        }
        var fromStatusMaxHPper = fromStatusMaxHPper_BUFF * fromStatusMaxHPper_DEBUFF;
        fromStatusMaxHP += maxhp * fromStatusMaxHPper - maxhp;
        maxhp *= stHPPer_BUFF * stHPPer_DEBUFF;
        maxsp *= stSPPer_BUFF * stSPPer_DEBUFF;
        atk *= stATKPer_BUFF * stATKPer_DEBUFF;
        def *= stDEFPer_BUFF * stDEFPer_DEBUFF;
        mag *= stMAGPer_BUFF * stMAGPer_DEBUFF;
        magDef *= stMagDefPer_BUFF * stMagDefPer_DEBUFF;
        hit *= stHitPer_BUFF * stHitPer_DEBUFF;
        crit *= stCritPer_BUFF * stCritPer_DEBUFF;
        magCrit *= stMagCritPer_BUFF * stMagCritPer_DEBUFF;
        actionSpeed *= stActionSpeedPer_BUFF * stActionSpeedPer_DEBUFF;
        atk = Math.max(atk, 0);
        def = Math.max(def, 0);
        agi = Math.max(agi, 0);
        dod = Math.max(dod, 0);
        maxhp = Math.max(maxhp, 0);
        maxsp = Math.max(maxsp, 0);
        pow = Math.max(pow, 0);
        end = Math.max(end, 0);
        mag = Math.max(mag, 0);
        magDef = Math.max(magDef, 0);
        hit = Math.max(hit, 0);
        crit = Math.max(Math.min(crit, 100), 0);
        magCrit = Math.max(Math.min(magCrit, 100), 0);
        actionSpeed = Math.max(actionSpeed, 0);
        var actorExtendAttributes = extendAttributesFixed;
        for (var i = 1; i <= extendAttributeLen; i++) {
            actorExtendAttributes[i] *= 1 + extendAttributesAdditionPercentage[i] * 0.01;
        }
        for (var i = 1; i <= extendAttributeLen; i++) {
            actorExtendAttributes[i] *= extendAttributesMultiplicationPercentage[i];
        }
        for (var i = 1; i <= extendAttributeLen; i++) {
            var extendAttributeSetting = this.extendAttributeSettings[i];
            if (extendAttributeSetting) {
                var extValue = actorExtendAttributes[i];
                extValue = Math.max(Math.min(extValue, extendAttributeSetting.upperLimit), extendAttributeSetting.lowerLimit);
                if (extendAttributeSetting.isinteger)
                    extValue = Math.floor(extValue);
                actorExtendAttributes[i] = extValue;
            }
        }
        return {
            ATK: Math.floor(atk),
            DEF: Math.floor(def),
            AGI: Math.floor(agi),
            DOD: Math.floor(dod),
            MaxHP: Math.floor(maxhp),
            MaxSP: Math.floor(maxsp),
            POW: Math.floor(pow),
            END: Math.floor(end),
            MAG: Math.floor(mag),
            MagDef: Math.floor(magDef),
            HIT: Math.floor(hit),
            CRIT: Math.floor(crit),
            MagCrit: Math.floor(magCrit),
            ActionSpeed: Math.floor(actionSpeed),
            statusAddMaxHP: Math.floor(fromStatusMaxHP),
            extendAttributes: actorExtendAttributes.concat()
        };
    };
    ProjectGame.prototype.onInSceneStateChange = function (inNewSceneState) {
        if (GameGate.gateState == GameGate.STATE_0_START_EXECUTE_LEAVE_SCENE_EVENT) {
            if (inNewSceneState == 1) {
                ProjectGame.gameStartTime = new Date();
                ProjectPlayer.init();
                this.initExtendAttributeSetting();
            }
            else if (inNewSceneState == 2) {
                ProjectGame.gameStartTime = new Date((Date.now() - GUI_SaveFileManager.currentSveFileIndexInfo.indexInfo.gameTime));
            }
        }
        else if (GameGate.gateState == GameGate.STATE_3_IN_SCENE_COMPLETE) {
            if (inNewSceneState == 1 || inNewSceneState == 2) {
                for (var i = 0; i < Game.player.data.party.length; i++) {
                    var actorDS = Game.player.data.party[i];
                    if (actorDS == null)
                        continue;
                    GameData.changeModuleDataToCopyMode(actorDS.actor, 1);
                }
            }
        }
    };
    ProjectGame.prototype.onPauseChange = function () {
        if (Game.pause) {
            ProjectGame.gamePauseStartTime = new Date();
        }
        else {
            if (ProjectGame.gamePauseStartTime) {
                var dTime = Date.now() - ProjectGame.gamePauseStartTime.getTime();
                ProjectGame.gameStartTime = new Date(ProjectGame.gameStartTime.getTime() + dTime);
                ProjectGame.gamePauseStartTime = null;
            }
        }
    };
    ProjectGame.prototype.getGrowValueByLv = function (actor, growAttrName, lv, actorClass, customAttribute) {
        if (actorClass === void 0) { actorClass = null; }
        if (customAttribute === void 0) { customAttribute = null; }
        if (!actorClass)
            actorClass = GameData.getModuleData(7, actor.class);
        if (!actorClass)
            return 0;
        var growData;
        if (customAttribute) {
            var cacheGrowName = "__extCache_" + customAttribute.attribute;
            growData = actor[cacheGrowName];
            if (!actor[cacheGrowName])
                growData = actor[cacheGrowName] = GameUtils.getCurveData(customAttribute.value);
        }
        else {
            var cacheGrowName = growAttrName + "_cache";
            growData = actor[cacheGrowName];
            if (!actor[cacheGrowName])
                growData = actor[cacheGrowName] = GameUtils.getCurveData(actorClass[growAttrName]);
        }
        var per = lv == 0 ? 0 : (lv - 1) / (actor.MaxLv - 1);
        return GameUtils.getBezierPoint2ByGroupValue(growData, per);
    };
    ProjectGame.prototype.slotExtendAttributes = function (element, extendAttributesFixed, extendAttributesAdditionPercentage, extendAttributesMultiplicationPercentage) {
        if (extendAttributesFixed === void 0) { extendAttributesFixed = null; }
        if (extendAttributesAdditionPercentage === void 0) { extendAttributesAdditionPercentage = null; }
        if (extendAttributesMultiplicationPercentage === void 0) { extendAttributesMultiplicationPercentage = null; }
        if (!element.isCustomAttribute)
            return;
        if (!extendAttributesFixed) {
            extendAttributesFixed = [];
            extendAttributesAdditionPercentage = [];
            extendAttributesMultiplicationPercentage = [];
            var extendAttributeLen = GameData.getLength(14);
            for (var i = 1; i <= extendAttributeLen; i++) {
                extendAttributesFixed[i] = 0;
                extendAttributesAdditionPercentage[i] = 0;
                extendAttributesMultiplicationPercentage[i] = 1;
            }
        }
        for (var i = 0; i < element.customAttributes.length; i++) {
            var customAttribute = element.customAttributes[i];
            if (customAttribute.type == 0) {
                extendAttributesFixed[customAttribute.attribute] += customAttribute.value;
            }
            else if (customAttribute.type == 1) {
                extendAttributesAdditionPercentage[customAttribute.attribute] += customAttribute.value;
            }
            else if (customAttribute.type == 2) {
                extendAttributesMultiplicationPercentage[customAttribute.attribute] *= customAttribute.value * 0.01;
            }
        }
        return {
            extendAttributesFixed: extendAttributesFixed,
            extendAttributesAdditionPercentage: extendAttributesAdditionPercentage,
            extendAttributesMultiplicationPercentage: extendAttributesMultiplicationPercentage
        };
    };
    ProjectGame.prototype.getActorInitAttirubte = function (actor, attrName) {
        var cacheInitName = "__init_" + attrName;
        var initValue = actor.initAttrs[cacheInitName];
        if (initValue == null) {
            actor.initAttrs[cacheInitName] = initValue = actor[attrName];
        }
        return initValue;
    };
    ProjectGame.prototype.initExtendAttributeSetting = function () {
        for (var i = 0; i < WorldData.extendsAttributeSetting.length; i++) {
            var s = WorldData.extendsAttributeSetting[i];
            this.extendAttributeSettings[s.attribute] = s;
        }
    };
    return ProjectGame;
}(GameBase));
//# sourceMappingURL=ProjectGame.js.map