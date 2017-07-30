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
var data_1 = require("@orbit/data");
var LogTruncationStrategy = function (_super) {
    __extends(LogTruncationStrategy, _super);
    function LogTruncationStrategy(options) {
        if (options === void 0) {
            options = {};
        }
        var _this = this;
        options.name = options.name || 'log-truncation';
        _this = _super.call(this, options) || this;
        return _this;
    }
    LogTruncationStrategy.prototype.activate = function (coordinator, options) {
        var _this = this;
        if (options === void 0) {
            options = {};
        }
        return _super.prototype.activate.call(this, coordinator, options).then(function () {
            return _this._reifySources();
        }).then(function () {
            _this._transformListeners = {};
            _this._sources.forEach(function (source) {
                return _this._activateSource(source);
            });
        });
    };
    LogTruncationStrategy.prototype.deactivate = function () {
        var _this = this;
        return _super.prototype.deactivate.call(this).then(function () {
            _this._sources.forEach(function (source) {
                return _this._deactivateSource(source);
            });
            _this._transformListeners = null;
        });
    };
    LogTruncationStrategy.prototype._reifySources = function () {
        return this._sources.reduce(function (chain, source) {
            return chain.then(function () {
                return source.transformLog.reified;
            });
        }, data_1.default.Promise.resolve());
    };
    LogTruncationStrategy.prototype._review = function (source, transformId) {
        var sources = this._sources;
        var match = true;
        if (sources.length > 1) {
            for (var i = 0; i < sources.length; i++) {
                var s = sources[i];
                if (s !== source) {
                    if (!s.transformLog.contains(transformId)) {
                        match = false;
                        break;
                    }
                }
            }
        }
        if (match) {
            return this._truncateSources(transformId, 0);
        } else {
            return data_1.default.Promise.resolve();
        }
    };
    LogTruncationStrategy.prototype._truncateSources = function (transformId, relativePosition) {
        return this._sources.reduce(function (chain, source) {
            return chain.then(function () {
                return source.transformLog.truncate(transformId, relativePosition);
            });
        }, data_1.default.Promise.resolve());
    };
    LogTruncationStrategy.prototype._activateSource = function (source) {
        var _this = this;
        var listener = this._transformListeners[source.name] = function (transform) {
            return _this._review(source, transform.id);
        };
        source.on('transform', listener);
    };
    LogTruncationStrategy.prototype._deactivateSource = function (source) {
        var listener = this._transformListeners[source.name];
        source.off('transform', listener);
        delete this._transformListeners[source.name];
    };
    return LogTruncationStrategy;
}(strategy_1.Strategy);
exports.LogTruncationStrategy = LogTruncationStrategy;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nLXRydW5jYXRpb24tc3RyYXRlZ3kuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvc3RyYXRlZ2llcy9sb2ctdHJ1bmNhdGlvbi1zdHJhdGVneS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EseUJBQXdEO0FBQ3hELHFCQUdxQjtBQUdyQiw4Q0FBMkM7cUNBQVEsQUFLakQ7bUNBQVksQUFBNkIsU0FBN0I7Z0NBQUE7c0JBQTZCO0FBQXpDO29CQUdDLEFBRkMsQUFBTztnQkFBQyxBQUFJLE9BQUcsQUFBTyxRQUFDLEFBQUksUUFBSSxBQUFnQixBQUFDLEFBQ2hEO2dCQUFBLGtCQUFNLEFBQU8sQUFBQyxZQUFDO2VBQ2pCLEFBQUM7QUFFRDtvQ0FBUSxXQUFSLFVBQVMsQUFBd0IsYUFBRSxBQUErQixTQUFsRTtvQkFTQyxBQVRrQztnQ0FBQTtzQkFBK0I7QUFDaEUsQUFBTTtnQ0FBTyxBQUFRLG9CQUFDLEFBQVcsYUFBRSxBQUFPLEFBQUMsU0FDeEMsQUFBSSxLQUFDLFlBQ0osQUFBTTttQkFBQyxBQUFJLE1BQUMsQUFBYSxBQUFFLEFBQUMsQUFDOUIsQUFBQyxBQUFDO0FBSEcsV0FJSixBQUFJLEtBQUMsWUFDSixBQUFJO2tCQUFDLEFBQW1CLHNCQUFHLEFBQUUsQUFBQyxBQUM5QixBQUFJO2tCQUFDLEFBQVEsU0FBQyxBQUFPLFFBQUMsVUFBQSxBQUFNLFFBQUk7dUJBQUEsQUFBSSxNQUFDLEFBQWUsZ0JBQXBCLEFBQXFCLEFBQU0sQUFBQyxBQUFDLEFBQUMsQUFDaEU7QUFBQyxBQUFDLEFBQUMsQUFDUDtBQUFDO0FBRUQ7b0NBQVUsYUFBVixZQUFBO29CQU1DLEFBTEMsQUFBTTtnQ0FBTyxBQUFVLGdCQUFFLE1BQ3RCLEFBQUksS0FBQyxZQUNKLEFBQUk7a0JBQUMsQUFBUSxTQUFDLEFBQU8sUUFBQyxVQUFBLEFBQU0sUUFBSTt1QkFBQSxBQUFJLE1BQUMs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LEFBQ2xDO2VBQU8sQUFBSSxLQUFDLEFBQW1CLG9CQUFDLEFBQU0sT0FBQyxBQUFJLEFBQUMsQUFBQyxBQUMvQyxBQUFDO0FBQ0g7V0FBQSxBQUFDLEFBL0VELEFBK0VDO0VBL0UwQyxXQUFRLEFBK0VsRDtBQS9FWSxnQ0FBcUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ29vcmRpbmF0b3IsIHsgQWN0aXZhdGlvbk9wdGlvbnMgfSBmcm9tICcuLi9jb29yZGluYXRvcic7XHJcbmltcG9ydCB7IFN0cmF0ZWd5LCBTdHJhdGVneU9wdGlvbnMgfSBmcm9tICcuLi9zdHJhdGVneSc7XHJcbmltcG9ydCBPcmJpdCwge1xyXG4gIFNvdXJjZSxcclxuICBUcmFuc2Zvcm1cclxufSBmcm9tICdAb3JiaXQvZGF0YSc7XHJcbmltcG9ydCB7IERpY3QsIGFzc2VydCwgb2JqZWN0VmFsdWVzIH0gZnJvbSAnQG9yYml0L3V0aWxzJztcclxuXHJcbmV4cG9ydCBjbGFzcyBMb2dUcnVuY2F0aW9uU3RyYXRlZ3kgZXh0ZW5kcyBTdHJhdGVneSB7XHJcbiAgcHJvdGVjdGVkIF9yZXZpZXdpbmc6IFByb21pc2U8dm9pZD47XHJcbiAgcHJvdGVjdGVkIF9leHRyYVJldmlld05lZWRlZDogYm9vbGVhbjtcclxuICBwcm90ZWN0ZWQgX3RyYW5zZm9ybUxpc3RlbmVyczogRGljdDwodHJhbnNmb3JtOiBUcmFuc2Zvcm0pID0+IHZvaWQ+O1xyXG5cclxuICBjb25zdHJ1Y3RvcihvcHRpb25zOiBTdHJhdGVneU9wdGlvbnMgPSB7fSkge1xyXG4gICAgb3B0aW9ucy5uYW1lID0gb3B0aW9ucy5uYW1lIHx8ICdsb2ctdHJ1bmNhdGlvbic7XHJcbiAgICBzdXBlcihvcHRpb25zKTtcclxuICB9XHJcblxyXG4gIGFjdGl2YXRlKGNvb3JkaW5hdG9yOiBDb29yZGluYXRvciwgb3B0aW9uczogQWN0aXZhdGlvbk9wdGlvbnMgPSB7fSk6IFByb21pc2U8YW55PiB7XHJcbiAgICByZXR1cm4gc3VwZXIuYWN0aXZhdGUoY29vcmRpbmF0b3IsIG9wdGlvbnMpXHJcbiAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcmVpZnlTb3VyY2VzKCk7XHJcbiAgICAgIH0pXHJcbiAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICB0aGlzLl90cmFuc2Zvcm1MaXN0ZW5lcnMgPSB7fTtcclxuICAgICAgICB0aGlzLl9zb3VyY2VzLmZvckVhY2goc291cmNlID0+IHRoaXMuX2FjdGl2YXRlU291cmNlKHNvdXJjZSkpO1xyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIGRlYWN0aXZhdGUoKTogUHJvbWlzZTxhbnk+IHtcclxuICAgIHJldHVybiBzdXBlci5kZWFjdGl2YXRlKClcclxuICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuX3NvdXJjZXMuZm9yRWFjaChzb3VyY2UgPT4gdGhpcy5fZGVhY3RpdmF0ZVNvdXJjZShzb3VyY2UpKTtcclxuICAgICAgICB0aGlzLl90cmFuc2Zvcm1MaXN0ZW5lcnMgPSBudWxsO1xyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIF9yZWlmeVNvdXJjZXMoKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICByZXR1cm4gdGhpcy5fc291cmNlc1xyXG4gICAgICAucmVkdWNlKChjaGFpbiwgc291cmNlKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGNoYWluLnRoZW4oKCkgPT4gc291cmNlLnRyYW5zZm9ybUxvZy5yZWlmaWVkKTtcclxuICAgICAgfSwgT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCkpO1xyXG4gIH1cclxuXHJcbiAgX3Jldmlldyhzb3VyY2U6IFNvdXJjZSwgdHJhbnNmb3JtSWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgbGV0IHNvdXJjZXMgPSB0aGlzLl9zb3VyY2VzO1xyXG4gICAgbGV0IG1hdGNoID0gdHJ1ZTtcclxuXHJcbiAgICBpZiAoc291cmNlcy5sZW5ndGggPiAxKSB7XHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc291cmNlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxldCBzID0gc291cmNlc1tpXTtcclxuICAgICAgICBpZiAocyAhPT0gc291cmNlKSB7XHJcbiAgICAgICAgICBpZiAoIXMudHJhbnNmb3JtTG9nLmNvbnRhaW5zKHRyYW5zZm9ybUlkKSkge1xyXG4gICAgICAgICAgICBtYXRjaCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAobWF0Y2gpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuX3RydW5jYXRlU291cmNlcyh0cmFuc2Zvcm1JZCwgMCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBfdHJ1bmNhdGVTb3VyY2VzKHRyYW5zZm9ybUlkOiBzdHJpbmcsIHJlbGF0aXZlUG9zaXRpb246IG51bWJlcikge1xyXG4gICAgcmV0dXJuIHRoaXMuX3NvdXJjZXNcclxuICAgICAgLnJlZHVjZSgoY2hhaW4sIHNvdXJjZSkgPT4ge1xyXG4gICAgICAgIHJldHVybiBjaGFpbi50aGVuKCgpID0+IHNvdXJjZS50cmFuc2Zvcm1Mb2cudHJ1bmNhdGUodHJhbnNmb3JtSWQsIHJlbGF0aXZlUG9zaXRpb24pKTtcclxuICAgICAgfSwgT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCkpO1xyXG4gIH1cclxuXHJcbiAgX2FjdGl2YXRlU291cmNlKHNvdXJjZTogU291cmNlKSB7XHJcbiAgICBjb25zdCBsaXN0ZW5lciA9IHRoaXMuX3RyYW5zZm9ybUxpc3RlbmVyc1tzb3VyY2UubmFtZV0gPSAodHJhbnNmb3JtOiBUcmFuc2Zvcm0pOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgICAgcmV0dXJuIHRoaXMuX3Jldmlldyhzb3VyY2UsIHRyYW5zZm9ybS5pZCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHNvdXJjZS5vbigndHJhbnNmb3JtJywgbGlzdGVuZXIpO1xyXG4gIH1cclxuXHJcbiAgX2RlYWN0aXZhdGVTb3VyY2Uoc291cmNlOiBTb3VyY2UpIHtcclxuICAgIGNvbnN0IGxpc3RlbmVyID0gdGhpcy5fdHJhbnNmb3JtTGlzdGVuZXJzW3NvdXJjZS5uYW1lXTtcclxuICAgIHNvdXJjZS5vZmYoJ3RyYW5zZm9ybScsIGxpc3RlbmVyKTtcclxuICAgIGRlbGV0ZSB0aGlzLl90cmFuc2Zvcm1MaXN0ZW5lcnNbc291cmNlLm5hbWVdO1xyXG4gIH1cclxufVxyXG4iXX0=