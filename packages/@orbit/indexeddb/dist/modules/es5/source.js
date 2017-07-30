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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3JjL3NvdXJjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEscUJBV3FCO0FBQ3JCLHNCQUFzQztBQUN0QyxvQ0FBMkQ7QUFDM0QsK0JBQW1FO0FBQ25FLDBCQUFvRDtBQVFwRCxBQUtHOzs7Ozs7QUFJSDtBQUE2QywrQkFBTTtBQWFqRCxBQVFHOzs7Ozs7Ozs7QUFDSCw2QkFBWSxBQUFzQztBQUF0QyxpQ0FBQTtBQUFBLHVCQUFzQzs7QUFBbEQsb0JBV0M7QUFWQyxnQkFBTSxPQUFDLEFBQXlGLDJGQUFFLENBQUMsQ0FBQyxBQUFRLFNBQUMsQUFBTSxBQUFDLEFBQUM7QUFDckgsZ0JBQU0sT0FBQyxBQUEwQyw0Q0FBRSxZQUFpQixBQUFFLEFBQUMsQUFBQztBQUV4RSxBQUFRLGlCQUFDLEFBQUksT0FBRyxBQUFRLFNBQUMsQUFBSSxRQUFJLEFBQVcsQUFBQztBQUU3QyxnQkFBQSxrQkFBTSxBQUFRLEFBQUMsYUFBQztBQUVoQixBQUFJLGNBQUMsQUFBVSxhQUFHLEFBQVEsU0FBQyxBQUFTLGFBQUksQUFBTyxBQUFDO0FBRWhELEFBQUksY0FBQyxBQUFNLE9BQUMsQUFBRSxHQUFDLEFBQVMsV0FBRTtBQUFNLG1CQUFBLEFBQUksTUFBSixBQUFLLEFBQVEsQUFBRTtBQUFBLEFBQUMsQUFBQztlQUNuRDtBQUFDO0FBT0QsMEJBQUksMkJBQVM7QUFMYixBQUlHOzs7OzthQUNIO0FBQ0UsQUFBTSxtQkFBQyxBQUFJLEtBQUMsQUFBTyxRQUFDLEFBQU8sQUFBQyxBQUM5QjtBQUFDOztzQkFBQTs7QUFTRCwwQkFBSSwyQkFBTTtBQVBWLEFBTUc7Ozs7Ozs7YUFDSDtBQUNFLEFBQU0sbUJBQUMsQUFBSSxLQUFDLEFBQVUsQUFBQyxBQUN6QjtBQUFDOztzQkFBQTs7QUFFRCwwQkFBSSwyQkFBUTthQUFaO0FBQ0UsQUFBTSxtQkFBQyxDQUFDLENBQUMsQUFBSSxLQUFDLEFBQUcsQUFBQyxBQUNwQjtBQUFDOztzQkFBQTs7QUFFRCw4QkFBTSxTQUFOO0FBQUEsb0JBNkJDO0FBNUJDLEFBQU0sbUJBQUssT0FBSyxRQUFDLEFBQU8sUUFBQyxVQUFDLEFBQU8sU0FBRSxBQUFNO0FBQ3ZDLEFBQUUsQUFBQyxnQkFBQyxBQUFJLE1BQUMsQUFBRyxBQUFDLEtBQUMsQUFBQztBQUNiLEFBQU8sd0JBQUMsQUFBSSxNQUFDLEFBQUcsQUFBQyxBQUFDLEFBQ3BCO0FBQUMsQUFBQyxBQUFJLG1CQUFDLEFBQUM7QUFDTixvQkFBSSxBQUFPLFlBQUcsT0FBSyxRQUFDLEFBQU8sUUFBQyxBQUFTLFVBQUMsQUFBSSxLQUFDLEFBQUksTUFBQyxBQUFNLFFBQUUsQUFBSSxNQUFDLEFBQVMsQUFBQyxBQUFDO0FBRXhFLEFBQU8sMEJBQUMsQUFBTyxVQUFHO0FBQ2hCLEFBQXlEO0FBQ3pELEFBQU0sMkJBQUMsQUFBTyxVQUFDLEFBQUssQUFBQyxBQUFDLEFBQ3hCO0FBQUMsQUFBQztBQUVGLEFBQU8sMEJBQUMsQUFBUyxZQUFHO0FBQ2xCLEFBQXlEO0FBQ3pELHdCQUFNLEFBQUUsS0FBRyxBQUFJLE1BQUMsQUFBRyxNQUFHLEFBQU8sVUFBQyxBQUFNLEFBQUM7QUFDckMsQUFBTyw0QkFBQyxBQUFFLEFBQUMsQUFBQyxBQUNkO0FBQUMsQUFBQztBQUVGLEFBQU8sMEJBQUMsQUFBZSxrQkFBRyxVQUFDLEFBQUs7QUFDOUIsQUFBMkM7QUFDM0Msd0JBQU0sQUFBRSxLQUFHLEFBQUksTUFBQyxBQUFHLE1BQUcsQUFBSyxNQUFDLEFBQU0sT0FBQyxBQUFNLEFBQUM7QUFDMUMsQUFBRSxBQUFDLHdCQUFDLEFBQUssU0FBSSxBQUFLLE1BQUMsQUFBVSxhQUFHLEFBQUMsQUFBQyxHQUFDLEFBQUM7QUFDbEMsQUFBSSw4QkFBQyxBQUFTLFVBQUMsQUFBRSxJQUFFLEFBQUssQUFBQyxBQUFDLEFBQzVCO0FBQUMsQUFBQyxBQUFJLDJCQUFDLEFBQUM7QUFDTixBQUFJLDhCQUFDLEFBQVEsU0FBQyxBQUFFLEFBQUMsQUFBQyxBQUNwQjtBQUFDLEFBQ0g7QUFBQyxBQUFDLEFBQ0o7QUFBQyxBQUNIO0FBQUMsQUFBQyxBQUFDLEFBQ0wsU0E1QlM7QUE0QlI7QUFFRCw4QkFBTyxVQUFQO0FBQ0UsQUFBRSxBQUFDLFlBQUMsQUFBSSxLQUFDLEFBQVEsQUFBQyxVQUFDLEFBQUM7QUFDbEIsQUFBSSxpQkFBQyxBQUFHLElBQUMsQUFBSyxBQUFFLEFBQUM7QUFDakIsQUFBSSxpQkFBQyxBQUFHLE1BQUcsQUFBSSxBQUFDLEFBQ2xCO0FBQUMsQUFDSDtBQUFDO0FBRUQsOEJBQVEsV0FBUjtBQUNFLEFBQUksYUFBQyxBQUFPLEFBQUUsQUFBQztBQUNmLEFBQU0sZUFBQyxBQUFJLEtBQUMsQUFBTSxBQUFFLEFBQUMsQUFDdkI7QUFBQztBQUVELDhCQUFRLFdBQVIsVUFBUyxBQUFFO0FBQVgsb0JBS0M7QUFKQyxBQUEyQjtBQUMzQixBQUFNLGVBQUMsQUFBSSxLQUFDLEFBQUksS0FBQyxBQUFNLE9BQUMsQUFBTSxBQUFDLFFBQUMsQUFBTyxRQUFDLFVBQUEsQUFBSztBQUMzQyxBQUFJLGtCQUFDLEFBQWEsY0FBQyxBQUFFLElBQUUsQUFBSyxBQUFDLEFBQUMsQUFDaEM7QUFBQyxBQUFDLEFBQUMsQUFDTDtBQUFDO0FBRUQsQUFLRzs7Ozs7O0FBQ0gsOEJBQVMsWUFBVCxVQUFVLEFBQUUsSUFBRSxBQUFLO0FBQ2pCLEFBQU8sZ0JBQUMsQUFBSyxNQUFDLEFBQWdGLGtGQUFFLEFBQUssTUFBQyxBQUFVLFlBQUUsQUFBTSxRQUFFLEFBQUssTUFBQyxBQUFVLEFBQUMsQUFBQyxBQUM5STtBQUFDO0FBRUQsOEJBQVEsV0FBUjtBQUFBLG9CQWdCQztBQWZDLEFBQUksYUFBQyxBQUFPLEFBQUUsQUFBQztBQUVmLEFBQU0sbUJBQUssT0FBSyxRQUFDLEFBQU8sUUFBQyxVQUFDLEFBQU8sU0FBRSxBQUFNO0FBQ3ZDLGdCQUFJLEFBQU8sVUFBRyxPQUFLLFFBQUMsQUFBTyxRQUFDLEFBQVMsVUFBQyxBQUFjLGVBQUMsQUFBSSxNQUFDLEFBQU0sQUFBQyxBQUFDO0FBRWxFLEFBQU8sb0JBQUMsQUFBTyxVQUFHO0FBQ2hCLEFBQTBEO0FBQzFELEFBQU0sdUJBQUMsQUFBTyxRQUFDLEFBQUssQUFBQyxBQUFDLEFBQ3hCO0FBQUMsQUFBQztBQUVGLEFBQU8sb0JBQUMsQUFBUyxZQUFHO0FBQ2xCLEFBQTBEO0FBQzFELEFBQU8sQUFBRSxBQUFDLEFBQ1o7QUFBQyxBQUFDLEFBQ0o7QUFBQyxBQUFDLEFBQUMsQUFDTCxTQWJTO0FBYVI7QUFFRCw4QkFBYSxnQkFBYixVQUFjLEFBQUUsSUFBRSxBQUFLO0FBQ3JCLEFBQXVDO0FBQ3ZDLEFBQUUsV0FBQyxBQUFpQixrQkFBQyxBQUFLLE9BQUUsRUFBRSxBQUFPLFNBQUUsQUFBSSxBQUFFLEFBQUMsQUFBQztBQUMvQyxBQUF3QixBQUMxQjtBQUFDO0FBRUQsOEJBQVMsWUFBVCxVQUFVLEFBQU07QUFBaEIsb0JBc0JDO0FBckJDLEFBQU0sbUJBQUssT0FBSyxRQUFDLEFBQU8sUUFBQyxVQUFDLEFBQU8sU0FBRSxBQUFNO0FBQ3ZDLGdCQUFNLEFBQVcsY0FBRyxBQUFJLE1BQUMsQUFBRyxJQUFDLEFBQVcsWUFBQyxDQUFDLEFBQU0sT0FBQyxBQUFJLEFBQUMsQUFBQyxBQUFDO0FBQ3hELGdCQUFNLEFBQVcsY0FBRyxBQUFXLFlBQUMsQUFBVyxZQUFDLEFBQU0sT0FBQyxBQUFJLEFBQUMsQUFBQztBQUN6RCxnQkFBTSxBQUFPLFVBQUcsQUFBVyxZQUFDLEFBQUcsSUFBQyxBQUFNLE9BQUMsQUFBRSxBQUFDLEFBQUM7QUFFM0MsQUFBTyxvQkFBQyxBQUFPLFVBQUc7QUFDaEIsQUFBTyx3QkFBQyxBQUFLLE1BQUMsQUFBbUIscUJBQUUsQUFBTyxRQUFDLEFBQUssQUFBQyxBQUFDO0FBQ2xELEFBQU0sdUJBQUMsQUFBTyxRQUFDLEFBQUssQUFBQyxBQUFDLEFBQ3hCO0FBQUMsQUFBQztBQUVGLEFBQU8sb0JBQUMsQUFBUyxZQUFHO0FBQ2xCLEFBQXNEO0FBQ3RELG9CQUFJLEFBQU0sU0FBRyxBQUFPLFFBQUMsQUFBTSxBQUFDO0FBRTVCLEFBQUUsQUFBQyxvQkFBQyxBQUFJLE1BQUMsQUFBTyxBQUFDLFNBQUMsQUFBQztBQUNqQixBQUFJLDBCQUFDLEFBQU8sUUFBQyxBQUFVLFdBQUMsQUFBTSxBQUFDLEFBQUMsQUFDbEM7QUFBQztBQUVELEFBQU8sd0JBQUMsQUFBTSxBQUFDLEFBQUMsQUFDbEI7QUFBQyxBQUFDLEFBQ0o7QUFBQyxBQUFDLEFBQUMsQUFDTCxTQXJCUztBQXFCUjtBQUVELDhCQUFVLGFBQVYsVUFBVyxBQUFZO0FBQXZCLG9CQTZCQztBQTVCQyxBQUFNLG1CQUFLLE9BQUssUUFBQyxBQUFPLFFBQUMsVUFBQyxBQUFPLFNBQUUsQUFBTTtBQUN2QyxnQkFBTSxBQUFXLGNBQUcsQUFBSSxNQUFDLEFBQUcsSUFBQyxBQUFXLFlBQUMsQ0FBQyxBQUFJLEFBQUMsQUFBQyxBQUFDO0FBQ2pELGdCQUFNLEFBQVcsY0FBRyxBQUFXLFlBQUMsQUFBVyxZQUFDLEFBQUksQUFBQyxBQUFDO0FBQ2xELGdCQUFNLEFBQU8sVUFBRyxBQUFXLFlBQUMsQUFBVSxBQUFFLEFBQUM7QUFDekMsZ0JBQU0sQUFBTyxVQUFHLEFBQUUsQUFBQztBQUVuQixBQUFPLG9CQUFDLEFBQU8sVUFBRztBQUNoQixBQUFPLHdCQUFDLEFBQUssTUFBQyxBQUFvQixzQkFBRSxBQUFPLFFBQUMsQUFBSyxBQUFDLEFBQUM7QUFDbkQsQUFBTSx1QkFBQyxBQUFPLFFBQUMsQUFBSyxBQUFDLEFBQUMsQUFDeEI7QUFBQyxBQUFDO0FBRUYsQUFBTyxvQkFBQyxBQUFTLFlBQUcsVUFBQyxBQUFLO0FBQ3hCLEFBQXVEO0FBQ3ZELG9CQUFNLEFBQU0sU0FBRyxBQUFLLE1BQUMsQUFBTSxPQUFDLEFBQU0sQUFBQztBQUNuQyxBQUFFLEFBQUMsb0JBQUMsQUFBTSxBQUFDLFFBQUMsQUFBQztBQUNYLHdCQUFJLEFBQU0sU0FBRyxBQUFNLE9BQUMsQUFBSyxBQUFDO0FBRTFCLEFBQUUsQUFBQyx3QkFBQyxBQUFJLE1BQUMsQUFBTyxBQUFDLFNBQUMsQUFBQztBQUNqQixBQUFJLDhCQUFDLEFBQU8sUUFBQyxBQUFVLFdBQUMsQUFBTSxBQUFDLEFBQUMsQUFDbEM7QUFBQztBQUVELEFBQU8sNEJBQUMsQUFBSSxLQUFDLEFBQU0sQUFBQyxBQUFDO0FBQ3JCLEFBQU0sMkJBQUMsQUFBUSxBQUFFLEFBQUMsQUFDcEI7QUFBQyxBQUFDLEFBQUksdUJBQUMsQUFBQztBQUNOLEFBQU8sNEJBQUMsQUFBTyxBQUFDLEFBQUMsQUFDbkI7QUFBQyxBQUNIO0FBQUMsQUFBQyxBQUNKO0FBQUMsQUFBQyxBQUFDLEFBQ0wsU0E1QlM7QUE0QlI7QUFFRCwwQkFBSSwyQkFBYzthQUFsQjtBQUNFLGdCQUFNLEFBQWdCLG1CQUFHLEFBQUksS0FBQyxBQUFHLElBQUMsQUFBZ0IsQUFBQztBQUNuRCxnQkFBTSxBQUFLLFFBQWEsQUFBRSxBQUFDO0FBRTNCLEFBQUcsQUFBQyxpQkFBQyxJQUFJLEFBQUMsSUFBRyxBQUFDLEdBQUUsQUFBQyxJQUFHLEFBQWdCLGlCQUFDLEFBQU0sUUFBRSxBQUFDLEFBQUUsS0FBRSxBQUFDO0FBQ2pELEFBQUssc0JBQUMsQUFBSSxLQUFDLEFBQWdCLGlCQUFDLEFBQUksS0FBQyxBQUFDLEFBQUMsQUFBQyxBQUFDLEFBQ3ZDO0FBQUM7QUFFRCxBQUFNLG1CQUFDLEFBQUssQUFBQyxBQUNmO0FBQUM7O3NCQUFBOztBQUVELDhCQUFTLFlBQVQsVUFBVSxBQUFjO0FBQXhCLG9CQXFCQztBQXBCQyxZQUFNLEFBQVcsY0FBRyxBQUFJLEtBQUMsQUFBRyxJQUFDLEFBQVcsWUFBQyxDQUFDLEFBQU0sT0FBQyxBQUFJLEFBQUMsT0FBRSxBQUFXLEFBQUMsQUFBQztBQUNyRSxZQUFNLEFBQVcsY0FBRyxBQUFXLFlBQUMsQUFBVyxZQUFDLEFBQU0sT0FBQyxBQUFJLEFBQUMsQUFBQztBQUV6RCxBQUFNLG1CQUFLLE9BQUssUUFBQyxBQUFPLFFBQUMsVUFBQyxBQUFPLFNBQUUsQUFBTTtBQUN2QyxnQkFBTSxBQUFPLFVBQUcsQUFBVyxZQUFDLEFBQUcsSUFBQyxBQUFNLEFBQUMsQUFBQztBQUV4QyxBQUFPLG9CQUFDLEFBQU8sVUFBRztBQUNoQixBQUFPLHdCQUFDLEFBQUssTUFBQyxBQUFtQixxQkFBRSxBQUFPLFFBQUMsQUFBSyxBQUFDLEFBQUM7QUFDbEQsQUFBTSx1QkFBQyxBQUFPLFFBQUMsQUFBSyxBQUFDLEFBQUMsQUFDeEI7QUFBQyxBQUFDO0FBRUYsQUFBTyxvQkFBQyxBQUFTLFlBQUc7QUFDbEIsQUFBc0M7QUFDdEMsQUFBRSxBQUFDLG9CQUFDLEFBQUksTUFBQyxBQUFPLEFBQUMsU0FBQyxBQUFDO0FBQ2pCLEFBQUksMEJBQUMsQUFBTyxRQUFDLEFBQVUsV0FBQyxBQUFNLEFBQUMsQUFBQyxBQUNsQztBQUFDO0FBRUQsQUFBTyxBQUFFLEFBQUMsQUFDWjtBQUFDLEFBQUMsQUFDSjtBQUFDLEFBQUMsQUFBQyxBQUNMLFNBakJTO0FBaUJSO0FBRUQsOEJBQVksZUFBWixVQUFhLEFBQWM7QUFBM0Isb0JBZ0JDO0FBZkMsQUFBTSxtQkFBSyxPQUFLLFFBQUMsQUFBTyxRQUFDLFVBQUMsQUFBTyxTQUFFLEFBQU07QUFDdkMsZ0JBQU0sQUFBVyxjQUFHLEFBQUksTUFBQyxBQUFHLElBQUMsQUFBVyxZQUFDLENBQUMsQUFBTSxPQUFDLEFBQUksQUFBQyxPQUFFLEFBQVcsQUFBQyxBQUFDO0FBQ3JFLGdCQUFNLEFBQVcsY0FBRyxBQUFXLFlBQUMsQUFBVyxZQUFDLEFBQU0sT0FBQyxBQUFJLEFBQUMsQUFBQztBQUN6RCxnQkFBTSxBQUFPLFVBQUcsQUFBVyxZQUFDLEFBQU0sT0FBQyxBQUFNLE9BQUMsQUFBRSxBQUFDLEFBQUM7QUFFOUMsQUFBTyxvQkFBQyxBQUFPLFVBQUc7QUFDaEIsQUFBTyx3QkFBQyxBQUFLLE1BQUMsQUFBc0Isd0JBQUUsQUFBTyxRQUFDLEFBQUssQUFBQyxBQUFDO0FBQ3JELEFBQU0sdUJBQUMsQUFBTyxRQUFDLEFBQUssQUFBQyxBQUFDLEFBQ3hCO0FBQUMsQUFBQztBQUVGLEFBQU8sb0JBQUMsQUFBUyxZQUFHO0FBQ2xCLEFBQXlDO0FBQ3pDLEFBQU8sQUFBRSxBQUFDLEFBQ1o7QUFBQyxBQUFDLEFBQ0o7QUFBQyxBQUFDLEFBQUMsQUFDTCxTQWZTO0FBZVI7QUFFRCw4QkFBWSxlQUFaLFVBQWEsQUFBWTtBQUF6QixvQkFvQkM7QUFuQkMsQUFBRSxBQUFDLFlBQUMsQ0FBQyxBQUFJLEtBQUMsQUFBRyxBQUFDLEtBQUMsQUFBQztBQUNkLEFBQU0sbUJBQUMsT0FBSyxRQUFDLEFBQU8sUUFBQyxBQUFPLEFBQUUsQUFBQyxBQUNqQztBQUFDO0FBRUQsQUFBTSxtQkFBSyxPQUFLLFFBQUMsQUFBTyxRQUFDLFVBQUMsQUFBTyxTQUFFLEFBQU07QUFDdkMsZ0JBQU0sQUFBVyxjQUFHLEFBQUksTUFBQyxBQUFHLElBQUMsQUFBVyxZQUFDLENBQUMsQUFBSSxBQUFDLE9BQUUsQUFBVyxBQUFDLEFBQUM7QUFDOUQsZ0JBQU0sQUFBVyxjQUFHLEFBQVcsWUFBQyxBQUFXLFlBQUMsQUFBSSxBQUFDLEFBQUM7QUFDbEQsZ0JBQU0sQUFBTyxVQUFHLEFBQVcsWUFBQyxBQUFLLEFBQUUsQUFBQztBQUVwQyxBQUFPLG9CQUFDLEFBQU8sVUFBRztBQUNoQixBQUFPLHdCQUFDLEFBQUssTUFBQyxBQUF1Qix5QkFBRSxBQUFPLFFBQUMsQUFBSyxBQUFDLEFBQUM7QUFDdEQsQUFBTSx1QkFBQyxBQUFPLFFBQUMsQUFBSyxBQUFDLEFBQUMsQUFDeEI7QUFBQyxBQUFDO0FBRUYsQUFBTyxvQkFBQyxBQUFTLFlBQUc7QUFDbEIsQUFBMEM7QUFDMUMsQUFBTyxBQUFFLEFBQUMsQUFDWjtBQUFDLEFBQUMsQUFDSjtBQUFDLEFBQUMsQUFBQyxBQUNMLFNBZlM7QUFlUjtBQUVELEFBQTZFO0FBQzdFLEFBQXNDO0FBQ3RDLEFBQTZFO0FBRTdFLDhCQUFLLFFBQUw7QUFDRSxBQUFNLGVBQUMsQUFBSSxLQUFDLEFBQVEsQUFBRSxBQUFDLEFBQ3pCO0FBQUM7QUFFRCxBQUE2RTtBQUM3RSxBQUFvQztBQUNwQyxBQUE2RTtBQUU3RSw4QkFBSyxRQUFMLFVBQU0sQUFBb0I7QUFDeEIsQUFBTSxlQUFDLEFBQUksS0FBQyxBQUFpQixrQkFBQyxBQUFTLEFBQUMsQUFBQyxBQUMzQztBQUFDO0FBRUQsQUFBNkU7QUFDN0UsQUFBb0M7QUFDcEMsQUFBNkU7QUFFN0UsOEJBQUssUUFBTCxVQUFNLEFBQW9CO0FBQ3hCLEFBQU0sb0JBQU0sQUFBaUIsa0JBQUMsQUFBUyxBQUFDLFdBQ3JDLEFBQUksS0FBQztBQUFNLG1CQUFBLENBQUEsQUFBQyxBQUFTLEFBQUM7QUFBQSxBQUFDLEFBQUMsQUFDN0IsU0FGUyxBQUFJO0FBRVo7QUFFRCxBQUE2RTtBQUM3RSxBQUEwQjtBQUMxQixBQUE2RTtBQUU3RSw4QkFBSyxRQUFMLFVBQU0sQUFBWTtBQUFsQixvQkFRQztBQVBDLFlBQU0sQUFBUSxXQUFpQixpQkFBYSxjQUFDLEFBQUssTUFBQyxBQUFVLFdBQUMsQUFBRSxBQUFDLEFBQUM7QUFDbEUsQUFBRSxBQUFDLFlBQUMsQ0FBQyxBQUFRLEFBQUMsVUFBQyxBQUFDO0FBQ2Qsa0JBQU0sSUFBSSxBQUFLLE1BQUMsQUFBcUYsQUFBQyxBQUFDLEFBQ3pHO0FBQUM7QUFFRCxBQUFNLG9CQUFNLEFBQU0sQUFBRSxTQUNqQixBQUFJLEtBQUM7QUFBTSxtQkFBQSxBQUFRLFNBQUMsQUFBSSxPQUFFLEFBQUssTUFBcEIsQUFBcUIsQUFBVSxBQUFDO0FBQUEsQUFBQyxBQUFDLEFBQ2xELFNBRlMsQUFBSTtBQUVaO0FBRUQsQUFBNkU7QUFDN0UsQUFBVTtBQUNWLEFBQTZFO0FBRTdFLDhCQUFpQixvQkFBakIsVUFBa0IsQUFBb0I7QUFBdEMsb0JBWUM7QUFYQyxBQUFNLG9CQUFNLEFBQU0sQUFBRSxTQUNqQixBQUFJLEtBQUM7QUFDSixnQkFBSSxBQUFNLFNBQUcsT0FBSyxRQUFDLEFBQU8sUUFBQyxBQUFPLEFBQUUsQUFBQztBQUVyQyxBQUFTLHNCQUFDLEFBQVUsV0FBQyxBQUFPLFFBQUMsVUFBQSxBQUFTO0FBQ3BDLG9CQUFJLEFBQVMsWUFBRyxzQkFBa0IsUUFBQyxBQUFTLFVBQUMsQUFBRSxBQUFDLEFBQUM7QUFDakQsQUFBTSxnQ0FBVSxBQUFJLEtBQUM7QUFBTSwyQkFBQSxBQUFTLFVBQUMsQUFBSSxPQUFkLEFBQWdCLEFBQVMsQUFBQztBQUFBLEFBQUMsQUFBQyxBQUN6RCxpQkFEVyxBQUFNO0FBQ2hCLEFBQUMsQUFBQztBQUVILEFBQU0sbUJBQUMsQUFBTSxBQUFDLEFBQ2hCO0FBQUMsQUFBQyxBQUFDLEFBQ1AsU0FYUyxBQUFJO0FBV1o7QUF2VWtCLEFBQWUsa0NBSG5DLE9BQVEsVUFDUixPQUFRLFVBQ1IsT0FBUSxXQUNZLEFBQWUsQUF3VW5DO0FBQUQsV0FBQztBQXhVRCxBQXdVQyxFQXhVNEMsT0FBTSxBQXdVbEQ7a0JBeFVvQixBQUFlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE9yYml0LCB7XHJcbiAgcHVsbGFibGUsIFB1bGxhYmxlLFxyXG4gIHB1c2hhYmxlLCBQdXNoYWJsZSxcclxuICBSZXNldHRhYmxlLFxyXG4gIHN5bmNhYmxlLCBTeW5jYWJsZSxcclxuICBRdWVyeSxcclxuICBRdWVyeU9yRXhwcmVzc2lvbixcclxuICBSZWNvcmQsIFJlY29yZElkZW50aXR5LFxyXG4gIFNvdXJjZSwgU291cmNlU2V0dGluZ3MsXHJcbiAgVHJhbnNmb3JtLFxyXG4gIFRyYW5zZm9ybU9yT3BlcmF0aW9uc1xyXG59IGZyb20gJ0BvcmJpdC9kYXRhJztcclxuaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSAnQG9yYml0L3V0aWxzJztcclxuaW1wb3J0IHRyYW5zZm9ybU9wZXJhdG9ycyBmcm9tICcuL2xpYi90cmFuc2Zvcm0tb3BlcmF0b3JzJztcclxuaW1wb3J0IHsgUHVsbE9wZXJhdG9yLCBQdWxsT3BlcmF0b3JzIH0gZnJvbSAnLi9saWIvcHVsbC1vcGVyYXRvcnMnO1xyXG5pbXBvcnQgeyBzdXBwb3J0c0luZGV4ZWREQiB9IGZyb20gJy4vbGliL2luZGV4ZWRkYic7XHJcblxyXG5kZWNsYXJlIGNvbnN0IGNvbnNvbGU6IGFueTtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSW5kZXhlZERCU291cmNlU2V0dGluZ3MgZXh0ZW5kcyBTb3VyY2VTZXR0aW5ncyB7XHJcbiAgbmFtZXNwYWNlPzogc3RyaW5nO1xyXG59XHJcblxyXG4vKipcclxuICogU291cmNlIGZvciBzdG9yaW5nIGRhdGEgaW4gSW5kZXhlZERCLlxyXG4gKlxyXG4gKiBAY2xhc3MgSW5kZXhlZERCU291cmNlXHJcbiAqIEBleHRlbmRzIFNvdXJjZVxyXG4gKi9cclxuQHB1bGxhYmxlXHJcbkBwdXNoYWJsZVxyXG5Ac3luY2FibGVcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW5kZXhlZERCU291cmNlIGV4dGVuZHMgU291cmNlIGltcGxlbWVudHMgUHVsbGFibGUsIFB1c2hhYmxlLCBSZXNldHRhYmxlLCBTeW5jYWJsZSB7XHJcbiAgcHJvdGVjdGVkIF9uYW1lc3BhY2U6IHN0cmluZztcclxuICBwcm90ZWN0ZWQgX2RiOiBhbnk7XHJcblxyXG4gIC8vIFN5bmNhYmxlIGludGVyZmFjZSBzdHVic1xyXG4gIHN5bmM6ICh0cmFuc2Zvcm1PclRyYW5zZm9ybXM6IFRyYW5zZm9ybSB8IFRyYW5zZm9ybVtdKSA9PiBQcm9taXNlPHZvaWQ+O1xyXG5cclxuICAvLyBQdWxsYWJsZSBpbnRlcmZhY2Ugc3R1YnNcclxuICBwdWxsOiAocXVlcnlPckV4cHJlc3Npb246IFF1ZXJ5T3JFeHByZXNzaW9uLCBvcHRpb25zPzogb2JqZWN0LCBpZD86IHN0cmluZykgPT4gUHJvbWlzZTxUcmFuc2Zvcm1bXT47XHJcblxyXG4gIC8vIFB1c2hhYmxlIGludGVyZmFjZSBzdHVic1xyXG4gIHB1c2g6ICh0cmFuc2Zvcm1Pck9wZXJhdGlvbnM6IFRyYW5zZm9ybU9yT3BlcmF0aW9ucywgb3B0aW9ucz86IG9iamVjdCwgaWQ/OiBzdHJpbmcpID0+IFByb21pc2U8VHJhbnNmb3JtW10+O1xyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGUgYSBuZXcgSW5kZXhlZERCU291cmNlLlxyXG4gICAqXHJcbiAgICogQGNvbnN0cnVjdG9yXHJcbiAgICogQHBhcmFtIHtPYmplY3R9ICBbc2V0dGluZ3MgPSB7fV1cclxuICAgKiBAcGFyYW0ge1NjaGVtYX0gIFtzZXR0aW5ncy5zY2hlbWFdICAgIE9yYml0IFNjaGVtYS5cclxuICAgKiBAcGFyYW0ge1N0cmluZ30gIFtzZXR0aW5ncy5uYW1lXSAgICAgIE9wdGlvbmFsLiBOYW1lIGZvciBzb3VyY2UuIERlZmF1bHRzIHRvICdpbmRleGVkREInLlxyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSAgW3NldHRpbmdzLm5hbWVzcGFjZV0gT3B0aW9uYWwuIE5hbWVzcGFjZSBvZiB0aGUgYXBwbGljYXRpb24uIFdpbGwgYmUgdXNlZCBmb3IgdGhlIEluZGV4ZWREQiBkYXRhYmFzZSBuYW1lLiBEZWZhdWx0cyB0byAnb3JiaXQnLlxyXG4gICAqL1xyXG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzOiBJbmRleGVkREJTb3VyY2VTZXR0aW5ncyA9IHt9KSB7XHJcbiAgICBhc3NlcnQoJ0luZGV4ZWREQlNvdXJjZVxcJ3MgYHNjaGVtYWAgbXVzdCBiZSBzcGVjaWZpZWQgaW4gYHNldHRpbmdzLnNjaGVtYWAgY29uc3RydWN0b3IgYXJndW1lbnQnLCAhIXNldHRpbmdzLnNjaGVtYSk7XHJcbiAgICBhc3NlcnQoJ1lvdXIgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IEluZGV4ZWREQiEnLCBzdXBwb3J0c0luZGV4ZWREQigpKTtcclxuXHJcbiAgICBzZXR0aW5ncy5uYW1lID0gc2V0dGluZ3MubmFtZSB8fCAnaW5kZXhlZERCJztcclxuXHJcbiAgICBzdXBlcihzZXR0aW5ncyk7XHJcblxyXG4gICAgdGhpcy5fbmFtZXNwYWNlID0gc2V0dGluZ3MubmFtZXNwYWNlIHx8ICdvcmJpdCc7XHJcblxyXG4gICAgdGhpcy5zY2hlbWEub24oJ3VwZ3JhZGUnLCAoKSA9PiB0aGlzLnJlb3BlbkRCKCkpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVGhlIHZlcnNpb24gdG8gc3BlY2lmeSB3aGVuIG9wZW5pbmcgdGhlIEluZGV4ZWREQiBkYXRhYmFzZS5cclxuICAgKlxyXG4gICAqIEByZXR1cm4ge0ludGVnZXJ9IFZlcnNpb24gbnVtYmVyLlxyXG4gICAqL1xyXG4gIGdldCBkYlZlcnNpb24oKTogbnVtYmVyIHtcclxuICAgIHJldHVybiB0aGlzLl9zY2hlbWEudmVyc2lvbjtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEluZGV4ZWREQiBkYXRhYmFzZSBuYW1lLlxyXG4gICAqXHJcbiAgICogRGVmYXVsdHMgdG8gdGhlIG5hbWVzcGFjZSBvZiB0aGUgYXBwLCB3aGljaCBjYW4gYmUgb3ZlcnJpZGRlbiBpbiB0aGUgY29uc3RydWN0b3IuXHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtTdHJpbmd9IERhdGFiYXNlIG5hbWUuXHJcbiAgICovXHJcbiAgZ2V0IGRiTmFtZSgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMuX25hbWVzcGFjZTtcclxuICB9XHJcblxyXG4gIGdldCBpc0RCT3BlbigpOiBib29sZWFuIHtcclxuICAgIHJldHVybiAhIXRoaXMuX2RiO1xyXG4gIH1cclxuXHJcbiAgb3BlbkRCKCk6IFByb21pc2U8YW55PiB7XHJcbiAgICByZXR1cm4gbmV3IE9yYml0LlByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICBpZiAodGhpcy5fZGIpIHtcclxuICAgICAgICByZXNvbHZlKHRoaXMuX2RiKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgcmVxdWVzdCA9IE9yYml0Lmdsb2JhbHMuaW5kZXhlZERCLm9wZW4odGhpcy5kYk5hbWUsIHRoaXMuZGJWZXJzaW9uKTtcclxuXHJcbiAgICAgICAgcmVxdWVzdC5vbmVycm9yID0gKC8qIGV2ZW50ICovKSA9PiB7XHJcbiAgICAgICAgICAvLyBjb25zb2xlLmVycm9yKCdlcnJvciBvcGVuaW5nIGluZGV4ZWREQicsIHRoaXMuZGJOYW1lKTtcclxuICAgICAgICAgIHJlamVjdChyZXF1ZXN0LmVycm9yKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXF1ZXN0Lm9uc3VjY2VzcyA9ICgvKiBldmVudCAqLykgPT4ge1xyXG4gICAgICAgICAgLy8gY29uc29sZS5sb2coJ3N1Y2Nlc3Mgb3BlbmluZyBpbmRleGVkREInLCB0aGlzLmRiTmFtZSk7XHJcbiAgICAgICAgICBjb25zdCBkYiA9IHRoaXMuX2RiID0gcmVxdWVzdC5yZXN1bHQ7XHJcbiAgICAgICAgICByZXNvbHZlKGRiKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXF1ZXN0Lm9udXBncmFkZW5lZWRlZCA9IChldmVudCkgPT4ge1xyXG4gICAgICAgICAgLy8gY29uc29sZS5sb2coJ2luZGV4ZWREQiB1cGdyYWRlIG5lZWRlZCcpO1xyXG4gICAgICAgICAgY29uc3QgZGIgPSB0aGlzLl9kYiA9IGV2ZW50LnRhcmdldC5yZXN1bHQ7XHJcbiAgICAgICAgICBpZiAoZXZlbnQgJiYgZXZlbnQub2xkVmVyc2lvbiA+IDApIHtcclxuICAgICAgICAgICAgdGhpcy5taWdyYXRlREIoZGIsIGV2ZW50KTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlREIoZGIpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgY2xvc2VEQigpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLmlzREJPcGVuKSB7XHJcbiAgICAgIHRoaXMuX2RiLmNsb3NlKCk7XHJcbiAgICAgIHRoaXMuX2RiID0gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlb3BlbkRCKCk6IFByb21pc2U8YW55PiB7XHJcbiAgICB0aGlzLmNsb3NlREIoKTtcclxuICAgIHJldHVybiB0aGlzLm9wZW5EQigpO1xyXG4gIH1cclxuXHJcbiAgY3JlYXRlREIoZGIpOiB2b2lkIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdjcmVhdGVEQicpO1xyXG4gICAgT2JqZWN0LmtleXModGhpcy5zY2hlbWEubW9kZWxzKS5mb3JFYWNoKG1vZGVsID0+IHtcclxuICAgICAgdGhpcy5yZWdpc3Rlck1vZGVsKGRiLCBtb2RlbCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE1pZ3JhdGUgZGF0YWJhc2UuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gIHtJREJEYXRhYmFzZX0gZGIgICAgICAgICAgICAgIERhdGFiYXNlIHRvIHVwZ3JhZGUuXHJcbiAgICogQHBhcmFtICB7SURCVmVyc2lvbkNoYW5nZUV2ZW50fSBldmVudCBFdmVudCByZXN1bHRpbmcgZnJvbSB2ZXJzaW9uIGNoYW5nZS5cclxuICAgKi9cclxuICBtaWdyYXRlREIoZGIsIGV2ZW50KSB7XHJcbiAgICBjb25zb2xlLmVycm9yKCdJbmRleGVkREJTb3VyY2UjbWlncmF0ZURCIC0gc2hvdWxkIGJlIG92ZXJyaWRkZW4gdG8gdXBncmFkZSBJREJEYXRhYmFzZSBmcm9tOiAnLCBldmVudC5vbGRWZXJzaW9uLCAnIC0+ICcsIGV2ZW50Lm5ld1ZlcnNpb24pO1xyXG4gIH1cclxuXHJcbiAgZGVsZXRlREIoKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICB0aGlzLmNsb3NlREIoKTtcclxuXHJcbiAgICByZXR1cm4gbmV3IE9yYml0LlByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICBsZXQgcmVxdWVzdCA9IE9yYml0Lmdsb2JhbHMuaW5kZXhlZERCLmRlbGV0ZURhdGFiYXNlKHRoaXMuZGJOYW1lKTtcclxuXHJcbiAgICAgIHJlcXVlc3Qub25lcnJvciA9ICgvKiBldmVudCAqLykgPT4ge1xyXG4gICAgICAgIC8vIGNvbnNvbGUuZXJyb3IoJ2Vycm9yIGRlbGV0aW5nIGluZGV4ZWREQicsIHRoaXMuZGJOYW1lKTtcclxuICAgICAgICByZWplY3QocmVxdWVzdC5lcnJvcik7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICByZXF1ZXN0Lm9uc3VjY2VzcyA9ICgvKiBldmVudCAqLykgPT4ge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdzdWNjZXNzIGRlbGV0aW5nIGluZGV4ZWREQicsIHRoaXMuZGJOYW1lKTtcclxuICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgIH07XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHJlZ2lzdGVyTW9kZWwoZGIsIG1vZGVsKSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygncmVnaXN0ZXJNb2RlbCcsIG1vZGVsKTtcclxuICAgIGRiLmNyZWF0ZU9iamVjdFN0b3JlKG1vZGVsLCB7IGtleVBhdGg6ICdpZCcgfSk7XHJcbiAgICAvLyBUT0RPIC0gY3JlYXRlIGluZGljZXNcclxuICB9XHJcblxyXG4gIGdldFJlY29yZChyZWNvcmQpOiBQcm9taXNlPFJlY29yZD4ge1xyXG4gICAgcmV0dXJuIG5ldyBPcmJpdC5Qcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgY29uc3QgdHJhbnNhY3Rpb24gPSB0aGlzLl9kYi50cmFuc2FjdGlvbihbcmVjb3JkLnR5cGVdKTtcclxuICAgICAgY29uc3Qgb2JqZWN0U3RvcmUgPSB0cmFuc2FjdGlvbi5vYmplY3RTdG9yZShyZWNvcmQudHlwZSk7XHJcbiAgICAgIGNvbnN0IHJlcXVlc3QgPSBvYmplY3RTdG9yZS5nZXQocmVjb3JkLmlkKTtcclxuXHJcbiAgICAgIHJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uKC8qIGV2ZW50ICovKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcignZXJyb3IgLSBnZXRSZWNvcmQnLCByZXF1ZXN0LmVycm9yKTtcclxuICAgICAgICByZWplY3QocmVxdWVzdC5lcnJvcik7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICByZXF1ZXN0Lm9uc3VjY2VzcyA9ICgvKiBldmVudCAqLykgPT4ge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdzdWNjZXNzIC0gZ2V0UmVjb3JkJywgcmVxdWVzdC5yZXN1bHQpO1xyXG4gICAgICAgIGxldCByZWNvcmQgPSByZXF1ZXN0LnJlc3VsdDtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2tleU1hcCkge1xyXG4gICAgICAgICAgdGhpcy5fa2V5TWFwLnB1c2hSZWNvcmQocmVjb3JkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJlc29sdmUocmVjb3JkKTtcclxuICAgICAgfTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0UmVjb3Jkcyh0eXBlOiBzdHJpbmcpOiBQcm9taXNlPFJlY29yZFtdPiB7XHJcbiAgICByZXR1cm4gbmV3IE9yYml0LlByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICBjb25zdCB0cmFuc2FjdGlvbiA9IHRoaXMuX2RiLnRyYW5zYWN0aW9uKFt0eXBlXSk7XHJcbiAgICAgIGNvbnN0IG9iamVjdFN0b3JlID0gdHJhbnNhY3Rpb24ub2JqZWN0U3RvcmUodHlwZSk7XHJcbiAgICAgIGNvbnN0IHJlcXVlc3QgPSBvYmplY3RTdG9yZS5vcGVuQ3Vyc29yKCk7XHJcbiAgICAgIGNvbnN0IHJlY29yZHMgPSBbXTtcclxuXHJcbiAgICAgIHJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uKC8qIGV2ZW50ICovKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcignZXJyb3IgLSBnZXRSZWNvcmRzJywgcmVxdWVzdC5lcnJvcik7XHJcbiAgICAgICAgcmVqZWN0KHJlcXVlc3QuZXJyb3IpO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSAoZXZlbnQpID0+IHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnc3VjY2VzcyAtIGdldFJlY29yZHMnLCByZXF1ZXN0LnJlc3VsdCk7XHJcbiAgICAgICAgY29uc3QgY3Vyc29yID0gZXZlbnQudGFyZ2V0LnJlc3VsdDtcclxuICAgICAgICBpZiAoY3Vyc29yKSB7XHJcbiAgICAgICAgICBsZXQgcmVjb3JkID0gY3Vyc29yLnZhbHVlO1xyXG5cclxuICAgICAgICAgIGlmICh0aGlzLl9rZXlNYXApIHtcclxuICAgICAgICAgICAgdGhpcy5fa2V5TWFwLnB1c2hSZWNvcmQocmVjb3JkKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICByZWNvcmRzLnB1c2gocmVjb3JkKTtcclxuICAgICAgICAgIGN1cnNvci5jb250aW51ZSgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXNvbHZlKHJlY29yZHMpO1xyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGF2YWlsYWJsZVR5cGVzKCk6IHN0cmluZ1tdIHtcclxuICAgIGNvbnN0IG9iamVjdFN0b3JlTmFtZXMgPSB0aGlzLl9kYi5vYmplY3RTdG9yZU5hbWVzO1xyXG4gICAgY29uc3QgdHlwZXM6IHN0cmluZ1tdID0gW107XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvYmplY3RTdG9yZU5hbWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHR5cGVzLnB1c2gob2JqZWN0U3RvcmVOYW1lcy5pdGVtKGkpKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdHlwZXM7XHJcbiAgfVxyXG5cclxuICBwdXRSZWNvcmQocmVjb3JkOiBSZWNvcmQpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIGNvbnN0IHRyYW5zYWN0aW9uID0gdGhpcy5fZGIudHJhbnNhY3Rpb24oW3JlY29yZC50eXBlXSwgJ3JlYWR3cml0ZScpO1xyXG4gICAgY29uc3Qgb2JqZWN0U3RvcmUgPSB0cmFuc2FjdGlvbi5vYmplY3RTdG9yZShyZWNvcmQudHlwZSk7XHJcblxyXG4gICAgcmV0dXJuIG5ldyBPcmJpdC5Qcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgY29uc3QgcmVxdWVzdCA9IG9iamVjdFN0b3JlLnB1dChyZWNvcmQpO1xyXG5cclxuICAgICAgcmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24oLyogZXZlbnQgKi8pIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKCdlcnJvciAtIHB1dFJlY29yZCcsIHJlcXVlc3QuZXJyb3IpO1xyXG4gICAgICAgIHJlamVjdChyZXF1ZXN0LmVycm9yKTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHJlcXVlc3Qub25zdWNjZXNzID0gKC8qIGV2ZW50ICovKSA9PiB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3N1Y2Nlc3MgLSBwdXRSZWNvcmQnKTtcclxuICAgICAgICBpZiAodGhpcy5fa2V5TWFwKSB7XHJcbiAgICAgICAgICB0aGlzLl9rZXlNYXAucHVzaFJlY29yZChyZWNvcmQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICB9O1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICByZW1vdmVSZWNvcmQocmVjb3JkOiBSZWNvcmQpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHJldHVybiBuZXcgT3JiaXQuUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIGNvbnN0IHRyYW5zYWN0aW9uID0gdGhpcy5fZGIudHJhbnNhY3Rpb24oW3JlY29yZC50eXBlXSwgJ3JlYWR3cml0ZScpO1xyXG4gICAgICBjb25zdCBvYmplY3RTdG9yZSA9IHRyYW5zYWN0aW9uLm9iamVjdFN0b3JlKHJlY29yZC50eXBlKTtcclxuICAgICAgY29uc3QgcmVxdWVzdCA9IG9iamVjdFN0b3JlLmRlbGV0ZShyZWNvcmQuaWQpO1xyXG5cclxuICAgICAgcmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24oLyogZXZlbnQgKi8pIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKCdlcnJvciAtIHJlbW92ZVJlY29yZCcsIHJlcXVlc3QuZXJyb3IpO1xyXG4gICAgICAgIHJlamVjdChyZXF1ZXN0LmVycm9yKTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHJlcXVlc3Qub25zdWNjZXNzID0gZnVuY3Rpb24oLyogZXZlbnQgKi8pIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnc3VjY2VzcyAtIHJlbW92ZVJlY29yZCcpO1xyXG4gICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgfTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgY2xlYXJSZWNvcmRzKHR5cGU6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgaWYgKCF0aGlzLl9kYikge1xyXG4gICAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG5ldyBPcmJpdC5Qcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgY29uc3QgdHJhbnNhY3Rpb24gPSB0aGlzLl9kYi50cmFuc2FjdGlvbihbdHlwZV0sICdyZWFkd3JpdGUnKTtcclxuICAgICAgY29uc3Qgb2JqZWN0U3RvcmUgPSB0cmFuc2FjdGlvbi5vYmplY3RTdG9yZSh0eXBlKTtcclxuICAgICAgY29uc3QgcmVxdWVzdCA9IG9iamVjdFN0b3JlLmNsZWFyKCk7XHJcblxyXG4gICAgICByZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbigvKiBldmVudCAqLykge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ2Vycm9yIC0gcmVtb3ZlUmVjb3JkcycsIHJlcXVlc3QuZXJyb3IpO1xyXG4gICAgICAgIHJlamVjdChyZXF1ZXN0LmVycm9yKTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHJlcXVlc3Qub25zdWNjZXNzID0gZnVuY3Rpb24oLyogZXZlbnQgKi8pIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnc3VjY2VzcyAtIHJlbW92ZVJlY29yZHMnKTtcclxuICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgIH07XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgLy8gUmVzZXR0YWJsZSBpbnRlcmZhY2UgaW1wbGVtZW50YXRpb25cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICByZXNldCgpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHJldHVybiB0aGlzLmRlbGV0ZURCKCk7XHJcbiAgfVxyXG5cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gIC8vIFN5bmNhYmxlIGludGVyZmFjZSBpbXBsZW1lbnRhdGlvblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIF9zeW5jKHRyYW5zZm9ybTogVHJhbnNmb3JtKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICByZXR1cm4gdGhpcy5fcHJvY2Vzc1RyYW5zZm9ybSh0cmFuc2Zvcm0pO1xyXG4gIH1cclxuXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAvLyBQdXNoYWJsZSBpbnRlcmZhY2UgaW1wbGVtZW50YXRpb25cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICBfcHVzaCh0cmFuc2Zvcm06IFRyYW5zZm9ybSk6IFByb21pc2U8VHJhbnNmb3JtW10+IHtcclxuICAgIHJldHVybiB0aGlzLl9wcm9jZXNzVHJhbnNmb3JtKHRyYW5zZm9ybSlcclxuICAgICAgLnRoZW4oKCkgPT4gW3RyYW5zZm9ybV0pO1xyXG4gIH1cclxuXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAvLyBQdWxsYWJsZSBpbXBsZW1lbnRhdGlvblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIF9wdWxsKHF1ZXJ5OiBRdWVyeSk6IFByb21pc2U8VHJhbnNmb3JtW10+IHtcclxuICAgIGNvbnN0IG9wZXJhdG9yOiBQdWxsT3BlcmF0b3IgPSBQdWxsT3BlcmF0b3JzW3F1ZXJ5LmV4cHJlc3Npb24ub3BdO1xyXG4gICAgaWYgKCFvcGVyYXRvcikge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0luZGV4ZWREQlNvdXJjZSBkb2VzIG5vdCBzdXBwb3J0IHRoZSBgJHtxdWVyeS5leHByZXNzaW9uLm9wfWAgb3BlcmF0b3IgZm9yIHF1ZXJpZXMuJyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMub3BlbkRCKClcclxuICAgICAgLnRoZW4oKCkgPT4gb3BlcmF0b3IodGhpcywgcXVlcnkuZXhwcmVzc2lvbikpO1xyXG4gIH1cclxuXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAvLyBQcml2YXRlXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgX3Byb2Nlc3NUcmFuc2Zvcm0odHJhbnNmb3JtOiBUcmFuc2Zvcm0pOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHJldHVybiB0aGlzLm9wZW5EQigpXHJcbiAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCk7XHJcblxyXG4gICAgICAgIHRyYW5zZm9ybS5vcGVyYXRpb25zLmZvckVhY2gob3BlcmF0aW9uID0+IHtcclxuICAgICAgICAgIGxldCBwcm9jZXNzb3IgPSB0cmFuc2Zvcm1PcGVyYXRvcnNbb3BlcmF0aW9uLm9wXTtcclxuICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdC50aGVuKCgpID0+IHByb2Nlc3Nvcih0aGlzLCBvcGVyYXRpb24pKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgfSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==