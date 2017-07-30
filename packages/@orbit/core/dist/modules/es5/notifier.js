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
var Notifier = function () {
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
}();
exports.default = Notifier;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90aWZpZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzcmMvbm90aWZpZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsQUFzQkc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0g7QUFHRTtBQUNFLEFBQUksYUFBQyxBQUFTLFlBQUcsQUFBRSxBQUFDLEFBQ3RCO0FBQUM7QUFFRCxBQVFHOzs7Ozs7Ozs7QUFDSCx1QkFBVyxjQUFYLFVBQVksQUFBa0IsVUFBRSxBQUFlO0FBQzdDLEFBQU8sa0JBQUcsQUFBTyxXQUFJLEFBQUksQUFBQztBQUMxQixBQUFJLGFBQUMsQUFBUyxVQUFDLEFBQUksS0FBQyxDQUFDLEFBQVEsVUFBRSxBQUFPLEFBQUMsQUFBQyxBQUFDLEFBQzNDO0FBQUM7QUFFRCxBQVFHOzs7Ozs7Ozs7QUFDSCx1QkFBYyxpQkFBZCxVQUFlLEFBQWtCLFVBQUUsQUFBZTtBQUNoRCxZQUFJLEFBQVMsWUFBRyxBQUFJLEtBQUMsQUFBUyxBQUFDO0FBQy9CLFlBQUksQUFBUSxBQUFDO0FBRWIsQUFBTyxrQkFBRyxBQUFPLFdBQUksQUFBSSxBQUFDO0FBQzFCLEFBQUcsQUFBQyxhQUFDLElBQUksQUFBQyxJQUFHLEFBQUMsR0FBRSxBQUFHLE1BQUcsQUFBUyxVQUFDLEFBQU0sUUFBRSxBQUFDLElBQUcsQUFBRyxLQUFFLEFBQUMsQUFBRSxLQUFFLEFBQUM7QUFDckQsQUFBUSx1QkFBRyxBQUFTLFVBQUMsQUFBQyxBQUFDLEFBQUM7QUFDeEIsQUFBRSxBQUFDLGdCQUFDLEFBQVEsWUFBSSxBQUFRLFNBQUMsQUFBQyxBQUFDLE9BQUssQUFBUSxZQUFJLEFBQVEsU0FBQyxBQUFDLEFBQUMsT0FBSyxBQUFPLEFBQUMsU0FBQyxBQUFDO0FBQ3BFLEFBQVMsMEJBQUMsQUFBTSxPQUFDLEFBQUMsR0FBRSxBQUFDLEFBQUMsQUFBQztBQUN2QixBQUFNLEFBQUMsQUFDVDtBQUFDLEFBQ0g7QUFBQyxBQUNIO0FBQUM7QUFFRCxBQU1HOzs7Ozs7O0FBQ0gsdUJBQUksT0FBSjtBQUFLLG1CQUFPO2FBQVAsU0FBTyxHQUFQLGVBQU8sUUFBUCxBQUFPO0FBQVAsaUNBQU87O0FBQ1YsQUFBSSxhQUFDLEFBQVMsVUFBQyxBQUFLLE1BQUMsQUFBQyxBQUFDLEdBQUMsQUFBTyxRQUFDLFVBQUMsQUFBUTtBQUN2QyxBQUFRLHFCQUFDLEFBQUMsQUFBQyxHQUFDLEFBQUssTUFBQyxBQUFRLFNBQUMsQUFBQyxBQUFDLElBQUUsQUFBSSxBQUFDLEFBQUMsQUFDdkM7QUFBQyxBQUFDLEFBQUMsQUFDTDtBQUFDO0FBQ0gsV0FBQyxBQUFEO0FBeERBLEFBd0RDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqICBUaGUgYE5vdGlmaWVyYCBjbGFzcyBjYW4gZW1pdCBtZXNzYWdlcyB0byBhbiBhcnJheSBvZiBzdWJzY3JpYmVkIGxpc3RlbmVycy5cclxuICogSGVyZSdzIGEgc2ltcGxlIGV4YW1wbGU6XHJcbiAqXHJcbiAqIGBgYHRzXHJcbiAqIGltcG9ydCB7IE5vdGlmaWVyIH0gZnJvbSAnQG9yYml0L2NvcmUnO1xyXG4gKiBcclxuICogbGV0IG5vdGlmaWVyID0gbmV3IE5vdGlmaWVyKCk7XHJcbiAqIG5vdGlmaWVyLmFkZExpc3RlbmVyKChtZXNzYWdlOiBzdHJpbmcpID0+IHtcclxuICogICBjb25zb2xlLmxvZyhcIkkgaGVhcmQgXCIgKyBtZXNzYWdlKTtcclxuICogfSk7XHJcbiAqIG5vdGlmaWVyLmFkZExpc3RlbmVyKChtZXNzYWdlOiBzdHJpbmcpID0+IHtcclxuICogICBjb25zb2xlLmxvZyhcIkkgYWxzbyBoZWFyZCBcIiArIG1lc3NhZ2UpO1xyXG4gKiB9KTtcclxuICpcclxuICogbm90aWZpZXIuZW1pdCgnaGVsbG8nKTsgLy8gbG9ncyBcIkkgaGVhcmQgaGVsbG9cIiBhbmQgXCJJIGFsc28gaGVhcmQgaGVsbG9cIlxyXG4gKiBgYGBcclxuICpcclxuICogQ2FsbHMgdG8gYGVtaXRgIHdpbGwgc2VuZCBhbG9uZyBhbGwgb2YgdGhlaXIgYXJndW1lbnRzLlxyXG4gKlxyXG4gKiBAZXhwb3J0XHJcbiAqIEBjbGFzcyBOb3RpZmllclxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTm90aWZpZXIge1xyXG4gIHB1YmxpYyBsaXN0ZW5lcnM6IGFueVtdOyAvLyBUT0RPIC0gZGVmaW5lIExpc3RlbmVyIGludGVyZmFjZVxyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMubGlzdGVuZXJzID0gW107XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBBZGQgYSBjYWxsYmFjayBhcyBhIGxpc3RlbmVyLCB3aGljaCB3aWxsIGJlIHRyaWdnZXJlZCB3aGVuIHNlbmRpbmdcclxuICAgKiBub3RpZmljYXRpb25zLlxyXG4gICAqIFxyXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIEZ1bmN0aW9uIHRvIGNhbGwgYXMgYSBub3RpZmljYXRpb25cclxuICAgKiBAcGFyYW0ge29iamVjdH0gYmluZGluZyBDb250ZXh0IGluIHdoaWNoIHRvIGNhbGwgYGNhbGxiYWNrYFxyXG4gICAqIFxyXG4gICAqIEBtZW1iZXJPZiBOb3RpZmllclxyXG4gICAqL1xyXG4gIGFkZExpc3RlbmVyKGNhbGxiYWNrOiBGdW5jdGlvbiwgYmluZGluZzogb2JqZWN0KSB7XHJcbiAgICBiaW5kaW5nID0gYmluZGluZyB8fCB0aGlzO1xyXG4gICAgdGhpcy5saXN0ZW5lcnMucHVzaChbY2FsbGJhY2ssIGJpbmRpbmddKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlbW92ZSBhIGxpc3RlbmVyIHNvIHRoYXQgaXQgd2lsbCBubyBsb25nZXIgcmVjZWl2ZSBub3RpZmljYXRpb25zLlxyXG4gICAqIFxyXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIEZ1bmN0aW9uIHJlZ2lzdGVyZWQgYXMgYSBjYWxsYmFja1xyXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBiaW5kaW5nIENvbnRleHQgaW4gd2hpY2ggYGNhbGxiYWNrYCB3YXMgcmVnaXN0ZXJlZCBcclxuICAgKiBAcmV0dXJucyBcclxuICAgKiBcclxuICAgKiBAbWVtYmVyT2YgTm90aWZpZXJcclxuICAgKi9cclxuICByZW1vdmVMaXN0ZW5lcihjYWxsYmFjazogRnVuY3Rpb24sIGJpbmRpbmc6IG9iamVjdCkge1xyXG4gICAgbGV0IGxpc3RlbmVycyA9IHRoaXMubGlzdGVuZXJzO1xyXG4gICAgbGV0IGxpc3RlbmVyO1xyXG5cclxuICAgIGJpbmRpbmcgPSBiaW5kaW5nIHx8IHRoaXM7XHJcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gbGlzdGVuZXJzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgIGxpc3RlbmVyID0gbGlzdGVuZXJzW2ldO1xyXG4gICAgICBpZiAobGlzdGVuZXIgJiYgbGlzdGVuZXJbMF0gPT09IGNhbGxiYWNrICYmIGxpc3RlbmVyWzFdID09PSBiaW5kaW5nKSB7XHJcbiAgICAgICAgbGlzdGVuZXJzLnNwbGljZShpLCAxKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE5vdGlmeSByZWdpc3RlcmVkIGxpc3RlbmVycy5cclxuICAgKiBcclxuICAgKiBAcGFyYW0ge2FueX0gYXJncyBQYXJhbXMgdG8gYmUgc2VudCB0byBsaXN0ZW5lcnNcclxuICAgKiBcclxuICAgKiBAbWVtYmVyT2YgTm90aWZpZXJcclxuICAgKi9cclxuICBlbWl0KC4uLmFyZ3MpIHtcclxuICAgIHRoaXMubGlzdGVuZXJzLnNsaWNlKDApLmZvckVhY2goKGxpc3RlbmVyKSA9PiB7XHJcbiAgICAgIGxpc3RlbmVyWzBdLmFwcGx5KGxpc3RlbmVyWzFdLCBhcmdzKTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG4iXX0=