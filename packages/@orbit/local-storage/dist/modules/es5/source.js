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
var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3JjL3NvdXJjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEscUJBV3FCO0FBQ3JCLHNCQUFzQztBQUN0QyxvQ0FBMkQ7QUFDM0QsK0JBQW1FO0FBQ25FLDhCQUEyRDtBQU8zRCxBQUtHOzs7Ozs7QUFJSDtBQUFnRCxrQ0FBTTtBQWFwRCxBQVFHOzs7Ozs7Ozs7QUFDSCxnQ0FBWSxBQUF5QztBQUF6QyxpQ0FBQTtBQUFBLHVCQUF5Qzs7QUFBckQsb0JBVUM7QUFUQyxnQkFBTSxPQUFDLEFBQTRGLDhGQUFFLENBQUMsQ0FBQyxBQUFRLFNBQUMsQUFBTSxBQUFDLEFBQUM7QUFDeEgsZ0JBQU0sT0FBQyxBQUE4QyxnREFBRSxnQkFBb0IsQUFBRSxBQUFDLEFBQUM7QUFFL0UsQUFBUSxpQkFBQyxBQUFJLE9BQUcsQUFBUSxTQUFDLEFBQUksUUFBSSxBQUFjLEFBQUM7QUFFaEQsZ0JBQUEsa0JBQU0sQUFBUSxBQUFDLGFBQUM7QUFFaEIsQUFBSSxjQUFDLEFBQVUsYUFBRyxBQUFRLFNBQUMsQUFBUyxhQUFJLEFBQU8sQUFBQztBQUNoRCxBQUFJLGNBQUMsQUFBVSxhQUFHLEFBQVEsU0FBQyxBQUFTLGFBQUksQUFBRyxBQUFDO2VBQzlDO0FBQUM7QUFFRCwwQkFBSSw4QkFBUzthQUFiO0FBQ0UsQUFBTSxtQkFBQyxBQUFJLEtBQUMsQUFBVSxBQUFDLEFBQ3pCO0FBQUM7O3NCQUFBOztBQUVELDBCQUFJLDhCQUFTO2FBQWI7QUFDRSxBQUFNLG1CQUFDLEFBQUksS0FBQyxBQUFVLEFBQUMsQUFDekI7QUFBQzs7c0JBQUE7O0FBRUQsaUNBQWUsa0JBQWYsVUFBZ0IsQUFBK0I7QUFDN0MsQUFBTSxlQUFDLENBQUMsQUFBSSxLQUFDLEFBQVMsV0FBRSxBQUFNLE9BQUMsQUFBSSxNQUFFLEFBQU0sT0FBQyxBQUFFLEFBQUMsSUFBQyxBQUFJ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O0FBRUQsQUFBTSxlQUFDLEFBQVEsU0FBQyxBQUFJLE1BQUUsQUFBSyxNQUFDLEFBQVUsQUFBQyxBQUFDLEFBQzFDO0FBQUM7QUFFRCxBQUE2RTtBQUM3RSxBQUFZO0FBQ1osQUFBNkU7QUFFbkUsaUNBQWUsa0JBQXpCLFVBQTBCLEFBQW9CO0FBQTlDLG9CQUlDO0FBSEMsQUFBUyxrQkFBQyxBQUFVLFdBQUMsQUFBTyxRQUFDLFVBQUEsQUFBUztBQUNwQyxrQ0FBa0IsUUFBQyxBQUFTLFVBQUMsQUFBRSxBQUFDLElBQUMsQUFBSSxPQUFFLEFBQVMsQUFBQyxBQUFDLEFBQ3BEO0FBQUMsQUFBQyxBQUFDLEFBQ0w7QUFBQztBQWxJa0IsQUFBa0IscUNBSHRDLE9BQVEsVUFDUixPQUFRLFVBQ1IsT0FBUSxXQUNZLEFBQWtCLEFBbUl0QztBQUFELFdBQUM7QUFuSUQsQUFtSUMsRUFuSStDLE9BQU0sQUFtSXJEO2tCQW5Jb0IsQUFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgT3JiaXQsIHtcclxuICBwdWxsYWJsZSwgUHVsbGFibGUsXHJcbiAgcHVzaGFibGUsIFB1c2hhYmxlLFxyXG4gIFJlc2V0dGFibGUsXHJcbiAgc3luY2FibGUsIFN5bmNhYmxlLFxyXG4gIFF1ZXJ5LFxyXG4gIFF1ZXJ5T3JFeHByZXNzaW9uLFxyXG4gIFJlY29yZCwgUmVjb3JkSWRlbnRpdHksXHJcbiAgU291cmNlLCBTb3VyY2VTZXR0aW5ncyxcclxuICBUcmFuc2Zvcm0sXHJcbiAgVHJhbnNmb3JtT3JPcGVyYXRpb25zXHJcbn0gZnJvbSAnQG9yYml0L2RhdGEnO1xyXG5pbXBvcnQgeyBhc3NlcnQgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xyXG5pbXBvcnQgdHJhbnNmb3JtT3BlcmF0b3JzIGZyb20gJy4vbGliL3RyYW5zZm9ybS1vcGVyYXRvcnMnO1xyXG5pbXBvcnQgeyBQdWxsT3BlcmF0b3IsIFB1bGxPcGVyYXRvcnMgfSBmcm9tICcuL2xpYi9wdWxsLW9wZXJhdG9ycyc7XHJcbmltcG9ydCB7IHN1cHBvcnRzTG9jYWxTdG9yYWdlIH0gZnJvbSAnLi9saWIvbG9jYWwtc3RvcmFnZSc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIExvY2FsU3RvcmFnZVNvdXJjZVNldHRpbmdzIGV4dGVuZHMgU291cmNlU2V0dGluZ3Mge1xyXG4gIGRlbGltaXRlcj86IHN0cmluZztcclxuICBuYW1lc3BhY2U/OiBzdHJpbmc7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTb3VyY2UgZm9yIHN0b3JpbmcgZGF0YSBpbiBsb2NhbFN0b3JhZ2UuXHJcbiAqXHJcbiAqIEBjbGFzcyBMb2NhbFN0b3JhZ2VTb3VyY2VcclxuICogQGV4dGVuZHMgU291cmNlXHJcbiAqL1xyXG5AcHVsbGFibGVcclxuQHB1c2hhYmxlXHJcbkBzeW5jYWJsZVxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMb2NhbFN0b3JhZ2VTb3VyY2UgZXh0ZW5kcyBTb3VyY2UgaW1wbGVtZW50cyBQdWxsYWJsZSwgUHVzaGFibGUsIFJlc2V0dGFibGUsIFN5bmNhYmxlIHtcclxuICBwcm90ZWN0ZWQgX25hbWVzcGFjZTogc3RyaW5nO1xyXG4gIHByb3RlY3RlZCBfZGVsaW1pdGVyOiBzdHJpbmc7XHJcblxyXG4gIC8vIFN5bmNhYmxlIGludGVyZmFjZSBzdHVic1xyXG4gIHN5bmM6ICh0cmFuc2Zvcm1PclRyYW5zZm9ybXM6IFRyYW5zZm9ybSB8IFRyYW5zZm9ybVtdKSA9PiBQcm9taXNlPHZvaWQ+O1xyXG5cclxuICAvLyBQdWxsYWJsZSBpbnRlcmZhY2Ugc3R1YnNcclxuICBwdWxsOiAocXVlcnlPckV4cHJlc3Npb246IFF1ZXJ5T3JFeHByZXNzaW9uLCBvcHRpb25zPzogb2JqZWN0LCBpZD86IHN0cmluZykgPT4gUHJvbWlzZTxUcmFuc2Zvcm1bXT47XHJcblxyXG4gIC8vIFB1c2hhYmxlIGludGVyZmFjZSBzdHVic1xyXG4gIHB1c2g6ICh0cmFuc2Zvcm1Pck9wZXJhdGlvbnM6IFRyYW5zZm9ybU9yT3BlcmF0aW9ucywgb3B0aW9ucz86IG9iamVjdCwgaWQ/OiBzdHJpbmcpID0+IFByb21pc2U8VHJhbnNmb3JtW10+O1xyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGUgYSBuZXcgTG9jYWxTdG9yYWdlU291cmNlLlxyXG4gICAqXHJcbiAgICogQGNvbnN0cnVjdG9yXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IFtzZXR0aW5nc10gICAgICAgICAgIFNldHRpbmdzLlxyXG4gICAqIEBwYXJhbSB7U2NoZW1hfSBbc2V0dGluZ3Muc2NoZW1hXSAgICBTY2hlbWEgZm9yIHNvdXJjZS5cclxuICAgKiBAcGFyYW0ge1N0cmluZ30gW3NldHRpbmdzLm5hbWVzcGFjZV0gT3B0aW9uYWwuIFByZWZpeCBmb3Iga2V5cyB1c2VkIGluIGxvY2FsU3RvcmFnZS4gRGVmYXVsdHMgdG8gJ29yYml0Jy5cclxuICAgKiBAcGFyYW0ge1N0cmluZ30gW3NldHRpbmdzLmRlbGltaXRlcl0gT3B0aW9uYWwuIERlbGltaXRlciB1c2VkIHRvIHNlcGFyYXRlIGtleSBzZWdtZW50cyBpbiBsb2NhbFN0b3JhZ2UuIERlZmF1bHRzIHRvICcvJy5cclxuICAgKi9cclxuICBjb25zdHJ1Y3RvcihzZXR0aW5nczogTG9jYWxTdG9yYWdlU291cmNlU2V0dGluZ3MgPSB7fSkge1xyXG4gICAgYXNzZXJ0KCdMb2NhbFN0b3JhZ2VTb3VyY2VcXCdzIGBzY2hlbWFgIG11c3QgYmUgc3BlY2lmaWVkIGluIGBzZXR0aW5ncy5zY2hlbWFgIGNvbnN0cnVjdG9yIGFyZ3VtZW50JywgISFzZXR0aW5ncy5zY2hlbWEpO1xyXG4gICAgYXNzZXJ0KCdZb3VyIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCBsb2NhbCBzdG9yYWdlIScsIHN1cHBvcnRzTG9jYWxTdG9yYWdlKCkpO1xyXG5cclxuICAgIHNldHRpbmdzLm5hbWUgPSBzZXR0aW5ncy5uYW1lIHx8ICdsb2NhbFN0b3JhZ2UnO1xyXG5cclxuICAgIHN1cGVyKHNldHRpbmdzKTtcclxuXHJcbiAgICB0aGlzLl9uYW1lc3BhY2UgPSBzZXR0aW5ncy5uYW1lc3BhY2UgfHwgJ29yYml0JztcclxuICAgIHRoaXMuX2RlbGltaXRlciA9IHNldHRpbmdzLmRlbGltaXRlciB8fCAnLyc7XHJcbiAgfVxyXG5cclxuICBnZXQgbmFtZXNwYWNlKCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5fbmFtZXNwYWNlO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGRlbGltaXRlcigpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMuX2RlbGltaXRlcjtcclxuICB9XHJcblxyXG4gIGdldEtleUZvclJlY29yZChyZWNvcmQ6IFJlY29yZElkZW50aXR5IHwgUmVjb3JkKTogc3RyaW5nIHtcclxuICAgIHJldHVybiBbdGhpcy5uYW1lc3BhY2UsIHJlY29yZC50eXBlLCByZWNvcmQuaWRdLmpvaW4odGhpcy5kZWxpbWl0ZXIpO1xyXG4gIH1cclxuXHJcbiAgZ2V0UmVjb3JkKHJlY29yZDogUmVjb3JkSWRlbnRpdHkpOiBSZWNvcmQge1xyXG4gICAgY29uc3Qga2V5ID0gdGhpcy5nZXRLZXlGb3JSZWNvcmQocmVjb3JkKTtcclxuXHJcbiAgICBsZXQgcmVzdWx0ID0gSlNPTi5wYXJzZShPcmJpdC5nbG9iYWxzLmxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSkpO1xyXG5cclxuICAgIGlmICh0aGlzLl9rZXlNYXApIHtcclxuICAgICAgdGhpcy5fa2V5TWFwLnB1c2hSZWNvcmQocmVzdWx0KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbiAgcHV0UmVjb3JkKHJlY29yZDogUmVjb3JkKTogdm9pZCB7XHJcbiAgICBjb25zdCBrZXkgPSB0aGlzLmdldEtleUZvclJlY29yZChyZWNvcmQpO1xyXG5cclxuICAgIC8vIGNvbnNvbGUubG9nKCdMb2NhbFN0b3JhZ2VTb3VyY2UjcHV0UmVjb3JkJywga2V5LCBKU09OLnN0cmluZ2lmeShyZWNvcmQpKTtcclxuXHJcbiAgICBpZiAodGhpcy5fa2V5TWFwKSB7XHJcbiAgICAgIHRoaXMuX2tleU1hcC5wdXNoUmVjb3JkKHJlY29yZCk7XHJcbiAgICB9XHJcblxyXG4gICAgT3JiaXQuZ2xvYmFscy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KHJlY29yZCkpO1xyXG4gIH1cclxuXHJcbiAgcmVtb3ZlUmVjb3JkKHJlY29yZDogUmVjb3JkSWRlbnRpdHkpOiB2b2lkIHtcclxuICAgIGNvbnN0IGtleSA9IHRoaXMuZ2V0S2V5Rm9yUmVjb3JkKHJlY29yZCk7XHJcblxyXG4gICAgLy8gY29uc29sZS5sb2coJ0xvY2FsU3RvcmFnZVNvdXJjZSNyZW1vdmVSZWNvcmQnLCBrZXksIEpTT04uc3RyaW5naWZ5KHJlY29yZCkpO1xyXG5cclxuICAgIE9yYml0Lmdsb2JhbHMubG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oa2V5KTtcclxuICB9XHJcblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgLy8gUmVzZXR0YWJsZSBpbnRlcmZhY2UgaW1wbGVtZW50YXRpb25cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICByZXNldCgpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIGZvciAobGV0IGtleSBpbiBPcmJpdC5nbG9iYWxzLmxvY2FsU3RvcmFnZSkge1xyXG4gICAgICBpZiAoa2V5LmluZGV4T2YodGhpcy5uYW1lc3BhY2UpID09PSAwKSB7XHJcbiAgICAgICAgT3JiaXQuZ2xvYmFscy5sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShrZXkpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgfVxyXG5cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gIC8vIFN5bmNhYmxlIGludGVyZmFjZSBpbXBsZW1lbnRhdGlvblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIF9zeW5jKHRyYW5zZm9ybTogVHJhbnNmb3JtKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICB0aGlzLl9hcHBseVRyYW5zZm9ybSh0cmFuc2Zvcm0pO1xyXG4gICAgcmV0dXJuIE9yYml0LlByb21pc2UucmVzb2x2ZSgpO1xyXG4gIH1cclxuXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAvLyBQdXNoYWJsZSBpbnRlcmZhY2UgaW1wbGVtZW50YXRpb25cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICBfcHVzaCh0cmFuc2Zvcm06IFRyYW5zZm9ybSk6IFByb21pc2U8VHJhbnNmb3JtW10+IHtcclxuICAgIHRoaXMuX2FwcGx5VHJhbnNmb3JtKHRyYW5zZm9ybSk7XHJcbiAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKFt0cmFuc2Zvcm1dKTtcclxuICB9XHJcblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgLy8gUHVsbGFibGUgaW1wbGVtZW50YXRpb25cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICBfcHVsbChxdWVyeTogUXVlcnkpOiBQcm9taXNlPFRyYW5zZm9ybVtdPiB7XHJcbiAgICBjb25zdCBvcGVyYXRvcjogUHVsbE9wZXJhdG9yID0gUHVsbE9wZXJhdG9yc1txdWVyeS5leHByZXNzaW9uLm9wXTtcclxuICAgIGlmICghb3BlcmF0b3IpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdMb2NhbFN0b3JhZ2VTb3VyY2UgZG9lcyBub3Qgc3VwcG9ydCB0aGUgYCR7cXVlcnkuZXhwcmVzc2lvbi5vcH1gIG9wZXJhdG9yIGZvciBxdWVyaWVzLicpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBvcGVyYXRvcih0aGlzLCBxdWVyeS5leHByZXNzaW9uKTtcclxuICB9XHJcblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgLy8gUHJvdGVjdGVkXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgcHJvdGVjdGVkIF9hcHBseVRyYW5zZm9ybSh0cmFuc2Zvcm06IFRyYW5zZm9ybSk6IHZvaWQge1xyXG4gICAgdHJhbnNmb3JtLm9wZXJhdGlvbnMuZm9yRWFjaChvcGVyYXRpb24gPT4ge1xyXG4gICAgICB0cmFuc2Zvcm1PcGVyYXRvcnNbb3BlcmF0aW9uLm9wXSh0aGlzLCBvcGVyYXRpb24pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==