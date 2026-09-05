/**
 * Created by 六一 on 2026-08-31 10:57:39
 * 玩家技能
 */
class PADPlayerSkill {
    /**
     * CD的动画UI
     */    
    static playerskillAni:GCAnimation[]=[];
    /**
     * CD值的字符串UI
     */    
    static playerskillText:UIString[]=[];
    /**
     * 玩家主动技能数据
     */    
    static skillData:Module_Skill[]=[];
    /**
     * 玩家队长技能的UI
     */    
    static leaderSkillUI:GUI_1012=null;        
    /**
     * 重置战斗期静态状态（每场战斗开始前由 PADBattle.resetBattle 调用）。
     * init() 采用 push 方式填充这些数组，若不清空，下一场战斗会读到上一场的旧对象/错位数据。
     */    
    static reset(){
        PADPlayerSkill.playerskillAni=[];
        PADPlayerSkill.playerskillText=[];
        PADPlayerSkill.skillData=[];
        PADPlayerSkill.leaderSkillUI=null;
    }
    /**
     * 初始化技能CD
     */    
    static init(){
        for (let i=0;i<Batter.players.length;i++){
            let name="PlayerActor"+String(i);
            //战斗界面图片组件
            let card=PADBattle.battleUI[name]as UIBitmap;

            let animation=new GCAnimation();
            animation.id=4007;
            animation.x=card.width-50;
            animation.y=0;
            animation.loop=true;
            animation.currentFrame=1;
            card.addChild(animation);
            animation.play();
            PADPlayerSkill.playerskillAni.push(animation);

            let textCD=new UIString();
            let cd:number=0;
            if(Batter.players[i].actor.skillsPlayer1){
                
                PADPlayerSkill.skillData.push(GameData.newModuleData(5,Batter.players[i].actor.skillsPlayer1))
                cd=PADPlayerSkill.skillData[i].totalCD;
            }else{
                PADPlayerSkill.skillData.push(null)
            }

            textCD.text=String(cd==0?"OK":cd);
            textCD.color="#000000" ;
            textCD.width=48;
            textCD.align=1;
            textCD.x=card.width-48;
            textCD.y=18;
            textCD.bold=true;  
            card.addChild(textCD);
            PADPlayerSkill.playerskillText.push(textCD);
        }
        //队长技能
        let skillData=GameData.newModuleData(6,Batter.players[0].actor.skillsPlayer2) as Module_Status;
        skillData.always=true;
        PADPlayerSkill.leaderSkillUI=new GUI_1012();
        PADPlayerSkill.leaderSkillUI.x=PADBattle.battleUI.elementBG.x+PADBattle.battleUI.elementBG.width*0.2;
        PADPlayerSkill.leaderSkillUI.y=50;
        PADPlayerSkill.leaderSkillUI.bg.width=PADBattle.battleUI.elementBG.width*0.6+10;
        PADPlayerSkill.leaderSkillUI.intro.width=PADBattle.battleUI.elementBG.width*0.6;
        PADPlayerSkill.leaderSkillUI.image.image=skillData.image;
        PADPlayerSkill.leaderSkillUI.text.text=skillData.name;
        PADPlayerSkill.leaderSkillUI.intro.text=skillData.intro;
        PADPlayerSkill.leaderSkillUI.intro.height=PADPlayerSkill.leaderSkillUI.intro.textHeight;
        PADPlayerSkill.leaderSkillUI.image.x=PADPlayerSkill.leaderSkillUI.bg.width/2-PADPlayerSkill.leaderSkillUI.text.textWidth/2-PADPlayerSkill.leaderSkillUI.image.width;
        PADPlayerSkill.leaderSkillUI.text.x=PADPlayerSkill.leaderSkillUI.bg.width/2-PADPlayerSkill.leaderSkillUI.text.textWidth/2;
        PADPlayerSkill.leaderSkillUI.bg.height=PADPlayerSkill.leaderSkillUI.text.textHeight+PADPlayerSkill.leaderSkillUI.intro.textHeight+30;
        PADBattle.battleUI.addChild(PADPlayerSkill.leaderSkillUI);
        Batter.players[0].status.push(skillData);
    }
    /**
     * CD推进一回合
     * @param i 单独减少某个位置的玩家技能CD（0开始计算），默认-1（全体）
     */    
    static cdGO(i:number=-1){
        let uiList=PADPlayerSkill.playerskillText;
        
        for (let ui of uiList){
            let index=uiList.indexOf(ui);
            let player=Batter.players[index];
            if(i>=0 && index!==i)continue;
            let cd:number=0;
            ui.text=="OK"?cd=0:cd=Number(ui.text);
            if(cd>0)cd--;
            cd==0?ui.text="OK":ui.text=String(cd);
            //如果CD完成，加一个完成CD的动画到卡片上
            if(ui.text=="OK"){
             
                if(player.uiCDok.id!=undefined){
                    player.uiCDok.play();
                }else{
                    player.uiCDok.id=4008;
                    //添加CD完成时的动画
                    // 创建底层
                    player.uiCDlow = new GameSprite();
                    // 创建高层
                    player.uiCDhigh = new GameSprite();
                    // 创建容器，用于装载Avatar
                    let root = new GameSprite();
                    root.x = player.cardImage.x;
                    root.y = player.cardImage.y;
                    player.uiCDtarget=new UIBitmap();
                    player.uiCDtarget.image=player.cardImage.image;
                    player.uiCDtarget.height=player.cardImage.height;
                    player.uiCDtarget.width=player.cardImage.width;
                    // 将底层、Avatar、高层分别塞入容器
                    root.addChild(player.uiCDlow);
                    root.addChild(player.uiCDtarget);
                    root.addChild(player.uiCDhigh);
                    // 添加到舞台上
                    let index=PADBattle.battleUI.getChildIndex(player.cardImage);
                    PADBattle.battleUI.addChildAt(root,index);
                    player.uiCDok.addToGameSprite(player.uiCDtarget, player.uiCDlow, player.uiCDhigh);
                    player.uiCDok.play();
                }

            }

        }
    }
    /**
     * 使用技能
     * @param index 玩家角色的位置
     */    
    static use(index:number){
        let skillData=PADPlayerSkill.skillData[index];
        if(!skillData)return;
        if(PADBattle.battleStep!==1)return;
        let player=Batter.players[index];
        
        
        if(PADPlayerSkill.playerskillText[index].text=="OK" && !PADBattle.PADgame.isBusy ){
            player.uiCDok.removeFromGameSprite();
            PADBattle.PADgame.setBusy(true);
            //显示技能提示
            let skillTips=PADBattle.battleUI.getChildByName("skilltips") as GUI_1007;
            skillTips.x=player.uihpSlider.x+player.uihpSlider.width/2-skillTips.tip.width/2;
            skillTips.tipsText.text=skillData.name;
            skillTips.y=player.uihpSlider.y-40;
            skillTips.visible=true;            
            //使用主动技能
            
            let change=PADhelper.lvToValue(player.level,"ATK",player.actor)*skillData.atkBonus
            let times=skillData.releaseTimes;
            //增减敌人状态          
            for(let stateIndex of skillData.addStatus){
                for(let i=0;i<Batter.enemys.length;i++){
                    let enemy=Batter.enemys[i];
                    if(enemy.hp<=0)continue;
                    let state=GameData.newModuleData(6,stateIndex) as Module_Status;
                    PADStatus.addEnemyStatus(enemy,state,1)
                }                
            }
            for(let stateIndex of skillData.removeStatus){
                for(let i=0;i<Batter.enemys.length;i++){
                    let enemy=Batter.enemys[i];
                    if(enemy.hp<=0)continue;
                    let state=GameData.newModuleData(6,stateIndex) as Module_Status;
                    PADStatus.addEnemyStatus(enemy,state,-1)
                }                
            }            
            //攻击技能
            // 定义递归攻击函数（const 箭头：函数声明不允许出现在 if 块内(ES5严格模式 TS1251)）
            const attackAll = (times: number,change:number, onComplete?: Function) => {
                // 如果剩余次数 ≤ 0，直接结束（调用完成回调）
                if (times <= 0) {
                    if (onComplete) onComplete();
                    return;
                }
                times--;
                let check=false;
                PADanim.playerAtkPR(player, change,false,() => {
                    PADanim.playerAllAtk(player,()=>{
                        // 如果还有剩余次数（times > 0），继续递归执行下一次攻击
                        if (times > 0) {
                            //检查是否结束游戏
                            check=PADhelper.checkGameOver();
                            if(check)return;
                            setTimeout(()=>{
                                attackAll(times,change,onComplete);  // 传递剩余次数和同一个结束回调
                            },player.atkAniPR.totalFrame / (player.atkAniPR.fps || Config.ANIMATION_FPS) * 1000)
                            
                        } else {
                            // 所有攻击次数用尽，调用外部传入的完成回调（若有）
                            if (onComplete) onComplete();
                            //检查是否结束游戏
                            check=PADhelper.checkGameOver();
                            if(check)return;                            
                        }                        
                    })

                });
            }

            if (change>0 && !skillData.isHeal && !skillData.onlyState){
                attackAll(times,change,()=>{
                    PADBattle.PADgame.setBusy(false);
                    skillTips.visible=false;
                })
            }

            //治疗技能
            if(skillData.isHeal && !skillData.onlyState){
                let change=PADhelper.lvToValue(player.level,"Heal",player.actor)*skillData.healBonus;
                PADanim.playerHealPR(player,change,3,false,()=>{
                    PADanim.playerHeal(()=>{
                        PADhelper.checkGameOver();
                        PADBattle.PADgame.setBusy(false);
                        skillTips.visible=false;
                    });
                })
            }

            //增减玩家状态
            for(let i of skillData.selfStatus){
                let status=GameData.newModuleData(6,i) as Module_Status;
                PADStatus.addPlayerStatus(Batter.players[0],status,1);
            }
            for(let i of skillData.selfRemoveStatus){
                let status=GameData.newModuleData(6,i) as Module_Status;
                PADStatus.addPlayerStatus(Batter.players[0],status,-1);
            }
            if(skillData.onlyState){
                PADBattle.PADgame.setBusy(false);
                skillTips.visible=false;
            }            

            //重置CD
            PADPlayerSkill.playerskillText[index].text=String(skillData.totalCD);
        }else{
            return;
        }        
    }  

}