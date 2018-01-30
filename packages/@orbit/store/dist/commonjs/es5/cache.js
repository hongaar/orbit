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
        var processors = settings.processors ? settings.processors : [schema_validation_processor_1.default, schema_consistency_processor_1.default, cache_integrity_processor_1.default];
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
        this._processors.forEach(function (processor) {
            return processor.upgrade();
        });
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
        result.inverse.reverse();
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
        this._processors.forEach(function (processor) {
            return processor.validate(operation);
        });
        var inverseTransform = inverse_transforms_1.default[operation.op];
        var inverseOp = inverseTransform(this, operation);
        if (inverseOp) {
            result.inverse.push(inverseOp);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FjaGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzcmMvY2FjaGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxBQUFnQztBQUNoQyxzQkFBNkM7QUFDN0MscUJBRXFCO0FBQ3JCLHFCQWNxQjtBQUVyQiwwQ0FBNkY7QUFDN0YsNkNBQW1HO0FBQ25HLDRDQUFpRztBQUNqRyxnQ0FBeUQ7QUFDekQsaUNBQStFO0FBQy9FLG1DQUFxRjtBQUNyRiwwQkFBZ0Q7QUFDaEQsc0NBQWlFO0FBQ2pFLDhDQUFnRjtBQWtCaEYsQUFVRzs7Ozs7Ozs7Ozs7QUFFSCx3QkFpQkU7bUJBQVksQUFBNEIsVUFBNUI7aUNBQUE7dUJBQTRCO0FBQXhDO29CQUNFLEFBQUksQUFZTDthQVpNLEFBQU8sVUFBRyxBQUFRLFNBQUMsQUFBTSxBQUFDLEFBQy9CLEFBQUk7YUFBQyxBQUFPLFVBQUcsQUFBUSxTQUFDLEFBQU0sQUFBQyxBQUUvQixBQUFJO2FBQUMsQUFBYSxnQkFBRyxBQUFRLFNBQUMsQUFBWSxnQkFBSSxJQUFJLE9BQVksQUFBRSxBQUFDLEFBQ2pFLEFBQUk7YUFBQyxBQUFpQixvQkFBRyxBQUFRLFNBQUMsQUFBZ0Isd0JBQVEsT0FBZ0I7K0JBQ3JELEFBQUksS0FENkIsQUFBcUIsQUFDakQsQUFBTyxBQUNoQyxBQUFDLEFBQUMsQUFFSDtBQUhFLEFBQWlCO1lBR2IsQUFBVSxhQUE4QixBQUFRLFNBQUMsQUFBVSxhQUFHLEFBQVEsU0FBQyxBQUFVLGFBQUcsQ0FBQyw4QkFBeUIsU0FBRSwrQkFBMEIsU0FBRSw0QkFBdUIsQUFBQyxBQUFDLEFBQzNLLEFBQUk7YUFBQyxBQUFXLHlCQUFjLEFBQUcsSUFBQyxVQUFBLEFBQVMsV0FBSTttQkFBQSxJQUFJLEFBQVMsVUFBYixBQUFjLEFBQUksQUFBQyxBQUFDLEFBQUM7QUFBakQsQUFBVSxBQUU3QixBQUFJO2FBQUMsQUFBSyxNQUFDLEFBQVEsU0FBQyxBQUFJLEFBQUMsQUFBQyxBQUM1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LEFBQUMsVUFBQyxBQUFDLEFBQ2Q7a0JBQU0sSUFBSSxBQUFLLE1BQUMsQUFBMkIsOEJBQUcsQUFBVSxXQUFDLEFBQUUsQUFBQyxBQUFDLEFBQy9ELEFBQUM7QUFDRCxBQUFNO2VBQUMsQUFBUSxTQUFDLEFBQUksTUFBRSxBQUFVLEFBQUMsQUFBQyxBQUNwQyxBQUFDO0FBMU5rQixBQUFLO3dCQUR6QixPQUFPLFVBQ2EsQUFBSyxBQTJOMUIsQUFBQztXQTNORCxBQTJOQzs7a0JBM05vQixBQUFLIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgdmFsaWQtanNkb2MgKi9cclxuaW1wb3J0IHsgaXNBcnJheSwgRGljdCB9IGZyb20gJ0BvcmJpdC91dGlscyc7XHJcbmltcG9ydCB7XHJcbiAgZXZlbnRlZCwgRXZlbnRlZFxyXG59IGZyb20gJ0BvcmJpdC9jb3JlJztcclxuaW1wb3J0IHtcclxuICBSZWNvcmQsXHJcbiAgUmVjb3JkSWRlbnRpdHksXHJcbiAgS2V5TWFwLFxyXG4gIE9wZXJhdGlvbixcclxuICBSZWNvcmRPcGVyYXRpb24sXHJcbiAgUXVlcnksXHJcbiAgUXVlcnlPckV4cHJlc3Npb24sXHJcbiAgUXVlcnlFeHByZXNzaW9uLFxyXG4gIFF1ZXJ5QnVpbGRlcixcclxuICBTY2hlbWEsXHJcbiAgVHJhbnNmb3JtQnVpbGRlcixcclxuICBUcmFuc2Zvcm1CdWlsZGVyRnVuYyxcclxuICBidWlsZFF1ZXJ5XHJcbn0gZnJvbSAnQG9yYml0L2RhdGEnO1xyXG5pbXBvcnQgeyBPcGVyYXRpb25Qcm9jZXNzb3IsIE9wZXJhdGlvblByb2Nlc3NvckNsYXNzIH0gZnJvbSAnLi9jYWNoZS9vcGVyYXRpb24tcHJvY2Vzc29ycy9vcGVyYXRpb24tcHJvY2Vzc29yJztcclxuaW1wb3J0IENhY2hlSW50ZWdyaXR5UHJvY2Vzc29yIGZyb20gJy4vY2FjaGUvb3BlcmF0aW9uLXByb2Nlc3NvcnMvY2FjaGUtaW50ZWdyaXR5LXByb2Nlc3Nvcic7XHJcbmltcG9ydCBTY2hlbWFDb25zaXN0ZW5jeVByb2Nlc3NvciBmcm9tICcuL2NhY2hlL29wZXJhdGlvbi1wcm9jZXNzb3JzL3NjaGVtYS1jb25zaXN0ZW5jeS1wcm9jZXNzb3InO1xyXG5pbXBvcnQgU2NoZW1hVmFsaWRhdGlvblByb2Nlc3NvciBmcm9tICcuL2NhY2hlL29wZXJhdGlvbi1wcm9jZXNzb3JzL3NjaGVtYS12YWxpZGF0aW9uLXByb2Nlc3Nvcic7XHJcbmltcG9ydCB7IFF1ZXJ5T3BlcmF0b3JzIH0gZnJvbSAnLi9jYWNoZS9xdWVyeS1vcGVyYXRvcnMnO1xyXG5pbXBvcnQgUGF0Y2hUcmFuc2Zvcm1zLCB7IFBhdGNoVHJhbnNmb3JtRnVuYyB9IGZyb20gJy4vY2FjaGUvcGF0Y2gtdHJhbnNmb3Jtcyc7XHJcbmltcG9ydCBJbnZlcnNlVHJhbnNmb3JtcywgeyBJbnZlcnNlVHJhbnNmb3JtRnVuYyB9IGZyb20gJy4vY2FjaGUvaW52ZXJzZS10cmFuc2Zvcm1zJztcclxuaW1wb3J0IHsgSW1tdXRhYmxlTWFwIH0gZnJvbSAnQG9yYml0L2ltbXV0YWJsZSc7XHJcbmltcG9ydCBSZWxhdGlvbnNoaXBBY2Nlc3NvciBmcm9tICcuL2NhY2hlL3JlbGF0aW9uc2hpcC1hY2Nlc3Nvcic7XHJcbmltcG9ydCBJbnZlcnNlUmVsYXRpb25zaGlwQWNjZXNzb3IgZnJvbSAnLi9jYWNoZS9pbnZlcnNlLXJlbGF0aW9uc2hpcC1hY2Nlc3Nvcic7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIENhY2hlU2V0dGluZ3Mge1xyXG4gIHNjaGVtYT86IFNjaGVtYTtcclxuICBrZXlNYXA/OiBLZXlNYXA7XHJcbiAgcHJvY2Vzc29ycz86IE9wZXJhdGlvblByb2Nlc3NvckNsYXNzW107XHJcbiAgYmFzZT86IENhY2hlO1xyXG4gIHF1ZXJ5QnVpbGRlcj86IFF1ZXJ5QnVpbGRlcjtcclxuICB0cmFuc2Zvcm1CdWlsZGVyPzogVHJhbnNmb3JtQnVpbGRlcjtcclxufVxyXG5cclxuZXhwb3J0IHR5cGUgUGF0Y2hSZXN1bHREYXRhID0gUmVjb3JkIHwgUmVjb3JkSWRlbnRpdHkgfCBudWxsO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBQYXRjaFJlc3VsdCB7XHJcbiAgaW52ZXJzZTogUmVjb3JkT3BlcmF0aW9uW10sXHJcbiAgZGF0YTogUGF0Y2hSZXN1bHREYXRhW11cclxufVxyXG5cclxuLyoqXHJcbiAqIEEgYENhY2hlYCBpcyBhbiBpbi1tZW1vcnkgZGF0YSBzdG9yZSB0aGF0IGNhbiBiZSBhY2Nlc3NlZCBzeW5jaHJvbm91c2x5LlxyXG4gKlxyXG4gKiBDYWNoZXMgdXNlIG9wZXJhdGlvbiBwcm9jZXNzb3JzIHRvIG1haW50YWluIGludGVybmFsIGNvbnNpc3RlbmN5LlxyXG4gKlxyXG4gKiBCZWNhdXNlIGRhdGEgaXMgc3RvcmVkIGluIGltbXV0YWJsZSBtYXBzLCBjYWNoZXMgY2FuIGJlIGZvcmtlZCBlZmZpY2llbnRseS5cclxuICpcclxuICogQGV4cG9ydFxyXG4gKiBAY2xhc3MgQ2FjaGVcclxuICogQGltcGxlbWVudHMge0V2ZW50ZWR9XHJcbiAqL1xyXG5AZXZlbnRlZFxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDYWNoZSBpbXBsZW1lbnRzIEV2ZW50ZWQge1xyXG4gIHByaXZhdGUgX2tleU1hcDogS2V5TWFwO1xyXG4gIHByaXZhdGUgX3NjaGVtYTogU2NoZW1hO1xyXG4gIHByaXZhdGUgX3F1ZXJ5QnVpbGRlcjogUXVlcnlCdWlsZGVyO1xyXG4gIHByaXZhdGUgX3RyYW5zZm9ybUJ1aWxkZXI6IFRyYW5zZm9ybUJ1aWxkZXI7XHJcbiAgcHJpdmF0ZSBfcHJvY2Vzc29yczogT3BlcmF0aW9uUHJvY2Vzc29yW107XHJcbiAgcHJpdmF0ZSBfcmVjb3JkczogRGljdDxJbW11dGFibGVNYXA8c3RyaW5nLCBSZWNvcmQ+PjtcclxuICBwcml2YXRlIF9yZWxhdGlvbnNoaXBzOiBSZWxhdGlvbnNoaXBBY2Nlc3NvcjtcclxuICBwcml2YXRlIF9pbnZlcnNlUmVsYXRpb25zaGlwczogSW52ZXJzZVJlbGF0aW9uc2hpcEFjY2Vzc29yO1xyXG5cclxuICAvLyBFdmVudGVkIGludGVyZmFjZSBzdHVic1xyXG4gIG9uOiAoZXZlbnQ6IHN0cmluZywgY2FsbGJhY2s6IEZ1bmN0aW9uLCBiaW5kaW5nPzogb2JqZWN0KSA9PiB2b2lkO1xyXG4gIG9mZjogKGV2ZW50OiBzdHJpbmcsIGNhbGxiYWNrOiBGdW5jdGlvbiwgYmluZGluZz86IG9iamVjdCkgPT4gdm9pZDtcclxuICBvbmU6IChldmVudDogc3RyaW5nLCBjYWxsYmFjazogRnVuY3Rpb24sIGJpbmRpbmc/OiBvYmplY3QpID0+IHZvaWQ7XHJcbiAgZW1pdDogKGV2ZW50OiBzdHJpbmcsIC4uLmFyZ3MpID0+IHZvaWQ7XHJcbiAgbGlzdGVuZXJzOiAoZXZlbnQ6IHN0cmluZykgPT4gYW55W107XHJcblxyXG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzOiBDYWNoZVNldHRpbmdzID0ge30pIHtcclxuICAgIHRoaXMuX3NjaGVtYSA9IHNldHRpbmdzLnNjaGVtYTtcclxuICAgIHRoaXMuX2tleU1hcCA9IHNldHRpbmdzLmtleU1hcDtcclxuXHJcbiAgICB0aGlzLl9xdWVyeUJ1aWxkZXIgPSBzZXR0aW5ncy5xdWVyeUJ1aWxkZXIgfHwgbmV3IFF1ZXJ5QnVpbGRlcigpO1xyXG4gICAgdGhpcy5fdHJhbnNmb3JtQnVpbGRlciA9IHNldHRpbmdzLnRyYW5zZm9ybUJ1aWxkZXIgfHwgbmV3IFRyYW5zZm9ybUJ1aWxkZXIoe1xyXG4gICAgICByZWNvcmRJbml0aWFsaXplcjogdGhpcy5fc2NoZW1hXHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBwcm9jZXNzb3JzOiBPcGVyYXRpb25Qcm9jZXNzb3JDbGFzc1tdID0gc2V0dGluZ3MucHJvY2Vzc29ycyA/IHNldHRpbmdzLnByb2Nlc3NvcnMgOiBbU2NoZW1hVmFsaWRhdGlvblByb2Nlc3NvciwgU2NoZW1hQ29uc2lzdGVuY3lQcm9jZXNzb3IsIENhY2hlSW50ZWdyaXR5UHJvY2Vzc29yXTtcclxuICAgIHRoaXMuX3Byb2Nlc3NvcnMgPSBwcm9jZXNzb3JzLm1hcChQcm9jZXNzb3IgPT4gbmV3IFByb2Nlc3Nvcih0aGlzKSk7XHJcblxyXG4gICAgdGhpcy5yZXNldChzZXR0aW5ncy5iYXNlKTtcclxuICB9XHJcblxyXG4gIGdldCBrZXlNYXAoKTogS2V5TWFwIHtcclxuICAgIHJldHVybiB0aGlzLl9rZXlNYXA7XHJcbiAgfVxyXG5cclxuICBnZXQgc2NoZW1hKCk6IFNjaGVtYSB7XHJcbiAgICByZXR1cm4gdGhpcy5fc2NoZW1hO1xyXG4gIH1cclxuXHJcbiAgZ2V0IHF1ZXJ5QnVpbGRlcigpOiBRdWVyeUJ1aWxkZXIge1xyXG4gICAgcmV0dXJuIHRoaXMuX3F1ZXJ5QnVpbGRlcjtcclxuICB9XHJcblxyXG4gIGdldCB0cmFuc2Zvcm1CdWlsZGVyKCk6IFRyYW5zZm9ybUJ1aWxkZXIge1xyXG4gICAgcmV0dXJuIHRoaXMuX3RyYW5zZm9ybUJ1aWxkZXI7XHJcbiAgfVxyXG5cclxuICByZWNvcmRzKHR5cGU6IHN0cmluZyk6IEltbXV0YWJsZU1hcDxzdHJpbmcsIFJlY29yZD4ge1xyXG4gICAgcmV0dXJuIHRoaXMuX3JlY29yZHNbdHlwZV07XHJcbiAgfVxyXG5cclxuICBnZXQgcmVsYXRpb25zaGlwcygpOiBSZWxhdGlvbnNoaXBBY2Nlc3NvciB7XHJcbiAgICByZXR1cm4gdGhpcy5fcmVsYXRpb25zaGlwcztcclxuICB9XHJcblxyXG4gIGdldCBpbnZlcnNlUmVsYXRpb25zaGlwcygpOiBJbnZlcnNlUmVsYXRpb25zaGlwQWNjZXNzb3Ige1xyXG4gICAgcmV0dXJuIHRoaXMuX2ludmVyc2VSZWxhdGlvbnNoaXBzO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgIEFsbG93cyBhIGNsaWVudCB0byBydW4gcXVlcmllcyBhZ2FpbnN0IHRoZSBjYWNoZS5cclxuXHJcbiAgIEBleGFtcGxlXHJcbiAgIGBgYCBqYXZhc2NyaXB0XHJcbiAgIC8vIHVzaW5nIGEgcXVlcnkgYnVpbGRlciBjYWxsYmFja1xyXG4gICBjYWNoZS5xdWVyeShxYi5yZWNvcmQoJ3BsYW5ldCcsICdpZGFiYzEyMycpKS50aGVuKHJlc3VsdHMgPT4ge30pO1xyXG4gICBgYGBcclxuXHJcbiAgIEBleGFtcGxlXHJcbiAgIGBgYCBqYXZhc2NyaXB0XHJcbiAgIC8vIHVzaW5nIGFuIGV4cHJlc3Npb25cclxuICAgY2FjaGUucXVlcnkob3FlKCdyZWNvcmQnLCAncGxhbmV0JywgJ2lkYWJjMTIzJykpLnRoZW4ocmVzdWx0cyA9PiB7fSk7XHJcbiAgIGBgYFxyXG5cclxuICAgQG1ldGhvZCBxdWVyeVxyXG4gICBAcGFyYW0ge0V4cHJlc3Npb259IHF1ZXJ5XHJcbiAgIEByZXR1cm4ge09iamVjdH0gcmVzdWx0IG9mIHF1ZXJ5ICh0eXBlIGRlcGVuZHMgb24gcXVlcnkpXHJcbiAgICovXHJcbiAgcXVlcnkocXVlcnlPckV4cHJlc3Npb246IFF1ZXJ5T3JFeHByZXNzaW9uLCBvcHRpb25zPzogb2JqZWN0LCBpZD86IHN0cmluZyk6IGFueSB7XHJcbiAgICBjb25zdCBxdWVyeSA9IGJ1aWxkUXVlcnkocXVlcnlPckV4cHJlc3Npb24sIG9wdGlvbnMsIGlkLCB0aGlzLl9xdWVyeUJ1aWxkZXIpO1xyXG4gICAgcmV0dXJuIHRoaXMuX3F1ZXJ5KHF1ZXJ5LmV4cHJlc3Npb24pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmVzZXRzIHRoZSBjYWNoZSdzIHN0YXRlIHRvIGJlIGVpdGhlciBlbXB0eSBvciB0byBtYXRjaCB0aGUgc3RhdGUgb2ZcclxuICAgKiBhbm90aGVyIGNhY2hlLlxyXG4gICAqXHJcbiAgICogQGV4YW1wbGVcclxuICAgKiBgYGAgamF2YXNjcmlwdFxyXG4gICAqIGNhY2hlLnJlc2V0KCk7IC8vIGVtcHRpZXMgY2FjaGVcclxuICAgKiBjYWNoZS5yZXNldChjYWNoZTIpOyAvLyBjbG9uZXMgdGhlIHN0YXRlIG9mIGNhY2hlMlxyXG4gICAqIGBgYFxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtDYWNoZX0gW2Jhc2VdXHJcbiAgICogQG1lbWJlcm9mIENhY2hlXHJcbiAgICovXHJcbiAgcmVzZXQoYmFzZT86IENhY2hlKSB7XHJcbiAgICB0aGlzLl9yZWNvcmRzID0ge307XHJcblxyXG4gICAgT2JqZWN0LmtleXModGhpcy5fc2NoZW1hLm1vZGVscykuZm9yRWFjaCh0eXBlID0+IHtcclxuICAgICAgbGV0IGJhc2VSZWNvcmRzID0gYmFzZSAmJiBiYXNlLnJlY29yZHModHlwZSk7XHJcblxyXG4gICAgICB0aGlzLl9yZWNvcmRzW3R5cGVdID0gbmV3IEltbXV0YWJsZU1hcDxzdHJpbmcsIFJlY29yZD4oYmFzZVJlY29yZHMpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5fcmVsYXRpb25zaGlwcyA9IG5ldyBSZWxhdGlvbnNoaXBBY2Nlc3Nvcih0aGlzLCBiYXNlICYmIGJhc2UucmVsYXRpb25zaGlwcyk7XHJcbiAgICB0aGlzLl9pbnZlcnNlUmVsYXRpb25zaGlwcyA9IG5ldyBJbnZlcnNlUmVsYXRpb25zaGlwQWNjZXNzb3IodGhpcywgYmFzZSAmJiBiYXNlLmludmVyc2VSZWxhdGlvbnNoaXBzKTtcclxuXHJcbiAgICB0aGlzLl9wcm9jZXNzb3JzLmZvckVhY2gocHJvY2Vzc29yID0+IHByb2Nlc3Nvci5yZXNldChiYXNlKSk7XHJcblxyXG4gICAgdGhpcy5lbWl0KCdyZXNldCcpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVXBncmFkZSB0aGUgY2FjaGUgYmFzZWQgb24gdGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhlIHNjaGVtYS5cclxuICAgKlxyXG4gICAqIEBtZW1iZXJvZiBDYWNoZVxyXG4gICAqL1xyXG4gIHVwZ3JhZGUoKSB7XHJcbiAgICBPYmplY3Qua2V5cyh0aGlzLl9zY2hlbWEubW9kZWxzKS5mb3JFYWNoKHR5cGUgPT4ge1xyXG4gICAgICBpZiAoIXRoaXMuX3JlY29yZHNbdHlwZV0pIHtcclxuICAgICAgICB0aGlzLl9yZWNvcmRzW3R5cGVdID0gbmV3IEltbXV0YWJsZU1hcDxzdHJpbmcsIFJlY29yZD4oKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5fcmVsYXRpb25zaGlwcy51cGdyYWRlKCk7XHJcbiAgICB0aGlzLl9pbnZlcnNlUmVsYXRpb25zaGlwcy51cGdyYWRlKCk7XHJcbiAgICB0aGlzLl9wcm9jZXNzb3JzLmZvckVhY2gocHJvY2Vzc29yID0+IHByb2Nlc3Nvci51cGdyYWRlKCkpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUGF0Y2hlcyB0aGUgZG9jdW1lbnQgd2l0aCBhbiBvcGVyYXRpb24uXHJcbiAgICpcclxuICAgKiBAcGFyYW0geyhPcGVyYXRpb24gfCBPcGVyYXRpb25bXSB8IFRyYW5zZm9ybUJ1aWxkZXJGdW5jKX0gb3BlcmF0aW9uT3JPcGVyYXRpb25zXHJcbiAgICogQHJldHVybnMge09wZXJhdGlvbltdfVxyXG4gICAqIEBtZW1iZXJvZiBDYWNoZVxyXG4gICAqL1xyXG4gIHBhdGNoKG9wZXJhdGlvbk9yT3BlcmF0aW9uczogUmVjb3JkT3BlcmF0aW9uIHwgUmVjb3JkT3BlcmF0aW9uW10gfCBUcmFuc2Zvcm1CdWlsZGVyRnVuYyk6IFBhdGNoUmVzdWx0IHtcclxuICAgIGlmICh0eXBlb2Ygb3BlcmF0aW9uT3JPcGVyYXRpb25zID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgIG9wZXJhdGlvbk9yT3BlcmF0aW9ucyA9IDxSZWNvcmRPcGVyYXRpb24gfCBSZWNvcmRPcGVyYXRpb25bXT5vcGVyYXRpb25Pck9wZXJhdGlvbnModGhpcy5fdHJhbnNmb3JtQnVpbGRlcik7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcmVzdWx0OiBQYXRjaFJlc3VsdCA9IHtcclxuICAgICAgaW52ZXJzZTogW10sXHJcbiAgICAgIGRhdGE6IFtdXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGlzQXJyYXkob3BlcmF0aW9uT3JPcGVyYXRpb25zKSkge1xyXG4gICAgICB0aGlzLl9hcHBseU9wZXJhdGlvbnMoPFJlY29yZE9wZXJhdGlvbltdPm9wZXJhdGlvbk9yT3BlcmF0aW9ucywgcmVzdWx0LCB0cnVlKTtcclxuXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLl9hcHBseU9wZXJhdGlvbig8UmVjb3JkT3BlcmF0aW9uPm9wZXJhdGlvbk9yT3BlcmF0aW9ucywgcmVzdWx0LCB0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICByZXN1bHQuaW52ZXJzZS5yZXZlcnNlKCk7XHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgLy8gUHJvdGVjdGVkIG1ldGhvZHNcclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICBwcm90ZWN0ZWQgX2FwcGx5T3BlcmF0aW9ucyhvcHM6IFJlY29yZE9wZXJhdGlvbltdLCByZXN1bHQ6IFBhdGNoUmVzdWx0LCBwcmltYXJ5OiBib29sZWFuID0gZmFsc2UpIHtcclxuICAgIG9wcy5mb3JFYWNoKG9wID0+IHRoaXMuX2FwcGx5T3BlcmF0aW9uKG9wLCByZXN1bHQsIHByaW1hcnkpKTtcclxuICB9XHJcblxyXG4gIHByb3RlY3RlZCBfYXBwbHlPcGVyYXRpb24ob3BlcmF0aW9uOiBSZWNvcmRPcGVyYXRpb24sIHJlc3VsdDogUGF0Y2hSZXN1bHQsIHByaW1hcnk6IGJvb2xlYW4gPSBmYWxzZSkge1xyXG4gICAgdGhpcy5fcHJvY2Vzc29ycy5mb3JFYWNoKHByb2Nlc3NvciA9PiBwcm9jZXNzb3IudmFsaWRhdGUob3BlcmF0aW9uKSk7XHJcblxyXG4gICAgY29uc3QgaW52ZXJzZVRyYW5zZm9ybTogSW52ZXJzZVRyYW5zZm9ybUZ1bmMgPSBJbnZlcnNlVHJhbnNmb3Jtc1sgb3BlcmF0aW9uLm9wIF07XHJcbiAgICBjb25zdCBpbnZlcnNlT3A6IFJlY29yZE9wZXJhdGlvbiA9IGludmVyc2VUcmFuc2Zvcm0odGhpcywgb3BlcmF0aW9uKTtcclxuXHJcbiAgICBpZiAoaW52ZXJzZU9wKSB7XHJcbiAgICAgIHJlc3VsdC5pbnZlcnNlLnB1c2goaW52ZXJzZU9wKTtcclxuXHJcbiAgICAgIC8vIFF1ZXJ5IGFuZCBwZXJmb3JtIHJlbGF0ZWQgYGJlZm9yZWAgb3BlcmF0aW9uc1xyXG4gICAgICB0aGlzLl9wcm9jZXNzb3JzXHJcbiAgICAgICAgICAubWFwKHByb2Nlc3NvciA9PiBwcm9jZXNzb3IuYmVmb3JlKG9wZXJhdGlvbikpXHJcbiAgICAgICAgICAuZm9yRWFjaChvcHMgPT4gdGhpcy5fYXBwbHlPcGVyYXRpb25zKG9wcywgcmVzdWx0KSk7XHJcblxyXG4gICAgICAvLyBRdWVyeSByZWxhdGVkIGBhZnRlcmAgb3BlcmF0aW9ucyBiZWZvcmUgcGVyZm9ybWluZ1xyXG4gICAgICAvLyB0aGUgcmVxdWVzdGVkIG9wZXJhdGlvbi4gVGhlc2Ugd2lsbCBiZSBhcHBsaWVkIG9uIHN1Y2Nlc3MuXHJcbiAgICAgIGxldCBwcmVwYXJlZE9wcyA9IHRoaXMuX3Byb2Nlc3NvcnMubWFwKHByb2Nlc3NvciA9PiBwcm9jZXNzb3IuYWZ0ZXIob3BlcmF0aW9uKSk7XHJcblxyXG4gICAgICAvLyBQZXJmb3JtIHRoZSByZXF1ZXN0ZWQgb3BlcmF0aW9uXHJcbiAgICAgIGxldCBwYXRjaFRyYW5zZm9ybTogUGF0Y2hUcmFuc2Zvcm1GdW5jID0gUGF0Y2hUcmFuc2Zvcm1zWyBvcGVyYXRpb24ub3AgXTtcclxuICAgICAgbGV0IGRhdGE6IFBhdGNoUmVzdWx0RGF0YSA9IHBhdGNoVHJhbnNmb3JtKHRoaXMsIG9wZXJhdGlvbik7XHJcbiAgICAgIGlmIChwcmltYXJ5KSB7XHJcbiAgICAgICAgcmVzdWx0LmRhdGEucHVzaChkYXRhKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gUXVlcnkgYW5kIHBlcmZvcm0gcmVsYXRlZCBgaW1tZWRpYXRlYCBvcGVyYXRpb25zXHJcbiAgICAgIHRoaXMuX3Byb2Nlc3NvcnNcclxuICAgICAgICAgIC5mb3JFYWNoKHByb2Nlc3NvciA9PiBwcm9jZXNzb3IuaW1tZWRpYXRlKG9wZXJhdGlvbikpO1xyXG5cclxuICAgICAgLy8gRW1pdCBldmVudFxyXG4gICAgICB0aGlzLmVtaXQoJ3BhdGNoJywgb3BlcmF0aW9uLCBkYXRhKTtcclxuXHJcbiAgICAgIC8vIFBlcmZvcm0gcHJlcGFyZWQgb3BlcmF0aW9ucyBhZnRlciBwZXJmb3JtaW5nIHRoZSByZXF1ZXN0ZWQgb3BlcmF0aW9uXHJcbiAgICAgIHByZXBhcmVkT3BzLmZvckVhY2gob3BzID0+IHRoaXMuX2FwcGx5T3BlcmF0aW9ucyhvcHMsIHJlc3VsdCkpO1xyXG5cclxuICAgICAgLy8gUXVlcnkgYW5kIHBlcmZvcm0gcmVsYXRlZCBgZmluYWxseWAgb3BlcmF0aW9uc1xyXG4gICAgICB0aGlzLl9wcm9jZXNzb3JzXHJcbiAgICAgICAgICAubWFwKHByb2Nlc3NvciA9PiBwcm9jZXNzb3IuZmluYWxseShvcGVyYXRpb24pKVxyXG4gICAgICAgICAgLmZvckVhY2gob3BzID0+IHRoaXMuX2FwcGx5T3BlcmF0aW9ucyhvcHMsIHJlc3VsdCkpO1xyXG4gICAgfSBlbHNlIGlmIChwcmltYXJ5KSB7XHJcbiAgICAgIHJlc3VsdC5kYXRhLnB1c2gobnVsbCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcm90ZWN0ZWQgX3F1ZXJ5KGV4cHJlc3Npb246IFF1ZXJ5RXhwcmVzc2lvbik6IGFueSB7XHJcbiAgICBjb25zdCBvcGVyYXRvciA9IFF1ZXJ5T3BlcmF0b3JzW2V4cHJlc3Npb24ub3BdO1xyXG4gICAgaWYgKCFvcGVyYXRvcikge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuYWJsZSB0byBmaW5kIG9wZXJhdG9yOiAnICsgZXhwcmVzc2lvbi5vcCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gb3BlcmF0b3IodGhpcywgZXhwcmVzc2lvbik7XHJcbiAgfVxyXG59XHJcbiJdfQ==