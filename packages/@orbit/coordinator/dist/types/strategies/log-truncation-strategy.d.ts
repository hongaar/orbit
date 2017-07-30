import Coordinator, { ActivationOptions } from '../coordinator';
import { Strategy, StrategyOptions } from '../strategy';
import { Source, Transform } from '@orbit/data';
import { Dict } from '@orbit/utils';
export declare class LogTruncationStrategy extends Strategy {
    protected _reviewing: Promise<void>;
    protected _extraReviewNeeded: boolean;
    protected _transformListeners: Dict<(transform: Transform) => void>;
    constructor(options?: StrategyOptions);
    activate(coordinator: Coordinator, options?: ActivationOptions): Promise<any>;
    deactivate(): Promise<any>;
    _reifySources(): Promise<void>;
    _review(source: Source, transformId: string): Promise<void>;
    _truncateSources(transformId: string, relativePosition: number): any;
    _activateSource(source: Source): void;
    _deactivateSource(source: Source): void;
}
