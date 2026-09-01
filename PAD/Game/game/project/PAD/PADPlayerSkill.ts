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
    }
    /**
     * CD推进一回合
     */    
    static cdGO(){
        for (let ui of PADPlayerSkill.playerskillText){
            let cd:number=0;
            ui.text=="OK"?cd=0:cd=Number(ui.text);
            if(cd>0)cd--;
            cd==0?ui.text="OK":ui.text=String(cd);
        }
    }
    /**
     * 使用技能
     * @param index 玩家角色的位置
     */    
    static use(index:number){
        let skillData=PADPlayerSkill.skillData[index];
        if(!skillData)return;
        //todo
        if(PADPlayerSkill.playerskillText[index].text=="OK"){
            //使用主动技能
            let player=Batter.players[index];
            let change=PADhelper.lvToValue(player.level,"ATK",player.actor)*skillData.atkBonus
            let times=skillData.releaseTimes;
            //攻击技能
            // 定义递归攻击函数
            function attackAll(times: number,change:number, onComplete?: Function) {
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

            if (change>0){
                attackAll(times,change)
            }
            //重置CD
            PADPlayerSkill.playerskillText[index].text=String(skillData.totalCD);
        }else{
            return;
        }        
    }  

}