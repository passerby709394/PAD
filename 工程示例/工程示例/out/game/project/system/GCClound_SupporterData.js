var _this = this;
(function () {
    var GCClound_SupporterData = (function () {
        function GCClound_SupporterData() {
        }
        GCClound_SupporterData.init = function () {
            var _this = this;
            this.initCommand();
            window.addEventListener("message", function (event) {
                var allow = false;
                for (var i in _this.whiteOrigins) {
                    var origin = _this.whiteOrigins[i];
                    if (event.origin.indexOf(origin) != -1) {
                        allow = true;
                        break;
                    }
                }
                if (!allow)
                    return;
                var data = event.data;
                if (!data || typeof data != "object")
                    return;
                switch (data.msgType) {
                    case 100001:
                        _this.syncFPValue(data.fp_user, data.fp_game);
                        break;
                    case 1002:
                        break;
                    case 1003:
                        break;
                    default:
                        break;
                }
            });
        };
        GCClound_SupporterData.syncFPValue = function (fp_user, fp_game) {
            if (this.lock_fp_gameMAX == null || fp_game > this.lock_fp_gameMAX) {
                this.lock_fp_gameMAX = fp_game;
            }
            if (fp_game < this.lock_fp_gameMAX) {
                alert("GCClound_SupporterData:Data anomaly 1");
                window.location.reload();
                return;
            }
            var old_fp_cost_value = this.safelyFP_cost;
            if (old_fp_cost_value != ClientWorld.variable.getVariable(WorldData.const_fp_cost_value)) {
                ClientWorld.variable.setVariable(WorldData.const_fp_cost_value, old_fp_cost_value);
                this.onFixed();
            }
            var old_fp_user = this.safelyFP_user;
            if (old_fp_user != ClientWorld.variable.getVariable(WorldData.const_fp_user)) {
                ClientWorld.variable.setVariable(WorldData.const_fp_user, old_fp_user);
                this.onFixed();
            }
            if (old_fp_user != fp_user) {
                ClientWorld.variable.setVariable(WorldData.const_fp_user, fp_user);
            }
            var old_fp_game = this.safelyFP_game;
            if (old_fp_game != ClientWorld.variable.getVariable(WorldData.const_fp_game)) {
                ClientWorld.variable.setVariable(WorldData.const_fp_game, old_fp_game);
                this.onFixed();
            }
            if (old_fp_game != fp_game) {
                var changeValue = fp_game - old_fp_game;
                ClientWorld.variable.setVariable(WorldData.const_fp_changeValue, changeValue);
                ClientWorld.variable.setVariable(WorldData.const_fp_game, fp_game);
                var newCostValue = old_fp_cost_value + changeValue;
                ClientWorld.variable.setVariable(WorldData.const_fp_cost_value, newCostValue);
                this.lock_fp_cost = newCostValue;
                CommandPage.startTriggerFragmentEvent(WorldData.const_fp_changeEvent, Game.player.sceneObject, Game.player.sceneObject);
            }
            else if (this.lock_fp_cost == null) {
                this.lock_fp_cost = ClientWorld.variable.getVariable(WorldData.const_fp_cost_value);
            }
            this.lock_fp_user = fp_user;
            this.lock_fp_game = fp_game;
        };
        GCClound_SupporterData.initCommand = function () {
            var _this = this;
            CommandExecute.customCommand_14001 = function (commandPage, cmd, trigger, triggerPlayer, playerInput, p) {
                if (!trigger || !(trigger instanceof CommandTrigger) || !triggerPlayer || !(triggerPlayer instanceof ClientPlayer))
                    return;
                var safelyFP_cost = _this.safelyFP_cost;
                if (ClientWorld.variable.getVariable(WorldData.const_fp_cost_value) != safelyFP_cost)
                    ClientWorld.variable.setVariable(WorldData.const_fp_cost_value, safelyFP_cost);
                var cost = Math.floor(p.cost);
                if (cost <= 0 || cost > safelyFP_cost)
                    return;
                var newValue = safelyFP_cost - cost;
                ClientWorld.variable.setVariable(WorldData.const_fp_cost_value, newValue);
                _this.lock_fp_cost = newValue;
            };
            Object.defineProperty(CommandExecute, 'customCommand_14001', {
                value: CommandExecute.customCommand_14001,
                writable: false,
                configurable: false,
                enumerable: true
            });
        };
        GCClound_SupporterData.onFixed = function () {
            alert("GCClound_SupporterData:Data anomaly 2");
            window.location.reload();
            return;
        };
        Object.defineProperty(GCClound_SupporterData, "safelyFP_user", {
            get: function () {
                return this.lock_fp_user != null ? this.lock_fp_user : ClientWorld.variable.getVariable(WorldData.const_fp_user);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(GCClound_SupporterData, "safelyFP_game", {
            get: function () {
                return this.lock_fp_game != null ? this.lock_fp_game : ClientWorld.variable.getVariable(WorldData.const_fp_game);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(GCClound_SupporterData, "safelyFP_cost", {
            get: function () {
                return this.lock_fp_cost != null ? this.lock_fp_cost : ClientWorld.variable.getVariable(WorldData.const_fp_cost_value);
            },
            enumerable: false,
            configurable: true
        });
        GCClound_SupporterData.whiteOrigins = ["http://127.0.0.1", "http://localhost",
            "https://gc.gamecreator.com.cn", "https://gamecreator.com.cn",
            "https://www.gamecreator.com.cn", "http://gc.gamecreator.com.cn",
            "https://global.gamecreator.com.cn", "http://global.gamecreator.com.cn"];
        return GCClound_SupporterData;
    }());
    EventUtils.addEventListener(ClientWorld, ClientWorld.EVENT_INITED, Callback.New(function () {
        if (os.platform <= 1) {
            GCClound_SupporterData.init();
            parent.postMessage({ msgType: 1002 }, '*');
        }
    }, _this), true);
})();
var CommandExecute;
(function (CommandExecute) {
    function customCommand_14001(commandPage, cmd, trigger, triggerPlayer, playerInput, p) { }
    CommandExecute.customCommand_14001 = customCommand_14001;
})(CommandExecute || (CommandExecute = {}));
//# sourceMappingURL=GCClound_SupporterData.js.map