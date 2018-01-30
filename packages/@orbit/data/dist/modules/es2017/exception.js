"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@orbit/core");
/**
 * An client-side error occurred while communicating with a remote server.
 *
 * @export
 * @class ClientError
 * @extends {Exception}
 */
var ClientError = (function (_super) {
    __extends(ClientError, _super);
    function ClientError(description) {
        var _this = _super.call(this, "Client error: " + description) || this;
        _this.description = description;
        return _this;
    }
    return ClientError;
}(core_1.Exception));
exports.ClientError = ClientError;
/**
 * A server-side error occurred while communicating with a remote server.
 *
 * @export
 * @class ServerError
 * @extends {Exception}
 */
var ServerError = (function (_super) {
    __extends(ServerError, _super);
    function ServerError(description) {
        var _this = _super.call(this, "Server error: " + description) || this;
        _this.description = description;
        return _this;
    }
    return ServerError;
}(core_1.Exception));
exports.ServerError = ServerError;
/**
 * A networking error occurred while attempting to communicate with a remote
 * server.
 *
 * @export
 * @class NetworkError
 * @extends {Exception}
 */
var NetworkError = (function (_super) {
    __extends(NetworkError, _super);
    function NetworkError(description) {
        var _this = _super.call(this, "Network error: " + description) || this;
        _this.description = description;
        return _this;
    }
    return NetworkError;
}(core_1.Exception));
exports.NetworkError = NetworkError;
/**
 * A query expression could not be parsed.
 *
 * @export
 * @class QueryExpressionParseError
 * @extends {Exception}
 */
var QueryExpressionParseError = (function (_super) {
    __extends(QueryExpressionParseError, _super);
    function QueryExpressionParseError(description, expression) {
        var _this = _super.call(this, "Query expression parse error: " + description) || this;
        _this.description = description;
        _this.expression = expression;
        return _this;
    }
    return QueryExpressionParseError;
}(core_1.Exception));
exports.QueryExpressionParseError = QueryExpressionParseError;
/**
 * A query is invalid for a particular source.
 *
 * @export
 * @class QueryNotAllowed
 * @extends {Exception}
 */
var QueryNotAllowed = (function (_super) {
    __extends(QueryNotAllowed, _super);
    function QueryNotAllowed(description, query) {
        var _this = _super.call(this, "Query not allowed: " + description) || this;
        _this.description = description;
        _this.query = query;
        return _this;
    }
    return QueryNotAllowed;
}(core_1.Exception));
exports.QueryNotAllowed = QueryNotAllowed;
/**
 * A transform is invalid for a particular source.
 *
 * @export
 * @class TransformNotAllowed
 * @extends {Exception}
 */
var TransformNotAllowed = (function (_super) {
    __extends(TransformNotAllowed, _super);
    function TransformNotAllowed(description, transform) {
        var _this = _super.call(this, "Transform not allowed: " + description) || this;
        _this.description = description;
        _this.transform = transform;
        return _this;
    }
    return TransformNotAllowed;
}(core_1.Exception));
exports.TransformNotAllowed = TransformNotAllowed;
/**
 * An error occured related to the schema.
 *
 * @export
 * @class SchemaError
 */
var SchemaError = (function (_super) {
    __extends(SchemaError, _super);
    function SchemaError(description) {
        var _this = _super.call(this, "Schema error: " + description) || this;
        _this.description = description;
        return _this;
    }
    return SchemaError;
}(core_1.Exception));
exports.SchemaError = SchemaError;
/**
 * A model could not be found in the schema.
 *
 * @export
 * @class ModelNotFound
 */
var ModelNotFound = (function (_super) {
    __extends(ModelNotFound, _super);
    function ModelNotFound(type) {
        return _super.call(this, "Model definition for " + type + " not found") || this;
    }
    return ModelNotFound;
}(SchemaError));
exports.ModelNotFound = ModelNotFound;
/**
 * An error occurred related to a particular record.
 *
 * @export
 * @abstract
 * @class RecordException
 * @extends {Exception}
 */
var RecordException = (function (_super) {
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
}(core_1.Exception));
exports.RecordException = RecordException;
/**
 * A record could not be found.
 *
 * @export
 * @class RecordNotFoundException
 * @extends {RecordException}
 */
