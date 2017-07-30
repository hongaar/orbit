"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function serializeRecordIdentity(record) {
    return record.type + ":" + record.id;
}
function deserializeRecordIdentity(identity) {
    var _a = identity.split(':'), type = _a[0], id = _a[1];
    return { type: type, id: id };
}
var RecordIdentityMap = (function () {
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
            return Object.keys(this.identities).map(function (id) { return deserializeRecordIdentity(id); });
        },
        enumerable: true,
        configurable: true
    });
    RecordIdentityMap.prototype.has = function (record) {
        if (record) {
            return !!this.identities[serializeRecordIdentity(record)];
        }
        else {
            return false;
        }
    };
    RecordIdentityMap.prototype.exclusiveOf = function (other) {
        return Object.keys(this.identities)
            .filter(function (id) { return !other.identities[id]; })
            .map(function (id) { return deserializeRecordIdentity(id); });
    };
    RecordIdentityMap.prototype.equals = function (other) {
        return this.exclusiveOf(other).length === 0 &&
            other.exclusiveOf(this).length === 0;
    };
    return RecordIdentityMap;
}());
exports.default = RecordIdentityMap;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjb3JkLWlkZW50aXR5LW1hcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9jYWNoZS9yZWNvcmQtaWRlbnRpdHktbWFwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBR0EsaUNBQWlDLE1BQXNCO0lBQ3JELE1BQU0sQ0FBSSxNQUFNLENBQUMsSUFBSSxTQUFJLE1BQU0sQ0FBQyxFQUFJLENBQUM7QUFDdkMsQ0FBQztBQUVELG1DQUFtQyxRQUFnQjtJQUMzQyxJQUFBLHdCQUFnQyxFQUEvQixZQUFJLEVBQUUsVUFBRSxDQUF3QjtJQUN2QyxNQUFNLENBQUMsRUFBRSxJQUFJLE1BQUEsRUFBRSxFQUFFLElBQUEsRUFBRSxDQUFDO0FBQ3RCLENBQUM7QUFFRDtJQUdFLDJCQUFZLElBQXdCO1FBQ2xDLElBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDO1FBRXhDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDVCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQSxDQUFDO2dCQUNwQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQ3ZCLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztJQUNILENBQUM7SUFFRCwrQkFBRyxHQUFILFVBQUksTUFBc0I7UUFDeEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyx1QkFBdUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztJQUMxRCxDQUFDO0lBRUQsa0NBQU0sR0FBTixVQUFPLE1BQXNCO1FBQzNCLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyx1QkFBdUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFFRCxzQkFBSSxxQ0FBTTthQUFWO1lBQ0UsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLEVBQUUsSUFBSSxPQUFBLHlCQUF5QixDQUFDLEVBQUUsQ0FBQyxFQUE3QixDQUE2QixDQUFDLENBQUM7UUFDL0UsQ0FBQzs7O09BQUE7SUFFRCwrQkFBRyxHQUFILFVBQUksTUFBc0I7UUFDeEIsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNYLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyx1QkFBdUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQzVELENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDZixDQUFDO0lBQ0gsQ0FBQztJQUVELHVDQUFXLEdBQVgsVUFBWSxLQUF3QjtRQUNsQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO2FBQ2hDLE1BQU0sQ0FBQyxVQUFBLEVBQUUsSUFBSSxPQUFBLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBckIsQ0FBcUIsQ0FBQzthQUNuQyxHQUFHLENBQUMsVUFBQSxFQUFFLElBQUksT0FBQSx5QkFBeUIsQ0FBQyxFQUFFLENBQUMsRUFBN0IsQ0FBNkIsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFFRCxrQ0FBTSxHQUFOLFVBQU8sS0FBd0I7UUFDN0IsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUM7WUFDcEMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFDSCx3QkFBQztBQUFELENBQUMsQUEzQ0QsSUEyQ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaWN0IH0gZnJvbSAnQG9yYml0L3V0aWxzJztcclxuaW1wb3J0IHsgUmVjb3JkSWRlbnRpdHkgfSBmcm9tICdAb3JiaXQvZGF0YSc7XHJcblxyXG5mdW5jdGlvbiBzZXJpYWxpemVSZWNvcmRJZGVudGl0eShyZWNvcmQ6IFJlY29yZElkZW50aXR5KTogc3RyaW5nIHtcclxuICByZXR1cm4gYCR7cmVjb3JkLnR5cGV9OiR7cmVjb3JkLmlkfWA7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRlc2VyaWFsaXplUmVjb3JkSWRlbnRpdHkoaWRlbnRpdHk6IHN0cmluZyk6IFJlY29yZElkZW50aXR5IHtcclxuICBjb25zdCBbdHlwZSwgaWRdID0gaWRlbnRpdHkuc3BsaXQoJzonKTtcclxuICByZXR1cm4geyB0eXBlLCBpZCB9O1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWNvcmRJZGVudGl0eU1hcCB7XHJcbiAgaWRlbnRpdGllczogRGljdDxib29sZWFuPjtcclxuXHJcbiAgY29uc3RydWN0b3IoYmFzZT86IFJlY29yZElkZW50aXR5TWFwKSB7XHJcbiAgICBjb25zdCBpZGVudGl0aWVzID0gdGhpcy5pZGVudGl0aWVzID0ge307XHJcblxyXG4gICAgaWYgKGJhc2UpIHtcclxuICAgICAgT2JqZWN0LmtleXMoYmFzZS5pZGVudGl0aWVzKS5mb3JFYWNoKGsgPT4ge1xyXG4gICAgICAgIGlkZW50aXRpZXNba10gPSB0cnVlO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGFkZChyZWNvcmQ6IFJlY29yZElkZW50aXR5KTogdm9pZCB7XHJcbiAgICB0aGlzLmlkZW50aXRpZXNbc2VyaWFsaXplUmVjb3JkSWRlbnRpdHkocmVjb3JkKV0gPSB0cnVlO1xyXG4gIH1cclxuXHJcbiAgcmVtb3ZlKHJlY29yZDogUmVjb3JkSWRlbnRpdHkpOiB2b2lkIHtcclxuICAgIGRlbGV0ZSB0aGlzLmlkZW50aXRpZXNbc2VyaWFsaXplUmVjb3JkSWRlbnRpdHkocmVjb3JkKV07XHJcbiAgfVxyXG5cclxuICBnZXQgdmFsdWVzKCk6IFJlY29yZElkZW50aXR5W10ge1xyXG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMuaWRlbnRpdGllcykubWFwKGlkID0+IGRlc2VyaWFsaXplUmVjb3JkSWRlbnRpdHkoaWQpKTtcclxuICB9XHJcblxyXG4gIGhhcyhyZWNvcmQ6IFJlY29yZElkZW50aXR5KTogYm9vbGVhbiB7XHJcbiAgICBpZiAocmVjb3JkKSB7XHJcbiAgICAgIHJldHVybiAhIXRoaXMuaWRlbnRpdGllc1tzZXJpYWxpemVSZWNvcmRJZGVudGl0eShyZWNvcmQpXTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGV4Y2x1c2l2ZU9mKG90aGVyOiBSZWNvcmRJZGVudGl0eU1hcCk6IFJlY29yZElkZW50aXR5W10ge1xyXG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMuaWRlbnRpdGllcylcclxuICAgICAgLmZpbHRlcihpZCA9PiAhb3RoZXIuaWRlbnRpdGllc1tpZF0pXHJcbiAgICAgIC5tYXAoaWQgPT4gZGVzZXJpYWxpemVSZWNvcmRJZGVudGl0eShpZCkpO1xyXG4gIH1cclxuXHJcbiAgZXF1YWxzKG90aGVyOiBSZWNvcmRJZGVudGl0eU1hcCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuZXhjbHVzaXZlT2Yob3RoZXIpLmxlbmd0aCA9PT0gMCAmJlxyXG4gICAgICAgICAgIG90aGVyLmV4Y2x1c2l2ZU9mKHRoaXMpLmxlbmd0aCA9PT0gMDtcclxuICB9XHJcbn1cclxuIl19