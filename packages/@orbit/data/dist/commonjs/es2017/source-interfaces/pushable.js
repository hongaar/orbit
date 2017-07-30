"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var main_1 = require("../main");
var utils_1 = require("@orbit/utils");
var core_1 = require("@orbit/core");
var source_1 = require("../source");
var transform_1 = require("../transform");
exports.PUSHABLE = '__pushable__';
/**
 * Has a source been decorated as `@pushable`?
 *
 * @export
 * @param {Source} source
 * @returns
 */
function isPushable(source) {
    return !!source[exports.PUSHABLE];
}
exports.isPushable = isPushable;
/**
 * Marks a source as "pushable" and adds an implementation of the `Pushable`
 * interface.
 *
 * The `push` method is part of the "request flow" in Orbit. Requests trigger
 * events before and after processing of each request. Observers can delay the
 * resolution of a request by returning a promise in an event listener.
 *
 * A pushable source emits the following events:
 *
 * - `beforePush` - emitted prior to the processing of `push`, this event
 * includes the requested `Transform` as an argument.
 *
 * - `push` - emitted after a `push` has successfully been applied, this event's
 * arguments include both the requested `Transform` and an array of the actual
 * applied `Transform` instances.
 *
 * - `pushFail` - emitted when an error has occurred pushing a transform, this
 * event's arguments include both the requested `Transform` and the error.
 *
 * A pushable source must implement a private method `_push`, which performs
 * the processing required for `push` and returns a promise that resolves to an
 * array of `Transform` instances.
 *
 * @export
 * @decorator
 * @param {SourceClass} Klass
 * @returns {void}
 */
