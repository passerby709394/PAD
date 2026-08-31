














var Battler = (function (_super) {
    __extends(Battler, _super);
    function Battler(soData, scene) {
        var _this_1 = _super.call(this, soData, scene) || this;
        _this_1.battlerUI = new GUI_Battler();
        _this_1.battlerUI.battler = _this_1;
        _this_1.animationHighLayer.addChild(_this_1.battlerUI);
        _this_1.supportPause = false;
        return _this_1;
    }
    Battler.createBattler = function (sign, refBattlerUI) {
        var battler = Battler.cacheBattlers[sign];
        if (!battler) {
            battler = Battler.cacheBattlers[sign] = Game.currentScene.addNewSceneObject(1, { className: "Battler" });
            var moveToHelper = refBattlerUI.getChildByName("moveToHelper");
            battler.refBattlerUI = refBattlerUI;
            refBattlerUI.data = { battler: battler };
            battler.moveToHelper = moveToHelper;
            if (battler.moveToHelper)
                battler.moveToHelper.visible = false;
            battler.oriPostion = GameBattle.battleUI.globalToLocal(battler.refBattlerUI.localToGlobal(new Point()));
            battler.oriOrientation = refBattlerUI.avatar.orientation;
            battler.oriScale = refBattlerUI.scaleNumberX;
            battler.oriFPS = refBattlerUI.avatarFPS;
        }
        else {
            Game.currentScene.addSceneObject(battler, true);
        }
        return battler;
    };
    Battler.removeBattler = function (battler) {
        if (battler) {
            battler.stopAllAnimation();
            GameBattleData.removeAllStatus(battler);
            Game.currentScene.removeSceneObject(battler, false);
        }
    };
    Battler.removeAll = function () {
        for (var i = 0; i < Game.currentScene.sceneObjects.length; i++) {
            var battler = Game.currentScene.sceneObjects[i];
            this.removeBattler(battler);
        }
    };
    Object.defineProperty(Battler.prototype, "isDead", {
        get: function () {
            return this.actor ? this.actor.dead : false;
        },
        set: function (v) {
            if (this.actor) {
                this.actor.dead = v;
            }
        },
        enumerable: false,
        configurable: true
    });
    Battler.prototype.setData = function (actor, level, isEnemy) {
        this.oriPostion = GameBattle.battleUI.globalToLocal(this.refBattlerUI.localToGlobal(new Point()));
        if (this.moveToHelper) {
            this._nearPostion = GameBattle.battleUI.globalToLocal(this.refBattlerUI.localToGlobal(new Point(this.moveToHelper.x, this.moveToHelper.y)));
        }
        else {
            this._nearPostion = new Point(this.x, this.y);
        }
        this.x = this.oriPostion.x;
        this.y = this.oriPostion.y;
        this.avatar.id = actor.bttlerAvatar;
        this.avatar.actionID = 1;
        this.avatarFPS = this.oriFPS;
        this.scale = this.oriScale;
        this.isDead = isEnemy ? false : actor.dead;
        this.actor = actor;
        this.level = level;
        this.isEnemy = isEnemy;
        this.avatar.id = actor.bttlerAvatar;
        this.avatar.orientation = this.oriOrientation;
        this.battlerUI.battlerName.text = actor.name;
        this.inBattleID = ObjectUtils.getInstanceID();
        if (isEnemy && !actor.takeSetting) {
            actor.skills.length = 0;
            actor.equips.length = 0;
        }
        Game.refreshActorAttribute(actor, level);
        if (this.isDead) {
            this.autoPlayEnable = false;
            this.avatar.actionID = 7;
            this.avatar.currentFrame = this.avatar.totalFrame;
        }
        else {
            this.autoPlayEnable = true;
            for (var i = 0; i < actor.selfStatus.length; i++) {
                var status = actor.selfStatus[i];
                GameBattleData.addStatus(this, status);
            }
        }
        Game.refreshActorAttribute(actor, level);
        if (isEnemy) {
            actor.hp = actor.MaxHP;
            actor.sp = actor.MaxSP;
        }
        GameCommand.startCommonCommand(14027, [], null, this, this);
    };
    Object.defineProperty(Battler.prototype, "nearPostion", {
        get: function () {
            return this._nearPostion;
        },
        enumerable: false,
        configurable: true
    });
    Battler.prototype.playAnimation = function (aniID, loop, isHit, fps, superposition, isReset) {
        var _this_1 = this;
        var animation;
        if (superposition) {
            animation = new GCAnimation();
            this["___animations"].push(animation);
        }
        else {
            animation = ArrayUtils.matchAttributes(this["___animations"], { id: aniID }, true, "==")[0];
            if (!animation) {
                animation = new GCAnimation();
                this["___animations"].push(animation);
            }
            else if (!isReset) {
                return animation;
            }
        }
        animation.sceneObject = this;
        if (fps)
            animation.fps = fps;
        animation.loop = loop;
        animation.showHitEffect = isHit;
        animation.once(GCAnimation.PLAY_COMPLETED, this, this.stopAnimation, [animation]);
        animation.once(EventObject.LOADED, this, function (animation) {
            if (animation.isDisposed)
                return;
            if (animation.isParticle) {
                _this_1.animationHighLayer.addChild(animation);
            }
            else {
                animation.addToGameSprite(_this_1.avatarContainer, _this_1.animationLowLayer, _this_1.animationHighLayer);
            }
        }, [animation]);
        animation.id = aniID;
        animation.sceneObject = null;
        animation.gotoAndPlay();
        return animation;
    };
    Battler.cacheBattlers = {};
    return Battler;
}(ProjectClientSceneObject));
//# sourceMappingURL=Battler.js.map