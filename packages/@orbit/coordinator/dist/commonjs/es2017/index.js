"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsNEJBQXlGO0FBQWhGLGdDQUFBLEFBQU87QUFBeUMsaUNBQUEsQUFBUTtBQUNqRSxpQkFBMkI7QUFDM0IsaUJBQXFEO0FBQ3JELGlCQUFvRDtBQUNwRCxpQkFBaUQ7QUFDakQsaUJBQThDO0FBQzlDLGlCQUEyQyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCB7IGRlZmF1bHQsIENvb3JkaW5hdG9yT3B0aW9ucywgQWN0aXZhdGlvbk9wdGlvbnMsIExvZ0xldmVsIH0gZnJvbSAnLi9jb29yZGluYXRvcic7XHJcbmV4cG9ydCAqIGZyb20gJy4vc3RyYXRlZ3knO1xyXG5leHBvcnQgKiBmcm9tICcuL3N0cmF0ZWdpZXMvbG9nLXRydW5jYXRpb24tc3RyYXRlZ3knO1xyXG5leHBvcnQgKiBmcm9tICcuL3N0cmF0ZWdpZXMvZXZlbnQtbG9nZ2luZy1zdHJhdGVneSc7XHJcbmV4cG9ydCAqIGZyb20gJy4vc3RyYXRlZ2llcy9jb25uZWN0aW9uLXN0cmF0ZWd5JztcclxuZXhwb3J0ICogZnJvbSAnLi9zdHJhdGVnaWVzL3JlcXVlc3Qtc3RyYXRlZ3knO1xyXG5leHBvcnQgKiBmcm9tICcuL3N0cmF0ZWdpZXMvc3luYy1zdHJhdGVneSc7XHJcbiJdfQ==