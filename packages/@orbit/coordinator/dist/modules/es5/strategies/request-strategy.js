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
var connection_strategy_1 = require("./connection-strategy");
var RequestStrategy = function (_super) {
    __extends(RequestStrategy, _super);
    function RequestStrategy(options) {
        return _super.call(this, options) || this;
    }
    return RequestStrategy;
}(connection_strategy_1.ConnectionStrategy);
exports.RequestStrategy = RequestStrategy;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVxdWVzdC1zdHJhdGVneS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9zdHJhdGVnaWVzL3JlcXVlc3Qtc3RyYXRlZ3kudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxvQ0FBc0Y7QUFJdEY7QUFBcUMsK0JBQWtCO0FBQ3JELDZCQUFZLEFBQStCO2VBQ3pDLGtCQUFNLEFBQU8sQUFBQyxZQUNoQjtBQUFDO0FBQ0gsV0FBQyxBQUFEO0FBSkEsQUFJQyxFQUpvQyxzQkFBa0IsQUFJdEQ7QUFKWSwwQkFBZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbm5lY3Rpb25TdHJhdGVneSwgQ29ubmVjdGlvblN0cmF0ZWd5T3B0aW9ucyB9IGZyb20gJy4vY29ubmVjdGlvbi1zdHJhdGVneSc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFJlcXVlc3RTdHJhdGVneU9wdGlvbnMgZXh0ZW5kcyBDb25uZWN0aW9uU3RyYXRlZ3lPcHRpb25zIHt9XHJcblxyXG5leHBvcnQgY2xhc3MgUmVxdWVzdFN0cmF0ZWd5IGV4dGVuZHMgQ29ubmVjdGlvblN0cmF0ZWd5IHtcclxuICBjb25zdHJ1Y3RvcihvcHRpb25zOiBSZXF1ZXN0U3RyYXRlZ3lPcHRpb25zKSB7XHJcbiAgICBzdXBlcihvcHRpb25zKTtcclxuICB9XHJcbn1cclxuIl19