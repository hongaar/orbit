"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function serializeRecordIdentity(record) {
    return record.type + ":" + record.id;
}
function deserializeRecordIdentity(identity) {
    var _a = identity.split(':'),
        type = _a[0],
        id = _a[1];
    return { type: type, id: id };
}
var RecordIdentityMap = function () {
    function RecordIdentityMap(base) {
        var identities = this.identities = {};
        if (base) {
            Object.keys(base.identities).forEach(function (k) {
                identities[k] = true;
            });
        }
    }
    RecordIdentityMap.prototype.add = function (record) {
        this.identities[serializeRecordIdentity(record)] = true;
    };
    RecordIdentityMap.prototype.remove = function (record) {
        delete this.identities[serializeRecordIdentity(record)];
    };
    Object.defineProperty(RecordIdentityMap.prototype, "values", {
        get: function () {
            return Object.keys(this.identities).map(function (id) {
                return deserializeRecordIdentity(id);
            });
        },
        enumerable: true,
        configurable: true
    });
    RecordIdentityMap.prototype.has = function (record) {
        if (record) {
            return !!this.identities[serializeRecordIdentity(record)];
        } else {
            return false;
        }
    };
    RecordIdentityMap.prototype.exclusiveOf = function (other) {
        return Object.keys(this.identities).filter(function (id) {
            return !other.identities[id];
        }).map(function (id) {
            return deserializeRecordIdentity(id);
        });
    };
    RecordIdentityMap.prototype.equals = function (other) {
        return this.exclusiveOf(other).length === 0 && other.exclusiveOf(this).length === 0;
    };
    return RecordIdentityMap;
}();
exports.default = RecordIdentityMap;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjb3JkLWlkZW50aXR5LW1hcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9jYWNoZS9yZWNvcmQtaWRlbnRpdHktbWFwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUdBLGlDQUFpQyxBQUFzQixRQUNyRCxBQUFNO1dBQUksQUFBTSxPQUFDLEFBQUksYUFBSSxBQUFNLE9BQUMsQUFBSSxBQUFDLEFBQ3ZDLEFBQUM7O0FBRUQsbUNBQW1DLEFBQWdCLFVBQzNDO1FBQUEsb0JBQWdDO1FBQS9CLFVBQUk7UUFBRSxRQUFFLEFBQXdCLEFBQ3ZDLEFBQU07V0FBQyxFQUFFLEFBQUksTUFBQSxNQUFFLEFBQUUsSUFBQSxBQUFFLEFBQUMsQUFDdEIsQUFBQzs7QUFFRCxvQ0FHRTsrQkFBWSxBQUF3QixNQUNsQztZQUFNLEFBQVUsYUFBRyxBQUFJLEtBQUMsQUFBVSxhQUFHLEFBQUUsQUFBQyxBQUV4QyxBQUFFLEFBQUM7WUFBQyxBQUFJLEFBQUMsTUFBQyxBQUFDLEFBQ1QsQUFBTTttQkFBQyxBQUFJLEtBQUMsQUFBSSxLQUFDLEFBQVUsQUFBQyxZQUFDLEFBQU8sUUFBQyxVQUFBLEFBQUMsR0FDcEMsQUFBVTsyQkFBQyxBQUFDLEFBQUMsS0FBRyxBQUFJLEFBQUMsQUFDdkIsQUFBQyxBQUFDLEFBQUMsQUFDTDtBQUFDLEFBQ0g7QUFBQztBQUVEO2dDQUFHLE1BQUgsVUFBSSxBQUFzQixRQUN4QixBQUFJO2FBQUMsQUFBVSxXQUFDLEFBQXVCLHdCQUFDLEFBQU0sQUFBQyxBQUFDLFdBQUcsQUFBSSxBQUFDLEFBQzFELEFBQUM7QUFFRDtnQ0FBTSxTQUFOLFVBQU8sQUFBc0IsUUFDM0I7ZUFBTyxBQUFJLEtBQUMsQUFBVSxXQUFDLEFBQXVCLHdCQUFDLEFBQU0sQUFBQyxBQUFDLEFBQUMsQUFDMUQsQUFBQztBQUVEOzBCQUFJLDZCQUFNO2FBQVYsWUFDRSxBQUFNOzBCQUFRLEFBQUksS0FBQyxBQUFJLEtBQUMsQUFBVSxBQUFDLFlBQUMsQUFBRyxJQUFDLFVBQUEsQUFBRSxJQUFJO3VCQUFBLEFBQXlCLDBCQUF6QixBQUEwQixBQUFFLEFBQUMsQUFBQyxBQUFDLEFBQy9FO0FBRFMsQUFBTSxBQUNkOzs7c0JBQUEsQUFFRDs7Z0NBQUcsTUFBSCxVQUFJLEFBQXNCLFFBQ3hCLEFBQUUsQUFBQztZQUFDLEFBQU0sQUFBQyxRQUFDLEFBQUMsQUFDWCxBQUFNO21CQUFDLENBQUMsQ0FBQyxBQUFJLEtBQUMsQUFBVSxXQUFDLEFBQXVCLHdCQUFDLEFBQU0sQUFBQyxBQUFDLEFBQUMsQUFDNUQsQUFBQyxBQUFDLEFBQUk7ZUFBQyxBQUFDLEFBQ04sQUFBTTttQkFBQyxBQUFLLEFBQUMsQUFDZixBQUFDLEFBQ0g7QUFBQztBQUVEO2dDQUFXLGNBQVgsVUFBWSxBQUF3QixPQUNsQyxBQUFNO3NCQUFRLEFBQUksS0FBQyxBQUFJLEtBQUMsQUFBVSxBQUFDLFlBQ2hDLEFBQU0sT0FBQyxVQUFBLEFBQUUsSUFBSTttQkFBQSxDQUFDLEFBQUssTUFBQyxBQUFVLFdBQWpCLEFBQWtCLEFBQUUsQUFBQyxBQUFDO0FBRC9CLEFBQU0sV0FFVixBQUFHLElBQUMsVUFBQSxBQUFFLElBQUk7bUJBQUEsQUFBeUIsMEJBQXpCLEFBQTBCLEFBQUUsQUFBQyxBQUFDLEFBQUMsQUFDOUM7QUFBQztBQUVEO2dDQUFNLFNBQU4sVUFBTyxBQUF3QixPQUM3QixBQUFNO2VBQUMsQUFBSSxLQUFDLEFBQVcsWUFBQyxBQUFLLEFBQUMsT0FBQyxBQUFNLFdBQUssQUFBQyxLQUNwQyxBQUFLLE1BQUMsQUFBVyxZQUFDLEFBQUksQUFBQyxNQUFDLEFBQU0sV0FBSyxBQUFDLEFBQUMsQUFDOUMsQUFBQztBQUNIO1dBQUEsQUFBQyxBQTNDRCxBQTJDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpY3QgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xyXG5pbXBvcnQgeyBSZWNvcmRJZGVudGl0eSB9IGZyb20gJ0BvcmJpdC9kYXRhJztcclxuXHJcbmZ1bmN0aW9uIHNlcmlhbGl6ZVJlY29yZElkZW50aXR5KHJlY29yZDogUmVjb3JkSWRlbnRpdHkpOiBzdHJpbmcge1xyXG4gIHJldHVybiBgJHtyZWNvcmQudHlwZX06JHtyZWNvcmQuaWR9YDtcclxufVxyXG5cclxuZnVuY3Rpb24gZGVzZXJpYWxpemVSZWNvcmRJZGVudGl0eShpZGVudGl0eTogc3RyaW5nKTogUmVjb3JkSWRlbnRpdHkge1xyXG4gIGNvbnN0IFt0eXBlLCBpZF0gPSBpZGVudGl0eS5zcGxpdCgnOicpO1xyXG4gIHJldHVybiB7IHR5cGUsIGlkIH07XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlY29yZElkZW50aXR5TWFwIHtcclxuICBpZGVudGl0aWVzOiBEaWN0PGJvb2xlYW4+O1xyXG5cclxuICBjb25zdHJ1Y3RvcihiYXNlPzogUmVjb3JkSWRlbnRpdHlNYXApIHtcclxuICAgIGNvbnN0IGlkZW50aXRpZXMgPSB0aGlzLmlkZW50aXRpZXMgPSB7fTtcclxuXHJcbiAgICBpZiAoYmFzZSkge1xyXG4gICAgICBPYmplY3Qua2V5cyhiYXNlLmlkZW50aXRpZXMpLmZvckVhY2goayA9PiB7XHJcbiAgICAgICAgaWRlbnRpdGllc1trXSA9IHRydWU7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYWRkKHJlY29yZDogUmVjb3JkSWRlbnRpdHkpOiB2b2lkIHtcclxuICAgIHRoaXMuaWRlbnRpdGllc1tzZXJpYWxpemVSZWNvcmRJZGVudGl0eShyZWNvcmQpXSA9IHRydWU7XHJcbiAgfVxyXG5cclxuICByZW1vdmUocmVjb3JkOiBSZWNvcmRJZGVudGl0eSk6IHZvaWQge1xyXG4gICAgZGVsZXRlIHRoaXMuaWRlbnRpdGllc1tzZXJpYWxpemVSZWNvcmRJZGVudGl0eShyZWNvcmQpXTtcclxuICB9XHJcblxyXG4gIGdldCB2YWx1ZXMoKTogUmVjb3JkSWRlbnRpdHlbXSB7XHJcbiAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5pZGVudGl0aWVzKS5tYXAoaWQgPT4gZGVzZXJpYWxpemVSZWNvcmRJZGVudGl0eShpZCkpO1xyXG4gIH1cclxuXHJcbiAgaGFzKHJlY29yZDogUmVjb3JkSWRlbnRpdHkpOiBib29sZWFuIHtcclxuICAgIGlmIChyZWNvcmQpIHtcclxuICAgICAgcmV0dXJuICEhdGhpcy5pZGVudGl0aWVzW3NlcmlhbGl6ZVJlY29yZElkZW50aXR5KHJlY29yZCldO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZXhjbHVzaXZlT2Yob3RoZXI6IFJlY29yZElkZW50aXR5TWFwKTogUmVjb3JkSWRlbnRpdHlbXSB7XHJcbiAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5pZGVudGl0aWVzKVxyXG4gICAgICAuZmlsdGVyKGlkID0+ICFvdGhlci5pZGVudGl0aWVzW2lkXSlcclxuICAgICAgLm1hcChpZCA9PiBkZXNlcmlhbGl6ZVJlY29yZElkZW50aXR5KGlkKSk7XHJcbiAgfVxyXG5cclxuICBlcXVhbHMob3RoZXI6IFJlY29yZElkZW50aXR5TWFwKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5leGNsdXNpdmVPZihvdGhlcikubGVuZ3RoID09PSAwICYmXHJcbiAgICAgICAgICAgb3RoZXIuZXhjbHVzaXZlT2YodGhpcykubGVuZ3RoID09PSAwO1xyXG4gIH1cclxufVxyXG4iXX0=