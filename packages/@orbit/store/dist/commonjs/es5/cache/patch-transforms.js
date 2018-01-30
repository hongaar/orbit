"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var data_1 = require("@orbit/data");
var utils_1 = require("@orbit/utils");
exports.default = {
    addRecord: function (cache, op) {
        var record = op.record;
        var records = cache.records(record.type);
        records.set(record.id, record);
        if (cache.keyMap) {
            cache.keyMap.pushRecord(record);
        }
        return record;
    },
    replaceRecord: function (cache, op) {
        var updates = op.record;
        var records = cache.records(updates.type);
        var current = records.get(updates.id);
        var record = data_1.mergeRecords(current, updates);
        records.set(record.id, record);
        if (cache.keyMap) {
            cache.keyMap.pushRecord(record);
        }
        return record;
    },
    removeRecord: function (cache, op) {
        var _a = op.record,
            type = _a.type,
            id = _a.id;
        var records = cache.records(type);
        var result = records.get(id);
        if (result) {
            records.remove(id);
            return result;
        } else {
            return null;
        }
    },
    replaceKey: function (cache, op) {
        var _a = op.record,
            type = _a.type,
            id = _a.id;
        var records = cache.records(type);
        var record = records.get(id);
        if (record) {
            record = utils_1.clone(record);
        } else {
            record = { type: type, id: id };
        }
        utils_1.deepSet(record, ['keys', op.key], op.value);
        records.set(id, record);
        if (cache.keyMap) {
            cache.keyMap.pushRecord(record);
        }
        return record;
    },
    replaceAttribute: function (cache, op) {
        var _a = op.record,
            type = _a.type,
            id = _a.id;
        var records = cache.records(type);
        var record = records.get(id);
        if (record) {
            record = utils_1.clone(record);
        } else {
            record = { type: type, id: id };
        }
        utils_1.deepSet(record, ['attributes', op.attribute], op.value);
        records.set(id, record);
        return record;
    },
    addToRelatedRecords: function (cache, op) {
        var _a = op.record,
            type = _a.type,
            id = _a.id;
        var records = cache.records(type);
        var record = records.get(id);
        if (record) {
            record = utils_1.clone(record);
        } else {
            record = { type: type, id: id };
        }
        var relatedRecords = utils_1.deepGet(record, ['relationships', op.relationship, 'data']) || [];
        relatedRecords.push(op.relatedRecord);
        utils_1.deepSet(record, ['relationships', op.relationship, 'data'], relatedRecords);
        records.set(id, record);
        return record;
    },
    removeFromRelatedRecords: function (cache, op) {
        var _a = op.record,
            type = _a.type,
            id = _a.id;
        var records = cache.records(type);
        var record = records.get(id);
        if (record) {
            record = utils_1.clone(record);
            var relatedRecords = utils_1.deepGet(record, ['relationships', op.relationship, 'data']);
            if (relatedRecords) {
                relatedRecords = relatedRecords.filter(function (r) {
                    return !data_1.equalRecordIdentities(r, op.relatedRecord);
                });
                if (utils_1.deepSet(record, ['relationships', op.relationship, 'data'], relatedRecords)) {
                    records.set(id, record);
                }
            }
            return record;
        }
        return null;
    },
    replaceRelatedRecords: function (cache, op) {
        var _a = op.record,
            type = _a.type,
            id = _a.id;
        var records = cache.records(type);
        var record = records.get(id);
        if (record) {
            record = utils_1.clone(record);
        } else {
            record = { type: type, id: id };
        }
        if (utils_1.deepSet(record, ['relationships', op.relationship, 'data'], op.relatedRecords)) {
            records.set(id, record);
        }
        return record;
    },
    replaceRelatedRecord: function (cache, op) {
        var _a = op.record,
            type = _a.type,
            id = _a.id;
        var records = cache.records(type);
        var record = records.get(id);
        if (record) {
            record = utils_1.clone(record);
        } else {
            record = { type: type, id: id };
        }
        if (utils_1.deepSet(record, ['relationships', op.relationship, 'data'], op.relatedRecord)) {
            records.set(id, record);
        }
        return record;
    }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGF0Y2gtdHJhbnNmb3Jtcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9jYWNoZS9wYXRjaC10cmFuc2Zvcm1zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFCQWVxQjtBQUNyQixzQkFBdUQ7QUFPdkQ7ZUFDRSxVQUFVLEFBQVksT0FBRSxBQUFzQixJQUM1QztZQUFJLEFBQU0sU0FBRyxBQUFFLEdBQUMsQUFBTSxBQUFDLEFBQ3ZCO1lBQU0sQUFBTyxVQUFHLEFBQUssTUFBQyxBQUFPLFFBQUMsQUFBTSxPQUFDLEFBQUksQUFBQyxBQUFDLEFBQzNDLEFBQU87Z0JBQUMsQUFBRyxJQUFDLEFBQU0sT0FBQyxBQUFFLElBQUUsQUFBTSxBQUFDLEFBQUMsQUFFL0IsQUFBRSxBQUFDO1lBQUMsQUFBSyxNQUFDLEFBQU0sQUFBQyxRQUFDLEFBQUMsQUFDakIsQUFBSztrQkFBQyxBQUFNLE9BQUMsQUFBVSxXQUFDLEFBQU0sQUFBQyxBQUFDLEFBQ2xDLEFBQUM7QUFFRCxBQUFNO2VBQUMsQUFBTSxBQUFDLEFBQ2hCLEFBQUM7QUFFRCxBQUFhO21CQUFiLFVBQWMsQUFBWSxPQUFFLEFBQTBCLElBQ3BEO1lBQU0sQUFBTyxVQUFHLEFBQUUsR0FBQyxBQUFNLEFBQUMsQUFDMUI7WUFBTSxBQUFPLFVBQUcsQUFBSyxNQUFDLEFBQU8sUUFBQyxBQUFPLFFBQUMsQUFBSSxBQUFDLEFBQUMsQUFDNUM7WUFBTSxBQUFPLFVBQUcsQUFBTyxRQUFDLEFBQUcsSUFBQyxBQUFPLFFBQUMsQUFBRSxBQUFDLEFBQUMsQUFDeEM7WUFBTSxBQUFNLFNBQUcsT0FBWSxhQUFDLEFBQU8sU0FBRSxBQUFPLEFBQUMsQUFBQyxBQUM5QyxBQUFPO2dCQUFDLEFBQUcsSUFBQyxBQUFNLE9BQUMsQUFBRSxJQUFFLEFBQU0sQUFBQyxBQUFDLEFBRS9CLEFBQUUsQUFBQztZQUFDLEFBQUssTUFBQyxBQUFNLEFBQUMsUUFBQyxBQUFDLEFBQ2pCLEFBQUs7a0JB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ZGVudGl0aWVzLFxyXG4gIFJlY29yZCxcclxuICBSZWNvcmRJZGVudGl0eSxcclxuICBSZWNvcmRPcGVyYXRpb24sXHJcbiAgQWRkUmVjb3JkT3BlcmF0aW9uLFxyXG4gIEFkZFRvUmVsYXRlZFJlY29yZHNPcGVyYXRpb24sXHJcbiAgUmVwbGFjZUF0dHJpYnV0ZU9wZXJhdGlvbixcclxuICBSZW1vdmVGcm9tUmVsYXRlZFJlY29yZHNPcGVyYXRpb24sXHJcbiAgUmVtb3ZlUmVjb3JkT3BlcmF0aW9uLFxyXG4gIFJlcGxhY2VSZWxhdGVkUmVjb3Jkc09wZXJhdGlvbixcclxuICBSZXBsYWNlUmVsYXRlZFJlY29yZE9wZXJhdGlvbixcclxuICBSZXBsYWNlS2V5T3BlcmF0aW9uLFxyXG4gIFJlcGxhY2VSZWNvcmRPcGVyYXRpb25cclxufSBmcm9tICdAb3JiaXQvZGF0YSc7XHJcbmltcG9ydCB7IGNsb25lLCBkZWVwR2V0LCBkZWVwU2V0IH0gZnJvbSAnQG9yYml0L3V0aWxzJztcclxuaW1wb3J0IENhY2hlLCB7IFBhdGNoUmVzdWx0RGF0YSB9IGZyb20gJy4uL2NhY2hlJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgUGF0Y2hUcmFuc2Zvcm1GdW5jIHtcclxuICAoY2FjaGU6IENhY2hlLCBvcDogUmVjb3JkT3BlcmF0aW9uKTogUGF0Y2hSZXN1bHREYXRhO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgYWRkUmVjb3JkKGNhY2hlOiBDYWNoZSwgb3A6IEFkZFJlY29yZE9wZXJhdGlvbik6IFBhdGNoUmVzdWx0RGF0YSB7XHJcbiAgICBsZXQgcmVjb3JkID0gb3AucmVjb3JkO1xyXG4gICAgY29uc3QgcmVjb3JkcyA9IGNhY2hlLnJlY29yZHMocmVjb3JkLnR5cGUpO1xyXG4gICAgcmVjb3Jkcy5zZXQocmVjb3JkLmlkLCByZWNvcmQpO1xyXG5cclxuICAgIGlmIChjYWNoZS5rZXlNYXApIHtcclxuICAgICAgY2FjaGUua2V5TWFwLnB1c2hSZWNvcmQocmVjb3JkKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmVjb3JkO1xyXG4gIH0sXHJcblxyXG4gIHJlcGxhY2VSZWNvcmQoY2FjaGU6IENhY2hlLCBvcDogUmVwbGFjZVJlY29yZE9wZXJhdGlvbik6IFBhdGNoUmVzdWx0RGF0YSB7XHJcbiAgICBjb25zdCB1cGRhdGVzID0gb3AucmVjb3JkO1xyXG4gICAgY29uc3QgcmVjb3JkcyA9IGNhY2hlLnJlY29yZHModXBkYXRlcy50eXBlKTtcclxuICAgIGNvbnN0IGN1cnJlbnQgPSByZWNvcmRzLmdldCh1cGRhdGVzLmlkKTtcclxuICAgIGNvbnN0IHJlY29yZCA9IG1lcmdlUmVjb3JkcyhjdXJyZW50LCB1cGRhdGVzKTtcclxuICAgIHJlY29yZHMuc2V0KHJlY29yZC5pZCwgcmVjb3JkKTtcclxuXHJcbiAgICBpZiAoY2FjaGUua2V5TWFwKSB7XHJcbiAgICAgIGNhY2hlLmtleU1hcC5wdXNoUmVjb3JkKHJlY29yZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHJlY29yZDtcclxuICB9LFxyXG5cclxuICByZW1vdmVSZWNvcmQoY2FjaGU6IENhY2hlLCBvcDogUmVtb3ZlUmVjb3JkT3BlcmF0aW9uKTogUGF0Y2hSZXN1bHREYXRhIHtcclxuICAgIGNvbnN0IHsgdHlwZSwgaWQgfSA9IG9wLnJlY29yZDtcclxuICAgIGNvbnN0IHJlY29yZHMgPSBjYWNoZS5yZWNvcmRzKHR5cGUpO1xyXG4gICAgY29uc3QgcmVzdWx0ID0gcmVjb3Jkcy5nZXQoaWQpO1xyXG4gICAgaWYgKHJlc3VsdCkge1xyXG4gICAgICByZWNvcmRzLnJlbW92ZShpZCk7XHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICB9LFxyXG5cclxuICByZXBsYWNlS2V5KGNhY2hlOiBDYWNoZSwgb3A6IFJlcGxhY2VLZXlPcGVyYXRpb24pOiBQYXRjaFJlc3VsdERhdGEge1xyXG4gICAgY29uc3QgeyB0eXBlLCBpZCB9ID0gb3AucmVjb3JkO1xyXG4gICAgY29uc3QgcmVjb3JkcyA9IGNhY2hlLnJlY29yZHModHlwZSk7XHJcbiAgICBsZXQgcmVjb3JkID0gcmVjb3Jkcy5nZXQoaWQpO1xyXG4gICAgaWYgKHJlY29yZCkge1xyXG4gICAgICByZWNvcmQgPSBjbG9uZShyZWNvcmQpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVjb3JkID0geyB0eXBlLCBpZCB9O1xyXG4gICAgfVxyXG4gICAgZGVlcFNldChyZWNvcmQsIFsna2V5cycsIG9wLmtleV0sIG9wLnZhbHVlKTtcclxuICAgIHJlY29yZHMuc2V0KGlkLCByZWNvcmQpO1xyXG5cclxuICAgIGlmIChjYWNoZS5rZXlNYXApIHtcclxuICAgICAgY2FjaGUua2V5TWFwLnB1c2hSZWNvcmQocmVjb3JkKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmVjb3JkO1xyXG4gIH0sXHJcblxyXG4gIHJlcGxhY2VBdHRyaWJ1dGUoY2FjaGU6IENhY2hlLCBvcDogUmVwbGFjZUF0dHJpYnV0ZU9wZXJhdGlvbik6IFBhdGNoUmVzdWx0RGF0YSB7XHJcbiAgICBjb25zdCB7IHR5cGUsIGlkIH0gPSBvcC5yZWNvcmQ7XHJcbiAgICBjb25zdCByZWNvcmRzID0gY2FjaGUucmVjb3Jkcyh0eXBlKTtcclxuICAgIGxldCByZWNvcmQgPSByZWNvcmRzLmdldChpZCk7XHJcbiAgICBpZiAocmVjb3JkKSB7XHJcbiAgICAgIHJlY29yZCA9IGNsb25lKHJlY29yZCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZWNvcmQgPSB7IHR5cGUsIGlkIH07XHJcbiAgICB9XHJcbiAgICBkZWVwU2V0KHJlY29yZCwgWydhdHRyaWJ1dGVzJywgb3AuYXR0cmlidXRlXSwgb3AudmFsdWUpO1xyXG4gICAgcmVjb3Jkcy5zZXQoaWQsIHJlY29yZCk7XHJcbiAgICByZXR1cm4gcmVjb3JkO1xyXG4gIH0sXHJcblxyXG4gIGFkZFRvUmVsYXRlZFJlY29yZHMoY2FjaGU6IENhY2hlLCBvcDogQWRkVG9SZWxhdGVkUmVjb3Jkc09wZXJhdGlvbik6IFBhdGNoUmVzdWx0RGF0YSB7XHJcbiAgICBjb25zdCB7IHR5cGUsIGlkIH0gPSBvcC5yZWNvcmQ7XHJcbiAgICBjb25zdCByZWNvcmRzID0gY2FjaGUucmVjb3Jkcyh0eXBlKTtcclxuICAgIGxldCByZWNvcmQgPSByZWNvcmRzLmdldChpZCk7XHJcbiAgICBpZiAocmVjb3JkKSB7XHJcbiAgICAgIHJlY29yZCA9IGNsb25lKHJlY29yZCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZWNvcmQgPSB7IHR5cGUsIGlkIH07XHJcbiAgICB9XHJcbiAgICBjb25zdCByZWxhdGVkUmVjb3JkcyA9IGRlZXBHZXQocmVjb3JkLCBbJ3JlbGF0aW9uc2hpcHMnLCBvcC5yZWxhdGlvbnNoaXAsICdkYXRhJ10pIHx8IFtdO1xyXG4gICAgcmVsYXRlZFJlY29yZHMucHVzaChvcC5yZWxhdGVkUmVjb3JkKTtcclxuXHJcbiAgICBkZWVwU2V0KHJlY29yZCwgWydyZWxhdGlvbnNoaXBzJywgb3AucmVsYXRpb25zaGlwLCAnZGF0YSddLCByZWxhdGVkUmVjb3Jkcyk7XHJcbiAgICByZWNvcmRzLnNldChpZCwgcmVjb3JkKTtcclxuICAgIHJldHVybiByZWNvcmQ7XHJcbiAgfSxcclxuXHJcbiAgcmVtb3ZlRnJvbVJlbGF0ZWRSZWNvcmRzKGNhY2hlOiBDYWNoZSwgb3A6IFJlbW92ZUZyb21SZWxhdGVkUmVjb3Jkc09wZXJhdGlvbik6IFBhdGNoUmVzdWx0RGF0YSB7XHJcbiAgICBjb25zdCB7IHR5cGUsIGlkIH0gPSBvcC5yZWNvcmQ7XHJcbiAgICBjb25zdCByZWNvcmRzID0gY2FjaGUucmVjb3Jkcyh0eXBlKTtcclxuICAgIGxldCByZWNvcmQgPSByZWNvcmRzLmdldChpZCk7XHJcbiAgICBpZiAocmVjb3JkKSB7XHJcbiAgICAgIHJlY29yZCA9IGNsb25lKHJlY29yZCk7XHJcbiAgICAgIGxldCByZWxhdGVkUmVjb3JkcyA9IGRlZXBHZXQocmVjb3JkLCBbJ3JlbGF0aW9uc2hpcHMnLCBvcC5yZWxhdGlvbnNoaXAsICdkYXRhJ10pIGFzIFJlY29yZElkZW50aXR5W107XHJcbiAgICAgIGlmIChyZWxhdGVkUmVjb3Jkcykge1xyXG4gICAgICAgIHJlbGF0ZWRSZWNvcmRzID0gcmVsYXRlZFJlY29yZHMuZmlsdGVyKHIgPT4gIWVxdWFsUmVjb3JkSWRlbnRpdGllcyhyLCBvcC5yZWxhdGVkUmVjb3JkKSk7XHJcblxyXG4gICAgICAgIGlmIChkZWVwU2V0KHJlY29yZCwgWydyZWxhdGlvbnNoaXBzJywgb3AucmVsYXRpb25zaGlwLCAnZGF0YSddLCByZWxhdGVkUmVjb3JkcykpIHtcclxuICAgICAgICAgIHJlY29yZHMuc2V0KGlkLCByZWNvcmQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gcmVjb3JkO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfSxcclxuXHJcbiAgcmVwbGFjZVJlbGF0ZWRSZWNvcmRzKGNhY2hlOiBDYWNoZSwgb3A6IFJlcGxhY2VSZWxhdGVkUmVjb3Jkc09wZXJhdGlvbik6IFBhdGNoUmVzdWx0RGF0YSB7XHJcbiAgICBjb25zdCB7IHR5cGUsIGlkIH0gPSBvcC5yZWNvcmQ7XHJcbiAgICBjb25zdCByZWNvcmRzID0gY2FjaGUucmVjb3Jkcyh0eXBlKTtcclxuICAgIGxldCByZWNvcmQgPSByZWNvcmRzLmdldChpZCk7XHJcbiAgICBpZiAocmVjb3JkKSB7XHJcbiAgICAgIHJlY29yZCA9IGNsb25lKHJlY29yZCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZWNvcmQgPSB7IHR5cGUsIGlkIH07XHJcbiAgICB9XHJcbiAgICBpZiAoZGVlcFNldChyZWNvcmQsIFsncmVsYXRpb25zaGlwcycsIG9wLnJlbGF0aW9uc2hpcCwgJ2RhdGEnXSwgb3AucmVsYXRlZFJlY29yZHMpKSB7XHJcbiAgICAgIHJlY29yZHMuc2V0KGlkLCByZWNvcmQpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlY29yZDtcclxuICB9LFxyXG5cclxuICByZXBsYWNlUmVsYXRlZFJlY29yZChjYWNoZTogQ2FjaGUsIG9wOiBSZXBsYWNlUmVsYXRlZFJlY29yZE9wZXJhdGlvbik6IFBhdGNoUmVzdWx0RGF0YSB7XHJcbiAgICBjb25zdCB7IHR5cGUsIGlkIH0gPSBvcC5yZWNvcmQ7XHJcbiAgICBjb25zdCByZWNvcmRzID0gY2FjaGUucmVjb3Jkcyh0eXBlKTtcclxuICAgIGxldCByZWNvcmQgPSByZWNvcmRzLmdldChpZCk7XHJcbiAgICBpZiAocmVjb3JkKSB7XHJcbiAgICAgIHJlY29yZCA9IGNsb25lKHJlY29yZCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZWNvcmQgPSB7IHR5cGUsIGlkIH07XHJcbiAgICB9XHJcbiAgICBpZiAoZGVlcFNldChyZWNvcmQsIFsncmVsYXRpb25zaGlwcycsIG9wLnJlbGF0aW9uc2hpcCwgJ2RhdGEnXSwgb3AucmVsYXRlZFJlY29yZCkpIHtcclxuICAgICAgcmVjb3Jkcy5zZXQoaWQsIHJlY29yZCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVjb3JkO1xyXG4gIH1cclxufTtcclxuIl19