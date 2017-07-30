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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVja2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3JjL2J1Y2tldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHFCQUVxQjtBQUNyQixzQkFBc0M7QUFDdEMsOEJBQTJEO0FBTTNELEFBS0c7Ozs7OztBQUNIO0FBQWdELGtDQUFNO0FBR3BELEFBU0c7Ozs7Ozs7Ozs7QUFDSCxnQ0FBWSxBQUF5QztBQUF6QyxpQ0FBQTtBQUFBLHVCQUF5Qzs7QUFBckQsb0JBUUM7QUFQQyxnQkFBTSxPQUFDLEFBQThDLGdEQUFFLGdCQUFvQixBQUFFLEFBQUMsQUFBQztBQUUvRSxBQUFRLGlCQUFDLEFBQUksT0FBRyxBQUFRLFNBQUMsQUFBSSxRQUFJLEFBQWMsQUFBQztBQUVoRCxnQkFBQSxrQkFBTSxBQUFRLEFBQUMsYUFBQztBQUVoQixBQUFJLGNBQUMsQUFBVSxhQUFHLEFBQVEsU0FBQyxBQUFTLGFBQUksQUFBRyxBQUFDO2VBQzlDO0FBQUM7QUFFRCwwQkFBSSw4QkFBUzthQUFiO0FBQ0UsQUFBTSxtQkFBQyxBQUFJLEtBQUMsQUFBVSxBQUFDLEFBQ3pCO0FBQUM7O3NCQUFBOztBQUVELGlDQUFpQixvQkFBakIsVUFBa0IsQUFBVztBQUMzQixBQUFNLGVBQUMsQ0FBQyxBQUFJLEtBQUMsQUFBUyxXQUFFLEFBQUcsQUFBQyxLQUFDLEFBQUksS0FBQyxBQUFJLEtBQUMsQUFBUyxBQUFDLEFBQUMsQUFDcEQ7QUFBQztBQUVELGlDQUFPLFVBQVAsVUFBUSxBQUFXO0FBQ2pCLFlBQU0sQUFBTyxVQUFXLEFBQUksS0FBQyxBQUFpQixrQkFBQyxBQUFHLEFBQUMsQUFBQztBQUNwRCxBQUFNLGVBQUMsT0FBSyxRQUFDLEFBQU8sUUFBQyxBQUFPLFFBQUMsQUFBSSxLQUFDLEFBQUssTUFBQyxPQUFLLFFBQUMsQUFBTyxRQUFDLEFBQVksYUFBQyxBQUFPLFFBQUMsQUFBTyxBQUFDLEFBQUMsQUFBQyxBQUFDLEFBQ3hGO0FBQUM7QUFFRCxpQ0FBTyxVQUFQLFVBQVEsQUFBVyxLQUFFLEFBQVU7QUFDN0IsWUFBTSxBQUFPLFVBQVcsQUFBSSxLQUFDLEFBQWlCLGtCQUFDLEFBQUcsQUFBQyxBQUFDO0FBQ3BELGVBQUssUUFBQyxBQUFPLFFBQUMsQUFBWSxhQUFDLEFBQU8sUUFBQyxBQUFPLFNBQUUsQUFBSSxLQUFDLEFBQVMsVUFBQyxBQUFLLEFBQUMsQUFBQyxBQUFDO0FBQ25FLEFBQU0sZUFBQyxPQUFLLFFBQUMsQUFBTyxRQUFDLEFBQU8sQUFBRSxBQUFDLEFBQ2pDO0FBQUM7QUFFRCxpQ0FBVSxhQUFWLFVBQVcsQUFBVztBQUNwQixZQUFNLEFBQU8sVUFBVyxBQUFJLEtBQUMsQUFBaUIsa0JBQUMsQUFBRyxBQUFDLEFBQUM7QUFDcEQsZUFBSyxRQUFDLEFBQU8sUUFBQyxBQUFZLGFBQUMsQUFBVSxXQUFDLEFBQU8sQUFBQyxBQUFDO0FBQy9DLEFBQU0sZUFBQyxPQUFLLFFBQUMsQUFBTyxRQUFDLEFBQU8sQUFBRSxBQUFDLEFBQ2pDO0FBQUM7QUFDSCxXQUFDLEFBQUQ7QUEvQ0EsQUErQ0MsRUEvQytDLE9BQU0sQUErQ3JEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE9yYml0LCB7XHJcbiAgQnVja2V0LCBCdWNrZXRTZXR0aW5nc1xyXG59IGZyb20gJ0BvcmJpdC9jb3JlJztcclxuaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSAnQG9yYml0L3V0aWxzJztcclxuaW1wb3J0IHsgc3VwcG9ydHNMb2NhbFN0b3JhZ2UgfSBmcm9tICcuL2xpYi9sb2NhbC1zdG9yYWdlJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgTG9jYWxTdG9yYWdlQnVja2V0U2V0dGluZ3MgZXh0ZW5kcyBCdWNrZXRTZXR0aW5ncyB7XHJcbiAgZGVsaW1pdGVyPzogc3RyaW5nO1xyXG59XHJcblxyXG4vKipcclxuICogQnVja2V0IGZvciBwZXJzaXN0aW5nIHRyYW5zaWVudCBkYXRhIGluIGxvY2FsU3RvcmFnZS5cclxuICpcclxuICogQGNsYXNzIExvY2FsU3RvcmFnZUJ1Y2tldFxyXG4gKiBAZXh0ZW5kcyBCdWNrZXRcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvY2FsU3RvcmFnZUJ1Y2tldCBleHRlbmRzIEJ1Y2tldCB7XHJcbiAgcHJpdmF0ZSBfZGVsaW1pdGVyOiBzdHJpbmc7XHJcblxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZSBhIG5ldyBMb2NhbFN0b3JhZ2VCdWNrZXQuXHJcbiAgICpcclxuICAgKiBAY29uc3RydWN0b3JcclxuICAgKiBAcGFyYW0ge09iamVjdH0gIFtzZXR0aW5nc10gICAgICAgICAgIFNldHRpbmdzLlxyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSAgW3NldHRpbmdzLm5hbWVdICAgICAgT3B0aW9uYWwuIE5hbWUgb2YgdGhpcyBidWNrZXQuIERlZmF1bHRzIHRvICdsb2NhbFN0b3JhZ2VCdWNrZXQnLlxyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSAgW3NldHRpbmdzLm5hbWVzcGFjZV0gT3B0aW9uYWwuIFByZWZpeCBmb3Iga2V5cyB1c2VkIGluIGxvY2FsU3RvcmFnZS4gRGVmYXVsdHMgdG8gJ29yYml0LWJ1Y2tldCcuXHJcbiAgICogQHBhcmFtIHtTdHJpbmd9ICBbc2V0dGluZ3MuZGVsaW1pdGVyXSBPcHRpb25hbC4gRGVsaW1pdGVyIHVzZWQgdG8gc2VwYXJhdGUga2V5IHNlZ21lbnRzIGluIGxvY2FsU3RvcmFnZS4gRGVmYXVsdHMgdG8gJy8nLlxyXG4gICAqIEBwYXJhbSB7SW50ZWdlcn0gW3NldHRpbmdzLnZlcnNpb25dICAgT3B0aW9uYWwuIERlZmF1bHRzIHRvIDEuXHJcbiAgICovXHJcbiAgY29uc3RydWN0b3Ioc2V0dGluZ3M6IExvY2FsU3RvcmFnZUJ1Y2tldFNldHRpbmdzID0ge30pIHtcclxuICAgIGFzc2VydCgnWW91ciBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgbG9jYWwgc3RvcmFnZSEnLCBzdXBwb3J0c0xvY2FsU3RvcmFnZSgpKTtcclxuXHJcbiAgICBzZXR0aW5ncy5uYW1lID0gc2V0dGluZ3MubmFtZSB8fCAnbG9jYWxTdG9yYWdlJztcclxuXHJcbiAgICBzdXBlcihzZXR0aW5ncyk7XHJcblxyXG4gICAgdGhpcy5fZGVsaW1pdGVyID0gc2V0dGluZ3MuZGVsaW1pdGVyIHx8ICcvJztcclxuICB9XHJcblxyXG4gIGdldCBkZWxpbWl0ZXIoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLl9kZWxpbWl0ZXI7XHJcbiAgfVxyXG5cclxuICBnZXRGdWxsS2V5Rm9ySXRlbShrZXk6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gW3RoaXMubmFtZXNwYWNlLCBrZXldLmpvaW4odGhpcy5kZWxpbWl0ZXIpO1xyXG4gIH1cclxuXHJcbiAgZ2V0SXRlbShrZXk6IHN0cmluZyk6IFByb21pc2U8YW55PiB7XHJcbiAgICBjb25zdCBmdWxsS2V5OiBzdHJpbmcgPSB0aGlzLmdldEZ1bGxLZXlGb3JJdGVtKGtleSk7XHJcbiAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKEpTT04ucGFyc2UoT3JiaXQuZ2xvYmFscy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShmdWxsS2V5KSkpO1xyXG4gIH1cclxuXHJcbiAgc2V0SXRlbShrZXk6IHN0cmluZywgdmFsdWU6IGFueSk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgY29uc3QgZnVsbEtleTogc3RyaW5nID0gdGhpcy5nZXRGdWxsS2V5Rm9ySXRlbShrZXkpO1xyXG4gICAgT3JiaXQuZ2xvYmFscy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShmdWxsS2V5LCBKU09OLnN0cmluZ2lmeSh2YWx1ZSkpO1xyXG4gICAgcmV0dXJuIE9yYml0LlByb21pc2UucmVzb2x2ZSgpO1xyXG4gIH1cclxuXHJcbiAgcmVtb3ZlSXRlbShrZXk6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgY29uc3QgZnVsbEtleTogc3RyaW5nID0gdGhpcy5nZXRGdWxsS2V5Rm9ySXRlbShrZXkpO1xyXG4gICAgT3JiaXQuZ2xvYmFscy5sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShmdWxsS2V5KTtcclxuICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKTtcclxuICB9XHJcbn1cclxuIl19