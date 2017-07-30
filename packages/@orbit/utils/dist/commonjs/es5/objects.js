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
        var val;
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
 * @param {object} destination
 * @param {object} source
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
 * @param {object} destination
 * @param {any} sources
 * @returns {object}
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
 * @param {object} base
 * @param {...object[]} sources
 * @returns {object}
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
 * @param {object} obj
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
 * @param {object} obj
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
 * @param {object} obj
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2JqZWN0cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNyYy9vYmplY3RzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxBQUFnQzs7O0FBRWhDLEFBU0c7Ozs7Ozs7Ozs7QUFDSCxlQUFzQixBQUFRLEtBQzVCLEFBQUUsQUFBQztRQUFDLEFBQUcsUUFBSyxBQUFTLGFBQUksQUFBRyxRQUFLLEFBQUksUUFBSSxPQUFPLEFBQUcsUUFBSyxBQUFRLEFBQUMsVUFBQyxBQUFDLEFBQUMsQUFBTTtlQUFDLEFBQUcsQUFBQyxBQUFDLEFBQUM7QUFFakY7UUFBSSxBQUFHLEFBQUMsQUFDUjtRQUFJLEFBQUksT0FBRyxBQUFNLE9BQUMsQUFBUyxVQUFDLEFBQVEsU0FBQyxBQUFJLEtBQUMsQUFBRyxBQUFDLEFBQUMsQUFFL0MsQUFBRSxBQUFDO1FBQUMsQUFBSSxTQUFLLEFBQWUsQUFBQyxpQkFBQyxBQUFDLEFBQzdCLEFBQUc7Y0FBRyxJQUFJLEFBQUksQUFBRSxBQUFDLEFBQ2pCLEFBQUc7WUFBQyxBQUFPLFFBQUMsQUFBRyxJQUFDLEFBQU8sQUFBRSxBQUFDLEFBQUMsQUFDN0IsQUFBQyxBQUFDLEFBQUk7ZUFBSyxBQUFJLFNBQUssQUFBaUIsQUFBQyxtQkFBQyxBQUFDLEFBQ3RDLEFBQUc7Y0FBRyxBQUFHLElBQUMsQUFBVyxZQUFDLEFBQUcsQUFBQyxBQUFDLEFBQzdCLEFBQUMsQUFBQyxBQUFJO0FBRkMsQUFBRSxBQUFDLGVBRUMsQUFBSSxTQUFLLEFBQWdCLEFBQUMsa0JBQUMsQUFBQyxBQUNyQyxBQUFHO2NBQUcsQUFBRSxBQUFDLEFBQ1QsQUFBRyxBQUFDO2FBQUMsSUFBSSxBQUFDLElBQUcsQUFBQyxHQUFFLEFBQUcsTUFBRyxBQUFHLElBQUMsQUFBTSxRQUFFLEFBQUMsSUFBRyxBQUFHLEtBQUUsQUFBQyxBQUFFLEtBQUUsQUFBQyxBQUMvQyxBQUFFLEFBQUM7Z0JBQUMsQUFBRyxJQUFDLEFBQWMsZUFBQyxBQUFDLEFBQUMsQUFB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SSxPQUFPLEFBQU8sWUFBSyxBQUFRLEFBQUMsQUFBN0IsV0FBZ0MsQUFBRSxLQUFHLEFBQUUsQUFBQyxBQUN6RCxBQUFDO0FBQ0QsQUFBRztjQUFHLEFBQUcsSUFBQyxBQUFPLEFBQUMsQUFBQyxBQUNyQixBQUFDO0FBQ0QsQUFBRSxBQUFDO1FBQUMsQUFBRyxJQUFDLEFBQUksQUFBQyxVQUFLLEFBQUssQUFBQyxPQUFDLEFBQUMsQUFDeEIsQUFBTTtlQUFDLEFBQUssQUFBQyxBQUNmLEFBQUMsQUFBQyxBQUFJO1dBQUMsQUFBQyxBQUNOLEFBQUc7WUFBQyxBQUFJLEFBQUMsUUFBRyxBQUFLLEFBQUMsQUFDbEIsQUFBTTtlQUFDLEFBQUksQUFBQyxBQUNkLEFBQUMsQUFDSDtBQUFDOztBQWpCRCxrQkFpQkM7QUFFRCxBQVFHOzs7Ozs7Ozs7QUFDSCxzQkFBNkIsQUFBVyxLQUN0QyxBQUFFLEFBQUM7UUFBQyxBQUFNLE9BQUMsQUFBTSxBQUFDLFFBQUMsQUFBQyxBQUNsQixBQUFNO2VBQUMsQUFBTSxPQUFDLEFBQU0sT0FBQyxBQUFHLEFBQUMsQUFBQyxBQUM1QixBQUFDLEFBQUMsQUFBSTtXQUFDLEFBQUMsQUFDTixBQUFNO3NCQUFRLEFBQUksS0FBQyxBQUFHLEFBQUMsS0FBQyxBQUFHLElBQUMsVUFBQSxBQUFDLEdBQUk7bUJBQUEsQUFBRyxJQUFILEFBQUksQUFBQyxBQUFDLEFBQUMsQUFBQyxBQUMzQztBQURTLEFBQU0sQUFDZCxBQUNIO0FBQUM7O0FBTkQsdUJBTUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSB2YWxpZC1qc2RvYyAqL1xyXG5cclxuLyoqXHJcbiAqIENsb25lcyBhIHZhbHVlLiBJZiB0aGUgdmFsdWUgaXMgYW4gb2JqZWN0LCBhIGRlZXBseSBuZXN0ZWQgY2xvbmUgd2lsbCBiZVxyXG4gKiBjcmVhdGVkLlxyXG4gKlxyXG4gKiBUcmF2ZXJzZXMgYWxsIG9iamVjdCBwcm9wZXJ0aWVzIChidXQgbm90IHByb3RvdHlwZSBwcm9wZXJ0aWVzKS5cclxuICpcclxuICogQGV4cG9ydFxyXG4gKiBAcGFyYW0geyp9IG9ialxyXG4gKiBAcmV0dXJucyB7Kn0gQ2xvbmUgb2YgdGhlIGlucHV0IGBvYmpgXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gY2xvbmUob2JqOiBhbnkpOiBhbnkge1xyXG4gIGlmIChvYmogPT09IHVuZGVmaW5lZCB8fCBvYmogPT09IG51bGwgfHwgdHlwZW9mIG9iaiAhPT0gJ29iamVjdCcpIHsgcmV0dXJuIG9iajsgfVxyXG5cclxuICBsZXQgZHVwO1xyXG4gIGxldCB0eXBlID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaik7XHJcblxyXG4gIGlmICh0eXBlID09PSAnW29iamVjdCBEYXRlXScpIHtcclxuICAgIGR1cCA9IG5ldyBEYXRlKCk7XHJcbiAgICBkdXAuc2V0VGltZShvYmouZ2V0VGltZSgpKTtcclxuICB9IGVsc2UgaWYgKHR5cGUgPT09ICdbb2JqZWN0IFJlZ0V4cF0nKSB7XHJcbiAgICBkdXAgPSBvYmouY29uc3RydWN0b3Iob2JqKTtcclxuICB9IGVsc2UgaWYgKHR5cGUgPT09ICdbb2JqZWN0IEFycmF5XScpIHtcclxuICAgIGR1cCA9IFtdO1xyXG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IG9iai5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGkpKSB7XHJcbiAgICAgICAgZHVwLnB1c2goY2xvbmUob2JqW2ldKSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9IGVsc2Uge1xyXG4gICAgdmFyIHZhbDtcclxuXHJcbiAgICBkdXAgPSB7fTtcclxuICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcclxuICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgdmFsID0gb2JqW2tleV07XHJcbiAgICAgICAgaWYgKHR5cGVvZiB2YWwgPT09ICdvYmplY3QnKSB7IHZhbCA9IGNsb25lKHZhbCk7IH1cclxuICAgICAgICBkdXBba2V5XSA9IHZhbDtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gZHVwO1xyXG59XHJcblxyXG4vKipcclxuICogRXhwb3NlIHByb3BlcnRpZXMgYW5kIG1ldGhvZHMgZnJvbSBvbmUgb2JqZWN0IG9uIGFub3RoZXIuXHJcbiAqXHJcbiAqIE1ldGhvZHMgd2lsbCBiZSBjYWxsZWQgb24gYHNvdXJjZWAgYW5kIHdpbGwgbWFpbnRhaW4gYHNvdXJjZWAgYXMgdGhlIGNvbnRleHQuXHJcbiAqXHJcbiAqIEBleHBvcnRcclxuICogQHBhcmFtIHtvYmplY3R9IGRlc3RpbmF0aW9uXHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBzb3VyY2VcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBleHBvc2UoZGVzdGluYXRpb246IG9iamVjdCwgc291cmNlOiBvYmplY3QpOiB2b2lkIHtcclxuICBsZXQgcHJvcGVydGllcztcclxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDIpIHtcclxuICAgIHByb3BlcnRpZXMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBwcm9wZXJ0aWVzID0gT2JqZWN0LmtleXMoc291cmNlKTtcclxuICB9XHJcblxyXG4gIHByb3BlcnRpZXMuZm9yRWFjaChmdW5jdGlvbihwKSB7XHJcbiAgICBpZiAodHlwZW9mIHNvdXJjZVtwXSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICBkZXN0aW5hdGlvbltwXSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBzb3VyY2VbcF0uYXBwbHkoc291cmNlLCBhcmd1bWVudHMpO1xyXG4gICAgICB9O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZGVzdGluYXRpb25bcF0gPSBzb3VyY2VbcF07XHJcbiAgICB9XHJcbiAgfSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBFeHRlbmQgYW4gb2JqZWN0IHdpdGggdGhlIHByb3BlcnRpZXMgb2Ygb25lIG9yIG1vcmUgb3RoZXIgb2JqZWN0cy5cclxuICpcclxuICogQGV4cG9ydFxyXG4gKiBAcGFyYW0ge29iamVjdH0gZGVzdGluYXRpb25cclxuICogQHBhcmFtIHthbnl9IHNvdXJjZXNcclxuICogQHJldHVybnMge29iamVjdH1cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBleHRlbmQoZGVzdGluYXRpb246IG9iamVjdCwgLi4uc291cmNlcyk6IG9iamVjdCB7XHJcbiAgc291cmNlcy5mb3JFYWNoKGZ1bmN0aW9uKHNvdXJjZSkge1xyXG4gICAgZm9yICh2YXIgcCBpbiBzb3VyY2UpIHtcclxuICAgICAgaWYgKHNvdXJjZS5oYXNPd25Qcm9wZXJ0eShwKSkge1xyXG4gICAgICAgIGRlc3RpbmF0aW9uW3BdID0gc291cmNlW3BdO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgcmV0dXJuIGRlc3RpbmF0aW9uO1xyXG59XHJcblxyXG4vKipcclxuICogQ2hlY2tzIHdoZXRoZXIgYW4gb2JqZWN0IGlzIGFuIGluc3RhbmNlIG9mIGFuIGBBcnJheWBcclxuICpcclxuICogQGV4cG9ydFxyXG4gKiBAcGFyYW0geyp9IG9ialxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBpc0FycmF5KG9iajogYW55KTogYm9vbGVhbiB7XHJcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBBcnJheV0nO1xyXG59XHJcblxyXG4vKipcclxuICogQ29udmVydHMgYW4gb2JqZWN0IHRvIGFuIGBBcnJheWAgaWYgaXQncyBub3QgYWxyZWFkeS5cclxuICpcclxuICogQGV4cG9ydFxyXG4gKiBAcGFyYW0geyp9IG9ialxyXG4gKiBAcmV0dXJucyB7YW55W119XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gdG9BcnJheShvYmo6IGFueSk6IGFueVtdIHtcclxuICBpZiAoaXNOb25lKG9iaikpIHtcclxuICAgIHJldHVybiBbXTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIGlzQXJyYXkob2JqKSA/IG9iaiA6IFtvYmpdO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIENoZWNrcyB3aGV0aGVyIGEgdmFsdWUgaXMgYSBub24tbnVsbCBvYmplY3RcclxuICpcclxuICogQGV4cG9ydFxyXG4gKiBAcGFyYW0geyp9IG9ialxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBpc09iamVjdChvYmo6IGFueSk6IGJvb2xlYW4ge1xyXG4gIHJldHVybiBvYmogIT09IG51bGwgJiYgdHlwZW9mIG9iaiA9PT0gJ29iamVjdCc7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDaGVja3Mgd2hldGhlciBhbiBvYmplY3QgaXMgbnVsbCBvciB1bmRlZmluZWRcclxuICpcclxuICogQGV4cG9ydFxyXG4gKiBAcGFyYW0geyp9IG9ialxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBpc05vbmUob2JqOiBhbnkpOiBib29sZWFuIHtcclxuICByZXR1cm4gb2JqID09PSB1bmRlZmluZWQgfHwgb2JqID09PSBudWxsO1xyXG59XHJcblxyXG4vKipcclxuICogTWVyZ2VzIHByb3BlcnRpZXMgZnJvbSBvdGhlciBvYmplY3RzIGludG8gYSBiYXNlIG9iamVjdC4gUHJvcGVydGllcyB0aGF0XHJcbiAqIHJlc29sdmUgdG8gYHVuZGVmaW5lZGAgd2lsbCBub3Qgb3ZlcndyaXRlIHByb3BlcnRpZXMgb24gdGhlIGJhc2Ugb2JqZWN0XHJcbiAqIHRoYXQgYWxyZWFkeSBleGlzdC5cclxuICpcclxuICogQGV4cG9ydFxyXG4gKiBAcGFyYW0ge29iamVjdH0gYmFzZVxyXG4gKiBAcGFyYW0gey4uLm9iamVjdFtdfSBzb3VyY2VzXHJcbiAqIEByZXR1cm5zIHtvYmplY3R9XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2Uob2JqZWN0OiBvYmplY3QsIC4uLnNvdXJjZXM6IG9iamVjdFtdKTogb2JqZWN0IHtcclxuICBzb3VyY2VzLmZvckVhY2goc291cmNlID0+IHtcclxuICAgIE9iamVjdC5rZXlzKHNvdXJjZSkuZm9yRWFjaChmdW5jdGlvbihmaWVsZCkge1xyXG4gICAgICBpZiAoc291cmNlLmhhc093blByb3BlcnR5KGZpZWxkKSkge1xyXG4gICAgICAgIGxldCB2YWx1ZSA9IHNvdXJjZVtmaWVsZF07XHJcbiAgICAgICAgaWYgKCEodmFsdWUgPT09IHVuZGVmaW5lZCAmJiBvYmplY3RbZmllbGRdICE9PSB1bmRlZmluZWQpKSB7XHJcbiAgICAgICAgICBvYmplY3RbZmllbGRdID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9KTtcclxuICByZXR1cm4gb2JqZWN0O1xyXG59XHJcblxyXG4vKipcclxuICogUmV0cmlldmVzIGEgdmFsdWUgZnJvbSBhIG5lc3RlZCBwYXRoIG9uIGFuIG9iamVjdC5cclxuICpcclxuICogUmV0dXJucyBhbnkgZmFsc3kgdmFsdWUgZW5jb3VudGVyZWQgd2hpbGUgdHJhdmVyc2luZyB0aGUgcGF0aC5cclxuICpcclxuICogQGV4cG9ydFxyXG4gKiBAcGFyYW0ge29iamVjdH0gb2JqXHJcbiAqIEBwYXJhbSB7c3RyaW5nW119IHBhdGhcclxuICogQHJldHVybnMgeyp9XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZGVlcEdldChvYmo6IG9iamVjdCwgcGF0aDogc3RyaW5nW10pOiBhbnkge1xyXG4gIGxldCBpbmRleCA9IC0xO1xyXG4gIGxldCByZXN1bHQgPSBvYmo7XHJcblxyXG4gIHdoaWxlICgrK2luZGV4IDwgcGF0aC5sZW5ndGgpIHtcclxuICAgIHJlc3VsdCA9IHJlc3VsdFtwYXRoW2luZGV4XV07XHJcbiAgICBpZiAoIXJlc3VsdCkge1xyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNldHMgYSB2YWx1ZSBvbiBhbiBvYmplY3QgYXQgYSBuZXN0ZWQgcGF0aC5cclxuICpcclxuICogVGhpcyBmdW5jdGlvbiB3aWxsIGNyZWF0ZSBvYmplY3RzIGFsb25nIHRoZSBwYXRoIGlmIG5lY2Vzc2FyeSB0byBhbGxvd1xyXG4gKiBzZXR0aW5nIGEgZGVlcGx5IG5lc3RlZCB2YWx1ZS5cclxuICpcclxuICogUmV0dXJucyBgZmFsc2VgIG9ubHkgaWYgdGhlIGN1cnJlbnQgdmFsdWUgaXMgYWxyZWFkeSBzdHJpY3RseSBlcXVhbCB0byB0aGVcclxuICogcmVxdWVzdGVkIGB2YWx1ZWAgYXJndW1lbnQuIE90aGVyd2lzZSByZXR1cm5zIGB0cnVlYC5cclxuICpcclxuICogQGV4cG9ydFxyXG4gKiBAcGFyYW0ge29iamVjdH0gb2JqXHJcbiAqIEBwYXJhbSB7c3RyaW5nW119IHBhdGhcclxuICogQHBhcmFtIHsqfSB2YWx1ZVxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gd2FzIHRoZSB2YWx1ZSB3YXMgYWN0dWFsbHkgY2hhbmdlZD9cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBkZWVwU2V0KG9iajogb2JqZWN0LCBwYXRoOiBzdHJpbmdbXSwgdmFsdWU6IGFueSk6IGJvb2xlYW4ge1xyXG4gIGxldCBwdHIgPSBvYmo7XHJcbiAgbGV0IHByb3AgPSBwYXRoLnBvcCgpO1xyXG4gIGxldCBzZWdtZW50O1xyXG4gIGZvciAobGV0IGkgPSAwLCBsID0gcGF0aC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgIHNlZ21lbnQgPSBwYXRoW2ldO1xyXG4gICAgaWYgKHB0cltzZWdtZW50XSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHB0cltzZWdtZW50XSA9ICh0eXBlb2Ygc2VnbWVudCA9PT0gJ251bWJlcicpID8gW10gOiB7fTtcclxuICAgIH1cclxuICAgIHB0ciA9IHB0cltzZWdtZW50XTtcclxuICB9XHJcbiAgaWYgKHB0cltwcm9wXSA9PT0gdmFsdWUpIHtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9IGVsc2Uge1xyXG4gICAgcHRyW3Byb3BdID0gdmFsdWU7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBGaW5kIGFuIGFycmF5IG9mIHZhbHVlcyB0aGF0IGNvcnJlc3BvbmQgdG8gdGhlIGtleXMgb2YgYW4gb2JqZWN0LlxyXG4gKlxyXG4gKiBUaGlzIGlzIGEgcG9ueWZpbGwgZm9yIGBPYmplY3QudmFsdWVzYCwgd2hpY2ggaXMgc3RpbGwgZXhwZXJpbWVudGFsLlxyXG4gKlxyXG4gKiBAZXhwb3J0XHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBvYmpcclxuICogQHJldHVybnMge2FueVtdfVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIG9iamVjdFZhbHVlcyhvYmo6IG9iamVjdCk6IGFueVtdIHtcclxuICBpZiAoT2JqZWN0LnZhbHVlcykge1xyXG4gICAgcmV0dXJuIE9iamVjdC52YWx1ZXMob2JqKTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKG9iaikubWFwKGsgPT4gb2JqW2tdKTtcclxuICB9XHJcbn1cclxuIl19