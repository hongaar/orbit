import { Pullable, Pushable, Resettable, Syncable, Query, QueryOrExpression, Record, RecordIdentity, Source, SourceSettings, Transform, TransformOrOperations } from '@orbit/data';
export interface LocalStorageSourceSettings extends SourceSettings {
    delimiter?: string;
    namespace?: string;
}
/**
 * Source for storing data in localStorage.
 *
 * @class LocalStorageSource
 * @extends Source
 */
export default class LocalStorageSource extends Source implements Pullable, Pushable, Resettable, Syncable {
    protected _namespace: string;
    protected _delimiter: string;
    sync: (transformOrTransforms: Transform | Transform[]) => Promise<void>;
    pull: (queryOrExpression: QueryOrExpression, options?: object, id?: string) => Promise<Transform[]>;
    push: (transformOrOperations: TransformOrOperations, options?: object, id?: string) => Promise<Transform[]>;
    /**
     * Create a new LocalStorageSource.
     *
     * @constructor
     * @param {Object} [settings]           Settings.
     * @param {Schema} [settings.schema]    Schema for source.
     * @param {String} [settings.namespace] Optional. Prefix for keys used in localStorage. Defaults to 'orbit'.
     * @param {String} [settings.delimiter] Optional. Delimiter used to separate key segments in localStorage. Defaults to '/'.
     */
    constructor(settings?: LocalStorageSourceSettings);
    readonly namespace: string;
    readonly delimiter: string;
    getKeyForRecord(record: RecordIdentity | Record): string;
    getRecord(record: RecordIdentity): Record;
    putRecord(record: Record): void;
    removeRecord(record: RecordIdentity): void;
    reset(): Promise<void>;
    _sync(transform: Transform): Promise<void>;
    _push(transform: Transform): Promise<Transform[]>;
    _pull(query: Query): Promise<Transform[]>;
    protected _applyTransform(transform: Transform): void;
}
