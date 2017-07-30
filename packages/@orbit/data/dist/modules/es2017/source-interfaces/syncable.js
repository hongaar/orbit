"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var main_1 = require("../main");
var utils_1 = require("@orbit/utils");
var core_1 = require("@orbit/core");
var source_1 = require("../source");
exports.SYNCABLE = '__syncable__';
/**
 * Has a source been decorated as `@syncable`?
 *
 * @export
 * @param {SourceClass} source
 * @returns
 */
function isSyncable(source) {
    return !!source[exports.SYNCABLE];
}
exports.isSyncable = isSyncable;
/**
 * Marks a source as "syncable" and adds an implementation of the `Syncable`
 * interface.
 *
 * The `sync` method is part of the "sync flow" in Orbit. This flow is used to
 * synchronize the contents of sources.
 *
 * Other sources can participate in the resolution of a `sync` by observing the
 * `transform` event, which is emitted whenever a new `Transform` is applied to
 * a source.
 *
 * @export
 * @decorator
 * @param {SourceClass} Klass
 * @returns {void}
 */
function syncable(Klass) {
    var proto = Klass.prototype;
    if (isSyncable(proto)) {
        return;
    }
    utils_1.assert('Syncable interface can only be applied to a Source', proto instanceof source_1.Source);
    proto[exports.SYNCABLE] = true;
    proto.sync = function (transformOrTransforms) {
        var _this = this;
        if (utils_1.isArray(transformOrTransforms)) {
            var transforms = transformOrTransforms;
            return transforms.reduce(function (chain, transform) {
                return chain.then(function () { return _this.sync(transform); });
            }, main_1.default.Promise.resolve());
        }
        else {
            var transform = transformOrTransforms;
            if (this.transformLog.contains(transform.id)) {
                return main_1.default.Promise.resolve();
            }
            return this._enqueueSync('sync', transform);
        }
    };
    proto.__sync__ = function (transform) {
        var _this = this;
        if (this.transformLog.contains(transform.id)) {
            return main_1.default.Promise.resolve();
        }
        return core_1.fulfillInSeries(this, 'beforeSync', transform)
            .then(function () {
            if (_this.transformLog.contains(transform.id)) {
                return main_1.default.Promise.resolve();
            }
            else {
                return _this._sync(transform)
                    .then(function () { return _this._transformed([transform]); })
                    .then(function () { return core_1.settleInSeries(_this, 'sync', transform); });
            }
        })
            .catch(function (error) {
            return core_1.settleInSeries(_this, 'syncFail', transform, error)
                .then(function () { throw error; });
        });
    };
}
exports.default = syncable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3luY2FibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvc291cmNlLWludGVyZmFjZXMvc3luY2FibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxnQ0FBNEI7QUFDNUIsc0NBQStDO0FBQy9DLG9DQUE4RDtBQUM5RCxvQ0FBZ0Q7QUFHbkMsUUFBQSxRQUFRLEdBQUcsY0FBYyxDQUFDO0FBRXZDOzs7Ozs7R0FNRztBQUNILG9CQUEyQixNQUFjO0lBQ3ZDLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLGdCQUFRLENBQUMsQ0FBQztBQUM1QixDQUFDO0FBRkQsZ0NBRUM7QUFzQkQ7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBQ0gsa0JBQWlDLEtBQWtCO0lBQ2pELElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUM7SUFFNUIsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixNQUFNLENBQUM7SUFDVCxDQUFDO0lBRUQsY0FBTSxDQUFDLG9EQUFvRCxFQUFFLEtBQUssWUFBWSxlQUFNLENBQUMsQ0FBQztJQUV0RixLQUFLLENBQUMsZ0JBQVEsQ0FBQyxHQUFHLElBQUksQ0FBQztJQUV2QixLQUFLLENBQUMsSUFBSSxHQUFHLFVBQVMscUJBQThDO1FBQXZELGlCQWdCWjtRQWZDLEVBQUUsQ0FBQyxDQUFDLGVBQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuQyxJQUFNLFVBQVUsR0FBZ0IscUJBQXFCLENBQUM7WUFFdEQsTUFBTSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsVUFBQyxLQUFLLEVBQUUsU0FBUztnQkFDeEMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsY0FBTSxPQUFBLEtBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQXBCLENBQW9CLENBQUMsQ0FBQztZQUNoRCxDQUFDLEVBQUUsY0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBQzlCLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLElBQU0sU0FBUyxHQUFjLHFCQUFxQixDQUFDO1lBRW5ELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzdDLE1BQU0sQ0FBQyxjQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ2pDLENBQUM7WUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDOUMsQ0FBQztJQUNILENBQUMsQ0FBQTtJQUVELEtBQUssQ0FBQyxRQUFRLEdBQUcsVUFBUyxTQUFvQjtRQUE3QixpQkFtQmhCO1FBbEJDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0MsTUFBTSxDQUFDLGNBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDakMsQ0FBQztRQUVELE1BQU0sQ0FBQyxzQkFBZSxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUUsU0FBUyxDQUFDO2FBQ2xELElBQUksQ0FBQztZQUNKLEVBQUUsQ0FBQyxDQUFDLEtBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzdDLE1BQU0sQ0FBQyxjQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ2pDLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixNQUFNLENBQUMsS0FBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUM7cUJBQ3pCLElBQUksQ0FBQyxjQUFNLE9BQUEsS0FBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQTlCLENBQThCLENBQUM7cUJBQzFDLElBQUksQ0FBQyxjQUFNLE9BQUEscUJBQWMsQ0FBQyxLQUFJLEVBQUUsTUFBTSxFQUFFLFNBQVMsQ0FBQyxFQUF2QyxDQUF1QyxDQUFDLENBQUM7WUFDekQsQ0FBQztRQUNILENBQUMsQ0FBQzthQUNELEtBQUssQ0FBQyxVQUFBLEtBQUs7WUFDVixNQUFNLENBQUMscUJBQWMsQ0FBQyxLQUFJLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxLQUFLLENBQUM7aUJBQ3RELElBQUksQ0FBQyxjQUFRLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEMsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUE7QUFDSCxDQUFDO0FBakRELDJCQWlEQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBPcmJpdCBmcm9tICcuLi9tYWluJztcclxuaW1wb3J0IHsgYXNzZXJ0LCBpc0FycmF5IH0gZnJvbSAnQG9yYml0L3V0aWxzJztcclxuaW1wb3J0IHsgZnVsZmlsbEluU2VyaWVzLCBzZXR0bGVJblNlcmllcyB9IGZyb20gJ0BvcmJpdC9jb3JlJztcclxuaW1wb3J0IHsgU291cmNlLCBTb3VyY2VDbGFzcyB9IGZyb20gJy4uL3NvdXJjZSc7XHJcbmltcG9ydCB7IFRyYW5zZm9ybSB9IGZyb20gJy4uL3RyYW5zZm9ybSc7XHJcblxyXG5leHBvcnQgY29uc3QgU1lOQ0FCTEUgPSAnX19zeW5jYWJsZV9fJztcclxuXHJcbi8qKlxyXG4gKiBIYXMgYSBzb3VyY2UgYmVlbiBkZWNvcmF0ZWQgYXMgYEBzeW5jYWJsZWA/XHJcbiAqXHJcbiAqIEBleHBvcnRcclxuICogQHBhcmFtIHtTb3VyY2VDbGFzc30gc291cmNlXHJcbiAqIEByZXR1cm5zXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gaXNTeW5jYWJsZShzb3VyY2U6IFNvdXJjZSkge1xyXG4gIHJldHVybiAhIXNvdXJjZVtTWU5DQUJMRV07XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBIHNvdXJjZSBkZWNvcmF0ZWQgYXMgYEBzeW5jYWJsZWAgbXVzdCBhbHNvIGltcGxlbWVudCB0aGUgYFN5bmNhYmxlYFxyXG4gKiBpbnRlcmZhY2UuXHJcbiAqXHJcbiAqIEBleHBvcnRcclxuICogQGludGVyZmFjZSBTeW5jYWJsZVxyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBTeW5jYWJsZSB7XHJcbiAgLyoqXHJcbiAgICogVGhlIGBzeW5jYCBtZXRob2QgdG8gYSBzb3VyY2UuIFRoaXMgbWV0aG9kIGFjY2VwdHMgYSBgVHJhbnNmb3JtYCBvciBhcnJheVxyXG4gICAqIG9mIGBUcmFuc2Zvcm1gcyBhcyBhbiBhcmd1bWVudCBhbmQgYXBwbGllcyBpdCB0byB0aGUgc291cmNlLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHsoVHJhbnNmb3JtIHwgVHJhbnNmb3JtW10pfSB0cmFuc2Zvcm1PclRyYW5zZm9ybXNcclxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkPn1cclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBTeW5jYWJsZVxyXG4gICAqL1xyXG4gIHN5bmModHJhbnNmb3JtT3JUcmFuc2Zvcm1zOiBUcmFuc2Zvcm0gfCBUcmFuc2Zvcm1bXSk6IFByb21pc2U8dm9pZD47XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBNYXJrcyBhIHNvdXJjZSBhcyBcInN5bmNhYmxlXCIgYW5kIGFkZHMgYW4gaW1wbGVtZW50YXRpb24gb2YgdGhlIGBTeW5jYWJsZWBcclxuICogaW50ZXJmYWNlLlxyXG4gKlxyXG4gKiBUaGUgYHN5bmNgIG1ldGhvZCBpcyBwYXJ0IG9mIHRoZSBcInN5bmMgZmxvd1wiIGluIE9yYml0LiBUaGlzIGZsb3cgaXMgdXNlZCB0b1xyXG4gKiBzeW5jaHJvbml6ZSB0aGUgY29udGVudHMgb2Ygc291cmNlcy5cclxuICpcclxuICogT3RoZXIgc291cmNlcyBjYW4gcGFydGljaXBhdGUgaW4gdGhlIHJlc29sdXRpb24gb2YgYSBgc3luY2AgYnkgb2JzZXJ2aW5nIHRoZVxyXG4gKiBgdHJhbnNmb3JtYCBldmVudCwgd2hpY2ggaXMgZW1pdHRlZCB3aGVuZXZlciBhIG5ldyBgVHJhbnNmb3JtYCBpcyBhcHBsaWVkIHRvXHJcbiAqIGEgc291cmNlLlxyXG4gKlxyXG4gKiBAZXhwb3J0XHJcbiAqIEBkZWNvcmF0b3JcclxuICogQHBhcmFtIHtTb3VyY2VDbGFzc30gS2xhc3NcclxuICogQHJldHVybnMge3ZvaWR9XHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzeW5jYWJsZShLbGFzczogU291cmNlQ2xhc3MpOiB2b2lkIHtcclxuICBsZXQgcHJvdG8gPSBLbGFzcy5wcm90b3R5cGU7XHJcblxyXG4gIGlmIChpc1N5bmNhYmxlKHByb3RvKSkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgYXNzZXJ0KCdTeW5jYWJsZSBpbnRlcmZhY2UgY2FuIG9ubHkgYmUgYXBwbGllZCB0byBhIFNvdXJjZScsIHByb3RvIGluc3RhbmNlb2YgU291cmNlKTtcclxuXHJcbiAgcHJvdG9bU1lOQ0FCTEVdID0gdHJ1ZTtcclxuXHJcbiAgcHJvdG8uc3luYyA9IGZ1bmN0aW9uKHRyYW5zZm9ybU9yVHJhbnNmb3JtczogVHJhbnNmb3JtIHwgVHJhbnNmb3JtW10pOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIGlmIChpc0FycmF5KHRyYW5zZm9ybU9yVHJhbnNmb3JtcykpIHtcclxuICAgICAgY29uc3QgdHJhbnNmb3JtcyA9IDxUcmFuc2Zvcm1bXT50cmFuc2Zvcm1PclRyYW5zZm9ybXM7XHJcblxyXG4gICAgICByZXR1cm4gdHJhbnNmb3Jtcy5yZWR1Y2UoKGNoYWluLCB0cmFuc2Zvcm0pID0+IHtcclxuICAgICAgICByZXR1cm4gY2hhaW4udGhlbigoKSA9PiB0aGlzLnN5bmModHJhbnNmb3JtKSk7XHJcbiAgICAgIH0sIE9yYml0LlByb21pc2UucmVzb2x2ZSgpKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnN0IHRyYW5zZm9ybSA9IDxUcmFuc2Zvcm0+dHJhbnNmb3JtT3JUcmFuc2Zvcm1zO1xyXG5cclxuICAgICAgaWYgKHRoaXMudHJhbnNmb3JtTG9nLmNvbnRhaW5zKHRyYW5zZm9ybS5pZCkpIHtcclxuICAgICAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0aGlzLl9lbnF1ZXVlU3luYygnc3luYycsIHRyYW5zZm9ybSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcm90by5fX3N5bmNfXyA9IGZ1bmN0aW9uKHRyYW5zZm9ybTogVHJhbnNmb3JtKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICBpZiAodGhpcy50cmFuc2Zvcm1Mb2cuY29udGFpbnModHJhbnNmb3JtLmlkKSkge1xyXG4gICAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGZ1bGZpbGxJblNlcmllcyh0aGlzLCAnYmVmb3JlU3luYycsIHRyYW5zZm9ybSlcclxuICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLnRyYW5zZm9ybUxvZy5jb250YWlucyh0cmFuc2Zvcm0uaWQpKSB7XHJcbiAgICAgICAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJldHVybiB0aGlzLl9zeW5jKHRyYW5zZm9ybSlcclxuICAgICAgICAgICAgLnRoZW4oKCkgPT4gdGhpcy5fdHJhbnNmb3JtZWQoW3RyYW5zZm9ybV0pKVxyXG4gICAgICAgICAgICAudGhlbigoKSA9PiBzZXR0bGVJblNlcmllcyh0aGlzLCAnc3luYycsIHRyYW5zZm9ybSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgICAgLmNhdGNoKGVycm9yID0+IHtcclxuICAgICAgICByZXR1cm4gc2V0dGxlSW5TZXJpZXModGhpcywgJ3N5bmNGYWlsJywgdHJhbnNmb3JtLCBlcnJvcilcclxuICAgICAgICAgIC50aGVuKCgpID0+IHsgdGhyb3cgZXJyb3I7IH0pO1xyXG4gICAgICB9KTtcclxuICB9XHJcbn1cclxuIl19