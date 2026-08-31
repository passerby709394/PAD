














var SoModule_CustomCollision = (function (_super) {
    __extends(SoModule_CustomCollision, _super);
    function SoModule_CustomCollision(installCB) {
        var _this_1 = _super.call(this, installCB) || this;
        _this_1.init();
        SoModule_CustomCollision.arr.push(_this_1);
        return _this_1;
    }
    SoModule_CustomCollision.prototype.onRemoved = function () {
        os.remove_ENTERFRAME(this.onDebugUpdate, this);
        EventUtils.removeEventListenerFunction(GameGate, GameGate.EVENT_IN_SCENE_STATE_CHANGE, this.init, this);
        SoModule_CustomCollision.arr.splice(SoModule_CustomCollision.arr.indexOf(this), 1);
        if (SoModule_CustomCollision.DEBUG_DRAW) {
            this.so.root.graphics.clear();
        }
    };
    SoModule_CustomCollision.prototype.refresh = function () {
    };
    Object.defineProperty(SoModule_CustomCollision.prototype, "isObstacle", {
        get: function () {
            return !this.so.through;
        },
        enumerable: false,
        configurable: true
    });
    SoModule_CustomCollision.collisionTest = function (target, onlyOne, designatedPoint, onlyCheckObs, conditionFunction) {
        if (designatedPoint === void 0) { designatedPoint = null; }
        if (onlyCheckObs === void 0) { onlyCheckObs = false; }
        if (conditionFunction === void 0) { conditionFunction = null; }
        var targetCustomCollision = target.getModule(SoModule_CustomCollision.PLUGIN_SCENEOBJECT_MODULE_ID);
        if (targetCustomCollision)
            targetCustomCollision.refreshRange(designatedPoint);
        var arr = [];
        for (var i = 0; i < SoModule_CustomCollision.arr.length; i++) {
            var cc = SoModule_CustomCollision.arr[i];
            if (cc.so == target)
                continue;
            if (onlyCheckObs && !cc.isObstacle)
                continue;
            cc.refreshRange();
            if (cc.isInRange(target, targetCustomCollision, designatedPoint)) {
                if (conditionFunction) {
                    var isAddToList = conditionFunction.apply(this, [cc.so, cc]);
                    if (!isAddToList)
                        continue;
                }
                arr.push({ so: cc.so, collision: cc });
                if (onlyOne)
                    break;
            }
        }
        return arr;
    };
    SoModule_CustomCollision.prototype.collisionTestByNormalTarget = function (target) {
        this.refreshRange();
        if (target.avatarID != 0 && this.isInRange(target, null)) {
            return true;
        }
        return false;
    };
    SoModule_CustomCollision.prototype.init = function () {
        if (GameGate.gateState < GameGate.STATE_4_PLAYER_CONTROL_START) {
            EventUtils.addEventListenerFunction(GameGate, GameGate.EVENT_IN_SCENE_STATE_CHANGE, this.init, this, null, true);
        }
        else {
            this.onUpdateStart();
        }
        this.refreshRange();
    };
    SoModule_CustomCollision.prototype.onUpdateStart = function () {
        if (SoModule_CustomCollision.DEBUG_DRAW == null)
            SoModule_CustomCollision.DEBUG_DRAW = WorldData.rectObsDebug && os.inGC() && !Config.RELEASE_GAME;
        if (SoModule_CustomCollision.DEBUG_DRAW)
            os.add_ENTERFRAME(this.onDebugUpdate, this);
    };
    SoModule_CustomCollision.prototype.onDebugUpdate = function () {
        if (!Game.currentScene)
            return;
        var forceRefreshRange = false;
        if (Game.currentScene.camera.scaleX != this.debug_recordCameraScale) {
            this.debug_recordCameraScale = Game.currentScene.camera.scaleX;
            forceRefreshRange = true;
        }
        if (this.so.through != this.debug_recordThrough) {
            this.debug_recordThrough = this.so.through;
            forceRefreshRange = true;
        }
        if (this.so.bridge != this.debug_recordBridge) {
            this.debug_recordBridge = this.so.bridge;
            forceRefreshRange = true;
        }
        if (forceRefreshRange)
            this.refreshRange(null, true);
    };
    SoModule_CustomCollision.prototype.isInRange = function (target, targetCustomCollision, designatedPoint) {
        if (designatedPoint === void 0) { designatedPoint = null; }
        var targetCollisionType;
        var targetCollisionRangeRect;
        var targetCollisionRectPoints;
        var targetX = designatedPoint ? designatedPoint.x : target.x;
        var targetY = designatedPoint ? designatedPoint.y : target.y;
        if (!targetCustomCollision || targetCustomCollision.type == 1) {
            targetCollisionType = 0;
            var rectX = Math.floor(targetX - WorldData.sceneObjectCollisionSize * 0.5);
            var rectY = Math.floor(targetY - WorldData.sceneObjectCollisionSize * 0.5);
            var tr = targetCollisionRangeRect = new Rectangle(rectX, rectY, WorldData.sceneObjectCollisionSize, WorldData.sceneObjectCollisionSize);
            targetCollisionRectPoints = [[tr.x, tr.y], [tr.right, tr.y], [tr.right, tr.bottom], [tr.x, tr.bottom]];
        }
        else {
            targetCollisionType = targetCustomCollision.type;
            if (targetCustomCollision.type == 0) {
                targetCollisionRangeRect = targetCustomCollision.rangeRect;
                targetCollisionRectPoints = targetCustomCollision.rangeRectPoints;
            }
        }
        if (this.type == 0) {
            if (targetCollisionType == 0) {
                return this.rangeRect.intersects(targetCollisionRangeRect);
            }
            else if (targetCollisionType == 2) {
                return ProjectUtils.polygonsIntersectTest(targetCustomCollision.customShapePoints, this.rangeRectPoints);
            }
        }
        else if (this.type == 1) {
            return Point.distanceSquare2(targetX, targetY, this.radiusCenterPoint.x, this.radiusCenterPoint.y) <= this.radius2;
        }
        else if (this.type == 2) {
            if (targetCollisionType == 0) {
                var r = ProjectUtils.polygonsIntersectTest(targetCollisionRectPoints, this.customShapePoints);
                return r;
            }
            else if (targetCollisionType == 2) {
                return ProjectUtils.polygonsIntersectTest(targetCustomCollision.customShapePoints, this.customShapePoints);
            }
        }
        return false;
    };
    SoModule_CustomCollision.prototype.refreshRange = function (designatedPoint, force) {
        if (designatedPoint === void 0) { designatedPoint = null; }
        if (force === void 0) { force = false; }
        var px = designatedPoint ? designatedPoint.x : this.so.x;
        var py = designatedPoint ? designatedPoint.y : this.so.y;
        if (!force && this.recordMyPoint && this.recordMyPoint.x == px && this.recordMyPoint.y == py)
            return;
        if (!this.recordMyPoint)
            this.recordMyPoint = new Point(px, py);
        else {
            this.recordMyPoint.x = px;
            this.recordMyPoint.y = py;
        }
        if (this.type == 0) {
            var w = this.width;
            var h = this.height;
            var myRectX = px + this.offsetX;
            var myRectY = py + this.offsetY;
            if (!this.rangeRect)
                this.rangeRect = new Rectangle;
            this.rangeRect.x = myRectX;
            this.rangeRect.y = myRectY;
            this.rangeRect.width = w;
            this.rangeRect.height = h;
            this.rangeRectPoints = [[this.rangeRect.x, this.rangeRect.y], [this.rangeRect.right, this.rangeRect.y], [this.rangeRect.right, this.rangeRect.bottom], [this.rangeRect.x, this.rangeRect.bottom]];
            if (SoModule_CustomCollision.DEBUG_DRAW) {
                this.so.root.graphics.clear();
                var r = this.rangeRect;
                this.so.root.graphics.drawLines(0, 0, [r.x - px, r.y - py, r.right - px, r.y - py, r.right - px, r.bottom - py, r.x - px, r.bottom - py, r.x - px, r.y - py], ProjectClientScene.getDebugColorBySceneObject(this.so), 2);
            }
        }
        else if (this.type == 1) {
            var r = this.radius;
            this.radius2 = r * r;
            if (!this.radiusCenterPoint)
                this.radiusCenterPoint = new Point;
            this.radiusCenterPoint.x = px;
            this.radiusCenterPoint.y = py;
            if (SoModule_CustomCollision.DEBUG_DRAW) {
                this.so.root.graphics.clear();
                this.so.root.graphics.drawCircle(0, 0, Math.floor(this.radius), null, ProjectClientScene.getDebugColorBySceneObject(this.so), 1);
            }
        }
        else if (this.type == 2) {
            this.customShapePoints = [[px, py]];
            var debugArr = void 0;
            if (SoModule_CustomCollision.DEBUG_DRAW)
                debugArr = [0, 0];
            for (var i = 0; i < this.pointArr.length; i++) {
                var point = this.pointArr[i];
                var p = [px + point.x, py + point.y];
                this.customShapePoints.push(p);
                if (SoModule_CustomCollision.DEBUG_DRAW)
                    debugArr.push(point.x, point.y);
            }
            if (SoModule_CustomCollision.DEBUG_DRAW) {
                debugArr.push(0, 0);
                this.so.root.graphics.clear();
                this.so.root.graphics.drawLines(0, 0, debugArr, ProjectClientScene.getDebugColorBySceneObject(this.so), 2);
            }
        }
        return false;
    };
    SoModule_CustomCollision.PLUGIN_SCENEOBJECT_MODULE_ID = 4;
    SoModule_CustomCollision.arr = [];
    return SoModule_CustomCollision;
}(SceneObjectModule_4));
//# sourceMappingURL=SoModule_CustomCollision.js.map