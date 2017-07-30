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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW52ZXJzZS1yZWxhdGlvbnNoaXAtYWNjZXNzb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvY2FjaGUvaW52ZXJzZS1yZWxhdGlvbnNoaXAtYWNjZXNzb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsc0JBQXVFO0FBQ3ZFLHFCQUlxQjtBQUVyQiwwQkFBZ0Q7QUFPaEQ7QUFJRSx5Q0FBWSxBQUFZLE9BQUUsQUFBa0M7QUFDMUQsQUFBSSxhQUFDLEFBQU0sU0FBRyxBQUFLLEFBQUM7QUFDcEIsQUFBSSxhQUFDLEFBQUssTUFBQyxBQUFJLEFBQUMsQUFBQyxBQUNuQjtBQUFDO0FBRUQsMENBQUssUUFBTCxVQUFNLEFBQWtDO0FBQ3RDLFlBQUksQUFBYSxnQkFBRyxBQUFFLEFBQUM7QUFDdkIsQUFBTSxlQUFDLEFBQUksS0FBQyxBQUFJLEtBQUMsQUFBTSxPQUFDLEFBQU0sT0FBQyxBQUFNLEFBQUMsUUFBQyxBQUFPLFFBQUMsVUFBQSxBQUFJO0FBQ2pELGdCQUFJLEFBQWlCLG9CQUFHLEFBQUksUUFBSSxBQUFJLEtBQUMsQUFBYyxlQUFDLEFBQUksQUFBQyxBQUFDO0FBQzFELEFBQWEsMEJBQUMsQUFBSSxBQUFDLFFBQUcsSUFBSSxZQUFZLGFBQUMsQUFBaUIsQUFBQyxBQUFDLEFBQzVEO0FBQUMsQUFBQyxBQUFDO0FBQ0gsQUFBSSxhQUFDLEFBQWMsaUJBQUcsQUFBYSxBQUFDLEFBQ3RDO0FBQUM7QUFFRCwwQ0FBRyxNQUFILFVBQUksQUFBc0I7QUFDeEIsQUFBTSxlQUFDLEFBQUksS0FBQyxBQUFjLGVBQUMsQUFBTSxPQUFDLEFBQUksQUFBQyxNQUFDLEFBQUcsSUFBQyxBQUFNLE9BQUMsQUFBRSxBQUFDLE9BQUksQUFBRSxBQUFDLEFBQy9EO0FBQUM7QUFFRCwwQ0FBVyxjQUFYLFVBQVksQUFBYztBQUExQixvQkFtQkM7QUFsQkMsWUFBTSxBQUFhLGdCQUFHLEFBQU0sT0FBQyxBQUFhLEFBQUM7QUFDM0MsWUFB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QUMsQUFBQztBQUNULGdCQUFJLEFBQU8sZUFBUSxBQUFNLE9BQUMsVUFBQSxBQUFDO0FBQUksdUJBQUEsQUFBQyxFQUFDLEFBQUMsRUFBQyxBQUFNLE9BQUMsQUFBSSxTQUFLLEFBQW1CLG9CQUFDLEFBQU0sT0FBQyxBQUFJLFFBQ2pELEFBQUMsRUFBQyxBQUFNLE9BQUMsQUFBRSxPQUFLLEFBQW1CLG9CQUFDLEFBQU0sT0FBQyxBQUFFLE1BQzdDLEFBQUMsRUFBQyxBQUFZLGlCQUFLLEFBQW1CLG9CQUZ4QyxBQUV5QyxBQUFZLEFBQUM7QUFBQSxBQUFDLEFBQUMsYUFGekUsQUFBSTtBQUdsQixBQUFJLGlCQUFDLEFBQWMsZUFBQyxBQUFNLE9BQUMsQUFBSSxBQUFDLE1BQUMsQUFBRyxJQUFDLEFBQU0sT0FBQyxBQUFFLElBQUUsQUFBTyxBQUFDLEFBQUMsQUFDM0Q7QUFBQyxBQUNIO0FBQUM7QUFDSCxXQUFBLEFBQUM7QUFySUQsQUFxSUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaWN0LCBpc0FycmF5LCBpc09iamVjdCwgY2xvbmUsIGRlZXBHZXQgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xyXG5pbXBvcnQge1xyXG4gIGNsb25lUmVjb3JkSWRlbnRpdHksXHJcbiAgUmVjb3JkLFxyXG4gIFJlY29yZElkZW50aXR5XHJcbn0gZnJvbSAnQG9yYml0L2RhdGEnO1xyXG5pbXBvcnQgQ2FjaGUgZnJvbSAnLi4vY2FjaGUnO1xyXG5pbXBvcnQgeyBJbW11dGFibGVNYXAgfSBmcm9tICdAb3JiaXQvaW1tdXRhYmxlJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSW52ZXJzZVJlbGF0aW9uc2hpcCB7XHJcbiAgcmVjb3JkOiBSZWNvcmRJZGVudGl0eSxcclxuICByZWxhdGlvbnNoaXA6IHN0cmluZ1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbnZlcnNlUmVsYXRpb25zaGlwQWNjZXNzb3Ige1xyXG4gIHByb3RlY3RlZCBfY2FjaGU6IENhY2hlO1xyXG4gIHByb3RlY3RlZCBfcmVsYXRpb25zaGlwczogRGljdDxJbW11dGFibGVNYXA8c3RyaW5nLCBJbnZlcnNlUmVsYXRpb25zaGlwW10+PjtcclxuXHJcbiAgY29uc3RydWN0b3IoY2FjaGU6IENhY2hlLCBiYXNlPzogSW52ZXJzZVJlbGF0aW9uc2hpcEFjY2Vzc29yKSB7XHJcbiAgICB0aGlzLl9jYWNoZSA9IGNhY2hlO1xyXG4gICAgdGhpcy5yZXNldChiYXNlKTtcclxuICB9XHJcblxyXG4gIHJlc2V0KGJhc2U/OiBJbnZlcnNlUmVsYXRpb25zaGlwQWNjZXNzb3IpIHtcclxuICAgIGxldCByZWxhdGlvbnNoaXBzID0ge307XHJcbiAgICBPYmplY3Qua2V5cyh0aGlzLl9jYWNoZS5zY2hlbWEubW9kZWxzKS5mb3JFYWNoKHR5cGUgPT4ge1xyXG4gICAgICBsZXQgYmFzZVJlbGF0aW9uc2hpcHMgPSBiYXNlICYmIGJhc2UuX3JlbGF0aW9uc2hpcHNbdHlwZV07XHJcbiAgICAgIHJlbGF0aW9uc2hpcHNbdHlwZV0gPSBuZXcgSW1tdXRhYmxlTWFwKGJhc2VSZWxhdGlvbnNoaXBzKTtcclxuICAgIH0pO1xyXG4gICAgdGhpcy5fcmVsYXRpb25zaGlwcyA9IHJlbGF0aW9uc2hpcHM7XHJcbiAgfVxyXG5cclxuICBhbGwocmVjb3JkOiBSZWNvcmRJZGVudGl0eSk6IEludmVyc2VSZWxhdGlvbnNoaXBbXSB7XHJcbiAgICByZXR1cm4gdGhpcy5fcmVsYXRpb25zaGlwc1tyZWNvcmQudHlwZV0uZ2V0KHJlY29yZC5pZCkgfHwgW107XHJcbiAgfVxyXG5cclxuICByZWNvcmRBZGRlZChyZWNvcmQ6IFJlY29yZCkge1xyXG4gICAgY29uc3QgcmVsYXRpb25zaGlwcyA9IHJlY29yZC5yZWxhdGlvbnNoaXBzO1xyXG4gICAgY29uc3QgcmVjb3JkSWRlbnRpdHkgPSBjbG9uZVJlY29yZElkZW50aXR5KHJlY29yZCk7XHJcbiAgICBpZiAocmVsYXRpb25zaGlwcykge1xyXG4gICAgICBPYmplY3Qua2V5cyhyZWxhdGlvbnNoaXBzKS5mb3JFYWNoKHJlbGF0aW9uc2hpcCA9PiB7XHJcbiAgICAgICAgY29uc3QgcmVsYXRpb25zaGlwRGF0YSA9IHJlbGF0aW9uc2hpcHNbcmVsYXRpb25zaGlwXSAmJiByZWxhdGlvbnNoaXBzW3JlbGF0aW9uc2hpcF0uZGF0YTtcclxuICAgICAgICBpZiAocmVsYXRpb25zaGlwRGF0YSkge1xyXG4gICAgICAgICAgaWYgKGlzQXJyYXkocmVsYXRpb25zaGlwRGF0YSkpIHtcclxuICAgICAgICAgICAgY29uc3QgcmVsYXRlZFJlY29yZHMgPSByZWxhdGlvbnNoaXBEYXRhIGFzIFJlY29yZFtdO1xyXG4gICAgICAgICAgICByZWxhdGVkUmVjb3Jkcy5mb3JFYWNoKHJlbGF0ZWRSZWNvcmQgPT4ge1xyXG4gICAgICAgICAgICAgIHRoaXMuYWRkKHJlbGF0ZWRSZWNvcmQsIHsgcmVjb3JkOiByZWNvcmRJZGVudGl0eSwgcmVsYXRpb25zaGlwIH0pXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgcmVsYXRlZFJlY29yZCA9IHJlbGF0aW9uc2hpcERhdGEgYXMgUmVjb3JkO1xyXG4gICAgICAgICAgICB0aGlzLmFkZChyZWxhdGVkUmVjb3JkLCB7IHJlY29yZDogcmVjb3JkSWRlbnRpdHksIHJlbGF0aW9uc2hpcCB9KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZWNvcmRSZW1vdmVkKHJlY29yZDogUmVjb3JkSWRlbnRpdHkpOiB2b2lkIHtcclxuICAgIGNvbnN0IHJlY29yZEluQ2FjaGU6IFJlY29yZCA9IHRoaXMuX2NhY2hlLnJlY29yZHMocmVjb3JkLnR5cGUpLmdldChyZWNvcmQuaWQpO1xyXG4gICAgY29uc3QgcmVsYXRpb25zaGlwcyA9IHJlY29yZEluQ2FjaGUgJiYgcmVjb3JkSW5DYWNoZS5yZWxhdGlvbnNoaXBzO1xyXG4gICAgaWYgKHJlbGF0aW9uc2hpcHMpIHtcclxuICAgICAgT2JqZWN0LmtleXMocmVsYXRpb25zaGlwcykuZm9yRWFjaChyZWxhdGlvbnNoaXAgPT4ge1xyXG4gICAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcERhdGEgPSByZWxhdGlvbnNoaXBzW3JlbGF0aW9uc2hpcF0gJiYgcmVsYXRpb25zaGlwc1tyZWxhdGlvbnNoaXBdLmRhdGE7XHJcbiAgICAgICAgaWYgKHJlbGF0aW9uc2hpcERhdGEpIHtcclxuICAgICAgICAgIGlmIChpc0FycmF5KHJlbGF0aW9uc2hpcERhdGEpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlbGF0ZWRSZWNvcmRzID0gcmVsYXRpb25zaGlwRGF0YSBhcyBSZWNvcmRbXTtcclxuICAgICAgICAgICAgcmVsYXRlZFJlY29yZHMuZm9yRWFjaChyZWxhdGVkUmVjb3JkID0+IHtcclxuICAgICAgICAgICAgICB0aGlzLnJlbW92ZShyZWxhdGVkUmVjb3JkLCB7IHJlY29yZCwgcmVsYXRpb25zaGlwIH0pXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgcmVsYXRlZFJlY29yZCA9IHJlbGF0aW9uc2hpcERhdGEgYXMgUmVjb3JkO1xyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZShyZWxhdGVkUmVjb3JkLCB7IHJlY29yZCwgcmVsYXRpb25zaGlwIH0pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIHRoaXMuX3JlbGF0aW9uc2hpcHNbcmVjb3JkLnR5cGVdLnJlbW92ZShyZWNvcmQuaWQpO1xyXG4gIH1cclxuXHJcbiAgcmVsYXRlZFJlY29yZEFkZGVkKHJlY29yZDogUmVjb3JkSWRlbnRpdHksIHJlbGF0aW9uc2hpcDogc3RyaW5nLCByZWxhdGVkUmVjb3JkOiBSZWNvcmRJZGVudGl0eSk6IHZvaWQge1xyXG4gICAgaWYgKHJlbGF0ZWRSZWNvcmQpIHtcclxuICAgICAgY29uc3QgcmVsYXRpb25zaGlwRGVmID0gdGhpcy5fY2FjaGUuc2NoZW1hLm1vZGVsc1tyZWNvcmQudHlwZV0ucmVsYXRpb25zaGlwc1tyZWxhdGlvbnNoaXBdO1xyXG4gICAgICBpZiAocmVsYXRpb25zaGlwRGVmLmludmVyc2UpIHtcclxuICAgICAgICBjb25zdCByZWNvcmRJZGVudGl0eSA9IGNsb25lUmVjb3JkSWRlbnRpdHkocmVjb3JkKTtcclxuICAgICAgICB0aGlzLmFkZChyZWxhdGVkUmVjb3JkLCB7IHJlY29yZDogcmVjb3JkSWRlbnRpdHksIHJlbGF0aW9uc2hpcCB9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVsYXRlZFJlY29yZHNBZGRlZChyZWNvcmQ6IFJlY29yZElkZW50aXR5LCByZWxhdGlvbnNoaXA6IHN0cmluZywgcmVsYXRlZFJlY29yZHM6IFJlY29yZElkZW50aXR5W10pOiB2b2lkIHtcclxuICAgIGlmIChyZWxhdGVkUmVjb3JkcyAmJiByZWxhdGVkUmVjb3Jkcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcERlZiA9IHRoaXMuX2NhY2hlLnNjaGVtYS5tb2RlbHNbcmVjb3JkLnR5cGVdLnJlbGF0aW9uc2hpcHNbcmVsYXRpb25zaGlwXTtcclxuICAgICAgaWYgKHJlbGF0aW9uc2hpcERlZi5pbnZlcnNlKSB7XHJcbiAgICAgICAgY29uc3QgcmVjb3JkSWRlbnRpdHkgPSBjbG9uZVJlY29yZElkZW50aXR5KHJlY29yZCk7XHJcbiAgICAgICAgcmVsYXRlZFJlY29yZHMuZm9yRWFjaChyZWxhdGVkUmVjb3JkID0+IHtcclxuICAgICAgICAgIHRoaXMuYWRkKHJlbGF0ZWRSZWNvcmQsIHsgcmVjb3JkOiByZWNvcmRJZGVudGl0eSwgcmVsYXRpb25zaGlwIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZWxhdGVkUmVjb3JkUmVtb3ZlZChyZWNvcmQ6IFJlY29yZElkZW50aXR5LCByZWxhdGlvbnNoaXA6IHN0cmluZywgcmVsYXRlZFJlY29yZD86IFJlY29yZElkZW50aXR5KTogdm9pZCB7XHJcbiAgICBjb25zdCByZWxhdGlvbnNoaXBEZWYgPSB0aGlzLl9jYWNoZS5zY2hlbWEubW9kZWxzW3JlY29yZC50eXBlXS5yZWxhdGlvbnNoaXBzW3JlbGF0aW9uc2hpcF07XHJcblxyXG4gICAgaWYgKHJlbGF0aW9uc2hpcERlZi5pbnZlcnNlKSB7XHJcbiAgICAgIGlmIChyZWxhdGVkUmVjb3JkID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBjb25zdCBjdXJyZW50UmVjb3JkID0gdGhpcy5fY2FjaGUucmVjb3JkcyhyZWNvcmQudHlwZSkuZ2V0KHJlY29yZC5pZCk7XHJcbiAgICAgICAgcmVsYXRlZFJlY29yZCA9IGN1cnJlbnRSZWNvcmQgJiYgZGVlcEdldChjdXJyZW50UmVjb3JkLCBbJ3JlbGF0aW9uc2hpcHMnLCByZWxhdGlvbnNoaXAsICdkYXRhJ10pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocmVsYXRlZFJlY29yZCkge1xyXG4gICAgICAgIHRoaXMucmVtb3ZlKHJlbGF0ZWRSZWNvcmQsIHsgcmVjb3JkLCByZWxhdGlvbnNoaXAgfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlbGF0ZWRSZWNvcmRzUmVtb3ZlZChyZWNvcmQ6IFJlY29yZElkZW50aXR5LCByZWxhdGlvbnNoaXA6IHN0cmluZywgcmVsYXRlZFJlY29yZHM/OiBSZWNvcmRJZGVudGl0eVtdKTogdm9pZCB7XHJcbiAgICBjb25zdCByZWxhdGlvbnNoaXBEZWYgPSB0aGlzLl9jYWNoZS5zY2hlbWEubW9kZWxzW3JlY29yZC50eXBlXS5yZWxhdGlvbnNoaXBzW3JlbGF0aW9uc2hpcF07XHJcblxyXG4gICAgaWYgKHJlbGF0aW9uc2hpcERlZi5pbnZlcnNlKSB7XHJcbiAgICAgIGlmIChyZWxhdGVkUmVjb3JkcyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgY29uc3QgY3VycmVudFJlY29yZCA9IHRoaXMuX2NhY2hlLnJlY29yZHMocmVjb3JkLnR5cGUpLmdldChyZWNvcmQuaWQpO1xyXG4gICAgICAgIHJlbGF0ZWRSZWNvcmRzID0gY3VycmVudFJlY29yZCAmJiBkZWVwR2V0KGN1cnJlbnRSZWNvcmQsIFsncmVsYXRpb25zaGlwcycsIHJlbGF0aW9uc2hpcCwgJ2RhdGEnXSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChyZWxhdGVkUmVjb3Jkcykge1xyXG4gICAgICAgIHJlbGF0ZWRSZWNvcmRzLmZvckVhY2gocmVsYXRlZFJlY29yZCA9PiB0aGlzLnJlbW92ZShyZWxhdGVkUmVjb3JkLCB7IHJlY29yZCwgcmVsYXRpb25zaGlwIH0pKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhZGQocmVjb3JkOiBSZWNvcmRJZGVudGl0eSwgaW52ZXJzZVJlbGF0aW9uc2hpcDogSW52ZXJzZVJlbGF0aW9uc2hpcCk6IHZvaWQge1xyXG4gICAgbGV0IHJlbHMgPSB0aGlzLl9yZWxhdGlvbnNoaXBzW3JlY29yZC50eXBlXS5nZXQocmVjb3JkLmlkKTtcclxuICAgIHJlbHMgPSByZWxzID8gY2xvbmUocmVscykgOiBbXTtcclxuICAgIHJlbHMucHVzaChpbnZlcnNlUmVsYXRpb25zaGlwKTtcclxuICAgIHRoaXMuX3JlbGF0aW9uc2hpcHNbcmVjb3JkLnR5cGVdLnNldChyZWNvcmQuaWQsIHJlbHMpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByZW1vdmUocmVjb3JkOiBSZWNvcmRJZGVudGl0eSwgaW52ZXJzZVJlbGF0aW9uc2hpcDogSW52ZXJzZVJlbGF0aW9uc2hpcCk6IHZvaWQge1xyXG4gICAgbGV0IHJlbHMgPSB0aGlzLl9yZWxhdGlvbnNoaXBzW3JlY29yZC50eXBlXS5nZXQocmVjb3JkLmlkKTtcclxuICAgIGlmIChyZWxzKSB7XHJcbiAgICAgIGxldCBuZXdSZWxzID0gcmVscy5maWx0ZXIociA9PiAhKHIucmVjb3JkLnR5cGUgPT09IGludmVyc2VSZWxhdGlvbnNoaXAucmVjb3JkLnR5cGUgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgci5yZWNvcmQuaWQgPT09IGludmVyc2VSZWxhdGlvbnNoaXAucmVjb3JkLmlkICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHIucmVsYXRpb25zaGlwID09PSBpbnZlcnNlUmVsYXRpb25zaGlwLnJlbGF0aW9uc2hpcCkpO1xyXG4gICAgICB0aGlzLl9yZWxhdGlvbnNoaXBzW3JlY29yZC50eXBlXS5zZXQocmVjb3JkLmlkLCBuZXdSZWxzKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIl19