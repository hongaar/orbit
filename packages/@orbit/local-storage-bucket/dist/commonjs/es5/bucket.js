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
var core_1 = require("@orbit/core");
var utils_1 = require("@orbit/utils");
var local_storage_1 = require("./lib/local-storage");
/**
 * Bucket for persisting transient data in localStorage.
 *
 * @class LocalStorageBucket
 * @extends Bucket
 */
var LocalStorageBucket = function (_super) {
    __extends(LocalStorageBucket, _super);
    /**
     * Create a new LocalStorageBucket.
     *
     * @constructor
     * @param {Object}  [settings]           Settings.
     * @param {String}  [settings.name]      Optional. Name of this bucket. Defaults to 'localStorageBucket'.
     * @param {String}  [settings.namespace] Optional. Prefix for keys used in localStorage. Defaults to 'orbit-bucket'.
     * @param {String}  [settings.delimiter] Optional. Delimiter used to separate key segments in localStorage. Defaults to '/'.
     * @param {Integer} [settings.version]   Optional. Defaults to 1.
     */
    function LocalStorageBucket(settings) {
        if (settings === void 0) {
            settings = {};
        }
        var _this = this;
        utils_1.assert('Your browser does not support local storage!', local_storage_1.supportsLocalStorage());
        settings.name = settings.name || 'localStorage';
        _this = _super.call(this, settings) || this;
        _this._delimiter = settings.delimiter || '/';
        return _this;
    }
    Object.defineProperty(LocalStorageBucket.prototype, "delimiter", {
        get: function () {
            return this._delimiter;
        },
        enumerable: true,
        configurable: true
    });
    LocalStorageBucket.prototype.getFullKeyForItem = function (key) {
        return [this.namespace, key].join(this.delimiter);
    };
    LocalStorageBucket.prototype.getItem = function (key) {
        var fullKey = this.getFullKeyForItem(key);
        return core_1.default.Promise.resolve(JSON.parse(core_1.default.globals.localStorage.getItem(fullKey)));
    };
    LocalStorageBucket.prototype.setItem = function (key, value) {
        var fullKey = this.getFullKeyForItem(key);
        core_1.default.globals.localStorage.setItem(fullKey, JSON.stringify(value));
        return core_1.default.Promise.resolve();
    };
    LocalStorageBucket.prototype.removeItem = function (key) {
        var fullKey = this.getFullKeyForItem(key);
        core_1.default.globals.localStorage.removeItem(fullKey);
        return core_1.default.Promise.resolve();
    };
    return LocalStorageBucket;
}(core_1.Bucket);
exports.default = LocalStorageBucket;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVja2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3JjL2J1Y2tldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEscUJBRXFCO0FBQ3JCLHNCQUFzQztBQUN0Qyw4QkFBMkQ7QUFNM0QsQUFLRzs7Ozs7O0FBQ0gsMkNBQWdEO2tDQUFNLEFBR3BELEFBU0c7QUFDSDs7Ozs7Ozs7OztnQ0FBWSxBQUF5QyxVQUF6QztpQ0FBQTt1QkFBeUM7QUFBckQ7b0JBUUMsQUFQQztnQkFBTSxPQUFDLEFBQThDLGdEQUFFLGdCQUFvQixBQUFFLEFBQUMsQUFBQyxBQUUvRSxBQUFRO2lCQUFDLEFBQUksT0FBRyxBQUFRLFNBQUMsQUFBSSxRQUFJLEFBQWMsQUFBQyxBQUVoRDtnQkFBQSxrQkFBTSxBQUFRLEFBQUMsYUFBQyxBQUVoQixBQUFJO2NBQUMsQUFBVSxhQUFHLEFBQVEsU0FBQyxBQUFTLGFBQUksQUFBRyxBQUFDO2VBQzlDLEFBQUM7QUFFRDswQkFBSSw4QkFBUzthQUFiLFlBQ0UsQUFBTTttQkFBQyxBQUFJLEtBQUMsQUFBVSxBQUFDLEFBQ3pCLEFBQUM7OztzQkFBQSxBQUVEOztpQ0FBaUIsb0JBQWpCLFVBQWtCLEFBQVcsS0FDM0IsQUFBTTtlQUFDLENBQUMsQUFBSSxLQUFDLEFBQVMsV0FBRSxBQUFHLEFBQUMsS0FBQyxBQUFJLEtBQUMsQUFBSSxLQUFDLEFBQVMsQUFBQyxBQUFDLEFBQ3BELEFBQUM7QUFFRDtpQ0FBTyxVQUFQLFVBQVEsQUFBVyxLQUNqQjtZQUFNLEFBQU8sVUFBVyxBQUFJLEtBQUMsQUFBaUIsa0JBQUMsQUFBRyxBQUFDLEFBQUMsQUFDcEQsQUFBTTtlQUFDLE9BQUssUUFBQyxBQUFPLFFBQUMsQUFBTyxRQUFDLEFBQUksS0FBQyxBQUFLLE1BQUMsT0FBSyxRQUFDLEFBQU8sUUFBQyxBQUFZLGFBQUMsQUFBTyxRQUFDLEFBQU8sQUFBQyxBQUFDLEFBQUMsQUFBQyxBQUN4RixBQUFDO0FBRUQ7aUNBQU8sVUFBUCxVQUFRLEFBQVcsS0FBRSxBQUFVLE9BQzdCO1lBQU0sQUFBTyxVQUFXLEFBQUksS0FBQyxBQUFpQixrQkFBQyxBQUFHLEFBQUMsQUFBQyxBQUNwRDtlQUFLLFFBQUMsQUFBTyxRQUFDLEFBQVksYUFBQyxBQUFPLFFBQUMsQUFBTyxTQUFFLEFBQUksS0FBQyxBQUFTLFVBQUMsQUFBSyxBQUFDLEFBQUMsQUFBQyxBQUNuRSxBQUFNO2VBQUMsT0FBSyxRQUFDLEFBQU8sUUFBQyxBQUFPLEFBQUUsQUFBQyxBQUNqQyxBQUFDO0FBRUQ7aUNBQVUsYUFBVixVQUFXLEFBQVcsS0FDcEI7WUFBTSxBQUFPLFVBQVcsQUFBSSxLQUFDLEFBQWlCLGtCQUFDLEFBQUcsQUFBQyxBQUFDLEFBQ3BEO2VBQUssUUFBQyxBQUFPLFFBQUMsQUFBWSxhQUFDLEFBQVUsV0FBQyxBQUFPLEFBQUMsQUFBQyxBQUMvQyxBQUFNO2VBQUMsT0FBSyxRQUFDLEFBQU8sUUFBQyxBQUFPLEFBQUUsQUFBQyxBQUNqQyxBQUFDO0FBQ0g7V0FBQSxBQUFDLEFBL0NELEFBK0NDO0VBL0MrQyxPQUFNLEFBK0NyRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBPcmJpdCwge1xyXG4gIEJ1Y2tldCwgQnVja2V0U2V0dGluZ3NcclxufSBmcm9tICdAb3JiaXQvY29yZSc7XHJcbmltcG9ydCB7IGFzc2VydCB9IGZyb20gJ0BvcmJpdC91dGlscyc7XHJcbmltcG9ydCB7IHN1cHBvcnRzTG9jYWxTdG9yYWdlIH0gZnJvbSAnLi9saWIvbG9jYWwtc3RvcmFnZSc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIExvY2FsU3RvcmFnZUJ1Y2tldFNldHRpbmdzIGV4dGVuZHMgQnVja2V0U2V0dGluZ3Mge1xyXG4gIGRlbGltaXRlcj86IHN0cmluZztcclxufVxyXG5cclxuLyoqXHJcbiAqIEJ1Y2tldCBmb3IgcGVyc2lzdGluZyB0cmFuc2llbnQgZGF0YSBpbiBsb2NhbFN0b3JhZ2UuXHJcbiAqXHJcbiAqIEBjbGFzcyBMb2NhbFN0b3JhZ2VCdWNrZXRcclxuICogQGV4dGVuZHMgQnVja2V0XHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMb2NhbFN0b3JhZ2VCdWNrZXQgZXh0ZW5kcyBCdWNrZXQge1xyXG4gIHByaXZhdGUgX2RlbGltaXRlcjogc3RyaW5nO1xyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGUgYSBuZXcgTG9jYWxTdG9yYWdlQnVja2V0LlxyXG4gICAqXHJcbiAgICogQGNvbnN0cnVjdG9yXHJcbiAgICogQHBhcmFtIHtPYmplY3R9ICBbc2V0dGluZ3NdICAgICAgICAgICBTZXR0aW5ncy5cclxuICAgKiBAcGFyYW0ge1N0cmluZ30gIFtzZXR0aW5ncy5uYW1lXSAgICAgIE9wdGlvbmFsLiBOYW1lIG9mIHRoaXMgYnVja2V0LiBEZWZhdWx0cyB0byAnbG9jYWxTdG9yYWdlQnVja2V0Jy5cclxuICAgKiBAcGFyYW0ge1N0cmluZ30gIFtzZXR0aW5ncy5uYW1lc3BhY2VdIE9wdGlvbmFsLiBQcmVmaXggZm9yIGtleXMgdXNlZCBpbiBsb2NhbFN0b3JhZ2UuIERlZmF1bHRzIHRvICdvcmJpdC1idWNrZXQnLlxyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSAgW3NldHRpbmdzLmRlbGltaXRlcl0gT3B0aW9uYWwuIERlbGltaXRlciB1c2VkIHRvIHNlcGFyYXRlIGtleSBzZWdtZW50cyBpbiBsb2NhbFN0b3JhZ2UuIERlZmF1bHRzIHRvICcvJy5cclxuICAgKiBAcGFyYW0ge0ludGVnZXJ9IFtzZXR0aW5ncy52ZXJzaW9uXSAgIE9wdGlvbmFsLiBEZWZhdWx0cyB0byAxLlxyXG4gICAqL1xyXG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzOiBMb2NhbFN0b3JhZ2VCdWNrZXRTZXR0aW5ncyA9IHt9KSB7XHJcbiAgICBhc3NlcnQoJ1lvdXIgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IGxvY2FsIHN0b3JhZ2UhJywgc3VwcG9ydHNMb2NhbFN0b3JhZ2UoKSk7XHJcblxyXG4gICAgc2V0dGluZ3MubmFtZSA9IHNldHRpbmdzLm5hbWUgfHwgJ2xvY2FsU3RvcmFnZSc7XHJcblxyXG4gICAgc3VwZXIoc2V0dGluZ3MpO1xyXG5cclxuICAgIHRoaXMuX2RlbGltaXRlciA9IHNldHRpbmdzLmRlbGltaXRlciB8fCAnLyc7XHJcbiAgfVxyXG5cclxuICBnZXQgZGVsaW1pdGVyKCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5fZGVsaW1pdGVyO1xyXG4gIH1cclxuXHJcbiAgZ2V0RnVsbEtleUZvckl0ZW0oa2V5OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIFt0aGlzLm5hbWVzcGFjZSwga2V5XS5qb2luKHRoaXMuZGVsaW1pdGVyKTtcclxuICB9XHJcblxyXG4gIGdldEl0ZW0oa2V5OiBzdHJpbmcpOiBQcm9taXNlPGFueT4ge1xyXG4gICAgY29uc3QgZnVsbEtleTogc3RyaW5nID0gdGhpcy5nZXRGdWxsS2V5Rm9ySXRlbShrZXkpO1xyXG4gICAgcmV0dXJuIE9yYml0LlByb21pc2UucmVzb2x2ZShKU09OLnBhcnNlKE9yYml0Lmdsb2JhbHMubG9jYWxTdG9yYWdlLmdldEl0ZW0oZnVsbEtleSkpKTtcclxuICB9XHJcblxyXG4gIHNldEl0ZW0oa2V5OiBzdHJpbmcsIHZhbHVlOiBhbnkpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIGNvbnN0IGZ1bGxLZXk6IHN0cmluZyA9IHRoaXMuZ2V0RnVsbEtleUZvckl0ZW0oa2V5KTtcclxuICAgIE9yYml0Lmdsb2JhbHMubG9jYWxTdG9yYWdlLnNldEl0ZW0oZnVsbEtleSwgSlNPTi5zdHJpbmdpZnkodmFsdWUpKTtcclxuICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKTtcclxuICB9XHJcblxyXG4gIHJlbW92ZUl0ZW0oa2V5OiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIGNvbnN0IGZ1bGxLZXk6IHN0cmluZyA9IHRoaXMuZ2V0RnVsbEtleUZvckl0ZW0oa2V5KTtcclxuICAgIE9yYml0Lmdsb2JhbHMubG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oZnVsbEtleSk7XHJcbiAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgfVxyXG59XHJcbiJdfQ==