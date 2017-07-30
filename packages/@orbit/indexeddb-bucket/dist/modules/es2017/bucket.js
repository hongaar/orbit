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
var IndexedDBBucket = (function (_super) {
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
        if (settings === void 0) { settings = {}; }
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
        return _super.prototype.upgrade.call(this, settings)
            .then(function () { return _this.openDB(); });
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
            }
            else {
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
                    }
                    else {
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
        return this.openDB()
            .then(function () {
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
        return this.openDB()
            .then(function () {
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
        return this.openDB()
            .then(function () {
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
}(core_1.Bucket));
exports.default = IndexedDBBucket;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVja2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3JjL2J1Y2tldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxvQ0FFcUI7QUFDckIsc0NBQXNDO0FBQ3RDLDZDQUFvRDtBQVFwRDs7Ozs7R0FLRztBQUNIO0lBQTZDLG1DQUFNO0lBSWpEOzs7Ozs7Ozs7T0FTRztJQUNILHlCQUFZLFFBQXNDO1FBQXRDLHlCQUFBLEVBQUEsYUFBc0M7UUFBbEQsaUJBT0M7UUFOQyxjQUFNLENBQUMsMENBQTBDLEVBQUUsNkJBQWlCLEVBQUUsQ0FBQyxDQUFDO1FBRXhFLFFBQVEsQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDLElBQUksSUFBSSxXQUFXLENBQUM7UUFDN0MsUUFBUSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUMsU0FBUyxJQUFJLE1BQU0sQ0FBQztRQUVsRCxRQUFBLGtCQUFNLFFBQVEsQ0FBQyxTQUFDOztJQUNsQixDQUFDO0lBRUQsaUNBQU8sR0FBUCxVQUFRLFFBQWlDO1FBQXpDLGlCQUlDO1FBSEMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ2YsTUFBTSxDQUFDLGlCQUFNLE9BQU8sWUFBQyxRQUFRLENBQUM7YUFDM0IsSUFBSSxDQUFDLGNBQU0sT0FBQSxLQUFJLENBQUMsTUFBTSxFQUFFLEVBQWIsQ0FBYSxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUVELHdDQUFjLEdBQWQsVUFBZSxRQUFpQztRQUM5QyxJQUFJLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUM7UUFDckMsTUFBTSxDQUFDLGlCQUFNLGNBQWMsWUFBQyxRQUFRLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBU0Qsc0JBQUksc0NBQVM7UUFQYjs7Ozs7O1dBTUc7YUFDSDtZQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQ3RCLENBQUM7OztPQUFBO0lBU0Qsc0JBQUksbUNBQU07UUFQVjs7Ozs7O1dBTUc7YUFD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QVc7UUFBdEIsaUJBbUJDO1FBbEJDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO2FBQ2pCLElBQUksQ0FBQztZQUNKLE1BQU0sQ0FBQyxJQUFJLGNBQUssQ0FBQyxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTTtnQkFDdkMsSUFBTSxXQUFXLEdBQUcsS0FBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxLQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUM7Z0JBQzFFLElBQU0sV0FBVyxHQUFHLFdBQVcsQ0FBQyxXQUFXLENBQUMsS0FBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUM5RCxJQUFNLE9BQU8sR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUV4QyxPQUFPLENBQUMsT0FBTyxHQUFHO29CQUNoQixPQUFPLENBQUMsS0FBSyxDQUFDLG9CQUFvQixFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDbkQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDeEIsQ0FBQyxDQUFDO2dCQUVGLE9BQU8sQ0FBQyxTQUFTLEdBQUc7b0JBQ2xCLHVDQUF1QztvQkFDdkMsT0FBTyxFQUFFLENBQUM7Z0JBQ1osQ0FBQyxDQUFDO1lBQ0osQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFDSCxzQkFBQztBQUFELENBQUMsQUFsTkQsQ0FBNkMsYUFBTSxHQWtObEQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgT3JiaXQsIHtcclxuICBCdWNrZXQsIEJ1Y2tldFNldHRpbmdzXHJcbn0gZnJvbSAnQG9yYml0L2NvcmUnO1xyXG5pbXBvcnQgeyBhc3NlcnQgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xyXG5pbXBvcnQgeyBzdXBwb3J0c0luZGV4ZWREQiB9IGZyb20gJy4vbGliL2luZGV4ZWRkYic7XHJcblxyXG5kZWNsYXJlIGNvbnN0IGNvbnNvbGU6IGFueTtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSW5kZXhlZERCQnVja2V0U2V0dGluZ3MgZXh0ZW5kcyBCdWNrZXRTZXR0aW5ncyB7XHJcbiAgc3RvcmVOYW1lPzogc3RyaW5nO1xyXG59XHJcblxyXG4vKipcclxuICogQnVja2V0IGZvciBwZXJzaXN0aW5nIHRyYW5zaWVudCBkYXRhIGluIEluZGV4ZWREQi5cclxuICpcclxuICogQGNsYXNzIEluZGV4ZWREQkJ1Y2tldFxyXG4gKiBAZXh0ZW5kcyBCdWNrZXRcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEluZGV4ZWREQkJ1Y2tldCBleHRlbmRzIEJ1Y2tldCB7XHJcbiAgcHJvdGVjdGVkIF9zdG9yZU5hbWU6IHN0cmluZztcclxuICBwcm90ZWN0ZWQgX2RiOiBhbnk7XHJcblxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZSBhIG5ldyBJbmRleGVkREJCdWNrZXQuXHJcbiAgICpcclxuICAgKiBAY29uc3RydWN0b3JcclxuICAgKiBAcGFyYW0ge09iamVjdH0gIFtzZXR0aW5ncyA9IHt9XVxyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSAgW3NldHRpbmdzLm5hbWVdICAgICAgICBPcHRpb25hbC4gTmFtZSBvZiB0aGlzIGJ1Y2tldC5cclxuICAgKiBAcGFyYW0ge1N0cmluZ30gIFtzZXR0aW5ncy5uYW1lc3BhY2VdICAgT3B0aW9uYWwuIE5hbWVzcGFjZSBvZiB0aGUgYnVja2V0LiBXaWxsIGJlIHVzZWQgZm9yIHRoZSBJbmRleGVkREIgZGF0YWJhc2UgbmFtZS4gRGVmYXVsdHMgdG8gJ29yYml0LWJ1Y2tldCcuXHJcbiAgICogQHBhcmFtIHtTdHJpbmd9ICBbc2V0dGluZ3Muc3RvcmVOYW1lXSAgIE9wdGlvbmFsLiBOYW1lIG9mIHRoZSBJbmRleGVkREIgT2JqZWN0U3RvcmUuIERlZmF1bHRzIHRvICdkYXRhJy5cclxuICAgKiBAcGFyYW0ge0ludGVnZXJ9IFtzZXR0aW5ncy52ZXJzaW9uXSAgICAgT3B0aW9uYWwuIFRoZSB2ZXJzaW9uIHRvIG9wZW4gdGhlIEluZGV4ZWREQiBkYXRhYmFzZSB3aXRoLiBEZWZhdWx0cyB0byBgMWAuXHJcbiAgICovXHJcbiAgY29uc3RydWN0b3Ioc2V0dGluZ3M6IEluZGV4ZWREQkJ1Y2tldFNldHRpbmdzID0ge30pIHtcclxuICAgIGFzc2VydCgnWW91ciBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgSW5kZXhlZERCIScsIHN1cHBvcnRzSW5kZXhlZERCKCkpO1xyXG5cclxuICAgIHNldHRpbmdzLm5hbWUgPSBzZXR0aW5ncy5uYW1lIHx8ICdpbmRleGVkREInO1xyXG4gICAgc2V0dGluZ3Muc3RvcmVOYW1lID0gc2V0dGluZ3Muc3RvcmVOYW1lIHx8ICdkYXRhJztcclxuXHJcbiAgICBzdXBlcihzZXR0aW5ncyk7XHJcbiAgfVxyXG5cclxuICB1cGdyYWRlKHNldHRpbmdzOiBJbmRleGVkREJCdWNrZXRTZXR0aW5ncykge1xyXG4gICAgdGhpcy5jbG9zZURCKCk7XHJcbiAgICByZXR1cm4gc3VwZXIudXBncmFkZShzZXR0aW5ncylcclxuICAgICAgLnRoZW4oKCkgPT4gdGhpcy5vcGVuREIoKSk7XHJcbiAgfVxyXG5cclxuICBfYXBwbHlTZXR0aW5ncyhzZXR0aW5nczogSW5kZXhlZERCQnVja2V0U2V0dGluZ3MpIHtcclxuICAgIHRoaXMuX3N0b3JlTmFtZSA9IHNldHRpbmdzLnN0b3JlTmFtZTtcclxuICAgIHJldHVybiBzdXBlci5fYXBwbHlTZXR0aW5ncyhzZXR0aW5ncyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBUaGUgdmVyc2lvbiB0byBzcGVjaWZ5IHdoZW4gb3BlbmluZyB0aGUgSW5kZXhlZERCIGRhdGFiYXNlLlxyXG4gICAqXHJcbiAgICogSW5kZXhlZERCJ3MgZGVmYXVsdCB2ZXJpb25zIGlzIDEuXHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtJbnRlZ2VyfSBWZXJzaW9uIG51bWJlci5cclxuICAgKi9cclxuICBnZXQgZGJWZXJzaW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMudmVyc2lvbjtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEluZGV4ZWREQiBkYXRhYmFzZSBuYW1lLlxyXG4gICAqXHJcbiAgICogRGVmYXVsdHMgdG8gJ29yYml0LWJ1Y2tldCcsIHdoaWNoIGNhbiBiZSBvdmVycmlkZGVuIGluIHRoZSBjb25zdHJ1Y3Rvci5cclxuICAgKlxyXG4gICAqIEByZXR1cm4ge1N0cmluZ30gRGF0YWJhc2UgbmFtZS5cclxuICAgKi9cclxuICBnZXQgZGJOYW1lKCkge1xyXG4gICAgcmV0dXJuIHRoaXMubmFtZXNwYWNlO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogSW5kZXhlZERCIE9iamVjdFN0b3JlIG5hbWUuXHJcbiAgICpcclxuICAgKiBEZWZhdWx0cyB0byAnc2V0dGluZ3MnLCB3aGljaCBjYW4gYmUgb3ZlcnJpZGRlbiBpbiB0aGUgY29uc3RydWN0b3IuXHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtTdHJpbmd9IERhdGFiYXNlIG5hbWUuXHJcbiAgICovXHJcbiAgZ2V0IGRiU3RvcmVOYW1lKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX3N0b3JlTmFtZTtcclxuICB9XHJcblxyXG4gIGdldCBpc0RCT3BlbigpIHtcclxuICAgIHJldHVybiAhIXRoaXMuX2RiO1xyXG4gIH1cclxuXHJcbiAgb3BlbkRCKCkge1xyXG4gICAgcmV0dXJuIG5ldyBPcmJpdC5Qcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgaWYgKHRoaXMuX2RiKSB7XHJcbiAgICAgICAgcmVzb2x2ZSh0aGlzLl9kYik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IHJlcXVlc3QgPSBPcmJpdC5nbG9iYWxzLmluZGV4ZWREQi5vcGVuKHRoaXMuZGJOYW1lLCB0aGlzLmRiVmVyc2lvbik7XHJcblxyXG4gICAgICAgIHJlcXVlc3Qub25lcnJvciA9ICgvKiBldmVudCAqLykgPT4ge1xyXG4gICAgICAgICAgY29uc29sZS5lcnJvcignZXJyb3Igb3BlbmluZyBpbmRleGVkREInLCB0aGlzLmRiTmFtZSk7XHJcbiAgICAgICAgICByZWplY3QocmVxdWVzdC5lcnJvcik7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSAoLyogZXZlbnQgKi8pID0+IHtcclxuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdzdWNjZXNzIG9wZW5pbmcgaW5kZXhlZERCJywgdGhpcy5kYk5hbWUpO1xyXG4gICAgICAgICAgY29uc3QgZGIgPSB0aGlzLl9kYiA9IHJlcXVlc3QucmVzdWx0O1xyXG4gICAgICAgICAgcmVzb2x2ZShkYik7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmVxdWVzdC5vbnVwZ3JhZGVuZWVkZWQgPSAoZXZlbnQpID0+IHtcclxuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdpbmRleGVkREIgdXBncmFkZSBuZWVkZWQnKTtcclxuICAgICAgICAgIGNvbnN0IGRiID0gdGhpcy5fZGIgPSBldmVudC50YXJnZXQucmVzdWx0O1xyXG4gICAgICAgICAgaWYgKGV2ZW50ICYmIGV2ZW50Lm9sZFZlcnNpb24gPiAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMubWlncmF0ZURCKGRiLCBldmVudCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZURCKGRiKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGNsb3NlREIoKSB7XHJcbiAgICBpZiAodGhpcy5pc0RCT3Blbikge1xyXG4gICAgICB0aGlzLl9kYi5jbG9zZSgpO1xyXG4gICAgICB0aGlzLl9kYiA9IG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZW9wZW5EQigpIHtcclxuICAgIHRoaXMuY2xvc2VEQigpO1xyXG4gICAgcmV0dXJuIHRoaXMub3BlbkRCKCk7XHJcbiAgfVxyXG5cclxuICBjcmVhdGVEQihkYikge1xyXG4gICAgZGIuY3JlYXRlT2JqZWN0U3RvcmUodGhpcy5kYlN0b3JlTmFtZSk7IC8vLCB7IGtleVBhdGg6ICdrZXknIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTWlncmF0ZSBkYXRhYmFzZS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSAge0lEQkRhdGFiYXNlfSBkYiAgICAgICAgICAgICAgRGF0YWJhc2UgdG8gdXBncmFkZS5cclxuICAgKiBAcGFyYW0gIHtJREJWZXJzaW9uQ2hhbmdlRXZlbnR9IGV2ZW50IEV2ZW50IHJlc3VsdGluZyBmcm9tIHZlcnNpb24gY2hhbmdlLlxyXG4gICAqL1xyXG4gIG1pZ3JhdGVEQihkYiwgZXZlbnQpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoJ0luZGV4ZWREQkJ1Y2tldCNtaWdyYXRlREIgLSBzaG91bGQgYmUgb3ZlcnJpZGRlbiB0byB1cGdyYWRlIElEQkRhdGFiYXNlIGZyb206ICcsIGV2ZW50Lm9sZFZlcnNpb24sICcgLT4gJywgZXZlbnQubmV3VmVyc2lvbik7XHJcbiAgfVxyXG5cclxuICBkZWxldGVEQigpIHtcclxuICAgIHRoaXMuY2xvc2VEQigpO1xyXG5cclxuICAgIHJldHVybiBuZXcgT3JiaXQuUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIGxldCByZXF1ZXN0ID0gT3JiaXQuZ2xvYmFscy5pbmRleGVkREIuZGVsZXRlRGF0YWJhc2UodGhpcy5kYk5hbWUpO1xyXG5cclxuICAgICAgcmVxdWVzdC5vbmVycm9yID0gKC8qIGV2ZW50ICovKSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcignZXJyb3IgZGVsZXRpbmcgaW5kZXhlZERCJywgdGhpcy5kYk5hbWUpO1xyXG4gICAgICAgIHJlamVjdChyZXF1ZXN0LmVycm9yKTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHJlcXVlc3Qub25zdWNjZXNzID0gKC8qIGV2ZW50ICovKSA9PiB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3N1Y2Nlc3MgZGVsZXRpbmcgaW5kZXhlZERCJywgdGhpcy5kYk5hbWUpO1xyXG4gICAgICAgIHRoaXMuX2RiID0gbnVsbDtcclxuICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgIH07XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldEl0ZW0oa2V5OiBzdHJpbmcpOiBQcm9taXNlPGFueT4ge1xyXG4gICAgcmV0dXJuIHRoaXMub3BlbkRCKClcclxuICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgT3JiaXQuUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICBjb25zdCB0cmFuc2FjdGlvbiA9IHRoaXMuX2RiLnRyYW5zYWN0aW9uKFt0aGlzLmRiU3RvcmVOYW1lXSk7XHJcbiAgICAgICAgICBjb25zdCBvYmplY3RTdG9yZSA9IHRyYW5zYWN0aW9uLm9iamVjdFN0b3JlKHRoaXMuZGJTdG9yZU5hbWUpO1xyXG4gICAgICAgICAgY29uc3QgcmVxdWVzdCA9IG9iamVjdFN0b3JlLmdldChrZXkpO1xyXG5cclxuICAgICAgICAgIHJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uKC8qIGV2ZW50ICovKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ2Vycm9yIC0gZ2V0SXRlbScsIHJlcXVlc3QuZXJyb3IpO1xyXG4gICAgICAgICAgICByZWplY3QocmVxdWVzdC5lcnJvcik7XHJcbiAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgIHJlcXVlc3Qub25zdWNjZXNzID0gZnVuY3Rpb24oLyogZXZlbnQgKi8pIHtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3N1Y2Nlc3MgLSBnZXRJdGVtJywgcmVxdWVzdC5yZXN1bHQpO1xyXG4gICAgICAgICAgICByZXNvbHZlKHJlcXVlc3QucmVzdWx0KTtcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc2V0SXRlbShrZXk6IHN0cmluZywgdmFsdWU6IGFueSk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgcmV0dXJuIHRoaXMub3BlbkRCKClcclxuICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHRyYW5zYWN0aW9uID0gdGhpcy5fZGIudHJhbnNhY3Rpb24oW3RoaXMuZGJTdG9yZU5hbWVdLCAncmVhZHdyaXRlJyk7XHJcbiAgICAgICAgY29uc3Qgb2JqZWN0U3RvcmUgPSB0cmFuc2FjdGlvbi5vYmplY3RTdG9yZSh0aGlzLmRiU3RvcmVOYW1lKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBPcmJpdC5Qcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgIGNvbnN0IHJlcXVlc3QgPSBvYmplY3RTdG9yZS5wdXQodmFsdWUsIGtleSk7XHJcblxyXG4gICAgICAgICAgcmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24oLyogZXZlbnQgKi8pIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignZXJyb3IgLSBzZXRJdGVtJywgcmVxdWVzdC5lcnJvcik7XHJcbiAgICAgICAgICAgIHJlamVjdChyZXF1ZXN0LmVycm9yKTtcclxuICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSBmdW5jdGlvbigvKiBldmVudCAqLykge1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnc3VjY2VzcyAtIHNldEl0ZW0nKTtcclxuICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgfTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICByZW1vdmVJdGVtKGtleTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICByZXR1cm4gdGhpcy5vcGVuREIoKVxyXG4gICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBPcmJpdC5Qcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgIGNvbnN0IHRyYW5zYWN0aW9uID0gdGhpcy5fZGIudHJhbnNhY3Rpb24oW3RoaXMuZGJTdG9yZU5hbWVdLCAncmVhZHdyaXRlJyk7XHJcbiAgICAgICAgICBjb25zdCBvYmplY3RTdG9yZSA9IHRyYW5zYWN0aW9uLm9iamVjdFN0b3JlKHRoaXMuZGJTdG9yZU5hbWUpO1xyXG4gICAgICAgICAgY29uc3QgcmVxdWVzdCA9IG9iamVjdFN0b3JlLmRlbGV0ZShrZXkpO1xyXG5cclxuICAgICAgICAgIHJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uKC8qIGV2ZW50ICovKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ2Vycm9yIC0gcmVtb3ZlSXRlbScsIHJlcXVlc3QuZXJyb3IpO1xyXG4gICAgICAgICAgICByZWplY3QocmVxdWVzdC5lcnJvcik7XHJcbiAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgIHJlcXVlc3Qub25zdWNjZXNzID0gZnVuY3Rpb24oLyogZXZlbnQgKi8pIHtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3N1Y2Nlc3MgLSByZW1vdmVJdGVtJyk7XHJcbiAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxufVxyXG4iXX0=