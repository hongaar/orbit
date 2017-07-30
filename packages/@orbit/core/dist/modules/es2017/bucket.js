"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var main_1 = require("./main");
var evented_1 = require("./evented");
/**
 * Buckets can persist state. The base `Bucket` class is abstract and should be
 * extended to created buckets with different persistence strategies.
 *
 * Buckets have a simple map-like interface with methods like `getItem`,
 * `setItem`, and `removeItem`. All methods return promises to enable usage with
 * asynchronous stores like IndexedDB.
 *
 * Buckets can be assigned a unique `namespace` in order to avoid collisions.
 *
 * Buckets can be assigned a version, and can be "upgraded" to a new version.
 * The upgrade process allows buckets to migrate their data between versions.
 *
 * @export
 * @abstract
 * @class Bucket
 * @implements {Evented}
 */
var Bucket = (function () {
    /**
     * Creates an instance of `Bucket`.
     *
     * @param {BucketSettings} [settings={}]
     *
     * @memberOf Bucket
     */
    function Bucket(settings) {
        if (settings === void 0) { settings = {}; }
        if (settings.version === undefined) {
            settings.version = 1;
        }
        settings.namespace = settings.namespace || 'orbit-bucket';
        this._applySettings(settings);
    }
    Object.defineProperty(Bucket.prototype, "name", {
        /**
         * Name used for tracking and debugging a bucket instance.
         *
         * @readonly
         * @type {string}
         * @memberOf Bucket
         */
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bucket.prototype, "namespace", {
        /**
         * The namespace used by the bucket when accessing any items.
         *
         * This is used to distinguish one bucket's contents from another.
         *
         * @readonly
         * @type {string}
         * @memberOf Bucket
         */
        get: function () {
            return this._namespace;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bucket.prototype, "version", {
        /**
         * The current version of the bucket.
         *
         * To change versions, `upgrade` should be invoked.
         *
         * @readonly
         * @type {number}
         * @memberOf Bucket
         */
        get: function () {
            return this._version;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Upgrades Bucket to a new version with new settings.
     *
     * Settings, beyond `version`, are bucket-specific.
     *
     * @param {BucketSettings} settings
     * @returns {Promise<void>}
     * @memberOf Bucket
      */
    Bucket.prototype.upgrade = function (settings) {
        var _this = this;
        if (settings === void 0) { settings = {}; }
        if (settings.version === undefined) {
            settings.version = this._version + 1;
        }
        return this._applySettings(settings)
            .then(function () { return _this.emit('upgrade', _this._version); });
    };
    /**
     * Applies settings passed from a `constructor` or `upgrade`.
     *
     * @param {BucketSettings} settings
     * @returns {Promise<void>}
     * @memberOf Bucket
     */
    Bucket.prototype._applySettings = function (settings) {
        if (settings.name) {
            this._name = settings.name;
        }
        if (settings.namespace) {
            this._namespace = settings.namespace;
        }
        this._version = settings.version;
        return main_1.default.Promise.resolve();
    };
    Bucket = __decorate([
        evented_1.default
    ], Bucket);
    return Bucket;
}());
exports.Bucket = Bucket;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVja2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3JjL2J1Y2tldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLCtCQUEyQjtBQUMzQixxQ0FBNkM7QUEwQzdDOzs7Ozs7Ozs7Ozs7Ozs7OztHQWlCRztBQUVIO0lBWUU7Ozs7OztPQU1HO0lBQ0gsZ0JBQVksUUFBNkI7UUFBN0IseUJBQUEsRUFBQSxhQUE2QjtRQUN2QyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDbkMsUUFBUSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7UUFDdkIsQ0FBQztRQUVELFFBQVEsQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDLFNBQVMsSUFBSSxjQUFjLENBQUM7UUFFMUQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBMkNELHNCQUFJLHdCQUFJO1FBUFI7Ozs7OztXQU1HO2FBQ0g7WUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUNwQixDQUFDOzs7T0FBQTtJQVdELHNCQUFJLDZCQUFTO1FBVGI7Ozs7Ozs7O1dBUUc7YUFDSDtZQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO1FBQ3pCLENBQUM7OztPQUFBO0lBV0Qsc0JBQUksMkJBQU87UUFUWDs7Ozs7Ozs7V0FRRzthQUNIO1lBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDdkIsQ0FBQzs7O09BQUE7SUFFRDs7Ozs7Ozs7UUFRSTtJQUNKLHdCQUFPLEdBQVAsVUFBUSxRQUE2QjtRQUFyQyxpQkFNQztRQU5PLHlCQUFBLEVBQUEsYUFBNkI7UUFDbkMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ25DLFFBQVEsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7UUFDdkMsQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQzthQUNqQyxJQUFJLENBQUMsY0FBTSxPQUFBLEtBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLEtBQUksQ0FBQyxRQUFRLENBQUMsRUFBbkMsQ0FBbUMsQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCwrQkFBYyxHQUFkLFVBQWUsUUFBd0I7UUFDckMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDbEIsSUFBSSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDO1FBQzdCLENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUN2QixJQUFJLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUM7UUFDdkMsQ0FBQztRQUNELElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQztRQUNqQyxNQUFNLENBQUMsY0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNqQyxDQUFDO0lBckltQixNQUFNO1FBRDNCLGlCQUFPO09BQ2MsTUFBTSxDQXNJM0I7SUFBRCxhQUFDO0NBQUEsQUF0SUQsSUFzSUM7QUF0SXFCLHdCQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE9yYml0IGZyb20gJy4vbWFpbic7XHJcbmltcG9ydCBldmVudGVkLCB7IEV2ZW50ZWQgfSBmcm9tICcuL2V2ZW50ZWQnO1xyXG5pbXBvcnQgeyBhc3NlcnQgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xyXG5cclxuLyoqXHJcbiAqIFNldHRpbmdzIHVzZWQgdG8gaW5zdGFudGlhdGUgYW5kL29yIHVwZ3JhZGUgYSBgQnVja2V0YC5cclxuICogXHJcbiAqIEBleHBvcnRcclxuICogQGludGVyZmFjZSBCdWNrZXRTZXR0aW5nc1xyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBCdWNrZXRTZXR0aW5ncyB7XHJcbiAgLyoqXHJcbiAgICogTmFtZSB1c2VkIGZvciB0cmFja2luZyBhbmQgZGVidWdnaW5nIGEgYnVja2V0IGluc3RhbmNlLlxyXG4gICAqIFxyXG4gICAqIEB0eXBlIHtzdHJpbmd9XHJcbiAgICogQG1lbWJlck9mIEJ1Y2tldFNldHRpbmdzXHJcbiAgICovXHJcbiAgbmFtZT86IHN0cmluZztcclxuXHJcbiAgLyoqXHJcbiAgICogVGhlIG5hbWVzcGFjZSB1c2VkIGJ5IHRoZSBidWNrZXQgd2hlbiBhY2Nlc3NpbmcgYW55IGl0ZW1zLlxyXG4gICAqIFxyXG4gICAqIFRoaXMgaXMgdXNlZCB0byBkaXN0aW5ndWlzaCBvbmUgYnVja2V0J3MgY29udGVudHMgZnJvbSBhbm90aGVyLiBcclxuICAgKiBcclxuICAgKiBAdHlwZSB7c3RyaW5nfVxyXG4gICAqIEBtZW1iZXJPZiBCdWNrZXRTZXR0aW5nc1xyXG4gICAqL1xyXG4gIG5hbWVzcGFjZT86IHN0cmluZztcclxuXHJcbiAgLyoqXHJcbiAgICogVGhlIGN1cnJlbnQgdmVyc2lvbiBvZiB0aGUgYnVja2V0LlxyXG4gICAqIFxyXG4gICAqIFVzZWQgdG8gaWRlbnRpZnkgdGhlIHZlcnNpb24gb2YgdGhlIGJ1Y2tldCdzIHNjaGVtYSBhbmQgdGh1cyBtaWdyYXRlIGl0IFxyXG4gICAqIGFzIG5lZWRlZC5cclxuICAgKiBcclxuICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAqIEBtZW1iZXJPZiBCdWNrZXRTZXR0aW5nc1xyXG4gICAqL1xyXG4gIHZlcnNpb24/OiBudW1iZXI7XHJcbn1cclxuXHJcbmV4cG9ydCB0eXBlIEJVQ0tFVF9FVkVOVFMgPSAndXBncmFkZSc7XHJcblxyXG4vKipcclxuICogQnVja2V0cyBjYW4gcGVyc2lzdCBzdGF0ZS4gVGhlIGJhc2UgYEJ1Y2tldGAgY2xhc3MgaXMgYWJzdHJhY3QgYW5kIHNob3VsZCBiZVxyXG4gKiBleHRlbmRlZCB0byBjcmVhdGVkIGJ1Y2tldHMgd2l0aCBkaWZmZXJlbnQgcGVyc2lzdGVuY2Ugc3RyYXRlZ2llcy5cclxuICpcclxuICogQnVja2V0cyBoYXZlIGEgc2ltcGxlIG1hcC1saWtlIGludGVyZmFjZSB3aXRoIG1ldGhvZHMgbGlrZSBgZ2V0SXRlbWAsXHJcbiAqIGBzZXRJdGVtYCwgYW5kIGByZW1vdmVJdGVtYC4gQWxsIG1ldGhvZHMgcmV0dXJuIHByb21pc2VzIHRvIGVuYWJsZSB1c2FnZSB3aXRoXHJcbiAqIGFzeW5jaHJvbm91cyBzdG9yZXMgbGlrZSBJbmRleGVkREIuXHJcbiAqXHJcbiAqIEJ1Y2tldHMgY2FuIGJlIGFzc2lnbmVkIGEgdW5pcXVlIGBuYW1lc3BhY2VgIGluIG9yZGVyIHRvIGF2b2lkIGNvbGxpc2lvbnMuXHJcbiAqIFxyXG4gKiBCdWNrZXRzIGNhbiBiZSBhc3NpZ25lZCBhIHZlcnNpb24sIGFuZCBjYW4gYmUgXCJ1cGdyYWRlZFwiIHRvIGEgbmV3IHZlcnNpb24uXHJcbiAqIFRoZSB1cGdyYWRlIHByb2Nlc3MgYWxsb3dzIGJ1Y2tldHMgdG8gbWlncmF0ZSB0aGVpciBkYXRhIGJldHdlZW4gdmVyc2lvbnMuXHJcbiAqXHJcbiAqIEBleHBvcnRcclxuICogQGFic3RyYWN0XHJcbiAqIEBjbGFzcyBCdWNrZXRcclxuICogQGltcGxlbWVudHMge0V2ZW50ZWR9XHJcbiAqL1xyXG5AZXZlbnRlZFxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQnVja2V0IGltcGxlbWVudHMgRXZlbnRlZCB7XHJcbiAgcHJpdmF0ZSBfbmFtZTogc3RyaW5nO1xyXG4gIHByaXZhdGUgX25hbWVzcGFjZTogc3RyaW5nO1xyXG4gIHByaXZhdGUgX3ZlcnNpb246IG51bWJlcjtcclxuXHJcbiAgLy8gRXZlbnRlZCBpbnRlcmZhY2Ugc3R1YnNcclxuICBvbjogKGV2ZW50OiBCVUNLRVRfRVZFTlRTLCBjYWxsYmFjazogRnVuY3Rpb24sIGJpbmRpbmc/OiBvYmplY3QpID0+IHZvaWQ7XHJcbiAgb2ZmOiAoZXZlbnQ6IEJVQ0tFVF9FVkVOVFMsIGNhbGxiYWNrOiBGdW5jdGlvbiwgYmluZGluZz86IG9iamVjdCkgPT4gdm9pZDtcclxuICBvbmU6IChldmVudDogQlVDS0VUX0VWRU5UUywgY2FsbGJhY2s6IEZ1bmN0aW9uLCBiaW5kaW5nPzogb2JqZWN0KSA9PiB2b2lkO1xyXG4gIGVtaXQ6IChldmVudDogQlVDS0VUX0VWRU5UUywgLi4uYXJncykgPT4gdm9pZDtcclxuICBsaXN0ZW5lcnM6IChldmVudDogQlVDS0VUX0VWRU5UUykgPT4gYW55W107XHJcblxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgYEJ1Y2tldGAuXHJcbiAgICogXHJcbiAgICogQHBhcmFtIHtCdWNrZXRTZXR0aW5nc30gW3NldHRpbmdzPXt9XSBcclxuICAgKiBcclxuICAgKiBAbWVtYmVyT2YgQnVja2V0XHJcbiAgICovXHJcbiAgY29uc3RydWN0b3Ioc2V0dGluZ3M6IEJ1Y2tldFNldHRpbmdzID0ge30pIHtcclxuICAgIGlmIChzZXR0aW5ncy52ZXJzaW9uID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgc2V0dGluZ3MudmVyc2lvbiA9IDE7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0dGluZ3MubmFtZXNwYWNlID0gc2V0dGluZ3MubmFtZXNwYWNlIHx8ICdvcmJpdC1idWNrZXQnO1xyXG5cclxuICAgIHRoaXMuX2FwcGx5U2V0dGluZ3Moc2V0dGluZ3MpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0cmlldmVzIGFuIGl0ZW0gZnJvbSB0aGUgYnVja2V0LlxyXG4gICAqIFxyXG4gICAqIEBhYnN0cmFjdFxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgXHJcbiAgICogQHJldHVybnMge1Byb21pc2U8YW55Pn0gXHJcbiAgICogXHJcbiAgICogQG1lbWJlck9mIEJ1Y2tldFxyXG4gICAqL1xyXG4gIGFic3RyYWN0IGdldEl0ZW0oa2V5OiBzdHJpbmcpOiBQcm9taXNlPGFueT47XHJcblxyXG4gIC8qKlxyXG4gICAqIFN0b3JlcyBhbiBpdGVtIGluIHRoZSBidWNrZXQuXHJcbiAgICogXHJcbiAgICogQGFic3RyYWN0XHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBcclxuICAgKiBAcGFyYW0geyp9IHZhbHVlIFxyXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPHZvaWQ+fSBcclxuICAgKiBcclxuICAgKiBAbWVtYmVyT2YgQnVja2V0XHJcbiAgICovXHJcbiAgYWJzdHJhY3Qgc2V0SXRlbShrZXk6IHN0cmluZywgdmFsdWU6IGFueSk6IFByb21pc2U8dm9pZD47XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlbW92ZXMgYW4gaXRlbSBmcm9tIHRoZSBidWNrZXQuXHJcbiAgICogXHJcbiAgICogQGFic3RyYWN0XHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBcclxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkPn0gXHJcbiAgICogXHJcbiAgICogQG1lbWJlck9mIEJ1Y2tldFxyXG4gICAqL1xyXG4gIGFic3RyYWN0IHJlbW92ZUl0ZW0oa2V5OiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+O1xyXG5cclxuICAvKipcclxuICAgKiBOYW1lIHVzZWQgZm9yIHRyYWNraW5nIGFuZCBkZWJ1Z2dpbmcgYSBidWNrZXQgaW5zdGFuY2UuXHJcbiAgICogXHJcbiAgICogQHJlYWRvbmx5XHJcbiAgICogQHR5cGUge3N0cmluZ31cclxuICAgKiBAbWVtYmVyT2YgQnVja2V0XHJcbiAgICovXHJcbiAgZ2V0IG5hbWUoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLl9uYW1lO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVGhlIG5hbWVzcGFjZSB1c2VkIGJ5IHRoZSBidWNrZXQgd2hlbiBhY2Nlc3NpbmcgYW55IGl0ZW1zLlxyXG4gICAqIFxyXG4gICAqIFRoaXMgaXMgdXNlZCB0byBkaXN0aW5ndWlzaCBvbmUgYnVja2V0J3MgY29udGVudHMgZnJvbSBhbm90aGVyLlxyXG4gICAqIFxyXG4gICAqIEByZWFkb25seVxyXG4gICAqIEB0eXBlIHtzdHJpbmd9XHJcbiAgICogQG1lbWJlck9mIEJ1Y2tldFxyXG4gICAqL1xyXG4gIGdldCBuYW1lc3BhY2UoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLl9uYW1lc3BhY2U7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBUaGUgY3VycmVudCB2ZXJzaW9uIG9mIHRoZSBidWNrZXQuXHJcbiAgICogXHJcbiAgICogVG8gY2hhbmdlIHZlcnNpb25zLCBgdXBncmFkZWAgc2hvdWxkIGJlIGludm9rZWQuXHJcbiAgICogXHJcbiAgICogQHJlYWRvbmx5XHJcbiAgICogQHR5cGUge251bWJlcn1cclxuICAgKiBAbWVtYmVyT2YgQnVja2V0XHJcbiAgICovXHJcbiAgZ2V0IHZlcnNpb24oKTogbnVtYmVyIHtcclxuICAgIHJldHVybiB0aGlzLl92ZXJzaW9uO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVXBncmFkZXMgQnVja2V0IHRvIGEgbmV3IHZlcnNpb24gd2l0aCBuZXcgc2V0dGluZ3MuXHJcbiAgICpcclxuICAgKiBTZXR0aW5ncywgYmV5b25kIGB2ZXJzaW9uYCwgYXJlIGJ1Y2tldC1zcGVjaWZpYy5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7QnVja2V0U2V0dGluZ3N9IHNldHRpbmdzIFxyXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPHZvaWQ+fSBcclxuICAgKiBAbWVtYmVyT2YgQnVja2V0XHJcbiAgICAqL1xyXG4gIHVwZ3JhZGUoc2V0dGluZ3M6IEJ1Y2tldFNldHRpbmdzID0ge30pOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIGlmIChzZXR0aW5ncy52ZXJzaW9uID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgc2V0dGluZ3MudmVyc2lvbiA9IHRoaXMuX3ZlcnNpb24gKyAxO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXMuX2FwcGx5U2V0dGluZ3Moc2V0dGluZ3MpXHJcbiAgICAgIC50aGVuKCgpID0+IHRoaXMuZW1pdCgndXBncmFkZScsIHRoaXMuX3ZlcnNpb24pKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEFwcGxpZXMgc2V0dGluZ3MgcGFzc2VkIGZyb20gYSBgY29uc3RydWN0b3JgIG9yIGB1cGdyYWRlYC5cclxuICAgKiBcclxuICAgKiBAcGFyYW0ge0J1Y2tldFNldHRpbmdzfSBzZXR0aW5ncyBcclxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkPn0gXHJcbiAgICogQG1lbWJlck9mIEJ1Y2tldFxyXG4gICAqL1xyXG4gIF9hcHBseVNldHRpbmdzKHNldHRpbmdzOiBCdWNrZXRTZXR0aW5ncyk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgaWYgKHNldHRpbmdzLm5hbWUpIHtcclxuICAgICAgdGhpcy5fbmFtZSA9IHNldHRpbmdzLm5hbWU7XHJcbiAgICB9XHJcbiAgICBpZiAoc2V0dGluZ3MubmFtZXNwYWNlKSB7XHJcbiAgICAgIHRoaXMuX25hbWVzcGFjZSA9IHNldHRpbmdzLm5hbWVzcGFjZTtcclxuICAgIH1cclxuICAgIHRoaXMuX3ZlcnNpb24gPSBzZXR0aW5ncy52ZXJzaW9uO1xyXG4gICAgcmV0dXJuIE9yYml0LlByb21pc2UucmVzb2x2ZSgpO1xyXG4gIH1cclxufVxyXG4iXX0=