import { Record, RecordIdentity, RecordOperation } from '@orbit/data';
import { OperationProcessor } from './operation-processor';
/**
 * An operation processor that ensures that an operation is compatible with
 * its associated schema.
 *
 * @export
 * @class SchemaValidationProcessor
 * @extends {OperationProcessor}
 */
export default class SchemaValidationProcessor extends OperationProcessor {
    validate(operation: RecordOperation): void;
    _recordAdded(record: Record): void;
    _recordReplaced(record: Record): void;
    _recordRemoved(record: RecordIdentity): void;
    _keyReplaced(record: RecordIdentity): void;
    _attributeReplaced(record: RecordIdentity): void;
    _relatedRecordAdded(record: RecordIdentity, relationship: string, relatedRecord: RecordIdentity): void;
    _relatedRecordRemoved(record: RecordIdentity, relationship: string, relatedRecord: RecordIdentity): void;
    _relatedRecordsReplaced(record: RecordIdentity, relationship: string, relatedRecords: RecordIdentity[]): void;
    _relatedRecordReplaced(record: RecordIdentity, relationship: string, relatedRecord: RecordIdentity | null): void;
    _validateRecord(record: Record): void;
    _validateRecordIdentity(record: RecordIdentity): void;
}
