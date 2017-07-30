import Coordinator, { ActivationOptions } from '../coordinator';
import { Strategy, StrategyOptions } from '../strategy';
import { Source } from '@orbit/data';
import { Dict } from '@orbit/utils';
export interface EventLoggingStrategyOptions extends StrategyOptions {
    events?: string[];
    interfaces?: string[];
}
export declare class EventLoggingStrategy extends Strategy {
    protected _events?: string[];
    protected _interfaces?: string[];
    protected _eventListeners: Dict<Dict<Function>>;
    constructor(options?: EventLoggingStrategyOptions);
    activate(coordinator: Coordinator, options?: ActivationOptions): Promise<any>;
    deactivate(): Promise<any>;
    protected _activateSource(source: Source): void;
    protected _deactivateSource(source: Source): void;
    protected _sourceEvents(source: Source): any[];
    protected _sourceInterfaces(source: Source): string[];
    protected _interfaceEvents(interfaceName: string): string[];
    protected _addListener(source: Source, event: string): void;
    protected _removeListener(source: Source, event: string): void;
    protected _generateListener(source: Source, event: string): (...args: any[]) => void;
}
