import { Record, RecordIdentity, RecordInitializer } from './record';
import { AddRecordOperation, ReplaceRecordOperation, RemoveRecordOperation, ReplaceKeyOperation, ReplaceAttributeOperation, AddToRelatedRecordsOperation, RemoveFromRelatedRecordsOperation, ReplaceRelatedRecordsOperation, ReplaceRelatedRecordOperation } from './operation';
export interface TransformBuilderSettings {
    recordInitializer?: RecordInitializer;
}
export default class TransformBuilder {
    private _recordInitializer;
    constructor(settings?: TransformBuilderSettings);
    readonly recordInitializer: RecordInitializer;
    /**
     * Instantiate a new `addRecord` operation.
     *
     * @param {Record} record
     * @returns {AddRecordOperation}
     */
    addRecord(record: Record): AddRecordOperation;
    /**
     * Instantiate a new `replaceRecord` operation.
     *
     * @param {Record} record
     * @returns {ReplaceRecordOperation}
     */
    replaceRecord(record: Record): ReplaceRecordOperation;
    /**
     * Instantiate a new `removeRecord` operation.
     *
     * @param {RecordIdentity} record
     * @returns {RemoveRecordOperation}
     */
    removeRecord(record: RecordIdentity): RemoveRecordOperation;
    /**
     * Instantiate a new `replaceKey` operation.
     *
     * @param {RecordIdentity} record
     * @param {string} key
     * @param {string} value
     * @returns {ReplaceKeyOperation}
     */
    replaceKey(record: RecordIdentity, key: string, value: string): ReplaceKeyOperation;
    /**
     * Instantiate a new `replaceAttribute` operation.
     *
     * @param {RecordIdentity} record
     * @param {string} attribute
     * @param {*} value
     * @returns {ReplaceAttributeOperation}
     */
    replaceAttribute(record: RecordIdentity, attribute: string, value: any): ReplaceAttributeOperation;
    /**
     * Instantiate a new `addToRelatedRecords` operation.
     *
     * @param {RecordIdentity} record
     * @param {string} relationship
     * @param {RecordIdentity} relatedRecord
     * @returns {AddToRelatedRecordsOperation}
     */
    addToRelatedRecords(record: RecordIdentity, relationship: string, relatedRecord: RecordIdentity): AddToRelatedRecordsOperation;
    /**
     * Instantiate a new `removeFromRelatedRecords` operation.
     *
     * @param {RecordIdentity} record
     * @param {string} relationship
     * @param {RecordIdentity} relatedRecord
     * @returns {RemoveFromRelatedRecordsOperation}
     */
    removeFromRelatedRecords(record: RecordIdentity, relationship: string, relatedRecord: RecordIdentity): RemoveFromRelatedRecordsOperation;
    /**
     * Instantiate a new `replaceRelatedRecords` operation.
     *
     * @param {RecordIdentity} record
     * @param {string} relationship
     * @param {RecordIdentity[]} relatedRecords
     * @returns {ReplaceRelatedRecordsOperation}
     */
    replaceRelatedRecords(record: RecordIdentity, relationship: string, relatedRecords: RecordIdentity[]): ReplaceRelatedRecordsOperation;
    /**
     * Instantiate a new `replaceRelatedRecord` operation.
     *
     * @param {RecordIdentity} record
     * @param {string} relationship
     * @param {RecordIdentity} relatedRecord
     * @returns {ReplaceRelatedRecordOperation}
     */
    replaceRelatedRecord(record: RecordIdentity, relationship: string, relatedRecord: RecordIdentity): ReplaceRelatedRecordOperation;
}
