














var GUI_BattleItem = (function (_super) {
    __extends(GUI_BattleItem, _super);
    function GUI_BattleItem() {
        var _this_1 = _super.call(this) || this;
        GUI_Manager.standardList(_this_1.itemList);
        _this_1.on(EventObject.DISPLAY, _this_1, _this_1.onDisplay);
        _this_1.on(EventObject.UNDISPLAY, _this_1, _this_1.onUnDisplay);
        _this_1.itemList.on(EventObject.CHANGE, _this_1, _this_1.onActorItemChange);
        _this_1.itemList.on(UIList.ITEM_CLICK, _this_1, _this_1.onItemUIItemClick);
        _this_1.itemList.onCreateItem = Callback.New(_this_1.onCreateItemUIItem, _this_1);
        return _this_1;
    }
    GUI_BattleItem.prototype.onDisplay = function () {
        this.refreshItemList();
        UIList.focus = this.itemList;
        this.refreshDescribe();
        EventUtils.addEventListenerFunction(ProjectPlayer, ProjectPlayer.EVENT_CHANGE_ITEM_NUMBER, this.refreshItemList, this);
    };
    GUI_BattleItem.prototype.onUnDisplay = function () {
        EventUtils.removeEventListenerFunction(ProjectPlayer, ProjectPlayer.EVENT_CHANGE_ITEM_NUMBER, this.refreshItemList, this);
    };
    GUI_BattleItem.prototype.refreshItemList = function () {
        var battler = GameBattleController.currentOperationBattler;
        if (!battler || Game.player.data.package.length == 0) {
            this.itemList.items = [];
            return;
        }
        var arr = [];
        for (var i = 0; i < Game.player.data.package.length; i++) {
            var itemDS = Game.player.data.package[i];
            if (itemDS.isEquip)
                continue;
            var item = itemDS.item;
            if (item && item.isUse && item.useType != 1) {
                var d = new ListItem_1031;
                d.icon = item.icon;
                d.itemName = item.name;
                d.data = item;
                d.itemNum = itemDS.number == 1 ? "" : ("x" + itemDS.number.toString());
                arr.push(d);
            }
        }
        this.itemList.items = arr;
    };
    GUI_BattleItem.prototype.onActorItemChange = function () {
        this.refreshDescribe();
    };
    GUI_BattleItem.prototype.onItemUIItemClick = function () {
        var battler = GameBattleController.currentOperationBattler;
        var item = this.itemList.selectedItem ? this.itemList.selectedItem.data : null;
        if (!battler || !item)
            return;
        Callback.CallLaterBeforeRender(function () {
            GameCommand.startCommonCommand(15022);
            EventUtils.happen(GUI_BattleItem, GUI_BattleItem.EVENT_SELECT_ITEM, [item]);
        }, this);
    };
    GUI_BattleItem.prototype.onCreateItemUIItem = function (ui, data, index) {
        var item = data.data;
        ui.itemNum.visible = ui.icon.visible = item ? true : false;
    };
    GUI_BattleItem.prototype.refreshDescribe = function () {
        this.tipsUI.cdBox.visible = false;
        var battler = GameBattleController.currentOperationBattler;
        var name = "";
        var desc = "";
        if (!(!battler || !this.itemList.selectedItem)) {
            if (UIList.focus == this.itemList) {
                var itemData = this.itemList.selectedItem;
                var item = itemData.data;
                if (item) {
                    name = item.name;
                    desc = GUI_Manager.itemDesc(item);
                }
            }
        }
        this.tipsUI.descName.text = name;
        this.tipsUI.descText.text = desc;
        this.tipsUI.descText.height = this.tipsUI.descText.textHeight;
        this.tipsUI.descTextBox.refresh();
    };
    GUI_BattleItem.EVENT_SELECT_ITEM = "GUI_BattleItemEVENT_SELECT_ITEM";
    return GUI_BattleItem;
}(GUI_25));
//# sourceMappingURL=GUI_BattleItem.js.map