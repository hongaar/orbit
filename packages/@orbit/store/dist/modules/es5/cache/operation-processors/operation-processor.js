"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Operation processors are used to identify operations that should be performed
 * together to ensure that a `Cache` or other container of data remains
 * consistent and correct.
 *
 * `OperationProcessor` is an abstract base class to be extended by specific
 * operation processors.
 *
 * @export
 * @abstract
 * @class OperationProcessor
 */
var OperationProcessor = function () {
  /**
   * Creates an instance of OperationProcessor.
   *
   * @param {Cache} cache
   * @memberof OperationProcessor
   */
  function OperationProcessor(cache) {
    this._cache = cache;
  }
  Object.defineProperty(OperationProcessor.prototype, "cache", {
    /**
     * The `Cache` that is monitored.
     *
     * @readonly
     * @memberof OperationProcessor
     */
    get: function () {
      return this._cache;
    },
    enumerable: true,
    configurable: true
  });
  /**
   * Called when all the data in a cache has been reset.
   *
   * If `base` is included, the cache is being reset to match a base cache.
   *
   * @param {Cache} [base]
   * @memberof OperationProcessor
   */
  OperationProcessor.prototype.reset = function (base) {};
  /**
   * Called before an `operation` has been applied.
   *
   * Returns an array of operations to be applied **BEFORE** the `operation`
   * itself is applied.
   *
   * @param {RecordOperation} operation
   * @returns {RecordOperation[]}
   * @memberof OperationProcessor
   */
  OperationProcessor.prototype.before = function (operation) {
    return [];
  };
  /**
   * Called before an `operation` has been applied.
   *
   * Returns an array of operations to be applied **AFTER** the `operation`
   * has been applied successfully.
   *
   * @param {RecordOperation} operation
   * @returns {RecordOperation[]}
   * @memberof OperationProcessor
   */
  OperationProcessor.prototype.after = function (operation) {
    return [];
  };
  /**
   * Called immediately after an `operation` has been applied and before the
   * `patch` event has been emitted (i.e. before any listeners have been
   * notified that the operation was applied).
   *
   * No operations may be returned.
   *
   * @param {RecordOperation} operation
   * @memberof OperationProcessor
   */
  OperationProcessor.prototype.immediate = function (operation) {};
  /**
   * Called after an `operation` _and_ any related operations have been applied.
   *
   * Returns an array of operations to be applied **AFTER** the `operation`
   * itself and any operations returned from the `after` hook have been applied.
   *
   * @param {RecordOperation} operation
   * @returns {RecordOperation[]}
   * @memberof OperationProcessor
   */
  OperationProcessor.prototype.finally = function (operation) {
    return [];
  };
  return OperationProcessor;
}();
exports.OperationProcessor = OperationProcessor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3BlcmF0aW9uLXByb2Nlc3Nvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jYWNoZS9vcGVyYXRpb24tcHJvY2Vzc29ycy9vcGVyYXRpb24tcHJvY2Vzc29yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQU9BLEFBV0c7Ozs7Ozs7Ozs7OztBQUNIO0FBYUUsQUFLRzs7Ozs7O0FBQ0gsOEJBQVksQUFBWTtBQUN0QixBQUFJLFNBQUMsQUFBTSxTQUFHLEFBQUssQUFBQyxBQUN0QjtBQUFDO0FBWkQsd0JBQUksOEJBQUs7QUFOVCxBQUtHOzs7Ozs7U0FDSDtBQUNFLEFBQU0sYUFBQyxBQUFJLEtBQUMsQUFBTSxBQUFDLEFBQ3JCO0FBQUM7O2tCQUFBOztBQVlELEFBT0c7Ozs7Ozs7O0FBQ0gsK0JBQUssUUFBTCxVQUFNLEFBQVksTUFBUyxDQUFDO0FBRTVCLEFBU0c7Ozs7Ozs7Ozs7QUFDSCwrQkFBTSxTQUFOLFVBQU8sQUFBMEI7QUFDL0IsQUFBTSxXQUFDLEFBQUUsQUFBQyxBQUNaO0FBQUM7QUFFRCxBQVNHOzs7Ozs7Ozs7O0FBQ0gsK0JBQUssUUFBTCxVQUFNLEFBQTBCO0FBQzlCLEFBQU0sV0FBQyxBQUFFLEFBQUMsQUFDWjtBQUFDO0FBRUQsQUFTRzs7Ozs7Ozs7OztBQUNILCtCQUFTLFlBQVQsVUFBVSxBQUEwQixXQUNwQyxDQUFDO0FBRUQsQUFTRzs7Ozs7Ozs7OztBQUNILCtCQUFPLFVBQVAsVUFBUSxBQUEwQjtBQUNoQyxBQUFNLFdBQUMsQUFBRSxBQUFDLEFBQ1o7QUFBQztBQUNILFNBQUMsQUFBRDtBQXZGQSxBQXVGQztBQXZGcUIsNkJBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENhY2hlIGZyb20gJy4uLy4uL2NhY2hlJztcclxuaW1wb3J0IHsgUmVjb3JkT3BlcmF0aW9uIH0gZnJvbSAnQG9yYml0L2RhdGEnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBPcGVyYXRpb25Qcm9jZXNzb3JDbGFzcyB7XHJcbiAgbmV3IChjYWNoZTogQ2FjaGUpOiBPcGVyYXRpb25Qcm9jZXNzb3I7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBPcGVyYXRpb24gcHJvY2Vzc29ycyBhcmUgdXNlZCB0byBpZGVudGlmeSBvcGVyYXRpb25zIHRoYXQgc2hvdWxkIGJlIHBlcmZvcm1lZFxyXG4gKiB0b2dldGhlciB0byBlbnN1cmUgdGhhdCBhIGBDYWNoZWAgb3Igb3RoZXIgY29udGFpbmVyIG9mIGRhdGEgcmVtYWluc1xyXG4gKiBjb25zaXN0ZW50IGFuZCBjb3JyZWN0LlxyXG4gKlxyXG4gKiBgT3BlcmF0aW9uUHJvY2Vzc29yYCBpcyBhbiBhYnN0cmFjdCBiYXNlIGNsYXNzIHRvIGJlIGV4dGVuZGVkIGJ5IHNwZWNpZmljXHJcbiAqIG9wZXJhdGlvbiBwcm9jZXNzb3JzLlxyXG4gKlxyXG4gKiBAZXhwb3J0XHJcbiAqIEBhYnN0cmFjdFxyXG4gKiBAY2xhc3MgT3BlcmF0aW9uUHJvY2Vzc29yXHJcbiAqL1xyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgT3BlcmF0aW9uUHJvY2Vzc29yIHtcclxuICBwcml2YXRlIF9jYWNoZTogQ2FjaGU7XHJcblxyXG4gIC8qKlxyXG4gICAqIFRoZSBgQ2FjaGVgIHRoYXQgaXMgbW9uaXRvcmVkLlxyXG4gICAqXHJcbiAgICogQHJlYWRvbmx5XHJcbiAgICogQG1lbWJlcm9mIE9wZXJhdGlvblByb2Nlc3NvclxyXG4gICAqL1xyXG4gIGdldCBjYWNoZSgpIHtcclxuICAgIHJldHVybiB0aGlzLl9jYWNoZTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgT3BlcmF0aW9uUHJvY2Vzc29yLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtDYWNoZX0gY2FjaGVcclxuICAgKiBAbWVtYmVyb2YgT3BlcmF0aW9uUHJvY2Vzc29yXHJcbiAgICovXHJcbiAgY29uc3RydWN0b3IoY2FjaGU6IENhY2hlKSB7XHJcbiAgICB0aGlzLl9jYWNoZSA9IGNhY2hlO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ2FsbGVkIHdoZW4gYWxsIHRoZSBkYXRhIGluIGEgY2FjaGUgaGFzIGJlZW4gcmVzZXQuXHJcbiAgICpcclxuICAgKiBJZiBgYmFzZWAgaXMgaW5jbHVkZWQsIHRoZSBjYWNoZSBpcyBiZWluZyByZXNldCB0byBtYXRjaCBhIGJhc2UgY2FjaGUuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge0NhY2hlfSBbYmFzZV1cclxuICAgKiBAbWVtYmVyb2YgT3BlcmF0aW9uUHJvY2Vzc29yXHJcbiAgICovXHJcbiAgcmVzZXQoYmFzZT86IENhY2hlKTogdm9pZCB7fVxyXG5cclxuICAvKipcclxuICAgKiBDYWxsZWQgYmVmb3JlIGFuIGBvcGVyYXRpb25gIGhhcyBiZWVuIGFwcGxpZWQuXHJcbiAgICpcclxuICAgKiBSZXR1cm5zIGFuIGFycmF5IG9mIG9wZXJhdGlvbnMgdG8gYmUgYXBwbGllZCAqKkJFRk9SRSoqIHRoZSBgb3BlcmF0aW9uYFxyXG4gICAqIGl0c2VsZiBpcyBhcHBsaWVkLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtSZWNvcmRPcGVyYXRpb259IG9wZXJhdGlvblxyXG4gICAqIEByZXR1cm5zIHtSZWNvcmRPcGVyYXRpb25bXX1cclxuICAgKiBAbWVtYmVyb2YgT3BlcmF0aW9uUHJvY2Vzc29yXHJcbiAgICovXHJcbiAgYmVmb3JlKG9wZXJhdGlvbjogUmVjb3JkT3BlcmF0aW9uKTogUmVjb3JkT3BlcmF0aW9uW10ge1xyXG4gICAgcmV0dXJuIFtdO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ2FsbGVkIGJlZm9yZSBhbiBgb3BlcmF0aW9uYCBoYXMgYmVlbiBhcHBsaWVkLlxyXG4gICAqXHJcbiAgICogUmV0dXJucyBhbiBhcnJheSBvZiBvcGVyYXRpb25zIHRvIGJlIGFwcGxpZWQgKipBRlRFUioqIHRoZSBgb3BlcmF0aW9uYFxyXG4gICAqIGhhcyBiZWVuIGFwcGxpZWQgc3VjY2Vzc2Z1bGx5LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtSZWNvcmRPcGVyYXRpb259IG9wZXJhdGlvblxyXG4gICAqIEByZXR1cm5zIHtSZWNvcmRPcGVyYXRpb25bXX1cclxuICAgKiBAbWVtYmVyb2YgT3BlcmF0aW9uUHJvY2Vzc29yXHJcbiAgICovXHJcbiAgYWZ0ZXIob3BlcmF0aW9uOiBSZWNvcmRPcGVyYXRpb24pOiBSZWNvcmRPcGVyYXRpb25bXSB7XHJcbiAgICByZXR1cm4gW107XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDYWxsZWQgaW1tZWRpYXRlbHkgYWZ0ZXIgYW4gYG9wZXJhdGlvbmAgaGFzIGJlZW4gYXBwbGllZCBhbmQgYmVmb3JlIHRoZVxyXG4gICAqIGBwYXRjaGAgZXZlbnQgaGFzIGJlZW4gZW1pdHRlZCAoaS5lLiBiZWZvcmUgYW55IGxpc3RlbmVycyBoYXZlIGJlZW5cclxuICAgKiBub3RpZmllZCB0aGF0IHRoZSBvcGVyYXRpb24gd2FzIGFwcGxpZWQpLlxyXG4gICAqXHJcbiAgICogTm8gb3BlcmF0aW9ucyBtYXkgYmUgcmV0dXJuZWQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge1JlY29yZE9wZXJhdGlvbn0gb3BlcmF0aW9uXHJcbiAgICogQG1lbWJlcm9mIE9wZXJhdGlvblByb2Nlc3NvclxyXG4gICAqL1xyXG4gIGltbWVkaWF0ZShvcGVyYXRpb246IFJlY29yZE9wZXJhdGlvbik6IHZvaWQge1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ2FsbGVkIGFmdGVyIGFuIGBvcGVyYXRpb25gIF9hbmRfIGFueSByZWxhdGVkIG9wZXJhdGlvbnMgaGF2ZSBiZWVuIGFwcGxpZWQuXHJcbiAgICpcclxuICAgKiBSZXR1cm5zIGFuIGFycmF5IG9mIG9wZXJhdGlvbnMgdG8gYmUgYXBwbGllZCAqKkFGVEVSKiogdGhlIGBvcGVyYXRpb25gXHJcbiAgICogaXRzZWxmIGFuZCBhbnkgb3BlcmF0aW9ucyByZXR1cm5lZCBmcm9tIHRoZSBgYWZ0ZXJgIGhvb2sgaGF2ZSBiZWVuIGFwcGxpZWQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge1JlY29yZE9wZXJhdGlvbn0gb3BlcmF0aW9uXHJcbiAgICogQHJldHVybnMge1JlY29yZE9wZXJhdGlvbltdfVxyXG4gICAqIEBtZW1iZXJvZiBPcGVyYXRpb25Qcm9jZXNzb3JcclxuICAgKi9cclxuICBmaW5hbGx5KG9wZXJhdGlvbjogUmVjb3JkT3BlcmF0aW9uKTogUmVjb3JkT3BlcmF0aW9uW10ge1xyXG4gICAgcmV0dXJuIFtdO1xyXG4gIH1cclxufVxyXG4iXX0=