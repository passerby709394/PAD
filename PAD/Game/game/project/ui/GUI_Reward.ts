/**
 * 战斗奖励（结算）界面
 * 继承 GUI_1014（界面编号 1014）
 */
class GUI_Reward extends GUI_1014 {
    /** 界面编号 */
    private static readonly UI_ID: number = 1014;
    /** 本次掷骰掉中的奖励（点「确定」时写入背包） */
    private rewardDrops: DataStructure_reward[];
    /**
     * 构造函数
     */
    constructor(){
        super();
        this.rewardDrops = [];
        // 系统界面打开事件
        EventUtils.addEventListenerFunction(GameUI, GameUI.EVENT_OPEN_SYSTEM_UI, this.onUIOpen, this);
        // 点击「确定」：把本次掉落的角色写入背包
        this.sure.once(EventObject.CLICK, this, this.onSureClick);
    }
    //------------------------------------------------------------------------------------------------------
    // 事件
    //------------------------------------------------------------------------------------------------------
    /**
     * 当系统界面打开时（需按 uiID 过滤）
     */
    private onUIOpen(uiID: number): void {
        if (uiID != GUI_Reward.UI_ID) return;
        this.refreshRewards();
    }
    /**
     * 点击「确定」时：把本次掉落的角色写入背包（每次掉中 push 一条独立记录）
     */
    private onSureClick(): void {
        for (let i = 0; i < this.rewardDrops.length; i++) {
            let drop = this.rewardDrops[i];
            if (!drop) continue;
            let ds = new DataStructure_packageItem();
            ds.character = drop.actor;
            ds.level = drop.lv;
            ds.exp = 0;
            Game.player.data.package.push(ds);
        }
        // 清空本次记录，避免重复点击重复发放
        this.rewardDrops = [];
    }
    //------------------------------------------------------------------------------------------------------
    // 奖励列表
    //------------------------------------------------------------------------------------------------------
    /**
     * 按敌人掉落表掷骰刷新奖励列表
     * -- 每个敌人的每条掉落配置各掷一次骰，随机数 <= p 才掉落
     * -- 同一角色被多次掉中时各占一行
     * -- 一件都没掉时追加一条空项占位
     * -- 掉中的记录存到 rewardDrops，供点「确定」时写入背包
     */
    private refreshRewards(): void {
        let arr: ListItem_1002[] = [];
        this.rewardDrops = [];
        // 遍历所有敌人的掉落表
        for (let i = 0; i < Batter.enemys.length; i++) {
            let enemy = Batter.enemys[i];
            if (!enemy || !enemy.actor) continue;
            let drops = enemy.actor.dropItems;
            if (!drops) continue;
            for (let k = 0; k < drops.length; k++) {
                let drop = drops[k];
                if (!drop) continue;
                // 掷骰：随机数 <= 掉落概率才掉落
                let p = drop.p || 0;
                if (Math.random() > p) continue;
                // 掉落的是角色模块数据
                let actor = GameData.getModuleData(4, drop.actor) as Module_Actor;
                if (!actor) continue;
                let d = new ListItem_1002;
                d.data = drop;
                d.icon = actor.face;
                d.itemName = actor.name;
                d.itemNum = "Lv " + drop.lv;
                arr.push(d);
                // 记录掉中的奖励
                this.rewardDrops.push(drop);
            }
        }
        // 一件都没掉：追加一条空项，避免列表一片空白
        if (arr.length == 0) {
            let emptyItem = new ListItem_1002;
            emptyItem.icon = "";
            emptyItem.itemName = "";
            emptyItem.itemNum = "";
            arr.push(emptyItem);
        }
        // 刷新列表
        this.list.items = arr;
    }
}