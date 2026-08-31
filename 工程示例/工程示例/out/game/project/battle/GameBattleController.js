var GameBattleController = (function () {
    function GameBattleController() {
    }
    GameBattleController.init = function () {
    };
    GameBattleController.start = function () {
        this.currentOperationBattler = null;
        this.playerControlBattlerStage = 0;
        var controllerStage = Browser.onMobile ? GameUI.get(21) : stage;
        controllerStage.on(EventObject.MOUSE_DOWN, this, this.onMouseDown);
        controllerStage.on(EventObject.RIGHT_MOUSE_DOWN, this, this.onRightMouseUp);
        controllerStage.on(EventObject.MOUSE_MOVE, this, this.onMouseMove);
        stage.on(EventObject.KEY_DOWN, this, this.onKeyDown);
        EventUtils.addEventListenerFunction(GUI_BattleSkill, GUI_BattleSkill.EVENT_SELECT_SKILL, this.battleCommand_onSkillSelect, this);
        EventUtils.addEventListenerFunction(GUI_BattleItem, GUI_BattleItem.EVENT_SELECT_ITEM, this.battleCommand_onItemSelect, this);
    };
    GameBattleController.stop = function () {
        var controllerStage = Browser.onMobile ? GameUI.get(21) : stage;
        controllerStage.off(EventObject.MOUSE_DOWN, this, this.onMouseDown);
        controllerStage.off(EventObject.RIGHT_MOUSE_DOWN, this, this.onRightMouseUp);
        controllerStage.off(EventObject.MOUSE_MOVE, this, this.onMouseMove);
        stage.off(EventObject.KEY_DOWN, this, this.onKeyDown);
        EventUtils.removeEventListenerFunction(GUI_BattleSkill, GUI_BattleSkill.EVENT_SELECT_SKILL, this.battleCommand_onSkillSelect, this);
        EventUtils.removeEventListenerFunction(GUI_BattleItem, GUI_BattleItem.EVENT_SELECT_ITEM, this.battleCommand_onItemSelect, this);
    };
    GameBattleController.battleCommand_openAtkIndicator = function () {
        var battler = this.currentOperationBattler;
        if (!battler)
            return;
        var isAtkUseSkill = battler.actor.atkMode != 0;
        var atkSkill = battler.actor.atkSkill;
        if (isAtkUseSkill && atkSkill) {
            this.battleCommand_onSkillSelect(atkSkill);
            return;
        }
        battler.battleCommandType = 0;
        this.openSelectedTargetIndicator(2);
    };
    GameBattleController.battleCommand_onSkillSelect = function (skill, fromItem) {
        if (fromItem === void 0) { fromItem = null; }
        var battler = this.currentOperationBattler;
        this.closeBattlerMenu();
        battler.battleCommandType = 1;
        battler.battleCommandUseSkill = skill;
        battler.battleCommandUseSkillFromItem = fromItem;
        if ((skill.targetType >= 3 && skill.targetType <= 4) || skill.targetType == 0) {
            this.sureSelectBattlerTarget();
        }
        else {
            if (skill.targetType == 1 || skill.targetType == 5) {
                this.openSelectedTargetIndicator(1);
            }
            else {
                this.openSelectedTargetIndicator(0);
            }
        }
    };
    GameBattleController.battleCommand_onItemSelect = function (item) {
        this.closeBattlerMenu();
        this.currentOperationBattler.battleCommandType = 2;
        this.currentOperationBattler.battleCommandUseItem = item;
        if (item.releaseSkill) {
            var skill = GameData.getModuleData(8, item.skill);
            if (skill) {
                this.battleCommand_onSkillSelect(skill, item);
                return;
            }
        }
        this.openSelectedTargetIndicator(1);
    };
    GameBattleController.battleCommand_defend = function () {
        var battler = this.currentOperationBattler;
        if (!battler)
            return;
        battler.battleCommandType = 3;
        this.sureSelectBattlerTarget();
    };
    GameBattleController.battleCommand_autoBattle = function () {
        var battler = this.currentOperationBattler;
        if (!battler)
            return;
        battler.actor.AI = true;
        battler.battleCommandType = null;
        var battleUI = GameUI.get(21);
        var playerActorIndex = GameBattle.playerBattlers.indexOf(battler);
        battleUI.refreshActorPanel(playerActorIndex);
        this.sureSelectBattlerTarget();
    };
    GameBattleController.openBattlerMenu = function (battler) {
        GameBattleController.currentOperationBattler = battler;
        GameCommand.startCommonCommand(15014);
    };
    GameBattleController.closeBattlerMenu = function () {
        GameCommand.startCommonCommand(15015);
    };
    GameBattleController.openBattleCommonMenu = function () {
        GameCommand.startCommonCommand(15016);
    };
    GameBattleController.closeBattleCommonMenu = function () {
        GameCommand.startCommonCommand(15017);
    };
    GameBattleController.reOpenSkillMenu = function () {
        GameCommand.startCommonCommand(15020);
    };
    GameBattleController.closeSkillMenu = function () {
        GameCommand.startCommonCommand(15019);
    };
    GameBattleController.reOpenItemMenu = function () {
        GameCommand.startCommonCommand(15023);
    };
    GameBattleController.closeItemMenu = function () {
        GameCommand.startCommonCommand(15022);
    };
    GameBattleController.openStatusMenu = function () {
        GameCommand.startCommonCommand(15024);
    };
    GameBattleController.closeStatusMenu = function () {
        GameCommand.startCommonCommand(15025);
    };
    GameBattleController.closeMenu = function () {
        var battleMenus = [[26, this.closeStatusMenu], [24, this.closeSkillMenu], [25, this.closeItemMenu]];
        for (var i = 0; i < battleMenus.length; i++) {
            var battleMenuInfo = battleMenus[i];
            var uiID = battleMenuInfo[0];
            var closeFunction = battleMenuInfo[1];
            var battlerMenu = GameUI.get(uiID);
            if (battlerMenu && battlerMenu.stage) {
                closeFunction.apply(this);
                return true;
            }
        }
        return false;
    };
    GameBattleController.onKeyDown = function (e) {
        if (!GameBattle.playerControlEnabled || GameDialog.isInDialog)
            return;
        if (GUI_Setting.IS_KEY(e.keyCode, GUI_Setting.KEY_BOARD.B)) {
            this.onControllerBack();
        }
        else if (GUI_Setting.IS_KEY(e.keyCode, GUI_Setting.KEY_BOARD.A)) {
            this.onControllerSure();
        }
        else if (GUI_Setting.IS_KEY(e.keyCode, GUI_Setting.KEY_BOARD.UP)) {
            if (this.playerControlBattlerStage == GameBattleController.OPEN_SELECT_TARGET_INDICATOR)
                GameBattleController.selectNextTarget(8);
        }
        else if (GUI_Setting.IS_KEY(e.keyCode, GUI_Setting.KEY_BOARD.DOWN)) {
            if (this.playerControlBattlerStage == GameBattleController.OPEN_SELECT_TARGET_INDICATOR)
                GameBattleController.selectNextTarget(2);
        }
        else if (GUI_Setting.IS_KEY(e.keyCode, GUI_Setting.KEY_BOARD.LEFT)) {
            if (this.playerControlBattlerStage == GameBattleController.OPEN_SELECT_TARGET_INDICATOR)
                GameBattleController.selectNextTarget(4);
        }
        else if (GUI_Setting.IS_KEY(e.keyCode, GUI_Setting.KEY_BOARD.RIGHT)) {
            if (this.playerControlBattlerStage == GameBattleController.OPEN_SELECT_TARGET_INDICATOR)
                GameBattleController.selectNextTarget(6);
        }
    };
    GameBattleController.onMouseDown = function (e) {
        if (!GameBattle.playerControlEnabled || GameDialog.isInDialog)
            return;
        this.onControllerSure(true);
    };
    GameBattleController.onRightMouseUp = function () {
        if (!GameBattle.playerControlEnabled || GameDialog.isInDialog)
            return;
        this.onControllerBack();
    };
    GameBattleController.onMouseMove = function () {
        if (this.playerControlBattlerStage == GameBattleController.OPEN_SELECT_TARGET_INDICATOR) {
            var targetBattler = this.getMouseTarget();
            if (targetBattler)
                this.selectTarget(targetBattler);
        }
    };
    GameBattleController.onControllerSure = function (checkTarget) {
        if (checkTarget === void 0) { checkTarget = false; }
        if (GameBattleHelper.isOpendBattleMenu)
            return;
        if (this.playerControlBattlerStage > 0) {
            switch (this.playerControlBattlerStage) {
                case GameBattleController.OPEN_SELECT_TARGET_INDICATOR:
                    this.sureSelectBattlerTarget(checkTarget);
                    return;
            }
        }
    };
    GameBattleController.onControllerBack = function () {
        var isClosedMenu = this.closeMenu();
        if (isClosedMenu)
            return;
        if (this.playerControlBattlerStage > 0) {
            switch (this.playerControlBattlerStage) {
                case GameBattleController.OPEN_SELECT_TARGET_INDICATOR:
                    this.cancelSelectTargetIndicator();
                    break;
            }
            return;
        }
        GameBattle.lastPlayerBattlerControl();
    };
    GameBattleController.getMouseTarget = function () {
        var selBattlers = this.selectedTargetBattlers.concat();
        selBattlers.sort(function (a, b) { return a.y > b.y ? -1 : 1; });
        for (var i = 0; i < selBattlers.length; i++) {
            var targetBattler = selBattlers[i];
            if (GameBattleHelper.canSelectedTarget(targetBattler) && targetBattler.avatar.hitTestPoint(stage.mouseX, stage.mouseY)) {
                return targetBattler;
            }
        }
        return null;
    };
    GameBattleController.openSelectedTargetIndicator = function (mode) {
        var targetBattlers;
        switch (mode) {
            case 0:
                targetBattlers = GameBattle.enemyBattlers;
                break;
            case 1:
                targetBattlers = GameBattle.playerBattlers;
                break;
            case 2:
                if (WorldData.allowAtkOwnUnit) {
                    targetBattlers = GameBattle.enemyBattlers.concat(GameBattle.playerBattlers);
                }
                else {
                    targetBattlers = this.currentOperationBattler.isEnemy ? GameBattle.playerBattlers : GameBattle.enemyBattlers;
                }
                ArrayUtils.remove(targetBattlers, this.currentOperationBattler);
                break;
        }
        targetBattlers = GameBattleHelper.getCanSelectBattlers(targetBattlers);
        this.selectedTargetBattlers = targetBattlers;
        this.selectTarget(targetBattlers[0]);
        this.playerControlBattlerStage = this.OPEN_SELECT_TARGET_INDICATOR;
    };
    GameBattleController.selectTarget = function (battler) {
        if (this.selectedTargetBattler == battler)
            return;
        if (this.selectedTargetBattler) {
            GameCommand.startCommonCommand(14032, [], null, this.selectedTargetBattler, this.selectedTargetBattler);
        }
        this.selectedTargetBattler = battler;
        if (this.selectedTargetBattler) {
            GameCommand.startCommonCommand(14031, [], null, this.selectedTargetBattler, this.selectedTargetBattler);
        }
    };
    GameBattleController.selectNextTarget = function (dir) {
        var idx = this.selectedTargetBattlers.indexOf(this.selectedTargetBattler);
        if (idx >= 0) {
            var toIdx = ProjectUtils.groupElementsMoveIndex(this.selectedTargetBattlers, idx, dir);
            if (toIdx == null || toIdx < 0)
                return;
            this.selectTarget(this.selectedTargetBattlers[toIdx]);
            GameAudio.playSE(ClientWorld.data.selectSE);
        }
    };
    GameBattleController.sureSelectBattlerTarget = function (checkTarget) {
        if (checkTarget === void 0) { checkTarget = false; }
        if (checkTarget) {
            var targetBattler = this.getMouseTarget();
            if (targetBattler && targetBattler != this.selectedTargetBattler) {
                this.selectTarget(targetBattler);
                return;
            }
            if (!Browser.onPC && !(targetBattler && targetBattler == this.selectedTargetBattler)) {
                return;
            }
        }
        this.closeBattlerMenu();
        this.playerControlBattlerStage = 0;
        this.currentOperationBattler.commandControlComplete = true;
        this.currentOperationBattler.battleCommandApplyTarget = this.selectedTargetBattler;
        this.selectTarget(null);
        GameBattle.nextPlayerBattlerControl();
    };
    GameBattleController.cancelSelectTargetIndicator = function () {
        var battler = this.currentOperationBattler;
        this.playerControlBattlerStage = 0;
        switch (battler.battleCommandType) {
            case 1:
                if (battler.battleCommandUseSkill == battler.actor.atkSkill) {
                    this.openBattlerMenu(GameBattleController.currentOperationBattler);
                    break;
                }
                else {
                    this.reOpenSkillMenu();
                    break;
                }
            case 2:
                this.reOpenItemMenu();
                break;
            default:
                this.openBattlerMenu(GameBattleController.currentOperationBattler);
                break;
        }
        this.selectTarget(null);
    };
    GameBattleController.OPEN_SELECT_TARGET_INDICATOR = 1;
    GameBattleController.playerControlBattlerStage = 0;
    return GameBattleController;
}());
//# sourceMappingURL=GameBattleController.js.map