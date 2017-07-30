"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var hamt_1 = require("./utils/hamt");
var ImmutableMap = (function () {
    function ImmutableMap(base) {
        if (base) {
            this._data = base.data;
        }
        else {
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
}());
exports.default = ImmutableMap;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1tdXRhYmxlLW1hcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNyYy9pbW11dGFibGUtbWFwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscUNBQW1DO0FBRW5DO0lBR0Usc0JBQVksSUFBeUI7UUFDbkMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNULElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUN6QixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksY0FBTyxFQUFFLENBQUM7UUFDN0IsQ0FBQztJQUNILENBQUM7SUFFRCxzQkFBSSw4QkFBSTthQUFSO1lBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO1FBQ3pCLENBQUM7OztPQUFBO0lBRUQsMEJBQUcsR0FBSCxVQUFJLEdBQU07UUFDUixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUVELDBCQUFHLEdBQUgsVUFBSSxHQUFNLEVBQUUsS0FBUTtRQUNsQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBRUQsNkJBQU0sR0FBTixVQUFPLEdBQU07UUFDWCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFFRCwwQkFBRyxHQUFILFVBQUksR0FBTTtRQUNSLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLFNBQVMsQ0FBQztJQUNyQyxDQUFDO0lBRUQsMkJBQUksR0FBSjtRQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQzNCLENBQUM7SUFFRCw2QkFBTSxHQUFOO1FBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDN0IsQ0FBQztJQUVELHNCQUFjLDhCQUFJO2FBQWxCO1lBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDcEIsQ0FBQzs7O09BQUE7SUFDSCxtQkFBQztBQUFELENBQUMsQUExQ0QsSUEwQ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgSEFNVE1hcCBmcm9tICcuL3V0aWxzL2hhbXQnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW1tdXRhYmxlTWFwPEssIFY+IHtcclxuICBwcml2YXRlIF9kYXRhOiBIQU1UTWFwO1xyXG5cclxuICBjb25zdHJ1Y3RvcihiYXNlPzogSW1tdXRhYmxlTWFwPEssIFY+KSB7XHJcbiAgICBpZiAoYmFzZSkge1xyXG4gICAgICB0aGlzLl9kYXRhID0gYmFzZS5kYXRhO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5fZGF0YSA9IG5ldyBIQU1UTWFwKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXQgc2l6ZSgpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIHRoaXMuX2RhdGEuc2l6ZTtcclxuICB9XHJcblxyXG4gIGdldChrZXk6IEspOiBWIHtcclxuICAgIHJldHVybiB0aGlzLl9kYXRhLmdldChrZXkpO1xyXG4gIH1cclxuXHJcbiAgc2V0KGtleTogSywgdmFsdWU6IFYpOiB2b2lkIHtcclxuICAgIHRoaXMuX2RhdGEgPSB0aGlzLl9kYXRhLnNldChrZXksIHZhbHVlKTtcclxuICB9XHJcblxyXG4gIHJlbW92ZShrZXk6IEspOiB2b2lkIHtcclxuICAgIHRoaXMuX2RhdGEgPSB0aGlzLl9kYXRhLnJlbW92ZShrZXkpO1xyXG4gIH1cclxuXHJcbiAgaGFzKGtleTogSyk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuZ2V0KGtleSkgIT09IHVuZGVmaW5lZDtcclxuICB9XHJcblxyXG4gIGtleXMoKTogSXRlcmFibGVJdGVyYXRvcjxLPiB7XHJcbiAgICByZXR1cm4gdGhpcy5fZGF0YS5rZXlzKCk7XHJcbiAgfVxyXG5cclxuICB2YWx1ZXMoKTogSXRlcmFibGVJdGVyYXRvcjxWPiB7XHJcbiAgICByZXR1cm4gdGhpcy5fZGF0YS52YWx1ZXMoKTtcclxuICB9XHJcblxyXG4gIHByb3RlY3RlZCBnZXQgZGF0YSgpOiBIQU1UTWFwIHtcclxuICAgIHJldHVybiB0aGlzLl9kYXRhO1xyXG4gIH1cclxufVxyXG4iXX0=