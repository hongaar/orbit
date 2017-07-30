import { StrategyOptions } from '../strategy';
import { ConnectionStrategy } from './connection-strategy';
export interface SyncStrategyOptions extends StrategyOptions {
    /**
     * The name of the source to be observed.
     *
     * @type {string}
     * @memberOf SyncStrategyOptions
     */
    source: string;
    /**
     * The name of the source which will be acted upon.
     *
     * @type {string}
     * @memberOf SyncStrategyOptions
     */
    target: string;
    /**
     * A handler for any errors thrown as a result of the sync operation.
     *
     * @type {Function}
     * @memberOf SyncStrategyOptions
     */
    catch?: Function;
    /**
     * A filter function that returns `true` if the sync should be performed.
     *
     * `filter` will be invoked in the context of this strategy (and thus will
     * have access to both `this.source` and `this.target`).
     *
     * @type {Function}
     * @memberOf SyncStrategyOptionss
     */
    filter?: Function;
    /**
     * Should resolution of the target's `sync` block the completion of the
     * source's `transform`?
     *
     * By default, `blocking` is false.
     *
     * @type {boolean}
     * @memberOf SyncStrategyOptionss
     */
    blocking?: boolean;
}
export declare class SyncStrategy extends ConnectionStrategy {
    constructor(options: SyncStrategyOptions);
}
