import { Bucket, BucketSettings } from '@orbit/core';
export interface IndexedDBBucketSettings extends BucketSettings {
    storeName?: string;
}
/**
 * Bucket for persisting transient data in IndexedDB.
 *
 * @class IndexedDBBucket
 * @extends Bucket
 */
export default class IndexedDBBucket extends Bucket {
    protected _storeName: string;
    protected _db: any;
    /**
     * Create a new IndexedDBBucket.
     *
     * @constructor
     * @param {Object}  [settings = {}]
     * @param {String}  [settings.name]        Optional. Name of this bucket.
     * @param {String}  [settings.namespace]   Optional. Namespace of the bucket. Will be used for the IndexedDB database name. Defaults to 'orbit-bucket'.
     * @param {String}  [settings.storeName]   Optional. Name of the IndexedDB ObjectStore. Defaults to 'data'.
     * @param {Integer} [settings.version]     Optional. The version to open the IndexedDB database with. Defaults to `1`.
     */
    constructor(settings?: IndexedDBBucketSettings);
    upgrade(settings: IndexedDBBucketSettings): Promise<any>;
    _applySettings(settings: IndexedDBBucketSettings): Promise<void>;
    /**
     * The version to specify when opening the IndexedDB database.
     *
     * IndexedDB's default verions is 1.
     *
     * @return {Integer} Version number.
     */
    readonly dbVersion: number;
    /**
     * IndexedDB database name.
     *
     * Defaults to 'orbit-bucket', which can be overridden in the constructor.
     *
     * @return {String} Database name.
     */
    readonly dbName: string;
    /**
     * IndexedDB ObjectStore name.
     *
     * Defaults to 'settings', which can be overridden in the constructor.
     *
     * @return {String} Database name.
     */
    readonly dbStoreName: string;
    readonly isDBOpen: boolean;
    openDB(): any;
    closeDB(): void;
    reopenDB(): any;
    createDB(db: any): void;
    /**
     * Migrate database.
     *
     * @param  {IDBDatabase} db              Database to upgrade.
     * @param  {IDBVersionChangeEvent} event Event resulting from version change.
     */
    migrateDB(db: any, event: any): void;
    deleteDB(): any;
    getItem(key: string): Promise<any>;
    setItem(key: string, value: any): Promise<void>;
    removeItem(key: string): Promise<void>;
}
