"use strict";

var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
        if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }return c > 3 && r && Object.defineProperty(target, key, r), r;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FjaGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzcmMvY2FjaGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxBQUFnQztBQUNoQyxzQkFBNkM7QUFDN0MscUJBRXFCO0FBQ3JCLHFCQWNxQjtBQUVyQiwwQ0FBNkY7QUFDN0YsNkNBQW1HO0FBQ25HLGdDQUF5RDtBQUN6RCxpQ0FBK0U7QUFDL0UsbUNBQXFGO0FBQ3JGLDBCQUFnRDtBQUNoRCxzQ0FBaUU7QUFDakUsOENBQWdGO0FBa0JoRixBQVVHOzs7Ozs7Ozs7OztBQUVILHdCQWlCRTttQkFBWSxBQUE0QixVQUE1QjtpQ0FBQTt1QkFBNEI7QUFBeEM7b0JBQ0UsQUFBSSxBQVlMO2FBWk0sQUFBTyxVQUFHLEFBQVEsU0FBQyxBQUFNLEFBQUMsQUFDL0IsQUFBSTthQUFDLEFBQU8sVUFBRyxBQUFRLFNBQUMsQUFBTSxBQUFDLEFBRS9CLEFBQUk7YUFBQyxBQUFhLGdCQUFHLEFBQVEsU0FBQyxBQUFZLGdCQUFJLElBQUksT0FBWSxBQUFFLEFBQUMsQUFDakUsQUFBSTthQUFDLEFBQWlCLG9CQUFHLEFBQVEsU0FBQyxBQUFnQix3QkFBUSxPQUFnQjsrQkFDckQsQUFBSSxLQUQ2QixBQUFxQixBQUNqRCxBQUFPLEFBQ2hDLEFBQUMsQUFBQyxBQUVIO0FBSEUsQUFBaUI7WUFHYixBQUFVLGFBQThCLEFBQVEsU0FBQyxBQUFVLGFBQUcsQUFBUSxTQUFDLEFBQVUsYUFBRyxDQUFDLCtCQUEwQixTQUFFLDRCQUF1QixBQUFDLEFBQUMsQUFDaEosQUFBSTthQUFDLEFBQVcseUJBQWMsQUFBRyxJQUFDLFVBQUEsQUFBUyxXQUFJO21CQUFBLElBQUksQUFBUyxVQUFiLEFBQWMsQUFBSSxBQUFDLEFBQUMsQUFBQztBQUFqRCxBQUFVLEFBRTdCLEFBQUk7YUFBQyxBQUFLLE1BQUMsQUFBUSxTQUFDLEFBQUksQUFBQyxBQUFDLEFBQzVCLEFBQUM7QUFFRDswQkFBSSxpQkFBTTth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QyxBQUFDLEFBQzFEO0FBQUMsQUFBQyxBQUFJO2VBQUMsQUFBRSxBQUFDLElBQUMsQUFBTyxBQUFDLFNBQUMsQUFBQyxBQUNuQixBQUFNO21CQUFDLEFBQUksS0FBQyxBQUFJLEtBQUMsQUFBSSxBQUFDLEFBQUMsQUFDekIsQUFBQyxBQUNIO0FBQUM7QUFFUztvQkFBTSxTQUFoQixVQUFpQixBQUEyQixZQUMxQztZQUFNLEFBQVEsV0FBRyxrQkFBYyxlQUFDLEFBQVUsV0FBQyxBQUFFLEFBQUMsQUFBQyxBQUMvQyxBQUFFLEFBQUM7WUFBQyxDQUFDLEFBQVEsQUFBQyxVQUFDLEFBQUMsQUFDZDtrQkFBTSxJQUFJLEFBQUssTUFBQyxBQUEyQiw4QkFBRyxBQUFVLFdBQUMsQUFBRSxBQUFDLEFBQUMsQUFDL0QsQUFBQztBQUNELEFBQU07ZUFBQyxBQUFRLFNBQUMsQUFBSSxNQUFFLEFBQVUsQUFBQyxBQUFDLEFBQ3BDLEFBQUM7QUFyTWtCLEFBQUs7d0JBRHpCLE9BQU8sVUFDYSxBQUFLLEFBc00xQixBQUFDO1dBdE1ELEFBc01DOztrQkF0TW9CLEFBQUsiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSB2YWxpZC1qc2RvYyAqL1xyXG5pbXBvcnQgeyBpc0FycmF5LCBEaWN0IH0gZnJvbSAnQG9yYml0L3V0aWxzJztcclxuaW1wb3J0IHtcclxuICBldmVudGVkLCBFdmVudGVkXHJcbn0gZnJvbSAnQG9yYml0L2NvcmUnO1xyXG5pbXBvcnQge1xyXG4gIFJlY29yZCxcclxuICBSZWNvcmRJZGVudGl0eSxcclxuICBLZXlNYXAsXHJcbiAgT3BlcmF0aW9uLFxyXG4gIFJlY29yZE9wZXJhdGlvbixcclxuICBRdWVyeSxcclxuICBRdWVyeU9yRXhwcmVzc2lvbixcclxuICBRdWVyeUV4cHJlc3Npb24sXHJcbiAgUXVlcnlCdWlsZGVyLFxyXG4gIFNjaGVtYSxcclxuICBUcmFuc2Zvcm1CdWlsZGVyLFxyXG4gIFRyYW5zZm9ybUJ1aWxkZXJGdW5jLFxyXG4gIGJ1aWxkUXVlcnlcclxufSBmcm9tICdAb3JiaXQvZGF0YSc7XHJcbmltcG9ydCB7IE9wZXJhdGlvblByb2Nlc3NvciwgT3BlcmF0aW9uUHJvY2Vzc29yQ2xhc3MgfSBmcm9tICcuL2NhY2hlL29wZXJhdGlvbi1wcm9jZXNzb3JzL29wZXJhdGlvbi1wcm9jZXNzb3InO1xyXG5pbXBvcnQgQ2FjaGVJbnRlZ3JpdHlQcm9jZXNzb3IgZnJvbSAnLi9jYWNoZS9vcGVyYXRpb24tcHJvY2Vzc29ycy9jYWNoZS1pbnRlZ3JpdHktcHJvY2Vzc29yJztcclxuaW1wb3J0IFNjaGVtYUNvbnNpc3RlbmN5UHJvY2Vzc29yIGZyb20gJy4vY2FjaGUvb3BlcmF0aW9uLXByb2Nlc3NvcnMvc2NoZW1hLWNvbnNpc3RlbmN5LXByb2Nlc3Nvcic7XHJcbmltcG9ydCB7IFF1ZXJ5T3BlcmF0b3JzIH0gZnJvbSAnLi9jYWNoZS9xdWVyeS1vcGVyYXRvcnMnO1xyXG5pbXBvcnQgUGF0Y2hUcmFuc2Zvcm1zLCB7IFBhdGNoVHJhbnNmb3JtRnVuYyB9IGZyb20gJy4vY2FjaGUvcGF0Y2gtdHJhbnNmb3Jtcyc7XHJcbmltcG9ydCBJbnZlcnNlVHJhbnNmb3JtcywgeyBJbnZlcnNlVHJhbnNmb3JtRnVuYyB9IGZyb20gJy4vY2FjaGUvaW52ZXJzZS10cmFuc2Zvcm1zJztcclxuaW1wb3J0IHsgSW1tdXRhYmxlTWFwIH0gZnJvbSAnQG9yYml0L2ltbXV0YWJsZSc7XHJcbmltcG9ydCBSZWxhdGlvbnNoaXBBY2Nlc3NvciBmcm9tICcuL2NhY2hlL3JlbGF0aW9uc2hpcC1hY2Nlc3Nvcic7XHJcbmltcG9ydCBJbnZlcnNlUmVsYXRpb25zaGlwQWNjZXNzb3IgZnJvbSAnLi9jYWNoZS9pbnZlcnNlLXJlbGF0aW9uc2hpcC1hY2Nlc3Nvcic7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIENhY2hlU2V0dGluZ3Mge1xyXG4gIHNjaGVtYT86IFNjaGVtYTtcclxuICBrZXlNYXA/OiBLZXlNYXA7XHJcbiAgcHJvY2Vzc29ycz86IE9wZXJhdGlvblByb2Nlc3NvckNsYXNzW107XHJcbiAgYmFzZT86IENhY2hlO1xyXG4gIHF1ZXJ5QnVpbGRlcj86IFF1ZXJ5QnVpbGRlcjtcclxuICB0cmFuc2Zvcm1CdWlsZGVyPzogVHJhbnNmb3JtQnVpbGRlcjtcclxufVxyXG5cclxuZXhwb3J0IHR5cGUgUGF0Y2hSZXN1bHREYXRhID0gUmVjb3JkIHwgUmVjb3JkSWRlbnRpdHkgfCBudWxsO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBQYXRjaFJlc3VsdCB7XHJcbiAgaW52ZXJzZTogUmVjb3JkT3BlcmF0aW9uW10sXHJcbiAgZGF0YTogUGF0Y2hSZXN1bHREYXRhW11cclxufVxyXG5cclxuLyoqXHJcbiAqIEEgYENhY2hlYCBpcyBhbiBpbi1tZW1vcnkgZGF0YSBzdG9yZSB0aGF0IGNhbiBiZSBhY2Nlc3NlZCBzeW5jaHJvbm91c2x5LlxyXG4gKlxyXG4gKiBDYWNoZXMgdXNlIG9wZXJhdGlvbiBwcm9jZXNzb3JzIHRvIG1haW50YWluIGludGVybmFsIGNvbnNpc3RlbmN5LlxyXG4gKlxyXG4gKiBCZWNhdXNlIGRhdGEgaXMgc3RvcmVkIGluIGltbXV0YWJsZSBtYXBzLCBjYWNoZXMgY2FuIGJlIGZvcmtlZCBlZmZpY2llbnRseS5cclxuICpcclxuICogQGV4cG9ydFxyXG4gKiBAY2xhc3MgQ2FjaGVcclxuICogQGltcGxlbWVudHMge0V2ZW50ZWR9XHJcbiAqL1xyXG5AZXZlbnRlZFxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDYWNoZSBpbXBsZW1lbnRzIEV2ZW50ZWQge1xyXG4gIHByaXZhdGUgX2tleU1hcDogS2V5TWFwO1xyXG4gIHByaXZhdGUgX3NjaGVtYTogU2NoZW1hO1xyXG4gIHByaXZhdGUgX3F1ZXJ5QnVpbGRlcjogUXVlcnlCdWlsZGVyO1xyXG4gIHByaXZhdGUgX3RyYW5zZm9ybUJ1aWxkZXI6IFRyYW5zZm9ybUJ1aWxkZXI7XHJcbiAgcHJpdmF0ZSBfcHJvY2Vzc29yczogT3BlcmF0aW9uUHJvY2Vzc29yW107XHJcbiAgcHJpdmF0ZSBfcmVjb3JkczogRGljdDxJbW11dGFibGVNYXA8c3RyaW5nLCBSZWNvcmQ+PjtcclxuICBwcml2YXRlIF9yZWxhdGlvbnNoaXBzOiBSZWxhdGlvbnNoaXBBY2Nlc3NvcjtcclxuICBwcml2YXRlIF9pbnZlcnNlUmVsYXRpb25zaGlwczogSW52ZXJzZVJlbGF0aW9uc2hpcEFjY2Vzc29yO1xyXG5cclxuICAvLyBFdmVudGVkIGludGVyZmFjZSBzdHVic1xyXG4gIG9uOiAoZXZlbnQ6IHN0cmluZywgY2FsbGJhY2s6IEZ1bmN0aW9uLCBiaW5kaW5nPzogb2JqZWN0KSA9PiB2b2lkO1xyXG4gIG9mZjogKGV2ZW50OiBzdHJpbmcsIGNhbGxiYWNrOiBGdW5jdGlvbiwgYmluZGluZz86IG9iamVjdCkgPT4gdm9pZDtcclxuICBvbmU6IChldmVudDogc3RyaW5nLCBjYWxsYmFjazogRnVuY3Rpb24sIGJpbmRpbmc/OiBvYmplY3QpID0+IHZvaWQ7XHJcbiAgZW1pdDogKGV2ZW50OiBzdHJpbmcsIC4uLmFyZ3MpID0+IHZvaWQ7XHJcbiAgbGlzdGVuZXJzOiAoZXZlbnQ6IHN0cmluZykgPT4gYW55W107XHJcblxyXG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzOiBDYWNoZVNldHRpbmdzID0ge30pIHtcclxuICAgIHRoaXMuX3NjaGVtYSA9IHNldHRpbmdzLnNjaGVtYTtcclxuICAgIHRoaXMuX2tleU1hcCA9IHNldHRpbmdzLmtleU1hcDtcclxuXHJcbiAgICB0aGlzLl9xdWVyeUJ1aWxkZXIgPSBzZXR0aW5ncy5xdWVyeUJ1aWxkZXIgfHwgbmV3IFF1ZXJ5QnVpbGRlcigpO1xyXG4gICAgdGhpcy5fdHJhbnNmb3JtQnVpbGRlciA9IHNldHRpbmdzLnRyYW5zZm9ybUJ1aWxkZXIgfHwgbmV3IFRyYW5zZm9ybUJ1aWxkZXIoe1xyXG4gICAgICByZWNvcmRJbml0aWFsaXplcjogdGhpcy5fc2NoZW1hXHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBwcm9jZXNzb3JzOiBPcGVyYXRpb25Qcm9jZXNzb3JDbGFzc1tdID0gc2V0dGluZ3MucHJvY2Vzc29ycyA/IHNldHRpbmdzLnByb2Nlc3NvcnMgOiBbU2NoZW1hQ29uc2lzdGVuY3lQcm9jZXNzb3IsIENhY2hlSW50ZWdyaXR5UHJvY2Vzc29yXTtcclxuICAgIHRoaXMuX3Byb2Nlc3NvcnMgPSBwcm9jZXNzb3JzLm1hcChQcm9jZXNzb3IgPT4gbmV3IFByb2Nlc3Nvcih0aGlzKSk7XHJcblxyXG4gICAgdGhpcy5yZXNldChzZXR0aW5ncy5iYXNlKTtcclxuICB9XHJcblxyXG4gIGdldCBrZXlNYXAoKTogS2V5TWFwIHtcclxuICAgIHJldHVybiB0aGlzLl9rZXlNYXA7XHJcbiAgfVxyXG5cclxuICBnZXQgc2NoZW1hKCk6IFNjaGVtYSB7XHJcbiAgICByZXR1cm4gdGhpcy5fc2NoZW1hO1xyXG4gIH1cclxuXHJcbiAgZ2V0IHF1ZXJ5QnVpbGRlcigpOiBRdWVyeUJ1aWxkZXIge1xyXG4gICAgcmV0dXJuIHRoaXMuX3F1ZXJ5QnVpbGRlcjtcclxuICB9XHJcblxyXG4gIGdldCB0cmFuc2Zvcm1CdWlsZGVyKCk6IFRyYW5zZm9ybUJ1aWxkZXIge1xyXG4gICAgcmV0dXJuIHRoaXMuX3RyYW5zZm9ybUJ1aWxkZXI7XHJcbiAgfVxyXG5cclxuICByZWNvcmRzKHR5cGU6IHN0cmluZyk6IEltbXV0YWJsZU1hcDxzdHJpbmcsIFJlY29yZD4ge1xyXG4gICAgcmV0dXJuIHRoaXMuX3JlY29yZHNbdHlwZV07XHJcbiAgfVxyXG5cclxuICBnZXQgcmVsYXRpb25zaGlwcygpOiBSZWxhdGlvbnNoaXBBY2Nlc3NvciB7XHJcbiAgICByZXR1cm4gdGhpcy5fcmVsYXRpb25zaGlwcztcclxuICB9XHJcblxyXG4gIGdldCBpbnZlcnNlUmVsYXRpb25zaGlwcygpOiBJbnZlcnNlUmVsYXRpb25zaGlwQWNjZXNzb3Ige1xyXG4gICAgcmV0dXJuIHRoaXMuX2ludmVyc2VSZWxhdGlvbnNoaXBzO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgIEFsbG93cyBhIGNsaWVudCB0byBydW4gcXVlcmllcyBhZ2FpbnN0IHRoZSBjYWNoZS5cclxuXHJcbiAgIEBleGFtcGxlXHJcbiAgIGBgYCBqYXZhc2NyaXB0XHJcbiAgIC8vIHVzaW5nIGEgcXVlcnkgYnVpbGRlciBjYWxsYmFja1xyXG4gICBjYWNoZS5xdWVyeShxYi5yZWNvcmQoJ3BsYW5ldCcsICdpZGFiYzEyMycpKS50aGVuKHJlc3VsdHMgPT4ge30pO1xyXG4gICBgYGBcclxuXHJcbiAgIEBleGFtcGxlXHJcbiAgIGBgYCBqYXZhc2NyaXB0XHJcbiAgIC8vIHVzaW5nIGFuIGV4cHJlc3Npb25cclxuICAgY2FjaGUucXVlcnkob3FlKCdyZWNvcmQnLCAncGxhbmV0JywgJ2lkYWJjMTIzJykpLnRoZW4ocmVzdWx0cyA9PiB7fSk7XHJcbiAgIGBgYFxyXG5cclxuICAgQG1ldGhvZCBxdWVyeVxyXG4gICBAcGFyYW0ge0V4cHJlc3Npb259IHF1ZXJ5XHJcbiAgIEByZXR1cm4ge09iamVjdH0gcmVzdWx0IG9mIHF1ZXJ5ICh0eXBlIGRlcGVuZHMgb24gcXVlcnkpXHJcbiAgICovXHJcbiAgcXVlcnkocXVlcnlPckV4cHJlc3Npb246IFF1ZXJ5T3JFeHByZXNzaW9uLCBvcHRpb25zPzogb2JqZWN0LCBpZD86IHN0cmluZyk6IGFueSB7XHJcbiAgICBjb25zdCBxdWVyeSA9IGJ1aWxkUXVlcnkocXVlcnlPckV4cHJlc3Npb24sIG9wdGlvbnMsIGlkLCB0aGlzLl9xdWVyeUJ1aWxkZXIpO1xyXG4gICAgcmV0dXJuIHRoaXMuX3F1ZXJ5KHF1ZXJ5LmV4cHJlc3Npb24pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmVzZXRzIHRoZSBjYWNoZSdzIHN0YXRlIHRvIGJlIGVpdGhlciBlbXB0eSBvciB0byBtYXRjaCB0aGUgc3RhdGUgb2ZcclxuICAgKiBhbm90aGVyIGNhY2hlLlxyXG4gICAqXHJcbiAgICogQGV4YW1wbGVcclxuICAgKiBgYGAgamF2YXNjcmlwdFxyXG4gICAqIGNhY2hlLnJlc2V0KCk7IC8vIGVtcHRpZXMgY2FjaGVcclxuICAgKiBjYWNoZS5yZXNldChjYWNoZTIpOyAvLyBjbG9uZXMgdGhlIHN0YXRlIG9mIGNhY2hlMlxyXG4gICAqIGBgYFxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtDYWNoZX0gW2Jhc2VdXHJcbiAgICogQG1lbWJlcm9mIENhY2hlXHJcbiAgICovXHJcbiAgcmVzZXQoYmFzZT86IENhY2hlKSB7XHJcbiAgICB0aGlzLl9yZWNvcmRzID0ge307XHJcblxyXG4gICAgT2JqZWN0LmtleXModGhpcy5fc2NoZW1hLm1vZGVscykuZm9yRWFjaCh0eXBlID0+IHtcclxuICAgICAgbGV0IGJhc2VSZWNvcmRzID0gYmFzZSAmJiBiYXNlLnJlY29yZHModHlwZSk7XHJcblxyXG4gICAgICB0aGlzLl9yZWNvcmRzW3R5cGVdID0gbmV3IEltbXV0YWJsZU1hcDxzdHJpbmcsIFJlY29yZD4oYmFzZVJlY29yZHMpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5fcmVsYXRpb25zaGlwcyA9IG5ldyBSZWxhdGlvbnNoaXBBY2Nlc3Nvcih0aGlzLCBiYXNlICYmIGJhc2UucmVsYXRpb25zaGlwcyk7XHJcbiAgICB0aGlzLl9pbnZlcnNlUmVsYXRpb25zaGlwcyA9IG5ldyBJbnZlcnNlUmVsYXRpb25zaGlwQWNjZXNzb3IodGhpcywgYmFzZSAmJiBiYXNlLmludmVyc2VSZWxhdGlvbnNoaXBzKTtcclxuXHJcbiAgICB0aGlzLl9wcm9jZXNzb3JzLmZvckVhY2gocHJvY2Vzc29yID0+IHByb2Nlc3Nvci5yZXNldChiYXNlKSk7XHJcblxyXG4gICAgdGhpcy5lbWl0KCdyZXNldCcpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUGF0Y2hlcyB0aGUgZG9jdW1lbnQgd2l0aCBhbiBvcGVyYXRpb24uXHJcbiAgICpcclxuICAgKiBAcGFyYW0geyhPcGVyYXRpb24gfCBPcGVyYXRpb25bXSB8IFRyYW5zZm9ybUJ1aWxkZXJGdW5jKX0gb3BlcmF0aW9uT3JPcGVyYXRpb25zXHJcbiAgICogQHJldHVybnMge09wZXJhdGlvbltdfVxyXG4gICAqIEBtZW1iZXJvZiBDYWNoZVxyXG4gICAqL1xyXG4gIHBhdGNoKG9wZXJhdGlvbk9yT3BlcmF0aW9uczogUmVjb3JkT3BlcmF0aW9uIHwgUmVjb3JkT3BlcmF0aW9uW10gfCBUcmFuc2Zvcm1CdWlsZGVyRnVuYyk6IFBhdGNoUmVzdWx0IHtcclxuICAgIGlmICh0eXBlb2Ygb3BlcmF0aW9uT3JPcGVyYXRpb25zID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgIG9wZXJhdGlvbk9yT3BlcmF0aW9ucyA9IDxSZWNvcmRPcGVyYXRpb24gfCBSZWNvcmRPcGVyYXRpb25bXT5vcGVyYXRpb25Pck9wZXJhdGlvbnModGhpcy5fdHJhbnNmb3JtQnVpbGRlcik7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcmVzdWx0OiBQYXRjaFJlc3VsdCA9IHtcclxuICAgICAgaW52ZXJzZTogW10sXHJcbiAgICAgIGRhdGE6IFtdXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGlzQXJyYXkob3BlcmF0aW9uT3JPcGVyYXRpb25zKSkge1xyXG4gICAgICB0aGlzLl9hcHBseU9wZXJhdGlvbnMoPFJlY29yZE9wZXJhdGlvbltdPm9wZXJhdGlvbk9yT3BlcmF0aW9ucywgcmVzdWx0LCB0cnVlKTtcclxuXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLl9hcHBseU9wZXJhdGlvbig8UmVjb3JkT3BlcmF0aW9uPm9wZXJhdGlvbk9yT3BlcmF0aW9ucywgcmVzdWx0LCB0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAvLyBQcm90ZWN0ZWQgbWV0aG9kc1xyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIHByb3RlY3RlZCBfYXBwbHlPcGVyYXRpb25zKG9wczogUmVjb3JkT3BlcmF0aW9uW10sIHJlc3VsdDogUGF0Y2hSZXN1bHQsIHByaW1hcnk6IGJvb2xlYW4gPSBmYWxzZSkge1xyXG4gICAgb3BzLmZvckVhY2gob3AgPT4gdGhpcy5fYXBwbHlPcGVyYXRpb24ob3AsIHJlc3VsdCwgcHJpbWFyeSkpO1xyXG4gIH1cclxuXHJcbiAgcHJvdGVjdGVkIF9hcHBseU9wZXJhdGlvbihvcGVyYXRpb246IFJlY29yZE9wZXJhdGlvbiwgcmVzdWx0OiBQYXRjaFJlc3VsdCwgcHJpbWFyeTogYm9vbGVhbiA9IGZhbHNlKSB7XHJcbiAgICBjb25zdCBpbnZlcnNlVHJhbnNmb3JtOiBJbnZlcnNlVHJhbnNmb3JtRnVuYyA9IEludmVyc2VUcmFuc2Zvcm1zWyBvcGVyYXRpb24ub3AgXTtcclxuICAgIGNvbnN0IGludmVyc2VPcDogUmVjb3JkT3BlcmF0aW9uID0gaW52ZXJzZVRyYW5zZm9ybSh0aGlzLCBvcGVyYXRpb24pO1xyXG5cclxuICAgIGlmIChpbnZlcnNlT3ApIHtcclxuICAgICAgcmVzdWx0LmludmVyc2UudW5zaGlmdChpbnZlcnNlT3ApO1xyXG5cclxuICAgICAgLy8gUXVlcnkgYW5kIHBlcmZvcm0gcmVsYXRlZCBgYmVmb3JlYCBvcGVyYXRpb25zXHJcbiAgICAgIHRoaXMuX3Byb2Nlc3NvcnNcclxuICAgICAgICAgIC5tYXAocHJvY2Vzc29yID0+IHByb2Nlc3Nvci5iZWZvcmUob3BlcmF0aW9uKSlcclxuICAgICAgICAgIC5mb3JFYWNoKG9wcyA9PiB0aGlzLl9hcHBseU9wZXJhdGlvbnMob3BzLCByZXN1bHQpKTtcclxuXHJcbiAgICAgIC8vIFF1ZXJ5IHJlbGF0ZWQgYGFmdGVyYCBvcGVyYXRpb25zIGJlZm9yZSBwZXJmb3JtaW5nXHJcbiAgICAgIC8vIHRoZSByZXF1ZXN0ZWQgb3BlcmF0aW9uLiBUaGVzZSB3aWxsIGJlIGFwcGxpZWQgb24gc3VjY2Vzcy5cclxuICAgICAgbGV0IHByZXBhcmVkT3BzID0gdGhpcy5fcHJvY2Vzc29ycy5tYXAocHJvY2Vzc29yID0+IHByb2Nlc3Nvci5hZnRlcihvcGVyYXRpb24pKTtcclxuXHJcbiAgICAgIC8vIFBlcmZvcm0gdGhlIHJlcXVlc3RlZCBvcGVyYXRpb25cclxuICAgICAgbGV0IHBhdGNoVHJhbnNmb3JtOiBQYXRjaFRyYW5zZm9ybUZ1bmMgPSBQYXRjaFRyYW5zZm9ybXNbIG9wZXJhdGlvbi5vcCBdO1xyXG4gICAgICBsZXQgZGF0YTogUGF0Y2hSZXN1bHREYXRhID0gcGF0Y2hUcmFuc2Zvcm0odGhpcywgb3BlcmF0aW9uKTtcclxuICAgICAgaWYgKHByaW1hcnkpIHtcclxuICAgICAgICByZXN1bHQuZGF0YS5wdXNoKGRhdGEpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBRdWVyeSBhbmQgcGVyZm9ybSByZWxhdGVkIGBpbW1lZGlhdGVgIG9wZXJhdGlvbnNcclxuICAgICAgdGhpcy5fcHJvY2Vzc29yc1xyXG4gICAgICAgICAgLmZvckVhY2gocHJvY2Vzc29yID0+IHByb2Nlc3Nvci5pbW1lZGlhdGUob3BlcmF0aW9uKSk7XHJcblxyXG4gICAgICAvLyBFbWl0IGV2ZW50XHJcbiAgICAgIHRoaXMuZW1pdCgncGF0Y2gnLCBvcGVyYXRpb24sIGRhdGEpO1xyXG5cclxuICAgICAgLy8gUGVyZm9ybSBwcmVwYXJlZCBvcGVyYXRpb25zIGFmdGVyIHBlcmZvcm1pbmcgdGhlIHJlcXVlc3RlZCBvcGVyYXRpb25cclxuICAgICAgcHJlcGFyZWRPcHMuZm9yRWFjaChvcHMgPT4gdGhpcy5fYXBwbHlPcGVyYXRpb25zKG9wcywgcmVzdWx0KSk7XHJcblxyXG4gICAgICAvLyBRdWVyeSBhbmQgcGVyZm9ybSByZWxhdGVkIGBmaW5hbGx5YCBvcGVyYXRpb25zXHJcbiAgICAgIHRoaXMuX3Byb2Nlc3NvcnNcclxuICAgICAgICAgIC5tYXAocHJvY2Vzc29yID0+IHByb2Nlc3Nvci5maW5hbGx5KG9wZXJhdGlvbikpXHJcbiAgICAgICAgICAuZm9yRWFjaChvcHMgPT4gdGhpcy5fYXBwbHlPcGVyYXRpb25zKG9wcywgcmVzdWx0KSk7XHJcbiAgICB9IGVsc2UgaWYgKHByaW1hcnkpIHtcclxuICAgICAgcmVzdWx0LmRhdGEucHVzaChudWxsKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByb3RlY3RlZCBfcXVlcnkoZXhwcmVzc2lvbjogUXVlcnlFeHByZXNzaW9uKTogYW55IHtcclxuICAgIGNvbnN0IG9wZXJhdG9yID0gUXVlcnlPcGVyYXRvcnNbZXhwcmVzc2lvbi5vcF07XHJcbiAgICBpZiAoIW9wZXJhdG9yKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIGZpbmQgb3BlcmF0b3I6ICcgKyBleHByZXNzaW9uLm9wKTtcclxuICAgIH1cclxuICAgIHJldHVybiBvcGVyYXRvcih0aGlzLCBleHByZXNzaW9uKTtcclxuICB9XHJcbn1cclxuIl19