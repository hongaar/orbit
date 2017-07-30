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
    return str
        .replace(/(\-|\_|\.|\s)+(.)?/g, function (match, separator, chr) {
        return chr ? chr.toUpperCase() : '';
    })
        .replace(/(^|\/)([A-Z])/g, function (match) {
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
    return str
        .replace(/([a-z\d])([A-Z])/g, '$1_$2')
        .toLowerCase();
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
    return str
        .replace(/([a-z\d])([A-Z]+)/g, '$1_$2')
        .replace(/\-|\s+/g, '_')
        .toLowerCase();
}
exports.underscore = underscore;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyaW5ncy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNyYy9zdHJpbmdzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsb0JBQTJCLEdBQVc7SUFDcEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwRCxDQUFDO0FBRkQsZ0NBRUM7QUFFRDs7Ozs7OztHQU9HO0FBQ0gsa0JBQXlCLEdBQVc7SUFDbEMsTUFBTSxDQUFDLEdBQUc7U0FDUCxPQUFPLENBQUMscUJBQXFCLEVBQUUsVUFBUyxLQUFLLEVBQUUsU0FBUyxFQUFFLEdBQUc7UUFDNUQsTUFBTSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRSxDQUFDO0lBQ3RDLENBQUMsQ0FBQztTQUNELE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxVQUFTLEtBQUs7UUFDdkMsTUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUM3QixDQUFDLENBQUMsQ0FBQztBQUNQLENBQUM7QUFSRCw0QkFRQztBQUVEOzs7Ozs7R0FNRztBQUNILG9CQUEyQixHQUFXO0lBQ3BDLE1BQU0sQ0FBQyxHQUFHO1NBQ1AsT0FBTyxDQUFDLG1CQUFtQixFQUFFLE9BQU8sQ0FBQztTQUNyQyxXQUFXLEVBQUUsQ0FBQztBQUNuQixDQUFDO0FBSkQsZ0NBSUM7QUFFRDs7Ozs7O0dBTUc7QUFDSCxtQkFBMEIsR0FBVztJQUNuQyxNQUFNLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDL0MsQ0FBQztBQUZELDhCQUVDO0FBRUQ7Ozs7OztHQU1HO0FBQ0gsb0JBQTJCLEdBQVc7SUFDcEMsTUFBTSxDQUFDLEdBQUc7U0FDUCxPQUFPLENBQUMsb0JBQW9CLEVBQUUsT0FBTyxDQUFDO1NBQ3RDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDO1NBQ3ZCLFdBQVcsRUFBRSxDQUFDO0FBQ25CLENBQUM7QUFMRCxnQ0FLQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBVcHBlcmNhc2UgdGhlIGZpcnN0IGxldHRlciBvZiBhIHN0cmluZywgYnV0IGRvbid0IGNoYW5nZSB0aGUgcmVtYWluZGVyLlxyXG4gKiBcclxuICogQGV4cG9ydFxyXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyIFxyXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBjYXBpdGFsaXplKHN0cjogc3RyaW5nKTogc3RyaW5nIHtcclxuICByZXR1cm4gc3RyLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc3RyLnNsaWNlKDEpO1xyXG59XHJcblxyXG4vKipcclxuICogQ29udmVydCB1bmRlcnNjb3JlZCwgZGFzaGVyaXplZCwgb3Igc3BhY2UtZGVsaW1pdGVkIHdvcmRzIGludG9cclxuICogbG93ZXJDYW1lbENhc2UuXHJcbiAqXHJcbiAqIEBleHBvcnRcclxuICogQHBhcmFtIHtzdHJpbmd9IHN0clxyXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGNhbWVsaXplKHN0cjogc3RyaW5nKTogc3RyaW5nIHtcclxuICByZXR1cm4gc3RyXHJcbiAgICAucmVwbGFjZSgvKFxcLXxcXF98XFwufFxccykrKC4pPy9nLCBmdW5jdGlvbihtYXRjaCwgc2VwYXJhdG9yLCBjaHIpIHtcclxuICAgICAgcmV0dXJuIGNociA/IGNoci50b1VwcGVyQ2FzZSgpIDogJyc7XHJcbiAgICB9KVxyXG4gICAgLnJlcGxhY2UoLyhefFxcLykoW0EtWl0pL2csIGZ1bmN0aW9uKG1hdGNoKSB7XHJcbiAgICAgIHJldHVybiBtYXRjaC50b0xvd2VyQ2FzZSgpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDb252ZXJ0cyBhIGNhbWVsaXplZCBzdHJpbmcgaW50byBhbGwgbG93ZXJjYXNlIHNlcGFyYXRlZCBieSB1bmRlcnNjb3Jlcy5cclxuICogXHJcbiAqIEBleHBvcnRcclxuICogQHBhcmFtIHtzdHJpbmd9IHN0ciBcclxuICogQHJldHVybnMge3N0cmluZ30gXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZGVjYW1lbGl6ZShzdHI6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgcmV0dXJuIHN0clxyXG4gICAgLnJlcGxhY2UoLyhbYS16XFxkXSkoW0EtWl0pL2csICckMV8kMicpXHJcbiAgICAudG9Mb3dlckNhc2UoKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIERhc2hlcml6ZSB3b3JkcyB0aGF0IGFyZSB1bmRlcnNjb3JlZCwgc3BhY2UtZGVsaW1pdGVkLCBvciBjYW1lbENhc2VkLlxyXG4gKiBcclxuICogQGV4cG9ydFxyXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyIFxyXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBkYXNoZXJpemUoc3RyOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gIHJldHVybiBkZWNhbWVsaXplKHN0cikucmVwbGFjZSgvWyBfXS9nLCAnLScpO1xyXG59XHJcblxyXG4vKipcclxuICogVW5kZXJzY29yZSB3b3JkcyB0aGF0IGFyZSBkYXNoZXJpemVkLCBzcGFjZS1kZWxpbWl0ZWQsIG9yIGNhbWVsQ2FzZWQuXHJcbiAqIFxyXG4gKiBAZXhwb3J0XHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHIgXHJcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHVuZGVyc2NvcmUoc3RyOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gIHJldHVybiBzdHJcclxuICAgIC5yZXBsYWNlKC8oW2EtelxcZF0pKFtBLVpdKykvZywgJyQxXyQyJylcclxuICAgIC5yZXBsYWNlKC9cXC18XFxzKy9nLCAnXycpXHJcbiAgICAudG9Mb3dlckNhc2UoKTtcclxufVxyXG4iXX0=