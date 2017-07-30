"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@orbit/utils");
/**
 * Maintains a map between records' ids and keys.
 *
 * @export
 * @class KeyMap
 */
var KeyMap = function () {
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
        var type = record.type,
            id = record.id,
            keys = record.keys;
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
}();
exports.default = KeyMap;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5LW1hcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNyYy9rZXktbWFwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHNCQUEyRTtBQUczRSxBQUtHOzs7Ozs7QUFDSCx5QkFJRTtzQkFDRSxBQUFJO2FBQUMsQUFBSyxBQUFFLEFBQUMsQUFDZixBQUFDO0FBRUQsQUFJRztBQUNIOzs7OztxQkFBSyxRQUFMLFlBQ0UsQUFBSTthQUFDLEFBQVUsYUFBRyxBQUFFLEFBQUMsQUFDckIsQUFBSTthQUFDLEFBQVUsYUFBRyxBQUFFLEFBQUMsQUFDdkIsQUFBQztBQUVELEFBU0c7QUFDSDs7Ozs7Ozs7OztxQkFBTyxVQUFQLFVBQVEsQUFBWSxNQUFFLEFBQWUsU0FBRSxBQUFlLFNBQ3BELEFBQU07ZUFBQyxRQUFPLFFBQUMsQUFBSSxLQUFDLEFBQVUsWUFBRSxDQUFDLEFBQUksTUFBRSxBQUFPLFNBQUUsQUFBTyxBQUFDLEFBQUMsQUFBQyxBQUM1RCxBQUFDO0FBRUQsQUFTRztBQUNIOzs7Ozs7Ozs7O3FCQUFPLFVBQVAsVUFBUSxBQUFZLE1BQUUsQUFBZSxTQUFFLEFBQWdCLFVBQ3JELEFBQU07ZUFBQyxRQUFPLFFBQUMsQUFBSSxLQUFDLEFBQVUsWUFBRSxDQUFDLEFBQUksTUFBRSxBQUFPLFNBQUUsQUFBUSxBQUFDLEFBQUMsQUFBQyxBQUM3RCxBQUFDO0FBRUQsQUFPRztBQUNIOzs7Ozs7OztxQkFBVSxhQUFWLFVBQVcsQUFBYyxRQUF6QjtvQkFjQyxBQWJTO1lBQUEsY0FBSTtZQUFFLFlBQUU7WUFBRSxjQUFJLEFBQVksQUFFbEMsQUFBRSxBQUFDO1lBQUMsQ0FBQyxBQUFJLFFBQUksQ0FBQyxBQUFFLEFBQUMsSUFBQyxBQUFDLEFBQ2pCLEFBQU0sQUFBQyxBQUNUO0FBQUM7QUFFRCxBQUFNO2VBQUMsQUFBSSxLQUFDLEFBQUksQUFBQyxNQUFDLEFBQU8sUUFBQyxVQUFBLEFBQU8sU0FDL0I7Z0JBQUksQUFBUSxXQUFHLEFBQUksS0FBQyxBQUFPLEFBQUMsQUFBQyxBQUM3QixBQUFFLEFBQUM7Z0JBQUMsQUFBUSxBQUFDLFVBQUMsQUFBQyxBQUNiO3dCQUFPLFFBQUMsQUFBSSxNQUFDLEFBQVUsWUFBRSxDQUFDLEFBQUksTUFBRSxBQUFPLFNBQUUsQUFBRSxBQUFDLEtBQUUsQUFBUSxBQUFDLEFBQUMsQUFDeEQ7d0JBQU8sUUFBQyxBQUFJLE1BQUMsQUFBVSxZQUFFLENBQUMsQUFBSSxNQUFFLEFBQU8sU0FBRSxBQUFRLEFBQUMsV0FBRSxBQUFFLEFBQUMsQUFBQyxBQUMxRCxBQUFDLEFBQ0g7QUFBQyxBQUFDLEFBQUMsQUFDTDtBQUFDO0FBRUQsQUFRRztBQUNIOzs7Ozs7Ozs7cUJBQVUsYUFBVixVQUFXLEFBQVksTUFBRSxBQUFrQixNQUEzQztvQkFTQyxBQVJDO1lBQUksQUFBUSxXQUFHLEFBQU0sT0FBQyxBQUFJLEtBQUMsQUFBSSxBQUFDLEFBQUMsQUFFakMsQUFBTTt1QkFBWSxZQUFDLEFBQVEsVUFBRSxVQUFDLEFBQU8sU0FDbkM7Z0JBQUksQUFBUSxXQUFHLEFBQUksS0FBQyxBQUFPLEFBQUMsQUFBQyxBQUM3QixBQUFFLEFBQUM7Z0JBQUMsQUFBUSxBQUFDLFVBQUMsQUFBQyxBQUNiLEFBQU07dUJBQUMsQUFBSSxNQUFDLEFBQU8sUUFBQyxBQUFJLE1BQUUsQUFBTyxTQUFFLEFBQVEsQUFBQyxBQUFDLEFBQy9DLEFBQUMsQUFDSDtBQUFDLEFBQUMsQUFBQyxBQUNMO0FBTlMsQUFNUjtBQUNIO1dBQUEsQUFBQyxBQXpGRCxBQXlGQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGFzc2VydCwgZGVlcEdldCwgZGVlcFNldCwgZmlyc3RSZXN1bHQsIERpY3QgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xyXG5pbXBvcnQgeyBSZWNvcmQgfSBmcm9tICcuL3JlY29yZCc7XHJcblxyXG4vKipcclxuICogTWFpbnRhaW5zIGEgbWFwIGJldHdlZW4gcmVjb3JkcycgaWRzIGFuZCBrZXlzLlxyXG4gKlxyXG4gKiBAZXhwb3J0XHJcbiAqIEBjbGFzcyBLZXlNYXBcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEtleU1hcCB7XHJcbiAgcHJpdmF0ZSBfaWRzVG9LZXlzOiBEaWN0PERpY3Q8c3RyaW5nPj47XHJcbiAgcHJpdmF0ZSBfa2V5c1RvSWRzOiBEaWN0PERpY3Q8c3RyaW5nPj47XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5yZXNldCgpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmVzZXRzIHRoZSBjb250ZW50cyBvZiB0aGUga2V5IG1hcC5cclxuICAgKlxyXG4gICAqIEBtZW1iZXJvZiBLZXlNYXBcclxuICAgKi9cclxuICByZXNldCgpOiB2b2lkIHtcclxuICAgIHRoaXMuX2lkc1RvS2V5cyA9IHt9O1xyXG4gICAgdGhpcy5fa2V5c1RvSWRzID0ge307XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm4gYSBrZXkgdmFsdWUgZ2l2ZW4gYSBtb2RlbCB0eXBlLCBrZXkgbmFtZSwgYW5kIGlkLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHR5cGVcclxuICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5TmFtZVxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZFZhbHVlXHJcbiAgICogQHJldHVybnMge3N0cmluZ31cclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBLZXlNYXBcclxuICAgKi9cclxuICBpZFRvS2V5KHR5cGU6IHN0cmluZywga2V5TmFtZTogc3RyaW5nLCBpZFZhbHVlOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIGRlZXBHZXQodGhpcy5faWRzVG9LZXlzLCBbdHlwZSwga2V5TmFtZSwgaWRWYWx1ZV0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJuIGFuIGlkIHZhbHVlIGdpdmVuIGEgbW9kZWwgdHlwZSwga2V5IG5hbWUsIGFuZCBrZXkgdmFsdWUuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZVxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBrZXlOYW1lXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGtleVZhbHVlXHJcbiAgICogQHJldHVybnMge3N0cmluZ31cclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBLZXlNYXBcclxuICAgKi9cclxuICBrZXlUb0lkKHR5cGU6IHN0cmluZywga2V5TmFtZTogc3RyaW5nLCBrZXlWYWx1ZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIHJldHVybiBkZWVwR2V0KHRoaXMuX2tleXNUb0lkcywgW3R5cGUsIGtleU5hbWUsIGtleVZhbHVlXSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTdG9yZSB0aGUgaWQgYW5kIGtleSB2YWx1ZXMgb2YgYSByZWNvcmQgaW4gdGhpcyBrZXkgbWFwLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtSZWNvcmR9IHJlY29yZFxyXG4gICAqIEByZXR1cm5zIHt2b2lkfVxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEtleU1hcFxyXG4gICAqL1xyXG4gIHB1c2hSZWNvcmQocmVjb3JkOiBSZWNvcmQpOiB2b2lkIHtcclxuICAgIGNvbnN0IHsgdHlwZSwgaWQsIGtleXMgfSA9IHJlY29yZDtcclxuXHJcbiAgICBpZiAoIWtleXMgfHwgIWlkKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBPYmplY3Qua2V5cyhrZXlzKS5mb3JFYWNoKGtleU5hbWUgPT4ge1xyXG4gICAgICBsZXQga2V5VmFsdWUgPSBrZXlzW2tleU5hbWVdO1xyXG4gICAgICBpZiAoa2V5VmFsdWUpIHtcclxuICAgICAgICBkZWVwU2V0KHRoaXMuX2lkc1RvS2V5cywgW3R5cGUsIGtleU5hbWUsIGlkXSwga2V5VmFsdWUpO1xyXG4gICAgICAgIGRlZXBTZXQodGhpcy5fa2V5c1RvSWRzLCBbdHlwZSwga2V5TmFtZSwga2V5VmFsdWVdLCBpZCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2l2ZW4gYSByZWNvcmQsIGZpbmQgdGhlIGNhY2hlZCBpZCBpZiBpdCBleGlzdHMuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZVxyXG4gICAqIEBwYXJhbSB7RGljdDxzdHJpbmc+fSBrZXlzXHJcbiAgICogQHJldHVybnMge3N0cmluZ31cclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBLZXlNYXBcclxuICAgKi9cclxuICBpZEZyb21LZXlzKHR5cGU6IHN0cmluZywga2V5czogRGljdDxzdHJpbmc+KTogc3RyaW5nIHtcclxuICAgIGxldCBrZXlOYW1lcyA9IE9iamVjdC5rZXlzKGtleXMpO1xyXG5cclxuICAgIHJldHVybiBmaXJzdFJlc3VsdChrZXlOYW1lcywgKGtleU5hbWUpID0+IHtcclxuICAgICAgbGV0IGtleVZhbHVlID0ga2V5c1trZXlOYW1lXTtcclxuICAgICAgaWYgKGtleVZhbHVlKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMua2V5VG9JZCh0eXBlLCBrZXlOYW1lLCBrZXlWYWx1ZSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG4iXX0=