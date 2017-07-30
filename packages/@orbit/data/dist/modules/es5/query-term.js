"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

var __extends = this && this.__extends || function () {
    var extendStatics = Object.setPrototypeOf || _extends({}, []) instanceof Array && function (d, b) {
        _defaults(d, b);
    } || function (d, b) {
        for (var p in b) {
            if (b.hasOwnProperty(p)) d[p] = b[p];
        }
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@orbit/utils");
/**
 * Query terms are used by query builders to allow for the construction of
 * query expressions in composable patterns.
 *
 * @export
 * @class QueryTerm
 */
var QueryTerm = function () {
    function QueryTerm(expression) {
        this.expression = expression;
    }
    QueryTerm.prototype.toQueryExpression = function () {
        return this.expression;
    };
    return QueryTerm;
}();
exports.QueryTerm = QueryTerm;
/**
 * A query term representing a single record.
 *
 * @export
 * @class FindRecordTerm
 * @extends {QueryTerm}
 */
var FindRecordTerm = function (_super) {
    __extends(FindRecordTerm, _super);
    function FindRecordTerm(record) {
        var _this = this;
        var expression = {
            op: 'findRecord',
            record: record
        };
        _this = _super.call(this, expression) || this;
        return _this;
    }
    return FindRecordTerm;
}(QueryTerm);
exports.FindRecordTerm = FindRecordTerm;
var FindRelatedRecordTerm = function (_super) {
    __extends(FindRelatedRecordTerm, _super);
    function FindRelatedRecordTerm(record, relationship) {
        var _this = this;
        var expression = {
            op: 'findRelatedRecord',
            record: record,
            relationship: relationship
        };
        _this = _super.call(this, expression) || this;
        return _this;
    }
    return FindRelatedRecordTerm;
}(QueryTerm);
exports.FindRelatedRecordTerm = FindRelatedRecordTerm;
var FindRelatedRecordsTerm = function (_super) {
    __extends(FindRelatedRecordsTerm, _super);
    function FindRelatedRecordsTerm(record, relationship) {
        var _this = this;
        var expression = {
            op: 'findRelatedRecords',
            record: record,
            relationship: relationship
        };
        _this = _super.call(this, expression) || this;
        return _this;
    }
    return FindRelatedRecordsTerm;
}(QueryTerm);
exports.FindRelatedRecordsTerm = FindRelatedRecordsTerm;
var FindRecordsTerm = function (_super) {
    __extends(FindRecordsTerm, _super);
    function FindRecordsTerm(type) {
        var _this = this;
        var expression = {
            op: 'findRecords',
            type: type
        };
        _this = _super.call(this, expression) || this;
        return _this;
    }
    /**
     * Applies sorting to a collection query.
     *
     * Sort specifiers can be expressed in object form, like:
     *
     * ```ts
     * { attribute: 'name', order: 'descending' }
     * { attribute: 'name', order: 'ascending' }
     * ```
     *
     * Or in string form, like:
     *
     * ```ts
     * '-name' // descending order
     * 'name'  // ascending order
     * ```
     *
     * @param {SortSpecifier[] | string[]} sortSpecifiers
     * @returns {RecordsTerm}
     *
     * @memberOf RecordsTerm
     */
    FindRecordsTerm.prototype.sort = function () {
        var sortSpecifiers = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            sortSpecifiers[_i] = arguments[_i];
        }
        var specifiers = sortSpecifiers.map(parseSortSpecifier);
        this.expression.sort = (this.expression.sort || []).concat(specifiers);
        return this;
    };
    /**
     * Applies pagination to a collection query.
     *
     * Note: Options are currently an opaque pass-through to remote sources.
     *
     * @param {object} options
     * @returns {RecordsTerm}
     *
     * @memberOf RecordsTerm
     */
    FindRecordsTerm.prototype.page = function (options) {
        this.expression.page = options;
        return this;
    };
    /**
     * Apply an advanced filter expression based on a `RecordCursor`.
     *
     * For example:
     *
     * ```ts
     * oqb
     *   .records('planet')
     *   .filter(record =>
     *     oqb.or(
     *       record.attribute('name').equal('Jupiter'),
     *       record.attribute('name').equal('Pluto')
     *     )
     *   )
     * ```
     *
     * @param {(RecordCursor) => void} predicateExpression
     * @returns {RecordsTerm}
     *
     * @memberOf RecordsTerm
     */
    FindRecordsTerm.prototype.filter = function () {
        var filterSpecifiers = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            filterSpecifiers[_i] = arguments[_i];
        }
        var expressions = filterSpecifiers.map(parseFilterSpecifier);
        this.expression.filter = (this.expression.filter || []).concat(filterSpecifiers);
        return this;
    };
    return FindRecordsTerm;
}(QueryTerm);
exports.FindRecordsTerm = FindRecordsTerm;
function parseFilterSpecifier(filterSpecifier) {
    if (utils_1.isObject(filterSpecifier)) {
        var s = filterSpecifier;
        s.kind = s.kind || 'attribute';
        s.op = s.op || 'equal';
        return s;
    }
}
function parseSortSpecifier(sortSpecifier) {
    if (utils_1.isObject(sortSpecifier)) {
        var s = sortSpecifier;
        s.kind = s.kind || 'attribute';
        s.order = s.order || 'ascending';
        return s;
    } else if (typeof sortSpecifier === 'string') {
        return parseSortSpecifierString(sortSpecifier);
    }
    throw new Error('Sort expression must be either an object or a string.');
}
function parseSortSpecifierString(sortSpecifier) {
    var attribute;
    var order;
    if (sortSpecifier[0] === '-') {
        attribute = sortSpecifier.slice(1);
        order = 'descending';
    } else {
        attribute = sortSpecifier;
        order = 'ascending';
    }
    return {
        kind: 'attribute',
        attribute: attribute,
        order: order
    };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlcnktdGVybS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNyYy9xdWVyeS10ZXJtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsc0JBQXdDO0FBSXhDLEFBTUc7Ozs7Ozs7QUFDSDtBQUdFLHVCQUFZLEFBQTRCO0FBQ3RDLEFBQUksYUFBQyxBQUFVLGFBQUcsQUFBVSxBQUFDLEFBQy9CO0FBQUM7QUFFRCx3QkFBaUIsb0JBQWpCO0FBQ0UsQUFBTSxlQUFDLEFBQUksS0FBQyxBQUFVLEFBQUMsQUFDekI7QUFBQztBQUNILFdBQUEsQUFBQztBQVZELEFBVUM7QUFWWSxvQkFBUztBQVl0QixBQU1HOzs7Ozs7O0FBQ0g7QUFBb0MsOEJBQVM7QUFHM0MsNEJBQVksQUFBc0I7QUFBbEMsb0JBT0M7QUFOQyxZQUFJLEFBQVU7QUFDWixBQUFFLGdCQUFFLEFBQVk7QUFDaEIsQUFBTSxvQkFBQSxBQUNQLEFBQUM7QUFIMkI7QUFLN0IsZ0JBQUEsa0JBQU0sQUFBVSxBQUFDLGVBQUM7ZUFDcEI7QUFBQztBQUNILFdBQUEsQUFBQztBQVhELEFBV0MsRUFYbUMsQUFBUyxBQVc1QztBQVhZLHlCQUFjO0FBYTNCO0FBQTJDLHFDQUFTO0FBR2xELG1DQUFZLEFBQXNCLFFBQUUsQUFBb0I7QUFBeEQsb0JBUUM7QUFQQyxZQUFJLEFBQVU7QUFDWixBQUFFLGdCQUFFLEFBQW1CO0FBQ3ZCLEFBQU0sb0JBQUE7QUFDTixBQUFZLDBCQUFBLEFBQ2IsQUFBQztBQUprQztBQU1wQyxnQkFBQSxrQkFBTSxBQUFVLEFBQUMsZUFBQztlQUNwQjtBQUFDO0FBQ0gsV0FBQSxBQUFDO0FBWkQsQUFZQyxFQVowQyxBQUFTLEFBWW5EO0FBWlksZ0NBQXFCO0FBY2xDO0FBQTRDLHNDQUFTO0FBR25ELG9DQUFZLEFBQXNCLFFBQUUsQUFBb0I7QUFBeEQsb0JBUUM7QUFQQyxZQUFJLEFBQVU7QUFDWixBQUFFLGdCQUFFLEFBQW9CO0FB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QUFDLEFBQzNFO0FBQUM7QUFFRCxrQ0FBa0MsQUFBcUI7QUFDckQsUUFBSSxBQUFTLEFBQUM7QUFDZCxRQUFJLEFBQUssQUFBQztBQUVWLEFBQUUsQUFBQyxRQUFDLEFBQWEsY0FBQyxBQUFDLEFBQUMsT0FBSyxBQUFHLEFBQUMsS0FBQyxBQUFDO0FBQzdCLEFBQVMsb0JBQUcsQUFBYSxjQUFDLEFBQUssTUFBQyxBQUFDLEFBQUMsQUFBQztBQUNuQyxBQUFLLGdCQUFHLEFBQVksQUFBQyxBQUN2QjtBQUFDLEFBQUMsQUFBSSxXQUFDLEFBQUM7QUFDTixBQUFTLG9CQUFHLEFBQWEsQUFBQztBQUMxQixBQUFLLGdCQUFHLEFBQVcsQUFBQyxBQUN0QjtBQUFDO0FBRUQsQUFBTTtBQUNKLEFBQUksY0FBRSxBQUFXO0FBQ2pCLEFBQVMsbUJBQUE7QUFDVCxBQUFLLGVBQUEsQUFDTixBQUFDLEFBQ0o7QUFMUztBQUtSIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaXNPYmplY3QgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xyXG5pbXBvcnQgeyBRdWVyeUV4cHJlc3Npb24sIEZpbmRSZWNvcmQsIEZpbmRSZWxhdGVkUmVjb3JkLCBGaW5kUmVsYXRlZFJlY29yZHMsIEZpbmRSZWNvcmRzLCBTb3J0U3BlY2lmaWVyLCBBdHRyaWJ1dGVTb3J0U3BlY2lmaWVyLCBQYWdlU3BlY2lmaWVyLCBGaWx0ZXJTcGVjaWZpZXIgfSBmcm9tICcuL3F1ZXJ5LWV4cHJlc3Npb24nO1xyXG5pbXBvcnQgeyBSZWNvcmRJZGVudGl0eSB9IGZyb20gJy4vcmVjb3JkJztcclxuXHJcbi8qKlxyXG4gKiBRdWVyeSB0ZXJtcyBhcmUgdXNlZCBieSBxdWVyeSBidWlsZGVycyB0byBhbGxvdyBmb3IgdGhlIGNvbnN0cnVjdGlvbiBvZlxyXG4gKiBxdWVyeSBleHByZXNzaW9ucyBpbiBjb21wb3NhYmxlIHBhdHRlcm5zLlxyXG4gKlxyXG4gKiBAZXhwb3J0XHJcbiAqIEBjbGFzcyBRdWVyeVRlcm1cclxuICovXHJcbmV4cG9ydCBjbGFzcyBRdWVyeVRlcm0ge1xyXG4gIGV4cHJlc3Npb246IFF1ZXJ5RXhwcmVzc2lvbjtcclxuXHJcbiAgY29uc3RydWN0b3IoZXhwcmVzc2lvbj86IFF1ZXJ5RXhwcmVzc2lvbikge1xyXG4gICAgdGhpcy5leHByZXNzaW9uID0gZXhwcmVzc2lvbjtcclxuICB9XHJcblxyXG4gIHRvUXVlcnlFeHByZXNzaW9uKCk6IFF1ZXJ5RXhwcmVzc2lvbiB7XHJcbiAgICByZXR1cm4gdGhpcy5leHByZXNzaW9uO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEEgcXVlcnkgdGVybSByZXByZXNlbnRpbmcgYSBzaW5nbGUgcmVjb3JkLlxyXG4gKlxyXG4gKiBAZXhwb3J0XHJcbiAqIEBjbGFzcyBGaW5kUmVjb3JkVGVybVxyXG4gKiBAZXh0ZW5kcyB7UXVlcnlUZXJtfVxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEZpbmRSZWNvcmRUZXJtIGV4dGVuZHMgUXVlcnlUZXJtIHtcclxuICBleHByZXNzaW9uOiBGaW5kUmVjb3JkO1xyXG5cclxuICBjb25zdHJ1Y3RvcihyZWNvcmQ6IFJlY29yZElkZW50aXR5KSB7XHJcbiAgICBsZXQgZXhwcmVzc2lvbjogRmluZFJlY29yZCA9IHtcclxuICAgICAgb3A6ICdmaW5kUmVjb3JkJyxcclxuICAgICAgcmVjb3JkXHJcbiAgICB9O1xyXG5cclxuICAgIHN1cGVyKGV4cHJlc3Npb24pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEZpbmRSZWxhdGVkUmVjb3JkVGVybSBleHRlbmRzIFF1ZXJ5VGVybSB7XHJcbiAgZXhwcmVzc2lvbjogRmluZFJlbGF0ZWRSZWNvcmQ7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHJlY29yZDogUmVjb3JkSWRlbnRpdHksIHJlbGF0aW9uc2hpcDogc3RyaW5nKSB7XHJcbiAgICBsZXQgZXhwcmVzc2lvbjogRmluZFJlbGF0ZWRSZWNvcmQgPSB7XHJcbiAgICAgIG9wOiAnZmluZFJlbGF0ZWRSZWNvcmQnLFxyXG4gICAgICByZWNvcmQsXHJcbiAgICAgIHJlbGF0aW9uc2hpcFxyXG4gICAgfTtcclxuXHJcbiAgICBzdXBlcihleHByZXNzaW9uKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBGaW5kUmVsYXRlZFJlY29yZHNUZXJtIGV4dGVuZHMgUXVlcnlUZXJtIHtcclxuICBleHByZXNzaW9uOiBGaW5kUmVsYXRlZFJlY29yZHM7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHJlY29yZDogUmVjb3JkSWRlbnRpdHksIHJlbGF0aW9uc2hpcDogc3RyaW5nKSB7XHJcbiAgICBsZXQgZXhwcmVzc2lvbjogRmluZFJlbGF0ZWRSZWNvcmRzID0ge1xyXG4gICAgICBvcDogJ2ZpbmRSZWxhdGVkUmVjb3JkcycsXHJcbiAgICAgIHJlY29yZCxcclxuICAgICAgcmVsYXRpb25zaGlwXHJcbiAgICB9O1xyXG5cclxuICAgIHN1cGVyKGV4cHJlc3Npb24pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEZpbmRSZWNvcmRzVGVybSBleHRlbmRzIFF1ZXJ5VGVybSB7XHJcbiAgZXhwcmVzc2lvbjogRmluZFJlY29yZHM7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHR5cGU/OiBzdHJpbmcpIHtcclxuICAgIGxldCBleHByZXNzaW9uOiBGaW5kUmVjb3JkcyA9IHtcclxuICAgICAgb3A6ICdmaW5kUmVjb3JkcycsXHJcbiAgICAgIHR5cGVcclxuICAgIH07XHJcblxyXG4gICAgc3VwZXIoZXhwcmVzc2lvbik7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBBcHBsaWVzIHNvcnRpbmcgdG8gYSBjb2xsZWN0aW9uIHF1ZXJ5LlxyXG4gICAqXHJcbiAgICogU29ydCBzcGVjaWZpZXJzIGNhbiBiZSBleHByZXNzZWQgaW4gb2JqZWN0IGZvcm0sIGxpa2U6XHJcbiAgICpcclxuICAgKiBgYGB0c1xyXG4gICAqIHsgYXR0cmlidXRlOiAnbmFtZScsIG9yZGVyOiAnZGVzY2VuZGluZycgfVxyXG4gICAqIHsgYXR0cmlidXRlOiAnbmFtZScsIG9yZGVyOiAnYXNjZW5kaW5nJyB9XHJcbiAgICogYGBgXHJcbiAgICpcclxuICAgKiBPciBpbiBzdHJpbmcgZm9ybSwgbGlrZTpcclxuICAgKlxyXG4gICAqIGBgYHRzXHJcbiAgICogJy1uYW1lJyAvLyBkZXNjZW5kaW5nIG9yZGVyXHJcbiAgICogJ25hbWUnICAvLyBhc2NlbmRpbmcgb3JkZXJcclxuICAgKiBgYGBcclxuICAgKlxyXG4gICAqIEBwYXJhbSB7U29ydFNwZWNpZmllcltdIHwgc3RyaW5nW119IHNvcnRTcGVjaWZpZXJzXHJcbiAgICogQHJldHVybnMge1JlY29yZHNUZXJtfVxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIFJlY29yZHNUZXJtXHJcbiAgICovXHJcbiAgc29ydCguLi5zb3J0U3BlY2lmaWVycyk6IEZpbmRSZWNvcmRzVGVybSB7XHJcbiAgICBjb25zdCBzcGVjaWZpZXJzID0gc29ydFNwZWNpZmllcnMubWFwKHBhcnNlU29ydFNwZWNpZmllcik7XHJcbiAgICB0aGlzLmV4cHJlc3Npb24uc29ydCA9ICh0aGlzLmV4cHJlc3Npb24uc29ydCB8fCBbXSkuY29uY2F0KHNwZWNpZmllcnMpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBBcHBsaWVzIHBhZ2luYXRpb24gdG8gYSBjb2xsZWN0aW9uIHF1ZXJ5LlxyXG4gICAqXHJcbiAgICogTm90ZTogT3B0aW9ucyBhcmUgY3VycmVudGx5IGFuIG9wYXF1ZSBwYXNzLXRocm91Z2ggdG8gcmVtb3RlIHNvdXJjZXMuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge29iamVjdH0gb3B0aW9uc1xyXG4gICAqIEByZXR1cm5zIHtSZWNvcmRzVGVybX1cclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBSZWNvcmRzVGVybVxyXG4gICAqL1xyXG4gIHBhZ2Uob3B0aW9uczogUGFnZVNwZWNpZmllcik6IEZpbmRSZWNvcmRzVGVybSB7XHJcbiAgICB0aGlzLmV4cHJlc3Npb24ucGFnZSA9IG9wdGlvbnM7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEFwcGx5IGFuIGFkdmFuY2VkIGZpbHRlciBleHByZXNzaW9uIGJhc2VkIG9uIGEgYFJlY29yZEN1cnNvcmAuXHJcbiAgICpcclxuICAgKiBGb3IgZXhhbXBsZTpcclxuICAgKlxyXG4gICAqIGBgYHRzXHJcbiAgICogb3FiXHJcbiAgICogICAucmVjb3JkcygncGxhbmV0JylcclxuICAgKiAgIC5maWx0ZXIocmVjb3JkID0+XHJcbiAgICogICAgIG9xYi5vcihcclxuICAgKiAgICAgICByZWNvcmQuYXR0cmlidXRlKCduYW1lJykuZXF1YWwoJ0p1cGl0ZXInKSxcclxuICAgKiAgICAgICByZWNvcmQuYXR0cmlidXRlKCduYW1lJykuZXF1YWwoJ1BsdXRvJylcclxuICAgKiAgICAgKVxyXG4gICAqICAgKVxyXG4gICAqIGBgYFxyXG4gICAqXHJcbiAgICogQHBhcmFtIHsoUmVjb3JkQ3Vyc29yKSA9PiB2b2lkfSBwcmVkaWNhdGVFeHByZXNzaW9uXHJcbiAgICogQHJldHVybnMge1JlY29yZHNUZXJtfVxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIFJlY29yZHNUZXJtXHJcbiAgICovXHJcbiAgZmlsdGVyKC4uLmZpbHRlclNwZWNpZmllcnMpOiBGaW5kUmVjb3Jkc1Rlcm0ge1xyXG4gICAgY29uc3QgZXhwcmVzc2lvbnMgPSBmaWx0ZXJTcGVjaWZpZXJzLm1hcChwYXJzZUZpbHRlclNwZWNpZmllcik7XHJcbiAgICB0aGlzLmV4cHJlc3Npb24uZmlsdGVyID0gKHRoaXMuZXhwcmVzc2lvbi5maWx0ZXIgfHwgW10pLmNvbmNhdChmaWx0ZXJTcGVjaWZpZXJzKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gcGFyc2VGaWx0ZXJTcGVjaWZpZXIoZmlsdGVyU3BlY2lmaWVyOiBGaWx0ZXJTcGVjaWZpZXIpOiBGaWx0ZXJTcGVjaWZpZXIge1xyXG4gIGlmIChpc09iamVjdChmaWx0ZXJTcGVjaWZpZXIpKSB7XHJcbiAgICBsZXQgcyA9IGZpbHRlclNwZWNpZmllciBhcyBGaWx0ZXJTcGVjaWZpZXI7XHJcbiAgICBzLmtpbmQgPSBzLmtpbmQgfHwgJ2F0dHJpYnV0ZSc7XHJcbiAgICBzLm9wID0gcy5vcCB8fCAnZXF1YWwnO1xyXG4gICAgcmV0dXJuIHM7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZVNvcnRTcGVjaWZpZXIoc29ydFNwZWNpZmllcjogU29ydFNwZWNpZmllciB8IHN0cmluZyk6IFNvcnRTcGVjaWZpZXIge1xyXG4gIGlmIChpc09iamVjdChzb3J0U3BlY2lmaWVyKSkge1xyXG4gICAgbGV0IHMgPSBzb3J0U3BlY2lmaWVyIGFzIFNvcnRTcGVjaWZpZXI7XHJcbiAgICBzLmtpbmQgPSBzLmtpbmQgfHwgJ2F0dHJpYnV0ZSc7XHJcbiAgICBzLm9yZGVyID0gcy5vcmRlciB8fCAnYXNjZW5kaW5nJztcclxuICAgIHJldHVybiBzO1xyXG4gIH0gZWxzZSBpZiAodHlwZW9mIHNvcnRTcGVjaWZpZXIgPT09ICdzdHJpbmcnKSB7XHJcbiAgICByZXR1cm4gcGFyc2VTb3J0U3BlY2lmaWVyU3RyaW5nKHNvcnRTcGVjaWZpZXIpO1xyXG4gIH1cclxuICB0aHJvdyBuZXcgRXJyb3IoJ1NvcnQgZXhwcmVzc2lvbiBtdXN0IGJlIGVpdGhlciBhbiBvYmplY3Qgb3IgYSBzdHJpbmcuJyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBhcnNlU29ydFNwZWNpZmllclN0cmluZyhzb3J0U3BlY2lmaWVyOiBzdHJpbmcpOiBBdHRyaWJ1dGVTb3J0U3BlY2lmaWVyICB7XHJcbiAgbGV0IGF0dHJpYnV0ZTtcclxuICBsZXQgb3JkZXI7XHJcblxyXG4gIGlmIChzb3J0U3BlY2lmaWVyWzBdID09PSAnLScpIHtcclxuICAgIGF0dHJpYnV0ZSA9IHNvcnRTcGVjaWZpZXIuc2xpY2UoMSk7XHJcbiAgICBvcmRlciA9ICdkZXNjZW5kaW5nJztcclxuICB9IGVsc2Uge1xyXG4gICAgYXR0cmlidXRlID0gc29ydFNwZWNpZmllcjtcclxuICAgIG9yZGVyID0gJ2FzY2VuZGluZyc7XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAga2luZDogJ2F0dHJpYnV0ZScsXHJcbiAgICBhdHRyaWJ1dGUsXHJcbiAgICBvcmRlclxyXG4gIH07XHJcbn1cclxuIl19