"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Like the Lodash _.every function, this function takes an array and a
 * predicate function and returns true or false depending on whether the
 * predicate is true for every item in the array.
 *
 * @export
 * @param {any[]} array
 * @param {(member: any, index: number) => boolean} predicate
 * @returns {boolean}
 */
function every(array, predicate) {
    var index = -1;
    var length = array.length;
    while (++index < length) {
        if (!predicate(array[index], index)) {
            return false;
        }
    }
    return true;
}
exports.every = every;
/**
 * Like the Lodash _.some function, this function takes an array and a predicate
 * function and returns true or false depending on whether the predicate is true
 * for any of the items in the array.
 *
 * @export
 * @param {any[]} array
 * @param {(member: any, index: number) => boolean} predicate
 * @returns {boolean}
 */
function some(array, predicate) {
    var index = -1;
    var length = array.length;
    while (++index < length) {
        if (predicate(array[index], index)) {
            return true;
        }
    }
    return false;
}
exports.some = some;
/**
 * This function is similar to Array.prototype.find, but it returns the result
 * of calling the value function rather than an item of the array.
 *
 * @export
 * @param {any[]} array
 * @param {(member: any, index: number) => any} valueFn
 * @returns {*} the first result of `valueFn` that returned true or undefined
 */
function firstResult(array, valueFn) {
    var index = -1;
    var length = array.length;
    while (++index < length) {
        var result = valueFn(array[index], index);
        if (result) {
            return result;
        }
    }
}
exports.firstResult = firstResult;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJyYXlzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3JjL2FycmF5cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxBQVNHOzs7Ozs7Ozs7O0FBQ0gsZUFBc0IsQUFBWSxPQUFFLEFBQWtEO0FBQ3BGLFFBQUksQUFBSyxRQUFXLENBQUMsQUFBQyxBQUFDO0FBQ3ZCLFFBQUksQUFBTSxTQUFXLEFBQUssTUFBQyxBQUFNLEFBQUM7QUFFbEMsV0FBTyxFQUFFLEFBQUssUUFBRyxBQUFNLFFBQUUsQUFBQztBQUN4QixBQUFFLEFBQUMsWUFBQyxDQUFDLEFBQVMsVUFBQyxBQUFLLE1BQUMsQUFBSyxBQUFDLFFBQUUsQUFBSyxBQUFDLEFBQUMsUUFBQyxBQUFDO0FBQ3BDLEFBQU0sbUJBQUMsQUFBSyxBQUFDLEFBQ2Y7QUFBQyxBQUNIO0FBQUM7QUFFRCxBQUFNLFdBQUMsQUFBSSxBQUFDLEFBQ2Q7QUFBQztBQVhELGdCQVdDO0FBRUQsQUFTRzs7Ozs7Ozs7OztBQUNILGNBQXFCLEFBQVksT0FBRSxBQUFrRDtBQUNuRixRQUFJLEFBQUssUUFBVyxDQUFDLEFBQUMsQUFBQztBQUN2QixRQUFJLEFBQU0sU0FBVyxBQUFLLE1BQUMsQUFBTSxBQUFDO0FBRWxDLFdBQU8sRUFBRSxBQUFLLFFBQUcsQUFBTSxRQUFFLEFBQUM7QUFDeEIsQUFBRSxBQUFDLFlBQUMsQUFBUyxVQUFDLEFBQUssTUFBQyxBQUFLLEFBQUMsUUFBRSxBQUFLLEFBQUMsQUFBQyxRQUFDLEFBQUM7QUFDbkMsQUFBTSxtQkFBQyxBQUFJLEFBQUMsQUFDZDtBQUFDLEFBQ0g7QUFBQztBQUVELEFBQU0sV0FBQyxBQUFLLEFBQUMsQUFDZjtBQUFDO0FBWEQsZUFXQztBQUVELEFBUUc7Ozs7Ozs7OztBQUNILHFCQUE0QixBQUFZLE9BQUUsQUFBNEM7QUFDcEYsUUFBSSxBQUFLLFFBQVcsQ0FBQyxBQUFDLEFBQUM7QUFDdkIsUUFBSSxBQUFNLFNBQVcsQUFBSyxNQUFDLEFBQU0sQUFBQztBQUVsQyxXQUFPLEVBQUUsQUFBSyxRQUFHLEFBQU0sUUFBRSxBQUFDO0FBQ3hCLFlBQUksQUFBTSxTQUFHLEFBQU8sUUFBQyxBQUFLLE1BQUMsQUFBSyxBQUFDLFFBQUUsQUFBSyxBQUFDLEFBQUM7QUFDMUMsQUFBRSxBQUFDLFlBQUMsQUFBTSxBQUFDLFFBQUMsQUFBQztBQUNYLEFBQU0sbUJBQUMsQUFBTSxBQUFDLEFBQ2hCO0FBQUMsQUFDSDtBQUFDLEFBQ0g7QUFBQztBQVZELHNCQVVDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIExpa2UgdGhlIExvZGFzaCBfLmV2ZXJ5IGZ1bmN0aW9uLCB0aGlzIGZ1bmN0aW9uIHRha2VzIGFuIGFycmF5IGFuZCBhXHJcbiAqIHByZWRpY2F0ZSBmdW5jdGlvbiBhbmQgcmV0dXJucyB0cnVlIG9yIGZhbHNlIGRlcGVuZGluZyBvbiB3aGV0aGVyIHRoZVxyXG4gKiBwcmVkaWNhdGUgaXMgdHJ1ZSBmb3IgZXZlcnkgaXRlbSBpbiB0aGUgYXJyYXkuXHJcbiAqIFxyXG4gKiBAZXhwb3J0XHJcbiAqIEBwYXJhbSB7YW55W119IGFycmF5IFxyXG4gKiBAcGFyYW0geyhtZW1iZXI6IGFueSwgaW5kZXg6IG51bWJlcikgPT4gYm9vbGVhbn0gcHJlZGljYXRlIFxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZXZlcnkoYXJyYXk6IGFueVtdLCBwcmVkaWNhdGU6IChtZW1iZXI6IGFueSwgaW5kZXg6IG51bWJlcikgPT4gYm9vbGVhbik6IGJvb2xlYW4ge1xyXG4gIGxldCBpbmRleDogbnVtYmVyID0gLTE7XHJcbiAgbGV0IGxlbmd0aDogbnVtYmVyID0gYXJyYXkubGVuZ3RoO1xyXG5cclxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xyXG4gICAgaWYgKCFwcmVkaWNhdGUoYXJyYXlbaW5kZXhdLCBpbmRleCkpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHRydWU7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBMaWtlIHRoZSBMb2Rhc2ggXy5zb21lIGZ1bmN0aW9uLCB0aGlzIGZ1bmN0aW9uIHRha2VzIGFuIGFycmF5IGFuZCBhIHByZWRpY2F0ZVxyXG4gKiBmdW5jdGlvbiBhbmQgcmV0dXJucyB0cnVlIG9yIGZhbHNlIGRlcGVuZGluZyBvbiB3aGV0aGVyIHRoZSBwcmVkaWNhdGUgaXMgdHJ1ZVxyXG4gKiBmb3IgYW55IG9mIHRoZSBpdGVtcyBpbiB0aGUgYXJyYXkuXHJcbiAqIFxyXG4gKiBAZXhwb3J0XHJcbiAqIEBwYXJhbSB7YW55W119IGFycmF5IFxyXG4gKiBAcGFyYW0geyhtZW1iZXI6IGFueSwgaW5kZXg6IG51bWJlcikgPT4gYm9vbGVhbn0gcHJlZGljYXRlIFxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gc29tZShhcnJheTogYW55W10sIHByZWRpY2F0ZTogKG1lbWJlcjogYW55LCBpbmRleDogbnVtYmVyKSA9PiBib29sZWFuKTogYm9vbGVhbiB7XHJcbiAgbGV0IGluZGV4OiBudW1iZXIgPSAtMTtcclxuICBsZXQgbGVuZ3RoOiBudW1iZXIgPSBhcnJheS5sZW5ndGg7XHJcblxyXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XHJcbiAgICBpZiAocHJlZGljYXRlKGFycmF5W2luZGV4XSwgaW5kZXgpKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG4vKipcclxuICogVGhpcyBmdW5jdGlvbiBpcyBzaW1pbGFyIHRvIEFycmF5LnByb3RvdHlwZS5maW5kLCBidXQgaXQgcmV0dXJucyB0aGUgcmVzdWx0XHJcbiAqIG9mIGNhbGxpbmcgdGhlIHZhbHVlIGZ1bmN0aW9uIHJhdGhlciB0aGFuIGFuIGl0ZW0gb2YgdGhlIGFycmF5LlxyXG4gKiBcclxuICogQGV4cG9ydFxyXG4gKiBAcGFyYW0ge2FueVtdfSBhcnJheSBcclxuICogQHBhcmFtIHsobWVtYmVyOiBhbnksIGluZGV4OiBudW1iZXIpID0+IGFueX0gdmFsdWVGbiBcclxuICogQHJldHVybnMgeyp9IHRoZSBmaXJzdCByZXN1bHQgb2YgYHZhbHVlRm5gIHRoYXQgcmV0dXJuZWQgdHJ1ZSBvciB1bmRlZmluZWRcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBmaXJzdFJlc3VsdChhcnJheTogYW55W10sIHZhbHVlRm46IChtZW1iZXI6IGFueSwgaW5kZXg6IG51bWJlcikgPT4gYW55KTogYW55IHtcclxuICBsZXQgaW5kZXg6IG51bWJlciA9IC0xO1xyXG4gIGxldCBsZW5ndGg6IG51bWJlciA9IGFycmF5Lmxlbmd0aDtcclxuXHJcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcclxuICAgIGxldCByZXN1bHQgPSB2YWx1ZUZuKGFycmF5W2luZGV4XSwgaW5kZXgpO1xyXG4gICAgaWYgKHJlc3VsdCkge1xyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXX0=