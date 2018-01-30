"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@orbit/utils");
var JSONAPISerializer = (function () {
    function JSONAPISerializer(settings) {
        this._schema = settings.schema;
        this._keyMap = settings.keyMap;
    }
    Object.defineProperty(JSONAPISerializer.prototype, "schema", {
        get: function () {
            return this._schema;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JSONAPISerializer.prototype, "keyMap", {
        get: function () {
            return this._keyMap;
        },
        enumerable: true,
        configurable: true
    });
    JSONAPISerializer.prototype.resourceKey = function (type) {
        return 'id';
    };
    JSONAPISerializer.prototype.resourceType = function (type) {
        return utils_1.dasherize(this.schema.pluralize(type));
    };
    JSONAPISerializer.prototype.resourceRelationship = function (type, relationship) {
        return utils_1.dasherize(relationship);
    };
    JSONAPISerializer.prototype.resourceAttribute = function (type, attr) {
        return utils_1.dasherize(attr);
    };
    JSONAPISerializer.prototype.resourceIdentity = function (identity) {
        return {
            type: this.resourceType(identity.type),
            id: this.resourceId(identity.type, identity.id)
        };
    };
    JSONAPISerializer.prototype.resourceIds = function (type, ids) {
        var _this = this;
        return ids.map(function (id) { return _this.resourceId(type, id); });
    };
    JSONAPISerializer.prototype.resourceId = function (type, id) {
        var resourceKey = this.resourceKey(type);
        if (resourceKey === 'id') {
            return id;
        }
        else {
            return this.keyMap.idToKey(type, resourceKey, id);
        }
    };
    JSONAPISerializer.prototype.recordId = function (type, resourceId) {
        var resourceKey = this.resourceKey(type);
        if (resourceKey === 'id') {
            return resourceId;
        }
        var existingId = this.keyMap.keyToId(type, resourceKey, resourceId);
        if (existingId) {
            return existingId;
        }
        return this._generateNewId(type, resourceKey, resourceId);
    };
    JSONAPISerializer.prototype.recordType = function (resourceType) {
        return utils_1.camelize(this.schema.singularize(resourceType));
    };
    JSONAPISerializer.prototype.recordIdentity = function (resourceIdentity) {
        var type = this.recordType(resourceIdentity.type);
        var id = this.recordId(type, resourceIdentity.id);
        return { type: type, id: id };
    };
    JSONAPISerializer.prototype.recordAttribute = function (type, resourceAttribute) {
        return utils_1.camelize(resourceAttribute);
    };
    JSONAPISerializer.prototype.recordRelationship = function (type, resourceRelationship) {
        return utils_1.camelize(resourceRelationship);
    };
    JSONAPISerializer.prototype.serializeDocument = function (data) {
        return {
            data: utils_1.isArray(data) ? this.serializeRecords(data) : this.serializeRecord(data)
        };
    };
    JSONAPISerializer.prototype.serializeRecords = function (records) {
        var _this = this;
        return records.map(function (record) { return _this.serializeRecord(record); });
    };
    JSONAPISerializer.prototype.serializeRecord = function (record) {
        var resource = {
            type: this.resourceType(record.type)
        };
        this.serializeId(resource, record);
        this.serializeAttributes(resource, record);
        this.serializeRelationships(resource, record);
        return resource;
    };
    JSONAPISerializer.prototype.serializeId = function (resource, record) {
        var value = this.resourceId(record.type, record.id);
        if (value !== undefined) {
            resource.id = value;
        }
    };
    JSONAPISerializer.prototype.serializeAttributes = function (resource, record) {
        var _this = this;
        if (record.attributes) {
            Object.keys(record.attributes).forEach(function (attr) {
                _this.serializeAttribute(resource, record, attr);
            });
        }
    };
    JSONAPISerializer.prototype.serializeAttribute = function (resource, record, attr) {
        var value = record.attributes[attr];
        if (value !== undefined) {
            utils_1.deepSet(resource, ['attributes', this.resourceAttribute(record.type, attr)], value);
        }
    };
    JSONAPISerializer.prototype.serializeRelationships = function (resource, record) {
        var _this = this;
        if (record.relationships) {
            Object.keys(record.relationships).forEach(function (relationship) {
                _this.serializeRelationship(resource, record, relationship);
            });
        }
    };
    JSONAPISerializer.prototype.serializeRelationship = function (resource, record, relationship) {
        var _this = this;
        var value = record.relationships[relationship].data;
        if (value !== undefined) {
            var data = void 0;
            if (utils_1.isArray(value)) {
                data = value.map(function (id) { return _this.resourceIdentity(id); });
            }
            else if (value !== null) {
                data = this.resourceIdentity(value);
            }
            else {
                data = null;
            }
            var resourceRelationship = this.resourceRelationship(record.type, relationship);
            utils_1.deepSet(resource, ['relationships', resourceRelationship, 'data'], data);
        }
    };
    JSONAPISerializer.prototype.deserializeDocument = function (document) {
        var result;
        var data = document.data;
        if (utils_1.isArray(data)) {
            result = {
                data: data.map(this.deserializeResource, this)
            };
        }
        else {
            result = {
                data: this.deserializeResource(data)
            };
        }
        if (document.included) {
            result.included = document.included.map(this.deserializeResource, this);
        }
        return result;
    };
    JSONAPISerializer.prototype.deserializeResource = function (resource) {
        var record;
        var type = this.recordType(resource.type);
        var resourceKey = this.resourceKey(type);
        if (resourceKey === 'id') {
            record = { type: type, id: resource.id };
        }
        else {
            var id = void 0;
            var keys = void 0;
            if (resource.id) {
                keys = (_a = {},
                    _a[resourceKey] = resource.id,
                    _a);
                id = this.keyMap.idFromKeys(type, keys) ||
                    this.schema.generateId(type);
            }
            else {
                id = this.schema.generateId(type);
            }
            record = { type: type, id: id };
            if (keys) {
                record.keys = keys;
            }
        }
        this.deserializeAttributes(record, resource);
        this.deserializeRelationships(record, resource);
        if (this.keyMap) {
            this.keyMap.pushRecord(record);
        }
        return record;
        var _a;
    };
    JSONAPISerializer.prototype.deserializeAttributes = function (record, resource) {
        var _this = this;
        if (resource.attributes) {
            Object.keys(resource.attributes).forEach(function (resourceAttribute) {
                var attribute = _this.recordAttribute(record.type, resourceAttribute);
                if (_this.schema.hasAttribute(record.type, attribute)) {
                    var value = resource.attributes[resourceAttribute];
                    _this.deserializeAttribute(record, attribute, value);
                }
            });
        }
    };
    JSONAPISerializer.prototype.deserializeAttribute = function (record, attr, value) {
        record.attributes = record.attributes || {};
        record.attributes[attr] = value;
    };
    JSONAPISerializer.prototype.deserializeRelationships = function (record, resource) {
        var _this = this;
        if (resource.relationships) {
            Object.keys(resource.relationships).forEach(function (resourceRel) {
                var relationship = _this.recordRelationship(record.type, resourceRel);
                if (_this.schema.hasRelationship(record.type, relationship)) {
                    var value = resource.relationships[resourceRel];
                    _this.deserializeRelationship(record, relationship, value);
                }
            });
        }
    };
    JSONAPISerializer.prototype.deserializeRelationship = function (record, relationship, value) {
        var _this = this;
        var resourceData = value.data;
        if (resourceData !== undefined) {
            var data = void 0;
            if (resourceData === null) {
                data = null;
            }
            else if (utils_1.isArray(resourceData)) {
                data = resourceData.map(function (resourceIdentity) { return _this.recordIdentity(resourceIdentity); });
            }
            else {
                data = this.recordIdentity(resourceData);
            }
            record.relationships = record.relationships || {};
            record.relationships[relationship] = { data: data };
        }
    };
    JSONAPISerializer.prototype._generateNewId = function (type, keyName, keyValue) {
        var id = this.schema.generateId(type);
        this.keyMap.pushRecord({
            type: type,
            id: id,
            keys: (_a = {},
                _a[keyName] = keyValue,
                _a)
        });
        return id;
        var _a;
    };
    return JSONAPISerializer;
}());
exports.default = JSONAPISerializer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbmFwaS1zZXJpYWxpemVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3JjL2pzb25hcGktc2VyaWFsaXplci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUFxRjtBQTJCckY7SUFJRSwyQkFBWSxRQUFtQztRQUM3QyxJQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUM7UUFDL0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDO0lBQ2pDLENBQUM7SUFFRCxzQkFBSSxxQ0FBTTthQUFWO1lBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDdEIsQ0FBQzs7O09BQUE7SUFFRCxzQkFBSSxxQ0FBTTthQUFWO1lBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDdEIsQ0FBQzs7O09BQUE7SUFFRCx1Q0FBVyxHQUFYLFVBQVksSUFBWTtRQUN0QixNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELHdDQUFZLEdBQVosVUFBYSxJQUFZO1FBQ3ZCLE1BQU0sQ0FBQyxpQkFBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVELGdEQUFvQixHQUFwQixVQUFxQixJQUFZLEVBQUUsWUFBb0I7UUFDckQsTUFBTSxDQUFDLGlCQUFTLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDakMsQ0FBQztJQUVELDZDQUFpQixHQUFqQixVQUFrQixJQUFZLEVBQUUsSUFBWTtRQUMxQyxNQUFNLENBQUMsaUJBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN6QixDQUFDO0lBRUQsNENBQWdCLEdBQWhCLFVBQWlCLFFBQXdCO1FBQ3ZDLE1BQU0sQ0FBQztZQUNMLElBQUksRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7WUFDdEMsRUFBRSxFQUFFLElBQUksQ0FB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QUMsQ0FBQztnQkFDakMsSUFBSSxHQUFJLFlBQW1DLENBQUMsR0FBRyxDQUFDLFVBQUEsZ0JBQWdCLElBQUksT0FBQSxLQUFJLENBQUMsY0FBYyxDQUFDLGdCQUFnQixDQUFDLEVBQXJDLENBQXFDLENBQUMsQ0FBQztZQUM3RyxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ04sSUFBSSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsWUFBZ0MsQ0FBQyxDQUFDO1lBQy9ELENBQUM7WUFFRCxNQUFNLENBQUMsYUFBYSxHQUFHLE1BQU0sQ0FBQyxhQUFhLElBQUksRUFBRSxDQUFDO1lBQ2xELE1BQU0sQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxJQUFJLE1BQUEsRUFBRSxDQUFDO1FBQ2hELENBQUM7SUFDSCxDQUFDO0lBRVMsMENBQWMsR0FBeEIsVUFBeUIsSUFBWSxFQUFFLE9BQWUsRUFBRSxRQUFnQjtRQUN0RSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUV0QyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQztZQUNyQixJQUFJLE1BQUE7WUFDSixFQUFFLElBQUE7WUFDRixJQUFJO2dCQUNGLEdBQUMsT0FBTyxJQUFHLFFBQVE7bUJBQ3BCO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLEVBQUUsQ0FBQzs7SUFDWixDQUFDO0lBQ0gsd0JBQUM7QUFBRCxDQUFDLEFBelJELElBeVJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaXNBcnJheSwgaXNPYmplY3QsIGRhc2hlcml6ZSwgY2FtZWxpemUsIGRlZXBTZXQsIERpY3QgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xyXG5pbXBvcnQge1xyXG4gIFNjaGVtYSxcclxuICBLZXlNYXAsXHJcbiAgUmVjb3JkLFxyXG4gIFJlY29yZElkZW50aXR5LFxyXG4gIFJlY29yZFJlbGF0aW9uc2hpcFxyXG59IGZyb20gJ0BvcmJpdC9kYXRhJztcclxuaW1wb3J0IHtcclxuICBSZXNvdXJjZSxcclxuICBSZXNvdXJjZUlkZW50aXR5LFxyXG4gIFJlc291cmNlSGFzTWFueVJlbGF0aW9uc2hpcCxcclxuICBSZXNvdXJjZUhhc09uZVJlbGF0aW9uc2hpcCxcclxuICBSZXNvdXJjZVJlbGF0aW9uc2hpcCxcclxuICBKU09OQVBJRG9jdW1lbnRcclxufSBmcm9tICcuL2pzb25hcGktZG9jdW1lbnQnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBEZXNlcmlhbGl6ZWREb2N1bWVudCB7XHJcbiAgZGF0YTogUmVjb3JkIHwgUmVjb3JkW11cclxuICBpbmNsdWRlZD86IFJlY29yZFtdXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSlNPTkFQSVNlcmlhbGl6ZXJTZXR0aW5ncyB7XHJcbiAgc2NoZW1hOiBTY2hlbWE7XHJcbiAga2V5TWFwPzogS2V5TWFwO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBKU09OQVBJU2VyaWFsaXplciB7XHJcbiAgcHJvdGVjdGVkIF9zY2hlbWE6IFNjaGVtYTtcclxuICBwcm90ZWN0ZWQgX2tleU1hcDogS2V5TWFwO1xyXG5cclxuICBjb25zdHJ1Y3RvcihzZXR0aW5nczogSlNPTkFQSVNlcmlhbGl6ZXJTZXR0aW5ncykge1xyXG4gICAgdGhpcy5fc2NoZW1hID0gc2V0dGluZ3Muc2NoZW1hO1xyXG4gICAgdGhpcy5fa2V5TWFwID0gc2V0dGluZ3Mua2V5TWFwO1xyXG4gIH1cclxuXHJcbiAgZ2V0IHNjaGVtYSgpOiBTY2hlbWEge1xyXG4gICAgcmV0dXJuIHRoaXMuX3NjaGVtYTtcclxuICB9XHJcblxyXG4gIGdldCBrZXlNYXAoKTogS2V5TWFwIHtcclxuICAgIHJldHVybiB0aGlzLl9rZXlNYXA7XHJcbiAgfVxyXG5cclxuICByZXNvdXJjZUtleSh0eXBlOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuICdpZCc7XHJcbiAgfVxyXG5cclxuICByZXNvdXJjZVR5cGUodHlwZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIHJldHVybiBkYXNoZXJpemUodGhpcy5zY2hlbWEucGx1cmFsaXplKHR5cGUpKTtcclxuICB9XHJcblxyXG4gIHJlc291cmNlUmVsYXRpb25zaGlwKHR5cGU6IHN0cmluZywgcmVsYXRpb25zaGlwOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIGRhc2hlcml6ZShyZWxhdGlvbnNoaXApO1xyXG4gIH1cclxuXHJcbiAgcmVzb3VyY2VBdHRyaWJ1dGUodHlwZTogc3RyaW5nLCBhdHRyOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIGRhc2hlcml6ZShhdHRyKTtcclxuICB9XHJcblxyXG4gIHJlc291cmNlSWRlbnRpdHkoaWRlbnRpdHk6IFJlY29yZElkZW50aXR5KTogUmVzb3VyY2VJZGVudGl0eSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB0eXBlOiB0aGlzLnJlc291cmNlVHlwZShpZGVudGl0eS50eXBlKSxcclxuICAgICAgaWQ6IHRoaXMucmVzb3VyY2VJZChpZGVudGl0eS50eXBlLCBpZGVudGl0eS5pZClcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICByZXNvdXJjZUlkcyh0eXBlOiBzdHJpbmcsIGlkczogc3RyaW5nW10pOiBzdHJpbmdbXSB7XHJcbiAgICByZXR1cm4gaWRzLm1hcChpZCA9PiB0aGlzLnJlc291cmNlSWQodHlwZSwgaWQpKTtcclxuICB9XHJcblxyXG4gIHJlc291cmNlSWQodHlwZTogc3RyaW5nLCBpZDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIGxldCByZXNvdXJjZUtleSA9IHRoaXMucmVzb3VyY2VLZXkodHlwZSk7XHJcblxyXG4gICAgaWYgKHJlc291cmNlS2V5ID09PSAnaWQnKSB7XHJcbiAgICAgIHJldHVybiBpZDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmtleU1hcC5pZFRvS2V5KHR5cGUsIHJlc291cmNlS2V5LCBpZCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZWNvcmRJZCh0eXBlOiBzdHJpbmcsIHJlc291cmNlSWQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICBsZXQgcmVzb3VyY2VLZXkgPSB0aGlzLnJlc291cmNlS2V5KHR5cGUpO1xyXG5cclxuICAgIGlmIChyZXNvdXJjZUtleSA9PT0gJ2lkJykge1xyXG4gICAgICByZXR1cm4gcmVzb3VyY2VJZDtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgZXhpc3RpbmdJZCA9IHRoaXMua2V5TWFwLmtleVRvSWQodHlwZSwgcmVzb3VyY2VLZXksIHJlc291cmNlSWQpO1xyXG5cclxuICAgIGlmIChleGlzdGluZ0lkKSB7XHJcbiAgICAgIHJldHVybiBleGlzdGluZ0lkO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLl9nZW5lcmF0ZU5ld0lkKHR5cGUsIHJlc291cmNlS2V5LCByZXNvdXJjZUlkKTtcclxuICB9XHJcblxyXG4gIHJlY29yZFR5cGUocmVzb3VyY2VUeXBlOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIGNhbWVsaXplKHRoaXMuc2NoZW1hLnNpbmd1bGFyaXplKHJlc291cmNlVHlwZSkpO1xyXG4gIH1cclxuXHJcbiAgcmVjb3JkSWRlbnRpdHkocmVzb3VyY2VJZGVudGl0eTogUmVzb3VyY2VJZGVudGl0eSk6IFJlY29yZElkZW50aXR5IHtcclxuICAgIGxldCB0eXBlID0gdGhpcy5yZWNvcmRUeXBlKHJlc291cmNlSWRlbnRpdHkudHlwZSk7XHJcbiAgICBsZXQgaWQgPSB0aGlzLnJlY29yZElkKHR5cGUsIHJlc291cmNlSWRlbnRpdHkuaWQpO1xyXG4gICAgcmV0dXJuIHsgdHlwZSwgaWQgfTtcclxuICB9XHJcblxyXG4gIHJlY29yZEF0dHJpYnV0ZSh0eXBlOiBzdHJpbmcsIHJlc291cmNlQXR0cmlidXRlOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIGNhbWVsaXplKHJlc291cmNlQXR0cmlidXRlKTtcclxuICB9XHJcblxyXG4gIHJlY29yZFJlbGF0aW9uc2hpcCh0eXBlOiBzdHJpbmcsIHJlc291cmNlUmVsYXRpb25zaGlwOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIGNhbWVsaXplKHJlc291cmNlUmVsYXRpb25zaGlwKTtcclxuICB9XHJcblxyXG4gIHNlcmlhbGl6ZURvY3VtZW50KGRhdGE6IFJlY29yZCB8IFJlY29yZFtdKTogSlNPTkFQSURvY3VtZW50IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGRhdGE6IGlzQXJyYXkoZGF0YSkgPyB0aGlzLnNlcmlhbGl6ZVJlY29yZHMoPFJlY29yZFtdPmRhdGEpIDogdGhpcy5zZXJpYWxpemVSZWNvcmQoPFJlY29yZD5kYXRhKVxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIHNlcmlhbGl6ZVJlY29yZHMocmVjb3JkczogUmVjb3JkW10pOiBSZXNvdXJjZVtdIHtcclxuICAgIHJldHVybiByZWNvcmRzLm1hcChyZWNvcmQgPT4gdGhpcy5zZXJpYWxpemVSZWNvcmQocmVjb3JkKSk7XHJcbiAgfVxyXG5cclxuICBzZXJpYWxpemVSZWNvcmQocmVjb3JkOiBSZWNvcmQpOiBSZXNvdXJjZSB7XHJcbiAgICBsZXQgcmVzb3VyY2U6IFJlc291cmNlID0ge1xyXG4gICAgICB0eXBlOiB0aGlzLnJlc291cmNlVHlwZShyZWNvcmQudHlwZSlcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5zZXJpYWxpemVJZChyZXNvdXJjZSwgcmVjb3JkKTtcclxuICAgIHRoaXMuc2VyaWFsaXplQXR0cmlidXRlcyhyZXNvdXJjZSwgcmVjb3JkKTtcclxuICAgIHRoaXMuc2VyaWFsaXplUmVsYXRpb25zaGlwcyhyZXNvdXJjZSwgcmVjb3JkKTtcclxuXHJcbiAgICByZXR1cm4gcmVzb3VyY2U7XHJcbiAgfVxyXG5cclxuICBzZXJpYWxpemVJZChyZXNvdXJjZTogUmVzb3VyY2UsIHJlY29yZDogUmVjb3JkSWRlbnRpdHkpOiB2b2lkIHtcclxuICAgIGxldCB2YWx1ZSA9IHRoaXMucmVzb3VyY2VJZChyZWNvcmQudHlwZSwgcmVjb3JkLmlkKTtcclxuICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHJlc291cmNlLmlkID0gdmFsdWU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzZXJpYWxpemVBdHRyaWJ1dGVzKHJlc291cmNlOiBSZXNvdXJjZSwgcmVjb3JkOiBSZWNvcmQpOiB2b2lkIHtcclxuICAgIGlmIChyZWNvcmQuYXR0cmlidXRlcykge1xyXG4gICAgICBPYmplY3Qua2V5cyhyZWNvcmQuYXR0cmlidXRlcykuZm9yRWFjaChhdHRyID0+IHtcclxuICAgICAgICB0aGlzLnNlcmlhbGl6ZUF0dHJpYnV0ZShyZXNvdXJjZSwgcmVjb3JkLCBhdHRyKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzZXJpYWxpemVBdHRyaWJ1dGUocmVzb3VyY2U6IFJlc291cmNlLCByZWNvcmQ6IFJlY29yZCwgYXR0cjogc3RyaW5nKTogdm9pZCB7XHJcbiAgICBsZXQgdmFsdWU6IGFueSA9IHJlY29yZC5hdHRyaWJ1dGVzW2F0dHJdO1xyXG4gICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgZGVlcFNldChyZXNvdXJjZSwgWydhdHRyaWJ1dGVzJywgdGhpcy5yZXNvdXJjZUF0dHJpYnV0ZShyZWNvcmQudHlwZSwgYXR0cildLCB2YWx1ZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzZXJpYWxpemVSZWxhdGlvbnNoaXBzKHJlc291cmNlOiBSZXNvdXJjZSwgcmVjb3JkOiBSZWNvcmQpOiB2b2lkIHtcclxuICAgIGlmIChyZWNvcmQucmVsYXRpb25zaGlwcykge1xyXG4gICAgICBPYmplY3Qua2V5cyhyZWNvcmQucmVsYXRpb25zaGlwcykuZm9yRWFjaChyZWxhdGlvbnNoaXAgPT4ge1xyXG4gICAgICAgIHRoaXMuc2VyaWFsaXplUmVsYXRpb25zaGlwKHJlc291cmNlLCByZWNvcmQsIHJlbGF0aW9uc2hpcCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc2VyaWFsaXplUmVsYXRpb25zaGlwKHJlc291cmNlOiBSZXNvdXJjZSwgcmVjb3JkOiBSZWNvcmQsIHJlbGF0aW9uc2hpcDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICBjb25zdCB2YWx1ZSA9IHJlY29yZC5yZWxhdGlvbnNoaXBzW3JlbGF0aW9uc2hpcF0uZGF0YTtcclxuXHJcbiAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICBsZXQgZGF0YTtcclxuXHJcbiAgICAgIGlmIChpc0FycmF5KHZhbHVlKSkge1xyXG4gICAgICAgIGRhdGEgPSAodmFsdWUgYXMgUmVjb3JkSWRlbnRpdHlbXSkubWFwKGlkID0+IHRoaXMucmVzb3VyY2VJZGVudGl0eShpZCkpO1xyXG4gICAgICB9IGVsc2UgaWYgKHZhbHVlICE9PSBudWxsKSB7XHJcbiAgICAgICAgZGF0YSA9IHRoaXMucmVzb3VyY2VJZGVudGl0eSh2YWx1ZSBhcyBSZWNvcmRJZGVudGl0eSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZGF0YSA9IG51bGw7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IHJlc291cmNlUmVsYXRpb25zaGlwID0gdGhpcy5yZXNvdXJjZVJlbGF0aW9uc2hpcChyZWNvcmQudHlwZSwgcmVsYXRpb25zaGlwKTtcclxuXHJcbiAgICAgIGRlZXBTZXQocmVzb3VyY2UsIFsncmVsYXRpb25zaGlwcycsIHJlc291cmNlUmVsYXRpb25zaGlwLCAnZGF0YSddLCBkYXRhKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGRlc2VyaWFsaXplRG9jdW1lbnQoZG9jdW1lbnQ6IEpTT05BUElEb2N1bWVudCk6IERlc2VyaWFsaXplZERvY3VtZW50IHtcclxuICAgIGxldCByZXN1bHQ6IERlc2VyaWFsaXplZERvY3VtZW50O1xyXG5cclxuICAgIGxldCBkYXRhID0gZG9jdW1lbnQuZGF0YTtcclxuICAgIGlmIChpc0FycmF5KGRhdGEpKSB7XHJcbiAgICAgIHJlc3VsdCA9IHtcclxuICAgICAgICBkYXRhOiAoPFJlc291cmNlW10+ZGF0YSkubWFwKHRoaXMuZGVzZXJpYWxpemVSZXNvdXJjZSwgdGhpcylcclxuICAgICAgfTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlc3VsdCA9IHtcclxuICAgICAgICBkYXRhOiB0aGlzLmRlc2VyaWFsaXplUmVzb3VyY2UoPFJlc291cmNlPmRhdGEpXHJcbiAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGRvY3VtZW50LmluY2x1ZGVkKSB7XHJcbiAgICAgIHJlc3VsdC5pbmNsdWRlZCA9IGRvY3VtZW50LmluY2x1ZGVkLm1hcCh0aGlzLmRlc2VyaWFsaXplUmVzb3VyY2UsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxuICBkZXNlcmlhbGl6ZVJlc291cmNlKHJlc291cmNlOiBSZXNvdXJjZSk6IFJlY29yZCB7XHJcbiAgICBsZXQgcmVjb3JkOiBSZWNvcmQ7XHJcbiAgICBsZXQgdHlwZTogc3RyaW5nID0gdGhpcy5yZWNvcmRUeXBlKHJlc291cmNlLnR5cGUpO1xyXG4gICAgbGV0IHJlc291cmNlS2V5ID0gdGhpcy5yZXNvdXJjZUtleSh0eXBlKTtcclxuXHJcbiAgICBpZiAocmVzb3VyY2VLZXkgPT09ICdpZCcpIHtcclxuICAgICAgcmVjb3JkID0geyB0eXBlLCBpZDogcmVzb3VyY2UuaWQgfTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGxldCBpZDogc3RyaW5nO1xyXG4gICAgICBsZXQga2V5czogRGljdDxzdHJpbmc+O1xyXG5cclxuICAgICAgaWYgKHJlc291cmNlLmlkKSB7XHJcbiAgICAgICAga2V5cyA9IHtcclxuICAgICAgICAgIFtyZXNvdXJjZUtleV06IHJlc291cmNlLmlkXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWQgPSB0aGlzLmtleU1hcC5pZEZyb21LZXlzKHR5cGUsIGtleXMpIHx8XHJcbiAgICAgICAgICAgICB0aGlzLnNjaGVtYS5nZW5lcmF0ZUlkKHR5cGUpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlkID0gdGhpcy5zY2hlbWEuZ2VuZXJhdGVJZCh0eXBlKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmVjb3JkID0geyB0eXBlLCBpZCB9O1xyXG5cclxuICAgICAgaWYgKGtleXMpIHtcclxuICAgICAgICByZWNvcmQua2V5cyA9IGtleXM7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmRlc2VyaWFsaXplQXR0cmlidXRlcyhyZWNvcmQsIHJlc291cmNlKTtcclxuICAgIHRoaXMuZGVzZXJpYWxpemVSZWxhdGlvbnNoaXBzKHJlY29yZCwgcmVzb3VyY2UpO1xyXG5cclxuICAgIGlmICh0aGlzLmtleU1hcCkge1xyXG4gICAgICB0aGlzLmtleU1hcC5wdXNoUmVjb3JkKHJlY29yZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHJlY29yZDtcclxuICB9XHJcblxyXG4gIGRlc2VyaWFsaXplQXR0cmlidXRlcyhyZWNvcmQ6IFJlY29yZCwgcmVzb3VyY2U6IFJlc291cmNlKTogdm9pZCB7XHJcbiAgICBpZiAocmVzb3VyY2UuYXR0cmlidXRlcykge1xyXG4gICAgICBPYmplY3Qua2V5cyhyZXNvdXJjZS5hdHRyaWJ1dGVzKS5mb3JFYWNoKHJlc291cmNlQXR0cmlidXRlID0+IHtcclxuICAgICAgICBsZXQgYXR0cmlidXRlID0gdGhpcy5yZWNvcmRBdHRyaWJ1dGUocmVjb3JkLnR5cGUsIHJlc291cmNlQXR0cmlidXRlKTtcclxuICAgICAgICBpZiAodGhpcy5zY2hlbWEuaGFzQXR0cmlidXRlKHJlY29yZC50eXBlLCBhdHRyaWJ1dGUpKSB7XHJcbiAgICAgICAgICBsZXQgdmFsdWUgPSByZXNvdXJjZS5hdHRyaWJ1dGVzW3Jlc291cmNlQXR0cmlidXRlXTtcclxuICAgICAgICAgIHRoaXMuZGVzZXJpYWxpemVBdHRyaWJ1dGUocmVjb3JkLCBhdHRyaWJ1dGUsIHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZGVzZXJpYWxpemVBdHRyaWJ1dGUocmVjb3JkOiBSZWNvcmQsIGF0dHI6IHN0cmluZywgdmFsdWU6IGFueSk6IHZvaWQge1xyXG4gICAgcmVjb3JkLmF0dHJpYnV0ZXMgPSByZWNvcmQuYXR0cmlidXRlcyB8fCB7fTtcclxuICAgIHJlY29yZC5hdHRyaWJ1dGVzW2F0dHJdID0gdmFsdWU7XHJcbiAgfVxyXG5cclxuICBkZXNlcmlhbGl6ZVJlbGF0aW9uc2hpcHMocmVjb3JkOiBSZWNvcmQsIHJlc291cmNlOiBSZXNvdXJjZSk6IHZvaWQge1xyXG4gICAgaWYgKHJlc291cmNlLnJlbGF0aW9uc2hpcHMpIHtcclxuICAgICAgT2JqZWN0LmtleXMocmVzb3VyY2UucmVsYXRpb25zaGlwcykuZm9yRWFjaChyZXNvdXJjZVJlbCA9PiB7XHJcbiAgICAgICAgbGV0IHJlbGF0aW9uc2hpcCA9IHRoaXMucmVjb3JkUmVsYXRpb25zaGlwKHJlY29yZC50eXBlLCByZXNvdXJjZVJlbCk7XHJcbiAgICAgICAgaWYgKHRoaXMuc2NoZW1hLmhhc1JlbGF0aW9uc2hpcChyZWNvcmQudHlwZSwgcmVsYXRpb25zaGlwKSkge1xyXG4gICAgICAgICAgbGV0IHZhbHVlID0gcmVzb3VyY2UucmVsYXRpb25zaGlwc1tyZXNvdXJjZVJlbF07XHJcbiAgICAgICAgICB0aGlzLmRlc2VyaWFsaXplUmVsYXRpb25zaGlwKHJlY29yZCwgcmVsYXRpb25zaGlwLCB2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGRlc2VyaWFsaXplUmVsYXRpb25zaGlwKHJlY29yZDogUmVjb3JkLCByZWxhdGlvbnNoaXA6IHN0cmluZywgdmFsdWU6IFJlc291cmNlUmVsYXRpb25zaGlwKSB7XHJcbiAgICBsZXQgcmVzb3VyY2VEYXRhID0gdmFsdWUuZGF0YTtcclxuXHJcbiAgICBpZiAocmVzb3VyY2VEYXRhICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgbGV0IGRhdGE7XHJcblxyXG4gICAgICBpZiAocmVzb3VyY2VEYXRhID09PSBudWxsKSB7XHJcbiAgICAgICAgZGF0YSA9IG51bGw7XHJcbiAgICAgIH0gZWxzZSBpZiAoaXNBcnJheShyZXNvdXJjZURhdGEpKSB7XHJcbiAgICAgICAgZGF0YSA9IChyZXNvdXJjZURhdGEgYXMgUmVzb3VyY2VJZGVudGl0eVtdKS5tYXAocmVzb3VyY2VJZGVudGl0eSA9PiB0aGlzLnJlY29yZElkZW50aXR5KHJlc291cmNlSWRlbnRpdHkpKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBkYXRhID0gdGhpcy5yZWNvcmRJZGVudGl0eShyZXNvdXJjZURhdGEgYXMgUmVzb3VyY2VJZGVudGl0eSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJlY29yZC5yZWxhdGlvbnNoaXBzID0gcmVjb3JkLnJlbGF0aW9uc2hpcHMgfHwge307XHJcbiAgICAgIHJlY29yZC5yZWxhdGlvbnNoaXBzW3JlbGF0aW9uc2hpcF0gPSB7IGRhdGEgfTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByb3RlY3RlZCBfZ2VuZXJhdGVOZXdJZCh0eXBlOiBzdHJpbmcsIGtleU5hbWU6IHN0cmluZywga2V5VmFsdWU6IHN0cmluZykge1xyXG4gICAgbGV0IGlkID0gdGhpcy5zY2hlbWEuZ2VuZXJhdGVJZCh0eXBlKTtcclxuXHJcbiAgICB0aGlzLmtleU1hcC5wdXNoUmVjb3JkKHtcclxuICAgICAgdHlwZSxcclxuICAgICAgaWQsXHJcbiAgICAgIGtleXM6IHtcclxuICAgICAgICBba2V5TmFtZV06IGtleVZhbHVlXHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBpZDtcclxuICB9XHJcbn1cclxuIl19