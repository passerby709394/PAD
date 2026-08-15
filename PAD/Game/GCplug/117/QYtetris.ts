/**
 * 俄罗斯方块
 * Created by 千叶不冷 on 2020-10-18 15:49:37.
 */
class  QYTetris extends GUI_15001{

    //界面ID
    static PLUGIN_GUI_QYTetris: number = 15001;

    //图像来源集
    static urls  = {url1:"",url2:"",url3:"",url4:""};

    //下降时间间隔
    static xiaJiangJianGe  :number=300;

    //每分间隔
    static meiFenJianGe : number = 5;

    //分数
    static fenShu : number = 0;

    //方块
    private  blockPool: UIBitmap[];

    //命令触发线程
    triggerLine;

    //游戏数据
    private gameData : Array<Array<number>> = new Array<Array<number>>();

    //游戏数据（叠层）
    private gameDataDie : Array<Array<number>> = new Array<Array<number>>();

    //是否按下了左
    private isLeft: boolean = false;
    
    //是否按下了右
    private isRight: boolean = false;

    //是否按下了上
    private isUp: boolean = false;

    //是否按下了下
    private isDown: boolean = false;

    //是否点击暂停
    private isSuspend: boolean = false;

    //间隔标识
    private interval : number;

    //方块形状数组
    private blockShape : Array<Array<number>> = new Array<Array<number>>();

    //方块形状
    private blockShapeS : number=0;

    //游戏进程
    private youXiJinCheng : number;

    //按键标识符
    private anJianInterval :number;

    //按键延迟标识
    private anJianYanChiInterval :number;

    //分数
    private fenShuD: number=0;

    //形状方块位置
    private shapeWeiZhi :number[] = [0,0];

    //进程暂存
    private jinCheng:number;

    

    //构造函数
    constructor(){
        super();
        this.on(EventObject.DISPLAY, this, this.onDisplay);
    }


    //当游戏出现时
    private onDisplay(){
        this.initData();
        //绑定按键反应
        stage.on(EventObject.KEY_DOWN, this, this.onKeyDowm);
        stage.on(EventObject.KEY_UP, this, this.onKeyUp);
        this.gameGo();
        //按键判断
        this.anJianInterval = setInterval(() => {
            if(this.youXiJinCheng==1){
                if (this.isLeft) {
                    this.shiftLeft();
                    this.isLeft = !this.isLeft;
                } else if (this.isRight) {
                    this.shiftRight();
                    this.isRight = !this.isRight;
                }else if(this.isDown){
                    this.shiftDown();
                }else if(this.isUp){
                    this.shiftUp();
                    this.isUp = ! this.isUp;
                }
            }
             if(this.youXiJinCheng==1 || this.youXiJinCheng==3){
                if(this.isSuspend){
                    this.shiftSuspend();
                    this.isSuspend = false;
                }
            }
        }, 10)
    }

    //定时继续主函数
    private gameGo(){
        this.interval = setInterval(() =>{
            if(this.youXiJinCheng == 0){
                var re = this.blockShapeShow(MathUtils.rand(19));
                this.blockShape =  re[1];
                this.blockShapeS = re[0];
                this.shapeIn();
            }else if(this.youXiJinCheng == 1){
                //console.log("下降");
                this.down();
            }
            this.blockShow();
            clearInterval(this.interval);
            if(this.youXiJinCheng <=1)return this.gameGo();
            else if(this.youXiJinCheng == 2){
                this.gmaeOverTu.alpha = 1;
                QYTetris.fenShu = this.fenShuD;
                setTimeout(() =>{
                    stage.off(EventObject.KEY_DOWN, this, this.onKeyDowm);
                    stage.off(EventObject.KEY_UP, this, this.onKeyUp);
                    this.beiJin.removeChildren(1,this.beiJin.numChildren);
                    clearInterval(this.anJianInterval);
                    GameCommand.inputMessageAndContinueExecute([0], true, 1, this.triggerLine);
                    GameUI.hide(QYTetris.PLUGIN_GUI_QYTetris);
                },2000)
            }
        },QYTetris.xiaJiangJianGe-this.fenShuD*QYTetris.meiFenJianGe);
    }

