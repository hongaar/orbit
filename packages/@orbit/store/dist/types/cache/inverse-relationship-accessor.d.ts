import { Dict } from '@orbit/utils';
import { Record, RecordIdentity } from '@orbit/data';
import Cache from '../cache';
import { ImmutableMap } from '@orbit/immutable';
export interface InverseRelationship {
    record: RecordIdentity;
    relationship: string;
}
export default class InverseRelationshipAccessor {
    protected _cache: Cache;
    protected _relationships: Dict<ImmutableMap<string, InverseRelationship[]>>;
    constructor(cache: Cache, base?: InverseRelationshipAccessor);
    reset(base?: InverseRelationshipAccessor): void;
    upgrade(): void;
    all(record: RecordIdentity): InverseRelationship[];
    recordAdded(record: Record): void;
    recordRemoved(record: RecordIdentity): void;
    relatedRecordAdded(record: RecordIdentity, relationship: string, relatedRecord: RecordIdentity): void;
    relatedRecordsAdded(record: RecordIdentity, relationship: string, relatedRecords: RecordIdentity[]): void;
    relatedRecordRemoved(record: RecordIdentity, relationship: string, relatedRecord?: RecordIdentity): void;
    relatedRecordsRemoved(record: RecordIdentity, relationship: string, relatedRecords?: RecordIdentity[]): void;
    private add(record, inverseRelationship);
    private remove(record, inverseRelationship);
}
