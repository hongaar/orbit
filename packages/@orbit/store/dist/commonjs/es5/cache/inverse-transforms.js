"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@orbit/utils");
var InverseTransforms = {
    addRecord: function (cache, op) {
        var _a = op.record,
            type = _a.type,
            id = _a.id;
        var current = cache.records(type).get(id);
        if (current === undefined) {
            return {
                op: 'removeRecord',
                record: { type: type, id: id }
            };
        } else if (utils_1.eq(current, op.record)) {
            return;
        } else {
            return {
                op: 'replaceRecord',
                record: current
            };
        }
    },
    replaceRecord: function (cache, op) {
        var replacement = op.record;
        var type = replacement.type,
            id = replacement.id;
        var current = cache.records(type).get(id);
        if (current === undefined) {
            return {
                op: 'removeRecord',
                record: { type: type, id: id }
            };
        } else {
            var result_1 = { type: type, id: id };
            var changed_1 = false;
            ['attributes', 'keys'].forEach(function (grouping) {
                if (replacement[grouping]) {
                    Object.keys(replacement[grouping]).forEach(function (field) {
                        var value = replacement[grouping][field];
                        var currentValue = utils_1.deepGet(current, [grouping, field]);
                        if (!utils_1.eq(value, currentValue)) {
                            changed_1 = true;
                            utils_1.deepSet(result_1, [grouping, field], currentValue === undefined ? null : currentValue);
                        }
                    });
                }
            });
            if (replacement.relationships) {
                Object.keys(replacement.relationships).forEach(function (field) {
                    var currentValue = utils_1.deepGet(current, ['relationships', field]);
                    var value = replacement.relationships[field];
                    var data = value && value.data;
                    var relationshipMatch;
                    if (utils_1.isArray(data)) {
                        relationshipMatch = cache.relationships.relatedRecordsMatch(op.record, field, data);
                    } else {
                        relationshipMatch = utils_1.eq(value, currentValue);
                    }
                    if (!relationshipMatch) {
                        changed_1 = true;
                        utils_1.deepSet(result_1, ['relationships', field], currentValue === undefined ? null : currentValue);
                    }
                });
            }
            if (changed_1) {
                return {
                    op: 'replaceRecord',
                    record: result_1
                };
            }
        }
    },
    removeRecord: function (cache, op) {
        var _a = op.record,
            type = _a.type,
            id = _a.id;
        var current = cache.records(type).get(id);
        if (current !== undefined) {
            return {
                op: 'replaceRecord',
                record: current
            };
        }
    },
    replaceKey: function (cache, op) {
        var _a = op.record,
            type = _a.type,
            id = _a.id;
        var record = cache.records(type).get(id);
        var current = record && utils_1.deepGet(record, ['keys', op.key]);
        if (!utils_1.eq(current, op.value)) {
            return {
                op: 'replaceKey',
                record: { type: type, id: id },
                key: op.key,
                value: current
            };
        }
    },
    replaceAttribute: function (cache, op) {
        var _a = op.record,
            type = _a.type,
            id = _a.id;
        var attribute = op.attribute;
        var record = cache.records(type).get(id);
        var current = record && utils_1.deepGet(record, ['attributes', attribute]);
        if (!utils_1.eq(current, op.value)) {
            return {
                op: 'replaceAttribute',
                record: { type: type, id: id },
                attribute: attribute,
                value: current
            };
        }
    },
    addToRelatedRecords: function (cache, op) {
        var record = op.record,
            relationship = op.relationship,
            relatedRecord = op.relatedRecord;
        if (!cache.relationships.relationshipExists(record, relationship, relatedRecord)) {
            return {
                op: 'removeFromRelatedRecords',
                record: record,
                relationship: relationship,
                relatedRecord: relatedRecord
            };
        }
    },
    removeFromRelatedRecords: function (cache, op) {
        var record = op.record,
            relationship = op.relationship,
            relatedRecord = op.relatedRecord;
        if (cache.relationships.relationshipExists(record, relationship, relatedRecord)) {
            return {
                op: 'addToRelatedRecords',
                record: record,
                relationship: relationship,
                relatedRecord: relatedRecord
            };
        }
    },
    replaceRelatedRecords: function (cache, op) {
        var record = op.record,
            relationship = op.relationship,
            relatedRecords = op.relatedRecords;
        if (!cache.relationships.relatedRecordsMatch(record, relationship, relatedRecords)) {
            return {
                op: 'replaceRelatedRecords',
                record: record,
                relationship: relationship,
                relatedRecords: cache.relationships.relatedRecords(record, relationship)
            };
        }
    },
    replaceRelatedRecord: function (cache, op) {
        var record = op.record,
            relationship = op.relationship,
            relatedRecord = op.relatedRecord;
        if (!cache.relationships.relationshipExists(record, relationship, relatedRecord)) {
            return {
                op: 'replaceRelatedRecord',
                record: record,
                relationship: relationship,
                relatedRecord: cache.relationships.relatedRecord(record, relationship) || null
            };
        }
    }
};
exports.default = InverseTransforms;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW52ZXJzZS10cmFuc2Zvcm1zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NhY2hlL2ludmVyc2UtdHJhbnNmb3Jtcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxzQkFBNkQ7QUFxQjdELElBQU0sQUFBaUI7ZUFDckIsVUFBVSxBQUFZLE9BQUUsQUFBc0IsSUFDdEM7WUFBQSxRQUF3QjtZQUF0QixVQUFJO1lBQUUsUUFBRSxBQUFlLEFBQy9CO1lBQU0sQUFBTyxVQUFHLEFBQUssTUFBQyxBQUFPLFFBQUMsQUFBSSxBQUFDLE1BQUMsQUFBRyxJQUFDLEFBQUUsQUFBQyxBQUFDLEFBRTVDLEFBQUUsQUFBQztZQUFDLEFBQU8sWUFBSyxBQUFTLEFBQUMsV0FBQyxBQUFDLEFBQzFCLEFBQU07O29CQUNBLEFBQWMsQUFDbEIsQUFBTTt3QkFBRSxFQUFFLEFBQUksTUFBQSxNQUFFLEFBQUUsSUFGYixBQUVhLEFBQUUsQUFDckIsQUFBQyxBQUNKLEFBQUMsQUFBQyxBQUFJO0FBSEYsQUFBRTttQkFHSyxRQUFFLEdBQUMsQUFBTyxTQUFFLEFBQUUsR0FBQyxBQUFNLEFBQUMsQUFBQyxTQUFDLEFBQUMsQUFDbEMsQUFBTSxBQUFDLEFBQ1Q7QUFBQyxBQUFDLEFBQUk7QUFGQyxBQUFFLEFBQUMsZUFFSCxBQUFDLEFBQ04sQUFBTTs7b0JBQ0EsQUFBZSxBQUNuQixBQUFNO3dCQUZELEFBRUcsQUFBTyxBQUNoQixBQUFDLEFBQ0osQUFBQyxBQUNIO0FBSk0sQUFBRTtBQUlQO0FBRUQsQUFBYTttQkFBYixVQUFjLEFBQVksT0FBRSxBQUEwQixJQUNwRDtZQUFNLEFBQVcsY0FBRyxBQUFFLEdBQUMsQUFBTSxBQUFDLEFBQ3RCO1lBQUEsbUJBQUk7WUFBRSxpQkFBRSxBQUFpQixBQUNqQztZQUFNLEFBQU8sVUFBRyxBQUFLLE1BQUMsQUFBTyxRQUFDLEFBQUksQUFBQyxNQUFDLEFBQUcsSUFBQyxBQUFFLEFBQUMsQUFBQyxBQUU1QyxB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QixBQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZGVlcEdldCwgZGVlcFNldCwgZXEsIGlzQXJyYXkgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xyXG5pbXBvcnQge1xyXG4gIFJlY29yZElkZW50aXR5LFxyXG4gIFJlY29yZE9wZXJhdGlvbixcclxuICBBZGRSZWNvcmRPcGVyYXRpb24sXHJcbiAgQWRkVG9SZWxhdGVkUmVjb3Jkc09wZXJhdGlvbixcclxuICBSZXBsYWNlQXR0cmlidXRlT3BlcmF0aW9uLFxyXG4gIFJlbW92ZUZyb21SZWxhdGVkUmVjb3Jkc09wZXJhdGlvbixcclxuICBSZW1vdmVSZWNvcmRPcGVyYXRpb24sXHJcbiAgUmVwbGFjZVJlbGF0ZWRSZWNvcmRzT3BlcmF0aW9uLFxyXG4gIFJlcGxhY2VSZWxhdGVkUmVjb3JkT3BlcmF0aW9uLFxyXG4gIFJlcGxhY2VLZXlPcGVyYXRpb24sXHJcbiAgUmVwbGFjZVJlY29yZE9wZXJhdGlvbixcclxuICBlcXVhbFJlY29yZElkZW50aXRpZXNcclxufSBmcm9tICdAb3JiaXQvZGF0YSc7XHJcbmltcG9ydCBDYWNoZSBmcm9tICcuLi9jYWNoZSc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEludmVyc2VUcmFuc2Zvcm1GdW5jIHtcclxuICAoY2FjaGU6IENhY2hlLCBvcDogUmVjb3JkT3BlcmF0aW9uKTogUmVjb3JkT3BlcmF0aW9uO1xyXG59XHJcblxyXG5jb25zdCBJbnZlcnNlVHJhbnNmb3JtcyA9IHtcclxuICBhZGRSZWNvcmQoY2FjaGU6IENhY2hlLCBvcDogQWRkUmVjb3JkT3BlcmF0aW9uKTogUmVjb3JkT3BlcmF0aW9uIHtcclxuICAgIGNvbnN0IHsgdHlwZSwgaWQgfSA9IG9wLnJlY29yZDtcclxuICAgIGNvbnN0IGN1cnJlbnQgPSBjYWNoZS5yZWNvcmRzKHR5cGUpLmdldChpZCk7XHJcblxyXG4gICAgaWYgKGN1cnJlbnQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIG9wOiAncmVtb3ZlUmVjb3JkJyxcclxuICAgICAgICByZWNvcmQ6IHsgdHlwZSwgaWQgfVxyXG4gICAgICB9O1xyXG4gICAgfSBlbHNlIGlmIChlcShjdXJyZW50LCBvcC5yZWNvcmQpKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgb3A6ICdyZXBsYWNlUmVjb3JkJyxcclxuICAgICAgICByZWNvcmQ6IGN1cnJlbnRcclxuICAgICAgfTtcclxuICAgIH1cclxuICB9LFxyXG5cclxuICByZXBsYWNlUmVjb3JkKGNhY2hlOiBDYWNoZSwgb3A6IFJlcGxhY2VSZWNvcmRPcGVyYXRpb24pOiBSZWNvcmRPcGVyYXRpb24ge1xyXG4gICAgY29uc3QgcmVwbGFjZW1lbnQgPSBvcC5yZWNvcmQ7XHJcbiAgICBjb25zdCB7IHR5cGUsIGlkIH0gPSByZXBsYWNlbWVudDtcclxuICAgIGNvbnN0IGN1cnJlbnQgPSBjYWNoZS5yZWNvcmRzKHR5cGUpLmdldChpZCk7XHJcblxyXG4gICAgaWYgKGN1cnJlbnQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIG9wOiAncmVtb3ZlUmVjb3JkJyxcclxuICAgICAgICByZWNvcmQ6IHsgdHlwZSwgaWQgfVxyXG4gICAgICB9O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbGV0IHJlc3VsdCA9IHsgdHlwZSwgaWQgfTtcclxuICAgICAgbGV0IGNoYW5nZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgIFsnYXR0cmlidXRlcycsICdrZXlzJ10uZm9yRWFjaChncm91cGluZyA9PiB7XHJcbiAgICAgICAgaWYgKHJlcGxhY2VtZW50W2dyb3VwaW5nXSkge1xyXG4gICAgICAgICAgT2JqZWN0LmtleXMocmVwbGFjZW1lbnRbZ3JvdXBpbmddKS5mb3JFYWNoKGZpZWxkID0+IHtcclxuICAgICAgICAgICAgbGV0IHZhbHVlID0gcmVwbGFjZW1lbnRbZ3JvdXBpbmddW2ZpZWxkXTtcclxuICAgICAgICAgICAgbGV0IGN1cnJlbnRWYWx1ZSA9IGRlZXBHZXQoY3VycmVudCwgW2dyb3VwaW5nLCBmaWVsZF0pO1xyXG4gICAgICAgICAgICBpZiAoIWVxKHZhbHVlLCBjdXJyZW50VmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgY2hhbmdlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgZGVlcFNldChyZXN1bHQsIFtncm91cGluZywgZmllbGRdLCBjdXJyZW50VmFsdWUgPT09IHVuZGVmaW5lZCA/IG51bGwgOiBjdXJyZW50VmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgaWYgKHJlcGxhY2VtZW50LnJlbGF0aW9uc2hpcHMpIHtcclxuICAgICAgICBPYmplY3Qua2V5cyhyZXBsYWNlbWVudC5yZWxhdGlvbnNoaXBzKS5mb3JFYWNoKGZpZWxkID0+IHtcclxuICAgICAgICAgIGxldCBjdXJyZW50VmFsdWUgPSBkZWVwR2V0KGN1cnJlbnQsIFsncmVsYXRpb25zaGlwcycsIGZpZWxkXSk7XHJcbiAgICAgICAgICBsZXQgdmFsdWUgPSByZXBsYWNlbWVudC5yZWxhdGlvbnNoaXBzW2ZpZWxkXTtcclxuICAgICAgICAgIGxldCBkYXRhID0gdmFsdWUgJiYgdmFsdWUuZGF0YTtcclxuXHJcbiAgICAgICAgICBsZXQgcmVsYXRpb25zaGlwTWF0Y2g7XHJcbiAgICAgICAgICBpZiAoaXNBcnJheShkYXRhKSkge1xyXG4gICAgICAgICAgICByZWxhdGlvbnNoaXBNYXRjaCA9IGNhY2hlLnJlbGF0aW9uc2hpcHMucmVsYXRlZFJlY29yZHNNYXRjaChvcC5yZWNvcmQsIGZpZWxkLCBkYXRhIGFzIFJlY29yZElkZW50aXR5W10pO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmVsYXRpb25zaGlwTWF0Y2ggPSBlcSh2YWx1ZSwgY3VycmVudFZhbHVlKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAoIXJlbGF0aW9uc2hpcE1hdGNoKSB7XHJcbiAgICAgICAgICAgIGNoYW5nZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICBkZWVwU2V0KHJlc3VsdCwgWydyZWxhdGlvbnNoaXBzJywgZmllbGRdLCBjdXJyZW50VmFsdWUgPT09IHVuZGVmaW5lZCA/IG51bGwgOiBjdXJyZW50VmFsdWUpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoY2hhbmdlZCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICBvcDogJ3JlcGxhY2VSZWNvcmQnLFxyXG4gICAgICAgICAgcmVjb3JkOiByZXN1bHRcclxuICAgICAgICB9O1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgcmVtb3ZlUmVjb3JkKGNhY2hlOiBDYWNoZSwgb3A6IFJlbW92ZVJlY29yZE9wZXJhdGlvbik6IFJlY29yZE9wZXJhdGlvbiB7XHJcbiAgICBjb25zdCB7IHR5cGUsIGlkIH0gPSBvcC5yZWNvcmQ7XHJcbiAgICBjb25zdCBjdXJyZW50ID0gY2FjaGUucmVjb3Jkcyh0eXBlKS5nZXQoaWQpO1xyXG5cclxuICAgIGlmIChjdXJyZW50ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBvcDogJ3JlcGxhY2VSZWNvcmQnLFxyXG4gICAgICAgIHJlY29yZDogY3VycmVudFxyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHJlcGxhY2VLZXkoY2FjaGU6IENhY2hlLCBvcDogUmVwbGFjZUtleU9wZXJhdGlvbik6IFJlY29yZE9wZXJhdGlvbiB7XHJcbiAgICBjb25zdCB7IHR5cGUsIGlkIH0gPSBvcC5yZWNvcmQ7XHJcbiAgICBjb25zdCByZWNvcmQgPSBjYWNoZS5yZWNvcmRzKHR5cGUpLmdldChpZCk7XHJcbiAgICBjb25zdCBjdXJyZW50ID0gcmVjb3JkICYmIGRlZXBHZXQocmVjb3JkLCBbJ2tleXMnLCBvcC5rZXldKTtcclxuXHJcbiAgICBpZiAoIWVxKGN1cnJlbnQsIG9wLnZhbHVlKSkge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIG9wOiAncmVwbGFjZUtleScsXHJcbiAgICAgICAgcmVjb3JkOiB7IHR5cGUsIGlkIH0sXHJcbiAgICAgICAga2V5OiBvcC5rZXksXHJcbiAgICAgICAgdmFsdWU6IGN1cnJlbnRcclxuICAgICAgfTtcclxuICAgIH1cclxuICB9LFxyXG5cclxuICByZXBsYWNlQXR0cmlidXRlKGNhY2hlOiBDYWNoZSwgb3A6IFJlcGxhY2VBdHRyaWJ1dGVPcGVyYXRpb24pOiBSZWNvcmRPcGVyYXRpb24ge1xyXG4gICAgY29uc3QgeyB0eXBlLCBpZCB9ID0gb3AucmVjb3JkO1xyXG4gICAgY29uc3QgeyBhdHRyaWJ1dGUgfSA9IG9wO1xyXG4gICAgY29uc3QgcmVjb3JkID0gY2FjaGUucmVjb3Jkcyh0eXBlKS5nZXQoaWQpO1xyXG4gICAgY29uc3QgY3VycmVudCA9IHJlY29yZCAmJiBkZWVwR2V0KHJlY29yZCwgWydhdHRyaWJ1dGVzJywgYXR0cmlidXRlXSk7XHJcblxyXG4gICAgaWYgKCFlcShjdXJyZW50LCBvcC52YWx1ZSkpIHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBvcDogJ3JlcGxhY2VBdHRyaWJ1dGUnLFxyXG4gICAgICAgIHJlY29yZDogeyB0eXBlLCBpZCB9LFxyXG4gICAgICAgIGF0dHJpYnV0ZSxcclxuICAgICAgICB2YWx1ZTogY3VycmVudFxyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGFkZFRvUmVsYXRlZFJlY29yZHMoY2FjaGU6IENhY2hlLCBvcDogQWRkVG9SZWxhdGVkUmVjb3Jkc09wZXJhdGlvbik6IFJlY29yZE9wZXJhdGlvbiB7XHJcbiAgICBjb25zdCB7IHJlY29yZCwgcmVsYXRpb25zaGlwLCByZWxhdGVkUmVjb3JkIH0gPSBvcDtcclxuXHJcbiAgICBpZiAoIWNhY2hlLnJlbGF0aW9uc2hpcHMucmVsYXRpb25zaGlwRXhpc3RzKHJlY29yZCwgcmVsYXRpb25zaGlwLCByZWxhdGVkUmVjb3JkKSkge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIG9wOiAncmVtb3ZlRnJvbVJlbGF0ZWRSZWNvcmRzJyxcclxuICAgICAgICByZWNvcmQsXHJcbiAgICAgICAgcmVsYXRpb25zaGlwLFxyXG4gICAgICAgIHJlbGF0ZWRSZWNvcmRcclxuICAgICAgfTtcclxuICAgIH1cclxuICB9LFxyXG5cclxuICByZW1vdmVGcm9tUmVsYXRlZFJlY29yZHMoY2FjaGU6IENhY2hlLCBvcDogUmVtb3ZlRnJvbVJlbGF0ZWRSZWNvcmRzT3BlcmF0aW9uKTogUmVjb3JkT3BlcmF0aW9uIHtcclxuICAgIGNvbnN0IHsgcmVjb3JkLCByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmQgfSA9IG9wO1xyXG5cclxuICAgIGlmIChjYWNoZS5yZWxhdGlvbnNoaXBzLnJlbGF0aW9uc2hpcEV4aXN0cyhyZWNvcmQsIHJlbGF0aW9uc2hpcCwgcmVsYXRlZFJlY29yZCkpIHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBvcDogJ2FkZFRvUmVsYXRlZFJlY29yZHMnLFxyXG4gICAgICAgIHJlY29yZCxcclxuICAgICAgICByZWxhdGlvbnNoaXAsXHJcbiAgICAgICAgcmVsYXRlZFJlY29yZFxyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHJlcGxhY2VSZWxhdGVkUmVjb3JkcyhjYWNoZTogQ2FjaGUsIG9wOiBSZXBsYWNlUmVsYXRlZFJlY29yZHNPcGVyYXRpb24pOiBSZWNvcmRPcGVyYXRpb24ge1xyXG4gICAgY29uc3QgeyByZWNvcmQsIHJlbGF0aW9uc2hpcCwgcmVsYXRlZFJlY29yZHMgfSA9IG9wO1xyXG5cclxuICAgIGlmICghY2FjaGUucmVsYXRpb25zaGlwcy5yZWxhdGVkUmVjb3Jkc01hdGNoKHJlY29yZCwgcmVsYXRpb25zaGlwLCByZWxhdGVkUmVjb3JkcykpIHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBvcDogJ3JlcGxhY2VSZWxhdGVkUmVjb3JkcycsXHJcbiAgICAgICAgcmVjb3JkLFxyXG4gICAgICAgIHJlbGF0aW9uc2hpcCxcclxuICAgICAgICByZWxhdGVkUmVjb3JkczogY2FjaGUucmVsYXRpb25zaGlwcy5yZWxhdGVkUmVjb3JkcyhyZWNvcmQsIHJlbGF0aW9uc2hpcClcclxuICAgICAgfTtcclxuICAgIH1cclxuICB9LFxyXG5cclxuICByZXBsYWNlUmVsYXRlZFJlY29yZChjYWNoZTogQ2FjaGUsIG9wOiBSZXBsYWNlUmVsYXRlZFJlY29yZE9wZXJhdGlvbik6IFJlY29yZE9wZXJhdGlvbiB7XHJcbiAgICBjb25zdCB7IHJlY29yZCwgcmVsYXRpb25zaGlwLCByZWxhdGVkUmVjb3JkIH0gPSBvcDtcclxuXHJcbiAgICBpZiAoIWNhY2hlLnJlbGF0aW9uc2hpcHMucmVsYXRpb25zaGlwRXhpc3RzKHJlY29yZCwgcmVsYXRpb25zaGlwLCByZWxhdGVkUmVjb3JkKSkge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIG9wOiAncmVwbGFjZVJlbGF0ZWRSZWNvcmQnLFxyXG4gICAgICAgIHJlY29yZCxcclxuICAgICAgICByZWxhdGlvbnNoaXAsXHJcbiAgICAgICAgcmVsYXRlZFJlY29yZDogY2FjaGUucmVsYXRpb25zaGlwcy5yZWxhdGVkUmVjb3JkKHJlY29yZCwgcmVsYXRpb25zaGlwKSB8fCBudWxsXHJcbiAgICAgIH07XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgSW52ZXJzZVRyYW5zZm9ybXM7XHJcbiJdfQ==