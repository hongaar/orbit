"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@orbit/utils");
var data_1 = require("@orbit/data");
var immutable_1 = require("@orbit/immutable");
var record_identity_map_1 = require("./record-identity-map");
var RelationshipAccessor = function () {
    function RelationshipAccessor(cache, base) {
        this._cache = cache;
        this.reset(base);
    }
    RelationshipAccessor.prototype.reset = function (base) {
        var relationships = {};
        Object.keys(this._cache.schema.models).forEach(function (type) {
            var baseRelationships = base && base._relationships[type];
            relationships[type] = new immutable_1.ImmutableMap(baseRelationships);
        });
        this._relationships = relationships;
    };
    RelationshipAccessor.prototype.relationshipExists = function (record, relationship, relatedRecord) {
        var rels = this._relationships[record.type].get(record.id);
        if (rels) {
            var rel = rels[relationship];
            if (rel) {
                if (rel instanceof record_identity_map_1.default) {
                    return rel.has(relatedRecord);
                } else {
                    return data_1.equalRecordIdentities(relatedRecord, rel);
                }
            }
        }
        return !relatedRecord;
    };
    RelationshipAccessor.prototype.relatedRecord = function (record, relationship) {
        var rels = this._relationships[record.type].get(record.id);
        if (rels) {
            return rels[relationship];
        }
    };
    RelationshipAccessor.prototype.relatedRecords = function (record, relationship) {
        var rels = this._relationships[record.type].get(record.id);
        var map = rels && rels[relationship];
        if (map) {
            return Array.from(map.values);
        }
    };
    RelationshipAccessor.prototype.relatedRecordsMap = function (record, relationship) {
        var rels = this._relationships[record.type].get(record.id);
        if (rels) {
            return rels[relationship];
        }
    };
    RelationshipAccessor.prototype.relatedRecordsMatch = function (record, relationship, relatedRecords) {
        var map = this.relatedRecordsMap(record, relationship);
        if (map) {
            var otherMap_1 = new record_identity_map_1.default();
            relatedRecords.forEach(function (id) {
                return otherMap_1.add(id);
            });
            return map.equals(otherMap_1);
        } else {
            return relatedRecords.length === 0;
        }
    };
    RelationshipAccessor.prototype.addRecord = function (record) {
        if (record.relationships) {
            var rels_1 = {};
            Object.keys(record.relationships).forEach(function (name) {
                var rel = record.relationships[name];
                if (rel.data !== undefined) {
                    if (utils_1.isArray(rel.data)) {
                        var relMap_1 = rels_1[name] = new record_identity_map_1.default();
                        rel.data.forEach(function (r) {
                            return relMap_1.add(r);
                        });
                    } else {
                        rels_1[name] = rel.data;
                    }
                }
            });
            this._relationships[record.type].set(record.id, rels_1);
        }
    };
    RelationshipAccessor.prototype.replaceRecord = function (record) {
        this.addRecord(record);
    };
    RelationshipAccessor.prototype.clearRecord = function (record) {
        this._relationships[record.type].remove(record.id);
    };
    RelationshipAccessor.prototype.addToRelatedRecords = function (record, relationship, relatedRecord) {
        var currentRels = this._relationships[record.type].get(record.id);
        var rels = currentRels ? cloneRelationships(currentRels) : {};
        var rel = rels[relationship];
        if (!rel) {
            rel = rels[relationship] = new record_identity_map_1.default();
        }
        rel.add(relatedRecord);
        this._relationships[record.type].set(record.id, rels);
    };
    RelationshipAccessor.prototype.removeFromRelatedRecords = function (record, relationship, relatedRecord) {
        var currentRels = this._relationships[record.type].get(record.id);
        if (currentRels && currentRels[relationship]) {
            var rels = cloneRelationships(currentRels);
            var rel = rels[relationship];
            rel.remove(relatedRecord);
            this._relationships[record.type].set(record.id, rels);
        }
    };
    RelationshipAccessor.prototype.replaceRelatedRecords = function (record, relationship, relatedRecords) {
        var currentRels = this._relationships[record.type].get(record.id);
        var rels = currentRels ? cloneRelationships(currentRels) : {};
        var rel = rels[relationship];
        if (!rel) {
            rel = rels[relationship] = new record_identity_map_1.default();
        }
        relatedRecords.forEach(function (relatedRecord) {
            return rel.add(relatedRecord);
        });
        this._relationships[record.type].set(record.id, rels);
    };
    RelationshipAccessor.prototype.replaceRelatedRecord = function (record, relationship, relatedRecord) {
        var currentRels = this._relationships[record.type].get(record.id);
        if (currentRels && currentRels[relationship] || relatedRecord) {
            var rels = currentRels ? cloneRelationships(currentRels) : {};
            rels[relationship] = relatedRecord;
            this._relationships[record.type].set(record.id, rels);
        }
    };
    return RelationshipAccessor;
}();
exports.default = RelationshipAccessor;
function cloneRelationships(rels) {
    var clonedRels = {};
    if (rels) {
        Object.keys(rels).forEach(function (name) {
            var value = rels[name];
            if (value instanceof record_identity_map_1.default) {
                clonedRels[name] = new record_identity_map_1.default(value);
            } else {
                clonedRels[name] = value;
            }
        });
    }
    return clonedRels;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVsYXRpb25zaGlwLWFjY2Vzc29yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NhY2hlL3JlbGF0aW9uc2hpcC1hY2Nlc3Nvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxzQkFBOEQ7QUFDOUQscUJBSXFCO0FBRXJCLDBCQUFnRDtBQUNoRCxvQ0FBc0Q7QUFFdEQ7QUFJRSxrQ0FBWSxBQUFZLE9BQUUsQUFBMkI7QUFDbkQsQUFBSSxhQUFDLEFBQU0sU0FBRyxBQUFLLEFBQUM7QUFDcEIsQUFBSSxhQUFDLEFBQUssTUFBQyxBQUFJLEFBQUMsQUFBQyxBQUNuQjtBQUFDO0FBRUQsbUNBQUssUUFBTCxVQUFNLEFBQTJCO0FBQy9CLFlBQUksQUFBYSxnQkFBRyxBQUFFLEFBQUM7QUFDdkIsQUFBTSxlQUFDLEFBQUksS0FBQyxBQUFJLEtBQUMsQUFBTSxPQUFDLEFBQU0sT0FBQyxBQUFNLEFBQUMsUUFBQyxBQUFPLFFBQUMsVUFBQSxBQUFJO0FBQ2pELGdCQUFJLEFBQWlCLG9CQUFHLEFBQUksUUFBSSxBQUFJLEtBQUMsQUFBYyxlQUFDLEFBQUksQUFBQyxBQUFDO0FBQzFELEFBQWEsMEJBQUMsQUFBSSxBQUFDLFFBQUcsSUFBSSxZQUFZLGFBQUMsQUFBaUIsQUFBQyxBQUFDLEFBQzVEO0FBQUMsQUFBQyxBQUFDO0FBQ0gsQUFBSSxhQUFDLEFBQWMsaUJBQUcsQUFBYSxBQUFDLEFBQ3RDO0FBQUM7QUFFRCxtQ0FBa0IscUJBQWxCLFVBQW1CLEFBQXNCLFFBQUUsQUFBb0IsY0FBRSxBQUE2QjtBQUM1RixZQUFJLEFBQUksT0FBRyxBQUFJLEtBQUMsQUFBYyxlQUFDLEFBQU0sT0FBQyxBQUFJLEFBQUMsTUFBQyxBQUFHLElBQUMsQUFBTSxPQUFDLEFBQUUsQUFBQyxBQUFDO0FBQzNELEFBQUUsQUFBQyxZQUFDLEFBQUksQUFBQyxNQUFDLEFBQUM7QUFDVCxnQkFBSSxBQUFHLE1BQUcsQUFBSSxLQUFDLEFBQVksQUFBQyxB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QkFBRyxBQUFhLEFBQUM7QUFDbkMsQUFBSSxpQkFBQyxBQUFjLGVBQUMsQUFBTSxPQUFDLEFBQUksQUFBQyxNQUFDLEFBQUcsSUFBQyxBQUFNLE9BQUMsQUFBRSxJQUFFLEFBQUksQUFBQyxBQUFDLEFBQ3hEO0FBQUMsQUFDSDtBQUFDO0FBQ0gsV0FBQSxBQUFDO0FBcElELEFBb0lDOztBQUVELDRCQUE0QixBQUFJO0FBQzlCLFFBQU0sQUFBVSxhQUFHLEFBQUUsQUFBQztBQUN0QixBQUFFLEFBQUMsUUFBQyxBQUFJLEFBQUMsTUFBQyxBQUFDO0FBQ1QsQUFBTSxlQUFDLEFBQUksS0FBQyxBQUFJLEFBQUMsTUFBQyxBQUFPLFFBQUMsVUFBQSxBQUFJO0FBQzVCLGdCQUFJLEFBQUssUUFBRyxBQUFJLEtBQUMsQUFBSSxBQUFDLEFBQUM7QUFDdkIsQUFBRSxBQUFDLGdCQUFDLEFBQUssaUJBQVksc0JBQWlCLEFBQUMsU0FBQyxBQUFDO0FBQ3ZDLEFBQVUsMkJBQUMsQUFBSSxBQUFDLFFBQUcsSUFBSSxzQkFBaUIsUUFBQyxBQUEwQixBQUFDLEFBQUMsQUFDdkU7QUFBQyxBQUFDLEFBQUksbUJBQUMsQUFBQztBQUNOLEFBQVUsMkJBQUMsQUFBSSxBQUFDLFFBQUcsQUFBSyxBQUFDLEFBQzNCO0FBQUMsQUFDSDtBQUFDLEFBQUMsQUFBQyxBQUNMO0FBQUM7QUFDRCxBQUFNLFdBQUMsQUFBVSxBQUFDLEFBQ3BCO0FBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjbG9uZSwgRGljdCwgaXNPYmplY3QsIGlzQXJyYXkgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xyXG5pbXBvcnQge1xyXG4gIGVxdWFsUmVjb3JkSWRlbnRpdGllcyxcclxuICBSZWNvcmQsXHJcbiAgUmVjb3JkSWRlbnRpdHlcclxufSBmcm9tICdAb3JiaXQvZGF0YSc7XHJcbmltcG9ydCBDYWNoZSBmcm9tICcuLi9jYWNoZSc7XHJcbmltcG9ydCB7IEltbXV0YWJsZU1hcCB9IGZyb20gJ0BvcmJpdC9pbW11dGFibGUnO1xyXG5pbXBvcnQgUmVjb3JkSWRlbnRpdHlNYXAgZnJvbSAnLi9yZWNvcmQtaWRlbnRpdHktbWFwJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlbGF0aW9uc2hpcEFjY2Vzc29yIHtcclxuICBwcm90ZWN0ZWQgX2NhY2hlOiBDYWNoZTtcclxuICBwcm90ZWN0ZWQgX3JlbGF0aW9uc2hpcHM6IERpY3Q8SW1tdXRhYmxlTWFwPHN0cmluZywgRGljdDxSZWNvcmRJZGVudGl0eSB8IFJlY29yZElkZW50aXR5TWFwPj4+O1xyXG5cclxuICBjb25zdHJ1Y3RvcihjYWNoZTogQ2FjaGUsIGJhc2U/OiBSZWxhdGlvbnNoaXBBY2Nlc3Nvcikge1xyXG4gICAgdGhpcy5fY2FjaGUgPSBjYWNoZTtcclxuICAgIHRoaXMucmVzZXQoYmFzZSk7XHJcbiAgfVxyXG5cclxuICByZXNldChiYXNlPzogUmVsYXRpb25zaGlwQWNjZXNzb3IpIHtcclxuICAgIGxldCByZWxhdGlvbnNoaXBzID0ge307XHJcbiAgICBPYmplY3Qua2V5cyh0aGlzLl9jYWNoZS5zY2hlbWEubW9kZWxzKS5mb3JFYWNoKHR5cGUgPT4ge1xyXG4gICAgICBsZXQgYmFzZVJlbGF0aW9uc2hpcHMgPSBiYXNlICYmIGJhc2UuX3JlbGF0aW9uc2hpcHNbdHlwZV07XHJcbiAgICAgIHJlbGF0aW9uc2hpcHNbdHlwZV0gPSBuZXcgSW1tdXRhYmxlTWFwKGJhc2VSZWxhdGlvbnNoaXBzKTtcclxuICAgIH0pO1xyXG4gICAgdGhpcy5fcmVsYXRpb25zaGlwcyA9IHJlbGF0aW9uc2hpcHM7XHJcbiAgfVxyXG5cclxuICByZWxhdGlvbnNoaXBFeGlzdHMocmVjb3JkOiBSZWNvcmRJZGVudGl0eSwgcmVsYXRpb25zaGlwOiBzdHJpbmcsIHJlbGF0ZWRSZWNvcmQ6IFJlY29yZElkZW50aXR5KTogYm9vbGVhbiB7XHJcbiAgICBsZXQgcmVscyA9IHRoaXMuX3JlbGF0aW9uc2hpcHNbcmVjb3JkLnR5cGVdLmdldChyZWNvcmQuaWQpO1xyXG4gICAgaWYgKHJlbHMpIHtcclxuICAgICAgbGV0IHJlbCA9IHJlbHNbcmVsYXRpb25zaGlwXTtcclxuICAgICAgaWYgKHJlbCkge1xyXG4gICAgICAgIGlmIChyZWwgaW5zdGFuY2VvZiBSZWNvcmRJZGVudGl0eU1hcCkge1xyXG4gICAgICAgICAgcmV0dXJuIHJlbC5oYXMocmVsYXRlZFJlY29yZCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJldHVybiBlcXVhbFJlY29yZElkZW50aXRpZXMocmVsYXRlZFJlY29yZCwgcmVsKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiAhcmVsYXRlZFJlY29yZDtcclxuICB9XHJcblxyXG4gIHJlbGF0ZWRSZWNvcmQocmVjb3JkOiBSZWNvcmRJZGVudGl0eSwgcmVsYXRpb25zaGlwOiBzdHJpbmcpOiBSZWNvcmRJZGVudGl0eSB7XHJcbiAgICBsZXQgcmVscyA9IHRoaXMuX3JlbGF0aW9uc2hpcHNbcmVjb3JkLnR5cGVdLmdldChyZWNvcmQuaWQpO1xyXG4gICAgaWYgKHJlbHMpIHtcclxuICAgICAgcmV0dXJuIHJlbHNbcmVsYXRpb25zaGlwXSBhcyBSZWNvcmRJZGVudGl0eTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlbGF0ZWRSZWNvcmRzKHJlY29yZDogUmVjb3JkSWRlbnRpdHksIHJlbGF0aW9uc2hpcDogc3RyaW5nKTogUmVjb3JkSWRlbnRpdHlbXSB7XHJcbiAgICBsZXQgcmVscyA9IHRoaXMuX3JlbGF0aW9uc2hpcHNbcmVjb3JkLnR5cGVdLmdldChyZWNvcmQuaWQpO1xyXG4gICAgbGV0IG1hcCA9IHJlbHMgJiYgcmVsc1tyZWxhdGlvbnNoaXBdIGFzIFJlY29yZElkZW50aXR5TWFwO1xyXG4gICAgaWYgKG1hcCkge1xyXG4gICAgICByZXR1cm4gQXJyYXkuZnJvbShtYXAudmFsdWVzKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlbGF0ZWRSZWNvcmRzTWFwKHJlY29yZDogUmVjb3JkSWRlbnRpdHksIHJlbGF0aW9uc2hpcDogc3RyaW5nKTogUmVjb3JkSWRlbnRpdHlNYXAge1xyXG4gICAgbGV0IHJlbHMgPSB0aGlzLl9yZWxhdGlvbnNoaXBzW3JlY29yZC50eXBlXS5nZXQocmVjb3JkLmlkKTtcclxuICAgIGlmIChyZWxzKSB7XHJcbiAgICAgIHJldHVybiByZWxzW3JlbGF0aW9uc2hpcF0gYXMgUmVjb3JkSWRlbnRpdHlNYXA7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZWxhdGVkUmVjb3Jkc01hdGNoKHJlY29yZDogUmVjb3JkSWRlbnRpdHksIHJlbGF0aW9uc2hpcDogc3RyaW5nLCByZWxhdGVkUmVjb3JkczogUmVjb3JkSWRlbnRpdHlbXSk6IGJvb2xlYW4ge1xyXG4gICAgbGV0IG1hcCA9IHRoaXMucmVsYXRlZFJlY29yZHNNYXAocmVjb3JkLCByZWxhdGlvbnNoaXApO1xyXG4gICAgaWYgKG1hcCkge1xyXG4gICAgICBsZXQgb3RoZXJNYXAgPSBuZXcgUmVjb3JkSWRlbnRpdHlNYXA7XHJcbiAgICAgIHJlbGF0ZWRSZWNvcmRzLmZvckVhY2goaWQgPT4gb3RoZXJNYXAuYWRkKGlkKSk7XHJcbiAgICAgIHJldHVybiBtYXAuZXF1YWxzKG90aGVyTWFwKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiByZWxhdGVkUmVjb3Jkcy5sZW5ndGggPT09IDA7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhZGRSZWNvcmQocmVjb3JkOiBSZWNvcmQpIHtcclxuICAgIGlmIChyZWNvcmQucmVsYXRpb25zaGlwcykge1xyXG4gICAgICBjb25zdCByZWxzID0ge307XHJcbiAgICAgIE9iamVjdC5rZXlzKHJlY29yZC5yZWxhdGlvbnNoaXBzKS5mb3JFYWNoKG5hbWUgPT4ge1xyXG4gICAgICAgIGxldCByZWwgPSByZWNvcmQucmVsYXRpb25zaGlwc1tuYW1lXTtcclxuICAgICAgICBpZiAocmVsLmRhdGEgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgaWYgKGlzQXJyYXkocmVsLmRhdGEpKSB7XHJcbiAgICAgICAgICAgIGxldCByZWxNYXAgPSByZWxzW25hbWVdID0gbmV3IFJlY29yZElkZW50aXR5TWFwKCk7XHJcbiAgICAgICAgICAgIChyZWwuZGF0YSBhcyBSZWNvcmRJZGVudGl0eVtdKS5mb3JFYWNoKHIgPT4gcmVsTWFwLmFkZChyKSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZWxzW25hbWVdID0gcmVsLmRhdGE7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgICAgdGhpcy5fcmVsYXRpb25zaGlwc1tyZWNvcmQudHlwZV0uc2V0KHJlY29yZC5pZCwgcmVscyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXBsYWNlUmVjb3JkKHJlY29yZDogUmVjb3JkKSB7XHJcbiAgICB0aGlzLmFkZFJlY29yZChyZWNvcmQpO1xyXG4gIH1cclxuXHJcbiAgY2xlYXJSZWNvcmQocmVjb3JkOiBSZWNvcmRJZGVudGl0eSk6IHZvaWQge1xyXG4gICAgdGhpcy5fcmVsYXRpb25zaGlwc1tyZWNvcmQudHlwZV0ucmVtb3ZlKHJlY29yZC5pZCk7XHJcbiAgfVxyXG5cclxuICBhZGRUb1JlbGF0ZWRSZWNvcmRzKHJlY29yZDogUmVjb3JkSWRlbnRpdHksIHJlbGF0aW9uc2hpcDogc3RyaW5nLCByZWxhdGVkUmVjb3JkOiBSZWNvcmRJZGVudGl0eSk6IHZvaWQge1xyXG4gICAgbGV0IGN1cnJlbnRSZWxzID0gdGhpcy5fcmVsYXRpb25zaGlwc1tyZWNvcmQudHlwZV0uZ2V0KHJlY29yZC5pZCk7XHJcbiAgICBsZXQgcmVscyA9IGN1cnJlbnRSZWxzID8gY2xvbmVSZWxhdGlvbnNoaXBzKGN1cnJlbnRSZWxzKSA6IHt9O1xyXG4gICAgbGV0IHJlbCA9IHJlbHNbcmVsYXRpb25zaGlwXTtcclxuICAgIGlmICghcmVsKSB7XHJcbiAgICAgIHJlbCA9IHJlbHNbcmVsYXRpb25zaGlwXSA9IG5ldyBSZWNvcmRJZGVudGl0eU1hcCgpO1xyXG4gICAgfVxyXG4gICAgcmVsLmFkZChyZWxhdGVkUmVjb3JkKTtcclxuICAgIHRoaXMuX3JlbGF0aW9uc2hpcHNbcmVjb3JkLnR5cGVdLnNldChyZWNvcmQuaWQsIHJlbHMpO1xyXG4gIH1cclxuXHJcbiAgcmVtb3ZlRnJvbVJlbGF0ZWRSZWNvcmRzKHJlY29yZDogUmVjb3JkSWRlbnRpdHksIHJlbGF0aW9uc2hpcDogc3RyaW5nLCByZWxhdGVkUmVjb3JkOiBSZWNvcmRJZGVudGl0eSk6IHZvaWQge1xyXG4gICAgbGV0IGN1cnJlbnRSZWxzID0gdGhpcy5fcmVsYXRpb25zaGlwc1tyZWNvcmQudHlwZV0uZ2V0KHJlY29yZC5pZCk7XHJcbiAgICBpZiAoY3VycmVudFJlbHMgJiYgY3VycmVudFJlbHNbcmVsYXRpb25zaGlwXSkge1xyXG4gICAgICBsZXQgcmVscyA9IGNsb25lUmVsYXRpb25zaGlwcyhjdXJyZW50UmVscyk7XHJcbiAgICAgIGxldCByZWwgPSByZWxzW3JlbGF0aW9uc2hpcF07XHJcbiAgICAgIHJlbC5yZW1vdmUocmVsYXRlZFJlY29yZCk7XHJcbiAgICAgIHRoaXMuX3JlbGF0aW9uc2hpcHNbcmVjb3JkLnR5cGVdLnNldChyZWNvcmQuaWQsIHJlbHMpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVwbGFjZVJlbGF0ZWRSZWNvcmRzKHJlY29yZDogUmVjb3JkSWRlbnRpdHksIHJlbGF0aW9uc2hpcDogc3RyaW5nLCByZWxhdGVkUmVjb3JkczogUmVjb3JkSWRlbnRpdHlbXSk6IHZvaWQge1xyXG4gICAgbGV0IGN1cnJlbnRSZWxzID0gdGhpcy5fcmVsYXRpb25zaGlwc1tyZWNvcmQudHlwZV0uZ2V0KHJlY29yZC5pZCk7XHJcbiAgICBsZXQgcmVscyA9IGN1cnJlbnRSZWxzID8gY2xvbmVSZWxhdGlvbnNoaXBzKGN1cnJlbnRSZWxzKSA6IHt9O1xyXG4gICAgbGV0IHJlbCA9IHJlbHNbcmVsYXRpb25zaGlwXTtcclxuICAgIGlmICghcmVsKSB7XHJcbiAgICAgIHJlbCA9IHJlbHNbcmVsYXRpb25zaGlwXSA9IG5ldyBSZWNvcmRJZGVudGl0eU1hcCgpO1xyXG4gICAgfVxyXG4gICAgcmVsYXRlZFJlY29yZHMuZm9yRWFjaChyZWxhdGVkUmVjb3JkID0+IHJlbC5hZGQocmVsYXRlZFJlY29yZCkpO1xyXG4gICAgdGhpcy5fcmVsYXRpb25zaGlwc1tyZWNvcmQudHlwZV0uc2V0KHJlY29yZC5pZCwgcmVscyk7XHJcbiAgfVxyXG5cclxuICByZXBsYWNlUmVsYXRlZFJlY29yZChyZWNvcmQ6IFJlY29yZElkZW50aXR5LCByZWxhdGlvbnNoaXA6IHN0cmluZywgcmVsYXRlZFJlY29yZDogUmVjb3JkSWRlbnRpdHkpOiB2b2lkIHtcclxuICAgIGxldCBjdXJyZW50UmVscyA9IHRoaXMuX3JlbGF0aW9uc2hpcHNbcmVjb3JkLnR5cGVdLmdldChyZWNvcmQuaWQpO1xyXG4gICAgaWYgKChjdXJyZW50UmVscyAmJiBjdXJyZW50UmVsc1tyZWxhdGlvbnNoaXBdKSB8fCByZWxhdGVkUmVjb3JkKSB7XHJcbiAgICAgIGxldCByZWxzID0gY3VycmVudFJlbHMgPyBjbG9uZVJlbGF0aW9uc2hpcHMoY3VycmVudFJlbHMpIDoge307XHJcbiAgICAgIHJlbHNbcmVsYXRpb25zaGlwXSA9IHJlbGF0ZWRSZWNvcmQ7XHJcbiAgICAgIHRoaXMuX3JlbGF0aW9uc2hpcHNbcmVjb3JkLnR5cGVdLnNldChyZWNvcmQuaWQsIHJlbHMpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gY2xvbmVSZWxhdGlvbnNoaXBzKHJlbHMpIHtcclxuICBjb25zdCBjbG9uZWRSZWxzID0ge307XHJcbiAgaWYgKHJlbHMpIHtcclxuICAgIE9iamVjdC5rZXlzKHJlbHMpLmZvckVhY2gobmFtZSA9PiB7XHJcbiAgICAgIGxldCB2YWx1ZSA9IHJlbHNbbmFtZV07XHJcbiAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFJlY29yZElkZW50aXR5TWFwKSB7XHJcbiAgICAgICAgY2xvbmVkUmVsc1tuYW1lXSA9IG5ldyBSZWNvcmRJZGVudGl0eU1hcCh2YWx1ZSBhcyBSZWNvcmRJZGVudGl0eU1hcCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY2xvbmVkUmVsc1tuYW1lXSA9IHZhbHVlO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcbiAgcmV0dXJuIGNsb25lZFJlbHM7XHJcbn1cclxuIl19