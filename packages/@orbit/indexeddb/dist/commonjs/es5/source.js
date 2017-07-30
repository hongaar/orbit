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
var indexeddb_1 = require("./lib/indexeddb");
/**
 * Source for storing data in IndexedDB.
 *
 * @class IndexedDBSource
 * @extends Source
 */
var IndexedDBSource = function (_super) {
    __extends(IndexedDBSource, _super);
    /**
     * Create a new IndexedDBSource.
     *
     * @constructor
     * @param {Object}  [settings = {}]
     * @param {Schema}  [settings.schema]    Orbit Schema.
     * @param {String}  [settings.name]      Optional. Name for source. Defaults to 'indexedDB'.
     * @param {String}  [settings.namespace] Optional. Namespace of the application. Will be used for the IndexedDB database name. Defaults to 'orbit'.
     */
    function IndexedDBSource(settings) {
        if (settings === void 0) {
            settings = {};
        }
        var _this = this;
        utils_1.assert('IndexedDBSource\'s `schema` must be specified in `settings.schema` constructor argument', !!settings.schema);
        utils_1.assert('Your browser does not support IndexedDB!', indexeddb_1.supportsIndexedDB());
        settings.name = settings.name || 'indexedDB';
        _this = _super.call(this, settings) || this;
        _this._namespace = settings.namespace || 'orbit';
        _this.schema.on('upgrade', function () {
            return _this.reopenDB();
        });
        return _this;
    }
    Object.defineProperty(IndexedDBSource.prototype, "dbVersion", {
        /**
         * The version to specify when opening the IndexedDB database.
         *
         * @return {Integer} Version number.
         */
        get: function () {
            return this._schema.version;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IndexedDBSource.prototype, "dbName", {
        /**
         * IndexedDB database name.
         *
         * Defaults to the namespace of the app, which can be overridden in the constructor.
         *
         * @return {String} Database name.
         */
        get: function () {
            return this._namespace;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IndexedDBSource.prototype, "isDBOpen", {
        get: function () {
            return !!this._db;
        },
        enumerable: true,
        configurable: true
    });
    IndexedDBSource.prototype.openDB = function () {
        var _this = this;
        return new data_1.default.Promise(function (resolve, reject) {
            if (_this._db) {
                resolve(_this._db);
            } else {
                var request_1 = data_1.default.globals.indexedDB.open(_this.dbName, _this.dbVersion);
                request_1.onerror = function () {
                    // console.error('error opening indexedDB', this.dbName);
                    reject(request_1.error);
                };
                request_1.onsuccess = function () {
                    // console.log('success opening indexedDB', this.dbName);
                    var db = _this._db = request_1.result;
                    resolve(db);
                };
                request_1.onupgradeneeded = function (event) {
                    // console.log('indexedDB upgrade needed');
                    var db = _this._db = event.target.result;
                    if (event && event.oldVersion > 0) {
                        _this.migrateDB(db, event);
                    } else {
                        _this.createDB(db);
                    }
                };
            }
        });
    };
    IndexedDBSource.prototype.closeDB = function () {
        if (this.isDBOpen) {
            this._db.close();
            this._db = null;
        }
    };
    IndexedDBSource.prototype.reopenDB = function () {
        this.closeDB();
        return this.openDB();
    };
    IndexedDBSource.prototype.createDB = function (db) {
        var _this = this;
        // console.log('createDB');
        Object.keys(this.schema.models).forEach(function (model) {
            _this.registerModel(db, model);
        });
    };
    /**
     * Migrate database.
     *
     * @param  {IDBDatabase} db              Database to upgrade.
     * @param  {IDBVersionChangeEvent} event Event resulting from version change.
     */
    IndexedDBSource.prototype.migrateDB = function (db, event) {
        console.error('IndexedDBSource#migrateDB - should be overridden to upgrade IDBDatabase from: ', event.oldVersion, ' -> ', event.newVersion);
    };
    IndexedDBSource.prototype.deleteDB = function () {
        var _this = this;
        this.closeDB();
        return new data_1.default.Promise(function (resolve, reject) {
            var request = data_1.default.globals.indexedDB.deleteDatabase(_this.dbName);
            request.onerror = function () {
                // console.error('error deleting indexedDB', this.dbName);
                reject(request.error);
            };
            request.onsuccess = function () {
                // console.log('success deleting indexedDB', this.dbName);
                resolve();
            };
        });
    };
    IndexedDBSource.prototype.registerModel = function (db, model) {
        // console.log('registerModel', model);
        db.createObjectStore(model, { keyPath: 'id' });
        // TODO - create indices
    };
    IndexedDBSource.prototype.getRecord = function (record) {
        var _this = this;
        return new data_1.default.Promise(function (resolve, reject) {
            var transaction = _this._db.transaction([record.type]);
            var objectStore = transaction.objectStore(record.type);
            var request = objectStore.get(record.id);
            request.onerror = function () {
                console.error('error - getRecord', request.error);
                reject(request.error);
            };
            request.onsuccess = function () {
                // console.log('success - getRecord', request.result);
                var record = request.result;
                if (_this._keyMap) {
                    _this._keyMap.pushRecord(record);
                }
                resolve(record);
            };
        });
    };
    IndexedDBSource.prototype.getRecords = function (type) {
        var _this = this;
        return new data_1.default.Promise(function (resolve, reject) {
            var transaction = _this._db.transaction([type]);
            var objectStore = transaction.objectStore(type);
            var request = objectStore.openCursor();
            var records = [];
            request.onerror = function () {
                console.error('error - getRecords', request.error);
                reject(request.error);
            };
            request.onsuccess = function (event) {
                // console.log('success - getRecords', request.result);
                var cursor = event.target.result;
                if (cursor) {
                    var record = cursor.value;
                    if (_this._keyMap) {
                        _this._keyMap.pushRecord(record);
                    }
                    records.push(record);
                    cursor.continue();
                } else {
                    resolve(records);
                }
            };
        });
    };
    Object.defineProperty(IndexedDBSource.prototype, "availableTypes", {
        get: function () {
            var objectStoreNames = this._db.objectStoreNames;
            var types = [];
            for (var i = 0; i < objectStoreNames.length; i++) {
                types.push(objectStoreNames.item(i));
            }
            return types;
        },
        enumerable: true,
        configurable: true
    });
    IndexedDBSource.prototype.putRecord = function (record) {
        var _this = this;
        var transaction = this._db.transaction([record.type], 'readwrite');
        var objectStore = transaction.objectStore(record.type);
        return new data_1.default.Promise(function (resolve, reject) {
            var request = objectStore.put(record);
            request.onerror = function () {
                console.error('error - putRecord', request.error);
                reject(request.error);
            };
            request.onsuccess = function () {
                // console.log('success - putRecord');
                if (_this._keyMap) {
                    _this._keyMap.pushRecord(record);
                }
                resolve();
            };
        });
    };
    IndexedDBSource.prototype.removeRecord = function (record) {
        var _this = this;
        return new data_1.default.Promise(function (resolve, reject) {
            var transaction = _this._db.transaction([record.type], 'readwrite');
            var objectStore = transaction.objectStore(record.type);
            var request = objectStore.delete(record.id);
            request.onerror = function () {
                console.error('error - removeRecord', request.error);
                reject(request.error);
            };
            request.onsuccess = function () {
                // console.log('success - removeRecord');
                resolve();
            };
        });
    };
    IndexedDBSource.prototype.clearRecords = function (type) {
        var _this = this;
        if (!this._db) {
            return data_1.default.Promise.resolve();
        }
        return new data_1.default.Promise(function (resolve, reject) {
            var transaction = _this._db.transaction([type], 'readwrite');
            var objectStore = transaction.objectStore(type);
            var request = objectStore.clear();
            request.onerror = function () {
                console.error('error - removeRecords', request.error);
                reject(request.error);
            };
            request.onsuccess = function () {
                // console.log('success - removeRecords');
                resolve();
            };
        });
    };
    /////////////////////////////////////////////////////////////////////////////
    // Resettable interface implementation
    /////////////////////////////////////////////////////////////////////////////
    IndexedDBSource.prototype.reset = function () {
        return this.deleteDB();
    };
    /////////////////////////////////////////////////////////////////////////////
    // Syncable interface implementation
    /////////////////////////////////////////////////////////////////////////////
    IndexedDBSource.prototype._sync = function (transform) {
        return this._processTransform(transform);
    };
    /////////////////////////////////////////////////////////////////////////////
    // Pushable interface implementation
    /////////////////////////////////////////////////////////////////////////////
    IndexedDBSource.prototype._push = function (transform) {
        return this._processTransform(transform).then(function () {
            return [transform];
        });
    };
    /////////////////////////////////////////////////////////////////////////////
    // Pullable implementation
    /////////////////////////////////////////////////////////////////////////////
    IndexedDBSource.prototype._pull = function (query) {
        var _this = this;
        var operator = pull_operators_1.PullOperators[query.expression.op];
        if (!operator) {
            throw new Error('IndexedDBSource does not support the `${query.expression.op}` operator for queries.');
        }
        return this.openDB().then(function () {
            return operator(_this, query.expression);
        });
    };
    /////////////////////////////////////////////////////////////////////////////
    // Private
    /////////////////////////////////////////////////////////////////////////////
    IndexedDBSource.prototype._processTransform = function (transform) {
        var _this = this;
        return this.openDB().then(function () {
            var result = data_1.default.Promise.resolve();
            transform.operations.forEach(function (operation) {
                var processor = transform_operators_1.default[operation.op];
                result = result.then(function () {
                    return processor(_this, operation);
                });
            });
            return result;
        });
    };
    IndexedDBSource = __decorate([data_1.pullable, data_1.pushable, data_1.syncable], IndexedDBSource);
    return IndexedDBSource;
}(data_1.Source);
exports.default = IndexedDBSource;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3JjL3NvdXJjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxxQkFXcUI7QUFDckIsc0JBQXNDO0FBQ3RDLG9DQUEyRDtBQUMzRCwrQkFBbUU7QUFDbkUsMEJBQW9EO0FBUXBELEFBS0c7Ozs7OztBQUlILHdDQUE2QzsrQkFBTSxBQWFqRCxBQVFHO0FBQ0g7Ozs7Ozs7Ozs2QkFBWSxBQUFzQyxVQUF0QztpQ0FBQTt1QkFBc0M7QUFBbEQ7b0JBQ0UsQUFVRDtnQkFWTyxPQUFDLEFBQXlGLDJGQUFFLENBQUMsQ0FBQyxBQUFRLFNBQUMsQUFBTSxBQUFDLEFBQUMsQUFDckg7Z0JBQU0sT0FBQyxBQUEwQyw0Q0FBRSxZQUFpQixBQUFFLEFBQUMsQUFBQyxBQUV4RSxBQUFRO2lCQUFDLEFBQUksT0FBRyxBQUFRLFNBQUMsQUFBSSxRQUFJLEFBQVcsQUFBQyxBQUU3QztnQkFBQSxrQkFBTSxBQUFRLEFBQUMsYUFBQyxBQUVoQixBQUFJO2NBQUMsQUFBVSxhQUFHLEFBQVEsU0FBQyxBQUFTLGFBQUksQUFBTyxBQUFDLEFBRWhELEFBQUk7Y0FBQyxBQUFNLE9BQUMsQUFBRSxHQUFDLEFBQVMsV0FBRSxZQUFNO21CQUFBLEFBQUksTUFBSixBQUFLLEFBQVEsQUFBRSxBQUFDLEFBQUM7O2VBQ25ELEFBQUM7QUFPRDswQkFBSSwyQkFBUzs7Ozs7O2FBQWIsWUFDRSxBQUFNO21CQUFDLEFBQUksS0FBQyxBQUFPLFFBQUMsQUFBTyxBQUFDLEFBQzlCLEFBQUM7OztzQkFBQSxBQVNEO0FBaEJBLEFBSUc7MEJBWUMsMkJBQU07Ozs7Ozs7O2FBQVYsWUFDRSxBQUFNO21CQUFDLEFBQUksS0FBQyxBQUFVLEFBQUMsQUFDekIsQUFBQzs7O3NCQUFBLEFBRUQ7QUFYQSxBQU1HOzBCQUtDLDJCQUFRO2FBQVosWUFDRSxBQUFN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QUFDLEFBQUUsQUFBQyxBQUFDLEFBQ2pELEFBQU07Z0NBQVUsQUFBSSxLQUFDLFlBQU07MkJBQUEsQUFBUyxVQUFDLEFBQUksT0FBZCxBQUFnQixBQUFTLEFBQUMsQUFBQyxBQUFDLEFBQ3pEO0FBRFcsQUFBTSxBQUNoQixBQUFDLEFBQUM7QUFFSCxBQUFNO21CQUFDLEFBQU0sQUFBQyxBQUNoQixBQUFDLEFBQUMsQUFBQyxBQUNQO0FBWFMsQUFBSSxBQVdaO0FBdlVrQixBQUFlO2tDQUhuQyxPQUFRLFVBQ1IsT0FBUSxVQUNSLE9BQVEsV0FDWSxBQUFlLEFBd1VwQyxBQUFDO1dBeFVELEFBd1VDO0VBeFU0QyxPQUFNLEFBd1VsRDtrQkF4VW9CLEFBQWUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgT3JiaXQsIHtcclxuICBwdWxsYWJsZSwgUHVsbGFibGUsXHJcbiAgcHVzaGFibGUsIFB1c2hhYmxlLFxyXG4gIFJlc2V0dGFibGUsXHJcbiAgc3luY2FibGUsIFN5bmNhYmxlLFxyXG4gIFF1ZXJ5LFxyXG4gIFF1ZXJ5T3JFeHByZXNzaW9uLFxyXG4gIFJlY29yZCwgUmVjb3JkSWRlbnRpdHksXHJcbiAgU291cmNlLCBTb3VyY2VTZXR0aW5ncyxcclxuICBUcmFuc2Zvcm0sXHJcbiAgVHJhbnNmb3JtT3JPcGVyYXRpb25zXHJcbn0gZnJvbSAnQG9yYml0L2RhdGEnO1xyXG5pbXBvcnQgeyBhc3NlcnQgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xyXG5pbXBvcnQgdHJhbnNmb3JtT3BlcmF0b3JzIGZyb20gJy4vbGliL3RyYW5zZm9ybS1vcGVyYXRvcnMnO1xyXG5pbXBvcnQgeyBQdWxsT3BlcmF0b3IsIFB1bGxPcGVyYXRvcnMgfSBmcm9tICcuL2xpYi9wdWxsLW9wZXJhdG9ycyc7XHJcbmltcG9ydCB7IHN1cHBvcnRzSW5kZXhlZERCIH0gZnJvbSAnLi9saWIvaW5kZXhlZGRiJztcclxuXHJcbmRlY2xhcmUgY29uc3QgY29uc29sZTogYW55O1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJbmRleGVkREJTb3VyY2VTZXR0aW5ncyBleHRlbmRzIFNvdXJjZVNldHRpbmdzIHtcclxuICBuYW1lc3BhY2U/OiBzdHJpbmc7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTb3VyY2UgZm9yIHN0b3JpbmcgZGF0YSBpbiBJbmRleGVkREIuXHJcbiAqXHJcbiAqIEBjbGFzcyBJbmRleGVkREJTb3VyY2VcclxuICogQGV4dGVuZHMgU291cmNlXHJcbiAqL1xyXG5AcHVsbGFibGVcclxuQHB1c2hhYmxlXHJcbkBzeW5jYWJsZVxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbmRleGVkREJTb3VyY2UgZXh0ZW5kcyBTb3VyY2UgaW1wbGVtZW50cyBQdWxsYWJsZSwgUHVzaGFibGUsIFJlc2V0dGFibGUsIFN5bmNhYmxlIHtcclxuICBwcm90ZWN0ZWQgX25hbWVzcGFjZTogc3RyaW5nO1xyXG4gIHByb3RlY3RlZCBfZGI6IGFueTtcclxuXHJcbiAgLy8gU3luY2FibGUgaW50ZXJmYWNlIHN0dWJzXHJcbiAgc3luYzogKHRyYW5zZm9ybU9yVHJhbnNmb3JtczogVHJhbnNmb3JtIHwgVHJhbnNmb3JtW10pID0+IFByb21pc2U8dm9pZD47XHJcblxyXG4gIC8vIFB1bGxhYmxlIGludGVyZmFjZSBzdHVic1xyXG4gIHB1bGw6IChxdWVyeU9yRXhwcmVzc2lvbjogUXVlcnlPckV4cHJlc3Npb24sIG9wdGlvbnM/OiBvYmplY3QsIGlkPzogc3RyaW5nKSA9PiBQcm9taXNlPFRyYW5zZm9ybVtdPjtcclxuXHJcbiAgLy8gUHVzaGFibGUgaW50ZXJmYWNlIHN0dWJzXHJcbiAgcHVzaDogKHRyYW5zZm9ybU9yT3BlcmF0aW9uczogVHJhbnNmb3JtT3JPcGVyYXRpb25zLCBvcHRpb25zPzogb2JqZWN0LCBpZD86IHN0cmluZykgPT4gUHJvbWlzZTxUcmFuc2Zvcm1bXT47XHJcblxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZSBhIG5ldyBJbmRleGVkREJTb3VyY2UuXHJcbiAgICpcclxuICAgKiBAY29uc3RydWN0b3JcclxuICAgKiBAcGFyYW0ge09iamVjdH0gIFtzZXR0aW5ncyA9IHt9XVxyXG4gICAqIEBwYXJhbSB7U2NoZW1hfSAgW3NldHRpbmdzLnNjaGVtYV0gICAgT3JiaXQgU2NoZW1hLlxyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSAgW3NldHRpbmdzLm5hbWVdICAgICAgT3B0aW9uYWwuIE5hbWUgZm9yIHNvdXJjZS4gRGVmYXVsdHMgdG8gJ2luZGV4ZWREQicuXHJcbiAgICogQHBhcmFtIHtTdHJpbmd9ICBbc2V0dGluZ3MubmFtZXNwYWNlXSBPcHRpb25hbC4gTmFtZXNwYWNlIG9mIHRoZSBhcHBsaWNhdGlvbi4gV2lsbCBiZSB1c2VkIGZvciB0aGUgSW5kZXhlZERCIGRhdGFiYXNlIG5hbWUuIERlZmF1bHRzIHRvICdvcmJpdCcuXHJcbiAgICovXHJcbiAgY29uc3RydWN0b3Ioc2V0dGluZ3M6IEluZGV4ZWREQlNvdXJjZVNldHRpbmdzID0ge30pIHtcclxuICAgIGFzc2VydCgnSW5kZXhlZERCU291cmNlXFwncyBgc2NoZW1hYCBtdXN0IGJlIHNwZWNpZmllZCBpbiBgc2V0dGluZ3Muc2NoZW1hYCBjb25zdHJ1Y3RvciBhcmd1bWVudCcsICEhc2V0dGluZ3Muc2NoZW1hKTtcclxuICAgIGFzc2VydCgnWW91ciBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgSW5kZXhlZERCIScsIHN1cHBvcnRzSW5kZXhlZERCKCkpO1xyXG5cclxuICAgIHNldHRpbmdzLm5hbWUgPSBzZXR0aW5ncy5uYW1lIHx8ICdpbmRleGVkREInO1xyXG5cclxuICAgIHN1cGVyKHNldHRpbmdzKTtcclxuXHJcbiAgICB0aGlzLl9uYW1lc3BhY2UgPSBzZXR0aW5ncy5uYW1lc3BhY2UgfHwgJ29yYml0JztcclxuXHJcbiAgICB0aGlzLnNjaGVtYS5vbigndXBncmFkZScsICgpID0+IHRoaXMucmVvcGVuREIoKSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBUaGUgdmVyc2lvbiB0byBzcGVjaWZ5IHdoZW4gb3BlbmluZyB0aGUgSW5kZXhlZERCIGRhdGFiYXNlLlxyXG4gICAqXHJcbiAgICogQHJldHVybiB7SW50ZWdlcn0gVmVyc2lvbiBudW1iZXIuXHJcbiAgICovXHJcbiAgZ2V0IGRiVmVyc2lvbigpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIHRoaXMuX3NjaGVtYS52ZXJzaW9uO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogSW5kZXhlZERCIGRhdGFiYXNlIG5hbWUuXHJcbiAgICpcclxuICAgKiBEZWZhdWx0cyB0byB0aGUgbmFtZXNwYWNlIG9mIHRoZSBhcHAsIHdoaWNoIGNhbiBiZSBvdmVycmlkZGVuIGluIHRoZSBjb25zdHJ1Y3Rvci5cclxuICAgKlxyXG4gICAqIEByZXR1cm4ge1N0cmluZ30gRGF0YWJhc2UgbmFtZS5cclxuICAgKi9cclxuICBnZXQgZGJOYW1lKCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5fbmFtZXNwYWNlO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGlzREJPcGVuKCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuICEhdGhpcy5fZGI7XHJcbiAgfVxyXG5cclxuICBvcGVuREIoKTogUHJvbWlzZTxhbnk+IHtcclxuICAgIHJldHVybiBuZXcgT3JiaXQuUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIGlmICh0aGlzLl9kYikge1xyXG4gICAgICAgIHJlc29sdmUodGhpcy5fZGIpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCByZXF1ZXN0ID0gT3JiaXQuZ2xvYmFscy5pbmRleGVkREIub3Blbih0aGlzLmRiTmFtZSwgdGhpcy5kYlZlcnNpb24pO1xyXG5cclxuICAgICAgICByZXF1ZXN0Lm9uZXJyb3IgPSAoLyogZXZlbnQgKi8pID0+IHtcclxuICAgICAgICAgIC8vIGNvbnNvbGUuZXJyb3IoJ2Vycm9yIG9wZW5pbmcgaW5kZXhlZERCJywgdGhpcy5kYk5hbWUpO1xyXG4gICAgICAgICAgcmVqZWN0KHJlcXVlc3QuZXJyb3IpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJlcXVlc3Qub25zdWNjZXNzID0gKC8qIGV2ZW50ICovKSA9PiB7XHJcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZygnc3VjY2VzcyBvcGVuaW5nIGluZGV4ZWREQicsIHRoaXMuZGJOYW1lKTtcclxuICAgICAgICAgIGNvbnN0IGRiID0gdGhpcy5fZGIgPSByZXF1ZXN0LnJlc3VsdDtcclxuICAgICAgICAgIHJlc29sdmUoZGIpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJlcXVlc3Qub251cGdyYWRlbmVlZGVkID0gKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZygnaW5kZXhlZERCIHVwZ3JhZGUgbmVlZGVkJyk7XHJcbiAgICAgICAgICBjb25zdCBkYiA9IHRoaXMuX2RiID0gZXZlbnQudGFyZ2V0LnJlc3VsdDtcclxuICAgICAgICAgIGlmIChldmVudCAmJiBldmVudC5vbGRWZXJzaW9uID4gMCkge1xyXG4gICAgICAgICAgICB0aGlzLm1pZ3JhdGVEQihkYiwgZXZlbnQpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jcmVhdGVEQihkYik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBjbG9zZURCKCk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMuaXNEQk9wZW4pIHtcclxuICAgICAgdGhpcy5fZGIuY2xvc2UoKTtcclxuICAgICAgdGhpcy5fZGIgPSBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVvcGVuREIoKTogUHJvbWlzZTxhbnk+IHtcclxuICAgIHRoaXMuY2xvc2VEQigpO1xyXG4gICAgcmV0dXJuIHRoaXMub3BlbkRCKCk7XHJcbiAgfVxyXG5cclxuICBjcmVhdGVEQihkYik6IHZvaWQge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2NyZWF0ZURCJyk7XHJcbiAgICBPYmplY3Qua2V5cyh0aGlzLnNjaGVtYS5tb2RlbHMpLmZvckVhY2gobW9kZWwgPT4ge1xyXG4gICAgICB0aGlzLnJlZ2lzdGVyTW9kZWwoZGIsIG1vZGVsKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTWlncmF0ZSBkYXRhYmFzZS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSAge0lEQkRhdGFiYXNlfSBkYiAgICAgICAgICAgICAgRGF0YWJhc2UgdG8gdXBncmFkZS5cclxuICAgKiBAcGFyYW0gIHtJREJWZXJzaW9uQ2hhbmdlRXZlbnR9IGV2ZW50IEV2ZW50IHJlc3VsdGluZyBmcm9tIHZlcnNpb24gY2hhbmdlLlxyXG4gICAqL1xyXG4gIG1pZ3JhdGVEQihkYiwgZXZlbnQpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoJ0luZGV4ZWREQlNvdXJjZSNtaWdyYXRlREIgLSBzaG91bGQgYmUgb3ZlcnJpZGRlbiB0byB1cGdyYWRlIElEQkRhdGFiYXNlIGZyb206ICcsIGV2ZW50Lm9sZFZlcnNpb24sICcgLT4gJywgZXZlbnQubmV3VmVyc2lvbik7XHJcbiAgfVxyXG5cclxuICBkZWxldGVEQigpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHRoaXMuY2xvc2VEQigpO1xyXG5cclxuICAgIHJldHVybiBuZXcgT3JiaXQuUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIGxldCByZXF1ZXN0ID0gT3JiaXQuZ2xvYmFscy5pbmRleGVkREIuZGVsZXRlRGF0YWJhc2UodGhpcy5kYk5hbWUpO1xyXG5cclxuICAgICAgcmVxdWVzdC5vbmVycm9yID0gKC8qIGV2ZW50ICovKSA9PiB7XHJcbiAgICAgICAgLy8gY29uc29sZS5lcnJvcignZXJyb3IgZGVsZXRpbmcgaW5kZXhlZERCJywgdGhpcy5kYk5hbWUpO1xyXG4gICAgICAgIHJlamVjdChyZXF1ZXN0LmVycm9yKTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHJlcXVlc3Qub25zdWNjZXNzID0gKC8qIGV2ZW50ICovKSA9PiB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3N1Y2Nlc3MgZGVsZXRpbmcgaW5kZXhlZERCJywgdGhpcy5kYk5hbWUpO1xyXG4gICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgfTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcmVnaXN0ZXJNb2RlbChkYiwgbW9kZWwpIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdyZWdpc3Rlck1vZGVsJywgbW9kZWwpO1xyXG4gICAgZGIuY3JlYXRlT2JqZWN0U3RvcmUobW9kZWwsIHsga2V5UGF0aDogJ2lkJyB9KTtcclxuICAgIC8vIFRPRE8gLSBjcmVhdGUgaW5kaWNlc1xyXG4gIH1cclxuXHJcbiAgZ2V0UmVjb3JkKHJlY29yZCk6IFByb21pc2U8UmVjb3JkPiB7XHJcbiAgICByZXR1cm4gbmV3IE9yYml0LlByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICBjb25zdCB0cmFuc2FjdGlvbiA9IHRoaXMuX2RiLnRyYW5zYWN0aW9uKFtyZWNvcmQudHlwZV0pO1xyXG4gICAgICBjb25zdCBvYmplY3RTdG9yZSA9IHRyYW5zYWN0aW9uLm9iamVjdFN0b3JlKHJlY29yZC50eXBlKTtcclxuICAgICAgY29uc3QgcmVxdWVzdCA9IG9iamVjdFN0b3JlLmdldChyZWNvcmQuaWQpO1xyXG5cclxuICAgICAgcmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24oLyogZXZlbnQgKi8pIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKCdlcnJvciAtIGdldFJlY29yZCcsIHJlcXVlc3QuZXJyb3IpO1xyXG4gICAgICAgIHJlamVjdChyZXF1ZXN0LmVycm9yKTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHJlcXVlc3Qub25zdWNjZXNzID0gKC8qIGV2ZW50ICovKSA9PiB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3N1Y2Nlc3MgLSBnZXRSZWNvcmQnLCByZXF1ZXN0LnJlc3VsdCk7XHJcbiAgICAgICAgbGV0IHJlY29yZCA9IHJlcXVlc3QucmVzdWx0O1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fa2V5TWFwKSB7XHJcbiAgICAgICAgICB0aGlzLl9rZXlNYXAucHVzaFJlY29yZChyZWNvcmQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmVzb2x2ZShyZWNvcmQpO1xyXG4gICAgICB9O1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRSZWNvcmRzKHR5cGU6IHN0cmluZyk6IFByb21pc2U8UmVjb3JkW10+IHtcclxuICAgIHJldHVybiBuZXcgT3JiaXQuUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIGNvbnN0IHRyYW5zYWN0aW9uID0gdGhpcy5fZGIudHJhbnNhY3Rpb24oW3R5cGVdKTtcclxuICAgICAgY29uc3Qgb2JqZWN0U3RvcmUgPSB0cmFuc2FjdGlvbi5vYmplY3RTdG9yZSh0eXBlKTtcclxuICAgICAgY29uc3QgcmVxdWVzdCA9IG9iamVjdFN0b3JlLm9wZW5DdXJzb3IoKTtcclxuICAgICAgY29uc3QgcmVjb3JkcyA9IFtdO1xyXG5cclxuICAgICAgcmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24oLyogZXZlbnQgKi8pIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKCdlcnJvciAtIGdldFJlY29yZHMnLCByZXF1ZXN0LmVycm9yKTtcclxuICAgICAgICByZWplY3QocmVxdWVzdC5lcnJvcik7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICByZXF1ZXN0Lm9uc3VjY2VzcyA9IChldmVudCkgPT4ge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdzdWNjZXNzIC0gZ2V0UmVjb3JkcycsIHJlcXVlc3QucmVzdWx0KTtcclxuICAgICAgICBjb25zdCBjdXJzb3IgPSBldmVudC50YXJnZXQucmVzdWx0O1xyXG4gICAgICAgIGlmIChjdXJzb3IpIHtcclxuICAgICAgICAgIGxldCByZWNvcmQgPSBjdXJzb3IudmFsdWU7XHJcblxyXG4gICAgICAgICAgaWYgKHRoaXMuX2tleU1hcCkge1xyXG4gICAgICAgICAgICB0aGlzLl9rZXlNYXAucHVzaFJlY29yZChyZWNvcmQpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHJlY29yZHMucHVzaChyZWNvcmQpO1xyXG4gICAgICAgICAgY3Vyc29yLmNvbnRpbnVlKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJlc29sdmUocmVjb3Jkcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXQgYXZhaWxhYmxlVHlwZXMoKTogc3RyaW5nW10ge1xyXG4gICAgY29uc3Qgb2JqZWN0U3RvcmVOYW1lcyA9IHRoaXMuX2RiLm9iamVjdFN0b3JlTmFtZXM7XHJcbiAgICBjb25zdCB0eXBlczogc3RyaW5nW10gPSBbXTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9iamVjdFN0b3JlTmFtZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdHlwZXMucHVzaChvYmplY3RTdG9yZU5hbWVzLml0ZW0oaSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0eXBlcztcclxuICB9XHJcblxyXG4gIHB1dFJlY29yZChyZWNvcmQ6IFJlY29yZCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgY29uc3QgdHJhbnNhY3Rpb24gPSB0aGlzLl9kYi50cmFuc2FjdGlvbihbcmVjb3JkLnR5cGVdLCAncmVhZHdyaXRlJyk7XHJcbiAgICBjb25zdCBvYmplY3RTdG9yZSA9IHRyYW5zYWN0aW9uLm9iamVjdFN0b3JlKHJlY29yZC50eXBlKTtcclxuXHJcbiAgICByZXR1cm4gbmV3IE9yYml0LlByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICBjb25zdCByZXF1ZXN0ID0gb2JqZWN0U3RvcmUucHV0KHJlY29yZCk7XHJcblxyXG4gICAgICByZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbigvKiBldmVudCAqLykge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ2Vycm9yIC0gcHV0UmVjb3JkJywgcmVxdWVzdC5lcnJvcik7XHJcbiAgICAgICAgcmVqZWN0KHJlcXVlc3QuZXJyb3IpO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSAoLyogZXZlbnQgKi8pID0+IHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnc3VjY2VzcyAtIHB1dFJlY29yZCcpO1xyXG4gICAgICAgIGlmICh0aGlzLl9rZXlNYXApIHtcclxuICAgICAgICAgIHRoaXMuX2tleU1hcC5wdXNoUmVjb3JkKHJlY29yZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgIH07XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHJlbW92ZVJlY29yZChyZWNvcmQ6IFJlY29yZCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgcmV0dXJuIG5ldyBPcmJpdC5Qcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgY29uc3QgdHJhbnNhY3Rpb24gPSB0aGlzLl9kYi50cmFuc2FjdGlvbihbcmVjb3JkLnR5cGVdLCAncmVhZHdyaXRlJyk7XHJcbiAgICAgIGNvbnN0IG9iamVjdFN0b3JlID0gdHJhbnNhY3Rpb24ub2JqZWN0U3RvcmUocmVjb3JkLnR5cGUpO1xyXG4gICAgICBjb25zdCByZXF1ZXN0ID0gb2JqZWN0U3RvcmUuZGVsZXRlKHJlY29yZC5pZCk7XHJcblxyXG4gICAgICByZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbigvKiBldmVudCAqLykge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ2Vycm9yIC0gcmVtb3ZlUmVjb3JkJywgcmVxdWVzdC5lcnJvcik7XHJcbiAgICAgICAgcmVqZWN0KHJlcXVlc3QuZXJyb3IpO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSBmdW5jdGlvbigvKiBldmVudCAqLykge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdzdWNjZXNzIC0gcmVtb3ZlUmVjb3JkJyk7XHJcbiAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICB9O1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBjbGVhclJlY29yZHModHlwZTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICBpZiAoIXRoaXMuX2RiKSB7XHJcbiAgICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbmV3IE9yYml0LlByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICBjb25zdCB0cmFuc2FjdGlvbiA9IHRoaXMuX2RiLnRyYW5zYWN0aW9uKFt0eXBlXSwgJ3JlYWR3cml0ZScpO1xyXG4gICAgICBjb25zdCBvYmplY3RTdG9yZSA9IHRyYW5zYWN0aW9uLm9iamVjdFN0b3JlKHR5cGUpO1xyXG4gICAgICBjb25zdCByZXF1ZXN0ID0gb2JqZWN0U3RvcmUuY2xlYXIoKTtcclxuXHJcbiAgICAgIHJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uKC8qIGV2ZW50ICovKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcignZXJyb3IgLSByZW1vdmVSZWNvcmRzJywgcmVxdWVzdC5lcnJvcik7XHJcbiAgICAgICAgcmVqZWN0KHJlcXVlc3QuZXJyb3IpO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSBmdW5jdGlvbigvKiBldmVudCAqLykge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdzdWNjZXNzIC0gcmVtb3ZlUmVjb3JkcycpO1xyXG4gICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgfTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAvLyBSZXNldHRhYmxlIGludGVyZmFjZSBpbXBsZW1lbnRhdGlvblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIHJlc2V0KCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgcmV0dXJuIHRoaXMuZGVsZXRlREIoKTtcclxuICB9XHJcblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgLy8gU3luY2FibGUgaW50ZXJmYWNlIGltcGxlbWVudGF0aW9uXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgX3N5bmModHJhbnNmb3JtOiBUcmFuc2Zvcm0pOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHJldHVybiB0aGlzLl9wcm9jZXNzVHJhbnNmb3JtKHRyYW5zZm9ybSk7XHJcbiAgfVxyXG5cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gIC8vIFB1c2hhYmxlIGludGVyZmFjZSBpbXBsZW1lbnRhdGlvblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIF9wdXNoKHRyYW5zZm9ybTogVHJhbnNmb3JtKTogUHJvbWlzZTxUcmFuc2Zvcm1bXT4ge1xyXG4gICAgcmV0dXJuIHRoaXMuX3Byb2Nlc3NUcmFuc2Zvcm0odHJhbnNmb3JtKVxyXG4gICAgICAudGhlbigoKSA9PiBbdHJhbnNmb3JtXSk7XHJcbiAgfVxyXG5cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gIC8vIFB1bGxhYmxlIGltcGxlbWVudGF0aW9uXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgX3B1bGwocXVlcnk6IFF1ZXJ5KTogUHJvbWlzZTxUcmFuc2Zvcm1bXT4ge1xyXG4gICAgY29uc3Qgb3BlcmF0b3I6IFB1bGxPcGVyYXRvciA9IFB1bGxPcGVyYXRvcnNbcXVlcnkuZXhwcmVzc2lvbi5vcF07XHJcbiAgICBpZiAoIW9wZXJhdG9yKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW5kZXhlZERCU291cmNlIGRvZXMgbm90IHN1cHBvcnQgdGhlIGAke3F1ZXJ5LmV4cHJlc3Npb24ub3B9YCBvcGVyYXRvciBmb3IgcXVlcmllcy4nKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5vcGVuREIoKVxyXG4gICAgICAudGhlbigoKSA9PiBvcGVyYXRvcih0aGlzLCBxdWVyeS5leHByZXNzaW9uKSk7XHJcbiAgfVxyXG5cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gIC8vIFByaXZhdGVcclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICBfcHJvY2Vzc1RyYW5zZm9ybSh0cmFuc2Zvcm06IFRyYW5zZm9ybSk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgcmV0dXJuIHRoaXMub3BlbkRCKClcclxuICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKTtcclxuXHJcbiAgICAgICAgdHJhbnNmb3JtLm9wZXJhdGlvbnMuZm9yRWFjaChvcGVyYXRpb24gPT4ge1xyXG4gICAgICAgICAgbGV0IHByb2Nlc3NvciA9IHRyYW5zZm9ybU9wZXJhdG9yc1tvcGVyYXRpb24ub3BdO1xyXG4gICAgICAgICAgcmVzdWx0ID0gcmVzdWx0LnRoZW4oKCkgPT4gcHJvY2Vzc29yKHRoaXMsIG9wZXJhdGlvbikpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICB9KTtcclxuICB9XHJcbn1cclxuIl19