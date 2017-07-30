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
export declare function eq(a: any, b: any): boolean;
