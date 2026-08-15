# GameCreatorLib 文档

> 总页数: 252 页
> 来源: GameCreatorLib.pdf

---

## 第 1 页

/**
游戏对话框
特性：
-- 目前一旦加载对话框样式后不再释放而是一直缓存着
-- 对话与选项均通过此类实现
-- 可通过监听事件等方式编写对话框的插件，如制作AVG游戏的快进、跳过、历史对话记录等
*
Created by 黑暗之神KDS on 2019-01-09 15:06:50.
*/
declare class GameDialog extends Sprite {
/**
事件：当对话框出现时 回调参数：是否选项、文本内容、选项内容（若是选项的话）、名
称、头像路径
// isOption = 是否选项
// content = 文本内容
// options = 选项内容（若是选项的话）
// name = 名称
// head = 头像 图片路径string/立绘ID:number/动画ID:number
// expression = 表情ID（如有，立绘模式下可选择表情）
// audioURL = 语音字符串（如有） 格式：音频地址,音量0-1,音调0-2
// speed = 文字播放速度 0-5 极慢-立即显示
EventUtils.addEventListenerFunction(GameDialog,GameDialog.EVENT_DIALOG_STAR
T,
(isOption:boolean,content:string,options:string[],name:string,head:string|nu
mber,expression:number,audioURL:string,speed:number)=> {
// to do
},this);
*/
static EVENT_DIALOG_START: string;
/**
事件：当对话框出现后
onAfterDialogStart(isOption:boolean);
*/
static EVENT_AFTER_DIALOG_START: string;
/**
事件：当对话文本播放结束时
// gameDialog = 当前的对话框显示对象 fromAutoPlaySkipSign:boolean = 是否来自文本
播放时出现的[跳过本次对话]


---

## 第 2 页

EventUtils.addEventListenerFunction(GameDialog,GameDialog.EVENT_DIALOG_END,
(gameDialog:GameDialog,fromAutoPlaySkipSign:boolean)=> {
// to do
},this);
*/
static EVENT_DIALOG_END: string;
/**
事件：当对话框关闭时
// gameDialog = 当前的对话框显示对象
EventUtils.addEventListenerFunction(GameDialog,GameDialog.EVENT_DIALOG_CLOS
E,(gameDialog:GameDialog)=> {
// to do
},this);
*/
static EVENT_DIALOG_CLOSE: string;
/**
事件：当文本框文本播放时 回调参数：当前文字
// word = 当前的文字
EventUtils.addEventListenerFunction(GameDialog,GameDialog.EVENT_DIALOG_WORD
_PLAY,(word:string)=> {
// to do
},this);
*/
static EVENT_DIALOG_WORD_PLAY: string;
/**
事件：当文本播放完成时 isAuto 表示是否来自自动播放
EventUtils.addEventListenerFunction(GameDialog,GameDialog.EVENT_DIALOG_WORD
_PLAY_COMPLETE,Callback.New(isAuto:boolean)=> {
// to do
},this);
*/
static EVENT_DIALOG_WORD_PLAY_COMPLETE: string;
/**
事件：当语音播放完毕时派发（如果该次对话的语音未播放完成时，玩家手动跳过了该次对话
的话则不会抛出该事件）


---

## 第 3 页

// success = 是否播放成功
// audioURL = 语音字符串（如有） 格式：音频地址,音量0-1,音调0-2
EventUtils.addEventListenerFunction(GameDialog,GameDialog.EVENT_TS_PLAY_COM
PLETE,(success:boolean,audioURL:string)=> {
// to do
},this);
*/
static EVENT_TS_PLAY_COMPLETE: string;
/**
事件：当播放文本时遇到等待时间（帧数）时抛出事件 frameCount=等待的帧数
EventUtils.addEventListenerFunction(GameDialog,GameDialog.EVENT_DIALOG_TEXT_WA
IT_TIME,(frameCount:number)=> {
// to do
},this);
*/
static EVENT_DIALOG_TEXT_WAIT_TIME: string;
/**
事件：当播放文本时遇到等待玩家操作时以及玩家操作完毕后抛出该事件 state=0表示等待玩
家操作 state=1表示玩家操作完毕
EventUtils.addEventListenerFunction(GameDialog,GameDialog.EVENT_WAIT_PALYER_OP
ERATION,(state:number)=> {
// to do
},this);
*/
static EVENT_WAIT_PALYER_OPERATION: string;
/**
事件：恢复存档时的对话前调用
EventUtils.addEventListenerFunction(GameDialog,GameDialog.EVENT_BEFORE_RECOVE
RY_DIALOG,(success:boolean,audioURL:string)=> {
// to do
},this);
*/
static EVENT_BEFORE_RECOVERY_DIALOG: string;
/**
允许用户操快速显示当前文本（空格键/鼠标左键点击）默认=false
*/
static dialogTextShowAllEnabled: boolean;
/**


---

## 第 4 页

当前文本对应的指令唯一标识
*/
static fromCommandID: string;
/**
功能：立即显示全文本，当处于文本播放时则会立即显示至全文本
*/
static showall(): void;
/**
停止对话，停止后其所在的触发线也处于停止中
*/
static stop(): void;
/**
功能：立刻跳过当前文本
@return [boolean] 成功跳过
*/
static skip(): boolean;
/**
功能：立刻跳过「等待玩家操作」
当监听到EVENT_WAIT_PALYER_OPERATION事件时可通过此功能跳过等待
@return [boolean] 成功跳过
*/
static skipWaitPlayerOperation(): boolean;
/**
是否显示对话中
*/
static get isInDialog(): boolean;
/**
是否播放中
*/
static get isPlaying(): boolean;
/**
最近使用的对话框
*/
static lastDialog: GameDialog;
/**
选项列表
*/
get optionList(): UIList;
/**
获取当前的选项按钮（需要选项存在且正处于显示时）
*/
get optionUIs(): UIButton[];
/**


---

## 第 5 页

选项文本
*/
get optionTexts(): UIString[];
/**
头像
*/
get dialogHeadBox(): UIBitmap | UIStandAvatar | UIAnimation | UIRoot;
/**
对话框背景图
*/
get dialogBox(): UIBitmap;
/**
名字文本
*/
get nameText(): UIString;
/**
文本文字组：根据不同的颜色、换行等情况切分的多段文本（拥有材质的话则逐字拆分）默认
值=[]
*/
get playTextLabels(): UIString[];
/**
跳过标志
*/
get skipAni(): GCAnimation;
/**
唯一ID
*/
get id(): number;
}
/**
游戏内置功能函数
即将会被上层自定义事件取缔而不作为GC2D内核中内置的功能
Created by 黑暗之神KDS on 2019-02-04 16:43:35.
*/
declare class GameFunction {
/**
场景震动:当前帧直接震动，总计震动了t帧
@param strength 幅度
@param t 帧数
*/
static shake(strength: number, t: number): void;
/**
更改场景色调:当前帧直接更改色调，总计更改了t帧
@param r 红色
@param g 绿色


---

## 第 6 页

@param b 蓝色
@param gray 灰度
@param t 时间（帧）
@param mr 红色曝光
@param mg 绿色曝光
@param mb 蓝色曝光
@param layer 层次（后期追加的高级特性）
@param tCur 当前的T
*/
static tonal(r: number, g: number, b: number, gray: number, t: number, mr: number, mg: 
number, mb: number, layer?: number, tCur?: number): void;
/**
场景镜头移动:当前帧直接开始移动，总计移动了t帧
@param type 0-直接坐标 1-锁定对象
@param x 指定的坐标x
@param y 指定的坐标y
@param soIndex 锁定的对象
@param tween 缓动
@param t 帧数
@param tCur 当前的帧数（首次为null）
*/
static cameraMove(type: number, x: number, y: number, soIndex: number, tween: 
boolean, t: number, tCur?: number, window_width?: number, window_height?: number): 
void;
/**
场景雾图形变更
@param url
@param sx
@param sy
@param dx
@param dy
@param alpha
@param blendMode
*/
static fogSet(url: string, sx: number, sy: number, dx: number, dy: number, alpha: 
number, blendMode: number): void;
}
/**
图像层


---

## 第 7 页

Created by 黑暗之神KDS on 2020-11-30 10:28:32.
*/
declare class GameImageLayer extends GameSprite {
/**
相机
*/
camera: Camera;
/**
刷新帧，如果更改了相机设置希望在当前帧立刻刷新的话可自行调用该函数，否则会在帧刷中
自动每帧调用（意味着下一帧才调用）
@param force [可选] 默认值=false 强制刷新，让图层内的对象全部刷新相机的设置
（默认情况下系统会自动根据是否更新了相机来决定是否刷新子对象相对于相机的位置）
 */
updateFrame(force?: boolean): void;
/**
记录全部通道的显示对象 默认值={}
格式 { [passageID: string]: { displayObject: GameSprite } } 
*/
static imageSprites: any;
/**
设置通道显示对象
@param passageID 通道编号
@param sp 显示对象
*/
static setImageSprite(passageID: number, sp: GameSprite): void;
/**
获取占用该通道的显示对象
@param passageID 通道编号
*/
static getImageSprite(passageID: number): GameSprite;
/**
删除通道
-- 清理显示对象
@param passageID 通道编号
*/
static deletePassage(passageID: number): void;
/**
注册帧刷效果，支持注册多个
@param passageID 通道编号
@param onUpdate 帧刷函数
@param thisPtr 作用域
@param args [可选] 默认值=null 自定义参数


---

## 第 8 页

@param sign [可选] 默认值=null 标识，清理时可清理指定的标识
*/
static regPassageFrameUpdate(passageID: number, onUpdate: Function, thisPtr: any, 
args?: any[], sign?: string): void;
/**
清理通道的帧刷函数效果
@param passageID 通道编号
@param sign [可选] 默认值=null 标识，清理时可清理指定的标识
*/
static clearPassageFrameUpdate(passageID: number, sign?: string): void;
/**
获取通道帧刷函数
-- passageID 通道编号
-- onUpdate 帧刷函数
-- thisPtr 作用域
-- sign 标识
-- args 自定义参数
@return { [passageID: string]: { onUpdate: Function, thisPtr: any, sign: string, args: any[] }
[] }
*/
static getPassageFrameUpdates(): any;
}
/**
游戏总显示层次
通过 Game.layer 访问该类的唯一实例
重写 initLayer 可以自定义层次关系
系统默认层次：
stage：
-- sceneLayer 场景层：通常场景应添加到场景层
-- imageLayer 图像层：通常图像系统中显示的图片动画等添加在该层
-- uiLayer 界面层：通常界面、对话框添加在该层
Created by 黑暗之神KDS on 2019-01-09 15:09:23.
*/
declare class GameLayer extends GameSprite {
/**
场景层：通常场景应添加到场景层
*/
sceneLayer: GameSprite;
/**
图像层：通常图像系统中显示的图片动画等添加在该层
*/
imageLayer: GameImageLayer;
/**


---

## 第 9 页

UI层：界面层：通常界面、对话框添加在该层
*/
uiLayer: GameSprite;
/**
初始化层次
可以通过 GameLayer.prototype.initLayer 重写此函数
系统默认层次依次是
-- 场景层 this.addChild(this.sceneLayer);
-- 图像层 this.addChild(this.imageLayer);
-- UI层 this.addChild(this.uiLayer); 对话框在此层
*/
initLayer(): void;
//------------------------------------------------------------------------------------------------------
// [代码示例]
// 暂时隐藏所有界面层，间隔3秒后再显示
// 
// Game.layer.uiLayer.visible = false;
// setTimeout(()=>{
//    Game.layer.uiLayer.visible = true;
// },3000);
// 
//------------------------------------------------------------------------------------------------------
}
/**
游戏精灵类
各种高级显示对象的基类（子类包含Avatar、Animation、各种UI控件等）
-- 滤镜叠加实现（即父子级滤镜不会被覆盖而是叠加）
-- 色调（R+,B+,G+,GRAY,Rx,Gx,Bx）
-- 色相（采用ColorMatrix）
Created by 黑暗之神KDS on 2019-02-01 02:34:59.
*/
declare class GameSprite extends Sprite {
/**
事件：当销毁前派发的事件
// 创建对象
var sp = new GameSprite();
// 监听当销毁时事件
sp.once(GameSprite.ON_DISPOSE,this,()=>{
// to do
});
// 销毁该对象


---

## 第 10 页

sp.dispose();
*/
static ON_DISPOSE: string;
/**
唯一ID
*/
objectID: number;
/**
是否已释放
*/
isDisposed: boolean;
/**
装载的自定义数据，此外作为List的项显示对象界面时，该变量会记录其对应的
UIListItemData
*/
data: any;
/**
透明度 最终透明度alpha = opacity * dpOpacity * opacityPer(目前仅用于编辑器内)
*/
opacity: number;
/**
旋转度1 最终旋转度rotation = rotation1 + rotation2 默认值=0
*/
rotation1: number;
/**
旋转度2 最终旋转度rotation = rotation1 + rotation2 默认值=0
*/
rotation2: number;
/**
是否允许使用滤镜（允许使用时材质效果才会生效） 默认值 = true
*/
filterEnabled: boolean;
/**
更改色调
@param r 红色+ -255~255
@param g 绿色+ -255~255
@param b 蓝色+ -255~255
@param gray 灰度 0-100
@param mr [可选] 默认值=1 0~5
@param mg [可选] 默认值=1 0~5
@param mb [可选] 默认值=1 0~5
*/
setTonal(r: number, g: number, b: number, gray: number, mr?: number, mg?: number, 
mb?: number): void;


---

## 第 11 页

/**
获取色调参数：r g b gray mr mg mb
*/
getTonal(): number[];
/**
色相 -180~180
内部使用色调滤镜实现
*/
hue: number;
/**
模糊度 0~N
内部使用模糊滤镜实现
*/
blur: number;
/**
不可用状态，将禁用鼠标响应并且调整为灰度
*/
disabled: boolean;
/**
是否继承于指定的对象
@param sp 指定的对象
*/
isInherit(sp: TreeNode): boolean;
useDPCoord: boolean;
/**
深度坐标系：水平坐标
*/
dpX: number;
/**
深度坐标系：垂直坐标
*/
dpY: number;
/**
深度坐标系：深度，该值与相机深度的距离决定实际显示效果，如近大远小
*/
dpZ: number;
/**
深度坐标系：高度（像素）
*/
dpWidth: number;
/**
深度坐标系：宽度（像素）
*/
dpHeight: number;
/**


---

## 第 12 页

深度坐标系：透明度，最终透明度会乘以这个值
*/
dpOpacity: number;
/**
深度坐标系：水平缩放比例 默认值=1 表示100%
*/
dpScaleX: number;
/**
深度坐标系：垂直缩放比例 默认值=1 表示100%
*/
dpScaleY: number;
/**
是否使用缩放模式，图片一般更改尺寸，而界面、动画、立绘则一般更改缩放倍率
*/
useDPCoordScaleMode: boolean;
/**
显示优先度，用于同深度dpZ时区分显示，越大，显示在越前面
*/
dpDisplayPriority: number;
/**
根据【深度坐标】计算并设置【实际坐标】
由项目上层实现
如更改了dpX、dpY、dpWidth、dpHeight，根据当前深度dpZ以及镜头设置实际的x、y、
width、height（或scaleX、scaleY）
*/
dpCoordToRealCoord(): void;
/**
根据【实际的坐标】转换为【深度坐标】
由项目上层实现
如更改了x、y、width、height后想要获取其对应当前深度下的dpX、dpY、dpWidth、
dpHeight（或dpScaleX、dpScaleY）
@param calcCoord 是否计算坐标，若计算则会转换并将dpX和dpY设置为转换值
@param calcSize 是否计算尺寸，若计算则会转换并将dpWidth和dpHeight设置为转换值
(useDPCoordScaleMode模式下则是dpScaleX和dpScaleY)
@return [any] 返回 { dpX: number, dpy: number, dpScaleX: number, dpScaleY: number, 
dpWidth: number, dpHeight: number }
*/
realCoordToDPCoord(calcCoord: boolean, calcSize: boolean): any;
/**
用于项目层实现深度坐标系代码用变量：脏标记
*/
_dpDirty: boolean;
/**


---

## 第 13 页

用于项目层实现深度坐标系代码用变量：相机水平坐标
*/
_dpCameraX: number;
/**
用于项目层实现深度坐标系代码用变量：相机垂直坐标
*/
_dpCameraY: number;
/**
用于项目层实现深度坐标系代码用变量：相机深度坐标
*/
_dpCameraZ: number;
/**
用于项目层实现深度坐标系代码用变量：图片实际尺寸宽度
*/
_dpTextureWidth: number;
/**
用于项目层实现深度坐标系代码用变量：图片实际尺寸高度
*/
_dpTextureHeight: number;
/**
安装材质数据
@param materialData  类型 { materials: MaterialData[] }[]
@param resetTime [可选] 默认值=true 是否重置材质数据内的过渡时间
*/
installMaterialData(materialData: any, resetTime?: boolean): void;
/**
获取当前拥有的全材质数据，可用于储存，同时可使用 installMaterialData 安装该材质数据
@return { materials: MaterialData[] }[]
*/
getAllMaterialDatas(): any[];
/**
添加材质，根据材质数据
@param material 材质数据
@param passage [可选] 默认值=0 所在的通道
@return [boolean] 是否成功
*/
addMaterial(materialData: MaterialData, passage?: number): boolean;
/**
添加材质到指定的位置上，根据材质数据
@param material 材质数据
@param index 位置
@param passage [可选] 默认值=0 所在的通道


---

## 第 14 页

@return [boolean] 是否成功
*/
addMaterialAt(materialData: MaterialData, index: number, passage?: number): boolean;
/**
添加材质，根据材质ID，材质参数使用默认值
@param material 材质数据
@param passage [可选] 默认值=0 所在的通道
@return [boolean] 是否成功
*/
addMaterialByID(materialID: number, passage?: number): boolean;
/**
添加材质，根据材质ID，材质参数使用默认值
@param material 材质数据
@param index 位置
@param passage [可选] 默认值=0 所在的通道
@return [boolean] 是否成功
*/
addMaterialAtByID(materialID: number, index: number, passage?: number): boolean;
/**
移除材质，根据材质数据，如若该数据已存在里面则会被移除
@param materialData 材质数据
@param passage [可选] 默认值=0 所在的通道
@return [boolean] 是否成功
*/
removeMaterial(materialData: MaterialData, passage?: number): boolean;
/**
移除材质，根据材质所在的位置
@param index 材质数据所在的位置索引
@param passage [可选] 默认值=0 所在的通道
@return [boolean] 是否成功
*/
removeMaterialAt(index: number, passage?: number): boolean;
/**
移除材质，根据材质ID
@param materialID 材质数据ID
@param passage [可选] 默认值=0 所在的通道
@return [boolean] 是否成功
*/
removeMaterialByID(materialID: number, passage?: number): boolean;
/**
获取材质数据，根据ID
@param materialID 材质数据ID


---

## 第 15 页

@param passage [可选] 默认值=0 所在的通道
@return [MaterialData] 材质数据
*/
getMaterialByID(materialID: number, passage?: number): MaterialData;
/**
获取材质数据，根据位置索引
@param index 所在的位置索引
@param passage [可选] 默认值=0 所在的通道
@return [MaterialData] 材质数据
*/
getMaterialAt(index: number, passage?: number): MaterialData;
/**
获取指定通道内的材质数据总数
@param passage [可选] 默认值=0 所在的通道
@return [number]
*/
getMaterialLength(passage?: number): number;
/**
获取材质通道总数
@return [number]
*/
getMaterialPassLength(): number;
/**
清空所有材质
*/
clearMaterials(): void;
/**
清空指定通道里的材质
@param passage 所在的通道
@param deletePass 删除通道
*/
clearMaterialsInPass(passage: number, deletePass?: boolean): void;
/**
更换同一个通道内的材质位置
@param material 材质数据
@param toIndex 所在的位置索引
@param passage [可选] 默认值=0 所在的通道
@return [boolean] 是否更换成功
*/
setMaterialIndex(material: MaterialData, toIndex: number, passage?: number): boolean;
/**
更换材质位置
@param fromIndex 材质所在的原始位置


---

## 第 16 页

@param toIndex 材质需要更换至的新位置
@param passage [可选] 默认值=0 所在的通道
@return [boolean] 是否更换成功
*/
swapMaterialIndex(fromIndex: number, toIndex: number, passage?: number): boolean;
/**
更换通道顺序，通道顺序影响渲染先后顺序
@param passFromIndex 材质通道所在的原始位置
@param passToIndex 材质通道需要更换至的新位置
@return [boolean] 是否更换成功
*/
swapMaterialPass(passFromIndex: number, passToIndex: number): boolean;
/**
设置为指定的GameSprite相同的材质
@param gameSprite 指定的参考GameSprite
@param cloneMode 是否克隆模式，如果是则表示使用克隆的方式复制材质数据
（MaterialData），否则是引用
*/
setMaterialsByGameSprite(gameSprite: GameSprite, cloneMode: boolean): void;
/**
调用此函数表示更改了材质，让系统根据最新的材质计算来进行渲染
通常情况下无需主动调用此函数，但如果修改了MaterialData内部的数据的话可调用该函数让
对象刷新
*/
setMaterialDirty(): void;
/**
调用此函数快速设置传递给shader的值，比直接修改材质后调用setMaterialDirty效率要更高
一些，减少了数据的转换计算。
比如需要帧刷只更新少数几个数值时可以调用该函数进行优化计算。
*
【关于变量名】
-- 变量名规格：mu材质编号_变量属性
*
【关于值】
-- number 类型的属性直接设置
-- 颜色属性请设置为 [r,g,b] 其中r/g/b取值范围为0~1
-- 不支持贴图设置，更改贴图仍然需要
*
【materialValues参数规格】
{
mu2_abc: 1,
mu3_color: [0.5,0.5,1]


---

## 第 17 页

}
*
@param materialValues 需要更新的材质数据
@param passage [可选] 默认值=0 所在的通道
*/
setMaterialValueFast(materialValues: any, passage?: number): void;
}
/**
界面管理器
特性：
-- 通过系统创建的界面，同编号的界面只有一个
比如通过GameUI.show(1)创建1号界面，第二次调用仍然是这个界面
通过事件可视化打开的界面同GameUI.show
如果需要新建多个相同的界面，可使用GameUI.load(1,true);表示以克隆的形式创建1
相同ID的界面只存在一个，如额外需要创建界面 可以 new GUI_XXX
Created by 黑暗之神KDS on 2018-10-12 13:40:11.
*/
declare class GameUI {
/**
事件：当打开系统组界面时派发的事件 onOpenUI(uiID:number) uiID=界面编号
EventUtils.addEventListenerFunction(GameUI,GameUI.EVENT_OPEN_SYSTEM_UI,
(uiID:number)=>{
// to do
},this);
*/
static EVENT_OPEN_SYSTEM_UI: string;
/**
事件：关闭系统组界面时派发的事件 onCloseUI(uiID:number)
EventUtils.addEventListenerFunction(GameUI,GameUI.EVENT_CLOSE_SYSTEM_UI,
(uiID:number)=>{
// to do
},this);
*/
static EVENT_CLOSE_SYSTEM_UI: string;
/**
事件：创建界面时派发的事件，无论创建的是系统组界面还是副本


---

## 第 18 页

EventUtils.addEventListenerFunction(GameUI,GameUI.EVENT_CREATE_UI,(ui: 
GUI_BASE)=> {
// to do
},this);
*/
static EVENT_CREATE_UI: string;
/**
是否已打开
@param uiID 系统组界面ID
@return [boolean]
*/
static isOpened(uiID: number): boolean;
/**
加载界面
@param id 界面ID
@param copy [可选] 默认值=false 是否是克隆界面 false=属于系统组的界面（会保存在系统
组列表里） true=属于自行新建的界面
@return [GUI_BASE]
*/
static load(id: number, copy?: boolean): GUI_BASE;
/**
获取已存在的系统组界面（包含此前打开过后关闭掉的，释放掉的话则不再该列表内）
@return { [uiID: number]: GUI_BASE }
*/
static getAllSystemGroupUIs(): any;
/**
获取系统组列表中指定编号的界面，如果系统组未开启过该界面则获取为null
@param id 界面编号
@return 系统组的该界面
*/
static get(id: number): GUI_BASE;
/**
释放系统组列表中指定编号的界面
@param id 界面编号
*/
static dispose(id: number): void;
/**
显示系统组列表中指定编号的界面，如果该界面在系统组列表中找不到则会创建并加入到系统
组列表中，如果存在则直接返回该界面
@param id 界面编号


---

## 第 19 页

@return [GUI_BASE]
*/
static show(id: number): GUI_BASE;
/**
隐藏系统组列表中指定编号的界面，如果该界面在系统组列表中找不到则忽略
@param id 界面编号
*/
static hide(id: number): void;
/**
隐藏全部系统组列表的界面
*/
static hideAll(): void;
/**
获取其全部子组件对象
@param keyValueMode 是否包含 keyValue 格式的，有则返回值中的keyValue存在值
@param conditionFunc [可选] 默认值=null  条件方法，通过条件筛选需要的组件，不存在方
法或返回true都视为需要该组件 conditionFunc(uiComp:Sprite)
@return { arr: UIBase[], keyValue: { [compID: string]: UIBase } }
*/
static getAllCompChildren(ui: GUI_BASE, keyValueMode: boolean, conditionFunc?: 
Function): any;
}
/**
针对游戏相关的常用工具方法
关于朝向
--朝向可参考以5为中心的小键盘数字：
1-左下 2-下 3-右下 4-左 6-右 7-左上 8-上 9-右上
 *
Created by 黑暗之神KDS on 2018-08-08 21:12:53.
*/
declare class GameUtils {
/**
获取实际资源的面向，由于实际资源未必有指定的面向，这里会做为映射
如只有四方向的行走图，获取右上方向的话则映射为方向右
@param ori 面向
@param oriMode [可选] 默认值=8 面向模式1/2/3/5/8
@return [number] 替换映射后的面向
*/
static getAssetOri(ori: number, oriMode?: number): number;
/**
根据0-360角度获取对应的面向
@param angle 角度 0-360


---

## 第 20 页

@return [number] 返回面向 1/2/3/4/6/7/8/9
*/
static getOriByAngle(angle: number): number;
/**
根据面向获取0-360度
@param ori 面向 1/2/3/4/6/7/8/9
@return [number] 角度 0-360
*/
static getAngleByOri(ori: number): number;
/**
获取相反的面向
@param ori 面向 1/2/3/4/6/7/8/9
@return 返回与ori相反的面向，如2的反方向是8
*/
static getFlipOri(ori: number): number;
/**
[实际坐标]->[格子坐标]
@param p 实际坐标
@param helpP [可选] 默认值=null 如果存在则使用该对象来自装载而非创建新的Point对象
@return [Point] 格子坐标
*/
static getGridPostion(p: Point, helpP?: Point): Point;
/**
[实际坐标]->[实际坐标中心点]
@param p 实际坐标
@param helpP [可选] 默认值=null 如果存在则使用该对象来自装载而非创建新的Point对象
@return [Point]
*/
static getGridCenter(p: Point, helpP?: Point): Point;
/**
[格子坐标] -> [实际坐标中心点]
@param gridP 格子坐标
@param helpP [可选] 默认值=null 如果存在则使用该对象来自装载而非创建新的Point对象
@return [Point]
*/
static getGridCenterByGrid(gridP: Point, helpP?: Point): Point;
/**
查询临近的同状态路径，如GameCreator编辑器中油漆桶则使用了该方法
@param mapData 图数据
@param gridX 起点格子
@param gridY 起点格子
@param width 总宽度


---

## 第 21 页

@param height 总高度
@param attributes 判断格子状态相同的属性集，即与mapData数据中的有一种属性不同的
话也视为不同的状态 null 则表示直接对比
@param limit 默认值=100 限制搜索仅在周围limit距离的正方形范围内
@return [Point]
*/
static getSameStateGrid(mapData: any[][], gridX: number, gridY: number, width: number, 
height: number, attributes: string[], limit?: number): Point[];
/**
获取两个格子之间的补间格子
@param grid1 起点格
@param grid2 终点格
@param per [可选] 默认值=0.1 每次遍历的比例，如果0.1表示起点格到终点格切分10次后返
回不重复的中间格
@return [Point]
*/
static getMendingGrids(grid1: Point, grid2: Point, per?: number): Point[];
/**
获取最小等比适配比例 canvasRect.width/rect.width 与 canvasRect.height/rect.height的最
小值
@param rect
@param canvasRect 画布矩形
*/
static getAutoFitSizePre(rect: Rectangle, canvasRect: Rectangle): number;
/**
判断是否继承于某个节点（节点系统中需要有parent属性来指向父节点）
@param node 节点
@param parentNode 疑似父节点
@return 是否是真正的父节点
*/
static isInheritNode(node: any, parentNode: any): boolean;
/**
根据特定字符串$n来获取n，不符合的返回0
@param value 特殊格式：如$6
@return 变量ID：如6
*/
static getVarID(value: string): number;
/**
根据特定字符串@n来获取n，不符合的返回0
@param value 特殊格式：如@6


---

## 第 22 页

@return 变量ID：如6
*/
static getGlobalVarID(value: string): number;
/**
检查是否合法的变量名
@param varName 变量名称
@return [boolean] 是否合法
*/
static isLegalVarName(varName: string): boolean;
/**
获取曲线数据，根据字符串格式的数据
返回格式：[[0,0,startY,maxLength,maxHeight],[type,startX,startY,endX,endY,ctrlX,ctrlY],
[type,startX,startY,endX,endY,ctrlX,ctrlY],...]
maxLength=最大长度（仅供参考） maxHeight=最大高度 起点x始终位于0，终点x始终位于
100  type=0-线性线段 1-二次贝塞尔曲线片段(拥有ctrlX,ctrlY)
@param curveStrData 曲线数据
@return groupValue
*/
static getCurveData(curveStrData: string): any[];
/**
根据曲线数据获取其中某个点的值
曲线数据的格式：[[0,0,startY,maxLength,maxHeight],
[type,startX,startY,endX,endY,ctrlX,ctrlY],[type,startX,startY,endX,endY,ctrlX,ctrlY],...]
maxLength=最大长度（仅供参考） maxHeight=最大高度 起点x始终位于0，终点x始终位于
100  type=0-线性线段 1-二次贝塞尔曲线片段(拥有ctrlX,ctrlY)
@param groupValue 曲线数据
@param x 0~1 0表示曲线头，1表示曲线尾 假设该曲线是只有一段线性曲线，值范围是0-
5000，则0.5的值是2500
@return value 值
*/
static getBezierPoint2ByGroupValue(groupValue: any[], x: number): number;
/**
根据字符串格式的数据,获取过渡组件Object类型数据
@param transData 字符串格式数据
*/
static getTransData(transDataStr: string): TransData;
/**
根据传入的参数x,获取过渡对应的值
@param transData 过渡数据
@param x 范围 0-1
*/
static getValueByTransData(transData: TransData, x: number): number;
}
/**


---

## 第 23 页

点对象
表示二维坐标系的x,y，用于辅助计算
Created by 黑暗之神KDS on 2018-06-03 16:11:45.
*/
declare class Point {
/**
水平坐标
*/
x: number;
/**
垂直坐标
*/
y: number;
/**
构造函数
@param x [可选] 默认值=0 水平坐标
@param y [可选] 默认值=0 垂直坐标
*/
constructor(x?: number, y?: number);
/**
一次设置水平和垂直坐标
@param x 水平坐标
@param y 垂直坐标
@return [Point] 当前对象
*/
setTo(x: number, y: number): Point;
/**
计算当前点和指定点(x，y)的距离。
@param x 指定点的水平坐标。
@param y 指定点的垂直坐标。
@return 返回当前点和指定点之间的距离。
*/
distance(x: number, y: number): number;
/**
返回字符串形式的值显示：x,y
@return [string]
*/
toString(): string;
/**
返回from-to两点中间的点
@param to 目标点
@param from 起点
@param per 所在from-to的比例 0~1，0则等于from，1则等于to


---

## 第 24 页

@return [Point]
*/
static interpolate(to: Point, from: Point, per: number): Point;
/**
返回from-to两点中间的点
@param toX 目标点x
@param toY 目标点y
@param fromX 起点x
@param fromY 起点y
@param per 所在from-to的比例 0~1，0则等于from，1则等于to
@return [number]
*/
static interpolate2(toX: number, toY: number, fromX: number, fromY: number, per: 
number): number[];
/**
返回from-to两点中间的距离
@param from 起点
@param to 终点
@return [number]
*/
static distance(from: Point, to: Point): number;
/**
返回from-to两点中间的距离
@param fromX 起点X
@param fromY 起点Y
@param toX 到达点X
@param toY 到达点Y
@return [number]
*/
static distance2(fromX: number, fromY: number, toX: number, toY: number): number;
/**
距离的平方
有时候为了优化计算，只是比较两个距离的长度而不需要具体值，可以调用此函数，比
distance减少了开方的计算
@param p1 起点
@param p2 终点
@return [number] 起点-终点距离的平方
*/
static distanceSquare(p1: Point, p2: Point): number;
/**
距离的平方


---

## 第 25 页

有时候为了优化计算，只是比较两个距离的长度而不需要具体值，可以调用此函数，比
distance减少了开方的计算
@param ax 起点x
@param ay 起点y
@param bx 终点x
@param by 终点y
@return [number] 起点-终点距离的平方
*/
static distanceSquare2(ax: number, ay: number, bx: number, by: number): number;
}
/**
矩形对象
根据x、y、width、height确定一个矩形，用于辅助计算
Created by 黑暗之神KDS on 2018-08-08 21:12:53.
*/
declare class Rectangle {
/**
矩形左上角的坐标x
*/
x: number;
/**
矩形左上角的坐标y
*/
y: number;
/**
矩形宽度
*/
width: number;
/**
矩形高度
*/
height: number;
/**
构造函数
@param x [可选] 默认值=0
@param y [可选] 默认值=0
@param width [可选] 默认值=0
@param height [可选] 默认值=0
*/
constructor(x?: number, y?: number, width?: number, height?: number);
/**
右边坐标x（即x+width的值）
*/
get right(): number;
/**


---

## 第 26 页

底部坐标y（即y+height的值）
*/
get bottom(): number;
/**
一次设置指定的值
@param x x轴的值
@param y y轴的值
@param width 宽度
@param height 高度
@return [Rectangle]
*/
setTo(x: number, y: number, width: number, height: number): Rectangle;
/**
是否包含指定的点
@param x 指定点的x坐标
@param y
指定点的y坐标
@return 是否包含 true=包含 false=不包含
*/
contains(x: number, y: number): boolean;
/**
是否相交与另一个指定的矩形相交
@param rect 指定的矩形
@return 是否相交 true=相交 false=不相交
*/
intersects(rect: Rectangle): boolean;
/**
获取与指定矩形相交的区域
@param rect 指定的矩形
@param out [可选] 默认值=null 如果传入此参数的话则将返回值返回到该对象中以便减少开
销
@return [Rectangle] 相交的区域
*/
intersection(rect: Rectangle, out?: Rectangle): Rectangle;
/**
通过填充两个矩形之间的水平和垂直空间，将这两个矩形组合在一起以创建一个新的 
Rectangle 对象
注意：union() 方法忽略高度或宽度值为 0 的矩形，如：var rect2:Rectangle = new 
Rectangle(300,300,50,0);
@param source 要添加到此 Rectangle 对象的 Rectangle 对象。
@param out [可选] 默认值=null 如果传入此参数的话则将返回值返回到该对象中以便减少开
销


---

## 第 27 页

@return 充当两个矩形的联合的新 Rectangle 对象。
*/
union(source: Rectangle, out?: Rectangle): Rectangle;
/**
返回一个克隆的该对象
@param out [可选] 默认值=null 如果传入此参数的话则将返回值返回到该对象中以便减少开
销
@return [Rectangle]
*/
clone(out?: Rectangle): Rectangle;
/**
返回字符串形式的值显示：x,y,width,height
@return [string]
*/
toString(): string;
/**
是否与指定的矩形相等
@param rect 指定的矩形
@return 是否相等 true=相等 false=不相等
*/
equals(rect: Rectangle): boolean;
/**
确定此 Rectangle 对象是否为空
@return 如果 Rectangle 对象的宽度或高度小于等于 0，则返回 true 值，否则返回 false
*/
isEmpty(): boolean;
}
/**
行走图辅助体数据
一般用于自定义Avatar的一些点、范围等，比如击中角色后以哪里作为中心点显示击中的动画
Created by 黑暗之神KDS on 2018-12-09 7:15:22.
*/
declare class Helper {
/**
ID
*/
id: number;
/**
坐标x
*/
x: number;
/**


---

## 第 28 页

坐标y
*/
y: number;
/**
宽度
*/
width: number;
/**
高度
*/
height: number;
/**
半径
*/
radius: number;
/**
旋转
*/
rotation: number;
/**
点位置集合:多边形为[x1,y1,x2,y2...] 线段为[x1,y1,x2,y2]
*/
points: number[];
/**
包围盒(多边形和线段用)
*/
boundingBox: Rectangle;
/**
类型
-1=无
0=矩形
1=圆形
2=三角形
3=多边形
4=线段
5=椭圆形
*/
type: number;
/**
所有顶点相对于原点的坐标
*/
pointPostion: Point[];
}
/**


---

## 第 29 页

浏览器IndexedDB大容量存储方式(异步储存)
Created by JayLen on 2021-06-18 13:26:54.
*/
declare class IndexedDBManager {
/**
数据库
*/
static indexedDB: IDBFactory;
/**
表示是否支持
*/
static support: boolean;
/**
是否使用IndexedDB大容量存储方式
*/
static used: boolean;
/**
数据库名称
*/
static databaseName: string;
/**
数据库版本号
*/
static version: number;
/**
表格名称
*/
static tableName: string;
/**
存储指定键名及其对应的值。
@param key 键名
@param value 键值(string类型)
@param onFin [可选] 默认值=null 回调函数 onFin(success:boolean)
*/
static setIndexDB(key: string, value: string, onFin?: Function): void;
/**
获取指定键名对应的值
@param key 键名
@param onFin 回调 onFin(value:string)
*/
static getIndexDB(key: string, onFin: Function): void;
/**
存储指定键名及其对应的值。
@param key 键名
@param value 键值(Object类型，会被转化为 JSON 字符串存储)


---

## 第 30 页

@param onFin [可选] 默认值=null 回调函数 onFin(success:boolean)
*/
static setIndexDBJson(key: string, value: any, onFin?: Function): void;
/**
获取指定键名对应的值
@param key 键名
@param onFin 回调函数 onFin(value:any)
*/
static getIndexDBJson(key: string, onFin: Function): void;
/**
删除指定键名的数据
@param key 键名
@param onFin [可选] 默认值=null 回调 onFin(success:boolean)
*/
static removeIndexDBItem(key: string, onFin?: Function): void;
/**
获取所有数据
@param onFin 回调 onFin(items:{})
*/
static items(onFin: Function): void;
/**
清除本地存储信息。
@param onFin [可选] 默认值=null 回调 onFin(success:boolean)
*/
static clear(onFin?: Function): void;
}
/**
数学工具类
GC内部封装的常用的一些数学相关的函数
Created by 黑暗之神KDS on 2017-08-22 20:52:51.
*/
declare class MathUtils {
/**
角度转弧度。
@param angle 角度值。
@return 返回弧度值。
*/
static angle2Radian(angle: number): number;
/**
弧度转换为角度。
@param radian 弧度值。


---

## 第 31 页

@return 返回角度值。
*/
static radian2Angle(radian: number): number;
/**
返回0~n-1的正整数
@param n
@return [number]
*/
static rand(n: number): number;
/**
获取两点之间的角度 0-360
@param x1 起点x
@param y1 起点y
@param x2 终点x
@param y2 终点y
@return [number] 终点相对于起点的角度
*/
static direction360(x1: number, y1: number, x2: number, y2: number): number;
/**
固定整数位，未满则补充0
如 fixIntDigit(2,3)  -->  003
@param s 数值 string | number
@param fixDigit [可选] 默认值=4 固定的位数
@return [string]
*/
static fixIntDigit(s: any, fixDigit?: number): string;
/**
强制转化为整数
@param v 对于不符合要求的参数则转为0
*/
static int(v: any): number;
/**
转化为浮点数
@param v 对于不符合要求的参数则转为0
*/
static float(v: any): number;
/**
判断是否在度数范围内
@param limitMax 上限 -360~360
@param limitMin 下线 -360~360
@param angle 指定的角度


---

## 第 32 页

@return [boolean]
*/
static inAngleRange(limitMax: number, limitMin: number, angle: number): boolean;
/**
判断一个数是否是2的n次幂
@param x 一个数
@return [boolean]
*/
static isPowerOfTwo(x: number): boolean;
/**
获取离x最近的一个2的次幂数
@param x
@return [number]
*/
static nextHighestPowerOfTwo(x: number): number;
/**
计算获取二次贝塞尔曲线上的某个点具体位置
@param startX 起点x
@param startY 起点y
@param CtrlX 控制点x
@param CtrlY 控制点y
@param endX 终点x
@param endY 终点y
@param t 0~1 表示起点到终点间某个点的位置信息 0表示起点，1表示终点，0.5则表示起点-
终点的一半
@param resultPoint [可选] 默认值=null 如存在则将数据装入到该点中
@return 计算点的具体位置
*/
static getBezierPoint2(startX: number, startY: number, CtrlX: number, CtrlY: number, 
endX: number, endY: number, t: number, resultPoint?: Point): Point;
}
/**
对象工具类
GC内部封装的对象的常用函数
Created by 黑暗之神KDS on 2018-07-24 02:09:40.
*/
declare class ObjectUtils {
/**
获取唯一ID：程序启动后该值从0开始自动累加，保证每次ID唯一，但不适合储存
*/
static getInstanceID(): number;
/**


---

## 第 33 页

获取随机唯一ID：适合储存，基本上不会遇到同样的ID值
*/
static getRandID(): string;
/**
将A的属性克隆给B（直接设置）
// 内部实现
for (var i in form) {
to[i] = form[i];
}
@param a 对象A-数据源
@param b 对象B-被赋值的对象
*/
static clone(form: any, to: any): void;
/**
将A的属性克隆给B，仅对于B存在的属性才克隆
// 内部实现
for (var i in to) {
to[i] = form[i];
}
@param a 对象A-数据源
@param b 对象B-被赋值的对象
*/
static cloneExcludeNonExistentAttribute(form: any, to: any): void;
/**
深度克隆属性
@param o 需要克隆的对象，能够被JSON化的数据
*/
static depthClone(o: T): T;
/**
判断两个对象是否不同 遍历a的属性是否与b相同
@param a 对象A
@param b 对象B
@return 是否相同
*/
static same(a: any, b: any): boolean;
/**
判断两个对象是否不同 遍历a的属性是否与b相同 深度对比


---

## 第 34 页

@param a 对象A
@param b 对象B
@return 是否相同
*/
static depthSame(a: any, b: any): boolean;
/**
赋值，将B的值赋值给A，不变更类型
-- B中存在的属性才会被赋值
-- 保持A的类型不变（这样可保留该类型下的方法）
@param a对象
@param b对象
*/
static assignment(a: any, b: any): void;
/**
重定义get/set
@param target 目标对象
@param defineContent {x:function(v){code}}
*/
static reDefineGetSet(target: string, defineContent: any): void;
/**
映射指定类事件相关方法，将types替换成指定对象的方法
@param clsName 类对象
@param types 需要替换的类型集合
@param toObjName 指定替换至的对象名
*/
static redefinedEventFunc(clsName: string, types: string[], toObjName: string): void;
/**
将form的属性克隆给to,排除form中的Function
@param form 
@param to 
*/
static cloneExcludeFunction(form: any, to: any): void;
}
/**
玩家基类
支持自定义属性，即玩家设定中预设的属性：比如RPG游戏中的玩家背包就是一种自定义的玩家属
性。
-- 可视化编辑自定义属性：菜单-自定义编辑器-玩家属性编辑
-- 存档会自动包含这些自定义属性
支持玩家变量：数值变量、开关变量、字符串变量：
-- 存档会自动包含玩家变量
-- 玩家变量改变会自动影响到一些地方，比如界面中的变量控件。


---

## 第 35 页

玩家默认带有一个场景对象数据：
-- 切换场景时会销毁其场景对象this.sceneObject，同时将基础数据、自定义数据写入到数据
this.data.sceneObject中
并且切换完毕后会重新创建新的场景对象this.sceneObject
-- 存档会自动包含玩家的显示对象数据（基础数据[SceneObject] + 场景对象的自定义数据）
Created by 黑暗之神KDS on 2019-05-22 00:25:37.
*/
declare class Player {
/**
唯一uid（GC平台登录的账号UID）
*/
uid: number;
/**
gc用户昵称（GC平台登录的账号昵称）
*/
gcNickName: string;
/**
玩家属性：包含自定义属性和玩家的场景对象数据（基础数据[SceneObject] + 场景对象的自
定义数据）
*/
data: PlayerData;
/**
玩家变量：包含数值变量、开关变量、字符串变量
*/
variable: Variable;
/**
玩家的场景对象实体
*/
sceneObject: SceneObjectEntity;
/**
进入指定场景
@param sceneID 场景ID
@param x [可选] 默认值=0 实际坐标x
@param y [可选] 默认值=0 实际坐标y
*/
toScene(sceneID: number, x?: number, y?: number): void;
}
/**
对象池工具
GC内部封装的对象池工具
Created by 黑暗之神KDS on 2017-10-25 17:36:38.
*/
declare class PoolUtils {
/**


---

## 第 36 页

构造函数
@param cls 需要作为重复使用的对象类
*/
constructor(cls: any);
/**
归还对象
@param obj 对象
*/
free(obj: any): void;
/**
取出对象，没有闲置对象则会新建
@return obj 对象
*/
takeout(): any;
}
/**
系统
使用该类让渲染引擎初始化以及一些常用的函数（如发布后的窗口操作）
Created by 黑暗之神KDS on 2017-01-16 16:04:32.
*/
declare class os {
/**
默认字体
*/
static defaultFamily: string;
/**
系统初始化
@param [可选]stageWidth 舞台宽 默认是页面大小 默认值=0
@param [可选]stageHeight 舞台高 默认是页面大小 默认值=0
@isWebGL [可选]是否webgl模式，默认true
@is3D [可选]是否3D模式 目前暂未支持
*/
static init(stageWidth?: number, stageHeight?: number, isWebGL?: boolean, is3D?: 
boolean): void;
/**
获取canvas元素对象
必须在os初始化后才能够获得
*/
static get canvas(): HTMLCanvasElement;
/**
支持的贴图最大尺寸
*/
static get MAX_TEXTURE_SIZE(): number;
/**


---

## 第 37 页

添加帧循环，让函数逐帧执行（帧刷）
var i =0;
os.add_ENTERFRAME(() => {
trace(++i);
}, this);
@param onHappen onHappen(arg1,arg2,...)
@param thisPtr 作用域
@param args [可选]参数集合 默认值=null
*/
static add_ENTERFRAME(onHappen: Function, thisPtr: any, args?: any[]): void;
/**
移除帧循环
比如添加帧刷后一定概率移除掉帧刷
function gameUpdate(){
if(Math.random()<0.2){
os.remove_ENTERFRAME(gameUpdate, this);
}
}
os.add_ENTERFRAME(gameUpdate, this);
@param onHappen 利用add_ENTERFRAME注册的回调方法
@param thisPtr 作用域
*/
static remove_ENTERFRAME(onHappen: Function, thisPtr: any): void;
/**
当前鼠标样式 如 os.setCursor("wait");
比如游戏中需要更换鼠标样式可以使用该方法更换，支持自定义的图片和.cur格式光标文件
（cur格式支持偏移中心点）
url 自定义图片 如 os.setCursor("url('icon.png'),pointer"); 
os.setCursor("url('icon.png'),default");
default
默认光标（通常是一个箭头）
auto
默认。浏览器设置的光标。
crosshair
光标呈现为十字线。
pointer 光标呈现为指示链接的指针（一只手）
move
此光标指示某对象可被移动。
e-resize 此光标指示矩形框的边缘可被向右（东）移动。
ne-resize
此光标指示矩形框的边缘可被向上及向右移动（北/东）。


---

## 第 38 页

nw-resize
此光标指示矩形框的边缘可被向上及向左移动（北/西）。
n-resize 此光标指示矩形框的边缘可被向上（北）移动。
se-resize
此光标指示矩形框的边缘可被向下及向右移动（南/东）。
sw-resize
此光标指示矩形框的边缘可被向下及向左移动（南/西）。
s-resize 此光标指示矩形框的边缘可被向下移动（南）。
w-resize 此光标指示矩形框的边缘可被向左移动（西）。
text 此光标指示文本。
wait此光标指示程序正忙（通常是一只表或沙漏）。
help
此光标指示可用的帮助（通常是一个问号或一个气球）。
*/
static setCursor(style: string): void;
/**
恢复更改前的记录光标
*/
static restoreCursor(): void;
/**
获取操作系统
@return 
Mac/Unix/Linux/Win2000/WinXP/Win2003/WinVista/Win7/Win10/Android/iPhone/other
*/
static detectOS(): string;
/**
获取所在平台
0-GameCreator Web GC-网站平台
1-GameCreator App GC-APP
2-PC 电脑端
3-Web/Mobile phone Web 普通网页端（包括移动版）
4-Android APK（安卓APP）
@return
*/
static get platform(): number;
/**
【仅PC端和Android端】设置全屏或取消全屏，发布后支持
*/
static fullscreen: boolean;
/**
【仅PC端】设置窗口尺寸（单位：像素），发布后支持
@param width 宽度
@param height 高度
*/
static resizeTo(width: number, height: number): void;
/**
【仅PC端】设置窗口位置（单位：像素），发布后支持


---

## 第 39 页

@param x 水平坐标
@param y 垂直坐标
*/
static moveTo(x: number, y: number): void;
/**
【仅PC端】设置是否允许更改窗口尺寸，发布后支持
@param resizable 是否允许
*/
static setResizable(resizable: boolean): void;
/**
【仅PC端】设置是否允许窗口显示在最前方，发布后支持
@param alwaysOnTop 是否允许
*/
static setAlwaysOnTop(alwaysOnTop: boolean): void;
/**
【仅PC端】最大化窗口，发布后支持
*/
static maximize(): void;
/**
【仅PC端和Android端】最小化窗口，发布后支持
*/
static minimize(): void;
/**
【仅PC端】还原窗口（用于最大化或最小化后调用可还原），发布后支持
*/
static restore(): void;
/**
【仅PC端和Android端】关闭当前窗口，在编辑器中也可以关闭
*/
static closeWindow(): void;
/**
是否在GC环境中
*/
static inGC(): boolean;
/**
显示FPS，必须在引擎初始化之后才生效
*/
static showFPS(): void;
/**
隐藏FPS，必须在引擎初始化之后才生效
*/
static hideFPS(): void;
/**
设备震动（目前仅支持安卓设备）


---

## 第 40 页

@param time (number | number[]) number类型表示震动持续时间 number[]类型表示自定
义交替的震动、暂停、震动
*/
static shake(time: number | number[]): void
/**
设备横屏显示
*/
static horizontalScreen: boolean;
/**
设备允许常亮（目前仅支持安卓设备）
*/
static insomnia: boolean;
}
/**
【顶级变量】安全环境内的parent，不会因跨域问题导致报错
*/
declare var gcParent: Window;
/**
【顶级变量】安全环境内的top，不会因跨域问题导致报错
*/
declare var gcTop: Window;
/**
【顶级变量】舞台
*/
declare var stage: Stage;
/**
图像绘制
系统根据绘制命令来渲染图像，一次命令会产生一次渲染绘制（drawcall）。
渲染次数对性能影响较大，一般整个游戏每帧全局渲染次数控制在1000以内会较为合适
Created by 黑暗之神KDS on 2017-01-01 16:04:32.
*/
declare class Graphics {
/**
销毁该对象
*/
dispose(): void;
/**
清空全部绘制命令。
*/
clear(): void;
/**
绘制整张贴图
@param tex 贴图
@param x [可选] 默认值=0 X轴偏移量
@param y [可选] 默认值=0 Y轴偏移量


---

## 第 41 页

@param width [可选] 默认值=0 宽度 默认根据贴图宽度
@param height [可选] 默认值=0 高度 默认根据贴图高度
@param m [可选] 默认值=null 矩阵信息
@param alpha [可选] 默认值=1 透明度
*/
drawTexture(tex: Texture, x?: number, y?: number, width?: number, height?: number, 
m?: Matrix, alpha?: number): void;
/**
填充贴图，可裁剪只显示贴图的一部分
@param tex 贴图
@param x X轴偏移量
@param y Y轴偏移量
@param width [可选] 默认值=0 宽度 默认根据贴图宽度
@param height [可选] 默认值=0 高度 默认根据贴图高度
@param type [可选] 默认值="repeat" 填充类型 repeat|repeat-x|repeat-y|no-repeat 表示
平铺的循环方式
@param offset [可选] 默认值=null 贴图取样的偏移量，如只绘制贴图中间的部分，则该值不
是0,0点
*/
fillTexture(tex: Texture, x: number, y: number, width?: number, height?: number, type?: 
string, offset?: Point): void;
/**
绘制文本
@param text 文本内容
@param x X轴偏移量
@param y Y轴偏移量
@param font 字号和字体 如"20px 宋体"
@param color 文本颜色 如"#FFFF00"
@param textAlign 对齐方式 "left"，"center"，"right"
*/
fillText(text: string, x: number, y: number, font: string, color: string, textAlign: string): 
void;
/**
绘制线
@param fromX X轴开始位置
@param fromY Y轴开始位置
@param toX X轴结束位置
@param toY Y轴结束位置
@param lineColor 颜色


---

## 第 42 页

@param lineWidth [可选] 默认值=1 线条宽度
*/
drawLine(fromX: number, fromY: number, toX: number, toY: number, lineColor: string, 
lineWidth?: number): void;
/**
绘制一系列线段
@param x 开始绘制的X轴位置
@param y 开始绘制的Y轴位置
@param points 线段的点集合 格式:[x1,y1,x2,y2,x3,y3...]
@param lineColor 线段颜色
@param lineWidth [可选] 默认值=1
*/
drawLines(x: number, y: number, points: number[], lineColor: string, lineWidth?: 
number): void;
/**
绘制一系列曲线
@param x 开始绘制的 X 轴位置
@param y 开始绘制的 Y 轴位置
@param points 线段的点集合，格式[startx,starty,ctrx,ctry,startx,starty...]
@param lineColor 线段颜色，或者填充绘图的渐变对象
@param lineWidth [可选] 默认值=1
*/
drawCurves(x: number, y: number, points: number[], lineColor: string, lineWidth?: 
number): void;
/**
绘制矩形
@param x 开始绘制的 X 轴位置
@param y 开始绘制的 Y 轴位置
@param width 矩形宽度
@param height 矩形高度
@param fillColor 填充颜色
@param lineColor [可选] 默认值=null 边框颜色
@param lineWidth [可选] 默认值=1 边框宽度
*/
drawRect(x: number, y: number, width: number, height: number, fillColor: any, 
lineColor?: string, lineWidth?: number): void;
/**
绘制圆形
@param x 圆点X 轴位置
@param y 圆点Y 轴位置
@param radius 半径
@param fillColor 填充颜色，或者填充绘图的渐变对象


---

## 第 43 页

@param lineColor [可选] 默认值=null 边框颜色
@param lineWidth [可选] 默认值=1 边框宽度
*/
drawCircle(x: number, y: number, radius: number, fillColor: string, lineColor?: string, 
lineWidth?: number): void;
/**
绘制扇形
var sp = new Sprite();
sp.graphics.drawPie(0,0,30,-90,90,"#FF0000");
stage.addChild(sp);
sp.x = 500;
sp.y = 500;
@param x 开始绘制的 X 轴位置
@param y 开始绘制的 Y 轴位置
@param radius 扇形半径
@param startAngle 开始角度 -90度在12点方向，90度在6点钟方向，按照顺时针开始绘制
@param endAngle 结束角度
@param fillColor 填充颜色
@param lineColor [可选] 默认值=null 边框颜色
@param lineWidth [可选] 默认值=1 边框宽度
*/
drawPie(x: number, y: number, radius: number, startAngle: number, endAngle: number, 
fillColor: string, lineColor?: string, lineWidth?: number): void;
/**
绘制多边形
var sp = new Sprite();
sp.graphics.drawPoly(0,0,[100,100,200,200,100,300,50,250],"#FF0000");
stage.addChild(sp);
sp.x = 300;
sp.y = 300;
@param x 开始绘制的 X 轴位置
@param y 开始绘制的 Y 轴位置
@param points 多边形的点集合 格式[x1,y1,x2,y2...]
@param fillColor 填充颜色
@param lineColor [可选] 默认值=null 边框颜色


---

## 第 44 页

@param lineWidth [可选] 默认值=1 边框宽度
*/
drawPoly(x: number, y: number, points: number[], fillColor: any, lineColor?: string, 
lineWidth?: number): void;
}
/**
矩阵
2D变换：表示一个转换矩阵，它确定如何将点从一个坐标空间映射到另一个坐标空间。您可以对一
个显示对象执行不同的图形转换，方法是设置 Matrix 对象的属性，
将该 Matrix 对象应用于 Transform 对象的 matrix 属性，然后应用该 Transform 对象作为显示对
象的 transform 属性。这些转换函数包括平移（x 和 y 重新定位）、旋转、缩放和倾斜
a c tx
b d ty
平移：tx、ty
缩放：a(scaleX)、d(scaleY)
旋转: q表示弧度
cos(q) -sin(q) tx
sin(q) cos(q)  ty
Created by 黑暗之神KDS on 2017-01-01 16:04:32.
*/
declare class Matrix {
/**
空矩阵：
1 0 0
0 1 0
*/
static EMPTY: Matrix;
/**
临时用的矩阵辅助体，不用创建实例而是可以重复使用该实例作为辅助计算的
*/
static TEMP: Matrix;
/**
缩放或旋转图像时影响像素沿 x 轴定位的值。
*/
a: number;
/**
旋转或倾斜图像时影响像素沿 y 轴定位的值。
*/
b: number;
/**
旋转或倾斜图像时影响像素沿 x 轴定位的值。
*/
c: number;
/**


---

## 第 45 页

缩放或旋转图像时影响像素沿 y 轴定位的值。
*/
d: number;
/**
沿 x 轴平移每个点的距离。
*/
tx: number;
/**
沿 y 轴平移每个点的距离。
*/
ty: number;
/**
构造函数
@param a [可选] 默认值=1 缩放或旋转图像时影响像素沿 x 轴定位的值。
@param b [可选] 默认值=0 旋转或倾斜图像时影响像素沿 y 轴定位的值。
@param c [可选] 默认值=0 旋转或倾斜图像时影响像素沿 x 轴定位的值。
@param d [可选] 默认值=1 缩放或旋转图像时影响像素沿 y 轴定位的值。
@param tx [可选] 默认值=0 沿 x 轴平移每个点的距离。
@param ty [可选] 默认值=0 沿 y 轴平移每个点的距离。
*/
constructor(a?: number, b?: number, c?: number, d?: number, tx?: number, ty?: number);
/**
将本矩阵设置为单位矩阵。
@return 返回当前矩形。
*/
identity(): Matrix;
/**
设置位置：直接设置tx、ty。
@param x 沿 x 轴平移每个点的距离。
@param y 沿 y 轴平移每个点的距离。
@return 返回对象本身
*/
setTranslate(x: number, y: number): Matrix;
/**
平移位置：在原来的tx、ty基础上增加值。
@param x 沿 x 轴向右移动的量（以像素为单位）。
@param y 沿 y 轴向下移动的量（以像素为单位）。
@return 返回此矩形对象。
*/
translate(x: number, y: number): Matrix;
/**
对矩阵应用缩放转换。
@param x 用于沿 x 轴缩放对象的乘数。1=100%


---

## 第 46 页

@param y 用于沿 y 轴缩放对象的乘数。1=100%
*/
scale(x: number, y: number): void;
/**
对矩阵应用旋转。
@param angle 以弧度为单位的旋转角度。
*/
rotate(angle: number): void;
/**
对矩阵应用倾斜转换。
@param x 沿着 X 轴的 2D 倾斜弧度。
@param y 沿着 Y 轴的 2D 倾斜弧度。
@return 当前 Matrix 对象。
*/
skew(x: number, y: number): Matrix;
/**
将矩阵对象表示的几何转换应用于指定点。
@param out 用来设定输出结果的点。
@return 返回out
*/
transformPoint(out: Point): Point;
/**
执行原始矩阵的逆转换。
@return 当前矩阵对象。
*/
invert(): Matrix;
/**
将矩阵对象的成员设置为指定值。
@param a 缩放或旋转图像时影响像素沿 x 轴定位的值。
@param b 旋转或倾斜图像时影响像素沿 y 轴定位的值。
@param c 旋转或倾斜图像时影响像素沿 x 轴定位的值。
@param d 缩放或旋转图像时影响像素沿 y 轴定位的值。
@param tx 沿 x 轴平移每个点的距离。
@param ty 沿 y 轴平移每个点的距离。
@return 当前矩阵对象。
*/
setTo(a: number, b: number, c: number, d: number, tx: number, ty: number): Matrix;
/**
将指定矩阵与当前矩阵连接，从而将这两个矩阵的几何效果有效地结合在一起。
@param matrix 要连接到源矩阵的矩阵。


---

## 第 47 页

@return 当前矩阵。
*/
concat(matrix: Matrix): Matrix;
/**
返回此 Matrix 对象的副本。
@return 与原始实例具有完全相同的属性的新 Matrix 实例。
*/
clone(): Matrix;
/**
返回列出该 Matrix 对象属性的文本值。
@return 一个字符串，它包含 Matrix 对象的属性值：a、b、c、d、tx 和 ty。
*/
toString(): string;
/**
销毁此对象。
*/
destroy(): void;
}
/**
Sprite 显示对象精灵
显示对象的基类，支持显示图片和事件响应
支持通用鼠标事件：
EventObject.RIGHT_MOUSE_UP 鼠标右键弹起
EventObject.RIGHT_MOUSE_DOWN 鼠标右键按下
EventObject.RIGHT_CLICK 鼠标右键点击
EventObject.CLICK 鼠标左键点击
EventObject.DOUBLE_CLICK 鼠标左键双击
EventObject.MOUSE_DOWN 鼠标左键按下
EventObject.MOUSE_UP 鼠标左键弹起
EventObject.MOUSE_WHEEL 鼠标滚轮
EventObject.DRAG_START 鼠标拖拽开始
EventObject.DRAG_MOVE 鼠标拖拽移动中
EventObject.DRAG_END 鼠标拖拽移动结束
*
// 事件监听示例
var sp = new Sprite();
sp.on(EventObject.CLICK,this,this.onClick);
Created by 黑暗之神KDS on 2017-01-01 16:04:32.
*/
declare class Sprite extends TreeNode {
/**


---

## 第 48 页

销毁
*/
dispose(): void;
/**
相对父容器的水平方向坐标
*/
x: number;
/**
相对父容器的垂直方向坐标
*/
y: number;
/**
宽度，用于鼠标检测
*/
width: number;
/**
高度，用于鼠标检测
*/
height: number;
/**
是否存在鼠标事件
*/
get hasMouseEvent(): boolean;
/**
获取本对象在父容器坐标系的矩形显示区域，计算量较大，尽量少用
@return 矩形区域
*/
getBounds(): Rectangle;
/**
获取本对象在自己坐标系的矩形显示区域，计算量较大，尽量少用
@return 矩形区域
*/
getSelfBounds(): Rectangle;
/**
X轴缩放值
*/
scaleX: number;
/**
Y轴缩放值
*/
scaleY: number;
/**
旋转角度
*/
rotation: number;
/**


---

## 第 49 页

水平倾斜角度
*/
skewX: number;
/**
垂直倾斜角度
*/
skewY: number;
/**
对象的矩阵信息。通过设置矩阵可以实现节点旋转，缩放，位移效果。
*/
transform: Matrix;
/**
轴心点的位置X，以轴心点进行缩放、旋转
*/
pivotX: number;
/**
轴心点的位置Y，以轴心点进行缩放、旋转
*/
pivotY: number;
/**
透明度
*/
alpha: number;
/**
是否显示
*/
visible: boolean;
/**
合成模式 null/lighter/blend1-1 (lighter=加法 数字可以更改，参考地图图层自定义混合模式)
*/
blendMode: string;
/**
绘制对象
*/
graphics: Graphics;
/**
显示对象的滚动矩形范围，具有裁剪效果
*/
scrollRect: Rectangle;
/**
把本地坐标转换为全局坐标
@param point 本地坐标点
@return [Point] 转换后的全局坐标
*/
localToGlobal(point: Point): Point;
/**


---

## 第 50 页

把全局坐标转换为本地坐标
@param point 全局坐标点
@return [Point] 转换后的坐标的点
*/
globalToLocal(point: Point): Point;
/**
父节点
*/
parent: TreeNode;
/**
若该对象在舞台上则返回舞台，否则返回null
@return [Stage]
*/
get stage(): Stage;
/**
可以设置一个Rectangle区域作为点击区域，设置后则以该区域作为鼠标事件检测
支持类型：HitArea | Rectangle
*/
hitArea: any;
/**
遮罩，可以设置一个对象(支持位图和矢量图)，根据对象形状进行遮罩显示，支持像素级遮罩
遮罩对象坐标系是相对遮罩对象本身的，即以该对象的0,0点为准
*/
mask: Sprite;
/**
是否接受鼠标事件
默认为false，如果监听鼠标事件，则会自动设置本对象及父节点的属性 mouseEnable 的值都
为 true（如果父节点手动设置为false，则不会更改）
*/
mouseEnabled: boolean;
/**
开始拖动此对象
@param area [可选] 默认值=null 拖动限定的区域范围内
*/
startDrag(area?: Rectangle): void;
/**
停止拖动此对象
*/
stopDrag(): void;
/**
检测某个点是否在此对象内
@param x 全局x坐标
@param y 全局y坐标。


---

## 第 51 页

@return  表示是否在对象内
*/
hitTestPoint(x: number, y: number): boolean;
/**
获得相对于stage的全局X轴缩放值（会叠加父亲节点的缩放值）。
*/
get globalScaleX(): number;
/**
获得相对于stage的全局Y轴缩放值（会叠加父亲节点的缩放值）。
*/
get globalScaleY(): number;
/**
返回鼠标在此对象坐标系上的 X 轴坐标信息。
*/
get mouseX(): number;
/**
返回鼠标在此对象坐标系上的 Y 轴坐标信息。
*/
get mouseY(): number;
/**
设置坐标位置。相当于分别设置x和y属性。
@param x
X轴坐标。
@param y
Y轴坐标。
@param 
speedMode （可选）是否极速模式，正常是调用this.x=value进行赋值，极速
模式直接调用内部函数处理，
如果未重写x,y属性，建议设置为急速模式性能更高。
@return 返回对象本身。
*/
pos(x: number, y: number, speedMode?: boolean): Sprite;
}
/**
鼠标点击区域
可以设置绘制一系列矢量图作为点击区域和非点击区域（目前只支持圆形，矩形，多边形）
Created by 黑暗之神KDS on 2017-01-01 16:04:32.
*/
declare class HitArea {
/**
是否击中Graphic
@param x x坐标
@param y y坐标
@param graphic 图形源
@return [boolean]
*/
static isHitGraphic(x: number, y: number, graphic: Graphics): boolean;
/**


---

## 第 52 页

坐标是否在多边形内
@param x x坐标
@param y y坐标
@param areaPoints 格式 [x1,y1,x2,y2...]
@return [boolean]
*/
static ptInPolygon(x: number, y: number, areaPoints: number[]): boolean;
/**
是否包含某个点
@param x x坐标
@param y y坐标
@return 是否点击到
*/
isHit(x: number, y: number): boolean;
/**
检测对象是否包含指定的点。
@param x
点的 X 轴坐标值（水平位置）。
@param y
点的 Y 轴坐标值（垂直位置）。
@return 如果包含指定的点，则值为 true；否则为 false。
*/
contains(x: number, y: number): boolean;
/**
可点击区域，可以设置绘制一系列矢量图作为点击区域（支持圆形，矩形，多边形）
*/
hit: Graphics;
/**
不可点击区域，可以设置绘制一系列矢量图作为非点击区域（支持圆形，矩形，多边形）
*/
unHit: Graphics;
}
/**
舞台类
只有一个舞台，可通过stage来访问
支持事件：
EventObject.KEY_DOWN 按键按下
EventObject.KEY_UP 按键弹起
EventObject.RESIZE 当窗口尺寸改变时
EventObject.FULL_SCREEN_CHANGE 当全屏改变时
EventObject.FOCUS_CHANGE 当焦点改变时
EventObject.FOCUS 当产生焦点时
EventObject.BLUR 当失去焦点时
EventObject.RENDER 每帧渲染时


---

## 第 53 页

// 事件监听示例
stage.on(EventObject.CLICK,this,this.onClick);
*
Created by 黑暗之神KDS on 2017-01-01 16:04:32.
*/
declare class Stage extends Sprite {
/**
当前宽度
*/
width: number;
/**
当前高度
*/
height: number;
/**
设置屏幕大小，场景会根据屏幕大小进行适配。可以动态调用此方法，来更改游戏显示的大小
@param screenWidth
屏幕宽度。
@param screenHeight
屏幕高度。
*/
setScreenSize(screenWidth: number, screenHeight: number): void;
/**
缩放模式。默认值为 "noscale"
取值范围：
"noscale" ：不缩放
"exactfit" ：全屏不等比缩放
"showall" ：最小比例缩放
"noborder" ：最大比例缩放
"full" ：不缩放，stage的宽高等于屏幕宽高
"fixedwidth" ：宽度不变，高度根据屏幕比缩放
"fixedheight" ：高度不变，宽度根据屏幕比缩放
"fixedauto" ：根据宽高比，自动选择使用fixedwidth或fixedheight
*/
scaleMode: string;
/**
水平对齐方式。默认值为"left"
取值范围：
"left" ：居左对齐
"center" ：居中对齐
"right" ：居右对齐
*/
alignH: string;
/**
垂直对齐方式。默认值为"top"


---

## 第 54 页

取值范围：
"top" ：居顶部对齐
"middle" ：居中对齐
"bottom" ：居底部对齐
*/
alignV: string;
/**
舞台的背景颜色，默认为黑色
*/
bgColor: string;
/**
鼠标在 Stage 上的 X 轴坐标
*/
get mouseX(): number;
/**
鼠标在 Stage 上的 Y 轴坐标。
*/
get mouseY(): number;
/**
当前视窗由缩放模式导致的 X 轴缩放系数。
*/
get clientScaleX(): number;
/**
当前视窗由缩放模式导致的 Y 轴缩放系数。
*/
get clientScaleY(): number;
/**
场景布局类型。
取值范围：
"none" ：不更改屏幕
"horizontal" ：自动横屏
"vertical" ：自动竖屏
*/
screenMode: string;
/**
是否显示
*/
visible: boolean;
/**
是否开启全屏，用户点击后进入全屏
兼容性提示：部分浏览器不允许点击进入全屏，比如Iphone等。
*/
fullScreenEnabled: boolean;
/**


---

## 第 55 页

退出全屏模式
*/
exitFullscreen(): void;
}
/**
节点类
显示对象的基类，拥有父子节点的特性，树结构
支持事件：
EventObject.DISPLAY 加入到显示列表中时（即该对象加入stage的显示列表里，从不需要被渲染到
需要渲染的状态改变时触发）
EventObject.UNDISPLAY 从显示列表中移除时（即该对象从stage的显示列表移除时，从需要被渲
染到不需要渲染的状态改变时触发）
EventObject.REMOVED 从父节点中移除时触发（无需在显示列表中）
EventObject.ADDED 加入到某个节点时触发（无需在显示列表中）
*
Created by 黑暗之神KDS on 2017-01-01 16:04:32.
*/
declare class TreeNode extends EventDispatcher {
/**
节点名称
*/
name: string;
/**
是否已经销毁。对象销毁后不能再使用
*/
get disposed(): boolean;
/**
销毁此对象。destroy对象默认会把自己从父节点移除，并且清理自身引用关系，等待js自动
垃圾回收机制回收。destroy后不能再使用。
destroy时会移除自身的事情监听，自身的timer监听，移除子对象及从父节点移除自己。
*/
dispose(): void;
/**
添加子节点。
@param node 节点对象
@return 返回添加的节点
*/
addChild(node: TreeNode): TreeNode;
/**
批量增加子节点
@param ...args 无数子节点。
*/
addChildren(...args: any[]): void;
/**
添加子节点到指定的索引位置。


---

## 第 56 页

@param node 节点对象。
@param index 索引位置。
@return 返回添加的节点。
*/
addChildAt(node: TreeNode, index: number): TreeNode;
/**
根据子节点对象，获取子节点的索引位置。
@param node 子节点。
@return 子节点所在的索引位置。
*/
getChildIndex(node: TreeNode): number;
/**
根据子节点的名字，获取子节点对象。
@param name 子节点的名字。
@return 节点对象。
*/
getChildByName(name: string): TreeNode;
/**
根据子节点的索引位置，获取子节点对象。
@param index 索引位置
@return 子节点
*/
getChildAt(index: number): TreeNode;
/**
设置子节点的索引位置。
@param node 子节点。
@param index 新的索引。
@return 返回子节点本身。
*/
setChildIndex(node: TreeNode, index: number): TreeNode;
/**
删除子节点。
@param node 子节点
@return 被删除的节点
*/
removeChild(node: TreeNode): TreeNode;
/**
从父容器删除自己，如已经被删除不会抛出异常。
@return 当前节点（ TreeNode ）对象。
*/
removeSelf(): TreeNode;
/**
根据子节点名字删除对应的子节点对象，如果找不到不会抛出异常。


---

## 第 57 页

@param name 对象名字。
@return 查找到的节点（ TreeNode ）对象。
*/
removeChildByName(name: string): TreeNode;
/**
根据子节点索引位置，删除对应的子节点对象。
@param index 节点索引位置。
@return 被删除的节点。
*/
removeChildAt(index: number): TreeNode;
/**
删除指定索引区间的所有子对象。
@param beginIndex 开始索引。默认值=0
@param endIndex 结束索引。默认值=0x7fffffff
@return 当前节点对象。
*/
removeChildren(beginIndex?: number, endIndex?: number): TreeNode;
/**
子对象数量。
*/
get numChildren(): number;
/**
父节点
*/
parent: TreeNode;
/**
当前容器是否包含指定的 TreeNode 节点对象 。
@param node  指定的 TreeNode 节点对象 。
@return 一个布尔值表示是否包含指定的 TreeNode 节点对象 。
*/
contains(node: TreeNode): boolean;
}
/**
事件对象
当发生事件后回调中带有此类实例
同时用于常用的事件类别储存，如EventObject.MOUSE_DOWN
*
Created by 黑暗之神KDS on 2017-01-01 16:04:32.
*/
declare class EventObject {
/**
定义 mousedown 事件对象的 type 属性值 鼠标左键按下时事件
*/
static MOUSE_DOWN: string;
/**


---

## 第 58 页

定义 mouseup 事件对象的 type 属性值 鼠标左键弹起时事件
*/
static MOUSE_UP: string;
/**
定义 click 事件对象的 type 属性值 鼠标点击时事件
*/
static CLICK: string;
/**
定义 rightmousedown 事件对象的 type 属性值 鼠标右键按下时事件
*/
static RIGHT_MOUSE_DOWN: string;
/**
定义 rightmouseup 事件对象的 type 属性值 鼠标右键弹起时事件
*/
static RIGHT_MOUSE_UP: string;
/**
定义 rightclick 事件对象的 type 属性值 鼠标右键点击时事件
*/
static RIGHT_CLICK: string;
/**
定义 mousemove 事件对象的 type 属性值 鼠标移动时事件
*/
static MOUSE_MOVE: string;
/**
定义 mouseover 事件对象的 type 属性值 鼠标进入悬停时事件
*/
static MOUSE_OVER: string;
/**
定义 mouseout 事件对象的 type 属性值 鼠标移除悬停时事件
*/
static MOUSE_OUT: string;
/**
定义 mousewheel 事件对象的 type 属性值 鼠标滚轮事件
*/
static MOUSE_WHEEL: string;
/**
定义 doubleclick 事件对象的 type 属性值 鼠标左键双击事件
*/
static DOUBLE_CLICK: string;
/**
定义 change 事件对象的 type 属性值 状态更改事件
*/
static CHANGE: string;
/**


---

## 第 59 页

定义 resize 事件对象的 type 属性值 重置尺寸时事件
*/
static RESIZE: string;
/**
定义 added 事件对象的 type 属性值 添加到父节点时触发
*/
static ADDED: string;
/**
定义 removed 事件对象的 type 属性值 从父节点移除时触发
*/
static REMOVED: string;
/**
定义 display 事件对象的 type 属性值 加入到显示列表中时添加
*/
static DISPLAY: string;
/**
定义 undisplay 事件对象的 type 属性值 从显示列表中移除时添加
*/
static UNDISPLAY: string;
/**
定义 error 事件对象的 type 属性值 发生错误时事件
*/
static ERROR: string;
/**
定义 complete 事件对象的 type 属性值 完成事件
*/
static COMPLETE: string;
/**
定义 loaded 事件对象的 type 属性值 加载完毕事件
*/
static LOADED: string;
/**
定义 progress 事件对象的 type 属性值 加载过程中事件
*/
static PROGRESS: string;
/**
定义 input 事件对象的 type 属性值 输入事件
*/
static INPUT: string;
/**
定义 render 事件对象的 type 属性值 渲染时事件
*/
static RENDER: string;
/**


---

## 第 60 页

定义 keydown 事件对象的 type 属性值 按键按下
*/
static KEY_DOWN: string;
/**
定义 keypress 事件对象的 type 属性值 按键按下一次(字母区分大小写)
*/
static KEY_PRESS: string;
/**
定义 keyup 事件对象的 type 属性值 按键弹起
*/
static KEY_UP: string;
/**
定义 dragstart 事件对象的 type 属性值 拖拽开始
*/
static DRAG_START: string;
/**
定义 dragmove 事件对象的 type 属性值 拖拽移动中
*/
static DRAG_MOVE: string;
/**
定义 dragend 事件对象的 type 属性值 拖拽结束
*/
static DRAG_END: string;
/**
定义 enter 事件对象的 type 属性值 输入框输入回车键时
*/
static ENTER: string;
/**
定义 blur 事件对象的 type 属性值 失去焦点事件
*/
static BLUR: string;
/**
定义 focus 事件对象的 type 属性值 获得焦点事件
*/
static FOCUS: string;
/**
定义 focuschange 事件对象的 type 属性值 失去焦点或者获取焦点时事件
*/
static FOCUS_CHANGE: string;
/**
浏览器全屏更改时触发
*/
static FULL_SCREEN_CHANGE: string;
/**


---

## 第 61 页

显卡设备丢失时触发
*/
static DEVICE_LOST: string;
/**
事件类型。
*/
type: string;
/**
原生浏览器事件
*/
nativeEvent: any;
/**
事件目标触发对象
*/
target: Sprite;
/**
事件当前冒泡对象
*/
currentTarget: Sprite;
/**
分配给触摸点的唯一标识号（作为 int）
*/
touchId: number;
/**
键盘值
*/
keyCode: number;
/**
滚轮滑动增量
*/
delta: number;
/**
阻止对事件流中当前节点的后续节点中的所有事件侦听器进行处理。此方法不会影响当前节点 
(currentTarget) 中的任何事件侦听器。
*/
stopPropagation(): void;
/**
触摸点列表。
*/
get touches(): Array;
/**
表示 Alt 键是处于活动状态 (true) 还是非活动状态 (false)。
*/
get altKey(): boolean;
/**


---

## 第 62 页

表示 Ctrl 键是处于活动状态 (true) 还是非活动状态 (false)。
*/
get ctrlKey(): boolean;
/**
表示 Shift 键是处于活动状态 (true) 还是非活动状态 (false)。
*/
get shiftKey(): boolean;
/**
包含按下或释放的键的字符代码值。字符代码值为英文键盘值。
*/
get charCode(): boolean;
/**
表示键在键盘上的位置。这对于区分在键盘上多次出现的键非常有用。
例如，您可以根据此属性的值来区分左 Shift 键和右 Shift 键，或者是数字键和小键盘。
*/
get keyLocation(): number;
/**
鼠标在 Stage 上的 X 轴坐标（绝对坐标）
*/
get stageX(): number;
/**
鼠标在 Stage 上的 Y 轴坐标（绝对坐标）
*/
get stageY(): number;
}
/**
事件调度器
可调度事件的所有类的基类。
*
Created by 黑暗之神KDS on 2017-01-01 16:04:32.
*/
declare class EventDispatcher {
/**
检查 EventDispatcher 对象是否为特定事件类型注册了任何侦听器。
@param type 事件的类型。
@return 如果指定类型的侦听器已注册，则值为 true；否则，值为 false。
*/
hasListener(type: string): boolean;
/**
派发事件。
@param type
事件类型。
@param data
（可选）回调数据。默认值=null 注意：如果是需要传递多个参数 
p1,p2,p3,...可以使用数组结构如：[p1,p2,p3,...] ；如果需要回调单个参数 p 是一个数组，则需
要使用结构如：[p]，其他的单个参数 p ，可以直接传入参数 p。


---

## 第 63 页

@return 此事件类型是否有侦听者，如果有侦听者则值为 true，否则值为 false。
*/
event(type: string, data?: any): boolean;
/**
使用 EventDispatcher 对象注册指定类型的事件侦听器对象，以使侦听器能够接收事件通知。
@param type
事件的类型。
@param caller
事件侦听函数的执行域。
@param listener 事件侦听函数。
@param args
（可选）事件侦听函数的回调参数。默认值=null
@return 此 EventDispatcher 对象。
*/
on(type: string, caller: any, listener: Function, args?: Array): EventDispatcher;
/**
使用 EventDispatcher 对象注册指定类型的事件侦听器对象，以使侦听器能够接收事件通知，
此侦听事件响应一次后自动移除。
@param type
事件的类型。
@param caller
事件侦听函数的执行域。
@param listener 事件侦听函数。
@param args
（可选）事件侦听函数的回调参数。默认值=null
@return 此 EventDispatcher 对象。
*/
once(type: string, caller: any, listener: Function, args?: Array): EventDispatcher;
/**
从 EventDispatcher 对象中删除侦听器。
@param type
事件的类型。
@param caller
事件侦听函数的执行域。
@param listener 事件侦听函数。
@param onceOnly
（可选）如果值为 true ,则只移除通过 once 方法添加的侦听器。默认
值=false
@return 此 EventDispatcher 对象。
*/
off(type: string, caller: any, listener: Function, onceOnly?: boolean): EventDispatcher;
/**
从 EventDispatcher 对象中删除指定事件类型的所有侦听器。
@param type
（可选）事件类型，如果值为 null，则移除本对象所有类型的侦听器。默
认值=null
@return 此 EventDispatcher 对象。
*/
offAll(type?: string): EventDispatcher;
/**
检测指定事件类型是否是鼠标事件。
@param type 事件的类型。


---

## 第 64 页

@return 如果是鼠标事件，则值为 true;否则，值为 false。
*/
isMouseEvent(type: string): boolean;
}
/**
键盘按键常用值
属性是一些常数，这些常数表示控制游戏时最常用的键。
*
Created by 黑暗之神KDS on 2017-01-01 16:04:32.
*/
declare class Keyboard {
/**
获取键位对应的按键名称。
@param keyCode 按键值
*/
static getKeyName(keyCode: number): string;
/**
与 0 的键控代码值(48)关联的常数
*/
static NUMBER_0: number;
/**
与 1 的键控代码值(49)关联的常数
*/
static NUMBER_1: number;
/**
与 2 的键控代码值(50)关联的常数
*/
static NUMBER_2: number;
/**
与 3 的键控代码值(51)关联的常数
*/
static NUMBER_3: number;
/**
与 4 的键控代码值(52)关联的常数
*/
static NUMBER_4: number;
/**
与 5 的键控代码值(53)关联的常数
*/
static NUMBER_5: number;
/**
与 6 的键控代码值(54)关联的常数
*/
static NUMBER_6: number;
/**


---

## 第 65 页

与 7 的键控代码值(55)关联的常数
*/
static NUMBER_7: number;
/**
与 8 的键控代码值(56)关联的常数
*/
static NUMBER_8: number;
/**
与 9 的键控代码值(57)关联的常数
*/
static NUMBER_9: number;
/**
与 A 键的键控代码值(65)关联的常数
*/
static A: number;
/**
与 B 键的键控代码值(66)关联的常数
*/
static B: number;
/**
与 C 键的键控代码值(67)关联的常数
*/
static C: number;
/**
与 D 键的键控代码值(68)关联的常数
*/
static D: number;
/**
与 E 键的键控代码值(69)关联的常数
*/
static E: number;
/**
与 F 键的键控代码值(70)关联的常数
*/
static F: number;
/**
与 G 键的键控代码值(71)关联的常数
*/
static G: number;
/**
与 H 键的键控代码值(72)关联的常数
*/
static H: number;
/**


---

## 第 66 页

与 I 键的键控代码值(73)关联的常数
*/
static I: number;
/**
与 J 键的键控代码值(74)关联的常数
*/
static J: number;
/**
与 K 键的键控代码值(75)关联的常数
*/
static K: number;
/**
与 L 键的键控代码值(76)关联的常数
*/
static L: number;
/**
与 M 键的键控代码值(77)关联的常数
*/
static M: number;
/**
与 N 键的键控代码值(78)关联的常数。
*/
static N: number;
/**
与 O 键的键控代码值(79)关联的常数。
*/
static O: number;
/**
与 P 键的键控代码值(80)关联的常数。
*/
static P: number;
/**
与 Q 键的键控代码值(81)关联的常数。
*/
static Q: number;
/**
与 R 键的键控代码值(82)关联的常数。
*/
static R: number;
/**
与 S 键的键控代码值(83)关联的常数。
*/
static S: number;
/**


---

## 第 67 页

与 T 键的键控代码值(84)关联的常数。
*/
static T: number;
/**
与 U 键的键控代码值(85)关联的常数。
*/
static U: number;
/**
与 V 键的键控代码值(86)关联的常数。
*/
static V: number;
/**
与 W 键的键控代码值(87)关联的常数。
*/
static W: number;
/**
与 X 键的键控代码值(88)关联的常数。
*/
static X: number;
/**
与 Y 键的键控代码值(89)关联的常数。
*/
static Y: number;
/**
与 Z 键的键控代码值(90)关联的常数。
*/
static Z: number;
/**
与 F1 的键控代码值(112)关联的常数。
*/
static F1: number;
/**
与 F2 的键控代码值(113)关联的常数。
*/
static F2: number;
/**
与 F3 的键控代码值(114)关联的常数。
*/
static F3: number;
/**
与 F4 的键控代码值(115)关联的常数。
*/
static F4: number;
/**


---

## 第 68 页

与 F5 的键控代码值(116)关联的常数。
*/
static F5: number;
/**
与 F6 的键控代码值(117)关联的常数。
*/
static F6: number;
/**
与 F7 的键控代码值(118)关联的常数。
*/
static F7: number;
/**
与 F8 的键控代码值(119)关联的常数。
*/
static F8: number;
/**
与 F9 的键控代码值(120)关联的常数。
*/
static F9: number;
/**
与 F10 的键控代码值(121)关联的常数。
*/
static F10: number;
/**
与 F11 的键控代码值(122)关联的常数。
*/
static F11: number;
/**
与 F12 的键控代码值(123)关联的常数。
*/
static F12: number;
/**
与 F13 的键控代码值(124)关联的常数。
*/
static F13: number;
/**
与 F14 的键控代码值(125)关联的常数。
*/
static F14: number;
/**
与 F15 的键控代码值(126)关联的常数。
*/
static F15: number;
/**


---

## 第 69 页

与数字键盘的伪键控代码(21)关联的常数。
*/
static NUMPAD: number;
/**
与数字键盘上的数字 0 的键控代码值(96)关联的常数。
*/
static NUMPAD_0: number;
/**
与数字键盘上的数字 1 的键控代码值(97)关联的常数。
*/
static NUMPAD_1: number;
/**
与数字键盘上的数字 2 的键控代码值(98)关联的常数。
*/
static NUMPAD_2: number;
/**
与数字键盘上的数字 3 的键控代码值(99)关联的常数。
*/
static NUMPAD_3: number;
/**
与数字键盘上的数字 4 的键控代码值(100)关联的常数。
*/
static NUMPAD_4: number;
/**
与数字键盘上的数字 5 的键控代码值(101)关联的常数。
*/
static NUMPAD_5: number;
/**
与数字键盘上的数字 6 的键控代码值(102)关联的常数。
*/
static NUMPAD_6: number;
/**
与数字键盘上的数字 7 的键控代码值(103)关联的常数。
*/
static NUMPAD_7: number;
/**
与数字键盘上的数字 8 的键控代码值(104)关联的常数。
*/
static NUMPAD_8: number;
/**
与数字键盘上的数字 9 的键控代码值(105)关联的常数。
*/
static NUMPAD_9: number;
/**


---

## 第 70 页

与数字键盘上的加号(+)的键控代码值(107)关联的常数。
*/
static NUMPAD_ADD: number;
/**
与数字键盘上的小数点(.)的键控代码值(110)关联的常数。
*/
static NUMPAD_DECIMAL: number;
/**
与数字键盘上的除号(/)的键控代码值(111)关联的常数。
*/
static NUMPAD_DIVIDE: number;
/**
与数字键盘上的 Enter 的键控代码值(108)关联的常数。
*/
static NUMPAD_ENTER: number;
/**
与数字键盘上的乘号(*)的键控代码值(106)关联的常数。
*/
static NUMPAD_MULTIPLY: number;
/**
与数字键盘上的减号(-)的键控代码值(109)关联的常数。
*/
static NUMPAD_SUBTRACT: number;
/**
与 ; 键的键控代码值(186)关联的常数。
*/
static SEMICOLON: number;
/**
与=键的键控代码值(187)关联的常数。
*/
static EQUAL: number;
/**
与 F15 的键控代码值(188)关联的常数。
*/
static COMMA: number;
/**
与 - 键的键控代码值(189)关联的常数。
*/
static MINUS: number;
/**
与 . 键的键控代码值(190)关联的常数。
*/
static PERIOD: number;
/**


---

## 第 71 页

与 / 键的键控代码值(191)关联的常数。
*/
static SLASH: number;
/**
与 ` 键的键控代码值(192)关联的常数。
*/
static BACKQUOTE: number;
/**
与 [ 键的键控代码值(219)关联的常数。
*/
static LEFTBRACKET: number;
/**
与 \ 键的键控代码值(220)关联的常数。
*/
static BACKSLASH: number;
/**
与 ] 键的键控代码值(221)关联的常数。
*/
static RIGHTBRACKET: number;
/**
与 ' 键的键控代码值(222)关联的常数。
*/
static QUOTE: number;
/**
与 Alternate(Option)键的键控代码值(18)关联的常数。
*/
static ALTERNATE: number;
/**
与 Backspace 的键控代码值(8)关联的常数。
*/
static BACKSPACE: number;
/**
与 Caps Lock 的键控代码值(20)关联的常数。
*/
static CAPS_LOCK: number;
/**
与 Mac 命令键(15)关联的常数。
*/
static COMMAND: number;
/**
与 Ctrl 的键控代码值(17)关联的常数。
*/
static CONTROL: number;
/**


---

## 第 72 页

与 Delete 的键控代码值(46)关联的常数。
*/
static DELETE: number;
/**
与 Enter 的键控代码值(13)关联的常数。
*/
static ENTER: number;
/**
与 Esc 的键控代码值(27)关联的常数。
*/
static ESCAPE: number;
/**
与 Page Up 的键控代码值(33)关联的常数。
*/
static PAGE_UP: number;
/**
与 Page Down 的键控代码值(34)关联的常数。
*/
static PAGE_DOWN: number;
/**
与 End 的键控代码值(35)关联的常数。
*/
static END: number;
/**
与 Home 的键控代码值(36)关联的常数。
*/
static HOME: number;
/**
与向左箭头键的键控代码值(37)关联的常数。
*/
static LEFT: number;
/**
与向上箭头键的键控代码值(38)关联的常数。
*/
static UP: number;
/**
与向右箭头键的键控代码值(39)关联的常数。
*/
static RIGHT: number;
/**
与向下箭头键的键控代码值(40)关联的常数。
*/
static DOWN: number;
/**


---

## 第 73 页

与 Shift 的键控代码值(16)关联的常数。
*/
static SHIFT: number;
/**
与空格键的键控代码值(32)关联的常数。
*/
static SPACE: number;
/**
与 Tab 的键控代码值(9)关联的常数。
*/
static TAB: number;
/**
与 Insert 的键控代码值(45)关联的常数。
*/
static INSERT: number;
}
/**
滤镜基类
主要用于判断是否是滤镜
*
Created by 黑暗之神KDS on 2017-01-01 16:04:32.
*/
declare class Filter {
}
/**
模糊滤镜
用于模糊显示对象用
Created by 黑暗之神KDS on 2017-01-01 16:04:32.
*/
declare class BlurFilter extends Filter {
/**
模糊滤镜的强度(值越大，越不清晰） 如strength=4
*/
strength: number;
/**
模糊滤镜
@param strength 模糊滤镜的强度值 默认值=4
*/
constructor(strength?: number);
}
/**
颜色滤镜
使用 ColorFilter 类可以将 4 x 5 矩阵转换应用于输入图像上的每个像素的 RGBA 颜色和 Alpha 值，
以生成具有一组新的 RGBA 颜色和 Alpha 值的结果。该类允许饱和度更改、色相旋转、亮度转 
Alpha 以及各种其他效果。


---

## 第 74 页

您可以将滤镜应用于任何显示对象（即，从 Sprite 类继承的对象）。
注意：对于 RGBA 值，最高有效字节代表红色通道值，其后的有效字节分别代表绿色、蓝色和 
Alpha 通道值。
*
利用此颜色矩阵可以制作：色相、明暗、灰度、色调等效果
// 默认值
1,0,0,0,0,
0,1,0,0,0,
0,0,1,0,0,
0,0,0,1,0
// 原理
a[0]  a[1]  a[2]  a[3]  a[4]
a[5]  a[6]  a[7]  a[8]  a[9]
a[10] a[11] a[12] a[13] a[14]
a[15] a[16] a[17] a[18] a[19]
*
redResult   = (a[0]  * srcR) + (a[1]  * srcG) + (a[2]  * srcB) + (a[3]  * srcA) + a[4]
greenResult = (a[5]  * srcR) + (a[6]  * srcG) + (a[7]  * srcB) + (a[8]  * srcA) + a[9]
blueResult  = (a[10] * srcR) + (a[11] * srcG) + (a[12] * srcB) + (a[13] * srcA) + a[14]
alphaResult = (a[15] * srcR) + (a[16] * srcG) + (a[17] * srcB) + (a[18] * srcA) + a[19]
*
Created by 黑暗之神KDS on 2017-01-01 16:04:32.
*/
declare class ColorFilter extends Filter {
/**
构造函数 默认值=4
*/
constructor(mat?: Array);
}
/**
发光滤镜
也可以当成阴影滤使用
*
Created by 黑暗之神KDS on 2017-01-01 16:04:32.
*/
declare class GlowFilter extends Filter {
/**
创建发光滤镜
@param color
滤镜的颜色
@param blur 边缘模糊的大小 默认值=4
@param offX X轴方向的偏移 默认值=6


---

## 第 75 页

@param offY Y轴方向的偏移 默认值=6
*/
constructor(color: string, blur?: number, offX?: number, offY?: number);
/**
X轴方向的偏移
*/
offY: number;
/**
Y轴方向的偏移
*/
offX: number;
/**
获取数组形式的颜色格式 [R,G,B,A] 范围0~1
@return [Array]
*/
getColor(): Array;
/**
模糊程度
*/
blur: number;
}
/**
色相滤镜
颜色旋转滤镜，整体颜色旋转
Created by 黑暗之神KDS on 2017-01-01 16:04:32.
*/
declare class HueFilter extends ColorFilter {
/**
我的颜色矩阵 5x4
*/
colorMat: number[];
/**
构造函数
-180~180
-1~-120 normal -> green
-121~-180
@param hue 取值范围-180~180，0表示没有色相旋转 默认值=0
*/
constructor(hue?: number);
}
/**
声道
用来控制程序中的声音。每个声音均分配给一个声道，
而且应用程序可以具有混合在一起的多个声道。
包含控制声音的播放、暂停、停止、音量的方法，


---

## 第 76 页

以及获取声音的播放状态、总时间、当前播放时间、总循环次数、播放地址等信息的方法。
支持事件：EventObject.COMPLETE
Created by 黑暗之神KDS on 2017-01-01 16:04:32.
*/
declare class SoundChannel extends EventDispatcher {
/**
声音地址。
*/
url: string;
/**
循环次数。
*/
loops: number;
/**
开始时间。
*/
startTime: number;
/**
表示声音是否已暂停。
*/
isStopped: boolean;
/**
音量范围从 0（静音）至 1（最大音量）。
*/
volume: number;
/**
获取当前播放时间。
*/
get position(): number;
/**
获取总时间。
*/
get duration(): number;
/**
播放。
*/
play(): void;
/**
停止。
*/
stop(): void;
/**
暂停。
*/
pause(): void;
/**


---

## 第 77 页

继续播放。
*/
resume(): void;
}
/**
请求
通过封装 HTML XMLHttpRequest 对象提供了对 HTTP 协议的完全的访问，包括做出 POST 和 
HEAD 请求以及普通的 GET 请求的能力。
只提供以异步的形式返回 Web 服务器的响应，并且能够以文本或者二进制的形式返回内容。
注意：建议每次请求都使用新的 HttpRequest 对象，因为每次调用该对象的send方法时，都会清
空之前设置的数据，并重置 HTTP 请求的状态，
这会导致之前还未返回响应的请求被重置，从而得不到之前请求的响应结果。
支持事件
EventObject.COMPLETE 加载完成事件 onComplete(content:any)
EventObject.PROGRESS 加载过程事件（一般大文件才有） onProgress(progress:number)
EventObject.ERROR 加载错误事件
*
// 代码示例：
var ur = new HttpRequest();
ur.send("http://www.gamecreator.com.cn");
ur.on(EventObject.COMPLETE, this, (content:string) => {
// to do
});
ur.on(EventObject.PROGRESS, this, (progress:number) => {
// 进度 0~1
trace("进度=",progress)
});
ur.on(EventObject.ERROR, this, (error:string) => {
// to do
trace(error);
});
*
Created by 黑暗之神KDS on 2017-01-01 16:04:32.
*/
declare class HttpRequest extends EventDispatcher {
/**
请求服务器
@param params {url:string,data:
{xxx:yyy},method:"post",responseType:"json",gcToken:null} method="post/get" 
responseType="json/text"
@param succeed succeed(res)


---

## 第 78 页

@param failed failed()
*/
static requestServer(params: any, succeed: Function, failed: Function): void;
/**
发送 HTTP 请求。
@param url
请求的地址。大多数浏览器实施了一个同源安全策略，并且要求
这个 URL 与包含脚本的文本具有相同的主机名和端口。
@param data
(default = null)发送的数据。如 "{ mode: 6, act: 5 }" 或 
"act=5&mode=6"
@param method
(default = "get")用于请求的 HTTP 方法。值包括 
"get"、"post"、"head"。
@param responseType
(default = "text")Web 服务器的响应类型，可设置为 
"text"、"json"、"xml"、"arraybuffer"。
@param headers
(default = null) HTTP 请求的头部信息。参数形如key-value数
组：key是头部的名称，不应该包括空白、冒号或换行；value是头部的值，不应该包括换行。
比如["Content-Type", "application/json"]。
*/
send(url: string, data?: any, method?: string, responseType?: string, headers?: Array): 
void;
/**
请求的地址。
*/
get url(): string;
/**
返回的数据。
*/
get data(): any;
/**
本对象所封装的原生 XMLHttpRequest 引用。
*/
get http(): XMLHttpRequest;
}
/**
浏览器缓存
用于没有时间限制的数据存储,类似网页的永久cookies，清空缓存或更换浏览器都会失效
储存和读取都是同步的，所以可以代码上下行操作
== 使用方式 ==
var a = {b:123,c:456,d:"gamecreator"};
// 缓存
LocalStorage.setJSON("myKey",a);
// 读取缓存
LocalStorage.getJSON("myKey",b);
*


---

## 第 79 页

Created by 黑暗之神KDS on 2017-01-01 16:04:32.
*/
declare class LocalStorage {
/**
数据列表。
*/
static items: any;
/**
表示是否支持LocalStorage。
*/
static support: boolean;
/**
存储指定键名和键值，字符串类型。
@param key 键名。
@param value 键值。
*/
static setItem(key: string, value: string): void;
/**
获取指定键名的值。
@param key 键名。
@return 字符串型值。
*/
static getItem(key: string): string;
/**
存储指定键名及其对应的 Object 类型值。
@param key 键名。
@param value 键值。是 Object 类型，此致会被转化为 JSON 字符串存储。
*/
static setJSON(key: string, value: any): void;
/**
获取指定键名对应的Object 类型值。
@param key 键名。
@return Object 类型值
*/
static getJSON(key: string): any;
/**
删除指定键名的信息。
@param key 键名。
*/
static removeItem(key: string): void;
/**
清除本地存储信息。
*/
static clear(): void;
}


---

## 第 80 页

/**
贴图源
纹理处理类
*
== 使用方式 ==
// 加载整张图片使用
AssetManager.loadImage("asset/image/xxx.png", Callback.New((tex: Texture) => {
var img = new UIBitmap();
img.texture = tex;
stage.addChild(img);
}, this));
*
// 加载作为贴图使用
AssetManager.loadImage("asset/image/animation/2.png", Callback.New((tex: Texture) => {
var g = new Graphics();
// 取样从图中的256,256中取得128x128尺寸的切图，并显示在50,50的地方
g.fillTexture(tex, 50, 50, 128, 128, "repeat", new Point(256, 256));
var sp = new Sprite();
sp.graphics = g;
stage.addChild(sp);
}, this));
*
Created by 黑暗之神KDS on 2017-01-01 16:04:32.
*/
declare class Texture extends EventDispatcher {
/**
默认 UV 信息
*/
static DEF_UV: Array;
/**
颠倒的 UV 信息
*/
static INV_UV: Array;
/**
图片地址
*/
url: string;
/**
表示资源是否已释放
*/
get disposed(): boolean;
/**


---

## 第 81 页

销毁纹理
*/
dispose(): void;
/**
实际宽度。
*/
width: number;
/**
实际高度。
*/
height: number;
/**
获取Texture上的某个区域的像素点
@param x
@param y
@param width
@param height
@return  返回像素点集合
*/
getPixels(x: number, y: number, width: number, height: number): Array;
}
/**
浏览器状态
是浏览器代理类。封装浏览器及原生 js 提供的一些功能。
*
Created by 黑暗之神KDS on 2017-01-01 16:04:32.
*/
declare class Browser {
/**
浏览器信息
*/
static userAgent: string;
/**
是否在 ios 设备
*/
static onIOS: boolean;
/**
是否在移动设备
*/
static onMobile: boolean;
/**
是否在 iphone设备
*/
static onIPhone: boolean;
/**


---

## 第 82 页

是否在 ipad 设备
*/
static onIPad: boolean;
/**
是否在 andriod设备
*/
static onAndriod: boolean;
/**
是否在 andriod设备
*/
static onAndroid: boolean;
/**
是否在 Windows Phone 设备
*/
static onWP: boolean;
/**
是否在 QQ 浏览器
*/
static onQQBrowser: boolean;
/**
是否在移动端 QQ 或 QQ 浏览器
*/
static onMQQBrowser: boolean;
/**
是否在移动端 Safari
*/
static onSafari: boolean;
/**
是否在IE浏览器内
*/
static onIE: boolean;
/**
微信内
*/
static onWeiXin: boolean;
/**
是否在 PC 端
*/
static onPC: boolean;
/**
是否在 PC 端
*/
static onMac: boolean;
/**


---

## 第 83 页

表示是否是 HTTP 协议
*/
static httpProtocol: boolean;
/**
音频是否启用
*/
static webAudioEnabled: boolean;
/**
音频播放类别
*/
static soundType: string;
/**
是否开启触摸
*/
static enableTouch: boolean;
/**
获取浏览器当前时间戳，单位为毫秒。
*/
static now(): number;
/**
浏览器窗口可视宽度。
通过分析浏览器信息获得。浏览器多个属性值优先级为：window.innerWidth(包含滚动条宽
度) > document.body.clientWidth(不包含滚动条宽度)，如果前者为0或为空，则选择后者。
*/
static get clientWidth(): number;
/**
浏览器窗口可视高度。
通过分析浏览器信息获得。浏览器多个属性值优先级为：window.innerHeight(包含滚动条高
度) > document.body.clientHeight(不包含滚动条高度) > 
document.documentElement.clientHeight(不包含滚动条高度)，如果前者为0或为空，则选
择后者。
*/
static get clientHeight(): number;
/**
浏览器窗口物理宽度。考虑了设备像素比。
*/
static get width(): number;
/**
浏览器窗口物理高度。考虑了设备像素比。
*/
static get height(): number;
/**
设备像素比。
*/
static get pixelRatio(): number;
/**


---

## 第 84 页

画布容器，用来盛放画布的容器。方便对画布进行控制
*/
static container: any;
}
/**
数据字典
可用于非字符串作为键的键值对（类似对象的内存地址作为键）
普通的键值对都是字符串储存键，比如{a:123}，中的a是字符串"a"，而如果想要使用对象作为键的
话可使用此类
使用原生JS中的Map实现
*
Created by 黑暗之神KDS on 2017-01-01 16:04:32.
*/
declare class Dictionary {
/**
获取所有的子元素列表。
*/
get values(): Array;
/**
获取所有的子元素键名列表。
*/
get keys(): Array;
/**
给指定的键名设置值。
@param key 键名。
@param value 值。
*/
set(key: any, value: any): void;
/**
获取指定对象的键名索引。
@param key 键名对象。
@return 键名索引。
*/
indexOf(key: any): number;
/**
返回指定键名的值。
@param key 键名对象。
@return 指定键名的值。
*/
get(key: any): any;
/**
移除指定键名的值。
@param key 键名对象。


---

## 第 85 页

@return 是否成功移除。
*/
remove(key: any): boolean;
/**
清除此对象的键名列表和键值列表。
*/
clear(): void;
}
/**
缓动函数
定义了缓动函数，以便实现[Tween]中的缓动效果，使用Tween方式的相关代码可以参考Tween
== 相关代码 ==
// 获取线性过渡中在100~1000中的50%时的状态值
var totalTime = 1000;
var currentTime = 500; // 即进行到了50%的程度，同时该值也可以大于totalTime，即超过100%
var start = 100;
var end = 1000;
var v = Ease.linearNone(currentTime,start,end-start,totalTime);
alert(v); // 550，即（1000-100）*(500/1000) + 100 = 550
*
Created by 黑暗之神KDS on 2017-01-01 16:04:32.
*/
declare class Ease {
/**
定义无加速持续运动。
@param t 指定当前时间，介于 0 和持续时间之间（包括二者）。
@param b 指定动画属性的初始值。
@param c 指定动画属性的更改总计。
@param d 指定运动的持续时间。
@return 指定时间的插补属性的值。
*/
static linearNone(t: number, b: number, c: number, d: number): number;
/**
定义无加速持续运动。
@param t 指定当前时间，介于 0 和持续时间之间（包括二者）。
@param b 指定动画属性的初始值。
@param c 指定动画属性的更改总计。
@param d 指定运动的持续时间。
@return 指定时间的插补属性的值。
*/
static linearIn(t: number, b: number, c: number, d: number): number;
/**


---

## 第 86 页

定义无加速持续运动。
@param t 指定当前时间，介于 0 和持续时间之间（包括二者）。
@param b 指定动画属性的初始值。
@param c 指定动画属性的更改总计。
@param d 指定运动的持续时间。
@return 指定时间的插补属性的值。
*/
static linearInOut(t: number, b: number, c: number, d: number): number;
/**
定义无加速持续运动。
@param t 指定当前时间，介于 0 和持续时间之间（包括二者）。
@param b 指定动画属性的初始值。
@param c 指定动画属性的更改总计。
@param d 指定运动的持续时间。
@return 指定时间的插补属性的值。
*/
static linearOut(t: number, b: number, c: number, d: number): number;
/**
方法以零速率开始运动，然后在执行时加快运动速度。
它的运动是类似一个球落向地板又弹起后，几次逐渐减小的回弹运动。
@param t 指定当前时间，介于 0 和持续时间之间（包括二者）。
@param b 指定动画属性的初始值。
@param c 指定动画属性的更改总计。
@param d 指定运动的持续时间。
@return 指定时间的插补属性的值。
*/
static bounceIn(t: number, b: number, c: number, d: number): number;
/**
开始运动时速率为零，先对运动进行加速，再减速直到速率为零。
它的运动是类似一个球落向地板又弹起后，几次逐渐减小的回弹运动。
@param t 指定当前时间，介于 0 和持续时间之间（包括二者）。
@param b 指定动画属性的初始值。
@param c 指定动画属性的更改总计。
@param d 指定运动的持续时间。
@return 指定时间的插补属性的值。
*/
static bounceInOut(t: number, b: number, c: number, d: number): number;
/**
以较快速度开始运动，然后在执行时减慢运动速度，直至速率为零。
它的运动是类似一个球落向地板又弹起后，几次逐渐减小的回弹运动。
@param t 指定当前时间，介于 0 和持续时间之间（包括二者）。


---

## 第 87 页

@param b 指定动画属性的初始值。
@param c 指定动画属性的更改总计。
@param d 指定运动的持续时间。
@return 指定时间的插补属性的值。
*/
static bounceOut(t: number, b: number, c: number, d: number): number;
/**
开始时往后运动，然后反向朝目标移动。
@param t 指定当前时间，介于 0 和持续时间之间（包括二者）。
@param b 指定动画属性的初始值。
@param c 指定动画属性的更改总计。
@param d 指定运动的持续时间。
@param s 指定过冲量，此处数值越大，过冲越大。
@return 指定时间的插补属性的值。
*/
static backIn(t: number, b: number, c: number, d: number, s?: number): number;
/**
开始运动时是向后跟踪，再倒转方向并朝目标移动，稍微过冲目标，然后再次倒转方向，回来
朝目标移动。
@param t 指定当前时间，介于 0 和持续时间之间（包括二者）。
@param b 指定动画属性的初始值。
@param c 指定动画属性的更改总计。
@param d 指定运动的持续时间。
@param s 指定过冲量，此处数值越大，过冲越大。
@return 指定时间的插补属性的值。
*/
static backInOut(t: number, b: number, c: number, d: number, s?: number): number;
/**
开始运动时是朝目标移动，稍微过冲，再倒转方向回来朝着目标。
@param t 指定当前时间，介于 0 和持续时间之间（包括二者）。
@param b 指定动画属性的初始值。
@param c 指定动画属性的更改总计。
@param d 指定运动的持续时间。
@param s 指定过冲量，此处数值越大，过冲越大。
@return 指定时间的插补属性的值。
*/
static backOut(t: number, b: number, c: number, d: number, s?: number): number;
/**
方法以零速率开始运动，然后在执行时加快运动速度。
其中的运动由按照指数方式衰减的正弦波来定义。
@param t 指定当前时间，介于 0 和持续时间之间（包括二者）。


---

## 第 88 页

@param b 指定动画属性的初始值。
@param c 指定动画属性的更改总计。
@param d 指定运动的持续时间。
@param a 指定正弦波的幅度。
@param p 指定正弦波的周期。
@return 指定时间的插补属性的值。
*/
static elasticIn(t: number, b: number, c: number, d: number, a?: number, p?: number): 
number;
/**
开始运动时速率为零，先对运动进行加速，再减速直到速率为零。
其中的运动由按照指数方式衰减的正弦波来定义。
@param t 指定当前时间，介于 0 和持续时间之间（包括二者）。
@param b 指定动画属性的初始值。
@param c 指定动画属性的更改总计。
@param d 指定运动的持续时间。
@param a 指定正弦波的幅度。
@param p 指定正弦波的周期。
@return 指定时间的插补属性的值。
*/
static elasticInOut(t: number, b: number, c: number, d: number, a?: number, p?: 
number): number;
/**
以较快速度开始运动，然后在执行时减慢运动速度，直至速率为零。
其中的运动由按照指数方式衰减的正弦波来定义。
@param t 指定当前时间，介于 0 和持续时间之间（包括二者）。
@param b 指定动画属性的初始值。
@param c 指定动画属性的更改总计。
@param d 指定运动的持续时间。
@param a 指定正弦波的幅度。
@param p 指定正弦波的周期。
@return 指定时间的插补属性的值。
*/
static elasticOut(t: number, b: number, c: number, d: number, a?: number, p?: number): 
number;
/**
以零速率开始运动，然后在执行时加快运动速度。
@param t 指定当前时间，介于 0 和持续时间之间（包括二者）。
@param b 指定动画属性的初始值。
@param c 指定动画属性的更改总计。
@param d 指定运动的持续时间。


---

## 第 89 页

@return 指定时间的插补属性的值。
*/
static strongIn(t: number, b: number, c: number, d: number): number;
/**
开始运动时速率为零，先对运动进行加速，再减速直到速率为零。
@param t 指定当前时间，介于 0 和持续时间之间（包括二者）。
@param b 指定动画属性的初始值。
@param c 指定动画属性的更改总计。
@param d 指定运动的持续时间。
@return 指定时间的插补属性的值。
*/
static strongInOut(t: number, b: number, c: number, d: number): number;
/**
以较快速度开始运动，然后在执行时减慢运动速度，直至速率为零。
@param t 指定当前时间，介于 0 和持续时间之间（包括二者）。
@param b 指定动画属性的初始值。
@param c 指定动画属性的更改总计。
@param d 指定运动的持续时间。
@return 指定时间的插补属性的值。
*/
static strongOut(t: number, b: number, c: number, d: number): number;
/**
开始运动时速率为零，先对运动进行加速，再减速直到速率为零。
Sine 缓动方程中的运动加速度小于 Quad 方程中的运动加速度。
@param t 指定当前时间，介于 0 和持续时间之间（包括二者）。
@param b 指定动画属性的初始值。
@param c 指定动画属性的更改总计。
@param d 指定运动的持续时间。
@return 指定时间的插补属性的值。
*/
static sineInOut(t: number, b: number, c: number, d: number): number;
/**
以零速率开始运动，然后在执行时加快运动速度。
Sine 缓动方程中的运动加速度小于 Quad 方程中的运动加速度。
@param t 指定当前时间，介于 0 和持续时间之间（包括二者）。
@param b 指定动画属性的初始值。
@param c 指定动画属性的更改总计。
@param d 指定运动的持续时间。
@return 指定时间的插补属性的值。
*/
static sineIn(t: number, b: number, c: number, d: number): number;
/**


---

## 第 90 页

以较快速度开始运动，然后在执行时减慢运动速度，直至速率为零。
Sine 缓动方程中的运动加速度小于 Quad 方程中的运动加速度。
@param t 指定当前时间，介于 0 和持续时间之间（包括二者）。
@param b 指定动画属性的初始值。
@param c 指定动画属性的更改总计。
@param d 指定运动的持续时间。
@return 指定时间的插补属性的值。
*/
static sineOut(t: number, b: number, c: number, d: number): number;
/**
以零速率开始运动，然后在执行时加快运动速度。
Quint 缓动方程的运动加速大于 Quart 缓动方程。
@param t 指定当前时间，介于 0 和持续时间之间（包括二者）。
@param b 指定动画属性的初始值。
@param c 指定动画属性的更改总计。
@param d 指定运动的持续时间。
@return 指定时间的插补属性的值。
*/
static quintIn(t: number, b: number, c: number, d: number): number;
/**
开始运动时速率为零，先对运动进行加速，再减速直到速率为零。
Quint 缓动方程的运动加速大于 Quart 缓动方程。
@param t 指定当前时间，介于 0 和持续时间之间（包括二者）。
@param b 指定动画属性的初始值。
@param c 指定动画属性的更改总计。
@param d 指定运动的持续时间。
@return 指定时间的插补属性的值。
*/
static quintInOut(t: number, b: number, c: number, d: number): number;
/**
以较快速度开始运动，然后在执行时减慢运动速度，直至速率为零。
Quint 缓动方程的运动加速大于 Quart 缓动方程。
@param t 指定当前时间，介于 0 和持续时间之间（包括二者）。
@param b 指定动画属性的初始值。
@param c 指定动画属性的更改总计。
@param d 指定运动的持续时间。
@return 指定时间的插补属性的值。
*/
static quintOut(t: number, b: number, c: number, d: number): number;
/**
方法以零速率开始运动，然后在执行时加快运动速度。


---

## 第 91 页

Quart 缓动方程的运动加速大于 Cubic 缓动方程。
@param t 指定当前时间，介于 0 和持续时间之间（包括二者）。
@param b 指定动画属性的初始值。
@param c 指定动画属性的更改总计。
@param d 指定运动的持续时间。
@return 指定时间的插补属性的值。
*/
static quartIn(t: number, b: number, c: number, d: number): number;
/**
开始运动时速率为零，先对运动进行加速，再减速直到速率为零。
Quart 缓动方程的运动加速大于 Cubic 缓动方程。
@param t 指定当前时间，介于 0 和持续时间之间（包括二者）。
@param b 指定动画属性的初始值。
@param c 指定动画属性的更改总计。
@param d 指定运动的持续时间。
@return 指定时间的插补属性的值。
*/
static quartInOut(t: number, b: number, c: number, d: number): number;
/**
以较快速度开始运动，然后在执行时减慢运动速度，直至速率为零。
Quart 缓动方程的运动加速大于 Cubic 缓动方程。
@param t 指定当前时间，介于 0 和持续时间之间（包括二者）。
@param b 指定动画属性的初始值。
@param c 指定动画属性的更改总计。
@param d 指定运动的持续时间。
@return 指定时间的插补属性的值。
*/
static quartOut(t: number, b: number, c: number, d: number): number;
/**
方法以零速率开始运动，然后在执行时加快运动速度。
Cubic 缓动方程的运动加速大于 Quad 缓动方程。
@param t 指定当前时间，介于 0 和持续时间之间（包括二者）。
@param b 指定动画属性的初始值。
@param c 指定动画属性的更改总计。
@param d 指定运动的持续时间。
@return 指定时间的插补属性的值。
*/
static cubicIn(t: number, b: number, c: number, d: number): number;
/**
开始运动时速率为零，先对运动进行加速，再减速直到速率为零。
Cubic 缓动方程的运动加速大于 Quad 缓动方程。


---

## 第 92 页

@param t 指定当前时间，介于 0 和持续时间之间（包括二者）。
@param b 指定动画属性的初始值。
@param c 指定动画属性的更改总计。
@param d 指定运动的持续时间。
@return 指定时间的插补属性的值。
*/
static cubicInOut(t: number, b: number, c: number, d: number): number;
/**
以较快速度开始运动，然后在执行时减慢运动速度，直至速率为零。
Cubic 缓动方程的运动加速大于 Quad 缓动方程。
@param t 指定当前时间，介于 0 和持续时间之间（包括二者）。
@param b 指定动画属性的初始值。
@param c 指定动画属性的更改总计。
@param d 指定运动的持续时间。
@return 指定时间的插补属性的值。
*/
static cubicOut(t: number, b: number, c: number, d: number): number;
/**
方法以零速率开始运动，然后在执行时加快运动速度。
Quad 缓动方程中的运动加速度等于 100% 缓动的时间轴补间的运动加速度，并且显著小于 
Cubic 缓动方程中的运动加速度。
@param t 指定当前时间，介于 0 和持续时间之间（包括二者）。
@param b 指定动画属性的初始值。
@param c 指定动画属性的更改总计。
@param d 指定运动的持续时间。
@return 指定时间的插补属性的值。
*/
static quadIn(t: number, b: number, c: number, d: number): number;
/**
开始运动时速率为零，先对运动进行加速，再减速直到速率为零。
Quad 缓动方程中的运动加速度等于 100% 缓动的时间轴补间的运动加速度，并且显著小于 
Cubic 缓动方程中的运动加速度。
@param t 指定当前时间，介于 0 和持续时间之间（包括二者）。
@param b 指定动画属性的初始值。
@param c 指定动画属性的更改总计。
@param d 指定运动的持续时间。
@return 指定时间的插补属性的值。
*/
static quadInOut(t: number, b: number, c: number, d: number): number;
/**
以较快速度开始运动，然后在执行时减慢运动速度，直至速率为零。


---

## 第 93 页

Quad 缓动方程中的运动加速度等于 100% 缓动的时间轴补间的运动加速度，并且显著小于 
Cubic 缓动方程中的运动加速度。
@param t 指定当前时间，介于 0 和持续时间之间（包括二者）。
@param b 指定动画属性的初始值。
@param c 指定动画属性的更改总计。
@param d 指定运动的持续时间。
@return 指定时间的插补属性的值。
*/
static quadOut(t: number, b: number, c: number, d: number): number;
/**
方法以零速率开始运动，然后在执行时加快运动速度。
其中每个时间间隔是剩余距离减去一个固定比例部分。
@param t 指定当前时间，介于 0 和持续时间之间（包括二者）。
@param b 指定动画属性的初始值。
@param c 指定动画属性的更改总计。
@param d 指定运动的持续时间。
@return 指定时间的插补属性的值。
*/
static expoIn(t: number, b: number, c: number, d: number): number;
/**
开始运动时速率为零，先对运动进行加速，再减速直到速率为零。
其中每个时间间隔是剩余距离减去一个固定比例部分。
@param t 指定当前时间，介于 0 和持续时间之间（包括二者）。
@param b 指定动画属性的初始值。
@param c 指定动画属性的更改总计。
@param d 指定运动的持续时间。
@return 指定时间的插补属性的值。
*/
static expoInOut(t: number, b: number, c: number, d: number): number;
/**
以较快速度开始运动，然后在执行时减慢运动速度，直至速率为零。
其中每个时间间隔是剩余距离减去一个固定比例部分。
@param t 指定当前时间，介于 0 和持续时间之间（包括二者）。
@param b 指定动画属性的初始值。
@param c 指定动画属性的更改总计。
@param d 指定运动的持续时间。
@return 指定时间的插补属性的值。
*/
static expoOut(t: number, b: number, c: number, d: number): number;
/**
方法以零速率开始运动，然后在执行时加快运动速度。


---

## 第 94 页

缓动方程的运动加速会产生突然的速率变化。
@param t 指定当前时间，介于 0 和持续时间之间（包括二者）。
@param b 指定动画属性的初始值。
@param c 指定动画属性的更改总计。
@param d 指定运动的持续时间。
@return 指定时间的插补属性的值。
*/
static circIn(t: number, b: number, c: number, d: number): number;
/**
开始运动时速率为零，先对运动进行加速，再减速直到速率为零。
缓动方程的运动加速会产生突然的速率变化。
@param t 指定当前时间，介于 0 和持续时间之间（包括二者）。
@param b 指定动画属性的初始值。
@param c 指定动画属性的更改总计。
@param d 指定运动的持续时间。
@return 指定时间的插补属性的值。
*/
static circInOut(t: number, b: number, c: number, d: number): number;
/**
以较快速度开始运动，然后在执行时减慢运动速度，直至速率为零。
缓动方程的运动加速会产生突然的速率变化。
@param t 指定当前时间，介于 0 和持续时间之间（包括二者）。
@param b 指定动画属性的初始值。
@param c 指定动画属性的更改总计。
@param d 指定运动的持续时间。
@return 指定时间的插补属性的值。
*/
static circOut(t: number, b: number, c: number, d: number): number;
}
/**
缓动类
使用此类能够实现对目标对象属性的渐变。一般配合[Ease]使用
*
Created by 黑暗之神KDS on 2017-01-01 16:04:32.
*/
declare class Tween {
/**
更新回调，缓动数值发生变化时，回调变化的值
*/
update: Callback;
/**
缓动对象的props属性到目标值。


---

## 第 95 页

@param target 目标对象(即将更改属性值的对象)。
@param props 变化的属性列表，比如
@param duration 花费的时间，单位毫秒。
@param ease 缓动类型，默认为匀速运动。默认值=null
@param complete 结束回调函数。默认值=null
@param delay 延迟执行时间。默认值=0
@param coverBefore 是否覆盖之前的缓动。默认值=false
@return 返回Tween对象。
*/
static to(target: any, props: any, duration: number, ease?: Function, complete?: Callback, 
delay?: number, coverBefore?: boolean): Tween;
/**
从props属性，缓动到当前状态。
@param target 目标对象(即将更改属性值的对象)。
@param props 变化的属性列表，比如
@param duration 花费的时间，单位毫秒。
@param ease 缓动类型，默认为匀速运动。默认值=null
@param complete 结束回调函数。默认值=null
@param delay 延迟执行时间。默认值=0
@param coverBefore 是否覆盖之前的缓动。默认值=false
@return 返回Tween对象。
*/
static from(target: any, props: any, duration: number, ease?: Function, complete?: 
Callback, delay?: number, coverBefore?: boolean): Tween;
/**
缓动对象的props属性到目标值。
@param target 目标对象(即将更改属性值的对象)。
@param props 变化的属性列表，比如
@param duration 花费的时间，单位毫秒。
@param ease 缓动类型，默认为匀速运动。默认值=null
@param complete 结束回调函数。默认值=null
@param delay 延迟执行时间。默认值=0
@param coverBefore 是否覆盖之前的缓动。默认值=false
@return 返回Tween对象。
*/
to(target: any, props: any, duration: number, ease?: Function, complete?: Callback, 
delay?: number, coverBefore?: boolean): Tween;
/**
从props属性，缓动到当前状态。
@param target 目标对象(即将更改属性值的对象)。
@param props 变化的属性列表，比如


---

## 第 96 页

@param duration 花费的时间，单位毫秒。
@param ease 缓动类型，默认为匀速运动。默认值=null
@param complete 结束回调函数。默认值=null
@param delay 延迟执行时间。默认值=0
@param coverBefore 是否覆盖之前的缓动。默认值=0
@return 返回Tween对象。
*/
from(target: any, props: any, duration: number, ease?: Function, complete?: Callback, 
delay?: number, coverBefore?: boolean): Tween;
/**
设置当前执行比例
*/
progress: number;
/**
立即结束缓动并到终点。
*/
complete(): void;
/**
暂停缓动，可以通过resume或restart重新开始。
*/
pause(): void;
/**
设置开始时间。
@param startTime 开始时间。
*/
setStartTime(startTime: number): void;
/**
清理指定目标对象上的所有缓动。
@param target 目标对象。
*/
static clearAll(target: any): void;
/**
清理某个缓动。
@param tween 缓动对象。
*/
static clear(tween: Tween): void;
/**
停止并清理当前缓动。
*/
clear(): void;
/**
重新开始暂停的缓动。
*/
restart(): void;
/**


---

## 第 97 页

恢复暂停的缓动。
*/
resume(): void;
}
/**
场景-基类
场景上支持摆放场景对象([SceneObject])以及图层([ClientSceneLayer]，仅客户端有图层概念)
所有场景的基类都是该类，拥有该类的基本特性
支持绑定类：不同的场景可以绑定不同的类，以便实现不同的特性，比如A场景是平面RPG场景，B
场景是带有物理系统的横版跳跃场景
支持自定义触发类型：比如进入场景的事件、离开场景的事件等等
*
Created by 黑暗之神KDS on 2018-05-21 01:49:13.
*/
declare class Scene {
/**
唯一编号
*/
id: number;
/**
地图宽度（单位：像素）
*/
width: number;
/**
地图高度（单位：像素）
*/
height: number;
/**
地图名称
*/
name: string;
/**
预载入场景时是否加载地图资源：图层涉及到的贴图资源，如果未预加载则会在显示时动态加
载
在项目层调用AssetManager.preLoadSceneAsset时根据此配置自动加载地图图层资源
*/
preloadMapAsset: boolean;
/**
预载入场景时是否加载全部场景对象资源：行走图、对象身上可能挂载的界面和动画
在项目层调用AssetManager.preLoadSceneAsset时根据此配置自动加载场景中预设的场景对
象资源
*/
preloadSceneObjectAsset: boolean;
/**
预载入场景时是否加载场景的全部触发事件


---

## 第 98 页

在项目层调用AssetManager.preLoadSceneAsset时根据此配置自动加载场景中预设的场景对
象资源
*
当加载场景时会根据事件页中的以下系统事件进行预加载资源
-- 对话和选项事件：带有的对话框样式和头像资源
-- 设置对象行为事件：行走图资源
-- 自定义事件：需要项目层自行追加相关逻辑，比如可以重写
AssetManager.preLoadCommandPage以便追加需要预载入的内容
*/
preloadSceneCommandAsset: boolean;
/**
数据层数据 [自定义层的索引][格子x轴][格子y轴]
支持自定义添加或移除数据层，相关逻辑实现在项目层
比如可以制作RPG中的障碍层、遮罩层或毒气范围等
*/
dataLayers: number[][][];
/**
图层数据，存放着编辑器中预设的图层数据，在创建场景时会根据此项生成图层显示对象
*/
LayerDatas: SceneLayerData[];
/**
BGM-背景音乐 当进入场景时播放的背景音乐（由项目层实现）
相对地址，如 asset/audio/bgm/abc.mp3
*/
bgm: string;
/**
BGM-背景音乐音量 0~1
*/
bgmVolume: number;
/**
BGM-背景音乐音调 0~2 默认1表示正常的音效
*/
bgmPitch: number;
/**
BGS-环境音效 当进入场景时播放的环境音效（由项目层实现）
相对地址，如 asset/audio/bgs/abc.mp3
*/
bgs: string;
/**
BGS音量 0~1
*/
bgsVolume: number;
/**


---

## 第 99 页

BGS-音调  0~2 默认1表示正常的音效
*/
bgsPitch: number;
/**
场景对象记录列表 [场景对象.index] -> [场景对象]
场景上的全场景对象均存放在该列表中统一管理，每个对象有唯一的index
场景编辑器中预设的对象编号(ID)即对应此处的index，而游戏中动态生成的对象或克隆的对象
会根据空位插入。
从场景上移除的克隆对象通常会在该列表中置空
*/
sceneObjects: SceneObject[];
/**
场景自定义触发类别 [事件触发类别索引] -> [事件页对象]
比如多数模板都会存在的进入场景事件是一种常用的自定义触发类别
*/
customCommandPages: CommandPage[];
/**
格子宽 根据游戏场景中根据预设的[网格像素大小]和实际场景宽度计算尺寸，单位格子像素尺
寸参考Config.SCENE_GRID_SIZE
*/
gridWidth: number;
/**
格子高 根据游戏场景中根据预设的[网格像素大小]和实际场景高度计算尺寸，单位格子像素尺
寸参考Config.SCENE_GRID_SIZE
*/
gridHeight: number;
/**
解析，系统在初始化场景时会调用此函数，项目层可以重载此函数以便实现需要的游戏逻辑
@param jsonObj 场景数据文件
@param gameData 游戏数据
*/
parse(jsonObj: any, gameData: GameData): void;
/**
获取数据格子状态
@param index 数据层索引
@param gridX 格子坐标x
@param gridY 格子坐标y
@return [number] 该格子的状态
*/
getDataGridState(index: number, gridX: number, gridY: number): number;
/**
设置数据格子状态
在游戏运行中可以动态更改格子的状态，更改后的状态不会被存档，只是一种临时状态，


---

## 第 100 页

如果需要储存格子状态需要项目层自行实现。（存档支持存入一些自定义的数据 参考：
SinglePlayerGame.d.ts）
项目层自行实现数据层的作用。
@param index 数据层索引
@param gridX 格子坐标x
@param gridY 格子坐标y
@param state 设置该格子的状态
*/
setDataGridState(index: number, gridX: number, gridY: number, state: number): void;
/**
获取以场景格子计算的实际的宽高（按格子计算的标准化宽高）
@param scene 场景对象
@return width=宽度（像素尺寸） height=高度（像素尺寸）
*/
static getRealWidth(scene: Scene): { width: number; height: number; };
}
/**
场景图层数据
来自编辑器中预设好的场景中的图层数据
Created by 黑暗之神KDS on 2018-11-06 01:08:56.
*/
declare class SceneLayerData {
/**
名称
*/
name: string;
/**
表示对象层标志
*/
p: boolean;
/**
偏移x 默认值=0
*/
dx: number;
/**
偏移y 默认值=0
*/
dy: number;
/**
缩放x 默认值=1
*/
scaleX: number;
/**


---

## 第 101 页

缩放y 默认值=1
*/
scaleY: number;
/**
斜率x 默认值=0
*/
skewX: number;
/**
斜率y 默认值=0
*/
skewY: number;
/**
x方向自动滚动速度 默认值=0
*/
xMove: number;
/**
y方向自动滚动速度 默认值=0
*/
yMove: number;
/**
远景比例X轴 默认值=1.0 表示 100% 普通地图是100%，值越小则移动越慢，多重远景一般通
过更改此属性来制作
*/
prospectsPerX: number;
/**
远景比例Y轴 默认值=1.0 表示 100% 普通地图是100%，值越小则移动越慢，多重远景一般通
过更改此属性来制作
*/
prospectsPerY: number;
/**
x方向循环 默认值=false
*/
xLoop: boolean;
/**
y方向循环 默认值=false
*/
yLoop: boolean;
/**
透明度 默认值=1
*/
opacity: number;
/**
混合模式 null/lighter/blend1-1 （取值范围0~14）
*/
blendMode: string;
/**


---

## 第 102 页

绘制模式 true=图块层 false=图片层
*/
drawMode: boolean;
/**
图块数据 texID负数表示自动元件 默认值=[]
*/
tileData: { texID: number; x: number; y: number; }[][];
/**
全景图地址
*/
img: string;
/**
全图块数据引用到的图块id集 id负数表示自动元件
*/
tileTexIDs: { [id: string]: boolean; };
}
/**
场景对象：基类
场景对象通常只出现在场景上，所有场景对象均继承此类
对象原型来源于指定的对象模型类别，可以在编辑器中预设好模型类别以便不同种类拥有不同的特
性（如人物类、装饰物等等）
关于对象模型预设：
-- 支持自定义属性
-- 支持装载自定义显示对象（行走图、动画、界面）
-- 支持绑定脚本（用于实现不通过的特性，可以结合自定义属性和显示对象来制作）
关于存档自动记录：
-- 玩家的场景对象的基础属性和自定义属性会在存档时自动记录
-- 当前场景下的其他场景对象的基础属性和自定义属性会在存档时自动记录
 
Created by 黑暗之神KDS on 2018-05-21 02:34:05.
*/
declare class SceneObject {
//------------------------------------------------------------------------------------------------------
// 基本属性
//------------------------------------------------------------------------------------------------------
/**
对应的场景对象模型ID 
默认值=1
*/
modelID: number;
/**


---

## 第 103 页

当前的模块ID集合
*/
get moduleIDs(): number[];
/**
所在场景的sceneObject列表的位置，也可以看作唯一ID，编辑器中场景对象ID即该属性 默认
值=0
*/
index: number;
/**
名称 默认值=""
*/
name: string;
/**
坐标x（单位：像素）默认值=0
*/
x: number;
/**
坐标y（单位：像素）默认值=0
*/
y: number;
/**
显示层 0-最底层 1-中间层 2-最高层 对象所在场景的层次可参考[ClientScene] 默认值=1
*/
layerLevel: number;
//------------------------------------------------------------------------------------------------------
// 行走图
//------------------------------------------------------------------------------------------------------
/**
行走图自动播放动作 默认值=true
*/
autoPlayEnable: boolean;
/**
行走图ID 默认值=1
*/
avatarID: number;
/**
角色的面向预设值 默认值=2
参考小键盘以5为中心面向其他数字的方向系统，比如2表示面向下（即5面向2的方向是向
下）
7  8  9
4  5  6
1  2  3
*/
avatarOri: number;
/**


---

## 第 104 页

角色的动作:ID预设值 默认值=1
*/
avatarAct: number;
/**
动作播放频率预设值 默认值=12
*/
avatarFPS: number;
/**
初始预设帧 默认值=0
*/
avatarFrame: number;
/**
透明度预设值 默认值=1
*/
avatarAlpha: number;
/**
色相预设值 默认值=0
*/
avatarHue: number;
/**
行走图体型预设值 默认值=1
*/
scale: number;
//------------------------------------------------------------------------------------------------------
// 显示对象
//------------------------------------------------------------------------------------------------------
/**
显示对象列表数据 type 1-指定行走图类 2-指定固定的界面 3-指定界面类 4-指定固定的动画 5-
指定动画类
由编辑器中的场景对象模型预设中预先设定的显示对象列表。默认值={}
*/
displayList: { [varName: string]: { type: number, id: number } };
/**
当前所有模块的显示列表数据 默认值=[]
*/
moduleDisplayList: { [varName: string]: { type: number, id: number } }[];
//------------------------------------------------------------------------------------------------------
// 其他
//------------------------------------------------------------------------------------------------------
/**
拥有控制权的玩家（所属玩家），非玩家的对象该值为0 主要用于判断用 默认值=0
*/
playerUID: number;
/**


---

## 第 105 页

所属玩家，非玩家的对象该值为null 主要用于判断用和引用
*/
player: Player;
/**
是否拥有事件 [indexType] = 是否拥有事件 默认值=[]
场景对象支持自定义的触发事件类别，此处是否拥有事件是按照自定义触发事件类别的顺序排
列的。
比如RPG游戏中场景对象可能存在：点击事件、碰触事件、并行事件等，项目层可以根据此属
性判定来执行事件
*/
hasCommand: boolean[];
//------------------------------------------------------------------------------------------------------
//  静态函数
//------------------------------------------------------------------------------------------------------
/**
创建场景对象模块（按照模块的默认值）
@param moduleID 场景对象的模块ID
@param soe 需要安装到的场景对象实体
@param presetData [可选] 默认值=null 预设的值数据，如 { abc: 5, def:6 }
@return [SceneObjectModule] 模块 
*/
static createModule(moduleID: number, soe: SceneObjectEntity, presetData?: any): 
SceneObjectModule;
}
/**
对象行为处理器-基类
实现了对象行为的框架，具体行为应配合自定义行为编辑器和子类实现实际作用效果，必须设置
implClass以便行为编辑器支持
对象的行为层概念：每添加一组行为即作为新的一层，只有该层执行完毕才会回到上一层继续执行
行为（循环的行为无法回到上一层）
需要主动调用update才会执行行为，利用此特性可以制作比如进入战斗后不执行默认的行为，离开
战斗后继续执行行为的逻辑
关于自定义行为的制作：
1.可视化制作行为界面：GC编辑器-菜单-自定义编辑器-自定义行为
2.项目层继承此类实现具体行为：比如6号自定义行为，拥有两个参数
private behavior6(a:number,b:number):void{
// 行为实现
}
 *
Created by 黑暗之神KDS on 2020-02-20 05:34:43.
*/
declare class SceneObjectBehaviors {
/**


---

## 第 106 页

当前行为层索引变更时派发 EventUtils.happen(this, 
SceneObjectBehaviors.EVENT_INDEX_CHANGE, [v]);
比如该对象当前的行为组有5个行为，执行完第2个行为后开始执行第3个行为前派发此事件
// behavior是SceneObjectBehaviors子类实例
// newIndex是新的索引
EventUtils.addEventListenerFunction(behavior,SceneObjectBehaviors.EVENT_IND
EX_CHANGE,(newIndex:number)=>{
// 逻辑
},this);
*/
static EVENT_INDEX_CHANGE: string;
/**
实现类，即子类，目前用于行为编辑器能够正确的找到实现类以便实时预览项目层编写的自定
义行为
*/
static implClass: typeof SceneObjectBehaviors;
/**
执行行为者（可能是执行事件者或触发事件者或者其他指定的对象）
*/
so: SceneObjectEntity;
/**
触发事件者
*/
targetSceneObject: SceneObjectEntity;
/**
执行事件者（派发行为者）
*/
executor: SceneObjectEntity;
/**
行为 对应的方法 对应的参数 默认值=[]
*/
protected behaviors: [Function, any[]][];
/**
行为数据：记录原始行为数据，如[[行为1-ID,参数1,参数2],[行为2-ID,参数1,参数2],....]
*/
protected behaviorData: any;
/**
当前行为的索引，更改时会派发事件 SceneObjectBehaviors.EVENT_INDEX_CHANGE
*/
index: number;
/**


---

## 第 107 页

是否循环
*/
loop: boolean;
/**
[编辑器预览用]是否忽略过程（表示直接跳转到最终结果而不播放过程）
比如行为是从A点移动到B点，而由于行为编辑器中编辑模式下忽略过程直接显示结果的，
所以行为的实现中可以根据ignoreProcess来实现，即：
当ignoreProcess=true时，由A点平滑移动到B点，有播放效果。
当ignoreProcess=false时，直接出现在B点，忽略过程。
*/
ignoreProcess: boolean;
/**
逻辑用的暂停标识，比如行为在运动结束前不在执行下一步动作（如配合Game.pause的效
果）
实现类可以根据具体的游戏规则重写该属性，以便能够正确的暂停下一步行为执行
如RPG中处于移动中的对象只有等待执行完毕后再继续执行：
// 重载为get方法
protected get logicPause(): boolean {
return this.so.isMoving ? true : false;
}
*/
protected logicPause: boolean;
/**
数据转换：将字符串格式的数据转为可使用格式，通常自定义属性中的行为数据需要使用该方
法转换后使用
@return targetSceneObjectIndex 0-对象 -2玩家 -1当前对象 0-N 指定对象编号
behaviorData 行为数据
loop 是否循环
cover 是否覆盖行为
forceStopLastBehavior 是否强行停止正在执行的行为
 */
static toBehaviorData(behaviorStr: string): {
targetSceneObjectIndex: number;
behaviorData: any[];
loop: boolean;
cover: boolean;
forceStopLastBehavior: boolean;
};
/**
构造函数
@param so 执行行为的场景对象


---

## 第 108 页

@param loop 是否循环
@param targetSceneObject 事件触发者
@param onOver 当行为执行完毕时回调 onOver(soBehavior:SceneObjectBehaviors)
@param startIndex [可选] 默认值=0 起始行为索引行
@param executor [可选] 默认值=null 事件执行者（也是行为派发者）
*/
constructor(so: SceneObjectEntity, loop: boolean, targetSceneObject: SceneObject, 
onOver: Callback, startIndex?: number, executor?: SceneObjectEntity);
/**
释放函数，当不再使用时调用此函数以便销毁
*/
dispose(): void;
/**
设置行为数据并且解析，会将以前的行为全部清空
比如添加3号行为
@param behaviorData 行为数据 [[行为1-ID,参数1,参数2],[行为2-ID,参数1,参数2],....]
@param delayFrame [可选] 默认值=0 行为内部的需要等待的帧数
*/
setBehaviors(behaviorData: any[], delayFrame?: number): void;
/**
[编辑器预览用]重置：还原到最初始的状态
仅在行为编辑器预览使用，项目层需要实现行为的重置，以便预览时能够正确显示效果
@param defSceneObejct 默认的场景对象
*/
reset(defSceneObejct: SceneObject): void;
/**
等待指定帧数后继续执行
如果已处于等待帧的情况下时：当调用update行为的时候会推进一帧
@param frame 等待的帧数
*/
waitFrame(frame: number): void;
/**
更新行为，需要主动调用该函数才会执行行为，一般情况下每帧调用此函数以便更新对象的行
为
利用此特性可以制作一些效果，比如：
-- 进入战斗后不执行默认的行为，离开战斗后继续执行行为的逻辑
-- 全局暂停时不执行该函数以便停止推进行为
@return [boolean] 是否播放结束
*/
update(): boolean;
}
/**
场景对象实体类


---

## 第 109 页

所有实际的场景对象实体都继承此类
拥有特性：
-- 对象开关（存档时系统会自动记录所有场景的对象开关，同时可以影响到出现条件）
-- 添加对象行为（详情参考:[SceneObjectBehaviors]）
-- 携带自定义事件：如RPG模板中可能拥有点击事件、碰触事件多种触发事件
-- 状态页：根据满足出现条件决定出现的哪一页状态
-- 场景对象模块：可安装多个模块，安装后拥有模块的特性
Created by 黑暗之神KDS on 2020-02-22 03:47:27.
*/
declare class SceneObjectEntity extends SceneObject {
/**
事件：当切换状态页前，首次创建时不派发该事件。派发对象 SceneObjectEntity 一般用于全
局监听所有场景对象的切换状态页事件
目前仅在服务端使用
// 监听状态页更改时
EventUtils.addEventListenerFunction(SceneObjectEntity, 
SceneObjectEntity.EVENT_BEFORE_CHANGE_STATUS_PAGE, (soe: SceneObjectEntity) 
=> {
// to do
}, this);
*/
static EVENT_BEFORE_CHANGE_STATUS_PAGE: string;
/**
事件：当切换状态页前，首次创建时不派发该事件。派发对象 [Object SceneObjectEntity] 一
般用于对某个对象监听切换状态页事件
目前仅在服务端使用
// 监听状态页更改时
EventUtils.addEventListenerFunction(soe, 
SceneObjectEntity.EVENT_BEFORE_CHANGE_STATUS_PAGE_FOR_INSTANCE, (soe: 
SceneObjectEntity) => {
// to do
}, this);
*/
static EVENT_BEFORE_CHANGE_STATUS_PAGE_FOR_INSTANCE: string;
/**
事件：当切换状态页后，首次创建时不派发该事件。派发对象 SceneObjectEntity 一般用于全
局监听所有场景对象的切换状态页事件


---

## 第 110 页

// 监听玩家的状态页更改时
EventUtils.addEventListenerFunction(SceneObjectEntity, 
SceneObjectEntity.EVENT_CHANGE_STATUS_PAGE, (soe: SceneObjectEntity) => {
// to do
}, this);
*/
static EVENT_CHANGE_STATUS_PAGE: string;
/**
事件：当切换状态页后，首次创建时不派发该事件。派发对象 [Object SceneObjectEntity] 一
般用于对某个对象监听切换状态页事件
// 监听玩家的状态页更改时
EventUtils.addEventListenerFunction(soe, 
SceneObjectEntity.EVENT_CHANGE_STATUS_PAGE_FOR_INSTANCE, (soe: 
SceneObjectEntity) => {
// to do
}, this);
*/
static EVENT_CHANGE_STATUS_PAGE_FOR_INSTANCE: string;
/**
事件：当附加模块时 派发对象=SceneObjectEntity
// 监听玩家添加模块时事件
EventUtils.addEventListenerFunction(SceneObjectEntity, 
SceneObjectEntity.EVENT_ON_ADD_MODULE, 
(soe:SceneObjectEntity,soModule:SceneObjectModule) => {
// to do
}, this);
*/
static EVENT_ON_ADD_MODULE: string;
/**
事件：当移除模块时 派发对象=SceneObjectEntity 
onRemoveModule(soe:SceneObjectEntity,soModule:SceneObjectModule)
// 监听玩家移除模块时事件
EventUtils.addEventListenerFunction(SceneObjectEntity, 
SceneObjectEntity.EVENT_ON_REMOVE_MODULE, 
(soe:SceneObjectEntity,soModule:SceneObjectModule) => {


---

## 第 111 页

// to do
}, this);
*/
static EVENT_ON_REMOVE_MODULE: string;
/**
是否已释放
*/
isDisposed: boolean;
/**
是否副本
*/
get isCopy(): boolean;
/**
克隆的来源 sceneID=源场景编号 sceneObjectIndex=源对象编号
*/
get copyFrom(): { sceneID: number, sceneObjectIndex: number };
/**
是否在场景上 默认值=false
*/
inScene: boolean;
/**
当前对应的状态页面索引 0~N
*/
currentStatusPageIndex: number;
//------------------------------------------------------------------------------------------------------
// 对象独有开关
//------------------------------------------------------------------------------------------------------
/**
获取对象的开关
@param varID 对象开关编号 0-N
@return [number] 
*/
getSwitch(varID: number): number;
/**
设置对象的开关：存档时系统会自动记录全场景中所有对象的对象开关数据，同时可以影响到
出现条件。
@param varID 对象开关编号 0-N
@param value 开关值 0/1
*/
setSwitch(varID: number, value: number): void;
/**


---

## 第 112 页

安装开关，一般用于读取数据后一次写入
*/
installSwitchs(switchs: number[]): void;
//------------------------------------------------------------------------------------------------------
// 自定义属性
//------------------------------------------------------------------------------------------------------
/**
获取自定义属性名称集
@return [string] 
*/
getCustomAttrs(): string[];
//------------------------------------------------------------------------------------------------------
// 对象的行为
//------------------------------------------------------------------------------------------------------
/**
行为集，由多个行为组合而成
*/
protected behaviors: SceneObjectBehaviors[];
/**
添加一组行为 
@param behaviorData 行为数据 [[行为1-ID,参数1,参数2],[行为2-ID,参数1,参数2],....]
@param loop 是否循环
@param targetSceneObject 参考的目标对象
@param onOver 当行为结束时回调
@param cover 覆盖旧的行为
@param startIndex [可选] 默认值=0 该行为组的开始播放的行为索引，默认0，表示从最开头
开始播放
@param Immediate [可选] 默认值=true 是否立即刷新，否则会等待下一帧才刷新
@param forceStopLastBehavior [可选] 默认值=false 是否强制停止正在执行的行为，由项目
层实现，以便当前行为组能够立即执行
@param delayFrame [可选] 默认值=0 行为内部的需要等待的帧数
@param executor [可选] 默认值=null 执行事件者（也是行为派发者）
@return 对象行为处理器
*/
addBehavior(behaviorData: any[], loop: boolean, targetSceneObject: SceneObject, 
onOver: Callback, cover: boolean, startIndex?: number, Immediate?: boolean, 
forceStopLastBehavior?: boolean, delayFrame?: number, executor?: SceneObjectEntity): 
SceneObjectBehaviors;
/**
清理行为组，清理后对象不在拥有设定的任何行为
*/
clearBehaviors(): void;
//------------------------------------------------------------------------------------------------------
// 事件


---

## 第 113 页

//------------------------------------------------------------------------------------------------------
/**
事件触发线：全部触发器 { [triggerLineID: number]: CommandTrigger }
*/
triggerLines: any;
/**
事件触发线：单线唯一 { [triggerLineID: string]: CommandTrigger }
*/
triggerSingleLines: any;
/**
场景对象事件页 下标=indexType 0~n
*/
customCommandPages: CommandPage[];
/**
获取事件触发器:单线事件拿到的是唯一触发器，而多线事件则新生成触发器
同一个触发器表示一条线路执行，所以多线事件新生成触发器则代表一个事件页可以同时执行
多次
@param mainType 0-场景相关的事件类别 1-场景对象相关的事件类别 2-界面相关的事件类
别 3-事件库的事件类别 4-片段事件的事件类别 （对应
CommandTrigger.COMMAND_MAIN_TYPE_XXX）
@param indexType 对应的小类别 0-N 如：这是一个场景对象的自定义触发类型事件-“点击事
件”
@param scene 场景
@param executor 执行者：当前事件的执行者
@return 事件触发器
*/
getCommandTrigger(mainType: number, indexType: number, scene: Scene, executor: 
SceneObjectEntity): CommandTrigger;
//------------------------------------------------------------------------------------------------------
//  模块
//------------------------------------------------------------------------------------------------------
/**
添加模块
@param soModule 模块
@param sendEvent [可选] 默认值=true 是否添加成功
@return [boolean] 是否添加成功
*/
addModule(soModule: SceneObjectModule, sendEvent?: boolean): boolean;
/**
添加模块-到指定的位置上
@param soModule 模块
@param index 指定的位置
@param sendEvent [可选] 默认值=true 是否派发事件


---

## 第 114 页

@return [boolean] 是否添加成功 
*/
addModuleAt(soModule: SceneObjectModule, index: number, sendEvent?: boolean): 
boolean;
/**
添加模块-根据模块编号
-- 模块的属性为默认值
@param moduleID 模块编号
@param sendEvent [可选] 默认值=true 是否派发事件
@return [SceneObjectModule] 被添加的模块，如果不成功则返回null
*/
addModuleByID(moduleID: number, sendEvent?: boolean): SceneObjectModule;
/**
添加模块-到指定的位置上-根据模块的编号
@param moduleID 模块编号
@param index 指定的位置
@param sendEvent [可选] 默认值=true 是否派发事件
@return [SceneObjectModule] 被添加的模块，如果不成功则返回null
*/
addModuleByIDAt(moduleID: number, index: number, sendEvent?: boolean): 
SceneObjectModule;
/**
移除所有模块
@param isDispose [可选] 默认值=true 是否销毁模块
@param sendEvent [可选] 默认值=true 是否派发事件
*/
removeAllModules(isDispose?: boolean, sendEvent?: boolean): void;
/**
移除指定编号的模块
@param moduleID 模块的编号
@param isDispose [可选] 默认值=true 是否销毁模块
@param sendEvent [可选] 默认值=true 是否派发事件
@return [SceneObjectModule] 被移除的模块，如果不成功则返回null
*/
removeModuleByID(moduleID: number, isDispose?: boolean, sendEvent?: boolean): 
SceneObjectModule;
/**
移除模块-根据其拥有的模块
@param soModule 拥有的模块
@param isDispose [可选] 默认值=true 是否销毁模块
@param sendEvent [可选] 默认值=true 是否派发事件


---

## 第 115 页

@return [boolean] 是否移除成功
*/
removeModule(soModule: SceneObjectModule, isDispose?: boolean, sendEvent?: 
boolean): boolean;
/**
移除模块-根据指定的位置
@param index 指定的位置
@param isDispose [可选] 默认值=true 是否销毁
@param sendEvent [可选] 默认值=true 是否派发事件
@return [boolean] 是否移除成功
*/
removeModuleAt(index: number, isDispose?: boolean, sendEvent?: boolean): boolean;
/**
设置已拥有的模块到指定位置
@param soModule 拥有的模块
@param toIndex 设置到达指定的位置
@return [boolean] 是否成功
*/
setModuleIndex(soModule: SceneObjectModule, toIndex: number): boolean;
/**
设置已拥有的模块到指定位置-根据模块编号
@param moduleID 已拥有的模块的编号
@param toIndex 设置到达指定的位置
@return [boolean] 是否成功
*/
setModuleIndexByID(moduleID: number, toIndex: number): boolean;
/**
调整模块位置
@param fromIndex 模块的原始位置
@param toIndex 模块的新位置
@return [boolean] 是否成功
*/
setModuleIndexByIndex(fromIndex: number, toIndex: number): boolean;
/**
获取已拥有的模块-根据模块编号
@param moduleID 模块编号
@return [SceneObjectModule] 返回拥有的该模块，如果未拥有则返回null
*/
getModule(moduleID: number): SceneObjectModule;
/**
获取已拥有的模块-根据模块名称
@param moduleName 模块名称


---

## 第 116 页

@return [SceneObjectModule] 返回拥有的该模块，如果未拥有则返回null
*/
getModuleByName(moduleName: string): SceneObjectModule;
/**
获取已拥有的模块-根据模块位置
@param index 模块位置
@return [SceneObjectModule] 返回拥有的该模块，如果未拥有则返回null
*/
getModuleAt(index: number): SceneObjectModule;
/**
获取已拥有的模块的位置
@param soModule 模块
@return [number] 已拥有的该模块的位置，如果未拥有则返回-1
*/
getModuleIndex(soModule: SceneObjectModule): number;
/**
获取已拥有的模块位置-根据模块的编号
@param moduleID 模块编号
@return [number] 已拥有的该模块的位置，如果未拥有则返回-1
*/
getModuleIndexByID(moduleID: number): number;
/**
获取所有模块的数目
@return [number] 模块的数目
*/
get moduleLength(): number;
}
/**
获得场景坐标的自定义组件属性相关数据
--获得场景坐标
*/
declare class SelectedSenceData {
/**
是否变量 默认为false
*/
isVer: boolean;
/**
场景地图Id 默认为0
*/
id: number;
/**
场景坐标X 默认为0
*/
x: number;
/**


---

## 第 117 页

场景坐标Y 默认为0
*/
y: number;
/**
是否格子坐标 默认为true
*/
isCell: boolean;
/**
朝向 0-不变 1-下 2-左 3-上 4-右 5-左下 6-右下 7-左上 8-右上 9-随机 默认为0
*/
ori: number;
}
/**
单机游戏类
对于单机游戏追加的初始化、存档取档等功能
-- 全局信息在游戏启动时会自动读取：如二周目变量、存档数信息、自定义全局数据等
*
Created by 黑暗之神KDS on 2020-02-02 02:20:56.
*/
declare class SinglePlayerGame {
/**
事件：读档后恢复的事件触发线
可以在SinglePlayerGame.recoveryData调用前监听
EventUtils.addEventListenerFunction(SinglePlayerGame,SinglePlayerGame.EVENT
_RECOVER_TRIGGER,(trigger:CommandTrigger)=>{
// to do
},this);
*/
static EVENT_RECOVER_TRIGGER: string;
/**
事件：调用recoveryData前派发
EventUtils.addEventListenerFunction(SinglePlayerGame,SinglePlayerGame.EVENT
_ON_BEFORE_RECOVERY_DATA,()=>{
// to do
},this);
*/
static EVENT_ON_BEFORE_RECOVERY_DATA: string;
/**
事件：调用recoveryData后派发


---

## 第 118 页

EventUtils.addEventListenerFunction(SinglePlayerGame,SinglePlayerGame.EVENT
_ON_AFTER_RECOVERY_DATA,()=>{
// to do
},this);
*/
static EVENT_ON_AFTER_RECOVERY_DATA: string;
/**
同步储存模式：存档时保证当前帧打包好存档数据，以便保证不会出现异步储存时数据发生了
改变导致储存信息不太正确的问题（但也会更耗时）
默认值 = true
*/
static syncSaveMode: boolean;
/**
存档配置 系统根据该存档配置进行储存一些基础的信息
event: boolean; // 事件：存档时记录当前正在执行的事件，在读档时会恢复
audioVolume: booean; // 全局音量：BGM/BGS/SE/TS 音量
bgm: true; // 当前正在播放的BGM
bgs: true; // 当前正在播放的BGS
*/
static saveConfig: any;
/**
新的游戏：新游戏会进入一个预设好的出生点场景，所有玩家变量和属性等都是初始值
项目层可以通过监听事件来以新游戏的方式进入到场景里，参考[ClientScene]的
EVENT_IN_NEW_SCENE事件
新游戏并不会清空全局数据：如二周目变量、自定义全局数据、存档目录信息等
在调用该函数之前，默认的场景：Game.currentScene=ClientScene.EMPTY
*/
static newGame(): void;
/**
获取全档案信息，返回全部存档列表信息
@return 格式：
-- id = 存档的唯一编号，如[1,3,61] 表示存档了1号、3号、61号文件
-- now = 存档时unix时间戳
-- indexInfo = 自定义信息（比如存放地图名称，方便档案列表中玩家可以快速识别）
*/
static getSaveInfo(): {
indexInfo: any;
id: number;
now: number;
}[];
/**


---

## 第 119 页

获取档案列表中指定的存档信息
@param 指定的存档信息（目录中的简单信息），null 表示无该存档
@return 格式：
-- indexInfo 自定义信息
-- id = 存档的唯一编号，如[1,3,61] 表示对应存档1号、3号、61号
-- now = 存档时unix时间戳
*/
static getSaveInfoByID(id: number): {
indexInfo: any;
id: number;
now: number;
};
/**
储存自定义全局信息，全局数据在任何新的游戏、存档都通用的数据（比如用于储存用户的按
键设置或多周目数据）
调用此函数也会同时储存二周目变量信息
储存时会额外储存SinglePlayerGame.regSaveCustomGlobalData注册的自定义存档数据
@param onFin 当储存完毕时 onFin(success:boolean)
*/
static saveGlobalData(onFin: Callback): void;
/**
删除全局自定义数据信息，同时也会删除二周目变量信息
@param onFin [可选] 默认值=null 删除完毕后回调
*/
static deleteGlobalData(onFin?: Callback): void;
/**
存档：支持事件执行中调用存档
储存时会额外储存SinglePlayerGame.regSaveCustomData注册的自定义存档数据
同时会储存全局数据（同调用了SinglePlayerGame.saveGlobalData）
-- 设备储存（PC、移动端等设备以文件形式的储存）
-- cookies 缓存（Web支持LocalStorage的形式储存）
-- 云存档（GC游戏平台自动支持云存档服务）
@param index 存档位置
@param onFin 存档完毕时回调 onFin(success:boolean)
@param indexInfo [可选] 默认值=null 存档目录用的信息，可被JSON化的信息（写入至LIFE-
DATA，用于在读档列表中看到一些自定义的信息，可以使用SinglePlayerGame.getSaveInfo
来获取）
*/
static saveGame(index: number, onFin: Callback, indexInfo?: any): void;
/**
读档 调用此函数会派发ClientScene.EVENT_IN_NEW_SCENE事件以便项目层实现进入相应的
场景
@param index 读档位置


---

## 第 120 页

@param onFin 读档完毕回调 onFin(success:boolean);
*/
static loadGame(index: number, onFin: Callback): void;
/**
删除存档
@param onFin 回调是否删除成功 onFin(success:boolean)
*/
static delSaveFile(index: number, onFin: Callback): void;
/**
获取对象开关，一般用于更换场景后安装对象的开关，对象开关并不会随着切换场景而重置，
并且也会存入至存档中
@param sceneID 场景ID
@param soIndex 对象ID
@return [number]
*/
static getSceneObjectSwitch(sceneID: number, soIndex: number): number[];
/**
恢复存档数据，一般以读档形式进入场景后恢复数据，包含：
-- 所有对象的属性和行为（进行到一半的行为会接着继续执行）
-- 所有图像系统的图片、立绘、动画的状态，正在执行中的任务也会得到恢复继续中途继续执
行
-- 所有正在执行的事件会恢复中途继续执行
-- 所有已打开的界面和层次
-- 恢复之前正在播放的BGM和BGS（背景音乐、场景音效）
-- 恢复之前的场景雾效果、色调、镜头状态（即将调整，由于该功能会放到项目层实现，后期
会以自定义储存数据的形式储存读取）
*/
static recoveryData(): void;
/**
注册与存档绑定的自定义数据
--尽可能只储存数据而非图片等资源，以免导致存档文件过大，对部分环境造成影响（如
steam云存档）
@param dataName 数据名
@param dataFunction 数据函数回调，通过此回调获取需要储存的数据
*/
static regSaveCustomData(dataName: string, dataFunction: Callback): void;
/**
注册与游戏绑定的自定义数据（与存档无关，游戏启动即会自动加载的数据 GC-LifeData）
--尽可能只储存数据而非图片等资源，以免导致存档文件过大，对部分环境造成影响（如
steam云存档）
@param globalDataName 全局数据名称


---

## 第 121 页

@param globalDataFunction 数据函数回调，通过此回调获取需要储存的数据
*/
static regSaveCustomGlobalData(globalDataName: string, globalDataFunction: Callback): 
void;
/**
获取当前存档的自定义数据，读档后才能够获取
@param dataName 数据名
*/
static getSaveCustomData(dataName: string): any;
/**
读取自定义全局数据
@param 全局数据名称
*/
static getSaveCustomGlobalData(globalDataName: string): any;
}
/**
立绘显示对象
立绘系统继承于Avatar，可以视为没有方向概念的特殊行走图
支持表情、部件、序列帧
【创建立绘】
var sa = new StandAvatar();
sa.id = 1;
sa.x = 300;
sa.y = 300;
stage.addChild(sa);
Created by 黑暗之神KDS on 2018-11-04 03:15:18.
*/
declare class StandAvatar extends Avatar {
/**
是否水平翻转
*/
flip: boolean;
}
/**
字符串工具类
GC内部封装的字符串处理工具类
Created by 黑暗之神KDS on 2019-01-02 20:23:15.
*/
declare class StringUtils {
/**
获取字符真实长度，会计算汉字
@param str 字符串


---

## 第 122 页

@return 字符串str的真实长度
*/
static getRealLength(str: string): number;
/**
清除HTML格式
@param str 可能带有HTML格式的字符串
@return [string] 清除HTML格式后的字符串
*/
static clearHtmlTag(str: string): string;
/**
获取两个字符串中间不相同的地方的信息
@param str1 字符串1
@param str2 字符串2
@return [头串相同的字符数目,尾串相同的字符数目]
*/
static getMiddleDiff(str1: string, str2: string): [number, number];
}
/**
同步任务工具类
任务类型相同的只能按照顺序执行下去，在当前任务未完成前后面的任务都处于等待状态
*
使用方式：
var taskName = "我的同步任务1";
// 第1个同步任务，同类型的任务会等待该任务执行完毕再接着执行
new SyncTask(taskName, function () {
// 第1个顺序任务逻辑
xxxxxxxxxxxxx
// 第1个顺序任务执行完毕
SyncTask.taskOver(taskName);
});
// 第2个同步任务，同类型的任务会等待该任务执行完毕再接着执行
new SyncTask(taskName, function () {
// 第2个顺序任务逻辑
xxxxxxxxxxxxx
// 第2个顺序任务执行完毕
SyncTask.taskOver(taskName);
});
Created by 黑暗之神KDS on 2018-01-01 03:47:27.
*/
declare class SyncTask {
/**


---

## 第 123 页

方法
*/
func: Function;
/**
参数
*/
arg: any[];
/**
this指针
*/
thisPtr: any;
/**
同步任务执行 构造函数
@param taskName 任务名称
@param func 执行的方法 [可选] 默认值=null
@param arg 参数 [可选] 默认值=null 回调函数携带的参数
@param thisPtr 作用域 [可选] 默认值=null
@param isConver [可选] 默认值=false 会否重复的任务覆盖掉
@param jumpQuere [可选] 默认值=false 是否插队，插队的话则插到最前方
*/
constructor(taskName: string, func?: Function, arg?: any[], thisPtr?: any, isConver?: 
boolean, jumpQuere?: boolean);
/**
通知某个类型任务完成，直接进行同类型的下一个任务
@param taskName 任务名称
*/
static taskOver(taskName: string): void;
/**
清除任务
@param taskName 任务名称
*/
static clear(taskName: string): void;
}
/**
图块素材配置数据
来自编辑器预设好的图块素材数据
Created by 黑暗之神KDS on 2018-10-16 17:49:10.
*/
declare class TileData {
/**
唯一ID
*/
id: number;
/**


---

## 第 124 页

名称
*/
name: string;
/**
图片路径 默认值=""
*/
url: string;
/**
数据层数据 [自定义数据层索引][xGrid][yGrid] 默认值=[]
*/
dataLayers: number[][][];
/**
宽度 默认值=0
*/
width: number;
/**
高度 默认值=0
*/
height: number;
/**
获取图块数据
@param texID 图块素材ID
@return 图块素材配置数据
*/
static getTileData(texID: number): TileData;
}
/**
【顶级函数】-输出
*/
declare function trace(...arg: any[]): any;
/**
【顶级函数】：延迟n帧后执行
@param func 执行的方法
@param frame 延迟的帧数
@return [string] 标识
*/
declare function setFrameout(func: Function, frame: number, ...arg: any[]): string;
/**
【顶级函数】：清理延迟n帧执行的函数
@param sign 由setFrameout返回值产生的标识
*/
declare function clearFrameout(sign: string): void;
/**


---

## 第 125 页

当前游戏帧
*/
declare var __fCount: number;
/**
过渡数据
Created by JayLen on 2020-11-17 21:55:01.
*/
declare class TransData {
/**
过渡方式：0-均匀过渡 1-缓动过渡 2-曲线过渡 默认值=0
*/
transType: number;
/**
循环方式：0-无(一次) 1-循环 2-一次往返-返回时从头过渡 3-一次往返-返回时从尾过渡 4-循环
往返-返回时从头过渡 5-循环往返-返回时从尾过渡 默认值=0
*/
loopType: number;
/**
时间类别：0-无() 1-帧数 2-秒数 3-可选择单位 默认值=0
*/
timeType: number;
/**
时间单位：0-帧数 1-秒数 默认值=1
*/
timeUnit: number;
/**
总时间数(帧数或者秒数) 默认值=2
*/
totalTime: number;
/**
缓动方式 默认值=0
*/
tweenType: number;
/**
缓动方式名称(如backOut) 默认值="bounceIn"
*/
tweenTypeName: string;
/**
曲线数据 默认值=[[0, 0, 0, 99, 1, 1, 1, 3], [0, 100, 100]]
*/
curveData: any[];
/**
刷新时间(默认16，表示16毫秒，逐帧刷新) 默认值=16
*/
refreshInterval: number;
/**


---

## 第 126 页

是否循环
*/
static isLoop(transData: TransData): boolean;
/**
是否使用帧
*/
static isUseFrame(transData: TransData): boolean;
/**
是否使用时间
*/
static isUseTime(transData: TransData): boolean;
}
/**
动画组件
封装了动画的界面组件
*
相关事件
EventObject.LOADED 资源加载完成时候事件
GCAnimation.RENDER  动画播放时派发的事件
GCAnimation.PLAY_START 动画播放开始事件
GCAnimation.PLAY_STOP 动画停止时事件
GCAnimation.PLAY_COMPLETED 动画播放完成时事件
GCAnimation.SIGNAL 信号事件
*
使用方法：
var a = new UIAnimation();
a.animationID =5;
a.playType = 1;
stage.addChild(a);
*
// 事件监听示例
a.on(EventObject.LOADED,this,this.onLoaded);
a.on(GCAnimation.PLAY_COMPLETED,this,this.onLoaded);
*
关于鼠标事件点击区域：当注册了鼠标事件后，系统会根据当前帧的实际子显示对象自动判断鼠标
可响应区域
*
Created by 黑暗之神KDS、feng on 2019-04-03 17:57:13.
*/
declare class UIAnimation extends UIBase {
/**


---

## 第 127 页

使用的动画编号
*/
animationID: number;
/**
播放类型 0-不播放 1-播放一次 2-循环播放 默认值=0
*/
playType: number;
/**
水平缩放 1表示100% 默认值=1
*/
scaleNumberX: number;
/**
垂直缩放 1表示100% 默认值=1
*/
scaleNumberY: number;
/**
禁音模式：播放该动画时忽略音效的播放 默认值=false
*/
silentMode: boolean;
/**
是否显示命中效果：编辑器中允许对动画层勾选“仅命中时显示”，开启此项将显示包含仅在命
中时出现的动画层
在播放动画前设置此项 默认值=false
*/
showHitEffect: boolean;
/**
频率：默认值=Config.ANIMATION_FPS
*/
playFps: number;
/**
起始帧：播放时从该帧开始播放 默认值=1
*/
aniFrame: number;
/**
获取动画元素
*/
get animation(): GCAnimation;
/**
构造函数
@param showCircleWhenInEditor [可选] 默认值=true 是否显示圆点当在编辑器内显示时
*/
constructor(showCircleWhenInEditor?: boolean);
}
/**
行走图组件


---

## 第 128 页

封装了行走图的界面组件
*
相关事件
EventObject.LOADED 资源加载完成时候事件
Avatar.ACTION_PLAY_COMPLETED
Avatar.RENDER 当确实到达了新的一帧后派发，本体如果没有实际的帧则不派发
*
使用方法：
var a = new UIAvatar();
a.avatarID = 5;
stage.addChild(a);
*
// 事件监听示例
a.on(EventObject.LOADED,this,this.onLoaded);
a.on(Avatar.ACTION_PLAY_COMPLETED,this,this.onActionPlayComplete);
a.on(Avatar.RENDER,this,this.onRender);
*
Created by 黑暗之神KDS on 2018-12-11 17:44:18.
*/
declare class UIAvatar extends UIBase {
/**
AVATAR-ID
*/
avatarID: number;
/**
行走图对象
*/
get avatar(): Avatar;
/**
是否播放 默认值=true
*/
isPlay: boolean;
/**
仅播放一次 默认值=false
*/
playOnce: boolean;
/**
水平缩放 1表示100% 默认值=1
*/
scaleNumberX: number;
/**


---

## 第 129 页

垂直缩放 1表示100% 默认值=1
*/
scaleNumberY: number;
/**
起始播放的帧 默认值=1
*/
avatarFrame: number;
/**
帧率 默认值=12
*/
avatarFPS: number;
/**
动作表情 默认值=1
*/
actionID: number;
}
/**
组件基类
所有组件的基类，不单独实例化出来
Created by 黑暗之神KDS on 2018-10-12 14:31:34.
*/
declare class UIBase extends GameSprite {
/**
事件：组件构造初始化时派发的事件
利用此事件可以监听所有组件初始化，以便可以追加逻辑
EventUtils.addEventListenerFunction(UIBase, 
UIBase.EVENT_COMPONENT_CONSTRUCTOR_INIT, (uiComp: UIBase)=>{
// to do
}, this);
*/
static EVENT_COMPONENT_CONSTRUCTOR_INIT: string;
/**
事件：由于出现条件导致的出现或消失（visible变更）
ui.on(UIBase.ON_VISIBLE_CHANGE,this,func);
*/
static ON_VISIBLE_CHANGE: string;
/**


---

## 第 130 页

唯一ID：由系统随机生成
*/
id: string;
/**
预设控件的所属界面根容器，比如2号界面中的预设控件中的该属性就是2号界面本身
*/
guiRoot: UIRoot;
/**
是否存在自定义的触发事件 索引为自定义界面触发事件类别
*/
hasCommand: boolean[];
/**
组件类型名称 如UIButton
*/
className: string;
/**
提交玩家输入信息 数据类型：any[] | Callback
用于装载提交的玩家输入值，以便事件页接收（等待玩家提交信息），可以是固定的数组数据
或是回调函数中返回数组数据
比如该控件拥有点击事件，并且点击后以带参数的形式提交，提交后事件页中将接收的到输入
值
*/
commandInputMessage: any;
/**
释放
*/
dispose(): void;
}
/**
图片组件
用于显示一张图片用的组件，支持绑定玩家字符串变量（字符串变量存放地址）
相关事件
EventObject.LOADED 资源加载完成时候事件
EventObject.CHANGE 当image图像改变时事件
*
使用方法：
var a = new UIBitmap();
a.image = "asset/image/xxx.jpg"; // 加载固定图片
a.image = "$5"; // 绑定5号玩家字符串变量的图片地址
stage.addChild(a);
*
// 事件监听示例
a.on(EventObject.LOADED,this,this.onLoaded);


---

## 第 131 页

a.on(EventObject.CHANGE,this,this.onChange);
*
[变量系统]在显示时会自动注册请求同步显示服务器玩家变量
Created by 黑暗之神KDS on 2018-10-12 14:02:39.
*/
declare class UIBitmap extends UIBase {
/**
图片地址，支持玩家字符串变量，比如$5 表示使用5号玩家字符串变量
var img = new UIBitmap();
img.image = "$5";
Game.layer.uiLayer.addChild(img);
*/
image: string;
/**
设置图片地址（不派发EventObject.CHANGE事件）
@param image 图片地址，支持玩家字符串变量，比如$5 表示使用5号玩家字符串变量
*/
setImageForce(image: string): void;
/**
图片源，可通过图源设置图片样式
如果手动设置的该属性，卸载该组件时系统不会卸载该贴图，如有需要，可手动卸载
*/
texture: Texture;
/**
九宫格设置：上边距、右边距、下边距、左边距、是否平铺（1表示平铺）
让素材不再简单拉伸，而是根据九宫格方式进行拉伸 默认值=0,0,0,0,0
*/
grid9: string;
/**
水平翻转 默认值=false
*/
flip: boolean;
/**
平铺 默认值=false
*/
isTile: boolean;
/**
原点对齐模式 0-原点 1-中心点 默认值=0
*/
pivotType: number;
}
/**


---

## 第 132 页

按钮组件
拥有三种状态的按钮组件（正常状态、按下时、鼠标悬停时）
相关事件
EventObject.LOADED 资源加载完成时候事件
*
使用方法：
var a = new UIButton();
a.image1 = "asset/image/picture/control/btn_normal.png";
a.image2 = "asset/image/picture/control/btn_over.png";
a.image3 = "asset/image/picture/control/btn_click.png";
a.width = 200;
a.height = 100;
stage.addChild(a);
*
// 事件监听示例
a.on(EventObject.LOADED,this,this.onLoaded);
*
Created by 黑暗之神KDS on 2018-10-12 14:00:10.
*/
declare class UIButton extends UIBase {
/**
正常状态下图片路径 mouse_out
*/
image1: string;
/**
鼠标悬停时图片路径 mouse_over
*/
image2: string;
/**
鼠标按下时图片路径 mouse_down
*/
image3: string;
/**
正常状态下图片的九宫格设置：上边距、右边距、下边距、左边距、是否平铺（1表示平铺）
让素材不再简单拉伸，而是根据九宫格方式进行拉伸 默认值="0,0,0,0,0"
*/
grid9img1: string;
/**
鼠标移入时图片的九宫格设置：上边距、右边距、下边距、左边距、是否平铺（1表示平铺）
让素材不再简单拉伸，而是根据九宫格方式进行拉伸 默认值="0,0,0,0,0"
*/
grid9img2: string;
/**


---

## 第 133 页

鼠标点击时图片的九宫格设置：上边距、右边距、下边距、左边距、是否平铺（1表示平铺）
让素材不再简单拉伸，而是根据九宫格方式进行拉伸 默认值="0,0,0,0,0"
*/
grid9img3: string;
/**
按钮上显示的文本
*/
label: string;
/**
文本水平对齐方式 0-居左 1-居中 2-居右 默认值=1
*/
align: number;
/**
文本垂直对齐方式 0-居上 1-居中 2-居下 默认值=1
*/
valign: number;
/**
文本粗体 默认值=false
*/
bold: boolean;
/**
斜体 默认值=false
*/
italic: boolean;
/**
平滑 默认值=false
*/
smooth: boolean;
/**
文本字体，默认值是预设的默认字体
*/
font: string;
/**
文本颜色 默认值="#999999"
*/
color: string;
/**
鼠标悬停时文本颜色 默认值="#999999"
*/
overColor: string;
/**
鼠标点击时文本颜色 默认值="#999999"
*/
clickColor: string;
/**


---

## 第 134 页

文本字体大小 默认值=16
*/
fontSize: number;
/**
文本水平偏移量，默认值=0
*/
textDx: number;
/**
文本垂直偏移量，默认值=0
*/
textDy: number;
}
/**
复选框组件
复选框是一种拥有选中或未选中状态的基础控件
相关事件：
EventObject.CHANGE 当selected改变状态时派发
EventObject.LOADED 加载完成时候事件
*
使用方法：
var a = new UICheckBox();
a.image1 = "asset/image/picture/control/check_unselected.png";
a.image2 = "asset/image/picture/control/check_selected.png";
a.width  = 100;
a.height = 100;
a.selected = true;
stage.addChild(a);
*
// 事件监听示例
a.on(EventObject.CHANGE,this,this.onChange);
a.on(EventObject.LOADED,this,this.onLoaded);
*
Created by 黑暗之神KDS on 2019-04-14 21:41:10.
*/
declare class UICheckBox extends UIBase {
/**
更改选中状态
*/
selected: boolean;
/**
更改选中状态，不派发EventObject.CHANGE事件


---

## 第 135 页

@param v
*/
setSelectedForce(v: boolean): void;
/**
未选中效果图片路径 即selected=false时
*/
image1: string;
/**
选中时效果图片路径 即selected=true时
*/
image2: string;
/**
未选中状态下图片的九宫格设置：上边距、右边距、下边距、左边距、是否平铺（1表示平
铺）
让素材不再简单拉伸，而是根据九宫格方式进行拉伸 默认值="0,0,0,0,0"
*/
grid9img1: string;
/**
选中状态下图片的九宫格设置：上边距、右边距、下边距、左边距、是否平铺（1表示平铺）
让素材不再简单拉伸，而是根据九宫格方式进行拉伸  默认值="0,0,0,0,0"
*/
grid9img2: string;
/**
片段事件内容：当selected更改时触发
主动调用方式：CommandPage.startTriggerFragmentEvent
*/
onChangeFragEvent: string;
}
/**
下拉框组件
下拉框是一种点击后可弹出一组选项并允许选择一个的组件
相关事件：
EventObject.CHANGE 当改变状态时派发
EventObject.LOADED 加载完成时候事件
UIComboBox.OPEN 当下拉框打开时派发
UIComboBox.CLOSE 当下拉框关闭时派发
*
使用方法：
var a = new UIComboBox();
a.bgSkin = "asset/image/picture/control/tab_selected.png";
a.itemLabels = "1,2,3,4,5"
stage.addChild(a);
*


---

## 第 136 页

// 事件监听示例
a.on(EventObject.CHANGE,this,this.onChange);
a.on(EventObject.LOADED,this,this.onLoaded);
*
Created by 黑暗之神KDS on 2019-11-11 01:13:31.
*/
declare class UIComboBox extends UIBase {
/**
事件：当下拉框打开时派发事件
*/
static OPEN: string;
/**
事件：当下拉框关闭时派发事件
*/
static CLOSE: string;
/**
是否打开中
*/
isComboBoxOpen: boolean;
/**
显示框的背景图片路径
*/
bgSkin: string;
/**
显示框的背景图片九宫格设置 默认值="0,0,0,0,0"
九宫格设置：上边距、右边距、下边距、左边距、是否平铺（1表示平铺）
让素材不再简单拉伸，而是根据九宫格方式进行拉伸
*/
bgGrid9: string;
/**
文本水平对齐 0-居左 1-居中 2-居右 默认值=1
*/
align: number;
/**
文本垂直对齐 0-居上 1-居中 2-居下 默认值=1
*/
valign: number;
/**
文本是否粗体 默认值=false
*/
bold: boolean;
/**
斜体 默认值=false
*/
italic: boolean;
/**


---

## 第 137 页

平滑 默认值=false
*/
smooth: boolean;
/**
文本字体，默认值是预设的默认字体
*/
font: string;
/**
文本颜色 默认值="#FFFFFF"
*/
color: string;
/**
文本字体尺寸 默认值=16
*/
fontSize: number;
/**
文本水平方向偏移量 默认值=0
*/
textDx: number;
/**
文本垂直方向偏移量 默认值=0
*/
textDy: number;
/**
当前选中项 默认值=0
*/
selectedIndex: number;
/**
当前选中项，不派发 EventObject.CHANGE 事件
@param v 选中项值
*/
setSelectedForce(V: number): void;
/**
下拉框列表中的文本选项集，格式：1,2,3,4,5 表示5个选项
*/
itemLabels: string;
/**
下拉框列表中的单位选项的高度 默认值=20
*/
itemHeight: number;
/**
下拉框列表中同时显示的最大选项数 默认值=5
*/
displayItemSize: number;
/**


---

## 第 138 页

下拉框列表中滚动条背景图片路径 默认值="asset/image/picture/UI/uicomboboxbg.png"
*/
listScrollBg: string;
/**
下拉框列表中滚动轴背景图片路径 默认值="asset/image/picture/UI/uicomboboxslider.png"
*/
listScrollBar: string;
/**
下拉框列表的背景颜色 默认值="#FFFFFF"
*/
listBgColor: string;
/**
下拉框列表的文本水平对齐 0-居左 1-居中 2-居右 默认值=0
*/
itemAlign: number;
/**
下拉框列表的垂直水平对齐 0-居上 1-居中 2-居下 默认值=1
*/
itemValign: number;
/**
下拉框列表的文本是否粗体 默认值=false
*/
itemBold: boolean;
/**
下拉框列表的文本字体，默认值是预设的默认字体
*/
itemFont: string; 
/**
下拉框列表的文本颜色 默认值="#000000"
*/
itemColor: string;
/**
下拉框列表的选中时的文本颜色 默认值="#FFFFFF"
*/
itemOverColor: string;
/**
下拉框列表的选中时的背景文本颜色 默认值="#000000"
*/
itemOverBgColor: string;
/**
下拉框列表的文本字体尺寸 默认值=12
*/
itemFontSize: number;
/**


---

## 第 139 页

下拉框列表的文本水平方向偏移 默认值=0
*/
itemTextDx: number;
/**
下拉框列表的文本垂直方向偏移 默认值=0
*/
itemTextDy: number;
/**
片段事件内容：当选中项被更改时触发
主动调用方式：CommandPage.startTriggerFragmentEvent
*/
onChangeFragEvent: string;
}
/**
可输入文本组件
可输入文本是一个用于让用户输入文本的组件
相关事件：
EventObject.ENTER 按下ENTER键时
EventObject.INPUT 输入文本时
EventObject.CHANGE 文本改变时
EventObject.FOCUS 产生焦点时
EventObject.BLUR 失去焦点时
*
使用方法：
var a = new UIInput();
a.color = "#FF0000"
a.text = "请输入"
stage.addChild(a);
*
// 事件监听示例
a.on(EventObject.ENTER,this,this.onInput);
*
Created by 黑暗之神KDS on 2019-04-14 17:43:32.
*/
declare class UIInput extends UIString {
/**
文本输入模式 0-文本模式 1-密码模式 2-数字模式 3-多行文本 默认值=0
*/
inputMode: number;
/**


---

## 第 140 页

限制输入字符串 如0-9A-Za-z 则表示只能输入数字和字母（正则表达式）
*/
restrict: string;
/**
用于产生焦点或失去焦点
*/
focus: boolean;
/**
最大可输入字符数 默认值=99999
*/
maxChars: number;
/**
选中全部文字
*/
select(): void;
/**
选中指定索引区间内的文字
@param startIndex 起始索引
@param endIndex 结束索引
*/
setSelection(startIndex: number, endIndex: number): void;
/**
片段事件内容：当输入文本时触发
主动调用方式：CommandPage.startTriggerFragmentEvent
*/
onInputFragEvent: string;
/**
片段事件内容：当按下回车时确定时触发
主动调用方式：CommandPage.startTriggerFragmentEvent
*/
onEnterFragEvent: string;
}
/**
列表组件
列表组件是一个支持NxM矩阵式排列的组件，其内部的项（item）是通过创建另一个界面源实现的
-- 项数据基类：UIListItemData （此外系统会自动创建每个界面作为项数据类-ListItem_?，请查阅
system/UIRuntime.ts）
项数据类会自动根据控件创建相应的属性，以便填充后自动呈现出该数值或字符串（以及图片地址
等）
项数据映射值参考：
UIBitmap -> string-图片地址
UIString -> string-文本
UIVariable -> number-数值变量ID


---

## 第 141 页

UIAvatar -> number-行走图ID
UIStandAvatar -> number-立绘ID
UIAnimation -> number-动画ID
UIInput -> string-默认文本
UICheckBox -> boolean-选中状态
UISwitch -> number-开关ID
UITabBox -> string-项（如aa,bb,cc）
UISlider -> number-值
UIGUI -> number-界面ID
UIList -> UIListItemData[]-项数据
 *
相关事件：
EventObject.CHANGE 当改变状态时派发  onChange(state:number) state=0 表示selectedIndex
改变，否则是overIndex
EventObject.LOADED 加载完成时候事件
UIList.OPEN_STATE_CHANGE 打开状态发生改变时
UIList.ITEM_CLICK 点击确认项
UIList.EVENT_FOCUS_CHANGE 【EventUtils事件】当焦点更改时派发的事件
UIList.ITEM_CREATE 创建项时
*
使用方法：
// 列表方式添加数据
var a = new UIList();
a.overImageURL = "asset/image/picture/control/uilistover.png";
a.selectImageURL = "asset/image/picture/control/uilistselect.png";
a.itemModelGUI = 8; // 使用指定的界面ID来创建项，如果需要指定类，请使用 itemModelClass
stage.addChild(a);
var dArr = [];
for(var i=0;i<10;i++){
var d:ListItem_8 = new ListItem_8();
d.pic = "asset/image/a.jpg"; // 假设8号界面存在名为pic的控件
d.txt = "kds"; // 假设8号界面存在名为txt的文本
d.战斗力 = 5; // 假设8号界面存在名为战斗力的数值变量控件，这里绑定5号变量
dArr.push(d);
}
a.items = dArr;
*
// 树方式添加数据：在设置a.items前就决定好数据的父子节点关系：
var child = new ListItem_8();


---

## 第 142 页

child.pic = "asset/image/a.jpg";
child.txt = "kdsChild";
child.战斗力 = 5;
dArr[2].push(child);
*
// 事件监听示例
a.on(EventObject.CHANGE,this,this.onChange);
*
Created by 黑暗之神KDS on 2019-07-09 15:04:27.
*/
declare class UIList extends UIRoot {
/**
事件：当焦点更改时派发的事件 onFocusChange(lastFocus:UIList,currentFocus:UIList);
// lastFocus - 表示上次的焦点列表
// currentFocus - 表示此次的焦点列表
EventUtils.addEventListenerFunction(UIList,UIList.EVENT_FOCUS_CHANGE,
(lastFocus:UIList,currentFocus:UIList)=>{
// to do
},this);
*/
static EVENT_FOCUS_CHANGE: string;
/**
事件：打开状态发生改变时 onChange(ui,data)
uiList.on(UIList.OPEN_STATE_CHANGE,this,this.onOpenStateChange);
*/
static OPEN_STATE_CHANGE: string;
/**
事件：点击确认项（已选中该项时再点击则派发事件/或ENTER键）
uiList.on(UIList.ITEM_CLICK,this,this.onItemClick);
*/
static ITEM_CLICK: string;
/**
事件：创建项时 onItemCreate(ui: UIRoot, data: UIListItemData,index:number)
uiList.on(UIList.ITEM_CREATE,this,this.onItemCreate);


---

## 第 143 页

*/
static ITEM_CREATE: string;
/**
按键-向上移动 开启键盘支持后的默认快捷键，支持修改 默认值=[Keyboard.UP]
*/
static KEY_UP: number[];
/**
按键-向下移动 开启键盘支持后的默认快捷键，支持修改 默认值=[Keyboard.DOWN]
*/
static KEY_DOWN: number[];
/**
按键-向左移动 开启键盘支持后的默认快捷键，支持修改 默认值=[Keyboard.LEFT]
*/
static KEY_LEFT: number[];
/**
按键-向右移动 开启键盘支持后的默认快捷键，支持修改 默认值=[Keyboard.RIGHT]
*/
static KEY_RIGHT: number[];
/**
按键-确定 开启键盘支持后的默认快捷键，支持修改 默认值=[Keyboard.ENTER, 
Keyboard.SPACE]
*/
static KEY_ENTER: number[];
/**
开启键盘（手柄）支持：仅能操作当前焦点的UIList
*/
static KEY_BOARD_ENABLED: boolean;
/**
开启单一焦点系统（焦点在指定的List上才可以操作，否则默认是无法操作的状态）
通过设置UIList.focus来激活指定的列表以便操作
*/
static SINGLE_FOCUS_MODE: boolean;
/**
设置List焦点：
-- 只有设置了焦点的按键才有效
-- 如果是单一焦点系统的话同一时间内只允许一个List启用
*/
static focus: UIList;
/**
模拟按键按下：仅能操作当前焦点的UIList
@param keyCode 对应键位 KEY_UP/KEY_DOWN/KEY_LEFT/KEY_RIGHT/KEY_ENTER
*/
static setKeyDown(keyCode: number): void;
/**
优化模式 默认值=false


---

## 第 144 页

不会生成所有的item显示对象，而只生成可见范围内的装载位，在滚动显示时根据当前情况再
将数据安装到对应的装载位上
-- 如需要启用，请在设置item前设置该参数为true
-- 该模式下使用通过索引getItemUI获取的装载位并不是固定的
*/
optimizationMode: boolean;
/**
鼠标悬停则作为选中效果（默认是悬停效果）默认值=false
*/
overSelectMode: boolean;
/**
创建ITEM时回调 onCreateItem(ui: UIRoot, data: UIListItemData,index:number)
*/
onCreateItem: Callback;
/**
子项缩进 默认值=20
*/
subitemIndentation: number;
/**
是否允许选择 默认值=true
*/
selectEnable: boolean;
/**
列数 默认值=1
*/
repeatX: number;
/**
横向间隔 默认值=2
*/
spaceX: number;
/**
重向间隔 默认值=20
*/
spaceY: number;
/**
项宽度 默认值=200
*/
itemWidth: number;
/**
项高度 默认值=50
*/
itemHeight: number;
/**


---

## 第 145 页

光标悬停时的效果图片
*/
overImageURL: string;
/**
光标悬停时的对象：获取对象有利于自己追加一些额外的效果逻辑
*/
overImage: UIBitmap;
/**
选中项的效果图片
*/
selectImageURL: string;
/**
选中项的效果图片对象：获取对象有利于自己追加一些额外的效果逻辑
*/
selectedImage: UIBitmap;
/**
光标在项上面时的效果图片的九宫格 默认值="0,0,0,0,0"
九宫格设置：上边距、右边距、下边距、左边距、是否平铺（1表示平铺）
让素材不再简单拉伸，而是根据九宫格方式进行拉伸
*/
overImageGrid9: string;
/**
选中项的效果图片的九宫格 默认值="0,0,0,0,0"
九宫格设置：上边距、右边距、下边距、左边距、是否平铺（1表示平铺）
让素材不再简单拉伸，而是根据九宫格方式进行拉伸
*/
selectImageGrid9: string;
/**
选中项时效果图片的透明度 默认值=0.5
*/
selectedImageAlpha: number;
/**
光标在项上面时的效果图片的透明度 默认值=0.5
*/
overImageAlpha: number;
/**
选中项时效果图片是否在上层显示（盖住项）默认值=true
*/
selectedImageOnTop: boolean;
/**
光标在项上面时的效果图片是否在上层显示（盖住项）默认值=true
*/
overImageOnTop: boolean;
/**


---

## 第 146 页

项的类设定
*/
itemModelClass: any;
/**
项对应的界面ID
*/
itemModelGUI: number;
/**
所有项数据
*/
items: UIListItemData[];
/**
获取全部项对应的显示对象
如果更新了项数据则显示对象也会被替换成新的，若需要记录该显示对象请谨慎使用
*/
itemSprites: Sprite[];
/**
列表的数据总个数。
*/
get length(): number;
/**
选中项，根据指定的数据
@return [UIListItemData]
*/
selectedItem: UIListItemData;
/**
选中项，根据索引（即所在数据组的位置，数据组包括未打开的隐藏树节点）默认值=-1
@return [number] 
*/
selectedIndex: number;
/**
选中项，根据索引，不派发EventObject.CHANGE事件
@param v 选中项
*/
setSelectedIndexForce(v: number): void;
/**
悬停项，根据索引（即所在数据组的位置，数据组包括未打开的隐藏树节点）默认值=-1
*/
overIndex: number;
/**
悬停项，根据索引，不派发EventObject.CHANGE事件
@param v 悬停项
*/
setOverIndexForce(v: number): void;
/**


---

## 第 147 页

滚动到指定行：如果该项显示对象在完全显示中时则忽略滚动
@param index 指定的索引
@param ignoreAlreadyInVisible [可选] 默认值=true 忽略已
@param tween [可选] 默认值=false 是否缓动
@param duration [可选] 默认值=0 持续时间
@param ease [可选] 默认值=null 缓动方法
@param complete [可选] 默认值=null 当缓动完毕时回调
*/
scrollTo(index: number, ignoreAlreadyInVisible?: boolean, tween?: boolean, duration?: 
number, ease?: Function, complete?: Callback): void;
/**
替换数据刷新显示，同时会触发 onCreateItem 函数
@param itemData 新数据
@param index 需要替换的items索引
*/
replaceItem(itemData: UIListItemData, index: number): void;
/**
添加数据
@param itemData 新数据
@param index [可选] 默认值=-1 插入的位置，-1表示向后插入
@return [UIRoot] 数据对应的显示对象
*/
addItem(itemData: UIListItemData, index?: number): UIRoot;
/**
移除数据
@param itemData 数据，如果该数据不在列表内则忽略 
@return [number] 数据所在的位置
*/
removeItem(itemData: UIListItemData): number;
/**
移除数据，根据指定的位置
@param index 指定的位置
@return [UIListItemData] 数据 
*/
removeItemByIndex(index: number): UIListItemData;
/**
更换位置
@param itemData 数据
@param toIndex 需要更换至的位置
@return [boolean] 是否更换成功
*/
setItemIndex(itemData: UIListItemData, toIndex: number): boolean;
/**


---

## 第 148 页

更换位置-根据数据所在的位置
@param itemIndex 数据所在的位置
@param toIndex 需要更换至的位置
@return [boolean] 是否更换成功
*/
setItemIndexByIndex(itemIndex: number, toIndex: number): boolean;
/**
获取项的显示对象
@param index 索引
@return [UIRoot]
*/
getItemUI(index: number): UIRoot;
}
/**
界面组件中的项数据基类
对应UIList中项所绑定的数据，每个项显示对象都会对应一个项数据（该类或其子类的实例）
使用方式可参考[UIList]
*
Created by 黑暗之神KDS on 2019-07-09 15:04:42.
*/
declare class UIListItemData {
/**
任意附加的数据
*/
data: any;
/**
提取储存数据
@param includeData [可选] 默认值=false 是否包含自定义附加的数据，请保证该数据可以
JSON化
*/
getSaveData(includeData?: boolean): any;
/**
还原储存数据
@param saveData
*/
static recoverySaveData(saveData: any): UIListItemData;
/**
是否处于打开状态（树节点的情况）
*/
isOpen: boolean;
/**


---

## 第 149 页

获取父节点
*/
get parent(): UIListItemData;
/**
添加节点
@param item 节点数据对象
*/
addChild(item: UIListItemData): void;
/**
添加节点到指定索引中
@param item 节点数据对象
@param index 插入所在索引
*/
addChildAt(item: UIListItemData, index: number): void;
/**
移除节点
@param item 节点数据对象
*/
removeChild(item: UIListItemData): void;
/**
移除节点至指定索引中
@param index 节点所在的索引
*/
removeChildAt(index: number): void;
/**
移除所有节点
*/
removeAll(): void;
/**
获取节点根据索引
@param index 节点所在的索引
@return [UIListItemData]
*/
getChildAt(index: number): UIListItemData;
/**
获取节点索引
@param item 节点数据对象
*/
getChildIndex(item: UIListItemData): number;
/**
子节点总数
*/
get numChildren(): number;
/**


---

## 第 150 页

子节点列表
*/
get children(): UIListItemData[];
/**
是否继承于指定节点
*/
isInherit(data: UIListItemData): boolean;
/**
获取树型结构下全部节点中的子节点列表（含自身节点）
@param arr [可选] 默认值=null 指定的数组用于装载获取的结果数据
*/
getList(arr?: UIListItemData[]): UIListItemData[];
/**
获取树形结构的根节点
@return [UIListItemData]
*/
get root(): UIListItemData;
/**
获取所在树的深度
@return [number]
*/
get depth(): number;
/**
是否是隐藏节点（即父系节点可能被关闭了）
*/
get isHideNode(): boolean;
/**
优化模式变量：数据所在位置（列表刷新排列位置时设置）
*/
x: number;
/**
优化模式变量：数据所在位置（列表刷新排列位置时设置）
*/
y: number;
/**
优化模式变量：是否显示（可见范围外则不显示）
*/
visible: boolean;
/**
自定义尺寸，开启后需要设置width和height来决定宽和高
*/
customSize: boolean;
/**


---

## 第 151 页

自定义尺寸-宽
*/
width: number;
/**
自定义尺寸-高
*/
height: number;
}
/**
容器组件
一般用于装载子显示对象，并可以裁剪区域，只显示一部分内容
*
相关事件
EventObject.LOADED 加载完成时候事件，仅作为界面本身（根容器）时派发
*
使用方式：
var a = new UIRoot();
a.addChild(b);
*
Created by 黑暗之神KDS on 2018-10-12 16:31:59.
*/
declare class UIRoot extends UIBase {
/**
事件：当界面滚动时派发的事件 SCROLL(isVertical);
isVertical true为纵向，false为横向
*/
static SCROLL: string;
/**
是否限制区域内显示 默认值=false
*/
enabledLimitView: boolean;
/**
滚动条显示模式 0-不显示 1-显示 2-自动显示 3-仅显示竖滚动条 4-仅显示横滚动条 默认值=2
*/
scrollShowType: number;
/**
滚动条宽度 默认值=16
*/
scrollWidth: number;
/**
垂直滚动条背景皮肤
*/
vScrollBg: string;
/**


---

## 第 152 页

垂直滚动条皮肤
*/
vScrollBar: string;
/**
横向滚动条背景皮肤
*/
hScrollBg: string;
/**
横向滚动条皮肤
*/
hScrollBar: string;
/**
用鼠标或手滑动容器内区域可以滚动内部的内容区域（需要开启限制显示在区域内并实际内部
内容尺寸已超出显示区域）
0=仅移动端启用此效果,1=始终启用此效果,2=无 默认值=0
*/
slowmotionType: number;
/**
垂直方向滚动值(0~100)
*/
vScrollValue: number;
/**
水平方向滚动值(0~100)
*/
hScrollValue: number;
/**
刷新滚动条根据内容区域大小，如果更改了容器内子对象的尺寸
则需要调用此方法重新计算以便刷新滚动条。
*/
refresh(): void;
}
/**
界面实现类基类
用于生成的界面类（GUI_XX）继承于此类
以便在初始化的时候就可以调用内部的控件
Created by 黑暗之神KDS on 2018-10-11 04:35:33.
*/
declare class GUI_BASE extends UIRoot {
/**
预渲染：开启此项保证在派发EventObject.LOADED前预先渲染一次以便保证此后能够立即呈
现画面，不会因为资源较大而首次渲染卡顿一下
预渲染会消耗一定的性能，可以选择在界面资源较多的情况下使用此项，开启此项会有额外的
性能和内存开销
 */
prerender: boolean;
/**


---

## 第 153 页

界面ID
*/
guiID: number;
/**
根据其下组件的唯一ID找到该组件 compsIDInfo[comp.id] = comp; 默认值={}
界面编辑器预先设置好的组件才会存入该属性内，如果自己动态移除加入的可以自行管理该列
表
*/
compsIDInfo: any;
/**
是否存在界面本体事件
*/
hasRootCommand: boolean[];
/**
构造函数
@param guiID 界面ID
*/
constructor(guiID: number);
}
/**
滑块组件
用于指定一个范围min和max，在min和max之间滑动取得一个值的组件
相关事件：
EventObject.CHANGE 当改变value值时派发
EventObject.LOADED 资源加载完成时候事件
*
使用方式：
var a = new UISlider();
a.image1 = "asset/image/picture/control/slider_bg.png";
a.image2 = "asset/image/picture/control/slider_block.png";
a.image3 = "asset/image/picture/control/slider_bgfill.png";
a.value = 45;
stage.addChild(a);
*
// 事件监听示例
a.on(EventObject.CHANGE,this,this.onChange);
*
Created by 黑暗之神KDS on 2018-10-12 14:00:10.
*/
declare class UISlider extends UIBase {
/**


---

## 第 154 页

背景图
*/
image1: string;
/**
滑块图
*/
image2: string;
/**
滑块填充图
*/
image3: string;
/**
横向模式 默认值=true
*/
transverseMode: boolean;
/**
最小值 默认值=0
*/
min: number;
/**
最大值 默认值=100
*/
max: number;
/**
设置和获取当前值 默认值=50
*/
value: number;
/**
设置当前值，该函数不派发EventObject.CHANGE事件
@param value 值
*/
setValueForce(value: number): void;
/**
步进值 默认值=1
*/
step: number;
/**
背景图片九宫格设置：上边距、右边距、下边距、左边距、是否平铺（1表示平铺）
让素材不再简单拉伸，而是根据九宫格方式进行拉伸 默认值="0,0,0,0,0"
*/
bgGrid9: string;
/**
滑块图片九宫格设置：上边距、右边距、下边距、左边距、是否平铺（1表示平铺）


---

## 第 155 页

让素材不再简单拉伸，而是根据九宫格方式进行拉伸 默认值="0,0,0,0,0"
*/
blockGrid9: string;
/**
滑块填充图九宫格设置：上边距、右边距、下边距、左边距、是否平铺（1表示平铺）
让素材不再简单拉伸，而是根据九宫格方式进行拉伸 默认值="0,0,0,0,0"
*/
blockFillGrid9: string;
/**
显示模式：0-仅显示滑块 1-填充模式 2-显示滑块的填充模式 默认值=2
*/
blockFillMode: number;
/**
是否绑定数值变量
*/
isBindingVarID: boolean;
/**
设置绑定数值变量的编号
*/
bindingVarID: number;
}
/**
立绘组件
封装了立绘的界面组件
相关事件
EventObject.LOADED 加载完成时候事件
Avatar.ACTION_PLAY_COMPLETED
Avatar.RENDER 当确实到达了新的一帧后派发，本体如果没有实际的帧则不派发
*
使用方法：
var a = new UIStandAvatar();
a.avatarID =5;
stage.addChild(a);
*
// 事件监听示例
a.on(EventObject.LOADED,this,this.onLoaded);
a.on(Avatar.ACTION_PLAY_COMPLETED,this,this.onActionPlayComplete);
a.on(Avatar.RENDER,this,this.onRender);
*
Created by 黑暗之神KDS on 2020-01-27 01:23:18.
*/
declare class UIStandAvatar extends UIAvatar {
/**


---

## 第 156 页

是否水平翻转
*/
flip: boolean;
}
/**
文本组件
显示文本的组件，支持绑定玩家字符串变量
*
相关事件
EventObject.CHANGE 文本改变时
[变量系统]在显示时会自动同步显示字符串变量
*
使用方法：
var a = new UIString();
a.text = "kds"; // 固定的文本
a.text = "$6"; // 绑定6号玩家字符串变量
a.text = "@6"; // 绑定6号二周目字符串变量
stage.addChild(a);
*
// 事件监听示例
a.on(EventObject.CHANGE,this,this.onChange);
*
Created by 黑暗之神KDS on 2018-10-12 14:01:57.
*/
declare class UIString extends UIBase {
/**
文本内容 $6 表示使用6号玩家字符串变量 @6 表示使用6号二周目字符串变量
*/
text: string;
/**
设置文本（不派发EventObject.CHANGE事件）
@param v 文本内容 $6 表示使用6号玩家字符串变量 @6 表示使用6号二周目字符串变量
*/
setTextForce(v: string): void;
/**
字体大小 默认值=16
*/
fontSize: number;
/**
字体颜色 默认值="#000000"
*/
color: string;
/**


---

## 第 157 页

粗体 默认值=false
*/
bold: boolean;
/**
斜体 默认值=false
*/
italic: boolean;
/**
平滑 默认值=false
*/
smooth: boolean;
/**
行间距 默认值=0
*/
leading: number;
/**
字间距 默认值=0
*/
letterSpacing: number;
/**
字体，默认是预设的默认字体
*/
font: string;
/**
是否自动换行 默认值=true
*/
wordWrap: boolean;
/**
文本超出时处理方式 0-显示 1-隐藏 默认值=0
*/
overflow: number;
/**
横向对齐方式 0-左对齐 1-中对齐 2-右对齐 默认值=0
*/
align: number;
/**
垂直对齐方式 0-上对齐 1-中对齐 2-右对齐 默认值=0
*/
valign: number;
/**
是否开启阴影
*/
shadowEnabled: boolean;
/**


---

## 第 158 页

阴影颜色 默认值="#000000"
*/
shadowColor: string;
/**
阴影水平偏移量（像素）默认值=1
*/
shadowDx: number;
/**
阴影垂直偏移量（像素）默认值=1
*/
shadowDy: number;
/**
描边像素尺寸：如果效果不理想可以使用大号字体和粗体的配合，或者尝试别的字体 默认值
=0
*/
stroke: number;
/**
描边颜色，当描边像素尺寸不为0时显示 默认值="#000000"
*/
strokeColor: string;
/**
获取实际文本内容宽度
*/
get textWidth(): number;
/**
获取实际文本内容高度
*/
get textHeight(): number;
/**
获取实际文本内容长度
*/
get textLength(): number;
/**
片段事件内容：当更改文本时触发
主动调用方式：CommandPage.startTriggerFragmentEvent
*/
onChangeFragEvent: string;
}
/**
开关组件
用于绑定玩家开关的一种复选框组件，当玩家开关开启时，该组件处于选中状态，反之则处于未选
中状态
相关事件：
EventObject.LOADED 加载完成时候事件


---

## 第 159 页

[变量系统]在显示时会同步显示开关变量
*
使用方法：
var a = new UISwitch();
a.image1 = "asset/image/picture/control/check_unselected.png";
a.image2 = "asset/image/picture/control/check_selected.png";
a.width = 100;
a.height = 100;
a.switchMode = 0; // 玩家开关模式
a.switchID = "5"; // 绑定5号玩家开关
stage.addChild(a);
 
var a = new UISwitch();
a.image1 = "asset/image/picture/control/check_unselected.png";
a.image2 = "asset/image/picture/control/check_selected.png";
a.width = 100;
a.height = 100;
a.switchMode = 1; // 二周目开关模式
a.switchID = "5"; // 绑定5号二周目开关
stage.addChild(a);
*
// 事件监听示例
a.on(EventObject.LOADED,this,this.onLoaded);
*
Created by 黑暗之神KDS on 2019-04-14 22:31:21.
*/
declare class UISwitch extends UIBase {
/**
变量模式 0-开关 1-二周目开关
*/
switchMode: number;
/**
指定绑定的玩家开关ID
*/
switchID: number;
/**
未选中效果图片
*/
image1: string;
/**


---

## 第 160 页

选中时效果图片 默认值="asset/image/picture/control/check_selected.png"
*/
image2: string;
/**
未选中状态下图片的九宫格设置：上边距、右边距、下边距、左边距、是否平铺（1表示平
铺）
让素材不再简单拉伸，而是根据九宫格方式进行拉伸 默认值="0,0,0,0,0"
*/
grid9img1: string;
/**
选中状态下图片的九宫格设置：上边距、右边距、下边距、左边距、是否平铺（1表示平铺）
让素材不再简单拉伸，而是根据九宫格方式进行拉伸 默认值="0,0,0,0,0"
*/
grid9img2: string;
/**
片段事件内容：当选中状态被更改时触发
主动调用方式：CommandPage.startTriggerFragmentEvent
*/
onChangeFragEvent: string;
}
/**
标签栏组件
用于显示标签栏的一种组件，支持横向排列的标签和纵向排列的标签
在编辑器中的使用方法：如果标签组件中有N个标签的话，那么该组件的子对象放3个即可自动切换
显示
*
相关事件：
EventObject.CHANGE 当改变状态时派发
EventObject.LOADED 加载完成时候事件
*
使用方式：
var a = new UITabBox();
a.itemWidth = 100;
a.itemHeight = 20;
a.itemImage1 = "asset/image/picture/control/tab_unselected.png";
a.itemImage2 = "asset/image/picture/control/tab_selected.png";
a.items = "标签1,标签2";
stage.addChild(a);
*
// 添加两张图片，分别对应两个标签
var img1 = new UIBitmap;
img1.image = "asset/image/image1.png";


---

## 第 161 页

a.addChild(img1);
img1.y = 20;
*
var img2 = new UIBitmap;
img2.image = "asset/image/image2.png";
a.addChild(img2);
img2.y = 20;
*
// 事件监听示例
a.on(EventObject.LOADED,this,this.onLoaded);
*
Created by 黑暗之神KDS on 2019-04-14 22:31:21.
*/
declare class UITabBox extends UIBase {
/**
选中项 默认值=-1
*/
selectedIndex: number;
/**
设置选中项，不派发EventObject.CHANGE事件
*/
setSelectedForce(v: number): void;
/**
标签项 逗号隔开
*/
items: string;
/**
项总数
*/
get length(): number;
/**
标签项选中时的图片样式
*/
itemImage1: string;
/**
标签项移入时的图片样式
*/
itemImage2: string;
/**
排列为行的模式 默认值=false
*/
rowMode: boolean;
/**


---

## 第 162 页

标签项长度 默认值=177
*/
itemWidth: number;
/**
标签项高度 默认值=71
*/
itemHeight: number;
/**
标签项间距 默认值=5
*/
spacing: number;
/**
标签水平偏移 默认值=0
*/
labelDx: number;
/**
标签垂直偏移 默认值=0
*/
labelDy: number;
/**
文本颜色 标签项选中时 默认值="#FFFFFF"
*/
labelSelectedColor: string;
/**
文本颜色 标签项未选中时 默认值="#666666"
*/
labelColor: string;
/**
文本字体大小 默认值=16
*/
labelSize: number;
/**
文本字体，默认是预设的默认字体
*/
labelFont: string;
/**
文本字体对齐模式 0-居左 1-居中 2-居右 默认值=1
*/
labelAlign: number;
/**
文本字体粗体模式 默认值=false
*/
labelBold: boolean;
/**


---

## 第 163 页

斜体 默认值=false
*/
labelItalic: boolean;
/**
平滑 默认值=false
*/
smooth: boolean;
/**
标签项选中时图片的九宫格设置：上边距、右边距、下边距、左边距、是否平铺（1表示平
铺）
让素材不再简单拉伸，而是根据九宫格方式进行拉伸 默认值="0,0,0,0,0"
*/
grid9img1: string;
/**
标签项移入时图片的九宫格设置：上边距、右边距、下边距、左边距、是否平铺（1表示平
铺）
让素材不再简单拉伸，而是根据九宫格方式进行拉伸 默认值="0,0,0,0,0"
*/
grid9img2: string;
/**
片段事件内容：当selectedIndex更改时触发
主动调用方式：CommandPage.startTriggerFragmentEvent
*/
onChangeFragEvent: string;
}
/**
显示变量组件
可以选定一个变量绑定后即显示该变量的组件，当变量改变时该组件的文本会自动更新
相关事件
EventObject.CHANGE 文本改变时
*
[变量系统]在显示时会同步显示数值变量
*
使用方式：
var a = new UIVariable();
a.varMode = 0; // 数值变量模式
a.varID = 2; // 绑定2号玩家数值变量
stage.addChild(a);
 
var a = new UIVariable();
a.varMode = 1; // 二周目数值变量模式
a.varID = 2; // 绑定2号二周目数值变量


---

## 第 164 页

stage.addChild(a);
*
// 事件监听示例
a.on(EventObject.CHANGE,this,this.onChange);
*
Created by 黑暗之神KDS on 2018-10-12 14:02:26.
*/
declare class UIVariable extends UIString {
/**
变量模式 0-数值变量 1-二周目变量
*/
varMode: number;
/**
数值变量ID
*/
varID: string;
}
/**
视频显示对象
-- 不支持移动端使用
*
事件：
EventObject.LOADED 已加载元数据时触发。
EventObject.ERROR 当遇到错误时派发
EventObject.COMPLETE 当播放完毕时派发
*
Created by 黑暗之神KDS on 2020-12-24 13:24:59.
*/
declare class UIVideo extends UIBitmap {
/**
事件：播放开始
*/
static PLAY_START: string;
/**
事件：播放停止
*/
static PLAY_STOP: string;
/**
事件：播放暂停
*/
static PLAY_PAUSE: string;
/**
构造函数


---

## 第 165 页

@param editorCompMode [可选] 默认值=true 编辑器模式下显示专门的组件样式而非实际
的视频
*/
constructor(editorCompMode?: boolean);
/**
视频总时间：秒 如果不存在时则返回NaN
*/
get duration(): number;
/**
网络状态
0 = NETWORK_EMPTY - 音频/视频尚未初始化
1 = NETWORK_IDLE - 音频/视频是活动的且已选取资源，但并未使用网络
2 = NETWORK_LOADING - 浏览器正在下载数据
3 = NETWORK_NO_SOURCE - 未找到音频/视频来源
*/
get networkState(): number;
/**
视频地址
*/
videoURL: string;
/**
播放速率 默认值=1 表示100% 
*/
playbackRate: number;
/**
音量 默认值=
*/
volume: number;
/**
当前视频时间（秒）默认值=0
*/
currentTime: number;
/**
播放模式 0-播放 1-停止播放 2-暂停 默认值=0
*/
playType: number;
/**
是否正在播放中
*/
readonly isPlaying: boolean;
/**
静音
*/
muted: boolean;
/**


---

## 第 166 页

循环
*/
loop: boolean;
/**
播放
*/
play(): void;
/**
停止播放
*/
stop(): void;
/**
暂停播放
*/
pause(): void;
/**
片段事件内容：当视频源加载完毕时
主动调用方式：CommandPage.startTriggerFragmentEvent
*/
onLoadedFragEvent: string;
/**
片段事件内容：当发生错误时处理
主动调用方式：CommandPage.startTriggerFragmentEvent
*/
onErrorFragEvent: string;
/**
片段事件内容：当播放完成时处理
主动调用方式：CommandPage.startTriggerFragmentEvent
*/
onCompleteFragEvent: string;
}
/**
变量集合
包含数值变量、字符串变量、开关变量
分为全局变量（单机版则是二周目变量）和玩家变量
-- 关于单机版内核-二周目变量：不会随着读档而改变，而是贯穿于整个游戏。
-- 关于网络版内核-全局变量：整个世界的变量，所有玩家访问的是同一个世界变量
变量的改变会对一些有出现条件的组件、场景对象产生影响
系统设计上监听了变量的改变，当变量改变时相应的地方会自动同步：
-- 界面控件：一些组件可以绑定变量，绑定后变量改动会自动显示最新值无需额外的实现
-- 玩家数值变量组件 [UIVariable]
-- 玩家开关变量组件 [UISwitch]
-- 文本组件（可绑定玩家字符串变量） [UIString]


---

## 第 167 页

-- 客户端脚本中主动监听玩家变量的改变，参考 [ClientPlayer]
-- 单机版支持监听二周目变量，网络版仅支持一次获取，参考 [ClientWorld]
携带变量的类：玩家（[Player]）、世界（[ClientWorld]、[ServerWorld]）
*
Created by 黑暗之神KDS on 2018-04-17 16:48:07.
*/
declare class Variable {
/**
获取数值变量
@param index 变量ID
*/
getVariable(varID: number): number;
/**
设置数值变量
@param varID 变量ID
@param v 数值
*/
setVariable(varID: number, v: number): void;
/**
获取开关变量
@param varID 变量ID
*/
getSwitch(varID: number): number;
/**
设置开关变量
@param index 变量ID
@param v 开关值 0-关闭 1-开启
*/
setSwitch(varID: number, v: number): void;
/**
获取字符串变量
@param varID 变量ID
*/
getString(varID: number): string;
/**
设置字符串变量
@param varID 变量ID
@param v 字符串值
*/
setString(varID: number, v: string): void;
/**
分解动态文本：将普通文本和变量分解出来储存一种动态数据，然后可以通过
margeDynamicText函数将动态数据转为文本
支持动态类型:


---

## 第 168 页

0-普通字符串 1-全局/二周目数值变量[$v1] 2-全局/二周目开关[$w1] 3-全局/二周目字符串
[$s1] 4-玩家数值变量[@v1] 5-玩家开关[@w1] 6-玩家字符串[@s1] 7-玩家输入[@p0] 
9-全局/二周目数值变量(索引)[$$v1] 10-全局/二周目字符串(索引)[$$s1] 11-玩家数值变量(索
引)[@@v1] 12-玩家字符串(索引)[@@s1]
@param str 文本，如：我的攻击力是[@v1]
@return 动态数据
*/
static splitDynamicText(str: string): [number, string | number][];
/**
合并动态数据为文本，根据当前变量的情况
比如通过splitDynamicText函数将“我的攻击力是[@v1]”转化为动态数据，然后调用此函数可
输出：我的攻击力是156
将动态数据转为普通文本使用了两个函数是为了可用于预处理，以便加快执行速度，比如指令
中预编译可以使用splitDynamicText先转化储存，然后运行时只要使用margeDynamicText即
可。
@param texts 动态数据
@param player 玩家，[可选] 默认值=null 如果是玩家数据需要填入 Game.player
@param trigger 触发器，[可选] 默认值=null 如果在指令中执行，需要传入此参数
@return 文本
*/
static margeDynamicText(texts: [number, string | number][], player?: Player, trigger?: 
CommandTrigger): string;
}
/**
动画 显示对象
-- 支持绑定目标，可以区分动画层添加到目标层的上方或下方
-- 目标效果支持叠加
*
使用方法：
var a = new GCAnimation();
a.id = 5;
stage.addChild(a);
*
绑定目标,由于可以区分添加到目标层的上方或下方，需要有lowLayer和highLayer
var a = new GCAnimation();
a.id = 5;
a.addToGameSprite(target,lowLayer,highLayer);
*
相关事件
EventObject.LOADED 资源加载完成时候事件
GCAnimation.RENDER  动画播放时派发的事件


---

## 第 169 页

GCAnimation.PLAY_START 动画播放开始事件
GCAnimation.PLAY_STOP 动画停止时事件
GCAnimation.PLAY_COMPLETED 动画播放完成时事件
GCAnimation.SIGNAL 信号事件
*
关于鼠标事件点击区域：当注册了鼠标事件后，系统会根据当前帧的实际子显示对象自动判断鼠标
可响应区域
*
Created by 黑暗之神KDS、feng on 2019-02-22 11:36:06.
*/
declare class GCAnimation extends GameSprite {
/**
事件：执行 onRender 时派发的事件
var ani = new GCAnimation();
ani.id = 1;
ani.on(GCAnimation.RENDER,this,()=>{
// to do
});
*/
static RENDER: string;
/**
事件：动画播放开始事件
var ani = new GCAnimation();
ani.id = 1;
ani.on(GCAnimation.PLAY_START,this,()=>{
// to do
});
*/
static PLAY_START: string;
/**
事件：动画停止时事件
var ani = new GCAnimation();
ani.id = 1;
ani.on(GCAnimation.PLAY_STOP,this,()=>{
// to do


---

## 第 170 页

});
*/
static PLAY_STOP: string;
/**
事件：动画播放完成事件，非循环播放的动画播放完毕后派发
var ani = new GCAnimation();
ani.id = 1;
ani.on(GCAnimation.PLAY_COMPLETED,this,()=>{
// to do
});
*/
static PLAY_COMPLETED: string;
/**
事件：信号事件
动画编辑器中可以自定义信号，设定经过哪个关键帧后抛出
var ani = new GCAnimation();
ani.id = 1;
ani.on(GCAnimation.SIGNAL,this,(signalID:number)=>{
// to do
});
*/
static SIGNAL: string;
/**
动画ID
*/
id: number;
/**
是否同步加载，当资源存在时，当前帧则立刻显示
为了确保能够监听到EventObject.LOADED事件，建议在设置id之前监听该事件
*/
syncLoadWhenAssetExist: boolean;
/**
预渲染：开启此项保证在派发EventObject.LOADED前预先渲染一次以便保证此后能够立即呈
现画面，不会因为资源较大而首次渲染卡顿一下


---

## 第 171 页

预渲染会消耗一定的性能，可以选择在动画资源较大较多的情况下使用此项，开启此项会有额
外的性能和内存开销
 */
prerender: boolean;
/**
频率，默认值=Config.ANIMATION_FPS
*/
fps: number;
/**
禁音模式：播放该动画时忽略音效的播放 默认值=false
*/
silentMode: boolean;
/**
绑定场景对象，会根据该对象与镜头中心点的距离影响声音更大
*/
sceneObject: ClientSceneObject;
/**
水平偏移量，如果存在的话则水平偏移offsetX像素
*/
offsetX: number;
/**
垂直偏移量，如果存在的话则水平偏移offsetY像素
*/
offsetY: number;
/**
预设层：比目标层更低的层次
*/
preAnimationLowLayers: GameSprite[];
/**
预设层：比目标层更高的层次
*/
preAnimationHighLayers: GameSprite[];
/**
是否显示命中效果：编辑器中允许对动画层勾选“仅命中时显示”，开启此项将显示包含仅在命
中时出现的动画层
在播放动画前设置此项
*/
showHitEffect: boolean;
/**
当前帧：获取和设置当前帧
*/
currentFrame: number;
/**
当前播放的动画是否循环 默认值=false
*/
loop: boolean;
/**


---

## 第 172 页

是否正在播放中
*/
get isPlaying(): boolean;
/**
获取是否处于加载中
*/
get isLoading(): boolean;
/**
目标对象：动画的目标效果的作用目标。
如果需要一部分动画层在目标下方，一部分动画层在目标上方，则可以使用 
addToGameSprite 方法
*/
target: GameSprite;
/**
动画总帧数
*/
get totalFrame(): number;
/**
是否是粒子动画
*/
get isParticle(): boolean;
/**
辅助体
*/
get refObjs(): {
}
/**
添加到显示对象，同时可以将一部分动画层在目标下方显示，一部分动画层在目标上方显示，
并支持目标效果
@param target 目标对象
@param lowLayer 动画底层（动画编辑器中低于目标层的显示层次会添加到这里）
@param highLayer 动画高层（动画编辑器中高于目标层的显示层次会添加到这里）
*/
addToGameSprite(target: GameSprite, lowLayer: Sprite, highLayer: Sprite): void;
/**
移除动画绑定，addToGameSprite后可使用该函数进行清理
*/
removeFromGameSprite(): void;
/**
跳转某帧进行播放，越界会自动取模（如帧长度10，播放13则是播放3）
@frame [可选] 默认值=1 跳转到指定的帧数 单位：帧 默认从头开始
*/
gotoAndPlay(frame?: number): void;
/**


---

## 第 173 页

在当前帧数开始播放
*/
play(): void;
/**
停止动画
@param frame [可选] 默认值=1 帧动画的情况指定停留的帧数
*/
stop(frame?: number): void;
}
/**
数组工具类
GC内部封装的一些常用数组方法
Created by 黑暗之神KDS on 2018-01-01 03:47:27.
*/
declare class ArrayUtils {
/**
数组内随机打乱排序
@param arr 数组
*/
static randOrder(arr: any[]): void;
/**
添加数据
@param arr 数据组
@param index 索引 -1=加入到数组尾端
@param arg 添加的数据
*/
static insert(arr: any[], index: number, ...arg: any[]): number;
/**
删除数据
@param arr 数据组
@param index 索引 -1=删除尾端数据
@return [any] 被删除的数据对象
*/
static delete(arr: any[], index: number): any;
/**
移除数据，返回新的数组
@param arr 数据组
@param obj 数据对象
@return [any]
*/
static remove(arr: any[], obj: any): any;
/**
剔除相同的元素，根据子元素属性是否相同，返回新的数组


---

## 第 174 页

@param arr 原数组
@param attrName 属性名称
@param ifNullIgnore 是否如果属性为null时不会移除
@return [any] 新数组
*/
static removeSameObjectD2(arr: any[], attrName: string, ifNullIgnore: boolean): any[];
/**
获取数据
@param arr 数据组
@param index 索引 -1=尾端数据
@return [any]
*/
static get(arr: any[], index: number): any;
/**
更改数据中的值
@param arr 数据组
@param index 索引
@param paramValue 参数和值Object
@param 实际被更改的对象数组
*/
static set(arr: any[], index: number, paramValue: any): any[];
/**
插入数据 找到空值或添加
@param arr 数组
@param obj 要插入的对象
@return [number] 插入到的索引
*/
static insertToNullPosition(arr: any[], obj: any): number;
/**
找到一个空的位置
@param arr 数组
@param startIndex [可选] 默认值=0 索引
@return [number] 找到空位置索引
*/
static getNullPosition(arr: any[], startIndex?: number): number;
/**
剔除相同的元素
@param arr 原数组
@return [any] 新数组
*/
static removeSameObject(arr: any[]): any[];
/**


---

## 第 175 页

匹配数据，如在一组对象的数据中，筛选出对象中含有的某些属性值为多少的对象集合
使用示例：
var arr = [{a:6},{a:7},{a:8},{a:6}];
var m = ArrayUtils.matchAttributes(arr,{a:6},false); // 返回组中有两个结果 
[{a:6},{a:6}]
var m = ArrayUtils.matchAttributes(arr,{a:6},false,">"); // 返回组中有两个结果 
[{a:7},{a:8}]
var m = ArrayUtils.matchAttributes(arr,{a:6},false,"==",true); // 返回组中两
个结果,相对于原数组的索引 [0,3]
var m = ArrayUtils.matchAttributes(arr,{a:6},true); // 返回组中有1个结果 
[{a:6}]
@param arr 数组
@param matchObj 参数
@param onlyOne 是否只匹配一个数据
@param symbol [可选] 默认值="==" 对比符号
@param indexOfMode [可选] 默认值=false 返回匹配的索引而非返回匹配的对象
@return [any] 如果是indexOfMode则返回 number[]，否则返回arr同类型的数据
*/
static matchAttributes(arr: any, matchData: any, onlyOne: boolean, symbol?: string, 
indexOfMode?: boolean): any[];
/**
匹配数据 深度2，用于匹配对象中的对象是否含有该属性
使用示例：
var arr = [{a:{b:2}},{a:{b:3},{a:{b:5}},{a:{b:7}}];
var m = ArrayUtils.matchAttributesD2(arr,"a",{b:2},false); // 返回 [{a:
{b:2}}]
@param arr 数组
@param attribute 属性
@param matchObj 参数
@param onlyOne 是否只匹配一个数据
@param symbol [可选] 默认值="==" 对比符号
@return [any]
*/
static matchAttributesD2(arr: any, attribute: string, matchData: any, onlyOne: boolean, 
symbol?: string): any[];
/**
匹配数据 深度3


---

## 第 176 页

@param arr 数组
@param attribute 属性
@param attribute2 属性2
@param matchObj 参数
@param onlyOne 是否只匹配一个数据
@param symbol [可选] 默认值="==" 对比符号
@return [any]
*/
static matchAttributesD3(arr: any, attribute: string, attribute2: string, matchData: any, 
onlyOne: boolean, symbol?: string): any[];
/**
获取对象/数组内对象的指定属性的值组成一个新的数组
@param arr 原对象/数组
@param attributeName 原数组内对象的指定属性名
@param ignoreNullChild [可选] 默认值=true 是否忽略掉在arr中为NULL的子对象，以便不
会加入到新的数组中
@return [any]
*/
static getChildAttributeToCreateArray(arr: any, attributeName: string, ignoreNullChild?: 
boolean): any[];
/**
获取数组中元素出现的个数
@param arr 数组
@param value 元素
@return [number] 出现的个数
*/
static getElementSize(arr: any[], value: any): number;
/**
批量装载创建对象
@param objCls 对象类
@param size 数目
@param obj
@param arr [可选] 默认值=null 装载至的数组，设置则以该数组为装载对象
@return [any]
*/
static createObjects(objCls: any, size: number, onCreateOne?: (index: number, obj: any) 
=> void, arr?: any[]): any[];
/**
互换数组中的位置
@param arr 数组
@param index1 位置1


---

## 第 177 页

@param index2 位置2
*/
static swap(arr: any[], index1: number, index2: number): void;
/**
调整数组中元素位置
@param arr 数组
@param element 元素
@param index 位置
*/
static setIndex(arr: any[], element: any, index: number): void;
/**
按照asc排序（忽略大小写）
@param arr 数组
@param attributeName 属性的名称
@param isAsc 是否正序排序
*/
static sort(arr: any[], attributeName: string, isAsc: boolean): void;
/**
比较，列出B数组相对于A数组中不同的元素
@param aArr A数组
@param bArr B数组
@param appended 增加的元素列表
@param subtract 减少的元素列表
*/
static compare(aArr: any[], bArr: any[]): {
appended: any[];
subtract: any[];
};
/**
获取树型结构下全部节点中的子节点列表（含自身节点）
@param reeNode 树型结构节点
@param childrenAttr [可选] 默认值="children" 如 “children”
@param arrayList [可选] 默认值=null 装载数据的数组
@param checkIsOpen [可选] 默认值=false 是否需要检查开启状态，如果检查的话则未开启
的数据不计入返回列表中
@param isOpenAttr [可选] 默认值="isOpen" 开启状态属性名
@param ignoreChildrenCondition [可选] 默认值=null 忽略子对象的条件 如 
ignoreChildrenCondition(treeNode: any){return treeNode.ignoreChildren;}
*/
static getTreeNodeArray(treeNode: any, childrenAttr?: string, arrayList?: any[], 
checkIsOpen?: boolean, isOpenAttr?: string, ignoreChildrenCondition?: Callback): any[];
}
/**


---

## 第 178 页

资源管理器
采用引用计数方式缓存资源，一旦引用计数为0时则会自动释放实际的资源
基础资源包含：Image资源、Audio资源、JSON资源、Text资源、ArrayBuffer资源
*
 *【系统规则】
-- 高级显示对象包含多种基础资源，在创建这些高级显示对象会根据内部关联到基础资源自动增加
引用，而释放对象时会减少引用，高级显示对象包含：
-- Avatar/StandAvatar 行走图/立绘
-- GCAnimation 动画
-- ClientScene 客户端场景
-- ClientSceneObject 客户端场景对象
-- UIxxx 各种界面组件（包括整体界面 GUI_XXX）
-- 由项目层自行增加的高级显示对象等等
 *
-- 预加载高级资源，如果未设置自动释放的话，需要手动释放，否则会一直引用这些资源导致无法
被自动释放。
根据编辑器预设的配置进行载入相关的基础资源，而卸载也是根据编辑器预设的配置进行卸载相关
的基础资源（与实际用到的场景动态更换了内部的资源无关）。
主要用于预占用资源，以便在此期间不会被系统自动释放掉，比如设计在进入游戏场景前预载入一
些资源，到进入下一个场景前再释放，以便在该场景内不会被系统自动释放掉
预加载接口包含--预加载高级资源（每个高级资源包含若干的基础资源）：自行加载的需要自行卸
载
-- 预加载场景 preLoadSceneAsset                 ==> 卸载场景 disposeScene
-- 预加载场景对象 preLoadSceneObjectAsset       ==> 卸载场景对象 disposeSceneObject
-- 预加载行走图资源 preLoadAvatarAsset          ==> 卸载行走图资源 disposeAvatarAsset
-- 预加载立绘资源 preLoadStandAvatarAsset       ==> 卸载立绘资源 disposeStandAvatarAsset
-- 预加载动画资源 preLoadAnimationAsset         ==> 卸载动画资源 disposeAnimationAsset
-- 预加载界面资源 preLoadUIAsset                ==> 卸载界面资源 disposeUIAsset
-- 预加载对话框资源 preLoadDialog               ==> 卸载对话框资源 disposeDialog
-- 预加载事件页中涉及的资源 preLoadCommandPage   ==> 卸载事件页中涉及的资源 
disposeCommandPage
 *
-- 预加载接口包含--预加载基础资源：自行加载的需要自行卸载
-- 加载图片（解析为Object） loadImage                     ==> 释放图片 disposeImage
-- 加载Json文件（解析为Object） loadJson                  ==> 释放Json文件 disposeJson
-- 加载文本文件（解析为字符串） loadText                   ==> 释放文本文件 disposeText
-- 加载原始文件（解析为ArrayBuffer） loadFileArrayBuffer  ==> 释放原始文件 
disposeFileArrayBuffer
-- 加载音频 loadAudio                                   ==> 卸载音频 disposeAudio
 *
-- 图像系统中使用到的资源


---

## 第 179 页

-- 「显示图片/动画/立绘」：通道被覆盖时上一个占用通道的资源会被释放（减少引用），新资源
会增加引用，如显示3号动画在1号通道里，然后再显示2号立绘在1号通道里，此前的3号动画就会
被释放
为了防止常用的图片显示等效果被中途系统自动将图片卸载了，可以预加载这些图片先占用引用。
比如场景相关事件可勾选场景的“预加载事件页中涉及的资源”，以保证在该场景中执行这些图片效
果中途不会被系统卸载，同时切换场景后会自动释放掉这些资源
（如果新场景仍然用到了这些资源又会再次被引用到而导致不会被系统卸载）。
-- 「消除」：将当前指定通道的资源释放掉，比如当前使用了3号动画，则3号动画引用减1，如果
全局没有任何用到了3号动画时（此时引用为0）则会被系统实际回收，
下次未预加载就直接使用时可能会由于动态加载该资源导致一小段时间未能显示出来（因为处于加
载中，需要一点时间）。
 *
-- 对话框中使用到的头像资源
-- 在每次对话启动时会创建头像资源（引用+1），然后停止对话时会释放掉头像资源（引用-1），
此时如果全局未有任何引用的话会被系统实际回收，
若不想在某段期间内被系统实际回收，可以提前预加载这些头像资源。
 *
【总结】
-- 自行创建的对象需要自行销毁（gameObject.dispose）
-- 自行预加载的资源需要自行销毁（AssetManager.disposeXXX）
 *
【示例1：自行创建的高级对象，自行销毁】
// 创建一个3号行走图实例，系统识别为引用了3号行走图相关的一些基础资源（引用+1）
var a = new Avatar;
a.id = 3;
// 释放掉这个实例，只有调用释放后这些被增加引用的基础资源才会减少引用，以便让系统自动回
收资源（引用-1）
a.dispose();
 *
// 创建2号界面
var b = new GUI_2;
// 卸载2号界面
b.dispose();
 *
【示例2：预加载资源，在一定期间内不会被系统释放，当使用完毕后再手动卸载】
// 预加载3号行走图（引用+1） 此时3号行走图的引用=1
AssetManager.preLoadAvatarAsset(3, Callback.New(()=>{
// 使用行走图（引用+1） 此时3号行走图的引用=2
var a = new Avatar;
a.id = 3;
// 60秒后


---

## 第 180 页

setTimeout(()=>{
// 卸载行走图（引用-1） 此时3号行走图的引用=1
a.dispose();
// 卸载掉预加载的3号行走图占用（引用-1） 此时3号行走图的引用=0 系统会自动回收
AssetManager.disposeAvatarAsset(3);
},60*1000);
}));
 *
 *
 *
Created by 黑暗之神KDS on 2018-08-08 16:28:46.
*/
declare class AssetManager {
/**
全部资源引用计数 url(资源地址):引用计数 默认值={}
*/
static assetCountMap: {
};
/**
释放资源的间隔ms（当引用计数为0时会延迟清理资源，因为最近可能还会频繁用到） 默认
值=6000ms（60秒）
*/
static disposeInterval: number;
/**
预加载加载场景资源，如果autoDispose为false的话则需要手动卸载：
AssetManager::disposeScene
-- 场景的相关JSON文件
-- 如勾选预载地图资源：预载入地图资源：图层的图片、图块的图片、BGM、BGS
-- 如勾选预载全场景对象资源：预载入全场景对象资源（仅单机版可用）
-- 如勾选预载场景事件涉及的资源：预载入场景触发的事件页中的资源 参考 
preLoadCommandPage 方法（仅单机版可用）
-- 预设的自定义预加载资源列表
@param id 场景ID
@param complete [可选] 默认值=null
@param syncCallbackWhenAssetExist [可选] 默认值=false 当资源存在时同步回调，否则需
要等待一帧（异步回调）
@param autoDispose [可选] 默认值=false 是否自动释放资源（加载后会在延迟一段时间后
自动释放，用于减少引用计数）
@param prerender [可选] 默认值=false 是否预渲染图片资源，保证完成回调后使用时不会因
为渲染而卡顿，一般资源较大时可以尝试开启此项，开启此项会有额外的性能和内存开销
*/
static preLoadSceneAsset(id: number, complete?: Callback, 
syncCallbackWhenAssetExist?: boolean, autoDispose?: boolean, prerender?: boolean): 


---

## 第 181 页

void;
/**
预加载场景对象资源，如果autoDispose为false的话则需要手动卸载：
AssetManager::disposeSceneObject
-- 根据自定义显示对象层（行走图、界面、动画）来加载其下所有资源
@param so 场景对象数据
@param complete [可选] 默认值=null
@param syncCallbackWhenAssetExist [可选] 默认值=false 当资源存在时同步回调，否则需
要等待一帧（异步回调）
@param autoDispose [可选] 默认值=false 是否自动释放资源（加载后会在延迟一段时间后
自动释放，用于减少引用计数）
@param prerender [可选] 默认值=false 是否预渲染图片资源，保证完成回调后使用时不会因
为渲染而卡顿，一般资源较大时可以尝试开启此项，开启此项会有额外的性能和内存开销
*/
static preLoadSceneObjectAsset(so: SceneObject, complete?: Callback, 
syncCallbackWhenAssetExist?: boolean, autoDispose?: boolean, prerender?: boolean): 
void;
/**
预加载行走图数据，如果autoDispose为false的话则需要手动卸载： 
AssetManager::disposeAvatarAsset
@param id 行走图ID
@param complete [可选] 默认值=null
@param syncCallbackWhenAssetExist [可选] 默认值=false 当资源存在时同步回调，否则需
要等待一帧（异步回调）
@param autoDispose [可选] 默认值=true 是否自动释放资源（加载后会在延迟一段时间后自
动释放，用于减少引用计数）
@param isStandAvatar [可选] 默认值=false 是否是立绘资源
@param prerender [可选] 默认值=false 是否预渲染图片资源，保证完成回调后使用时不会因
为渲染而卡顿，一般资源较大时可以尝试开启此项，开启此项会有额外的性能和内存开销
*/
static preLoadAvatarAsset(id: number, complete?: Callback, 
syncCallbackWhenAssetExist?: boolean, autoDispose?: boolean, prerender?: boolean): 
void;
/**
预加载立绘数据，如果autoDispose为false的话则需要手动卸载： 
AssetManager::disposeStandAvatarAsset
@param id 立绘资源ID
@param complete [可选] 默认值=null
@param syncCallbackWhenAssetExist [可选] 默认值=false 当资源存在时同步回调，否则需
要等待一帧（异步回调）
@param autoDispose [可选] 默认值=false 是否自动释放资源（加载后会在延迟一段时间后
自动释放，用于减少引用计数）


---

## 第 182 页

@param prerender [可选] 默认值=false 是否预渲染图片资源，保证完成回调后使用时不会因
为渲染而卡顿，一般资源较大时可以尝试开启此项，开启此项会有额外的性能和内存开销
*/
static preLoadStandAvatarAsset(id: number, complete?: Callback, 
syncCallbackWhenAssetExist?: boolean, autoDispose?: boolean, prerender?: boolean): 
void;
/**
预加载界面，如果autoDispose为false的话则需要手动卸载：
AssetManager::disposeUIAsset
@param id 界面ID
@param complete [可选] 默认值=null
@param syncCallbackWhenAssetExist [可选] 默认值=false 当资源存在时同步回调，否则需
要等待一帧（异步回调）
@param autoDispose [可选] 默认值=false 是否自动释放资源（加载后会在延迟一段时间后
自动释放，用于减少引用计数）
@param prerender [可选] 默认值=false 是否预渲染图片资源，保证完成回调后使用时不会因
为渲染而卡顿，一般资源较大时可以尝试开启此项，开启此项会有额外的性能和内存开销
*/
static preLoadUIAsset(id: number, complete?: Callback, syncCallbackWhenAssetExist?: 
boolean, autoDispose?: boolean, prerender?: boolean): void;
/**
预加载动画，如果autoDispose为false的话则需要手动卸载：
AssetManager::disposeAnimationAsset
@param id 动画ID
@param complete [可选] 默认值=null
@param syncCallbackWhenAssetExist [可选] 默认值=false 当资源存在时同步回调，否则需
要等待一帧（异步回调）
@param autoDispose [可选] 默认值=false 是否自动释放资源（加载后会在延迟一段时间后
自动释放，用于减少引用计数）
@param prerender [可选] 默认值=false 是否预渲染图片资源，保证完成回调后使用时不会因
为渲染而卡顿，一般资源较大时可以尝试开启此项，开启此项会有额外的性能和内存开销
*/
static preLoadAnimationAsset(id: number, complete?: Callback, 
syncCallbackWhenAssetExist?: boolean, autoDispose?: boolean, prerender?: boolean): 
void;
/**
预加载事件页中包含的资源，如果autoDispose为false的话则需要手动卸载：
AssetManager::disposeCommandPage
（目前仅单机版可用，网络版事件是在服务端执行的，客户端无法获取事件的数据）
（仅支持系统内核的事件，如果有需要加载到自定义指令中的资源支持重写来扩展该方法）
-- 对话和选项事件：带有的对话框样式和头像资源
-- 设置对象行为事件：行走图资源
-- 图像系统事件：图片、动画、界面、立绘、音效、对话框样式
-- 音频事件：BGM-背景音乐、BGS-环境音效、SE-音效


---

## 第 183 页

-- 界面事件: 界面
-- 自定义事件：需要项目层自行追加相关逻辑，比如可以重写此方法以追加逻辑
*
@param commandPage 事件页数据
@param complete [可选] 默认值=null 完成时回调
@param syncCallbackWhenAssetExist [可选] 默认值=false 当资源存在时同步回调，否则需
要等待一帧（异步回调）
@param autoDispose [可选] 默认值=false 是否自动释放资源（加载后会在延迟一段时间后
自动释放，用于减少引用计数）
*/
static preLoadCommandPage(commandPage: CommandPage, complete?: Callback, 
syncCallbackWhenAssetExist?: boolean, autoDispose?: boolean): void;
/**
预加载对话框样式的相关资源，如果autoDispose为false的话则需要手动卸载：
AssetManager::disposeDialog
@param id 对话框样式ID
@param complete [可选] 默认值=null 完成时回调
@param syncCallbackWhenAssetExist [可选] 默认值=false 当资源存在时同步回调，否则需
要等待一帧（异步回调）
@param autoDispose [可选] 默认值=false 是否自动释放资源（加载后会在延迟一段时间后
自动释放，用于减少引用计数）
*/
static preLoadDialog(id: number, complete?: Callback, syncCallbackWhenAssetExist?: 
boolean, autoDispose?: boolean): void;
/**
预加载所有在编辑器中预设的字体（来自设置中的「文件字体导入管理」）
@param complete [可选] 默认值=null 加载完成回调
@param syncCallbackWhenAssetExist [可选] 默认值=false 当资源存在时同步回调，否则需
要等待一帧（异步回调）
*/
static preloadFonts(complete?: Callback, syncCallbackWhenAssetExist?: boolean): void;
/**
预加载指定的字体文件
@param fontUrl 如 asset/xxx.ttf
@param complete [可选] 默认值=null 加载完成回调
@param syncCallbackWhenAssetExist [可选] 默认值=false 当资源存在时同步回调，否则需
要等待一帧（异步回调）
*/
static preloadFont(fontUrl: string, complete?: Callback, syncCallbackWhenAssetExist?: 
boolean): void;
/**
批量加载高级资源
@param onFin 当加载完成时回调


---

## 第 184 页

@param onProgress [可选] 默认值=null 加载进度回调 
onProgress(current:number,count:number); 当前加载数,加载总数
@param images [可选] 默认值=[] 需要加载的图片路径集
@param scenes [可选] 默认值=[] 需要加载的场景ID集
@param avatars [可选] 默认值=[] 需要加载的行走图ID集
@param standAvatars [可选] 默认值=[] 需要加载的立绘ID集
@param animations [可选] 默认值=[] 需要加载的动画ID集
@param uis  [可选] 默认值=[] 需要加载的UI集
@param jsons [可选] 默认值=[] 需要加载的JSON集
@param audios [可选] 默认值=[] 需要加载的音频集
@param dialogs [可选] 默认值=[] 需要加载的对话框样式
@param syncCallbackWhenAssetExist [可选] 默认值=false 当资源存在时同步回调，否则需
要等待一帧（异步回调）
@param autoDispose [可选] 默认值=false 是否自动释放资源（加载后会在延迟一段时间后
自动释放，用于减少引用计数）
@param prerender [可选] 默认值=false 是否预渲染图片资源，保证完成回调后使用时不会因
为渲染而卡顿，一般资源较大时可以尝试开启此项
*/
static batchPreLoadAsset(onFin: Callback, onProgress: Callback, images: string[], scenes: 
number[], avatars: number[], standAvatars: number[], animations?: number[], uis?: 
number[], jsons?: string[], audios?: string[], dialogs?: number[], 
syncCallbackWhenAssetExist?: boolean, autoDispose?: boolean, prerender?: boolean): 
void;
/**
批量卸载高级资源
@param images [可选] 默认值=[] 需要卸载的图片路径集
@param scenes [可选] 默认值=[] 需要卸载的场景ID集
@param avatars [可选] 默认值=[] 需要卸载的行走图ID集
@param standAvatars [可选] 默认值=[] 需要卸载的立绘ID集
@param animations [可选] 默认值=[] 需要卸载的动画ID集
@param uis  [可选] 默认值=[] 需要卸载的界面集
@param jsons [可选] 默认值=[] 需要卸载的JSON集
@param audios [可选] 默认值=[] 需要加载的音频集
@param dialogs [可选] 默认值=[] 需要加载的对话框样式
*/
static batchDisposeAsset(images: string[], scenes: number[], avatars: number[], 
standAvatars: number[], animations?: number[], uis?: number[], jsons?: string[], audios?: 
string[], dialogs?: number[]): void;
/**
释放场景资源，每次调用此函数减少引用计数，当引用计数为0时会销毁实际的资源（请慎重
使用，一般情况下销毁对象即会自动销毁其关联的资源）


---

## 第 185 页

@param id 场景ID
*/
static disposeScene(id: number): void;
/**
释放场景对象资源，每次调用此函数减少引用计数，当引用计数为0时会销毁实际的资源（请
慎重使用，一般情况下销毁对象即会自动销毁其关联的资源）
@param so 场景对象数据
*/
static disposeSceneObject(so: SceneObject): void;
/**
释放行走图资源，每次调用此函数减少引用计数，当引用计数为0时会销毁实际的资源（请慎
重使用，一般情况下销毁对象即会自动销毁其关联的资源）
@param id 行走图ID
*/
static disposeAvatarAsset(id: number): void;
/**
释放立绘资源，每次调用此函数减少引用计数，当引用计数为0时会销毁实际的资源（请慎重
使用，一般情况下销毁对象即会自动销毁其关联的资源）
@param id 立绘ID
*/
static disposeStandAvatarAsset(id: number): void;
/**
释放界面，每次调用此函数减少引用计数，当引用计数为0时会销毁实际的资源（请慎重使
用，一般情况下销毁对象即会自动销毁其关联的资源）
@param id 界面ID
*/
static disposeUIAsset(id: number): void;
/**
释放动画，每次调用此函数减少引用计数，当引用计数为0时会销毁实际的资源（请慎重使
用，一般情况下销毁对象即会自动销毁其关联的资源）
@param id 动画ID
*/
static disposeAnimationAsset(id: number): void;
/**
释放由于预加载事件页加载的资源，每次调用此函数减少引用计数，当引用计数为0时会销毁
实际的资源（请慎重使用，一般情况下销毁对象即会自动销毁其关联的资源）
@param commandPage 事件页
*/
static disposeCommandPage(commandPage: CommandPage): void;
/**
预加载对话框样式的相关资源，每次调用此函数减少引用计数，当引用计数为0时会销毁实际
的资源（请慎重使用，一般情况下销毁对象即会自动销毁其关联的资源）
@param id 对话框样式ID
*/
static disposeDialog(id: number): void;
/**


---

## 第 186 页

加载图片
@param url 图片地址
@param complete [可选] 默认值=null 当完成时回调 complete(tex:Texture)
@param syncCallbackWhenAssetExist [可选] 默认值=false 当资源存在时同步回调，否则需
要等待一帧（异步回调）
@param useRef [可选] 默认值=true 是否使用引用计数，使用的话每次调用该函数都会增加
一次引用计数
@param prerender [可选] 默认值=false 是否预渲染图片资源，保证完成回调后使用时不会因
为渲染而卡顿，一般资源较大时可以尝试开启此项
*/
static loadImage(url: string, complete?: Callback, syncCallbackWhenAssetExist?: boolean, 
useRef?: boolean, prerender?: boolean): void;
/**
加载Texture粒子图片
@param url 图片地址
@param complete [可选] 默认值=null 当完成时回调 complete(tex:Texture)
@param syncCallbackWhenAssetExist [可选] 默认值=false 当资源存在时同步回调，否则需
要等待一帧（异步回调）
@param useRef [可选] 默认值=true 是否使用引用计数，使用的话每次调用该函数都会增加
一次引用计数
*/
static loadTexture(url: string, complete?: Callback, syncCallbackWhenAssetExist?: 
boolean, useRef?: boolean): void;
/**
加载图片集，忽略空地址，始终会返回加载完毕回调
@param urls 图片地址集
@param complete [可选] 默认值=null
@param syncCallbackWhenAssetExist [可选] 默认值=false 当资源存在时同步回调，否则需
要等待一帧（异步回调）
@param useRef [可选] 默认值=true 是否使用引用计数，使用的话每次调用该函数都会增加
一次引用计数
@param prerender [可选] 默认值=false 是否预渲染图片资源，保证完成回调后使用时不会因
为渲染而卡顿，一般资源较大时可以尝试开启此项
*/
static loadImages(urls: string[], complete?: Callback, syncCallbackWhenAssetExist?: 
boolean, useRef?: boolean, prerender?: boolean): void;
/**
加载Texture粒子图片集，忽略空地址，始终会返回加载完毕回调
@param urls 图片地址集
@param complete [可选] 默认值=null
@param syncCallbackWhenAssetExist [可选] 默认值=false 当资源存在时同步回调，否则需
要等待一帧（异步回调）


---

## 第 187 页

@param useRef [可选] 默认值=true 是否使用引用计数，使用的话每次调用该函数都会增加
一次引用计数
*/
static loadTextures(urls: string[], complete?: Callback, syncCallbackWhenAssetExist?: 
boolean, useRef?: boolean): void;
/**
加载音频文件支持格式 .mp3 .ogg
@param url 音频文件地址
@param complete [可选] 默认值=null 加载完成时回调
@param syncCallbackWhenAssetExist [可选] 默认值=false 当资源存在时同步回调，否则需
要等待一帧（异步回调）
@param useRef [可选] 默认值=true 是否使用引用计数，使用的话每次调用该函数都会增加
一次引用计数
*/
static loadAudio(url: string, complete?: Callback, syncCallbackWhenAssetExist?: boolean, 
useRef?: boolean): void;
/**
加载音频文件集，忽略空地址，始终会返回加载完毕回调
@param urls 音频文件集
@param complete [可选] 默认值=null
@param syncCallbackWhenAssetExist [可选] 默认值=false 当资源存在时同步回调，否则需
要等待一帧（异步回调）
@param useRef [可选] 默认值=true 是否使用引用计数，使用的话每次调用该函数都会增加
一次引用计数
*/
static loadAudios(urls: string[], complete?: Callback, syncCallbackWhenAssetExist?: 
boolean, useRef?: boolean): void;
/**
加载并解析JSON文件
@param url json文件地址
@param complete complete(jsonObj:any)
@param syncCallbackWhenAssetExist [可选] 默认值=false 当资源存在时同步回调，否则需
要等待一帧（异步回调）
@param useRef [可选] 默认值=true 是否使用引用计数，使用的话每次调用该函数都会增加
一次引用计数
*/
static loadJson(url: string, complete: Callback, syncCallbackWhenAssetExist?: boolean, 
useRef?: boolean): void;
/**
加载并解析JSON文件集，忽略空地址，始终会返回加载完毕回调
@param urls json文件地址集
@param complete [可选] 默认值=null
@param syncCallbackWhenAssetExist [可选] 默认值=false 当资源存在时同步回调，否则需
要等待一帧（异步回调）


---

## 第 188 页

@param useRef [可选] 默认值=true 是否使用引用计数，使用的话每次调用该函数都会增加
一次引用计数
*/
static loadJsons(urls: string[], complete: Callback, syncCallbackWhenAssetExist?: boolean, 
useRef?: boolean): void;
/**
加载Text文件
@param url 文件路径
@param complete
@param syncCallbackWhenAssetExist [可选] 默认值=false 当资源存在时同步回调，否则需
要等待一帧（异步回调）
@param useRef [可选] 默认值=true 是否使用引用计数，使用的话每次调用该函数都会增加
一次引用计数
*/
static loadText(url: string, complete: Callback, syncCallbackWhenAssetExist?: boolean, 
useRef?: boolean): void;
/**
加载Text文件集
@param urls 文件路径集
@param complete
@param syncCallbackWhenAssetExist [可选] 默认值=false 当资源存在时同步回调，否则需
要等待一帧（异步回调）
@param useRef [可选] 默认值=true 是否使用引用计数，使用的话每次调用该函数都会增加
一次引用计数
*/
static loadTexts(urls: string[], complete: Callback, syncCallbackWhenAssetExist?: boolean, 
useRef?: boolean): void;
/**
加载文件资源（二进制）
@param url 文件路径集
@param complete 加载完成时回调函数 complete(arrayBuffer:ArrayBuffer)
@param useRef [可选] 默认值=true 是否使用引用计数，使用的话每次调用该函数都会增加
一次引用计数
@param syncCallbackWhenAssetExist [可选] 默认值=true 当资源存在时同步回调，否则需
要等待一帧（异步回调）
*/
static loadFileArrayBuffer(url: string, complete: Callback, useRef?: boolean, 
syncCallbackWhenAssetExist?: boolean): void;
/**
获取贴图资源
@param url 图片地址


---

## 第 189 页

@return [Texture] 贴图资源，如果不存在则返回null
*/
static getImage(url: string): Texture;
/**
获取JSON资源
@param url JSON文件地址
@return [any] Object：如果不存在则返回null
*/
static getJson(url: string): any;
/**
获取文本资源
@param url 文本地址
@return [string] 文本：如果不存在则返回null
*/
static getText(url: string): string;
/**
获取文件资源（二进制）
@param url 文件地址
@return [ArrayBuffer] 如果不存在则返回null
*/
static getFileArrayBuffer(url: string): ArrayBuffer;
/**
卸载图片资源：当引用计数为0时会延迟后清理掉实际的所有资源以及其所有的切图资源（需
保证切图资源Graphics外部已没有引用）
@param url 图片文件地址
@param force [可选] 默认值=false 是否强制卸载，强制卸载则无视引用计数
*/
static disposeImage(url: string, force?: boolean): void;
/**
卸载图片资源集：当引用计数为0时会延迟后清理掉实际的所有资源以及其所有的切图资源
（需保证切图资源Graphics外部已没有引用）
@param urls 图片文件地址集合
@param force [可选] 默认值=false 是否强制卸载，强制卸载则无视引用计数
*/
static disposeImages(urls: string[], force?: boolean): void;
/**
卸载音频资源，当引用计数为0时会延迟后清理掉实际的所有资源
@param url 音频文件地址
@param force [可选] 默认值=false 是否强制卸载，强制卸载则无视引用计数
*/
static disposeAudio(url: string, force?: boolean): void;
/**
卸载JSON资源，当引用计数为0时会延迟后清理掉实际的所有资源
@param url json文件地址


---

## 第 190 页

@param force [可选] 默认值=false 是否强制卸载，强制卸载则无视引用计数
*/
static disposeJson(url: string, force?: boolean): void;
/**
卸载文本资源，当引用计数为0时会延迟后清理掉实际的所有资源
@param url 文本文件地址
@param force [可选] 默认值=false 是否强制卸载，强制卸载则无视引用计数
*/
static disposeText(url: string, force?: boolean): void;
/**
卸载文件资源（二进制）
@param url 文件路径集
@param force [可选] 默认值=false 是否强制卸载，强制卸载则无视引用计数
*/
static disposeFileArrayBuffer(url: string, force?: boolean): void;
/**
根据图片地址获取切片的贴图资源：整图资源必须已载入，当没有对应的切图时会临时切一次
@param url 贴图地址
@param x 显示的偏移值x
@param y 显示的偏移值y
@param rect 对纹理的取样 偏移和宽高
*/
static getClipImage(url: string, x: number, y: number, rect: Rectangle): Graphics;
/**
将显示对象截图为贴图资源使用（显存），贴图尺寸受限于实际的画面尺寸
@param source 源，Sprite或Graphics均可
@param textureWidth 贴图宽度
@param textureHeight 贴图高度
@param offsetX source相对于画布的偏移X
@param offsetY source相对于画布的偏移Y
@param mipmap [可选] 默认值=false 是否使用mipmap（即根据贴图缩放大小来找到对应的
mimap层混合，以解决缩放后贴图抖动的问题）
@param minFifter [可选] 默认值=0x2600 显示缩小的贴图时的采样方式 0x2600=邻近采样 
0x2601=线性采样
@param magFifter [可选] 默认值=0x2600 显示放大的贴图时的采样方式 0x2600=邻近采样 
0x2601=线性采样
@return [Texture]
*/
static drawToTexture(source: any, textureWidth: number, textureHeight: number, 
offsetX?: number, offsetY?: number, mipmap?: boolean, minFifter?: number, magFifter?: 
number): Texture;
/**


---

## 第 191 页

以拼合图的形式绘制到容器中（由于设备限制贴图大小而需要拼合）需要调用
disposeAtlasSprite来主动释放这些显存上的贴图
@param source 源，Sprite或Graphics均可
@param width 需要截取的宽度
@param height 需要截取的高度
@param mipmap [可选] 默认值=false 是否使用mipmap（即根据贴图缩放大小来找到对应的
mimap层混合，以解决缩放后贴图抖动的问题）
@param minFifter [可选] 默认值=0x2600 显示缩小的贴图时的采样方式 0x2600=邻近采样 
0x2601=线性采样
@param magFifter [可选] 默认值=0x2600 显示放大的贴图时的采样方式 0x2600=邻近采样 
0x2601=线性采样
@param offsetX source相对于画布的偏移X
@param offsetY source相对于画布的偏移Y
@return [Sprite]
*/
static drawToAtlasSprite(source: any, width: number, height: number, mipmap?: 
boolean, minFifter?: number, magFifter?: number, offsetX?: number, offsetY?: number): 
Sprite;
/**
大贴图转化为拼图显示对象，以解决大贴图超出显卡最大支持的贴图尺寸
（os.MAX_TEXTURE_SIZE）时无法显示的问题
@param texture 贴图资源
@param xLoop [可选] 默认值=false x循环
@param yLoop [可选] 默认值=false y循环
@param mapWidth [可选] 默认值=0 拼图宽度
@param mapHeight [可选] 默认值=0 拼图高度
@return [Sprite] 贴图显示对象
*/
static bigTextureToAtlasSprite(texture: Texture, xLoop?: boolean, yLoop?: boolean, 
mapWidth?: number, mapHeight?: number): Sprite;
/**
释放拼合的贴图，即由drawToAtlasSprite生成的拼合图显示对象
@param root 拼合图显示对象
*/
static disposeAtlasSprite(root: Sprite): void;
/**
预渲染
如果显示对象包含的资源较多，首次渲染可能造成卡顿，为了让渲染前不至于卡顿，可以在加
载之类的地方去预渲染一下。
@param 显示对象源 Graphics | Sprite
*/
static prerender(source: any): void;
/**


---

## 第 192 页

贴图转为base64格式
@param texture 贴图
@return [string] base64字符串
*/
static textureToBase64(texture: Texture): string;
/**
贴图转为ArrayBuffer格式
@param texture 贴图
@return [ArrayBuffer] ArrayBuffer字节数组
*/
static textureToArrayBuffer(texture: Texture): ArrayBuffer;
/**
ArrayBuffer转为贴图
@param arrayBuffer ArrayBuffer字节数组
@param onFin 当完成时回调 onFin(tex:Texture)
@return [Texture] 贴图
*/
static arrayBufferToTexture(arrayBuffer: ArrayBuffer, onFin: Callback): void;
/**
ArrayBuffer转为Base64
@param arrayBuffer ArrayBuffer字节数组
@return [string] base64字符串
*/
static arrayBufferToBase64(arrayBuffer: ArrayBuffer): string;
/**
ArrayBuffer转为贴图
@param arrayBuffer ArrayBuffer字节数组
@param onFin 当完成时回调 onFin(tex:Texture)
@return [Texture] 贴图
*/
static base64ToTexture(base64: string, onFin: Callback): void;
/**
ArrayBuffer转为Base64
@param arrayBuffer ArrayBuffer字节数组
@return [string] base64字符串
*/
static base64ToArrayBuffer(base64: string): ArrayBuffer;
}
/**
异步任务工具类
多个任务同时进行，需要等待全部任务执行完毕后才回调
使用方式：


---

## 第 193 页

var task = new AsynTask(Callback.New(() => {
// 全部任务结束时的逻辑处理
}, this));
task.execute(任意表达式); // 如 task.execute(1);
task.execute(任意表达式);
task.complete(); // 上面执行了两个任务，下方则需要完成两次complete则算完成
task.complete();
Created by 黑暗之神KDS on 2018-01-01 03:47:27.
*/
declare class AsynTask {
/**
任务总数
*/
length: number;
/**
当前执行的任务数
*/
currentCount: number;
/**
异步 构造函数
@param onFin 回调方法
@param thisPtr 作用域
*/
constructor(onFin: Callback);
/**
执行
@param code 直接执行代码即可，这里只是追加计数
*/
execute(code: any): void;
/**
完成时回调
*/
complete(): void;
}
/**
自动元件数据
Created by 黑暗之神KDS on 2020-06-08 13:36:16.
*/
declare class AutoTileData {
/**
图片路径
*/
url: string;
/**


---

## 第 194 页

数据层数据-由于自动元件仅视为一格 默认值=[]
[dataGridIndex] = 1/0 
*/
dataLayers: number[];
/**
规格模式
0-GCAT1的规格
*/
GCATMode: number;
/**
运行时使用，获取图块数据
@param texID 自动元件的编号（1~N）
*/
static getAutoTileData(texID: number): AutoTileData;
}
/**
行走图显示对象
通过动作、部位、方向、帧来显示当前的图像
-- 支持的方向：1方向、2方向、3方向、4方向、5方向、8方向，其中1、3、5方向素材会自动水平
翻转以便节约素材使用
-- 支持辅助体，以便项目层可视化制作动画击中点、不同方向弹道发射点等辅助用的数据
-- 支持换部件（换装）
-- 支持的通用事件：EventObject.LOADED
-- 方向系统参考小键盘以5为中心面向其他数字的方向： 1-左下 2-下 3-右下 4-左 6-右 7-左上 8-上 
9-右上
7 8 9
4 5 6
1 2 3
 *
使用方式：
var a = new Avatar();
a.id = 5;
*
相关事件
EventObject.LOADED 资源加载完成时候事件
Avatar.ACTION_PLAY_COMPLETED 动作播放完毕时
Avatar.CHANGE_ACTION 更改动作时 参数1：更改前的动作ID  参数2：更改后的动作ID
Avatar.RENDER 当确实到达了新的一帧后派发，本体如果没有实际的帧则不派发
*


---

## 第 195 页

Created by 黑暗之神KDS on 2018-12-06 01:05:11.
*/
declare class Avatar extends GameSprite {
/**
事件：动作播放完毕事件，每当该动作播放完一次则抛出此事件，只有最后一帧确实按照帧率
播放完毕了才抛出事件
var a = new Avatar();
a.id = 5;
a.on(Avatar.ACTION_PLAY_COMPLETED,this,()=>{
// to do
});
*/
static ACTION_PLAY_COMPLETED: string;
/**
事件：每当更换动作时派发
onChangeAction(lastActID:number,nowActID:number); lastActID=更改前的动作ID 
nowActID=更改后的动作ID
var a = new Avatar();
a.id = 5;
a.on(Avatar.CHANGE_ACTION,this,(lastActID:number,nowActID:number)=>{
// to do
});
a.actionID = 2;
*/
static CHANGE_ACTION: string;
/**
事件：执行 onRender 时派发，当到达了新的一帧后派发该事件
var a = new Avatar();
a.id = 5;
a.on(Avatar.RENDER,this,()=>{
// to do
});
*/
static RENDER: string;
/**


---

## 第 196 页

AVATAR唯一ID，对应编辑器中的预设制作数据ID，设置后当资源载入完毕后会抛出
EventObject.LOADED
var a = new Avatar();
a.on(EventObject.LOADED,this,()=>{
// to do
});
a.id = 5;
*/
id: number;
/**
同步加载，当资源存在时，当前帧则立刻显示，默认为true
为了确保能够监听到EventObject.LOADED事件，建议在设置id之前监听该事件
*/
syncLoadWhenAssetExist: boolean;
/**
预渲染：开启此项保证在派发EventObject.LOADED前预先渲染一次以便保证此后能够立即呈
现画面，不会因为资源较大而首次渲染卡顿一下
预渲染会消耗一定的性能，可以选择在行走图资源较大较多的情况下使用此项，开启此项会有
额外的性能和内存开销
 */
prerender: boolean;
/**
方向模式 1 2 3 4 5 8 其中1、3、5会自动镜像翻转，来自编辑器中预设
*/
get oriMode(): number;
/**
获取是否处于播放中
*/
get isPlaying(): boolean;
/**
获取是否处于加载中，设置id后如果资源未能加载完成则该状态为true
*/
get isLoading(): boolean;
/**
帧率：每秒播放的帧数，比如fps=12则表示每秒播放12帧
*/
fps: number;
/**
固定朝向，开启此项后忽略更换朝向的请求，即设置orientation无效
*/
fixedOrientation: boolean;
/**


---

## 第 197 页

辅助体 id => Helper 默认值={}
可以使用编辑器预设的各种辅助体信息来制作项目层的一些逻辑
*/
refObjs: {
};
/**
辅助体模式 
0-统一模式 该模式下的辅助体统一为一个 
1-逐帧模式 该模式下的辅助体每一帧都是单独存在的
*/
helperType: number;
/**
使用到的全部图集，AvatarFrameImage中的index即对应该数组的位置 默认值=[]
*/
picUrls: string[];
/**
当前的帧图（如有）
*/
currentFrameImage: AvatarFrameImage;
/**
设置和获取当前帧：例如1则表示第一帧
*/
currentFrame: number;
/**
总帧数（根据当前动作-方向来计算）
*/
get totalFrame(): number;
/**
根节点：部件可以使用此项获得自己的根节点，根节点的该属性是根节点自身
*/
topAvatar: Avatar;
/**
设置朝向，参考小键盘方向，以5为中心面向其他数字的方向：1-左下 2-下 3-右下 4-左 6-右 7-
左上 8-上 9-右上
设置一个无效的朝向将忽略此次更改
7 8 9
4 5 6
1 2 3
*/
orientation: number;
/**
设置动作，根据索引，设置一个无效的动作将忽略此次更改


---

## 第 198 页

@param index 动作索引
*/
actionIndex: number;
/**
设置动作，根据动作ID，设置一个无效的动作将忽略此次更改
@param id 动作ID
*/
actionID: number;
/**
获取动作列表，必须加载完成才能够获取
*/
get actionList(): AvatarAction[];
/**
根据自身中线对齐模式，启用后部件在该行走图因方向自动水平翻转时根据该行走图的中线对
齐而非各自的中线
*/
selfCenterlineAlignMode: boolean;
/**
强制水平翻转
*/
forceFlip: boolean;
/**
是否存在动作
@param actionID 存在的动作ID
@return [boolean]
*/
hasActionID(actionID: number): boolean;
/**
添加部位，根据部件对象，如果该部位已存在则忽略
需要该行走图加载完毕后才允许使用
添加进来的部件无需手动卸载
@param partID 部位ID
@param part 部件
@param partIndex [可选] 默认值=-1 插入的位置，默认值-1表示自动插入至最上层
@return [boolean] 是否添加成功
*/
addPartByAvatar(partID: number, part: Avatar, partIndex?: number): boolean;
/**
添加部位：根据指定的部件对应的数据库ID，如果该部位已存在则忽略
需要该行走图加载完毕后才允许使用
添加进来的部件无需手动卸载
@param partID 部位ID
@param avatarID 部件对应的数据库ID


---

## 第 199 页

@param partIndex [可选] 默认值=-1 插入的位置，默认值-1表示自动插入至最上层
@return [boolean] 是否添加成功
*/
addPartByID(partID: number, avatarID: number, partIndex?: number): boolean;
/**
移除部位：根据指定的部位ID
需要该行走图加载完毕后才允许使用
可选择是否卸载的参数，「如果未选择自动卸载则需要手动卸载」
@param partID 部位ID
@param disposeOldPart [可选] 默认值=true 是否卸载旧部件，如果设置为false则要自行手
动卸载
@return [Avatar] 部件
*/
removePartByPartID(partID: number, disposeOldPart?: boolean): Avatar;
/**
移除部位：根据部件对象
需要该行走图加载完毕后才允许使用
可选择是否卸载的参数，「如果未选择自动卸载则需要手动卸载」
@param part 部件
@param disposeOldPart [可选] 默认值=true 是否卸载旧部件，如果设置为false则要自行手
动卸载
@return [boolean] 是否移除成功
*/
removePartByAvatar(part: Avatar, disposeOldPart?: boolean): boolean;
/**
更换部位：根据新的部件和部位ID
需要该行走图加载完毕后才允许使用
新部件会自动继承原部件的设定（如位置、缩放、色调、透明度等设定）
原部件会自动卸载
@param newPart 新的部件
@param partID 部位ID
@return [boolean]
*/
changePartByAvatar(newPart: Avatar, partID: number): boolean;
/**
更换部位：根据新的部件对应的数据库ID和部位ID
需要该行走图加载完毕后才允许使用
新部件会自动继承原部件的设定（如位置、缩放、色调、透明度等设定）
原部件会自动卸载
@param newAvatarID 新的部件对应的数据库ID
@param partID 部位ID


---

## 第 200 页

@return [boolean]
*/
changePartByAvatarID(newAvatarID: number, partID: number): boolean;
/**
获取部位：根据部位ID
需要该行走图加载完毕后才允许使用
@param partID 部位ID
@return [Avatar] 部件
*/
getPartByPartID(partID: number): Avatar;
/**
根据部件所在的位置索引获取部件
需要该行走图加载完毕后才允许使用
@param partIndex 部件所在的索引（索引范围0~PartLength-1）
@return [Avatar] 部件
*/
getPartAt(partIndex: number): Avatar;
/**
根据部位对应的数据库ID获取部件
需要该行走图加载完毕后才允许使用
@param avatarID 部件对应的数据库ID
@return [Avatar] 部件，不存在则返回null
*/
getPartByID(avatarID: number): Avatar;
/**
根据部件获取所在的索引
需要该行走图加载完毕后才允许使用
@param avatar 部件
@return [number] 索引范围0~PartLength-1，不存在则返回-1
*/
getPartIndex(avatar: Avatar): number;
/**
返回部位的个数（包含本体，如果只有本体则返回1）
需要该行走图加载完毕后才允许使用
*/
get PartLength(): number;
/**
跳转某帧进行播放，越界会自动取模（如帧长度10，播放13则是播放3）
@frame [可选] 跳转的帧数，默认帧=1，1表示第一帧
*/
gotoAndPlay(frame?: number): void;
/**


---

## 第 201 页

在当前帧数开始播放
*/
play(): void;
/**
停止播放
@param frame [可选] 默认值=0 指定停留的帧数
*/
stop(frame?: number): void;
/**
像素级点击碰触检测
@param stageX 相对舞台的坐标x
@param stageY 相对舞台的坐标y
@return [boolean] 是否点击中
*/
hitTestPoint(stageX: number, stageY: number): boolean;
/**
渲染（通常情况下无需主动调用）
@chancelai autoPlay [可选] 默认值=true 自动推进播放
@chancelai useMapping [可选] 默认值=true 表示遇到没有的朝向和帧使用映射值
@chancelai playFrame [可选] 默认值=null 指定播放帧
@chancelai sendEvent [可选] 默认值=true 派发事件
@chancelai forceRender [可选] 默认值=false 强制渲染，表示无论是否处于等待间隔中都将
进行渲染
*/
onRender(autoPlay: boolean, useMapping: boolean, playFrame: number, sendEvent: 
boolean, forceRender: boolean): boolean;
}
/**
行走图动作数据
一个Avatar可能包含若干个动作，每个动作拥有对应每个方向都有一系列的图集
面向系统参考小键盘以5为中心面向其他数字的方向： 1-左下 2-下 3-右下 4-左 6-右 7-左上 8-上 9-
右上
7 8 9
4 5 6
1 2 3
*
Created by 黑暗之神KDS on 2018-12-07 03:15:16.
*/
declare class AvatarAction {
/**


---

## 第 202 页

动作ID 对应动作库中的ID
*/
id: number;
/**
图集的帧数据信息 默认值=[]
面向 - 帧图
如 [2] = AvatarFrameImage[] 表示该动作面向下的一组帧图数据
*/
frameImageInfo: AvatarFrameImage[][];
/**
方向模式 1 2 3 4 5 8
其中1、3、5方向会自动镜像翻转
*/
oriMode: number;
/**
获取指定面向的总帧数
@param ori 面向
@param useMapping [可选] 默认值=true 使用映射获取实际面向，比如没有7面向则使用4面
向代替
*/
getFrameLength(ori: number, useMapping?: boolean): number;
/**
获取当前动作中某个方向与某帧的数据图像
@param ori 面向
@param frame 帧
@param useMapping [可选] 默认值=true 使用映射获取实际面向，比如没有7面向则使用4面
向代替
@return 数据图像
*/
getFrameImage(ori: number, frame: number, useMapping?: boolean): 
AvatarFrameImage;
/**
是否存在该面向
@param ori 面向
@return [boolean]
*/
hasOri(ori: number): boolean;
}
/**
行走图帧图像数据
目前适用于行走图和立绘的帧切图数据


---

## 第 203 页

Created by 黑暗之神KDS  on 2018-12-07 05:22:16.
*/
declare class AvatarFrameImage {
/**
所在帧索引
*/
index: number;
/**
对应图集的索引 Avatar的picUrls
*/
picUrlIndex: number;
/**
贴图
*/
tex: Texture;
/**
切图数据 null表示直接使用整张图
*/
rect: Rectangle;
/**
坐标X 显示的偏移值x
*/
x: number;
/**
坐标Y 显示的偏移值y
*/
y: number;
/**
宽度，存在则使用该宽度，否则使用切图宽度
*/
width: number;
/**
高度，存在则使用该高度，否则使用切图高度
*/
height: number;
/**
旋转角度 默认值0
*/
rotation: number;
/**
透明 0~1 默认值1
*/
alpha: number;
/**


---

## 第 204 页

色相 -180~180 默认值0
*/
hue: number;
/**
模糊度 0~N 0表示无模糊 默认值0
*/
blur: number;
/**
色调：红 -255~255 默认值0
*/
tonal_r: number;
/**
色调：绿 -255~255 默认值0
*/
tonal_g: number;
/**
色调：蓝 -255~255 默认值0
*/
tonal_b: number;
/**
色调：灰色 0~100 默认值0
*/
tonal_gray: number;
/**
红曝光 0~10 默认值0
*/
tonal_mr: number;
/**
绿曝光 0~10 默认值0
*/
tonal_mg: number;
/**
蓝曝光 0~10 默认值0
*/
tonal_mb: number;
/**
等待类型 0/null-无（按照帧率） 1-等待X帧 2-等待X毫秒
*/
wait_type: number;
/**
等待计数（帧/毫秒） 
-- 其中帧是根据avatar帧率计算，比如帧率设置为20，游戏帧率为60，那么等待1帧则游戏实
际渲染3帧的时间（60/20*1）
也就是意味着等待3帧表示等待3倍间隔时间


---

## 第 205 页

-- 部件跟随本体的等待
*/
wait_count: number;
/**
获取图像的切图正数据
*/
get positiveRect(): Rectangle;
}
/**
回调方法
一般用于各种回调函数中为了携带执行域和参数
【使用方法】：
Callback.New(this.xxx,this,[1,2,3]);
Created by 黑暗之神KDS on 2018-01-01 03:47:27.
*/
declare class Callback {
/**
空的单一实例，一般用于必须回调中的空实现
*/
static EMPTY: Callback;
/**
调用者执行域
*/
caller: any;
/**
回调方法
*/
callbackFunc: Function;
/**
回调参数
*/
args: any[];
/**
运行
@param addArgs [可选] 默认值=null 追加的参数
*/
run(): any;
/**
运行追加额外的参数 追加的参数在回调时总是在后面
@param addArgs  追加的参数
*/
runWith(addArgs: any[]): any;
/**
延迟执行


---

## 第 206 页

@param delay 延迟的ms数
@param delayFunc [可选] 默认值=null 延迟使用的函数，默认setTimeout，可更换,如
setFrameout
@param args [可选] 默认值=null 参数
@return [Callback]
*/
delayRun(delay: number, delayFunc?: Function, args?: any[]): Callback;
/**
延迟执行，但会覆盖掉之前的延迟
@param delay 延迟的ms数
@param delayFunc [可选] 默认值=null 延迟使用的函数，默认setTimeout，可更换,如
setFrameout
@param clearDelayFunc [可选] 默认值=null 清理的延迟函数，默认 clearTimeout，可更换,
如setFrameout
@param args [可选] 默认值=null 参数
@return [Callback]
*/
delayRunConver(delay: number, delayFunc?: Function, clearDelayFunc?: Function, args?: 
any[]): Callback;
/**
停止延期
@param clearDelayFunc [可选] 默认值=null 清理的延迟函数，默认 clearTimeout，可更换
*/
stopDelay(clearDelayFunc?: Function): void;
/**
新建回调对象，同new CallBack
@param callbackFunc 回调方法
@param caller 执行域
@param args [可选] 默认值=null 携带的参数
@return [Callback]
*/
static New(callbackFunc: Function, caller: any, args?: any[]): Callback;
/**
延迟到下一帧执行，保证相同的方法和作用域只能执行一次，可用于优化效率
相同的方法和作用域调用此方法，只有第一次生效，其中args参数会替换成最近一次调用的参
数
该方法可能在下一次渲染前也可能在下一帧渲染后执行，如果必须确定在下次渲染前就要执行
可使用CallLaterBeforeRender
内部使用setTimeout-0ms实现
@param func 执行的方法
@param caller 作用域
@param args [可选] 默认值=null 附带的参数


---

## 第 207 页

@param delay [可选] 默认值=0 延迟的ms
*/
static CallLater(func: Function, caller: any, args?: any[], delay?: number): void;
/**
延迟到下一次渲染时执行，保证相同的方法和作用域只能执行一次，可用于优化效率
相同的方法和作用域调用此方法，只有第一次生效，其中args参数会替换成最近一次调用的参
数
@param func 执行的方法
@param caller 作用域
@param args [可选] 默认值=null 附带的参数
*/
static CallLaterBeforeRender(func: Function, caller: any, args?: any[]): void;
}
/**
镜头
一般作为场景的镜头来使用，坐标为镜头中心点
比如场景中使用了相机 Game.currentScene.camera
Created by 黑暗之神KDS on 2020-03-01 01:32:43.
*/
declare class Camera {
/**
包含相机位置和可见宽高 默认值=new Rectangle(0, 0, 100, 100)
*/
viewPort: Rectangle;
/**
镜头旋转角度 默认值=0
*/
rotation: number;
/**
镜头偏移量x 默认值=0
*/
offsetX: number;
/**
镜头偏移量y 默认值=0
*/
offsetY: number;
/**
镜头z轴位置 默认值=0
*/
z: number;
/**
相机镜头缩放x（场景专用）默认值=1
*/
scaleX: number;
/**


---

## 第 208 页

相机镜头缩放y（场景专用）默认值=1
*/
scaleY: number;
/**
镜头锁定场景对象，锁定后将以该场景对象为视角中心点，如果设置为null则以viewPort计算
*/
sceneObject: ClientSceneObject;
//------------------------------------------------------------------------------------------------------
// [代码示例]
// 镜头跳转到指定的场景位置（如像素坐标点500,500）：
// 
// // 先取消锁定目标，如果未锁定目标的话可以不调用此代码
// Game.currentScene.camera.sceneObject = null;
// // 再设置指定的位置
// Game.currentScene.camera.viewPort.x = 500;
// Game.currentScene.camera.viewPort.y = 500;
// 
// 镜头缓动到指定的场景位置（有平滑移动的效果）
// 
// // 先取消锁定目标，如果未锁定目标的话可以不调用此代码
// Game.currentScene.camera.sceneObject = null;
// // 用2000毫秒时间以Ease.strongOut的缓动形式使镜头移动到像素坐标点500,500
// Tween.to(Game.currentScene.camera.viewPort, { x: 500, y: 500 }, 2000, 
Ease.strongOut);
// 
// 镜头缩放（有平滑移动的效果）
// 
// // 先取消锁定目标，如果未锁定目标的话可以不调用此代码
// Game.currentScene.camera.sceneObject = null;
// // 用1000毫秒时间以Ease.strongOut的缓动形式使镜头缩放到0.5（即50%）
// Tween.to(Game.currentScene.camera, { scaleX: 0.5, scaleY: 0.5 }, 1000, 
Ease.strongOut);
// 
// 持续的镜头旋转效果
// 
// // 用1000毫秒时间以Ease.strongOut的缓动形式使镜头缩放到0.5（即50%）
// os.add_ENTERFRAME(() => {
//    Game.currentScene.camera.rotation++;
// }, this);
// 
//------------------------------------------------------------------------------------------------------
}
/**
客户端玩家类
每个玩家只有唯一的玩家类实例，可能是该类或其子类的实例（单机版有且只有一个玩家，所以只
有一个实例）
单机版内核直接监听本地变量的改变


---

## 第 209 页

网络版内核的监听是通过RPC请求服务器监听变量，服务器每次发现变量改变后会同步给该玩家的
客户端
-- 没有权限监听其他玩家的变量
 *
Created by 黑暗之神KDS on 2019-06-03 18:56:43.
*/
declare class ClientPlayer extends Player {
/**
构造函数
@param isMyPlayer [可选] 默认值=false 是否是我的玩家（网络内核会存在其他的玩家）
*/
constructor(isMyPlayer?: boolean);
/**
监听玩家变量
单机版内核：直接监听本地变量的改变
网络版内核：该变量首次监听时会与服务器-该编号的变量同步，其他非首次的监听直接来自
客户端缓存
// 示例：监听我的玩家的10号数值变量，由于确定是数值变量，所以这里回调使用value:number确
定是数值类型
Game.player.addListenerPlayerVariable(0,10,Callback.New((typeID:number,varI
D:number,value:number)=>{
// to do
},this))
@param type 0-变量 1-开关 2-字符串
@param varID 变量ID
@param onChange 当变量改变时回调 
onChange(typeID:number,varID:number,value:number|string)
@param isOnce [可选] 默认值=false 是否只监听一次
@param immediatelyCallback [可选] 默认值=true 是否当前立刻回调一次，否则在下次该变
量的值更改时才收到回调事件
*/
addListenerPlayerVariable(type: number, varID: number, onChange: Callback, isOnce?: 
boolean, immediatelyCallback?: boolean): void;
/**
取消监听玩家变量
单机版内核：直接取消监听本地变量的改变
网络版内核：当所有监听该编号的变量都取消了的话则通知服务器-取消该编号变量的监听同
步，当该变量改变时将不会发送给客户端同步消息
@param type 0-变量 1-开关 2-字符串
@param varID 变量ID


---

## 第 210 页

@param onChange 当变量改变时的回调，必须传入监听玩家变量时的这个回调才能够取消
*/
removeListenerPlayerVariable(type: number, varID: number, onChange: Callback): void;
}
/**
客户端游戏场景
场景一般由地图图像和场景上的对象（[ClientSceneObject]）组成
-- 图层支持：图块图层和图片图层，可自定义，支持无限层
-- 场景对象支持：添加场景对象在场景上
-- 镜头控制 Camera
*
【新建场景】 ps:利用相机以及当前的场景还可以很方便的制作小地图
// 方法一：创建一个5号场景（不包含场景中预摆放的对象），一个实例仅允许设置一次id
var s = new ClientScene();
s.id = 5;
s.startRender();
stage.addChild(s.displayObject); // 游戏显示层参考 GameLayer.d.ts
*
// 方法二：通过ClientScene.createScene来创建场景，无需指定场景的绑定类，系统根据预设自动
新建该场景的绑定类
ClientScene.createScene(sceneModelID, null, Callback.New(()=>{}, this), true);
*
【其他事件】
EventObject.LOADED 地图全部图层资源加载完毕时 如 scene.on(EventObject.LOADED,this,()=>
{});
*
【层次】总层次可参考 [GameLayer]
以下是引擎默认的游戏显示层次参考：
-- 场景层 sceneLayer
编辑器预设的自定义底层（比对象层更低的图层）
影子层 shadowLayer
动画层-底层 animationLowLayer
对象层-底层 sceneObjectLowLayer 同时开启了[子对象根据Y值自动更换层次]
对象层-中层 sceneObjectLayer 同时开启了[子对象根据Y值自动更换层次]
编辑器预设的自定义高层 （比对象层更高的图层）
对象层-高层 sceneObjectHighLayer 同时开启了[子对象根据Y值自动更换层次]
动画层-高层 animationHighLayer
雾层 fogLayer
天气层 weaterLayer
-- 图片层 imageLayer


---

## 第 211 页

-- UI层 uiLayer
*
Created by 黑暗之神KDS on 2018-07-22 17:29:13.
*/
declare class ClientScene extends Scene {
/**
事件：基础数据加载完毕（可用于快速切入场景，而后再加载动态相关资源）回调参数：
onBaseDataLoaded(scene:ClientScene) 默认值="ClientScene_BASE_DATA_LOADED"
监听基础资源加载完毕示例：
var s = new ClientScene();
s.id = 5;
s.on(ClientScene.BASE_DATA_LOADED)
s.startRender(ClientScene.BASE_DATA_LOADED,this,(s:ClientScene)=>{
// to do
});
stage.addChild(s.displayObject);
*/
static BASE_DATA_LOADED: string;
/**
事件：进入新的场景 onInNewScene(sceneID:number,state:number) state:0-切换场景 1-新
游戏 2-读取存档
监听来自切换场景事件、新游戏、读取存档的事件，以便项目层实现更换场景的效果 默认值
="ClientSceneEVENT_IN_NEW_SCENE"
// sceneModelID = 场景模型ID，对应编辑器的场景ID（如果是网络版可能是副本场景，但模型来
源仍然是预设的场景）
EventUtils.addEventListenerFunction(ClientScene, 
ClientScene.EVENT_IN_NEW_SCENE, (sceneModelID: number, state: number)=>{
// to do
}, this);
*/
static EVENT_IN_NEW_SCENE: string;
/**
空的场景，游戏启动时则为空场景状态，可用于判定
*/
static EMPTY: ClientScene;
/**
创建场景，会根据预设的实现类来创建对应的实例场景
@param sceneID 场景ID


---

## 第 212 页

@param onBaseDataLoaded [可选] 默认值=null 当基础数据加载完毕时回调 
onBaseDataLoaded(scene)
@param onLoaded [可选] 默认值=null onLoaded(scene)
@param syncCallbackWhenAssetExist [可选] 默认值=false 当资源存在时同步回调，否则需
要等待一帧（异步回调）
@return [ClientScene]
*/
static createScene(sceneID: number, onBaseDataLoaded?: Callback, onLoaded?: 
Callback, syncCallbackWhenAssetExist?: boolean): void;
/**
是否已卸载
*/
isDisposed: boolean;
/**
支持暂停（支持Game.pause效果，暂停后场景停止渲染）
*/
mapSupportPause: boolean;
/**
场景对象列表：场景上全部的场景对象 [场景对象.index] -> [场景对象]
*/
sceneObjects: ClientSceneObject[];
/**
预先设定的图层显示对象集合(来自地图编辑器中预设)
*/
settingLayers: ClientSceneLayer[];
/**
场景的显示对象（根容器）
*/
displayObject: GameSprite;
/**
影子层
*/
shadowLayer: ClientSceneLayer;
/**
动画层：底层
*/
animationLowLayer: ClientSceneLayer;
/**
对象层：底层
*/
sceneObjectLowLayer: ClientSceneLayer;
/**
对象层：中间层
*/
sceneObjectLayer: ClientSceneLayer;
/**


---

## 第 213 页

场景对象：最高层
*/
sceneObjectHighLayer: ClientSceneLayer;
/**
动画层：高层
*/
animationHighLayer: ClientSceneLayer;
/**
雾层
*/
fogLayer: ClientSceneLayer;
/**
天气层
*/
weaterLayer: ClientSceneLayer;
/**
场景的镜头
*/
camera: Camera;
/**
释放当前的场景
*/
dispose(): void;
//------------------------------------------------------------------------------------------------------
//  图层
//------------------------------------------------------------------------------------------------------
/**
添加图层
@param layer 图层对象
*/
addLayer(layer: ClientSceneLayer): void;
/**
添加图层到指定层
@param layer 图层对象
@param index 指定层索引
*/
addLayerAt(layer: ClientSceneLayer, index: number): void;
/**
移除图层
@param layer 图层对象
*/
removeLayer(layer: ClientSceneLayer): void;
/**
指定移除某一层的图层


---

## 第 214 页

@param index 指定层索引
*/
removeLayerAt(index: number): void;
/**
设置图层到指定的层，该层必须已经在场景上
@param layer 图层
@param index 指定的层索引
*/
setLayerIndex(layer: ClientSceneLayer, index: number): void;
/**
获取当前的图层总数
@return [number] 
*/
getLayerLength(): number;
/**
获取层，根据实际层次索引
@param index 层次索引
@return 图层
*/
getLayer(index: number): ClientSceneLayer;
/**
获取层，根据预设层次
@param id 对应地图层预览中的序号
*/
getLayerByPreset(id: number): ClientSceneLayer;
/**
获取层根据名称
@param name 图层的名称
@return [ClientSceneLayer]
*/
getLayerByName(name: string): ClientSceneLayer;
//------------------------------------------------------------------------------------------------------
//  场景对象
//------------------------------------------------------------------------------------------------------
/**
获取场景预设的场景对象数据（不包含出生点）
@return 场景对象数据集
*/
getPresetSceneObjectDatas(): SceneObject[];
/**
场景对象添加到场景上
由于对象涉及了参数默认值、状态页、预设的对象模块，通常情况下是使用 
addNewSceneObject/addSceneObjectFromClone 来创建对象
通常在当前场景上则用于添加已存在的实体对象进来。


---

## 第 215 页

示例：
// soc = [object ClientSceneObject]
Game.currentScene.addChild(soc,true,true);
@param soData 场景对象数据（可以是纯数据SceneObject或实体对象）
@param isEntity [可选] 默认值=false 是否是实体对象而非数据，如果是数据则会根据数据重
新创建一个实体对象
@param useModelClass [可选] 默认值=false 是否使用场景对象模型的实现类，项目层通常
该值为true
@param className [可选] 默认值=false 如果存在则根据className创建实例
@return [ClientSceneObject] 添加的场景对象实例
*/
addSceneObject(soData: SceneObject, isEntity?: boolean, useModelClass?: boolean, 
className?: string): ClientSceneObject;
/**
从场景上移除场景对象
@param so 场景对象数据，保证场景对象的index是你需要移除的那个即可
@param removeFromList [可选] 默认值=false 是否从列表中移除
@return [ClientSceneObject] 移除的场景对象实例
*/
removeSceneObject(so: SceneObject, removeFromList?: boolean): ClientSceneObject;
/**
添加新对象，以默认值生成新的对象，同时也可以追加修改属性（presetSceneObjectData）
@param modelID 模型ID
@param presetSceneObjectData [可选] 默认值=null 预设数据，以便生成时使用该数据作为
参考，如 {x:500,y:500} className可根据className创建实例
@return [ClientSceneObject]
*/
addNewSceneObject(modelID: number, presetSceneObjectData?: any): 
ClientSceneObject;
/**
克隆并添加场景对象
从指定的预设好的场景中指定一个对象为克隆源，然后复制这个对象到当前的场景上。
优先使用fromSceneObjectindex位置存放场景对象，如果该位置已存在对象，则自动计算空
位置插入到（this.sceneObjects）
如果来源一个非当前场景，必须在克隆之前有预加载过该场景或创建过该场景：
-- 预加载场景资源 AssetManager.preLoadSceneAsset 或 创建场景 
ClientScene.createScene
@param fromSceneID 来源的场景ID
@param fromSceneObjectindex 来源场景中的场景对象ID
@param isCopy [可选] 默认值=true 是否克隆（用于记录这个对象来自克隆）


---

## 第 216 页

@param presetSceneObjectData [可选] 默认值=null 预设的数据（SceneObject属性），如
修改x,y等，在最初即赋值。
@return [ClientSceneObject] 场景对象实例，如果没有找到模型的话创建失败返回null
*/
addSceneObjectFromClone(fromSceneID: number, fromSceneObjectindex: number, 
isCopy?: boolean, presetSceneObjectData?: any): ClientSceneObject;
//------------------------------------------------------------------------------------------------------
//  通常
//------------------------------------------------------------------------------------------------------
/**
获取鼠标X所在的场景位置（单位：像素）
*/
get localX(): number;
/**
获取鼠标Y所在的场景位置（单位：像素）
*/
get localY(): number;
/**
获取鼠标绝对位置（相对于舞台）（单位：像素）
*/
get globalPos(): Point;
/**
获取绝对鼠标位置（相对于舞台）根据指定的场景位置
@param localX 场景的坐标x（单位：像素）
@param localY 场景的坐标y（单位：像素）
@return [Point]
*/
getGlobalPos(localX: number, localY: number): Point;
/**
立刻刷新镜头（默认情况下场景会逐帧刷新镜头，如绑定的场景对象在移动时）
*/
updateCamera(): void;
/**
开始渲染，场景如果未调用的话则处于静止状态，运动的图层等都不播放
*/
startRender(): void;
/**
停止渲染
@param LayerMoveToZero [可选] 默认值=false 是否图层移动归零，是的话就归零，否则推
进移动一帧
*/
stopRender(LayerMoveToZero?: boolean): void;
/**
渲染：当Game.pause时则不处理刷新（update）
支持子类重写该方法以便编写专有的游戏逻辑


---

## 第 217 页

当前方法功能：
-- 刷新镜头
-- 刷新图层
-- 刷新场景对象（update）
*/
protected onRender(): void;
//------------------------------------------------------------------------------------------------------
//  事件
//------------------------------------------------------------------------------------------------------
/**
检查场景是否为特定事件类型注册了任何侦听器
@param type 事件的类型。
@return 如果指定类型的侦听器已注册，则值为 true；否则，值为 false。
*/
hasListener(type: string): boolean;
/**
场景派发事件
@param type
事件类型。
@param data
[可选] 默认值=null 回调数据。如果是需要传递多个参数 p1,p2,p3,...可以使
用数组结构如：[p1,p2,p3,...] ；如果需要回调单个参数 p 是一个数组，则需要使用结构如：
[p]，其他的单个参数 p ，可以直接传入参数 p。
@return 此事件类型是否有侦听者，如果有侦听者则值为 true，否则值为 false。
*/
event(type: string, data?: any): boolean;
/**
使用场景注册指定类型的事件侦听器对象，以使侦听器能够接收事件通知
@param type
事件的类型。
@param caller
事件侦听函数的执行域。a
@param listener 事件侦听函数。
@param args
[可选] 默认值=null 事件侦听函数的回调参数。
@return 此场景对象。
*/
on(type: string, caller: any, listener: Function, args?: Array): ClientScene;
/**
使用场景注册指定类型的事件侦听器对象，以使侦听器能够接收事件通知，此侦听事件响应一
次后自动移除
@param type
事件的类型。
@param caller
事件侦听函数的执行域。
@param listener 事件侦听函数。
@param args
[可选] 默认值=null 事件侦听函数的回调参数。


---

## 第 218 页

@return 此场景对象。
*/
once(type: string, caller: any, listener: Function, args?: Array): ClientScene;
/**
从场景中删除侦听器
@param type
事件的类型。
@param caller
事件侦听函数的执行域。
@param listener 事件侦听函数。
@param onceOnly
[可选] 默认值=false 如果值为 true ,则只移除通过 once 方法添加的侦
听器。
@return 此场景对象。
*/
off(type: string, caller: any, listener: Function, onceOnly?: boolean): ClientScene;
/**
从场景中删除指定事件类型的所有侦听器
@param type
[可选] 默认值=null 事件类型，如果值为 null，则移除本对象所有类型的侦
听器。
@return 此场景对象。
*/
offAll(type?: string): ClientScene;
}
/**
场景图层-显示对象
包含图片图层和图块图层
Created by 黑暗之神KDS on 2018-07-22 17:29:13.
*/
declare class ClientSceneLayer extends GameSprite {
/**
对应的地图对象
*/
scene: ClientScene;
/**
偏移值-X 默认值=0
*/
dx: number;
/**
偏移值-Y 默认值=0
*/
dy: number;
/**
X方向自动滚动 默认值=0
*/
xMove: number;
/**


---

## 第 219 页

Y方向自动滚动 默认值=0
*/
yMove: number;
/**
是否自动更换子显示对象层次 根据显示对象Y坐标刷新
比如在一般RPG游戏中，A在B的下方会遮挡B，而当A移动到B上方时会被B遮挡住，开启此项
会自动计算
*/
isChangeChildZOrder: boolean;
/**
x循环（平铺） 中途更改此项后需要调用refreshLoopShow刷新
*/
xLoop: boolean;
/**
y循环（平铺） 中途更改此项后需要调用refreshLoopShow刷新
*/
yLoop: boolean;
/**
远景比例X轴 默认值=1.0 表示 100% 普通地图是100%，值越小则移动越慢，多重远景一般通
过更改此属性来制作
*/
prospectsPerX: number;
/**
远景比例Y轴 默认值=1.0 表示 100% 普通地图是100%，值越小则移动越慢，多重远景一般通
过更改此属性来制作
*/
prospectsPerY: number;
/**
地图层的图片资源地址
*/
get mapUrl(): string;
/**
是否是绘图模式（图块），在创建时需要设定好才可使用图块模式绘制
*/
drawMode: boolean;
/**
构造函数
@param scene 所属的场景
*/
constructor(scene: ClientScene);
/**
刷新循环显示，中途更改了xLoop或yLoop后调用此项以便刷新
*/
refreshLoopShow(): void;
/**


---

## 第 220 页

绘制图块，绘制后需要调用flushTile进行冲印，同时绘制多个图块时可以在绘制完毕后统一冲
印，以便节约不必要的性能耗损。
图层必须是绘制模式（drawMode==true）
@param xGrid 格子坐标x
@param yGrid 格子坐标y
@param tileData 贴图对象、图块ID、图块的采样（x,y,width,height） 如果为null则表示擦
除
*/
drawTile(xGrid: number, yGrid: number, tileData: { tex: Texture; texID: number; x: 
number; y: number; w: number; h: number; }): void;
/**
绘制自动图块元件，绘制后需要调用flushTile进行冲印，同时绘制多个图块时可以在绘制完毕
后统一冲印，以便节约不必要的性能耗损。
图层必须是绘制模式（drawMode==true）
@param xGrid 格子坐标x
@param yGrid 格子坐标y
@param autoTileID 自动元件的ID
@param texture 自动元件的贴图
*/
drawAutoTile(xGrid: number, yGrid: number, autoTileID: number, texture: Texture): void;
/**
刷新图块：将此前绘制过的图块统一显示出来
*/
flushTile(): void;
/**
清理图块，将当前图块全部清空
*/
clearTile(): void;
/**
设置完整图片作为该层地图图像，仅图片图层可用
@param imgURL 完整图片地址
*/
setBigImage(imgURL: string): void;
/**
根据texture设置背景，仅图片图层可用
@param t 贴图
*/
setBigTexture(t: Texture): void;
//------------------------------------------------------------------------------------------------------
// [代码示例]
// 创建一个图片图层添加到当前场景上
// 
// 创建一个图层，并设置图片，添加到场景上，默认在左上角（0,0）
// var layer = new ClientSceneLayer(Game.currentScene);
// layer.setBigImage("asset/image/xxxx.png");


---

## 第 221 页

// Game.currentScene.addLayer(layer);
// 
// 创建一个图块图层，绘制图块
// 
// // 创建一个图块图层
// var layer = new ClientSceneLayer(Game.currentScene);
// layer.drawMode = true;
// layer.graphics.drawRect(0,0,100,100,"#FF0000");
// // 加载指定的贴图作为图块素材
// AssetManager.loadImage("asset/image/tile/矿洞.png", Callback.New((tex: 
Texture) => {
//     // 从图源0,0中取得48x48的图绘制到格子3,0的位置上
//     layer.drawTile(3, 0, { tex: tex, texID: 1, x: 0, y: 0, w: 48, h: 48 
});
//     // 从图源96,0中取得48x48的图绘制到格子4,0的位置上
//     layer.drawTile(4, 0, { tex: tex, texID: 1, x: 96, y: 0, w: 48, h: 48 
});
//     // 提交绘制
//     layer.flushTile();
// }, this));
//
// // 加载指定的自动元件贴图作为自动元件素材
// AssetManager.loadImage("asset/image/tile/GCAT1a.png", Callback.New((tex: 
Texture) => {
//    // 绘制到坐标3,3，作为自动元件6号
//    layer.drawAutoTile(3, 3, 6, tex);
//    // 提交绘制
//    layer.flushTile();
// }, this));
// 
// // 添加到场景上
// Game.currentScene.addLayer(layer);
// 
//------------------------------------------------------------------------------------------------------
}
/**
场景对象-客户端基类
实际在游戏画面中出现的场景对象类，所有客户端场景对象实现类都继承于该类
*
【内部的显示层次】
-- 动画层：底层 animationLowLayer 使用playAnimation播放的动画比目标效果层更低的层次会添
加到这里
-- 自定义底层（预设中比行走图低的层，包括行走图） customLayer
-- 动画层：高层 animationHighLayer 使用playAnimation播放的动画比目标效果层更高的层次会
添加到这里


---

## 第 222 页

-- 自定义高层（预设中比行走图更高的层次）customHighLayer
*
Created by 黑暗之神KDS on 2018-07-24 02:06:28.
*/
declare class ClientSceneObject extends SceneObjectEntity {
/**
水平坐标
*/
protected _x: number;
/**
垂直坐标
*/
protected _y: number;
/**
所属的玩家
*/
player: ClientPlayer;
/**
显示对象的根容器，在场景上的场景对象实际上是将该容器添加到场景的显示容器
（displayObject）上
*/
root: GameSprite;
/**
影子，默认是添加在场景的影子层上，以便比所有对象低
*/
shadow: GameSprite;
/**
底层动画层 使用playAnimation播放的动画比目标效果层更低的层次会添加到这里
*/
animationLowLayer: GameSprite;
/**
行走图
*/
avatar: Avatar;
/**
行走图容器，装载行走图的父节点
*/
avatarContainer: GameSprite;
/**
自定义层 预设中比行走图低的层，包括行走图（avatar）
*/
customLayer: GameSprite;
/**
高层动画层 使用playAnimation播放的动画比目标效果层更高的层次会添加到这里
*/
animationHighLayer: GameSprite;
/**


---

## 第 223 页

模型对象预设高层（预设中比行走图更高的层次）
*/
customHighLayer: GameSprite;
/**
最高层系统UI层
*/
systemUILayer: GameSprite;
/**
所在的场景，在添加到场景时会设置此值，移除时并不会被置空
*/
scene: ClientScene;
/**
【编辑器预览用】拖拽对象锁定
*/
lockDrag: boolean;
/**
【编辑器预览用】删除对象锁定
*/
lockDelete: boolean;
/**
【编辑器预览用】按键移动对象锁定
*/
lockKeyMove: boolean;
/**
构造函数
@param soData [可选] 默认值=null 场景对象数据
@param scene [可选] 默认值=null 场景
*/
constructor(soData?: SceneObject, scene?: ClientScene);
/**
释放
*/
dispose(): void;
//------------------------------------------------------------------------------------------------------
// 渲染和刷新
//------------------------------------------------------------------------------------------------------
/**
绘制影子，比如当需要缩放影子时调用此函数
@param scalePer [可选] 默认值=1.0 缩放率
*/
drawShadow(scalePer?: number): void;
/**
刷新影子，更新影子坐标，refreshCoordinate会调用此函数以便更新影子坐标
*/
protected updateShadow(): void;
/**


---

## 第 224 页

停止渲染，Game.pause 时会自动调用场景中对象的此函数
停止行走图的播放以及所有动画的播放
@param stopCurrentFrame [可选] 默认值=false 是否停止在当前帧 true=当前帧 false=初始
设定帧
*/
stopRender(stopCurrentFrame?: boolean): void;
/**
恢复渲染，Game.pause 时会自动调用场景中对象的此函数
恢复行走图的播放以及所有动画的播放
@param continueCurrentFrame [可选] 默认值=false 行走图是否从当前帧开始恢复播放 
true=当前帧 false=初始设定帧
*/
recoveryRender(continueCurrentFrame?: boolean): void;
/**
进入新的坐标后应调用此函数
-- 场景中添加了场景对象后调用了该函数
-- 该函数调用了updateShadow，子类重写可实现更多功能
*/
refreshCoordinate(): void;
/**
刷新：场景会调用所有场景上面的场景对象的该函数，执行逻辑应由子类实现，该类下此函数
无任何代码实现
@param nowTime 游戏时间戳（Game.pause会暂停游戏时间戳）
*/
update(nowTime: number): void;
//------------------------------------------------------------------------------------------------------
// 功能和行为
//------------------------------------------------------------------------------------------------------
/**
根据动作索引播放动作
@return [number]
*/
actionIndex: number;
//------------------------------------------------------------------------------------------------------
// 动画
//------------------------------------------------------------------------------------------------------
/**
播放动画，目标对象是行走图
*
@param aniID 动画编号，指定的是动画编辑器预设的编号
@param loop 是否循环播放
@param isHit 是否显示被击中的效果，动画编辑器支持动画层仅命中时显示，如果设置为
true即表示该动画所有层均显示
@param fps [可选] 默认值=null 帧率，如果无则使用Config.ANIMATION_FPS


---

## 第 225 页

@param superposition [可选] 默认值=false 叠加，默认不叠加，即同一个ID播放会重新播放
该动画，停止该动画无法使用ID来停止而必须传入Animation对象
@param ignoreReplay  [可选] 默认值=false 忽略而非重头播放。默认重头播放，即非叠加时
同一个ID播放会重新播放该动画
@return [GCAnimation]
*/
playAnimation(aniID: number, loop: boolean, isHit: boolean, fps?: number, 
superposition?: boolean, ignoreReplay?: boolean): GCAnimation;
/**
停止动画
@param aniID 动画编号/对象 number | [GCAnimation]
*/
stopAnimation(aniID: any): void;
/**
停止所有动画
*/
stopAllAnimation(): void;
/**
动画集合
*/
get animations(): Animation[];
//------------------------------------------------------------------------------------------------------
// 显示对象事件，其内部实质是this.root的事件
//------------------------------------------------------------------------------------------------------
/**
检查 EventDispatcher 对象是否为特定事件类型注册了任何侦听器。
@param type 事件的类型。
@return 如果指定类型的侦听器已注册，则值为 true；否则，值为 false。
*/
hasListener(type: string): boolean;
/**
派发事件。
@param type
事件类型。
@param data
（可选）回调数据。注意：如果是需要传递多个参数 p1,p2,p3,...可以使用
数组结构如：[p1,p2,p3,...] ；如果需要回调单个参数 p 是一个数组，则需要使用结构如：
[p]，其他的单个参数 p ，可以直接传入参数 p。
@return 此事件类型是否有侦听者，如果有侦听者则值为 true，否则值为 false。
*/
event(type: string, data?: any): boolean;
/**
使用 EventDispatcher 对象注册指定类型的事件侦听器对象，以使侦听器能够接收事件通知。
@param type
事件的类型。
@param caller
事件侦听函数的执行域。a
@param listener 事件侦听函数。


---

## 第 226 页

@param args
（可选）事件侦听函数的回调参数。
@return 此 EventDispatcher 对象。a
*/
on(type: string, caller: any, listener: Function, args?: Array): ClientSceneObject;
/**
使用 EventDispatcher 对象注册指定类型的事件侦听器对象，以使侦听器能够接收事件通知，
此侦听事件响应一次后自动移除。
@param type
事件的类型。
@param caller
事件侦听函数的执行域。
@param listener 事件侦听函数。
@param args
（可选）事件侦听函数的回调参数。
@return 此 EventDispatcher 对象。
*/
once(type: string, caller: any, listener: Function, args?: Array): ClientSceneObject;
/**
从 EventDispatcher 对象中删除侦听器。
@param type
事件的类型。
@param caller
事件侦听函数的执行域。
@param listener 事件侦听函数。
@param onceOnly
（可选）如果值为 true ,则只移除通过 once 方法添加的侦听器。
@return 此 EventDispatcher 对象。
*/
off(type: string, caller: any, listener: Function, onceOnly?: boolean): ClientSceneObject;
/**
从 EventDispatcher 对象中删除指定事件类型的所有侦听器。
@param type
（可选）事件类型，如果值为 null，则移除本对象所有类型的侦听器。
@return 此 EventDispatcher 对象。
*/
offAll(type?: string): ClientSceneObject;
}
/**
游戏世界-客户端
拥有特性：
-- 自定义世界属性：编辑器支持自定义设置世界属性，在这里通过ClientWorld.data访问
-- 访问全局变量（单机版内核表示二周目变量，网络版表示全体玩家公共的变量）
-- 单机内核对于事件库、全界面事件的管理
Created by 黑暗之神KDS on 2019-06-02 22:49:26.
*/
declare class ClientWorld {
/**


---

## 第 227 页

事件：引擎初始化完毕（仅限于游戏运行时）默认值="ClientMain_EVENT_INITED"
*/
static EVENT_INITED: string;
/**
事件：行为编辑器预览端初始化完毕 默认值="BehaviorViewClientWorldInited"
*/
static EVENT_BEHAVIOR_VIEW_INITED: string;
/**
世界自定义数据
*/
static data: typeof WorldData;
/**
全局变量
*/
static variable: Variable;
/**
监听当全局变量的改变时
// 监听2号全局数值变量
ClientWorld.addListenerVariable(0, 2, Callback.New((type: number, varID: 
number, value: number) => {
// to do
}, this));
@param type 0-变量 1-开关 2-字符串
@param onChange onChange(type:number,varID:number,value:number|string);
*/
static addListenerVariable(type: number, varID: number, onChange: Callback): void;
/**
取消监听：当全局变量改变时
// 监听2号全局数值变量
var cb = Callback.New((type: number, varID: number, value: number) => {
// to do
}, this)
// 取消监听
ClientWorld.addListenerVariable(0, 2, cb);
@param type 0-变量 1-开关 2-字符串


---

## 第 228 页

@param onChange
*/
static removeListenerVariable(type: number, varID: number, onChange: Callback): void;
/**
事件库的事件集
*/
static commonEventPages: CommandPage[];
/**
界面自定义事件集 id-CommandPage 0~N
比如界面拥有点击事件、鼠标悬停事件，那么同一个控件支持两个事件页 默认值={}
*/
static uiCustomCommandPages: {
};
}
/**
事件指令
该类是事件页（[CommandPage]）中的事件指令数据类
支持自定义事件指令
相关类：[Command]、[CommandPage]、[CommandTrigger]
*
Created by 黑暗之神KDS on 2018-10-09 16:37:07.
*/
declare class Command {
/**
事件：系统指令事件开始，可以通过监听玩家的场景对象
// so = [SceneObjectEntity] 玩家的场景对象实例
// sysType = 回调参数:指令类别 0-对话框显示时 1-对话选择框显示时 2-场景更换
EventUtils.addEventListenerFunction(so, Command.EVENT_SYSTEM_COMMAND_START, 
(sysType:number)=>{
// to do
}, this);
*/
static EVENT_SYSTEM_COMMAND_START: string;
/**
指令类型 系统指令10000以内，自定义指令10000以上，如10001表示1号自定义指令
*/
type: number;
/**


---

## 第 229 页

自定义指令的ID（如果该指令是自定义指令的话，否则返回null）
*/
customID: number;
/**
指令参数，储存事件编辑器中输入的参数值
*/
params: any[];
/**
预编译后的指令参数：一般用于预编译后自定义储存，以便在执行指令时可以调用，提升事件
执行性能（如缓存一些事先计算好的值）
*/
paramsCompiled: any[];
/**
调用执行客户端方法：需要执行客户端效果或让玩家输入信息时需要使用该方法
一般主要用于调用客户端方法，客户端设置为等待玩家输入的状态以便阻塞客户端输入，
多个事件同时让玩家输入时，应该以排队的方式让玩家一一提交输入结果。
*
客户端执行的自定义指令函数必须在CommandExecuteGame模块中：
module CommandExecuteGame {
export function customCommand_1(param1:any,param2:any): void {
return GameCommand.COMMAND_STATE_NEED_INPUT;
}
}
// 关于返回值状态：通常情况下
GameCommand.COMMAND_STATE_CONTINUE; 表示指令继续【默认】
GameCommand.COMMAND_STATE_STOP; 表示指令终止
GameCommand.COMMAND_STATE_NEED_INPUT; 表示指令需要等待玩家输入才能继续
*
@param triggerLineID 触发线ID，使用trigger的ID（关于触发线的概念可以参考
CommandTrigger）
@param player 玩家对象
@param params 参数 执行的方法按顺序排列这些参数，比如[param1,param2] 则对应 
customCommand_1(param1:any,param2:any)
@param gameFunc [可选] 默认值=null 若存在，则会执行GameFunction里面的方法，否则
需要创建相应的CommandExecuteGame函数
*/
callExecuteFunction(triggerLineID: number, player: Player, params: any[], gameFunc?: 
string): void;
}
/**


---

## 第 230 页

事件页
包含该事件页下的所有指令行（[Command]）
相关类：[Command]、[CommandPage]、[CommandTrigger]
*
Created by 黑暗之神KDS on 2018-10-09 16:37:07.
*/
declare class CommandPage {
/**
唯一ID
*/
id: number;
/**
指令对象集合 默认值=[]
*/
commands: Command[];
/**
开始触发事件（首次）如果已在执行中则会自动忽略
@param trigger 事件触发器
@param playerInput [可选] 默认值=[] 玩家提交的自定义输入信息
*/
startTriggerEvent(trigger: CommandTrigger, playerInput?: any[]): void;
/**
执行事件，一般用于制作自定义指令时中途暂停了事件执行后恢复事件执行
@param trigger 事件触发器
@param playerInput [可选] 默认值=[] 玩家提交的自定义输入信息
*/
static executeEvent(trigger: CommandTrigger, playerInput?: any[]): void;
/**
开始执行片段事件
该片段事件事件会启动一条单独的触发线独立运作，并支持跨场景（必须触发者是玩家的场景
对象），直到其执行完毕。
@param feData 片段事件数据
@param trigger 触发者-场景对象
@param execute 执行者-场景对象
@param onCommandExecuteOver [可选] 默认值=null 当指令执行完毕时回调
@return [CommandTrigger] 触发器
*/
static startTriggerFragmentEvent(feData: string, trigger: SceneObjectEntity, execute: 
SceneObjectEntity, onCommandExecuteOver?: Callback): CommandTrigger;
}
/**
事件触发器


---

## 第 231 页

触发器用于触发事件，总是绑定在场景对象身上的，并且由某个对象触发并由某个对象执行（即触
发者和执行者）
触发器的主种类分为：场景的触发器、场景对象的触发器、界面控件的触发器、事件库触发器（独
立）、独立事件片段触发器
支持同一时间内多个触发器同时执行事件
支持自定义触发器，比如场景的进入事件、界面控件的点击事件等
支持暂停执行事件以及暂停等待的时间推进
支持多线模式：不用等待该事件执行完毕也仍然可以再次执行该事件
支持接收玩家的自定义参数输入（如制作等待玩家输入名字、等待玩家输入密码、QTE等功能）
跨场景执行：部分触发器可以跨场景执行，并不会因为更换场景而终止，满足以下条件即可：
-- 触发者和执行者都是玩家的场景对象（如界面控件的点击事件）
读档后会恢复全部正在执行的事件（如读档前A事件执行到第3行，那么读档后A事件从第4行开始执
行）
*
相关类：[Command]、[CommandPage]、[CommandTrigger]
*
Created by 黑暗之神KDS on 2018-10-11 20:48:57.
*/
declare class CommandTrigger {
/**
执行开始事件：当触发器开始执行时派发的一个事件（Event）
// trigger = [CommandTrigger] 触发器
EventUtils.addEventListenerFunction(trigger, CommandTrigger.EVENT_START, 
()=>{
// to do
}, this);
*/
static EVENT_START: string;
/**
执行结束事件：当触发器执行结束时派发的一个事件（Event）
// trigger = [CommandTrigger] 触发器
EventUtils.addEventListenerFunction(trigger, CommandTrigger.EVENT_OVER, 
()=>{
// to do
}, this);
*/
static EVENT_OVER: string;
/**


---

## 第 232 页

该触发器此前派发的对象行为事件执行完毕时事件：（同指令中的[等待行为结束]）
// trigger = [CommandTrigger] 触发器
EventUtils.addEventListenerFunction(trigger, 
CommandTrigger.EVENT_BEHAVIOR_OVER, ()=>{
// to do
}, this);
*/
static EVENT_BEHAVIOR_OVER: string;
/**
枚举-事件主类别：场景相关的事件类别 默认值=0
*/
static COMMAND_MAIN_TYPE_SCENE: number;
/**
枚举-事件主类别：场景对象相关的事件类别 默认值=1
*/
static COMMAND_MAIN_TYPE_SCENE_OBJECT: number;
/**
枚举-事件主类别：界面相关的事件类别 默认值=2
*/
static COMMAND_MAIN_TYPE_UI: number;
/**
枚举-事件主类别：独立的事件库事件的事件类别 默认值=3
*/
static COMMAND_MAIN_TYPE_CALL_COMMON_EVENT: number;
/**
枚举-事件主类别：片段事件的事件类别 默认值=4
*/
static COMMAND_MAIN_TYPE_FRAGMENT_EVENT: number;
/**
唯一ID，触发线（TriggerLineID）对应的就是触发器的ID
*/
id: number;
/**
触发器主类型 对应CommandTrigger::COMMAND_MAIN_TYPE_XXXXX
如：这是一个场景对象相关的事件
*/
mainType: number;
/**
触发器子类型 主类型下的子类型
如：这是一个场景对象的“点击事件”
*/
indexType: number;
/**


---

## 第 233 页

记录对应事件来源
0-场景：无
1-场景对象：对象index
2-界面：sid唯一随机ID
3-事件库：事件库事件的ID
4-事件页片段：sid唯一随机ID
*/
from: any;
/**
是否多线模式：表示该触发器是每次生成的一个新触发器，独立运行
比如：界面中控件的点击事件是一个每次点击都会执行一个循环事件-在10秒内每秒增加1号数
值变量20点，
则玩家点击N次，每次事件需要10秒才能执行结束。
如果开启了多线模式：无需等待上一个10秒事件，启动一个新的10秒事件（会同时执行）
如果关闭了多线模式：需要等待上一个10秒事件执行完毕，才能生效，否则此次点击忽略。
 */
multiline: boolean;
/**
所在的场景，此处一般指当前游戏场景
*/
scene: ClientScene;
/**
触发事件的场景对象（事件触发者）
如RPG游戏中，玩家点击NPC时，玩家的场景对象是触发者
*/
trigger: SceneObjectEntity;
/**
执行事件的目标（事件执行者）
如RPG游戏中，玩家点击NPC时，NPC是执行者
*/
executor: SceneObjectEntity;
/**
暂停指令继续推进：暂停执行标记，表示事件暂时停止执行
同时指令停止了指令的索引推进，停留在当前行，如果继续执行的话，仍然是当前行指令执
行，
所以一般情况下可以调用offset方法偏移指令行，也可以通过玩家提交输入的信息来区分同一
个指令下的不同状态
*/
pause: boolean;
/**
是否暂停【等待】指令继续执行（在等待中也会暂停，而恢复后会等待剩余的时间/帧数）
一般用于制作需要主动暂停某些事件，比如RPG模板中场景中的某些事件遇到Game.pause时
暂停了，


---

## 第 234 页

以便打开战斗场景进入“另一个空间”战斗结束后恢复暂停。
*/
delayPause: boolean;
/**
中断执行标记，表示事件指令该作用域中断了，返回到上一层作用域继续执行（如若已经是顶
层则事件指令执行完毕）
如系统指令-[中断指令执行]则设置该参数为true，表示当前层的事件后续不再执行
*/
cmdReturn: boolean;
/**
玩家提交输入值 默认值=[]
一般配合系统指令-[等待玩家输入]一并使用（当然自定义的等待同样有效）
客户端通过[GameCommand]的inputMessageAndContinueExecute方法来提交玩家的输入
信息
比如制作等待玩家鼠标点击屏幕，然后通过提交鼠标位置信息给事件接收，以便获取信息后执
行逻辑 
*/
inputMessage: any[];
/**
获取触发事件的玩家，单机版只有当前的唯一玩家
@return [Player]
*/
get triggerPlayer(): Player;
/**
偏移指令行
@param value 偏移量时
*/
offset(value: number): void;
/**
等待指定帧数后继续执行指令
@param frame 等待的帧数
*/
waitFrame(frame: number): void;
/**
等待指定时间后继续执行
@param time 等待的时间，单位：毫秒
*/
waitTime(time: number): void;
/**
添加对象行为组
对象身上每次添加对象行为组时都会新增一层行为，只有当这一层执行完毕后才会回到上一层
继续执行
比如A对象默认行为是123，在执行完1时添加了新的行为组456，此时执行完456后回到第一
层继续执行23，所以总顺序应是：1-4-5-6-2-3


---

## 第 235 页

@param targetSo 目标对象（行为执行者）
@param behaviorData 行为数据 [[行为1-ID,参数1,参数2],[行为2-ID,参数1,参数2],....]
由于行为是自定义的，具体行为的作用请参考游戏的模板高级制作者可以在：GameCreator
编辑器菜单-自定义编辑器-自定义行为中配合脚本来编辑行为
*
@param loop 是否循环，一旦循环执行则会无限在该层循环，除非再添加一层新的行为组
@param targetSceneObject 事件触发者
@param cover 是否覆盖，一旦覆盖则将此前的行为组清空（连同其默认的行为）
@param startIndex [可选] 默认值=0 该行为组的开始播放的行为索引，默认0，表示从最开头
开始播放
@param Immediate [可选] 默认值=true 是否立即刷新，否则会等待下一帧才刷新
@param forceStopLastBehavior [可选] 默认值=false 是否强制停止正在执行的行为，由项目
层实现，以便当前行为组能够立即执行
@param delayFrame [可选] 默认值=0 行为内部的需要等待的帧数
@param executor [可选] 默认值=null 执行事件者（也是行为派发者）
*/
addBehavior(targetSo: SceneObjectEntity, behaviorData: any[], loop: boolean, 
targetSceneObject: SceneObject, cover: boolean, startIndex?: number, Immediate?: 
boolean, forceStopLastBehavior?: boolean, delayFrame?: number, executor?: 
SceneObjectEntity): void;
/**
该触发器是否还有派发出去仍未执行完毕的行为
一个触发器可以同时派发多个对象行为事件，比如让A执行123，让B执行456，
当所有派发出去的行为执行完毕后该属性才返回false（或者当前没有派发任何对象行为的事
件）。
*/
get hasBehavior(): boolean;
/**
调用事件库事件时追加层级，在当前的触发器中追加执行指定的事件库的事件，在事件库事件
执行完毕后会回到原来的事件中继续接着执行
一般用于在指令执行中追加调用事件库的事件
@param commonEventID 事件库的事件ID
*/
addCommonEventCommandPageLayer(commonEventID: number): void;
/**
追加片段事件层级，在当前的触发器中追加执行片段事件，在该片段事件执行完毕后会回到原
来的事件中继续接着执行
一般用于在指令执行中追加事件片段
@param feData 片段事件数据
*/
addFragmentEventCommandPageLayer(feData: string): void;
}
/**


---

## 第 236 页

通用配置
游戏的通用配置，用于获取编辑器中一些预设的配置信息
Created by 黑暗之神KDS on 2018-05-22 20:26:48.
*/
declare class Config {
/**
创建工程时会生成游戏项目的唯一SID
*/
static gameSID: number;
/**
模板的ID（对应云模板ID）
安装模板时会写入
*/
static templateID: number;
/**
模板的版本号（云模板版本号）
安装模板时会写入
*/
static templateVersionID: number;
/**
制作模板的作者uid
*/
static TEMPLETE_USER_UID: number;
/**
使用F1-F12功能键，关闭此项功能后同时也会禁止浏览器环境下的该按键功能 默认值=true
-- F5：重置游戏
-- F11：全屏化
*/
static USE_FN: boolean;
/**
对齐网格方式
*/
static gridAlignMode: number;
/**
是否处于编辑器模式
编辑器也搭载了运行时以便实时预览和重用代码，所以在部分场合下会使用此判定
*/
static get EDIT_MODE(): boolean;
/**
是否处于对象行为编辑器模式
行为编辑器中运行了用户编写的代码以便预览实际的效果，所以可以利用此属性来区分运行环
境，


---

## 第 237 页

以便让游戏或行为编辑器中解决兼容性问题
*/
static get BEHAVIOR_EDIT_MODE(): boolean;
/**
游戏发布后的版本，用于区分是否正式版游戏
*/
static get RELEASE_GAME(): boolean;
/**
创建工程时的GC版本号
*/
static get CREATED_GC_VERSION(): number;
/**
默认分辨率宽度：当前版本是根据窗口大小自动等比缩放
*/
static get WINDOW_WIDTH(): number;
/**
默认分辨率高度：当前版本是根据窗口大小自动等比缩放
*/
static get WINDOW_HEIGHT(): number;
/**
场景格子大小，比如32像素或48像素
*/
static get SCENE_GRID_SIZE(): number;
/**
动画默认播放帧率：新建立的动画在未设定帧率时的默认帧率
*/
static get ANIMATION_FPS(): number;
/**
默认字体，新建立的文本会使用该默认字体
GC支持同一游戏下不同的字体共存，这里不会影响对于编辑器中各处文本已单独设置好的字
体
*/
static get DEFAULT_FONT(): string;
}
/**
获得或者设置的自定义组件属性相关数据
--自定义模块数据
--自定义世界数据
--自定义玩家数据
--自定义场景对象数据
==自定义场景对象模型数据
*/
declare class CustomCompData {
/**


---

## 第 238 页

类别 0:获取属性 1:获取和设置属性 默认值=0
*/
type: number;
/**
模块ID 默认值=1
*/
moduleID: number;
/**
数据ID 默认值=1
*/
dataID: number;
/**
是否使用变量指定数据ID 默认值=false
*/
dataIsUseVar: boolean;
/**
变量ID 默认值=1
*/
dataVarID: number;
/**
选中的属性唯一ID 默认值=""
*/
varID: string;
/**
选中属性名称 默认值=""
*/
varName: string;
/**
设置值类别 0-常量 1-变量 默认值=0
*/
valueType: number;
/**
设置的值 默认值={}
*/
value: { copy: boolean, value: number, varType: number };
/**
是否为自定义模块
*/
isCustomModule: boolean;
/**
是否允许获取/设置绑定界面内的属性 默认=false
*/
compAttrEnable: boolean;
/**


---

## 第 239 页

运算类型 0-等于 1-加上 2-减去 3-乘以 4-除以 5-求余 6-求幂
*/
operationType: number;
/**
是否取整（数值类型，根据编辑器设定）
*/
isRounded: boolean;
/**
获取的值(绑定界面内属性) 默认值={ uiID: 1, type: 0, compName: "", compID: 0, attrs: [], 
varName: "" };
--uiID:界面ID
--type:属性类别 0-数值 1-字符串 2-布尔值 3-其他
--compName:组件名称
--compID:组件唯一ID
--attrs:选择的组件属性集合
--varName:组件属性名称
 */
compInfo: { uiID: number, type: number, compName: string, compID: number, attrs: 
any[], varName: string };
/**
选择模式 0-枚举 1-输入 默认值=0
*/
selectMode: number;
/**
输入模式下,填入数据 默认值={ mode: 0, constName: "", varNameIndex: 1, typeIndex: 0 }
--mode:模式 0-常量 1-变量
--constName:常量属性名称
--varNameIndex:变量属性名称索引
--typeIndex:属性类别 0-数值 1-字符串 2-布尔值 3-其他
 */
inputModeInfo: { mode: number, constName: string, varNameIndex: number, typeIndex: 
number };
/**
设置数据
@param target 修改对象
@param data 数据
@param soc 场景对象[可选]设置场景对象模块的属性用
*/
static setData(target: any, data: CustomCompData, soc?: any): void;
/**
获取数据
@param target
@param data 数据


---

## 第 240 页

@param isModule [可选]是否自定义模块,此时target设置为null即可
*/
static getData(target: any, data: CustomCompData, isModule?: boolean): any
/**
获取超级数值的值
@param v 自定义参数
@param trigger 触发器 默认可省略 默认值=null
@returns 
*/
static getSuperNumber(v: any, trigger?: any): number
/**
获取超级字符串的值
@param v 自定义参数
@param trigger 触发器 默认可省略 默认值=null
@returns 
*/
static getSuperString(v: any, trigger?: any): string
/**
获取超级开关的值
@param v 自定义参数
@param trigger 触发器 默认可省略 默认值=null
@returns 
*/
static getSuperSwitch(v: any, trigger?: any): boolean
}
/**
通用事件管理器
*
与客户端的EventDispatcher区别是可以支持任意的对象派发和接收事件
但需要注意的是销毁对象时需要调用 EventUtils.clear();，否则使用了该事件管理器
注册事件的对象会永久在这里记录着从而导致内存泄漏（即无用的资源不断堆积导致内存占用过
高）。
*
通用规则：一般格式 EVENT_????? 的事件都使用EventUtils，如CommandTrigger.EVENT_START
使用方法一：
EventUtils.addEventListener(obj,XXX.EVENT_XXX,Callback.New((参数1,参数2)=>{
// 逻辑
},this));
*
使用方法二：
EventUtils.addEventListenerFunction(obj,XXX.EVENT_XXX,(参数1,参数2)=>{
// 逻辑


---

## 第 241 页

},this);
*
// 在某处满足条件时则：（其中参数可以自定义传递）
EventUtils.happen(obj,XXX.EVENT_XXX,[参数1,参数2]);
*
Created by 黑暗之神KDS on 2017-08-22 20:52:51.
*/
declare class EventUtils {
/**
注册事件
@param obj 事件对象
@param type 类型
@param callBack 回调
@param isOnce [可选] 默认值=false 是否执行一次 默认 false
*/
static addEventListener(obj: any, type: string, callBack: Callback, isOnce?: boolean): void;
/**
注册事件-函数和作用域版
@param obj 事件对象
@param type 类型
@param onHappen 回调方法
@param thisPtr 回调时作用域
@param args [可选] 默认值=null 回调时参数
@param isOnce [可选] 默认值=false 是否执行一次
*/
static addEventListenerFunction(obj: any, type: string, onHappen: Function, thisPtr: any, 
args?: any[], isOnce?: boolean): void;
/**
移除事件
@param obj 事件对象
@param type 类型
@param callBack 回调
*/
static removeEventListener(obj: any, type: string, callBack: Callback): void;
/**
移除事件-函数和作用域版
@param obj 事件对象
@param type 类型
@param onHappen 回调方法


---

## 第 242 页

@param thisPtr 回调时作用域
*/
static removeEventListenerFunction(obj: any, type: string, onHappen: Function, thisPtr: 
any): void;
/**
派发事件，若注册时存在参数的话参数优先为注册的参数，再追加这里派发的参数args
@param obj 事件对象
@param type 类型
@param args [可选] 默认值=null 自定义的参数，传递后可以出现在函数回调中
*/
static happen(obj: any, type: string, args?: any[]): void;
/**
清空事件
@param obj 事件对象
@param type [可选] 默认值=null 类型，如果为null表示全部
*/
static clear(obj: any, type?: string): void;
}
/**
文件操作工具
一般用于文本文件 如JSON/XML等储存数据格式的文件
Created by 黑暗之神KDS on 2018-06-22 21:37:50.
*/
declare class FileUtils {
/**
是否拥有文件系统权限：如写入文件、获取目录下全部文件列表等
*/
static get hasFileOperationJurisdiction(): boolean;
/**
文件（夹）是否存在
-- 需要满足 FileUtils.hasFileOperationJurisdiction
@param localURL 相对路径，如asset/json/xxx.json 
@param onFin 当检查完毕时 onFin(isExists:boolean)
*/
static exists(localURL: string, onFin: Callback): void;
/**
【仅PC端游戏有效】获取指定目录下的所有文件或文件夹（不包含子文件夹内的文件）
-- 需要满足 FileUtils.hasFileOperationJurisdiction
@param directoryLocalPath 文件目录地址 如 asset/xxx
@param onFin 完成时回调 onFin(fos:
{localPath:string,fileName:string,isDirectory:boolean}[])  比如fileName=xxx.png 
localPath=asset/xxx.png，如果fos为空则表示获取失败
*/


---

## 第 243 页

static getDirectoryListing(directoryLocalPath: string, onFin: Callback): void;
/**
【仅PC端游戏有效】获取指定目录下的所有文件或文件夹（包含子文件夹内的文件）
-- 需要满足 FileUtils.hasFileOperationJurisdiction
@param directoryLocalPath 文件目录地址 如 asset/xxx
@param onFin 完成时回调 onFin(fos:
{localPath:string,fileName:string,isDirectory:boolean}[])  比如fileName=xxx.png 
localPath=asset/xxx.png，如果fos为空则表示获取失败
*/
static getAllChildFiles(directoryLocalPath: string, onFin: Callback): void;
/**
加载JSON文件
@param localURL 加载文件的地址
@param onFin 加载完成或失败时回调（失败:obj=null）onFin(jsonObj:any)
*/
static loadJsonFile(localURL: string, onFin: Callback): void;
/**
加载文件（文本格式）
@param localURL 加载文件的地址
@param onFin 加载完成或失败时回调（失败:text=null）onFin(text:any)
*/
static loadFile(localURL: string, onFin: Callback): void;
/**
保存文件
-- PC版本保存本地文件
-- WEB版本使用LocalStorage储存
@param dataObject 对象
@param localURL 文件相对地址 ，如asset/xxx.json
@param onFin 当保存完毕时回调
@param format [可选] 默认值=true 是否格式化（JSON格式化）
*/
static save(dataObject: any, localURL: string, onFin: Callback, format?: boolean): void;
/**
删除文件
-- PC版本删除本地文件
-- WEB版本清理对应的LocalStorage
@param localURL 文件相对地址 ，如asset/xxx.json
@param onFin [可选] 默认值=null  是否删除成功 onFin(success:boolean, localURL:string)
*/
static deleteFile(localURL: string, onFin?: Callback): void;
/**
【仅PC端游戏有效】创建文件夹，会创建不存在的目录
-- 需要满足 FileUtils.hasFileOperationJurisdiction


---

## 第 244 页

@param localURL 文件夹相对地址 格式： 如 asset/dir1/dir2/dir3
@param onFin 当完成是回调 onFin(success:boolean,localURL:string)
*/
static createDirectoryForce(localURL: string, onFin: Callback): void;
/**
【仅PC端游戏有效】复制粘贴文件
-- 需要满足 FileUtils.hasFileOperationJurisdiction
@param fromLocalURL 文件来源相对地址 格式： 如 asset/file1.txt
@param toLocalURL 需要粘贴到的相对地址  格式： 如 asset/file2.txt
@param onFin 完成时回调  
onFin(success:boolean,fromLocalURL:string,toLocalURL:string)
@param onProgress [可选] 默认值=null 复制过程函数 
onProgress(currentNum:number,totalNum:number);
*/
static cloneFile(fromLocalURL: string, toLocalURL: string, onFin: Callback, onProgress?: 
Callback): void;
}
/**
音频类
支持平滑过渡音量
支持音调（播放速率）
*
Created by 黑暗之神KDS on 2018-07-27 23:29:00.
*/
declare class GameAudio {
/**
全局背景音乐音量大小 0~1 默认值=1
*/
static bgmVolume: number;
/**
全局环境音效音量大小 0~1 默认值=1
*/
static bgsVolume: number;
/**
全局音效音量大小 0~1 默认值=1
*/
static seVolume: number;
/**
全局语音音量大小 0~1 默认值=1
*/
static tsVolume: number;
/**


---

## 第 245 页

记录上次播放的背景音乐地址
*/
static lastBgmURL: string;
/**
记录上次播放的背景音乐声道对象
*/
static lastBgmSoundChannel: SoundChannel;
/**
记录上次播放的背景音乐音调
*/
static lastBGMPitch: number;
/**
记录上次播放的背景音乐声音大小
*/
static lastBGMVolume: number;
/**
记录上次播放的场景音效地址
*/
static lastBgsURL: string;
/**
记录上次播放的场景音效音调
*/
static lastBGSPitch: number;
/**
记录上次播放的场景音效声音大小
*/
static lastBGSVolume: number;
/**
记录上次播放的场景音效声道对象
*/
static lastBgsSoundChannel: SoundChannel;
/**
播放背景音乐： 地址不相等的情况才重新播放，但音量会改变（如果需要重新播放，可以停
止BGM后再播放）
全局同一时间内只能播放一首背景音乐，如果需要叠加播放音频，请使用playSE
同地址但音调不一致也会重新播放
@param url 背景音乐地址
@param volume 声量大小 0~1
@param loop [可选] 循环次数 默认值=9999
@param isGradient [可选] 是否渐入 默认值=false
@param gradientTime [可选] 渐入时间（毫秒） 默认值=1000
@param pitch [可选] 播放速率（音调） 默认值=1 范围0-2
*/
static playBGM(url: string, volume?: number, loop?: number, isGradient?: boolean, 
gradientTime?: number, pitch?: number): SoundChannel;


---

## 第 246 页

/**
停止播放背景音乐
@param isGradient [可选] 默认值=false 是否渐出
@param gradientTime [可选] 默认值=1000 渐出时间（毫秒）
*/
static stopBGM(isGradient?: boolean, gradientTime?: number): void;
/**
播放环境音效 ： 地址不相等的情况才重新播放，但音量会改变（如果需要重新播放，可以停
止BGM后再播放）
全局同一时间内只能播放一首环境音效，如果需要叠加播放音频，请使用playSE
同地址但音调不一致也会重新播放
@param url 环境音效地址
@param volume 声量大小 0~1
@param loop [可选] 循环次数 默认值=9999
@param isGradient [可选] 是否渐入 默认值=false
@param gradientTime [可选] 渐入时间（毫秒） 默认值=1000
@param pitch [可选] 播放速率 默认值=1 范围0-2
*/
static playBGS(url: string, volume?: number, loop?: number, isGradient?: boolean, 
gradientTime?: number, pitch?: number): SoundChannel;
/**
停止播放环境音效
@param isGradient [可选] 默认值=false 是否渐出
@param gradientTime [可选] 默认值=1000 渐出时间（毫秒）
*/
static stopBGS(isGradient?: boolean, gradientTime?: number): void;
/**
播放音效，播放在场景对象身上时则根据当前场景的镜头与目标的距离来变更声音大小
@param url 音效地址
@param volume [可选] 默认值=1 音量 0~1
@param pitch [可选] 播放速率 默认值=1 范围0-2
@param soc [可选] 默认值=null 音频绑定在场景对象上
*/
static playSE(url: string, volume?: number, pitch?: number, soc?: ClientSceneObject): 
SoundChannel;
/**
停止SE
@param channels [可选] 传入则表示仅停止传入组的音效，否则是全部当前的音效 
SoundChannel | SoundChannel[]
*/
static stopSE(channels?: any): void;
/**
播放语音，播放在场景对象身上时则根据当前场景的镜头与目标的距离来变更声音大小


---

## 第 247 页

@param url 语音音效地址
@param volume [可选] 默认值=1 音量 0~1
@param pitch [可选] 播放速率 默认值=1 范围0-2
@param soc [可选] 默认值=null 音频绑定在场景对象上
*/
static playTS(url: string, volume?: number, pitch?: number, soc?: ClientSceneObject): 
SoundChannel;
/**
停止语音
@param channels [可选] 默认值=null 传入则表示仅停止传入组的音效，否则是全部当前的音
效 SoundChannel | SoundChannel[]
*/
static stopTS(channels?: any): void;
/**
设置当失去焦点时是否停止音乐
@param isStop 是否停止
*/
static setBlurStopMusic(isStop: boolean): void;
}
/**
游戏总管理基类
实际游戏会创建具体类继承于该类，方便属性指向上层的自定义类
通常情况下需要使用Game变量来创建该类或其子类的实例：var Game = new GameBase();
*
Created by 黑暗之神KDS on 2018-07-28 20:49:42.
*/
declare class GameBase {
/**
暂停状态改变事件派发
EventUtils.addEventListenerFunction(Game, Game.EVENT_PAUSE_CHANGE, 
this.onPauseChange, this);
*/
EVENT_PAUSE_CHANGE: string;
/**
游戏总层次
*/
layer: GameLayer;
/**
当前的场景，默认是[ClientScene]的EMPTY，项目层在实现场景更换时需要设置此值
*/
currentScene: ClientScene;
/**


---

## 第 248 页

我的玩家对象
*/
player: ClientPlayer;
/**
游戏内一个单位帧的时间
*/
get oneFrame(): number;
/**
游戏时间戳：游戏启动时到现在的时间
-- 读档会恢复存档的游戏时间戳
-- 暂停游戏会导致该时间被暂停
*/
get now(): number;
/**
游戏帧计数：游戏启动时到现在的帧总数
-- 暂停游戏会导致该帧计数被暂停
*/
get frameCount(): number;
/**
游戏时间暂停（影响系统是否静止以及上层逻辑可以根据此项来编写静止效果）
系统预设是对于场景效果的禁止，包含如下：
-- 场景图层渲染
-- 场景对象刷新（暂停期间不再调用场景对象的update函数）
*/
pause: boolean;
}
/**
游戏客户端指令处理
主要功能：
-- 用于配合自定义指令的制作
-- 触发事件：场景事件、场景对象事件、界面事件、独立的事件库事件（而片段事件的触发参考
[CommandPage]）
-- 提交玩家的输入
*
Created by 黑暗之神KDS on 2019-01-12 08:01:14.
*/
declare class GameCommand {
/**
指令状态：继续
*/
static COMMAND_STATE_CONTINUE: number;
/**


---

## 第 249 页

指令状态：终止
*/
static COMMAND_STATE_STOP: number;
/**
指令状态：需要玩家输入
*/
static COMMAND_STATE_NEED_INPUT: number;
/**
是否玩家输入中
*/
static isNeedPlayerInput: boolean;
/**
当前需要输入的触发线ID
*/
static inputTriggerLine: number;
/**
启动
一般自定义指令返回COMMAND_STATE_STOP后可以主动调用start重新启动
比如网络内核中为了优化，事件中的等待支持了客户端等待，其实现就是先
COMMAND_STATE_STOP，然后等待N帧后调用此方法继续执行事件
@param triggerLineID [可选] 默认值=null 触发线：当存在时则仅停止该触发线的事件执行，
否则停止全部
*/
static start(triggerLineID?: number): void;
/**
[场景-事件] 主动开始触发该事件
@param indexType 事件类别，0~N 对应自定义的场景中的事件类别
@param inputMessage [可选] 默认值=null 玩家输入值（等同调用事件时传递的参数）
@param onCommandExecuteOver [可选] 默认值=null 当指令执行完毕时回调
@return 是否触发执行成功
*/
static startSceneCommand(indexType: number, inputMessage?: any[], 
onCommandExecuteOver?: Callback): boolean;
/**
[场景对象-事件] 主动开始新触发该事件
@param sceneObjectIndex 场景对象索引（sceneObject.index）
@param indexType 事件类别，0~N 对应自定义的场景对象中的事件类别
@param inputMessage [可选] 默认值=null 玩家输入值（等同调用事件时传递的参数）
@param onCommandExecuteOver [可选] 默认值=null 当指令执行完毕时回调
@param triggerSceneObject [可选] 默认值=null 触发事件的对象，null则表示玩家的场景对
象作为触发事件者


---

## 第 250 页

@return 是否触发执行成功
*/
static startSceneObjectCommand(sceneObjectIndex: number, indexType: number, 
inputMessage?: any[], onCommandExecuteOver?: Callback, triggerSceneObject?: 
ClientSceneObject): boolean;
/**
[界面-事件] 主动开始执行
@param comp 组件，比如界面中的某个按钮
@param indexType 子事件类别，0~N 对应UI的对象中的事件类别
@param inputMessage [可选] 默认值=null 玩家输入值（等同调用事件时传递的参数）
@param onCommandExecuteOver [可选] 默认值=null 当指令执行完毕时回调
@return 是否触发执行成功
*/
static startUICommand(comp: UIBase, indexType: number, inputMessage?: any[], 
onCommandExecuteOver?: Callback): boolean;
/**
[独立事件-事件库事件] 主动开始执行
独立事件会启动一条单独的触发线独立运作，并支持跨场景，直到其执行完毕。
@param id 事件库事件的ID
@param inputMessage [可选] 默认值=null 玩家输入值（等同调用事件时传递的参数）
@param onCommandExecuteOver [可选] 默认值=null 当指令执行完毕时回调
@param triggerSceneObject [可选] 默认值=null 触发事件者，如果为null则表示玩家的场景
对象
@param executorSceneObject [可选] 默认值=null 执行事件者，如果为null则表示玩家的场
景对象
*/
static startCommonCommand(id: number, inputMessage?: any[], 
onCommandExecuteOver?: Callback, triggerSceneObject?: ClientSceneObject, 
executorSceneObject?: ClientSceneObject): void;
/**
输入信息并继续执行下去，事件页的等待玩家输入，将接收到输入的参数。
可以制作如输入名字、密码、QTE系统等等
事件页制作流程：
-- 比如通过调用脚本的方式：inputMessageAndContinueExecute([123]);
-- 事件：等待玩家输入
-- 事件：可以通过变量赋值=玩家输入值  或  文本中显示玩家输入值等等来接收
@param inputMessage [可选] 默认值=null 输入的信息
@param force [可选] 默认值=false 是否强制模式（非强制模式只有客户端判定需要输入时才
发送）
@param delayFrame [可选] 默认值=1 延迟多少帧发送


---

## 第 251 页

@param triggerLineID [可选] 默认值=-1 表示将信息提交到指定的触发器线上，-1表示默认是
GameCommand.inputTriggerLine,即当前系统等待玩家输入的触发线
*/
static inputMessageAndContinueExecute(inputMessage?: any[], force?: boolean, 
delayFrame?: number, triggerLineID?: number): void;
}
/**
自定义模块的游戏数据类
*
制作者更新了数据后，玩家来自存档的数据读取后格式会被修正，
比如旧版本的存档没有的属性或数据格式被修改，会使用预设的默认值
-- 如原来没有age属性，制作者修改后age属性默认值是10,那么玩家读档后该值则是10
-- 如原来存在age属性，数值类型，存档值为20，制作者修改后age是字符串类型，默认值
是"kds"，那么玩家读档后age值为"kds"
*
Created by 黑暗之神KDS on 2019-08-16 17:36:43.
*/
declare class GameData {
/**
获取系统预设的自定义模块数据模型
系统会在初始化时生成一组预设数据，以便获取或参考，比如制作了一个[道具]的模块，并且
填充了10个道具数据，
那么系统在游戏运行时会自动生成这10个道具数据，通过此方法即可获取
@param moduleID 自定义模块ID 1-N（参考编辑器菜单-自定义编辑器-模块制作器）
@param dataID 数据的ID
@return [Module_???] 返回自定义的模块类型，根据模块名称（如Module_Actor）
*/
static getModuleData(moduleID: number, dataID: number): any;
/**
新建一个指定模块的数据
如果是副本数据：数据与原数据已脱离关系，原数据的更改不会影响该数据的更改，该数据的
值来自存档值。
比如一件装备原始攻击+10，而极品装备攻击+15，即使调整了原始数据攻击变为25后，该装
备攻击仍然是15
如果不是副本数据：则是引用原数据的关系，数据仍使用原模型数据的值。
比如一件装备原始攻击+10，你获得后，设计人员调整了攻击变为25后，该件装备会自动变为
攻击+25
@param moduleID 自定义模块ID 1-N
@param dataID 数据ID
@param isCopy [可选] 默认值=true 是否是数据副本


---

## 第 252 页

@return [Module_???] 返回自定义的模块类型
*/
static newModuleData(moduleID: number, dataID: number, isCopy?: boolean): any;
/**
更改模块数据为副本模式，使用此函数可以将引用关系的数据转化为副本
@param data 模块数据
@param moduleID 模块编号
*/
static changeModuleDataToCopyMode(data: any, moduleID: number): void;
/**
判断数据是否是副本模式
@param data 模块数据
@return 是否副本模式
*/
static isCopyModeData(data: any): boolean;
/**
获取指定模块的数据总长度（编辑器的对于该模块的更改最大值可以修改）
如获取自定义模块[道具]的总数据长度
@param moduleID 自定义模块ID 1-N
@param typeID [可选] 默认值=1 类型1-16
@return [number] 数据总长度
*/
static getLength(moduleID: number, typeID?: number): number;
}


---

