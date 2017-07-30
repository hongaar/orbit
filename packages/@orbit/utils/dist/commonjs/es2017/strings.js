"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Uppercase the first letter of a string, but don't change the remainder.
 *
 * @export
 * @param {string} str
 * @returns {string}
 */
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
exports.capitalize = capitalize;
/**
 * Convert underscored, dasherized, or space-delimited words into
 * lowerCamelCase.
 *
 * @export
 * @param {string} str
 * @returns {string}
 */
function camelize(str) {
    return str.replace(/(\-|\_|\.|\s)+(.)?/g, function (match, separator, chr) {
        return chr ? chr.toUpperCase() : '';
    }).replace(/(^|\/)([A-Z])/g, function (match) {
        return match.toLowerCase();
    });
}
exports.camelize = camelize;
/**
 * Converts a camelized string into all lowercase separated by underscores.
 *
 * @export
 * @param {string} str
 * @returns {string}
 */
function decamelize(str) {
    return str.replace(/([a-z\d])([A-Z])/g, '$1_$2').toLowerCase();
}
exports.decamelize = decamelize;
/**
 * Dasherize words that are underscored, space-delimited, or camelCased.
 *
 * @export
 * @param {string} str
 * @returns {string}
 */
function dasherize(str) {
    return decamelize(str).replace(/[ _]/g, '-');
}
exports.dasherize = dasherize;
/**
 * Underscore words that are dasherized, space-delimited, or camelCased.
 *
 * @export
 * @param {string} str
 * @returns {string}
 */