    //初始化数据
    private initData(){
        //初始游戏数据
        for(var i=0;i<20;i++){
            this.gameData[i] = [0,0,0,0,0,0,0,0,0,0];
            this.gameDataDie[i] = [0,0,0,0,0,0,0,0,0,0];
        }
        this.fenShuD = 0;
        this.beiJin.image = QYTetris.urls.url1;
        //添加方块池
        this.blockPool = [];
        var cishu = 0;
        for(var i=0;i<20;i++){
            for(var j=0;j<10;j++){
                var block = new UIBitmap;
                block.image = QYTetris.urls.url2;
                block.width = (this.beiJin.width-5)/10;
                block.height = (this.beiJin.height-5)/20;
                block.x = j*block.width+2;
                block.y = i*block.height+2;
                this.blockPool[cishu] = block;
                 cishu ++;
            }
        }
        for(var i=0;i<200;i++){
            this.beiJin.addChild(this.blockPool[i]);
            this.blockPool[i].alpha = 0;
        }
        //初始化方块形状
        for(var i=0;i<4;i++){
            this.blockShape[i] = [0,0,0,0];
        }
        //改变分数
        this.fenShu.fontSize = 200;
        this.fenShu.text = "0";
        //游戏进程为0
        this.youXiJinCheng = 0;
        //结束游戏图片隐藏
        this.gmaeOverTu.alpha = 0;
        this.gmaeOverTu.image = QYTetris.urls.url3;
        //暂停图片隐藏
        this.zanTingTu.image = QYTetris.urls.url4;
        this.zanTingTu.alpha = 0;
    }

    //出现形状方块(o形,长条形，s形，z形，L形，j形，T形)
    /**
     * 1-7-1
     * 2-8-2
     * 3-9-3
     * 4-10-11-12-4
     * 5-13-14-15-5
     * 6-16-17-18-6
     */
    private blockShapeShow(rand){
        var re = new Array(2);
        var blockShape2 :Array<Array<number>> = new Array<Array<number>>();
        blockShape2 = [];
        for(var i=0;i<4;i++){
            blockShape2[i] = [0,0,0,0];
        }
        if(rand == 0){//0
            blockShape2[0][1] = 1;
            blockShape2[0][2] = 1;
            blockShape2[1][1] = 1;
            blockShape2[1][2] = 1;
        }else
        if(rand == 1){//-
            blockShape2[0][0] = 1;
            blockShape2[0][1] = 1;
            blockShape2[0][2] = 1;
            blockShape2[0][3] = 1;
        }else
        if(rand == 2){//s
            blockShape2[0][1] = 1;
            blockShape2[0][2] = 1;
            blockShape2[1][0] = 1;
            blockShape2[1][1] = 1;
        }else
        if(rand == 3){//z
            blockShape2[0][0] = 1;
            blockShape2[0][1] = 1;
            blockShape2[1][1] = 1;
            blockShape2[1][2] = 1;
        }else
        if(rand == 4){//L
            blockShape2[0][1] = 1;
            blockShape2[1][1] = 1;
            blockShape2[2][1] = 1;
            blockShape2[2][2] = 1;
        }else
        if(rand == 5){//J
            blockShape2[0][2] = 1;
            blockShape2[1][2] = 1;
            blockShape2[2][2] = 1;
            blockShape2[2][1] = 1;
        }else
        if(rand == 6){//T
            blockShape2[0][1] = 1;
            blockShape2[1][0] = 1;
            blockShape2[1][1] = 1;
            blockShape2[1][2] = 1;
        }else
        if(rand == 7){//上
            blockShape2[0][1] = 1;
            blockShape2[1][1] = 1;
            blockShape2[2][1] = 1;
            blockShape2[3][1] = 1;
        }else
        if(rand == 8){//h
            blockShape2[0][1] = 1;
            blockShape2[1][1] = 1;
            blockShape2[1][2] = 1;
            blockShape2[2][2] = 1;
        }else
        if(rand == 9){//N
            blockShape2[0][2] = 1;
            blockShape2[1][1] = 1;
            blockShape2[1][2] = 1;
            blockShape2[2][1] = 1;
        }else
        if(rand == 10){//I
            blockShape2[0][0] = 1;
            blockShape2[0][1] = 1;
            blockShape2[0][2] = 1;
            blockShape2[1][0] = 1;
        }else
        if(rand == 11){//I
            blockShape2[0][1] = 1;
            blockShape2[0][2] = 1;
            blockShape2[1][2] = 1;
            blockShape2[2][2] = 1;
        }else
        if(rand == 12){//I
            blockShape2[0][2] = 1;
            blockShape2[1][0] = 1;
            blockShape2[1][1] = 1;
            blockShape2[1][2] = 1;
        }else
        if(rand == 13){//I
            blockShape2[0][0] = 1;
            blockShape2[1][0] = 1;
            blockShape2[1][1] = 1;
            blockShape2[1][2] = 1;
        }else
        if(rand == 14){//I
            blockShape2[0][1] = 1;
            blockShape2[0][2] = 1;
            blockShape2[1][1] = 1;
            blockShape2[2][1] = 1;
        }else
        if(rand == 15){//I
            blockShape2[0][0] = 1;
            blockShape2[0][1] = 1;
            blockShape2[0][2] = 1;
            blockShape2[1][2] = 1;
        }else
        if(rand == 16){//I
            blockShape2[0][2] = 1;
            blockShape2[1][1] = 1;
            blockShape2[1][2] = 1;
            blockShape2[2][2] = 1;
        }else
        if(rand == 17){//I
            blockShape2[0][0] = 1;
            blockShape2[0][1] = 1;
            blockShape2[0][2] = 1;
            blockShape2[1][1] = 1;
        }else
        if(rand == 18){//I
            blockShape2[0][1] = 1;
            blockShape2[1][2] = 1;
            blockShape2[1][1] = 1;
            blockShape2[2][1] = 1;
        }
        

        re[0] = rand;
        re[1] = blockShape2;
        return re;
    }

