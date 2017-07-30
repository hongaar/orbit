import { Dict } from '@orbit/utils';
import { Record } from './record';
/**
 * Maintains a map between records' ids and keys.
 *
 * @export
 * @class KeyMap
 */
export default class KeyMap {
    private _idsToKeys;
    private _keysToIds;
    constructor();
    /**
     * Resets the contents of the key map.
     *
     * @memberof KeyMap
     */
    reset(): void;
    /**
     * Return a key value given a model type, key name, and id.
     *
     * @param {string} type
     * @param {string} keyName
     * @param {string} idValue
     * @returns {string}
     *
     * @memberOf KeyMap
     */
    idToKey(type: string, keyName: string, idValue: string): string;
    /**
     * Return an id value given a model type, key name, and key value.
     *
     * @param {string} type
     * @param {string} keyName
     * @param {string} keyValue
     * @returns {string}
     *
     * @memberOf KeyMap
     */
    keyToId(type: string, keyName: string, keyValue: string): string;
    /**
     * Store the id and key values of a record in this key map.
     *
     * @param {Record} record
     * @returns {void}
     *
     * @memberOf KeyMap
     */
    pushRecord(record: Record): void;
    /**
     * Given a record, find the cached id if it exists.
     *
     * @param {string} type
     * @param {Dict<string>} keys
     * @returns {string}
     *
     * @memberOf KeyMap
     */
    idFromKeys(type: string, keys: Dict<string>): string;
}
