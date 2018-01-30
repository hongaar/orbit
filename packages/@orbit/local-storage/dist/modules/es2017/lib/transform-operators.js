"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var data_1 = require("@orbit/data");
var utils_1 = require("@orbit/utils");
exports.default = {
    addRecord: function (source, operation) {
        source.putRecord(operation.record);
    },
    replaceRecord: function (source, operation) {
        var updates = operation.record;
        var current = source.getRecord(updates);
        var record = data_1.mergeRecords(current, updates);
        source.putRecord(record);
    },
    removeRecord: function (source, operation) {
        source.removeRecord(operation.record);
    },
    replaceKey: function (source, operation) {
        var record = source.getRecord(operation.record) || data_1.cloneRecordIdentity(operation.record);
        record.keys = record.keys || {};
        record.keys[operation.key] = operation.value;
        source.putRecord(record);
    },
    replaceAttribute: function (source, operation) {
        var record = source.getRecord(operation.record) || data_1.cloneRecordIdentity(operation.record);
        record.attributes = record.attributes || {};
        record.attributes[operation.attribute] = operation.value;
        source.putRecord(record);
    },
    addToRelatedRecords: function (source, operation) {
        var record = source.getRecord(operation.record) || data_1.cloneRecordIdentity(operation.record);
        var relationships = utils_1.deepGet(record, ['relationships', operation.relationship, 'data']);
        if (relationships) {
            relationships.push(operation.relatedRecord);
        }
        else {
            utils_1.deepSet(record, ['relationships', operation.relationship, 'data'], [operation.relatedRecord]);
        }
        source.putRecord(record);
    },
    removeFromRelatedRecords: function (source, operation) {
        var record = source.getRecord(operation.record);
        if (record) {
            var relationships = utils_1.deepGet(record, ['relationships', operation.relationship, 'data']);
            if (relationships) {
                for (var i = 0, l = relationships.length; i < l; i++) {
                    if (data_1.equalRecordIdentities(relationships[i], operation.relatedRecord)) {
                        relationships.splice(i, 1);
                        break;
                    }
                }
                return source.putRecord(record);
            }
        }
    },
    replaceRelatedRecords: function (source, operation) {
        var record = source.getRecord(operation.record) || data_1.cloneRecordIdentity(operation.record);
        utils_1.deepSet(record, ['relationships', operation.relationship, 'data'], operation.relatedRecords);
        source.putRecord(record);
    },
    replaceRelatedRecord: function (source, operation) {
        var record = source.getRecord(operation.record) || data_1.cloneRecordIdentity(operation.record);
        utils_1.deepSet(record, ['relationships', operation.relationship, 'data'], operation.relatedRecord);
        source.putRecord(record);
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3JtLW9wZXJhdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9saWIvdHJhbnNmb3JtLW9wZXJhdG9ycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9DQWNxQjtBQUNyQixzQ0FJc0I7QUFHdEIsa0JBQWU7SUFDYixTQUFTLFlBQUMsTUFBYyxFQUFFLFNBQTZCO1FBQ3JELE1BQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFFRCxhQUFhLFlBQUMsTUFBYyxFQUFFLFNBQWlDO1FBQzdELElBQUksT0FBTyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUM7UUFDL0IsSUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN4QyxJQUFJLE1BQU0sR0FBRyxtQkFBWSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztRQUM1QyxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzNCLENBQUM7SUFFRCxZQUFZLFlBQUMsTUFBYyxFQUFFLFNBQWdDO1FBQzNELE1BQU0sQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFFRCxVQUFVLFlBQUMsTUFBYyxFQUFFLFNBQThCO1FBQ3ZELElBQUksTUFBTSxHQUFXLE1BQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLDBCQUFtQixDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNqRyxNQUFNLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUM7UUFDN0MsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMz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QUVELG9CQUFvQixZQUFDLE1BQWMsRUFBRSxTQUF3QztRQUMzRSxJQUFJLE1BQU0sR0FBVyxNQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSwwQkFBbUIsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDakcsZUFBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLGVBQWUsRUFBRSxTQUFTLENBQUMsWUFBWSxFQUFFLE1BQU0sQ0FBQyxFQUFFLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUM1RixNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzNCLENBQUM7Q0FDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICBtZXJnZVJlY29yZHMsXHJcbiAgY2xvbmVSZWNvcmRJZGVudGl0eSxcclxuICBlcXVhbFJlY29yZElkZW50aXRpZXMsXHJcbiAgUmVjb3JkLCBSZWNvcmRJZGVudGl0eSxcclxuICBBZGRSZWNvcmRPcGVyYXRpb24sXHJcbiAgQWRkVG9SZWxhdGVkUmVjb3Jkc09wZXJhdGlvbixcclxuICBSZXBsYWNlQXR0cmlidXRlT3BlcmF0aW9uLFxyXG4gIFJlbW92ZUZyb21SZWxhdGVkUmVjb3Jkc09wZXJhdGlvbixcclxuICBSZW1vdmVSZWNvcmRPcGVyYXRpb24sXHJcbiAgUmVwbGFjZVJlbGF0ZWRSZWNvcmRzT3BlcmF0aW9uLFxyXG4gIFJlcGxhY2VSZWxhdGVkUmVjb3JkT3BlcmF0aW9uLFxyXG4gIFJlcGxhY2VLZXlPcGVyYXRpb24sXHJcbiAgUmVwbGFjZVJlY29yZE9wZXJhdGlvblxyXG59IGZyb20gJ0BvcmJpdC9kYXRhJztcclxuaW1wb3J0IHtcclxuICBkZWVwR2V0LFxyXG4gIGRlZXBTZXQsXHJcbiAgbWVyZ2VcclxufSBmcm9tICdAb3JiaXQvdXRpbHMnO1xyXG5pbXBvcnQgU291cmNlIGZyb20gJy4uL3NvdXJjZSc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgYWRkUmVjb3JkKHNvdXJjZTogU291cmNlLCBvcGVyYXRpb246IEFkZFJlY29yZE9wZXJhdGlvbikge1xyXG4gICAgc291cmNlLnB1dFJlY29yZChvcGVyYXRpb24ucmVjb3JkKTtcclxuICB9LFxyXG5cclxuICByZXBsYWNlUmVjb3JkKHNvdXJjZTogU291cmNlLCBvcGVyYXRpb246IFJlcGxhY2VSZWNvcmRPcGVyYXRpb24pIHtcclxuICAgIGxldCB1cGRhdGVzID0gb3BlcmF0aW9uLnJlY29yZDtcclxuICAgIGxldCBjdXJyZW50ID0gc291cmNlLmdldFJlY29yZCh1cGRhdGVzKTtcclxuICAgIGxldCByZWNvcmQgPSBtZXJnZVJlY29yZHMoY3VycmVudCwgdXBkYXRlcyk7XHJcbiAgICBzb3VyY2UucHV0UmVjb3JkKHJlY29yZCk7XHJcbiAgfSxcclxuXHJcbiAgcmVtb3ZlUmVjb3JkKHNvdXJjZTogU291cmNlLCBvcGVyYXRpb246IFJlbW92ZVJlY29yZE9wZXJhdGlvbikge1xyXG4gICAgc291cmNlLnJlbW92ZVJlY29yZChvcGVyYXRpb24ucmVjb3JkKTtcclxuICB9LFxyXG5cclxuICByZXBsYWNlS2V5KHNvdXJjZTogU291cmNlLCBvcGVyYXRpb246IFJlcGxhY2VLZXlPcGVyYXRpb24pIHtcclxuICAgIGxldCByZWNvcmQ6IFJlY29yZCA9IHNvdXJjZS5nZXRSZWNvcmQob3BlcmF0aW9uLnJlY29yZCkgfHwgY2xvbmVSZWNvcmRJZGVudGl0eShvcGVyYXRpb24ucmVjb3JkKTtcclxuICAgIHJlY29yZC5rZXlzID0gcmVjb3JkLmtleXMgfHwge307XHJcbiAgICByZWNvcmQua2V5c1tvcGVyYXRpb24ua2V5XSA9IG9wZXJhdGlvbi52YWx1ZTtcclxuICAgIHNvdXJjZS5wdXRSZWNvcmQocmVjb3JkKTtcclxuICB9LFxyXG5cclxuICByZXBsYWNlQXR0cmlidXRlKHNvdXJjZTogU291cmNlLCBvcGVyYXRpb246IFJlcGxhY2VBdHRyaWJ1dGVPcGVyYXRpb24pIHtcclxuICAgIGxldCByZWNvcmQ6IFJlY29yZCA9IHNvdXJjZS5nZXRSZWNvcmQob3BlcmF0aW9uLnJlY29yZCkgfHwgY2xvbmVSZWNvcmRJZGVudGl0eShvcGVyYXRpb24ucmVjb3JkKTtcclxuICAgIHJlY29yZC5hdHRyaWJ1dGVzID0gcmVjb3JkLmF0dHJpYnV0ZXMgfHwge307XHJcbiAgICByZWNvcmQuYXR0cmlidXRlc1tvcGVyYXRpb24uYXR0cmlidXRlXSA9IG9wZXJhdGlvbi52YWx1ZTtcclxuICAgIHNvdXJjZS5wdXRSZWNvcmQocmVjb3JkKTtcclxuICB9LFxyXG5cclxuICBhZGRUb1JlbGF0ZWRSZWNvcmRzKHNvdXJjZTogU291cmNlLCBvcGVyYXRpb246IEFkZFRvUmVsYXRlZFJlY29yZHNPcGVyYXRpb24pIHtcclxuICAgIGxldCByZWNvcmQ6IFJlY29yZCA9IHNvdXJjZS5nZXRSZWNvcmQob3BlcmF0aW9uLnJlY29yZCkgfHwgY2xvbmVSZWNvcmRJZGVudGl0eShvcGVyYXRpb24ucmVjb3JkKTtcclxuICAgIGxldCByZWxhdGlvbnNoaXBzID0gZGVlcEdldChyZWNvcmQsIFsncmVsYXRpb25zaGlwcycsIG9wZXJhdGlvbi5yZWxhdGlvbnNoaXAsICdkYXRhJ10pO1xyXG4gICAgaWYgKHJlbGF0aW9uc2hpcHMpIHtcclxuICAgICAgcmVsYXRpb25zaGlwcy5wdXNoKG9wZXJhdGlvbi5yZWxhdGVkUmVjb3JkKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGRlZXBTZXQocmVjb3JkLCBbJ3JlbGF0aW9uc2hpcHMnLCBvcGVyYXRpb24ucmVsYXRpb25zaGlwLCAnZGF0YSddLCBbb3BlcmF0aW9uLnJlbGF0ZWRSZWNvcmRdKTtcclxuICAgIH1cclxuICAgIHNvdXJjZS5wdXRSZWNvcmQocmVjb3JkKTtcclxuICB9LFxyXG5cclxuICByZW1vdmVGcm9tUmVsYXRlZFJlY29yZHMoc291cmNlOiBTb3VyY2UsIG9wZXJhdGlvbjogUmVtb3ZlRnJvbVJlbGF0ZWRSZWNvcmRzT3BlcmF0aW9uKSB7XHJcbiAgICBsZXQgcmVjb3JkOiBSZWNvcmQgPSBzb3VyY2UuZ2V0UmVjb3JkKG9wZXJhdGlvbi5yZWNvcmQpO1xyXG4gICAgaWYgKHJlY29yZCkge1xyXG4gICAgICBsZXQgcmVsYXRpb25zaGlwcyA9IGRlZXBHZXQocmVjb3JkLCBbJ3JlbGF0aW9uc2hpcHMnLCBvcGVyYXRpb24ucmVsYXRpb25zaGlwLCAnZGF0YSddKSBhcyBSZWNvcmRJZGVudGl0eVtdO1xyXG4gICAgICBpZiAocmVsYXRpb25zaGlwcykge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gcmVsYXRpb25zaGlwcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgIGlmIChlcXVhbFJlY29yZElkZW50aXRpZXMocmVsYXRpb25zaGlwc1tpXSwgb3BlcmF0aW9uLnJlbGF0ZWRSZWNvcmQpKSB7XHJcbiAgICAgICAgICAgIHJlbGF0aW9uc2hpcHMuc3BsaWNlKGksIDEpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHNvdXJjZS5wdXRSZWNvcmQocmVjb3JkKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHJlcGxhY2VSZWxhdGVkUmVjb3Jkcyhzb3VyY2U6IFNvdXJjZSwgb3BlcmF0aW9uOiBSZXBsYWNlUmVsYXRlZFJlY29yZHNPcGVyYXRpb24pIHtcclxuICAgIGxldCByZWNvcmQ6IFJlY29yZCA9IHNvdXJjZS5nZXRSZWNvcmQob3BlcmF0aW9uLnJlY29yZCkgfHwgY2xvbmVSZWNvcmRJZGVudGl0eShvcGVyYXRpb24ucmVjb3JkKTtcclxuICAgIGRlZXBTZXQocmVjb3JkLCBbJ3JlbGF0aW9uc2hpcHMnLCBvcGVyYXRpb24ucmVsYXRpb25zaGlwLCAnZGF0YSddLCBvcGVyYXRpb24ucmVsYXRlZFJlY29yZHMpO1xyXG4gICAgc291cmNlLnB1dFJlY29yZChyZWNvcmQpO1xyXG4gIH0sXHJcblxyXG4gIHJlcGxhY2VSZWxhdGVkUmVjb3JkKHNvdXJjZTogU291cmNlLCBvcGVyYXRpb246IFJlcGxhY2VSZWxhdGVkUmVjb3JkT3BlcmF0aW9uKSB7XHJcbiAgICBsZXQgcmVjb3JkOiBSZWNvcmQgPSBzb3VyY2UuZ2V0UmVjb3JkKG9wZXJhdGlvbi5yZWNvcmQpIHx8IGNsb25lUmVjb3JkSWRlbnRpdHkob3BlcmF0aW9uLnJlY29yZCk7XHJcbiAgICBkZWVwU2V0KHJlY29yZCwgWydyZWxhdGlvbnNoaXBzJywgb3BlcmF0aW9uLnJlbGF0aW9uc2hpcCwgJ2RhdGEnXSwgb3BlcmF0aW9uLnJlbGF0ZWRSZWNvcmQpO1xyXG4gICAgc291cmNlLnB1dFJlY29yZChyZWNvcmQpO1xyXG4gIH1cclxufTtcclxuIl19