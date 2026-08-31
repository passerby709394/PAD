var CustomGameNumber;
(function (CustomGameNumber) {
    function f1(trigger, p) {
        if (!Game.currentScene)
            return 0;
        var scene = Game.currentScene;
        if (p.type == 0)
            return scene.id;
        if (p.type == 1)
            return p.isGrid ? scene.gridWidth : scene.width;
        if (p.type == 2)
            return p.isGrid ? scene.gridHeight : scene.height;
        if (p.type == 3)
            return scene.sceneObjects.length - 1;
        if (p.type == 4) {
            var xGrid = p.dataGridUseVar ? Game.player.variable.getVariable(p.x2) : p.x;
            var yGrid = p.dataGridUseVar ? Game.player.variable.getVariable(p.y2) : p.y;
            if (p.dataGridIndex == 0) {
                ProjectUtils.pointHelper.x = xGrid;
                ProjectUtils.pointHelper.y = yGrid;
                var soc = ProjectClientScene.getSceneObjectBySetting(p.dataLayerSoType, p.dataLayerSoIndex, p.dataLayerSoUseVar, p.dataLayerSoVarID, trigger);
                return p.dynamicObs ? (scene.sceneUtils.isObstacleGrid(ProjectUtils.pointHelper, soc) ? 1 : 0) : (scene.sceneUtils.isFixedObstacleGrid(ProjectUtils.pointHelper) ? 1 : 0);
            }
            else {
                return scene.getDataGridState(p.dataGridIndex, xGrid, yGrid);
            }
        }
        if (p.type == 5) {
            if (p.cameraAttr == 0)
                return scene.camera.viewPort.x;
            if (p.cameraAttr == 1)
                return scene.camera.viewPort.y;
            if (p.cameraAttr == 2)
                return scene.camera.scaleX;
            if (p.cameraAttr == 3)
                return scene.camera.scaleY;
            if (p.cameraAttr == 4)
                return scene.camera.rotation;
        }
    }
    CustomGameNumber.f1 = f1;
    function f2(trigger, p) {
        if (!Game.currentScene)
            return 0;
        var so = ProjectClientScene.getSceneObjectBySetting(p.soType, p.no, p.useVar, p.varID, trigger);
        if (!(so instanceof ProjectClientSceneObject) && p.type != 13)
            return 0;
        if (p.type == 0)
            return so.index;
        if (p.type == 1)
            return so.modelID;
        if (p.type == 2) {
            if (p.posMode == 0) {
                return so.x;
            }
            else if (p.posMode == 1) {
                return Math.floor(so.x / Config.SCENE_GRID_SIZE);
            }
            else {
                return Game.currentScene.getGlobalPos(so.x, so.y).x;
            }
        }
        if (p.type == 3) {
            if (p.posMode == 0) {
                return so.y;
            }
            else if (p.posMode == 1) {
                return Math.floor(so.y / Config.SCENE_GRID_SIZE);
            }
            else {
                return Game.currentScene.getGlobalPos(so.x, so.y).y;
            }
        }
        if (p.type == 4)
            return so.avatar.id;
        if (p.type == 5)
            return so.scale;
        if (p.type == 6)
            return so.avatarAlpha;
        if (p.type == 7)
            return so.avatarHue;
        if (p.type == 8)
            return so.avatarFPS;
        if (p.type == 9)
            return so.moveSpeed;
        if (p.type == 10)
            return so.avatar.orientation;
        if (p.type == 11)
            return so.avatar.actionID;
        if (p.type == 12)
            return so.avatar.currentFrame;
        if (p.type == 13) {
            var varName = void 0;
            if (p.customAttr.selectMode == 1) {
                var mode = p.customAttr.inputModeInfo.mode;
                var constName = p.customAttr.inputModeInfo.constName;
                var varNameIndex = p.customAttr.inputModeInfo.varNameIndex;
                varName = mode == 0 ? constName : Game.player.variable.getString(varNameIndex);
            }
            else {
                varName = p.customAttr.varName;
            }
            if (so[varName] == undefined)
                return 0;
            if (p.customAttr.isCustomModule)
                return so[varName].id;
            if (p.customAttr.compAttrEnable) {
                var ui = so[varName];
                if (!ui || !(ui instanceof GUI_BASE))
                    return 0;
                var comp = ui.compsIDInfo[p.customAttr.compInfo.compID];
                if (!comp)
                    return 0;
                return MathUtils.float(comp[p.customAttr.compInfo.varName]);
            }
            else {
                return MathUtils.float(so[varName]);
            }
        }
        if (p.type == 14) {
            var soModule = so.getModule(p.soModuleAttr.moduleID);
            if (!soModule)
                return 0;
            var varName = void 0;
            if (p.soModuleAttr.selectMode == 1) {
                var mode = p.soModuleAttr.inputModeInfo.mode;
                var constName = p.soModuleAttr.inputModeInfo.constName;
                var varNameIndex = p.soModuleAttr.inputModeInfo.varNameIndex;
                varName = mode == 0 ? constName : Game.player.variable.getString(varNameIndex);
            }
            else {
                varName = p.soModuleAttr.varName;
            }
            if (soModule[varName] == undefined)
                return 0;
            if (p.soModuleAttr.isCustomModule)
                return soModule[varName].id;
            if (p.soModuleAttr.compAttrEnable) {
                var ui = soModule[varName];
                if (!ui || !(ui instanceof GUI_BASE))
                    return 0;
                var comp = ui.compsIDInfo[p.soModuleAttr.compInfo.compID];
                if (!comp)
                    return 0;
                return MathUtils.float(comp[p.soModuleAttr.compInfo.varName]);
            }
            else {
                if (soModule[varName] instanceof GCAnimation)
                    return soModule[varName].id;
                else if (soModule[varName] instanceof UIBase)
                    return soModule[varName].guiID;
                else
                    return MathUtils.float(soModule[varName]);
            }
        }
    }
    CustomGameNumber.f2 = f2;
    function f3(trigger, p) {
        if (!Game.currentScene)
            return 0;
        var so1 = ProjectClientScene.getSceneObjectBySetting(p.soType1, p.no1, p.useVar1, p.varID1, trigger);
        if (!so1)
            return 0;
        var so2 = ProjectClientScene.getSceneObjectBySetting(p.soType2, p.no2, p.useVar2, p.varID2, trigger);
        if (!so2)
            return 0;
        if (p.type == 0)
            return GameUtils.getOriByAngle(MathUtils.direction360(so1.x, so1.y, so2.x, so2.y));
        if (p.type == 1) {
            var dis = Point.distance2(so1.x, so1.y, so2.x, so2.y);
            return p.isGrid ? Math.floor(dis / Config.SCENE_GRID_SIZE) : dis;
        }
        if (p.type == 2)
            return p.isGrid ? Math.floor((so2.x - so1.x) / Config.SCENE_GRID_SIZE) : so2.x - so1.x;
        if (p.type == 3)
            return p.isGrid ? Math.floor((so2.y - so1.y) / Config.SCENE_GRID_SIZE) : so2.y - so1.y;
        if (p.type == 4)
            return MathUtils.direction360(so1.x, so1.y, so2.x, so2.y);
    }
    CustomGameNumber.f3 = f3;
    function f4(trigger, p) {
        if (p.type == 0)
            return Game.player.data.gold;
        if (p.type == 1) {
            var itemDS = ProjectPlayer.getItemDS(p.itemID);
            return itemDS ? itemDS.number : 0;
        }
        if (p.type == 2) {
            var varName = void 0;
            if (p.playerData.selectMode == 1) {
                var mode = p.playerData.inputModeInfo.mode;
                var constName = p.playerData.inputModeInfo.constName;
                var varNameIndex = p.playerData.inputModeInfo.varNameIndex;
                varName = mode == 0 ? constName : Game.player.variable.getString(varNameIndex);
            }
            else {
                varName = p.playerData.varName;
            }
            if (Game.player.data[varName] == undefined)
                return 0;
            if (p.playerData.isCustomModule)
                return Game.player.data[varName].id;
            return MathUtils.float(Game.player.data[varName]);
        }
        if (p.type == 3) {
            var actorID = p.actorUseVar ? Game.player.variable.getVariable(p.actorIDVarID) : p.actorID;
            return ArrayUtils.matchAttributesD2(Game.player.data.party, "actor", { id: actorID }, false).length;
        }
        if (p.type == 4) {
            return Game.player.data.party.length;
        }
    }
    CustomGameNumber.f4 = f4;
    function f5(trigger, p) {
        if (p.type == 2) {
            if (!FocusButtonsManager.focus)
                return -1;
            return FocusButtonsManager.focus.selectedIndex;
        }
        var uiID;
        if (p.useVarID) {
            uiID = Game.player.variable.getVariable(p.uiIDVarID);
        }
        else {
            uiID = p.type == 1 ? p.uiComp.uiID : p.uiID;
        }
        var ui = GameUI.get(uiID);
        if (!ui)
            return 0;
        if (p.type == 0) {
            return MathUtils.float(ui[p.uiAttrName]);
        }
        else if (p.type == 1) {
            var comp = ui.compsIDInfo[p.uiComp.compID];
            if (!comp)
                return 0;
            return MathUtils.float(comp[p.uiComp.varName]);
        }
    }
    CustomGameNumber.f5 = f5;
    function f6(trigger, p) {
        if (p.type == 0)
            return stage.mouseX;
        else if (p.type == 1)
            return stage.mouseY;
        else if (p.type == 2) {
            var gridX = Game.currentScene ? (p.isGrid ? Math.floor(Game.currentScene.localX / Config.SCENE_GRID_SIZE) : Game.currentScene.localX) : 0;
            var res = Math.min(Math.max(gridX, 0), (p.isGrid ? Game.currentScene.gridWidth : Game.currentScene.width) - 1);
            return res;
        }
        else if (p.type == 3) {
            var gridY = Game.currentScene ? (p.isGrid ? Math.floor(Game.currentScene.localY / Config.SCENE_GRID_SIZE) : Game.currentScene.localY) : 0;
            var res = Math.min(Math.max(gridY, 0), (p.isGrid ? Game.currentScene.gridHeight : Game.currentScene.height) - 1);
            return res;
        }
        else if (p.type == 4)
            return MouseControl.selectSceneObject && MouseControl.selectSceneObject.inScene ? MouseControl.selectSceneObject.index : -1;
        else if (p.type == 5)
            return ProjectUtils.mouseWhileValue;
        else if (p.type == 6)
            return p.pointKeyboard;
        else if (p.type == 7)
            return ProjectUtils.keyboardEvents.length > 0 ? ProjectUtils.keyboardEvents[ProjectUtils.keyboardEvents.length - 1].keyCode : -1;
        else if (p.type == 8) {
            var keyCode = ProjectUtils.keyboardEvents.length > 0 ? ProjectUtils.keyboardEvents[ProjectUtils.keyboardEvents.length - 1].keyCode : -1;
            if (keyCode == -1)
                return -1;
            var resultI = -1;
            var min = Number.MAX_VALUE;
            for (var i = 0; i < GUI_Setting.SYSTEM_KEYS.length; i++) {
                var keys = GUI_Setting.KEY_BOARD[GUI_Setting.SYSTEM_KEYS[i]].keys;
                if (keys) {
                    var idx = keys.indexOf(keyCode);
                    if (idx != -1 && idx < min) {
                        resultI = i;
                        min = idx;
                    }
                }
            }
            return resultI;
        }
    }
    CustomGameNumber.f6 = f6;
    function f7(trigger, p) {
        var moduleID = p.modelData.moduleID;
        var dataID;
        if (p.modelData.dataIsUseVar) {
            dataID = Game.player.variable.getVariable(p.modelData.dataVarID);
        }
        else {
            dataID = p.modelData.dataID;
        }
        var moduleData = GameData.getModuleData(moduleID, dataID);
        if (!moduleData)
            return 0;
        var varName;
        if (p.modelData.selectMode == 1) {
            var mode = p.modelData.inputModeInfo.mode;
            var constName = p.modelData.inputModeInfo.constName;
            var varNameIndex = p.modelData.inputModeInfo.varNameIndex;
            varName = mode == 0 ? constName : Game.player.variable.getString(varNameIndex);
        }
        else {
            varName = p.modelData.varName;
        }
        if (moduleData[varName] == undefined)
            return 0;
        if (p.modelData.isCustomModule)
            return moduleData[varName].id;
        return MathUtils.float(moduleData[varName]);
    }
    CustomGameNumber.f7 = f7;
    function f8(trigger, p) {
        if (p.type == 0) {
            if (p.presetType == 0)
                return GameAudio.bgmVolume * 100;
            if (p.presetType == 1)
                return GameAudio.bgsVolume * 100;
            if (p.presetType == 2)
                return GameAudio.seVolume * 100;
            if (p.presetType == 3)
                return GameAudio.tsVolume * 100;
        }
        else {
            var varName = void 0;
            if (p.worldData.selectMode == 1) {
                var mode = p.worldData.inputModeInfo.mode;
                var constName = p.worldData.inputModeInfo.constName;
                var varNameIndex = p.worldData.inputModeInfo.varNameIndex;
                varName = mode == 0 ? constName : Game.player.variable.getString(varNameIndex);
            }
            else {
                varName = p.worldData.varName;
            }
            if (WorldData[varName] == undefined)
                return 0;
            if (p.worldData.isCustomModule)
                return WorldData[varName].id;
            return MathUtils.float(WorldData[varName]);
        }
    }
    CustomGameNumber.f8 = f8;
    function f9(trigger, p) {
        switch (p.normalNumber) {
            case 0:
                return !ProjectGame.gameStartTime ? 0 : (Date.now() - ProjectGame.gameStartTime.getTime());
            case 1:
                return !ProjectGame.gameStartTime ? 0 : (Math.floor((Date.now() - ProjectGame.gameStartTime.getTime()) / 1000));
            case 2:
                return !ProjectGame.gameStartTime ? 0 : (Math.floor((Date.now() - ProjectGame.gameStartTime.getTime()) / 60000));
            case 3:
                return !ProjectGame.gameStartTime ? 0 : (Math.floor((Date.now() - ProjectGame.gameStartTime.getTime()) / 3600000));
            case 4:
                return !ProjectGame.gameStartTime ? 0 : (Math.floor((Date.now() - ProjectGame.gameStartTime.getTime()) / 86400000));
            case 5:
                return new Date().getSeconds();
            case 6:
                return new Date().getMinutes();
            case 7:
                return new Date().getHours();
            case 8:
                return new Date().getDay();
            case 9:
                return new Date().getDate();
            case 10:
                return new Date().getMonth() + 1;
            case 11:
                return new Date().getFullYear();
            case 12:
                return GUI_SaveFileManager.currentSveFileIndexInfo ? GUI_SaveFileManager.currentSveFileIndexInfo.id : 0;
            case 13:
                return MathUtils.float(trigger.inputMessage[0]);
            case 14:
                return MathUtils.float(trigger.inputMessage[1]);
            case 15:
                return MathUtils.float(trigger.inputMessage[2]);
            case 16:
                return MathUtils.float(trigger.inputMessage[3]);
            case 17:
                return MathUtils.float(trigger.inputMessage[4]);
            case 18:
                return __fCount;
            case 19:
                return CommandExecute.countDownNowTime;
        }
    }
    CustomGameNumber.f9 = f9;
    function f10(trigger, p) {
        switch (p.type) {
            case 0:
                return GameBattle.battleRound;
            case 1:
                return GameBattle.playerBattlers.length;
            case 2:
                return ArrayUtils.matchAttributes(GameBattle.playerBattlers, { isDead: false }, false).length;
            case 3:
                return GameBattle.enemyBattlers.length;
            case 4:
                return ArrayUtils.matchAttributes(GameBattle.enemyBattlers, { isDead: false }, false).length;
        }
        return 0;
    }
    CustomGameNumber.f10 = f10;
    function f11(trigger, p) {
        if (p.inBattleType == 0) {
            switch (p.type1) {
                case 0:
                    return GUI_Package.actorSelectedIndex;
                case 1:
                    var actorDS = ProjectPlayer.getPlayerActorDSByInPartyIndex(GUI_Package.actorSelectedIndex);
                    return actorDS ? actorDS.actor.id : 0;
                case 2:
                    return GUI_Party.skillSelectedActorIndex;
                case 3:
                    var actorDS = ProjectPlayer.getPlayerActorDSByInPartyIndex(GUI_Party.skillSelectedActorIndex);
                    return actorDS ? actorDS.actor.id : 0;
                case 4:
                    return GUI_Party.skillActorIndex;
                case 5:
                    var actorDS = ProjectPlayer.getPlayerActorDSByInPartyIndex(GUI_Party.skillActorIndex);
                    return actorDS ? actorDS.actor.id : 0;
            }
        }
        else if (p.inBattleType == 1) {
            switch (p.type2) {
                case 0:
                    if (!GameBattleHelper.isInBattle)
                        return -1;
                    return GameBattleAction.fromBattler ? GameBattle.playerBattlers.indexOf(GameBattleAction.fromBattler) : -1;
                case 1:
                    if (!GameBattleHelper.isInBattle)
                        return -1;
                    return GameBattleAction.fromBattler ? GameBattle.enemyBattlers.indexOf(GameBattleAction.fromBattler) : -1;
                case 2:
                    if (!GameBattleHelper.isInBattle)
                        return -1;
                    return GameBattleAction.hitBattler ? GameBattle.playerBattlers.indexOf(GameBattleAction.hitBattler) : -1;
                case 3:
                    if (!GameBattleHelper.isInBattle)
                        return -1;
                    return GameBattleAction.hitBattler ? GameBattle.enemyBattlers.indexOf(GameBattleAction.hitBattler) : -1;
                case 4:
                    if (!GameBattleHelper.isInBattle)
                        return -1;
                    return GameBattleController.currentOperationBattler ? GameBattle.playerBattlers.indexOf(GameBattleController.currentOperationBattler) : -1;
            }
        }
        return 0;
    }
    CustomGameNumber.f11 = f11;
    function f12(trigger, cp) {
        var actor = Game.getActorByCheckType(cp.actorCheckType, cp.actorUseVar, cp.actorID, cp.actorIDVarID, cp.actorInPartyIndexVarIDUseVar, cp.actorInPartyIndex, cp.actorInPartyIndexVarID, cp.enemyInPartyIndexVarIDUseVar, cp.enemyInPartyIndex, cp.enemyInPartyIndexVarID);
        if (!actor && [23].indexOf(cp.actorAttrName) == -1)
            return 0;
        return getActorAttributes(actor, cp.actorAttrName, cp);
    }
    CustomGameNumber.f12 = f12;
    function f13(trigger, p) {
        if (p.type == 0) {
            return MathUtils.int(CustomGameNumber.customDamageLogic_actionType);
        }
        else if (p.type == 1) {
            if (!CustomGameNumber.customDamageLogic_skill)
                return 0;
            if (p.attributeType == 0) {
                return MathUtils.float(CustomGameNumber.customDamageLogic_skill[p.skill.varName]);
            }
            else {
                var res = Game.slotExtendAttributes(CustomGameNumber.customDamageLogic_skill);
                if (!res)
                    return 0;
                var extValue = void 0;
                if (p.attributeType == 1)
                    extValue = res.extendAttributesFixed[p.extendAttribute];
                else if (p.attributeType == 2)
                    extValue = res.extendAttributesFixed[p.extendAttribute];
                else if (p.attributeType == 3)
                    extValue = res.extendAttributesFixed[p.extendAttribute];
                var extendAttributeSetting = Game.extendAttributeSettings[p.extendAttribute];
                if (extendAttributeSetting && p.attributeType == 1) {
                    extValue = Math.max(Math.min(extValue, extendAttributeSetting.upperLimit), extendAttributeSetting.lowerLimit);
                    if (extendAttributeSetting.isinteger)
                        extValue = Math.floor(extValue);
                }
                return extValue;
            }
        }
        else if (p.type == 2) {
            if (!CustomGameNumber.customDamageLogic_item)
                return 0;
            return MathUtils.float(CustomGameNumber.customDamageLogic_item[p.item.varName]);
        }
        else if (p.type == 3) {
            if (!CustomGameNumber.customDamageLogic_status)
                return 0;
            if (p.attributeType == 0) {
                return MathUtils.float(CustomGameNumber.customDamageLogic_status[p.status.varName]);
            }
            else {
                var res = Game.slotExtendAttributes(CustomGameNumber.customDamageLogic_status);
                if (!res)
                    return 0;
                var extValue = void 0;
                if (p.attributeType == 1)
                    extValue = res.extendAttributesFixed[p.extendAttribute];
                else if (p.attributeType == 2)
                    extValue = res.extendAttributesFixed[p.extendAttribute];
                else if (p.attributeType == 3)
                    extValue = res.extendAttributesFixed[p.extendAttribute];
                var extendAttributeSetting = Game.extendAttributeSettings[p.extendAttribute];
                if (extendAttributeSetting && p.attributeType == 1) {
                    extValue = Math.max(Math.min(extValue, extendAttributeSetting.upperLimit), extendAttributeSetting.lowerLimit);
                    if (extendAttributeSetting.isinteger)
                        extValue = Math.floor(extValue);
                }
                return extValue;
            }
        }
    }
    CustomGameNumber.f13 = f13;
    function getActorAttributes(actor, attributeIndex, cp) {
        var trend = cp.trend;
        var extendAttribute = cp.extendAttribute;
        switch (attributeIndex) {
            case 0:
                return actor.id;
            case 1:
                return ProjectPlayer.getPlayerActorIndexByActor(actor);
            case 2:
                return actor.class;
            case 3:
                return GameBattleHelper.getLevelByActor(actor);
            case 4:
                return actor.growUpEnabled ? actor.currentEXP : 0;
            case 5:
                var lv = GameBattleHelper.getLevelByActor(actor);
                return Game.getLevelUpNeedExp(actor, lv);
            case 6:
                return trend && CustomGameNumber.attributeRes ? CustomGameNumber.attributeRes.MaxHP : actor.MaxHP;
            case 7:
                return trend && CustomGameNumber.attributeRes ? CustomGameNumber.attributeRes.MaxSP : actor.MaxSP;
            case 8:
                return actor.hp;
            case 9:
                return actor.sp;
            case 10:
                return trend && CustomGameNumber.attributeRes ? CustomGameNumber.attributeRes.ATK : actor.ATK;
            case 11:
                return trend && CustomGameNumber.attributeRes ? CustomGameNumber.attributeRes.DEF : actor.DEF;
            case 12:
                return trend && CustomGameNumber.attributeRes ? CustomGameNumber.attributeRes.MAG : actor.MAG;
            case 13:
                return trend && CustomGameNumber.attributeRes ? CustomGameNumber.attributeRes.MagDef : actor.MagDef;
            case 14:
                return trend && CustomGameNumber.attributeRes ? CustomGameNumber.attributeRes.HIT : actor.HIT;
            case 15:
                return trend && CustomGameNumber.attributeRes ? CustomGameNumber.attributeRes.CRIT : actor.CRIT;
            case 16:
                return trend && CustomGameNumber.attributeRes ? CustomGameNumber.attributeRes.MagCrit : actor.MagCrit;
            case 17:
                return trend && CustomGameNumber.attributeRes ? CustomGameNumber.attributeRes.DOD : actor.DOD;
            case 18:
                return actor.atkMode;
            case 19:
                return actor.atkMode == 1 ? (actor.atkSkill ? actor.atkSkill.id : -1) : 0;
            case 20:
                return actor.hitFrame;
            case 21:
                return trend && CustomGameNumber.attributeRes ? CustomGameNumber.attributeRes.ActionSpeed : actor.ActionSpeed;
            case 22:
                var attrValue = CustomCompData.getData(actor, cp.actorCustomAttrName, true);
                return MathUtils.float(attrValue);
            case 23:
                var actorInPartyIndex = ProjectPlayer.getPlayerActorIndexByActor(actor);
                if (actorInPartyIndex == -1)
                    return -1;
                else if (actorInPartyIndex == 0)
                    return Game.player.sceneObject.index;
                else {
                    var member = ProjectSceneParty.members[actorInPartyIndex - 1];
                    return member ? member.index : -1;
                }
            case 24:
                return MathUtils.float(trend && CustomGameNumber.attributeRes ? CustomGameNumber.attributeRes.extendAttributes[extendAttribute] : actor.extendAttributes[extendAttribute]);
        }
    }
})(CustomGameNumber || (CustomGameNumber = {}));
//# sourceMappingURL=CustomGameNumber.js.map