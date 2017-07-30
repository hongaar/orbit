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
var utils_1 = require("@orbit/utils");
var SyncStrategy = function (_super) {
    __extends(SyncStrategy, _super);
    function SyncStrategy(options) {
        var _this = this;
        var opts = options;
        utils_1.assert('A `source` must be specified for a SyncStrategy', !!opts.source);
        utils_1.assert('A `target` must be specified for a SyncStrategy', !!opts.target);
        utils_1.assert('`source` should be a Source name specified as a string', typeof opts.source === 'string');
        utils_1.assert('`target` should be a Source name specified as a string', typeof opts.target === 'string');
        opts.on = opts.on || 'transform';
        opts.action = opts.action || 'sync';
        _this = _super.call(this, opts) || this;
        return _this;
    }
    return SyncStrategy;
}(connection_strategy_1.ConnectionStrategy);
exports.SyncStrategy = SyncStrategy;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3luYy1zdHJhdGVneS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9zdHJhdGVnaWVzL3N5bmMtc3RyYXRlZ3kudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxvQ0FBc0Y7QUFDdEYsc0JBQXNDO0FBb0R0QztBQUFrQyw0QkFBa0I7QUFDbEQsMEJBQVksQUFBNEI7QUFBeEMsb0JBU0M7QUFSQyxZQUFJLEFBQUksT0FBRyxBQUFvQyxBQUFDO0FBQ2hELGdCQUFNLE9BQUMsQUFBaUQsbURBQUUsQ0FBQyxDQUFDLEFBQUksS0FBQyxBQUFNLEFBQUMsQUFBQztBQUN6RSxnQkFBTSxPQUFDLEFBQWlELG1EQUFFLENBQUMsQ0FBQyxBQUFJLEtBQUMsQUFBTSxBQUFDLEFBQUM7QUFDekUsZ0JBQU0sT0FBQyxBQUF3RCwwREFBRSxPQUFPLEFBQUksS0FBQyxBQUFNLFdBQUssQUFBUSxBQUFDLEFBQUM7QUFDbEcsZ0JBQU0sT0FBQyxBQUF3RCwwREFBRSxPQUFPLEFBQUksS0FBQyxBQUFNLFdBQUssQUFBUSxBQUFDLEFBQUM7QUFDbEcsQUFBSSxhQUFDLEFBQUUsS0FBRyxBQUFJLEtBQUMsQUFBRSxNQUFJLEFBQVcsQUFBQztBQUNqQyxBQUFJLGFBQUMsQUFBTSxTQUFHLEFBQUksS0FBQyxBQUFNLFVBQUksQUFBTSxBQUFDO0FBQ3BDLGdCQUFBLGtCQUFNLEFBQUksQUFBQyxTQUFDO2VBQ2Q7QUFBQztBQUNILFdBQUMsQUFBRDtBQVhBLEFBV0MsRUFYaUMsc0JBQWtCLEFBV25EO0FBWFksdUJBQVkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ29vcmRpbmF0b3IsIHsgQWN0aXZhdGlvbk9wdGlvbnMsIExvZ0xldmVsIH0gZnJvbSAnLi4vY29vcmRpbmF0b3InO1xyXG5pbXBvcnQgeyBTdHJhdGVneU9wdGlvbnMgfSBmcm9tICcuLi9zdHJhdGVneSc7XHJcbmltcG9ydCB7IENvbm5lY3Rpb25TdHJhdGVneSwgQ29ubmVjdGlvblN0cmF0ZWd5T3B0aW9ucyB9IGZyb20gJy4vY29ubmVjdGlvbi1zdHJhdGVneSc7XHJcbmltcG9ydCB7IGFzc2VydCB9IGZyb20gJ0BvcmJpdC91dGlscyc7XHJcblxyXG5kZWNsYXJlIGNvbnN0IGNvbnNvbGU6IGFueTtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgU3luY1N0cmF0ZWd5T3B0aW9ucyBleHRlbmRzIFN0cmF0ZWd5T3B0aW9ucyB7XHJcbiAgLyoqXHJcbiAgICogVGhlIG5hbWUgb2YgdGhlIHNvdXJjZSB0byBiZSBvYnNlcnZlZC5cclxuICAgKlxyXG4gICAqIEB0eXBlIHtzdHJpbmd9XHJcbiAgICogQG1lbWJlck9mIFN5bmNTdHJhdGVneU9wdGlvbnNcclxuICAgKi9cclxuICBzb3VyY2U6IHN0cmluZztcclxuXHJcbiAgLyoqXHJcbiAgICogVGhlIG5hbWUgb2YgdGhlIHNvdXJjZSB3aGljaCB3aWxsIGJlIGFjdGVkIHVwb24uXHJcbiAgICpcclxuICAgKiBAdHlwZSB7c3RyaW5nfVxyXG4gICAqIEBtZW1iZXJPZiBTeW5jU3RyYXRlZ3lPcHRpb25zXHJcbiAgICovXHJcbiAgdGFyZ2V0OiBzdHJpbmc7XHJcblxyXG4gIC8qKlxyXG4gICAqIEEgaGFuZGxlciBmb3IgYW55IGVycm9ycyB0aHJvd24gYXMgYSByZXN1bHQgb2YgdGhlIHN5bmMgb3BlcmF0aW9uLlxyXG4gICAqXHJcbiAgICogQHR5cGUge0Z1bmN0aW9ufVxyXG4gICAqIEBtZW1iZXJPZiBTeW5jU3RyYXRlZ3lPcHRpb25zXHJcbiAgICovXHJcbiAgY2F0Y2g/OiBGdW5jdGlvbjtcclxuXHJcbiAgLyoqXHJcbiAgICogQSBmaWx0ZXIgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGB0cnVlYCBpZiB0aGUgc3luYyBzaG91bGQgYmUgcGVyZm9ybWVkLlxyXG4gICAqXHJcbiAgICogYGZpbHRlcmAgd2lsbCBiZSBpbnZva2VkIGluIHRoZSBjb250ZXh0IG9mIHRoaXMgc3RyYXRlZ3kgKGFuZCB0aHVzIHdpbGxcclxuICAgKiBoYXZlIGFjY2VzcyB0byBib3RoIGB0aGlzLnNvdXJjZWAgYW5kIGB0aGlzLnRhcmdldGApLlxyXG4gICAqXHJcbiAgICogQHR5cGUge0Z1bmN0aW9ufVxyXG4gICAqIEBtZW1iZXJPZiBTeW5jU3RyYXRlZ3lPcHRpb25zc1xyXG4gICAqL1xyXG4gIGZpbHRlcj86IEZ1bmN0aW9uO1xyXG5cclxuICAvKipcclxuICAgKiBTaG91bGQgcmVzb2x1dGlvbiBvZiB0aGUgdGFyZ2V0J3MgYHN5bmNgIGJsb2NrIHRoZSBjb21wbGV0aW9uIG9mIHRoZVxyXG4gICAqIHNvdXJjZSdzIGB0cmFuc2Zvcm1gP1xyXG4gICAqXHJcbiAgICogQnkgZGVmYXVsdCwgYGJsb2NraW5nYCBpcyBmYWxzZS5cclxuICAgKlxyXG4gICAqIEB0eXBlIHtib29sZWFufVxyXG4gICAqIEBtZW1iZXJPZiBTeW5jU3RyYXRlZ3lPcHRpb25zc1xyXG4gICAqL1xyXG4gIGJsb2NraW5nPzogYm9vbGVhbjtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFN5bmNTdHJhdGVneSBleHRlbmRzIENvbm5lY3Rpb25TdHJhdGVneSB7XHJcbiAgY29uc3RydWN0b3Iob3B0aW9uczogU3luY1N0cmF0ZWd5T3B0aW9ucykge1xyXG4gICAgbGV0IG9wdHMgPSBvcHRpb25zIGFzIENvbm5lY3Rpb25TdHJhdGVneU9wdGlvbnM7XHJcbiAgICBhc3NlcnQoJ0EgYHNvdXJjZWAgbXVzdCBiZSBzcGVjaWZpZWQgZm9yIGEgU3luY1N0cmF0ZWd5JywgISFvcHRzLnNvdXJjZSk7XHJcbiAgICBhc3NlcnQoJ0EgYHRhcmdldGAgbXVzdCBiZSBzcGVjaWZpZWQgZm9yIGEgU3luY1N0cmF0ZWd5JywgISFvcHRzLnRhcmdldCk7XHJcbiAgICBhc3NlcnQoJ2Bzb3VyY2VgIHNob3VsZCBiZSBhIFNvdXJjZSBuYW1lIHNwZWNpZmllZCBhcyBhIHN0cmluZycsIHR5cGVvZiBvcHRzLnNvdXJjZSA9PT0gJ3N0cmluZycpO1xyXG4gICAgYXNzZXJ0KCdgdGFyZ2V0YCBzaG91bGQgYmUgYSBTb3VyY2UgbmFtZSBzcGVjaWZpZWQgYXMgYSBzdHJpbmcnLCB0eXBlb2Ygb3B0cy50YXJnZXQgPT09ICdzdHJpbmcnKTtcclxuICAgIG9wdHMub24gPSBvcHRzLm9uIHx8ICd0cmFuc2Zvcm0nO1xyXG4gICAgb3B0cy5hY3Rpb24gPSBvcHRzLmFjdGlvbiB8fCAnc3luYyc7XHJcbiAgICBzdXBlcihvcHRzKTtcclxuICB9XHJcbn1cclxuIl19