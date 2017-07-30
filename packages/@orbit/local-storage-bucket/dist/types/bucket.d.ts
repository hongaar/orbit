import { Bucket, BucketSettings } from '@orbit/core';
export interface LocalStorageBucketSettings extends BucketSettings {
    delimiter?: string;
}
/**
 * Bucket for persisting transient data in localStorage.
 *
 * @class LocalStorageBucket
 * @extends Bucket
 */
export default class LocalStorageBucket extends Bucket {
    private _delimiter;
    /**
     * Create a new LocalStorageBucket.
     *
     * @constructor
     * @param {Object}  [settings]           Settings.
     * @param {String}  [settings.name]      Optional. Name of this bucket. Defaults to 'localStorageBucket'.
     * @param {String}  [settings.namespace] Optional. Prefix for keys used in localStorage. Defaults to 'orbit-bucket'.
     * @param {String}  [settings.delimiter] Optional. Delimiter used to separate key segments in localStorage. Defaults to '/'.
     * @param {Integer} [settings.version]   Optional. Defaults to 1.
     */
    constructor(settings?: LocalStorageBucketSettings);
    readonly delimiter: string;
    getFullKeyForItem(key: string): string;
    getItem(key: string): Promise<any>;
    setItem(key: string, value: any): Promise<void>;
    removeItem(key: string): Promise<void>;
}
