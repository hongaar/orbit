import Coordinator, { ActivationOptions, LogLevel } from './coordinator';
import { Source } from '@orbit/data';
export interface StrategyOptions {
    /**
     * Name of strategy.
     *
     * Used to uniquely identify this strategy in a coordinator's collection.
     *
     * @type {string}
     * @memberOf StrategyOptions
     */
    name?: string;
    /**
     * The names of sources to include in this strategy. Leave undefined
     * to include all sources registered with a coordinator.
     *
     * @type {string[]}
     * @memberOf LogTruncationOptions
     */
    sources?: string[];
    /**
     * The prefix to use for logging from this strategy.
     *
     * Defaults to `[${name}]`.
     *
     * @type {string}
     * @memberOf StrategyOptions
     */
    logPrefix?: string;
    /**
     * A specific log level for this strategy.
     *
     * Overrides the log level used when activating the coordinator.
     *
     * @type {LogLevel}
     * @memberOf StrategyOptions
     */
    logLevel?: LogLevel;
}
export declare abstract class Strategy {
    protected _name: string;
    protected _coordinator: Coordinator;
    protected _sourceNames: string[];
    protected _sources: Source[];
    protected _activated: Promise<any>;
    protected _customLogLevel: LogLevel;
    protected _logLevel: LogLevel;
    protected _logPrefix: string;
    constructor(options?: StrategyOptions);
    activate(coordinator: Coordinator, options?: ActivationOptions): Promise<any>;
    deactivate(): Promise<any>;
    readonly name: string;
    readonly coordinator: Coordinator;
    readonly sources: Source[];
    readonly logPrefix: string;
    readonly logLevel: LogLevel;
}