    //形状进入界面
    private shapeIn(){
        //叠层加载
        for(var i=0;i<4;i++){
            for(var j=0;j<4;j++){
                this.gameDataDie[i][j+3] = this.blockShape[i][j];
            }
        }
        //位置
        this.shapeWeiZhi = [0,3];
        this.youXiJinCheng =1;
        for(var i=0;i<4;i++){
            for(var j=0;j<10;j++){
                if(this.gameData[i][j]==2 && this.gameDataDie[i][j]==1){
                    this.youXiJinCheng =2;
                }
            }
        }
        //数据加载叠层
        for(var i=0;i<5;i++){
            for(var j=0;j<10;j++){
                this.gameData[i][j] +=this.gameDataDie[i][j];
            }
        }

    }

    //形状下降
    private down(){
        //减去叠层
        for(var i=0;i<20;i++){
            for(var j=0;j<10;j++){
                this.gameData[i][j] -=this.gameDataDie[i][j];
                //if(j==1)console.log("减去叠层");
            }
        }

        //检测是否到底
        var daoDi = false;
        for(var i=0;i<20;i++){
            for(var j=0;j<10;j++){
                if(this.gameDataDie[19][j] ==1||this.gameDataDie[i][j] ==1 && this.gameData[i+1][j] ==2)
                daoDi = true;
                //if(j==1)console.log("是否到底");
            }
        }
        //如果没到底的话叠加叠层
        if(daoDi == false){
            this.shapeWeiZhi[0]+=1;
            //叠层加载下降形状
            for(var i=19;i>=0;i--){
                for(var j=9;j>=0;j--){
                    if(this.gameDataDie[i][j]==1){
                        this.gameDataDie[i+1][j]=1;
                        this.gameDataDie[i][j]=0;
                    }
                    //if(j==1)console.log("下降形状");
                }
            }
            for(var i=0;i<20;i++){
                for(var j=0;j<10;j++){
                    this.gameData[i][j] +=this.gameDataDie[i][j];
                }
                //if(j==1)console.log("继续叠层");
            }
        }else{//如果到底的话先固化旧层，再更新叠层
            for(var i=0;i<20;i++){
                for(var j=0;j<10;j++){
                    if(this.gameDataDie[i][j]==1){
                        this.gameData[i][j] +=2;
                        this.gameDataDie[i][j] =0;
                    }  
                }
            }
            //如果有一层就清除
            for(var i=19;i>=1;i--){
                if(this.gameData[i][0]==2 && this.gameData[i][1]==2 && this.gameData[i][2]==2 && this.gameData[i][3]==2 && this.gameData[i][4]==2 && this.gameData[i][5]==2
                && this.gameData[i][6]==2 && this.gameData[i][7]==2 && this.gameData[i][8]==2 && this.gameData[i][9]==2){
                    this.gameData[i] = [0,0,0,0,0,0,0,0,0,0];
                    for(var k=i;k>=1;k--){
                        this.gameData[k] = this.gameData[k-1];
                        this.gameData[k-1] = [0,0,0,0,0,0,0,0,0,0];
                    }
                    i++;
                    //分数+1
                    this.fenShuD++;
                    this.fenShu.text = (String)(this.fenShuD);
                    //console.log("清除层为"+i);
                }
            } 
            this.youXiJinCheng = 0;
        }
    }


    //左移
    private shiftLeft(){
        //判断是否能左移
        var keYi = true;
        for(var i =0;i<20;i++){
            for(var j=0;j<10;j++){
                if(this.gameData[i][0] ==1 || this.gameData[i][j-1]==2 && this.gameData[i][j]==1)
                keYi = false;
            }
        }
        if(keYi==true){
            this.shapeWeiZhi[1]-=1;
            for(var i =0;i<20;i++){
                for(var j=0;j<10;j++){
                    //副本和本体都移动
                    if(this.gameData[i][j]==1){
                        this.gameData[i][j-1]=1;
                        this.gameDataDie[i][j-1]=1;
                        this.gameData[i][j]=0;
                        this.gameDataDie[i][j]=0;
                    }
                }
            }
        }
        this. blockShow();
    }


    //右移
    private shiftRight(){
        //判断是否能左移
        var keYi = true;
        for(var i =0;i<20;i++){
            for(var j=9;j>=0;j--){
                if(this.gameData[i][9] ==1 || this.gameData[i][j+1]==2 && this.gameData[i][j]==1)
                keYi = false;
            }
        }
        if(keYi==true){
            this.shapeWeiZhi[1]+=1;
            for(var i =0;i<20;i++){
                for(var j=9;j>=0;j--){
                    //副本和本体都移动
                    if(this.gameData[i][j]==1){
                        this.gameData[i][j+1]=1;
                        this.gameDataDie[i][j+1]=1;
                        this.gameData[i][j]=0;
                        this.gameDataDie[i][j]=0;
                    }
                }
            }
        }
        this. blockShow();
    }

    //下键
    private shiftDown(){
        this.down();
        this.blockShow();
    }
    
    //上键
    private shiftUp(){
        var xingZhuang;
        var blockShape2 :Array<Array<number>> = new Array<Array<number>>();
        blockShape2 = [];
        for(var i=0;i<4;i++){
            blockShape2[i] = [0,0,0,0];
        }
        //形状变化(o形,长条形，s形，z形，L形，j形，T形)
        //8竖条
        if(this.blockShapeS ==0){
            xingZhuang = 0;
        }else if(this.blockShapeS ==7){
            xingZhuang = 1;
        }else if(this.blockShapeS ==1){
            xingZhuang = 7;
        }else if(this.blockShapeS ==2){
            xingZhuang = 8;
        }else if(this.blockShapeS ==8){
            xingZhuang = 2;
        }else if(this.blockShapeS ==3){
            xingZhuang = 9;
        }else if(this.blockShapeS ==9){
            xingZhuang = 3;
        }else if(this.blockShapeS ==4){
            xingZhuang = 10;
        }else if(this.blockShapeS ==10){
            xingZhuang = 11;
        }else if(this.blockShapeS ==11){
            xingZhuang = 12;
        }else if(this.blockShapeS ==12){
            xingZhuang = 4;
        }else if(this.blockShapeS ==5){
            xingZhuang = 13;
        }else if(this.blockShapeS ==13){
            xingZhuang = 14;
        }else if(this.blockShapeS ==14){
            xingZhuang = 15;
        }else if(this.blockShapeS ==15){
            xingZhuang = 5;
        }else if(this.blockShapeS ==6){
            xingZhuang = 16;
        }else if(this.blockShapeS ==17){
            xingZhuang = 18;
        }else if(this.blockShapeS ==18){
            xingZhuang = 6;
        }else if(this.blockShapeS ==16){
            xingZhuang = 17;
        }
        blockShape2 = this.blockShapeShow(xingZhuang)[1];
        //减去叠层
        for(var i=0;i<20;i++){
            for(var j=0;j<10;j++){
                this.gameData[i][j] -=this.gameDataDie[i][j];
            }
        }
        //清除叠层
        for(var i=0;i<20;i++){
            for(var j=0;j<10;j++){
                if(this.gameDataDie[i][j]==1){
                this.gameDataDie[i][j] =0;
                } 
            }
        }
        //装入形状
        var win = true;
        for(var i=0;i<4;i++){
            for(var j=0;j<4;j++){
                if(blockShape2[i][j]==1 && (i+this.shapeWeiZhi[0]>19 || j+this.shapeWeiZhi[1]>9 || j+this.shapeWeiZhi[1]<0 || i+this.shapeWeiZhi[0]<0)){
                    win = false;
                    break;
                }
                if(i+this.shapeWeiZhi[0]<=19 && j+this.shapeWeiZhi[1]<=9){
                    this.gameDataDie[i+this.shapeWeiZhi[0]][j+this.shapeWeiZhi[1]] +=blockShape2[i][j];
                }
            }
        }
        //检测是否有重叠
        for(var i=0;i<20;i++){
            for(var j=0;j<10;j++){
                if(this.gameDataDie[i][j]==1 && this.gameData[i][j] ==2)win = false;
            }
        }

        if(win == true){
             this.blockShape = blockShape2;
             this.blockShapeS = xingZhuang;
             for(var i=0;i<20;i++){
                for(var j=0;j<10;j++){
                    this.gameData[i][j] +=this.gameDataDie[i][j];
                }
            }

        }else{
            //清除叠层
            for(var i=0;i<20;i++){
                for(var j=0;j<10;j++){
                    if(this.gameDataDie[i][j]==1){
                    this.gameDataDie[i][j] =0;
                    } 
                }
            }
            //重装叠层
            for(var i=0;i<4;i++){
                for(var j=0;j<4;j++){
                    if(i+this.shapeWeiZhi[0]<=19 && j+this.shapeWeiZhi[1]<=9)
                    this.gameDataDie[i+this.shapeWeiZhi[0]][j+this.shapeWeiZhi[1]] +=this.blockShape[i][j];
                }
            }
            for(var i=0;i<20;i++){
                for(var j=0;j<10;j++){
                    this.gameData[i][j] +=this.gameDataDie[i][j];
                }
            }
        }
        this.blockShow();
    }


