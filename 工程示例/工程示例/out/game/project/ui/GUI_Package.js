














var GUI_Package = (function (_super) {
    __extends(GUI_Package, _super);
    function GUI_Package() {
        var _this_1 = _super.call(this) || this;
        _this_1.itemNameInitColor = _this_1.itemName.color;
        GUI_Manager.standardList(_this_1.list, false);
        GUI_Manager.standardList(_this_1.actorList, false);
        _this_1.on(EventObject.DISPLAY, _this_1, _this_1.onDisplay);
        _this_1.list.on(EventObject.CHANGE, _this_1, _this_1.refreshItemInfo);
        _this_1.list.on(UIList.ITEM_CLICK, _this_1, _this_1.onItemClick);
        _this_1.list.on(UIList.ITEM_CREATE, _this_1, _this_1.onItemCreate);
        EventUtils.addEventListenerFunction(ProjectPlayer, ProjectPlayer.EVENT_CHANGE_ITEM_NUMBER, _this_1.onItemChange, _this_1);
        _this_1.list.on(UIList.ITEM_CREATE, _this_1, _this_1.onCreateItemUI);
        _this_1.actorList.on(UIList.ITEM_CLICK, _this_1, _this_1.onActorItemClick);
        return _this_1;
    }
    Object.defineProperty(GUI_Package.prototype, "actorList", {
        get: function () {
            return this.targetUI.actorList;
        },
        enumerable: false,
        configurable: true
    });
    GUI_Package.prototype.onDisplay = function () {
        UIList.focus = this.list;
        this.refreshItems(0);
        this.refreshItemInfo();
    };
    GUI_Package.prototype.onCreateItemUI = function (ui, data, index) {
        var itemDS = data.data;
        if (!itemDS)
            ui.alpha = 0;
        if (itemDS && (!(!itemDS.isEquip && itemDS.item.isUse) || itemDS.item.useType == 2)) {
            ui.itemName.alpha = ui.icon.alpha = ui.itemNum.alpha = 0.2;
        }
    };
    GUI_Package.prototype.onItemChange = function () {
        Callback.CallLaterBeforeRender(this.refreshItems, this, [0]);
    };
    GUI_Package.prototype.onItemCreate = function (ui, data, index) {
        var itemDS = data.data;
        if (itemDS && itemDS.isEquip) {
            ui.itemName.color = GUI_Manager.getEquipNameColorByInstance(itemDS.equip);
        }
    };
    GUI_Package.prototype.onItemClick = function () {
        var _this_1 = this;
        if (this.useItemLock)
            return;
        var selectedItem = this.list.selectedItem;
        if (selectedItem && selectedItem.data) {
            var itemDS_1 = selectedItem.data;
            if (itemDS_1.isEquip) {
                GameAudio.playSE(WorldData.disalbeSE);
                return;
            }
            var item = itemDS_1.item;
            if (item.isUse && item.useType != 2 && itemDS_1.number > 0) {
                if (item.isSingleTarget) {
                    this.startSelectTarget(function () { _this_1.onUseItem(itemDS_1); });
                }
                else {
                    this.onUseItem(itemDS_1);
                }
            }
            else {
                GameAudio.playSE(WorldData.disalbeSE);
                return;
            }
        }
    };
    GUI_Package.prototype.onUseItem = function (itemDS) {
        var _this_1 = this;
        if (itemDS.number <= 0) {
            GameAudio.playSE(WorldData.disalbeSE);
            return;
        }
        var item = itemDS.item;
        var targetActorDS;
        var targetActor;
        if (item.isSingleTarget) {
            targetActorDS = ProjectPlayer.getPlayerActorDSByInPartyIndex(this.actorList.selectedIndex);
            targetActor = targetActorDS.actor;
            if ((item.applyDeadBattler && !targetActor.dead) || (!item.applyDeadBattler && targetActor.dead)) {
                GameAudio.playSE(WorldData.disalbeSE);
                return;
            }
            if (!targetActor.dead && !item.applyDeadBattler) {
                if ((item.recoveryHP > 0 && item.recoverySP > 0 && targetActor.hp == targetActor.MaxHP && targetActor.sp == targetActor.MaxSP) ||
                    (item.recoveryHP > 0 && item.recoverySP == 0 && targetActor.hp == targetActor.MaxHP) ||
                    (item.recoveryHP == 0 && item.recoverySP > 0 && targetActor.sp == targetActor.MaxSP)) {
                    GameAudio.playSE(WorldData.disalbeSE);
                    return;
                }
            }
        }
        this.useItemLock = true;
        if (item.se)
            GameAudio.playSE(item.se);
        var trigger = CommandPage.startTriggerFragmentEvent(item.callEvent, Game.player.sceneObject, Game.player.sceneObject, Callback.New(function () {
            if (item.isSingleTarget) {
                if (item.applyDeadBattler && item.recoveryHP > 0 && targetActor.dead) {
                    targetActor.dead = false;
                }
                if (!targetActor.dead) {
                    targetActor.hp += item.recoveryHP;
                    targetActor.sp += item.recoverySP;
                }
                Game.refreshActorAttribute(targetActor, targetActorDS.lv);
            }
            _this_1.targetUI.refreshTargetPanel();
            _this_1.useItemLock = false;
        }, this));
        if (!trigger)
            this.useItemLock = false;
        if (item.isConsumables)
            ProjectPlayer.changeItemNumber(item.id, -1, false);
    };
    GUI_Package.prototype.onActorItemClick = function () {
        GUI_Package.actorSelectedIndex = this.actorList.selectedIndex;
        this.onSelectTargetUseItem.apply(this);
    };
    GUI_Package.prototype.startSelectTarget = function (onSelectTargetUseItem) {
        GameAudio.playSE(WorldData.sureSE);
        this.targetUI.visible = true;
        this.targetUI.refreshTargetPanel();
        UIList.focus = this.actorList;
        this.onSelectTargetUseItem = onSelectTargetUseItem;
    };
    GUI_Package.prototype.refreshItems = function (state) {
        if (state != 0)
            return;
        var arr = [];
        for (var i = 0; i < Game.player.data.package.length; i++) {
            var d = new ListItem_1002;
            var itemDS = Game.player.data.package[i];
            d.data = itemDS;
            if (itemDS.isEquip) {
                d.icon = itemDS.equip.icon;
                d.itemName = itemDS.equip.name;
            }
            else {
                d.icon = itemDS.item.icon;
                d.itemName = itemDS.item.name;
            }
            d.itemNum = "x" + itemDS.number.toString();
            arr.push(d);
        }
        if (Game.player.data.package.length == 0) {
            var emptyItem = new ListItem_1002;
            emptyItem.icon = "";
            emptyItem.itemName = "";
            emptyItem.itemNum = "";
            arr.push(emptyItem);
        }
        arr.sort(function (aListItem, bListItem) {
            var a = aListItem.data;
            var b = bListItem.data;
            if (!a || !b)
                return -1;
            if (a.isEquip != b.isEquip) {
                return a.isEquip ? 1 : -1;
            }
            else if (!a.isEquip) {
                if (a.item.isUse != b.item.isUse) {
                    return a.item.isUse ? -1 : 1;
                }
                else if (a.item.useType != b.item.useType) {
                    return a.item.useType != 2 ? -1 : 1;
                }
                else {
                    return a.item.id < b.item.id ? -1 : 1;
                }
            }
            else {
                return a.equip.id < b.equip.id ? -1 : 1;
            }
        });
        this.list.items = arr;
    };
    GUI_Package.prototype.refreshItemInfo = function () {
        var selectedItem = this.list.selectedItem;
        this.itemName.color = this.itemNameInitColor;
        if (!selectedItem || !selectedItem.data) {
            this.itemName.text = "";
            this.itemIntro.text = "";
        }
        else {
            var itemDS = selectedItem.data;
            if (itemDS.isEquip) {
                this.itemName.text = itemDS.equip.name;
                this.itemIntro.text = GUI_Manager.equipDesc(itemDS.equip);
                this.itemName.color = GUI_Manager.getEquipNameColorByInstance(itemDS.equip);
            }
            else {
                this.itemName.text = itemDS.item.name;
                this.itemIntro.text = itemDS.item.intro;
            }
        }
        this.itemIntro.height = this.itemIntro.textHeight;
        this.itemIntroRoot.refresh();
    };
    return GUI_Package;
}(GUI_4));
//# sourceMappingURL=GUI_Package.js.map