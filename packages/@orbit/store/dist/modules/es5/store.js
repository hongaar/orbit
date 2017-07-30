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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzcmMvc3RvcmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHFCQWFxQjtBQUVyQixzQkFBNEM7QUFDNUMsc0JBQWdFO0FBZWhFO0FBQW1DLHFCQUFNO0FBY3ZDLG1CQUFZLEFBQTRCO0FBQTVCLGlDQUFBO0FBQUEsdUJBQTRCOztBQUF4QyxvQkF1QkM7QUF0QkMsZ0JBQU0sT0FBQyxBQUErRSxpRkFBRSxDQUFDLENBQUMsQUFBUSxTQUFDLEFBQU0sQUFBQyxBQUFDO0FBRTNHLFlBQUksQUFBTSxTQUFXLEFBQVEsU0FBQyxBQUFNLEFBQUM7QUFDckMsWUFBSSxBQUFNLFNBQVcsQUFBUSxTQUFDLEFBQU0sQUFBQztBQUVyQyxBQUFRLGlCQUFDLEFBQUksT0FBRyxBQUFRLFNBQUMsQUFBSSxRQUFJLEFBQU8sQUFBQztBQUV6QyxnQkFBQSxrQkFBTSxBQUFRLEFBQUMsYUFBQztBQUVoQixBQUFJLGNBQUMsQUFBVyxjQUFHLEFBQUUsQUFBQztBQUN0QixBQUFJLGNBQUMsQUFBa0IscUJBQUcsQUFBRSxBQUFDO0FBRTdCLEFBQUksY0FBQyxBQUFZLGFBQUMsQUFBRSxHQUFDLEFBQU8sU0FBYyxBQUFJLE1BQUMsQUFBVyxhQUFFLEFBQUksQUFBQyxBQUFDO0FBQ2xFLEFBQUksY0FBQyxBQUFZLGFBQUMsQUFBRSxHQUFDLEFBQVUsWUFBYyxBQUFJLE1BQUMsQUFBYSxlQUFFLEFBQUksQUFBQyxBQUFDO0FBQ3ZFLEFBQUksY0FBQyxBQUFZLGFBQUMsQUFBRSxHQUFDLEFBQVUsWUFBYyxBQUFJLE1BQUMsQUFBYyxnQkFBRSxBQUFJLEFBQUMsQUFBQztBQUV4RSxZQUFJLEFBQWEsZ0JBQWtCLEFBQVEsU0FBQyxBQUFhLGlCQUFJLEFBQUUsQUFBQztBQUNoRSxBQUFhLHNCQUFDLEFBQU0sU0FBRyxBQUFNLEFBQUM7QUFDOUIsQUFBYSxzQkFB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LG9CQUFjLGlCQUF4QixVQUF5QixBQUFtQixhQUFFLEFBQXdCLGtCQUFFLEFBQWlCO0FBQXpGLG9CQVFDO0FBUEMsQUFBTyxnQkFBQyxBQUFPLEFBQUUsVUFBQyxBQUFPLFFBQUMsVUFBQSxBQUFFO0FBQzFCLGdCQUFNLEFBQWlCLG9CQUFHLEFBQUksTUFBQyxBQUFrQixtQkFBQyxBQUFFLEFBQUMsQUFBQztBQUN0RCxBQUFFLEFBQUMsZ0JBQUMsQUFBaUIsQUFBQyxtQkFBQyxBQUFDO0FBQ3RCLEFBQUksc0JBQUMsQUFBSyxNQUFDLEFBQUssTUFBQyxBQUFpQixBQUFDLEFBQUMsQUFDdEM7QUFBQztBQUNELEFBQUksa0JBQUMsQUFBMEIsMkJBQUMsQUFBRSxBQUFDLEFBQUMsQUFDdEM7QUFBQyxBQUFDLEFBQUMsQUFDTDtBQUFDO0FBcE5rQixBQUFLLGtDQUh6QixPQUFRLFVBQ1IsT0FBUyxXQUNULE9BQVMsWUFDVyxBQUFLLEFBcU56QjtBQUFELFdBQUM7O0FBck5ELEFBcU5DLEVBck5rQyxPQUFNLEFBcU54QztrQkFyTm9CLEFBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgT3JiaXQsIHtcclxuICBLZXlNYXAsXHJcbiAgUmVjb3JkT3BlcmF0aW9uLFxyXG4gIFNjaGVtYSxcclxuICBTb3VyY2UsIFNvdXJjZVNldHRpbmdzLFxyXG4gIFN5bmNhYmxlLCBzeW5jYWJsZSxcclxuICBRdWVyeSwgUXVlcnlPckV4cHJlc3Npb24sXHJcbiAgUXVlcnlhYmxlLCBxdWVyeWFibGUsXHJcbiAgVXBkYXRhYmxlLCB1cGRhdGFibGUsXHJcbiAgVHJhbnNmb3JtLFxyXG4gIFRyYW5zZm9ybU9yT3BlcmF0aW9ucyxcclxuICBjb2FsZXNjZVJlY29yZE9wZXJhdGlvbnMsXHJcbiAgYnVpbGRUcmFuc2Zvcm1cclxufSBmcm9tICdAb3JiaXQvZGF0YSc7XHJcbmltcG9ydCB7IExvZyB9IGZyb20gJ0BvcmJpdC9jb3JlJztcclxuaW1wb3J0IHsgYXNzZXJ0LCBEaWN0IH0gZnJvbSAnQG9yYml0L3V0aWxzJztcclxuaW1wb3J0IENhY2hlLCB7IENhY2hlU2V0dGluZ3MsIFBhdGNoUmVzdWx0RGF0YSB9IGZyb20gJy4vY2FjaGUnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBTdG9yZVNldHRpbmdzIGV4dGVuZHMgU291cmNlU2V0dGluZ3Mge1xyXG4gIGNhY2hlU2V0dGluZ3M/OiBDYWNoZVNldHRpbmdzXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgU3RvcmVNZXJnZU9wdGlvbnMge1xyXG4gIGNvYWxlc2NlPzogYm9vbGVhbjtcclxuICBzaW5jZVRyYW5zZm9ybUlkPzogc3RyaW5nO1xyXG4gIHRyYW5zZm9ybU9wdGlvbnM/OiBvYmplY3Q7XHJcbn1cclxuXHJcbkBzeW5jYWJsZVxyXG5AcXVlcnlhYmxlXHJcbkB1cGRhdGFibGVcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RvcmUgZXh0ZW5kcyBTb3VyY2UgaW1wbGVtZW50cyBTeW5jYWJsZSwgUXVlcnlhYmxlLCBVcGRhdGFibGUge1xyXG4gIHByaXZhdGUgX2NhY2hlOiBDYWNoZTtcclxuICBwcml2YXRlIF90cmFuc2Zvcm1zOiBEaWN0PFRyYW5zZm9ybT47XHJcbiAgcHJpdmF0ZSBfdHJhbnNmb3JtSW52ZXJzZXM6IERpY3Q8UmVjb3JkT3BlcmF0aW9uW10+O1xyXG5cclxuICAvLyBTeW5jYWJsZSBpbnRlcmZhY2Ugc3R1YnNcclxuICBzeW5jOiAodHJhbnNmb3JtT3JUcmFuc2Zvcm1zOiBUcmFuc2Zvcm0gfCBUcmFuc2Zvcm1bXSkgPT4gUHJvbWlzZTx2b2lkPjtcclxuXHJcbiAgLy8gUXVlcnlhYmxlIGludGVyZmFjZSBzdHVic1xyXG4gIHF1ZXJ5OiAocXVlcnlPckV4cHJlc3Npb246IFF1ZXJ5T3JFeHByZXNzaW9uLCBvcHRpb25zPzogb2JqZWN0LCBpZD86IHN0cmluZykgPT4gUHJvbWlzZTxhbnk+O1xyXG5cclxuICAvLyBVcGRhdGFibGUgaW50ZXJmYWNlIHN0dWJzXHJcbiAgdXBkYXRlOiAodHJhbnNmb3JtT3JPcGVyYXRpb25zOiBUcmFuc2Zvcm1Pck9wZXJhdGlvbnMsIG9wdGlvbnM/OiBvYmplY3QsIGlkPzogc3RyaW5nKSA9PiBQcm9taXNlPGFueT47XHJcblxyXG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzOiBTdG9yZVNldHRpbmdzID0ge30pIHtcclxuICAgIGFzc2VydCgnU3RvcmVcXCdzIGBzY2hlbWFgIG11c3QgYmUgc3BlY2lmaWVkIGluIGBzZXR0aW5ncy5zY2hlbWFgIGNvbnN0cnVjdG9yIGFyZ3VtZW50JywgISFzZXR0aW5ncy5zY2hlbWEpO1xyXG5cclxuICAgIGxldCBrZXlNYXA6IEtleU1hcCA9IHNldHRpbmdzLmtleU1hcDtcclxuICAgIGxldCBzY2hlbWE6IFNjaGVtYSA9IHNldHRpbmdzLnNjaGVtYTtcclxuXHJcbiAgICBzZXR0aW5ncy5uYW1lID0gc2V0dGluZ3MubmFtZSB8fCAnc3RvcmUnO1xyXG5cclxuICAgIHN1cGVyKHNldHRpbmdzKTtcclxuXHJcbiAgICB0aGlzLl90cmFuc2Zvcm1zID0ge307XHJcbiAgICB0aGlzLl90cmFuc2Zvcm1JbnZlcnNlcyA9IHt9O1xyXG5cclxuICAgIHRoaXMudHJhbnNmb3JtTG9nLm9uKCdjbGVhcicsIDwoKSA9PiB2b2lkPnRoaXMuX2xvZ0NsZWFyZWQsIHRoaXMpO1xyXG4gICAgdGhpcy50cmFuc2Zvcm1Mb2cub24oJ3RydW5jYXRlJywgPCgpID0+IHZvaWQ+dGhpcy5fbG9nVHJ1bmNhdGVkLCB0aGlzKTtcclxuICAgIHRoaXMudHJhbnNmb3JtTG9nLm9uKCdyb2xsYmFjaycsIDwoKSA9PiB2b2lkPnRoaXMuX2xvZ1JvbGxlZGJhY2ssIHRoaXMpO1xyXG5cclxuICAgIGxldCBjYWNoZVNldHRpbmdzOiBDYWNoZVNldHRpbmdzID0gc2V0dGluZ3MuY2FjaGVTZXR0aW5ncyB8fCB7fTtcclxuICAgIGNhY2hlU2V0dGluZ3Muc2NoZW1hID0gc2NoZW1hO1xyXG4gICAgY2FjaGVTZXR0aW5ncy5rZXlNYXAgPSBrZXlNYXA7XHJcbiAgICBjYWNoZVNldHRpbmdzLnF1ZXJ5QnVpbGRlciA9IGNhY2hlU2V0dGluZ3MucXVlcnlCdWlsZGVyIHx8IHRoaXMucXVlcnlCdWlsZGVyO1xyXG4gICAgY2FjaGVTZXR0aW5ncy50cmFuc2Zvcm1CdWlsZGVyID0gY2FjaGVTZXR0aW5ncy50cmFuc2Zvcm1CdWlsZGVyIHx8IHRoaXMudHJhbnNmb3JtQnVpbGRlcjtcclxuICAgIHRoaXMuX2NhY2hlID0gbmV3IENhY2hlKGNhY2hlU2V0dGluZ3MpO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGNhY2hlKCk6IENhY2hlIHtcclxuICAgIHJldHVybiB0aGlzLl9jYWNoZTtcclxuICB9XHJcblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgLy8gU3luY2FibGUgaW50ZXJmYWNlIGltcGxlbWVudGF0aW9uXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgX3N5bmModHJhbnNmb3JtOiBUcmFuc2Zvcm0pOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHRoaXMuX2FwcGx5VHJhbnNmb3JtKHRyYW5zZm9ybSk7XHJcbiAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgfVxyXG5cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gIC8vIFVwZGF0YWJsZSBpbnRlcmZhY2UgaW1wbGVtZW50YXRpb25cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICBfdXBkYXRlKHRyYW5zZm9ybTogVHJhbnNmb3JtKTogUHJvbWlzZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHRzID0gdGhpcy5fYXBwbHlUcmFuc2Zvcm0odHJhbnNmb3JtKTtcclxuICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUocmVzdWx0cy5sZW5ndGggPT09IDEgPyByZXN1bHRzWzBdIDogcmVzdWx0cyk7XHJcbiAgfVxyXG5cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gIC8vIFF1ZXJ5YWJsZSBpbnRlcmZhY2UgaW1wbGVtZW50YXRpb25cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICBfcXVlcnkocXVlcnk6IFF1ZXJ5T3JFeHByZXNzaW9uKSB7XHJcbiAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKHRoaXMuX2NhY2hlLnF1ZXJ5KHF1ZXJ5KSk7XHJcbiAgfVxyXG5cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gIC8vIFB1YmxpYyBtZXRob2RzXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgLyoqXHJcbiAgIENyZWF0ZSBhIGNsb25lLCBvciBcImZvcmtcIiwgZnJvbSBhIFwiYmFzZVwiIHN0b3JlLlxyXG5cclxuICAgVGhlIGZvcmtlZCBzdG9yZSB3aWxsIGhhdmUgdGhlIHNhbWUgYHNjaGVtYWAgYW5kIGBrZXlNYXBgIGFzIGl0cyBiYXNlIHN0b3JlLlxyXG4gICBUaGUgZm9ya2VkIHN0b3JlJ3MgY2FjaGUgd2lsbCBzdGFydCB3aXRoIHRoZSBzYW1lIGltbXV0YWJsZSBkb2N1bWVudCBhc1xyXG4gICB0aGUgYmFzZSBzdG9yZS4gSXRzIGNvbnRlbnRzIGFuZCBsb2cgd2lsbCBldm9sdmUgaW5kZXBlbmRlbnRseS5cclxuXHJcbiAgIEBtZXRob2QgZm9ya1xyXG4gICBAcmV0dXJucyB7U3RvcmV9IFRoZSBmb3JrZWQgc3RvcmUuXHJcbiAgKi9cclxuICBmb3JrKHNldHRpbmdzOiBTdG9yZVNldHRpbmdzID0ge30pIHtcclxuICAgIHNldHRpbmdzLnNjaGVtYSA9IHRoaXMuX3NjaGVtYTtcclxuICAgIHNldHRpbmdzLmNhY2hlU2V0dGluZ3MgPSBzZXR0aW5ncy5jYWNoZVNldHRpbmdzIHx8IHt9O1xyXG4gICAgc2V0dGluZ3MuY2FjaGVTZXR0aW5ncy5iYXNlID0gdGhpcy5fY2FjaGU7XHJcbiAgICBzZXR0aW5ncy5rZXlNYXAgPSB0aGlzLl9rZXlNYXA7XHJcbiAgICBzZXR0aW5ncy5xdWVyeUJ1aWxkZXIgPSB0aGlzLnF1ZXJ5QnVpbGRlcjtcclxuICAgIHNldHRpbmdzLnRyYW5zZm9ybUJ1aWxkZXIgPSB0aGlzLnRyYW5zZm9ybUJ1aWxkZXI7XHJcblxyXG4gICAgcmV0dXJuIG5ldyBTdG9yZShzZXR0aW5ncyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgTWVyZ2UgdHJhbnNmb3JtcyBmcm9tIGEgZm9ya2VkIHN0b3JlIGJhY2sgaW50byBhIGJhc2Ugc3RvcmUuXHJcblxyXG4gICBCeSBkZWZhdWx0LCBhbGwgb2YgdGhlIG9wZXJhdGlvbnMgZnJvbSBhbGwgb2YgdGhlIHRyYW5zZm9ybXMgaW4gdGhlIGZvcmtlZFxyXG4gICBzdG9yZSdzIGhpc3Rvcnkgd2lsbCBiZSByZWR1Y2VkIGludG8gYSBzaW5nbGUgdHJhbnNmb3JtLiBBIHN1YnNldCBvZlxyXG4gICBvcGVyYXRpb25zIGNhbiBiZSBzZWxlY3RlZCBieSBzcGVjaWZ5aW5nIHRoZSBgc2luY2VUcmFuc2Zvcm1JZGAgb3B0aW9uLlxyXG5cclxuICAgVGhlIGBjb2FsZXNjZWAgb3B0aW9uIGNvbnRyb2xzIHdoZXRoZXIgb3BlcmF0aW9ucyBhcmUgY29hbGVzY2VkIGludG8gYVxyXG4gICBtaW5pbWFsIGVxdWl2YWxlbnQgc2V0IGJlZm9yZSBiZWluZyByZWR1Y2VkIGludG8gYSB0cmFuc2Zvcm0uXHJcblxyXG4gICBAbWV0aG9kIG1lcmdlXHJcbiAgIEBwYXJhbSB7U3RvcmV9IGZvcmtlZFN0b3JlIC0gVGhlIHN0b3JlIHRvIG1lcmdlLlxyXG4gICBAcGFyYW0ge09iamVjdH0gIFtvcHRpb25zXSBzZXR0aW5nc1xyXG4gICBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmNvYWxlc2NlID0gdHJ1ZV0gU2hvdWxkIG9wZXJhdGlvbnMgYmUgY29hbGVzY2VkIGludG8gYSBtaW5pbWFsIGVxdWl2YWxlbnQgc2V0P1xyXG4gICBAcGFyYW0ge1N0cmluZ30gIFtvcHRpb25zLnNpbmNlVHJhbnNmb3JtSWQgPSBudWxsXSBTZWxlY3Qgb25seSB0cmFuc2Zvcm1zIHNpbmNlIHRoZSBzcGVjaWZpZWQgSUQuXHJcbiAgIEByZXR1cm5zIHtQcm9taXNlfSBUaGUgcmVzdWx0IG9mIGNhbGxpbmcgYHVwZGF0ZSgpYCB3aXRoIHRoZSBmb3JrZWQgdHJhbnNmb3Jtcy5cclxuICAqL1xyXG4gIG1lcmdlKGZvcmtlZFN0b3JlOiBTdG9yZSwgb3B0aW9uczogU3RvcmVNZXJnZU9wdGlvbnMgPSB7fSkge1xyXG4gICAgbGV0IHRyYW5zZm9ybXM6IFRyYW5zZm9ybVtdO1xyXG4gICAgaWYgKG9wdGlvbnMuc2luY2VUcmFuc2Zvcm1JZCkge1xyXG4gICAgICB0cmFuc2Zvcm1zID0gZm9ya2VkU3RvcmUudHJhbnNmb3Jtc1NpbmNlKG9wdGlvbnMuc2luY2VUcmFuc2Zvcm1JZCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0cmFuc2Zvcm1zID0gZm9ya2VkU3RvcmUuYWxsVHJhbnNmb3JtcygpO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCByZWR1Y2VkVHJhbnNmb3JtO1xyXG4gICAgbGV0IG9wczogUmVjb3JkT3BlcmF0aW9uW10gPSBbXTtcclxuICAgIHRyYW5zZm9ybXMuZm9yRWFjaCh0ID0+IHtcclxuICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkob3BzLCB0Lm9wZXJhdGlvbnMpO1xyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIGlmIChvcHRpb25zLmNvYWxlc2NlICE9PSBmYWxzZSkge1xyXG4gICAgICBvcHMgPSBjb2FsZXNjZVJlY29yZE9wZXJhdGlvbnMob3BzKTtcclxuICAgIH1cclxuXHJcbiAgICByZWR1Y2VkVHJhbnNmb3JtID0gYnVpbGRUcmFuc2Zvcm0ob3BzLCBvcHRpb25zLnRyYW5zZm9ybU9wdGlvbnMpO1xyXG5cclxuICAgIHJldHVybiB0aGlzLnVwZGF0ZShyZWR1Y2VkVHJhbnNmb3JtKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICBSb2xscyBiYWNrIHRoZSBTdG9yZSB0byBhIHBhcnRpY3VsYXIgdHJhbnNmb3JtSWRcclxuXHJcbiAgIEBtZXRob2Qgcm9sbGJhY2tcclxuICAgQHBhcmFtIHtzdHJpbmd9IHRyYW5zZm9ybUlkIC0gVGhlIElEIG9mIHRoZSB0cmFuc2Zvcm0gdG8gcm9sbCBiYWNrIHRvXHJcbiAgIEBwYXJhbSB7bnVtYmVyfSByZWxhdGl2ZVBvc2l0aW9uIC0gQSBwb3NpdGl2ZSBvciBuZWdhdGl2ZSBpbnRlZ2VyIHRvIHNwZWNpZnkgYSBwb3NpdGlvbiByZWxhdGl2ZSB0byBgdHJhbnNmb3JtSWRgXHJcbiAgIEByZXR1cm5zIHt1bmRlZmluZWR9XHJcbiAgKi9cclxuICByb2xsYmFjayh0cmFuc2Zvcm1JZDogc3RyaW5nLCByZWxhdGl2ZVBvc2l0aW9uOiBudW1iZXIgPSAwKSB7XHJcbiAgICByZXR1cm4gdGhpcy50cmFuc2Zvcm1Mb2cucm9sbGJhY2sodHJhbnNmb3JtSWQsIHJlbGF0aXZlUG9zaXRpb24pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgIFJldHVybnMgYWxsIHRyYW5zZm9ybXMgc2luY2UgYSBwYXJ0aWN1bGFyIGB0cmFuc2Zvcm1JZGAuXHJcblxyXG4gICBAbWV0aG9kIHRyYW5zZm9ybXNTaW5jZVxyXG4gICBAcGFyYW0ge3N0cmluZ30gdHJhbnNmb3JtSWQgLSBUaGUgSUQgb2YgdGhlIHRyYW5zZm9ybSB0byBzdGFydCB3aXRoLlxyXG4gICBAcmV0dXJucyB7QXJyYXl9IEFycmF5IG9mIHRyYW5zZm9ybXMuXHJcbiAgKi9cclxuICB0cmFuc2Zvcm1zU2luY2UodHJhbnNmb3JtSWQ6IHN0cmluZyk6IFRyYW5zZm9ybVtdIHtcclxuICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybUxvZ1xyXG4gICAgICAuYWZ0ZXIodHJhbnNmb3JtSWQpXHJcbiAgICAgIC5tYXAoaWQgPT4gdGhpcy5fdHJhbnNmb3Jtc1tpZF0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgIFJldHVybnMgYWxsIHRyYWNrZWQgdHJhbnNmb3Jtcy5cclxuXHJcbiAgIEBtZXRob2QgYWxsVHJhbnNmb3Jtc1xyXG4gICBAcmV0dXJucyB7QXJyYXl9IEFycmF5IG9mIHRyYW5zZm9ybXMuXHJcbiAgKi9cclxuICBhbGxUcmFuc2Zvcm1zKCk6IFRyYW5zZm9ybVtdIHtcclxuICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybUxvZy5lbnRyaWVzXHJcbiAgICAgIC5tYXAoaWQgPT4gdGhpcy5fdHJhbnNmb3Jtc1tpZF0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0VHJhbnNmb3JtKHRyYW5zZm9ybUlkOiBzdHJpbmcpOiBUcmFuc2Zvcm0ge1xyXG4gICAgcmV0dXJuIHRoaXMuX3RyYW5zZm9ybXNbdHJhbnNmb3JtSWRdO1xyXG4gIH1cclxuXHJcbiAgZ2V0SW52ZXJzZU9wZXJhdGlvbnModHJhbnNmb3JtSWQ6IHN0cmluZyk6IFJlY29yZE9wZXJhdGlvbltdIHtcclxuICAgIHJldHVybiB0aGlzLl90cmFuc2Zvcm1JbnZlcnNlc1t0cmFuc2Zvcm1JZF07XHJcbiAgfVxyXG5cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gIC8vIFByb3RlY3RlZCBtZXRob2RzXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgcHJvdGVjdGVkIF9hcHBseVRyYW5zZm9ybSh0cmFuc2Zvcm06IFRyYW5zZm9ybSk6IFBhdGNoUmVzdWx0RGF0YVtdIHtcclxuICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuY2FjaGUucGF0Y2goPFJlY29yZE9wZXJhdGlvbltdPnRyYW5zZm9ybS5vcGVyYXRpb25zKTtcclxuICAgIHRoaXMuX3RyYW5zZm9ybXNbdHJhbnNmb3JtLmlkXSA9IHRyYW5zZm9ybTtcclxuICAgIHRoaXMuX3RyYW5zZm9ybUludmVyc2VzW3RyYW5zZm9ybS5pZF0gPSByZXN1bHQuaW52ZXJzZTtcclxuICAgIHJldHVybiByZXN1bHQuZGF0YTtcclxuICB9XHJcblxyXG4gIHByb3RlY3RlZCBfY2xlYXJUcmFuc2Zvcm1Gcm9tSGlzdG9yeSh0cmFuc2Zvcm1JZDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICBkZWxldGUgdGhpcy5fdHJhbnNmb3Jtc1t0cmFuc2Zvcm1JZF07XHJcbiAgICBkZWxldGUgdGhpcy5fdHJhbnNmb3JtSW52ZXJzZXNbdHJhbnNmb3JtSWRdO1xyXG4gIH1cclxuXHJcbiAgcHJvdGVjdGVkIF9sb2dDbGVhcmVkKCk6IHZvaWQge1xyXG4gICAgdGhpcy5fdHJhbnNmb3JtcyA9IHt9O1xyXG4gICAgdGhpcy5fdHJhbnNmb3JtSW52ZXJzZXMgPSB7fTtcclxuICB9XHJcblxyXG4gIHByb3RlY3RlZCBfbG9nVHJ1bmNhdGVkKHRyYW5zZm9ybUlkOiBzdHJpbmcsIHJlbGF0aXZlUG9zaXRpb246IG51bWJlciwgcmVtb3ZlZDogc3RyaW5nW10pOiB2b2lkIHtcclxuICAgIHJlbW92ZWQuZm9yRWFjaChpZCA9PiB0aGlzLl9jbGVhclRyYW5zZm9ybUZyb21IaXN0b3J5KGlkKSk7XHJcbiAgfVxyXG5cclxuICBwcm90ZWN0ZWQgX2xvZ1JvbGxlZGJhY2sodHJhbnNmb3JtSWQ6IHN0cmluZywgcmVsYXRpdmVQb3NpdGlvbjogbnVtYmVyLCByZW1vdmVkOiBzdHJpbmdbXSk6IHZvaWQge1xyXG4gICAgcmVtb3ZlZC5yZXZlcnNlKCkuZm9yRWFjaChpZCA9PiB7XHJcbiAgICAgIGNvbnN0IGludmVyc2VPcGVyYXRpb25zID0gdGhpcy5fdHJhbnNmb3JtSW52ZXJzZXNbaWRdO1xyXG4gICAgICBpZiAoaW52ZXJzZU9wZXJhdGlvbnMpIHtcclxuICAgICAgICB0aGlzLmNhY2hlLnBhdGNoKGludmVyc2VPcGVyYXRpb25zKTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLl9jbGVhclRyYW5zZm9ybUZyb21IaXN0b3J5KGlkKTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG4iXX0=