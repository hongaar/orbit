"use strict";

var __extends = undefined && undefined.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVxdWVzdC1zdHJhdGVneS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9zdHJhdGVnaWVzL3JlcXVlc3Qtc3RyYXRlZ3kudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxvQ0FBc0Y7QUFJdEY7QUFBcUMsK0JBQWtCO0FBQ3JELDZCQUFZLEFBQStCO2VBQ3pDLGtCQUFNLEFBQU8sQUFBQyxZQUNoQjtBQUFDO0FBQ0gsV0FBQyxBQUFEO0FBSkEsQUFJQyxFQUpvQyxzQkFBa0IsQUFJdEQ7QUFKWSwwQkFBZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbm5lY3Rpb25TdHJhdGVneSwgQ29ubmVjdGlvblN0cmF0ZWd5T3B0aW9ucyB9IGZyb20gJy4vY29ubmVjdGlvbi1zdHJhdGVneSc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFJlcXVlc3RTdHJhdGVneU9wdGlvbnMgZXh0ZW5kcyBDb25uZWN0aW9uU3RyYXRlZ3lPcHRpb25zIHt9XHJcblxyXG5leHBvcnQgY2xhc3MgUmVxdWVzdFN0cmF0ZWd5IGV4dGVuZHMgQ29ubmVjdGlvblN0cmF0ZWd5IHtcclxuICBjb25zdHJ1Y3RvcihvcHRpb25zOiBSZXF1ZXN0U3RyYXRlZ3lPcHRpb25zKSB7XHJcbiAgICBzdXBlcihvcHRpb25zKTtcclxuICB9XHJcbn1cclxuIl19