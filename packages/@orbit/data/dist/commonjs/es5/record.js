"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@orbit/utils");
function cloneRecordIdentity(identity) {
    var type = identity.type,
        id = identity.id;
    return { type: type, id: id };
}
exports.cloneRecordIdentity = cloneRecordIdentity;
function equalRecordIdentities(record1, record2) {
    return utils_1.isNone(record1) && utils_1.isNone(record2) || utils_1.isObject(record1) && utils_1.isObject(record2) && record1.type === record2.type && record1.id === record2.id;
}
exports.equalRecordIdentities = equalRecordIdentities;
function mergeRecords(current, updates) {
    if (current) {
        var record_1 = cloneRecordIdentity(current);
        ['attributes', 'keys', 'relationships'].forEach(function (grouping) {
            if (current[grouping] && updates[grouping]) {
                record_1[grouping] = utils_1.merge({}, current[grouping], updates[grouping]);
            } else if (current[grouping]) {
                record_1[grouping] = utils_1.merge({}, current[grouping]);
            } else if (updates[grouping]) {
                record_1[grouping] = utils_1.merge({}, updates[grouping]);
            }
        });
        return record_1;
    } else {
        return updates;
    }
}
exports.mergeRecords = mergeRecords;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjb3JkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3JjL3JlY29yZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxzQkFBNkQ7QUEyQjdELDZCQUFvQyxBQUF3QixVQUNsRDtRQUFBLGdCQUFJO1FBQUUsY0FBRSxBQUFjLEFBQzlCLEFBQU07V0FBQyxFQUFFLEFBQUksTUFBQSxNQUFFLEFBQUUsSUFBQSxBQUFFLEFBQUMsQUFDdEIsQUFBQzs7QUFIRCw4QkFHQztBQUVELCtCQUFzQyxBQUF1QixTQUFFLEFBQXVCLFNBQ3BGLEFBQU07V0FBRSxRQUFNLE9BQUMsQUFBTyxBQUFDLFlBQUksUUFBTSxPQUFDLEFBQU8sQUFBQyxBQUFDLEFBQ3BDLEFBREEsWUFDQyxRQUFRLFNBQUMsQUFBTyxBQUFDLFlBQUksUUFBUSxTQUFDLEFBQU8sQUFBQyxZQUN0QyxBQUFPLFFBQUMsQUFBSSxTQUFLLEFBQU8sUUFBQyxBQUFJLFFBQzdCLEFBQU8sUUFBQyxBQUFFLE9BQUssQUFBTyxRQUFDLEFBQUUsQUFBQyxBQUFDLEFBQ3JDLEFBQUM7O0FBTEQsZ0NBS0M7QUFFRCxzQkFBNkIsQUFBc0IsU0FBRSxBQUFlLFNBQ2xFLEFBQUUsQUFBQztRQUFDLEFBQU8sQUFBQyxTQUFDLEFBQUMsQUFDWjtZQUFJLEFBQU0sV0FBRyxBQUFtQixvQkFBQyxBQUFPLEFBQUMsQUFBQyxBQUUxQztTQUFDLEFBQVksY0FBRSxBQUFNLFFBQUUsQUFBZSxBQUFDLGlCQUFDLEFBQU8sUUFBQyxVQUFBLEFBQVEsVUFDdEQsQUFBRSxBQUFDO2dCQUFDLEFBQU8sUUFBQyxBQUFRLEFBQUMsYUFBSSxBQUFPLFFBQUMsQUFBUSxBQUFDLEFBQUMsV0FBQyxBQUFDLEFBQzNDLEFBQU07eUJBQUMsQUFBUSxBQUFDLFlBQUcsUUFBSyxNQUFDLEFBQUUsSUFBRSxBQUFPLFFBQUMsQUFBUSxBQUFDLFdBQUUsQUFBTyxRQUFDLEFBQVEsQUFBQyxBQUFDLEFBQUMsQUFDckUsQUFBQyxBQUFDLEFBQUk7dUJBQUssQUFBTyxRQUFDLEFBQVEsQUFBQyxBQUFDLFdBQUMsQUFBQyxBQUM3QixBQUFNO3lCQUFDLEFBQVEsQUFBQyxZQUFHLFFBQUssTUFBQyxBQUFFLElBQUUsQUFBTyxRQUFDLEFBQVEsQUFBQyxBQUFDLEFBQUMsQUFDbEQsQUFBQyxBQUFDLEFBQUk7QUFGQyxBQUFFLEFBQUMsbUJBRUgsQUFBRSxBQUFDLElBQUMsQUFBTyxRQUFDLEFBQVEsQUFBQyxBQUFDLFdBQUMsQUFBQyxBQUM3QixBQUFNO3lCQUFDLEFBQVEsQUFBQyxZQUFHLFFBQUssTUFBQyxBQUFFLElBQUUsQUFBTyxRQUFDLEFBQVEsQUFBQyxBQUFDLEFBQUMsQUFDbEQsQUFBQyxBQUNIO0FBQUMsQUFBQyxBQUFDO0FBRUgsQUFBTTtlQUFDLEFBQU0sQUFBQyxBQUNoQixBQUFDLEFBQUMsQUFBSTtXQUFDLEFBQUMsQUFDTixBQUFNO2VBQUMsQUFBTyxBQUFDLEFBQ2pCLEFBQUMsQUFDSDtBQUFDOztBQWxCRCx1QkFrQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaWN0LCBpc09iamVjdCwgaXNOb25lLCBtZXJnZSB9IGZyb20gJ0BvcmJpdC91dGlscyc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFJlY29yZElkZW50aXR5IHtcclxuICB0eXBlOiBzdHJpbmc7XHJcbiAgaWQ6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBSZWNvcmRIYXNPbmVSZWxhdGlvbnNoaXAge1xyXG4gIGRhdGE6IFJlY29yZElkZW50aXR5IHwgbnVsbDtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBSZWNvcmRIYXNNYW55UmVsYXRpb25zaGlwIHtcclxuICBkYXRhOiBSZWNvcmRJZGVudGl0eVtdO1xyXG59XHJcblxyXG5leHBvcnQgdHlwZSBSZWNvcmRSZWxhdGlvbnNoaXAgPSBSZWNvcmRIYXNPbmVSZWxhdGlvbnNoaXAgfCBSZWNvcmRIYXNNYW55UmVsYXRpb25zaGlwO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBSZWNvcmQgZXh0ZW5kcyBSZWNvcmRJZGVudGl0eSB7XHJcbiAga2V5cz86IERpY3Q8c3RyaW5nPjtcclxuICBhdHRyaWJ1dGVzPzogRGljdDxhbnk+O1xyXG4gIHJlbGF0aW9uc2hpcHM/OiBEaWN0PFJlY29yZFJlbGF0aW9uc2hpcD47XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgUmVjb3JkSW5pdGlhbGl6ZXIge1xyXG4gIGluaXRpYWxpemVSZWNvcmQocmVjb3JkOiBSZWNvcmQpOiB2b2lkO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY2xvbmVSZWNvcmRJZGVudGl0eShpZGVudGl0eTogUmVjb3JkSWRlbnRpdHkpOiBSZWNvcmRJZGVudGl0eSB7XHJcbiAgY29uc3QgeyB0eXBlLCBpZCB9ID0gaWRlbnRpdHk7XHJcbiAgcmV0dXJuIHsgdHlwZSwgaWQgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGVxdWFsUmVjb3JkSWRlbnRpdGllcyhyZWNvcmQxOiBSZWNvcmRJZGVudGl0eSwgcmVjb3JkMjogUmVjb3JkSWRlbnRpdHkpOiBib29sZWFuIHtcclxuICByZXR1cm4gKGlzTm9uZShyZWNvcmQxKSAmJiBpc05vbmUocmVjb3JkMikpIHx8XHJcbiAgICAgICAgIChpc09iamVjdChyZWNvcmQxKSAmJiBpc09iamVjdChyZWNvcmQyKSAmJlxyXG4gICAgICAgICAgcmVjb3JkMS50eXBlID09PSByZWNvcmQyLnR5cGUgJiZcclxuICAgICAgICAgIHJlY29yZDEuaWQgPT09IHJlY29yZDIuaWQpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VSZWNvcmRzKGN1cnJlbnQ6IFJlY29yZCB8IG51bGwsIHVwZGF0ZXM6IFJlY29yZCk6IFJlY29yZCB7XHJcbiAgaWYgKGN1cnJlbnQpIHtcclxuICAgIGxldCByZWNvcmQgPSBjbG9uZVJlY29yZElkZW50aXR5KGN1cnJlbnQpO1xyXG5cclxuICAgIFsnYXR0cmlidXRlcycsICdrZXlzJywgJ3JlbGF0aW9uc2hpcHMnXS5mb3JFYWNoKGdyb3VwaW5nID0+IHtcclxuICAgICAgaWYgKGN1cnJlbnRbZ3JvdXBpbmddICYmIHVwZGF0ZXNbZ3JvdXBpbmddKSB7XHJcbiAgICAgICAgcmVjb3JkW2dyb3VwaW5nXSA9IG1lcmdlKHt9LCBjdXJyZW50W2dyb3VwaW5nXSwgdXBkYXRlc1tncm91cGluZ10pO1xyXG4gICAgICB9IGVsc2UgaWYgKGN1cnJlbnRbZ3JvdXBpbmddKSB7XHJcbiAgICAgICAgcmVjb3JkW2dyb3VwaW5nXSA9IG1lcmdlKHt9LCBjdXJyZW50W2dyb3VwaW5nXSk7XHJcbiAgICAgIH0gZWxzZSBpZiAodXBkYXRlc1tncm91cGluZ10pIHtcclxuICAgICAgICByZWNvcmRbZ3JvdXBpbmddID0gbWVyZ2Uoe30sIHVwZGF0ZXNbZ3JvdXBpbmddKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHJlY29yZDtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIHVwZGF0ZXM7XHJcbiAgfVxyXG59XHJcbiJdfQ==