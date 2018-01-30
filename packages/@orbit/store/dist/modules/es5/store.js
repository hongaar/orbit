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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzcmMvc3RvcmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHFCQWFxQjtBQUVyQixzQkFBNEM7QUFDNUMsc0JBQWdFO0FBZ0JoRTtBQUFtQyxxQkFBTTtBQWdCdkMsbUJBQVksQUFBNEI7QUFBNUIsaUNBQUE7QUFBQSx1QkFBNEI7O0FBQXhDLG9CQTRCQztBQTNCQyxnQkFBTSxPQUFDLEFBQStFLGlGQUFFLENBQUMsQ0FBQyxBQUFRLFNBQUMsQUFBTSxBQUFDLEFBQUM7QUFFM0csWUFBSSxBQUFNLFNBQVcsQUFBUSxTQUFDLEFBQU0sQUFBQztBQUNyQyxZQUFJLEFBQU0sU0FBVyxBQUFRLFNBQUMsQUFBTSxBQUFDO0FBRXJDLEFBQVEsaUJBQUMsQUFBSSxPQUFHLEFBQVEsU0FBQyxBQUFJLFFBQUksQUFBTyxBQUFDO0FBRXpDLGdCQUFBLGtCQUFNLEFBQVEsQUFBQyxhQUFDO0FBRWhCLEFBQUksY0FBQyxBQUFXLGNBQUcsQUFBRSxBQUFDO0FBQ3RCLEFBQUksY0FBQyxBQUFrQixxQkFBRyxBQUFFLEFBQUM7QUFFN0IsQUFBSSxjQUFDLEFBQVksYUFBQyxBQUFFLEdBQUMsQUFBTyxTQUFjLEFBQUksTUFBQyxBQUFXLGFBQUUsQUFBSSxBQUFDLEFBQUM7QUFDbEUsQUFBSSxjQUFDLEFBQVksYUFBQyxBQUFFLEdBQUMsQUFBVSxZQUFjLEFBQUksTUFBQyxBQUFhLGVBQUUsQUFBSSxBQUFDLEFBQUM7QUFDdkUsQUFBSSxjQUFDLEFBQVksYUFBQyxBQUFFLEdBQUMsQUFBVSxZQUFjLEFBQUksTUFBQyxBQUFjLGdCQUFFLEFBQUksQUFBQyxBQUFDO0FBRXhFLFlBQUksQUFBYSxnQkFBa0IsQUFBUSxTQUFDLEFBQWEsaUJBQUksQUFBRSxBQUFDO0FBQ2hFLEFBQWEsc0JBQUMsQUFBTSxTQUFHLEFBQU0sQUFBQztBQUM5QixBQUFhLHNC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QjtBQUFELFdBQUM7O0FBek9ELEFBeU9DLEVBek9rQyxPQUFNLEFBeU94QztrQkF6T29CLEFBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgT3JiaXQsIHtcclxuICBLZXlNYXAsXHJcbiAgUmVjb3JkT3BlcmF0aW9uLFxyXG4gIFNjaGVtYSxcclxuICBTb3VyY2UsIFNvdXJjZVNldHRpbmdzLFxyXG4gIFN5bmNhYmxlLCBzeW5jYWJsZSxcclxuICBRdWVyeSwgUXVlcnlPckV4cHJlc3Npb24sXHJcbiAgUXVlcnlhYmxlLCBxdWVyeWFibGUsXHJcbiAgVXBkYXRhYmxlLCB1cGRhdGFibGUsXHJcbiAgVHJhbnNmb3JtLFxyXG4gIFRyYW5zZm9ybU9yT3BlcmF0aW9ucyxcclxuICBjb2FsZXNjZVJlY29yZE9wZXJhdGlvbnMsXHJcbiAgYnVpbGRUcmFuc2Zvcm1cclxufSBmcm9tICdAb3JiaXQvZGF0YSc7XHJcbmltcG9ydCB7IExvZyB9IGZyb20gJ0BvcmJpdC9jb3JlJztcclxuaW1wb3J0IHsgYXNzZXJ0LCBEaWN0IH0gZnJvbSAnQG9yYml0L3V0aWxzJztcclxuaW1wb3J0IENhY2hlLCB7IENhY2hlU2V0dGluZ3MsIFBhdGNoUmVzdWx0RGF0YSB9IGZyb20gJy4vY2FjaGUnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBTdG9yZVNldHRpbmdzIGV4dGVuZHMgU291cmNlU2V0dGluZ3Mge1xyXG4gIGJhc2U/OiBTdG9yZTtcclxuICBjYWNoZVNldHRpbmdzPzogQ2FjaGVTZXR0aW5ncztcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBTdG9yZU1lcmdlT3B0aW9ucyB7XHJcbiAgY29hbGVzY2U/OiBib29sZWFuO1xyXG4gIHNpbmNlVHJhbnNmb3JtSWQ/OiBzdHJpbmc7XHJcbiAgdHJhbnNmb3JtT3B0aW9ucz86IG9iamVjdDtcclxufVxyXG5cclxuQHN5bmNhYmxlXHJcbkBxdWVyeWFibGVcclxuQHVwZGF0YWJsZVxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdG9yZSBleHRlbmRzIFNvdXJjZSBpbXBsZW1lbnRzIFN5bmNhYmxlLCBRdWVyeWFibGUsIFVwZGF0YWJsZSB7XHJcbiAgcHJpdmF0ZSBfY2FjaGU6IENhY2hlO1xyXG4gIHByaXZhdGUgX2Jhc2U6IFN0b3JlO1xyXG4gIHByaXZhdGUgX2ZvcmtQb2ludDogc3RyaW5nO1xyXG4gIHByaXZhdGUgX3RyYW5zZm9ybXM6IERpY3Q8VHJhbnNmb3JtPjtcclxuICBwcml2YXRlIF90cmFuc2Zvcm1JbnZlcnNlczogRGljdDxSZWNvcmRPcGVyYXRpb25bXT47XHJcblxyXG4gIC8vIFN5bmNhYmxlIGludGVyZmFjZSBzdHVic1xyXG4gIHN5bmM6ICh0cmFuc2Zvcm1PclRyYW5zZm9ybXM6IFRyYW5zZm9ybSB8IFRyYW5zZm9ybVtdKSA9PiBQcm9taXNlPHZvaWQ+O1xyXG5cclxuICAvLyBRdWVyeWFibGUgaW50ZXJmYWNlIHN0dWJzXHJcbiAgcXVlcnk6IChxdWVyeU9yRXhwcmVzc2lvbjogUXVlcnlPckV4cHJlc3Npb24sIG9wdGlvbnM/OiBvYmplY3QsIGlkPzogc3RyaW5nKSA9PiBQcm9taXNlPGFueT47XHJcblxyXG4gIC8vIFVwZGF0YWJsZSBpbnRlcmZhY2Ugc3R1YnNcclxuICB1cGRhdGU6ICh0cmFuc2Zvcm1Pck9wZXJhdGlvbnM6IFRyYW5zZm9ybU9yT3BlcmF0aW9ucywgb3B0aW9ucz86IG9iamVjdCwgaWQ/OiBzdHJpbmcpID0+IFByb21pc2U8YW55PjtcclxuXHJcbiAgY29uc3RydWN0b3Ioc2V0dGluZ3M6IFN0b3JlU2V0dGluZ3MgPSB7fSkge1xyXG4gICAgYXNzZXJ0KCdTdG9yZVxcJ3MgYHNjaGVtYWAgbXVzdCBiZSBzcGVjaWZpZWQgaW4gYHNldHRpbmdzLnNjaGVtYWAgY29uc3RydWN0b3IgYXJndW1lbnQnLCAhIXNldHRpbmdzLnNjaGVtYSk7XHJcblxyXG4gICAgbGV0IGtleU1hcDogS2V5TWFwID0gc2V0dGluZ3Mua2V5TWFwO1xyXG4gICAgbGV0IHNjaGVtYTogU2NoZW1hID0gc2V0dGluZ3Muc2NoZW1hO1xyXG5cclxuICAgIHNldHRpbmdzLm5hbWUgPSBzZXR0aW5ncy5uYW1lIHx8ICdzdG9yZSc7XHJcblxyXG4gICAgc3VwZXIoc2V0dGluZ3MpO1xyXG5cclxuICAgIHRoaXMuX3RyYW5zZm9ybXMgPSB7fTtcclxuICAgIHRoaXMuX3RyYW5zZm9ybUludmVyc2VzID0ge307XHJcblxyXG4gICAgdGhpcy50cmFuc2Zvcm1Mb2cub24oJ2NsZWFyJywgPCgpID0+IHZvaWQ+dGhpcy5fbG9nQ2xlYXJlZCwgdGhpcyk7XHJcbiAgICB0aGlzLnRyYW5zZm9ybUxvZy5vbigndHJ1bmNhdGUnLCA8KCkgPT4gdm9pZD50aGlzLl9sb2dUcnVuY2F0ZWQsIHRoaXMpO1xyXG4gICAgdGhpcy50cmFuc2Zvcm1Mb2cub24oJ3JvbGxiYWNrJywgPCgpID0+IHZvaWQ+dGhpcy5fbG9nUm9sbGVkYmFjaywgdGhpcyk7XHJcblxyXG4gICAgbGV0IGNhY2hlU2V0dGluZ3M6IENhY2hlU2V0dGluZ3MgPSBzZXR0aW5ncy5jYWNoZVNldHRpbmdzIHx8IHt9O1xyXG4gICAgY2FjaGVTZXR0aW5ncy5zY2hlbWEgPSBzY2hlbWE7XHJcbiAgICBjYWNoZVNldHRpbmdzLmtleU1hcCA9IGtleU1hcDtcclxuICAgIGNhY2hlU2V0dGluZ3MucXVlcnlCdWlsZGVyID0gY2FjaGVTZXR0aW5ncy5xdWVyeUJ1aWxkZXIgfHwgdGhpcy5xdWVyeUJ1aWxkZXI7XHJcbiAgICBjYWNoZVNldHRpbmdzLnRyYW5zZm9ybUJ1aWxkZXIgPSBjYWNoZVNldHRpbmdzLnRyYW5zZm9ybUJ1aWxkZXIgfHwgdGhpcy50cmFuc2Zvcm1CdWlsZGVyO1xyXG4gICAgaWYgKHNldHRpbmdzLmJhc2UpIHtcclxuICAgICAgdGhpcy5fYmFzZSA9IHNldHRpbmdzLmJhc2U7XHJcbiAgICAgIHRoaXMuX2ZvcmtQb2ludCA9IHRoaXMuX2Jhc2UudHJhbnNmb3JtTG9nLmhlYWQ7XHJcbiAgICAgIGNhY2hlU2V0dGluZ3MuYmFzZSA9IHRoaXMuX2Jhc2UuY2FjaGU7XHJcbiAgICB9XHJcbiAgICB0aGlzLl9jYWNoZSA9IG5ldyBDYWNoZShjYWNoZVNldHRpbmdzKTtcclxuICB9XHJcblxyXG4gIGdldCBjYWNoZSgpOiBDYWNoZSB7XHJcbiAgICByZXR1cm4gdGhpcy5fY2FjaGU7XHJcbiAgfVxyXG5cclxuICBnZXQgYmFzZSgpOiBTdG9yZSB7XHJcbiAgICByZXR1cm4gdGhpcy5fYmFzZTtcclxuICB9XHJcblxyXG4gIGdldCBmb3JrUG9pbnQoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLl9mb3JrUG9pbnQ7XHJcbiAgfVxyXG5cclxuICB1cGdyYWRlKCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgdGhpcy5fY2FjaGUudXBncmFkZSgpO1xyXG4gICAgcmV0dXJuIE9yYml0LlByb21pc2UucmVzb2x2ZSgpO1xyXG4gIH1cclxuXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAvLyBTeW5jYWJsZSBpbnRlcmZhY2UgaW1wbGVtZW50YXRpb25cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICBfc3luYyh0cmFuc2Zvcm06IFRyYW5zZm9ybSk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgdGhpcy5fYXBwbHlUcmFuc2Zvcm0odHJhbnNmb3JtKTtcclxuICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKTtcclxuICB9XHJcblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgLy8gVXBkYXRhYmxlIGludGVyZmFjZSBpbXBsZW1lbnRhdGlvblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIF91cGRhdGUodHJhbnNmb3JtOiBUcmFuc2Zvcm0pOiBQcm9taXNlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdHMgPSB0aGlzLl9hcHBseVRyYW5zZm9ybSh0cmFuc2Zvcm0pO1xyXG4gICAgcmV0dXJuIE9yYml0LlByb21pc2UucmVzb2x2ZShyZXN1bHRzLmxlbmd0aCA9PT0gMSA/IHJlc3VsdHNbMF0gOiByZXN1bHRzKTtcclxuICB9XHJcblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgLy8gUXVlcnlhYmxlIGludGVyZmFjZSBpbXBsZW1lbnRhdGlvblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIF9xdWVyeShxdWVyeTogUXVlcnlPckV4cHJlc3Npb24pIHtcclxuICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUodGhpcy5fY2FjaGUucXVlcnkocXVlcnkpKTtcclxuICB9XHJcblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgLy8gUHVibGljIG1ldGhvZHNcclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAvKipcclxuICAgQ3JlYXRlIGEgY2xvbmUsIG9yIFwiZm9ya1wiLCBmcm9tIGEgXCJiYXNlXCIgc3RvcmUuXHJcblxyXG4gICBUaGUgZm9ya2VkIHN0b3JlIHdpbGwgaGF2ZSB0aGUgc2FtZSBgc2NoZW1hYCBhbmQgYGtleU1hcGAgYXMgaXRzIGJhc2Ugc3RvcmUuXHJcbiAgIFRoZSBmb3JrZWQgc3RvcmUncyBjYWNoZSB3aWxsIHN0YXJ0IHdpdGggdGhlIHNhbWUgaW1tdXRhYmxlIGRvY3VtZW50IGFzXHJcbiAgIHRoZSBiYXNlIHN0b3JlLiBJdHMgY29udGVudHMgYW5kIGxvZyB3aWxsIGV2b2x2ZSBpbmRlcGVuZGVudGx5LlxyXG5cclxuICAgQG1ldGhvZCBmb3JrXHJcbiAgIEByZXR1cm5zIHtTdG9yZX0gVGhlIGZvcmtlZCBzdG9yZS5cclxuICAqL1xyXG4gIGZvcmsoc2V0dGluZ3M6IFN0b3JlU2V0dGluZ3MgPSB7fSkge1xyXG4gICAgc2V0dGluZ3Muc2NoZW1hID0gdGhpcy5fc2NoZW1hO1xyXG4gICAgc2V0dGluZ3MuY2FjaGVTZXR0aW5ncyA9IHNldHRpbmdzLmNhY2hlU2V0dGluZ3MgfHwge307XHJcbiAgICBzZXR0aW5ncy5rZXlNYXAgPSB0aGlzLl9rZXlNYXA7XHJcbiAgICBzZXR0aW5ncy5xdWVyeUJ1aWxkZXIgPSB0aGlzLnF1ZXJ5QnVpbGRlcjtcclxuICAgIHNldHRpbmdzLnRyYW5zZm9ybUJ1aWxkZXIgPSB0aGlzLnRyYW5zZm9ybUJ1aWxkZXI7XHJcbiAgICBzZXR0aW5ncy5iYXNlID0gdGhpcztcclxuXHJcbiAgICByZXR1cm4gbmV3IFN0b3JlKHNldHRpbmdzKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICBNZXJnZSB0cmFuc2Zvcm1zIGZyb20gYSBmb3JrZWQgc3RvcmUgYmFjayBpbnRvIGEgYmFzZSBzdG9yZS5cclxuXHJcbiAgIEJ5IGRlZmF1bHQsIGFsbCBvZiB0aGUgb3BlcmF0aW9ucyBmcm9tIGFsbCBvZiB0aGUgdHJhbnNmb3JtcyBpbiB0aGUgZm9ya2VkXHJcbiAgIHN0b3JlJ3MgaGlzdG9yeSB3aWxsIGJlIHJlZHVjZWQgaW50byBhIHNpbmdsZSB0cmFuc2Zvcm0uIEEgc3Vic2V0IG9mXHJcbiAgIG9wZXJhdGlvbnMgY2FuIGJlIHNlbGVjdGVkIGJ5IHNwZWNpZnlpbmcgdGhlIGBzaW5jZVRyYW5zZm9ybUlkYCBvcHRpb24uXHJcblxyXG4gICBUaGUgYGNvYWxlc2NlYCBvcHRpb24gY29udHJvbHMgd2hldGhlciBvcGVyYXRpb25zIGFyZSBjb2FsZXNjZWQgaW50byBhXHJcbiAgIG1pbmltYWwgZXF1aXZhbGVudCBzZXQgYmVmb3JlIGJlaW5nIHJlZHVjZWQgaW50byBhIHRyYW5zZm9ybS5cclxuXHJcbiAgIEBtZXRob2QgbWVyZ2VcclxuICAgQHBhcmFtIHtTdG9yZX0gZm9ya2VkU3RvcmUgLSBUaGUgc3RvcmUgdG8gbWVyZ2UuXHJcbiAgIEBwYXJhbSB7T2JqZWN0fSAgW29wdGlvbnNdIHNldHRpbmdzXHJcbiAgIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuY29hbGVzY2UgPSB0cnVlXSBTaG91bGQgb3BlcmF0aW9ucyBiZSBjb2FsZXNjZWQgaW50byBhIG1pbmltYWwgZXF1aXZhbGVudCBzZXQ/XHJcbiAgIEBwYXJhbSB7U3RyaW5nfSAgW29wdGlvbnMuc2luY2VUcmFuc2Zvcm1JZCA9IG51bGxdIFNlbGVjdCBvbmx5IHRyYW5zZm9ybXMgc2luY2UgdGhlIHNwZWNpZmllZCBJRC5cclxuICAgQHJldHVybnMge1Byb21pc2V9IFRoZSByZXN1bHQgb2YgY2FsbGluZyBgdXBkYXRlKClgIHdpdGggdGhlIGZvcmtlZCB0cmFuc2Zvcm1zLlxyXG4gICovXHJcbiAgbWVyZ2UoZm9ya2VkU3RvcmU6IFN0b3JlLCBvcHRpb25zOiBTdG9yZU1lcmdlT3B0aW9ucyA9IHt9KTogUHJvbWlzZTxhbnk+IHtcclxuICAgIGxldCB0cmFuc2Zvcm1zOiBUcmFuc2Zvcm1bXTtcclxuICAgIGlmIChvcHRpb25zLnNpbmNlVHJhbnNmb3JtSWQpIHtcclxuICAgICAgdHJhbnNmb3JtcyA9IGZvcmtlZFN0b3JlLnRyYW5zZm9ybXNTaW5jZShvcHRpb25zLnNpbmNlVHJhbnNmb3JtSWQpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdHJhbnNmb3JtcyA9IGZvcmtlZFN0b3JlLmFsbFRyYW5zZm9ybXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgcmVkdWNlZFRyYW5zZm9ybTtcclxuICAgIGxldCBvcHM6IFJlY29yZE9wZXJhdGlvbltdID0gW107XHJcbiAgICB0cmFuc2Zvcm1zLmZvckVhY2godCA9PiB7XHJcbiAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KG9wcywgdC5vcGVyYXRpb25zKTtcclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICBpZiAob3B0aW9ucy5jb2FsZXNjZSAhPT0gZmFsc2UpIHtcclxuICAgICAgb3BzID0gY29hbGVzY2VSZWNvcmRPcGVyYXRpb25zKG9wcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVkdWNlZFRyYW5zZm9ybSA9IGJ1aWxkVHJhbnNmb3JtKG9wcywgb3B0aW9ucy50cmFuc2Zvcm1PcHRpb25zKTtcclxuXHJcbiAgICByZXR1cm4gdGhpcy51cGRhdGUocmVkdWNlZFRyYW5zZm9ybSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgUm9sbHMgYmFjayB0aGUgU3RvcmUgdG8gYSBwYXJ0aWN1bGFyIHRyYW5zZm9ybUlkXHJcblxyXG4gICBAbWV0aG9kIHJvbGxiYWNrXHJcbiAgIEBwYXJhbSB7c3RyaW5nfSB0cmFuc2Zvcm1JZCAtIFRoZSBJRCBvZiB0aGUgdHJhbnNmb3JtIHRvIHJvbGwgYmFjayB0b1xyXG4gICBAcGFyYW0ge251bWJlcn0gcmVsYXRpdmVQb3NpdGlvbiAtIEEgcG9zaXRpdmUgb3IgbmVnYXRpdmUgaW50ZWdlciB0byBzcGVjaWZ5IGEgcG9zaXRpb24gcmVsYXRpdmUgdG8gYHRyYW5zZm9ybUlkYFxyXG4gICBAcmV0dXJucyB7dW5kZWZpbmVkfVxyXG4gICovXHJcbiAgcm9sbGJhY2sodHJhbnNmb3JtSWQ6IHN0cmluZywgcmVsYXRpdmVQb3NpdGlvbjogbnVtYmVyID0gMCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtTG9nLnJvbGxiYWNrKHRyYW5zZm9ybUlkLCByZWxhdGl2ZVBvc2l0aW9uKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICBSZXR1cm5zIGFsbCB0cmFuc2Zvcm1zIHNpbmNlIGEgcGFydGljdWxhciBgdHJhbnNmb3JtSWRgLlxyXG5cclxuICAgQG1ldGhvZCB0cmFuc2Zvcm1zU2luY2VcclxuICAgQHBhcmFtIHtzdHJpbmd9IHRyYW5zZm9ybUlkIC0gVGhlIElEIG9mIHRoZSB0cmFuc2Zvcm0gdG8gc3RhcnQgd2l0aC5cclxuICAgQHJldHVybnMge0FycmF5fSBBcnJheSBvZiB0cmFuc2Zvcm1zLlxyXG4gICovXHJcbiAgdHJhbnNmb3Jtc1NpbmNlKHRyYW5zZm9ybUlkOiBzdHJpbmcpOiBUcmFuc2Zvcm1bXSB7XHJcbiAgICByZXR1cm4gdGhpcy50cmFuc2Zvcm1Mb2dcclxuICAgICAgLmFmdGVyKHRyYW5zZm9ybUlkKVxyXG4gICAgICAubWFwKGlkID0+IHRoaXMuX3RyYW5zZm9ybXNbaWRdKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICBSZXR1cm5zIGFsbCB0cmFja2VkIHRyYW5zZm9ybXMuXHJcblxyXG4gICBAbWV0aG9kIGFsbFRyYW5zZm9ybXNcclxuICAgQHJldHVybnMge0FycmF5fSBBcnJheSBvZiB0cmFuc2Zvcm1zLlxyXG4gICovXHJcbiAgYWxsVHJhbnNmb3JtcygpOiBUcmFuc2Zvcm1bXSB7XHJcbiAgICByZXR1cm4gdGhpcy50cmFuc2Zvcm1Mb2cuZW50cmllc1xyXG4gICAgICAubWFwKGlkID0+IHRoaXMuX3RyYW5zZm9ybXNbaWRdKTtcclxuICB9XHJcblxyXG4gIGdldFRyYW5zZm9ybSh0cmFuc2Zvcm1JZDogc3RyaW5nKTogVHJhbnNmb3JtIHtcclxuICAgIHJldHVybiB0aGlzLl90cmFuc2Zvcm1zW3RyYW5zZm9ybUlkXTtcclxuICB9XHJcblxyXG4gIGdldEludmVyc2VPcGVyYXRpb25zKHRyYW5zZm9ybUlkOiBzdHJpbmcpOiBSZWNvcmRPcGVyYXRpb25bXSB7XHJcbiAgICByZXR1cm4gdGhpcy5fdHJhbnNmb3JtSW52ZXJzZXNbdHJhbnNmb3JtSWRdO1xyXG4gIH1cclxuXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAvLyBQcm90ZWN0ZWQgbWV0aG9kc1xyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIHByb3RlY3RlZCBfYXBwbHlUcmFuc2Zvcm0odHJhbnNmb3JtOiBUcmFuc2Zvcm0pOiBQYXRjaFJlc3VsdERhdGFbXSB7XHJcbiAgICBjb25zdCByZXN1bHQgPSB0aGlzLmNhY2hlLnBhdGNoKDxSZWNvcmRPcGVyYXRpb25bXT50cmFuc2Zvcm0ub3BlcmF0aW9ucyk7XHJcbiAgICB0aGlzLl90cmFuc2Zvcm1zW3RyYW5zZm9ybS5pZF0gPSB0cmFuc2Zvcm07XHJcbiAgICB0aGlzLl90cmFuc2Zvcm1JbnZlcnNlc1t0cmFuc2Zvcm0uaWRdID0gcmVzdWx0LmludmVyc2U7XHJcbiAgICByZXR1cm4gcmVzdWx0LmRhdGE7XHJcbiAgfVxyXG5cclxuICBwcm90ZWN0ZWQgX2NsZWFyVHJhbnNmb3JtRnJvbUhpc3RvcnkodHJhbnNmb3JtSWQ6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgZGVsZXRlIHRoaXMuX3RyYW5zZm9ybXNbdHJhbnNmb3JtSWRdO1xyXG4gICAgZGVsZXRlIHRoaXMuX3RyYW5zZm9ybUludmVyc2VzW3RyYW5zZm9ybUlkXTtcclxuICB9XHJcblxyXG4gIHByb3RlY3RlZCBfbG9nQ2xlYXJlZCgpOiB2b2lkIHtcclxuICAgIHRoaXMuX3RyYW5zZm9ybXMgPSB7fTtcclxuICAgIHRoaXMuX3RyYW5zZm9ybUludmVyc2VzID0ge307XHJcbiAgfVxyXG5cclxuICBwcm90ZWN0ZWQgX2xvZ1RydW5jYXRlZCh0cmFuc2Zvcm1JZDogc3RyaW5nLCByZWxhdGl2ZVBvc2l0aW9uOiBudW1iZXIsIHJlbW92ZWQ6IHN0cmluZ1tdKTogdm9pZCB7XHJcbiAgICByZW1vdmVkLmZvckVhY2goaWQgPT4gdGhpcy5fY2xlYXJUcmFuc2Zvcm1Gcm9tSGlzdG9yeShpZCkpO1xyXG4gIH1cclxuXHJcbiAgcHJvdGVjdGVkIF9sb2dSb2xsZWRiYWNrKHRyYW5zZm9ybUlkOiBzdHJpbmcsIHJlbGF0aXZlUG9zaXRpb246IG51bWJlciwgcmVtb3ZlZDogc3RyaW5nW10pOiB2b2lkIHtcclxuICAgIHJlbW92ZWQucmV2ZXJzZSgpLmZvckVhY2goaWQgPT4ge1xyXG4gICAgICBjb25zdCBpbnZlcnNlT3BlcmF0aW9ucyA9IHRoaXMuX3RyYW5zZm9ybUludmVyc2VzW2lkXTtcclxuICAgICAgaWYgKGludmVyc2VPcGVyYXRpb25zKSB7XHJcbiAgICAgICAgdGhpcy5jYWNoZS5wYXRjaChpbnZlcnNlT3BlcmF0aW9ucyk7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5fY2xlYXJUcmFuc2Zvcm1Gcm9tSGlzdG9yeShpZCk7XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuIl19