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
var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzcmMvc3RvcmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEscUJBYXFCO0FBRXJCLHNCQUE0QztBQUM1QyxzQkFBZ0U7QUFnQmhFLDhCQUFtQztxQkFBTSxBQWdCdkM7bUJBQVksQUFBNEIsVUFBNUI7aUNBQUE7dUJBQTRCO0FBQXhDO29CQTRCQyxBQTNCQztnQkFBTSxPQUFDLEFBQStFLGlGQUFFLENBQUMsQ0FBQyxBQUFRLFNBQUMsQUFBTSxBQUFDLEFBQUMsQUFFM0c7WUFBSSxBQUFNLFNBQVcsQUFBUSxTQUFDLEFBQU0sQUFBQyxBQUNyQztZQUFJLEFBQU0sU0FBVyxBQUFRLFNBQUMsQUFBTSxBQUFDLEFBRXJDLEFBQVE7aUJBQUMsQUFBSSxPQUFHLEFBQVEsU0FBQyxBQUFJLFFBQUksQUFBTyxBQUFDLEFBRXpDO2dCQUFBLGtCQUFNLEFBQVEsQUFBQyxhQUFDLEFBRWhCLEFBQUk7Y0FBQyxBQUFXLGNBQUcsQUFBRSxBQUFDLEFBQ3RCLEFBQUk7Y0FBQyxBQUFrQixxQkFBRyxBQUFFLEFBQUMsQUFFN0IsQUFBSTtjQUFDLEFBQVksYUFBQyxBQUFFLEdBQUMsQUFBTyxTQUFjLEFBQUksTUFBQyxBQUFXLGFBQUUsQUFBSSxBQUFDLEFBQUMsQUFDbEUsQUFBSTtjQUFDLEFBQVksYUFBQyxBQUFFLEdBQUMsQUFBVSxZQUFjLEFBQUksTUFBQyxBQUFhLGVBQUUsQUFBSSxBQUFDLEFBQUMsQUFDdkUsQUFBSTtjQUFDLEFBQVksYUFBQyxBQUFFLEdBQUMsQUFBVSxZQUFjLEFBQUksTUFBQyxBQUFjLGdCQUFFLEFBQUksQUFBQyxBQUFDLEFBRXhFO1lBQUksQUFBYSxnQkFBa0IsQUFBUSxTQUFDLEFBQWEsaUJBQUksQUFBRSxBQUFDLEFBQ2hFLEFBQWE7c0JBQUMsQUFBTSxTQUFHLEFBQU0sQUFBQyxBQUM5QixBQUFhO3NCQUFDLEFBQU0sU0FBRyxBQUFNLEFBQUMsQUFDOUIsQUFBYTtzQkFBQyxBQUFZLGVBQUcsQUFBYSxjQUFDLEFBQVksZ0JBQUksQUFBSSxNQUFDLEFBQVksQUFBQyxBQUM3RSxBQUFhO3NCQUFDLEFBQWdCLG1CQUFHLEFBQWEsY0FBQyxBQUFnQixvQkFBSSxBQUFJLE1BQUMsQUFBZ0IsQUFBQyxBQUN6RixBQUFFLEFBQUM7WUFBQyxBQUFRLFNBQUMsQUFBSSxBQUFDLE1BQUMsQUFBQyxBQUNsQixBQUFJO2tCQUFDLEFBQUssUUFBRyxBQUFRLFNBQUMsQUFBSSxBQUFDLEFBQzNCLEFBQUk7a0JBQUMsQUFBVSxhQUFHLEFBQUksTUFBQyxBQUFLLE1BQUMsQUFBWSxhQUFDLEFBQUksQUFBQyxBQUMvQyxBQUFhOzBCQUFDLEFBQUksT0FBRyxBQUFJLE1BQUMsQUFBSyxNQUFDLEFBQUssQUFBQyxBQUN4QyxBQUFDO0FBQ0QsQUFBSTtjQUFDLEFBQU0sU0FBRyxJQUFJLFFBQUssUUFBQyxBQUFhLEFBQUMsQUFBQztlQUN6QyxBQUFDOztjQTVDa0IsQUFBSyxBQThDeEI7MEJBQUksaUJBQUs7YUFBVCxZQUNFLEFBQU07bUJBQUMsQUFBSSxLQUFDLEFBQU0sQUFBQyxBQUNyQixBQUFDOzs7c0JBQUEsQUFFRDs7MEJBQUksaUJBQUk7YUFBUixZQUNFLEFBQU07bUJBQUMsQUFBSSxLQUFDLEFBQUssQUFBQyxBQUNwQixBQUFDOzs7c0JBQUEsQUFFRDs7MEJBQUksaUJBQVM7YUFBYixZQUNFLEFBQU07bUJBQUMsQUFBSSxLQUFDLEFBQVUsQUFBQyxBQUN6QixBQUFDOzs7c0JBQUEsQUFFRDs7b0JBQU8sVUFBUCxZQUNFLEFBQUk7YUFBQyxBQUFNLE9BQUMsQUFBTyxBQUFFLEFBQUMsQUFDdEIsQUFBTTtlQUFDLE9BQUssUUFBQyxBQUFPLFFBQUMsQUFBTyxBQUFFLEFBQUMsQUFDakMsQUFBQztBQUVELEFBQTZFO0FBQzdFLEFBQW9DO0FBQ3BDLEFBQTZFO0FBRTdFO29CQUFLLFFBQUwsVUFBTSxBQUFvQixXQUN4QixBQUFJO2FBQUMsQUFBZSxnQkFBQyxBQUFTLEFBQUMsQUFBQyxBQUNoQyxBQUFNO2VBQUMsT0FBSyxRQUFDLEFBQU8sUUFBQyxBQUFPLEFBQUUsQUFBQyxBQUNqQyxBQUFDO0FBRUQsQUFBNkU7QUFDN0UsQUFBcUM7QUFDckMsQUFBNkU7QUFFN0U7b0JBQU8sVUFBUCxVQUFRLEFBQW9CLFdBQzFCO1lBQUksQUFBTyxVQUFHLEFBQUksS0FBQyxBQUFlLGdCQUFDLEFBQVMsQUFBQyxBQUFDLEFBQzlDLEFBQU07ZUFBQyxPQUFLLFFBQUMsQUFBTyxRQUFDLEFBQU8sUUFBQyxBQUFPLFFBQUMsQUFBTSxXQUFLLEFBQUMsSUFBRyxBQUFPLFFBQUMsQUFBQyxBQUFDLEtBQUcsQUFBTyxBQUFDLEFBQUMsQUFDNUUsQUFBQztBQUVELEFBQTZFO0FBQzdFLEFBQXFDO0FBQ3JDLEFBQTZFO0FBRTdFO29CQUFNLFNBQU4sVUFBTyxBQUF3QixPQUM3QixBQUFNO2VBQUMsT0FBSyxRQUFDLEFBQU8sUUFBQyxBQUFPLFFBQUMsQUFBSSxLQUFDLEFBQU0sT0FBQyxBQUFLLE1BQUMsQUFBSyxBQUFDLEFBQUMsQUFBQyxBQUN6RCxBQUFDO0FBRUQsQUFBNkU7QUFDN0UsQUFBaUI7QUFDakIsQUFBNkU7QUFFN0UsQUFTRTtBQUNGOzs7Ozs7OztvQkFBSSxPQUFKLFVBQUssQUFBNEIsVUFBNUI7aUNBQUE7dUJBQTRCO0FBQy9CLEFBQVE7aUJBQUMsQUFBTSxTQUFHLEFBQUksS0FBQyxBQUFPLEFBQUMsQUFDL0IsQUFBUTtpQkFBQyxBQUFhLGdCQUFHLEFBQVEsU0FBQyxBQUFhLGlCQUFJLEFBQUUsQUFBQyxBQUN0RCxBQUFRO2lCQUFDLEFBQU0sU0FBRyxBQUFJLEtBQUMsQUFBTyxBQUFDLEFBQy9CLEFBQVE7aUJBQUMsQUFBWSxlQUFHLEFBQUksS0FBQyxBQUFZLEFBQUMsQUFDMUMsQUFBUTtpQkFBQyxBQUFnQixtQkFBRyxBQUFJLEtBQUMsQUFBZ0IsQUFBQyxBQUNsRCxBQUFRO2lCQUFDLEFBQUksT0FBRyxBQUFJLEFBQUMsQUFFckIsQUFBTTtlQUFDLElBQUksQUFBSyxRQUFDLEFBQVEsQUFBQyxBQUFDLEFBQzdCLEFBQUM7QUFFRCxBQWdCRTtBQUNGOzs7Ozs7Ozs7Ozs7OztvQkFBSyxRQUFMLFVBQU0sQUFBa0IsYUFBRSxBQUErQixTQUEvQjtnQ0FBQTtzQkFBK0I7QUFDdkQ7WUFBSSxBQUF1QixBQUFDLEFBQzVCLEFBQUUsQUFBQztZQUFDLEFBQU8sUUFBQyxBQUFnQixBQUFDLGtCQUFDLEFBQUMsQUFDN0IsQUFBVTt5QkFBRyxBQUFXLFlBQUMsQUFBZSxnQkFBQyxBQUFPLFFBQUMsQUFBZ0IsQUFBQyxBQUFDLEFBQ3JFLEFBQUMsQUFBQyxBQUFJO2VBQUMsQUFBQyxBQUNOLEFBQVU7eUJBQUcsQUFBVyxZQUFDLEFBQWEsQUFBRSxBQUFDLEFBQzNDLEFBQUM7QUFFRDtZQUFJLEFBQWdCLEFBQUMsQUFDckI7WUFBSSxBQUFHLE1BQXNCLEFBQUUsQUFBQyxBQUNoQyxBQUFVO21CQUFDLEFBQU8sUUFBQyxVQUFBLEFBQUMsR0FDbEIsQUFBSztrQkFBQyxBQUFTLFVBQUMsQUFBSSxLQUFDLEFBQUssTUFBQyxBQUFHLEtBQUUsQUFBQyxFQUFDLEFBQVUsQUFBQyxBQUFDLEFBQ2hELEFBQUMsQUFBQyxBQUFDO0FBR0gsQUFBRSxBQUFDO1lBQUMsQUFBTyxRQUFDLEFBQVEsYUFBSyxBQUFLLEFBQUMsT0FBQyxBQUFDLEFBQy9CLEFBQUc7a0JBQUcsT0FBd0IseUJBQUMsQUFBRyxBQUFDLEFBQUMsQUFDdEMsQUFBQztBQUVELEFBQWdCOzJCQUFHLE9BQWMsZUFBQyxBQUFHLEtBQUUsQUFBTyxRQUFDLEFBQWdCLEFBQUMsQUFBQyxBQUVqRSxBQUFNO2VBQUMsQUFBSSxLQUFDLEFBQU0sT0FBQyxBQUFnQixBQUFDLEFBQUMsQUFDdkMsQUFBQztBQUVELEFBT0U7QUFDRjs7Ozs7OztvQkFBUSxXQUFSLFVBQVMsQUFBbUIsYUFBRSxBQUE0QixrQkFBNUI7eUNBQUE7K0JBQTRCO0FBQ3hELEFBQU07ZUFBQyxBQUFJLEtBQUMsQUFBWSxhQUFDLEFBQVEsU0FBQyxBQUFXLGFBQUUsQUFBZ0IsQUFBQyxBQUFDLEFBQ25FLEFBQUM7QUFFRCxBQU1FO0FBQ0Y7Ozs7OztvQkFBZSxrQkFBZixVQUFnQixBQUFtQixhQUFuQztvQkFJQyxBQUhDLEFBQU07b0JBQU0sQUFBWSxhQUNyQixBQUFLLE1BQUMsQUFBVyxBQUFDLGFBQ2xCLEFBQUcsSUFBQyxVQUFBLEFBQUUsSUFBSTttQkFBQSxBQUFJLE1BQUMsQUFBVyxZQUFoQixBQUFpQixBQUFFLEFBQUMsQUFBQyxBQUFDLEFBQ3JDO0FBSFMsQUFBSSxBQUdaO0FBRUQsQUFLRTtBQUNGOzs7OztvQkFBYSxnQkFBYixZQUFBO29CQUdDLEFBRkMsQUFBTTtvQkFBTSxBQUFZLGFBQUMsQUFBTyxRQUM3QixBQUFHLElBQUMsVUFBQSxBQUFFLElBQUk7bUJBQUEsQUFBSSxNQUFDLEFBQVcsWUFBaEIsQUFBaUIsQUFBRSxBQUFDLEFBQUMsQUFBQyxBQUNyQztBQUZTLEFBQUksQUFFWjtBQUVEO29CQUFZLGVBQVosVUFBYSxBQUFtQixhQUM5QixBQUFNO2VBQUMsQUFBSSxLQUFDLEFBQVcsWUFBQyxBQUFXLEFBQUMsQUFBQyxBQUN2QyxBQUFDO0FBRUQ7b0JBQW9CLHVCQUFwQixVQUFxQixBQUFtQixhQUN0QyxBQUFNO2VBQUMsQUFBSSxLQUFDLEFBQWtCLG1CQUFDLEFBQVcsQUFBQyxBQUFDLEFBQzlDLEFBQUM7QUFFRCxBQUE2RTtBQUM3RSxBQUFvQjtBQUNwQixBQUE2RTtBQUVuRTtvQkFBZSxrQkFBekIsVUFBMEIsQUFBb0IsV0FDNUM7WUFBTSxBQUFNLFNBQUcsQUFBSSxLQUFDLEFBQUssTUFBQyxBQUFLLE1BQW9CLEFBQVMsVUFBQyxBQUFVLEFBQUMsQUFBQyxBQUN6RSxBQUFJO2FBQUMsQUFBVyxZQUFDLEFBQVMsVUFBQyxBQUFFLEFBQUMsTUFBRyxBQUFTLEFBQUMsQUFDM0MsQUFBSTthQUFDLEFBQWtCLG1CQUFDLEFBQVMsVUFBQyxBQUFFLEFBQUMsTUFBRyxBQUFNLE9BQUMsQUFBTyxBQUFDLEFBQ3ZELEFBQU07ZUFBQyxBQUFNLE9BQUMsQUFBSSxBQUFDLEFBQ3JCLEFBQUM7QUFFUztvQkFBMEIsNkJBQXBDLFVBQXFDLEFBQW1CLGFBQ3REO2VBQU8sQUFBSSxLQUFDLEFBQVcsWUFBQyxBQUFXLEFBQUMsQUFBQyxBQUNyQztlQUFPLEFBQUksS0FBQyxBQUFrQixtQkFBQyxBQUFXLEFBQUMsQUFBQyxBQUM5QyxBQUFDO0FBRVM7b0JBQVcsY0FBckIsWUFDRSxBQUFJO2FBQUMsQUFBVyxjQUFHLEFBQUUsQUFBQyxBQUN0QixBQUFJO2FBQUMsQUFBa0IscUJBQUcsQUFBRSxBQUFDLEFBQy9CLEFBQUM7QUFFUztvQkFBYSxnQkFBdkIsVUFBd0IsQUFBbUIsYUFBRSxBQUF3QixrQkFBRSxBQUFpQixTQUF4RjtvQkFFQyxBQURDLEFBQU87Z0JBQUMsQUFBTyxRQUFDLFVBQUEsQUFBRSxJQUFJO21CQUFBLEFBQUksTUFBQyxBQUEwQiwyQkFBL0IsQUFBZ0MsQUFBRSxBQUFDLEFBQUMsQUFBQyxBQUM3RDtBQUFDO0FBRVM7b0JBQWMsaUJBQXhCLFVBQXlCLEFBQW1CLGFBQUUsQUFBd0Isa0JBQUUsQUFBaUIsU0FBekY7b0JBUUMsQUFQQyxBQUFPO2dCQUFDLEFBQU8sQUFBRSxVQUFDLEFBQU8sUUFBQyxVQUFBLEFBQUUsSUFDMUI7Z0JBQU0sQUFBaUIsb0JBQUcsQUFBSSxNQUFDLEFBQWtCLG1CQUFDLEFBQUUsQUFBQyxBQUFDLEFBQ3RELEFBQUUsQUFBQztnQkFBQyxBQUFpQixBQUFDLG1CQUFDLEFBQUMsQUFDdEIsQUFBSTtzQkFBQyxBQUFLLE1BQUMsQUFBSyxNQUFDLEFBQWlCLEFBQUMsQUFBQyxBQUN0QyxBQUFDO0FBQ0QsQUFBSTtrQkFBQyxBQUEwQiwyQkFBQyxBQUFFLEFBQUMsQUFBQyxBQUN0QyxBQUFDLEFBQUMsQUFBQyxBQUNMO0FBQUM7QUF4T2tCLEFBQUs7a0NBSHpCLE9BQVEsVUFDUixPQUFTLFdBQ1QsT0FBUyxZQUNXLEFBQUssQUF5T3pCLEFBQUQ7V0FBQztRQXpPRCxBQXlPQztFQXpPa0MsT0FBTSxBQXlPeEM7a0JBek9vQixBQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE9yYml0LCB7XHJcbiAgS2V5TWFwLFxyXG4gIFJlY29yZE9wZXJhdGlvbixcclxuICBTY2hlbWEsXHJcbiAgU291cmNlLCBTb3VyY2VTZXR0aW5ncyxcclxuICBTeW5jYWJsZSwgc3luY2FibGUsXHJcbiAgUXVlcnksIFF1ZXJ5T3JFeHByZXNzaW9uLFxyXG4gIFF1ZXJ5YWJsZSwgcXVlcnlhYmxlLFxyXG4gIFVwZGF0YWJsZSwgdXBkYXRhYmxlLFxyXG4gIFRyYW5zZm9ybSxcclxuICBUcmFuc2Zvcm1Pck9wZXJhdGlvbnMsXHJcbiAgY29hbGVzY2VSZWNvcmRPcGVyYXRpb25zLFxyXG4gIGJ1aWxkVHJhbnNmb3JtXHJcbn0gZnJvbSAnQG9yYml0L2RhdGEnO1xyXG5pbXBvcnQgeyBMb2cgfSBmcm9tICdAb3JiaXQvY29yZSc7XHJcbmltcG9ydCB7IGFzc2VydCwgRGljdCB9IGZyb20gJ0BvcmJpdC91dGlscyc7XHJcbmltcG9ydCBDYWNoZSwgeyBDYWNoZVNldHRpbmdzLCBQYXRjaFJlc3VsdERhdGEgfSBmcm9tICcuL2NhY2hlJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgU3RvcmVTZXR0aW5ncyBleHRlbmRzIFNvdXJjZVNldHRpbmdzIHtcclxuICBiYXNlPzogU3RvcmU7XHJcbiAgY2FjaGVTZXR0aW5ncz86IENhY2hlU2V0dGluZ3M7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgU3RvcmVNZXJnZU9wdGlvbnMge1xyXG4gIGNvYWxlc2NlPzogYm9vbGVhbjtcclxuICBzaW5jZVRyYW5zZm9ybUlkPzogc3RyaW5nO1xyXG4gIHRyYW5zZm9ybU9wdGlvbnM/OiBvYmplY3Q7XHJcbn1cclxuXHJcbkBzeW5jYWJsZVxyXG5AcXVlcnlhYmxlXHJcbkB1cGRhdGFibGVcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RvcmUgZXh0ZW5kcyBTb3VyY2UgaW1wbGVtZW50cyBTeW5jYWJsZSwgUXVlcnlhYmxlLCBVcGRhdGFibGUge1xyXG4gIHByaXZhdGUgX2NhY2hlOiBDYWNoZTtcclxuICBwcml2YXRlIF9iYXNlOiBTdG9yZTtcclxuICBwcml2YXRlIF9mb3JrUG9pbnQ6IHN0cmluZztcclxuICBwcml2YXRlIF90cmFuc2Zvcm1zOiBEaWN0PFRyYW5zZm9ybT47XHJcbiAgcHJpdmF0ZSBfdHJhbnNmb3JtSW52ZXJzZXM6IERpY3Q8UmVjb3JkT3BlcmF0aW9uW10+O1xyXG5cclxuICAvLyBTeW5jYWJsZSBpbnRlcmZhY2Ugc3R1YnNcclxuICBzeW5jOiAodHJhbnNmb3JtT3JUcmFuc2Zvcm1zOiBUcmFuc2Zvcm0gfCBUcmFuc2Zvcm1bXSkgPT4gUHJvbWlzZTx2b2lkPjtcclxuXHJcbiAgLy8gUXVlcnlhYmxlIGludGVyZmFjZSBzdHVic1xyXG4gIHF1ZXJ5OiAocXVlcnlPckV4cHJlc3Npb246IFF1ZXJ5T3JFeHByZXNzaW9uLCBvcHRpb25zPzogb2JqZWN0LCBpZD86IHN0cmluZykgPT4gUHJvbWlzZTxhbnk+O1xyXG5cclxuICAvLyBVcGRhdGFibGUgaW50ZXJmYWNlIHN0dWJzXHJcbiAgdXBkYXRlOiAodHJhbnNmb3JtT3JPcGVyYXRpb25zOiBUcmFuc2Zvcm1Pck9wZXJhdGlvbnMsIG9wdGlvbnM/OiBvYmplY3QsIGlkPzogc3RyaW5nKSA9PiBQcm9taXNlPGFueT47XHJcblxyXG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzOiBTdG9yZVNldHRpbmdzID0ge30pIHtcclxuICAgIGFzc2VydCgnU3RvcmVcXCdzIGBzY2hlbWFgIG11c3QgYmUgc3BlY2lmaWVkIGluIGBzZXR0aW5ncy5zY2hlbWFgIGNvbnN0cnVjdG9yIGFyZ3VtZW50JywgISFzZXR0aW5ncy5zY2hlbWEpO1xyXG5cclxuICAgIGxldCBrZXlNYXA6IEtleU1hcCA9IHNldHRpbmdzLmtleU1hcDtcclxuICAgIGxldCBzY2hlbWE6IFNjaGVtYSA9IHNldHRpbmdzLnNjaGVtYTtcclxuXHJcbiAgICBzZXR0aW5ncy5uYW1lID0gc2V0dGluZ3MubmFtZSB8fCAnc3RvcmUnO1xyXG5cclxuICAgIHN1cGVyKHNldHRpbmdzKTtcclxuXHJcbiAgICB0aGlzLl90cmFuc2Zvcm1zID0ge307XHJcbiAgICB0aGlzLl90cmFuc2Zvcm1JbnZlcnNlcyA9IHt9O1xyXG5cclxuICAgIHRoaXMudHJhbnNmb3JtTG9nLm9uKCdjbGVhcicsIDwoKSA9PiB2b2lkPnRoaXMuX2xvZ0NsZWFyZWQsIHRoaXMpO1xyXG4gICAgdGhpcy50cmFuc2Zvcm1Mb2cub24oJ3RydW5jYXRlJywgPCgpID0+IHZvaWQ+dGhpcy5fbG9nVHJ1bmNhdGVkLCB0aGlzKTtcclxuICAgIHRoaXMudHJhbnNmb3JtTG9nLm9uKCdyb2xsYmFjaycsIDwoKSA9PiB2b2lkPnRoaXMuX2xvZ1JvbGxlZGJhY2ssIHRoaXMpO1xyXG5cclxuICAgIGxldCBjYWNoZVNldHRpbmdzOiBDYWNoZVNldHRpbmdzID0gc2V0dGluZ3MuY2FjaGVTZXR0aW5ncyB8fCB7fTtcclxuICAgIGNhY2hlU2V0dGluZ3Muc2NoZW1hID0gc2NoZW1hO1xyXG4gICAgY2FjaGVTZXR0aW5ncy5rZXlNYXAgPSBrZXlNYXA7XHJcbiAgICBjYWNoZVNldHRpbmdzLnF1ZXJ5QnVpbGRlciA9IGNhY2hlU2V0dGluZ3MucXVlcnlCdWlsZGVyIHx8IHRoaXMucXVlcnlCdWlsZGVyO1xyXG4gICAgY2FjaGVTZXR0aW5ncy50cmFuc2Zvcm1CdWlsZGVyID0gY2FjaGVTZXR0aW5ncy50cmFuc2Zvcm1CdWlsZGVyIHx8IHRoaXMudHJhbnNmb3JtQnVpbGRlcjtcclxuICAgIGlmIChzZXR0aW5ncy5iYXNlKSB7XHJcbiAgICAgIHRoaXMuX2Jhc2UgPSBzZXR0aW5ncy5iYXNlO1xyXG4gICAgICB0aGlzLl9mb3JrUG9pbnQgPSB0aGlzLl9iYXNlLnRyYW5zZm9ybUxvZy5oZWFkO1xyXG4gICAgICBjYWNoZVNldHRpbmdzLmJhc2UgPSB0aGlzLl9iYXNlLmNhY2hlO1xyXG4gICAgfVxyXG4gICAgdGhpcy5fY2FjaGUgPSBuZXcgQ2FjaGUoY2FjaGVTZXR0aW5ncyk7XHJcbiAgfVxyXG5cclxuICBnZXQgY2FjaGUoKTogQ2FjaGUge1xyXG4gICAgcmV0dXJuIHRoaXMuX2NhY2hlO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGJhc2UoKTogU3RvcmUge1xyXG4gICAgcmV0dXJuIHRoaXMuX2Jhc2U7XHJcbiAgfVxyXG5cclxuICBnZXQgZm9ya1BvaW50KCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5fZm9ya1BvaW50O1xyXG4gIH1cclxuXHJcbiAgdXBncmFkZSgpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHRoaXMuX2NhY2hlLnVwZ3JhZGUoKTtcclxuICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKTtcclxuICB9XHJcblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgLy8gU3luY2FibGUgaW50ZXJmYWNlIGltcGxlbWVudGF0aW9uXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgX3N5bmModHJhbnNmb3JtOiBUcmFuc2Zvcm0pOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHRoaXMuX2FwcGx5VHJhbnNmb3JtKHRyYW5zZm9ybSk7XHJcbiAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgfVxyXG5cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gIC8vIFVwZGF0YWJsZSBpbnRlcmZhY2UgaW1wbGVtZW50YXRpb25cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICBfdXBkYXRlKHRyYW5zZm9ybTogVHJhbnNmb3JtKTogUHJvbWlzZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHRzID0gdGhpcy5fYXBwbHlUcmFuc2Zvcm0odHJhbnNmb3JtKTtcclxuICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUocmVzdWx0cy5sZW5ndGggPT09IDEgPyByZXN1bHRzWzBdIDogcmVzdWx0cyk7XHJcbiAgfVxyXG5cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gIC8vIFF1ZXJ5YWJsZSBpbnRlcmZhY2UgaW1wbGVtZW50YXRpb25cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICBfcXVlcnkocXVlcnk6IFF1ZXJ5T3JFeHByZXNzaW9uKSB7XHJcbiAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKHRoaXMuX2NhY2hlLnF1ZXJ5KHF1ZXJ5KSk7XHJcbiAgfVxyXG5cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gIC8vIFB1YmxpYyBtZXRob2RzXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgLyoqXHJcbiAgIENyZWF0ZSBhIGNsb25lLCBvciBcImZvcmtcIiwgZnJvbSBhIFwiYmFzZVwiIHN0b3JlLlxyXG5cclxuICAgVGhlIGZvcmtlZCBzdG9yZSB3aWxsIGhhdmUgdGhlIHNhbWUgYHNjaGVtYWAgYW5kIGBrZXlNYXBgIGFzIGl0cyBiYXNlIHN0b3JlLlxyXG4gICBUaGUgZm9ya2VkIHN0b3JlJ3MgY2FjaGUgd2lsbCBzdGFydCB3aXRoIHRoZSBzYW1lIGltbXV0YWJsZSBkb2N1bWVudCBhc1xyXG4gICB0aGUgYmFzZSBzdG9yZS4gSXRzIGNvbnRlbnRzIGFuZCBsb2cgd2lsbCBldm9sdmUgaW5kZXBlbmRlbnRseS5cclxuXHJcbiAgIEBtZXRob2QgZm9ya1xyXG4gICBAcmV0dXJucyB7U3RvcmV9IFRoZSBmb3JrZWQgc3RvcmUuXHJcbiAgKi9cclxuICBmb3JrKHNldHRpbmdzOiBTdG9yZVNldHRpbmdzID0ge30pIHtcclxuICAgIHNldHRpbmdzLnNjaGVtYSA9IHRoaXMuX3NjaGVtYTtcclxuICAgIHNldHRpbmdzLmNhY2hlU2V0dGluZ3MgPSBzZXR0aW5ncy5jYWNoZVNldHRpbmdzIHx8IHt9O1xyXG4gICAgc2V0dGluZ3Mua2V5TWFwID0gdGhpcy5fa2V5TWFwO1xyXG4gICAgc2V0dGluZ3MucXVlcnlCdWlsZGVyID0gdGhpcy5xdWVyeUJ1aWxkZXI7XHJcbiAgICBzZXR0aW5ncy50cmFuc2Zvcm1CdWlsZGVyID0gdGhpcy50cmFuc2Zvcm1CdWlsZGVyO1xyXG4gICAgc2V0dGluZ3MuYmFzZSA9IHRoaXM7XHJcblxyXG4gICAgcmV0dXJuIG5ldyBTdG9yZShzZXR0aW5ncyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgTWVyZ2UgdHJhbnNmb3JtcyBmcm9tIGEgZm9ya2VkIHN0b3JlIGJhY2sgaW50byBhIGJhc2Ugc3RvcmUuXHJcblxyXG4gICBCeSBkZWZhdWx0LCBhbGwgb2YgdGhlIG9wZXJhdGlvbnMgZnJvbSBhbGwgb2YgdGhlIHRyYW5zZm9ybXMgaW4gdGhlIGZvcmtlZFxyXG4gICBzdG9yZSdzIGhpc3Rvcnkgd2lsbCBiZSByZWR1Y2VkIGludG8gYSBzaW5nbGUgdHJhbnNmb3JtLiBBIHN1YnNldCBvZlxyXG4gICBvcGVyYXRpb25zIGNhbiBiZSBzZWxlY3RlZCBieSBzcGVjaWZ5aW5nIHRoZSBgc2luY2VUcmFuc2Zvcm1JZGAgb3B0aW9uLlxyXG5cclxuICAgVGhlIGBjb2FsZXNjZWAgb3B0aW9uIGNvbnRyb2xzIHdoZXRoZXIgb3BlcmF0aW9ucyBhcmUgY29hbGVzY2VkIGludG8gYVxyXG4gICBtaW5pbWFsIGVxdWl2YWxlbnQgc2V0IGJlZm9yZSBiZWluZyByZWR1Y2VkIGludG8gYSB0cmFuc2Zvcm0uXHJcblxyXG4gICBAbWV0aG9kIG1lcmdlXHJcbiAgIEBwYXJhbSB7U3RvcmV9IGZvcmtlZFN0b3JlIC0gVGhlIHN0b3JlIHRvIG1lcmdlLlxyXG4gICBAcGFyYW0ge09iamVjdH0gIFtvcHRpb25zXSBzZXR0aW5nc1xyXG4gICBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmNvYWxlc2NlID0gdHJ1ZV0gU2hvdWxkIG9wZXJhdGlvbnMgYmUgY29hbGVzY2VkIGludG8gYSBtaW5pbWFsIGVxdWl2YWxlbnQgc2V0P1xyXG4gICBAcGFyYW0ge1N0cmluZ30gIFtvcHRpb25zLnNpbmNlVHJhbnNmb3JtSWQgPSBudWxsXSBTZWxlY3Qgb25seSB0cmFuc2Zvcm1zIHNpbmNlIHRoZSBzcGVjaWZpZWQgSUQuXHJcbiAgIEByZXR1cm5zIHtQcm9taXNlfSBUaGUgcmVzdWx0IG9mIGNhbGxpbmcgYHVwZGF0ZSgpYCB3aXRoIHRoZSBmb3JrZWQgdHJhbnNmb3Jtcy5cclxuICAqL1xyXG4gIG1lcmdlKGZvcmtlZFN0b3JlOiBTdG9yZSwgb3B0aW9uczogU3RvcmVNZXJnZU9wdGlvbnMgPSB7fSk6IFByb21pc2U8YW55PiB7XHJcbiAgICBsZXQgdHJhbnNmb3JtczogVHJhbnNmb3JtW107XHJcbiAgICBpZiAob3B0aW9ucy5zaW5jZVRyYW5zZm9ybUlkKSB7XHJcbiAgICAgIHRyYW5zZm9ybXMgPSBmb3JrZWRTdG9yZS50cmFuc2Zvcm1zU2luY2Uob3B0aW9ucy5zaW5jZVRyYW5zZm9ybUlkKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRyYW5zZm9ybXMgPSBmb3JrZWRTdG9yZS5hbGxUcmFuc2Zvcm1zKCk7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHJlZHVjZWRUcmFuc2Zvcm07XHJcbiAgICBsZXQgb3BzOiBSZWNvcmRPcGVyYXRpb25bXSA9IFtdO1xyXG4gICAgdHJhbnNmb3Jtcy5mb3JFYWNoKHQgPT4ge1xyXG4gICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShvcHMsIHQub3BlcmF0aW9ucyk7XHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgaWYgKG9wdGlvbnMuY29hbGVzY2UgIT09IGZhbHNlKSB7XHJcbiAgICAgIG9wcyA9IGNvYWxlc2NlUmVjb3JkT3BlcmF0aW9ucyhvcHMpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlZHVjZWRUcmFuc2Zvcm0gPSBidWlsZFRyYW5zZm9ybShvcHMsIG9wdGlvbnMudHJhbnNmb3JtT3B0aW9ucyk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMudXBkYXRlKHJlZHVjZWRUcmFuc2Zvcm0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgIFJvbGxzIGJhY2sgdGhlIFN0b3JlIHRvIGEgcGFydGljdWxhciB0cmFuc2Zvcm1JZFxyXG5cclxuICAgQG1ldGhvZCByb2xsYmFja1xyXG4gICBAcGFyYW0ge3N0cmluZ30gdHJhbnNmb3JtSWQgLSBUaGUgSUQgb2YgdGhlIHRyYW5zZm9ybSB0byByb2xsIGJhY2sgdG9cclxuICAgQHBhcmFtIHtudW1iZXJ9IHJlbGF0aXZlUG9zaXRpb24gLSBBIHBvc2l0aXZlIG9yIG5lZ2F0aXZlIGludGVnZXIgdG8gc3BlY2lmeSBhIHBvc2l0aW9uIHJlbGF0aXZlIHRvIGB0cmFuc2Zvcm1JZGBcclxuICAgQHJldHVybnMge3VuZGVmaW5lZH1cclxuICAqL1xyXG4gIHJvbGxiYWNrKHRyYW5zZm9ybUlkOiBzdHJpbmcsIHJlbGF0aXZlUG9zaXRpb246IG51bWJlciA9IDApOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybUxvZy5yb2xsYmFjayh0cmFuc2Zvcm1JZCwgcmVsYXRpdmVQb3NpdGlvbik7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgUmV0dXJucyBhbGwgdHJhbnNmb3JtcyBzaW5jZSBhIHBhcnRpY3VsYXIgYHRyYW5zZm9ybUlkYC5cclxuXHJcbiAgIEBtZXRob2QgdHJhbnNmb3Jtc1NpbmNlXHJcbiAgIEBwYXJhbSB7c3RyaW5nfSB0cmFuc2Zvcm1JZCAtIFRoZSBJRCBvZiB0aGUgdHJhbnNmb3JtIHRvIHN0YXJ0IHdpdGguXHJcbiAgIEByZXR1cm5zIHtBcnJheX0gQXJyYXkgb2YgdHJhbnNmb3Jtcy5cclxuICAqL1xyXG4gIHRyYW5zZm9ybXNTaW5jZSh0cmFuc2Zvcm1JZDogc3RyaW5nKTogVHJhbnNmb3JtW10ge1xyXG4gICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtTG9nXHJcbiAgICAgIC5hZnRlcih0cmFuc2Zvcm1JZClcclxuICAgICAgLm1hcChpZCA9PiB0aGlzLl90cmFuc2Zvcm1zW2lkXSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgUmV0dXJucyBhbGwgdHJhY2tlZCB0cmFuc2Zvcm1zLlxyXG5cclxuICAgQG1ldGhvZCBhbGxUcmFuc2Zvcm1zXHJcbiAgIEByZXR1cm5zIHtBcnJheX0gQXJyYXkgb2YgdHJhbnNmb3Jtcy5cclxuICAqL1xyXG4gIGFsbFRyYW5zZm9ybXMoKTogVHJhbnNmb3JtW10ge1xyXG4gICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtTG9nLmVudHJpZXNcclxuICAgICAgLm1hcChpZCA9PiB0aGlzLl90cmFuc2Zvcm1zW2lkXSk7XHJcbiAgfVxyXG5cclxuICBnZXRUcmFuc2Zvcm0odHJhbnNmb3JtSWQ6IHN0cmluZyk6IFRyYW5zZm9ybSB7XHJcbiAgICByZXR1cm4gdGhpcy5fdHJhbnNmb3Jtc1t0cmFuc2Zvcm1JZF07XHJcbiAgfVxyXG5cclxuICBnZXRJbnZlcnNlT3BlcmF0aW9ucyh0cmFuc2Zvcm1JZDogc3RyaW5nKTogUmVjb3JkT3BlcmF0aW9uW10ge1xyXG4gICAgcmV0dXJuIHRoaXMuX3RyYW5zZm9ybUludmVyc2VzW3RyYW5zZm9ybUlkXTtcclxuICB9XHJcblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgLy8gUHJvdGVjdGVkIG1ldGhvZHNcclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICBwcm90ZWN0ZWQgX2FwcGx5VHJhbnNmb3JtKHRyYW5zZm9ybTogVHJhbnNmb3JtKTogUGF0Y2hSZXN1bHREYXRhW10ge1xyXG4gICAgY29uc3QgcmVzdWx0ID0gdGhpcy5jYWNoZS5wYXRjaCg8UmVjb3JkT3BlcmF0aW9uW10+dHJhbnNmb3JtLm9wZXJhdGlvbnMpO1xyXG4gICAgdGhpcy5fdHJhbnNmb3Jtc1t0cmFuc2Zvcm0uaWRdID0gdHJhbnNmb3JtO1xyXG4gICAgdGhpcy5fdHJhbnNmb3JtSW52ZXJzZXNbdHJhbnNmb3JtLmlkXSA9IHJlc3VsdC5pbnZlcnNlO1xyXG4gICAgcmV0dXJuIHJlc3VsdC5kYXRhO1xyXG4gIH1cclxuXHJcbiAgcHJvdGVjdGVkIF9jbGVhclRyYW5zZm9ybUZyb21IaXN0b3J5KHRyYW5zZm9ybUlkOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIGRlbGV0ZSB0aGlzLl90cmFuc2Zvcm1zW3RyYW5zZm9ybUlkXTtcclxuICAgIGRlbGV0ZSB0aGlzLl90cmFuc2Zvcm1JbnZlcnNlc1t0cmFuc2Zvcm1JZF07XHJcbiAgfVxyXG5cclxuICBwcm90ZWN0ZWQgX2xvZ0NsZWFyZWQoKTogdm9pZCB7XHJcbiAgICB0aGlzLl90cmFuc2Zvcm1zID0ge307XHJcbiAgICB0aGlzLl90cmFuc2Zvcm1JbnZlcnNlcyA9IHt9O1xyXG4gIH1cclxuXHJcbiAgcHJvdGVjdGVkIF9sb2dUcnVuY2F0ZWQodHJhbnNmb3JtSWQ6IHN0cmluZywgcmVsYXRpdmVQb3NpdGlvbjogbnVtYmVyLCByZW1vdmVkOiBzdHJpbmdbXSk6IHZvaWQge1xyXG4gICAgcmVtb3ZlZC5mb3JFYWNoKGlkID0+IHRoaXMuX2NsZWFyVHJhbnNmb3JtRnJvbUhpc3RvcnkoaWQpKTtcclxuICB9XHJcblxyXG4gIHByb3RlY3RlZCBfbG9nUm9sbGVkYmFjayh0cmFuc2Zvcm1JZDogc3RyaW5nLCByZWxhdGl2ZVBvc2l0aW9uOiBudW1iZXIsIHJlbW92ZWQ6IHN0cmluZ1tdKTogdm9pZCB7XHJcbiAgICByZW1vdmVkLnJldmVyc2UoKS5mb3JFYWNoKGlkID0+IHtcclxuICAgICAgY29uc3QgaW52ZXJzZU9wZXJhdGlvbnMgPSB0aGlzLl90cmFuc2Zvcm1JbnZlcnNlc1tpZF07XHJcbiAgICAgIGlmIChpbnZlcnNlT3BlcmF0aW9ucykge1xyXG4gICAgICAgIHRoaXMuY2FjaGUucGF0Y2goaW52ZXJzZU9wZXJhdGlvbnMpO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuX2NsZWFyVHJhbnNmb3JtRnJvbUhpc3RvcnkoaWQpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==