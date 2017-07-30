"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Display a deprecation warning with the provided message.
 *
 * @export
 * @param {string} message Description of the deprecation
 * @param {(() => boolean | boolean)} test An optional boolean or function that evaluates to a boolean.
 * @returns
 */
function deprecate(message, test) {
    if (typeof test === 'function') {
        if (test()) {
            return;
        }
    } else {
        if (test) {
            return;
        }
    }
    console.warn(message);
}
exports.deprecate = deprecate;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwcmVjYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3JjL2RlcHJlY2F0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSxBQU9HOzs7Ozs7OztBQUNILG1CQUEwQixBQUFlLFNBQUUsQUFBOEI7QUFDdkUsQUFBRSxBQUFDLFFBQUMsT0FBTyxBQUFJLFNBQUssQUFBVSxBQUFDLFlBQUMsQUFBQztBQUMvQixBQUFFLEFBQUMsWUFBQyxBQUFJLEFBQUUsQUFBQyxRQUFDLEFBQUM7QUFBQyxBQUFNLEFBQUMsQUFBQztBQUFDLEFBQ3pCO0FBQUMsQUFBQyxBQUFJLFdBQUMsQUFBQztBQUNOLEFBQUUsQUFBQyxZQUFDLEFBQUksQUFBQyxNQUFDLEFBQUM7QUFBQyxBQUFNLEFBQUMsQUFBQztBQUFDLEFBQ3ZCO0FBQUM7QUFDRCxBQUFPLFlBQUMsQUFBSSxLQUFDLEFBQU8sQUFBQyxBQUFDLEFBQ3hCO0FBQUM7QUFQRCxvQkFPQyIsInNvdXJjZXNDb250ZW50IjpbImRlY2xhcmUgY29uc3QgY29uc29sZTogYW55O1xyXG5cclxuLyoqXHJcbiAqIERpc3BsYXkgYSBkZXByZWNhdGlvbiB3YXJuaW5nIHdpdGggdGhlIHByb3ZpZGVkIG1lc3NhZ2UuXHJcbiAqIFxyXG4gKiBAZXhwb3J0XHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlIERlc2NyaXB0aW9uIG9mIHRoZSBkZXByZWNhdGlvblxyXG4gKiBAcGFyYW0geygoKSA9PiBib29sZWFuIHwgYm9vbGVhbil9IHRlc3QgQW4gb3B0aW9uYWwgYm9vbGVhbiBvciBmdW5jdGlvbiB0aGF0IGV2YWx1YXRlcyB0byBhIGJvb2xlYW4uXHJcbiAqIEByZXR1cm5zIFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGRlcHJlY2F0ZShtZXNzYWdlOiBzdHJpbmcsIHRlc3Q/OiAoKSA9PiBib29sZWFuIHwgYm9vbGVhbikge1xyXG4gIGlmICh0eXBlb2YgdGVzdCA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgaWYgKHRlc3QoKSkgeyByZXR1cm47IH1cclxuICB9IGVsc2Uge1xyXG4gICAgaWYgKHRlc3QpIHsgcmV0dXJuOyB9XHJcbiAgfVxyXG4gIGNvbnNvbGUud2FybihtZXNzYWdlKTtcclxufVxyXG4iXX0=