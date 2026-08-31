/**
 * 场景对象模块-暗雷
 * Created by Karson.DS on 2025-02-17 07:56:55.
 */
class SoModule_HideMine extends SceneObjectModule_6 {
    /**
     * 记录在范围内的初始游戏帧数
     */
    private inRangeStartFrameCount: number;
    /**
     * 下次遇敌的游戏帧计数
     */
    private nextBattleFrameCount: number;
    /**
     * 系统暂停（比如正在执行事件）
     */
    private systemPause: boolean;
    /**
     * 范围
     */
    private rangeRect: Rectangle;
    private radiusCenterPoint: Point;
    private radius2: number;
    private customShapePoints: number[][];
    private recordMyPoint: Point;
    /**
     * 构造函数
     * @param installCB 用于安装模块的属性值
     */
    constructor(installCB: Callback) {
        super(installCB);
        this.init();
    }
    /**
     * 当移除模块时执行的函数
     */
    onRemoved(): void {
        os.remove_ENTERFRAME(this.onUpdate, this);
        EventUtils.removeEventListenerFunction(GameGate, GameGate.EVENT_IN_SCENE_STATE_CHANGE, this.init, this);
    }
    /**
     * 刷新：通常在改变了属性需要调用此函数统一刷新效果
     */
    refresh(): void {

    }
    //------------------------------------------------------------------------------------------------------
    //  
    //------------------------------------------------------------------------------------------------------
    /**
     * 初始化
     */
    private init(): void {
        if (GameGate.gateState < GameGate.STATE_4_PLAYER_CONTROL_START) {
            EventUtils.addEventListenerFunction(GameGate, GameGate.EVENT_IN_SCENE_STATE_CHANGE, this.init, this, null, true);
        }
        else {
            this.onUpdateStart();
        }
        this.refreshRange();
    }
    /**
     * 帧刷开始
     */
    private onUpdateStart(): void {
        this.determineNextBattleTime();
        os.add_ENTERFRAME(this.onUpdate, this);
    }
    /**
     * 刷新（帧刷）
     */
    private onUpdate(): void {
        // -- 暂停时处理或未移动时处理：不记录时间累加
        if (!Game.player.sceneObject.isMoving || this.systemPause) {
            this.offsetNextBattleTime();
            return;
        }
        // -- 刷新范围
        this.refreshRange();
        // -- 确定是否在范围内
        let isInRange = this.isInRange();
        if (isInRange) {
            // -- 超过遇到时间，发生
            if (Game.frameCount >= this.nextBattleFrameCount) {
                this.happenEvent();
            }
        }
        // -- 不在范围内：不记录时间累加
        else {
            this.offsetNextBattleTime();
        }
    }
    /**
     * 确定下一次遇敌的时间
     */
    private determineNextBattleTime(): void {
        this.inRangeStartFrameCount = Game.frameCount;
        this.nextBattleFrameCount = this.inRangeStartFrameCount + MathUtils.rand(this.frequencyUpper - this.frequencyLower) * 60 + this.frequencyLower * 60;
    }
    /**
     * 推进下一次遇敌的时间（执行事件/未在范围内/未移动时）
     */
    private offsetNextBattleTime(): void {
        if (Game.pause) return;
        this.inRangeStartFrameCount++;
        this.nextBattleFrameCount++;
    }
    /**
     * 发生事件
     */
    private happenEvent(): void {
        // -- 发生了事件，确定下一次遇敌的时间
        this.determineNextBattleTime();
        // -- 0-遇敌
        if (this.enemyType == 0) {
            let perCount = 0;
            for (let i = 0; i < this.partys.length; i++) {
                let partyInfo = this.partys[i];
                perCount += partyInfo.appearProbability;
            }
            let rand = MathUtils.rand(perCount);
            let rCount = 0;
            for (let i = 0; i < this.partys.length; i++) {
                let partyInfo = this.partys[i];
                rCount += partyInfo.appearProbability;
                if (rand < rCount) {
                    let enemyParty: Module_Party = GameData.getModuleData(11, partyInfo.partyID);
                    if (!enemyParty || enemyParty.enemys.length == 0) return;
                    Game.player.sceneObject.stopMove();
                    // -- 记录当前的背景音乐和环境音效
                    CommandExecute.recordBeforeBattleState.lastBgmURL = GameAudio.lastBgmURL;
                    CommandExecute.recordBeforeBattleState.lastBGMPitch = GameAudio.lastBGMPitch;
                    CommandExecute.recordBeforeBattleState.lastBGMVolume = GameAudio.lastBGMVolume;
                    CommandExecute.recordBeforeBattleState.lastBgsURL = GameAudio.lastBgsURL;
                    CommandExecute.recordBeforeBattleState.lastBGSPitch = GameAudio.lastBGSPitch;
                    CommandExecute.recordBeforeBattleState.lastBGSVolume = GameAudio.lastBGSVolume;
                    // -- 记录当前场景和事件触发器ID
                    CommandExecute.recordBeforeBattleState.battleTriggerID = -1;
                    CommandExecute.recordBeforeBattleState.battleSceneID = Game.currentScene.id;
                    // 
                    let cp = new CustomCommandParams_9001;
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
        // - 1-自定义事件
        else if (this.enemyType == 1) {
            this.systemPause = true;
            CommandPage.startTriggerFragmentEvent(this.event, Game.player.sceneObject, this.so, Callback.New(() => {
                this.systemPause = false;
            }, this));
        }
    }
    /**
     * 判断是否在范围内
     * @return [boolean] 
     */
    private isInRange(): boolean {
        // -- 矩形
        if (this.type == 0) {
            if (this.rangeRect.contains(Game.player.sceneObject.x, Game.player.sceneObject.y)) {
                return true;
            }
        }
        // -- 圆形
        else if (this.type == 1) {
            if (Point.distanceSquare2(Game.player.sceneObject.x, Game.player.sceneObject.y, this.radiusCenterPoint.x, this.radiusCenterPoint.y) <= this.radius2) {
                return true;
            }
        }
        // -- 数据网格
        else if (this.type == 2) {
            let gridP = Game.player.sceneObject.posGrid;
            if (!Game.currentScene.sceneUtils.isOutsideByGrid(gridP)) {
                let state = Game.currentScene.getDataGridState(3, gridP.x, gridP.y)
                if (state == this.gridNum) {
                    return true;
                }
            }
        }
        // -- 自定义形状
        else if (this.type == 3) {
            let half = WorldData.sceneObjectCollisionSize / 2;
            let p1x = Math.floor(Game.player.sceneObject.x - half), p1y = Math.floor(Game.player.sceneObject.y - half);
            let p2x = Math.floor(Game.player.sceneObject.x + half), p3y = Math.floor(Game.player.sceneObject.y + half);
            let p1 = [p1x, p1y];
            let p2 = [p2x, p1y];
            let p3 = [p2x, p3y];
            let p4 = [p1x, p3y];
            let polygon1 = [p1, p2, p3, p4];
            let res = ProjectUtils.polygonsIntersectTest(polygon1, this.customShapePoints);
            if (res) {
                return true;
            }
        }
        return false;
    }
    /**
     * 刷新我的范围区域
     */
    private refreshRange() {
        // 未改变坐标时不刷新
        if (this.recordMyPoint && this.recordMyPoint.x == this.so.x && this.recordMyPoint.y == this.so.y) return;
        if (!this.recordMyPoint) this.recordMyPoint = new Point(this.so.x, this.so.y);
        else {
            this.recordMyPoint.x = this.so.x;
            this.recordMyPoint.y = this.so.y;
        }
        // -- 矩形
        if (this.type == 0) {
            let w = this.width;
            let h = this.height;
            let myRectX = this.so.x;
            let myRectY = this.so.y;
            if (!this.rangeRect) this.rangeRect = new Rectangle;
            this.rangeRect.x = myRectX;
            this.rangeRect.y = myRectY;
            this.rangeRect.width = w;
            this.rangeRect.height = h;
        }
        // -- 圆形
        else if (this.type == 1) {
            let r = this.radius;
            let offsetX = this.width / 2;
            let offsetY = this.height / 2;
            this.radius2 = r * r;
            if (!this.radiusCenterPoint) this.radiusCenterPoint = new Point;
            this.radiusCenterPoint.x = this.so.x + offsetX;
            this.radiusCenterPoint.y = this.so.y + offsetY;
        }
        // -- 自定义形状
        else if (this.type == 3) {
            this.customShapePoints = [[this.so.x, this.so.y]];
            for (let i = 0; i < this.pointArr.length; i++) {
                let point = this.pointArr[i];
                let p = [this.so.x + point.x, this.so.y + point.y];
                this.customShapePoints.push(p);
            }
        }
        return false;
    }
}