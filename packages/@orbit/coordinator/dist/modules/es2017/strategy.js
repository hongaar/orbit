"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var data_1 = require("@orbit/data");
var utils_1 = require("@orbit/utils");
var Strategy = (function () {
    function Strategy(options) {
        if (options === void 0) { options = {}; }
        utils_1.assert('Strategy requires a name', !!options.name);
        this._name = options.name;
        this._sourceNames = options.sources;
        this._logPrefix = options.logPrefix || "[" + this._name + "]";
        this._logLevel = this._customLogLevel = options.logLevel;
    }
    Strategy.prototype.activate = function (coordinator, options) {
        if (options === void 0) { options = {}; }
        this._coordinator = coordinator;
        if (this._customLogLevel === undefined) {
            this._logLevel = options.logLevel;
        }
        if (this._sourceNames) {
            this._sources = this._sourceNames.map(function (name) { return coordinator.getSource(name); });
        }
        else {
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
}());
exports.Strategy = Strategy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyYXRlZ3kuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzcmMvc3RyYXRlZ3kudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxvQ0FFcUI7QUFDckIsc0NBQXNDO0FBMkN0QztJQVVFLGtCQUFZLE9BQTZCO1FBQTdCLHdCQUFBLEVBQUEsWUFBNkI7UUFDdkMsY0FBTSxDQUFDLDBCQUEwQixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFbkQsSUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO1FBQzFCLElBQUksQ0FBQyxZQUFZLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQztRQUNwQyxJQUFJLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxTQUFTLElBQUksTUFBSSxJQUFJLENBQUMsS0FBSyxNQUFHLENBQUM7UUFDekQsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsZUFBZSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUM7SUFDM0QsQ0FBQztJQUVELDJCQUFRLEdBQVIsVUFBUyxXQUF3QixFQUFFLE9BQStCO1FBQS9CLHdCQUFBLEVBQUEsWUFBK0I7UUFDaEUsSUFBSSxDQUFDLFlBQVksR0FBRyxXQUFXLENBQUM7UUFFaEMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQztRQUNwQyxDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7WUFDdEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxVQUFBLElBQUksSUFBSSxPQUFBLFdBQVcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQTNCLENBQTJCLENBQUMsQ0FBQztRQUM3RSxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixJQUFJLENBQUMsUUFBUSxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUM7UUFDdEMsQ0FBQztRQUVELE1BQU0sQ0FBQyxjQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ2pDLENBQUM7SUFFRCw2QkFBVSxHQUFWO1FBQ0UsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7UUFFekIsTUFBTSxDQUFDLGNBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDakMsQ0FBQztJQUVELHNCQUFJLDBCQUFJO2FBQVI7WUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUNwQixDQUFDOzs7T0FBQTtJQUVELHNCQUFJLGlDQUFXO2FBQWY7WUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQztRQUMzQixDQUFDOzs7T0FBQTtJQUVELHNCQUFJLDZCQUFPO2FBQVg7WUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUN2QixDQUFDOzs7T0FBQTtJQUVELHNCQUFJLCtCQUFTO2FBQWI7WUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUN6QixDQUFDOzs7T0FBQTtJQUVELHNCQUFJLDhCQUFRO2FBQVo7WUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUN4QixDQUFDOzs7T0FBQTtJQUNILGVBQUM7QUFBRCxDQUFDLEFBNURELElBNERDO0FBNURxQiw0QkFBUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDb29yZGluYXRvciwgeyBBY3RpdmF0aW9uT3B0aW9ucywgTG9nTGV2ZWwgfSBmcm9tICcuL2Nvb3JkaW5hdG9yJztcclxuaW1wb3J0IE9yYml0LCB7XHJcbiAgU291cmNlXHJcbn0gZnJvbSAnQG9yYml0L2RhdGEnO1xyXG5pbXBvcnQgeyBhc3NlcnQgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBTdHJhdGVneU9wdGlvbnMge1xyXG4gIC8qKlxyXG4gICAqIE5hbWUgb2Ygc3RyYXRlZ3kuXHJcbiAgICpcclxuICAgKiBVc2VkIHRvIHVuaXF1ZWx5IGlkZW50aWZ5IHRoaXMgc3RyYXRlZ3kgaW4gYSBjb29yZGluYXRvcidzIGNvbGxlY3Rpb24uXHJcbiAgICpcclxuICAgKiBAdHlwZSB7c3RyaW5nfVxyXG4gICAqIEBtZW1iZXJPZiBTdHJhdGVneU9wdGlvbnNcclxuICAgKi9cclxuICBuYW1lPzogc3RyaW5nO1xyXG5cclxuICAvKipcclxuICAgKiBUaGUgbmFtZXMgb2Ygc291cmNlcyB0byBpbmNsdWRlIGluIHRoaXMgc3RyYXRlZ3kuIExlYXZlIHVuZGVmaW5lZFxyXG4gICAqIHRvIGluY2x1ZGUgYWxsIHNvdXJjZXMgcmVnaXN0ZXJlZCB3aXRoIGEgY29vcmRpbmF0b3IuXHJcbiAgICpcclxuICAgKiBAdHlwZSB7c3RyaW5nW119XHJcbiAgICogQG1lbWJlck9mIExvZ1RydW5jYXRpb25PcHRpb25zXHJcbiAgICovXHJcbiAgc291cmNlcz86IHN0cmluZ1tdO1xyXG5cclxuICAvKipcclxuICAgKiBUaGUgcHJlZml4IHRvIHVzZSBmb3IgbG9nZ2luZyBmcm9tIHRoaXMgc3RyYXRlZ3kuXHJcbiAgICpcclxuICAgKiBEZWZhdWx0cyB0byBgWyR7bmFtZX1dYC5cclxuICAgKlxyXG4gICAqIEB0eXBlIHtzdHJpbmd9XHJcbiAgICogQG1lbWJlck9mIFN0cmF0ZWd5T3B0aW9uc1xyXG4gICAqL1xyXG4gIGxvZ1ByZWZpeD86IHN0cmluZztcclxuXHJcbiAgLyoqXHJcbiAgICogQSBzcGVjaWZpYyBsb2cgbGV2ZWwgZm9yIHRoaXMgc3RyYXRlZ3kuXHJcbiAgICpcclxuICAgKiBPdmVycmlkZXMgdGhlIGxvZyBsZXZlbCB1c2VkIHdoZW4gYWN0aXZhdGluZyB0aGUgY29vcmRpbmF0b3IuXHJcbiAgICpcclxuICAgKiBAdHlwZSB7TG9nTGV2ZWx9XHJcbiAgICogQG1lbWJlck9mIFN0cmF0ZWd5T3B0aW9uc1xyXG4gICAqL1xyXG4gIGxvZ0xldmVsPzogTG9nTGV2ZWw7XHJcbn1cclxuXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBTdHJhdGVneSB7XHJcbiAgcHJvdGVjdGVkIF9uYW1lOiBzdHJpbmc7XHJcbiAgcHJvdGVjdGVkIF9jb29yZGluYXRvcjogQ29vcmRpbmF0b3I7XHJcbiAgcHJvdGVjdGVkIF9zb3VyY2VOYW1lczogc3RyaW5nW107XHJcbiAgcHJvdGVjdGVkIF9zb3VyY2VzOiBTb3VyY2VbXTtcclxuICBwcm90ZWN0ZWQgX2FjdGl2YXRlZDogUHJvbWlzZTxhbnk+O1xyXG4gIHByb3RlY3RlZCBfY3VzdG9tTG9nTGV2ZWw6IExvZ0xldmVsO1xyXG4gIHByb3RlY3RlZCBfbG9nTGV2ZWw6IExvZ0xldmVsO1xyXG4gIHByb3RlY3RlZCBfbG9nUHJlZml4OiBzdHJpbmc7XHJcblxyXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM6IFN0cmF0ZWd5T3B0aW9ucyA9IHt9KSB7XHJcbiAgICBhc3NlcnQoJ1N0cmF0ZWd5IHJlcXVpcmVzIGEgbmFtZScsICEhb3B0aW9ucy5uYW1lKTtcclxuXHJcbiAgICB0aGlzLl9uYW1lID0gb3B0aW9ucy5uYW1lO1xyXG4gICAgdGhpcy5fc291cmNlTmFtZXMgPSBvcHRpb25zLnNvdXJjZXM7XHJcbiAgICB0aGlzLl9sb2dQcmVmaXggPSBvcHRpb25zLmxvZ1ByZWZpeCB8fCBgWyR7dGhpcy5fbmFtZX1dYDtcclxuICAgIHRoaXMuX2xvZ0xldmVsID0gdGhpcy5fY3VzdG9tTG9nTGV2ZWwgPSBvcHRpb25zLmxvZ0xldmVsO1xyXG4gIH1cclxuXHJcbiAgYWN0aXZhdGUoY29vcmRpbmF0b3I6IENvb3JkaW5hdG9yLCBvcHRpb25zOiBBY3RpdmF0aW9uT3B0aW9ucyA9IHt9KTogUHJvbWlzZTxhbnk+IHtcclxuICAgIHRoaXMuX2Nvb3JkaW5hdG9yID0gY29vcmRpbmF0b3I7XHJcblxyXG4gICAgaWYgKHRoaXMuX2N1c3RvbUxvZ0xldmVsID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgdGhpcy5fbG9nTGV2ZWwgPSBvcHRpb25zLmxvZ0xldmVsO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLl9zb3VyY2VOYW1lcykge1xyXG4gICAgICB0aGlzLl9zb3VyY2VzID0gdGhpcy5fc291cmNlTmFtZXMubWFwKG5hbWUgPT4gY29vcmRpbmF0b3IuZ2V0U291cmNlKG5hbWUpKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuX3NvdXJjZXMgPSBjb29yZGluYXRvci5zb3VyY2VzO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKTtcclxuICB9XHJcblxyXG4gIGRlYWN0aXZhdGUoKTogUHJvbWlzZTxhbnk+IHtcclxuICAgIHRoaXMuX2Nvb3JkaW5hdG9yID0gbnVsbDtcclxuXHJcbiAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgfVxyXG5cclxuICBnZXQgbmFtZSgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMuX25hbWU7XHJcbiAgfVxyXG5cclxuICBnZXQgY29vcmRpbmF0b3IoKTogQ29vcmRpbmF0b3Ige1xyXG4gICAgcmV0dXJuIHRoaXMuX2Nvb3JkaW5hdG9yO1xyXG4gIH1cclxuXHJcbiAgZ2V0IHNvdXJjZXMoKTogU291cmNlW10ge1xyXG4gICAgcmV0dXJuIHRoaXMuX3NvdXJjZXM7XHJcbiAgfVxyXG5cclxuICBnZXQgbG9nUHJlZml4KCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5fbG9nUHJlZml4O1xyXG4gIH1cclxuXHJcbiAgZ2V0IGxvZ0xldmVsKCk6IExvZ0xldmVsIHtcclxuICAgIHJldHVybiB0aGlzLl9sb2dMZXZlbDtcclxuICB9XHJcbn1cclxuIl19