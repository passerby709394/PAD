














var GUI_BattleSkill = (function (_super) {
    __extends(GUI_BattleSkill, _super);
    function GUI_BattleSkill() {
        var _this_1 = _super.call(this) || this;
        GUI_Manager.standardList(_this_1.skillList, false);
        _this_1.on(EventObject.DISPLAY, _this_1, _this_1.onDisplay);
        _this_1.on(EventObject.UNDISPLAY, _this_1, _this_1.onUnDisplay);
        _this_1.skillList.on(EventObject.CHANGE, _this_1, _this_1.onActorSkillChange);
        _this_1.skillList.on(UIList.ITEM_CLICK, _this_1, _this_1.onSkillItemClick);
        _this_1.skillList.onCreateItem = Callback.New(_this_1.onCreateSkillItem, _this_1);
        return _this_1;
    }
    GUI_BattleSkill.prototype.onDisplay = function () {
        this.refreshSkillList();
        UIList.focus = this.skillList;
        this.refreshDescribe();
        EventUtils.addEventListenerFunction(Game, Game.EVENT_LEARN_SKILL, this.refreshSkillList, this);
        EventUtils.addEventListenerFunction(Game, Game.EVENT_FORGET_SKILL, this.refreshSkillList, this);
    };
    GUI_BattleSkill.prototype.onUnDisplay = function () {
        EventUtils.removeEventListenerFunction(Game, Game.EVENT_LEARN_SKILL, this.refreshSkillList, this);
        EventUtils.removeEventListenerFunction(Game, Game.EVENT_FORGET_SKILL, this.refreshSkillList, this);
    };
    GUI_BattleSkill.prototype.refreshSkillList = function () {
        var battler = GameBattleController.currentOperationBattler;
        if (!battler) {
            this.skillList.items = [];
            return;
        }
        var battlerActor = battler.actor;
        var arr = [];
        for (var i = 0; i < battlerActor.skills.length; i++) {
            var skill = battlerActor.skills[i];
            if (skill.skillType != 2) {
                if (!skill.icon)
                    continue;
                var d = new ListItem_1013;
                d.icon = skill.icon;
                d.skillName = skill.name;
                d.data = skill;
                arr.push(d);
            }
        }
        this.skillList.items = arr;
    };
    GUI_BattleSkill.prototype.onActorSkillChange = function () {
        this.refreshDescribe();
    };
    GUI_BattleSkill.prototype.onSkillItemClick = function () {
        var battler = GameBattleController.currentOperationBattler;
        var skill = this.skillList.selectedItem ? this.skillList.selectedItem.data : null;
        if (!battler || !skill)
            return;
        var useEnabled = WorldData.forceSendActionCommand ? skill.currentCD == 0 : GameBattleHelper.canUseOneSkill(battler, skill);
        if (!useEnabled) {
            GameAudio.playSE(WorldData.disalbeSE);
            return;
        }
        GameAudio.playSE(WorldData.sureSE);
        Callback.CallLaterBeforeRender(function () {
            GameCommand.startCommonCommand(15019);
            EventUtils.happen(GUI_BattleSkill, GUI_BattleSkill.EVENT_SELECT_SKILL, [skill]);
        }, this);
    };
    GUI_BattleSkill.prototype.onCreateSkillItem = function (ui, data, index) {
        var skill = data.data;
        ui.icon.visible = skill ? true : false;
        if (skill) {
            var battler = GameBattleController.currentOperationBattler;
            if (!battler)
                return;
            var useEnabled = WorldData.forceSendActionCommand ? skill.currentCD == 0 : GameBattleHelper.canUseOneSkill(battler, skill);
            if (!useEnabled) {
                if (WorldData.iconDisabledAni) {
                    var disabledAni = new GCAnimation;
                    disabledAni.id = WorldData.iconDisabledAni;
                    disabledAni.loop = true;
                    disabledAni.target = ui.icon;
                }
                else {
                    ui.icon.setTonal(0, 0, 0, 100);
                }
            }
            else {
                ui.icon.setTonal(0, 0, 0, 0);
            }
        }
    };
    GUI_BattleSkill.prototype.refreshDescribe = function () {
        var battler = GameBattleController.currentOperationBattler;
        var name = "";
        var desc = "";
        this.tipsUI.cdBox.visible = false;
        if (!(!battler || !this.skillList.selectedItem)) {
            if (UIList.focus == this.skillList) {
                var itemData = this.skillList.selectedItem;
                var skill = itemData.data;
                if (skill) {
                    name = skill.name;
                    desc = GUI_Manager.skillDesc(skill, battler.actor);
                    var showCD = skill.currentCD != 0;
                    this.tipsUI.cdBox.visible = showCD;
                    if (showCD) {
                        var cd = skill.currentCD;
                        this.tipsUI.cdText.text = "" + cd;
                        this.tipsUI.cdSlider.value = (skill.totalCD - skill.currentCD) * 100 / skill.totalCD;
                    }
                }
            }
        }
        this.tipsUI.descName.text = name;
        this.tipsUI.descText.text = desc;
        this.tipsUI.descText.height = this.tipsUI.descText.textHeight;
        this.tipsUI.descTextBox.refresh();
    };
    GUI_BattleSkill.EVENT_SELECT_SKILL = "GUI_BattleSkillEVENT_SELECT_SKILL";
    return GUI_BattleSkill;
}(GUI_24));
//# sourceMappingURL=GUI_BattleSkill.js.map