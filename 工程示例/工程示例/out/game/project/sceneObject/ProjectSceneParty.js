var ProjectSceneParty = (function () {
    function ProjectSceneParty() {
    }
    ProjectSceneParty.start = function () {
        ProjectSceneParty.pause = false;
        this.createPartyMembers();
        os.add_ENTERFRAME(this.update, this);
    };
    ProjectSceneParty.stop = function () {
        ProjectSceneParty.pause = true;
        this.members.length = 0;
        os.remove_ENTERFRAME(this.update, this);
    };
    ProjectSceneParty.createPartyMembers = function () {
        this.playerTrack.length = 0;
        this.clearPartMemberEntity();
        if (Game.player.data.showPartyMember) {
            for (var i = 1; i < Game.player.data.party.length; i++) {
                var p = Game.player.data.party[i];
                this.addMemberEntity(p);
            }
        }
    };
    ProjectSceneParty.clearPartMemberEntity = function () {
        for (var i = 0; i < this.members.length; i++) {
            var p = this.members[i];
            p.dispose();
        }
        this.members.length = 0;
    };
    ProjectSceneParty.collectQueueMembers = function (clearMembers, onFin) {
        var _this_1 = this;
        if (onFin === void 0) { onFin = null; }
        var frameCount = this.members.length * Game.player.data.partyMemberDis;
        var fixedFrameCount = frameCount;
        this.pause = true;
        os.add_ENTERFRAME(function () {
            _this_1.refreshMembersPos(fixedFrameCount - frameCount);
            frameCount--;
            if (frameCount <= 0) {
                os.remove_ENTERFRAME(arguments.callee, _this_1);
                _this_1.pause = false;
                _this_1.playerTrack.length = 0;
                if (clearMembers) {
                    _this_1.clearPartMemberEntity();
                    Game.player.data.showPartyMember = false;
                }
                onFin && onFin();
            }
        }, this);
    };
    ProjectSceneParty.retorySaveData = function (o) {
        o = SinglePlayerGame.getSaveCustomData("__ProjectScenePartyData");
        if (!o)
            return;
        ProjectSceneParty.members = [];
        for (var i = 0; i < o.members.length; i++) {
            var so = Game.currentScene.sceneObjects[o.members[i]];
            if (so) {
                ProjectSceneParty.members.push(so);
            }
        }
        ProjectSceneParty.playerTrack = o.playerTrack;
        ProjectSceneParty.maxPlayerStep = o.maxPlayerStep;
        ProjectSceneParty.pause = false;
        os.add_ENTERFRAME(this.update, this);
    };
    ProjectSceneParty.getSaveData = function () {
        var members = [];
        for (var i = 0; i < ProjectSceneParty.members.length; i++)
            members.push(ProjectSceneParty.members[i].index);
        return { members: members, playerTrack: ProjectSceneParty.playerTrack, maxPlayerStep: ProjectSceneParty.maxPlayerStep };
    };
    ProjectSceneParty.update = function () {
        if (this.pause)
            return;
        this.refreshMembers();
        this.refreshMembersPos();
    };
    ProjectSceneParty.addMemberEntity = function (ds) {
        var pSo = Game.player.sceneObject;
        var presetSceneObjectData = {
            x: pSo.x,
            y: pSo.y - 1,
            avatarID: ds.actor.avatar,
            avatarAct: 1,
            avatarOri: pSo.avatarOri
        };
        var soc = Game.currentScene.addNewSceneObject(pSo.modelID, presetSceneObjectData);
        this.installActorData(soc, ds);
        this.members.push(soc);
    };
    ProjectSceneParty.refreshMembers = function () {
        if (!Game.player.data.showPartyMember) {
            this.clearPartMemberEntity();
        }
        else {
            if (Game.player.data.party.length - 1 != this.members.length) {
                this.createPartyMembers();
            }
            else {
                for (var i = 1; i < Game.player.data.party.length; i++) {
                    var p = Game.player.data.party[i];
                    var memberEntity = this.members[i - 1];
                    if (memberEntity.avatarID != p.actor.avatar) {
                        this.installActorData(memberEntity, p);
                    }
                }
            }
        }
    };
    ProjectSceneParty.refreshMembersPos = function (collectQueueMembersOffset) {
        if (collectQueueMembersOffset === void 0) { collectQueueMembersOffset = 0; }
        var playerSo = Game.player.sceneObject;
        if (playerSo.isMoving) {
            ProjectSceneParty.maxPlayerStep = Game.player.data.partyMemberDis * (this.members.length + 1);
            this.playerTrack.push({ x: playerSo.x, y: playerSo.y, avatarOri: playerSo.avatarOri });
            if (this.playerTrack.length > ProjectSceneParty.maxPlayerStep) {
                this.playerTrack.shift();
            }
        }
        for (var i = 0; i < this.members.length; i++) {
            var member = this.members[i];
            var memberStepIndex = this.playerTrack.length - (i + 1) * Game.player.data.partyMemberDis + collectQueueMembersOffset;
            if (memberStepIndex < 0)
                memberStepIndex = 0;
            else if (collectQueueMembersOffset && memberStepIndex >= this.playerTrack.length)
                memberStepIndex = this.playerTrack.length - 1;
            var toTrack = this.playerTrack[memberStepIndex];
            if (toTrack) {
                var oldX = member.x, oldY = member.y;
                member.x = toTrack.x;
                member.y = toTrack.y - (collectQueueMembersOffset ? 1 : 0);
                member.avatarOri = toTrack.avatarOri;
                member.avatarAct = (oldX != member.x || oldY != member.y) && member.avatar.hasActionID(2) ? 2 : 1;
            }
            else if (member.avatarAct == 2)
                member.avatarAct = 1;
        }
    };
    ProjectSceneParty.installActorData = function (soc, actorDS) {
        soc.selectEnabled = false;
        soc.through = true;
        soc.autoPlayEnable = true;
        soc.name = actorDS.actor.name;
        var m = ArrayUtils.matchAttributes(Game.player.data.partyFPSSetting, { actor: actorDS.actor.id }, true)[0];
        soc.avatarFPS = m ? m.fps : Game.player.sceneObject.avatarFPS;
    };
    ProjectSceneParty.members = [];
    ProjectSceneParty.playerTrack = [];
    return ProjectSceneParty;
}());
EventUtils.addEventListener(ClientWorld, ClientWorld.EVENT_INITED, Callback.New(function () {
    EventUtils.addEventListenerFunction(GameGate, GameGate.EVENT_IN_SCENE_STATE_CHANGE, function (inNewSceneState) {
        if (GameGate.gateState == GameGate.STATE_2_START_EXECUTE_IN_SCENE_EVENT) {
            if (inNewSceneState != 2) {
                ProjectSceneParty.start();
            }
            else {
                ProjectSceneParty.retorySaveData(SinglePlayerGame.getSaveCustomData("__ProjectScenePartyData"));
            }
        }
        else if (GameGate.gateState == GameGate.STATE_0_START_EXECUTE_LEAVE_SCENE_EVENT) {
            ProjectSceneParty.stop();
        }
    }, _this_1, null);
}, this), true);
SinglePlayerGame.regSaveCustomData("__ProjectScenePartyData", Callback.New(function () {
    return ProjectSceneParty.getSaveData();
}, this));
//# sourceMappingURL=ProjectSceneParty.js.map