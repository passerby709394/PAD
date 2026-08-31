














var GUI_BattlerStatus = (function (_super) {
    __extends(GUI_BattlerStatus, _super);
    function GUI_BattlerStatus() {
        var _this_1 = _super.call(this) || this;
        _this_1.on(EventObject.DISPLAY, _this_1, _this_1.onDisplay);
        return _this_1;
    }
    GUI_BattlerStatus.prototype.onDisplay = function () {
        this.refreshActorDataPanel();
        this.refreshStatus();
    };
    GUI_BattlerStatus.prototype.refreshActorDataPanel = function () {
        var battler = GameBattleController.currentOperationBattler;
        if (!battler)
            return;
        var selectedActor = battler.actor;
        var lv = GameBattleHelper.getLevelByActor(selectedActor);
        this.smallAvatar.avatarID = selectedActor.avatar;
        this.actorFace.image = selectedActor.face;
        this.actorName.text = selectedActor.name;
        var classData = GameData.getModuleData(7, selectedActor.class);
        this.actorClass.text = classData ? classData.name : "";
        this.classIcon.image = classData ? classData.icon : "";
        if (selectedActor.growUpEnabled) {
            this.LevelRoot.visible = true;
            var nextExp = Game.getLevelUpNeedExp(selectedActor, lv);
            this.actorExpSlider.value = selectedActor.currentEXP * 100 / nextExp;
        }
        else {
            this.LevelRoot.visible = false;
            this.actorExpSlider.value = 100;
        }
    };
    GUI_BattlerStatus.prototype.refreshStatus = function () {
        var battler = GameBattleController.currentOperationBattler;
        if (!battler)
            return;
        var selectedActor = battler.actor;
        var arr = [];
        for (var i = 0; i < selectedActor.status.length; i++) {
            var status = selectedActor.status[i];
            if (!status.icon)
                continue;
            var d = new ListItem_1028;
            d.icon = status.icon;
            d.tipsLabel = GUI_Manager.statusDesc(status);
            d.layer = status.currentLayer > 1 ? status.currentLayer.toString() : "";
            arr.push(d);
        }
        this.statusList.items = arr;
    };
    return GUI_BattlerStatus;
}(GUI_26));
//# sourceMappingURL=GUI_BattlerStatus.js.map