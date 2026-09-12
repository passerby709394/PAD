/**
 * 该文件为GameCreator编辑器自动生成的代码，请勿修改
 */

/**
 * 1-标题界面 [BASE]
 */
class GUI_1 extends GUI_BASE {
   标题背景:UIBitmap;
   底部装饰:UIBitmap;
   上半圆装饰:UIBitmap;
   下半圆装饰:UIBitmap;
   游戏标题:UIString;
   开始游戏按钮:UIButton;
   读取存档按钮:UIButton;
   游戏设置按钮:UIButton;
   退出游戏按钮:UIButton;
   上装饰:UIBitmap;
   下装饰:UIBitmap;
   constructor(){
      super(1);
   }
}
class ListItem_1 extends UIListItemData {
   标题背景:string;
   底部装饰:string;
   上半圆装饰:string;
   下半圆装饰:string;
   游戏标题:string;
   上装饰:string;
   下装饰:string;
}

/**
 * 2-读档界面 [BASE]
 */
class GUI_2 extends GUI_BASE {
   半透明背景:UIBitmap;
   界面框背景:UIBitmap;
   滚动条背景:UIBitmap;
   list:UIList; // Item=1001
   关闭读档界面按钮:UIButton;
   关闭标志:UIBitmap;
   界面标题背景:UIBitmap;
   界面标题:UIString;
   constructor(){
      super(2);
   }
}
class ListItem_2 extends UIListItemData {
   半透明背景:string;
   界面框背景:string;
   滚动条背景:string;
   list:UIListItemData[];
   关闭标志:string;
   界面标题背景:string;
   界面标题:string;
}

/**
 * 3-菜单界面 [BASE]
 */
class GUI_3 extends GUI_BASE {
   半透明背景:UIBitmap;
   背包按钮:UIButton;
   存档按钮:UIButton;
   读档按钮:UIButton;
   设置按钮:UIButton;
   返回标题界面按钮:UIButton;
   返回游戏按钮:UIButton;
   constructor(){
      super(3);
   }
}
class ListItem_3 extends UIListItemData {
   半透明背景:string;

}

/**
 * 4-背包界面 [BASE]
 */
class GUI_4 extends GUI_BASE {
   半透明背景:UIBitmap;
   道具框背景:UIBitmap;
   说明栏背景:UIBitmap;
   说明栏背景底衬:UIBitmap;
   货币栏背景:UIBitmap;
   滚动条背景:UIBitmap;
   list:UIList; // Item=1002
   itemIntroRoot:UIRoot;
   itemIntro:UIString;
   itemName:UIString;
   关闭背包界面按钮:UIButton;
   关闭标志:UIBitmap;
   界面标题:UIString;
   player0:UIRoot;
   项目背景:UIBitmap;
   lv0:UIString;
   name0:UIString;
   道具背景:UIBitmap;
   icon0:UIBitmap;
   道具框:UIBitmap;
   select0:UIBitmap;
   player1:UIRoot;
   lv1:UIString;
   name1:UIString;
   icon1:UIBitmap;
   select1:UIBitmap;
   player2:UIRoot;
   lv2:UIString;
   name2:UIString;
   icon2:UIBitmap;
   select2:UIBitmap;
   player3:UIRoot;
   lv3:UIString;
   name3:UIString;
   icon3:UIBitmap;
   select3:UIBitmap;
   player4:UIRoot;
   lv4:UIString;
   name4:UIString;
   icon4:UIBitmap;
   select4:UIBitmap;
   teamBuild:UIButton;
   levelUp:UIButton;
   constructor(){
      super(4);
   }
}
class ListItem_4 extends UIListItemData {
   半透明背景:string;
   道具框背景:string;
   说明栏背景:string;
   说明栏背景底衬:string;
   货币栏背景:string;
   滚动条背景:string;
   list:UIListItemData[];
   itemIntro:string;
   itemName:string;
   关闭标志:string;
   界面标题:string;
   项目背景:string;
   lv0:string;
   name0:string;
   道具背景:string;
   icon0:string;
   道具框:string;
   select0:string;
   lv1:string;
   name1:string;
   icon1:string;
   select1:string;
   lv2:string;
   name2:string;
   icon2:string;
   select2:string;
   lv3:string;
   name3:string;
   icon3:string;
   select3:string;
   lv4:string;
   name4:string;
   icon4:string;
   select4:string;

}

