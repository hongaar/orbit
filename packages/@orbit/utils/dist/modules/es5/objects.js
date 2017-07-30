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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2JqZWN0cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNyYy9vYmplY3RzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxBQUFnQzs7O0FBRWhDLEFBU0c7Ozs7Ozs7Ozs7QUFDSCxlQUFzQixBQUFRO0FBQzVCLEFBQUUsQUFBQyxRQUFDLEFBQUcsUUFBSyxBQUFTLGFBQUksQUFBRyxRQUFLLEFBQUksUUFBSSxPQUFPLEFBQUcsUUFBSyxBQUFRLEFBQUMsVUFBQyxBQUFDO0FBQUMsQUFBTSxlQUFDLEFBQUcsQUFBQyxBQUFDO0FBQUM7QUFFakYsUUFBSSxBQUFHLEFBQUM7QUFDUixRQUFJLEFBQUksT0FBRyxBQUFNLE9BQUMsQUFBUyxVQUFDLEFBQVEsU0FBQyxBQUFJLEtBQUMsQUFBRyxBQUFDLEFBQUM7QUFFL0MsQUFBRSxBQUFDLFFBQUMsQUFBSSxTQUFLLEFBQWUsQUFBQyxpQkFBQyxBQUFDO0FBQzdCLEFBQUcsY0FBRyxJQUFJLEFBQUksQUFBRSxBQUFDO0FBQ2pCLEFBQUcsWUFBQyxBQUFPLFFBQUMsQUFBRyxJQUFDLEFBQU8sQUFBRSxBQUFDLEFBQUMsQUFDN0I7QUFBQyxBQUFDLEFBQUksZUFBSyxBQUFJLFNBQUssQUFBaUIsQUFBQyxtQkFBQyxBQUFDO0FBQ3RDLEFBQUcsY0FBRyxBQUFHLElBQUMsQUFBVyxZQUFDLEFBQUcsQUFBQyxBQUFDLEFBQzdCO0FBQUMsQUFBQyxBQUFJLEtBRkMsQUFBRSxBQUFDLFVBRUMsQUFBSSxTQUFLLEFBQWdCLEFBQUMsa0JBQUMsQUFBQztBQUNyQyxBQUFHLGNBQUcsQUFBRSxBQUFDO0FBQ1QsQUFBRyxBQUFDLGFBQUMsSUFBSSxBQUFDLElBQUcsQUFBQyxHQUFFLEFBQUcsTUFBRyxBQUFHLElBQUMsQUFBTSxRQUFFLEFBQUMsSUFBRyxBQUFHLEtBQUUsQUFBQyxBQUFFLEtBQUUsQUFBQztBQUMvQyxBQUFFLEFBQUMsZ0JBQUMsQUFBRyxJQUFDLEFBQWMsZUFBQyxBQUFDLEFBQUMsQUFBQyxJQUFDLEFBQUM7QUFDMUIsQUFBRyxvQkFBQyxBQUFJLEtBQUMsQUFBSyxNQUFDLEFBQUcsSUFBQyxBQUFDLEFBQUMsQUFBQyxBQUFDLEFBQUMsQUFDMUI7QUFBQyxBQUNIO0FBQUMsQUFDSDtBQUFDLEFBQUMsQUFBSSxLQVBDLEFBQUUsQUFBQyxNQU9ILEFBQUM7QUFDTixZQUFJLEFBQUcsQUFBQztBQUVSLEFBQUcsY0FBRyxBQUFFLEFBQUM7QUFDVCxBQUFHLEFBQUMsYUFBQyxJQUFJLEFBQUcsT0FBSSxBQUFHLEFBQUMsS0FBQyxBQUFDO0FBQ3BCLEFBQUUsQUFBQyxnQkFBQyxBQUFHLElBQUMsQUFBYyxlQUFDLEFBQUcsQUFBQyxBQUFDLE1BQUMsQUFBQztBQUM1QixBQUFHLHNCQUFHLEFBQUcsSUFBQyxBQUFHLEFBQUMsQUFBQztBQUNmLEFBQUUsQUFBQyxvQkFBQyxPQUFPLEFBQUcsUUFBSyxBQUFRLEFBQUMsVUFBQyxBQUFDO0FBQUMsQUFBRywwQkFBRyxBQUFLLE1BQUMsQUFBRyxBQUFDLEFBQUMsQUFBQztBQUFDO0FBQ2xELEFBQUcsb0JBQUMsQUFBRyxBQUFDLE9BQUcsQUFBRyxBQUFDLEFBQ2pCO0FBQUMsQUFDSDtBQUFDLEFBQ0g7QUFBQztBQUNELEFBQU0sV0FBQyxBQUFHLEFBQUMsQUFDYjtBQUFDO0FBL0JELGdCQStCQztBQUVELEFBUUc7Ozs7Ozs7OztBQUNILGdCQUF1QixBQUFtQixhQUFFLEFBQWM7QUFDeEQsUUFBSSxBQUFVLEFBQUM7QUFDZixBQUFFLEFBQUMsUUFBQyxBQUFTLFVBQUMsQUFBTSxTQUFHLEFBQUMsQUFBQyxHQUFDLEFBQUM7QUFDekIsQUFBVSxxQkFBRyxBQUFLLE1BQUMsQUFBUyxVQUFDLEFBQUssTUFBQyxBQUFJLEtBQUMsQUFBUyxXQUFFLEFBQUMsQUFBQyxBQUFDLEFBQ3hEO0FBQUMsQUFBQyxBQUFJLFdBQUMsQUFBQztBQUNOLEFBQVUscUJBQUcsQUFBTSxPQUFDLEFBQUksS0FBQyxBQUFNLEFBQUMsQUFBQyxBQUNuQztBQUFDO0FBRUQsQUFBVSxlQUFDLEFBQU8sUUFBQyxVQUFTLEFBQUM7QUFDM0IsQUFBRSxBQUFDLFlBQUMsT0FBTyxBQUFNLE9BQUMsQUFBQyxBQUFDLE9BQUssQUFBVSxBQUFDLFlBQUMsQUFBQztBQUNwQyxBQUFXLHdCQUFDLEFBQUMsQUFBQyxLQUFHO0FBQ2YsQUFBTSx1QkFBQyxBQUFNLE9BQUMsQUFBQyxBQUFDLEdBQUMsQUFBSyxNQUFDLEFBQU0sUUFBRSxBQUFTLEFBQUMsQUFBQyxBQUM1QztBQUFDLEFBQUMsQUFDSjtBQUFDLEFBQUMsQUFBSSxlQUFDLEFBQUM7QUFDTixBQUFXLHdCQUFDLEFBQUMsQUFBQyxLQUFHLEFBQU0sT0FBQyxBQUFDLEFBQUMsQUFBQyxBQUM3QjtBQUFDLEFBQ0g7QUFBQyxBQUFDLEFBQUMsQUFDTDtBQUFDO0FBakJELGlCQWlCQztBQUVELEFBT0c7Ozs7Ozs7O0FBQ0gsZ0JBQXVCLEFBQW1CO0FBQUUsa0JBQVU7U0FBVixTQUFVLEdBQVYsZUFBVSxRQUFWLEFBQVU7QUFBVixvQ0FBVTs7QUFDcEQsQUFBTyxZQUFDLEFBQU8sUUFBQyxVQUFTLEFBQU07QUFDN0IsQUFBRyxBQUFDLGFBQUMsSUFBSSxBQUFDLEtBQUksQUFBTSxBQUFDLFFBQUMsQUFBQztBQUNyQixBQUFFLEFBQUMsZ0JBQUMsQUFBTSxPQUFDLEFBQWMsZUFBQyxBQUFDLEFBQUMsQUFBQyxJQUFDLEFBQUM7QUFDN0IsQUFBVyw0QkFBQyxBQUFDLEFBQUMsS0FBRyxBQUFNLE9BQUMsQUFBQyxBQUFDLEFBQUMsQUFDN0I7QUFBQyxBQUNIO0FBQUMsQUFDSDtBQUFDLEFBQUMsQUFBQztBQUNILEFBQU0sV0FBQyxBQUFXLEFBQUMsQUFDckI7QUFBQztBQVRELGlCQVNDO0FBRUQsQUFNRzs7Ozs7OztBQUNILGlCQUF3QixBQUFRO0FBQzlCLEFBQU0sV0FBQyxBQUFNLE9BQUMsQUFBUyxVQUFDLEFBQVEsU0FBQyxBQUFJLEtBQUMsQUFBRyxBQUFDLFNBQUssQUFBZ0IsQUFBQyxBQUNsRTtBQUFDO0FBRkQsa0JBRUM7QUFFRCxBQU1HOzs7Ozs7O0FBQ0gsaUJBQXdCLEFBQVE7QUFDOUIsQUFBRSxBQUFDLFFBQUMsQUFBTSxPQUFDLEFBQUcsQUFBQyxBQUFDLE1BQUMsQUFBQztBQUNoQixBQUFNLGVBQUMsQUFBRSxBQUFDLEFBQ1o7QUFBQyxBQUFDLEFBQUksV0FBQyxBQUFDO0FBQ04sQUFBTSxlQUFDLEFBQU8sUUFBQyxBQUFHLEFBQUMsT0FBRyxBQUFHLE1BQUcsQ0FBQyxBQUFHLEFBQUMsQUFBQyxBQUNwQztBQUFDLEFBQ0g7QUFBQztBQU5ELGtCQU1DO0FBRUQsQUFNRzs7Ozs7OztBQUNILGtCQUF5QixBQUFRO0FBQy9CLEFBQU0sV0FBQyxBQUFHLFFBQUssQUFBSSxRQUFJLE9BQU8sQUFBRyxRQUFLLEFBQVEsQUFBQyxBQUNqRDtBQUFDO0FBRkQsbUJBRUM7QUFFRCxBQU1HOzs7Ozs7O0FBQ0gsZ0JBQXVCLEFBQVE7QUFDN0IsQUFBTSxXQUFDLEFBQUcsUUFBSyxBQUFTLGFBQUksQUFBRyxRQUFLLEFBQUksQUFBQyxBQUMzQztBQUFDO0FBRkQsaUJBRUM7QUFFRCxBQVNHOzs7Ozs7Ozs7O0FBQ0gsZUFBc0IsQUFBYztBQUFFLGtCQUFvQjtTQUFwQixTQUFvQixHQUFwQixlQUFvQixRQUFwQixBQUFvQjtBQUFwQixvQ0FBb0I7O0FBQ3hELEFBQU8sWUFBQyxBQUFPLFFBQUMsVUFBQSxBQUFNO0FBQ3BCLEFBQU0sZUFBQyxBQUFJLEtBQUMsQUFBTSxBQUFDLFFBQUMsQUFBTyxRQUFDLFVBQVMsQUFBSztBQUN4QyxBQUFFLEFBQUMsZ0JBQUMsQUFBTSxPQUFDLEFBQWMsZUFBQyxBQUFLLEFBQUMsQUFBQyxRQUFDLEFBQUM7QUFDakMsb0JBQUksQUFBSyxRQUFHLEFBQU0sT0FBQyxBQUFLLEFBQUMsQUFBQztBQUMxQixBQUFFLEFBQUMsb0JBQUMsQUFBQyxFQUFDLEFBQUssVUFBSyxBQUFTLGFBQUksQUFBTSxPQUFDLEFBQUssQUFBQyxXQUFLLEFBQVMsQUFBQyxBQUFDLFlBQUMsQUFBQztBQUMxRCxBQUFNLDJCQUFDLEFBQUssQUFBQyxTQUFHLEFBQUssQUFBQyxBQUN4QjtBQUFDLEFBQ0g7QUFBQyxBQUNIO0FBQUMsQUFBQyxBQUFDLEFBQ0w7QUFBQyxBQUFDLEFBQUM7QUFDSCxBQUFNLFdBQUMsQUFBTSxBQUFDLEFBQ2hCO0FBQUM7QUFaRCxnQkFZQztBQUVELEFBU0c7Ozs7Ozs7Ozs7QUFDSCxpQkFBd0IsQUFBVyxLQUFFLEFBQWM7QUFDakQsUUFBSSxBQUFLLFFBQUcsQ0FBQyxBQUFDLEFBQUM7QUFDZixRQUFJLEFBQU0sU0FBRyxBQUFHLEFBQUM7QUFFakIsV0FBTyxFQUFFLEFBQUssUUFBRyxBQUFJLEtBQUMsQUFBTSxRQUFFLEFBQUM7QUFDN0IsQUFBTSxpQkFBRyxBQUFNLE9BQUMsQUFBSSxLQUFDLEFBQUssQUFBQyxBQUFDLEFBQUM7QUFDN0IsQUFBRSxBQUFDLFlBQUMsQ0FBQyxBQUFNLEFBQUMsUUFBQyxBQUFDO0FBQ1osQUFBTSxtQkFBQyxBQUFNLEFBQUMsQUFDaEI7QUFBQyxBQUNIO0FBQUM7QUFFRCxBQUFNLFdBQUMsQUFBTSxBQUFDLEFBQ2hCO0FBQUM7QUFaRCxrQkFZQztBQUVELEFBY0c7Ozs7Ozs7Ozs7Ozs7OztBQUNILGlCQUF3QixBQUFXLEtBQUUsQUFBYyxNQUFFLEFBQVU7QUFDN0QsUUFBSSxBQUFHLE1BQUcsQUFBRyxBQUFDO0FBQ2QsUUFBSSxBQUFJLE9BQUcsQUFBSSxLQUFDLEFBQUcsQUFBRSxBQUFDO0FBQ3RCLFFBQUksQUFBTyxBQUFDO0FBQ1osQUFBRyxBQUFDLFNBQUMsSUFBSSxBQUFDLElBQUcsQUFBQyxHQUFFLEFBQUMsSUFBRyxBQUFJLEtBQUMsQUFBTSxRQUFFLEFBQUMsSUFBRyxBQUFDLEdBQUUsQUFBQyxBQUFFLEtBQUUsQUFBQztBQUM1QyxBQUFPLGtCQUFHLEFBQUksS0FBQyxBQUFDLEFBQUMsQUFBQztBQUNsQixBQUFFLEFBQUMsWUFBQyxBQUFHLElBQUMsQUFBTyxBQUFDLGFBQUssQUFBUyxBQUFDLFdBQUMsQUFBQztBQUMvQixBQUFHLGdCQUFDLEFBQU8sQUFBQyxXQUFJLE9BQU8sQUFBTyxZQUFLLEFBQVEsQUFBQyxRQUE3QixHQUFnQyxBQUFFLEtBQUcsQUFBRSxBQUFDLEFBQ3pEO0FBQUM7QUFDRCxBQUFHLGNBQUcsQUFBRyxJQUFDLEFBQU8sQUFBQyxBQUFDLEFBQ3JCO0FBQUM7QUFDRCxBQUFFLEFBQUMsUUFBQyxBQUFHLElBQUMsQUFBSSxBQUFDLFVBQUssQUFBSyxBQUFDLE9BQUMsQUFBQztBQUN4QixBQUFNLGVBQUMsQUFBSyxBQUFDLEFBQ2Y7QUFBQyxBQUFDLEFBQUksV0FBQyxBQUFDO0FBQ04sQUFBRyxZQUFDLEFBQUksQUFBQyxRQUFHLEFBQUssQUFBQztBQUNsQixBQUFNLGVBQUMsQUFBSSxBQUFDLEFBQ2Q7QUFBQyxBQUNIO0FBQUM7QUFqQkQsa0JBaUJDO0FBRUQsQUFRRzs7Ozs7Ozs7O0FBQ0gsc0JBQTZCLEFBQVc7QUFDdEMsQUFBRSxBQUFDLFFBQUMsQUFBTSxPQUFDLEFBQU0sQUFBQyxRQUFDLEFBQUM7QUFDbEIsQUFBTSxlQUFDLEFBQU0sT0FBQyxBQUFNLE9BQUMsQUFBRyxBQUFDLEFBQUMsQUFDNUI7QUFBQyxBQUFDLEFBQUksV0FBQyxBQUFDO0FBQ04sQUFBTSxzQkFBUSxBQUFJLEtBQUMsQUFBRyxBQUFDLEtBQUMsQUFBRyxJQUFDLFVBQUEsQUFBQztBQUFJLG1CQUFBLEFBQUcsSUFBSCxBQUFJLEFBQUMsQUFBQztBQUFBLEFBQUMsQUFBQyxBQUMzQyxTQURTLEFBQU07QUFDZCxBQUNIO0FBQUM7QUFORCx1QkFNQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIHZhbGlkLWpzZG9jICovXHJcblxyXG4vKipcclxuICogQ2xvbmVzIGEgdmFsdWUuIElmIHRoZSB2YWx1ZSBpcyBhbiBvYmplY3QsIGEgZGVlcGx5IG5lc3RlZCBjbG9uZSB3aWxsIGJlXHJcbiAqIGNyZWF0ZWQuXHJcbiAqXHJcbiAqIFRyYXZlcnNlcyBhbGwgb2JqZWN0IHByb3BlcnRpZXMgKGJ1dCBub3QgcHJvdG90eXBlIHByb3BlcnRpZXMpLlxyXG4gKlxyXG4gKiBAZXhwb3J0XHJcbiAqIEBwYXJhbSB7Kn0gb2JqXHJcbiAqIEByZXR1cm5zIHsqfSBDbG9uZSBvZiB0aGUgaW5wdXQgYG9iamBcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBjbG9uZShvYmo6IGFueSk6IGFueSB7XHJcbiAgaWYgKG9iaiA9PT0gdW5kZWZpbmVkIHx8IG9iaiA9PT0gbnVsbCB8fCB0eXBlb2Ygb2JqICE9PSAnb2JqZWN0JykgeyByZXR1cm4gb2JqOyB9XHJcblxyXG4gIGxldCBkdXA7XHJcbiAgbGV0IHR5cGUgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKTtcclxuXHJcbiAgaWYgKHR5cGUgPT09ICdbb2JqZWN0IERhdGVdJykge1xyXG4gICAgZHVwID0gbmV3IERhdGUoKTtcclxuICAgIGR1cC5zZXRUaW1lKG9iai5nZXRUaW1lKCkpO1xyXG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gJ1tvYmplY3QgUmVnRXhwXScpIHtcclxuICAgIGR1cCA9IG9iai5jb25zdHJ1Y3RvcihvYmopO1xyXG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gJ1tvYmplY3QgQXJyYXldJykge1xyXG4gICAgZHVwID0gW107XHJcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gb2JqLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoaSkpIHtcclxuICAgICAgICBkdXAucHVzaChjbG9uZShvYmpbaV0pKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICB2YXIgdmFsO1xyXG5cclxuICAgIGR1cCA9IHt9O1xyXG4gICAgZm9yICh2YXIga2V5IGluIG9iaikge1xyXG4gICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICB2YWwgPSBvYmpba2V5XTtcclxuICAgICAgICBpZiAodHlwZW9mIHZhbCA9PT0gJ29iamVjdCcpIHsgdmFsID0gY2xvbmUodmFsKTsgfVxyXG4gICAgICAgIGR1cFtrZXldID0gdmFsO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBkdXA7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBFeHBvc2UgcHJvcGVydGllcyBhbmQgbWV0aG9kcyBmcm9tIG9uZSBvYmplY3Qgb24gYW5vdGhlci5cclxuICpcclxuICogTWV0aG9kcyB3aWxsIGJlIGNhbGxlZCBvbiBgc291cmNlYCBhbmQgd2lsbCBtYWludGFpbiBgc291cmNlYCBhcyB0aGUgY29udGV4dC5cclxuICpcclxuICogQGV4cG9ydFxyXG4gKiBAcGFyYW0ge29iamVjdH0gZGVzdGluYXRpb25cclxuICogQHBhcmFtIHtvYmplY3R9IHNvdXJjZVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGV4cG9zZShkZXN0aW5hdGlvbjogb2JqZWN0LCBzb3VyY2U6IG9iamVjdCk6IHZvaWQge1xyXG4gIGxldCBwcm9wZXJ0aWVzO1xyXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMikge1xyXG4gICAgcHJvcGVydGllcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XHJcbiAgfSBlbHNlIHtcclxuICAgIHByb3BlcnRpZXMgPSBPYmplY3Qua2V5cyhzb3VyY2UpO1xyXG4gIH1cclxuXHJcbiAgcHJvcGVydGllcy5mb3JFYWNoKGZ1bmN0aW9uKHApIHtcclxuICAgIGlmICh0eXBlb2Ygc291cmNlW3BdID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgIGRlc3RpbmF0aW9uW3BdID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHNvdXJjZVtwXS5hcHBseShzb3VyY2UsIGFyZ3VtZW50cyk7XHJcbiAgICAgIH07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBkZXN0aW5hdGlvbltwXSA9IHNvdXJjZVtwXTtcclxuICAgIH1cclxuICB9KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEV4dGVuZCBhbiBvYmplY3Qgd2l0aCB0aGUgcHJvcGVydGllcyBvZiBvbmUgb3IgbW9yZSBvdGhlciBvYmplY3RzLlxyXG4gKlxyXG4gKiBAZXhwb3J0XHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBkZXN0aW5hdGlvblxyXG4gKiBAcGFyYW0ge2FueX0gc291cmNlc1xyXG4gKiBAcmV0dXJucyB7b2JqZWN0fVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGV4dGVuZChkZXN0aW5hdGlvbjogb2JqZWN0LCAuLi5zb3VyY2VzKTogb2JqZWN0IHtcclxuICBzb3VyY2VzLmZvckVhY2goZnVuY3Rpb24oc291cmNlKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIHNvdXJjZSkge1xyXG4gICAgICBpZiAoc291cmNlLmhhc093blByb3BlcnR5KHApKSB7XHJcbiAgICAgICAgZGVzdGluYXRpb25bcF0gPSBzb3VyY2VbcF07XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KTtcclxuICByZXR1cm4gZGVzdGluYXRpb247XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDaGVja3Mgd2hldGhlciBhbiBvYmplY3QgaXMgYW4gaW5zdGFuY2Ugb2YgYW4gYEFycmF5YFxyXG4gKlxyXG4gKiBAZXhwb3J0XHJcbiAqIEBwYXJhbSB7Kn0gb2JqXHJcbiAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGlzQXJyYXkob2JqOiBhbnkpOiBib29sZWFuIHtcclxuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IEFycmF5XSc7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDb252ZXJ0cyBhbiBvYmplY3QgdG8gYW4gYEFycmF5YCBpZiBpdCdzIG5vdCBhbHJlYWR5LlxyXG4gKlxyXG4gKiBAZXhwb3J0XHJcbiAqIEBwYXJhbSB7Kn0gb2JqXHJcbiAqIEByZXR1cm5zIHthbnlbXX1cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiB0b0FycmF5KG9iajogYW55KTogYW55W10ge1xyXG4gIGlmIChpc05vbmUob2JqKSkge1xyXG4gICAgcmV0dXJuIFtdO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gaXNBcnJheShvYmopID8gb2JqIDogW29ial07XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogQ2hlY2tzIHdoZXRoZXIgYSB2YWx1ZSBpcyBhIG5vbi1udWxsIG9iamVjdFxyXG4gKlxyXG4gKiBAZXhwb3J0XHJcbiAqIEBwYXJhbSB7Kn0gb2JqXHJcbiAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGlzT2JqZWN0KG9iajogYW55KTogYm9vbGVhbiB7XHJcbiAgcmV0dXJuIG9iaiAhPT0gbnVsbCAmJiB0eXBlb2Ygb2JqID09PSAnb2JqZWN0JztcclxufVxyXG5cclxuLyoqXHJcbiAqIENoZWNrcyB3aGV0aGVyIGFuIG9iamVjdCBpcyBudWxsIG9yIHVuZGVmaW5lZFxyXG4gKlxyXG4gKiBAZXhwb3J0XHJcbiAqIEBwYXJhbSB7Kn0gb2JqXHJcbiAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGlzTm9uZShvYmo6IGFueSk6IGJvb2xlYW4ge1xyXG4gIHJldHVybiBvYmogPT09IHVuZGVmaW5lZCB8fCBvYmogPT09IG51bGw7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBNZXJnZXMgcHJvcGVydGllcyBmcm9tIG90aGVyIG9iamVjdHMgaW50byBhIGJhc2Ugb2JqZWN0LiBQcm9wZXJ0aWVzIHRoYXRcclxuICogcmVzb2x2ZSB0byBgdW5kZWZpbmVkYCB3aWxsIG5vdCBvdmVyd3JpdGUgcHJvcGVydGllcyBvbiB0aGUgYmFzZSBvYmplY3RcclxuICogdGhhdCBhbHJlYWR5IGV4aXN0LlxyXG4gKlxyXG4gKiBAZXhwb3J0XHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBiYXNlXHJcbiAqIEBwYXJhbSB7Li4ub2JqZWN0W119IHNvdXJjZXNcclxuICogQHJldHVybnMge29iamVjdH1cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBtZXJnZShvYmplY3Q6IG9iamVjdCwgLi4uc291cmNlczogb2JqZWN0W10pOiBvYmplY3Qge1xyXG4gIHNvdXJjZXMuZm9yRWFjaChzb3VyY2UgPT4ge1xyXG4gICAgT2JqZWN0LmtleXMoc291cmNlKS5mb3JFYWNoKGZ1bmN0aW9uKGZpZWxkKSB7XHJcbiAgICAgIGlmIChzb3VyY2UuaGFzT3duUHJvcGVydHkoZmllbGQpKSB7XHJcbiAgICAgICAgbGV0IHZhbHVlID0gc291cmNlW2ZpZWxkXTtcclxuICAgICAgICBpZiAoISh2YWx1ZSA9PT0gdW5kZWZpbmVkICYmIG9iamVjdFtmaWVsZF0gIT09IHVuZGVmaW5lZCkpIHtcclxuICAgICAgICAgIG9iamVjdFtmaWVsZF0gPSB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH0pO1xyXG4gIHJldHVybiBvYmplY3Q7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZXRyaWV2ZXMgYSB2YWx1ZSBmcm9tIGEgbmVzdGVkIHBhdGggb24gYW4gb2JqZWN0LlxyXG4gKlxyXG4gKiBSZXR1cm5zIGFueSBmYWxzeSB2YWx1ZSBlbmNvdW50ZXJlZCB3aGlsZSB0cmF2ZXJzaW5nIHRoZSBwYXRoLlxyXG4gKlxyXG4gKiBAZXhwb3J0XHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBvYmpcclxuICogQHBhcmFtIHtzdHJpbmdbXX0gcGF0aFxyXG4gKiBAcmV0dXJucyB7Kn1cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBkZWVwR2V0KG9iajogb2JqZWN0LCBwYXRoOiBzdHJpbmdbXSk6IGFueSB7XHJcbiAgbGV0IGluZGV4ID0gLTE7XHJcbiAgbGV0IHJlc3VsdCA9IG9iajtcclxuXHJcbiAgd2hpbGUgKCsraW5kZXggPCBwYXRoLmxlbmd0aCkge1xyXG4gICAgcmVzdWx0ID0gcmVzdWx0W3BhdGhbaW5kZXhdXTtcclxuICAgIGlmICghcmVzdWx0KSB7XHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG4vKipcclxuICogU2V0cyBhIHZhbHVlIG9uIGFuIG9iamVjdCBhdCBhIG5lc3RlZCBwYXRoLlxyXG4gKlxyXG4gKiBUaGlzIGZ1bmN0aW9uIHdpbGwgY3JlYXRlIG9iamVjdHMgYWxvbmcgdGhlIHBhdGggaWYgbmVjZXNzYXJ5IHRvIGFsbG93XHJcbiAqIHNldHRpbmcgYSBkZWVwbHkgbmVzdGVkIHZhbHVlLlxyXG4gKlxyXG4gKiBSZXR1cm5zIGBmYWxzZWAgb25seSBpZiB0aGUgY3VycmVudCB2YWx1ZSBpcyBhbHJlYWR5IHN0cmljdGx5IGVxdWFsIHRvIHRoZVxyXG4gKiByZXF1ZXN0ZWQgYHZhbHVlYCBhcmd1bWVudC4gT3RoZXJ3aXNlIHJldHVybnMgYHRydWVgLlxyXG4gKlxyXG4gKiBAZXhwb3J0XHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBvYmpcclxuICogQHBhcmFtIHtzdHJpbmdbXX0gcGF0aFxyXG4gKiBAcGFyYW0geyp9IHZhbHVlXHJcbiAqIEByZXR1cm5zIHtib29sZWFufSB3YXMgdGhlIHZhbHVlIHdhcyBhY3R1YWxseSBjaGFuZ2VkP1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGRlZXBTZXQob2JqOiBvYmplY3QsIHBhdGg6IHN0cmluZ1tdLCB2YWx1ZTogYW55KTogYm9vbGVhbiB7XHJcbiAgbGV0IHB0ciA9IG9iajtcclxuICBsZXQgcHJvcCA9IHBhdGgucG9wKCk7XHJcbiAgbGV0IHNlZ21lbnQ7XHJcbiAgZm9yIChsZXQgaSA9IDAsIGwgPSBwYXRoLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgc2VnbWVudCA9IHBhdGhbaV07XHJcbiAgICBpZiAocHRyW3NlZ21lbnRdID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgcHRyW3NlZ21lbnRdID0gKHR5cGVvZiBzZWdtZW50ID09PSAnbnVtYmVyJykgPyBbXSA6IHt9O1xyXG4gICAgfVxyXG4gICAgcHRyID0gcHRyW3NlZ21lbnRdO1xyXG4gIH1cclxuICBpZiAocHRyW3Byb3BdID09PSB2YWx1ZSkge1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBwdHJbcHJvcF0gPSB2YWx1ZTtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEZpbmQgYW4gYXJyYXkgb2YgdmFsdWVzIHRoYXQgY29ycmVzcG9uZCB0byB0aGUga2V5cyBvZiBhbiBvYmplY3QuXHJcbiAqXHJcbiAqIFRoaXMgaXMgYSBwb255ZmlsbCBmb3IgYE9iamVjdC52YWx1ZXNgLCB3aGljaCBpcyBzdGlsbCBleHBlcmltZW50YWwuXHJcbiAqXHJcbiAqIEBleHBvcnRcclxuICogQHBhcmFtIHtvYmplY3R9IG9ialxyXG4gKiBAcmV0dXJucyB7YW55W119XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gb2JqZWN0VmFsdWVzKG9iajogb2JqZWN0KTogYW55W10ge1xyXG4gIGlmIChPYmplY3QudmFsdWVzKSB7XHJcbiAgICByZXR1cm4gT2JqZWN0LnZhbHVlcyhvYmopO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gT2JqZWN0LmtleXMob2JqKS5tYXAoayA9PiBvYmpba10pO1xyXG4gIH1cclxufVxyXG4iXX0=