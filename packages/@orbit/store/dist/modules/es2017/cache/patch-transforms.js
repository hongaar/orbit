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
        var _a = op.record, type = _a.type, id = _a.id;
        var records = cache.records(type);
        var result = records.get(id);
        if (result) {
            records.remove(id);
            return result;
        }
        else {
            return null;
        }
    },
    replaceKey: function (cache, op) {
        var _a = op.record, type = _a.type, id = _a.id;
        var records = cache.records(type);
        var record = records.get(id);
        if (record) {
            record = utils_1.clone(record);
        }
        else {
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
        var _a = op.record, type = _a.type, id = _a.id;
        var records = cache.records(type);
        var record = records.get(id);
        if (record) {
            record = utils_1.clone(record);
        }
        else {
            record = { type: type, id: id };
        }
        utils_1.deepSet(record, ['attributes', op.attribute], op.value);
        records.set(id, record);
        return record;
    },
    addToRelatedRecords: function (cache, op) {
        var _a = op.record, type = _a.type, id = _a.id;
        var records = cache.records(type);
        var record = records.get(id);
        if (record) {
            record = utils_1.clone(record);
        }
        else {
            record = { type: type, id: id };
        }
        var relatedRecords = utils_1.deepGet(record, ['relationships', op.relationship, 'data']) || [];
        relatedRecords.push(op.relatedRecord);
        utils_1.deepSet(record, ['relationships', op.relationship, 'data'], relatedRecords);
        records.set(id, record);
        return record;
    },
    removeFromRelatedRecords: function (cache, op) {
        var _a = op.record, type = _a.type, id = _a.id;
        var records = cache.records(type);
        var record = records.get(id);
        if (record) {
            record = utils_1.clone(record);
            var relatedRecords = utils_1.deepGet(record, ['relationships', op.relationship, 'data']);
            if (relatedRecords) {
                relatedRecords = relatedRecords.filter(function (r) { return !data_1.equalRecordIdentities(r, op.relatedRecord); });
                if (utils_1.deepSet(record, ['relationships', op.relationship, 'data'], relatedRecords)) {
                    records.set(id, record);
                }
            }
            return record;
        }
        return null;
    },
    replaceRelatedRecords: function (cache, op) {
        var _a = op.record, type = _a.type, id = _a.id;
        var records = cache.records(type);
        var record = records.get(id);
        if (record) {
            record = utils_1.clone(record);
        }
        else {
            record = { type: type, id: id };
        }
        if (utils_1.deepSet(record, ['relationships', op.relationship, 'data'], op.relatedRecords)) {
            records.set(id, record);
        }
        return record;
    },
    replaceRelatedRecord: function (cache, op) {
        var _a = op.record, type = _a.type, id = _a.id;
        var records = cache.records(type);
        var record = records.get(id);
        if (record) {
            record = utils_1.clone(record);
        }
        else {
            record = { type: type, id: id };
        }
        if (utils_1.deepSet(record, ['relationships', op.relationship, 'data'], op.relatedRecord)) {
            records.set(id, record);
        }
        return record;
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGF0Y2gtdHJhbnNmb3Jtcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9jYWNoZS9wYXRjaC10cmFuc2Zvcm1zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0NBZXFCO0FBQ3JCLHNDQUF1RDtBQU92RCxrQkFBZTtJQUNiLFNBQVMsRUFBVCxVQUFVLEtBQVksRUFBRSxFQUFzQjtRQUM1QyxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDO1FBQ3ZCLElBQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzNDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUUvQixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNqQixLQUFLLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNsQyxDQUFDO1FBRUQsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBRUQsYUFBYSxFQUFiLFVBQWMsS0FBWSxFQUFFLEVBQTBCO1FBQ3BELElBQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUM7UUFDMUIsSUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUMsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDeEMsSUFBTSxNQUFNLEdBQUcsbUJBQVksQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDOUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRS9CLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lB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QUUsQ0FBQyxlQUFlLEVBQUUsRUFBRSxDQUFDLFlBQVksRUFBRSxNQUFNLENBQUMsRUFBRSxFQUFFLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25GLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzFCLENBQUM7UUFDRCxNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxvQkFBb0IsRUFBcEIsVUFBcUIsS0FBWSxFQUFFLEVBQWlDO1FBQzVELElBQUEsY0FBd0IsRUFBdEIsY0FBSSxFQUFFLFVBQUUsQ0FBZTtRQUMvQixJQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BDLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDN0IsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNYLE1BQU0sR0FBRyxhQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDekIsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sTUFBTSxHQUFHLEVBQUUsSUFBSSxNQUFBLEVBQUUsRUFBRSxJQUFBLEVBQUUsQ0FBQztRQUN4QixDQUFDO1FBQ0QsRUFBRSxDQUFDLENBQUMsZUFBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLGVBQWUsRUFBRSxFQUFFLENBQUMsWUFBWSxFQUFFLE1BQU0sQ0FBQyxFQUFFLEVBQUUsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDMUIsQ0FBQztRQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDaEIsQ0FBQztDQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG4gIG1lcmdlUmVjb3JkcyxcclxuICBlcXVhbFJlY29yZElkZW50aXRpZXMsXHJcbiAgUmVjb3JkLFxyXG4gIFJlY29yZElkZW50aXR5LFxyXG4gIFJlY29yZE9wZXJhdGlvbixcclxuICBBZGRSZWNvcmRPcGVyYXRpb24sXHJcbiAgQWRkVG9SZWxhdGVkUmVjb3Jkc09wZXJhdGlvbixcclxuICBSZXBsYWNlQXR0cmlidXRlT3BlcmF0aW9uLFxyXG4gIFJlbW92ZUZyb21SZWxhdGVkUmVjb3Jkc09wZXJhdGlvbixcclxuICBSZW1vdmVSZWNvcmRPcGVyYXRpb24sXHJcbiAgUmVwbGFjZVJlbGF0ZWRSZWNvcmRzT3BlcmF0aW9uLFxyXG4gIFJlcGxhY2VSZWxhdGVkUmVjb3JkT3BlcmF0aW9uLFxyXG4gIFJlcGxhY2VLZXlPcGVyYXRpb24sXHJcbiAgUmVwbGFjZVJlY29yZE9wZXJhdGlvblxyXG59IGZyb20gJ0BvcmJpdC9kYXRhJztcclxuaW1wb3J0IHsgY2xvbmUsIGRlZXBHZXQsIGRlZXBTZXQgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xyXG5pbXBvcnQgQ2FjaGUsIHsgUGF0Y2hSZXN1bHREYXRhIH0gZnJvbSAnLi4vY2FjaGUnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBQYXRjaFRyYW5zZm9ybUZ1bmMge1xyXG4gIChjYWNoZTogQ2FjaGUsIG9wOiBSZWNvcmRPcGVyYXRpb24pOiBQYXRjaFJlc3VsdERhdGE7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBhZGRSZWNvcmQoY2FjaGU6IENhY2hlLCBvcDogQWRkUmVjb3JkT3BlcmF0aW9uKTogUGF0Y2hSZXN1bHREYXRhIHtcclxuICAgIGxldCByZWNvcmQgPSBvcC5yZWNvcmQ7XHJcbiAgICBjb25zdCByZWNvcmRzID0gY2FjaGUucmVjb3JkcyhyZWNvcmQudHlwZSk7XHJcbiAgICByZWNvcmRzLnNldChyZWNvcmQuaWQsIHJlY29yZCk7XHJcblxyXG4gICAgaWYgKGNhY2hlLmtleU1hcCkge1xyXG4gICAgICBjYWNoZS5rZXlNYXAucHVzaFJlY29yZChyZWNvcmQpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZWNvcmQ7XHJcbiAgfSxcclxuXHJcbiAgcmVwbGFjZVJlY29yZChjYWNoZTogQ2FjaGUsIG9wOiBSZXBsYWNlUmVjb3JkT3BlcmF0aW9uKTogUGF0Y2hSZXN1bHREYXRhIHtcclxuICAgIGNvbnN0IHVwZGF0ZXMgPSBvcC5yZWNvcmQ7XHJcbiAgICBjb25zdCByZWNvcmRzID0gY2FjaGUucmVjb3Jkcyh1cGRhdGVzLnR5cGUpO1xyXG4gICAgY29uc3QgY3VycmVudCA9IHJlY29yZHMuZ2V0KHVwZGF0ZXMuaWQpO1xyXG4gICAgY29uc3QgcmVjb3JkID0gbWVyZ2VSZWNvcmRzKGN1cnJlbnQsIHVwZGF0ZXMpO1xyXG4gICAgcmVjb3Jkcy5zZXQocmVjb3JkLmlkLCByZWNvcmQpO1xyXG5cclxuICAgIGlmIChjYWNoZS5rZXlNYXApIHtcclxuICAgICAgY2FjaGUua2V5TWFwLnB1c2hSZWNvcmQocmVjb3JkKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmVjb3JkO1xyXG4gIH0sXHJcblxyXG4gIHJlbW92ZVJlY29yZChjYWNoZTogQ2FjaGUsIG9wOiBSZW1vdmVSZWNvcmRPcGVyYXRpb24pOiBQYXRjaFJlc3VsdERhdGEge1xyXG4gICAgY29uc3QgeyB0eXBlLCBpZCB9ID0gb3AucmVjb3JkO1xyXG4gICAgY29uc3QgcmVjb3JkcyA9IGNhY2hlLnJlY29yZHModHlwZSk7XHJcbiAgICBjb25zdCByZXN1bHQgPSByZWNvcmRzLmdldChpZCk7XHJcbiAgICBpZiAocmVzdWx0KSB7XHJcbiAgICAgIHJlY29yZHMucmVtb3ZlKGlkKTtcclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHJlcGxhY2VLZXkoY2FjaGU6IENhY2hlLCBvcDogUmVwbGFjZUtleU9wZXJhdGlvbik6IFBhdGNoUmVzdWx0RGF0YSB7XHJcbiAgICBjb25zdCB7IHR5cGUsIGlkIH0gPSBvcC5yZWNvcmQ7XHJcbiAgICBjb25zdCByZWNvcmRzID0gY2FjaGUucmVjb3Jkcyh0eXBlKTtcclxuICAgIGxldCByZWNvcmQgPSByZWNvcmRzLmdldChpZCk7XHJcbiAgICBpZiAocmVjb3JkKSB7XHJcbiAgICAgIHJlY29yZCA9IGNsb25lKHJlY29yZCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZWNvcmQgPSB7IHR5cGUsIGlkIH07XHJcbiAgICB9XHJcbiAgICBkZWVwU2V0KHJlY29yZCwgWydrZXlzJywgb3Aua2V5XSwgb3AudmFsdWUpO1xyXG4gICAgcmVjb3Jkcy5zZXQoaWQsIHJlY29yZCk7XHJcblxyXG4gICAgaWYgKGNhY2hlLmtleU1hcCkge1xyXG4gICAgICBjYWNoZS5rZXlNYXAucHVzaFJlY29yZChyZWNvcmQpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZWNvcmQ7XHJcbiAgfSxcclxuXHJcbiAgcmVwbGFjZUF0dHJpYnV0ZShjYWNoZTogQ2FjaGUsIG9wOiBSZXBsYWNlQXR0cmlidXRlT3BlcmF0aW9uKTogUGF0Y2hSZXN1bHREYXRhIHtcclxuICAgIGNvbnN0IHsgdHlwZSwgaWQgfSA9IG9wLnJlY29yZDtcclxuICAgIGNvbnN0IHJlY29yZHMgPSBjYWNoZS5yZWNvcmRzKHR5cGUpO1xyXG4gICAgbGV0IHJlY29yZCA9IHJlY29yZHMuZ2V0KGlkKTtcclxuICAgIGlmIChyZWNvcmQpIHtcclxuICAgICAgcmVjb3JkID0gY2xvbmUocmVjb3JkKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlY29yZCA9IHsgdHlwZSwgaWQgfTtcclxuICAgIH1cclxuICAgIGRlZXBTZXQocmVjb3JkLCBbJ2F0dHJpYnV0ZXMnLCBvcC5hdHRyaWJ1dGVdLCBvcC52YWx1ZSk7XHJcbiAgICByZWNvcmRzLnNldChpZCwgcmVjb3JkKTtcclxuICAgIHJldHVybiByZWNvcmQ7XHJcbiAgfSxcclxuXHJcbiAgYWRkVG9SZWxhdGVkUmVjb3JkcyhjYWNoZTogQ2FjaGUsIG9wOiBBZGRUb1JlbGF0ZWRSZWNvcmRzT3BlcmF0aW9uKTogUGF0Y2hSZXN1bHREYXRhIHtcclxuICAgIGNvbnN0IHsgdHlwZSwgaWQgfSA9IG9wLnJlY29yZDtcclxuICAgIGNvbnN0IHJlY29yZHMgPSBjYWNoZS5yZWNvcmRzKHR5cGUpO1xyXG4gICAgbGV0IHJlY29yZCA9IHJlY29yZHMuZ2V0KGlkKTtcclxuICAgIGlmIChyZWNvcmQpIHtcclxuICAgICAgcmVjb3JkID0gY2xvbmUocmVjb3JkKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlY29yZCA9IHsgdHlwZSwgaWQgfTtcclxuICAgIH1cclxuICAgIGNvbnN0IHJlbGF0ZWRSZWNvcmRzID0gZGVlcEdldChyZWNvcmQsIFsncmVsYXRpb25zaGlwcycsIG9wLnJlbGF0aW9uc2hpcCwgJ2RhdGEnXSkgfHwgW107XHJcbiAgICByZWxhdGVkUmVjb3Jkcy5wdXNoKG9wLnJlbGF0ZWRSZWNvcmQpO1xyXG5cclxuICAgIGRlZXBTZXQocmVjb3JkLCBbJ3JlbGF0aW9uc2hpcHMnLCBvcC5yZWxhdGlvbnNoaXAsICdkYXRhJ10sIHJlbGF0ZWRSZWNvcmRzKTtcclxuICAgIHJlY29yZHMuc2V0KGlkLCByZWNvcmQpO1xyXG4gICAgcmV0dXJuIHJlY29yZDtcclxuICB9LFxyXG5cclxuICByZW1vdmVGcm9tUmVsYXRlZFJlY29yZHMoY2FjaGU6IENhY2hlLCBvcDogUmVtb3ZlRnJvbVJlbGF0ZWRSZWNvcmRzT3BlcmF0aW9uKTogUGF0Y2hSZXN1bHREYXRhIHtcclxuICAgIGNvbnN0IHsgdHlwZSwgaWQgfSA9IG9wLnJlY29yZDtcclxuICAgIGNvbnN0IHJlY29yZHMgPSBjYWNoZS5yZWNvcmRzKHR5cGUpO1xyXG4gICAgbGV0IHJlY29yZCA9IHJlY29yZHMuZ2V0KGlkKTtcclxuICAgIGlmIChyZWNvcmQpIHtcclxuICAgICAgcmVjb3JkID0gY2xvbmUocmVjb3JkKTtcclxuICAgICAgbGV0IHJlbGF0ZWRSZWNvcmRzID0gZGVlcEdldChyZWNvcmQsIFsncmVsYXRpb25zaGlwcycsIG9wLnJlbGF0aW9uc2hpcCwgJ2RhdGEnXSkgYXMgUmVjb3JkSWRlbnRpdHlbXTtcclxuICAgICAgaWYgKHJlbGF0ZWRSZWNvcmRzKSB7XHJcbiAgICAgICAgcmVsYXRlZFJlY29yZHMgPSByZWxhdGVkUmVjb3Jkcy5maWx0ZXIociA9PiAhZXF1YWxSZWNvcmRJZGVudGl0aWVzKHIsIG9wLnJlbGF0ZWRSZWNvcmQpKTtcclxuXHJcbiAgICAgICAgaWYgKGRlZXBTZXQocmVjb3JkLCBbJ3JlbGF0aW9uc2hpcHMnLCBvcC5yZWxhdGlvbnNoaXAsICdkYXRhJ10sIHJlbGF0ZWRSZWNvcmRzKSkge1xyXG4gICAgICAgICAgcmVjb3Jkcy5zZXQoaWQsIHJlY29yZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiByZWNvcmQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9LFxyXG5cclxuICByZXBsYWNlUmVsYXRlZFJlY29yZHMoY2FjaGU6IENhY2hlLCBvcDogUmVwbGFjZVJlbGF0ZWRSZWNvcmRzT3BlcmF0aW9uKTogUGF0Y2hSZXN1bHREYXRhIHtcclxuICAgIGNvbnN0IHsgdHlwZSwgaWQgfSA9IG9wLnJlY29yZDtcclxuICAgIGNvbnN0IHJlY29yZHMgPSBjYWNoZS5yZWNvcmRzKHR5cGUpO1xyXG4gICAgbGV0IHJlY29yZCA9IHJlY29yZHMuZ2V0KGlkKTtcclxuICAgIGlmIChyZWNvcmQpIHtcclxuICAgICAgcmVjb3JkID0gY2xvbmUocmVjb3JkKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlY29yZCA9IHsgdHlwZSwgaWQgfTtcclxuICAgIH1cclxuICAgIGlmIChkZWVwU2V0KHJlY29yZCwgWydyZWxhdGlvbnNoaXBzJywgb3AucmVsYXRpb25zaGlwLCAnZGF0YSddLCBvcC5yZWxhdGVkUmVjb3JkcykpIHtcclxuICAgICAgcmVjb3Jkcy5zZXQoaWQsIHJlY29yZCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVjb3JkO1xyXG4gIH0sXHJcblxyXG4gIHJlcGxhY2VSZWxhdGVkUmVjb3JkKGNhY2hlOiBDYWNoZSwgb3A6IFJlcGxhY2VSZWxhdGVkUmVjb3JkT3BlcmF0aW9uKTogUGF0Y2hSZXN1bHREYXRhIHtcclxuICAgIGNvbnN0IHsgdHlwZSwgaWQgfSA9IG9wLnJlY29yZDtcclxuICAgIGNvbnN0IHJlY29yZHMgPSBjYWNoZS5yZWNvcmRzKHR5cGUpO1xyXG4gICAgbGV0IHJlY29yZCA9IHJlY29yZHMuZ2V0KGlkKTtcclxuICAgIGlmIChyZWNvcmQpIHtcclxuICAgICAgcmVjb3JkID0gY2xvbmUocmVjb3JkKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlY29yZCA9IHsgdHlwZSwgaWQgfTtcclxuICAgIH1cclxuICAgIGlmIChkZWVwU2V0KHJlY29yZCwgWydyZWxhdGlvbnNoaXBzJywgb3AucmVsYXRpb25zaGlwLCAnZGF0YSddLCBvcC5yZWxhdGVkUmVjb3JkKSkge1xyXG4gICAgICByZWNvcmRzLnNldChpZCwgcmVjb3JkKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZWNvcmQ7XHJcbiAgfVxyXG59O1xyXG4iXX0=