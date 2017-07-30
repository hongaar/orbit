"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var main_1 = require("../main");
var utils_1 = require("@orbit/utils");
var core_1 = require("@orbit/core");
var source_1 = require("../source");
var transform_1 = require("../transform");
exports.UPDATABLE = '__updatable__';
/**
 * Has a source been decorated as `@updatable`?
 *
 * @export
 * @param {*} obj
 * @returns
 */
function isUpdatable(source) {
    return !!source[exports.UPDATABLE];
}
exports.isUpdatable = isUpdatable;
/**
 * Marks a source as "updatable" and adds an implementation of the `Updatable`
 * interface.
 *
 * The `update` method is part of the "request flow" in Orbit. Requests trigger
 * events before and after processing of each request. Observers can delay the
 * resolution of a request by returning a promise in an event listener.
 *
 * An updatable source emits the following events:
 *
 * - `beforeUpdate` - emitted prior to the processing of `update`, this event
 * includes the requested `Transform` as an argument.
 *
 * - `update` - emitted after an `update` has successfully been applied, this
 * event includes the requested `Transform` as an argument.
 *
 * - `updateFail` - emitted when an error has occurred applying an update, this
 * event's arguments include both the requested `Transform` and the error.
 *
 * An updatable source must implement a private method `_update`, which performs
 * the processing required for `update` and returns a promise that resolves when
 * complete.
 *
 * @export
 * @decorator
 * @param {SourceClass} Klass
 * @returns {void}
 */
