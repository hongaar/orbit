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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3JjL3NvdXJjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEscUJBWXFCO0FBQ3JCLHNCQUFzQztBQUN0QyxvQ0FBMkQ7QUFDM0QsK0JBQW1FO0FBQ25FLDBCQUFvRDtBQVFwRCxBQUtHOzs7Ozs7QUFJSDtBQUE2QywrQkFBTTtBQWFqRCxBQVFHOzs7Ozs7Ozs7QUFDSCw2QkFBWSxBQUFzQztBQUF0QyxpQ0FBQTtBQUFBLHVCQUFzQzs7QUFBbEQsb0JBU0M7QUFSQyxnQkFBTSxPQUFDLEFBQXlGLDJGQUFFLENBQUMsQ0FBQyxBQUFRLFNBQUMsQUFBTSxBQUFDLEFBQUM7QUFDckgsZ0JBQU0sT0FBQyxBQUEwQyw0Q0FBRSxZQUFpQixBQUFFLEFBQUMsQUFBQztBQUV4RSxBQUFRLGlCQUFDLEFBQUksT0FBRyxBQUFRLFNBQUMsQUFBSSxRQUFJLEFBQVcsQUFBQztBQUU3QyxnQkFBQSxrQkFBTSxBQUFRLEFBQUMsYUFBQztBQUVoQixBQUFJLGNBQUMsQUFBVSxhQUFHLEFBQVEsU0FBQyxBQUFTLGFBQUksQUFBTyxBQUFDO2VBQ2xEO0FBQUM7QUFFRCw4QkFBTyxVQUFQO0FBQ0UsQUFBTSxlQUFDLEFBQUksS0FBQyxBQUFRLEFBQUUsQUFBQyxBQUN6QjtBQUFDO0FBT0QsMEJBQUksMkJBQVM7QUFMYixBQUlHOzs7OzthQUNIO0FBQ0UsQUFBTSxtQkFBQyxBQUFJLEtBQUMsQUFBTyxRQUFDLEFBQU8sQUFBQyxBQUM5QjtBQUFDOztzQkFBQTs7QUFTRCwwQkFBSSwyQkFBTTtBQVBWLEFBTUc7Ozs7Ozs7YUFDSDtBQUNFLEFBQU0sbUJBQUMsQUFBSSxLQUFDLEFBQVUsQUFBQyxBQUN6QjtBQUFDOztzQkFBQTs7QUFFRCwwQkFBSSwyQkFBUTthQUFaO0FBQ0UsQUFBTSxtQkFBQyxDQUFDLENBQUMsQUFBSSxLQUFDLEFBQUcsQUFBQyxBQUNwQjtBQUFDOztzQkFBQTs7QUFFRCw4QkFBTSxTQUFOO0FBQUEsb0JBNkJDO0FBNUJDLEFBQU0sbUJBQUssT0FBSyxRQUFDLEFBQU8sUUFBQyxVQUFDLEFBQU8sU0FBRSxBQUFNO0FBQ3ZDLEFBQUUsQUFBQyxnQkFBQyxBQUFJLE1BQUMsQUFBRyxBQUFDLEtBQUMsQUFBQztBQUNiLEFBQU8sd0JBQUMsQUFBSSxNQUFDLEFBQUcsQUFBQyxBQUFDLEFBQ3BCO0FBQUMsQUFBQyxBQUFJLG1CQUFDLEFBQUM7QUFDTixvQkFBSSxBQUFPLFlBQUcsT0FBSyxRQUFDLEFBQU8sUUFBQyxBQUFTLFVBQUMsQUFBSSxLQUFDLEFBQUksTUFBQyxBQUFNLFFBQUUsQUFBSSxNQUFDLEFBQVMsQUFBQyxBQUFDO0FBRXhFLEFBQU8sMEJBQUMsQUFBTyxVQUFHO0FBQ2hCLEFBQXlEO0FBQ3pELEFBQU0sMkJBQUMsQUFBTyxVQUFDLEFBQUssQUFBQyxBQUFDLEFBQ3hCO0FBQUMsQUFBQztBQUVGLEFBQU8sMEJBQUMsQUFBUyxZQUFHO0FBQ2xCLEFBQXlEO0FBQ3pELHdCQUFNLEFBQUUsS0FBRyxBQUFJLE1BQUMsQUFBRyxNQUFHLEFBQU8sVUFBQyxBQUFNLEFBQUM7QUFDckMsQUFBTyw0QkFBQyxBQUFFLEFBQUMsQUFBQyxBQUNkO0FBQUMsQUFBQztBQUVGLEFBQU8sMEJBQUMsQUFBZSxrQkFBRyxVQUFDLEFBQUs7QUFDOUIsQUFBMkM7QUFDM0Msd0JBQU0sQUFBRSxLQUFHLEFBQUksTUFBQyxBQUFHLE1BQUcsQUFBSyxNQUFDLEFBQU0sT0FBQyxBQUFNLEFBQUM7QUFDMUMsQUFBRSxBQUFDLHdCQUFDLEFBQUssU0FBSSxBQUFLLE1BQUMsQUFBVSxhQUFHLEFBQUMsQUFBQyxHQUFDLEFBQUM7QUFDbEMsQUFBSSw4QkFBQyxBQUFTLFVBQUMsQUFBRSxJQUFFLEFBQUssQUFBQyxBQUFDLEFBQzVCO0FBQUMsQUFBQyxBQUFJLDJCQUFDLEFBQUM7QUFDTixBQUFJLDhCQUFDLEFBQVEsU0FBQyxBQUFFLEFBQUMsQUFBQyxBQUNwQjtBQUFDLEFBQ0g7QUFBQyxBQUFDLEFBQ0o7QUFBQyxBQUNIO0FBQUMsQUFBQyxBQUFDLEFBQ0wsU0E1QlM7QUE0QlI7QUFFRCw4QkFBTyxVQUFQO0FBQ0UsQUFBRSxBQUFDLFlBQUMsQUFBSSxLQUFDLEFBQVEsQUFBQyxVQUFDLEFBQUM7QUFDbEIsQUFBSSxpQkFBQyxBQUFHLElBQUMsQUFBSyxBQUFFLEFBQUM7QUFDakIsQUFBSSxpQkFBQyxBQUFHLE1BQUcsQUFBSSxBQUFDLEFBQ2xCO0FBQUMsQUFDSDtBQUFDO0FBRUQsOEJBQVEsV0FBUjtBQUNFLEFBQUksYUFBQyxBQUFPLEFBQUUsQUFBQztBQUNmLEFBQU0sZUFBQyxBQUFJLEtBQUMsQUFBTSxBQUFFLEFBQUMsQUFDdkI7QUFBQztBQUVELDhCQUFRLFdBQVIsVUFBUyxBQUFFO0FBQVgsb0JBS0M7QUFKQyxBQUEyQjtBQUMzQixBQUFNLGVBQUMsQUFBSSxLQUFDLEFBQUksS0FBQyxBQUFNLE9BQUMsQUFBTSxBQUFDLFFBQUMsQUFBTyxRQUFDLFVBQUEsQUFBSztBQUMzQyxBQUFJLGtCQUFDLEFBQWEsY0FBQyxBQUFFLElBQUUsQUFBSyxBQUFDLEFBQUMsQUFDaEM7QUFBQyxBQUFDLEFBQUMsQUFDTDtBQUFDO0FBRUQsQUFLRzs7Ozs7O0FBQ0gsOEJBQVMsWUFBVCxVQUFVLEFBQUUsSUFBRSxBQUFLO0FBQ2pCLEFBQU8sZ0JBQUMsQUFBSyxNQUFDLEFBQWdGLGtGQUFFLEFBQUssTUFBQyxBQUFVLFlBQUUsQUFBTSxRQUFFLEFBQUssTUFBQyxBQUFVLEFBQUMsQUFBQyxBQUM5STtBQUFDO0FBRUQsOEJBQVEsV0FBUjtBQUFBLG9CQWdCQztBQWZDLEFBQUksYUFBQyxBQUFPLEFBQUUsQUFBQztBQUVmLEFBQU0sbUJBQUssT0FBSyxRQUFDLEFBQU8sUUFBQyxVQUFDLEFBQU8sU0FBRSxBQUFNO0FBQ3ZDLGdCQUFJLEFBQU8sVUFBRyxPQUFLLFFBQUMsQUFBTyxRQUFDLEFBQVMsVUFBQyxBQUFjLGVBQUMsQUFBSSxNQUFDLEFBQU0sQUFBQyxBQUFDO0FBRWxFLEFBQU8sb0JBQUMsQUFBTyxVQUFHO0FBQ2hCLEFBQTBEO0FBQzFELEFBQU0sdUJBQUMsQUFBTyxRQUFDLEFBQUssQUFBQyxBQUFDLEFBQ3hCO0FBQUMsQUFBQztBQUVGLEFBQU8sb0JBQUMsQUFBUyxZQUFHO0FBQ2xCLEFBQTBEO0FBQzFELEFBQU8sQUFBRSxBQUFDLEFBQ1o7QUFBQyxBQUFDLEFBQ0o7QUFBQyxBQUFDLEFBQUMsQUFDTCxTQWJTO0FBYVI7QUFFRCw4QkFBYSxnQkFBYixVQUFjLEFBQUUsSUFBRSxBQUFLO0FBQ3JCLEFBQXVDO0FBQ3ZDLEFBQUUsV0FBQyxBQUFpQixrQkFBQyxBQUFLLE9BQUUsRUFBRSxBQUFPLFNBQUUsQUFBSSxBQUFFLEFBQUMsQUFBQztBQUMvQyxBQUF3QixBQUMxQjtBQUFDO0FBRUQsOEJBQVMsWUFBVCxVQUFVLEFBQU07QUFBaEIsb0JBeUJDO0FBeEJDLEFBQU0sbUJBQUssT0FBSyxRQUFDLEFBQU8sUUFBQyxVQUFDLEFBQU8sU0FBRSxBQUFNO0FBQ3ZDLGdCQUFNLEFBQVcsY0FBRyxBQUFJLE1BQUMsQUFBRyxJQUFDLEFBQVcsWUFBQyxDQUFDLEFBQU0sT0FBQyxBQUFJLEFBQUMsQUFBQyxBQUFDO0FBQ3hELGdCQUFNLEFBQVcsY0FBRyxBQUFXLFlBQUMsQUFBVyxZQUFDLEFBQU0sT0FBQyxBQUFJLEFBQUMsQUFBQztBQUN6RCxnQkFBTSxBQUFPLFVBQUcsQUFBVyxZQUFDLEFBQUcsSUFBQyxBQUFNLE9BQUMsQUFBRSxBQUFDLEFBQUM7QUFFM0MsQUFBTyxvQkFBQyxBQUFPLFVBQUc7QUFDaEIsQUFBTyx3QkFBQyxBQUFLLE1BQUMsQUFBbUIscUJBQUUsQUFBTyxRQUFDLEFBQUssQUFBQyxBQUFDO0FBQ2xELEFBQU0sdUJBQUMsQUFBTyxRQUFDLEFBQUssQUFBQyxBQUFDLEFBQ3hCO0FBQUMsQUFBQztBQUVGLEFBQU8sb0JBQUMsQUFBUyxZQUFHO0FBQ2xCLEFBQXNEO0FBQ3RELG9CQUFJLEFBQU0sU0FBRyxBQUFPLFFBQUMsQUFBTSxBQUFDO0FBRTVCLEFBQUUsQUFBQyxvQkFBQyxBQUFNLEFBQUMsUUFBQyxBQUFDO0FBQ1gsQUFBRSxBQUFDLHdCQUFDLEFBQUksTUFBQyxBQUFPLEFBQUMsU0FBQyxBQUFDO0FBQ2pCLEFBQUksOEJBQUMsQUFBTyxRQUFDLEFBQVUsV0FBQyxBQUFNLEFBQUMsQUFBQyxBQUNsQztBQUFDO0FBQ0QsQUFBTyw0QkFBQyxBQUFNLEFBQUMsQUFBQyxBQUNsQjtBQUFDLEFBQUMsQUFBSSx1QkFBQyxBQUFDO0FBQ04sQUFBTSwyQkFBQyxJQUFJLE9BQXVCLHdCQUFDLEFBQU0sT0FBQyxBQUFJLE1BQUUsQUFBTSxPQUFDLEFBQUUsQUFBQyxBQUFDLEFBQUMsQUFDOUQ7QUFBQyxBQUNIO0FBQUMsQUFBQyxBQUNKO0FBQUMsQUFBQyxBQUFDLEFBQ0wsU0F4QlM7QUF3QlI7QUFFRCw4QkFBVSxhQUFWLFVBQVcsQUFBWTtBQUF2QixvQkE2QkM7QUE1QkMsQUFBTSxtQkFBSyxPQUFLLFFBQUMsQUFBTyxRQUFDLFVBQUMsQUFBTyxTQUFFLEFBQU07QUFDdkMsZ0JBQU0sQUFBVyxjQUFHLEFBQUksTUFBQyxBQUFHLElBQUMsQUFBVyxZQUFDLENBQUMsQUFBSSxBQUFDLEFBQUMsQUFBQztBQUNqRCxnQkFBTSxBQUFXLGNBQUcsQUFBVyxZQUFDLEFBQVcsWUFBQyxBQUFJLEFBQUMsQUFBQztBQUNsRCxnQkFBTSxBQUFPLFVBQUcsQUFBVyxZQUFDLEFBQVUsQUFBRSxBQUFDO0FBQ3pDLGdCQUFNLEFBQU8sVUFBRyxBQUFFLEFBQUM7QUFFbkIsQUFBTyxvQkFBQyxBQUFPLFVBQUc7QUFDaEIsQUFBTyx3QkFBQyxBQUFLLE1BQUMsQUFBb0Isc0JBQUUsQUFBTyxRQUFDLEFBQUssQUFBQyxBQUFDO0FBQ25ELEFBQU0sdUJBQUMsQUFBTyxRQUFDLEFBQUssQUFBQyxBQUFDLEFBQ3hCO0FBQUMsQUFBQztBQUVGLEFBQU8sb0JBQUMsQUFBUyxZQUFHLFVBQUMsQUFBSztBQUN4QixBQUF1RDtBQUN2RCxvQkFBTSxBQUFNLFNBQUcsQUFBSyxNQUFDLEFBQU0sT0FBQyxBQUFNLEFBQUM7QUFDbkMsQUFBRSxBQUFDLG9CQUFDLEFBQU0sQUFBQyxRQUFDLEFBQUM7QUFDWCx3QkFBSSxBQUFNLFNBQUcsQUFBTSxPQUFDLEFBQUssQUFBQztBQUUxQixBQUFFLEFBQUMsd0JBQUMsQUFBSSxNQUFDLEFBQU8sQUFBQyxTQUFDLEFBQUM7QUFDakIsQUFBSSw4QkFBQyxBQUFPLFFBQUMsQUFBVSxXQUFDLEFBQU0sQUFBQyxBQUFDLEFBQ2xDO0FBQUM7QUFFRCxBQUFPLDRCQUFDLEFBQUksS0FBQyxBQUFNLEFBQUMsQUFBQztBQUNyQixBQUFNLDJCQUFDLEFBQVEsQUFBRSxBQUFDLEFBQ3BCO0FBQUMsQUFBQyxBQUFJLHVCQUFDLEFBQUM7QUFDTixBQUFPLDRCQUFDLEFBQU8sQUFBQyxBQUFDLEFBQ25CO0FBQUMsQUFDSDtBQUFDLEFBQUMsQUFDSjtBQUFDLEFBQUMsQUFBQyxBQUNMLFNBNUJTO0FBNEJSO0FBRUQsMEJBQUksMkJBQWM7YUFBbEI7QUFDRSxnQkFBTSxBQUFnQixtQkFBRyxBQUFJLEtBQUMsQUFBRyxJQUFDLEFBQWdCLEFBQUM7QUFDbkQsZ0JBQU0sQUFBSyxRQUFhLEFBQUUsQUFBQztBQUUzQixBQUFHLEFBQUMsaUJBQUMsSUFBSSxBQUFDLElBQUcsQUFBQyxHQUFFLEFBQUMsSUFBRyxBQUFnQixpQkFBQyxBQUFNLFFBQUUsQUFBQyxBQUFFLEtBQUUsQUFBQztBQUNqRCxBQUFLLHNCQUFDLEFBQUksS0FBQyxBQUFnQixpQkFBQyxBQUFJLEtBQUMsQUFBQyxBQUFDLEFBQUMsQUFBQyxBQUN2QztBQUFDO0FBRUQsQUFBTSxtQkFBQyxBQUFLLEFBQUMsQUFDZjtBQUFDOztzQkFBQTs7QUFFRCw4QkFBUyxZQUFULFVBQVUsQUFBYztBQUF4QixvQkFxQkM7QUFwQkMsWUFBTSxBQUFXLGNBQUcsQUFBSSxLQUFDLEFBQUcsSUFBQyxBQUFXLFlBQUMsQ0FBQyxBQUFNLE9BQUMsQUFBSSxBQUFDLE9BQUUsQUFBVyxBQUFDLEFBQUM7QUFDckUsWUFBTSxBQUFXLGNBQUcsQUFBVyxZQUFDLEFBQVcsWUFBQyxBQUFNLE9BQUMsQUFBSSxBQUFDLEFBQUM7QUFFekQsQUFBTSxtQkFBSyxPQUFLLFFBQUMsQUFBTyxRQUFDLFVBQUMsQUFBTyxTQUFFLEFBQU07QUFDdkMsZ0JBQU0sQUFBTyxVQUFHLEFBQVcsWUFBQyxBQUFHLElBQUMsQUFBTSxBQUFDLEFBQUM7QUFFeEMsQUFBTyxvQkFBQyxBQUFPLFVBQUc7QUFDaEIsQUFBTyx3QkFBQyxBQUFLLE1BQUMsQUFBbUIscUJBQUUsQUFBTyxRQUFDLEFBQUssQUFBQyxBQUFDO0FBQ2xELEFBQU0sdUJBQUMsQUFBTyxRQUFDLEFBQUssQUFBQyxBQUFDLEFBQ3hCO0FBQUMsQUFBQztBQUVGLEFBQU8sb0JBQUMsQUFBUyxZQUFHO0FBQ2xCLEFBQXNDO0FBQ3RDLEFBQUUsQUFBQyxvQkFBQyxBQUFJLE1BQUMsQUFBTyxBQUFDLFNBQUMsQUFBQztBQUNqQixBQUFJLDBCQUFDLEFBQU8sUUFBQyxBQUFVLFdBQUMsQUFBTSxBQUFDLEFBQUMsQUFDbEM7QUFBQztBQUVELEFBQU8sQUFBRSxBQUFDLEFBQ1o7QUFBQyxBQUFDLEFBQ0o7QUFBQyxBQUFDLEFBQUMsQUFDTCxTQWpCUztBQWlCUjtBQUVELDhCQUFZLGVBQVosVUFBYSxBQUFjO0FBQTNCLG9CQWdCQztBQWZDLEFBQU0sbUJBQUssT0FBSyxRQUFDLEFBQU8sUUFBQyxVQUFDLEFBQU8sU0FBRSxBQUFNO0FBQ3ZDLGdCQUFNLEFBQVcsY0FBRyxBQUFJLE1BQUMsQUFBRyxJQUFDLEFBQVcsWUFBQyxDQUFDLEFBQU0sT0FBQyxBQUFJLEFBQUMsT0FBRSxBQUFXLEFBQUMsQUFBQztBQUNyRSxnQkFBTSxBQUFXLGNBQUcsQUFBVyxZQUFDLEFBQVcsWUFBQyxBQUFNLE9BQUMsQUFBSSxBQUFDLEFBQUM7QUFDekQsZ0JBQU0sQUFBTyxVQUFHLEFBQVcsWUFBQyxBQUFNLE9BQUMsQUFBTSxPQUFDLEFBQUUsQUFBQyxBQUFDO0FBRTlDLEFBQU8sb0JBQUMsQUFBTyxVQUFHO0FBQ2hCLEFBQU8sd0JBQUMsQUFBSyxNQUFDLEFBQXNCLHdCQUFFLEFBQU8sUUFBQyxBQUFLLEFBQUMsQUFBQztBQUNyRCxBQUFNLHVCQUFDLEFBQU8sUUFBQyxBQUFLLEFBQUMsQUFBQyxBQUN4QjtBQUFDLEFBQUM7QUFFRixBQUFPLG9CQUFDLEFBQVMsWUFBRztBQUNsQixBQUF5QztBQUN6QyxBQUFPLEFBQUUsQUFBQyxBQUNaO0FBQUMsQUFBQyxBQUNKO0FBQUMsQUFBQyxBQUFDLEFBQ0wsU0FmUztBQWVSO0FBRUQsOEJBQVksZUFBWixVQUFhLEFBQVk7QUFBekIsb0JBb0JDO0FBbkJDLEFBQUUsQUFBQyxZQUFDLENBQUMsQUFBSSxLQUFDLEFBQUcsQUFBQyxLQUFDLEFBQUM7QUFDZCxBQUFNLG1CQUFDLE9BQUssUUFBQyxBQUFPLFFBQUMsQUFBTyxBQUFFLEFBQUMsQUFDakM7QUFBQztBQUVELEFBQU0sbUJBQUssT0FBSyxRQUFDLEFBQU8sUUFBQyxVQUFDLEFBQU8sU0FBRSxBQUFNO0FBQ3ZDLGdCQUFNLEFBQVcsY0FBRyxBQUFJLE1BQUMsQUFBRyxJQUFDLEFBQVcsWUFBQyxDQUFDLEFBQUksQUFBQyxPQUFFLEFBQVcsQUFBQyxBQUFDO0FBQzlELGdCQUFNLEFBQVcsY0FBRyxBQUFXLFlBQUMsQUFBVyxZQUFDLEFBQUksQUFBQyxBQUFDO0FBQ2xELGdCQUFNLEFBQU8sVUFBRyxBQUFXLFlBQUMsQUFBSyxBQUFFLEFBQUM7QUFFcEMsQUFBTyxvQkFBQyxBQUFPLFVBQUc7QUFDaEIsQUFBTyx3QkFBQyxBQUFLLE1BQUMsQUFBdUIseUJBQUUsQUFBTyxRQUFDLEFBQUssQUFBQyxBQUFDO0FBQ3RELEFBQU0sdUJBQUMsQUFBTyxRQUFDLEFBQUssQUFBQyxBQUFDLEFBQ3hCO0FBQUMsQUFBQztBQUVGLEFBQU8sb0JBQUMsQUFBUyxZQUFHO0FBQ2xCLEFBQTBDO0FBQzFDLEFBQU8sQUFBRSxBQUFDLEFBQ1o7QUFBQyxBQUFDLEFBQ0o7QUFBQyxBQUFDLEFBQUMsQUFDTCxTQWZTO0FBZVI7QUFFRCxBQUE2RTtBQUM3RSxBQUFzQztBQUN0QyxBQUE2RTtBQUU3RSw4QkFBSyxRQUFMO0FBQ0UsQUFBTSxlQUFDLEFBQUksS0FBQyxBQUFRLEFBQUUsQUFBQyxBQUN6QjtBQUFDO0FBRUQsQUFBNkU7QUFDN0UsQUFBb0M7QUFDcEMsQUFBNkU7QUFFN0UsOEJBQUssUUFBTCxVQUFNLEFBQW9CO0FBQ3hCLEFBQU0sZUFBQyxBQUFJLEtBQUMsQUFBaUIsa0JBQUMsQUFBUyxBQUFDLEFBQUMsQUFDM0M7QUFBQztBQUVELEFBQTZFO0FBQzdFLEFBQW9DO0FBQ3BDLEFBQTZFO0FBRTdFLDhCQUFLLFFBQUwsVUFBTSxBQUFvQjtBQUN4QixBQUFNLG9CQUFNLEFBQWlCLGtCQUFDLEFBQVMsQUFBQyxXQUNyQyxBQUFJLEtBQUM7QUFBTSxtQkFBQSxDQUFBLEFBQUMsQUFBUyxBQUFDO0FBQUEsQUFBQyxBQUFDLEFBQzdCLFNBRlMsQUFBSTtBQUVaO0FBRUQsQUFBNkU7QUFDN0UsQUFBMEI7QUFDMUIsQUFBNkU7QUFFN0UsOEJBQUssUUFBTCxVQUFNLEFBQVk7QUFBbEIsb0JBUUM7QUFQQyxZQUFNLEFBQVEsV0FBaUIsaUJBQWEsY0FBQyxBQUFLLE1BQUMsQUFBVSxXQUFDLEFBQUUsQUFBQyxBQUFDO0FBQ2xFLEFBQUUsQUFBQyxZQUFDLENBQUMsQUFBUSxBQUFDLFVBQUMsQUFBQztBQUNkLGtCQUFNLElBQUksQUFBSyxNQUFDLEFBQXFGLEFBQUMsQUFBQyxBQUN6RztBQUFDO0FBRUQsQUFBTSxvQkFBTSxBQUFNLEFBQUUsU0FDakIsQUFBSSxLQUFDO0FBQU0sbUJBQUEsQUFBUSxTQUFDLEFBQUksT0FBRSxBQUFLLE1BQXBCLEFBQXFCLEFBQVUsQUFBQztBQUFBLEFBQUMsQUFBQyxBQUNsRCxTQUZTLEFBQUk7QUFFWjtBQUVELEFBQTZFO0FBQzdFLEFBQVU7QUFDVixBQUE2RTtBQUU3RSw4QkFBaUIsb0JBQWpCLFVBQWtCLEFBQW9CO0FBQXRDLG9CQVlDO0FBWEMsQUFBTSxvQkFBTSxBQUFNLEFBQUUsU0FDakIsQUFBSSxLQUFDO0FBQ0osZ0JBQUksQUFBTSxTQUFHLE9BQUssUUFBQyxBQUFPLFFBQUMsQUFBTyxBQUFFLEFBQUM7QUFFckMsQUFBUyxzQkFBQyxBQUFVLFdBQUMsQUFBTyxRQUFDLFVBQUEsQUFBUztBQUNwQyxvQkFBSSxBQUFTLFlBQUcsc0JBQWtCLFFBQUMsQUFBUyxVQUFDLEFBQUUsQUFBQyxBQUFDO0FBQ2pELEFBQU0sZ0NBQVUsQUFBSSxLQUFDO0FBQU0sMkJBQUEsQUFBUyxVQUFDLEFBQUksT0FBZCxBQUFnQixBQUFTLEFBQUM7QUFBQSxBQUFDLEFBQUMsQUFDekQsaUJBRFcsQUFBTTtBQUNoQixBQUFDLEFBQUM7QUFFSCxBQUFNLG1CQUFDLEFBQU0sQUFBQyxBQUNoQjtBQUFDLEFBQUMsQUFBQyxBQUNQLFNBWFMsQUFBSTtBQVdaO0FBNVVrQixBQUFlLGtDQUhuQyxPQUFRLFVBQ1IsT0FBUSxVQUNSLE9BQVEsV0FDWSxBQUFlLEFBNlVuQztBQUFELFdBQUM7QUE3VUQsQUE2VUMsRUE3VTRDLE9BQU0sQUE2VWxEO2tCQTdVb0IsQUFBZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBPcmJpdCwge1xyXG4gIHB1bGxhYmxlLCBQdWxsYWJsZSxcclxuICBwdXNoYWJsZSwgUHVzaGFibGUsXHJcbiAgUmVzZXR0YWJsZSxcclxuICBzeW5jYWJsZSwgU3luY2FibGUsXHJcbiAgUXVlcnksXHJcbiAgUXVlcnlPckV4cHJlc3Npb24sXHJcbiAgUmVjb3JkLCBSZWNvcmRJZGVudGl0eSxcclxuICBTb3VyY2UsIFNvdXJjZVNldHRpbmdzLFxyXG4gIFRyYW5zZm9ybSxcclxuICBUcmFuc2Zvcm1Pck9wZXJhdGlvbnMsXHJcbiAgUmVjb3JkTm90Rm91bmRFeGNlcHRpb25cclxufSBmcm9tICdAb3JiaXQvZGF0YSc7XHJcbmltcG9ydCB7IGFzc2VydCB9IGZyb20gJ0BvcmJpdC91dGlscyc7XHJcbmltcG9ydCB0cmFuc2Zvcm1PcGVyYXRvcnMgZnJvbSAnLi9saWIvdHJhbnNmb3JtLW9wZXJhdG9ycyc7XHJcbmltcG9ydCB7IFB1bGxPcGVyYXRvciwgUHVsbE9wZXJhdG9ycyB9IGZyb20gJy4vbGliL3B1bGwtb3BlcmF0b3JzJztcclxuaW1wb3J0IHsgc3VwcG9ydHNJbmRleGVkREIgfSBmcm9tICcuL2xpYi9pbmRleGVkZGInO1xyXG5cclxuZGVjbGFyZSBjb25zdCBjb25zb2xlOiBhbnk7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEluZGV4ZWREQlNvdXJjZVNldHRpbmdzIGV4dGVuZHMgU291cmNlU2V0dGluZ3Mge1xyXG4gIG5hbWVzcGFjZT86IHN0cmluZztcclxufVxyXG5cclxuLyoqXHJcbiAqIFNvdXJjZSBmb3Igc3RvcmluZyBkYXRhIGluIEluZGV4ZWREQi5cclxuICpcclxuICogQGNsYXNzIEluZGV4ZWREQlNvdXJjZVxyXG4gKiBAZXh0ZW5kcyBTb3VyY2VcclxuICovXHJcbkBwdWxsYWJsZVxyXG5AcHVzaGFibGVcclxuQHN5bmNhYmxlXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEluZGV4ZWREQlNvdXJjZSBleHRlbmRzIFNvdXJjZSBpbXBsZW1lbnRzIFB1bGxhYmxlLCBQdXNoYWJsZSwgUmVzZXR0YWJsZSwgU3luY2FibGUge1xyXG4gIHByb3RlY3RlZCBfbmFtZXNwYWNlOiBzdHJpbmc7XHJcbiAgcHJvdGVjdGVkIF9kYjogYW55O1xyXG5cclxuICAvLyBTeW5jYWJsZSBpbnRlcmZhY2Ugc3R1YnNcclxuICBzeW5jOiAodHJhbnNmb3JtT3JUcmFuc2Zvcm1zOiBUcmFuc2Zvcm0gfCBUcmFuc2Zvcm1bXSkgPT4gUHJvbWlzZTx2b2lkPjtcclxuXHJcbiAgLy8gUHVsbGFibGUgaW50ZXJmYWNlIHN0dWJzXHJcbiAgcHVsbDogKHF1ZXJ5T3JFeHByZXNzaW9uOiBRdWVyeU9yRXhwcmVzc2lvbiwgb3B0aW9ucz86IG9iamVjdCwgaWQ/OiBzdHJpbmcpID0+IFByb21pc2U8VHJhbnNmb3JtW10+O1xyXG5cclxuICAvLyBQdXNoYWJsZSBpbnRlcmZhY2Ugc3R1YnNcclxuICBwdXNoOiAodHJhbnNmb3JtT3JPcGVyYXRpb25zOiBUcmFuc2Zvcm1Pck9wZXJhdGlvbnMsIG9wdGlvbnM/OiBvYmplY3QsIGlkPzogc3RyaW5nKSA9PiBQcm9taXNlPFRyYW5zZm9ybVtdPjtcclxuXHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlIGEgbmV3IEluZGV4ZWREQlNvdXJjZS5cclxuICAgKlxyXG4gICAqIEBjb25zdHJ1Y3RvclxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSAgW3NldHRpbmdzID0ge31dXHJcbiAgICogQHBhcmFtIHtTY2hlbWF9ICBbc2V0dGluZ3Muc2NoZW1hXSAgICBPcmJpdCBTY2hlbWEuXHJcbiAgICogQHBhcmFtIHtTdHJpbmd9ICBbc2V0dGluZ3MubmFtZV0gICAgICBPcHRpb25hbC4gTmFtZSBmb3Igc291cmNlLiBEZWZhdWx0cyB0byAnaW5kZXhlZERCJy5cclxuICAgKiBAcGFyYW0ge1N0cmluZ30gIFtzZXR0aW5ncy5uYW1lc3BhY2VdIE9wdGlvbmFsLiBOYW1lc3BhY2Ugb2YgdGhlIGFwcGxpY2F0aW9uLiBXaWxsIGJlIHVzZWQgZm9yIHRoZSBJbmRleGVkREIgZGF0YWJhc2UgbmFtZS4gRGVmYXVsdHMgdG8gJ29yYml0Jy5cclxuICAgKi9cclxuICBjb25zdHJ1Y3RvcihzZXR0aW5nczogSW5kZXhlZERCU291cmNlU2V0dGluZ3MgPSB7fSkge1xyXG4gICAgYXNzZXJ0KCdJbmRleGVkREJTb3VyY2VcXCdzIGBzY2hlbWFgIG11c3QgYmUgc3BlY2lmaWVkIGluIGBzZXR0aW5ncy5zY2hlbWFgIGNvbnN0cnVjdG9yIGFyZ3VtZW50JywgISFzZXR0aW5ncy5zY2hlbWEpO1xyXG4gICAgYXNzZXJ0KCdZb3VyIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCBJbmRleGVkREIhJywgc3VwcG9ydHNJbmRleGVkREIoKSk7XHJcblxyXG4gICAgc2V0dGluZ3MubmFtZSA9IHNldHRpbmdzLm5hbWUgfHwgJ2luZGV4ZWREQic7XHJcblxyXG4gICAgc3VwZXIoc2V0dGluZ3MpO1xyXG5cclxuICAgIHRoaXMuX25hbWVzcGFjZSA9IHNldHRpbmdzLm5hbWVzcGFjZSB8fCAnb3JiaXQnO1xyXG4gIH1cclxuXHJcbiAgdXBncmFkZSgpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHJldHVybiB0aGlzLnJlb3BlbkRCKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBUaGUgdmVyc2lvbiB0byBzcGVjaWZ5IHdoZW4gb3BlbmluZyB0aGUgSW5kZXhlZERCIGRhdGFiYXNlLlxyXG4gICAqXHJcbiAgICogQHJldHVybiB7SW50ZWdlcn0gVmVyc2lvbiBudW1iZXIuXHJcbiAgICovXHJcbiAgZ2V0IGRiVmVyc2lvbigpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIHRoaXMuX3NjaGVtYS52ZXJzaW9uO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogSW5kZXhlZERCIGRhdGFiYXNlIG5hbWUuXHJcbiAgICpcclxuICAgKiBEZWZhdWx0cyB0byB0aGUgbmFtZXNwYWNlIG9mIHRoZSBhcHAsIHdoaWNoIGNhbiBiZSBvdmVycmlkZGVuIGluIHRoZSBjb25zdHJ1Y3Rvci5cclxuICAgKlxyXG4gICAqIEByZXR1cm4ge1N0cmluZ30gRGF0YWJhc2UgbmFtZS5cclxuICAgKi9cclxuICBnZXQgZGJOYW1lKCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5fbmFtZXNwYWNlO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGlzREJPcGVuKCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuICEhdGhpcy5fZGI7XHJcbiAgfVxyXG5cclxuICBvcGVuREIoKTogUHJvbWlzZTxhbnk+IHtcclxuICAgIHJldHVybiBuZXcgT3JiaXQuUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIGlmICh0aGlzLl9kYikge1xyXG4gICAgICAgIHJlc29sdmUodGhpcy5fZGIpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCByZXF1ZXN0ID0gT3JiaXQuZ2xvYmFscy5pbmRleGVkREIub3Blbih0aGlzLmRiTmFtZSwgdGhpcy5kYlZlcnNpb24pO1xyXG5cclxuICAgICAgICByZXF1ZXN0Lm9uZXJyb3IgPSAoLyogZXZlbnQgKi8pID0+IHtcclxuICAgICAgICAgIC8vIGNvbnNvbGUuZXJyb3IoJ2Vycm9yIG9wZW5pbmcgaW5kZXhlZERCJywgdGhpcy5kYk5hbWUpO1xyXG4gICAgICAgICAgcmVqZWN0KHJlcXVlc3QuZXJyb3IpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJlcXVlc3Qub25zdWNjZXNzID0gKC8qIGV2ZW50ICovKSA9PiB7XHJcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZygnc3VjY2VzcyBvcGVuaW5nIGluZGV4ZWREQicsIHRoaXMuZGJOYW1lKTtcclxuICAgICAgICAgIGNvbnN0IGRiID0gdGhpcy5fZGIgPSByZXF1ZXN0LnJlc3VsdDtcclxuICAgICAgICAgIHJlc29sdmUoZGIpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJlcXVlc3Qub251cGdyYWRlbmVlZGVkID0gKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZygnaW5kZXhlZERCIHVwZ3JhZGUgbmVlZGVkJyk7XHJcbiAgICAgICAgICBjb25zdCBkYiA9IHRoaXMuX2RiID0gZXZlbnQudGFyZ2V0LnJlc3VsdDtcclxuICAgICAgICAgIGlmIChldmVudCAmJiBldmVudC5vbGRWZXJzaW9uID4gMCkge1xyXG4gICAgICAgICAgICB0aGlzLm1pZ3JhdGVEQihkYiwgZXZlbnQpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jcmVhdGVEQihkYik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBjbG9zZURCKCk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMuaXNEQk9wZW4pIHtcclxuICAgICAgdGhpcy5fZGIuY2xvc2UoKTtcclxuICAgICAgdGhpcy5fZGIgPSBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVvcGVuREIoKTogUHJvbWlzZTxhbnk+IHtcclxuICAgIHRoaXMuY2xvc2VEQigpO1xyXG4gICAgcmV0dXJuIHRoaXMub3BlbkRCKCk7XHJcbiAgfVxyXG5cclxuICBjcmVhdGVEQihkYik6IHZvaWQge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2NyZWF0ZURCJyk7XHJcbiAgICBPYmplY3Qua2V5cyh0aGlzLnNjaGVtYS5tb2RlbHMpLmZvckVhY2gobW9kZWwgPT4ge1xyXG4gICAgICB0aGlzLnJlZ2lzdGVyTW9kZWwoZGIsIG1vZGVsKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTWlncmF0ZSBkYXRhYmFzZS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSAge0lEQkRhdGFiYXNlfSBkYiAgICAgICAgICAgICAgRGF0YWJhc2UgdG8gdXBncmFkZS5cclxuICAgKiBAcGFyYW0gIHtJREJWZXJzaW9uQ2hhbmdlRXZlbnR9IGV2ZW50IEV2ZW50IHJlc3VsdGluZyBmcm9tIHZlcnNpb24gY2hhbmdlLlxyXG4gICAqL1xyXG4gIG1pZ3JhdGVEQihkYiwgZXZlbnQpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoJ0luZGV4ZWREQlNvdXJjZSNtaWdyYXRlREIgLSBzaG91bGQgYmUgb3ZlcnJpZGRlbiB0byB1cGdyYWRlIElEQkRhdGFiYXNlIGZyb206ICcsIGV2ZW50Lm9sZFZlcnNpb24sICcgLT4gJywgZXZlbnQubmV3VmVyc2lvbik7XHJcbiAgfVxyXG5cclxuICBkZWxldGVEQigpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHRoaXMuY2xvc2VEQigpO1xyXG5cclxuICAgIHJldHVybiBuZXcgT3JiaXQuUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIGxldCByZXF1ZXN0ID0gT3JiaXQuZ2xvYmFscy5pbmRleGVkREIuZGVsZXRlRGF0YWJhc2UodGhpcy5kYk5hbWUpO1xyXG5cclxuICAgICAgcmVxdWVzdC5vbmVycm9yID0gKC8qIGV2ZW50ICovKSA9PiB7XHJcbiAgICAgICAgLy8gY29uc29sZS5lcnJvcignZXJyb3IgZGVsZXRpbmcgaW5kZXhlZERCJywgdGhpcy5kYk5hbWUpO1xyXG4gICAgICAgIHJlamVjdChyZXF1ZXN0LmVycm9yKTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHJlcXVlc3Qub25zdWNjZXNzID0gKC8qIGV2ZW50ICovKSA9PiB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3N1Y2Nlc3MgZGVsZXRpbmcgaW5kZXhlZERCJywgdGhpcy5kYk5hbWUpO1xyXG4gICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgfTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcmVnaXN0ZXJNb2RlbChkYiwgbW9kZWwpIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdyZWdpc3Rlck1vZGVsJywgbW9kZWwpO1xyXG4gICAgZGIuY3JlYXRlT2JqZWN0U3RvcmUobW9kZWwsIHsga2V5UGF0aDogJ2lkJyB9KTtcclxuICAgIC8vIFRPRE8gLSBjcmVhdGUgaW5kaWNlc1xyXG4gIH1cclxuXHJcbiAgZ2V0UmVjb3JkKHJlY29yZCk6IFByb21pc2U8UmVjb3JkPiB7XHJcbiAgICByZXR1cm4gbmV3IE9yYml0LlByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICBjb25zdCB0cmFuc2FjdGlvbiA9IHRoaXMuX2RiLnRyYW5zYWN0aW9uKFtyZWNvcmQudHlwZV0pO1xyXG4gICAgICBjb25zdCBvYmplY3RTdG9yZSA9IHRyYW5zYWN0aW9uLm9iamVjdFN0b3JlKHJlY29yZC50eXBlKTtcclxuICAgICAgY29uc3QgcmVxdWVzdCA9IG9iamVjdFN0b3JlLmdldChyZWNvcmQuaWQpO1xyXG5cclxuICAgICAgcmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24oLyogZXZlbnQgKi8pIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKCdlcnJvciAtIGdldFJlY29yZCcsIHJlcXVlc3QuZXJyb3IpO1xyXG4gICAgICAgIHJlamVjdChyZXF1ZXN0LmVycm9yKTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHJlcXVlc3Qub25zdWNjZXNzID0gKC8qIGV2ZW50ICovKSA9PiB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3N1Y2Nlc3MgLSBnZXRSZWNvcmQnLCByZXF1ZXN0LnJlc3VsdCk7XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IHJlcXVlc3QucmVzdWx0O1xyXG5cclxuICAgICAgICBpZiAocmVzdWx0KSB7XHJcbiAgICAgICAgICBpZiAodGhpcy5fa2V5TWFwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2tleU1hcC5wdXNoUmVjb3JkKHJlc3VsdCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJlamVjdChuZXcgUmVjb3JkTm90Rm91bmRFeGNlcHRpb24ocmVjb3JkLnR5cGUsIHJlY29yZC5pZCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0UmVjb3Jkcyh0eXBlOiBzdHJpbmcpOiBQcm9taXNlPFJlY29yZFtdPiB7XHJcbiAgICByZXR1cm4gbmV3IE9yYml0LlByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICBjb25zdCB0cmFuc2FjdGlvbiA9IHRoaXMuX2RiLnRyYW5zYWN0aW9uKFt0eXBlXSk7XHJcbiAgICAgIGNvbnN0IG9iamVjdFN0b3JlID0gdHJhbnNhY3Rpb24ub2JqZWN0U3RvcmUodHlwZSk7XHJcbiAgICAgIGNvbnN0IHJlcXVlc3QgPSBvYmplY3RTdG9yZS5vcGVuQ3Vyc29yKCk7XHJcbiAgICAgIGNvbnN0IHJlY29yZHMgPSBbXTtcclxuXHJcbiAgICAgIHJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uKC8qIGV2ZW50ICovKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcignZXJyb3IgLSBnZXRSZWNvcmRzJywgcmVxdWVzdC5lcnJvcik7XHJcbiAgICAgICAgcmVqZWN0KHJlcXVlc3QuZXJyb3IpO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSAoZXZlbnQpID0+IHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnc3VjY2VzcyAtIGdldFJlY29yZHMnLCByZXF1ZXN0LnJlc3VsdCk7XHJcbiAgICAgICAgY29uc3QgY3Vyc29yID0gZXZlbnQudGFyZ2V0LnJlc3VsdDtcclxuICAgICAgICBpZiAoY3Vyc29yKSB7XHJcbiAgICAgICAgICBsZXQgcmVjb3JkID0gY3Vyc29yLnZhbHVlO1xyXG5cclxuICAgICAgICAgIGlmICh0aGlzLl9rZXlNYXApIHtcclxuICAgICAgICAgICAgdGhpcy5fa2V5TWFwLnB1c2hSZWNvcmQocmVjb3JkKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICByZWNvcmRzLnB1c2gocmVjb3JkKTtcclxuICAgICAgICAgIGN1cnNvci5jb250aW51ZSgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXNvbHZlKHJlY29yZHMpO1xyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGF2YWlsYWJsZVR5cGVzKCk6IHN0cmluZ1tdIHtcclxuICAgIGNvbnN0IG9iamVjdFN0b3JlTmFtZXMgPSB0aGlzLl9kYi5vYmplY3RTdG9yZU5hbWVzO1xyXG4gICAgY29uc3QgdHlwZXM6IHN0cmluZ1tdID0gW107XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvYmplY3RTdG9yZU5hbWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHR5cGVzLnB1c2gob2JqZWN0U3RvcmVOYW1lcy5pdGVtKGkpKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdHlwZXM7XHJcbiAgfVxyXG5cclxuICBwdXRSZWNvcmQocmVjb3JkOiBSZWNvcmQpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIGNvbnN0IHRyYW5zYWN0aW9uID0gdGhpcy5fZGIudHJhbnNhY3Rpb24oW3JlY29yZC50eXBlXSwgJ3JlYWR3cml0ZScpO1xyXG4gICAgY29uc3Qgb2JqZWN0U3RvcmUgPSB0cmFuc2FjdGlvbi5vYmplY3RTdG9yZShyZWNvcmQudHlwZSk7XHJcblxyXG4gICAgcmV0dXJuIG5ldyBPcmJpdC5Qcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgY29uc3QgcmVxdWVzdCA9IG9iamVjdFN0b3JlLnB1dChyZWNvcmQpO1xyXG5cclxuICAgICAgcmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24oLyogZXZlbnQgKi8pIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKCdlcnJvciAtIHB1dFJlY29yZCcsIHJlcXVlc3QuZXJyb3IpO1xyXG4gICAgICAgIHJlamVjdChyZXF1ZXN0LmVycm9yKTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHJlcXVlc3Qub25zdWNjZXNzID0gKC8qIGV2ZW50ICovKSA9PiB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3N1Y2Nlc3MgLSBwdXRSZWNvcmQnKTtcclxuICAgICAgICBpZiAodGhpcy5fa2V5TWFwKSB7XHJcbiAgICAgICAgICB0aGlzLl9rZXlNYXAucHVzaFJlY29yZChyZWNvcmQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICB9O1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICByZW1vdmVSZWNvcmQocmVjb3JkOiBSZWNvcmQpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHJldHVybiBuZXcgT3JiaXQuUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIGNvbnN0IHRyYW5zYWN0aW9uID0gdGhpcy5fZGIudHJhbnNhY3Rpb24oW3JlY29yZC50eXBlXSwgJ3JlYWR3cml0ZScpO1xyXG4gICAgICBjb25zdCBvYmplY3RTdG9yZSA9IHRyYW5zYWN0aW9uLm9iamVjdFN0b3JlKHJlY29yZC50eXBlKTtcclxuICAgICAgY29uc3QgcmVxdWVzdCA9IG9iamVjdFN0b3JlLmRlbGV0ZShyZWNvcmQuaWQpO1xyXG5cclxuICAgICAgcmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24oLyogZXZlbnQgKi8pIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKCdlcnJvciAtIHJlbW92ZVJlY29yZCcsIHJlcXVlc3QuZXJyb3IpO1xyXG4gICAgICAgIHJlamVjdChyZXF1ZXN0LmVycm9yKTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHJlcXVlc3Qub25zdWNjZXNzID0gZnVuY3Rpb24oLyogZXZlbnQgKi8pIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnc3VjY2VzcyAtIHJlbW92ZVJlY29yZCcpO1xyXG4gICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgfTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgY2xlYXJSZWNvcmRzKHR5cGU6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgaWYgKCF0aGlzLl9kYikge1xyXG4gICAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG5ldyBPcmJpdC5Qcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgY29uc3QgdHJhbnNhY3Rpb24gPSB0aGlzLl9kYi50cmFuc2FjdGlvbihbdHlwZV0sICdyZWFkd3JpdGUnKTtcclxuICAgICAgY29uc3Qgb2JqZWN0U3RvcmUgPSB0cmFuc2FjdGlvbi5vYmplY3RTdG9yZSh0eXBlKTtcclxuICAgICAgY29uc3QgcmVxdWVzdCA9IG9iamVjdFN0b3JlLmNsZWFyKCk7XHJcblxyXG4gICAgICByZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbigvKiBldmVudCAqLykge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ2Vycm9yIC0gcmVtb3ZlUmVjb3JkcycsIHJlcXVlc3QuZXJyb3IpO1xyXG4gICAgICAgIHJlamVjdChyZXF1ZXN0LmVycm9yKTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHJlcXVlc3Qub25zdWNjZXNzID0gZnVuY3Rpb24oLyogZXZlbnQgKi8pIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnc3VjY2VzcyAtIHJlbW92ZVJlY29yZHMnKTtcclxuICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgIH07XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgLy8gUmVzZXR0YWJsZSBpbnRlcmZhY2UgaW1wbGVtZW50YXRpb25cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICByZXNldCgpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHJldHVybiB0aGlzLmRlbGV0ZURCKCk7XHJcbiAgfVxyXG5cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gIC8vIFN5bmNhYmxlIGludGVyZmFjZSBpbXBsZW1lbnRhdGlvblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIF9zeW5jKHRyYW5zZm9ybTogVHJhbnNmb3JtKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICByZXR1cm4gdGhpcy5fcHJvY2Vzc1RyYW5zZm9ybSh0cmFuc2Zvcm0pO1xyXG4gIH1cclxuXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAvLyBQdXNoYWJsZSBpbnRlcmZhY2UgaW1wbGVtZW50YXRpb25cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICBfcHVzaCh0cmFuc2Zvcm06IFRyYW5zZm9ybSk6IFByb21pc2U8VHJhbnNmb3JtW10+IHtcclxuICAgIHJldHVybiB0aGlzLl9wcm9jZXNzVHJhbnNmb3JtKHRyYW5zZm9ybSlcclxuICAgICAgLnRoZW4oKCkgPT4gW3RyYW5zZm9ybV0pO1xyXG4gIH1cclxuXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAvLyBQdWxsYWJsZSBpbXBsZW1lbnRhdGlvblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIF9wdWxsKHF1ZXJ5OiBRdWVyeSk6IFByb21pc2U8VHJhbnNmb3JtW10+IHtcclxuICAgIGNvbnN0IG9wZXJhdG9yOiBQdWxsT3BlcmF0b3IgPSBQdWxsT3BlcmF0b3JzW3F1ZXJ5LmV4cHJlc3Npb24ub3BdO1xyXG4gICAgaWYgKCFvcGVyYXRvcikge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0luZGV4ZWREQlNvdXJjZSBkb2VzIG5vdCBzdXBwb3J0IHRoZSBgJHtxdWVyeS5leHByZXNzaW9uLm9wfWAgb3BlcmF0b3IgZm9yIHF1ZXJpZXMuJyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMub3BlbkRCKClcclxuICAgICAgLnRoZW4oKCkgPT4gb3BlcmF0b3IodGhpcywgcXVlcnkuZXhwcmVzc2lvbikpO1xyXG4gIH1cclxuXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAvLyBQcml2YXRlXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgX3Byb2Nlc3NUcmFuc2Zvcm0odHJhbnNmb3JtOiBUcmFuc2Zvcm0pOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHJldHVybiB0aGlzLm9wZW5EQigpXHJcbiAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCk7XHJcblxyXG4gICAgICAgIHRyYW5zZm9ybS5vcGVyYXRpb25zLmZvckVhY2gob3BlcmF0aW9uID0+IHtcclxuICAgICAgICAgIGxldCBwcm9jZXNzb3IgPSB0cmFuc2Zvcm1PcGVyYXRvcnNbb3BlcmF0aW9uLm9wXTtcclxuICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdC50aGVuKCgpID0+IHByb2Nlc3Nvcih0aGlzLCBvcGVyYXRpb24pKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgfSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==