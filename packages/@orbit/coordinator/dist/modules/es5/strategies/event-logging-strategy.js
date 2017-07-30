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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnQtbG9nZ2luZy1zdHJhdGVneS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9zdHJhdGVnaWVzL2V2ZW50LWxvZ2dpbmctc3RyYXRlZ3kudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw0QkFBMEU7QUFDMUUseUJBQXdEO0FBQ3hELHFCQVFxQjtBQUNyQixzQkFBNEU7QUFTNUU7QUFBMEMsb0NBQVE7QUFLaEQsa0NBQVksQUFBeUM7QUFBekMsZ0NBQUE7QUFBQSxzQkFBeUM7O0FBQXJELG9CQU9DO0FBTkMsQUFBTyxnQkFBQyxBQUFJLE9BQUcsQUFBTyxRQUFDLEFBQUksUUFBSSxBQUFlLEFBQUM7QUFDL0MsZ0JBQUEsa0JBQU0sQUFBTyxBQUFDLFlBQUM7QUFFZixBQUFJLGNBQUMsQUFBTyxVQUFHLEFBQU8sUUFBQyxBQUFNLEFBQUM7QUFDOUIsQUFBSSxjQUFDLEFBQVcsY0FBRyxBQUFPLFFBQUMsQUFBVSxBQUFDO0FBQ3RDLEFBQUksY0FBQyxBQUFVLGFBQUcsQUFBTyxRQUFDLEFBQVMsYUFBSSxBQUFnQixBQUFDO2VBQzFEO0FBQUM7QUFFRCxtQ0FBUSxXQUFSLFVBQVMsQUFBd0IsYUFBRSxBQUErQjtBQUFsRSxvQkFNQztBQU5rQyxnQ0FBQTtBQUFBLHNCQUErQjs7QUFDaEUsQUFBTSxnQ0FBTyxBQUFRLG9CQUFDLEFBQVcsYUFBRSxBQUFPLEFBQUMsU0FDeEMsQUFBSSxLQUFDO0FBQ0osQUFBSSxrQkFBQyxBQUFlLGtCQUFHLEFBQUUsQUFBQztBQUMxQixBQUFJLGtCQUFDLEFBQVEsU0FBQyxBQUFPLFFBQUMsVUFBQSxBQUFNO0FBQUksdUJBQUEsQUFBSSxNQUFDLEFBQWUsZ0JBQXBCLEFBQXFCLEFBQU0sQUFBQztBQUFBLEFBQUMsQUFBQyxBQUNoRTtBQUFDLEFBQUMsQUFBQyxBQUNQLFNBTFM7QUFLUjtBQUVELG1DQUFVLGFBQVY7QUFBQSxvQkFNQztBQUxDLEFBQU0s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Y3RpdmF0aW9uT3B0aW9ucywgTG9nTGV2ZWwgfSBmcm9tICcuLi9jb29yZGluYXRvcic7XHJcbmltcG9ydCB7IFN0cmF0ZWd5LCBTdHJhdGVneU9wdGlvbnMgfSBmcm9tICcuLi9zdHJhdGVneSc7XHJcbmltcG9ydCBPcmJpdCwge1xyXG4gIFNvdXJjZSxcclxuICBUcmFuc2Zvcm0sXHJcbiAgaXNQdWxsYWJsZSxcclxuICBpc1B1c2hhYmxlLFxyXG4gIGlzUXVlcnlhYmxlLFxyXG4gIGlzU3luY2FibGUsXHJcbiAgaXNVcGRhdGFibGVcclxufSBmcm9tICdAb3JiaXQvZGF0YSc7XHJcbmltcG9ydCB7IERpY3QsIGFzc2VydCwgb2JqZWN0VmFsdWVzLCBkZWVwR2V0LCBkZWVwU2V0IH0gZnJvbSAnQG9yYml0L3V0aWxzJztcclxuXHJcbmRlY2xhcmUgY29uc3QgY29uc29sZTogYW55O1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBFdmVudExvZ2dpbmdTdHJhdGVneU9wdGlvbnMgZXh0ZW5kcyBTdHJhdGVneU9wdGlvbnMge1xyXG4gIGV2ZW50cz86IHN0cmluZ1tdO1xyXG4gIGludGVyZmFjZXM/OiBzdHJpbmdbXTtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEV2ZW50TG9nZ2luZ1N0cmF0ZWd5IGV4dGVuZHMgU3RyYXRlZ3kge1xyXG4gIHByb3RlY3RlZCBfZXZlbnRzPzogc3RyaW5nW107XHJcbiAgcHJvdGVjdGVkIF9pbnRlcmZhY2VzPzogc3RyaW5nW107XHJcbiAgcHJvdGVjdGVkIF9ldmVudExpc3RlbmVyczogRGljdDxEaWN0PEZ1bmN0aW9uPj47XHJcblxyXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM6IEV2ZW50TG9nZ2luZ1N0cmF0ZWd5T3B0aW9ucyA9IHt9KSB7XHJcbiAgICBvcHRpb25zLm5hbWUgPSBvcHRpb25zLm5hbWUgfHwgJ2V2ZW50LWxvZ2dpbmcnO1xyXG4gICAgc3VwZXIob3B0aW9ucyk7XHJcblxyXG4gICAgdGhpcy5fZXZlbnRzID0gb3B0aW9ucy5ldmVudHM7XHJcbiAgICB0aGlzLl9pbnRlcmZhY2VzID0gb3B0aW9ucy5pbnRlcmZhY2VzO1xyXG4gICAgdGhpcy5fbG9nUHJlZml4ID0gb3B0aW9ucy5sb2dQcmVmaXggfHwgJ1tzb3VyY2UtZXZlbnRdJztcclxuICB9XHJcblxyXG4gIGFjdGl2YXRlKGNvb3JkaW5hdG9yOiBDb29yZGluYXRvciwgb3B0aW9uczogQWN0aXZhdGlvbk9wdGlvbnMgPSB7fSk6IFByb21pc2U8YW55PiB7XHJcbiAgICByZXR1cm4gc3VwZXIuYWN0aXZhdGUoY29vcmRpbmF0b3IsIG9wdGlvbnMpXHJcbiAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICB0aGlzLl9ldmVudExpc3RlbmVycyA9IHt9O1xyXG4gICAgICAgIHRoaXMuX3NvdXJjZXMuZm9yRWFjaChzb3VyY2UgPT4gdGhpcy5fYWN0aXZhdGVTb3VyY2Uoc291cmNlKSk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZGVhY3RpdmF0ZSgpOiBQcm9taXNlPGFueT4ge1xyXG4gICAgcmV0dXJuIHN1cGVyLmRlYWN0aXZhdGUoKVxyXG4gICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5fc291cmNlcy5mb3JFYWNoKHNvdXJjZSA9PiB0aGlzLl9kZWFjdGl2YXRlU291cmNlKHNvdXJjZSkpO1xyXG4gICAgICAgIHRoaXMuX2V2ZW50TGlzdGVuZXJzID0gbnVsbDtcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcm90ZWN0ZWQgX2FjdGl2YXRlU291cmNlKHNvdXJjZTogU291cmNlKSB7XHJcbiAgICB0aGlzLl9zb3VyY2VFdmVudHMoc291cmNlKS5mb3JFYWNoKGV2ZW50ID0+IHtcclxuICAgICAgdGhpcy5fYWRkTGlzdGVuZXIoc291cmNlLCBldmVudCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHByb3RlY3RlZCBfZGVhY3RpdmF0ZVNvdXJjZShzb3VyY2U6IFNvdXJjZSkge1xyXG4gICAgdGhpcy5fc291cmNlRXZlbnRzKHNvdXJjZSkuZm9yRWFjaChldmVudCA9PiB7XHJcbiAgICAgIHRoaXMuX3JlbW92ZUxpc3RlbmVyKHNvdXJjZSwgZXZlbnQpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcm90ZWN0ZWQgX3NvdXJjZUV2ZW50cyhzb3VyY2U6IFNvdXJjZSkge1xyXG4gICAgaWYgKHRoaXMuX2V2ZW50cykge1xyXG4gICAgICByZXR1cm4gdGhpcy5fZXZlbnRzO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbGV0IGV2ZW50cyA9IFtdO1xyXG4gICAgICBsZXQgaW50ZXJmYWNlcyA9IHRoaXMuX2ludGVyZmFjZXMgfHwgdGhpcy5fc291cmNlSW50ZXJmYWNlcyhzb3VyY2UpO1xyXG5cclxuICAgICAgaW50ZXJmYWNlcy5mb3JFYWNoKGkgPT4ge1xyXG4gICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KGV2ZW50cywgdGhpcy5faW50ZXJmYWNlRXZlbnRzKGkpKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICByZXR1cm4gZXZlbnRzO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJvdGVjdGVkIF9zb3VyY2VJbnRlcmZhY2VzKHNvdXJjZTogU291cmNlKSB7XHJcbiAgICBsZXQgaW50ZXJmYWNlcyA9IFsndHJhbnNmb3JtYWJsZSddO1xyXG4gICAgaWYgKGlzUHVsbGFibGUoc291cmNlKSkgeyBpbnRlcmZhY2VzLnB1c2goJ3B1bGxhYmxlJyk7IH1cclxuICAgIGlmIChpc1B1c2hhYmxlKHNvdXJjZSkpIHsgaW50ZXJmYWNlcy5wdXNoKCdwdXNoYWJsZScpOyB9XHJcbiAgICBpZiAoaXNRdWVyeWFibGUoc291cmNlKSkgeyBpbnRlcmZhY2VzLnB1c2goJ3F1ZXJ5YWJsZScpOyB9XHJcbiAgICBpZiAoaXNTeW5jYWJsZShzb3VyY2UpKSB7IGludGVyZmFjZXMucHVzaCgnc3luY2FibGUnKTsgfVxyXG4gICAgaWYgKGlzVXBkYXRhYmxlKHNvdXJjZSkpIHsgaW50ZXJmYWNlcy5wdXNoKCd1cGRhdGFibGUnKTsgfVxyXG4gICAgcmV0dXJuIGludGVyZmFjZXM7XHJcbiAgfVxyXG5cclxuICBwcm90ZWN0ZWQgX2ludGVyZmFjZUV2ZW50cyhpbnRlcmZhY2VOYW1lOiBzdHJpbmcpOiBzdHJpbmdbXSB7XHJcbiAgICBpZiAodGhpcy5fbG9nTGV2ZWwgPT09IExvZ0xldmVsLkluZm8pIHtcclxuICAgICAgc3dpdGNoKGludGVyZmFjZU5hbWUpIHtcclxuICAgICAgICBjYXNlICdwdWxsYWJsZSc6XHJcbiAgICAgICAgICByZXR1cm4gWydiZWZvcmVQdWxsJywgJ3B1bGwnLCAncHVsbEZhaWwnXTtcclxuICAgICAgICBjYXNlICdwdXNoYWJsZSc6XHJcbiAgICAgICAgICByZXR1cm4gWydiZWZvcmVQdXNoJywgJ3B1c2gnLCAncHVzaEZhaWwnXTtcclxuICAgICAgICBjYXNlICdxdWVyeWFibGUnOlxyXG4gICAgICAgICAgcmV0dXJuIFsnYmVmb3JlUXVlcnknLCAncXVlcnknLCAncXVlcnlGYWlsJ107XHJcbiAgICAgICAgY2FzZSAndXBkYXRhYmxlJzpcclxuICAgICAgICAgIHJldHVybiBbJ2JlZm9yZVVwZGF0ZScsICd1cGRhdGUnLCAndXBkYXRlRmFpbCddO1xyXG4gICAgICAgIGNhc2UgJ3N5bmNhYmxlJzpcclxuICAgICAgICAgIHJldHVybiBbJ2JlZm9yZVN5bmMnLCAnc3luYycsICdzeW5jRmFpbCddO1xyXG4gICAgICAgIGNhc2UgJ3RyYW5zZm9ybWFibGUnOlxyXG4gICAgICAgICAgcmV0dXJuIFsndHJhbnNmb3JtJ107XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAodGhpcy5fbG9nTGV2ZWwgPiBMb2dMZXZlbC5Ob25lKSB7XHJcbiAgICAgIHN3aXRjaChpbnRlcmZhY2VOYW1lKSB7XHJcbiAgICAgICAgY2FzZSAncHVsbGFibGUnOlxyXG4gICAgICAgICAgcmV0dXJuIFsncHVsbEZhaWwnXTtcclxuICAgICAgICBjYXNlICdwdXNoYWJsZSc6XHJcbiAgICAgICAgICByZXR1cm4gWydwdXNoRmFpbCddO1xyXG4gICAgICAgIGNhc2UgJ3F1ZXJ5YWJsZSc6XHJcbiAgICAgICAgICByZXR1cm4gWydxdWVyeUZhaWwnXTtcclxuICAgICAgICBjYXNlICdzeW5jYWJsZSc6XHJcbiAgICAgICAgICByZXR1cm4gWydzeW5jRmFpbCddO1xyXG4gICAgICAgIGNhc2UgJ3VwZGF0YWJsZSc6XHJcbiAgICAgICAgICByZXR1cm4gWyd1cGRhdGVGYWlsJ107XHJcbiAgICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcm90ZWN0ZWQgX2FkZExpc3RlbmVyKHNvdXJjZTogU291cmNlLCBldmVudDogc3RyaW5nKSB7XHJcbiAgICBjb25zdCBsaXN0ZW5lciA9IHRoaXMuX2dlbmVyYXRlTGlzdGVuZXIoc291cmNlLCBldmVudCk7XHJcbiAgICBkZWVwU2V0KHRoaXMuX2V2ZW50TGlzdGVuZXJzLCBbc291cmNlLm5hbWUsIGV2ZW50XSwgbGlzdGVuZXIpO1xyXG4gICAgc291cmNlLm9uKGV2ZW50LCBsaXN0ZW5lciwgdGhpcyk7XHJcbiAgfVxyXG5cclxuICBwcm90ZWN0ZWQgX3JlbW92ZUxpc3RlbmVyKHNvdXJjZTogU291cmNlLCBldmVudDogc3RyaW5nKSB7XHJcbiAgICBjb25zdCBsaXN0ZW5lciA9IGRlZXBHZXQodGhpcy5fZXZlbnRMaXN0ZW5lcnMsIFtzb3VyY2UubmFtZSwgZXZlbnRdKTtcclxuICAgIHNvdXJjZS5vZmYoZXZlbnQsIGxpc3RlbmVyLCB0aGlzKTtcclxuICAgIHRoaXMuX2V2ZW50TGlzdGVuZXJzW3NvdXJjZS5uYW1lXVtldmVudF0gPSBudWxsO1xyXG4gIH1cclxuXHJcbiAgcHJvdGVjdGVkIF9nZW5lcmF0ZUxpc3RlbmVyKHNvdXJjZTogU291cmNlLCBldmVudDogc3RyaW5nKSB7XHJcbiAgICByZXR1cm4gKC4uLmFyZ3MpOiB2b2lkID0+IHtcclxuICAgICAgY29uc29sZS5sb2codGhpcy5fbG9nUHJlZml4LCBzb3VyY2UubmFtZSwgZXZlbnQsIC4uLmFyZ3MpO1xyXG4gICAgfTtcclxuICB9XHJcbn1cclxuIl19