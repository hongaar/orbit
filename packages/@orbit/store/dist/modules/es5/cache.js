"use strict";

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FjaGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzcmMvY2FjaGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxBQUFnQztBQUNoQyxzQkFBNkM7QUFDN0MscUJBRXFCO0FBQ3JCLHFCQWNxQjtBQUVyQiwwQ0FBNkY7QUFDN0YsNkNBQW1HO0FBQ25HLDRDQUFpRztBQUNqRyxnQ0FBeUQ7QUFDekQsaUNBQStFO0FBQy9FLG1DQUFxRjtBQUNyRiwwQkFBZ0Q7QUFDaEQsc0NBQWlFO0FBQ2pFLDhDQUFnRjtBQWtCaEYsQUFVRzs7Ozs7Ozs7Ozs7QUFFSDtBQWlCRSxtQkFBWSxBQUE0QjtBQUE1QixpQ0FBQTtBQUFBLHVCQUE0Qjs7QUFBeEMsb0JBYUM7QUFaQyxBQUFJLGFBQUMsQUFBTyxVQUFHLEFBQVEsU0FBQyxBQUFNLEFBQUM7QUFDL0IsQUFBSSxhQUFDLEFBQU8sVUFBRyxBQUFRLFNBQUMsQUFBTSxBQUFDO0FBRS9CLEFBQUksYUFBQyxBQUFhLGdCQUFHLEFBQVEsU0FBQyxBQUFZLGdCQUFJLElBQUksT0FBWSxBQUFFLEFBQUM7QUFDakUsQUFBSSxhQUFDLEFBQWlCLG9CQUFHLEFBQVEsU0FBQyxBQUFnQix3QkFBUSxPQUFnQjtBQUN4RSxBQUFpQiwrQkFBRSxBQUFJLEtBQUMsQUFBTyxBQUNoQyxBQUFDLEFBQUM7QUFGd0UsU0FBckI7QUFJdEQsWUFBTSxBQUFVLGFBQThCLEFBQVEsU0FBQyxBQUFVLGFBQUcsQUFBUSxTQUFDLEFBQVUsYUFBRyxDQUFDLDhCQUF5QixTQUFFLCtCQUEwQixTQUFFLDRCQUF1QixBQUFDLEFBQUM7QUFDM0ssQUFBSSxhQUFDLEFBQVcseUJBQWMsQUFBRyxJQUFDLFVBQUEsQUFBUztBQUFJLG1CQUFBLElBQUksQUFBUyxVQUFiLEFBQWMsQUFBSSxBQUFDO0FBQUEsQUFBQyxBQUFDLFNBQWpELEFBQVU7QUFFN0IsQUFBSSxhQUFDLEFBQUssTUFBQyxBQUFRLFNBQUMsQUFBSSxBQUFD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a0JBQWMsZUFBQyxBQUFVLFdBQUMsQUFBRSxBQUFDLEFBQUM7QUFDL0MsQUFBRSxBQUFDLFlBQUMsQ0FBQyxBQUFRLEFBQUMsVUFBQyxBQUFDO0FBQ2Qsa0JBQU0sSUFBSSxBQUFLLE1BQUMsQUFBMkIsOEJBQUcsQUFBVSxXQUFDLEFBQUUsQUFBQyxBQUFDLEFBQy9EO0FBQUM7QUFDRCxBQUFNLGVBQUMsQUFBUSxTQUFDLEFBQUksTUFBRSxBQUFVLEFBQUMsQUFBQyxBQUNwQztBQUFDO0FBMU5rQixBQUFLLHdCQUR6QixPQUFPLFVBQ2EsQUFBSyxBQTJOekI7QUFBRCxXQUFDO0FBM05ELEFBMk5DO2tCQTNOb0IsQUFBSyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIHZhbGlkLWpzZG9jICovXHJcbmltcG9ydCB7IGlzQXJyYXksIERpY3QgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xyXG5pbXBvcnQge1xyXG4gIGV2ZW50ZWQsIEV2ZW50ZWRcclxufSBmcm9tICdAb3JiaXQvY29yZSc7XHJcbmltcG9ydCB7XHJcbiAgUmVjb3JkLFxyXG4gIFJlY29yZElkZW50aXR5LFxyXG4gIEtleU1hcCxcclxuICBPcGVyYXRpb24sXHJcbiAgUmVjb3JkT3BlcmF0aW9uLFxyXG4gIFF1ZXJ5LFxyXG4gIFF1ZXJ5T3JFeHByZXNzaW9uLFxyXG4gIFF1ZXJ5RXhwcmVzc2lvbixcclxuICBRdWVyeUJ1aWxkZXIsXHJcbiAgU2NoZW1hLFxyXG4gIFRyYW5zZm9ybUJ1aWxkZXIsXHJcbiAgVHJhbnNmb3JtQnVpbGRlckZ1bmMsXHJcbiAgYnVpbGRRdWVyeVxyXG59IGZyb20gJ0BvcmJpdC9kYXRhJztcclxuaW1wb3J0IHsgT3BlcmF0aW9uUHJvY2Vzc29yLCBPcGVyYXRpb25Qcm9jZXNzb3JDbGFzcyB9IGZyb20gJy4vY2FjaGUvb3BlcmF0aW9uLXByb2Nlc3NvcnMvb3BlcmF0aW9uLXByb2Nlc3Nvcic7XHJcbmltcG9ydCBDYWNoZUludGVncml0eVByb2Nlc3NvciBmcm9tICcuL2NhY2hlL29wZXJhdGlvbi1wcm9jZXNzb3JzL2NhY2hlLWludGVncml0eS1wcm9jZXNzb3InO1xyXG5pbXBvcnQgU2NoZW1hQ29uc2lzdGVuY3lQcm9jZXNzb3IgZnJvbSAnLi9jYWNoZS9vcGVyYXRpb24tcHJvY2Vzc29ycy9zY2hlbWEtY29uc2lzdGVuY3ktcHJvY2Vzc29yJztcclxuaW1wb3J0IFNjaGVtYVZhbGlkYXRpb25Qcm9jZXNzb3IgZnJvbSAnLi9jYWNoZS9vcGVyYXRpb24tcHJvY2Vzc29ycy9zY2hlbWEtdmFsaWRhdGlvbi1wcm9jZXNzb3InO1xyXG5pbXBvcnQgeyBRdWVyeU9wZXJhdG9ycyB9IGZyb20gJy4vY2FjaGUvcXVlcnktb3BlcmF0b3JzJztcclxuaW1wb3J0IFBhdGNoVHJhbnNmb3JtcywgeyBQYXRjaFRyYW5zZm9ybUZ1bmMgfSBmcm9tICcuL2NhY2hlL3BhdGNoLXRyYW5zZm9ybXMnO1xyXG5pbXBvcnQgSW52ZXJzZVRyYW5zZm9ybXMsIHsgSW52ZXJzZVRyYW5zZm9ybUZ1bmMgfSBmcm9tICcuL2NhY2hlL2ludmVyc2UtdHJhbnNmb3Jtcyc7XHJcbmltcG9ydCB7IEltbXV0YWJsZU1hcCB9IGZyb20gJ0BvcmJpdC9pbW11dGFibGUnO1xyXG5pbXBvcnQgUmVsYXRpb25zaGlwQWNjZXNzb3IgZnJvbSAnLi9jYWNoZS9yZWxhdGlvbnNoaXAtYWNjZXNzb3InO1xyXG5pbXBvcnQgSW52ZXJzZVJlbGF0aW9uc2hpcEFjY2Vzc29yIGZyb20gJy4vY2FjaGUvaW52ZXJzZS1yZWxhdGlvbnNoaXAtYWNjZXNzb3InO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBDYWNoZVNldHRpbmdzIHtcclxuICBzY2hlbWE/OiBTY2hlbWE7XHJcbiAga2V5TWFwPzogS2V5TWFwO1xyXG4gIHByb2Nlc3NvcnM/OiBPcGVyYXRpb25Qcm9jZXNzb3JDbGFzc1tdO1xyXG4gIGJhc2U/OiBDYWNoZTtcclxuICBxdWVyeUJ1aWxkZXI/OiBRdWVyeUJ1aWxkZXI7XHJcbiAgdHJhbnNmb3JtQnVpbGRlcj86IFRyYW5zZm9ybUJ1aWxkZXI7XHJcbn1cclxuXHJcbmV4cG9ydCB0eXBlIFBhdGNoUmVzdWx0RGF0YSA9IFJlY29yZCB8IFJlY29yZElkZW50aXR5IHwgbnVsbDtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgUGF0Y2hSZXN1bHQge1xyXG4gIGludmVyc2U6IFJlY29yZE9wZXJhdGlvbltdLFxyXG4gIGRhdGE6IFBhdGNoUmVzdWx0RGF0YVtdXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBIGBDYWNoZWAgaXMgYW4gaW4tbWVtb3J5IGRhdGEgc3RvcmUgdGhhdCBjYW4gYmUgYWNjZXNzZWQgc3luY2hyb25vdXNseS5cclxuICpcclxuICogQ2FjaGVzIHVzZSBvcGVyYXRpb24gcHJvY2Vzc29ycyB0byBtYWludGFpbiBpbnRlcm5hbCBjb25zaXN0ZW5jeS5cclxuICpcclxuICogQmVjYXVzZSBkYXRhIGlzIHN0b3JlZCBpbiBpbW11dGFibGUgbWFwcywgY2FjaGVzIGNhbiBiZSBmb3JrZWQgZWZmaWNpZW50bHkuXHJcbiAqXHJcbiAqIEBleHBvcnRcclxuICogQGNsYXNzIENhY2hlXHJcbiAqIEBpbXBsZW1lbnRzIHtFdmVudGVkfVxyXG4gKi9cclxuQGV2ZW50ZWRcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2FjaGUgaW1wbGVtZW50cyBFdmVudGVkIHtcclxuICBwcml2YXRlIF9rZXlNYXA6IEtleU1hcDtcclxuICBwcml2YXRlIF9zY2hlbWE6IFNjaGVtYTtcclxuICBwcml2YXRlIF9xdWVyeUJ1aWxkZXI6IFF1ZXJ5QnVpbGRlcjtcclxuICBwcml2YXRlIF90cmFuc2Zvcm1CdWlsZGVyOiBUcmFuc2Zvcm1CdWlsZGVyO1xyXG4gIHByaXZhdGUgX3Byb2Nlc3NvcnM6IE9wZXJhdGlvblByb2Nlc3NvcltdO1xyXG4gIHByaXZhdGUgX3JlY29yZHM6IERpY3Q8SW1tdXRhYmxlTWFwPHN0cmluZywgUmVjb3JkPj47XHJcbiAgcHJpdmF0ZSBfcmVsYXRpb25zaGlwczogUmVsYXRpb25zaGlwQWNjZXNzb3I7XHJcbiAgcHJpdmF0ZSBfaW52ZXJzZVJlbGF0aW9uc2hpcHM6IEludmVyc2VSZWxhdGlvbnNoaXBBY2Nlc3NvcjtcclxuXHJcbiAgLy8gRXZlbnRlZCBpbnRlcmZhY2Ugc3R1YnNcclxuICBvbjogKGV2ZW50OiBzdHJpbmcsIGNhbGxiYWNrOiBGdW5jdGlvbiwgYmluZGluZz86IG9iamVjdCkgPT4gdm9pZDtcclxuICBvZmY6IChldmVudDogc3RyaW5nLCBjYWxsYmFjazogRnVuY3Rpb24sIGJpbmRpbmc/OiBvYmplY3QpID0+IHZvaWQ7XHJcbiAgb25lOiAoZXZlbnQ6IHN0cmluZywgY2FsbGJhY2s6IEZ1bmN0aW9uLCBiaW5kaW5nPzogb2JqZWN0KSA9PiB2b2lkO1xyXG4gIGVtaXQ6IChldmVudDogc3RyaW5nLCAuLi5hcmdzKSA9PiB2b2lkO1xyXG4gIGxpc3RlbmVyczogKGV2ZW50OiBzdHJpbmcpID0+IGFueVtdO1xyXG5cclxuICBjb25zdHJ1Y3RvcihzZXR0aW5nczogQ2FjaGVTZXR0aW5ncyA9IHt9KSB7XHJcbiAgICB0aGlzLl9zY2hlbWEgPSBzZXR0aW5ncy5zY2hlbWE7XHJcbiAgICB0aGlzLl9rZXlNYXAgPSBzZXR0aW5ncy5rZXlNYXA7XHJcblxyXG4gICAgdGhpcy5fcXVlcnlCdWlsZGVyID0gc2V0dGluZ3MucXVlcnlCdWlsZGVyIHx8IG5ldyBRdWVyeUJ1aWxkZXIoKTtcclxuICAgIHRoaXMuX3RyYW5zZm9ybUJ1aWxkZXIgPSBzZXR0aW5ncy50cmFuc2Zvcm1CdWlsZGVyIHx8IG5ldyBUcmFuc2Zvcm1CdWlsZGVyKHtcclxuICAgICAgcmVjb3JkSW5pdGlhbGl6ZXI6IHRoaXMuX3NjaGVtYVxyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgcHJvY2Vzc29yczogT3BlcmF0aW9uUHJvY2Vzc29yQ2xhc3NbXSA9IHNldHRpbmdzLnByb2Nlc3NvcnMgPyBzZXR0aW5ncy5wcm9jZXNzb3JzIDogW1NjaGVtYVZhbGlkYXRpb25Qcm9jZXNzb3IsIFNjaGVtYUNvbnNpc3RlbmN5UHJvY2Vzc29yLCBDYWNoZUludGVncml0eVByb2Nlc3Nvcl07XHJcbiAgICB0aGlzLl9wcm9jZXNzb3JzID0gcHJvY2Vzc29ycy5tYXAoUHJvY2Vzc29yID0+IG5ldyBQcm9jZXNzb3IodGhpcykpO1xyXG5cclxuICAgIHRoaXMucmVzZXQoc2V0dGluZ3MuYmFzZSk7XHJcbiAgfVxyXG5cclxuICBnZXQga2V5TWFwKCk6IEtleU1hcCB7XHJcbiAgICByZXR1cm4gdGhpcy5fa2V5TWFwO1xyXG4gIH1cclxuXHJcbiAgZ2V0IHNjaGVtYSgpOiBTY2hlbWEge1xyXG4gICAgcmV0dXJuIHRoaXMuX3NjaGVtYTtcclxuICB9XHJcblxyXG4gIGdldCBxdWVyeUJ1aWxkZXIoKTogUXVlcnlCdWlsZGVyIHtcclxuICAgIHJldHVybiB0aGlzLl9xdWVyeUJ1aWxkZXI7XHJcbiAgfVxyXG5cclxuICBnZXQgdHJhbnNmb3JtQnVpbGRlcigpOiBUcmFuc2Zvcm1CdWlsZGVyIHtcclxuICAgIHJldHVybiB0aGlzLl90cmFuc2Zvcm1CdWlsZGVyO1xyXG4gIH1cclxuXHJcbiAgcmVjb3Jkcyh0eXBlOiBzdHJpbmcpOiBJbW11dGFibGVNYXA8c3RyaW5nLCBSZWNvcmQ+IHtcclxuICAgIHJldHVybiB0aGlzLl9yZWNvcmRzW3R5cGVdO1xyXG4gIH1cclxuXHJcbiAgZ2V0IHJlbGF0aW9uc2hpcHMoKTogUmVsYXRpb25zaGlwQWNjZXNzb3Ige1xyXG4gICAgcmV0dXJuIHRoaXMuX3JlbGF0aW9uc2hpcHM7XHJcbiAgfVxyXG5cclxuICBnZXQgaW52ZXJzZVJlbGF0aW9uc2hpcHMoKTogSW52ZXJzZVJlbGF0aW9uc2hpcEFjY2Vzc29yIHtcclxuICAgIHJldHVybiB0aGlzLl9pbnZlcnNlUmVsYXRpb25zaGlwcztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICBBbGxvd3MgYSBjbGllbnQgdG8gcnVuIHF1ZXJpZXMgYWdhaW5zdCB0aGUgY2FjaGUuXHJcblxyXG4gICBAZXhhbXBsZVxyXG4gICBgYGAgamF2YXNjcmlwdFxyXG4gICAvLyB1c2luZyBhIHF1ZXJ5IGJ1aWxkZXIgY2FsbGJhY2tcclxuICAgY2FjaGUucXVlcnkocWIucmVjb3JkKCdwbGFuZXQnLCAnaWRhYmMxMjMnKSkudGhlbihyZXN1bHRzID0+IHt9KTtcclxuICAgYGBgXHJcblxyXG4gICBAZXhhbXBsZVxyXG4gICBgYGAgamF2YXNjcmlwdFxyXG4gICAvLyB1c2luZyBhbiBleHByZXNzaW9uXHJcbiAgIGNhY2hlLnF1ZXJ5KG9xZSgncmVjb3JkJywgJ3BsYW5ldCcsICdpZGFiYzEyMycpKS50aGVuKHJlc3VsdHMgPT4ge30pO1xyXG4gICBgYGBcclxuXHJcbiAgIEBtZXRob2QgcXVlcnlcclxuICAgQHBhcmFtIHtFeHByZXNzaW9ufSBxdWVyeVxyXG4gICBAcmV0dXJuIHtPYmplY3R9IHJlc3VsdCBvZiBxdWVyeSAodHlwZSBkZXBlbmRzIG9uIHF1ZXJ5KVxyXG4gICAqL1xyXG4gIHF1ZXJ5KHF1ZXJ5T3JFeHByZXNzaW9uOiBRdWVyeU9yRXhwcmVzc2lvbiwgb3B0aW9ucz86IG9iamVjdCwgaWQ/OiBzdHJpbmcpOiBhbnkge1xyXG4gICAgY29uc3QgcXVlcnkgPSBidWlsZFF1ZXJ5KHF1ZXJ5T3JFeHByZXNzaW9uLCBvcHRpb25zLCBpZCwgdGhpcy5fcXVlcnlCdWlsZGVyKTtcclxuICAgIHJldHVybiB0aGlzLl9xdWVyeShxdWVyeS5leHByZXNzaW9uKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlc2V0cyB0aGUgY2FjaGUncyBzdGF0ZSB0byBiZSBlaXRoZXIgZW1wdHkgb3IgdG8gbWF0Y2ggdGhlIHN0YXRlIG9mXHJcbiAgICogYW5vdGhlciBjYWNoZS5cclxuICAgKlxyXG4gICAqIEBleGFtcGxlXHJcbiAgICogYGBgIGphdmFzY3JpcHRcclxuICAgKiBjYWNoZS5yZXNldCgpOyAvLyBlbXB0aWVzIGNhY2hlXHJcbiAgICogY2FjaGUucmVzZXQoY2FjaGUyKTsgLy8gY2xvbmVzIHRoZSBzdGF0ZSBvZiBjYWNoZTJcclxuICAgKiBgYGBcclxuICAgKlxyXG4gICAqIEBwYXJhbSB7Q2FjaGV9IFtiYXNlXVxyXG4gICAqIEBtZW1iZXJvZiBDYWNoZVxyXG4gICAqL1xyXG4gIHJlc2V0KGJhc2U/OiBDYWNoZSkge1xyXG4gICAgdGhpcy5fcmVjb3JkcyA9IHt9O1xyXG5cclxuICAgIE9iamVjdC5rZXlzKHRoaXMuX3NjaGVtYS5tb2RlbHMpLmZvckVhY2godHlwZSA9PiB7XHJcbiAgICAgIGxldCBiYXNlUmVjb3JkcyA9IGJhc2UgJiYgYmFzZS5yZWNvcmRzKHR5cGUpO1xyXG5cclxuICAgICAgdGhpcy5fcmVjb3Jkc1t0eXBlXSA9IG5ldyBJbW11dGFibGVNYXA8c3RyaW5nLCBSZWNvcmQ+KGJhc2VSZWNvcmRzKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuX3JlbGF0aW9uc2hpcHMgPSBuZXcgUmVsYXRpb25zaGlwQWNjZXNzb3IodGhpcywgYmFzZSAmJiBiYXNlLnJlbGF0aW9uc2hpcHMpO1xyXG4gICAgdGhpcy5faW52ZXJzZVJlbGF0aW9uc2hpcHMgPSBuZXcgSW52ZXJzZVJlbGF0aW9uc2hpcEFjY2Vzc29yKHRoaXMsIGJhc2UgJiYgYmFzZS5pbnZlcnNlUmVsYXRpb25zaGlwcyk7XHJcblxyXG4gICAgdGhpcy5fcHJvY2Vzc29ycy5mb3JFYWNoKHByb2Nlc3NvciA9PiBwcm9jZXNzb3IucmVzZXQoYmFzZSkpO1xyXG5cclxuICAgIHRoaXMuZW1pdCgncmVzZXQnKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFVwZ3JhZGUgdGhlIGNhY2hlIGJhc2VkIG9uIHRoZSBjdXJyZW50IHN0YXRlIG9mIHRoZSBzY2hlbWEuXHJcbiAgICpcclxuICAgKiBAbWVtYmVyb2YgQ2FjaGVcclxuICAgKi9cclxuICB1cGdyYWRlKCkge1xyXG4gICAgT2JqZWN0LmtleXModGhpcy5fc2NoZW1hLm1vZGVscykuZm9yRWFjaCh0eXBlID0+IHtcclxuICAgICAgaWYgKCF0aGlzLl9yZWNvcmRzW3R5cGVdKSB7XHJcbiAgICAgICAgdGhpcy5fcmVjb3Jkc1t0eXBlXSA9IG5ldyBJbW11dGFibGVNYXA8c3RyaW5nLCBSZWNvcmQ+KCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuX3JlbGF0aW9uc2hpcHMudXBncmFkZSgpO1xyXG4gICAgdGhpcy5faW52ZXJzZVJlbGF0aW9uc2hpcHMudXBncmFkZSgpO1xyXG4gICAgdGhpcy5fcHJvY2Vzc29ycy5mb3JFYWNoKHByb2Nlc3NvciA9PiBwcm9jZXNzb3IudXBncmFkZSgpKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFBhdGNoZXMgdGhlIGRvY3VtZW50IHdpdGggYW4gb3BlcmF0aW9uLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHsoT3BlcmF0aW9uIHwgT3BlcmF0aW9uW10gfCBUcmFuc2Zvcm1CdWlsZGVyRnVuYyl9IG9wZXJhdGlvbk9yT3BlcmF0aW9uc1xyXG4gICAqIEByZXR1cm5zIHtPcGVyYXRpb25bXX1cclxuICAgKiBAbWVtYmVyb2YgQ2FjaGVcclxuICAgKi9cclxuICBwYXRjaChvcGVyYXRpb25Pck9wZXJhdGlvbnM6IFJlY29yZE9wZXJhdGlvbiB8IFJlY29yZE9wZXJhdGlvbltdIHwgVHJhbnNmb3JtQnVpbGRlckZ1bmMpOiBQYXRjaFJlc3VsdCB7XHJcbiAgICBpZiAodHlwZW9mIG9wZXJhdGlvbk9yT3BlcmF0aW9ucyA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICBvcGVyYXRpb25Pck9wZXJhdGlvbnMgPSA8UmVjb3JkT3BlcmF0aW9uIHwgUmVjb3JkT3BlcmF0aW9uW10+b3BlcmF0aW9uT3JPcGVyYXRpb25zKHRoaXMuX3RyYW5zZm9ybUJ1aWxkZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHJlc3VsdDogUGF0Y2hSZXN1bHQgPSB7XHJcbiAgICAgIGludmVyc2U6IFtdLFxyXG4gICAgICBkYXRhOiBbXVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChpc0FycmF5KG9wZXJhdGlvbk9yT3BlcmF0aW9ucykpIHtcclxuICAgICAgdGhpcy5fYXBwbHlPcGVyYXRpb25zKDxSZWNvcmRPcGVyYXRpb25bXT5vcGVyYXRpb25Pck9wZXJhdGlvbnMsIHJlc3VsdCwgdHJ1ZSk7XHJcblxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5fYXBwbHlPcGVyYXRpb24oPFJlY29yZE9wZXJhdGlvbj5vcGVyYXRpb25Pck9wZXJhdGlvbnMsIHJlc3VsdCwgdHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVzdWx0LmludmVyc2UucmV2ZXJzZSgpO1xyXG5cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gIC8vIFByb3RlY3RlZCBtZXRob2RzXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgcHJvdGVjdGVkIF9hcHBseU9wZXJhdGlvbnMob3BzOiBSZWNvcmRPcGVyYXRpb25bXSwgcmVzdWx0OiBQYXRjaFJlc3VsdCwgcHJpbWFyeTogYm9vbGVhbiA9IGZhbHNlKSB7XHJcbiAgICBvcHMuZm9yRWFjaChvcCA9PiB0aGlzLl9hcHBseU9wZXJhdGlvbihvcCwgcmVzdWx0LCBwcmltYXJ5KSk7XHJcbiAgfVxyXG5cclxuICBwcm90ZWN0ZWQgX2FwcGx5T3BlcmF0aW9uKG9wZXJhdGlvbjogUmVjb3JkT3BlcmF0aW9uLCByZXN1bHQ6IFBhdGNoUmVzdWx0LCBwcmltYXJ5OiBib29sZWFuID0gZmFsc2UpIHtcclxuICAgIHRoaXMuX3Byb2Nlc3NvcnMuZm9yRWFjaChwcm9jZXNzb3IgPT4gcHJvY2Vzc29yLnZhbGlkYXRlKG9wZXJhdGlvbikpO1xyXG5cclxuICAgIGNvbnN0IGludmVyc2VUcmFuc2Zvcm06IEludmVyc2VUcmFuc2Zvcm1GdW5jID0gSW52ZXJzZVRyYW5zZm9ybXNbIG9wZXJhdGlvbi5vcCBdO1xyXG4gICAgY29uc3QgaW52ZXJzZU9wOiBSZWNvcmRPcGVyYXRpb24gPSBpbnZlcnNlVHJhbnNmb3JtKHRoaXMsIG9wZXJhdGlvbik7XHJcblxyXG4gICAgaWYgKGludmVyc2VPcCkge1xyXG4gICAgICByZXN1bHQuaW52ZXJzZS5wdXNoKGludmVyc2VPcCk7XHJcblxyXG4gICAgICAvLyBRdWVyeSBhbmQgcGVyZm9ybSByZWxhdGVkIGBiZWZvcmVgIG9wZXJhdGlvbnNcclxuICAgICAgdGhpcy5fcHJvY2Vzc29yc1xyXG4gICAgICAgICAgLm1hcChwcm9jZXNzb3IgPT4gcHJvY2Vzc29yLmJlZm9yZShvcGVyYXRpb24pKVxyXG4gICAgICAgICAgLmZvckVhY2gob3BzID0+IHRoaXMuX2FwcGx5T3BlcmF0aW9ucyhvcHMsIHJlc3VsdCkpO1xyXG5cclxuICAgICAgLy8gUXVlcnkgcmVsYXRlZCBgYWZ0ZXJgIG9wZXJhdGlvbnMgYmVmb3JlIHBlcmZvcm1pbmdcclxuICAgICAgLy8gdGhlIHJlcXVlc3RlZCBvcGVyYXRpb24uIFRoZXNlIHdpbGwgYmUgYXBwbGllZCBvbiBzdWNjZXNzLlxyXG4gICAgICBsZXQgcHJlcGFyZWRPcHMgPSB0aGlzLl9wcm9jZXNzb3JzLm1hcChwcm9jZXNzb3IgPT4gcHJvY2Vzc29yLmFmdGVyKG9wZXJhdGlvbikpO1xyXG5cclxuICAgICAgLy8gUGVyZm9ybSB0aGUgcmVxdWVzdGVkIG9wZXJhdGlvblxyXG4gICAgICBsZXQgcGF0Y2hUcmFuc2Zvcm06IFBhdGNoVHJhbnNmb3JtRnVuYyA9IFBhdGNoVHJhbnNmb3Jtc1sgb3BlcmF0aW9uLm9wIF07XHJcbiAgICAgIGxldCBkYXRhOiBQYXRjaFJlc3VsdERhdGEgPSBwYXRjaFRyYW5zZm9ybSh0aGlzLCBvcGVyYXRpb24pO1xyXG4gICAgICBpZiAocHJpbWFyeSkge1xyXG4gICAgICAgIHJlc3VsdC5kYXRhLnB1c2goZGF0YSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFF1ZXJ5IGFuZCBwZXJmb3JtIHJlbGF0ZWQgYGltbWVkaWF0ZWAgb3BlcmF0aW9uc1xyXG4gICAgICB0aGlzLl9wcm9jZXNzb3JzXHJcbiAgICAgICAgICAuZm9yRWFjaChwcm9jZXNzb3IgPT4gcHJvY2Vzc29yLmltbWVkaWF0ZShvcGVyYXRpb24pKTtcclxuXHJcbiAgICAgIC8vIEVtaXQgZXZlbnRcclxuICAgICAgdGhpcy5lbWl0KCdwYXRjaCcsIG9wZXJhdGlvbiwgZGF0YSk7XHJcblxyXG4gICAgICAvLyBQZXJmb3JtIHByZXBhcmVkIG9wZXJhdGlvbnMgYWZ0ZXIgcGVyZm9ybWluZyB0aGUgcmVxdWVzdGVkIG9wZXJhdGlvblxyXG4gICAgICBwcmVwYXJlZE9wcy5mb3JFYWNoKG9wcyA9PiB0aGlzLl9hcHBseU9wZXJhdGlvbnMob3BzLCByZXN1bHQpKTtcclxuXHJcbiAgICAgIC8vIFF1ZXJ5IGFuZCBwZXJmb3JtIHJlbGF0ZWQgYGZpbmFsbHlgIG9wZXJhdGlvbnNcclxuICAgICAgdGhpcy5fcHJvY2Vzc29yc1xyXG4gICAgICAgICAgLm1hcChwcm9jZXNzb3IgPT4gcHJvY2Vzc29yLmZpbmFsbHkob3BlcmF0aW9uKSlcclxuICAgICAgICAgIC5mb3JFYWNoKG9wcyA9PiB0aGlzLl9hcHBseU9wZXJhdGlvbnMob3BzLCByZXN1bHQpKTtcclxuICAgIH0gZWxzZSBpZiAocHJpbWFyeSkge1xyXG4gICAgICByZXN1bHQuZGF0YS5wdXNoKG51bGwpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJvdGVjdGVkIF9xdWVyeShleHByZXNzaW9uOiBRdWVyeUV4cHJlc3Npb24pOiBhbnkge1xyXG4gICAgY29uc3Qgb3BlcmF0b3IgPSBRdWVyeU9wZXJhdG9yc1tleHByZXNzaW9uLm9wXTtcclxuICAgIGlmICghb3BlcmF0b3IpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gZmluZCBvcGVyYXRvcjogJyArIGV4cHJlc3Npb24ub3ApO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG9wZXJhdG9yKHRoaXMsIGV4cHJlc3Npb24pO1xyXG4gIH1cclxufVxyXG4iXX0=