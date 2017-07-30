"use strict";

var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable valid-jsdoc */
var utils_1 = require("@orbit/utils");
var core_1 = require("@orbit/core");
var data_1 = require("@orbit/data");
var cache_integrity_processor_1 = require("./cache/operation-processors/cache-integrity-processor");
var schema_consistency_processor_1 = require("./cache/operation-processors/schema-consistency-processor");
var query_operators_1 = require("./cache/query-operators");
var patch_transforms_1 = require("./cache/patch-transforms");
var inverse_transforms_1 = require("./cache/inverse-transforms");
var immutable_1 = require("@orbit/immutable");
var relationship_accessor_1 = require("./cache/relationship-accessor");
var inverse_relationship_accessor_1 = require("./cache/inverse-relationship-accessor");
/**
 * A `Cache` is an in-memory data store that can be accessed synchronously.
 *
 * Caches use operation processors to maintain internal consistency.
 *
 * Because data is stored in immutable maps, caches can be forked efficiently.
 *
 * @export
 * @class Cache
 * @implements {Evented}
 */
var Cache = function () {
    function Cache(settings) {
        if (settings === void 0) {
            settings = {};
        }
        var _this = this;
        this._schema = settings.schema;
        this._keyMap = settings.keyMap;
        this._queryBuilder = settings.queryBuilder || new data_1.QueryBuilder();
        this._transformBuilder = settings.transformBuilder || new data_1.TransformBuilder({
            recordInitializer: this._schema
        });
        var processors = settings.processors ? settings.processors : [schema_consistency_processor_1.default, cache_integrity_processor_1.default];
        this._processors = processors.map(function (Processor) {
            return new Processor(_this);
        });
        this.reset(settings.base);
    }
    Object.defineProperty(Cache.prototype, "keyMap", {
        get: function () {
            return this._keyMap;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cache.prototype, "schema", {
        get: function () {
            return this._schema;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cache.prototype, "queryBuilder", {
        get: function () {
            return this._queryBuilder;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cache.prototype, "transformBuilder", {
        get: function () {
            return this._transformBuilder;
        },
        enumerable: true,
        configurable: true
    });
    Cache.prototype.records = function (type) {
        return this._records[type];
    };
    Object.defineProperty(Cache.prototype, "relationships", {
        get: function () {
            return this._relationships;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cache.prototype, "inverseRelationships", {
        get: function () {
            return this._inverseRelationships;
        },
        enumerable: true,
        configurable: true
    });
    /**
     Allows a client to run queries against the cache.
        @example
     ``` javascript
     // using a query builder callback
     cache.query(qb.record('planet', 'idabc123')).then(results => {});
     ```
        @example
     ``` javascript
     // using an expression
     cache.query(oqe('record', 'planet', 'idabc123')).then(results => {});
     ```
        @method query
     @param {Expression} query
     @return {Object} result of query (type depends on query)
     */
    Cache.prototype.query = function (queryOrExpression, options, id) {
        var query = data_1.buildQuery(queryOrExpression, options, id, this._queryBuilder);
        return this._query(query.expression);
    };
    /**
     * Resets the cache's state to be either empty or to match the state of
     * another cache.
     *
     * @example
     * ``` javascript
     * cache.reset(); // empties cache
     * cache.reset(cache2); // clones the state of cache2
     * ```
     *
     * @param {Cache} [base]
     * @memberof Cache
     */
    Cache.prototype.reset = function (base) {
        var _this = this;
        this._records = {};
        Object.keys(this._schema.models).forEach(function (type) {
            var baseRecords = base && base.records(type);
            _this._records[type] = new immutable_1.ImmutableMap(baseRecords);
        });
        this._relationships = new relationship_accessor_1.default(this, base && base.relationships);
        this._inverseRelationships = new inverse_relationship_accessor_1.default(this, base && base.inverseRelationships);
        this._processors.forEach(function (processor) {
            return processor.reset(base);
        });
        this.emit('reset');
    };
    /**
     * Patches the document with an operation.
     *
     * @param {(Operation | Operation[] | TransformBuilderFunc)} operationOrOperations
     * @returns {Operation[]}
     * @memberof Cache
     */
    Cache.prototype.patch = function (operationOrOperations) {
        if (typeof operationOrOperations === 'function') {
            operationOrOperations = operationOrOperations(this._transformBuilder);
        }
        var result = {
            inverse: [],
            data: []
        };
        if (utils_1.isArray(operationOrOperations)) {
            this._applyOperations(operationOrOperations, result, true);
        } else {
            this._applyOperation(operationOrOperations, result, true);
        }
        return result;
    };
    /////////////////////////////////////////////////////////////////////////////
    // Protected methods
    /////////////////////////////////////////////////////////////////////////////
    Cache.prototype._applyOperations = function (ops, result, primary) {
        var _this = this;
        if (primary === void 0) {
            primary = false;
        }
        ops.forEach(function (op) {
            return _this._applyOperation(op, result, primary);
        });
    };
    Cache.prototype._applyOperation = function (operation, result, primary) {
        var _this = this;
        if (primary === void 0) {
            primary = false;
        }
        var inverseTransform = inverse_transforms_1.default[operation.op];
        var inverseOp = inverseTransform(this, operation);
        if (inverseOp) {
            result.inverse.unshift(inverseOp);
            // Query and perform related `before` operations
            this._processors.map(function (processor) {
                return processor.before(operation);
            }).forEach(function (ops) {
                return _this._applyOperations(ops, result);
            });
            // Query related `after` operations before performing
            // the requested operation. These will be applied on success.
            var preparedOps = this._processors.map(function (processor) {
                return processor.after(operation);
            });
            // Perform the requested operation
            var patchTransform = patch_transforms_1.default[operation.op];
            var data = patchTransform(this, operation);
            if (primary) {
                result.data.push(data);
            }
            // Query and perform related `immediate` operations
            this._processors.forEach(function (processor) {
                return processor.immediate(operation);
            });
            // Emit event
            this.emit('patch', operation, data);
            // Perform prepared operations after performing the requested operation
            preparedOps.forEach(function (ops) {
                return _this._applyOperations(ops, result);
            });
            // Query and perform related `finally` operations
            this._processors.map(function (processor) {
                return processor.finally(operation);
            }).forEach(function (ops) {
                return _this._applyOperations(ops, result);
            });
        } else if (primary) {
            result.data.push(null);
        }
    };
    Cache.prototype._query = function (expression) {
        var operator = query_operators_1.QueryOperators[expression.op];
        if (!operator) {
            throw new Error('Unable to find operator: ' + expression.op);
        }
        return operator(this, expression);
    };
    Cache = __decorate([core_1.evented], Cache);
    return Cache;
}();
exports.default = Cache;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FjaGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzcmMvY2FjaGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLEFBQWdDO0FBQ2hDLHNCQUE2QztBQUM3QyxxQkFFcUI7QUFDckIscUJBY3FCO0FBRXJCLDBDQUE2RjtBQUM3Riw2Q0FBbUc7QUFDbkcsZ0NBQXlEO0FBQ3pELGlDQUErRTtBQUMvRSxtQ0FBcUY7QUFDckYsMEJBQWdEO0FBQ2hELHNDQUFpRTtBQUNqRSw4Q0FBZ0Y7QUFrQmhGLEFBVUc7Ozs7Ozs7Ozs7O0FBRUg7QUFpQkUsbUJBQVksQUFBNEI7QUFBNUIsaUNBQUE7QUFBQSx1QkFBNEI7O0FBQXhDLG9CQWFDO0FBWkMsQUFBSSxhQUFDLEFBQU8sVUFBRyxBQUFRLFNBQUMsQUFBTSxBQUFDO0FBQy9CLEFBQUksYUFBQyxBQUFPLFVBQUcsQUFBUSxTQUFDLEFBQU0sQUFBQztBQUUvQixBQUFJLGFBQUMsQUFBYSxnQkFBRyxBQUFRLFNBQUMsQUFBWSxnQkFBSSxJQUFJLE9BQVksQUFBRSxBQUFDO0FBQ2pFLEFBQUksYUFBQyxBQUFpQixvQkFBRyxBQUFRLFNBQUMsQUFBZ0Isd0JBQVEsT0FBZ0I7QUFDeEUsQUFBaUIsK0JBQUUsQUFBSSxLQUFDLEFBQU8sQUFDaEMsQUFBQyxBQUFDO0FBRndFLFNBQXJCO0FBSXRELFlBQU0sQUFBVSxhQUE4QixBQUFRLFNBQUMsQUFBVSxhQUFHLEFBQVEsU0FBQyxBQUFVLGFBQUcsQ0FBQywrQkFBMEIsU0FBRSw0QkFBdUIsQUFBQyxBQUFDO0FBQ2hKLEFBQUksYUFBQyxBQUFXLHlCQUFjLEFBQUcsSUFBQyxVQUFBLEFBQVM7QUFBSSxtQkFBQSxJQUFJLEFBQVMsVUFBYixBQUFjLEFBQUksQUFBQztBQUFBLEFBQUMsQUFBQyxTQUFqRCxBQUFVO0FBRTdCLEFBQUksYUFBQyxBQUFLLE1BQUMsQUFBUSxTQUFDLEFBQUksQUFBQyxBQUFDLEFBQzVCO0FBQUM7QUFFRCwwQkFB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QUksTUFBQyxBQUFnQixpQkFBQyxBQUFHLEtBQXpCLEFBQTJCLEFBQU0sQUFBQztBQUFBLEFBQUMsQUFBQyxBQUMxRDtBQUFDLEFBQUMsQUFBSSxlQUFDLEFBQUUsQUFBQyxJQUFDLEFBQU8sQUFBQyxTQUFDLEFBQUM7QUFDbkIsQUFBTSxtQkFBQyxBQUFJLEtBQUMsQUFBSSxLQUFDLEFBQUksQUFBQyxBQUFDLEFBQ3pCO0FBQUMsQUFDSDtBQUFDO0FBRVMsb0JBQU0sU0FBaEIsVUFBaUIsQUFBMkI7QUFDMUMsWUFBTSxBQUFRLFdBQUcsa0JBQWMsZUFBQyxBQUFVLFdBQUMsQUFBRSxBQUFDLEFBQUM7QUFDL0MsQUFBRSxBQUFDLFlBQUMsQ0FBQyxBQUFRLEFBQUMsVUFBQyxBQUFDO0FBQ2Qsa0JBQU0sSUFBSSxBQUFLLE1BQUMsQUFBMkIsOEJBQUcsQUFBVSxXQUFDLEFBQUUsQUFBQyxBQUFDLEFBQy9EO0FBQUM7QUFDRCxBQUFNLGVBQUMsQUFBUSxTQUFDLEFBQUksTUFBRSxBQUFVLEFBQUMsQUFBQyxBQUNwQztBQUFDO0FBck1rQixBQUFLLHdCQUR6QixPQUFPLFVBQ2EsQUFBSyxBQXNNekI7QUFBRCxXQUFDO0FBdE1ELEFBc01DO2tCQXRNb0IsQUFBSyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIHZhbGlkLWpzZG9jICovXHJcbmltcG9ydCB7IGlzQXJyYXksIERpY3QgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xyXG5pbXBvcnQge1xyXG4gIGV2ZW50ZWQsIEV2ZW50ZWRcclxufSBmcm9tICdAb3JiaXQvY29yZSc7XHJcbmltcG9ydCB7XHJcbiAgUmVjb3JkLFxyXG4gIFJlY29yZElkZW50aXR5LFxyXG4gIEtleU1hcCxcclxuICBPcGVyYXRpb24sXHJcbiAgUmVjb3JkT3BlcmF0aW9uLFxyXG4gIFF1ZXJ5LFxyXG4gIFF1ZXJ5T3JFeHByZXNzaW9uLFxyXG4gIFF1ZXJ5RXhwcmVzc2lvbixcclxuICBRdWVyeUJ1aWxkZXIsXHJcbiAgU2NoZW1hLFxyXG4gIFRyYW5zZm9ybUJ1aWxkZXIsXHJcbiAgVHJhbnNmb3JtQnVpbGRlckZ1bmMsXHJcbiAgYnVpbGRRdWVyeVxyXG59IGZyb20gJ0BvcmJpdC9kYXRhJztcclxuaW1wb3J0IHsgT3BlcmF0aW9uUHJvY2Vzc29yLCBPcGVyYXRpb25Qcm9jZXNzb3JDbGFzcyB9IGZyb20gJy4vY2FjaGUvb3BlcmF0aW9uLXByb2Nlc3NvcnMvb3BlcmF0aW9uLXByb2Nlc3Nvcic7XHJcbmltcG9ydCBDYWNoZUludGVncml0eVByb2Nlc3NvciBmcm9tICcuL2NhY2hlL29wZXJhdGlvbi1wcm9jZXNzb3JzL2NhY2hlLWludGVncml0eS1wcm9jZXNzb3InO1xyXG5pbXBvcnQgU2NoZW1hQ29uc2lzdGVuY3lQcm9jZXNzb3IgZnJvbSAnLi9jYWNoZS9vcGVyYXRpb24tcHJvY2Vzc29ycy9zY2hlbWEtY29uc2lzdGVuY3ktcHJvY2Vzc29yJztcclxuaW1wb3J0IHsgUXVlcnlPcGVyYXRvcnMgfSBmcm9tICcuL2NhY2hlL3F1ZXJ5LW9wZXJhdG9ycyc7XHJcbmltcG9ydCBQYXRjaFRyYW5zZm9ybXMsIHsgUGF0Y2hUcmFuc2Zvcm1GdW5jIH0gZnJvbSAnLi9jYWNoZS9wYXRjaC10cmFuc2Zvcm1zJztcclxuaW1wb3J0IEludmVyc2VUcmFuc2Zvcm1zLCB7IEludmVyc2VUcmFuc2Zvcm1GdW5jIH0gZnJvbSAnLi9jYWNoZS9pbnZlcnNlLXRyYW5zZm9ybXMnO1xyXG5pbXBvcnQgeyBJbW11dGFibGVNYXAgfSBmcm9tICdAb3JiaXQvaW1tdXRhYmxlJztcclxuaW1wb3J0IFJlbGF0aW9uc2hpcEFjY2Vzc29yIGZyb20gJy4vY2FjaGUvcmVsYXRpb25zaGlwLWFjY2Vzc29yJztcclxuaW1wb3J0IEludmVyc2VSZWxhdGlvbnNoaXBBY2Nlc3NvciBmcm9tICcuL2NhY2hlL2ludmVyc2UtcmVsYXRpb25zaGlwLWFjY2Vzc29yJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQ2FjaGVTZXR0aW5ncyB7XHJcbiAgc2NoZW1hPzogU2NoZW1hO1xyXG4gIGtleU1hcD86IEtleU1hcDtcclxuICBwcm9jZXNzb3JzPzogT3BlcmF0aW9uUHJvY2Vzc29yQ2xhc3NbXTtcclxuICBiYXNlPzogQ2FjaGU7XHJcbiAgcXVlcnlCdWlsZGVyPzogUXVlcnlCdWlsZGVyO1xyXG4gIHRyYW5zZm9ybUJ1aWxkZXI/OiBUcmFuc2Zvcm1CdWlsZGVyO1xyXG59XHJcblxyXG5leHBvcnQgdHlwZSBQYXRjaFJlc3VsdERhdGEgPSBSZWNvcmQgfCBSZWNvcmRJZGVudGl0eSB8IG51bGw7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFBhdGNoUmVzdWx0IHtcclxuICBpbnZlcnNlOiBSZWNvcmRPcGVyYXRpb25bXSxcclxuICBkYXRhOiBQYXRjaFJlc3VsdERhdGFbXVxyXG59XHJcblxyXG4vKipcclxuICogQSBgQ2FjaGVgIGlzIGFuIGluLW1lbW9yeSBkYXRhIHN0b3JlIHRoYXQgY2FuIGJlIGFjY2Vzc2VkIHN5bmNocm9ub3VzbHkuXHJcbiAqXHJcbiAqIENhY2hlcyB1c2Ugb3BlcmF0aW9uIHByb2Nlc3NvcnMgdG8gbWFpbnRhaW4gaW50ZXJuYWwgY29uc2lzdGVuY3kuXHJcbiAqXHJcbiAqIEJlY2F1c2UgZGF0YSBpcyBzdG9yZWQgaW4gaW1tdXRhYmxlIG1hcHMsIGNhY2hlcyBjYW4gYmUgZm9ya2VkIGVmZmljaWVudGx5LlxyXG4gKlxyXG4gKiBAZXhwb3J0XHJcbiAqIEBjbGFzcyBDYWNoZVxyXG4gKiBAaW1wbGVtZW50cyB7RXZlbnRlZH1cclxuICovXHJcbkBldmVudGVkXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENhY2hlIGltcGxlbWVudHMgRXZlbnRlZCB7XHJcbiAgcHJpdmF0ZSBfa2V5TWFwOiBLZXlNYXA7XHJcbiAgcHJpdmF0ZSBfc2NoZW1hOiBTY2hlbWE7XHJcbiAgcHJpdmF0ZSBfcXVlcnlCdWlsZGVyOiBRdWVyeUJ1aWxkZXI7XHJcbiAgcHJpdmF0ZSBfdHJhbnNmb3JtQnVpbGRlcjogVHJhbnNmb3JtQnVpbGRlcjtcclxuICBwcml2YXRlIF9wcm9jZXNzb3JzOiBPcGVyYXRpb25Qcm9jZXNzb3JbXTtcclxuICBwcml2YXRlIF9yZWNvcmRzOiBEaWN0PEltbXV0YWJsZU1hcDxzdHJpbmcsIFJlY29yZD4+O1xyXG4gIHByaXZhdGUgX3JlbGF0aW9uc2hpcHM6IFJlbGF0aW9uc2hpcEFjY2Vzc29yO1xyXG4gIHByaXZhdGUgX2ludmVyc2VSZWxhdGlvbnNoaXBzOiBJbnZlcnNlUmVsYXRpb25zaGlwQWNjZXNzb3I7XHJcblxyXG4gIC8vIEV2ZW50ZWQgaW50ZXJmYWNlIHN0dWJzXHJcbiAgb246IChldmVudDogc3RyaW5nLCBjYWxsYmFjazogRnVuY3Rpb24sIGJpbmRpbmc/OiBvYmplY3QpID0+IHZvaWQ7XHJcbiAgb2ZmOiAoZXZlbnQ6IHN0cmluZywgY2FsbGJhY2s6IEZ1bmN0aW9uLCBiaW5kaW5nPzogb2JqZWN0KSA9PiB2b2lkO1xyXG4gIG9uZTogKGV2ZW50OiBzdHJpbmcsIGNhbGxiYWNrOiBGdW5jdGlvbiwgYmluZGluZz86IG9iamVjdCkgPT4gdm9pZDtcclxuICBlbWl0OiAoZXZlbnQ6IHN0cmluZywgLi4uYXJncykgPT4gdm9pZDtcclxuICBsaXN0ZW5lcnM6IChldmVudDogc3RyaW5nKSA9PiBhbnlbXTtcclxuXHJcbiAgY29uc3RydWN0b3Ioc2V0dGluZ3M6IENhY2hlU2V0dGluZ3MgPSB7fSkge1xyXG4gICAgdGhpcy5fc2NoZW1hID0gc2V0dGluZ3Muc2NoZW1hO1xyXG4gICAgdGhpcy5fa2V5TWFwID0gc2V0dGluZ3Mua2V5TWFwO1xyXG5cclxuICAgIHRoaXMuX3F1ZXJ5QnVpbGRlciA9IHNldHRpbmdzLnF1ZXJ5QnVpbGRlciB8fCBuZXcgUXVlcnlCdWlsZGVyKCk7XHJcbiAgICB0aGlzLl90cmFuc2Zvcm1CdWlsZGVyID0gc2V0dGluZ3MudHJhbnNmb3JtQnVpbGRlciB8fCBuZXcgVHJhbnNmb3JtQnVpbGRlcih7XHJcbiAgICAgIHJlY29yZEluaXRpYWxpemVyOiB0aGlzLl9zY2hlbWFcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IHByb2Nlc3NvcnM6IE9wZXJhdGlvblByb2Nlc3NvckNsYXNzW10gPSBzZXR0aW5ncy5wcm9jZXNzb3JzID8gc2V0dGluZ3MucHJvY2Vzc29ycyA6IFtTY2hlbWFDb25zaXN0ZW5jeVByb2Nlc3NvciwgQ2FjaGVJbnRlZ3JpdHlQcm9jZXNzb3JdO1xyXG4gICAgdGhpcy5fcHJvY2Vzc29ycyA9IHByb2Nlc3NvcnMubWFwKFByb2Nlc3NvciA9PiBuZXcgUHJvY2Vzc29yKHRoaXMpKTtcclxuXHJcbiAgICB0aGlzLnJlc2V0KHNldHRpbmdzLmJhc2UpO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGtleU1hcCgpOiBLZXlNYXAge1xyXG4gICAgcmV0dXJuIHRoaXMuX2tleU1hcDtcclxuICB9XHJcblxyXG4gIGdldCBzY2hlbWEoKTogU2NoZW1hIHtcclxuICAgIHJldHVybiB0aGlzLl9zY2hlbWE7XHJcbiAgfVxyXG5cclxuICBnZXQgcXVlcnlCdWlsZGVyKCk6IFF1ZXJ5QnVpbGRlciB7XHJcbiAgICByZXR1cm4gdGhpcy5fcXVlcnlCdWlsZGVyO1xyXG4gIH1cclxuXHJcbiAgZ2V0IHRyYW5zZm9ybUJ1aWxkZXIoKTogVHJhbnNmb3JtQnVpbGRlciB7XHJcbiAgICByZXR1cm4gdGhpcy5fdHJhbnNmb3JtQnVpbGRlcjtcclxuICB9XHJcblxyXG4gIHJlY29yZHModHlwZTogc3RyaW5nKTogSW1tdXRhYmxlTWFwPHN0cmluZywgUmVjb3JkPiB7XHJcbiAgICByZXR1cm4gdGhpcy5fcmVjb3Jkc1t0eXBlXTtcclxuICB9XHJcblxyXG4gIGdldCByZWxhdGlvbnNoaXBzKCk6IFJlbGF0aW9uc2hpcEFjY2Vzc29yIHtcclxuICAgIHJldHVybiB0aGlzLl9yZWxhdGlvbnNoaXBzO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGludmVyc2VSZWxhdGlvbnNoaXBzKCk6IEludmVyc2VSZWxhdGlvbnNoaXBBY2Nlc3NvciB7XHJcbiAgICByZXR1cm4gdGhpcy5faW52ZXJzZVJlbGF0aW9uc2hpcHM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgQWxsb3dzIGEgY2xpZW50IHRvIHJ1biBxdWVyaWVzIGFnYWluc3QgdGhlIGNhY2hlLlxyXG5cclxuICAgQGV4YW1wbGVcclxuICAgYGBgIGphdmFzY3JpcHRcclxuICAgLy8gdXNpbmcgYSBxdWVyeSBidWlsZGVyIGNhbGxiYWNrXHJcbiAgIGNhY2hlLnF1ZXJ5KHFiLnJlY29yZCgncGxhbmV0JywgJ2lkYWJjMTIzJykpLnRoZW4ocmVzdWx0cyA9PiB7fSk7XHJcbiAgIGBgYFxyXG5cclxuICAgQGV4YW1wbGVcclxuICAgYGBgIGphdmFzY3JpcHRcclxuICAgLy8gdXNpbmcgYW4gZXhwcmVzc2lvblxyXG4gICBjYWNoZS5xdWVyeShvcWUoJ3JlY29yZCcsICdwbGFuZXQnLCAnaWRhYmMxMjMnKSkudGhlbihyZXN1bHRzID0+IHt9KTtcclxuICAgYGBgXHJcblxyXG4gICBAbWV0aG9kIHF1ZXJ5XHJcbiAgIEBwYXJhbSB7RXhwcmVzc2lvbn0gcXVlcnlcclxuICAgQHJldHVybiB7T2JqZWN0fSByZXN1bHQgb2YgcXVlcnkgKHR5cGUgZGVwZW5kcyBvbiBxdWVyeSlcclxuICAgKi9cclxuICBxdWVyeShxdWVyeU9yRXhwcmVzc2lvbjogUXVlcnlPckV4cHJlc3Npb24sIG9wdGlvbnM/OiBvYmplY3QsIGlkPzogc3RyaW5nKTogYW55IHtcclxuICAgIGNvbnN0IHF1ZXJ5ID0gYnVpbGRRdWVyeShxdWVyeU9yRXhwcmVzc2lvbiwgb3B0aW9ucywgaWQsIHRoaXMuX3F1ZXJ5QnVpbGRlcik7XHJcbiAgICByZXR1cm4gdGhpcy5fcXVlcnkocXVlcnkuZXhwcmVzc2lvbik7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXNldHMgdGhlIGNhY2hlJ3Mgc3RhdGUgdG8gYmUgZWl0aGVyIGVtcHR5IG9yIHRvIG1hdGNoIHRoZSBzdGF0ZSBvZlxyXG4gICAqIGFub3RoZXIgY2FjaGUuXHJcbiAgICpcclxuICAgKiBAZXhhbXBsZVxyXG4gICAqIGBgYCBqYXZhc2NyaXB0XHJcbiAgICogY2FjaGUucmVzZXQoKTsgLy8gZW1wdGllcyBjYWNoZVxyXG4gICAqIGNhY2hlLnJlc2V0KGNhY2hlMik7IC8vIGNsb25lcyB0aGUgc3RhdGUgb2YgY2FjaGUyXHJcbiAgICogYGBgXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge0NhY2hlfSBbYmFzZV1cclxuICAgKiBAbWVtYmVyb2YgQ2FjaGVcclxuICAgKi9cclxuICByZXNldChiYXNlPzogQ2FjaGUpIHtcclxuICAgIHRoaXMuX3JlY29yZHMgPSB7fTtcclxuXHJcbiAgICBPYmplY3Qua2V5cyh0aGlzLl9zY2hlbWEubW9kZWxzKS5mb3JFYWNoKHR5cGUgPT4ge1xyXG4gICAgICBsZXQgYmFzZVJlY29yZHMgPSBiYXNlICYmIGJhc2UucmVjb3Jkcyh0eXBlKTtcclxuXHJcbiAgICAgIHRoaXMuX3JlY29yZHNbdHlwZV0gPSBuZXcgSW1tdXRhYmxlTWFwPHN0cmluZywgUmVjb3JkPihiYXNlUmVjb3Jkcyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLl9yZWxhdGlvbnNoaXBzID0gbmV3IFJlbGF0aW9uc2hpcEFjY2Vzc29yKHRoaXMsIGJhc2UgJiYgYmFzZS5yZWxhdGlvbnNoaXBzKTtcclxuICAgIHRoaXMuX2ludmVyc2VSZWxhdGlvbnNoaXBzID0gbmV3IEludmVyc2VSZWxhdGlvbnNoaXBBY2Nlc3Nvcih0aGlzLCBiYXNlICYmIGJhc2UuaW52ZXJzZVJlbGF0aW9uc2hpcHMpO1xyXG5cclxuICAgIHRoaXMuX3Byb2Nlc3NvcnMuZm9yRWFjaChwcm9jZXNzb3IgPT4gcHJvY2Vzc29yLnJlc2V0KGJhc2UpKTtcclxuXHJcbiAgICB0aGlzLmVtaXQoJ3Jlc2V0Jyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBQYXRjaGVzIHRoZSBkb2N1bWVudCB3aXRoIGFuIG9wZXJhdGlvbi5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7KE9wZXJhdGlvbiB8IE9wZXJhdGlvbltdIHwgVHJhbnNmb3JtQnVpbGRlckZ1bmMpfSBvcGVyYXRpb25Pck9wZXJhdGlvbnNcclxuICAgKiBAcmV0dXJucyB7T3BlcmF0aW9uW119XHJcbiAgICogQG1lbWJlcm9mIENhY2hlXHJcbiAgICovXHJcbiAgcGF0Y2gob3BlcmF0aW9uT3JPcGVyYXRpb25zOiBSZWNvcmRPcGVyYXRpb24gfCBSZWNvcmRPcGVyYXRpb25bXSB8IFRyYW5zZm9ybUJ1aWxkZXJGdW5jKTogUGF0Y2hSZXN1bHQge1xyXG4gICAgaWYgKHR5cGVvZiBvcGVyYXRpb25Pck9wZXJhdGlvbnMgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgb3BlcmF0aW9uT3JPcGVyYXRpb25zID0gPFJlY29yZE9wZXJhdGlvbiB8IFJlY29yZE9wZXJhdGlvbltdPm9wZXJhdGlvbk9yT3BlcmF0aW9ucyh0aGlzLl90cmFuc2Zvcm1CdWlsZGVyKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCByZXN1bHQ6IFBhdGNoUmVzdWx0ID0ge1xyXG4gICAgICBpbnZlcnNlOiBbXSxcclxuICAgICAgZGF0YTogW11cclxuICAgIH1cclxuXHJcbiAgICBpZiAoaXNBcnJheShvcGVyYXRpb25Pck9wZXJhdGlvbnMpKSB7XHJcbiAgICAgIHRoaXMuX2FwcGx5T3BlcmF0aW9ucyg8UmVjb3JkT3BlcmF0aW9uW10+b3BlcmF0aW9uT3JPcGVyYXRpb25zLCByZXN1bHQsIHRydWUpO1xyXG5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuX2FwcGx5T3BlcmF0aW9uKDxSZWNvcmRPcGVyYXRpb24+b3BlcmF0aW9uT3JPcGVyYXRpb25zLCByZXN1bHQsIHRydWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gIC8vIFByb3RlY3RlZCBtZXRob2RzXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgcHJvdGVjdGVkIF9hcHBseU9wZXJhdGlvbnMob3BzOiBSZWNvcmRPcGVyYXRpb25bXSwgcmVzdWx0OiBQYXRjaFJlc3VsdCwgcHJpbWFyeTogYm9vbGVhbiA9IGZhbHNlKSB7XHJcbiAgICBvcHMuZm9yRWFjaChvcCA9PiB0aGlzLl9hcHBseU9wZXJhdGlvbihvcCwgcmVzdWx0LCBwcmltYXJ5KSk7XHJcbiAgfVxyXG5cclxuICBwcm90ZWN0ZWQgX2FwcGx5T3BlcmF0aW9uKG9wZXJhdGlvbjogUmVjb3JkT3BlcmF0aW9uLCByZXN1bHQ6IFBhdGNoUmVzdWx0LCBwcmltYXJ5OiBib29sZWFuID0gZmFsc2UpIHtcclxuICAgIGNvbnN0IGludmVyc2VUcmFuc2Zvcm06IEludmVyc2VUcmFuc2Zvcm1GdW5jID0gSW52ZXJzZVRyYW5zZm9ybXNbIG9wZXJhdGlvbi5vcCBdO1xyXG4gICAgY29uc3QgaW52ZXJzZU9wOiBSZWNvcmRPcGVyYXRpb24gPSBpbnZlcnNlVHJhbnNmb3JtKHRoaXMsIG9wZXJhdGlvbik7XHJcblxyXG4gICAgaWYgKGludmVyc2VPcCkge1xyXG4gICAgICByZXN1bHQuaW52ZXJzZS51bnNoaWZ0KGludmVyc2VPcCk7XHJcblxyXG4gICAgICAvLyBRdWVyeSBhbmQgcGVyZm9ybSByZWxhdGVkIGBiZWZvcmVgIG9wZXJhdGlvbnNcclxuICAgICAgdGhpcy5fcHJvY2Vzc29yc1xyXG4gICAgICAgICAgLm1hcChwcm9jZXNzb3IgPT4gcHJvY2Vzc29yLmJlZm9yZShvcGVyYXRpb24pKVxyXG4gICAgICAgICAgLmZvckVhY2gob3BzID0+IHRoaXMuX2FwcGx5T3BlcmF0aW9ucyhvcHMsIHJlc3VsdCkpO1xyXG5cclxuICAgICAgLy8gUXVlcnkgcmVsYXRlZCBgYWZ0ZXJgIG9wZXJhdGlvbnMgYmVmb3JlIHBlcmZvcm1pbmdcclxuICAgICAgLy8gdGhlIHJlcXVlc3RlZCBvcGVyYXRpb24uIFRoZXNlIHdpbGwgYmUgYXBwbGllZCBvbiBzdWNjZXNzLlxyXG4gICAgICBsZXQgcHJlcGFyZWRPcHMgPSB0aGlzLl9wcm9jZXNzb3JzLm1hcChwcm9jZXNzb3IgPT4gcHJvY2Vzc29yLmFmdGVyKG9wZXJhdGlvbikpO1xyXG5cclxuICAgICAgLy8gUGVyZm9ybSB0aGUgcmVxdWVzdGVkIG9wZXJhdGlvblxyXG4gICAgICBsZXQgcGF0Y2hUcmFuc2Zvcm06IFBhdGNoVHJhbnNmb3JtRnVuYyA9IFBhdGNoVHJhbnNmb3Jtc1sgb3BlcmF0aW9uLm9wIF07XHJcbiAgICAgIGxldCBkYXRhOiBQYXRjaFJlc3VsdERhdGEgPSBwYXRjaFRyYW5zZm9ybSh0aGlzLCBvcGVyYXRpb24pO1xyXG4gICAgICBpZiAocHJpbWFyeSkge1xyXG4gICAgICAgIHJlc3VsdC5kYXRhLnB1c2goZGF0YSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFF1ZXJ5IGFuZCBwZXJmb3JtIHJlbGF0ZWQgYGltbWVkaWF0ZWAgb3BlcmF0aW9uc1xyXG4gICAgICB0aGlzLl9wcm9jZXNzb3JzXHJcbiAgICAgICAgICAuZm9yRWFjaChwcm9jZXNzb3IgPT4gcHJvY2Vzc29yLmltbWVkaWF0ZShvcGVyYXRpb24pKTtcclxuXHJcbiAgICAgIC8vIEVtaXQgZXZlbnRcclxuICAgICAgdGhpcy5lbWl0KCdwYXRjaCcsIG9wZXJhdGlvbiwgZGF0YSk7XHJcblxyXG4gICAgICAvLyBQZXJmb3JtIHByZXBhcmVkIG9wZXJhdGlvbnMgYWZ0ZXIgcGVyZm9ybWluZyB0aGUgcmVxdWVzdGVkIG9wZXJhdGlvblxyXG4gICAgICBwcmVwYXJlZE9wcy5mb3JFYWNoKG9wcyA9PiB0aGlzLl9hcHBseU9wZXJhdGlvbnMob3BzLCByZXN1bHQpKTtcclxuXHJcbiAgICAgIC8vIFF1ZXJ5IGFuZCBwZXJmb3JtIHJlbGF0ZWQgYGZpbmFsbHlgIG9wZXJhdGlvbnNcclxuICAgICAgdGhpcy5fcHJvY2Vzc29yc1xyXG4gICAgICAgICAgLm1hcChwcm9jZXNzb3IgPT4gcHJvY2Vzc29yLmZpbmFsbHkob3BlcmF0aW9uKSlcclxuICAgICAgICAgIC5mb3JFYWNoKG9wcyA9PiB0aGlzLl9hcHBseU9wZXJhdGlvbnMob3BzLCByZXN1bHQpKTtcclxuICAgIH0gZWxzZSBpZiAocHJpbWFyeSkge1xyXG4gICAgICByZXN1bHQuZGF0YS5wdXNoKG51bGwpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJvdGVjdGVkIF9xdWVyeShleHByZXNzaW9uOiBRdWVyeUV4cHJlc3Npb24pOiBhbnkge1xyXG4gICAgY29uc3Qgb3BlcmF0b3IgPSBRdWVyeU9wZXJhdG9yc1tleHByZXNzaW9uLm9wXTtcclxuICAgIGlmICghb3BlcmF0b3IpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gZmluZCBvcGVyYXRvcjogJyArIGV4cHJlc3Npb24ub3ApO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG9wZXJhdG9yKHRoaXMsIGV4cHJlc3Npb24pO1xyXG4gIH1cclxufVxyXG4iXX0=