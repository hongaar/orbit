import { Evented } from './evented';
/**
 * Settings used to instantiate and/or upgrade a `Bucket`.
 *
 * @export
 * @interface BucketSettings
 */
export interface BucketSettings {
    /**
     * Name used for tracking and debugging a bucket instance.
     *
     * @type {string}
     * @memberOf BucketSettings
     */
    name?: string;
    /**
     * The namespace used by the bucket when accessing any items.
     *
     * This is used to distinguish one bucket's contents from another.
     *
     * @type {string}
     * @memberOf BucketSettings
     */
    namespace?: string;
    /**
     * The current version of the bucket.
     *
     * Used to identify the version of the bucket's schema and thus migrate it
     * as needed.
     *
     * @type {number}
     * @memberOf BucketSettings
     */
    version?: number;
}
export declare type BUCKET_EVENTS = 'upgrade';
/**
 * Buckets can persist state. The base `Bucket` class is abstract and should be
 * extended to created buckets with different persistence strategies.
 *
 * Buckets have a simple map-like interface with methods like `getItem`,
 * `setItem`, and `removeItem`. All methods return promises to enable usage with
 * asynchronous stores like IndexedDB.
 *
 * Buckets can be assigned a unique `namespace` in order to avoid collisions.
 *
 * Buckets can be assigned a version, and can be "upgraded" to a new version.
 * The upgrade process allows buckets to migrate their data between versions.
 *
 * @export
 * @abstract
 * @class Bucket
 * @implements {Evented}
 */
export declare abstract class Bucket implements Evented {
    private _name;
    private _namespace;
    private _version;
    on: (event: BUCKET_EVENTS, callback: Function, binding?: object) => void;
    off: (event: BUCKET_EVENTS, callback: Function, binding?: object) => void;
    one: (event: BUCKET_EVENTS, callback: Function, binding?: object) => void;
    emit: (event: BUCKET_EVENTS, ...args) => void;
    listeners: (event: BUCKET_EVENTS) => any[];
    /**
     * Creates an instance of `Bucket`.
     *
     * @param {BucketSettings} [settings={}]
     *
     * @memberOf Bucket
     */
    constructor(settings?: BucketSettings);
    /**
     * Retrieves an item from the bucket.
     *
     * @abstract
     * @param {string} key
     * @returns {Promise<any>}
     *
     * @memberOf Bucket
     */
    abstract getItem(key: string): Promise<any>;
    /**
     * Stores an item in the bucket.
     *
     * @abstract
     * @param {string} key
     * @param {*} value
     * @returns {Promise<void>}
     *
     * @memberOf Bucket
     */
    abstract setItem(key: string, value: any): Promise<void>;
    /**
     * Removes an item from the bucket.
     *
     * @abstract
     * @param {string} key
     * @returns {Promise<void>}
     *
     * @memberOf Bucket
     */
    abstract removeItem(key: string): Promise<void>;
    /**
     * Name used for tracking and debugging a bucket instance.
     *
     * @readonly
     * @type {string}
     * @memberOf Bucket
     */
    readonly name: string;
    /**
     * The namespace used by the bucket when accessing any items.
     *
     * This is used to distinguish one bucket's contents from another.
     *
     * @readonly
     * @type {string}
     * @memberOf Bucket
     */
    readonly namespace: string;
    /**
     * The current version of the bucket.
     *
     * To change versions, `upgrade` should be invoked.
     *
     * @readonly
     * @type {number}
     * @memberOf Bucket
     */
    readonly version: number;
    /**
     * Upgrades Bucket to a new version with new settings.
     *
     * Settings, beyond `version`, are bucket-specific.
     *
     * @param {BucketSettings} settings
     * @returns {Promise<void>}
     * @memberOf Bucket
      */
    upgrade(settings?: BucketSettings): Promise<void>;
    /**
     * Applies settings passed from a `constructor` or `upgrade`.
     *
     * @param {BucketSettings} settings
     * @returns {Promise<void>}
     * @memberOf Bucket
     */
    _applySettings(settings: BucketSettings): Promise<void>;
}
