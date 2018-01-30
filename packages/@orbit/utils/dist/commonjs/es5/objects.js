"use strict";
/* eslint-disable valid-jsdoc */

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Clones a value. If the value is an object, a deeply nested clone will be
 * created.
 *
 * Traverses all object properties (but not prototype properties).
 *
 * @export
 * @param {*} obj
 * @returns {*} Clone of the input `obj`
 */
function clone(obj) {
    if (obj === undefined || obj === null || typeof obj !== 'object') {
        return obj;
    }
    var dup;
    var type = Object.prototype.toString.call(obj);
    if (type === '[object Date]') {
        dup = new Date();
        dup.setTime(obj.getTime());
    } else if (type === '[object RegExp]') {
        dup = obj.constructor(obj);
    } else if (type === '[object Array]') {
        dup = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            if (obj.hasOwnProperty(i)) {
                dup.push(clone(obj[i]));
            }
        }
    } else {
        var val = void 0;
        dup = {};
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                val = obj[key];
                if (typeof val === 'object') {
                    val = clone(val);
                }
                dup[key] = val;
            }
        }
    }
    return dup;
}
exports.clone = clone;
/**
 * Expose properties and methods from one object on another.
 *
 * Methods will be called on `source` and will maintain `source` as the context.
 *
 * @export
 * @param {*} destination
 * @param {*} source
 */
function expose(destination, source) {
    var properties;
    if (arguments.length > 2) {
        properties = Array.prototype.slice.call(arguments, 2);
    } else {
        properties = Object.keys(source);
    }
    properties.forEach(function (p) {
        if (typeof source[p] === 'function') {
            destination[p] = function () {
                return source[p].apply(source, arguments);
            };
        } else {
            destination[p] = source[p];
        }
    });
}
exports.expose = expose;
/**
 * Extend an object with the properties of one or more other objects.
 *
 * @export
 * @param {*} destination
 * @param {...any[]} sources
 * @returns {any}
 */
function extend(destination) {
    var sources = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        sources[_i - 1] = arguments[_i];
    }
    sources.forEach(function (source) {
        for (var p in source) {
            if (source.hasOwnProperty(p)) {
                destination[p] = source[p];
            }
        }
    });
    return destination;
}
exports.extend = extend;
/**
 * Checks whether an object is an instance of an `Array`
 *
 * @export
 * @param {*} obj
 * @returns {boolean}
 */
function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}
exports.isArray = isArray;
/**
 * Converts an object to an `Array` if it's not already.
 *
 * @export
 * @param {*} obj
 * @returns {any[]}
 */
function toArray(obj) {
    if (isNone(obj)) {
        return [];
    } else {
        return isArray(obj) ? obj : [obj];
    }
}
exports.toArray = toArray;
/**
 * Checks whether a value is a non-null object
 *
 * @export
 * @param {*} obj
 * @returns {boolean}
 */
function isObject(obj) {
    return obj !== null && typeof obj === 'object';
}
exports.isObject = isObject;
/**
 * Checks whether an object is null or undefined
 *
 * @export
 * @param {*} obj
 * @returns {boolean}
 */
function isNone(obj) {
    return obj === undefined || obj === null;
}
exports.isNone = isNone;
/**
 * Merges properties from other objects into a base object. Properties that
 * resolve to `undefined` will not overwrite properties on the base object
 * that already exist.
 *
 * @export
 * @param {*} base
 * @param {...any[]} sources
 * @returns {*}
 */
function merge(object) {
    var sources = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        sources[_i - 1] = arguments[_i];
    }
    sources.forEach(function (source) {
        Object.keys(source).forEach(function (field) {
            if (source.hasOwnProperty(field)) {
                var value = source[field];
                if (!(value === undefined && object[field] !== undefined)) {
                    object[field] = value;
                }
            }
        });
    });
    return object;
}
exports.merge = merge;
/**
 * Retrieves a value from a nested path on an object.
 *
 * Returns any falsy value encountered while traversing the path.
 *
 * @export
 * @param {*} obj
 * @param {string[]} path
 * @returns {*}
 */
