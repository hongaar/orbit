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
/**
 * Base exception class.
 *
 * @export
 * @class Exception
 */
var Exception = (function () {
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
}());
exports.Exception = Exception;
/**
 * Exception raised when an item does not exist in a log.
 *
 * @export
 * @class NotLoggedException
 * @extends {Exception}
 */
var NotLoggedException = (function (_super) {
    __extends(NotLoggedException, _super);
    function NotLoggedException(id) {
        var _this = _super.call(this, "Action not logged: " + id) || this;
        _this.id = id;
        return _this;
    }
    return NotLoggedException;
}(Exception));
exports.NotLoggedException = NotLoggedException;
/**
 * Exception raised when a value is outside an allowed range.
 *
 * @export
 * @class OutOfRangeException
 * @extends {Exception}
 */
var OutOfRangeException = (function (_super) {
    __extends(OutOfRangeException, _super);
    function OutOfRangeException(value) {
        var _this = _super.call(this, "Out of range: " + value) || this;
        _this.value = value;
        return _this;
    }
    return OutOfRangeException;
}(Exception));
exports.OutOfRangeException = OutOfRangeException;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhjZXB0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3JjL2V4Y2VwdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7R0FLRztBQUNIO0lBS0U7Ozs7OztPQU1HO0lBQ0gsbUJBQVksT0FBZTtRQUN6QixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUN2QixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNyQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO0lBQ2hDLENBQUM7SUFDSCxnQkFBQztBQUFELENBQUMsQUFqQkQsSUFpQkM7QUFqQlksOEJBQVM7QUFtQnRCOzs7Ozs7R0FNRztBQUNIO0lBQXdDLHNDQUFTO0lBRy9DLDRCQUFZLEVBQVU7UUFBdEIsWUFDRSxrQkFBTSx3QkFBc0IsRUFBSSxDQUFDLFNBRWxDO1FBREMsS0FBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7O0lBQ2YsQ0FBQztJQUNILHlCQUFDO0FBQUQsQ0FBQyxBQVBELENBQXdDLFNBQVMsR0FPaEQ7QUFQWSxnREFBa0I7QUFTL0I7Ozs7OztHQU1HO0FBQ0g7SUFBeUMsdUNBQVM7SUFHaEQsNkJBQVksS0FBYTtRQUF6QixZQUNFLGtCQUFNLG1CQUFpQixLQUFPLENBQUMsU0FFaEM7UUFEQyxLQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQzs7SUFDckIsQ0FBQztJQUNILDBCQUFDO0FBQUQsQ0FBQyxBQVBELENBQXlDLFNBQVMsR0FPakQ7QUFQWSxrREFBbUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQmFzZSBleGNlcHRpb24gY2xhc3MuXHJcbiAqIFxyXG4gKiBAZXhwb3J0XHJcbiAqIEBjbGFzcyBFeGNlcHRpb25cclxuICovXHJcbmV4cG9ydCBjbGFzcyBFeGNlcHRpb24ge1xyXG4gIHB1YmxpYyBtZXNzYWdlOiBzdHJpbmc7XHJcbiAgcHVibGljIGVycm9yOiBFcnJvcjtcclxuICBwdWJsaWMgc3RhY2s6IHN0cmluZztcclxuXHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiBFeGNlcHRpb24uXHJcbiAgICogXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2UgXHJcbiAgICogXHJcbiAgICogQG1lbWJlck9mIEV4Y2VwdGlvblxyXG4gICAqL1xyXG4gIGNvbnN0cnVjdG9yKG1lc3NhZ2U6IHN0cmluZykge1xyXG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcclxuICAgIHRoaXMuZXJyb3IgPSBuZXcgRXJyb3IodGhpcy5tZXNzYWdlKTtcclxuICAgIHRoaXMuc3RhY2sgPSB0aGlzLmVycm9yLnN0YWNrO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEV4Y2VwdGlvbiByYWlzZWQgd2hlbiBhbiBpdGVtIGRvZXMgbm90IGV4aXN0IGluIGEgbG9nLlxyXG4gKiBcclxuICogQGV4cG9ydFxyXG4gKiBAY2xhc3MgTm90TG9nZ2VkRXhjZXB0aW9uXHJcbiAqIEBleHRlbmRzIHtFeGNlcHRpb259XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgTm90TG9nZ2VkRXhjZXB0aW9uIGV4dGVuZHMgRXhjZXB0aW9uIHtcclxuICBwdWJsaWMgaWQ6IHN0cmluZztcclxuXHJcbiAgY29uc3RydWN0b3IoaWQ6IHN0cmluZykge1xyXG4gICAgc3VwZXIoYEFjdGlvbiBub3QgbG9nZ2VkOiAke2lkfWApO1xyXG4gICAgdGhpcy5pZCA9IGlkO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEV4Y2VwdGlvbiByYWlzZWQgd2hlbiBhIHZhbHVlIGlzIG91dHNpZGUgYW4gYWxsb3dlZCByYW5nZS5cclxuICogXHJcbiAqIEBleHBvcnRcclxuICogQGNsYXNzIE91dE9mUmFuZ2VFeGNlcHRpb25cclxuICogQGV4dGVuZHMge0V4Y2VwdGlvbn1cclxuICovXHJcbmV4cG9ydCBjbGFzcyBPdXRPZlJhbmdlRXhjZXB0aW9uIGV4dGVuZHMgRXhjZXB0aW9uIHtcclxuICBwdWJsaWMgdmFsdWU6IG51bWJlcjtcclxuXHJcbiAgY29uc3RydWN0b3IodmFsdWU6IG51bWJlcikge1xyXG4gICAgc3VwZXIoYE91dCBvZiByYW5nZTogJHt2YWx1ZX1gKTtcclxuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcclxuICB9XHJcbn1cclxuIl19