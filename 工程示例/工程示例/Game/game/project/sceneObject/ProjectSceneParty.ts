/**
 * 场景上的队伍
 *  处理方案
 *  -- 切换场景时：由系统自动销毁队员，在新场景中会重新创建
 *  -- 角色数据发生变化时：自动刷新样式或创建
 *  -- 主角跳跃/瞬移时：可主动调用createPartyMembers重新创建
 * 
 * Created by Karson.DS on 2025-02-17 11:23:37.
 */
class ProjectSceneParty {
    /**
     * 队员集合
     */
    static members: ProjectClientSceneObject[] = [];
    /**
     * 暂停标识
     */
    static pause: boolean;
    /**
     * 主角轨迹记录
     */
    private static playerTrack: { x: number, y: number, avatarOri: number }[] = [];
    /**
     * 最大步数记录
     */
    private static maxPlayerStep: number;
    /**
     * 初始化
     */
    static start(): void {
        ProjectSceneParty.pause = false;
        this.createPartyMembers();
        os.add_ENTERFRAME(this.update, this);
    }
    static stop(): void {
        ProjectSceneParty.pause = true;
        this.members.length = 0;
        os.remove_ENTERFRAME(this.update, this);
    }
    /**
     * 创建队员
     */
    static createPartyMembers(): void {
        this.playerTrack.length = 0;
        this.clearPartMemberEntity();
        if (Game.player.data.showPartyMember) {
            for (let i = 1; i < Game.player.data.party.length; i++) {
                let p = Game.player.data.party[i];
                this.addMemberEntity(p);
            }
        }
    }
    /**
     * 清空队员实体
     */
    static clearPartMemberEntity(): void {
        for (let i = 0; i < this.members.length; i++) {
            let p = this.members[i];
            p.dispose();
        }
        this.members.length = 0;
    }
    /**
     * 集合队列成员
     * @param clearMembers 集合后清理队列成员
     */
    static collectQueueMembers(clearMembers: boolean, onFin: Function = null): void {
        let frameCount = this.members.length * Game.player.data.partyMemberDis;
        let fixedFrameCount = frameCount;
        this.pause = true;
        os.add_ENTERFRAME(() => {
            this.refreshMembersPos(fixedFrameCount - frameCount);
            frameCount--;
            if (frameCount <= 0) {
                // @ts-ignore
                os.remove_ENTERFRAME(arguments.callee, this);
                this.pause = false;
                this.playerTrack.length = 0;
                if (clearMembers) {
                    this.clearPartMemberEntity();
                    Game.player.data.showPartyMember = false;
                }
                onFin && onFin();
            }
        }, this)
    }
    /**
     * 恢复存档数据
     */
    static retorySaveData(o: any): void {
        o = SinglePlayerGame.getSaveCustomData("__ProjectScenePartyData");
        if (!o) return;
        ProjectSceneParty.members = [];
        for (let i = 0; i < o.members.length; i++) {
            let so = Game.currentScene.sceneObjects[o.members[i]];
            if (so) {
                ProjectSceneParty.members.push(so);
            }
        }
        ProjectSceneParty.playerTrack = o.playerTrack;
        ProjectSceneParty.maxPlayerStep = o.maxPlayerStep;
        ProjectSceneParty.pause = false;
        os.add_ENTERFRAME(this.update, this);
    }
    /**
     * 获取存档数据
     */
    static getSaveData(): any {
        let members = [];
        for (let i = 0; i < ProjectSceneParty.members.length; i++) members.push(ProjectSceneParty.members[i].index);
        return { members: members, playerTrack: ProjectSceneParty.playerTrack, maxPlayerStep: ProjectSceneParty.maxPlayerStep };
    }
    //------------------------------------------------------------------------------------------------------
    // 私有实现
    //------------------------------------------------------------------------------------------------------
    /**
     * 刷新（帧刷）
     */
    private static update(): void {
        if (this.pause) return;
        this.refreshMembers();
        this.refreshMembersPos();
    }
    /**
     * 添加单个队员实体
     * @param ds 角色DS
     */
    private static addMemberEntity(ds: DataStructure_inPartyActor): void {
        let pSo = Game.player.sceneObject;
        let presetSceneObjectData = {
            x: pSo.x,
            y: pSo.y - 1,
            avatarID: ds.actor.avatar,
            avatarAct: 1,
            avatarOri: pSo.avatarOri
        };
        let soc = Game.currentScene.addNewSceneObject(pSo.modelID, presetSceneObjectData) as ProjectClientSceneObject;
        this.installActorData(soc, ds);
        this.members.push(soc);
    }
    /**
     * 刷新队员
     */
    private static refreshMembers(): void {
        // 未开启显示队员则：清空队员
        if (!Game.player.data.showPartyMember) {
            this.clearPartMemberEntity();
        }
        // 开启时：深度对比，重新创建或更改样式
        else {
            if (Game.player.data.party.length - 1 != this.members.length) {
                this.createPartyMembers();
            }
            else {
                for (let i = 1; i < Game.player.data.party.length; i++) {
                    let p = Game.player.data.party[i];
                    let memberEntity = this.members[i - 1];
                    if (memberEntity.avatarID != p.actor.avatar) {
                        this.installActorData(memberEntity, p);
                    }
                }
            }
        }
    }
    /**
     * 刷新队员坐标
     */
    private static refreshMembersPos(collectQueueMembersOffset: number = 0): void {
        let playerSo = Game.player.sceneObject;
        // -- 记录玩家移动轨迹
        if (playerSo.isMoving) {
            ProjectSceneParty.maxPlayerStep = Game.player.data.partyMemberDis * (this.members.length + 1);
            this.playerTrack.push({ x: playerSo.x, y: playerSo.y, avatarOri: playerSo.avatarOri });
            if (this.playerTrack.length > ProjectSceneParty.maxPlayerStep) {
                this.playerTrack.shift();
            }
        }
        // -- 刷新队员的位置和朝向
        for (let i = 0; i < this.members.length; i++) {
            let member = this.members[i];
            let memberStepIndex = this.playerTrack.length - (i + 1) * Game.player.data.partyMemberDis + collectQueueMembersOffset;
            if (memberStepIndex < 0) memberStepIndex = 0;
            else if (collectQueueMembersOffset && memberStepIndex >= this.playerTrack.length) memberStepIndex = this.playerTrack.length - 1;
            let toTrack = this.playerTrack[memberStepIndex];
            if (toTrack) {
                let oldX = member.x, oldY = member.y;
                member.x = toTrack.x;
                member.y = toTrack.y - (collectQueueMembersOffset ? 1 : 0);
                member.avatarOri = toTrack.avatarOri;
                member.avatarAct = (oldX != member.x || oldY != member.y) && member.avatar.hasActionID(2) ? 2 : 1;
            }
            else if (member.avatarAct == 2) member.avatarAct = 1;
        }
    }
    /**
     * 安装角色数据
     */
    private static installActorData(soc: ProjectClientSceneObject, actorDS: DataStructure_inPartyActor) {
        soc.selectEnabled = false;
        soc.through = true;
        soc.autoPlayEnable = true;
        soc.name = actorDS.actor.name;
        let m: DataStructure_partyFPS = ArrayUtils.matchAttributes(Game.player.data.partyFPSSetting, { actor: actorDS.actor.id }, true)[0];
        soc.avatarFPS = m ? m.fps : Game.player.sceneObject.avatarFPS;
    }
}
// 监听引擎初始化：一次
EventUtils.addEventListener(ClientWorld, ClientWorld.EVENT_INITED, Callback.New(() => {
    // 监听场景进入和离开事件
    EventUtils.addEventListenerFunction(GameGate, GameGate.EVENT_IN_SCENE_STATE_CHANGE, (inNewSceneState: number) => {
        // -- 进入场景时：开启和创建
        if (GameGate.gateState == GameGate.STATE_2_START_EXECUTE_IN_SCENE_EVENT) {
            if (inNewSceneState != 2) {
                ProjectSceneParty.start();
            }
            else {
                ProjectSceneParty.retorySaveData(SinglePlayerGame.getSaveCustomData("__ProjectScenePartyData"));
            }
        }
        // -- 离开场景时：关闭
        else if (GameGate.gateState == GameGate.STATE_0_START_EXECUTE_LEAVE_SCENE_EVENT) {
            ProjectSceneParty.stop();
        }
    }, this, null);
}, this), true);
// 存档和读档
SinglePlayerGame.regSaveCustomData(`__ProjectScenePartyData`, Callback.New(() => {
    return ProjectSceneParty.getSaveData();
}, this));