/**
 * 5-存档界面 [BASE]
 */
class GUI_5 extends GUI_BASE {
   半透明背景:UIBitmap;
   界面框背景:UIBitmap;
   滚动条背景:UIBitmap;
   list:UIList; // Item=1001
   关闭存档界面按钮:UIButton;
   关闭标志:UIBitmap;
   界面标题背景:UIBitmap;
   界面标题:UIString;
   constructor(){
      super(5);
   }
}
class ListItem_5 extends UIListItemData {
   半透明背景:string;
   界面框背景:string;
   滚动条背景:string;
   list:UIListItemData[];
   关闭标志:string;
   界面标题背景:string;
   界面标题:string;
}

/**
 * 6-系统设置 [BASE]
 */
class GUI_6 extends GUI_BASE {
   半透明背景:UIBitmap;
   设置框背景:UIBitmap;
   typeTab:UITabBox;
   常规:UIRoot;
   bgmFocus:UIButton;
   bgsFocus:UIButton;
   seFocus:UIButton;
   tsFocus:UIButton;
   bgmSlider:UISlider;
   bgsSlider:UISlider;
   seSlider:UISlider;
   tsSlider:UISlider;
   背景音乐音量文本:UIString;
   环境音效音量文本:UIString;
   音效音量文本:UIString;
   语音音量文本:UIString;
   键盘控制:UIRoot;
   键盘滚动条背景:UIBitmap;
   keyboardList:UIList; // Item=1018
   keyboardReset:UIButton;
   手柄控制:UIRoot;
   手柄滚动条背景:UIBitmap;
   gamepadList:UIList; // Item=1019
   gamepadReset:UIButton;
   关闭系统设置界面按钮:UIButton;
   关闭标志:UIBitmap;
   needInputKeyPanel:UIBitmap;
   needInputKeyLabel:UIString;
   constructor(){
      super(6);
   }
}
class ListItem_6 extends UIListItemData {
   半透明背景:string;
   设置框背景:string;
   typeTab:string;
   bgmSlider:number;
   bgsSlider:number;
   seSlider:number;
   tsSlider:number;
   背景音乐音量文本:string;
   环境音效音量文本:string;
   音效音量文本:string;
   语音音量文本:string;
   键盘滚动条背景:string;
   keyboardList:UIListItemData[];
   手柄滚动条背景:string;
   gamepadList:UIListItemData[];
   关闭标志:string;
   needInputKeyPanel:string;
   needInputKeyLabel:string;
}

/**
 * 7-文本输入界面 [BASE]
 */
class GUI_7 extends GUI_BASE {
   界面背景:UIBitmap;
   输入框背景:UIBitmap;
   input:UIInput;
   提交文本输入按钮:UIButton;
   constructor(){
      super(7);
   }
}
class ListItem_7 extends UIListItemData {
   界面背景:string;
   输入框背景:string;
   input:string;

}

/**
 * 8-数字输入界面 [BASE]
 */
class GUI_8 extends GUI_BASE {
   界面背景:UIBitmap;
   输入框背景:UIBitmap;
   input:UIInput;
   提交数字输入按钮:UIButton;
   constructor(){
      super(8);
   }
}
class ListItem_8 extends UIListItemData {
   界面背景:string;
   输入框背景:string;
   input:string;

}

/**
 * 9-密码输入界面 [BASE]
 */
class GUI_9 extends GUI_BASE {
   界面背景:UIBitmap;
   输入框背景:UIBitmap;
   input:UIInput;
   提交密码输入按钮:UIButton;
   constructor(){
      super(9);
   }
}
class ListItem_9 extends UIListItemData {
   界面背景:string;
   输入框背景:string;
   input:string;

}

/**
 * 10-游戏结束界面 [BASE]
 */
class GUI_10 extends GUI_BASE {
   半透明背景:UIBitmap;
   底部装饰:UIBitmap;
   苍之羽标志:UIBitmap;
   GameOver文本:UIString;
   constructor(){
      super(10);
   }
}
class ListItem_10 extends UIListItemData {
   半透明背景:string;
   底部装饰:string;
   苍之羽标志:string;
   GameOver文本:string;
}

/**
 * 11-商店界面 [BASE]
 */