function deepGet(obj, path) {
    var index = -1;
    var result = obj;
    while (++index < path.length) {
        result = result[path[index]];
        if (!result) {
            return result;
        }
    }
    return result;
}
exports.deepGet = deepGet;
/**
 * Sets a value on an object at a nested path.
 *
 * This function will create objects along the path if necessary to allow
 * setting a deeply nested value.
 *
 * Returns `false` only if the current value is already strictly equal to the
 * requested `value` argument. Otherwise returns `true`.
 *
 * @export
 * @param {*} obj
 * @param {string[]} path
 * @param {*} value
 * @returns {boolean} was the value was actually changed?
 */
function deepSet(obj, path, value) {
    var ptr = obj;
    var prop = path.pop();
    var segment;
    for (var i = 0, l = path.length; i < l; i++) {
        segment = path[i];
        if (ptr[segment] === undefined) {
            ptr[segment] = typeof segment === 'number' ? [] : {};
        }
        ptr = ptr[segment];
    }
    if (ptr[prop] === value) {
        return false;
    } else {
        ptr[prop] = value;
        return true;
    }
}
exports.deepSet = deepSet;
/**
 * Find an array of values that correspond to the keys of an object.
 *
 * This is a ponyfill for `Object.values`, which is still experimental.
 *
 * @export
 * @param {*} obj
 * @returns {any[]}
 */
