/**
 * Created by 六一 on 2026-07-28 14:24:35.
 * 战斗者
 * @param actor 战斗者的角色数据
 * @param avatar 战斗者对应的行走图或者卡牌对应的图片组件
 * @param camp 战斗者的阵营：0:敌人，1：玩家
 */
class Batter {
//静态属性    
    /**
     * 全部敌人角色的数组
     */
    static enemys:Batter[]=[];
    /**
     * 全部玩家控制的角色的数组
     */
    static players:Batter[]=[];
//私有属性


//实例属性
    /**
     * 战斗者在阵营队伍中的位置
     */
    index:number;
    /**
     * 战斗者的角色数据
     */
    actor:Module_Actor;
    /**
     * 战斗者的行走图组件或者卡牌图片组件
     */
    avatar:UIAvatar; 
    /**
     * 战斗者的卡牌图片组件
     */
    cardImage:UIBitmap;    
    /**
     * 战斗者的HP滑条组件
     */
    uihpSlider:UISlider;
    /**
     * 战斗者的HP文字组件
     */
    uihpIntro:UIString;  
    /**
     * 战斗者的名字文字组件
     */
    uiname:UIString;   
    /**
     * 战斗者的属性图片组件
     */
    uitype:UIBitmap;               
    /**
     * 战斗者的阵营
     * 0:敌人，1：玩家
     */   
    camp:number; 
    /**
     * 战斗者的等级（初始化的时候填入）
     */   
    level:number;  
    /**
     * 战斗者下次是否全体攻击
     */
    isAllAtk:boolean=false;     
    /**
     * 攻击动画
     */
    atkAniPR: GCAnimation = null;
    /**
     * 攻击数值文本组件（显示在卡图上方）
     */
    atkAniPRtext: UIString = null;
    /**
     * 攻击数值文本动画定时器ID
     */
    _atkTextTicker: number = null;            
    /**
     * 治疗动画
     */
    healAniPR: GCAnimation = null;
    /**
     * 治疗数值文本组件（显示在卡图上方）
     */
    healAniPRtext: UIString = null;
    /**
     * 治疗数值文本动画定时器ID
     */
    _healTextTicker: number = null;
    /**
     * 敌人行动倒计时组件
     */
    aiUseTimer: UIString=null;
    /**
     * 敌人当前技能索引（循环使用技能，初始 0）
     */
    skillIndex: number = 0; 
    /**
     * 敌人本回合是否可以行动
     */
    enemyCanAction:boolean=true;
    /**
     * 各技能已使用次数（与 actor.skills 下标对应），配合技能的 skillTimes 限制使用次数
     */
    skillUsedCounts:number[]=[];
    /**
     * 状态数组
     */
    status:Module_Status[]=[];   
    /**
     * 状态UI
     */
    statusGUI:GUI_1005[]=[];  
    /**
     * CD完成的ui
     */
    uiCDok:GCAnimation=null;
    uiCDhigh:GameSprite=null;
    uiCDlow:GameSprite=null; 
    uiCDtarget:UIBitmap=null;                      

//静态方法
    /**
     * 初始化战斗者
     */
    static init(party:Module_Party){
        //隐藏元素
        PADBattle.battleUI.elementBG.visible=false;
        PADBattle.battleUI.timeImage.visible=false;
        PADBattle.battleUI.comboRoot.visible=false;
        PADBattle.battleUI.comboText.visible=false;        
        //初始化敌人角色
        for (let i=0;i<4;i++){
            let name="Enemy"+String(i);
            //战斗界面行走图组件
            let avatar=PADBattle.battleUI[name]as UIAvatar;
            let nameHP="EnemyHP"+String(i);
            //战斗界面HP组件
            let slider=PADBattle.battleUI[nameHP]as UISlider;
            let nameName="EnemyName"+String(i);
            //战斗界面敌人名字组件
            let uiname=PADBattle.battleUI[nameName]as UIString;
            let nameHPintro="EnemyHPintro"+String(i);
            //战斗界面敌人名字组件
            let uiHPintro=PADBattle.battleUI[nameHPintro]as UIString; 
            let nameType="EnemyType"+String(i); 
            //战斗界面敌人属性图片组件
            let uiType=PADBattle.battleUI[nameType]as UIBitmap;  
            let nameTimer="EnemyTimer"+String(i);  
            //战斗界面敌人倒计时组件
            let uiTimer=PADBattle.battleUI[nameTimer]as UIString;                                 
            avatar.visible=false;
            if(i<party.enemys.length){  
                avatar.visible=true;        
                let enemy=new Batter(GameData.getModuleData(4,party.enemys[i].actor),avatar,0);
                enemy.aiUseTimer=uiTimer;
                enemy.index=i;
                enemy.uihpSlider=slider;
                enemy.uihpIntro=uiHPintro;
                enemy.uiname=uiname;
                enemy.uitype=uiType;
                enemy.avatar.avatarID=enemy.actor.bttlerAvatar;
                enemy.level=party.enemys[i].lv;
                //根据等级计算最大HP                
                enemy.uihpSlider.max=PADhelper.lvToValue(enemy.level,"HP",enemy.actor)
                //等价于HP
                enemy.uihpSlider.value=enemy.uihpSlider.max;
                enemy.uiname.text=enemy.actor.name;
                enemy.uihpIntro.text=`${enemy.uihpSlider.value}/${enemy.uihpSlider.max}`
                enemy.uitype.image=GameData.getModuleData(2,enemy.actor.ElementType1).image
                Batter.enemys.push(enemy);
                // 初始选择技能：从第 0 个开始，满足条件才选中（此时敌人已完全初始化，片段可读取 enemy.hp/level 等）
                PADCondition.selectSkill(enemy, 0);
            }    
        }
        //设置敌人位置
        switch (party.enemys.length) {
        case 1:
            let enemyavatar=Batter.enemys[0].avatar;
            enemyavatar.x=200;
            enemyavatar.y=70;
            enemyavatar.scaleX=1;
            enemyavatar.scaleY=1;
            enemyavatar.actionID=1;
            break; 
        case 2:
            for (let i=0;i<party.enemys.length;i++){
                let enemyavatar=Batter.enemys[i].avatar;
                enemyavatar.x=150+i*(400+66);
                enemyavatar.y=150;
                enemyavatar.scaleX=0.5;
                enemyavatar.scaleY=0.5;
                enemyavatar.actionID=1;                             
            }
            break;
        case 3:
            for (let i=0;i<party.enemys.length;i++){
                let enemyavatar=Batter.enemys[i].avatar;
                enemyavatar.x=150+i*(266+50);
                enemyavatar.y=250-i*100;
                if(enemyavatar.y==50)enemyavatar.y=250;
                enemyavatar.scaleX=0.33;
                enemyavatar.scaleY=0.33;
                enemyavatar.actionID=1;                             
            }            
            break; 
        case 4:
            for (let i=0;i<party.enemys.length;i++){
                let enemyavatar=Batter.enemys[i].avatar;
                i<2?enemyavatar.x=150+i*(466+50):enemyavatar.x=70+(i-2)*(566+110); 
                i<2?enemyavatar.y=150:enemyavatar.y=450;                
                enemyavatar.scaleX=0.33;
                enemyavatar.scaleY=0.33;
                enemyavatar.actionID=1;                             
            }              
            break;                       
        default:            
            break;
        }       
        //初始化玩家角色
        //如果玩家角色不够，兜底放入角色
        if(Game.player.data.party.length!==5){
            for (let i=Game.player.data.party.length;i<5;i++){
                let data:DataStructure_partyActor=new DataStructure_partyActor();
                data.actor=2;
                data.lv=1;
                Game.player.data.party.push(data);
            }
        }
        //初始化玩家血条
        PADBattle.battleUI.PlayerHP.value=0;
        PADBattle.battleUI.PlayerHP.max=0;
        //放入玩家角色
        for (let i=0;i<5;i++){
            let name="PlayerActor"+String(i);
            //战斗界面图片组件
            let card=PADBattle.battleUI[name]as UIBitmap;
            //玩家实例    
            let player=new Batter(GameData.getModuleData(4,Game.player.data.party[i].actor),card,1);
            //玩家角色card位置 
            player.index=i;
            player.uihpSlider=PADBattle.battleUI.PlayerHP;
            player.uihpIntro=PADBattle.battleUI.PlayerHPintro;
            //玩家没有名字的UI
            player.uiname=null;
            //设置卡图
            card.image=player.actor.face;
            player.level=Game.player.data.party[i].lv;
            //根据等级计算最大HP                
            player.uihpSlider.max+=PADhelper.lvToValue(player.level,"HP",player.actor)

            //等价于HP
            player.uihpSlider.value+=player.uihpSlider.max;

            //添加技能监听
            let ui=GameUI.load(1011) as GUI_1011;
            player.cardImage.on(EventObject.MOUSE_OVER,this,()=>{                
                ui.x=player.cardImage.x-50;
               
                let skill=GameData.getModuleData(5,player.actor.skillsPlayer1) as Module_Skill;
                if(!skill)skill=GameData.getModuleData(5,1);
                ui.image.image=skill.icon;
                ui.text.text=skill.name;
                ui.intro.text=skill.intro;
                let height=35+ui.intro.textHeight;
                ui.bg.height=height+15;
                ui.intro.height=ui.intro.textHeight;
                ui.y=player.cardImage.y-height-15;
                GameUI.show(1011);
                
            });
            player.cardImage.on(EventObject.MOUSE_OUT,this,()=>{
                GameUI.hide(1011);
            })
            player.cardImage.on(EventObject.CLICK,this,()=>{
                PADPlayerSkill.use(player.index);
            });

            // 创建动画并附加到目标上
            player.uiCDok = new GCAnimation();
            player.uiCDok.loop = true;
           
            
            player.uihpIntro.text=`${player.uihpSlider.value}/${player.uihpSlider.max}`
            Batter.players.push(player);                   
        }
      
        
        //加载资源：敌人+玩家的行走图、头像、攻击音效、受击音效、阵亡音效
        const avatarIDs: number[] = [];
        const images: string[] = [];
        const audios: string[] = [];
        // 收集敌人资源
        for (const enemy of Batter.enemys) {
            if (enemy.actor.bttlerAvatar) avatarIDs.push(enemy.actor.bttlerAvatar);
            if (enemy.actor.face) images.push(enemy.actor.face);
            if (enemy.actor.attackVoice) audios.push(enemy.actor.attackVoice);
            if (enemy.actor.hitVoice) audios.push(enemy.actor.hitVoice);
            if (enemy.actor.dieVoice) audios.push(enemy.actor.dieVoice);
        }
        // 收集玩家资源
        for (const player of Batter.players) {
            if (player.actor.avatar) avatarIDs.push(player.actor.avatar);
            if (player.actor.face) images.push(player.actor.face);
            if (player.actor.attackVoice) audios.push(player.actor.attackVoice);
            if (player.actor.hitVoice) audios.push(player.actor.hitVoice);
            if (player.actor.dieVoice) audios.push(player.actor.dieVoice);
        }
        audios.push(PADElement.swapSE);
        audios.push(PADElement.removeSE);
        audios.push(PADElement.healSE);

        // 收集自定义模块2（元素属性素材）的图片与动画
        const aniIDs: number[] = [];
        for (let i = 0; i < PADElement.dataIDs.length; i++) {
            let d = GameData.getModuleData(PADElement.MODULE_ID, PADElement.dataIDs[i]);
            if (d && d.image) images.push(d.image);
            if (d && d.ani) aniIDs.push(d.ani);
        }
        // 动画JSON地址（随批次加载，供回调中提取动画音效层的音效）
        const aniJsonUrls: string[] = [];
        for (const aniID of aniIDs) {
            aniJsonUrls.push("asset/json/animation/data/ani" + aniID + ".json");
        }
        // 动画音效层音效地址（从动画JSON提取后单独加载）
        const aniAudios: string[] = [];

        AssetManager.batchPreLoadAsset(
            Callback.New(() => {
                // 动画JSON已就绪：提取各动画音效层（type=3）的音效地址
                for (const aniID of aniIDs) {
                    const json = AssetManager.getJson("asset/json/animation/data/ani" + aniID + ".json");
                    if (json && json.layers) {
                        for (const layer of json.layers) {
                            if (layer.type === 3 && layer.audioInfo && layer.audioInfo.url) {
                                aniAudios.push(layer.audioInfo.url);
                            }
                        }
                    }
                }
                // 动画音效单独加载，加载完成才允许拖动元素
                if (aniAudios.length > 0) {
                    AssetManager.loadAudios(aniAudios, Callback.New(() => {
                        //初始化
                        PADBattle.PADgame.setBusy(false);
                        console.log("初始化中:",PADBattle.PADgame.isBusy);
                    }, null));
                } else {
                    //初始化完成允许拖动元素
                    PADBattle.PADgame.setBusy(false);
                    console.log("初始化完成允许拖动元素:",PADBattle.PADgame.isBusy);
                }
            }, null),
            null,
            images, [], avatarIDs, [], aniIDs, [], aniJsonUrls, audios
        );
        
    }

