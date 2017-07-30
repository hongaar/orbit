import { RecordIdentity } from './record';
import { FindRecordTerm, FindRecordsTerm, FindRelatedRecordTerm, FindRelatedRecordsTerm } from './query-term';
export default class QueryBuilder {
    /**
     * Find a record by its identity.
     *
     * @param {RecordIdentity} recordIdentity
     * @returns {FindRecordTerm}
     */
    findRecord(record: RecordIdentity): FindRecordTerm;
    /**
     * Find all records of a specific type.
     *
     * If `type` is unspecified, find all records unfiltered by type.
     *
     * @param {string} [type]
     * @returns {FindRecordsTerm}
     */
    findRecords(type?: string): FindRecordsTerm;
    /**
     * Find a record in a to-one relationship.
     *
     * @param {RecordIdentity} record
     * @param {string} relationship
     * @returns {FindRelatedRecordTerm}
     */
    findRelatedRecord(record: RecordIdentity, relationship: string): FindRelatedRecordTerm;
    /**
     * Find records in a to-many relationship.
     *
     * @param {RecordIdentity} record
     * @param {string} relationship
     * @returns {FindRelatedRecordsTerm}
     */
    findRelatedRecords(record: RecordIdentity, relationship: string): FindRelatedRecordsTerm;
}
