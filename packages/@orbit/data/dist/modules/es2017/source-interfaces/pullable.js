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
        return core_1.fulfillInSeries(this, 'beforePull', query)
            .then(function () { return _this._pull(query); })
            .then(function (result) { return _this._transformed(result); })
            .then(function (result) {
            return core_1.settleInSeries(_this, 'pull', query, result)
                .then(function () { return result; });
        })
            .catch(function (error) {
            return core_1.settleInSeries(_this, 'pullFail', query, error)
                .then(function () { throw error; });
        });
    };
}
exports.default = pullable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVsbGFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvc291cmNlLWludGVyZmFjZXMvcHVsbGFibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBc0M7QUFDdEMsb0NBQThEO0FBQzlELG9DQUFnRDtBQUNoRCxrQ0FBZ0U7QUFHbkQsUUFBQSxRQUFRLEdBQUcsY0FBYyxDQUFDO0FBRXZDOzs7Ozs7R0FNRztBQUNILG9CQUEyQixNQUFjO0lBQ3ZDLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLGdCQUFRLENBQUMsQ0FBQztBQUM1QixDQUFDO0FBRkQsZ0NBRUM7QUE0QkQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E0Qkc7QUFDSCxrQkFBaUMsS0FBa0I7SUFDakQsSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQztJQUU1QixFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLE1BQU0sQ0FBQztJQUNULENBQUM7SUFFRCxjQUFNLENBQUMsb0RBQW9ELEVBQUUsS0FBSyxZQUFZLGVBQU0sQ0FBQyxDQUFDO0lBRXRGLEtBQUssQ0FBQyxnQkFBUSxDQUFDLEdBQUcsSUFBSSxDQUFDO0lBRXZCLEtBQUssQ0FBQyxJQUFJLEdBQUcsVUFBUyxpQkFBb0MsRUFBRSxPQUFnQixFQUFFLEVBQVc7UUFDdkYsSUFBTSxLQUFLLEdBQUcsa0JBQVUsQ0FBQyxpQkFBaUIsRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUM1RSxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDN0MsQ0FBQyxDQUFBO0lBRUQsS0FBSyxDQUFDLFFBQVEsR0FBRyxVQUFTLEtBQVk7UUFBckIsaUJBWWhCO1FBWEMsTUFBTSxDQUFDLHNCQUFlLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRSxLQUFLLENBQUM7YUFDOUMsSUFBSSxDQUFDLGNBQU0sT0FBQSxLQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFqQixDQUFpQixDQUFDO2FBQzdCLElBQUksQ0FBQyxVQUFBLE1BQU0sSUFBSSxPQUFBLEtBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEVBQXpCLENBQXlCLENBQUM7YUFDekMsSUFBSSxDQUFDLFVBQUEsTUFBTTtZQUNWLE1BQU0sQ0FBQyxxQkFBYyxDQUFDLEtBQUksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQztpQkFDL0MsSUFBSSxDQUFDLGNBQU0sT0FBQSxNQUFNLEVBQU4sQ0FBTSxDQUFDLENBQUM7UUFDeEIsQ0FBQyxDQUFDO2FBQ0QsS0FBSyxDQUFDLFVBQUEsS0FBSztZQUNWLE1BQU0sQ0FBQyxxQkFBYyxDQUFDLEtBQUksRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQztpQkFDbEQsSUFBSSxDQUFDLGNBQVEsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsQyxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQTtBQUNILENBQUM7QUE3QkQsMkJBNkJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSAnQG9yYml0L3V0aWxzJztcclxuaW1wb3J0IHsgc2V0dGxlSW5TZXJpZXMsIGZ1bGZpbGxJblNlcmllcyB9IGZyb20gJ0BvcmJpdC9jb3JlJztcclxuaW1wb3J0IHsgU291cmNlLCBTb3VyY2VDbGFzcyB9IGZyb20gJy4uL3NvdXJjZSc7XHJcbmltcG9ydCB7IFF1ZXJ5LCBRdWVyeU9yRXhwcmVzc2lvbiwgYnVpbGRRdWVyeSB9IGZyb20gJy4uL3F1ZXJ5JztcclxuaW1wb3J0IHsgVHJhbnNmb3JtIH0gZnJvbSAnLi4vdHJhbnNmb3JtJztcclxuXHJcbmV4cG9ydCBjb25zdCBQVUxMQUJMRSA9ICdfX3B1bGxhYmxlX18nO1xyXG5cclxuLyoqXHJcbiAqIEhhcyBhIHNvdXJjZSBiZWVuIGRlY29yYXRlZCBhcyBgQHB1bGxhYmxlYD9cclxuICpcclxuICogQGV4cG9ydFxyXG4gKiBAcGFyYW0ge1NvdXJjZX0gc291cmNlXHJcbiAqIEByZXR1cm5zXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gaXNQdWxsYWJsZShzb3VyY2U6IFNvdXJjZSkge1xyXG4gIHJldHVybiAhIXNvdXJjZVtQVUxMQUJMRV07XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBIHNvdXJjZSBkZWNvcmF0ZWQgYXMgYEBwdWxsYWJsZWAgbXVzdCBhbHNvIGltcGxlbWVudCB0aGUgYFB1bGxhYmxlYFxyXG4gKiBpbnRlcmZhY2UuXHJcbiAqXHJcbiAqIEBleHBvcnRcclxuICogQGludGVyZmFjZSBQdWxsYWJsZVxyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBQdWxsYWJsZSB7XHJcbiAgLyoqXHJcbiAgICogVGhlIGBwdWxsYCBtZXRob2QgYWNjZXB0cyBhIHF1ZXJ5IG9yIGV4cHJlc3Npb24gYW5kIHJldHVybnMgYSBwcm9taXNlIHRoYXRcclxuICAgKiByZXNvbHZlcyB0byBhbiBhcnJheSBvZiBgVHJhbnNmb3JtYCBpbnN0YW5jZXMgdGhhdCByZXByZXNlbnQgdGhlIGNoYW5nZXNldFxyXG4gICAqIHRoYXQgcmVzdWx0ZWQgZnJvbSBhcHBseWluZyB0aGUgcXVlcnkuIEluIG90aGVyIHdvcmRzLCBhIGBwdWxsYCByZXF1ZXN0XHJcbiAgICogcmV0cmlldmVzIHRoZSByZXN1bHRzIG9mIGEgcXVlcnkgaW4gYFRyYW5zZm9ybWAgZm9ybS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7UXVlcnlPckV4cHJlc3Npb259IHF1ZXJ5T3JFeHByZXNzaW9uXHJcbiAgICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zXVxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbaWRdXHJcbiAgICogQHJldHVybnMge1Byb21pc2U8VHJhbnNmb3JtW10+fVxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIFB1bGxhYmxlXHJcbiAgICovXHJcbiAgcHVsbChxdWVyeU9yRXhwcmVzc2lvbjogUXVlcnlPckV4cHJlc3Npb24sIG9wdGlvbnM/OiBvYmplY3QsIGlkPzogc3RyaW5nKTogUHJvbWlzZTxUcmFuc2Zvcm1bXT47XHJcblxyXG4gIF9wdWxsKHF1ZXJ5OiBRdWVyeSk6IFByb21pc2U8VHJhbnNmb3JtW10+O1xyXG59XHJcblxyXG4vKipcclxuICogTWFya3MgYSBzb3VyY2UgYXMgXCJwdWxsYWJsZVwiIGFuZCBhZGRzIGFuIGltcGxlbWVudGF0aW9uIG9mIHRoZSBgUHVsbGFibGVgXHJcbiAqIGludGVyZmFjZS5cclxuICpcclxuICogVGhlIGBwdWxsYCBtZXRob2QgaXMgcGFydCBvZiB0aGUgXCJyZXF1ZXN0IGZsb3dcIiBpbiBPcmJpdC4gUmVxdWVzdHMgdHJpZ2dlclxyXG4gKiBldmVudHMgYmVmb3JlIGFuZCBhZnRlciBwcm9jZXNzaW5nIG9mIGVhY2ggcmVxdWVzdC4gT2JzZXJ2ZXJzIGNhbiBkZWxheSB0aGVcclxuICogcmVzb2x1dGlvbiBvZiBhIHJlcXVlc3QgYnkgcmV0dXJuaW5nIGEgcHJvbWlzZSBpbiBhbiBldmVudCBsaXN0ZW5lci5cclxuICpcclxuICogQSBwdWxsYWJsZSBzb3VyY2UgZW1pdHMgdGhlIGZvbGxvd2luZyBldmVudHM6XHJcbiAqXHJcbiAqIC0gYGJlZm9yZVB1bGxgIC0gZW1pdHRlZCBwcmlvciB0byB0aGUgcHJvY2Vzc2luZyBvZiBgcHVsbGAsIHRoaXMgZXZlbnRcclxuICogaW5jbHVkZXMgdGhlIHJlcXVlc3RlZCBgUXVlcnlgIGFzIGFuIGFyZ3VtZW50LlxyXG4gKlxyXG4gKiAtIGBwdWxsYCAtIGVtaXR0ZWQgYWZ0ZXIgYSBgcHVsbGAgaGFzIHN1Y2Nlc3NmdWxseSBiZWVuIHJlcXVlc3RlZCwgdGhpc1xyXG4gKiBldmVudCdzIGFyZ3VtZW50cyBpbmNsdWRlIGJvdGggdGhlIHJlcXVlc3RlZCBgUXVlcnlgIGFuZCBhbiBhcnJheSBvZiB0aGVcclxuICogcmVzdWx0aW5nIGBUcmFuc2Zvcm1gIGluc3RhbmNlcy5cclxuICpcclxuICogLSBgcHVsbEZhaWxgIC0gZW1pdHRlZCB3aGVuIGFuIGVycm9yIGhhcyBvY2N1cnJlZCBwcm9jZXNzaW5nIGEgYHB1bGxgLCB0aGlzXHJcbiAqIGV2ZW50J3MgYXJndW1lbnRzIGluY2x1ZGUgYm90aCB0aGUgcmVxdWVzdGVkIGBRdWVyeWAgYW5kIHRoZSBlcnJvci5cclxuICpcclxuICogQSBwdWxsYWJsZSBzb3VyY2UgbXVzdCBpbXBsZW1lbnQgYSBwcml2YXRlIG1ldGhvZCBgX3B1bGxgLCB3aGljaCBwZXJmb3Jtc1xyXG4gKiB0aGUgcHJvY2Vzc2luZyByZXF1aXJlZCBmb3IgYHB1bGxgIGFuZCByZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIGFuXHJcbiAqIGFycmF5IG9mIGBUcmFuc2Zvcm1gIGluc3RhbmNlcy5cclxuICpcclxuICogQGV4cG9ydFxyXG4gKiBAZGVjb3JhdG9yXHJcbiAqIEBwYXJhbSB7U291cmNlQ2xhc3N9IEtsYXNzXHJcbiAqIEByZXR1cm5zIHt2b2lkfVxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcHVsbGFibGUoS2xhc3M6IFNvdXJjZUNsYXNzKTogdm9pZCB7XHJcbiAgbGV0IHByb3RvID0gS2xhc3MucHJvdG90eXBlO1xyXG5cclxuICBpZiAoaXNQdWxsYWJsZShwcm90bykpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIGFzc2VydCgnUHVsbGFibGUgaW50ZXJmYWNlIGNhbiBvbmx5IGJlIGFwcGxpZWQgdG8gYSBTb3VyY2UnLCBwcm90byBpbnN0YW5jZW9mIFNvdXJjZSk7XHJcblxyXG4gIHByb3RvW1BVTExBQkxFXSA9IHRydWU7XHJcblxyXG4gIHByb3RvLnB1bGwgPSBmdW5jdGlvbihxdWVyeU9yRXhwcmVzc2lvbjogUXVlcnlPckV4cHJlc3Npb24sIG9wdGlvbnM/OiBvYmplY3QsIGlkPzogc3RyaW5nKTogUHJvbWlzZTxUcmFuc2Zvcm1bXT4ge1xyXG4gICAgY29uc3QgcXVlcnkgPSBidWlsZFF1ZXJ5KHF1ZXJ5T3JFeHByZXNzaW9uLCBvcHRpb25zLCBpZCwgdGhpcy5xdWVyeUJ1aWxkZXIpO1xyXG4gICAgcmV0dXJuIHRoaXMuX2VucXVldWVSZXF1ZXN0KCdwdWxsJywgcXVlcnkpO1xyXG4gIH1cclxuXHJcbiAgcHJvdG8uX19wdWxsX18gPSBmdW5jdGlvbihxdWVyeTogUXVlcnkpOiBQcm9taXNlPFRyYW5zZm9ybVtdPiB7XHJcbiAgICByZXR1cm4gZnVsZmlsbEluU2VyaWVzKHRoaXMsICdiZWZvcmVQdWxsJywgcXVlcnkpXHJcbiAgICAgIC50aGVuKCgpID0+IHRoaXMuX3B1bGwocXVlcnkpKVxyXG4gICAgICAudGhlbihyZXN1bHQgPT4gdGhpcy5fdHJhbnNmb3JtZWQocmVzdWx0KSlcclxuICAgICAgLnRoZW4ocmVzdWx0ID0+IHtcclxuICAgICAgICByZXR1cm4gc2V0dGxlSW5TZXJpZXModGhpcywgJ3B1bGwnLCBxdWVyeSwgcmVzdWx0KVxyXG4gICAgICAgICAgLnRoZW4oKCkgPT4gcmVzdWx0KTtcclxuICAgICAgfSlcclxuICAgICAgLmNhdGNoKGVycm9yID0+IHtcclxuICAgICAgICByZXR1cm4gc2V0dGxlSW5TZXJpZXModGhpcywgJ3B1bGxGYWlsJywgcXVlcnksIGVycm9yKVxyXG4gICAgICAgICAgLnRoZW4oKCkgPT4geyB0aHJvdyBlcnJvcjsgfSk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxufVxyXG4iXX0=