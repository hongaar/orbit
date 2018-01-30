"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@orbit/utils");
var core_1 = require("@orbit/core");
var source_1 = require("../source");
var query_1 = require("../query");
exports.PULLABLE = '__pullable__';
/**
 * Has a source been decorated as `@pullable`?
 *
 * @export
 * @param {Source} source
 * @returns
 */
function isPullable(source) {
    return !!source[exports.PULLABLE];
}
exports.isPullable = isPullable;
/**
 * Marks a source as "pullable" and adds an implementation of the `Pullable`
 * interface.
 *
 * The `pull` method is part of the "request flow" in Orbit. Requests trigger
 * events before and after processing of each request. Observers can delay the
 * resolution of a request by returning a promise in an event listener.
 *
 * A pullable source emits the following events:
 *
 * - `beforePull` - emitted prior to the processing of `pull`, this event
 * includes the requested `Query` as an argument.
 *
 * - `pull` - emitted after a `pull` has successfully been requested, this
 * event's arguments include both the requested `Query` and an array of the
 * resulting `Transform` instances.
 *
 * - `pullFail` - emitted when an error has occurred processing a `pull`, this
 * event's arguments include both the requested `Query` and the error.
 *
 * A pullable source must implement a private method `_pull`, which performs
 * the processing required for `pull` and returns a promise that resolves to an
 * array of `Transform` instances.
 *
 * @export
 * @decorator
 * @param {SourceClass} Klass
 * @returns {void}
 */
