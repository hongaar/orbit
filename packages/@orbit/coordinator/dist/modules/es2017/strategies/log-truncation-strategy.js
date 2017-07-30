"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var strategy_1 = require("../strategy");
var data_1 = require("@orbit/data");
var LogTruncationStrategy = (function (_super) {
    __extends(LogTruncationStrategy, _super);
    function LogTruncationStrategy(options) {
        if (options === void 0) { options = {}; }
        var _this = this;
        options.name = options.name || 'log-truncation';
        _this = _super.call(this, options) || this;
        return _this;
    }
    LogTruncationStrategy.prototype.activate = function (coordinator, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        return _super.prototype.activate.call(this, coordinator, options)
            .then(function () {
            return _this._reifySources();
        })
            .then(function () {
            _this._transformListeners = {};
            _this._sources.forEach(function (source) { return _this._activateSource(source); });
        });
    };
    LogTruncationStrategy.prototype.deactivate = function () {
        var _this = this;
        return _super.prototype.deactivate.call(this)
            .then(function () {
            _this._sources.forEach(function (source) { return _this._deactivateSource(source); });
            _this._transformListeners = null;
        });
    };
    LogTruncationStrategy.prototype._reifySources = function () {
        return this._sources
            .reduce(function (chain, source) {
            return chain.then(function () { return source.transformLog.reified; });
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
        }
        else {
            return data_1.default.Promise.resolve();
        }
    };
    LogTruncationStrategy.prototype._truncateSources = function (transformId, relativePosition) {
        return this._sources
            .reduce(function (chain, source) {
            return chain.then(function () { return source.transformLog.truncate(transformId, relativePosition); });
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
}(strategy_1.Strategy));
exports.LogTruncationStrategy = LogTruncationStrategy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nLXRydW5jYXRpb24tc3RyYXRlZ3kuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvc3RyYXRlZ2llcy9sb2ctdHJ1bmNhdGlvbi1zdHJhdGVneS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFDQSx3Q0FBd0Q7QUFDeEQsb0NBR3FCO0FBR3JCO0lBQTJDLHlDQUFRO0lBS2pELCtCQUFZLE9BQTZCO1FBQTdCLHdCQUFBLEVBQUEsWUFBNkI7UUFBekMsaUJBR0M7UUFGQyxPQUFPLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLElBQUksZ0JBQWdCLENBQUM7UUFDaEQsUUFBQSxrQkFBTSxPQUFPLENBQUMsU0FBQzs7SUFDakIsQ0FBQztJQUVELHdDQUFRLEdBQVIsVUFBUyxXQUF3QixFQUFFLE9BQStCO1FBQWxFLGlCQVNDO1FBVGtDLHdCQUFBLEVBQUEsWUFBK0I7UUFDaEUsTUFBTSxDQUFDLGlCQUFNLFFBQVEsWUFBQyxXQUFXLEVBQUUsT0FBTyxDQUFDO2FBQ3hDLElBQUksQ0FBQztZQUNKLE1BQU0sQ0FBQyxLQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDOUIsQ0FBQyxDQUFDO2FBQ0QsSUFBSSxDQUFDO1lBQ0osS0FBSSxDQUFDLG1CQUFtQixHQUFHLEVBQUUsQ0FBQztZQUM5QixLQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFBLE1BQU0sSUFBSSxPQUFBLEtBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLEVBQTVCLENBQTRCLENBQUMsQ0FBQztRQUNoRSxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCwwQ0FBVSxHQUFWO1FBQUEsaUJBTUM7UUFMQyxNQUFNLENBQUMsaUJBQU0sVUFBVSxXQUFFO2FBQ3RCLElBQUksQ0FBQztZQUNKLEtBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUEsTUFBTSxJQUFJLE9BQUEsS0FBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0s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QUFDLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBQ0gsNEJBQUM7QUFBRCxDQUFDLEFBL0VELENBQTJDLG1CQUFRLEdBK0VsRDtBQS9FWSxzREFBcUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ29vcmRpbmF0b3IsIHsgQWN0aXZhdGlvbk9wdGlvbnMgfSBmcm9tICcuLi9jb29yZGluYXRvcic7XHJcbmltcG9ydCB7IFN0cmF0ZWd5LCBTdHJhdGVneU9wdGlvbnMgfSBmcm9tICcuLi9zdHJhdGVneSc7XHJcbmltcG9ydCBPcmJpdCwge1xyXG4gIFNvdXJjZSxcclxuICBUcmFuc2Zvcm1cclxufSBmcm9tICdAb3JiaXQvZGF0YSc7XHJcbmltcG9ydCB7IERpY3QsIGFzc2VydCwgb2JqZWN0VmFsdWVzIH0gZnJvbSAnQG9yYml0L3V0aWxzJztcclxuXHJcbmV4cG9ydCBjbGFzcyBMb2dUcnVuY2F0aW9uU3RyYXRlZ3kgZXh0ZW5kcyBTdHJhdGVneSB7XHJcbiAgcHJvdGVjdGVkIF9yZXZpZXdpbmc6IFByb21pc2U8dm9pZD47XHJcbiAgcHJvdGVjdGVkIF9leHRyYVJldmlld05lZWRlZDogYm9vbGVhbjtcclxuICBwcm90ZWN0ZWQgX3RyYW5zZm9ybUxpc3RlbmVyczogRGljdDwodHJhbnNmb3JtOiBUcmFuc2Zvcm0pID0+IHZvaWQ+O1xyXG5cclxuICBjb25zdHJ1Y3RvcihvcHRpb25zOiBTdHJhdGVneU9wdGlvbnMgPSB7fSkge1xyXG4gICAgb3B0aW9ucy5uYW1lID0gb3B0aW9ucy5uYW1lIHx8ICdsb2ctdHJ1bmNhdGlvbic7XHJcbiAgICBzdXBlcihvcHRpb25zKTtcclxuICB9XHJcblxyXG4gIGFjdGl2YXRlKGNvb3JkaW5hdG9yOiBDb29yZGluYXRvciwgb3B0aW9uczogQWN0aXZhdGlvbk9wdGlvbnMgPSB7fSk6IFByb21pc2U8YW55PiB7XHJcbiAgICByZXR1cm4gc3VwZXIuYWN0aXZhdGUoY29vcmRpbmF0b3IsIG9wdGlvbnMpXHJcbiAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcmVpZnlTb3VyY2VzKCk7XHJcbiAgICAgIH0pXHJcbiAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICB0aGlzLl90cmFuc2Zvcm1MaXN0ZW5lcnMgPSB7fTtcclxuICAgICAgICB0aGlzLl9zb3VyY2VzLmZvckVhY2goc291cmNlID0+IHRoaXMuX2FjdGl2YXRlU291cmNlKHNvdXJjZSkpO1xyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIGRlYWN0aXZhdGUoKTogUHJvbWlzZTxhbnk+IHtcclxuICAgIHJldHVybiBzdXBlci5kZWFjdGl2YXRlKClcclxuICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuX3NvdXJjZXMuZm9yRWFjaChzb3VyY2UgPT4gdGhpcy5fZGVhY3RpdmF0ZVNvdXJjZShzb3VyY2UpKTtcclxuICAgICAgICB0aGlzLl90cmFuc2Zvcm1MaXN0ZW5lcnMgPSBudWxsO1xyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIF9yZWlmeVNvdXJjZXMoKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICByZXR1cm4gdGhpcy5fc291cmNlc1xyXG4gICAgICAucmVkdWNlKChjaGFpbiwgc291cmNlKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGNoYWluLnRoZW4oKCkgPT4gc291cmNlLnRyYW5zZm9ybUxvZy5yZWlmaWVkKTtcclxuICAgICAgfSwgT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCkpO1xyXG4gIH1cclxuXHJcbiAgX3Jldmlldyhzb3VyY2U6IFNvdXJjZSwgdHJhbnNmb3JtSWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgbGV0IHNvdXJjZXMgPSB0aGlzLl9zb3VyY2VzO1xyXG4gICAgbGV0IG1hdGNoID0gdHJ1ZTtcclxuXHJcbiAgICBpZiAoc291cmNlcy5sZW5ndGggPiAxKSB7XHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc291cmNlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxldCBzID0gc291cmNlc1tpXTtcclxuICAgICAgICBpZiAocyAhPT0gc291cmNlKSB7XHJcbiAgICAgICAgICBpZiAoIXMudHJhbnNmb3JtTG9nLmNvbnRhaW5zKHRyYW5zZm9ybUlkKSkge1xyXG4gICAgICAgICAgICBtYXRjaCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAobWF0Y2gpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuX3RydW5jYXRlU291cmNlcyh0cmFuc2Zvcm1JZCwgMCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBfdHJ1bmNhdGVTb3VyY2VzKHRyYW5zZm9ybUlkOiBzdHJpbmcsIHJlbGF0aXZlUG9zaXRpb246IG51bWJlcikge1xyXG4gICAgcmV0dXJuIHRoaXMuX3NvdXJjZXNcclxuICAgICAgLnJlZHVjZSgoY2hhaW4sIHNvdXJjZSkgPT4ge1xyXG4gICAgICAgIHJldHVybiBjaGFpbi50aGVuKCgpID0+IHNvdXJjZS50cmFuc2Zvcm1Mb2cudHJ1bmNhdGUodHJhbnNmb3JtSWQsIHJlbGF0aXZlUG9zaXRpb24pKTtcclxuICAgICAgfSwgT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCkpO1xyXG4gIH1cclxuXHJcbiAgX2FjdGl2YXRlU291cmNlKHNvdXJjZTogU291cmNlKSB7XHJcbiAgICBjb25zdCBsaXN0ZW5lciA9IHRoaXMuX3RyYW5zZm9ybUxpc3RlbmVyc1tzb3VyY2UubmFtZV0gPSAodHJhbnNmb3JtOiBUcmFuc2Zvcm0pOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgICAgcmV0dXJuIHRoaXMuX3Jldmlldyhzb3VyY2UsIHRyYW5zZm9ybS5pZCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHNvdXJjZS5vbigndHJhbnNmb3JtJywgbGlzdGVuZXIpO1xyXG4gIH1cclxuXHJcbiAgX2RlYWN0aXZhdGVTb3VyY2Uoc291cmNlOiBTb3VyY2UpIHtcclxuICAgIGNvbnN0IGxpc3RlbmVyID0gdGhpcy5fdHJhbnNmb3JtTGlzdGVuZXJzW3NvdXJjZS5uYW1lXTtcclxuICAgIHNvdXJjZS5vZmYoJ3RyYW5zZm9ybScsIGxpc3RlbmVyKTtcclxuICAgIGRlbGV0ZSB0aGlzLl90cmFuc2Zvcm1MaXN0ZW5lcnNbc291cmNlLm5hbWVdO1xyXG4gIH1cclxufVxyXG4iXX0=