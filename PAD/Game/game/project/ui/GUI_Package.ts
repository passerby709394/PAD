/**
 * 背包
 * Created by 黑暗之神KDS on 2020-09-17 14:56:35.
 */
class GUI_Package extends GUI_4 {
    // 使用道具锁定状态
    private useItemLock: boolean; 
    static teamBuild:boolean=false;  
    /**
     * 构造函数
     */
    constructor() {
        super();
        // 标准化列表
        GUI_Manager.standardList(this.list, false);
      
        // 事件监听：当界面显示时
        this.on(EventObject.DISPLAY, this, this.onDisplay);
        // 事件监听：当列表选择项改变时-刷新道具描述
        this.list.on(EventObject.CHANGE, this, this.refreshItemInfo);
  
        // 事件监听：当项选中时-刷新道具
        this.list.on(UIList.ITEM_CLICK, this, this.onItemClick);
       
        // 事件监听：当道具更改时
        EventUtils.addEventListenerFunction(ProjectPlayer, ProjectPlayer.EVENT_CHANGE_ITEM_NUMBER, this.onItemChange, this);
      
        // 事件监听：当创建项对象时
        this.list.onCreateItem = Callback.New(this.onCreateItemUI, this);

        //玩家角色悬停监听
        for(let i=0;i<5;i++){
            let uiPlayer=this["player"+String(i)] as UIRoot;
            uiPlayer.on(EventObject.MOUSE_OVER,this,this.refreshPlayerInfo,[i]);          
        }
    }
    //------------------------------------------------------------------------------------------------------
    // 静态方法
    //------------------------------------------------------------------------------------------------------
    /**
     * 关闭队伍编成模式
     * -- 关闭编成开关（道具点击不再交换、玩家槽位悬停不再选中）
     * -- 隐藏玩家选中框、还原玩家槽位透明度
     * -- 详情栏从「玩家信息」恢复为「当前选中的道具」
     * -- 键盘焦点回到道具列表
     * 界面未创建时（从未开启过背包）只关闭开关，不做界面收尾
     */
    static closeTeamBuild(): void {
        // 关闭编成模式
        GUI_Package.teamBuild = false;
        // 取界面实例（系统组界面未开启过则为 null，此时无显示需要收尾）
        let ui = GameUI.get(4) as GUI_Package;
        if (!ui) return;
        // 隐藏玩家选中框 + 还原玩家槽位透明度
        for (let i = 0; i < 5; i++) {
            let selectBox = ui["select" + String(i)] as UIBitmap;
            if (selectBox) selectBox.visible = false;
            let playerSlot = ui["player" + String(i)] as UIRoot;
            if (playerSlot) playerSlot.alpha = 1;
        }

    }
    //------------------------------------------------------------------------------------------------------
    // 事件
    //------------------------------------------------------------------------------------------------------
    /**
     * 当界面显示时事件
     */
    private onDisplay() {
        // 设置焦点为道具列表
        UIList.focus = this.list;        
        // 刷新道具列表
        this.refreshItems(0);     
        // 刷新选中的道具详情
        this.refreshItemInfo();
        //刷新玩家队伍
        this.refreshPlayer();
        //不选中玩家
        for(let i=0;i<5;i++){
            // if(i==0){
            //     let uiPlayer=this["select0"] as UIBitmap;
            //     uiPlayer.visible=true;
            //     Batter.playerPackageIndex=0;                
            //     continue;
            // }
            let uiPlayer=this["select"+String(i)] as UIBitmap;
            uiPlayer.visible=false;
        }
        GUI_Package.teamBuild=false;        
    }
    /**
     * 当创建项显示对象时
     */
    private onCreateItemUI(ui: GUI_1002, data: ListItem_1002, index: number) {
        let itemDS: DataStructure_packageItem = data.data;
        // 空数据透明化
        if (!itemDS) ui.alpha = 0;
        // 禁用:不可使用的道具
        // if (itemDS && !itemDS.item.isUse) {
        //     // ui.itemName.alpha = ui.icon.alpha = ui.itemNum.alpha = 0.2;
        // }
    }
    /**
     * 当道具发生变更时
     */
    private onItemChange() {
        // 刷新道具（优化：延迟到下一帧渲染前执行，以保证连续多次更改道具后仅刷新一次而非多次）
        Callback.CallLaterBeforeRender(this.refreshItems, this, [0]);
    }
    /**
     * 当道具点击时
     */
    private onItemClick() {
        // 锁定状态下时不触发使用效果
        if (this.useItemLock) return;
        // 提前保存选中索引与数据引用，避免后续刷新导致 selectedItem 失效
        let selectedIndex = this.list.selectedIndex;
        let selectedItem = this.list.selectedItem;
        //构建队伍时
        if (selectedItem && selectedItem.data && GUI_Package.teamBuild) {
            // 被点击的背包项数据（与 package 数组同引用）
            let itemDS: DataStructure_packageItem = selectedItem.data;
            let packageIndex = Game.player.data.package.indexOf(itemDS);
            if (packageIndex < 0) return;
            // 当前选中的玩家槽位
            let partyIndex = Batter.playerPackageIndex;
            if (partyIndex < 0 || partyIndex >= Game.player.data.party.length) return;
            // 播放使用音效
            let actor = GameData.getModuleData(4, itemDS.character) as Module_Actor;
            if (actor && actor.se) GameAudio.playSE(actor.se);
            // 底层数据交换：character/level/exp ↔ actor/lv/exp
            let partyItem = Game.player.data.party[partyIndex];
            let backupCharacter = partyItem.actor;
            let backupLevel = partyItem.lv;
            let backupExp = partyItem.exp;
            partyItem.actor = itemDS.character;
            partyItem.lv = itemDS.level;
            partyItem.exp = itemDS.exp;
            itemDS.character = backupCharacter;
            itemDS.level = backupLevel;
            itemDS.exp = backupExp;
            // 重建显示：玩家槽位 + 道具列表
            this.refreshPlayer();
            this.refreshItems(0);
            // 恢复选中并刷新详情（refreshItems 会重置选中态）
            if (selectedIndex >= 0 && selectedIndex < this.list.length) {
                this.list.selectedIndex = selectedIndex;
            }
            else {
                this.refreshItemInfo();
            }
            // // 可使用道具的情况
            // if (item.isUse) {
            //     // 播放使用音效
            //     if (item.se) GameAudio.playSE(item.se);
            //     // 锁定，在执行完毕事件前不允许再次使用
            //     this.useItemLock = true;
            //     // 执行片段事件
            //     let trigger = CommandPage.startTriggerFragmentEvent(item.callEvent, Game.player.sceneObject, Game.player.sceneObject, Callback.New(() => {
            //         this.useItemLock = false;
            //     }, this));
            //     if (!trigger) this.useItemLock = false;
            //     // 消耗品的情况：道具-1
            //     if (item.isConsumables) ProjectPlayer.changeItemNumber(item.id, -1);
            // }
            // // 否则禁止使用的场合播放禁用音效
            // else {
            //     GameAudio.playSE(WorldData.disalbeSE);
            //     return;
            // }
        }
    }
    //------------------------------------------------------------------------------------------------------
    // 刷新
    //------------------------------------------------------------------------------------------------------
    /**
     * 刷新道具列表
     */
    private refreshItems(state: number) {
        if (state != 0) return;
        let arr: ListItem_1002[] = [];
        // 遍历玩家自定义数据-背包
        for (let i = 0; i < Game.player.data.package.length; i++) {
            // 创建对应的背包物品项数据，该项数据由系统自动生成
            let d = new ListItem_1002;
            // 获取背包的道具DS格式
            let itemDS = Game.player.data.package[i];
            let actor=GameData.getModuleData(4,itemDS.character)as Module_Actor;
            // 绑定项数据，项显示对象会自动根据项数据设置对应的值，参考UIList.api头部注释（CTRL+SHIFT+R搜索UIList.api）
            d.data = itemDS; // 项数据记录对应的道具，以便能够通过项数据找到其对应的道具
            d.icon = actor.face; // 设置图标
            d.itemName = actor.name; // 设置名称
            d.itemNum = "Lv " + itemDS.level.toString(); // 设置角色等级
            arr.push(d);
        }
        // 如果没有道具的话：追加一个空项
        if (Game.player.data.package.length == 0) {
            let emptyItem = new ListItem_1002;
            emptyItem.icon = "";
            emptyItem.itemName = "";
            emptyItem.itemNum = "";
            arr.push(emptyItem)
        }
        // 刷新排列
        // arr.sort((aListItem, bListItem) => {
        //     let a = aListItem.data as DataStructure_packageItem;
        //     let b = bListItem.data as DataStructure_packageItem;
        //     if (!a || !b) return -1;
        //     let actorA=GameData.getModuleData(4,a.character)as Module_Actor;
        //     let actorB=GameData.getModuleData(4,b.character)as Module_Actor;
        //     // -- 等级优先
        //     if (actorA.ElementType1 != actorB.ElementType1) {
        //         return actorA.ElementType1<actorB.ElementType1 ? -1 : 1;
        //     }
        //     // -- 装备按照编号排列
        //     else {
        //         return actorA.id < actorB.id ? -1 : 1;
        //     }
        // });
        // 刷新列表
        this.list.items = arr;
    }
    /**
     * 刷新道具详情
     */
    private refreshItemInfo() {
        // 获取选中的项数据
        let selectedItem = this.list.selectedItem;
        // 未选中任何道具的情况
        if (!selectedItem || !selectedItem.data) {
            this.itemName.text = "";
            this.itemIntro.text = "";
        }
        // 已选中道具的情况：显示该道具详情
        else {
            let itemDS: DataStructure_packageItem = selectedItem.data;
            let actor=GameData.getModuleData(4,itemDS.character)as Module_Actor;
            this.itemName.text = actor.name;
            this.itemIntro.text = actor?.intro;
            let skill1=GameData.getModuleData(5,actor?.skillsPlayer1)as Module_Skill;
            let skill2=GameData.getModuleData(6,actor?.skillsPlayer2)as Module_Status;
            this.itemIntro.text =actor?.intro+"\n"+"\n主动技能："+skill1?.intro+"\n队长技能："+skill2?.intro;   
        }
        this.itemIntro.height = this.itemIntro.textHeight;
        this.itemIntroRoot.refresh();
    }

