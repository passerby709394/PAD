














var SoModule_LightShadow = (function (_super) {
    __extends(SoModule_LightShadow, _super);
    function SoModule_LightShadow(installCB) {
        var _this_1 = _super.call(this, installCB) || this;
        _this_1.lightShineTransI = 0;
        _this_1.init();
        return _this_1;
    }
    SoModule_LightShadow.prototype.onRemoved = function () {
        this.clear();
        if (this.shadowAvatar) {
            this.so.shadow.removeChild(this.shadowAvatar);
            this.shadowAvatar.dispose();
            this.shadowAvatar = null;
        }
        if (this.lightImageObject) {
            this.lightImageObject.dispose();
            this.lightImageObject = null;
        }
        if (this.lightAnimationObject) {
            this.lightAnimationObject.dispose();
            this.lightAnimationObject = null;
        }
        if (this.shadowImageObject) {
            this.shadowImageObject.dispose();
            this.shadowImageObject = null;
        }
        if (this.shadowRoot) {
            this.shadowRoot.dispose();
            this.shadowRoot = null;
        }
        this.so.avatar.blendMode = null;
        this.so.avatar.off(Avatar.RENDER, this, this.onAvatarRender);
        os.remove_ENTERFRAME(this.lightBrightenUpdate, this);
        os.remove_ENTERFRAME(this.onDynamicShadowUpdate, this);
        this.so.avatarContainer.scaleX = 1;
        this.so.avatarContainer.scaleY = 1;
        this.so.avatarContainer.rotation = 0;
        this.so.avatarContainer.alpha = 1;
    };
    SoModule_LightShadow.prototype.refresh = function () {
        this.init();
    };
    SoModule_LightShadow.prototype.init = function () {
        this.clear();
        if (this.type == 0) {
            this.initLight();
        }
        else {
            this.initShadow();
        }
    };
    SoModule_LightShadow.prototype.clear = function () {
        this.removeFromGroup();
        if (this.shadowRoot)
            this.shadowRoot.removeSelf();
        if (this.shadowAvatar)
            this.shadowAvatar.removeSelf();
        if (this.shadowImageObject)
            this.shadowImageObject.removeSelf();
        if (this.lightAnimationObject)
            this.lightAnimationObject.removeSelf();
        if (this.lightImageObject)
            this.lightImageObject.removeSelf();
    };
    SoModule_LightShadow.prototype.initLight = function () {
        this.addToLightGroup();
        this.createLight();
        this.refreshLightStyle();
        this.startLightBrighten();
    };
    SoModule_LightShadow.prototype.refreshLightStyle = function () {
        var blendTarget;
        switch (this.lightStyleType) {
            case 0:
                blendTarget = this.so.avatar;
                break;
            case 1:
                blendTarget = this.lightImageObject;
                break;
            case 2:
                blendTarget = this.lightAnimationObject;
                break;
        }
        switch (this.lightBlendMode) {
            case 0:
                blendTarget.blendMode = null;
                break;
            case 1:
                blendTarget.blendMode = "lighter";
                break;
            case 2:
                blendTarget.blendMode = "blend5-1";
                break;
            case 3:
                blendTarget.blendMode = "blend4-1";
                break;
            case 4:
                blendTarget.blendMode = "blend4-7";
                break;
            case 5:
                blendTarget.blendMode = "blend4-4";
                break;
        }
    };
    SoModule_LightShadow.prototype.startLightBrighten = function () {
        if (!this.lightBrighten)
            return;
        var lightRange2 = this.lightRange * this.lightRange;
        if (this.lightShineEnable) {
            this.lightShineTransData = GameUtils.getTransData(this.lightShineTransition);
        }
        os.remove_ENTERFRAME(this.lightBrightenUpdate, this);
        os.add_ENTERFRAME(this.lightBrightenUpdate, this, [lightRange2]);
    };
    SoModule_LightShadow.prototype.lightBrightenUpdate = function (lightRange2) {
        var _this_1 = this;
        Callback.CallLaterBeforeRender(function () {
            if (_this_1.isDisposed)
                return;
            var shineValue;
            if (_this_1.lightShineEnable) {
                if (!_this_1.lightShineTransData)
                    return;
                var per = (_this_1.lightShineTransI % _this_1.lightShineTransData.totalTime) / _this_1.lightShineTransData.totalTime;
                shineValue = GameUtils.getValueByTransData(_this_1.lightShineTransData, per) * _this_1.lightShineValue + 1;
                _this_1.lightShineTransI++;
            }
            else {
                shineValue = 1;
            }
            var shadowGroup = SoModule_LightShadow.shadowArr[_this_1.groupID];
            if (shadowGroup) {
                for (var i = 0; i < shadowGroup.length; i++) {
                    var soModuleShadow = shadowGroup[i];
                    if (soModuleShadow.shadowType == 1 && soModuleShadow.brightenFrame != Game.frameCount) {
                        var dis2 = Point.distanceSquare2(_this_1.so.x, _this_1.so.y, soModuleShadow.so.x, soModuleShadow.so.y);
                        if (dis2 <= lightRange2) {
                            soModuleShadow.brightenFrame = Game.frameCount;
                            var lightStrength = 1 - dis2 / lightRange2;
                            var shadowRotation = MathUtils.direction360(_this_1.so.x, _this_1.so.y, soModuleShadow.so.x, soModuleShadow.so.y);
                            var shadowAlpha = soModuleShadow.shadowOpacity * lightStrength * soModuleShadow.shadowOpacityFactor * shineValue;
                            var shadowScaleChangeValue = soModuleShadow.shadowMaxScale - soModuleShadow.shadowMinScale;
                            var shadowScaleY = (shadowScaleChangeValue * (1 - lightStrength) * soModuleShadow.shadowScaleFactor) * shineValue + soModuleShadow.shadowMinScale;
                            soModuleShadow.setShadowStyle(shadowAlpha, shadowScaleY, shadowRotation);
                        }
                    }
                }
            }
        }, this);
    };
    SoModule_LightShadow.prototype.createLight = function () {
        if (this.lightStyleType == 1) {
            if (this.so.avatar.id != 0)
                this.so.avatar.id = 0;
            this.so.avatar.blendMode = null;
            if (this.lightAnimationObject)
                this.lightAnimationObject.stop();
            if (!this.lightImageObject)
                this.lightImageObject = new UIBitmap;
            if (this.lightImageObject.image != this.lightImage) {
                this.lightImageObject.off(EventObject.LOADED, this, this.onLightImageLoaded);
                this.lightImageObject.once(EventObject.LOADED, this, this.onLightImageLoaded);
                this.lightImageObject.image = this.lightImage;
            }
            this.so.animationHighLayer.addChild(this.lightImageObject);
            this.lightImageObject.scaleX = this.lightAnimationScaleX;
            this.lightImageObject.scaleY = this.lightAnimationScaleY;
            this.lightImageObject.rotation = this.lightAnimationRotation;
            this.lightImageObject.alpha = this.lightOpacity;
            this.onLightImageLoaded();
        }
        else if (this.lightStyleType == 2) {
            if (this.so.avatar.id != 0)
                this.so.avatar.id = 0;
            this.so.avatar.blendMode = null;
            if (!this.lightAnimationObject) {
                this.lightAnimationObject = new GCAnimation;
                this.lightAnimationObject.loop = true;
            }
            if (!this.lightAnimationObject.isPlaying)
                this.lightAnimationObject.play();
            if (this.lightAnimationObject.id != this.lightAnimation)
                this.lightAnimationObject.id = this.lightAnimation;
            this.so.animationHighLayer.addChild(this.lightAnimationObject);
            this.lightAnimationObject.scaleX = this.lightAnimationScaleX;
            this.lightAnimationObject.scaleY = this.lightAnimationScaleY;
            this.lightAnimationObject.rotation = this.lightAnimationRotation;
            this.lightAnimationObject.alpha = this.lightOpacity;
        }
        else {
            if (this.so.avatar.id != this.so.avatarID)
                this.so.avatar.id = this.so.avatarID;
            if (this.lightAnimationObject)
                this.lightAnimationObject.stop();
            this.so.avatarContainer.scaleX = this.lightAnimationScaleX;
            this.so.avatarContainer.scaleY = this.lightAnimationScaleY;
            this.so.avatarContainer.rotation = this.lightAnimationRotation;
            this.so.avatarContainer.alpha = this.lightOpacity;
        }
    };
    SoModule_LightShadow.prototype.onLightImageLoaded = function () {
        var imageTex = AssetManager.getImage(this.lightImage);
        if (imageTex && this.lightImageObject) {
            this.lightImageObject.width = imageTex.width;
            this.lightImageObject.height = imageTex.height;
            this.lightImageObject.pivotType = 1;
        }
    };
    SoModule_LightShadow.prototype.initShadow = function () {
        this.addToShadowGroup();
        this.createShadow();
    };
    SoModule_LightShadow.prototype.createShadow = function () {
        if (!this.shadowRoot) {
            this.shadowRoot = new UIRoot;
        }
        this.so.shadow.addChild(this.shadowRoot);
        if (this.shadowStyle == 0) {
            if (!this.shadowAvatar) {
                this.shadowAvatar = new Avatar;
                this.shadowAvatar.setTonal(0, 0, 0, 0, 0, 0, 0);
            }
            var shadowAvatar = this.shadowAvatar;
            if (shadowAvatar.id != this.so.avatarID)
                shadowAvatar.id = this.so.avatarID;
            this.shadowAvatar.x = this.shadowOffsetX;
            this.shadowAvatar.y = this.shadowOffsetY;
            this.shadowRoot.addChild(this.shadowAvatar);
            this.so.avatar.off(Avatar.RENDER, this, this.onAvatarRender);
            this.so.avatar.on(Avatar.RENDER, this, this.onAvatarRender);
            this.onAvatarRender();
        }
        else if (this.shadowStyle == 1) {
            if (!this.shadowImageObject) {
                this.shadowImageObject = new UIBitmap;
            }
            if (this.shadowImageObject.image != this.shadowImage) {
                this.shadowImageObject.off(EventObject.LOADED, this, this.onShadowImageLoaded);
                this.shadowImageObject.once(EventObject.LOADED, this, this.onShadowImageLoaded);
                this.shadowImageObject.image = this.shadowImage;
            }
            this.onShadowImageLoaded();
            this.shadowRoot.addChild(this.shadowImageObject);
        }
        if (this.shadowType == 0) {
            this.setShadowStyle(this.shadowOpacity, this.shadowScale, this.shadowRotation);
        }
        else {
            this.setShadowStyle(0, 0, 0);
            os.add_ENTERFRAME(this.onDynamicShadowUpdate, this);
        }
    };
    SoModule_LightShadow.prototype.onDynamicShadowUpdate = function () {
        this.setShadowStyle(0, 0, 0);
    };
    SoModule_LightShadow.prototype.onShadowImageLoaded = function () {
        var imageTex = AssetManager.getImage(this.shadowImage);
        if (imageTex && this.shadowImageObject) {
            this.shadowImageObject.width = imageTex.width;
            this.shadowImageObject.height = imageTex.height;
            this.shadowImageObject.x = Math.floor(this.shadowOffsetX - imageTex.width * 0.5);
            this.shadowImageObject.y = this.shadowOffsetY - imageTex.height;
        }
    };
    SoModule_LightShadow.prototype.onAvatarRender = function () {
        if (this.shadowAvatar.id != this.so.avatar.id)
            this.shadowAvatar.id = this.so.avatar.id;
        this.shadowAvatar.actionID = this.so.avatar.actionID;
        this.shadowAvatar.currentFrame = this.so.avatar.currentFrame;
        this.shadowAvatar.orientation = this.so.avatar.orientation;
    };
    SoModule_LightShadow.prototype.setShadowStyle = function (alpha, scaleY, rotation) {
        this.shadowRoot.alpha = alpha;
        this.shadowRoot.scaleY = scaleY;
        this.shadowRoot.rotation = rotation;
        this.shadowRoot.scaleX = rotation >= 90 && rotation <= 270 ? -1 : 1;
    };
    SoModule_LightShadow.prototype.addToShadowGroup = function () {
        var shadowGroup = SoModule_LightShadow.shadowArr[this.groupID];
        if (!shadowGroup)
            shadowGroup = SoModule_LightShadow.shadowArr[this.groupID] = [];
        var shadowIdx = shadowGroup.indexOf(this);
        if (shadowIdx == -1)
            shadowGroup.push(this);
        this.inGroupID = this.groupID;
        this.inGroupType = this.type;
    };
    SoModule_LightShadow.prototype.addToLightGroup = function () {
        var lightGroup = SoModule_LightShadow.lightArr[this.groupID];
        if (!lightGroup)
            lightGroup = SoModule_LightShadow.lightArr[this.groupID] = [];
        var lightIdx = lightGroup.indexOf(this);
        if (lightIdx == -1)
            lightGroup.push(this);
        this.inGroupID = this.groupID;
        this.inGroupType = this.type;
    };
    SoModule_LightShadow.prototype.removeFromGroup = function () {
        if (this.inGroupID != null) {
            var groupArr = this.inGroupType == 0 ? SoModule_LightShadow.lightArr[this.inGroupType] : SoModule_LightShadow.shadowArr[this.inGroupType];
            if (groupArr) {
                var idx = groupArr.indexOf(this);
                if (idx != -1)
                    groupArr.splice(idx, 1);
            }
        }
    };
    SoModule_LightShadow.shadowArr = [];
    SoModule_LightShadow.lightArr = [];
    return SoModule_LightShadow;
}(SceneObjectModule_5));
//# sourceMappingURL=SoModule_LightShadow.js.map