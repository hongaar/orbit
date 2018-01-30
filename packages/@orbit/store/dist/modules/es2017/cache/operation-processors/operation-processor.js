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
     * Allow the processor to perform an upgrade as part of a cache upgrade.
     *
     * @memberof OperationProcessor
     */
    OperationProcessor.prototype.upgrade = function () { };
    /**
     * Validates an operation before processing it.
     *
     * @param {RecordOperation} operation
     * @memberof OperationProcessor
     */
    OperationProcessor.prototype.validate = function (operation) { };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3BlcmF0aW9uLXByb2Nlc3Nvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jYWNoZS9vcGVyYXRpb24tcHJvY2Vzc29ycy9vcGVyYXRpb24tcHJvY2Vzc29yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBT0E7Ozs7Ozs7Ozs7O0dBV0c7QUFDSDtJQWFFOzs7OztPQUtHO0lBQ0gsNEJBQVksS0FBWTtRQUN0QixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztJQUN0QixDQUFDO0lBWkQsc0JBQUkscUNBQUs7UUFOVDs7Ozs7V0FLRzthQUNIO1lBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDckIsQ0FBQzs7O09BQUE7SUFZRDs7Ozs7OztPQU9HO0lBQ0gsa0NBQUssR0FBTCxVQUFNLElBQVksSUFBUyxDQUFDO0lBRTVCOzs7O09BSUc7SUFDSCxvQ0FBTyxHQUFQLGNBQWlCLENBQUM7SUFFbEI7Ozs7O09BS0c7SUFDSCxxQ0FBUSxHQUFSLFVBQVMsU0FBMEIsSUFBUyxDQUFDO0lBRTdDOzs7Ozs7Ozs7T0FTRztJQUNILG1DQUFNLEdBQU4sVUFBTyxTQUEwQjtRQUMvQixNQUFNLENBQUMsRUFBRSxDQUFDO0lBQ1osQ0FBQztJQUVEOzs7Ozs7Ozs7T0FTRztJQUNILGtDQUFLLEdBQUwsVUFBTSxTQUEwQjtRQUM5QixNQUFNLENBQUMsRUFBRSxDQUFDO0lBQ1osQ0FBQztJQUVEOzs7Ozs7Ozs7T0FTRztJQUNILHNDQUFTLEdBQVQsVUFBVSxTQUEwQjtJQUNwQyxDQUFDO0lBRUQ7Ozs7Ozs7OztPQVNHO0lBQ0gsb0NBQU8sR0FBUCxVQUFRLFNBQTBCO1FBQ2hDLE1BQU0sQ0FBQyxFQUFFLENBQUM7SUFDWixDQUFDO0lBQ0gseUJBQUM7QUFBRCxDQUFDLEFBdEdELElBc0dDO0FBdEdxQixnREFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ2FjaGUgZnJvbSAnLi4vLi4vY2FjaGUnO1xyXG5pbXBvcnQgeyBSZWNvcmRPcGVyYXRpb24gfSBmcm9tICdAb3JiaXQvZGF0YSc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIE9wZXJhdGlvblByb2Nlc3NvckNsYXNzIHtcclxuICBuZXcgKGNhY2hlOiBDYWNoZSk6IE9wZXJhdGlvblByb2Nlc3NvcjtcclxufVxyXG5cclxuLyoqXHJcbiAqIE9wZXJhdGlvbiBwcm9jZXNzb3JzIGFyZSB1c2VkIHRvIGlkZW50aWZ5IG9wZXJhdGlvbnMgdGhhdCBzaG91bGQgYmUgcGVyZm9ybWVkXHJcbiAqIHRvZ2V0aGVyIHRvIGVuc3VyZSB0aGF0IGEgYENhY2hlYCBvciBvdGhlciBjb250YWluZXIgb2YgZGF0YSByZW1haW5zXHJcbiAqIGNvbnNpc3RlbnQgYW5kIGNvcnJlY3QuXHJcbiAqXHJcbiAqIGBPcGVyYXRpb25Qcm9jZXNzb3JgIGlzIGFuIGFic3RyYWN0IGJhc2UgY2xhc3MgdG8gYmUgZXh0ZW5kZWQgYnkgc3BlY2lmaWNcclxuICogb3BlcmF0aW9uIHByb2Nlc3NvcnMuXHJcbiAqXHJcbiAqIEBleHBvcnRcclxuICogQGFic3RyYWN0XHJcbiAqIEBjbGFzcyBPcGVyYXRpb25Qcm9jZXNzb3JcclxuICovXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBPcGVyYXRpb25Qcm9jZXNzb3Ige1xyXG4gIHByaXZhdGUgX2NhY2hlOiBDYWNoZTtcclxuXHJcbiAgLyoqXHJcbiAgICogVGhlIGBDYWNoZWAgdGhhdCBpcyBtb25pdG9yZWQuXHJcbiAgICpcclxuICAgKiBAcmVhZG9ubHlcclxuICAgKiBAbWVtYmVyb2YgT3BlcmF0aW9uUHJvY2Vzc29yXHJcbiAgICovXHJcbiAgZ2V0IGNhY2hlKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX2NhY2hlO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiBPcGVyYXRpb25Qcm9jZXNzb3IuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge0NhY2hlfSBjYWNoZVxyXG4gICAqIEBtZW1iZXJvZiBPcGVyYXRpb25Qcm9jZXNzb3JcclxuICAgKi9cclxuICBjb25zdHJ1Y3RvcihjYWNoZTogQ2FjaGUpIHtcclxuICAgIHRoaXMuX2NhY2hlID0gY2FjaGU7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDYWxsZWQgd2hlbiBhbGwgdGhlIGRhdGEgaW4gYSBjYWNoZSBoYXMgYmVlbiByZXNldC5cclxuICAgKlxyXG4gICAqIElmIGBiYXNlYCBpcyBpbmNsdWRlZCwgdGhlIGNhY2hlIGlzIGJlaW5nIHJlc2V0IHRvIG1hdGNoIGEgYmFzZSBjYWNoZS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7Q2FjaGV9IFtiYXNlXVxyXG4gICAqIEBtZW1iZXJvZiBPcGVyYXRpb25Qcm9jZXNzb3JcclxuICAgKi9cclxuICByZXNldChiYXNlPzogQ2FjaGUpOiB2b2lkIHt9XHJcblxyXG4gIC8qKlxyXG4gICAqIEFsbG93IHRoZSBwcm9jZXNzb3IgdG8gcGVyZm9ybSBhbiB1cGdyYWRlIGFzIHBhcnQgb2YgYSBjYWNoZSB1cGdyYWRlLlxyXG4gICAqXHJcbiAgICogQG1lbWJlcm9mIE9wZXJhdGlvblByb2Nlc3NvclxyXG4gICAqL1xyXG4gIHVwZ3JhZGUoKTogdm9pZCB7fVxyXG5cclxuICAvKipcclxuICAgKiBWYWxpZGF0ZXMgYW4gb3BlcmF0aW9uIGJlZm9yZSBwcm9jZXNzaW5nIGl0LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtSZWNvcmRPcGVyYXRpb259IG9wZXJhdGlvblxyXG4gICAqIEBtZW1iZXJvZiBPcGVyYXRpb25Qcm9jZXNzb3JcclxuICAgKi9cclxuICB2YWxpZGF0ZShvcGVyYXRpb246IFJlY29yZE9wZXJhdGlvbik6IHZvaWQge31cclxuXHJcbiAgLyoqXHJcbiAgICogQ2FsbGVkIGJlZm9yZSBhbiBgb3BlcmF0aW9uYCBoYXMgYmVlbiBhcHBsaWVkLlxyXG4gICAqXHJcbiAgICogUmV0dXJucyBhbiBhcnJheSBvZiBvcGVyYXRpb25zIHRvIGJlIGFwcGxpZWQgKipCRUZPUkUqKiB0aGUgYG9wZXJhdGlvbmBcclxuICAgKiBpdHNlbGYgaXMgYXBwbGllZC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7UmVjb3JkT3BlcmF0aW9ufSBvcGVyYXRpb25cclxuICAgKiBAcmV0dXJucyB7UmVjb3JkT3BlcmF0aW9uW119XHJcbiAgICogQG1lbWJlcm9mIE9wZXJhdGlvblByb2Nlc3NvclxyXG4gICAqL1xyXG4gIGJlZm9yZShvcGVyYXRpb246IFJlY29yZE9wZXJhdGlvbik6IFJlY29yZE9wZXJhdGlvbltdIHtcclxuICAgIHJldHVybiBbXTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENhbGxlZCBiZWZvcmUgYW4gYG9wZXJhdGlvbmAgaGFzIGJlZW4gYXBwbGllZC5cclxuICAgKlxyXG4gICAqIFJldHVybnMgYW4gYXJyYXkgb2Ygb3BlcmF0aW9ucyB0byBiZSBhcHBsaWVkICoqQUZURVIqKiB0aGUgYG9wZXJhdGlvbmBcclxuICAgKiBoYXMgYmVlbiBhcHBsaWVkIHN1Y2Nlc3NmdWxseS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7UmVjb3JkT3BlcmF0aW9ufSBvcGVyYXRpb25cclxuICAgKiBAcmV0dXJucyB7UmVjb3JkT3BlcmF0aW9uW119XHJcbiAgICogQG1lbWJlcm9mIE9wZXJhdGlvblByb2Nlc3NvclxyXG4gICAqL1xyXG4gIGFmdGVyKG9wZXJhdGlvbjogUmVjb3JkT3BlcmF0aW9uKTogUmVjb3JkT3BlcmF0aW9uW10ge1xyXG4gICAgcmV0dXJuIFtdO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ2FsbGVkIGltbWVkaWF0ZWx5IGFmdGVyIGFuIGBvcGVyYXRpb25gIGhhcyBiZWVuIGFwcGxpZWQgYW5kIGJlZm9yZSB0aGVcclxuICAgKiBgcGF0Y2hgIGV2ZW50IGhhcyBiZWVuIGVtaXR0ZWQgKGkuZS4gYmVmb3JlIGFueSBsaXN0ZW5lcnMgaGF2ZSBiZWVuXHJcbiAgICogbm90aWZpZWQgdGhhdCB0aGUgb3BlcmF0aW9uIHdhcyBhcHBsaWVkKS5cclxuICAgKlxyXG4gICAqIE5vIG9wZXJhdGlvbnMgbWF5IGJlIHJldHVybmVkLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtSZWNvcmRPcGVyYXRpb259IG9wZXJhdGlvblxyXG4gICAqIEBtZW1iZXJvZiBPcGVyYXRpb25Qcm9jZXNzb3JcclxuICAgKi9cclxuICBpbW1lZGlhdGUob3BlcmF0aW9uOiBSZWNvcmRPcGVyYXRpb24pOiB2b2lkIHtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENhbGxlZCBhZnRlciBhbiBgb3BlcmF0aW9uYCBfYW5kXyBhbnkgcmVsYXRlZCBvcGVyYXRpb25zIGhhdmUgYmVlbiBhcHBsaWVkLlxyXG4gICAqXHJcbiAgICogUmV0dXJucyBhbiBhcnJheSBvZiBvcGVyYXRpb25zIHRvIGJlIGFwcGxpZWQgKipBRlRFUioqIHRoZSBgb3BlcmF0aW9uYFxyXG4gICAqIGl0c2VsZiBhbmQgYW55IG9wZXJhdGlvbnMgcmV0dXJuZWQgZnJvbSB0aGUgYGFmdGVyYCBob29rIGhhdmUgYmVlbiBhcHBsaWVkLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtSZWNvcmRPcGVyYXRpb259IG9wZXJhdGlvblxyXG4gICAqIEByZXR1cm5zIHtSZWNvcmRPcGVyYXRpb25bXX1cclxuICAgKiBAbWVtYmVyb2YgT3BlcmF0aW9uUHJvY2Vzc29yXHJcbiAgICovXHJcbiAgZmluYWxseShvcGVyYXRpb246IFJlY29yZE9wZXJhdGlvbik6IFJlY29yZE9wZXJhdGlvbltdIHtcclxuICAgIHJldHVybiBbXTtcclxuICB9XHJcbn1cclxuIl19