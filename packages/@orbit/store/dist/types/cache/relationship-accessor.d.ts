import { Dict } from '@orbit/utils';
import { Record, RecordIdentity } from '@orbit/data';
import Cache from '../cache';
import { ImmutableMap } from '@orbit/immutable';
import RecordIdentityMap from './record-identity-map';
export default class RelationshipAccessor {
    protected _cache: Cache;
    protected _relationships: Dict<ImmutableMap<string, Dict<RecordIdentity | RecordIdentityMap>>>;
    constructor(cache: Cache, base?: RelationshipAccessor);
    reset(base?: RelationshipAccessor): void;
    upgrade(): void;
    relationshipExists(record: RecordIdentity, relationship: string, relatedRecord: RecordIdentity): boolean;
    relatedRecord(record: RecordIdentity, relationship: string): RecordIdentity;
    relatedRecords(record: RecordIdentity, relationship: string): RecordIdentity[];
    relatedRecordsMap(record: RecordIdentity, relationship: string): RecordIdentityMap;
    relatedRecordsMatch(record: RecordIdentity, relationship: string, relatedRecords: RecordIdentity[]): boolean;
    addRecord(record: Record): void;
    replaceRecord(record: Record): void;
    clearRecord(record: RecordIdentity): void;
    addToRelatedRecords(record: RecordIdentity, relationship: string, relatedRecord: RecordIdentity): void;
    removeFromRelatedRecords(record: RecordIdentity, relationship: string, relatedRecord: RecordIdentity): void;
    replaceRelatedRecords(record: RecordIdentity, relationship: string, relatedRecords: RecordIdentity[]): void;
    replaceRelatedRecord(record: RecordIdentity, relationship: string, relatedRecord: RecordIdentity): void;
}
