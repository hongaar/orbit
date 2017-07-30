"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@orbit/utils");
function buildFetchSettings(options, settings) {
    if (settings === void 0) {
        settings = {};
    }
    for (var _i = 0, _a = ['filter', 'include', 'page', 'sort']; _i < _a.length; _i++) {
        var param = _a[_i];
        if (options[param]) {
            utils_1.deepSet(settings, ['params', param], options[param]);
        }
    }
    if (options.timeout) {
        settings.timeout = options.timeout;
    }
    return settings;
}
exports.buildFetchSettings = buildFetchSettings;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVxdWVzdC1zZXR0aW5ncy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9saWIvcmVxdWVzdC1zZXR0aW5ncy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxzQkFBdUM7QUFXdkMsNEJBQW1DLEFBQXVCLFNBQUUsQUFBNEI7QUFBNUIsNkJBQUE7QUFBQSxtQkFBNEI7O0FBQ3RGLEFBQUcsQUFBQyxTQUFnQixTQUFxQyxHQUFyQyxNQUFDLEFBQVEsVUFBRSxBQUFTLFdBQUUsQUFBTSxRQUFFLEFBQU0sQUFBQyxTQUFyQyxRQUFxQyxRQUFyQyxBQUFxQztBQUFwRCxZQUFNLEFBQUssV0FBQTtBQUNkLEFBQUUsQUFBQyxZQUFDLEFBQU8sUUFBQyxBQUFLLEFBQUMsQUFBQyxRQUFDLEFBQUM7QUFDbkIsb0JBQU8sUUFBQyxBQUFRLFVBQUUsQ0FBQyxBQUFRLFVBQUUsQUFBSyxBQUFDLFFBQUUsQUFBTyxRQUFDLEFBQUssQUFBQyxBQUFDLEFBQUMsQUFDdkQ7QUFBQztBQUNGO0FBRUQsQUFBRSxBQUFDLFFBQUMsQUFBTyxRQUFDLEFBQU8sQUFBQyxTQUFDLEFBQUM7QUFDcEIsQUFBUSxpQkFBQyxBQUFPLFVBQUcsQUFBTyxRQUFDLEFBQU8sQUFBQyxBQUNyQztBQUFDO0FBRUQsQUFBTSxXQUFDLEFBQVEsQUFBQyxBQUNsQjtBQUFDO0FBWkQsNkJBWUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBkZWVwU2V0IH0gZnJvbSAnQG9yYml0L3V0aWxzJztcclxuaW1wb3J0IHsgRmV0Y2hTZXR0aW5ncyB9IGZyb20gJy4uL2pzb25hcGktc291cmNlJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgUmVxdWVzdE9wdGlvbnMge1xyXG4gIGZpbHRlcj86IGFueTtcclxuICBzb3J0PzogYW55O1xyXG4gIHBhZ2U/OiBhbnk7XHJcbiAgaW5jbHVkZT86IGFueTtcclxuICB0aW1lb3V0PzogbnVtYmVyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRGZXRjaFNldHRpbmdzKG9wdGlvbnM6IFJlcXVlc3RPcHRpb25zLCBzZXR0aW5nczogRmV0Y2hTZXR0aW5ncyA9IHt9KTogRmV0Y2hTZXR0aW5ncyB7XHJcbiAgZm9yIChjb25zdCBwYXJhbSBvZiBbJ2ZpbHRlcicsICdpbmNsdWRlJywgJ3BhZ2UnLCAnc29ydCddKSB7XHJcbiAgICBpZiAob3B0aW9uc1twYXJhbV0pIHtcclxuICAgICAgZGVlcFNldChzZXR0aW5ncywgWydwYXJhbXMnLCBwYXJhbV0sIG9wdGlvbnNbcGFyYW1dKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlmIChvcHRpb25zLnRpbWVvdXQpIHtcclxuICAgIHNldHRpbmdzLnRpbWVvdXQgPSBvcHRpb25zLnRpbWVvdXQ7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gc2V0dGluZ3M7XHJcbn1cclxuIl19