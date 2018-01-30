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
var indexeddb_1 = require("./lib/indexeddb");
/**
 * Source for storing data in IndexedDB.
 *
 * @class IndexedDBSource
 * @extends Source
 */
var IndexedDBSource = (function (_super) {
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
        if (settings === void 0) { settings = {}; }
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
            }
            else {
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
                    }
                    else {
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
                }
                else {
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
                }
                else {
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
        return this._processTransform(transform)
            .then(function () { return [transform]; });
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
        return this.openDB()
            .then(function () { return operator(_this, query.expression); });
    };
    /////////////////////////////////////////////////////////////////////////////
    // Private
    /////////////////////////////////////////////////////////////////////////////
    IndexedDBSource.prototype._processTransform = function (transform) {
        var _this = this;
        return this.openDB()
            .then(function () {
            var result = data_1.default.Promise.resolve();
            transform.operations.forEach(function (operation) {
                var processor = transform_operators_1.default[operation.op];
                result = result.then(function () { return processor(_this, operation); });
            });
            return result;
        });
    };
    IndexedDBSource = __decorate([
        data_1.pullable,
        data_1.pushable,
        data_1.syncable
    ], IndexedDBSource);
    return IndexedDBSource;
}(data_1.Source));
exports.default = IndexedDBSource;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3JjL3NvdXJjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxvQ0FZcUI7QUFDckIsc0NBQXNDO0FBQ3RDLGlFQUEyRDtBQUMzRCx1REFBbUU7QUFDbkUsNkNBQW9EO0FBUXBEOzs7OztHQUtHO0FBSUg7SUFBNkMsbUNBQU07SUFhakQ7Ozs7Ozs7O09BUUc7SUFDSCx5QkFBWSxRQUFzQztRQUF0Qyx5QkFBQSxFQUFBLGFBQXNDO1FBQWxELGlCQVNDO1FBUkMsY0FBTSxDQUFDLHlGQUF5RixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDckgsY0FBTSxDQUFDLDBDQUEwQyxFQUFFLDZCQUFpQixFQUFFLENBQUMsQ0FBQztRQUV4RSxRQUFRLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxJQUFJLElBQUksV0FBVyxDQUFDO1FBRTdDLFFBQUEsa0JBQU0sUUFBUSxDQUFDLFNBQUM7UUFFaEIsS0FBSSxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUMsU0FBUyxJQUFJLE9BQU8sQ0FBQzs7SUFDbEQsQ0FBQztJQUVELGlDQUFPLEdBQVA7UUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFPRCxzQkFBSSxzQ0FBUztRQUxiOzs7O1dBSUc7YUFDSDtZQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztRQUM5QixDQUFDOzs7T0FBQTtJQVNELHNCQUFJLG1DQUFNO1FBUFY7Ozs7OztXQU1HO2FBQ0g7WUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUN6QixDQUFDOzs7T0FBQTtJQUVELHNCQUFJLHFDQUFRO2FBQVo7WUFDRSxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7UUFDcEIsQ0FBQzs7O09BQUE7SUFFRCxnQ0FB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QUFPLENBQUMsT0FBTyxFQUFFLENBQUM7WUFFckMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsVUFBQSxTQUFTO2dCQUNwQyxJQUFJLFNBQVMsR0FBRyw2QkFBa0IsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ2pELE1BQU0sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQU0sT0FBQSxTQUFTLENBQUMsS0FBSSxFQUFFLFNBQVMsQ0FBQyxFQUExQixDQUEwQixDQUFDLENBQUM7WUFDekQsQ0FBQyxDQUFDLENBQUM7WUFFSCxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ2hCLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQTVVa0IsZUFBZTtRQUhuQyxlQUFRO1FBQ1IsZUFBUTtRQUNSLGVBQVE7T0FDWSxlQUFlLENBNlVuQztJQUFELHNCQUFDO0NBQUEsQUE3VUQsQ0FBNkMsYUFBTSxHQTZVbEQ7a0JBN1VvQixlQUFlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE9yYml0LCB7XHJcbiAgcHVsbGFibGUsIFB1bGxhYmxlLFxyXG4gIHB1c2hhYmxlLCBQdXNoYWJsZSxcclxuICBSZXNldHRhYmxlLFxyXG4gIHN5bmNhYmxlLCBTeW5jYWJsZSxcclxuICBRdWVyeSxcclxuICBRdWVyeU9yRXhwcmVzc2lvbixcclxuICBSZWNvcmQsIFJlY29yZElkZW50aXR5LFxyXG4gIFNvdXJjZSwgU291cmNlU2V0dGluZ3MsXHJcbiAgVHJhbnNmb3JtLFxyXG4gIFRyYW5zZm9ybU9yT3BlcmF0aW9ucyxcclxuICBSZWNvcmROb3RGb3VuZEV4Y2VwdGlvblxyXG59IGZyb20gJ0BvcmJpdC9kYXRhJztcclxuaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSAnQG9yYml0L3V0aWxzJztcclxuaW1wb3J0IHRyYW5zZm9ybU9wZXJhdG9ycyBmcm9tICcuL2xpYi90cmFuc2Zvcm0tb3BlcmF0b3JzJztcclxuaW1wb3J0IHsgUHVsbE9wZXJhdG9yLCBQdWxsT3BlcmF0b3JzIH0gZnJvbSAnLi9saWIvcHVsbC1vcGVyYXRvcnMnO1xyXG5pbXBvcnQgeyBzdXBwb3J0c0luZGV4ZWREQiB9IGZyb20gJy4vbGliL2luZGV4ZWRkYic7XHJcblxyXG5kZWNsYXJlIGNvbnN0IGNvbnNvbGU6IGFueTtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSW5kZXhlZERCU291cmNlU2V0dGluZ3MgZXh0ZW5kcyBTb3VyY2VTZXR0aW5ncyB7XHJcbiAgbmFtZXNwYWNlPzogc3RyaW5nO1xyXG59XHJcblxyXG4vKipcclxuICogU291cmNlIGZvciBzdG9yaW5nIGRhdGEgaW4gSW5kZXhlZERCLlxyXG4gKlxyXG4gKiBAY2xhc3MgSW5kZXhlZERCU291cmNlXHJcbiAqIEBleHRlbmRzIFNvdXJjZVxyXG4gKi9cclxuQHB1bGxhYmxlXHJcbkBwdXNoYWJsZVxyXG5Ac3luY2FibGVcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW5kZXhlZERCU291cmNlIGV4dGVuZHMgU291cmNlIGltcGxlbWVudHMgUHVsbGFibGUsIFB1c2hhYmxlLCBSZXNldHRhYmxlLCBTeW5jYWJsZSB7XHJcbiAgcHJvdGVjdGVkIF9uYW1lc3BhY2U6IHN0cmluZztcclxuICBwcm90ZWN0ZWQgX2RiOiBhbnk7XHJcblxyXG4gIC8vIFN5bmNhYmxlIGludGVyZmFjZSBzdHVic1xyXG4gIHN5bmM6ICh0cmFuc2Zvcm1PclRyYW5zZm9ybXM6IFRyYW5zZm9ybSB8IFRyYW5zZm9ybVtdKSA9PiBQcm9taXNlPHZvaWQ+O1xyXG5cclxuICAvLyBQdWxsYWJsZSBpbnRlcmZhY2Ugc3R1YnNcclxuICBwdWxsOiAocXVlcnlPckV4cHJlc3Npb246IFF1ZXJ5T3JFeHByZXNzaW9uLCBvcHRpb25zPzogb2JqZWN0LCBpZD86IHN0cmluZykgPT4gUHJvbWlzZTxUcmFuc2Zvcm1bXT47XHJcblxyXG4gIC8vIFB1c2hhYmxlIGludGVyZmFjZSBzdHVic1xyXG4gIHB1c2g6ICh0cmFuc2Zvcm1Pck9wZXJhdGlvbnM6IFRyYW5zZm9ybU9yT3BlcmF0aW9ucywgb3B0aW9ucz86IG9iamVjdCwgaWQ/OiBzdHJpbmcpID0+IFByb21pc2U8VHJhbnNmb3JtW10+O1xyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGUgYSBuZXcgSW5kZXhlZERCU291cmNlLlxyXG4gICAqXHJcbiAgICogQGNvbnN0cnVjdG9yXHJcbiAgICogQHBhcmFtIHtPYmplY3R9ICBbc2V0dGluZ3MgPSB7fV1cclxuICAgKiBAcGFyYW0ge1NjaGVtYX0gIFtzZXR0aW5ncy5zY2hlbWFdICAgIE9yYml0IFNjaGVtYS5cclxuICAgKiBAcGFyYW0ge1N0cmluZ30gIFtzZXR0aW5ncy5uYW1lXSAgICAgIE9wdGlvbmFsLiBOYW1lIGZvciBzb3VyY2UuIERlZmF1bHRzIHRvICdpbmRleGVkREInLlxyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSAgW3NldHRpbmdzLm5hbWVzcGFjZV0gT3B0aW9uYWwuIE5hbWVzcGFjZSBvZiB0aGUgYXBwbGljYXRpb24uIFdpbGwgYmUgdXNlZCBmb3IgdGhlIEluZGV4ZWREQiBkYXRhYmFzZSBuYW1lLiBEZWZhdWx0cyB0byAnb3JiaXQnLlxyXG4gICAqL1xyXG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzOiBJbmRleGVkREJTb3VyY2VTZXR0aW5ncyA9IHt9KSB7XHJcbiAgICBhc3NlcnQoJ0luZGV4ZWREQlNvdXJjZVxcJ3MgYHNjaGVtYWAgbXVzdCBiZSBzcGVjaWZpZWQgaW4gYHNldHRpbmdzLnNjaGVtYWAgY29uc3RydWN0b3IgYXJndW1lbnQnLCAhIXNldHRpbmdzLnNjaGVtYSk7XHJcbiAgICBhc3NlcnQoJ1lvdXIgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IEluZGV4ZWREQiEnLCBzdXBwb3J0c0luZGV4ZWREQigpKTtcclxuXHJcbiAgICBzZXR0aW5ncy5uYW1lID0gc2V0dGluZ3MubmFtZSB8fCAnaW5kZXhlZERCJztcclxuXHJcbiAgICBzdXBlcihzZXR0aW5ncyk7XHJcblxyXG4gICAgdGhpcy5fbmFtZXNwYWNlID0gc2V0dGluZ3MubmFtZXNwYWNlIHx8ICdvcmJpdCc7XHJcbiAgfVxyXG5cclxuICB1cGdyYWRlKCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgcmV0dXJuIHRoaXMucmVvcGVuREIoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFRoZSB2ZXJzaW9uIHRvIHNwZWNpZnkgd2hlbiBvcGVuaW5nIHRoZSBJbmRleGVkREIgZGF0YWJhc2UuXHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtJbnRlZ2VyfSBWZXJzaW9uIG51bWJlci5cclxuICAgKi9cclxuICBnZXQgZGJWZXJzaW9uKCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gdGhpcy5fc2NoZW1hLnZlcnNpb247XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBJbmRleGVkREIgZGF0YWJhc2UgbmFtZS5cclxuICAgKlxyXG4gICAqIERlZmF1bHRzIHRvIHRoZSBuYW1lc3BhY2Ugb2YgdGhlIGFwcCwgd2hpY2ggY2FuIGJlIG92ZXJyaWRkZW4gaW4gdGhlIGNvbnN0cnVjdG9yLlxyXG4gICAqXHJcbiAgICogQHJldHVybiB7U3RyaW5nfSBEYXRhYmFzZSBuYW1lLlxyXG4gICAqL1xyXG4gIGdldCBkYk5hbWUoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLl9uYW1lc3BhY2U7XHJcbiAgfVxyXG5cclxuICBnZXQgaXNEQk9wZW4oKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gISF0aGlzLl9kYjtcclxuICB9XHJcblxyXG4gIG9wZW5EQigpOiBQcm9taXNlPGFueT4ge1xyXG4gICAgcmV0dXJuIG5ldyBPcmJpdC5Qcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgaWYgKHRoaXMuX2RiKSB7XHJcbiAgICAgICAgcmVzb2x2ZSh0aGlzLl9kYik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IHJlcXVlc3QgPSBPcmJpdC5nbG9iYWxzLmluZGV4ZWREQi5vcGVuKHRoaXMuZGJOYW1lLCB0aGlzLmRiVmVyc2lvbik7XHJcblxyXG4gICAgICAgIHJlcXVlc3Qub25lcnJvciA9ICgvKiBldmVudCAqLykgPT4ge1xyXG4gICAgICAgICAgLy8gY29uc29sZS5lcnJvcignZXJyb3Igb3BlbmluZyBpbmRleGVkREInLCB0aGlzLmRiTmFtZSk7XHJcbiAgICAgICAgICByZWplY3QocmVxdWVzdC5lcnJvcik7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSAoLyogZXZlbnQgKi8pID0+IHtcclxuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdzdWNjZXNzIG9wZW5pbmcgaW5kZXhlZERCJywgdGhpcy5kYk5hbWUpO1xyXG4gICAgICAgICAgY29uc3QgZGIgPSB0aGlzLl9kYiA9IHJlcXVlc3QucmVzdWx0O1xyXG4gICAgICAgICAgcmVzb2x2ZShkYik7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmVxdWVzdC5vbnVwZ3JhZGVuZWVkZWQgPSAoZXZlbnQpID0+IHtcclxuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdpbmRleGVkREIgdXBncmFkZSBuZWVkZWQnKTtcclxuICAgICAgICAgIGNvbnN0IGRiID0gdGhpcy5fZGIgPSBldmVudC50YXJnZXQucmVzdWx0O1xyXG4gICAgICAgICAgaWYgKGV2ZW50ICYmIGV2ZW50Lm9sZFZlcnNpb24gPiAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMubWlncmF0ZURCKGRiLCBldmVudCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZURCKGRiKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGNsb3NlREIoKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5pc0RCT3Blbikge1xyXG4gICAgICB0aGlzLl9kYi5jbG9zZSgpO1xyXG4gICAgICB0aGlzLl9kYiA9IG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZW9wZW5EQigpOiBQcm9taXNlPGFueT4ge1xyXG4gICAgdGhpcy5jbG9zZURCKCk7XHJcbiAgICByZXR1cm4gdGhpcy5vcGVuREIoKTtcclxuICB9XHJcblxyXG4gIGNyZWF0ZURCKGRiKTogdm9pZCB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnY3JlYXRlREInKTtcclxuICAgIE9iamVjdC5rZXlzKHRoaXMuc2NoZW1hLm1vZGVscykuZm9yRWFjaChtb2RlbCA9PiB7XHJcbiAgICAgIHRoaXMucmVnaXN0ZXJNb2RlbChkYiwgbW9kZWwpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBNaWdyYXRlIGRhdGFiYXNlLlxyXG4gICAqXHJcbiAgICogQHBhcmFtICB7SURCRGF0YWJhc2V9IGRiICAgICAgICAgICAgICBEYXRhYmFzZSB0byB1cGdyYWRlLlxyXG4gICAqIEBwYXJhbSAge0lEQlZlcnNpb25DaGFuZ2VFdmVudH0gZXZlbnQgRXZlbnQgcmVzdWx0aW5nIGZyb20gdmVyc2lvbiBjaGFuZ2UuXHJcbiAgICovXHJcbiAgbWlncmF0ZURCKGRiLCBldmVudCkge1xyXG4gICAgY29uc29sZS5lcnJvcignSW5kZXhlZERCU291cmNlI21pZ3JhdGVEQiAtIHNob3VsZCBiZSBvdmVycmlkZGVuIHRvIHVwZ3JhZGUgSURCRGF0YWJhc2UgZnJvbTogJywgZXZlbnQub2xkVmVyc2lvbiwgJyAtPiAnLCBldmVudC5uZXdWZXJzaW9uKTtcclxuICB9XHJcblxyXG4gIGRlbGV0ZURCKCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgdGhpcy5jbG9zZURCKCk7XHJcblxyXG4gICAgcmV0dXJuIG5ldyBPcmJpdC5Qcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgbGV0IHJlcXVlc3QgPSBPcmJpdC5nbG9iYWxzLmluZGV4ZWREQi5kZWxldGVEYXRhYmFzZSh0aGlzLmRiTmFtZSk7XHJcblxyXG4gICAgICByZXF1ZXN0Lm9uZXJyb3IgPSAoLyogZXZlbnQgKi8pID0+IHtcclxuICAgICAgICAvLyBjb25zb2xlLmVycm9yKCdlcnJvciBkZWxldGluZyBpbmRleGVkREInLCB0aGlzLmRiTmFtZSk7XHJcbiAgICAgICAgcmVqZWN0KHJlcXVlc3QuZXJyb3IpO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSAoLyogZXZlbnQgKi8pID0+IHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnc3VjY2VzcyBkZWxldGluZyBpbmRleGVkREInLCB0aGlzLmRiTmFtZSk7XHJcbiAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICB9O1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICByZWdpc3Rlck1vZGVsKGRiLCBtb2RlbCkge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ3JlZ2lzdGVyTW9kZWwnLCBtb2RlbCk7XHJcbiAgICBkYi5jcmVhdGVPYmplY3RTdG9yZShtb2RlbCwgeyBrZXlQYXRoOiAnaWQnIH0pO1xyXG4gICAgLy8gVE9ETyAtIGNyZWF0ZSBpbmRpY2VzXHJcbiAgfVxyXG5cclxuICBnZXRSZWNvcmQocmVjb3JkKTogUHJvbWlzZTxSZWNvcmQ+IHtcclxuICAgIHJldHVybiBuZXcgT3JiaXQuUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIGNvbnN0IHRyYW5zYWN0aW9uID0gdGhpcy5fZGIudHJhbnNhY3Rpb24oW3JlY29yZC50eXBlXSk7XHJcbiAgICAgIGNvbnN0IG9iamVjdFN0b3JlID0gdHJhbnNhY3Rpb24ub2JqZWN0U3RvcmUocmVjb3JkLnR5cGUpO1xyXG4gICAgICBjb25zdCByZXF1ZXN0ID0gb2JqZWN0U3RvcmUuZ2V0KHJlY29yZC5pZCk7XHJcblxyXG4gICAgICByZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbigvKiBldmVudCAqLykge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ2Vycm9yIC0gZ2V0UmVjb3JkJywgcmVxdWVzdC5lcnJvcik7XHJcbiAgICAgICAgcmVqZWN0KHJlcXVlc3QuZXJyb3IpO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSAoLyogZXZlbnQgKi8pID0+IHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnc3VjY2VzcyAtIGdldFJlY29yZCcsIHJlcXVlc3QucmVzdWx0KTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gcmVxdWVzdC5yZXN1bHQ7XHJcblxyXG4gICAgICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgICAgIGlmICh0aGlzLl9rZXlNYXApIHtcclxuICAgICAgICAgICAgdGhpcy5fa2V5TWFwLnB1c2hSZWNvcmQocmVzdWx0KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmVqZWN0KG5ldyBSZWNvcmROb3RGb3VuZEV4Y2VwdGlvbihyZWNvcmQudHlwZSwgcmVjb3JkLmlkKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRSZWNvcmRzKHR5cGU6IHN0cmluZyk6IFByb21pc2U8UmVjb3JkW10+IHtcclxuICAgIHJldHVybiBuZXcgT3JiaXQuUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIGNvbnN0IHRyYW5zYWN0aW9uID0gdGhpcy5fZGIudHJhbnNhY3Rpb24oW3R5cGVdKTtcclxuICAgICAgY29uc3Qgb2JqZWN0U3RvcmUgPSB0cmFuc2FjdGlvbi5vYmplY3RTdG9yZSh0eXBlKTtcclxuICAgICAgY29uc3QgcmVxdWVzdCA9IG9iamVjdFN0b3JlLm9wZW5DdXJzb3IoKTtcclxuICAgICAgY29uc3QgcmVjb3JkcyA9IFtdO1xyXG5cclxuICAgICAgcmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24oLyogZXZlbnQgKi8pIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKCdlcnJvciAtIGdldFJlY29yZHMnLCByZXF1ZXN0LmVycm9yKTtcclxuICAgICAgICByZWplY3QocmVxdWVzdC5lcnJvcik7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICByZXF1ZXN0Lm9uc3VjY2VzcyA9IChldmVudCkgPT4ge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdzdWNjZXNzIC0gZ2V0UmVjb3JkcycsIHJlcXVlc3QucmVzdWx0KTtcclxuICAgICAgICBjb25zdCBjdXJzb3IgPSBldmVudC50YXJnZXQucmVzdWx0O1xyXG4gICAgICAgIGlmIChjdXJzb3IpIHtcclxuICAgICAgICAgIGxldCByZWNvcmQgPSBjdXJzb3IudmFsdWU7XHJcblxyXG4gICAgICAgICAgaWYgKHRoaXMuX2tleU1hcCkge1xyXG4gICAgICAgICAgICB0aGlzLl9rZXlNYXAucHVzaFJlY29yZChyZWNvcmQpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHJlY29yZHMucHVzaChyZWNvcmQpO1xyXG4gICAgICAgICAgY3Vyc29yLmNvbnRpbnVlKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJlc29sdmUocmVjb3Jkcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXQgYXZhaWxhYmxlVHlwZXMoKTogc3RyaW5nW10ge1xyXG4gICAgY29uc3Qgb2JqZWN0U3RvcmVOYW1lcyA9IHRoaXMuX2RiLm9iamVjdFN0b3JlTmFtZXM7XHJcbiAgICBjb25zdCB0eXBlczogc3RyaW5nW10gPSBbXTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9iamVjdFN0b3JlTmFtZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdHlwZXMucHVzaChvYmplY3RTdG9yZU5hbWVzLml0ZW0oaSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0eXBlcztcclxuICB9XHJcblxyXG4gIHB1dFJlY29yZChyZWNvcmQ6IFJlY29yZCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgY29uc3QgdHJhbnNhY3Rpb24gPSB0aGlzLl9kYi50cmFuc2FjdGlvbihbcmVjb3JkLnR5cGVdLCAncmVhZHdyaXRlJyk7XHJcbiAgICBjb25zdCBvYmplY3RTdG9yZSA9IHRyYW5zYWN0aW9uLm9iamVjdFN0b3JlKHJlY29yZC50eXBlKTtcclxuXHJcbiAgICByZXR1cm4gbmV3IE9yYml0LlByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICBjb25zdCByZXF1ZXN0ID0gb2JqZWN0U3RvcmUucHV0KHJlY29yZCk7XHJcblxyXG4gICAgICByZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbigvKiBldmVudCAqLykge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ2Vycm9yIC0gcHV0UmVjb3JkJywgcmVxdWVzdC5lcnJvcik7XHJcbiAgICAgICAgcmVqZWN0KHJlcXVlc3QuZXJyb3IpO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSAoLyogZXZlbnQgKi8pID0+IHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnc3VjY2VzcyAtIHB1dFJlY29yZCcpO1xyXG4gICAgICAgIGlmICh0aGlzLl9rZXlNYXApIHtcclxuICAgICAgICAgIHRoaXMuX2tleU1hcC5wdXNoUmVjb3JkKHJlY29yZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgIH07XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHJlbW92ZVJlY29yZChyZWNvcmQ6IFJlY29yZCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgcmV0dXJuIG5ldyBPcmJpdC5Qcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgY29uc3QgdHJhbnNhY3Rpb24gPSB0aGlzLl9kYi50cmFuc2FjdGlvbihbcmVjb3JkLnR5cGVdLCAncmVhZHdyaXRlJyk7XHJcbiAgICAgIGNvbnN0IG9iamVjdFN0b3JlID0gdHJhbnNhY3Rpb24ub2JqZWN0U3RvcmUocmVjb3JkLnR5cGUpO1xyXG4gICAgICBjb25zdCByZXF1ZXN0ID0gb2JqZWN0U3RvcmUuZGVsZXRlKHJlY29yZC5pZCk7XHJcblxyXG4gICAgICByZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbigvKiBldmVudCAqLykge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ2Vycm9yIC0gcmVtb3ZlUmVjb3JkJywgcmVxdWVzdC5lcnJvcik7XHJcbiAgICAgICAgcmVqZWN0KHJlcXVlc3QuZXJyb3IpO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSBmdW5jdGlvbigvKiBldmVudCAqLykge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdzdWNjZXNzIC0gcmVtb3ZlUmVjb3JkJyk7XHJcbiAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICB9O1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBjbGVhclJlY29yZHModHlwZTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICBpZiAoIXRoaXMuX2RiKSB7XHJcbiAgICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbmV3IE9yYml0LlByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICBjb25zdCB0cmFuc2FjdGlvbiA9IHRoaXMuX2RiLnRyYW5zYWN0aW9uKFt0eXBlXSwgJ3JlYWR3cml0ZScpO1xyXG4gICAgICBjb25zdCBvYmplY3RTdG9yZSA9IHRyYW5zYWN0aW9uLm9iamVjdFN0b3JlKHR5cGUpO1xyXG4gICAgICBjb25zdCByZXF1ZXN0ID0gb2JqZWN0U3RvcmUuY2xlYXIoKTtcclxuXHJcbiAgICAgIHJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uKC8qIGV2ZW50ICovKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcignZXJyb3IgLSByZW1vdmVSZWNvcmRzJywgcmVxdWVzdC5lcnJvcik7XHJcbiAgICAgICAgcmVqZWN0KHJlcXVlc3QuZXJyb3IpO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSBmdW5jdGlvbigvKiBldmVudCAqLykge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdzdWNjZXNzIC0gcmVtb3ZlUmVjb3JkcycpO1xyXG4gICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgfTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAvLyBSZXNldHRhYmxlIGludGVyZmFjZSBpbXBsZW1lbnRhdGlvblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIHJlc2V0KCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgcmV0dXJuIHRoaXMuZGVsZXRlREIoKTtcclxuICB9XHJcblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgLy8gU3luY2FibGUgaW50ZXJmYWNlIGltcGxlbWVudGF0aW9uXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgX3N5bmModHJhbnNmb3JtOiBUcmFuc2Zvcm0pOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHJldHVybiB0aGlzLl9wcm9jZXNzVHJhbnNmb3JtKHRyYW5zZm9ybSk7XHJcbiAgfVxyXG5cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gIC8vIFB1c2hhYmxlIGludGVyZmFjZSBpbXBsZW1lbnRhdGlvblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIF9wdXNoKHRyYW5zZm9ybTogVHJhbnNmb3JtKTogUHJvbWlzZTxUcmFuc2Zvcm1bXT4ge1xyXG4gICAgcmV0dXJuIHRoaXMuX3Byb2Nlc3NUcmFuc2Zvcm0odHJhbnNmb3JtKVxyXG4gICAgICAudGhlbigoKSA9PiBbdHJhbnNmb3JtXSk7XHJcbiAgfVxyXG5cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gIC8vIFB1bGxhYmxlIGltcGxlbWVudGF0aW9uXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgX3B1bGwocXVlcnk6IFF1ZXJ5KTogUHJvbWlzZTxUcmFuc2Zvcm1bXT4ge1xyXG4gICAgY29uc3Qgb3BlcmF0b3I6IFB1bGxPcGVyYXRvciA9IFB1bGxPcGVyYXRvcnNbcXVlcnkuZXhwcmVzc2lvbi5vcF07XHJcbiAgICBpZiAoIW9wZXJhdG9yKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW5kZXhlZERCU291cmNlIGRvZXMgbm90IHN1cHBvcnQgdGhlIGAke3F1ZXJ5LmV4cHJlc3Npb24ub3B9YCBvcGVyYXRvciBmb3IgcXVlcmllcy4nKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5vcGVuREIoKVxyXG4gICAgICAudGhlbigoKSA9PiBvcGVyYXRvcih0aGlzLCBxdWVyeS5leHByZXNzaW9uKSk7XHJcbiAgfVxyXG5cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gIC8vIFByaXZhdGVcclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICBfcHJvY2Vzc1RyYW5zZm9ybSh0cmFuc2Zvcm06IFRyYW5zZm9ybSk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgcmV0dXJuIHRoaXMub3BlbkRCKClcclxuICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKTtcclxuXHJcbiAgICAgICAgdHJhbnNmb3JtLm9wZXJhdGlvbnMuZm9yRWFjaChvcGVyYXRpb24gPT4ge1xyXG4gICAgICAgICAgbGV0IHByb2Nlc3NvciA9IHRyYW5zZm9ybU9wZXJhdG9yc1tvcGVyYXRpb24ub3BdO1xyXG4gICAgICAgICAgcmVzdWx0ID0gcmVzdWx0LnRoZW4oKCkgPT4gcHJvY2Vzc29yKHRoaXMsIG9wZXJhdGlvbikpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICB9KTtcclxuICB9XHJcbn1cclxuIl19