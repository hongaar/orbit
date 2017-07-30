import { AddRecordOperation, AddToRelatedRecordsOperation, ReplaceAttributeOperation, RemoveFromRelatedRecordsOperation, RemoveRecordOperation, ReplaceRelatedRecordsOperation, ReplaceRelatedRecordOperation, ReplaceKeyOperation, ReplaceRecordOperation } from '@orbit/data';
import Source from '../source';
declare const _default: {
    addRecord(source: Source, operation: AddRecordOperation): Promise<void>;
    replaceRecord(source: Source, operation: ReplaceRecordOperation): Promise<void>;
    removeRecord(source: Source, operation: RemoveRecordOperation): Promise<void>;
    replaceKey(source: Source, operation: ReplaceKeyOperation): Promise<void>;
    replaceAttribute(source: Source, operation: ReplaceAttributeOperation): Promise<void>;
    addToRelatedRecords(source: Source, operation: AddToRelatedRecordsOperation): Promise<void>;
    removeFromRelatedRecords(source: Source, operation: RemoveFromRelatedRecordsOperation): Promise<void>;
    replaceRelatedRecords(source: Source, operation: ReplaceRelatedRecordsOperation): Promise<void>;
    replaceRelatedRecord(source: Source, operation: ReplaceRelatedRecordOperation): Promise<void>;
};
export default _default;
