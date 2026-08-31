














var GUI_TargetActor = (function (_super) {
    __extends(GUI_TargetActor, _super);
    function GUI_TargetActor() {
        var _this_1 = _super.call(this) || this;
        _this_1.actorList.on(UIList.ITEM_CREATE, _this_1, _this_1.onActorItemCreate);
        return _this_1;
    }
    GUI_TargetActor.prototype.refreshTargetPanel = function () {
        var items = [];
        for (var i = 0; i < Game.player.data.party.length; i++) {
            var d = new ListItem_1015;
            var actorDS = Game.player.data.party[i];
            var actor = actorDS.actor;
            d.data = actorDS;
            var actorClass = GameData.getModuleData(7, actor.class);
            Game.refreshActorAttribute(actor, actorDS.lv);
            d.actorFace = actor.face;
            d.classText = actorClass === null || actorClass === void 0 ? void 0 : actorClass.name;
            d.actorName = actor.name;
            d.classIcon = actorClass === null || actorClass === void 0 ? void 0 : actorClass.icon;
            d.actorLv = actorDS.actor.growUpEnabled ? actorDS.lv.toString() : "--";
            d.hpText = actor.hp.toString();
            d.spText = actor.sp.toString();
            d.hpSlider = actor.hp * 100 / actor.MaxHP;
            d.spSlider = actor.sp * 100 / actor.MaxSP;
            items.push(d);
        }
        this.actorList.items = items;
    };
    GUI_TargetActor.prototype.onActorItemCreate = function (ui, data, index) {
        var actorDS = data.data;
        ui.deadSign.visible = actorDS.actor.dead ? true : false;
    };
    return GUI_TargetActor;
}(GUI_17));
//# sourceMappingURL=GUI_TargetActor.js.map