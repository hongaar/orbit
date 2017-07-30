import { Record, RecordIdentity, RecordOperation, RelationshipDefinition } from '@orbit/data';
import { OperationProcessor } from './operation-processor';
/**
 * An operation processor that ensures that a cache's data is consistent with
 * its associated schema.
 *
 * This includes maintenance of inverse and dependent relationships.
 *
 * @export
 * @class SchemaConsistencyProcessor
 * @extends {OperationProcessor}
 */
export default class SchemaConsistencyProcessor extends OperationProcessor {
    after(operation: RecordOperation): RecordOperation[];
    _relatedRecordAdded(record: RecordIdentity, relationship: string, relatedRecord: RecordIdentity): RecordOperation[];
    _relatedRecordsAdded(record: RecordIdentity, relationship: string, relatedRecords: RecordIdentity[]): RecordOperation[];
    _relatedRecordRemoved(record: RecordIdentity, relationship: string, relatedRecord: RecordIdentity): RecordOperation[];
    _relatedRecordReplaced(record: RecordIdentity, relationship: string, relatedRecord: RecordIdentity): RecordOperation[];
    _relatedRecordsRemoved(record: RecordIdentity, relationship: string, relatedRecords: RecordIdentity[]): RecordOperation[];
    _relatedRecordsReplaced(record: RecordIdentity, relationship: string, relatedRecords: RecordIdentity[]): RecordOperation[];
    _recordAdded(record: Record): RecordOperation[];
    _recordRemoved(record: RecordIdentity): RecordOperation[];
    _recordReplaced(record: Record): RecordOperation[];
    _addRelatedRecordsOps(record: RecordIdentity, relationshipDef: RelationshipDefinition, relatedRecords: RecordIdentity[]): RecordOperation[];
    _removeRelatedRecordsOps(record: RecordIdentity, relationshipDef: RelationshipDefinition, relatedRecords: RecordIdentity[]): RecordOperation[];
    _addRelationshipOp(record: RecordIdentity, relationship: string, relatedRecord: RecordIdentity): RecordOperation;
    _removeRelationshipOp(record: RecordIdentity, relationship: string, relatedRecord: RecordIdentity): RecordOperation;
    _removeDependentRecords(relatedRecords: RecordIdentity[]): RecordOperation[];
}
