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
        return core_1.fulfillInSeries(this, 'beforePush', transform)
            .then(function () {
            if (_this.transformLog.contains(transform.id)) {
                return main_1.default.Promise.resolve([]);
            }
            else {
                return _this._push(transform)
                    .then(function (result) {
                    return _this._transformed(result)
                        .then(function () { return core_1.settleInSeries(_this, 'push', transform, result); })
                        .then(function () { return result; });
                });
            }
        })
            .catch(function (error) {
            return core_1.settleInSeries(_this, 'pushFail', transform, error)
                .then(function () { throw error; });
        });
    };
}
exports.default = pushable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVzaGFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvc291cmNlLWludGVyZmFjZXMvcHVzaGFibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxnQ0FBNEI7QUFDNUIsc0NBQXNDO0FBQ3RDLG9DQUE4RDtBQUM5RCxvQ0FBZ0Q7QUFDaEQsMENBQWdGO0FBRW5FLFFBQUEsUUFBUSxHQUFHLGNBQWMsQ0FBQztBQUV2Qzs7Ozs7O0dBTUc7QUFDSCxvQkFBMkIsTUFBYztJQUN2QyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxnQkFBUSxDQUFDLENBQUM7QUFDNUIsQ0FBQztBQUZELGdDQUVDO0FBNEJEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBNEJHO0FBQ0gsa0JBQWlDLEtBQWtCO0lBQ2pELElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUM7SUFFNUIsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixNQUFNLENBQUM7SUFDVCxDQUFDO0lBRUQsY0FBTSxDQUFDLG9EQUFvRCxFQUFFLEtBQUssWUFBWSxlQUFNLENBQUMsQ0FBQztJQUV0RixLQUFLLENBQUMsZ0JBQVEsQ0FBQyxHQUFHLElBQUksQ0FBQztJQUV2QixLQUFLLENBQUMsSUFBSSxHQUFHLFVBQVMscUJBQTRDLEVBQUUsT0FBZ0IsRUFBRSxFQUFXO1FBQy9GLElBQU0sU0FBUyxHQUFHLDBCQUFjLENBQUMscUJBQXFCLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUU1RixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdDLE1BQU0sQ0FBQyxjQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNuQyxDQUFDO1FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ2pELENBQUMsQ0FBQTtJQUVELEtBQUssQ0FBQyxRQUFRLEdBQUcsVUFBUyxTQUFvQjtRQUE3QixpQkFzQmhCO1FBckJDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0MsTUFBTSxDQUFDLGNBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ25DLENBQUM7UUFFRCxNQUFNLENBQUMsc0JBQWUsQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFLFNBQVMsQ0FBQzthQUNsRCxJQUFJLENBQUM7WUFDSixFQUFFLENBQUMsQ0FBQyxLQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM3QyxNQUFNLENBQUMsY0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDbkMsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLE1BQU0sQ0FBQyxLQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQztxQkFDekIsSUFBSSxDQUFDLFVBQUEsTUFBTTtvQkFDVixNQUFNLENBQUMsS0FBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUM7eUJBQzdCLElBQUksQ0FBQyxjQUFNLE9BQUEscUJBQWMsQ0FBQyxLQUFJLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxNQUFNLENBQUMsRUFBL0MsQ0FBK0MsQ0FBQzt5QkFDM0QsSUFBSSxDQUFDLGNBQU0sT0FBQSxNQUFNLEVBQU4sQ0FBTSxDQUFDLENBQUM7Z0JBQ3hCLENBQUMsQ0FBQyxDQUFBO1lBQ04sQ0FBQztRQUNILENBQUMsQ0FBQzthQUNELEtBQUssQ0FBQyxVQUFBLEtBQUs7WUFDVixNQUFNLENBQUMscUJBQWMsQ0FBQyxLQUFJLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxLQUFLLENBQUM7aUJBQ3RELElBQUksQ0FBQyxjQUFRLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEMsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUE7QUFDSCxDQUFDO0FBNUNELDJCQTRDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBPcmJpdCBmcm9tICcuLi9tYWluJztcclxuaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSAnQG9yYml0L3V0aWxzJztcclxuaW1wb3J0IHsgc2V0dGxlSW5TZXJpZXMsIGZ1bGZpbGxJblNlcmllcyB9IGZyb20gJ0BvcmJpdC9jb3JlJztcclxuaW1wb3J0IHsgU291cmNlLCBTb3VyY2VDbGFzcyB9IGZyb20gJy4uL3NvdXJjZSc7XHJcbmltcG9ydCB7IFRyYW5zZm9ybSwgVHJhbnNmb3JtT3JPcGVyYXRpb25zLCBidWlsZFRyYW5zZm9ybSB9IGZyb20gJy4uL3RyYW5zZm9ybSc7XHJcblxyXG5leHBvcnQgY29uc3QgUFVTSEFCTEUgPSAnX19wdXNoYWJsZV9fJztcclxuXHJcbi8qKlxyXG4gKiBIYXMgYSBzb3VyY2UgYmVlbiBkZWNvcmF0ZWQgYXMgYEBwdXNoYWJsZWA/XHJcbiAqXHJcbiAqIEBleHBvcnRcclxuICogQHBhcmFtIHtTb3VyY2V9IHNvdXJjZVxyXG4gKiBAcmV0dXJuc1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGlzUHVzaGFibGUoc291cmNlOiBTb3VyY2UpIHtcclxuICByZXR1cm4gISFzb3VyY2VbUFVTSEFCTEVdO1xyXG59XHJcblxyXG4vKipcclxuICogQSBzb3VyY2UgZGVjb3JhdGVkIGFzIGBAcHVzaGFibGVgIG11c3QgYWxzbyBpbXBsZW1lbnQgdGhlIGBQdXNoYWJsZWBcclxuICogaW50ZXJmYWNlLlxyXG4gKlxyXG4gKiBAZXhwb3J0XHJcbiAqIEBpbnRlcmZhY2UgUHVzaGFibGVcclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgUHVzaGFibGUge1xyXG4gIC8qKlxyXG4gICAqIFRoZSBgcHVzaGAgbWV0aG9kIGFjY2VwdHMgYSBgVHJhbnNmb3JtYCBpbnN0YW5jZSBhcyBhbiBhcmd1bWVudCBhbmQgcmV0dXJuc1xyXG4gICAqIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIGFuIGFycmF5IG9mIGBUcmFuc2Zvcm1gIGluc3RhbmNlcyB0aGF0IGFyZVxyXG4gICAqIGFwcGxpZWQgYXMgYSByZXN1bHQuIEluIG90aGVyIHdvcmRzLCBgcHVzaGAgY2FwdHVyZXMgdGhlIGRpcmVjdCByZXN1bHRzXHJcbiAgICogX2FuZF8gc2lkZSBlZmZlY3RzIG9mIGFwcGx5aW5nIGEgYFRyYW5zZm9ybWAgdG8gYSBzb3VyY2UuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge1RyYW5zZm9ybU9yT3BlcmF0aW9uc30gdHJhbnNmb3JtT3JPcGVyYXRpb25zXHJcbiAgICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zXVxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbaWRdXHJcbiAgICogQHJldHVybnMge1Byb21pc2U8VHJhbnNmb3JtW10+fVxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIFB1c2hhYmxlXHJcbiAgICovXHJcbiAgcHVzaCh0cmFuc2Zvcm1Pck9wZXJhdGlvbnM6IFRyYW5zZm9ybU9yT3BlcmF0aW9ucywgb3B0aW9ucz86IG9iamVjdCwgaWQ/OiBzdHJpbmcpOiBQcm9taXNlPFRyYW5zZm9ybVtdPjtcclxuXHJcbiAgX3B1c2godHJhbnNmb3JtOiBUcmFuc2Zvcm0pOiBQcm9taXNlPFRyYW5zZm9ybVtdPjtcclxufVxyXG5cclxuLyoqXHJcbiAqIE1hcmtzIGEgc291cmNlIGFzIFwicHVzaGFibGVcIiBhbmQgYWRkcyBhbiBpbXBsZW1lbnRhdGlvbiBvZiB0aGUgYFB1c2hhYmxlYFxyXG4gKiBpbnRlcmZhY2UuXHJcbiAqXHJcbiAqIFRoZSBgcHVzaGAgbWV0aG9kIGlzIHBhcnQgb2YgdGhlIFwicmVxdWVzdCBmbG93XCIgaW4gT3JiaXQuIFJlcXVlc3RzIHRyaWdnZXJcclxuICogZXZlbnRzIGJlZm9yZSBhbmQgYWZ0ZXIgcHJvY2Vzc2luZyBvZiBlYWNoIHJlcXVlc3QuIE9ic2VydmVycyBjYW4gZGVsYXkgdGhlXHJcbiAqIHJlc29sdXRpb24gb2YgYSByZXF1ZXN0IGJ5IHJldHVybmluZyBhIHByb21pc2UgaW4gYW4gZXZlbnQgbGlzdGVuZXIuXHJcbiAqXHJcbiAqIEEgcHVzaGFibGUgc291cmNlIGVtaXRzIHRoZSBmb2xsb3dpbmcgZXZlbnRzOlxyXG4gKlxyXG4gKiAtIGBiZWZvcmVQdXNoYCAtIGVtaXR0ZWQgcHJpb3IgdG8gdGhlIHByb2Nlc3Npbmcgb2YgYHB1c2hgLCB0aGlzIGV2ZW50XHJcbiAqIGluY2x1ZGVzIHRoZSByZXF1ZXN0ZWQgYFRyYW5zZm9ybWAgYXMgYW4gYXJndW1lbnQuXHJcbiAqXHJcbiAqIC0gYHB1c2hgIC0gZW1pdHRlZCBhZnRlciBhIGBwdXNoYCBoYXMgc3VjY2Vzc2Z1bGx5IGJlZW4gYXBwbGllZCwgdGhpcyBldmVudCdzXHJcbiAqIGFyZ3VtZW50cyBpbmNsdWRlIGJvdGggdGhlIHJlcXVlc3RlZCBgVHJhbnNmb3JtYCBhbmQgYW4gYXJyYXkgb2YgdGhlIGFjdHVhbFxyXG4gKiBhcHBsaWVkIGBUcmFuc2Zvcm1gIGluc3RhbmNlcy5cclxuICpcclxuICogLSBgcHVzaEZhaWxgIC0gZW1pdHRlZCB3aGVuIGFuIGVycm9yIGhhcyBvY2N1cnJlZCBwdXNoaW5nIGEgdHJhbnNmb3JtLCB0aGlzXHJcbiAqIGV2ZW50J3MgYXJndW1lbnRzIGluY2x1ZGUgYm90aCB0aGUgcmVxdWVzdGVkIGBUcmFuc2Zvcm1gIGFuZCB0aGUgZXJyb3IuXHJcbiAqXHJcbiAqIEEgcHVzaGFibGUgc291cmNlIG11c3QgaW1wbGVtZW50IGEgcHJpdmF0ZSBtZXRob2QgYF9wdXNoYCwgd2hpY2ggcGVyZm9ybXNcclxuICogdGhlIHByb2Nlc3NpbmcgcmVxdWlyZWQgZm9yIGBwdXNoYCBhbmQgcmV0dXJucyBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byBhblxyXG4gKiBhcnJheSBvZiBgVHJhbnNmb3JtYCBpbnN0YW5jZXMuXHJcbiAqXHJcbiAqIEBleHBvcnRcclxuICogQGRlY29yYXRvclxyXG4gKiBAcGFyYW0ge1NvdXJjZUNsYXNzfSBLbGFzc1xyXG4gKiBAcmV0dXJucyB7dm9pZH1cclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHB1c2hhYmxlKEtsYXNzOiBTb3VyY2VDbGFzcyk6IHZvaWQge1xyXG4gIGxldCBwcm90byA9IEtsYXNzLnByb3RvdHlwZTtcclxuXHJcbiAgaWYgKGlzUHVzaGFibGUocHJvdG8pKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICBhc3NlcnQoJ1B1c2hhYmxlIGludGVyZmFjZSBjYW4gb25seSBiZSBhcHBsaWVkIHRvIGEgU291cmNlJywgcHJvdG8gaW5zdGFuY2VvZiBTb3VyY2UpO1xyXG5cclxuICBwcm90b1tQVVNIQUJMRV0gPSB0cnVlO1xyXG5cclxuICBwcm90by5wdXNoID0gZnVuY3Rpb24odHJhbnNmb3JtT3JPcGVyYXRpb25zOiBUcmFuc2Zvcm1Pck9wZXJhdGlvbnMsIG9wdGlvbnM/OiBvYmplY3QsIGlkPzogc3RyaW5nKTogUHJvbWlzZTxUcmFuc2Zvcm1bXT4ge1xyXG4gICAgY29uc3QgdHJhbnNmb3JtID0gYnVpbGRUcmFuc2Zvcm0odHJhbnNmb3JtT3JPcGVyYXRpb25zLCBvcHRpb25zLCBpZCwgdGhpcy50cmFuc2Zvcm1CdWlsZGVyKTtcclxuXHJcbiAgICBpZiAodGhpcy50cmFuc2Zvcm1Mb2cuY29udGFpbnModHJhbnNmb3JtLmlkKSkge1xyXG4gICAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKFtdKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5fZW5xdWV1ZVJlcXVlc3QoJ3B1c2gnLCB0cmFuc2Zvcm0pO1xyXG4gIH1cclxuXHJcbiAgcHJvdG8uX19wdXNoX18gPSBmdW5jdGlvbih0cmFuc2Zvcm06IFRyYW5zZm9ybSk6IFByb21pc2U8VHJhbnNmb3JtW10+IHtcclxuICAgIGlmICh0aGlzLnRyYW5zZm9ybUxvZy5jb250YWlucyh0cmFuc2Zvcm0uaWQpKSB7XHJcbiAgICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUoW10pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBmdWxmaWxsSW5TZXJpZXModGhpcywgJ2JlZm9yZVB1c2gnLCB0cmFuc2Zvcm0pXHJcbiAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICBpZiAodGhpcy50cmFuc2Zvcm1Mb2cuY29udGFpbnModHJhbnNmb3JtLmlkKSkge1xyXG4gICAgICAgICAgcmV0dXJuIE9yYml0LlByb21pc2UucmVzb2x2ZShbXSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJldHVybiB0aGlzLl9wdXNoKHRyYW5zZm9ybSlcclxuICAgICAgICAgICAgLnRoZW4ocmVzdWx0ID0+IHtcclxuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fdHJhbnNmb3JtZWQocmVzdWx0KVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4gc2V0dGxlSW5TZXJpZXModGhpcywgJ3B1c2gnLCB0cmFuc2Zvcm0sIHJlc3VsdCkpXHJcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiByZXN1bHQpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgICAgLmNhdGNoKGVycm9yID0+IHtcclxuICAgICAgICByZXR1cm4gc2V0dGxlSW5TZXJpZXModGhpcywgJ3B1c2hGYWlsJywgdHJhbnNmb3JtLCBlcnJvcilcclxuICAgICAgICAgIC50aGVuKCgpID0+IHsgdGhyb3cgZXJyb3I7IH0pO1xyXG4gICAgICB9KTtcclxuICB9XHJcbn1cclxuIl19