"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

var __extends = this && this.__extends || function () {
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
var core_1 = require("@orbit/core");
/**
 * An client-side error occurred while communicating with a remote server.
 *
 * @export
 * @class ClientError
 * @extends {Exception}
 */
var ClientError = function (_super) {
    __extends(ClientError, _super);
    function ClientError(description) {
        var _this = _super.call(this, "Client error: " + description) || this;
        _this.description = description;
        return _this;
    }
    return ClientError;
}(core_1.Exception);
exports.ClientError = ClientError;
/**
 * A server-side error occurred while communicating with a remote server.
 *
 * @export
 * @class ServerError
 * @extends {Exception}
 */
var ServerError = function (_super) {
    __extends(ServerError, _super);
    function ServerError(description) {
        var _this = _super.call(this, "Server error: " + description) || this;
        _this.description = description;
        return _this;
    }
    return ServerError;
}(core_1.Exception);
exports.ServerError = ServerError;
/**
 * A networking error occurred while attempting to communicate with a remote
 * server.
 *
 * @export
 * @class NetworkError
 * @extends {Exception}
 */
var NetworkError = function (_super) {
    __extends(NetworkError, _super);
    function NetworkError(description) {
        var _this = _super.call(this, "Network error: " + description) || this;
        _this.description = description;
        return _this;
    }
    return NetworkError;
}(core_1.Exception);
exports.NetworkError = NetworkError;
/**
 * A query expression could not be parsed.
 *
 * @export
 * @class QueryExpressionParseError
 * @extends {Exception}
 */
var QueryExpressionParseError = function (_super) {
    __extends(QueryExpressionParseError, _super);
    function QueryExpressionParseError(description, expression) {
        var _this = _super.call(this, "Query expression parse error: " + description) || this;
        _this.description = description;
        _this.expression = expression;
        return _this;
    }
    return QueryExpressionParseError;
}(core_1.Exception);
exports.QueryExpressionParseError = QueryExpressionParseError;
/**
 * A query is invalid for a particular source.
 *
 * @export
 * @class QueryNotAllowed
 * @extends {Exception}
 */
var QueryNotAllowed = function (_super) {
    __extends(QueryNotAllowed, _super);
    function QueryNotAllowed(description, query) {
        var _this = _super.call(this, "Query not allowed: " + description) || this;
        _this.description = description;
        _this.query = query;
        return _this;
    }
    return QueryNotAllowed;
}(core_1.Exception);
exports.QueryNotAllowed = QueryNotAllowed;
/**
 * A transform is invalid for a particular source.
 *
 * @export
 * @class TransformNotAllowed
 * @extends {Exception}
 */
var TransformNotAllowed = function (_super) {
    __extends(TransformNotAllowed, _super);
    function TransformNotAllowed(description, transform) {
        var _this = _super.call(this, "Transform not allowed: " + description) || this;
        _this.description = description;
        _this.transform = transform;
        return _this;
    }
    return TransformNotAllowed;
}(core_1.Exception);
exports.TransformNotAllowed = TransformNotAllowed;
/**
 * An error occured related to the schema.
 *
 * @export
 * @class SchemaError
 */
var SchemaError = function (_super) {
    __extends(SchemaError, _super);
    function SchemaError(description) {
        var _this = _super.call(this, "Schema error: " + description) || this;
        _this.description = description;
        return _this;
    }
    return SchemaError;
}(core_1.Exception);
exports.SchemaError = SchemaError;
/**
 * A model could not be found in the schema.
 *
 * @export
 * @class ModelNotFound
 */
var ModelNotFound = function (_super) {
    __extends(ModelNotFound, _super);
    function ModelNotFound(type) {
        return _super.call(this, "Model definition for " + type + " not found") || this;
    }
    return ModelNotFound;
}(SchemaError);
exports.ModelNotFound = ModelNotFound;
/**
 * An error occurred related to a particular record.
 *
 * @export
 * @abstract
 * @class RecordException
 * @extends {Exception}
 */
var RecordException = function (_super) {
    __extends(RecordException, _super);
    function RecordException(description, type, id, relationship) {
        var _this = this;
        var message = description + ": " + type + ":" + id;
        if (relationship) {
            message += '/' + relationship;
        }
        _this = _super.call(this, message) || this;
        _this.description = description;
        _this.type = type;
        _this.id = id;
        _this.relationship = relationship;
        return _this;
    }
    return RecordException;
}(core_1.Exception);
exports.RecordException = RecordException;
/**
 * A record could not be found.
 *
 * @export
 * @class RecordNotFoundException
 * @extends {RecordException}
 */
var RecordNotFoundException = function (_super) {
    __extends(RecordNotFoundException, _super);
    function RecordNotFoundException(type, id) {
        return _super.call(this, 'Record not found', type, id) || this;
    }
    return RecordNotFoundException;
}(RecordException);
exports.RecordNotFoundException = RecordNotFoundException;
/**
 * A relationship could not be found.
 *
 * @export
 * @class RelationshipNotFoundException
 * @extends {RecordException}
 */
var RelationshipNotFoundException = function (_super) {
    __extends(RelationshipNotFoundException, _super);
    function RelationshipNotFoundException(type, id, relationship) {
        return _super.call(this, 'Relationship not found', type, id, relationship) || this;
    }
    return RelationshipNotFoundException;
}(RecordException);
exports.RelationshipNotFoundException = RelationshipNotFoundException;
/**
 * The record already exists.
 *
 * @export
 * @class RecordAlreadyExistsException
 * @extends {RecordException}
 */
var RecordAlreadyExistsException = function (_super) {
    __extends(RecordAlreadyExistsException, _super);
    function RecordAlreadyExistsException(type, id) {
        return _super.call(this, 'Record already exists', type, id) || this;
    }
    return RecordAlreadyExistsException;
}(RecordException);
exports.RecordAlreadyExistsException = RecordAlreadyExistsException;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhjZXB0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3JjL2V4Y2VwdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHFCQUF3QztBQUV4QyxBQU1HOzs7Ozs7O0FBQ0g7QUFBaUMsMkJBQVM7QUFHeEMseUJBQVksQUFBbUI7QUFBL0Isb0JBQ0Usa0JBQU0sbUJBQWlCLEFBQWEsQUFBQyxnQkFFdEM7QUFEQyxBQUFJLGNBQUMsQUFBVyxjQUFHLEFBQVcsQUFBQztlQUNqQztBQUFDO0FBQ0gsV0FBQyxBQUFEO0FBUEEsQUFPQyxFQVBnQyxPQUFTLEFBT3pDO0FBUFksc0JBQVc7QUFTeEIsQUFNRzs7Ozs7OztBQUNIO0FBQWlDLDJCQUFTO0FBR3hDLHlCQUFZLEFBQW1CO0FBQS9CLG9CQUNFLGtCQUFNLG1CQUFpQixBQUFhLEFBQUMsZ0JBRXRDO0FBREMsQUFBSSxjQUFDLEFBQVcsY0FBRyxBQUFXLEFBQUM7ZUFDakM7QUFBQztBQUNILFdBQUMsQUFBRDtBQVBBLEFBT0MsRUFQZ0MsT0FBUyxBQU96QztBQVBZLHNCQUFXO0FBU3hCLEFBT0c7Ozs7Ozs7O0FBQ0g7QUFBa0MsNEJBQVM7QUFHekMsMEJBQVksQUFBbUI7QUFBL0Isb0JBQ0Usa0JBQU0sb0JBQWtCLEFBQWEsQUFBQyxnQkFFdkM7QUFEQyxBQUFJLGNBQUMsQUFBVyxjQUFHLEFBQVcsQUFBQztlQUNqQztBQUFDO0FBQ0gsV0FBQyxBQUFEO0FBUEEsQUFPQyxFQVBpQyxPQUFTLEFBTzFDO0FBUFksdUJBQVk7QUFTekIsQUFNRzs7Ozs7OztBQUNIO0FBQStDLHlDQUFTO0FBSXRELHVDQUFZLEFBQW1CLGFBQUUsQUFBZTtBQUFoRCxvQkFDRSxrQkFBTSxtQ0FBaUMsQUFBYSxBQUFDLGdCQUd0RDtBQUZDLEFBQUksY0FBQyxBQUFXLGNBQUcsQUFBVyxBQUFDO0FBQy9CLEFBQUksY0FBQyxBQUFVLGFBQUcsQUFBVSxBQUFDO2VBQy9C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Qix5QkFBRSxBQUFJLE1BQUUsQUFBRSxBQUFDLE9BQzFDO0FBQUM7QUFDSCxXQUFDLEFBQUQ7QUFKQSxBQUlDLEVBSmlELEFBQWUsQUFJaEU7QUFKWSx1Q0FBNEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFeGNlcHRpb24gfSBmcm9tICdAb3JiaXQvY29yZSc7XHJcblxyXG4vKipcclxuICogQW4gY2xpZW50LXNpZGUgZXJyb3Igb2NjdXJyZWQgd2hpbGUgY29tbXVuaWNhdGluZyB3aXRoIGEgcmVtb3RlIHNlcnZlci5cclxuICogXHJcbiAqIEBleHBvcnRcclxuICogQGNsYXNzIENsaWVudEVycm9yXHJcbiAqIEBleHRlbmRzIHtFeGNlcHRpb259XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQ2xpZW50RXJyb3IgZXh0ZW5kcyBFeGNlcHRpb24ge1xyXG4gIHB1YmxpYyBkZXNjcmlwdGlvbjogc3RyaW5nO1xyXG5cclxuICBjb25zdHJ1Y3RvcihkZXNjcmlwdGlvbjogc3RyaW5nKSB7XHJcbiAgICBzdXBlcihgQ2xpZW50IGVycm9yOiAke2Rlc2NyaXB0aW9ufWApO1xyXG4gICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEEgc2VydmVyLXNpZGUgZXJyb3Igb2NjdXJyZWQgd2hpbGUgY29tbXVuaWNhdGluZyB3aXRoIGEgcmVtb3RlIHNlcnZlci5cclxuICogXHJcbiAqIEBleHBvcnRcclxuICogQGNsYXNzIFNlcnZlckVycm9yXHJcbiAqIEBleHRlbmRzIHtFeGNlcHRpb259XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgU2VydmVyRXJyb3IgZXh0ZW5kcyBFeGNlcHRpb24ge1xyXG4gIHB1YmxpYyBkZXNjcmlwdGlvbjogc3RyaW5nO1xyXG5cclxuICBjb25zdHJ1Y3RvcihkZXNjcmlwdGlvbjogc3RyaW5nKSB7XHJcbiAgICBzdXBlcihgU2VydmVyIGVycm9yOiAke2Rlc2NyaXB0aW9ufWApO1xyXG4gICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEEgbmV0d29ya2luZyBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIGNvbW11bmljYXRlIHdpdGggYSByZW1vdGVcclxuICogc2VydmVyLlxyXG4gKlxyXG4gKiBAZXhwb3J0XHJcbiAqIEBjbGFzcyBOZXR3b3JrRXJyb3JcclxuICogQGV4dGVuZHMge0V4Y2VwdGlvbn1cclxuICovXHJcbmV4cG9ydCBjbGFzcyBOZXR3b3JrRXJyb3IgZXh0ZW5kcyBFeGNlcHRpb24ge1xyXG4gIHB1YmxpYyBkZXNjcmlwdGlvbjogc3RyaW5nO1xyXG5cclxuICBjb25zdHJ1Y3RvcihkZXNjcmlwdGlvbjogc3RyaW5nKSB7XHJcbiAgICBzdXBlcihgTmV0d29yayBlcnJvcjogJHtkZXNjcmlwdGlvbn1gKTtcclxuICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBIHF1ZXJ5IGV4cHJlc3Npb24gY291bGQgbm90IGJlIHBhcnNlZC5cclxuICogXHJcbiAqIEBleHBvcnRcclxuICogQGNsYXNzIFF1ZXJ5RXhwcmVzc2lvblBhcnNlRXJyb3JcclxuICogQGV4dGVuZHMge0V4Y2VwdGlvbn1cclxuICovXHJcbmV4cG9ydCBjbGFzcyBRdWVyeUV4cHJlc3Npb25QYXJzZUVycm9yIGV4dGVuZHMgRXhjZXB0aW9uIHtcclxuICBwdWJsaWMgZGVzY3JpcHRpb246IHN0cmluZztcclxuICBwdWJsaWMgZXhwcmVzc2lvbjogYW55O1xyXG5cclxuICBjb25zdHJ1Y3RvcihkZXNjcmlwdGlvbjogc3RyaW5nLCBleHByZXNzaW9uOiBhbnkpIHtcclxuICAgIHN1cGVyKGBRdWVyeSBleHByZXNzaW9uIHBhcnNlIGVycm9yOiAke2Rlc2NyaXB0aW9ufWApO1xyXG4gICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xyXG4gICAgdGhpcy5leHByZXNzaW9uID0gZXhwcmVzc2lvbjtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBIHF1ZXJ5IGlzIGludmFsaWQgZm9yIGEgcGFydGljdWxhciBzb3VyY2UuXHJcbiAqIFxyXG4gKiBAZXhwb3J0XHJcbiAqIEBjbGFzcyBRdWVyeU5vdEFsbG93ZWRcclxuICogQGV4dGVuZHMge0V4Y2VwdGlvbn1cclxuICovXHJcbmV4cG9ydCBjbGFzcyBRdWVyeU5vdEFsbG93ZWQgZXh0ZW5kcyBFeGNlcHRpb24ge1xyXG4gIHB1YmxpYyBkZXNjcmlwdGlvbjogc3RyaW5nO1xyXG4gIHB1YmxpYyBxdWVyeTogYW55O1xyXG5cclxuICBjb25zdHJ1Y3RvcihkZXNjcmlwdGlvbjogc3RyaW5nLCBxdWVyeTogYW55KSB7XHJcbiAgICBzdXBlcihgUXVlcnkgbm90IGFsbG93ZWQ6ICR7ZGVzY3JpcHRpb259YCk7XHJcbiAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XHJcbiAgICB0aGlzLnF1ZXJ5ID0gcXVlcnk7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogQSB0cmFuc2Zvcm0gaXMgaW52YWxpZCBmb3IgYSBwYXJ0aWN1bGFyIHNvdXJjZS5cclxuICogXHJcbiAqIEBleHBvcnRcclxuICogQGNsYXNzIFRyYW5zZm9ybU5vdEFsbG93ZWRcclxuICogQGV4dGVuZHMge0V4Y2VwdGlvbn1cclxuICovXHJcbmV4cG9ydCBjbGFzcyBUcmFuc2Zvcm1Ob3RBbGxvd2VkIGV4dGVuZHMgRXhjZXB0aW9uIHtcclxuICBwdWJsaWMgZGVzY3JpcHRpb246IHN0cmluZztcclxuICBwdWJsaWMgdHJhbnNmb3JtOiBhbnk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKGRlc2NyaXB0aW9uOiBzdHJpbmcsIHRyYW5zZm9ybTogYW55KSB7XHJcbiAgICBzdXBlcihgVHJhbnNmb3JtIG5vdCBhbGxvd2VkOiAke2Rlc2NyaXB0aW9ufWApO1xyXG4gICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xyXG4gICAgdGhpcy50cmFuc2Zvcm0gPSB0cmFuc2Zvcm07XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogQW4gZXJyb3Igb2NjdXJlZCByZWxhdGVkIHRvIHRoZSBzY2hlbWEuXHJcbiAqIFxyXG4gKiBAZXhwb3J0XHJcbiAqIEBjbGFzcyBTY2hlbWFFcnJvclxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFNjaGVtYUVycm9yIGV4dGVuZHMgRXhjZXB0aW9uIHtcclxuICBwdWJsaWMgZGVzY3JpcHRpb246IHN0cmluZztcclxuXHJcbiAgY29uc3RydWN0b3IoZGVzY3JpcHRpb246IHN0cmluZykge1xyXG4gICAgc3VwZXIoYFNjaGVtYSBlcnJvcjogJHtkZXNjcmlwdGlvbn1gKTtcclxuICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcclxuICB9XHJcbn1cclxuXHJcblxyXG4vKipcclxuICogQSBtb2RlbCBjb3VsZCBub3QgYmUgZm91bmQgaW4gdGhlIHNjaGVtYS5cclxuICogXHJcbiAqIEBleHBvcnRcclxuICogQGNsYXNzIE1vZGVsTm90Rm91bmRcclxuICovXHJcbmV4cG9ydCBjbGFzcyBNb2RlbE5vdEZvdW5kIGV4dGVuZHMgU2NoZW1hRXJyb3Ige1xyXG4gIGNvbnN0cnVjdG9yKHR5cGU6IHN0cmluZykge1xyXG4gICAgc3VwZXIoYE1vZGVsIGRlZmluaXRpb24gZm9yICR7dHlwZX0gbm90IGZvdW5kYCk7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogQW4gZXJyb3Igb2NjdXJyZWQgcmVsYXRlZCB0byBhIHBhcnRpY3VsYXIgcmVjb3JkLlxyXG4gKiBcclxuICogQGV4cG9ydFxyXG4gKiBAYWJzdHJhY3RcclxuICogQGNsYXNzIFJlY29yZEV4Y2VwdGlvblxyXG4gKiBAZXh0ZW5kcyB7RXhjZXB0aW9ufVxyXG4gKi9cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFJlY29yZEV4Y2VwdGlvbiBleHRlbmRzIEV4Y2VwdGlvbiB7XHJcbiAgcHVibGljIGRlc2NyaXB0aW9uOiBzdHJpbmc7XHJcbiAgcHVibGljIHR5cGU6IHN0cmluZztcclxuICBwdWJsaWMgaWQ6IHN0cmluZztcclxuICBwdWJsaWMgcmVsYXRpb25zaGlwOiBzdHJpbmc7XHJcblxyXG4gIGNvbnN0cnVjdG9yKGRlc2NyaXB0aW9uOiBzdHJpbmcsIHR5cGU6IHN0cmluZywgaWQ6IHN0cmluZywgcmVsYXRpb25zaGlwPzogc3RyaW5nKSB7XHJcbiAgICBsZXQgbWVzc2FnZTogc3RyaW5nID0gYCR7ZGVzY3JpcHRpb259OiAke3R5cGV9OiR7aWR9YDtcclxuXHJcbiAgICBpZiAocmVsYXRpb25zaGlwKSB7XHJcbiAgICAgIG1lc3NhZ2UgKz0gJy8nICsgcmVsYXRpb25zaGlwO1xyXG4gICAgfVxyXG5cclxuICAgIHN1cGVyKG1lc3NhZ2UpO1xyXG5cclxuICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcclxuICAgIHRoaXMudHlwZSA9IHR5cGU7XHJcbiAgICB0aGlzLmlkID0gaWQ7XHJcbiAgICB0aGlzLnJlbGF0aW9uc2hpcCA9IHJlbGF0aW9uc2hpcDtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBIHJlY29yZCBjb3VsZCBub3QgYmUgZm91bmQuXHJcbiAqIFxyXG4gKiBAZXhwb3J0XHJcbiAqIEBjbGFzcyBSZWNvcmROb3RGb3VuZEV4Y2VwdGlvblxyXG4gKiBAZXh0ZW5kcyB7UmVjb3JkRXhjZXB0aW9ufVxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFJlY29yZE5vdEZvdW5kRXhjZXB0aW9uIGV4dGVuZHMgUmVjb3JkRXhjZXB0aW9uIHtcclxuICBjb25zdHJ1Y3Rvcih0eXBlOiBzdHJpbmcsIGlkOiBzdHJpbmcpIHtcclxuICAgIHN1cGVyKCdSZWNvcmQgbm90IGZvdW5kJywgdHlwZSwgaWQpO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEEgcmVsYXRpb25zaGlwIGNvdWxkIG5vdCBiZSBmb3VuZC5cclxuICogXHJcbiAqIEBleHBvcnRcclxuICogQGNsYXNzIFJlbGF0aW9uc2hpcE5vdEZvdW5kRXhjZXB0aW9uXHJcbiAqIEBleHRlbmRzIHtSZWNvcmRFeGNlcHRpb259XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgUmVsYXRpb25zaGlwTm90Rm91bmRFeGNlcHRpb24gZXh0ZW5kcyBSZWNvcmRFeGNlcHRpb24ge1xyXG4gIGNvbnN0cnVjdG9yKHR5cGU6IHN0cmluZywgaWQ6IHN0cmluZywgcmVsYXRpb25zaGlwOiBzdHJpbmcpIHtcclxuICAgIHN1cGVyKCdSZWxhdGlvbnNoaXAgbm90IGZvdW5kJywgdHlwZSwgaWQsIHJlbGF0aW9uc2hpcCk7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogVGhlIHJlY29yZCBhbHJlYWR5IGV4aXN0cy5cclxuICogXHJcbiAqIEBleHBvcnRcclxuICogQGNsYXNzIFJlY29yZEFscmVhZHlFeGlzdHNFeGNlcHRpb25cclxuICogQGV4dGVuZHMge1JlY29yZEV4Y2VwdGlvbn1cclxuICovXHJcbmV4cG9ydCBjbGFzcyBSZWNvcmRBbHJlYWR5RXhpc3RzRXhjZXB0aW9uIGV4dGVuZHMgUmVjb3JkRXhjZXB0aW9uIHtcclxuICBjb25zdHJ1Y3Rvcih0eXBlOiBzdHJpbmcsIGlkOiBzdHJpbmcpIHtcclxuICAgIHN1cGVyKCdSZWNvcmQgYWxyZWFkeSBleGlzdHMnLCB0eXBlLCBpZCk7XHJcbiAgfVxyXG59XHJcbiJdfQ==