class GUI_11 extends GUI_BASE {
   半透明背景:UIBitmap;
   goodsListBox:UIBitmap;
   文字底衬:UIBitmap;
   文本_商品名称:UIString;
   文本_价格:UIString;
   文本_数量:UIString;
   文本_持有数量:UIString;
   滚动条背景:UIBitmap;
   goodsList:UIList; // Item=1003
   sellItemList:UIList; // Item=1003
   说明栏背景:UIBitmap;
   buyBox:UIRoot;
   buyBoxArea:UIRoot;
   购买数量背景底衬:UIBitmap;
   buyNum_text:UIString;
   sellNum_text:UIString;
   buyNum_text2:UIString;
   subNumBtn:UIButton;
   addNumBtn:UIButton;
   maxNumBtn:UIButton;
   购买数量背景纹路:UIBitmap;
   buyNum:UIString;
   sureBtn:UIButton;
   cancelBtn:UIButton;
   itemBox:UIBitmap;
   说明栏背景底衬:UIBitmap;
   itemName:UIString;
   itemIntroRoot:UIRoot;
   itemIntro:UIString;
   货币栏背景:UIBitmap;
   goldNum:UIString;
   closeBtn:UIButton;
   关闭标志:UIBitmap;
   typeTab:UITabBox;
   我的金币文本:UIString;
   货币图片:UIBitmap;
   constructor(){
      super(11);
   }
}
class ListItem_11 extends UIListItemData {
   半透明背景:string;
   goodsListBox:string;
   文字底衬:string;
   文本_商品名称:string;
   文本_价格:string;
   文本_数量:string;
   文本_持有数量:string;
   滚动条背景:string;
   goodsList:UIListItemData[];
   sellItemList:UIListItemData[];
   说明栏背景:string;
   购买数量背景底衬:string;
   buyNum_text:string;
   sellNum_text:string;
   buyNum_text2:string;
   购买数量背景纹路:string;
   buyNum:string;
   itemBox:string;
   说明栏背景底衬:string;
   itemName:string;
   itemIntro:string;
   货币栏背景:string;
   关闭标志:string;
   typeTab:string;
   我的金币文本:string;
   货币图片:string;
}

/**
 * 12-虚拟按键 [BASE]
 */
class GUI_12 extends GUI_BASE {
   容器:UIRoot;
   A:UIButton;
   B:UIButton;
   START:UIButton;
   BACK:UIButton;
   rockerBg:UIBitmap;
   上标识:UIBitmap;
   右标识:UIBitmap;
   下标识:UIBitmap;
   左标识:UIBitmap;
   rocker:UIBitmap;
   dirBtnRoot:UIRoot;
   上按钮:UIButton;
   下按钮:UIButton;
   左按钮:UIButton;
   右按钮:UIButton;
   隐藏按键:UIButton;
   constructor(){
      super(12);
   }
}
class ListItem_12 extends UIListItemData {
   rockerBg:string;
   上标识:string;
   右标识:string;
   下标识:string;
   左标识:string;
   rocker:string;

}

/**
 * 13-计时器 [BASE]
 */
class GUI_13 extends GUI_BASE {
   图片:UIBitmap;
   time:UIString;
   constructor(){
      super(13);
   }
}
class ListItem_13 extends UIListItemData {
   图片:string;
   time:string;
}

/**
 * 14- [BASE]
 */
class GUI_14 extends GUI_BASE {
   按钮:UIButton;
   测试:UIButton;

   constructor(){
      super(14);
   }
}
class ListItem_14 extends UIListItemData {

}

/**
 * 1001-档案_Item [BASE]
 */
class GUI_1001 extends GUI_BASE {
   项目背景:UIBitmap;
   screenshotImg:UIBitmap;
   截图背景:UIBitmap;
   mapName:UIString;
   dateStr:UIString;
   no:UIString;
   delBtn:UIButton;
   关闭标志:UIBitmap;
   texts:UIRoot;
   游戏时长文本:UIString;
   创建时间文本:UIString;
   gameTimeStr:UIString;
   constructor(){
      super(1001);
   }
}
class ListItem_1001 extends UIListItemData {
   项目背景:string;
   screenshotImg:string;
   截图背景:string;
   mapName:string;
   dateStr:string;
   no:string;
   关闭标志:string;
   游戏时长文本:string;
   创建时间文本:string;
   gameTimeStr:string;
}

/**
 * 1002-道具_Item [BASE]
 */
