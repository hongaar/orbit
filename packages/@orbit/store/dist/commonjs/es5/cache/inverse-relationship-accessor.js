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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW52ZXJzZS1yZWxhdGlvbnNoaXAtYWNjZXNzb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvY2FjaGUvaW52ZXJzZS1yZWxhdGlvbnNoaXAtYWNjZXNzb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsc0JBQXVFO0FBQ3ZFLHFCQUlxQjtBQUVyQiwwQkFBZ0Q7QUFPaEQsOENBSUU7eUNBQVksQUFBWSxPQUFFLEFBQWtDLE1BQzFELEFBQUk7YUFBQyxBQUFNLFNBQUcsQUFBSyxBQUFDLEFBQ3BCLEFBQUk7YUFBQyxBQUFLLE1BQUMsQUFBSSxBQUFDLEFBQUMsQUFDbkIsQUFBQztBQUVEOzBDQUFLLFFBQUwsVUFBTSxBQUFrQyxNQUN0QztZQUFJLEFBQWEsZ0JBQUcsQUFBRSxBQUFDLEFBQ3ZCLEFBQU07ZUFBQyxBQUFJLEtBQUMsQUFBSSxLQUFDLEFBQU0sT0FBQyxBQUFNLE9BQUMsQUFBTSxBQUFDLFFBQUMsQUFBTyxRQUFDLFVBQUEsQUFBSSxNQUNqRDtnQkFBSSxBQUFpQixvQkFBRyxBQUFJLFFBQUksQUFBSSxLQUFDLEFBQWMsZUFBQyxBQUFJLEFBQUMsQUFBQyxBQUMxRCxBQUFhOzBCQUFDLEFBQUksQUFBQyxRQUFHLElBQUksWUFBWSxhQUFDLEFBQWlCLEFBQUMsQUFBQyxBQUM1RCxBQUFDLEFBQUMsQUFBQztBQUNILEFBQUk7YUFBQyxBQUFjLGlCQUFHLEFBQWEsQUFBQyxBQUN0QyxBQUFDO0FBRUQ7MENBQU8sVUFBUCxZQUFBO29CQU1DLEFBTEMsQUFBTTtlQUFDLEFBQUksS0FBQyxBQUFJLEtBQUMsQUFBTSxPQUFDLEFBQU0sT0FBQyxBQUFNLEFBQUMsUUFBQyxBQUFPLFFBQUMsVUFBQSxBQUFJLE1BQ2pELEFBQUUsQUFBQztnQkFBQyxDQUFDLEFBQUksTUFBQyxBQUFjLGVBQUMsQUFBSSxBQUFDLEFBQUMsT0FBQyxBQUFDLEFBQy9CLEFBQUk7c0JBQUMsQUFBYyxlQUFDLEFBQUksQUFBQyxRQUFHLElB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QixBQUFDLEFBQUMsQUFDL0IsQUFBSTthQUFDLEFBQWMsZUFBQyxBQUFNLE9BQUMsQUFBSSxBQUFDLE1BQUMsQUFBRyxJQUFDLEFBQU0sT0FBQyxBQUFFLElBQUUsQUFBSSxBQUFDLEFBQUMsQUFDeEQsQUFBQztBQUVPOzBDQUFNLFNBQWQsVUFBZSxBQUFzQixRQUFFLEFBQXdDLHFCQUM3RTtZQUFJLEFBQUksT0FBRyxBQUFJLEtBQUMsQUFBYyxlQUFDLEFBQU0sT0FBQyxBQUFJLEFBQUMsTUFBQyxBQUFHLElBQUMsQUFBTSxPQUFDLEFBQUUsQUFBQyxBQUFDLEFBQzNELEFBQUUsQUFBQztZQUFDLEFBQUksQUFBQyxNQUFDLEFBQUMsQUFDVDtnQkFBSSxBQUFPLGVBQVEsQUFBTSxPQUFDLFVBQUEsQUFBQyxHQUFJO3VCQUFBLEFBQUMsRUFBQyxBQUFDLEVBQUMsQUFBTSxPQUFDLEFBQUksU0FBSyxBQUFtQixvQkFBQyxBQUFNLE9BQUMsQUFBSSxRQUNqRCxBQUFDLEVBQUMsQUFBTSxPQUFDLEFBQUUsT0FBSyxBQUFtQixvQkFBQyxBQUFNLE9BQUMsQUFBRSxNQUM3QyxBQUFDLEVBQUMsQUFBWSxpQkFBSyxBQUFtQixvQkFGeEMsQUFFeUMsQUFBWSxBQUFDLEFBQUMsQUFBQztBQUZ6RSxBQUFJLEFBR2xCLEFBQUk7aUJBQUMsQUFBYyxlQUFDLEFBQU0sT0FBQyxBQUFJLEFBQUMsTUFBQyxBQUFHLElBQUMsQUFBTSxPQUFDLEFBQUUsSUFBRSxBQUFPLEFBQUMsQUFBQyxBQUMzRCxBQUFDLEFBQ0g7QUFBQztBQUNIO1dBQUEsQUFBQyxBQTdJRCxBQTZJQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpY3QsIGlzQXJyYXksIGlzT2JqZWN0LCBjbG9uZSwgZGVlcEdldCB9IGZyb20gJ0BvcmJpdC91dGlscyc7XHJcbmltcG9ydCB7XHJcbiAgY2xvbmVSZWNvcmRJZGVudGl0eSxcclxuICBSZWNvcmQsXHJcbiAgUmVjb3JkSWRlbnRpdHlcclxufSBmcm9tICdAb3JiaXQvZGF0YSc7XHJcbmltcG9ydCBDYWNoZSBmcm9tICcuLi9jYWNoZSc7XHJcbmltcG9ydCB7IEltbXV0YWJsZU1hcCB9IGZyb20gJ0BvcmJpdC9pbW11dGFibGUnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJbnZlcnNlUmVsYXRpb25zaGlwIHtcclxuICByZWNvcmQ6IFJlY29yZElkZW50aXR5LFxyXG4gIHJlbGF0aW9uc2hpcDogc3RyaW5nXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEludmVyc2VSZWxhdGlvbnNoaXBBY2Nlc3NvciB7XHJcbiAgcHJvdGVjdGVkIF9jYWNoZTogQ2FjaGU7XHJcbiAgcHJvdGVjdGVkIF9yZWxhdGlvbnNoaXBzOiBEaWN0PEltbXV0YWJsZU1hcDxzdHJpbmcsIEludmVyc2VSZWxhdGlvbnNoaXBbXT4+O1xyXG5cclxuICBjb25zdHJ1Y3RvcihjYWNoZTogQ2FjaGUsIGJhc2U/OiBJbnZlcnNlUmVsYXRpb25zaGlwQWNjZXNzb3IpIHtcclxuICAgIHRoaXMuX2NhY2hlID0gY2FjaGU7XHJcbiAgICB0aGlzLnJlc2V0KGJhc2UpO1xyXG4gIH1cclxuXHJcbiAgcmVzZXQoYmFzZT86IEludmVyc2VSZWxhdGlvbnNoaXBBY2Nlc3Nvcikge1xyXG4gICAgbGV0IHJlbGF0aW9uc2hpcHMgPSB7fTtcclxuICAgIE9iamVjdC5rZXlzKHRoaXMuX2NhY2hlLnNjaGVtYS5tb2RlbHMpLmZvckVhY2godHlwZSA9PiB7XHJcbiAgICAgIGxldCBiYXNlUmVsYXRpb25zaGlwcyA9IGJhc2UgJiYgYmFzZS5fcmVsYXRpb25zaGlwc1t0eXBlXTtcclxuICAgICAgcmVsYXRpb25zaGlwc1t0eXBlXSA9IG5ldyBJbW11dGFibGVNYXAoYmFzZVJlbGF0aW9uc2hpcHMpO1xyXG4gICAgfSk7XHJcbiAgICB0aGlzLl9yZWxhdGlvbnNoaXBzID0gcmVsYXRpb25zaGlwcztcclxuICB9XHJcblxyXG4gIHVwZ3JhZGUoKSB7XHJcbiAgICBPYmplY3Qua2V5cyh0aGlzLl9jYWNoZS5zY2hlbWEubW9kZWxzKS5mb3JFYWNoKHR5cGUgPT4ge1xyXG4gICAgICBpZiAoIXRoaXMuX3JlbGF0aW9uc2hpcHNbdHlwZV0pIHtcclxuICAgICAgICB0aGlzLl9yZWxhdGlvbnNoaXBzW3R5cGVdID0gbmV3IEltbXV0YWJsZU1hcCgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGFsbChyZWNvcmQ6IFJlY29yZElkZW50aXR5KTogSW52ZXJzZVJlbGF0aW9uc2hpcFtdIHtcclxuICAgIHJldHVybiB0aGlzLl9yZWxhdGlvbnNoaXBzW3JlY29yZC50eXBlXS5nZXQocmVjb3JkLmlkKSB8fCBbXTtcclxuICB9XHJcblxyXG4gIHJlY29yZEFkZGVkKHJlY29yZDogUmVjb3JkKSB7XHJcbiAgICBjb25zdCByZWxhdGlvbnNoaXBzID0gcmVjb3JkLnJlbGF0aW9uc2hpcHM7XHJcbiAgICBjb25zdCByZWNvcmRJZGVudGl0eSA9IGNsb25lUmVjb3JkSWRlbnRpdHkocmVjb3JkKTtcclxuICAgIGlmIChyZWxhdGlvbnNoaXBzKSB7XHJcbiAgICAgIE9iamVjdC5rZXlzKHJlbGF0aW9uc2hpcHMpLmZvckVhY2gocmVsYXRpb25zaGlwID0+IHtcclxuICAgICAgICBjb25zdCByZWxhdGlvbnNoaXBEYXRhID0gcmVsYXRpb25zaGlwc1tyZWxhdGlvbnNoaXBdICYmIHJlbGF0aW9uc2hpcHNbcmVsYXRpb25zaGlwXS5kYXRhO1xyXG4gICAgICAgIGlmIChyZWxhdGlvbnNoaXBEYXRhKSB7XHJcbiAgICAgICAgICBpZiAoaXNBcnJheShyZWxhdGlvbnNoaXBEYXRhKSkge1xyXG4gICAgICAgICAgICBjb25zdCByZWxhdGVkUmVjb3JkcyA9IHJlbGF0aW9uc2hpcERhdGEgYXMgUmVjb3JkW107XHJcbiAgICAgICAgICAgIHJlbGF0ZWRSZWNvcmRzLmZvckVhY2gocmVsYXRlZFJlY29yZCA9PiB7XHJcbiAgICAgICAgICAgICAgdGhpcy5hZGQocmVsYXRlZFJlY29yZCwgeyByZWNvcmQ6IHJlY29yZElkZW50aXR5LCByZWxhdGlvbnNoaXAgfSlcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCByZWxhdGVkUmVjb3JkID0gcmVsYXRpb25zaGlwRGF0YSBhcyBSZWNvcmQ7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkKHJlbGF0ZWRSZWNvcmQsIHsgcmVjb3JkOiByZWNvcmRJZGVudGl0eSwgcmVsYXRpb25zaGlwIH0pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlY29yZFJlbW92ZWQocmVjb3JkOiBSZWNvcmRJZGVudGl0eSk6IHZvaWQge1xyXG4gICAgY29uc3QgcmVjb3JkSW5DYWNoZTogUmVjb3JkID0gdGhpcy5fY2FjaGUucmVjb3JkcyhyZWNvcmQudHlwZSkuZ2V0KHJlY29yZC5pZCk7XHJcbiAgICBjb25zdCByZWxhdGlvbnNoaXBzID0gcmVjb3JkSW5DYWNoZSAmJiByZWNvcmRJbkNhY2hlLnJlbGF0aW9uc2hpcHM7XHJcbiAgICBpZiAocmVsYXRpb25zaGlwcykge1xyXG4gICAgICBPYmplY3Qua2V5cyhyZWxhdGlvbnNoaXBzKS5mb3JFYWNoKHJlbGF0aW9uc2hpcCA9PiB7XHJcbiAgICAgICAgY29uc3QgcmVsYXRpb25zaGlwRGF0YSA9IHJlbGF0aW9uc2hpcHNbcmVsYXRpb25zaGlwXSAmJiByZWxhdGlvbnNoaXBzW3JlbGF0aW9uc2hpcF0uZGF0YTtcclxuICAgICAgICBpZiAocmVsYXRpb25zaGlwRGF0YSkge1xyXG4gICAgICAgICAgaWYgKGlzQXJyYXkocmVsYXRpb25zaGlwRGF0YSkpIHtcclxuICAgICAgICAgICAgY29uc3QgcmVsYXRlZFJlY29yZHMgPSByZWxhdGlvbnNoaXBEYXRhIGFzIFJlY29yZFtdO1xyXG4gICAgICAgICAgICByZWxhdGVkUmVjb3Jkcy5mb3JFYWNoKHJlbGF0ZWRSZWNvcmQgPT4ge1xyXG4gICAgICAgICAgICAgIHRoaXMucmVtb3ZlKHJlbGF0ZWRSZWNvcmQsIHsgcmVjb3JkLCByZWxhdGlvbnNoaXAgfSlcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCByZWxhdGVkUmVjb3JkID0gcmVsYXRpb25zaGlwRGF0YSBhcyBSZWNvcmQ7XHJcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlKHJlbGF0ZWRSZWNvcmQsIHsgcmVjb3JkLCByZWxhdGlvbnNoaXAgfSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgdGhpcy5fcmVsYXRpb25zaGlwc1tyZWNvcmQudHlwZV0ucmVtb3ZlKHJlY29yZC5pZCk7XHJcbiAgfVxyXG5cclxuICByZWxhdGVkUmVjb3JkQWRkZWQocmVjb3JkOiBSZWNvcmRJZGVudGl0eSwgcmVsYXRpb25zaGlwOiBzdHJpbmcsIHJlbGF0ZWRSZWNvcmQ6IFJlY29yZElkZW50aXR5KTogdm9pZCB7XHJcbiAgICBpZiAocmVsYXRlZFJlY29yZCkge1xyXG4gICAgICBjb25zdCByZWxhdGlvbnNoaXBEZWYgPSB0aGlzLl9jYWNoZS5zY2hlbWEuZ2V0TW9kZWwocmVjb3JkLnR5cGUpLnJlbGF0aW9uc2hpcHNbcmVsYXRpb25zaGlwXTtcclxuICAgICAgaWYgKHJlbGF0aW9uc2hpcERlZi5pbnZlcnNlKSB7XHJcbiAgICAgICAgY29uc3QgcmVjb3JkSWRlbnRpdHkgPSBjbG9uZVJlY29yZElkZW50aXR5KHJlY29yZCk7XHJcbiAgICAgICAgdGhpcy5hZGQocmVsYXRlZFJlY29yZCwgeyByZWNvcmQ6IHJlY29yZElkZW50aXR5LCByZWxhdGlvbnNoaXAgfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlbGF0ZWRSZWNvcmRzQWRkZWQocmVjb3JkOiBSZWNvcmRJZGVudGl0eSwgcmVsYXRpb25zaGlwOiBzdHJpbmcsIHJlbGF0ZWRSZWNvcmRzOiBSZWNvcmRJZGVudGl0eVtdKTogdm9pZCB7XHJcbiAgICBpZiAocmVsYXRlZFJlY29yZHMgJiYgcmVsYXRlZFJlY29yZHMubGVuZ3RoID4gMCkge1xyXG4gICAgICBjb25zdCByZWxhdGlvbnNoaXBEZWYgPSB0aGlzLl9jYWNoZS5zY2hlbWEuZ2V0TW9kZWwocmVjb3JkLnR5cGUpLnJlbGF0aW9uc2hpcHNbcmVsYXRpb25zaGlwXTtcclxuICAgICAgaWYgKHJlbGF0aW9uc2hpcERlZi5pbnZlcnNlKSB7XHJcbiAgICAgICAgY29uc3QgcmVjb3JkSWRlbnRpdHkgPSBjbG9uZVJlY29yZElkZW50aXR5KHJlY29yZCk7XHJcbiAgICAgICAgcmVsYXRlZFJlY29yZHMuZm9yRWFjaChyZWxhdGVkUmVjb3JkID0+IHtcclxuICAgICAgICAgIHRoaXMuYWRkKHJlbGF0ZWRSZWNvcmQsIHsgcmVjb3JkOiByZWNvcmRJZGVudGl0eSwgcmVsYXRpb25zaGlwIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZWxhdGVkUmVjb3JkUmVtb3ZlZChyZWNvcmQ6IFJlY29yZElkZW50aXR5LCByZWxhdGlvbnNoaXA6IHN0cmluZywgcmVsYXRlZFJlY29yZD86IFJlY29yZElkZW50aXR5KTogdm9pZCB7XHJcbiAgICBjb25zdCByZWxhdGlvbnNoaXBEZWYgPSB0aGlzLl9jYWNoZS5zY2hlbWEuZ2V0TW9kZWwocmVjb3JkLnR5cGUpLnJlbGF0aW9uc2hpcHNbcmVsYXRpb25zaGlwXTtcclxuXHJcbiAgICBpZiAocmVsYXRpb25zaGlwRGVmLmludmVyc2UpIHtcclxuICAgICAgaWYgKHJlbGF0ZWRSZWNvcmQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGNvbnN0IGN1cnJlbnRSZWNvcmQgPSB0aGlzLl9jYWNoZS5yZWNvcmRzKHJlY29yZC50eXBlKS5nZXQocmVjb3JkLmlkKTtcclxuICAgICAgICByZWxhdGVkUmVjb3JkID0gY3VycmVudFJlY29yZCAmJiBkZWVwR2V0KGN1cnJlbnRSZWNvcmQsIFsncmVsYXRpb25zaGlwcycsIHJlbGF0aW9uc2hpcCwgJ2RhdGEnXSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChyZWxhdGVkUmVjb3JkKSB7XHJcbiAgICAgICAgdGhpcy5yZW1vdmUocmVsYXRlZFJlY29yZCwgeyByZWNvcmQsIHJlbGF0aW9uc2hpcCB9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVsYXRlZFJlY29yZHNSZW1vdmVkKHJlY29yZDogUmVjb3JkSWRlbnRpdHksIHJlbGF0aW9uc2hpcDogc3RyaW5nLCByZWxhdGVkUmVjb3Jkcz86IFJlY29yZElkZW50aXR5W10pOiB2b2lkIHtcclxuICAgIGNvbnN0IHJlbGF0aW9uc2hpcERlZiA9IHRoaXMuX2NhY2hlLnNjaGVtYS5nZXRNb2RlbChyZWNvcmQudHlwZSkucmVsYXRpb25zaGlwc1tyZWxhdGlvbnNoaXBdO1xyXG5cclxuICAgIGlmIChyZWxhdGlvbnNoaXBEZWYuaW52ZXJzZSkge1xyXG4gICAgICBpZiAocmVsYXRlZFJlY29yZHMgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGNvbnN0IGN1cnJlbnRSZWNvcmQgPSB0aGlzLl9jYWNoZS5yZWNvcmRzKHJlY29yZC50eXBlKS5nZXQocmVjb3JkLmlkKTtcclxuICAgICAgICByZWxhdGVkUmVjb3JkcyA9IGN1cnJlbnRSZWNvcmQgJiYgZGVlcEdldChjdXJyZW50UmVjb3JkLCBbJ3JlbGF0aW9uc2hpcHMnLCByZWxhdGlvbnNoaXAsICdkYXRhJ10pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocmVsYXRlZFJlY29yZHMpIHtcclxuICAgICAgICByZWxhdGVkUmVjb3Jkcy5mb3JFYWNoKHJlbGF0ZWRSZWNvcmQgPT4gdGhpcy5yZW1vdmUocmVsYXRlZFJlY29yZCwgeyByZWNvcmQsIHJlbGF0aW9uc2hpcCB9KSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgYWRkKHJlY29yZDogUmVjb3JkSWRlbnRpdHksIGludmVyc2VSZWxhdGlvbnNoaXA6IEludmVyc2VSZWxhdGlvbnNoaXApOiB2b2lkIHtcclxuICAgIGxldCByZWxzID0gdGhpcy5fcmVsYXRpb25zaGlwc1tyZWNvcmQudHlwZV0uZ2V0KHJlY29yZC5pZCk7XHJcbiAgICByZWxzID0gcmVscyA/IGNsb25lKHJlbHMpIDogW107XHJcbiAgICByZWxzLnB1c2goaW52ZXJzZVJlbGF0aW9uc2hpcCk7XHJcbiAgICB0aGlzLl9yZWxhdGlvbnNoaXBzW3JlY29yZC50eXBlXS5zZXQocmVjb3JkLmlkLCByZWxzKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcmVtb3ZlKHJlY29yZDogUmVjb3JkSWRlbnRpdHksIGludmVyc2VSZWxhdGlvbnNoaXA6IEludmVyc2VSZWxhdGlvbnNoaXApOiB2b2lkIHtcclxuICAgIGxldCByZWxzID0gdGhpcy5fcmVsYXRpb25zaGlwc1tyZWNvcmQudHlwZV0uZ2V0KHJlY29yZC5pZCk7XHJcbiAgICBpZiAocmVscykge1xyXG4gICAgICBsZXQgbmV3UmVscyA9IHJlbHMuZmlsdGVyKHIgPT4gIShyLnJlY29yZC50eXBlID09PSBpbnZlcnNlUmVsYXRpb25zaGlwLnJlY29yZC50eXBlICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHIucmVjb3JkLmlkID09PSBpbnZlcnNlUmVsYXRpb25zaGlwLnJlY29yZC5pZCAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByLnJlbGF0aW9uc2hpcCA9PT0gaW52ZXJzZVJlbGF0aW9uc2hpcC5yZWxhdGlvbnNoaXApKTtcclxuICAgICAgdGhpcy5fcmVsYXRpb25zaGlwc1tyZWNvcmQudHlwZV0uc2V0KHJlY29yZC5pZCwgbmV3UmVscyk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdfQ==