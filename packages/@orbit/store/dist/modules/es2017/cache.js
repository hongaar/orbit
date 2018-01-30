"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable valid-jsdoc */
var utils_1 = require("@orbit/utils");
var core_1 = require("@orbit/core");
var data_1 = require("@orbit/data");
var cache_integrity_processor_1 = require("./cache/operation-processors/cache-integrity-processor");
var schema_consistency_processor_1 = require("./cache/operation-processors/schema-consistency-processor");
var schema_validation_processor_1 = require("./cache/operation-processors/schema-validation-processor");
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
var Cache = (function () {
    function Cache(settings) {
        if (settings === void 0) { settings = {}; }
        var _this = this;
        this._schema = settings.schema;
        this._keyMap = settings.keyMap;
        this._queryBuilder = settings.queryBuilder || new data_1.QueryBuilder();
        this._transformBuilder = settings.transformBuilder || new data_1.TransformBuilder({
            recordInitializer: this._schema
        });
        var processors = settings.processors ? settings.processors : [schema_validation_processor_1.default, schema_consistency_processor_1.default, cache_integrity_processor_1.default];
        this._processors = processors.map(function (Processor) { return new Processor(_this); });
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
        this._processors.forEach(function (processor) { return processor.reset(base); });
        this.emit('reset');
    };
    /**
     * Upgrade the cache based on the current state of the schema.
     *
     * @memberof Cache
     */
    Cache.prototype.upgrade = function () {
        var _this = this;
        Object.keys(this._schema.models).forEach(function (type) {
            if (!_this._records[type]) {
                _this._records[type] = new immutable_1.ImmutableMap();
            }
        });
        this._relationships.upgrade();
        this._inverseRelationships.upgrade();
        this._processors.forEach(function (processor) { return processor.upgrade(); });
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
        }
        else {
            this._applyOperation(operationOrOperations, result, true);
        }
        result.inverse.reverse();
        return result;
    };
    /////////////////////////////////////////////////////////////////////////////
    // Protected methods
    /////////////////////////////////////////////////////////////////////////////
    Cache.prototype._applyOperations = function (ops, result, primary) {
        var _this = this;
        if (primary === void 0) { primary = false; }
        ops.forEach(function (op) { return _this._applyOperation(op, result, primary); });
    };
    Cache.prototype._applyOperation = function (operation, result, primary) {
        var _this = this;
        if (primary === void 0) { primary = false; }
        this._processors.forEach(function (processor) { return processor.validate(operation); });
        var inverseTransform = inverse_transforms_1.default[operation.op];
        var inverseOp = inverseTransform(this, operation);
        if (inverseOp) {
            result.inverse.push(inverseOp);
            // Query and perform related `before` operations
            this._processors
                .map(function (processor) { return processor.before(operation); })
                .forEach(function (ops) { return _this._applyOperations(ops, result); });
            // Query related `after` operations before performing
            // the requested operation. These will be applied on success.
            var preparedOps = this._processors.map(function (processor) { return processor.after(operation); });
            // Perform the requested operation
            var patchTransform = patch_transforms_1.default[operation.op];
            var data = patchTransform(this, operation);
            if (primary) {
                result.data.push(data);
            }
            // Query and perform related `immediate` operations
            this._processors
                .forEach(function (processor) { return processor.immediate(operation); });
            // Emit event
            this.emit('patch', operation, data);
            // Perform prepared operations after performing the requested operation
            preparedOps.forEach(function (ops) { return _this._applyOperations(ops, result); });
            // Query and perform related `finally` operations
            this._processors
                .map(function (processor) { return processor.finally(operation); })
                .forEach(function (ops) { return _this._applyOperations(ops, result); });
        }
        else if (primary) {
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
    Cache = __decorate([
        core_1.evented
    ], Cache);
    return Cache;
}());
exports.default = Cache;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FjaGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzcmMvY2FjaGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxnQ0FBZ0M7QUFDaEMsc0NBQTZDO0FBQzdDLG9DQUVxQjtBQUNyQixvQ0FjcUI7QUFFckIsb0dBQTZGO0FBQzdGLDBHQUFtRztBQUNuRyx3R0FBaUc7QUFDakcsMkRBQXlEO0FBQ3pELDZEQUErRTtBQUMvRSxpRUFBcUY7QUFDckYsOENBQWdEO0FBQ2hELHVFQUFpRTtBQUNqRSx1RkFBZ0Y7QUFrQmhGOzs7Ozs7Ozs7O0dBVUc7QUFFSDtJQWlCRSxlQUFZLFFBQTRCO1FBQTVCLHlCQUFBLEVBQUEsYUFBNEI7UUFBeEMsaUJBYUM7UUFaQyxJQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUM7UUFDL0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDO1FBRS9CLElBQUksQ0FBQyxhQUFhLEdBQUcsUUFBUSxDQUFDLFlBQVksSUFBSSxJQUFJLG1CQUFZLEVBQUUsQ0FBQztRQUNqRSxJQUFJLENBQUMsaUJBQWlCLEdBQUcsUUFBUSxDQUFDLGdCQUFnQixJQUFJLElBQUksdUJBQWdCLENBQUM7WUFDekUsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLE9BQU87U0FDaEMsQ0FBQyxDQUFDO1FBRUgsSUFBTSxVQUFVLEdBQThCLFFBQVEsQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDLFVBQVUsR0FBRyxDQUFDLHFDQUF5QixFQUFFLHNDQUEwQixFQUFFLG1DQUF1QixDQUFDLENBQUM7UUFDM0ssSUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLFVBQUEsU0FBUyxJQUFJLE9BQUEsSUFBSSxTQUFTLENBQUMsS0FBSSxDQUFDLEVBQW5CLENBQW1CLENBQUMsQ0FBQztRQUVwRSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM1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QUFDO1FBQy9DLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNkLE1BQU0sSUFBSSxLQUFLLENBQUMsMkJBQTJCLEdBQUcsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQy9ELENBQUM7UUFDRCxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBMU5rQixLQUFLO1FBRHpCLGNBQU87T0FDYSxLQUFLLENBMk56QjtJQUFELFlBQUM7Q0FBQSxBQTNORCxJQTJOQztrQkEzTm9CLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSB2YWxpZC1qc2RvYyAqL1xyXG5pbXBvcnQgeyBpc0FycmF5LCBEaWN0IH0gZnJvbSAnQG9yYml0L3V0aWxzJztcclxuaW1wb3J0IHtcclxuICBldmVudGVkLCBFdmVudGVkXHJcbn0gZnJvbSAnQG9yYml0L2NvcmUnO1xyXG5pbXBvcnQge1xyXG4gIFJlY29yZCxcclxuICBSZWNvcmRJZGVudGl0eSxcclxuICBLZXlNYXAsXHJcbiAgT3BlcmF0aW9uLFxyXG4gIFJlY29yZE9wZXJhdGlvbixcclxuICBRdWVyeSxcclxuICBRdWVyeU9yRXhwcmVzc2lvbixcclxuICBRdWVyeUV4cHJlc3Npb24sXHJcbiAgUXVlcnlCdWlsZGVyLFxyXG4gIFNjaGVtYSxcclxuICBUcmFuc2Zvcm1CdWlsZGVyLFxyXG4gIFRyYW5zZm9ybUJ1aWxkZXJGdW5jLFxyXG4gIGJ1aWxkUXVlcnlcclxufSBmcm9tICdAb3JiaXQvZGF0YSc7XHJcbmltcG9ydCB7IE9wZXJhdGlvblByb2Nlc3NvciwgT3BlcmF0aW9uUHJvY2Vzc29yQ2xhc3MgfSBmcm9tICcuL2NhY2hlL29wZXJhdGlvbi1wcm9jZXNzb3JzL29wZXJhdGlvbi1wcm9jZXNzb3InO1xyXG5pbXBvcnQgQ2FjaGVJbnRlZ3JpdHlQcm9jZXNzb3IgZnJvbSAnLi9jYWNoZS9vcGVyYXRpb24tcHJvY2Vzc29ycy9jYWNoZS1pbnRlZ3JpdHktcHJvY2Vzc29yJztcclxuaW1wb3J0IFNjaGVtYUNvbnNpc3RlbmN5UHJvY2Vzc29yIGZyb20gJy4vY2FjaGUvb3BlcmF0aW9uLXByb2Nlc3NvcnMvc2NoZW1hLWNvbnNpc3RlbmN5LXByb2Nlc3Nvcic7XHJcbmltcG9ydCBTY2hlbWFWYWxpZGF0aW9uUHJvY2Vzc29yIGZyb20gJy4vY2FjaGUvb3BlcmF0aW9uLXByb2Nlc3NvcnMvc2NoZW1hLXZhbGlkYXRpb24tcHJvY2Vzc29yJztcclxuaW1wb3J0IHsgUXVlcnlPcGVyYXRvcnMgfSBmcm9tICcuL2NhY2hlL3F1ZXJ5LW9wZXJhdG9ycyc7XHJcbmltcG9ydCBQYXRjaFRyYW5zZm9ybXMsIHsgUGF0Y2hUcmFuc2Zvcm1GdW5jIH0gZnJvbSAnLi9jYWNoZS9wYXRjaC10cmFuc2Zvcm1zJztcclxuaW1wb3J0IEludmVyc2VUcmFuc2Zvcm1zLCB7IEludmVyc2VUcmFuc2Zvcm1GdW5jIH0gZnJvbSAnLi9jYWNoZS9pbnZlcnNlLXRyYW5zZm9ybXMnO1xyXG5pbXBvcnQgeyBJbW11dGFibGVNYXAgfSBmcm9tICdAb3JiaXQvaW1tdXRhYmxlJztcclxuaW1wb3J0IFJlbGF0aW9uc2hpcEFjY2Vzc29yIGZyb20gJy4vY2FjaGUvcmVsYXRpb25zaGlwLWFjY2Vzc29yJztcclxuaW1wb3J0IEludmVyc2VSZWxhdGlvbnNoaXBBY2Nlc3NvciBmcm9tICcuL2NhY2hlL2ludmVyc2UtcmVsYXRpb25zaGlwLWFjY2Vzc29yJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQ2FjaGVTZXR0aW5ncyB7XHJcbiAgc2NoZW1hPzogU2NoZW1hO1xyXG4gIGtleU1hcD86IEtleU1hcDtcclxuICBwcm9jZXNzb3JzPzogT3BlcmF0aW9uUHJvY2Vzc29yQ2xhc3NbXTtcclxuICBiYXNlPzogQ2FjaGU7XHJcbiAgcXVlcnlCdWlsZGVyPzogUXVlcnlCdWlsZGVyO1xyXG4gIHRyYW5zZm9ybUJ1aWxkZXI/OiBUcmFuc2Zvcm1CdWlsZGVyO1xyXG59XHJcblxyXG5leHBvcnQgdHlwZSBQYXRjaFJlc3VsdERhdGEgPSBSZWNvcmQgfCBSZWNvcmRJZGVudGl0eSB8IG51bGw7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFBhdGNoUmVzdWx0IHtcclxuICBpbnZlcnNlOiBSZWNvcmRPcGVyYXRpb25bXSxcclxuICBkYXRhOiBQYXRjaFJlc3VsdERhdGFbXVxyXG59XHJcblxyXG4vKipcclxuICogQSBgQ2FjaGVgIGlzIGFuIGluLW1lbW9yeSBkYXRhIHN0b3JlIHRoYXQgY2FuIGJlIGFjY2Vzc2VkIHN5bmNocm9ub3VzbHkuXHJcbiAqXHJcbiAqIENhY2hlcyB1c2Ugb3BlcmF0aW9uIHByb2Nlc3NvcnMgdG8gbWFpbnRhaW4gaW50ZXJuYWwgY29uc2lzdGVuY3kuXHJcbiAqXHJcbiAqIEJlY2F1c2UgZGF0YSBpcyBzdG9yZWQgaW4gaW1tdXRhYmxlIG1hcHMsIGNhY2hlcyBjYW4gYmUgZm9ya2VkIGVmZmljaWVudGx5LlxyXG4gKlxyXG4gKiBAZXhwb3J0XHJcbiAqIEBjbGFzcyBDYWNoZVxyXG4gKiBAaW1wbGVtZW50cyB7RXZlbnRlZH1cclxuICovXHJcbkBldmVudGVkXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENhY2hlIGltcGxlbWVudHMgRXZlbnRlZCB7XHJcbiAgcHJpdmF0ZSBfa2V5TWFwOiBLZXlNYXA7XHJcbiAgcHJpdmF0ZSBfc2NoZW1hOiBTY2hlbWE7XHJcbiAgcHJpdmF0ZSBfcXVlcnlCdWlsZGVyOiBRdWVyeUJ1aWxkZXI7XHJcbiAgcHJpdmF0ZSBfdHJhbnNmb3JtQnVpbGRlcjogVHJhbnNmb3JtQnVpbGRlcjtcclxuICBwcml2YXRlIF9wcm9jZXNzb3JzOiBPcGVyYXRpb25Qcm9jZXNzb3JbXTtcclxuICBwcml2YXRlIF9yZWNvcmRzOiBEaWN0PEltbXV0YWJsZU1hcDxzdHJpbmcsIFJlY29yZD4+O1xyXG4gIHByaXZhdGUgX3JlbGF0aW9uc2hpcHM6IFJlbGF0aW9uc2hpcEFjY2Vzc29yO1xyXG4gIHByaXZhdGUgX2ludmVyc2VSZWxhdGlvbnNoaXBzOiBJbnZlcnNlUmVsYXRpb25zaGlwQWNjZXNzb3I7XHJcblxyXG4gIC8vIEV2ZW50ZWQgaW50ZXJmYWNlIHN0dWJzXHJcbiAgb246IChldmVudDogc3RyaW5nLCBjYWxsYmFjazogRnVuY3Rpb24sIGJpbmRpbmc/OiBvYmplY3QpID0+IHZvaWQ7XHJcbiAgb2ZmOiAoZXZlbnQ6IHN0cmluZywgY2FsbGJhY2s6IEZ1bmN0aW9uLCBiaW5kaW5nPzogb2JqZWN0KSA9PiB2b2lkO1xyXG4gIG9uZTogKGV2ZW50OiBzdHJpbmcsIGNhbGxiYWNrOiBGdW5jdGlvbiwgYmluZGluZz86IG9iamVjdCkgPT4gdm9pZDtcclxuICBlbWl0OiAoZXZlbnQ6IHN0cmluZywgLi4uYXJncykgPT4gdm9pZDtcclxuICBsaXN0ZW5lcnM6IChldmVudDogc3RyaW5nKSA9PiBhbnlbXTtcclxuXHJcbiAgY29uc3RydWN0b3Ioc2V0dGluZ3M6IENhY2hlU2V0dGluZ3MgPSB7fSkge1xyXG4gICAgdGhpcy5fc2NoZW1hID0gc2V0dGluZ3Muc2NoZW1hO1xyXG4gICAgdGhpcy5fa2V5TWFwID0gc2V0dGluZ3Mua2V5TWFwO1xyXG5cclxuICAgIHRoaXMuX3F1ZXJ5QnVpbGRlciA9IHNldHRpbmdzLnF1ZXJ5QnVpbGRlciB8fCBuZXcgUXVlcnlCdWlsZGVyKCk7XHJcbiAgICB0aGlzLl90cmFuc2Zvcm1CdWlsZGVyID0gc2V0dGluZ3MudHJhbnNmb3JtQnVpbGRlciB8fCBuZXcgVHJhbnNmb3JtQnVpbGRlcih7XHJcbiAgICAgIHJlY29yZEluaXRpYWxpemVyOiB0aGlzLl9zY2hlbWFcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IHByb2Nlc3NvcnM6IE9wZXJhdGlvblByb2Nlc3NvckNsYXNzW10gPSBzZXR0aW5ncy5wcm9jZXNzb3JzID8gc2V0dGluZ3MucHJvY2Vzc29ycyA6IFtTY2hlbWFWYWxpZGF0aW9uUHJvY2Vzc29yLCBTY2hlbWFDb25zaXN0ZW5jeVByb2Nlc3NvciwgQ2FjaGVJbnRlZ3JpdHlQcm9jZXNzb3JdO1xyXG4gICAgdGhpcy5fcHJvY2Vzc29ycyA9IHByb2Nlc3NvcnMubWFwKFByb2Nlc3NvciA9PiBuZXcgUHJvY2Vzc29yKHRoaXMpKTtcclxuXHJcbiAgICB0aGlzLnJlc2V0KHNldHRpbmdzLmJhc2UpO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGtleU1hcCgpOiBLZXlNYXAge1xyXG4gICAgcmV0dXJuIHRoaXMuX2tleU1hcDtcclxuICB9XHJcblxyXG4gIGdldCBzY2hlbWEoKTogU2NoZW1hIHtcclxuICAgIHJldHVybiB0aGlzLl9zY2hlbWE7XHJcbiAgfVxyXG5cclxuICBnZXQgcXVlcnlCdWlsZGVyKCk6IFF1ZXJ5QnVpbGRlciB7XHJcbiAgICByZXR1cm4gdGhpcy5fcXVlcnlCdWlsZGVyO1xyXG4gIH1cclxuXHJcbiAgZ2V0IHRyYW5zZm9ybUJ1aWxkZXIoKTogVHJhbnNmb3JtQnVpbGRlciB7XHJcbiAgICByZXR1cm4gdGhpcy5fdHJhbnNmb3JtQnVpbGRlcjtcclxuICB9XHJcblxyXG4gIHJlY29yZHModHlwZTogc3RyaW5nKTogSW1tdXRhYmxlTWFwPHN0cmluZywgUmVjb3JkPiB7XHJcbiAgICByZXR1cm4gdGhpcy5fcmVjb3Jkc1t0eXBlXTtcclxuICB9XHJcblxyXG4gIGdldCByZWxhdGlvbnNoaXBzKCk6IFJlbGF0aW9uc2hpcEFjY2Vzc29yIHtcclxuICAgIHJldHVybiB0aGlzLl9yZWxhdGlvbnNoaXBzO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGludmVyc2VSZWxhdGlvbnNoaXBzKCk6IEludmVyc2VSZWxhdGlvbnNoaXBBY2Nlc3NvciB7XHJcbiAgICByZXR1cm4gdGhpcy5faW52ZXJzZVJlbGF0aW9uc2hpcHM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgQWxsb3dzIGEgY2xpZW50IHRvIHJ1biBxdWVyaWVzIGFnYWluc3QgdGhlIGNhY2hlLlxyXG5cclxuICAgQGV4YW1wbGVcclxuICAgYGBgIGphdmFzY3JpcHRcclxuICAgLy8gdXNpbmcgYSBxdWVyeSBidWlsZGVyIGNhbGxiYWNrXHJcbiAgIGNhY2hlLnF1ZXJ5KHFiLnJlY29yZCgncGxhbmV0JywgJ2lkYWJjMTIzJykpLnRoZW4ocmVzdWx0cyA9PiB7fSk7XHJcbiAgIGBgYFxyXG5cclxuICAgQGV4YW1wbGVcclxuICAgYGBgIGphdmFzY3JpcHRcclxuICAgLy8gdXNpbmcgYW4gZXhwcmVzc2lvblxyXG4gICBjYWNoZS5xdWVyeShvcWUoJ3JlY29yZCcsICdwbGFuZXQnLCAnaWRhYmMxMjMnKSkudGhlbihyZXN1bHRzID0+IHt9KTtcclxuICAgYGBgXHJcblxyXG4gICBAbWV0aG9kIHF1ZXJ5XHJcbiAgIEBwYXJhbSB7RXhwcmVzc2lvbn0gcXVlcnlcclxuICAgQHJldHVybiB7T2JqZWN0fSByZXN1bHQgb2YgcXVlcnkgKHR5cGUgZGVwZW5kcyBvbiBxdWVyeSlcclxuICAgKi9cclxuICBxdWVyeShxdWVyeU9yRXhwcmVzc2lvbjogUXVlcnlPckV4cHJlc3Npb24sIG9wdGlvbnM/OiBvYmplY3QsIGlkPzogc3RyaW5nKTogYW55IHtcclxuICAgIGNvbnN0IHF1ZXJ5ID0gYnVpbGRRdWVyeShxdWVyeU9yRXhwcmVzc2lvbiwgb3B0aW9ucywgaWQsIHRoaXMuX3F1ZXJ5QnVpbGRlcik7XHJcbiAgICByZXR1cm4gdGhpcy5fcXVlcnkocXVlcnkuZXhwcmVzc2lvbik7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXNldHMgdGhlIGNhY2hlJ3Mgc3RhdGUgdG8gYmUgZWl0aGVyIGVtcHR5IG9yIHRvIG1hdGNoIHRoZSBzdGF0ZSBvZlxyXG4gICAqIGFub3RoZXIgY2FjaGUuXHJcbiAgICpcclxuICAgKiBAZXhhbXBsZVxyXG4gICAqIGBgYCBqYXZhc2NyaXB0XHJcbiAgICogY2FjaGUucmVzZXQoKTsgLy8gZW1wdGllcyBjYWNoZVxyXG4gICAqIGNhY2hlLnJlc2V0KGNhY2hlMik7IC8vIGNsb25lcyB0aGUgc3RhdGUgb2YgY2FjaGUyXHJcbiAgICogYGBgXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge0NhY2hlfSBbYmFzZV1cclxuICAgKiBAbWVtYmVyb2YgQ2FjaGVcclxuICAgKi9cclxuICByZXNldChiYXNlPzogQ2FjaGUpIHtcclxuICAgIHRoaXMuX3JlY29yZHMgPSB7fTtcclxuXHJcbiAgICBPYmplY3Qua2V5cyh0aGlzLl9zY2hlbWEubW9kZWxzKS5mb3JFYWNoKHR5cGUgPT4ge1xyXG4gICAgICBsZXQgYmFzZVJlY29yZHMgPSBiYXNlICYmIGJhc2UucmVjb3Jkcyh0eXBlKTtcclxuXHJcbiAgICAgIHRoaXMuX3JlY29yZHNbdHlwZV0gPSBuZXcgSW1tdXRhYmxlTWFwPHN0cmluZywgUmVjb3JkPihiYXNlUmVjb3Jkcyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLl9yZWxhdGlvbnNoaXBzID0gbmV3IFJlbGF0aW9uc2hpcEFjY2Vzc29yKHRoaXMsIGJhc2UgJiYgYmFzZS5yZWxhdGlvbnNoaXBzKTtcclxuICAgIHRoaXMuX2ludmVyc2VSZWxhdGlvbnNoaXBzID0gbmV3IEludmVyc2VSZWxhdGlvbnNoaXBBY2Nlc3Nvcih0aGlzLCBiYXNlICYmIGJhc2UuaW52ZXJzZVJlbGF0aW9uc2hpcHMpO1xyXG5cclxuICAgIHRoaXMuX3Byb2Nlc3NvcnMuZm9yRWFjaChwcm9jZXNzb3IgPT4gcHJvY2Vzc29yLnJlc2V0KGJhc2UpKTtcclxuXHJcbiAgICB0aGlzLmVtaXQoJ3Jlc2V0Jyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBVcGdyYWRlIHRoZSBjYWNoZSBiYXNlZCBvbiB0aGUgY3VycmVudCBzdGF0ZSBvZiB0aGUgc2NoZW1hLlxyXG4gICAqXHJcbiAgICogQG1lbWJlcm9mIENhY2hlXHJcbiAgICovXHJcbiAgdXBncmFkZSgpIHtcclxuICAgIE9iamVjdC5rZXlzKHRoaXMuX3NjaGVtYS5tb2RlbHMpLmZvckVhY2godHlwZSA9PiB7XHJcbiAgICAgIGlmICghdGhpcy5fcmVjb3Jkc1t0eXBlXSkge1xyXG4gICAgICAgIHRoaXMuX3JlY29yZHNbdHlwZV0gPSBuZXcgSW1tdXRhYmxlTWFwPHN0cmluZywgUmVjb3JkPigpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLl9yZWxhdGlvbnNoaXBzLnVwZ3JhZGUoKTtcclxuICAgIHRoaXMuX2ludmVyc2VSZWxhdGlvbnNoaXBzLnVwZ3JhZGUoKTtcclxuICAgIHRoaXMuX3Byb2Nlc3NvcnMuZm9yRWFjaChwcm9jZXNzb3IgPT4gcHJvY2Vzc29yLnVwZ3JhZGUoKSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBQYXRjaGVzIHRoZSBkb2N1bWVudCB3aXRoIGFuIG9wZXJhdGlvbi5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7KE9wZXJhdGlvbiB8IE9wZXJhdGlvbltdIHwgVHJhbnNmb3JtQnVpbGRlckZ1bmMpfSBvcGVyYXRpb25Pck9wZXJhdGlvbnNcclxuICAgKiBAcmV0dXJucyB7T3BlcmF0aW9uW119XHJcbiAgICogQG1lbWJlcm9mIENhY2hlXHJcbiAgICovXHJcbiAgcGF0Y2gob3BlcmF0aW9uT3JPcGVyYXRpb25zOiBSZWNvcmRPcGVyYXRpb24gfCBSZWNvcmRPcGVyYXRpb25bXSB8IFRyYW5zZm9ybUJ1aWxkZXJGdW5jKTogUGF0Y2hSZXN1bHQge1xyXG4gICAgaWYgKHR5cGVvZiBvcGVyYXRpb25Pck9wZXJhdGlvbnMgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgb3BlcmF0aW9uT3JPcGVyYXRpb25zID0gPFJlY29yZE9wZXJhdGlvbiB8IFJlY29yZE9wZXJhdGlvbltdPm9wZXJhdGlvbk9yT3BlcmF0aW9ucyh0aGlzLl90cmFuc2Zvcm1CdWlsZGVyKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCByZXN1bHQ6IFBhdGNoUmVzdWx0ID0ge1xyXG4gICAgICBpbnZlcnNlOiBbXSxcclxuICAgICAgZGF0YTogW11cclxuICAgIH1cclxuXHJcbiAgICBpZiAoaXNBcnJheShvcGVyYXRpb25Pck9wZXJhdGlvbnMpKSB7XHJcbiAgICAgIHRoaXMuX2FwcGx5T3BlcmF0aW9ucyg8UmVjb3JkT3BlcmF0aW9uW10+b3BlcmF0aW9uT3JPcGVyYXRpb25zLCByZXN1bHQsIHRydWUpO1xyXG5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuX2FwcGx5T3BlcmF0aW9uKDxSZWNvcmRPcGVyYXRpb24+b3BlcmF0aW9uT3JPcGVyYXRpb25zLCByZXN1bHQsIHRydWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlc3VsdC5pbnZlcnNlLnJldmVyc2UoKTtcclxuXHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAvLyBQcm90ZWN0ZWQgbWV0aG9kc1xyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIHByb3RlY3RlZCBfYXBwbHlPcGVyYXRpb25zKG9wczogUmVjb3JkT3BlcmF0aW9uW10sIHJlc3VsdDogUGF0Y2hSZXN1bHQsIHByaW1hcnk6IGJvb2xlYW4gPSBmYWxzZSkge1xyXG4gICAgb3BzLmZvckVhY2gob3AgPT4gdGhpcy5fYXBwbHlPcGVyYXRpb24ob3AsIHJlc3VsdCwgcHJpbWFyeSkpO1xyXG4gIH1cclxuXHJcbiAgcHJvdGVjdGVkIF9hcHBseU9wZXJhdGlvbihvcGVyYXRpb246IFJlY29yZE9wZXJhdGlvbiwgcmVzdWx0OiBQYXRjaFJlc3VsdCwgcHJpbWFyeTogYm9vbGVhbiA9IGZhbHNlKSB7XHJcbiAgICB0aGlzLl9wcm9jZXNzb3JzLmZvckVhY2gocHJvY2Vzc29yID0+IHByb2Nlc3Nvci52YWxpZGF0ZShvcGVyYXRpb24pKTtcclxuXHJcbiAgICBjb25zdCBpbnZlcnNlVHJhbnNmb3JtOiBJbnZlcnNlVHJhbnNmb3JtRnVuYyA9IEludmVyc2VUcmFuc2Zvcm1zWyBvcGVyYXRpb24ub3AgXTtcclxuICAgIGNvbnN0IGludmVyc2VPcDogUmVjb3JkT3BlcmF0aW9uID0gaW52ZXJzZVRyYW5zZm9ybSh0aGlzLCBvcGVyYXRpb24pO1xyXG5cclxuICAgIGlmIChpbnZlcnNlT3ApIHtcclxuICAgICAgcmVzdWx0LmludmVyc2UucHVzaChpbnZlcnNlT3ApO1xyXG5cclxuICAgICAgLy8gUXVlcnkgYW5kIHBlcmZvcm0gcmVsYXRlZCBgYmVmb3JlYCBvcGVyYXRpb25zXHJcbiAgICAgIHRoaXMuX3Byb2Nlc3NvcnNcclxuICAgICAgICAgIC5tYXAocHJvY2Vzc29yID0+IHByb2Nlc3Nvci5iZWZvcmUob3BlcmF0aW9uKSlcclxuICAgICAgICAgIC5mb3JFYWNoKG9wcyA9PiB0aGlzLl9hcHBseU9wZXJhdGlvbnMob3BzLCByZXN1bHQpKTtcclxuXHJcbiAgICAgIC8vIFF1ZXJ5IHJlbGF0ZWQgYGFmdGVyYCBvcGVyYXRpb25zIGJlZm9yZSBwZXJmb3JtaW5nXHJcbiAgICAgIC8vIHRoZSByZXF1ZXN0ZWQgb3BlcmF0aW9uLiBUaGVzZSB3aWxsIGJlIGFwcGxpZWQgb24gc3VjY2Vzcy5cclxuICAgICAgbGV0IHByZXBhcmVkT3BzID0gdGhpcy5fcHJvY2Vzc29ycy5tYXAocHJvY2Vzc29yID0+IHByb2Nlc3Nvci5hZnRlcihvcGVyYXRpb24pKTtcclxuXHJcbiAgICAgIC8vIFBlcmZvcm0gdGhlIHJlcXVlc3RlZCBvcGVyYXRpb25cclxuICAgICAgbGV0IHBhdGNoVHJhbnNmb3JtOiBQYXRjaFRyYW5zZm9ybUZ1bmMgPSBQYXRjaFRyYW5zZm9ybXNbIG9wZXJhdGlvbi5vcCBdO1xyXG4gICAgICBsZXQgZGF0YTogUGF0Y2hSZXN1bHREYXRhID0gcGF0Y2hUcmFuc2Zvcm0odGhpcywgb3BlcmF0aW9uKTtcclxuICAgICAgaWYgKHByaW1hcnkpIHtcclxuICAgICAgICByZXN1bHQuZGF0YS5wdXNoKGRhdGEpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBRdWVyeSBhbmQgcGVyZm9ybSByZWxhdGVkIGBpbW1lZGlhdGVgIG9wZXJhdGlvbnNcclxuICAgICAgdGhpcy5fcHJvY2Vzc29yc1xyXG4gICAgICAgICAgLmZvckVhY2gocHJvY2Vzc29yID0+IHByb2Nlc3Nvci5pbW1lZGlhdGUob3BlcmF0aW9uKSk7XHJcblxyXG4gICAgICAvLyBFbWl0IGV2ZW50XHJcbiAgICAgIHRoaXMuZW1pdCgncGF0Y2gnLCBvcGVyYXRpb24sIGRhdGEpO1xyXG5cclxuICAgICAgLy8gUGVyZm9ybSBwcmVwYXJlZCBvcGVyYXRpb25zIGFmdGVyIHBlcmZvcm1pbmcgdGhlIHJlcXVlc3RlZCBvcGVyYXRpb25cclxuICAgICAgcHJlcGFyZWRPcHMuZm9yRWFjaChvcHMgPT4gdGhpcy5fYXBwbHlPcGVyYXRpb25zKG9wcywgcmVzdWx0KSk7XHJcblxyXG4gICAgICAvLyBRdWVyeSBhbmQgcGVyZm9ybSByZWxhdGVkIGBmaW5hbGx5YCBvcGVyYXRpb25zXHJcbiAgICAgIHRoaXMuX3Byb2Nlc3NvcnNcclxuICAgICAgICAgIC5tYXAocHJvY2Vzc29yID0+IHByb2Nlc3Nvci5maW5hbGx5KG9wZXJhdGlvbikpXHJcbiAgICAgICAgICAuZm9yRWFjaChvcHMgPT4gdGhpcy5fYXBwbHlPcGVyYXRpb25zKG9wcywgcmVzdWx0KSk7XHJcbiAgICB9IGVsc2UgaWYgKHByaW1hcnkpIHtcclxuICAgICAgcmVzdWx0LmRhdGEucHVzaChudWxsKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByb3RlY3RlZCBfcXVlcnkoZXhwcmVzc2lvbjogUXVlcnlFeHByZXNzaW9uKTogYW55IHtcclxuICAgIGNvbnN0IG9wZXJhdG9yID0gUXVlcnlPcGVyYXRvcnNbZXhwcmVzc2lvbi5vcF07XHJcbiAgICBpZiAoIW9wZXJhdG9yKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIGZpbmQgb3BlcmF0b3I6ICcgKyBleHByZXNzaW9uLm9wKTtcclxuICAgIH1cclxuICAgIHJldHVybiBvcGVyYXRvcih0aGlzLCBleHByZXNzaW9uKTtcclxuICB9XHJcbn1cclxuIl19