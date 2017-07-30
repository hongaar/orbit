"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var query_term_1 = require("./query-term");
var QueryBuilder = function () {
    function QueryBuilder() {}
    /**
     * Find a record by its identity.
     *
     * @param {RecordIdentity} recordIdentity
     * @returns {FindRecordTerm}
     */
    QueryBuilder.prototype.findRecord = function (record) {
        return new query_term_1.FindRecordTerm(record);
    };
    /**
     * Find all records of a specific type.
     *
     * If `type` is unspecified, find all records unfiltered by type.
     *
     * @param {string} [type]
     * @returns {FindRecordsTerm}
     */
    QueryBuilder.prototype.findRecords = function (type) {
        return new query_term_1.FindRecordsTerm(type);
    };
    /**
     * Find a record in a to-one relationship.
     *
     * @param {RecordIdentity} record
     * @param {string} relationship
     * @returns {FindRelatedRecordTerm}
     */
    QueryBuilder.prototype.findRelatedRecord = function (record, relationship) {
        return new query_term_1.FindRelatedRecordTerm(record, relationship);
    };
    /**
     * Find records in a to-many relationship.
     *
     * @param {RecordIdentity} record
     * @param {string} relationship
     * @returns {FindRelatedRecordsTerm}
     */
    QueryBuilder.prototype.findRelatedRecords = function (record, relationship) {
        return new query_term_1.FindRelatedRecordsTerm(record, relationship);
    };
    return QueryBuilder;
}();
exports.default = QueryBuilder;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlcnktYnVpbGRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNyYy9xdWVyeS1idWlsZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLDJCQUF5SDtBQUV6SCwrQkFBQTs0QkE0Q0EsQUFBQyxDQTNDQyxBQUtHO0FBQ0g7Ozs7OzsyQkFBVSxhQUFWLFVBQVcsQUFBc0IsUUFDL0IsQUFBTTtlQUFDLElBQUksYUFBYyxlQUFDLEFBQU0sQUFBQyxBQUFDLEFBQ3BDLEFBQUM7QUFFRCxBQU9HO0FBQ0g7Ozs7Ozs7OzJCQUFXLGNBQVgsVUFBWSxBQUFhLE1BQ3ZCLEFBQU07ZUFBQyxJQUFJLGFBQWUsZ0JBQUMsQUFBSSxBQUFDLEFBQUMsQUFDbkMsQUFBQztBQUVELEFBTUc7QUFDSDs7Ozs7OzsyQkFBaUIsb0JBQWpCLFVBQWtCLEFBQXNCLFFBQUUsQUFBb0IsY0FDNUQsQUFBTTtlQUFDLElBQUksYUFBcUIsc0JBQUMsQUFBTSxRQUFFLEFBQVksQUFBQyxBQUFDLEFBQ3pELEFBQUM7QUFFRCxBQU1HO0FBQ0g7Ozs7Ozs7MkJBQWtCLHFCQUFsQixVQUFtQixBQUFzQixRQUFFLEFBQW9CLGNBQzdELEFBQU07ZUFBQyxJQUFJLGFBQXNCLHVCQUFDLEFBQU0sUUFBRSxBQUFZLEFBQUMsQUFBQyxBQUMxRCxBQUFDO0FBQ0g7V0FBQSxBQUFDLEFBNUNELEFBNENDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUmVjb3JkSWRlbnRpdHkgfSBmcm9tICcuL3JlY29yZCc7XHJcbmltcG9ydCB7IFF1ZXJ5VGVybSwgRmluZFJlY29yZFRlcm0sIEZpbmRSZWNvcmRzVGVybSwgRmluZFJlbGF0ZWRSZWNvcmRUZXJtLCBGaW5kUmVsYXRlZFJlY29yZHNUZXJtIH0gZnJvbSAnLi9xdWVyeS10ZXJtJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFF1ZXJ5QnVpbGRlciB7XHJcbiAgLyoqXHJcbiAgICogRmluZCBhIHJlY29yZCBieSBpdHMgaWRlbnRpdHkuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge1JlY29yZElkZW50aXR5fSByZWNvcmRJZGVudGl0eVxyXG4gICAqIEByZXR1cm5zIHtGaW5kUmVjb3JkVGVybX1cclxuICAgKi9cclxuICBmaW5kUmVjb3JkKHJlY29yZDogUmVjb3JkSWRlbnRpdHkpOiBGaW5kUmVjb3JkVGVybSB7XHJcbiAgICByZXR1cm4gbmV3IEZpbmRSZWNvcmRUZXJtKHJlY29yZCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBGaW5kIGFsbCByZWNvcmRzIG9mIGEgc3BlY2lmaWMgdHlwZS5cclxuICAgKlxyXG4gICAqIElmIGB0eXBlYCBpcyB1bnNwZWNpZmllZCwgZmluZCBhbGwgcmVjb3JkcyB1bmZpbHRlcmVkIGJ5IHR5cGUuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gW3R5cGVdXHJcbiAgICogQHJldHVybnMge0ZpbmRSZWNvcmRzVGVybX1cclxuICAgKi9cclxuICBmaW5kUmVjb3Jkcyh0eXBlPzogc3RyaW5nKTogRmluZFJlY29yZHNUZXJtIHtcclxuICAgIHJldHVybiBuZXcgRmluZFJlY29yZHNUZXJtKHR5cGUpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRmluZCBhIHJlY29yZCBpbiBhIHRvLW9uZSByZWxhdGlvbnNoaXAuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge1JlY29yZElkZW50aXR5fSByZWNvcmRcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gcmVsYXRpb25zaGlwXHJcbiAgICogQHJldHVybnMge0ZpbmRSZWxhdGVkUmVjb3JkVGVybX1cclxuICAgKi9cclxuICBmaW5kUmVsYXRlZFJlY29yZChyZWNvcmQ6IFJlY29yZElkZW50aXR5LCByZWxhdGlvbnNoaXA6IHN0cmluZyk6IEZpbmRSZWxhdGVkUmVjb3JkVGVybSB7XHJcbiAgICByZXR1cm4gbmV3IEZpbmRSZWxhdGVkUmVjb3JkVGVybShyZWNvcmQsIHJlbGF0aW9uc2hpcCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBGaW5kIHJlY29yZHMgaW4gYSB0by1tYW55IHJlbGF0aW9uc2hpcC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7UmVjb3JkSWRlbnRpdHl9IHJlY29yZFxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSByZWxhdGlvbnNoaXBcclxuICAgKiBAcmV0dXJucyB7RmluZFJlbGF0ZWRSZWNvcmRzVGVybX1cclxuICAgKi9cclxuICBmaW5kUmVsYXRlZFJlY29yZHMocmVjb3JkOiBSZWNvcmRJZGVudGl0eSwgcmVsYXRpb25zaGlwOiBzdHJpbmcpOiBGaW5kUmVsYXRlZFJlY29yZHNUZXJtIHtcclxuICAgIHJldHVybiBuZXcgRmluZFJlbGF0ZWRSZWNvcmRzVGVybShyZWNvcmQsIHJlbGF0aW9uc2hpcCk7XHJcbiAgfVxyXG59XHJcbiJdfQ==