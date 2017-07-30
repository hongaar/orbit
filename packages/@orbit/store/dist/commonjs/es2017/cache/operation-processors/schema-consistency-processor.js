"use strict";

var __extends = undefined && undefined.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
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
var SchemaConsistencyProcessor = function (_super) {
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
        var relationshipDef = this.cache.schema.models[record.type].relationships[relationship];
        var inverseRelationship = relationshipDef.inverse;
        if (inverseRelationship && relatedRecord) {
            ops.push(this._addRelationshipOp(relatedRecord, inverseRelationship, record));
        }
        return ops;
    };
    SchemaConsistencyProcessor.prototype._relatedRecordsAdded = function (record, relationship, relatedRecords) {
        var _this = this;
        var ops = [];
        var relationshipDef = this.cache.schema.models[record.type].relationships[relationship];
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
        var relationshipDef = this.cache.schema.models[record.type].relationships[relationship];
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
        var relationshipDef = this.cache.schema.models[record.type].relationships[relationship];
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
        var relationshipDef = this.cache.schema.models[record.type].relationships[relationship];
        var inverseRelationship = relationshipDef.inverse;
        if (inverseRelationship) {
            if (relatedRecords === undefined) {
                relatedRecords = this.cache.relationships.relatedRecords(record, relationship);
            }
            if (relatedRecords) {
                relatedRecords.forEach(function (relatedRecord) {
                    return ops.push(_this._removeRelationshipOp(relatedRecord, inverseRelationship, record));
                });
            }
        }
        return ops;
    };
    SchemaConsistencyProcessor.prototype._relatedRecordsReplaced = function (record, relationship, relatedRecords) {
        var ops = [];
        var relationshipDef = this.cache.schema.models[record.type].relationships[relationship];
        var currentRelatedRecordsMap = this.cache.relationships.relatedRecordsMap(record, relationship);
        var addedRecords;
        if (currentRelatedRecordsMap) {
            var relatedRecordsMap_1 = new record_identity_map_1.default();
            relatedRecords.forEach(function (r) {
                return relatedRecordsMap_1.add(r);
            });
            var removedRecords = currentRelatedRecordsMap.exclusiveOf(relatedRecordsMap_1);
            Array.prototype.push.apply(ops, this._removeRelatedRecordsOps(record, relationshipDef, removedRecords));
            addedRecords = relatedRecordsMap_1.exclusiveOf(currentRelatedRecordsMap);
        } else {
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
            var modelDef_1 = this.cache.schema.models[record.type];
            var recordIdentity_1 = data_1.cloneRecordIdentity(record);
            Object.keys(relationships).forEach(function (relationship) {
                var relationshipDef = modelDef_1.relationships[relationship];
                var relationshipData = relationships[relationship] && relationships[relationship].data;
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
            var modelDef_2 = this.cache.schema.models[record.type];
            var recordIdentity_2 = data_1.cloneRecordIdentity(record);
            Object.keys(relationships).forEach(function (relationship) {
                var relationshipDef = modelDef_2.relationships[relationship];
                var relationshipData = relationships[relationship] && relationships[relationship].data;
                var relatedRecords = recordArrayFromData(relationshipData);
                Array.prototype.push.apply(ops, _this._removeRelatedRecordsOps(recordIdentity_2, relationshipDef, relatedRecords));
            });
        }
        return ops;
    };
    SchemaConsistencyProcessor.prototype._recordReplaced = function (record) {
        var ops = [];
        if (record.relationships) {
            var modelDef = this.cache.schema.models[record.type];
            var recordIdentity = data_1.cloneRecordIdentity(record);
            for (var relationship in record.relationships) {
                var relationshipDef = modelDef.relationships[relationship];
                var relationshipData = record && utils_1.deepGet(record, ['relationships', relationship, 'data']);
                if (relationshipDef.type === 'hasMany') {
                    Array.prototype.push.apply(ops, this._relatedRecordsReplaced(recordIdentity, relationship, relationshipData));
                } else {
                    Array.prototype.push.apply(ops, this._relatedRecordReplaced(recordIdentity, relationship, relationshipData));
                }
            }
        }
        return ops;
    };
    SchemaConsistencyProcessor.prototype._addRelatedRecordsOps = function (record, relationshipDef, relatedRecords) {
        var _this = this;
        if (relatedRecords.length > 0 && relationshipDef.inverse) {
            return relatedRecords.map(function (relatedRecord) {
                return _this._addRelationshipOp(relatedRecord, relationshipDef.inverse, record);
            });
        }
        return [];
    };
    SchemaConsistencyProcessor.prototype._removeRelatedRecordsOps = function (record, relationshipDef, relatedRecords) {
        var _this = this;
        if (relatedRecords.length > 0) {
            if (relationshipDef.dependent === 'remove') {
                return this._removeDependentRecords(relatedRecords);
            } else if (relationshipDef.inverse) {
                return relatedRecords.map(function (relatedRecord) {
                    return _this._removeRelationshipOp(relatedRecord, relationshipDef.inverse, record);
                });
            }
        }
        return [];
    };
    SchemaConsistencyProcessor.prototype._addRelationshipOp = function (record, relationship, relatedRecord) {
        var relationshipDef = this.cache.schema.models[record.type].relationships[relationship];
        var isHasMany = relationshipDef.type === 'hasMany';
        return {
            op: isHasMany ? 'addToRelatedRecords' : 'replaceRelatedRecord',
            record: record,
            relationship: relationship,
            relatedRecord: relatedRecord
        };
    };
    SchemaConsistencyProcessor.prototype._removeRelationshipOp = function (record, relationship, relatedRecord) {
        var relationshipDef = this.cache.schema.models[record.type].relationships[relationship];
        var isHasMany = relationshipDef.type === 'hasMany';
        return {
            op: isHasMany ? 'removeFromRelatedRecords' : 'replaceRelatedRecord',
            record: record,
            relationship: relationship,
            relatedRecord: isHasMany ? relatedRecord : null
        };
    };
    SchemaConsistencyProcessor.prototype._removeDependentRecords = function (relatedRecords) {
        return relatedRecords.map(function (record) {
            return {
                op: 'removeRecord',
                record: record
            };
        });
    };
    return SchemaConsistencyProcessor;
}(operation_processor_1.OperationProcessor);
exports.default = SchemaConsistencyProcessor;
function recordArrayFromData(data) {
    if (utils_1.isArray(data)) {
        return data;
    } else if (data) {
        return [data];
    } else {
        return [];
    }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hLWNvbnNpc3RlbmN5LXByb2Nlc3Nvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jYWNoZS9vcGVyYXRpb24tcHJvY2Vzc29ycy9zY2hlbWEtY29uc2lzdGVuY3ktcHJvY2Vzc29yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsc0JBSXNCO0FBQ3RCLHFCQU9xQjtBQUNyQixvQ0FBMkQ7QUFDM0Qsb0NBQXVEO0FBRXZELEFBU0c7Ozs7Ozs7Ozs7QUFDSDtBQUF3RCwwQ0FBa0I7QUFBMUU7bUVBNFBBO0FBQUM7QUEzUEMseUNBQUssUUFBTCxVQUFNLEFBQTBCO0FBQzlCLEFBQU0sQUFBQyxnQkFBQyxBQUFTLFVBQUMsQUFBRSxBQUFDLEFBQUMsQUFBQztBQUNyQixpQkFBSyxBQUFXO0FBQ2QsQUFBTSx1QkFBQyxBQUFJLEtBQUMsQUFBWSxhQUFDLEFBQVMsVUFBQyxBQUFNLEFBQUMsQUFBQztBQUU3QyxpQkFBSyxBQUFxQjtBQUN4QixBQUFNLHVCQUFDLEFBQUksS0FBQyxBQUFtQixvQkFBQyxBQUFTLFVBQUMsQUFBTSxRQUFFLEFBQVMsVUFBQyxBQUFZLGNBQUUsQUFBUyxVQUFDLEFBQWEsQUFBQyxBQUFDO0FBRXJHLGlCQUFLLEFBQXNCO0FBQ3pCLEFBQU0sdUJBQUMsQUFBSSxLQUFDLEFBQXNCLHVCQUFDLEFBQVMsVUFBQyxBQUFNLFFBQUUsQUFBUyxVQUFDLEFBQVksY0FBRSxBQUFTLFVBQUMsQUFBYSxBQUFDLEFBQUM7QUFFeEcsaUJBQUssQUFBdUI7QUFDMUIsQUFBTSx1QkFBQyxBQUFJLEtBQUMsQUFBdUIsd0JBQUMsQUFBUyxVQUFDLEFBQU0sUUFBRSxBQUFTLFVBQUMsQUFBWSxjQUFFLEFBQVMsVUFBQyxBQUFjLEFBQUMsQUFBQztBQUUxRyxpQkFBSyxBQUEwQjtBQUM3QixBQUFNLHVCQUFDLEFBQUksS0FBQyxBQUFxQixzQkFBQyxBQUFTLFVBQUMsQUFBTSxRQUFFLEFBQVMsVUFBQyxBQUFZLGNBQUUsQUFBUyxVQUFDLEFBQWEsQUFBQyxBQUFDO0FBRXZHLGlCQUFLLEFBQWM7QUFDakIsQUFBTSx1QkFBQyxBQUFJLEtBQUMsQUFBYyxlQUFDLEFBQVMsVUFBQyxBQUFNLEFBQUMsQUFBQztBQUUvQyxpQkFBSyxBQUFlO0FBQ2xCLEFBQU0sdUJBQUMsQUFBSSxLQUFDLEFBQWUsZ0JBQUMsQUFBUyxVQUFDLEFBQU0sQUFBQyxBQUFDO0FBRWhEO0FBQ0UsQUFBTSx1QkFBQyxBQUFFLEFBQUMsQUFDZCxBQUFDLEFBQ0g7O0FBQUM7QUFFRCx5Q0FBbUIsc0JBQW5CLFVBQW9CLEFBQXNCLFFBQUUsQUFBb0IsY0FBRSxBQUE2QjtBQUM3RixZQUFNLEFBQUcsTUFBc0IsQUFBRSxBQUFDO0FBQ2xDLFlBQU0sQUFBZSxrQkFBRyxBQUFJLEtBQUMsQUFBSyxNQUFDLEFBQU0sT0FBQyxBQUFNLE9BQUMsQUFBTSxPQUFDLEFBQUksQUFBQyxNQUFDLEFBQWEsY0FBQyxBQUFZLEFBQUMsQUFBQztBQUMxRixZQUFNLEFBQW1CLHNCQUFHLEFBQWUsZ0JBQUMsQUFBTyxBQUFDO0FBRXBELEFBQUUsQUFBQyxZQUFDLEFBQW1CLHVCQUFJLEFBQWEsQUFBQyxlQUFDLEFBQUM7QUFDekMsQUFBRyxnQkFBQyxBQUFJLEtBQUMsQUFBSSxLQUFDLEFBQWtCLG1CQUFDLEFBQWEsZUFBRSxBQUFtQixxQkFBRSxBQUFNLEFBQUMsQUFBQyxBQUFDLEFBQ2hGO0FBQUM7QUFFRCxBQUFNLGVBQUMsQUFBRyxBQUFDLEFBQ2I7QUFBQztBQUVELHlDQUFvQix1QkFBcEIsVUFBcUIsQUFBc0IsUUFBRSxBQUFvQixjQUFFLEFBQWdDO0FBQW5HLG9CQVlDO0FBWEMsWUFBTSxBQUFHLE1BQXNCLEFBQUUsQUFBQztBQUNsQyxZQUFNLEFBQWUsa0JBQUcsQUFBSSxLQUFDLEFBQUssTUFBQyxBQUFNLE9BQUMsQUFBTSxPQUFDLEFBQU0sT0FBQyxBQUFJLEFBQUMsTUFBQyxBQUFhLGNBQUMsQUFBWSxBQUFDLEFBQUM7QUFDMUYsWUFBTSxBQUFtQixzQkFBRyxBQUFlLGdCQUFDLEFBQU8sQUFBQztBQUVwRCxBQUFFLEFBQUMsWUFBQyxBQUFtQix1QkFBSSxBQUFjLGtCQUFJLEFBQWMsZUFBQyxBQUFNLFNBQUcsQUFBQyxBQUFDLEdBQUMsQUFBQztBQUN2RSxBQUFjLDJCQUFDLEFBQU8sUUFBQyxVQUFBLEFBQWE7QUFDbEMsQUFBRyxvQkFBQyxBQUFJLEtBQUMsQUFBSSxNQUFDLEFBQWtCLG1CQUFDLEFBQWEsZUFBRSxBQUFtQixxQkFBRSxBQUFNLEFBQUMsQUFBQyxBQUMvRTtBQUFDLEFBQUMsQUFBQyxBQUNMO0FBQUM7QUFFRCxBQUFNLGVBQUMsQUFBRyxBQUFDLEFBQ2I7QUFBQztBQUVELHlDQUFxQix3QkFBckIsVUFBc0IsQUFBc0IsUUFBRSxBQUFvQixjQUFFLEFBQTZCO0FBQy9GLFlBQU0sQUFBRyxNQUFzQixBQUFFLEFBQUM7QUFDbEMsWUFBTSxBQUFlLGtCQUFHLEFBQUksS0FBQyxBQUFLLE1BQUMsQUFBTSxPQUFDLEFBQU0sT0FBQyxBQUFNLE9BQUMsQUFBSSxBQUFDLE1BQUMsQUFBYSxjQUFDLEFBQVksQUFBQyxBQUFDO0FBQzFGLFlBQU0sQUFBbUIsc0JBQUcsQUFBZSxnQkFBQyxBQUFPLEFBQUM7QUFFcEQsQUFBRSxBQUFDLFlBQUMsQUFBbUIsQUFBQyxxQkFBQyxBQUFDO0FBQ3hCLEFBQUUsQUFBQyxnQkFBQyxBQUFhLGtCQUFLLEFBQVMsQUFBQyxXQUFDLEFBQUM7QUFDaEMsb0JBQU0sQUFBYSxnQkFBRyxBQUFJLEtBQUMsQUFBSyxNQUFDLEFBQU8sUUFBQyxBQUFNLE9BQUMsQUFBSSxBQUFDLE1BQUMsQUFBRyxJQUFDLEFBQU0sT0FBQyxBQUFFLEFBQUMsQUFBQztBQUNyRSxBQUFhLGdDQUFHLEFBQWEsaUJBQUksUUFBTyxRQUFDLEFBQWEsZUFBRSxDQUFDLEFBQWUsaUJBQUUsQUFBWSxjQUFFLEFBQU0sQUFBQyxBQUFDLEFBQUMsQUFDbkc7QUFBQztBQUVELEFBQUUsQUFBQyxnQkFBQyxBQUFhLEFBQUMsZUFBQyxBQUFDO0FBQ2xCLEFBQUcsb0JBQUMsQUFBSSxLQUFDLEFBQUksS0FBQyxBQUFxQixzQkFBQyxBQUFhLGVBQUUsQUFBbUIscUJBQUUsQUFBTSxBQUFDLEFBQUMsQUFBQyxBQUNuRjtBQUFDLEFBQ0g7QUFBQztBQUVELEFBQU0sZUFBQyxBQUFHLEFBQUMsQUFDYjtBQUFDO0FBRUQseUNBQXNCLHlCQUF0QixVQUF1QixBQUFzQixRQUFFLEFBQW9CLGNBQUUsQUFBNkI7QUFDaEcsWUFBTSxBQUFHLE1BQXNCLEFBQUUsQUFBQztBQUNsQyxZQUFNLEFBQWUsa0JBQUcsQUFBSSxLQUFDLEFBQUssTUFBQyxBQUFNLE9BQUMsQUFBTSxPQUFDLEFBQU0sT0FBQyxBQUFJLEFBQUMsTUFBQyxBQUFhLGNBQUMsQUFBWSxBQUFDLEFBQUM7QUFDMUYsWUFBTSxBQUFtQixzQkFBRyxBQUFlLGdCQUFDLEFBQU8sQUFBQztBQUVwRCxBQUFFLEFBQUMsWUFBQyxBQUFtQixBQUFDLHFCQUFDLEFBQUM7QUFDeEIsZ0JBQUksQUFBb0IsdUJBQUcsQUFBSSxLQUFDLEFBQUssTUFBQyxBQUFhLGNBQUMsQUFBYSxjQUFDLEFBQU0sUUFBRSxBQUFZLEFBQUMsQUFBQztBQUV4RixBQUFFLEFBQUMsZ0JBQUMsQ0FBQyxPQUFxQixzQkFBQyxBQUFhLGVBQUUsQUFBb0IsQUFBQyxBQUFDLHVCQUFDLEFBQUM7QUFDaEUsQUFBRSxBQUFDLG9CQUFDLEFBQW9CLEFBQUMsc0JBQUMsQUFBQztBQUN6QixBQUFHLHdCQUFDLEFBQUksS0FBQyxBQUFJLEtBQUMsQUFBcUIsc0JBQUMsQUFBb0Isc0JBQUUsQUFBbUIscUJBQUUsQUFBTSxBQUFDLEFBQUMsQUFBQyxBQUMxRjtBQUFDO0FBRUQsQUFBRSxBQUFDLG9CQUFDLEFBQWEsQUFBQyxlQUFDLEFBQUM7QUFDbEIsQUFBRyx3QkFBQyxBQUFJLEtBQUMsQUFBSSxLQUFDLEFBQWtCLG1CQUFDLEFBQWEsZUFBRSxBQUFtQixxQkFBRSxBQUFNLEFBQUMsQUFBQyxBQUFDLEFBQ2hGO0FBQUMsQUFDSDtBQUFDLEFBQ0g7QUFBQztBQUVELEFBQU0sZUFBQyxBQUFHLEFBQUMsQUFDYjtBQUFDO0FBRUQseUNBQXNCLHlCQUF0QixVQUF1QixBQUFzQixRQUFFLEFBQW9CLGNBQUUsQUFBZ0M7QUFBckcsb0JBZ0JDO0FBZkMsWUFBTSxBQUFHLE1BQXNCLEFBQUUsQUFBQztBQUNsQyxZQUFNLEFBQWUsa0JBQUcsQUFBSSxLQUFDLEFBQUssTUFBQyxBQUFNLE9BQUMsQUFBTSxPQUFDLEFBQU0sT0FBQyxBQUFJLEFBQUMsTUFBQyxBQUFhLGNBQUMsQUFBWSxBQUFDLEFBQUM7QUFDMUYsWUFBTSxBQUFtQixzQkFBRyxBQUFlLGdCQUFDLEFBQU8sQUFBQztBQUVwRCxBQUFFLEFBQUMsWUFBQyxBQUFtQixBQUFDLHFCQUFDLEFBQUM7QUFDeEIsQUFBRSxBQUFDLGdCQUFDLEFBQWMsbUJBQUssQUFBUyxBQUFDLFdBQUMsQUFBQztBQUNqQyxBQUFjLGlDQUFHLEFBQUksS0FBQyxBQUFLLE1BQUMsQUFBYSxjQUFDLEFBQWMsZUFBQyxBQUFNLFFBQUUsQUFBWSxBQUFDLEFBQUMsQUFDakY7QUFBQztBQUVELEFBQUUsQUFBQyxnQkFBQyxBQUFjLEFBQUMsZ0JBQUMsQUFBQztBQUNuQixBQUFjLCtCQUFDLEFBQU8sUUFBQyxVQUFBLEFBQWE7QUFBSSwyQkFBQSxBQUFHLElBQUMsQUFBSSxLQUFDLEFBQUksTUFBQyxBQUFxQixzQkFBQyxBQUFhLGVBQUUsQUFBbUIscUJBQXRFLEFBQXdFLEFBQU0sQUFBQyxBQUFDO0FBQUEsQUFBQyxBQUFDLEFBQzVIO0FBQUMsQUFDSDtBQUFDO0FBRUQsQUFBTSxlQUFDLEFBQUcsQUFBQyxBQUNiO0FBQUM7QUFFRCx5Q0FBdUIsMEJBQXZCLFVBQXdCLEFBQXNCLFFBQUUsQUFBb0IsY0FBRSxBQUFnQztBQUNwRyxZQUFNLEFBQUcsTUFBc0IsQUFBRSxBQUFDO0FBQ2xDLFlBQU0sQUFBZSxrQkFBRyxBQUFJLEtBQUMsQUFBSyxNQUFDLEFBQU0sT0FBQyxBQUFNLE9BQUMsQUFBTSxPQUFDLEFBQUksQUFBQyxNQUFDLEFBQWEsY0FBQyxBQUFZLEFBQUMsQUFBQztBQUMxRixZQUFNLEFBQXdCLDJCQUFHLEFBQUksS0FBQyxBQUFLLE1BQUMsQUFBYSxjQUFDLEFBQWlCLGtCQUFDLEFBQU0sUUFBRSxBQUFZLEFBQUMsQUFBQztBQUVsRyxZQUFJLEFBQVksQUFBQztBQUVqQixBQUFFLEFBQUMsWUFBQyxBQUF3QixBQUFDLDBCQUFDLEFBQUM7QUFDN0IsZ0JBQU0sQUFBaUIsc0JBQUcsSUFBSSxzQkFBaUIsQUFBRSxBQUFDO0FBQ2xELEFBQWMsMkJBQUMsQUFBTyxRQUFDLFVBQUEsQUFBQztBQUFJLHVCQUFBLEFBQWlCLG9CQUFDLEFBQUcsSUFBckIsQUFBc0IsQUFBQyxBQUFDO0FBQUEsQUFBQyxBQUFDO0FBRXRELGdCQUFJLEFBQWMsaUJBQUcsQUFBd0IseUJBQUMsQUFBVyxZQUFDLEFBQWlCLEFBQUMsQUFBQztBQUM3RSxBQUFLLGtCQUFDLEFBQVMsVUFBQyxBQUFJLEtBQUMsQUFBSyxNQUFDLEFBQUcsS0FBRSxBQUFJLEtBQUMsQUFBd0IseUJBQUMsQUFBTSxRQUFFLEFBQWUsaUJBQUUsQUFBYyxBQUFDLEFBQUMsQUFBQztBQUV4RyxBQUFZLDJCQUFHLEFBQWlCLG9CQUFDLEFBQVcsWUFBQyxBQUF3QixBQUFDLEFBQUMsQUFDekU7QUFBQyxBQUFDLEFBQUksZUFBQyxBQUFDO0FBQ04sQUFBWSwyQkFBRyxBQUFjLEFBQUMsQUFDaEM7QUFBQztBQUVELEFBQUssY0FBQyxBQUFTLFVBQUMsQUFBSSxLQUFDLEFBQUssTUFBQyxBQUFHLEtBQUUsQUFBSSxLQUFDLEFBQXFCLHNCQUFDLEFBQU0sUUFBRSxBQUFlLGlCQUFFLEFBQVksQUFBQyxBQUFDLEFBQUM7QUFFbkcsQUFBTSxlQUFDLEFBQUcsQUFBQyxBQUNiO0FBQUM7QUFFRCx5Q0FBWSxlQUFaLFVBQWEsQUFBYztBQUEzQixvQkFvQkM7QUFuQkMsWUFBTSxBQUFHLE1BQXNCLEFBQUUsQUFBQztBQUNsQyxZQUFNLEFBQWEsZ0JBQUcsQUFBTSxPQUFDLEFBQWEsQUFBQztBQUUzQyxBQUFFLEFBQUMsWUFBQyxBQUFhLEFBQUMsZUFBQyxBQUFDO0FBQ2xCLGdCQUFNLEFBQVEsYUFBRyxBQUFJLEtBQUMsQUFBSyxNQUFDLEFBQU0sT0FBQyxBQUFNLE9BQUMsQUFBTSxPQUFDLEFBQUksQUFBQyxBQUFDO0FBQ3ZELGdCQUFNLEFBQWMsbUJBQUcsT0FBbUIsb0JBQUMsQUFBTSxBQUFDLEFBQUM7QUFFbkQsQUFBTSxtQkFBQyxBQUFJLEtBQUMsQUFBYSxBQUFDLGVBQUMsQUFBTyxRQUFDLFVBQUEsQUFBWTtBQUM3QyxvQkFBTSxBQUFlLGtCQUFHLEFBQVEsV0FBQyxBQUFhLGNBQUMsQUFBWSxBQUFDLEFBQUM7QUFFN0Qsb0JBQU0sQUFBZ0IsbUJBQUcsQUFBYSxjQUFDLEFBQVksQUFBQyxpQkFDM0IsQUFBYSxjQUFDLEFBQVksQUFBQyxjQUFDLEFBQUksQUFBQztBQUMxRCxvQkFBTSxBQUFjLGlCQUFHLEFBQW1CLG9CQUFDLEFBQWdCLEFBQUMsQUFBQztBQUU3RCxBQUFLLHNCQUFDLEFBQVMsVUFBQyxBQUFJLEtBQUMsQUFBSyxNQUFDLEFBQUcsS0FBRSxBQUFJLE1BQUMsQUFBcUIsc0JBQUMsQUFBYyxrQkFBRSxBQUFlLGlCQUFFLEFBQWMsQUFBQyxBQUFDLEFBQUMsQUFDL0c7QUFBQyxBQUFDLEFBQUMsQUFDTDtBQUFDO0FBRUQsQUFBTSxlQUFDLEFBQUcsQUFBQyxBQUNiO0FBQUM7QUFFRCx5Q0FBYyxpQkFBZCxVQUFlLEFBQXNCO0FBQXJDLG9CQW9CQztBQW5CQyxZQUFNLEFBQUcsTUFBc0IsQUFBRSxBQUFDO0FBQ2xDLFlBQU0sQUFBYSxnQkFBRyxBQUFJLEtBQUMsQUFBSyxNQUFDLEFBQU8sUUFBQyxBQUFNLE9BQUMsQUFBSSxBQUFDLE1BQUMsQUFBRyxJQUFDLEFBQU0sT0FBQyxBQUFFLEFBQUMsQUFBQztBQUNyRSxZQUFNLEFBQWEsZ0JBQUcsQUFBYSxpQkFBSSxBQUFhLGNBQUMsQUFBYSxBQUFDO0FBRW5FLEFBQUUsQUFBQyxZQUFDLEFBQWEsQUFBQyxlQUFDLEFBQUM7QUFDbEIsZ0JBQU0sQUFBUSxhQUFHLEFBQUksS0FBQyxBQUFLLE1BQUMsQUFBTSxPQUFDLEFBQU0sT0FBQyxBQUFNLE9BQUMsQUFBSSxBQUFDLEFBQUM7QUFDdkQsZ0JBQU0sQUFBYyxtQkFBRyxPQUFtQixvQkFBQyxBQUFNLEFBQUMsQUFBQztBQUVuRCxBQUFNLG1CQUFDLEFBQUksS0FBQyxBQUFhLEFBQUMsZUFBQyxBQUFPLFFBQUMsVUFBQSxBQUFZO0FBQzdDLG9CQUFNLEFBQWUsa0JBQUcsQUFBUSxXQUFDLEFBQWEsY0FBQyxBQUFZLEFBQUMsQUFBQztBQUM3RCxvQkFBTSxBQUFnQixtQkFBRyxBQUFhLGNBQUMsQUFBWSxBQUFDLGlCQUMzQixBQUFhLGNBQUMsQUFBWSxBQUFDLGNBQUMsQUFBSSxBQUFDO0FBQzFELG9CQUFNLEFBQWMsaUJBQUcsQUFBbUIsb0JBQUMsQUFBZ0IsQUFBQyxBQUFDO0FBRTdELEFBQUssc0JBQUMsQUFBUyxVQUFDLEFBQUksS0FBQyxBQUFLLE1BQUMsQUFBRyxLQUFFLEFBQUksTUFBQyxBQUF3Qix5QkFBQyxBQUFjLGtCQUFFLEFBQWUsaUJBQUUsQUFBYyxBQUFDLEFBQUMsQUFBQyxBQUNsSDtBQUFDLEFBQUMsQUFBQyxBQUNMO0FBQUM7QUFFRCxBQUFNLGVBQUMsQUFBRyxBQUFDLEFBQ2I7QUFBQztBQUVELHlDQUFlLGtCQUFmLFVBQWdCLEFBQWM7QUFDNUIsWUFBTSxBQUFHLE1BQXNCLEFBQUUsQUFBQztBQUVsQyxBQUFFLEFBQUMsWUFBQyxBQUFNLE9BQUMsQUFBYSxBQUFDLGVBQUMsQUFBQztBQUN6QixnQkFBTSxBQUFRLFdBQUcsQUFBSSxLQUFDLEFBQUssTUFBQyxBQUFNLE9BQUMsQUFBTSxPQUFDLEFBQU0sT0FBQyxBQUFJLEFBQUMsQUFBQztBQUN2RCxnQkFBTSxBQUFjLGlCQUFHLE9BQW1CLG9CQUFDLEFBQU0sQUFBQyxBQUFDO0FBRW5ELEFBQUcsQUFBQyxpQkFBQyxJQUFJLEFBQVksZ0JBQUksQUFBTSxPQUFDLEFBQWEsQUFBQyxlQUFDLEFBQUM7QUFDOUMsb0JBQU0sQUFBZSxrQkFBRyxBQUFRLFNBQUMsQUFBYSxjQUFDLEFBQVksQUFBQyxBQUFDO0FBQzdELG9CQUFNLEFBQWdCLG1CQUFHLEFBQU0sVUFBSSxRQUFPLFFBQUMsQUFBTSxRQUFFLENBQUMsQUFBZSxpQkFBRSxBQUFZLGNBQUUsQUFBTSxBQUFDLEFBQUMsQUFBQztBQUU1RixBQUFFLEFBQUMsb0JBQUMsQUFBZSxnQkFBQyxBQUFJLFNBQUssQUFBUyxBQUFDLFdBQUMsQUFBQztBQUN2QyxBQUFLLDBCQUFDLEFBQVMsVUFBQyxBQUFJLEtBQUMsQUFBSyxNQUFDLEFBQUcsS0FBRSxBQUFJLEtBQUMsQUFBdUIsd0JBQUMsQUFBYyxnQkFBRSxBQUFZLGNBQUUsQUFBZ0IsQUFBQyxBQUFDLEFBQUMsQUFDaEg7QUFBQyxBQUFDLEFBQUksdUJBQUMsQUFBQztBQUNOLEFBQUssMEJBQUMsQUFBUyxVQUFDLEFBQUksS0FBQyxBQUFLLE1BQUMsQUFBRyxLQUFFLEFBQUksS0FBQyxBQUFzQix1QkFBQyxBQUFjLGdCQUFFLEFBQVksY0FBRSxBQUFnQixBQUFDLEFBQUMsQUFBQyxBQUMvRztBQUFDLEFBQ0g7QUFBQyxBQUNIO0FBQUM7QUFFRCxBQUFNLGVBQUMsQUFBRyxBQUFDLEFBQ2I7QUFBQztBQUVELHlDQUFxQix3QkFBckIsVUFBc0IsQUFBc0IsUUFBRSxBQUF1QyxpQkFBRSxBQUFnQztBQUF2SCxvQkFLQztBQUpDLEFBQUUsQUFBQyxZQUFDLEFBQWMsZUFBQyxBQUFNLFNBQUcsQUFBQyxLQUFJLEFBQWUsZ0JBQUMsQUFBTyxBQUFDLFNBQUMsQUFBQztBQUN6RCxBQUFNLGtDQUFnQixBQUFHLElBQUMsVUFBQSxBQUFhO0FBQUksdUJBQUEsQUFBSSxNQUFDLEFBQWtCLG1CQUFDLEFBQWEsZUFBRSxBQUFlLGdCQUFDLEFBQU8sU0FBOUQsQUFBZ0UsQUFBTSxBQUFDO0FBQUEsQUFBQyxBQUFDLEFBQ3RILGFBRFMsQUFBYztBQUN0QjtBQUNELEFBQU0sZUFBQyxBQUFFLEFBQUMsQUFDWjtBQUFDO0FBRUQseUNBQXdCLDJCQUF4QixVQUF5QixBQUFzQixRQUFFLEFBQXVDLGlCQUFFLEFBQWdDO0FBQTFILG9CQVNDO0FBUkMsQUFBRSxBQUFDLFlBQUMsQUFBYyxlQUFDLEFBQU0sU0FBRyxBQUFDLEFBQUMsR0FBQyxBQUFDO0FBQzlCLEFBQUUsQUFBQyxnQkFBQyxBQUFlLGdCQUFDLEFBQVMsY0FBSyxBQUFRLEFBQUMsVUFBQyxBQUFDO0FBQzNDLEFBQU0sdUJBQUMsQUFBSSxLQUFDLEFBQXVCLHdCQUFDLEFBQWMsQUFBQyxBQUFDLEFBQ3REO0FBQUMsQUFBQyxBQUFJLG1CQUFDLEFBQUUsQUFBQyxJQUFDLEFBQWUsZ0JBQUMsQUFBTyxBQUFDLFNBQUMsQUFBQztBQUNuQyxBQUFNLHNDQUFnQixBQUFHLElBQUMsVUFBQSxBQUFhO0FBQUksMkJBQUEsQUFBSSxNQUFDLEFBQXFCLHNCQUFDLEFBQWEsZUFBRSxBQUFlLGdCQUFDLEFBQU8sU0FBakUsQUFBbUUsQUFBTSxBQUFDO0FBQUEsQUFBQyxBQUFDLEFBQ3pILGlCQURTLEFBQWM7QUFDdEIsQUFDSDtBQUFDO0FBQ0QsQUFBTSxlQUFDLEFBQUUsQUFBQyxBQUNaO0FBQUM7QUFFRCx5Q0FBa0IscUJBQWxCLFVBQW1CLEFBQXNCLFFBQUUsQUFBb0IsY0FBRSxBQUE2QjtBQUM1RixZQUFNLEFBQWUsa0JBQUcsQUFBSSxLQUFDLEFBQUssTUFBQyxBQUFNLE9BQUMsQUFBTSxPQUFDLEFBQU0sT0FBQyxBQUFJLEFBQUMsTUFBQyxBQUFhLGNBQUMsQUFBWSxBQUFDLEFBQUM7QUFDMUYsWUFBTSxBQUFTLFlBQUcsQUFBZSxnQkFBQyxBQUFJLFNBQUssQUFBUyxBQUFDO0FBRXJELEFBQU07QUFDSixBQUFFLGdCQUFFLEFBQVMsWUFBRyxBQUFxQix3QkFBRyxBQUFzQjtBQUM5RCxBQUFNLG9CQUFBO0FBQ04sQUFBWSwwQkFBQTtBQUNaLEFBQWEsMkJBQUEsQUFDZCxBQUFDLEFBQ0o7QUFOMEI7QUFNekI7QUFFRCx5Q0FBcUIsd0JBQXJCLFVBQXNCLEFBQXNCLFFBQUUsQUFBb0IsY0FBRSxBQUE2QjtBQUMvRixZQUFNLEFBQWUsa0JBQUcsQUFBSSxLQUFDLEFBQUssTUFBQyxBQUFNLE9BQUMsQUFBTSxPQUFDLEFBQU0sT0FBQyxBQUFJLEFBQUMsTUFBQyxBQUFhLGNBQUMsQUFBWSxBQUFDLEFBQUM7QUFDMUYsWUFBTSxBQUFTLFlBQUcsQUFBZSxnQkFBQyxBQUFJLFNBQUssQUFBUyxBQUFDO0FBRXJELEFBQU07QUFDSixBQUFFLGdCQUFFLEFBQVMsWUFBRyxBQUEwQiw2QkFBRyxBQUFzQjtBQUNuRSxBQUFNLG9CQUFBO0FBQ04sQUFBWSwwQkFBQTtBQUNaLEFBQWEsMkJBQUUsQUFBUyxZQUFHLEFBQWEsZ0JBQUcsQUFBSSxBQUNoRCxBQUFDLEFBQ0o7QUFOMEI7QUFNekI7QUFFRCx5Q0FBdUIsMEJBQXZCLFVBQXdCLEFBQWdDO0FBQ3RELEFBQU0sOEJBQWdCLEFBQUcsSUFBQyxVQUFBLEFBQU07QUFBSTtBQUNsQyxBQUFFLG9CQUFFLEFBQWM7QUFDbEIsQUFBTSx3QkFGNEIsQUFFNUIsQUFDUDtBQUhvRDtBQUdwRCxBQUFDLEFBQUMsQUFDTCxTQUpTLEFBQWM7QUFJdEI7QUFDSCxXQUFBLEFBQUM7QUE1UEQsQUE0UEMsRUE1UHVELHNCQUFrQixBQTRQekU7O0FBRUQsNkJBQTZCLEFBQVM7QUFDcEMsQUFBRSxBQUFDLFFBQUMsUUFBTyxRQUFDLEFBQUksQUFBQyxBQUFDLE9BQUMsQUFBQztBQUNsQixBQUFNLGVBQUMsQUFBSSxBQUFDLEFBQ2Q7QUFBQyxBQUFDLEFBQUksZUFBSyxBQUFJLEFBQUMsTUFBQyxBQUFDO0FBQ2hCLEFBQU0sZUFBQyxDQUFDLEFBQUksQUFBQyxBQUFDLEFBQ2hCO0FBQUMsQUFBQyxBQUFJLEtBRkMsQUFBRSxBQUFDLE1BRUgsQUFBQztBQUNOLEFBQU0sZUFBQyxBQUFFLEFBQUMsQUFDWjtBQUFDLEFBQ0g7QUFBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XHJcbiAgRGljdCxcclxuICBkZWVwR2V0LFxyXG4gIGlzQXJyYXlcclxufSBmcm9tICdAb3JiaXQvdXRpbHMnO1xyXG5pbXBvcnQge1xyXG4gIGNsb25lUmVjb3JkSWRlbnRpdHksXHJcbiAgZXF1YWxSZWNvcmRJZGVudGl0aWVzLFxyXG4gIFJlY29yZCxcclxuICBSZWNvcmRJZGVudGl0eSxcclxuICBSZWNvcmRPcGVyYXRpb24sXHJcbiAgUmVsYXRpb25zaGlwRGVmaW5pdGlvblxyXG59IGZyb20gJ0BvcmJpdC9kYXRhJztcclxuaW1wb3J0IHsgT3BlcmF0aW9uUHJvY2Vzc29yIH0gZnJvbSAnLi9vcGVyYXRpb24tcHJvY2Vzc29yJztcclxuaW1wb3J0IFJlY29yZElkZW50aXR5TWFwIGZyb20gJy4uL3JlY29yZC1pZGVudGl0eS1tYXAnO1xyXG5cclxuLyoqXHJcbiAqIEFuIG9wZXJhdGlvbiBwcm9jZXNzb3IgdGhhdCBlbnN1cmVzIHRoYXQgYSBjYWNoZSdzIGRhdGEgaXMgY29uc2lzdGVudCB3aXRoXHJcbiAqIGl0cyBhc3NvY2lhdGVkIHNjaGVtYS5cclxuICpcclxuICogVGhpcyBpbmNsdWRlcyBtYWludGVuYW5jZSBvZiBpbnZlcnNlIGFuZCBkZXBlbmRlbnQgcmVsYXRpb25zaGlwcy5cclxuICpcclxuICogQGV4cG9ydFxyXG4gKiBAY2xhc3MgU2NoZW1hQ29uc2lzdGVuY3lQcm9jZXNzb3JcclxuICogQGV4dGVuZHMge09wZXJhdGlvblByb2Nlc3Nvcn1cclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjaGVtYUNvbnNpc3RlbmN5UHJvY2Vzc29yIGV4dGVuZHMgT3BlcmF0aW9uUHJvY2Vzc29yIHtcclxuICBhZnRlcihvcGVyYXRpb246IFJlY29yZE9wZXJhdGlvbik6IFJlY29yZE9wZXJhdGlvbltdIHtcclxuICAgIHN3aXRjaCAob3BlcmF0aW9uLm9wKSB7XHJcbiAgICAgIGNhc2UgJ2FkZFJlY29yZCc6XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlY29yZEFkZGVkKG9wZXJhdGlvbi5yZWNvcmQpO1xyXG5cclxuICAgICAgY2FzZSAnYWRkVG9SZWxhdGVkUmVjb3Jkcyc6XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlbGF0ZWRSZWNvcmRBZGRlZChvcGVyYXRpb24ucmVjb3JkLCBvcGVyYXRpb24ucmVsYXRpb25zaGlwLCBvcGVyYXRpb24ucmVsYXRlZFJlY29yZCk7XHJcblxyXG4gICAgICBjYXNlICdyZXBsYWNlUmVsYXRlZFJlY29yZCc6XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlbGF0ZWRSZWNvcmRSZXBsYWNlZChvcGVyYXRpb24ucmVjb3JkLCBvcGVyYXRpb24ucmVsYXRpb25zaGlwLCBvcGVyYXRpb24ucmVsYXRlZFJlY29yZCk7XHJcblxyXG4gICAgICBjYXNlICdyZXBsYWNlUmVsYXRlZFJlY29yZHMnOlxyXG4gICAgICAgIHJldHVybiB0aGlzLl9yZWxhdGVkUmVjb3Jkc1JlcGxhY2VkKG9wZXJhdGlvbi5yZWNvcmQsIG9wZXJhdGlvbi5yZWxhdGlvbnNoaXAsIG9wZXJhdGlvbi5yZWxhdGVkUmVjb3Jkcyk7XHJcblxyXG4gICAgICBjYXNlICdyZW1vdmVGcm9tUmVsYXRlZFJlY29yZHMnOlxyXG4gICAgICAgIHJldHVybiB0aGlzLl9yZWxhdGVkUmVjb3JkUmVtb3ZlZChvcGVyYXRpb24ucmVjb3JkLCBvcGVyYXRpb24ucmVsYXRpb25zaGlwLCBvcGVyYXRpb24ucmVsYXRlZFJlY29yZCk7XHJcblxyXG4gICAgICBjYXNlICdyZW1vdmVSZWNvcmQnOlxyXG4gICAgICAgIHJldHVybiB0aGlzLl9yZWNvcmRSZW1vdmVkKG9wZXJhdGlvbi5yZWNvcmQpO1xyXG5cclxuICAgICAgY2FzZSAncmVwbGFjZVJlY29yZCc6XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlY29yZFJlcGxhY2VkKG9wZXJhdGlvbi5yZWNvcmQpO1xyXG5cclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICByZXR1cm4gW107XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBfcmVsYXRlZFJlY29yZEFkZGVkKHJlY29yZDogUmVjb3JkSWRlbnRpdHksIHJlbGF0aW9uc2hpcDogc3RyaW5nLCByZWxhdGVkUmVjb3JkOiBSZWNvcmRJZGVudGl0eSk6IFJlY29yZE9wZXJhdGlvbltdIHtcclxuICAgIGNvbnN0IG9wczogUmVjb3JkT3BlcmF0aW9uW10gPSBbXTtcclxuICAgIGNvbnN0IHJlbGF0aW9uc2hpcERlZiA9IHRoaXMuY2FjaGUuc2NoZW1hLm1vZGVsc1tyZWNvcmQudHlwZV0ucmVsYXRpb25zaGlwc1tyZWxhdGlvbnNoaXBdO1xyXG4gICAgY29uc3QgaW52ZXJzZVJlbGF0aW9uc2hpcCA9IHJlbGF0aW9uc2hpcERlZi5pbnZlcnNlO1xyXG5cclxuICAgIGlmIChpbnZlcnNlUmVsYXRpb25zaGlwICYmIHJlbGF0ZWRSZWNvcmQpIHtcclxuICAgICAgb3BzLnB1c2godGhpcy5fYWRkUmVsYXRpb25zaGlwT3AocmVsYXRlZFJlY29yZCwgaW52ZXJzZVJlbGF0aW9uc2hpcCwgcmVjb3JkKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG9wcztcclxuICB9XHJcblxyXG4gIF9yZWxhdGVkUmVjb3Jkc0FkZGVkKHJlY29yZDogUmVjb3JkSWRlbnRpdHksIHJlbGF0aW9uc2hpcDogc3RyaW5nLCByZWxhdGVkUmVjb3JkczogUmVjb3JkSWRlbnRpdHlbXSk6IFJlY29yZE9wZXJhdGlvbltdIHtcclxuICAgIGNvbnN0IG9wczogUmVjb3JkT3BlcmF0aW9uW10gPSBbXTtcclxuICAgIGNvbnN0IHJlbGF0aW9uc2hpcERlZiA9IHRoaXMuY2FjaGUuc2NoZW1hLm1vZGVsc1tyZWNvcmQudHlwZV0ucmVsYXRpb25zaGlwc1tyZWxhdGlvbnNoaXBdO1xyXG4gICAgY29uc3QgaW52ZXJzZVJlbGF0aW9uc2hpcCA9IHJlbGF0aW9uc2hpcERlZi5pbnZlcnNlO1xyXG5cclxuICAgIGlmIChpbnZlcnNlUmVsYXRpb25zaGlwICYmIHJlbGF0ZWRSZWNvcmRzICYmIHJlbGF0ZWRSZWNvcmRzLmxlbmd0aCA+IDApIHtcclxuICAgICAgcmVsYXRlZFJlY29yZHMuZm9yRWFjaChyZWxhdGVkUmVjb3JkID0+IHtcclxuICAgICAgICBvcHMucHVzaCh0aGlzLl9hZGRSZWxhdGlvbnNoaXBPcChyZWxhdGVkUmVjb3JkLCBpbnZlcnNlUmVsYXRpb25zaGlwLCByZWNvcmQpKVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gb3BzO1xyXG4gIH1cclxuXHJcbiAgX3JlbGF0ZWRSZWNvcmRSZW1vdmVkKHJlY29yZDogUmVjb3JkSWRlbnRpdHksIHJlbGF0aW9uc2hpcDogc3RyaW5nLCByZWxhdGVkUmVjb3JkOiBSZWNvcmRJZGVudGl0eSk6IFJlY29yZE9wZXJhdGlvbltdIHtcclxuICAgIGNvbnN0IG9wczogUmVjb3JkT3BlcmF0aW9uW10gPSBbXTtcclxuICAgIGNvbnN0IHJlbGF0aW9uc2hpcERlZiA9IHRoaXMuY2FjaGUuc2NoZW1hLm1vZGVsc1tyZWNvcmQudHlwZV0ucmVsYXRpb25zaGlwc1tyZWxhdGlvbnNoaXBdO1xyXG4gICAgY29uc3QgaW52ZXJzZVJlbGF0aW9uc2hpcCA9IHJlbGF0aW9uc2hpcERlZi5pbnZlcnNlO1xyXG5cclxuICAgIGlmIChpbnZlcnNlUmVsYXRpb25zaGlwKSB7XHJcbiAgICAgIGlmIChyZWxhdGVkUmVjb3JkID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBjb25zdCBjdXJyZW50UmVjb3JkID0gdGhpcy5jYWNoZS5yZWNvcmRzKHJlY29yZC50eXBlKS5nZXQocmVjb3JkLmlkKTtcclxuICAgICAgICByZWxhdGVkUmVjb3JkID0gY3VycmVudFJlY29yZCAmJiBkZWVwR2V0KGN1cnJlbnRSZWNvcmQsIFsncmVsYXRpb25zaGlwcycsIHJlbGF0aW9uc2hpcCwgJ2RhdGEnXSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChyZWxhdGVkUmVjb3JkKSB7XHJcbiAgICAgICAgb3BzLnB1c2godGhpcy5fcmVtb3ZlUmVsYXRpb25zaGlwT3AocmVsYXRlZFJlY29yZCwgaW52ZXJzZVJlbGF0aW9uc2hpcCwgcmVjb3JkKSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gb3BzO1xyXG4gIH1cclxuXHJcbiAgX3JlbGF0ZWRSZWNvcmRSZXBsYWNlZChyZWNvcmQ6IFJlY29yZElkZW50aXR5LCByZWxhdGlvbnNoaXA6IHN0cmluZywgcmVsYXRlZFJlY29yZDogUmVjb3JkSWRlbnRpdHkpOiBSZWNvcmRPcGVyYXRpb25bXSB7XHJcbiAgICBjb25zdCBvcHM6IFJlY29yZE9wZXJhdGlvbltdID0gW107XHJcbiAgICBjb25zdCByZWxhdGlvbnNoaXBEZWYgPSB0aGlzLmNhY2hlLnNjaGVtYS5tb2RlbHNbcmVjb3JkLnR5cGVdLnJlbGF0aW9uc2hpcHNbcmVsYXRpb25zaGlwXTtcclxuICAgIGNvbnN0IGludmVyc2VSZWxhdGlvbnNoaXAgPSByZWxhdGlvbnNoaXBEZWYuaW52ZXJzZTtcclxuXHJcbiAgICBpZiAoaW52ZXJzZVJlbGF0aW9uc2hpcCkge1xyXG4gICAgICBsZXQgY3VycmVudFJlbGF0ZWRSZWNvcmQgPSB0aGlzLmNhY2hlLnJlbGF0aW9uc2hpcHMucmVsYXRlZFJlY29yZChyZWNvcmQsIHJlbGF0aW9uc2hpcCk7XHJcblxyXG4gICAgICBpZiAoIWVxdWFsUmVjb3JkSWRlbnRpdGllcyhyZWxhdGVkUmVjb3JkLCBjdXJyZW50UmVsYXRlZFJlY29yZCkpIHtcclxuICAgICAgICBpZiAoY3VycmVudFJlbGF0ZWRSZWNvcmQpIHtcclxuICAgICAgICAgIG9wcy5wdXNoKHRoaXMuX3JlbW92ZVJlbGF0aW9uc2hpcE9wKGN1cnJlbnRSZWxhdGVkUmVjb3JkLCBpbnZlcnNlUmVsYXRpb25zaGlwLCByZWNvcmQpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChyZWxhdGVkUmVjb3JkKSB7XHJcbiAgICAgICAgICBvcHMucHVzaCh0aGlzLl9hZGRSZWxhdGlvbnNoaXBPcChyZWxhdGVkUmVjb3JkLCBpbnZlcnNlUmVsYXRpb25zaGlwLCByZWNvcmQpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gb3BzO1xyXG4gIH1cclxuXHJcbiAgX3JlbGF0ZWRSZWNvcmRzUmVtb3ZlZChyZWNvcmQ6IFJlY29yZElkZW50aXR5LCByZWxhdGlvbnNoaXA6IHN0cmluZywgcmVsYXRlZFJlY29yZHM6IFJlY29yZElkZW50aXR5W10pOiBSZWNvcmRPcGVyYXRpb25bXSB7XHJcbiAgICBjb25zdCBvcHM6IFJlY29yZE9wZXJhdGlvbltdID0gW107XHJcbiAgICBjb25zdCByZWxhdGlvbnNoaXBEZWYgPSB0aGlzLmNhY2hlLnNjaGVtYS5tb2RlbHNbcmVjb3JkLnR5cGVdLnJlbGF0aW9uc2hpcHNbcmVsYXRpb25zaGlwXTtcclxuICAgIGNvbnN0IGludmVyc2VSZWxhdGlvbnNoaXAgPSByZWxhdGlvbnNoaXBEZWYuaW52ZXJzZTtcclxuXHJcbiAgICBpZiAoaW52ZXJzZVJlbGF0aW9uc2hpcCkge1xyXG4gICAgICBpZiAocmVsYXRlZFJlY29yZHMgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHJlbGF0ZWRSZWNvcmRzID0gdGhpcy5jYWNoZS5yZWxhdGlvbnNoaXBzLnJlbGF0ZWRSZWNvcmRzKHJlY29yZCwgcmVsYXRpb25zaGlwKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHJlbGF0ZWRSZWNvcmRzKSB7XHJcbiAgICAgICAgcmVsYXRlZFJlY29yZHMuZm9yRWFjaChyZWxhdGVkUmVjb3JkID0+IG9wcy5wdXNoKHRoaXMuX3JlbW92ZVJlbGF0aW9uc2hpcE9wKHJlbGF0ZWRSZWNvcmQsIGludmVyc2VSZWxhdGlvbnNoaXAsIHJlY29yZCkpKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBvcHM7XHJcbiAgfVxyXG5cclxuICBfcmVsYXRlZFJlY29yZHNSZXBsYWNlZChyZWNvcmQ6IFJlY29yZElkZW50aXR5LCByZWxhdGlvbnNoaXA6IHN0cmluZywgcmVsYXRlZFJlY29yZHM6IFJlY29yZElkZW50aXR5W10pOiBSZWNvcmRPcGVyYXRpb25bXSB7XHJcbiAgICBjb25zdCBvcHM6IFJlY29yZE9wZXJhdGlvbltdID0gW107XHJcbiAgICBjb25zdCByZWxhdGlvbnNoaXBEZWYgPSB0aGlzLmNhY2hlLnNjaGVtYS5tb2RlbHNbcmVjb3JkLnR5cGVdLnJlbGF0aW9uc2hpcHNbcmVsYXRpb25zaGlwXTtcclxuICAgIGNvbnN0IGN1cnJlbnRSZWxhdGVkUmVjb3Jkc01hcCA9IHRoaXMuY2FjaGUucmVsYXRpb25zaGlwcy5yZWxhdGVkUmVjb3Jkc01hcChyZWNvcmQsIHJlbGF0aW9uc2hpcCk7XHJcblxyXG4gICAgbGV0IGFkZGVkUmVjb3JkcztcclxuXHJcbiAgICBpZiAoY3VycmVudFJlbGF0ZWRSZWNvcmRzTWFwKSB7XHJcbiAgICAgIGNvbnN0IHJlbGF0ZWRSZWNvcmRzTWFwID0gbmV3IFJlY29yZElkZW50aXR5TWFwKCk7XHJcbiAgICAgIHJlbGF0ZWRSZWNvcmRzLmZvckVhY2gociA9PiByZWxhdGVkUmVjb3Jkc01hcC5hZGQocikpO1xyXG5cclxuICAgICAgbGV0IHJlbW92ZWRSZWNvcmRzID0gY3VycmVudFJlbGF0ZWRSZWNvcmRzTWFwLmV4Y2x1c2l2ZU9mKHJlbGF0ZWRSZWNvcmRzTWFwKTtcclxuICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkob3BzLCB0aGlzLl9yZW1vdmVSZWxhdGVkUmVjb3Jkc09wcyhyZWNvcmQsIHJlbGF0aW9uc2hpcERlZiwgcmVtb3ZlZFJlY29yZHMpKTtcclxuXHJcbiAgICAgIGFkZGVkUmVjb3JkcyA9IHJlbGF0ZWRSZWNvcmRzTWFwLmV4Y2x1c2l2ZU9mKGN1cnJlbnRSZWxhdGVkUmVjb3Jkc01hcCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBhZGRlZFJlY29yZHMgPSByZWxhdGVkUmVjb3JkcztcclxuICAgIH1cclxuXHJcbiAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShvcHMsIHRoaXMuX2FkZFJlbGF0ZWRSZWNvcmRzT3BzKHJlY29yZCwgcmVsYXRpb25zaGlwRGVmLCBhZGRlZFJlY29yZHMpKTtcclxuXHJcbiAgICByZXR1cm4gb3BzO1xyXG4gIH1cclxuXHJcbiAgX3JlY29yZEFkZGVkKHJlY29yZDogUmVjb3JkKTogUmVjb3JkT3BlcmF0aW9uW10ge1xyXG4gICAgY29uc3Qgb3BzOiBSZWNvcmRPcGVyYXRpb25bXSA9IFtdO1xyXG4gICAgY29uc3QgcmVsYXRpb25zaGlwcyA9IHJlY29yZC5yZWxhdGlvbnNoaXBzO1xyXG5cclxuICAgIGlmIChyZWxhdGlvbnNoaXBzKSB7XHJcbiAgICAgIGNvbnN0IG1vZGVsRGVmID0gdGhpcy5jYWNoZS5zY2hlbWEubW9kZWxzW3JlY29yZC50eXBlXTtcclxuICAgICAgY29uc3QgcmVjb3JkSWRlbnRpdHkgPSBjbG9uZVJlY29yZElkZW50aXR5KHJlY29yZCk7XHJcblxyXG4gICAgICBPYmplY3Qua2V5cyhyZWxhdGlvbnNoaXBzKS5mb3JFYWNoKHJlbGF0aW9uc2hpcCA9PiB7XHJcbiAgICAgICAgY29uc3QgcmVsYXRpb25zaGlwRGVmID0gbW9kZWxEZWYucmVsYXRpb25zaGlwc1tyZWxhdGlvbnNoaXBdO1xyXG5cclxuICAgICAgICBjb25zdCByZWxhdGlvbnNoaXBEYXRhID0gcmVsYXRpb25zaGlwc1tyZWxhdGlvbnNoaXBdICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbGF0aW9uc2hpcHNbcmVsYXRpb25zaGlwXS5kYXRhO1xyXG4gICAgICAgIGNvbnN0IHJlbGF0ZWRSZWNvcmRzID0gcmVjb3JkQXJyYXlGcm9tRGF0YShyZWxhdGlvbnNoaXBEYXRhKTtcclxuXHJcbiAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkob3BzLCB0aGlzLl9hZGRSZWxhdGVkUmVjb3Jkc09wcyhyZWNvcmRJZGVudGl0eSwgcmVsYXRpb25zaGlwRGVmLCByZWxhdGVkUmVjb3JkcykpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gb3BzO1xyXG4gIH1cclxuXHJcbiAgX3JlY29yZFJlbW92ZWQocmVjb3JkOiBSZWNvcmRJZGVudGl0eSk6IFJlY29yZE9wZXJhdGlvbltdIHtcclxuICAgIGNvbnN0IG9wczogUmVjb3JkT3BlcmF0aW9uW10gPSBbXTtcclxuICAgIGNvbnN0IGN1cnJlbnRSZWNvcmQgPSB0aGlzLmNhY2hlLnJlY29yZHMocmVjb3JkLnR5cGUpLmdldChyZWNvcmQuaWQpO1xyXG4gICAgY29uc3QgcmVsYXRpb25zaGlwcyA9IGN1cnJlbnRSZWNvcmQgJiYgY3VycmVudFJlY29yZC5yZWxhdGlvbnNoaXBzO1xyXG5cclxuICAgIGlmIChyZWxhdGlvbnNoaXBzKSB7XHJcbiAgICAgIGNvbnN0IG1vZGVsRGVmID0gdGhpcy5jYWNoZS5zY2hlbWEubW9kZWxzW3JlY29yZC50eXBlXTtcclxuICAgICAgY29uc3QgcmVjb3JkSWRlbnRpdHkgPSBjbG9uZVJlY29yZElkZW50aXR5KHJlY29yZCk7XHJcblxyXG4gICAgICBPYmplY3Qua2V5cyhyZWxhdGlvbnNoaXBzKS5mb3JFYWNoKHJlbGF0aW9uc2hpcCA9PiB7XHJcbiAgICAgICAgY29uc3QgcmVsYXRpb25zaGlwRGVmID0gbW9kZWxEZWYucmVsYXRpb25zaGlwc1tyZWxhdGlvbnNoaXBdO1xyXG4gICAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcERhdGEgPSByZWxhdGlvbnNoaXBzW3JlbGF0aW9uc2hpcF0gJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVsYXRpb25zaGlwc1tyZWxhdGlvbnNoaXBdLmRhdGE7XHJcbiAgICAgICAgY29uc3QgcmVsYXRlZFJlY29yZHMgPSByZWNvcmRBcnJheUZyb21EYXRhKHJlbGF0aW9uc2hpcERhdGEpO1xyXG5cclxuICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShvcHMsIHRoaXMuX3JlbW92ZVJlbGF0ZWRSZWNvcmRzT3BzKHJlY29yZElkZW50aXR5LCByZWxhdGlvbnNoaXBEZWYsIHJlbGF0ZWRSZWNvcmRzKSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBvcHM7XHJcbiAgfVxyXG5cclxuICBfcmVjb3JkUmVwbGFjZWQocmVjb3JkOiBSZWNvcmQpOiBSZWNvcmRPcGVyYXRpb25bXSB7XHJcbiAgICBjb25zdCBvcHM6IFJlY29yZE9wZXJhdGlvbltdID0gW107XHJcblxyXG4gICAgaWYgKHJlY29yZC5yZWxhdGlvbnNoaXBzKSB7XHJcbiAgICAgIGNvbnN0IG1vZGVsRGVmID0gdGhpcy5jYWNoZS5zY2hlbWEubW9kZWxzW3JlY29yZC50eXBlXTtcclxuICAgICAgY29uc3QgcmVjb3JkSWRlbnRpdHkgPSBjbG9uZVJlY29yZElkZW50aXR5KHJlY29yZCk7XHJcblxyXG4gICAgICBmb3IgKGxldCByZWxhdGlvbnNoaXAgaW4gcmVjb3JkLnJlbGF0aW9uc2hpcHMpIHtcclxuICAgICAgICBjb25zdCByZWxhdGlvbnNoaXBEZWYgPSBtb2RlbERlZi5yZWxhdGlvbnNoaXBzW3JlbGF0aW9uc2hpcF07XHJcbiAgICAgICAgY29uc3QgcmVsYXRpb25zaGlwRGF0YSA9IHJlY29yZCAmJiBkZWVwR2V0KHJlY29yZCwgWydyZWxhdGlvbnNoaXBzJywgcmVsYXRpb25zaGlwLCAnZGF0YSddKTtcclxuXHJcbiAgICAgICAgaWYgKHJlbGF0aW9uc2hpcERlZi50eXBlID09PSAnaGFzTWFueScpIHtcclxuICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KG9wcywgdGhpcy5fcmVsYXRlZFJlY29yZHNSZXBsYWNlZChyZWNvcmRJZGVudGl0eSwgcmVsYXRpb25zaGlwLCByZWxhdGlvbnNoaXBEYXRhKSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KG9wcywgdGhpcy5fcmVsYXRlZFJlY29yZFJlcGxhY2VkKHJlY29yZElkZW50aXR5LCByZWxhdGlvbnNoaXAsIHJlbGF0aW9uc2hpcERhdGEpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gb3BzO1xyXG4gIH1cclxuXHJcbiAgX2FkZFJlbGF0ZWRSZWNvcmRzT3BzKHJlY29yZDogUmVjb3JkSWRlbnRpdHksIHJlbGF0aW9uc2hpcERlZjogUmVsYXRpb25zaGlwRGVmaW5pdGlvbiwgcmVsYXRlZFJlY29yZHM6IFJlY29yZElkZW50aXR5W10pOiBSZWNvcmRPcGVyYXRpb25bXSB7XHJcbiAgICBpZiAocmVsYXRlZFJlY29yZHMubGVuZ3RoID4gMCAmJiByZWxhdGlvbnNoaXBEZWYuaW52ZXJzZSkge1xyXG4gICAgICByZXR1cm4gcmVsYXRlZFJlY29yZHMubWFwKHJlbGF0ZWRSZWNvcmQgPT4gdGhpcy5fYWRkUmVsYXRpb25zaGlwT3AocmVsYXRlZFJlY29yZCwgcmVsYXRpb25zaGlwRGVmLmludmVyc2UsIHJlY29yZCkpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIFtdO1xyXG4gIH1cclxuXHJcbiAgX3JlbW92ZVJlbGF0ZWRSZWNvcmRzT3BzKHJlY29yZDogUmVjb3JkSWRlbnRpdHksIHJlbGF0aW9uc2hpcERlZjogUmVsYXRpb25zaGlwRGVmaW5pdGlvbiwgcmVsYXRlZFJlY29yZHM6IFJlY29yZElkZW50aXR5W10pOiBSZWNvcmRPcGVyYXRpb25bXSB7XHJcbiAgICBpZiAocmVsYXRlZFJlY29yZHMubGVuZ3RoID4gMCkge1xyXG4gICAgICBpZiAocmVsYXRpb25zaGlwRGVmLmRlcGVuZGVudCA9PT0gJ3JlbW92ZScpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcmVtb3ZlRGVwZW5kZW50UmVjb3JkcyhyZWxhdGVkUmVjb3Jkcyk7XHJcbiAgICAgIH0gZWxzZSBpZiAocmVsYXRpb25zaGlwRGVmLmludmVyc2UpIHtcclxuICAgICAgICByZXR1cm4gcmVsYXRlZFJlY29yZHMubWFwKHJlbGF0ZWRSZWNvcmQgPT4gdGhpcy5fcmVtb3ZlUmVsYXRpb25zaGlwT3AocmVsYXRlZFJlY29yZCwgcmVsYXRpb25zaGlwRGVmLmludmVyc2UsIHJlY29yZCkpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gW107XHJcbiAgfVxyXG5cclxuICBfYWRkUmVsYXRpb25zaGlwT3AocmVjb3JkOiBSZWNvcmRJZGVudGl0eSwgcmVsYXRpb25zaGlwOiBzdHJpbmcsIHJlbGF0ZWRSZWNvcmQ6IFJlY29yZElkZW50aXR5KTogUmVjb3JkT3BlcmF0aW9uIHtcclxuICAgIGNvbnN0IHJlbGF0aW9uc2hpcERlZiA9IHRoaXMuY2FjaGUuc2NoZW1hLm1vZGVsc1tyZWNvcmQudHlwZV0ucmVsYXRpb25zaGlwc1tyZWxhdGlvbnNoaXBdO1xyXG4gICAgY29uc3QgaXNIYXNNYW55ID0gcmVsYXRpb25zaGlwRGVmLnR5cGUgPT09ICdoYXNNYW55JztcclxuXHJcbiAgICByZXR1cm4gPFJlY29yZE9wZXJhdGlvbj57XHJcbiAgICAgIG9wOiBpc0hhc01hbnkgPyAnYWRkVG9SZWxhdGVkUmVjb3JkcycgOiAncmVwbGFjZVJlbGF0ZWRSZWNvcmQnLFxyXG4gICAgICByZWNvcmQsXHJcbiAgICAgIHJlbGF0aW9uc2hpcCxcclxuICAgICAgcmVsYXRlZFJlY29yZFxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIF9yZW1vdmVSZWxhdGlvbnNoaXBPcChyZWNvcmQ6IFJlY29yZElkZW50aXR5LCByZWxhdGlvbnNoaXA6IHN0cmluZywgcmVsYXRlZFJlY29yZDogUmVjb3JkSWRlbnRpdHkpOiBSZWNvcmRPcGVyYXRpb24ge1xyXG4gICAgY29uc3QgcmVsYXRpb25zaGlwRGVmID0gdGhpcy5jYWNoZS5zY2hlbWEubW9kZWxzW3JlY29yZC50eXBlXS5yZWxhdGlvbnNoaXBzW3JlbGF0aW9uc2hpcF07XHJcbiAgICBjb25zdCBpc0hhc01hbnkgPSByZWxhdGlvbnNoaXBEZWYudHlwZSA9PT0gJ2hhc01hbnknO1xyXG5cclxuICAgIHJldHVybiA8UmVjb3JkT3BlcmF0aW9uPntcclxuICAgICAgb3A6IGlzSGFzTWFueSA/ICdyZW1vdmVGcm9tUmVsYXRlZFJlY29yZHMnIDogJ3JlcGxhY2VSZWxhdGVkUmVjb3JkJyxcclxuICAgICAgcmVjb3JkLFxyXG4gICAgICByZWxhdGlvbnNoaXAsXHJcbiAgICAgIHJlbGF0ZWRSZWNvcmQ6IGlzSGFzTWFueSA/IHJlbGF0ZWRSZWNvcmQgOiBudWxsXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgX3JlbW92ZURlcGVuZGVudFJlY29yZHMocmVsYXRlZFJlY29yZHM6IFJlY29yZElkZW50aXR5W10pOiBSZWNvcmRPcGVyYXRpb25bXSB7XHJcbiAgICByZXR1cm4gcmVsYXRlZFJlY29yZHMubWFwKHJlY29yZCA9PiA8UmVjb3JkT3BlcmF0aW9uPntcclxuICAgICAgb3A6ICdyZW1vdmVSZWNvcmQnLFxyXG4gICAgICByZWNvcmRcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gcmVjb3JkQXJyYXlGcm9tRGF0YShkYXRhOiBhbnkpOiBSZWNvcmRJZGVudGl0eVtdIHtcclxuICBpZiAoaXNBcnJheShkYXRhKSkge1xyXG4gICAgcmV0dXJuIGRhdGE7XHJcbiAgfSBlbHNlIGlmIChkYXRhKSB7XHJcbiAgICByZXR1cm4gW2RhdGFdO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gW107XHJcbiAgfVxyXG59XHJcbiJdfQ==