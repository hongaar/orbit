"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var data_1 = require("@orbit/data");
var utils_1 = require("@orbit/utils");
var Strategy = function () {
    function Strategy(options) {
        if (options === void 0) {
            options = {};
        }
        utils_1.assert('Strategy requires a name', !!options.name);
        this._name = options.name;
        this._sourceNames = options.sources;
        this._logPrefix = options.logPrefix || "[" + this._name + "]";
        this._logLevel = this._customLogLevel = options.logLevel;
    }
    Strategy.prototype.activate = function (coordinator, options) {
        if (options === void 0) {
            options = {};
        }
        this._coordinator = coordinator;
        if (this._customLogLevel === undefined) {
            this._logLevel = options.logLevel;
        }
        if (this._sourceNames) {
            this._sources = this._sourceNames.map(function (name) {
                return coordinator.getSource(name);
            });
        } else {
            this._sources = coordinator.sources;
        }
        return data_1.default.Promise.resolve();
    };
    Strategy.prototype.deactivate = function () {
        this._coordinator = null;
        return data_1.default.Promise.resolve();
    };
    Object.defineProperty(Strategy.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Strategy.prototype, "coordinator", {
        get: function () {
            return this._coordinator;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Strategy.prototype, "sources", {
        get: function () {
            return this._sources;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Strategy.prototype, "logPrefix", {
        get: function () {
            return this._logPrefix;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Strategy.prototype, "logLevel", {
        get: function () {
            return this._logLevel;
        },
        enumerable: true,
        configurable: true
    });
    return Strategy;
}();
exports.Strategy = Strategy;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyYXRlZ3kuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzcmMvc3RyYXRlZ3kudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EscUJBRXFCO0FBQ3JCLHNCQUFzQztBQTJDdEM7QUFVRSxzQkFBWSxBQUE2QjtBQUE3QixnQ0FBQTtBQUFBLHNCQUE2Qjs7QUFDdkMsZ0JBQU0sT0FBQyxBQUEwQiw0QkFBRSxDQUFDLENBQUMsQUFBTyxRQUFDLEFBQUksQUFBQyxBQUFDO0FBRW5ELEFBQUksYUFBQyxBQUFLLFFBQUcsQUFBTyxRQUFDLEFBQUksQUFBQztBQUMxQixBQUFJLGFBQUMsQUFBWSxlQUFHLEFBQU8sUUFBQyxBQUFPLEFBQUM7QUFDcEMsQUFBSSxhQUFDLEFBQVUsYUFBRyxBQUFPLFFBQUMsQUFBUyxhQUFJLE1BQUksQUFBSSxLQUFDLEFBQUssUUFBRyxBQUFDO0FBQ3pELEFBQUksYUFBQyxBQUFTLFlBQUcsQUFBSSxLQUFDLEFBQWUsa0JBQUcsQUFBTyxRQUFDLEFBQVEsQUFBQyxBQUMzRDtBQUFDO0FBRUQsdUJBQVEsV0FBUixVQUFTLEFBQXdCLGFBQUUsQUFBK0I7QUFBL0IsZ0NBQUE7QUFBQSxzQkFBK0I7O0FBQ2hFLEFBQUksYUFBQyxBQUFZLGVBQUcsQUFBVyxBQUFDO0FBRWhDLEFBQUUsQUFBQyxZQUFDLEFBQUksS0FBQyxBQUFlLG9CQUFLLEFBQVMsQUFBQyxXQUFDLEFBQUM7QUFDdkMsQUFBSSxpQkFBQyxBQUFTLFlBQUcsQUFBTyxRQUFDLEFBQVEsQUFBQyxBQUNwQztBQUFDO0FBRUQsQUFBRSxBQUFDLFlBQUMsQUFBSSxLQUFDLEFBQVksQUFBQyxjQUFDLEFBQUM7QUFDdEIsQUFBSSxpQkFBQyxBQUFRLGdCQUFRLEFBQVksYUFBQyxBQUFHLElBQUMsVUFBQSxBQUFJO0FBQUksdUJBQUEsQUFBVyxZQUFDLEFBQVMsVUFBckIsQUFBc0IsQUFBSSxBQUFDO0FBQUEsQUFBQyxBQUFDLEFBQzdFLGFBRGtCLEFBQUk7QUFDckIsQUFBQyxBQUFJLGVBQUMsQUFBQztBQUNOLEFBQUksaUJBQUMsQUFBUSxXQUFHLEFBQVcsWUFBQyxBQUFPLEFBQUMsQUFDdEM7QUFBQztBQUVELEFBQU0sZUFBQyxPQUFLLFFBQUMsQUFBTyxRQUFDLEFBQU8sQUFBRSxBQUFDLEFBQ2pDO0FBQUM7QUFFRCx1QkFBVSxhQUFWO0FBQ0UsQUFBSSxhQUFDLEFBQVksZUFBRyxBQUFJLEFBQUM7QUFFekIsQUFBTSxlQUFDLE9BQUssUUFBQyxBQUFPLFFBQUMsQUFBTyxBQUFFLEFBQUMsQUFDakM7QUFBQztBQUVELDBCQUFJLG9CQUFJO2FBQVI7QUFDRSxBQUFNLG1CQUFDLEFBQUksS0FBQyxBQUFLLEFBQUMsQUFDcEI7QUFBQzs7c0JBQUE7O0FBRUQsMEJBQUksb0JBQVc7YUFBZjtBQUNFLEFBQU0sbUJBQUMsQUFBSSxLQUFDLEFBQVksQUFBQyxBQUMzQjtBQUFDOztzQkFBQTs7QUFFRCwwQkFBSSxvQkFBTzthQUFYO0FBQ0UsQUFBTSxtQkFBQyxBQUFJLEtBQUMsQUFBUSxBQUFDLEFBQ3ZCO0FBQUM7O3NCQUFBOztBQUVELDBCQUFJLG9CQUFTO2FBQWI7QUFDRSxBQUFNLG1CQUFDLEFBQUksS0FBQyxBQUFVLEFBQUMsQUFDekI7QUFBQzs7c0JBQUE7O0FBRUQsMEJBQUksb0JBQVE7YUFBWjtBQUNFLEFBQU0sbUJBQUMsQUFBSSxLQUFDLEFBQVMsQUFBQyxBQUN4QjtBQUFDOztzQkFBQTs7QUFDSCxXQUFBLEFBQUM7QUE1REQsQUE0REM7QUE1RHFCLG1CQUFRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENvb3JkaW5hdG9yLCB7IEFjdGl2YXRpb25PcHRpb25zLCBMb2dMZXZlbCB9IGZyb20gJy4vY29vcmRpbmF0b3InO1xyXG5pbXBvcnQgT3JiaXQsIHtcclxuICBTb3VyY2VcclxufSBmcm9tICdAb3JiaXQvZGF0YSc7XHJcbmltcG9ydCB7IGFzc2VydCB9IGZyb20gJ0BvcmJpdC91dGlscyc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFN0cmF0ZWd5T3B0aW9ucyB7XHJcbiAgLyoqXHJcbiAgICogTmFtZSBvZiBzdHJhdGVneS5cclxuICAgKlxyXG4gICAqIFVzZWQgdG8gdW5pcXVlbHkgaWRlbnRpZnkgdGhpcyBzdHJhdGVneSBpbiBhIGNvb3JkaW5hdG9yJ3MgY29sbGVjdGlvbi5cclxuICAgKlxyXG4gICAqIEB0eXBlIHtzdHJpbmd9XHJcbiAgICogQG1lbWJlck9mIFN0cmF0ZWd5T3B0aW9uc1xyXG4gICAqL1xyXG4gIG5hbWU/OiBzdHJpbmc7XHJcblxyXG4gIC8qKlxyXG4gICAqIFRoZSBuYW1lcyBvZiBzb3VyY2VzIHRvIGluY2x1ZGUgaW4gdGhpcyBzdHJhdGVneS4gTGVhdmUgdW5kZWZpbmVkXHJcbiAgICogdG8gaW5jbHVkZSBhbGwgc291cmNlcyByZWdpc3RlcmVkIHdpdGggYSBjb29yZGluYXRvci5cclxuICAgKlxyXG4gICAqIEB0eXBlIHtzdHJpbmdbXX1cclxuICAgKiBAbWVtYmVyT2YgTG9nVHJ1bmNhdGlvbk9wdGlvbnNcclxuICAgKi9cclxuICBzb3VyY2VzPzogc3RyaW5nW107XHJcblxyXG4gIC8qKlxyXG4gICAqIFRoZSBwcmVmaXggdG8gdXNlIGZvciBsb2dnaW5nIGZyb20gdGhpcyBzdHJhdGVneS5cclxuICAgKlxyXG4gICAqIERlZmF1bHRzIHRvIGBbJHtuYW1lfV1gLlxyXG4gICAqXHJcbiAgICogQHR5cGUge3N0cmluZ31cclxuICAgKiBAbWVtYmVyT2YgU3RyYXRlZ3lPcHRpb25zXHJcbiAgICovXHJcbiAgbG9nUHJlZml4Pzogc3RyaW5nO1xyXG5cclxuICAvKipcclxuICAgKiBBIHNwZWNpZmljIGxvZyBsZXZlbCBmb3IgdGhpcyBzdHJhdGVneS5cclxuICAgKlxyXG4gICAqIE92ZXJyaWRlcyB0aGUgbG9nIGxldmVsIHVzZWQgd2hlbiBhY3RpdmF0aW5nIHRoZSBjb29yZGluYXRvci5cclxuICAgKlxyXG4gICAqIEB0eXBlIHtMb2dMZXZlbH1cclxuICAgKiBAbWVtYmVyT2YgU3RyYXRlZ3lPcHRpb25zXHJcbiAgICovXHJcbiAgbG9nTGV2ZWw/OiBMb2dMZXZlbDtcclxufVxyXG5cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFN0cmF0ZWd5IHtcclxuICBwcm90ZWN0ZWQgX25hbWU6IHN0cmluZztcclxuICBwcm90ZWN0ZWQgX2Nvb3JkaW5hdG9yOiBDb29yZGluYXRvcjtcclxuICBwcm90ZWN0ZWQgX3NvdXJjZU5hbWVzOiBzdHJpbmdbXTtcclxuICBwcm90ZWN0ZWQgX3NvdXJjZXM6IFNvdXJjZVtdO1xyXG4gIHByb3RlY3RlZCBfYWN0aXZhdGVkOiBQcm9taXNlPGFueT47XHJcbiAgcHJvdGVjdGVkIF9jdXN0b21Mb2dMZXZlbDogTG9nTGV2ZWw7XHJcbiAgcHJvdGVjdGVkIF9sb2dMZXZlbDogTG9nTGV2ZWw7XHJcbiAgcHJvdGVjdGVkIF9sb2dQcmVmaXg6IHN0cmluZztcclxuXHJcbiAgY29uc3RydWN0b3Iob3B0aW9uczogU3RyYXRlZ3lPcHRpb25zID0ge30pIHtcclxuICAgIGFzc2VydCgnU3RyYXRlZ3kgcmVxdWlyZXMgYSBuYW1lJywgISFvcHRpb25zLm5hbWUpO1xyXG5cclxuICAgIHRoaXMuX25hbWUgPSBvcHRpb25zLm5hbWU7XHJcbiAgICB0aGlzLl9zb3VyY2VOYW1lcyA9IG9wdGlvbnMuc291cmNlcztcclxuICAgIHRoaXMuX2xvZ1ByZWZpeCA9IG9wdGlvbnMubG9nUHJlZml4IHx8IGBbJHt0aGlzLl9uYW1lfV1gO1xyXG4gICAgdGhpcy5fbG9nTGV2ZWwgPSB0aGlzLl9jdXN0b21Mb2dMZXZlbCA9IG9wdGlvbnMubG9nTGV2ZWw7XHJcbiAgfVxyXG5cclxuICBhY3RpdmF0ZShjb29yZGluYXRvcjogQ29vcmRpbmF0b3IsIG9wdGlvbnM6IEFjdGl2YXRpb25PcHRpb25zID0ge30pOiBQcm9taXNlPGFueT4ge1xyXG4gICAgdGhpcy5fY29vcmRpbmF0b3IgPSBjb29yZGluYXRvcjtcclxuXHJcbiAgICBpZiAodGhpcy5fY3VzdG9tTG9nTGV2ZWwgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICB0aGlzLl9sb2dMZXZlbCA9IG9wdGlvbnMubG9nTGV2ZWw7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuX3NvdXJjZU5hbWVzKSB7XHJcbiAgICAgIHRoaXMuX3NvdXJjZXMgPSB0aGlzLl9zb3VyY2VOYW1lcy5tYXAobmFtZSA9PiBjb29yZGluYXRvci5nZXRTb3VyY2UobmFtZSkpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5fc291cmNlcyA9IGNvb3JkaW5hdG9yLnNvdXJjZXM7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIE9yYml0LlByb21pc2UucmVzb2x2ZSgpO1xyXG4gIH1cclxuXHJcbiAgZGVhY3RpdmF0ZSgpOiBQcm9taXNlPGFueT4ge1xyXG4gICAgdGhpcy5fY29vcmRpbmF0b3IgPSBudWxsO1xyXG5cclxuICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKTtcclxuICB9XHJcblxyXG4gIGdldCBuYW1lKCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5fbmFtZTtcclxuICB9XHJcblxyXG4gIGdldCBjb29yZGluYXRvcigpOiBDb29yZGluYXRvciB7XHJcbiAgICByZXR1cm4gdGhpcy5fY29vcmRpbmF0b3I7XHJcbiAgfVxyXG5cclxuICBnZXQgc291cmNlcygpOiBTb3VyY2VbXSB7XHJcbiAgICByZXR1cm4gdGhpcy5fc291cmNlcztcclxuICB9XHJcblxyXG4gIGdldCBsb2dQcmVmaXgoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLl9sb2dQcmVmaXg7XHJcbiAgfVxyXG5cclxuICBnZXQgbG9nTGV2ZWwoKTogTG9nTGV2ZWwge1xyXG4gICAgcmV0dXJuIHRoaXMuX2xvZ0xldmVsO1xyXG4gIH1cclxufVxyXG4iXX0=