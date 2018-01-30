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
var cache_1 = require("./cache");
var Store = function (_super) {
    __extends(Store, _super);
    function Store(settings) {
        if (settings === void 0) {
            settings = {};
        }
        var _this = this;
        utils_1.assert('Store\'s `schema` must be specified in `settings.schema` constructor argument', !!settings.schema);
        var keyMap = settings.keyMap;
        var schema = settings.schema;
        settings.name = settings.name || 'store';
        _this = _super.call(this, settings) || this;
        _this._transforms = {};
        _this._transformInverses = {};
        _this.transformLog.on('clear', _this._logCleared, _this);
        _this.transformLog.on('truncate', _this._logTruncated, _this);
        _this.transformLog.on('rollback', _this._logRolledback, _this);
        var cacheSettings = settings.cacheSettings || {};
        cacheSettings.schema = schema;
        cacheSettings.keyMap = keyMap;
        cacheSettings.queryBuilder = cacheSettings.queryBuilder || _this.queryBuilder;
        cacheSettings.transformBuilder = cacheSettings.transformBuilder || _this.transformBuilder;
        if (settings.base) {
            _this._base = settings.base;
            _this._forkPoint = _this._base.transformLog.head;
            cacheSettings.base = _this._base.cache;
        }
        _this._cache = new cache_1.default(cacheSettings);
        return _this;
    }
    Store_1 = Store;
    Object.defineProperty(Store.prototype, "cache", {
        get: function () {
            return this._cache;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Store.prototype, "base", {
        get: function () {
            return this._base;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Store.prototype, "forkPoint", {
        get: function () {
            return this._forkPoint;
        },
        enumerable: true,
        configurable: true
    });
    Store.prototype.upgrade = function () {
        this._cache.upgrade();
        return data_1.default.Promise.resolve();
    };
    /////////////////////////////////////////////////////////////////////////////
    // Syncable interface implementation
    /////////////////////////////////////////////////////////////////////////////
    Store.prototype._sync = function (transform) {
        this._applyTransform(transform);
        return data_1.default.Promise.resolve();
    };
    /////////////////////////////////////////////////////////////////////////////
    // Updatable interface implementation
    /////////////////////////////////////////////////////////////////////////////
    Store.prototype._update = function (transform) {
        var results = this._applyTransform(transform);
        return data_1.default.Promise.resolve(results.length === 1 ? results[0] : results);
    };
    /////////////////////////////////////////////////////////////////////////////
    // Queryable interface implementation
    /////////////////////////////////////////////////////////////////////////////
    Store.prototype._query = function (query) {
        return data_1.default.Promise.resolve(this._cache.query(query));
    };
    /////////////////////////////////////////////////////////////////////////////
    // Public methods
    /////////////////////////////////////////////////////////////////////////////
    /**
     Create a clone, or "fork", from a "base" store.
        The forked store will have the same `schema` and `keyMap` as its base store.
     The forked store's cache will start with the same immutable document as
     the base store. Its contents and log will evolve independently.
        @method fork
     @returns {Store} The forked store.
    */
    Store.prototype.fork = function (settings) {
        if (settings === void 0) {
            settings = {};
        }
        settings.schema = this._schema;
        settings.cacheSettings = settings.cacheSettings || {};
        settings.keyMap = this._keyMap;
        settings.queryBuilder = this.queryBuilder;
        settings.transformBuilder = this.transformBuilder;
        settings.base = this;
        return new Store_1(settings);
    };
    /**
     Merge transforms from a forked store back into a base store.
        By default, all of the operations from all of the transforms in the forked
     store's history will be reduced into a single transform. A subset of
     operations can be selected by specifying the `sinceTransformId` option.
        The `coalesce` option controls whether operations are coalesced into a
     minimal equivalent set before being reduced into a transform.
        @method merge
     @param {Store} forkedStore - The store to merge.
     @param {Object}  [options] settings
     @param {Boolean} [options.coalesce = true] Should operations be coalesced into a minimal equivalent set?
     @param {String}  [options.sinceTransformId = null] Select only transforms since the specified ID.
     @returns {Promise} The result of calling `update()` with the forked transforms.
    */
    Store.prototype.merge = function (forkedStore, options) {
        if (options === void 0) {
            options = {};
        }
        var transforms;
        if (options.sinceTransformId) {
            transforms = forkedStore.transformsSince(options.sinceTransformId);
        } else {
            transforms = forkedStore.allTransforms();
        }
        var reducedTransform;
        var ops = [];
        transforms.forEach(function (t) {
            Array.prototype.push.apply(ops, t.operations);
        });
        if (options.coalesce !== false) {
            ops = data_1.coalesceRecordOperations(ops);
        }
        reducedTransform = data_1.buildTransform(ops, options.transformOptions);
        return this.update(reducedTransform);
    };
    /**
     Rolls back the Store to a particular transformId
        @method rollback
     @param {string} transformId - The ID of the transform to roll back to
     @param {number} relativePosition - A positive or negative integer to specify a position relative to `transformId`
     @returns {undefined}
    */
    Store.prototype.rollback = function (transformId, relativePosition) {
        if (relativePosition === void 0) {
            relativePosition = 0;
        }
        return this.transformLog.rollback(transformId, relativePosition);
    };
    /**
     Returns all transforms since a particular `transformId`.
        @method transformsSince
     @param {string} transformId - The ID of the transform to start with.
     @returns {Array} Array of transforms.
    */
    Store.prototype.transformsSince = function (transformId) {
        var _this = this;
        return this.transformLog.after(transformId).map(function (id) {
            return _this._transforms[id];
        });
    };
    /**
     Returns all tracked transforms.
        @method allTransforms
     @returns {Array} Array of transforms.
    */
    Store.prototype.allTransforms = function () {
        var _this = this;
        return this.transformLog.entries.map(function (id) {
            return _this._transforms[id];
        });
    };
    Store.prototype.getTransform = function (transformId) {
        return this._transforms[transformId];
    };
    Store.prototype.getInverseOperations = function (transformId) {
        return this._transformInverses[transformId];
    };
    /////////////////////////////////////////////////////////////////////////////
    // Protected methods
    /////////////////////////////////////////////////////////////////////////////
    Store.prototype._applyTransform = function (transform) {
        var result = this.cache.patch(transform.operations);
        this._transforms[transform.id] = transform;
        this._transformInverses[transform.id] = result.inverse;
        return result.data;
    };
    Store.prototype._clearTransformFromHistory = function (transformId) {
        delete this._transforms[transformId];
        delete this._transformInverses[transformId];
    };
    Store.prototype._logCleared = function () {
        this._transforms = {};
        this._transformInverses = {};
    };
    Store.prototype._logTruncated = function (transformId, relativePosition, removed) {
        var _this = this;
        removed.forEach(function (id) {
            return _this._clearTransformFromHistory(id);
        });
    };
    Store.prototype._logRolledback = function (transformId, relativePosition, removed) {
        var _this = this;
        removed.reverse().forEach(function (id) {
            var inverseOperations = _this._transformInverses[id];
            if (inverseOperations) {
                _this.cache.patch(inverseOperations);
            }
            _this._clearTransformFromHistory(id);
        });
    };
    Store = Store_1 = __decorate([data_1.syncable, data_1.queryable, data_1.updatable], Store);
    return Store;
    var Store_1;
}(data_1.Source);
exports.default = Store;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzcmMvc3RvcmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEscUJBYXFCO0FBRXJCLHNCQUE0QztBQUM1QyxzQkFBZ0U7QUFnQmhFO0FBQW1DLHFCQUFNO0FBZ0J2QyxtQkFBWSxBQUE0QjtBQUE1QixpQ0FBQTtBQUFBLHVCQUE0Qjs7QUFBeEMsb0JBNEJDO0FBM0JDLGdCQUFNLE9BQUMsQUFBK0UsaUZBQUUsQ0FBQyxDQUFDLEFBQVEsU0FBQyxBQUFNLEFBQUMsQUFBQztBQUUzRyxZQUFJLEFBQU0sU0FBVyxBQUFRLFNBQUMsQUFBTSxBQUFDO0FBQ3JDLFlBQUksQUFBTSxTQUFXLEFBQVEsU0FBQyxBQUFNLEFBQUM7QUFFckMsQUFBUSxpQkFBQyxBQUFJLE9BQUcsQUFBUSxTQUFDLEFBQUksUUFBSSxBQUFPLEFBQUM7QUFFekMsZ0JBQUEsa0JBQU0sQUFBUSxBQUFDLGFBQUM7QUFFaEIsQUFBSSxjQUFDLEFBQVcsY0FBRyxBQUFFLEFBQUM7QUFDdEIsQUFBSSxjQUFDLEFBQWtCLHFCQUFHLEFBQUUsQUFBQztBQUU3QixBQUFJLGNBQUMsQUFBWSxhQUFDLEFBQUUsR0FBQyxBQUFPLFNBQWMsQUFBSSxNQUFDLEFBQVcsYUFBRSxBQUFJLEFBQUMsQUFBQztBQUNsRSxBQUFJLGNBQUMsQUFBWSxhQUFDLEFBQUUsR0FBQyxBQUFVLFlBQWMsQUFBSSxNQUFDLEFBQWEsZUFBRSxBQUFJLEFBQUMsQUFBQztBQUN2RSxBQUFJLGNBQUMsQUFBWSxhQUFDLEFBQUUsR0FBQyxBQUFVLFlBQWMsQUFBSSxNQUFDLEFBQWMsZ0JBQUUsQUFBSSxBQUFDLEFBQUM7QUFFeEUsWUFBSSxBQUFhLGdCQUFrQixBQUFRLFNBQUMsQUFBYSxpQkFBSSxBQUFFLEFBQUM7QUFDaEUsQUFBYSxzQkFBQyxBQUFNLFNBQUcsQUFBTSxBQUFDO0FBQzlCLEFBQWEsc0JBQUMsQUFB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V0FBQzs7QUF6T0QsQUF5T0MsRUF6T2tDLE9BQU0sQUF5T3hDO2tCQXpPb0IsQUFBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBPcmJpdCwge1xyXG4gIEtleU1hcCxcclxuICBSZWNvcmRPcGVyYXRpb24sXHJcbiAgU2NoZW1hLFxyXG4gIFNvdXJjZSwgU291cmNlU2V0dGluZ3MsXHJcbiAgU3luY2FibGUsIHN5bmNhYmxlLFxyXG4gIFF1ZXJ5LCBRdWVyeU9yRXhwcmVzc2lvbixcclxuICBRdWVyeWFibGUsIHF1ZXJ5YWJsZSxcclxuICBVcGRhdGFibGUsIHVwZGF0YWJsZSxcclxuICBUcmFuc2Zvcm0sXHJcbiAgVHJhbnNmb3JtT3JPcGVyYXRpb25zLFxyXG4gIGNvYWxlc2NlUmVjb3JkT3BlcmF0aW9ucyxcclxuICBidWlsZFRyYW5zZm9ybVxyXG59IGZyb20gJ0BvcmJpdC9kYXRhJztcclxuaW1wb3J0IHsgTG9nIH0gZnJvbSAnQG9yYml0L2NvcmUnO1xyXG5pbXBvcnQgeyBhc3NlcnQsIERpY3QgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xyXG5pbXBvcnQgQ2FjaGUsIHsgQ2FjaGVTZXR0aW5ncywgUGF0Y2hSZXN1bHREYXRhIH0gZnJvbSAnLi9jYWNoZSc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFN0b3JlU2V0dGluZ3MgZXh0ZW5kcyBTb3VyY2VTZXR0aW5ncyB7XHJcbiAgYmFzZT86IFN0b3JlO1xyXG4gIGNhY2hlU2V0dGluZ3M/OiBDYWNoZVNldHRpbmdzO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFN0b3JlTWVyZ2VPcHRpb25zIHtcclxuICBjb2FsZXNjZT86IGJvb2xlYW47XHJcbiAgc2luY2VUcmFuc2Zvcm1JZD86IHN0cmluZztcclxuICB0cmFuc2Zvcm1PcHRpb25zPzogb2JqZWN0O1xyXG59XHJcblxyXG5Ac3luY2FibGVcclxuQHF1ZXJ5YWJsZVxyXG5AdXBkYXRhYmxlXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0b3JlIGV4dGVuZHMgU291cmNlIGltcGxlbWVudHMgU3luY2FibGUsIFF1ZXJ5YWJsZSwgVXBkYXRhYmxlIHtcclxuICBwcml2YXRlIF9jYWNoZTogQ2FjaGU7XHJcbiAgcHJpdmF0ZSBfYmFzZTogU3RvcmU7XHJcbiAgcHJpdmF0ZSBfZm9ya1BvaW50OiBzdHJpbmc7XHJcbiAgcHJpdmF0ZSBfdHJhbnNmb3JtczogRGljdDxUcmFuc2Zvcm0+O1xyXG4gIHByaXZhdGUgX3RyYW5zZm9ybUludmVyc2VzOiBEaWN0PFJlY29yZE9wZXJhdGlvbltdPjtcclxuXHJcbiAgLy8gU3luY2FibGUgaW50ZXJmYWNlIHN0dWJzXHJcbiAgc3luYzogKHRyYW5zZm9ybU9yVHJhbnNmb3JtczogVHJhbnNmb3JtIHwgVHJhbnNmb3JtW10pID0+IFByb21pc2U8dm9pZD47XHJcblxyXG4gIC8vIFF1ZXJ5YWJsZSBpbnRlcmZhY2Ugc3R1YnNcclxuICBxdWVyeTogKHF1ZXJ5T3JFeHByZXNzaW9uOiBRdWVyeU9yRXhwcmVzc2lvbiwgb3B0aW9ucz86IG9iamVjdCwgaWQ/OiBzdHJpbmcpID0+IFByb21pc2U8YW55PjtcclxuXHJcbiAgLy8gVXBkYXRhYmxlIGludGVyZmFjZSBzdHVic1xyXG4gIHVwZGF0ZTogKHRyYW5zZm9ybU9yT3BlcmF0aW9uczogVHJhbnNmb3JtT3JPcGVyYXRpb25zLCBvcHRpb25zPzogb2JqZWN0LCBpZD86IHN0cmluZykgPT4gUHJvbWlzZTxhbnk+O1xyXG5cclxuICBjb25zdHJ1Y3RvcihzZXR0aW5nczogU3RvcmVTZXR0aW5ncyA9IHt9KSB7XHJcbiAgICBhc3NlcnQoJ1N0b3JlXFwncyBgc2NoZW1hYCBtdXN0IGJlIHNwZWNpZmllZCBpbiBgc2V0dGluZ3Muc2NoZW1hYCBjb25zdHJ1Y3RvciBhcmd1bWVudCcsICEhc2V0dGluZ3Muc2NoZW1hKTtcclxuXHJcbiAgICBsZXQga2V5TWFwOiBLZXlNYXAgPSBzZXR0aW5ncy5rZXlNYXA7XHJcbiAgICBsZXQgc2NoZW1hOiBTY2hlbWEgPSBzZXR0aW5ncy5zY2hlbWE7XHJcblxyXG4gICAgc2V0dGluZ3MubmFtZSA9IHNldHRpbmdzLm5hbWUgfHwgJ3N0b3JlJztcclxuXHJcbiAgICBzdXBlcihzZXR0aW5ncyk7XHJcblxyXG4gICAgdGhpcy5fdHJhbnNmb3JtcyA9IHt9O1xyXG4gICAgdGhpcy5fdHJhbnNmb3JtSW52ZXJzZXMgPSB7fTtcclxuXHJcbiAgICB0aGlzLnRyYW5zZm9ybUxvZy5vbignY2xlYXInLCA8KCkgPT4gdm9pZD50aGlzLl9sb2dDbGVhcmVkLCB0aGlzKTtcclxuICAgIHRoaXMudHJhbnNmb3JtTG9nLm9uKCd0cnVuY2F0ZScsIDwoKSA9PiB2b2lkPnRoaXMuX2xvZ1RydW5jYXRlZCwgdGhpcyk7XHJcbiAgICB0aGlzLnRyYW5zZm9ybUxvZy5vbigncm9sbGJhY2snLCA8KCkgPT4gdm9pZD50aGlzLl9sb2dSb2xsZWRiYWNrLCB0aGlzKTtcclxuXHJcbiAgICBsZXQgY2FjaGVTZXR0aW5nczogQ2FjaGVTZXR0aW5ncyA9IHNldHRpbmdzLmNhY2hlU2V0dGluZ3MgfHwge307XHJcbiAgICBjYWNoZVNldHRpbmdzLnNjaGVtYSA9IHNjaGVtYTtcclxuICAgIGNhY2hlU2V0dGluZ3Mua2V5TWFwID0ga2V5TWFwO1xyXG4gICAgY2FjaGVTZXR0aW5ncy5xdWVyeUJ1aWxkZXIgPSBjYWNoZVNldHRpbmdzLnF1ZXJ5QnVpbGRlciB8fCB0aGlzLnF1ZXJ5QnVpbGRlcjtcclxuICAgIGNhY2hlU2V0dGluZ3MudHJhbnNmb3JtQnVpbGRlciA9IGNhY2hlU2V0dGluZ3MudHJhbnNmb3JtQnVpbGRlciB8fCB0aGlzLnRyYW5zZm9ybUJ1aWxkZXI7XHJcbiAgICBpZiAoc2V0dGluZ3MuYmFzZSkge1xyXG4gICAgICB0aGlzLl9iYXNlID0gc2V0dGluZ3MuYmFzZTtcclxuICAgICAgdGhpcy5fZm9ya1BvaW50ID0gdGhpcy5fYmFzZS50cmFuc2Zvcm1Mb2cuaGVhZDtcclxuICAgICAgY2FjaGVTZXR0aW5ncy5iYXNlID0gdGhpcy5fYmFzZS5jYWNoZTtcclxuICAgIH1cclxuICAgIHRoaXMuX2NhY2hlID0gbmV3IENhY2hlKGNhY2hlU2V0dGluZ3MpO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGNhY2hlKCk6IENhY2hlIHtcclxuICAgIHJldHVybiB0aGlzLl9jYWNoZTtcclxuICB9XHJcblxyXG4gIGdldCBiYXNlKCk6IFN0b3JlIHtcclxuICAgIHJldHVybiB0aGlzLl9iYXNlO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGZvcmtQb2ludCgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMuX2ZvcmtQb2ludDtcclxuICB9XHJcblxyXG4gIHVwZ3JhZGUoKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICB0aGlzLl9jYWNoZS51cGdyYWRlKCk7XHJcbiAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgfVxyXG5cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gIC8vIFN5bmNhYmxlIGludGVyZmFjZSBpbXBsZW1lbnRhdGlvblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIF9zeW5jKHRyYW5zZm9ybTogVHJhbnNmb3JtKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICB0aGlzLl9hcHBseVRyYW5zZm9ybSh0cmFuc2Zvcm0pO1xyXG4gICAgcmV0dXJuIE9yYml0LlByb21pc2UucmVzb2x2ZSgpO1xyXG4gIH1cclxuXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAvLyBVcGRhdGFibGUgaW50ZXJmYWNlIGltcGxlbWVudGF0aW9uXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgX3VwZGF0ZSh0cmFuc2Zvcm06IFRyYW5zZm9ybSk6IFByb21pc2U8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0cyA9IHRoaXMuX2FwcGx5VHJhbnNmb3JtKHRyYW5zZm9ybSk7XHJcbiAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKHJlc3VsdHMubGVuZ3RoID09PSAxID8gcmVzdWx0c1swXSA6IHJlc3VsdHMpO1xyXG4gIH1cclxuXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAvLyBRdWVyeWFibGUgaW50ZXJmYWNlIGltcGxlbWVudGF0aW9uXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgX3F1ZXJ5KHF1ZXJ5OiBRdWVyeU9yRXhwcmVzc2lvbikge1xyXG4gICAgcmV0dXJuIE9yYml0LlByb21pc2UucmVzb2x2ZSh0aGlzLl9jYWNoZS5xdWVyeShxdWVyeSkpO1xyXG4gIH1cclxuXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAvLyBQdWJsaWMgbWV0aG9kc1xyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIC8qKlxyXG4gICBDcmVhdGUgYSBjbG9uZSwgb3IgXCJmb3JrXCIsIGZyb20gYSBcImJhc2VcIiBzdG9yZS5cclxuXHJcbiAgIFRoZSBmb3JrZWQgc3RvcmUgd2lsbCBoYXZlIHRoZSBzYW1lIGBzY2hlbWFgIGFuZCBga2V5TWFwYCBhcyBpdHMgYmFzZSBzdG9yZS5cclxuICAgVGhlIGZvcmtlZCBzdG9yZSdzIGNhY2hlIHdpbGwgc3RhcnQgd2l0aCB0aGUgc2FtZSBpbW11dGFibGUgZG9jdW1lbnQgYXNcclxuICAgdGhlIGJhc2Ugc3RvcmUuIEl0cyBjb250ZW50cyBhbmQgbG9nIHdpbGwgZXZvbHZlIGluZGVwZW5kZW50bHkuXHJcblxyXG4gICBAbWV0aG9kIGZvcmtcclxuICAgQHJldHVybnMge1N0b3JlfSBUaGUgZm9ya2VkIHN0b3JlLlxyXG4gICovXHJcbiAgZm9yayhzZXR0aW5nczogU3RvcmVTZXR0aW5ncyA9IHt9KSB7XHJcbiAgICBzZXR0aW5ncy5zY2hlbWEgPSB0aGlzLl9zY2hlbWE7XHJcbiAgICBzZXR0aW5ncy5jYWNoZVNldHRpbmdzID0gc2V0dGluZ3MuY2FjaGVTZXR0aW5ncyB8fCB7fTtcclxuICAgIHNldHRpbmdzLmtleU1hcCA9IHRoaXMuX2tleU1hcDtcclxuICAgIHNldHRpbmdzLnF1ZXJ5QnVpbGRlciA9IHRoaXMucXVlcnlCdWlsZGVyO1xyXG4gICAgc2V0dGluZ3MudHJhbnNmb3JtQnVpbGRlciA9IHRoaXMudHJhbnNmb3JtQnVpbGRlcjtcclxuICAgIHNldHRpbmdzLmJhc2UgPSB0aGlzO1xyXG5cclxuICAgIHJldHVybiBuZXcgU3RvcmUoc2V0dGluZ3MpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgIE1lcmdlIHRyYW5zZm9ybXMgZnJvbSBhIGZvcmtlZCBzdG9yZSBiYWNrIGludG8gYSBiYXNlIHN0b3JlLlxyXG5cclxuICAgQnkgZGVmYXVsdCwgYWxsIG9mIHRoZSBvcGVyYXRpb25zIGZyb20gYWxsIG9mIHRoZSB0cmFuc2Zvcm1zIGluIHRoZSBmb3JrZWRcclxuICAgc3RvcmUncyBoaXN0b3J5IHdpbGwgYmUgcmVkdWNlZCBpbnRvIGEgc2luZ2xlIHRyYW5zZm9ybS4gQSBzdWJzZXQgb2ZcclxuICAgb3BlcmF0aW9ucyBjYW4gYmUgc2VsZWN0ZWQgYnkgc3BlY2lmeWluZyB0aGUgYHNpbmNlVHJhbnNmb3JtSWRgIG9wdGlvbi5cclxuXHJcbiAgIFRoZSBgY29hbGVzY2VgIG9wdGlvbiBjb250cm9scyB3aGV0aGVyIG9wZXJhdGlvbnMgYXJlIGNvYWxlc2NlZCBpbnRvIGFcclxuICAgbWluaW1hbCBlcXVpdmFsZW50IHNldCBiZWZvcmUgYmVpbmcgcmVkdWNlZCBpbnRvIGEgdHJhbnNmb3JtLlxyXG5cclxuICAgQG1ldGhvZCBtZXJnZVxyXG4gICBAcGFyYW0ge1N0b3JlfSBmb3JrZWRTdG9yZSAtIFRoZSBzdG9yZSB0byBtZXJnZS5cclxuICAgQHBhcmFtIHtPYmplY3R9ICBbb3B0aW9uc10gc2V0dGluZ3NcclxuICAgQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5jb2FsZXNjZSA9IHRydWVdIFNob3VsZCBvcGVyYXRpb25zIGJlIGNvYWxlc2NlZCBpbnRvIGEgbWluaW1hbCBlcXVpdmFsZW50IHNldD9cclxuICAgQHBhcmFtIHtTdHJpbmd9ICBbb3B0aW9ucy5zaW5jZVRyYW5zZm9ybUlkID0gbnVsbF0gU2VsZWN0IG9ubHkgdHJhbnNmb3JtcyBzaW5jZSB0aGUgc3BlY2lmaWVkIElELlxyXG4gICBAcmV0dXJucyB7UHJvbWlzZX0gVGhlIHJlc3VsdCBvZiBjYWxsaW5nIGB1cGRhdGUoKWAgd2l0aCB0aGUgZm9ya2VkIHRyYW5zZm9ybXMuXHJcbiAgKi9cclxuICBtZXJnZShmb3JrZWRTdG9yZTogU3RvcmUsIG9wdGlvbnM6IFN0b3JlTWVyZ2VPcHRpb25zID0ge30pOiBQcm9taXNlPGFueT4ge1xyXG4gICAgbGV0IHRyYW5zZm9ybXM6IFRyYW5zZm9ybVtdO1xyXG4gICAgaWYgKG9wdGlvbnMuc2luY2VUcmFuc2Zvcm1JZCkge1xyXG4gICAgICB0cmFuc2Zvcm1zID0gZm9ya2VkU3RvcmUudHJhbnNmb3Jtc1NpbmNlKG9wdGlvbnMuc2luY2VUcmFuc2Zvcm1JZCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0cmFuc2Zvcm1zID0gZm9ya2VkU3RvcmUuYWxsVHJhbnNmb3JtcygpO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCByZWR1Y2VkVHJhbnNmb3JtO1xyXG4gICAgbGV0IG9wczogUmVjb3JkT3BlcmF0aW9uW10gPSBbXTtcclxuICAgIHRyYW5zZm9ybXMuZm9yRWFjaCh0ID0+IHtcclxuICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkob3BzLCB0Lm9wZXJhdGlvbnMpO1xyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIGlmIChvcHRpb25zLmNvYWxlc2NlICE9PSBmYWxzZSkge1xyXG4gICAgICBvcHMgPSBjb2FsZXNjZVJlY29yZE9wZXJhdGlvbnMob3BzKTtcclxuICAgIH1cclxuXHJcbiAgICByZWR1Y2VkVHJhbnNmb3JtID0gYnVpbGRUcmFuc2Zvcm0ob3BzLCBvcHRpb25zLnRyYW5zZm9ybU9wdGlvbnMpO1xyXG5cclxuICAgIHJldHVybiB0aGlzLnVwZGF0ZShyZWR1Y2VkVHJhbnNmb3JtKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICBSb2xscyBiYWNrIHRoZSBTdG9yZSB0byBhIHBhcnRpY3VsYXIgdHJhbnNmb3JtSWRcclxuXHJcbiAgIEBtZXRob2Qgcm9sbGJhY2tcclxuICAgQHBhcmFtIHtzdHJpbmd9IHRyYW5zZm9ybUlkIC0gVGhlIElEIG9mIHRoZSB0cmFuc2Zvcm0gdG8gcm9sbCBiYWNrIHRvXHJcbiAgIEBwYXJhbSB7bnVtYmVyfSByZWxhdGl2ZVBvc2l0aW9uIC0gQSBwb3NpdGl2ZSBvciBuZWdhdGl2ZSBpbnRlZ2VyIHRvIHNwZWNpZnkgYSBwb3NpdGlvbiByZWxhdGl2ZSB0byBgdHJhbnNmb3JtSWRgXHJcbiAgIEByZXR1cm5zIHt1bmRlZmluZWR9XHJcbiAgKi9cclxuICByb2xsYmFjayh0cmFuc2Zvcm1JZDogc3RyaW5nLCByZWxhdGl2ZVBvc2l0aW9uOiBudW1iZXIgPSAwKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICByZXR1cm4gdGhpcy50cmFuc2Zvcm1Mb2cucm9sbGJhY2sodHJhbnNmb3JtSWQsIHJlbGF0aXZlUG9zaXRpb24pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgIFJldHVybnMgYWxsIHRyYW5zZm9ybXMgc2luY2UgYSBwYXJ0aWN1bGFyIGB0cmFuc2Zvcm1JZGAuXHJcblxyXG4gICBAbWV0aG9kIHRyYW5zZm9ybXNTaW5jZVxyXG4gICBAcGFyYW0ge3N0cmluZ30gdHJhbnNmb3JtSWQgLSBUaGUgSUQgb2YgdGhlIHRyYW5zZm9ybSB0byBzdGFydCB3aXRoLlxyXG4gICBAcmV0dXJucyB7QXJyYXl9IEFycmF5IG9mIHRyYW5zZm9ybXMuXHJcbiAgKi9cclxuICB0cmFuc2Zvcm1zU2luY2UodHJhbnNmb3JtSWQ6IHN0cmluZyk6IFRyYW5zZm9ybVtdIHtcclxuICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybUxvZ1xyXG4gICAgICAuYWZ0ZXIodHJhbnNmb3JtSWQpXHJcbiAgICAgIC5tYXAoaWQgPT4gdGhpcy5fdHJhbnNmb3Jtc1tpZF0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgIFJldHVybnMgYWxsIHRyYWNrZWQgdHJhbnNmb3Jtcy5cclxuXHJcbiAgIEBtZXRob2QgYWxsVHJhbnNmb3Jtc1xyXG4gICBAcmV0dXJucyB7QXJyYXl9IEFycmF5IG9mIHRyYW5zZm9ybXMuXHJcbiAgKi9cclxuICBhbGxUcmFuc2Zvcm1zKCk6IFRyYW5zZm9ybVtdIHtcclxuICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybUxvZy5lbnRyaWVzXHJcbiAgICAgIC5tYXAoaWQgPT4gdGhpcy5fdHJhbnNmb3Jtc1tpZF0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0VHJhbnNmb3JtKHRyYW5zZm9ybUlkOiBzdHJpbmcpOiBUcmFuc2Zvcm0ge1xyXG4gICAgcmV0dXJuIHRoaXMuX3RyYW5zZm9ybXNbdHJhbnNmb3JtSWRdO1xyXG4gIH1cclxuXHJcbiAgZ2V0SW52ZXJzZU9wZXJhdGlvbnModHJhbnNmb3JtSWQ6IHN0cmluZyk6IFJlY29yZE9wZXJhdGlvbltdIHtcclxuICAgIHJldHVybiB0aGlzLl90cmFuc2Zvcm1JbnZlcnNlc1t0cmFuc2Zvcm1JZF07XHJcbiAgfVxyXG5cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gIC8vIFByb3RlY3RlZCBtZXRob2RzXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgcHJvdGVjdGVkIF9hcHBseVRyYW5zZm9ybSh0cmFuc2Zvcm06IFRyYW5zZm9ybSk6IFBhdGNoUmVzdWx0RGF0YVtdIHtcclxuICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuY2FjaGUucGF0Y2goPFJlY29yZE9wZXJhdGlvbltdPnRyYW5zZm9ybS5vcGVyYXRpb25zKTtcclxuICAgIHRoaXMuX3RyYW5zZm9ybXNbdHJhbnNmb3JtLmlkXSA9IHRyYW5zZm9ybTtcclxuICAgIHRoaXMuX3RyYW5zZm9ybUludmVyc2VzW3RyYW5zZm9ybS5pZF0gPSByZXN1bHQuaW52ZXJzZTtcclxuICAgIHJldHVybiByZXN1bHQuZGF0YTtcclxuICB9XHJcblxyXG4gIHByb3RlY3RlZCBfY2xlYXJUcmFuc2Zvcm1Gcm9tSGlzdG9yeSh0cmFuc2Zvcm1JZDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICBkZWxldGUgdGhpcy5fdHJhbnNmb3Jtc1t0cmFuc2Zvcm1JZF07XHJcbiAgICBkZWxldGUgdGhpcy5fdHJhbnNmb3JtSW52ZXJzZXNbdHJhbnNmb3JtSWRdO1xyXG4gIH1cclxuXHJcbiAgcHJvdGVjdGVkIF9sb2dDbGVhcmVkKCk6IHZvaWQge1xyXG4gICAgdGhpcy5fdHJhbnNmb3JtcyA9IHt9O1xyXG4gICAgdGhpcy5fdHJhbnNmb3JtSW52ZXJzZXMgPSB7fTtcclxuICB9XHJcblxyXG4gIHByb3RlY3RlZCBfbG9nVHJ1bmNhdGVkKHRyYW5zZm9ybUlkOiBzdHJpbmcsIHJlbGF0aXZlUG9zaXRpb246IG51bWJlciwgcmVtb3ZlZDogc3RyaW5nW10pOiB2b2lkIHtcclxuICAgIHJlbW92ZWQuZm9yRWFjaChpZCA9PiB0aGlzLl9jbGVhclRyYW5zZm9ybUZyb21IaXN0b3J5KGlkKSk7XHJcbiAgfVxyXG5cclxuICBwcm90ZWN0ZWQgX2xvZ1JvbGxlZGJhY2sodHJhbnNmb3JtSWQ6IHN0cmluZywgcmVsYXRpdmVQb3NpdGlvbjogbnVtYmVyLCByZW1vdmVkOiBzdHJpbmdbXSk6IHZvaWQge1xyXG4gICAgcmVtb3ZlZC5yZXZlcnNlKCkuZm9yRWFjaChpZCA9PiB7XHJcbiAgICAgIGNvbnN0IGludmVyc2VPcGVyYXRpb25zID0gdGhpcy5fdHJhbnNmb3JtSW52ZXJzZXNbaWRdO1xyXG4gICAgICBpZiAoaW52ZXJzZU9wZXJhdGlvbnMpIHtcclxuICAgICAgICB0aGlzLmNhY2hlLnBhdGNoKGludmVyc2VPcGVyYXRpb25zKTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLl9jbGVhclRyYW5zZm9ybUZyb21IaXN0b3J5KGlkKTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG4iXX0=