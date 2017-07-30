"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var data_1 = require("@orbit/data");
var utils_1 = require("@orbit/utils");
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["None"] = 0] = "None";
    LogLevel[LogLevel["Errors"] = 1] = "Errors";
    LogLevel[LogLevel["Warnings"] = 2] = "Warnings";
    LogLevel[LogLevel["Info"] = 3] = "Info";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
/**
 * The Coordinator class manages a set of sources to which it applies a set of
 * coordination strategies.
 *
 * @export
 * @class Coordinator
 */
var Coordinator = (function () {
    function Coordinator(options) {
        if (options === void 0) { options = {}; }
        var _this = this;
        this._sources = {};
        this._strategies = {};
        if (options.sources) {
            options.sources.forEach(function (source) { return _this.addSource(source); });
        }
        if (options.strategies) {
            options.strategies.forEach(function (strategy) { return _this.addStrategy(strategy); });
        }
        this._defaultActivationOptions = options.defaultActivationOptions || {};
        if (this._defaultActivationOptions.logLevel === undefined) {
            this._defaultActivationOptions.logLevel = LogLevel.Info;
        }
    }
    Coordinator.prototype.addSource = function (source) {
        var name = source.name;
        utils_1.assert("Sources require a 'name' to be added to a coordinator.", !!name);
        utils_1.assert("A source named '" + name + "' has already been added to this coordinator.", !this._sources[name]);
        utils_1.assert("A coordinator's sources can not be changed while it is active.", !this._activated);
        this._sources[name] = source;
    };
    Coordinator.prototype.removeSource = function (name) {
        var source = this._sources[name];
        utils_1.assert("Source '" + name + "' has not been added to this coordinator.", !!source);
        utils_1.assert("A coordinator's sources can not be changed while it is active.", !this._activated);
        delete this._sources[name];
    };
    Coordinator.prototype.getSource = function (name) {
        return this._sources[name];
    };
    Object.defineProperty(Coordinator.prototype, "sources", {
        get: function () {
            return utils_1.objectValues(this._sources);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Coordinator.prototype, "sourceNames", {
        get: function () {
            return Object.keys(this._sources);
        },
        enumerable: true,
        configurable: true
    });
    Coordinator.prototype.addStrategy = function (strategy) {
        var name = strategy.name;
        utils_1.assert("A strategy named '" + name + "' has already been added to this coordinator.", !this._strategies[name]);
        utils_1.assert("A coordinator's strategies can not be changed while it is active.", !this._activated);
        this._strategies[name] = strategy;
    };
    Coordinator.prototype.removeStrategy = function (name) {
        var strategy = this._strategies[name];
        utils_1.assert("Strategy '" + name + "' has not been added to this coordinator.", !!strategy);
        utils_1.assert("A coordinator's strategies can not be changed while it is active.", !this._activated);
        delete this._strategies[name];
    };
    Coordinator.prototype.getStrategy = function (name) {
        return this._strategies[name];
    };
    Object.defineProperty(Coordinator.prototype, "strategies", {
        get: function () {
            return utils_1.objectValues(this._strategies);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Coordinator.prototype, "strategyNames", {
        get: function () {
            return Object.keys(this._strategies);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Coordinator.prototype, "activated", {
        get: function () {
            return this._activated;
        },
        enumerable: true,
        configurable: true
    });
    Coordinator.prototype.activate = function (options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        if (!this._activated) {
            if (options.logLevel === undefined) {
                options.logLevel = this._defaultActivationOptions.logLevel;
            }
            this._currentActivationOptions = options;
            this._activated = this.strategies.reduce(function (chain, strategy) {
                return chain
                    .then(function () { return strategy.activate(_this, options); });
            }, data_1.default.Promise.resolve());
        }
        return this._activated;
    };
    Coordinator.prototype.deactivate = function () {
        var _this = this;
        if (this._activated) {
            return this._activated
                .then(function () {
                return _this.strategies.reverse().reduce(function (chain, strategy) {
                    return chain
                        .then(function () { return strategy.deactivate(); });
                }, data_1.default.Promise.resolve());
            })
                .then(function () {
                _this._activated = null;
            });
        }
        else {
            return data_1.default.Promise.resolve();
        }
    };
    return Coordinator;
}());
exports.default = Coordinator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29vcmRpbmF0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzcmMvY29vcmRpbmF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvQ0FHcUI7QUFDckIsc0NBQTBEO0FBUzFELElBQVksUUFLWDtBQUxELFdBQVksUUFBUTtJQUNsQix1Q0FBSSxDQUFBO0lBQ0osMkNBQU0sQ0FBQTtJQUNOLCtDQUFRLENBQUE7SUFDUix1Q0FBSSxDQUFBO0FBQ04sQ0FBQyxFQUxXLFFBQVEsR0FBUixnQkFBUSxLQUFSLGdCQUFRLFFBS25CO0FBTUQ7Ozs7OztHQU1HO0FBQ0g7SUFPRSxxQkFBWSxPQUFnQztRQUFoQyx3QkFBQSxFQUFBLFlBQWdDO1FBQTVDLGlCQWlCQztRQWhCQyxJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztRQUNuQixJQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztRQUV0QixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNwQixPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFBLE1BQU0sSUFBSSxPQUFBLEtBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQXRCLENBQXNCLENBQUMsQ0FBQztRQUM1RCxDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDdkIsT0FBTyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsVUFBQSxRQUFRLElBQUksT0FBQSxLQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxFQUExQixDQUEwQixDQUFDLENBQUM7UUFDckUsQ0FBQztRQUVELElBQUksQ0FBQyx5QkFBeUIsR0FBRyxPQUFPLENBQUMsd0JBQXdCLElBQUksRUFBRSxDQUFDO1FBRXhFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxRQUFRLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztZQUMx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QyxDQUFDO2dCQUN2QyxDQUFDLEVBQUUsY0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1lBQzlCLENBQUMsQ0FBQztpQkFDRCxJQUFJLENBQUM7Z0JBQ0osS0FBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7WUFDekIsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixNQUFNLENBQUMsY0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNqQyxDQUFDO0lBQ0gsQ0FBQztJQUNILGtCQUFDO0FBQUQsQ0FBQyxBQTVIRCxJQTRIQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBPcmJpdCwge1xyXG4gIFNvdXJjZSxcclxuICBUcmFuc2Zvcm1cclxufSBmcm9tICdAb3JiaXQvZGF0YSc7XHJcbmltcG9ydCB7IERpY3QsIGFzc2VydCwgb2JqZWN0VmFsdWVzIH0gZnJvbSAnQG9yYml0L3V0aWxzJztcclxuaW1wb3J0IHsgU3RyYXRlZ3kgfSBmcm9tICcuL3N0cmF0ZWd5JztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQ29vcmRpbmF0b3JPcHRpb25zIHtcclxuICBzb3VyY2VzPzogU291cmNlW107XHJcbiAgc3RyYXRlZ2llcz86IFN0cmF0ZWd5W107XHJcbiAgZGVmYXVsdEFjdGl2YXRpb25PcHRpb25zPzogQWN0aXZhdGlvbk9wdGlvbnM7XHJcbn1cclxuXHJcbmV4cG9ydCBlbnVtIExvZ0xldmVsIHtcclxuICBOb25lLFxyXG4gIEVycm9ycyxcclxuICBXYXJuaW5ncyxcclxuICBJbmZvXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQWN0aXZhdGlvbk9wdGlvbnMge1xyXG4gIGxvZ0xldmVsPzogTG9nTGV2ZWw7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBUaGUgQ29vcmRpbmF0b3IgY2xhc3MgbWFuYWdlcyBhIHNldCBvZiBzb3VyY2VzIHRvIHdoaWNoIGl0IGFwcGxpZXMgYSBzZXQgb2ZcclxuICogY29vcmRpbmF0aW9uIHN0cmF0ZWdpZXMuXHJcbiAqXHJcbiAqIEBleHBvcnRcclxuICogQGNsYXNzIENvb3JkaW5hdG9yXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb29yZGluYXRvciB7XHJcbiAgcHJvdGVjdGVkIF9zb3VyY2VzOiBEaWN0PFNvdXJjZT47XHJcbiAgcHJvdGVjdGVkIF9zdHJhdGVnaWVzOiBEaWN0PFN0cmF0ZWd5PjtcclxuICBwcm90ZWN0ZWQgX2FjdGl2YXRlZDogUHJvbWlzZTxhbnk+O1xyXG4gIHByb3RlY3RlZCBfZGVmYXVsdEFjdGl2YXRpb25PcHRpb25zOiBBY3RpdmF0aW9uT3B0aW9ucztcclxuICBwcm90ZWN0ZWQgX2N1cnJlbnRBY3RpdmF0aW9uT3B0aW9uczogQWN0aXZhdGlvbk9wdGlvbnM7XHJcblxyXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM6IENvb3JkaW5hdG9yT3B0aW9ucyA9IHt9KSB7XHJcbiAgICB0aGlzLl9zb3VyY2VzID0ge307XHJcbiAgICB0aGlzLl9zdHJhdGVnaWVzID0ge307XHJcblxyXG4gICAgaWYgKG9wdGlvbnMuc291cmNlcykge1xyXG4gICAgICBvcHRpb25zLnNvdXJjZXMuZm9yRWFjaChzb3VyY2UgPT4gdGhpcy5hZGRTb3VyY2Uoc291cmNlKSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG9wdGlvbnMuc3RyYXRlZ2llcykge1xyXG4gICAgICBvcHRpb25zLnN0cmF0ZWdpZXMuZm9yRWFjaChzdHJhdGVneSA9PiB0aGlzLmFkZFN0cmF0ZWd5KHN0cmF0ZWd5KSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5fZGVmYXVsdEFjdGl2YXRpb25PcHRpb25zID0gb3B0aW9ucy5kZWZhdWx0QWN0aXZhdGlvbk9wdGlvbnMgfHwge307XHJcblxyXG4gICAgaWYgKHRoaXMuX2RlZmF1bHRBY3RpdmF0aW9uT3B0aW9ucy5sb2dMZXZlbCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHRoaXMuX2RlZmF1bHRBY3RpdmF0aW9uT3B0aW9ucy5sb2dMZXZlbCA9IExvZ0xldmVsLkluZm87XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhZGRTb3VyY2Uoc291cmNlOiBTb3VyY2UpOiB2b2lkIHtcclxuICAgIGNvbnN0IG5hbWUgPSBzb3VyY2UubmFtZTtcclxuXHJcbiAgICBhc3NlcnQoYFNvdXJjZXMgcmVxdWlyZSBhICduYW1lJyB0byBiZSBhZGRlZCB0byBhIGNvb3JkaW5hdG9yLmAsICEhbmFtZSk7XHJcbiAgICBhc3NlcnQoYEEgc291cmNlIG5hbWVkICcke25hbWV9JyBoYXMgYWxyZWFkeSBiZWVuIGFkZGVkIHRvIHRoaXMgY29vcmRpbmF0b3IuYCwgIXRoaXMuX3NvdXJjZXNbbmFtZV0pO1xyXG4gICAgYXNzZXJ0KGBBIGNvb3JkaW5hdG9yJ3Mgc291cmNlcyBjYW4gbm90IGJlIGNoYW5nZWQgd2hpbGUgaXQgaXMgYWN0aXZlLmAsICF0aGlzLl9hY3RpdmF0ZWQpO1xyXG5cclxuICAgIHRoaXMuX3NvdXJjZXNbbmFtZV0gPSBzb3VyY2U7XHJcbiAgfVxyXG5cclxuICByZW1vdmVTb3VyY2UobmFtZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICBsZXQgc291cmNlID0gdGhpcy5fc291cmNlc1tuYW1lXTtcclxuXHJcbiAgICBhc3NlcnQoYFNvdXJjZSAnJHtuYW1lfScgaGFzIG5vdCBiZWVuIGFkZGVkIHRvIHRoaXMgY29vcmRpbmF0b3IuYCwgISFzb3VyY2UpO1xyXG4gICAgYXNzZXJ0KGBBIGNvb3JkaW5hdG9yJ3Mgc291cmNlcyBjYW4gbm90IGJlIGNoYW5nZWQgd2hpbGUgaXQgaXMgYWN0aXZlLmAsICF0aGlzLl9hY3RpdmF0ZWQpO1xyXG5cclxuICAgIGRlbGV0ZSB0aGlzLl9zb3VyY2VzW25hbWVdO1xyXG4gIH1cclxuXHJcbiAgZ2V0U291cmNlKG5hbWU6IHN0cmluZykge1xyXG4gICAgcmV0dXJuIHRoaXMuX3NvdXJjZXNbbmFtZV07XHJcbiAgfVxyXG5cclxuICBnZXQgc291cmNlcygpOiBTb3VyY2VbXSB7XHJcbiAgICByZXR1cm4gb2JqZWN0VmFsdWVzKHRoaXMuX3NvdXJjZXMpO1xyXG4gIH1cclxuXHJcbiAgZ2V0IHNvdXJjZU5hbWVzKCk6IHN0cmluZ1tdIHtcclxuICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLl9zb3VyY2VzKTtcclxuICB9XHJcblxyXG4gIGFkZFN0cmF0ZWd5KHN0cmF0ZWd5OiBTdHJhdGVneSk6IHZvaWQge1xyXG4gICAgY29uc3QgbmFtZSA9IHN0cmF0ZWd5Lm5hbWU7XHJcblxyXG4gICAgYXNzZXJ0KGBBIHN0cmF0ZWd5IG5hbWVkICcke25hbWV9JyBoYXMgYWxyZWFkeSBiZWVuIGFkZGVkIHRvIHRoaXMgY29vcmRpbmF0b3IuYCwgIXRoaXMuX3N0cmF0ZWdpZXNbbmFtZV0pO1xyXG4gICAgYXNzZXJ0KGBBIGNvb3JkaW5hdG9yJ3Mgc3RyYXRlZ2llcyBjYW4gbm90IGJlIGNoYW5nZWQgd2hpbGUgaXQgaXMgYWN0aXZlLmAsICF0aGlzLl9hY3RpdmF0ZWQpO1xyXG5cclxuICAgIHRoaXMuX3N0cmF0ZWdpZXNbbmFtZV0gPSBzdHJhdGVneTtcclxuICB9XHJcblxyXG4gIHJlbW92ZVN0cmF0ZWd5KG5hbWU6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgbGV0IHN0cmF0ZWd5ID0gdGhpcy5fc3RyYXRlZ2llc1tuYW1lXTtcclxuXHJcbiAgICBhc3NlcnQoYFN0cmF0ZWd5ICcke25hbWV9JyBoYXMgbm90IGJlZW4gYWRkZWQgdG8gdGhpcyBjb29yZGluYXRvci5gLCAhIXN0cmF0ZWd5KTtcclxuICAgIGFzc2VydChgQSBjb29yZGluYXRvcidzIHN0cmF0ZWdpZXMgY2FuIG5vdCBiZSBjaGFuZ2VkIHdoaWxlIGl0IGlzIGFjdGl2ZS5gLCAhdGhpcy5fYWN0aXZhdGVkKTtcclxuXHJcbiAgICBkZWxldGUgdGhpcy5fc3RyYXRlZ2llc1tuYW1lXTtcclxuICB9XHJcblxyXG4gIGdldFN0cmF0ZWd5KG5hbWU6IHN0cmluZyk6IFN0cmF0ZWd5IHtcclxuICAgIHJldHVybiB0aGlzLl9zdHJhdGVnaWVzW25hbWVdO1xyXG4gIH1cclxuXHJcbiAgZ2V0IHN0cmF0ZWdpZXMoKTogU3RyYXRlZ3lbXSB7XHJcbiAgICByZXR1cm4gb2JqZWN0VmFsdWVzKHRoaXMuX3N0cmF0ZWdpZXMpO1xyXG4gIH1cclxuXHJcbiAgZ2V0IHN0cmF0ZWd5TmFtZXMoKTogc3RyaW5nW10ge1xyXG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMuX3N0cmF0ZWdpZXMpO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGFjdGl2YXRlZCgpOiBQcm9taXNlPHZvaWRbXT4ge1xyXG4gICAgcmV0dXJuIHRoaXMuX2FjdGl2YXRlZDtcclxuICB9XHJcblxyXG4gIGFjdGl2YXRlKG9wdGlvbnM6IEFjdGl2YXRpb25PcHRpb25zID0ge30pOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIGlmICghdGhpcy5fYWN0aXZhdGVkKSB7XHJcbiAgICAgIGlmIChvcHRpb25zLmxvZ0xldmVsID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBvcHRpb25zLmxvZ0xldmVsID0gdGhpcy5fZGVmYXVsdEFjdGl2YXRpb25PcHRpb25zLmxvZ0xldmVsO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLl9jdXJyZW50QWN0aXZhdGlvbk9wdGlvbnMgPSBvcHRpb25zO1xyXG5cclxuICAgICAgdGhpcy5fYWN0aXZhdGVkID0gdGhpcy5zdHJhdGVnaWVzLnJlZHVjZSgoY2hhaW4sIHN0cmF0ZWd5KSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGNoYWluXHJcbiAgICAgICAgICAudGhlbigoKSA9PiBzdHJhdGVneS5hY3RpdmF0ZSh0aGlzLCBvcHRpb25zKSlcclxuICAgICAgfSwgT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLl9hY3RpdmF0ZWQ7XHJcbiAgfVxyXG5cclxuICBkZWFjdGl2YXRlKCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgaWYgKHRoaXMuX2FjdGl2YXRlZCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5fYWN0aXZhdGVkXHJcbiAgICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgcmV0dXJuIHRoaXMuc3RyYXRlZ2llcy5yZXZlcnNlKCkucmVkdWNlKChjaGFpbiwgc3RyYXRlZ3kpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGNoYWluXHJcbiAgICAgICAgICAgICAgLnRoZW4oKCkgPT4gc3RyYXRlZ3kuZGVhY3RpdmF0ZSgpKTtcclxuICAgICAgICAgIH0sIE9yYml0LlByb21pc2UucmVzb2x2ZSgpKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgIHRoaXMuX2FjdGl2YXRlZCA9IG51bGw7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdfQ==