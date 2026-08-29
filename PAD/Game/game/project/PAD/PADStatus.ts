/**
 * Created by 六一 on 2026-08-25 22:50:31.
 */
class PADStatus {
    /**
     * 为敌人增加状态
     * @param enemy 增加状态的敌人
     * @param status 增加的状态数据
     * @param layers 增加的状态层数(负数减少)
     * @param onComplete 回调函数
     */    
    static addEnemyStatus(enemy:Batter,status:Module_Status,layers:number,onComplete?:Function){
        let index = enemy.status.findIndex(item => item.id === status.id);
        if (index !== -1) {
            let status=enemy.status[index];
            status.layer+=layers;
            if(status.layer>0){
                enemy.statusGUI[index].statusText.text=String(status.layer);
            }else{
                enemy.status.splice(index, 1);
                let statusGUI=enemy.statusGUI.splice(index, 1);
                statusGUI[0].dispose();
            }
        } else {
            //不存在状态，新增状态
            if(layers<0)return;
            let avatar=enemy.avatar
            let statusGUI=new GUI_1005();
            statusGUI.statusImage.image=status.image;
            statusGUI.statusText.text=String(layers);
            avatar.addChild(statusGUI);
            enemy.status.push(status);
            enemy.statusGUI.push(statusGUI);
            let row=(enemy.statusGUI.length - 1) % 9;
            let col=Math.floor(enemy.statusGUI.length/10);
            statusGUI.x=-100+col*60;
            statusGUI.y=50+row*60;
            status.layer=layers;
            //提示栏
            let tipsUI=GameUI.load(1006) as GUI_1006;
            statusGUI.on(EventObject.MOUSE_OVER,PADStatus,()=>{
                tipsUI.x=statusGUI.localToGlobal(new Point(60,0)).x;
                tipsUI.y=statusGUI.localToGlobal(new Point(60,0)).y;
                tipsUI.tipsText.width=200;
                tipsUI.tipsText.text=status.intro;
                tipsUI.tipsText.height=tipsUI.tipsText.textHeight;
                tipsUI.tip.height=tipsUI.tipsText.textHeight+10;
                tipsUI.tipsText.width=tipsUI.tipsText.textWidth;
                tipsUI.tip.width=tipsUI.tipsText.textWidth+10;
                GameUI.show(1006);
                statusGUI.once(EventObject.MOUSE_OUT,PADStatus,()=>{GameUI.hide(1006)})
            })  
        }
        if(onComplete)onComplete();
    }

    /**
     * 为玩家增加状态
     * @param player 增加状态的玩家
     * @param status 增加的状态数据
     * @param layers 增加的状态层数(负数减少)
     * @param onComplete 回调函数
     */    
    static addPlayerStatus(player:Batter,status:Module_Status,layers:number,onComplete?:Function){
        let index = player.status.findIndex(item => item.id === status.id);
        if (index !== -1) {
            let status=player.status[index];
            status.layer+=layers;
            if(status.layer>0){
                player.statusGUI[index].statusText.text=String(status.layer);
            }else{
                player.status.splice(index, 1);
                let statusGUI=player.statusGUI.splice(index, 1);
                statusGUI[0].dispose();
            }
        } else {
            //不存在状态，新增状态
            if(layers<0)return;
            let avatar=PADBattle.battleUI.PlayerHP;
            let statusGUI=new GUI_1005();
            statusGUI.statusImage.image=status.image;
            statusGUI.statusText.text=String(layers);
            avatar.addChild(statusGUI);
            player.status.push(status);
            player.statusGUI.push(statusGUI);

            let col=Math.floor(player.statusGUI.length);
            statusGUI.x=-10+col*60;
            statusGUI.y=-60;
            status.layer=layers;
            //提示栏
            let tipsUI=GameUI.load(1006) as GUI_1006;
            statusGUI.on(EventObject.MOUSE_OVER,PADStatus,()=>{
                tipsUI.x=statusGUI.localToGlobal(new Point(0,0)).x;
                
                tipsUI.tipsText.width=200;
                tipsUI.tipsText.text=status.intro;
                tipsUI.tipsText.height=tipsUI.tipsText.textHeight;
                tipsUI.tip.height=tipsUI.tipsText.textHeight+10;
                tipsUI.tipsText.width=tipsUI.tipsText.textWidth;
                tipsUI.tip.width=tipsUI.tipsText.textWidth+10;
                tipsUI.y=statusGUI.localToGlobal(new Point(60,-tipsUI.tip.height)).y;
                GameUI.show(1006);
                statusGUI.once(EventObject.MOUSE_OUT,PADStatus,()=>{GameUI.hide(1006)})
            })  
        }
        if(onComplete)onComplete();
    }
}

