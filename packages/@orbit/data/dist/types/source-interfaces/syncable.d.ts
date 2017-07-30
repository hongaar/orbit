import { Source, SourceClass } from '../source';
import { Transform } from '../transform';
export declare const SYNCABLE = "__syncable__";
/**
 * Has a source been decorated as `@syncable`?
 *
 * @export
 * @param {SourceClass} source
 * @returns
 */
export declare function isSyncable(source: Source): boolean;
/**
 * A source decorated as `@syncable` must also implement the `Syncable`
 * interface.
 *
 * @export
 * @interface Syncable
 */
export interface Syncable {
    /**
     * The `sync` method to a source. This method accepts a `Transform` or array
     * of `Transform`s as an argument and applies it to the source.
     *
     * @param {(Transform | Transform[])} transformOrTransforms
     * @returns {Promise<void>}
     *
     * @memberOf Syncable
     */
    sync(transformOrTransforms: Transform | Transform[]): Promise<void>;
}
/**
 * Marks a source as "syncable" and adds an implementation of the `Syncable`
 * interface.
 *
 * The `sync` method is part of the "sync flow" in Orbit. This flow is used to
 * synchronize the contents of sources.
 *
 * Other sources can participate in the resolution of a `sync` by observing the
 * `transform` event, which is emitted whenever a new `Transform` is applied to
 * a source.
 *
 * @export
 * @decorator
 * @param {SourceClass} Klass
 * @returns {void}
 */
export default function syncable(Klass: SourceClass): void;
