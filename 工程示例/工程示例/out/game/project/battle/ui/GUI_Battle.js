














var GUI_Battle = (function (_super) {
    __extends(GUI_Battle, _super);
    function GUI_Battle() {
        var _this_1 = _super.call(this) || this;
        _this_1._selectedPlayerBattlerIndex = -1;
        _this_1.battleSceneCaches = [];
        _this_1.background.image = "";
        _this_1.actorInfoList.on(UIList.ITEM_CREATE, _this_1, _this_1.onCreateActorPanelItem);
        _this_1.actorInfoList.mouseEnabled = true;
        EventUtils.addEventListenerFunction(GameBattleData, GameBattleData.EVENT_ADD_STATUS, _this_1.onAddStatus, _this_1);
        EventUtils.addEventListenerFunction(GameBattleData, GameBattleData.EVENT_REMOVE_STATUS, _this_1.onRemoveStatus, _this_1);
        return _this_1;
    }
    GUI_Battle.prototype.init = function () {
        this.background.image = GameBattle.enemyParty.background;
        this.initActorInfoList();
    };
    GUI_Battle.prototype.initActorInfoList = function () {
        var arr = [];
        for (var i = 0; i < Game.player.data.party.length; i++) {
            if (!GameBattle.playerBattlers[i]) {
                break;
            }
            var d = new ListItem_1025;
            d.data = Game.player.data.party[i];
            arr.push(d);
        }
        this.actorInfoList.items = arr;
    };
    GUI_Battle.prototype.createBattleScene = function (onFin, enemyParty) {
        var _this_1 = this;
        var onComplete = function () {
            _this_1.battlerRoot.addChild(_this_1.currentBattleScene.displayObject);
            _this_1.currentBattleScene.mapSupportPause = false;
            _this_1.currentBattleScene.startRender();
            onFin();
        };
        if (enemyParty.battlerBgType == 0) {
            if (!this.battleSceneCaches[0])
                this.battleSceneCaches[0] = this.createImageScene(Config.WINDOW_WIDTH, Config.WINDOW_HEIGHT, ProjectClientScene);
            this.currentBattleScene = this.battleSceneCaches[0];
            var bgLayer = this.currentBattleScene.getLayerByPreset(1);
            bgLayer.setBigImage(enemyParty.background);
            if (bgLayer['imgWidth'])
                bgLayer.scaleX = Config.WINDOW_WIDTH / bgLayer['imgWidth'];
            if (bgLayer['imgHeight'])
                bgLayer.scaleY = Config.WINDOW_HEIGHT / bgLayer['imgHeight'];
            bgLayer.dx = this.background.x;
            bgLayer.dy = this.background.y;
            bgLayer.visible = this.background.visible;
            bgLayer.alpha = this.background.alpha;
            this.battlerRoot.addChild(this.currentBattleScene.displayObject);
            onComplete.apply(this);
        }
        else {
            if (!this.battleSceneCaches[enemyParty.battleScene]) {
                ClientScene.createScene(enemyParty.battleScene, null, Callback.New(function (scene) {
                    _this_1.currentBattleScene = _this_1.battleSceneCaches[enemyParty.battleScene] = scene;
                    _this_1.battlerRoot.addChild(_this_1.currentBattleScene.displayObject);
                    onComplete.apply(_this_1);
                }, this), true);
            }
            else {
                this.currentBattleScene = this.battleSceneCaches[enemyParty.battleScene];
                this.battlerRoot.addChild(this.currentBattleScene.displayObject);
                onComplete.apply(this);
            }
        }
    };
    GUI_Battle.prototype.clearBattleScene = function () {
        if (this.currentBattleScene) {
            this.currentBattleScene.stopRender();
            this.battlerRoot.removeChild(this.currentBattleScene.displayObject);
        }
    };
    GUI_Battle.prototype.getRefEnemyBattlerUI = function (position) {
        return this["enemy" + position];
    };
    GUI_Battle.prototype.getEnemyPartyEmptyPostion = function () {
        for (var i = 0; i < 999; i++) {
            var inBattlefieldBattler = GameBattle.enemyBattlers[i];
            if (!inBattlefieldBattler) {
                var emptyBattler = this.getRefEnemyBattlerUI(i);
                if (emptyBattler)
                    return i;
            }
        }
        return -1;
    };
    GUI_Battle.prototype.getRefPlayerBattlerUI = function (position) {
        return this["playerActor" + position];
    };
    GUI_Battle.prototype.getPlayerPartyEmptyPostion = function () {
        for (var i = 0; i < 999; i++) {
            var inBattlefieldBattler = GameBattle.playerBattlers[i];
            if (!inBattlefieldBattler) {
                var emptyBattler = this.getRefEnemyBattlerUI(i);
                if (emptyBattler)
                    return i;
            }
        }
        return -1;
    };
    GUI_Battle.prototype.getPlayerBattler = function (position) {
        return this.getRefPlayerBattlerUI(position).data.battler;
    };
    Object.defineProperty(GUI_Battle.prototype, "selectedPlayerBattlerIndex", {
        get: function () {
            return this._selectedPlayerBattlerIndex;
        },
        set: function (v) {
            var lastSelectedPlayerBattle = this.selectedPlayerBattler;
            if (lastSelectedPlayerBattle) {
                GameCommand.startCommonCommand(14034, [], null, this.selectedPlayerBattler, this.selectedPlayerBattler);
            }
            this._selectedPlayerBattlerIndex = v;
            if (this.selectedPlayerBattler) {
                GameCommand.startCommonCommand(14033, [], null, this.selectedPlayerBattler, this.selectedPlayerBattler);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GUI_Battle.prototype, "selectedPlayerBattler", {
        get: function () {
            if (this._selectedPlayerBattlerIndex < 0)
                return null;
            return this.getPlayerBattler(this._selectedPlayerBattlerIndex);
        },
        set: function (battler) {
            this.selectedPlayerBattlerIndex = GameBattle.playerBattlers.indexOf(battler);
        },
        enumerable: false,
        configurable: true
    });
    GUI_Battle.prototype.refreshPlayerActorPanel = function () {
        for (var i = 0; i < Game.player.data.party.length; i++) {
            this.refreshActorPanel(i);
        }
    };
    GUI_Battle.prototype.refreshActorPanel = function (index, isFirstRefresh) {
        if (isFirstRefresh === void 0) { isFirstRefresh = false; }
        this.refreshActorBaseInfo(index);
        this.refreshActorStatusList(index);
    };
    GUI_Battle.prototype.refreshActorBaseInfo = function (inPartyIndex) {
        if (inPartyIndex < 0)
            return;
        var actorDS = Game.player.data.party[inPartyIndex];
        var actor = actorDS === null || actorDS === void 0 ? void 0 : actorDS.actor;
        if (!actor)
            return;
        var ui = this.actorInfoList.getItemUI(inPartyIndex);
        if (!ui)
            return;
        ui.hpText.text = actor.hp.toString();
        ui.spText.text = actor.sp.toString();
        ui.hpSlider.value = actor.hp * 100 / actor.MaxHP;
        ui.spSlider.value = actor.sp * 100 / actor.MaxSP;
        ui.actorName.text = actor.name;
        ui.actorLv.text = actorDS.lv.toString();
        ui.deadSign.visible = actor.dead;
        ui.actorFace.image = actor.face;
        ui.autoBattleBtn.visible = actor.AI;
    };
    GUI_Battle.prototype.refreshActorStatusList = function (inPartyIndex) {
        if (inPartyIndex < 0)
            return;
        var actorDS = Game.player.data.party[inPartyIndex];
        var actor = actorDS === null || actorDS === void 0 ? void 0 : actorDS.actor;
        if (!actor)
            return;
        var ui = this.actorInfoList.getItemUI(inPartyIndex);
        if (!ui)
            return;
        if (this.statusID > 0) {
            var showStatus = ArrayUtils.matchAttributes(actor.status, { id: this.statusID }, true);
            if (showStatus.length <= 0)
                this.onHideStatusTips();
        }
        var stArr = [];
        for (var i = 0; i < actor.status.length; i++) {
            var status = actor.status[i];
            if (!status.icon)
                continue;
            var d = new ListItem_1026;
            d.icon = status.icon;
            d.layer = status.currentLayer == 1 ? "" : status.currentLayer.toString();
            d.data = status;
            stArr.push(d);
        }
        ui.statusList.mouseEnabled = true;
        ui.statusList.off(UIList.ITEM_CREATE, this, this.onActorStatusCreate);
        ui.statusList.on(UIList.ITEM_CREATE, this, this.onActorStatusCreate);
        ui.statusList.items = stArr;
    };
    GUI_Battle.prototype.onCreateActorPanelItem = function (ui, data, index) {
        this.refreshActorPanel(index, true);
        ui.autoBattleBtn.commandInputMessage = [index];
    };
    GUI_Battle.prototype.onActorStatusCreate = function (ui, data, index) {
        ui.icon.on(EventObject.MOUSE_OVER, this, this.onShowStatusTips, [data.data]);
        ui.icon.on(EventObject.MOUSE_OUT, this, this.onHideStatusTips);
    };
    GUI_Battle.prototype.onShowStatusTips = function (status) {
        var tipsUI = GameUI.show(1033);
        tipsUI.tipsLabel.text = GUI_Manager.statusDesc(status);
        tipsUI.tipsLabel.height = tipsUI.tipsLabel.textHeight;
        tipsUI.tipsRoot.height = Math.max(tipsUI.tipsLabel.textHeight + 30 + tipsUI.tipsLabel.y, 80);
        tipsUI.x = stage.mouseX;
        tipsUI.y = stage.mouseY + 15;
        var maxWidth = Config.WINDOW_WIDTH - 5;
        if (tipsUI.x + tipsUI.tipsRoot.width > maxWidth)
            tipsUI.x = maxWidth - tipsUI.tipsRoot.width;
        var maxHeight = Config.WINDOW_HEIGHT - 15;
        if (tipsUI.y + tipsUI.tipsRoot.height > maxHeight)
            tipsUI.y = maxHeight - tipsUI.tipsRoot.height;
        this.statusID = status.id;
    };
    GUI_Battle.prototype.onHideStatusTips = function () {
        GameUI.hide(1033);
        this.statusID = 0;
    };
    GUI_Battle.prototype.onAddStatus = function (fromBattler, targetBattler) {
        var inPartyIndex = ProjectPlayer.getPlayerActorIndexByActor(targetBattler === null || targetBattler === void 0 ? void 0 : targetBattler.actor);
        this.refreshActorStatusList(inPartyIndex);
    };
    GUI_Battle.prototype.onRemoveStatus = function (targetBattler) {
        var inPartyIndex = ProjectPlayer.getPlayerActorIndexByActor(targetBattler === null || targetBattler === void 0 ? void 0 : targetBattler.actor);
        this.refreshActorStatusList(inPartyIndex);
    };
    GUI_Battle.prototype.createImageScene = function (width, height, classObj) {
        var scene = new classObj;
        scene["isSetScene"] = true;
        scene.id = 0;
        var mapData = {};
        mapData.width = width;
        mapData.height = height;
        mapData.dataLayers = [];
        mapData.LayerDatas = [{
                "dx": 0,
                "dy": 0,
                "scaleX": 1,
                "scaleY": 1,
                "skewX": 0,
                "skewY": 0,
                "xMove": 0,
                "yMove": 0,
                "prospectsPerX": 1,
                "prospectsPerY": 1,
                "xLoop": false,
                "yLoop": false,
                "opacity": 1,
                "blendMode": null,
                "drawMode": false,
                "tileData": [],
                "autoTileDataCache": [],
                "img": "",
                "showOnEditor": true,
                "rotation": 0,
                "modeType": false,
                "modeLock": false,
                "materialData": [
                    {
                        "materials": []
                    }
                ]
            }, { p: true }];
        scene.parse(mapData, Game["data"]);
        scene["install"](Callback.New(function () { }, scene));
        return scene;
    };
    return GUI_Battle;
}(GUI_21));
//# sourceMappingURL=GUI_Battle.js.map