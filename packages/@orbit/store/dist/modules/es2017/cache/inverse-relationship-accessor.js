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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW52ZXJzZS1yZWxhdGlvbnNoaXAtYWNjZXNzb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvY2FjaGUvaW52ZXJzZS1yZWxhdGlvbnNoaXAtYWNjZXNzb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBdUU7QUFDdkUsb0NBSXFCO0FBRXJCLDhDQUFnRDtBQU9oRDtJQUlFLHFDQUFZLEtBQVksRUFBRSxJQUFrQztRQUMxRCxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztRQUNwQixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ25CLENBQUM7SUFFRCwyQ0FBSyxHQUFMLFVBQU0sSUFBa0M7UUFDdEMsSUFBSSxhQUFhLEdBQUcsRUFBRSxDQUFDO1FBQ3ZCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUEsSUFBSTtZQUNqRCxJQUFJLGlCQUFpQixHQUFHLElBQUksSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzFELGFBQWEsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLHdCQUFZLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUM1RCxDQUFDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxjQUFjLEdBQUcsYUFBYSxDQUFDO0lBQ3RDLENBQUM7SUFFRCx5Q0FBRyxHQUFILFVBQUksTUFBc0I7UUFDeEIsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQy9ELENBQUM7SUFFRCxpREFBVyxHQUFYLFVBQVksTUFBYztRQUExQixpQkFtQkM7UUFsQkMsSUFBTSxhQUFhLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQztRQUMzQyxJQUFNLGNB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SSxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsSUFBSTtnQkFDakQsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEtBQUssbUJBQW1CLENBQUMsTUFBTSxDQUFDLEVBQUU7Z0JBQzdDLENBQUMsQ0FBQyxZQUFZLEtBQUssbUJBQW1CLENBQUMsWUFBWSxDQUFDLEVBRnRELENBRXNELENBQUMsQ0FBQztZQUN2RixJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUMzRCxDQUFDO0lBQ0gsQ0FBQztJQUNILGtDQUFDO0FBQUQsQ0FBQyxBQXJJRCxJQXFJQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpY3QsIGlzQXJyYXksIGlzT2JqZWN0LCBjbG9uZSwgZGVlcEdldCB9IGZyb20gJ0BvcmJpdC91dGlscyc7XHJcbmltcG9ydCB7XHJcbiAgY2xvbmVSZWNvcmRJZGVudGl0eSxcclxuICBSZWNvcmQsXHJcbiAgUmVjb3JkSWRlbnRpdHlcclxufSBmcm9tICdAb3JiaXQvZGF0YSc7XHJcbmltcG9ydCBDYWNoZSBmcm9tICcuLi9jYWNoZSc7XHJcbmltcG9ydCB7IEltbXV0YWJsZU1hcCB9IGZyb20gJ0BvcmJpdC9pbW11dGFibGUnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJbnZlcnNlUmVsYXRpb25zaGlwIHtcclxuICByZWNvcmQ6IFJlY29yZElkZW50aXR5LFxyXG4gIHJlbGF0aW9uc2hpcDogc3RyaW5nXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEludmVyc2VSZWxhdGlvbnNoaXBBY2Nlc3NvciB7XHJcbiAgcHJvdGVjdGVkIF9jYWNoZTogQ2FjaGU7XHJcbiAgcHJvdGVjdGVkIF9yZWxhdGlvbnNoaXBzOiBEaWN0PEltbXV0YWJsZU1hcDxzdHJpbmcsIEludmVyc2VSZWxhdGlvbnNoaXBbXT4+O1xyXG5cclxuICBjb25zdHJ1Y3RvcihjYWNoZTogQ2FjaGUsIGJhc2U/OiBJbnZlcnNlUmVsYXRpb25zaGlwQWNjZXNzb3IpIHtcclxuICAgIHRoaXMuX2NhY2hlID0gY2FjaGU7XHJcbiAgICB0aGlzLnJlc2V0KGJhc2UpO1xyXG4gIH1cclxuXHJcbiAgcmVzZXQoYmFzZT86IEludmVyc2VSZWxhdGlvbnNoaXBBY2Nlc3Nvcikge1xyXG4gICAgbGV0IHJlbGF0aW9uc2hpcHMgPSB7fTtcclxuICAgIE9iamVjdC5rZXlzKHRoaXMuX2NhY2hlLnNjaGVtYS5tb2RlbHMpLmZvckVhY2godHlwZSA9PiB7XHJcbiAgICAgIGxldCBiYXNlUmVsYXRpb25zaGlwcyA9IGJhc2UgJiYgYmFzZS5fcmVsYXRpb25zaGlwc1t0eXBlXTtcclxuICAgICAgcmVsYXRpb25zaGlwc1t0eXBlXSA9IG5ldyBJbW11dGFibGVNYXAoYmFzZVJlbGF0aW9uc2hpcHMpO1xyXG4gICAgfSk7XHJcbiAgICB0aGlzLl9yZWxhdGlvbnNoaXBzID0gcmVsYXRpb25zaGlwcztcclxuICB9XHJcblxyXG4gIGFsbChyZWNvcmQ6IFJlY29yZElkZW50aXR5KTogSW52ZXJzZVJlbGF0aW9uc2hpcFtdIHtcclxuICAgIHJldHVybiB0aGlzLl9yZWxhdGlvbnNoaXBzW3JlY29yZC50eXBlXS5nZXQocmVjb3JkLmlkKSB8fCBbXTtcclxuICB9XHJcblxyXG4gIHJlY29yZEFkZGVkKHJlY29yZDogUmVjb3JkKSB7XHJcbiAgICBjb25zdCByZWxhdGlvbnNoaXBzID0gcmVjb3JkLnJlbGF0aW9uc2hpcHM7XHJcbiAgICBjb25zdCByZWNvcmRJZGVudGl0eSA9IGNsb25lUmVjb3JkSWRlbnRpdHkocmVjb3JkKTtcclxuICAgIGlmIChyZWxhdGlvbnNoaXBzKSB7XHJcbiAgICAgIE9iamVjdC5rZXlzKHJlbGF0aW9uc2hpcHMpLmZvckVhY2gocmVsYXRpb25zaGlwID0+IHtcclxuICAgICAgICBjb25zdCByZWxhdGlvbnNoaXBEYXRhID0gcmVsYXRpb25zaGlwc1tyZWxhdGlvbnNoaXBdICYmIHJlbGF0aW9uc2hpcHNbcmVsYXRpb25zaGlwXS5kYXRhO1xyXG4gICAgICAgIGlmIChyZWxhdGlvbnNoaXBEYXRhKSB7XHJcbiAgICAgICAgICBpZiAoaXNBcnJheShyZWxhdGlvbnNoaXBEYXRhKSkge1xyXG4gICAgICAgICAgICBjb25zdCByZWxhdGVkUmVjb3JkcyA9IHJlbGF0aW9uc2hpcERhdGEgYXMgUmVjb3JkW107XHJcbiAgICAgICAgICAgIHJlbGF0ZWRSZWNvcmRzLmZvckVhY2gocmVsYXRlZFJlY29yZCA9PiB7XHJcbiAgICAgICAgICAgICAgdGhpcy5hZGQocmVsYXRlZFJlY29yZCwgeyByZWNvcmQ6IHJlY29yZElkZW50aXR5LCByZWxhdGlvbnNoaXAgfSlcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCByZWxhdGVkUmVjb3JkID0gcmVsYXRpb25zaGlwRGF0YSBhcyBSZWNvcmQ7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkKHJlbGF0ZWRSZWNvcmQsIHsgcmVjb3JkOiByZWNvcmRJZGVudGl0eSwgcmVsYXRpb25zaGlwIH0pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlY29yZFJlbW92ZWQocmVjb3JkOiBSZWNvcmRJZGVudGl0eSk6IHZvaWQge1xyXG4gICAgY29uc3QgcmVjb3JkSW5DYWNoZTogUmVjb3JkID0gdGhpcy5fY2FjaGUucmVjb3JkcyhyZWNvcmQudHlwZSkuZ2V0KHJlY29yZC5pZCk7XHJcbiAgICBjb25zdCByZWxhdGlvbnNoaXBzID0gcmVjb3JkSW5DYWNoZSAmJiByZWNvcmRJbkNhY2hlLnJlbGF0aW9uc2hpcHM7XHJcbiAgICBpZiAocmVsYXRpb25zaGlwcykge1xyXG4gICAgICBPYmplY3Qua2V5cyhyZWxhdGlvbnNoaXBzKS5mb3JFYWNoKHJlbGF0aW9uc2hpcCA9PiB7XHJcbiAgICAgICAgY29uc3QgcmVsYXRpb25zaGlwRGF0YSA9IHJlbGF0aW9uc2hpcHNbcmVsYXRpb25zaGlwXSAmJiByZWxhdGlvbnNoaXBzW3JlbGF0aW9uc2hpcF0uZGF0YTtcclxuICAgICAgICBpZiAocmVsYXRpb25zaGlwRGF0YSkge1xyXG4gICAgICAgICAgaWYgKGlzQXJyYXkocmVsYXRpb25zaGlwRGF0YSkpIHtcclxuICAgICAgICAgICAgY29uc3QgcmVsYXRlZFJlY29yZHMgPSByZWxhdGlvbnNoaXBEYXRhIGFzIFJlY29yZFtdO1xyXG4gICAgICAgICAgICByZWxhdGVkUmVjb3Jkcy5mb3JFYWNoKHJlbGF0ZWRSZWNvcmQgPT4ge1xyXG4gICAgICAgICAgICAgIHRoaXMucmVtb3ZlKHJlbGF0ZWRSZWNvcmQsIHsgcmVjb3JkLCByZWxhdGlvbnNoaXAgfSlcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCByZWxhdGVkUmVjb3JkID0gcmVsYXRpb25zaGlwRGF0YSBhcyBSZWNvcmQ7XHJcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlKHJlbGF0ZWRSZWNvcmQsIHsgcmVjb3JkLCByZWxhdGlvbnNoaXAgfSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgdGhpcy5fcmVsYXRpb25zaGlwc1tyZWNvcmQudHlwZV0ucmVtb3ZlKHJlY29yZC5pZCk7XHJcbiAgfVxyXG5cclxuICByZWxhdGVkUmVjb3JkQWRkZWQocmVjb3JkOiBSZWNvcmRJZGVudGl0eSwgcmVsYXRpb25zaGlwOiBzdHJpbmcsIHJlbGF0ZWRSZWNvcmQ6IFJlY29yZElkZW50aXR5KTogdm9pZCB7XHJcbiAgICBpZiAocmVsYXRlZFJlY29yZCkge1xyXG4gICAgICBjb25zdCByZWxhdGlvbnNoaXBEZWYgPSB0aGlzLl9jYWNoZS5zY2hlbWEubW9kZWxzW3JlY29yZC50eXBlXS5yZWxhdGlvbnNoaXBzW3JlbGF0aW9uc2hpcF07XHJcbiAgICAgIGlmIChyZWxhdGlvbnNoaXBEZWYuaW52ZXJzZSkge1xyXG4gICAgICAgIGNvbnN0IHJlY29yZElkZW50aXR5ID0gY2xvbmVSZWNvcmRJZGVudGl0eShyZWNvcmQpO1xyXG4gICAgICAgIHRoaXMuYWRkKHJlbGF0ZWRSZWNvcmQsIHsgcmVjb3JkOiByZWNvcmRJZGVudGl0eSwgcmVsYXRpb25zaGlwIH0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZWxhdGVkUmVjb3Jkc0FkZGVkKHJlY29yZDogUmVjb3JkSWRlbnRpdHksIHJlbGF0aW9uc2hpcDogc3RyaW5nLCByZWxhdGVkUmVjb3JkczogUmVjb3JkSWRlbnRpdHlbXSk6IHZvaWQge1xyXG4gICAgaWYgKHJlbGF0ZWRSZWNvcmRzICYmIHJlbGF0ZWRSZWNvcmRzLmxlbmd0aCA+IDApIHtcclxuICAgICAgY29uc3QgcmVsYXRpb25zaGlwRGVmID0gdGhpcy5fY2FjaGUuc2NoZW1hLm1vZGVsc1tyZWNvcmQudHlwZV0ucmVsYXRpb25zaGlwc1tyZWxhdGlvbnNoaXBdO1xyXG4gICAgICBpZiAocmVsYXRpb25zaGlwRGVmLmludmVyc2UpIHtcclxuICAgICAgICBjb25zdCByZWNvcmRJZGVudGl0eSA9IGNsb25lUmVjb3JkSWRlbnRpdHkocmVjb3JkKTtcclxuICAgICAgICByZWxhdGVkUmVjb3Jkcy5mb3JFYWNoKHJlbGF0ZWRSZWNvcmQgPT4ge1xyXG4gICAgICAgICAgdGhpcy5hZGQocmVsYXRlZFJlY29yZCwgeyByZWNvcmQ6IHJlY29yZElkZW50aXR5LCByZWxhdGlvbnNoaXAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlbGF0ZWRSZWNvcmRSZW1vdmVkKHJlY29yZDogUmVjb3JkSWRlbnRpdHksIHJlbGF0aW9uc2hpcDogc3RyaW5nLCByZWxhdGVkUmVjb3JkPzogUmVjb3JkSWRlbnRpdHkpOiB2b2lkIHtcclxuICAgIGNvbnN0IHJlbGF0aW9uc2hpcERlZiA9IHRoaXMuX2NhY2hlLnNjaGVtYS5tb2RlbHNbcmVjb3JkLnR5cGVdLnJlbGF0aW9uc2hpcHNbcmVsYXRpb25zaGlwXTtcclxuXHJcbiAgICBpZiAocmVsYXRpb25zaGlwRGVmLmludmVyc2UpIHtcclxuICAgICAgaWYgKHJlbGF0ZWRSZWNvcmQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGNvbnN0IGN1cnJlbnRSZWNvcmQgPSB0aGlzLl9jYWNoZS5yZWNvcmRzKHJlY29yZC50eXBlKS5nZXQocmVjb3JkLmlkKTtcclxuICAgICAgICByZWxhdGVkUmVjb3JkID0gY3VycmVudFJlY29yZCAmJiBkZWVwR2V0KGN1cnJlbnRSZWNvcmQsIFsncmVsYXRpb25zaGlwcycsIHJlbGF0aW9uc2hpcCwgJ2RhdGEnXSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChyZWxhdGVkUmVjb3JkKSB7XHJcbiAgICAgICAgdGhpcy5yZW1vdmUocmVsYXRlZFJlY29yZCwgeyByZWNvcmQsIHJlbGF0aW9uc2hpcCB9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVsYXRlZFJlY29yZHNSZW1vdmVkKHJlY29yZDogUmVjb3JkSWRlbnRpdHksIHJlbGF0aW9uc2hpcDogc3RyaW5nLCByZWxhdGVkUmVjb3Jkcz86IFJlY29yZElkZW50aXR5W10pOiB2b2lkIHtcclxuICAgIGNvbnN0IHJlbGF0aW9uc2hpcERlZiA9IHRoaXMuX2NhY2hlLnNjaGVtYS5tb2RlbHNbcmVjb3JkLnR5cGVdLnJlbGF0aW9uc2hpcHNbcmVsYXRpb25zaGlwXTtcclxuXHJcbiAgICBpZiAocmVsYXRpb25zaGlwRGVmLmludmVyc2UpIHtcclxuICAgICAgaWYgKHJlbGF0ZWRSZWNvcmRzID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBjb25zdCBjdXJyZW50UmVjb3JkID0gdGhpcy5fY2FjaGUucmVjb3JkcyhyZWNvcmQudHlwZSkuZ2V0KHJlY29yZC5pZCk7XHJcbiAgICAgICAgcmVsYXRlZFJlY29yZHMgPSBjdXJyZW50UmVjb3JkICYmIGRlZXBHZXQoY3VycmVudFJlY29yZCwgWydyZWxhdGlvbnNoaXBzJywgcmVsYXRpb25zaGlwLCAnZGF0YSddKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHJlbGF0ZWRSZWNvcmRzKSB7XHJcbiAgICAgICAgcmVsYXRlZFJlY29yZHMuZm9yRWFjaChyZWxhdGVkUmVjb3JkID0+IHRoaXMucmVtb3ZlKHJlbGF0ZWRSZWNvcmQsIHsgcmVjb3JkLCByZWxhdGlvbnNoaXAgfSkpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFkZChyZWNvcmQ6IFJlY29yZElkZW50aXR5LCBpbnZlcnNlUmVsYXRpb25zaGlwOiBJbnZlcnNlUmVsYXRpb25zaGlwKTogdm9pZCB7XHJcbiAgICBsZXQgcmVscyA9IHRoaXMuX3JlbGF0aW9uc2hpcHNbcmVjb3JkLnR5cGVdLmdldChyZWNvcmQuaWQpO1xyXG4gICAgcmVscyA9IHJlbHMgPyBjbG9uZShyZWxzKSA6IFtdO1xyXG4gICAgcmVscy5wdXNoKGludmVyc2VSZWxhdGlvbnNoaXApO1xyXG4gICAgdGhpcy5fcmVsYXRpb25zaGlwc1tyZWNvcmQudHlwZV0uc2V0KHJlY29yZC5pZCwgcmVscyk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHJlbW92ZShyZWNvcmQ6IFJlY29yZElkZW50aXR5LCBpbnZlcnNlUmVsYXRpb25zaGlwOiBJbnZlcnNlUmVsYXRpb25zaGlwKTogdm9pZCB7XHJcbiAgICBsZXQgcmVscyA9IHRoaXMuX3JlbGF0aW9uc2hpcHNbcmVjb3JkLnR5cGVdLmdldChyZWNvcmQuaWQpO1xyXG4gICAgaWYgKHJlbHMpIHtcclxuICAgICAgbGV0IG5ld1JlbHMgPSByZWxzLmZpbHRlcihyID0+ICEoci5yZWNvcmQudHlwZSA9PT0gaW52ZXJzZVJlbGF0aW9uc2hpcC5yZWNvcmQudHlwZSAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByLnJlY29yZC5pZCA9PT0gaW52ZXJzZVJlbGF0aW9uc2hpcC5yZWNvcmQuaWQgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgci5yZWxhdGlvbnNoaXAgPT09IGludmVyc2VSZWxhdGlvbnNoaXAucmVsYXRpb25zaGlwKSk7XHJcbiAgICAgIHRoaXMuX3JlbGF0aW9uc2hpcHNbcmVjb3JkLnR5cGVdLnNldChyZWNvcmQuaWQsIG5ld1JlbHMpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXX0=