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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjb3JkLWlkZW50aXR5LW1hcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9jYWNoZS9yZWNvcmQtaWRlbnRpdHktbWFwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUdBLGlDQUFpQyxBQUFzQjtBQUNyRCxBQUFNLFdBQUksQUFBTSxPQUFDLEFBQUksYUFBSSxBQUFNLE9BQUMsQUFBSSxBQUFDLEFBQ3ZDO0FBQUM7QUFFRCxtQ0FBbUMsQUFBZ0I7QUFDM0MsUUFBQSxvQkFBZ0M7UUFBL0IsVUFBSTtRQUFFLFFBQUUsQUFBd0I7QUFDdkMsQUFBTSxXQUFDLEVBQUUsQUFBSSxNQUFBLE1BQUUsQUFBRSxJQUFBLEFBQUUsQUFBQyxBQUN0QjtBQUFDO0FBRUQ7QUFHRSwrQkFBWSxBQUF3QjtBQUNsQyxZQUFNLEFBQVUsYUFBRyxBQUFJLEtBQUMsQUFBVSxhQUFHLEFBQUUsQUFBQztBQUV4QyxBQUFFLEFBQUMsWUFBQyxBQUFJLEFBQUMsTUFBQyxBQUFDO0FBQ1QsQUFBTSxtQkFBQyxBQUFJLEtBQUMsQUFBSSxLQUFDLEFBQVUsQUFBQyxZQUFDLEFBQU8sUUFBQyxVQUFBLEFBQUM7QUFDcEMsQUFBVSwyQkFBQyxBQUFDLEFBQUMsS0FBRyxBQUFJLEFBQUMsQUFDdkI7QUFBQyxBQUFDLEFBQUMsQUFDTDtBQUFDLEFBQ0g7QUFBQztBQUVELGdDQUFHLE1BQUgsVUFBSSxBQUFzQjtBQUN4QixBQUFJLGFBQUMsQUFBVSxXQUFDLEFBQXVCLHdCQUFDLEFBQU0sQUFBQyxBQUFDLFdBQUcsQUFBSSxBQUFDLEFBQzFEO0FBQUM7QUFFRCxnQ0FBTSxTQUFOLFVBQU8sQUFBc0I7QUFDM0IsZUFBTyxBQUFJLEtBQUMsQUFBVSxXQUFDLEFBQXVCLHdCQUFDLEFBQU0sQUFBQyxBQUFDLEFBQUMsQUFDMUQ7QUFBQztBQUVELDBCQUFJLDZCQUFNO2FBQVY7QUFDRSxBQUFNLDBCQUFRLEFBQUksS0FBQyxBQUFJLEtBQUMsQUFBVSxBQUFDLFlBQUMsQUFBRyxJQUFDLFVBQUEsQUFBRTtBQUFJLHVCQUFBLEFBQXlCLDBCQUF6QixBQUEwQixBQUFFLEFBQUM7QUFBQSxBQUFDLEFBQUMsQUFDL0UsYUFEUyxBQUFNO0FBQ2Q7O3NCQUFBOztBQUVELGdDQUFHLE1BQUgsVUFBSSxBQUFzQjtBQUN4QixBQUFFLEFBQUMsWUFBQyxBQUFNLEFBQUMsUUFBQyxBQUFDO0FBQ1gsQUFBTSxtQkFBQyxDQUFDLENBQUMsQUFBSSxLQUFDLEFBQVUsV0FBQyxBQUF1Qix3QkFBQyxBQUFNLEFBQUMsQUFBQyxBQUFDLEFBQzVEO0FBQUMsQUFBQyxBQUFJLGVBQUMsQUFBQztBQUNOLEFBQU0sbUJBQUMsQUFBSyxBQUFDLEFBQ2Y7QUFBQyxBQUNIO0FBQUM7QUFFRCxnQ0FBVyxjQUFYLFVBQVksQUFBd0I7QUFDbEMsQUFBTSxzQkFBUSxBQUFJLEtBQUMsQUFBSSxLQUFDLEFBQVUsQUFBQyxZQUNoQyxBQUFNLE9BQUMsVUFBQSxBQUFFO0FBQUksbUJBQUEsQ0FBQyxBQUFLLE1BQUMsQUFBVSxXQUFqQixBQUFrQixBQUFFLEFBQUM7QUFBQSxBQUFDLFNBRC9CLEFBQU0sRUFFVixBQUFHLElBQUMsVUFBQSxBQUFFO0FBQUksbUJBQUEsQUFBeUIsMEJBQXpCLEFBQTBCLEFBQUUsQUFBQztBQUFBLEFBQUMsQUFBQyxBQUM5QztBQUFDO0FBRUQsZ0NBQU0sU0FBTixVQUFPLEFBQXdCO0FBQzdCLEFBQU0sZUFBQyxBQUFJLEtBQUMsQUFBVyxZQUFDLEFBQUssQUFBQyxPQUFDLEFBQU0sV0FBSyxBQUFDLEtBQ3BDLEFBQUssTUFBQyxBQUFXLFlBQUMsQUFBSSxBQUFDLE1BQUMsQUFBTSxXQUFLLEFBQUMsQUFBQyxBQUM5QztBQUFDO0FBQ0gsV0FBQSxBQUFDO0FBM0NELEFBMkNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGljdCB9IGZyb20gJ0BvcmJpdC91dGlscyc7XHJcbmltcG9ydCB7IFJlY29yZElkZW50aXR5IH0gZnJvbSAnQG9yYml0L2RhdGEnO1xyXG5cclxuZnVuY3Rpb24gc2VyaWFsaXplUmVjb3JkSWRlbnRpdHkocmVjb3JkOiBSZWNvcmRJZGVudGl0eSk6IHN0cmluZyB7XHJcbiAgcmV0dXJuIGAke3JlY29yZC50eXBlfToke3JlY29yZC5pZH1gO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkZXNlcmlhbGl6ZVJlY29yZElkZW50aXR5KGlkZW50aXR5OiBzdHJpbmcpOiBSZWNvcmRJZGVudGl0eSB7XHJcbiAgY29uc3QgW3R5cGUsIGlkXSA9IGlkZW50aXR5LnNwbGl0KCc6Jyk7XHJcbiAgcmV0dXJuIHsgdHlwZSwgaWQgfTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVjb3JkSWRlbnRpdHlNYXAge1xyXG4gIGlkZW50aXRpZXM6IERpY3Q8Ym9vbGVhbj47XHJcblxyXG4gIGNvbnN0cnVjdG9yKGJhc2U/OiBSZWNvcmRJZGVudGl0eU1hcCkge1xyXG4gICAgY29uc3QgaWRlbnRpdGllcyA9IHRoaXMuaWRlbnRpdGllcyA9IHt9O1xyXG5cclxuICAgIGlmIChiYXNlKSB7XHJcbiAgICAgIE9iamVjdC5rZXlzKGJhc2UuaWRlbnRpdGllcykuZm9yRWFjaChrID0+IHtcclxuICAgICAgICBpZGVudGl0aWVzW2tdID0gdHJ1ZTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhZGQocmVjb3JkOiBSZWNvcmRJZGVudGl0eSk6IHZvaWQge1xyXG4gICAgdGhpcy5pZGVudGl0aWVzW3NlcmlhbGl6ZVJlY29yZElkZW50aXR5KHJlY29yZCldID0gdHJ1ZTtcclxuICB9XHJcblxyXG4gIHJlbW92ZShyZWNvcmQ6IFJlY29yZElkZW50aXR5KTogdm9pZCB7XHJcbiAgICBkZWxldGUgdGhpcy5pZGVudGl0aWVzW3NlcmlhbGl6ZVJlY29yZElkZW50aXR5KHJlY29yZCldO1xyXG4gIH1cclxuXHJcbiAgZ2V0IHZhbHVlcygpOiBSZWNvcmRJZGVudGl0eVtdIHtcclxuICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLmlkZW50aXRpZXMpLm1hcChpZCA9PiBkZXNlcmlhbGl6ZVJlY29yZElkZW50aXR5KGlkKSk7XHJcbiAgfVxyXG5cclxuICBoYXMocmVjb3JkOiBSZWNvcmRJZGVudGl0eSk6IGJvb2xlYW4ge1xyXG4gICAgaWYgKHJlY29yZCkge1xyXG4gICAgICByZXR1cm4gISF0aGlzLmlkZW50aXRpZXNbc2VyaWFsaXplUmVjb3JkSWRlbnRpdHkocmVjb3JkKV07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBleGNsdXNpdmVPZihvdGhlcjogUmVjb3JkSWRlbnRpdHlNYXApOiBSZWNvcmRJZGVudGl0eVtdIHtcclxuICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLmlkZW50aXRpZXMpXHJcbiAgICAgIC5maWx0ZXIoaWQgPT4gIW90aGVyLmlkZW50aXRpZXNbaWRdKVxyXG4gICAgICAubWFwKGlkID0+IGRlc2VyaWFsaXplUmVjb3JkSWRlbnRpdHkoaWQpKTtcclxuICB9XHJcblxyXG4gIGVxdWFscyhvdGhlcjogUmVjb3JkSWRlbnRpdHlNYXApOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLmV4Y2x1c2l2ZU9mKG90aGVyKS5sZW5ndGggPT09IDAgJiZcclxuICAgICAgICAgICBvdGhlci5leGNsdXNpdmVPZih0aGlzKS5sZW5ndGggPT09IDA7XHJcbiAgfVxyXG59XHJcbiJdfQ==