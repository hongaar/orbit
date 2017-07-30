import { AddRecordOperation, AddToRelatedRecordsOperation, ReplaceAttributeOperation, RemoveFromRelatedRecordsOperation, RemoveRecordOperation, ReplaceRelatedRecordsOperation, ReplaceRelatedRecordOperation, ReplaceKeyOperation, ReplaceRecordOperation } from '@orbit/data';
import Source from '../source';
declare const _default: {
    addRecord(source: Source, operation: AddRecordOperation): void;
    replaceRecord(source: Source, operation: ReplaceRecordOperation): void;
    removeRecord(source: Source, operation: RemoveRecordOperation): void;
    replaceKey(source: Source, operation: ReplaceKeyOperation): void;
    replaceAttribute(source: Source, operation: ReplaceAttributeOperation): void;
    addToRelatedRecords(source: Source, operation: AddToRelatedRecordsOperation): void;
    removeFromRelatedRecords(source: Source, operation: RemoveFromRelatedRecordsOperation): void;
    replaceRelatedRecords(source: Source, operation: ReplaceRelatedRecordsOperation): void;
    replaceRelatedRecord(source: Source, operation: ReplaceRelatedRecordOperation): void;
};
export default _default;
