import { Dict } from '@orbit/utils';
export interface RecordIdentity {
    type: string;
    id: string;
}
export interface RecordHasOneRelationship {
    data: RecordIdentity | null;
}
export interface RecordHasManyRelationship {
    data: RecordIdentity[];
}
export declare type RecordRelationship = RecordHasOneRelationship | RecordHasManyRelationship;
export interface Record extends RecordIdentity {
    keys?: Dict<string>;
    attributes?: Dict<any>;
    relationships?: Dict<RecordRelationship>;
}
export interface RecordInitializer {
    initializeRecord(record: Record): void;
}
export declare function cloneRecordIdentity(identity: RecordIdentity): RecordIdentity;
export declare function equalRecordIdentities(record1: RecordIdentity, record2: RecordIdentity): boolean;
export declare function mergeRecords(current: Record | null, updates: Record): Record;
