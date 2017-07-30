import { Dict } from '@orbit/utils';
import { QueryExpression } from '@orbit/data';
import Cache from '../cache';
/**
 * @export
 * @interface QueryOperator
 */
export interface QueryOperator {
    (cache: Cache, expression: QueryExpression): any;
}
export declare const QueryOperators: Dict<QueryOperator>;
