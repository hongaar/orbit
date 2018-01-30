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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2JqZWN0cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNyYy9vYmplY3RzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxBQUFnQzs7O0FBRWhDLEFBU0c7Ozs7Ozs7Ozs7QUFDSCxlQUFzQixBQUFRO0FBQzVCLEFBQUUsQUFBQyxRQUFDLEFBQUcsUUFBSyxBQUFTLGFBQUksQUFBRyxRQUFLLEFBQUksUUFBSSxPQUFPLEFBQUcsUUFBSyxBQUFRLEFBQUMsVUFBQyxBQUFDO0FBQUMsQUFBTSxlQUFDLEFBQUcsQUFBQyxBQUFDO0FBQUM7QUFFakYsUUFBSSxBQUFRLEFBQUM7QUFDYixRQUFJLEFBQUksT0FBRyxBQUFNLE9BQUMsQUFBUyxVQUFDLEFBQVEsU0FBQyxBQUFJLEtBQUMsQUFBRyxBQUFDLEFBQUM7QUFFL0MsQUFBRSxBQUFDLFFBQUMsQUFBSSxTQUFLLEFBQWUsQUFBQyxpQkFBQyxBQUFDO0FBQzdCLEFBQUcsY0FBRyxJQUFJLEFBQUksQUFBRSxBQUFDO0FBQ2pCLEFBQUcsWUFBQyxBQUFPLFFBQUMsQUFBRyxJQUFDLEFBQU8sQUFBRSxBQUFDLEFBQUMsQUFDN0I7QUFBQyxBQUFDLEFBQUksZUFBSyxBQUFJLFNBQUssQUFBaUIsQUFBQyxtQkFBQyxBQUFDO0FBQ3RDLEFBQUcsY0FBRyxBQUFHLElBQUMsQUFBVyxZQUFDLEFBQUcsQUFBQyxBQUFDLEFBQzdCO0FBQUMsQUFBQyxBQUFJLEtBRkMsQUFBRSxBQUFDLFVBRUMsQUFBSSxTQUFLLEFBQWdCLEFBQUMsa0JBQUMsQUFBQztBQUNyQyxBQUFHLGNBQUcsQUFBRSxBQUFDO0FBQ1QsQUFBRyxBQUFDLGFBQUMsSUFBSSxBQUFDLElBQUcsQUFBQyxHQUFFLEFBQUcsTUFBRyxBQUFHLElBQUMsQUFBTSxRQUFFLEFBQUMsSUFBRyxBQUFHLEtBQUUsQUFBQyxBQUFFLEtBQUUsQUFBQztBQUMvQyxBQUFFLEFBQUMsZ0JBQUMsQUFBRyxJQUFDLEFBQWMsZUFBQyxBQUFDLEFBQUMsQUFB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LEFBQUMsV0FBSSxPQUFPLEFBQU8sWUFBSyxBQUFRLEFBQUMsUUFBN0IsR0FBZ0MsQUFBRSxLQUFHLEFBQUUsQUFBQyxBQUN6RDtBQUFDO0FBQ0QsQUFBRyxjQUFHLEFBQUcsSUFBQyxBQUFPLEFBQUMsQUFBQyxBQUNyQjtBQUFDO0FBQ0QsQUFBRSxBQUFDLFFBQUMsQUFBRyxJQUFDLEFBQUssQUFBQyxVQUFLLEFBQUssQUFBQyxPQUFDLEFBQUM7QUFDekIsQUFBTSxlQUFDLEFBQUssQUFBQyxBQUNmO0FBQUMsQUFBQyxBQUFJLFdBQUMsQUFBQztBQUNOLEFBQUcsWUFBQyxBQUFLLEFBQUMsUUFBRyxBQUFLLEFBQUM7QUFDbkIsQUFBTSxlQUFDLEFBQUksQUFBQyxBQUNkO0FBQUMsQUFDSDtBQUFDO0FBakJELGtCQWlCQztBQUVELEFBUUc7Ozs7Ozs7OztBQUNILHNCQUE2QixBQUFRO0FBQ25DLEFBQUUsQUFBQyxRQUFDLEFBQU0sT0FBQyxBQUFNLEFBQUMsUUFBQyxBQUFDO0FBQ2xCLEFBQU0sZUFBQyxBQUFNLE9BQUMsQUFBTSxPQUFDLEFBQUcsQUFBQyxBQUFDLEFBQzVCO0FBQUMsQUFBQyxBQUFJLFdBQUMsQUFBQztBQUNOLEFBQU0sc0JBQVEsQUFBSSxLQUFDLEFBQUcsQUFBQyxLQUFDLEFBQUcsSUFBQyxVQUFBLEFBQUM7QUFBSSxtQkFBQSxBQUFHLElBQUgsQUFBSSxBQUFDLEFBQUM7QUFBQSxBQUFDLEFBQUMsQUFDM0MsU0FEUyxBQUFNO0FBQ2QsQUFDSDtBQUFDO0FBTkQsdUJBTUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSB2YWxpZC1qc2RvYyAqL1xyXG5cclxuLyoqXHJcbiAqIENsb25lcyBhIHZhbHVlLiBJZiB0aGUgdmFsdWUgaXMgYW4gb2JqZWN0LCBhIGRlZXBseSBuZXN0ZWQgY2xvbmUgd2lsbCBiZVxyXG4gKiBjcmVhdGVkLlxyXG4gKlxyXG4gKiBUcmF2ZXJzZXMgYWxsIG9iamVjdCBwcm9wZXJ0aWVzIChidXQgbm90IHByb3RvdHlwZSBwcm9wZXJ0aWVzKS5cclxuICpcclxuICogQGV4cG9ydFxyXG4gKiBAcGFyYW0geyp9IG9ialxyXG4gKiBAcmV0dXJucyB7Kn0gQ2xvbmUgb2YgdGhlIGlucHV0IGBvYmpgXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gY2xvbmUob2JqOiBhbnkpOiBhbnkge1xyXG4gIGlmIChvYmogPT09IHVuZGVmaW5lZCB8fCBvYmogPT09IG51bGwgfHwgdHlwZW9mIG9iaiAhPT0gJ29iamVjdCcpIHsgcmV0dXJuIG9iajsgfVxyXG5cclxuICBsZXQgZHVwOiBhbnk7XHJcbiAgbGV0IHR5cGUgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKTtcclxuXHJcbiAgaWYgKHR5cGUgPT09ICdbb2JqZWN0IERhdGVdJykge1xyXG4gICAgZHVwID0gbmV3IERhdGUoKTtcclxuICAgIGR1cC5zZXRUaW1lKG9iai5nZXRUaW1lKCkpO1xyXG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gJ1tvYmplY3QgUmVnRXhwXScpIHtcclxuICAgIGR1cCA9IG9iai5jb25zdHJ1Y3RvcihvYmopO1xyXG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gJ1tvYmplY3QgQXJyYXldJykge1xyXG4gICAgZHVwID0gW107XHJcbiAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gb2JqLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoaSkpIHtcclxuICAgICAgICBkdXAucHVzaChjbG9uZShvYmpbaV0pKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICBsZXQgdmFsO1xyXG5cclxuICAgIGR1cCA9IHt9O1xyXG4gICAgZm9yIChsZXQga2V5IGluIG9iaikge1xyXG4gICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICB2YWwgPSBvYmpba2V5XTtcclxuICAgICAgICBpZiAodHlwZW9mIHZhbCA9PT0gJ29iamVjdCcpIHsgdmFsID0gY2xvbmUodmFsKTsgfVxyXG4gICAgICAgIGR1cFtrZXldID0gdmFsO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBkdXA7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBFeHBvc2UgcHJvcGVydGllcyBhbmQgbWV0aG9kcyBmcm9tIG9uZSBvYmplY3Qgb24gYW5vdGhlci5cclxuICpcclxuICogTWV0aG9kcyB3aWxsIGJlIGNhbGxlZCBvbiBgc291cmNlYCBhbmQgd2lsbCBtYWludGFpbiBgc291cmNlYCBhcyB0aGUgY29udGV4dC5cclxuICpcclxuICogQGV4cG9ydFxyXG4gKiBAcGFyYW0geyp9IGRlc3RpbmF0aW9uXHJcbiAqIEBwYXJhbSB7Kn0gc291cmNlXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZXhwb3NlKGRlc3RpbmF0aW9uOiBhbnksIHNvdXJjZTogYW55KTogdm9pZCB7XHJcbiAgbGV0IHByb3BlcnRpZXM6IHN0cmluZ1tdO1xyXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMikge1xyXG4gICAgcHJvcGVydGllcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XHJcbiAgfSBlbHNlIHtcclxuICAgIHByb3BlcnRpZXMgPSBPYmplY3Qua2V5cyhzb3VyY2UpO1xyXG4gIH1cclxuXHJcbiAgcHJvcGVydGllcy5mb3JFYWNoKHAgPT4ge1xyXG4gICAgaWYgKHR5cGVvZiBzb3VyY2VbcF0gPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgZGVzdGluYXRpb25bcF0gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gc291cmNlW3BdLmFwcGx5KHNvdXJjZSwgYXJndW1lbnRzKTtcclxuICAgICAgfTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGRlc3RpbmF0aW9uW3BdID0gc291cmNlW3BdO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59XHJcblxyXG4vKipcclxuICogRXh0ZW5kIGFuIG9iamVjdCB3aXRoIHRoZSBwcm9wZXJ0aWVzIG9mIG9uZSBvciBtb3JlIG90aGVyIG9iamVjdHMuXHJcbiAqXHJcbiAqIEBleHBvcnRcclxuICogQHBhcmFtIHsqfSBkZXN0aW5hdGlvblxyXG4gKiBAcGFyYW0gey4uLmFueVtdfSBzb3VyY2VzXHJcbiAqIEByZXR1cm5zIHthbnl9XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZXh0ZW5kKGRlc3RpbmF0aW9uOiBhbnksIC4uLnNvdXJjZXM6IGFueVtdKTogYW55IHtcclxuICBzb3VyY2VzLmZvckVhY2goc291cmNlID0+IHtcclxuICAgIGZvciAobGV0IHAgaW4gc291cmNlKSB7XHJcbiAgICAgIGlmIChzb3VyY2UuaGFzT3duUHJvcGVydHkocCkpIHtcclxuICAgICAgICBkZXN0aW5hdGlvbltwXSA9IHNvdXJjZVtwXTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pO1xyXG4gIHJldHVybiBkZXN0aW5hdGlvbjtcclxufVxyXG5cclxuLyoqXHJcbiAqIENoZWNrcyB3aGV0aGVyIGFuIG9iamVjdCBpcyBhbiBpbnN0YW5jZSBvZiBhbiBgQXJyYXlgXHJcbiAqXHJcbiAqIEBleHBvcnRcclxuICogQHBhcmFtIHsqfSBvYmpcclxuICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gaXNBcnJheShvYmo6IGFueSk6IGJvb2xlYW4ge1xyXG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcclxufVxyXG5cclxuLyoqXHJcbiAqIENvbnZlcnRzIGFuIG9iamVjdCB0byBhbiBgQXJyYXlgIGlmIGl0J3Mgbm90IGFscmVhZHkuXHJcbiAqXHJcbiAqIEBleHBvcnRcclxuICogQHBhcmFtIHsqfSBvYmpcclxuICogQHJldHVybnMge2FueVtdfVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHRvQXJyYXkob2JqOiBhbnkpOiBhbnlbXSB7XHJcbiAgaWYgKGlzTm9uZShvYmopKSB7XHJcbiAgICByZXR1cm4gW107XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiBpc0FycmF5KG9iaikgPyBvYmogOiBbb2JqXTtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDaGVja3Mgd2hldGhlciBhIHZhbHVlIGlzIGEgbm9uLW51bGwgb2JqZWN0XHJcbiAqXHJcbiAqIEBleHBvcnRcclxuICogQHBhcmFtIHsqfSBvYmpcclxuICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gaXNPYmplY3Qob2JqOiBhbnkpOiBib29sZWFuIHtcclxuICByZXR1cm4gb2JqICE9PSBudWxsICYmIHR5cGVvZiBvYmogPT09ICdvYmplY3QnO1xyXG59XHJcblxyXG4vKipcclxuICogQ2hlY2tzIHdoZXRoZXIgYW4gb2JqZWN0IGlzIG51bGwgb3IgdW5kZWZpbmVkXHJcbiAqXHJcbiAqIEBleHBvcnRcclxuICogQHBhcmFtIHsqfSBvYmpcclxuICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gaXNOb25lKG9iajogYW55KTogYm9vbGVhbiB7XHJcbiAgcmV0dXJuIG9iaiA9PT0gdW5kZWZpbmVkIHx8IG9iaiA9PT0gbnVsbDtcclxufVxyXG5cclxuLyoqXHJcbiAqIE1lcmdlcyBwcm9wZXJ0aWVzIGZyb20gb3RoZXIgb2JqZWN0cyBpbnRvIGEgYmFzZSBvYmplY3QuIFByb3BlcnRpZXMgdGhhdFxyXG4gKiByZXNvbHZlIHRvIGB1bmRlZmluZWRgIHdpbGwgbm90IG92ZXJ3cml0ZSBwcm9wZXJ0aWVzIG9uIHRoZSBiYXNlIG9iamVjdFxyXG4gKiB0aGF0IGFscmVhZHkgZXhpc3QuXHJcbiAqXHJcbiAqIEBleHBvcnRcclxuICogQHBhcmFtIHsqfSBiYXNlXHJcbiAqIEBwYXJhbSB7Li4uYW55W119IHNvdXJjZXNcclxuICogQHJldHVybnMgeyp9XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2Uob2JqZWN0OiBhbnksIC4uLnNvdXJjZXM6IGFueVtdKTogYW55IHtcclxuICBzb3VyY2VzLmZvckVhY2goc291cmNlID0+IHtcclxuICAgIE9iamVjdC5rZXlzKHNvdXJjZSkuZm9yRWFjaChmaWVsZCA9PiB7XHJcbiAgICAgIGlmIChzb3VyY2UuaGFzT3duUHJvcGVydHkoZmllbGQpKSB7XHJcbiAgICAgICAgbGV0IHZhbHVlID0gc291cmNlW2ZpZWxkXTtcclxuICAgICAgICBpZiAoISh2YWx1ZSA9PT0gdW5kZWZpbmVkICYmIG9iamVjdFtmaWVsZF0gIT09IHVuZGVmaW5lZCkpIHtcclxuICAgICAgICAgIG9iamVjdFtmaWVsZF0gPSB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH0pO1xyXG4gIHJldHVybiBvYmplY3Q7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZXRyaWV2ZXMgYSB2YWx1ZSBmcm9tIGEgbmVzdGVkIHBhdGggb24gYW4gb2JqZWN0LlxyXG4gKlxyXG4gKiBSZXR1cm5zIGFueSBmYWxzeSB2YWx1ZSBlbmNvdW50ZXJlZCB3aGlsZSB0cmF2ZXJzaW5nIHRoZSBwYXRoLlxyXG4gKlxyXG4gKiBAZXhwb3J0XHJcbiAqIEBwYXJhbSB7Kn0gb2JqXHJcbiAqIEBwYXJhbSB7c3RyaW5nW119IHBhdGhcclxuICogQHJldHVybnMgeyp9XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZGVlcEdldChvYmo6IGFueSwgcGF0aDogc3RyaW5nW10pOiBhbnkge1xyXG4gIGxldCBpbmRleCA9IC0xO1xyXG4gIGxldCByZXN1bHQgPSBvYmo7XHJcblxyXG4gIHdoaWxlICgrK2luZGV4IDwgcGF0aC5sZW5ndGgpIHtcclxuICAgIHJlc3VsdCA9IHJlc3VsdFtwYXRoW2luZGV4XV07XHJcbiAgICBpZiAoIXJlc3VsdCkge1xyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNldHMgYSB2YWx1ZSBvbiBhbiBvYmplY3QgYXQgYSBuZXN0ZWQgcGF0aC5cclxuICpcclxuICogVGhpcyBmdW5jdGlvbiB3aWxsIGNyZWF0ZSBvYmplY3RzIGFsb25nIHRoZSBwYXRoIGlmIG5lY2Vzc2FyeSB0byBhbGxvd1xyXG4gKiBzZXR0aW5nIGEgZGVlcGx5IG5lc3RlZCB2YWx1ZS5cclxuICpcclxuICogUmV0dXJucyBgZmFsc2VgIG9ubHkgaWYgdGhlIGN1cnJlbnQgdmFsdWUgaXMgYWxyZWFkeSBzdHJpY3RseSBlcXVhbCB0byB0aGVcclxuICogcmVxdWVzdGVkIGB2YWx1ZWAgYXJndW1lbnQuIE90aGVyd2lzZSByZXR1cm5zIGB0cnVlYC5cclxuICpcclxuICogQGV4cG9ydFxyXG4gKiBAcGFyYW0geyp9IG9ialxyXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSBwYXRoXHJcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcclxuICogQHJldHVybnMge2Jvb2xlYW59IHdhcyB0aGUgdmFsdWUgd2FzIGFjdHVhbGx5IGNoYW5nZWQ/XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZGVlcFNldChvYmo6IGFueSwgcGF0aDogc3RyaW5nW10sIHZhbHVlOiBhbnkpOiBib29sZWFuIHtcclxuICBsZXQgcHRyID0gb2JqO1xyXG4gIGxldCBwcm9wID0gcGF0aC5wb3AoKTtcclxuICBsZXQgc2VnbWVudDtcclxuICBmb3IgKGxldCBpID0gMCwgbCA9IHBhdGgubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICBzZWdtZW50ID0gcGF0aFtpXTtcclxuICAgIGlmIChwdHJbc2VnbWVudF0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICBwdHJbc2VnbWVudF0gPSAodHlwZW9mIHNlZ21lbnQgPT09ICdudW1iZXInKSA/IFtdIDoge307XHJcbiAgICB9XHJcbiAgICBwdHIgPSBwdHJbc2VnbWVudF07XHJcbiAgfVxyXG4gIGlmIChwdHJbcHJvcCFdID09PSB2YWx1ZSkge1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBwdHJbcHJvcCFdID0gdmFsdWU7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBGaW5kIGFuIGFycmF5IG9mIHZhbHVlcyB0aGF0IGNvcnJlc3BvbmQgdG8gdGhlIGtleXMgb2YgYW4gb2JqZWN0LlxyXG4gKlxyXG4gKiBUaGlzIGlzIGEgcG9ueWZpbGwgZm9yIGBPYmplY3QudmFsdWVzYCwgd2hpY2ggaXMgc3RpbGwgZXhwZXJpbWVudGFsLlxyXG4gKlxyXG4gKiBAZXhwb3J0XHJcbiAqIEBwYXJhbSB7Kn0gb2JqXHJcbiAqIEByZXR1cm5zIHthbnlbXX1cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBvYmplY3RWYWx1ZXMob2JqOiBhbnkpOiBhbnlbXSB7XHJcbiAgaWYgKE9iamVjdC52YWx1ZXMpIHtcclxuICAgIHJldHVybiBPYmplY3QudmFsdWVzKG9iaik7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiBPYmplY3Qua2V5cyhvYmopLm1hcChrID0+IG9ialtrXSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==