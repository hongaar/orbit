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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5LW1hcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNyYy9rZXktbWFwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHNCQUEyRTtBQUczRSxBQUtHOzs7Ozs7QUFDSDtBQUlFO0FBQ0UsQUFBSSxhQUFDLEFBQUssQUFBRSxBQUFDLEFBQ2Y7QUFBQztBQUVELEFBSUc7Ozs7O0FBQ0gscUJBQUssUUFBTDtBQUNFLEFBQUksYUFBQyxBQUFVLGFBQUcsQUFBRSxBQUFDO0FBQ3JCLEFBQUksYUFBQyxBQUFVLGFBQUcsQUFBRSxBQUFDLEFBQ3ZCO0FBQUM7QUFFRCxBQVNHOzs7Ozs7Ozs7O0FBQ0gscUJBQU8sVUFBUCxVQUFRLEFBQVksTUFBRSxBQUFlLFNBQUUsQUFBZTtBQUNwRCxBQUFNLGVBQUMsUUFBTyxRQUFDLEFBQUksS0FBQyxBQUFVLFlBQUUsQ0FBQyxBQUFJLE1BQUUsQUFBTyxTQUFFLEFBQU8sQUFBQyxBQUFDLEFBQUMsQUFDNUQ7QUFBQztBQUVELEFBU0c7Ozs7Ozs7Ozs7QUFDSCxxQkFBTyxVQUFQLFVBQVEsQUFBWSxNQUFFLEFBQWUsU0FBRSxBQUFnQjtBQUNyRCxBQUFNLGVBQUMsUUFBTyxRQUFDLEFBQUksS0FBQyxBQUFVLFlBQUUsQ0FBQyxBQUFJLE1BQUUsQUFBTyxTQUFFLEFBQVEsQUFBQyxBQUFDLEFBQUMsQUFDN0Q7QUFBQztBQUVELEFBT0c7Ozs7Ozs7O0FBQ0gscUJBQVUsYUFBVixVQUFXLEFBQWM7QUFBekIsb0JBY0M7QUFiUyxZQUFBLGNBQUk7WUFBRSxZQUFFO1lBQUUsY0FBSSxBQUFZO0FBRWxDLEFBQUUsQUFBQyxZQUFDLENBQUMsQUFBSSxRQUFJLENBQUMsQUFBRSxBQUFDLElBQUMsQUFBQztBQUNqQixBQUFNLEFBQUMsQUFDVDtBQUFDO0FBRUQsQUFBTSxlQUFDLEFBQUksS0FBQyxBQUFJLEFBQUMsTUFBQyxBQUFPLFFBQUMsVUFBQSxBQUFPO0FBQy9CLGdCQUFJLEFBQVEsV0FBRyxBQUFJLEtBQUMsQUFBTyxBQUFDLEFBQUM7QUFDN0IsQUFBRSxBQUFDLGdCQUFDLEFBQVEsQUFBQyxVQUFDLEFBQUM7QUFDYix3QkFBTyxRQUFDLEFBQUksTUFBQyxBQUFVLFlBQUUsQ0FBQyxBQUFJLE1BQUUsQUFBTyxTQUFFLEFBQUUsQUFBQyxLQUFFLEFBQVEsQUFBQyxBQUFDO0FBQ3hELHdCQUFPLFFBQUMsQUFBSSxNQUFDLEFBQVUsWUFBRSxDQUFDLEFBQUksTUFBRSxBQUFPLFNBQUUsQUFBUSxBQUFDLFdBQUUsQUFBRSxBQUFDLEFBQUMsQUFDMUQ7QUFBQyxBQUNIO0FBQUMsQUFBQyxBQUFDLEFBQ0w7QUFBQztBQUVELEFBUUc7Ozs7Ozs7OztBQUNILHFCQUFVLGFBQVYsVUFBVyxBQUFZLE1BQUUsQUFBa0I7QUFBM0Msb0JBU0M7QUFSQyxZQUFJLEFBQVEsV0FBRyxBQUFNLE9BQUMsQUFBSSxLQUFDLEFBQUksQUFBQyxBQUFDO0FBRWpDLEFBQU0sdUJBQVksWUFBQyxBQUFRLFVBQUUsVUFBQyxBQUFPO0FBQ25DLGdCQUFJLEFBQVEsV0FBRyxBQUFJLEtBQUMsQUFBTyxBQUFDLEFBQUM7QUFDN0IsQUFBRSxBQUFDLGdCQUFDLEFBQVEsQUFBQyxVQUFDLEFBQUM7QUFDYixBQUFNLHVCQUFDLEFBQUksTUFBQyxBQUFPLFFBQUMsQUFBSSxNQUFFLEFBQU8sU0FBRSxBQUFRLEFBQUMsQUFBQyxBQUMvQztBQUFDLEFBQ0g7QUFBQyxBQUFDLEFBQUMsQUFDTCxTQU5TO0FBTVI7QUFDSCxXQUFBLEFBQUM7QUF6RkQsQUF5RkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhc3NlcnQsIGRlZXBHZXQsIGRlZXBTZXQsIGZpcnN0UmVzdWx0LCBEaWN0IH0gZnJvbSAnQG9yYml0L3V0aWxzJztcclxuaW1wb3J0IHsgUmVjb3JkIH0gZnJvbSAnLi9yZWNvcmQnO1xyXG5cclxuLyoqXHJcbiAqIE1haW50YWlucyBhIG1hcCBiZXR3ZWVuIHJlY29yZHMnIGlkcyBhbmQga2V5cy5cclxuICpcclxuICogQGV4cG9ydFxyXG4gKiBAY2xhc3MgS2V5TWFwXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBLZXlNYXAge1xyXG4gIHByaXZhdGUgX2lkc1RvS2V5czogRGljdDxEaWN0PHN0cmluZz4+O1xyXG4gIHByaXZhdGUgX2tleXNUb0lkczogRGljdDxEaWN0PHN0cmluZz4+O1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMucmVzZXQoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlc2V0cyB0aGUgY29udGVudHMgb2YgdGhlIGtleSBtYXAuXHJcbiAgICpcclxuICAgKiBAbWVtYmVyb2YgS2V5TWFwXHJcbiAgICovXHJcbiAgcmVzZXQoKTogdm9pZCB7XHJcbiAgICB0aGlzLl9pZHNUb0tleXMgPSB7fTtcclxuICAgIHRoaXMuX2tleXNUb0lkcyA9IHt9O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJuIGEga2V5IHZhbHVlIGdpdmVuIGEgbW9kZWwgdHlwZSwga2V5IG5hbWUsIGFuZCBpZC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGtleU5hbWVcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gaWRWYWx1ZVxyXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgS2V5TWFwXHJcbiAgICovXHJcbiAgaWRUb0tleSh0eXBlOiBzdHJpbmcsIGtleU5hbWU6IHN0cmluZywgaWRWYWx1ZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIHJldHVybiBkZWVwR2V0KHRoaXMuX2lkc1RvS2V5cywgW3R5cGUsIGtleU5hbWUsIGlkVmFsdWVdKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybiBhbiBpZCB2YWx1ZSBnaXZlbiBhIG1vZGVsIHR5cGUsIGtleSBuYW1lLCBhbmQga2V5IHZhbHVlLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHR5cGVcclxuICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5TmFtZVxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBrZXlWYWx1ZVxyXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgS2V5TWFwXHJcbiAgICovXHJcbiAga2V5VG9JZCh0eXBlOiBzdHJpbmcsIGtleU5hbWU6IHN0cmluZywga2V5VmFsdWU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gZGVlcEdldCh0aGlzLl9rZXlzVG9JZHMsIFt0eXBlLCBrZXlOYW1lLCBrZXlWYWx1ZV0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU3RvcmUgdGhlIGlkIGFuZCBrZXkgdmFsdWVzIG9mIGEgcmVjb3JkIGluIHRoaXMga2V5IG1hcC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7UmVjb3JkfSByZWNvcmRcclxuICAgKiBAcmV0dXJucyB7dm9pZH1cclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBLZXlNYXBcclxuICAgKi9cclxuICBwdXNoUmVjb3JkKHJlY29yZDogUmVjb3JkKTogdm9pZCB7XHJcbiAgICBjb25zdCB7IHR5cGUsIGlkLCBrZXlzIH0gPSByZWNvcmQ7XHJcblxyXG4gICAgaWYgKCFrZXlzIHx8ICFpZCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgT2JqZWN0LmtleXMoa2V5cykuZm9yRWFjaChrZXlOYW1lID0+IHtcclxuICAgICAgbGV0IGtleVZhbHVlID0ga2V5c1trZXlOYW1lXTtcclxuICAgICAgaWYgKGtleVZhbHVlKSB7XHJcbiAgICAgICAgZGVlcFNldCh0aGlzLl9pZHNUb0tleXMsIFt0eXBlLCBrZXlOYW1lLCBpZF0sIGtleVZhbHVlKTtcclxuICAgICAgICBkZWVwU2V0KHRoaXMuX2tleXNUb0lkcywgW3R5cGUsIGtleU5hbWUsIGtleVZhbHVlXSwgaWQpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdpdmVuIGEgcmVjb3JkLCBmaW5kIHRoZSBjYWNoZWQgaWQgaWYgaXQgZXhpc3RzLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHR5cGVcclxuICAgKiBAcGFyYW0ge0RpY3Q8c3RyaW5nPn0ga2V5c1xyXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgS2V5TWFwXHJcbiAgICovXHJcbiAgaWRGcm9tS2V5cyh0eXBlOiBzdHJpbmcsIGtleXM6IERpY3Q8c3RyaW5nPik6IHN0cmluZyB7XHJcbiAgICBsZXQga2V5TmFtZXMgPSBPYmplY3Qua2V5cyhrZXlzKTtcclxuXHJcbiAgICByZXR1cm4gZmlyc3RSZXN1bHQoa2V5TmFtZXMsIChrZXlOYW1lKSA9PiB7XHJcbiAgICAgIGxldCBrZXlWYWx1ZSA9IGtleXNba2V5TmFtZV07XHJcbiAgICAgIGlmIChrZXlWYWx1ZSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmtleVRvSWQodHlwZSwga2V5TmFtZSwga2V5VmFsdWUpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuIl19