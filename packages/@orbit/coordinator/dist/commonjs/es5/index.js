"use strict";

function __export(m) {
    for (var p in m) {
        if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
var coordinator_1 = require("./coordinator");
exports.default = coordinator_1.default;
exports.LogLevel = coordinator_1.LogLevel;
__export(require("./strategy"));
__export(require("./strategies/log-truncation-strategy"));
__export(require("./strategies/event-logging-strategy"));
__export(require("./strategies/connection-strategy"));
__export(require("./strategies/request-strategy"));
__export(require("./strategies/sync-strategy"));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSw0QkFBeUY7QUFBaEYsZ0NBQUEsQUFBTztBQUF5QyxpQ0FBQSxBQUFRO0FBQ2pFLGlCQUEyQjtBQUMzQixpQkFBcUQ7QUFDckQsaUJBQW9EO0FBQ3BELGlCQUFpRDtBQUNqRCxpQkFBOEM7QUFDOUMsaUJBQTJDIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IHsgZGVmYXVsdCwgQ29vcmRpbmF0b3JPcHRpb25zLCBBY3RpdmF0aW9uT3B0aW9ucywgTG9nTGV2ZWwgfSBmcm9tICcuL2Nvb3JkaW5hdG9yJztcclxuZXhwb3J0ICogZnJvbSAnLi9zdHJhdGVneSc7XHJcbmV4cG9ydCAqIGZyb20gJy4vc3RyYXRlZ2llcy9sb2ctdHJ1bmNhdGlvbi1zdHJhdGVneSc7XHJcbmV4cG9ydCAqIGZyb20gJy4vc3RyYXRlZ2llcy9ldmVudC1sb2dnaW5nLXN0cmF0ZWd5JztcclxuZXhwb3J0ICogZnJvbSAnLi9zdHJhdGVnaWVzL2Nvbm5lY3Rpb24tc3RyYXRlZ3knO1xyXG5leHBvcnQgKiBmcm9tICcuL3N0cmF0ZWdpZXMvcmVxdWVzdC1zdHJhdGVneSc7XHJcbmV4cG9ydCAqIGZyb20gJy4vc3RyYXRlZ2llcy9zeW5jLXN0cmF0ZWd5JztcclxuIl19