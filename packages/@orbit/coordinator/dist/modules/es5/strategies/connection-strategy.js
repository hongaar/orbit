"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

var __extends = this && this.__extends || function () {
    var extendStatics = Object.setPrototypeOf || _extends({}, []) instanceof Array && function (d, b) {
        _defaults(d, b);
    } || function (d, b) {
        for (var p in b) {
            if (b.hasOwnProperty(p)) d[p] = b[p];
        }
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
Object.defineProperty(exports, "__esModule", { value: true });
var strategy_1 = require("../strategy");
var utils_1 = require("@orbit/utils");
var ConnectionStrategy = function (_super) {
    __extends(ConnectionStrategy, _super);
    function ConnectionStrategy(options) {
        var _this = this;
        utils_1.assert('A `source` must be specified for a ConnectionStrategy', !!options.source);
        utils_1.assert('`source` should be a Source name specified as a string', typeof options.source === 'string');
        utils_1.assert('`on` should be specified as the name of the event a ConnectionStrategy listens for', typeof options.on === 'string');
        options.sources = [options.source];
        var defaultName = options.source + ":" + options.on;
        delete options.source;
        if (options.target) {
            utils_1.assert('`target` should be a Source name specified as a string', typeof options.target === 'string');
            options.sources.push(options.target);
            defaultName += " -> " + options.target;
            if (typeof options.action === 'string') {
                defaultName += ":" + options.action;
            }
            delete options.target;
        }
        options.name = options.name || defaultName;
        _this = _super.call(this, options) || this;
        _this._event = options.on;
        _this._action = options.action;
        _this._catch = options.catch;
        _this._filter = options.filter;
        _this._blocking = !!options.blocking;
        return _this;
    }
    Object.defineProperty(ConnectionStrategy.prototype, "source", {
        get: function () {
            return this._sources[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConnectionStrategy.prototype, "target", {
        get: function () {
            return this._sources[1];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConnectionStrategy.prototype, "blocking", {
        get: function () {
            return this._blocking;
        },
        enumerable: true,
        configurable: true
    });
    ConnectionStrategy.prototype.activate = function (coordinator, options) {
        var _this = this;
        if (options === void 0) {
            options = {};
        }
        return _super.prototype.activate.call(this, coordinator, options).then(function () {
            _this._listener = _this._generateListener();
            _this.source.on(_this._event, _this._listener, _this);
        });
    };
    ConnectionStrategy.prototype.deactivate = function () {
        var _this = this;
        return _super.prototype.deactivate.call(this).then(function () {
            _this.source.off(_this._event, _this._listener, _this);
            _this._listener = null;
        });
    };
    ConnectionStrategy.prototype._generateListener = function () {
        var _this = this;
        var target = this.target;
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var result;
            if (_this._filter) {
                if (!_this._filter.apply(_this, args)) {
                    return;
                }
            }
            if (typeof _this._action === 'string') {
                result = (_a = _this.target)[_this._action].apply(_a, args);
            } else {
                result = _this._action.apply(_this, args);
            }
            if (_this._catch && result && result.catch) {
                result = result.catch(function (e) {
                    args.unshift(e);
                    return _this._catch.apply(_this, args);
                });
            }
            if (_this._blocking) {
                return result;
            }
            var _a;
        };
    };
    return ConnectionStrategy;
}(strategy_1.Strategy);
exports.ConnectionStrategy = ConnectionStrategy;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29ubmVjdGlvbi1zdHJhdGVneS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9zdHJhdGVnaWVzL2Nvbm5lY3Rpb24tc3RyYXRlZ3kudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSx5QkFBd0Q7QUFPeEQsc0JBQTRFO0FBd0U1RTtBQUF3QyxrQ0FBUTtBQVE5QyxnQ0FBWSxBQUFrQztBQUE5QyxvQkF3QkM7QUF2QkMsZ0JBQU0sT0FBQyxBQUF1RCx5REFBRSxDQUFDLENBQUMsQUFBTyxRQUFDLEFBQU0sQUFBQyxBQUFDO0FBQ2xGLGdCQUFNLE9BQUMsQUFBd0QsMERBQUUsT0FBTyxBQUFPLFFBQUMsQUFBTSxXQUFLLEFBQVEsQUFBQyxBQUFDO0FBQ3JHLGdCQUFNLE9BQUMsQUFBb0Ysc0ZBQUUsT0FBTyxBQUFPLFFBQUMsQUFBRSxPQUFLLEFBQVEsQUFBQyxBQUFDO0FBQzdILEFBQU8sZ0JBQUMsQUFBTyxVQUFHLENBQUMsQUFBTyxRQUFDLEFBQU0sQUFBQyxBQUFDO0FBQ25DLFlBQUksQUFBVyxjQUFNLEFBQU8sUUFBQyxBQUFNLGVBQUksQUFBTyxRQUFDLEFBQUksQUFBQztBQUNwRCxlQUFPLEFBQU8sUUFBQyxBQUFNLEFBQUM7QUFDdEIsQUFBRSxBQUFDLFlBQUMsQUFBTyxRQUFDLEFBQU0sQUFBQyxRQUFDLEFBQUM7QUFDbkIsb0JBQU0sT0FBQyxBQUF3RCwwREFBRSxPQUFPLEFBQU8sUUFBQyxBQUFNLFdBQUssQUFBUSxBQUFDLEFBQUM7QUFDckcsQUFBTyxvQkFBQyxBQUFPLFFBQUMsQUFBSSxLQUFDLEFBQU8sUUFBQyxBQUFNLEFBQUMsQUFBQztBQUNyQyxBQUFXLDJCQUFJLFNBQU8sQUFBTyxRQUFDLEFBQVEsQUFBQztBQUN2QyxBQUFFLEFBQUMsZ0JBQUMsT0FBTyxBQUFPLFFBQUMsQUFBTSxXQUFLLEFBQVEsQUFBQyxVQUFDLEFBQUM7QUFDdkMsQUFBVywrQkFBSSxNQUFJ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LEFBQUksT0FBRSxBQUFJLEFBQUMsQUFBQyxBQUMxQztBQUFDO0FBRUQsQUFBRSxBQUFDLGdCQUFDLEFBQUksTUFBQyxBQUFNLFVBQUksQUFBTSxVQUFJLEFBQU0sT0FBQyxBQUFLLEFBQUMsT0FBQyxBQUFDO0FBQzFDLEFBQU0sZ0NBQVUsQUFBSyxNQUFDLFVBQUMsQUFBQztBQUN0QixBQUFJLHlCQUFDLEFBQU8sUUFBQyxBQUFDLEFBQUMsQUFBQztBQUNoQixBQUFNLDJCQUFDLEFBQUksTUFBQyxBQUFNLE9BQUMsQUFBSyxNQUFDLEFBQUksT0FBRSxBQUFJLEFBQUMsQUFBQyxBQUN2QztBQUFDLEFBQUMsQUFBQyxBQUNMLGlCQUpXLEFBQU07QUFJaEI7QUFFRCxBQUFFLEFBQUMsZ0JBQUMsQUFBSSxNQUFDLEFBQVMsQUFBQyxXQUFDLEFBQUM7QUFDbkIsQUFBTSx1QkFBQyxBQUFNLEFBQUMsQUFDaEI7QUFBQztnQkFDSDtBQUFDLEFBQUMsQUFDSjtBQUFDO0FBQ0gsV0FBQSxBQUFDO0FBNUZELEFBNEZDLEVBNUZ1QyxXQUFRLEFBNEYvQztBQTVGWSw2QkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ29vcmRpbmF0b3IsIHsgQWN0aXZhdGlvbk9wdGlvbnMsIExvZ0xldmVsIH0gZnJvbSAnLi4vY29vcmRpbmF0b3InO1xyXG5pbXBvcnQgeyBTdHJhdGVneSwgU3RyYXRlZ3lPcHRpb25zIH0gZnJvbSAnLi4vc3RyYXRlZ3knO1xyXG5pbXBvcnQgT3JiaXQsIHtcclxuICBTb3VyY2UsXHJcbiAgVHJhbnNmb3JtLFxyXG4gIGlzU3luY2FibGUsXHJcbiAgU3luY2FibGVcclxufSBmcm9tICdAb3JiaXQvZGF0YSc7XHJcbmltcG9ydCB7IERpY3QsIGFzc2VydCwgb2JqZWN0VmFsdWVzLCBkZWVwR2V0LCBkZWVwU2V0IH0gZnJvbSAnQG9yYml0L3V0aWxzJztcclxuXHJcbmRlY2xhcmUgY29uc3QgY29uc29sZTogYW55O1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBDb25uZWN0aW9uU3RyYXRlZ3lPcHRpb25zIGV4dGVuZHMgU3RyYXRlZ3lPcHRpb25zIHtcclxuICAvKipcclxuICAgKiBUaGUgbmFtZSBvZiB0aGUgc291cmNlIHRvIGJlIG9ic2VydmVkLlxyXG4gICAqXHJcbiAgICogQHR5cGUge3N0cmluZ31cclxuICAgKiBAbWVtYmVyT2YgQ29ubmVjdGlvblN0cmF0ZWd5T3B0aW9uc1xyXG4gICAqL1xyXG4gIHNvdXJjZTogc3RyaW5nO1xyXG5cclxuICAvKipcclxuICAgKiBUaGUgbmFtZSBvZiB0aGUgZXZlbnQgdG8gb2JzZXJ2ZS5cclxuICAgKlxyXG4gICAqIEB0eXBlIHtzdHJpbmd9XHJcbiAgICogQG1lbWJlck9mIENvbm5lY3Rpb25TdHJhdGVneU9wdGlvbnNcclxuICAgKi9cclxuICBvbjogc3RyaW5nO1xyXG5cclxuICAvKipcclxuICAgKiBUaGUgbmFtZSBvZiB0aGUgc291cmNlIHdoaWNoIHdpbGwgYmUgYWN0ZWQgdXBvbi5cclxuICAgKlxyXG4gICAqIEB0eXBlIHtzdHJpbmd9XHJcbiAgICogQG1lbWJlck9mIENvbm5lY3Rpb25TdHJhdGVneU9wdGlvbnNcclxuICAgKi9cclxuICB0YXJnZXQ/OiBzdHJpbmc7XHJcblxyXG4gIC8qKlxyXG4gICAqIFRoZSBhY3Rpb24gdG8gcGVyZm9ybSBvbiB0aGUgdGFyZ2V0LlxyXG4gICAqXHJcbiAgICogQ2FuIGJlIHNwZWNpZmllZCBhcyBhIHN0cmluZyAoZS5nLiBgcHVsbGApIG9yIGEgZnVuY3Rpb24gd2hpY2ggd2lsbCBiZVxyXG4gICAqIGludm9rZWQgaW4gdGhlIGNvbnRleHQgb2YgdGhpcyBzdHJhdGVneSAoYW5kIHRodXMgd2lsbCBoYXZlIGFjY2VzcyB0b1xyXG4gICAqIGJvdGggYHRoaXMuc291cmNlYCBhbmQgYHRoaXMudGFyZ2V0YCkuXHJcbiAgICpcclxuICAgKiBAdHlwZSB7KHN0cmluZyB8IEZ1bmN0aW9uKX1cclxuICAgKiBAbWVtYmVyT2YgQ29ubmVjdGlvblN0cmF0ZWd5T3B0aW9uc1xyXG4gICAqL1xyXG4gIGFjdGlvbjogc3RyaW5nIHwgRnVuY3Rpb247XHJcblxyXG4gIC8qKlxyXG4gICAqIEEgaGFuZGxlciBmb3IgYW55IGVycm9ycyB0aHJvd24gYXMgYSByZXN1bHQgb2YgcGVyZm9ybWluZyB0aGUgYWN0aW9uLlxyXG4gICAqXHJcbiAgICogQHR5cGUge0Z1bmN0aW9ufVxyXG4gICAqIEBtZW1iZXJPZiBDb25uZWN0aW9uU3RyYXRlZ3lPcHRpb25zXHJcbiAgICovXHJcbiAgY2F0Y2g/OiBGdW5jdGlvbjtcclxuXHJcbiAgLyoqXHJcbiAgICogQSBmaWx0ZXIgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGB0cnVlYCBpZiB0aGUgYGFjdGlvbmAgc2hvdWxkIGJlIHBlcmZvcm1lZC5cclxuICAgKlxyXG4gICAqIGBmaWx0ZXJgIHdpbGwgYmUgaW52b2tlZCBpbiB0aGUgY29udGV4dCBvZiB0aGlzIHN0cmF0ZWd5IChhbmQgdGh1cyB3aWxsXHJcbiAgICogaGF2ZSBhY2Nlc3MgdG8gYm90aCBgdGhpcy5zb3VyY2VgIGFuZCBgdGhpcy50YXJnZXRgKS5cclxuICAgKlxyXG4gICAqIEB0eXBlIHtGdW5jdGlvbn1cclxuICAgKiBAbWVtYmVyT2YgQ29ubmVjdGlvblN0cmF0ZWd5T3B0aW9uc1xyXG4gICAqL1xyXG4gIGZpbHRlcj86IEZ1bmN0aW9uO1xyXG5cclxuICAvKipcclxuICAgKiBTaG91bGQgcmVzb2x1dGlvbiBvZiBgYWN0aW9uYCBvbiB0aGUgdGhlIHRhcmdldCBibG9jayB0aGUgY29tcGxldGlvblxyXG4gICAqIG9mIHRoZSBzb3VyY2UncyBldmVudD9cclxuICAgKlxyXG4gICAqIEJ5IGRlZmF1bHQsIGBibG9ja2luZ2AgaXMgZmFsc2UuXHJcbiAgICpcclxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cclxuICAgKiBAbWVtYmVyT2YgQ29ubmVjdGlvblN0cmF0ZWd5T3B0aW9uc3NcclxuICAgKi9cclxuICBibG9ja2luZz86IGJvb2xlYW47XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBDb25uZWN0aW9uU3RyYXRlZ3kgZXh0ZW5kcyBTdHJhdGVneSB7XHJcbiAgcHJvdGVjdGVkIF9ibG9ja2luZzogYm9vbGVhbjtcclxuICBwcm90ZWN0ZWQgX2V2ZW50OiBzdHJpbmc7XHJcbiAgcHJvdGVjdGVkIF9hY3Rpb246IHN0cmluZyB8IEZ1bmN0aW9uO1xyXG4gIHByb3RlY3RlZCBfY2F0Y2g6IEZ1bmN0aW9uO1xyXG4gIHByb3RlY3RlZCBfbGlzdGVuZXI6IEZ1bmN0aW9uO1xyXG4gIHByb3RlY3RlZCBfZmlsdGVyOiBGdW5jdGlvbjtcclxuXHJcbiAgY29uc3RydWN0b3Iob3B0aW9uczogQ29ubmVjdGlvblN0cmF0ZWd5T3B0aW9ucykge1xyXG4gICAgYXNzZXJ0KCdBIGBzb3VyY2VgIG11c3QgYmUgc3BlY2lmaWVkIGZvciBhIENvbm5lY3Rpb25TdHJhdGVneScsICEhb3B0aW9ucy5zb3VyY2UpO1xyXG4gICAgYXNzZXJ0KCdgc291cmNlYCBzaG91bGQgYmUgYSBTb3VyY2UgbmFtZSBzcGVjaWZpZWQgYXMgYSBzdHJpbmcnLCB0eXBlb2Ygb3B0aW9ucy5zb3VyY2UgPT09ICdzdHJpbmcnKTtcclxuICAgIGFzc2VydCgnYG9uYCBzaG91bGQgYmUgc3BlY2lmaWVkIGFzIHRoZSBuYW1lIG9mIHRoZSBldmVudCBhIENvbm5lY3Rpb25TdHJhdGVneSBsaXN0ZW5zIGZvcicsIHR5cGVvZiBvcHRpb25zLm9uID09PSAnc3RyaW5nJyk7XHJcbiAgICBvcHRpb25zLnNvdXJjZXMgPSBbb3B0aW9ucy5zb3VyY2VdO1xyXG4gICAgbGV0IGRlZmF1bHROYW1lID0gYCR7b3B0aW9ucy5zb3VyY2V9OiR7b3B0aW9ucy5vbn1gO1xyXG4gICAgZGVsZXRlIG9wdGlvbnMuc291cmNlO1xyXG4gICAgaWYgKG9wdGlvbnMudGFyZ2V0KSB7XHJcbiAgICAgIGFzc2VydCgnYHRhcmdldGAgc2hvdWxkIGJlIGEgU291cmNlIG5hbWUgc3BlY2lmaWVkIGFzIGEgc3RyaW5nJywgdHlwZW9mIG9wdGlvbnMudGFyZ2V0ID09PSAnc3RyaW5nJyk7XHJcbiAgICAgIG9wdGlvbnMuc291cmNlcy5wdXNoKG9wdGlvbnMudGFyZ2V0KTtcclxuICAgICAgZGVmYXVsdE5hbWUgKz0gYCAtPiAke29wdGlvbnMudGFyZ2V0fWA7XHJcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5hY3Rpb24gPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgZGVmYXVsdE5hbWUgKz0gYDoke29wdGlvbnMuYWN0aW9ufWA7XHJcbiAgICAgIH1cclxuICAgICAgZGVsZXRlIG9wdGlvbnMudGFyZ2V0O1xyXG4gICAgfVxyXG4gICAgb3B0aW9ucy5uYW1lID0gb3B0aW9ucy5uYW1lIHx8IGRlZmF1bHROYW1lO1xyXG4gICAgc3VwZXIob3B0aW9ucyk7XHJcblxyXG4gICAgdGhpcy5fZXZlbnQgPSBvcHRpb25zLm9uO1xyXG4gICAgdGhpcy5fYWN0aW9uID0gb3B0aW9ucy5hY3Rpb247XHJcbiAgICB0aGlzLl9jYXRjaCA9IG9wdGlvbnMuY2F0Y2g7XHJcbiAgICB0aGlzLl9maWx0ZXIgPSBvcHRpb25zLmZpbHRlcjtcclxuICAgIHRoaXMuX2Jsb2NraW5nID0gISFvcHRpb25zLmJsb2NraW5nO1xyXG4gIH1cclxuXHJcbiAgZ2V0IHNvdXJjZSgpOiBTb3VyY2Uge1xyXG4gICAgcmV0dXJuIHRoaXMuX3NvdXJjZXNbMF07XHJcbiAgfVxyXG5cclxuICBnZXQgdGFyZ2V0KCk6IFNvdXJjZSB7XHJcbiAgICByZXR1cm4gdGhpcy5fc291cmNlc1sxXTtcclxuICB9XHJcblxyXG4gIGdldCBibG9ja2luZygpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLl9ibG9ja2luZztcclxuICB9XHJcblxyXG4gIGFjdGl2YXRlKGNvb3JkaW5hdG9yOiBDb29yZGluYXRvciwgb3B0aW9uczogQWN0aXZhdGlvbk9wdGlvbnMgPSB7fSk6IFByb21pc2U8YW55PiB7XHJcbiAgICByZXR1cm4gc3VwZXIuYWN0aXZhdGUoY29vcmRpbmF0b3IsIG9wdGlvbnMpXHJcbiAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICB0aGlzLl9saXN0ZW5lciA9IHRoaXMuX2dlbmVyYXRlTGlzdGVuZXIoKTtcclxuICAgICAgICB0aGlzLnNvdXJjZS5vbih0aGlzLl9ldmVudCwgdGhpcy5fbGlzdGVuZXIsIHRoaXMpO1xyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIGRlYWN0aXZhdGUoKTogUHJvbWlzZTxhbnk+IHtcclxuICAgIHJldHVybiBzdXBlci5kZWFjdGl2YXRlKClcclxuICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuc291cmNlLm9mZih0aGlzLl9ldmVudCwgdGhpcy5fbGlzdGVuZXIsIHRoaXMpO1xyXG4gICAgICAgIHRoaXMuX2xpc3RlbmVyID0gbnVsbDtcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcm90ZWN0ZWQgX2dlbmVyYXRlTGlzdGVuZXIoKSB7XHJcbiAgICBsZXQgdGFyZ2V0OiBhbnkgPSB0aGlzLnRhcmdldDtcclxuXHJcbiAgICByZXR1cm4gKC4uLmFyZ3MpID0+IHtcclxuICAgICAgbGV0IHJlc3VsdDtcclxuXHJcbiAgICAgIGlmICh0aGlzLl9maWx0ZXIpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2ZpbHRlci5hcHBseSh0aGlzLCBhcmdzKSkge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHR5cGVvZiB0aGlzLl9hY3Rpb24gPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgcmVzdWx0ID0gdGhpcy50YXJnZXRbdGhpcy5fYWN0aW9uXSguLi5hcmdzKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXN1bHQgPSB0aGlzLl9hY3Rpb24uYXBwbHkodGhpcywgYXJncyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0aGlzLl9jYXRjaCAmJiByZXN1bHQgJiYgcmVzdWx0LmNhdGNoKSB7XHJcbiAgICAgICAgcmVzdWx0ID0gcmVzdWx0LmNhdGNoKChlKSA9PiB7XHJcbiAgICAgICAgICBhcmdzLnVuc2hpZnQoZSk7XHJcbiAgICAgICAgICByZXR1cm4gdGhpcy5fY2F0Y2guYXBwbHkodGhpcywgYXJncyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0aGlzLl9ibG9ja2luZykge1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgfVxyXG59XHJcbiJdfQ==