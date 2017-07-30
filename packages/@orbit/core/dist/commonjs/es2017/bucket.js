"use strict";

var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
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
var Bucket = function () {
    /**
     * Creates an instance of `Bucket`.
     *
     * @param {BucketSettings} [settings={}]
     *
     * @memberOf Bucket
     */
    function Bucket(settings) {
        if (settings === void 0) {
            settings = {};
        }
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
        if (settings === void 0) {
            settings = {};
        }
        if (settings.version === undefined) {
            settings.version = this._version + 1;
        }
        return this._applySettings(settings).then(function () {
            return _this.emit('upgrade', _this._version);
        });
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
    Bucket = __decorate([evented_1.default], Bucket);
    return Bucket;
}();
exports.Bucket = Bucket;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVja2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3JjL2J1Y2tldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEscUJBQTJCO0FBQzNCLHdCQUE2QztBQTBDN0MsQUFpQkc7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVIO0FBWUUsQUFNRzs7Ozs7OztBQUNILG9CQUFZLEFBQTZCO0FBQTdCLGlDQUFBO0FBQUEsdUJBQTZCOztBQUN2QyxBQUFFLEFBQUMsWUFBQyxBQUFRLFNBQUMsQUFBTyxZQUFLLEFBQVMsQUFBQyxXQUFDLEFBQUM7QUFDbkMsQUFBUSxxQkFBQyxBQUFPLFVBQUcsQUFBQyxBQUFDLEFBQ3ZCO0FBQUM7QUFFRCxBQUFRLGlCQUFDLEFBQVMsWUFBRyxBQUFRLFNBQUMsQUFBUyxhQUFJLEFBQWMsQUFBQztBQUUxRCxBQUFJLGFBQUMsQUFBYyxlQUFDLEFBQVEsQUFBQyxBQUFDLEFBQ2hDO0FBQUM7QUEyQ0QsMEJBQUksa0JBQUk7QUFQUixBQU1HOzs7Ozs7O2FBQ0g7QUFDRSxBQUFNLG1CQUFDLEFBQUksS0FBQyxBQUFLLEFBQUMsQUFDcEI7QUFBQzs7c0JBQUE7O0FBV0QsMEJBQUksa0JBQVM7QUFUYixBQVFHOzs7Ozs7Ozs7YUFDSDtBQUNFLEFBQU0sbUJBQUMsQUFBSSxLQUFDLEFBQVUsQUFBQyxBQUN6QjtBQUFDOztzQkFBQTs7QUFXRCwwQkFBSSxrQkFBTztBQVRYLEFBUUc7Ozs7Ozs7OzthQUNIO0FBQ0UsQUFBTSxtQkFBQyxBQUFJLEtBQUMsQUFBUSxBQUFDLEFBQ3ZCO0FBQUM7O3NCQUFBOztBQUVELEFBUUk7Ozs7Ozs7OztBQUNKLHFCQUFPLFVBQVAsVUFBUSxBQUE2QjtBQUFyQyxvQkFNQztBQU5PLGlDQUFBO0FBQUEsdUJBQTZCOztBQUNuQyxBQUFFLEFBQUMsWUFBQyxBQUFRLFNBQUMsQUFBTyxZQUFLLEFBQVMsQUFBQyxXQUFDLEFBQUM7QUFDbkMsQUFBUSxxQkFBQyxBQUFPLFVBQUcsQUFBSSxLQUFDLEFBQVEsV0FBRyxBQUFDLEFBQUMsQUFDdkM7QUFBQztBQUNELEFBQU0sb0JBQU0sQUFBYyxlQUFDLEFBQVEsQUFBQyxVQUNqQyxBQUFJLEtBQUM7QUFBTSxtQkFBQSxBQUFJLE1BQUMsQUFBSSxLQUFDLEFBQVMsV0FBRSxBQUFJLE1BQXpCLEFBQTBCLEFBQVEsQUFBQztBQUFBLEFBQUMsQUFBQyxBQUNyRCxTQUZTLEFBQUk7QUFFWjtBQUVELEFBTUc7Ozs7Ozs7QUFDSCxxQkFBYyxpQkFBZCxVQUFlLEFBQXdCO0FBQ3JDLEFBQUUsQUFBQyxZQUFDLEFBQVEsU0FBQyxBQUFJLEFBQUMsTUFBQyxBQUFDO0FBQ2xCLEFBQUksaUJBQUMsQUFBSyxRQUFHLEFBQVEsU0FBQyxBQUFJLEFBQUMsQUFDN0I7QUFBQztBQUNELEFBQUUsQUFBQyxZQUFDLEFBQVEsU0FBQyxBQUFTLEFBQUMsV0FBQyxBQUFDO0FBQ3ZCLEFBQUksaUJBQUMsQUFBVSxhQUFHLEFBQVEsU0FBQyxBQUFTLEFBQUMsQUFDdkM7QUFBQztBQUNELEFBQUksYUFBQyxBQUFRLFdBQUcsQUFBUSxTQUFDLEFBQU8sQUFBQztBQUNqQyxBQUFNLGVBQUMsT0FBSyxRQUFDLEFBQU8sUUFBQyxBQUFPLEFBQUUsQUFBQyxBQUNqQztBQUFDO0FBckltQixBQUFNLHlCQUQzQixVQUFPLFVBQ2MsQUFBTSxBQXNJM0I7QUFBRCxXQUFDO0FBdElELEFBc0lDO0FBdElxQixpQkFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBPcmJpdCBmcm9tICcuL21haW4nO1xyXG5pbXBvcnQgZXZlbnRlZCwgeyBFdmVudGVkIH0gZnJvbSAnLi9ldmVudGVkJztcclxuaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSAnQG9yYml0L3V0aWxzJztcclxuXHJcbi8qKlxyXG4gKiBTZXR0aW5ncyB1c2VkIHRvIGluc3RhbnRpYXRlIGFuZC9vciB1cGdyYWRlIGEgYEJ1Y2tldGAuXHJcbiAqIFxyXG4gKiBAZXhwb3J0XHJcbiAqIEBpbnRlcmZhY2UgQnVja2V0U2V0dGluZ3NcclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgQnVja2V0U2V0dGluZ3Mge1xyXG4gIC8qKlxyXG4gICAqIE5hbWUgdXNlZCBmb3IgdHJhY2tpbmcgYW5kIGRlYnVnZ2luZyBhIGJ1Y2tldCBpbnN0YW5jZS5cclxuICAgKiBcclxuICAgKiBAdHlwZSB7c3RyaW5nfVxyXG4gICAqIEBtZW1iZXJPZiBCdWNrZXRTZXR0aW5nc1xyXG4gICAqL1xyXG4gIG5hbWU/OiBzdHJpbmc7XHJcblxyXG4gIC8qKlxyXG4gICAqIFRoZSBuYW1lc3BhY2UgdXNlZCBieSB0aGUgYnVja2V0IHdoZW4gYWNjZXNzaW5nIGFueSBpdGVtcy5cclxuICAgKiBcclxuICAgKiBUaGlzIGlzIHVzZWQgdG8gZGlzdGluZ3Vpc2ggb25lIGJ1Y2tldCdzIGNvbnRlbnRzIGZyb20gYW5vdGhlci4gXHJcbiAgICogXHJcbiAgICogQHR5cGUge3N0cmluZ31cclxuICAgKiBAbWVtYmVyT2YgQnVja2V0U2V0dGluZ3NcclxuICAgKi9cclxuICBuYW1lc3BhY2U/OiBzdHJpbmc7XHJcblxyXG4gIC8qKlxyXG4gICAqIFRoZSBjdXJyZW50IHZlcnNpb24gb2YgdGhlIGJ1Y2tldC5cclxuICAgKiBcclxuICAgKiBVc2VkIHRvIGlkZW50aWZ5IHRoZSB2ZXJzaW9uIG9mIHRoZSBidWNrZXQncyBzY2hlbWEgYW5kIHRodXMgbWlncmF0ZSBpdCBcclxuICAgKiBhcyBuZWVkZWQuXHJcbiAgICogXHJcbiAgICogQHR5cGUge251bWJlcn1cclxuICAgKiBAbWVtYmVyT2YgQnVja2V0U2V0dGluZ3NcclxuICAgKi9cclxuICB2ZXJzaW9uPzogbnVtYmVyO1xyXG59XHJcblxyXG5leHBvcnQgdHlwZSBCVUNLRVRfRVZFTlRTID0gJ3VwZ3JhZGUnO1xyXG5cclxuLyoqXHJcbiAqIEJ1Y2tldHMgY2FuIHBlcnNpc3Qgc3RhdGUuIFRoZSBiYXNlIGBCdWNrZXRgIGNsYXNzIGlzIGFic3RyYWN0IGFuZCBzaG91bGQgYmVcclxuICogZXh0ZW5kZWQgdG8gY3JlYXRlZCBidWNrZXRzIHdpdGggZGlmZmVyZW50IHBlcnNpc3RlbmNlIHN0cmF0ZWdpZXMuXHJcbiAqXHJcbiAqIEJ1Y2tldHMgaGF2ZSBhIHNpbXBsZSBtYXAtbGlrZSBpbnRlcmZhY2Ugd2l0aCBtZXRob2RzIGxpa2UgYGdldEl0ZW1gLFxyXG4gKiBgc2V0SXRlbWAsIGFuZCBgcmVtb3ZlSXRlbWAuIEFsbCBtZXRob2RzIHJldHVybiBwcm9taXNlcyB0byBlbmFibGUgdXNhZ2Ugd2l0aFxyXG4gKiBhc3luY2hyb25vdXMgc3RvcmVzIGxpa2UgSW5kZXhlZERCLlxyXG4gKlxyXG4gKiBCdWNrZXRzIGNhbiBiZSBhc3NpZ25lZCBhIHVuaXF1ZSBgbmFtZXNwYWNlYCBpbiBvcmRlciB0byBhdm9pZCBjb2xsaXNpb25zLlxyXG4gKiBcclxuICogQnVja2V0cyBjYW4gYmUgYXNzaWduZWQgYSB2ZXJzaW9uLCBhbmQgY2FuIGJlIFwidXBncmFkZWRcIiB0byBhIG5ldyB2ZXJzaW9uLlxyXG4gKiBUaGUgdXBncmFkZSBwcm9jZXNzIGFsbG93cyBidWNrZXRzIHRvIG1pZ3JhdGUgdGhlaXIgZGF0YSBiZXR3ZWVuIHZlcnNpb25zLlxyXG4gKlxyXG4gKiBAZXhwb3J0XHJcbiAqIEBhYnN0cmFjdFxyXG4gKiBAY2xhc3MgQnVja2V0XHJcbiAqIEBpbXBsZW1lbnRzIHtFdmVudGVkfVxyXG4gKi9cclxuQGV2ZW50ZWRcclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEJ1Y2tldCBpbXBsZW1lbnRzIEV2ZW50ZWQge1xyXG4gIHByaXZhdGUgX25hbWU6IHN0cmluZztcclxuICBwcml2YXRlIF9uYW1lc3BhY2U6IHN0cmluZztcclxuICBwcml2YXRlIF92ZXJzaW9uOiBudW1iZXI7XHJcblxyXG4gIC8vIEV2ZW50ZWQgaW50ZXJmYWNlIHN0dWJzXHJcbiAgb246IChldmVudDogQlVDS0VUX0VWRU5UUywgY2FsbGJhY2s6IEZ1bmN0aW9uLCBiaW5kaW5nPzogb2JqZWN0KSA9PiB2b2lkO1xyXG4gIG9mZjogKGV2ZW50OiBCVUNLRVRfRVZFTlRTLCBjYWxsYmFjazogRnVuY3Rpb24sIGJpbmRpbmc/OiBvYmplY3QpID0+IHZvaWQ7XHJcbiAgb25lOiAoZXZlbnQ6IEJVQ0tFVF9FVkVOVFMsIGNhbGxiYWNrOiBGdW5jdGlvbiwgYmluZGluZz86IG9iamVjdCkgPT4gdm9pZDtcclxuICBlbWl0OiAoZXZlbnQ6IEJVQ0tFVF9FVkVOVFMsIC4uLmFyZ3MpID0+IHZvaWQ7XHJcbiAgbGlzdGVuZXJzOiAoZXZlbnQ6IEJVQ0tFVF9FVkVOVFMpID0+IGFueVtdO1xyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIGBCdWNrZXRgLlxyXG4gICAqIFxyXG4gICAqIEBwYXJhbSB7QnVja2V0U2V0dGluZ3N9IFtzZXR0aW5ncz17fV0gXHJcbiAgICogXHJcbiAgICogQG1lbWJlck9mIEJ1Y2tldFxyXG4gICAqL1xyXG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzOiBCdWNrZXRTZXR0aW5ncyA9IHt9KSB7XHJcbiAgICBpZiAoc2V0dGluZ3MudmVyc2lvbiA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHNldHRpbmdzLnZlcnNpb24gPSAxO1xyXG4gICAgfVxyXG5cclxuICAgIHNldHRpbmdzLm5hbWVzcGFjZSA9IHNldHRpbmdzLm5hbWVzcGFjZSB8fCAnb3JiaXQtYnVja2V0JztcclxuXHJcbiAgICB0aGlzLl9hcHBseVNldHRpbmdzKHNldHRpbmdzKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHJpZXZlcyBhbiBpdGVtIGZyb20gdGhlIGJ1Y2tldC5cclxuICAgKiBcclxuICAgKiBAYWJzdHJhY3RcclxuICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IFxyXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPGFueT59IFxyXG4gICAqIFxyXG4gICAqIEBtZW1iZXJPZiBCdWNrZXRcclxuICAgKi9cclxuICBhYnN0cmFjdCBnZXRJdGVtKGtleTogc3RyaW5nKTogUHJvbWlzZTxhbnk+O1xyXG5cclxuICAvKipcclxuICAgKiBTdG9yZXMgYW4gaXRlbSBpbiB0aGUgYnVja2V0LlxyXG4gICAqIFxyXG4gICAqIEBhYnN0cmFjdFxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgXHJcbiAgICogQHBhcmFtIHsqfSB2YWx1ZSBcclxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkPn0gXHJcbiAgICogXHJcbiAgICogQG1lbWJlck9mIEJ1Y2tldFxyXG4gICAqL1xyXG4gIGFic3RyYWN0IHNldEl0ZW0oa2V5OiBzdHJpbmcsIHZhbHVlOiBhbnkpOiBQcm9taXNlPHZvaWQ+O1xyXG5cclxuICAvKipcclxuICAgKiBSZW1vdmVzIGFuIGl0ZW0gZnJvbSB0aGUgYnVja2V0LlxyXG4gICAqIFxyXG4gICAqIEBhYnN0cmFjdFxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgXHJcbiAgICogQHJldHVybnMge1Byb21pc2U8dm9pZD59IFxyXG4gICAqIFxyXG4gICAqIEBtZW1iZXJPZiBCdWNrZXRcclxuICAgKi9cclxuICBhYnN0cmFjdCByZW1vdmVJdGVtKGtleTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPjtcclxuXHJcbiAgLyoqXHJcbiAgICogTmFtZSB1c2VkIGZvciB0cmFja2luZyBhbmQgZGVidWdnaW5nIGEgYnVja2V0IGluc3RhbmNlLlxyXG4gICAqIFxyXG4gICAqIEByZWFkb25seVxyXG4gICAqIEB0eXBlIHtzdHJpbmd9XHJcbiAgICogQG1lbWJlck9mIEJ1Y2tldFxyXG4gICAqL1xyXG4gIGdldCBuYW1lKCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5fbmFtZTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFRoZSBuYW1lc3BhY2UgdXNlZCBieSB0aGUgYnVja2V0IHdoZW4gYWNjZXNzaW5nIGFueSBpdGVtcy5cclxuICAgKiBcclxuICAgKiBUaGlzIGlzIHVzZWQgdG8gZGlzdGluZ3Vpc2ggb25lIGJ1Y2tldCdzIGNvbnRlbnRzIGZyb20gYW5vdGhlci5cclxuICAgKiBcclxuICAgKiBAcmVhZG9ubHlcclxuICAgKiBAdHlwZSB7c3RyaW5nfVxyXG4gICAqIEBtZW1iZXJPZiBCdWNrZXRcclxuICAgKi9cclxuICBnZXQgbmFtZXNwYWNlKCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5fbmFtZXNwYWNlO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVGhlIGN1cnJlbnQgdmVyc2lvbiBvZiB0aGUgYnVja2V0LlxyXG4gICAqIFxyXG4gICAqIFRvIGNoYW5nZSB2ZXJzaW9ucywgYHVwZ3JhZGVgIHNob3VsZCBiZSBpbnZva2VkLlxyXG4gICAqIFxyXG4gICAqIEByZWFkb25seVxyXG4gICAqIEB0eXBlIHtudW1iZXJ9XHJcbiAgICogQG1lbWJlck9mIEJ1Y2tldFxyXG4gICAqL1xyXG4gIGdldCB2ZXJzaW9uKCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gdGhpcy5fdmVyc2lvbjtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFVwZ3JhZGVzIEJ1Y2tldCB0byBhIG5ldyB2ZXJzaW9uIHdpdGggbmV3IHNldHRpbmdzLlxyXG4gICAqXHJcbiAgICogU2V0dGluZ3MsIGJleW9uZCBgdmVyc2lvbmAsIGFyZSBidWNrZXQtc3BlY2lmaWMuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge0J1Y2tldFNldHRpbmdzfSBzZXR0aW5ncyBcclxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkPn0gXHJcbiAgICogQG1lbWJlck9mIEJ1Y2tldFxyXG4gICAgKi9cclxuICB1cGdyYWRlKHNldHRpbmdzOiBCdWNrZXRTZXR0aW5ncyA9IHt9KTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICBpZiAoc2V0dGluZ3MudmVyc2lvbiA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHNldHRpbmdzLnZlcnNpb24gPSB0aGlzLl92ZXJzaW9uICsgMTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLl9hcHBseVNldHRpbmdzKHNldHRpbmdzKVxyXG4gICAgICAudGhlbigoKSA9PiB0aGlzLmVtaXQoJ3VwZ3JhZGUnLCB0aGlzLl92ZXJzaW9uKSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBBcHBsaWVzIHNldHRpbmdzIHBhc3NlZCBmcm9tIGEgYGNvbnN0cnVjdG9yYCBvciBgdXBncmFkZWAuXHJcbiAgICogXHJcbiAgICogQHBhcmFtIHtCdWNrZXRTZXR0aW5nc30gc2V0dGluZ3MgXHJcbiAgICogQHJldHVybnMge1Byb21pc2U8dm9pZD59IFxyXG4gICAqIEBtZW1iZXJPZiBCdWNrZXRcclxuICAgKi9cclxuICBfYXBwbHlTZXR0aW5ncyhzZXR0aW5nczogQnVja2V0U2V0dGluZ3MpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIGlmIChzZXR0aW5ncy5uYW1lKSB7XHJcbiAgICAgIHRoaXMuX25hbWUgPSBzZXR0aW5ncy5uYW1lO1xyXG4gICAgfVxyXG4gICAgaWYgKHNldHRpbmdzLm5hbWVzcGFjZSkge1xyXG4gICAgICB0aGlzLl9uYW1lc3BhY2UgPSBzZXR0aW5ncy5uYW1lc3BhY2U7XHJcbiAgICB9XHJcbiAgICB0aGlzLl92ZXJzaW9uID0gc2V0dGluZ3MudmVyc2lvbjtcclxuICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKTtcclxuICB9XHJcbn1cclxuIl19