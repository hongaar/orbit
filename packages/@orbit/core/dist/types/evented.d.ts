export declare const EVENTED = "__evented__";
/**
 * Has a class been decorated as `@evented`?
 *
 * @export
 * @param {object} obj
 * @returns {boolean}
 */
export declare function isEvented(obj: object): boolean;
/**
 * A class decorated as `@evented` should also implement the `Evented`
 * interface.
 *
 * ```ts
 * import { evented, Evented } from '@orbit/core';
 *
 * @evented
 * class Source implements Evented {
 *   // ... Evented implementation
 * }
 * ```
 *
 * @export
 * @interface Evented
 */
export interface Evented {
    on: (event: string, callback: Function, binding?: object) => void;
    off: (event: string, callback: Function, binding?: object) => void;
    one: (event: string, callback: Function, binding?: object) => void;
    emit: (event: string, ...args) => void;
    listeners: (event: string) => any[];
}
/**
 * Marks a class as evented.
 *
 * An evented class should also implement the `Evented` interface.
 *
 * ```ts
 * import { evented, Evented } from '@orbit/core';
 *
 * @evented
 * class Source implements Evented {
 *   ...
 * }
 * ```
 *
 * Listeners can then register themselves for particular events with `on`:
 *
 * ```ts
 * let source = new Source();
 *
 * function listener1(message: string) {
 *   console.log('listener1 heard ' + message);
 * };
 * function listener2(message: string) {
 *   console.log('listener2 heard ' + message);
 * };
 *
 * source.on('greeting', listener1);
 * source.on('greeting', listener2);
 *
 * evented.emit('greeting', 'hello'); // logs "listener1 heard hello" and
 *                                    //      "listener2 heard hello"
 * ```
 *
 * Listeners can be unregistered from events at any time with `off`:
 *
 * ```ts
 * source.off('greeting', listener2);
 * ```
 *
 * @decorator
 * @export
 * @param {*} Klass
 */
export default function evented(Klass: any): void;
/**
 * Settle any promises returned by event listeners in series.
 *
 * If any errors are encountered during processing, they will be ignored.
 *
 * @export
 * @param {Evented} obj
 * @param {any} eventName
 * @param {any} args
 * @returns {Promise<void>}
 */
export declare function settleInSeries(obj: Evented, eventName: any, ...args: any[]): Promise<void>;
/**
 * Fulfill any promises returned by event listeners in series.
 *
 * Processing will stop if an error is encountered and the returned promise will
 * be rejected.
 *
 * @export
 * @param {Evented} obj
 * @param {any} eventName
 * @param {any} args
 * @returns {Promise<void>}
 */
export declare function fulfillInSeries(obj: Evented, eventName: any, ...args: any[]): Promise<void>;
