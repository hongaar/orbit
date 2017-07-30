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
export declare function clone(obj: any): any;
/**
 * Expose properties and methods from one object on another.
 *
 * Methods will be called on `source` and will maintain `source` as the context.
 *
 * @export
 * @param {object} destination
 * @param {object} source
 */
export declare function expose(destination: object, source: object): void;
/**
 * Extend an object with the properties of one or more other objects.
 *
 * @export
 * @param {object} destination
 * @param {any} sources
 * @returns {object}
 */
export declare function extend(destination: object, ...sources: any[]): object;
/**
 * Checks whether an object is an instance of an `Array`
 *
 * @export
 * @param {*} obj
 * @returns {boolean}
 */
export declare function isArray(obj: any): boolean;
/**
 * Converts an object to an `Array` if it's not already.
 *
 * @export
 * @param {*} obj
 * @returns {any[]}
 */
export declare function toArray(obj: any): any[];
/**
 * Checks whether a value is a non-null object
 *
 * @export
 * @param {*} obj
 * @returns {boolean}
 */
export declare function isObject(obj: any): boolean;
/**
 * Checks whether an object is null or undefined
 *
 * @export
 * @param {*} obj
 * @returns {boolean}
 */
export declare function isNone(obj: any): boolean;
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
export declare function merge(object: object, ...sources: object[]): object;
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
export declare function deepGet(obj: object, path: string[]): any;
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
export declare function deepSet(obj: object, path: string[], value: any): boolean;
/**
 * Find an array of values that correspond to the keys of an object.
 *
 * This is a ponyfill for `Object.values`, which is still experimental.
 *
 * @export
 * @param {object} obj
 * @returns {any[]}
 */
export declare function objectValues(obj: object): any[];
