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
var connection_strategy_1 = require("./connection-strategy");
var RequestStrategy = (function (_super) {
    __extends(RequestStrategy, _super);
    function RequestStrategy(options) {
        return _super.call(this, options) || this;
    }
    return RequestStrategy;
}(connection_strategy_1.ConnectionStrategy));
exports.RequestStrategy = RequestStrategy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVxdWVzdC1zdHJhdGVneS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9zdHJhdGVnaWVzL3JlcXVlc3Qtc3RyYXRlZ3kudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsNkRBQXNGO0FBSXRGO0lBQXFDLG1DQUFrQjtJQUNyRCx5QkFBWSxPQUErQjtlQUN6QyxrQkFBTSxPQUFPLENBQUM7SUFDaEIsQ0FBQztJQUNILHNCQUFDO0FBQUQsQ0FBQyxBQUpELENBQXFDLHdDQUFrQixHQUl0RDtBQUpZLDBDQUFlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29ubmVjdGlvblN0cmF0ZWd5LCBDb25uZWN0aW9uU3RyYXRlZ3lPcHRpb25zIH0gZnJvbSAnLi9jb25uZWN0aW9uLXN0cmF0ZWd5JztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgUmVxdWVzdFN0cmF0ZWd5T3B0aW9ucyBleHRlbmRzIENvbm5lY3Rpb25TdHJhdGVneU9wdGlvbnMge31cclxuXHJcbmV4cG9ydCBjbGFzcyBSZXF1ZXN0U3RyYXRlZ3kgZXh0ZW5kcyBDb25uZWN0aW9uU3RyYXRlZ3kge1xyXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM6IFJlcXVlc3RTdHJhdGVneU9wdGlvbnMpIHtcclxuICAgIHN1cGVyKG9wdGlvbnMpO1xyXG4gIH1cclxufVxyXG4iXX0=