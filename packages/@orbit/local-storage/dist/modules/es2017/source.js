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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var data_1 = require("@orbit/data");
var utils_1 = require("@orbit/utils");
var transform_operators_1 = require("./lib/transform-operators");
var pull_operators_1 = require("./lib/pull-operators");
var local_storage_1 = require("./lib/local-storage");
/**
 * Source for storing data in localStorage.
 *
 * @class LocalStorageSource
 * @extends Source
 */
var LocalStorageSource = (function (_super) {
    __extends(LocalStorageSource, _super);
    /**
     * Create a new LocalStorageSource.
     *
     * @constructor
     * @param {Object} [settings]           Settings.
     * @param {Schema} [settings.schema]    Schema for source.
     * @param {String} [settings.namespace] Optional. Prefix for keys used in localStorage. Defaults to 'orbit'.
     * @param {String} [settings.delimiter] Optional. Delimiter used to separate key segments in localStorage. Defaults to '/'.
     */
    function LocalStorageSource(settings) {
        if (settings === void 0) { settings = {}; }
        var _this = this;
        utils_1.assert('LocalStorageSource\'s `schema` must be specified in `settings.schema` constructor argument', !!settings.schema);
        utils_1.assert('Your browser does not support local storage!', local_storage_1.supportsLocalStorage());
        settings.name = settings.name || 'localStorage';
        _this = _super.call(this, settings) || this;
        _this._namespace = settings.namespace || 'orbit';
        _this._delimiter = settings.delimiter || '/';
        return _this;
    }
    Object.defineProperty(LocalStorageSource.prototype, "namespace", {
        get: function () {
            return this._namespace;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LocalStorageSource.prototype, "delimiter", {
        get: function () {
            return this._delimiter;
        },
        enumerable: true,
        configurable: true
    });
    LocalStorageSource.prototype.getKeyForRecord = function (record) {
        return [this.namespace, record.type, record.id].join(this.delimiter);
    };
    LocalStorageSource.prototype.getRecord = function (record) {
        var key = this.getKeyForRecord(record);
        var result = JSON.parse(data_1.default.globals.localStorage.getItem(key));
        if (result && this._keyMap) {
            this._keyMap.pushRecord(result);
        }
        return result;
    };
    LocalStorageSource.prototype.putRecord = function (record) {
        var key = this.getKeyForRecord(record);
        // console.log('LocalStorageSource#putRecord', key, JSON.stringify(record));
        if (this._keyMap) {
            this._keyMap.pushRecord(record);
        }
        data_1.default.globals.localStorage.setItem(key, JSON.stringify(record));
    };
    LocalStorageSource.prototype.removeRecord = function (record) {
        var key = this.getKeyForRecord(record);
        // console.log('LocalStorageSource#removeRecord', key, JSON.stringify(record));
        data_1.default.globals.localStorage.removeItem(key);
    };
    /////////////////////////////////////////////////////////////////////////////
    // Resettable interface implementation
    /////////////////////////////////////////////////////////////////////////////
    LocalStorageSource.prototype.reset = function () {
        for (var key in data_1.default.globals.localStorage) {
            if (key.indexOf(this.namespace) === 0) {
                data_1.default.globals.localStorage.removeItem(key);
            }
        }
        return data_1.default.Promise.resolve();
    };
    /////////////////////////////////////////////////////////////////////////////
    // Syncable interface implementation
    /////////////////////////////////////////////////////////////////////////////
    LocalStorageSource.prototype._sync = function (transform) {
        this._applyTransform(transform);
        return data_1.default.Promise.resolve();
    };
    /////////////////////////////////////////////////////////////////////////////
    // Pushable interface implementation
    /////////////////////////////////////////////////////////////////////////////
    LocalStorageSource.prototype._push = function (transform) {
        this._applyTransform(transform);
        return data_1.default.Promise.resolve([transform]);
    };
    /////////////////////////////////////////////////////////////////////////////
    // Pullable implementation
    /////////////////////////////////////////////////////////////////////////////
    LocalStorageSource.prototype._pull = function (query) {
        var operator = pull_operators_1.PullOperators[query.expression.op];
        if (!operator) {
            throw new Error('LocalStorageSource does not support the `${query.expression.op}` operator for queries.');
        }
        return operator(this, query.expression);
    };
    /////////////////////////////////////////////////////////////////////////////
    // Protected
    /////////////////////////////////////////////////////////////////////////////
    LocalStorageSource.prototype._applyTransform = function (transform) {
        var _this = this;
        transform.operations.forEach(function (operation) {
            transform_operators_1.default[operation.op](_this, operation);
        });
    };
    LocalStorageSource = __decorate([
        data_1.pullable,
        data_1.pushable,
        data_1.syncable
    ], LocalStorageSource);
    return LocalStorageSource;
}(data_1.Source));
exports.default = LocalStorageSource;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3JjL3NvdXJjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxvQ0FXcUI7QUFDckIsc0NBQXNDO0FBQ3RDLGlFQUEyRDtBQUMzRCx1REFBbUU7QUFDbkUscURBQTJEO0FBTzNEOzs7OztHQUtHO0FBSUg7SUFBZ0Qsc0NBQU07SUFhcEQ7Ozs7Ozs7O09BUUc7SUFDSCw0QkFBWSxRQUF5QztRQUF6Qyx5QkFBQSxFQUFBLGFBQXlDO1FBQXJELGlCQVVDO1FBVEMsY0FBTSxDQUFDLDRGQUE0RixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDeEgsY0FBTSxDQUFDLDhDQUE4QyxFQUFFLG9DQUFvQixFQUFFLENBQUMsQ0FBQztRQUUvRSxRQUFRLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxJQUFJLElBQUksY0FBYyxDQUFDO1FBRWhELFFBQUEsa0JBQU0sUUFBUSxDQUFDLFNBQUM7UUFFaEIsS0FBSSxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUMsU0FBUyxJQUFJLE9BQU8sQ0FBQztRQUNoRCxLQUFJLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQyxTQUFTLElBQUksR0FBRyxDQUFDOztJQUM5QyxDQUFDO0lBRUQsc0JBQUkseUNBQVM7YUFBYjtZQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO1FBQ3pCLENBQUM7OztPQUFBO0lBRUQsc0JBQUkseUNBQVM7YUFBYjtZQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO1FBQ3pCLENBQUM7OztPQUFBO0lBRUQsNENBQWUsR0FBZixVQUFnQixNQUErQjtRQUM3QyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFD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TSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFFRCw2RUFBNkU7SUFDN0UsWUFBWTtJQUNaLDZFQUE2RTtJQUVuRSw0Q0FBZSxHQUF6QixVQUEwQixTQUFvQjtRQUE5QyxpQkFJQztRQUhDLFNBQVMsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFVBQUEsU0FBUztZQUNwQyw2QkFBa0IsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ3BELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQWxJa0Isa0JBQWtCO1FBSHRDLGVBQVE7UUFDUixlQUFRO1FBQ1IsZUFBUTtPQUNZLGtCQUFrQixDQW1JdEM7SUFBRCx5QkFBQztDQUFBLEFBbklELENBQWdELGFBQU0sR0FtSXJEO2tCQW5Jb0Isa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE9yYml0LCB7XHJcbiAgcHVsbGFibGUsIFB1bGxhYmxlLFxyXG4gIHB1c2hhYmxlLCBQdXNoYWJsZSxcclxuICBSZXNldHRhYmxlLFxyXG4gIHN5bmNhYmxlLCBTeW5jYWJsZSxcclxuICBRdWVyeSxcclxuICBRdWVyeU9yRXhwcmVzc2lvbixcclxuICBSZWNvcmQsIFJlY29yZElkZW50aXR5LFxyXG4gIFNvdXJjZSwgU291cmNlU2V0dGluZ3MsXHJcbiAgVHJhbnNmb3JtLFxyXG4gIFRyYW5zZm9ybU9yT3BlcmF0aW9uc1xyXG59IGZyb20gJ0BvcmJpdC9kYXRhJztcclxuaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSAnQG9yYml0L3V0aWxzJztcclxuaW1wb3J0IHRyYW5zZm9ybU9wZXJhdG9ycyBmcm9tICcuL2xpYi90cmFuc2Zvcm0tb3BlcmF0b3JzJztcclxuaW1wb3J0IHsgUHVsbE9wZXJhdG9yLCBQdWxsT3BlcmF0b3JzIH0gZnJvbSAnLi9saWIvcHVsbC1vcGVyYXRvcnMnO1xyXG5pbXBvcnQgeyBzdXBwb3J0c0xvY2FsU3RvcmFnZSB9IGZyb20gJy4vbGliL2xvY2FsLXN0b3JhZ2UnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBMb2NhbFN0b3JhZ2VTb3VyY2VTZXR0aW5ncyBleHRlbmRzIFNvdXJjZVNldHRpbmdzIHtcclxuICBkZWxpbWl0ZXI/OiBzdHJpbmc7XHJcbiAgbmFtZXNwYWNlPzogc3RyaW5nO1xyXG59XHJcblxyXG4vKipcclxuICogU291cmNlIGZvciBzdG9yaW5nIGRhdGEgaW4gbG9jYWxTdG9yYWdlLlxyXG4gKlxyXG4gKiBAY2xhc3MgTG9jYWxTdG9yYWdlU291cmNlXHJcbiAqIEBleHRlbmRzIFNvdXJjZVxyXG4gKi9cclxuQHB1bGxhYmxlXHJcbkBwdXNoYWJsZVxyXG5Ac3luY2FibGVcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9jYWxTdG9yYWdlU291cmNlIGV4dGVuZHMgU291cmNlIGltcGxlbWVudHMgUHVsbGFibGUsIFB1c2hhYmxlLCBSZXNldHRhYmxlLCBTeW5jYWJsZSB7XHJcbiAgcHJvdGVjdGVkIF9uYW1lc3BhY2U6IHN0cmluZztcclxuICBwcm90ZWN0ZWQgX2RlbGltaXRlcjogc3RyaW5nO1xyXG5cclxuICAvLyBTeW5jYWJsZSBpbnRlcmZhY2Ugc3R1YnNcclxuICBzeW5jOiAodHJhbnNmb3JtT3JUcmFuc2Zvcm1zOiBUcmFuc2Zvcm0gfCBUcmFuc2Zvcm1bXSkgPT4gUHJvbWlzZTx2b2lkPjtcclxuXHJcbiAgLy8gUHVsbGFibGUgaW50ZXJmYWNlIHN0dWJzXHJcbiAgcHVsbDogKHF1ZXJ5T3JFeHByZXNzaW9uOiBRdWVyeU9yRXhwcmVzc2lvbiwgb3B0aW9ucz86IG9iamVjdCwgaWQ/OiBzdHJpbmcpID0+IFByb21pc2U8VHJhbnNmb3JtW10+O1xyXG5cclxuICAvLyBQdXNoYWJsZSBpbnRlcmZhY2Ugc3R1YnNcclxuICBwdXNoOiAodHJhbnNmb3JtT3JPcGVyYXRpb25zOiBUcmFuc2Zvcm1Pck9wZXJhdGlvbnMsIG9wdGlvbnM/OiBvYmplY3QsIGlkPzogc3RyaW5nKSA9PiBQcm9taXNlPFRyYW5zZm9ybVtdPjtcclxuXHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlIGEgbmV3IExvY2FsU3RvcmFnZVNvdXJjZS5cclxuICAgKlxyXG4gICAqIEBjb25zdHJ1Y3RvclxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbc2V0dGluZ3NdICAgICAgICAgICBTZXR0aW5ncy5cclxuICAgKiBAcGFyYW0ge1NjaGVtYX0gW3NldHRpbmdzLnNjaGVtYV0gICAgU2NoZW1hIGZvciBzb3VyY2UuXHJcbiAgICogQHBhcmFtIHtTdHJpbmd9IFtzZXR0aW5ncy5uYW1lc3BhY2VdIE9wdGlvbmFsLiBQcmVmaXggZm9yIGtleXMgdXNlZCBpbiBsb2NhbFN0b3JhZ2UuIERlZmF1bHRzIHRvICdvcmJpdCcuXHJcbiAgICogQHBhcmFtIHtTdHJpbmd9IFtzZXR0aW5ncy5kZWxpbWl0ZXJdIE9wdGlvbmFsLiBEZWxpbWl0ZXIgdXNlZCB0byBzZXBhcmF0ZSBrZXkgc2VnbWVudHMgaW4gbG9jYWxTdG9yYWdlLiBEZWZhdWx0cyB0byAnLycuXHJcbiAgICovXHJcbiAgY29uc3RydWN0b3Ioc2V0dGluZ3M6IExvY2FsU3RvcmFnZVNvdXJjZVNldHRpbmdzID0ge30pIHtcclxuICAgIGFzc2VydCgnTG9jYWxTdG9yYWdlU291cmNlXFwncyBgc2NoZW1hYCBtdXN0IGJlIHNwZWNpZmllZCBpbiBgc2V0dGluZ3Muc2NoZW1hYCBjb25zdHJ1Y3RvciBhcmd1bWVudCcsICEhc2V0dGluZ3Muc2NoZW1hKTtcclxuICAgIGFzc2VydCgnWW91ciBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgbG9jYWwgc3RvcmFnZSEnLCBzdXBwb3J0c0xvY2FsU3RvcmFnZSgpKTtcclxuXHJcbiAgICBzZXR0aW5ncy5uYW1lID0gc2V0dGluZ3MubmFtZSB8fCAnbG9jYWxTdG9yYWdlJztcclxuXHJcbiAgICBzdXBlcihzZXR0aW5ncyk7XHJcblxyXG4gICAgdGhpcy5fbmFtZXNwYWNlID0gc2V0dGluZ3MubmFtZXNwYWNlIHx8ICdvcmJpdCc7XHJcbiAgICB0aGlzLl9kZWxpbWl0ZXIgPSBzZXR0aW5ncy5kZWxpbWl0ZXIgfHwgJy8nO1xyXG4gIH1cclxuXHJcbiAgZ2V0IG5hbWVzcGFjZSgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMuX25hbWVzcGFjZTtcclxuICB9XHJcblxyXG4gIGdldCBkZWxpbWl0ZXIoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLl9kZWxpbWl0ZXI7XHJcbiAgfVxyXG5cclxuICBnZXRLZXlGb3JSZWNvcmQocmVjb3JkOiBSZWNvcmRJZGVudGl0eSB8IFJlY29yZCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gW3RoaXMubmFtZXNwYWNlLCByZWNvcmQudHlwZSwgcmVjb3JkLmlkXS5qb2luKHRoaXMuZGVsaW1pdGVyKTtcclxuICB9XHJcblxyXG4gIGdldFJlY29yZChyZWNvcmQ6IFJlY29yZElkZW50aXR5KTogUmVjb3JkIHtcclxuICAgIGNvbnN0IGtleSA9IHRoaXMuZ2V0S2V5Rm9yUmVjb3JkKHJlY29yZCk7XHJcblxyXG4gICAgbGV0IHJlc3VsdCA9IEpTT04ucGFyc2UoT3JiaXQuZ2xvYmFscy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpKTtcclxuXHJcbiAgICBpZiAocmVzdWx0ICYmIHRoaXMuX2tleU1hcCkge1xyXG4gICAgICB0aGlzLl9rZXlNYXAucHVzaFJlY29yZChyZXN1bHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxuICBwdXRSZWNvcmQocmVjb3JkOiBSZWNvcmQpOiB2b2lkIHtcclxuICAgIGNvbnN0IGtleSA9IHRoaXMuZ2V0S2V5Rm9yUmVjb3JkKHJlY29yZCk7XHJcblxyXG4gICAgLy8gY29uc29sZS5sb2coJ0xvY2FsU3RvcmFnZVNvdXJjZSNwdXRSZWNvcmQnLCBrZXksIEpTT04uc3RyaW5naWZ5KHJlY29yZCkpO1xyXG5cclxuICAgIGlmICh0aGlzLl9rZXlNYXApIHtcclxuICAgICAgdGhpcy5fa2V5TWFwLnB1c2hSZWNvcmQocmVjb3JkKTtcclxuICAgIH1cclxuXHJcbiAgICBPcmJpdC5nbG9iYWxzLmxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkocmVjb3JkKSk7XHJcbiAgfVxyXG5cclxuICByZW1vdmVSZWNvcmQocmVjb3JkOiBSZWNvcmRJZGVudGl0eSk6IHZvaWQge1xyXG4gICAgY29uc3Qga2V5ID0gdGhpcy5nZXRLZXlGb3JSZWNvcmQocmVjb3JkKTtcclxuXHJcbiAgICAvLyBjb25zb2xlLmxvZygnTG9jYWxTdG9yYWdlU291cmNlI3JlbW92ZVJlY29yZCcsIGtleSwgSlNPTi5zdHJpbmdpZnkocmVjb3JkKSk7XHJcblxyXG4gICAgT3JiaXQuZ2xvYmFscy5sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShrZXkpO1xyXG4gIH1cclxuXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAvLyBSZXNldHRhYmxlIGludGVyZmFjZSBpbXBsZW1lbnRhdGlvblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIHJlc2V0KCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgZm9yIChsZXQga2V5IGluIE9yYml0Lmdsb2JhbHMubG9jYWxTdG9yYWdlKSB7XHJcbiAgICAgIGlmIChrZXkuaW5kZXhPZih0aGlzLm5hbWVzcGFjZSkgPT09IDApIHtcclxuICAgICAgICBPcmJpdC5nbG9iYWxzLmxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGtleSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKTtcclxuICB9XHJcblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgLy8gU3luY2FibGUgaW50ZXJmYWNlIGltcGxlbWVudGF0aW9uXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgX3N5bmModHJhbnNmb3JtOiBUcmFuc2Zvcm0pOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHRoaXMuX2FwcGx5VHJhbnNmb3JtKHRyYW5zZm9ybSk7XHJcbiAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgfVxyXG5cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gIC8vIFB1c2hhYmxlIGludGVyZmFjZSBpbXBsZW1lbnRhdGlvblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIF9wdXNoKHRyYW5zZm9ybTogVHJhbnNmb3JtKTogUHJvbWlzZTxUcmFuc2Zvcm1bXT4ge1xyXG4gICAgdGhpcy5fYXBwbHlUcmFuc2Zvcm0odHJhbnNmb3JtKTtcclxuICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUoW3RyYW5zZm9ybV0pO1xyXG4gIH1cclxuXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAvLyBQdWxsYWJsZSBpbXBsZW1lbnRhdGlvblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIF9wdWxsKHF1ZXJ5OiBRdWVyeSk6IFByb21pc2U8VHJhbnNmb3JtW10+IHtcclxuICAgIGNvbnN0IG9wZXJhdG9yOiBQdWxsT3BlcmF0b3IgPSBQdWxsT3BlcmF0b3JzW3F1ZXJ5LmV4cHJlc3Npb24ub3BdO1xyXG4gICAgaWYgKCFvcGVyYXRvcikge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0xvY2FsU3RvcmFnZVNvdXJjZSBkb2VzIG5vdCBzdXBwb3J0IHRoZSBgJHtxdWVyeS5leHByZXNzaW9uLm9wfWAgb3BlcmF0b3IgZm9yIHF1ZXJpZXMuJyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG9wZXJhdG9yKHRoaXMsIHF1ZXJ5LmV4cHJlc3Npb24pO1xyXG4gIH1cclxuXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAvLyBQcm90ZWN0ZWRcclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICBwcm90ZWN0ZWQgX2FwcGx5VHJhbnNmb3JtKHRyYW5zZm9ybTogVHJhbnNmb3JtKTogdm9pZCB7XHJcbiAgICB0cmFuc2Zvcm0ub3BlcmF0aW9ucy5mb3JFYWNoKG9wZXJhdGlvbiA9PiB7XHJcbiAgICAgIHRyYW5zZm9ybU9wZXJhdG9yc1tvcGVyYXRpb24ub3BdKHRoaXMsIG9wZXJhdGlvbik7XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuIl19