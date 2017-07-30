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
Object.defineProperty(exports, "__esModule", { value: true });
var data_1 = require("@orbit/data");
var operation_processor_1 = require("./operation-processor");
/**
 * An operation processor that ensures that a cache's data is consistent and
 * doesn't contain any dead references.
 *
 * This is achieved by maintaining a mapping of reverse relationships for each
 * record. When a record is removed, any references to it can also be identified
 * and removed.
 *
 * @export
 * @class CacheIntegrityProcessor
 * @extends {OperationProcessor}
 */
var CacheIntegrityProcessor = function (_super) {
    __extends(CacheIntegrityProcessor, _super);
    function CacheIntegrityProcessor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CacheIntegrityProcessor.prototype.after = function (operation) {
        switch (operation.op) {
            case 'replaceRelatedRecord':
                this.cache.inverseRelationships.relatedRecordRemoved(operation.record, operation.relationship);
                return [];
            case 'replaceRelatedRecords':
                this.cache.inverseRelationships.relatedRecordsRemoved(operation.record, operation.relationship);
                return [];
            case 'removeFromRelatedRecords':
                this.cache.inverseRelationships.relatedRecordRemoved(operation.record, operation.relationship, operation.relatedRecord);
                return [];
            case 'removeRecord':
                var ops = this.clearInverseRelationshipOps(operation.record);
                this.cache.inverseRelationships.recordRemoved(operation.record);
                return ops;
            case 'replaceRecord':
                this.cache.inverseRelationships.recordRemoved(operation.record);
                return [];
            default:
                return [];
        }
    };
    CacheIntegrityProcessor.prototype.immediate = function (operation) {
        switch (operation.op) {
            case 'replaceRelatedRecord':
                this.cache.relationships.replaceRelatedRecord(operation.record, operation.relationship, operation.relatedRecord);
                return;
            case 'replaceRelatedRecords':
                this.cache.relationships.replaceRelatedRecords(operation.record, operation.relationship, operation.relatedRecords);
                return;
            case 'addToRelatedRecords':
                this.cache.relationships.addToRelatedRecords(operation.record, operation.relationship, operation.relatedRecord);
                return;
            case 'removeFromRelatedRecords':
                this.cache.relationships.removeFromRelatedRecords(operation.record, operation.relationship, operation.relatedRecord);
                return;
            case 'addRecord':
                this.cache.relationships.addRecord(operation.record);
                return;
            case 'replaceRecord':
                this.cache.relationships.replaceRecord(operation.record);
                return;
            case 'removeRecord':
                this.cache.relationships.clearRecord(operation.record);
                return;
        }
    };
    CacheIntegrityProcessor.prototype.finally = function (operation) {
        switch (operation.op) {
            case 'replaceRelatedRecord':
                this.cache.inverseRelationships.relatedRecordAdded(operation.record, operation.relationship, operation.relatedRecord);
                return [];
            case 'replaceRelatedRecords':
                this.cache.inverseRelationships.relatedRecordsAdded(operation.record, operation.relationship, operation.relatedRecords);
                return [];
            case 'addToRelatedRecords':
                this.cache.inverseRelationships.relatedRecordAdded(operation.record, operation.relationship, operation.relatedRecord);
                return [];
            case 'addRecord':
                this.cache.inverseRelationships.recordAdded(operation.record);
                return [];
            case 'replaceRecord':
                this.cache.inverseRelationships.recordAdded(operation.record);
                return [];
            default:
                return [];
        }
    };
    CacheIntegrityProcessor.prototype.clearInverseRelationshipOps = function (record) {
        var _this = this;
        var ops = [];
        var inverseRels = this.cache.inverseRelationships.all(record);
        if (inverseRels.length > 0) {
            var recordIdentity_1 = data_1.cloneRecordIdentity(record);
            inverseRels.forEach(function (rel) {
                var relationshipDef = _this.cache.schema.models[rel.record.type].relationships[rel.relationship];
                if (relationshipDef.type === 'hasMany') {
                    ops.push({
                        op: 'removeFromRelatedRecords',
                        record: rel.record,
                        relationship: rel.relationship,
                        relatedRecord: recordIdentity_1
                    });
                } else {
                    ops.push({
                        op: 'replaceRelatedRecord',
                        record: rel.record,
                        relationship: rel.relationship,
                        relatedRecord: null
                    });
                }
            });
        }
        return ops;
    };
    return CacheIntegrityProcessor;
}(operation_processor_1.OperationProcessor);
exports.default = CacheIntegrityProcessor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FjaGUtaW50ZWdyaXR5LXByb2Nlc3Nvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jYWNoZS9vcGVyYXRpb24tcHJvY2Vzc29ycy9jYWNoZS1pbnRlZ3JpdHktcHJvY2Vzc29yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxxQkFJcUI7QUFFckIsb0NBQTJEO0FBRTNELEFBV0c7Ozs7Ozs7Ozs7OztBQUNILGdEQUFxRDt1Q0FBckQsQUFBdUU7O21FQW9IdkUsQUFBQztBQW5IQztzQ0FBSyxRQUFMLFVBQU0sQUFBMEIsV0FDOUIsQUFBTSxBQUFDO2dCQUFDLEFBQVMsVUFBQyxBQUFFLEFBQUMsQUFBQyxBQUFDLEFBQ3JCO2lCQUFLLEFBQXNCLEFBQ3pCLEFBQUk7cUJBQUMsQUFBSyxNQUFDLEFBQW9CLHFCQUFDLEFBQW9CLHFCQUFDLEFBQVMsVUFBQyxBQUFNLFFBQUUsQUFBUyxVQUFDLEFBQVksQUFBQyxBQUFDLEFBQy9GLEFBQU07dUJBQUMsQUFBRSxBQUFDLEFBRVo7aUJBQUssQUFBdUIsQUFDMUIsQUFBSTtxQkFBQyxBQUFLLE1BQUMsQUFBb0IscUJBQUMsQUFBcUIsc0JBQUMsQUFBUyxVQUFDLEFBQU0sUUFBRSxBQUFTLFVBQUMsQUFBWSxBQUFDLEFBQUMsQUFDaEcsQUFBTTt1QkFBQyxBQUFFLEFBQUMsQUFFWjtpQkFBSyxBQUEwQixBQUM3QixBQUFJO3FCQUFDLEFBQUssTUFBQyxBQUFvQixxQkFBQyxBQUFvQixxQkFBQyxBQUFTLFVBQUMsQUFBTSxRQUFFLEFBQVMsVUFBQyxBQUFZLGNBQUUsQUFBUyxVQUFDLEFBQWEsQUFBQyxBQUFDLEFBQ3hILEFBQU07dUJBQUMsQUFBRSxBQUFDLEFBRVo7aUJBQUssQUFBYyxBQUNqQjtvQkFBSSxBQUFHLE1BQUcsQUFBSSxLQUFDLEFBQTJCLDRCQUFDLEFBQVMsVUFBQyxBQUFNLEFBQUMsQUFBQyxB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QyxBQUFZLEFBQzlCLEFBQWE7dUNBSk4sQUFJUSxBQUFjLEFBQzlCLEFBQUMsQUFBQyxBQUNMLEFBQUMsQUFBQyxBQUFJO0FBTEYsQUFBRTt1QkFLQyxBQUFDLEFBQ04sQUFBRzt3QkFBQyxBQUFJOzRCQUNGLEFBQXNCLEFBQzFCLEFBQU07Z0NBQUUsQUFBRyxJQUFDLEFBQU0sQUFDbEIsQUFBWTtzQ0FBRSxBQUFHLElBQUMsQUFBWSxBQUM5QixBQUFhO3VDQUpOLEFBSVEsQUFBSSxBQUNwQixBQUFDLEFBQUMsQUFDTCxBQUFDLEFBQ0g7QUFOTSxBQUFFO0FBTVAsQUFBQyxBQUFDLEFBQ0w7QUFBQztBQUVELEFBQU07ZUFBQyxBQUFHLEFBQUMsQUFDYixBQUFDO0FBQ0g7V0FwSEEsQUFvSEEsQUFBQztFQXBIb0Qsc0JBQWtCLEFBb0h0RSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGRlZXBHZXQsIGlzT2JqZWN0LCBpc0FycmF5LCBEaWN0IH0gZnJvbSAnQG9yYml0L3V0aWxzJztcclxuaW1wb3J0IHtcclxuICBjbG9uZVJlY29yZElkZW50aXR5LFxyXG4gIFJlY29yZElkZW50aXR5LFxyXG4gIFJlY29yZE9wZXJhdGlvblxyXG59IGZyb20gJ0BvcmJpdC9kYXRhJztcclxuaW1wb3J0IENhY2hlIGZyb20gJy4uLy4uL2NhY2hlJztcclxuaW1wb3J0IHsgT3BlcmF0aW9uUHJvY2Vzc29yIH0gZnJvbSAnLi9vcGVyYXRpb24tcHJvY2Vzc29yJztcclxuXHJcbi8qKlxyXG4gKiBBbiBvcGVyYXRpb24gcHJvY2Vzc29yIHRoYXQgZW5zdXJlcyB0aGF0IGEgY2FjaGUncyBkYXRhIGlzIGNvbnNpc3RlbnQgYW5kXHJcbiAqIGRvZXNuJ3QgY29udGFpbiBhbnkgZGVhZCByZWZlcmVuY2VzLlxyXG4gKlxyXG4gKiBUaGlzIGlzIGFjaGlldmVkIGJ5IG1haW50YWluaW5nIGEgbWFwcGluZyBvZiByZXZlcnNlIHJlbGF0aW9uc2hpcHMgZm9yIGVhY2hcclxuICogcmVjb3JkLiBXaGVuIGEgcmVjb3JkIGlzIHJlbW92ZWQsIGFueSByZWZlcmVuY2VzIHRvIGl0IGNhbiBhbHNvIGJlIGlkZW50aWZpZWRcclxuICogYW5kIHJlbW92ZWQuXHJcbiAqXHJcbiAqIEBleHBvcnRcclxuICogQGNsYXNzIENhY2hlSW50ZWdyaXR5UHJvY2Vzc29yXHJcbiAqIEBleHRlbmRzIHtPcGVyYXRpb25Qcm9jZXNzb3J9XHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDYWNoZUludGVncml0eVByb2Nlc3NvciBleHRlbmRzIE9wZXJhdGlvblByb2Nlc3NvciB7XHJcbiAgYWZ0ZXIob3BlcmF0aW9uOiBSZWNvcmRPcGVyYXRpb24pOiBSZWNvcmRPcGVyYXRpb25bXSB7XHJcbiAgICBzd2l0Y2ggKG9wZXJhdGlvbi5vcCkge1xyXG4gICAgICBjYXNlICdyZXBsYWNlUmVsYXRlZFJlY29yZCc6XHJcbiAgICAgICAgdGhpcy5jYWNoZS5pbnZlcnNlUmVsYXRpb25zaGlwcy5yZWxhdGVkUmVjb3JkUmVtb3ZlZChvcGVyYXRpb24ucmVjb3JkLCBvcGVyYXRpb24ucmVsYXRpb25zaGlwKTtcclxuICAgICAgICByZXR1cm4gW107XHJcblxyXG4gICAgICBjYXNlICdyZXBsYWNlUmVsYXRlZFJlY29yZHMnOlxyXG4gICAgICAgIHRoaXMuY2FjaGUuaW52ZXJzZVJlbGF0aW9uc2hpcHMucmVsYXRlZFJlY29yZHNSZW1vdmVkKG9wZXJhdGlvbi5yZWNvcmQsIG9wZXJhdGlvbi5yZWxhdGlvbnNoaXApO1xyXG4gICAgICAgIHJldHVybiBbXTtcclxuXHJcbiAgICAgIGNhc2UgJ3JlbW92ZUZyb21SZWxhdGVkUmVjb3Jkcyc6XHJcbiAgICAgICAgdGhpcy5jYWNoZS5pbnZlcnNlUmVsYXRpb25zaGlwcy5yZWxhdGVkUmVjb3JkUmVtb3ZlZChvcGVyYXRpb24ucmVjb3JkLCBvcGVyYXRpb24ucmVsYXRpb25zaGlwLCBvcGVyYXRpb24ucmVsYXRlZFJlY29yZCk7XHJcbiAgICAgICAgcmV0dXJuIFtdO1xyXG5cclxuICAgICAgY2FzZSAncmVtb3ZlUmVjb3JkJzpcclxuICAgICAgICBsZXQgb3BzID0gdGhpcy5jbGVhckludmVyc2VSZWxhdGlvbnNoaXBPcHMob3BlcmF0aW9uLnJlY29yZCk7XHJcbiAgICAgICAgdGhpcy5jYWNoZS5pbnZlcnNlUmVsYXRpb25zaGlwcy5yZWNvcmRSZW1vdmVkKG9wZXJhdGlvbi5yZWNvcmQpO1xyXG4gICAgICAgIHJldHVybiBvcHM7XHJcblxyXG4gICAgICBjYXNlICdyZXBsYWNlUmVjb3JkJzpcclxuICAgICAgICB0aGlzLmNhY2hlLmludmVyc2VSZWxhdGlvbnNoaXBzLnJlY29yZFJlbW92ZWQob3BlcmF0aW9uLnJlY29yZCk7XHJcbiAgICAgICAgcmV0dXJuIFtdO1xyXG5cclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICByZXR1cm4gW107XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpbW1lZGlhdGUob3BlcmF0aW9uKTogdm9pZCB7XHJcbiAgICBzd2l0Y2ggKG9wZXJhdGlvbi5vcCkge1xyXG4gICAgICBjYXNlICdyZXBsYWNlUmVsYXRlZFJlY29yZCc6XHJcbiAgICAgICAgdGhpcy5jYWNoZS5yZWxhdGlvbnNoaXBzLnJlcGxhY2VSZWxhdGVkUmVjb3JkKG9wZXJhdGlvbi5yZWNvcmQsIG9wZXJhdGlvbi5yZWxhdGlvbnNoaXAsIG9wZXJhdGlvbi5yZWxhdGVkUmVjb3JkKTtcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBjYXNlICdyZXBsYWNlUmVsYXRlZFJlY29yZHMnOlxyXG4gICAgICAgIHRoaXMuY2FjaGUucmVsYXRpb25zaGlwcy5yZXBsYWNlUmVsYXRlZFJlY29yZHMob3BlcmF0aW9uLnJlY29yZCwgb3BlcmF0aW9uLnJlbGF0aW9uc2hpcCwgb3BlcmF0aW9uLnJlbGF0ZWRSZWNvcmRzKTtcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBjYXNlICdhZGRUb1JlbGF0ZWRSZWNvcmRzJzpcclxuICAgICAgICB0aGlzLmNhY2hlLnJlbGF0aW9uc2hpcHMuYWRkVG9SZWxhdGVkUmVjb3JkcyhvcGVyYXRpb24ucmVjb3JkLCBvcGVyYXRpb24ucmVsYXRpb25zaGlwLCBvcGVyYXRpb24ucmVsYXRlZFJlY29yZCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgY2FzZSAncmVtb3ZlRnJvbVJlbGF0ZWRSZWNvcmRzJzpcclxuICAgICAgICB0aGlzLmNhY2hlLnJlbGF0aW9uc2hpcHMucmVtb3ZlRnJvbVJlbGF0ZWRSZWNvcmRzKG9wZXJhdGlvbi5yZWNvcmQsIG9wZXJhdGlvbi5yZWxhdGlvbnNoaXAsIG9wZXJhdGlvbi5yZWxhdGVkUmVjb3JkKTtcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBjYXNlICdhZGRSZWNvcmQnOlxyXG4gICAgICAgIHRoaXMuY2FjaGUucmVsYXRpb25zaGlwcy5hZGRSZWNvcmQob3BlcmF0aW9uLnJlY29yZCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgY2FzZSAncmVwbGFjZVJlY29yZCc6XHJcbiAgICAgICAgdGhpcy5jYWNoZS5yZWxhdGlvbnNoaXBzLnJlcGxhY2VSZWNvcmQob3BlcmF0aW9uLnJlY29yZCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgY2FzZSAncmVtb3ZlUmVjb3JkJzpcclxuICAgICAgICB0aGlzLmNhY2hlLnJlbGF0aW9uc2hpcHMuY2xlYXJSZWNvcmQob3BlcmF0aW9uLnJlY29yZCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZmluYWxseShvcGVyYXRpb24pOiBSZWNvcmRPcGVyYXRpb25bXSB7XHJcbiAgICBzd2l0Y2ggKG9wZXJhdGlvbi5vcCkge1xyXG4gICAgICBjYXNlICdyZXBsYWNlUmVsYXRlZFJlY29yZCc6XHJcbiAgICAgICAgdGhpcy5jYWNoZS5pbnZlcnNlUmVsYXRpb25zaGlwcy5yZWxhdGVkUmVjb3JkQWRkZWQob3BlcmF0aW9uLnJlY29yZCwgb3BlcmF0aW9uLnJlbGF0aW9uc2hpcCwgb3BlcmF0aW9uLnJlbGF0ZWRSZWNvcmQpO1xyXG4gICAgICAgIHJldHVybiBbXTtcclxuXHJcbiAgICAgIGNhc2UgJ3JlcGxhY2VSZWxhdGVkUmVjb3Jkcyc6XHJcbiAgICAgICAgdGhpcy5jYWNoZS5pbnZlcnNlUmVsYXRpb25zaGlwcy5yZWxhdGVkUmVjb3Jkc0FkZGVkKG9wZXJhdGlvbi5yZWNvcmQsIG9wZXJhdGlvbi5yZWxhdGlvbnNoaXAsIG9wZXJhdGlvbi5yZWxhdGVkUmVjb3Jkcyk7XHJcbiAgICAgICAgcmV0dXJuIFtdO1xyXG5cclxuICAgICAgY2FzZSAnYWRkVG9SZWxhdGVkUmVjb3Jkcyc6XHJcbiAgICAgICAgdGhpcy5jYWNoZS5pbnZlcnNlUmVsYXRpb25zaGlwcy5yZWxhdGVkUmVjb3JkQWRkZWQob3BlcmF0aW9uLnJlY29yZCwgb3BlcmF0aW9uLnJlbGF0aW9uc2hpcCwgb3BlcmF0aW9uLnJlbGF0ZWRSZWNvcmQpO1xyXG4gICAgICAgIHJldHVybiBbXTtcclxuXHJcbiAgICAgIGNhc2UgJ2FkZFJlY29yZCc6XHJcbiAgICAgICAgdGhpcy5jYWNoZS5pbnZlcnNlUmVsYXRpb25zaGlwcy5yZWNvcmRBZGRlZChvcGVyYXRpb24ucmVjb3JkKTtcclxuICAgICAgICByZXR1cm4gW107XHJcblxyXG4gICAgICBjYXNlICdyZXBsYWNlUmVjb3JkJzpcclxuICAgICAgICB0aGlzLmNhY2hlLmludmVyc2VSZWxhdGlvbnNoaXBzLnJlY29yZEFkZGVkKG9wZXJhdGlvbi5yZWNvcmQpO1xyXG4gICAgICAgIHJldHVybiBbXTtcclxuXHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjbGVhckludmVyc2VSZWxhdGlvbnNoaXBPcHMocmVjb3JkOiBSZWNvcmRJZGVudGl0eSk6IFJlY29yZE9wZXJhdGlvbltdIHtcclxuICAgIGNvbnN0IG9wczogUmVjb3JkT3BlcmF0aW9uW10gPSBbXTtcclxuICAgIGNvbnN0IGludmVyc2VSZWxzID0gdGhpcy5jYWNoZS5pbnZlcnNlUmVsYXRpb25zaGlwcy5hbGwocmVjb3JkKTtcclxuXHJcbiAgICBpZiAoaW52ZXJzZVJlbHMubGVuZ3RoID4gMCkge1xyXG4gICAgICBjb25zdCByZWNvcmRJZGVudGl0eSA9IGNsb25lUmVjb3JkSWRlbnRpdHkocmVjb3JkKTtcclxuICAgICAgaW52ZXJzZVJlbHMuZm9yRWFjaChyZWwgPT4ge1xyXG4gICAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcERlZiA9IHRoaXMuY2FjaGUuc2NoZW1hLm1vZGVsc1tyZWwucmVjb3JkLnR5cGVdLnJlbGF0aW9uc2hpcHNbcmVsLnJlbGF0aW9uc2hpcF07XHJcbiAgICAgICAgaWYgKHJlbGF0aW9uc2hpcERlZi50eXBlID09PSAnaGFzTWFueScpIHtcclxuICAgICAgICAgIG9wcy5wdXNoKHtcclxuICAgICAgICAgICAgb3A6ICdyZW1vdmVGcm9tUmVsYXRlZFJlY29yZHMnLFxyXG4gICAgICAgICAgICByZWNvcmQ6IHJlbC5yZWNvcmQsXHJcbiAgICAgICAgICAgIHJlbGF0aW9uc2hpcDogcmVsLnJlbGF0aW9uc2hpcCxcclxuICAgICAgICAgICAgcmVsYXRlZFJlY29yZDogcmVjb3JkSWRlbnRpdHlcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBvcHMucHVzaCh7XHJcbiAgICAgICAgICAgIG9wOiAncmVwbGFjZVJlbGF0ZWRSZWNvcmQnLFxyXG4gICAgICAgICAgICByZWNvcmQ6IHJlbC5yZWNvcmQsXHJcbiAgICAgICAgICAgIHJlbGF0aW9uc2hpcDogcmVsLnJlbGF0aW9uc2hpcCxcclxuICAgICAgICAgICAgcmVsYXRlZFJlY29yZDogbnVsbFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gb3BzO1xyXG4gIH1cclxufVxyXG4iXX0=