import { Dict } from '@orbit/utils';
import { QueryExpression, Transform } from '@orbit/data';
import LocalStorageSource from '../source';
export interface PullOperator {
    (source: LocalStorageSource, expression: QueryExpression): Promise<Transform[]>;
}
export declare const PullOperators: Dict<PullOperator>;
