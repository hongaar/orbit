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
            var relationshipDef = this._cache.schema.models[record.type].relationships[relationship];
            if (relationshipDef.inverse) {
                var recordIdentity = data_1.cloneRecordIdentity(record);
                this.add(relatedRecord, { record: recordIdentity, relationship: relationship });
            }
        }
    };
    InverseRelationshipAccessor.prototype.relatedRecordsAdded = function (record, relationship, relatedRecords) {
        var _this = this;
        if (relatedRecords && relatedRecords.length > 0) {
            var relationshipDef = this._cache.schema.models[record.type].relationships[relationship];
            if (relationshipDef.inverse) {
                var recordIdentity_1 = data_1.cloneRecordIdentity(record);
                relatedRecords.forEach(function (relatedRecord) {
                    _this.add(relatedRecord, { record: recordIdentity_1, relationship: relationship });
                });
            }
        }
    };
    InverseRelationshipAccessor.prototype.relatedRecordRemoved = function (record, relationship, relatedRecord) {
        var relationshipDef = this._cache.schema.models[record.type].relationships[relationship];
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
        var relationshipDef = this._cache.schema.models[record.type].relationships[relationship];
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW52ZXJzZS1yZWxhdGlvbnNoaXAtYWNjZXNzb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvY2FjaGUvaW52ZXJzZS1yZWxhdGlvbnNoaXAtYWNjZXNzb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsc0JBQXVFO0FBQ3ZFLHFCQUlxQjtBQUVyQiwwQkFBZ0Q7QUFPaEQsOENBSUU7eUNBQVksQUFBWSxPQUFFLEFBQWtDLE1BQzFELEFBQUk7YUFBQyxBQUFNLFNBQUcsQUFBSyxBQUFDLEFBQ3BCLEFBQUk7YUFBQyxBQUFLLE1BQUMsQUFBSSxBQUFDLEFBQUMsQUFDbkIsQUFBQztBQUVEOzBDQUFLLFFBQUwsVUFBTSxBQUFrQyxNQUN0QztZQUFJLEFBQWEsZ0JBQUcsQUFBRSxBQUFDLEFBQ3ZCLEFBQU07ZUFBQyxBQUFJLEtBQUMsQUFBSSxLQUFDLEFBQU0sT0FBQyxBQUFNLE9BQUMsQUFBTSxBQUFDLFFBQUMsQUFBTyxRQUFDLFVBQUEsQUFBSSxNQUNqRDtnQkFBSSxBQUFpQixvQkFBRyxBQUFJLFFBQUksQUFBSSxLQUFDLEFBQWMsZUFBQyxBQUFJLEFBQUMsQUFBQyxBQUMxRCxBQUFhOzBCQUFDLEFBQUksQUFBQyxRQUFHLElBQUksWUFBWSxhQUFDLEFBQWlCLEFBQUMsQUFBQyxBQUM1RCxBQUFDLEFBQUMsQUFBQztBQUNILEFBQUk7YUFBQyxBQUFjLGlCQUFHLEFBQWEsQUFBQyxBQUN0QyxBQUFDO0FBRUQ7MENBQUcsTUFBSCxVQUFJLEFBQXNCLFFBQ3hCLEFBQU07ZUFBQyxBQUFJLEtBQUMsQUFBYyxlQUFDLEFBQU0sT0FBQyxBQUFJLEFBQUMsTUFBQyxBQUFHLElBQUMsQUFBTSxPQUFDLEFBQUUsQUFBQyxPQUFJLEFBQUUsQUFBQyxBQUMvRCxBQUFDO0FBRUQ7MENBQVcsY0FBWCxVQUFZLEFBQWMsUUFBMUI7b0JBbUJDLEFBbEJDO1lBQU0sQUFBYSxnQkFBRyxBQUFNLE9BQUMsQUFBYSxBQUFDLEFBQzNDO1lB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QUMsQUFBQyxBQUNUO2dCQUFJLEFBQU8sZUFBUSxBQUFNLE9BQUMsVUFBQSxBQUFDLEdBQUk7dUJBQUEsQUFBQyxFQUFDLEFBQUMsRUFBQyxBQUFNLE9BQUMsQUFBSSxTQUFLLEFBQW1CLG9CQUFDLEFBQU0sT0FBQyxBQUFJLFFBQ2pELEFBQUMsRUFBQyxBQUFNLE9BQUMsQUFBRSxPQUFLLEFBQW1CLG9CQUFDLEFBQU0sT0FBQyxBQUFFLE1BQzdDLEFBQUMsRUFBQyxBQUFZLGlCQUFLLEFBQW1CLG9CQUZ4QyxBQUV5QyxBQUFZLEFBQUMsQUFBQyxBQUFDO0FBRnpFLEFBQUksQUFHbEIsQUFBSTtpQkFBQyxBQUFjLGVBQUMsQUFBTSxPQUFDLEFBQUksQUFBQyxNQUFDLEFBQUcsSUFBQyxBQUFNLE9BQUMsQUFBRSxJQUFFLEFBQU8sQUFBQyxBQUFDLEFBQzNELEFBQUMsQUFDSDtBQUFDO0FBQ0g7V0FBQSxBQUFDLEFBcklELEFBcUlDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGljdCwgaXNBcnJheSwgaXNPYmplY3QsIGNsb25lLCBkZWVwR2V0IH0gZnJvbSAnQG9yYml0L3V0aWxzJztcclxuaW1wb3J0IHtcclxuICBjbG9uZVJlY29yZElkZW50aXR5LFxyXG4gIFJlY29yZCxcclxuICBSZWNvcmRJZGVudGl0eVxyXG59IGZyb20gJ0BvcmJpdC9kYXRhJztcclxuaW1wb3J0IENhY2hlIGZyb20gJy4uL2NhY2hlJztcclxuaW1wb3J0IHsgSW1tdXRhYmxlTWFwIH0gZnJvbSAnQG9yYml0L2ltbXV0YWJsZSc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEludmVyc2VSZWxhdGlvbnNoaXAge1xyXG4gIHJlY29yZDogUmVjb3JkSWRlbnRpdHksXHJcbiAgcmVsYXRpb25zaGlwOiBzdHJpbmdcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW52ZXJzZVJlbGF0aW9uc2hpcEFjY2Vzc29yIHtcclxuICBwcm90ZWN0ZWQgX2NhY2hlOiBDYWNoZTtcclxuICBwcm90ZWN0ZWQgX3JlbGF0aW9uc2hpcHM6IERpY3Q8SW1tdXRhYmxlTWFwPHN0cmluZywgSW52ZXJzZVJlbGF0aW9uc2hpcFtdPj47XHJcblxyXG4gIGNvbnN0cnVjdG9yKGNhY2hlOiBDYWNoZSwgYmFzZT86IEludmVyc2VSZWxhdGlvbnNoaXBBY2Nlc3Nvcikge1xyXG4gICAgdGhpcy5fY2FjaGUgPSBjYWNoZTtcclxuICAgIHRoaXMucmVzZXQoYmFzZSk7XHJcbiAgfVxyXG5cclxuICByZXNldChiYXNlPzogSW52ZXJzZVJlbGF0aW9uc2hpcEFjY2Vzc29yKSB7XHJcbiAgICBsZXQgcmVsYXRpb25zaGlwcyA9IHt9O1xyXG4gICAgT2JqZWN0LmtleXModGhpcy5fY2FjaGUuc2NoZW1hLm1vZGVscykuZm9yRWFjaCh0eXBlID0+IHtcclxuICAgICAgbGV0IGJhc2VSZWxhdGlvbnNoaXBzID0gYmFzZSAmJiBiYXNlLl9yZWxhdGlvbnNoaXBzW3R5cGVdO1xyXG4gICAgICByZWxhdGlvbnNoaXBzW3R5cGVdID0gbmV3IEltbXV0YWJsZU1hcChiYXNlUmVsYXRpb25zaGlwcyk7XHJcbiAgICB9KTtcclxuICAgIHRoaXMuX3JlbGF0aW9uc2hpcHMgPSByZWxhdGlvbnNoaXBzO1xyXG4gIH1cclxuXHJcbiAgYWxsKHJlY29yZDogUmVjb3JkSWRlbnRpdHkpOiBJbnZlcnNlUmVsYXRpb25zaGlwW10ge1xyXG4gICAgcmV0dXJuIHRoaXMuX3JlbGF0aW9uc2hpcHNbcmVjb3JkLnR5cGVdLmdldChyZWNvcmQuaWQpIHx8IFtdO1xyXG4gIH1cclxuXHJcbiAgcmVjb3JkQWRkZWQocmVjb3JkOiBSZWNvcmQpIHtcclxuICAgIGNvbnN0IHJlbGF0aW9uc2hpcHMgPSByZWNvcmQucmVsYXRpb25zaGlwcztcclxuICAgIGNvbnN0IHJlY29yZElkZW50aXR5ID0gY2xvbmVSZWNvcmRJZGVudGl0eShyZWNvcmQpO1xyXG4gICAgaWYgKHJlbGF0aW9uc2hpcHMpIHtcclxuICAgICAgT2JqZWN0LmtleXMocmVsYXRpb25zaGlwcykuZm9yRWFjaChyZWxhdGlvbnNoaXAgPT4ge1xyXG4gICAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcERhdGEgPSByZWxhdGlvbnNoaXBzW3JlbGF0aW9uc2hpcF0gJiYgcmVsYXRpb25zaGlwc1tyZWxhdGlvbnNoaXBdLmRhdGE7XHJcbiAgICAgICAgaWYgKHJlbGF0aW9uc2hpcERhdGEpIHtcclxuICAgICAgICAgIGlmIChpc0FycmF5KHJlbGF0aW9uc2hpcERhdGEpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlbGF0ZWRSZWNvcmRzID0gcmVsYXRpb25zaGlwRGF0YSBhcyBSZWNvcmRbXTtcclxuICAgICAgICAgICAgcmVsYXRlZFJlY29yZHMuZm9yRWFjaChyZWxhdGVkUmVjb3JkID0+IHtcclxuICAgICAgICAgICAgICB0aGlzLmFkZChyZWxhdGVkUmVjb3JkLCB7IHJlY29yZDogcmVjb3JkSWRlbnRpdHksIHJlbGF0aW9uc2hpcCB9KVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlbGF0ZWRSZWNvcmQgPSByZWxhdGlvbnNoaXBEYXRhIGFzIFJlY29yZDtcclxuICAgICAgICAgICAgdGhpcy5hZGQocmVsYXRlZFJlY29yZCwgeyByZWNvcmQ6IHJlY29yZElkZW50aXR5LCByZWxhdGlvbnNoaXAgfSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVjb3JkUmVtb3ZlZChyZWNvcmQ6IFJlY29yZElkZW50aXR5KTogdm9pZCB7XHJcbiAgICBjb25zdCByZWNvcmRJbkNhY2hlOiBSZWNvcmQgPSB0aGlzLl9jYWNoZS5yZWNvcmRzKHJlY29yZC50eXBlKS5nZXQocmVjb3JkLmlkKTtcclxuICAgIGNvbnN0IHJlbGF0aW9uc2hpcHMgPSByZWNvcmRJbkNhY2hlICYmIHJlY29yZEluQ2FjaGUucmVsYXRpb25zaGlwcztcclxuICAgIGlmIChyZWxhdGlvbnNoaXBzKSB7XHJcbiAgICAgIE9iamVjdC5rZXlzKHJlbGF0aW9uc2hpcHMpLmZvckVhY2gocmVsYXRpb25zaGlwID0+IHtcclxuICAgICAgICBjb25zdCByZWxhdGlvbnNoaXBEYXRhID0gcmVsYXRpb25zaGlwc1tyZWxhdGlvbnNoaXBdICYmIHJlbGF0aW9uc2hpcHNbcmVsYXRpb25zaGlwXS5kYXRhO1xyXG4gICAgICAgIGlmIChyZWxhdGlvbnNoaXBEYXRhKSB7XHJcbiAgICAgICAgICBpZiAoaXNBcnJheShyZWxhdGlvbnNoaXBEYXRhKSkge1xyXG4gICAgICAgICAgICBjb25zdCByZWxhdGVkUmVjb3JkcyA9IHJlbGF0aW9uc2hpcERhdGEgYXMgUmVjb3JkW107XHJcbiAgICAgICAgICAgIHJlbGF0ZWRSZWNvcmRzLmZvckVhY2gocmVsYXRlZFJlY29yZCA9PiB7XHJcbiAgICAgICAgICAgICAgdGhpcy5yZW1vdmUocmVsYXRlZFJlY29yZCwgeyByZWNvcmQsIHJlbGF0aW9uc2hpcCB9KVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlbGF0ZWRSZWNvcmQgPSByZWxhdGlvbnNoaXBEYXRhIGFzIFJlY29yZDtcclxuICAgICAgICAgICAgdGhpcy5yZW1vdmUocmVsYXRlZFJlY29yZCwgeyByZWNvcmQsIHJlbGF0aW9uc2hpcCB9KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLl9yZWxhdGlvbnNoaXBzW3JlY29yZC50eXBlXS5yZW1vdmUocmVjb3JkLmlkKTtcclxuICB9XHJcblxyXG4gIHJlbGF0ZWRSZWNvcmRBZGRlZChyZWNvcmQ6IFJlY29yZElkZW50aXR5LCByZWxhdGlvbnNoaXA6IHN0cmluZywgcmVsYXRlZFJlY29yZDogUmVjb3JkSWRlbnRpdHkpOiB2b2lkIHtcclxuICAgIGlmIChyZWxhdGVkUmVjb3JkKSB7XHJcbiAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcERlZiA9IHRoaXMuX2NhY2hlLnNjaGVtYS5tb2RlbHNbcmVjb3JkLnR5cGVdLnJlbGF0aW9uc2hpcHNbcmVsYXRpb25zaGlwXTtcclxuICAgICAgaWYgKHJlbGF0aW9uc2hpcERlZi5pbnZlcnNlKSB7XHJcbiAgICAgICAgY29uc3QgcmVjb3JkSWRlbnRpdHkgPSBjbG9uZVJlY29yZElkZW50aXR5KHJlY29yZCk7XHJcbiAgICAgICAgdGhpcy5hZGQocmVsYXRlZFJlY29yZCwgeyByZWNvcmQ6IHJlY29yZElkZW50aXR5LCByZWxhdGlvbnNoaXAgfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlbGF0ZWRSZWNvcmRzQWRkZWQocmVjb3JkOiBSZWNvcmRJZGVudGl0eSwgcmVsYXRpb25zaGlwOiBzdHJpbmcsIHJlbGF0ZWRSZWNvcmRzOiBSZWNvcmRJZGVudGl0eVtdKTogdm9pZCB7XHJcbiAgICBpZiAocmVsYXRlZFJlY29yZHMgJiYgcmVsYXRlZFJlY29yZHMubGVuZ3RoID4gMCkge1xyXG4gICAgICBjb25zdCByZWxhdGlvbnNoaXBEZWYgPSB0aGlzLl9jYWNoZS5zY2hlbWEubW9kZWxzW3JlY29yZC50eXBlXS5yZWxhdGlvbnNoaXBzW3JlbGF0aW9uc2hpcF07XHJcbiAgICAgIGlmIChyZWxhdGlvbnNoaXBEZWYuaW52ZXJzZSkge1xyXG4gICAgICAgIGNvbnN0IHJlY29yZElkZW50aXR5ID0gY2xvbmVSZWNvcmRJZGVudGl0eShyZWNvcmQpO1xyXG4gICAgICAgIHJlbGF0ZWRSZWNvcmRzLmZvckVhY2gocmVsYXRlZFJlY29yZCA9PiB7XHJcbiAgICAgICAgICB0aGlzLmFkZChyZWxhdGVkUmVjb3JkLCB7IHJlY29yZDogcmVjb3JkSWRlbnRpdHksIHJlbGF0aW9uc2hpcCB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVsYXRlZFJlY29yZFJlbW92ZWQocmVjb3JkOiBSZWNvcmRJZGVudGl0eSwgcmVsYXRpb25zaGlwOiBzdHJpbmcsIHJlbGF0ZWRSZWNvcmQ/OiBSZWNvcmRJZGVudGl0eSk6IHZvaWQge1xyXG4gICAgY29uc3QgcmVsYXRpb25zaGlwRGVmID0gdGhpcy5fY2FjaGUuc2NoZW1hLm1vZGVsc1tyZWNvcmQudHlwZV0ucmVsYXRpb25zaGlwc1tyZWxhdGlvbnNoaXBdO1xyXG5cclxuICAgIGlmIChyZWxhdGlvbnNoaXBEZWYuaW52ZXJzZSkge1xyXG4gICAgICBpZiAocmVsYXRlZFJlY29yZCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgY29uc3QgY3VycmVudFJlY29yZCA9IHRoaXMuX2NhY2hlLnJlY29yZHMocmVjb3JkLnR5cGUpLmdldChyZWNvcmQuaWQpO1xyXG4gICAgICAgIHJlbGF0ZWRSZWNvcmQgPSBjdXJyZW50UmVjb3JkICYmIGRlZXBHZXQoY3VycmVudFJlY29yZCwgWydyZWxhdGlvbnNoaXBzJywgcmVsYXRpb25zaGlwLCAnZGF0YSddKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHJlbGF0ZWRSZWNvcmQpIHtcclxuICAgICAgICB0aGlzLnJlbW92ZShyZWxhdGVkUmVjb3JkLCB7IHJlY29yZCwgcmVsYXRpb25zaGlwIH0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZWxhdGVkUmVjb3Jkc1JlbW92ZWQocmVjb3JkOiBSZWNvcmRJZGVudGl0eSwgcmVsYXRpb25zaGlwOiBzdHJpbmcsIHJlbGF0ZWRSZWNvcmRzPzogUmVjb3JkSWRlbnRpdHlbXSk6IHZvaWQge1xyXG4gICAgY29uc3QgcmVsYXRpb25zaGlwRGVmID0gdGhpcy5fY2FjaGUuc2NoZW1hLm1vZGVsc1tyZWNvcmQudHlwZV0ucmVsYXRpb25zaGlwc1tyZWxhdGlvbnNoaXBdO1xyXG5cclxuICAgIGlmIChyZWxhdGlvbnNoaXBEZWYuaW52ZXJzZSkge1xyXG4gICAgICBpZiAocmVsYXRlZFJlY29yZHMgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGNvbnN0IGN1cnJlbnRSZWNvcmQgPSB0aGlzLl9jYWNoZS5yZWNvcmRzKHJlY29yZC50eXBlKS5nZXQocmVjb3JkLmlkKTtcclxuICAgICAgICByZWxhdGVkUmVjb3JkcyA9IGN1cnJlbnRSZWNvcmQgJiYgZGVlcEdldChjdXJyZW50UmVjb3JkLCBbJ3JlbGF0aW9uc2hpcHMnLCByZWxhdGlvbnNoaXAsICdkYXRhJ10pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocmVsYXRlZFJlY29yZHMpIHtcclxuICAgICAgICByZWxhdGVkUmVjb3Jkcy5mb3JFYWNoKHJlbGF0ZWRSZWNvcmQgPT4gdGhpcy5yZW1vdmUocmVsYXRlZFJlY29yZCwgeyByZWNvcmQsIHJlbGF0aW9uc2hpcCB9KSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgYWRkKHJlY29yZDogUmVjb3JkSWRlbnRpdHksIGludmVyc2VSZWxhdGlvbnNoaXA6IEludmVyc2VSZWxhdGlvbnNoaXApOiB2b2lkIHtcclxuICAgIGxldCByZWxzID0gdGhpcy5fcmVsYXRpb25zaGlwc1tyZWNvcmQudHlwZV0uZ2V0KHJlY29yZC5pZCk7XHJcbiAgICByZWxzID0gcmVscyA/IGNsb25lKHJlbHMpIDogW107XHJcbiAgICByZWxzLnB1c2goaW52ZXJzZVJlbGF0aW9uc2hpcCk7XHJcbiAgICB0aGlzLl9yZWxhdGlvbnNoaXBzW3JlY29yZC50eXBlXS5zZXQocmVjb3JkLmlkLCByZWxzKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcmVtb3ZlKHJlY29yZDogUmVjb3JkSWRlbnRpdHksIGludmVyc2VSZWxhdGlvbnNoaXA6IEludmVyc2VSZWxhdGlvbnNoaXApOiB2b2lkIHtcclxuICAgIGxldCByZWxzID0gdGhpcy5fcmVsYXRpb25zaGlwc1tyZWNvcmQudHlwZV0uZ2V0KHJlY29yZC5pZCk7XHJcbiAgICBpZiAocmVscykge1xyXG4gICAgICBsZXQgbmV3UmVscyA9IHJlbHMuZmlsdGVyKHIgPT4gIShyLnJlY29yZC50eXBlID09PSBpbnZlcnNlUmVsYXRpb25zaGlwLnJlY29yZC50eXBlICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHIucmVjb3JkLmlkID09PSBpbnZlcnNlUmVsYXRpb25zaGlwLnJlY29yZC5pZCAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByLnJlbGF0aW9uc2hpcCA9PT0gaW52ZXJzZVJlbGF0aW9uc2hpcC5yZWxhdGlvbnNoaXApKTtcclxuICAgICAgdGhpcy5fcmVsYXRpb25zaGlwc1tyZWNvcmQudHlwZV0uc2V0KHJlY29yZC5pZCwgbmV3UmVscyk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdfQ==