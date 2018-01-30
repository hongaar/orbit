"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@orbit/utils");
var data_1 = require("@orbit/data");
var immutable_1 = require("@orbit/immutable");
var InverseRelationshipAccessor = (function () {
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
                    }
                    else {
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
                    }
                    else {
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
                relatedRecords.forEach(function (relatedRecord) { return _this.remove(relatedRecord, { record: record, relationship: relationship }); });
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
            var newRels = rels.filter(function (r) { return !(r.record.type === inverseRelationship.record.type &&
                r.record.id === inverseRelationship.record.id &&
                r.relationship === inverseRelationship.relationship); });
            this._relationships[record.type].set(record.id, newRels);
        }
    };
    return InverseRelationshipAccessor;
}());
exports.default = InverseRelationshipAccessor;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW52ZXJzZS1yZWxhdGlvbnNoaXAtYWNjZXNzb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvY2FjaGUvaW52ZXJzZS1yZWxhdGlvbnNoaXAtYWNjZXNzb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBdUU7QUFDdkUsb0NBSXFCO0FBRXJCLDhDQUFnRDtBQU9oRDtJQUlFLHFDQUFZLEtBQVksRUFBRSxJQUFrQztRQUMxRCxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztRQUNwQixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ25CLENBQUM7SUFFRCwyQ0FBSyxHQUFMLFVBQU0sSUFBa0M7UUFDdEMsSUFBSSxhQUFhLEdBQUcsRUFBRSxDQUFDO1FBQ3ZCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUEsSUFBSTtZQUNqRCxJQUFJLGlCQUFpQixHQUFHLElBQUksSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzFELGFBQWEsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLHdCQUFZLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUM1RCxDQUFDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxjQUFjLEdBQUcsYUFBYSxDQUFDO0lBQ3RDLENBQUM7SUFFRCw2Q0FBTyxHQUFQO1FBQUEsaUJBTUM7UUFMQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFBLElBQUk7WUFDakQsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDL0IsS0FBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLHdC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QixJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBRU8sNENBQU0sR0FBZCxVQUFlLE1BQXNCLEVBQUUsbUJBQXdDO1FBQzdFLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDM0QsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNULElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssbUJBQW1CLENBQUMsTUFBTSxDQUFDLElBQUk7Z0JBQ2pELENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxLQUFLLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUM3QyxDQUFDLENBQUMsWUFBWSxLQUFLLG1CQUFtQixDQUFDLFlBQVksQ0FBQyxFQUZ0RCxDQUVzRCxDQUFDLENBQUM7WUFDdkYsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDM0QsQ0FBQztJQUNILENBQUM7SUFDSCxrQ0FBQztBQUFELENBQUMsQUE3SUQsSUE2SUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaWN0LCBpc0FycmF5LCBpc09iamVjdCwgY2xvbmUsIGRlZXBHZXQgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xyXG5pbXBvcnQge1xyXG4gIGNsb25lUmVjb3JkSWRlbnRpdHksXHJcbiAgUmVjb3JkLFxyXG4gIFJlY29yZElkZW50aXR5XHJcbn0gZnJvbSAnQG9yYml0L2RhdGEnO1xyXG5pbXBvcnQgQ2FjaGUgZnJvbSAnLi4vY2FjaGUnO1xyXG5pbXBvcnQgeyBJbW11dGFibGVNYXAgfSBmcm9tICdAb3JiaXQvaW1tdXRhYmxlJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSW52ZXJzZVJlbGF0aW9uc2hpcCB7XHJcbiAgcmVjb3JkOiBSZWNvcmRJZGVudGl0eSxcclxuICByZWxhdGlvbnNoaXA6IHN0cmluZ1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbnZlcnNlUmVsYXRpb25zaGlwQWNjZXNzb3Ige1xyXG4gIHByb3RlY3RlZCBfY2FjaGU6IENhY2hlO1xyXG4gIHByb3RlY3RlZCBfcmVsYXRpb25zaGlwczogRGljdDxJbW11dGFibGVNYXA8c3RyaW5nLCBJbnZlcnNlUmVsYXRpb25zaGlwW10+PjtcclxuXHJcbiAgY29uc3RydWN0b3IoY2FjaGU6IENhY2hlLCBiYXNlPzogSW52ZXJzZVJlbGF0aW9uc2hpcEFjY2Vzc29yKSB7XHJcbiAgICB0aGlzLl9jYWNoZSA9IGNhY2hlO1xyXG4gICAgdGhpcy5yZXNldChiYXNlKTtcclxuICB9XHJcblxyXG4gIHJlc2V0KGJhc2U/OiBJbnZlcnNlUmVsYXRpb25zaGlwQWNjZXNzb3IpIHtcclxuICAgIGxldCByZWxhdGlvbnNoaXBzID0ge307XHJcbiAgICBPYmplY3Qua2V5cyh0aGlzLl9jYWNoZS5zY2hlbWEubW9kZWxzKS5mb3JFYWNoKHR5cGUgPT4ge1xyXG4gICAgICBsZXQgYmFzZVJlbGF0aW9uc2hpcHMgPSBiYXNlICYmIGJhc2UuX3JlbGF0aW9uc2hpcHNbdHlwZV07XHJcbiAgICAgIHJlbGF0aW9uc2hpcHNbdHlwZV0gPSBuZXcgSW1tdXRhYmxlTWFwKGJhc2VSZWxhdGlvbnNoaXBzKTtcclxuICAgIH0pO1xyXG4gICAgdGhpcy5fcmVsYXRpb25zaGlwcyA9IHJlbGF0aW9uc2hpcHM7XHJcbiAgfVxyXG5cclxuICB1cGdyYWRlKCkge1xyXG4gICAgT2JqZWN0LmtleXModGhpcy5fY2FjaGUuc2NoZW1hLm1vZGVscykuZm9yRWFjaCh0eXBlID0+IHtcclxuICAgICAgaWYgKCF0aGlzLl9yZWxhdGlvbnNoaXBzW3R5cGVdKSB7XHJcbiAgICAgICAgdGhpcy5fcmVsYXRpb25zaGlwc1t0eXBlXSA9IG5ldyBJbW11dGFibGVNYXAoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBhbGwocmVjb3JkOiBSZWNvcmRJZGVudGl0eSk6IEludmVyc2VSZWxhdGlvbnNoaXBbXSB7XHJcbiAgICByZXR1cm4gdGhpcy5fcmVsYXRpb25zaGlwc1tyZWNvcmQudHlwZV0uZ2V0KHJlY29yZC5pZCkgfHwgW107XHJcbiAgfVxyXG5cclxuICByZWNvcmRBZGRlZChyZWNvcmQ6IFJlY29yZCkge1xyXG4gICAgY29uc3QgcmVsYXRpb25zaGlwcyA9IHJlY29yZC5yZWxhdGlvbnNoaXBzO1xyXG4gICAgY29uc3QgcmVjb3JkSWRlbnRpdHkgPSBjbG9uZVJlY29yZElkZW50aXR5KHJlY29yZCk7XHJcbiAgICBpZiAocmVsYXRpb25zaGlwcykge1xyXG4gICAgICBPYmplY3Qua2V5cyhyZWxhdGlvbnNoaXBzKS5mb3JFYWNoKHJlbGF0aW9uc2hpcCA9PiB7XHJcbiAgICAgICAgY29uc3QgcmVsYXRpb25zaGlwRGF0YSA9IHJlbGF0aW9uc2hpcHNbcmVsYXRpb25zaGlwXSAmJiByZWxhdGlvbnNoaXBzW3JlbGF0aW9uc2hpcF0uZGF0YTtcclxuICAgICAgICBpZiAocmVsYXRpb25zaGlwRGF0YSkge1xyXG4gICAgICAgICAgaWYgKGlzQXJyYXkocmVsYXRpb25zaGlwRGF0YSkpIHtcclxuICAgICAgICAgICAgY29uc3QgcmVsYXRlZFJlY29yZHMgPSByZWxhdGlvbnNoaXBEYXRhIGFzIFJlY29yZFtdO1xyXG4gICAgICAgICAgICByZWxhdGVkUmVjb3Jkcy5mb3JFYWNoKHJlbGF0ZWRSZWNvcmQgPT4ge1xyXG4gICAgICAgICAgICAgIHRoaXMuYWRkKHJlbGF0ZWRSZWNvcmQsIHsgcmVjb3JkOiByZWNvcmRJZGVudGl0eSwgcmVsYXRpb25zaGlwIH0pXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgcmVsYXRlZFJlY29yZCA9IHJlbGF0aW9uc2hpcERhdGEgYXMgUmVjb3JkO1xyXG4gICAgICAgICAgICB0aGlzLmFkZChyZWxhdGVkUmVjb3JkLCB7IHJlY29yZDogcmVjb3JkSWRlbnRpdHksIHJlbGF0aW9uc2hpcCB9KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZWNvcmRSZW1vdmVkKHJlY29yZDogUmVjb3JkSWRlbnRpdHkpOiB2b2lkIHtcclxuICAgIGNvbnN0IHJlY29yZEluQ2FjaGU6IFJlY29yZCA9IHRoaXMuX2NhY2hlLnJlY29yZHMocmVjb3JkLnR5cGUpLmdldChyZWNvcmQuaWQpO1xyXG4gICAgY29uc3QgcmVsYXRpb25zaGlwcyA9IHJlY29yZEluQ2FjaGUgJiYgcmVjb3JkSW5DYWNoZS5yZWxhdGlvbnNoaXBzO1xyXG4gICAgaWYgKHJlbGF0aW9uc2hpcHMpIHtcclxuICAgICAgT2JqZWN0LmtleXMocmVsYXRpb25zaGlwcykuZm9yRWFjaChyZWxhdGlvbnNoaXAgPT4ge1xyXG4gICAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcERhdGEgPSByZWxhdGlvbnNoaXBzW3JlbGF0aW9uc2hpcF0gJiYgcmVsYXRpb25zaGlwc1tyZWxhdGlvbnNoaXBdLmRhdGE7XHJcbiAgICAgICAgaWYgKHJlbGF0aW9uc2hpcERhdGEpIHtcclxuICAgICAgICAgIGlmIChpc0FycmF5KHJlbGF0aW9uc2hpcERhdGEpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlbGF0ZWRSZWNvcmRzID0gcmVsYXRpb25zaGlwRGF0YSBhcyBSZWNvcmRbXTtcclxuICAgICAgICAgICAgcmVsYXRlZFJlY29yZHMuZm9yRWFjaChyZWxhdGVkUmVjb3JkID0+IHtcclxuICAgICAgICAgICAgICB0aGlzLnJlbW92ZShyZWxhdGVkUmVjb3JkLCB7IHJlY29yZCwgcmVsYXRpb25zaGlwIH0pXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgcmVsYXRlZFJlY29yZCA9IHJlbGF0aW9uc2hpcERhdGEgYXMgUmVjb3JkO1xyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZShyZWxhdGVkUmVjb3JkLCB7IHJlY29yZCwgcmVsYXRpb25zaGlwIH0pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIHRoaXMuX3JlbGF0aW9uc2hpcHNbcmVjb3JkLnR5cGVdLnJlbW92ZShyZWNvcmQuaWQpO1xyXG4gIH1cclxuXHJcbiAgcmVsYXRlZFJlY29yZEFkZGVkKHJlY29yZDogUmVjb3JkSWRlbnRpdHksIHJlbGF0aW9uc2hpcDogc3RyaW5nLCByZWxhdGVkUmVjb3JkOiBSZWNvcmRJZGVudGl0eSk6IHZvaWQge1xyXG4gICAgaWYgKHJlbGF0ZWRSZWNvcmQpIHtcclxuICAgICAgY29uc3QgcmVsYXRpb25zaGlwRGVmID0gdGhpcy5fY2FjaGUuc2NoZW1hLmdldE1vZGVsKHJlY29yZC50eXBlKS5yZWxhdGlvbnNoaXBzW3JlbGF0aW9uc2hpcF07XHJcbiAgICAgIGlmIChyZWxhdGlvbnNoaXBEZWYuaW52ZXJzZSkge1xyXG4gICAgICAgIGNvbnN0IHJlY29yZElkZW50aXR5ID0gY2xvbmVSZWNvcmRJZGVudGl0eShyZWNvcmQpO1xyXG4gICAgICAgIHRoaXMuYWRkKHJlbGF0ZWRSZWNvcmQsIHsgcmVjb3JkOiByZWNvcmRJZGVudGl0eSwgcmVsYXRpb25zaGlwIH0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZWxhdGVkUmVjb3Jkc0FkZGVkKHJlY29yZDogUmVjb3JkSWRlbnRpdHksIHJlbGF0aW9uc2hpcDogc3RyaW5nLCByZWxhdGVkUmVjb3JkczogUmVjb3JkSWRlbnRpdHlbXSk6IHZvaWQge1xyXG4gICAgaWYgKHJlbGF0ZWRSZWNvcmRzICYmIHJlbGF0ZWRSZWNvcmRzLmxlbmd0aCA+IDApIHtcclxuICAgICAgY29uc3QgcmVsYXRpb25zaGlwRGVmID0gdGhpcy5fY2FjaGUuc2NoZW1hLmdldE1vZGVsKHJlY29yZC50eXBlKS5yZWxhdGlvbnNoaXBzW3JlbGF0aW9uc2hpcF07XHJcbiAgICAgIGlmIChyZWxhdGlvbnNoaXBEZWYuaW52ZXJzZSkge1xyXG4gICAgICAgIGNvbnN0IHJlY29yZElkZW50aXR5ID0gY2xvbmVSZWNvcmRJZGVudGl0eShyZWNvcmQpO1xyXG4gICAgICAgIHJlbGF0ZWRSZWNvcmRzLmZvckVhY2gocmVsYXRlZFJlY29yZCA9PiB7XHJcbiAgICAgICAgICB0aGlzLmFkZChyZWxhdGVkUmVjb3JkLCB7IHJlY29yZDogcmVjb3JkSWRlbnRpdHksIHJlbGF0aW9uc2hpcCB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVsYXRlZFJlY29yZFJlbW92ZWQocmVjb3JkOiBSZWNvcmRJZGVudGl0eSwgcmVsYXRpb25zaGlwOiBzdHJpbmcsIHJlbGF0ZWRSZWNvcmQ/OiBSZWNvcmRJZGVudGl0eSk6IHZvaWQge1xyXG4gICAgY29uc3QgcmVsYXRpb25zaGlwRGVmID0gdGhpcy5fY2FjaGUuc2NoZW1hLmdldE1vZGVsKHJlY29yZC50eXBlKS5yZWxhdGlvbnNoaXBzW3JlbGF0aW9uc2hpcF07XHJcblxyXG4gICAgaWYgKHJlbGF0aW9uc2hpcERlZi5pbnZlcnNlKSB7XHJcbiAgICAgIGlmIChyZWxhdGVkUmVjb3JkID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBjb25zdCBjdXJyZW50UmVjb3JkID0gdGhpcy5fY2FjaGUucmVjb3JkcyhyZWNvcmQudHlwZSkuZ2V0KHJlY29yZC5pZCk7XHJcbiAgICAgICAgcmVsYXRlZFJlY29yZCA9IGN1cnJlbnRSZWNvcmQgJiYgZGVlcEdldChjdXJyZW50UmVjb3JkLCBbJ3JlbGF0aW9uc2hpcHMnLCByZWxhdGlvbnNoaXAsICdkYXRhJ10pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocmVsYXRlZFJlY29yZCkge1xyXG4gICAgICAgIHRoaXMucmVtb3ZlKHJlbGF0ZWRSZWNvcmQsIHsgcmVjb3JkLCByZWxhdGlvbnNoaXAgfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlbGF0ZWRSZWNvcmRzUmVtb3ZlZChyZWNvcmQ6IFJlY29yZElkZW50aXR5LCByZWxhdGlvbnNoaXA6IHN0cmluZywgcmVsYXRlZFJlY29yZHM/OiBSZWNvcmRJZGVudGl0eVtdKTogdm9pZCB7XHJcbiAgICBjb25zdCByZWxhdGlvbnNoaXBEZWYgPSB0aGlzLl9jYWNoZS5zY2hlbWEuZ2V0TW9kZWwocmVjb3JkLnR5cGUpLnJlbGF0aW9uc2hpcHNbcmVsYXRpb25zaGlwXTtcclxuXHJcbiAgICBpZiAocmVsYXRpb25zaGlwRGVmLmludmVyc2UpIHtcclxuICAgICAgaWYgKHJlbGF0ZWRSZWNvcmRzID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBjb25zdCBjdXJyZW50UmVjb3JkID0gdGhpcy5fY2FjaGUucmVjb3JkcyhyZWNvcmQudHlwZSkuZ2V0KHJlY29yZC5pZCk7XHJcbiAgICAgICAgcmVsYXRlZFJlY29yZHMgPSBjdXJyZW50UmVjb3JkICYmIGRlZXBHZXQoY3VycmVudFJlY29yZCwgWydyZWxhdGlvbnNoaXBzJywgcmVsYXRpb25zaGlwLCAnZGF0YSddKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHJlbGF0ZWRSZWNvcmRzKSB7XHJcbiAgICAgICAgcmVsYXRlZFJlY29yZHMuZm9yRWFjaChyZWxhdGVkUmVjb3JkID0+IHRoaXMucmVtb3ZlKHJlbGF0ZWRSZWNvcmQsIHsgcmVjb3JkLCByZWxhdGlvbnNoaXAgfSkpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFkZChyZWNvcmQ6IFJlY29yZElkZW50aXR5LCBpbnZlcnNlUmVsYXRpb25zaGlwOiBJbnZlcnNlUmVsYXRpb25zaGlwKTogdm9pZCB7XHJcbiAgICBsZXQgcmVscyA9IHRoaXMuX3JlbGF0aW9uc2hpcHNbcmVjb3JkLnR5cGVdLmdldChyZWNvcmQuaWQpO1xyXG4gICAgcmVscyA9IHJlbHMgPyBjbG9uZShyZWxzKSA6IFtdO1xyXG4gICAgcmVscy5wdXNoKGludmVyc2VSZWxhdGlvbnNoaXApO1xyXG4gICAgdGhpcy5fcmVsYXRpb25zaGlwc1tyZWNvcmQudHlwZV0uc2V0KHJlY29yZC5pZCwgcmVscyk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHJlbW92ZShyZWNvcmQ6IFJlY29yZElkZW50aXR5LCBpbnZlcnNlUmVsYXRpb25zaGlwOiBJbnZlcnNlUmVsYXRpb25zaGlwKTogdm9pZCB7XHJcbiAgICBsZXQgcmVscyA9IHRoaXMuX3JlbGF0aW9uc2hpcHNbcmVjb3JkLnR5cGVdLmdldChyZWNvcmQuaWQpO1xyXG4gICAgaWYgKHJlbHMpIHtcclxuICAgICAgbGV0IG5ld1JlbHMgPSByZWxzLmZpbHRlcihyID0+ICEoci5yZWNvcmQudHlwZSA9PT0gaW52ZXJzZVJlbGF0aW9uc2hpcC5yZWNvcmQudHlwZSAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByLnJlY29yZC5pZCA9PT0gaW52ZXJzZVJlbGF0aW9uc2hpcC5yZWNvcmQuaWQgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgci5yZWxhdGlvbnNoaXAgPT09IGludmVyc2VSZWxhdGlvbnNoaXAucmVsYXRpb25zaGlwKSk7XHJcbiAgICAgIHRoaXMuX3JlbGF0aW9uc2hpcHNbcmVjb3JkLnR5cGVdLnNldChyZWNvcmQuaWQsIG5ld1JlbHMpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXX0=