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
var indexeddb_1 = require("./lib/indexeddb");
/**
 * Bucket for persisting transient data in IndexedDB.
 *
 * @class IndexedDBBucket
 * @extends Bucket
 */
var IndexedDBBucket = function (_super) {
    __extends(IndexedDBBucket, _super);
    /**
     * Create a new IndexedDBBucket.
     *
     * @constructor
     * @param {Object}  [settings = {}]
     * @param {String}  [settings.name]        Optional. Name of this bucket.
     * @param {String}  [settings.namespace]   Optional. Namespace of the bucket. Will be used for the IndexedDB database name. Defaults to 'orbit-bucket'.
     * @param {String}  [settings.storeName]   Optional. Name of the IndexedDB ObjectStore. Defaults to 'data'.
     * @param {Integer} [settings.version]     Optional. The version to open the IndexedDB database with. Defaults to `1`.
     */
    function IndexedDBBucket(settings) {
        if (settings === void 0) {
            settings = {};
        }
        var _this = this;
        utils_1.assert('Your browser does not support IndexedDB!', indexeddb_1.supportsIndexedDB());
        settings.name = settings.name || 'indexedDB';
        settings.storeName = settings.storeName || 'data';
        _this = _super.call(this, settings) || this;
        return _this;
    }
    IndexedDBBucket.prototype.upgrade = function (settings) {
        var _this = this;
        this.closeDB();
        return _super.prototype.upgrade.call(this, settings).then(function () {
            return _this.openDB();
        });
    };
    IndexedDBBucket.prototype._applySettings = function (settings) {
        this._storeName = settings.storeName;
        return _super.prototype._applySettings.call(this, settings);
    };
    Object.defineProperty(IndexedDBBucket.prototype, "dbVersion", {
        /**
         * The version to specify when opening the IndexedDB database.
         *
         * IndexedDB's default verions is 1.
         *
         * @return {Integer} Version number.
         */
        get: function () {
            return this.version;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IndexedDBBucket.prototype, "dbName", {
        /**
         * IndexedDB database name.
         *
         * Defaults to 'orbit-bucket', which can be overridden in the constructor.
         *
         * @return {String} Database name.
         */
        get: function () {
            return this.namespace;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IndexedDBBucket.prototype, "dbStoreName", {
        /**
         * IndexedDB ObjectStore name.
         *
         * Defaults to 'settings', which can be overridden in the constructor.
         *
         * @return {String} Database name.
         */
        get: function () {
            return this._storeName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IndexedDBBucket.prototype, "isDBOpen", {
        get: function () {
            return !!this._db;
        },
        enumerable: true,
        configurable: true
    });
    IndexedDBBucket.prototype.openDB = function () {
        var _this = this;
        return new core_1.default.Promise(function (resolve, reject) {
            if (_this._db) {
                resolve(_this._db);
            } else {
                var request_1 = core_1.default.globals.indexedDB.open(_this.dbName, _this.dbVersion);
                request_1.onerror = function () {
                    console.error('error opening indexedDB', _this.dbName);
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
    IndexedDBBucket.prototype.closeDB = function () {
        if (this.isDBOpen) {
            this._db.close();
            this._db = null;
        }
    };
    IndexedDBBucket.prototype.reopenDB = function () {
        this.closeDB();
        return this.openDB();
    };
    IndexedDBBucket.prototype.createDB = function (db) {
        db.createObjectStore(this.dbStoreName); //, { keyPath: 'key' });
    };
    /**
     * Migrate database.
     *
     * @param  {IDBDatabase} db              Database to upgrade.
     * @param  {IDBVersionChangeEvent} event Event resulting from version change.
     */
    IndexedDBBucket.prototype.migrateDB = function (db, event) {
        console.error('IndexedDBBucket#migrateDB - should be overridden to upgrade IDBDatabase from: ', event.oldVersion, ' -> ', event.newVersion);
    };
    IndexedDBBucket.prototype.deleteDB = function () {
        var _this = this;
        this.closeDB();
        return new core_1.default.Promise(function (resolve, reject) {
            var request = core_1.default.globals.indexedDB.deleteDatabase(_this.dbName);
            request.onerror = function () {
                console.error('error deleting indexedDB', _this.dbName);
                reject(request.error);
            };
            request.onsuccess = function () {
                // console.log('success deleting indexedDB', this.dbName);
                _this._db = null;
                resolve();
            };
        });
    };
    IndexedDBBucket.prototype.getItem = function (key) {
        var _this = this;
        return this.openDB().then(function () {
            return new core_1.default.Promise(function (resolve, reject) {
                var transaction = _this._db.transaction([_this.dbStoreName]);
                var objectStore = transaction.objectStore(_this.dbStoreName);
                var request = objectStore.get(key);
                request.onerror = function () {
                    console.error('error - getItem', request.error);
                    reject(request.error);
                };
                request.onsuccess = function () {
                    // console.log('success - getItem', request.result);
                    resolve(request.result);
                };
            });
        });
    };
    IndexedDBBucket.prototype.setItem = function (key, value) {
        var _this = this;
        return this.openDB().then(function () {
            var transaction = _this._db.transaction([_this.dbStoreName], 'readwrite');
            var objectStore = transaction.objectStore(_this.dbStoreName);
            return new core_1.default.Promise(function (resolve, reject) {
                var request = objectStore.put(value, key);
                request.onerror = function () {
                    console.error('error - setItem', request.error);
                    reject(request.error);
                };
                request.onsuccess = function () {
                    // console.log('success - setItem');
                    resolve();
                };
            });
        });
    };
    IndexedDBBucket.prototype.removeItem = function (key) {
        var _this = this;
        return this.openDB().then(function () {
            return new core_1.default.Promise(function (resolve, reject) {
                var transaction = _this._db.transaction([_this.dbStoreName], 'readwrite');
                var objectStore = transaction.objectStore(_this.dbStoreName);
                var request = objectStore.delete(key);
                request.onerror = function () {
                    console.error('error - removeItem', request.error);
                    reject(request.error);
                };
                request.onsuccess = function () {
                    // console.log('success - removeItem');
                    resolve();
                };
            });
        });
    };
    return IndexedDBBucket;
}(core_1.Bucket);
exports.default = IndexedDBBucket;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVja2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3JjL2J1Y2tldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEscUJBRXFCO0FBQ3JCLHNCQUFzQztBQUN0QywwQkFBb0Q7QUFRcEQsQUFLRzs7Ozs7O0FBQ0gsd0NBQTZDOytCQUFNLEFBSWpELEFBU0c7QUFDSDs7Ozs7Ozs7Ozs2QkFBWSxBQUFzQyxVQUF0QztpQ0FBQTt1QkFBc0M7QUFBbEQ7b0JBQ0UsQUFNRDtnQkFOTyxPQUFDLEFBQTBDLDRDQUFFLFlBQWlCLEFBQUUsQUFBQyxBQUFDLEFBRXhFLEFBQVE7aUJBQUMsQUFBSSxPQUFHLEFBQVEsU0FBQyxBQUFJLFFBQUksQUFBVyxBQUFDLEFBQzdDLEFBQVE7aUJBQUMsQUFBUyxZQUFHLEFBQVEsU0FBQyxBQUFTLGFBQUksQUFBTSxBQUFDLEFBRWxEO2dCQUFBLGtCQUFNLEFBQVEsQUFBQyxhQUFDO2VBQ2xCLEFBQUM7QUFFRDs4QkFBTyxVQUFQLFVBQVEsQUFBaUMsVUFBekM7b0JBQ0UsQUFBSSxBQUdMO2FBSE0sQUFBTyxBQUFFLEFBQUMsQUFDZixBQUFNO2dDQUFPLEFBQU8sbUJBQUMsQUFBUSxBQUFDLFVBQzNCLEFBQUksS0FBQyxZQUFNO21CQUFBLEFBQUksTUFBSixBQUFLLEFBQU0sQUFBRSxBQUFDLEFBQUMsQUFDL0I7QUFGUyxBQUVSO0FBRUQ7OEJBQWMsaUJBQWQsVUFBZSxBQUFpQyxVQUM5QyxBQUFJO2FBQUMsQUFBVSxhQUFHLEFBQVEsU0FBQyxBQUFTLEFBQUMsQUFDckMsQUFBTTtlQUFDLGlCQUFNLEFBQWMsMEJBQUMsQUFBUSxBQUFDLEFBQUMsQUFDeEMsQUFBQztBQVNEOzBCQUFJLDJCQUFTOzs7Ozs7OzthQUFiLFlBQ0UsQUFBTTttQkFBQyxBQUFJLEtBQUMsQUFBTyxBQUFDLEFBQ3RCLEFBQUM7OztzQkFBQSxBQVNEO0FBbEJBLEFBTUc7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LEFBQ1A7QUFuQlMsQUFBSSxBQW1CWjtBQUVEOzhCQUFVLGFBQVYsVUFBVyxBQUFXLEtBQXRCO29CQUNFLEFBQU0sQUFrQlA7b0JBbEJhLEFBQU0sQUFBRSxTQUNqQixBQUFJLEtBQUMsWUFDSixBQUFNO3VCQUFLLE9BQUssUUFBQyxBQUFPLFFBQUMsVUFBQyxBQUFPLFNBQUUsQUFBTSxRQUN2QztvQkFBTSxBQUFXLGNBQUcsQUFBSSxNQUFDLEFBQUcsSUFBQyxBQUFXLFlBQUMsQ0FBQyxBQUFJLE1BQUMsQUFBVyxBQUFDLGNBQUUsQUFBVyxBQUFDLEFBQUMsQUFDMUU7b0JBQU0sQUFBVyxjQUFHLEFBQVcsWUFBQyxBQUFXLFlBQUMsQUFBSSxNQUFDLEFBQVcsQUFBQyxBQUFDLEFBQzlEO29CQUFNLEFBQU8sVUFBRyxBQUFXLFlBQUMsQUFBTSxPQUFDLEFBQUcsQUFBQyxBQUFDLEFBRXhDLEFBQU87d0JBQUMsQUFBTyxVQUFHLFlBQ2hCLEFBQU87NEJBQUMsQUFBSyxNQUFDLEFBQW9CLHNCQUFFLEFBQU8sUUFBQyxBQUFLLEFBQUMsQUFBQyxBQUNuRCxBQUFNOzJCQUFDLEFBQU8sUUFBQyxBQUFLLEFBQUMsQUFBQyxBQUN4QixBQUFDLEFBQUM7QUFFRixBQUFPO3dCQUFDLEFBQVMsWUFBRyxZQUNsQixBQUF1QztBQUN2QyxBQUFPLEFBQUUsQUFBQyxBQUNaO0FBQUMsQUFBQyxBQUNKO0FBQUMsQUFBQyxBQUFDLEFBQ0w7QUFmUyxBQWVSLEFBQUMsQUFBQyxBQUNQO0FBbEJTLEFBQUksQUFrQlo7QUFDSDtXQWxOQSxBQWtOQSxBQUFDO0VBbE40QyxPQUFNLEFBa05sRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBPcmJpdCwge1xyXG4gIEJ1Y2tldCwgQnVja2V0U2V0dGluZ3NcclxufSBmcm9tICdAb3JiaXQvY29yZSc7XHJcbmltcG9ydCB7IGFzc2VydCB9IGZyb20gJ0BvcmJpdC91dGlscyc7XHJcbmltcG9ydCB7IHN1cHBvcnRzSW5kZXhlZERCIH0gZnJvbSAnLi9saWIvaW5kZXhlZGRiJztcclxuXHJcbmRlY2xhcmUgY29uc3QgY29uc29sZTogYW55O1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJbmRleGVkREJCdWNrZXRTZXR0aW5ncyBleHRlbmRzIEJ1Y2tldFNldHRpbmdzIHtcclxuICBzdG9yZU5hbWU/OiBzdHJpbmc7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBCdWNrZXQgZm9yIHBlcnNpc3RpbmcgdHJhbnNpZW50IGRhdGEgaW4gSW5kZXhlZERCLlxyXG4gKlxyXG4gKiBAY2xhc3MgSW5kZXhlZERCQnVja2V0XHJcbiAqIEBleHRlbmRzIEJ1Y2tldFxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW5kZXhlZERCQnVja2V0IGV4dGVuZHMgQnVja2V0IHtcclxuICBwcm90ZWN0ZWQgX3N0b3JlTmFtZTogc3RyaW5nO1xyXG4gIHByb3RlY3RlZCBfZGI6IGFueTtcclxuXHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlIGEgbmV3IEluZGV4ZWREQkJ1Y2tldC5cclxuICAgKlxyXG4gICAqIEBjb25zdHJ1Y3RvclxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSAgW3NldHRpbmdzID0ge31dXHJcbiAgICogQHBhcmFtIHtTdHJpbmd9ICBbc2V0dGluZ3MubmFtZV0gICAgICAgIE9wdGlvbmFsLiBOYW1lIG9mIHRoaXMgYnVja2V0LlxyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSAgW3NldHRpbmdzLm5hbWVzcGFjZV0gICBPcHRpb25hbC4gTmFtZXNwYWNlIG9mIHRoZSBidWNrZXQuIFdpbGwgYmUgdXNlZCBmb3IgdGhlIEluZGV4ZWREQiBkYXRhYmFzZSBuYW1lLiBEZWZhdWx0cyB0byAnb3JiaXQtYnVja2V0Jy5cclxuICAgKiBAcGFyYW0ge1N0cmluZ30gIFtzZXR0aW5ncy5zdG9yZU5hbWVdICAgT3B0aW9uYWwuIE5hbWUgb2YgdGhlIEluZGV4ZWREQiBPYmplY3RTdG9yZS4gRGVmYXVsdHMgdG8gJ2RhdGEnLlxyXG4gICAqIEBwYXJhbSB7SW50ZWdlcn0gW3NldHRpbmdzLnZlcnNpb25dICAgICBPcHRpb25hbC4gVGhlIHZlcnNpb24gdG8gb3BlbiB0aGUgSW5kZXhlZERCIGRhdGFiYXNlIHdpdGguIERlZmF1bHRzIHRvIGAxYC5cclxuICAgKi9cclxuICBjb25zdHJ1Y3RvcihzZXR0aW5nczogSW5kZXhlZERCQnVja2V0U2V0dGluZ3MgPSB7fSkge1xyXG4gICAgYXNzZXJ0KCdZb3VyIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCBJbmRleGVkREIhJywgc3VwcG9ydHNJbmRleGVkREIoKSk7XHJcblxyXG4gICAgc2V0dGluZ3MubmFtZSA9IHNldHRpbmdzLm5hbWUgfHwgJ2luZGV4ZWREQic7XHJcbiAgICBzZXR0aW5ncy5zdG9yZU5hbWUgPSBzZXR0aW5ncy5zdG9yZU5hbWUgfHwgJ2RhdGEnO1xyXG5cclxuICAgIHN1cGVyKHNldHRpbmdzKTtcclxuICB9XHJcblxyXG4gIHVwZ3JhZGUoc2V0dGluZ3M6IEluZGV4ZWREQkJ1Y2tldFNldHRpbmdzKSB7XHJcbiAgICB0aGlzLmNsb3NlREIoKTtcclxuICAgIHJldHVybiBzdXBlci51cGdyYWRlKHNldHRpbmdzKVxyXG4gICAgICAudGhlbigoKSA9PiB0aGlzLm9wZW5EQigpKTtcclxuICB9XHJcblxyXG4gIF9hcHBseVNldHRpbmdzKHNldHRpbmdzOiBJbmRleGVkREJCdWNrZXRTZXR0aW5ncykge1xyXG4gICAgdGhpcy5fc3RvcmVOYW1lID0gc2V0dGluZ3Muc3RvcmVOYW1lO1xyXG4gICAgcmV0dXJuIHN1cGVyLl9hcHBseVNldHRpbmdzKHNldHRpbmdzKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFRoZSB2ZXJzaW9uIHRvIHNwZWNpZnkgd2hlbiBvcGVuaW5nIHRoZSBJbmRleGVkREIgZGF0YWJhc2UuXHJcbiAgICpcclxuICAgKiBJbmRleGVkREIncyBkZWZhdWx0IHZlcmlvbnMgaXMgMS5cclxuICAgKlxyXG4gICAqIEByZXR1cm4ge0ludGVnZXJ9IFZlcnNpb24gbnVtYmVyLlxyXG4gICAqL1xyXG4gIGdldCBkYlZlcnNpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy52ZXJzaW9uO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogSW5kZXhlZERCIGRhdGFiYXNlIG5hbWUuXHJcbiAgICpcclxuICAgKiBEZWZhdWx0cyB0byAnb3JiaXQtYnVja2V0Jywgd2hpY2ggY2FuIGJlIG92ZXJyaWRkZW4gaW4gdGhlIGNvbnN0cnVjdG9yLlxyXG4gICAqXHJcbiAgICogQHJldHVybiB7U3RyaW5nfSBEYXRhYmFzZSBuYW1lLlxyXG4gICAqL1xyXG4gIGdldCBkYk5hbWUoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5uYW1lc3BhY2U7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBJbmRleGVkREIgT2JqZWN0U3RvcmUgbmFtZS5cclxuICAgKlxyXG4gICAqIERlZmF1bHRzIHRvICdzZXR0aW5ncycsIHdoaWNoIGNhbiBiZSBvdmVycmlkZGVuIGluIHRoZSBjb25zdHJ1Y3Rvci5cclxuICAgKlxyXG4gICAqIEByZXR1cm4ge1N0cmluZ30gRGF0YWJhc2UgbmFtZS5cclxuICAgKi9cclxuICBnZXQgZGJTdG9yZU5hbWUoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fc3RvcmVOYW1lO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGlzREJPcGVuKCkge1xyXG4gICAgcmV0dXJuICEhdGhpcy5fZGI7XHJcbiAgfVxyXG5cclxuICBvcGVuREIoKSB7XHJcbiAgICByZXR1cm4gbmV3IE9yYml0LlByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICBpZiAodGhpcy5fZGIpIHtcclxuICAgICAgICByZXNvbHZlKHRoaXMuX2RiKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgcmVxdWVzdCA9IE9yYml0Lmdsb2JhbHMuaW5kZXhlZERCLm9wZW4odGhpcy5kYk5hbWUsIHRoaXMuZGJWZXJzaW9uKTtcclxuXHJcbiAgICAgICAgcmVxdWVzdC5vbmVycm9yID0gKC8qIGV2ZW50ICovKSA9PiB7XHJcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCdlcnJvciBvcGVuaW5nIGluZGV4ZWREQicsIHRoaXMuZGJOYW1lKTtcclxuICAgICAgICAgIHJlamVjdChyZXF1ZXN0LmVycm9yKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXF1ZXN0Lm9uc3VjY2VzcyA9ICgvKiBldmVudCAqLykgPT4ge1xyXG4gICAgICAgICAgLy8gY29uc29sZS5sb2coJ3N1Y2Nlc3Mgb3BlbmluZyBpbmRleGVkREInLCB0aGlzLmRiTmFtZSk7XHJcbiAgICAgICAgICBjb25zdCBkYiA9IHRoaXMuX2RiID0gcmVxdWVzdC5yZXN1bHQ7XHJcbiAgICAgICAgICByZXNvbHZlKGRiKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXF1ZXN0Lm9udXBncmFkZW5lZWRlZCA9IChldmVudCkgPT4ge1xyXG4gICAgICAgICAgLy8gY29uc29sZS5sb2coJ2luZGV4ZWREQiB1cGdyYWRlIG5lZWRlZCcpO1xyXG4gICAgICAgICAgY29uc3QgZGIgPSB0aGlzLl9kYiA9IGV2ZW50LnRhcmdldC5yZXN1bHQ7XHJcbiAgICAgICAgICBpZiAoZXZlbnQgJiYgZXZlbnQub2xkVmVyc2lvbiA+IDApIHtcclxuICAgICAgICAgICAgdGhpcy5taWdyYXRlREIoZGIsIGV2ZW50KTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlREIoZGIpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgY2xvc2VEQigpIHtcclxuICAgIGlmICh0aGlzLmlzREJPcGVuKSB7XHJcbiAgICAgIHRoaXMuX2RiLmNsb3NlKCk7XHJcbiAgICAgIHRoaXMuX2RiID0gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlb3BlbkRCKCkge1xyXG4gICAgdGhpcy5jbG9zZURCKCk7XHJcbiAgICByZXR1cm4gdGhpcy5vcGVuREIoKTtcclxuICB9XHJcblxyXG4gIGNyZWF0ZURCKGRiKSB7XHJcbiAgICBkYi5jcmVhdGVPYmplY3RTdG9yZSh0aGlzLmRiU3RvcmVOYW1lKTsgLy8sIHsga2V5UGF0aDogJ2tleScgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBNaWdyYXRlIGRhdGFiYXNlLlxyXG4gICAqXHJcbiAgICogQHBhcmFtICB7SURCRGF0YWJhc2V9IGRiICAgICAgICAgICAgICBEYXRhYmFzZSB0byB1cGdyYWRlLlxyXG4gICAqIEBwYXJhbSAge0lEQlZlcnNpb25DaGFuZ2VFdmVudH0gZXZlbnQgRXZlbnQgcmVzdWx0aW5nIGZyb20gdmVyc2lvbiBjaGFuZ2UuXHJcbiAgICovXHJcbiAgbWlncmF0ZURCKGRiLCBldmVudCkge1xyXG4gICAgY29uc29sZS5lcnJvcignSW5kZXhlZERCQnVja2V0I21pZ3JhdGVEQiAtIHNob3VsZCBiZSBvdmVycmlkZGVuIHRvIHVwZ3JhZGUgSURCRGF0YWJhc2UgZnJvbTogJywgZXZlbnQub2xkVmVyc2lvbiwgJyAtPiAnLCBldmVudC5uZXdWZXJzaW9uKTtcclxuICB9XHJcblxyXG4gIGRlbGV0ZURCKCkge1xyXG4gICAgdGhpcy5jbG9zZURCKCk7XHJcblxyXG4gICAgcmV0dXJuIG5ldyBPcmJpdC5Qcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgbGV0IHJlcXVlc3QgPSBPcmJpdC5nbG9iYWxzLmluZGV4ZWREQi5kZWxldGVEYXRhYmFzZSh0aGlzLmRiTmFtZSk7XHJcblxyXG4gICAgICByZXF1ZXN0Lm9uZXJyb3IgPSAoLyogZXZlbnQgKi8pID0+IHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKCdlcnJvciBkZWxldGluZyBpbmRleGVkREInLCB0aGlzLmRiTmFtZSk7XHJcbiAgICAgICAgcmVqZWN0KHJlcXVlc3QuZXJyb3IpO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSAoLyogZXZlbnQgKi8pID0+IHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnc3VjY2VzcyBkZWxldGluZyBpbmRleGVkREInLCB0aGlzLmRiTmFtZSk7XHJcbiAgICAgICAgdGhpcy5fZGIgPSBudWxsO1xyXG4gICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgfTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0SXRlbShrZXk6IHN0cmluZyk6IFByb21pc2U8YW55PiB7XHJcbiAgICByZXR1cm4gdGhpcy5vcGVuREIoKVxyXG4gICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBPcmJpdC5Qcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgIGNvbnN0IHRyYW5zYWN0aW9uID0gdGhpcy5fZGIudHJhbnNhY3Rpb24oW3RoaXMuZGJTdG9yZU5hbWVdKTtcclxuICAgICAgICAgIGNvbnN0IG9iamVjdFN0b3JlID0gdHJhbnNhY3Rpb24ub2JqZWN0U3RvcmUodGhpcy5kYlN0b3JlTmFtZSk7XHJcbiAgICAgICAgICBjb25zdCByZXF1ZXN0ID0gb2JqZWN0U3RvcmUuZ2V0KGtleSk7XHJcblxyXG4gICAgICAgICAgcmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24oLyogZXZlbnQgKi8pIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignZXJyb3IgLSBnZXRJdGVtJywgcmVxdWVzdC5lcnJvcik7XHJcbiAgICAgICAgICAgIHJlamVjdChyZXF1ZXN0LmVycm9yKTtcclxuICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSBmdW5jdGlvbigvKiBldmVudCAqLykge1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnc3VjY2VzcyAtIGdldEl0ZW0nLCByZXF1ZXN0LnJlc3VsdCk7XHJcbiAgICAgICAgICAgIHJlc29sdmUocmVxdWVzdC5yZXN1bHQpO1xyXG4gICAgICAgICAgfTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBzZXRJdGVtKGtleTogc3RyaW5nLCB2YWx1ZTogYW55KTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICByZXR1cm4gdGhpcy5vcGVuREIoKVxyXG4gICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgdHJhbnNhY3Rpb24gPSB0aGlzLl9kYi50cmFuc2FjdGlvbihbdGhpcy5kYlN0b3JlTmFtZV0sICdyZWFkd3JpdGUnKTtcclxuICAgICAgICBjb25zdCBvYmplY3RTdG9yZSA9IHRyYW5zYWN0aW9uLm9iamVjdFN0b3JlKHRoaXMuZGJTdG9yZU5hbWUpO1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3IE9yYml0LlByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgY29uc3QgcmVxdWVzdCA9IG9iamVjdFN0b3JlLnB1dCh2YWx1ZSwga2V5KTtcclxuXHJcbiAgICAgICAgICByZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbigvKiBldmVudCAqLykge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdlcnJvciAtIHNldEl0ZW0nLCByZXF1ZXN0LmVycm9yKTtcclxuICAgICAgICAgICAgcmVqZWN0KHJlcXVlc3QuZXJyb3IpO1xyXG4gICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICByZXF1ZXN0Lm9uc3VjY2VzcyA9IGZ1bmN0aW9uKC8qIGV2ZW50ICovKSB7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdzdWNjZXNzIC0gc2V0SXRlbScpO1xyXG4gICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIHJlbW92ZUl0ZW0oa2V5OiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHJldHVybiB0aGlzLm9wZW5EQigpXHJcbiAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICByZXR1cm4gbmV3IE9yYml0LlByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgY29uc3QgdHJhbnNhY3Rpb24gPSB0aGlzLl9kYi50cmFuc2FjdGlvbihbdGhpcy5kYlN0b3JlTmFtZV0sICdyZWFkd3JpdGUnKTtcclxuICAgICAgICAgIGNvbnN0IG9iamVjdFN0b3JlID0gdHJhbnNhY3Rpb24ub2JqZWN0U3RvcmUodGhpcy5kYlN0b3JlTmFtZSk7XHJcbiAgICAgICAgICBjb25zdCByZXF1ZXN0ID0gb2JqZWN0U3RvcmUuZGVsZXRlKGtleSk7XHJcblxyXG4gICAgICAgICAgcmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24oLyogZXZlbnQgKi8pIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignZXJyb3IgLSByZW1vdmVJdGVtJywgcmVxdWVzdC5lcnJvcik7XHJcbiAgICAgICAgICAgIHJlamVjdChyZXF1ZXN0LmVycm9yKTtcclxuICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSBmdW5jdGlvbigvKiBldmVudCAqLykge1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnc3VjY2VzcyAtIHJlbW92ZUl0ZW0nKTtcclxuICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgfTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==