function updatable(Klass) {
    var proto = Klass.prototype;
    if (isUpdatable(proto)) {
        return;
    }
    utils_1.assert('Updatable interface can only be applied to a Source', proto instanceof source_1.Source);
    proto[exports.UPDATABLE] = true;
    proto.update = function (transformOrOperations, options, id) {
        var transform = transform_1.buildTransform(transformOrOperations, options, id, this.transformBuilder);
        if (this.transformLog.contains(transform.id)) {
            return main_1.default.Promise.resolve();
        }
        return this._enqueueRequest('update', transform);
    };
    proto.__update__ = function (transform) {
        var _this = this;
        if (this.transformLog.contains(transform.id)) {
            return main_1.default.Promise.resolve();
        }
        return core_1.fulfillInSeries(this, 'beforeUpdate', transform)
            .then(function () {
            if (_this.transformLog.contains(transform.id)) {
                return main_1.default.Promise.resolve();
            }
            else {
                return _this._update(transform)
                    .then(function (result) {
                    return _this._transformed([transform])
                        .then(function () { return core_1.settleInSeries(_this, 'update', transform, result); })
                        .then(function () { return result; });
                });
            }
        })
            .catch(function (error) {
            return core_1.settleInSeries(_this, 'updateFail', transform, error)
                .then(function () { throw error; });
        });
    };
}
exports.default = updatable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRhYmxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3NvdXJjZS1pbnRlcmZhY2VzL3VwZGF0YWJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGdDQUE0QjtBQUM1QixzQ0FBc0M7QUFDdEMsb0NBQThEO0FBRTlELG9DQUFnRDtBQUNoRCwwQ0FBZ0Y7QUFFbkUsUUFBQSxTQUFTLEdBQUcsZUFBZSxDQUFDO0FBRXpDOzs7Ozs7R0FNRztBQUNILHFCQUE0QixNQUFjO0lBQ3hDLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLGlCQUFTLENBQUMsQ0FBQztBQUM3QixDQUFDO0FBRkQsa0NBRUM7QUEyQkQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTJCRztBQUNILG1CQUFrQyxLQUFrQjtJQUNsRCxJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDO0lBRTVCLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkIsTUFBTSxDQUFDO0lBQ1QsQ0FBQztJQUVELGNBQU0sQ0FBQyxxREFBcUQsRUFBRSxLQUFLLFlBQVksZUFBTSxDQUFDLENBQUM7SUFFdkYsS0FBSyxDQUFDLGlCQUFTLENBQUMsR0FBRyxJQUFJLENBQUM7SUFFeEIsS0FBSyxDQUFDLE1BQU0sR0FBRyxVQUFTLHFCQUE0QyxFQUFFLE9BQWdCLEVBQUUsRUFBVztRQUNqRyxJQUFNLFNBQVMsR0FBRywwQkFBYyxDQUFDLHFCQUFxQixFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFFNUYsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3QyxNQUFNLENBQUMsY0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNqQyxDQUFDO1FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ25ELENBQUMsQ0FBQTtJQUVELEtBQUssQ0FBQyxVQUFVLEdBQUcsVUFBUyxTQUFvQjtRQUE3QixpQkFzQmxCO1FBckJDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0MsTUFBTSxDQUFDLGNBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDakMsQ0FBQztRQUVELE1BQU0sQ0FBQyxzQkFBZSxDQUFDLElBQUksRUFBRSxjQUFjLEVBQUUsU0FBUyxDQUFDO2FBQ3BELElBQUksQ0FBQztZQUNKLEVBQUUsQ0FBQyxDQUFDLEtBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzdDLE1BQU0sQ0FBQyxjQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ2pDLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixNQUFNLENBQUMsS0FBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUM7cUJBQzNCLElBQUksQ0FBQyxVQUFBLE1BQU07b0JBQ1YsTUFBTSxDQUFDLEtBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQzt5QkFDbEMsSUFBSSxDQUFDLGNBQU0sT0FBQSxxQkFBYyxDQUFDLEtBQUksRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLE1BQU0sQ0FBQyxFQUFqRCxDQUFpRCxDQUFDO3lCQUM3RCxJQUFJLENBQUMsY0FBTSxPQUFBLE1BQU0sRUFBTixDQUFNLENBQUMsQ0FBQztnQkFDeEIsQ0FBQyxDQUFDLENBQUE7WUFDTixDQUFDO1FBQ0gsQ0FBQyxDQUFDO2FBQ0QsS0FBSyxDQUFDLFVBQUEsS0FBSztZQUNWLE1BQU0sQ0FBQyxxQkFBYyxDQUFDLEtBQUksRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLEtBQUssQ0FBQztpQkFDeEQsSUFBSSxDQUFDLGNBQVEsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsQyxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQTtBQUNILENBQUM7QUE1Q0QsNEJBNENDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE9yYml0IGZyb20gJy4uL21haW4nO1xyXG5pbXBvcnQgeyBhc3NlcnQgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xyXG5pbXBvcnQgeyBzZXR0bGVJblNlcmllcywgZnVsZmlsbEluU2VyaWVzIH0gZnJvbSAnQG9yYml0L2NvcmUnO1xyXG5pbXBvcnQgeyBPcGVyYXRpb24gfSBmcm9tICcuLi9vcGVyYXRpb24nO1xyXG5pbXBvcnQgeyBTb3VyY2UsIFNvdXJjZUNsYXNzIH0gZnJvbSAnLi4vc291cmNlJztcclxuaW1wb3J0IHsgVHJhbnNmb3JtLCBUcmFuc2Zvcm1Pck9wZXJhdGlvbnMsIGJ1aWxkVHJhbnNmb3JtIH0gZnJvbSAnLi4vdHJhbnNmb3JtJztcclxuXHJcbmV4cG9ydCBjb25zdCBVUERBVEFCTEUgPSAnX191cGRhdGFibGVfXyc7XHJcblxyXG4vKipcclxuICogSGFzIGEgc291cmNlIGJlZW4gZGVjb3JhdGVkIGFzIGBAdXBkYXRhYmxlYD9cclxuICpcclxuICogQGV4cG9ydFxyXG4gKiBAcGFyYW0geyp9IG9ialxyXG4gKiBAcmV0dXJuc1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGlzVXBkYXRhYmxlKHNvdXJjZTogU291cmNlKSB7XHJcbiAgcmV0dXJuICEhc291cmNlW1VQREFUQUJMRV07XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBIHNvdXJjZSBkZWNvcmF0ZWQgYXMgYEB1cGRhdGFibGVgIG11c3QgYWxzbyBpbXBsZW1lbnQgdGhlIGBVcGRhdGFibGVgXHJcbiAqIGludGVyZmFjZS5cclxuICpcclxuICogQGV4cG9ydFxyXG4gKiBAaW50ZXJmYWNlIFVwZGF0YWJsZVxyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBVcGRhdGFibGUge1xyXG4gIC8qKlxyXG4gICAqIFRoZSBgdXBkYXRlYCBtZXRob2QgYWNjZXB0cyBhIGBUcmFuc2Zvcm1gIGluc3RhbmNlIG9yIGFuIGFycmF5IG9mXHJcbiAgICogb3BlcmF0aW9ucyB3aGljaCBpdCB0aGVuIGNvbnZlcnRzIHRvIGEgYFRyYW5zZm9ybWAgaW5zdGFuY2UuIFRoZSBzb3VyY2VcclxuICAgKiBhcHBsaWVzIHRoZSB1cGRhdGUgYW5kIHJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2hlbiBjb21wbGV0ZS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7VHJhbnNmb3JtT3JPcGVyYXRpb25zfSB0cmFuc2Zvcm1Pck9wZXJhdGlvbnNcclxuICAgKiBAcGFyYW0ge29iamVjdH0gW29wdGlvbnNdXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IFtpZF1cclxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkPn1cclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBVcGRhdGFibGVcclxuICAgKi9cclxuICB1cGRhdGUodHJhbnNmb3JtT3JPcGVyYXRpb25zOiBUcmFuc2Zvcm1Pck9wZXJhdGlvbnMsIG9wdGlvbnM/OiBvYmplY3QsIGlkPzogc3RyaW5nKTogUHJvbWlzZTxhbnk+O1xyXG5cclxuICBfdXBkYXRlKHRyYW5zZm9ybTogVHJhbnNmb3JtKTogUHJvbWlzZTxhbnk+O1xyXG59XHJcblxyXG4vKipcclxuICogTWFya3MgYSBzb3VyY2UgYXMgXCJ1cGRhdGFibGVcIiBhbmQgYWRkcyBhbiBpbXBsZW1lbnRhdGlvbiBvZiB0aGUgYFVwZGF0YWJsZWBcclxuICogaW50ZXJmYWNlLlxyXG4gKlxyXG4gKiBUaGUgYHVwZGF0ZWAgbWV0aG9kIGlzIHBhcnQgb2YgdGhlIFwicmVxdWVzdCBmbG93XCIgaW4gT3JiaXQuIFJlcXVlc3RzIHRyaWdnZXJcclxuICogZXZlbnRzIGJlZm9yZSBhbmQgYWZ0ZXIgcHJvY2Vzc2luZyBvZiBlYWNoIHJlcXVlc3QuIE9ic2VydmVycyBjYW4gZGVsYXkgdGhlXHJcbiAqIHJlc29sdXRpb24gb2YgYSByZXF1ZXN0IGJ5IHJldHVybmluZyBhIHByb21pc2UgaW4gYW4gZXZlbnQgbGlzdGVuZXIuXHJcbiAqXHJcbiAqIEFuIHVwZGF0YWJsZSBzb3VyY2UgZW1pdHMgdGhlIGZvbGxvd2luZyBldmVudHM6XHJcbiAqXHJcbiAqIC0gYGJlZm9yZVVwZGF0ZWAgLSBlbWl0dGVkIHByaW9yIHRvIHRoZSBwcm9jZXNzaW5nIG9mIGB1cGRhdGVgLCB0aGlzIGV2ZW50XHJcbiAqIGluY2x1ZGVzIHRoZSByZXF1ZXN0ZWQgYFRyYW5zZm9ybWAgYXMgYW4gYXJndW1lbnQuXHJcbiAqXHJcbiAqIC0gYHVwZGF0ZWAgLSBlbWl0dGVkIGFmdGVyIGFuIGB1cGRhdGVgIGhhcyBzdWNjZXNzZnVsbHkgYmVlbiBhcHBsaWVkLCB0aGlzXHJcbiAqIGV2ZW50IGluY2x1ZGVzIHRoZSByZXF1ZXN0ZWQgYFRyYW5zZm9ybWAgYXMgYW4gYXJndW1lbnQuXHJcbiAqXHJcbiAqIC0gYHVwZGF0ZUZhaWxgIC0gZW1pdHRlZCB3aGVuIGFuIGVycm9yIGhhcyBvY2N1cnJlZCBhcHBseWluZyBhbiB1cGRhdGUsIHRoaXNcclxuICogZXZlbnQncyBhcmd1bWVudHMgaW5jbHVkZSBib3RoIHRoZSByZXF1ZXN0ZWQgYFRyYW5zZm9ybWAgYW5kIHRoZSBlcnJvci5cclxuICpcclxuICogQW4gdXBkYXRhYmxlIHNvdXJjZSBtdXN0IGltcGxlbWVudCBhIHByaXZhdGUgbWV0aG9kIGBfdXBkYXRlYCwgd2hpY2ggcGVyZm9ybXNcclxuICogdGhlIHByb2Nlc3NpbmcgcmVxdWlyZWQgZm9yIGB1cGRhdGVgIGFuZCByZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdoZW5cclxuICogY29tcGxldGUuXHJcbiAqXHJcbiAqIEBleHBvcnRcclxuICogQGRlY29yYXRvclxyXG4gKiBAcGFyYW0ge1NvdXJjZUNsYXNzfSBLbGFzc1xyXG4gKiBAcmV0dXJucyB7dm9pZH1cclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHVwZGF0YWJsZShLbGFzczogU291cmNlQ2xhc3MpOiB2b2lkIHtcclxuICBsZXQgcHJvdG8gPSBLbGFzcy5wcm90b3R5cGU7XHJcblxyXG4gIGlmIChpc1VwZGF0YWJsZShwcm90bykpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIGFzc2VydCgnVXBkYXRhYmxlIGludGVyZmFjZSBjYW4gb25seSBiZSBhcHBsaWVkIHRvIGEgU291cmNlJywgcHJvdG8gaW5zdGFuY2VvZiBTb3VyY2UpO1xyXG5cclxuICBwcm90b1tVUERBVEFCTEVdID0gdHJ1ZTtcclxuXHJcbiAgcHJvdG8udXBkYXRlID0gZnVuY3Rpb24odHJhbnNmb3JtT3JPcGVyYXRpb25zOiBUcmFuc2Zvcm1Pck9wZXJhdGlvbnMsIG9wdGlvbnM/OiBvYmplY3QsIGlkPzogc3RyaW5nKTogUHJvbWlzZTxhbnk+IHtcclxuICAgIGNvbnN0IHRyYW5zZm9ybSA9IGJ1aWxkVHJhbnNmb3JtKHRyYW5zZm9ybU9yT3BlcmF0aW9ucywgb3B0aW9ucywgaWQsIHRoaXMudHJhbnNmb3JtQnVpbGRlcik7XHJcblxyXG4gICAgaWYgKHRoaXMudHJhbnNmb3JtTG9nLmNvbnRhaW5zKHRyYW5zZm9ybS5pZCkpIHtcclxuICAgICAgcmV0dXJuIE9yYml0LlByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLl9lbnF1ZXVlUmVxdWVzdCgndXBkYXRlJywgdHJhbnNmb3JtKTtcclxuICB9XHJcblxyXG4gIHByb3RvLl9fdXBkYXRlX18gPSBmdW5jdGlvbih0cmFuc2Zvcm06IFRyYW5zZm9ybSk6IFByb21pc2U8YW55PiB7XHJcbiAgICBpZiAodGhpcy50cmFuc2Zvcm1Mb2cuY29udGFpbnModHJhbnNmb3JtLmlkKSkge1xyXG4gICAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGZ1bGZpbGxJblNlcmllcyh0aGlzLCAnYmVmb3JlVXBkYXRlJywgdHJhbnNmb3JtKVxyXG4gICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMudHJhbnNmb3JtTG9nLmNvbnRhaW5zKHRyYW5zZm9ybS5pZCkpIHtcclxuICAgICAgICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmV0dXJuIHRoaXMuX3VwZGF0ZSh0cmFuc2Zvcm0pXHJcbiAgICAgICAgICAgIC50aGVuKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RyYW5zZm9ybWVkKFt0cmFuc2Zvcm1dKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4gc2V0dGxlSW5TZXJpZXModGhpcywgJ3VwZGF0ZScsIHRyYW5zZm9ybSwgcmVzdWx0KSlcclxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHJlc3VsdCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgICAuY2F0Y2goZXJyb3IgPT4ge1xyXG4gICAgICAgIHJldHVybiBzZXR0bGVJblNlcmllcyh0aGlzLCAndXBkYXRlRmFpbCcsIHRyYW5zZm9ybSwgZXJyb3IpXHJcbiAgICAgICAgICAudGhlbigoKSA9PiB7IHRocm93IGVycm9yOyB9KTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==