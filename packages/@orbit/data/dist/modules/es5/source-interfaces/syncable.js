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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3luY2FibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvc291cmNlLWludGVyZmFjZXMvc3luY2FibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUJBQTRCO0FBQzVCLHNCQUErQztBQUMvQyxxQkFBOEQ7QUFDOUQsdUJBQWdEO0FBR25DLFFBQUEsQUFBUSxXQUFHLEFBQWMsQUFBQztBQUV2QyxBQU1HOzs7Ozs7O0FBQ0gsb0JBQTJCLEFBQWM7QUFDdkMsQUFBTSxXQUFDLENBQUMsQ0FBQyxBQUFNLE9BQUMsUUFBUSxBQUFDLEFBQUMsQUFDNUI7QUFBQztBQUZELHFCQUVDO0FBc0JELEFBZUc7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDSCxrQkFBaUMsQUFBa0I7QUFDakQsUUFBSSxBQUFLLFFBQUcsQUFBSyxNQUFDLEFBQVMsQUFBQztBQUU1QixBQUFFLEFBQUMsUUFBQyxBQUFVLFdBQUMsQUFBSyxBQUFDLEFBQUMsUUFBQyxBQUFDO0FBQ3RCLEFBQU0sQUFBQyxBQUNUO0FBQUM7QUFFRCxZQUFNLE9BQUMsQUFBb0Qsc0RBQUUsQUFBSyxpQkFBWSxTQUFNLEFBQUMsQUFBQztBQUV0RixBQUFLLFVBQUMsUUFBUSxBQUFDLFlBQUcsQUFBSSxBQUFDO0FBRXZCLEFBQUssVUFBQyxBQUFJLE9BQUcsVUFBUyxBQUE4QztBQUF2RCxvQkFnQlo7QUFmQyxBQUFFLEFBQUMsWUFBQyxRQUFPLFFBQUMsQUFBcUIsQUFBQyxBQUFDLHdCQUFDLEFBQUM7QUFDbkMsZ0JBQU0sQUFBVSxhQUFnQixBQUFxQixBQUFDO0FBRXRELEFBQU0sOEJBQVksQUFBTSxPQUFDLFVBQUMsQUFBSyxPQUFFLEFBQVM7QUFDeEMsQUFBTSw2QkFBTyxBQUFJLEtBQUM7QUFBTSwyQkFBQSxBQUFJLE1BQUMsQUFBSSxLQUFULEFBQVUsQUFBUyxBQUFDO0FBQUEsQUFBQyxBQUFDLEFBQ2hELGlCQURTLEFBQUs7QUFDYixhQUZNLEFBQVUsRUFFZCxPQUFLLFFBQUMsQUFBTyxRQUFDLEFBQU8sQUFBRSxBQUFDLEFBQUMsQUFDOUI7QUFBQyxBQUFDLEFBQUksZUFBQyxBQUFDO0FBQ04sZ0JBQU0sQUFBUyxZQUFjLEFBQXFCLEFBQUM7QUFFbkQsQUFBRSxBQUFDLGdCQUFDLEFBQUksS0FBQyxBQUFZLGFBQUMsQUFBUSxTQUFDLEFBQVMsVUFBQyxBQUFFLEFBQUMsQUFBQyxLQUFDLEFBQUM7QUFDN0MsQUFBTSx1QkFBQyxPQUFLLFFBQUMsQUFBTyxRQUFDLEFBQU8sQUFBRSxBQUFDLEFBQ2pDO0FBQUM7QUFFRCxBQUFNLG1CQUFDLEFBQUksS0FBQyxBQUFZLGFBQUMsQUFBTSxRQUFFLEFBQVMsQUFBQyxBQUFDLEFBQzlDO0FBQUMsQUFDSDtBQUFDO0FBRUQsQUFBSyxVQUFDLEFBQVEsV0FBRyxVQUFTLEFBQW9CO0FBQTdCLG9CQW1CaEI7QUFsQkMsQUFBRSxBQUFDLFlBQUMsQUFBSSxLQUFDLEFBQVksYUFBQyxBQUFRLFNBQUMsQUFBUyxVQUFDLEFBQUUsQUFBQyxBQUFDLEtBQUMsQUFBQztBQUM3QyxBQUFNLG1CQUFDLE9BQUssUUFBQyxBQUFPLFFBQUMsQUFBTyxBQUFFLEFBQUMsQUFDakM7QUFBQztBQUVELEFBQU0sc0JBQWdCLGdCQUFDLEFBQUksTUFBRSxBQUFZLGNBQUUsQUFBUyxBQUFDLFdBQ2xELEFBQUksS0FBQztBQUNKLEFBQUUsQUFBQyxnQkFBQyxBQUFJLE1BQUMsQUFBWSxhQUFDLEFBQVEsU0FBQyxBQUFTLFVBQUMsQUFBRSxBQUFDLEFBQUMsS0FBQyxBQUFDO0FBQzdDLEFBQU0sdUJBQUMsT0FBSyxRQUFDLEFBQU8sUUFBQyxBQUFPLEFBQUUsQUFBQyxBQUNqQztBQUFDLEFBQUMsQUFBSSxtQkFBQyxBQUFDO0FBQ04sQUFBTSw2QkFBTSxBQUFLLE1BQUMsQUFBUyxBQUFDLFdBQ3pCLEFBQUksS0FBQztBQUFNLDJCQUFBLEFBQUksTUFBQyxBQUFZLGFBQUMsQ0FBbEIsQUFBbUIsQUFBUyxBQUFDLEFBQUM7QUFBQSxBQUFDLGlCQUR0QyxBQUFJLEVBRVIsQUFBSSxLQUFDO0FBQU0sMkJBQUEsT0FBYyxlQUFDLEFBQUksT0FBRSxBQUFNLFFBQTNCLEFBQTZCLEFBQVMsQUFBQztBQUFBLEFBQUMsQUFBQyxBQUN6RDtBQUFDLEFBQ0g7QUFBQyxBQUFDLFNBVEcsRUFVSixBQUFLLE1BQUMsVUFBQSxBQUFLO0FBQ1YsQUFBTSwwQkFBZSxlQUFDLEFBQUksT0FBRSxBQUFVLFlBQUUsQUFBUyxXQUFFLEFBQUssQUFBQyxPQUN0RCxBQUFJLEtBQUM7QUFBUSxzQkFBTSxBQUFLLEFBQUMsQUFBQztBQUFDLEFBQUMsQUFBQyxBQUNsQyxhQUZTO0FBRVIsQUFBQyxBQUFDLEFBQ1A7QUFBQyxBQUNIO0FBQUM7QUFqREQsa0JBaURDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE9yYml0IGZyb20gJy4uL21haW4nO1xyXG5pbXBvcnQgeyBhc3NlcnQsIGlzQXJyYXkgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xyXG5pbXBvcnQgeyBmdWxmaWxsSW5TZXJpZXMsIHNldHRsZUluU2VyaWVzIH0gZnJvbSAnQG9yYml0L2NvcmUnO1xyXG5pbXBvcnQgeyBTb3VyY2UsIFNvdXJjZUNsYXNzIH0gZnJvbSAnLi4vc291cmNlJztcclxuaW1wb3J0IHsgVHJhbnNmb3JtIH0gZnJvbSAnLi4vdHJhbnNmb3JtJztcclxuXHJcbmV4cG9ydCBjb25zdCBTWU5DQUJMRSA9ICdfX3N5bmNhYmxlX18nO1xyXG5cclxuLyoqXHJcbiAqIEhhcyBhIHNvdXJjZSBiZWVuIGRlY29yYXRlZCBhcyBgQHN5bmNhYmxlYD9cclxuICpcclxuICogQGV4cG9ydFxyXG4gKiBAcGFyYW0ge1NvdXJjZUNsYXNzfSBzb3VyY2VcclxuICogQHJldHVybnNcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBpc1N5bmNhYmxlKHNvdXJjZTogU291cmNlKSB7XHJcbiAgcmV0dXJuICEhc291cmNlW1NZTkNBQkxFXTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEEgc291cmNlIGRlY29yYXRlZCBhcyBgQHN5bmNhYmxlYCBtdXN0IGFsc28gaW1wbGVtZW50IHRoZSBgU3luY2FibGVgXHJcbiAqIGludGVyZmFjZS5cclxuICpcclxuICogQGV4cG9ydFxyXG4gKiBAaW50ZXJmYWNlIFN5bmNhYmxlXHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIFN5bmNhYmxlIHtcclxuICAvKipcclxuICAgKiBUaGUgYHN5bmNgIG1ldGhvZCB0byBhIHNvdXJjZS4gVGhpcyBtZXRob2QgYWNjZXB0cyBhIGBUcmFuc2Zvcm1gIG9yIGFycmF5XHJcbiAgICogb2YgYFRyYW5zZm9ybWBzIGFzIGFuIGFyZ3VtZW50IGFuZCBhcHBsaWVzIGl0IHRvIHRoZSBzb3VyY2UuXHJcbiAgICpcclxuICAgKiBAcGFyYW0geyhUcmFuc2Zvcm0gfCBUcmFuc2Zvcm1bXSl9IHRyYW5zZm9ybU9yVHJhbnNmb3Jtc1xyXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPHZvaWQ+fVxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIFN5bmNhYmxlXHJcbiAgICovXHJcbiAgc3luYyh0cmFuc2Zvcm1PclRyYW5zZm9ybXM6IFRyYW5zZm9ybSB8IFRyYW5zZm9ybVtdKTogUHJvbWlzZTx2b2lkPjtcclxufVxyXG5cclxuLyoqXHJcbiAqIE1hcmtzIGEgc291cmNlIGFzIFwic3luY2FibGVcIiBhbmQgYWRkcyBhbiBpbXBsZW1lbnRhdGlvbiBvZiB0aGUgYFN5bmNhYmxlYFxyXG4gKiBpbnRlcmZhY2UuXHJcbiAqXHJcbiAqIFRoZSBgc3luY2AgbWV0aG9kIGlzIHBhcnQgb2YgdGhlIFwic3luYyBmbG93XCIgaW4gT3JiaXQuIFRoaXMgZmxvdyBpcyB1c2VkIHRvXHJcbiAqIHN5bmNocm9uaXplIHRoZSBjb250ZW50cyBvZiBzb3VyY2VzLlxyXG4gKlxyXG4gKiBPdGhlciBzb3VyY2VzIGNhbiBwYXJ0aWNpcGF0ZSBpbiB0aGUgcmVzb2x1dGlvbiBvZiBhIGBzeW5jYCBieSBvYnNlcnZpbmcgdGhlXHJcbiAqIGB0cmFuc2Zvcm1gIGV2ZW50LCB3aGljaCBpcyBlbWl0dGVkIHdoZW5ldmVyIGEgbmV3IGBUcmFuc2Zvcm1gIGlzIGFwcGxpZWQgdG9cclxuICogYSBzb3VyY2UuXHJcbiAqXHJcbiAqIEBleHBvcnRcclxuICogQGRlY29yYXRvclxyXG4gKiBAcGFyYW0ge1NvdXJjZUNsYXNzfSBLbGFzc1xyXG4gKiBAcmV0dXJucyB7dm9pZH1cclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHN5bmNhYmxlKEtsYXNzOiBTb3VyY2VDbGFzcyk6IHZvaWQge1xyXG4gIGxldCBwcm90byA9IEtsYXNzLnByb3RvdHlwZTtcclxuXHJcbiAgaWYgKGlzU3luY2FibGUocHJvdG8pKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICBhc3NlcnQoJ1N5bmNhYmxlIGludGVyZmFjZSBjYW4gb25seSBiZSBhcHBsaWVkIHRvIGEgU291cmNlJywgcHJvdG8gaW5zdGFuY2VvZiBTb3VyY2UpO1xyXG5cclxuICBwcm90b1tTWU5DQUJMRV0gPSB0cnVlO1xyXG5cclxuICBwcm90by5zeW5jID0gZnVuY3Rpb24odHJhbnNmb3JtT3JUcmFuc2Zvcm1zOiBUcmFuc2Zvcm0gfCBUcmFuc2Zvcm1bXSk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgaWYgKGlzQXJyYXkodHJhbnNmb3JtT3JUcmFuc2Zvcm1zKSkge1xyXG4gICAgICBjb25zdCB0cmFuc2Zvcm1zID0gPFRyYW5zZm9ybVtdPnRyYW5zZm9ybU9yVHJhbnNmb3JtcztcclxuXHJcbiAgICAgIHJldHVybiB0cmFuc2Zvcm1zLnJlZHVjZSgoY2hhaW4sIHRyYW5zZm9ybSkgPT4ge1xyXG4gICAgICAgIHJldHVybiBjaGFpbi50aGVuKCgpID0+IHRoaXMuc3luYyh0cmFuc2Zvcm0pKTtcclxuICAgICAgfSwgT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCkpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc3QgdHJhbnNmb3JtID0gPFRyYW5zZm9ybT50cmFuc2Zvcm1PclRyYW5zZm9ybXM7XHJcblxyXG4gICAgICBpZiAodGhpcy50cmFuc2Zvcm1Mb2cuY29udGFpbnModHJhbnNmb3JtLmlkKSkge1xyXG4gICAgICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuX2VucXVldWVTeW5jKCdzeW5jJywgdHJhbnNmb3JtKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByb3RvLl9fc3luY19fID0gZnVuY3Rpb24odHJhbnNmb3JtOiBUcmFuc2Zvcm0pOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIGlmICh0aGlzLnRyYW5zZm9ybUxvZy5jb250YWlucyh0cmFuc2Zvcm0uaWQpKSB7XHJcbiAgICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZnVsZmlsbEluU2VyaWVzKHRoaXMsICdiZWZvcmVTeW5jJywgdHJhbnNmb3JtKVxyXG4gICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMudHJhbnNmb3JtTG9nLmNvbnRhaW5zKHRyYW5zZm9ybS5pZCkpIHtcclxuICAgICAgICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmV0dXJuIHRoaXMuX3N5bmModHJhbnNmb3JtKVxyXG4gICAgICAgICAgICAudGhlbigoKSA9PiB0aGlzLl90cmFuc2Zvcm1lZChbdHJhbnNmb3JtXSkpXHJcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHNldHRsZUluU2VyaWVzKHRoaXMsICdzeW5jJywgdHJhbnNmb3JtKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgICAuY2F0Y2goZXJyb3IgPT4ge1xyXG4gICAgICAgIHJldHVybiBzZXR0bGVJblNlcmllcyh0aGlzLCAnc3luY0ZhaWwnLCB0cmFuc2Zvcm0sIGVycm9yKVxyXG4gICAgICAgICAgLnRoZW4oKCkgPT4geyB0aHJvdyBlcnJvcjsgfSk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxufVxyXG4iXX0=