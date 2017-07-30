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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzcmMvZXEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLEFBQW9EOzs7QUFFcEQsQUFhRzs7Ozs7Ozs7Ozs7Ozs7QUFDSCxZQUFtQixBQUFNLEdBQUUsQUFBTTtBQUMvQixBQUFzRDtBQUN0RCxBQUFxRjtBQUNyRixBQUFFO0FBQ0YsQUFBb0U7QUFFcEUsQUFBc0U7QUFDdEUsQUFBMEY7QUFDMUYsQUFBRSxBQUFDLFFBQUMsQUFBQyxNQUFLLEFBQUMsQUFBQyxHQUFDLEFBQUM7QUFBQyxBQUFNLGVBQUMsQUFBQyxNQUFLLEFBQUMsS0FBSSxBQUFDLElBQUcsQUFBQyxLQUFJLEFBQUMsSUFBRyxBQUFDLEFBQUMsQUFBQztBQUFDO0FBQ2xELEFBQWdFO0FBQ2hFLEFBQUUsQUFBQyxRQUFDLEFBQUMsS0FBSSxBQUFJLFFBQUksQUFBQyxLQUFJLEFBQUksQUFBQyxNQUFDLEFBQUM7QUFBQyxBQUFNLGVBQUMsQUFBQyxNQUFLLEFBQUMsQUFBQyxBQUFDO0FBQUM7QUFFL0MsUUFBSSxBQUFJLE9BQUcsQUFBTSxPQUFDLEFBQVMsVUFBQyxBQUFRLFNBQUMsQUFBSSxLQUFDLEFBQUMsQUFBQyxBQUFDO0FBQzdDLEFBQUUsQUFBQyxRQUFDLEFBQUksU0FBSyxBQUFNLE9BQUMsQUFBUyxVQUFDLEFBQVEsU0FBQyxBQUFJLEtBQUMsQUFBQyxBQUFDLEFBQUMsSUFBQyxBQUFDO0FBQUMsQUFBTSxlQUFDLEFBQUssQUFBQyxBQUFDO0FBQUM7QUFFakUsQUFBTSxBQUFDLFlBQUMsQUFBSSxBQUFDLEFBQUMsQUFBQztBQUNiLGFBQUssQUFBaUI7QUFDcEIsQUFBTSxtQkFBQyxBQUFDLEtBQUksQUFBTSxPQUFDLEFBQUMsQUFBQyxBQUFDO0FBQ3hCLGFBQUssQUFBaUI7QUFDcEIsQUFBa0Y7QUFDbEYsQUFBd0I7QUFDeEIsQUFBTSxtQkFBQyxBQUFDLEtBQUksQ0FBQyxBQUFDLElBQUcsQUFBQyxLQUFJLENBQUMsQUFBQyxBQUFHLElBQUMsQUFBQyxLQUFJLEFBQUMsSUFBRyxBQUFDLElBQUcsQUFBQyxLQUFJLEFBQUMsSUFBRyxBQUFDLElBQUcsQUFBQyxLQUFJLENBQUMsQUFBQyxBQUFDLEFBQUM7QUFDakUsYUFBSyxBQUFlLEFBQUM7QUFDckIsYUFBSyxBQUFrQjtBQUNyQixBQUFxRjtBQUNyRixBQUF3RjtBQUN4RixBQUErQjtBQUMvQixBQUFNLG1CQUFDLENBQUMsQUFBQyxLQUFJLENBQUMsQUFBQyxBQUFDO0FBQ2xCLEFBQTJEO0FBQzNELGFBQUssQUFBaUI7QUFDcEIsQUFBTSxtQkFBQyxBQUFDLEVBQUMsQUFBTSxVQUFJLEFBQUMsRUFBQyxBQUFNLFVBQ3BCLEFBQUMsRUFBQyxBQUFNLFVBQUksQUFBQyxFQUFDLEFBQU0sVUFDcEIsQUFBQyxFQUFDLEFBQVMsYUFBSSxBQUFDLEVBQUMsQUFBUyxhQUMxQixBQUFDLEVBQUMsQUFBVSxjQUFJLEFBQUMsRUFBQyxBQUFVLEFBQUMsQUFDeEMsQUFBQzs7QUFDRCxBQUFFLEFBQUMsUUFBQyxPQUFPLEFBQUMsS0FBSSxBQUFRLFlBQUksT0FBTyxBQUFDLEtBQUksQUFBUSxBQUFDLFVBQUMsQUFBQztBQUFDLEFBQU0sZUFBQyxBQUFLLEFBQUMsQUFBQztBQUFDO0FBRW5FLEFBQUUsQUFBQyxRQUFDLEFBQUksU0FBSyxBQUFnQixBQUFDLGtCQUFDLEFBQUM7QUFDOUIsQUFBRSxBQUFDLFlBQUMsQUFBQyxFQUFDLEFBQU0sV0FBSyxBQUFDLEVBQUMsQUFBTSxBQUFDLFFBQUMsQUFBQztBQUFDLEFBQU0sbUJBQUMsQUFBSyxBQUFDLEFBQUM7QUFBQyxBQUM5QztBQUFDO0FBRUQsUUFBSSxBQUFDLEFBQUM7QUFDTixBQUFHLEFBQUMsU0FBQyxBQUFDLEtBQUksQUFBQyxBQUFDLEdBQUMsQUFBQztBQUNaLEFBQUUsQUFBQyxZQUFDLEFBQUMsRUFBQyxBQUFjLGVBQUMsQUFBQyxBQUFDLEFBQUMsSUFBQyxBQUFDO0FBQ3hCLEFBQUUsQUFBQyxnQkFBQyxDQUFDLEFBQUUsR0FBQyxBQUFDLEVBQUMsQUFBQyxBQUFDLElBQUUsQUFBQyxFQUFDLEFBQUMsQUFBQyxBQUFDLEFBQUMsS0FBQyxBQUFDO0FBQUMsQUFBTSx1QkFBQyxBQUFLLEFBQUMsQUFBQztBQUFDLEFBQ3hDO0FBQUMsQUFDSDtBQUFDO0FBQ0QsQUFBRyxBQUFDLFNBQUMsQUFBQyxLQUFJLEFBQUMsQUFBQyxHQUFDLEFBQUM7QUFDWixBQUFFLEFBQUMsWUFBQyxBQUFDLEVBQUMsQUFBYyxlQUFDLEFBQUMsQUFBQyxBQUFDLElBQUMsQUFBQztBQUN4QixBQUFFLEFBQUMsZ0JBQUMsQ0FBQyxBQUFFLEdBQUMsQUFBQyxFQUFDLEFBQUMsQUFBQyxJQUFFLEFBQUMsRUFBQyxBQUFDLEFBQUMsQUFBQyxBQUFDLEtBQUMsQUFBQztBQUFDLEFBQU0sdUJBQUMsQUFBSyxBQUFDLEFBQUM7QUFBQyxBQUN4QztBQUFDLEFBQ0g7QUFBQztBQUNELEFBQU0sV0FBQyxBQUFJLEFBQUMsQUFDZDtBQUFDO0FBckRELGFBcURDIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgZXFlcWVxLCBuby1lcS1udWxsLCB2YWxpZC1qc2RvYyAqL1xyXG5cclxuLyoqXHJcbiAqIGBlcWAgY2hlY2tzIHRoZSBlcXVhbGl0eSBvZiB0d28gb2JqZWN0cy5cclxuICpcclxuICogVGhlIHByb3BlcnRpZXMgYmVsb25naW5nIHRvIG9iamVjdHMgKGJ1dCBub3QgdGhlaXIgcHJvdG90eXBlcykgd2lsbCBiZVxyXG4gKiB0cmF2ZXJzZWQgZGVlcGx5IGFuZCBjb21wYXJlZC5cclxuICpcclxuICogSW5jbHVkZXMgc3BlY2lhbCBoYW5kbGluZyBmb3Igc3RyaW5ncywgbnVtYmVycywgZGF0ZXMsIGJvb2xlYW5zLCByZWdleGVzLCBhbmRcclxuICogYXJyYXlzXHJcbiAqIFxyXG4gKiBAZXhwb3J0XHJcbiAqIEBwYXJhbSB7Kn0gYSBcclxuICogQHBhcmFtIHsqfSBiIFxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gYXJlIGBhYCBhbmQgYGJgIGVxdWFsP1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGVxKGE6IGFueSwgYjogYW55KTogYm9vbGVhbiB7XHJcbiAgLy8gU29tZSBlbGVtZW50cyBvZiB0aGlzIGZ1bmN0aW9uIGNvbWUgZnJvbSB1bmRlcnNjb3JlXHJcbiAgLy8gKGMpIDIwMDktMjAxMyBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xyXG4gIC8vXHJcbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2phc2hrZW5hcy91bmRlcnNjb3JlL2Jsb2IvbWFzdGVyL3VuZGVyc2NvcmUuanNcclxuXHJcbiAgLy8gSWRlbnRpY2FsIG9iamVjdHMgYXJlIGVxdWFsLiBgMCA9PT0gLTBgLCBidXQgdGhleSBhcmVuJ3QgaWRlbnRpY2FsLlxyXG4gIC8vIFNlZSB0aGUgW0hhcm1vbnkgYGVnYWxgIHByb3Bvc2FsXShodHRwOi8vd2lraS5lY21hc2NyaXB0Lm9yZy9kb2t1LnBocD9pZD1oYXJtb255OmVnYWwpLlxyXG4gIGlmIChhID09PSBiKSB7IHJldHVybiBhICE9PSAwIHx8IDEgLyBhID09IDEgLyBiOyB9XHJcbiAgLy8gQSBzdHJpY3QgY29tcGFyaXNvbiBpcyBuZWNlc3NhcnkgYmVjYXVzZSBgbnVsbCA9PSB1bmRlZmluZWRgLlxyXG4gIGlmIChhID09IG51bGwgfHwgYiA9PSBudWxsKSB7IHJldHVybiBhID09PSBiOyB9XHJcblxyXG4gIHZhciB0eXBlID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGEpO1xyXG4gIGlmICh0eXBlICE9PSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYikpIHsgcmV0dXJuIGZhbHNlOyB9XHJcblxyXG4gIHN3aXRjaCAodHlwZSkge1xyXG4gICAgY2FzZSAnW29iamVjdCBTdHJpbmddJzpcclxuICAgICAgcmV0dXJuIGEgPT0gU3RyaW5nKGIpO1xyXG4gICAgY2FzZSAnW29iamVjdCBOdW1iZXJdJzpcclxuICAgICAgLy8gYE5hTmBzIGFyZSBlcXVpdmFsZW50LCBidXQgbm9uLXJlZmxleGl2ZS4gQW4gYGVnYWxgIGNvbXBhcmlzb24gaXMgcGVyZm9ybWVkIGZvclxyXG4gICAgICAvLyBvdGhlciBudW1lcmljIHZhbHVlcy5cclxuICAgICAgcmV0dXJuIGEgIT0gK2EgPyBiICE9ICtiIDogKGEgPT0gMCA/IDEgLyBhID09IDEgLyBiIDogYSA9PSArYik7XHJcbiAgICBjYXNlICdbb2JqZWN0IERhdGVdJzpcclxuICAgIGNhc2UgJ1tvYmplY3QgQm9vbGVhbl0nOlxyXG4gICAgICAvLyBDb2VyY2UgZGF0ZXMgYW5kIGJvb2xlYW5zIHRvIG51bWVyaWMgcHJpbWl0aXZlIHZhbHVlcy4gRGF0ZXMgYXJlIGNvbXBhcmVkIGJ5IHRoZWlyXHJcbiAgICAgIC8vIG1pbGxpc2Vjb25kIHJlcHJlc2VudGF0aW9ucy4gTm90ZSB0aGF0IGludmFsaWQgZGF0ZXMgd2l0aCBtaWxsaXNlY29uZCByZXByZXNlbnRhdGlvbnNcclxuICAgICAgLy8gb2YgYE5hTmAgYXJlIG5vdCBlcXVpdmFsZW50LlxyXG4gICAgICByZXR1cm4gK2EgPT0gK2I7XHJcbiAgICAvLyBSZWdFeHBzIGFyZSBjb21wYXJlZCBieSB0aGVpciBzb3VyY2UgcGF0dGVybnMgYW5kIGZsYWdzLlxyXG4gICAgY2FzZSAnW29iamVjdCBSZWdFeHBdJzpcclxuICAgICAgcmV0dXJuIGEuc291cmNlID09IGIuc291cmNlICYmXHJcbiAgICAgICAgICAgICBhLmdsb2JhbCA9PSBiLmdsb2JhbCAmJlxyXG4gICAgICAgICAgICAgYS5tdWx0aWxpbmUgPT0gYi5tdWx0aWxpbmUgJiZcclxuICAgICAgICAgICAgIGEuaWdub3JlQ2FzZSA9PSBiLmlnbm9yZUNhc2U7XHJcbiAgfVxyXG4gIGlmICh0eXBlb2YgYSAhPSAnb2JqZWN0JyB8fCB0eXBlb2YgYiAhPSAnb2JqZWN0JykgeyByZXR1cm4gZmFsc2U7IH1cclxuXHJcbiAgaWYgKHR5cGUgPT09ICdbb2JqZWN0IEFycmF5XScpIHtcclxuICAgIGlmIChhLmxlbmd0aCAhPT0gYi5sZW5ndGgpIHsgcmV0dXJuIGZhbHNlOyB9XHJcbiAgfVxyXG5cclxuICB2YXIgaTtcclxuICBmb3IgKGkgaW4gYikge1xyXG4gICAgaWYgKGIuaGFzT3duUHJvcGVydHkoaSkpIHtcclxuICAgICAgaWYgKCFlcShhW2ldLCBiW2ldKSkgeyByZXR1cm4gZmFsc2U7IH1cclxuICAgIH1cclxuICB9XHJcbiAgZm9yIChpIGluIGEpIHtcclxuICAgIGlmIChhLmhhc093blByb3BlcnR5KGkpKSB7XHJcbiAgICAgIGlmICghZXEoYVtpXSwgYltpXSkpIHsgcmV0dXJuIGZhbHNlOyB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiB0cnVlO1xyXG59XHJcbiJdfQ==