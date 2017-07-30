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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZXJ0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3JjL2Fzc2VydC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxBQU1HOzs7Ozs7O0FBQ0gsZ0JBQXVCLEFBQW1CLGFBQUUsQUFBYSxNQUN2RCxBQUFFLEFBQUM7UUFBQyxDQUFDLEFBQUksQUFBQyxNQUFDLEFBQUMsQUFBQztjQUFNLElBQUksQUFBSyxNQUFDLEFBQW9CLHVCQUFHLEFBQVcsQUFBQyxBQUFDLEFBQUMsQUFBQyxBQUNyRTtBQUFDOztBQUZELGlCQUVDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIFRocm93IGFuIGV4Y2VwdGlvbiBpZiBgdGVzdGAgaXMgbm90IHRydXRoeS5cclxuICogXHJcbiAqIEBleHBvcnRcclxuICogQHBhcmFtIHtzdHJpbmd9IGRlc2NyaXB0aW9uIERlc2NyaXB0aW9uIG9mIHRoZSBlcnJvciB0aHJvd25cclxuICogQHBhcmFtIHtib29sZWFufSB0ZXN0IFZhbHVlIHRoYXQgc2hvdWxkIGJlIHRydXRoeSBmb3IgYXNzZXJ0aW9uIHRvIHBhc3NcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBhc3NlcnQoZGVzY3JpcHRpb246IHN0cmluZywgdGVzdDogYm9vbGVhbik6IHZvaWQge1xyXG4gIGlmICghdGVzdCkgeyB0aHJvdyBuZXcgRXJyb3IoJ0Fzc2VydGlvbiBmYWlsZWQ6ICcgKyBkZXNjcmlwdGlvbik7IH1cclxufVxyXG4iXX0=