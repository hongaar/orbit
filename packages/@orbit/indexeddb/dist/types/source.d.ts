import { Pullable, Pushable, Resettable, Syncable, Query, QueryOrExpression, Record, Source, SourceSettings, Transform, TransformOrOperations } from '@orbit/data';
export interface IndexedDBSourceSettings extends SourceSettings {
    namespace?: string;
}
/**
 * Source for storing data in IndexedDB.
 *
 * @class IndexedDBSource
 * @extends Source
 */
export default class IndexedDBSource extends Source implements Pullable, Pushable, Resettable, Syncable {
    protected _namespace: string;
    protected _db: any;
    sync: (transformOrTransforms: Transform | Transform[]) => Promise<void>;
    pull: (queryOrExpression: QueryOrExpression, options?: object, id?: string) => Promise<Transform[]>;
    push: (transformOrOperations: TransformOrOperations, options?: object, id?: string) => Promise<Transform[]>;
    /**
     * Create a new IndexedDBSource.
     *
     * @constructor
     * @param {Object}  [settings = {}]
     * @param {Schema}  [settings.schema]    Orbit Schema.
     * @param {String}  [settings.name]      Optional. Name for source. Defaults to 'indexedDB'.
     * @param {String}  [settings.namespace] Optional. Namespace of the application. Will be used for the IndexedDB database name. Defaults to 'orbit'.
     */
    constructor(settings?: IndexedDBSourceSettings);
    upgrade(): Promise<void>;
    /**
     * The version to specify when opening the IndexedDB database.
     *
     * @return {Integer} Version number.
     */
    readonly dbVersion: number;
    /**
     * IndexedDB database name.
     *
     * Defaults to the namespace of the app, which can be overridden in the constructor.
     *
     * @return {String} Database name.
     */
    readonly dbName: string;
    readonly isDBOpen: boolean;
    openDB(): Promise<any>;
    closeDB(): void;
    reopenDB(): Promise<any>;
    createDB(db: any): void;
    /**
     * Migrate database.
     *
     * @param  {IDBDatabase} db              Database to upgrade.
     * @param  {IDBVersionChangeEvent} event Event resulting from version change.
     */
    migrateDB(db: any, event: any): void;
    deleteDB(): Promise<void>;
    registerModel(db: any, model: any): void;
    getRecord(record: any): Promise<Record>;
    getRecords(type: string): Promise<Record[]>;
    readonly availableTypes: string[];
    putRecord(record: Record): Promise<void>;
    removeRecord(record: Record): Promise<void>;
    clearRecords(type: string): Promise<void>;
    reset(): Promise<void>;
    _sync(transform: Transform): Promise<void>;
    _push(transform: Transform): Promise<Transform[]>;
    _pull(query: Query): Promise<Transform[]>;
    _processTransform(transform: Transform): Promise<void>;
}
