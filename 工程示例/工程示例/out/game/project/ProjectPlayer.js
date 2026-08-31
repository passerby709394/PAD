














var ProjectPlayer = (function (_super) {
    __extends(ProjectPlayer, _super);
    function ProjectPlayer() {
        return _super.call(this, true) || this;
    }
    ProjectPlayer.init = function () {
        for (var i = 0; i < Game.player.data.party.length; i++) {
            this.initPlayerActor(i, true);
        }
    };
    ProjectPlayer.increaseGold = function (v, happenEvent) {
        if (happenEvent === void 0) { happenEvent = true; }
        var oldGold = Game.player.data.gold;
        Game.player.data.gold = Math.floor(Math.max(Game.player.data.gold + v, 0));
        if (happenEvent)
            EventUtils.happen(ProjectPlayer, ProjectPlayer.EVENT_CHANGE_GOLD_NUMBER, [oldGold, Game.player.data.gold]);
    };
    ProjectPlayer.getItemDS = function (itemID, isEquip, includeCopyMode) {
        if (isEquip === void 0) { isEquip = false; }
        if (includeCopyMode === void 0) { includeCopyMode = false; }
        var itemDSs = ArrayUtils.matchAttributes(Game.player.data.package, { isEquip: isEquip }, false);
        if (!isEquip) {
            return ArrayUtils.matchAttributesD2(itemDSs, "item", { id: itemID }, true)[0];
        }
        else {
            var equipDSs = ArrayUtils.matchAttributesD2(itemDSs, "equip", { id: itemID }, false);
            for (var i = 0; i < equipDSs.length; i++) {
                var equipDS = equipDSs[i];
                if (!GameData.isCopyModeData(equipDS.equip) || includeCopyMode)
                    return equipDS;
            }
            return null;
        }
    };
    ProjectPlayer.getItem = function (itemID) {
        var itemDS = this.getItemDS(itemID, false);
        if (itemDS)
            return itemDS.item;
        return null;
    };
    ProjectPlayer.getItemIndex = function (item) {
        return ArrayUtils.matchAttributes(Game.player.data.package, { item: item }, true, "==", true)[0];
    };
    ProjectPlayer.getEquipIndex = function (equip) {
        return ArrayUtils.matchAttributes(Game.player.data.package, { equip: equip }, true, "==", true)[0];
    };
    ProjectPlayer.changeItemNumber = function (itemID, v, isEquip, happenEvent) {
        if (isEquip === void 0) { isEquip = false; }
        if (happenEvent === void 0) { happenEvent = true; }
        var moduleID = isEquip ? 9 : 1;
        if (!GameData.getModuleData(moduleID, itemID))
            return;
        if (v > 0) {
            var itemDS = this.getItemDS(itemID, isEquip);
            if (!itemDS) {
                itemDS = new DataStructure_packageItem;
                if (isEquip) {
                    itemDS.equip = GameData.newModuleData(moduleID, itemID);
                }
                else {
                    itemDS.item = GameData.newModuleData(moduleID, itemID);
                }
                itemDS.number = v;
                itemDS.isEquip = isEquip;
                Game.player.data.package.push(itemDS);
            }
            else if (itemDS) {
                itemDS.number += v;
            }
        }
        else {
            var itemDS = this.getItemDS(itemID, isEquip);
            if (!itemDS)
                itemDS = this.getItemDS(itemID, isEquip, true);
            if (itemDS) {
                itemDS.number += v;
                if (itemDS.number <= 0)
                    Game.player.data.package.splice(Game.player.data.package.indexOf(itemDS), 1);
            }
        }
        if (happenEvent)
            EventUtils.happen(ProjectPlayer, ProjectPlayer.EVENT_CHANGE_ITEM_NUMBER);
    };
    ProjectPlayer.addEquip = function (equipID, v, happenEvent) {
        if (happenEvent === void 0) { happenEvent = true; }
        this.changeItemNumber(equipID, v, true, happenEvent);
    };
    ProjectPlayer.addEquipByInstance = function (equip, happenEvent) {
        if (happenEvent === void 0) { happenEvent = true; }
        if (GameData.isCopyModeData(equip)) {
            var equipDS = new DataStructure_packageItem;
            equipDS.equip = equip;
            equipDS.number = 1;
            equipDS.isEquip = true;
            Game.player.data.package.push(equipDS);
            if (happenEvent)
                EventUtils.happen(ProjectPlayer, ProjectPlayer.EVENT_CHANGE_ITEM_NUMBER);
        }
        else {
            ProjectPlayer.changeItemNumber(equip.id, 1, true, happenEvent);
        }
    };
    ProjectPlayer.addItemByInstance = function (item, happenEvent) {
        if (happenEvent === void 0) { happenEvent = true; }
        var itemDS = new DataStructure_packageItem;
        itemDS.item = item;
        itemDS.number = 1;
        itemDS.isEquip = false;
        Game.player.data.package.push(itemDS);
        if (happenEvent)
            EventUtils.happen(ProjectPlayer, ProjectPlayer.EVENT_CHANGE_ITEM_NUMBER);
    };
    ProjectPlayer.removeItemByInstance = function (itemDS, v, happenEvent) {
        if (happenEvent === void 0) { happenEvent = true; }
        var item = itemDS.isEquip ? itemDS.equip : itemDS.item;
        if (GameData.isCopyModeData(item)) {
            if (itemDS.number > v) {
                itemDS.number -= v;
            }
            else {
                Game.player.data.package.splice(Game.player.data.package.indexOf(itemDS), 1);
            }
        }
        else {
            ProjectPlayer.changeItemNumber(item.id, -v, itemDS.isEquip);
        }
        if (happenEvent)
            EventUtils.happen(ProjectPlayer, ProjectPlayer.EVENT_CHANGE_ITEM_NUMBER);
    };
    ProjectPlayer.getPlayerActors = function () {
        var arr = [];
        for (var i = 0; i < Game.player.data.party.length; i++) {
            arr.push(Game.player.data.party[i].actor);
        }
        return arr;
    };
    ProjectPlayer.getPlayerActorDSByInPartyIndex = function (inPartyIndex) {
        if (inPartyIndex < 0)
            return null;
        var ds = Game.player.data.party[inPartyIndex];
        return ds;
    };
    ProjectPlayer.getPlayerActorDSByActorID = function (actorID) {
        return ArrayUtils.matchAttributesD2(Game.player.data.party, "actor", { id: actorID }, true)[0];
    };
    ProjectPlayer.getPlayerActorDSByActor = function (actor) {
        return ArrayUtils.matchAttributes(Game.player.data.party, { actor: actor }, true)[0];
    };
    ProjectPlayer.getPlayerActorIndexByActor = function (actor) {
        var actorDS = this.getPlayerActorDSByActor(actor);
        if (actorDS)
            return Game.player.data.party.indexOf(actorDS);
        return -1;
    };
    ProjectPlayer.getPlayerActorFirstPositionByActorID = function (actorID) {
        var actorDS = ArrayUtils.matchAttributesD2(Game.player.data.party, "actor", { id: actorID }, true)[0];
        if (actorDS)
            return Game.player.data.party.indexOf(actorDS);
        return -1;
    };
    ProjectPlayer.initPlayerActor = function (inPartyIndex, isCreateActor) {
        if (isCreateActor === void 0) { isCreateActor = false; }
        var actorDS = Game.player.data.party[inPartyIndex];
        if (isCreateActor) {
            if (actorDS && !actorDS.actor.takeSetting) {
                actorDS.actor.skills.length = 0;
                actorDS.actor.equips.length = 0;
            }
        }
        if (actorDS && actorDS.actor.growUpEnabled) {
            actorDS.lv = Math.max(1, Math.min(actorDS.lv, actorDS.actor.MaxLv));
            var classData = GameData.getModuleData(7, actorDS.actor.class);
            for (var i = 0; i < classData.lvUpAutoGetSkills.length; i++) {
                var lvUpAutoGetSkill = classData.lvUpAutoGetSkills[i];
                if (actorDS.lv >= lvUpAutoGetSkill.lv) {
                    this.learnSkillBySkillID(inPartyIndex, lvUpAutoGetSkill.skill);
                }
            }
        }
        Game.refreshActorAttribute(actorDS.actor, actorDS.lv);
        actorDS.actor.hp = actorDS.actor.MaxHP;
        actorDS.actor.sp = actorDS.actor.MaxSP;
    };
    ProjectPlayer.addPlayerActorByActorID = function (actorID, lv, happenEvent) {
        if (lv === void 0) { lv = 1; }
        if (happenEvent === void 0) { happenEvent = true; }
        if (lv < 1)
            lv = 1;
        var newActor = GameData.newModuleData(6, actorID, true);
        var ds = new DataStructure_inPartyActor();
        ds.actor = newActor;
        ds.lv = Math.min(lv, newActor.MaxLv);
        return this.addPlayerActorByDS(ds, happenEvent, true);
    };
    ProjectPlayer.addPlayerActorByDS = function (actorDS, happenEvent, isCreateActor) {
        if (happenEvent === void 0) { happenEvent = true; }
        if (isCreateActor === void 0) { isCreateActor = true; }
        Game.player.data.party.push(actorDS);
        this.initPlayerActor(Game.player.data.party.length - 1, isCreateActor);
        if (happenEvent)
            EventUtils.happen(this, this.EVENT_ADD_PLAYER_ACTOR, [Game.player.data.party.length - 1, actorDS]);
        return actorDS;
    };
    ProjectPlayer.removePlayerActorByActorID = function (actorID, happenEvent) {
        if (happenEvent === void 0) { happenEvent = true; }
        var inPartyIndex = ProjectPlayer.getPlayerActorFirstPositionByActorID(actorID);
        if (inPartyIndex != -1) {
            return ProjectPlayer.removePlayerActorByInPartyIndex(inPartyIndex, happenEvent);
        }
    };
    ProjectPlayer.removePlayerActorByInPartyIndex = function (inPartyIndex, happenEvent) {
        if (happenEvent === void 0) { happenEvent = true; }
        if (inPartyIndex >= Game.player.data.party.length || inPartyIndex < 0)
            return null;
        var actorDS = Game.player.data.party.splice(inPartyIndex, 1)[0];
        if (happenEvent)
            EventUtils.happen(this, this.EVENT_REMOVE_PLAYER_ACTOR, [inPartyIndex, actorDS]);
        return actorDS;
    };
    ProjectPlayer.getPlayerActorSkillBySkillID = function (inPartyIndex, skillID) {
        var actorDS = this.getPlayerActorDSByActorID(inPartyIndex);
        if (actorDS)
            return ArrayUtils.matchAttributes(actorDS.actor.skills, { id: skillID }, true)[0];
    };
    ProjectPlayer.learnSkillBySkillID = function (inPartyIndex, skillID, happenEvent) {
        if (happenEvent === void 0) { happenEvent = true; }
        var actorDS = ProjectPlayer.getPlayerActorDSByInPartyIndex(inPartyIndex);
        if (!actorDS)
            return;
        var newSkill = Game.actorLearnSkill(actorDS.actor, skillID);
        if (newSkill && happenEvent)
            EventUtils.happen(this, this.EVENT_LEARN_PLAYER_ACTOR_SKILL, [inPartyIndex, actorDS, newSkill]);
        return newSkill;
    };
    ProjectPlayer.forgetSkillBySkillID = function (inPartyIndex, skillID, happenEvent) {
        if (happenEvent === void 0) { happenEvent = true; }
        var actorDS = ProjectPlayer.getPlayerActorDSByInPartyIndex(inPartyIndex);
        if (!actorDS)
            return;
        var forgetSkill = Game.actorForgetSkill(actorDS.actor, skillID);
        if (forgetSkill && happenEvent)
            EventUtils.happen(this, this.EVENT_FORGET_PLAYER_ACTOR_SKILL, [inPartyIndex, actorDS, forgetSkill]);
        return forgetSkill;
    };
    ProjectPlayer.forgetAllSkills = function (inPartyIndex, happenEvent) {
        if (happenEvent === void 0) { happenEvent = true; }
        var actorDS = ProjectPlayer.getPlayerActorDSByInPartyIndex(inPartyIndex);
        if (!actorDS)
            return;
        var forgetSkills = actorDS.actor.skills.concat();
        Game.actorForgetAllSkills(actorDS.actor, happenEvent);
        for (var i = 0; i < forgetSkills.length; i++) {
            if (happenEvent)
                EventUtils.happen(this, this.EVENT_FORGET_PLAYER_ACTOR_SKILL, [inPartyIndex, actorDS, forgetSkills[i]]);
        }
        return forgetSkills;
    };
    ProjectPlayer.getPlayerActorEquipByPartID = function (inPartyIndex, partID) {
        var actorDS = this.getPlayerActorDSByInPartyIndex(inPartyIndex);
        if (actorDS)
            return Game.getActorEquipByPartID(actorDS.actor, partID);
    };
    ProjectPlayer.wearPlayerActorEquip = function (inPartyIndex, newEquip, happenEvent) {
        if (happenEvent === void 0) { happenEvent = true; }
        if (newEquip) {
            var newEquipIndex = this.getEquipIndex(newEquip);
            if (newEquipIndex != null) {
                var actorDS = this.getPlayerActorDSByInPartyIndex(inPartyIndex);
                if (actorDS) {
                    var takeOffEquip = this.takeOffPlayerActorEquipByPartID(inPartyIndex, newEquip.partID, happenEvent);
                    Game.wearActorEquip(actorDS.actor, newEquip);
                    this.removePackageItemByItemDS(Game.player.data.package[newEquipIndex], 1, happenEvent);
                    if (newEquip.eventSetting && newEquip.wearEvent)
                        CommandPage.startTriggerFragmentEvent(newEquip.wearEvent, Game.player.sceneObject, Game.player.sceneObject);
                    if (happenEvent)
                        EventUtils.happen(Game, this.EVENT_WEAR_PLAYER_ACTOR_EQUIP, [inPartyIndex, actorDS, takeOffEquip, newEquip]);
                    return { success: true, takeOffEquip: takeOffEquip };
                }
            }
        }
        return { success: false, takeOffEquip: null };
    };
    ProjectPlayer.takeOffPlayerActorEquipByPartID = function (inPartyIndex, partID, happenEvent) {
        if (happenEvent === void 0) { happenEvent = true; }
        var actorDS = Game.player.data.party[inPartyIndex];
        if (!actorDS)
            return null;
        var takeOffEquip = Game.takeOffActorEquipByPartID(actorDS.actor, partID);
        if (takeOffEquip) {
            this.addEquipByInstance(takeOffEquip, happenEvent);
            if (takeOffEquip.eventSetting && takeOffEquip.takeOffEvent)
                CommandPage.startTriggerFragmentEvent(takeOffEquip.takeOffEvent, Game.player.sceneObject, Game.player.sceneObject);
            if (happenEvent)
                EventUtils.happen(Game, this.EVENT_TAKE_OFF_PLAYER_ACTOR_EQUIP, [inPartyIndex, actorDS, takeOffEquip]);
        }
        return takeOffEquip;
    };
    ProjectPlayer.takeOffPlayerActorAllEquips = function (inPartyIndex, happenEvent) {
        if (happenEvent === void 0) { happenEvent = true; }
        var actorDS = Game.player.data.party[inPartyIndex];
        if (!actorDS)
            return null;
        var takeOffEquips = Game.takeOffActorAllEquips(actorDS.actor);
        for (var i = 0; i < takeOffEquips.length; i++) {
            var takeOffEquip = takeOffEquips[i];
            this.addEquipByInstance(takeOffEquip, happenEvent);
            if (happenEvent)
                EventUtils.happen(Game, this.EVENT_TAKE_OFF_PLAYER_ACTOR_EQUIP, [inPartyIndex, actorDS, takeOffEquip]);
        }
        return takeOffEquips;
    };
    ProjectPlayer.increaseExpByIndex = function (inPartyIndex, exp) {
        var actorDS = ProjectPlayer.getPlayerActorDSByInPartyIndex(inPartyIndex);
        var actor = actorDS.actor;
        var classData = GameData.getModuleData(7, actor.class);
        if (!classData)
            return;
        if (actorDS.lv >= actor.MaxLv)
            return;
        if (!actor.growUpEnabled)
            return;
        var fromExp = actor.currentEXP;
        var fromLv = actorDS.lv;
        actor.currentEXP += exp;
        var isLevelUp = false;
        var learnSkills = [];
        while (1) {
            if (actorDS.lv >= actor.MaxLv)
                break;
            var nextExp = Game.getLevelUpNeedExp(actor, actorDS.lv);
            if (actor.currentEXP >= nextExp) {
                actorDS.lv++;
                isLevelUp = true;
                actor.currentEXP -= nextExp;
                for (var i = 0; i < classData.lvUpAutoGetSkills.length; i++) {
                    var lvUpAutoGetSkill = classData.lvUpAutoGetSkills[i];
                    if (actorDS.lv >= lvUpAutoGetSkill.lv) {
                        var learnSkill = this.learnSkillBySkillID(inPartyIndex, lvUpAutoGetSkill.skill);
                        if (learnSkill)
                            learnSkills.push(learnSkill);
                    }
                }
            }
            else {
                break;
            }
        }
        var toLv = actorDS.lv;
        var toExp = actor.currentEXP;
        return { isLevelUp: isLevelUp, fromLv: fromLv, toLv: toLv, fromExp: fromExp, toExp: toExp, learnSkills: learnSkills };
    };
    ProjectPlayer.removePackageItemByItemDS = function (itemDS, v, happenEvent) {
        if (happenEvent === void 0) { happenEvent = true; }
        var inPackageIdx = Game.player.data.package.indexOf(itemDS);
        if (inPackageIdx == -1)
            return;
        itemDS.number -= v;
        if (itemDS.number <= 0)
            Game.player.data.package.splice(inPackageIdx, 1);
        if (happenEvent)
            EventUtils.happen(ProjectPlayer, ProjectPlayer.EVENT_CHANGE_ITEM_NUMBER);
    };
    ProjectPlayer.EVENT_CHANGE_ITEM_NUMBER = "ProjectPlayerCHANGE_ITEM_NUMBER";
    ProjectPlayer.EVENT_CHANGE_GOLD_NUMBER = "ProjectPlayerCHANGE_GOLD_NUMBER";
    ProjectPlayer.EVENT_ADD_PLAYER_ACTOR = "ProjectPlayerEVENT_ADD_PLAYER_ACTOR";
    ProjectPlayer.EVENT_REMOVE_PLAYER_ACTOR = "ProjectPlayerEVENT_REMOVE_PLAYER_ACTOR";
    ProjectPlayer.EVENT_REMOVE_PLAYER_ACTOR_ITEM = "ProjectPlayerEVENT_REMOVE_PLAYER_ACTOR_ITEM";
    ProjectPlayer.EVENT_CARRY_PLAYER_ACTOR_ITEM = "ProjectPlayerEVENT_CARRY_PLAYER_ACTOR_ITEM";
    ProjectPlayer.EVENT_LEARN_PLAYER_ACTOR_SKILL = "ProjectPlayerEVENT_LEARN_PLAYER_ACTOR_SKILL";
    ProjectPlayer.EVENT_FORGET_PLAYER_ACTOR_SKILL = "ProjectPlayerEVENT_FORGET_PLAYER_ACTOR_SKILL";
    ProjectPlayer.EVENT_WEAR_PLAYER_ACTOR_EQUIP = "ProjectPlayerEVENT_WEAR_PLAYER_ACTOR_EQUIP";
    ProjectPlayer.EVENT_TAKE_OFF_PLAYER_ACTOR_EQUIP = "ProjectPlayerEVENT_TAKE_OFF_PLAYER_ACTOR_EQUIP";
    return ProjectPlayer;
}(ClientPlayer));
//# sourceMappingURL=ProjectPlayer.js.map