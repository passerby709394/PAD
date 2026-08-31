














var GUI_Party = (function (_super) {
    __extends(GUI_Party, _super);
    function GUI_Party() {
        var _this_1 = _super.call(this) || this;
        _this_1.descNameInitColor = _this_1.descName.color;
        _this_1.on(EventObject.DISPLAY, _this_1, _this_1.onDisplay);
        _this_1.actorList.on(EventObject.CHANGE, _this_1, _this_1.onActorListChange);
        _this_1.actorList.on(UIList.ITEM_CLICK, _this_1, _this_1.onActorItemClick);
        GUI_Manager.standardList(_this_1.actorList);
        GUI_Manager.standardList(_this_1.actorEquipList);
        GUI_Manager.standardList(_this_1.equipPackageList, false);
        GUI_Manager.standardList(_this_1.actorSkillList, false);
        GUI_Manager.standardList(_this_1.targetUI.actorList, false);
        _this_1.actorPanelTab.on(EventObject.CHANGE, _this_1, _this_1.onActorPanelTabChange);
        _this_1.actorList.on(UIList.ITEM_CREATE, _this_1, _this_1.onCreateActorItem);
        _this_1.actorSkillList.on(UIList.ITEM_CREATE, _this_1, _this_1.onCreateActorSkillItem);
        _this_1.equipPackageList.on(UIList.ITEM_CREATE, _this_1, _this_1.onCreateEquipPackageItem);
        _this_1.actorSkillList.on(EventObject.CHANGE, _this_1, _this_1.onActorSkillChange);
        _this_1.actorSkillList.on(UIList.ITEM_CLICK, _this_1, _this_1.onActorSkillClick);
        _this_1.actorEquipList.on(EventObject.CHANGE, _this_1, _this_1.onActorEquipChange);
        _this_1.actorEquipList.on(UIList.ITEM_CLICK, _this_1, _this_1.onActorEquipItemClick);
        _this_1.equipPackageList.on(EventObject.CHANGE, _this_1, _this_1.onEquipPackageChage);
        _this_1.equipPackageList.on(UIList.ITEM_CLICK, _this_1, _this_1.onEquipPackageItemClick);
        _this_1.targetUI.actorList.on(UIList.ITEM_CLICK, _this_1, _this_1.onTargetActorItemClick);
        _this_1.ai.on(EventObject.CHANGE, _this_1, _this_1.onChangeActorAI);
        stage.on(EventObject.KEY_DOWN, _this_1, _this_1.onKeyDown);
        GUI_Manager.regHitAreaFocusList(_this_1.actorPanel, _this_1.actorList, true, FocusButtonsManager.closeFocus);
        GUI_Manager.regHitAreaFocusList(_this_1.skillPanel, _this_1.actorSkillList);
        GUI_Manager.regHitAreaFocusList(_this_1.actorEquipPanel, _this_1.actorEquipList);
        GUI_Manager.regHitAreaFocusList(_this_1.equipPackagePanel, _this_1.equipPackageList, false);
        EventUtils.addEventListenerFunction(UIList, UIList.EVENT_FOCUS_CHANGE, _this_1.onListFocusChange, _this_1);
        EventUtils.addEventListenerFunction(Game, Game.EVENT_LEARN_SKILL, _this_1.refreshActorSkillPanel, _this_1);
        EventUtils.addEventListenerFunction(Game, Game.EVENT_FORGET_SKILL, _this_1.refreshActorSkillPanel, _this_1);
        return _this_1;
    }
    Object.defineProperty(GUI_Party, "skillSelectedActorIndex", {
        get: function () {
            var partyUI = GameUI.get(16);
            if (partyUI)
                return partyUI.targetUI.actorList.selectedIndex;
            return 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GUI_Party, "skillActorIndex", {
        get: function () {
            var partyUI = GameUI.get(16);
            if (partyUI)
                return partyUI.actorList.selectedIndex;
            return 0;
        },
        enumerable: false,
        configurable: true
    });
    GUI_Party.onBack = function () {
        var uiParty = GameUI.get(16);
        if (UIList.focus == uiParty.actorList) {
            return true;
        }
        else if (UIList.focus == uiParty.targetUI.actorList) {
            UIList.focus = uiParty.actorSkillList;
            return false;
        }
        else if (UIList.focus == uiParty.equipPackageList) {
            UIList.focus = uiParty.actorEquipList;
            uiParty.refreshPreEquipChangeInfo();
        }
        else if (UIList.focus != uiParty.actorList) {
            FocusButtonsManager.closeFocus();
            UIList.focus = uiParty.actorList;
        }
        uiParty.refreshDescribe();
        return false;
    };
    GUI_Party.dissolutionPartyActor = function () {
        var uiParty = GameUI.get(16);
        if (!uiParty)
            return;
        if (!uiParty.selectedActorDS)
            return;
        if (Game.player.data.party.length == 1 || !uiParty.selectedActorDS.dissolutionEnabled) {
            GameAudio.playSE(WorldData.disalbeSE);
            return;
        }
        GameAudio.playSE(WorldData.sureSE);
        ProjectPlayer.removePlayerActorByInPartyIndex(uiParty.actorList.selectedIndex);
        uiParty.refreshActorList();
        FocusButtonsManager.closeFocus();
        UIList.focus = uiParty.actorList;
    };
    GUI_Party.prototype.onKeyDown = function (e) {
        if (!this.stage)
            return;
        if (GUI_Setting.IS_KEY(e.keyCode, GUI_Setting.KEY_BOARD.L1)) {
            this.actorPanelTab.selectedIndex = Math.max(this.actorPanelTab.selectedIndex - 1, 0);
        }
        else if (GUI_Setting.IS_KEY(e.keyCode, GUI_Setting.KEY_BOARD.R1)) {
            this.actorPanelTab.selectedIndex = Math.min(this.actorPanelTab.length - 1, this.actorPanelTab.selectedIndex + 1);
        }
    };
    GUI_Party.prototype.onListFocusChange = function (lastFocus, currentFocus) {
        if (this.stage) {
            if (UIList.focus != this.targetUI.actorList) {
                this.targetUI.visible = false;
            }
            this.refreshFocusBarVisible();
            this.refreshPreEquipChangeInfo();
            this.refreshDescribe();
            if (UIList.focus == this.actorList) {
                FocusButtonsManager.closeFocus();
            }
        }
    };
    GUI_Party.prototype.isCanUsedInMenuSkill = function (skill) {
        if (!skill)
            return false;
        var actor = this.selectedActorDS.actor;
        return !actor.dead &&
            (skill.skillType != 2 && [0, 1, 3, 5].indexOf(skill.targetType) != -1 && skill.canUsedInMenu && skill.useDamage)
            && skill.costSP <= actor.sp && skill.costHP < actor.hp &&
            (skill.damageType == 3 || skill.damageType == 4);
    };
    GUI_Party.prototype.onActorListChange = function (state) {
        if (state != 0)
            return;
        this.refreshActorPanels(true);
    };
    GUI_Party.prototype.onActorItemClick = function () {
        this.refreshOperactionActorFocus();
    };
    GUI_Party.prototype.onActorPanelTabChange = function () {
        if (WorldData.selectSE)
            GameAudio.playSE(WorldData.selectSE);
        this.refreshOperactionActorFocus();
    };
    GUI_Party.prototype.refreshOperactionActorFocus = function () {
        if (this.actorPanelTab.selectedIndex == 0) {
            UIList.focus = this.actorSkillList;
        }
        else if (this.actorPanelTab.selectedIndex == 1) {
            UIList.focus = this.actorEquipList;
        }
        else if (this.actorPanelTab.selectedIndex == 2) {
            UIList.focus = null;
            if (this.actorPanelTab.onChangeFragEvent)
                CommandPage.startTriggerFragmentEvent(this.actorPanelTab.onChangeFragEvent, Game.player.sceneObject, Game.player.sceneObject);
        }
        this.refreshDescribe();
    };
    GUI_Party.prototype.refreshFocusBarVisible = function () {
        this.actorSkillList.selectedImage.visible = UIList.focus == this.actorSkillList;
        this.actorEquipList.selectedImage.visible = UIList.focus == this.actorEquipList || UIList.focus == this.equipPackageList;
        this.equipPackageList.selectedImage.visible = UIList.focus == this.equipPackageList;
    };
    Object.defineProperty(GUI_Party.prototype, "selectedActorDS", {
        get: function () {
            var d = this.actorList.selectedItem;
            if (!d)
                return;
            var actorDS = d.data;
            if (!actorDS)
                return;
            return actorDS;
        },
        enumerable: false,
        configurable: true
    });
    GUI_Party.prototype.onDisplay = function () {
        this.refreshActorList();
        UIList.focus = this.actorList;
        this.refreshDescribe();
        this.attributeChangeBox.visible = false;
        this.refreshFocusBarVisible();
    };
    GUI_Party.prototype.onCreateActorItem = function (ui, data, index) {
        var actorDS = data.data;
        if (actorDS) {
            ui.ai.visible = actorDS.actor.AI ? true : false;
            ui.deadSign.visible = actorDS.actor.dead ? true : false;
        }
    };
    GUI_Party.prototype.refreshActorList = function () {
        var arr = [];
        for (var i = 0; i < Game.player.data.party.length; i++) {
            var actorDS = Game.player.data.party[i];
            var actor = actorDS.actor;
            var d = new ListItem_1011;
            d.face = actor.face;
            d.data = actorDS;
            arr.push(d);
        }
        this.actorList.items = arr;
    };
    GUI_Party.prototype.refreshActorPanels = function (needRefreshPlayerPackage) {
        var d = this.actorList.selectedItem;
        if (!d)
            return;
        var actorDS = d.data;
        if (!actorDS)
            return;
        Game.refreshActorAttribute(actorDS.actor, actorDS.lv);
        this.refreshActorDataPanel();
        this.refreshActorSkillPanel();
        this.refreshActorEquips();
        this.refreshActorSetting();
        if (needRefreshPlayerPackage) {
            this.refreshEquipPackageList();
        }
    };
    GUI_Party.prototype.refreshActorDataPanel = function () {
        var selectedActorDS = this.selectedActorDS;
        if (!selectedActorDS)
            return;
        var selectedActor = selectedActorDS.actor;
        this.actorBattler.avatarID = selectedActor.bttlerAvatar;
        this.actorName.text = selectedActor.name;
        this.smallAvatar.avatarID = selectedActor.avatar;
        var classData = GameData.getModuleData(7, selectedActor.class);
        this.actorClass.text = classData ? classData.name : "";
        this.classIcon.image = classData ? classData.icon : "";
        if (selectedActor.growUpEnabled) {
            this.LevelRoot.visible = true;
            var nextExp = Game.getLevelUpNeedExp(selectedActor, selectedActorDS.lv);
            this.actorExpSlider.value = selectedActor.currentEXP * 100 / nextExp;
        }
        else {
            this.LevelRoot.visible = false;
            this.actorExpSlider.value = 100;
        }
    };
    GUI_Party.prototype.onCreateActorSkillItem = function (ui, data, index) {
        var skill = data.data;
        if (!skill)
            return;
        ui.icon.alpha = this.isCanUsedInMenuSkill(skill) ? 1 : 0.3;
    };
    GUI_Party.prototype.refreshActorSkillPanel = function () {
        var selectedActorDS = this.selectedActorDS;
        if (!selectedActorDS)
            return;
        var arr = [];
        for (var i = 0; i < selectedActorDS.actor.skills.length; i++) {
            var skill = selectedActorDS.actor.skills[i];
            if (!skill.icon)
                continue;
            var d = new ListItem_1013;
            d.data = skill;
            d.icon = skill.icon;
            d.skillName = skill.name;
            arr.push(d);
        }
        this.actorSkillList.items = arr;
    };
    GUI_Party.prototype.onActorSkillChange = function () {
        this.refreshDescribe();
    };
    GUI_Party.prototype.onActorSkillClick = function () {
        if (!this.actorSkillList.selectedItem)
            return;
        var skill = this.actorSkillList.selectedItem.data;
        if (!this.isCanUsedInMenuSkill(skill)) {
            GameAudio.playSE(WorldData.disalbeSE);
            return;
        }
        if (!(skill.targetType == 0 || skill.targetType == 3)) {
            this.startSelectTarget();
        }
        else {
            this.onUseSkill();
        }
    };
    GUI_Party.prototype.startSelectTarget = function () {
        GameAudio.playSE(WorldData.sureSE);
        this.targetUI.visible = true;
        this.targetUI.refreshTargetPanel();
        UIList.focus = this.targetUI.actorList;
    };
    GUI_Party.prototype.onTargetActorItemClick = function () {
        this.onUseSkill();
    };
    GUI_Party.prototype.onUseSkill = function () {
        var _a;
        var skill = (_a = this.actorSkillList.selectedItem) === null || _a === void 0 ? void 0 : _a.data;
        if (!skill)
            return;
        if (!this.isCanUsedInMenuSkill(skill)) {
            GameAudio.playSE(WorldData.disalbeSE);
            return;
        }
        var fromActorDS = this.selectedActorDS;
        var restoreHP = skill.damageType == 3 ? skill.damageValue : 0;
        var restoreSP = skill.damageType == 4 ? skill.damageValue : 0;
        if (skill.useAddition) {
            var actorAttributeValue = skill.additionMultipleType == 0 ? fromActorDS.actor.ATK : fromActorDS.actor.MAG;
            var addDamageValue = skill.additionMultiple / 100 * actorAttributeValue;
            restoreHP += addDamageValue;
            restoreSP += addDamageValue;
        }
        if (skill.targetType == 0) {
            if ((skill.applyDeadBattler && !fromActorDS.actor.dead) || (!skill.applyDeadBattler && fromActorDS.actor.dead)) {
                GameAudio.playSE(WorldData.disalbeSE);
                return;
            }
            if (skill.useEvent)
                CommandPage.startTriggerFragmentEvent(skill.useEvent, Game.player.sceneObject, Game.player.sceneObject);
            this.useSkillOnOneTarget(skill, fromActorDS, restoreHP, restoreSP);
        }
        else if (skill.targetType == 1 || skill.targetType == 5) {
            var targetActorDS = ProjectPlayer.getPlayerActorDSByInPartyIndex(this.targetUI.actorList.selectedIndex);
            if ((skill.applyDeadBattler && !targetActorDS.actor.dead) || (!skill.applyDeadBattler && targetActorDS.actor.dead)) {
                GameAudio.playSE(WorldData.disalbeSE);
                return;
            }
            if (skill.useEvent)
                CommandPage.startTriggerFragmentEvent(skill.useEvent, Game.player.sceneObject, Game.player.sceneObject);
            this.useSkillOnOneTarget(skill, targetActorDS, restoreHP, restoreSP);
            if (skill.targetType == 5 && skill.targetNum > 1) {
                var partyClone = Game.player.data.party.concat();
                ArrayUtils.remove(partyClone, targetActorDS);
                for (var i = 0; i < partyClone.length; i++) {
                    if ((skill.applyDeadBattler && !partyClone[i].actor.dead) || (!skill.applyDeadBattler && partyClone[i].actor.dead)) {
                        partyClone.splice(i, 1);
                        i--;
                    }
                }
                partyClone.sort(function (a, b) {
                    if (skill.damageType == 3)
                        return (a.actor.hp / a.actor.MaxHP) < (b.actor.hp / b.actor.MaxHP) ? -1 : 1;
                    else
                        return (a.actor.sp / a.actor.MaxSP) < (b.actor.sp / b.actor.MaxSP) ? -1 : 1;
                });
                for (var i = 0; i < skill.targetNum - 1; i++) {
                    var targetActorDS_1 = partyClone[i];
                    if (!targetActorDS_1)
                        break;
                    this.useSkillOnOneTarget(skill, targetActorDS_1, restoreHP, restoreSP);
                }
            }
        }
        else if (skill.targetType == 3) {
            var used = false;
            for (var i = 0, k = 0; i < Game.player.data.party.length; i++) {
                var targetActorDS = ProjectPlayer.getPlayerActorDSByInPartyIndex(i);
                if ((skill.applyDeadBattler && targetActorDS.actor.dead) || (!skill.applyDeadBattler && !targetActorDS.actor.dead)) {
                    if (skill.useEvent && k == 0) {
                        k++;
                        CommandPage.startTriggerFragmentEvent(skill.useEvent, Game.player.sceneObject, Game.player.sceneObject);
                    }
                    this.useSkillOnOneTarget(skill, targetActorDS, restoreHP, restoreSP);
                    used = true;
                }
            }
            if (!used) {
                GameAudio.playSE(WorldData.disalbeSE);
                return;
            }
        }
        if (skill.menuSE)
            GameAudio.playSE(skill.menuSE);
        fromActorDS.actor.sp -= skill.costSP;
        fromActorDS.actor.hp -= skill.costHP;
        Game.refreshActorAttribute(fromActorDS.actor, fromActorDS.lv);
        this.refreshActorPanels(false);
        this.targetUI.refreshTargetPanel();
        if (skill.applyDeadBattler)
            this.refreshActorList();
    };
    GUI_Party.prototype.useSkillOnOneTarget = function (skill, targetActorDS, restoreHP, restoreSP) {
        if (!targetActorDS || !skill)
            return;
        if (skill.applyDeadBattler && restoreHP > 0 && targetActorDS.actor.dead) {
            targetActorDS.actor.dead = false;
        }
        if (!targetActorDS.actor.dead) {
            targetActorDS.actor.hp += restoreHP;
            targetActorDS.actor.sp += restoreSP;
        }
        if (skill.menuHitAnimation) {
            var targetInPartyIndex = Game.player.data.party.indexOf(targetActorDS);
            if (targetInPartyIndex != -1) {
                var targetItemUI = this.targetUI.actorList.getItemUI(targetInPartyIndex);
                var ani_1 = new GCAnimation();
                ani_1.id = skill.menuHitAnimation;
                var lx = targetItemUI.actorFace.width / 2;
                var ly = targetItemUI.actorFace.height / 2;
                var globalPos = targetItemUI.actorFace.localToGlobal(new Point(lx, ly));
                var localPos = this.targetUI.globalToLocal(globalPos);
                ani_1.x = localPos.x;
                ani_1.y = localPos.y;
                this.targetUI.addChild(ani_1);
                ani_1.once(GCAnimation.PLAY_COMPLETED, this, function () {
                    ani_1.dispose();
                });
                ani_1.play();
            }
        }
        if (skill.hitEvent)
            CommandPage.startTriggerFragmentEvent(skill.hitEvent, Game.player.sceneObject, Game.player.sceneObject);
        Game.refreshActorAttribute(targetActorDS.actor, targetActorDS.lv);
    };
    GUI_Party.prototype.onCreateEquipPackageItem = function (ui, data, index) {
        var equipDS = data.data;
        if (equipDS) {
            ui.unequipBtn.visible = false;
            ui.equipBox.visible = true;
            ui.itemName.color = GUI_Manager.getEquipNameColorByInstance(equipDS.equip);
        }
        else {
            ui.unequipBtn.visible = true;
            ui.equipBox.visible = false;
        }
    };
    GUI_Party.prototype.refreshActorEquips = function () {
        var selectedActorDS = this.selectedActorDS;
        if (!selectedActorDS)
            return;
        var arr = [];
        var lastSelectedIndex = this.actorEquipList.selectedIndex;
        if (lastSelectedIndex == -1)
            lastSelectedIndex = 0;
        var equipPartsLength = GameData.getLength(19, 1);
        for (var i = 1; i <= equipPartsLength; i++) {
            var equip = Game.getActorEquipByPartID(selectedActorDS.actor, i);
            var d = new ListItem_1012;
            if (equip) {
                d.data = equip;
                d.icon = equip.icon;
            }
            else {
                d.icon = "";
            }
            d.partName = GameData.getModuleData(19, i).name;
            arr.push(d);
        }
        this.actorEquipList.items = arr;
        this.actorEquipList.selectedIndex = lastSelectedIndex;
    };
    GUI_Party.prototype.refreshEquipPackageList = function () {
        var selectedActorDS = this.selectedActorDS;
        if (!selectedActorDS)
            return;
        var equipSelectIndex = this.actorEquipList.selectedIndex;
        if (equipSelectIndex < 0)
            return;
        var partID = equipSelectIndex + 1;
        var allEquips = ArrayUtils.matchAttributes(Game.player.data.package, { isEquip: true }, false);
        var partEquips = ArrayUtils.matchAttributesD2(allEquips, "equip", { partID: partID }, false);
        var classID = selectedActorDS.actor.class;
        var classData = GameData.getModuleData(7, classID);
        if (!classData)
            return;
        for (var i = 0; i < partEquips.length; i++) {
            if (classData.equipSetting.indexOf(partEquips[i].equip.type) == -1) {
                partEquips.splice(i, 1);
                i--;
            }
        }
        var items = [new ListItem_1014];
        for (var i = 0; i < partEquips.length; i++) {
            var d = new ListItem_1014;
            var packageEquip = partEquips[i];
            d.data = packageEquip;
            d.itemName = packageEquip.equip.name;
            d.icon = packageEquip.equip.icon;
            d.itemNum = "x" + packageEquip.number;
            items.push(d);
        }
        this.equipPackageList.items = items;
    };
    GUI_Party.prototype.onActorEquipChange = function () {
        this.refreshEquipPackageList();
        this.refreshDescribe();
    };
    GUI_Party.prototype.onActorEquipItemClick = function () {
        UIList.focus = this.equipPackageList;
        this.refreshDescribe();
        this.refreshPreEquipChangeInfo();
    };
    GUI_Party.prototype.onEquipPackageChage = function () {
        this.refreshDescribe();
        this.refreshPreEquipChangeInfo();
    };
    GUI_Party.prototype.onEquipPackageItemClick = function () {
        var selectedActorDS = this.selectedActorDS;
        var actor = selectedActorDS.actor;
        var index = this.equipPackageList.selectedIndex;
        var actorInPartyIndex = this.actorList.selectedIndex;
        var equipPartID = this.actorEquipList.selectedIndex + 1;
        if (index == 0) {
            var takeOffEuqip = ProjectPlayer.takeOffPlayerActorEquipByPartID(actorInPartyIndex, equipPartID);
            if (takeOffEuqip)
                GameAudio.playSE(ClientWorld.data.unequipSE);
            else
                GameAudio.playSE(ClientWorld.data.disalbeSE);
        }
        else {
            var res = void 0;
            var itemData = this.equipPackageList.selectedItem;
            var equipDS = itemData.data;
            if (equipDS && equipDS.equip) {
                var equip = equipDS.equip;
                res = ProjectPlayer.wearPlayerActorEquip(actorInPartyIndex, equip);
            }
            if (res.success)
                GameAudio.playSE(ClientWorld.data.equipSE);
            else
                GameAudio.playSE(ClientWorld.data.disalbeSE);
        }
        Game.refreshActorAttribute(actor, selectedActorDS.lv);
        this.refreshActorDataPanel();
        this.refreshActorEquips();
        this.refreshEquipPackageList();
        UIList.focus = this.actorEquipList;
        this.refreshPreEquipChangeInfo();
        this.refreshDescribe();
    };
    GUI_Party.prototype.refreshPreEquipChangeInfo = function () {
        if (UIList.focus == this.equipPackageList) {
            var actor = this.selectedActorDS.actor;
            this.attributeChangeBox.visible = true;
            var previewChangeEquipDS = this.equipPackageList.selectedItem.data;
            var previewChangeEquip = previewChangeEquipDS ? previewChangeEquipDS.equip : null;
            var previewChangeEquipIndex = this.actorEquipList.selectedIndex;
            var previewChangeEquipID = previewChangeEquipIndex + 1;
            CustomGameNumber.attributeRes = Game.clacActorAttribute(actor, this.selectedActorDS.lv, 2, previewChangeEquipID, previewChangeEquip);
            this.setEquipChangePreviewAttributeLabel(this.MaxHP2, actor.MaxHP, CustomGameNumber.attributeRes.MaxHP);
            this.setEquipChangePreviewAttributeLabel(this.MaxSP2, actor.MaxSP, CustomGameNumber.attributeRes.MaxSP);
            this.setEquipChangePreviewAttributeLabel(this.ATK2, actor.ATK, CustomGameNumber.attributeRes.ATK);
            this.setEquipChangePreviewAttributeLabel(this.DEF2, actor.DEF, CustomGameNumber.attributeRes.DEF);
            this.setEquipChangePreviewAttributeLabel(this.MAG2, actor.MAG, CustomGameNumber.attributeRes.MAG);
            this.setEquipChangePreviewAttributeLabel(this.MagDef2, actor.MagDef, CustomGameNumber.attributeRes.MagDef);
            this.setEquipChangePreviewAttributeLabel(this.HIT2, actor.HIT, CustomGameNumber.attributeRes.HIT);
            this.setEquipChangePreviewAttributeLabel(this.DOD2, actor.DOD, CustomGameNumber.attributeRes.DOD);
            this.setEquipChangePreviewAttributeLabel(this.CRIT2, actor.CRIT, CustomGameNumber.attributeRes.CRIT);
            this.setEquipChangePreviewAttributeLabel(this.MagCrit2, actor.MagCrit, CustomGameNumber.attributeRes.MagCrit);
            this.setEquipChangePreviewAttributeLabel(this.ActionSpeed2, actor.ActionSpeed, CustomGameNumber.attributeRes.ActionSpeed);
            for (var i = 1; i <= actor.extendAttributes.length; i++) {
                var attributeStr = this["E" + i];
                if (attributeStr)
                    this.setEquipChangePreviewAttributeLabel(attributeStr, actor.extendAttributes[i], CustomGameNumber.attributeRes.extendAttributes[i]);
            }
        }
        else {
            this.attributeChangeBox.visible = false;
        }
    };
    GUI_Party.prototype.setEquipChangePreviewAttributeLabel = function (attributeStr, value, toValue) {
        if (value == toValue) {
            attributeStr.visible = false;
        }
        else {
            attributeStr.visible = true;
            if (toValue > value) {
                attributeStr.color = this.increaseColor.color;
            }
            else {
                attributeStr.color = this.reduceColor.color;
            }
        }
    };
    GUI_Party.prototype.refreshActorSetting = function () {
        var selectedActorDS = this.selectedActorDS;
        if (!selectedActorDS)
            return;
        this.ai.selected = selectedActorDS.actor.AI;
        this.dissolutionBox.visible = this.dissolutionBtn.visible = selectedActorDS.dissolutionEnabled;
    };
    GUI_Party.prototype.onChangeActorAI = function () {
        var selectedActorDS = this.selectedActorDS;
        if (!selectedActorDS)
            return;
        selectedActorDS.actor.AI = this.ai.selected;
        var actorItemUI = this.actorList.getItemUI(this.actorList.selectedIndex);
        this.onCreateActorItem(actorItemUI, this.actorList.selectedItem, this.actorList.selectedIndex);
    };
    GUI_Party.prototype.refreshDescribe = function () {
        var _a;
        var name = "";
        var desc = "";
        this.descName.color = this.descNameInitColor;
        if (UIList.focus == this.actorSkillList) {
            var itemData = this.actorSkillList.selectedItem;
            var skill = itemData === null || itemData === void 0 ? void 0 : itemData.data;
            if (skill) {
                name = skill.name;
                desc = GUI_Manager.skillDesc(skill, this.selectedActorDS.actor);
            }
        }
        else if (UIList.focus == this.actorEquipList) {
            var equip = (_a = this.actorEquipList.selectedItem) === null || _a === void 0 ? void 0 : _a.data;
            if (equip) {
                name = equip.name;
                desc = GUI_Manager.equipDesc(equip);
                this.descName.color = GUI_Manager.getEquipNameColorByInstance(equip);
            }
        }
        else if (UIList.focus == this.equipPackageList) {
            var itemData = this.equipPackageList.selectedItem;
            var equipDS = itemData === null || itemData === void 0 ? void 0 : itemData.data;
            if (equipDS && equipDS.equip) {
                var equip = equipDS.equip;
                name = equip.name;
                desc = GUI_Manager.equipDesc(equip);
                this.descName.color = GUI_Manager.getEquipNameColorByInstance(equip);
            }
        }
        this.descName.text = name;
        this.descText.text = desc;
        this.descText.height = this.descText.textHeight;
        this.descRoot.refresh();
    };
    return GUI_Party;
}(GUI_16));
//# sourceMappingURL=GUI_Party.js.map