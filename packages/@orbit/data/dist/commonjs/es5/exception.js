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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhjZXB0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3JjL2V4Y2VwdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEscUJBQXdDO0FBRXhDLEFBTUc7Ozs7Ozs7QUFDSCxvQ0FBaUM7MkJBQVMsQUFHeEM7eUJBQVksQUFBbUIsYUFBL0I7b0JBQ0Usa0JBQU0sbUJBQWlCLEFBQWEsQUFBQyxnQkFFdEMsQUFEQyxBQUFJO2NBQUMsQUFBVyxjQUFHLEFBQVcsQUFBQztlQUNqQyxBQUFDO0FBQ0g7V0FBQSxBQUFDLEFBUEQsQUFPQztFQVBnQyxPQUFTLEFBT3pDO0FBUFksc0JBQVc7QUFTeEIsQUFNRzs7Ozs7OztBQUNILG9DQUFpQzsyQkFBUyxBQUd4Qzt5QkFBWSxBQUFtQixhQUEvQjtvQkFDRSxrQkFBTSxtQkFBaUIsQUFBYSxBQUFDLGdCQUV0QyxBQURDLEFBQUk7Y0FBQyxBQUFXLGNBQUcsQUFBVyxBQUFDO2VBQ2pDLEFBQUM7QUFDSDtXQUFBLEFBQUMsQUFQRCxBQU9DO0VBUGdDLE9BQVMsQUFPekM7QUFQWSxzQkFBVztBQVN4QixBQU9HOzs7Ozs7OztBQUNILHFDQUFrQzs0QkFBUyxBQUd6QzswQkFBWSxBQUFtQixhQUEvQjtvQkFDRSxrQkFBTSxvQkFBa0IsQUFBYSxBQUFDLGdCQUV2QyxBQURDLEFBQUk7Y0FBQyxBQUFXLGNBQUcsQUFBVyxBQUFDO2VBQ2pDLEFBQUM7QUFDSDtXQUFBLEFBQUMsQUFQRCxBQU9DO0VBUGlDLE9BQVMsQUFPMUM7QUFQWSx1QkFBWTtBQVN6QixBQU1HOzs7Ozs7O0FBQ0gsa0RBQStDO3lDQUFTLEFBSXREO3VDQUFZLEFBQW1CLGFBQUUsQUFBZSxZQUFoRDtvQkFDRSxrQkFBTSxtQ0FBaUMsQUFBYSxBQUFDLGdCQUd0RCxBQUZDLEFBQUk7Y0FBQyxBQUFXLGNBQUcsQUFBVyxBQUFDLEFBQy9CLEFBQUk7Y0FBQyxBQUFVLGFB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TUFBRSxBQUFVO2VBQ2xDLGtCQUFNLEFBQXVCLHlCQUFFLEFBQUksTUFBRSxBQUFFLEFBQUMsT0FDMUMsQUFBQztBQUNIO1dBQUEsQUFBQyxBQUpELEFBSUM7RUFKaUQsQUFBZSxBQUloRTtBQUpZLHVDQUE0QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEV4Y2VwdGlvbiB9IGZyb20gJ0BvcmJpdC9jb3JlJztcclxuXHJcbi8qKlxyXG4gKiBBbiBjbGllbnQtc2lkZSBlcnJvciBvY2N1cnJlZCB3aGlsZSBjb21tdW5pY2F0aW5nIHdpdGggYSByZW1vdGUgc2VydmVyLlxyXG4gKiBcclxuICogQGV4cG9ydFxyXG4gKiBAY2xhc3MgQ2xpZW50RXJyb3JcclxuICogQGV4dGVuZHMge0V4Y2VwdGlvbn1cclxuICovXHJcbmV4cG9ydCBjbGFzcyBDbGllbnRFcnJvciBleHRlbmRzIEV4Y2VwdGlvbiB7XHJcbiAgcHVibGljIGRlc2NyaXB0aW9uOiBzdHJpbmc7XHJcblxyXG4gIGNvbnN0cnVjdG9yKGRlc2NyaXB0aW9uOiBzdHJpbmcpIHtcclxuICAgIHN1cGVyKGBDbGllbnQgZXJyb3I6ICR7ZGVzY3JpcHRpb259YCk7XHJcbiAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogQSBzZXJ2ZXItc2lkZSBlcnJvciBvY2N1cnJlZCB3aGlsZSBjb21tdW5pY2F0aW5nIHdpdGggYSByZW1vdGUgc2VydmVyLlxyXG4gKiBcclxuICogQGV4cG9ydFxyXG4gKiBAY2xhc3MgU2VydmVyRXJyb3JcclxuICogQGV4dGVuZHMge0V4Y2VwdGlvbn1cclxuICovXHJcbmV4cG9ydCBjbGFzcyBTZXJ2ZXJFcnJvciBleHRlbmRzIEV4Y2VwdGlvbiB7XHJcbiAgcHVibGljIGRlc2NyaXB0aW9uOiBzdHJpbmc7XHJcblxyXG4gIGNvbnN0cnVjdG9yKGRlc2NyaXB0aW9uOiBzdHJpbmcpIHtcclxuICAgIHN1cGVyKGBTZXJ2ZXIgZXJyb3I6ICR7ZGVzY3JpcHRpb259YCk7XHJcbiAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogQSBuZXR3b3JraW5nIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gY29tbXVuaWNhdGUgd2l0aCBhIHJlbW90ZVxyXG4gKiBzZXJ2ZXIuXHJcbiAqXHJcbiAqIEBleHBvcnRcclxuICogQGNsYXNzIE5ldHdvcmtFcnJvclxyXG4gKiBAZXh0ZW5kcyB7RXhjZXB0aW9ufVxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIE5ldHdvcmtFcnJvciBleHRlbmRzIEV4Y2VwdGlvbiB7XHJcbiAgcHVibGljIGRlc2NyaXB0aW9uOiBzdHJpbmc7XHJcblxyXG4gIGNvbnN0cnVjdG9yKGRlc2NyaXB0aW9uOiBzdHJpbmcpIHtcclxuICAgIHN1cGVyKGBOZXR3b3JrIGVycm9yOiAke2Rlc2NyaXB0aW9ufWApO1xyXG4gICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEEgcXVlcnkgZXhwcmVzc2lvbiBjb3VsZCBub3QgYmUgcGFyc2VkLlxyXG4gKiBcclxuICogQGV4cG9ydFxyXG4gKiBAY2xhc3MgUXVlcnlFeHByZXNzaW9uUGFyc2VFcnJvclxyXG4gKiBAZXh0ZW5kcyB7RXhjZXB0aW9ufVxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFF1ZXJ5RXhwcmVzc2lvblBhcnNlRXJyb3IgZXh0ZW5kcyBFeGNlcHRpb24ge1xyXG4gIHB1YmxpYyBkZXNjcmlwdGlvbjogc3RyaW5nO1xyXG4gIHB1YmxpYyBleHByZXNzaW9uOiBhbnk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKGRlc2NyaXB0aW9uOiBzdHJpbmcsIGV4cHJlc3Npb246IGFueSkge1xyXG4gICAgc3VwZXIoYFF1ZXJ5IGV4cHJlc3Npb24gcGFyc2UgZXJyb3I6ICR7ZGVzY3JpcHRpb259YCk7XHJcbiAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XHJcbiAgICB0aGlzLmV4cHJlc3Npb24gPSBleHByZXNzaW9uO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEEgcXVlcnkgaXMgaW52YWxpZCBmb3IgYSBwYXJ0aWN1bGFyIHNvdXJjZS5cclxuICogXHJcbiAqIEBleHBvcnRcclxuICogQGNsYXNzIFF1ZXJ5Tm90QWxsb3dlZFxyXG4gKiBAZXh0ZW5kcyB7RXhjZXB0aW9ufVxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFF1ZXJ5Tm90QWxsb3dlZCBleHRlbmRzIEV4Y2VwdGlvbiB7XHJcbiAgcHVibGljIGRlc2NyaXB0aW9uOiBzdHJpbmc7XHJcbiAgcHVibGljIHF1ZXJ5OiBhbnk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKGRlc2NyaXB0aW9uOiBzdHJpbmcsIHF1ZXJ5OiBhbnkpIHtcclxuICAgIHN1cGVyKGBRdWVyeSBub3QgYWxsb3dlZDogJHtkZXNjcmlwdGlvbn1gKTtcclxuICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcclxuICAgIHRoaXMucXVlcnkgPSBxdWVyeTtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBIHRyYW5zZm9ybSBpcyBpbnZhbGlkIGZvciBhIHBhcnRpY3VsYXIgc291cmNlLlxyXG4gKiBcclxuICogQGV4cG9ydFxyXG4gKiBAY2xhc3MgVHJhbnNmb3JtTm90QWxsb3dlZFxyXG4gKiBAZXh0ZW5kcyB7RXhjZXB0aW9ufVxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFRyYW5zZm9ybU5vdEFsbG93ZWQgZXh0ZW5kcyBFeGNlcHRpb24ge1xyXG4gIHB1YmxpYyBkZXNjcmlwdGlvbjogc3RyaW5nO1xyXG4gIHB1YmxpYyB0cmFuc2Zvcm06IGFueTtcclxuXHJcbiAgY29uc3RydWN0b3IoZGVzY3JpcHRpb246IHN0cmluZywgdHJhbnNmb3JtOiBhbnkpIHtcclxuICAgIHN1cGVyKGBUcmFuc2Zvcm0gbm90IGFsbG93ZWQ6ICR7ZGVzY3JpcHRpb259YCk7XHJcbiAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XHJcbiAgICB0aGlzLnRyYW5zZm9ybSA9IHRyYW5zZm9ybTtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBbiBlcnJvciBvY2N1cmVkIHJlbGF0ZWQgdG8gdGhlIHNjaGVtYS5cclxuICogXHJcbiAqIEBleHBvcnRcclxuICogQGNsYXNzIFNjaGVtYUVycm9yXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgU2NoZW1hRXJyb3IgZXh0ZW5kcyBFeGNlcHRpb24ge1xyXG4gIHB1YmxpYyBkZXNjcmlwdGlvbjogc3RyaW5nO1xyXG5cclxuICBjb25zdHJ1Y3RvcihkZXNjcmlwdGlvbjogc3RyaW5nKSB7XHJcbiAgICBzdXBlcihgU2NoZW1hIGVycm9yOiAke2Rlc2NyaXB0aW9ufWApO1xyXG4gICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbi8qKlxyXG4gKiBBIG1vZGVsIGNvdWxkIG5vdCBiZSBmb3VuZCBpbiB0aGUgc2NoZW1hLlxyXG4gKiBcclxuICogQGV4cG9ydFxyXG4gKiBAY2xhc3MgTW9kZWxOb3RGb3VuZFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIE1vZGVsTm90Rm91bmQgZXh0ZW5kcyBTY2hlbWFFcnJvciB7XHJcbiAgY29uc3RydWN0b3IodHlwZTogc3RyaW5nKSB7XHJcbiAgICBzdXBlcihgTW9kZWwgZGVmaW5pdGlvbiBmb3IgJHt0eXBlfSBub3QgZm91bmRgKTtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBbiBlcnJvciBvY2N1cnJlZCByZWxhdGVkIHRvIGEgcGFydGljdWxhciByZWNvcmQuXHJcbiAqIFxyXG4gKiBAZXhwb3J0XHJcbiAqIEBhYnN0cmFjdFxyXG4gKiBAY2xhc3MgUmVjb3JkRXhjZXB0aW9uXHJcbiAqIEBleHRlbmRzIHtFeGNlcHRpb259XHJcbiAqL1xyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUmVjb3JkRXhjZXB0aW9uIGV4dGVuZHMgRXhjZXB0aW9uIHtcclxuICBwdWJsaWMgZGVzY3JpcHRpb246IHN0cmluZztcclxuICBwdWJsaWMgdHlwZTogc3RyaW5nO1xyXG4gIHB1YmxpYyBpZDogc3RyaW5nO1xyXG4gIHB1YmxpYyByZWxhdGlvbnNoaXA6IHN0cmluZztcclxuXHJcbiAgY29uc3RydWN0b3IoZGVzY3JpcHRpb246IHN0cmluZywgdHlwZTogc3RyaW5nLCBpZDogc3RyaW5nLCByZWxhdGlvbnNoaXA/OiBzdHJpbmcpIHtcclxuICAgIGxldCBtZXNzYWdlOiBzdHJpbmcgPSBgJHtkZXNjcmlwdGlvbn06ICR7dHlwZX06JHtpZH1gO1xyXG5cclxuICAgIGlmIChyZWxhdGlvbnNoaXApIHtcclxuICAgICAgbWVzc2FnZSArPSAnLycgKyByZWxhdGlvbnNoaXA7XHJcbiAgICB9XHJcblxyXG4gICAgc3VwZXIobWVzc2FnZSk7XHJcblxyXG4gICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xyXG4gICAgdGhpcy50eXBlID0gdHlwZTtcclxuICAgIHRoaXMuaWQgPSBpZDtcclxuICAgIHRoaXMucmVsYXRpb25zaGlwID0gcmVsYXRpb25zaGlwO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEEgcmVjb3JkIGNvdWxkIG5vdCBiZSBmb3VuZC5cclxuICogXHJcbiAqIEBleHBvcnRcclxuICogQGNsYXNzIFJlY29yZE5vdEZvdW5kRXhjZXB0aW9uXHJcbiAqIEBleHRlbmRzIHtSZWNvcmRFeGNlcHRpb259XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgUmVjb3JkTm90Rm91bmRFeGNlcHRpb24gZXh0ZW5kcyBSZWNvcmRFeGNlcHRpb24ge1xyXG4gIGNvbnN0cnVjdG9yKHR5cGU6IHN0cmluZywgaWQ6IHN0cmluZykge1xyXG4gICAgc3VwZXIoJ1JlY29yZCBub3QgZm91bmQnLCB0eXBlLCBpZCk7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogQSByZWxhdGlvbnNoaXAgY291bGQgbm90IGJlIGZvdW5kLlxyXG4gKiBcclxuICogQGV4cG9ydFxyXG4gKiBAY2xhc3MgUmVsYXRpb25zaGlwTm90Rm91bmRFeGNlcHRpb25cclxuICogQGV4dGVuZHMge1JlY29yZEV4Y2VwdGlvbn1cclxuICovXHJcbmV4cG9ydCBjbGFzcyBSZWxhdGlvbnNoaXBOb3RGb3VuZEV4Y2VwdGlvbiBleHRlbmRzIFJlY29yZEV4Y2VwdGlvbiB7XHJcbiAgY29uc3RydWN0b3IodHlwZTogc3RyaW5nLCBpZDogc3RyaW5nLCByZWxhdGlvbnNoaXA6IHN0cmluZykge1xyXG4gICAgc3VwZXIoJ1JlbGF0aW9uc2hpcCBub3QgZm91bmQnLCB0eXBlLCBpZCwgcmVsYXRpb25zaGlwKTtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBUaGUgcmVjb3JkIGFscmVhZHkgZXhpc3RzLlxyXG4gKiBcclxuICogQGV4cG9ydFxyXG4gKiBAY2xhc3MgUmVjb3JkQWxyZWFkeUV4aXN0c0V4Y2VwdGlvblxyXG4gKiBAZXh0ZW5kcyB7UmVjb3JkRXhjZXB0aW9ufVxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFJlY29yZEFscmVhZHlFeGlzdHNFeGNlcHRpb24gZXh0ZW5kcyBSZWNvcmRFeGNlcHRpb24ge1xyXG4gIGNvbnN0cnVjdG9yKHR5cGU6IHN0cmluZywgaWQ6IHN0cmluZykge1xyXG4gICAgc3VwZXIoJ1JlY29yZCBhbHJlYWR5IGV4aXN0cycsIHR5cGUsIGlkKTtcclxuICB9XHJcbn1cclxuIl19