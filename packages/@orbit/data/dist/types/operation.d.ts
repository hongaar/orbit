import { Record, RecordIdentity } from './record';
/**
 * Base Operation interface, which requires just an `op` string.
 *
 * @export
 * @interface Operation
 */
export interface Operation {
    op: string;
}
/**
 * Add record operation.
 *
 * @export
 * @interface AddRecordOperation
 * @extends {Operation}
 */
export interface AddRecordOperation extends Operation {
    op: 'addRecord';
    record: Record;
}
/**
 * Replace record operation.
 *
 * @export
 * @interface ReplaceRecordOperation
 * @extends {Operation}
 */
export interface ReplaceRecordOperation extends Operation {
    op: 'replaceRecord';
    record: Record;
}
/**
 * Remove record operation.
 *
 * @export
 * @interface RemoveRecordOperation
 * @extends {Operation}
 */
export interface RemoveRecordOperation extends Operation {
    op: 'removeRecord';
    record: RecordIdentity;
}
/**
 * Replace key operation.
 *
 * @export
 * @interface ReplaceKeyOperation
 * @extends {Operation}
 */
export interface ReplaceKeyOperation extends Operation {
    op: 'replaceKey';
    record: RecordIdentity;
    key: string;
    value: string;
}
/**
 * Replace attribute operation.
 *
 * @export
 * @interface ReplaceAttributeOperation
 * @extends {Operation}
 */
export interface ReplaceAttributeOperation extends Operation {
    op: 'replaceAttribute';
    record: RecordIdentity;
    attribute: string;
    value: any;
}
/**
 * Add to has-many relationship operation.
 *
 * @export
 * @interface AddToRelatedRecordsOperation
 * @extends {Operation}
 */
export interface AddToRelatedRecordsOperation extends Operation {
    op: 'addToRelatedRecords';
    record: RecordIdentity;
    relationship: string;
    relatedRecord: RecordIdentity;
}
/**
 * Remove from has-many relationship operation.
 *
 * @export
 * @interface RemoveFromRelatedRecordsOperation
 * @extends {Operation}
 */
export interface RemoveFromRelatedRecordsOperation extends Operation {
    op: 'removeFromRelatedRecords';
    record: RecordIdentity;
    relationship: string;
    relatedRecord: RecordIdentity;
}
/**
 * Replace has-many relationship operation.
 *
 * @export
 * @interface ReplaceRelatedRecordsOperation
 * @extends {Operation}
 */
export interface ReplaceRelatedRecordsOperation extends Operation {
    op: 'replaceRelatedRecords';
    record: RecordIdentity;
    relationship: string;
    relatedRecords: RecordIdentity[];
}
/**
 * Replace has-one relationship operation.
 *
 * @export
 * @interface ReplaceRelatedRecordOperation
 * @extends {Operation}
 */
export interface ReplaceRelatedRecordOperation extends Operation {
    op: 'replaceRelatedRecord';
    record: RecordIdentity;
    relationship: string;
    relatedRecord: RecordIdentity | null;
}
/**
 * Union of all record-related operations.
 *
 * @export
 */
export declare type RecordOperation = AddRecordOperation | ReplaceRecordOperation | RemoveRecordOperation | ReplaceKeyOperation | ReplaceAttributeOperation | AddToRelatedRecordsOperation | RemoveFromRelatedRecordsOperation | ReplaceRelatedRecordsOperation | ReplaceRelatedRecordOperation;
/**
 * Coalesces operations into a minimal set of equivalent operations.
 *
 * This method respects the order of the operations array and does not allow
 * reordering of operations that affect relationships.
 *
 * @export
 * @param {RecordOperation[]} operations
 * @returns {RecordOperation[]}
 */
export declare function coalesceRecordOperations(operations: RecordOperation[]): RecordOperation[];
/**
 * Determine the differences between a record and its updated version in terms
 * of a set of operations.
 *
 * @export
 * @param {Record} record
 * @param {Record} updatedRecord
 * @returns {RecordOperation[]}
 */
export declare function recordDiffs(record: Record, updatedRecord: Record): RecordOperation[];
