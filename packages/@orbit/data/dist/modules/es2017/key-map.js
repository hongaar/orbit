"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@orbit/utils");
/**
 * Maintains a map between records' ids and keys.
 *
 * @export
 * @class KeyMap
 */
var KeyMap = (function () {
    function KeyMap() {
        this.reset();
    }
    /**
     * Resets the contents of the key map.
     *
     * @memberof KeyMap
     */
    KeyMap.prototype.reset = function () {
        this._idsToKeys = {};
        this._keysToIds = {};
    };
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
    KeyMap.prototype.idToKey = function (type, keyName, idValue) {
        return utils_1.deepGet(this._idsToKeys, [type, keyName, idValue]);
    };
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
    KeyMap.prototype.keyToId = function (type, keyName, keyValue) {
        return utils_1.deepGet(this._keysToIds, [type, keyName, keyValue]);
    };
    /**
     * Store the id and key values of a record in this key map.
     *
     * @param {Record} record
     * @returns {void}
     *
     * @memberOf KeyMap
     */
    KeyMap.prototype.pushRecord = function (record) {
        var _this = this;
        var type = record.type, id = record.id, keys = record.keys;
        if (!keys || !id) {
            return;
        }
        Object.keys(keys).forEach(function (keyName) {
            var keyValue = keys[keyName];
            if (keyValue) {
                utils_1.deepSet(_this._idsToKeys, [type, keyName, id], keyValue);
                utils_1.deepSet(_this._keysToIds, [type, keyName, keyValue], id);
            }
        });
    };
    /**
     * Given a record, find the cached id if it exists.
     *
     * @param {string} type
     * @param {Dict<string>} keys
     * @returns {string}
     *
     * @memberOf KeyMap
     */
    KeyMap.prototype.idFromKeys = function (type, keys) {
        var _this = this;
        var keyNames = Object.keys(keys);
        return utils_1.firstResult(keyNames, function (keyName) {
            var keyValue = keys[keyName];
            if (keyValue) {
                return _this.keyToId(type, keyName, keyValue);
            }
        });
    };
    return KeyMap;
}());
exports.default = KeyMap;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5LW1hcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNyYy9rZXktbWFwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQTJFO0FBRzNFOzs7OztHQUtHO0FBQ0g7SUFJRTtRQUNFLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNmLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsc0JBQUssR0FBTDtRQUNFLElBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDO0lBQ3ZCLENBQUM7SUFFRDs7Ozs7Ozs7O09BU0c7SUFDSCx3QkFBTyxHQUFQLFVBQVEsSUFBWSxFQUFFLE9BQWUsRUFBRSxPQUFlO1FBQ3BELE1BQU0sQ0FBQyxlQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBRUQ7Ozs7Ozs7OztPQVNHO0lBQ0gsd0JBQU8sR0FBUCxVQUFRLElBQVksRUFBRSxPQUFlLEVBQUUsUUFBZ0I7UUFDckQsTUFBTSxDQUFDLGVBQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQzdELENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ0gsMkJBQVUsR0FBVixVQUFXLE1BQWM7UUFBekIsaUJBY0M7UUFiUyxJQUFBLGtCQUFJLEVBQUUsY0FBRSxFQUFFLGtCQUFJLENBQVk7UUFFbEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLE1BQU0sQ0FBQztRQUNULENBQUM7UUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFBLE9BQU87WUFDL0IsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzdCLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsZUFBTyxDQUFDLEtBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLEVBQUUsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUN4RCxlQUFPLENBQUMsS0FBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsUUFBUSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDMUQsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVEOzs7Ozs7OztPQVFHO0lBQ0gsMkJBQVUsR0FBVixVQUFXLElBQVksRUFBRSxJQUFrQjtRQUEzQyxpQkFTQztRQVJDLElBQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFakMsTUFBTSxDQUFDLG1CQUFXLENBQUMsUUFBUSxFQUFFLFVBQUMsT0FBTztZQUNuQyxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDN0IsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDYixNQUFNLENBQUMsS0FBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQy9DLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFDSCxhQUFDO0FBQUQsQ0FBQyxBQXpGRCxJQXlGQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGFzc2VydCwgZGVlcEdldCwgZGVlcFNldCwgZmlyc3RSZXN1bHQsIERpY3QgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xyXG5pbXBvcnQgeyBSZWNvcmQgfSBmcm9tICcuL3JlY29yZCc7XHJcblxyXG4vKipcclxuICogTWFpbnRhaW5zIGEgbWFwIGJldHdlZW4gcmVjb3JkcycgaWRzIGFuZCBrZXlzLlxyXG4gKlxyXG4gKiBAZXhwb3J0XHJcbiAqIEBjbGFzcyBLZXlNYXBcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEtleU1hcCB7XHJcbiAgcHJpdmF0ZSBfaWRzVG9LZXlzOiBEaWN0PERpY3Q8c3RyaW5nPj47XHJcbiAgcHJpdmF0ZSBfa2V5c1RvSWRzOiBEaWN0PERpY3Q8c3RyaW5nPj47XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5yZXNldCgpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmVzZXRzIHRoZSBjb250ZW50cyBvZiB0aGUga2V5IG1hcC5cclxuICAgKlxyXG4gICAqIEBtZW1iZXJvZiBLZXlNYXBcclxuICAgKi9cclxuICByZXNldCgpOiB2b2lkIHtcclxuICAgIHRoaXMuX2lkc1RvS2V5cyA9IHt9O1xyXG4gICAgdGhpcy5fa2V5c1RvSWRzID0ge307XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm4gYSBrZXkgdmFsdWUgZ2l2ZW4gYSBtb2RlbCB0eXBlLCBrZXkgbmFtZSwgYW5kIGlkLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHR5cGVcclxuICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5TmFtZVxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZFZhbHVlXHJcbiAgICogQHJldHVybnMge3N0cmluZ31cclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBLZXlNYXBcclxuICAgKi9cclxuICBpZFRvS2V5KHR5cGU6IHN0cmluZywga2V5TmFtZTogc3RyaW5nLCBpZFZhbHVlOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIGRlZXBHZXQodGhpcy5faWRzVG9LZXlzLCBbdHlwZSwga2V5TmFtZSwgaWRWYWx1ZV0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJuIGFuIGlkIHZhbHVlIGdpdmVuIGEgbW9kZWwgdHlwZSwga2V5IG5hbWUsIGFuZCBrZXkgdmFsdWUuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZVxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBrZXlOYW1lXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGtleVZhbHVlXHJcbiAgICogQHJldHVybnMge3N0cmluZ31cclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBLZXlNYXBcclxuICAgKi9cclxuICBrZXlUb0lkKHR5cGU6IHN0cmluZywga2V5TmFtZTogc3RyaW5nLCBrZXlWYWx1ZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIHJldHVybiBkZWVwR2V0KHRoaXMuX2tleXNUb0lkcywgW3R5cGUsIGtleU5hbWUsIGtleVZhbHVlXSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTdG9yZSB0aGUgaWQgYW5kIGtleSB2YWx1ZXMgb2YgYSByZWNvcmQgaW4gdGhpcyBrZXkgbWFwLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtSZWNvcmR9IHJlY29yZFxyXG4gICAqIEByZXR1cm5zIHt2b2lkfVxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEtleU1hcFxyXG4gICAqL1xyXG4gIHB1c2hSZWNvcmQocmVjb3JkOiBSZWNvcmQpOiB2b2lkIHtcclxuICAgIGNvbnN0IHsgdHlwZSwgaWQsIGtleXMgfSA9IHJlY29yZDtcclxuXHJcbiAgICBpZiAoIWtleXMgfHwgIWlkKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBPYmplY3Qua2V5cyhrZXlzKS5mb3JFYWNoKGtleU5hbWUgPT4ge1xyXG4gICAgICBsZXQga2V5VmFsdWUgPSBrZXlzW2tleU5hbWVdO1xyXG4gICAgICBpZiAoa2V5VmFsdWUpIHtcclxuICAgICAgICBkZWVwU2V0KHRoaXMuX2lkc1RvS2V5cywgW3R5cGUsIGtleU5hbWUsIGlkXSwga2V5VmFsdWUpO1xyXG4gICAgICAgIGRlZXBTZXQodGhpcy5fa2V5c1RvSWRzLCBbdHlwZSwga2V5TmFtZSwga2V5VmFsdWVdLCBpZCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2l2ZW4gYSByZWNvcmQsIGZpbmQgdGhlIGNhY2hlZCBpZCBpZiBpdCBleGlzdHMuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZVxyXG4gICAqIEBwYXJhbSB7RGljdDxzdHJpbmc+fSBrZXlzXHJcbiAgICogQHJldHVybnMge3N0cmluZ31cclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBLZXlNYXBcclxuICAgKi9cclxuICBpZEZyb21LZXlzKHR5cGU6IHN0cmluZywga2V5czogRGljdDxzdHJpbmc+KTogc3RyaW5nIHtcclxuICAgIGxldCBrZXlOYW1lcyA9IE9iamVjdC5rZXlzKGtleXMpO1xyXG5cclxuICAgIHJldHVybiBmaXJzdFJlc3VsdChrZXlOYW1lcywgKGtleU5hbWUpID0+IHtcclxuICAgICAgbGV0IGtleVZhbHVlID0ga2V5c1trZXlOYW1lXTtcclxuICAgICAgaWYgKGtleVZhbHVlKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMua2V5VG9JZCh0eXBlLCBrZXlOYW1lLCBrZXlWYWx1ZSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG4iXX0=