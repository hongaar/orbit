"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var data_1 = require("@orbit/data");
var utils_1 = require("@orbit/utils");
exports.default = {
    addRecord: function (source, operation) {
        source.putRecord(operation.record);
    },
    replaceRecord: function (source, operation) {
        source.putRecord(operation.record);
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
        } else {
            utils_1.deepSet(record, ['relationships', operation.relationship, 'data'], [operation.relatedRecord]);
        }
        source.putRecord(record);
    },
    removeFromRelatedRecords: function (source, operation) {
        var record = source.getRecord(operation.record);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3JtLW9wZXJhdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9saWIvdHJhbnNmb3JtLW9wZXJhdG9ycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxxQkFhcUI7QUFDckIsc0JBR3NCO0FBR3RCO3lCQUNZLEFBQWMsUUFBRSxBQUE2QixXQUNyRCxBQUFNO2VBQUMsQUFBUyxVQUFDLEFBQVMsVUFBQyxBQUFNLEFBQUMsQUFBQyxBQUNyQyxBQUFDO0FBRUQsQUFBYTs2QkFBQyxBQUFjLFFBQUUsQUFBaUMsV0FDN0QsQUFBTTtlQUFDLEFBQVMsVUFBQyxBQUFTLFVBQUMsQUFBTSxBQUFDLEFBQUMsQUFDckMsQUFBQztBQUVELEFBQVk7NEJBQUMsQUFBYyxRQUFFLEFBQWdDLFdBQzNELEFBQU07ZUFBQyxBQUFZLGFBQUMsQUFBUyxVQUFDLEFBQU0sQUFBQyxBQUFDLEFBQ3hDLEFBQUM7QUFFRCxBQUFVOzBCQUFDLEFBQWMsUUFBRSxBQUE4QixXQUN2RDtZQUFJLEFBQU0sU0FBVyxBQUFNLE9BQUMsQUFBUyxVQUFDLEFBQVMsVUFBQyxBQUFNLEFBQUMsV0FBSSxPQUFtQixvQkFBQyxBQUFTLFVBQUMsQUFBTSxBQUFDLEFBQUMsQUFDakcsQUFBTTtlQUFDLEFBQUksT0FBRyxBQUFNLE9BQUMsQUFBSSxRQUFJLEFBQUUsQUFBQyxBQUNoQyxBQUFNO2VBQUMsQUFBSSxLQUFDLEFBQVMsVUFBQyxBQUFHLEFBQUMsT0FBRyxBQUFTLFVBQUMsQUFBSyxBQUFDLEFBQzdDLEFBQU07ZUFBQyxBQUFTLFVBQUMsQUFBTSxBQUFDLEFBQUMsQUFDM0IsQUFBQztBQUVELEFBQWdCO2dDQUFDLEFBQWMsUUFBRSxBQUFvQyxXQUNuRTtZQUFJLEFBQU0sU0FBVyxBQUFNLE9BQUMsQUFBUyxVQUFDLEFBQVMsVUFBQyxBQUFNLEFBQUMsV0FBSSxPQUFtQixvQkFBQyxBQUFTLFVBQUMsQUFBTSxBQUFDLEFBQUMsQUFDakcsQUFBTTtl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QUFBTSxBQUFDLFNBQUUsQUFBUyxVQUFDLEFBQWEsQUFBQyxBQUFDLEFBQzVGLEFBQU07ZUFBQyxBQUFTLFVBQUMsQUFBTSxBQUFDLEFBQUMsQUFDM0IsQUFBQyxBQUNGLEFBQUM7QUEvRGE7QUFDYixBQUFTIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICBjbG9uZVJlY29yZElkZW50aXR5LFxyXG4gIGVxdWFsUmVjb3JkSWRlbnRpdGllcyxcclxuICBSZWNvcmQsIFJlY29yZElkZW50aXR5LFxyXG4gIEFkZFJlY29yZE9wZXJhdGlvbixcclxuICBBZGRUb1JlbGF0ZWRSZWNvcmRzT3BlcmF0aW9uLFxyXG4gIFJlcGxhY2VBdHRyaWJ1dGVPcGVyYXRpb24sXHJcbiAgUmVtb3ZlRnJvbVJlbGF0ZWRSZWNvcmRzT3BlcmF0aW9uLFxyXG4gIFJlbW92ZVJlY29yZE9wZXJhdGlvbixcclxuICBSZXBsYWNlUmVsYXRlZFJlY29yZHNPcGVyYXRpb24sXHJcbiAgUmVwbGFjZVJlbGF0ZWRSZWNvcmRPcGVyYXRpb24sXHJcbiAgUmVwbGFjZUtleU9wZXJhdGlvbixcclxuICBSZXBsYWNlUmVjb3JkT3BlcmF0aW9uXHJcbn0gZnJvbSAnQG9yYml0L2RhdGEnO1xyXG5pbXBvcnQge1xyXG4gIGRlZXBHZXQsXHJcbiAgZGVlcFNldFxyXG59IGZyb20gJ0BvcmJpdC91dGlscyc7XHJcbmltcG9ydCBTb3VyY2UgZnJvbSAnLi4vc291cmNlJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBhZGRSZWNvcmQoc291cmNlOiBTb3VyY2UsIG9wZXJhdGlvbjogQWRkUmVjb3JkT3BlcmF0aW9uKSB7XHJcbiAgICBzb3VyY2UucHV0UmVjb3JkKG9wZXJhdGlvbi5yZWNvcmQpO1xyXG4gIH0sXHJcblxyXG4gIHJlcGxhY2VSZWNvcmQoc291cmNlOiBTb3VyY2UsIG9wZXJhdGlvbjogUmVwbGFjZVJlY29yZE9wZXJhdGlvbikge1xyXG4gICAgc291cmNlLnB1dFJlY29yZChvcGVyYXRpb24ucmVjb3JkKTtcclxuICB9LFxyXG5cclxuICByZW1vdmVSZWNvcmQoc291cmNlOiBTb3VyY2UsIG9wZXJhdGlvbjogUmVtb3ZlUmVjb3JkT3BlcmF0aW9uKSB7XHJcbiAgICBzb3VyY2UucmVtb3ZlUmVjb3JkKG9wZXJhdGlvbi5yZWNvcmQpO1xyXG4gIH0sXHJcblxyXG4gIHJlcGxhY2VLZXkoc291cmNlOiBTb3VyY2UsIG9wZXJhdGlvbjogUmVwbGFjZUtleU9wZXJhdGlvbikge1xyXG4gICAgbGV0IHJlY29yZDogUmVjb3JkID0gc291cmNlLmdldFJlY29yZChvcGVyYXRpb24ucmVjb3JkKSB8fCBjbG9uZVJlY29yZElkZW50aXR5KG9wZXJhdGlvbi5yZWNvcmQpO1xyXG4gICAgcmVjb3JkLmtleXMgPSByZWNvcmQua2V5cyB8fCB7fTtcclxuICAgIHJlY29yZC5rZXlzW29wZXJhdGlvbi5rZXldID0gb3BlcmF0aW9uLnZhbHVlO1xyXG4gICAgc291cmNlLnB1dFJlY29yZChyZWNvcmQpO1xyXG4gIH0sXHJcblxyXG4gIHJlcGxhY2VBdHRyaWJ1dGUoc291cmNlOiBTb3VyY2UsIG9wZXJhdGlvbjogUmVwbGFjZUF0dHJpYnV0ZU9wZXJhdGlvbikge1xyXG4gICAgbGV0IHJlY29yZDogUmVjb3JkID0gc291cmNlLmdldFJlY29yZChvcGVyYXRpb24ucmVjb3JkKSB8fCBjbG9uZVJlY29yZElkZW50aXR5KG9wZXJhdGlvbi5yZWNvcmQpO1xyXG4gICAgcmVjb3JkLmF0dHJpYnV0ZXMgPSByZWNvcmQuYXR0cmlidXRlcyB8fCB7fTtcclxuICAgIHJlY29yZC5hdHRyaWJ1dGVzW29wZXJhdGlvbi5hdHRyaWJ1dGVdID0gb3BlcmF0aW9uLnZhbHVlO1xyXG4gICAgc291cmNlLnB1dFJlY29yZChyZWNvcmQpO1xyXG4gIH0sXHJcblxyXG4gIGFkZFRvUmVsYXRlZFJlY29yZHMoc291cmNlOiBTb3VyY2UsIG9wZXJhdGlvbjogQWRkVG9SZWxhdGVkUmVjb3Jkc09wZXJhdGlvbikge1xyXG4gICAgbGV0IHJlY29yZDogUmVjb3JkID0gc291cmNlLmdldFJlY29yZChvcGVyYXRpb24ucmVjb3JkKSB8fCBjbG9uZVJlY29yZElkZW50aXR5KG9wZXJhdGlvbi5yZWNvcmQpO1xyXG4gICAgbGV0IHJlbGF0aW9uc2hpcHMgPSBkZWVwR2V0KHJlY29yZCwgWydyZWxhdGlvbnNoaXBzJywgb3BlcmF0aW9uLnJlbGF0aW9uc2hpcCwgJ2RhdGEnXSk7XHJcbiAgICBpZiAocmVsYXRpb25zaGlwcykge1xyXG4gICAgICByZWxhdGlvbnNoaXBzLnB1c2gob3BlcmF0aW9uLnJlbGF0ZWRSZWNvcmQpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZGVlcFNldChyZWNvcmQsIFsncmVsYXRpb25zaGlwcycsIG9wZXJhdGlvbi5yZWxhdGlvbnNoaXAsICdkYXRhJ10sIFtvcGVyYXRpb24ucmVsYXRlZFJlY29yZF0pO1xyXG4gICAgfVxyXG4gICAgc291cmNlLnB1dFJlY29yZChyZWNvcmQpO1xyXG4gIH0sXHJcblxyXG4gIHJlbW92ZUZyb21SZWxhdGVkUmVjb3Jkcyhzb3VyY2U6IFNvdXJjZSwgb3BlcmF0aW9uOiBSZW1vdmVGcm9tUmVsYXRlZFJlY29yZHNPcGVyYXRpb24pIHtcclxuICAgIGxldCByZWNvcmQ6IFJlY29yZCA9IHNvdXJjZS5nZXRSZWNvcmQob3BlcmF0aW9uLnJlY29yZCk7XHJcbiAgICBsZXQgcmVsYXRpb25zaGlwcyA9IGRlZXBHZXQocmVjb3JkLCBbJ3JlbGF0aW9uc2hpcHMnLCBvcGVyYXRpb24ucmVsYXRpb25zaGlwLCAnZGF0YSddKSBhcyBSZWNvcmRJZGVudGl0eVtdO1xyXG4gICAgaWYgKHJlbGF0aW9uc2hpcHMpIHtcclxuICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSByZWxhdGlvbnNoaXBzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgIGlmIChlcXVhbFJlY29yZElkZW50aXRpZXMocmVsYXRpb25zaGlwc1tpXSwgb3BlcmF0aW9uLnJlbGF0ZWRSZWNvcmQpKSB7XHJcbiAgICAgICAgICByZWxhdGlvbnNoaXBzLnNwbGljZShpLCAxKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gc291cmNlLnB1dFJlY29yZChyZWNvcmQpO1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHJlcGxhY2VSZWxhdGVkUmVjb3Jkcyhzb3VyY2U6IFNvdXJjZSwgb3BlcmF0aW9uOiBSZXBsYWNlUmVsYXRlZFJlY29yZHNPcGVyYXRpb24pIHtcclxuICAgIGxldCByZWNvcmQ6IFJlY29yZCA9IHNvdXJjZS5nZXRSZWNvcmQob3BlcmF0aW9uLnJlY29yZCkgfHwgY2xvbmVSZWNvcmRJZGVudGl0eShvcGVyYXRpb24ucmVjb3JkKTtcclxuICAgIGRlZXBTZXQocmVjb3JkLCBbJ3JlbGF0aW9uc2hpcHMnLCBvcGVyYXRpb24ucmVsYXRpb25zaGlwLCAnZGF0YSddLCBvcGVyYXRpb24ucmVsYXRlZFJlY29yZHMpO1xyXG4gICAgc291cmNlLnB1dFJlY29yZChyZWNvcmQpO1xyXG4gIH0sXHJcblxyXG4gIHJlcGxhY2VSZWxhdGVkUmVjb3JkKHNvdXJjZTogU291cmNlLCBvcGVyYXRpb246IFJlcGxhY2VSZWxhdGVkUmVjb3JkT3BlcmF0aW9uKSB7XHJcbiAgICBsZXQgcmVjb3JkOiBSZWNvcmQgPSBzb3VyY2UuZ2V0UmVjb3JkKG9wZXJhdGlvbi5yZWNvcmQpIHx8IGNsb25lUmVjb3JkSWRlbnRpdHkob3BlcmF0aW9uLnJlY29yZCk7XHJcbiAgICBkZWVwU2V0KHJlY29yZCwgWydyZWxhdGlvbnNoaXBzJywgb3BlcmF0aW9uLnJlbGF0aW9uc2hpcCwgJ2RhdGEnXSwgb3BlcmF0aW9uLnJlbGF0ZWRSZWNvcmQpO1xyXG4gICAgc291cmNlLnB1dFJlY29yZChyZWNvcmQpO1xyXG4gIH1cclxufTtcclxuIl19