class GUI_1002 extends GUI_BASE {
   项目背景:UIBitmap;
   itemNum:UIString;
   itemName:UIString;
   道具背景:UIBitmap;
   icon:UIBitmap;
   道具框:UIBitmap;
   constructor(){
      super(1002);
   }
}
class ListItem_1002 extends UIListItemData {
   项目背景:string;
   itemNum:string;
   itemName:string;
   道具背景:string;
   icon:string;
   道具框:string;
}

/**
 * 1003-商品_Item [BASE]
 */
class GUI_1003 extends GUI_BASE {
   项目背景:UIBitmap;
   ownNum:UIString;
   itemNum:UIString;
   道具背景:UIBitmap;
   itemPrice:UIString;
   道具框:UIBitmap;
   itemName:UIString;
   icon:UIBitmap;
   constructor(){
      super(1003);
   }
}
class ListItem_1003 extends UIListItemData {
   项目背景:string;
   ownNum:string;
   itemNum:string;
   道具背景:string;
   itemPrice:string;
   道具框:string;
   itemName:string;
   icon:string;
}

/**
 * 1004-伤害字体 [BASE]
 */
class GUI_1004 extends GUI_BASE {
   text:UIString;
   constructor(){
      super(1004);
   }
}
class ListItem_1004 extends UIListItemData {
   text:string;
}

/**
 * 1005-状态 [BASE]
 */
class GUI_1005 extends GUI_BASE {
   statusImage:UIBitmap;
   statusText:UIString;
   constructor(){
      super(1005);
   }
}
class ListItem_1005 extends UIListItemData {
   statusImage:string;
   statusText:string;
}

/**
 * 1006-提示 [BASE]
 */
class GUI_1006 extends GUI_BASE {
   tip:UIBitmap;
   tipsText:UIString;
   constructor(){
      super(1006);
   }
}
class ListItem_1006 extends UIListItemData {
   tip:string;
   tipsText:string;
}

/**
 * 1007-技能名字 [BASE]
 */
class GUI_1007 extends GUI_BASE {
   tip:UIBitmap;
   tipsText:UIString;
   constructor(){
      super(1007);
   }
}
class ListItem_1007 extends UIListItemData {
   tip:string;
   tipsText:string;
}

/**
 * 1008-按钮选中效果样式1 [BASE]
 */
class GUI_1008 extends GUI_BASE {
   容器:UIRoot;
   target:UIBitmap;
   constructor(){
      super(1008);
   }
}
class ListItem_1008 extends UIListItemData {
   target:string;
}

/**
 * 1009-按钮选中效果样式2 [BASE]
 */
class GUI_1009 extends GUI_BASE {
   容器:UIRoot;
   target:UIBitmap;
   constructor(){
      super(1009);
   }
}
class ListItem_1009 extends UIListItemData {
   target:string;
}

/**
 * 1010-按钮选中效果样式3 [BASE]
 */
class GUI_1010 extends GUI_BASE {
   容器:UIRoot;
   target:UIBitmap;
   constructor(){
      super(1010);
   }
}
class ListItem_1010 extends UIListItemData {
   target:string;
}

/**
 * 1011-技能介绍 [BASE]
 */
class GUI_1011 extends GUI_BASE {
   bg:UIBitmap;
   text:UIString;
   image:UIBitmap;
   intro:UIString;
   constructor(){
      super(1011);
   }
}
class ListItem_1011 extends UIListItemData {
   bg:string;
   text:string;
   image:string;
   intro:string;
}

/**
 * 1012-队长技能 [BASE]
 */
class GUI_1012 extends GUI_BASE {
   bg:UIBitmap;
   text:UIString;
   image:UIBitmap;
   intro:UIString;
   constructor(){
      super(1012);
   }
}
class ListItem_1012 extends UIListItemData {
   bg:string;
   text:string;
   image:string;
   intro:string;
}

/**
 * 1013-升级界面 [BASE]
 */
