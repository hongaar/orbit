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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyaW5ncy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNyYy9zdHJpbmdzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLEFBTUc7Ozs7Ozs7QUFDSCxvQkFBMkIsQUFBVyxLQUNwQyxBQUFNO1dBQUMsQUFBRyxJQUFDLEFBQU0sT0FBQyxBQUFDLEFBQUMsR0FBQyxBQUFXLEFBQUUsZ0JBQUcsQUFBRyxJQUFDLEFBQUssTUFBQyxBQUFDLEFBQUMsQUFBQyxBQUNwRCxBQUFDOztBQUZELHFCQUVDO0FBRUQsQUFPRzs7Ozs7Ozs7QUFDSCxrQkFBeUIsQUFBVyxLQUNsQyxBQUFNO2VBQ0gsQUFBTyxRQUFDLEFBQXFCLHVCQUFFLFVBQVMsQUFBSyxPQUFFLEFBQVMsV0FBRSxBQUFHLEtBQzVELEFBQU07ZUFBQyxBQUFHLE1BQUcsQUFBRyxJQUFDLEFBQVcsQUFBRSxnQkFBRyxBQUFFLEFBQUMsQUFDdEMsQUFBQyxBQUFDO0FBSEcsQUFBRyxPQUlQLEFBQU8sUUFBQyxBQUFnQixrQkFBRSxVQUFTLEFBQUssT0FDdkMsQUFBTTtlQUFDLEFBQUssTUFBQyxBQUFXLEFBQUUsQUFBQyxBQUM3QixBQUFDLEFBQUMsQUFBQyxBQUNQO0FBQUM7O0FBUkQsbUJBUUM7QUFFRCxBQU1HOzs7Ozs7O0FBQ0gsb0JBQTJCLEFBQVcsS0FDcEMsQUFBTTtXQUFDLEFBQUcsSUFDUCxBQUFPLFFBQUMsQUFBbUIscUJBQUUsQUFBTyxBQUFDLFNBQ3JDLEFBQVcsQUFBRSxBQUFDLEFBQ25CLEFBQUM7O0FBSkQscUJBSUM7QUFFRCxBQU1HOzs7Ozs7O0FBQ0gsbUJBQTBCLEFBQVcsS0FDbkMsQUFBTTtXQUFDLEFBQVUsV0FBQyxBQUFHLEFBQUMsS0FBQyxBQUFPLFFBQUMsQUFBTyxTQUFFLEFBQUcsQUFBQyxBQUFDLEFBQy9DLEFBQUM7O0FBRkQsb0JBRUM7QUFFRCxBQU1HOzs7Ozs7O0FBQ0gsb0JBQTJCLEFBQVcsS0FDcEMsQUFBTTtXQUFDLEFBQUcsSUFDUCxBQUFPLFFBQUMsQUFBb0Isc0JBQUUsQUFBTyxBQUFDLFNBQ3RDLEFBQU8sUUFBQyxBQUFTLFdBQUUsQUFBRyxBQUFDLEtBQ3ZCLEFBQVcsQUFBRSxBQUFDLEFBQ25CLEFBQUM7O0FBTEQscUJBS0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogVXBwZXJjYXNlIHRoZSBmaXJzdCBsZXR0ZXIgb2YgYSBzdHJpbmcsIGJ1dCBkb24ndCBjaGFuZ2UgdGhlIHJlbWFpbmRlci5cclxuICogXHJcbiAqIEBleHBvcnRcclxuICogQHBhcmFtIHtzdHJpbmd9IHN0ciBcclxuICogQHJldHVybnMge3N0cmluZ30gXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gY2FwaXRhbGl6ZShzdHI6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgcmV0dXJuIHN0ci5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0ci5zbGljZSgxKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIENvbnZlcnQgdW5kZXJzY29yZWQsIGRhc2hlcml6ZWQsIG9yIHNwYWNlLWRlbGltaXRlZCB3b3JkcyBpbnRvXHJcbiAqIGxvd2VyQ2FtZWxDYXNlLlxyXG4gKlxyXG4gKiBAZXhwb3J0XHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJcclxuICogQHJldHVybnMge3N0cmluZ31cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBjYW1lbGl6ZShzdHI6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgcmV0dXJuIHN0clxyXG4gICAgLnJlcGxhY2UoLyhcXC18XFxffFxcLnxcXHMpKyguKT8vZywgZnVuY3Rpb24obWF0Y2gsIHNlcGFyYXRvciwgY2hyKSB7XHJcbiAgICAgIHJldHVybiBjaHIgPyBjaHIudG9VcHBlckNhc2UoKSA6ICcnO1xyXG4gICAgfSlcclxuICAgIC5yZXBsYWNlKC8oXnxcXC8pKFtBLVpdKS9nLCBmdW5jdGlvbihtYXRjaCkge1xyXG4gICAgICByZXR1cm4gbWF0Y2gudG9Mb3dlckNhc2UoKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG4vKipcclxuICogQ29udmVydHMgYSBjYW1lbGl6ZWQgc3RyaW5nIGludG8gYWxsIGxvd2VyY2FzZSBzZXBhcmF0ZWQgYnkgdW5kZXJzY29yZXMuXHJcbiAqIFxyXG4gKiBAZXhwb3J0XHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHIgXHJcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGRlY2FtZWxpemUoc3RyOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gIHJldHVybiBzdHJcclxuICAgIC5yZXBsYWNlKC8oW2EtelxcZF0pKFtBLVpdKS9nLCAnJDFfJDInKVxyXG4gICAgLnRvTG93ZXJDYXNlKCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBEYXNoZXJpemUgd29yZHMgdGhhdCBhcmUgdW5kZXJzY29yZWQsIHNwYWNlLWRlbGltaXRlZCwgb3IgY2FtZWxDYXNlZC5cclxuICogXHJcbiAqIEBleHBvcnRcclxuICogQHBhcmFtIHtzdHJpbmd9IHN0ciBcclxuICogQHJldHVybnMge3N0cmluZ30gXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZGFzaGVyaXplKHN0cjogc3RyaW5nKTogc3RyaW5nIHtcclxuICByZXR1cm4gZGVjYW1lbGl6ZShzdHIpLnJlcGxhY2UoL1sgX10vZywgJy0nKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFVuZGVyc2NvcmUgd29yZHMgdGhhdCBhcmUgZGFzaGVyaXplZCwgc3BhY2UtZGVsaW1pdGVkLCBvciBjYW1lbENhc2VkLlxyXG4gKiBcclxuICogQGV4cG9ydFxyXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyIFxyXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiB1bmRlcnNjb3JlKHN0cjogc3RyaW5nKTogc3RyaW5nIHtcclxuICByZXR1cm4gc3RyXHJcbiAgICAucmVwbGFjZSgvKFthLXpcXGRdKShbQS1aXSspL2csICckMV8kMicpXHJcbiAgICAucmVwbGFjZSgvXFwtfFxccysvZywgJ18nKVxyXG4gICAgLnRvTG93ZXJDYXNlKCk7XHJcbn1cclxuIl19