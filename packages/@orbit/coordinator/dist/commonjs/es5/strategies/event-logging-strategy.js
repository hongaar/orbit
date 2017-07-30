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
var coordinator_1 = require("../coordinator");
var strategy_1 = require("../strategy");
var data_1 = require("@orbit/data");
var utils_1 = require("@orbit/utils");
var EventLoggingStrategy = function (_super) {
    __extends(EventLoggingStrategy, _super);
    function EventLoggingStrategy(options) {
        if (options === void 0) {
            options = {};
        }
        var _this = this;
        options.name = options.name || 'event-logging';
        _this = _super.call(this, options) || this;
        _this._events = options.events;
        _this._interfaces = options.interfaces;
        _this._logPrefix = options.logPrefix || '[source-event]';
        return _this;
    }
    EventLoggingStrategy.prototype.activate = function (coordinator, options) {
        var _this = this;
        if (options === void 0) {
            options = {};
        }
        return _super.prototype.activate.call(this, coordinator, options).then(function () {
            _this._eventListeners = {};
            _this._sources.forEach(function (source) {
                return _this._activateSource(source);
            });
        });
    };
    EventLoggingStrategy.prototype.deactivate = function () {
        var _this = this;
        return _super.prototype.deactivate.call(this).then(function () {
            _this._sources.forEach(function (source) {
                return _this._deactivateSource(source);
            });
            _this._eventListeners = null;
        });
    };
    EventLoggingStrategy.prototype._activateSource = function (source) {
        var _this = this;
        this._sourceEvents(source).forEach(function (event) {
            _this._addListener(source, event);
        });
    };
    EventLoggingStrategy.prototype._deactivateSource = function (source) {
        var _this = this;
        this._sourceEvents(source).forEach(function (event) {
            _this._removeListener(source, event);
        });
    };
    EventLoggingStrategy.prototype._sourceEvents = function (source) {
        var _this = this;
        if (this._events) {
            return this._events;
        } else {
            var events_1 = [];
            var interfaces = this._interfaces || this._sourceInterfaces(source);
            interfaces.forEach(function (i) {
                Array.prototype.push.apply(events_1, _this._interfaceEvents(i));
            });
            return events_1;
        }
    };
    EventLoggingStrategy.prototype._sourceInterfaces = function (source) {
        var interfaces = ['transformable'];
        if (data_1.isPullable(source)) {
            interfaces.push('pullable');
        }
        if (data_1.isPushable(source)) {
            interfaces.push('pushable');
        }
        if (data_1.isQueryable(source)) {
            interfaces.push('queryable');
        }
        if (data_1.isSyncable(source)) {
            interfaces.push('syncable');
        }
        if (data_1.isUpdatable(source)) {
            interfaces.push('updatable');
        }
        return interfaces;
    };
    EventLoggingStrategy.prototype._interfaceEvents = function (interfaceName) {
        if (this._logLevel === coordinator_1.LogLevel.Info) {
            switch (interfaceName) {
                case 'pullable':
                    return ['beforePull', 'pull', 'pullFail'];
                case 'pushable':
                    return ['beforePush', 'push', 'pushFail'];
                case 'queryable':
                    return ['beforeQuery', 'query', 'queryFail'];
                case 'updatable':
                    return ['beforeUpdate', 'update', 'updateFail'];
                case 'syncable':
                    return ['beforeSync', 'sync', 'syncFail'];
                case 'transformable':
                    return ['transform'];
            }
        } else if (this._logLevel > coordinator_1.LogLevel.None) {
            switch (interfaceName) {
                case 'pullable':
                    return ['pullFail'];
                case 'pushable':
                    return ['pushFail'];
                case 'queryable':
                    return ['queryFail'];
                case 'syncable':
                    return ['syncFail'];
                case 'updatable':
                    return ['updateFail'];
            }
        }
    };
    EventLoggingStrategy.prototype._addListener = function (source, event) {
        var listener = this._generateListener(source, event);
        utils_1.deepSet(this._eventListeners, [source.name, event], listener);
        source.on(event, listener, this);
    };
    EventLoggingStrategy.prototype._removeListener = function (source, event) {
        var listener = utils_1.deepGet(this._eventListeners, [source.name, event]);
        source.off(event, listener, this);
        this._eventListeners[source.name][event] = null;
    };
    EventLoggingStrategy.prototype._generateListener = function (source, event) {
        var _this = this;
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            console.log.apply(console, [_this._logPrefix, source.name, event].concat(args));
        };
    };
    return EventLoggingStrategy;
}(strategy_1.Strategy);
exports.EventLoggingStrategy = EventLoggingStrategy;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnQtbG9nZ2luZy1zdHJhdGVneS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9zdHJhdGVnaWVzL2V2ZW50LWxvZ2dpbmctc3RyYXRlZ3kudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDRCQUEwRTtBQUMxRSx5QkFBd0Q7QUFDeEQscUJBUXFCO0FBQ3JCLHNCQUE0RTtBQVM1RSw2Q0FBMEM7b0NBQVEsQUFLaEQ7a0NBQVksQUFBeUMsU0FBekM7Z0NBQUE7c0JBQXlDO0FBQXJEO29CQU9DLEFBTkMsQUFBTztnQkFBQyxBQUFJLE9BQUcsQUFBTyxRQUFDLEFBQUksUUFBSSxBQUFlLEFBQUMsQUFDL0M7Z0JBQUEsa0JBQU0sQUFBTyxBQUFDLFlBQUMsQUFFZixBQUFJO2NBQUMsQUFBTyxVQUFHLEFBQU8sUUFBQyxBQUFNLEFBQUMsQUFDOUIsQUFBSTtjQUFDLEFBQVcsY0FBRyxBQUFPLFFBQUMsQUFBVSxBQUFDLEFBQ3RDLEFBQUk7Y0FBQyxBQUFVLGFBQUcsQUFBTyxRQUFDLEFBQVMsYUFBSSxBQUFnQixBQUFDO2VBQzFELEFBQUM7QUFFRDttQ0FBUSxXQUFSLFVBQVMsQUFBd0IsYUFBRSxBQUErQixTQUFsRTtvQkFNQyxBQU5rQztnQ0FBQTtzQkFBK0I7QUFDaEUsQUFBTTtnQ0FBTyxBQUFRLG9CQUFDLEFBQVcsYUFBRSxBQUFPLEFBQUMsU0FDeEMsQUFBSSxLQUFDLFlBQ0osQUFBSTtrQkFBQyxBQUFlLGtCQUFHLEFBQUUsQUFBQyxBQUMxQixBQUFJO2tCQUFDLEFBQVEsU0FBQyxBQUFPLFFBQUMsVUFBQSxBQUFNLFFBQUk7dUJBQUEsQUFBSSxNQUFDLEFBQWUsZ0JBQXBCLEFBQXFCLEFBQU0sQUFBQyxBQUFDLEFBQUMsQUFDaEU7QUFBQyxBQUFDLEFBQUMsQUFDUDtBQUxTLEFBS1I7QUFFRDttQ0FBVSxhQUFWLFlBQUE7b0JBTUMsQUFMQyxBQUFNO2dDQUFPLEFBQVUsZ0JBQUUsTUFDdEIsQUFBSSxLQUFDLFlBQ0osQUFBSTtrQkFBQyxBQUFRLFNBQUMsQUFBTyxRQUFDLFVBQUEsQUFBTSxRQUFJO3VCQUFBLEFBQUksTUFBQyxBQUFpQixrQkFBdEIsQUFBdUIsQUFBTSxBQUFDLEFBQUMsQUFBQztBQUNoRSxBQUFJO2tCQUFDLEFBQWUsa0JBQUcsQUFBSSxBQUFDLEFBQzlCLEFBQUMsQUFBQyxBQUFDLEFBQ1A7QUFMUyxBQUtSO0FBRVM7bUNBQWUsa0JBQXpCLFVBQTBCLEFBQWMsUUFBeEM7b0JBSUMsQUFIQyxBQUFJO2FBQUMsQUFBYSxjQUFDLEFBQU0sQUFBQyxRQUFDLEFBQU8sUUFBQyxVQUFBLEFBQUssT0FDdEMsQUFBSTtrQkFBQyxBQUFZLGFBQUMsQUFBTSxRQUFFLEFBQUssQUFBQyxBQUFDLEFBQ25DLEFBQUMsQUFBQyxBQUFDLEFBQ0w7QUFBQztBQUVTO21DQUFpQixvQkFBM0IsVUFBNEIsQUFBYyxRQUExQztvQkFJQyxBQUhDLEFBQUk7YUFBQyxBQUFhLGNBQUMsQUFBTSxBQUFDLFFBQUMsQUFBTyxRQUFDLFVBQUEsQUFBSyxPQUN0QyxBQUFJO2tCQUFDLEFBQWUsZ0JBQUMsQUFBTSxRQUFFLEFBQUssQUFBQyxBQUFDLEFBQ3RDLEFBQUMsQUFBQyxBQUFDLEFBQ0w7QUFBQztBQUVTO21DQUFhLGdCQUF2QixVQUF3QixBQUFjLFFBQXRDO29CQWFDLEFBWkMsQUFBRSxBQUFDO1lBQUMsQUFBSSxLQUFDLEFBQU8sQUFBQyxTQUFDLEFBQUMsQUFDakIsQUFBTTttQkFBQyxBQUFJLEtBQUMsQUFBTyxBQUFDLEFBQ3RCLEFBQUMsQUFBQyxBQUFJO2VBQUMsQUFBQyxBQUNOO2dCQUFJLEFBQU0sV0FBRyxBQUFFLEFBQUMsQUFDaEI7Z0JBQUksQUFBVSxhQUFHLEFBQUksS0FBQyxBQUFXLGVBQUksQUFBSSxLQUFDLEFBQWlCLGtCQUFDLEFBQU0sQUFBQyxBQUFDLEFBRXBFLEFBQVU7dUJBQUMsQUFBTyxRQUFDLFVBQUEsQUFBQyxHQUNsQixBQUFLO3NCQUFDLEFBQVMsVUFBQyxBQUFJLEtBQUMsQUFBSyxNQUFDLEFBQU0sVUFBRSxBQUFJLE1BQUMsQUFBZ0IsaUJBQUMsQUFBQyxBQUFDLEFBQUMsQUFBQyxBQUMvRCxBQUFDLEFBQUMsQUFBQztBQUVILEFBQU07bUJBQUMsQUFBTSxBQUFDLEFBQ2hCLEFBQUMsQUFDSDtBQUFDO0FBRVM7bUNBQWlCLG9CQUEzQixVQUE0QixBQUFjLFFBQ3hDO1lBQUksQUFBVSxhQUFHLENBQUMsQUFBZSxBQUFDLEFBQUMsQUFDbkMsQUFBRSxBQUFDO1lBQUMsT0FBVSxXQUFDLEFBQU0sQUFBQyxBQUFDLFNBQUMsQUFBQyxBQUFDLEFBQVU7dUJBQUMsQUFBSSxLQUFDLEFBQVUsQUFBQyxBQUFDLEFBQUMsQUFBQztBQUN4RCxBQUFFLEFBQUM7WUFBQyxPQUFVLFdBQUMsQUFBTSxBQUFDLEFBQUMsU0FBQyxBQUFDLEFBQUMsQUFBVTt1QkFBQyxBQUFJLEtBQUMsQUFBVSxBQUFDLEFBQUMsQUFBQyxBQUFDO0FBQ3hELEFBQUUsQUFBQztZQUFDLE9BQVcsWUFBQyxBQUFNLEFBQUMsQUFBQyxTQUFDLEFBQUMsQUFBQyxBQUFVO3VCQUFDLEFBQUksS0FBQyxBQUFXLEFBQUMsQUFBQyxBQUFDLEFBQUM7QUFDMUQsQUFBRSxBQUFDO1lBQUMsT0FBVSxXQUFDLEFBQU0sQUFBQyxBQUFDLFNBQUMsQUFBQyxBQUFDLEFBQVU7dUJBQUMsQUFBSSxLQUFDLEFBQVUsQUFBQyxBQUFDLEFBQUMsQUFBQztBQUN4RCxBQUFFLEFBQUM7WUFBQyxPQUFXLFlBQUMsQUFBTSxBQUFDLEFBQUMsU0FBQyxBQUFDLEFBQUMsQUFBVTt1QkFBQyxBQUFJLEtBQUMsQUFBVyxBQUFDLEFBQUMsQUFBQyxBQUFDO0FBQzFELEFBQU07ZUFBQyxBQUFVLEFBQUMsQUFDcEIsQUFBQztBQUVTO21DQUFnQixtQkFBMUIsVUFBMkIsQUFBcUIsZUFDOUMsQUFBRSxBQUFDO1lBQUMsQUFBSSxLQUFDLEFBQVMsY0FBSyxjQUFRLFNBQUMsQUFBSSxBQUFDLE1BQUMsQUFBQyxBQUNyQyxBQUFNO29CQUFDLEFBQWEsQUFBQyxBQUFDLEFBQUMsQUFDckI7cUJBQUssQUFBVSxBQUNiLEFBQU07MkJBQUMsQ0FBQyxBQUFZLGNBQUUsQUFBTSxRQUFFLEFBQVUsQUFBQyxBQUFDLEFBQzVDO3FCQUFLLEFBQVUsQUFDYixBQUFNOzJCQUFDLENBQUMsQUFBWSxjQUFFLEFBQU0sUUFBRSxBQUFVLEFBQUMsQUFBQyxBQUM1QztxQkFBSyxBQUFXLEFBQ2QsQUFBTTsyQkFBQyxDQUFDLEFBQWEsZUFBRSxBQUFPLFNBQUUsQUFBVyxBQUFDLEFBQUMsQUFDL0M7cUJBQUssQUFBVyxBQUNkLEFBQU07MkJBQUMsQ0FBQyxBQUFjLGdCQUFFLEFBQVEsVUFBRSxBQUFZLEFBQUMsQUFBQyxBQUNsRDtxQkFBSyxBQUFVLEFBQ2IsQUFBTTsyQkFBQyxDQUFDLEFBQVksY0FBRSxBQUFNLFFBQUUsQUFBVSxBQUFDLEFBQUMsQUFDNUM7cUJBQUssQUFBZSxBQUNsQixBQUFNOzJCQUFDLENBQUMsQUFBVyxBQUFDLEFBQUMsQUFDekIsQUFBQyxBQUNILEFBQUMsQUFBQyxBQUFJOztlQUFDLEFBQUUsQUFBQyxJQUFDLEFBQUksS0FBQyxBQUFTLFlBQUcsY0FBUSxTQUFDLEFBQUksQUFBQyxNQUFDLEFBQUMsQUFDMUMsQUFBTTtvQkFBQyxBQUFhLEFBQUMsQUFBQyxBQUFDLEFBQ3JCO3FCQUFLLEFBQVUsQUFDYixBQUFNOzJCQUFDLENBQUMsQUFBVSxBQUFDLEFBQUMsQUFDdEI7cUJBQUssQUFBVSxBQUNiLEFBQU07MkJBQUMsQ0FBQyxBQUFVLEFBQUMsQUFBQyxBQUN0QjtxQkFBSyxBQUFXLEFBQ2QsQUFBTTsyQkFBQyxDQUFDLEFBQVcsQUFBQyxBQUFDLEFBQ3ZCO3FCQUFLLEFBQVUsQUFDYixBQUFNOzJCQUFDLENBQUMsQUFBVSxBQUFDLEFBQUMsQUFDdEI7cUJBQUssQUFBVyxBQUNkLEFBQU07MkJBQUMsQ0FBQyxBQUFZLEFBQUMsQUFBQyxBQUN6QixBQUFDLEFBQ0osQUFBQyxBQUNIOztBQUFDO0FBRVM7bUNBQVksZUFBdEIsVUFBdUIsQUFBYyxRQUFFLEFBQWEsT0FDbEQ7WUFBTSxBQUFRLFdBQUcsQUFBSSxLQUFDLEFBQWlCLGtCQUFDLEFBQU0sUUFBRSxBQUFLLEFBQUMsQUFBQyxBQUN2RDtnQkFBTyxRQUFDLEFBQUksS0FBQyxBQUFlLGlCQUFFLENBQUMsQUFBTSxPQUFDLEFBQUksTUFBRSxBQUFLLEFBQUMsUUFBRSxBQUFRLEFBQUMsQUFBQyxBQUM5RCxBQUFNO2VBQUMsQUFBRSxHQUFDLEFBQUssT0FBRSxBQUFRLFVBQUUsQUFBSSxBQUFDLEFBQUMsQUFDbkMsQUFBQztBQUVTO21DQUFlLGtCQUF6QixVQUEwQixBQUFjLFFBQUUsQUFBYSxPQUNyRDtZQUFNLEFBQVEsV0FBRyxRQUFPLFFBQUMsQUFBSSxLQUFDLEFBQWUsaUJBQUUsQ0FBQyxBQUFNLE9BQUMsQUFBSSxNQUFFLEFBQUssQUFBQyxBQUFDLEFBQUMsQUFDckUsQUFBTTtlQUFDLEFBQUcsSUFBQyxBQUFLLE9BQUUsQUFBUSxVQUFFLEFBQUksQUFBQyxBQUFDLEFBQ2xDLEFBQUk7YUFBQyxBQUFlLGdCQUFDLEFBQU0sT0FBQyxBQUFJLEFBQUMsTUFBQyxBQUFLLEFBQUMsU0FBRyxBQUFJLEFBQUMsQUFDbEQsQUFBQztBQUVTO21DQUFpQixvQkFBM0IsVUFBNEIsQUFBYyxRQUFFLEFBQWEsT0FBekQ7b0JBSUMsQUFIQyxBQUFNO2VBQUMsWUFBQzt1QkFBTztpQkFBUCxTQUFPLEdBQVAsZUFBTyxRQUFQLEFBQU8sTUFBUDtxQ0FBTztBQUNiLEFBQU87b0JBQUMsQUFBRyxVQUFYLEFBQU8sVUFBSyxBQUFJLE1BQUMsQUFBVSxZQUFFLEFBQU0sT0FBQyxBQUFJLE1BQUUsQUFBSyxjQUFLLEFBQUksQUFBRSxBQUM1RCxBQUFDLEFBQUMsQUFDSjtBQUFDO0FBQ0g7V0FBQSxBQUFDLEFBcEhELEFBb0hDO0VBcEh5QyxXQUFRLEFBb0hqRDtBQXBIWSwrQkFBb0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ29vcmRpbmF0b3IsIHsgQWN0aXZhdGlvbk9wdGlvbnMsIExvZ0xldmVsIH0gZnJvbSAnLi4vY29vcmRpbmF0b3InO1xyXG5pbXBvcnQgeyBTdHJhdGVneSwgU3RyYXRlZ3lPcHRpb25zIH0gZnJvbSAnLi4vc3RyYXRlZ3knO1xyXG5pbXBvcnQgT3JiaXQsIHtcclxuICBTb3VyY2UsXHJcbiAgVHJhbnNmb3JtLFxyXG4gIGlzUHVsbGFibGUsXHJcbiAgaXNQdXNoYWJsZSxcclxuICBpc1F1ZXJ5YWJsZSxcclxuICBpc1N5bmNhYmxlLFxyXG4gIGlzVXBkYXRhYmxlXHJcbn0gZnJvbSAnQG9yYml0L2RhdGEnO1xyXG5pbXBvcnQgeyBEaWN0LCBhc3NlcnQsIG9iamVjdFZhbHVlcywgZGVlcEdldCwgZGVlcFNldCB9IGZyb20gJ0BvcmJpdC91dGlscyc7XHJcblxyXG5kZWNsYXJlIGNvbnN0IGNvbnNvbGU6IGFueTtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgRXZlbnRMb2dnaW5nU3RyYXRlZ3lPcHRpb25zIGV4dGVuZHMgU3RyYXRlZ3lPcHRpb25zIHtcclxuICBldmVudHM/OiBzdHJpbmdbXTtcclxuICBpbnRlcmZhY2VzPzogc3RyaW5nW107XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBFdmVudExvZ2dpbmdTdHJhdGVneSBleHRlbmRzIFN0cmF0ZWd5IHtcclxuICBwcm90ZWN0ZWQgX2V2ZW50cz86IHN0cmluZ1tdO1xyXG4gIHByb3RlY3RlZCBfaW50ZXJmYWNlcz86IHN0cmluZ1tdO1xyXG4gIHByb3RlY3RlZCBfZXZlbnRMaXN0ZW5lcnM6IERpY3Q8RGljdDxGdW5jdGlvbj4+O1xyXG5cclxuICBjb25zdHJ1Y3RvcihvcHRpb25zOiBFdmVudExvZ2dpbmdTdHJhdGVneU9wdGlvbnMgPSB7fSkge1xyXG4gICAgb3B0aW9ucy5uYW1lID0gb3B0aW9ucy5uYW1lIHx8ICdldmVudC1sb2dnaW5nJztcclxuICAgIHN1cGVyKG9wdGlvbnMpO1xyXG5cclxuICAgIHRoaXMuX2V2ZW50cyA9IG9wdGlvbnMuZXZlbnRzO1xyXG4gICAgdGhpcy5faW50ZXJmYWNlcyA9IG9wdGlvbnMuaW50ZXJmYWNlcztcclxuICAgIHRoaXMuX2xvZ1ByZWZpeCA9IG9wdGlvbnMubG9nUHJlZml4IHx8ICdbc291cmNlLWV2ZW50XSc7XHJcbiAgfVxyXG5cclxuICBhY3RpdmF0ZShjb29yZGluYXRvcjogQ29vcmRpbmF0b3IsIG9wdGlvbnM6IEFjdGl2YXRpb25PcHRpb25zID0ge30pOiBQcm9taXNlPGFueT4ge1xyXG4gICAgcmV0dXJuIHN1cGVyLmFjdGl2YXRlKGNvb3JkaW5hdG9yLCBvcHRpb25zKVxyXG4gICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5fZXZlbnRMaXN0ZW5lcnMgPSB7fTtcclxuICAgICAgICB0aGlzLl9zb3VyY2VzLmZvckVhY2goc291cmNlID0+IHRoaXMuX2FjdGl2YXRlU291cmNlKHNvdXJjZSkpO1xyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIGRlYWN0aXZhdGUoKTogUHJvbWlzZTxhbnk+IHtcclxuICAgIHJldHVybiBzdXBlci5kZWFjdGl2YXRlKClcclxuICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuX3NvdXJjZXMuZm9yRWFjaChzb3VyY2UgPT4gdGhpcy5fZGVhY3RpdmF0ZVNvdXJjZShzb3VyY2UpKTtcclxuICAgICAgICB0aGlzLl9ldmVudExpc3RlbmVycyA9IG51bGw7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJvdGVjdGVkIF9hY3RpdmF0ZVNvdXJjZShzb3VyY2U6IFNvdXJjZSkge1xyXG4gICAgdGhpcy5fc291cmNlRXZlbnRzKHNvdXJjZSkuZm9yRWFjaChldmVudCA9PiB7XHJcbiAgICAgIHRoaXMuX2FkZExpc3RlbmVyKHNvdXJjZSwgZXZlbnQpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcm90ZWN0ZWQgX2RlYWN0aXZhdGVTb3VyY2Uoc291cmNlOiBTb3VyY2UpIHtcclxuICAgIHRoaXMuX3NvdXJjZUV2ZW50cyhzb3VyY2UpLmZvckVhY2goZXZlbnQgPT4ge1xyXG4gICAgICB0aGlzLl9yZW1vdmVMaXN0ZW5lcihzb3VyY2UsIGV2ZW50KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJvdGVjdGVkIF9zb3VyY2VFdmVudHMoc291cmNlOiBTb3VyY2UpIHtcclxuICAgIGlmICh0aGlzLl9ldmVudHMpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuX2V2ZW50cztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGxldCBldmVudHMgPSBbXTtcclxuICAgICAgbGV0IGludGVyZmFjZXMgPSB0aGlzLl9pbnRlcmZhY2VzIHx8IHRoaXMuX3NvdXJjZUludGVyZmFjZXMoc291cmNlKTtcclxuXHJcbiAgICAgIGludGVyZmFjZXMuZm9yRWFjaChpID0+IHtcclxuICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShldmVudHMsIHRoaXMuX2ludGVyZmFjZUV2ZW50cyhpKSk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgcmV0dXJuIGV2ZW50cztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByb3RlY3RlZCBfc291cmNlSW50ZXJmYWNlcyhzb3VyY2U6IFNvdXJjZSkge1xyXG4gICAgbGV0IGludGVyZmFjZXMgPSBbJ3RyYW5zZm9ybWFibGUnXTtcclxuICAgIGlmIChpc1B1bGxhYmxlKHNvdXJjZSkpIHsgaW50ZXJmYWNlcy5wdXNoKCdwdWxsYWJsZScpOyB9XHJcbiAgICBpZiAoaXNQdXNoYWJsZShzb3VyY2UpKSB7IGludGVyZmFjZXMucHVzaCgncHVzaGFibGUnKTsgfVxyXG4gICAgaWYgKGlzUXVlcnlhYmxlKHNvdXJjZSkpIHsgaW50ZXJmYWNlcy5wdXNoKCdxdWVyeWFibGUnKTsgfVxyXG4gICAgaWYgKGlzU3luY2FibGUoc291cmNlKSkgeyBpbnRlcmZhY2VzLnB1c2goJ3N5bmNhYmxlJyk7IH1cclxuICAgIGlmIChpc1VwZGF0YWJsZShzb3VyY2UpKSB7IGludGVyZmFjZXMucHVzaCgndXBkYXRhYmxlJyk7IH1cclxuICAgIHJldHVybiBpbnRlcmZhY2VzO1xyXG4gIH1cclxuXHJcbiAgcHJvdGVjdGVkIF9pbnRlcmZhY2VFdmVudHMoaW50ZXJmYWNlTmFtZTogc3RyaW5nKTogc3RyaW5nW10ge1xyXG4gICAgaWYgKHRoaXMuX2xvZ0xldmVsID09PSBMb2dMZXZlbC5JbmZvKSB7XHJcbiAgICAgIHN3aXRjaChpbnRlcmZhY2VOYW1lKSB7XHJcbiAgICAgICAgY2FzZSAncHVsbGFibGUnOlxyXG4gICAgICAgICAgcmV0dXJuIFsnYmVmb3JlUHVsbCcsICdwdWxsJywgJ3B1bGxGYWlsJ107XHJcbiAgICAgICAgY2FzZSAncHVzaGFibGUnOlxyXG4gICAgICAgICAgcmV0dXJuIFsnYmVmb3JlUHVzaCcsICdwdXNoJywgJ3B1c2hGYWlsJ107XHJcbiAgICAgICAgY2FzZSAncXVlcnlhYmxlJzpcclxuICAgICAgICAgIHJldHVybiBbJ2JlZm9yZVF1ZXJ5JywgJ3F1ZXJ5JywgJ3F1ZXJ5RmFpbCddO1xyXG4gICAgICAgIGNhc2UgJ3VwZGF0YWJsZSc6XHJcbiAgICAgICAgICByZXR1cm4gWydiZWZvcmVVcGRhdGUnLCAndXBkYXRlJywgJ3VwZGF0ZUZhaWwnXTtcclxuICAgICAgICBjYXNlICdzeW5jYWJsZSc6XHJcbiAgICAgICAgICByZXR1cm4gWydiZWZvcmVTeW5jJywgJ3N5bmMnLCAnc3luY0ZhaWwnXTtcclxuICAgICAgICBjYXNlICd0cmFuc2Zvcm1hYmxlJzpcclxuICAgICAgICAgIHJldHVybiBbJ3RyYW5zZm9ybSddO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuX2xvZ0xldmVsID4gTG9nTGV2ZWwuTm9uZSkge1xyXG4gICAgICBzd2l0Y2goaW50ZXJmYWNlTmFtZSkge1xyXG4gICAgICAgIGNhc2UgJ3B1bGxhYmxlJzpcclxuICAgICAgICAgIHJldHVybiBbJ3B1bGxGYWlsJ107XHJcbiAgICAgICAgY2FzZSAncHVzaGFibGUnOlxyXG4gICAgICAgICAgcmV0dXJuIFsncHVzaEZhaWwnXTtcclxuICAgICAgICBjYXNlICdxdWVyeWFibGUnOlxyXG4gICAgICAgICAgcmV0dXJuIFsncXVlcnlGYWlsJ107XHJcbiAgICAgICAgY2FzZSAnc3luY2FibGUnOlxyXG4gICAgICAgICAgcmV0dXJuIFsnc3luY0ZhaWwnXTtcclxuICAgICAgICBjYXNlICd1cGRhdGFibGUnOlxyXG4gICAgICAgICAgcmV0dXJuIFsndXBkYXRlRmFpbCddO1xyXG4gICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJvdGVjdGVkIF9hZGRMaXN0ZW5lcihzb3VyY2U6IFNvdXJjZSwgZXZlbnQ6IHN0cmluZykge1xyXG4gICAgY29uc3QgbGlzdGVuZXIgPSB0aGlzLl9nZW5lcmF0ZUxpc3RlbmVyKHNvdXJjZSwgZXZlbnQpO1xyXG4gICAgZGVlcFNldCh0aGlzLl9ldmVudExpc3RlbmVycywgW3NvdXJjZS5uYW1lLCBldmVudF0sIGxpc3RlbmVyKTtcclxuICAgIHNvdXJjZS5vbihldmVudCwgbGlzdGVuZXIsIHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgcHJvdGVjdGVkIF9yZW1vdmVMaXN0ZW5lcihzb3VyY2U6IFNvdXJjZSwgZXZlbnQ6IHN0cmluZykge1xyXG4gICAgY29uc3QgbGlzdGVuZXIgPSBkZWVwR2V0KHRoaXMuX2V2ZW50TGlzdGVuZXJzLCBbc291cmNlLm5hbWUsIGV2ZW50XSk7XHJcbiAgICBzb3VyY2Uub2ZmKGV2ZW50LCBsaXN0ZW5lciwgdGhpcyk7XHJcbiAgICB0aGlzLl9ldmVudExpc3RlbmVyc1tzb3VyY2UubmFtZV1bZXZlbnRdID0gbnVsbDtcclxuICB9XHJcblxyXG4gIHByb3RlY3RlZCBfZ2VuZXJhdGVMaXN0ZW5lcihzb3VyY2U6IFNvdXJjZSwgZXZlbnQ6IHN0cmluZykge1xyXG4gICAgcmV0dXJuICguLi5hcmdzKTogdm9pZCA9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMuX2xvZ1ByZWZpeCwgc291cmNlLm5hbWUsIGV2ZW50LCAuLi5hcmdzKTtcclxuICAgIH07XHJcbiAgfVxyXG59XHJcbiJdfQ==