class GUI_1013 extends GUI_BASE {
   bg:UIBitmap;
   item0:UIRoot;
   项目背景:UIBitmap;
   itemNum0:UIString;
   itemName0:UIString;
   道具背景:UIBitmap;
   icon0:UIBitmap;
   道具框:UIBitmap;
   文本:UIString;
   before:UISlider;
   item1:UIRoot;
   itemNum1:UIString;
   itemName1:UIString;
   icon1:UIBitmap;
   item2:UIRoot;
   itemNum2:UIString;
   itemName2:UIString;
   icon2:UIBitmap;
   item3:UIRoot;
   itemNum3:UIString;
   itemName3:UIString;
   icon3:UIBitmap;
   item4:UIRoot;
   itemNum4:UIString;
   itemName4:UIString;
   icon4:UIBitmap;
   item5:UIRoot;
   itemNum5:UIString;
   itemName5:UIString;
   icon5:UIBitmap;
   item6:UIRoot;
   itemNum6:UIString;
   itemName6:UIString;
   icon6:UIBitmap;
   after:UISlider;
   确认:UIButton;
   返回:UIButton;
   constructor(){
      super(1013);
   }
}
class ListItem_1013 extends UIListItemData {
   bg:string;
   项目背景:string;
   itemNum0:string;
   itemName0:string;
   道具背景:string;
   icon0:string;
   道具框:string;
   文本:string;
   before:number;
   itemNum1:string;
   itemName1:string;
   icon1:string;
   itemNum2:string;
   itemName2:string;
   icon2:string;
   itemNum3:string;
   itemName3:string;
   icon3:string;
   itemNum4:string;
   itemName4:string;
   icon4:string;
   itemNum5:string;
   itemName5:string;
   icon5:string;
   itemNum6:string;
   itemName6:string;
   icon6:string;
   after:number;

}

/**
 * 1014-结算界面 [BASE]
 */
class GUI_1014 extends GUI_BASE {
   图片:UIBitmap;
   win:UIBitmap;
   sure:UIButton;
   list:UIList; // Item=1002
   constructor(){
      super(1014);
   }
}
class ListItem_1014 extends UIListItemData {
   图片:string;
   win:string;
   list:UIListItemData[];
}

/**
 * 1015- [BASE]
 */
class GUI_1015 extends GUI_BASE {

   constructor(){
      super(1015);
   }
}
class ListItem_1015 extends UIListItemData {

}

/**
 * 1016- [BASE]
 */
class GUI_1016 extends GUI_BASE {

   constructor(){
      super(1016);
   }
}
class ListItem_1016 extends UIListItemData {

}

/**
 * 1017- [BASE]
 */
class GUI_1017 extends GUI_BASE {

   constructor(){
      super(1017);
   }
}
class ListItem_1017 extends UIListItemData {

}

/**
 * 1018-设置_Item1 [BASE]
 */
class GUI_1018 extends GUI_BASE {
   项目背景:UIBitmap;
   keyName:UIString;
   key1:UIButton;
   key2:UIButton;
   key3:UIButton;
   key4:UIButton;
   constructor(){
      super(1018);
   }
}
class ListItem_1018 extends UIListItemData {
   项目背景:string;
   keyName:string;

}

/**
 * 1019-设置_Item2 [BASE]
 */
class GUI_1019 extends GUI_BASE {
   项目背景:UIBitmap;
   keyName:UIString;
   key1:UIButton;
   constructor(){
      super(1019);
   }
}
class ListItem_1019 extends UIListItemData {
   项目背景:string;
   keyName:string;

}

/**
 * 1020- [BASE]
 */
class GUI_1020 extends GUI_BASE {

   constructor(){
      super(1020);
   }
}
class ListItem_1020 extends UIListItemData {

}

/**
 * 2001-启动载入界面 [BASE]
 */
class GUI_2001 extends GUI_BASE {
   进度条背景:UIBitmap;
   loadingComp:UISlider;
   动画:UIAnimation;
   constructor(){
      super(2001);
   }
}
class ListItem_2001 extends UIListItemData {
   进度条背景:string;
   loadingComp:number;
   动画:number;
}

/**
 * 2002-新游戏载入界面 [BASE]
 */
class GUI_2002 extends GUI_BASE {
   图片:UIBitmap;
   constructor(){
      super(2002);
   }
}
class ListItem_2002 extends UIListItemData {
   图片:string;
}

/**
 * 2003-读档载入界面 [BASE]
 */
class GUI_2003 extends GUI_BASE {
   图片:UIBitmap;
   constructor(){
      super(2003);
   }
}
class ListItem_2003 extends UIListItemData {
   图片:string;
}

/**
 * 2004-场景载入界面 [BASE]
 */
class GUI_2004 extends GUI_BASE {
   图片:UIBitmap;
   constructor(){
      super(2004);
   }
}
class ListItem_2004 extends UIListItemData {
   图片:string;
}

/**
 * 2005- [BASE]
 */
class GUI_2005 extends GUI_BASE {

   constructor(){
      super(2005);
   }
}
class ListItem_2005 extends UIListItemData {

}