function pullable(Klass) {
    var proto = Klass.prototype;
    if (isPullable(proto)) {
        return;
    }
    utils_1.assert('Pullable interface can only be applied to a Source', proto instanceof source_1.Source);
    proto[exports.PULLABLE] = true;
    proto.pull = function (queryOrExpression, options, id) {
        var query = query_1.buildQuery(queryOrExpression, options, id, this.queryBuilder);
        return this._enqueueRequest('pull', query);
    };
    proto.__pull__ = function (query) {
        var _this = this;
        return core_1.fulfillInSeries(this, 'beforePull', query).then(function () {
            return _this._pull(query);
        }).then(function (result) {
            return _this._transformed(result);
        }).then(function (result) {
            return core_1.settleInSeries(_this, 'pull', query, result).then(function () {
                return result;
            });
        }).catch(function (error) {
            return core_1.settleInSeries(_this, 'pullFail', query, error).then(function () {
                throw error;
            });
        });
    };
}
exports.default = pullable;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVsbGFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvc291cmNlLWludGVyZmFjZXMvcHVsbGFibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsc0JBQXNDO0FBQ3RDLHFCQUE4RDtBQUM5RCx1QkFBZ0Q7QUFDaEQsc0JBQWdFO0FBR25ELFFBQUEsQUFBUSxXQUFHLEFBQWMsQUFBQztBQUV2QyxBQU1HOzs7Ozs7O0FBQ0gsb0JBQTJCLEFBQWM7QUFDdkMsQUFBTSxXQUFDLENBQUMsQ0FBQyxBQUFNLE9BQUMsUUFBUSxBQUFDLEFBQUMsQUFDNUI7QUFBQztBQUZELHFCQUVDO0FBNEJELEFBNEJHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNILGtCQUFpQyxBQUFrQjtBQUNqRCxRQUFJLEFBQUssUUFBRyxBQUFLLE1BQUMsQUFBUyxBQUFDO0FBRTVCLEFBQUUsQUFBQyxRQUFDLEFBQVUsV0FBQyxBQUFLLEFBQUMsQUFBQyxRQUFDLEFBQUM7QUFDdEIsQUFBTSxBQUFDLEFBQ1Q7QUFBQztBQUVELFlBQU0sT0FBQyxBQUFvRCxzREFBRSxBQUFLLGlCQUFZLFNBQU0sQUFBQyxBQUFDO0FBRXRGLEFBQUssVUFBQyxRQUFRLEFBQUMsWUFBRyxBQUFJLEFBQUM7QUFFdkIsQUFBSyxVQUFDLEFBQUksT0FBRyxVQUFTLEFBQW9DLG1CQUFFLEFBQWdCLFNBQUUsQUFBVztBQUN2RixZQUFNLEFBQUssUUFBRyxRQUFVLFdBQUMsQUFBaUIsbUJBQUUsQUFBTyxTQUFFLEFBQUUsSUFBRSxBQUFJLEtBQUMsQUFBWSxBQUFDLEFBQUM7QUFDNUUsQUFBTSxlQUFDLEFBQUksS0FBQyxBQUFlLGdCQUFDLEFBQU0sUUFBRSxBQUFLLEFBQUMsQUFBQyxBQUM3QztBQUFDO0FBRUQsQUFBSyxVQUFDLEFBQVEsV0FBRyxVQUFTLEFBQVk7QUFBckIsb0JBWWhCO0FBWEMsQUFBTSxzQkFBZ0IsZ0JBQUMsQUFBSSxNQUFFLEFBQVksY0FBRSxBQUFLLEFBQUMsT0FDOUMsQUFBSSxLQUFDO0FBQU0sbUJBQUEsQUFBSSxNQUFDLEFBQUssTUFBVixBQUFXLEFBQUssQUFBQztBQUFBLEFBQUMsU0FEekIsRUFFSixBQUFJLEtBQUMsVUFBQSxBQUFNO0FBQUksbUJBQUEsQUFBSSxNQUFDLEFBQVksYUFBakIsQUFBa0IsQUFBTSxBQUFDO0FBQUEsQUFBQyxXQUN6QyxBQUFJLEtBQUMsVUFBQSxBQUFNO0FBQ1YsQUFBTSwwQkFBZSxlQUFDLEFBQUksT0FBRSxBQUFNLFFBQUUsQUFBSyxPQUFFLEFBQU0sQUFBQyxRQUMvQyxBQUFJLEtBQUM7QUFBTSx1QkFBQSxBQUFNO0FBQUEsQUFBQyxBQUFDLEFBQ3hCLGFBRlM7QUFFUixBQUFDLFdBQ0QsQUFBSyxNQUFDLFVBQUEsQUFBSztBQUNWLEFBQU0sMEJBQWUsZUFBQyxBQUFJLE9BQUUsQUFBVSxZQUFFLEFBQUssT0FBRSxBQUFLLEFBQUMsT0FDbEQsQUFBSSxLQUFDO0FBQVEsc0JBQU0sQUFBSyxBQUFDLEFBQUM7QUFBQyxBQUFDLEFBQUMsQUFDbEMsYUFGUztBQUVSLEFBQUMsQUFBQyxBQUNQO0FBQUMsQUFDSDtBQUFDO0FBN0JELGtCQTZCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGFzc2VydCB9IGZyb20gJ0BvcmJpdC91dGlscyc7XHJcbmltcG9ydCB7IHNldHRsZUluU2VyaWVzLCBmdWxmaWxsSW5TZXJpZXMgfSBmcm9tICdAb3JiaXQvY29yZSc7XHJcbmltcG9ydCB7IFNvdXJjZSwgU291cmNlQ2xhc3MgfSBmcm9tICcuLi9zb3VyY2UnO1xyXG5pbXBvcnQgeyBRdWVyeSwgUXVlcnlPckV4cHJlc3Npb24sIGJ1aWxkUXVlcnkgfSBmcm9tICcuLi9xdWVyeSc7XHJcbmltcG9ydCB7IFRyYW5zZm9ybSB9IGZyb20gJy4uL3RyYW5zZm9ybSc7XHJcblxyXG5leHBvcnQgY29uc3QgUFVMTEFCTEUgPSAnX19wdWxsYWJsZV9fJztcclxuXHJcbi8qKlxyXG4gKiBIYXMgYSBzb3VyY2UgYmVlbiBkZWNvcmF0ZWQgYXMgYEBwdWxsYWJsZWA/XHJcbiAqXHJcbiAqIEBleHBvcnRcclxuICogQHBhcmFtIHtTb3VyY2V9IHNvdXJjZVxyXG4gKiBAcmV0dXJuc1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGlzUHVsbGFibGUoc291cmNlOiBTb3VyY2UpIHtcclxuICByZXR1cm4gISFzb3VyY2VbUFVMTEFCTEVdO1xyXG59XHJcblxyXG4vKipcclxuICogQSBzb3VyY2UgZGVjb3JhdGVkIGFzIGBAcHVsbGFibGVgIG11c3QgYWxzbyBpbXBsZW1lbnQgdGhlIGBQdWxsYWJsZWBcclxuICogaW50ZXJmYWNlLlxyXG4gKlxyXG4gKiBAZXhwb3J0XHJcbiAqIEBpbnRlcmZhY2UgUHVsbGFibGVcclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgUHVsbGFibGUge1xyXG4gIC8qKlxyXG4gICAqIFRoZSBgcHVsbGAgbWV0aG9kIGFjY2VwdHMgYSBxdWVyeSBvciBleHByZXNzaW9uIGFuZCByZXR1cm5zIGEgcHJvbWlzZSB0aGF0XHJcbiAgICogcmVzb2x2ZXMgdG8gYW4gYXJyYXkgb2YgYFRyYW5zZm9ybWAgaW5zdGFuY2VzIHRoYXQgcmVwcmVzZW50IHRoZSBjaGFuZ2VzZXRcclxuICAgKiB0aGF0IHJlc3VsdGVkIGZyb20gYXBwbHlpbmcgdGhlIHF1ZXJ5LiBJbiBvdGhlciB3b3JkcywgYSBgcHVsbGAgcmVxdWVzdFxyXG4gICAqIHJldHJpZXZlcyB0aGUgcmVzdWx0cyBvZiBhIHF1ZXJ5IGluIGBUcmFuc2Zvcm1gIGZvcm0uXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge1F1ZXJ5T3JFeHByZXNzaW9ufSBxdWVyeU9yRXhwcmVzc2lvblxyXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9uc11cclxuICAgKiBAcGFyYW0ge3N0cmluZ30gW2lkXVxyXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPFRyYW5zZm9ybVtdPn1cclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBQdWxsYWJsZVxyXG4gICAqL1xyXG4gIHB1bGwocXVlcnlPckV4cHJlc3Npb246IFF1ZXJ5T3JFeHByZXNzaW9uLCBvcHRpb25zPzogb2JqZWN0LCBpZD86IHN0cmluZyk6IFByb21pc2U8VHJhbnNmb3JtW10+O1xyXG5cclxuICBfcHVsbChxdWVyeTogUXVlcnkpOiBQcm9taXNlPFRyYW5zZm9ybVtdPjtcclxufVxyXG5cclxuLyoqXHJcbiAqIE1hcmtzIGEgc291cmNlIGFzIFwicHVsbGFibGVcIiBhbmQgYWRkcyBhbiBpbXBsZW1lbnRhdGlvbiBvZiB0aGUgYFB1bGxhYmxlYFxyXG4gKiBpbnRlcmZhY2UuXHJcbiAqXHJcbiAqIFRoZSBgcHVsbGAgbWV0aG9kIGlzIHBhcnQgb2YgdGhlIFwicmVxdWVzdCBmbG93XCIgaW4gT3JiaXQuIFJlcXVlc3RzIHRyaWdnZXJcclxuICogZXZlbnRzIGJlZm9yZSBhbmQgYWZ0ZXIgcHJvY2Vzc2luZyBvZiBlYWNoIHJlcXVlc3QuIE9ic2VydmVycyBjYW4gZGVsYXkgdGhlXHJcbiAqIHJlc29sdXRpb24gb2YgYSByZXF1ZXN0IGJ5IHJldHVybmluZyBhIHByb21pc2UgaW4gYW4gZXZlbnQgbGlzdGVuZXIuXHJcbiAqXHJcbiAqIEEgcHVsbGFibGUgc291cmNlIGVtaXRzIHRoZSBmb2xsb3dpbmcgZXZlbnRzOlxyXG4gKlxyXG4gKiAtIGBiZWZvcmVQdWxsYCAtIGVtaXR0ZWQgcHJpb3IgdG8gdGhlIHByb2Nlc3Npbmcgb2YgYHB1bGxgLCB0aGlzIGV2ZW50XHJcbiAqIGluY2x1ZGVzIHRoZSByZXF1ZXN0ZWQgYFF1ZXJ5YCBhcyBhbiBhcmd1bWVudC5cclxuICpcclxuICogLSBgcHVsbGAgLSBlbWl0dGVkIGFmdGVyIGEgYHB1bGxgIGhhcyBzdWNjZXNzZnVsbHkgYmVlbiByZXF1ZXN0ZWQsIHRoaXNcclxuICogZXZlbnQncyBhcmd1bWVudHMgaW5jbHVkZSBib3RoIHRoZSByZXF1ZXN0ZWQgYFF1ZXJ5YCBhbmQgYW4gYXJyYXkgb2YgdGhlXHJcbiAqIHJlc3VsdGluZyBgVHJhbnNmb3JtYCBpbnN0YW5jZXMuXHJcbiAqXHJcbiAqIC0gYHB1bGxGYWlsYCAtIGVtaXR0ZWQgd2hlbiBhbiBlcnJvciBoYXMgb2NjdXJyZWQgcHJvY2Vzc2luZyBhIGBwdWxsYCwgdGhpc1xyXG4gKiBldmVudCdzIGFyZ3VtZW50cyBpbmNsdWRlIGJvdGggdGhlIHJlcXVlc3RlZCBgUXVlcnlgIGFuZCB0aGUgZXJyb3IuXHJcbiAqXHJcbiAqIEEgcHVsbGFibGUgc291cmNlIG11c3QgaW1wbGVtZW50IGEgcHJpdmF0ZSBtZXRob2QgYF9wdWxsYCwgd2hpY2ggcGVyZm9ybXNcclxuICogdGhlIHByb2Nlc3NpbmcgcmVxdWlyZWQgZm9yIGBwdWxsYCBhbmQgcmV0dXJucyBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byBhblxyXG4gKiBhcnJheSBvZiBgVHJhbnNmb3JtYCBpbnN0YW5jZXMuXHJcbiAqXHJcbiAqIEBleHBvcnRcclxuICogQGRlY29yYXRvclxyXG4gKiBAcGFyYW0ge1NvdXJjZUNsYXNzfSBLbGFzc1xyXG4gKiBAcmV0dXJucyB7dm9pZH1cclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHB1bGxhYmxlKEtsYXNzOiBTb3VyY2VDbGFzcyk6IHZvaWQge1xyXG4gIGxldCBwcm90byA9IEtsYXNzLnByb3RvdHlwZTtcclxuXHJcbiAgaWYgKGlzUHVsbGFibGUocHJvdG8pKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICBhc3NlcnQoJ1B1bGxhYmxlIGludGVyZmFjZSBjYW4gb25seSBiZSBhcHBsaWVkIHRvIGEgU291cmNlJywgcHJvdG8gaW5zdGFuY2VvZiBTb3VyY2UpO1xyXG5cclxuICBwcm90b1tQVUxMQUJMRV0gPSB0cnVlO1xyXG5cclxuICBwcm90by5wdWxsID0gZnVuY3Rpb24ocXVlcnlPckV4cHJlc3Npb246IFF1ZXJ5T3JFeHByZXNzaW9uLCBvcHRpb25zPzogb2JqZWN0LCBpZD86IHN0cmluZyk6IFByb21pc2U8VHJhbnNmb3JtW10+IHtcclxuICAgIGNvbnN0IHF1ZXJ5ID0gYnVpbGRRdWVyeShxdWVyeU9yRXhwcmVzc2lvbiwgb3B0aW9ucywgaWQsIHRoaXMucXVlcnlCdWlsZGVyKTtcclxuICAgIHJldHVybiB0aGlzLl9lbnF1ZXVlUmVxdWVzdCgncHVsbCcsIHF1ZXJ5KTtcclxuICB9XHJcblxyXG4gIHByb3RvLl9fcHVsbF9fID0gZnVuY3Rpb24ocXVlcnk6IFF1ZXJ5KTogUHJvbWlzZTxUcmFuc2Zvcm1bXT4ge1xyXG4gICAgcmV0dXJuIGZ1bGZpbGxJblNlcmllcyh0aGlzLCAnYmVmb3JlUHVsbCcsIHF1ZXJ5KVxyXG4gICAgICAudGhlbigoKSA9PiB0aGlzLl9wdWxsKHF1ZXJ5KSlcclxuICAgICAgLnRoZW4ocmVzdWx0ID0+IHRoaXMuX3RyYW5zZm9ybWVkKHJlc3VsdCkpXHJcbiAgICAgIC50aGVuKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHNldHRsZUluU2VyaWVzKHRoaXMsICdwdWxsJywgcXVlcnksIHJlc3VsdClcclxuICAgICAgICAgIC50aGVuKCgpID0+IHJlc3VsdCk7XHJcbiAgICAgIH0pXHJcbiAgICAgIC5jYXRjaChlcnJvciA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHNldHRsZUluU2VyaWVzKHRoaXMsICdwdWxsRmFpbCcsIHF1ZXJ5LCBlcnJvcilcclxuICAgICAgICAgIC50aGVuKCgpID0+IHsgdGhyb3cgZXJyb3I7IH0pO1xyXG4gICAgICB9KTtcclxuICB9XHJcbn1cclxuIl19