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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVja2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3JjL2J1Y2tldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHFCQUVxQjtBQUNyQixzQkFBc0M7QUFDdEMsMEJBQW9EO0FBUXBELEFBS0c7Ozs7OztBQUNIO0FBQTZDLCtCQUFNO0FBSWpELEFBU0c7Ozs7Ozs7Ozs7QUFDSCw2QkFBWSxBQUFzQztBQUF0QyxpQ0FBQTtBQUFBLHVCQUFzQzs7QUFBbEQsb0JBT0M7QUFOQyxnQkFBTSxPQUFDLEFBQTBDLDRDQUFFLFlBQWlCLEFBQUUsQUFBQyxBQUFDO0FBRXhFLEFBQVEsaUJBQUMsQUFBSSxPQUFHLEFBQVEsU0FBQyxBQUFJLFFBQUksQUFBVyxBQUFDO0FBQzdDLEFBQVEsaUJBQUMsQUFBUyxZQUFHLEFBQVEsU0FBQyxBQUFTLGFBQUksQUFBTSxBQUFDO0FBRWxELGdCQUFBLGtCQUFNLEFBQVEsQUFBQyxhQUFDO2VBQ2xCO0FBQUM7QUFFRCw4QkFBTyxVQUFQLFVBQVEsQUFBaUM7QUFBekMsb0JBSUM7QUFIQyxBQUFJLGFBQUMsQUFBTyxBQUFFLEFBQUM7QUFDZixBQUFNLGdDQUFPLEFBQU8sbUJBQUMsQUFBUSxBQUFDLFVBQzNCLEFBQUksS0FBQztBQUFNLG1CQUFBLEFBQUksTUFBSixBQUFLLEFBQU0sQUFBRTtBQUFBLEFBQUMsQUFBQyxBQUMvQixTQUZTO0FBRVI7QUFFRCw4QkFBYyxpQkFBZCxVQUFlLEFBQWlDO0FBQzlDLEFBQUksYUFBQyxBQUFVLGFBQUcsQUFBUSxTQUFDLEFBQVMsQUFBQztBQUNyQyxBQUFNLGVBQUMsaUJBQU0sQUFBYywwQkFBQyxBQUFRLEFBQUMsQUFBQyxBQUN4QztBQUFDO0FBU0QsMEJBQUksMkJBQVM7QUFQYixBQU1HOzs7Ozs7O2FBQ0g7QUFDRSxBQUFNLG1CQUFDLEFBQUksS0FBQyxBQUFPLEFBQUMsQUFDdEI7QUFBQzs7c0JBQUE7O0FBU0QsMEJBQUksMkJBQU07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QW1CWjtBQUVELDhCQUFVLGFBQVYsVUFBVyxBQUFXO0FBQXRCLG9CQW1CQztBQWxCQyxBQUFNLG9CQUFNLEFBQU0sQUFBRSxTQUNqQixBQUFJLEtBQUM7QUFDSixBQUFNLHVCQUFLLE9BQUssUUFBQyxBQUFPLFFBQUMsVUFBQyxBQUFPLFNBQUUsQUFBTTtBQUN2QyxvQkFBTSxBQUFXLGNBQUcsQUFBSSxNQUFDLEFBQUcsSUFBQyxBQUFXLFlBQUMsQ0FBQyxBQUFJLE1BQUMsQUFBVyxBQUFDLGNBQUUsQUFBVyxBQUFDLEFBQUM7QUFDMUUsb0JBQU0sQUFBVyxjQUFHLEFBQVcsWUFBQyxBQUFXLFlBQUMsQUFBSSxNQUFDLEFBQVcsQUFBQyxBQUFDO0FBQzlELG9CQUFNLEFBQU8sVUFBRyxBQUFXLFlBQUMsQUFBTSxPQUFDLEFBQUcsQUFBQyxBQUFDO0FBRXhDLEFBQU8sd0JBQUMsQUFBTyxVQUFHO0FBQ2hCLEFBQU8sNEJBQUMsQUFBSyxNQUFDLEFBQW9CLHNCQUFFLEFBQU8sUUFBQyxBQUFLLEFBQUMsQUFBQztBQUNuRCxBQUFNLDJCQUFDLEFBQU8sUUFBQyxBQUFLLEFBQUMsQUFBQyxBQUN4QjtBQUFDLEFBQUM7QUFFRixBQUFPLHdCQUFDLEFBQVMsWUFBRztBQUNsQixBQUF1QztBQUN2QyxBQUFPLEFBQUUsQUFBQyxBQUNaO0FBQUMsQUFBQyxBQUNKO0FBQUMsQUFBQyxBQUFDLEFBQ0wsYUFmUztBQWVSLEFBQUMsQUFBQyxBQUNQLFNBbEJTLEFBQUk7QUFrQlo7QUFDSCxXQUFBLEFBQUM7QUFsTkQsQUFrTkMsRUFsTjRDLE9BQU0sQUFrTmxEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE9yYml0LCB7XHJcbiAgQnVja2V0LCBCdWNrZXRTZXR0aW5nc1xyXG59IGZyb20gJ0BvcmJpdC9jb3JlJztcclxuaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSAnQG9yYml0L3V0aWxzJztcclxuaW1wb3J0IHsgc3VwcG9ydHNJbmRleGVkREIgfSBmcm9tICcuL2xpYi9pbmRleGVkZGInO1xyXG5cclxuZGVjbGFyZSBjb25zdCBjb25zb2xlOiBhbnk7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEluZGV4ZWREQkJ1Y2tldFNldHRpbmdzIGV4dGVuZHMgQnVja2V0U2V0dGluZ3Mge1xyXG4gIHN0b3JlTmFtZT86IHN0cmluZztcclxufVxyXG5cclxuLyoqXHJcbiAqIEJ1Y2tldCBmb3IgcGVyc2lzdGluZyB0cmFuc2llbnQgZGF0YSBpbiBJbmRleGVkREIuXHJcbiAqXHJcbiAqIEBjbGFzcyBJbmRleGVkREJCdWNrZXRcclxuICogQGV4dGVuZHMgQnVja2V0XHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbmRleGVkREJCdWNrZXQgZXh0ZW5kcyBCdWNrZXQge1xyXG4gIHByb3RlY3RlZCBfc3RvcmVOYW1lOiBzdHJpbmc7XHJcbiAgcHJvdGVjdGVkIF9kYjogYW55O1xyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGUgYSBuZXcgSW5kZXhlZERCQnVja2V0LlxyXG4gICAqXHJcbiAgICogQGNvbnN0cnVjdG9yXHJcbiAgICogQHBhcmFtIHtPYmplY3R9ICBbc2V0dGluZ3MgPSB7fV1cclxuICAgKiBAcGFyYW0ge1N0cmluZ30gIFtzZXR0aW5ncy5uYW1lXSAgICAgICAgT3B0aW9uYWwuIE5hbWUgb2YgdGhpcyBidWNrZXQuXHJcbiAgICogQHBhcmFtIHtTdHJpbmd9ICBbc2V0dGluZ3MubmFtZXNwYWNlXSAgIE9wdGlvbmFsLiBOYW1lc3BhY2Ugb2YgdGhlIGJ1Y2tldC4gV2lsbCBiZSB1c2VkIGZvciB0aGUgSW5kZXhlZERCIGRhdGFiYXNlIG5hbWUuIERlZmF1bHRzIHRvICdvcmJpdC1idWNrZXQnLlxyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSAgW3NldHRpbmdzLnN0b3JlTmFtZV0gICBPcHRpb25hbC4gTmFtZSBvZiB0aGUgSW5kZXhlZERCIE9iamVjdFN0b3JlLiBEZWZhdWx0cyB0byAnZGF0YScuXHJcbiAgICogQHBhcmFtIHtJbnRlZ2VyfSBbc2V0dGluZ3MudmVyc2lvbl0gICAgIE9wdGlvbmFsLiBUaGUgdmVyc2lvbiB0byBvcGVuIHRoZSBJbmRleGVkREIgZGF0YWJhc2Ugd2l0aC4gRGVmYXVsdHMgdG8gYDFgLlxyXG4gICAqL1xyXG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzOiBJbmRleGVkREJCdWNrZXRTZXR0aW5ncyA9IHt9KSB7XHJcbiAgICBhc3NlcnQoJ1lvdXIgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IEluZGV4ZWREQiEnLCBzdXBwb3J0c0luZGV4ZWREQigpKTtcclxuXHJcbiAgICBzZXR0aW5ncy5uYW1lID0gc2V0dGluZ3MubmFtZSB8fCAnaW5kZXhlZERCJztcclxuICAgIHNldHRpbmdzLnN0b3JlTmFtZSA9IHNldHRpbmdzLnN0b3JlTmFtZSB8fCAnZGF0YSc7XHJcblxyXG4gICAgc3VwZXIoc2V0dGluZ3MpO1xyXG4gIH1cclxuXHJcbiAgdXBncmFkZShzZXR0aW5nczogSW5kZXhlZERCQnVja2V0U2V0dGluZ3MpIHtcclxuICAgIHRoaXMuY2xvc2VEQigpO1xyXG4gICAgcmV0dXJuIHN1cGVyLnVwZ3JhZGUoc2V0dGluZ3MpXHJcbiAgICAgIC50aGVuKCgpID0+IHRoaXMub3BlbkRCKCkpO1xyXG4gIH1cclxuXHJcbiAgX2FwcGx5U2V0dGluZ3Moc2V0dGluZ3M6IEluZGV4ZWREQkJ1Y2tldFNldHRpbmdzKSB7XHJcbiAgICB0aGlzLl9zdG9yZU5hbWUgPSBzZXR0aW5ncy5zdG9yZU5hbWU7XHJcbiAgICByZXR1cm4gc3VwZXIuX2FwcGx5U2V0dGluZ3Moc2V0dGluZ3MpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVGhlIHZlcnNpb24gdG8gc3BlY2lmeSB3aGVuIG9wZW5pbmcgdGhlIEluZGV4ZWREQiBkYXRhYmFzZS5cclxuICAgKlxyXG4gICAqIEluZGV4ZWREQidzIGRlZmF1bHQgdmVyaW9ucyBpcyAxLlxyXG4gICAqXHJcbiAgICogQHJldHVybiB7SW50ZWdlcn0gVmVyc2lvbiBudW1iZXIuXHJcbiAgICovXHJcbiAgZ2V0IGRiVmVyc2lvbigpIHtcclxuICAgIHJldHVybiB0aGlzLnZlcnNpb247XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBJbmRleGVkREIgZGF0YWJhc2UgbmFtZS5cclxuICAgKlxyXG4gICAqIERlZmF1bHRzIHRvICdvcmJpdC1idWNrZXQnLCB3aGljaCBjYW4gYmUgb3ZlcnJpZGRlbiBpbiB0aGUgY29uc3RydWN0b3IuXHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtTdHJpbmd9IERhdGFiYXNlIG5hbWUuXHJcbiAgICovXHJcbiAgZ2V0IGRiTmFtZSgpIHtcclxuICAgIHJldHVybiB0aGlzLm5hbWVzcGFjZTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEluZGV4ZWREQiBPYmplY3RTdG9yZSBuYW1lLlxyXG4gICAqXHJcbiAgICogRGVmYXVsdHMgdG8gJ3NldHRpbmdzJywgd2hpY2ggY2FuIGJlIG92ZXJyaWRkZW4gaW4gdGhlIGNvbnN0cnVjdG9yLlxyXG4gICAqXHJcbiAgICogQHJldHVybiB7U3RyaW5nfSBEYXRhYmFzZSBuYW1lLlxyXG4gICAqL1xyXG4gIGdldCBkYlN0b3JlTmFtZSgpIHtcclxuICAgIHJldHVybiB0aGlzLl9zdG9yZU5hbWU7XHJcbiAgfVxyXG5cclxuICBnZXQgaXNEQk9wZW4oKSB7XHJcbiAgICByZXR1cm4gISF0aGlzLl9kYjtcclxuICB9XHJcblxyXG4gIG9wZW5EQigpIHtcclxuICAgIHJldHVybiBuZXcgT3JiaXQuUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIGlmICh0aGlzLl9kYikge1xyXG4gICAgICAgIHJlc29sdmUodGhpcy5fZGIpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCByZXF1ZXN0ID0gT3JiaXQuZ2xvYmFscy5pbmRleGVkREIub3Blbih0aGlzLmRiTmFtZSwgdGhpcy5kYlZlcnNpb24pO1xyXG5cclxuICAgICAgICByZXF1ZXN0Lm9uZXJyb3IgPSAoLyogZXZlbnQgKi8pID0+IHtcclxuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ2Vycm9yIG9wZW5pbmcgaW5kZXhlZERCJywgdGhpcy5kYk5hbWUpO1xyXG4gICAgICAgICAgcmVqZWN0KHJlcXVlc3QuZXJyb3IpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJlcXVlc3Qub25zdWNjZXNzID0gKC8qIGV2ZW50ICovKSA9PiB7XHJcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZygnc3VjY2VzcyBvcGVuaW5nIGluZGV4ZWREQicsIHRoaXMuZGJOYW1lKTtcclxuICAgICAgICAgIGNvbnN0IGRiID0gdGhpcy5fZGIgPSByZXF1ZXN0LnJlc3VsdDtcclxuICAgICAgICAgIHJlc29sdmUoZGIpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJlcXVlc3Qub251cGdyYWRlbmVlZGVkID0gKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZygnaW5kZXhlZERCIHVwZ3JhZGUgbmVlZGVkJyk7XHJcbiAgICAgICAgICBjb25zdCBkYiA9IHRoaXMuX2RiID0gZXZlbnQudGFyZ2V0LnJlc3VsdDtcclxuICAgICAgICAgIGlmIChldmVudCAmJiBldmVudC5vbGRWZXJzaW9uID4gMCkge1xyXG4gICAgICAgICAgICB0aGlzLm1pZ3JhdGVEQihkYiwgZXZlbnQpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jcmVhdGVEQihkYik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBjbG9zZURCKCkge1xyXG4gICAgaWYgKHRoaXMuaXNEQk9wZW4pIHtcclxuICAgICAgdGhpcy5fZGIuY2xvc2UoKTtcclxuICAgICAgdGhpcy5fZGIgPSBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVvcGVuREIoKSB7XHJcbiAgICB0aGlzLmNsb3NlREIoKTtcclxuICAgIHJldHVybiB0aGlzLm9wZW5EQigpO1xyXG4gIH1cclxuXHJcbiAgY3JlYXRlREIoZGIpIHtcclxuICAgIGRiLmNyZWF0ZU9iamVjdFN0b3JlKHRoaXMuZGJTdG9yZU5hbWUpOyAvLywgeyBrZXlQYXRoOiAna2V5JyB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE1pZ3JhdGUgZGF0YWJhc2UuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gIHtJREJEYXRhYmFzZX0gZGIgICAgICAgICAgICAgIERhdGFiYXNlIHRvIHVwZ3JhZGUuXHJcbiAgICogQHBhcmFtICB7SURCVmVyc2lvbkNoYW5nZUV2ZW50fSBldmVudCBFdmVudCByZXN1bHRpbmcgZnJvbSB2ZXJzaW9uIGNoYW5nZS5cclxuICAgKi9cclxuICBtaWdyYXRlREIoZGIsIGV2ZW50KSB7XHJcbiAgICBjb25zb2xlLmVycm9yKCdJbmRleGVkREJCdWNrZXQjbWlncmF0ZURCIC0gc2hvdWxkIGJlIG92ZXJyaWRkZW4gdG8gdXBncmFkZSBJREJEYXRhYmFzZSBmcm9tOiAnLCBldmVudC5vbGRWZXJzaW9uLCAnIC0+ICcsIGV2ZW50Lm5ld1ZlcnNpb24pO1xyXG4gIH1cclxuXHJcbiAgZGVsZXRlREIoKSB7XHJcbiAgICB0aGlzLmNsb3NlREIoKTtcclxuXHJcbiAgICByZXR1cm4gbmV3IE9yYml0LlByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICBsZXQgcmVxdWVzdCA9IE9yYml0Lmdsb2JhbHMuaW5kZXhlZERCLmRlbGV0ZURhdGFiYXNlKHRoaXMuZGJOYW1lKTtcclxuXHJcbiAgICAgIHJlcXVlc3Qub25lcnJvciA9ICgvKiBldmVudCAqLykgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ2Vycm9yIGRlbGV0aW5nIGluZGV4ZWREQicsIHRoaXMuZGJOYW1lKTtcclxuICAgICAgICByZWplY3QocmVxdWVzdC5lcnJvcik7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICByZXF1ZXN0Lm9uc3VjY2VzcyA9ICgvKiBldmVudCAqLykgPT4ge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdzdWNjZXNzIGRlbGV0aW5nIGluZGV4ZWREQicsIHRoaXMuZGJOYW1lKTtcclxuICAgICAgICB0aGlzLl9kYiA9IG51bGw7XHJcbiAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICB9O1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRJdGVtKGtleTogc3RyaW5nKTogUHJvbWlzZTxhbnk+IHtcclxuICAgIHJldHVybiB0aGlzLm9wZW5EQigpXHJcbiAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICByZXR1cm4gbmV3IE9yYml0LlByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgY29uc3QgdHJhbnNhY3Rpb24gPSB0aGlzLl9kYi50cmFuc2FjdGlvbihbdGhpcy5kYlN0b3JlTmFtZV0pO1xyXG4gICAgICAgICAgY29uc3Qgb2JqZWN0U3RvcmUgPSB0cmFuc2FjdGlvbi5vYmplY3RTdG9yZSh0aGlzLmRiU3RvcmVOYW1lKTtcclxuICAgICAgICAgIGNvbnN0IHJlcXVlc3QgPSBvYmplY3RTdG9yZS5nZXQoa2V5KTtcclxuXHJcbiAgICAgICAgICByZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbigvKiBldmVudCAqLykge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdlcnJvciAtIGdldEl0ZW0nLCByZXF1ZXN0LmVycm9yKTtcclxuICAgICAgICAgICAgcmVqZWN0KHJlcXVlc3QuZXJyb3IpO1xyXG4gICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICByZXF1ZXN0Lm9uc3VjY2VzcyA9IGZ1bmN0aW9uKC8qIGV2ZW50ICovKSB7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdzdWNjZXNzIC0gZ2V0SXRlbScsIHJlcXVlc3QucmVzdWx0KTtcclxuICAgICAgICAgICAgcmVzb2x2ZShyZXF1ZXN0LnJlc3VsdCk7XHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIHNldEl0ZW0oa2V5OiBzdHJpbmcsIHZhbHVlOiBhbnkpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHJldHVybiB0aGlzLm9wZW5EQigpXHJcbiAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICBjb25zdCB0cmFuc2FjdGlvbiA9IHRoaXMuX2RiLnRyYW5zYWN0aW9uKFt0aGlzLmRiU3RvcmVOYW1lXSwgJ3JlYWR3cml0ZScpO1xyXG4gICAgICAgIGNvbnN0IG9iamVjdFN0b3JlID0gdHJhbnNhY3Rpb24ub2JqZWN0U3RvcmUodGhpcy5kYlN0b3JlTmFtZSk7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgT3JiaXQuUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICBjb25zdCByZXF1ZXN0ID0gb2JqZWN0U3RvcmUucHV0KHZhbHVlLCBrZXkpO1xyXG5cclxuICAgICAgICAgIHJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uKC8qIGV2ZW50ICovKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ2Vycm9yIC0gc2V0SXRlbScsIHJlcXVlc3QuZXJyb3IpO1xyXG4gICAgICAgICAgICByZWplY3QocmVxdWVzdC5lcnJvcik7XHJcbiAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgIHJlcXVlc3Qub25zdWNjZXNzID0gZnVuY3Rpb24oLyogZXZlbnQgKi8pIHtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3N1Y2Nlc3MgLSBzZXRJdGVtJyk7XHJcbiAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcmVtb3ZlSXRlbShrZXk6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgcmV0dXJuIHRoaXMub3BlbkRCKClcclxuICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgT3JiaXQuUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICBjb25zdCB0cmFuc2FjdGlvbiA9IHRoaXMuX2RiLnRyYW5zYWN0aW9uKFt0aGlzLmRiU3RvcmVOYW1lXSwgJ3JlYWR3cml0ZScpO1xyXG4gICAgICAgICAgY29uc3Qgb2JqZWN0U3RvcmUgPSB0cmFuc2FjdGlvbi5vYmplY3RTdG9yZSh0aGlzLmRiU3RvcmVOYW1lKTtcclxuICAgICAgICAgIGNvbnN0IHJlcXVlc3QgPSBvYmplY3RTdG9yZS5kZWxldGUoa2V5KTtcclxuXHJcbiAgICAgICAgICByZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbigvKiBldmVudCAqLykge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdlcnJvciAtIHJlbW92ZUl0ZW0nLCByZXF1ZXN0LmVycm9yKTtcclxuICAgICAgICAgICAgcmVqZWN0KHJlcXVlc3QuZXJyb3IpO1xyXG4gICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICByZXF1ZXN0Lm9uc3VjY2VzcyA9IGZ1bmN0aW9uKC8qIGV2ZW50ICovKSB7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdzdWNjZXNzIC0gcmVtb3ZlSXRlbScpO1xyXG4gICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICB9XHJcbn1cclxuIl19