    //实例方法
    /**
     * 变化HP，1秒内匀速变化（血量步进为整数）
     * @param source 本次HP变化的来源战斗者（如攻击者、治疗者）
     * @param change 变化值（+：治疗，-：扣血）
     * @param type 伤害的类型ID 
     * @param duration 动画长度（毫秒）
     * @param onComplete 动画结束回调
     */
    changeHP(source: Batter, change: number, duration: number,type:number=0, onComplete: () => void = () => {}): number {
        // 敌人受到伤害
        let finalChange:number=change;
        if(this.camp===0&&finalChange<0)finalChange=-PADhelper.damageToEnemy(source,this,-finalChange,type);
        if(this.camp===1&&finalChange>0){
            finalChange=PADhelper.healToPlayer(source,source,finalChange);            
        }
        if(this.camp===1&&finalChange<0){
            finalChange=-PADhelper.damageToPlayer(this,source,-finalChange,type);            
        }        
        // 敌人治疗
        if(this.camp===0&&finalChange>0){
            finalChange=PADhelper.healToEnemy(source,this,finalChange);
        }
        PADanim.startHpAnimation(this,finalChange,duration,onComplete);
        return finalChange;

        
    }
    /**
     * 获取战斗实时hp
     */    
    get hp(): number {
        return this.uihpSlider.value;
    }



//构造函数
    constructor(actor:Module_Actor,avatar:UIAvatar | UIBitmap,camp:number){
        this.actor=actor;
        // 注意：必须检查参数 avatar（此时 this.avatar 还未赋值，为 undefined）
        if (avatar instanceof UIAvatar) {
            this.avatar=avatar;
        } else if (avatar instanceof UIBitmap) {
            this.cardImage=avatar;
        }
        this.camp=camp;
    }    
}