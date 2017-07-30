import { QueryExpression, FindRecord, FindRelatedRecord, FindRelatedRecords, FindRecords, PageSpecifier } from './query-expression';
import { RecordIdentity } from './record';
/**
 * Query terms are used by query builders to allow for the construction of
 * query expressions in composable patterns.
 *
 * @export
 * @class QueryTerm
 */
export declare class QueryTerm {
    expression: QueryExpression;
    constructor(expression?: QueryExpression);
    toQueryExpression(): QueryExpression;
}
/**
 * A query term representing a single record.
 *
 * @export
 * @class FindRecordTerm
 * @extends {QueryTerm}
 */
export declare class FindRecordTerm extends QueryTerm {
    expression: FindRecord;
    constructor(record: RecordIdentity);
}
export declare class FindRelatedRecordTerm extends QueryTerm {
    expression: FindRelatedRecord;
    constructor(record: RecordIdentity, relationship: string);
}
export declare class FindRelatedRecordsTerm extends QueryTerm {
    expression: FindRelatedRecords;
    constructor(record: RecordIdentity, relationship: string);
}
export declare class FindRecordsTerm extends QueryTerm {
    expression: FindRecords;
    constructor(type?: string);
    /**
     * Applies sorting to a collection query.
     *
     * Sort specifiers can be expressed in object form, like:
     *
     * ```ts
     * { attribute: 'name', order: 'descending' }
     * { attribute: 'name', order: 'ascending' }
     * ```
     *
     * Or in string form, like:
     *
     * ```ts
     * '-name' // descending order
     * 'name'  // ascending order
     * ```
     *
     * @param {SortSpecifier[] | string[]} sortSpecifiers
     * @returns {RecordsTerm}
     *
     * @memberOf RecordsTerm
     */
    sort(...sortSpecifiers: any[]): FindRecordsTerm;
    /**
     * Applies pagination to a collection query.
     *
     * Note: Options are currently an opaque pass-through to remote sources.
     *
     * @param {object} options
     * @returns {RecordsTerm}
     *
     * @memberOf RecordsTerm
     */
    page(options: PageSpecifier): FindRecordsTerm;
    /**
     * Apply an advanced filter expression based on a `RecordCursor`.
     *
     * For example:
     *
     * ```ts
     * oqb
     *   .records('planet')
     *   .filter(record =>
     *     oqb.or(
     *       record.attribute('name').equal('Jupiter'),
     *       record.attribute('name').equal('Pluto')
     *     )
     *   )
     * ```
     *
     * @param {(RecordCursor) => void} predicateExpression
     * @returns {RecordsTerm}
     *
     * @memberOf RecordsTerm
     */
    filter(...filterSpecifiers: any[]): FindRecordsTerm;
}
