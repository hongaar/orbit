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
var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
        if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }return c > 3 && r && Object.defineProperty(target, key, r), r;
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
var LocalStorageSource = function (_super) {
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
        if (settings === void 0) {
            settings = {};
        }
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
        if (this._keyMap) {
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
    LocalStorageSource = __decorate([data_1.pullable, data_1.pushable, data_1.syncable], LocalStorageSource);
    return LocalStorageSource;
}(data_1.Source);
exports.default = LocalStorageSource;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3JjL3NvdXJjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxxQkFXcUI7QUFDckIsc0JBQXNDO0FBQ3RDLG9DQUEyRDtBQUMzRCwrQkFBbUU7QUFDbkUsOEJBQTJEO0FBTzNELEFBS0c7Ozs7OztBQUlILDJDQUFnRDtrQ0FBTSxBQWFwRCxBQVFHO0FBQ0g7Ozs7Ozs7OztnQ0FBWSxBQUF5QyxVQUF6QztpQ0FBQTt1QkFBeUM7QUFBckQ7b0JBVUMsQUFUQztnQkFBTSxPQUFDLEFBQTRGLDhGQUFFLENBQUMsQ0FBQyxBQUFRLFNBQUMsQUFBTSxBQUFDLEFBQUMsQUFDeEg7Z0JBQU0sT0FBQyxBQUE4QyxnREFBRSxnQkFBb0IsQUFBRSxBQUFDLEFBQUMsQUFFL0UsQUFBUTtpQkFBQyxBQUFJLE9BQUcsQUFBUSxTQUFDLEFBQUksUUFBSSxBQUFjLEFBQUMsQUFFaEQ7Z0JBQUEsa0JBQU0sQUFBUSxBQUFDLGFBQUMsQUFFaEIsQUFBSTtjQUFDLEFBQVUsYUFBRyxBQUFRLFNBQUMsQUFBUyxhQUFJLEFBQU8sQUFBQyxBQUNoRCxBQUFJO2NBQUMsQUFBVSxhQUFHLEFBQVEsU0FBQyxBQUFTLGFBQUksQUFBRyxBQUFDO2VBQzlDLEFBQUM7QUFFRDswQkFBSSw4QkFBUzthQUFiLFlBQ0UsQUFBTTttQkFBQyxBQUFJLEtBQUMsQUFBVSxBQUFDLEFBQ3pCLEFBQUM7OztzQkFBQSxBQUVEOzswQkFBSSw4QkFBUzthQUFiLFlBQ0UsQUFBTTttQkFBQyxBQUFJLEtBQUMsQUFBVSxBQUFDLEFBQ3pCLEFBQUM7OztzQkFBQSxBQUVEOztpQ0FBZSxrQkFBZixVQUFnQixBQUErQixRQUM3QyxBQUFNO2VBQUMsQ0FBQyxBQUFJLEtBQUMsQUFBUyxXQUFFLEFBQU0sT0FBQyxBQUFJLE1BQUUsQUFBTSxPQUFDLEFBQUUsQUFB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LEFBQzVHLEFBQUM7QUFFRCxBQUFNO2VBQUMsQUFBUSxTQUFDLEFBQUksTUFBRSxBQUFLLE1BQUMsQUFBVSxBQUFDLEFBQUMsQUFDMUMsQUFBQztBQUVELEFBQTZFO0FBQzdFLEFBQVk7QUFDWixBQUE2RTtBQUVuRTtpQ0FBZSxrQkFBekIsVUFBMEIsQUFBb0IsV0FBOUM7b0JBSUMsQUFIQyxBQUFTO2tCQUFDLEFBQVUsV0FBQyxBQUFPLFFBQUMsVUFBQSxBQUFTLFdBQ3BDO2tDQUFrQixRQUFDLEFBQVMsVUFBQyxBQUFFLEFBQUMsSUFBQyxBQUFJLE9BQUUsQUFBUyxBQUFDLEFBQUMsQUFDcEQsQUFBQyxBQUFDLEFBQUMsQUFDTDtBQUFDO0FBbElrQixBQUFrQjtxQ0FIdEMsT0FBUSxVQUNSLE9BQVEsVUFDUixPQUFRLFdBQ1ksQUFBa0IsQUFtSXRDLEFBQUQ7V0FBQyxBQW5JRCxBQW1JQztFQW5JK0MsT0FBTSxBQW1JckQ7a0JBbklvQixBQUFrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBPcmJpdCwge1xyXG4gIHB1bGxhYmxlLCBQdWxsYWJsZSxcclxuICBwdXNoYWJsZSwgUHVzaGFibGUsXHJcbiAgUmVzZXR0YWJsZSxcclxuICBzeW5jYWJsZSwgU3luY2FibGUsXHJcbiAgUXVlcnksXHJcbiAgUXVlcnlPckV4cHJlc3Npb24sXHJcbiAgUmVjb3JkLCBSZWNvcmRJZGVudGl0eSxcclxuICBTb3VyY2UsIFNvdXJjZVNldHRpbmdzLFxyXG4gIFRyYW5zZm9ybSxcclxuICBUcmFuc2Zvcm1Pck9wZXJhdGlvbnNcclxufSBmcm9tICdAb3JiaXQvZGF0YSc7XHJcbmltcG9ydCB7IGFzc2VydCB9IGZyb20gJ0BvcmJpdC91dGlscyc7XHJcbmltcG9ydCB0cmFuc2Zvcm1PcGVyYXRvcnMgZnJvbSAnLi9saWIvdHJhbnNmb3JtLW9wZXJhdG9ycyc7XHJcbmltcG9ydCB7IFB1bGxPcGVyYXRvciwgUHVsbE9wZXJhdG9ycyB9IGZyb20gJy4vbGliL3B1bGwtb3BlcmF0b3JzJztcclxuaW1wb3J0IHsgc3VwcG9ydHNMb2NhbFN0b3JhZ2UgfSBmcm9tICcuL2xpYi9sb2NhbC1zdG9yYWdlJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgTG9jYWxTdG9yYWdlU291cmNlU2V0dGluZ3MgZXh0ZW5kcyBTb3VyY2VTZXR0aW5ncyB7XHJcbiAgZGVsaW1pdGVyPzogc3RyaW5nO1xyXG4gIG5hbWVzcGFjZT86IHN0cmluZztcclxufVxyXG5cclxuLyoqXHJcbiAqIFNvdXJjZSBmb3Igc3RvcmluZyBkYXRhIGluIGxvY2FsU3RvcmFnZS5cclxuICpcclxuICogQGNsYXNzIExvY2FsU3RvcmFnZVNvdXJjZVxyXG4gKiBAZXh0ZW5kcyBTb3VyY2VcclxuICovXHJcbkBwdWxsYWJsZVxyXG5AcHVzaGFibGVcclxuQHN5bmNhYmxlXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvY2FsU3RvcmFnZVNvdXJjZSBleHRlbmRzIFNvdXJjZSBpbXBsZW1lbnRzIFB1bGxhYmxlLCBQdXNoYWJsZSwgUmVzZXR0YWJsZSwgU3luY2FibGUge1xyXG4gIHByb3RlY3RlZCBfbmFtZXNwYWNlOiBzdHJpbmc7XHJcbiAgcHJvdGVjdGVkIF9kZWxpbWl0ZXI6IHN0cmluZztcclxuXHJcbiAgLy8gU3luY2FibGUgaW50ZXJmYWNlIHN0dWJzXHJcbiAgc3luYzogKHRyYW5zZm9ybU9yVHJhbnNmb3JtczogVHJhbnNmb3JtIHwgVHJhbnNmb3JtW10pID0+IFByb21pc2U8dm9pZD47XHJcblxyXG4gIC8vIFB1bGxhYmxlIGludGVyZmFjZSBzdHVic1xyXG4gIHB1bGw6IChxdWVyeU9yRXhwcmVzc2lvbjogUXVlcnlPckV4cHJlc3Npb24sIG9wdGlvbnM/OiBvYmplY3QsIGlkPzogc3RyaW5nKSA9PiBQcm9taXNlPFRyYW5zZm9ybVtdPjtcclxuXHJcbiAgLy8gUHVzaGFibGUgaW50ZXJmYWNlIHN0dWJzXHJcbiAgcHVzaDogKHRyYW5zZm9ybU9yT3BlcmF0aW9uczogVHJhbnNmb3JtT3JPcGVyYXRpb25zLCBvcHRpb25zPzogb2JqZWN0LCBpZD86IHN0cmluZykgPT4gUHJvbWlzZTxUcmFuc2Zvcm1bXT47XHJcblxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZSBhIG5ldyBMb2NhbFN0b3JhZ2VTb3VyY2UuXHJcbiAgICpcclxuICAgKiBAY29uc3RydWN0b3JcclxuICAgKiBAcGFyYW0ge09iamVjdH0gW3NldHRpbmdzXSAgICAgICAgICAgU2V0dGluZ3MuXHJcbiAgICogQHBhcmFtIHtTY2hlbWF9IFtzZXR0aW5ncy5zY2hlbWFdICAgIFNjaGVtYSBmb3Igc291cmNlLlxyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbc2V0dGluZ3MubmFtZXNwYWNlXSBPcHRpb25hbC4gUHJlZml4IGZvciBrZXlzIHVzZWQgaW4gbG9jYWxTdG9yYWdlLiBEZWZhdWx0cyB0byAnb3JiaXQnLlxyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbc2V0dGluZ3MuZGVsaW1pdGVyXSBPcHRpb25hbC4gRGVsaW1pdGVyIHVzZWQgdG8gc2VwYXJhdGUga2V5IHNlZ21lbnRzIGluIGxvY2FsU3RvcmFnZS4gRGVmYXVsdHMgdG8gJy8nLlxyXG4gICAqL1xyXG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzOiBMb2NhbFN0b3JhZ2VTb3VyY2VTZXR0aW5ncyA9IHt9KSB7XHJcbiAgICBhc3NlcnQoJ0xvY2FsU3RvcmFnZVNvdXJjZVxcJ3MgYHNjaGVtYWAgbXVzdCBiZSBzcGVjaWZpZWQgaW4gYHNldHRpbmdzLnNjaGVtYWAgY29uc3RydWN0b3IgYXJndW1lbnQnLCAhIXNldHRpbmdzLnNjaGVtYSk7XHJcbiAgICBhc3NlcnQoJ1lvdXIgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IGxvY2FsIHN0b3JhZ2UhJywgc3VwcG9ydHNMb2NhbFN0b3JhZ2UoKSk7XHJcblxyXG4gICAgc2V0dGluZ3MubmFtZSA9IHNldHRpbmdzLm5hbWUgfHwgJ2xvY2FsU3RvcmFnZSc7XHJcblxyXG4gICAgc3VwZXIoc2V0dGluZ3MpO1xyXG5cclxuICAgIHRoaXMuX25hbWVzcGFjZSA9IHNldHRpbmdzLm5hbWVzcGFjZSB8fCAnb3JiaXQnO1xyXG4gICAgdGhpcy5fZGVsaW1pdGVyID0gc2V0dGluZ3MuZGVsaW1pdGVyIHx8ICcvJztcclxuICB9XHJcblxyXG4gIGdldCBuYW1lc3BhY2UoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLl9uYW1lc3BhY2U7XHJcbiAgfVxyXG5cclxuICBnZXQgZGVsaW1pdGVyKCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5fZGVsaW1pdGVyO1xyXG4gIH1cclxuXHJcbiAgZ2V0S2V5Rm9yUmVjb3JkKHJlY29yZDogUmVjb3JkSWRlbnRpdHkgfCBSZWNvcmQpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIFt0aGlzLm5hbWVzcGFjZSwgcmVjb3JkLnR5cGUsIHJlY29yZC5pZF0uam9pbih0aGlzLmRlbGltaXRlcik7XHJcbiAgfVxyXG5cclxuICBnZXRSZWNvcmQocmVjb3JkOiBSZWNvcmRJZGVudGl0eSk6IFJlY29yZCB7XHJcbiAgICBjb25zdCBrZXkgPSB0aGlzLmdldEtleUZvclJlY29yZChyZWNvcmQpO1xyXG5cclxuICAgIGxldCByZXN1bHQgPSBKU09OLnBhcnNlKE9yYml0Lmdsb2JhbHMubG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KSk7XHJcblxyXG4gICAgaWYgKHRoaXMuX2tleU1hcCkge1xyXG4gICAgICB0aGlzLl9rZXlNYXAucHVzaFJlY29yZChyZXN1bHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxuICBwdXRSZWNvcmQocmVjb3JkOiBSZWNvcmQpOiB2b2lkIHtcclxuICAgIGNvbnN0IGtleSA9IHRoaXMuZ2V0S2V5Rm9yUmVjb3JkKHJlY29yZCk7XHJcblxyXG4gICAgLy8gY29uc29sZS5sb2coJ0xvY2FsU3RvcmFnZVNvdXJjZSNwdXRSZWNvcmQnLCBrZXksIEpTT04uc3RyaW5naWZ5KHJlY29yZCkpO1xyXG5cclxuICAgIGlmICh0aGlzLl9rZXlNYXApIHtcclxuICAgICAgdGhpcy5fa2V5TWFwLnB1c2hSZWNvcmQocmVjb3JkKTtcclxuICAgIH1cclxuXHJcbiAgICBPcmJpdC5nbG9iYWxzLmxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkocmVjb3JkKSk7XHJcbiAgfVxyXG5cclxuICByZW1vdmVSZWNvcmQocmVjb3JkOiBSZWNvcmRJZGVudGl0eSk6IHZvaWQge1xyXG4gICAgY29uc3Qga2V5ID0gdGhpcy5nZXRLZXlGb3JSZWNvcmQocmVjb3JkKTtcclxuXHJcbiAgICAvLyBjb25zb2xlLmxvZygnTG9jYWxTdG9yYWdlU291cmNlI3JlbW92ZVJlY29yZCcsIGtleSwgSlNPTi5zdHJpbmdpZnkocmVjb3JkKSk7XHJcblxyXG4gICAgT3JiaXQuZ2xvYmFscy5sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShrZXkpO1xyXG4gIH1cclxuXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAvLyBSZXNldHRhYmxlIGludGVyZmFjZSBpbXBsZW1lbnRhdGlvblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIHJlc2V0KCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgZm9yIChsZXQga2V5IGluIE9yYml0Lmdsb2JhbHMubG9jYWxTdG9yYWdlKSB7XHJcbiAgICAgIGlmIChrZXkuaW5kZXhPZih0aGlzLm5hbWVzcGFjZSkgPT09IDApIHtcclxuICAgICAgICBPcmJpdC5nbG9iYWxzLmxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGtleSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKTtcclxuICB9XHJcblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgLy8gU3luY2FibGUgaW50ZXJmYWNlIGltcGxlbWVudGF0aW9uXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgX3N5bmModHJhbnNmb3JtOiBUcmFuc2Zvcm0pOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHRoaXMuX2FwcGx5VHJhbnNmb3JtKHRyYW5zZm9ybSk7XHJcbiAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgfVxyXG5cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gIC8vIFB1c2hhYmxlIGludGVyZmFjZSBpbXBsZW1lbnRhdGlvblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIF9wdXNoKHRyYW5zZm9ybTogVHJhbnNmb3JtKTogUHJvbWlzZTxUcmFuc2Zvcm1bXT4ge1xyXG4gICAgdGhpcy5fYXBwbHlUcmFuc2Zvcm0odHJhbnNmb3JtKTtcclxuICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUoW3RyYW5zZm9ybV0pO1xyXG4gIH1cclxuXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAvLyBQdWxsYWJsZSBpbXBsZW1lbnRhdGlvblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIF9wdWxsKHF1ZXJ5OiBRdWVyeSk6IFByb21pc2U8VHJhbnNmb3JtW10+IHtcclxuICAgIGNvbnN0IG9wZXJhdG9yOiBQdWxsT3BlcmF0b3IgPSBQdWxsT3BlcmF0b3JzW3F1ZXJ5LmV4cHJlc3Npb24ub3BdO1xyXG4gICAgaWYgKCFvcGVyYXRvcikge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0xvY2FsU3RvcmFnZVNvdXJjZSBkb2VzIG5vdCBzdXBwb3J0IHRoZSBgJHtxdWVyeS5leHByZXNzaW9uLm9wfWAgb3BlcmF0b3IgZm9yIHF1ZXJpZXMuJyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG9wZXJhdG9yKHRoaXMsIHF1ZXJ5LmV4cHJlc3Npb24pO1xyXG4gIH1cclxuXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAvLyBQcm90ZWN0ZWRcclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICBwcm90ZWN0ZWQgX2FwcGx5VHJhbnNmb3JtKHRyYW5zZm9ybTogVHJhbnNmb3JtKTogdm9pZCB7XHJcbiAgICB0cmFuc2Zvcm0ub3BlcmF0aW9ucy5mb3JFYWNoKG9wZXJhdGlvbiA9PiB7XHJcbiAgICAgIHRyYW5zZm9ybU9wZXJhdG9yc1tvcGVyYXRpb24ub3BdKHRoaXMsIG9wZXJhdGlvbik7XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuIl19