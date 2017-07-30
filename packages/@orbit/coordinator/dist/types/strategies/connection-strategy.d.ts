import Coordinator, { ActivationOptions } from '../coordinator';
import { Strategy, StrategyOptions } from '../strategy';
import { Source } from '@orbit/data';
export interface ConnectionStrategyOptions extends StrategyOptions {
    /**
     * The name of the source to be observed.
     *
     * @type {string}
     * @memberOf ConnectionStrategyOptions
     */
    source: string;
    /**
     * The name of the event to observe.
     *
     * @type {string}
     * @memberOf ConnectionStrategyOptions
     */
    on: string;
    /**
     * The name of the source which will be acted upon.
     *
     * @type {string}
     * @memberOf ConnectionStrategyOptions
     */
    target?: string;
    /**
     * The action to perform on the target.
     *
     * Can be specified as a string (e.g. `pull`) or a function which will be
     * invoked in the context of this strategy (and thus will have access to
     * both `this.source` and `this.target`).
     *
     * @type {(string | Function)}
     * @memberOf ConnectionStrategyOptions
     */
    action: string | Function;
    /**
     * A handler for any errors thrown as a result of performing the action.
     *
     * @type {Function}
     * @memberOf ConnectionStrategyOptions
     */
    catch?: Function;
    /**
     * A filter function that returns `true` if the `action` should be performed.
     *
     * `filter` will be invoked in the context of this strategy (and thus will
     * have access to both `this.source` and `this.target`).
     *
     * @type {Function}
     * @memberOf ConnectionStrategyOptions
     */
    filter?: Function;
    /**
     * Should resolution of `action` on the the target block the completion
     * of the source's event?
     *
     * By default, `blocking` is false.
     *
     * @type {boolean}
     * @memberOf ConnectionStrategyOptionss
     */
    blocking?: boolean;
}
export declare class ConnectionStrategy extends Strategy {
    protected _blocking: boolean;
    protected _event: string;
    protected _action: string | Function;
    protected _catch: Function;
    protected _listener: Function;
    protected _filter: Function;
    constructor(options: ConnectionStrategyOptions);
    readonly source: Source;
    readonly target: Source;
    readonly blocking: boolean;
    activate(coordinator: Coordinator, options?: ActivationOptions): Promise<any>;
    deactivate(): Promise<any>;
    protected _generateListener(): (...args: any[]) => any;
}
