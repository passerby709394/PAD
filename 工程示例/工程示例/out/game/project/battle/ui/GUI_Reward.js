














var GUI_Reward = (function (_super) {
    __extends(GUI_Reward, _super);
    function GUI_Reward() {
        var _this_1 = _super.call(this) || this;
        _this_1.getExpAnimationTask = "getExpAnimationTask";
        _this_1.on(EventObject.DISPLAY, _this_1, _this_1.onDisplay);
        _this_1.dropItemList.on(UIList.ITEM_CREATE, _this_1, _this_1.onCreateDropItemListDisplayItem);
        _this_1.actorList.on(UIList.ITEM_CREATE, _this_1, _this_1.onCreateActorItem);
        return _this_1;
    }
    GUI_Reward.prototype.onDisplay = function () {
        this.skillBlock.visible = false;
        this.taskShowGetItems();
        this.taskShowGetExp();
        this.taskShowLearnSkills();
        this.taskCloseUI();
    };
    GUI_Reward.prototype.onCreateActorItem = function (ui, data, index) {
        var actorDS = Game.player.data.party[index];
        var battler = GameBattle.playerBattlers[index];
        ui.deadSign.visible = battler.isDead;
    };
    GUI_Reward.prototype.onCreateDropItemListDisplayItem = function (ui, data, index) {
        var goodsInfo = data.data;
        var isEquip = goodsInfo[0];
        ui.itemNumLabel.visible = !isEquip;
        ui.itemNum.visible = !isEquip;
    };
    GUI_Reward.prototype.taskShowGetItems = function () {
        var _this_1 = this;
        this.getExp.text = GameBattleData.rewardRecord.exp.toString();
        this.getGold.text = GameBattleData.rewardRecord.gold.toString();
        var dropItems = GameBattleData.rewardRecord.items;
        var dropEquips = GameBattleData.rewardRecord.equips;
        if (dropItems.length == 0 && dropEquips.length == 0) {
            this.dropItemList.items = [];
            return;
        }
        var arr = [];
        for (var i = 0; i < dropItems.length; i++) {
            var dropItemInfo = dropItems[i];
            var dropItem = GameData.getModuleData(1, dropItemInfo.itemID);
            var d = new ListItem_1029;
            d.data = [false, dropItem];
            d.icon = dropItem.icon;
            d.itemNum = dropItemInfo.num.toString();
            arr.push(d);
        }
        for (var i = 0; i < dropEquips.length; i++) {
            var dropEquip = dropEquips[i];
            var d = new ListItem_1029;
            d.data = [true, dropEquip];
            d.icon = dropEquip.icon;
            d.itemNum = "1";
            arr.push(d);
        }
        this.dropItemList.items = arr;
        new SyncTask(this.getExpAnimationTask, function () {
            SyncTask.taskOver(_this_1.getExpAnimationTask);
        });
    };
    GUI_Reward.prototype.taskShowGetExp = function () {
        var _this_1 = this;
        var arr = [];
        var actorIncreaseExpRes;
        for (var i = 0; i < Game.player.data.party.length; i++) {
            if (!GameBattle.playerBattlers[i])
                break;
            var actorDS = Game.player.data.party[i];
            var actor = actorDS.actor;
            var actorClass = GameData.getModuleData(7, actor.class);
            actorIncreaseExpRes = GUI_Reward.increaseExpResArr[i];
            var d = new ListItem_1032;
            d.actorFace = actor.face;
            d.actorName = actor.name;
            d.classIcon = actorClass === null || actorClass === void 0 ? void 0 : actorClass.icon;
            arr.push(d);
        }
        this.actorList.items = arr;
        new SyncTask(this.getExpAnimationTask);
        var actorIncreaseExpAnimationCount = 0;
        for (var i = 0; i < Game.player.data.party.length; i++) {
            if (!GameBattle.playerBattlers[i])
                break;
            var singleActorTask = "increaseActorExpTask" + i;
            var actorDS = Game.player.data.party[i];
            var actor = actorDS.actor;
            actorIncreaseExpRes = GUI_Reward.increaseExpResArr[i];
            var actorUI = this.actorList.getItemUI(i);
            if (!actor.growUpEnabled) {
                actorUI.lvBox.visible = false;
                actorUI.actorExp.text = "";
                actorUI.expSlider.value = 100;
                continue;
            }
            if (!actorIncreaseExpRes) {
                var needExp = Game.getLevelUpNeedExp(actor, actorDS.lv);
                actorUI.lvBox.visible = true;
                actorUI.actorLv.text = actorDS.lv.toString();
                actorUI.actorExp.text = actor.currentEXP + "/" + needExp;
                actorUI.expSlider.value = actor.currentEXP * 100 / needExp;
                continue;
            }
            actorIncreaseExpAnimationCount++;
            for (var lv = actorIncreaseExpRes.fromLv; lv <= actorIncreaseExpRes.toLv; lv++) {
                var thisLvStartExp = void 0;
                if (lv == actorIncreaseExpRes.fromLv) {
                    thisLvStartExp = actorIncreaseExpRes.fromExp;
                }
                else {
                    thisLvStartExp = 0;
                }
                var thisLvEndExp = void 0;
                var thisLvNeedExp = Game.getLevelUpNeedExp(actor, lv);
                if (lv == actorIncreaseExpRes.toLv) {
                    thisLvEndExp = actorIncreaseExpRes.toExp;
                }
                else {
                    thisLvEndExp = thisLvNeedExp;
                }
                new SyncTask(singleActorTask, function (singleActorTask, actorIndex, lv, thisLvStartExp, thisLvEndExp, thisLvNeedExp) {
                    var actorDS = Game.player.data.party[actorIndex];
                    var actor = actorDS.actor;
                    var actorClass = GameData.getModuleData(7, actor.class);
                    var actorIncreaseExpRes = GUI_Reward.increaseExpResArr[actorIndex];
                    var actorUI = _this_1.actorList.getItemUI(actorIndex);
                    var battler = GameBattle.playerBattlers[actorIndex];
                    actorUI.actorLv.text = lv.toString();
                    actorUI.expSlider.value = thisLvStartExp * 100 / thisLvNeedExp;
                    var toValue = thisLvEndExp * 100 / thisLvNeedExp;
                    if (lv != actorIncreaseExpRes.fromLv) {
                        battler.playAnimation(44, false, true);
                        if (actor.levelUpEvent)
                            CommandPage.startTriggerFragmentEvent(actor.levelUpEvent, battler, battler);
                        if (actorClass && actorClass.levelUpEvent)
                            CommandPage.startTriggerFragmentEvent(actorClass.levelUpEvent, battler, battler);
                    }
                    Tween.to(actorUI.expSlider, { value: toValue }, 1000, null, Callback.New(function () {
                        SyncTask.taskOver(singleActorTask);
                    }, _this_1));
                    var _currentExp = thisLvStartExp;
                    var expTextObj = {
                        get value() {
                            return _currentExp;
                        },
                        set value(v) {
                            _currentExp = v;
                            actorUI.actorExp.text = Math.floor(v) + "/" + thisLvNeedExp;
                        }
                    };
                    Tween.to(expTextObj, { value: thisLvEndExp }, 1000);
                }, [singleActorTask, i, lv, thisLvStartExp, thisLvEndExp, thisLvNeedExp]);
            }
            new SyncTask(singleActorTask, function (singleActorTask) {
                SyncTask.taskOver(singleActorTask);
                actorIncreaseExpAnimationCount--;
                if (actorIncreaseExpAnimationCount == 0) {
                    SyncTask.taskOver(_this_1.getExpAnimationTask);
                }
            }, [singleActorTask]);
        }
        if (actorIncreaseExpAnimationCount == 0) {
            SyncTask.taskOver(this.getExpAnimationTask);
        }
    };
    GUI_Reward.prototype.taskShowLearnSkills = function () {
        var _this_1 = this;
        for (var i = 0; i < Game.player.data.party.length; i++) {
            if (!GameBattle.playerBattlers[i])
                break;
            new SyncTask(this.getExpAnimationTask, function (i) {
                var actorDS = Game.player.data.party[i];
                var actor = actorDS.actor;
                var actorIncreaseExpRes = GUI_Reward.increaseExpResArr[i];
                if (actorIncreaseExpRes) {
                    var learnSkills = actorIncreaseExpRes.learnSkills;
                    if (learnSkills.length != 0) {
                        _this_1.skillBlock.visible = true;
                        _this_1.learnSkillActorFace.image = actor.face;
                        _this_1.learnSkillText.text = "" + WorldData.word_learnSkill;
                        var arr = [];
                        for (var i_3 = 0; i_3 < learnSkills.length; i_3++) {
                            var learnSkill = learnSkills[i_3];
                            var d = new ListItem_1030;
                            d.data = learnSkill;
                            d.icon = learnSkill.icon;
                            arr.push(d);
                        }
                        _this_1.learnSkillList.items = arr;
                        setTimeout(function () {
                            _this_1.skillBlock.visible = false;
                            setTimeout(function () {
                                SyncTask.taskOver(_this_1.getExpAnimationTask);
                            }, 200);
                        }, 1500);
                        return;
                    }
                }
                _this_1.learnSkillList.items = [];
                SyncTask.taskOver(_this_1.getExpAnimationTask);
            }, [i]);
        }
    };
    GUI_Reward.prototype.taskCloseUI = function () {
        var _this_1 = this;
        new SyncTask(this.getExpAnimationTask, function () {
            setTimeout(function () {
                SyncTask.taskOver(_this_1.getExpAnimationTask);
                GameUI.hide(_this_1.guiID);
            }, WorldData.battleRewardStayTime * 1000);
        });
    };
    return GUI_Reward;
}(GUI_27));
//# sourceMappingURL=GUI_Reward.js.map