var RecordNotFoundException = (function (_super) {
    __extends(RecordNotFoundException, _super);
    function RecordNotFoundException(type, id) {
        return _super.call(this, 'Record not found', type, id) || this;
    }
    return RecordNotFoundException;
}(RecordException));
exports.RecordNotFoundException = RecordNotFoundException;
/**
 * A relationship could not be found.
 *
 * @export
 * @class RelationshipNotFoundException
 * @extends {RecordException}
 */
var RelationshipNotFoundException = (function (_super) {
    __extends(RelationshipNotFoundException, _super);
    function RelationshipNotFoundException(type, id, relationship) {
        return _super.call(this, 'Relationship not found', type, id, relationship) || this;
    }
    return RelationshipNotFoundException;
}(RecordException));
exports.RelationshipNotFoundException = RelationshipNotFoundException;
/**
 * The record already exists.
 *
 * @export
 * @class RecordAlreadyExistsException
 * @extends {RecordException}
 */
var RecordAlreadyExistsException = (function (_super) {
    __extends(RecordAlreadyExistsException, _super);
    function RecordAlreadyExistsException(type, id) {
        return _super.call(this, 'Record already exists', type, id) || this;
    }
    return RecordAlreadyExistsException;
}(RecordException));
exports.RecordAlreadyExistsException = RecordAlreadyExistsException;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhjZXB0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3JjL2V4Y2VwdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxvQ0FBd0M7QUFFeEM7Ozs7OztHQU1HO0FBQ0g7SUFBaUMsK0JBQVM7SUFHeEMscUJBQVksV0FBbUI7UUFBL0IsWUFDRSxrQkFBTSxtQkFBaUIsV0FBYSxDQUFDLFNBRXRDO1FBREMsS0FBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7O0lBQ2pDLENBQUM7SUFDSCxrQkFBQztBQUFELENBQUMsQUFQRCxDQUFpQyxnQkFBUyxHQU96QztBQVBZLGtDQUFXO0FBU3hCOzs7Ozs7R0FNRztBQUNIO0lBQWlDLCtCQUFTO0lBR3hDLHFCQUFZLFdBQW1CO1FBQS9CLFlBQ0Usa0JBQU0sbUJBQWlCLFdBQWEsQ0FBQyxTQUV0QztRQURDLEtBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDOztJQUNqQyxDQUFDO0lBQ0gsa0JBQUM7QUFBRCxDQUFDLEFBUEQsQ0FBaUMsZ0JBQVMsR0FPekM7QUFQWSxrQ0FBVztBQVN4Qjs7Ozs7OztHQU9HO0FBQ0g7SUFBa0MsZ0NBQVM7SUFHekMsc0JBQVksV0FBbUI7UUFBL0IsWUFDRSxrQkFBTSxvQkFBa0IsV0FBYSxDQUFDLFNBRXZDO1FBREMsS0FBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7O0lBQ2pDLENBQUM7SUFDSCxtQkFBQztBQUFELENBQUMsQUFQRCxDQUFrQyxnQkFBUyxHQU8xQztBQVBZLG9DQUFZO0FBU3pCOzs7Ozs7R0FNRztBQUNIO0lBQStDLDZDQUFTO0lBSXRELG1DQUFZLFdBQW1CLEVBQUUsVUFBZTtRQUFoRCxZQUNFLGtCQUFNLG1DQUFpQyxXQUFhLENBQUMsU0FHdEQ7UUFGQyxLQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztRQUMvQixLQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQzs7SUFDL0IsQ0FBQztJQUNILGdD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LEVBQUUsQ0FBQztJQUMxQyxDQUFDO0lBQ0gsbUNBQUM7QUFBRCxDQUFDLEFBSkQsQ0FBa0QsZUFBZSxHQUloRTtBQUpZLG9FQUE0QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEV4Y2VwdGlvbiB9IGZyb20gJ0BvcmJpdC9jb3JlJztcclxuXHJcbi8qKlxyXG4gKiBBbiBjbGllbnQtc2lkZSBlcnJvciBvY2N1cnJlZCB3aGlsZSBjb21tdW5pY2F0aW5nIHdpdGggYSByZW1vdGUgc2VydmVyLlxyXG4gKiBcclxuICogQGV4cG9ydFxyXG4gKiBAY2xhc3MgQ2xpZW50RXJyb3JcclxuICogQGV4dGVuZHMge0V4Y2VwdGlvbn1cclxuICovXHJcbmV4cG9ydCBjbGFzcyBDbGllbnRFcnJvciBleHRlbmRzIEV4Y2VwdGlvbiB7XHJcbiAgcHVibGljIGRlc2NyaXB0aW9uOiBzdHJpbmc7XHJcblxyXG4gIGNvbnN0cnVjdG9yKGRlc2NyaXB0aW9uOiBzdHJpbmcpIHtcclxuICAgIHN1cGVyKGBDbGllbnQgZXJyb3I6ICR7ZGVzY3JpcHRpb259YCk7XHJcbiAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogQSBzZXJ2ZXItc2lkZSBlcnJvciBvY2N1cnJlZCB3aGlsZSBjb21tdW5pY2F0aW5nIHdpdGggYSByZW1vdGUgc2VydmVyLlxyXG4gKiBcclxuICogQGV4cG9ydFxyXG4gKiBAY2xhc3MgU2VydmVyRXJyb3JcclxuICogQGV4dGVuZHMge0V4Y2VwdGlvbn1cclxuICovXHJcbmV4cG9ydCBjbGFzcyBTZXJ2ZXJFcnJvciBleHRlbmRzIEV4Y2VwdGlvbiB7XHJcbiAgcHVibGljIGRlc2NyaXB0aW9uOiBzdHJpbmc7XHJcblxyXG4gIGNvbnN0cnVjdG9yKGRlc2NyaXB0aW9uOiBzdHJpbmcpIHtcclxuICAgIHN1cGVyKGBTZXJ2ZXIgZXJyb3I6ICR7ZGVzY3JpcHRpb259YCk7XHJcbiAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogQSBuZXR3b3JraW5nIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gY29tbXVuaWNhdGUgd2l0aCBhIHJlbW90ZVxyXG4gKiBzZXJ2ZXIuXHJcbiAqXHJcbiAqIEBleHBvcnRcclxuICogQGNsYXNzIE5ldHdvcmtFcnJvclxyXG4gKiBAZXh0ZW5kcyB7RXhjZXB0aW9ufVxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIE5ldHdvcmtFcnJvciBleHRlbmRzIEV4Y2VwdGlvbiB7XHJcbiAgcHVibGljIGRlc2NyaXB0aW9uOiBzdHJpbmc7XHJcblxyXG4gIGNvbnN0cnVjdG9yKGRlc2NyaXB0aW9uOiBzdHJpbmcpIHtcclxuICAgIHN1cGVyKGBOZXR3b3JrIGVycm9yOiAke2Rlc2NyaXB0aW9ufWApO1xyXG4gICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEEgcXVlcnkgZXhwcmVzc2lvbiBjb3VsZCBub3QgYmUgcGFyc2VkLlxyXG4gKiBcclxuICogQGV4cG9ydFxyXG4gKiBAY2xhc3MgUXVlcnlFeHByZXNzaW9uUGFyc2VFcnJvclxyXG4gKiBAZXh0ZW5kcyB7RXhjZXB0aW9ufVxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFF1ZXJ5RXhwcmVzc2lvblBhcnNlRXJyb3IgZXh0ZW5kcyBFeGNlcHRpb24ge1xyXG4gIHB1YmxpYyBkZXNjcmlwdGlvbjogc3RyaW5nO1xyXG4gIHB1YmxpYyBleHByZXNzaW9uOiBhbnk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKGRlc2NyaXB0aW9uOiBzdHJpbmcsIGV4cHJlc3Npb246IGFueSkge1xyXG4gICAgc3VwZXIoYFF1ZXJ5IGV4cHJlc3Npb24gcGFyc2UgZXJyb3I6ICR7ZGVzY3JpcHRpb259YCk7XHJcbiAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XHJcbiAgICB0aGlzLmV4cHJlc3Npb24gPSBleHByZXNzaW9uO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEEgcXVlcnkgaXMgaW52YWxpZCBmb3IgYSBwYXJ0aWN1bGFyIHNvdXJjZS5cclxuICogXHJcbiAqIEBleHBvcnRcclxuICogQGNsYXNzIFF1ZXJ5Tm90QWxsb3dlZFxyXG4gKiBAZXh0ZW5kcyB7RXhjZXB0aW9ufVxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFF1ZXJ5Tm90QWxsb3dlZCBleHRlbmRzIEV4Y2VwdGlvbiB7XHJcbiAgcHVibGljIGRlc2NyaXB0aW9uOiBzdHJpbmc7XHJcbiAgcHVibGljIHF1ZXJ5OiBhbnk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKGRlc2NyaXB0aW9uOiBzdHJpbmcsIHF1ZXJ5OiBhbnkpIHtcclxuICAgIHN1cGVyKGBRdWVyeSBub3QgYWxsb3dlZDogJHtkZXNjcmlwdGlvbn1gKTtcclxuICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcclxuICAgIHRoaXMucXVlcnkgPSBxdWVyeTtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBIHRyYW5zZm9ybSBpcyBpbnZhbGlkIGZvciBhIHBhcnRpY3VsYXIgc291cmNlLlxyXG4gKiBcclxuICogQGV4cG9ydFxyXG4gKiBAY2xhc3MgVHJhbnNmb3JtTm90QWxsb3dlZFxyXG4gKiBAZXh0ZW5kcyB7RXhjZXB0aW9ufVxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFRyYW5zZm9ybU5vdEFsbG93ZWQgZXh0ZW5kcyBFeGNlcHRpb24ge1xyXG4gIHB1YmxpYyBkZXNjcmlwdGlvbjogc3RyaW5nO1xyXG4gIHB1YmxpYyB0cmFuc2Zvcm06IGFueTtcclxuXHJcbiAgY29uc3RydWN0b3IoZGVzY3JpcHRpb246IHN0cmluZywgdHJhbnNmb3JtOiBhbnkpIHtcclxuICAgIHN1cGVyKGBUcmFuc2Zvcm0gbm90IGFsbG93ZWQ6ICR7ZGVzY3JpcHRpb259YCk7XHJcbiAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XHJcbiAgICB0aGlzLnRyYW5zZm9ybSA9IHRyYW5zZm9ybTtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBbiBlcnJvciBvY2N1cmVkIHJlbGF0ZWQgdG8gdGhlIHNjaGVtYS5cclxuICogXHJcbiAqIEBleHBvcnRcclxuICogQGNsYXNzIFNjaGVtYUVycm9yXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgU2NoZW1hRXJyb3IgZXh0ZW5kcyBFeGNlcHRpb24ge1xyXG4gIHB1YmxpYyBkZXNjcmlwdGlvbjogc3RyaW5nO1xyXG5cclxuICBjb25zdHJ1Y3RvcihkZXNjcmlwdGlvbjogc3RyaW5nKSB7XHJcbiAgICBzdXBlcihgU2NoZW1hIGVycm9yOiAke2Rlc2NyaXB0aW9ufWApO1xyXG4gICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbi8qKlxyXG4gKiBBIG1vZGVsIGNvdWxkIG5vdCBiZSBmb3VuZCBpbiB0aGUgc2NoZW1hLlxyXG4gKiBcclxuICogQGV4cG9ydFxyXG4gKiBAY2xhc3MgTW9kZWxOb3RGb3VuZFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIE1vZGVsTm90Rm91bmQgZXh0ZW5kcyBTY2hlbWFFcnJvciB7XHJcbiAgY29uc3RydWN0b3IodHlwZTogc3RyaW5nKSB7XHJcbiAgICBzdXBlcihgTW9kZWwgZGVmaW5pdGlvbiBmb3IgJHt0eXBlfSBub3QgZm91bmRgKTtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBbiBlcnJvciBvY2N1cnJlZCByZWxhdGVkIHRvIGEgcGFydGljdWxhciByZWNvcmQuXHJcbiAqIFxyXG4gKiBAZXhwb3J0XHJcbiAqIEBhYnN0cmFjdFxyXG4gKiBAY2xhc3MgUmVjb3JkRXhjZXB0aW9uXHJcbiAqIEBleHRlbmRzIHtFeGNlcHRpb259XHJcbiAqL1xyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUmVjb3JkRXhjZXB0aW9uIGV4dGVuZHMgRXhjZXB0aW9uIHtcclxuICBwdWJsaWMgZGVzY3JpcHRpb246IHN0cmluZztcclxuICBwdWJsaWMgdHlwZTogc3RyaW5nO1xyXG4gIHB1YmxpYyBpZDogc3RyaW5nO1xyXG4gIHB1YmxpYyByZWxhdGlvbnNoaXA6IHN0cmluZztcclxuXHJcbiAgY29uc3RydWN0b3IoZGVzY3JpcHRpb246IHN0cmluZywgdHlwZTogc3RyaW5nLCBpZDogc3RyaW5nLCByZWxhdGlvbnNoaXA/OiBzdHJpbmcpIHtcclxuICAgIGxldCBtZXNzYWdlOiBzdHJpbmcgPSBgJHtkZXNjcmlwdGlvbn06ICR7dHlwZX06JHtpZH1gO1xyXG5cclxuICAgIGlmIChyZWxhdGlvbnNoaXApIHtcclxuICAgICAgbWVzc2FnZSArPSAnLycgKyByZWxhdGlvbnNoaXA7XHJcbiAgICB9XHJcblxyXG4gICAgc3VwZXIobWVzc2FnZSk7XHJcblxyXG4gICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xyXG4gICAgdGhpcy50eXBlID0gdHlwZTtcclxuICAgIHRoaXMuaWQgPSBpZDtcclxuICAgIHRoaXMucmVsYXRpb25zaGlwID0gcmVsYXRpb25zaGlwO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEEgcmVjb3JkIGNvdWxkIG5vdCBiZSBmb3VuZC5cclxuICogXHJcbiAqIEBleHBvcnRcclxuICogQGNsYXNzIFJlY29yZE5vdEZvdW5kRXhjZXB0aW9uXHJcbiAqIEBleHRlbmRzIHtSZWNvcmRFeGNlcHRpb259XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgUmVjb3JkTm90Rm91bmRFeGNlcHRpb24gZXh0ZW5kcyBSZWNvcmRFeGNlcHRpb24ge1xyXG4gIGNvbnN0cnVjdG9yKHR5cGU6IHN0cmluZywgaWQ6IHN0cmluZykge1xyXG4gICAgc3VwZXIoJ1JlY29yZCBub3QgZm91bmQnLCB0eXBlLCBpZCk7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogQSByZWxhdGlvbnNoaXAgY291bGQgbm90IGJlIGZvdW5kLlxyXG4gKiBcclxuICogQGV4cG9ydFxyXG4gKiBAY2xhc3MgUmVsYXRpb25zaGlwTm90Rm91bmRFeGNlcHRpb25cclxuICogQGV4dGVuZHMge1JlY29yZEV4Y2VwdGlvbn1cclxuICovXHJcbmV4cG9ydCBjbGFzcyBSZWxhdGlvbnNoaXBOb3RGb3VuZEV4Y2VwdGlvbiBleHRlbmRzIFJlY29yZEV4Y2VwdGlvbiB7XHJcbiAgY29uc3RydWN0b3IodHlwZTogc3RyaW5nLCBpZDogc3RyaW5nLCByZWxhdGlvbnNoaXA6IHN0cmluZykge1xyXG4gICAgc3VwZXIoJ1JlbGF0aW9uc2hpcCBub3QgZm91bmQnLCB0eXBlLCBpZCwgcmVsYXRpb25zaGlwKTtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBUaGUgcmVjb3JkIGFscmVhZHkgZXhpc3RzLlxyXG4gKiBcclxuICogQGV4cG9ydFxyXG4gKiBAY2xhc3MgUmVjb3JkQWxyZWFkeUV4aXN0c0V4Y2VwdGlvblxyXG4gKiBAZXh0ZW5kcyB7UmVjb3JkRXhjZXB0aW9ufVxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFJlY29yZEFscmVhZHlFeGlzdHNFeGNlcHRpb24gZXh0ZW5kcyBSZWNvcmRFeGNlcHRpb24ge1xyXG4gIGNvbnN0cnVjdG9yKHR5cGU6IHN0cmluZywgaWQ6IHN0cmluZykge1xyXG4gICAgc3VwZXIoJ1JlY29yZCBhbHJlYWR5IGV4aXN0cycsIHR5cGUsIGlkKTtcclxuICB9XHJcbn1cclxuIl19