function underscore(str) {
    return str.replace(/([a-z\d])([A-Z]+)/g, '$1_$2').replace(/\-|\s+/g, '_').toLowerCase();
}
exports.underscore = underscore;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyaW5ncy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNyYy9zdHJpbmdzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLEFBTUc7Ozs7Ozs7QUFDSCxvQkFBMkIsQUFBVztBQUNwQyxBQUFNLFdBQUMsQUFBRyxJQUFDLEFBQU0sT0FBQyxBQUFDLEFBQUMsR0FBQyxBQUFXLEFBQUUsZ0JBQUcsQUFBRyxJQUFDLEFBQUssTUFBQyxBQUFDLEFBQUMsQUFBQyxBQUNwRDtBQUFDO0FBRkQscUJBRUM7QUFFRCxBQU9HOzs7Ozs7OztBQUNILGtCQUF5QixBQUFXO0FBQ2xDLEFBQU0sZUFDSCxBQUFPLFFBQUMsQUFBcUIsdUJBQUUsVUFBUyxBQUFLLE9BQUUsQUFBUyxXQUFFLEFBQUc7QUFDNUQsQUFBTSxlQUFDLEFBQUcsTUFBRyxBQUFHLElBQUMsQUFBVyxBQUFFLGdCQUFHLEFBQUUsQUFBQyxBQUN0QztBQUFDLEFBQUMsS0FIRyxBQUFHLEVBSVAsQUFBTyxRQUFDLEFBQWdCLGtCQUFFLFVBQVMsQUFBSztBQUN2QyxBQUFNLGVBQUMsQUFBSyxNQUFDLEFBQVcsQUFBRSxBQUFDLEFBQzdCO0FBQUMsQUFBQyxBQUFDLEFBQ1A7QUFBQztBQVJELG1CQVFDO0FBRUQsQUFNRzs7Ozs7OztBQUNILG9CQUEyQixBQUFXO0FBQ3BDLEFBQU0sV0FBQyxBQUFHLElBQ1AsQUFBTyxRQUFDLEFBQW1CLHFCQUFFLEFBQU8sQUFBQyxTQUNyQyxBQUFXLEFBQUUsQUFBQyxBQUNuQjtBQUFDO0FBSkQscUJBSUM7QUFFRCxBQU1HOzs7Ozs7O0FBQ0gsbUJBQTBCLEFBQVc7QUFDbkMsQUFBTSxXQUFDLEFBQVUsV0FBQyxBQUFHLEFBQUMsS0FBQyxBQUFPLFFBQUMsQUFBTyxTQUFFLEFBQUcsQUFBQyxBQUFDLEFBQy9DO0FBQUM7QUFGRCxvQkFFQztBQUVELEFBTUc7Ozs7Ozs7QUFDSCxvQkFBMkIsQUFBVztBQUNwQyxBQUFNLFdBQUMsQUFBRyxJQUNQLEFBQU8sUUFBQyxBQUFvQixzQkFBRSxBQUFPLEFBQUMsU0FDdEMsQUFBTyxRQUFDLEFBQVMsV0FBRSxBQUFHLEFBQUMsS0FDdkIsQUFBVyxBQUFFLEFBQUMsQUFDbkI7QUFBQztBQUxELHFCQUtDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIFVwcGVyY2FzZSB0aGUgZmlyc3QgbGV0dGVyIG9mIGEgc3RyaW5nLCBidXQgZG9uJ3QgY2hhbmdlIHRoZSByZW1haW5kZXIuXHJcbiAqIFxyXG4gKiBAZXhwb3J0XHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHIgXHJcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGNhcGl0YWxpemUoc3RyOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gIHJldHVybiBzdHIuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHIuc2xpY2UoMSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDb252ZXJ0IHVuZGVyc2NvcmVkLCBkYXNoZXJpemVkLCBvciBzcGFjZS1kZWxpbWl0ZWQgd29yZHMgaW50b1xyXG4gKiBsb3dlckNhbWVsQ2FzZS5cclxuICpcclxuICogQGV4cG9ydFxyXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyXHJcbiAqIEByZXR1cm5zIHtzdHJpbmd9XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gY2FtZWxpemUoc3RyOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gIHJldHVybiBzdHJcclxuICAgIC5yZXBsYWNlKC8oXFwtfFxcX3xcXC58XFxzKSsoLik/L2csIGZ1bmN0aW9uKG1hdGNoLCBzZXBhcmF0b3IsIGNocikge1xyXG4gICAgICByZXR1cm4gY2hyID8gY2hyLnRvVXBwZXJDYXNlKCkgOiAnJztcclxuICAgIH0pXHJcbiAgICAucmVwbGFjZSgvKF58XFwvKShbQS1aXSkvZywgZnVuY3Rpb24obWF0Y2gpIHtcclxuICAgICAgcmV0dXJuIG1hdGNoLnRvTG93ZXJDYXNlKCk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIENvbnZlcnRzIGEgY2FtZWxpemVkIHN0cmluZyBpbnRvIGFsbCBsb3dlcmNhc2Ugc2VwYXJhdGVkIGJ5IHVuZGVyc2NvcmVzLlxyXG4gKiBcclxuICogQGV4cG9ydFxyXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyIFxyXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBkZWNhbWVsaXplKHN0cjogc3RyaW5nKTogc3RyaW5nIHtcclxuICByZXR1cm4gc3RyXHJcbiAgICAucmVwbGFjZSgvKFthLXpcXGRdKShbQS1aXSkvZywgJyQxXyQyJylcclxuICAgIC50b0xvd2VyQ2FzZSgpO1xyXG59XHJcblxyXG4vKipcclxuICogRGFzaGVyaXplIHdvcmRzIHRoYXQgYXJlIHVuZGVyc2NvcmVkLCBzcGFjZS1kZWxpbWl0ZWQsIG9yIGNhbWVsQ2FzZWQuXHJcbiAqIFxyXG4gKiBAZXhwb3J0XHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHIgXHJcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGRhc2hlcml6ZShzdHI6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgcmV0dXJuIGRlY2FtZWxpemUoc3RyKS5yZXBsYWNlKC9bIF9dL2csICctJyk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBVbmRlcnNjb3JlIHdvcmRzIHRoYXQgYXJlIGRhc2hlcml6ZWQsIHNwYWNlLWRlbGltaXRlZCwgb3IgY2FtZWxDYXNlZC5cclxuICogXHJcbiAqIEBleHBvcnRcclxuICogQHBhcmFtIHtzdHJpbmd9IHN0ciBcclxuICogQHJldHVybnMge3N0cmluZ30gXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gdW5kZXJzY29yZShzdHI6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgcmV0dXJuIHN0clxyXG4gICAgLnJlcGxhY2UoLyhbYS16XFxkXSkoW0EtWl0rKS9nLCAnJDFfJDInKVxyXG4gICAgLnJlcGxhY2UoL1xcLXxcXHMrL2csICdfJylcclxuICAgIC50b0xvd2VyQ2FzZSgpO1xyXG59XHJcbiJdfQ==