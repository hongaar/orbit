import { Evented } from '@orbit/core';
import { Record, RecordIdentity, KeyMap, RecordOperation, QueryOrExpression, QueryExpression, QueryBuilder, Schema, TransformBuilder, TransformBuilderFunc } from '@orbit/data';
import { OperationProcessorClass } from './cache/operation-processors/operation-processor';
import { ImmutableMap } from '@orbit/immutable';
import RelationshipAccessor from './cache/relationship-accessor';
import InverseRelationshipAccessor from './cache/inverse-relationship-accessor';
export interface CacheSettings {
    schema?: Schema;
    keyMap?: KeyMap;
    processors?: OperationProcessorClass[];
    base?: Cache;
    queryBuilder?: QueryBuilder;
    transformBuilder?: TransformBuilder;
}
export declare type PatchResultData = Record | RecordIdentity | null;
export interface PatchResult {
    inverse: RecordOperation[];
    data: PatchResultData[];
}
/**
 * A `Cache` is an in-memory data store that can be accessed synchronously.
 *
 * Caches use operation processors to maintain internal consistency.
 *
 * Because data is stored in immutable maps, caches can be forked efficiently.
 *
 * @export
 * @class Cache
 * @implements {Evented}
 */
export default class Cache implements Evented {
    private _keyMap;
    private _schema;
    private _queryBuilder;
    private _transformBuilder;
    private _processors;
    private _records;
    private _relationships;
    private _inverseRelationships;
    on: (event: string, callback: Function, binding?: object) => void;
    off: (event: string, callback: Function, binding?: object) => void;
    one: (event: string, callback: Function, binding?: object) => void;
    emit: (event: string, ...args) => void;
    listeners: (event: string) => any[];
    constructor(settings?: CacheSettings);
    readonly keyMap: KeyMap;
    readonly schema: Schema;
    readonly queryBuilder: QueryBuilder;
    readonly transformBuilder: TransformBuilder;
    records(type: string): ImmutableMap<string, Record>;
    readonly relationships: RelationshipAccessor;
    readonly inverseRelationships: InverseRelationshipAccessor;
    /**
     Allows a client to run queries against the cache.
  
     @example
     ``` javascript
     // using a query builder callback
     cache.query(qb.record('planet', 'idabc123')).then(results => {});
     ```
  
     @example
     ``` javascript
     // using an expression
     cache.query(oqe('record', 'planet', 'idabc123')).then(results => {});
     ```
  
     @method query
     @param {Expression} query
     @return {Object} result of query (type depends on query)
     */
    query(queryOrExpression: QueryOrExpression, options?: object, id?: string): any;
    /**
     * Resets the cache's state to be either empty or to match the state of
     * another cache.
     *
     * @example
     * ``` javascript
     * cache.reset(); // empties cache
     * cache.reset(cache2); // clones the state of cache2
     * ```
     *
     * @param {Cache} [base]
     * @memberof Cache
     */
    reset(base?: Cache): void;
    /**
     * Upgrade the cache based on the current state of the schema.
     *
     * @memberof Cache
     */
    upgrade(): void;
    /**
     * Patches the document with an operation.
     *
     * @param {(Operation | Operation[] | TransformBuilderFunc)} operationOrOperations
     * @returns {Operation[]}
     * @memberof Cache
     */
    patch(operationOrOperations: RecordOperation | RecordOperation[] | TransformBuilderFunc): PatchResult;
    protected _applyOperations(ops: RecordOperation[], result: PatchResult, primary?: boolean): void;
    protected _applyOperation(operation: RecordOperation, result: PatchResult, primary?: boolean): void;
    protected _query(expression: QueryExpression): any;
}
