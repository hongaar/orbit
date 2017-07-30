"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Throw an exception if `test` is not truthy.
 *
 * @export
 * @param {string} description Description of the error thrown
 * @param {boolean} test Value that should be truthy for assertion to pass
 */
function assert(description, test) {
    if (!test) {
        throw new Error('Assertion failed: ' + description);
    }
}
exports.assert = assert;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZXJ0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3JjL2Fzc2VydC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxBQU1HOzs7Ozs7O0FBQ0gsZ0JBQXVCLEFBQW1CLGFBQUUsQUFBYTtBQUN2RCxBQUFFLEFBQUMsUUFBQyxDQUFDLEFBQUksQUFBQyxNQUFDLEFBQUM7QUFBQyxjQUFNLElBQUksQUFBSyxNQUFDLEFBQW9CLHVCQUFHLEFBQVcsQUFBQyxBQUFDLEFBQUM7QUFBQyxBQUNyRTtBQUFDO0FBRkQsaUJBRUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogVGhyb3cgYW4gZXhjZXB0aW9uIGlmIGB0ZXN0YCBpcyBub3QgdHJ1dGh5LlxyXG4gKiBcclxuICogQGV4cG9ydFxyXG4gKiBAcGFyYW0ge3N0cmluZ30gZGVzY3JpcHRpb24gRGVzY3JpcHRpb24gb2YgdGhlIGVycm9yIHRocm93blxyXG4gKiBAcGFyYW0ge2Jvb2xlYW59IHRlc3QgVmFsdWUgdGhhdCBzaG91bGQgYmUgdHJ1dGh5IGZvciBhc3NlcnRpb24gdG8gcGFzc1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydChkZXNjcmlwdGlvbjogc3RyaW5nLCB0ZXN0OiBib29sZWFuKTogdm9pZCB7XHJcbiAgaWYgKCF0ZXN0KSB7IHRocm93IG5ldyBFcnJvcignQXNzZXJ0aW9uIGZhaWxlZDogJyArIGRlc2NyaXB0aW9uKTsgfVxyXG59XHJcbiJdfQ==