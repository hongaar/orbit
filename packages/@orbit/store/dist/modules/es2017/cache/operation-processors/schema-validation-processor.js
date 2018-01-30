"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var operation_processor_1 = require("./operation-processor");
/**
 * An operation processor that ensures that an operation is compatible with
 * its associated schema.
 *
 * @export
 * @class SchemaValidationProcessor
 * @extends {OperationProcessor}
 */
var SchemaValidationProcessor = (function (_super) {
    __extends(SchemaValidationProcessor, _super);
    function SchemaValidationProcessor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SchemaValidationProcessor.prototype.validate = function (operation) {
        switch (operation.op) {
            case 'addRecord':
                return this._recordAdded(operation.record);
            case 'replaceRecord':
                return this._recordReplaced(operation.record);
            case 'removeRecord':
                return this._recordRemoved(operation.record);
            case 'replaceKey':
                return this._keyReplaced(operation.record);
            case 'replaceAttribute':
                return this._attributeReplaced(operation.record);
            case 'addToRelatedRecords':
                return this._relatedRecordAdded(operation.record, operation.relationship, operation.relatedRecord);
            case 'removeFromRelatedRecords':
                return this._relatedRecordRemoved(operation.record, operation.relationship, operation.relatedRecord);
            case 'replaceRelatedRecords':
                return this._relatedRecordsReplaced(operation.record, operation.relationship, operation.relatedRecords);
            case 'replaceRelatedRecord':
                return this._relatedRecordReplaced(operation.record, operation.relationship, operation.relatedRecord);
            default:
                return;
        }
    };
    SchemaValidationProcessor.prototype._recordAdded = function (record) {
        this._validateRecord(record);
    };
    SchemaValidationProcessor.prototype._recordReplaced = function (record) {
        this._validateRecord(record);
    };
    SchemaValidationProcessor.prototype._recordRemoved = function (record) {
        this._validateRecordIdentity(record);
    };
    SchemaValidationProcessor.prototype._keyReplaced = function (record) {
        this._validateRecordIdentity(record);
    };
    SchemaValidationProcessor.prototype._attributeReplaced = function (record) {
        this._validateRecordIdentity(record);
    };
    SchemaValidationProcessor.prototype._relatedRecordAdded = function (record, relationship, relatedRecord) {
        this._validateRecordIdentity(record);
        this._validateRecordIdentity(relatedRecord);
    };
    SchemaValidationProcessor.prototype._relatedRecordRemoved = function (record, relationship, relatedRecord) {
        this._validateRecordIdentity(record);
        this._validateRecordIdentity(relatedRecord);
    };
    SchemaValidationProcessor.prototype._relatedRecordsReplaced = function (record, relationship, relatedRecords) {
        var _this = this;
        this._validateRecordIdentity(record);
        relatedRecords.forEach(function (record) {
            _this._validateRecordIdentity(record);
        });
    };
    SchemaValidationProcessor.prototype._relatedRecordReplaced = function (record, relationship, relatedRecord) {
        this._validateRecordIdentity(record);
        if (relatedRecord) {
            this._validateRecordIdentity(relatedRecord);
        }
    };
    SchemaValidationProcessor.prototype._validateRecord = function (record) {
        this._validateRecordIdentity(record);
    };
    SchemaValidationProcessor.prototype._validateRecordIdentity = function (record) {
        this.cache.schema.getModel(record.type);
    };
    return SchemaValidationProcessor;
}(operation_processor_1.OperationProcessor));
exports.default = SchemaValidationProcessor;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hLXZhbGlkYXRpb24tcHJvY2Vzc29yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NhY2hlL29wZXJhdGlvbi1wcm9jZXNzb3JzL3NjaGVtYS12YWxpZGF0aW9uLXByb2Nlc3Nvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFLQSw2REFBMkQ7QUFFM0Q7Ozs7Ozs7R0FPRztBQUNIO0lBQXVELDZDQUFrQjtJQUF6RTs7SUF3RkEsQ0FBQztJQXZGQyw0Q0FBUSxHQUFSLFVBQVMsU0FBMEI7UUFDakMsTUFBTSxDQUFDLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDckIsS0FBSyxXQUFXO2dCQUNkLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUU3QyxLQUFLLGVBQWU7Z0JBQ2xCLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUVoRCxLQUFLLGNBQWM7Z0JBQ2pCLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUUvQyxLQUFLLFlBQVk7Z0JBQ2YsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBRTdDLEtBQUssa0JBQWtCO2dCQUNyQixNQUFNLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUVuRCxLQUFLLHFCQUFxQjtnQkFDeEIsTUFBTSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxZQUFZLEVBQUUsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBRXJHLEtBQUssMEJBQTBCO2dCQUM3QixNQUFNLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLFlBQVksRUFBRSxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUM7WUFFdkcsS0FBSyx1QkFBdUI7Z0JBQzFCLE1BQU0sQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsWUFBWSxFQUFFLFNBQVMsQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUUxRyxLQUFLLHNCQUFzQjtnQkFDekIsTUFBTSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxZQUFZLEVBQUUsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBRXhHO2dCQUNFLE1BQU0sQ0FBQztRQUNYLENBQUM7SUFDSCxDQUFDO0lBRUQsZ0RBQVksR0FBWixVQUFhLE1BQWM7UUFDekIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBRUQsbURBQWUsR0FBZixVQUFnQixNQUFjO1FBQzVCLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUVELGtEQUFjLEdBQWQsVUFBZSxNQUFzQjtRQUNuQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVELGdEQUFZLEdBQVosVUFBYSxNQUFzQjtRQUNqQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVELHNEQUFrQixHQUFsQixVQUFtQixNQUFzQjtRQUN2QyxJQUFJLENBQUMsdUJBQXVCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVELHVEQUFtQixHQUFuQixVQUFvQixNQUFzQixFQUFFLFlBQW9CLEVBQUUsYUFBNkI7UUFDN0YsSUFBSSxDQUFDLHVCQUF1QixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3JDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBRUQseURBQXFCLEdBQXJCLFVBQXNCLE1BQXNCLEVBQUUsWUFBb0IsRUFBRSxhQUE2QjtRQUMvRixJQUFJLENBQUMsdUJBQXVCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDckMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFFRCwyREFBdUIsR0FBdkIsVUFBd0IsTUFBc0IsRUFBRSxZQUFvQixFQUFFLGNBQWdDO1FBQXRHLGlCQU1DO1FBTEMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRXJDLGNBQWMsQ0FBQyxPQUFPLENBQUMsVUFBQSxNQUFNO1lBQzNCLEtBQUksQ0FBQyx1QkFBdUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN2QyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCwwREFBc0IsR0FBdEIsVUFBdUIsTUFBc0IsRUFBRSxZQUFvQixFQUFFLGFBQW9DO1FBQ3ZHLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVyQyxFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO1lBQ2xCLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUM5QyxDQUFDO0lBQ0gsQ0FBQztJQUVELG1EQUFlLEdBQWYsVUFBZ0IsTUFBYztRQUM1QixJQUFJLENBQUMsdUJBQXVCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVELDJEQUF1QixHQUF2QixVQUF3QixNQUFzQjtRQUM1QyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFDSCxnQ0FBQztBQUFELENBQUMsQUF4RkQsQ0FBdUQsd0NBQWtCLEdBd0Z4RSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XHJcbiAgUmVjb3JkLFxyXG4gIFJlY29yZElkZW50aXR5LFxyXG4gIFJlY29yZE9wZXJhdGlvbixcclxufSBmcm9tICdAb3JiaXQvZGF0YSc7XHJcbmltcG9ydCB7IE9wZXJhdGlvblByb2Nlc3NvciB9IGZyb20gJy4vb3BlcmF0aW9uLXByb2Nlc3Nvcic7XHJcblxyXG4vKipcclxuICogQW4gb3BlcmF0aW9uIHByb2Nlc3NvciB0aGF0IGVuc3VyZXMgdGhhdCBhbiBvcGVyYXRpb24gaXMgY29tcGF0aWJsZSB3aXRoXHJcbiAqIGl0cyBhc3NvY2lhdGVkIHNjaGVtYS5cclxuICpcclxuICogQGV4cG9ydFxyXG4gKiBAY2xhc3MgU2NoZW1hVmFsaWRhdGlvblByb2Nlc3NvclxyXG4gKiBAZXh0ZW5kcyB7T3BlcmF0aW9uUHJvY2Vzc29yfVxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2NoZW1hVmFsaWRhdGlvblByb2Nlc3NvciBleHRlbmRzIE9wZXJhdGlvblByb2Nlc3NvciB7XHJcbiAgdmFsaWRhdGUob3BlcmF0aW9uOiBSZWNvcmRPcGVyYXRpb24pIHtcclxuICAgIHN3aXRjaCAob3BlcmF0aW9uLm9wKSB7XHJcbiAgICAgIGNhc2UgJ2FkZFJlY29yZCc6XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlY29yZEFkZGVkKG9wZXJhdGlvbi5yZWNvcmQpO1xyXG5cclxuICAgICAgY2FzZSAncmVwbGFjZVJlY29yZCc6XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlY29yZFJlcGxhY2VkKG9wZXJhdGlvbi5yZWNvcmQpO1xyXG5cclxuICAgICAgY2FzZSAncmVtb3ZlUmVjb3JkJzpcclxuICAgICAgICByZXR1cm4gdGhpcy5fcmVjb3JkUmVtb3ZlZChvcGVyYXRpb24ucmVjb3JkKTtcclxuXHJcbiAgICAgIGNhc2UgJ3JlcGxhY2VLZXknOlxyXG4gICAgICAgIHJldHVybiB0aGlzLl9rZXlSZXBsYWNlZChvcGVyYXRpb24ucmVjb3JkKTtcclxuXHJcbiAgICAgIGNhc2UgJ3JlcGxhY2VBdHRyaWJ1dGUnOlxyXG4gICAgICAgIHJldHVybiB0aGlzLl9hdHRyaWJ1dGVSZXBsYWNlZChvcGVyYXRpb24ucmVjb3JkKTtcclxuXHJcbiAgICAgIGNhc2UgJ2FkZFRvUmVsYXRlZFJlY29yZHMnOlxyXG4gICAgICAgIHJldHVybiB0aGlzLl9yZWxhdGVkUmVjb3JkQWRkZWQob3BlcmF0aW9uLnJlY29yZCwgb3BlcmF0aW9uLnJlbGF0aW9uc2hpcCwgb3BlcmF0aW9uLnJlbGF0ZWRSZWNvcmQpO1xyXG5cclxuICAgICAgY2FzZSAncmVtb3ZlRnJvbVJlbGF0ZWRSZWNvcmRzJzpcclxuICAgICAgICByZXR1cm4gdGhpcy5fcmVsYXRlZFJlY29yZFJlbW92ZWQob3BlcmF0aW9uLnJlY29yZCwgb3BlcmF0aW9uLnJlbGF0aW9uc2hpcCwgb3BlcmF0aW9uLnJlbGF0ZWRSZWNvcmQpO1xyXG5cclxuICAgICAgY2FzZSAncmVwbGFjZVJlbGF0ZWRSZWNvcmRzJzpcclxuICAgICAgICByZXR1cm4gdGhpcy5fcmVsYXRlZFJlY29yZHNSZXBsYWNlZChvcGVyYXRpb24ucmVjb3JkLCBvcGVyYXRpb24ucmVsYXRpb25zaGlwLCBvcGVyYXRpb24ucmVsYXRlZFJlY29yZHMpO1xyXG5cclxuICAgICAgY2FzZSAncmVwbGFjZVJlbGF0ZWRSZWNvcmQnOlxyXG4gICAgICAgIHJldHVybiB0aGlzLl9yZWxhdGVkUmVjb3JkUmVwbGFjZWQob3BlcmF0aW9uLnJlY29yZCwgb3BlcmF0aW9uLnJlbGF0aW9uc2hpcCwgb3BlcmF0aW9uLnJlbGF0ZWRSZWNvcmQpO1xyXG5cclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBfcmVjb3JkQWRkZWQocmVjb3JkOiBSZWNvcmQpIHtcclxuICAgIHRoaXMuX3ZhbGlkYXRlUmVjb3JkKHJlY29yZCk7XHJcbiAgfVxyXG5cclxuICBfcmVjb3JkUmVwbGFjZWQocmVjb3JkOiBSZWNvcmQpIHtcclxuICAgIHRoaXMuX3ZhbGlkYXRlUmVjb3JkKHJlY29yZCk7XHJcbiAgfVxyXG5cclxuICBfcmVjb3JkUmVtb3ZlZChyZWNvcmQ6IFJlY29yZElkZW50aXR5KSB7XHJcbiAgICB0aGlzLl92YWxpZGF0ZVJlY29yZElkZW50aXR5KHJlY29yZCk7XHJcbiAgfVxyXG5cclxuICBfa2V5UmVwbGFjZWQocmVjb3JkOiBSZWNvcmRJZGVudGl0eSkge1xyXG4gICAgdGhpcy5fdmFsaWRhdGVSZWNvcmRJZGVudGl0eShyZWNvcmQpO1xyXG4gIH1cclxuXHJcbiAgX2F0dHJpYnV0ZVJlcGxhY2VkKHJlY29yZDogUmVjb3JkSWRlbnRpdHkpIHtcclxuICAgIHRoaXMuX3ZhbGlkYXRlUmVjb3JkSWRlbnRpdHkocmVjb3JkKTtcclxuICB9XHJcblxyXG4gIF9yZWxhdGVkUmVjb3JkQWRkZWQocmVjb3JkOiBSZWNvcmRJZGVudGl0eSwgcmVsYXRpb25zaGlwOiBzdHJpbmcsIHJlbGF0ZWRSZWNvcmQ6IFJlY29yZElkZW50aXR5KSB7XHJcbiAgICB0aGlzLl92YWxpZGF0ZVJlY29yZElkZW50aXR5KHJlY29yZCk7XHJcbiAgICB0aGlzLl92YWxpZGF0ZVJlY29yZElkZW50aXR5KHJlbGF0ZWRSZWNvcmQpO1xyXG4gIH1cclxuXHJcbiAgX3JlbGF0ZWRSZWNvcmRSZW1vdmVkKHJlY29yZDogUmVjb3JkSWRlbnRpdHksIHJlbGF0aW9uc2hpcDogc3RyaW5nLCByZWxhdGVkUmVjb3JkOiBSZWNvcmRJZGVudGl0eSkge1xyXG4gICAgdGhpcy5fdmFsaWRhdGVSZWNvcmRJZGVudGl0eShyZWNvcmQpO1xyXG4gICAgdGhpcy5fdmFsaWRhdGVSZWNvcmRJZGVudGl0eShyZWxhdGVkUmVjb3JkKTtcclxuICB9XHJcblxyXG4gIF9yZWxhdGVkUmVjb3Jkc1JlcGxhY2VkKHJlY29yZDogUmVjb3JkSWRlbnRpdHksIHJlbGF0aW9uc2hpcDogc3RyaW5nLCByZWxhdGVkUmVjb3JkczogUmVjb3JkSWRlbnRpdHlbXSkge1xyXG4gICAgdGhpcy5fdmFsaWRhdGVSZWNvcmRJZGVudGl0eShyZWNvcmQpO1xyXG5cclxuICAgIHJlbGF0ZWRSZWNvcmRzLmZvckVhY2gocmVjb3JkID0+IHtcclxuICAgICAgdGhpcy5fdmFsaWRhdGVSZWNvcmRJZGVudGl0eShyZWNvcmQpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBfcmVsYXRlZFJlY29yZFJlcGxhY2VkKHJlY29yZDogUmVjb3JkSWRlbnRpdHksIHJlbGF0aW9uc2hpcDogc3RyaW5nLCByZWxhdGVkUmVjb3JkOiBSZWNvcmRJZGVudGl0eSB8IG51bGwpIHtcclxuICAgIHRoaXMuX3ZhbGlkYXRlUmVjb3JkSWRlbnRpdHkocmVjb3JkKTtcclxuXHJcbiAgICBpZiAocmVsYXRlZFJlY29yZCkge1xyXG4gICAgICB0aGlzLl92YWxpZGF0ZVJlY29yZElkZW50aXR5KHJlbGF0ZWRSZWNvcmQpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgX3ZhbGlkYXRlUmVjb3JkKHJlY29yZDogUmVjb3JkKSB7XHJcbiAgICB0aGlzLl92YWxpZGF0ZVJlY29yZElkZW50aXR5KHJlY29yZCk7XHJcbiAgfVxyXG5cclxuICBfdmFsaWRhdGVSZWNvcmRJZGVudGl0eShyZWNvcmQ6IFJlY29yZElkZW50aXR5KSB7XHJcbiAgICB0aGlzLmNhY2hlLnNjaGVtYS5nZXRNb2RlbChyZWNvcmQudHlwZSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==