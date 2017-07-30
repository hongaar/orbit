"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var CacheIntegrityProcessor = (function (_super) {
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
                }
                else {
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
}(operation_processor_1.OperationProcessor));
exports.default = CacheIntegrityProcessor;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FjaGUtaW50ZWdyaXR5LXByb2Nlc3Nvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jYWNoZS9vcGVyYXRpb24tcHJvY2Vzc29ycy9jYWNoZS1pbnRlZ3JpdHktcHJvY2Vzc29yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUNBLG9DQUlxQjtBQUVyQiw2REFBMkQ7QUFFM0Q7Ozs7Ozs7Ozs7O0dBV0c7QUFDSDtJQUFxRCwyQ0FBa0I7SUFBdkU7O0lBb0hBLENBQUM7SUFuSEMsdUNBQUssR0FBTCxVQUFNLFNBQTBCO1FBQzlCLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3JCLEtBQUssc0JBQXNCO2dCQUN6QixJQUFJLENBQUMsS0FBSyxDQUFDLG9CQUFvQixDQUFDLG9CQUFvQixDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUMvRixNQUFNLENBQUMsRUFBRSxDQUFDO1lBRVosS0FBSyx1QkFBdUI7Z0JBQzFCLElBQUksQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQUMscUJBQXFCLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBQ2hHLE1BQU0sQ0FBQyxFQUFFLENBQUM7WUFFWixLQUFLLDBCQUEwQjtnQkFDN0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxZQUFZLEVBQUUsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUN4SCxNQUFNLENBQUMsRUFBRSxDQUFDO1lBRVosS0FBSyxjQUFjO2dCQUNqQixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsMkJBQTJCLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUM3RCxJQUFJLENBQUMsS0FBSyxDQUFDLG9CQUFv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Z0JBQWM7cUJBQzlCLENBQUMsQ0FBQztnQkFDTCxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNOLEdBQUcsQ0FBQyxJQUFJLENBQUM7d0JBQ1AsRUFBRSxFQUFFLHNCQUFzQjt3QkFDMUIsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNO3dCQUNsQixZQUFZLEVBQUUsR0FBRyxDQUFDLFlBQVk7d0JBQzlCLGFBQWEsRUFBRSxJQUFJO3FCQUNwQixDQUFDLENBQUM7Z0JBQ0wsQ0FBQztZQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUVELE1BQU0sQ0FBQyxHQUFHLENBQUM7SUFDYixDQUFDO0lBQ0gsOEJBQUM7QUFBRCxDQUFDLEFBcEhELENBQXFELHdDQUFrQixHQW9IdEUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBkZWVwR2V0LCBpc09iamVjdCwgaXNBcnJheSwgRGljdCB9IGZyb20gJ0BvcmJpdC91dGlscyc7XHJcbmltcG9ydCB7XHJcbiAgY2xvbmVSZWNvcmRJZGVudGl0eSxcclxuICBSZWNvcmRJZGVudGl0eSxcclxuICBSZWNvcmRPcGVyYXRpb25cclxufSBmcm9tICdAb3JiaXQvZGF0YSc7XHJcbmltcG9ydCBDYWNoZSBmcm9tICcuLi8uLi9jYWNoZSc7XHJcbmltcG9ydCB7IE9wZXJhdGlvblByb2Nlc3NvciB9IGZyb20gJy4vb3BlcmF0aW9uLXByb2Nlc3Nvcic7XHJcblxyXG4vKipcclxuICogQW4gb3BlcmF0aW9uIHByb2Nlc3NvciB0aGF0IGVuc3VyZXMgdGhhdCBhIGNhY2hlJ3MgZGF0YSBpcyBjb25zaXN0ZW50IGFuZFxyXG4gKiBkb2Vzbid0IGNvbnRhaW4gYW55IGRlYWQgcmVmZXJlbmNlcy5cclxuICpcclxuICogVGhpcyBpcyBhY2hpZXZlZCBieSBtYWludGFpbmluZyBhIG1hcHBpbmcgb2YgcmV2ZXJzZSByZWxhdGlvbnNoaXBzIGZvciBlYWNoXHJcbiAqIHJlY29yZC4gV2hlbiBhIHJlY29yZCBpcyByZW1vdmVkLCBhbnkgcmVmZXJlbmNlcyB0byBpdCBjYW4gYWxzbyBiZSBpZGVudGlmaWVkXHJcbiAqIGFuZCByZW1vdmVkLlxyXG4gKlxyXG4gKiBAZXhwb3J0XHJcbiAqIEBjbGFzcyBDYWNoZUludGVncml0eVByb2Nlc3NvclxyXG4gKiBAZXh0ZW5kcyB7T3BlcmF0aW9uUHJvY2Vzc29yfVxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2FjaGVJbnRlZ3JpdHlQcm9jZXNzb3IgZXh0ZW5kcyBPcGVyYXRpb25Qcm9jZXNzb3Ige1xyXG4gIGFmdGVyKG9wZXJhdGlvbjogUmVjb3JkT3BlcmF0aW9uKTogUmVjb3JkT3BlcmF0aW9uW10ge1xyXG4gICAgc3dpdGNoIChvcGVyYXRpb24ub3ApIHtcclxuICAgICAgY2FzZSAncmVwbGFjZVJlbGF0ZWRSZWNvcmQnOlxyXG4gICAgICAgIHRoaXMuY2FjaGUuaW52ZXJzZVJlbGF0aW9uc2hpcHMucmVsYXRlZFJlY29yZFJlbW92ZWQob3BlcmF0aW9uLnJlY29yZCwgb3BlcmF0aW9uLnJlbGF0aW9uc2hpcCk7XHJcbiAgICAgICAgcmV0dXJuIFtdO1xyXG5cclxuICAgICAgY2FzZSAncmVwbGFjZVJlbGF0ZWRSZWNvcmRzJzpcclxuICAgICAgICB0aGlzLmNhY2hlLmludmVyc2VSZWxhdGlvbnNoaXBzLnJlbGF0ZWRSZWNvcmRzUmVtb3ZlZChvcGVyYXRpb24ucmVjb3JkLCBvcGVyYXRpb24ucmVsYXRpb25zaGlwKTtcclxuICAgICAgICByZXR1cm4gW107XHJcblxyXG4gICAgICBjYXNlICdyZW1vdmVGcm9tUmVsYXRlZFJlY29yZHMnOlxyXG4gICAgICAgIHRoaXMuY2FjaGUuaW52ZXJzZVJlbGF0aW9uc2hpcHMucmVsYXRlZFJlY29yZFJlbW92ZWQob3BlcmF0aW9uLnJlY29yZCwgb3BlcmF0aW9uLnJlbGF0aW9uc2hpcCwgb3BlcmF0aW9uLnJlbGF0ZWRSZWNvcmQpO1xyXG4gICAgICAgIHJldHVybiBbXTtcclxuXHJcbiAgICAgIGNhc2UgJ3JlbW92ZVJlY29yZCc6XHJcbiAgICAgICAgbGV0IG9wcyA9IHRoaXMuY2xlYXJJbnZlcnNlUmVsYXRpb25zaGlwT3BzKG9wZXJhdGlvbi5yZWNvcmQpO1xyXG4gICAgICAgIHRoaXMuY2FjaGUuaW52ZXJzZVJlbGF0aW9uc2hpcHMucmVjb3JkUmVtb3ZlZChvcGVyYXRpb24ucmVjb3JkKTtcclxuICAgICAgICByZXR1cm4gb3BzO1xyXG5cclxuICAgICAgY2FzZSAncmVwbGFjZVJlY29yZCc6XHJcbiAgICAgICAgdGhpcy5jYWNoZS5pbnZlcnNlUmVsYXRpb25zaGlwcy5yZWNvcmRSZW1vdmVkKG9wZXJhdGlvbi5yZWNvcmQpO1xyXG4gICAgICAgIHJldHVybiBbXTtcclxuXHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaW1tZWRpYXRlKG9wZXJhdGlvbik6IHZvaWQge1xyXG4gICAgc3dpdGNoIChvcGVyYXRpb24ub3ApIHtcclxuICAgICAgY2FzZSAncmVwbGFjZVJlbGF0ZWRSZWNvcmQnOlxyXG4gICAgICAgIHRoaXMuY2FjaGUucmVsYXRpb25zaGlwcy5yZXBsYWNlUmVsYXRlZFJlY29yZChvcGVyYXRpb24ucmVjb3JkLCBvcGVyYXRpb24ucmVsYXRpb25zaGlwLCBvcGVyYXRpb24ucmVsYXRlZFJlY29yZCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgY2FzZSAncmVwbGFjZVJlbGF0ZWRSZWNvcmRzJzpcclxuICAgICAgICB0aGlzLmNhY2hlLnJlbGF0aW9uc2hpcHMucmVwbGFjZVJlbGF0ZWRSZWNvcmRzKG9wZXJhdGlvbi5yZWNvcmQsIG9wZXJhdGlvbi5yZWxhdGlvbnNoaXAsIG9wZXJhdGlvbi5yZWxhdGVkUmVjb3Jkcyk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgY2FzZSAnYWRkVG9SZWxhdGVkUmVjb3Jkcyc6XHJcbiAgICAgICAgdGhpcy5jYWNoZS5yZWxhdGlvbnNoaXBzLmFkZFRvUmVsYXRlZFJlY29yZHMob3BlcmF0aW9uLnJlY29yZCwgb3BlcmF0aW9uLnJlbGF0aW9uc2hpcCwgb3BlcmF0aW9uLnJlbGF0ZWRSZWNvcmQpO1xyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGNhc2UgJ3JlbW92ZUZyb21SZWxhdGVkUmVjb3Jkcyc6XHJcbiAgICAgICAgdGhpcy5jYWNoZS5yZWxhdGlvbnNoaXBzLnJlbW92ZUZyb21SZWxhdGVkUmVjb3JkcyhvcGVyYXRpb24ucmVjb3JkLCBvcGVyYXRpb24ucmVsYXRpb25zaGlwLCBvcGVyYXRpb24ucmVsYXRlZFJlY29yZCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgY2FzZSAnYWRkUmVjb3JkJzpcclxuICAgICAgICB0aGlzLmNhY2hlLnJlbGF0aW9uc2hpcHMuYWRkUmVjb3JkKG9wZXJhdGlvbi5yZWNvcmQpO1xyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGNhc2UgJ3JlcGxhY2VSZWNvcmQnOlxyXG4gICAgICAgIHRoaXMuY2FjaGUucmVsYXRpb25zaGlwcy5yZXBsYWNlUmVjb3JkKG9wZXJhdGlvbi5yZWNvcmQpO1xyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGNhc2UgJ3JlbW92ZVJlY29yZCc6XHJcbiAgICAgICAgdGhpcy5jYWNoZS5yZWxhdGlvbnNoaXBzLmNsZWFyUmVjb3JkKG9wZXJhdGlvbi5yZWNvcmQpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZpbmFsbHkob3BlcmF0aW9uKTogUmVjb3JkT3BlcmF0aW9uW10ge1xyXG4gICAgc3dpdGNoIChvcGVyYXRpb24ub3ApIHtcclxuICAgICAgY2FzZSAncmVwbGFjZVJlbGF0ZWRSZWNvcmQnOlxyXG4gICAgICAgIHRoaXMuY2FjaGUuaW52ZXJzZVJlbGF0aW9uc2hpcHMucmVsYXRlZFJlY29yZEFkZGVkKG9wZXJhdGlvbi5yZWNvcmQsIG9wZXJhdGlvbi5yZWxhdGlvbnNoaXAsIG9wZXJhdGlvbi5yZWxhdGVkUmVjb3JkKTtcclxuICAgICAgICByZXR1cm4gW107XHJcblxyXG4gICAgICBjYXNlICdyZXBsYWNlUmVsYXRlZFJlY29yZHMnOlxyXG4gICAgICAgIHRoaXMuY2FjaGUuaW52ZXJzZVJlbGF0aW9uc2hpcHMucmVsYXRlZFJlY29yZHNBZGRlZChvcGVyYXRpb24ucmVjb3JkLCBvcGVyYXRpb24ucmVsYXRpb25zaGlwLCBvcGVyYXRpb24ucmVsYXRlZFJlY29yZHMpO1xyXG4gICAgICAgIHJldHVybiBbXTtcclxuXHJcbiAgICAgIGNhc2UgJ2FkZFRvUmVsYXRlZFJlY29yZHMnOlxyXG4gICAgICAgIHRoaXMuY2FjaGUuaW52ZXJzZVJlbGF0aW9uc2hpcHMucmVsYXRlZFJlY29yZEFkZGVkKG9wZXJhdGlvbi5yZWNvcmQsIG9wZXJhdGlvbi5yZWxhdGlvbnNoaXAsIG9wZXJhdGlvbi5yZWxhdGVkUmVjb3JkKTtcclxuICAgICAgICByZXR1cm4gW107XHJcblxyXG4gICAgICBjYXNlICdhZGRSZWNvcmQnOlxyXG4gICAgICAgIHRoaXMuY2FjaGUuaW52ZXJzZVJlbGF0aW9uc2hpcHMucmVjb3JkQWRkZWQob3BlcmF0aW9uLnJlY29yZCk7XHJcbiAgICAgICAgcmV0dXJuIFtdO1xyXG5cclxuICAgICAgY2FzZSAncmVwbGFjZVJlY29yZCc6XHJcbiAgICAgICAgdGhpcy5jYWNoZS5pbnZlcnNlUmVsYXRpb25zaGlwcy5yZWNvcmRBZGRlZChvcGVyYXRpb24ucmVjb3JkKTtcclxuICAgICAgICByZXR1cm4gW107XHJcblxyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIHJldHVybiBbXTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgY2xlYXJJbnZlcnNlUmVsYXRpb25zaGlwT3BzKHJlY29yZDogUmVjb3JkSWRlbnRpdHkpOiBSZWNvcmRPcGVyYXRpb25bXSB7XHJcbiAgICBjb25zdCBvcHM6IFJlY29yZE9wZXJhdGlvbltdID0gW107XHJcbiAgICBjb25zdCBpbnZlcnNlUmVscyA9IHRoaXMuY2FjaGUuaW52ZXJzZVJlbGF0aW9uc2hpcHMuYWxsKHJlY29yZCk7XHJcblxyXG4gICAgaWYgKGludmVyc2VSZWxzLmxlbmd0aCA+IDApIHtcclxuICAgICAgY29uc3QgcmVjb3JkSWRlbnRpdHkgPSBjbG9uZVJlY29yZElkZW50aXR5KHJlY29yZCk7XHJcbiAgICAgIGludmVyc2VSZWxzLmZvckVhY2gocmVsID0+IHtcclxuICAgICAgICBjb25zdCByZWxhdGlvbnNoaXBEZWYgPSB0aGlzLmNhY2hlLnNjaGVtYS5tb2RlbHNbcmVsLnJlY29yZC50eXBlXS5yZWxhdGlvbnNoaXBzW3JlbC5yZWxhdGlvbnNoaXBdO1xyXG4gICAgICAgIGlmIChyZWxhdGlvbnNoaXBEZWYudHlwZSA9PT0gJ2hhc01hbnknKSB7XHJcbiAgICAgICAgICBvcHMucHVzaCh7XHJcbiAgICAgICAgICAgIG9wOiAncmVtb3ZlRnJvbVJlbGF0ZWRSZWNvcmRzJyxcclxuICAgICAgICAgICAgcmVjb3JkOiByZWwucmVjb3JkLFxyXG4gICAgICAgICAgICByZWxhdGlvbnNoaXA6IHJlbC5yZWxhdGlvbnNoaXAsXHJcbiAgICAgICAgICAgIHJlbGF0ZWRSZWNvcmQ6IHJlY29yZElkZW50aXR5XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgb3BzLnB1c2goe1xyXG4gICAgICAgICAgICBvcDogJ3JlcGxhY2VSZWxhdGVkUmVjb3JkJyxcclxuICAgICAgICAgICAgcmVjb3JkOiByZWwucmVjb3JkLFxyXG4gICAgICAgICAgICByZWxhdGlvbnNoaXA6IHJlbC5yZWxhdGlvbnNoaXAsXHJcbiAgICAgICAgICAgIHJlbGF0ZWRSZWNvcmQ6IG51bGxcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG9wcztcclxuICB9XHJcbn1cclxuIl19