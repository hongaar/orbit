import { RecordOperation } from '@orbit/data';
import { OperationProcessor } from './operation-processor';
/**
 * An operation processor that ensures that a cache's data is consistent and
 * doesn't contain any dead references.
 *
 * This is achieved by maintaining a mapping of reverse relationships for each
 * record. When a record is removed, any references to it can also be identified
 * and removed.
 *
 * @export
 * @class CacheIntegrityProcessor
 * @extends {OperationProcessor}
 */
export default class CacheIntegrityProcessor extends OperationProcessor {
    after(operation: RecordOperation): RecordOperation[];
    immediate(operation: any): void;
    finally(operation: any): RecordOperation[];
    private clearInverseRelationshipOps(record);
}
