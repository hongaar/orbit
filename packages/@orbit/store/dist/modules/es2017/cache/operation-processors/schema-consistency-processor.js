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
var utils_1 = require("@orbit/utils");
var data_1 = require("@orbit/data");
var operation_processor_1 = require("./operation-processor");
var record_identity_map_1 = require("../record-identity-map");
/**
 * An operation processor that ensures that a cache's data is consistent with
 * its associated schema.
 *
 * This includes maintenance of inverse and dependent relationships.
 *
 * @export
 * @class SchemaConsistencyProcessor
 * @extends {OperationProcessor}
 */
var SchemaConsistencyProcessor = (function (_super) {
    __extends(SchemaConsistencyProcessor, _super);
    function SchemaConsistencyProcessor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SchemaConsistencyProcessor.prototype.after = function (operation) {
        switch (operation.op) {
            case 'addRecord':
                return this._recordAdded(operation.record);
            case 'addToRelatedRecords':
                return this._relatedRecordAdded(operation.record, operation.relationship, operation.relatedRecord);
            case 'replaceRelatedRecord':
                return this._relatedRecordReplaced(operation.record, operation.relationship, operation.relatedRecord);
            case 'replaceRelatedRecords':
                return this._relatedRecordsReplaced(operation.record, operation.relationship, operation.relatedRecords);
            case 'removeFromRelatedRecords':
                return this._relatedRecordRemoved(operation.record, operation.relationship, operation.relatedRecord);
            case 'removeRecord':
                return this._recordRemoved(operation.record);
            case 'replaceRecord':
                return this._recordReplaced(operation.record);
            default:
                return [];
        }
    };
    SchemaConsistencyProcessor.prototype._relatedRecordAdded = function (record, relationship, relatedRecord) {
        var ops = [];
        var relationshipDef = this.cache.schema.getModel(record.type).relationships[relationship];
        var inverseRelationship = relationshipDef.inverse;
        if (inverseRelationship && relatedRecord) {
            ops.push(this._addRelationshipOp(relatedRecord, inverseRelationship, record));
        }
        return ops;
    };
    SchemaConsistencyProcessor.prototype._relatedRecordsAdded = function (record, relationship, relatedRecords) {
        var _this = this;
        var ops = [];
        var relationshipDef = this.cache.schema.getModel(record.type).relationships[relationship];
        var inverseRelationship = relationshipDef.inverse;
        if (inverseRelationship && relatedRecords && relatedRecords.length > 0) {
            relatedRecords.forEach(function (relatedRecord) {
                ops.push(_this._addRelationshipOp(relatedRecord, inverseRelationship, record));
            });
        }
        return ops;
    };
    SchemaConsistencyProcessor.prototype._relatedRecordRemoved = function (record, relationship, relatedRecord) {
        var ops = [];
        var relationshipDef = this.cache.schema.getModel(record.type).relationships[relationship];
        var inverseRelationship = relationshipDef.inverse;
        if (inverseRelationship) {
            if (relatedRecord === undefined) {
                var currentRecord = this.cache.records(record.type).get(record.id);
                relatedRecord = currentRecord && utils_1.deepGet(currentRecord, ['relationships', relationship, 'data']);
            }
            if (relatedRecord) {
                ops.push(this._removeRelationshipOp(relatedRecord, inverseRelationship, record));
            }
        }
        return ops;
    };
    SchemaConsistencyProcessor.prototype._relatedRecordReplaced = function (record, relationship, relatedRecord) {
        var ops = [];
        var relationshipDef = this.cache.schema.getModel(record.type).relationships[relationship];
        var inverseRelationship = relationshipDef.inverse;
        if (inverseRelationship) {
            var currentRelatedRecord = this.cache.relationships.relatedRecord(record, relationship);
            if (!data_1.equalRecordIdentities(relatedRecord, currentRelatedRecord)) {
                if (currentRelatedRecord) {
                    ops.push(this._removeRelationshipOp(currentRelatedRecord, inverseRelationship, record));
                }
                if (relatedRecord) {
                    ops.push(this._addRelationshipOp(relatedRecord, inverseRelationship, record));
                }
            }
        }
        return ops;
    };
    SchemaConsistencyProcessor.prototype._relatedRecordsRemoved = function (record, relationship, relatedRecords) {
        var _this = this;
        var ops = [];
        var relationshipDef = this.cache.schema.getModel(record.type).relationships[relationship];
        var inverseRelationship = relationshipDef.inverse;
        if (inverseRelationship) {
            if (relatedRecords === undefined) {
                relatedRecords = this.cache.relationships.relatedRecords(record, relationship);
            }
            if (relatedRecords) {
                relatedRecords.forEach(function (relatedRecord) { return ops.push(_this._removeRelationshipOp(relatedRecord, inverseRelationship, record)); });
            }
        }
        return ops;
    };
    SchemaConsistencyProcessor.prototype._relatedRecordsReplaced = function (record, relationship, relatedRecords) {
        var ops = [];
        var relationshipDef = this.cache.schema.getModel(record.type).relationships[relationship];
        var currentRelatedRecordsMap = this.cache.relationships.relatedRecordsMap(record, relationship);
        var addedRecords;
        if (currentRelatedRecordsMap) {
            var relatedRecordsMap_1 = new record_identity_map_1.default();
            relatedRecords.forEach(function (r) { return relatedRecordsMap_1.add(r); });
            var removedRecords = currentRelatedRecordsMap.exclusiveOf(relatedRecordsMap_1);
            Array.prototype.push.apply(ops, this._removeRelatedRecordsOps(record, relationshipDef, removedRecords));
            addedRecords = relatedRecordsMap_1.exclusiveOf(currentRelatedRecordsMap);
        }
        else {
            addedRecords = relatedRecords;
        }
        Array.prototype.push.apply(ops, this._addRelatedRecordsOps(record, relationshipDef, addedRecords));
        return ops;
    };
    SchemaConsistencyProcessor.prototype._recordAdded = function (record) {
        var _this = this;
        var ops = [];
        var relationships = record.relationships;
        if (relationships) {
            var modelDef_1 = this.cache.schema.getModel(record.type);
            var recordIdentity_1 = data_1.cloneRecordIdentity(record);
            Object.keys(relationships).forEach(function (relationship) {
                var relationshipDef = modelDef_1.relationships[relationship];
                var relationshipData = relationships[relationship] &&
                    relationships[relationship].data;
                var relatedRecords = recordArrayFromData(relationshipData);
                Array.prototype.push.apply(ops, _this._addRelatedRecordsOps(recordIdentity_1, relationshipDef, relatedRecords));
            });
        }
        return ops;
    };
    SchemaConsistencyProcessor.prototype._recordRemoved = function (record) {
        var _this = this;
        var ops = [];
        var currentRecord = this.cache.records(record.type).get(record.id);
        var relationships = currentRecord && currentRecord.relationships;
        if (relationships) {
            var modelDef_2 = this.cache.schema.getModel(record.type);
            var recordIdentity_2 = data_1.cloneRecordIdentity(record);
            Object.keys(relationships).forEach(function (relationship) {
                var relationshipDef = modelDef_2.relationships[relationship];
                var relationshipData = relationships[relationship] &&
                    relationships[relationship].data;
                var relatedRecords = recordArrayFromData(relationshipData);
                Array.prototype.push.apply(ops, _this._removeRelatedRecordsOps(recordIdentity_2, relationshipDef, relatedRecords));
            });
        }
        return ops;
    };
    SchemaConsistencyProcessor.prototype._recordReplaced = function (record) {
        var ops = [];
        if (record.relationships) {
            var modelDef = this.cache.schema.getModel(record.type);
            var recordIdentity = data_1.cloneRecordIdentity(record);
            for (var relationship in record.relationships) {
                var relationshipDef = modelDef.relationships[relationship];
                var relationshipData = record && utils_1.deepGet(record, ['relationships', relationship, 'data']);
                if (relationshipDef.type === 'hasMany') {
                    Array.prototype.push.apply(ops, this._relatedRecordsReplaced(recordIdentity, relationship, relationshipData));
                }
                else {
                    Array.prototype.push.apply(ops, this._relatedRecordReplaced(recordIdentity, relationship, relationshipData));
                }
            }
        }
        return ops;
    };
    SchemaConsistencyProcessor.prototype._addRelatedRecordsOps = function (record, relationshipDef, relatedRecords) {
        var _this = this;
        if (relatedRecords.length > 0 && relationshipDef.inverse) {
            return relatedRecords.map(function (relatedRecord) { return _this._addRelationshipOp(relatedRecord, relationshipDef.inverse, record); });
        }
        return [];
    };
    SchemaConsistencyProcessor.prototype._removeRelatedRecordsOps = function (record, relationshipDef, relatedRecords) {
        var _this = this;
        if (relatedRecords.length > 0) {
            if (relationshipDef.dependent === 'remove') {
                return this._removeDependentRecords(relatedRecords);
            }
            else if (relationshipDef.inverse) {
                return relatedRecords.map(function (relatedRecord) { return _this._removeRelationshipOp(relatedRecord, relationshipDef.inverse, record); });
            }
        }
        return [];
    };
    SchemaConsistencyProcessor.prototype._addRelationshipOp = function (record, relationship, relatedRecord) {
        var relationshipDef = this.cache.schema.getModel(record.type).relationships[relationship];
        var isHasMany = relationshipDef.type === 'hasMany';
        return {
            op: isHasMany ? 'addToRelatedRecords' : 'replaceRelatedRecord',
            record: record,
            relationship: relationship,
            relatedRecord: relatedRecord
        };
    };
    SchemaConsistencyProcessor.prototype._removeRelationshipOp = function (record, relationship, relatedRecord) {
        var relationshipDef = this.cache.schema.getModel(record.type).relationships[relationship];
        var isHasMany = relationshipDef.type === 'hasMany';
        return {
            op: isHasMany ? 'removeFromRelatedRecords' : 'replaceRelatedRecord',
            record: record,
            relationship: relationship,
            relatedRecord: isHasMany ? relatedRecord : null
        };
    };
    SchemaConsistencyProcessor.prototype._removeDependentRecords = function (relatedRecords) {
        return relatedRecords.map(function (record) { return ({
            op: 'removeRecord',
            record: record
        }); });
    };
    return SchemaConsistencyProcessor;
}(operation_processor_1.OperationProcessor));
exports.default = SchemaConsistencyProcessor;
function recordArrayFromData(data) {
    if (utils_1.isArray(data)) {
        return data;
    }
    else if (data) {
        return [data];
    }
    else {
        return [];
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hLWNvbnNpc3RlbmN5LXByb2Nlc3Nvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jYWNoZS9vcGVyYXRpb24tcHJvY2Vzc29ycy9zY2hlbWEtY29uc2lzdGVuY3ktcHJvY2Vzc29yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLHNDQUlzQjtBQUN0QixvQ0FPcUI7QUFDckIsNkRBQTJEO0FBQzNELDhEQUF1RDtBQUV2RDs7Ozs7Ozs7O0dBU0c7QUFDSDtJQUF3RCw4Q0FBa0I7SUFBMUU7O0lBNFBBLENBQUM7SUEzUEMsMENBQUssR0FBTCxVQUFNLFNBQTBCO1FBQzlCLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3JCLEtBQUssV0FBVztnQkFDZCxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7WUFFN0MsS0FBSyxxQkFBcUI7Z0JBQ3hCLE1BQU0sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsWUFBWSxFQUFFLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUVyRyxLQUFLLHNCQUFzQjtnQkFDekIsTUFBTSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxZQUFZLEVBQUUsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBRXhHLEtBQUssdUJBQXVCO2dCQUMxQixNQUFNLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLFlBQVksRUFBRSxTQUFTLENBQUMsY0FBYyxDQUFDLENBQUM7WUFFMUcsS0FBSywwQkFBMEI7Z0JBQzdCLE1BQU0sQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxTQUFTLENB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QUMsSUFBSSxDQUFDLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzVGLElBQU0sU0FBUyxHQUFHLGVBQWUsQ0FBQyxJQUFJLEtBQUssU0FBUyxDQUFDO1FBRXJELE1BQU0sQ0FBa0I7WUFDdEIsRUFBRSxFQUFFLFNBQVMsR0FBRywwQkFBMEIsR0FBRyxzQkFBc0I7WUFDbkUsTUFBTSxRQUFBO1lBQ04sWUFBWSxjQUFBO1lBQ1osYUFBYSxFQUFFLFNBQVMsR0FBRyxhQUFhLEdBQUcsSUFBSTtTQUNoRCxDQUFDO0lBQ0osQ0FBQztJQUVELDREQUF1QixHQUF2QixVQUF3QixjQUFnQztRQUN0RCxNQUFNLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxVQUFBLE1BQU0sSUFBSSxPQUFBLENBQWlCO1lBQ25ELEVBQUUsRUFBRSxjQUFjO1lBQ2xCLE1BQU0sUUFBQTtTQUNQLENBQUEsRUFIbUMsQ0FHbkMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUNILGlDQUFDO0FBQUQsQ0FBQyxBQTVQRCxDQUF3RCx3Q0FBa0IsR0E0UHpFOztBQUVELDZCQUE2QixJQUFTO0lBQ3BDLEVBQUUsQ0FBQyxDQUFDLGVBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEIsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNoQixNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNoQixDQUFDO0lBQUMsSUFBSSxDQUFDLENBQUM7UUFDTixNQUFNLENBQUMsRUFBRSxDQUFDO0lBQ1osQ0FBQztBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG4gIERpY3QsXHJcbiAgZGVlcEdldCxcclxuICBpc0FycmF5XHJcbn0gZnJvbSAnQG9yYml0L3V0aWxzJztcclxuaW1wb3J0IHtcclxuICBjbG9uZVJlY29yZElkZW50aXR5LFxyXG4gIGVxdWFsUmVjb3JkSWRlbnRpdGllcyxcclxuICBSZWNvcmQsXHJcbiAgUmVjb3JkSWRlbnRpdHksXHJcbiAgUmVjb3JkT3BlcmF0aW9uLFxyXG4gIFJlbGF0aW9uc2hpcERlZmluaXRpb25cclxufSBmcm9tICdAb3JiaXQvZGF0YSc7XHJcbmltcG9ydCB7IE9wZXJhdGlvblByb2Nlc3NvciB9IGZyb20gJy4vb3BlcmF0aW9uLXByb2Nlc3Nvcic7XHJcbmltcG9ydCBSZWNvcmRJZGVudGl0eU1hcCBmcm9tICcuLi9yZWNvcmQtaWRlbnRpdHktbWFwJztcclxuXHJcbi8qKlxyXG4gKiBBbiBvcGVyYXRpb24gcHJvY2Vzc29yIHRoYXQgZW5zdXJlcyB0aGF0IGEgY2FjaGUncyBkYXRhIGlzIGNvbnNpc3RlbnQgd2l0aFxyXG4gKiBpdHMgYXNzb2NpYXRlZCBzY2hlbWEuXHJcbiAqXHJcbiAqIFRoaXMgaW5jbHVkZXMgbWFpbnRlbmFuY2Ugb2YgaW52ZXJzZSBhbmQgZGVwZW5kZW50IHJlbGF0aW9uc2hpcHMuXHJcbiAqXHJcbiAqIEBleHBvcnRcclxuICogQGNsYXNzIFNjaGVtYUNvbnNpc3RlbmN5UHJvY2Vzc29yXHJcbiAqIEBleHRlbmRzIHtPcGVyYXRpb25Qcm9jZXNzb3J9XHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY2hlbWFDb25zaXN0ZW5jeVByb2Nlc3NvciBleHRlbmRzIE9wZXJhdGlvblByb2Nlc3NvciB7XHJcbiAgYWZ0ZXIob3BlcmF0aW9uOiBSZWNvcmRPcGVyYXRpb24pOiBSZWNvcmRPcGVyYXRpb25bXSB7XHJcbiAgICBzd2l0Y2ggKG9wZXJhdGlvbi5vcCkge1xyXG4gICAgICBjYXNlICdhZGRSZWNvcmQnOlxyXG4gICAgICAgIHJldHVybiB0aGlzLl9yZWNvcmRBZGRlZChvcGVyYXRpb24ucmVjb3JkKTtcclxuXHJcbiAgICAgIGNhc2UgJ2FkZFRvUmVsYXRlZFJlY29yZHMnOlxyXG4gICAgICAgIHJldHVybiB0aGlzLl9yZWxhdGVkUmVjb3JkQWRkZWQob3BlcmF0aW9uLnJlY29yZCwgb3BlcmF0aW9uLnJlbGF0aW9uc2hpcCwgb3BlcmF0aW9uLnJlbGF0ZWRSZWNvcmQpO1xyXG5cclxuICAgICAgY2FzZSAncmVwbGFjZVJlbGF0ZWRSZWNvcmQnOlxyXG4gICAgICAgIHJldHVybiB0aGlzLl9yZWxhdGVkUmVjb3JkUmVwbGFjZWQob3BlcmF0aW9uLnJlY29yZCwgb3BlcmF0aW9uLnJlbGF0aW9uc2hpcCwgb3BlcmF0aW9uLnJlbGF0ZWRSZWNvcmQpO1xyXG5cclxuICAgICAgY2FzZSAncmVwbGFjZVJlbGF0ZWRSZWNvcmRzJzpcclxuICAgICAgICByZXR1cm4gdGhpcy5fcmVsYXRlZFJlY29yZHNSZXBsYWNlZChvcGVyYXRpb24ucmVjb3JkLCBvcGVyYXRpb24ucmVsYXRpb25zaGlwLCBvcGVyYXRpb24ucmVsYXRlZFJlY29yZHMpO1xyXG5cclxuICAgICAgY2FzZSAncmVtb3ZlRnJvbVJlbGF0ZWRSZWNvcmRzJzpcclxuICAgICAgICByZXR1cm4gdGhpcy5fcmVsYXRlZFJlY29yZFJlbW92ZWQob3BlcmF0aW9uLnJlY29yZCwgb3BlcmF0aW9uLnJlbGF0aW9uc2hpcCwgb3BlcmF0aW9uLnJlbGF0ZWRSZWNvcmQpO1xyXG5cclxuICAgICAgY2FzZSAncmVtb3ZlUmVjb3JkJzpcclxuICAgICAgICByZXR1cm4gdGhpcy5fcmVjb3JkUmVtb3ZlZChvcGVyYXRpb24ucmVjb3JkKTtcclxuXHJcbiAgICAgIGNhc2UgJ3JlcGxhY2VSZWNvcmQnOlxyXG4gICAgICAgIHJldHVybiB0aGlzLl9yZWNvcmRSZXBsYWNlZChvcGVyYXRpb24ucmVjb3JkKTtcclxuXHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgX3JlbGF0ZWRSZWNvcmRBZGRlZChyZWNvcmQ6IFJlY29yZElkZW50aXR5LCByZWxhdGlvbnNoaXA6IHN0cmluZywgcmVsYXRlZFJlY29yZDogUmVjb3JkSWRlbnRpdHkpOiBSZWNvcmRPcGVyYXRpb25bXSB7XHJcbiAgICBjb25zdCBvcHM6IFJlY29yZE9wZXJhdGlvbltdID0gW107XHJcbiAgICBjb25zdCByZWxhdGlvbnNoaXBEZWYgPSB0aGlzLmNhY2hlLnNjaGVtYS5nZXRNb2RlbChyZWNvcmQudHlwZSkucmVsYXRpb25zaGlwc1tyZWxhdGlvbnNoaXBdO1xyXG4gICAgY29uc3QgaW52ZXJzZVJlbGF0aW9uc2hpcCA9IHJlbGF0aW9uc2hpcERlZi5pbnZlcnNlO1xyXG5cclxuICAgIGlmIChpbnZlcnNlUmVsYXRpb25zaGlwICYmIHJlbGF0ZWRSZWNvcmQpIHtcclxuICAgICAgb3BzLnB1c2godGhpcy5fYWRkUmVsYXRpb25zaGlwT3AocmVsYXRlZFJlY29yZCwgaW52ZXJzZVJlbGF0aW9uc2hpcCwgcmVjb3JkKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG9wcztcclxuICB9XHJcblxyXG4gIF9yZWxhdGVkUmVjb3Jkc0FkZGVkKHJlY29yZDogUmVjb3JkSWRlbnRpdHksIHJlbGF0aW9uc2hpcDogc3RyaW5nLCByZWxhdGVkUmVjb3JkczogUmVjb3JkSWRlbnRpdHlbXSk6IFJlY29yZE9wZXJhdGlvbltdIHtcclxuICAgIGNvbnN0IG9wczogUmVjb3JkT3BlcmF0aW9uW10gPSBbXTtcclxuICAgIGNvbnN0IHJlbGF0aW9uc2hpcERlZiA9IHRoaXMuY2FjaGUuc2NoZW1hLmdldE1vZGVsKHJlY29yZC50eXBlKS5yZWxhdGlvbnNoaXBzW3JlbGF0aW9uc2hpcF07XHJcbiAgICBjb25zdCBpbnZlcnNlUmVsYXRpb25zaGlwID0gcmVsYXRpb25zaGlwRGVmLmludmVyc2U7XHJcblxyXG4gICAgaWYgKGludmVyc2VSZWxhdGlvbnNoaXAgJiYgcmVsYXRlZFJlY29yZHMgJiYgcmVsYXRlZFJlY29yZHMubGVuZ3RoID4gMCkge1xyXG4gICAgICByZWxhdGVkUmVjb3Jkcy5mb3JFYWNoKHJlbGF0ZWRSZWNvcmQgPT4ge1xyXG4gICAgICAgIG9wcy5wdXNoKHRoaXMuX2FkZFJlbGF0aW9uc2hpcE9wKHJlbGF0ZWRSZWNvcmQsIGludmVyc2VSZWxhdGlvbnNoaXAsIHJlY29yZCkpXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBvcHM7XHJcbiAgfVxyXG5cclxuICBfcmVsYXRlZFJlY29yZFJlbW92ZWQocmVjb3JkOiBSZWNvcmRJZGVudGl0eSwgcmVsYXRpb25zaGlwOiBzdHJpbmcsIHJlbGF0ZWRSZWNvcmQ6IFJlY29yZElkZW50aXR5KTogUmVjb3JkT3BlcmF0aW9uW10ge1xyXG4gICAgY29uc3Qgb3BzOiBSZWNvcmRPcGVyYXRpb25bXSA9IFtdO1xyXG4gICAgY29uc3QgcmVsYXRpb25zaGlwRGVmID0gdGhpcy5jYWNoZS5zY2hlbWEuZ2V0TW9kZWwocmVjb3JkLnR5cGUpLnJlbGF0aW9uc2hpcHNbcmVsYXRpb25zaGlwXTtcclxuICAgIGNvbnN0IGludmVyc2VSZWxhdGlvbnNoaXAgPSByZWxhdGlvbnNoaXBEZWYuaW52ZXJzZTtcclxuXHJcbiAgICBpZiAoaW52ZXJzZVJlbGF0aW9uc2hpcCkge1xyXG4gICAgICBpZiAocmVsYXRlZFJlY29yZCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgY29uc3QgY3VycmVudFJlY29yZCA9IHRoaXMuY2FjaGUucmVjb3JkcyhyZWNvcmQudHlwZSkuZ2V0KHJlY29yZC5pZCk7XHJcbiAgICAgICAgcmVsYXRlZFJlY29yZCA9IGN1cnJlbnRSZWNvcmQgJiYgZGVlcEdldChjdXJyZW50UmVjb3JkLCBbJ3JlbGF0aW9uc2hpcHMnLCByZWxhdGlvbnNoaXAsICdkYXRhJ10pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocmVsYXRlZFJlY29yZCkge1xyXG4gICAgICAgIG9wcy5wdXNoKHRoaXMuX3JlbW92ZVJlbGF0aW9uc2hpcE9wKHJlbGF0ZWRSZWNvcmQsIGludmVyc2VSZWxhdGlvbnNoaXAsIHJlY29yZCkpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG9wcztcclxuICB9XHJcblxyXG4gIF9yZWxhdGVkUmVjb3JkUmVwbGFjZWQocmVjb3JkOiBSZWNvcmRJZGVudGl0eSwgcmVsYXRpb25zaGlwOiBzdHJpbmcsIHJlbGF0ZWRSZWNvcmQ6IFJlY29yZElkZW50aXR5KTogUmVjb3JkT3BlcmF0aW9uW10ge1xyXG4gICAgY29uc3Qgb3BzOiBSZWNvcmRPcGVyYXRpb25bXSA9IFtdO1xyXG4gICAgY29uc3QgcmVsYXRpb25zaGlwRGVmID0gdGhpcy5jYWNoZS5zY2hlbWEuZ2V0TW9kZWwocmVjb3JkLnR5cGUpLnJlbGF0aW9uc2hpcHNbcmVsYXRpb25zaGlwXTtcclxuICAgIGNvbnN0IGludmVyc2VSZWxhdGlvbnNoaXAgPSByZWxhdGlvbnNoaXBEZWYuaW52ZXJzZTtcclxuXHJcbiAgICBpZiAoaW52ZXJzZVJlbGF0aW9uc2hpcCkge1xyXG4gICAgICBsZXQgY3VycmVudFJlbGF0ZWRSZWNvcmQgPSB0aGlzLmNhY2hlLnJlbGF0aW9uc2hpcHMucmVsYXRlZFJlY29yZChyZWNvcmQsIHJlbGF0aW9uc2hpcCk7XHJcblxyXG4gICAgICBpZiAoIWVxdWFsUmVjb3JkSWRlbnRpdGllcyhyZWxhdGVkUmVjb3JkLCBjdXJyZW50UmVsYXRlZFJlY29yZCkpIHtcclxuICAgICAgICBpZiAoY3VycmVudFJlbGF0ZWRSZWNvcmQpIHtcclxuICAgICAgICAgIG9wcy5wdXNoKHRoaXMuX3JlbW92ZVJlbGF0aW9uc2hpcE9wKGN1cnJlbnRSZWxhdGVkUmVjb3JkLCBpbnZlcnNlUmVsYXRpb25zaGlwLCByZWNvcmQpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChyZWxhdGVkUmVjb3JkKSB7XHJcbiAgICAgICAgICBvcHMucHVzaCh0aGlzLl9hZGRSZWxhdGlvbnNoaXBPcChyZWxhdGVkUmVjb3JkLCBpbnZlcnNlUmVsYXRpb25zaGlwLCByZWNvcmQpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gb3BzO1xyXG4gIH1cclxuXHJcbiAgX3JlbGF0ZWRSZWNvcmRzUmVtb3ZlZChyZWNvcmQ6IFJlY29yZElkZW50aXR5LCByZWxhdGlvbnNoaXA6IHN0cmluZywgcmVsYXRlZFJlY29yZHM6IFJlY29yZElkZW50aXR5W10pOiBSZWNvcmRPcGVyYXRpb25bXSB7XHJcbiAgICBjb25zdCBvcHM6IFJlY29yZE9wZXJhdGlvbltdID0gW107XHJcbiAgICBjb25zdCByZWxhdGlvbnNoaXBEZWYgPSB0aGlzLmNhY2hlLnNjaGVtYS5nZXRNb2RlbChyZWNvcmQudHlwZSkucmVsYXRpb25zaGlwc1tyZWxhdGlvbnNoaXBdO1xyXG4gICAgY29uc3QgaW52ZXJzZVJlbGF0aW9uc2hpcCA9IHJlbGF0aW9uc2hpcERlZi5pbnZlcnNlO1xyXG5cclxuICAgIGlmIChpbnZlcnNlUmVsYXRpb25zaGlwKSB7XHJcbiAgICAgIGlmIChyZWxhdGVkUmVjb3JkcyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgcmVsYXRlZFJlY29yZHMgPSB0aGlzLmNhY2hlLnJlbGF0aW9uc2hpcHMucmVsYXRlZFJlY29yZHMocmVjb3JkLCByZWxhdGlvbnNoaXApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocmVsYXRlZFJlY29yZHMpIHtcclxuICAgICAgICByZWxhdGVkUmVjb3Jkcy5mb3JFYWNoKHJlbGF0ZWRSZWNvcmQgPT4gb3BzLnB1c2godGhpcy5fcmVtb3ZlUmVsYXRpb25zaGlwT3AocmVsYXRlZFJlY29yZCwgaW52ZXJzZVJlbGF0aW9uc2hpcCwgcmVjb3JkKSkpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG9wcztcclxuICB9XHJcblxyXG4gIF9yZWxhdGVkUmVjb3Jkc1JlcGxhY2VkKHJlY29yZDogUmVjb3JkSWRlbnRpdHksIHJlbGF0aW9uc2hpcDogc3RyaW5nLCByZWxhdGVkUmVjb3JkczogUmVjb3JkSWRlbnRpdHlbXSk6IFJlY29yZE9wZXJhdGlvbltdIHtcclxuICAgIGNvbnN0IG9wczogUmVjb3JkT3BlcmF0aW9uW10gPSBbXTtcclxuICAgIGNvbnN0IHJlbGF0aW9uc2hpcERlZiA9IHRoaXMuY2FjaGUuc2NoZW1hLmdldE1vZGVsKHJlY29yZC50eXBlKS5yZWxhdGlvbnNoaXBzW3JlbGF0aW9uc2hpcF07XHJcbiAgICBjb25zdCBjdXJyZW50UmVsYXRlZFJlY29yZHNNYXAgPSB0aGlzLmNhY2hlLnJlbGF0aW9uc2hpcHMucmVsYXRlZFJlY29yZHNNYXAocmVjb3JkLCByZWxhdGlvbnNoaXApO1xyXG5cclxuICAgIGxldCBhZGRlZFJlY29yZHM7XHJcblxyXG4gICAgaWYgKGN1cnJlbnRSZWxhdGVkUmVjb3Jkc01hcCkge1xyXG4gICAgICBjb25zdCByZWxhdGVkUmVjb3Jkc01hcCA9IG5ldyBSZWNvcmRJZGVudGl0eU1hcCgpO1xyXG4gICAgICByZWxhdGVkUmVjb3Jkcy5mb3JFYWNoKHIgPT4gcmVsYXRlZFJlY29yZHNNYXAuYWRkKHIpKTtcclxuXHJcbiAgICAgIGxldCByZW1vdmVkUmVjb3JkcyA9IGN1cnJlbnRSZWxhdGVkUmVjb3Jkc01hcC5leGNsdXNpdmVPZihyZWxhdGVkUmVjb3Jkc01hcCk7XHJcbiAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KG9wcywgdGhpcy5fcmVtb3ZlUmVsYXRlZFJlY29yZHNPcHMocmVjb3JkLCByZWxhdGlvbnNoaXBEZWYsIHJlbW92ZWRSZWNvcmRzKSk7XHJcblxyXG4gICAgICBhZGRlZFJlY29yZHMgPSByZWxhdGVkUmVjb3Jkc01hcC5leGNsdXNpdmVPZihjdXJyZW50UmVsYXRlZFJlY29yZHNNYXApO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgYWRkZWRSZWNvcmRzID0gcmVsYXRlZFJlY29yZHM7XHJcbiAgICB9XHJcblxyXG4gICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkob3BzLCB0aGlzLl9hZGRSZWxhdGVkUmVjb3Jkc09wcyhyZWNvcmQsIHJlbGF0aW9uc2hpcERlZiwgYWRkZWRSZWNvcmRzKSk7XHJcblxyXG4gICAgcmV0dXJuIG9wcztcclxuICB9XHJcblxyXG4gIF9yZWNvcmRBZGRlZChyZWNvcmQ6IFJlY29yZCk6IFJlY29yZE9wZXJhdGlvbltdIHtcclxuICAgIGNvbnN0IG9wczogUmVjb3JkT3BlcmF0aW9uW10gPSBbXTtcclxuICAgIGNvbnN0IHJlbGF0aW9uc2hpcHMgPSByZWNvcmQucmVsYXRpb25zaGlwcztcclxuXHJcbiAgICBpZiAocmVsYXRpb25zaGlwcykge1xyXG4gICAgICBjb25zdCBtb2RlbERlZiA9IHRoaXMuY2FjaGUuc2NoZW1hLmdldE1vZGVsKHJlY29yZC50eXBlKTtcclxuICAgICAgY29uc3QgcmVjb3JkSWRlbnRpdHkgPSBjbG9uZVJlY29yZElkZW50aXR5KHJlY29yZCk7XHJcblxyXG4gICAgICBPYmplY3Qua2V5cyhyZWxhdGlvbnNoaXBzKS5mb3JFYWNoKHJlbGF0aW9uc2hpcCA9PiB7XHJcbiAgICAgICAgY29uc3QgcmVsYXRpb25zaGlwRGVmID0gbW9kZWxEZWYucmVsYXRpb25zaGlwc1tyZWxhdGlvbnNoaXBdO1xyXG5cclxuICAgICAgICBjb25zdCByZWxhdGlvbnNoaXBEYXRhID0gcmVsYXRpb25zaGlwc1tyZWxhdGlvbnNoaXBdICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbGF0aW9uc2hpcHNbcmVsYXRpb25zaGlwXS5kYXRhO1xyXG4gICAgICAgIGNvbnN0IHJlbGF0ZWRSZWNvcmRzID0gcmVjb3JkQXJyYXlGcm9tRGF0YShyZWxhdGlvbnNoaXBEYXRhKTtcclxuXHJcbiAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkob3BzLCB0aGlzLl9hZGRSZWxhdGVkUmVjb3Jkc09wcyhyZWNvcmRJZGVudGl0eSwgcmVsYXRpb25zaGlwRGVmLCByZWxhdGVkUmVjb3JkcykpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gb3BzO1xyXG4gIH1cclxuXHJcbiAgX3JlY29yZFJlbW92ZWQocmVjb3JkOiBSZWNvcmRJZGVudGl0eSk6IFJlY29yZE9wZXJhdGlvbltdIHtcclxuICAgIGNvbnN0IG9wczogUmVjb3JkT3BlcmF0aW9uW10gPSBbXTtcclxuICAgIGNvbnN0IGN1cnJlbnRSZWNvcmQgPSB0aGlzLmNhY2hlLnJlY29yZHMocmVjb3JkLnR5cGUpLmdldChyZWNvcmQuaWQpO1xyXG4gICAgY29uc3QgcmVsYXRpb25zaGlwcyA9IGN1cnJlbnRSZWNvcmQgJiYgY3VycmVudFJlY29yZC5yZWxhdGlvbnNoaXBzO1xyXG5cclxuICAgIGlmIChyZWxhdGlvbnNoaXBzKSB7XHJcbiAgICAgIGNvbnN0IG1vZGVsRGVmID0gdGhpcy5jYWNoZS5zY2hlbWEuZ2V0TW9kZWwocmVjb3JkLnR5cGUpO1xyXG4gICAgICBjb25zdCByZWNvcmRJZGVudGl0eSA9IGNsb25lUmVjb3JkSWRlbnRpdHkocmVjb3JkKTtcclxuXHJcbiAgICAgIE9iamVjdC5rZXlzKHJlbGF0aW9uc2hpcHMpLmZvckVhY2gocmVsYXRpb25zaGlwID0+IHtcclxuICAgICAgICBjb25zdCByZWxhdGlvbnNoaXBEZWYgPSBtb2RlbERlZi5yZWxhdGlvbnNoaXBzW3JlbGF0aW9uc2hpcF07XHJcbiAgICAgICAgY29uc3QgcmVsYXRpb25zaGlwRGF0YSA9IHJlbGF0aW9uc2hpcHNbcmVsYXRpb25zaGlwXSAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWxhdGlvbnNoaXBzW3JlbGF0aW9uc2hpcF0uZGF0YTtcclxuICAgICAgICBjb25zdCByZWxhdGVkUmVjb3JkcyA9IHJlY29yZEFycmF5RnJvbURhdGEocmVsYXRpb25zaGlwRGF0YSk7XHJcblxyXG4gICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KG9wcywgdGhpcy5fcmVtb3ZlUmVsYXRlZFJlY29yZHNPcHMocmVjb3JkSWRlbnRpdHksIHJlbGF0aW9uc2hpcERlZiwgcmVsYXRlZFJlY29yZHMpKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG9wcztcclxuICB9XHJcblxyXG4gIF9yZWNvcmRSZXBsYWNlZChyZWNvcmQ6IFJlY29yZCk6IFJlY29yZE9wZXJhdGlvbltdIHtcclxuICAgIGNvbnN0IG9wczogUmVjb3JkT3BlcmF0aW9uW10gPSBbXTtcclxuXHJcbiAgICBpZiAocmVjb3JkLnJlbGF0aW9uc2hpcHMpIHtcclxuICAgICAgY29uc3QgbW9kZWxEZWYgPSB0aGlzLmNhY2hlLnNjaGVtYS5nZXRNb2RlbChyZWNvcmQudHlwZSk7XHJcbiAgICAgIGNvbnN0IHJlY29yZElkZW50aXR5ID0gY2xvbmVSZWNvcmRJZGVudGl0eShyZWNvcmQpO1xyXG5cclxuICAgICAgZm9yIChsZXQgcmVsYXRpb25zaGlwIGluIHJlY29yZC5yZWxhdGlvbnNoaXBzKSB7XHJcbiAgICAgICAgY29uc3QgcmVsYXRpb25zaGlwRGVmID0gbW9kZWxEZWYucmVsYXRpb25zaGlwc1tyZWxhdGlvbnNoaXBdO1xyXG4gICAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcERhdGEgPSByZWNvcmQgJiYgZGVlcEdldChyZWNvcmQsIFsncmVsYXRpb25zaGlwcycsIHJlbGF0aW9uc2hpcCwgJ2RhdGEnXSk7XHJcblxyXG4gICAgICAgIGlmIChyZWxhdGlvbnNoaXBEZWYudHlwZSA9PT0gJ2hhc01hbnknKSB7XHJcbiAgICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShvcHMsIHRoaXMuX3JlbGF0ZWRSZWNvcmRzUmVwbGFjZWQocmVjb3JkSWRlbnRpdHksIHJlbGF0aW9uc2hpcCwgcmVsYXRpb25zaGlwRGF0YSkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShvcHMsIHRoaXMuX3JlbGF0ZWRSZWNvcmRSZXBsYWNlZChyZWNvcmRJZGVudGl0eSwgcmVsYXRpb25zaGlwLCByZWxhdGlvbnNoaXBEYXRhKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG9wcztcclxuICB9XHJcblxyXG4gIF9hZGRSZWxhdGVkUmVjb3Jkc09wcyhyZWNvcmQ6IFJlY29yZElkZW50aXR5LCByZWxhdGlvbnNoaXBEZWY6IFJlbGF0aW9uc2hpcERlZmluaXRpb24sIHJlbGF0ZWRSZWNvcmRzOiBSZWNvcmRJZGVudGl0eVtdKTogUmVjb3JkT3BlcmF0aW9uW10ge1xyXG4gICAgaWYgKHJlbGF0ZWRSZWNvcmRzLmxlbmd0aCA+IDAgJiYgcmVsYXRpb25zaGlwRGVmLmludmVyc2UpIHtcclxuICAgICAgcmV0dXJuIHJlbGF0ZWRSZWNvcmRzLm1hcChyZWxhdGVkUmVjb3JkID0+IHRoaXMuX2FkZFJlbGF0aW9uc2hpcE9wKHJlbGF0ZWRSZWNvcmQsIHJlbGF0aW9uc2hpcERlZi5pbnZlcnNlLCByZWNvcmQpKTtcclxuICAgIH1cclxuICAgIHJldHVybiBbXTtcclxuICB9XHJcblxyXG4gIF9yZW1vdmVSZWxhdGVkUmVjb3Jkc09wcyhyZWNvcmQ6IFJlY29yZElkZW50aXR5LCByZWxhdGlvbnNoaXBEZWY6IFJlbGF0aW9uc2hpcERlZmluaXRpb24sIHJlbGF0ZWRSZWNvcmRzOiBSZWNvcmRJZGVudGl0eVtdKTogUmVjb3JkT3BlcmF0aW9uW10ge1xyXG4gICAgaWYgKHJlbGF0ZWRSZWNvcmRzLmxlbmd0aCA+IDApIHtcclxuICAgICAgaWYgKHJlbGF0aW9uc2hpcERlZi5kZXBlbmRlbnQgPT09ICdyZW1vdmUnKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlbW92ZURlcGVuZGVudFJlY29yZHMocmVsYXRlZFJlY29yZHMpO1xyXG4gICAgICB9IGVsc2UgaWYgKHJlbGF0aW9uc2hpcERlZi5pbnZlcnNlKSB7XHJcbiAgICAgICAgcmV0dXJuIHJlbGF0ZWRSZWNvcmRzLm1hcChyZWxhdGVkUmVjb3JkID0+IHRoaXMuX3JlbW92ZVJlbGF0aW9uc2hpcE9wKHJlbGF0ZWRSZWNvcmQsIHJlbGF0aW9uc2hpcERlZi5pbnZlcnNlLCByZWNvcmQpKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIFtdO1xyXG4gIH1cclxuXHJcbiAgX2FkZFJlbGF0aW9uc2hpcE9wKHJlY29yZDogUmVjb3JkSWRlbnRpdHksIHJlbGF0aW9uc2hpcDogc3RyaW5nLCByZWxhdGVkUmVjb3JkOiBSZWNvcmRJZGVudGl0eSk6IFJlY29yZE9wZXJhdGlvbiB7XHJcbiAgICBjb25zdCByZWxhdGlvbnNoaXBEZWYgPSB0aGlzLmNhY2hlLnNjaGVtYS5nZXRNb2RlbChyZWNvcmQudHlwZSkucmVsYXRpb25zaGlwc1tyZWxhdGlvbnNoaXBdO1xyXG4gICAgY29uc3QgaXNIYXNNYW55ID0gcmVsYXRpb25zaGlwRGVmLnR5cGUgPT09ICdoYXNNYW55JztcclxuXHJcbiAgICByZXR1cm4gPFJlY29yZE9wZXJhdGlvbj57XHJcbiAgICAgIG9wOiBpc0hhc01hbnkgPyAnYWRkVG9SZWxhdGVkUmVjb3JkcycgOiAncmVwbGFjZVJlbGF0ZWRSZWNvcmQnLFxyXG4gICAgICByZWNvcmQsXHJcbiAgICAgIHJlbGF0aW9uc2hpcCxcclxuICAgICAgcmVsYXRlZFJlY29yZFxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIF9yZW1vdmVSZWxhdGlvbnNoaXBPcChyZWNvcmQ6IFJlY29yZElkZW50aXR5LCByZWxhdGlvbnNoaXA6IHN0cmluZywgcmVsYXRlZFJlY29yZDogUmVjb3JkSWRlbnRpdHkpOiBSZWNvcmRPcGVyYXRpb24ge1xyXG4gICAgY29uc3QgcmVsYXRpb25zaGlwRGVmID0gdGhpcy5jYWNoZS5zY2hlbWEuZ2V0TW9kZWwocmVjb3JkLnR5cGUpLnJlbGF0aW9uc2hpcHNbcmVsYXRpb25zaGlwXTtcclxuICAgIGNvbnN0IGlzSGFzTWFueSA9IHJlbGF0aW9uc2hpcERlZi50eXBlID09PSAnaGFzTWFueSc7XHJcblxyXG4gICAgcmV0dXJuIDxSZWNvcmRPcGVyYXRpb24+e1xyXG4gICAgICBvcDogaXNIYXNNYW55ID8gJ3JlbW92ZUZyb21SZWxhdGVkUmVjb3JkcycgOiAncmVwbGFjZVJlbGF0ZWRSZWNvcmQnLFxyXG4gICAgICByZWNvcmQsXHJcbiAgICAgIHJlbGF0aW9uc2hpcCxcclxuICAgICAgcmVsYXRlZFJlY29yZDogaXNIYXNNYW55ID8gcmVsYXRlZFJlY29yZCA6IG51bGxcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBfcmVtb3ZlRGVwZW5kZW50UmVjb3JkcyhyZWxhdGVkUmVjb3JkczogUmVjb3JkSWRlbnRpdHlbXSk6IFJlY29yZE9wZXJhdGlvbltdIHtcclxuICAgIHJldHVybiByZWxhdGVkUmVjb3Jkcy5tYXAocmVjb3JkID0+IDxSZWNvcmRPcGVyYXRpb24+e1xyXG4gICAgICBvcDogJ3JlbW92ZVJlY29yZCcsXHJcbiAgICAgIHJlY29yZFxyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiByZWNvcmRBcnJheUZyb21EYXRhKGRhdGE6IGFueSk6IFJlY29yZElkZW50aXR5W10ge1xyXG4gIGlmIChpc0FycmF5KGRhdGEpKSB7XHJcbiAgICByZXR1cm4gZGF0YTtcclxuICB9IGVsc2UgaWYgKGRhdGEpIHtcclxuICAgIHJldHVybiBbZGF0YV07XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiBbXTtcclxuICB9XHJcbn1cclxuIl19