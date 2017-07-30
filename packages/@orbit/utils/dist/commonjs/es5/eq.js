"use strict";
/* eslint-disable eqeqeq, no-eq-null, valid-jsdoc */

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * `eq` checks the equality of two objects.
 *
 * The properties belonging to objects (but not their prototypes) will be
 * traversed deeply and compared.
 *
 * Includes special handling for strings, numbers, dates, booleans, regexes, and
 * arrays
 *
 * @export
 * @param {*} a
 * @param {*} b
 * @returns {boolean} are `a` and `b` equal?
 */
function eq(a, b) {
    // Some elements of this function come from underscore
    // (c) 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
    //
    // https://github.com/jashkenas/underscore/blob/master/underscore.js
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) {
        return a !== 0 || 1 / a == 1 / b;
    }
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) {
        return a === b;
    }
    var type = Object.prototype.toString.call(a);
    if (type !== Object.prototype.toString.call(b)) {
        return false;
    }
    switch (type) {
        case '[object String]':
            return a == String(b);
        case '[object Number]':
            // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
            // other numeric values.
            return a != +a ? b != +b : a == 0 ? 1 / a == 1 / b : a == +b;
        case '[object Date]':
        case '[object Boolean]':
            // Coerce dates and booleans to numeric primitive values. Dates are compared by their
            // millisecond representations. Note that invalid dates with millisecond representations
            // of `NaN` are not equivalent.
            return +a == +b;
        // RegExps are compared by their source patterns and flags.
        case '[object RegExp]':
            return a.source == b.source && a.global == b.global && a.multiline == b.multiline && a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') {
        return false;
    }
    if (type === '[object Array]') {
        if (a.length !== b.length) {
            return false;
        }
    }
    var i;
    for (i in b) {
        if (b.hasOwnProperty(i)) {
            if (!eq(a[i], b[i])) {
                return false;
            }
        }
    }
    for (i in a) {
        if (a.hasOwnProperty(i)) {
            if (!eq(a[i], b[i])) {
                return false;
            }
        }
    }
    return true;
}
exports.eq = eq;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzcmMvZXEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLEFBQW9EOzs7QUFFcEQsQUFhRzs7Ozs7Ozs7Ozs7Ozs7QUFDSCxZQUFtQixBQUFNLEdBQUUsQUFBTSxHQUMvQixBQUFzRDtBQUN0RCxBQUFxRjtBQUNyRixBQUFFO0FBQ0YsQUFBb0U7QUFFcEUsQUFBc0U7QUFDdEUsQUFBMEY7QUFDMUYsQUFBRSxBQUFDO1FBQUMsQUFBQyxNQUFLLEFBQUMsQUFBQyxHQUFDLEFBQUMsQUFBQyxBQUFNO2VBQUMsQUFBQyxNQUFLLEFBQUMsS0FBSSxBQUFDLElBQUcsQUFBQyxLQUFJLEFBQUMsSUFBRyxBQUFDLEFBQUMsQUFBQyxBQUFDO0FBQ2xELEFBQWdFO0FBQ2hFLEFBQUUsQUFBQztRQUFDLEFBQUMsS0FBSSxBQUFJLFFBQUksQUFBQyxLQUFJLEFBQUksQUFBQyxNQUFDLEFBQUMsQUFBQyxBQUFNO2VBQUMsQUFBQyxNQUFLLEFBQUMsQUFBQyxBQUFDLEFBQUM7QUFFL0M7UUFBSSxBQUFJLE9BQUcsQUFBTSxPQUFDLEFBQVMsVUFBQyxBQUFRLFNBQUMsQUFBSSxLQUFDLEFBQUMsQUFBQyxBQUFDLEFBQzdDLEFBQUUsQUFBQztRQUFDLEFBQUksU0FBSyxBQUFNLE9BQUMsQUFBUyxVQUFDLEFBQVEsU0FBQyxBQUFJLEtBQUMsQUFBQyxBQUFDLEFBQUMsSUFBQyxBQUFDLEFBQUMsQUFBTTtlQUFDLEFBQUssQUFBQyxBQUFDLEFBQUM7QUFFakUsQUFBTSxBQUFDO1lBQUMsQUFBSSxBQUFDLEFBQUMsQUFBQyxBQUNiO2FBQUssQUFBaUIsQUFDcEIsQUFBTTttQkFBQyxBQUFDLEtBQUksQUFBTSxPQUFDLEFBQUMsQUFBQyxBQUFDLEFBQ3hCO2FBQUssQUFBaUIsQUFDcEIsQUFBa0Y7QUFDbEYsQUFBd0I7QUFDeEIsQUFBTTttQkFBQyxBQUFDLEtBQUksQ0FBQyxBQUFDLElBQUcsQUFBQyxLQUFJLENBQUMsQUFBQyxBQUFHLElBQUMsQUFBQyxLQUFJLEFBQUMsSUFBRyxBQUFDLElBQUcsQUFBQyxLQUFJLEFBQUMsSUFBRyxBQUFDLElBQUcsQUFBQyxLQUFJLENBQUMsQUFBQyxBQUFDLEFBQUMsQUFDakU7YUFBSyxBQUFlLEFBQUMsQUFDckI7YUFBSyxBQUFrQixBQUNyQixBQUFxRjtBQUNyRixBQUF3RjtBQUN4RixBQUErQjtBQUMvQixBQUFNO21CQUFDLENBQUMsQUFBQyxLQUFJLENBQUMsQUFBQyxBQUFDLEFBQ2xCLEFBQTJEO0FBQzNEO2FBQUssQUFBaUIsQUFDcEIsQUFBTTttQkFBQyxBQUFDLEVBQUMsQUFBTSxVQUFJLEFBQUMsRUFBQyxBQUFNLFVBQ3BCLEFBQUMsRUFBQyxBQUFNLFVBQUksQUFBQyxFQUFDLEFBQU0sVUFDcEIsQUFBQyxFQUFDLEFBQVMsYUFBSSxBQUFDLEVBQUMsQUFBUyxhQUMxQixBQUFDLEVBQUMsQUFBVSxjQUFJLEFBQUMsRUFBQyxBQUFVLEFBQUMsQUFDeEMsQUFBQyxBQUNELEFBQUUsQUFBQzs7UUFBQyxPQUFPLEFBQUMsS0FBSSxBQUFRLFlBQUksT0FBTyxBQUFDLEtBQUksQUFBUSxBQUFDLFVBQUMsQUFBQyxBQUFDLEFBQU07ZUFBQyxBQUFLLEFBQUMsQUFBQyxBQUFDO0FBRW5FLEFBQUUsQUFBQztRQUFDLEFBQUksU0FBSyxBQUFnQixBQUFDLGtCQUFDLEFBQUMsQUFDOUIsQUFBRSxBQUFDO1lBQUMsQUFBQyxFQUFDLEFBQU0sV0FBSyxBQUFDLEVBQUMsQUFBTSxBQUFDLFFBQUMsQUFBQyxBQUFDLEFBQU07bUJBQUMsQUFBSyxBQUFDLEFBQUMsQUFBQyxBQUM5QztBQUFDO0FBRUQ7UUFBSSxBQUFDLEFBQUMsQUFDTixBQUFHLEFBQUM7U0FBQyxBQUFDLEtBQUksQUFBQyxBQUFDLEdBQUMsQUFBQyxBQUNaLEFBQUUsQUFBQztZQUFDLEFBQUMsRUFBQyxBQUFjLGVBQUMsQUFBQyxBQUFDLEFBQUMsSUFBQyxBQUFDLEFBQ3hCLEFBQUUsQUFBQztnQkFBQyxDQUFDLEFBQUUsR0FBQyxBQUFDLEVBQUMsQUFBQyxBQUFDLElBQUUsQUFBQyxFQUFDLEFBQUMsQUFBQyxBQUFDLEFBQUMsS0FBQyxBQUFDLEFBQUMsQUFBTTt1QkFBQyxBQUFLLEFBQUMsQUFBQyxBQUFDLEFBQ3hDO0FBQUMsQUFDSDtBQUFDO0FBQ0QsQUFBRyxBQUFDO1NBQUMsQUFBQyxLQUFJLEFBQUMsQUFBQyxHQUFDLEFBQUMsQUFDWixBQUFFLEFBQUM7WUFBQyxBQUFDLEVBQUMsQUFBYyxlQUFDLEFBQUMsQUFBQyxBQUFDLElBQUMsQUFBQyxBQUN4QixBQUFFLEFBQUM7Z0JBQUMsQ0FBQyxBQUFFLEdBQUMsQUFBQyxFQUFDLEFBQUMsQUFBQyxJQUFFLEFBQUMsRUFBQyxBQUFDLEFBQUMsQUFBQyxBQUFDLEtBQUMsQUFBQyxBQUFDLEFBQU07dUJBQUMsQUFBSyxBQUFDLEFBQUMsQUFBQyxBQUN4QztBQUFDLEFBQ0g7QUFBQztBQUNELEFBQU07V0FBQyxBQUFJLEFBQUMsQUFDZCxBQUFDOztBQXJERCxhQXFEQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIGVxZXFlcSwgbm8tZXEtbnVsbCwgdmFsaWQtanNkb2MgKi9cclxuXHJcbi8qKlxyXG4gKiBgZXFgIGNoZWNrcyB0aGUgZXF1YWxpdHkgb2YgdHdvIG9iamVjdHMuXHJcbiAqXHJcbiAqIFRoZSBwcm9wZXJ0aWVzIGJlbG9uZ2luZyB0byBvYmplY3RzIChidXQgbm90IHRoZWlyIHByb3RvdHlwZXMpIHdpbGwgYmVcclxuICogdHJhdmVyc2VkIGRlZXBseSBhbmQgY29tcGFyZWQuXHJcbiAqXHJcbiAqIEluY2x1ZGVzIHNwZWNpYWwgaGFuZGxpbmcgZm9yIHN0cmluZ3MsIG51bWJlcnMsIGRhdGVzLCBib29sZWFucywgcmVnZXhlcywgYW5kXHJcbiAqIGFycmF5c1xyXG4gKiBcclxuICogQGV4cG9ydFxyXG4gKiBAcGFyYW0geyp9IGEgXHJcbiAqIEBwYXJhbSB7Kn0gYiBcclxuICogQHJldHVybnMge2Jvb2xlYW59IGFyZSBgYWAgYW5kIGBiYCBlcXVhbD9cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBlcShhOiBhbnksIGI6IGFueSk6IGJvb2xlYW4ge1xyXG4gIC8vIFNvbWUgZWxlbWVudHMgb2YgdGhpcyBmdW5jdGlvbiBjb21lIGZyb20gdW5kZXJzY29yZVxyXG4gIC8vIChjKSAyMDA5LTIwMTMgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcclxuICAvL1xyXG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9qYXNoa2VuYXMvdW5kZXJzY29yZS9ibG9iL21hc3Rlci91bmRlcnNjb3JlLmpzXHJcblxyXG4gIC8vIElkZW50aWNhbCBvYmplY3RzIGFyZSBlcXVhbC4gYDAgPT09IC0wYCwgYnV0IHRoZXkgYXJlbid0IGlkZW50aWNhbC5cclxuICAvLyBTZWUgdGhlIFtIYXJtb255IGBlZ2FsYCBwcm9wb3NhbF0oaHR0cDovL3dpa2kuZWNtYXNjcmlwdC5vcmcvZG9rdS5waHA/aWQ9aGFybW9ueTplZ2FsKS5cclxuICBpZiAoYSA9PT0gYikgeyByZXR1cm4gYSAhPT0gMCB8fCAxIC8gYSA9PSAxIC8gYjsgfVxyXG4gIC8vIEEgc3RyaWN0IGNvbXBhcmlzb24gaXMgbmVjZXNzYXJ5IGJlY2F1c2UgYG51bGwgPT0gdW5kZWZpbmVkYC5cclxuICBpZiAoYSA9PSBudWxsIHx8IGIgPT0gbnVsbCkgeyByZXR1cm4gYSA9PT0gYjsgfVxyXG5cclxuICB2YXIgdHlwZSA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhKTtcclxuICBpZiAodHlwZSAhPT0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGIpKSB7IHJldHVybiBmYWxzZTsgfVxyXG5cclxuICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgIGNhc2UgJ1tvYmplY3QgU3RyaW5nXSc6XHJcbiAgICAgIHJldHVybiBhID09IFN0cmluZyhiKTtcclxuICAgIGNhc2UgJ1tvYmplY3QgTnVtYmVyXSc6XHJcbiAgICAgIC8vIGBOYU5gcyBhcmUgZXF1aXZhbGVudCwgYnV0IG5vbi1yZWZsZXhpdmUuIEFuIGBlZ2FsYCBjb21wYXJpc29uIGlzIHBlcmZvcm1lZCBmb3JcclxuICAgICAgLy8gb3RoZXIgbnVtZXJpYyB2YWx1ZXMuXHJcbiAgICAgIHJldHVybiBhICE9ICthID8gYiAhPSArYiA6IChhID09IDAgPyAxIC8gYSA9PSAxIC8gYiA6IGEgPT0gK2IpO1xyXG4gICAgY2FzZSAnW29iamVjdCBEYXRlXSc6XHJcbiAgICBjYXNlICdbb2JqZWN0IEJvb2xlYW5dJzpcclxuICAgICAgLy8gQ29lcmNlIGRhdGVzIGFuZCBib29sZWFucyB0byBudW1lcmljIHByaW1pdGl2ZSB2YWx1ZXMuIERhdGVzIGFyZSBjb21wYXJlZCBieSB0aGVpclxyXG4gICAgICAvLyBtaWxsaXNlY29uZCByZXByZXNlbnRhdGlvbnMuIE5vdGUgdGhhdCBpbnZhbGlkIGRhdGVzIHdpdGggbWlsbGlzZWNvbmQgcmVwcmVzZW50YXRpb25zXHJcbiAgICAgIC8vIG9mIGBOYU5gIGFyZSBub3QgZXF1aXZhbGVudC5cclxuICAgICAgcmV0dXJuICthID09ICtiO1xyXG4gICAgLy8gUmVnRXhwcyBhcmUgY29tcGFyZWQgYnkgdGhlaXIgc291cmNlIHBhdHRlcm5zIGFuZCBmbGFncy5cclxuICAgIGNhc2UgJ1tvYmplY3QgUmVnRXhwXSc6XHJcbiAgICAgIHJldHVybiBhLnNvdXJjZSA9PSBiLnNvdXJjZSAmJlxyXG4gICAgICAgICAgICAgYS5nbG9iYWwgPT0gYi5nbG9iYWwgJiZcclxuICAgICAgICAgICAgIGEubXVsdGlsaW5lID09IGIubXVsdGlsaW5lICYmXHJcbiAgICAgICAgICAgICBhLmlnbm9yZUNhc2UgPT0gYi5pZ25vcmVDYXNlO1xyXG4gIH1cclxuICBpZiAodHlwZW9mIGEgIT0gJ29iamVjdCcgfHwgdHlwZW9mIGIgIT0gJ29iamVjdCcpIHsgcmV0dXJuIGZhbHNlOyB9XHJcblxyXG4gIGlmICh0eXBlID09PSAnW29iamVjdCBBcnJheV0nKSB7XHJcbiAgICBpZiAoYS5sZW5ndGggIT09IGIubGVuZ3RoKSB7IHJldHVybiBmYWxzZTsgfVxyXG4gIH1cclxuXHJcbiAgdmFyIGk7XHJcbiAgZm9yIChpIGluIGIpIHtcclxuICAgIGlmIChiLmhhc093blByb3BlcnR5KGkpKSB7XHJcbiAgICAgIGlmICghZXEoYVtpXSwgYltpXSkpIHsgcmV0dXJuIGZhbHNlOyB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIGZvciAoaSBpbiBhKSB7XHJcbiAgICBpZiAoYS5oYXNPd25Qcm9wZXJ0eShpKSkge1xyXG4gICAgICBpZiAoIWVxKGFbaV0sIGJbaV0pKSB7IHJldHVybiBmYWxzZTsgfVxyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gdHJ1ZTtcclxufVxyXG4iXX0=