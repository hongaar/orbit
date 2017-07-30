"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@orbit/utils");
function buildFetchSettings(options, settings) {
    if (settings === void 0) { settings = {}; }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVxdWVzdC1zZXR0aW5ncy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9saWIvcmVxdWVzdC1zZXR0aW5ncy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUF1QztBQVd2Qyw0QkFBbUMsT0FBdUIsRUFBRSxRQUE0QjtJQUE1Qix5QkFBQSxFQUFBLGFBQTRCO0lBQ3RGLEdBQUcsQ0FBQyxDQUFnQixVQUFxQyxFQUFyQyxNQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxFQUFyQyxjQUFxQyxFQUFyQyxJQUFxQztRQUFwRCxJQUFNLEtBQUssU0FBQTtRQUNkLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkIsZUFBTyxDQUFDLFFBQVEsRUFBRSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUN2RCxDQUFDO0tBQ0Y7SUFFRCxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUNwQixRQUFRLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUM7SUFDckMsQ0FBQztJQUVELE1BQU0sQ0FBQyxRQUFRLENBQUM7QUFDbEIsQ0FBQztBQVpELGdEQVlDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZGVlcFNldCB9IGZyb20gJ0BvcmJpdC91dGlscyc7XHJcbmltcG9ydCB7IEZldGNoU2V0dGluZ3MgfSBmcm9tICcuLi9qc29uYXBpLXNvdXJjZSc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFJlcXVlc3RPcHRpb25zIHtcclxuICBmaWx0ZXI/OiBhbnk7XHJcbiAgc29ydD86IGFueTtcclxuICBwYWdlPzogYW55O1xyXG4gIGluY2x1ZGU/OiBhbnk7XHJcbiAgdGltZW91dD86IG51bWJlcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkRmV0Y2hTZXR0aW5ncyhvcHRpb25zOiBSZXF1ZXN0T3B0aW9ucywgc2V0dGluZ3M6IEZldGNoU2V0dGluZ3MgPSB7fSk6IEZldGNoU2V0dGluZ3Mge1xyXG4gIGZvciAoY29uc3QgcGFyYW0gb2YgWydmaWx0ZXInLCAnaW5jbHVkZScsICdwYWdlJywgJ3NvcnQnXSkge1xyXG4gICAgaWYgKG9wdGlvbnNbcGFyYW1dKSB7XHJcbiAgICAgIGRlZXBTZXQoc2V0dGluZ3MsIFsncGFyYW1zJywgcGFyYW1dLCBvcHRpb25zW3BhcmFtXSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpZiAob3B0aW9ucy50aW1lb3V0KSB7XHJcbiAgICBzZXR0aW5ncy50aW1lb3V0ID0gb3B0aW9ucy50aW1lb3V0O1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHNldHRpbmdzO1xyXG59XHJcbiJdfQ==