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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhjZXB0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3JjL2V4Y2VwdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxvQ0FBd0M7QUFFeEM7Ozs7OztHQU1HO0FBQ0g7SUFBaUMsK0JBQVM7SUFHeEMscUJBQVksV0FBbUI7UUFBL0IsWUFDRSxrQkFBTSxtQkFBaUIsV0FBYSxDQUFDLFNBRXRDO1FBREMsS0FBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7O0lBQ2pDLENBQUM7SUFDSCxrQkFBQztBQUFELENBQUMsQUFQRCxDQUFpQyxnQkFBUyxHQU96QztBQVBZLGtDQUFXO0FBU3hCOzs7Ozs7R0FNRztBQUNIO0lBQWlDLCtCQUFTO0lBR3hDLHFCQUFZLFdBQW1CO1FBQS9CLFlBQ0Usa0JBQU0sbUJBQWlCLFdBQWEsQ0FBQyxTQUV0QztRQURDLEtBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDOztJQUNqQyxDQUFDO0lBQ0gsa0JBQUM7QUFBRCxDQUFDLEFBUEQsQ0FBaUMsZ0JBQVMsR0FPekM7QUFQWSxrQ0FBVztBQVN4Qjs7Ozs7OztHQU9HO0FBQ0g7SUFBa0MsZ0NBQVM7SUFHekMsc0JBQVksV0FBbUI7UUFBL0IsWUFDRSxrQkFBTSxvQkFBa0IsV0FBYSxDQUFDLFNBRXZDO1FBREMsS0FBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7O0lBQ2pDLENBQUM7SUFDSCxtQkFBQztBQUFELENBQUMsQUFQRCxDQUFrQyxnQkFBUyxHQU8xQztBQVBZLG9DQUFZO0FBU3pCOzs7Ozs7R0FNRztBQUNIO0lBQStDLDZDQUFTO0lBSXRELG1DQUFZLFdBQW1CLEVBQUUsVUFBZTtRQUFoRCxZQUNFLGtCQUFNLG1DQUFpQyxXQUFhLENBQUMsU0FHdEQ7UUFGQyxLQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztRQUMvQixLQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQzs7SUFDL0IsQ0FBQztJQUNILGdDQUFDO0FBQUQsQ0FBQyxBQVRELENBQStDLGdCQUFTLEdBU3ZEO0FBVFksOERBQXlCO0FBV3RDOzs7Ozs7R0FNRztBQUNIO0lBQXFDLG1DQUFTO0lBSTVDLHlCQUFZLFdBQW1CLEVBQUUsS0FBVTtRQUEzQyxZQUNFLGtCQUFNLHdCQUFzQixXQUFhLENBQUMsU0FHM0M7UUFGQyxLQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztRQUMvQixLQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQzs7SUFDckIsQ0FBQztJQUNILHNCQUFDO0FBQUQsQ0FBQyxBQVRELENBQXFDLGdCQUFTLEdBUzdDO0FBVFksMENBQWU7QUFXNUI7Ozs7OztHQU1HO0FBQ0g7SUFBeUMsdUNBQVM7SUFJaEQsNkJBQVksV0FBbUIsRUFBRSxTQUFjO1FBQS9DLFlBQ0Usa0JBQU0sNEJBQTBCLFdBQWEsQ0FBQyxTQUcvQztRQUZDLEtBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO1FBQy9CLEtBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDOztJQUM3QixDQUFDO0lBQ0gsMEJBQUM7QUFBRCxDQUFDLEFBVEQsQ0FBeUMsZ0JBQVMsR0FTakQ7QUFUWSxrREFBbUI7QUFXaEM7Ozs7Ozs7R0FPRztBQUNIO0lBQThDLG1DQUFTO0lBTXJELHlCQUFZLFdBQW1CLEVBQUUsSUFBWSxFQUFFLEVBQVUsRUFBRSxZQUFxQjtRQUFoRixpQkFhQztRQVpDLElBQUksT0FBTyxHQUFjLFdBQVcsVUFBSyxJQUFJLFNBQUksRUFBSSxDQUFDO1FBRXRELEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7WUFDakIsT0FBTyxJQUFJLEdBQUcsR0FBRyxZQUFZLENBQUM7UUFDaEMsQ0FBQztRQUVELFFBQUEsa0JBQU0sT0FBTyxDQUFDLFNBQUM7UUFFZixLQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztRQUMvQixLQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixLQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUNiLEtBQUksQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFDOztJQUNuQyxDQUFDO0lBQ0gsc0JBQUM7QUFBRCxDQUFDLEFBcEJELENBQThDLGdCQUFTLEdBb0J0RDtBQXBCcUIsMENBQWU7QUFzQnJDOzs7Ozs7R0FNRztBQUNIO0lBQTZDLDJDQUFlO0lBQzFELGlDQUFZLElBQVksRUFBRSxFQUFVO2VBQ2xDLGtCQUFNLGtCQUFrQixFQUFFLElBQUksRUFBRSxFQUFFLENBQUM7SUFDckMsQ0FBQztJQUNILDhCQUFDO0FBQUQsQ0FBQyxBQUpELENBQTZDLGVBQWUsR0FJM0Q7QUFKWSwwREFBdUI7QUFNcEM7Ozs7OztHQU1HO0FBQ0g7SUFBbUQsaURBQWU7SUFDaEUsdUNBQVksSUFBWSxFQUFFLEVBQVUsRUFBRSxZQUFvQjtlQUN4RCxrQkFBTSx3QkFBd0IsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFlBQVksQ0FBQztJQUN6RCxDQUFDO0lBQ0gsb0NBQUM7QUFBRCxDQUFDLEFBSkQsQ0FBbUQsZUFBZSxHQUlqRTtBQUpZLHNFQUE2QjtBQU0xQzs7Ozs7O0dBTUc7QUFDSDtJQUFrRCxnREFBZTtJQUMvRCxzQ0FBWSxJQUFZLEVBQUUsRUFBVTtlQUNsQyxrQkFBTSx1QkFBdUIsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDO0lBQzFDLENBQUM7SUFDSCxtQ0FBQztBQUFELENBQUMsQUFKRCxDQUFrRCxlQUFlLEdBSWhFO0FBSlksb0VBQTRCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXhjZXB0aW9uIH0gZnJvbSAnQG9yYml0L2NvcmUnO1xyXG5cclxuLyoqXHJcbiAqIEFuIGNsaWVudC1zaWRlIGVycm9yIG9jY3VycmVkIHdoaWxlIGNvbW11bmljYXRpbmcgd2l0aCBhIHJlbW90ZSBzZXJ2ZXIuXHJcbiAqIFxyXG4gKiBAZXhwb3J0XHJcbiAqIEBjbGFzcyBDbGllbnRFcnJvclxyXG4gKiBAZXh0ZW5kcyB7RXhjZXB0aW9ufVxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIENsaWVudEVycm9yIGV4dGVuZHMgRXhjZXB0aW9uIHtcclxuICBwdWJsaWMgZGVzY3JpcHRpb246IHN0cmluZztcclxuXHJcbiAgY29uc3RydWN0b3IoZGVzY3JpcHRpb246IHN0cmluZykge1xyXG4gICAgc3VwZXIoYENsaWVudCBlcnJvcjogJHtkZXNjcmlwdGlvbn1gKTtcclxuICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBIHNlcnZlci1zaWRlIGVycm9yIG9jY3VycmVkIHdoaWxlIGNvbW11bmljYXRpbmcgd2l0aCBhIHJlbW90ZSBzZXJ2ZXIuXHJcbiAqIFxyXG4gKiBAZXhwb3J0XHJcbiAqIEBjbGFzcyBTZXJ2ZXJFcnJvclxyXG4gKiBAZXh0ZW5kcyB7RXhjZXB0aW9ufVxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFNlcnZlckVycm9yIGV4dGVuZHMgRXhjZXB0aW9uIHtcclxuICBwdWJsaWMgZGVzY3JpcHRpb246IHN0cmluZztcclxuXHJcbiAgY29uc3RydWN0b3IoZGVzY3JpcHRpb246IHN0cmluZykge1xyXG4gICAgc3VwZXIoYFNlcnZlciBlcnJvcjogJHtkZXNjcmlwdGlvbn1gKTtcclxuICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBIG5ldHdvcmtpbmcgZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byBjb21tdW5pY2F0ZSB3aXRoIGEgcmVtb3RlXHJcbiAqIHNlcnZlci5cclxuICpcclxuICogQGV4cG9ydFxyXG4gKiBAY2xhc3MgTmV0d29ya0Vycm9yXHJcbiAqIEBleHRlbmRzIHtFeGNlcHRpb259XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgTmV0d29ya0Vycm9yIGV4dGVuZHMgRXhjZXB0aW9uIHtcclxuICBwdWJsaWMgZGVzY3JpcHRpb246IHN0cmluZztcclxuXHJcbiAgY29uc3RydWN0b3IoZGVzY3JpcHRpb246IHN0cmluZykge1xyXG4gICAgc3VwZXIoYE5ldHdvcmsgZXJyb3I6ICR7ZGVzY3JpcHRpb259YCk7XHJcbiAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogQSBxdWVyeSBleHByZXNzaW9uIGNvdWxkIG5vdCBiZSBwYXJzZWQuXHJcbiAqIFxyXG4gKiBAZXhwb3J0XHJcbiAqIEBjbGFzcyBRdWVyeUV4cHJlc3Npb25QYXJzZUVycm9yXHJcbiAqIEBleHRlbmRzIHtFeGNlcHRpb259XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgUXVlcnlFeHByZXNzaW9uUGFyc2VFcnJvciBleHRlbmRzIEV4Y2VwdGlvbiB7XHJcbiAgcHVibGljIGRlc2NyaXB0aW9uOiBzdHJpbmc7XHJcbiAgcHVibGljIGV4cHJlc3Npb246IGFueTtcclxuXHJcbiAgY29uc3RydWN0b3IoZGVzY3JpcHRpb246IHN0cmluZywgZXhwcmVzc2lvbjogYW55KSB7XHJcbiAgICBzdXBlcihgUXVlcnkgZXhwcmVzc2lvbiBwYXJzZSBlcnJvcjogJHtkZXNjcmlwdGlvbn1gKTtcclxuICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcclxuICAgIHRoaXMuZXhwcmVzc2lvbiA9IGV4cHJlc3Npb247XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogQSBxdWVyeSBpcyBpbnZhbGlkIGZvciBhIHBhcnRpY3VsYXIgc291cmNlLlxyXG4gKiBcclxuICogQGV4cG9ydFxyXG4gKiBAY2xhc3MgUXVlcnlOb3RBbGxvd2VkXHJcbiAqIEBleHRlbmRzIHtFeGNlcHRpb259XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgUXVlcnlOb3RBbGxvd2VkIGV4dGVuZHMgRXhjZXB0aW9uIHtcclxuICBwdWJsaWMgZGVzY3JpcHRpb246IHN0cmluZztcclxuICBwdWJsaWMgcXVlcnk6IGFueTtcclxuXHJcbiAgY29uc3RydWN0b3IoZGVzY3JpcHRpb246IHN0cmluZywgcXVlcnk6IGFueSkge1xyXG4gICAgc3VwZXIoYFF1ZXJ5IG5vdCBhbGxvd2VkOiAke2Rlc2NyaXB0aW9ufWApO1xyXG4gICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xyXG4gICAgdGhpcy5xdWVyeSA9IHF1ZXJ5O1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEEgdHJhbnNmb3JtIGlzIGludmFsaWQgZm9yIGEgcGFydGljdWxhciBzb3VyY2UuXHJcbiAqIFxyXG4gKiBAZXhwb3J0XHJcbiAqIEBjbGFzcyBUcmFuc2Zvcm1Ob3RBbGxvd2VkXHJcbiAqIEBleHRlbmRzIHtFeGNlcHRpb259XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVHJhbnNmb3JtTm90QWxsb3dlZCBleHRlbmRzIEV4Y2VwdGlvbiB7XHJcbiAgcHVibGljIGRlc2NyaXB0aW9uOiBzdHJpbmc7XHJcbiAgcHVibGljIHRyYW5zZm9ybTogYW55O1xyXG5cclxuICBjb25zdHJ1Y3RvcihkZXNjcmlwdGlvbjogc3RyaW5nLCB0cmFuc2Zvcm06IGFueSkge1xyXG4gICAgc3VwZXIoYFRyYW5zZm9ybSBub3QgYWxsb3dlZDogJHtkZXNjcmlwdGlvbn1gKTtcclxuICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcclxuICAgIHRoaXMudHJhbnNmb3JtID0gdHJhbnNmb3JtO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEFuIGVycm9yIG9jY3VycmVkIHJlbGF0ZWQgdG8gYSBwYXJ0aWN1bGFyIHJlY29yZC5cclxuICogXHJcbiAqIEBleHBvcnRcclxuICogQGFic3RyYWN0XHJcbiAqIEBjbGFzcyBSZWNvcmRFeGNlcHRpb25cclxuICogQGV4dGVuZHMge0V4Y2VwdGlvbn1cclxuICovXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBSZWNvcmRFeGNlcHRpb24gZXh0ZW5kcyBFeGNlcHRpb24ge1xyXG4gIHB1YmxpYyBkZXNjcmlwdGlvbjogc3RyaW5nO1xyXG4gIHB1YmxpYyB0eXBlOiBzdHJpbmc7XHJcbiAgcHVibGljIGlkOiBzdHJpbmc7XHJcbiAgcHVibGljIHJlbGF0aW9uc2hpcDogc3RyaW5nO1xyXG5cclxuICBjb25zdHJ1Y3RvcihkZXNjcmlwdGlvbjogc3RyaW5nLCB0eXBlOiBzdHJpbmcsIGlkOiBzdHJpbmcsIHJlbGF0aW9uc2hpcD86IHN0cmluZykge1xyXG4gICAgbGV0IG1lc3NhZ2U6IHN0cmluZyA9IGAke2Rlc2NyaXB0aW9ufTogJHt0eXBlfToke2lkfWA7XHJcblxyXG4gICAgaWYgKHJlbGF0aW9uc2hpcCkge1xyXG4gICAgICBtZXNzYWdlICs9ICcvJyArIHJlbGF0aW9uc2hpcDtcclxuICAgIH1cclxuXHJcbiAgICBzdXBlcihtZXNzYWdlKTtcclxuXHJcbiAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XHJcbiAgICB0aGlzLnR5cGUgPSB0eXBlO1xyXG4gICAgdGhpcy5pZCA9IGlkO1xyXG4gICAgdGhpcy5yZWxhdGlvbnNoaXAgPSByZWxhdGlvbnNoaXA7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogQSByZWNvcmQgY291bGQgbm90IGJlIGZvdW5kLlxyXG4gKiBcclxuICogQGV4cG9ydFxyXG4gKiBAY2xhc3MgUmVjb3JkTm90Rm91bmRFeGNlcHRpb25cclxuICogQGV4dGVuZHMge1JlY29yZEV4Y2VwdGlvbn1cclxuICovXHJcbmV4cG9ydCBjbGFzcyBSZWNvcmROb3RGb3VuZEV4Y2VwdGlvbiBleHRlbmRzIFJlY29yZEV4Y2VwdGlvbiB7XHJcbiAgY29uc3RydWN0b3IodHlwZTogc3RyaW5nLCBpZDogc3RyaW5nKSB7XHJcbiAgICBzdXBlcignUmVjb3JkIG5vdCBmb3VuZCcsIHR5cGUsIGlkKTtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBIHJlbGF0aW9uc2hpcCBjb3VsZCBub3QgYmUgZm91bmQuXHJcbiAqIFxyXG4gKiBAZXhwb3J0XHJcbiAqIEBjbGFzcyBSZWxhdGlvbnNoaXBOb3RGb3VuZEV4Y2VwdGlvblxyXG4gKiBAZXh0ZW5kcyB7UmVjb3JkRXhjZXB0aW9ufVxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFJlbGF0aW9uc2hpcE5vdEZvdW5kRXhjZXB0aW9uIGV4dGVuZHMgUmVjb3JkRXhjZXB0aW9uIHtcclxuICBjb25zdHJ1Y3Rvcih0eXBlOiBzdHJpbmcsIGlkOiBzdHJpbmcsIHJlbGF0aW9uc2hpcDogc3RyaW5nKSB7XHJcbiAgICBzdXBlcignUmVsYXRpb25zaGlwIG5vdCBmb3VuZCcsIHR5cGUsIGlkLCByZWxhdGlvbnNoaXApO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIFRoZSByZWNvcmQgYWxyZWFkeSBleGlzdHMuXHJcbiAqIFxyXG4gKiBAZXhwb3J0XHJcbiAqIEBjbGFzcyBSZWNvcmRBbHJlYWR5RXhpc3RzRXhjZXB0aW9uXHJcbiAqIEBleHRlbmRzIHtSZWNvcmRFeGNlcHRpb259XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgUmVjb3JkQWxyZWFkeUV4aXN0c0V4Y2VwdGlvbiBleHRlbmRzIFJlY29yZEV4Y2VwdGlvbiB7XHJcbiAgY29uc3RydWN0b3IodHlwZTogc3RyaW5nLCBpZDogc3RyaW5nKSB7XHJcbiAgICBzdXBlcignUmVjb3JkIGFscmVhZHkgZXhpc3RzJywgdHlwZSwgaWQpO1xyXG4gIH1cclxufVxyXG4iXX0=