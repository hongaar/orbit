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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlcnktYnVpbGRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNyYy9xdWVyeS1idWlsZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLDJCQUF5SDtBQUV6SDtBQUFBLDRCQTRDQSxDQUFDO0FBM0NDLEFBS0c7Ozs7OztBQUNILDJCQUFVLGFBQVYsVUFBVyxBQUFzQjtBQUMvQixBQUFNLGVBQUMsSUFBSSxhQUFjLGVBQUMsQUFBTSxBQUFDLEFBQUMsQUFDcEM7QUFBQztBQUVELEFBT0c7Ozs7Ozs7O0FBQ0gsMkJBQVcsY0FBWCxVQUFZLEFBQWE7QUFDdkIsQUFBTSxlQUFDLElBQUksYUFBZSxnQkFBQyxBQUFJLEFBQUMsQUFBQyxBQUNuQztBQUFDO0FBRUQsQUFNRzs7Ozs7OztBQUNILDJCQUFpQixvQkFBakIsVUFBa0IsQUFBc0IsUUFBRSxBQUFvQjtBQUM1RCxBQUFNLGVBQUMsSUFBSSxhQUFxQixzQkFBQyxBQUFNLFFBQUUsQUFBWSxBQUFDLEFBQUMsQUFDekQ7QUFBQztBQUVELEFBTUc7Ozs7Ozs7QUFDSCwyQkFBa0IscUJBQWxCLFVBQW1CLEFBQXNCLFFBQUUsQUFBb0I7QUFDN0QsQUFBTSxlQUFDLElBQUksYUFBc0IsdUJBQUMsQUFBTSxRQUFFLEFBQVksQUFBQyxBQUFDLEFBQzFEO0FBQUM7QUFDSCxXQUFDLEFBQUQ7QUE1Q0EsQUE0Q0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSZWNvcmRJZGVudGl0eSB9IGZyb20gJy4vcmVjb3JkJztcclxuaW1wb3J0IHsgUXVlcnlUZXJtLCBGaW5kUmVjb3JkVGVybSwgRmluZFJlY29yZHNUZXJtLCBGaW5kUmVsYXRlZFJlY29yZFRlcm0sIEZpbmRSZWxhdGVkUmVjb3Jkc1Rlcm0gfSBmcm9tICcuL3F1ZXJ5LXRlcm0nO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUXVlcnlCdWlsZGVyIHtcclxuICAvKipcclxuICAgKiBGaW5kIGEgcmVjb3JkIGJ5IGl0cyBpZGVudGl0eS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7UmVjb3JkSWRlbnRpdHl9IHJlY29yZElkZW50aXR5XHJcbiAgICogQHJldHVybnMge0ZpbmRSZWNvcmRUZXJtfVxyXG4gICAqL1xyXG4gIGZpbmRSZWNvcmQocmVjb3JkOiBSZWNvcmRJZGVudGl0eSk6IEZpbmRSZWNvcmRUZXJtIHtcclxuICAgIHJldHVybiBuZXcgRmluZFJlY29yZFRlcm0ocmVjb3JkKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEZpbmQgYWxsIHJlY29yZHMgb2YgYSBzcGVjaWZpYyB0eXBlLlxyXG4gICAqXHJcbiAgICogSWYgYHR5cGVgIGlzIHVuc3BlY2lmaWVkLCBmaW5kIGFsbCByZWNvcmRzIHVuZmlsdGVyZWQgYnkgdHlwZS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbdHlwZV1cclxuICAgKiBAcmV0dXJucyB7RmluZFJlY29yZHNUZXJtfVxyXG4gICAqL1xyXG4gIGZpbmRSZWNvcmRzKHR5cGU/OiBzdHJpbmcpOiBGaW5kUmVjb3Jkc1Rlcm0ge1xyXG4gICAgcmV0dXJuIG5ldyBGaW5kUmVjb3Jkc1Rlcm0odHlwZSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBGaW5kIGEgcmVjb3JkIGluIGEgdG8tb25lIHJlbGF0aW9uc2hpcC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7UmVjb3JkSWRlbnRpdHl9IHJlY29yZFxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSByZWxhdGlvbnNoaXBcclxuICAgKiBAcmV0dXJucyB7RmluZFJlbGF0ZWRSZWNvcmRUZXJtfVxyXG4gICAqL1xyXG4gIGZpbmRSZWxhdGVkUmVjb3JkKHJlY29yZDogUmVjb3JkSWRlbnRpdHksIHJlbGF0aW9uc2hpcDogc3RyaW5nKTogRmluZFJlbGF0ZWRSZWNvcmRUZXJtIHtcclxuICAgIHJldHVybiBuZXcgRmluZFJlbGF0ZWRSZWNvcmRUZXJtKHJlY29yZCwgcmVsYXRpb25zaGlwKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEZpbmQgcmVjb3JkcyBpbiBhIHRvLW1hbnkgcmVsYXRpb25zaGlwLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtSZWNvcmRJZGVudGl0eX0gcmVjb3JkXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHJlbGF0aW9uc2hpcFxyXG4gICAqIEByZXR1cm5zIHtGaW5kUmVsYXRlZFJlY29yZHNUZXJtfVxyXG4gICAqL1xyXG4gIGZpbmRSZWxhdGVkUmVjb3JkcyhyZWNvcmQ6IFJlY29yZElkZW50aXR5LCByZWxhdGlvbnNoaXA6IHN0cmluZyk6IEZpbmRSZWxhdGVkUmVjb3Jkc1Rlcm0ge1xyXG4gICAgcmV0dXJuIG5ldyBGaW5kUmVsYXRlZFJlY29yZHNUZXJtKHJlY29yZCwgcmVsYXRpb25zaGlwKTtcclxuICB9XHJcbn1cclxuIl19