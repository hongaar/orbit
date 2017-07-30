"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var hamt_1 = require("./utils/hamt");
var ImmutableMap = function () {
    function ImmutableMap(base) {
        if (base) {
            this._data = base.data;
        } else {
            this._data = new hamt_1.default();
        }
    }
    Object.defineProperty(ImmutableMap.prototype, "size", {
        get: function () {
            return this._data.size;
        },
        enumerable: true,
        configurable: true
    });
    ImmutableMap.prototype.get = function (key) {
        return this._data.get(key);
    };
    ImmutableMap.prototype.set = function (key, value) {
        this._data = this._data.set(key, value);
    };
    ImmutableMap.prototype.remove = function (key) {
        this._data = this._data.remove(key);
    };
    ImmutableMap.prototype.has = function (key) {
        return this.get(key) !== undefined;
    };
    ImmutableMap.prototype.keys = function () {
        return this._data.keys();
    };
    ImmutableMap.prototype.values = function () {
        return this._data.values();
    };
    Object.defineProperty(ImmutableMap.prototype, "data", {
        get: function () {
            return this._data;
        },
        enumerable: true,
        configurable: true
    });
    return ImmutableMap;
}();
exports.default = ImmutableMap;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1tdXRhYmxlLW1hcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNyYy9pbW11dGFibGUtbWFwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFCQUFtQztBQUVuQztBQUdFLDBCQUFZLEFBQXlCO0FBQ25DLEFBQUUsQUFBQyxZQUFDLEFBQUksQUFBQyxNQUFDLEFBQUM7QUFDVCxBQUFJLGlCQUFDLEFBQUssUUFBRyxBQUFJLEtBQUMsQUFBSSxBQUFDLEFBQ3pCO0FBQUMsQUFBQyxBQUFJLGVBQUMsQUFBQztBQUNOLEFBQUksaUJBQUMsQUFBSyxRQUFHLElBQUksT0FBTyxBQUFFLEFBQUMsQUFDN0I7QUFBQyxBQUNIO0FBQUM7QUFFRCwwQkFBSSx3QkFBSTthQUFSO0FBQ0UsQUFBTSxtQkFBQyxBQUFJLEtBQUMsQUFBSyxNQUFDLEFBQUksQUFBQyxBQUN6QjtBQUFDOztzQkFBQTs7QUFFRCwyQkFBRyxNQUFILFVBQUksQUFBTTtBQUNSLEFBQU0sZUFBQyxBQUFJLEtBQUMsQUFBSyxNQUFDLEFBQUcsSUFBQyxBQUFHLEFBQUMsQUFBQyxBQUM3QjtBQUFDO0FBRUQsMkJBQUcsTUFBSCxVQUFJLEFBQU0sS0FBRSxBQUFRO0FBQ2xCLEFBQUksYUFBQyxBQUFLLFFBQUcsQUFBSSxLQUFDLEFBQUssTUFBQyxBQUFHLElBQUMsQUFBRyxLQUFFLEFBQUssQUFBQyxBQUFDLEFBQzFDO0FBQUM7QUFFRCwyQkFBTSxTQUFOLFVBQU8sQUFBTTtBQUNYLEFBQUksYUFBQyxBQUFLLFFBQUcsQUFBSSxLQUFDLEFBQUssTUFBQyxBQUFNLE9BQUMsQUFBRyxBQUFDLEFBQUMsQUFDdEM7QUFBQztBQUVELDJCQUFHLE1BQUgsVUFBSSxBQUFNO0FBQ1IsQUFBTSxlQUFDLEFBQUksS0FBQyxBQUFHLElBQUMsQUFBRyxBQUFDLFNBQUssQUFBUyxBQUFDLEFBQ3JDO0FBQUM7QUFFRCwyQkFBSSxPQUFKO0FBQ0UsQUFBTSxlQUFDLEFBQUksS0FBQyxBQUFLLE1BQUMsQUFBSSxBQUFFLEFBQUMsQUFDM0I7QUFBQztBQUVELDJCQUFNLFNBQU47QUFDRSxBQUFNLGVBQUMsQUFBSSxLQUFDLEFBQUssTUFBQyxBQUFNLEFBQUUsQUFBQyxBQUM3QjtBQUFDO0FBRUQsMEJBQWMsd0JBQUk7YUFBbEI7QUFDRSxBQUFNLG1CQUFDLEFBQUksS0FBQyxBQUFLLEFBQUMsQUFDcEI7QUFBQzs7c0JBQUE7O0FBQ0gsV0FBQyxBQUFEO0FBMUNBLEFBMENDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEhBTVRNYXAgZnJvbSAnLi91dGlscy9oYW10JztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEltbXV0YWJsZU1hcDxLLCBWPiB7XHJcbiAgcHJpdmF0ZSBfZGF0YTogSEFNVE1hcDtcclxuXHJcbiAgY29uc3RydWN0b3IoYmFzZT86IEltbXV0YWJsZU1hcDxLLCBWPikge1xyXG4gICAgaWYgKGJhc2UpIHtcclxuICAgICAgdGhpcy5fZGF0YSA9IGJhc2UuZGF0YTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuX2RhdGEgPSBuZXcgSEFNVE1hcCgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0IHNpemUoKTogbnVtYmVyIHtcclxuICAgIHJldHVybiB0aGlzLl9kYXRhLnNpemU7XHJcbiAgfVxyXG5cclxuICBnZXQoa2V5OiBLKTogViB7XHJcbiAgICByZXR1cm4gdGhpcy5fZGF0YS5nZXQoa2V5KTtcclxuICB9XHJcblxyXG4gIHNldChrZXk6IEssIHZhbHVlOiBWKTogdm9pZCB7XHJcbiAgICB0aGlzLl9kYXRhID0gdGhpcy5fZGF0YS5zZXQoa2V5LCB2YWx1ZSk7XHJcbiAgfVxyXG5cclxuICByZW1vdmUoa2V5OiBLKTogdm9pZCB7XHJcbiAgICB0aGlzLl9kYXRhID0gdGhpcy5fZGF0YS5yZW1vdmUoa2V5KTtcclxuICB9XHJcblxyXG4gIGhhcyhrZXk6IEspOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLmdldChrZXkpICE9PSB1bmRlZmluZWQ7XHJcbiAgfVxyXG5cclxuICBrZXlzKCk6IEl0ZXJhYmxlSXRlcmF0b3I8Sz4ge1xyXG4gICAgcmV0dXJuIHRoaXMuX2RhdGEua2V5cygpO1xyXG4gIH1cclxuXHJcbiAgdmFsdWVzKCk6IEl0ZXJhYmxlSXRlcmF0b3I8Vj4ge1xyXG4gICAgcmV0dXJuIHRoaXMuX2RhdGEudmFsdWVzKCk7XHJcbiAgfVxyXG5cclxuICBwcm90ZWN0ZWQgZ2V0IGRhdGEoKTogSEFNVE1hcCB7XHJcbiAgICByZXR1cm4gdGhpcy5fZGF0YTtcclxuICB9XHJcbn1cclxuIl19