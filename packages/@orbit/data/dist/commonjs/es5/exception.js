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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhjZXB0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3JjL2V4Y2VwdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEscUJBQXdDO0FBRXhDLEFBTUc7Ozs7Ozs7QUFDSCxvQ0FBaUM7MkJBQVMsQUFHeEM7eUJBQVksQUFBbUIsYUFBL0I7b0JBQ0Usa0JBQU0sbUJBQWlCLEFBQWEsQUFBQyxnQkFFdEMsQUFEQyxBQUFJO2NBQUMsQUFBVyxjQUFHLEFBQVcsQUFBQztlQUNqQyxBQUFDO0FBQ0g7V0FBQSxBQUFDLEFBUEQsQUFPQztFQVBnQyxPQUFTLEFBT3pDO0FBUFksc0JBQVc7QUFTeEIsQUFNRzs7Ozs7OztBQUNILG9DQUFpQzsyQkFBUyxBQUd4Qzt5QkFBWSxBQUFtQixhQUEvQjtvQkFDRSxrQkFBTSxtQkFBaUIsQUFBYSxBQUFDLGdCQUV0QyxBQURDLEFBQUk7Y0FBQyxBQUFXLGNBQUcsQUFBVyxBQUFDO2VBQ2pDLEFBQUM7QUFDSDtXQUFBLEFBQUMsQUFQRCxBQU9DO0VBUGdDLE9BQVMsQUFPekM7QUFQWSxzQkFBVztBQVN4QixBQU9HOzs7Ozs7OztBQUNILHFDQUFrQzs0QkFBUyxBQUd6QzswQkFBWSxBQUFtQixhQUEvQjtvQkFDRSxrQkFBTSxvQkFBa0IsQUFBYSxBQUFDLGdCQUV2QyxBQURDLEFBQUk7Y0FBQyxBQUFXLGNBQUcsQUFBVyxBQUFDO2VBQ2pDLEFBQUM7QUFDSDtXQUFBLEFBQUMsQUFQRCxBQU9DO0VBUGlDLE9BQVMsQUFPMUM7QUFQWSx1QkFBWTtBQVN6QixBQU1HOzs7Ozs7O0FBQ0gsa0RBQStDO3lDQUFTLEFBSXREO3VDQUFZLEFBQW1CLGFBQUUsQUFBZSxZQUFoRDtvQkFDRSxrQkFBTSxtQ0FBaUMsQUFBYSxBQUFDLGdCQUd0RCxBQUZDLEFBQUk7Y0FBQyxBQUFXLGNBQUcsQUFBVyxBQUFDLEFBQy9CLEFBQUk7Y0FBQyxBQUFVLGFBQUcsQUFBVSxBQUFDO2VBQy9CLEFBQUM7QUFDSDtXQUFBLEFBQUMsQUFURCxBQVNDO0VBVDhDLE9BQVMsQUFTdkQ7QUFUWSxvQ0FBeUI7QUFXdEMsQUFNRzs7Ozs7OztBQUNILHdDQUFxQzsrQkFBUyxBQUk1Qzs2QkFBWSxBQUFtQixhQUFFLEFBQVUsT0FBM0M7b0JBQ0Usa0JBQU0sd0JBQXNCLEFBQWEsQUFBQyxnQkFHM0MsQUFGQyxBQUFJO2NBQUMsQUFBVyxjQUFHLEFBQVcsQUFBQyxBQUMvQixBQUFJO2NBQUMsQUFBSyxRQUFHLEFBQUssQUFBQztlQUNyQixBQUFDO0FBQ0g7V0FBQSxBQUFDLEFBVEQsQUFTQztFQVRvQyxPQUFTLEFBUzdDO0FBVFksMEJBQWU7QUFXNUIsQUFNRzs7Ozs7OztBQUNILDRDQUF5QzttQ0FBUyxBQUloRDtpQ0FBWSxBQUFtQixhQUFFLEFBQWMsV0FBL0M7b0JBQ0Usa0JBQU0sNEJBQTBCLEFBQWEsQUFBQyxnQkFHL0MsQUFGQyxBQUFJO2NBQUMsQUFBVyxjQUFHLEFBQVcsQUFBQyxBQUMvQixBQUFJO2NBQUMsQUFBUyxZQUFHLEFBQVMsQUFBQztlQUM3QixBQUFDO0FBQ0g7V0FBQSxBQUFDLEFBVEQsQUFTQztFQVR3QyxPQUFTLEFBU2pEO0FBVFksOEJBQW1CO0FBV2hDLEFBT0c7Ozs7Ozs7O0FBQ0gsd0NBQThDOytCQUFTLEFBTXJEOzZCQUFZLEFBQW1CLGFBQUUsQUFBWSxNQUFFLEFBQVUsSUFBRSxBQUFxQixjQUFoRjtvQkFhQyxBQVpDO1lBQUksQUFBTyxVQUFjLEFBQVcscUJBQUssQUFBSSxhQUFJLEFBQUksQUFBQyxBQUV0RCxBQUFFLEFBQUM7WUFBQyxBQUFZLEFBQUMsY0FBQyxBQUFDLEFBQ2pCLEFBQU87dUJBQUksQUFBRyxNQUFHLEFBQVksQUFBQyxBQUNoQyxBQUFDO0FBRUQ7Z0JBQUEsa0JBQU0sQUFBTyxBQUFDLFlBQUMsQUFFZixBQUFJO2NBQUMsQUFBVyxjQUFHLEFBQVcsQUFBQyxBQUMvQixBQUFJO2NBQUMsQUFBSSxPQUFHLEFBQUksQUFBQyxBQUNqQixBQUFJO2NBQUMsQUFBRSxLQUFHLEFBQUUsQUFBQyxBQUNiLEFBQUk7Y0FBQyxBQUFZLGVBQUcsQUFBWSxBQUFDO2VBQ25DLEFBQUM7QUFDSDtXQUFBLEFBQUMsQUFwQkQsQUFvQkM7RUFwQjZDLE9BQVMsQUFvQnREO0FBcEJxQiwwQkFBZTtBQXNCckMsQUFNRzs7Ozs7OztBQUNILGdEQUE2Qzt1Q0FBZSxBQUMxRDtxQ0FBWSxBQUFZLE1BQUUsQUFBVTtlQUNsQyxrQkFBTSxBQUFrQixvQkFBRSxBQUFJLE1BQUUsQUFBRSxBQUFDLE9BQ3JDLEFBQUM7QUFDSDtXQUFBLEFBQUMsQUFKRCxBQUlDO0VBSjRDLEFBQWUsQUFJM0Q7QUFKWSxrQ0FBdUI7QUFNcEMsQUFNRzs7Ozs7OztBQUNILHNEQUFtRDs2Q0FBZSxBQUNoRTsyQ0FBWSxBQUFZLE1BQUUsQUFBVSxJQUFFLEFBQW9CO2VBQ3hELGtCQUFNLEFBQXdCLDBCQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBWSxBQUFDLGlCQUN6RCxBQUFDO0FBQ0g7V0FBQSxBQUFDLEFBSkQsQUFJQztFQUprRCxBQUFlLEFBSWpFO0FBSlksd0NBQTZCO0FBTTFDLEFBTUc7Ozs7Ozs7QUFDSCxxREFBa0Q7NENBQWUsQUFDL0Q7MENBQVksQUFBWSxNQUFFLEFBQVU7ZUFDbEMsa0JBQU0sQUFBdUIseUJBQUUsQUFBSSxNQUFFLEFBQUUsQUFBQyxPQUMxQyxBQUFDO0FBQ0g7V0FBQSxBQUFDLEFBSkQsQUFJQztFQUppRCxBQUFlLEFBSWhFO0FBSlksdUNBQTRCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXhjZXB0aW9uIH0gZnJvbSAnQG9yYml0L2NvcmUnO1xyXG5cclxuLyoqXHJcbiAqIEFuIGNsaWVudC1zaWRlIGVycm9yIG9jY3VycmVkIHdoaWxlIGNvbW11bmljYXRpbmcgd2l0aCBhIHJlbW90ZSBzZXJ2ZXIuXHJcbiAqIFxyXG4gKiBAZXhwb3J0XHJcbiAqIEBjbGFzcyBDbGllbnRFcnJvclxyXG4gKiBAZXh0ZW5kcyB7RXhjZXB0aW9ufVxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIENsaWVudEVycm9yIGV4dGVuZHMgRXhjZXB0aW9uIHtcclxuICBwdWJsaWMgZGVzY3JpcHRpb246IHN0cmluZztcclxuXHJcbiAgY29uc3RydWN0b3IoZGVzY3JpcHRpb246IHN0cmluZykge1xyXG4gICAgc3VwZXIoYENsaWVudCBlcnJvcjogJHtkZXNjcmlwdGlvbn1gKTtcclxuICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBIHNlcnZlci1zaWRlIGVycm9yIG9jY3VycmVkIHdoaWxlIGNvbW11bmljYXRpbmcgd2l0aCBhIHJlbW90ZSBzZXJ2ZXIuXHJcbiAqIFxyXG4gKiBAZXhwb3J0XHJcbiAqIEBjbGFzcyBTZXJ2ZXJFcnJvclxyXG4gKiBAZXh0ZW5kcyB7RXhjZXB0aW9ufVxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFNlcnZlckVycm9yIGV4dGVuZHMgRXhjZXB0aW9uIHtcclxuICBwdWJsaWMgZGVzY3JpcHRpb246IHN0cmluZztcclxuXHJcbiAgY29uc3RydWN0b3IoZGVzY3JpcHRpb246IHN0cmluZykge1xyXG4gICAgc3VwZXIoYFNlcnZlciBlcnJvcjogJHtkZXNjcmlwdGlvbn1gKTtcclxuICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBIG5ldHdvcmtpbmcgZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byBjb21tdW5pY2F0ZSB3aXRoIGEgcmVtb3RlXHJcbiAqIHNlcnZlci5cclxuICpcclxuICogQGV4cG9ydFxyXG4gKiBAY2xhc3MgTmV0d29ya0Vycm9yXHJcbiAqIEBleHRlbmRzIHtFeGNlcHRpb259XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgTmV0d29ya0Vycm9yIGV4dGVuZHMgRXhjZXB0aW9uIHtcclxuICBwdWJsaWMgZGVzY3JpcHRpb246IHN0cmluZztcclxuXHJcbiAgY29uc3RydWN0b3IoZGVzY3JpcHRpb246IHN0cmluZykge1xyXG4gICAgc3VwZXIoYE5ldHdvcmsgZXJyb3I6ICR7ZGVzY3JpcHRpb259YCk7XHJcbiAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogQSBxdWVyeSBleHByZXNzaW9uIGNvdWxkIG5vdCBiZSBwYXJzZWQuXHJcbiAqIFxyXG4gKiBAZXhwb3J0XHJcbiAqIEBjbGFzcyBRdWVyeUV4cHJlc3Npb25QYXJzZUVycm9yXHJcbiAqIEBleHRlbmRzIHtFeGNlcHRpb259XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgUXVlcnlFeHByZXNzaW9uUGFyc2VFcnJvciBleHRlbmRzIEV4Y2VwdGlvbiB7XHJcbiAgcHVibGljIGRlc2NyaXB0aW9uOiBzdHJpbmc7XHJcbiAgcHVibGljIGV4cHJlc3Npb246IGFueTtcclxuXHJcbiAgY29uc3RydWN0b3IoZGVzY3JpcHRpb246IHN0cmluZywgZXhwcmVzc2lvbjogYW55KSB7XHJcbiAgICBzdXBlcihgUXVlcnkgZXhwcmVzc2lvbiBwYXJzZSBlcnJvcjogJHtkZXNjcmlwdGlvbn1gKTtcclxuICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcclxuICAgIHRoaXMuZXhwcmVzc2lvbiA9IGV4cHJlc3Npb247XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogQSBxdWVyeSBpcyBpbnZhbGlkIGZvciBhIHBhcnRpY3VsYXIgc291cmNlLlxyXG4gKiBcclxuICogQGV4cG9ydFxyXG4gKiBAY2xhc3MgUXVlcnlOb3RBbGxvd2VkXHJcbiAqIEBleHRlbmRzIHtFeGNlcHRpb259XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgUXVlcnlOb3RBbGxvd2VkIGV4dGVuZHMgRXhjZXB0aW9uIHtcclxuICBwdWJsaWMgZGVzY3JpcHRpb246IHN0cmluZztcclxuICBwdWJsaWMgcXVlcnk6IGFueTtcclxuXHJcbiAgY29uc3RydWN0b3IoZGVzY3JpcHRpb246IHN0cmluZywgcXVlcnk6IGFueSkge1xyXG4gICAgc3VwZXIoYFF1ZXJ5IG5vdCBhbGxvd2VkOiAke2Rlc2NyaXB0aW9ufWApO1xyXG4gICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xyXG4gICAgdGhpcy5xdWVyeSA9IHF1ZXJ5O1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEEgdHJhbnNmb3JtIGlzIGludmFsaWQgZm9yIGEgcGFydGljdWxhciBzb3VyY2UuXHJcbiAqIFxyXG4gKiBAZXhwb3J0XHJcbiAqIEBjbGFzcyBUcmFuc2Zvcm1Ob3RBbGxvd2VkXHJcbiAqIEBleHRlbmRzIHtFeGNlcHRpb259XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVHJhbnNmb3JtTm90QWxsb3dlZCBleHRlbmRzIEV4Y2VwdGlvbiB7XHJcbiAgcHVibGljIGRlc2NyaXB0aW9uOiBzdHJpbmc7XHJcbiAgcHVibGljIHRyYW5zZm9ybTogYW55O1xyXG5cclxuICBjb25zdHJ1Y3RvcihkZXNjcmlwdGlvbjogc3RyaW5nLCB0cmFuc2Zvcm06IGFueSkge1xyXG4gICAgc3VwZXIoYFRyYW5zZm9ybSBub3QgYWxsb3dlZDogJHtkZXNjcmlwdGlvbn1gKTtcclxuICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcclxuICAgIHRoaXMudHJhbnNmb3JtID0gdHJhbnNmb3JtO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEFuIGVycm9yIG9jY3VycmVkIHJlbGF0ZWQgdG8gYSBwYXJ0aWN1bGFyIHJlY29yZC5cclxuICogXHJcbiAqIEBleHBvcnRcclxuICogQGFic3RyYWN0XHJcbiAqIEBjbGFzcyBSZWNvcmRFeGNlcHRpb25cclxuICogQGV4dGVuZHMge0V4Y2VwdGlvbn1cclxuICovXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBSZWNvcmRFeGNlcHRpb24gZXh0ZW5kcyBFeGNlcHRpb24ge1xyXG4gIHB1YmxpYyBkZXNjcmlwdGlvbjogc3RyaW5nO1xyXG4gIHB1YmxpYyB0eXBlOiBzdHJpbmc7XHJcbiAgcHVibGljIGlkOiBzdHJpbmc7XHJcbiAgcHVibGljIHJlbGF0aW9uc2hpcDogc3RyaW5nO1xyXG5cclxuICBjb25zdHJ1Y3RvcihkZXNjcmlwdGlvbjogc3RyaW5nLCB0eXBlOiBzdHJpbmcsIGlkOiBzdHJpbmcsIHJlbGF0aW9uc2hpcD86IHN0cmluZykge1xyXG4gICAgbGV0IG1lc3NhZ2U6IHN0cmluZyA9IGAke2Rlc2NyaXB0aW9ufTogJHt0eXBlfToke2lkfWA7XHJcblxyXG4gICAgaWYgKHJlbGF0aW9uc2hpcCkge1xyXG4gICAgICBtZXNzYWdlICs9ICcvJyArIHJlbGF0aW9uc2hpcDtcclxuICAgIH1cclxuXHJcbiAgICBzdXBlcihtZXNzYWdlKTtcclxuXHJcbiAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XHJcbiAgICB0aGlzLnR5cGUgPSB0eXBlO1xyXG4gICAgdGhpcy5pZCA9IGlkO1xyXG4gICAgdGhpcy5yZWxhdGlvbnNoaXAgPSByZWxhdGlvbnNoaXA7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogQSByZWNvcmQgY291bGQgbm90IGJlIGZvdW5kLlxyXG4gKiBcclxuICogQGV4cG9ydFxyXG4gKiBAY2xhc3MgUmVjb3JkTm90Rm91bmRFeGNlcHRpb25cclxuICogQGV4dGVuZHMge1JlY29yZEV4Y2VwdGlvbn1cclxuICovXHJcbmV4cG9ydCBjbGFzcyBSZWNvcmROb3RGb3VuZEV4Y2VwdGlvbiBleHRlbmRzIFJlY29yZEV4Y2VwdGlvbiB7XHJcbiAgY29uc3RydWN0b3IodHlwZTogc3RyaW5nLCBpZDogc3RyaW5nKSB7XHJcbiAgICBzdXBlcignUmVjb3JkIG5vdCBmb3VuZCcsIHR5cGUsIGlkKTtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBIHJlbGF0aW9uc2hpcCBjb3VsZCBub3QgYmUgZm91bmQuXHJcbiAqIFxyXG4gKiBAZXhwb3J0XHJcbiAqIEBjbGFzcyBSZWxhdGlvbnNoaXBOb3RGb3VuZEV4Y2VwdGlvblxyXG4gKiBAZXh0ZW5kcyB7UmVjb3JkRXhjZXB0aW9ufVxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFJlbGF0aW9uc2hpcE5vdEZvdW5kRXhjZXB0aW9uIGV4dGVuZHMgUmVjb3JkRXhjZXB0aW9uIHtcclxuICBjb25zdHJ1Y3Rvcih0eXBlOiBzdHJpbmcsIGlkOiBzdHJpbmcsIHJlbGF0aW9uc2hpcDogc3RyaW5nKSB7XHJcbiAgICBzdXBlcignUmVsYXRpb25zaGlwIG5vdCBmb3VuZCcsIHR5cGUsIGlkLCByZWxhdGlvbnNoaXApO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIFRoZSByZWNvcmQgYWxyZWFkeSBleGlzdHMuXHJcbiAqIFxyXG4gKiBAZXhwb3J0XHJcbiAqIEBjbGFzcyBSZWNvcmRBbHJlYWR5RXhpc3RzRXhjZXB0aW9uXHJcbiAqIEBleHRlbmRzIHtSZWNvcmRFeGNlcHRpb259XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgUmVjb3JkQWxyZWFkeUV4aXN0c0V4Y2VwdGlvbiBleHRlbmRzIFJlY29yZEV4Y2VwdGlvbiB7XHJcbiAgY29uc3RydWN0b3IodHlwZTogc3RyaW5nLCBpZDogc3RyaW5nKSB7XHJcbiAgICBzdXBlcignUmVjb3JkIGFscmVhZHkgZXhpc3RzJywgdHlwZSwgaWQpO1xyXG4gIH1cclxufVxyXG4iXX0=