/**
 * 3001-我的自定义界面 [BASE]
 */
class GUI_3001 extends GUI_BASE {
   图片:UIBitmap;
   文本:UIString;
   按钮:UIButton;
   游戏数值:UIString;
   constructor(){
      super(3001);
   }
}
class ListItem_3001 extends UIListItemData {
   图片:string;
   文本:string;

}

/**
 * 3002- [BASE]
 */
class GUI_3002 extends GUI_BASE {

   constructor(){
      super(3002);
   }
}
class ListItem_3002 extends UIListItemData {

}

/**
 * 4001-战斗界面 [BASE]
 */
class GUI_4001 extends GUI_BASE {
   BG:UIBitmap;
   elementBG:UIBitmap;
   element1bg:UIBitmap;
   element1:UIBitmap;
   timeImage:UIBitmap;
   PADtimer:UISlider;
   PADtimerNum:UIString;
   Enemy0:UIAvatar;
   EnemyHP0:UISlider;
   EnemyName0:UIString;
   EnemyHPintro0:UIString;
   EnemyType0:UIBitmap;
   EnemyTimer0:UIString;
   Enemy1:UIAvatar;
   EnemyHP1:UISlider;
   EnemyName1:UIString;
   EnemyHPintro1:UIString;
   EnemyType1:UIBitmap;
   EnemyTimer1:UIString;
   Enemy2:UIAvatar;
   EnemyHP2:UISlider;
   EnemyName2:UIString;
   EnemyHPintro2:UIString;
   EnemyType2:UIBitmap;
   EnemyTimer2:UIString;
   Enemy3:UIAvatar;
   EnemyHP3:UISlider;
   EnemyName3:UIString;
   EnemyHPintro3:UIString;
   EnemyType3:UIBitmap;
   EnemyTimer3:UIString;
   comboText:UIString;
   comboRoot:UIRoot;
   comboImage:UIBitmap;
   PlayerHP:UISlider;
   PlayerHPimage:UIBitmap;
   PlayerHPintro:UIString;
   PlayerActor0:UIBitmap;
   PlayerActor1:UIBitmap;
   PlayerActor2:UIBitmap;
   PlayerActor3:UIBitmap;
   PlayerActor4:UIBitmap;
   容器:UIRoot;
   按钮:UIButton;
   攻击准备:UIButton;
   单体攻击:UIButton;
   全体攻击:UIButton;
   测试面板:UIButton;

   constructor(){
      super(4001);
   }
}
class ListItem_4001 extends UIListItemData {
   BG:string;
   elementBG:string;
   element1bg:string;
   element1:string;
   timeImage:string;
   PADtimer:number;
   PADtimerNum:string;
   Enemy0:number;
   EnemyHP0:number;
   EnemyName0:string;
   EnemyHPintro0:string;
   EnemyType0:string;
   EnemyTimer0:string;
   Enemy1:number;
   EnemyHP1:number;
   EnemyName1:string;
   EnemyHPintro1:string;
   EnemyType1:string;
   EnemyTimer1:string;
   Enemy2:number;
   EnemyHP2:number;
   EnemyName2:string;
   EnemyHPintro2:string;
   EnemyType2:string;
   EnemyTimer2:string;
   Enemy3:number;
   EnemyHP3:number;
   EnemyName3:string;
   EnemyHPintro3:string;
   EnemyType3:string;
   EnemyTimer3:string;
   comboText:string;
   comboImage:string;
   PlayerHP:number;
   PlayerHPimage:string;
   PlayerHPintro:string;
   PlayerActor0:string;
   PlayerActor1:string;
   PlayerActor2:string;
   PlayerActor3:string;
   PlayerActor4:string;

}

/**
 * 15001-俄罗斯方块 [BASE]
 */