function objectValues(obj) {
    if (Object.values) {
        return Object.values(obj);
    } else {
        return Object.keys(obj).map(function (k) {
            return obj[k];
        });
    }
}
exports.objectValues = objectValues;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2JqZWN0cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNyYy9vYmplY3RzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxBQUFnQzs7O0FBRWhDLEFBU0c7Ozs7Ozs7Ozs7QUFDSCxlQUFzQixBQUFRLEtBQzVCLEFBQUUsQUFBQztRQUFDLEFBQUcsUUFBSyxBQUFTLGFBQUksQUFBRyxRQUFLLEFBQUksUUFBSSxPQUFPLEFBQUcsUUFBSyxBQUFRLEFBQUMsVUFBQyxBQUFDLEFBQUMsQUFBTTtlQUFDLEFBQUcsQUFBQyxBQUFDLEFBQUM7QUFFakY7UUFBSSxBQUFRLEFBQUMsQUFDYjtRQUFJLEFBQUksT0FBRyxBQUFNLE9BQUMsQUFBUyxVQUFDLEFBQVEsU0FBQyxBQUFJLEtBQUMsQUFBRyxBQUFDLEFBQUMsQUFFL0MsQUFBRSxBQUFDO1FBQUMsQUFBSSxTQUFLLEFBQWUsQUFBQyxpQkFBQyxBQUFDLEFBQzdCLEFBQUc7Y0FBRyxJQUFJLEFBQUksQUFBRSxBQUFDLEFBQ2pCLEFBQUc7WUFBQyxBQUFPLFFBQUMsQUFBRyxJQUFDLEFBQU8sQUFBRSxBQUFDLEFBQUMsQUFDN0IsQUFBQyxBQUFDLEFBQUk7ZUFBSyxBQUFJLFNBQUssQUFBaUIsQUFBQyxtQkFBQyxBQUFDLEFBQ3RDLEFBQUc7Y0FBRyxBQUFHLElBQUMsQUFBVyxZQUFDLEFBQUcsQUFBQyxBQUFDLEFBQzdCLEFBQUMsQUFBQyxBQUFJO0FBRkMsQUFBRSxBQUFDLGVBRUMsQUFBSSxTQUFLLEFBQWdCLEFBQUMsa0JBQUMsQUFBQyxBQUNyQyxBQUFHO2NBQUcsQUFBRSxBQUFDLEFBQ1QsQUFBRyxBQUFDO2FBQUMsSUFBSSxBQUFDLElBQUcsQUFBQyxHQUFFLEFBQUcsTUFBRyxBQUFHLElBQUMsQUFBTSxRQUFFLEFBQUMsSUFBRyxBQUFHLEtBQUUsQUFBQyxBQUFFLEtBQUUsQUFBQyxBQUMvQyxBQUFFLEFBQUM7Z0JBQUMsQUFBRyxJQUFDLEFBQWMsZUFBQyxBQUFDLEFBQUMsQUFB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QUMsQUFBTyxBQUFDLFdBQUksT0FBTyxBQUFPLFlBQUssQUFBUSxBQUFDLEFBQTdCLFdBQWdDLEFBQUUsS0FBRyxBQUFFLEFBQUMsQUFDekQsQUFBQztBQUNELEFBQUc7Y0FBRyxBQUFHLElBQUMsQUFBTyxBQUFDLEFBQUMsQUFDckIsQUFBQztBQUNELEFBQUUsQUFBQztRQUFDLEFBQUcsSUFBQyxBQUFLLEFBQUMsVUFBSyxBQUFLLEFBQUMsT0FBQyxBQUFDLEFBQ3pCLEFBQU07ZUFBQyxBQUFLLEFBQUMsQUFDZixBQUFDLEFBQUMsQUFBSTtXQUFDLEFBQUMsQUFDTixBQUFHO1lBQUMsQUFBSyxBQUFDLFFBQUcsQUFBSyxBQUFDLEFBQ25CLEFBQU07ZUFBQyxBQUFJLEFBQUMsQUFDZCxBQUFDLEFBQ0g7QUFBQzs7QUFqQkQsa0JBaUJDO0FBRUQsQUFRRzs7Ozs7Ozs7O0FBQ0gsc0JBQTZCLEFBQVEsS0FDbkMsQUFBRSxBQUFDO1FBQUMsQUFBTSxPQUFDLEFBQU0sQUFBQyxRQUFDLEFBQUMsQUFDbEIsQUFBTTtlQUFDLEFBQU0sT0FBQyxBQUFNLE9BQUMsQUFBRyxBQUFDLEFBQUMsQUFDNUIsQUFBQyxBQUFDLEFBQUk7V0FBQyxBQUFDLEFBQ04sQUFBTTtzQkFBUSxBQUFJLEtBQUMsQUFBRyxBQUFDLEtBQUMsQUFBRyxJQUFDLFVBQUEsQUFBQyxHQUFJO21CQUFBLEFBQUcsSUFBSCxBQUFJLEFBQUMsQUFBQyxBQUFDLEFBQUMsQUFDM0M7QUFEUyxBQUFNLEFBQ2QsQUFDSDtBQUFDOztBQU5ELHVCQU1DIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgdmFsaWQtanNkb2MgKi9cclxuXHJcbi8qKlxyXG4gKiBDbG9uZXMgYSB2YWx1ZS4gSWYgdGhlIHZhbHVlIGlzIGFuIG9iamVjdCwgYSBkZWVwbHkgbmVzdGVkIGNsb25lIHdpbGwgYmVcclxuICogY3JlYXRlZC5cclxuICpcclxuICogVHJhdmVyc2VzIGFsbCBvYmplY3QgcHJvcGVydGllcyAoYnV0IG5vdCBwcm90b3R5cGUgcHJvcGVydGllcykuXHJcbiAqXHJcbiAqIEBleHBvcnRcclxuICogQHBhcmFtIHsqfSBvYmpcclxuICogQHJldHVybnMgeyp9IENsb25lIG9mIHRoZSBpbnB1dCBgb2JqYFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGNsb25lKG9iajogYW55KTogYW55IHtcclxuICBpZiAob2JqID09PSB1bmRlZmluZWQgfHwgb2JqID09PSBudWxsIHx8IHR5cGVvZiBvYmogIT09ICdvYmplY3QnKSB7IHJldHVybiBvYmo7IH1cclxuXHJcbiAgbGV0IGR1cDogYW55O1xyXG4gIGxldCB0eXBlID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaik7XHJcblxyXG4gIGlmICh0eXBlID09PSAnW29iamVjdCBEYXRlXScpIHtcclxuICAgIGR1cCA9IG5ldyBEYXRlKCk7XHJcbiAgICBkdXAuc2V0VGltZShvYmouZ2V0VGltZSgpKTtcclxuICB9IGVsc2UgaWYgKHR5cGUgPT09ICdbb2JqZWN0IFJlZ0V4cF0nKSB7XHJcbiAgICBkdXAgPSBvYmouY29uc3RydWN0b3Iob2JqKTtcclxuICB9IGVsc2UgaWYgKHR5cGUgPT09ICdbb2JqZWN0IEFycmF5XScpIHtcclxuICAgIGR1cCA9IFtdO1xyXG4gICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IG9iai5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGkpKSB7XHJcbiAgICAgICAgZHVwLnB1c2goY2xvbmUob2JqW2ldKSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9IGVsc2Uge1xyXG4gICAgbGV0IHZhbDtcclxuXHJcbiAgICBkdXAgPSB7fTtcclxuICAgIGZvciAobGV0IGtleSBpbiBvYmopIHtcclxuICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgdmFsID0gb2JqW2tleV07XHJcbiAgICAgICAgaWYgKHR5cGVvZiB2YWwgPT09ICdvYmplY3QnKSB7IHZhbCA9IGNsb25lKHZhbCk7IH1cclxuICAgICAgICBkdXBba2V5XSA9IHZhbDtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gZHVwO1xyXG59XHJcblxyXG4vKipcclxuICogRXhwb3NlIHByb3BlcnRpZXMgYW5kIG1ldGhvZHMgZnJvbSBvbmUgb2JqZWN0IG9uIGFub3RoZXIuXHJcbiAqXHJcbiAqIE1ldGhvZHMgd2lsbCBiZSBjYWxsZWQgb24gYHNvdXJjZWAgYW5kIHdpbGwgbWFpbnRhaW4gYHNvdXJjZWAgYXMgdGhlIGNvbnRleHQuXHJcbiAqXHJcbiAqIEBleHBvcnRcclxuICogQHBhcmFtIHsqfSBkZXN0aW5hdGlvblxyXG4gKiBAcGFyYW0geyp9IHNvdXJjZVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGV4cG9zZShkZXN0aW5hdGlvbjogYW55LCBzb3VyY2U6IGFueSk6IHZvaWQge1xyXG4gIGxldCBwcm9wZXJ0aWVzOiBzdHJpbmdbXTtcclxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDIpIHtcclxuICAgIHByb3BlcnRpZXMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBwcm9wZXJ0aWVzID0gT2JqZWN0LmtleXMoc291cmNlKTtcclxuICB9XHJcblxyXG4gIHByb3BlcnRpZXMuZm9yRWFjaChwID0+IHtcclxuICAgIGlmICh0eXBlb2Ygc291cmNlW3BdID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgIGRlc3RpbmF0aW9uW3BdID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHNvdXJjZVtwXS5hcHBseShzb3VyY2UsIGFyZ3VtZW50cyk7XHJcbiAgICAgIH07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBkZXN0aW5hdGlvbltwXSA9IHNvdXJjZVtwXTtcclxuICAgIH1cclxuICB9KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEV4dGVuZCBhbiBvYmplY3Qgd2l0aCB0aGUgcHJvcGVydGllcyBvZiBvbmUgb3IgbW9yZSBvdGhlciBvYmplY3RzLlxyXG4gKlxyXG4gKiBAZXhwb3J0XHJcbiAqIEBwYXJhbSB7Kn0gZGVzdGluYXRpb25cclxuICogQHBhcmFtIHsuLi5hbnlbXX0gc291cmNlc1xyXG4gKiBAcmV0dXJucyB7YW55fVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGV4dGVuZChkZXN0aW5hdGlvbjogYW55LCAuLi5zb3VyY2VzOiBhbnlbXSk6IGFueSB7XHJcbiAgc291cmNlcy5mb3JFYWNoKHNvdXJjZSA9PiB7XHJcbiAgICBmb3IgKGxldCBwIGluIHNvdXJjZSkge1xyXG4gICAgICBpZiAoc291cmNlLmhhc093blByb3BlcnR5KHApKSB7XHJcbiAgICAgICAgZGVzdGluYXRpb25bcF0gPSBzb3VyY2VbcF07XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KTtcclxuICByZXR1cm4gZGVzdGluYXRpb247XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDaGVja3Mgd2hldGhlciBhbiBvYmplY3QgaXMgYW4gaW5zdGFuY2Ugb2YgYW4gYEFycmF5YFxyXG4gKlxyXG4gKiBAZXhwb3J0XHJcbiAqIEBwYXJhbSB7Kn0gb2JqXHJcbiAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGlzQXJyYXkob2JqOiBhbnkpOiBib29sZWFuIHtcclxuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IEFycmF5XSc7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDb252ZXJ0cyBhbiBvYmplY3QgdG8gYW4gYEFycmF5YCBpZiBpdCdzIG5vdCBhbHJlYWR5LlxyXG4gKlxyXG4gKiBAZXhwb3J0XHJcbiAqIEBwYXJhbSB7Kn0gb2JqXHJcbiAqIEByZXR1cm5zIHthbnlbXX1cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiB0b0FycmF5KG9iajogYW55KTogYW55W10ge1xyXG4gIGlmIChpc05vbmUob2JqKSkge1xyXG4gICAgcmV0dXJuIFtdO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gaXNBcnJheShvYmopID8gb2JqIDogW29ial07XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogQ2hlY2tzIHdoZXRoZXIgYSB2YWx1ZSBpcyBhIG5vbi1udWxsIG9iamVjdFxyXG4gKlxyXG4gKiBAZXhwb3J0XHJcbiAqIEBwYXJhbSB7Kn0gb2JqXHJcbiAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGlzT2JqZWN0KG9iajogYW55KTogYm9vbGVhbiB7XHJcbiAgcmV0dXJuIG9iaiAhPT0gbnVsbCAmJiB0eXBlb2Ygb2JqID09PSAnb2JqZWN0JztcclxufVxyXG5cclxuLyoqXHJcbiAqIENoZWNrcyB3aGV0aGVyIGFuIG9iamVjdCBpcyBudWxsIG9yIHVuZGVmaW5lZFxyXG4gKlxyXG4gKiBAZXhwb3J0XHJcbiAqIEBwYXJhbSB7Kn0gb2JqXHJcbiAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGlzTm9uZShvYmo6IGFueSk6IGJvb2xlYW4ge1xyXG4gIHJldHVybiBvYmogPT09IHVuZGVmaW5lZCB8fCBvYmogPT09IG51bGw7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBNZXJnZXMgcHJvcGVydGllcyBmcm9tIG90aGVyIG9iamVjdHMgaW50byBhIGJhc2Ugb2JqZWN0LiBQcm9wZXJ0aWVzIHRoYXRcclxuICogcmVzb2x2ZSB0byBgdW5kZWZpbmVkYCB3aWxsIG5vdCBvdmVyd3JpdGUgcHJvcGVydGllcyBvbiB0aGUgYmFzZSBvYmplY3RcclxuICogdGhhdCBhbHJlYWR5IGV4aXN0LlxyXG4gKlxyXG4gKiBAZXhwb3J0XHJcbiAqIEBwYXJhbSB7Kn0gYmFzZVxyXG4gKiBAcGFyYW0gey4uLmFueVtdfSBzb3VyY2VzXHJcbiAqIEByZXR1cm5zIHsqfVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlKG9iamVjdDogYW55LCAuLi5zb3VyY2VzOiBhbnlbXSk6IGFueSB7XHJcbiAgc291cmNlcy5mb3JFYWNoKHNvdXJjZSA9PiB7XHJcbiAgICBPYmplY3Qua2V5cyhzb3VyY2UpLmZvckVhY2goZmllbGQgPT4ge1xyXG4gICAgICBpZiAoc291cmNlLmhhc093blByb3BlcnR5KGZpZWxkKSkge1xyXG4gICAgICAgIGxldCB2YWx1ZSA9IHNvdXJjZVtmaWVsZF07XHJcbiAgICAgICAgaWYgKCEodmFsdWUgPT09IHVuZGVmaW5lZCAmJiBvYmplY3RbZmllbGRdICE9PSB1bmRlZmluZWQpKSB7XHJcbiAgICAgICAgICBvYmplY3RbZmllbGRdID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9KTtcclxuICByZXR1cm4gb2JqZWN0O1xyXG59XHJcblxyXG4vKipcclxuICogUmV0cmlldmVzIGEgdmFsdWUgZnJvbSBhIG5lc3RlZCBwYXRoIG9uIGFuIG9iamVjdC5cclxuICpcclxuICogUmV0dXJucyBhbnkgZmFsc3kgdmFsdWUgZW5jb3VudGVyZWQgd2hpbGUgdHJhdmVyc2luZyB0aGUgcGF0aC5cclxuICpcclxuICogQGV4cG9ydFxyXG4gKiBAcGFyYW0geyp9IG9ialxyXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSBwYXRoXHJcbiAqIEByZXR1cm5zIHsqfVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGRlZXBHZXQob2JqOiBhbnksIHBhdGg6IHN0cmluZ1tdKTogYW55IHtcclxuICBsZXQgaW5kZXggPSAtMTtcclxuICBsZXQgcmVzdWx0ID0gb2JqO1xyXG5cclxuICB3aGlsZSAoKytpbmRleCA8IHBhdGgubGVuZ3RoKSB7XHJcbiAgICByZXN1bHQgPSByZXN1bHRbcGF0aFtpbmRleF1dO1xyXG4gICAgaWYgKCFyZXN1bHQpIHtcclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTZXRzIGEgdmFsdWUgb24gYW4gb2JqZWN0IGF0IGEgbmVzdGVkIHBhdGguXHJcbiAqXHJcbiAqIFRoaXMgZnVuY3Rpb24gd2lsbCBjcmVhdGUgb2JqZWN0cyBhbG9uZyB0aGUgcGF0aCBpZiBuZWNlc3NhcnkgdG8gYWxsb3dcclxuICogc2V0dGluZyBhIGRlZXBseSBuZXN0ZWQgdmFsdWUuXHJcbiAqXHJcbiAqIFJldHVybnMgYGZhbHNlYCBvbmx5IGlmIHRoZSBjdXJyZW50IHZhbHVlIGlzIGFscmVhZHkgc3RyaWN0bHkgZXF1YWwgdG8gdGhlXHJcbiAqIHJlcXVlc3RlZCBgdmFsdWVgIGFyZ3VtZW50LiBPdGhlcndpc2UgcmV0dXJucyBgdHJ1ZWAuXHJcbiAqXHJcbiAqIEBleHBvcnRcclxuICogQHBhcmFtIHsqfSBvYmpcclxuICogQHBhcmFtIHtzdHJpbmdbXX0gcGF0aFxyXG4gKiBAcGFyYW0geyp9IHZhbHVlXHJcbiAqIEByZXR1cm5zIHtib29sZWFufSB3YXMgdGhlIHZhbHVlIHdhcyBhY3R1YWxseSBjaGFuZ2VkP1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGRlZXBTZXQob2JqOiBhbnksIHBhdGg6IHN0cmluZ1tdLCB2YWx1ZTogYW55KTogYm9vbGVhbiB7XHJcbiAgbGV0IHB0ciA9IG9iajtcclxuICBsZXQgcHJvcCA9IHBhdGgucG9wKCk7XHJcbiAgbGV0IHNlZ21lbnQ7XHJcbiAgZm9yIChsZXQgaSA9IDAsIGwgPSBwYXRoLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgc2VnbWVudCA9IHBhdGhbaV07XHJcbiAgICBpZiAocHRyW3NlZ21lbnRdID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgcHRyW3NlZ21lbnRdID0gKHR5cGVvZiBzZWdtZW50ID09PSAnbnVtYmVyJykgPyBbXSA6IHt9O1xyXG4gICAgfVxyXG4gICAgcHRyID0gcHRyW3NlZ21lbnRdO1xyXG4gIH1cclxuICBpZiAocHRyW3Byb3AhXSA9PT0gdmFsdWUpIHtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9IGVsc2Uge1xyXG4gICAgcHRyW3Byb3AhXSA9IHZhbHVlO1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogRmluZCBhbiBhcnJheSBvZiB2YWx1ZXMgdGhhdCBjb3JyZXNwb25kIHRvIHRoZSBrZXlzIG9mIGFuIG9iamVjdC5cclxuICpcclxuICogVGhpcyBpcyBhIHBvbnlmaWxsIGZvciBgT2JqZWN0LnZhbHVlc2AsIHdoaWNoIGlzIHN0aWxsIGV4cGVyaW1lbnRhbC5cclxuICpcclxuICogQGV4cG9ydFxyXG4gKiBAcGFyYW0geyp9IG9ialxyXG4gKiBAcmV0dXJucyB7YW55W119XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gb2JqZWN0VmFsdWVzKG9iajogYW55KTogYW55W10ge1xyXG4gIGlmIChPYmplY3QudmFsdWVzKSB7XHJcbiAgICByZXR1cm4gT2JqZWN0LnZhbHVlcyhvYmopO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gT2JqZWN0LmtleXMob2JqKS5tYXAoayA9PiBvYmpba10pO1xyXG4gIH1cclxufVxyXG4iXX0=