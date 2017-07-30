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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNyYy9ldmVudGVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFCQUEyQjtBQUMzQix5QkFBa0M7QUFLckIsUUFBQSxBQUFPLFVBQUcsQUFBYSxBQUFDO0FBRXJDLEFBTUc7Ozs7Ozs7QUFDSCxtQkFBMEIsQUFBVztBQUNuQyxBQUFNLFdBQUMsQ0FBQyxDQUFDLEFBQUcsSUFBQyxRQUFPLEFBQUMsQUFBQyxBQUN4QjtBQUFDO0FBRkQsb0JBRUM7QUEwQkQsQUEwQ0c7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDSCxpQkFBZ0MsQUFBVTtBQUN4QyxRQUFJLEFBQUssUUFBRyxBQUFLLE1BQUMsQUFBUyxBQUFDO0FBRTVCLEFBQUUsQUFBQyxRQUFDLEFBQVMsVUFBQyxBQUFLLEFBQUMsQUFBQyxRQUFDLEFBQUM7QUFDckIsQUFBTSxBQUFDLEFBQ1Q7QUFBQztBQUVELEFBQUssVUFBQyxRQUFPLEFBQUMsV0FBRyxBQUFJLEFBQUM7QUFFdEIsQUFBSyxVQUFDLEFBQUUsS0FBRyxVQUFTLEFBQVMsV0FBRSxBQUFRLFVBQUUsQUFBUTtBQUMvQyxZQUFNLEFBQU8sVUFBRyxBQUFRLFlBQUksQUFBSSxBQUFDO0FBRWpDLEFBQWdCLHlCQUFDLEFBQUksTUFBRSxBQUFTLFdBQUUsQUFBSSxBQUFDLE1BQUMsQUFBVyxZQUFDLEFBQVEsVUFBRSxBQUFPLEFBQUMsQUFBQyxBQUN6RTtBQUFDLEFBQUM7QUFFRixBQUFLLFVBQUMsQUFBRyxNQUFHLFVBQVMsQUFBUyxXQUFFLEFBQVEsVUFBRSxBQUFRO0FBQ2hELFlBQU0sQUFBTyxVQUFHLEFBQVEsWUFBSSxBQUFJLEFBQUM7QUFDakMsWUFBTSxBQUFRLFdBQUcsQUFBZ0IsaUJBQUMsQUFBSSxNQUFFLEFBQVMsQUFBQyxBQUFDO0FBRW5ELEFBQUUsQUFBQyxZQUFDLEFBQVEsQUFBQyxVQUFDLEFBQUM7QUFD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LEFBQVEsV0FBRyxBQUFRLFNBQUMsQUFBSyxNQUFDLEFBQU8sU0FBRSxBQUFJLEFBQUMsQUFBQztBQUU3QyxBQUFFLEFBQUMsWUFBQyxBQUFRLEFBQUMsVUFBQyxBQUFDO0FBQ2IsQUFBTSwwQkFBTSxRQUFDLEFBQU8sUUFBQyxBQUFPLFFBQUMsQUFBUSxBQUFDLFVBQ25DLEFBQUksS0FBQztBQUFNLHVCQUFBLEFBQVcsWUFBQyxBQUFTLFdBQUUsQUFBSSxNQUFFLEFBQU8sU0FBcEMsQUFBc0MsQUFBTSxBQUFDO0FBQUEsQUFBQyxhQURyRCxFQUVKLEFBQUssTUFBQyxVQUFBLEFBQUs7QUFBSSx1QkFBQSxBQUFNLE9BQU4sQUFBTyxBQUFLLEFBQUM7QUFBQSxBQUFDLEFBQUMsQUFDbkM7QUFBQyxBQUFDLEFBQUksZUFBQyxBQUFDO0FBQ04sQUFBVyx3QkFBQyxBQUFTLFdBQUUsQUFBSSxNQUFFLEFBQU8sU0FBRSxBQUFNLEFBQUMsQUFBQyxBQUNoRDtBQUFDLEFBQ0g7QUFBQyxBQUNIO0FBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgT3JiaXQgZnJvbSAnLi9tYWluJztcclxuaW1wb3J0IE5vdGlmaWVyIGZyb20gJy4vbm90aWZpZXInO1xyXG5pbXBvcnQgeyBhc3NlcnQgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xyXG5cclxuZGVjbGFyZSBjb25zdCBjb25zb2xlOiBhbnk7XHJcblxyXG5leHBvcnQgY29uc3QgRVZFTlRFRCA9ICdfX2V2ZW50ZWRfXyc7XHJcblxyXG4vKipcclxuICogSGFzIGEgY2xhc3MgYmVlbiBkZWNvcmF0ZWQgYXMgYEBldmVudGVkYD9cclxuICogXHJcbiAqIEBleHBvcnRcclxuICogQHBhcmFtIHtvYmplY3R9IG9iaiBcclxuICogQHJldHVybnMge2Jvb2xlYW59IFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGlzRXZlbnRlZChvYmo6IG9iamVjdCk6IGJvb2xlYW4ge1xyXG4gIHJldHVybiAhIW9ialtFVkVOVEVEXTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEEgY2xhc3MgZGVjb3JhdGVkIGFzIGBAZXZlbnRlZGAgc2hvdWxkIGFsc28gaW1wbGVtZW50IHRoZSBgRXZlbnRlZGAgXHJcbiAqIGludGVyZmFjZS5cclxuICogXHJcbiAqIGBgYHRzXHJcbiAqIGltcG9ydCB7IGV2ZW50ZWQsIEV2ZW50ZWQgfSBmcm9tICdAb3JiaXQvY29yZSc7XHJcbiAqXHJcbiAqIEBldmVudGVkXHJcbiAqIGNsYXNzIFNvdXJjZSBpbXBsZW1lbnRzIEV2ZW50ZWQge1xyXG4gKiAgIC8vIC4uLiBFdmVudGVkIGltcGxlbWVudGF0aW9uXHJcbiAqIH1cclxuICogYGBgXHJcbiAqIFxyXG4gKiBAZXhwb3J0XHJcbiAqIEBpbnRlcmZhY2UgRXZlbnRlZFxyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBFdmVudGVkIHtcclxuICBvbjogKGV2ZW50OiBzdHJpbmcsIGNhbGxiYWNrOiBGdW5jdGlvbiwgYmluZGluZz86IG9iamVjdCkgPT4gdm9pZDtcclxuICBvZmY6IChldmVudDogc3RyaW5nLCBjYWxsYmFjazogRnVuY3Rpb24sIGJpbmRpbmc/OiBvYmplY3QpID0+IHZvaWQ7XHJcbiAgb25lOiAoZXZlbnQ6IHN0cmluZywgY2FsbGJhY2s6IEZ1bmN0aW9uLCBiaW5kaW5nPzogb2JqZWN0KSA9PiB2b2lkO1xyXG4gIGVtaXQ6IChldmVudDogc3RyaW5nLCAuLi5hcmdzKSA9PiB2b2lkO1xyXG4gIGxpc3RlbmVyczogKGV2ZW50OiBzdHJpbmcpID0+IGFueVtdO1xyXG59XHJcblxyXG4vKipcclxuICogTWFya3MgYSBjbGFzcyBhcyBldmVudGVkLlxyXG4gKiBcclxuICogQW4gZXZlbnRlZCBjbGFzcyBzaG91bGQgYWxzbyBpbXBsZW1lbnQgdGhlIGBFdmVudGVkYCBpbnRlcmZhY2UuXHJcbiAqXHJcbiAqIGBgYHRzXHJcbiAqIGltcG9ydCB7IGV2ZW50ZWQsIEV2ZW50ZWQgfSBmcm9tICdAb3JiaXQvY29yZSc7XHJcbiAqXHJcbiAqIEBldmVudGVkXHJcbiAqIGNsYXNzIFNvdXJjZSBpbXBsZW1lbnRzIEV2ZW50ZWQge1xyXG4gKiAgIC4uLlxyXG4gKiB9XHJcbiAqIGBgYFxyXG4gKiBcclxuICogTGlzdGVuZXJzIGNhbiB0aGVuIHJlZ2lzdGVyIHRoZW1zZWx2ZXMgZm9yIHBhcnRpY3VsYXIgZXZlbnRzIHdpdGggYG9uYDpcclxuICpcclxuICogYGBgdHNcclxuICogbGV0IHNvdXJjZSA9IG5ldyBTb3VyY2UoKTtcclxuICogXHJcbiAqIGZ1bmN0aW9uIGxpc3RlbmVyMShtZXNzYWdlOiBzdHJpbmcpIHtcclxuICogICBjb25zb2xlLmxvZygnbGlzdGVuZXIxIGhlYXJkICcgKyBtZXNzYWdlKTtcclxuICogfTtcclxuICogZnVuY3Rpb24gbGlzdGVuZXIyKG1lc3NhZ2U6IHN0cmluZykge1xyXG4gKiAgIGNvbnNvbGUubG9nKCdsaXN0ZW5lcjIgaGVhcmQgJyArIG1lc3NhZ2UpO1xyXG4gKiB9O1xyXG4gKlxyXG4gKiBzb3VyY2Uub24oJ2dyZWV0aW5nJywgbGlzdGVuZXIxKTtcclxuICogc291cmNlLm9uKCdncmVldGluZycsIGxpc3RlbmVyMik7XHJcbiAqXHJcbiAqIGV2ZW50ZWQuZW1pdCgnZ3JlZXRpbmcnLCAnaGVsbG8nKTsgLy8gbG9ncyBcImxpc3RlbmVyMSBoZWFyZCBoZWxsb1wiIGFuZFxyXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgXCJsaXN0ZW5lcjIgaGVhcmQgaGVsbG9cIlxyXG4gKiBgYGBcclxuICpcclxuICogTGlzdGVuZXJzIGNhbiBiZSB1bnJlZ2lzdGVyZWQgZnJvbSBldmVudHMgYXQgYW55IHRpbWUgd2l0aCBgb2ZmYDpcclxuICpcclxuICogYGBgdHNcclxuICogc291cmNlLm9mZignZ3JlZXRpbmcnLCBsaXN0ZW5lcjIpO1xyXG4gKiBgYGBcclxuICogXHJcbiAqIEBkZWNvcmF0b3JcclxuICogQGV4cG9ydFxyXG4gKiBAcGFyYW0geyp9IEtsYXNzIFxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZXZlbnRlZChLbGFzczogYW55KTogdm9pZCB7XHJcbiAgbGV0IHByb3RvID0gS2xhc3MucHJvdG90eXBlO1xyXG5cclxuICBpZiAoaXNFdmVudGVkKHByb3RvKSkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgcHJvdG9bRVZFTlRFRF0gPSB0cnVlO1xyXG5cclxuICBwcm90by5vbiA9IGZ1bmN0aW9uKGV2ZW50TmFtZSwgY2FsbGJhY2ssIF9iaW5kaW5nKSB7XHJcbiAgICBjb25zdCBiaW5kaW5nID0gX2JpbmRpbmcgfHwgdGhpcztcclxuXHJcbiAgICBub3RpZmllckZvckV2ZW50KHRoaXMsIGV2ZW50TmFtZSwgdHJ1ZSkuYWRkTGlzdGVuZXIoY2FsbGJhY2ssIGJpbmRpbmcpO1xyXG4gIH07XHJcblxyXG4gIHByb3RvLm9mZiA9IGZ1bmN0aW9uKGV2ZW50TmFtZSwgY2FsbGJhY2ssIF9iaW5kaW5nKSB7XHJcbiAgICBjb25zdCBiaW5kaW5nID0gX2JpbmRpbmcgfHwgdGhpcztcclxuICAgIGNvbnN0IG5vdGlmaWVyID0gbm90aWZpZXJGb3JFdmVudCh0aGlzLCBldmVudE5hbWUpO1xyXG5cclxuICAgIGlmIChub3RpZmllcikge1xyXG4gICAgICBpZiAoY2FsbGJhY2spIHtcclxuICAgICAgICBub3RpZmllci5yZW1vdmVMaXN0ZW5lcihjYWxsYmFjaywgYmluZGluZyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmVtb3ZlTm90aWZpZXJGb3JFdmVudCh0aGlzLCBldmVudE5hbWUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgcHJvdG8ub25lID0gZnVuY3Rpb24oZXZlbnROYW1lLCBjYWxsYmFjaywgX2JpbmRpbmcpIHtcclxuICAgIGxldCBjYWxsT25jZTtcclxuICAgIGxldCBub3RpZmllcjtcclxuICAgIGxldCBiaW5kaW5nID0gX2JpbmRpbmcgfHwgdGhpcztcclxuXHJcbiAgICBub3RpZmllciA9IG5vdGlmaWVyRm9yRXZlbnQodGhpcywgZXZlbnROYW1lLCB0cnVlKTtcclxuXHJcbiAgICBjYWxsT25jZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICBjYWxsYmFjay5hcHBseShiaW5kaW5nLCBhcmd1bWVudHMpO1xyXG4gICAgICBub3RpZmllci5yZW1vdmVMaXN0ZW5lcihjYWxsT25jZSwgYmluZGluZyk7XHJcbiAgICB9O1xyXG5cclxuICAgIG5vdGlmaWVyLmFkZExpc3RlbmVyKGNhbGxPbmNlLCBiaW5kaW5nKTtcclxuICB9O1xyXG5cclxuICBwcm90by5lbWl0ID0gZnVuY3Rpb24oZXZlbnROYW1lLCAuLi5hcmdzKSB7XHJcbiAgICBsZXQgbm90aWZpZXIgPSBub3RpZmllckZvckV2ZW50KHRoaXMsIGV2ZW50TmFtZSk7XHJcblxyXG4gICAgaWYgKG5vdGlmaWVyKSB7XHJcbiAgICAgIG5vdGlmaWVyLmVtaXQuYXBwbHkobm90aWZpZXIsIGFyZ3MpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHByb3RvLmxpc3RlbmVycyA9IGZ1bmN0aW9uKGV2ZW50TmFtZSkge1xyXG4gICAgbGV0IG5vdGlmaWVyID0gbm90aWZpZXJGb3JFdmVudCh0aGlzLCBldmVudE5hbWUpO1xyXG4gICAgcmV0dXJuIG5vdGlmaWVyID8gbm90aWZpZXIubGlzdGVuZXJzIDogW107XHJcbiAgfTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNldHRsZSBhbnkgcHJvbWlzZXMgcmV0dXJuZWQgYnkgZXZlbnQgbGlzdGVuZXJzIGluIHNlcmllcy5cclxuICogXHJcbiAqIElmIGFueSBlcnJvcnMgYXJlIGVuY291bnRlcmVkIGR1cmluZyBwcm9jZXNzaW5nLCB0aGV5IHdpbGwgYmUgaWdub3JlZC5cclxuICogXHJcbiAqIEBleHBvcnRcclxuICogQHBhcmFtIHtFdmVudGVkfSBvYmogXHJcbiAqIEBwYXJhbSB7YW55fSBldmVudE5hbWUgXHJcbiAqIEBwYXJhbSB7YW55fSBhcmdzIFxyXG4gKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkPn1cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXR0bGVJblNlcmllcyhvYmo6IEV2ZW50ZWQsIGV2ZW50TmFtZSwgLi4uYXJncyk6IFByb21pc2U8dm9pZD4ge1xyXG4gIGNvbnN0IGxpc3RlbmVycyA9IG9iai5saXN0ZW5lcnMoZXZlbnROYW1lKTtcclxuXHJcbiAgcmV0dXJuIGxpc3RlbmVycy5yZWR1Y2UoKGNoYWluLCBbY2FsbGJhY2ssIGJpbmRpbmddKSA9PiB7XHJcbiAgICByZXR1cm4gY2hhaW5cclxuICAgICAgLnRoZW4oKCkgPT4gY2FsbGJhY2suYXBwbHkoYmluZGluZywgYXJncykpXHJcbiAgICAgIC5jYXRjaChlID0+IHt9KTtcclxuICB9LCBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBGdWxmaWxsIGFueSBwcm9taXNlcyByZXR1cm5lZCBieSBldmVudCBsaXN0ZW5lcnMgaW4gc2VyaWVzLlxyXG4gKiBcclxuICogUHJvY2Vzc2luZyB3aWxsIHN0b3AgaWYgYW4gZXJyb3IgaXMgZW5jb3VudGVyZWQgYW5kIHRoZSByZXR1cm5lZCBwcm9taXNlIHdpbGxcclxuICogYmUgcmVqZWN0ZWQuXHJcbiAqIFxyXG4gKiBAZXhwb3J0XHJcbiAqIEBwYXJhbSB7RXZlbnRlZH0gb2JqIFxyXG4gKiBAcGFyYW0ge2FueX0gZXZlbnROYW1lIFxyXG4gKiBAcGFyYW0ge2FueX0gYXJncyBcclxuICogQHJldHVybnMge1Byb21pc2U8dm9pZD59XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZnVsZmlsbEluU2VyaWVzKG9iajogRXZlbnRlZCwgZXZlbnROYW1lLCAuLi5hcmdzKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgY29uc3QgbGlzdGVuZXJzID0gb2JqLmxpc3RlbmVycyhldmVudE5hbWUpO1xyXG5cclxuICByZXR1cm4gbmV3IE9yYml0LlByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgZnVsZmlsbEVhY2gobGlzdGVuZXJzLCBhcmdzLCByZXNvbHZlLCByZWplY3QpO1xyXG4gIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBub3RpZmllckZvckV2ZW50KG9iamVjdCwgZXZlbnROYW1lLCBjcmVhdGVJZlVuZGVmaW5lZCA9IGZhbHNlKSB7XHJcbiAgaWYgKG9iamVjdC5fZXZlbnRlZE5vdGlmaWVycyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICBvYmplY3QuX2V2ZW50ZWROb3RpZmllcnMgPSB7fTtcclxuICB9XHJcbiAgbGV0IG5vdGlmaWVyID0gb2JqZWN0Ll9ldmVudGVkTm90aWZpZXJzW2V2ZW50TmFtZV07XHJcbiAgaWYgKCFub3RpZmllciAmJiBjcmVhdGVJZlVuZGVmaW5lZCkge1xyXG4gICAgbm90aWZpZXIgPSBvYmplY3QuX2V2ZW50ZWROb3RpZmllcnNbZXZlbnROYW1lXSA9IG5ldyBOb3RpZmllcigpO1xyXG4gIH1cclxuICByZXR1cm4gbm90aWZpZXI7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbW92ZU5vdGlmaWVyRm9yRXZlbnQob2JqZWN0LCBldmVudE5hbWUpIHtcclxuICBpZiAob2JqZWN0Ll9ldmVudGVkTm90aWZpZXJzICYmIG9iamVjdC5fZXZlbnRlZE5vdGlmaWVyc1tldmVudE5hbWVdKSB7XHJcbiAgICBkZWxldGUgb2JqZWN0Ll9ldmVudGVkTm90aWZpZXJzW2V2ZW50TmFtZV07XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBmdWxmaWxsRWFjaChsaXN0ZW5lcnMsIGFyZ3MsIHJlc29sdmUsIHJlamVjdCkge1xyXG4gIGlmIChsaXN0ZW5lcnMubGVuZ3RoID09PSAwKSB7XHJcbiAgICByZXNvbHZlKCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGxldCBsaXN0ZW5lcjtcclxuICAgIFtsaXN0ZW5lciwgLi4ubGlzdGVuZXJzXSA9IGxpc3RlbmVycztcclxuICAgIGxldCBbY2FsbGJhY2ssIGJpbmRpbmddID0gbGlzdGVuZXI7XHJcbiAgICBsZXQgcmVzcG9uc2UgPSBjYWxsYmFjay5hcHBseShiaW5kaW5nLCBhcmdzKTtcclxuXHJcbiAgICBpZiAocmVzcG9uc2UpIHtcclxuICAgICAgcmV0dXJuIE9yYml0LlByb21pc2UucmVzb2x2ZShyZXNwb25zZSlcclxuICAgICAgICAudGhlbigoKSA9PiBmdWxmaWxsRWFjaChsaXN0ZW5lcnMsIGFyZ3MsIHJlc29sdmUsIHJlamVjdCkpXHJcbiAgICAgICAgLmNhdGNoKGVycm9yID0+IHJlamVjdChlcnJvcikpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZnVsZmlsbEVhY2gobGlzdGVuZXJzLCBhcmdzLCByZXNvbHZlLCByZWplY3QpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXX0=