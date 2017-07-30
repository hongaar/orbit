"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var TransformBuilder = function () {
    function TransformBuilder(settings) {
        if (settings === void 0) {
            settings = {};
        }
        this._recordInitializer = settings.recordInitializer;
    }
    Object.defineProperty(TransformBuilder.prototype, "recordInitializer", {
        get: function () {
            return this._recordInitializer;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Instantiate a new `addRecord` operation.
     *
     * @param {Record} record
     * @returns {AddRecordOperation}
     */
    TransformBuilder.prototype.addRecord = function (record) {
        if (this._recordInitializer) {
            this._recordInitializer.initializeRecord(record);
        }
        return { op: 'addRecord', record: record };
    };
    /**
     * Instantiate a new `replaceRecord` operation.
     *
     * @param {Record} record
     * @returns {ReplaceRecordOperation}
     */
    TransformBuilder.prototype.replaceRecord = function (record) {
        return { op: 'replaceRecord', record: record };
    };
    /**
     * Instantiate a new `removeRecord` operation.
     *
     * @param {RecordIdentity} record
     * @returns {RemoveRecordOperation}
     */
    TransformBuilder.prototype.removeRecord = function (record) {
        return { op: 'removeRecord', record: record };
    };
    /**
     * Instantiate a new `replaceKey` operation.
     *
     * @param {RecordIdentity} record
     * @param {string} key
     * @param {string} value
     * @returns {ReplaceKeyOperation}
     */
    TransformBuilder.prototype.replaceKey = function (record, key, value) {
        return { op: 'replaceKey', record: record, key: key, value: value };
    };
    /**
     * Instantiate a new `replaceAttribute` operation.
     *
     * @param {RecordIdentity} record
     * @param {string} attribute
     * @param {*} value
     * @returns {ReplaceAttributeOperation}
     */
    TransformBuilder.prototype.replaceAttribute = function (record, attribute, value) {
        return { op: 'replaceAttribute', record: record, attribute: attribute, value: value };
    };
    /**
     * Instantiate a new `addToRelatedRecords` operation.
     *
     * @param {RecordIdentity} record
     * @param {string} relationship
     * @param {RecordIdentity} relatedRecord
     * @returns {AddToRelatedRecordsOperation}
     */
    TransformBuilder.prototype.addToRelatedRecords = function (record, relationship, relatedRecord) {
        return { op: 'addToRelatedRecords', record: record, relationship: relationship, relatedRecord: relatedRecord };
    };
    /**
     * Instantiate a new `removeFromRelatedRecords` operation.
     *
     * @param {RecordIdentity} record
     * @param {string} relationship
     * @param {RecordIdentity} relatedRecord
     * @returns {RemoveFromRelatedRecordsOperation}
     */
    TransformBuilder.prototype.removeFromRelatedRecords = function (record, relationship, relatedRecord) {
        return { op: 'removeFromRelatedRecords', record: record, relationship: relationship, relatedRecord: relatedRecord };
    };
    /**
     * Instantiate a new `replaceRelatedRecords` operation.
     *
     * @param {RecordIdentity} record
     * @param {string} relationship
     * @param {RecordIdentity[]} relatedRecords
     * @returns {ReplaceRelatedRecordsOperation}
     */
    TransformBuilder.prototype.replaceRelatedRecords = function (record, relationship, relatedRecords) {
        return { op: 'replaceRelatedRecords', record: record, relationship: relationship, relatedRecords: relatedRecords };
    };
    /**
     * Instantiate a new `replaceRelatedRecord` operation.
     *
     * @param {RecordIdentity} record
     * @param {string} relationship
     * @param {RecordIdentity} relatedRecord
     * @returns {ReplaceRelatedRecordOperation}
     */
    TransformBuilder.prototype.replaceRelatedRecord = function (record, relationship, relatedRecord) {
        return { op: 'replaceRelatedRecord', record: record, relationship: relationship, relatedRecord: relatedRecord };
    };
    return TransformBuilder;
}();
exports.default = TransformBuilder;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3JtLWJ1aWxkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzcmMvdHJhbnNmb3JtLWJ1aWxkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBc0JBLG1DQUdFOzhCQUFZLEFBQXVDLFVBQXZDO2lDQUFBO3VCQUF1QztBQUNqRCxBQUFJO2FBQUMsQUFBa0IscUJBQUcsQUFBUSxTQUFDLEFBQWlCLEFBQUMsQUFDdkQsQUFBQztBQUVEOzBCQUFJLDRCQUFpQjthQUFyQixZQUNFLEFBQU07bUJBQUMsQUFBSSxLQUFDLEFBQWtCLEFBQUMsQUFDakMsQUFBQzs7O3NCQUFBLEFBRUQsQUFLRzs7QUFDSDs7Ozs7OytCQUFTLFlBQVQsVUFBVSxBQUFjLFFBQ3RCLEFBQUUsQUFBQztZQUFDLEFBQUksS0FBQyxBQUFrQixBQUFDLG9CQUFDLEFBQUMsQUFDNUIsQUFBSTtpQkFBQyxBQUFrQixtQkFBQyxBQUFnQixpQkFBQyxBQUFNLEFBQUMsQUFBQyxBQUNuRCxBQUFDO0FBQ0QsQUFBTTtlQUFDLEVBQUUsQUFBRSxJQUFFLEFBQVcsYUFBRSxBQUFNLFFBQUEsQUFBQyxBQUFDLEFBQ3BDLEFBQUM7QUFFRCxBQUtHO0FBQ0g7Ozs7OzsrQkFBYSxnQkFBYixVQUFjLEFBQWMsUUFDMUIsQUFBTTtlQUFDLEVBQUUsQUFBRSxJQUFFLEFBQWUsaUJBQUUsQUFBTSxRQUFBLEFBQUMsQUFBQyxBQUN4QyxBQUFDO0FBRUQsQUFLRztBQUNIOzs7Ozs7K0JBQVksZUFBWixVQUFhLEFBQXNCLFFBQ2pDLEFBQU07ZUFBQyxFQUFFLEFBQUUsSUFBRSxBQUFjLGdCQUFFLEFBQU0sUUFBQSxBQUFDLEFBQUMsQUFDdkMsQUFBQztBQUVELEFBT0c7QUFDSDs7Ozs7Ozs7K0JBQVUsYUFBVixVQUFXLEFBQXNCLFFBQUUsQUFBVyxLQUFFLEFBQWEsT0FDM0QsQUFBTTtlQUFDLEVBQUUsQUFBRSxJQUFFLEFBQVksY0FBRSxBQUFNLFFBQUEsUUFBRSxBQUFHLEtBQUEsS0FBRSxBQUFLLE9BQUEsQUFBRSxBQUFDLEFBQ2xELEFBQUM7QUFFRCxBQU9HO0FBQ0g7Ozs7Ozs7OytCQUFnQixtQkFBaEIsVUFBaUIsQUFBc0IsUUFBRSxBQUFpQixXQUFFLEFBQVUsT0FDcEUsQUFBTTtlQUFDLEVBQUUsQUFBRSxJQUFFLEFBQWtCLG9CQUFFLEFBQU0sUUFBQSxRQUFFLEFBQVMsV0FBQSxXQUFFLEFBQUssT0FBQSxBQUFFLEFBQUMsQUFDOUQsQUFBQztBQUVELEFBT0c7QUFDSDs7Ozs7Ozs7K0JBQW1CLHNCQUFuQixVQUFvQixBQUFzQixRQUFFLEFBQW9CLGNBQUUsQUFBNkIsZUFDN0YsQUFBTTtlQUFDLEVBQUUsQUFBRSxJQUFFLEFBQXFCLHVCQUFFLEFBQU0sUUFBQSxRQUFFLEFBQVksY0FBQSxjQUFFLEFBQWEsZUFBQSxBQUFFLEFBQUMsQUFDNUUsQUFBQztBQUVELEFBT0c7QUFDSDs7Ozs7Ozs7K0JBQXdCLDJCQUF4QixVQUF5QixBQUFzQixRQUFFLEFBQW9CLGNBQUUsQUFBNkIsZUFDbEcsQUFBTTtlQUFDLEVBQUUsQUFBRSxJQUFFLEFBQTBCLDRCQUFFLEFBQU0sUUFBQSxRQUFFLEFBQVksY0FBQSxjQUFFLEFBQWEsZUFBQSxBQUFFLEFBQUMsQUFDakYsQUFBQztBQUVELEFBT0c7QUFDSDs7Ozs7Ozs7K0JBQXFCLHdCQUFyQixVQUFzQixBQUFzQixRQUFFLEFBQW9CLGNBQUUsQUFBZ0MsZ0JBQ2xHLEFBQU07ZUFBQyxFQUFFLEFBQUUsSUFBRSxBQUF1Qix5QkFBRSxBQUFNLFFBQUEsUUFBRSxBQUFZLGNBQUEsY0FBRSxBQUFjLGdCQUFBLEFBQUUsQUFBQyxBQUMvRSxBQUFDO0FBRUQsQUFPRztBQUNIOzs7Ozs7OzsrQkFBb0IsdUJBQXBCLFVBQXFCLEFBQXNCLFFBQUUsQUFBb0IsY0FBRSxBQUE2QixlQUM5RixBQUFNO2VBQUMsRUFBRSxBQUFFLElBQUUsQUFBc0Isd0JBQUUsQUFBTSxRQUFBLFFBQUUsQUFBWSxjQUFBLGNBQUUsQUFBYSxlQUFBLEFBQUUsQUFBQyxBQUM3RSxBQUFDO0FBQ0g7V0FBQSxBQUFDLEFBbkhELEFBbUhDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICBSZWNvcmQsXHJcbiAgUmVjb3JkSWRlbnRpdHksXHJcbiAgUmVjb3JkSW5pdGlhbGl6ZXJcclxufSBmcm9tICcuL3JlY29yZCc7XHJcbmltcG9ydCB7XHJcbiAgQWRkUmVjb3JkT3BlcmF0aW9uLFxyXG4gIFJlcGxhY2VSZWNvcmRPcGVyYXRpb24sXHJcbiAgUmVtb3ZlUmVjb3JkT3BlcmF0aW9uLFxyXG4gIFJlcGxhY2VLZXlPcGVyYXRpb24sXHJcbiAgUmVwbGFjZUF0dHJpYnV0ZU9wZXJhdGlvbixcclxuICBBZGRUb1JlbGF0ZWRSZWNvcmRzT3BlcmF0aW9uLFxyXG4gIFJlbW92ZUZyb21SZWxhdGVkUmVjb3Jkc09wZXJhdGlvbixcclxuICBSZXBsYWNlUmVsYXRlZFJlY29yZHNPcGVyYXRpb24sXHJcbiAgUmVwbGFjZVJlbGF0ZWRSZWNvcmRPcGVyYXRpb25cclxufSBmcm9tICcuL29wZXJhdGlvbic7XHJcbmltcG9ydCB7IGVxIH0gZnJvbSAnQG9yYml0L3V0aWxzJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgVHJhbnNmb3JtQnVpbGRlclNldHRpbmdzIHtcclxuICByZWNvcmRJbml0aWFsaXplcj86IFJlY29yZEluaXRpYWxpemVyO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUcmFuc2Zvcm1CdWlsZGVyIHtcclxuICBwcml2YXRlIF9yZWNvcmRJbml0aWFsaXplcjogUmVjb3JkSW5pdGlhbGl6ZXI7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzOiBUcmFuc2Zvcm1CdWlsZGVyU2V0dGluZ3MgPSB7fSkge1xyXG4gICAgdGhpcy5fcmVjb3JkSW5pdGlhbGl6ZXIgPSBzZXR0aW5ncy5yZWNvcmRJbml0aWFsaXplcjtcclxuICB9XHJcblxyXG4gIGdldCByZWNvcmRJbml0aWFsaXplcigpOiBSZWNvcmRJbml0aWFsaXplciB7XHJcbiAgICByZXR1cm4gdGhpcy5fcmVjb3JkSW5pdGlhbGl6ZXI7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBJbnN0YW50aWF0ZSBhIG5ldyBgYWRkUmVjb3JkYCBvcGVyYXRpb24uXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge1JlY29yZH0gcmVjb3JkXHJcbiAgICogQHJldHVybnMge0FkZFJlY29yZE9wZXJhdGlvbn1cclxuICAgKi9cclxuICBhZGRSZWNvcmQocmVjb3JkOiBSZWNvcmQpOiBBZGRSZWNvcmRPcGVyYXRpb24ge1xyXG4gICAgaWYgKHRoaXMuX3JlY29yZEluaXRpYWxpemVyKSB7XHJcbiAgICAgIHRoaXMuX3JlY29yZEluaXRpYWxpemVyLmluaXRpYWxpemVSZWNvcmQocmVjb3JkKTtcclxuICAgIH1cclxuICAgIHJldHVybiB7IG9wOiAnYWRkUmVjb3JkJywgcmVjb3JkfTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEluc3RhbnRpYXRlIGEgbmV3IGByZXBsYWNlUmVjb3JkYCBvcGVyYXRpb24uXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge1JlY29yZH0gcmVjb3JkXHJcbiAgICogQHJldHVybnMge1JlcGxhY2VSZWNvcmRPcGVyYXRpb259XHJcbiAgICovXHJcbiAgcmVwbGFjZVJlY29yZChyZWNvcmQ6IFJlY29yZCk6IFJlcGxhY2VSZWNvcmRPcGVyYXRpb24ge1xyXG4gICAgcmV0dXJuIHsgb3A6ICdyZXBsYWNlUmVjb3JkJywgcmVjb3JkfTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEluc3RhbnRpYXRlIGEgbmV3IGByZW1vdmVSZWNvcmRgIG9wZXJhdGlvbi5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7UmVjb3JkSWRlbnRpdHl9IHJlY29yZFxyXG4gICAqIEByZXR1cm5zIHtSZW1vdmVSZWNvcmRPcGVyYXRpb259XHJcbiAgICovXHJcbiAgcmVtb3ZlUmVjb3JkKHJlY29yZDogUmVjb3JkSWRlbnRpdHkpOiBSZW1vdmVSZWNvcmRPcGVyYXRpb24ge1xyXG4gICAgcmV0dXJuIHsgb3A6ICdyZW1vdmVSZWNvcmQnLCByZWNvcmR9O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogSW5zdGFudGlhdGUgYSBuZXcgYHJlcGxhY2VLZXlgIG9wZXJhdGlvbi5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7UmVjb3JkSWRlbnRpdHl9IHJlY29yZFxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBrZXlcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWVcclxuICAgKiBAcmV0dXJucyB7UmVwbGFjZUtleU9wZXJhdGlvbn1cclxuICAgKi9cclxuICByZXBsYWNlS2V5KHJlY29yZDogUmVjb3JkSWRlbnRpdHksIGtleTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKTogUmVwbGFjZUtleU9wZXJhdGlvbiB7XHJcbiAgICByZXR1cm4geyBvcDogJ3JlcGxhY2VLZXknLCByZWNvcmQsIGtleSwgdmFsdWUgfTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEluc3RhbnRpYXRlIGEgbmV3IGByZXBsYWNlQXR0cmlidXRlYCBvcGVyYXRpb24uXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge1JlY29yZElkZW50aXR5fSByZWNvcmRcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gYXR0cmlidXRlXHJcbiAgICogQHBhcmFtIHsqfSB2YWx1ZVxyXG4gICAqIEByZXR1cm5zIHtSZXBsYWNlQXR0cmlidXRlT3BlcmF0aW9ufVxyXG4gICAqL1xyXG4gIHJlcGxhY2VBdHRyaWJ1dGUocmVjb3JkOiBSZWNvcmRJZGVudGl0eSwgYXR0cmlidXRlOiBzdHJpbmcsIHZhbHVlOiBhbnkpOiBSZXBsYWNlQXR0cmlidXRlT3BlcmF0aW9uIHtcclxuICAgIHJldHVybiB7IG9wOiAncmVwbGFjZUF0dHJpYnV0ZScsIHJlY29yZCwgYXR0cmlidXRlLCB2YWx1ZSB9O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogSW5zdGFudGlhdGUgYSBuZXcgYGFkZFRvUmVsYXRlZFJlY29yZHNgIG9wZXJhdGlvbi5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7UmVjb3JkSWRlbnRpdHl9IHJlY29yZFxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSByZWxhdGlvbnNoaXBcclxuICAgKiBAcGFyYW0ge1JlY29yZElkZW50aXR5fSByZWxhdGVkUmVjb3JkXHJcbiAgICogQHJldHVybnMge0FkZFRvUmVsYXRlZFJlY29yZHNPcGVyYXRpb259XHJcbiAgICovXHJcbiAgYWRkVG9SZWxhdGVkUmVjb3JkcyhyZWNvcmQ6IFJlY29yZElkZW50aXR5LCByZWxhdGlvbnNoaXA6IHN0cmluZywgcmVsYXRlZFJlY29yZDogUmVjb3JkSWRlbnRpdHkpOiBBZGRUb1JlbGF0ZWRSZWNvcmRzT3BlcmF0aW9uIHtcclxuICAgIHJldHVybiB7IG9wOiAnYWRkVG9SZWxhdGVkUmVjb3JkcycsIHJlY29yZCwgcmVsYXRpb25zaGlwLCByZWxhdGVkUmVjb3JkIH07XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBJbnN0YW50aWF0ZSBhIG5ldyBgcmVtb3ZlRnJvbVJlbGF0ZWRSZWNvcmRzYCBvcGVyYXRpb24uXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge1JlY29yZElkZW50aXR5fSByZWNvcmRcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gcmVsYXRpb25zaGlwXHJcbiAgICogQHBhcmFtIHtSZWNvcmRJZGVudGl0eX0gcmVsYXRlZFJlY29yZFxyXG4gICAqIEByZXR1cm5zIHtSZW1vdmVGcm9tUmVsYXRlZFJlY29yZHNPcGVyYXRpb259XHJcbiAgICovXHJcbiAgcmVtb3ZlRnJvbVJlbGF0ZWRSZWNvcmRzKHJlY29yZDogUmVjb3JkSWRlbnRpdHksIHJlbGF0aW9uc2hpcDogc3RyaW5nLCByZWxhdGVkUmVjb3JkOiBSZWNvcmRJZGVudGl0eSk6IFJlbW92ZUZyb21SZWxhdGVkUmVjb3Jkc09wZXJhdGlvbiB7XHJcbiAgICByZXR1cm4geyBvcDogJ3JlbW92ZUZyb21SZWxhdGVkUmVjb3JkcycsIHJlY29yZCwgcmVsYXRpb25zaGlwLCByZWxhdGVkUmVjb3JkIH07XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBJbnN0YW50aWF0ZSBhIG5ldyBgcmVwbGFjZVJlbGF0ZWRSZWNvcmRzYCBvcGVyYXRpb24uXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge1JlY29yZElkZW50aXR5fSByZWNvcmRcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gcmVsYXRpb25zaGlwXHJcbiAgICogQHBhcmFtIHtSZWNvcmRJZGVudGl0eVtdfSByZWxhdGVkUmVjb3Jkc1xyXG4gICAqIEByZXR1cm5zIHtSZXBsYWNlUmVsYXRlZFJlY29yZHNPcGVyYXRpb259XHJcbiAgICovXHJcbiAgcmVwbGFjZVJlbGF0ZWRSZWNvcmRzKHJlY29yZDogUmVjb3JkSWRlbnRpdHksIHJlbGF0aW9uc2hpcDogc3RyaW5nLCByZWxhdGVkUmVjb3JkczogUmVjb3JkSWRlbnRpdHlbXSk6IFJlcGxhY2VSZWxhdGVkUmVjb3Jkc09wZXJhdGlvbiB7XHJcbiAgICByZXR1cm4geyBvcDogJ3JlcGxhY2VSZWxhdGVkUmVjb3JkcycsIHJlY29yZCwgcmVsYXRpb25zaGlwLCByZWxhdGVkUmVjb3JkcyB9O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogSW5zdGFudGlhdGUgYSBuZXcgYHJlcGxhY2VSZWxhdGVkUmVjb3JkYCBvcGVyYXRpb24uXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge1JlY29yZElkZW50aXR5fSByZWNvcmRcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gcmVsYXRpb25zaGlwXHJcbiAgICogQHBhcmFtIHtSZWNvcmRJZGVudGl0eX0gcmVsYXRlZFJlY29yZFxyXG4gICAqIEByZXR1cm5zIHtSZXBsYWNlUmVsYXRlZFJlY29yZE9wZXJhdGlvbn1cclxuICAgKi9cclxuICByZXBsYWNlUmVsYXRlZFJlY29yZChyZWNvcmQ6IFJlY29yZElkZW50aXR5LCByZWxhdGlvbnNoaXA6IHN0cmluZywgcmVsYXRlZFJlY29yZDogUmVjb3JkSWRlbnRpdHkpOiBSZXBsYWNlUmVsYXRlZFJlY29yZE9wZXJhdGlvbiB7XHJcbiAgICByZXR1cm4geyBvcDogJ3JlcGxhY2VSZWxhdGVkUmVjb3JkJywgcmVjb3JkLCByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmQgfTtcclxuICB9XHJcbn0iXX0=