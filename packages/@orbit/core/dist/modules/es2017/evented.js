"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var main_1 = require("./main");
var notifier_1 = require("./notifier");
exports.EVENTED = '__evented__';
/**
 * Has a class been decorated as `@evented`?
 *
 * @export
 * @param {object} obj
 * @returns {boolean}
 */
function isEvented(obj) {
    return !!obj[exports.EVENTED];
}
exports.isEvented = isEvented;
/**
 * Marks a class as evented.
 *
 * An evented class should also implement the `Evented` interface.
 *
 * ```ts
 * import { evented, Evented } from '@orbit/core';
 *
 * @evented
 * class Source implements Evented {
 *   ...
 * }
 * ```
 *
 * Listeners can then register themselves for particular events with `on`:
 *
 * ```ts
 * let source = new Source();
 *
 * function listener1(message: string) {
 *   console.log('listener1 heard ' + message);
 * };
 * function listener2(message: string) {
 *   console.log('listener2 heard ' + message);
 * };
 *
 * source.on('greeting', listener1);
 * source.on('greeting', listener2);
 *
 * evented.emit('greeting', 'hello'); // logs "listener1 heard hello" and
 *                                    //      "listener2 heard hello"
 * ```
 *
 * Listeners can be unregistered from events at any time with `off`:
 *
 * ```ts
 * source.off('greeting', listener2);
 * ```
 *
 * @decorator
 * @export
 * @param {*} Klass
 */
function evented(Klass) {
    var proto = Klass.prototype;
    if (isEvented(proto)) {
        return;
    }
    proto[exports.EVENTED] = true;
    proto.on = function (eventName, callback, _binding) {
        var binding = _binding || this;
        notifierForEvent(this, eventName, true).addListener(callback, binding);
    };
    proto.off = function (eventName, callback, _binding) {
        var binding = _binding || this;
        var notifier = notifierForEvent(this, eventName);
        if (notifier) {
            if (callback) {
                notifier.removeListener(callback, binding);
            }
            else {
                removeNotifierForEvent(this, eventName);
            }
        }
    };
    proto.one = function (eventName, callback, _binding) {
        var callOnce;
        var notifier;
        var binding = _binding || this;
        notifier = notifierForEvent(this, eventName, true);
        callOnce = function () {
            callback.apply(binding, arguments);
            notifier.removeListener(callOnce, binding);
        };
        notifier.addListener(callOnce, binding);
    };
    proto.emit = function (eventName) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var notifier = notifierForEvent(this, eventName);
        if (notifier) {
            notifier.emit.apply(notifier, args);
        }
    };
    proto.listeners = function (eventName) {
        var notifier = notifierForEvent(this, eventName);
        return notifier ? notifier.listeners : [];
    };
}
exports.default = evented;
/**
 * Settle any promises returned by event listeners in series.
 *
 * If any errors are encountered during processing, they will be ignored.
 *
 * @export
 * @param {Evented} obj
 * @param {any} eventName
 * @param {any} args
 * @returns {Promise<void>}
 */
function settleInSeries(obj, eventName) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    var listeners = obj.listeners(eventName);
    return listeners.reduce(function (chain, _a) {
        var callback = _a[0], binding = _a[1];
        return chain
            .then(function () { return callback.apply(binding, args); })
            .catch(function (e) { });
    }, main_1.default.Promise.resolve());
}
exports.settleInSeries = settleInSeries;
/**
 * Fulfill any promises returned by event listeners in series.
 *
 * Processing will stop if an error is encountered and the returned promise will
 * be rejected.
 *
 * @export
 * @param {Evented} obj
 * @param {any} eventName
 * @param {any} args
 * @returns {Promise<void>}
 */
