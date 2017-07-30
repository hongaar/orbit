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
var OperationProcessor = (function () {
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
    OperationProcessor.prototype.reset = function (base) { };
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
    OperationProcessor.prototype.immediate = function (operation) {
    };
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
}());
exports.OperationProcessor = OperationProcessor;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3BlcmF0aW9uLXByb2Nlc3Nvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jYWNoZS9vcGVyYXRpb24tcHJvY2Vzc29ycy9vcGVyYXRpb24tcHJvY2Vzc29yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBT0E7Ozs7Ozs7Ozs7O0dBV0c7QUFDSDtJQWFFOzs7OztPQUtHO0lBQ0gsNEJBQVksS0FBWTtRQUN0QixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztJQUN0QixDQUFDO0lBWkQsc0JBQUkscUNBQUs7UUFOVDs7Ozs7V0FLRzthQUNIO1lBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDckIsQ0FBQzs7O09BQUE7SUFZRDs7Ozs7OztPQU9HO0lBQ0gsa0NBQUssR0FBTCxVQUFNLElBQVksSUFBUyxDQUFDO0lBRTVCOzs7Ozs7Ozs7T0FTRztJQUNILG1DQUFNLEdBQU4sVUFBTyxTQUEwQjtRQUMvQixNQUFNLENBQUMsRUFBRSxDQUFDO0lBQ1osQ0FBQztJQUVEOzs7Ozs7Ozs7T0FTRztJQUNILGtDQUFLLEdBQUwsVUFBTSxTQUEwQjtRQUM5QixNQUFNLENBQUMsRUFBRSxDQUFDO0lBQ1osQ0FBQztJQUVEOzs7Ozs7Ozs7T0FTRztJQUNILHNDQUFTLEdBQVQsVUFBVSxTQUEwQjtJQUNwQyxDQUFDO0lBRUQ7Ozs7Ozs7OztPQVNHO0lBQ0gsb0NBQU8sR0FBUCxVQUFRLFNBQTBCO1FBQ2hDLE1BQU0sQ0FBQyxFQUFFLENBQUM7SUFDWixDQUFDO0lBQ0gseUJBQUM7QUFBRCxDQUFDLEFBdkZELElBdUZDO0FBdkZxQixnREFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ2FjaGUgZnJvbSAnLi4vLi4vY2FjaGUnO1xyXG5pbXBvcnQgeyBSZWNvcmRPcGVyYXRpb24gfSBmcm9tICdAb3JiaXQvZGF0YSc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIE9wZXJhdGlvblByb2Nlc3NvckNsYXNzIHtcclxuICBuZXcgKGNhY2hlOiBDYWNoZSk6IE9wZXJhdGlvblByb2Nlc3NvcjtcclxufVxyXG5cclxuLyoqXHJcbiAqIE9wZXJhdGlvbiBwcm9jZXNzb3JzIGFyZSB1c2VkIHRvIGlkZW50aWZ5IG9wZXJhdGlvbnMgdGhhdCBzaG91bGQgYmUgcGVyZm9ybWVkXHJcbiAqIHRvZ2V0aGVyIHRvIGVuc3VyZSB0aGF0IGEgYENhY2hlYCBvciBvdGhlciBjb250YWluZXIgb2YgZGF0YSByZW1haW5zXHJcbiAqIGNvbnNpc3RlbnQgYW5kIGNvcnJlY3QuXHJcbiAqXHJcbiAqIGBPcGVyYXRpb25Qcm9jZXNzb3JgIGlzIGFuIGFic3RyYWN0IGJhc2UgY2xhc3MgdG8gYmUgZXh0ZW5kZWQgYnkgc3BlY2lmaWNcclxuICogb3BlcmF0aW9uIHByb2Nlc3NvcnMuXHJcbiAqXHJcbiAqIEBleHBvcnRcclxuICogQGFic3RyYWN0XHJcbiAqIEBjbGFzcyBPcGVyYXRpb25Qcm9jZXNzb3JcclxuICovXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBPcGVyYXRpb25Qcm9jZXNzb3Ige1xyXG4gIHByaXZhdGUgX2NhY2hlOiBDYWNoZTtcclxuXHJcbiAgLyoqXHJcbiAgICogVGhlIGBDYWNoZWAgdGhhdCBpcyBtb25pdG9yZWQuXHJcbiAgICpcclxuICAgKiBAcmVhZG9ubHlcclxuICAgKiBAbWVtYmVyb2YgT3BlcmF0aW9uUHJvY2Vzc29yXHJcbiAgICovXHJcbiAgZ2V0IGNhY2hlKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX2NhY2hlO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiBPcGVyYXRpb25Qcm9jZXNzb3IuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge0NhY2hlfSBjYWNoZVxyXG4gICAqIEBtZW1iZXJvZiBPcGVyYXRpb25Qcm9jZXNzb3JcclxuICAgKi9cclxuICBjb25zdHJ1Y3RvcihjYWNoZTogQ2FjaGUpIHtcclxuICAgIHRoaXMuX2NhY2hlID0gY2FjaGU7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDYWxsZWQgd2hlbiBhbGwgdGhlIGRhdGEgaW4gYSBjYWNoZSBoYXMgYmVlbiByZXNldC5cclxuICAgKlxyXG4gICAqIElmIGBiYXNlYCBpcyBpbmNsdWRlZCwgdGhlIGNhY2hlIGlzIGJlaW5nIHJlc2V0IHRvIG1hdGNoIGEgYmFzZSBjYWNoZS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7Q2FjaGV9IFtiYXNlXVxyXG4gICAqIEBtZW1iZXJvZiBPcGVyYXRpb25Qcm9jZXNzb3JcclxuICAgKi9cclxuICByZXNldChiYXNlPzogQ2FjaGUpOiB2b2lkIHt9XHJcblxyXG4gIC8qKlxyXG4gICAqIENhbGxlZCBiZWZvcmUgYW4gYG9wZXJhdGlvbmAgaGFzIGJlZW4gYXBwbGllZC5cclxuICAgKlxyXG4gICAqIFJldHVybnMgYW4gYXJyYXkgb2Ygb3BlcmF0aW9ucyB0byBiZSBhcHBsaWVkICoqQkVGT1JFKiogdGhlIGBvcGVyYXRpb25gXHJcbiAgICogaXRzZWxmIGlzIGFwcGxpZWQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge1JlY29yZE9wZXJhdGlvbn0gb3BlcmF0aW9uXHJcbiAgICogQHJldHVybnMge1JlY29yZE9wZXJhdGlvbltdfVxyXG4gICAqIEBtZW1iZXJvZiBPcGVyYXRpb25Qcm9jZXNzb3JcclxuICAgKi9cclxuICBiZWZvcmUob3BlcmF0aW9uOiBSZWNvcmRPcGVyYXRpb24pOiBSZWNvcmRPcGVyYXRpb25bXSB7XHJcbiAgICByZXR1cm4gW107XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDYWxsZWQgYmVmb3JlIGFuIGBvcGVyYXRpb25gIGhhcyBiZWVuIGFwcGxpZWQuXHJcbiAgICpcclxuICAgKiBSZXR1cm5zIGFuIGFycmF5IG9mIG9wZXJhdGlvbnMgdG8gYmUgYXBwbGllZCAqKkFGVEVSKiogdGhlIGBvcGVyYXRpb25gXHJcbiAgICogaGFzIGJlZW4gYXBwbGllZCBzdWNjZXNzZnVsbHkuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge1JlY29yZE9wZXJhdGlvbn0gb3BlcmF0aW9uXHJcbiAgICogQHJldHVybnMge1JlY29yZE9wZXJhdGlvbltdfVxyXG4gICAqIEBtZW1iZXJvZiBPcGVyYXRpb25Qcm9jZXNzb3JcclxuICAgKi9cclxuICBhZnRlcihvcGVyYXRpb246IFJlY29yZE9wZXJhdGlvbik6IFJlY29yZE9wZXJhdGlvbltdIHtcclxuICAgIHJldHVybiBbXTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENhbGxlZCBpbW1lZGlhdGVseSBhZnRlciBhbiBgb3BlcmF0aW9uYCBoYXMgYmVlbiBhcHBsaWVkIGFuZCBiZWZvcmUgdGhlXHJcbiAgICogYHBhdGNoYCBldmVudCBoYXMgYmVlbiBlbWl0dGVkIChpLmUuIGJlZm9yZSBhbnkgbGlzdGVuZXJzIGhhdmUgYmVlblxyXG4gICAqIG5vdGlmaWVkIHRoYXQgdGhlIG9wZXJhdGlvbiB3YXMgYXBwbGllZCkuXHJcbiAgICpcclxuICAgKiBObyBvcGVyYXRpb25zIG1heSBiZSByZXR1cm5lZC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7UmVjb3JkT3BlcmF0aW9ufSBvcGVyYXRpb25cclxuICAgKiBAbWVtYmVyb2YgT3BlcmF0aW9uUHJvY2Vzc29yXHJcbiAgICovXHJcbiAgaW1tZWRpYXRlKG9wZXJhdGlvbjogUmVjb3JkT3BlcmF0aW9uKTogdm9pZCB7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDYWxsZWQgYWZ0ZXIgYW4gYG9wZXJhdGlvbmAgX2FuZF8gYW55IHJlbGF0ZWQgb3BlcmF0aW9ucyBoYXZlIGJlZW4gYXBwbGllZC5cclxuICAgKlxyXG4gICAqIFJldHVybnMgYW4gYXJyYXkgb2Ygb3BlcmF0aW9ucyB0byBiZSBhcHBsaWVkICoqQUZURVIqKiB0aGUgYG9wZXJhdGlvbmBcclxuICAgKiBpdHNlbGYgYW5kIGFueSBvcGVyYXRpb25zIHJldHVybmVkIGZyb20gdGhlIGBhZnRlcmAgaG9vayBoYXZlIGJlZW4gYXBwbGllZC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7UmVjb3JkT3BlcmF0aW9ufSBvcGVyYXRpb25cclxuICAgKiBAcmV0dXJucyB7UmVjb3JkT3BlcmF0aW9uW119XHJcbiAgICogQG1lbWJlcm9mIE9wZXJhdGlvblByb2Nlc3NvclxyXG4gICAqL1xyXG4gIGZpbmFsbHkob3BlcmF0aW9uOiBSZWNvcmRPcGVyYXRpb24pOiBSZWNvcmRPcGVyYXRpb25bXSB7XHJcbiAgICByZXR1cm4gW107XHJcbiAgfVxyXG59XHJcbiJdfQ==