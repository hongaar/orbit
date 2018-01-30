"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@orbit/utils");
var data_1 = require("@orbit/data");
var immutable_1 = require("@orbit/immutable");
var InverseRelationshipAccessor = function () {
    function InverseRelationshipAccessor(cache, base) {
        this._cache = cache;
        this.reset(base);
    }
    InverseRelationshipAccessor.prototype.reset = function (base) {
        var relationships = {};
        Object.keys(this._cache.schema.models).forEach(function (type) {
            var baseRelationships = base && base._relationships[type];
            relationships[type] = new immutable_1.ImmutableMap(baseRelationships);
        });
        this._relationships = relationships;
    };
    InverseRelationshipAccessor.prototype.upgrade = function () {
        var _this = this;
        Object.keys(this._cache.schema.models).forEach(function (type) {
            if (!_this._relationships[type]) {
                _this._relationships[type] = new immutable_1.ImmutableMap();
            }
        });
    };
    InverseRelationshipAccessor.prototype.all = function (record) {
        return this._relationships[record.type].get(record.id) || [];
    };
    InverseRelationshipAccessor.prototype.recordAdded = function (record) {
        var _this = this;
        var relationships = record.relationships;
        var recordIdentity = data_1.cloneRecordIdentity(record);
        if (relationships) {
            Object.keys(relationships).forEach(function (relationship) {
                var relationshipData = relationships[relationship] && relationships[relationship].data;
                if (relationshipData) {
                    if (utils_1.isArray(relationshipData)) {
                        var relatedRecords = relationshipData;
                        relatedRecords.forEach(function (relatedRecord) {
                            _this.add(relatedRecord, { record: recordIdentity, relationship: relationship });
                        });
                    } else {
                        var relatedRecord = relationshipData;
                        _this.add(relatedRecord, { record: recordIdentity, relationship: relationship });
                    }
                }
            });
        }
    };
    InverseRelationshipAccessor.prototype.recordRemoved = function (record) {
        var _this = this;
        var recordInCache = this._cache.records(record.type).get(record.id);
        var relationships = recordInCache && recordInCache.relationships;
        if (relationships) {
            Object.keys(relationships).forEach(function (relationship) {
                var relationshipData = relationships[relationship] && relationships[relationship].data;
                if (relationshipData) {
                    if (utils_1.isArray(relationshipData)) {
                        var relatedRecords = relationshipData;
                        relatedRecords.forEach(function (relatedRecord) {
                            _this.remove(relatedRecord, { record: record, relationship: relationship });
                        });
                    } else {
                        var relatedRecord = relationshipData;
                        _this.remove(relatedRecord, { record: record, relationship: relationship });
                    }
                }
            });
        }
        this._relationships[record.type].remove(record.id);
    };
    InverseRelationshipAccessor.prototype.relatedRecordAdded = function (record, relationship, relatedRecord) {
        if (relatedRecord) {
            var relationshipDef = this._cache.schema.getModel(record.type).relationships[relationship];
            if (relationshipDef.inverse) {
                var recordIdentity = data_1.cloneRecordIdentity(record);
                this.add(relatedRecord, { record: recordIdentity, relationship: relationship });
            }
        }
    };
    InverseRelationshipAccessor.prototype.relatedRecordsAdded = function (record, relationship, relatedRecords) {
        var _this = this;
        if (relatedRecords && relatedRecords.length > 0) {
            var relationshipDef = this._cache.schema.getModel(record.type).relationships[relationship];
            if (relationshipDef.inverse) {
                var recordIdentity_1 = data_1.cloneRecordIdentity(record);
                relatedRecords.forEach(function (relatedRecord) {
                    _this.add(relatedRecord, { record: recordIdentity_1, relationship: relationship });
                });
            }
        }
    };
    InverseRelationshipAccessor.prototype.relatedRecordRemoved = function (record, relationship, relatedRecord) {
        var relationshipDef = this._cache.schema.getModel(record.type).relationships[relationship];
        if (relationshipDef.inverse) {
            if (relatedRecord === undefined) {
                var currentRecord = this._cache.records(record.type).get(record.id);
                relatedRecord = currentRecord && utils_1.deepGet(currentRecord, ['relationships', relationship, 'data']);
            }
            if (relatedRecord) {
                this.remove(relatedRecord, { record: record, relationship: relationship });
            }
        }
    };
    InverseRelationshipAccessor.prototype.relatedRecordsRemoved = function (record, relationship, relatedRecords) {
        var _this = this;
        var relationshipDef = this._cache.schema.getModel(record.type).relationships[relationship];
        if (relationshipDef.inverse) {
            if (relatedRecords === undefined) {
                var currentRecord = this._cache.records(record.type).get(record.id);
                relatedRecords = currentRecord && utils_1.deepGet(currentRecord, ['relationships', relationship, 'data']);
            }
            if (relatedRecords) {
                relatedRecords.forEach(function (relatedRecord) {
                    return _this.remove(relatedRecord, { record: record, relationship: relationship });
                });
            }
        }
    };
    InverseRelationshipAccessor.prototype.add = function (record, inverseRelationship) {
        var rels = this._relationships[record.type].get(record.id);
        rels = rels ? utils_1.clone(rels) : [];
        rels.push(inverseRelationship);
        this._relationships[record.type].set(record.id, rels);
    };
    InverseRelationshipAccessor.prototype.remove = function (record, inverseRelationship) {
        var rels = this._relationships[record.type].get(record.id);
        if (rels) {
            var newRels = rels.filter(function (r) {
                return !(r.record.type === inverseRelationship.record.type && r.record.id === inverseRelationship.record.id && r.relationship === inverseRelationship.relationship);
            });
            this._relationships[record.type].set(record.id, newRels);
        }
    };
    return InverseRelationshipAccessor;
}();
exports.default = InverseRelationshipAccessor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW52ZXJzZS1yZWxhdGlvbnNoaXAtYWNjZXNzb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvY2FjaGUvaW52ZXJzZS1yZWxhdGlvbnNoaXAtYWNjZXNzb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsc0JBQXVFO0FBQ3ZFLHFCQUlxQjtBQUVyQiwwQkFBZ0Q7QUFPaEQ7QUFJRSx5Q0FBWSxBQUFZLE9BQUUsQUFBa0M7QUFDMUQsQUFBSSxhQUFDLEFBQU0sU0FBRyxBQUFLLEFBQUM7QUFDcEIsQUFBSSxhQUFDLEFBQUssTUFBQyxBQUFJLEFBQUMsQUFBQyxBQUNuQjtBQUFDO0FBRUQsMENBQUssUUFBTCxVQUFNLEFBQWtDO0FBQ3RDLFlBQUksQUFBYSxnQkFBRyxBQUFFLEFBQUM7QUFDdkIsQUFBTSxlQUFDLEFBQUksS0FBQyxBQUFJLEtBQUMsQUFBTSxPQUFDLEFBQU0sT0FBQyxBQUFNLEFBQUMsUUFBQyxBQUFPLFFBQUMsVUFBQSxBQUFJO0FBQ2pELGdCQUFJLEFBQWlCLG9CQUFHLEFBQUksUUFBSSxBQUFJLEtBQUMsQUFBYyxlQUFDLEFBQUksQUFBQyxBQUFDO0FBQzFELEFBQWEsMEJBQUMsQUFBSSxBQUFDLFFBQUcsSUFBSSxZQUFZLGFBQUMsQUFBaUIsQUFBQyxBQUFDLEFBQzVEO0FBQUMsQUFBQyxBQUFDO0FBQ0gsQUFBSSxhQUFDLEFBQWMsaUJBQUcsQUFBYSxBQUFDLEFBQ3RDO0FBQUM7QUFFRCwwQ0FBTyxVQUFQO0FBQUEsb0JBTUM7QUFMQyxBQUFNLGVBQUMsQUFBSSxLQUFDLEFBQUksS0FBQyxBQUFNLE9BQUMsQUFBTSxPQUFDLEFBQU0sQUFBQyxRQUFDLEFBQU8sUUFBQyxVQUFBLEFBQUk7QUFDakQsQUFBRSxBQUFDLGdCQUFDLENBQUMsQUFBSSxNQUFDLEFBQWMsZUFBQyxBQUFJLEFBQUMsQUFBQyxPQUFDLEFBQUM7QUFDL0IsQUFBSSxzQkFBQyxBQUFjLGVBQUMsQUFBSSxBQUFDLFFBQUcsSUFBSSxZQUFZLEFBQUUsQUFBQyxBQUNqRDtBQUFDLEFBQ0g7QUFBQyxBQUFDLEFBQUMsQUFDTDtBQUFDO0FBRUQsMENBQUcsTUFBSCxVQUFJLEFBQXNCO0FBQ3hCLEFBQU0sZUFBQyxBQUFJLEtBQUMsQUFBYyxlQUFDLEFBQU0sT0FBQyxBQUFJLEFBQUMsTUFBQyxBQUFHLElBQUMsQUFBTSxPQUFDLEFBQUUsQUFBQyxPQUFJLEFBQUUsQUFBQyxBQUMvRDtBQUFDO0FBRUQsMENBQVcsY0FBWCxVQUFZLEFBQWM7QUFBMUIsb0JBbUJDO0FBbEJDLFlBQU0sQUFBYSxnQkFBRyxBQUFNLE9BQUMsQUFBYSxBQUFDO0FBQzNDLFlBQU0sQUFBYyxpQkFBRyxPQUFtQixvQkFBQyxBQUFNLEFBQUMsQUFBQztBQUNuRCxBQUFFLEFBQUMsWUFBQyxBQUFhLEFBQUMsZUFBQyxBQUFDO0FBQ2xCLEFBQU0sbUJBQUMsQUFBSSxLQUFDLEFBQWEsQUFBQyxlQUFDLEFBQU8sUUFBQyxVQUFBLEFBQVk7QUFDN0Msb0JBQU0sQUFBZ0IsbUJBQUcsQUFBYSxjQUFDLEFBQVksQUFBQyxpQkFBSSxBQUFhLGNBQUMsQUFBWSxBQUFDLGNBQUMsQUFBSSxBQUFDO0FBQ3pGLEFBQUUsQUFBQyxvQkFBQyxBQUFnQixBQUFDLGtCQUFDLEFBQUM7QUFDckIsQUFBRSxBQUFDLHdCQUFDLFFBQU8sUUFBQyxBQUFnQixBQUFDLEFBQUMsbUJBQUMsQUFBQztBQUM5Qiw0QkFBTSxBQUFjLGlCQUFHLEFBQTRCLEFBQUM7QUFDcEQsQUFBYyx1Q0FBQyxBQUFPLFFBQUMsVUFBQSxBQUFhO0FBQ2xDLEFBQUksa0NBQUMsQUFBRyxJQUFDLEFBQWEsZUFBRSxFQUFFLEFBQU0sUUFBRSxBQUFjLGdCQUFFLEFBQVksY0FBQSxBQUFFLEFBQUMsQUFDbkU7QUFBQyxBQUFDLEFBQUMsQUFDTDtBQUFDLEFBQUMsQUFBSSwyQkFBQyxBQUFDO0FBQ04sNEJBQU0sQUFBYSxnQkFBRyxBQUEwQixBQUFDO0FBQ2pELEFBQUksOEJBQUMsQUFBRyxJQUFDLEFBQWEsZUFBRSxFQUFFLEFBQU0sUUFBRSxBQUFjLGdCQUFFLEFBQVksY0FBQSxBQUFFLEFBQUMsQUFDbkU7QUFBQyxBQUNIO0FBQUMsQUFDSDtBQUFDLEFBQUMsQUFBQyxBQUNMO0FBQUMsQUFDSDtBQUFDO0FBRUQsMENBQWEsZ0JBQWIsVUFBYyxBQUFzQjtBQUFwQyxvQkFvQkM7QUFuQkMsWUFBTSxBQUFhLGdCQUFXLEFBQUksS0FBQyxBQUFNLE9BQUMsQUFBTyxRQUFDLEFBQU0sT0FBQyxBQUFJLEFBQUMsTUFBQyxBQUFHLElBQUMsQUFBTSxPQUFDLEFBQUUsQUFBQyxBQUFDO0FBQzlFLFlBQU0sQUFBYSxnQkFBRyxBQUFhLGlCQUFJLEFBQWEsY0FBQyxBQUFhLEFBQUM7QUFDbkUsQUFBRSxBQUFDLFlBQUMsQUFBYSxBQUFDLGVBQUMsQUFBQztBQUNsQixBQUFNLG1CQUFDLEFBQUksS0FBQyxBQUFhLEFBQUMsZUFBQyxBQUFPLFFBQUMsVUFBQSxBQUFZO0FBQzdDLG9CQUFNLEFBQWdCLG1CQUFHLEFBQWEsY0FBQyxBQUFZLEFBQUMsaUJBQUksQUFBYSxjQUFDLEFBQVksQUFBQyxjQUFDLEFBQUksQUFBQztBQUN6RixBQUFFLEFBQUMsb0JBQUMsQUFBZ0IsQUFBQyxrQkFBQyxBQUFDO0FBQ3JCLEFBQUUsQUFBQyx3QkFBQyxRQUFPLFFBQUMsQUFBZ0IsQUFBQyxBQUFDLG1CQUFDLEFBQUM7QUFDOUIsNEJBQU0sQUFBYyxpQkFBRyxBQUE0QixBQUFDO0FBQ3BELEFBQWMsdUNBQUMsQUFBTyxRQUFDLFVBQUEsQUFBYTtBQUNsQyxBQUFJLGtDQUFDLEFBQU0sT0FBQyxBQUFhLGVBQUUsRUFBRSxBQUFNLFFBQUEsUUFBRSxBQUFZLGNBQUEsQUFBRSxBQUFDLEFBQ3REO0FBQUMsQUFBQyxBQUFDLEFBQ0w7QUFBQyxBQUFDLEFBQUksMkJBQUMsQUFBQztBQUNOLDRCQUFNLEFBQWEsZ0JBQUcsQUFBMEIsQUFBQztBQUNqRCxBQUFJLDhCQUFDLEFBQU0sT0FBQyxBQUFhLGVBQUUsRUFBRSxBQUFNLFFBQUEsUUFBRSxBQUFZLGNBQUEsQUFBRSxBQUFDLEFBQ3REO0FBQUMsQUFDSDtBQUFDLEFBQ0g7QUFBQyxBQUFDLEFBQUMsQUFDTDtBQUFDO0FBQ0QsQUFBSSxhQUFDLEFBQWMsZUFBQyxBQUFNLE9BQUMsQUFBSSxBQUFDLE1BQUMsQUFBTSxPQUFDLEFBQU0sT0FBQyxBQUFFLEFBQUMsQUFBQyxBQUNyRDtBQUFDO0FBRUQsMENBQWtCLHFCQUFsQixVQUFtQixBQUFzQixRQUFFLEFBQW9CLGNBQUUsQUFBNkI7QUFDNUYsQUFBRSxBQUFDLFlBQUMsQUFBYSxBQUFDLGVBQUMsQUFBQztBQUNsQixnQkFBTSxBQUFlLGtCQUFHLEFBQUksS0FBQyxBQUFNLE9BQUMsQUFBTSxPQUFDLEFBQVEsU0FBQyxBQUFNLE9BQUMsQUFBSSxBQUFDLE1BQUMsQUFBYSxjQUFDLEFBQVksQUFBQyxBQUFDO0FBQzdGLEFBQUUsQUFBQyxnQkFBQyxBQUFlLGdCQUFDLEFBQU8sQUFBQyxTQUFDLEFBQUM7QUFDNUIsb0JBQU0sQUFBYyxpQkFBRyxPQUFtQixvQkFBQyxBQUFNLEFBQUMsQUFBQztBQUNuRCxBQUFJLHFCQUFDLEFBQUcsSUFBQyxBQUFhLGVBQUUsRUFBRSxBQUFNLFFBQUUsQUFBYyxnQkFBRSxBQUFZLGNBQUEsQUFBRSxBQUFDLEFBQUMsQUFDcEU7QUFBQyxBQUNIO0FBQUMsQUFDSDtBQUFDO0FBRUQsMENBQW1CLHNCQUFuQixVQUFvQixBQUFzQixRQUFFLEFBQW9CLGNBQUUsQUFBZ0M7QUFBbEcsb0JBVUM7QUFUQyxBQUFFLEFBQUMsWUFBQyxBQUFjLGtCQUFJLEFBQWMsZUFBQyxBQUFNLFNBQUcsQUFBQyxBQUFDLEdBQUMsQUFBQztBQUNoRCxnQkFBTSxBQUFlLGtCQUFHLEFBQUksS0FBQyxBQUFNLE9BQUMsQUFBTSxPQUFDLEFBQVEsU0FBQyxBQUFNLE9BQUMsQUFBSSxBQUFDLE1BQUMsQUFBYSxjQUFDLEFBQVksQUFBQyxBQUFDO0FBQzdGLEFBQUUsQUFBQyxnQkFBQyxBQUFlLGdCQUFDLEFBQU8sQUFBQyxTQUFDLEFBQUM7QUFDNUIsb0JBQU0sQUFBYyxtQkFBRyxPQUFtQixvQkFBQyxBQUFNLEFBQUMsQUFBQztBQUNuRCxBQUFjLCtCQUFDLEFBQU8sUUFBQyxVQUFBLEFBQWE7QUFDbEMsQUFBSSwwQkFBQyxBQUFHLElBQUMsQUFBYSxlQUFFLEVBQUUsQUFBTSxRQUFFLEFBQWMsa0JBQUUsQUFBWSxjQUFBLEFBQUUsQUFBQyxBQUFDLEFBQ3BFO0FBQUMsQUFBQyxBQUFDLEFBQ0w7QUFBQyxBQUNIO0FBQUMsQUFDSDtBQUFDO0FBRUQsMENBQW9CLHVCQUFwQixVQUFxQixBQUFzQixRQUFFLEFBQW9CLGNBQUUsQUFBOEI7QUFDL0YsWUFBTSxBQUFlLGtCQUFHLEFBQUksS0FBQyxBQUFNLE9BQUMsQUFBTSxPQUFDLEFBQVEsU0FBQyxBQUFNLE9BQUMsQUFBSSxBQUFDLE1BQUMsQUFBYSxjQUFDLEFBQVksQUFBQyxBQUFDO0FBRTdGLEFBQUUsQUFBQyxZQUFDLEFBQWUsZ0JBQUMsQUFBTyxBQUFDLFNBQUMsQUFBQztBQUM1QixBQUFFLEFBQUMsZ0JBQUMsQUFBYSxrQkFBSyxBQUFTLEFBQUMsV0FBQyxBQUFDO0FBQ2hDLG9CQUFNLEFBQWEsZ0JBQUcsQUFBSSxLQUFDLEFBQU0sT0FBQyxBQUFPLFFBQUMsQUFBTSxPQUFDLEFBQUksQUFBQyxNQUFDLEFBQUcsSUFBQyxBQUFNLE9BQUMsQUFBRSxBQUFDLEFBQUM7QUFDdEUsQUFBYSxnQ0FBRyxBQUFhLGlCQUFJLFFBQU8sUUFBQyxBQUFhLGVBQUUsQ0FBQyxBQUFlLGlCQUFFLEFBQVksY0FBRSxBQUFNLEFBQUMsQUFBQyxBQUFDLEFBQ25HO0FBQUM7QUFFRCxBQUFFLEFBQUMsZ0JBQUMsQUFBYSxBQUFDLGVBQUMsQUFBQztBQUNsQixBQUFJLHFCQUFDLEFBQU0sT0FBQyxBQUFhLGVBQUUsRUFBRSxBQUFNLFFBQUEsUUFBRSxBQUFZLGNBQUEsQUFBRSxBQUFDLEFBQUMsQUFDdkQ7QUFBQyxBQUNIO0FBQUMsQUFDSDtBQUFDO0FBRUQsMENBQXFCLHdCQUFyQixVQUFzQixBQUFzQixRQUFFLEFBQW9CLGNBQUUsQUFBaUM7QUFBckcsb0JBYUM7QUFaQyxZQUFNLEFBQWUsa0JBQUcsQUFBSSxLQUFDLEFBQU0sT0FBQyxBQUFNLE9BQUMsQUFBUSxTQUFDLEFBQU0sT0FBQyxBQUFJLEFBQUMsTUFBQyxBQUFhLGNBQUMsQUFBWSxBQUFDLEFBQUM7QUFFN0YsQUFBRSxBQUFDLFlBQUMsQUFBZSxnQkFBQyxBQUFPLEFBQUMsU0FBQyxBQUFDO0FBQzVCLEFBQUUsQUFBQyxnQkFBQyxBQUFjLG1CQUFLLEFBQVMsQUFBQyxXQUFDLEFBQUM7QUFDakMsb0JBQU0sQUFBYSxnQkFBRyxBQUFJLEtBQUMsQUFBTSxPQUFDLEFBQU8sUUFBQyxBQUFNLE9BQUMsQUFBSSxBQUFDLE1BQUMsQUFBRyxJQUFDLEFBQU0sT0FBQyxBQUFFLEFBQUMsQUFBQztBQUN0RSxBQUFjLGlDQUFHLEFBQWEsaUJBQUksUUFBTyxRQUFDLEFBQWEsZUFBRSxDQUFDLEFBQWUsaUJBQUUsQUFBWSxjQUFFLEFBQU0sQUFBQyxBQUFDLEFBQUMsQUFDcEc7QUFBQztBQUVELEFBQUUsQUFBQyxnQkFBQyxBQUFjLEFBQUMsZ0JBQUMsQUFBQztBQUNuQixBQUFjLCtCQUFDLEFBQU8sUUFBQyxVQUFBLEFBQWE7QUFBSSwyQkFBQSxBQUFJLE1BQUMsQUFBTSxPQUFDLEFBQWEsZUFBRSxFQUFFLEFBQU0sUUFBQSxRQUFFLEFBQVksY0FBakQsQUFBaUQsQUFBRSxBQUFDO0FBQUEsQUFBQyxBQUFDLEFBQ2hHO0FBQUMsQUFDSDtBQUFDLEFBQ0g7QUFBQztBQUVPLDBDQUFHLE1BQVgsVUFBWSxBQUFzQixRQUFFLEFBQXdDO0FBQzFFLFlBQUksQUFBSSxPQUFHLEFBQUksS0FBQyxBQUFjLGVBQUMsQUFBTSxPQUFDLEFBQUksQUFBQyxNQUFDLEFBQUcsSUFBQyxBQUFNLE9BQUMsQUFBRSxBQUFDLEFBQUM7QUFDM0QsQUFBSSxlQUFHLEFBQUksT0FBRyxRQUFLLE1BQUMsQUFBSSxBQUFDLFFBQUcsQUFBRSxBQUFDO0FBQy9CLEFBQUksYUFBQyxBQUFJLEtBQUMsQUFBbUIsQUFBQyxBQUFDO0FBQy9CLEFBQUksYUFBQyxBQUFjLGVBQUMsQUFBTSxPQUFDLEFBQUksQUFBQyxNQUFDLEFBQUcsSUFBQyxBQUFNLE9BQUMsQUFBRSxJQUFFLEFBQUksQUFBQyxBQUFDLEFBQ3hEO0FBQUM7QUFFTywwQ0FBTSxTQUFkLFVBQWUsQUFBc0IsUUFBRSxBQUF3QztBQUM3RSxZQUFJLEFBQUksT0FBRyxBQUFJLEtBQUMsQUFBYyxlQUFDLEFBQU0sT0FBQyxBQUFJLEFBQUMsTUFBQyxBQUFHLElBQUMsQUFBTSxPQUFDLEFBQUUsQUFBQyxBQUFDO0FBQzNELEFBQUUsQUFBQyxZQUFDLEFBQUksQUFBQyxNQUFDLEFBQUM7QUFDVCxnQkFBSSxBQUFPLGVBQVEsQUFBTSxPQUFDLFVBQUEsQUFBQztBQUFJLHVCQUFBLEFBQUMsRUFBQyxBQUFDLEVBQUMsQUFBTSxPQUFDLEFBQUksU0FBSyxBQUFtQixvQkFBQyxBQUFNLE9BQUMsQUFBSSxRQUNqRCxBQUFDLEVBQUMsQUFBTSxPQUFDLEFBQUUsT0FBSyxBQUFtQixvQkFBQyxBQUFNLE9BQUMsQUFBRSxNQUM3QyxBQUFDLEVBQUMsQUFBWSxpQkFBSyxBQUFtQixvQkFGeEMsQUFFeUMsQUFBWSxBQUFDO0FBQUEsQUFBQyxBQUFDLGFBRnpFLEFBQUk7QUFHbEIsQUFBSSxpQkFBQyxBQUFjLGVBQUMsQUFBTSxPQUFDLEFBQUksQUFBQyxNQUFDLEFBQUcsSUFBQyxBQUFNLE9BQUMsQUFBRSxJQUFFLEFBQU8sQUFBQyxBQUFDLEFBQzNEO0FBQUMsQUFDSDtBQUFDO0FBQ0gsV0FBQSxBQUFDO0FBN0lELEFBNklDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGljdCwgaXNBcnJheSwgaXNPYmplY3QsIGNsb25lLCBkZWVwR2V0IH0gZnJvbSAnQG9yYml0L3V0aWxzJztcclxuaW1wb3J0IHtcclxuICBjbG9uZVJlY29yZElkZW50aXR5LFxyXG4gIFJlY29yZCxcclxuICBSZWNvcmRJZGVudGl0eVxyXG59IGZyb20gJ0BvcmJpdC9kYXRhJztcclxuaW1wb3J0IENhY2hlIGZyb20gJy4uL2NhY2hlJztcclxuaW1wb3J0IHsgSW1tdXRhYmxlTWFwIH0gZnJvbSAnQG9yYml0L2ltbXV0YWJsZSc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEludmVyc2VSZWxhdGlvbnNoaXAge1xyXG4gIHJlY29yZDogUmVjb3JkSWRlbnRpdHksXHJcbiAgcmVsYXRpb25zaGlwOiBzdHJpbmdcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW52ZXJzZVJlbGF0aW9uc2hpcEFjY2Vzc29yIHtcclxuICBwcm90ZWN0ZWQgX2NhY2hlOiBDYWNoZTtcclxuICBwcm90ZWN0ZWQgX3JlbGF0aW9uc2hpcHM6IERpY3Q8SW1tdXRhYmxlTWFwPHN0cmluZywgSW52ZXJzZVJlbGF0aW9uc2hpcFtdPj47XHJcblxyXG4gIGNvbnN0cnVjdG9yKGNhY2hlOiBDYWNoZSwgYmFzZT86IEludmVyc2VSZWxhdGlvbnNoaXBBY2Nlc3Nvcikge1xyXG4gICAgdGhpcy5fY2FjaGUgPSBjYWNoZTtcclxuICAgIHRoaXMucmVzZXQoYmFzZSk7XHJcbiAgfVxyXG5cclxuICByZXNldChiYXNlPzogSW52ZXJzZVJlbGF0aW9uc2hpcEFjY2Vzc29yKSB7XHJcbiAgICBsZXQgcmVsYXRpb25zaGlwcyA9IHt9O1xyXG4gICAgT2JqZWN0LmtleXModGhpcy5fY2FjaGUuc2NoZW1hLm1vZGVscykuZm9yRWFjaCh0eXBlID0+IHtcclxuICAgICAgbGV0IGJhc2VSZWxhdGlvbnNoaXBzID0gYmFzZSAmJiBiYXNlLl9yZWxhdGlvbnNoaXBzW3R5cGVdO1xyXG4gICAgICByZWxhdGlvbnNoaXBzW3R5cGVdID0gbmV3IEltbXV0YWJsZU1hcChiYXNlUmVsYXRpb25zaGlwcyk7XHJcbiAgICB9KTtcclxuICAgIHRoaXMuX3JlbGF0aW9uc2hpcHMgPSByZWxhdGlvbnNoaXBzO1xyXG4gIH1cclxuXHJcbiAgdXBncmFkZSgpIHtcclxuICAgIE9iamVjdC5rZXlzKHRoaXMuX2NhY2hlLnNjaGVtYS5tb2RlbHMpLmZvckVhY2godHlwZSA9PiB7XHJcbiAgICAgIGlmICghdGhpcy5fcmVsYXRpb25zaGlwc1t0eXBlXSkge1xyXG4gICAgICAgIHRoaXMuX3JlbGF0aW9uc2hpcHNbdHlwZV0gPSBuZXcgSW1tdXRhYmxlTWFwKCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgYWxsKHJlY29yZDogUmVjb3JkSWRlbnRpdHkpOiBJbnZlcnNlUmVsYXRpb25zaGlwW10ge1xyXG4gICAgcmV0dXJuIHRoaXMuX3JlbGF0aW9uc2hpcHNbcmVjb3JkLnR5cGVdLmdldChyZWNvcmQuaWQpIHx8IFtdO1xyXG4gIH1cclxuXHJcbiAgcmVjb3JkQWRkZWQocmVjb3JkOiBSZWNvcmQpIHtcclxuICAgIGNvbnN0IHJlbGF0aW9uc2hpcHMgPSByZWNvcmQucmVsYXRpb25zaGlwcztcclxuICAgIGNvbnN0IHJlY29yZElkZW50aXR5ID0gY2xvbmVSZWNvcmRJZGVudGl0eShyZWNvcmQpO1xyXG4gICAgaWYgKHJlbGF0aW9uc2hpcHMpIHtcclxuICAgICAgT2JqZWN0LmtleXMocmVsYXRpb25zaGlwcykuZm9yRWFjaChyZWxhdGlvbnNoaXAgPT4ge1xyXG4gICAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcERhdGEgPSByZWxhdGlvbnNoaXBzW3JlbGF0aW9uc2hpcF0gJiYgcmVsYXRpb25zaGlwc1tyZWxhdGlvbnNoaXBdLmRhdGE7XHJcbiAgICAgICAgaWYgKHJlbGF0aW9uc2hpcERhdGEpIHtcclxuICAgICAgICAgIGlmIChpc0FycmF5KHJlbGF0aW9uc2hpcERhdGEpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlbGF0ZWRSZWNvcmRzID0gcmVsYXRpb25zaGlwRGF0YSBhcyBSZWNvcmRbXTtcclxuICAgICAgICAgICAgcmVsYXRlZFJlY29yZHMuZm9yRWFjaChyZWxhdGVkUmVjb3JkID0+IHtcclxuICAgICAgICAgICAgICB0aGlzLmFkZChyZWxhdGVkUmVjb3JkLCB7IHJlY29yZDogcmVjb3JkSWRlbnRpdHksIHJlbGF0aW9uc2hpcCB9KVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlbGF0ZWRSZWNvcmQgPSByZWxhdGlvbnNoaXBEYXRhIGFzIFJlY29yZDtcclxuICAgICAgICAgICAgdGhpcy5hZGQocmVsYXRlZFJlY29yZCwgeyByZWNvcmQ6IHJlY29yZElkZW50aXR5LCByZWxhdGlvbnNoaXAgfSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVjb3JkUmVtb3ZlZChyZWNvcmQ6IFJlY29yZElkZW50aXR5KTogdm9pZCB7XHJcbiAgICBjb25zdCByZWNvcmRJbkNhY2hlOiBSZWNvcmQgPSB0aGlzLl9jYWNoZS5yZWNvcmRzKHJlY29yZC50eXBlKS5nZXQocmVjb3JkLmlkKTtcclxuICAgIGNvbnN0IHJlbGF0aW9uc2hpcHMgPSByZWNvcmRJbkNhY2hlICYmIHJlY29yZEluQ2FjaGUucmVsYXRpb25zaGlwcztcclxuICAgIGlmIChyZWxhdGlvbnNoaXBzKSB7XHJcbiAgICAgIE9iamVjdC5rZXlzKHJlbGF0aW9uc2hpcHMpLmZvckVhY2gocmVsYXRpb25zaGlwID0+IHtcclxuICAgICAgICBjb25zdCByZWxhdGlvbnNoaXBEYXRhID0gcmVsYXRpb25zaGlwc1tyZWxhdGlvbnNoaXBdICYmIHJlbGF0aW9uc2hpcHNbcmVsYXRpb25zaGlwXS5kYXRhO1xyXG4gICAgICAgIGlmIChyZWxhdGlvbnNoaXBEYXRhKSB7XHJcbiAgICAgICAgICBpZiAoaXNBcnJheShyZWxhdGlvbnNoaXBEYXRhKSkge1xyXG4gICAgICAgICAgICBjb25zdCByZWxhdGVkUmVjb3JkcyA9IHJlbGF0aW9uc2hpcERhdGEgYXMgUmVjb3JkW107XHJcbiAgICAgICAgICAgIHJlbGF0ZWRSZWNvcmRzLmZvckVhY2gocmVsYXRlZFJlY29yZCA9PiB7XHJcbiAgICAgICAgICAgICAgdGhpcy5yZW1vdmUocmVsYXRlZFJlY29yZCwgeyByZWNvcmQsIHJlbGF0aW9uc2hpcCB9KVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlbGF0ZWRSZWNvcmQgPSByZWxhdGlvbnNoaXBEYXRhIGFzIFJlY29yZDtcclxuICAgICAgICAgICAgdGhpcy5yZW1vdmUocmVsYXRlZFJlY29yZCwgeyByZWNvcmQsIHJlbGF0aW9uc2hpcCB9KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLl9yZWxhdGlvbnNoaXBzW3JlY29yZC50eXBlXS5yZW1vdmUocmVjb3JkLmlkKTtcclxuICB9XHJcblxyXG4gIHJlbGF0ZWRSZWNvcmRBZGRlZChyZWNvcmQ6IFJlY29yZElkZW50aXR5LCByZWxhdGlvbnNoaXA6IHN0cmluZywgcmVsYXRlZFJlY29yZDogUmVjb3JkSWRlbnRpdHkpOiB2b2lkIHtcclxuICAgIGlmIChyZWxhdGVkUmVjb3JkKSB7XHJcbiAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcERlZiA9IHRoaXMuX2NhY2hlLnNjaGVtYS5nZXRNb2RlbChyZWNvcmQudHlwZSkucmVsYXRpb25zaGlwc1tyZWxhdGlvbnNoaXBdO1xyXG4gICAgICBpZiAocmVsYXRpb25zaGlwRGVmLmludmVyc2UpIHtcclxuICAgICAgICBjb25zdCByZWNvcmRJZGVudGl0eSA9IGNsb25lUmVjb3JkSWRlbnRpdHkocmVjb3JkKTtcclxuICAgICAgICB0aGlzLmFkZChyZWxhdGVkUmVjb3JkLCB7IHJlY29yZDogcmVjb3JkSWRlbnRpdHksIHJlbGF0aW9uc2hpcCB9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVsYXRlZFJlY29yZHNBZGRlZChyZWNvcmQ6IFJlY29yZElkZW50aXR5LCByZWxhdGlvbnNoaXA6IHN0cmluZywgcmVsYXRlZFJlY29yZHM6IFJlY29yZElkZW50aXR5W10pOiB2b2lkIHtcclxuICAgIGlmIChyZWxhdGVkUmVjb3JkcyAmJiByZWxhdGVkUmVjb3Jkcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcERlZiA9IHRoaXMuX2NhY2hlLnNjaGVtYS5nZXRNb2RlbChyZWNvcmQudHlwZSkucmVsYXRpb25zaGlwc1tyZWxhdGlvbnNoaXBdO1xyXG4gICAgICBpZiAocmVsYXRpb25zaGlwRGVmLmludmVyc2UpIHtcclxuICAgICAgICBjb25zdCByZWNvcmRJZGVudGl0eSA9IGNsb25lUmVjb3JkSWRlbnRpdHkocmVjb3JkKTtcclxuICAgICAgICByZWxhdGVkUmVjb3Jkcy5mb3JFYWNoKHJlbGF0ZWRSZWNvcmQgPT4ge1xyXG4gICAgICAgICAgdGhpcy5hZGQocmVsYXRlZFJlY29yZCwgeyByZWNvcmQ6IHJlY29yZElkZW50aXR5LCByZWxhdGlvbnNoaXAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlbGF0ZWRSZWNvcmRSZW1vdmVkKHJlY29yZDogUmVjb3JkSWRlbnRpdHksIHJlbGF0aW9uc2hpcDogc3RyaW5nLCByZWxhdGVkUmVjb3JkPzogUmVjb3JkSWRlbnRpdHkpOiB2b2lkIHtcclxuICAgIGNvbnN0IHJlbGF0aW9uc2hpcERlZiA9IHRoaXMuX2NhY2hlLnNjaGVtYS5nZXRNb2RlbChyZWNvcmQudHlwZSkucmVsYXRpb25zaGlwc1tyZWxhdGlvbnNoaXBdO1xyXG5cclxuICAgIGlmIChyZWxhdGlvbnNoaXBEZWYuaW52ZXJzZSkge1xyXG4gICAgICBpZiAocmVsYXRlZFJlY29yZCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgY29uc3QgY3VycmVudFJlY29yZCA9IHRoaXMuX2NhY2hlLnJlY29yZHMocmVjb3JkLnR5cGUpLmdldChyZWNvcmQuaWQpO1xyXG4gICAgICAgIHJlbGF0ZWRSZWNvcmQgPSBjdXJyZW50UmVjb3JkICYmIGRlZXBHZXQoY3VycmVudFJlY29yZCwgWydyZWxhdGlvbnNoaXBzJywgcmVsYXRpb25zaGlwLCAnZGF0YSddKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHJlbGF0ZWRSZWNvcmQpIHtcclxuICAgICAgICB0aGlzLnJlbW92ZShyZWxhdGVkUmVjb3JkLCB7IHJlY29yZCwgcmVsYXRpb25zaGlwIH0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZWxhdGVkUmVjb3Jkc1JlbW92ZWQocmVjb3JkOiBSZWNvcmRJZGVudGl0eSwgcmVsYXRpb25zaGlwOiBzdHJpbmcsIHJlbGF0ZWRSZWNvcmRzPzogUmVjb3JkSWRlbnRpdHlbXSk6IHZvaWQge1xyXG4gICAgY29uc3QgcmVsYXRpb25zaGlwRGVmID0gdGhpcy5fY2FjaGUuc2NoZW1hLmdldE1vZGVsKHJlY29yZC50eXBlKS5yZWxhdGlvbnNoaXBzW3JlbGF0aW9uc2hpcF07XHJcblxyXG4gICAgaWYgKHJlbGF0aW9uc2hpcERlZi5pbnZlcnNlKSB7XHJcbiAgICAgIGlmIChyZWxhdGVkUmVjb3JkcyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgY29uc3QgY3VycmVudFJlY29yZCA9IHRoaXMuX2NhY2hlLnJlY29yZHMocmVjb3JkLnR5cGUpLmdldChyZWNvcmQuaWQpO1xyXG4gICAgICAgIHJlbGF0ZWRSZWNvcmRzID0gY3VycmVudFJlY29yZCAmJiBkZWVwR2V0KGN1cnJlbnRSZWNvcmQsIFsncmVsYXRpb25zaGlwcycsIHJlbGF0aW9uc2hpcCwgJ2RhdGEnXSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChyZWxhdGVkUmVjb3Jkcykge1xyXG4gICAgICAgIHJlbGF0ZWRSZWNvcmRzLmZvckVhY2gocmVsYXRlZFJlY29yZCA9PiB0aGlzLnJlbW92ZShyZWxhdGVkUmVjb3JkLCB7IHJlY29yZCwgcmVsYXRpb25zaGlwIH0pKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhZGQocmVjb3JkOiBSZWNvcmRJZGVudGl0eSwgaW52ZXJzZVJlbGF0aW9uc2hpcDogSW52ZXJzZVJlbGF0aW9uc2hpcCk6IHZvaWQge1xyXG4gICAgbGV0IHJlbHMgPSB0aGlzLl9yZWxhdGlvbnNoaXBzW3JlY29yZC50eXBlXS5nZXQocmVjb3JkLmlkKTtcclxuICAgIHJlbHMgPSByZWxzID8gY2xvbmUocmVscykgOiBbXTtcclxuICAgIHJlbHMucHVzaChpbnZlcnNlUmVsYXRpb25zaGlwKTtcclxuICAgIHRoaXMuX3JlbGF0aW9uc2hpcHNbcmVjb3JkLnR5cGVdLnNldChyZWNvcmQuaWQsIHJlbHMpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByZW1vdmUocmVjb3JkOiBSZWNvcmRJZGVudGl0eSwgaW52ZXJzZVJlbGF0aW9uc2hpcDogSW52ZXJzZVJlbGF0aW9uc2hpcCk6IHZvaWQge1xyXG4gICAgbGV0IHJlbHMgPSB0aGlzLl9yZWxhdGlvbnNoaXBzW3JlY29yZC50eXBlXS5nZXQocmVjb3JkLmlkKTtcclxuICAgIGlmIChyZWxzKSB7XHJcbiAgICAgIGxldCBuZXdSZWxzID0gcmVscy5maWx0ZXIociA9PiAhKHIucmVjb3JkLnR5cGUgPT09IGludmVyc2VSZWxhdGlvbnNoaXAucmVjb3JkLnR5cGUgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgci5yZWNvcmQuaWQgPT09IGludmVyc2VSZWxhdGlvbnNoaXAucmVjb3JkLmlkICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHIucmVsYXRpb25zaGlwID09PSBpbnZlcnNlUmVsYXRpb25zaGlwLnJlbGF0aW9uc2hpcCkpO1xyXG4gICAgICB0aGlzLl9yZWxhdGlvbnNoaXBzW3JlY29yZC50eXBlXS5zZXQocmVjb3JkLmlkLCBuZXdSZWxzKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIl19