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
var utils_1 = require("@orbit/utils");
var ConnectionStrategy = (function (_super) {
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
        if (options === void 0) { options = {}; }
        return _super.prototype.activate.call(this, coordinator, options)
            .then(function () {
            _this._listener = _this._generateListener();
            _this.source.on(_this._event, _this._listener, _this);
        });
    };
    ConnectionStrategy.prototype.deactivate = function () {
        var _this = this;
        return _super.prototype.deactivate.call(this)
            .then(function () {
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
            }
            else {
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
}(strategy_1.Strategy));
exports.ConnectionStrategy = ConnectionStrategy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29ubmVjdGlvbi1zdHJhdGVneS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9zdHJhdGVnaWVzL2Nvbm5lY3Rpb24tc3RyYXRlZ3kudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQ0Esd0NBQXdEO0FBT3hELHNDQUE0RTtBQXdFNUU7SUFBd0Msc0NBQVE7SUFROUMsNEJBQVksT0FBa0M7UUFBOUMsaUJBd0JDO1FBdkJDLGNBQU0sQ0FBQyx1REFBdUQsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2xGLGNBQU0sQ0FBQyx3REFBd0QsRUFBRSxPQUFPLE9BQU8sQ0FBQyxNQUFNLEtBQUssUUFBUSxDQUFDLENBQUM7UUFDckcsY0FBTSxDQUFDLG9GQUFvRixFQUFFLE9BQU8sT0FBTyxDQUFDLEVBQUUsS0FBSyxRQUFRLENBQUMsQ0FBQztRQUM3SCxPQUFPLENBQUMsT0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ25DLElBQUksV0FBVyxHQUFNLE9BQU8sQ0FBQyxNQUFNLFNBQUksT0FBTyxDQUFDLEVBQUksQ0FBQztRQUNwRCxPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUM7UUFDdEIsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDbkIsY0FBTSxDQUFDLHdEQUF3RCxFQUFFLE9BQU8sT0FBTyxDQUFDLE1BQU0sS0FBSyxRQUFRLENBQUMsQ0FBQztZQUNyRyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDckMsV0FBVyxJQUFJLFNBQU8sT0FBTyxDQUFDLE1BQVEsQ0FBQztZQUN2QyxFQUFFLENBQUMsQ0FBQyxPQUFPLE9BQU8sQ0FBQyxNQUFNLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDdkMsV0FBVyxJQUFJLE1BQUksT0FBTyxDQUFDLE1BQVEsQ0FB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Q0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLEtBQUksQ0FBQyxNQUFNLElBQUksTUFBTSxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUMxQyxNQUFNLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFDLENBQUM7b0JBQ3RCLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2hCLE1BQU0sQ0FBQyxLQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ3ZDLENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLEtBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUNuQixNQUFNLENBQUMsTUFBTSxDQUFDO1lBQ2hCLENBQUM7O1FBQ0gsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUNILHlCQUFDO0FBQUQsQ0FBQyxBQTVGRCxDQUF3QyxtQkFBUSxHQTRGL0M7QUE1RlksZ0RBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENvb3JkaW5hdG9yLCB7IEFjdGl2YXRpb25PcHRpb25zLCBMb2dMZXZlbCB9IGZyb20gJy4uL2Nvb3JkaW5hdG9yJztcclxuaW1wb3J0IHsgU3RyYXRlZ3ksIFN0cmF0ZWd5T3B0aW9ucyB9IGZyb20gJy4uL3N0cmF0ZWd5JztcclxuaW1wb3J0IE9yYml0LCB7XHJcbiAgU291cmNlLFxyXG4gIFRyYW5zZm9ybSxcclxuICBpc1N5bmNhYmxlLFxyXG4gIFN5bmNhYmxlXHJcbn0gZnJvbSAnQG9yYml0L2RhdGEnO1xyXG5pbXBvcnQgeyBEaWN0LCBhc3NlcnQsIG9iamVjdFZhbHVlcywgZGVlcEdldCwgZGVlcFNldCB9IGZyb20gJ0BvcmJpdC91dGlscyc7XHJcblxyXG5kZWNsYXJlIGNvbnN0IGNvbnNvbGU6IGFueTtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQ29ubmVjdGlvblN0cmF0ZWd5T3B0aW9ucyBleHRlbmRzIFN0cmF0ZWd5T3B0aW9ucyB7XHJcbiAgLyoqXHJcbiAgICogVGhlIG5hbWUgb2YgdGhlIHNvdXJjZSB0byBiZSBvYnNlcnZlZC5cclxuICAgKlxyXG4gICAqIEB0eXBlIHtzdHJpbmd9XHJcbiAgICogQG1lbWJlck9mIENvbm5lY3Rpb25TdHJhdGVneU9wdGlvbnNcclxuICAgKi9cclxuICBzb3VyY2U6IHN0cmluZztcclxuXHJcbiAgLyoqXHJcbiAgICogVGhlIG5hbWUgb2YgdGhlIGV2ZW50IHRvIG9ic2VydmUuXHJcbiAgICpcclxuICAgKiBAdHlwZSB7c3RyaW5nfVxyXG4gICAqIEBtZW1iZXJPZiBDb25uZWN0aW9uU3RyYXRlZ3lPcHRpb25zXHJcbiAgICovXHJcbiAgb246IHN0cmluZztcclxuXHJcbiAgLyoqXHJcbiAgICogVGhlIG5hbWUgb2YgdGhlIHNvdXJjZSB3aGljaCB3aWxsIGJlIGFjdGVkIHVwb24uXHJcbiAgICpcclxuICAgKiBAdHlwZSB7c3RyaW5nfVxyXG4gICAqIEBtZW1iZXJPZiBDb25uZWN0aW9uU3RyYXRlZ3lPcHRpb25zXHJcbiAgICovXHJcbiAgdGFyZ2V0Pzogc3RyaW5nO1xyXG5cclxuICAvKipcclxuICAgKiBUaGUgYWN0aW9uIHRvIHBlcmZvcm0gb24gdGhlIHRhcmdldC5cclxuICAgKlxyXG4gICAqIENhbiBiZSBzcGVjaWZpZWQgYXMgYSBzdHJpbmcgKGUuZy4gYHB1bGxgKSBvciBhIGZ1bmN0aW9uIHdoaWNoIHdpbGwgYmVcclxuICAgKiBpbnZva2VkIGluIHRoZSBjb250ZXh0IG9mIHRoaXMgc3RyYXRlZ3kgKGFuZCB0aHVzIHdpbGwgaGF2ZSBhY2Nlc3MgdG9cclxuICAgKiBib3RoIGB0aGlzLnNvdXJjZWAgYW5kIGB0aGlzLnRhcmdldGApLlxyXG4gICAqXHJcbiAgICogQHR5cGUgeyhzdHJpbmcgfCBGdW5jdGlvbil9XHJcbiAgICogQG1lbWJlck9mIENvbm5lY3Rpb25TdHJhdGVneU9wdGlvbnNcclxuICAgKi9cclxuICBhY3Rpb246IHN0cmluZyB8IEZ1bmN0aW9uO1xyXG5cclxuICAvKipcclxuICAgKiBBIGhhbmRsZXIgZm9yIGFueSBlcnJvcnMgdGhyb3duIGFzIGEgcmVzdWx0IG9mIHBlcmZvcm1pbmcgdGhlIGFjdGlvbi5cclxuICAgKlxyXG4gICAqIEB0eXBlIHtGdW5jdGlvbn1cclxuICAgKiBAbWVtYmVyT2YgQ29ubmVjdGlvblN0cmF0ZWd5T3B0aW9uc1xyXG4gICAqL1xyXG4gIGNhdGNoPzogRnVuY3Rpb247XHJcblxyXG4gIC8qKlxyXG4gICAqIEEgZmlsdGVyIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGBhY3Rpb25gIHNob3VsZCBiZSBwZXJmb3JtZWQuXHJcbiAgICpcclxuICAgKiBgZmlsdGVyYCB3aWxsIGJlIGludm9rZWQgaW4gdGhlIGNvbnRleHQgb2YgdGhpcyBzdHJhdGVneSAoYW5kIHRodXMgd2lsbFxyXG4gICAqIGhhdmUgYWNjZXNzIHRvIGJvdGggYHRoaXMuc291cmNlYCBhbmQgYHRoaXMudGFyZ2V0YCkuXHJcbiAgICpcclxuICAgKiBAdHlwZSB7RnVuY3Rpb259XHJcbiAgICogQG1lbWJlck9mIENvbm5lY3Rpb25TdHJhdGVneU9wdGlvbnNcclxuICAgKi9cclxuICBmaWx0ZXI/OiBGdW5jdGlvbjtcclxuXHJcbiAgLyoqXHJcbiAgICogU2hvdWxkIHJlc29sdXRpb24gb2YgYGFjdGlvbmAgb24gdGhlIHRoZSB0YXJnZXQgYmxvY2sgdGhlIGNvbXBsZXRpb25cclxuICAgKiBvZiB0aGUgc291cmNlJ3MgZXZlbnQ/XHJcbiAgICpcclxuICAgKiBCeSBkZWZhdWx0LCBgYmxvY2tpbmdgIGlzIGZhbHNlLlxyXG4gICAqXHJcbiAgICogQHR5cGUge2Jvb2xlYW59XHJcbiAgICogQG1lbWJlck9mIENvbm5lY3Rpb25TdHJhdGVneU9wdGlvbnNzXHJcbiAgICovXHJcbiAgYmxvY2tpbmc/OiBib29sZWFuO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ29ubmVjdGlvblN0cmF0ZWd5IGV4dGVuZHMgU3RyYXRlZ3kge1xyXG4gIHByb3RlY3RlZCBfYmxvY2tpbmc6IGJvb2xlYW47XHJcbiAgcHJvdGVjdGVkIF9ldmVudDogc3RyaW5nO1xyXG4gIHByb3RlY3RlZCBfYWN0aW9uOiBzdHJpbmcgfCBGdW5jdGlvbjtcclxuICBwcm90ZWN0ZWQgX2NhdGNoOiBGdW5jdGlvbjtcclxuICBwcm90ZWN0ZWQgX2xpc3RlbmVyOiBGdW5jdGlvbjtcclxuICBwcm90ZWN0ZWQgX2ZpbHRlcjogRnVuY3Rpb247XHJcblxyXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM6IENvbm5lY3Rpb25TdHJhdGVneU9wdGlvbnMpIHtcclxuICAgIGFzc2VydCgnQSBgc291cmNlYCBtdXN0IGJlIHNwZWNpZmllZCBmb3IgYSBDb25uZWN0aW9uU3RyYXRlZ3knLCAhIW9wdGlvbnMuc291cmNlKTtcclxuICAgIGFzc2VydCgnYHNvdXJjZWAgc2hvdWxkIGJlIGEgU291cmNlIG5hbWUgc3BlY2lmaWVkIGFzIGEgc3RyaW5nJywgdHlwZW9mIG9wdGlvbnMuc291cmNlID09PSAnc3RyaW5nJyk7XHJcbiAgICBhc3NlcnQoJ2BvbmAgc2hvdWxkIGJlIHNwZWNpZmllZCBhcyB0aGUgbmFtZSBvZiB0aGUgZXZlbnQgYSBDb25uZWN0aW9uU3RyYXRlZ3kgbGlzdGVucyBmb3InLCB0eXBlb2Ygb3B0aW9ucy5vbiA9PT0gJ3N0cmluZycpO1xyXG4gICAgb3B0aW9ucy5zb3VyY2VzID0gW29wdGlvbnMuc291cmNlXTtcclxuICAgIGxldCBkZWZhdWx0TmFtZSA9IGAke29wdGlvbnMuc291cmNlfToke29wdGlvbnMub259YDtcclxuICAgIGRlbGV0ZSBvcHRpb25zLnNvdXJjZTtcclxuICAgIGlmIChvcHRpb25zLnRhcmdldCkge1xyXG4gICAgICBhc3NlcnQoJ2B0YXJnZXRgIHNob3VsZCBiZSBhIFNvdXJjZSBuYW1lIHNwZWNpZmllZCBhcyBhIHN0cmluZycsIHR5cGVvZiBvcHRpb25zLnRhcmdldCA9PT0gJ3N0cmluZycpO1xyXG4gICAgICBvcHRpb25zLnNvdXJjZXMucHVzaChvcHRpb25zLnRhcmdldCk7XHJcbiAgICAgIGRlZmF1bHROYW1lICs9IGAgLT4gJHtvcHRpb25zLnRhcmdldH1gO1xyXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbnMuYWN0aW9uID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgIGRlZmF1bHROYW1lICs9IGA6JHtvcHRpb25zLmFjdGlvbn1gO1xyXG4gICAgICB9XHJcbiAgICAgIGRlbGV0ZSBvcHRpb25zLnRhcmdldDtcclxuICAgIH1cclxuICAgIG9wdGlvbnMubmFtZSA9IG9wdGlvbnMubmFtZSB8fCBkZWZhdWx0TmFtZTtcclxuICAgIHN1cGVyKG9wdGlvbnMpO1xyXG5cclxuICAgIHRoaXMuX2V2ZW50ID0gb3B0aW9ucy5vbjtcclxuICAgIHRoaXMuX2FjdGlvbiA9IG9wdGlvbnMuYWN0aW9uO1xyXG4gICAgdGhpcy5fY2F0Y2ggPSBvcHRpb25zLmNhdGNoO1xyXG4gICAgdGhpcy5fZmlsdGVyID0gb3B0aW9ucy5maWx0ZXI7XHJcbiAgICB0aGlzLl9ibG9ja2luZyA9ICEhb3B0aW9ucy5ibG9ja2luZztcclxuICB9XHJcblxyXG4gIGdldCBzb3VyY2UoKTogU291cmNlIHtcclxuICAgIHJldHVybiB0aGlzLl9zb3VyY2VzWzBdO1xyXG4gIH1cclxuXHJcbiAgZ2V0IHRhcmdldCgpOiBTb3VyY2Uge1xyXG4gICAgcmV0dXJuIHRoaXMuX3NvdXJjZXNbMV07XHJcbiAgfVxyXG5cclxuICBnZXQgYmxvY2tpbmcoKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5fYmxvY2tpbmc7XHJcbiAgfVxyXG5cclxuICBhY3RpdmF0ZShjb29yZGluYXRvcjogQ29vcmRpbmF0b3IsIG9wdGlvbnM6IEFjdGl2YXRpb25PcHRpb25zID0ge30pOiBQcm9taXNlPGFueT4ge1xyXG4gICAgcmV0dXJuIHN1cGVyLmFjdGl2YXRlKGNvb3JkaW5hdG9yLCBvcHRpb25zKVxyXG4gICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5fbGlzdGVuZXIgPSB0aGlzLl9nZW5lcmF0ZUxpc3RlbmVyKCk7XHJcbiAgICAgICAgdGhpcy5zb3VyY2Uub24odGhpcy5fZXZlbnQsIHRoaXMuX2xpc3RlbmVyLCB0aGlzKTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBkZWFjdGl2YXRlKCk6IFByb21pc2U8YW55PiB7XHJcbiAgICByZXR1cm4gc3VwZXIuZGVhY3RpdmF0ZSgpXHJcbiAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICB0aGlzLnNvdXJjZS5vZmYodGhpcy5fZXZlbnQsIHRoaXMuX2xpc3RlbmVyLCB0aGlzKTtcclxuICAgICAgICB0aGlzLl9saXN0ZW5lciA9IG51bGw7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJvdGVjdGVkIF9nZW5lcmF0ZUxpc3RlbmVyKCkge1xyXG4gICAgbGV0IHRhcmdldDogYW55ID0gdGhpcy50YXJnZXQ7XHJcblxyXG4gICAgcmV0dXJuICguLi5hcmdzKSA9PiB7XHJcbiAgICAgIGxldCByZXN1bHQ7XHJcblxyXG4gICAgICBpZiAodGhpcy5fZmlsdGVyKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9maWx0ZXIuYXBwbHkodGhpcywgYXJncykpIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0eXBlb2YgdGhpcy5fYWN0aW9uID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgIHJlc3VsdCA9IHRoaXMudGFyZ2V0W3RoaXMuX2FjdGlvbl0oLi4uYXJncyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmVzdWx0ID0gdGhpcy5fYWN0aW9uLmFwcGx5KHRoaXMsIGFyZ3MpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodGhpcy5fY2F0Y2ggJiYgcmVzdWx0ICYmIHJlc3VsdC5jYXRjaCkge1xyXG4gICAgICAgIHJlc3VsdCA9IHJlc3VsdC5jYXRjaCgoZSkgPT4ge1xyXG4gICAgICAgICAgYXJncy51bnNoaWZ0KGUpO1xyXG4gICAgICAgICAgcmV0dXJuIHRoaXMuX2NhdGNoLmFwcGx5KHRoaXMsIGFyZ3MpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodGhpcy5fYmxvY2tpbmcpIHtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG4iXX0=