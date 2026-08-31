/**
 * 战斗者的状态
 * Created by 黑暗之神KDS on 2021-01-26 14:30:15.
 */
class GUI_BattlerStatus extends GUI_26 {
    constructor() {
        super();
        this.on(EventObject.DISPLAY, this, this.onDisplay);
    }
    /**
     * 当界面显示时
     */
    private onDisplay() {
        this.refreshActorDataPanel();
        this.refreshStatus();
    }

    /**
     * 刷新角色数据面板
     */
    private refreshActorDataPanel() {
        let battler = GameBattleController.currentOperationBattler;
        if (!battler) return;
        let selectedActor = battler.actor;
        let lv = GameBattleHelper.getLevelByActor(selectedActor);
        // 基本信息
        this.smallAvatar.avatarID = selectedActor.avatar;
        this.actorFace.image = selectedActor.face;
        this.actorName.text = selectedActor.name;
        let classData: Module_Class = GameData.getModuleData(7, selectedActor.class);
        this.actorClass.text = classData ? classData.name : "";
        this.classIcon.image = classData ? classData.icon : "";
        // 等级和经验
        if (selectedActor.growUpEnabled) {
            this.LevelRoot.visible = true;
            let nextExp = Game.getLevelUpNeedExp(selectedActor, lv);
            this.actorExpSlider.value = selectedActor.currentEXP * 100 / nextExp;
        }
        else {
            this.LevelRoot.visible = false;
            this.actorExpSlider.value = 100;
        }
    }
    /**
     * 刷新状态栏
     */
    private refreshStatus() {
        let battler = GameBattleController.currentOperationBattler;
        if (!battler) return;
        let selectedActor = battler.actor;
        let arr = [];
        for (let i = 0; i < selectedActor.status.length; i++) {
            let status = selectedActor.status[i];
            if (!status.icon) continue;
            let d = new ListItem_1028;
            d.icon = status.icon;
            d.tipsLabel = GUI_Manager.statusDesc(status);
            d.layer = status.currentLayer > 1 ? status.currentLayer.toString() : "";
            arr.push(d);
        }
        this.statusList.items = arr;
    }
}