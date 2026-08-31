/**
 * Created by 六一 on 2026-08-31 10:57:39
 * 玩家技能
 */
class PADPlayerSkill {
    static playerskillAni:GCAnimation[]=[];
    static playerskillText:UIString[]=[];
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
            if(Batter.players[i].actor.skillsPlayer1)cd=GameData.getModuleData(5,Batter.players[i].actor.skillsPlayer1).totalCD;
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
}