    //队伍相关
    /**
     * 刷新玩家
     */    
    private refreshPlayer(){
        for(let i =0;i < Game.player.data.party.length;i++){
            let player=GameData.getModuleData(4,Game.player.data.party[i].actor) as Module_Actor;
            let icon="icon"+String(i);
            this[icon].image=player.face;           
            let lv="lv"+String(i);
            this[lv].text="Lv "+Game.player.data.party[i].lv;
            let name="name"+String(i);
            this[name].text=player.name;
        }         
    }
    /**
     * 在详情栏显示指定玩家槽位的角色信息（名称、介绍、技能）
     * @param index 玩家槽位索引（0~4）
     */
    private showActorInfo(index:number){
        let party=Game.player.data.party;
        if(!party || index<0 || index>=party.length)return;
        let actor=GameData.getModuleData(4,party[index].actor) as Module_Actor;
        if(!actor)return;
        this.itemName.text = actor.name;
        this.itemIntro.text = actor.intro;
        let skill1=GameData.getModuleData(5,actor.skillsPlayer1)as Module_Skill;
        let skill2=GameData.getModuleData(6,actor.skillsPlayer2)as Module_Status;
        this.itemIntro.text =actor.intro+"\n"+"\n主动技能："+skill1.intro+"\n队长技能："+skill2.intro;
        this.itemIntro.height = this.itemIntro.textHeight;
        this.itemIntroRoot.refresh();
    }
    /**
     * 在背包界面详情栏显示指定玩家槽位的角色信息
     * 供升级界面选中玩家时调用（不依赖编队模式）
     * @param index 玩家槽位索引（0~4）
     */
    static showPlayerInfo(index:number):void{
        let ui=GameUI.get(4) as GUI_Package;
        if(!ui)return;
        ui.showActorInfo(index);
    }
    /**
     * 刷新背包界面的显示：道具列表 + 队伍槽位
     * 供升级界面确认升级后调用（背包数据已变化）
     */
    static refreshPackage():void{
        let ui=GameUI.get(4) as GUI_Package;
        if(!ui)return;
        ui.refreshItems(0);
        ui.refreshPlayer();
    }
    /**
     * 刷新玩家详情
     */
    private refreshPlayerInfo(index:number) {
        if(!GUI_Package.teamBuild)return;
        Batter.playerPackageIndex=index;
        this.showActorInfo(index);
        for(let i=0;i<5;i++){
            let uiPlayerSelect=this["select"+String(i)] as UIBitmap;
            uiPlayerSelect.visible=false; 
        }
        let uiPlayerSelect=this["select"+String(index)] as UIBitmap;
        uiPlayerSelect.visible=true;         
    }  

}