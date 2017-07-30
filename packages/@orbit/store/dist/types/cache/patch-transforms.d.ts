import { Record, RecordIdentity, RecordOperation, AddRecordOperation, AddToRelatedRecordsOperation, ReplaceAttributeOperation, RemoveFromRelatedRecordsOperation, RemoveRecordOperation, ReplaceRelatedRecordsOperation, ReplaceRelatedRecordOperation, ReplaceKeyOperation, ReplaceRecordOperation } from '@orbit/data';
import Cache, { PatchResultData } from '../cache';
export interface PatchTransformFunc {
    (cache: Cache, op: RecordOperation): PatchResultData;
}
declare const _default: {
    addRecord(cache: Cache, op: AddRecordOperation): RecordIdentity | Record;
    replaceRecord(cache: Cache, op: ReplaceRecordOperation): RecordIdentity | Record;
    removeRecord(cache: Cache, op: RemoveRecordOperation): RecordIdentity | Record;
    replaceKey(cache: Cache, op: ReplaceKeyOperation): RecordIdentity | Record;
    replaceAttribute(cache: Cache, op: ReplaceAttributeOperation): RecordIdentity | Record;
    addToRelatedRecords(cache: Cache, op: AddToRelatedRecordsOperation): RecordIdentity | Record;
    removeFromRelatedRecords(cache: Cache, op: RemoveFromRelatedRecordsOperation): RecordIdentity | Record;
    replaceRelatedRecords(cache: Cache, op: ReplaceRelatedRecordsOperation): RecordIdentity | Record;
    replaceRelatedRecord(cache: Cache, op: ReplaceRelatedRecordOperation): RecordIdentity | Record;
};
export default _default;
