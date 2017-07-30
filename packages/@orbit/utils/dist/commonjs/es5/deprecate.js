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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwcmVjYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3JjL2RlcHJlY2F0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSxBQU9HOzs7Ozs7OztBQUNILG1CQUEwQixBQUFlLFNBQUUsQUFBOEIsTUFDdkUsQUFBRSxBQUFDO1FBQUMsT0FBTyxBQUFJLFNBQUssQUFBVSxBQUFDLFlBQUMsQUFBQyxBQUMvQixBQUFFLEFBQUM7WUFBQyxBQUFJLEFBQUUsQUFBQyxRQUFDLEFBQUMsQUFBQyxBQUFNLEFBQUMsQUFBQztBQUFDLEFBQ3pCO0FBQUMsQUFBQyxBQUFJO1dBQUMsQUFBQyxBQUNOLEFBQUUsQUFBQztZQUFDLEFBQUksQUFBQyxNQUFDLEFBQUMsQUFBQyxBQUFNLEFBQUMsQUFBQztBQUFDLEFBQ3ZCO0FBQUM7QUFDRCxBQUFPO1lBQUMsQUFBSSxLQUFDLEFBQU8sQUFBQyxBQUFDLEFBQ3hCLEFBQUM7O0FBUEQsb0JBT0MiLCJzb3VyY2VzQ29udGVudCI6WyJkZWNsYXJlIGNvbnN0IGNvbnNvbGU6IGFueTtcclxuXHJcbi8qKlxyXG4gKiBEaXNwbGF5IGEgZGVwcmVjYXRpb24gd2FybmluZyB3aXRoIHRoZSBwcm92aWRlZCBtZXNzYWdlLlxyXG4gKiBcclxuICogQGV4cG9ydFxyXG4gKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZSBEZXNjcmlwdGlvbiBvZiB0aGUgZGVwcmVjYXRpb25cclxuICogQHBhcmFtIHsoKCkgPT4gYm9vbGVhbiB8IGJvb2xlYW4pfSB0ZXN0IEFuIG9wdGlvbmFsIGJvb2xlYW4gb3IgZnVuY3Rpb24gdGhhdCBldmFsdWF0ZXMgdG8gYSBib29sZWFuLlxyXG4gKiBAcmV0dXJucyBcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBkZXByZWNhdGUobWVzc2FnZTogc3RyaW5nLCB0ZXN0PzogKCkgPT4gYm9vbGVhbiB8IGJvb2xlYW4pIHtcclxuICBpZiAodHlwZW9mIHRlc3QgPT09ICdmdW5jdGlvbicpIHtcclxuICAgIGlmICh0ZXN0KCkpIHsgcmV0dXJuOyB9XHJcbiAgfSBlbHNlIHtcclxuICAgIGlmICh0ZXN0KSB7IHJldHVybjsgfVxyXG4gIH1cclxuICBjb25zb2xlLndhcm4obWVzc2FnZSk7XHJcbn1cclxuIl19