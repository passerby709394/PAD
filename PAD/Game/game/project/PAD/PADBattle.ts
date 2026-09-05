/**
 * Created by 六一 on 2026-07-24 16:31:24.
 * 战斗流程
 */
class PADBattle{
    /**
     * 记录的事件触发器
     */
    static triggerLine:CommandTrigger=null;
    /**
     * 战斗界面
     */  
    static battleUI:GUI_4001;
    /**
     * 转珠界面实例
     */  
    static PADgame:PADPuzzle;  
    /**
     * 战斗结果
     */  
    static win:boolean=null;    
    /**
     * 战斗阶段：1：等待玩家操作（战斗前），2：执行战斗，3：战斗结算
     */  
    static battleStep:number=0;
    /**
     * 当前回合数（从第 1 回合起），每完成一次「玩家行动+敌人行动+结算」+1
     */
    static battleRound:number=1;          
    /**
     * 继续停止的记录的事件触发器
     */    
    static start(){
        if(!PADBattle.triggerLine)return;
        PADBattle.triggerLine.offset(1);
        if(PADBattle.triggerLine){
            CommandPage.executeEvent(PADBattle.triggerLine);
            PADBattle.triggerLine=null;            
        }
    }
    /**
     * 重置所有战斗期静态状态。
     * 在每场战斗开始前（PADBattle.init）调用一次，兜底覆盖所有结束路径
     * （结束指令 15003 / checkGameOver 胜负结算 / 异常中断），
     * 防止上一场残留的静态数组与缓存污染下一场战斗。
     */
    static resetBattle(){
        //PADBattle自身状态
        PADBattle.triggerLine=null;
        PADBattle.battleUI=null;
        PADBattle.PADgame=null;
        PADBattle.win=null;
        PADBattle.battleStep=0;
        PADBattle.battleRound=1;
        //战斗者数组（PADBattle.init / Batter.init 会重新填充）
        Batter.enemys=[];
        Batter.players=[];
        //玩家技能CD相关的数组（init() 是 push 方式，必须清空否则二次开战错位）
        PADPlayerSkill.reset();
        //动画缓存：停掉残留定时器、清队列/累计/飘字状态
        PADanim.resetBattle();
        //敌人技能条件上下文
        PADCondition.reset();
        //转珠静态结果缓存（新的棋盘 start() 后会重新赋值）
        PADPuzzle.lastResult=null;
        PADPuzzle.scoreText=null;
    }
    /**
     * 初始化
     * @param party 敌人队伍数据
     */ 
    static init(party:Module_Party){
        //统一清理上一场残留的所有静态状态
        PADBattle.resetBattle();
        PADBattle.battleUI=new GUI_4001();   
        PADBattle.battleUI.BG.image=party.background;
        
        //敌人初始化
        Batter.init(party);
        //战斗界面渐入
        PADBattle.battleUI.opacity=0;
        Game.layer.uiLayer.addChild(PADBattle.battleUI);
        Tween.to(PADBattle.battleUI,{ opacity: 1 },1000,Ease.linearIn)
        //显示技能名字（1007界面）
        let ui=GameUI.load(1007) as GUI_1007;
        ui.name="skilltips";
        ui.visible=false;
        PADBattle.battleUI.addChild(ui);
        PADPlayerSkill.init();

    } 
    /**
     * 下一战斗阶段
     */ 
    static next(){
        PADBattle.battleStep++;
        switch(PADBattle.battleStep){
            case 1:
                //等待玩家操作的逻辑（战斗前）
                break;
            case 2:
                //执行战斗的逻辑
                PADBattle.PADgame.setBusy(true);
                PADAction.playerAction(PADBattle.PADgame.board.lastComboResults,()=>{
                    PADAction.enemyAction(PADBattle.PADgame.board.lastComboResults,()=>{
                        PADBattle.next()
                       
                        })
                    });
                break;
            case 3:
                //战斗结算的逻辑
                //检查是否结束游戏
                PADhelper.checkGameOver();
                PADBattle.PADgame.setBusy(false);
                //结算完毕重置所有敌人可以行动
                for (const enemy of Batter.enemys) {
                    enemy.enemyCanAction = true; 
                } 
                //推进玩家技能计数
                PADPlayerSkill.cdGO(); 
                //推进状态计数
                for(let enemy of Batter.enemys){
                    if(enemy.hp<=0)continue;
                    for(let state of enemy.status){
                        if(state.always)continue;
                        PADStatus.addEnemyStatus(enemy,state,-1);
                    }
                } 
                for(let state of Batter.players[0].status){
                    if(state.always)continue;
                    PADStatus.addPlayerStatus(Batter.players[0],state,-1)
                }              
                //结算完毕返回玩家操作
                PADBattle.battleStep=1;
                // 结算完毕，进入下一回合
                PADBattle.battleRound++;
                break;
        }
        
    }
    
}

//开始战斗的指令
module CommandExecute {
    /**
     * 自定义命令执行 1表示对应1号命令
     * @param commandPage 事件页
     * @param cmd 当前的事件命令
     * @param trigger 触发器
     * @param triggerPlayer 触发器对应的玩家
     * @param playerInput 玩家输入值，用于暂停执行该触发器事件并等待玩家输入后获得的值，执行完该函数后会被清空
     * @param p 自定义命令参数 1表示对应1号命令的参数
     */
    export function customCommand_15002(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_15002): void {                
        let party=GameData.getModuleData(3,p.enemyParty);
        
        PADBattle.init(party);
        
        // 基础设置：
        PADBattle.win=null;
        //设置元素池
        const strElementIDs = p.UseElement;
        const allElementIDs = strElementIDs.split("-")
        .map(Number)
        .filter(num => !isNaN(num)); 
        PADElement.dataIDs = allElementIDs;
        //设置棋盘数据
        let puzzle = new PADPuzzle({
            cols: p.col,
            rows: p.row,
            elementWidth: p.elementWidth,
            elementHeight: p.elementHeight,
            gap: 8,
            roundTime: p.time // 限时(毫秒)
        });  
        //初始后进入游戏阶段         
        puzzle.start((p)=>{
            //p是当前的PADPuzzle实例，用于获取游戏状态
            PADBattle.next();
        });
        PADBattle.PADgame=puzzle; 

        //记录和暂停事件触发器
        PADBattle.triggerLine=trigger;
        trigger.pause = true;
    }

}

//结束战斗的指令
module CommandExecute {
    /**
     * 自定义命令执行 1表示对应1号命令
     * @param commandPage 事件页
     * @param cmd 当前的事件命令
     * @param trigger 触发器
     * @param triggerPlayer 触发器对应的玩家
     * @param playerInput 玩家输入值，用于暂停执行该触发器事件并等待玩家输入后获得的值，执行完该函数后会被清空
     * @param p 自定义命令参数 1表示对应1号命令的参数
     */
    export function customCommand_15003(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_15003): void {
        Game.layer.uiLayer.removeChild(PADBattle.battleUI);
        PADBattle.battleUI.dispose(); 
        PADBattle.PADgame.dispose()       
        //继续事件触发器
        PADBattle.start()
        
    }

}