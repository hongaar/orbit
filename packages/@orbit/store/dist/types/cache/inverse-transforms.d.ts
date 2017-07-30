import { RecordOperation, AddRecordOperation, AddToRelatedRecordsOperation, ReplaceAttributeOperation, RemoveFromRelatedRecordsOperation, RemoveRecordOperation, ReplaceRelatedRecordsOperation, ReplaceRelatedRecordOperation, ReplaceKeyOperation, ReplaceRecordOperation } from '@orbit/data';
import Cache from '../cache';
export interface InverseTransformFunc {
    (cache: Cache, op: RecordOperation): RecordOperation;
}
declare const InverseTransforms: {
    addRecord(cache: Cache, op: AddRecordOperation): RecordOperation;
    replaceRecord(cache: Cache, op: ReplaceRecordOperation): RecordOperation;
    removeRecord(cache: Cache, op: RemoveRecordOperation): RecordOperation;
    replaceKey(cache: Cache, op: ReplaceKeyOperation): RecordOperation;
    replaceAttribute(cache: Cache, op: ReplaceAttributeOperation): RecordOperation;
    addToRelatedRecords(cache: Cache, op: AddToRelatedRecordsOperation): RecordOperation;
    removeFromRelatedRecords(cache: Cache, op: RemoveFromRelatedRecordsOperation): RecordOperation;
    replaceRelatedRecords(cache: Cache, op: ReplaceRelatedRecordsOperation): RecordOperation;
    replaceRelatedRecord(cache: Cache, op: ReplaceRelatedRecordOperation): RecordOperation;
};
export default InverseTransforms;
