/**
 * 升级界面
 * 继承 GUI_1013（界面编号 1013）
 */
class GUI_LevelUp extends GUI_1013 {
    /** item 槽位数量（item0 ~ item6） */
    private static readonly SLOT_COUNT: number = 7;
    /** 背包界面的玩家槽位数量（player0 ~ player4） */
    private static readonly PLAYER_COUNT: number = 5;
    /** 选中玩家时，该玩家槽位的透明度 */
    private static readonly SELECTED_SLOT_ALPHA: number = 0.6;
    /** 背包界面编号 */
    private static readonly PACKAGE_UI_ID: number = 4;
    /** 材料槽位数量（item1 ~ item5） */
    private static readonly MATERIAL_SLOT_COUNT: number = 5;
    /** 材料槽位起始 item 序号（从 item1 开始，item0 已被「选中的玩家」占用） */
    private static readonly MATERIAL_SLOT_START: number = 1;
    /** 道具已放入升级界面时，其在道具列表中的透明度 */
    private static readonly PLACED_ITEM_ALPHA: number = 0.6;
    /** 已放入的材料：元素为道具列表索引，紧凑左对齐（下标0 对应 item1） */
    private materials: number[] = [];
    /**
     * 构造函数
     */
    constructor() {
        super();
        // 事件监听：当界面显示时和关闭时
    EventUtils.addEventListenerFunction(GameUI, GameUI.EVENT_OPEN_SYSTEM_UI, this.onDisplay, this);
    EventUtils.addEventListenerFunction(GameUI, GameUI.EVENT_CLOSE_SYSTEM_UI, this.onUndisplay, this);
    }
    //------------------------------------------------------------------------------------------------------
    // 事件
    //------------------------------------------------------------------------------------------------------
    /**
     * 当界面显示时：清空槽位 → 开启玩家点击选中 → 默认选中玩家0
     */
    private onDisplay(uiID:number): void {
        if(uiID!==1013)return;
        GUI_Package.closeTeamBuild();
        this.clearItems();
        // 清空材料放入记录
        this.materials = [];
        this.setPlayerClickEnabled(true);
        this.setPackageClickEnabled(true);
        this.setMaterialSlotClickEnabled(true);
        this.selectPlayer(0);
    }
    /**
     * 当界面隐藏时：清空槽位 → 关闭玩家点击选中 → 还原玩家槽位显示
     */
    private onUndisplay(uiID:number): void {
        if(uiID!==1013)return;
        // 还原已放入道具的列表项透明度 + 清空放入记录
        this.resetMaterials();
        this.setPackageClickEnabled(false);
        this.setMaterialSlotClickEnabled(false);
        this.clearItems();
        this.setPlayerClickEnabled(false);
        this.resetPlayerSelection();
    }
    /**
     * 点击背包界面的玩家槽位时：选中该玩家（对应 item0）
     * @param index 玩家槽位索引（0~4）
     */
    private onPlayerClick(index: number): void {
        this.selectPlayer(index);
        // 与材料放入 item1~item5 一致的音效
        GameAudio.playSE(WorldData.selectSE);
    }
    //------------------------------------------------------------------------------------------------------
    // item 槽位
    //------------------------------------------------------------------------------------------------------
    /**
     * 清空 item0~item6 的图标、名称、数量
     */
    private clearItems(): void {
        for (let i = 0; i < GUI_LevelUp.SLOT_COUNT; i++) {
            let numComp = this["itemNum" + String(i)] as UIString;
            let nameComp = this["itemName" + String(i)] as UIString;
            let iconComp = this["icon" + String(i)] as UIBitmap;
            if (numComp) numComp.text = "";
            if (nameComp) nameComp.text = "";
            if (iconComp) iconComp.image = "";
        }
    }
    //------------------------------------------------------------------------------------------------------
    // 玩家选中
    //------------------------------------------------------------------------------------------------------
    /**
     * 选中玩家：记录索引 → 该槽位半透明 → 角色形象显示到 item0（只显示，不改数据）
     * @param index 玩家槽位索引（0~4）
     */
    private selectPlayer(index: number): void {
        let party = Game.player.data.party;
        if (!party || index < 0 || index >= party.length) return;
        // 记录选中的玩家槽位（供背包界面的交换等逻辑使用）
        Batter.playerPackageIndex = index;
        // 背包界面：选中项半透明 + 显示选中框，其余还原
        let pkg = this.getPackageUI();
        if (pkg) {
            for (let i = 0; i < GUI_LevelUp.PLAYER_COUNT; i++) {
                let slot = pkg["player" + String(i)] as UIRoot;
                if (slot) slot.alpha = (i == index) ? GUI_LevelUp.SELECTED_SLOT_ALPHA : 1;
                let selectBox = pkg["select" + String(i)] as UIBitmap;
                if (selectBox) selectBox.visible = (i == index);
            }
        }
        // 背包界面详情栏显示该玩家的角色信息（与编队模式下悬停玩家槽位一致）
        GUI_Package.showPlayerInfo(index);
        // 显示到 item0（只显示，不写回任何数据）
        let partyItem = party[index];
        let actor = GameData.getModuleData(4, partyItem.actor) as Module_Actor;
        if (!actor) return;
        (this.icon0 as UIBitmap).image = actor.face;
        (this.itemName0 as UIString).text = actor.name;
        (this.itemNum0 as UIString).text = "Lv " + partyItem.lv;
        // 经验条 before：当前状态
        this.setExpSlider(this.before, actor, partyItem.lv, partyItem.exp || 0);

        // 根据 item0 与已放入的材料重算 item6 与 after
        this.refreshItem6();
    }
    /**
     * 还原背包界面所有玩家槽位的显示（透明度 + 选中框）
     */
    private resetPlayerSelection(): void {
        let pkg = this.getPackageUI();
        if (!pkg) return;
        for (let i = 0; i < GUI_LevelUp.PLAYER_COUNT; i++) {
            let slot = pkg["player" + String(i)] as UIRoot;
            if (slot) slot.alpha = 1;
            let selectBox = pkg["select" + String(i)] as UIBitmap;
            if (selectBox) selectBox.visible = false;
        }
    }
    //------------------------------------------------------------------------------------------------------
    // 背包界面玩家槽位点击绑定
    //------------------------------------------------------------------------------------------------------
    /**
     * 开启/关闭背包界面玩家槽位的点击监听
     * @param enabled 是否开启
     */
    private setPlayerClickEnabled(enabled: boolean): void {
        let pkg = this.getPackageUI();
        if (!pkg) return;
        for (let i = 0; i < GUI_LevelUp.PLAYER_COUNT; i++) {
            let slot = pkg["player" + String(i)] as UIRoot;
            if (!slot) continue;
            if (enabled) {
                slot.on(EventObject.CLICK, this, this.onPlayerClick, [i]);
            }
            else {
                slot.off(EventObject.CLICK, this, this.onPlayerClick);
            }
        }
    }
    //------------------------------------------------------------------------------------------------------
    // 材料（item1 ~ item5）
    //------------------------------------------------------------------------------------------------------
    /**
     * 点击道具列表项时：把该道具放入升级界面（紧凑左对齐）
     * -- 同一件道具只能放入一次
     * -- 最多放入 5 件
     * -- 只改显示，不改 Game.player.data.package
     */
    private onPackageItemClick(): void {
        let pkg = this.getPackageUI();
        if (!pkg) return;
        let index = pkg.list.selectedIndex;
        if (index < 0) return;
        // 同一件道具只能放入一次
        if (this.materials.indexOf(index) >= 0) {
            GameAudio.playSE(WorldData.disalbeSE);
            return;
        }
        // 最多只能放入 5 件
        if (this.materials.length >= GUI_LevelUp.MATERIAL_SLOT_COUNT) {
            GameAudio.playSE(WorldData.disalbeSE);
            return;
        }
        // 记录 + 列表项半透明
        this.materials.push(index);
        this.setListItemAlpha(index, GUI_LevelUp.PLACED_ITEM_ALPHA);
        // 刷新槽位显示
        this.refreshMaterialSlots();
        // 重算升级预览
        this.refreshItem6();
        GameAudio.playSE(WorldData.selectSE);
    }
    /**
     * 点击升级界面的材料槽位（item1~item5）时：把该道具放回列表
     * @param slotIndex 槽位下标（0 对应 item1）
     */
    private onMaterialSlotClick(slotIndex: number): void {
        // 空槽位：不可操作
        if (slotIndex < 0 || slotIndex >= this.materials.length) {
            GameAudio.playSE(WorldData.disalbeSE);
            return;
        }
        // 取出该槽位的道具（紧凑左对齐：后面的自动前移）
        let listIndex = this.materials.splice(slotIndex, 1)[0];
        // 列表项恢复不透明，允许重新放入
        this.setListItemAlpha(listIndex, 1);
        // 刷新槽位显示
        this.refreshMaterialSlots();
        // 重算升级预览
        this.refreshItem6();
        GameAudio.playSE(WorldData.cancelSE);
    }
    /**
     * 按 materials 刷新 item1~item5 的图标、名称、等级（只显示，不改数据）
     */
    private refreshMaterialSlots(): void {
        for (let i = 0; i < GUI_LevelUp.MATERIAL_SLOT_COUNT; i++) {
            let slotIndex = GUI_LevelUp.MATERIAL_SLOT_START + i;
            let numComp = this["itemNum" + String(slotIndex)] as UIString;
            let nameComp = this["itemName" + String(slotIndex)] as UIString;
            let iconComp = this["icon" + String(slotIndex)] as UIBitmap;
            // 超出已放入数量的槽位：清空
            let listIndex = this.materials[i];
            let itemDS = (listIndex == null) ? null : Game.player.data.package[listIndex];
            if (!itemDS) {
                if (numComp) numComp.text = "";
                if (nameComp) nameComp.text = "";
                if (iconComp) iconComp.image = "";
                continue;
            }
            // 按背包列表项规格显示
            let actor = GameData.getModuleData(4, itemDS.character) as Module_Actor;
            if (!actor) continue;
            if (numComp) numComp.text = "Lv " + itemDS.level;
            if (nameComp) nameComp.text = actor.name;
            if (iconComp) iconComp.image = actor.face;
        }
    }
    /**
     * 还原所有已放入道具的列表项透明度，并清空放入记录
     */
    private resetMaterials(): void {
        for (let i = 0; i < this.materials.length; i++) {
            this.setListItemAlpha(this.materials[i], 1);
        }
        this.materials = [];
    }
    /**
     * 设置道具列表中某项显示对象的透明度
     */
    private setListItemAlpha(index: number, alpha: number): void {
        let pkg = this.getPackageUI();
        if (!pkg) return;
        let itemUI = pkg.list.getItemUI(index);
        if (itemUI) itemUI.alpha = alpha;
    }
    /**
     * 开启/关闭「道具列表点击放入」的监听
     */
    private setPackageClickEnabled(enabled: boolean): void {
        let pkg = this.getPackageUI();
        if (!pkg) return;
        if (enabled) pkg.list.on(UIList.ITEM_CLICK, this, this.onPackageItemClick);
        else pkg.list.off(UIList.ITEM_CLICK, this, this.onPackageItemClick);
    }
    /**
     * 开启/关闭材料槽位（item1~item5）的点击监听
     */
    private setMaterialSlotClickEnabled(enabled: boolean): void {
        for (let i = 0; i < GUI_LevelUp.MATERIAL_SLOT_COUNT; i++) {
            let slotComp = this["item" + String(GUI_LevelUp.MATERIAL_SLOT_START + i)] as UIRoot;
            if (!slotComp) continue;
            if (enabled) slotComp.on(EventObject.CLICK, this, this.onMaterialSlotClick, [i]);
            else slotComp.off(EventObject.CLICK, this, this.onMaterialSlotClick);
        }
    }
    //------------------------------------------------------------------------------------------------------
    // 工具
    //------------------------------------------------------------------------------------------------------
    /**
     * 获取背包界面实例（未开启过则为 null）
     */
    private getPackageUI(): GUI_Package {
        return GameUI.get(GUI_LevelUp.PACKAGE_UI_ID) as GUI_Package;
    }
    /**
     * 本级所需经验 = 角色基础经验 × 等级
     * @param actor 角色数据（取其 BASE_EXP 作为基础经验）
     * @param lv 当前等级
     */
    private static getRequiredExp(actor: Module_Actor, lv: number): number {
        let level = Math.max(lv || 1, 1);
        return Math.floor(actor.BASE_EXP * level);
    }
    /**
     * 升到 lv 级所需的累计经验（从 1 级起逐级累加需求）
     * @param actor 角色数据（取其 BASE_EXP 作为基础经验）
     * @param lv 目标等级
     */
    private static getTotalExpAtLevel(actor: Module_Actor, lv: number): number {
        let total = 0;
        let level = Math.max(lv || 1, 1);
        for (let k = 1; k < level; k++) {
            total += GUI_LevelUp.getRequiredExp(actor, k);
        }
        return total;
    }
    //------------------------------------------------------------------------------------------------------
    // item6（升级预览）
    //------------------------------------------------------------------------------------------------------
    /**
     * 根据 item0（被升级角色）与已放入的 item1~item5（材料）计算 item6：
     * -- 材料经验 = Σ（升到该材料自身等级的累计经验 + 该材料当前 exp），用材料自己的 BASE_EXP
     * -- 把这笔经验给予 item0 的角色后连续升级，得到结果等级与剩余经验
     * -- item6 显示结果等级，after 滑条显示结果状态，before 滑条保持当前状态
     * -- 纯预览，不写回 Game.player.data.party
     */
    private refreshItem6(): void {
        let party = Game.player.data.party;
        let index = Batter.playerPackageIndex;
        if (!party || index < 0 || index >= party.length) return;
        let partyItem = party[index];
        let actor = GameData.getModuleData(4, partyItem.actor) as Module_Actor;
        if (!actor) return;
        // 当前状态（item0）
        let lv = partyItem.lv || 1;
        let exp = partyItem.exp || 0;
        this.setExpSlider(this.before, actor, lv, exp);
        // 计算结果（与确认时共用同一份计算）
        let result = GUI_LevelUp.calcLevelUpResult(actor, lv, exp, this.getMaterialsExp());
        // item6 = 升级后的状态
        let numComp = this.itemNum6 as UIString;
        let nameComp = this.itemName6 as UIString;
        let iconComp = this.icon6 as UIBitmap;
        if (numComp) numComp.text = "Lv " + result.lv;
        if (nameComp) nameComp.text = actor.name;
        if (iconComp) iconComp.image = actor.face;
        // after 滑条 = 结果状态
        this.setExpSlider(this.after, actor, result.lv, result.exp);
    }
    /**
     * 合计已放入材料能提供的经验
     * -- 每件材料 = 升到该材料自身等级的累计经验 + 该材料当前 exp，用材料自己的 BASE_EXP
     */
    private getMaterialsExp(): number {
        let gainExp = 0;
        for (let i = 0; i < this.materials.length; i++) {
            let matItem = Game.player.data.package[this.materials[i]];
            if (!matItem) continue;
            let matActor = GameData.getModuleData(4, matItem.character) as Module_Actor;
            if (!matActor) continue;
            gainExp += GUI_LevelUp.getTotalExpAtLevel(matActor, matItem.level || 1);
            gainExp += matItem.exp || 0;
        }
        return gainExp;
    }
    //------------------------------------------------------------------------------------------------------
    // 确认升级
    //------------------------------------------------------------------------------------------------------
    /**
     * 确认升级（供按钮/事件调用）
     * 界面未创建时忽略
     */
    static confirmLevelUp(): void {
        let ui = GameUI.get(1013) as GUI_LevelUp;
        if (!ui) return;
        ui.doConfirmLevelUp();
    }
    /**
     * 确认升级的实际处理：
     * 1. 把升级结果（等级 + 剩余经验）写回 item0 所属的队伍数据
     * 2. 删除已放入的素材（整条移除）
     * 3. 刷新背包界面的道具列表与队伍显示
     * 4. 清除素材 item1~item5 的 UI 与放入记录
     * 5. 刷新 item0 / item6 / 经验滑条为升级后的状态
     */
    private doConfirmLevelUp(): void {
        let party = Game.player.data.party;
        let index = Batter.playerPackageIndex;
        if (!party || index < 0 || index >= party.length) return;
        // 没有放入任何材料：忽略
        if (this.materials.length == 0) {
            GameAudio.playSE(WorldData.disalbeSE);
            return;
        }
        let partyItem = party[index];
        let actor = GameData.getModuleData(4, partyItem.actor) as Module_Actor;
        if (!actor) return;
        // 先取出素材的数据引用（删除时数组下标会前移，不能存下标）
        let materialDS: DataStructure_packageItem[] = [];
        for (let i = 0; i < this.materials.length; i++) {
            let itemDS = Game.player.data.package[this.materials[i]];
            if (itemDS) materialDS.push(itemDS);
        }
        // 1) 写回升级结果
        let result = GUI_LevelUp.calcLevelUpResult(actor, partyItem.lv || 1, partyItem.exp || 0, this.getMaterialsExp());
        partyItem.lv = result.lv;
        partyItem.exp = result.exp;
        // 2) 删除素材（整条移除）
        for (let i = 0; i < materialDS.length; i++) {
            let pos = Game.player.data.package.indexOf(materialDS[i]);
            if (pos >= 0) Game.player.data.package.splice(pos, 1);
        }
        // 3) 清除素材记录与 item1~item5 的 UI
        this.materials = [];
        this.refreshMaterialSlots();
        // 4) 刷新背包界面（道具列表 + 队伍显示）
        GUI_Package.refreshPackage();
        // 5) 刷新 item0 / item6 / 滑条为升级后的状态
        this.selectPlayer(index);
        GameAudio.playSE(WorldData.sureSE);
    }
    /**
     * 计算升级结果（预览与确认共用，避免两者算出不同数值）
     * @param actor 被升级的角色数据
     * @param lv 当前等级
     * @param exp 当前等级内的经验
     * @param gainExp 本次给予的经验
     * @returns 结果等级与剩余经验
     */
    private static calcLevelUpResult(actor: Module_Actor, lv: number, exp: number, gainExp: number): { lv: number, exp: number } {
        let maxLevel = actor.MaxLevel || 0;
        let resultLv = Math.max(lv || 1, 1);
        let resultExp = (exp || 0) + (gainExp || 0);
        let need = GUI_LevelUp.getRequiredExp(actor, resultLv);
        while (resultLv < maxLevel && need > 0 && resultExp >= need) {
            resultExp -= need;
            resultLv++;
            need = GUI_LevelUp.getRequiredExp(actor, resultLv);
        }
        // 封顶：多余经验清零
        if (maxLevel > 0 && resultLv >= maxLevel) resultExp = 0;
        return { lv: resultLv, exp: resultExp };
    }
    /**
     * 设置经验滑条：min=0，max=本级所需经验，value=当前经验
     * 已满级时填满
     * @param slider 滑条（before / after）
     * @param actor 角色数据
     * @param lv 等级
     * @param exp 该等级内的经验
     */
    private setExpSlider(slider: UISlider, actor: Module_Actor, lv: number, exp: number): void {
        if (!slider) return;
        let maxLevel = actor.MaxLevel || 0;
        let need = GUI_LevelUp.getRequiredExp(actor, lv);
        slider.min = 0;
        slider.max = need;
        slider.value = (maxLevel > 0 && lv >= maxLevel) ? need : Math.min(exp, need);
    }
}
