import { Source } from '@orbit/data';
import { Dict } from '@orbit/utils';
import { Strategy } from './strategy';
export interface CoordinatorOptions {
    sources?: Source[];
    strategies?: Strategy[];
    defaultActivationOptions?: ActivationOptions;
}
export declare enum LogLevel {
    None = 0,
    Errors = 1,
    Warnings = 2,
    Info = 3,
}
export interface ActivationOptions {
    logLevel?: LogLevel;
}
/**
 * The Coordinator class manages a set of sources to which it applies a set of
 * coordination strategies.
 *
 * @export
 * @class Coordinator
 */
export default class Coordinator {
    protected _sources: Dict<Source>;
    protected _strategies: Dict<Strategy>;
    protected _activated: Promise<any>;
    protected _defaultActivationOptions: ActivationOptions;
    protected _currentActivationOptions: ActivationOptions;
    constructor(options?: CoordinatorOptions);
    addSource(source: Source): void;
    removeSource(name: string): void;
    getSource(name: string): Source;
    readonly sources: Source[];
    readonly sourceNames: string[];
    addStrategy(strategy: Strategy): void;
    removeStrategy(name: string): void;
    getStrategy(name: string): Strategy;
    readonly strategies: Strategy[];
    readonly strategyNames: string[];
    readonly activated: Promise<void[]>;
    activate(options?: ActivationOptions): Promise<void>;
    deactivate(): Promise<void>;
}
