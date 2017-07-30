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
var Coordinator = function () {
    function Coordinator(options) {
        if (options === void 0) {
            options = {};
        }
        var _this = this;
        this._sources = {};
        this._strategies = {};
        if (options.sources) {
            options.sources.forEach(function (source) {
                return _this.addSource(source);
            });
        }
        if (options.strategies) {
            options.strategies.forEach(function (strategy) {
                return _this.addStrategy(strategy);
            });
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
        if (options === void 0) {
            options = {};
        }
        if (!this._activated) {
            if (options.logLevel === undefined) {
                options.logLevel = this._defaultActivationOptions.logLevel;
            }
            this._currentActivationOptions = options;
            this._activated = this.strategies.reduce(function (chain, strategy) {
                return chain.then(function () {
                    return strategy.activate(_this, options);
                });
            }, data_1.default.Promise.resolve());
        }
        return this._activated;
    };
    Coordinator.prototype.deactivate = function () {
        var _this = this;
        if (this._activated) {
            return this._activated.then(function () {
                return _this.strategies.reverse().reduce(function (chain, strategy) {
                    return chain.then(function () {
                        return strategy.deactivate();
                    });
                }, data_1.default.Promise.resolve());
            }).then(function () {
                _this._activated = null;
            });
        } else {
            return data_1.default.Promise.resolve();
        }
    };
    return Coordinator;
}();
exports.default = Coordinator;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29vcmRpbmF0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzcmMvY29vcmRpbmF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUJBR3FCO0FBQ3JCLHNCQUEwRDtBQVMxRCxJQUFZLEFBS1g7QUFMRCxXQUFZLEFBQVEsVUFDbEI7cUNBQUksQUFDSjt1Q0FBTSxBQUNOO3lDQUFRLEFBQ1I7cUNBQUksQUFDTixBQUFDO0dBTFcsQUFBUSxXQUFSLFFBQVEsYUFBUixRQUFRLFdBS25CO0FBTUQsQUFNRzs7Ozs7OztBQUNILDhCQU9FO3lCQUFZLEFBQWdDLFNBQWhDO2dDQUFBO3NCQUFnQztBQUE1QztvQkFpQkMsQUFoQkMsQUFBSTthQUFDLEFBQVEsV0FBRyxBQUFFLEFBQUMsQUFDbkIsQUFBSTthQUFDLEFBQVcsY0FBRyxBQUFFLEFBQUMsQUFFdEIsQUFBRSxBQUFDO1lBQUMsQUFBTyxRQUFDLEFBQU8sQUFBQyxTQUFDLEFBQUMsQUFDcEIsQUFBTztvQkFBQyxBQUFPLFFBQUMsQUFBTyxRQUFDLFVBQUEsQUFBTSxRQUFJO3VCQUFBLEFBQUksTUFBQyxBQUFTLFVBQWQsQUFBZSxBQUFNLEFBQUMsQUFBQyxBQUFDLEFBQzVEO0FBQUM7QUFFRCxBQUFFLEFBQUM7WUFBQyxBQUFPLFFBQUMsQUFBVSxBQUFDLFlBQUMsQUFBQyxBQUN2QixBQUFPO29CQUFDLEFBQVUsV0FBQyxBQUFPLFFBQUMsVUFBQSxBQUFRLFVBQUk7dUJBQUEsQUFBSSxNQUFDLEFBQVcsWUFBaEIsQUFBaUIsQUFBUSxBQUFDLEFBQUMsQUFBQyxBQUNyRTtBQUFDO0FBRUQsQUFBSTthQUFDLEFBQXlCLDRCQUFHLEFBQU8sUUFBQyxBQUF3Qiw0QkFBSSxBQUFFLEFBQUMsQUFFeEUsQUFBRSxBQUFDO1lBQUMsQUFBSSxLQUFDLEFBQXlCLDBCQUFDLEFBQVEsYUFBSyxBQUFTLEFBQUMsV0FBQyxBQUFDLEFBQzFELEFBQUk7aUJBQUMsQUFBeUIsMEJBQUMsQUFBUSxX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QyxBQUFPLFFBQUMsQUFBTyxBQUFFLEFBQUMsQUFBQyxBQUM5QixBQUFDLEFBQUM7QUFORyxBQUFJLGVBT1IsQUFBSSxLQUFDLFlBQ0osQUFBSTtzQkFBQyxBQUFVLGFBQUcsQUFBSSxBQUFDLEFBQ3pCLEFBQUMsQUFBQyxBQUFDLEFBQ1A7QUFBQyxBQUFDLEFBQUk7ZUFBQyxBQUFDLEFBQ04sQUFBTTttQkFBQyxPQUFLLFFBQUMsQUFBTyxRQUFDLEFBQU8sQUFBRSxBQUFDLEFBQ2pDLEFBQUMsQUFDSDtBQUFDO0FBQ0g7V0FBQSxBQUFDLEFBNUhELEFBNEhDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE9yYml0LCB7XHJcbiAgU291cmNlLFxyXG4gIFRyYW5zZm9ybVxyXG59IGZyb20gJ0BvcmJpdC9kYXRhJztcclxuaW1wb3J0IHsgRGljdCwgYXNzZXJ0LCBvYmplY3RWYWx1ZXMgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xyXG5pbXBvcnQgeyBTdHJhdGVneSB9IGZyb20gJy4vc3RyYXRlZ3knO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBDb29yZGluYXRvck9wdGlvbnMge1xyXG4gIHNvdXJjZXM/OiBTb3VyY2VbXTtcclxuICBzdHJhdGVnaWVzPzogU3RyYXRlZ3lbXTtcclxuICBkZWZhdWx0QWN0aXZhdGlvbk9wdGlvbnM/OiBBY3RpdmF0aW9uT3B0aW9ucztcclxufVxyXG5cclxuZXhwb3J0IGVudW0gTG9nTGV2ZWwge1xyXG4gIE5vbmUsXHJcbiAgRXJyb3JzLFxyXG4gIFdhcm5pbmdzLFxyXG4gIEluZm9cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBBY3RpdmF0aW9uT3B0aW9ucyB7XHJcbiAgbG9nTGV2ZWw/OiBMb2dMZXZlbDtcclxufVxyXG5cclxuLyoqXHJcbiAqIFRoZSBDb29yZGluYXRvciBjbGFzcyBtYW5hZ2VzIGEgc2V0IG9mIHNvdXJjZXMgdG8gd2hpY2ggaXQgYXBwbGllcyBhIHNldCBvZlxyXG4gKiBjb29yZGluYXRpb24gc3RyYXRlZ2llcy5cclxuICpcclxuICogQGV4cG9ydFxyXG4gKiBAY2xhc3MgQ29vcmRpbmF0b3JcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvb3JkaW5hdG9yIHtcclxuICBwcm90ZWN0ZWQgX3NvdXJjZXM6IERpY3Q8U291cmNlPjtcclxuICBwcm90ZWN0ZWQgX3N0cmF0ZWdpZXM6IERpY3Q8U3RyYXRlZ3k+O1xyXG4gIHByb3RlY3RlZCBfYWN0aXZhdGVkOiBQcm9taXNlPGFueT47XHJcbiAgcHJvdGVjdGVkIF9kZWZhdWx0QWN0aXZhdGlvbk9wdGlvbnM6IEFjdGl2YXRpb25PcHRpb25zO1xyXG4gIHByb3RlY3RlZCBfY3VycmVudEFjdGl2YXRpb25PcHRpb25zOiBBY3RpdmF0aW9uT3B0aW9ucztcclxuXHJcbiAgY29uc3RydWN0b3Iob3B0aW9uczogQ29vcmRpbmF0b3JPcHRpb25zID0ge30pIHtcclxuICAgIHRoaXMuX3NvdXJjZXMgPSB7fTtcclxuICAgIHRoaXMuX3N0cmF0ZWdpZXMgPSB7fTtcclxuXHJcbiAgICBpZiAob3B0aW9ucy5zb3VyY2VzKSB7XHJcbiAgICAgIG9wdGlvbnMuc291cmNlcy5mb3JFYWNoKHNvdXJjZSA9PiB0aGlzLmFkZFNvdXJjZShzb3VyY2UpKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAob3B0aW9ucy5zdHJhdGVnaWVzKSB7XHJcbiAgICAgIG9wdGlvbnMuc3RyYXRlZ2llcy5mb3JFYWNoKHN0cmF0ZWd5ID0+IHRoaXMuYWRkU3RyYXRlZ3koc3RyYXRlZ3kpKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLl9kZWZhdWx0QWN0aXZhdGlvbk9wdGlvbnMgPSBvcHRpb25zLmRlZmF1bHRBY3RpdmF0aW9uT3B0aW9ucyB8fCB7fTtcclxuXHJcbiAgICBpZiAodGhpcy5fZGVmYXVsdEFjdGl2YXRpb25PcHRpb25zLmxvZ0xldmVsID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgdGhpcy5fZGVmYXVsdEFjdGl2YXRpb25PcHRpb25zLmxvZ0xldmVsID0gTG9nTGV2ZWwuSW5mbztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGFkZFNvdXJjZShzb3VyY2U6IFNvdXJjZSk6IHZvaWQge1xyXG4gICAgY29uc3QgbmFtZSA9IHNvdXJjZS5uYW1lO1xyXG5cclxuICAgIGFzc2VydChgU291cmNlcyByZXF1aXJlIGEgJ25hbWUnIHRvIGJlIGFkZGVkIHRvIGEgY29vcmRpbmF0b3IuYCwgISFuYW1lKTtcclxuICAgIGFzc2VydChgQSBzb3VyY2UgbmFtZWQgJyR7bmFtZX0nIGhhcyBhbHJlYWR5IGJlZW4gYWRkZWQgdG8gdGhpcyBjb29yZGluYXRvci5gLCAhdGhpcy5fc291cmNlc1tuYW1lXSk7XHJcbiAgICBhc3NlcnQoYEEgY29vcmRpbmF0b3IncyBzb3VyY2VzIGNhbiBub3QgYmUgY2hhbmdlZCB3aGlsZSBpdCBpcyBhY3RpdmUuYCwgIXRoaXMuX2FjdGl2YXRlZCk7XHJcblxyXG4gICAgdGhpcy5fc291cmNlc1tuYW1lXSA9IHNvdXJjZTtcclxuICB9XHJcblxyXG4gIHJlbW92ZVNvdXJjZShuYW1lOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIGxldCBzb3VyY2UgPSB0aGlzLl9zb3VyY2VzW25hbWVdO1xyXG5cclxuICAgIGFzc2VydChgU291cmNlICcke25hbWV9JyBoYXMgbm90IGJlZW4gYWRkZWQgdG8gdGhpcyBjb29yZGluYXRvci5gLCAhIXNvdXJjZSk7XHJcbiAgICBhc3NlcnQoYEEgY29vcmRpbmF0b3IncyBzb3VyY2VzIGNhbiBub3QgYmUgY2hhbmdlZCB3aGlsZSBpdCBpcyBhY3RpdmUuYCwgIXRoaXMuX2FjdGl2YXRlZCk7XHJcblxyXG4gICAgZGVsZXRlIHRoaXMuX3NvdXJjZXNbbmFtZV07XHJcbiAgfVxyXG5cclxuICBnZXRTb3VyY2UobmFtZTogc3RyaW5nKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fc291cmNlc1tuYW1lXTtcclxuICB9XHJcblxyXG4gIGdldCBzb3VyY2VzKCk6IFNvdXJjZVtdIHtcclxuICAgIHJldHVybiBvYmplY3RWYWx1ZXModGhpcy5fc291cmNlcyk7XHJcbiAgfVxyXG5cclxuICBnZXQgc291cmNlTmFtZXMoKTogc3RyaW5nW10ge1xyXG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMuX3NvdXJjZXMpO1xyXG4gIH1cclxuXHJcbiAgYWRkU3RyYXRlZ3koc3RyYXRlZ3k6IFN0cmF0ZWd5KTogdm9pZCB7XHJcbiAgICBjb25zdCBuYW1lID0gc3RyYXRlZ3kubmFtZTtcclxuXHJcbiAgICBhc3NlcnQoYEEgc3RyYXRlZ3kgbmFtZWQgJyR7bmFtZX0nIGhhcyBhbHJlYWR5IGJlZW4gYWRkZWQgdG8gdGhpcyBjb29yZGluYXRvci5gLCAhdGhpcy5fc3RyYXRlZ2llc1tuYW1lXSk7XHJcbiAgICBhc3NlcnQoYEEgY29vcmRpbmF0b3IncyBzdHJhdGVnaWVzIGNhbiBub3QgYmUgY2hhbmdlZCB3aGlsZSBpdCBpcyBhY3RpdmUuYCwgIXRoaXMuX2FjdGl2YXRlZCk7XHJcblxyXG4gICAgdGhpcy5fc3RyYXRlZ2llc1tuYW1lXSA9IHN0cmF0ZWd5O1xyXG4gIH1cclxuXHJcbiAgcmVtb3ZlU3RyYXRlZ3kobmFtZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICBsZXQgc3RyYXRlZ3kgPSB0aGlzLl9zdHJhdGVnaWVzW25hbWVdO1xyXG5cclxuICAgIGFzc2VydChgU3RyYXRlZ3kgJyR7bmFtZX0nIGhhcyBub3QgYmVlbiBhZGRlZCB0byB0aGlzIGNvb3JkaW5hdG9yLmAsICEhc3RyYXRlZ3kpO1xyXG4gICAgYXNzZXJ0KGBBIGNvb3JkaW5hdG9yJ3Mgc3RyYXRlZ2llcyBjYW4gbm90IGJlIGNoYW5nZWQgd2hpbGUgaXQgaXMgYWN0aXZlLmAsICF0aGlzLl9hY3RpdmF0ZWQpO1xyXG5cclxuICAgIGRlbGV0ZSB0aGlzLl9zdHJhdGVnaWVzW25hbWVdO1xyXG4gIH1cclxuXHJcbiAgZ2V0U3RyYXRlZ3kobmFtZTogc3RyaW5nKTogU3RyYXRlZ3kge1xyXG4gICAgcmV0dXJuIHRoaXMuX3N0cmF0ZWdpZXNbbmFtZV07XHJcbiAgfVxyXG5cclxuICBnZXQgc3RyYXRlZ2llcygpOiBTdHJhdGVneVtdIHtcclxuICAgIHJldHVybiBvYmplY3RWYWx1ZXModGhpcy5fc3RyYXRlZ2llcyk7XHJcbiAgfVxyXG5cclxuICBnZXQgc3RyYXRlZ3lOYW1lcygpOiBzdHJpbmdbXSB7XHJcbiAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5fc3RyYXRlZ2llcyk7XHJcbiAgfVxyXG5cclxuICBnZXQgYWN0aXZhdGVkKCk6IFByb21pc2U8dm9pZFtdPiB7XHJcbiAgICByZXR1cm4gdGhpcy5fYWN0aXZhdGVkO1xyXG4gIH1cclxuXHJcbiAgYWN0aXZhdGUob3B0aW9uczogQWN0aXZhdGlvbk9wdGlvbnMgPSB7fSk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgaWYgKCF0aGlzLl9hY3RpdmF0ZWQpIHtcclxuICAgICAgaWYgKG9wdGlvbnMubG9nTGV2ZWwgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIG9wdGlvbnMubG9nTGV2ZWwgPSB0aGlzLl9kZWZhdWx0QWN0aXZhdGlvbk9wdGlvbnMubG9nTGV2ZWw7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuX2N1cnJlbnRBY3RpdmF0aW9uT3B0aW9ucyA9IG9wdGlvbnM7XHJcblxyXG4gICAgICB0aGlzLl9hY3RpdmF0ZWQgPSB0aGlzLnN0cmF0ZWdpZXMucmVkdWNlKChjaGFpbiwgc3RyYXRlZ3kpID0+IHtcclxuICAgICAgICByZXR1cm4gY2hhaW5cclxuICAgICAgICAgIC50aGVuKCgpID0+IHN0cmF0ZWd5LmFjdGl2YXRlKHRoaXMsIG9wdGlvbnMpKVxyXG4gICAgICB9LCBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuX2FjdGl2YXRlZDtcclxuICB9XHJcblxyXG4gIGRlYWN0aXZhdGUoKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICBpZiAodGhpcy5fYWN0aXZhdGVkKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLl9hY3RpdmF0ZWRcclxuICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICByZXR1cm4gdGhpcy5zdHJhdGVnaWVzLnJldmVyc2UoKS5yZWR1Y2UoKGNoYWluLCBzdHJhdGVneSkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gY2hhaW5cclxuICAgICAgICAgICAgICAudGhlbigoKSA9PiBzdHJhdGVneS5kZWFjdGl2YXRlKCkpO1xyXG4gICAgICAgICAgfSwgT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCkpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5fYWN0aXZhdGVkID0gbnVsbDtcclxuICAgICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIl19