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
                return chain.then(function () {
                    return _this.sync(transform);
                });
            }, main_1.default.Promise.resolve());
        } else {
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
        return core_1.fulfillInSeries(this, 'beforeSync', transform).then(function () {
            if (_this.transformLog.contains(transform.id)) {
                return main_1.default.Promise.resolve();
            } else {
                return _this._sync(transform).then(function () {
                    return _this._transformed([transform]);
                }).then(function () {
                    return core_1.settleInSeries(_this, 'sync', transform);
                });
            }
        }).catch(function (error) {
            return core_1.settleInSeries(_this, 'syncFail', transform, error).then(function () {
                throw error;
            });
        });
    };
}
exports.default = syncable;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3luY2FibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvc291cmNlLWludGVyZmFjZXMvc3luY2FibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUJBQTRCO0FBQzVCLHNCQUErQztBQUMvQyxxQkFBOEQ7QUFDOUQsdUJBQWdEO0FBR25DLFFBQUEsQUFBUSxXQUFHLEFBQWMsQUFBQztBQUV2QyxBQU1HOzs7Ozs7O0FBQ0gsb0JBQTJCLEFBQWMsUUFDdkMsQUFBTTtXQUFDLENBQUMsQ0FBQyxBQUFNLE9BQUMsUUFBUSxBQUFDLEFBQUMsQUFDNUIsQUFBQzs7QUFGRCxxQkFFQztBQXNCRCxBQWVHOzs7Ozs7Ozs7Ozs7Ozs7O0FBQ0gsa0JBQWlDLEFBQWtCLE9BQ2pEO1FBQUksQUFBSyxRQUFHLEFBQUssTUFBQyxBQUFTLEFBQUMsQUFFNUIsQUFBRSxBQUFDO1FBQUMsQUFBVSxXQUFDLEFBQUssQUFBQyxBQUFDLFFBQUMsQUFBQyxBQUN0QixBQUFNLEFBQUMsQUFDVDtBQUFDO0FBRUQ7WUFBTSxPQUFDLEFBQW9ELHNEQUFFLEFBQUssaUJBQVksU0FBTSxBQUFDLEFBQUMsQUFFdEYsQUFBSztVQUFDLFFBQVEsQUFBQyxZQUFHLEFBQUksQUFBQyxBQUV2QixBQUFLO1VBQUMsQUFBSSxPQUFHLFVBQVMsQUFBOEMsdUJBQXZEO29CQWdCWixBQWZDLEFBQUUsQUFBQztZQUFDLFFBQU8sUUFBQyxBQUFxQixBQUFDLEFBQUMsd0JBQUMsQUFBQyxBQUNuQztnQkFBTSxBQUFVLGFBQWdCLEFBQXFCLEFBQUMsQUFFdEQsQUFBTTs4QkFBWSxBQUFNLE9BQUMsVUFBQyxBQUFLLE9BQUUsQUFBUyxXQUN4QyxBQUFNOzZCQUFPLEFBQUksS0FBQyxZQUFNOzJCQUFBLEFBQUksTUFBQyxBQUFJLEtBQVQsQUFBVSxBQUFTLEFBQUMsQUFBQyxBQUFDLEFBQ2hEO0FBRFMsQUFBSyxBQUNiO0FBRk0sQUFBVSxlQUVkLE9BQUssUUFBQyxBQUFPLFFBQUMsQUFBTyxBQUFFLEFBQUMsQUFBQyxBQUM5QixBQUFDLEFBQUMsQUFBSTtlQUFDLEFBQUMsQUFDTjtnQkFBTSxBQUFTLFlBQWMsQUFBcUIsQUFBQyxBQUVuRCxBQUFFLEFBQUM7Z0JBQUMsQUFBSSxLQUFDLEFBQVksYUFBQyxBQUFRLFNBQUMsQUFBUyxVQUFDLEFBQUUsQUFBQyxBQUFDLEtBQUMsQUFBQyxBQUM3QyxBQUFNO3VCQUFDLE9BQUssUUFBQyxBQUFPLFFBQUMsQUFBTyxBQUFFLEFBQUMsQUFDakMsQUFBQztBQUVELEFBQU07bUJBQUMsQUFBSSxLQUFDLEFBQVksYUFBQyxBQUFNLFFBQUUsQUFBUyxBQUFDLEFBQUMsQUFDOUMsQUFBQyxBQUNIO0FBQUM7QUFFRCxBQUFLO1VBQUMsQUFBUSxXQUFHLFVBQVMsQUFBb0IsV0FBN0I7b0JBbUJoQixBQWxCQyxBQUFFLEFBQUM7WUFBQyxBQUFJLEtBQUMsQUFBWSxhQUFDLEFBQVEsU0FBQyxBQUFTLFVBQUMsQUFBRSxBQUFDLEFBQUMsS0FBQyxBQUFDLEFBQzdDLEFBQU07bUJBQUMsT0FBSyxRQUFDLEFBQU8sUUFBQyxBQUFPLEFBQUUsQUFBQyxBQUNqQyxBQUFDO0FBRUQsQUFBTTtzQkFBZ0IsZ0JBQUMsQUFBSSxNQUFFLEFBQVksY0FBRSxBQUFTLEFBQUMsV0FDbEQsQUFBSSxLQUFDLFlBQ0osQUFBRSxBQUFDO2dCQUFDLEFBQUksTUFBQyxBQUFZLGFBQUMsQUFBUSxTQUFDLEFBQVMsVUFBQyxBQUFFLEFBQUMsQUFBQyxLQUFDLEFBQUMsQUFDN0MsQUFBTTt1QkFBQyxPQUFLLFFBQUMsQUFBTyxRQUFDLEFBQU8sQUFBRSxBQUFDLEFBQ2pDLEFBQUMsQUFBQyxBQUFJO21CQUFDLEFBQUMsQUFDTixBQUFNOzZCQUFNLEFBQUssTUFBQyxBQUFTLEFBQUMsV0FDekIsQUFBSSxLQUFDLFlBQU07MkJBQUEsQUFBSSxNQUFDLEFBQVksYUFBQyxDQUFsQixBQUFtQixBQUFTLEFBQUMsQUFBQyxBQUFDO0FBRHRDLEFBQUksbUJBRVIsQUFBSSxLQUFDLFlBQU07MkJBQUEsT0FBYyxlQUFDLEFBQUksT0FBRSxBQUFNLFFBQTNCLEFBQTZCLEFBQVMsQUFBQyxBQUFDLEFBQUMsQUFDekQ7QUFBQyxBQUNIO0FBQUMsQUFBQztBQVRHLFdBVUosQUFBSyxNQUFDLFVBQUEsQUFBSyxPQUNWLEFBQU07MEJBQWUsZUFBQyxBQUFJLE9BQUUsQUFBVSxZQUFFLEFBQVMsV0FBRSxBQUFLLEFBQUMsT0FDdEQsQUFBSSxLQUFDLFlBQVE7c0JBQU0sQUFBSyxBQUFDLEFBQUMsQUFBQyxBQUFDLEFBQUMsQUFDbEM7QUFGUyxBQUVSLEFBQUMsQUFBQyxBQUNQO0FBQUMsQUFDSDtBQUFDOztBQWpERCxrQkFpREMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgT3JiaXQgZnJvbSAnLi4vbWFpbic7XHJcbmltcG9ydCB7IGFzc2VydCwgaXNBcnJheSB9IGZyb20gJ0BvcmJpdC91dGlscyc7XHJcbmltcG9ydCB7IGZ1bGZpbGxJblNlcmllcywgc2V0dGxlSW5TZXJpZXMgfSBmcm9tICdAb3JiaXQvY29yZSc7XHJcbmltcG9ydCB7IFNvdXJjZSwgU291cmNlQ2xhc3MgfSBmcm9tICcuLi9zb3VyY2UnO1xyXG5pbXBvcnQgeyBUcmFuc2Zvcm0gfSBmcm9tICcuLi90cmFuc2Zvcm0nO1xyXG5cclxuZXhwb3J0IGNvbnN0IFNZTkNBQkxFID0gJ19fc3luY2FibGVfXyc7XHJcblxyXG4vKipcclxuICogSGFzIGEgc291cmNlIGJlZW4gZGVjb3JhdGVkIGFzIGBAc3luY2FibGVgP1xyXG4gKlxyXG4gKiBAZXhwb3J0XHJcbiAqIEBwYXJhbSB7U291cmNlQ2xhc3N9IHNvdXJjZVxyXG4gKiBAcmV0dXJuc1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGlzU3luY2FibGUoc291cmNlOiBTb3VyY2UpIHtcclxuICByZXR1cm4gISFzb3VyY2VbU1lOQ0FCTEVdO1xyXG59XHJcblxyXG4vKipcclxuICogQSBzb3VyY2UgZGVjb3JhdGVkIGFzIGBAc3luY2FibGVgIG11c3QgYWxzbyBpbXBsZW1lbnQgdGhlIGBTeW5jYWJsZWBcclxuICogaW50ZXJmYWNlLlxyXG4gKlxyXG4gKiBAZXhwb3J0XHJcbiAqIEBpbnRlcmZhY2UgU3luY2FibGVcclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgU3luY2FibGUge1xyXG4gIC8qKlxyXG4gICAqIFRoZSBgc3luY2AgbWV0aG9kIHRvIGEgc291cmNlLiBUaGlzIG1ldGhvZCBhY2NlcHRzIGEgYFRyYW5zZm9ybWAgb3IgYXJyYXlcclxuICAgKiBvZiBgVHJhbnNmb3JtYHMgYXMgYW4gYXJndW1lbnQgYW5kIGFwcGxpZXMgaXQgdG8gdGhlIHNvdXJjZS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7KFRyYW5zZm9ybSB8IFRyYW5zZm9ybVtdKX0gdHJhbnNmb3JtT3JUcmFuc2Zvcm1zXHJcbiAgICogQHJldHVybnMge1Byb21pc2U8dm9pZD59XHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgU3luY2FibGVcclxuICAgKi9cclxuICBzeW5jKHRyYW5zZm9ybU9yVHJhbnNmb3JtczogVHJhbnNmb3JtIHwgVHJhbnNmb3JtW10pOiBQcm9taXNlPHZvaWQ+O1xyXG59XHJcblxyXG4vKipcclxuICogTWFya3MgYSBzb3VyY2UgYXMgXCJzeW5jYWJsZVwiIGFuZCBhZGRzIGFuIGltcGxlbWVudGF0aW9uIG9mIHRoZSBgU3luY2FibGVgXHJcbiAqIGludGVyZmFjZS5cclxuICpcclxuICogVGhlIGBzeW5jYCBtZXRob2QgaXMgcGFydCBvZiB0aGUgXCJzeW5jIGZsb3dcIiBpbiBPcmJpdC4gVGhpcyBmbG93IGlzIHVzZWQgdG9cclxuICogc3luY2hyb25pemUgdGhlIGNvbnRlbnRzIG9mIHNvdXJjZXMuXHJcbiAqXHJcbiAqIE90aGVyIHNvdXJjZXMgY2FuIHBhcnRpY2lwYXRlIGluIHRoZSByZXNvbHV0aW9uIG9mIGEgYHN5bmNgIGJ5IG9ic2VydmluZyB0aGVcclxuICogYHRyYW5zZm9ybWAgZXZlbnQsIHdoaWNoIGlzIGVtaXR0ZWQgd2hlbmV2ZXIgYSBuZXcgYFRyYW5zZm9ybWAgaXMgYXBwbGllZCB0b1xyXG4gKiBhIHNvdXJjZS5cclxuICpcclxuICogQGV4cG9ydFxyXG4gKiBAZGVjb3JhdG9yXHJcbiAqIEBwYXJhbSB7U291cmNlQ2xhc3N9IEtsYXNzXHJcbiAqIEByZXR1cm5zIHt2b2lkfVxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc3luY2FibGUoS2xhc3M6IFNvdXJjZUNsYXNzKTogdm9pZCB7XHJcbiAgbGV0IHByb3RvID0gS2xhc3MucHJvdG90eXBlO1xyXG5cclxuICBpZiAoaXNTeW5jYWJsZShwcm90bykpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIGFzc2VydCgnU3luY2FibGUgaW50ZXJmYWNlIGNhbiBvbmx5IGJlIGFwcGxpZWQgdG8gYSBTb3VyY2UnLCBwcm90byBpbnN0YW5jZW9mIFNvdXJjZSk7XHJcblxyXG4gIHByb3RvW1NZTkNBQkxFXSA9IHRydWU7XHJcblxyXG4gIHByb3RvLnN5bmMgPSBmdW5jdGlvbih0cmFuc2Zvcm1PclRyYW5zZm9ybXM6IFRyYW5zZm9ybSB8IFRyYW5zZm9ybVtdKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICBpZiAoaXNBcnJheSh0cmFuc2Zvcm1PclRyYW5zZm9ybXMpKSB7XHJcbiAgICAgIGNvbnN0IHRyYW5zZm9ybXMgPSA8VHJhbnNmb3JtW10+dHJhbnNmb3JtT3JUcmFuc2Zvcm1zO1xyXG5cclxuICAgICAgcmV0dXJuIHRyYW5zZm9ybXMucmVkdWNlKChjaGFpbiwgdHJhbnNmb3JtKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGNoYWluLnRoZW4oKCkgPT4gdGhpcy5zeW5jKHRyYW5zZm9ybSkpO1xyXG4gICAgICB9LCBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zdCB0cmFuc2Zvcm0gPSA8VHJhbnNmb3JtPnRyYW5zZm9ybU9yVHJhbnNmb3JtcztcclxuXHJcbiAgICAgIGlmICh0aGlzLnRyYW5zZm9ybUxvZy5jb250YWlucyh0cmFuc2Zvcm0uaWQpKSB7XHJcbiAgICAgICAgcmV0dXJuIE9yYml0LlByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gdGhpcy5fZW5xdWV1ZVN5bmMoJ3N5bmMnLCB0cmFuc2Zvcm0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJvdG8uX19zeW5jX18gPSBmdW5jdGlvbih0cmFuc2Zvcm06IFRyYW5zZm9ybSk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgaWYgKHRoaXMudHJhbnNmb3JtTG9nLmNvbnRhaW5zKHRyYW5zZm9ybS5pZCkpIHtcclxuICAgICAgcmV0dXJuIE9yYml0LlByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBmdWxmaWxsSW5TZXJpZXModGhpcywgJ2JlZm9yZVN5bmMnLCB0cmFuc2Zvcm0pXHJcbiAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICBpZiAodGhpcy50cmFuc2Zvcm1Mb2cuY29udGFpbnModHJhbnNmb3JtLmlkKSkge1xyXG4gICAgICAgICAgcmV0dXJuIE9yYml0LlByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXR1cm4gdGhpcy5fc3luYyh0cmFuc2Zvcm0pXHJcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHRoaXMuX3RyYW5zZm9ybWVkKFt0cmFuc2Zvcm1dKSlcclxuICAgICAgICAgICAgLnRoZW4oKCkgPT4gc2V0dGxlSW5TZXJpZXModGhpcywgJ3N5bmMnLCB0cmFuc2Zvcm0pKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICAgIC5jYXRjaChlcnJvciA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHNldHRsZUluU2VyaWVzKHRoaXMsICdzeW5jRmFpbCcsIHRyYW5zZm9ybSwgZXJyb3IpXHJcbiAgICAgICAgICAudGhlbigoKSA9PiB7IHRocm93IGVycm9yOyB9KTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==