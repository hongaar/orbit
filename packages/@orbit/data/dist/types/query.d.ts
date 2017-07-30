import { QueryExpression } from './query-expression';
import { QueryTerm } from './query-term';
import QueryBuilder from './query-builder';
export declare type QueryBuilderFunc = (QueryBuilder) => QueryExpression;
export declare type QueryOrExpression = Query | QueryExpression | QueryTerm | QueryBuilderFunc;
/**
 * Queries are used to extract data from a source.
 *
 * @export
 * @interface Query
 */
export interface Query {
    id: string;
    expression: QueryExpression;
    options?: any;
}
/**
 * A builder function for creating a Query from its constituent parts.
 *
 * If a `Query` is passed in with an `id` and `expression`, and no replacement
 * `id` or `options` are also passed in, then the `Query` will be returned
 * unchanged.
 *
 * For all other cases, a new `Query` object will be created and returned.
 *
 * Queries will be assigned the specified `queryId` as `id`. If none is
 * specified, a UUID will be generated.
 *
 * @export
 * @param {QueryOrExpression} queryOrExpression
 * @param {object} [queryOptions]
 * @param {string} [queryId]
 * @param {QueryBuilder} [queryBuilder]
 * @returns {Query}
 */
export declare function buildQuery(queryOrExpression: QueryOrExpression, queryOptions?: object, queryId?: string, queryBuilder?: QueryBuilder): Query;
