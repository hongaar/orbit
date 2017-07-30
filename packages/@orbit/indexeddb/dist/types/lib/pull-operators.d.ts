import { Dict } from '@orbit/utils';
import { QueryExpression, Transform } from '@orbit/data';
import IndexedDBSource from '../source';
export interface PullOperator {
    (source: IndexedDBSource, expression: QueryExpression): Promise<Transform[]>;
}
export declare const PullOperators: Dict<PullOperator>;
