"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *  The `Notifier` class can emit messages to an array of subscribed listeners.
 * Here's a simple example:
 *
 * ```ts
 * import { Notifier } from '@orbit/core';
 *
 * let notifier = new Notifier();
 * notifier.addListener((message: string) => {
 *   console.log("I heard " + message);
 * });
 * notifier.addListener((message: string) => {
 *   console.log("I also heard " + message);
 * });
 *
 * notifier.emit('hello'); // logs "I heard hello" and "I also heard hello"
 * ```
 *
 * Calls to `emit` will send along all of their arguments.
 *
 * @export
 * @class Notifier
 */
var Notifier = (function () {
    function Notifier() {
        this.listeners = [];
    }
    /**
     * Add a callback as a listener, which will be triggered when sending
     * notifications.
     *
     * @param {Function} callback Function to call as a notification
     * @param {object} binding Context in which to call `callback`
     *
     * @memberOf Notifier
     */
    Notifier.prototype.addListener = function (callback, binding) {
        binding = binding || this;
        this.listeners.push([callback, binding]);
    };
    /**
     * Remove a listener so that it will no longer receive notifications.
     *
     * @param {Function} callback Function registered as a callback
     * @param {object} binding Context in which `callback` was registered
     * @returns
     *
     * @memberOf Notifier
     */
    Notifier.prototype.removeListener = function (callback, binding) {
        var listeners = this.listeners;
        var listener;
        binding = binding || this;
        for (var i = 0, len = listeners.length; i < len; i++) {
            listener = listeners[i];
            if (listener && listener[0] === callback && listener[1] === binding) {
                listeners.splice(i, 1);
                return;
            }
        }
    };
    /**
     * Notify registered listeners.
     *
     * @param {any} args Params to be sent to listeners
     *
     * @memberOf Notifier
     */
    Notifier.prototype.emit = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.listeners.slice(0).forEach(function (listener) {
            listener[0].apply(listener[1], args);
        });
    };
    return Notifier;
}());
exports.default = Notifier;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90aWZpZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzcmMvbm90aWZpZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXNCRztBQUNIO0lBR0U7UUFDRSxJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztJQUN0QixDQUFDO0lBRUQ7Ozs7Ozs7O09BUUc7SUFDSCw4QkFBVyxHQUFYLFVBQVksUUFBa0IsRUFBRSxPQUFlO1FBQzdDLE9BQU8sR0FBRyxPQUFPLElBQUksSUFBSSxDQUFDO1FBQzFCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUVEOzs7Ozs7OztPQVFHO0lBQ0gsaUNBQWMsR0FBZCxVQUFlLFFBQWtCLEVBQUUsT0FBZTtRQUNoRCxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQy9CLElBQUksUUFBUSxDQUFDO1FBRWIsT0FBTyxHQUFHLE9BQU8sSUFBSSxJQUFJLENBQUM7UUFDMUIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUNyRCxRQUFRLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLEVBQUUsQ0FBQyxDQUFDLFFBQVEsSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssUUFBUSxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUNwRSxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDdkIsTUFBTSxDQUFDO1lBQ1QsQ0FBQztRQUNILENBQUM7SUFDSCxDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsdUJBQUksR0FBSjtRQUFLLGNBQU87YUFBUCxVQUFPLEVBQVAscUJBQU8sRUFBUCxJQUFPO1lBQVAseUJBQU87O1FBQ1YsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsUUFBUTtZQUN2QyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN2QyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFDSCxlQUFDO0FBQUQsQ0FBQyxBQXhERCxJQXdEQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiAgVGhlIGBOb3RpZmllcmAgY2xhc3MgY2FuIGVtaXQgbWVzc2FnZXMgdG8gYW4gYXJyYXkgb2Ygc3Vic2NyaWJlZCBsaXN0ZW5lcnMuXHJcbiAqIEhlcmUncyBhIHNpbXBsZSBleGFtcGxlOlxyXG4gKlxyXG4gKiBgYGB0c1xyXG4gKiBpbXBvcnQgeyBOb3RpZmllciB9IGZyb20gJ0BvcmJpdC9jb3JlJztcclxuICogXHJcbiAqIGxldCBub3RpZmllciA9IG5ldyBOb3RpZmllcigpO1xyXG4gKiBub3RpZmllci5hZGRMaXN0ZW5lcigobWVzc2FnZTogc3RyaW5nKSA9PiB7XHJcbiAqICAgY29uc29sZS5sb2coXCJJIGhlYXJkIFwiICsgbWVzc2FnZSk7XHJcbiAqIH0pO1xyXG4gKiBub3RpZmllci5hZGRMaXN0ZW5lcigobWVzc2FnZTogc3RyaW5nKSA9PiB7XHJcbiAqICAgY29uc29sZS5sb2coXCJJIGFsc28gaGVhcmQgXCIgKyBtZXNzYWdlKTtcclxuICogfSk7XHJcbiAqXHJcbiAqIG5vdGlmaWVyLmVtaXQoJ2hlbGxvJyk7IC8vIGxvZ3MgXCJJIGhlYXJkIGhlbGxvXCIgYW5kIFwiSSBhbHNvIGhlYXJkIGhlbGxvXCJcclxuICogYGBgXHJcbiAqXHJcbiAqIENhbGxzIHRvIGBlbWl0YCB3aWxsIHNlbmQgYWxvbmcgYWxsIG9mIHRoZWlyIGFyZ3VtZW50cy5cclxuICpcclxuICogQGV4cG9ydFxyXG4gKiBAY2xhc3MgTm90aWZpZXJcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE5vdGlmaWVyIHtcclxuICBwdWJsaWMgbGlzdGVuZXJzOiBhbnlbXTsgLy8gVE9ETyAtIGRlZmluZSBMaXN0ZW5lciBpbnRlcmZhY2VcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLmxpc3RlbmVycyA9IFtdO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQWRkIGEgY2FsbGJhY2sgYXMgYSBsaXN0ZW5lciwgd2hpY2ggd2lsbCBiZSB0cmlnZ2VyZWQgd2hlbiBzZW5kaW5nXHJcbiAgICogbm90aWZpY2F0aW9ucy5cclxuICAgKiBcclxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBGdW5jdGlvbiB0byBjYWxsIGFzIGEgbm90aWZpY2F0aW9uXHJcbiAgICogQHBhcmFtIHtvYmplY3R9IGJpbmRpbmcgQ29udGV4dCBpbiB3aGljaCB0byBjYWxsIGBjYWxsYmFja2BcclxuICAgKiBcclxuICAgKiBAbWVtYmVyT2YgTm90aWZpZXJcclxuICAgKi9cclxuICBhZGRMaXN0ZW5lcihjYWxsYmFjazogRnVuY3Rpb24sIGJpbmRpbmc6IG9iamVjdCkge1xyXG4gICAgYmluZGluZyA9IGJpbmRpbmcgfHwgdGhpcztcclxuICAgIHRoaXMubGlzdGVuZXJzLnB1c2goW2NhbGxiYWNrLCBiaW5kaW5nXSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZW1vdmUgYSBsaXN0ZW5lciBzbyB0aGF0IGl0IHdpbGwgbm8gbG9uZ2VyIHJlY2VpdmUgbm90aWZpY2F0aW9ucy5cclxuICAgKiBcclxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBGdW5jdGlvbiByZWdpc3RlcmVkIGFzIGEgY2FsbGJhY2tcclxuICAgKiBAcGFyYW0ge29iamVjdH0gYmluZGluZyBDb250ZXh0IGluIHdoaWNoIGBjYWxsYmFja2Agd2FzIHJlZ2lzdGVyZWQgXHJcbiAgICogQHJldHVybnMgXHJcbiAgICogXHJcbiAgICogQG1lbWJlck9mIE5vdGlmaWVyXHJcbiAgICovXHJcbiAgcmVtb3ZlTGlzdGVuZXIoY2FsbGJhY2s6IEZ1bmN0aW9uLCBiaW5kaW5nOiBvYmplY3QpIHtcclxuICAgIGxldCBsaXN0ZW5lcnMgPSB0aGlzLmxpc3RlbmVycztcclxuICAgIGxldCBsaXN0ZW5lcjtcclxuXHJcbiAgICBiaW5kaW5nID0gYmluZGluZyB8fCB0aGlzO1xyXG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGxpc3RlbmVycy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICBsaXN0ZW5lciA9IGxpc3RlbmVyc1tpXTtcclxuICAgICAgaWYgKGxpc3RlbmVyICYmIGxpc3RlbmVyWzBdID09PSBjYWxsYmFjayAmJiBsaXN0ZW5lclsxXSA9PT0gYmluZGluZykge1xyXG4gICAgICAgIGxpc3RlbmVycy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBOb3RpZnkgcmVnaXN0ZXJlZCBsaXN0ZW5lcnMuXHJcbiAgICogXHJcbiAgICogQHBhcmFtIHthbnl9IGFyZ3MgUGFyYW1zIHRvIGJlIHNlbnQgdG8gbGlzdGVuZXJzXHJcbiAgICogXHJcbiAgICogQG1lbWJlck9mIE5vdGlmaWVyXHJcbiAgICovXHJcbiAgZW1pdCguLi5hcmdzKSB7XHJcbiAgICB0aGlzLmxpc3RlbmVycy5zbGljZSgwKS5mb3JFYWNoKChsaXN0ZW5lcikgPT4ge1xyXG4gICAgICBsaXN0ZW5lclswXS5hcHBseShsaXN0ZW5lclsxXSwgYXJncyk7XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuIl19