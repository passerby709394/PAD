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

    /**
     * 计算状态对伤害的影响（HP条件等），返回应用状态后的最终伤害
     * @param source 伤害来源战斗者（攻击方）
     * @param target 受伤的战斗者（受击方）
     * @param damage 原始伤害
     * @param type 伤害的类型ID
     * @returns 应用状态后的伤害
     */
    static calcStatusDamage(source: Batter, target: Batter, damage: number, type: number): number {
        let finalDamage = damage;
        //比较HP条件的函数     
        function conditionHP(battler:Batter){
            for(let i=0;i<battler.status.length;i++){
                let status=battler.status[i];
                if(status.isHP){
                    switch(status.compareHP){
                        case 0:
                            if(battler.camp==source.camp){
                                if(battler.uihpSlider.value>battler.uihpSlider.max*status.valueHP/100)finalDamage *=status.hpHitBonus;
                            }                            
                            if(battler.camp==target.camp){
                                if(battler.uihpSlider.value>battler.uihpSlider.max*status.valueHP/100)finalDamage *=status.hpHitedBonus;
                            };
                            break;
                       case 1:
                            if(battler.camp==source.camp){
                                if(battler.uihpSlider.value>=battler.uihpSlider.max*status.valueHP/100)finalDamage *=status.hpHitBonus;
                            }  
                            if(battler.camp==target.camp){
                                if(battler.uihpSlider.value>=battler.uihpSlider.max*status.valueHP/100)finalDamage *=status.hpHitedBonus;
                            };
                            break;
                       case 2:
                            if(battler.camp==source.camp){
                                if(battler.uihpSlider.value==battler.uihpSlider.max*status.valueHP/100)finalDamage *=status.hpHitBonus;
                            }  
                            if(battler.camp==target.camp){
                                if(battler.uihpSlider.value==battler.uihpSlider.max*status.valueHP/100)finalDamage *=status.hpHitedBonus;
                            };
                            break; 
                       case 3:
                            if(battler.camp==source.camp){
                                if(battler.uihpSlider.value<=battler.uihpSlider.max*status.valueHP/100)finalDamage *=status.hpHitBonus;
                            }  
                            if(battler.camp==target.camp){
                                if(battler.uihpSlider.value<=battler.uihpSlider.max*status.valueHP/100)finalDamage *=status.hpHitedBonus;
                            };
                            break;  
                       case 4:
                            if(battler.camp==source.camp){
                                if(battler.uihpSlider.value<battler.uihpSlider.max*status.valueHP/100)finalDamage *=status.hpHitBonus;
                            }  
                            if(battler.camp==target.camp){
                                if(battler.uihpSlider.value<battler.uihpSlider.max*status.valueHP/100)finalDamage *=status.hpHitedBonus;
                            };
                            break;                                                                                                             
                        default:
                            break;
                    }
                }
            }
        }

        //使用属性系数
        function isTypeBonus(battler:Batter){
            for(let i=0;i<battler.status.length;i++){
                let status=battler.status[i];
                if(status.isTypeBonus){
                    //如果消除的元素类型是 status.type，且达到连击数 status.typeHits
                    if(type==status.type && PADPuzzle.lastResult.lastComboCount>=status.typeHits){
                        if(battler.camp==source.camp){
                            finalDamage *=status.typeHitBonus;
                        }
                        if(battler.camp==target.camp){
                            finalDamage *=status.typeHitedBonus;
                        }
                    }
                }
            }
        }

        //使用连击系数
        function isHitsBonus(battler:Batter){
            for(let i=0;i<battler.status.length;i++){
                let status=battler.status[i];
                if(status.isHitsBonus){
                    //按 compareHit 比较当前连锁数与 hitValue
                    let hit=false;
                    switch(status.compareHit){
                        case 0:
                            hit=PADPuzzle.lastResult.lastComboCount>status.hitValue;
                            break;
                        case 1:
                            hit=PADPuzzle.lastResult.lastComboCount>=status.hitValue;
                            break;
                        case 2:
                            hit=PADPuzzle.lastResult.lastComboCount==status.hitValue;
                            break;
                        case 3:
                            hit=PADPuzzle.lastResult.lastComboCount<=status.hitValue;
                            break;
                        case 4:
                            hit=PADPuzzle.lastResult.lastComboCount<status.hitValue;
                            break;
                        default:
                            break;
                    }
                    if(hit){
                        if(battler.camp==source.camp){
                            finalDamage *=status.hitBonus;
                        }
                        if(battler.camp==target.camp){
                            finalDamage *=status.hitedBonus;
                        }
                    }
                }
            }
        }

        //使用十字系数
        function isCrossBonus(battler:Batter){
            for(let i=0;i<battler.status.length;i++){
                let status=battler.status[i];
                if(status.isCrossBonus){
                    //本次消除的十字数量
                    let crossCount=PADPuzzle.lastResult.lastCrossCount;
                    if(crossCount>0){
                        if(battler.camp==source.camp){
                            if(status.isMultipleCossBonus){
                                finalDamage *=Math.pow(status.crossHitBonus,crossCount);
                            }else{
                                finalDamage *=status.crossHitBonus;
                            }
                        }
                        if(battler.camp==target.camp){
                            if(status.isMultipleCossBonus){
                                finalDamage *=Math.pow(status.crossHitedBonus,crossCount);
                            }else{
                                finalDamage *=status.crossHitedBonus;
                            }
                        }
                    }
                }
            }
        }

        //使用行系数
        function isRowBonus(battler:Batter){
            for(let i=0;i<battler.status.length;i++){
                let status=battler.status[i];
                if(status.isRowBonus){
                    //本次消除的整行数量
                    let rowCount=PADPuzzle.lastResult.lastFullRowCount;
                    if(rowCount>0){
                        if(battler.camp==source.camp){
                            if(status.isMultipleRowBonus){
                                finalDamage *=Math.pow(status.rowHitBonus,rowCount);
                            }else{
                                finalDamage *=status.rowHitBonus;
                            }
                        }
                        if(battler.camp==target.camp){
                            if(status.isMultipleRowBonus){
                                finalDamage *=Math.pow(status.rowHitedBonus,rowCount);
                            }else{
                                finalDamage *=status.rowHitedBonus;
                            }
                        }
                    }
                }
            }
        }

        //使用列系数
        function isColBonus(battler:Batter){
            for(let i=0;i<battler.status.length;i++){
                let status=battler.status[i];
                if(status.isColBonus){
                    //本次消除的整列数量
                    let colCount=PADPuzzle.lastResult.lastFullLineCount;
                    if(colCount>0){
                        if(battler.camp==source.camp){
                            if(status.isMultipleColBonus){
                                finalDamage *=Math.pow(status.colHitBonus,colCount);
                            }else{
                                finalDamage *=status.colHitBonus;
                            }
                        }
                        if(battler.camp==target.camp){
                            if(status.isMultipleColBonus){
                                finalDamage *=Math.pow(status.colHitedBonus,colCount);
                            }else{
                                finalDamage *=status.colHitedBonus;
                            }
                        }
                    }
                }
            }
        }

        //使用消除类型数量系数
        function isNumBonus(battler:Batter){
            for(let i=0;i<battler.status.length;i++){
                let status=battler.status[i];
                if(status.isNumBonus){
                    //typeForNum 元素本次消除的数量
                    let elementData=GameData.getModuleData(PADElement.MODULE_ID,status.typeForNum);
                    if(elementData){
                        let numCount=PADPuzzle.lastResult.lastByType[elementData.name]||0;
                        if(numCount>=status.Nums){
                            if(battler.camp==source.camp){
                                finalDamage *=status.NumHitBonus;
                            }
                            if(battler.camp==target.camp){
                                finalDamage *=status.NumHitedBonus;
                            }
                        }
                    }
                }
            }
        }

        //计算状态 
        //HP条件
        conditionHP(source);
        conditionHP(target);
        //使用属性系数
        isTypeBonus(source);
        isTypeBonus(target);

        //使用连击系数
        isHitsBonus(source);
        isHitsBonus(target);

        //使用十字系数
        isCrossBonus(source);
        isCrossBonus(target);

        //使用行系数
        isRowBonus(source);
        isRowBonus(target);

        //使用列系数
        isColBonus(source);
        isColBonus(target);

        //使用消除类型数量系数
        isNumBonus(source);
        isNumBonus(target);

        return finalDamage;
    }
}