    //暂停
    private shiftSuspend(){
        if(this.youXiJinCheng==1){
            this.youXiJinCheng=3;
            this.zanTingTu.alpha = 1;
        }else{
            this.zanTingTu.alpha = 0;
            this.youXiJinCheng=1;
            this.gameGo();
        }
    }

    //根据游戏数据显示方块
    private blockShow(){
        var ciShu = 0;
        for(var i =0;i<20;i++){
            for(var j=0;j<10;j++){
                if(this.gameData[i][j] >0){
                    this.blockPool[ciShu].alpha = 1;
                }else{
                    this.blockPool[ciShu].alpha = 0;
                }
                ciShu++;
            }
        }
    }



    //按下键盘时
    private onKeyDowm(e: EventObject) {
        if (e.keyCode == Keyboard.LEFT) {
            this.isLeft = !this.isLeft;
        } else if (e.keyCode == Keyboard.RIGHT) {
            this.isRight = !this.isRight;
        } else if (e.keyCode == Keyboard.UP) {
            this.isUp = !this.isUp;
        } else if (e.keyCode == Keyboard.DOWN) {
            this.isDown = !this.isDown;
        } else if(e.keyCode == Keyboard.SPACE){
            this.isSuspend = !this.isSuspend;
        }
    }

    //当键盘弹起
    private onKeyUp(e: EventObject) {
        if (e.keyCode == Keyboard.LEFT) {
            this.isLeft = false;
        } else if (e.keyCode == Keyboard.RIGHT) {
            this.isRight = false;
        } else if (e.keyCode == Keyboard.UP) {
            this.isUp = false;
        } else if (e.keyCode == Keyboard.DOWN) {
            this.isDown = false;
        } else if(e.keyCode == Keyboard.SPACE){
            this.isSuspend = false;
        }
    }

}
module CommandExecute {
    /**
     * 抽奖线程控制
     */
    export function customCommand_15001(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], cp: CustomCommandParams_15001): void {
        if (playerInput.length == 0) {
            QYTetris.urls.url1 = cp.beiJingTu;
            QYTetris.urls.url2 = cp.fangKuaiTuPian;
            QYTetris.urls.url3 = cp.gameOvarTu;
            QYTetris.urls.url4 = cp.zanTingTu;
            QYTetris.xiaJiangJianGe = cp.jianGeChuShi;
            QYTetris.meiFenJianGe = cp.fenJianGe;
            var qyTetris :QYTetris = GameUI.show(QYTetris.PLUGIN_GUI_QYTetris) as any;
            qyTetris.triggerLine = trigger.id;
            trigger.pause = true;
        }
        else {
            trigger.offset(1);
            var res: number = QYTetris.fenShu;
            Game.player.variable.setVariable(cp.fenShuBianLiang, res);
            CommandPage.executeEvent(trigger, []);
        }
    }
}



