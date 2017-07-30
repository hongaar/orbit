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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyYXRlZ3kuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzcmMvc3RyYXRlZ3kudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EscUJBRXFCO0FBQ3JCLHNCQUFzQztBQTJDdEMsMkJBVUU7c0JBQVksQUFBNkIsU0FBN0I7Z0NBQUE7c0JBQTZCO0FBQ3ZDO2dCQUFNLE9BQUMsQUFBMEIsNEJBQUUsQ0FBQyxDQUFDLEFBQU8sUUFBQyxBQUFJLEFBQUMsQUFBQyxBQUVuRCxBQUFJO2FBQUMsQUFBSyxRQUFHLEFBQU8sUUFBQyxBQUFJLEFBQUMsQUFDMUIsQUFBSTthQUFDLEFBQVksZUFBRyxBQUFPLFFBQUMsQUFBTyxBQUFDLEFBQ3BDLEFBQUk7YUFBQyxBQUFVLGFBQUcsQUFBTyxRQUFDLEFBQVMsYUFBSSxNQUFJLEFBQUksS0FBQyxBQUFLLFFBQUcsQUFBQyxBQUN6RCxBQUFJO2FBQUMsQUFBUyxZQUFHLEFBQUksS0FBQyxBQUFlLGtCQUFHLEFBQU8sUUFBQyxBQUFRLEFBQUMsQUFDM0QsQUFBQztBQUVEO3VCQUFRLFdBQVIsVUFBUyxBQUF3QixhQUFFLEFBQStCLFNBQS9CO2dDQUFBO3NCQUErQjtBQUNoRSxBQUFJO2FBQUMsQUFBWSxlQUFHLEFBQVcsQUFBQyxBQUVoQyxBQUFFLEFBQUM7WUFBQyxBQUFJLEtBQUMsQUFBZSxvQkFBSyxBQUFTLEFBQUMsV0FBQyxBQUFDLEFBQ3ZDLEFBQUk7aUJBQUMsQUFBUyxZQUFHLEFBQU8sUUFBQyxBQUFRLEFBQUMsQUFDcEMsQUFBQztBQUVELEFBQUUsQUFBQztZQUFDLEFBQUksS0FBQyxBQUFZLEFBQUMsY0FBQyxBQUFDLEFBQ3RCLEFBQUk7aUJBQUMsQUFBUSxnQkFBUSxBQUFZLGFBQUMsQUFBRyxJQUFDLFVBQUEsQUFBSSxNQUFJO3VCQUFBLEFBQVcsWUFBQyxBQUFTLFVBQXJCLEFBQXNCLEFBQUksQUFBQyxBQUFDLEFBQUMsQUFDN0U7QUFEa0IsQUFBSSxBQUNyQixBQUFDLEFBQUk7ZUFBQyxBQUFDLEFBQ04sQUFBSTtpQkFBQyxBQUFRLFdBQUcsQUFBVyxZQUFDLEFBQU8sQUFBQyxBQUN0QyxBQUFDO0FBRUQsQUFBTTtlQUFDLE9BQUssUUFBQyxBQUFPLFFBQUMsQUFBTyxBQUFFLEFBQUMsQUFDakMsQUFBQztBQUVEO3VCQUFVLGFBQVYsWUFDRSxBQUFJO2FBQUMsQUFBWSxlQUFHLEFBQUksQUFBQyxBQUV6QixBQUFNO2VBQUMsT0FBSyxRQUFDLEFBQU8sUUFBQyxBQUFPLEFBQUUsQUFBQyxBQUNqQyxBQUFDO0FBRUQ7MEJBQUksb0JBQUk7YUFBUixZQUNFLEFBQU07bUJBQUMsQUFBSSxLQUFDLEFBQUssQUFBQyxBQUNwQixBQUFDOzs7c0JBQUEsQUFFRDs7MEJBQUksb0JBQVc7YUFBZixZQUNFLEFBQU07bUJBQUMsQUFBSSxLQUFDLEFBQVksQUFBQyxBQUMzQixBQUFDOzs7c0JBQUEsQUFFRDs7MEJBQUksb0JBQU87YUFBWCxZQUNFLEFBQU07bUJBQUMsQUFBSSxLQUFDLEFBQVEsQUFBQyxBQUN2QixBQUFDOzs7c0JBQUEsQUFFRDs7MEJBQUksb0JBQVM7YUFBYixZQUNFLEFBQU07bUJBQUMsQUFBSSxLQUFDLEFBQVUsQUFBQyxBQUN6QixBQUFDOzs7c0JBQUEsQUFFRDs7MEJBQUksb0JBQVE7YUFBWixZQUNFLEFBQU07bUJBQUMsQUFBSSxLQUFDLEFBQVMsQUFBQyxBQUN4QixBQUFDOzs7c0JBQUEsQUFDSDs7V0FBQSxBQUFDLEFBNURELEFBNERDOztBQTVEcUIsbUJBQVEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ29vcmRpbmF0b3IsIHsgQWN0aXZhdGlvbk9wdGlvbnMsIExvZ0xldmVsIH0gZnJvbSAnLi9jb29yZGluYXRvcic7XHJcbmltcG9ydCBPcmJpdCwge1xyXG4gIFNvdXJjZVxyXG59IGZyb20gJ0BvcmJpdC9kYXRhJztcclxuaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSAnQG9yYml0L3V0aWxzJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgU3RyYXRlZ3lPcHRpb25zIHtcclxuICAvKipcclxuICAgKiBOYW1lIG9mIHN0cmF0ZWd5LlxyXG4gICAqXHJcbiAgICogVXNlZCB0byB1bmlxdWVseSBpZGVudGlmeSB0aGlzIHN0cmF0ZWd5IGluIGEgY29vcmRpbmF0b3IncyBjb2xsZWN0aW9uLlxyXG4gICAqXHJcbiAgICogQHR5cGUge3N0cmluZ31cclxuICAgKiBAbWVtYmVyT2YgU3RyYXRlZ3lPcHRpb25zXHJcbiAgICovXHJcbiAgbmFtZT86IHN0cmluZztcclxuXHJcbiAgLyoqXHJcbiAgICogVGhlIG5hbWVzIG9mIHNvdXJjZXMgdG8gaW5jbHVkZSBpbiB0aGlzIHN0cmF0ZWd5LiBMZWF2ZSB1bmRlZmluZWRcclxuICAgKiB0byBpbmNsdWRlIGFsbCBzb3VyY2VzIHJlZ2lzdGVyZWQgd2l0aCBhIGNvb3JkaW5hdG9yLlxyXG4gICAqXHJcbiAgICogQHR5cGUge3N0cmluZ1tdfVxyXG4gICAqIEBtZW1iZXJPZiBMb2dUcnVuY2F0aW9uT3B0aW9uc1xyXG4gICAqL1xyXG4gIHNvdXJjZXM/OiBzdHJpbmdbXTtcclxuXHJcbiAgLyoqXHJcbiAgICogVGhlIHByZWZpeCB0byB1c2UgZm9yIGxvZ2dpbmcgZnJvbSB0aGlzIHN0cmF0ZWd5LlxyXG4gICAqXHJcbiAgICogRGVmYXVsdHMgdG8gYFske25hbWV9XWAuXHJcbiAgICpcclxuICAgKiBAdHlwZSB7c3RyaW5nfVxyXG4gICAqIEBtZW1iZXJPZiBTdHJhdGVneU9wdGlvbnNcclxuICAgKi9cclxuICBsb2dQcmVmaXg/OiBzdHJpbmc7XHJcblxyXG4gIC8qKlxyXG4gICAqIEEgc3BlY2lmaWMgbG9nIGxldmVsIGZvciB0aGlzIHN0cmF0ZWd5LlxyXG4gICAqXHJcbiAgICogT3ZlcnJpZGVzIHRoZSBsb2cgbGV2ZWwgdXNlZCB3aGVuIGFjdGl2YXRpbmcgdGhlIGNvb3JkaW5hdG9yLlxyXG4gICAqXHJcbiAgICogQHR5cGUge0xvZ0xldmVsfVxyXG4gICAqIEBtZW1iZXJPZiBTdHJhdGVneU9wdGlvbnNcclxuICAgKi9cclxuICBsb2dMZXZlbD86IExvZ0xldmVsO1xyXG59XHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgU3RyYXRlZ3kge1xyXG4gIHByb3RlY3RlZCBfbmFtZTogc3RyaW5nO1xyXG4gIHByb3RlY3RlZCBfY29vcmRpbmF0b3I6IENvb3JkaW5hdG9yO1xyXG4gIHByb3RlY3RlZCBfc291cmNlTmFtZXM6IHN0cmluZ1tdO1xyXG4gIHByb3RlY3RlZCBfc291cmNlczogU291cmNlW107XHJcbiAgcHJvdGVjdGVkIF9hY3RpdmF0ZWQ6IFByb21pc2U8YW55PjtcclxuICBwcm90ZWN0ZWQgX2N1c3RvbUxvZ0xldmVsOiBMb2dMZXZlbDtcclxuICBwcm90ZWN0ZWQgX2xvZ0xldmVsOiBMb2dMZXZlbDtcclxuICBwcm90ZWN0ZWQgX2xvZ1ByZWZpeDogc3RyaW5nO1xyXG5cclxuICBjb25zdHJ1Y3RvcihvcHRpb25zOiBTdHJhdGVneU9wdGlvbnMgPSB7fSkge1xyXG4gICAgYXNzZXJ0KCdTdHJhdGVneSByZXF1aXJlcyBhIG5hbWUnLCAhIW9wdGlvbnMubmFtZSk7XHJcblxyXG4gICAgdGhpcy5fbmFtZSA9IG9wdGlvbnMubmFtZTtcclxuICAgIHRoaXMuX3NvdXJjZU5hbWVzID0gb3B0aW9ucy5zb3VyY2VzO1xyXG4gICAgdGhpcy5fbG9nUHJlZml4ID0gb3B0aW9ucy5sb2dQcmVmaXggfHwgYFske3RoaXMuX25hbWV9XWA7XHJcbiAgICB0aGlzLl9sb2dMZXZlbCA9IHRoaXMuX2N1c3RvbUxvZ0xldmVsID0gb3B0aW9ucy5sb2dMZXZlbDtcclxuICB9XHJcblxyXG4gIGFjdGl2YXRlKGNvb3JkaW5hdG9yOiBDb29yZGluYXRvciwgb3B0aW9uczogQWN0aXZhdGlvbk9wdGlvbnMgPSB7fSk6IFByb21pc2U8YW55PiB7XHJcbiAgICB0aGlzLl9jb29yZGluYXRvciA9IGNvb3JkaW5hdG9yO1xyXG5cclxuICAgIGlmICh0aGlzLl9jdXN0b21Mb2dMZXZlbCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHRoaXMuX2xvZ0xldmVsID0gb3B0aW9ucy5sb2dMZXZlbDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5fc291cmNlTmFtZXMpIHtcclxuICAgICAgdGhpcy5fc291cmNlcyA9IHRoaXMuX3NvdXJjZU5hbWVzLm1hcChuYW1lID0+IGNvb3JkaW5hdG9yLmdldFNvdXJjZShuYW1lKSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLl9zb3VyY2VzID0gY29vcmRpbmF0b3Iuc291cmNlcztcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgfVxyXG5cclxuICBkZWFjdGl2YXRlKCk6IFByb21pc2U8YW55PiB7XHJcbiAgICB0aGlzLl9jb29yZGluYXRvciA9IG51bGw7XHJcblxyXG4gICAgcmV0dXJuIE9yYml0LlByb21pc2UucmVzb2x2ZSgpO1xyXG4gIH1cclxuXHJcbiAgZ2V0IG5hbWUoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLl9uYW1lO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGNvb3JkaW5hdG9yKCk6IENvb3JkaW5hdG9yIHtcclxuICAgIHJldHVybiB0aGlzLl9jb29yZGluYXRvcjtcclxuICB9XHJcblxyXG4gIGdldCBzb3VyY2VzKCk6IFNvdXJjZVtdIHtcclxuICAgIHJldHVybiB0aGlzLl9zb3VyY2VzO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGxvZ1ByZWZpeCgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMuX2xvZ1ByZWZpeDtcclxuICB9XHJcblxyXG4gIGdldCBsb2dMZXZlbCgpOiBMb2dMZXZlbCB7XHJcbiAgICByZXR1cm4gdGhpcy5fbG9nTGV2ZWw7XHJcbiAgfVxyXG59XHJcbiJdfQ==