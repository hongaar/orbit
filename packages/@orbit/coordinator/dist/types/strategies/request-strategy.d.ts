import { ConnectionStrategy, ConnectionStrategyOptions } from './connection-strategy';
export interface RequestStrategyOptions extends ConnectionStrategyOptions {
}
export declare class RequestStrategy extends ConnectionStrategy {
    constructor(options: RequestStrategyOptions);
}
