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
            return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
        case '[object Date]':
        case '[object Boolean]':
            // Coerce dates and booleans to numeric primitive values. Dates are compared by their
            // millisecond representations. Note that invalid dates with millisecond representations
            // of `NaN` are not equivalent.
            return +a == +b;
        // RegExps are compared by their source patterns and flags.
        case '[object RegExp]':
            return a.source == b.source &&
                a.global == b.global &&
                a.multiline == b.multiline &&
                a.ignoreCase == b.ignoreCase;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzcmMvZXEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLG9EQUFvRDs7QUFFcEQ7Ozs7Ozs7Ozs7Ozs7R0FhRztBQUNILFlBQW1CLENBQU0sRUFBRSxDQUFNO0lBQy9CLHNEQUFzRDtJQUN0RCxxRkFBcUY7SUFDckYsRUFBRTtJQUNGLG9FQUFvRTtJQUVwRSxzRUFBc0U7SUFDdEUsMEZBQTBGO0lBQzFGLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQUMsQ0FBQztJQUNsRCxnRUFBZ0U7SUFDaEUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztRQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQUMsQ0FBQztJQUUvQyxJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDN0MsRUFBRSxDQUFDLENBQUMsSUFBSSxLQUFLLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFBQyxNQUFNLENBQUMsS0FBSyxDQUFDO0lBQUMsQ0FBQztJQUVqRSxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2IsS0FBSyxpQkFBaUI7WUFDcEIsTUFBTSxDQUFDLENBQUMsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEIsS0FBSyxpQkFBaUI7WUFDcEIsa0ZBQWtGO1lBQ2xGLHdCQUF3QjtZQUN4QixNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pFLEtBQUssZUFBZSxDQUFDO1FBQ3JCLEtBQUssa0JBQWtCO1lBQ3JCLHFGQUFxRjtZQUNyRix3RkFBd0Y7WUFDeEYsK0JBQStCO1lBQy9CLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNsQiwyREFBMkQ7UUFDM0QsS0FBSyxpQkFBaUI7WUFDcEIsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLE1BQU07Z0JBQ3BCLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLE1BQU07Z0JBQ3BCLENBQUMsQ0FBQyxTQUFTLElBQUksQ0FBQyxDQUFDLFNBQVM7Z0JBQzFCLENBQUMsQ0FBQyxVQUFVLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQztJQUN4QyxDQUFDO0lBQ0QsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksUUFBUSxJQUFJLE9BQU8sQ0FBQyxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFBQyxNQUFNLENBQUMsS0FBSyxDQUFDO0lBQUMsQ0FBQztJQUVuRSxFQUFFLENBQUMsQ0FBQyxJQUFJLEtBQUssZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO1FBQzlCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQUMsQ0FBQztJQUM5QyxDQUFDO0lBRUQsSUFBSSxDQUFDLENBQUM7SUFDTixHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNaLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUFDLENBQUM7UUFDeEMsQ0FBQztJQUNILENBQUM7SUFDRCxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNaLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUFDLENBQUM7UUFDeEMsQ0FBQztJQUNILENBQUM7SUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQXJERCxnQkFxREMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSBlcWVxZXEsIG5vLWVxLW51bGwsIHZhbGlkLWpzZG9jICovXHJcblxyXG4vKipcclxuICogYGVxYCBjaGVja3MgdGhlIGVxdWFsaXR5IG9mIHR3byBvYmplY3RzLlxyXG4gKlxyXG4gKiBUaGUgcHJvcGVydGllcyBiZWxvbmdpbmcgdG8gb2JqZWN0cyAoYnV0IG5vdCB0aGVpciBwcm90b3R5cGVzKSB3aWxsIGJlXHJcbiAqIHRyYXZlcnNlZCBkZWVwbHkgYW5kIGNvbXBhcmVkLlxyXG4gKlxyXG4gKiBJbmNsdWRlcyBzcGVjaWFsIGhhbmRsaW5nIGZvciBzdHJpbmdzLCBudW1iZXJzLCBkYXRlcywgYm9vbGVhbnMsIHJlZ2V4ZXMsIGFuZFxyXG4gKiBhcnJheXNcclxuICogXHJcbiAqIEBleHBvcnRcclxuICogQHBhcmFtIHsqfSBhIFxyXG4gKiBAcGFyYW0geyp9IGIgXHJcbiAqIEByZXR1cm5zIHtib29sZWFufSBhcmUgYGFgIGFuZCBgYmAgZXF1YWw/XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZXEoYTogYW55LCBiOiBhbnkpOiBib29sZWFuIHtcclxuICAvLyBTb21lIGVsZW1lbnRzIG9mIHRoaXMgZnVuY3Rpb24gY29tZSBmcm9tIHVuZGVyc2NvcmVcclxuICAvLyAoYykgMjAwOS0yMDEzIEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXHJcbiAgLy9cclxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vamFzaGtlbmFzL3VuZGVyc2NvcmUvYmxvYi9tYXN0ZXIvdW5kZXJzY29yZS5qc1xyXG5cclxuICAvLyBJZGVudGljYWwgb2JqZWN0cyBhcmUgZXF1YWwuIGAwID09PSAtMGAsIGJ1dCB0aGV5IGFyZW4ndCBpZGVudGljYWwuXHJcbiAgLy8gU2VlIHRoZSBbSGFybW9ueSBgZWdhbGAgcHJvcG9zYWxdKGh0dHA6Ly93aWtpLmVjbWFzY3JpcHQub3JnL2Rva3UucGhwP2lkPWhhcm1vbnk6ZWdhbCkuXHJcbiAgaWYgKGEgPT09IGIpIHsgcmV0dXJuIGEgIT09IDAgfHwgMSAvIGEgPT0gMSAvIGI7IH1cclxuICAvLyBBIHN0cmljdCBjb21wYXJpc29uIGlzIG5lY2Vzc2FyeSBiZWNhdXNlIGBudWxsID09IHVuZGVmaW5lZGAuXHJcbiAgaWYgKGEgPT0gbnVsbCB8fCBiID09IG51bGwpIHsgcmV0dXJuIGEgPT09IGI7IH1cclxuXHJcbiAgdmFyIHR5cGUgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYSk7XHJcbiAgaWYgKHR5cGUgIT09IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChiKSkgeyByZXR1cm4gZmFsc2U7IH1cclxuXHJcbiAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICBjYXNlICdbb2JqZWN0IFN0cmluZ10nOlxyXG4gICAgICByZXR1cm4gYSA9PSBTdHJpbmcoYik7XHJcbiAgICBjYXNlICdbb2JqZWN0IE51bWJlcl0nOlxyXG4gICAgICAvLyBgTmFOYHMgYXJlIGVxdWl2YWxlbnQsIGJ1dCBub24tcmVmbGV4aXZlLiBBbiBgZWdhbGAgY29tcGFyaXNvbiBpcyBwZXJmb3JtZWQgZm9yXHJcbiAgICAgIC8vIG90aGVyIG51bWVyaWMgdmFsdWVzLlxyXG4gICAgICByZXR1cm4gYSAhPSArYSA/IGIgIT0gK2IgOiAoYSA9PSAwID8gMSAvIGEgPT0gMSAvIGIgOiBhID09ICtiKTtcclxuICAgIGNhc2UgJ1tvYmplY3QgRGF0ZV0nOlxyXG4gICAgY2FzZSAnW29iamVjdCBCb29sZWFuXSc6XHJcbiAgICAgIC8vIENvZXJjZSBkYXRlcyBhbmQgYm9vbGVhbnMgdG8gbnVtZXJpYyBwcmltaXRpdmUgdmFsdWVzLiBEYXRlcyBhcmUgY29tcGFyZWQgYnkgdGhlaXJcclxuICAgICAgLy8gbWlsbGlzZWNvbmQgcmVwcmVzZW50YXRpb25zLiBOb3RlIHRoYXQgaW52YWxpZCBkYXRlcyB3aXRoIG1pbGxpc2Vjb25kIHJlcHJlc2VudGF0aW9uc1xyXG4gICAgICAvLyBvZiBgTmFOYCBhcmUgbm90IGVxdWl2YWxlbnQuXHJcbiAgICAgIHJldHVybiArYSA9PSArYjtcclxuICAgIC8vIFJlZ0V4cHMgYXJlIGNvbXBhcmVkIGJ5IHRoZWlyIHNvdXJjZSBwYXR0ZXJucyBhbmQgZmxhZ3MuXHJcbiAgICBjYXNlICdbb2JqZWN0IFJlZ0V4cF0nOlxyXG4gICAgICByZXR1cm4gYS5zb3VyY2UgPT0gYi5zb3VyY2UgJiZcclxuICAgICAgICAgICAgIGEuZ2xvYmFsID09IGIuZ2xvYmFsICYmXHJcbiAgICAgICAgICAgICBhLm11bHRpbGluZSA9PSBiLm11bHRpbGluZSAmJlxyXG4gICAgICAgICAgICAgYS5pZ25vcmVDYXNlID09IGIuaWdub3JlQ2FzZTtcclxuICB9XHJcbiAgaWYgKHR5cGVvZiBhICE9ICdvYmplY3QnIHx8IHR5cGVvZiBiICE9ICdvYmplY3QnKSB7IHJldHVybiBmYWxzZTsgfVxyXG5cclxuICBpZiAodHlwZSA9PT0gJ1tvYmplY3QgQXJyYXldJykge1xyXG4gICAgaWYgKGEubGVuZ3RoICE9PSBiLmxlbmd0aCkgeyByZXR1cm4gZmFsc2U7IH1cclxuICB9XHJcblxyXG4gIHZhciBpO1xyXG4gIGZvciAoaSBpbiBiKSB7XHJcbiAgICBpZiAoYi5oYXNPd25Qcm9wZXJ0eShpKSkge1xyXG4gICAgICBpZiAoIWVxKGFbaV0sIGJbaV0pKSB7IHJldHVybiBmYWxzZTsgfVxyXG4gICAgfVxyXG4gIH1cclxuICBmb3IgKGkgaW4gYSkge1xyXG4gICAgaWYgKGEuaGFzT3duUHJvcGVydHkoaSkpIHtcclxuICAgICAgaWYgKCFlcShhW2ldLCBiW2ldKSkgeyByZXR1cm4gZmFsc2U7IH1cclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIHRydWU7XHJcbn1cclxuIl19