/**
 * #1 道具
 */
class Module_Item {
    id: number;
    name: string;
    icon: string; // = ""; 图标
    intro: string; // = "";
    sell: number; // = 0; 商店售价
    isUse: boolean; // = false; 可使用
    sellEnabled: boolean; // = false; 允许出售给商店
    isConsumables: boolean; // = false; 消耗品
    se: string; // = ""; 使用时音效
    callEvent: string; // = ""; 使用后执行的事件
}
/**
 * #2 元素
 */
class Module_Element {
    id: number;
    name: string;
    image: string; // = ""; 元素图片
    ani: number; // = 0; 攻击效果动画
    textColor: string; // = ""; 字体颜色
    elementBonus: number; // = 0.25; 每个元素数值加成
    isHeal: boolean; // = false; 是否治疗元素
    restrain: number; // = 0; 克制的属性
    restrained: number; // = 0; 被克制的属性
}
/**
 * #3 队伍
 */
class Module_Party {
    id: number;
    name: string;
    enemys: DataStructure_enemyActor[]; // = [];
    background: string; // = ""; 战斗背景图
    battleBGM: string; // = "asset/audio/bgm/Battle_1.ogg"; 战斗音乐
    randEnemy: boolean; // = false; 随机敌人
    randEnemyNumber: number; // = 0; 随机敌人数量
    eventSetting: boolean; // = false; 事件设定
    dropEnabled: boolean; // = false; 额外的掉落设定
    battleStage1_newTurn: string; // = ""; 战斗阶段：新的回合
    battleStage2_beforeAction: string; // = ""; 战斗阶段：行动开始前
    battleStage0_inBattle: string; // = ""; 战斗阶段：开始战斗
    battleStage3_outBattle: string; // = ""; 战斗阶段：结束战斗
    dropGold: number; // = 0; 掉落金币
    dropExp: number; // = 0; 掉落经验值
    dropItems: DataStructure_dropItem[]; // = [];
}
/**
 * #4 角色
 */
class Module_Actor {
    id: number;
    name: string;
    face: string; // = ""; 头像
    avatar: number; // = 0; 行走图
    bttlerAvatar: number; // = 0; 战斗图
    ATK: number; // = 100; 攻击力
    HP: number; // = 100; 生命值
    Heal: number; // = 100; 回复力
    MaxATK: number; // = 100; 最大攻击力
    MaxHP: number; // = 100; 最大生命值
    MaxHeal: number; // = 100; 最大回复力
    MaxLevel: number; // = 60; 最大等级
    ElementType1: number; // = 1; 主元素属性
    ElementType2: number; // = 1; 副元素属性
    useElementType2: boolean; // = false; 使用副元素
    skills: DataStructure_enemySkills[]; // = [];
    isEnemy: boolean; // = false; 是否敌人
    skillsPlayer: Module_Skill[]; // = [];
    attackVoice: string; // = ""; 攻击语音
    hitVoice: string; // = ""; 受击语音
    dieVoice: string; // = ""; 阵亡语音
    dropGold: number; // = 0; 掉落金币
    dropExp: number; // = 0; 掉落经验值
    dropItems: DataStructure_dropItem[]; // = [];
    selfStatus1: number[]; // = [];
    currentEXP: number; // = 0; 当前经验值
    increaseMaxHP: number; // = 0; 增加的最大生命值
    increaseATK: number; // = 0; 增加的攻击力
    increaseHeal: number; // = 0; 增加的回复力
    status: any[]; // = [];
    selfStatus: number[]; // = [];
    dead: boolean; // = false;
}
/**
 * #5 技能
 */
class Module_Skill {
    id: number;
    name: string;
    icon: string; // = ""; 技能图标
    intro: string; // = "";  
    totalCD: number; // = 1; 冷却回合
    releaseActionID: number; // = 3; 释放动作
    releaseTimes: number; // = 1; 攻击次数
    isHeal: boolean; // = false; 是否治疗技能
    elementType1: number; // = 1; 元素类别
    isAll: boolean; // = false; 是否全体
    atkBonus: number; // = 1; 攻击倍率
    heal: number; // = 1; 治疗量
    releaseAnimation: number; // = 0; 释放动画
    hitAnimation: number; // = 1; 击中目标的动画
    selfStatus: number[]; // = [];
    selfRemoveStatus: number[]; // = [];
    addStatus: number[]; // = [];
    removeStatus: number[]; // = [];
    beforeUseEvent: string; // = ""; 使用技能前事件
    afterHitEvent: string; // = ""; 击中目标后事件
}
/**
 * #6 状态
 */
class Module_Status {
    id: number;
    name: string;
    image: string; // = ""; 状态图片
    always: boolean; // = false; 永久状态
    bonus: number; // = 1; 系数
    isHP: boolean; // = false; 使用生命值触发条件
    isTypeBonus: boolean; // = false; 使用属性连击系数
    isHitsBonus: boolean; // = false; 使用连击系数
    isCrossBonus: boolean; // = false; 使用十字系数
    isRowBonus: boolean; // = false; 使用行系数
    isColBonus: boolean; // = false; 使用列系数
    isNumBonus: boolean; // = false; 使用消除元素数量系数
    intro: string; // = "";  
    battler: number; // = 0; 比较对象
    compareHP: number; // = 0; 比较逻辑
    valueHP: number; // = 0; 比较百分比
    hpHitBonus: number; // = 1; 伤害系数
    hpHitedBonus: number; // = 1; 受伤害系数
    type: number; // = 0; 属性
    typeHitBonus: number; // = 1; 伤害系数
    typeHitedBonus: number; // = 1; 受伤害系数
    typeHits: number; // = 1; 达到连击数
    hitValue: number; // = 1; 比较数值
    hitBonus: number; // = 1; 伤害系数
    compareHit: number; // = 0; 比较逻辑
    hitedBonus: number; // = 1; 受伤害系数
    crossHitBonus: number; // = 1; 十字伤害系数
    isMultipleCossBonus: boolean; // = false; 系数叠加
    crossHitedBonus: number; // = 1; 十字受伤害系数
    rowHitBonus: number; // = 1; 行伤害系数
    rowHitedBonus: number; // = 1; 行受伤害系数
    isMultipleRowBonus: boolean; // = false; 系数叠加
    colHitBonus: number; // = 1; 列伤害系数
    colHitedBonus: number; // = 1; 列受伤害系数
    isMultipleColBonus: boolean; // = false; 系数叠加
    Nums: number; // = 0; 消除数量达到
    typeForNum: number; // = 0; 属性
    NumHitBonus: number; // = 1; 伤害系数
    NumHitedBonus: number; // = 1; 受伤害系数
    layer: number; // = 0; 状态层数
}