function pushable(Klass) {
    var proto = Klass.prototype;
    if (isPushable(proto)) {
        return;
    }
    utils_1.assert('Pushable interface can only be applied to a Source', proto instanceof source_1.Source);
    proto[exports.PUSHABLE] = true;
    proto.push = function (transformOrOperations, options, id) {
        var transform = transform_1.buildTransform(transformOrOperations, options, id, this.transformBuilder);
        if (this.transformLog.contains(transform.id)) {
            return main_1.default.Promise.resolve([]);
        }
        return this._enqueueRequest('push', transform);
    };
    proto.__push__ = function (transform) {
        var _this = this;
        if (this.transformLog.contains(transform.id)) {
            return main_1.default.Promise.resolve([]);
        }
        return core_1.fulfillInSeries(this, 'beforePush', transform).then(function () {
            if (_this.transformLog.contains(transform.id)) {
                return main_1.default.Promise.resolve([]);
            } else {
                return _this._push(transform).then(function (result) {
                    return _this._transformed(result).then(function () {
                        return core_1.settleInSeries(_this, 'push', transform, result);
                    }).then(function () {
                        return result;
                    });
                });
            }
        }).catch(function (error) {
            return core_1.settleInSeries(_this, 'pushFail', transform, error).then(function () {
                throw error;
            });
        });
    };
}
exports.default = pushable;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVzaGFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvc291cmNlLWludGVyZmFjZXMvcHVzaGFibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUJBQTRCO0FBQzVCLHNCQUFzQztBQUN0QyxxQkFBOEQ7QUFDOUQsdUJBQWdEO0FBQ2hELDBCQUFnRjtBQUVuRSxRQUFBLEFBQVEsV0FBRyxBQUFjLEFBQUM7QUFFdkMsQUFNRzs7Ozs7OztBQUNILG9CQUEyQixBQUFjO0FBQ3ZDLEFBQU0sV0FBQyxDQUFDLENBQUMsQUFBTSxPQUFDLFFBQVEsQUFBQyxBQUFDLEFBQzVCO0FBQUM7QUFGRCxxQkFFQztBQTRCRCxBQTRCRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDSCxrQkFBaUMsQUFBa0I7QUFDakQsUUFBSSxBQUFLLFFBQUcsQUFBSyxNQUFDLEFBQVMsQUFBQztBQUU1QixBQUFFLEFBQUMsUUFBQyxBQUFVLFdBQUMsQUFBSyxBQUFDLEFBQUMsUUFBQyxBQUFDO0FBQ3RCLEFBQU0sQUFBQyxBQUNUO0FBQUM7QUFFRCxZQUFNLE9BQUMsQUFBb0Qsc0RBQUUsQUFBSyxpQkFBWSxTQUFNLEFBQUMsQUFBQztBQUV0RixBQUFLLFVBQUMsUUFBUSxBQUFDLFlBQUcsQUFBSSxBQUFDO0FBRXZCLEFBQUssVUFBQyxBQUFJLE9BQUcsVUFBUyxBQUE0Qyx1QkFBRSxBQUFnQixTQUFFLEFBQVc7QUFDL0YsWUFBTSxBQUFTLFlBQUcsWUFBYyxlQUFDLEFBQXFCLHVCQUFFLEFBQU8sU0FBRSxBQUFFLElBQUUsQUFBSSxLQUFDLEFBQWdCLEFBQUMsQUFBQztBQUU1RixBQUFFLEFBQUMsWUFBQyxBQUFJLEtBQUMsQUFBWSxhQUFDLEFBQVEsU0FBQyxBQUFTLFVBQUMsQUFBRSxBQUFDLEFBQUMsS0FBQyxBQUFDO0FBQzdDLEFBQU0sbUJBQUMsT0FBSyxRQUFDLEFBQU8sUUFBQyxBQUFPLFFBQUMsQUFBRSxBQUFDLEFBQUMsQUFDbkM7QUFBQztBQUVELEFBQU0sZUFBQyxBQUFJLEtBQUMsQUFBZSxnQkFBQyxBQUFNLFFBQUUsQUFBUyxBQUFDLEFBQUMsQUFDakQ7QUFBQztBQUVELEFBQUssVUFBQyxBQUFRLFdBQUcsVUFBUyxBQUFvQjtBQUE3QixvQkFzQmhCO0FBckJDLEFBQUUsQUFBQyxZQUFDLEFBQUksS0FBQyxBQUFZLGFBQUMsQUFBUSxTQUFDLEFBQVMsVUFBQyxBQUFFLEFBQUMsQUFBQyxLQUFDLEFBQUM7QUFDN0MsQUFBTSxtQkFBQyxPQUFLLFFBQUMsQUFBTyxRQUFDLEFBQU8sUUFBQyxBQUFFLEFBQUMsQUFBQyxBQUNuQztBQUFDO0FBRUQsQUFBTSxzQkFBZ0IsZ0JBQUMsQUFBSSxNQUFFLEFBQVksY0FBRSxBQUFTLEFBQUMsV0FDbEQsQUFBSSxLQUFDO0FBQ0osQUFBRSxBQUFDLGdCQUFDLEFBQUksTUFBQyxBQUFZLGFBQUMsQUFBUSxTQUFDLEFBQVMsVUFBQyxBQUFFLEFBQUMsQUFBQyxLQUFDLEFBQUM7QUFDN0MsQUFBTSx1QkFBQyxPQUFLLFFBQUMsQUFBTyxRQUFDLEFBQU8sUUFBQyxBQUFFLEFBQUMsQUFBQyxBQUNuQztBQUFDLEFBQUMsQUFBSSxtQkFBQyxBQUFDO0FBQ04sQUFBTSw2QkFBTSxBQUFLLE1BQUMsQUFBUyxBQUFDLFdBQ3pCLEFBQUksS0FBQyxVQUFBLEFBQU07QUFDVixBQUFNLGlDQUFNLEFBQVksYUFBQyxBQUFNLEFBQUMsUUFDN0IsQUFBSSxLQUFDO0FBQU0sK0JBQUEsT0FBYyxlQUFDLEFBQUksT0FBRSxBQUFNLFFBQUUsQUFBUyxXQUF0QyxBQUF3QyxBQUFNLEFBQUM7QUFBQSxBQUFDLHFCQUR2RCxBQUFJLEVBRVIsQUFBSSxLQUFDO0FBQU0sK0JBQUEsQUFBTTtBQUFBLEFBQUMsQUFBQyxBQUN4QjtBQUFDLEFBQUMsQUFDTixpQkFOUyxBQUFJO0FBTVosQUFDSDtBQUFDLEFBQUMsU0FaRyxFQWFKLEFBQUssTUFBQyxVQUFBLEFBQUs7QUFDVixBQUFNLDBCQUFlLGVBQUMsQUFBSSxPQUFFLEFBQVUsWUFBRSxBQUFTLFdBQUUsQUFBSyxBQUFDLE9BQ3RELEFBQUksS0FBQztBQUFRLHNCQUFNLEFBQUssQUFBQyxBQUFDO0FBQUMsQUFBQyxBQUFDLEFBQ2xDLGFBRlM7QUFFUixBQUFDLEFBQUMsQUFDUDtBQUFDLEFBQ0g7QUFBQztBQTVDRCxrQkE0Q0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgT3JiaXQgZnJvbSAnLi4vbWFpbic7XHJcbmltcG9ydCB7IGFzc2VydCB9IGZyb20gJ0BvcmJpdC91dGlscyc7XHJcbmltcG9ydCB7IHNldHRsZUluU2VyaWVzLCBmdWxmaWxsSW5TZXJpZXMgfSBmcm9tICdAb3JiaXQvY29yZSc7XHJcbmltcG9ydCB7IFNvdXJjZSwgU291cmNlQ2xhc3MgfSBmcm9tICcuLi9zb3VyY2UnO1xyXG5pbXBvcnQgeyBUcmFuc2Zvcm0sIFRyYW5zZm9ybU9yT3BlcmF0aW9ucywgYnVpbGRUcmFuc2Zvcm0gfSBmcm9tICcuLi90cmFuc2Zvcm0nO1xyXG5cclxuZXhwb3J0IGNvbnN0IFBVU0hBQkxFID0gJ19fcHVzaGFibGVfXyc7XHJcblxyXG4vKipcclxuICogSGFzIGEgc291cmNlIGJlZW4gZGVjb3JhdGVkIGFzIGBAcHVzaGFibGVgP1xyXG4gKlxyXG4gKiBAZXhwb3J0XHJcbiAqIEBwYXJhbSB7U291cmNlfSBzb3VyY2VcclxuICogQHJldHVybnNcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBpc1B1c2hhYmxlKHNvdXJjZTogU291cmNlKSB7XHJcbiAgcmV0dXJuICEhc291cmNlW1BVU0hBQkxFXTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEEgc291cmNlIGRlY29yYXRlZCBhcyBgQHB1c2hhYmxlYCBtdXN0IGFsc28gaW1wbGVtZW50IHRoZSBgUHVzaGFibGVgXHJcbiAqIGludGVyZmFjZS5cclxuICpcclxuICogQGV4cG9ydFxyXG4gKiBAaW50ZXJmYWNlIFB1c2hhYmxlXHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIFB1c2hhYmxlIHtcclxuICAvKipcclxuICAgKiBUaGUgYHB1c2hgIG1ldGhvZCBhY2NlcHRzIGEgYFRyYW5zZm9ybWAgaW5zdGFuY2UgYXMgYW4gYXJndW1lbnQgYW5kIHJldHVybnNcclxuICAgKiBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byBhbiBhcnJheSBvZiBgVHJhbnNmb3JtYCBpbnN0YW5jZXMgdGhhdCBhcmVcclxuICAgKiBhcHBsaWVkIGFzIGEgcmVzdWx0LiBJbiBvdGhlciB3b3JkcywgYHB1c2hgIGNhcHR1cmVzIHRoZSBkaXJlY3QgcmVzdWx0c1xyXG4gICAqIF9hbmRfIHNpZGUgZWZmZWN0cyBvZiBhcHBseWluZyBhIGBUcmFuc2Zvcm1gIHRvIGEgc291cmNlLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtUcmFuc2Zvcm1Pck9wZXJhdGlvbnN9IHRyYW5zZm9ybU9yT3BlcmF0aW9uc1xyXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9uc11cclxuICAgKiBAcGFyYW0ge3N0cmluZ30gW2lkXVxyXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPFRyYW5zZm9ybVtdPn1cclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBQdXNoYWJsZVxyXG4gICAqL1xyXG4gIHB1c2godHJhbnNmb3JtT3JPcGVyYXRpb25zOiBUcmFuc2Zvcm1Pck9wZXJhdGlvbnMsIG9wdGlvbnM/OiBvYmplY3QsIGlkPzogc3RyaW5nKTogUHJvbWlzZTxUcmFuc2Zvcm1bXT47XHJcblxyXG4gIF9wdXNoKHRyYW5zZm9ybTogVHJhbnNmb3JtKTogUHJvbWlzZTxUcmFuc2Zvcm1bXT47XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBNYXJrcyBhIHNvdXJjZSBhcyBcInB1c2hhYmxlXCIgYW5kIGFkZHMgYW4gaW1wbGVtZW50YXRpb24gb2YgdGhlIGBQdXNoYWJsZWBcclxuICogaW50ZXJmYWNlLlxyXG4gKlxyXG4gKiBUaGUgYHB1c2hgIG1ldGhvZCBpcyBwYXJ0IG9mIHRoZSBcInJlcXVlc3QgZmxvd1wiIGluIE9yYml0LiBSZXF1ZXN0cyB0cmlnZ2VyXHJcbiAqIGV2ZW50cyBiZWZvcmUgYW5kIGFmdGVyIHByb2Nlc3Npbmcgb2YgZWFjaCByZXF1ZXN0LiBPYnNlcnZlcnMgY2FuIGRlbGF5IHRoZVxyXG4gKiByZXNvbHV0aW9uIG9mIGEgcmVxdWVzdCBieSByZXR1cm5pbmcgYSBwcm9taXNlIGluIGFuIGV2ZW50IGxpc3RlbmVyLlxyXG4gKlxyXG4gKiBBIHB1c2hhYmxlIHNvdXJjZSBlbWl0cyB0aGUgZm9sbG93aW5nIGV2ZW50czpcclxuICpcclxuICogLSBgYmVmb3JlUHVzaGAgLSBlbWl0dGVkIHByaW9yIHRvIHRoZSBwcm9jZXNzaW5nIG9mIGBwdXNoYCwgdGhpcyBldmVudFxyXG4gKiBpbmNsdWRlcyB0aGUgcmVxdWVzdGVkIGBUcmFuc2Zvcm1gIGFzIGFuIGFyZ3VtZW50LlxyXG4gKlxyXG4gKiAtIGBwdXNoYCAtIGVtaXR0ZWQgYWZ0ZXIgYSBgcHVzaGAgaGFzIHN1Y2Nlc3NmdWxseSBiZWVuIGFwcGxpZWQsIHRoaXMgZXZlbnQnc1xyXG4gKiBhcmd1bWVudHMgaW5jbHVkZSBib3RoIHRoZSByZXF1ZXN0ZWQgYFRyYW5zZm9ybWAgYW5kIGFuIGFycmF5IG9mIHRoZSBhY3R1YWxcclxuICogYXBwbGllZCBgVHJhbnNmb3JtYCBpbnN0YW5jZXMuXHJcbiAqXHJcbiAqIC0gYHB1c2hGYWlsYCAtIGVtaXR0ZWQgd2hlbiBhbiBlcnJvciBoYXMgb2NjdXJyZWQgcHVzaGluZyBhIHRyYW5zZm9ybSwgdGhpc1xyXG4gKiBldmVudCdzIGFyZ3VtZW50cyBpbmNsdWRlIGJvdGggdGhlIHJlcXVlc3RlZCBgVHJhbnNmb3JtYCBhbmQgdGhlIGVycm9yLlxyXG4gKlxyXG4gKiBBIHB1c2hhYmxlIHNvdXJjZSBtdXN0IGltcGxlbWVudCBhIHByaXZhdGUgbWV0aG9kIGBfcHVzaGAsIHdoaWNoIHBlcmZvcm1zXHJcbiAqIHRoZSBwcm9jZXNzaW5nIHJlcXVpcmVkIGZvciBgcHVzaGAgYW5kIHJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gYW5cclxuICogYXJyYXkgb2YgYFRyYW5zZm9ybWAgaW5zdGFuY2VzLlxyXG4gKlxyXG4gKiBAZXhwb3J0XHJcbiAqIEBkZWNvcmF0b3JcclxuICogQHBhcmFtIHtTb3VyY2VDbGFzc30gS2xhc3NcclxuICogQHJldHVybnMge3ZvaWR9XHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBwdXNoYWJsZShLbGFzczogU291cmNlQ2xhc3MpOiB2b2lkIHtcclxuICBsZXQgcHJvdG8gPSBLbGFzcy5wcm90b3R5cGU7XHJcblxyXG4gIGlmIChpc1B1c2hhYmxlKHByb3RvKSkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgYXNzZXJ0KCdQdXNoYWJsZSBpbnRlcmZhY2UgY2FuIG9ubHkgYmUgYXBwbGllZCB0byBhIFNvdXJjZScsIHByb3RvIGluc3RhbmNlb2YgU291cmNlKTtcclxuXHJcbiAgcHJvdG9bUFVTSEFCTEVdID0gdHJ1ZTtcclxuXHJcbiAgcHJvdG8ucHVzaCA9IGZ1bmN0aW9uKHRyYW5zZm9ybU9yT3BlcmF0aW9uczogVHJhbnNmb3JtT3JPcGVyYXRpb25zLCBvcHRpb25zPzogb2JqZWN0LCBpZD86IHN0cmluZyk6IFByb21pc2U8VHJhbnNmb3JtW10+IHtcclxuICAgIGNvbnN0IHRyYW5zZm9ybSA9IGJ1aWxkVHJhbnNmb3JtKHRyYW5zZm9ybU9yT3BlcmF0aW9ucywgb3B0aW9ucywgaWQsIHRoaXMudHJhbnNmb3JtQnVpbGRlcik7XHJcblxyXG4gICAgaWYgKHRoaXMudHJhbnNmb3JtTG9nLmNvbnRhaW5zKHRyYW5zZm9ybS5pZCkpIHtcclxuICAgICAgcmV0dXJuIE9yYml0LlByb21pc2UucmVzb2x2ZShbXSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuX2VucXVldWVSZXF1ZXN0KCdwdXNoJywgdHJhbnNmb3JtKTtcclxuICB9XHJcblxyXG4gIHByb3RvLl9fcHVzaF9fID0gZnVuY3Rpb24odHJhbnNmb3JtOiBUcmFuc2Zvcm0pOiBQcm9taXNlPFRyYW5zZm9ybVtdPiB7XHJcbiAgICBpZiAodGhpcy50cmFuc2Zvcm1Mb2cuY29udGFpbnModHJhbnNmb3JtLmlkKSkge1xyXG4gICAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKFtdKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZnVsZmlsbEluU2VyaWVzKHRoaXMsICdiZWZvcmVQdXNoJywgdHJhbnNmb3JtKVxyXG4gICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMudHJhbnNmb3JtTG9nLmNvbnRhaW5zKHRyYW5zZm9ybS5pZCkpIHtcclxuICAgICAgICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUoW10pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXR1cm4gdGhpcy5fcHVzaCh0cmFuc2Zvcm0pXHJcbiAgICAgICAgICAgIC50aGVuKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RyYW5zZm9ybWVkKHJlc3VsdClcclxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHNldHRsZUluU2VyaWVzKHRoaXMsICdwdXNoJywgdHJhbnNmb3JtLCByZXN1bHQpKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4gcmVzdWx0KTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICAgIC5jYXRjaChlcnJvciA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHNldHRsZUluU2VyaWVzKHRoaXMsICdwdXNoRmFpbCcsIHRyYW5zZm9ybSwgZXJyb3IpXHJcbiAgICAgICAgICAudGhlbigoKSA9PiB7IHRocm93IGVycm9yOyB9KTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==