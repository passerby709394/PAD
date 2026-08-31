var GameBattleAction = (function () {
    function GameBattleAction() {
    }
    GameBattleAction.init = function () {
    };
    GameBattleAction.start = function () {
    };
    GameBattleAction.stop = function () {
        this.inAction = false;
        GameBattle.battleUI.actionText.text = "";
        EventUtils.clear(GameBattleAction, GameBattleAction.EVENT_ONCE_ACTION_COMPLETE);
    };
    GameBattleAction.doAction = function (battler, onComplete) {
        var _this_1 = this;
        this.inAction = true;
        this.fromBattler = battler;
        this.onComplete = onComplete;
        this.alreadyHitTargets.length = 0;
        if (battler.isDead) {
            onComplete.run();
            return;
        }
        EventUtils.happen(GameBattleAction, GameBattleAction.EVENT_ACTION_START);
        GameCommand.startCommonCommand(14029, [], Callback.New(function () {
            var forceAction = GameBattleHelper.getForceActionType(_this_1.fromBattler);
            if (forceAction == 1) {
                var myTeam = GameBattleHelper.getTeamBattlers(_this_1.fromBattler, false);
                if (myTeam.length == 0) {
                    battler.battleCommandType == -1;
                }
                else {
                    var teamBattler = myTeam[MathUtils.rand(myTeam.length)];
                    battler.battleCommandType = 0;
                    battler.battleCommandApplyTarget = teamBattler;
                }
            }
            else if (forceAction == 2) {
                var hostileBattlers = GameBattleHelper.getHostileBattlers(_this_1.fromBattler);
                var hostileBattler = hostileBattlers[MathUtils.rand(hostileBattlers.length)];
                battler.battleCommandType = 0;
                battler.battleCommandApplyTarget = hostileBattler;
            }
            if (battler.battleCommandType == 0) {
                _this_1.attack();
            }
            else if (battler.battleCommandType == 1) {
                _this_1.useSkill();
            }
            else if (battler.battleCommandType == 2) {
                _this_1.useItem();
            }
            else {
                onComplete.run();
            }
        }, this), battler, battler);
    };
    GameBattleAction.attack = function (firstUse, forceTarget) {
        var _this_1 = this;
        if (firstUse === void 0) { firstUse = true; }
        if (forceTarget === void 0) { forceTarget = null; }
        this.currentHitTarget = 0;
        this.totalHitTarget = 1;
        this.currentHitTimes = 0;
        this.totalHitTimes = firstUse ? GameBattleHelper.getNormalAttackTimes(this.fromBattler) : 1;
        this.isMelee = true;
        if (!GameBattleHelper.canAttack(this.fromBattler)) {
            this.actionComplete(true, true);
            return;
        }
        var target = GameBattleHelper.getAttackTarget(this.fromBattler);
        if (forceTarget && forceTarget != target) {
            this.actionComplete(true, true);
            return;
        }
        this.fromBattler.battleCommandApplyTarget = target;
        if (!this.fromBattler.battleCommandApplyTarget) {
            this.actionComplete(true, true);
            return;
        }
        EventUtils.happen(GameBattleAction, GameBattleAction.EVENT_ACTION_ATTACK, [this.fromBattler, this.fromBattler.battleCommandApplyTarget]);
        GameBattle.battleUI.actionText.text = WorldData.word_useAtk.replace("$1", this.fromBattler.actor.name);
        this.moveTo(this.fromBattler, this.fromBattler.battleCommandApplyTarget, function () {
            GameBattleAction.releaseAction(_this_1.fromBattler, 3, _this_1.fromBattler.actor.hitFrame, 1, function () {
                _this_1.hitTarget(_this_1.fromBattler, _this_1.fromBattler.battleCommandApplyTarget, 0, null, null, null, true);
            }, 0);
        });
    };
    GameBattleAction.useSkill = function (firstUse, forceTarget) {
        var _this_1 = this;
        if (firstUse === void 0) { firstUse = true; }
        if (forceTarget === void 0) { forceTarget = null; }
        var skill = this.fromBattler.battleCommandUseSkill;
        var doUseSkill = function () {
            var ifNoTargetGetOtherTarget = firstUse || !(GameBattleHelper.isMeleeSkill(skill) && GameBattleHelper.canMultipleHitSkill(skill));
            var targets = GameBattleHelper.getSkillTargets(_this_1.fromBattler, _this_1.fromBattler.battleCommandUseSkill, ifNoTargetGetOtherTarget);
            if (targets) {
                if (firstUse && targets.length != 0) {
                    _this_1.fromBattler.battleCommandApplyTarget = targets[0];
                }
                for (var i = 0; i < _this_1.alreadyHitTargets.length; i++) {
                    ArrayUtils.remove(targets, _this_1.alreadyHitTargets[i]);
                }
            }
            if (!targets || targets.length == 0) {
                _this_1.actionComplete(true, true);
                return;
            }
            if (forceTarget && forceTarget != targets[0]) {
                _this_1.actionComplete(true, true);
                return;
            }
            if (firstUse) {
                if (!GameBattleHelper.canUseOneSkill(_this_1.fromBattler, skill)) {
                    _this_1.actionComplete(true, true);
                    return;
                }
                if (_this_1.fromBattler.battleCommandUseSkillFromItem) {
                    if (!GameBattleData.costItem(_this_1.fromBattler, _this_1.fromBattler.battleCommandUseSkillFromItem)) {
                        _this_1.actionComplete(true, true);
                        return;
                    }
                    _this_1.fromBattler.battleCommandUseSkillFromItem = null;
                }
                else {
                    GameBattleData.useSkill(_this_1.fromBattler, skill);
                }
                if (skill == _this_1.fromBattler.actor.atkSkill) {
                    GameBattle.battleUI.actionText.text = WorldData.word_useAtk.replace("$1", _this_1.fromBattler.actor.name);
                }
                else {
                    GameBattle.battleUI.actionText.text = WorldData.word_useSkill.replace("$1", _this_1.fromBattler.actor.name).replace("$2", skill.name);
                }
            }
            GameBattle.battlerfieldDetermineHandle(function () {
                if (_this_1.fromBattler.isDead) {
                    _this_1.actionComplete(true, true);
                    return;
                }
                if (GameBattleHelper.isMeleeSkill(skill)) {
                    var oneTarget_1 = targets[0];
                    if (firstUse) {
                        _this_1.currentHitTarget = 0;
                        _this_1.totalHitTarget = 1;
                        _this_1.currentHitTimes = 0;
                        _this_1.totalHitTimes = 1;
                    }
                    if (GameBattleHelper.canMultipleHitSkill(skill)) {
                        if (firstUse)
                            _this_1.totalHitTimes = skill.releaseTimes;
                    }
                    if (targets.length <= 1) {
                        if (firstUse && _this_1.totalHitTimes == 1 && skill == _this_1.fromBattler.actor.atkSkill) {
                            _this_1.totalHitTimes = GameBattleHelper.getNormalAttackTimes(_this_1.fromBattler);
                        }
                    }
                    else {
                        if (firstUse)
                            _this_1.totalHitTarget = targets.length;
                        _this_1.alreadyHitTargets.push(oneTarget_1);
                    }
                    _this_1.moveTo(_this_1.fromBattler, oneTarget_1, function () {
                        GameBattleAction.releaseAction(_this_1.fromBattler, skill.releaseActionID, skill.releaseFrame, 1, function () {
                            _this_1.hitTarget(_this_1.fromBattler, oneTarget_1, 1, skill, null, null, true);
                        }, 0);
                    });
                }
                else {
                    GameBattleAction.releaseAction(_this_1.fromBattler, skill.releaseActionID, skill.releaseFrame, 1, function () {
                        _this_1.releaseSkill(targets, firstUse);
                    }, 0);
                }
                if (skill.releaseAnimation) {
                    _this_1.fromBattler.playAnimation(skill.releaseAnimation, false, true);
                }
            });
        };
        if (firstUse) {
            EventUtils.happen(GameBattleAction, GameBattleAction.EVENT_ACTION_USE_SKILL, [this.fromBattler, skill]);
            if (skill.eventSetting && skill.useEvent)
                CommandPage.startTriggerFragmentEvent(skill.useEvent, this.fromBattler, this.fromBattler, Callback.New(doUseSkill, this));
            else
                doUseSkill.apply(this);
        }
        else {
            doUseSkill.apply(this);
        }
    };
    GameBattleAction.useItem = function () {
        var _this_1 = this;
        var item = this.fromBattler.battleCommandUseItem;
        this.currentHitTarget = 0;
        this.totalHitTarget = 1;
        this.currentHitTimes = 0;
        this.totalHitTimes = 1;
        var target = GameBattleHelper.getItemTarget(this.fromBattler, item);
        if (!target) {
            this.actionComplete();
            return;
        }
        if (!GameBattleData.costItem(this.fromBattler, item)) {
            this.actionComplete();
            return;
        }
        EventUtils.happen(GameBattleAction, GameBattleAction.EVENT_ACTION_USE_ITEM, [this.fromBattler, item]);
        GameBattle.battleUI.actionText.text = WorldData.word_useItem.replace("$1", this.fromBattler.actor.name).replace("$2", item.name);
        var hasUseItemAction = this.fromBattler.avatar.hasActionID(WorldData.useItemActID);
        if (hasUseItemAction) {
            this.fromBattler.avatar.once(Avatar.ACTION_PLAY_COMPLETED, this, function () {
                _this_1.fromBattler.avatar.actionID = 1;
                _this_1.hitTarget(_this_1.fromBattler, target, 2, null, item);
            });
            this.fromBattler.avatar.currentFrame = 1;
            this.fromBattler.avatar.actionID = WorldData.useItemActID;
        }
        else {
            this.hitTarget(this.fromBattler, target, 2, null, item);
        }
    };
    GameBattleAction.calcBattlersStatus = function (onComplete) {
        this.onComplete = null;
        var allBattlers = GameBattleHelper.allBattlers;
        this.currentHitTarget = 0;
        this.totalHitTarget = 0;
        this.currentHitTimes = 0;
        this.totalHitTarget = 1;
        var needWait = false;
        for (var i = 0; i < allBattlers.length; i++) {
            var battler = allBattlers[i];
            if (battler.isDead)
                continue;
            var battlerActor = battler.actor;
            for (var s = 0; s < battlerActor.status.length; s++) {
                var status = battlerActor.status[s];
                if (!status.overtime)
                    continue;
                needWait = true;
                Callback.New(this.hitByStatus, this, [battler, status]).delayRun(GameBattle.settlementWaitTime);
            }
        }
        onComplete.delayRun(needWait ? GameBattle.settlementWaitTime * 2 : GameBattle.settlementWaitTime);
    };
    GameBattleAction.releaseSkill = function (targets, firstUse) {
        var _this_1 = this;
        var fromBattler = this.fromBattler;
        var skill = fromBattler.battleCommandUseSkill;
        var doReleaseSkill = function () {
            _this_1.currentHitTarget = 0;
            _this_1.totalHitTarget = targets.length;
            if (firstUse) {
                _this_1.currentHitTimes = 0;
                _this_1.totalHitTimes = skill.releaseTimes;
            }
            if (skill.skillType == 0) {
                for (var i = 0; i < targets.length; i++) {
                    _this_1.hitTarget(fromBattler, targets[i], 1, skill);
                }
            }
            else if (skill.skillType == 1) {
                for (var i = 0; i < targets.length; i++) {
                    _this_1.releaseBullet(targets[i]);
                }
            }
        };
        EventUtils.happen(GameBattleAction, GameBattleAction.EVENT_ACTION_RELEASE_SKILL, [this.fromBattler, skill]);
        if (skill.eventSetting && skill.releaseEvent)
            CommandPage.startTriggerFragmentEvent(skill.releaseEvent, fromBattler, fromBattler, Callback.New(doReleaseSkill, this));
        else
            doReleaseSkill.apply(this);
    };
    GameBattleAction.releaseBullet = function (targetBattler) {
        var _this_1 = this;
        if (targetBattler === void 0) { targetBattler = null; }
        var fromBattler = this.fromBattler;
        var skill = fromBattler.battleCommandUseSkill;
        var bullet = new GCAnimation();
        bullet.id = skill.bulletAnimation;
        bullet.loop = true;
        bullet.play();
        GameBattle.battleUI.addChild(bullet);
        var startPoint = new Point(fromBattler.x, fromBattler.y);
        var offset = WorldData.bulletSendOffset;
        var destinationPoint = new Point(targetBattler.x, targetBattler.y + WorldData.bulletTargetOffset);
        var angle = MathUtils.direction360(destinationPoint.x, destinationPoint.y, startPoint.x, startPoint.y);
        var dx = Math.sin(angle / 180 * Math.PI) * offset;
        var dy = Math.cos(angle / 180 * Math.PI) * offset - offset;
        startPoint.x += -dx;
        startPoint.y += dy;
        var dis = Point.distance(startPoint, destinationPoint);
        var totalFrame = Math.max(Math.ceil(dis / skill.bulletSpeed * 60), 1);
        var currentFrame = 1;
        bullet.x = startPoint.x;
        bullet.y = startPoint.y;
        var rotation = MathUtils.direction360(startPoint.x, startPoint.y, destinationPoint.x, destinationPoint.y);
        bullet.rotation = rotation;
        EventUtils.happen(GameBattleAction, GameBattleAction.EVENT_ACTION_RELEASE_BULLET_START, [this.fromBattler, targetBattler, bullet, rotation]);
        os.add_ENTERFRAME(function () {
            var per = currentFrame / totalFrame;
            bullet.x = (destinationPoint.x - startPoint.x) * per + startPoint.x;
            bullet.y = (destinationPoint.y - startPoint.y) * per + startPoint.y;
            currentFrame++;
            if (currentFrame > totalFrame) {
                EventUtils.happen(GameBattleAction, GameBattleAction.EVENT_ACTION_RELEASE_BULLET_OVER, [_this_1.fromBattler, targetBattler, bullet]);
                os.remove_ENTERFRAME(arguments.callee, _this_1);
                bullet.dispose();
                _this_1.hitTarget(fromBattler, targetBattler, 1, skill);
            }
        }, this);
    };
    GameBattleAction.hitTarget = function (fromBattler, targetBattler, actionType, skill, item, status, isMelee) {
        var _this_1 = this;
        if (skill === void 0) { skill = null; }
        if (item === void 0) { item = null; }
        if (status === void 0) { status = null; }
        if (isMelee === void 0) { isMelee = false; }
        this.isMelee = isMelee;
        var fromActor = fromBattler.actor;
        var isHitSuccess = GameBattleData.getHitResult(actionType, fromBattler, targetBattler, skill);
        var hitAniID = 0;
        var showTargetHurtAnimation = false;
        if (actionType == 0) {
            hitAniID = fromActor.hitAnimation;
            showTargetHurtAnimation = true;
        }
        else if (actionType == 1) {
            hitAniID = skill.hitAnimation;
            showTargetHurtAnimation = GameBattleHelper.isHostileRelationship(fromBattler, targetBattler);
        }
        else if (actionType == 2) {
            hitAniID = item.releaseAnimation;
        }
        else if (actionType == 3) {
            showTargetHurtAnimation = false;
        }
        var callNextStep = function () {
            if (GameBattle.state == 0 || GameBattle.state == 3) {
                _this_1.actionComplete();
            }
            else if (targetBattler.isDead &&
                ((actionType != 1 && actionType != 2) || (actionType == 2 && !item.applyDeadBattler) || (actionType == 1 && !GameBattleHelper.isResurrectionSkill(skill)))) {
                _this_1.actionComplete();
            }
            else {
                _this_1.hitResult(fromBattler, targetBattler, isHitSuccess, actionType, skill, item, status);
            }
        };
        var keepHurtAni = null;
        var callHitEvent = function () {
            if (skill && skill.keepHurtAction && !isMelee && targetBattler.avatar.hasActionID(11)) {
                if (!targetBattler.isDead) {
                    targetBattler.avatar.actionID = 1;
                    targetBattler.autoPlayEnable = true;
                }
            }
            if (keepHurtAni) {
                targetBattler.stopAnimation(keepHurtAni);
            }
            _this_1.hitBattler = targetBattler;
            EventUtils.happen(GameBattleAction, GameBattleAction.EVENT_ACTION_HIT_TARGET, [isHitSuccess, fromBattler, targetBattler, actionType, skill, item, status, isMelee]);
            if (actionType == 1 && isHitSuccess && skill.eventSetting && skill.hitEvent)
                CommandPage.startTriggerFragmentEvent(skill.hitEvent, fromBattler, targetBattler, Callback.New(callNextStep, _this_1));
            else if (actionType == 2 && item.callEvent)
                CommandPage.startTriggerFragmentEvent(item.callEvent, fromBattler, targetBattler, Callback.New(callNextStep, _this_1));
            else
                callNextStep.apply(_this_1);
        };
        if (hitAniID) {
            var alreadyInShowDamageStage_1 = false;
            var keepHurtAction = false;
            if (isHitSuccess && showTargetHurtAnimation) {
                var isPhysicalAttack = GameBattleHelper.isPhysicalAttack(actionType, skill);
                if ((isMelee && isPhysicalAttack && targetBattler.battleCommandType == 3 && GameBattleHelper.canUseDefense(targetBattler))) {
                    GameBattleAction.releaseAction(targetBattler, WorldData.defendActID, Number.MAX_VALUE, 1);
                    if (WorldData.defendAni) {
                        targetBattler.playAnimation(WorldData.defendAni, false, true);
                    }
                }
                else {
                    if (skill && skill.keepHurtAction && !isMelee) {
                        keepHurtAction = true;
                        GameBattleAction.playBattlerVoice(targetBattler, 1);
                        if (targetBattler.avatar.hasActionID(11)) {
                            targetBattler.avatar.currentFrame = 1;
                            targetBattler.avatar.actionID = 11;
                            targetBattler.avatar.once(Avatar.ACTION_PLAY_COMPLETED, this, function () {
                                if (!alreadyInShowDamageStage_1) {
                                    targetBattler.avatar.currentFrame = targetBattler.avatar.totalFrame;
                                    targetBattler.autoPlayEnable = false;
                                }
                            });
                            keepHurtAni = targetBattler.playAnimation(WorldData.keepHurtAni, true, isHitSuccess);
                        }
                    }
                    else {
                        GameBattleAction.releaseAction(targetBattler, 9, Number.MAX_VALUE, 1, null, 1);
                    }
                }
            }
            var hitAni = targetBattler.playAnimation(hitAniID, false, isHitSuccess, Config.ANIMATION_FPS, true);
            hitAni.once(GCAnimation.PLAY_COMPLETED, this, function () {
                if (!alreadyInShowDamageStage_1 && !isMelee) {
                    callHitEvent.apply(_this_1);
                }
            });
            if (!keepHurtAction) {
                hitAni.once(GCAnimation.SIGNAL, this, function (signalID) {
                    if (signalID == 1) {
                        alreadyInShowDamageStage_1 = true;
                        if (!isMelee)
                            callHitEvent.apply(_this_1);
                    }
                });
            }
            if (isMelee)
                callHitEvent.apply(this);
        }
        else {
            callHitEvent.apply(this);
        }
    };
    GameBattleAction.hitResult = function (fromBattler, targetBattler, isHitSuccess, actionType, skill, item, status) {
        var _this_1 = this;
        if (skill === void 0) { skill = null; }
        if (item === void 0) { item = null; }
        if (status === void 0) { status = null; }
        var damageType = actionType == 0 ? 0 : (skill ? skill.damageType : -2);
        var animationCount = 2;
        var onAnimationCompleteCallback = Callback.New(function () {
            animationCount--;
            if (animationCount == 0) {
                if (_this_1.currentHitTimes == _this_1.totalHitTimes - 1) {
                    if (!_this_1.seCounterattack) {
                        if (GameBattleHelper.isMeleeAction(_this_1.fromBattler, actionType, skill)) {
                            if (!targetBattler.isDead && !fromBattler.isDead) {
                                var counterattackDmagePer = GameBattleHelper.getCounterattackDamagePer(fromBattler, targetBattler);
                                if (counterattackDmagePer != null) {
                                    _this_1.seCounterattack = true;
                                    _this_1.seCounterattackDamagePer = counterattackDmagePer;
                                    GameBattleAction.releaseAction(targetBattler, 3, targetBattler.actor.hitFrame, 1, function () {
                                        _this_1.hitTarget(targetBattler, fromBattler, 0, null, null, null, true);
                                    });
                                    return;
                                }
                            }
                        }
                    }
                    else {
                        _this_1.seCounterattack = false;
                        _this_1.seCounterattackDamagePer = null;
                    }
                }
                _this_1.actionComplete(false, false, actionType <= 1);
            }
        }, this);
        var res = GameBattleData.calculationHitResult(fromBattler, targetBattler, isHitSuccess, actionType, skill, item, status, this.seCounterattackDamagePer);
        if (res) {
            if (!WorldData.useCustomDamageLogic) {
                animationCount++;
                this.showDamage(targetBattler, res.damageType, res.damage, res.isCrit, onAnimationCompleteCallback);
                var showSlefDmage = false;
                var hpValue = 0;
                var suckCondition = null;
                if (GameBattleHelper.isMeleeAction(this.fromBattler, actionType, skill)) {
                    var returnDmagePer = GameBattleHelper.getReturnAttackDamagePer(fromBattler, targetBattler);
                    if (returnDmagePer != null) {
                        var returnDamage = MathUtils.int(res.damage * returnDmagePer * 0.01);
                        if (returnDamage != 0) {
                            hpValue += returnDamage;
                            if (!WorldData.useCustomDamageLogic)
                                this.showDamage(fromBattler, res.damageType, returnDamage, false);
                            showSlefDmage = true;
                        }
                    }
                    suckCondition = 3;
                }
                else {
                    if (res.damageType >= 0 && res.damageType <= 2)
                        suckCondition = res.damageType;
                }
                var isMelee = suckCondition == 3;
                var suckHP = GameBattleHelper.getSuckPer(fromBattler, damageType, true, isMelee);
                if (suckHP != null) {
                    var suckHPValue = MathUtils.int(-res.damage * suckHP * 0.01);
                    if (suckHPValue != 0) {
                        hpValue += suckHPValue;
                        if (!showSlefDmage)
                            this.showDamage(fromBattler, 3, suckHPValue, false);
                        showSlefDmage = true;
                    }
                }
                var suckSP = GameBattleHelper.getSuckPer(fromBattler, damageType, false, isMelee);
                if (suckSP != null) {
                    var spValue = MathUtils.int(-res.damage * suckSP * 0.01);
                    if (spValue != 0) {
                        GameBattleData.changeBattlerSP(fromBattler, spValue);
                        if (!showSlefDmage)
                            this.showDamage(fromBattler, 4, spValue, false);
                        showSlefDmage = true;
                    }
                }
                if (hpValue != 0) {
                    GameBattleData.changeBattlerHP(fromBattler, hpValue);
                }
            }
        }
        GameBattle.checkBattlerIsDead(fromBattler, function () {
            onAnimationCompleteCallback.run();
        });
        GameBattle.checkBattlerIsDead(targetBattler, function () {
            onAnimationCompleteCallback.run();
        });
    };
    GameBattleAction.actionComplete = function (skipHitMultipleTarget, skipHitTimes, allowReleaseAgain) {
        var _this_1 = this;
        if (skipHitMultipleTarget === void 0) { skipHitMultipleTarget = false; }
        if (skipHitTimes === void 0) { skipHitTimes = false; }
        if (allowReleaseAgain === void 0) { allowReleaseAgain = true; }
        var doMoveBack = function () {
            _this_1.moveBack(_this_1.fromBattler, function () {
                GameBattle.battlerfieldDetermineHandle(function () {
                    GameCommand.startCommonCommand(14030, [], Callback.New(function () {
                        _this_1.inAction = false;
                        EventUtils.happen(GameBattleAction, GameBattleAction.EVENT_ONCE_ACTION_COMPLETE);
                        _this_1.onComplete && _this_1.onComplete.run();
                    }, _this_1), _this_1.fromBattler, _this_1.fromBattler);
                }, function () {
                    EventUtils.happen(GameBattleAction, GameBattleAction.EVENT_ONCE_ACTION_COMPLETE);
                });
            });
        };
        if (!skipHitMultipleTarget && this.currentHitTarget < this.totalHitTarget)
            this.currentHitTarget++;
        var battlerMultipleTimesAttackTime = this.isMelee ? WorldData.battlerMultipleTimesAttackTime * 1000 : 0;
        GameBattle.battleUI.refreshPlayerActorPanel();
        if (skipHitMultipleTarget || this.currentHitTarget == this.totalHitTarget) {
            this.currentHitTimes++;
            if (allowReleaseAgain && !this.fromBattler.isDead && this.fromBattler.battleCommandType <= 1 && !skipHitTimes && this.currentHitTimes != this.totalHitTimes) {
                if (this.fromBattler.battleCommandType == 0) {
                    setTimeout(function () {
                        _this_1.attack(false, _this_1.fromBattler.battleCommandApplyTarget);
                    }, battlerMultipleTimesAttackTime);
                }
                else if (this.fromBattler.battleCommandType == 1 && this.fromBattler.battleCommandUseSkill == this.fromBattler.actor.atkSkill) {
                    setTimeout(function () {
                        _this_1.useSkill(false, _this_1.fromBattler.battleCommandApplyTarget);
                    }, battlerMultipleTimesAttackTime);
                }
                else {
                    if (this.alreadyHitTargets.length > 0) {
                        this.moveBack(this.fromBattler, function () {
                            _this_1.useSkill(false, _this_1.fromBattler.battleCommandApplyTarget);
                        });
                    }
                    else {
                        setTimeout(function () {
                            _this_1.useSkill(false, _this_1.fromBattler.battleCommandApplyTarget);
                        }, battlerMultipleTimesAttackTime);
                    }
                }
                return;
            }
            doMoveBack.apply(this);
        }
        else if (this.currentHitTarget != this.totalHitTarget && this.isMelee) {
            this.moveBack(this.fromBattler, function () {
                _this_1.useSkill(false);
            });
        }
    };
    GameBattleAction.hitByStatus = function (battler, status) {
        var allBattler = GameBattleHelper.allBattlers;
        var fromBattler = ArrayUtils.matchAttributes(allBattler, { inBattleID: status.fromBattlerID }, true)[0];
        if (!fromBattler) {
            fromBattler = ArrayUtils.matchAttributes(GameBattle.removedEnemyBattlers, { inBattleID: status.fromBattlerID }, true)[0];
        }
        if (fromBattler) {
            this.fromBattler = fromBattler;
            if (status.overtime && status.whenOvertimeEvent) {
                EventUtils.happen(GameBattleAction, GameBattleAction.EVENT_STATUS_DOT_HOT_HIT, [this.fromBattler, battler, status]);
                CommandPage.startTriggerFragmentEvent(status.whenOvertimeEvent, this.fromBattler, battler);
            }
            this.hitTarget(fromBattler, battler, 3, null, null, status);
            return true;
        }
        return false;
    };
    GameBattleAction.showDamage = function (targetBattler, damageType, damage, isCrit, onFin) {
        if (damage === void 0) { damage = 0; }
        if (isCrit === void 0) { isCrit = false; }
        if (onFin === void 0) { onFin = null; }
        damage = Math.trunc(damage);
        var uiID;
        switch (damageType) {
            case -2:
                uiID = 0;
                break;
            case -1:
                uiID = 1041;
                break;
            default:
                uiID = 1042 + damageType;
                break;
        }
        if (uiID != 0) {
            var damageUI_1 = GameUI.load(uiID, true);
            damageUI_1.x = targetBattler.x;
            damageUI_1.y = targetBattler.y;
            GameBattle.battleUI.addChild(damageUI_1);
            var targetUI = damageUI_1["target"];
            if (!targetUI)
                targetUI = damageUI_1.getChildAt(0);
            if (targetUI) {
                if (damageType >= 0) {
                    var damageLabel = damageUI_1["damage"];
                    if (damageLabel && damageLabel instanceof UIString) {
                        damageLabel.text = (damage > 0 ? "+" : "") + damage.toString();
                    }
                }
                var damageAni_1 = new GCAnimation();
                damageAni_1.target = targetUI;
                damageAni_1.once(GCAnimation.PLAY_COMPLETED, this, function () {
                    damageAni_1.dispose();
                    damageUI_1.dispose();
                });
                damageAni_1.id = isCrit ? 1015 : 1014;
                damageAni_1.play();
            }
        }
        onFin && onFin.run();
    };
    GameBattleAction.moveTo = function (fromBattler, targetBattler, onFin) {
        var actionCompleteTask = "releaseAction" + fromBattler.inBattleID;
        new SyncTask(actionCompleteTask, function () {
            var _this_1 = this;
            var nearPostion = targetBattler.nearPostion;
            if (fromBattler.x == nearPostion.x && fromBattler.y == nearPostion.y) {
                onFin.apply(this);
                SyncTask.taskOver(actionCompleteTask);
                return;
            }
            if (fromBattler.isEnemy == targetBattler.isEnemy) {
                fromBattler.avatar.orientation = GameUtils.getFlipOri(fromBattler.oriOrientation);
            }
            if (fromBattler.avatar.hasActionID(2))
                fromBattler.avatar.actionID = 2;
            EventUtils.happen(GameBattleAction, GameBattleAction.EVENT_ACTION_MOVE_TO_START, [this.fromBattler, nearPostion.x, nearPostion.y]);
            Tween.to(fromBattler, { x: nearPostion.x, y: nearPostion.y }, WorldData.battleMoveToTime * 1000, null, Callback.New(function () {
                EventUtils.happen(GameBattleAction, GameBattleAction.EVENT_ACTION_MOVE_TO_OVER, [_this_1.fromBattler, nearPostion.x, nearPostion.y]);
                fromBattler.avatar.actionID = 1;
                onFin.apply(_this_1);
                SyncTask.taskOver(actionCompleteTask);
            }, this));
        });
    };
    GameBattleAction.moveBack = function (fromBattler, onFin) {
        var actionCompleteTask = "releaseAction" + fromBattler.inBattleID;
        new SyncTask(actionCompleteTask, function () {
            var _this_1 = this;
            if (fromBattler.isDead) {
                onFin.apply(this);
                SyncTask.taskOver(actionCompleteTask);
                return;
            }
            var oriPostion = fromBattler.oriPostion;
            if (fromBattler.x == oriPostion.x && fromBattler.y == oriPostion.y) {
                onFin.apply(this);
                SyncTask.taskOver(actionCompleteTask);
                return;
            }
            if (fromBattler.avatar.hasActionID(2))
                fromBattler.avatar.actionID = 2;
            EventUtils.happen(GameBattleAction, GameBattleAction.EVENT_ACTION_MOVE_BACK_START, [this.fromBattler, oriPostion.x, oriPostion.y]);
            Tween.to(fromBattler, { x: oriPostion.x, y: oriPostion.y }, WorldData.battleMoveBackTime * 1000, null, Callback.New(function () {
                EventUtils.happen(GameBattleAction, GameBattleAction.EVENT_ACTION_MOVE_BACK_OVER, [_this_1.fromBattler, oriPostion.x, oriPostion.y]);
                fromBattler.avatar.actionID = 1;
                fromBattler.avatar.orientation = fromBattler.oriOrientation;
                onFin.apply(_this_1);
                SyncTask.taskOver(actionCompleteTask);
            }, this));
        });
    };
    GameBattleAction.releaseAction = function (battler, actionID, releaseFrame, whenCompleteActionID, onRelease, voice) {
        var _this_1 = this;
        if (whenCompleteActionID === void 0) { whenCompleteActionID = null; }
        if (onRelease === void 0) { onRelease = null; }
        if (voice === void 0) { voice = -1; }
        var taskName = "releaseAction" + battler.inBattleID;
        new SyncTask(taskName, function () {
            if (voice != -1)
                _this_1.playBattlerVoice(battler, voice);
            var avatar = battler.avatar;
            var hasAtkAction = avatar.hasActionID(actionID);
            if (hasAtkAction) {
                var isReleaseAction_1 = false;
                var onRender_1 = function () {
                    if (avatar.currentFrame >= releaseFrame) {
                        avatar.off(Avatar.RENDER, avatar, arguments.callee);
                        EventUtils.happen(GameBattleAction, GameBattleAction.EVENT_ACTION_RELEASE_ACTION_OVER, [battler]);
                        onRelease && onRelease();
                        isReleaseAction_1 = true;
                    }
                };
                avatar.once(Avatar.ACTION_PLAY_COMPLETED, _this_1, function () {
                    if (battler.isDisposed) {
                        SyncTask.taskOver(taskName);
                        return;
                    }
                    avatar.off(Avatar.RENDER, avatar, onRender_1);
                    if (avatar.actionID != actionID) {
                        SyncTask.taskOver(taskName);
                        return;
                    }
                    if (whenCompleteActionID != null)
                        avatar.actionID = whenCompleteActionID;
                    if (!isReleaseAction_1) {
                        EventUtils.happen(GameBattleAction, GameBattleAction.EVENT_ACTION_RELEASE_ACTION_OVER, [battler]);
                        onRelease && onRelease();
                    }
                    SyncTask.taskOver(taskName);
                });
                avatar.on(Avatar.RENDER, avatar, onRender_1);
                avatar.currentFrame = 1;
                avatar.actionID = actionID;
                EventUtils.happen(GameBattleAction, GameBattleAction.EVENT_ACTION_RELEASE_ACTION_START, [battler, actionID, releaseFrame, voice, whenCompleteActionID]);
            }
            else {
                EventUtils.happen(GameBattleAction, GameBattleAction.EVENT_ACTION_RELEASE_ACTION_OVER, [battler]);
                onRelease && onRelease();
                SyncTask.taskOver(taskName);
            }
        });
    };
    GameBattleAction.playBattlerVoice = function (battler, type) {
        if (!battler.actor.tsSetting)
            return;
        switch (type) {
            case 0:
                GameAudio.playSE(battler.actor.attackVoice);
                break;
            case 1:
                GameAudio.playSE(battler.actor.hitVoice);
                break;
            case 2:
                GameAudio.playSE(battler.actor.dieVoice);
                break;
        }
    };
    GameBattleAction.EVENT_ACTION_START = "GameBattleActionEVENT_ACTION_START";
    GameBattleAction.EVENT_ONCE_ACTION_COMPLETE = "GameBattleActionEVENT_AFTER_ONCE_ACTION";
    GameBattleAction.EVENT_ACTION_MOVE_TO_START = "GameBattleActionEVENT_ACTION_MOVE_TO_START";
    GameBattleAction.EVENT_ACTION_MOVE_TO_OVER = "GameBattleActionEVENT_ACTION_MOVE_TO_OVER";
    GameBattleAction.EVENT_ACTION_MOVE_BACK_START = "GameBattleActionEVENT_ACTION_MOVE_BACK_START";
    GameBattleAction.EVENT_ACTION_MOVE_BACK_OVER = "GameBattleActionEVENT_ACTION_MOVE_BACK_OVER";
    GameBattleAction.EVENT_ACTION_RELEASE_ACTION_START = "GameBattleActionEVENT_ACTION_RELEASE_ACTION_START";
    GameBattleAction.EVENT_ACTION_RELEASE_ACTION_OVER = "GameBattleActionEVENT_ACTION_RELEASE_ACTION_OVER";
    GameBattleAction.EVENT_ACTION_ATTACK = "GameBattleActionEVENT_ACTION_ATTACK";
    GameBattleAction.EVENT_ACTION_USE_SKILL = "GameBattleActionEVENT_ACTION_USE_SKILL";
    GameBattleAction.EVENT_ACTION_RELEASE_SKILL = "GameBattleActionEVENT_ACTION_RELEASE_SKILL";
    GameBattleAction.EVENT_ACTION_RELEASE_BULLET_START = "GameBattleActionEVENT_ACTION_RELEASE_BULLET_START";
    GameBattleAction.EVENT_ACTION_RELEASE_BULLET_OVER = "GameBattleActionEVENT_ACTION_RELEASE_BULLET_OVER";
    GameBattleAction.EVENT_ACTION_USE_ITEM = "GameBattleActionEVENT_ACTION_USE_ITEM";
    GameBattleAction.EVENT_ACTION_HIT_TARGET = "GameBattleActionEVENT_ACTION_HIT_TARGET";
    GameBattleAction.EVENT_STATUS_DOT_HOT_HIT = "GameBattleActionEVENT_STATUS_DOT_HOT_HIT";
    GameBattleAction.alreadyHitTargets = [];
    return GameBattleAction;
}());
//# sourceMappingURL=GameBattleAction.js.map