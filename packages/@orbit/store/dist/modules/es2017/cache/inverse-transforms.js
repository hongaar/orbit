"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@orbit/utils");
var InverseTransforms = {
    addRecord: function (cache, op) {
        var _a = op.record, type = _a.type, id = _a.id;
        var current = cache.records(type).get(id);
        if (current === undefined) {
            return {
                op: 'removeRecord',
                record: { type: type, id: id }
            };
        }
        else if (utils_1.eq(current, op.record)) {
            return;
        }
        else {
            return {
                op: 'replaceRecord',
                record: current
            };
        }
    },
    replaceRecord: function (cache, op) {
        var replacement = op.record;
        var type = replacement.type, id = replacement.id;
        var current = cache.records(type).get(id);
        if (current === undefined) {
            return {
                op: 'removeRecord',
                record: { type: type, id: id }
            };
        }
        else {
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
                    }
                    else {
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
        var _a = op.record, type = _a.type, id = _a.id;
        var current = cache.records(type).get(id);
        if (current !== undefined) {
            return {
                op: 'replaceRecord',
                record: current
            };
        }
    },
    replaceKey: function (cache, op) {
        var _a = op.record, type = _a.type, id = _a.id;
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
        var _a = op.record, type = _a.type, id = _a.id;
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
        var record = op.record, relationship = op.relationship, relatedRecord = op.relatedRecord;
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
        var record = op.record, relationship = op.relationship, relatedRecord = op.relatedRecord;
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
        var record = op.record, relationship = op.relationship, relatedRecords = op.relatedRecords;
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
        var record = op.record, relationship = op.relationship, relatedRecord = op.relatedRecord;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW52ZXJzZS10cmFuc2Zvcm1zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NhY2hlL2ludmVyc2UtdHJhbnNmb3Jtcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUE2RDtBQXFCN0QsSUFBTSxpQkFBaUIsR0FBRztJQUN4QixTQUFTLEVBQVQsVUFBVSxLQUFZLEVBQUUsRUFBc0I7UUFDdEMsSUFBQSxjQUF3QixFQUF0QixjQUFJLEVBQUUsVUFBRSxDQUFlO1FBQy9CLElBQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRTVDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQzFCLE1BQU0sQ0FBQztnQkFDTCxFQUFFLEVBQUUsY0FBYztnQkFDbEIsTUFBTSxFQUFFLEVBQUUsSUFBSSxNQUFBLEVBQUUsRUFBRSxJQUFBLEVBQUU7YUFDckIsQ0FBQztRQUNKLENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsVUFBRSxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLE1BQU0sQ0FBQztRQUNULENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLE1BQU0sQ0FBQztnQkFDTCxFQUFFLEVBQUUsZUFBZTtnQkFDbkIsTUFBTSxFQUFFLE9BQU87YUFDaEIsQ0FBQztRQUNKLENBQUM7SUFDSCxDQUFDO0lBRUQsYUFBYSxFQUFiLFVBQWMsS0FBWSxFQUFFLEVBQTBCO1FBQ3BELElBQU0sV0FBVyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUM7UUFDdEIsSUFBQSx1QkFBSSxFQUFFLG1CQUFFLENBQWlCO1FBQ2pDLElBQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxD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Y2VzQ29udGVudCI6WyJpbXBvcnQgeyBkZWVwR2V0LCBkZWVwU2V0LCBlcSwgaXNBcnJheSB9IGZyb20gJ0BvcmJpdC91dGlscyc7XHJcbmltcG9ydCB7XHJcbiAgUmVjb3JkSWRlbnRpdHksXHJcbiAgUmVjb3JkT3BlcmF0aW9uLFxyXG4gIEFkZFJlY29yZE9wZXJhdGlvbixcclxuICBBZGRUb1JlbGF0ZWRSZWNvcmRzT3BlcmF0aW9uLFxyXG4gIFJlcGxhY2VBdHRyaWJ1dGVPcGVyYXRpb24sXHJcbiAgUmVtb3ZlRnJvbVJlbGF0ZWRSZWNvcmRzT3BlcmF0aW9uLFxyXG4gIFJlbW92ZVJlY29yZE9wZXJhdGlvbixcclxuICBSZXBsYWNlUmVsYXRlZFJlY29yZHNPcGVyYXRpb24sXHJcbiAgUmVwbGFjZVJlbGF0ZWRSZWNvcmRPcGVyYXRpb24sXHJcbiAgUmVwbGFjZUtleU9wZXJhdGlvbixcclxuICBSZXBsYWNlUmVjb3JkT3BlcmF0aW9uLFxyXG4gIGVxdWFsUmVjb3JkSWRlbnRpdGllc1xyXG59IGZyb20gJ0BvcmJpdC9kYXRhJztcclxuaW1wb3J0IENhY2hlIGZyb20gJy4uL2NhY2hlJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSW52ZXJzZVRyYW5zZm9ybUZ1bmMge1xyXG4gIChjYWNoZTogQ2FjaGUsIG9wOiBSZWNvcmRPcGVyYXRpb24pOiBSZWNvcmRPcGVyYXRpb247XHJcbn1cclxuXHJcbmNvbnN0IEludmVyc2VUcmFuc2Zvcm1zID0ge1xyXG4gIGFkZFJlY29yZChjYWNoZTogQ2FjaGUsIG9wOiBBZGRSZWNvcmRPcGVyYXRpb24pOiBSZWNvcmRPcGVyYXRpb24ge1xyXG4gICAgY29uc3QgeyB0eXBlLCBpZCB9ID0gb3AucmVjb3JkO1xyXG4gICAgY29uc3QgY3VycmVudCA9IGNhY2hlLnJlY29yZHModHlwZSkuZ2V0KGlkKTtcclxuXHJcbiAgICBpZiAoY3VycmVudCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgb3A6ICdyZW1vdmVSZWNvcmQnLFxyXG4gICAgICAgIHJlY29yZDogeyB0eXBlLCBpZCB9XHJcbiAgICAgIH07XHJcbiAgICB9IGVsc2UgaWYgKGVxKGN1cnJlbnQsIG9wLnJlY29yZCkpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBvcDogJ3JlcGxhY2VSZWNvcmQnLFxyXG4gICAgICAgIHJlY29yZDogY3VycmVudFxyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHJlcGxhY2VSZWNvcmQoY2FjaGU6IENhY2hlLCBvcDogUmVwbGFjZVJlY29yZE9wZXJhdGlvbik6IFJlY29yZE9wZXJhdGlvbiB7XHJcbiAgICBjb25zdCByZXBsYWNlbWVudCA9IG9wLnJlY29yZDtcclxuICAgIGNvbnN0IHsgdHlwZSwgaWQgfSA9IHJlcGxhY2VtZW50O1xyXG4gICAgY29uc3QgY3VycmVudCA9IGNhY2hlLnJlY29yZHModHlwZSkuZ2V0KGlkKTtcclxuXHJcbiAgICBpZiAoY3VycmVudCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgb3A6ICdyZW1vdmVSZWNvcmQnLFxyXG4gICAgICAgIHJlY29yZDogeyB0eXBlLCBpZCB9XHJcbiAgICAgIH07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBsZXQgcmVzdWx0ID0geyB0eXBlLCBpZCB9O1xyXG4gICAgICBsZXQgY2hhbmdlZCA9IGZhbHNlO1xyXG5cclxuICAgICAgWydhdHRyaWJ1dGVzJywgJ2tleXMnXS5mb3JFYWNoKGdyb3VwaW5nID0+IHtcclxuICAgICAgICBpZiAocmVwbGFjZW1lbnRbZ3JvdXBpbmddKSB7XHJcbiAgICAgICAgICBPYmplY3Qua2V5cyhyZXBsYWNlbWVudFtncm91cGluZ10pLmZvckVhY2goZmllbGQgPT4ge1xyXG4gICAgICAgICAgICBsZXQgdmFsdWUgPSByZXBsYWNlbWVudFtncm91cGluZ11bZmllbGRdO1xyXG4gICAgICAgICAgICBsZXQgY3VycmVudFZhbHVlID0gZGVlcEdldChjdXJyZW50LCBbZ3JvdXBpbmcsIGZpZWxkXSk7XHJcbiAgICAgICAgICAgIGlmICghZXEodmFsdWUsIGN1cnJlbnRWYWx1ZSkpIHtcclxuICAgICAgICAgICAgICBjaGFuZ2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICBkZWVwU2V0KHJlc3VsdCwgW2dyb3VwaW5nLCBmaWVsZF0sIGN1cnJlbnRWYWx1ZSA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IGN1cnJlbnRWYWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICBpZiAocmVwbGFjZW1lbnQucmVsYXRpb25zaGlwcykge1xyXG4gICAgICAgIE9iamVjdC5rZXlzKHJlcGxhY2VtZW50LnJlbGF0aW9uc2hpcHMpLmZvckVhY2goZmllbGQgPT4ge1xyXG4gICAgICAgICAgbGV0IGN1cnJlbnRWYWx1ZSA9IGRlZXBHZXQoY3VycmVudCwgWydyZWxhdGlvbnNoaXBzJywgZmllbGRdKTtcclxuICAgICAgICAgIGxldCB2YWx1ZSA9IHJlcGxhY2VtZW50LnJlbGF0aW9uc2hpcHNbZmllbGRdO1xyXG4gICAgICAgICAgbGV0IGRhdGEgPSB2YWx1ZSAmJiB2YWx1ZS5kYXRhO1xyXG5cclxuICAgICAgICAgIGxldCByZWxhdGlvbnNoaXBNYXRjaDtcclxuICAgICAgICAgIGlmIChpc0FycmF5KGRhdGEpKSB7XHJcbiAgICAgICAgICAgIHJlbGF0aW9uc2hpcE1hdGNoID0gY2FjaGUucmVsYXRpb25zaGlwcy5yZWxhdGVkUmVjb3Jkc01hdGNoKG9wLnJlY29yZCwgZmllbGQsIGRhdGEgYXMgUmVjb3JkSWRlbnRpdHlbXSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZWxhdGlvbnNoaXBNYXRjaCA9IGVxKHZhbHVlLCBjdXJyZW50VmFsdWUpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmICghcmVsYXRpb25zaGlwTWF0Y2gpIHtcclxuICAgICAgICAgICAgY2hhbmdlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIGRlZXBTZXQocmVzdWx0LCBbJ3JlbGF0aW9uc2hpcHMnLCBmaWVsZF0sIGN1cnJlbnRWYWx1ZSA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IGN1cnJlbnRWYWx1ZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChjaGFuZ2VkKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIG9wOiAncmVwbGFjZVJlY29yZCcsXHJcbiAgICAgICAgICByZWNvcmQ6IHJlc3VsdFxyXG4gICAgICAgIH07XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG5cclxuICByZW1vdmVSZWNvcmQoY2FjaGU6IENhY2hlLCBvcDogUmVtb3ZlUmVjb3JkT3BlcmF0aW9uKTogUmVjb3JkT3BlcmF0aW9uIHtcclxuICAgIGNvbnN0IHsgdHlwZSwgaWQgfSA9IG9wLnJlY29yZDtcclxuICAgIGNvbnN0IGN1cnJlbnQgPSBjYWNoZS5yZWNvcmRzKHR5cGUpLmdldChpZCk7XHJcblxyXG4gICAgaWYgKGN1cnJlbnQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIG9wOiAncmVwbGFjZVJlY29yZCcsXHJcbiAgICAgICAgcmVjb3JkOiBjdXJyZW50XHJcbiAgICAgIH07XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgcmVwbGFjZUtleShjYWNoZTogQ2FjaGUsIG9wOiBSZXBsYWNlS2V5T3BlcmF0aW9uKTogUmVjb3JkT3BlcmF0aW9uIHtcclxuICAgIGNvbnN0IHsgdHlwZSwgaWQgfSA9IG9wLnJlY29yZDtcclxuICAgIGNvbnN0IHJlY29yZCA9IGNhY2hlLnJlY29yZHModHlwZSkuZ2V0KGlkKTtcclxuICAgIGNvbnN0IGN1cnJlbnQgPSByZWNvcmQgJiYgZGVlcEdldChyZWNvcmQsIFsna2V5cycsIG9wLmtleV0pO1xyXG5cclxuICAgIGlmICghZXEoY3VycmVudCwgb3AudmFsdWUpKSB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgb3A6ICdyZXBsYWNlS2V5JyxcclxuICAgICAgICByZWNvcmQ6IHsgdHlwZSwgaWQgfSxcclxuICAgICAgICBrZXk6IG9wLmtleSxcclxuICAgICAgICB2YWx1ZTogY3VycmVudFxyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHJlcGxhY2VBdHRyaWJ1dGUoY2FjaGU6IENhY2hlLCBvcDogUmVwbGFjZUF0dHJpYnV0ZU9wZXJhdGlvbik6IFJlY29yZE9wZXJhdGlvbiB7XHJcbiAgICBjb25zdCB7IHR5cGUsIGlkIH0gPSBvcC5yZWNvcmQ7XHJcbiAgICBjb25zdCB7IGF0dHJpYnV0ZSB9ID0gb3A7XHJcbiAgICBjb25zdCByZWNvcmQgPSBjYWNoZS5yZWNvcmRzKHR5cGUpLmdldChpZCk7XHJcbiAgICBjb25zdCBjdXJyZW50ID0gcmVjb3JkICYmIGRlZXBHZXQocmVjb3JkLCBbJ2F0dHJpYnV0ZXMnLCBhdHRyaWJ1dGVdKTtcclxuXHJcbiAgICBpZiAoIWVxKGN1cnJlbnQsIG9wLnZhbHVlKSkge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIG9wOiAncmVwbGFjZUF0dHJpYnV0ZScsXHJcbiAgICAgICAgcmVjb3JkOiB7IHR5cGUsIGlkIH0sXHJcbiAgICAgICAgYXR0cmlidXRlLFxyXG4gICAgICAgIHZhbHVlOiBjdXJyZW50XHJcbiAgICAgIH07XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgYWRkVG9SZWxhdGVkUmVjb3JkcyhjYWNoZTogQ2FjaGUsIG9wOiBBZGRUb1JlbGF0ZWRSZWNvcmRzT3BlcmF0aW9uKTogUmVjb3JkT3BlcmF0aW9uIHtcclxuICAgIGNvbnN0IHsgcmVjb3JkLCByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmQgfSA9IG9wO1xyXG5cclxuICAgIGlmICghY2FjaGUucmVsYXRpb25zaGlwcy5yZWxhdGlvbnNoaXBFeGlzdHMocmVjb3JkLCByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmQpKSB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgb3A6ICdyZW1vdmVGcm9tUmVsYXRlZFJlY29yZHMnLFxyXG4gICAgICAgIHJlY29yZCxcclxuICAgICAgICByZWxhdGlvbnNoaXAsXHJcbiAgICAgICAgcmVsYXRlZFJlY29yZFxyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHJlbW92ZUZyb21SZWxhdGVkUmVjb3JkcyhjYWNoZTogQ2FjaGUsIG9wOiBSZW1vdmVGcm9tUmVsYXRlZFJlY29yZHNPcGVyYXRpb24pOiBSZWNvcmRPcGVyYXRpb24ge1xyXG4gICAgY29uc3QgeyByZWNvcmQsIHJlbGF0aW9uc2hpcCwgcmVsYXRlZFJlY29yZCB9ID0gb3A7XHJcblxyXG4gICAgaWYgKGNhY2hlLnJlbGF0aW9uc2hpcHMucmVsYXRpb25zaGlwRXhpc3RzKHJlY29yZCwgcmVsYXRpb25zaGlwLCByZWxhdGVkUmVjb3JkKSkge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIG9wOiAnYWRkVG9SZWxhdGVkUmVjb3JkcycsXHJcbiAgICAgICAgcmVjb3JkLFxyXG4gICAgICAgIHJlbGF0aW9uc2hpcCxcclxuICAgICAgICByZWxhdGVkUmVjb3JkXHJcbiAgICAgIH07XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgcmVwbGFjZVJlbGF0ZWRSZWNvcmRzKGNhY2hlOiBDYWNoZSwgb3A6IFJlcGxhY2VSZWxhdGVkUmVjb3Jkc09wZXJhdGlvbik6IFJlY29yZE9wZXJhdGlvbiB7XHJcbiAgICBjb25zdCB7IHJlY29yZCwgcmVsYXRpb25zaGlwLCByZWxhdGVkUmVjb3JkcyB9ID0gb3A7XHJcblxyXG4gICAgaWYgKCFjYWNoZS5yZWxhdGlvbnNoaXBzLnJlbGF0ZWRSZWNvcmRzTWF0Y2gocmVjb3JkLCByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmRzKSkge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIG9wOiAncmVwbGFjZVJlbGF0ZWRSZWNvcmRzJyxcclxuICAgICAgICByZWNvcmQsXHJcbiAgICAgICAgcmVsYXRpb25zaGlwLFxyXG4gICAgICAgIHJlbGF0ZWRSZWNvcmRzOiBjYWNoZS5yZWxhdGlvbnNoaXBzLnJlbGF0ZWRSZWNvcmRzKHJlY29yZCwgcmVsYXRpb25zaGlwKVxyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHJlcGxhY2VSZWxhdGVkUmVjb3JkKGNhY2hlOiBDYWNoZSwgb3A6IFJlcGxhY2VSZWxhdGVkUmVjb3JkT3BlcmF0aW9uKTogUmVjb3JkT3BlcmF0aW9uIHtcclxuICAgIGNvbnN0IHsgcmVjb3JkLCByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmQgfSA9IG9wO1xyXG5cclxuICAgIGlmICghY2FjaGUucmVsYXRpb25zaGlwcy5yZWxhdGlvbnNoaXBFeGlzdHMocmVjb3JkLCByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmQpKSB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgb3A6ICdyZXBsYWNlUmVsYXRlZFJlY29yZCcsXHJcbiAgICAgICAgcmVjb3JkLFxyXG4gICAgICAgIHJlbGF0aW9uc2hpcCxcclxuICAgICAgICByZWxhdGVkUmVjb3JkOiBjYWNoZS5yZWxhdGlvbnNoaXBzLnJlbGF0ZWRSZWNvcmQocmVjb3JkLCByZWxhdGlvbnNoaXApIHx8IG51bGxcclxuICAgICAgfTtcclxuICAgIH1cclxuICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBJbnZlcnNlVHJhbnNmb3JtcztcclxuIl19