class GUI_15001 extends GUI_BASE {
   beiJin:UIBitmap;
   gmaeOverTu:UIBitmap;
   zanTingTu:UIBitmap;
   fenShu:UIString;
   constructor(){
      super(15001);
   }
}
class ListItem_15001 extends UIListItemData {
   beiJin:string;
   gmaeOverTu:string;
   zanTingTu:string;
   fenShu:string;
}
GameUI["__compCustomAttributes"] = {"UIRoot":["enabledLimitView","scrollShowType","hScrollBar","hScrollBg","vScrollBar","vScrollBg","scrollWidth","slowmotionType","enabledWheel","hScrollValue","vScrollValue"],"UIButton":["label","image1","grid9img1","image2","grid9img2","image3","grid9img3","fontSize","color","overColor","clickColor","bold","italic","smooth","align","valign","letterSpacing","font","textDx","textDy","textStroke","textStrokeColor"],"UIBitmap":["image","grid9","flip","isTile","pivotType","isAdaptiveSize"],"UIString":["text","fontSize","color","bold","italic","smooth","align","valign","leading","letterSpacing","font","wordWrap","overflow","shadowEnabled","shadowColor","shadowDx","shadowDy","stroke","strokeColor","onChangeFragEvent"],"UIVariable":["varMode","varID","fontSize","color","bold","italic","smooth","align","valign","leading","letterSpacing","font","wordWrap","overflow","shadowEnabled","shadowColor","shadowDx","shadowDy","stroke","strokeColor","onChangeFragEvent"],"UICustomGameNumber":["customData","previewNum","previewFixed","fontSize","color","bold","italic","smooth","align","valign","leading","letterSpacing","font","wordWrap","overflow","shadowEnabled","shadowColor","shadowDx","shadowDy","stroke","strokeColor"],"UICustomGameString":["customData","inEditorText","fontSize","color","bold","italic","smooth","align","valign","leading","letterSpacing","font","wordWrap","overflow","shadowEnabled","shadowColor","shadowDx","shadowDy","stroke","strokeColor"],"UIAvatar":["avatarID","scaleNumberX","scaleNumberY","orientationIndex","avatarFPS","playOnce","isPlay","avatarFrame","actionID","avatarHue"],"UIStandAvatar":["avatarID","actionID","scaleNumberX","scaleNumberY","flip","playOnce","isPlay","avatarFrame","avatarFPS","avatarHue"],"UIAnimation":["animationID","scaleNumberX","scaleNumberY","aniFrame","playFps","playType","showHitEffect","silentMode"],"UIInput":["text","fontSize","color","prompt","promptColor","bold","italic","smooth","align","leading","font","wordWrap","restrict","inputMode","maxChars","shadowEnabled","shadowColor","shadowDx","shadowDy","onInputFragEvent","onEnterFragEvent"],"UICheckBox":["selected","image1","grid9img1","image2","grid9img2","onChangeFragEvent"],"UISwitch":["switchMode","selected","image1","grid9img1","image2","grid9img2","previewselected","onChangeFragEvent"],"UITabBox":["selectedIndex","itemImage1","grid9img1","itemImage2","grid9img2","itemWidth","itemHeight","items","rowMode","spacing","labelSize","labelColor","labelFont","labelBold","labelItalic","smooth","labelAlign","labelValign","labelLetterSpacing","labelSelectedColor","labelDx","labelDy","labelStroke","labelStrokeColor","onChangeFragEvent"],"UISlider":["image1","bgGrid9","image2","blockGrid9","image3","blockFillGrid9","step","min","max","value","transverseMode","blockFillMode","blockPosMode","fillStrething","isBindingVarID","bindingVarID","onChangeFragEvent"],"UIGUI":["guiID","instanceClassName"],"UIList":["itemModelGUI","previewSize","selectEnable","repeatX","itemWidth","itemHeight","spaceX","spaceY","scrollShowType","hScrollBar","hScrollBg","vScrollBar","vScrollBg","scrollWidth","selectImageURL","selectImageGrid9","selectedImageAlpha","selectedImageOnTop","overImageURL","overImageGrid9","overImageAlpha","overImageOnTop","overSelectMode","slowmotionType","onChangeFragEvent1","onChangeFragEvent2"],"UIComboBox":["itemLabels","selectedIndex","bgSkin","bgGrid9","fontSize","color","bold","italic","smooth","align","valign","letterSpacing","font","textDx","textStroke","textStrokeColor","displayItemSize","listScrollBg","listScrollBar","listAlpha","listBgColor","itemHeight","itemFontSize","itemColor","itemBold","itemItalic","itemAlign","itemValign","itemLetterSpacing","itemFont","itemOverColor","itemOverBgColor","itemTextDx","itemTextDy","itemTextStroke","itemTextStrokeColor","onChangeFragEvent"],"UIVideo":["videoURL","playType","volume","playbackRate","currentTime","muted","loop","pivotType","flip","onLoadedFragEvent","onErrorFragEvent","onCompleteFragEvent"]};
