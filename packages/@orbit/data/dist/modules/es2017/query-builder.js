"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var query_term_1 = require("./query-term");
var QueryBuilder = (function () {
    function QueryBuilder() {
    }
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
}());
exports.default = QueryBuilder;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlcnktYnVpbGRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNyYy9xdWVyeS1idWlsZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsMkNBQXlIO0FBRXpIO0lBQUE7SUE0Q0EsQ0FBQztJQTNDQzs7Ozs7T0FLRztJQUNILGlDQUFVLEdBQVYsVUFBVyxNQUFzQjtRQUMvQixNQUFNLENBQUMsSUFBSSwyQkFBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ0gsa0NBQVcsR0FBWCxVQUFZLElBQWE7UUFDdkIsTUFBTSxDQUFDLElBQUksNEJBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsd0NBQWlCLEdBQWpCLFVBQWtCLE1BQXNCLEVBQUUsWUFBb0I7UUFDNUQsTUFBTSxDQUFDLElBQUksa0NBQXFCLENBQUMsTUFBTSxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCx5Q0FBa0IsR0FBbEIsVUFBbUIsTUFBc0IsRUFBRSxZQUFvQjtRQUM3RCxNQUFNLENBQUMsSUFBSSxtQ0FBc0IsQ0FBQyxNQUFNLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFDMUQsQ0FBQztJQUNILG1CQUFDO0FBQUQsQ0FBQyxBQTVDRCxJQTRDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJlY29yZElkZW50aXR5IH0gZnJvbSAnLi9yZWNvcmQnO1xyXG5pbXBvcnQgeyBRdWVyeVRlcm0sIEZpbmRSZWNvcmRUZXJtLCBGaW5kUmVjb3Jkc1Rlcm0sIEZpbmRSZWxhdGVkUmVjb3JkVGVybSwgRmluZFJlbGF0ZWRSZWNvcmRzVGVybSB9IGZyb20gJy4vcXVlcnktdGVybSc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBRdWVyeUJ1aWxkZXIge1xyXG4gIC8qKlxyXG4gICAqIEZpbmQgYSByZWNvcmQgYnkgaXRzIGlkZW50aXR5LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtSZWNvcmRJZGVudGl0eX0gcmVjb3JkSWRlbnRpdHlcclxuICAgKiBAcmV0dXJucyB7RmluZFJlY29yZFRlcm19XHJcbiAgICovXHJcbiAgZmluZFJlY29yZChyZWNvcmQ6IFJlY29yZElkZW50aXR5KTogRmluZFJlY29yZFRlcm0ge1xyXG4gICAgcmV0dXJuIG5ldyBGaW5kUmVjb3JkVGVybShyZWNvcmQpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRmluZCBhbGwgcmVjb3JkcyBvZiBhIHNwZWNpZmljIHR5cGUuXHJcbiAgICpcclxuICAgKiBJZiBgdHlwZWAgaXMgdW5zcGVjaWZpZWQsIGZpbmQgYWxsIHJlY29yZHMgdW5maWx0ZXJlZCBieSB0eXBlLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IFt0eXBlXVxyXG4gICAqIEByZXR1cm5zIHtGaW5kUmVjb3Jkc1Rlcm19XHJcbiAgICovXHJcbiAgZmluZFJlY29yZHModHlwZT86IHN0cmluZyk6IEZpbmRSZWNvcmRzVGVybSB7XHJcbiAgICByZXR1cm4gbmV3IEZpbmRSZWNvcmRzVGVybSh0eXBlKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEZpbmQgYSByZWNvcmQgaW4gYSB0by1vbmUgcmVsYXRpb25zaGlwLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtSZWNvcmRJZGVudGl0eX0gcmVjb3JkXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHJlbGF0aW9uc2hpcFxyXG4gICAqIEByZXR1cm5zIHtGaW5kUmVsYXRlZFJlY29yZFRlcm19XHJcbiAgICovXHJcbiAgZmluZFJlbGF0ZWRSZWNvcmQocmVjb3JkOiBSZWNvcmRJZGVudGl0eSwgcmVsYXRpb25zaGlwOiBzdHJpbmcpOiBGaW5kUmVsYXRlZFJlY29yZFRlcm0ge1xyXG4gICAgcmV0dXJuIG5ldyBGaW5kUmVsYXRlZFJlY29yZFRlcm0ocmVjb3JkLCByZWxhdGlvbnNoaXApO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRmluZCByZWNvcmRzIGluIGEgdG8tbWFueSByZWxhdGlvbnNoaXAuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge1JlY29yZElkZW50aXR5fSByZWNvcmRcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gcmVsYXRpb25zaGlwXHJcbiAgICogQHJldHVybnMge0ZpbmRSZWxhdGVkUmVjb3Jkc1Rlcm19XHJcbiAgICovXHJcbiAgZmluZFJlbGF0ZWRSZWNvcmRzKHJlY29yZDogUmVjb3JkSWRlbnRpdHksIHJlbGF0aW9uc2hpcDogc3RyaW5nKTogRmluZFJlbGF0ZWRSZWNvcmRzVGVybSB7XHJcbiAgICByZXR1cm4gbmV3IEZpbmRSZWxhdGVkUmVjb3Jkc1Rlcm0ocmVjb3JkLCByZWxhdGlvbnNoaXApO1xyXG4gIH1cclxufVxyXG4iXX0=