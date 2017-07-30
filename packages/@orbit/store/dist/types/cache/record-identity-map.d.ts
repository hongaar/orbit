import { Dict } from '@orbit/utils';
import { RecordIdentity } from '@orbit/data';
export default class RecordIdentityMap {
    identities: Dict<boolean>;
    constructor(base?: RecordIdentityMap);
    add(record: RecordIdentity): void;
    remove(record: RecordIdentity): void;
    readonly values: RecordIdentity[];
    has(record: RecordIdentity): boolean;
    exclusiveOf(other: RecordIdentityMap): RecordIdentity[];
    equals(other: RecordIdentityMap): boolean;
}
