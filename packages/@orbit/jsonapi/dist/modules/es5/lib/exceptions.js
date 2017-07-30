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
var InvalidServerResponse = function (_super) {
    __extends(InvalidServerResponse, _super);
    function InvalidServerResponse(response) {
        var _this = _super.call(this, "Invalid server response: " + response) || this;
        _this.response = response;
        return _this;
    }
    return InvalidServerResponse;
}(core_1.Exception);
exports.InvalidServerResponse = InvalidServerResponse;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhjZXB0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9saWIvZXhjZXB0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHFCQUF3QztBQUV4QztBQUEyQyxxQ0FBUztBQUdsRCxtQ0FBWSxBQUFnQjtBQUE1QixvQkFDRSxrQkFBTSw4QkFBNEIsQUFBVSxBQUFDLGFBRTlDO0FBREMsQUFBSSxjQUFDLEFBQVEsV0FBRyxBQUFRLEFBQUM7ZUFDM0I7QUFBQztBQUNILFdBQUMsQUFBRDtBQVBBLEFBT0MsRUFQMEMsT0FBUyxBQU9uRDtBQVBZLGdDQUFxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEV4Y2VwdGlvbiB9IGZyb20gJ0BvcmJpdC9jb3JlJztcclxuXHJcbmV4cG9ydCBjbGFzcyBJbnZhbGlkU2VydmVyUmVzcG9uc2UgZXh0ZW5kcyBFeGNlcHRpb24ge1xyXG4gIHB1YmxpYyByZXNwb25zZTogc3RyaW5nO1xyXG5cclxuICBjb25zdHJ1Y3RvcihyZXNwb25zZTogc3RyaW5nKSB7XHJcbiAgICBzdXBlcihgSW52YWxpZCBzZXJ2ZXIgcmVzcG9uc2U6ICR7cmVzcG9uc2V9YCk7XHJcbiAgICB0aGlzLnJlc3BvbnNlID0gcmVzcG9uc2U7XHJcbiAgfVxyXG59XHJcbiJdfQ==