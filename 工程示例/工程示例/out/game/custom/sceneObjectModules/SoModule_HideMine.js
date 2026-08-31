














var SoModule_HideMine = (function (_super) {
    __extends(SoModule_HideMine, _super);
    function SoModule_HideMine(installCB) {
        var _this_1 = _super.call(this, installCB) || this;
        _this_1.init();
        return _this_1;
    }
    SoModule_HideMine.prototype.onRemoved = function () {
        os.remove_ENTERFRAME(this.onUpdate, this);
        EventUtils.removeEventListenerFunction(GameGate, GameGate.EVENT_IN_SCENE_STATE_CHANGE, this.init, this);
    };
    SoModule_HideMine.prototype.refresh = function () {
    };
    SoModule_HideMine.prototype.init = function () {
        if (GameGate.gateState < GameGate.STATE_4_PLAYER_CONTROL_START) {
            EventUtils.addEventListenerFunction(GameGate, GameGate.EVENT_IN_SCENE_STATE_CHANGE, this.init, this, null, true);
        }
        else {
            this.onUpdateStart();
        }
        this.refreshRange();
    };
    SoModule_HideMine.prototype.onUpdateStart = function () {
        this.determineNextBattleTime();
        os.add_ENTERFRAME(this.onUpdate, this);
    };
    SoModule_HideMine.prototype.onUpdate = function () {
        if (!Game.player.sceneObject.isMoving || this.systemPause) {
            this.offsetNextBattleTime();
            return;
        }
        this.refreshRange();
        var isInRange = this.isInRange();
        if (isInRange) {
            if (Game.frameCount >= this.nextBattleFrameCount) {
                this.happenEvent();
            }
        }
        else {
            this.offsetNextBattleTime();
        }
    };
    SoModule_HideMine.prototype.determineNextBattleTime = function () {
        this.inRangeStartFrameCount = Game.frameCount;
        this.nextBattleFrameCount = this.inRangeStartFrameCount + MathUtils.rand(this.frequencyUpper - this.frequencyLower) * 60 + this.frequencyLower * 60;
    };
    SoModule_HideMine.prototype.offsetNextBattleTime = function () {
        if (Game.pause)
            return;
        this.inRangeStartFrameCount++;
        this.nextBattleFrameCount++;
    };
    SoModule_HideMine.prototype.happenEvent = function () {
        var _this_1 = this;
        this.determineNextBattleTime();
        if (this.enemyType == 0) {
            var perCount = 0;
            for (var i = 0; i < this.partys.length; i++) {
                var partyInfo = this.partys[i];
                perCount += partyInfo.appearProbability;
            }
            var rand = MathUtils.rand(perCount);
            var rCount = 0;
            for (var i = 0; i < this.partys.length; i++) {
                var partyInfo = this.partys[i];
                rCount += partyInfo.appearProbability;
                if (rand < rCount) {
                    var enemyParty = GameData.getModuleData(11, partyInfo.partyID);
                    if (!enemyParty || enemyParty.enemys.length == 0)
                        return;
                    Game.player.sceneObject.stopMove();
                    CommandExecute.recordBeforeBattleState.lastBgmURL = GameAudio.lastBgmURL;
                    CommandExecute.recordBeforeBattleState.lastBGMPitch = GameAudio.lastBGMPitch;
                    CommandExecute.recordBeforeBattleState.lastBGMVolume = GameAudio.lastBGMVolume;
                    CommandExecute.recordBeforeBattleState.lastBgsURL = GameAudio.lastBgsURL;
                    CommandExecute.recordBeforeBattleState.lastBGSPitch = GameAudio.lastBGSPitch;
                    CommandExecute.recordBeforeBattleState.lastBGSVolume = GameAudio.lastBGSVolume;
                    CommandExecute.recordBeforeBattleState.battleTriggerID = -1;
                    CommandExecute.recordBeforeBattleState.battleSceneID = Game.currentScene.id;
                    var cp = new CustomCommandParams_9001;
                    cp.battleResultSwitch = 1;
                    cp.allowEscape = true;
                    cp.battleFailHandleType = 0;
                    cp.enemyParty = partyInfo.partyID;
                    cp.removeDeadBattler = this.removeDeadBattler;
                    cp.allowSelectDeadEnemy = this.allowSelectDeadEnemy;
                    cp.useVar = 0;
                    GameBattle.init(cp);
                    GameCommand.startCommonCommand(14020, [], null, Game.player.sceneObject, this.so);
                    return;
                }
            }
        }
        else if (this.enemyType == 1) {
            this.systemPause = true;
            CommandPage.startTriggerFragmentEvent(this.event, Game.player.sceneObject, this.so, Callback.New(function () {
                _this_1.systemPause = false;
            }, this));
        }
    };
    SoModule_HideMine.prototype.isInRange = function () {
        if (this.type == 0) {
            if (this.rangeRect.contains(Game.player.sceneObject.x, Game.player.sceneObject.y)) {
                return true;
            }
        }
        else if (this.type == 1) {
            if (Point.distanceSquare2(Game.player.sceneObject.x, Game.player.sceneObject.y, this.radiusCenterPoint.x, this.radiusCenterPoint.y) <= this.radius2) {
                return true;
            }
        }
        else if (this.type == 2) {
            var gridP = Game.player.sceneObject.posGrid;
            if (!Game.currentScene.sceneUtils.isOutsideByGrid(gridP)) {
                var state = Game.currentScene.getDataGridState(3, gridP.x, gridP.y);
                if (state == this.gridNum) {
                    return true;
                }
            }
        }
        else if (this.type == 3) {
            var half = WorldData.sceneObjectCollisionSize / 2;
            var p1x = Math.floor(Game.player.sceneObject.x - half), p1y = Math.floor(Game.player.sceneObject.y - half);
            var p2x = Math.floor(Game.player.sceneObject.x + half), p3y = Math.floor(Game.player.sceneObject.y + half);
            var p1 = [p1x, p1y];
            var p2 = [p2x, p1y];
            var p3 = [p2x, p3y];
            var p4 = [p1x, p3y];
            var polygon1 = [p1, p2, p3, p4];
            var res = ProjectUtils.polygonsIntersectTest(polygon1, this.customShapePoints);
            if (res) {
                return true;
            }
        }
        return false;
    };
    SoModule_HideMine.prototype.refreshRange = function () {
        if (this.recordMyPoint && this.recordMyPoint.x == this.so.x && this.recordMyPoint.y == this.so.y)
            return;
        if (!this.recordMyPoint)
            this.recordMyPoint = new Point(this.so.x, this.so.y);
        else {
            this.recordMyPoint.x = this.so.x;
            this.recordMyPoint.y = this.so.y;
        }
        if (this.type == 0) {
            var w = this.width;
            var h = this.height;
            var myRectX = this.so.x;
            var myRectY = this.so.y;
            if (!this.rangeRect)
                this.rangeRect = new Rectangle;
            this.rangeRect.x = myRectX;
            this.rangeRect.y = myRectY;
            this.rangeRect.width = w;
            this.rangeRect.height = h;
        }
        else if (this.type == 1) {
            var r = this.radius;
            var offsetX = this.width / 2;
            var offsetY = this.height / 2;
            this.radius2 = r * r;
            if (!this.radiusCenterPoint)
                this.radiusCenterPoint = new Point;
            this.radiusCenterPoint.x = this.so.x + offsetX;
            this.radiusCenterPoint.y = this.so.y + offsetY;
        }
        else if (this.type == 3) {
            this.customShapePoints = [[this.so.x, this.so.y]];
            for (var i = 0; i < this.pointArr.length; i++) {
                var point = this.pointArr[i];
                var p = [this.so.x + point.x, this.so.y + point.y];
                this.customShapePoints.push(p);
            }
        }
        return false;
    };
    return SoModule_HideMine;
}(SceneObjectModule_6));
//# sourceMappingURL=SoModule_HideMine.js.map