function fulfillInSeries(obj, eventName) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    var listeners = obj.listeners(eventName);
    return new main_1.default.Promise(function (resolve, reject) {
        fulfillEach(listeners, args, resolve, reject);
    });
}
exports.fulfillInSeries = fulfillInSeries;
function notifierForEvent(object, eventName, createIfUndefined) {
    if (createIfUndefined === void 0) { createIfUndefined = false; }
    if (object._eventedNotifiers === undefined) {
        object._eventedNotifiers = {};
    }
    var notifier = object._eventedNotifiers[eventName];
    if (!notifier && createIfUndefined) {
        notifier = object._eventedNotifiers[eventName] = new notifier_1.default();
    }
    return notifier;
}
function removeNotifierForEvent(object, eventName) {
    if (object._eventedNotifiers && object._eventedNotifiers[eventName]) {
        delete object._eventedNotifiers[eventName];
    }
}
function fulfillEach(listeners, args, resolve, reject) {
    if (listeners.length === 0) {
        resolve();
    }
    else {
        var listener = void 0;
        listener = listeners[0], listeners = listeners.slice(1);
        var callback = listener[0], binding = listener[1];
        var response = callback.apply(binding, args);
        if (response) {
            return main_1.default.Promise.resolve(response)
                .then(function () { return fulfillEach(listeners, args, resolve, reject); })
                .catch(function (error) { return reject(error); });
        }
        else {
            fulfillEach(listeners, args, resolve, reject);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNyYy9ldmVudGVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsK0JBQTJCO0FBQzNCLHVDQUFrQztBQUtyQixRQUFBLE9BQU8sR0FBRyxhQUFhLENBQUM7QUFFckM7Ozs7OztHQU1HO0FBQ0gsbUJBQTBCLEdBQVc7SUFDbkMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsZUFBTyxDQUFDLENBQUM7QUFDeEIsQ0FBQztBQUZELDhCQUVDO0FBMEJEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0EwQ0c7QUFDSCxpQkFBZ0MsS0FBVTtJQUN4QyxJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDO0lBRTVCLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckIsTUFBTSxDQUFDO0lBQ1QsQ0FBQztJQUVELEtBQUssQ0FBQyxlQUFPLENBQUMsR0FBRyxJQUFJLENBQUM7SUFFdEIsS0FBSyxDQUFDLEVBQUUsR0FBRyxVQUFTLFNBQVMsRUFBRSxRQUFRLEVBQUUsUUFBUTtRQUMvQyxJQUFNLE9BQU8sR0FBRyxRQUFRLElBQUksSUFBSSxDQUFDO1FBRWpDLGdCQUFnQixDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN6RSxDQUFDLENBQUM7SUFFRixLQUFLLENBQUMsR0FBRyxHQUFHLFVBQVMsU0FBUyxFQUFFLFFBQVEsRUFBRSxRQUFRO1FBQ2hELElBQU0sT0FBTyxHQUFHLFFBQVEsSUFBSSxJQUFJLENBQUM7UUFDakMsSUFBTSxRQUFRLEdBQUcsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBRW5ELEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDYixF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USxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFN0MsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNiLE1BQU0sQ0FBQyxjQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUM7aUJBQ25DLElBQUksQ0FBQyxjQUFNLE9BQUEsV0FBVyxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxFQUE3QyxDQUE2QyxDQUFDO2lCQUN6RCxLQUFLLENBQUMsVUFBQSxLQUFLLElBQUksT0FBQSxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQWIsQ0FBYSxDQUFDLENBQUM7UUFDbkMsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sV0FBVyxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ2hELENBQUM7SUFDSCxDQUFDO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBPcmJpdCBmcm9tICcuL21haW4nO1xyXG5pbXBvcnQgTm90aWZpZXIgZnJvbSAnLi9ub3RpZmllcic7XHJcbmltcG9ydCB7IGFzc2VydCB9IGZyb20gJ0BvcmJpdC91dGlscyc7XHJcblxyXG5kZWNsYXJlIGNvbnN0IGNvbnNvbGU6IGFueTtcclxuXHJcbmV4cG9ydCBjb25zdCBFVkVOVEVEID0gJ19fZXZlbnRlZF9fJztcclxuXHJcbi8qKlxyXG4gKiBIYXMgYSBjbGFzcyBiZWVuIGRlY29yYXRlZCBhcyBgQGV2ZW50ZWRgP1xyXG4gKiBcclxuICogQGV4cG9ydFxyXG4gKiBAcGFyYW0ge29iamVjdH0gb2JqIFxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gaXNFdmVudGVkKG9iajogb2JqZWN0KTogYm9vbGVhbiB7XHJcbiAgcmV0dXJuICEhb2JqW0VWRU5URURdO1xyXG59XHJcblxyXG4vKipcclxuICogQSBjbGFzcyBkZWNvcmF0ZWQgYXMgYEBldmVudGVkYCBzaG91bGQgYWxzbyBpbXBsZW1lbnQgdGhlIGBFdmVudGVkYCBcclxuICogaW50ZXJmYWNlLlxyXG4gKiBcclxuICogYGBgdHNcclxuICogaW1wb3J0IHsgZXZlbnRlZCwgRXZlbnRlZCB9IGZyb20gJ0BvcmJpdC9jb3JlJztcclxuICpcclxuICogQGV2ZW50ZWRcclxuICogY2xhc3MgU291cmNlIGltcGxlbWVudHMgRXZlbnRlZCB7XHJcbiAqICAgLy8gLi4uIEV2ZW50ZWQgaW1wbGVtZW50YXRpb25cclxuICogfVxyXG4gKiBgYGBcclxuICogXHJcbiAqIEBleHBvcnRcclxuICogQGludGVyZmFjZSBFdmVudGVkXHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIEV2ZW50ZWQge1xyXG4gIG9uOiAoZXZlbnQ6IHN0cmluZywgY2FsbGJhY2s6IEZ1bmN0aW9uLCBiaW5kaW5nPzogb2JqZWN0KSA9PiB2b2lkO1xyXG4gIG9mZjogKGV2ZW50OiBzdHJpbmcsIGNhbGxiYWNrOiBGdW5jdGlvbiwgYmluZGluZz86IG9iamVjdCkgPT4gdm9pZDtcclxuICBvbmU6IChldmVudDogc3RyaW5nLCBjYWxsYmFjazogRnVuY3Rpb24sIGJpbmRpbmc/OiBvYmplY3QpID0+IHZvaWQ7XHJcbiAgZW1pdDogKGV2ZW50OiBzdHJpbmcsIC4uLmFyZ3MpID0+IHZvaWQ7XHJcbiAgbGlzdGVuZXJzOiAoZXZlbnQ6IHN0cmluZykgPT4gYW55W107XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBNYXJrcyBhIGNsYXNzIGFzIGV2ZW50ZWQuXHJcbiAqIFxyXG4gKiBBbiBldmVudGVkIGNsYXNzIHNob3VsZCBhbHNvIGltcGxlbWVudCB0aGUgYEV2ZW50ZWRgIGludGVyZmFjZS5cclxuICpcclxuICogYGBgdHNcclxuICogaW1wb3J0IHsgZXZlbnRlZCwgRXZlbnRlZCB9IGZyb20gJ0BvcmJpdC9jb3JlJztcclxuICpcclxuICogQGV2ZW50ZWRcclxuICogY2xhc3MgU291cmNlIGltcGxlbWVudHMgRXZlbnRlZCB7XHJcbiAqICAgLi4uXHJcbiAqIH1cclxuICogYGBgXHJcbiAqIFxyXG4gKiBMaXN0ZW5lcnMgY2FuIHRoZW4gcmVnaXN0ZXIgdGhlbXNlbHZlcyBmb3IgcGFydGljdWxhciBldmVudHMgd2l0aCBgb25gOlxyXG4gKlxyXG4gKiBgYGB0c1xyXG4gKiBsZXQgc291cmNlID0gbmV3IFNvdXJjZSgpO1xyXG4gKiBcclxuICogZnVuY3Rpb24gbGlzdGVuZXIxKG1lc3NhZ2U6IHN0cmluZykge1xyXG4gKiAgIGNvbnNvbGUubG9nKCdsaXN0ZW5lcjEgaGVhcmQgJyArIG1lc3NhZ2UpO1xyXG4gKiB9O1xyXG4gKiBmdW5jdGlvbiBsaXN0ZW5lcjIobWVzc2FnZTogc3RyaW5nKSB7XHJcbiAqICAgY29uc29sZS5sb2coJ2xpc3RlbmVyMiBoZWFyZCAnICsgbWVzc2FnZSk7XHJcbiAqIH07XHJcbiAqXHJcbiAqIHNvdXJjZS5vbignZ3JlZXRpbmcnLCBsaXN0ZW5lcjEpO1xyXG4gKiBzb3VyY2Uub24oJ2dyZWV0aW5nJywgbGlzdGVuZXIyKTtcclxuICpcclxuICogZXZlbnRlZC5lbWl0KCdncmVldGluZycsICdoZWxsbycpOyAvLyBsb2dzIFwibGlzdGVuZXIxIGhlYXJkIGhlbGxvXCIgYW5kXHJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICBcImxpc3RlbmVyMiBoZWFyZCBoZWxsb1wiXHJcbiAqIGBgYFxyXG4gKlxyXG4gKiBMaXN0ZW5lcnMgY2FuIGJlIHVucmVnaXN0ZXJlZCBmcm9tIGV2ZW50cyBhdCBhbnkgdGltZSB3aXRoIGBvZmZgOlxyXG4gKlxyXG4gKiBgYGB0c1xyXG4gKiBzb3VyY2Uub2ZmKCdncmVldGluZycsIGxpc3RlbmVyMik7XHJcbiAqIGBgYFxyXG4gKiBcclxuICogQGRlY29yYXRvclxyXG4gKiBAZXhwb3J0XHJcbiAqIEBwYXJhbSB7Kn0gS2xhc3MgXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBldmVudGVkKEtsYXNzOiBhbnkpOiB2b2lkIHtcclxuICBsZXQgcHJvdG8gPSBLbGFzcy5wcm90b3R5cGU7XHJcblxyXG4gIGlmIChpc0V2ZW50ZWQocHJvdG8pKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICBwcm90b1tFVkVOVEVEXSA9IHRydWU7XHJcblxyXG4gIHByb3RvLm9uID0gZnVuY3Rpb24oZXZlbnROYW1lLCBjYWxsYmFjaywgX2JpbmRpbmcpIHtcclxuICAgIGNvbnN0IGJpbmRpbmcgPSBfYmluZGluZyB8fCB0aGlzO1xyXG5cclxuICAgIG5vdGlmaWVyRm9yRXZlbnQodGhpcywgZXZlbnROYW1lLCB0cnVlKS5hZGRMaXN0ZW5lcihjYWxsYmFjaywgYmluZGluZyk7XHJcbiAgfTtcclxuXHJcbiAgcHJvdG8ub2ZmID0gZnVuY3Rpb24oZXZlbnROYW1lLCBjYWxsYmFjaywgX2JpbmRpbmcpIHtcclxuICAgIGNvbnN0IGJpbmRpbmcgPSBfYmluZGluZyB8fCB0aGlzO1xyXG4gICAgY29uc3Qgbm90aWZpZXIgPSBub3RpZmllckZvckV2ZW50KHRoaXMsIGV2ZW50TmFtZSk7XHJcblxyXG4gICAgaWYgKG5vdGlmaWVyKSB7XHJcbiAgICAgIGlmIChjYWxsYmFjaykge1xyXG4gICAgICAgIG5vdGlmaWVyLnJlbW92ZUxpc3RlbmVyKGNhbGxiYWNrLCBiaW5kaW5nKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZW1vdmVOb3RpZmllckZvckV2ZW50KHRoaXMsIGV2ZW50TmFtZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9O1xyXG5cclxuICBwcm90by5vbmUgPSBmdW5jdGlvbihldmVudE5hbWUsIGNhbGxiYWNrLCBfYmluZGluZykge1xyXG4gICAgbGV0IGNhbGxPbmNlO1xyXG4gICAgbGV0IG5vdGlmaWVyO1xyXG4gICAgbGV0IGJpbmRpbmcgPSBfYmluZGluZyB8fCB0aGlzO1xyXG5cclxuICAgIG5vdGlmaWVyID0gbm90aWZpZXJGb3JFdmVudCh0aGlzLCBldmVudE5hbWUsIHRydWUpO1xyXG5cclxuICAgIGNhbGxPbmNlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgIGNhbGxiYWNrLmFwcGx5KGJpbmRpbmcsIGFyZ3VtZW50cyk7XHJcbiAgICAgIG5vdGlmaWVyLnJlbW92ZUxpc3RlbmVyKGNhbGxPbmNlLCBiaW5kaW5nKTtcclxuICAgIH07XHJcblxyXG4gICAgbm90aWZpZXIuYWRkTGlzdGVuZXIoY2FsbE9uY2UsIGJpbmRpbmcpO1xyXG4gIH07XHJcblxyXG4gIHByb3RvLmVtaXQgPSBmdW5jdGlvbihldmVudE5hbWUsIC4uLmFyZ3MpIHtcclxuICAgIGxldCBub3RpZmllciA9IG5vdGlmaWVyRm9yRXZlbnQodGhpcywgZXZlbnROYW1lKTtcclxuXHJcbiAgICBpZiAobm90aWZpZXIpIHtcclxuICAgICAgbm90aWZpZXIuZW1pdC5hcHBseShub3RpZmllciwgYXJncyk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgcHJvdG8ubGlzdGVuZXJzID0gZnVuY3Rpb24oZXZlbnROYW1lKSB7XHJcbiAgICBsZXQgbm90aWZpZXIgPSBub3RpZmllckZvckV2ZW50KHRoaXMsIGV2ZW50TmFtZSk7XHJcbiAgICByZXR1cm4gbm90aWZpZXIgPyBub3RpZmllci5saXN0ZW5lcnMgOiBbXTtcclxuICB9O1xyXG59XHJcblxyXG4vKipcclxuICogU2V0dGxlIGFueSBwcm9taXNlcyByZXR1cm5lZCBieSBldmVudCBsaXN0ZW5lcnMgaW4gc2VyaWVzLlxyXG4gKiBcclxuICogSWYgYW55IGVycm9ycyBhcmUgZW5jb3VudGVyZWQgZHVyaW5nIHByb2Nlc3NpbmcsIHRoZXkgd2lsbCBiZSBpZ25vcmVkLlxyXG4gKiBcclxuICogQGV4cG9ydFxyXG4gKiBAcGFyYW0ge0V2ZW50ZWR9IG9iaiBcclxuICogQHBhcmFtIHthbnl9IGV2ZW50TmFtZSBcclxuICogQHBhcmFtIHthbnl9IGFyZ3MgXHJcbiAqIEByZXR1cm5zIHtQcm9taXNlPHZvaWQ+fVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHNldHRsZUluU2VyaWVzKG9iajogRXZlbnRlZCwgZXZlbnROYW1lLCAuLi5hcmdzKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgY29uc3QgbGlzdGVuZXJzID0gb2JqLmxpc3RlbmVycyhldmVudE5hbWUpO1xyXG5cclxuICByZXR1cm4gbGlzdGVuZXJzLnJlZHVjZSgoY2hhaW4sIFtjYWxsYmFjaywgYmluZGluZ10pID0+IHtcclxuICAgIHJldHVybiBjaGFpblxyXG4gICAgICAudGhlbigoKSA9PiBjYWxsYmFjay5hcHBseShiaW5kaW5nLCBhcmdzKSlcclxuICAgICAgLmNhdGNoKGUgPT4ge30pO1xyXG4gIH0sIE9yYml0LlByb21pc2UucmVzb2x2ZSgpKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEZ1bGZpbGwgYW55IHByb21pc2VzIHJldHVybmVkIGJ5IGV2ZW50IGxpc3RlbmVycyBpbiBzZXJpZXMuXHJcbiAqIFxyXG4gKiBQcm9jZXNzaW5nIHdpbGwgc3RvcCBpZiBhbiBlcnJvciBpcyBlbmNvdW50ZXJlZCBhbmQgdGhlIHJldHVybmVkIHByb21pc2Ugd2lsbFxyXG4gKiBiZSByZWplY3RlZC5cclxuICogXHJcbiAqIEBleHBvcnRcclxuICogQHBhcmFtIHtFdmVudGVkfSBvYmogXHJcbiAqIEBwYXJhbSB7YW55fSBldmVudE5hbWUgXHJcbiAqIEBwYXJhbSB7YW55fSBhcmdzIFxyXG4gKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkPn1cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBmdWxmaWxsSW5TZXJpZXMob2JqOiBFdmVudGVkLCBldmVudE5hbWUsIC4uLmFyZ3MpOiBQcm9taXNlPHZvaWQ+IHtcclxuICBjb25zdCBsaXN0ZW5lcnMgPSBvYmoubGlzdGVuZXJzKGV2ZW50TmFtZSk7XHJcblxyXG4gIHJldHVybiBuZXcgT3JiaXQuUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICBmdWxmaWxsRWFjaChsaXN0ZW5lcnMsIGFyZ3MsIHJlc29sdmUsIHJlamVjdCk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG5vdGlmaWVyRm9yRXZlbnQob2JqZWN0LCBldmVudE5hbWUsIGNyZWF0ZUlmVW5kZWZpbmVkID0gZmFsc2UpIHtcclxuICBpZiAob2JqZWN0Ll9ldmVudGVkTm90aWZpZXJzID09PSB1bmRlZmluZWQpIHtcclxuICAgIG9iamVjdC5fZXZlbnRlZE5vdGlmaWVycyA9IHt9O1xyXG4gIH1cclxuICBsZXQgbm90aWZpZXIgPSBvYmplY3QuX2V2ZW50ZWROb3RpZmllcnNbZXZlbnROYW1lXTtcclxuICBpZiAoIW5vdGlmaWVyICYmIGNyZWF0ZUlmVW5kZWZpbmVkKSB7XHJcbiAgICBub3RpZmllciA9IG9iamVjdC5fZXZlbnRlZE5vdGlmaWVyc1tldmVudE5hbWVdID0gbmV3IE5vdGlmaWVyKCk7XHJcbiAgfVxyXG4gIHJldHVybiBub3RpZmllcjtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVtb3ZlTm90aWZpZXJGb3JFdmVudChvYmplY3QsIGV2ZW50TmFtZSkge1xyXG4gIGlmIChvYmplY3QuX2V2ZW50ZWROb3RpZmllcnMgJiYgb2JqZWN0Ll9ldmVudGVkTm90aWZpZXJzW2V2ZW50TmFtZV0pIHtcclxuICAgIGRlbGV0ZSBvYmplY3QuX2V2ZW50ZWROb3RpZmllcnNbZXZlbnROYW1lXTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZ1bGZpbGxFYWNoKGxpc3RlbmVycywgYXJncywgcmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgaWYgKGxpc3RlbmVycy5sZW5ndGggPT09IDApIHtcclxuICAgIHJlc29sdmUoKTtcclxuICB9IGVsc2Uge1xyXG4gICAgbGV0IGxpc3RlbmVyO1xyXG4gICAgW2xpc3RlbmVyLCAuLi5saXN0ZW5lcnNdID0gbGlzdGVuZXJzO1xyXG4gICAgbGV0IFtjYWxsYmFjaywgYmluZGluZ10gPSBsaXN0ZW5lcjtcclxuICAgIGxldCByZXNwb25zZSA9IGNhbGxiYWNrLmFwcGx5KGJpbmRpbmcsIGFyZ3MpO1xyXG5cclxuICAgIGlmIChyZXNwb25zZSkge1xyXG4gICAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKHJlc3BvbnNlKVxyXG4gICAgICAgIC50aGVuKCgpID0+IGZ1bGZpbGxFYWNoKGxpc3RlbmVycywgYXJncywgcmVzb2x2ZSwgcmVqZWN0KSlcclxuICAgICAgICAuY2F0Y2goZXJyb3IgPT4gcmVqZWN0KGVycm9yKSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBmdWxmaWxsRWFjaChsaXN0ZW5lcnMsIGFyZ3MsIHJlc29sdmUsIHJlamVjdCk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdfQ==