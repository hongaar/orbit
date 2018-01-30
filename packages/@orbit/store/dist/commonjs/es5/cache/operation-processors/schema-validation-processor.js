"use strict";

var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
            }
        }
    }return target;
};

function _defaults(obj, defaults) {
    var keys = Object.getOwnPropertyNames(defaults);for (var i = 0; i < keys.length; i++) {
        var key = keys[i];var value = Object.getOwnPropertyDescriptor(defaults, key);if (value && value.configurable && obj[key] === undefined) {
            Object.defineProperty(obj, key, value);
        }
    }return obj;
}

var __extends = undefined && undefined.__extends || function () {
    var extendStatics = Object.setPrototypeOf || _extends({}, []) instanceof Array && function (d, b) {
        _defaults(d, b);
    } || function (d, b) {
        for (var p in b) {
            if (b.hasOwnProperty(p)) d[p] = b[p];
        }
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
Object.defineProperty(exports, "__esModule", { value: true });
var operation_processor_1 = require("./operation-processor");
/**
 * An operation processor that ensures that an operation is compatible with
 * its associated schema.
 *
 * @export
 * @class SchemaValidationProcessor
 * @extends {OperationProcessor}
 */
var SchemaValidationProcessor = function (_super) {
    __extends(SchemaValidationProcessor, _super);
    function SchemaValidationProcessor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SchemaValidationProcessor.prototype.validate = function (operation) {
        switch (operation.op) {
            case 'addRecord':
                return this._recordAdded(operation.record);
            case 'replaceRecord':
                return this._recordReplaced(operation.record);
            case 'removeRecord':
                return this._recordRemoved(operation.record);
            case 'replaceKey':
                return this._keyReplaced(operation.record);
            case 'replaceAttribute':
                return this._attributeReplaced(operation.record);
            case 'addToRelatedRecords':
                return this._relatedRecordAdded(operation.record, operation.relationship, operation.relatedRecord);
            case 'removeFromRelatedRecords':
                return this._relatedRecordRemoved(operation.record, operation.relationship, operation.relatedRecord);
            case 'replaceRelatedRecords':
                return this._relatedRecordsReplaced(operation.record, operation.relationship, operation.relatedRecords);
            case 'replaceRelatedRecord':
                return this._relatedRecordReplaced(operation.record, operation.relationship, operation.relatedRecord);
            default:
                return;
        }
    };
    SchemaValidationProcessor.prototype._recordAdded = function (record) {
        this._validateRecord(record);
    };
    SchemaValidationProcessor.prototype._recordReplaced = function (record) {
        this._validateRecord(record);
    };
    SchemaValidationProcessor.prototype._recordRemoved = function (record) {
        this._validateRecordIdentity(record);
    };
    SchemaValidationProcessor.prototype._keyReplaced = function (record) {
        this._validateRecordIdentity(record);
    };
    SchemaValidationProcessor.prototype._attributeReplaced = function (record) {
        this._validateRecordIdentity(record);
    };
    SchemaValidationProcessor.prototype._relatedRecordAdded = function (record, relationship, relatedRecord) {
        this._validateRecordIdentity(record);
        this._validateRecordIdentity(relatedRecord);
    };
    SchemaValidationProcessor.prototype._relatedRecordRemoved = function (record, relationship, relatedRecord) {
        this._validateRecordIdentity(record);
        this._validateRecordIdentity(relatedRecord);
    };
    SchemaValidationProcessor.prototype._relatedRecordsReplaced = function (record, relationship, relatedRecords) {
        var _this = this;
        this._validateRecordIdentity(record);
        relatedRecords.forEach(function (record) {
            _this._validateRecordIdentity(record);
        });
    };
    SchemaValidationProcessor.prototype._relatedRecordReplaced = function (record, relationship, relatedRecord) {
        this._validateRecordIdentity(record);
        if (relatedRecord) {
            this._validateRecordIdentity(relatedRecord);
        }
    };
    SchemaValidationProcessor.prototype._validateRecord = function (record) {
        this._validateRecordIdentity(record);
    };
    SchemaValidationProcessor.prototype._validateRecordIdentity = function (record) {
        this.cache.schema.getModel(record.type);
    };
    return SchemaValidationProcessor;
}(operation_processor_1.OperationProcessor);
exports.default = SchemaValidationProcessor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hLXZhbGlkYXRpb24tcHJvY2Vzc29yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NhY2hlL29wZXJhdGlvbi1wcm9jZXNzb3JzL3NjaGVtYS12YWxpZGF0aW9uLXByb2Nlc3Nvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBS0Esb0NBQTJEO0FBRTNELEFBT0c7Ozs7Ozs7O0FBQ0gsa0RBQXVEO3lDQUFrQixBQUF6RTs7bUVBd0ZBLEFBQUM7QUF2RkM7d0NBQVEsV0FBUixVQUFTLEFBQTBCLFdBQ2pDLEFBQU0sQUFBQztnQkFBQyxBQUFTLFVBQUMsQUFBRSxBQUFDLEFBQUMsQUFBQyxBQUNyQjtpQkFBSyxBQUFXLEFBQ2QsQUFBTTt1QkFBQyxBQUFJLEtBQUMsQUFBWSxhQUFDLEFBQVMsVUFBQyxBQUFNLEFBQUMsQUFBQyxBQUU3QztpQkFBSyxBQUFlLEFBQ2xCLEFBQU07dUJBQUMsQUFBSSxLQUFDLEFBQWUsZ0JBQUMsQUFBUyxVQUFDLEFBQU0sQUFBQyxBQUFDLEFBRWhEO2lCQUFLLEFBQWMsQUFDakIsQUFBTTt1QkFBQyxBQUFJLEtBQUMsQUFBYyxlQUFDLEFBQVMsVUFBQyxBQUFNLEFBQUMsQUFBQyxBQUUvQztpQkFBSyxBQUFZLEFBQ2YsQUFBTTt1QkFBQyxBQUFJLEtBQUMsQUFBWSxhQUFDLEFBQVMsVUFBQyxBQUFNLEFBQUMsQUFBQyxBQUU3QztpQkFBSyxBQUFrQixBQUNyQixBQUFNO3VCQUFDLEFBQUksS0FBQyxBQUFrQixtQkFBQyxBQUFTLFVBQUMsQUFBTSxBQUFDLEFBQUMsQUFFbkQ7aUJBQUssQUFBcUIsQUFDeEIsQUFBTTt1QkFBQyxBQUFJLEtBQUMsQUFBbUIsb0JBQUMsQUFBUyxVQUFDLEFBQU0sUUFBRSxBQUFTLFVBQUMsQUFBWSxjQUFFLEFBQVMsVUFBQyxBQUFhLEFBQUMsQUFBQyxBQUVyRztpQkFBSyxBQUEwQixBQUM3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XHJcbiAgUmVjb3JkSWRlbnRpdHksXHJcbiAgUmVjb3JkT3BlcmF0aW9uLFxyXG59IGZyb20gJ0BvcmJpdC9kYXRhJztcclxuaW1wb3J0IHsgT3BlcmF0aW9uUHJvY2Vzc29yIH0gZnJvbSAnLi9vcGVyYXRpb24tcHJvY2Vzc29yJztcclxuXHJcbi8qKlxyXG4gKiBBbiBvcGVyYXRpb24gcHJvY2Vzc29yIHRoYXQgZW5zdXJlcyB0aGF0IGFuIG9wZXJhdGlvbiBpcyBjb21wYXRpYmxlIHdpdGhcclxuICogaXRzIGFzc29jaWF0ZWQgc2NoZW1hLlxyXG4gKlxyXG4gKiBAZXhwb3J0XHJcbiAqIEBjbGFzcyBTY2hlbWFWYWxpZGF0aW9uUHJvY2Vzc29yXHJcbiAqIEBleHRlbmRzIHtPcGVyYXRpb25Qcm9jZXNzb3J9XHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY2hlbWFWYWxpZGF0aW9uUHJvY2Vzc29yIGV4dGVuZHMgT3BlcmF0aW9uUHJvY2Vzc29yIHtcclxuICB2YWxpZGF0ZShvcGVyYXRpb246IFJlY29yZE9wZXJhdGlvbikge1xyXG4gICAgc3dpdGNoIChvcGVyYXRpb24ub3ApIHtcclxuICAgICAgY2FzZSAnYWRkUmVjb3JkJzpcclxuICAgICAgICByZXR1cm4gdGhpcy5fcmVjb3JkQWRkZWQob3BlcmF0aW9uLnJlY29yZCk7XHJcblxyXG4gICAgICBjYXNlICdyZXBsYWNlUmVjb3JkJzpcclxuICAgICAgICByZXR1cm4gdGhpcy5fcmVjb3JkUmVwbGFjZWQob3BlcmF0aW9uLnJlY29yZCk7XHJcblxyXG4gICAgICBjYXNlICdyZW1vdmVSZWNvcmQnOlxyXG4gICAgICAgIHJldHVybiB0aGlzLl9yZWNvcmRSZW1vdmVkKG9wZXJhdGlvbi5yZWNvcmQpO1xyXG5cclxuICAgICAgY2FzZSAncmVwbGFjZUtleSc6XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2tleVJlcGxhY2VkKG9wZXJhdGlvbi5yZWNvcmQpO1xyXG5cclxuICAgICAgY2FzZSAncmVwbGFjZUF0dHJpYnV0ZSc6XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2F0dHJpYnV0ZVJlcGxhY2VkKG9wZXJhdGlvbi5yZWNvcmQpO1xyXG5cclxuICAgICAgY2FzZSAnYWRkVG9SZWxhdGVkUmVjb3Jkcyc6XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlbGF0ZWRSZWNvcmRBZGRlZChvcGVyYXRpb24ucmVjb3JkLCBvcGVyYXRpb24ucmVsYXRpb25zaGlwLCBvcGVyYXRpb24ucmVsYXRlZFJlY29yZCk7XHJcblxyXG4gICAgICBjYXNlICdyZW1vdmVGcm9tUmVsYXRlZFJlY29yZHMnOlxyXG4gICAgICAgIHJldHVybiB0aGlzLl9yZWxhdGVkUmVjb3JkUmVtb3ZlZChvcGVyYXRpb24ucmVjb3JkLCBvcGVyYXRpb24ucmVsYXRpb25zaGlwLCBvcGVyYXRpb24ucmVsYXRlZFJlY29yZCk7XHJcblxyXG4gICAgICBjYXNlICdyZXBsYWNlUmVsYXRlZFJlY29yZHMnOlxyXG4gICAgICAgIHJldHVybiB0aGlzLl9yZWxhdGVkUmVjb3Jkc1JlcGxhY2VkKG9wZXJhdGlvbi5yZWNvcmQsIG9wZXJhdGlvbi5yZWxhdGlvbnNoaXAsIG9wZXJhdGlvbi5yZWxhdGVkUmVjb3Jkcyk7XHJcblxyXG4gICAgICBjYXNlICdyZXBsYWNlUmVsYXRlZFJlY29yZCc6XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlbGF0ZWRSZWNvcmRSZXBsYWNlZChvcGVyYXRpb24ucmVjb3JkLCBvcGVyYXRpb24ucmVsYXRpb25zaGlwLCBvcGVyYXRpb24ucmVsYXRlZFJlY29yZCk7XHJcblxyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIF9yZWNvcmRBZGRlZChyZWNvcmQ6IFJlY29yZCkge1xyXG4gICAgdGhpcy5fdmFsaWRhdGVSZWNvcmQocmVjb3JkKTtcclxuICB9XHJcblxyXG4gIF9yZWNvcmRSZXBsYWNlZChyZWNvcmQ6IFJlY29yZCkge1xyXG4gICAgdGhpcy5fdmFsaWRhdGVSZWNvcmQocmVjb3JkKTtcclxuICB9XHJcblxyXG4gIF9yZWNvcmRSZW1vdmVkKHJlY29yZDogUmVjb3JkSWRlbnRpdHkpIHtcclxuICAgIHRoaXMuX3ZhbGlkYXRlUmVjb3JkSWRlbnRpdHkocmVjb3JkKTtcclxuICB9XHJcblxyXG4gIF9rZXlSZXBsYWNlZChyZWNvcmQ6IFJlY29yZElkZW50aXR5KSB7XHJcbiAgICB0aGlzLl92YWxpZGF0ZVJlY29yZElkZW50aXR5KHJlY29yZCk7XHJcbiAgfVxyXG5cclxuICBfYXR0cmlidXRlUmVwbGFjZWQocmVjb3JkOiBSZWNvcmRJZGVudGl0eSkge1xyXG4gICAgdGhpcy5fdmFsaWRhdGVSZWNvcmRJZGVudGl0eShyZWNvcmQpO1xyXG4gIH1cclxuXHJcbiAgX3JlbGF0ZWRSZWNvcmRBZGRlZChyZWNvcmQ6IFJlY29yZElkZW50aXR5LCByZWxhdGlvbnNoaXA6IHN0cmluZywgcmVsYXRlZFJlY29yZDogUmVjb3JkSWRlbnRpdHkpIHtcclxuICAgIHRoaXMuX3ZhbGlkYXRlUmVjb3JkSWRlbnRpdHkocmVjb3JkKTtcclxuICAgIHRoaXMuX3ZhbGlkYXRlUmVjb3JkSWRlbnRpdHkocmVsYXRlZFJlY29yZCk7XHJcbiAgfVxyXG5cclxuICBfcmVsYXRlZFJlY29yZFJlbW92ZWQocmVjb3JkOiBSZWNvcmRJZGVudGl0eSwgcmVsYXRpb25zaGlwOiBzdHJpbmcsIHJlbGF0ZWRSZWNvcmQ6IFJlY29yZElkZW50aXR5KSB7XHJcbiAgICB0aGlzLl92YWxpZGF0ZVJlY29yZElkZW50aXR5KHJlY29yZCk7XHJcbiAgICB0aGlzLl92YWxpZGF0ZVJlY29yZElkZW50aXR5KHJlbGF0ZWRSZWNvcmQpO1xyXG4gIH1cclxuXHJcbiAgX3JlbGF0ZWRSZWNvcmRzUmVwbGFjZWQocmVjb3JkOiBSZWNvcmRJZGVudGl0eSwgcmVsYXRpb25zaGlwOiBzdHJpbmcsIHJlbGF0ZWRSZWNvcmRzOiBSZWNvcmRJZGVudGl0eVtdKSB7XHJcbiAgICB0aGlzLl92YWxpZGF0ZVJlY29yZElkZW50aXR5KHJlY29yZCk7XHJcblxyXG4gICAgcmVsYXRlZFJlY29yZHMuZm9yRWFjaChyZWNvcmQgPT4ge1xyXG4gICAgICB0aGlzLl92YWxpZGF0ZVJlY29yZElkZW50aXR5KHJlY29yZCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIF9yZWxhdGVkUmVjb3JkUmVwbGFjZWQocmVjb3JkOiBSZWNvcmRJZGVudGl0eSwgcmVsYXRpb25zaGlwOiBzdHJpbmcsIHJlbGF0ZWRSZWNvcmQ6IFJlY29yZElkZW50aXR5IHwgbnVsbCkge1xyXG4gICAgdGhpcy5fdmFsaWRhdGVSZWNvcmRJZGVudGl0eShyZWNvcmQpO1xyXG5cclxuICAgIGlmIChyZWxhdGVkUmVjb3JkKSB7XHJcbiAgICAgIHRoaXMuX3ZhbGlkYXRlUmVjb3JkSWRlbnRpdHkocmVsYXRlZFJlY29yZCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBfdmFsaWRhdGVSZWNvcmQocmVjb3JkOiBSZWNvcmQpIHtcclxuICAgIHRoaXMuX3ZhbGlkYXRlUmVjb3JkSWRlbnRpdHkocmVjb3JkKTtcclxuICB9XHJcblxyXG4gIF92YWxpZGF0ZVJlY29yZElkZW50aXR5KHJlY29yZDogUmVjb3JkSWRlbnRpdHkpIHtcclxuICAgIHRoaXMuY2FjaGUuc2NoZW1hLmdldE1vZGVsKHJlY29yZC50eXBlKTtcclxuICB9XHJcbn1cclxuIl19