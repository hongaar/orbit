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
/**
 * Base exception class.
 *
 * @export
 * @class Exception
 */
var Exception = function () {
    /**
     * Creates an instance of Exception.
     *
     * @param {string} message
     *
     * @memberOf Exception
     */
    function Exception(message) {
        this.message = message;
        this.error = new Error(this.message);
        this.stack = this.error.stack;
    }
    return Exception;
}();
exports.Exception = Exception;
/**
 * Exception raised when an item does not exist in a log.
 *
 * @export
 * @class NotLoggedException
 * @extends {Exception}
 */
var NotLoggedException = function (_super) {
    __extends(NotLoggedException, _super);
    function NotLoggedException(id) {
        var _this = _super.call(this, "Action not logged: " + id) || this;
        _this.id = id;
        return _this;
    }
    return NotLoggedException;
}(Exception);
exports.NotLoggedException = NotLoggedException;
/**
 * Exception raised when a value is outside an allowed range.
 *
 * @export
 * @class OutOfRangeException
 * @extends {Exception}
 */
var OutOfRangeException = function (_super) {
    __extends(OutOfRangeException, _super);
    function OutOfRangeException(value) {
        var _this = _super.call(this, "Out of range: " + value) || this;
        _this.value = value;
        return _this;
    }
    return OutOfRangeException;
}(Exception);
exports.OutOfRangeException = OutOfRangeException;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhjZXB0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3JjL2V4Y2VwdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsQUFLRzs7Ozs7O0FBQ0gsNEJBS0UsQUFNRztBQUNIOzs7Ozs7O3VCQUFZLEFBQWUsU0FDekIsQUFBSTthQUFDLEFBQU8sVUFBRyxBQUFPLEFBQUMsQUFDdkIsQUFBSTthQUFDLEFBQUssUUFBRyxJQUFJLEFBQUssTUFBQyxBQUFJLEtBQUMsQUFBTyxBQUFDLEFBQUMsQUFDckMsQUFBSTthQUFDLEFBQUssUUFBRyxBQUFJLEtBQUMsQUFBSyxNQUFDLEFBQUssQUFBQyxBQUNoQyxBQUFDO0FBQ0g7V0FBQSxBQUFDLEFBakJELEFBaUJDOztBQWpCWSxvQkFBUztBQW1CdEIsQUFNRzs7Ozs7OztBQUNILDJDQUF3QztrQ0FBUyxBQUcvQztnQ0FBWSxBQUFVLElBQXRCO29CQUNFLGtCQUFNLHdCQUFzQixBQUFJLEFBQUMsT0FFbEMsQUFEQyxBQUFJO2NBQUMsQUFBRSxLQUFHLEFBQUUsQUFBQztlQUNmLEFBQUM7QUFDSDtXQUFBLEFBQUMsQUFQRCxBQU9DO0VBUHVDLEFBQVMsQUFPaEQ7QUFQWSw2QkFBa0I7QUFTL0IsQUFNRzs7Ozs7OztBQUNILDRDQUF5QzttQ0FBUyxBQUdoRDtpQ0FBWSxBQUFhLE9BQXpCO29CQUNFLGtCQUFNLG1CQUFpQixBQUFPLEFBQUMsVUFFaEMsQUFEQyxBQUFJO2NBQUMsQUFBSyxRQUFHLEFBQUssQUFBQztlQUNyQixBQUFDO0FBQ0g7V0FBQSxBQUFDLEFBUEQsQUFPQztFQVB3QyxBQUFTLEFBT2pEO0FBUFksOEJBQW1CIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEJhc2UgZXhjZXB0aW9uIGNsYXNzLlxyXG4gKiBcclxuICogQGV4cG9ydFxyXG4gKiBAY2xhc3MgRXhjZXB0aW9uXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgRXhjZXB0aW9uIHtcclxuICBwdWJsaWMgbWVzc2FnZTogc3RyaW5nO1xyXG4gIHB1YmxpYyBlcnJvcjogRXJyb3I7XHJcbiAgcHVibGljIHN0YWNrOiBzdHJpbmc7XHJcblxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgRXhjZXB0aW9uLlxyXG4gICAqIFxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlIFxyXG4gICAqIFxyXG4gICAqIEBtZW1iZXJPZiBFeGNlcHRpb25cclxuICAgKi9cclxuICBjb25zdHJ1Y3RvcihtZXNzYWdlOiBzdHJpbmcpIHtcclxuICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XHJcbiAgICB0aGlzLmVycm9yID0gbmV3IEVycm9yKHRoaXMubWVzc2FnZSk7XHJcbiAgICB0aGlzLnN0YWNrID0gdGhpcy5lcnJvci5zdGFjaztcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBFeGNlcHRpb24gcmFpc2VkIHdoZW4gYW4gaXRlbSBkb2VzIG5vdCBleGlzdCBpbiBhIGxvZy5cclxuICogXHJcbiAqIEBleHBvcnRcclxuICogQGNsYXNzIE5vdExvZ2dlZEV4Y2VwdGlvblxyXG4gKiBAZXh0ZW5kcyB7RXhjZXB0aW9ufVxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIE5vdExvZ2dlZEV4Y2VwdGlvbiBleHRlbmRzIEV4Y2VwdGlvbiB7XHJcbiAgcHVibGljIGlkOiBzdHJpbmc7XHJcblxyXG4gIGNvbnN0cnVjdG9yKGlkOiBzdHJpbmcpIHtcclxuICAgIHN1cGVyKGBBY3Rpb24gbm90IGxvZ2dlZDogJHtpZH1gKTtcclxuICAgIHRoaXMuaWQgPSBpZDtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBFeGNlcHRpb24gcmFpc2VkIHdoZW4gYSB2YWx1ZSBpcyBvdXRzaWRlIGFuIGFsbG93ZWQgcmFuZ2UuXHJcbiAqIFxyXG4gKiBAZXhwb3J0XHJcbiAqIEBjbGFzcyBPdXRPZlJhbmdlRXhjZXB0aW9uXHJcbiAqIEBleHRlbmRzIHtFeGNlcHRpb259XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgT3V0T2ZSYW5nZUV4Y2VwdGlvbiBleHRlbmRzIEV4Y2VwdGlvbiB7XHJcbiAgcHVibGljIHZhbHVlOiBudW1iZXI7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHZhbHVlOiBudW1iZXIpIHtcclxuICAgIHN1cGVyKGBPdXQgb2YgcmFuZ2U6ICR7dmFsdWV9YCk7XHJcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XHJcbiAgfVxyXG59XHJcbiJdfQ==