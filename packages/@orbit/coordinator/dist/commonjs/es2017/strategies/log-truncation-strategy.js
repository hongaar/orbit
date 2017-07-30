"use strict";

var __extends = undefined && undefined.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nLXRydW5jYXRpb24tc3RyYXRlZ3kuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvc3RyYXRlZ2llcy9sb2ctdHJ1bmNhdGlvbi1zdHJhdGVneS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLHlCQUF3RDtBQUN4RCxxQkFHcUI7QUFHckI7QUFBMkMscUNBQVE7QUFLakQsbUNBQVksQUFBNkI7QUFBN0IsZ0NBQUE7QUFBQSxzQkFBNkI7O0FBQXpDLG9CQUdDO0FBRkMsQUFBTyxnQkFBQyxBQUFJLE9BQUcsQUFBTyxRQUFDLEFBQUksUUFBSSxBQUFnQixBQUFDO0FBQ2hELGdCQUFBLGtCQUFNLEFBQU8sQUFBQyxZQUFDO2VBQ2pCO0FBQUM7QUFFRCxvQ0FBUSxXQUFSLFVBQVMsQUFBd0IsYUFBRSxBQUErQjtBQUFsRSxvQkFTQztBQVRrQyxnQ0FBQTtBQUFBLHNCQUErQjs7QUFDaEUsQUFBTSxnQ0FBTyxBQUFRLG9CQUFDLEFBQVcsYUFBRSxBQUFPLEFBQUMsU0FDeEMsQUFBSSxLQUFDO0FBQ0osQUFBTSxtQkFBQyxBQUFJLE1BQUMsQUFBYSxBQUFFLEFBQUMsQUFDOUI7QUFBQyxBQUFDLFNBSEcsRUFJSixBQUFJLEtBQUM7QUFDSixBQUFJLGtCQUFDLEFBQW1CLHNCQUFHLEFBQUUsQUFBQztBQUM5QixBQUFJLGtCQUFDLEFBQVEsU0FBQyxBQUFPLFFBQUMsVUFBQSxBQUFNO0FBQUksdUJBQUEsQUFBSSxNQUFDLEFBQWUsZ0JBQXBCLEFBQXFCLEFBQU0sQUFBQztBQUFBLEFBQUMsQUFBQyxBQUNoRTtBQUFDLEFBQUMsQUFBQyxBQUNQO0FBQUM7QUFFRCxvQ0FBVSxhQUFWO0FBQUEsb0JBTUM7QUFMQyxBQUFNLGdDQUFPLEFBQVUsZ0JBQUUsTUFDdEIsQUFBSSxLQUFDO0FBQ0osQUFBSSxrQkFBQyxBQUFRLFNBQUMsQUFBTyxRQUFDLFVBQUEsQUFBTTtBQUFJLHVCQUFBLEFBQUksTUFBQyxBQUFp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LEFBQUMsQUFBQztBQUNsQyxlQUFPLEFBQUksS0FBQyxBQUFtQixvQkFBQyxBQUFNLE9BQUMsQUFBSSxBQUFDLEFBQUMsQUFDL0M7QUFBQztBQUNILFdBQUEsQUFBQztBQS9FRCxBQStFQyxFQS9FMEMsV0FBUSxBQStFbEQ7QUEvRVksZ0NBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENvb3JkaW5hdG9yLCB7IEFjdGl2YXRpb25PcHRpb25zIH0gZnJvbSAnLi4vY29vcmRpbmF0b3InO1xyXG5pbXBvcnQgeyBTdHJhdGVneSwgU3RyYXRlZ3lPcHRpb25zIH0gZnJvbSAnLi4vc3RyYXRlZ3knO1xyXG5pbXBvcnQgT3JiaXQsIHtcclxuICBTb3VyY2UsXHJcbiAgVHJhbnNmb3JtXHJcbn0gZnJvbSAnQG9yYml0L2RhdGEnO1xyXG5pbXBvcnQgeyBEaWN0LCBhc3NlcnQsIG9iamVjdFZhbHVlcyB9IGZyb20gJ0BvcmJpdC91dGlscyc7XHJcblxyXG5leHBvcnQgY2xhc3MgTG9nVHJ1bmNhdGlvblN0cmF0ZWd5IGV4dGVuZHMgU3RyYXRlZ3kge1xyXG4gIHByb3RlY3RlZCBfcmV2aWV3aW5nOiBQcm9taXNlPHZvaWQ+O1xyXG4gIHByb3RlY3RlZCBfZXh0cmFSZXZpZXdOZWVkZWQ6IGJvb2xlYW47XHJcbiAgcHJvdGVjdGVkIF90cmFuc2Zvcm1MaXN0ZW5lcnM6IERpY3Q8KHRyYW5zZm9ybTogVHJhbnNmb3JtKSA9PiB2b2lkPjtcclxuXHJcbiAgY29uc3RydWN0b3Iob3B0aW9uczogU3RyYXRlZ3lPcHRpb25zID0ge30pIHtcclxuICAgIG9wdGlvbnMubmFtZSA9IG9wdGlvbnMubmFtZSB8fCAnbG9nLXRydW5jYXRpb24nO1xyXG4gICAgc3VwZXIob3B0aW9ucyk7XHJcbiAgfVxyXG5cclxuICBhY3RpdmF0ZShjb29yZGluYXRvcjogQ29vcmRpbmF0b3IsIG9wdGlvbnM6IEFjdGl2YXRpb25PcHRpb25zID0ge30pOiBQcm9taXNlPGFueT4ge1xyXG4gICAgcmV0dXJuIHN1cGVyLmFjdGl2YXRlKGNvb3JkaW5hdG9yLCBvcHRpb25zKVxyXG4gICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlaWZ5U291cmNlcygpO1xyXG4gICAgICB9KVxyXG4gICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5fdHJhbnNmb3JtTGlzdGVuZXJzID0ge307XHJcbiAgICAgICAgdGhpcy5fc291cmNlcy5mb3JFYWNoKHNvdXJjZSA9PiB0aGlzLl9hY3RpdmF0ZVNvdXJjZShzb3VyY2UpKTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBkZWFjdGl2YXRlKCk6IFByb21pc2U8YW55PiB7XHJcbiAgICByZXR1cm4gc3VwZXIuZGVhY3RpdmF0ZSgpXHJcbiAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICB0aGlzLl9zb3VyY2VzLmZvckVhY2goc291cmNlID0+IHRoaXMuX2RlYWN0aXZhdGVTb3VyY2Uoc291cmNlKSk7XHJcbiAgICAgICAgdGhpcy5fdHJhbnNmb3JtTGlzdGVuZXJzID0gbnVsbDtcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBfcmVpZnlTb3VyY2VzKCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgcmV0dXJuIHRoaXMuX3NvdXJjZXNcclxuICAgICAgLnJlZHVjZSgoY2hhaW4sIHNvdXJjZSkgPT4ge1xyXG4gICAgICAgIHJldHVybiBjaGFpbi50aGVuKCgpID0+IHNvdXJjZS50cmFuc2Zvcm1Mb2cucmVpZmllZCk7XHJcbiAgICAgIH0sIE9yYml0LlByb21pc2UucmVzb2x2ZSgpKTtcclxuICB9XHJcblxyXG4gIF9yZXZpZXcoc291cmNlOiBTb3VyY2UsIHRyYW5zZm9ybUlkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIGxldCBzb3VyY2VzID0gdGhpcy5fc291cmNlcztcclxuICAgIGxldCBtYXRjaCA9IHRydWU7XHJcblxyXG4gICAgaWYgKHNvdXJjZXMubGVuZ3RoID4gMSkge1xyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNvdXJjZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgcyA9IHNvdXJjZXNbaV07XHJcbiAgICAgICAgaWYgKHMgIT09IHNvdXJjZSkge1xyXG4gICAgICAgICAgaWYgKCFzLnRyYW5zZm9ybUxvZy5jb250YWlucyh0cmFuc2Zvcm1JZCkpIHtcclxuICAgICAgICAgICAgbWF0Y2ggPSBmYWxzZTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG1hdGNoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLl90cnVuY2F0ZVNvdXJjZXModHJhbnNmb3JtSWQsIDApO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIE9yYml0LlByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgX3RydW5jYXRlU291cmNlcyh0cmFuc2Zvcm1JZDogc3RyaW5nLCByZWxhdGl2ZVBvc2l0aW9uOiBudW1iZXIpIHtcclxuICAgIHJldHVybiB0aGlzLl9zb3VyY2VzXHJcbiAgICAgIC5yZWR1Y2UoKGNoYWluLCBzb3VyY2UpID0+IHtcclxuICAgICAgICByZXR1cm4gY2hhaW4udGhlbigoKSA9PiBzb3VyY2UudHJhbnNmb3JtTG9nLnRydW5jYXRlKHRyYW5zZm9ybUlkLCByZWxhdGl2ZVBvc2l0aW9uKSk7XHJcbiAgICAgIH0sIE9yYml0LlByb21pc2UucmVzb2x2ZSgpKTtcclxuICB9XHJcblxyXG4gIF9hY3RpdmF0ZVNvdXJjZShzb3VyY2U6IFNvdXJjZSkge1xyXG4gICAgY29uc3QgbGlzdGVuZXIgPSB0aGlzLl90cmFuc2Zvcm1MaXN0ZW5lcnNbc291cmNlLm5hbWVdID0gKHRyYW5zZm9ybTogVHJhbnNmb3JtKTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICAgIHJldHVybiB0aGlzLl9yZXZpZXcoc291cmNlLCB0cmFuc2Zvcm0uaWQpO1xyXG4gICAgfTtcclxuXHJcbiAgICBzb3VyY2Uub24oJ3RyYW5zZm9ybScsIGxpc3RlbmVyKTtcclxuICB9XHJcblxyXG4gIF9kZWFjdGl2YXRlU291cmNlKHNvdXJjZTogU291cmNlKSB7XHJcbiAgICBjb25zdCBsaXN0ZW5lciA9IHRoaXMuX3RyYW5zZm9ybUxpc3RlbmVyc1tzb3VyY2UubmFtZV07XHJcbiAgICBzb3VyY2Uub2ZmKCd0cmFuc2Zvcm0nLCBsaXN0ZW5lcik7XHJcbiAgICBkZWxldGUgdGhpcy5fdHJhbnNmb3JtTGlzdGVuZXJzW3NvdXJjZS5uYW1lXTtcclxuICB9XHJcbn1cclxuIl19