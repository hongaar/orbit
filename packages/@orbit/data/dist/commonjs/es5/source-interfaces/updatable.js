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
        return core_1.fulfillInSeries(this, 'beforeUpdate', transform).then(function () {
            if (_this.transformLog.contains(transform.id)) {
                return main_1.default.Promise.resolve();
            } else {
                return _this._update(transform).then(function (result) {
                    return _this._transformed([transform]).then(function () {
                        return core_1.settleInSeries(_this, 'update', transform, result);
                    }).then(function () {
                        return result;
                    });
                });
            }
        }).catch(function (error) {
            return core_1.settleInSeries(_this, 'updateFail', transform, error).then(function () {
                throw error;
            });
        });
    };
}
exports.default = updatable;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRhYmxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3NvdXJjZS1pbnRlcmZhY2VzL3VwZGF0YWJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxxQkFBNEI7QUFDNUIsc0JBQXNDO0FBQ3RDLHFCQUE4RDtBQUU5RCx1QkFBZ0Q7QUFDaEQsMEJBQWdGO0FBRW5FLFFBQUEsQUFBUyxZQUFHLEFBQWUsQUFBQztBQUV6QyxBQU1HOzs7Ozs7O0FBQ0gscUJBQTRCLEFBQWMsUUFDeEMsQUFBTTtXQUFDLENBQUMsQ0FBQyxBQUFNLE9BQUMsUUFBUyxBQUFDLEFBQUMsQUFDN0IsQUFBQzs7QUFGRCxzQkFFQztBQTJCRCxBQTJCRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNILG1CQUFrQyxBQUFrQixPQUNsRDtRQUFJLEFBQUssUUFBRyxBQUFLLE1BQUMsQUFBUyxBQUFDLEFBRTVCLEFBQUUsQUFBQztRQUFDLEFBQVcsWUFBQyxBQUFLLEFBQUMsQUFBQyxRQUFDLEFBQUMsQUFDdkIsQUFBTSxBQUFDLEFBQ1Q7QUFBQztBQUVEO1lBQU0sT0FBQyxBQUFxRCx1REFBRSxBQUFLLGlCQUFZLFNBQU0sQUFBQyxBQUFDLEFBRXZGLEFBQUs7VUFBQyxRQUFTLEFBQUMsYUFBRyxBQUFJLEFBQUMsQUFFeEIsQUFBSztVQUFDLEFBQU0sU0FBRyxVQUFTLEFBQTRDLHVCQUFFLEFBQWdCLFNBQUUsQUFBVyxJQUNqRztZQUFNLEFBQVMsWUFBRyxZQUFjLGVBQUMsQUFBcUIsdUJBQUUsQUFBTyxTQUFFLEFBQUUsSUFBRSxBQUFJLEtBQUMsQUFBZ0IsQUFBQyxBQUFDLEFBRTVGLEFBQUUsQUFBQztZQUFDLEFBQUksS0FBQyxBQUFZLGFBQUMsQUFBUSxTQUFDLEFBQVMsVUFBQyxBQUFFLEFBQUMsQUFBQyxLQUFDLEFBQUMsQUFDN0MsQUFBTTttQkFBQyxPQUFLLFFBQUMsQUFBTyxRQUFDLEFBQU8sQUFBRSxBQUFDLEFBQ2pDLEFBQUM7QUFFRCxBQUFNO2VBQUMsQUFBSSxLQUFDLEFBQWUsZ0JBQUMsQUFBUSxVQUFFLEFBQVMsQUFBQyxBQUFDLEFBQ25ELEFBQUM7QUFFRCxBQUFLO1VBQUMsQUFBVSxhQUFHLFVBQVMsQUFBb0IsV0FBN0I7b0JBc0JsQixBQXJCQyxBQUFFLEFBQUM7WUFBQyxBQUFJLEtBQUMsQUFBWSxhQUFDLEFBQVEsU0FBQyxBQUFTLFVBQUMsQUFBRSxBQUFDLEFBQUMsS0FBQyxBQUFDLEFBQzdDLEFBQU07bUJBQUMsT0FBSyxRQUFDLEFBQU8sUUFBQyxBQUFPLEFBQUUsQUFBQyxBQUNqQyxBQUFDO0FBRUQsQUFBTTtzQkFBZ0IsZ0JBQUMsQUFBSSxNQUFFLEFBQWMsZ0JBQUUsQUFBUyxBQUFDLFdBQ3BELEFBQUksS0FBQyxZQUNKLEFBQUUsQUFBQztnQkFBQyxBQUFJLE1BQUMsQUFBWSxhQUFDLEFBQVEsU0FBQyxBQUFTLFVBQUMsQUFBRSxBQUFDLEFBQUMsS0FBQyxBQUFDLEFBQzdDLEFBQU07dUJBQUMsT0FBSyxRQUFDLEFBQU8sUUFBQyxBQUFPLEFBQUUsQUFBQyxBQUNqQyxBQUFDLEFBQUMsQUFBSTttQkFBQyxBQUFDLEFBQ04sQUFBTTs2QkFBTSxBQUFPLFFBQUMsQUFBUyxBQUFDLFdBQzNCLEFBQUksS0FBQyxVQUFBLEFBQU0sUUFDVixBQUFNO2lDQUFNLEFBQVksYUFBQyxDQUFDLEFBQVMsQUFBQyxBQUFDLFlBQ2xDLEFBQUksS0FBQyxZQUFNOytCQUFBLE9BQWMsZUFBQyxBQUFJLE9BQUUsQUFBUSxVQUFFLEFBQVMsV0FBeEMsQUFBMEMsQUFBTSxBQUFDLEFBQUM7QUFEekQsQUFBSSx1QkFFUixBQUFJLEtBQUMsWUFBTTsrQkFBQSxBQUFNLEFBQUMsQUFBQyxBQUN4QjtBQUFDLEFBQUMsQUFDTjtBQU5TLEFBQUksQUFNWixBQUNIO0FBQUMsQUFBQztBQVpHLFdBYUosQUFBSyxNQUFDLFVBQUEsQUFBSyxPQUNWLEFBQU07MEJBQWUsZUFBQyxBQUFJLE9BQUUsQUFBWSxjQUFFLEFBQVMsV0FBRSxBQUFLLEFBQUMsT0FDeEQsQUFBSSxLQUFDLFlBQVE7c0JBQU0sQUFBSyxBQUFDLEFBQUMsQUFBQyxBQUFDLEFBQUMsQUFDbEM7QUFGUyxBQUVSLEFBQUMsQUFBQyxBQUNQO0FBQUMsQUFDSDtBQUFDOztBQTVDRCxrQkE0Q0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgT3JiaXQgZnJvbSAnLi4vbWFpbic7XHJcbmltcG9ydCB7IGFzc2VydCB9IGZyb20gJ0BvcmJpdC91dGlscyc7XHJcbmltcG9ydCB7IHNldHRsZUluU2VyaWVzLCBmdWxmaWxsSW5TZXJpZXMgfSBmcm9tICdAb3JiaXQvY29yZSc7XHJcbmltcG9ydCB7IE9wZXJhdGlvbiB9IGZyb20gJy4uL29wZXJhdGlvbic7XHJcbmltcG9ydCB7IFNvdXJjZSwgU291cmNlQ2xhc3MgfSBmcm9tICcuLi9zb3VyY2UnO1xyXG5pbXBvcnQgeyBUcmFuc2Zvcm0sIFRyYW5zZm9ybU9yT3BlcmF0aW9ucywgYnVpbGRUcmFuc2Zvcm0gfSBmcm9tICcuLi90cmFuc2Zvcm0nO1xyXG5cclxuZXhwb3J0IGNvbnN0IFVQREFUQUJMRSA9ICdfX3VwZGF0YWJsZV9fJztcclxuXHJcbi8qKlxyXG4gKiBIYXMgYSBzb3VyY2UgYmVlbiBkZWNvcmF0ZWQgYXMgYEB1cGRhdGFibGVgP1xyXG4gKlxyXG4gKiBAZXhwb3J0XHJcbiAqIEBwYXJhbSB7Kn0gb2JqXHJcbiAqIEByZXR1cm5zXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gaXNVcGRhdGFibGUoc291cmNlOiBTb3VyY2UpIHtcclxuICByZXR1cm4gISFzb3VyY2VbVVBEQVRBQkxFXTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEEgc291cmNlIGRlY29yYXRlZCBhcyBgQHVwZGF0YWJsZWAgbXVzdCBhbHNvIGltcGxlbWVudCB0aGUgYFVwZGF0YWJsZWBcclxuICogaW50ZXJmYWNlLlxyXG4gKlxyXG4gKiBAZXhwb3J0XHJcbiAqIEBpbnRlcmZhY2UgVXBkYXRhYmxlXHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIFVwZGF0YWJsZSB7XHJcbiAgLyoqXHJcbiAgICogVGhlIGB1cGRhdGVgIG1ldGhvZCBhY2NlcHRzIGEgYFRyYW5zZm9ybWAgaW5zdGFuY2Ugb3IgYW4gYXJyYXkgb2ZcclxuICAgKiBvcGVyYXRpb25zIHdoaWNoIGl0IHRoZW4gY29udmVydHMgdG8gYSBgVHJhbnNmb3JtYCBpbnN0YW5jZS4gVGhlIHNvdXJjZVxyXG4gICAqIGFwcGxpZXMgdGhlIHVwZGF0ZSBhbmQgcmV0dXJucyBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB3aGVuIGNvbXBsZXRlLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtUcmFuc2Zvcm1Pck9wZXJhdGlvbnN9IHRyYW5zZm9ybU9yT3BlcmF0aW9uc1xyXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9uc11cclxuICAgKiBAcGFyYW0ge3N0cmluZ30gW2lkXVxyXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPHZvaWQ+fVxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIFVwZGF0YWJsZVxyXG4gICAqL1xyXG4gIHVwZGF0ZSh0cmFuc2Zvcm1Pck9wZXJhdGlvbnM6IFRyYW5zZm9ybU9yT3BlcmF0aW9ucywgb3B0aW9ucz86IG9iamVjdCwgaWQ/OiBzdHJpbmcpOiBQcm9taXNlPGFueT47XHJcblxyXG4gIF91cGRhdGUodHJhbnNmb3JtOiBUcmFuc2Zvcm0pOiBQcm9taXNlPGFueT47XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBNYXJrcyBhIHNvdXJjZSBhcyBcInVwZGF0YWJsZVwiIGFuZCBhZGRzIGFuIGltcGxlbWVudGF0aW9uIG9mIHRoZSBgVXBkYXRhYmxlYFxyXG4gKiBpbnRlcmZhY2UuXHJcbiAqXHJcbiAqIFRoZSBgdXBkYXRlYCBtZXRob2QgaXMgcGFydCBvZiB0aGUgXCJyZXF1ZXN0IGZsb3dcIiBpbiBPcmJpdC4gUmVxdWVzdHMgdHJpZ2dlclxyXG4gKiBldmVudHMgYmVmb3JlIGFuZCBhZnRlciBwcm9jZXNzaW5nIG9mIGVhY2ggcmVxdWVzdC4gT2JzZXJ2ZXJzIGNhbiBkZWxheSB0aGVcclxuICogcmVzb2x1dGlvbiBvZiBhIHJlcXVlc3QgYnkgcmV0dXJuaW5nIGEgcHJvbWlzZSBpbiBhbiBldmVudCBsaXN0ZW5lci5cclxuICpcclxuICogQW4gdXBkYXRhYmxlIHNvdXJjZSBlbWl0cyB0aGUgZm9sbG93aW5nIGV2ZW50czpcclxuICpcclxuICogLSBgYmVmb3JlVXBkYXRlYCAtIGVtaXR0ZWQgcHJpb3IgdG8gdGhlIHByb2Nlc3Npbmcgb2YgYHVwZGF0ZWAsIHRoaXMgZXZlbnRcclxuICogaW5jbHVkZXMgdGhlIHJlcXVlc3RlZCBgVHJhbnNmb3JtYCBhcyBhbiBhcmd1bWVudC5cclxuICpcclxuICogLSBgdXBkYXRlYCAtIGVtaXR0ZWQgYWZ0ZXIgYW4gYHVwZGF0ZWAgaGFzIHN1Y2Nlc3NmdWxseSBiZWVuIGFwcGxpZWQsIHRoaXNcclxuICogZXZlbnQgaW5jbHVkZXMgdGhlIHJlcXVlc3RlZCBgVHJhbnNmb3JtYCBhcyBhbiBhcmd1bWVudC5cclxuICpcclxuICogLSBgdXBkYXRlRmFpbGAgLSBlbWl0dGVkIHdoZW4gYW4gZXJyb3IgaGFzIG9jY3VycmVkIGFwcGx5aW5nIGFuIHVwZGF0ZSwgdGhpc1xyXG4gKiBldmVudCdzIGFyZ3VtZW50cyBpbmNsdWRlIGJvdGggdGhlIHJlcXVlc3RlZCBgVHJhbnNmb3JtYCBhbmQgdGhlIGVycm9yLlxyXG4gKlxyXG4gKiBBbiB1cGRhdGFibGUgc291cmNlIG11c3QgaW1wbGVtZW50IGEgcHJpdmF0ZSBtZXRob2QgYF91cGRhdGVgLCB3aGljaCBwZXJmb3Jtc1xyXG4gKiB0aGUgcHJvY2Vzc2luZyByZXF1aXJlZCBmb3IgYHVwZGF0ZWAgYW5kIHJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2hlblxyXG4gKiBjb21wbGV0ZS5cclxuICpcclxuICogQGV4cG9ydFxyXG4gKiBAZGVjb3JhdG9yXHJcbiAqIEBwYXJhbSB7U291cmNlQ2xhc3N9IEtsYXNzXHJcbiAqIEByZXR1cm5zIHt2b2lkfVxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdXBkYXRhYmxlKEtsYXNzOiBTb3VyY2VDbGFzcyk6IHZvaWQge1xyXG4gIGxldCBwcm90byA9IEtsYXNzLnByb3RvdHlwZTtcclxuXHJcbiAgaWYgKGlzVXBkYXRhYmxlKHByb3RvKSkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgYXNzZXJ0KCdVcGRhdGFibGUgaW50ZXJmYWNlIGNhbiBvbmx5IGJlIGFwcGxpZWQgdG8gYSBTb3VyY2UnLCBwcm90byBpbnN0YW5jZW9mIFNvdXJjZSk7XHJcblxyXG4gIHByb3RvW1VQREFUQUJMRV0gPSB0cnVlO1xyXG5cclxuICBwcm90by51cGRhdGUgPSBmdW5jdGlvbih0cmFuc2Zvcm1Pck9wZXJhdGlvbnM6IFRyYW5zZm9ybU9yT3BlcmF0aW9ucywgb3B0aW9ucz86IG9iamVjdCwgaWQ/OiBzdHJpbmcpOiBQcm9taXNlPGFueT4ge1xyXG4gICAgY29uc3QgdHJhbnNmb3JtID0gYnVpbGRUcmFuc2Zvcm0odHJhbnNmb3JtT3JPcGVyYXRpb25zLCBvcHRpb25zLCBpZCwgdGhpcy50cmFuc2Zvcm1CdWlsZGVyKTtcclxuXHJcbiAgICBpZiAodGhpcy50cmFuc2Zvcm1Mb2cuY29udGFpbnModHJhbnNmb3JtLmlkKSkge1xyXG4gICAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuX2VucXVldWVSZXF1ZXN0KCd1cGRhdGUnLCB0cmFuc2Zvcm0pO1xyXG4gIH1cclxuXHJcbiAgcHJvdG8uX191cGRhdGVfXyA9IGZ1bmN0aW9uKHRyYW5zZm9ybTogVHJhbnNmb3JtKTogUHJvbWlzZTxhbnk+IHtcclxuICAgIGlmICh0aGlzLnRyYW5zZm9ybUxvZy5jb250YWlucyh0cmFuc2Zvcm0uaWQpKSB7XHJcbiAgICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZnVsZmlsbEluU2VyaWVzKHRoaXMsICdiZWZvcmVVcGRhdGUnLCB0cmFuc2Zvcm0pXHJcbiAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICBpZiAodGhpcy50cmFuc2Zvcm1Mb2cuY29udGFpbnModHJhbnNmb3JtLmlkKSkge1xyXG4gICAgICAgICAgcmV0dXJuIE9yYml0LlByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXR1cm4gdGhpcy5fdXBkYXRlKHRyYW5zZm9ybSlcclxuICAgICAgICAgICAgLnRoZW4ocmVzdWx0ID0+IHtcclxuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fdHJhbnNmb3JtZWQoW3RyYW5zZm9ybV0pXHJcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiBzZXR0bGVJblNlcmllcyh0aGlzLCAndXBkYXRlJywgdHJhbnNmb3JtLCByZXN1bHQpKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4gcmVzdWx0KTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICAgIC5jYXRjaChlcnJvciA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHNldHRsZUluU2VyaWVzKHRoaXMsICd1cGRhdGVGYWlsJywgdHJhbnNmb3JtLCBlcnJvcilcclxuICAgICAgICAgIC50aGVuKCgpID0+IHsgdGhyb3cgZXJyb3I7IH0pO1xyXG4gICAgICB9KTtcclxuICB9XHJcbn1cclxuIl19