var GameBattle = (function () {
    function GameBattle() {
    }
    GameBattle.getEnemyActors = function () {
        var arr = [];
        for (var i = 0; i < this.enemyBattlers.length; i++) {
            var enemyBattler = this.enemyBattlers[i];
            if (enemyBattler)
                arr.push(enemyBattler.actor);
        }
        return arr;
    };
    GameBattle.init = function (cp) {
        this.setting = cp;
        this.enemyParty = GameData.getModuleData(11, cp.useVar ? Game.player.variable.getVariable(cp.enemyPartyVarID) : cp.enemyParty);
        GameBattle.state = 1;
        GameBattleController.init();
        GameBattleAI.init();
        GameBattleAction.init();
        this.resultIsWin = false;
        this.resultIsGameOver = false;
        this.inTurnStage = 0;
        this.battleRound = 0;
        EventUtils.addEventListenerFunction(GameUI, GameUI.EVENT_OPEN_SYSTEM_UI, this.onBattleUIOpen, this, [], true);
    };
    GameBattle.start = function () {
        var _this_1 = this;
        new SyncTask(GameBattle.battleStartTask, function () {
            EventUtils.happen(GameBattle, GameBattle.EVENT_BATTLE_START);
            var battleStage0_inBattle = _this_1.enemyParty.eventSetting ? _this_1.enemyParty.battleStage0_inBattle : null;
            CommandPage.startTriggerFragmentEvent(battleStage0_inBattle, Game.player.sceneObject, Game.player.sceneObject, Callback.New(function () {
                if (!_this_1.nextStepCB)
                    _this_1.nextStepCB = Callback.New(_this_1.nextStep, _this_1);
                GameBattle.state = 2;
                GameBattleController.start();
                GameBattleAI.start();
                GameBattleAction.start();
                _this_1.nextStep();
                SyncTask.taskOver(GameBattle.battleStartTask);
            }, _this_1));
        });
    };
    GameBattle.stop = function (onFin) {
        GameBattle.state = 0;
        GameBattleController.stop();
        GameBattleAI.stop();
        GameBattleAction.stop();
        if (!GameBattle.resultIsGameOver) {
            GameBattle.resetActorParty();
            GameBattle.clearBattlefield();
            onFin();
        }
    };
    GameBattle.nextStep = function () {
        var _this_1 = this;
        this.battlerfieldDetermineHandle(function () {
            _this_1.playerControlEnabled = false;
            var currentInTurnStage = _this_1.inTurnStage++;
            if (_this_1.inTurnStage > 3)
                _this_1.inTurnStage = 0;
            if (currentInTurnStage == 0) {
                _this_1.newTurnStep();
            }
            else if (currentInTurnStage == 1) {
                _this_1.playerControlStep();
            }
            else if (currentInTurnStage == 2) {
                _this_1.battlerActionStep();
            }
            else {
                _this_1.settlementStep();
            }
            _this_1.battleUI.refreshPlayerActorPanel();
        });
    };
    GameBattle.newTurnStep = function () {
        var _this_1 = this;
        this.battleRound++;
        GameBattleData.forwardAllBattlersSkillCDAndStatusTime(this.battleRound);
        EventUtils.happen(GameBattle, GameBattle.EVENT_BATTLE_NEW_TURN);
        if (this.enemyParty.battleStage1_newTurn) {
            var battleStage1_newTurn = this.enemyParty.eventSetting ? this.enemyParty.battleStage1_newTurn : null;
            CommandPage.startTriggerFragmentEvent(battleStage1_newTurn, Game.player.sceneObject, Game.player.sceneObject, Callback.New(function () {
                _this_1.battlerfieldDetermineHandle(function () {
                    GameCommand.startCommonCommand(14024, [], Callback.New(_this_1.nextStep, _this_1), Game.player.sceneObject, Game.player.sceneObject);
                });
            }, this));
        }
        else {
            GameCommand.startCommonCommand(14024, [], Callback.New(this.nextStep, this), Game.player.sceneObject, Game.player.sceneObject);
        }
    };
    GameBattle.playerControlStep = function () {
        this.nextPlayerBattlerControl();
    };
    GameBattle.battlerActionStep = function () {
        var _this_1 = this;
        EventUtils.happen(GameBattle, GameBattle.EVENT_BATTLE_BEFORE_ACTION);
        if (this.enemyParty.battleStage2_beforeAction) {
            var battleStage2_beforeAction = this.enemyParty.eventSetting ? this.enemyParty.battleStage2_beforeAction : null;
            CommandPage.startTriggerFragmentEvent(battleStage2_beforeAction, Game.player.sceneObject, Game.player.sceneObject, Callback.New(function () {
                _this_1.battlerfieldDetermineHandle(function () {
                    GameCommand.startCommonCommand(14025, [], Callback.New(_this_1.battlersAction, _this_1), Game.player.sceneObject, Game.player.sceneObject);
                });
            }, this));
        }
        else {
            GameCommand.startCommonCommand(14025, [], Callback.New(this.battlersAction, this), Game.player.sceneObject, Game.player.sceneObject);
        }
    };
    GameBattle.settlementStep = function () {
        var _this_1 = this;
        GameBattle.battleUI.actionText.text = "";
        EventUtils.happen(GameBattle, GameBattle.EVENT_BATTLE_SETTLEMENT);
        GameCommand.startCommonCommand(14026, [], Callback.New(function () {
            _this_1.battlerfieldDetermineHandle(function () {
                GameBattleAction.calcBattlersStatus(_this_1.nextStepCB);
            });
        }, this), Game.player.sceneObject, Game.player.sceneObject);
    };
    GameBattle.lastPlayerBattlerControl = function () {
        for (var i = GameBattle.playerBattlers.length - 1; i >= 0; i--) {
            var battler = GameBattle.playerBattlers[i];
            if (battler.actor.AI || !battler.commandControlComplete || (!WorldData.forceSendActionCommand && !GameBattleHelper.canAction(battler)))
                continue;
            battler.commandControlComplete = false;
            break;
        }
        this.nextPlayerBattlerControl();
    };
    GameBattle.nextPlayerBattlerControl = function () {
        var nextPlayerControlBattler = GameBattleHelper.nextPlayerControlBattler;
        if (nextPlayerControlBattler) {
            this.playerControlEnabled = true;
            this.battleUI.selectedPlayerBattler = nextPlayerControlBattler;
            GameBattleController.openBattlerMenu(nextPlayerControlBattler);
        }
        else {
            this.battleUI.selectedPlayerBattler = null;
            this.nextStep();
        }
    };
    GameBattle.battlersAction = function () {
        var _this_1 = this;
        var taskName = "battlersActionTask";
        SyncTask.clear(taskName);
        var allBattler = GameBattleHelper.allBattlers;
        allBattler.sort(function (a, b) {
            return a.actor.ActionSpeed > b.actor.ActionSpeed ? -1 : 1;
        });
        for (var i = 0; i < allBattler.length; i++) {
            var battler = allBattler[i];
            if (battler.actor.AI || battler.isEnemy) {
                new SyncTask(taskName, function (battler) {
                    if (!battler.inScene) {
                        taskOver.apply(_this_1);
                        return;
                    }
                    GameBattleAI.action(battler, Callback.New(function () {
                        taskOver.apply(_this_1);
                    }, _this_1));
                }, [battler]);
            }
            else {
                new SyncTask(taskName, function (battler) {
                    GameBattleAction.doAction(battler, Callback.New(function () {
                        if (!battler.inScene) {
                            taskOver.apply(_this_1);
                            return;
                        }
                        taskOver.apply(_this_1);
                    }, _this_1));
                }, [battler]);
            }
        }
        new SyncTask(taskName, function () {
            SyncTask.taskOver(taskName);
            _this_1.nextStep();
        });
        function taskOver() {
            setTimeout(function () {
                SyncTask.taskOver(taskName);
            }, WorldData.battlerActionOverTime * 1000);
        }
    };
    GameBattle.battlerfieldDetermineHandle = function (onFin, onBattlerOver) {
        var _this_1 = this;
        if (onBattlerOver === void 0) { onBattlerOver = null; }
        if (GameBattle.state == 0 || GameBattle.state == 3)
            return;
        var allBattlers = GameBattleHelper.allBattlers;
        var allBattlersCount = allBattlers.length;
        if (allBattlersCount > 0) {
            for (var i = 0; i < allBattlers.length; i++) {
                var battler = allBattlers[i];
                this.checkBattlerIsDead(battler, function () {
                    allBattlersCount--;
                    if (allBattlersCount == 0) {
                        var isComplete = GameBattle.checkBattleIsComplete();
                        if (!isComplete)
                            onFin.apply(_this_1);
                        else
                            onBattlerOver && onBattlerOver.apply(_this_1);
                    }
                });
            }
        }
        else {
            var isComplete = GameBattle.checkBattleIsComplete();
            if (!isComplete)
                onFin.apply(this);
            else
                onBattlerOver && onBattlerOver.apply(this);
        }
    };
    GameBattle.checkBattlerIsDead = function (battler, onFin) {
        var _this_1 = this;
        var onComplete = function () {
            if (!battler.isEnemy) {
                var inPartyIndex = ProjectPlayer.getPlayerActorIndexByActor(battler.actor);
                if (inPartyIndex >= 0)
                    GameBattle.battleUI.refreshActorPanel(inPartyIndex);
            }
            onFin.apply(_this_1);
        };
        if (!battler.isDead && battler.actor.hp == 0) {
            var getResurrectionHealthPer = GameBattleHelper.getResurrectionHealthPer(battler);
            if (getResurrectionHealthPer != null) {
                var hpValue_1 = MathUtils.int(battler.actor.MaxHP * getResurrectionHealthPer * 0.01);
                if (hpValue_1 > 0) {
                    GameBattleData.removeAllStatus(battler, true);
                    setTimeout(function () {
                        GameBattleData.changeBattlerHP(battler, hpValue_1);
                        GameBattleAction.showDamage(battler, 3, hpValue_1, false);
                        onComplete.apply(_this_1);
                    }, 500);
                    return;
                }
            }
            var needRemoveEnemy_1 = battler.isEnemy && this.setting.removeDeadBattler;
            this.deadEventSign++;
            SyncTask.taskOver(GameBattle.battleOverTask);
            new SyncTask(GameBattle.battleOverTask, function (deadEventSign) {
                GameBattleAction.releaseAction(battler, 7, Number.MAX_VALUE, null, function () {
                    battler.avatar.currentFrame = battler.avatar.totalFrame;
                    battler.autoPlayEnable = false;
                    if (needRemoveEnemy_1) {
                        EventUtils.happen(GameBattle, GameBattle.EVENT_BATTLE_BATTLER_DEAD_LEAVE_START, [battler]);
                        GameCommand.startCommonCommand(14028, [], Callback.New(function () {
                            EventUtils.happen(GameBattle, GameBattle.EVENT_BATTLE_BATTLER_DEAD_LEAVE_OVER, [battler]);
                            if (deadEventSign == _this_1.deadEventSign)
                                SyncTask.taskOver(GameBattle.battleOverTask);
                        }, _this_1), battler, battler);
                    }
                    else {
                        if (deadEventSign == _this_1.deadEventSign)
                            SyncTask.taskOver(GameBattle.battleOverTask);
                    }
                }, 2);
            }, [this.deadEventSign]);
            GameBattleData.dead(battler);
            if (needRemoveEnemy_1) {
                var enemyBattlerIndex = this.enemyBattlers.indexOf(battler);
                this.enemyBattlers[enemyBattlerIndex] = null;
                this.removedEnemyBattlers.push(battler);
            }
            onComplete.apply(this);
        }
        else {
            if (!battler.isDead && battler.avatar.actionID == 7) {
                battler.avatar.actionID = 1;
                battler.autoPlayEnable = true;
                GameBattleAction.moveBack(battler, function () {
                    onComplete.apply(_this_1);
                });
                return;
            }
            onComplete.apply(this);
        }
    };
    GameBattle.getBattleCompleteState = function () {
        if (ArrayUtils.matchAttributes(this.playerBattlers, { isDead: true }, false).length == this.playerBattlers.length) {
            return 2;
        }
        var realEnemys = GameBattleHelper.getNotNullBattlers(this.enemyBattlers);
        if (realEnemys.length == 0) {
            return 1;
        }
        if (ArrayUtils.matchAttributes(realEnemys, { isDead: true }, false).length == realEnemys.length) {
            return 1;
        }
        return 0;
    };
    GameBattle.checkBattleIsComplete = function () {
        var _this_1 = this;
        if (GameBattle.state == 0 || GameBattle.state == 3)
            return true;
        var battleOverState = this.getBattleCompleteState();
        var isBattleOver = battleOverState != 0;
        if (isBattleOver) {
            GameBattle.state = 3;
            var isWin = battleOverState == 1;
            GameBattle.resultIsWin = isWin;
            GameBattle.resultIsGameOver = !isWin;
            if (GameBattle.setting.battleFailHandleType == 1) {
                GameBattle.resultIsGameOver = false;
            }
            setTimeout(function () {
                _this_1.calcReward(Callback.New(function () {
                    var battleStage3_outBattle = _this_1.enemyParty.eventSetting ? _this_1.enemyParty.battleStage3_outBattle : null;
                    CommandPage.startTriggerFragmentEvent(battleStage3_outBattle, Game.player.sceneObject, Game.player.sceneObject, Callback.New(function () {
                        new SyncTask(GameBattle.battleOverTask, function () {
                            EventUtils.happen(GameBattle, GameBattle.EVENT_BATTLE_ON_WIN_OR_LOSE);
                            GameCommand.startCommonCommand(14021, [], Callback.New(function () {
                                SyncTask.taskOver(GameBattle.battleOverTask);
                            }, _this_1));
                        });
                    }, _this_1));
                }, _this_1));
            }, WorldData.battleOverStayTime * 1000);
            return true;
        }
        return false;
    };
    GameBattle.onBattleUIOpen = function (uiID) {
        if (uiID == 21) {
            this.battleUI = GameUI.get(21);
            this.initBattlefield();
            this.battleUI.addChild(Game.layer.imageLayer);
        }
    };
    GameBattle.initBattlefield = function () {
        var _this_1 = this;
        new SyncTask(GameBattle.battleStartTask, function () {
            _this_1.battleUI.createBattleScene(function () {
                _this_1.lastCurrentScene = Game.currentScene;
                Game.currentScene = _this_1.battleUI.currentBattleScene;
                _this_1.enemyBattlers.length = 0;
                _this_1.playerBattlers.length = 0;
                _this_1.removedEnemyBattlers.length = 0;
                GameBattleData.initEnemyPartyPackageItem(_this_1.enemyParty);
                var enemys;
                if (GameBattle.enemyParty.randEnemy) {
                    enemys = GameBattle.enemyParty.enemys.concat();
                    ArrayUtils.randOrder(enemys);
                    enemys.length = MathUtils.rand(GameBattle.enemyParty.enemys.length) + 1;
                }
                else {
                    enemys = GameBattle.enemyParty.enemys;
                }
                var enemyLength = enemys.length;
                for (var i = 0; i < 99; i++) {
                    var enemyRefBattlerUI = _this_1.battleUI.getRefEnemyBattlerUI(i);
                    if (!enemyRefBattlerUI)
                        break;
                    enemyRefBattlerUI.visible = false;
                    enemyRefBattlerUI.isPlay = false;
                    if (i >= enemyLength) {
                        continue;
                    }
                    else {
                        var enemyActorDS = enemys[i];
                        if (!GameData.getModuleData(6, enemyActorDS.actor)) {
                            continue;
                        }
                        var newEnemyAvtorData = GameData.newModuleData(6, enemyActorDS.actor);
                        var enemyBattler = Battler.createBattler("enemy" + i, enemyRefBattlerUI);
                        enemyBattler.setData(newEnemyAvtorData, enemyActorDS.lv, true);
                        _this_1.enemyBattlers.push(enemyBattler);
                    }
                }
                for (var i = 0; i < 99; i++) {
                    var playerRefBattlerUI = _this_1.battleUI.getRefPlayerBattlerUI(i);
                    if (!playerRefBattlerUI)
                        break;
                    playerRefBattlerUI.visible = false;
                    playerRefBattlerUI.isPlay = false;
                    if (i >= Game.player.data.party.length) {
                        continue;
                    }
                    else {
                        var playerActorDS = ProjectPlayer.getPlayerActorDSByInPartyIndex(i);
                        var playerBattler = Battler.createBattler("player" + i, playerRefBattlerUI);
                        playerBattler.setData(playerActorDS.actor, playerActorDS.lv, false);
                        _this_1.playerBattlers.push(playerBattler);
                    }
                }
                _this_1.battleUI.init();
                SyncTask.taskOver(GameBattle.battleStartTask);
            }, _this_1.enemyParty);
        });
    };
    GameBattle.clearBattlefield = function () {
        this.battleUI.clearBattleScene();
        Battler.removeAll();
        Game.currentScene = this.lastCurrentScene;
    };
    GameBattle.resetActorParty = function () {
        for (var i = 0; i < Game.player.data.party.length; i++) {
            var actorDS = Game.player.data.party[i];
            var actor = actorDS.actor;
            var battler = GameBattle.playerBattlers[i];
            if (battler == null) {
                break;
            }
            actor.dead = battler.isDead;
            if (actor.atkMode == 1 && actor.atkSkill)
                actor.atkSkill.currentCD = 0;
            for (var s = 0; s < actor.skills.length; s++) {
                var skill = actor.skills[s];
                skill.currentCD = 0;
            }
            Game.refreshActorAttribute(actor, actorDS.lv);
        }
    };
    GameBattle.calcReward = function (onFin) {
        if (!GameBattle.resultIsWin) {
            onFin.run();
            return;
        }
        GameBattleData.partyDeadReward();
        var isGetReward = GameBattleData.rewardRecord.exp || GameBattleData.rewardRecord.gold || GameBattleData.rewardRecord.items.length != 0 || GameBattleData.rewardRecord.equips.length != 0;
        if (!isGetReward) {
            onFin.run();
            return;
        }
        if (GameBattleData.rewardRecord.gold) {
            ProjectPlayer.increaseGold(GameBattleData.rewardRecord.gold);
        }
        var increaseExpResArr = [];
        for (var i = 0; i < Game.player.data.party.length; i++) {
            var actorDS = Game.player.data.party[i];
            var battler = GameBattle.playerBattlers[i];
            if (battler == null) {
                break;
            }
            if (battler.isDead) {
                increaseExpResArr.push(null);
                continue;
            }
            var increaseExpRes = ProjectPlayer.increaseExpByIndex(i, GameBattleData.rewardRecord.exp);
            increaseExpResArr.push(increaseExpRes);
            if (increaseExpRes && increaseExpRes.isLevelUp) {
                Game.refreshActorAttribute(actorDS.actor, GameBattleHelper.getLevelByActor(actorDS.actor));
                actorDS.actor.hp = actorDS.actor.MaxHP;
                actorDS.actor.sp = actorDS.actor.MaxSP;
                GameBattle.battleUI.refreshActorPanel(i);
            }
        }
        GUI_Reward.increaseExpResArr = increaseExpResArr;
        for (var i = 0; i < GameBattleData.rewardRecord.items.length; i++) {
            var itemInfo = GameBattleData.rewardRecord.items[i];
            ProjectPlayer.changeItemNumber(itemInfo.itemID, itemInfo.num, false);
        }
        for (var i = 0; i < GameBattleData.rewardRecord.equips.length; i++) {
            var newEquip = GameBattleData.rewardRecord.equips[i];
            GameData.changeModuleDataToCopyMode(newEquip, 9);
            ProjectPlayer.addEquipByInstance(newEquip);
        }
        EventUtils.happen(GameBattle, GameBattle.EVENT_BATTLE_REWARD_START);
        GameCommand.startCommonCommand(14022, [], Callback.New(function () {
            EventUtils.happen(GameBattle, GameBattle.EVENT_BATTLE_REWARD_OVER);
            GameBattleData.rewardRecord = { gold: 0, exp: 0, items: [], equips: [] };
            onFin.run();
        }, this), Game.player.sceneObject, Game.player.sceneObject);
    };
    GameBattle.settlementWaitTime = 1000;
    GameBattle.EVENT_BATTLE_START = "GameBattleEVENT_BATTLE_START";
    GameBattle.EVENT_BATTLE_OVER = "GameBattleEVENT_BATTLE_OVER";
    GameBattle.EVENT_BATTLE_NEW_TURN = "GameBattleEVENT_BATTLE_NEW_TURN";
    GameBattle.EVENT_BATTLE_BEFORE_ACTION = "GameBattleEVENT_BATTLE_BEFORE_ACTION";
    GameBattle.EVENT_BATTLE_SETTLEMENT = "GameBattleEVENT_BATTLE_SETTLEMENT";
    GameBattle.EVENT_BATTLE_BATTLER_DEAD_LEAVE_START = "GameBattleEVENT_BATTLE_BATTLER_DEAD_LEAVE_START";
    GameBattle.EVENT_BATTLE_BATTLER_DEAD_LEAVE_OVER = "GameBattleEVENT_BATTLE_BATTLER_DEAD_LEAVE_OVER";
    GameBattle.EVENT_BATTLE_ON_WIN_OR_LOSE = "GameBattleEVENT_BATTLE_ON_WIN_OR_LOSE";
    GameBattle.EVENT_BATTLE_REWARD_START = "GameBattleEVENT_BATTLE_REWARD_START";
    GameBattle.EVENT_BATTLE_REWARD_OVER = "GameBattleEVENT_BATTLE_REWARD_OVER";
    GameBattle.state = 0;
    GameBattle.battleRound = 0;
    GameBattle.playerBattlers = [];
    GameBattle.enemyBattlers = [];
    GameBattle.removedEnemyBattlers = [];
    GameBattle.battleOverTask = "battleOverTask";
    GameBattle.battleStartTask = "battleStartTask";
    GameBattle.deadEventSign = 0;
    return GameBattle;
}());
//# sourceMappingURL=GameBattle.js.map