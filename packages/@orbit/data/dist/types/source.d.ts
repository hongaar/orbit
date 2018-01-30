import { Evented, Bucket, TaskQueue, Task, Performer, Log } from '@orbit/core';
import KeyMap from './key-map';
import Schema from './schema';
import QueryBuilder from './query-builder';
import TransformBuilder from './transform-builder';
export interface SourceSettings {
    name?: string;
    schema?: Schema;
    keyMap?: KeyMap;
    bucket?: Bucket;
    queryBuilder?: QueryBuilder;
    transformBuilder?: TransformBuilder;
    autoUpgrade?: boolean;
}
export declare type SourceClass = (new () => Source);
/**
 Base class for sources.

 @class Source
 @namespace Orbit
 @param {Object} [settings] - settings for source
 @param {String} [settings.name] - Name for source
 @param {Schema} [settings.schema] - Schema for source
 @constructor
 */
export declare abstract class Source implements Evented, Performer {
    protected _name: string;
    protected _bucket: Bucket;
    protected _keyMap: KeyMap;
    protected _schema: Schema;
    protected _transformLog: Log;
    protected _requestQueue: TaskQueue;
    protected _syncQueue: TaskQueue;
    protected _queryBuilder: QueryBuilder;
    protected _transformBuilder: TransformBuilder;
    on: (event: string, callback: Function, binding?: object) => void;
    off: (event: string, callback: Function, binding?: object) => void;
    one: (event: string, callback: Function, binding?: object) => void;
    emit: (event: string, ...args) => void;
    listeners: (event: string) => any[];
    constructor(settings?: SourceSettings);
    readonly name: string;
    readonly schema: Schema;
    readonly keyMap: KeyMap;
    readonly bucket: Bucket;
    readonly transformLog: Log;
    readonly requestQueue: TaskQueue;
    readonly syncQueue: TaskQueue;
    readonly queryBuilder: QueryBuilder;
    readonly transformBuilder: TransformBuilder;
    perform(task: Task): Promise<any>;
    /**
     * Upgrade source as part of a schema upgrade.
     *
     * @returns {Promise<void>}
     * @memberof Source
     */
    upgrade(): Promise<void>;
    /**
     Notifies listeners that this source has been transformed by emitting the
     `transform` event.
  
     Resolves when any promises returned to event listeners are resolved.
  
     Also, adds an entry to the Source's `transformLog` for each transform.
  
     @private
     @method _transformed
     @param {Array} transforms - Transforms that have occurred.
     @returns {Promise} Promise that resolves to transforms.
    */
    private _transformed(transforms);
    private _enqueueRequest(type, data);
    private _enqueueSync(type, data);
}
