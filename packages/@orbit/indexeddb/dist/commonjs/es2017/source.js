"use strict";

var __extends = undefined && undefined.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
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
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
        return _this;
    }
    IndexedDBSource.prototype.upgrade = function () {
        return this.reopenDB();
    };
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
                var result = request.result;
                if (result) {
                    if (_this._keyMap) {
                        _this._keyMap.pushRecord(result);
                    }
                    resolve(result);
                } else {
                    reject(new data_1.RecordNotFoundException(record.type, record.id));
                }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3JjL3NvdXJjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxxQkFZcUI7QUFDckIsc0JBQXNDO0FBQ3RDLG9DQUEyRDtBQUMzRCwrQkFBbUU7QUFDbkUsMEJBQW9EO0FBUXBELEFBS0c7Ozs7OztBQUlIO0FBQTZDLCtCQUFNO0FBYWpELEFBUUc7Ozs7Ozs7OztBQUNILDZCQUFZLEFBQXNDO0FBQXRDLGlDQUFBO0FBQUEsdUJBQXNDOztBQUFsRCxvQkFTQztBQVJDLGdCQUFNLE9BQUMsQUFBeUYsMkZBQUUsQ0FBQyxDQUFDLEFBQVEsU0FBQyxBQUFNLEFBQUMsQUFBQztBQUNySCxnQkFBTSxPQUFDLEFBQTBDLDRDQUFFLFlBQWlCLEFBQUUsQUFBQyxBQUFDO0FBRXhFLEFBQVEsaUJBQUMsQUFBSSxPQUFHLEFBQVEsU0FBQyxBQUFJLFFBQUksQUFBVyxBQUFDO0FBRTdDLGdCQUFBLGtCQUFNLEFBQVEsQUFBQyxhQUFDO0FBRWhCLEFBQUksY0FBQyxBQUFVLGFBQUcsQUFBUSxTQUFDLEFBQVMsYUFBSSxBQUFPLEFBQUM7ZUFDbEQ7QUFBQztBQUVELDhCQUFPLFVBQVA7QUFDRSxBQUFNLGVBQUMsQUFBSSxLQUFDLEFBQVEsQUFBRSxBQUFDLEFBQ3pCO0FBQUM7QUFPRCwwQkFBSSwyQkFBUztBQUxiLEFBSUc7Ozs7O2FBQ0g7QUFDRSxBQUFNLG1CQUFDLEFBQUksS0FBQyxBQUFPLFFBQUMsQUFBTyxBQUFDLEFBQzlCO0FBQUM7O3NCQUFBOztBQVNELDBCQUFJLDJCQUFNO0FBUFYsQUFNRzs7Ozs7OzthQUNIO0FBQ0UsQUFBTSxtQkFBQyxBQUFJLEtBQUMsQUFBVSxBQUFDLEFBQ3pCO0FBQUM7O3NCQUFBOztBQUVELDBCQUFJLDJCQUFRO2FBQVo7QUFDRSxBQUFNLG1CQUFDLENBQUMsQ0FBQyxBQUFJLEtBQUMsQUFBRyxBQUFDLEFBQ3BCO0FB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QUFNLFNBQUcsT0FBSyxRQUFDLEFBQU8sUUFBQyxBQUFPLEFBQUUsQUFBQztBQUVyQyxBQUFTLHNCQUFDLEFBQVUsV0FBQyxBQUFPLFFBQUMsVUFBQSxBQUFTO0FBQ3BDLG9CQUFJLEFBQVMsWUFBRyxzQkFBa0IsUUFBQyxBQUFTLFVBQUMsQUFBRSxBQUFDLEFBQUM7QUFDakQsQUFBTSxnQ0FBVSxBQUFJLEtBQUM7QUFBTSwyQkFBQSxBQUFTLFVBQUMsQUFBSSxPQUFkLEFBQWdCLEFBQVMsQUFBQztBQUFBLEFBQUMsQUFBQyxBQUN6RCxpQkFEVyxBQUFNO0FBQ2hCLEFBQUMsQUFBQztBQUVILEFBQU0sbUJBQUMsQUFBTSxBQUFDLEFBQ2hCO0FBQUMsQUFBQyxBQUFDLEFBQ1AsU0FYUyxBQUFJO0FBV1o7QUE1VWtCLEFBQWUsa0NBSG5DLE9BQVEsVUFDUixPQUFRLFVBQ1IsT0FBUSxXQUNZLEFBQWUsQUE2VW5DO0FBQUQsV0FBQztBQTdVRCxBQTZVQyxFQTdVNEMsT0FBTSxBQTZVbEQ7a0JBN1VvQixBQUFlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE9yYml0LCB7XHJcbiAgcHVsbGFibGUsIFB1bGxhYmxlLFxyXG4gIHB1c2hhYmxlLCBQdXNoYWJsZSxcclxuICBSZXNldHRhYmxlLFxyXG4gIHN5bmNhYmxlLCBTeW5jYWJsZSxcclxuICBRdWVyeSxcclxuICBRdWVyeU9yRXhwcmVzc2lvbixcclxuICBSZWNvcmQsIFJlY29yZElkZW50aXR5LFxyXG4gIFNvdXJjZSwgU291cmNlU2V0dGluZ3MsXHJcbiAgVHJhbnNmb3JtLFxyXG4gIFRyYW5zZm9ybU9yT3BlcmF0aW9ucyxcclxuICBSZWNvcmROb3RGb3VuZEV4Y2VwdGlvblxyXG59IGZyb20gJ0BvcmJpdC9kYXRhJztcclxuaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSAnQG9yYml0L3V0aWxzJztcclxuaW1wb3J0IHRyYW5zZm9ybU9wZXJhdG9ycyBmcm9tICcuL2xpYi90cmFuc2Zvcm0tb3BlcmF0b3JzJztcclxuaW1wb3J0IHsgUHVsbE9wZXJhdG9yLCBQdWxsT3BlcmF0b3JzIH0gZnJvbSAnLi9saWIvcHVsbC1vcGVyYXRvcnMnO1xyXG5pbXBvcnQgeyBzdXBwb3J0c0luZGV4ZWREQiB9IGZyb20gJy4vbGliL2luZGV4ZWRkYic7XHJcblxyXG5kZWNsYXJlIGNvbnN0IGNvbnNvbGU6IGFueTtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSW5kZXhlZERCU291cmNlU2V0dGluZ3MgZXh0ZW5kcyBTb3VyY2VTZXR0aW5ncyB7XHJcbiAgbmFtZXNwYWNlPzogc3RyaW5nO1xyXG59XHJcblxyXG4vKipcclxuICogU291cmNlIGZvciBzdG9yaW5nIGRhdGEgaW4gSW5kZXhlZERCLlxyXG4gKlxyXG4gKiBAY2xhc3MgSW5kZXhlZERCU291cmNlXHJcbiAqIEBleHRlbmRzIFNvdXJjZVxyXG4gKi9cclxuQHB1bGxhYmxlXHJcbkBwdXNoYWJsZVxyXG5Ac3luY2FibGVcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW5kZXhlZERCU291cmNlIGV4dGVuZHMgU291cmNlIGltcGxlbWVudHMgUHVsbGFibGUsIFB1c2hhYmxlLCBSZXNldHRhYmxlLCBTeW5jYWJsZSB7XHJcbiAgcHJvdGVjdGVkIF9uYW1lc3BhY2U6IHN0cmluZztcclxuICBwcm90ZWN0ZWQgX2RiOiBhbnk7XHJcblxyXG4gIC8vIFN5bmNhYmxlIGludGVyZmFjZSBzdHVic1xyXG4gIHN5bmM6ICh0cmFuc2Zvcm1PclRyYW5zZm9ybXM6IFRyYW5zZm9ybSB8IFRyYW5zZm9ybVtdKSA9PiBQcm9taXNlPHZvaWQ+O1xyXG5cclxuICAvLyBQdWxsYWJsZSBpbnRlcmZhY2Ugc3R1YnNcclxuICBwdWxsOiAocXVlcnlPckV4cHJlc3Npb246IFF1ZXJ5T3JFeHByZXNzaW9uLCBvcHRpb25zPzogb2JqZWN0LCBpZD86IHN0cmluZykgPT4gUHJvbWlzZTxUcmFuc2Zvcm1bXT47XHJcblxyXG4gIC8vIFB1c2hhYmxlIGludGVyZmFjZSBzdHVic1xyXG4gIHB1c2g6ICh0cmFuc2Zvcm1Pck9wZXJhdGlvbnM6IFRyYW5zZm9ybU9yT3BlcmF0aW9ucywgb3B0aW9ucz86IG9iamVjdCwgaWQ/OiBzdHJpbmcpID0+IFByb21pc2U8VHJhbnNmb3JtW10+O1xyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGUgYSBuZXcgSW5kZXhlZERCU291cmNlLlxyXG4gICAqXHJcbiAgICogQGNvbnN0cnVjdG9yXHJcbiAgICogQHBhcmFtIHtPYmplY3R9ICBbc2V0dGluZ3MgPSB7fV1cclxuICAgKiBAcGFyYW0ge1NjaGVtYX0gIFtzZXR0aW5ncy5zY2hlbWFdICAgIE9yYml0IFNjaGVtYS5cclxuICAgKiBAcGFyYW0ge1N0cmluZ30gIFtzZXR0aW5ncy5uYW1lXSAgICAgIE9wdGlvbmFsLiBOYW1lIGZvciBzb3VyY2UuIERlZmF1bHRzIHRvICdpbmRleGVkREInLlxyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSAgW3NldHRpbmdzLm5hbWVzcGFjZV0gT3B0aW9uYWwuIE5hbWVzcGFjZSBvZiB0aGUgYXBwbGljYXRpb24uIFdpbGwgYmUgdXNlZCBmb3IgdGhlIEluZGV4ZWREQiBkYXRhYmFzZSBuYW1lLiBEZWZhdWx0cyB0byAnb3JiaXQnLlxyXG4gICAqL1xyXG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzOiBJbmRleGVkREJTb3VyY2VTZXR0aW5ncyA9IHt9KSB7XHJcbiAgICBhc3NlcnQoJ0luZGV4ZWREQlNvdXJjZVxcJ3MgYHNjaGVtYWAgbXVzdCBiZSBzcGVjaWZpZWQgaW4gYHNldHRpbmdzLnNjaGVtYWAgY29uc3RydWN0b3IgYXJndW1lbnQnLCAhIXNldHRpbmdzLnNjaGVtYSk7XHJcbiAgICBhc3NlcnQoJ1lvdXIgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IEluZGV4ZWREQiEnLCBzdXBwb3J0c0luZGV4ZWREQigpKTtcclxuXHJcbiAgICBzZXR0aW5ncy5uYW1lID0gc2V0dGluZ3MubmFtZSB8fCAnaW5kZXhlZERCJztcclxuXHJcbiAgICBzdXBlcihzZXR0aW5ncyk7XHJcblxyXG4gICAgdGhpcy5fbmFtZXNwYWNlID0gc2V0dGluZ3MubmFtZXNwYWNlIHx8ICdvcmJpdCc7XHJcbiAgfVxyXG5cclxuICB1cGdyYWRlKCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgcmV0dXJuIHRoaXMucmVvcGVuREIoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFRoZSB2ZXJzaW9uIHRvIHNwZWNpZnkgd2hlbiBvcGVuaW5nIHRoZSBJbmRleGVkREIgZGF0YWJhc2UuXHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtJbnRlZ2VyfSBWZXJzaW9uIG51bWJlci5cclxuICAgKi9cclxuICBnZXQgZGJWZXJzaW9uKCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gdGhpcy5fc2NoZW1hLnZlcnNpb247XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBJbmRleGVkREIgZGF0YWJhc2UgbmFtZS5cclxuICAgKlxyXG4gICAqIERlZmF1bHRzIHRvIHRoZSBuYW1lc3BhY2Ugb2YgdGhlIGFwcCwgd2hpY2ggY2FuIGJlIG92ZXJyaWRkZW4gaW4gdGhlIGNvbnN0cnVjdG9yLlxyXG4gICAqXHJcbiAgICogQHJldHVybiB7U3RyaW5nfSBEYXRhYmFzZSBuYW1lLlxyXG4gICAqL1xyXG4gIGdldCBkYk5hbWUoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLl9uYW1lc3BhY2U7XHJcbiAgfVxyXG5cclxuICBnZXQgaXNEQk9wZW4oKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gISF0aGlzLl9kYjtcclxuICB9XHJcblxyXG4gIG9wZW5EQigpOiBQcm9taXNlPGFueT4ge1xyXG4gICAgcmV0dXJuIG5ldyBPcmJpdC5Qcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgaWYgKHRoaXMuX2RiKSB7XHJcbiAgICAgICAgcmVzb2x2ZSh0aGlzLl9kYik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IHJlcXVlc3QgPSBPcmJpdC5nbG9iYWxzLmluZGV4ZWREQi5vcGVuKHRoaXMuZGJOYW1lLCB0aGlzLmRiVmVyc2lvbik7XHJcblxyXG4gICAgICAgIHJlcXVlc3Qub25lcnJvciA9ICgvKiBldmVudCAqLykgPT4ge1xyXG4gICAgICAgICAgLy8gY29uc29sZS5lcnJvcignZXJyb3Igb3BlbmluZyBpbmRleGVkREInLCB0aGlzLmRiTmFtZSk7XHJcbiAgICAgICAgICByZWplY3QocmVxdWVzdC5lcnJvcik7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSAoLyogZXZlbnQgKi8pID0+IHtcclxuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdzdWNjZXNzIG9wZW5pbmcgaW5kZXhlZERCJywgdGhpcy5kYk5hbWUpO1xyXG4gICAgICAgICAgY29uc3QgZGIgPSB0aGlzLl9kYiA9IHJlcXVlc3QucmVzdWx0O1xyXG4gICAgICAgICAgcmVzb2x2ZShkYik7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmVxdWVzdC5vbnVwZ3JhZGVuZWVkZWQgPSAoZXZlbnQpID0+IHtcclxuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdpbmRleGVkREIgdXBncmFkZSBuZWVkZWQnKTtcclxuICAgICAgICAgIGNvbnN0IGRiID0gdGhpcy5fZGIgPSBldmVudC50YXJnZXQucmVzdWx0O1xyXG4gICAgICAgICAgaWYgKGV2ZW50ICYmIGV2ZW50Lm9sZFZlcnNpb24gPiAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMubWlncmF0ZURCKGRiLCBldmVudCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZURCKGRiKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGNsb3NlREIoKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5pc0RCT3Blbikge1xyXG4gICAgICB0aGlzLl9kYi5jbG9zZSgpO1xyXG4gICAgICB0aGlzLl9kYiA9IG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZW9wZW5EQigpOiBQcm9taXNlPGFueT4ge1xyXG4gICAgdGhpcy5jbG9zZURCKCk7XHJcbiAgICByZXR1cm4gdGhpcy5vcGVuREIoKTtcclxuICB9XHJcblxyXG4gIGNyZWF0ZURCKGRiKTogdm9pZCB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnY3JlYXRlREInKTtcclxuICAgIE9iamVjdC5rZXlzKHRoaXMuc2NoZW1hLm1vZGVscykuZm9yRWFjaChtb2RlbCA9PiB7XHJcbiAgICAgIHRoaXMucmVnaXN0ZXJNb2RlbChkYiwgbW9kZWwpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBNaWdyYXRlIGRhdGFiYXNlLlxyXG4gICAqXHJcbiAgICogQHBhcmFtICB7SURCRGF0YWJhc2V9IGRiICAgICAgICAgICAgICBEYXRhYmFzZSB0byB1cGdyYWRlLlxyXG4gICAqIEBwYXJhbSAge0lEQlZlcnNpb25DaGFuZ2VFdmVudH0gZXZlbnQgRXZlbnQgcmVzdWx0aW5nIGZyb20gdmVyc2lvbiBjaGFuZ2UuXHJcbiAgICovXHJcbiAgbWlncmF0ZURCKGRiLCBldmVudCkge1xyXG4gICAgY29uc29sZS5lcnJvcignSW5kZXhlZERCU291cmNlI21pZ3JhdGVEQiAtIHNob3VsZCBiZSBvdmVycmlkZGVuIHRvIHVwZ3JhZGUgSURCRGF0YWJhc2UgZnJvbTogJywgZXZlbnQub2xkVmVyc2lvbiwgJyAtPiAnLCBldmVudC5uZXdWZXJzaW9uKTtcclxuICB9XHJcblxyXG4gIGRlbGV0ZURCKCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgdGhpcy5jbG9zZURCKCk7XHJcblxyXG4gICAgcmV0dXJuIG5ldyBPcmJpdC5Qcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgbGV0IHJlcXVlc3QgPSBPcmJpdC5nbG9iYWxzLmluZGV4ZWREQi5kZWxldGVEYXRhYmFzZSh0aGlzLmRiTmFtZSk7XHJcblxyXG4gICAgICByZXF1ZXN0Lm9uZXJyb3IgPSAoLyogZXZlbnQgKi8pID0+IHtcclxuICAgICAgICAvLyBjb25zb2xlLmVycm9yKCdlcnJvciBkZWxldGluZyBpbmRleGVkREInLCB0aGlzLmRiTmFtZSk7XHJcbiAgICAgICAgcmVqZWN0KHJlcXVlc3QuZXJyb3IpO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSAoLyogZXZlbnQgKi8pID0+IHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnc3VjY2VzcyBkZWxldGluZyBpbmRleGVkREInLCB0aGlzLmRiTmFtZSk7XHJcbiAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICB9O1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICByZWdpc3Rlck1vZGVsKGRiLCBtb2RlbCkge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ3JlZ2lzdGVyTW9kZWwnLCBtb2RlbCk7XHJcbiAgICBkYi5jcmVhdGVPYmplY3RTdG9yZShtb2RlbCwgeyBrZXlQYXRoOiAnaWQnIH0pO1xyXG4gICAgLy8gVE9ETyAtIGNyZWF0ZSBpbmRpY2VzXHJcbiAgfVxyXG5cclxuICBnZXRSZWNvcmQocmVjb3JkKTogUHJvbWlzZTxSZWNvcmQ+IHtcclxuICAgIHJldHVybiBuZXcgT3JiaXQuUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIGNvbnN0IHRyYW5zYWN0aW9uID0gdGhpcy5fZGIudHJhbnNhY3Rpb24oW3JlY29yZC50eXBlXSk7XHJcbiAgICAgIGNvbnN0IG9iamVjdFN0b3JlID0gdHJhbnNhY3Rpb24ub2JqZWN0U3RvcmUocmVjb3JkLnR5cGUpO1xyXG4gICAgICBjb25zdCByZXF1ZXN0ID0gb2JqZWN0U3RvcmUuZ2V0KHJlY29yZC5pZCk7XHJcblxyXG4gICAgICByZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbigvKiBldmVudCAqLykge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ2Vycm9yIC0gZ2V0UmVjb3JkJywgcmVxdWVzdC5lcnJvcik7XHJcbiAgICAgICAgcmVqZWN0KHJlcXVlc3QuZXJyb3IpO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSAoLyogZXZlbnQgKi8pID0+IHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnc3VjY2VzcyAtIGdldFJlY29yZCcsIHJlcXVlc3QucmVzdWx0KTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gcmVxdWVzdC5yZXN1bHQ7XHJcblxyXG4gICAgICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgICAgIGlmICh0aGlzLl9rZXlNYXApIHtcclxuICAgICAgICAgICAgdGhpcy5fa2V5TWFwLnB1c2hSZWNvcmQocmVzdWx0KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmVqZWN0KG5ldyBSZWNvcmROb3RGb3VuZEV4Y2VwdGlvbihyZWNvcmQudHlwZSwgcmVjb3JkLmlkKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRSZWNvcmRzKHR5cGU6IHN0cmluZyk6IFByb21pc2U8UmVjb3JkW10+IHtcclxuICAgIHJldHVybiBuZXcgT3JiaXQuUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIGNvbnN0IHRyYW5zYWN0aW9uID0gdGhpcy5fZGIudHJhbnNhY3Rpb24oW3R5cGVdKTtcclxuICAgICAgY29uc3Qgb2JqZWN0U3RvcmUgPSB0cmFuc2FjdGlvbi5vYmplY3RTdG9yZSh0eXBlKTtcclxuICAgICAgY29uc3QgcmVxdWVzdCA9IG9iamVjdFN0b3JlLm9wZW5DdXJzb3IoKTtcclxuICAgICAgY29uc3QgcmVjb3JkcyA9IFtdO1xyXG5cclxuICAgICAgcmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24oLyogZXZlbnQgKi8pIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKCdlcnJvciAtIGdldFJlY29yZHMnLCByZXF1ZXN0LmVycm9yKTtcclxuICAgICAgICByZWplY3QocmVxdWVzdC5lcnJvcik7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICByZXF1ZXN0Lm9uc3VjY2VzcyA9IChldmVudCkgPT4ge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdzdWNjZXNzIC0gZ2V0UmVjb3JkcycsIHJlcXVlc3QucmVzdWx0KTtcclxuICAgICAgICBjb25zdCBjdXJzb3IgPSBldmVudC50YXJnZXQucmVzdWx0O1xyXG4gICAgICAgIGlmIChjdXJzb3IpIHtcclxuICAgICAgICAgIGxldCByZWNvcmQgPSBjdXJzb3IudmFsdWU7XHJcblxyXG4gICAgICAgICAgaWYgKHRoaXMuX2tleU1hcCkge1xyXG4gICAgICAgICAgICB0aGlzLl9rZXlNYXAucHVzaFJlY29yZChyZWNvcmQpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHJlY29yZHMucHVzaChyZWNvcmQpO1xyXG4gICAgICAgICAgY3Vyc29yLmNvbnRpbnVlKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJlc29sdmUocmVjb3Jkcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXQgYXZhaWxhYmxlVHlwZXMoKTogc3RyaW5nW10ge1xyXG4gICAgY29uc3Qgb2JqZWN0U3RvcmVOYW1lcyA9IHRoaXMuX2RiLm9iamVjdFN0b3JlTmFtZXM7XHJcbiAgICBjb25zdCB0eXBlczogc3RyaW5nW10gPSBbXTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9iamVjdFN0b3JlTmFtZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdHlwZXMucHVzaChvYmplY3RTdG9yZU5hbWVzLml0ZW0oaSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0eXBlcztcclxuICB9XHJcblxyXG4gIHB1dFJlY29yZChyZWNvcmQ6IFJlY29yZCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgY29uc3QgdHJhbnNhY3Rpb24gPSB0aGlzLl9kYi50cmFuc2FjdGlvbihbcmVjb3JkLnR5cGVdLCAncmVhZHdyaXRlJyk7XHJcbiAgICBjb25zdCBvYmplY3RTdG9yZSA9IHRyYW5zYWN0aW9uLm9iamVjdFN0b3JlKHJlY29yZC50eXBlKTtcclxuXHJcbiAgICByZXR1cm4gbmV3IE9yYml0LlByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICBjb25zdCByZXF1ZXN0ID0gb2JqZWN0U3RvcmUucHV0KHJlY29yZCk7XHJcblxyXG4gICAgICByZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbigvKiBldmVudCAqLykge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ2Vycm9yIC0gcHV0UmVjb3JkJywgcmVxdWVzdC5lcnJvcik7XHJcbiAgICAgICAgcmVqZWN0KHJlcXVlc3QuZXJyb3IpO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSAoLyogZXZlbnQgKi8pID0+IHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnc3VjY2VzcyAtIHB1dFJlY29yZCcpO1xyXG4gICAgICAgIGlmICh0aGlzLl9rZXlNYXApIHtcclxuICAgICAgICAgIHRoaXMuX2tleU1hcC5wdXNoUmVjb3JkKHJlY29yZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgIH07XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHJlbW92ZVJlY29yZChyZWNvcmQ6IFJlY29yZCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgcmV0dXJuIG5ldyBPcmJpdC5Qcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgY29uc3QgdHJhbnNhY3Rpb24gPSB0aGlzLl9kYi50cmFuc2FjdGlvbihbcmVjb3JkLnR5cGVdLCAncmVhZHdyaXRlJyk7XHJcbiAgICAgIGNvbnN0IG9iamVjdFN0b3JlID0gdHJhbnNhY3Rpb24ub2JqZWN0U3RvcmUocmVjb3JkLnR5cGUpO1xyXG4gICAgICBjb25zdCByZXF1ZXN0ID0gb2JqZWN0U3RvcmUuZGVsZXRlKHJlY29yZC5pZCk7XHJcblxyXG4gICAgICByZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbigvKiBldmVudCAqLykge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ2Vycm9yIC0gcmVtb3ZlUmVjb3JkJywgcmVxdWVzdC5lcnJvcik7XHJcbiAgICAgICAgcmVqZWN0KHJlcXVlc3QuZXJyb3IpO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSBmdW5jdGlvbigvKiBldmVudCAqLykge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdzdWNjZXNzIC0gcmVtb3ZlUmVjb3JkJyk7XHJcbiAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICB9O1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBjbGVhclJlY29yZHModHlwZTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICBpZiAoIXRoaXMuX2RiKSB7XHJcbiAgICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbmV3IE9yYml0LlByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICBjb25zdCB0cmFuc2FjdGlvbiA9IHRoaXMuX2RiLnRyYW5zYWN0aW9uKFt0eXBlXSwgJ3JlYWR3cml0ZScpO1xyXG4gICAgICBjb25zdCBvYmplY3RTdG9yZSA9IHRyYW5zYWN0aW9uLm9iamVjdFN0b3JlKHR5cGUpO1xyXG4gICAgICBjb25zdCByZXF1ZXN0ID0gb2JqZWN0U3RvcmUuY2xlYXIoKTtcclxuXHJcbiAgICAgIHJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uKC8qIGV2ZW50ICovKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcignZXJyb3IgLSByZW1vdmVSZWNvcmRzJywgcmVxdWVzdC5lcnJvcik7XHJcbiAgICAgICAgcmVqZWN0KHJlcXVlc3QuZXJyb3IpO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSBmdW5jdGlvbigvKiBldmVudCAqLykge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdzdWNjZXNzIC0gcmVtb3ZlUmVjb3JkcycpO1xyXG4gICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgfTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAvLyBSZXNldHRhYmxlIGludGVyZmFjZSBpbXBsZW1lbnRhdGlvblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIHJlc2V0KCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgcmV0dXJuIHRoaXMuZGVsZXRlREIoKTtcclxuICB9XHJcblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgLy8gU3luY2FibGUgaW50ZXJmYWNlIGltcGxlbWVudGF0aW9uXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgX3N5bmModHJhbnNmb3JtOiBUcmFuc2Zvcm0pOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHJldHVybiB0aGlzLl9wcm9jZXNzVHJhbnNmb3JtKHRyYW5zZm9ybSk7XHJcbiAgfVxyXG5cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gIC8vIFB1c2hhYmxlIGludGVyZmFjZSBpbXBsZW1lbnRhdGlvblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIF9wdXNoKHRyYW5zZm9ybTogVHJhbnNmb3JtKTogUHJvbWlzZTxUcmFuc2Zvcm1bXT4ge1xyXG4gICAgcmV0dXJuIHRoaXMuX3Byb2Nlc3NUcmFuc2Zvcm0odHJhbnNmb3JtKVxyXG4gICAgICAudGhlbigoKSA9PiBbdHJhbnNmb3JtXSk7XHJcbiAgfVxyXG5cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gIC8vIFB1bGxhYmxlIGltcGxlbWVudGF0aW9uXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgX3B1bGwocXVlcnk6IFF1ZXJ5KTogUHJvbWlzZTxUcmFuc2Zvcm1bXT4ge1xyXG4gICAgY29uc3Qgb3BlcmF0b3I6IFB1bGxPcGVyYXRvciA9IFB1bGxPcGVyYXRvcnNbcXVlcnkuZXhwcmVzc2lvbi5vcF07XHJcbiAgICBpZiAoIW9wZXJhdG9yKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW5kZXhlZERCU291cmNlIGRvZXMgbm90IHN1cHBvcnQgdGhlIGAke3F1ZXJ5LmV4cHJlc3Npb24ub3B9YCBvcGVyYXRvciBmb3IgcXVlcmllcy4nKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5vcGVuREIoKVxyXG4gICAgICAudGhlbigoKSA9PiBvcGVyYXRvcih0aGlzLCBxdWVyeS5leHByZXNzaW9uKSk7XHJcbiAgfVxyXG5cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gIC8vIFByaXZhdGVcclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICBfcHJvY2Vzc1RyYW5zZm9ybSh0cmFuc2Zvcm06IFRyYW5zZm9ybSk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgcmV0dXJuIHRoaXMub3BlbkRCKClcclxuICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKTtcclxuXHJcbiAgICAgICAgdHJhbnNmb3JtLm9wZXJhdGlvbnMuZm9yRWFjaChvcGVyYXRpb24gPT4ge1xyXG4gICAgICAgICAgbGV0IHByb2Nlc3NvciA9IHRyYW5zZm9ybU9wZXJhdG9yc1tvcGVyYXRpb24ub3BdO1xyXG4gICAgICAgICAgcmVzdWx0ID0gcmVzdWx0LnRoZW4oKCkgPT4gcHJvY2Vzc29yKHRoaXMsIG9wZXJhdGlvbikpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICB9KTtcclxuICB9XHJcbn1cclxuIl19