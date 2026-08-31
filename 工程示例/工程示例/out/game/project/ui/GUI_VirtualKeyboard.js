














var GUI_VirtualKeyboard = (function (_super) {
    __extends(GUI_VirtualKeyboard, _super);
    function GUI_VirtualKeyboard() {
        var _this_1 = _super.call(this) || this;
        _this_1.rockerCenterPoint = new Point;
        _this_1.lastMenuDir = 0;
        GUI_VirtualKeyboard.self = _this_1;
        _this_1.init();
        return _this_1;
    }
    GUI_VirtualKeyboard.prototype.init = function () {
        var _this_1 = this;
        if (!this.rocker || !this.rockerBg)
            return;
        this.rockerCenterPoint = new Point(Math.floor(this.rockerBg.width / 2), Math.floor(this.rockerBg.height / 2));
        this.rockerR = this.rockerBg.width / 2;
        this.stopDragRocker(null);
        this.rocker.on(EventObject.MOUSE_DOWN, this, this.startDragRocker);
        this.rockerBg.on(EventObject.MOUSE_DOWN, this, this.startDragRocker);
        this.on(GUI_VirtualKeyboard.VIRTUALKEYBOARD_DIR4_CHANGE, this, this.onVirtualKeyboardMenuDirChange);
        EventUtils.addEventListenerFunction(GameUI, GameUI.EVENT_OPEN_SYSTEM_UI, function (uiID) {
            if (uiID != 12) {
                if (_this_1.stage)
                    GameUI.show(12);
            }
        }, this);
        EventUtils.addEventListenerFunction(GameDialog, GameDialog.EVENT_DIALOG_START, function (isOption, content, options, name, head, expression, audioURL, speed) {
            if (_this_1.stage)
                GameUI.show(12);
        }, this);
    };
    GUI_VirtualKeyboard.prototype.startDragRocker = function (e) {
        this.stopDragRocker(null);
        this.touchId = e.touchId;
        stage.on(EventObject.MOUSE_UP, this, this.stopDragRocker);
        if (!this.isUseTouch)
            stage.on(EventObject.MOUSE_MOVE, this, this.updateRocker);
        else
            this.startBeyondBoundariesHandle(e);
        this.updateRocker(e);
    };
    GUI_VirtualKeyboard.prototype.stopDragRocker = function (e) {
        if (this.isDisposed)
            return;
        if (e && e.touchId != this.touchId)
            return;
        this.touchId = null;
        this.endBeyondBoundariesHandle();
        stage.off(EventObject.MOUSE_MOVE, this, this.updateRocker);
        stage.off(EventObject.MOUSE_UP, this, this.stopDragRocker);
        this.rocker.x = this.rockerCenterPoint.x;
        this.rocker.y = this.rockerCenterPoint.y;
        Controller.stopJoy();
        if (this.lastMenuDir != 0) {
            this.lastMenuDir = 0;
            this.event(GUI_VirtualKeyboard.VIRTUALKEYBOARD_DIR4_CHANGE, [0]);
        }
    };
    GUI_VirtualKeyboard.prototype.updateRocker = function (e) {
        if (this.isDisposed)
            return;
        if (e && e.touchId != this.touchId)
            return;
        var localMouseX = this.lockRockerMouseX != null ? this.lockRockerMouseX : this.rockerBg.mouseX;
        var localMouseY = this.lockRockerMouseY != null ? this.lockRockerMouseY : this.rockerBg.mouseY;
        var dis = Point.distance2(this.rockerCenterPoint.x, this.rockerCenterPoint.y, localMouseX, localMouseY);
        var per = this.rockerR / dis;
        if (per > 1)
            per = 1;
        var currentP = Point.interpolate2(localMouseX, localMouseY, this.rockerCenterPoint.x, this.rockerCenterPoint.y, per);
        this.rocker.x = currentP[0];
        this.rocker.y = currentP[1];
        if (dis < this.rockerR * 0.4)
            return;
        var angle = MathUtils.direction360(this.rockerCenterPoint.x, this.rockerCenterPoint.y, localMouseX, localMouseY);
        if (ClientWorld.data.moveDir4) {
            angle = GameUtils.getAngleByOri(GameUtils.getAssetOri(GameUtils.getOriByAngle(angle), 4));
        }
        var menuDir;
        if (angle <= 45 || angle >= 315) {
            menuDir = 8;
        }
        else if (angle >= 45 && angle <= 135) {
            menuDir = 6;
        }
        else if (angle >= 135 && angle <= 225) {
            menuDir = 2;
        }
        else if (angle >= 225 && angle <= 315) {
            menuDir = 4;
        }
        if (this.lastMenuDir != menuDir) {
            this.lastMenuDir = menuDir;
            this.event(GUI_VirtualKeyboard.VIRTUALKEYBOARD_DIR4_CHANGE, [menuDir]);
        }
        Controller.startJoy(angle);
    };
    GUI_VirtualKeyboard.prototype.onVirtualKeyboardMenuDirChange = function (dir) {
        if (Controller.inSceneEnabled)
            return;
        var m = {
            2: GUI_Setting.KEY_BOARD.DOWN.keys[0], 4: GUI_Setting.KEY_BOARD.LEFT.keys[0],
            6: GUI_Setting.KEY_BOARD.RIGHT.keys[0], 8: GUI_Setting.KEY_BOARD.UP.keys[0]
        };
        var transKeyCode = m[dir];
        if (transKeyCode)
            stage.event(EventObject.KEY_DOWN, [{ keyCode: transKeyCode }]);
    };
    GUI_VirtualKeyboard.prototype.startBeyondBoundariesHandle = function (ev) {
        var e = ev.nativeEvent;
        this.startClientX = this.getClientX(e, this.touchId);
        this.startClientY = this.getClientY(e, this.touchId);
        this.startRockerBgMouseX = this.rockerBg.mouseX;
        this.startRockerBgMouseY = this.rockerBg.mouseY;
        this.endBeyondBoundariesHandle();
        document.addEventListener(this.mouseMoveType, this.doCheckBeyondBoundaries);
    };
    GUI_VirtualKeyboard.prototype.endBeyondBoundariesHandle = function () {
        this.startWindowMouseUpToStopDragRokered = false;
        document.removeEventListener(this.mouseUpType, this.doWindowMouseUpToStopDragRoker);
        document.removeEventListener(this.mouseMoveType, this.doCheckBeyondBoundaries);
    };
    GUI_VirtualKeyboard.prototype.doCheckBeyondBoundaries = function (e) {
        var _a, _b;
        var _this = GUI_VirtualKeyboard.self;
        for (var i = 0; i < e.changedTouches.length; i++) {
            var touch = e.changedTouches[i];
            if (touch.identifier == _this.touchId) {
                var winW = window.innerWidth;
                var winH = window.innerHeight;
                var per = GameUtils.getAutoFitSizePre(new Rectangle(0, 0, stage.width, stage.height), new Rectangle(0, 0, winW, winH));
                var stageW = per * stage.width;
                var stageH = per * stage.height;
                var clientX = Browser.onPC ? e.clientX : (_a = e.changedTouches[_this.touchId]) === null || _a === void 0 ? void 0 : _a.clientX;
                var clientY = Browser.onPC ? e.clientY : (_b = e.changedTouches[_this.touchId]) === null || _b === void 0 ? void 0 : _b.clientY;
                var gameClientX = _this.getClientX(e, _this.touchId);
                var gameClientY = _this.getClientY(e, _this.touchId);
                _this.lockRockerMouseX = _this.startRockerBgMouseX + (gameClientX - _this.startClientX);
                _this.lockRockerMouseY = _this.startRockerBgMouseY + (gameClientY - _this.startClientY);
                _this.updateRocker({ touchId: _this.touchId });
                if (winW > stageW) {
                    var eW = (winW - stageW) / 2;
                    if (clientX <= eW || clientX >= eW + stageW) {
                        _this.startWindowMouseUpToStopDragRoker();
                    }
                }
                if (winH > stageH) {
                    var eH = (winH - stageH) / 2;
                    if (clientY <= eH || clientY >= eH + stageH) {
                        _this.startWindowMouseUpToStopDragRoker();
                    }
                }
            }
        }
    };
    GUI_VirtualKeyboard.prototype.startWindowMouseUpToStopDragRoker = function () {
        var _this = GUI_VirtualKeyboard.self;
        if (_this.startWindowMouseUpToStopDragRokered) {
            return;
        }
        _this.startWindowMouseUpToStopDragRokered = true;
        document.addEventListener(this.mouseUpType, _this.doWindowMouseUpToStopDragRoker);
    };
    GUI_VirtualKeyboard.prototype.doWindowMouseUpToStopDragRoker = function (e) {
        var _this = GUI_VirtualKeyboard.self;
        for (var i = 0; i < e.changedTouches.length; i++) {
            var touch = e.changedTouches[i];
            if (touch.identifier == _this.touchId) {
                _this.stopDragRocker(null);
                _this.endBeyondBoundariesHandle();
                _this.startWindowMouseUpToStopDragRokered = false;
                document.removeEventListener(this.mouseUpType, _this.doWindowMouseUpToStopDragRoker);
                _this.lockRockerMouseX = null;
                _this.lockRockerMouseY = null;
            }
        }
    };
    Object.defineProperty(GUI_VirtualKeyboard.prototype, "mouseMoveType", {
        get: function () {
            return Browser.onPC ? "mousemove" : "touchmove";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GUI_VirtualKeyboard.prototype, "mouseUpType", {
        get: function () {
            return Browser.onPC ? "mouseup" : "touchend";
        },
        enumerable: false,
        configurable: true
    });
    GUI_VirtualKeyboard.prototype.getClientX = function (nativeE, touchId) {
        var _a, _b;
        var isOri = (!this.isNativeAPP && stage.screenMode == "horizontal" && stage.width > stage.height);
        var oClientX;
        if (isOri) {
            oClientX = Browser.onPC ? nativeE.clientY : (_a = this.getChangedTouches(nativeE, touchId)) === null || _a === void 0 ? void 0 : _a.clientY;
        }
        else {
            oClientX = Browser.onPC ? nativeE.clientX : (_b = this.getChangedTouches(nativeE, touchId)) === null || _b === void 0 ? void 0 : _b.clientX;
        }
        oClientX = oClientX * Browser.pixelRatio / stage.clientScaleX;
        return oClientX;
    };
    GUI_VirtualKeyboard.prototype.getClientY = function (nativeE, touchId) {
        var _a, _b;
        var isOri = (!this.isNativeAPP && stage.screenMode == "horizontal" && stage.width > stage.height);
        var oClientY;
        if (isOri) {
            oClientY = Browser.onPC ? nativeE.clientX : (_a = this.getChangedTouches(nativeE, touchId)) === null || _a === void 0 ? void 0 : _a.clientX;
            oClientY = stage.height / stage.clientScaleY - oClientY;
        }
        else {
            oClientY = Browser.onPC ? nativeE.clientY : (_b = this.getChangedTouches(nativeE, touchId)) === null || _b === void 0 ? void 0 : _b.clientY;
        }
        oClientY = oClientY * Browser.pixelRatio / stage.clientScaleY;
        return oClientY;
    };
    GUI_VirtualKeyboard.prototype.getChangedTouches = function (nativeE, touchId) {
        for (var i = 0; i < nativeE.changedTouches.length; i++) {
            var touch = nativeE.changedTouches[i];
            if (touch.identifier == touchId) {
                return touch;
            }
        }
        return null;
    };
    Object.defineProperty(GUI_VirtualKeyboard.prototype, "isUseTouch", {
        get: function () {
            return !Browser.onPC && typeof document != "undefined";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GUI_VirtualKeyboard.prototype, "isNativeAPP", {
        get: function () {
            return [0, 2, 3].indexOf(os.platform) == -1;
        },
        enumerable: false,
        configurable: true
    });
    GUI_VirtualKeyboard.VIRTUALKEYBOARD_DIR4_CHANGE = "VIRTUALKEYBOARD_DIR4_CHANGE";
    return GUI_VirtualKeyboard;
}(GUI_12));
//# sourceMappingURL=GUI_VirtualKeyboard.js.map