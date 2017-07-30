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
        settings.cacheSettings.base = this._cache;
        settings.keyMap = this._keyMap;
        settings.queryBuilder = this.queryBuilder;
        settings.transformBuilder = this.transformBuilder;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzcmMvc3RvcmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEscUJBYXFCO0FBRXJCLHNCQUE0QztBQUM1QyxzQkFBZ0U7QUFlaEU7QUFBbUMscUJBQU07QUFjdkMsbUJBQVksQUFBNEI7QUFBNUIsaUNBQUE7QUFBQSx1QkFBNEI7O0FBQXhDLG9CQXVCQztBQXRCQyxnQkFBTSxPQUFDLEFBQStFLGlGQUFFLENBQUMsQ0FBQyxBQUFRLFNBQUMsQUFBTSxBQUFDLEFBQUM7QUFFM0csWUFBSSxBQUFNLFNBQVcsQUFBUSxTQUFDLEFBQU0sQUFBQztBQUNyQyxZQUFJLEFBQU0sU0FBVyxBQUFRLFNBQUMsQUFBTSxBQUFDO0FBRXJDLEFBQVEsaUJBQUMsQUFBSSxPQUFHLEFBQVEsU0FBQyxBQUFJLFFBQUksQUFBTyxBQUFDO0FBRXpDLGdCQUFBLGtCQUFNLEFBQVEsQUFBQyxhQUFDO0FBRWhCLEFBQUksY0FBQyxBQUFXLGNBQUcsQUFBRSxBQUFDO0FBQ3RCLEFBQUksY0FBQyxBQUFrQixxQkFBRyxBQUFFLEFBQUM7QUFFN0IsQUFBSSxjQUFDLEFBQVksYUFBQyxBQUFFLEdBQUMsQUFBTyxTQUFjLEFBQUksTUFBQyxBQUFXLGFBQUUsQUFBSSxBQUFDLEFBQUM7QUFDbEUsQUFBSSxjQUFDLEFBQVksYUFBQyxBQUFFLEdBQUMsQUFBVSxZQUFjLEFBQUksTUFBQyxBQUFhLGVBQUUsQUFBSSxBQUFDLEFBQUM7QUFDdkUsQUFBSSxjQUFDLEFBQVksYUFBQyxBQUFFLEdBQUMsQUFBVSxZQUFjLEFBQUksTUFBQyxBQUFjLGdCQUFFLEFBQUksQUFBQyxBQUFDO0FBRXhFLFlBQUksQUFBYSxnQkFBa0IsQUFBUSxTQUFDLEFBQWEsaUJBQUksQUFBRSxBQUFDO0FBQ2hFLEFBQWEsc0JBQUMsQUFBTSxTQUFHLEFBQU0sQUFBQztBQUM5QixBQUFhLHNCQUFDLEFBQU0s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aUJBQXhCLFVBQXlCLEFBQW1CLGFBQUUsQUFBd0Isa0JBQUUsQUFBaUI7QUFBekYsb0JBUUM7QUFQQyxBQUFPLGdCQUFDLEFBQU8sQUFBRSxVQUFDLEFBQU8sUUFBQyxVQUFBLEFBQUU7QUFDMUIsZ0JBQU0sQUFBaUIsb0JBQUcsQUFBSSxNQUFDLEFBQWtCLG1CQUFDLEFBQUUsQUFBQyxBQUFDO0FBQ3RELEFBQUUsQUFBQyxnQkFBQyxBQUFpQixBQUFDLG1CQUFDLEFBQUM7QUFDdEIsQUFBSSxzQkFBQyxBQUFLLE1BQUMsQUFBSyxNQUFDLEFBQWlCLEFBQUMsQUFBQyxBQUN0QztBQUFDO0FBQ0QsQUFBSSxrQkFBQyxBQUEwQiwyQkFBQyxBQUFFLEFBQUMsQUFBQyxBQUN0QztBQUFDLEFBQUMsQUFBQyxBQUNMO0FBQUM7QUFwTmtCLEFBQUssa0NBSHpCLE9BQVEsVUFDUixPQUFTLFdBQ1QsT0FBUyxZQUNXLEFBQUssQUFxTnpCO0FBQUQsV0FBQzs7QUFyTkQsQUFxTkMsRUFyTmtDLE9BQU0sQUFxTnhDO2tCQXJOb0IsQUFBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBPcmJpdCwge1xyXG4gIEtleU1hcCxcclxuICBSZWNvcmRPcGVyYXRpb24sXHJcbiAgU2NoZW1hLFxyXG4gIFNvdXJjZSwgU291cmNlU2V0dGluZ3MsXHJcbiAgU3luY2FibGUsIHN5bmNhYmxlLFxyXG4gIFF1ZXJ5LCBRdWVyeU9yRXhwcmVzc2lvbixcclxuICBRdWVyeWFibGUsIHF1ZXJ5YWJsZSxcclxuICBVcGRhdGFibGUsIHVwZGF0YWJsZSxcclxuICBUcmFuc2Zvcm0sXHJcbiAgVHJhbnNmb3JtT3JPcGVyYXRpb25zLFxyXG4gIGNvYWxlc2NlUmVjb3JkT3BlcmF0aW9ucyxcclxuICBidWlsZFRyYW5zZm9ybVxyXG59IGZyb20gJ0BvcmJpdC9kYXRhJztcclxuaW1wb3J0IHsgTG9nIH0gZnJvbSAnQG9yYml0L2NvcmUnO1xyXG5pbXBvcnQgeyBhc3NlcnQsIERpY3QgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xyXG5pbXBvcnQgQ2FjaGUsIHsgQ2FjaGVTZXR0aW5ncywgUGF0Y2hSZXN1bHREYXRhIH0gZnJvbSAnLi9jYWNoZSc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFN0b3JlU2V0dGluZ3MgZXh0ZW5kcyBTb3VyY2VTZXR0aW5ncyB7XHJcbiAgY2FjaGVTZXR0aW5ncz86IENhY2hlU2V0dGluZ3NcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBTdG9yZU1lcmdlT3B0aW9ucyB7XHJcbiAgY29hbGVzY2U/OiBib29sZWFuO1xyXG4gIHNpbmNlVHJhbnNmb3JtSWQ/OiBzdHJpbmc7XHJcbiAgdHJhbnNmb3JtT3B0aW9ucz86IG9iamVjdDtcclxufVxyXG5cclxuQHN5bmNhYmxlXHJcbkBxdWVyeWFibGVcclxuQHVwZGF0YWJsZVxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdG9yZSBleHRlbmRzIFNvdXJjZSBpbXBsZW1lbnRzIFN5bmNhYmxlLCBRdWVyeWFibGUsIFVwZGF0YWJsZSB7XHJcbiAgcHJpdmF0ZSBfY2FjaGU6IENhY2hlO1xyXG4gIHByaXZhdGUgX3RyYW5zZm9ybXM6IERpY3Q8VHJhbnNmb3JtPjtcclxuICBwcml2YXRlIF90cmFuc2Zvcm1JbnZlcnNlczogRGljdDxSZWNvcmRPcGVyYXRpb25bXT47XHJcblxyXG4gIC8vIFN5bmNhYmxlIGludGVyZmFjZSBzdHVic1xyXG4gIHN5bmM6ICh0cmFuc2Zvcm1PclRyYW5zZm9ybXM6IFRyYW5zZm9ybSB8IFRyYW5zZm9ybVtdKSA9PiBQcm9taXNlPHZvaWQ+O1xyXG5cclxuICAvLyBRdWVyeWFibGUgaW50ZXJmYWNlIHN0dWJzXHJcbiAgcXVlcnk6IChxdWVyeU9yRXhwcmVzc2lvbjogUXVlcnlPckV4cHJlc3Npb24sIG9wdGlvbnM/OiBvYmplY3QsIGlkPzogc3RyaW5nKSA9PiBQcm9taXNlPGFueT47XHJcblxyXG4gIC8vIFVwZGF0YWJsZSBpbnRlcmZhY2Ugc3R1YnNcclxuICB1cGRhdGU6ICh0cmFuc2Zvcm1Pck9wZXJhdGlvbnM6IFRyYW5zZm9ybU9yT3BlcmF0aW9ucywgb3B0aW9ucz86IG9iamVjdCwgaWQ/OiBzdHJpbmcpID0+IFByb21pc2U8YW55PjtcclxuXHJcbiAgY29uc3RydWN0b3Ioc2V0dGluZ3M6IFN0b3JlU2V0dGluZ3MgPSB7fSkge1xyXG4gICAgYXNzZXJ0KCdTdG9yZVxcJ3MgYHNjaGVtYWAgbXVzdCBiZSBzcGVjaWZpZWQgaW4gYHNldHRpbmdzLnNjaGVtYWAgY29uc3RydWN0b3IgYXJndW1lbnQnLCAhIXNldHRpbmdzLnNjaGVtYSk7XHJcblxyXG4gICAgbGV0IGtleU1hcDogS2V5TWFwID0gc2V0dGluZ3Mua2V5TWFwO1xyXG4gICAgbGV0IHNjaGVtYTogU2NoZW1hID0gc2V0dGluZ3Muc2NoZW1hO1xyXG5cclxuICAgIHNldHRpbmdzLm5hbWUgPSBzZXR0aW5ncy5uYW1lIHx8ICdzdG9yZSc7XHJcblxyXG4gICAgc3VwZXIoc2V0dGluZ3MpO1xyXG5cclxuICAgIHRoaXMuX3RyYW5zZm9ybXMgPSB7fTtcclxuICAgIHRoaXMuX3RyYW5zZm9ybUludmVyc2VzID0ge307XHJcblxyXG4gICAgdGhpcy50cmFuc2Zvcm1Mb2cub24oJ2NsZWFyJywgPCgpID0+IHZvaWQ+dGhpcy5fbG9nQ2xlYXJlZCwgdGhpcyk7XHJcbiAgICB0aGlzLnRyYW5zZm9ybUxvZy5vbigndHJ1bmNhdGUnLCA8KCkgPT4gdm9pZD50aGlzLl9sb2dUcnVuY2F0ZWQsIHRoaXMpO1xyXG4gICAgdGhpcy50cmFuc2Zvcm1Mb2cub24oJ3JvbGxiYWNrJywgPCgpID0+IHZvaWQ+dGhpcy5fbG9nUm9sbGVkYmFjaywgdGhpcyk7XHJcblxyXG4gICAgbGV0IGNhY2hlU2V0dGluZ3M6IENhY2hlU2V0dGluZ3MgPSBzZXR0aW5ncy5jYWNoZVNldHRpbmdzIHx8IHt9O1xyXG4gICAgY2FjaGVTZXR0aW5ncy5zY2hlbWEgPSBzY2hlbWE7XHJcbiAgICBjYWNoZVNldHRpbmdzLmtleU1hcCA9IGtleU1hcDtcclxuICAgIGNhY2hlU2V0dGluZ3MucXVlcnlCdWlsZGVyID0gY2FjaGVTZXR0aW5ncy5xdWVyeUJ1aWxkZXIgfHwgdGhpcy5xdWVyeUJ1aWxkZXI7XHJcbiAgICBjYWNoZVNldHRpbmdzLnRyYW5zZm9ybUJ1aWxkZXIgPSBjYWNoZVNldHRpbmdzLnRyYW5zZm9ybUJ1aWxkZXIgfHwgdGhpcy50cmFuc2Zvcm1CdWlsZGVyO1xyXG4gICAgdGhpcy5fY2FjaGUgPSBuZXcgQ2FjaGUoY2FjaGVTZXR0aW5ncyk7XHJcbiAgfVxyXG5cclxuICBnZXQgY2FjaGUoKTogQ2FjaGUge1xyXG4gICAgcmV0dXJuIHRoaXMuX2NhY2hlO1xyXG4gIH1cclxuXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAvLyBTeW5jYWJsZSBpbnRlcmZhY2UgaW1wbGVtZW50YXRpb25cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICBfc3luYyh0cmFuc2Zvcm06IFRyYW5zZm9ybSk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgdGhpcy5fYXBwbHlUcmFuc2Zvcm0odHJhbnNmb3JtKTtcclxuICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKTtcclxuICB9XHJcblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgLy8gVXBkYXRhYmxlIGludGVyZmFjZSBpbXBsZW1lbnRhdGlvblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIF91cGRhdGUodHJhbnNmb3JtOiBUcmFuc2Zvcm0pOiBQcm9taXNlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdHMgPSB0aGlzLl9hcHBseVRyYW5zZm9ybSh0cmFuc2Zvcm0pO1xyXG4gICAgcmV0dXJuIE9yYml0LlByb21pc2UucmVzb2x2ZShyZXN1bHRzLmxlbmd0aCA9PT0gMSA/IHJlc3VsdHNbMF0gOiByZXN1bHRzKTtcclxuICB9XHJcblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgLy8gUXVlcnlhYmxlIGludGVyZmFjZSBpbXBsZW1lbnRhdGlvblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIF9xdWVyeShxdWVyeTogUXVlcnlPckV4cHJlc3Npb24pIHtcclxuICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUodGhpcy5fY2FjaGUucXVlcnkocXVlcnkpKTtcclxuICB9XHJcblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgLy8gUHVibGljIG1ldGhvZHNcclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAvKipcclxuICAgQ3JlYXRlIGEgY2xvbmUsIG9yIFwiZm9ya1wiLCBmcm9tIGEgXCJiYXNlXCIgc3RvcmUuXHJcblxyXG4gICBUaGUgZm9ya2VkIHN0b3JlIHdpbGwgaGF2ZSB0aGUgc2FtZSBgc2NoZW1hYCBhbmQgYGtleU1hcGAgYXMgaXRzIGJhc2Ugc3RvcmUuXHJcbiAgIFRoZSBmb3JrZWQgc3RvcmUncyBjYWNoZSB3aWxsIHN0YXJ0IHdpdGggdGhlIHNhbWUgaW1tdXRhYmxlIGRvY3VtZW50IGFzXHJcbiAgIHRoZSBiYXNlIHN0b3JlLiBJdHMgY29udGVudHMgYW5kIGxvZyB3aWxsIGV2b2x2ZSBpbmRlcGVuZGVudGx5LlxyXG5cclxuICAgQG1ldGhvZCBmb3JrXHJcbiAgIEByZXR1cm5zIHtTdG9yZX0gVGhlIGZvcmtlZCBzdG9yZS5cclxuICAqL1xyXG4gIGZvcmsoc2V0dGluZ3M6IFN0b3JlU2V0dGluZ3MgPSB7fSkge1xyXG4gICAgc2V0dGluZ3Muc2NoZW1hID0gdGhpcy5fc2NoZW1hO1xyXG4gICAgc2V0dGluZ3MuY2FjaGVTZXR0aW5ncyA9IHNldHRpbmdzLmNhY2hlU2V0dGluZ3MgfHwge307XHJcbiAgICBzZXR0aW5ncy5jYWNoZVNldHRpbmdzLmJhc2UgPSB0aGlzLl9jYWNoZTtcclxuICAgIHNldHRpbmdzLmtleU1hcCA9IHRoaXMuX2tleU1hcDtcclxuICAgIHNldHRpbmdzLnF1ZXJ5QnVpbGRlciA9IHRoaXMucXVlcnlCdWlsZGVyO1xyXG4gICAgc2V0dGluZ3MudHJhbnNmb3JtQnVpbGRlciA9IHRoaXMudHJhbnNmb3JtQnVpbGRlcjtcclxuXHJcbiAgICByZXR1cm4gbmV3IFN0b3JlKHNldHRpbmdzKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICBNZXJnZSB0cmFuc2Zvcm1zIGZyb20gYSBmb3JrZWQgc3RvcmUgYmFjayBpbnRvIGEgYmFzZSBzdG9yZS5cclxuXHJcbiAgIEJ5IGRlZmF1bHQsIGFsbCBvZiB0aGUgb3BlcmF0aW9ucyBmcm9tIGFsbCBvZiB0aGUgdHJhbnNmb3JtcyBpbiB0aGUgZm9ya2VkXHJcbiAgIHN0b3JlJ3MgaGlzdG9yeSB3aWxsIGJlIHJlZHVjZWQgaW50byBhIHNpbmdsZSB0cmFuc2Zvcm0uIEEgc3Vic2V0IG9mXHJcbiAgIG9wZXJhdGlvbnMgY2FuIGJlIHNlbGVjdGVkIGJ5IHNwZWNpZnlpbmcgdGhlIGBzaW5jZVRyYW5zZm9ybUlkYCBvcHRpb24uXHJcblxyXG4gICBUaGUgYGNvYWxlc2NlYCBvcHRpb24gY29udHJvbHMgd2hldGhlciBvcGVyYXRpb25zIGFyZSBjb2FsZXNjZWQgaW50byBhXHJcbiAgIG1pbmltYWwgZXF1aXZhbGVudCBzZXQgYmVmb3JlIGJlaW5nIHJlZHVjZWQgaW50byBhIHRyYW5zZm9ybS5cclxuXHJcbiAgIEBtZXRob2QgbWVyZ2VcclxuICAgQHBhcmFtIHtTdG9yZX0gZm9ya2VkU3RvcmUgLSBUaGUgc3RvcmUgdG8gbWVyZ2UuXHJcbiAgIEBwYXJhbSB7T2JqZWN0fSAgW29wdGlvbnNdIHNldHRpbmdzXHJcbiAgIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuY29hbGVzY2UgPSB0cnVlXSBTaG91bGQgb3BlcmF0aW9ucyBiZSBjb2FsZXNjZWQgaW50byBhIG1pbmltYWwgZXF1aXZhbGVudCBzZXQ/XHJcbiAgIEBwYXJhbSB7U3RyaW5nfSAgW29wdGlvbnMuc2luY2VUcmFuc2Zvcm1JZCA9IG51bGxdIFNlbGVjdCBvbmx5IHRyYW5zZm9ybXMgc2luY2UgdGhlIHNwZWNpZmllZCBJRC5cclxuICAgQHJldHVybnMge1Byb21pc2V9IFRoZSByZXN1bHQgb2YgY2FsbGluZyBgdXBkYXRlKClgIHdpdGggdGhlIGZvcmtlZCB0cmFuc2Zvcm1zLlxyXG4gICovXHJcbiAgbWVyZ2UoZm9ya2VkU3RvcmU6IFN0b3JlLCBvcHRpb25zOiBTdG9yZU1lcmdlT3B0aW9ucyA9IHt9KSB7XHJcbiAgICBsZXQgdHJhbnNmb3JtczogVHJhbnNmb3JtW107XHJcbiAgICBpZiAob3B0aW9ucy5zaW5jZVRyYW5zZm9ybUlkKSB7XHJcbiAgICAgIHRyYW5zZm9ybXMgPSBmb3JrZWRTdG9yZS50cmFuc2Zvcm1zU2luY2Uob3B0aW9ucy5zaW5jZVRyYW5zZm9ybUlkKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRyYW5zZm9ybXMgPSBmb3JrZWRTdG9yZS5hbGxUcmFuc2Zvcm1zKCk7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHJlZHVjZWRUcmFuc2Zvcm07XHJcbiAgICBsZXQgb3BzOiBSZWNvcmRPcGVyYXRpb25bXSA9IFtdO1xyXG4gICAgdHJhbnNmb3Jtcy5mb3JFYWNoKHQgPT4ge1xyXG4gICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShvcHMsIHQub3BlcmF0aW9ucyk7XHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgaWYgKG9wdGlvbnMuY29hbGVzY2UgIT09IGZhbHNlKSB7XHJcbiAgICAgIG9wcyA9IGNvYWxlc2NlUmVjb3JkT3BlcmF0aW9ucyhvcHMpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlZHVjZWRUcmFuc2Zvcm0gPSBidWlsZFRyYW5zZm9ybShvcHMsIG9wdGlvbnMudHJhbnNmb3JtT3B0aW9ucyk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMudXBkYXRlKHJlZHVjZWRUcmFuc2Zvcm0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgIFJvbGxzIGJhY2sgdGhlIFN0b3JlIHRvIGEgcGFydGljdWxhciB0cmFuc2Zvcm1JZFxyXG5cclxuICAgQG1ldGhvZCByb2xsYmFja1xyXG4gICBAcGFyYW0ge3N0cmluZ30gdHJhbnNmb3JtSWQgLSBUaGUgSUQgb2YgdGhlIHRyYW5zZm9ybSB0byByb2xsIGJhY2sgdG9cclxuICAgQHBhcmFtIHtudW1iZXJ9IHJlbGF0aXZlUG9zaXRpb24gLSBBIHBvc2l0aXZlIG9yIG5lZ2F0aXZlIGludGVnZXIgdG8gc3BlY2lmeSBhIHBvc2l0aW9uIHJlbGF0aXZlIHRvIGB0cmFuc2Zvcm1JZGBcclxuICAgQHJldHVybnMge3VuZGVmaW5lZH1cclxuICAqL1xyXG4gIHJvbGxiYWNrKHRyYW5zZm9ybUlkOiBzdHJpbmcsIHJlbGF0aXZlUG9zaXRpb246IG51bWJlciA9IDApIHtcclxuICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybUxvZy5yb2xsYmFjayh0cmFuc2Zvcm1JZCwgcmVsYXRpdmVQb3NpdGlvbik7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgUmV0dXJucyBhbGwgdHJhbnNmb3JtcyBzaW5jZSBhIHBhcnRpY3VsYXIgYHRyYW5zZm9ybUlkYC5cclxuXHJcbiAgIEBtZXRob2QgdHJhbnNmb3Jtc1NpbmNlXHJcbiAgIEBwYXJhbSB7c3RyaW5nfSB0cmFuc2Zvcm1JZCAtIFRoZSBJRCBvZiB0aGUgdHJhbnNmb3JtIHRvIHN0YXJ0IHdpdGguXHJcbiAgIEByZXR1cm5zIHtBcnJheX0gQXJyYXkgb2YgdHJhbnNmb3Jtcy5cclxuICAqL1xyXG4gIHRyYW5zZm9ybXNTaW5jZSh0cmFuc2Zvcm1JZDogc3RyaW5nKTogVHJhbnNmb3JtW10ge1xyXG4gICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtTG9nXHJcbiAgICAgIC5hZnRlcih0cmFuc2Zvcm1JZClcclxuICAgICAgLm1hcChpZCA9PiB0aGlzLl90cmFuc2Zvcm1zW2lkXSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgUmV0dXJucyBhbGwgdHJhY2tlZCB0cmFuc2Zvcm1zLlxyXG5cclxuICAgQG1ldGhvZCBhbGxUcmFuc2Zvcm1zXHJcbiAgIEByZXR1cm5zIHtBcnJheX0gQXJyYXkgb2YgdHJhbnNmb3Jtcy5cclxuICAqL1xyXG4gIGFsbFRyYW5zZm9ybXMoKTogVHJhbnNmb3JtW10ge1xyXG4gICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtTG9nLmVudHJpZXNcclxuICAgICAgLm1hcChpZCA9PiB0aGlzLl90cmFuc2Zvcm1zW2lkXSk7XHJcbiAgfVxyXG5cclxuICBnZXRUcmFuc2Zvcm0odHJhbnNmb3JtSWQ6IHN0cmluZyk6IFRyYW5zZm9ybSB7XHJcbiAgICByZXR1cm4gdGhpcy5fdHJhbnNmb3Jtc1t0cmFuc2Zvcm1JZF07XHJcbiAgfVxyXG5cclxuICBnZXRJbnZlcnNlT3BlcmF0aW9ucyh0cmFuc2Zvcm1JZDogc3RyaW5nKTogUmVjb3JkT3BlcmF0aW9uW10ge1xyXG4gICAgcmV0dXJuIHRoaXMuX3RyYW5zZm9ybUludmVyc2VzW3RyYW5zZm9ybUlkXTtcclxuICB9XHJcblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgLy8gUHJvdGVjdGVkIG1ldGhvZHNcclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICBwcm90ZWN0ZWQgX2FwcGx5VHJhbnNmb3JtKHRyYW5zZm9ybTogVHJhbnNmb3JtKTogUGF0Y2hSZXN1bHREYXRhW10ge1xyXG4gICAgY29uc3QgcmVzdWx0ID0gdGhpcy5jYWNoZS5wYXRjaCg8UmVjb3JkT3BlcmF0aW9uW10+dHJhbnNmb3JtLm9wZXJhdGlvbnMpO1xyXG4gICAgdGhpcy5fdHJhbnNmb3Jtc1t0cmFuc2Zvcm0uaWRdID0gdHJhbnNmb3JtO1xyXG4gICAgdGhpcy5fdHJhbnNmb3JtSW52ZXJzZXNbdHJhbnNmb3JtLmlkXSA9IHJlc3VsdC5pbnZlcnNlO1xyXG4gICAgcmV0dXJuIHJlc3VsdC5kYXRhO1xyXG4gIH1cclxuXHJcbiAgcHJvdGVjdGVkIF9jbGVhclRyYW5zZm9ybUZyb21IaXN0b3J5KHRyYW5zZm9ybUlkOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIGRlbGV0ZSB0aGlzLl90cmFuc2Zvcm1zW3RyYW5zZm9ybUlkXTtcclxuICAgIGRlbGV0ZSB0aGlzLl90cmFuc2Zvcm1JbnZlcnNlc1t0cmFuc2Zvcm1JZF07XHJcbiAgfVxyXG5cclxuICBwcm90ZWN0ZWQgX2xvZ0NsZWFyZWQoKTogdm9pZCB7XHJcbiAgICB0aGlzLl90cmFuc2Zvcm1zID0ge307XHJcbiAgICB0aGlzLl90cmFuc2Zvcm1JbnZlcnNlcyA9IHt9O1xyXG4gIH1cclxuXHJcbiAgcHJvdGVjdGVkIF9sb2dUcnVuY2F0ZWQodHJhbnNmb3JtSWQ6IHN0cmluZywgcmVsYXRpdmVQb3NpdGlvbjogbnVtYmVyLCByZW1vdmVkOiBzdHJpbmdbXSk6IHZvaWQge1xyXG4gICAgcmVtb3ZlZC5mb3JFYWNoKGlkID0+IHRoaXMuX2NsZWFyVHJhbnNmb3JtRnJvbUhpc3RvcnkoaWQpKTtcclxuICB9XHJcblxyXG4gIHByb3RlY3RlZCBfbG9nUm9sbGVkYmFjayh0cmFuc2Zvcm1JZDogc3RyaW5nLCByZWxhdGl2ZVBvc2l0aW9uOiBudW1iZXIsIHJlbW92ZWQ6IHN0cmluZ1tdKTogdm9pZCB7XHJcbiAgICByZW1vdmVkLnJldmVyc2UoKS5mb3JFYWNoKGlkID0+IHtcclxuICAgICAgY29uc3QgaW52ZXJzZU9wZXJhdGlvbnMgPSB0aGlzLl90cmFuc2Zvcm1JbnZlcnNlc1tpZF07XHJcbiAgICAgIGlmIChpbnZlcnNlT3BlcmF0aW9ucykge1xyXG4gICAgICAgIHRoaXMuY2FjaGUucGF0Y2goaW52ZXJzZU9wZXJhdGlvbnMpO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuX2NsZWFyVHJhbnNmb3JtRnJvbUhpc3RvcnkoaWQpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==