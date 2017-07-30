"use strict";

var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
            }
        }
    }return target;
};

function _defaults(obj, defaults) {
    var keys = Object.getOwnPropertyNames(defaults);for (var i = 0; i < keys.length; i++) {
        var key = keys[i];var value = Object.getOwnPropertyDescriptor(defaults, key);if (value && value.configurable && obj[key] === undefined) {
            Object.defineProperty(obj, key, value);
        }
    }return obj;
}

var __extends = undefined && undefined.__extends || function () {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29ubmVjdGlvbi1zdHJhdGVneS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9zdHJhdGVnaWVzL2Nvbm5lY3Rpb24tc3RyYXRlZ3kudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLHlCQUF3RDtBQU94RCxzQkFBNEU7QUF3RTVFLDJDQUF3QztrQ0FBUSxBQVE5QztnQ0FBWSxBQUFrQyxTQUE5QztvQkF3QkMsQUF2QkM7Z0JBQU0sT0FBQyxBQUF1RCx5REFBRSxDQUFDLENBQUMsQUFBTyxRQUFDLEFBQU0sQUFBQyxBQUFDLEFBQ2xGO2dCQUFNLE9BQUMsQUFBd0QsMERBQUUsT0FBTyxBQUFPLFFBQUMsQUFBTSxXQUFLLEFBQVEsQUFBQyxBQUFDLEFBQ3JHO2dCQUFNLE9BQUMsQUFBb0Ysc0ZBQUUsT0FBTyxBQUFPLFFBQUMsQUFBRSxPQUFLLEFBQVEsQUFBQyxBQUFDLEFBQzdILEFBQU87Z0JBQUMsQUFBTyxVQUFHLENBQUMsQUFBTyxRQUFDLEFBQU0sQUFBQyxBQUFDLEFBQ25DO1lBQUksQUFBVyxjQUFNLEFBQU8sUUFBQyxBQUFNLGVBQUksQUFBTyxRQUFDLEFBQUksQUFBQyxBQUNwRDtlQUFPLEFBQU8sUUFBQyxBQUFNLEFBQUMsQUFDdEIsQUFBRSxBQUFDO1lBQUMsQUFBTyxRQUFDLEFBQU0sQUFBQyxRQUFDLEFBQUMsQUFDbkI7b0JBQU0sT0FBQyxBQUF3RCwwREFBRSxPQUFPLEFBQU8sUUFBQyxBQUFNLFdBQUssQUFBUSxBQUFDLEFBQUMsQUFDckcsQUFBTztvQkFBQyxBQUFPLFFBQUMsQUFBSSxLQUFDLEFBQU8sUUFBQyxBQUFNLEFBQUMsQUFBQyxBQUNyQyxBQUFXOzJCQUFJLFNBQU8sQUFBTyxRQUFDLEFBQVEsQUFBQyxBQUN2QyxBQUFFLEFBQUM7Z0JBQUMsT0FBTyxBQUFPLFFBQUMsQUFBTSxXQUFLLEFBQVEsQUFBQyxVQUFDLEFBQUMsQUFDdkMsQUFBVzsrQkFBSSxNQUFJLEFBQU8sUUFBQyxBQUFRLEFBQUMsQUFDdEMsQUFBQztBQUNEO21CQUFPLEFBQU8sUUFBQyxBQUFNLEFBQUMsQUFDeEIsQUFBQztBQUNELEFBQU87Z0JBQUMsQUFBSSxPQUFHLEFBQU8sUUFBQyxBQUFJLFFBQUksQUFBVyxBQUFDLEFBQzNDO2dCQUFBLGtCQUFNLEFBQU8sQUFBQyxZQUFDLEFBRWYsQUFBSTtjQUFDLEFBQU0sU0FBRyxBQUFPLFFBQUMsQUFBRSxBQUFDLEFBQ3pCLEFBQUk7Y0FBQyxBQUFPLFVBQUcsQUFBTyxRQUFDLEFBQU0sQUFBQyxBQUM5QixBQUFJO2NBQUMsQUFBTSxTQUFHLEFBQU8sUUFBQyxBQUFLLEFBQUMsQUFDNUIsQUFBSTtjQUFDLEFBQU8sVUFBRyxBQUFPLFFBQUMsQUFBTSxBQUFDLEFBQzlCLEFBQUk7Y0FBQyxBQUFTLFlBQUcsQ0FBQyxDQUFDLEFBQU8sUUFBQyxBQUFRLEFBQUM7ZUFDdEMsQUFBQztBQUVEOzBCQUFJLDhCQUFNO2FBQVYsWUFDRSxBQUFNO21CQUFDLEFBQUksS0FBQyxBQUFRLFNBQUMsQUFBQyxBQUFDLEFBQUMsQUFDMUIsQUFBQzs7O3NCQUFBLEFBRUQ7OzBCQUFJLDhCQUFNO2FBQVYsWUFDRSxBQUFNO21CQUFDLEFBQUksS0FBQyxBQUFRLFNBQUMsQUFBQyxBQUFDLEFBQUMsQUFDMUIsQUFBQzs7O3NCQUFBLEFBRUQ7OzBCQUFJLDhCQUFRO2FBQVosWUFDRSxBQUFNO21CQUFDLEFBQUksS0FBQyxBQUFTLEFBQUMsQUFDeEIsQUFBQzs7O3NCQUFBLEFBRUQ7O2lDQUFRLFdBQVIsVUFBUyxBQUF3QixhQUFFLEFBQStCLFNBQWxFO29CQU1DLEFBTmtDO2dDQUFBO3NCQUErQjtBQUNoRSxBQUFNO2dDQUFPLEFBQVEsb0JBQUMsQUFBVyxhQUFFLEFBQU8sQUFBQyxTQUN4QyxBQUFJLEtBQUMsWUFDSixBQUFJO2tCQUFDLEFBQVMsWUFBRyxBQUFJLE1BQUMsQUFBaUIsQUFBRSxBQUFDLEFBQzFDLEFBQUk7a0JBQUMsQUFBTSxPQUFDLEFBQUUsR0FBQyxBQUFJLE1BQUMsQUFBTSxRQUFFLEFBQUksTUFBQyxBQUFTLFdBQUUsQUFBSSxBQUFDLEFBQUMsQUFDcEQsQUFBQyxBQUFDLEFBQUMsQUFDUDtBQUxTLEFBS1I7QUFFRDtpQ0FBVSxhQUFWLFlBQUE7b0JBTUMsQUFMQyxBQUFNO2dDQUFPLEFBQVUsZ0JBQUUsTUFDdEIsQUFBSSxLQUFDLFlBQ0osQUFBSTtrQkFBQyxBQUFNLE9BQUMsQUFBRyxJQUFDLEFBQUksTUFBQyxBQUFNLFFBQUUsQUFBSSxNQUFDLEFBQVMsV0FBRSxBQUFJLEFBQUMsQUFBQyxBQUNuRCxBQUFJO2tCQUFDLEFBQVMsWUFBRyxBQUFJLEFBQUMsQUFDeEIsQUFBQyxBQUFDLEFBQUMsQUFDUDtBQUxTLEFBS1I7QUFFUztpQ0FBaUIsb0JBQTNCLFlBQUE7b0JBNkJDLEFBNUJDO1lBQUksQUFBTSxTQUFRLEFBQUksS0FBQyxBQUFNLEFBQUMsQUFFOUIsQUFBTTtlQUFDLFlBQUM7dUJBQU87aUJBQVAsU0FBTyxHQUFQLGVBQU8sUUFBUCxBQUFPLE1BQVA7cUNBQU87QUFDYjtnQkFBSSxBQUFNLEFBQUMsQUFFWCxBQUFFLEFBQUM7Z0JBQUMsQUFBSSxNQUFDLEFBQU8sQUFBQyxTQUFDLEFBQUMsQUFDakIsQUFBRSxBQUFDO29CQUFDLENBQUMsQUFBSSxNQUFDLEFBQU8sUUFBQyxBQUFLLE1BQUMsQUFBSSxPQUFFLEFBQUksQUFBQyxBQUFDLE9BQUMsQUFBQyxBQUNwQyxBQUFNLEFBQUMsQUFDVDtBQUFDLEFBQ0g7QUFBQztBQUVELEFBQUUsQUFBQztnQkFBQyxPQUFPLEFBQUksTUFBQyxBQUFPLFlBQUssQUFBUSxBQUFDLFVBQUMsQUFBQyxBQUNyQyxBQUFNO3lCQUFHLENBQUEsS0FBQSxBQUFJLE1BQUMsQUFBTSxRQUFDLEFBQUksTUFBQyxBQUFPLEFBQUMsbUJBQUksQUFBSSxBQUFDLEFBQUMsQUFDOUMsQUFBQyxBQUFDLEFBQUk7bUJBQUMsQUFBQyxBQUNOLEFBQU07eUJBQUcsQUFBSSxNQUFDLEFBQU8sUUFBQyxBQUFLLE1BQUMsQUFBSSxPQUFFLEFBQUksQUFBQyxBQUFDLEFBQzFDLEFBQUM7QUFFRCxBQUFFLEFBQUM7Z0JBQUMsQUFBSSxNQUFDLEFBQU0sVUFBSSxBQUFNLFVBQUksQUFBTSxPQUFDLEFBQUssQUFBQyxPQUFDLEFBQUMsQUFDMUMsQUFBTTtnQ0FBVSxBQUFLLE1BQUMsVUFBQyxBQUFDLEdBQ3RCLEFBQUk7eUJBQUMsQUFBTyxRQUFDLEFBQUMsQUFBQyxBQUFDLEFBQ2hCLEFBQU07MkJBQUMsQUFBSSxNQUFDLEFBQU0sT0FBQyxBQUFLLE1BQUMsQUFBSSxPQUFFLEFBQUksQUFBQyxBQUFDLEFBQ3ZDLEFBQUMsQUFBQyxBQUFDLEFBQ0w7QUFKVyxBQUFNLEFBSWhCO0FBRUQsQUFBRSxBQUFDO2dCQUFDLEFBQUksTUFBQyxBQUFTLEFBQUMsV0FBQyxBQUFDLEFBQ25CLEFBQU07dUJBQUMsQUFBTSxBQUFDLEFBQ2hCLEFBQUM7O2dCQUNILEFBQUMsQUFBQyxBQUNKO0FBQUM7QUFDSDtXQUFBLEFBQUMsQUE1RkQsQUE0RkM7RUE1RnVDLFdBQVEsQUE0Ri9DO0FBNUZZLDZCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDb29yZGluYXRvciwgeyBBY3RpdmF0aW9uT3B0aW9ucywgTG9nTGV2ZWwgfSBmcm9tICcuLi9jb29yZGluYXRvcic7XHJcbmltcG9ydCB7IFN0cmF0ZWd5LCBTdHJhdGVneU9wdGlvbnMgfSBmcm9tICcuLi9zdHJhdGVneSc7XHJcbmltcG9ydCBPcmJpdCwge1xyXG4gIFNvdXJjZSxcclxuICBUcmFuc2Zvcm0sXHJcbiAgaXNTeW5jYWJsZSxcclxuICBTeW5jYWJsZVxyXG59IGZyb20gJ0BvcmJpdC9kYXRhJztcclxuaW1wb3J0IHsgRGljdCwgYXNzZXJ0LCBvYmplY3RWYWx1ZXMsIGRlZXBHZXQsIGRlZXBTZXQgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xyXG5cclxuZGVjbGFyZSBjb25zdCBjb25zb2xlOiBhbnk7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIENvbm5lY3Rpb25TdHJhdGVneU9wdGlvbnMgZXh0ZW5kcyBTdHJhdGVneU9wdGlvbnMge1xyXG4gIC8qKlxyXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBzb3VyY2UgdG8gYmUgb2JzZXJ2ZWQuXHJcbiAgICpcclxuICAgKiBAdHlwZSB7c3RyaW5nfVxyXG4gICAqIEBtZW1iZXJPZiBDb25uZWN0aW9uU3RyYXRlZ3lPcHRpb25zXHJcbiAgICovXHJcbiAgc291cmNlOiBzdHJpbmc7XHJcblxyXG4gIC8qKlxyXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBldmVudCB0byBvYnNlcnZlLlxyXG4gICAqXHJcbiAgICogQHR5cGUge3N0cmluZ31cclxuICAgKiBAbWVtYmVyT2YgQ29ubmVjdGlvblN0cmF0ZWd5T3B0aW9uc1xyXG4gICAqL1xyXG4gIG9uOiBzdHJpbmc7XHJcblxyXG4gIC8qKlxyXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBzb3VyY2Ugd2hpY2ggd2lsbCBiZSBhY3RlZCB1cG9uLlxyXG4gICAqXHJcbiAgICogQHR5cGUge3N0cmluZ31cclxuICAgKiBAbWVtYmVyT2YgQ29ubmVjdGlvblN0cmF0ZWd5T3B0aW9uc1xyXG4gICAqL1xyXG4gIHRhcmdldD86IHN0cmluZztcclxuXHJcbiAgLyoqXHJcbiAgICogVGhlIGFjdGlvbiB0byBwZXJmb3JtIG9uIHRoZSB0YXJnZXQuXHJcbiAgICpcclxuICAgKiBDYW4gYmUgc3BlY2lmaWVkIGFzIGEgc3RyaW5nIChlLmcuIGBwdWxsYCkgb3IgYSBmdW5jdGlvbiB3aGljaCB3aWxsIGJlXHJcbiAgICogaW52b2tlZCBpbiB0aGUgY29udGV4dCBvZiB0aGlzIHN0cmF0ZWd5IChhbmQgdGh1cyB3aWxsIGhhdmUgYWNjZXNzIHRvXHJcbiAgICogYm90aCBgdGhpcy5zb3VyY2VgIGFuZCBgdGhpcy50YXJnZXRgKS5cclxuICAgKlxyXG4gICAqIEB0eXBlIHsoc3RyaW5nIHwgRnVuY3Rpb24pfVxyXG4gICAqIEBtZW1iZXJPZiBDb25uZWN0aW9uU3RyYXRlZ3lPcHRpb25zXHJcbiAgICovXHJcbiAgYWN0aW9uOiBzdHJpbmcgfCBGdW5jdGlvbjtcclxuXHJcbiAgLyoqXHJcbiAgICogQSBoYW5kbGVyIGZvciBhbnkgZXJyb3JzIHRocm93biBhcyBhIHJlc3VsdCBvZiBwZXJmb3JtaW5nIHRoZSBhY3Rpb24uXHJcbiAgICpcclxuICAgKiBAdHlwZSB7RnVuY3Rpb259XHJcbiAgICogQG1lbWJlck9mIENvbm5lY3Rpb25TdHJhdGVneU9wdGlvbnNcclxuICAgKi9cclxuICBjYXRjaD86IEZ1bmN0aW9uO1xyXG5cclxuICAvKipcclxuICAgKiBBIGZpbHRlciBmdW5jdGlvbiB0aGF0IHJldHVybnMgYHRydWVgIGlmIHRoZSBgYWN0aW9uYCBzaG91bGQgYmUgcGVyZm9ybWVkLlxyXG4gICAqXHJcbiAgICogYGZpbHRlcmAgd2lsbCBiZSBpbnZva2VkIGluIHRoZSBjb250ZXh0IG9mIHRoaXMgc3RyYXRlZ3kgKGFuZCB0aHVzIHdpbGxcclxuICAgKiBoYXZlIGFjY2VzcyB0byBib3RoIGB0aGlzLnNvdXJjZWAgYW5kIGB0aGlzLnRhcmdldGApLlxyXG4gICAqXHJcbiAgICogQHR5cGUge0Z1bmN0aW9ufVxyXG4gICAqIEBtZW1iZXJPZiBDb25uZWN0aW9uU3RyYXRlZ3lPcHRpb25zXHJcbiAgICovXHJcbiAgZmlsdGVyPzogRnVuY3Rpb247XHJcblxyXG4gIC8qKlxyXG4gICAqIFNob3VsZCByZXNvbHV0aW9uIG9mIGBhY3Rpb25gIG9uIHRoZSB0aGUgdGFyZ2V0IGJsb2NrIHRoZSBjb21wbGV0aW9uXHJcbiAgICogb2YgdGhlIHNvdXJjZSdzIGV2ZW50P1xyXG4gICAqXHJcbiAgICogQnkgZGVmYXVsdCwgYGJsb2NraW5nYCBpcyBmYWxzZS5cclxuICAgKlxyXG4gICAqIEB0eXBlIHtib29sZWFufVxyXG4gICAqIEBtZW1iZXJPZiBDb25uZWN0aW9uU3RyYXRlZ3lPcHRpb25zc1xyXG4gICAqL1xyXG4gIGJsb2NraW5nPzogYm9vbGVhbjtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIENvbm5lY3Rpb25TdHJhdGVneSBleHRlbmRzIFN0cmF0ZWd5IHtcclxuICBwcm90ZWN0ZWQgX2Jsb2NraW5nOiBib29sZWFuO1xyXG4gIHByb3RlY3RlZCBfZXZlbnQ6IHN0cmluZztcclxuICBwcm90ZWN0ZWQgX2FjdGlvbjogc3RyaW5nIHwgRnVuY3Rpb247XHJcbiAgcHJvdGVjdGVkIF9jYXRjaDogRnVuY3Rpb247XHJcbiAgcHJvdGVjdGVkIF9saXN0ZW5lcjogRnVuY3Rpb247XHJcbiAgcHJvdGVjdGVkIF9maWx0ZXI6IEZ1bmN0aW9uO1xyXG5cclxuICBjb25zdHJ1Y3RvcihvcHRpb25zOiBDb25uZWN0aW9uU3RyYXRlZ3lPcHRpb25zKSB7XHJcbiAgICBhc3NlcnQoJ0EgYHNvdXJjZWAgbXVzdCBiZSBzcGVjaWZpZWQgZm9yIGEgQ29ubmVjdGlvblN0cmF0ZWd5JywgISFvcHRpb25zLnNvdXJjZSk7XHJcbiAgICBhc3NlcnQoJ2Bzb3VyY2VgIHNob3VsZCBiZSBhIFNvdXJjZSBuYW1lIHNwZWNpZmllZCBhcyBhIHN0cmluZycsIHR5cGVvZiBvcHRpb25zLnNvdXJjZSA9PT0gJ3N0cmluZycpO1xyXG4gICAgYXNzZXJ0KCdgb25gIHNob3VsZCBiZSBzcGVjaWZpZWQgYXMgdGhlIG5hbWUgb2YgdGhlIGV2ZW50IGEgQ29ubmVjdGlvblN0cmF0ZWd5IGxpc3RlbnMgZm9yJywgdHlwZW9mIG9wdGlvbnMub24gPT09ICdzdHJpbmcnKTtcclxuICAgIG9wdGlvbnMuc291cmNlcyA9IFtvcHRpb25zLnNvdXJjZV07XHJcbiAgICBsZXQgZGVmYXVsdE5hbWUgPSBgJHtvcHRpb25zLnNvdXJjZX06JHtvcHRpb25zLm9ufWA7XHJcbiAgICBkZWxldGUgb3B0aW9ucy5zb3VyY2U7XHJcbiAgICBpZiAob3B0aW9ucy50YXJnZXQpIHtcclxuICAgICAgYXNzZXJ0KCdgdGFyZ2V0YCBzaG91bGQgYmUgYSBTb3VyY2UgbmFtZSBzcGVjaWZpZWQgYXMgYSBzdHJpbmcnLCB0eXBlb2Ygb3B0aW9ucy50YXJnZXQgPT09ICdzdHJpbmcnKTtcclxuICAgICAgb3B0aW9ucy5zb3VyY2VzLnB1c2gob3B0aW9ucy50YXJnZXQpO1xyXG4gICAgICBkZWZhdWx0TmFtZSArPSBgIC0+ICR7b3B0aW9ucy50YXJnZXR9YDtcclxuICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLmFjdGlvbiA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICBkZWZhdWx0TmFtZSArPSBgOiR7b3B0aW9ucy5hY3Rpb259YDtcclxuICAgICAgfVxyXG4gICAgICBkZWxldGUgb3B0aW9ucy50YXJnZXQ7XHJcbiAgICB9XHJcbiAgICBvcHRpb25zLm5hbWUgPSBvcHRpb25zLm5hbWUgfHwgZGVmYXVsdE5hbWU7XHJcbiAgICBzdXBlcihvcHRpb25zKTtcclxuXHJcbiAgICB0aGlzLl9ldmVudCA9IG9wdGlvbnMub247XHJcbiAgICB0aGlzLl9hY3Rpb24gPSBvcHRpb25zLmFjdGlvbjtcclxuICAgIHRoaXMuX2NhdGNoID0gb3B0aW9ucy5jYXRjaDtcclxuICAgIHRoaXMuX2ZpbHRlciA9IG9wdGlvbnMuZmlsdGVyO1xyXG4gICAgdGhpcy5fYmxvY2tpbmcgPSAhIW9wdGlvbnMuYmxvY2tpbmc7XHJcbiAgfVxyXG5cclxuICBnZXQgc291cmNlKCk6IFNvdXJjZSB7XHJcbiAgICByZXR1cm4gdGhpcy5fc291cmNlc1swXTtcclxuICB9XHJcblxyXG4gIGdldCB0YXJnZXQoKTogU291cmNlIHtcclxuICAgIHJldHVybiB0aGlzLl9zb3VyY2VzWzFdO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGJsb2NraW5nKCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuX2Jsb2NraW5nO1xyXG4gIH1cclxuXHJcbiAgYWN0aXZhdGUoY29vcmRpbmF0b3I6IENvb3JkaW5hdG9yLCBvcHRpb25zOiBBY3RpdmF0aW9uT3B0aW9ucyA9IHt9KTogUHJvbWlzZTxhbnk+IHtcclxuICAgIHJldHVybiBzdXBlci5hY3RpdmF0ZShjb29yZGluYXRvciwgb3B0aW9ucylcclxuICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuX2xpc3RlbmVyID0gdGhpcy5fZ2VuZXJhdGVMaXN0ZW5lcigpO1xyXG4gICAgICAgIHRoaXMuc291cmNlLm9uKHRoaXMuX2V2ZW50LCB0aGlzLl9saXN0ZW5lciwgdGhpcyk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZGVhY3RpdmF0ZSgpOiBQcm9taXNlPGFueT4ge1xyXG4gICAgcmV0dXJuIHN1cGVyLmRlYWN0aXZhdGUoKVxyXG4gICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5zb3VyY2Uub2ZmKHRoaXMuX2V2ZW50LCB0aGlzLl9saXN0ZW5lciwgdGhpcyk7XHJcbiAgICAgICAgdGhpcy5fbGlzdGVuZXIgPSBudWxsO1xyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIHByb3RlY3RlZCBfZ2VuZXJhdGVMaXN0ZW5lcigpIHtcclxuICAgIGxldCB0YXJnZXQ6IGFueSA9IHRoaXMudGFyZ2V0O1xyXG5cclxuICAgIHJldHVybiAoLi4uYXJncykgPT4ge1xyXG4gICAgICBsZXQgcmVzdWx0O1xyXG5cclxuICAgICAgaWYgKHRoaXMuX2ZpbHRlcikge1xyXG4gICAgICAgIGlmICghdGhpcy5fZmlsdGVyLmFwcGx5KHRoaXMsIGFyZ3MpKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodHlwZW9mIHRoaXMuX2FjdGlvbiA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICByZXN1bHQgPSB0aGlzLnRhcmdldFt0aGlzLl9hY3Rpb25dKC4uLmFyZ3MpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJlc3VsdCA9IHRoaXMuX2FjdGlvbi5hcHBseSh0aGlzLCBhcmdzKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRoaXMuX2NhdGNoICYmIHJlc3VsdCAmJiByZXN1bHQuY2F0Y2gpIHtcclxuICAgICAgICByZXN1bHQgPSByZXN1bHQuY2F0Y2goKGUpID0+IHtcclxuICAgICAgICAgIGFyZ3MudW5zaGlmdChlKTtcclxuICAgICAgICAgIHJldHVybiB0aGlzLl9jYXRjaC5hcHBseSh0aGlzLCBhcmdzKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRoaXMuX2Jsb2NraW5nKSB7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgfVxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuIl19