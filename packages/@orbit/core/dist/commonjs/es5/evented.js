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
            } else {
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
        var callback = _a[0],
            binding = _a[1];
        return chain.then(function () {
            return callback.apply(binding, args);
        }).catch(function (e) {});
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
    if (createIfUndefined === void 0) {
        createIfUndefined = false;
    }
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
    } else {
        var listener = void 0;
        listener = listeners[0], listeners = listeners.slice(1);
        var callback = listener[0],
            binding = listener[1];
        var response = callback.apply(binding, args);
        if (response) {
            return main_1.default.Promise.resolve(response).then(function () {
                return fulfillEach(listeners, args, resolve, reject);
            }).catch(function (error) {
                return reject(error);
            });
        } else {
            fulfillEach(listeners, args, resolve, reject);
        }
    }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNyYy9ldmVudGVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFCQUEyQjtBQUMzQix5QkFBa0M7QUFLckIsUUFBQSxBQUFPLFVBQUcsQUFBYSxBQUFDO0FBRXJDLEFBTUc7Ozs7Ozs7QUFDSCxtQkFBMEIsQUFBVyxLQUNuQyxBQUFNO1dBQUMsQ0FBQyxDQUFDLEFBQUcsSUFBQyxRQUFPLEFBQUMsQUFBQyxBQUN4QixBQUFDOztBQUZELG9CQUVDO0FBMEJELEFBMENHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0gsaUJBQWdDLEFBQVUsT0FDeEM7UUFBSSxBQUFLLFFBQUcsQUFBSyxNQUFDLEFBQVMsQUFBQyxBQUU1QixBQUFFLEFBQUM7UUFBQyxBQUFTLFVBQUMsQUFBSyxBQUFDLEFBQUMsUUFBQyxBQUFDLEFBQ3JCLEFBQU0sQUFBQyxBQUNUO0FBQUM7QUFFRCxBQUFLO1VBQUMsUUFBTyxBQUFDLFdBQUcsQUFBSSxBQUFDLEFBRXRCLEFBQUs7VUFBQyxBQUFFLEtBQUcsVUFBUyxBQUFTLFdBQUUsQUFBUSxVQUFFLEFBQVEsVUFDL0M7WUFBTSxBQUFPLFVBQUcsQUFBUSxZQUFJLEFBQUksQUFBQyxBQUVqQyxBQUFnQjt5QkFBQyxBQUFJLE1BQUUsQUFBUyxXQUFFLEFBQUksQUFBQyxNQUFDLEFBQVcsWUFBQyxBQUFRLFVBQUUsQUFBTyxBQUFDLEFBQUMsQUFDekUsQUFBQyxBQUFDO0FBRUYsQUFBSztVQUFDLEFBQUcsTUFBRyxVQUFTLEFBQVMsV0FBRSxBQUFRLFVBQUUsQUFBUSxVQUNoRDtZQUFNLEFBQU8sVUFBRyxBQUFRLFlBQUksQUFBSSxBQUFDLEFBQ2pDO1lBQU0sQUFBUSxXQUFHLEFBQWdCLGlCQUFDLEFBQUksTUFBRSxBQUFTLEFBQUMsQUFBQyxBQUVuRCxBQUFFLEFBQUM7WUFBQyxBQUFRLEFBQUMsVUFBQyxBQUFDLEFB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QUFHLEFBQVEsU0FBQyxBQUFLLE1BQUMsQUFBTyxTQUFFLEFBQUksQUFBQyxBQUFDLEFBRTdDLEFBQUUsQUFBQztZQUFDLEFBQVEsQUFBQyxVQUFDLEFBQUMsQUFDYixBQUFNOzBCQUFNLFFBQUMsQUFBTyxRQUFDLEFBQU8sUUFBQyxBQUFRLEFBQUMsVUFDbkMsQUFBSSxLQUFDLFlBQU07dUJBQUEsQUFBVyxZQUFDLEFBQVMsV0FBRSxBQUFJLE1BQUUsQUFBTyxTQUFwQyxBQUFzQyxBQUFNLEFBQUMsQUFBQztBQURyRCxlQUVKLEFBQUssTUFBQyxVQUFBLEFBQUssT0FBSTt1QkFBQSxBQUFNLE9BQU4sQUFBTyxBQUFLLEFBQUMsQUFBQyxBQUFDLEFBQ25DO0FBQUMsQUFBQyxBQUFJO2VBQUMsQUFBQyxBQUNOLEFBQVc7d0JBQUMsQUFBUyxXQUFFLEFBQUksTUFBRSxBQUFPLFNBQUUsQUFBTSxBQUFDLEFBQUMsQUFDaEQsQUFBQyxBQUNIO0FBQUMsQUFDSDtBQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE9yYml0IGZyb20gJy4vbWFpbic7XHJcbmltcG9ydCBOb3RpZmllciBmcm9tICcuL25vdGlmaWVyJztcclxuaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSAnQG9yYml0L3V0aWxzJztcclxuXHJcbmRlY2xhcmUgY29uc3QgY29uc29sZTogYW55O1xyXG5cclxuZXhwb3J0IGNvbnN0IEVWRU5URUQgPSAnX19ldmVudGVkX18nO1xyXG5cclxuLyoqXHJcbiAqIEhhcyBhIGNsYXNzIGJlZW4gZGVjb3JhdGVkIGFzIGBAZXZlbnRlZGA/XHJcbiAqIFxyXG4gKiBAZXhwb3J0XHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBvYmogXHJcbiAqIEByZXR1cm5zIHtib29sZWFufSBcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBpc0V2ZW50ZWQob2JqOiBvYmplY3QpOiBib29sZWFuIHtcclxuICByZXR1cm4gISFvYmpbRVZFTlRFRF07XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBIGNsYXNzIGRlY29yYXRlZCBhcyBgQGV2ZW50ZWRgIHNob3VsZCBhbHNvIGltcGxlbWVudCB0aGUgYEV2ZW50ZWRgIFxyXG4gKiBpbnRlcmZhY2UuXHJcbiAqIFxyXG4gKiBgYGB0c1xyXG4gKiBpbXBvcnQgeyBldmVudGVkLCBFdmVudGVkIH0gZnJvbSAnQG9yYml0L2NvcmUnO1xyXG4gKlxyXG4gKiBAZXZlbnRlZFxyXG4gKiBjbGFzcyBTb3VyY2UgaW1wbGVtZW50cyBFdmVudGVkIHtcclxuICogICAvLyAuLi4gRXZlbnRlZCBpbXBsZW1lbnRhdGlvblxyXG4gKiB9XHJcbiAqIGBgYFxyXG4gKiBcclxuICogQGV4cG9ydFxyXG4gKiBAaW50ZXJmYWNlIEV2ZW50ZWRcclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgRXZlbnRlZCB7XHJcbiAgb246IChldmVudDogc3RyaW5nLCBjYWxsYmFjazogRnVuY3Rpb24sIGJpbmRpbmc/OiBvYmplY3QpID0+IHZvaWQ7XHJcbiAgb2ZmOiAoZXZlbnQ6IHN0cmluZywgY2FsbGJhY2s6IEZ1bmN0aW9uLCBiaW5kaW5nPzogb2JqZWN0KSA9PiB2b2lkO1xyXG4gIG9uZTogKGV2ZW50OiBzdHJpbmcsIGNhbGxiYWNrOiBGdW5jdGlvbiwgYmluZGluZz86IG9iamVjdCkgPT4gdm9pZDtcclxuICBlbWl0OiAoZXZlbnQ6IHN0cmluZywgLi4uYXJncykgPT4gdm9pZDtcclxuICBsaXN0ZW5lcnM6IChldmVudDogc3RyaW5nKSA9PiBhbnlbXTtcclxufVxyXG5cclxuLyoqXHJcbiAqIE1hcmtzIGEgY2xhc3MgYXMgZXZlbnRlZC5cclxuICogXHJcbiAqIEFuIGV2ZW50ZWQgY2xhc3Mgc2hvdWxkIGFsc28gaW1wbGVtZW50IHRoZSBgRXZlbnRlZGAgaW50ZXJmYWNlLlxyXG4gKlxyXG4gKiBgYGB0c1xyXG4gKiBpbXBvcnQgeyBldmVudGVkLCBFdmVudGVkIH0gZnJvbSAnQG9yYml0L2NvcmUnO1xyXG4gKlxyXG4gKiBAZXZlbnRlZFxyXG4gKiBjbGFzcyBTb3VyY2UgaW1wbGVtZW50cyBFdmVudGVkIHtcclxuICogICAuLi5cclxuICogfVxyXG4gKiBgYGBcclxuICogXHJcbiAqIExpc3RlbmVycyBjYW4gdGhlbiByZWdpc3RlciB0aGVtc2VsdmVzIGZvciBwYXJ0aWN1bGFyIGV2ZW50cyB3aXRoIGBvbmA6XHJcbiAqXHJcbiAqIGBgYHRzXHJcbiAqIGxldCBzb3VyY2UgPSBuZXcgU291cmNlKCk7XHJcbiAqIFxyXG4gKiBmdW5jdGlvbiBsaXN0ZW5lcjEobWVzc2FnZTogc3RyaW5nKSB7XHJcbiAqICAgY29uc29sZS5sb2coJ2xpc3RlbmVyMSBoZWFyZCAnICsgbWVzc2FnZSk7XHJcbiAqIH07XHJcbiAqIGZ1bmN0aW9uIGxpc3RlbmVyMihtZXNzYWdlOiBzdHJpbmcpIHtcclxuICogICBjb25zb2xlLmxvZygnbGlzdGVuZXIyIGhlYXJkICcgKyBtZXNzYWdlKTtcclxuICogfTtcclxuICpcclxuICogc291cmNlLm9uKCdncmVldGluZycsIGxpc3RlbmVyMSk7XHJcbiAqIHNvdXJjZS5vbignZ3JlZXRpbmcnLCBsaXN0ZW5lcjIpO1xyXG4gKlxyXG4gKiBldmVudGVkLmVtaXQoJ2dyZWV0aW5nJywgJ2hlbGxvJyk7IC8vIGxvZ3MgXCJsaXN0ZW5lcjEgaGVhcmQgaGVsbG9cIiBhbmRcclxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgIFwibGlzdGVuZXIyIGhlYXJkIGhlbGxvXCJcclxuICogYGBgXHJcbiAqXHJcbiAqIExpc3RlbmVycyBjYW4gYmUgdW5yZWdpc3RlcmVkIGZyb20gZXZlbnRzIGF0IGFueSB0aW1lIHdpdGggYG9mZmA6XHJcbiAqXHJcbiAqIGBgYHRzXHJcbiAqIHNvdXJjZS5vZmYoJ2dyZWV0aW5nJywgbGlzdGVuZXIyKTtcclxuICogYGBgXHJcbiAqIFxyXG4gKiBAZGVjb3JhdG9yXHJcbiAqIEBleHBvcnRcclxuICogQHBhcmFtIHsqfSBLbGFzcyBcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGV2ZW50ZWQoS2xhc3M6IGFueSk6IHZvaWQge1xyXG4gIGxldCBwcm90byA9IEtsYXNzLnByb3RvdHlwZTtcclxuXHJcbiAgaWYgKGlzRXZlbnRlZChwcm90bykpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIHByb3RvW0VWRU5URURdID0gdHJ1ZTtcclxuXHJcbiAgcHJvdG8ub24gPSBmdW5jdGlvbihldmVudE5hbWUsIGNhbGxiYWNrLCBfYmluZGluZykge1xyXG4gICAgY29uc3QgYmluZGluZyA9IF9iaW5kaW5nIHx8IHRoaXM7XHJcblxyXG4gICAgbm90aWZpZXJGb3JFdmVudCh0aGlzLCBldmVudE5hbWUsIHRydWUpLmFkZExpc3RlbmVyKGNhbGxiYWNrLCBiaW5kaW5nKTtcclxuICB9O1xyXG5cclxuICBwcm90by5vZmYgPSBmdW5jdGlvbihldmVudE5hbWUsIGNhbGxiYWNrLCBfYmluZGluZykge1xyXG4gICAgY29uc3QgYmluZGluZyA9IF9iaW5kaW5nIHx8IHRoaXM7XHJcbiAgICBjb25zdCBub3RpZmllciA9IG5vdGlmaWVyRm9yRXZlbnQodGhpcywgZXZlbnROYW1lKTtcclxuXHJcbiAgICBpZiAobm90aWZpZXIpIHtcclxuICAgICAgaWYgKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgbm90aWZpZXIucmVtb3ZlTGlzdGVuZXIoY2FsbGJhY2ssIGJpbmRpbmcpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJlbW92ZU5vdGlmaWVyRm9yRXZlbnQodGhpcywgZXZlbnROYW1lKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHByb3RvLm9uZSA9IGZ1bmN0aW9uKGV2ZW50TmFtZSwgY2FsbGJhY2ssIF9iaW5kaW5nKSB7XHJcbiAgICBsZXQgY2FsbE9uY2U7XHJcbiAgICBsZXQgbm90aWZpZXI7XHJcbiAgICBsZXQgYmluZGluZyA9IF9iaW5kaW5nIHx8IHRoaXM7XHJcblxyXG4gICAgbm90aWZpZXIgPSBub3RpZmllckZvckV2ZW50KHRoaXMsIGV2ZW50TmFtZSwgdHJ1ZSk7XHJcblxyXG4gICAgY2FsbE9uY2UgPSBmdW5jdGlvbigpIHtcclxuICAgICAgY2FsbGJhY2suYXBwbHkoYmluZGluZywgYXJndW1lbnRzKTtcclxuICAgICAgbm90aWZpZXIucmVtb3ZlTGlzdGVuZXIoY2FsbE9uY2UsIGJpbmRpbmcpO1xyXG4gICAgfTtcclxuXHJcbiAgICBub3RpZmllci5hZGRMaXN0ZW5lcihjYWxsT25jZSwgYmluZGluZyk7XHJcbiAgfTtcclxuXHJcbiAgcHJvdG8uZW1pdCA9IGZ1bmN0aW9uKGV2ZW50TmFtZSwgLi4uYXJncykge1xyXG4gICAgbGV0IG5vdGlmaWVyID0gbm90aWZpZXJGb3JFdmVudCh0aGlzLCBldmVudE5hbWUpO1xyXG5cclxuICAgIGlmIChub3RpZmllcikge1xyXG4gICAgICBub3RpZmllci5lbWl0LmFwcGx5KG5vdGlmaWVyLCBhcmdzKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBwcm90by5saXN0ZW5lcnMgPSBmdW5jdGlvbihldmVudE5hbWUpIHtcclxuICAgIGxldCBub3RpZmllciA9IG5vdGlmaWVyRm9yRXZlbnQodGhpcywgZXZlbnROYW1lKTtcclxuICAgIHJldHVybiBub3RpZmllciA/IG5vdGlmaWVyLmxpc3RlbmVycyA6IFtdO1xyXG4gIH07XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTZXR0bGUgYW55IHByb21pc2VzIHJldHVybmVkIGJ5IGV2ZW50IGxpc3RlbmVycyBpbiBzZXJpZXMuXHJcbiAqIFxyXG4gKiBJZiBhbnkgZXJyb3JzIGFyZSBlbmNvdW50ZXJlZCBkdXJpbmcgcHJvY2Vzc2luZywgdGhleSB3aWxsIGJlIGlnbm9yZWQuXHJcbiAqIFxyXG4gKiBAZXhwb3J0XHJcbiAqIEBwYXJhbSB7RXZlbnRlZH0gb2JqIFxyXG4gKiBAcGFyYW0ge2FueX0gZXZlbnROYW1lIFxyXG4gKiBAcGFyYW0ge2FueX0gYXJncyBcclxuICogQHJldHVybnMge1Byb21pc2U8dm9pZD59XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gc2V0dGxlSW5TZXJpZXMob2JqOiBFdmVudGVkLCBldmVudE5hbWUsIC4uLmFyZ3MpOiBQcm9taXNlPHZvaWQ+IHtcclxuICBjb25zdCBsaXN0ZW5lcnMgPSBvYmoubGlzdGVuZXJzKGV2ZW50TmFtZSk7XHJcblxyXG4gIHJldHVybiBsaXN0ZW5lcnMucmVkdWNlKChjaGFpbiwgW2NhbGxiYWNrLCBiaW5kaW5nXSkgPT4ge1xyXG4gICAgcmV0dXJuIGNoYWluXHJcbiAgICAgIC50aGVuKCgpID0+IGNhbGxiYWNrLmFwcGx5KGJpbmRpbmcsIGFyZ3MpKVxyXG4gICAgICAuY2F0Y2goZSA9PiB7fSk7XHJcbiAgfSwgT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCkpO1xyXG59XHJcblxyXG4vKipcclxuICogRnVsZmlsbCBhbnkgcHJvbWlzZXMgcmV0dXJuZWQgYnkgZXZlbnQgbGlzdGVuZXJzIGluIHNlcmllcy5cclxuICogXHJcbiAqIFByb2Nlc3Npbmcgd2lsbCBzdG9wIGlmIGFuIGVycm9yIGlzIGVuY291bnRlcmVkIGFuZCB0aGUgcmV0dXJuZWQgcHJvbWlzZSB3aWxsXHJcbiAqIGJlIHJlamVjdGVkLlxyXG4gKiBcclxuICogQGV4cG9ydFxyXG4gKiBAcGFyYW0ge0V2ZW50ZWR9IG9iaiBcclxuICogQHBhcmFtIHthbnl9IGV2ZW50TmFtZSBcclxuICogQHBhcmFtIHthbnl9IGFyZ3MgXHJcbiAqIEByZXR1cm5zIHtQcm9taXNlPHZvaWQ+fVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGZ1bGZpbGxJblNlcmllcyhvYmo6IEV2ZW50ZWQsIGV2ZW50TmFtZSwgLi4uYXJncyk6IFByb21pc2U8dm9pZD4ge1xyXG4gIGNvbnN0IGxpc3RlbmVycyA9IG9iai5saXN0ZW5lcnMoZXZlbnROYW1lKTtcclxuXHJcbiAgcmV0dXJuIG5ldyBPcmJpdC5Qcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgIGZ1bGZpbGxFYWNoKGxpc3RlbmVycywgYXJncywgcmVzb2x2ZSwgcmVqZWN0KTtcclxuICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gbm90aWZpZXJGb3JFdmVudChvYmplY3QsIGV2ZW50TmFtZSwgY3JlYXRlSWZVbmRlZmluZWQgPSBmYWxzZSkge1xyXG4gIGlmIChvYmplY3QuX2V2ZW50ZWROb3RpZmllcnMgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgb2JqZWN0Ll9ldmVudGVkTm90aWZpZXJzID0ge307XHJcbiAgfVxyXG4gIGxldCBub3RpZmllciA9IG9iamVjdC5fZXZlbnRlZE5vdGlmaWVyc1tldmVudE5hbWVdO1xyXG4gIGlmICghbm90aWZpZXIgJiYgY3JlYXRlSWZVbmRlZmluZWQpIHtcclxuICAgIG5vdGlmaWVyID0gb2JqZWN0Ll9ldmVudGVkTm90aWZpZXJzW2V2ZW50TmFtZV0gPSBuZXcgTm90aWZpZXIoKTtcclxuICB9XHJcbiAgcmV0dXJuIG5vdGlmaWVyO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZW1vdmVOb3RpZmllckZvckV2ZW50KG9iamVjdCwgZXZlbnROYW1lKSB7XHJcbiAgaWYgKG9iamVjdC5fZXZlbnRlZE5vdGlmaWVycyAmJiBvYmplY3QuX2V2ZW50ZWROb3RpZmllcnNbZXZlbnROYW1lXSkge1xyXG4gICAgZGVsZXRlIG9iamVjdC5fZXZlbnRlZE5vdGlmaWVyc1tldmVudE5hbWVdO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZnVsZmlsbEVhY2gobGlzdGVuZXJzLCBhcmdzLCByZXNvbHZlLCByZWplY3QpIHtcclxuICBpZiAobGlzdGVuZXJzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgcmVzb2x2ZSgpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBsZXQgbGlzdGVuZXI7XHJcbiAgICBbbGlzdGVuZXIsIC4uLmxpc3RlbmVyc10gPSBsaXN0ZW5lcnM7XHJcbiAgICBsZXQgW2NhbGxiYWNrLCBiaW5kaW5nXSA9IGxpc3RlbmVyO1xyXG4gICAgbGV0IHJlc3BvbnNlID0gY2FsbGJhY2suYXBwbHkoYmluZGluZywgYXJncyk7XHJcblxyXG4gICAgaWYgKHJlc3BvbnNlKSB7XHJcbiAgICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUocmVzcG9uc2UpXHJcbiAgICAgICAgLnRoZW4oKCkgPT4gZnVsZmlsbEVhY2gobGlzdGVuZXJzLCBhcmdzLCByZXNvbHZlLCByZWplY3QpKVxyXG4gICAgICAgIC5jYXRjaChlcnJvciA9PiByZWplY3QoZXJyb3IpKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGZ1bGZpbGxFYWNoKGxpc3RlbmVycywgYXJncywgcmVzb2x2ZSwgcmVqZWN0KTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIl19