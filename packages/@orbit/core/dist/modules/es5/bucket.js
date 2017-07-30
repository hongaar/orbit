"use strict";

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
        if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }return c > 3 && r && Object.defineProperty(target, key, r), r;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVja2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3JjL2J1Y2tldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHFCQUEyQjtBQUMzQix3QkFBNkM7QUEwQzdDLEFBaUJHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFSDtBQVlFLEFBTUc7Ozs7Ozs7QUFDSCxvQkFBWSxBQUE2QjtBQUE3QixpQ0FBQTtBQUFBLHVCQUE2Qjs7QUFDdkMsQUFBRSxBQUFDLFlBQUMsQUFBUSxTQUFDLEFBQU8sWUFBSyxBQUFTLEFBQUMsV0FBQyxBQUFDO0FBQ25DLEFBQVEscUJBQUMsQUFBTyxVQUFHLEFBQUMsQUFBQyxBQUN2QjtBQUFDO0FBRUQsQUFBUSxpQkFBQyxBQUFTLFlBQUcsQUFBUSxTQUFDLEFBQVMsYUFBSSxBQUFjLEFBQUM7QUFFMUQsQUFBSSxhQUFDLEFBQWMsZUFBQyxBQUFRLEFBQUMsQUFBQyxBQUNoQztBQUFDO0FBMkNELDBCQUFJLGtCQUFJO0FBUFIsQUFNRzs7Ozs7OzthQUNIO0FBQ0UsQUFBTSxtQkFBQyxBQUFJLEtBQUMsQUFBSyxBQUFDLEFBQ3BCO0FBQUM7O3NCQUFBOztBQVdELDBCQUFJLGtCQUFTO0FBVGIsQUFRRzs7Ozs7Ozs7O2FBQ0g7QUFDRSxBQUFNLG1CQUFDLEFBQUksS0FBQyxBQUFVLEFBQUMsQUFDekI7QUFBQzs7c0JBQUE7O0FBV0QsMEJBQUksa0JBQU87QUFUWCxBQVFHOzs7Ozs7Ozs7YUFDSDtBQUNFLEFBQU0sbUJBQUMsQUFBSSxLQUFDLEFBQVEsQUFBQyxBQUN2QjtBQUFDOztzQkFBQTs7QUFFRCxBQVFJOzs7Ozs7Ozs7QUFDSixxQkFBTyxVQUFQLFVBQVEsQUFBNkI7QUFBckMsb0JBTUM7QUFOTyxpQ0FBQTtBQUFBLHVCQUE2Qjs7QUFDbkMsQUFBRSxBQUFDLFlBQUMsQUFBUSxTQUFDLEFBQU8sWUFBSyxBQUFTLEFBQUMsV0FBQyxBQUFDO0FBQ25DLEFBQVEscUJBQUMsQUFBTyxVQUFHLEFBQUksS0FBQyxBQUFRLFdBQUcsQUFBQyxBQUFDLEFBQ3ZDO0FBQUM7QUFDRCxBQUFNLG9CQUFNLEFBQWMsZUFBQyxBQUFRLEFBQUMsVUFDakMsQUFBSSxLQUFDO0FBQU0sbUJBQUEsQUFBSSxNQUFDLEFBQUksS0FBQyxBQUFTLFdBQUUsQUFBSSxNQUF6QixBQUEwQixBQUFRLEFBQUM7QUFBQSxBQUFDLEFBQUMsQUFDckQsU0FGUyxBQUFJO0FBRVo7QUFFRCxBQU1HOzs7Ozs7O0FBQ0gscUJBQWMsaUJBQWQsVUFBZSxBQUF3QjtBQUNyQyxBQUFFLEFBQUMsWUFBQyxBQUFRLFNBQUMsQUFBSSxBQUFDLE1BQUMsQUFBQztBQUNsQixBQUFJLGlCQUFDLEFBQUssUUFBRyxBQUFRLFNBQUMsQUFBSSxBQUFDLEFBQzdCO0FBQUM7QUFDRCxBQUFFLEFBQUMsWUFBQyxBQUFRLFNBQUMsQUFBUyxBQUFDLFdBQUMsQUFBQztBQUN2QixBQUFJLGlCQUFDLEFBQVUsYUFBRyxBQUFRLFNBQUMsQUFBUyxBQUFDLEFBQ3ZDO0FBQUM7QUFDRCxBQUFJLGFBQUMsQUFBUSxXQUFHLEFBQVEsU0FBQyxBQUFPLEFBQUM7QUFDakMsQUFBTSxlQUFDLE9BQUssUUFBQyxBQUFPLFFBQUMsQUFBTyxBQUFFLEFBQUMsQUFDakM7QUFBQztBQXJJbUIsQUFBTSx5QkFEM0IsVUFBTyxVQUNjLEFBQU0sQUFzSTNCO0FBQUQsV0FBQztBQXRJRCxBQXNJQztBQXRJcUIsaUJBQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgT3JiaXQgZnJvbSAnLi9tYWluJztcclxuaW1wb3J0IGV2ZW50ZWQsIHsgRXZlbnRlZCB9IGZyb20gJy4vZXZlbnRlZCc7XHJcbmltcG9ydCB7IGFzc2VydCB9IGZyb20gJ0BvcmJpdC91dGlscyc7XHJcblxyXG4vKipcclxuICogU2V0dGluZ3MgdXNlZCB0byBpbnN0YW50aWF0ZSBhbmQvb3IgdXBncmFkZSBhIGBCdWNrZXRgLlxyXG4gKiBcclxuICogQGV4cG9ydFxyXG4gKiBAaW50ZXJmYWNlIEJ1Y2tldFNldHRpbmdzXHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIEJ1Y2tldFNldHRpbmdzIHtcclxuICAvKipcclxuICAgKiBOYW1lIHVzZWQgZm9yIHRyYWNraW5nIGFuZCBkZWJ1Z2dpbmcgYSBidWNrZXQgaW5zdGFuY2UuXHJcbiAgICogXHJcbiAgICogQHR5cGUge3N0cmluZ31cclxuICAgKiBAbWVtYmVyT2YgQnVja2V0U2V0dGluZ3NcclxuICAgKi9cclxuICBuYW1lPzogc3RyaW5nO1xyXG5cclxuICAvKipcclxuICAgKiBUaGUgbmFtZXNwYWNlIHVzZWQgYnkgdGhlIGJ1Y2tldCB3aGVuIGFjY2Vzc2luZyBhbnkgaXRlbXMuXHJcbiAgICogXHJcbiAgICogVGhpcyBpcyB1c2VkIHRvIGRpc3Rpbmd1aXNoIG9uZSBidWNrZXQncyBjb250ZW50cyBmcm9tIGFub3RoZXIuIFxyXG4gICAqIFxyXG4gICAqIEB0eXBlIHtzdHJpbmd9XHJcbiAgICogQG1lbWJlck9mIEJ1Y2tldFNldHRpbmdzXHJcbiAgICovXHJcbiAgbmFtZXNwYWNlPzogc3RyaW5nO1xyXG5cclxuICAvKipcclxuICAgKiBUaGUgY3VycmVudCB2ZXJzaW9uIG9mIHRoZSBidWNrZXQuXHJcbiAgICogXHJcbiAgICogVXNlZCB0byBpZGVudGlmeSB0aGUgdmVyc2lvbiBvZiB0aGUgYnVja2V0J3Mgc2NoZW1hIGFuZCB0aHVzIG1pZ3JhdGUgaXQgXHJcbiAgICogYXMgbmVlZGVkLlxyXG4gICAqIFxyXG4gICAqIEB0eXBlIHtudW1iZXJ9XHJcbiAgICogQG1lbWJlck9mIEJ1Y2tldFNldHRpbmdzXHJcbiAgICovXHJcbiAgdmVyc2lvbj86IG51bWJlcjtcclxufVxyXG5cclxuZXhwb3J0IHR5cGUgQlVDS0VUX0VWRU5UUyA9ICd1cGdyYWRlJztcclxuXHJcbi8qKlxyXG4gKiBCdWNrZXRzIGNhbiBwZXJzaXN0IHN0YXRlLiBUaGUgYmFzZSBgQnVja2V0YCBjbGFzcyBpcyBhYnN0cmFjdCBhbmQgc2hvdWxkIGJlXHJcbiAqIGV4dGVuZGVkIHRvIGNyZWF0ZWQgYnVja2V0cyB3aXRoIGRpZmZlcmVudCBwZXJzaXN0ZW5jZSBzdHJhdGVnaWVzLlxyXG4gKlxyXG4gKiBCdWNrZXRzIGhhdmUgYSBzaW1wbGUgbWFwLWxpa2UgaW50ZXJmYWNlIHdpdGggbWV0aG9kcyBsaWtlIGBnZXRJdGVtYCxcclxuICogYHNldEl0ZW1gLCBhbmQgYHJlbW92ZUl0ZW1gLiBBbGwgbWV0aG9kcyByZXR1cm4gcHJvbWlzZXMgdG8gZW5hYmxlIHVzYWdlIHdpdGhcclxuICogYXN5bmNocm9ub3VzIHN0b3JlcyBsaWtlIEluZGV4ZWREQi5cclxuICpcclxuICogQnVja2V0cyBjYW4gYmUgYXNzaWduZWQgYSB1bmlxdWUgYG5hbWVzcGFjZWAgaW4gb3JkZXIgdG8gYXZvaWQgY29sbGlzaW9ucy5cclxuICogXHJcbiAqIEJ1Y2tldHMgY2FuIGJlIGFzc2lnbmVkIGEgdmVyc2lvbiwgYW5kIGNhbiBiZSBcInVwZ3JhZGVkXCIgdG8gYSBuZXcgdmVyc2lvbi5cclxuICogVGhlIHVwZ3JhZGUgcHJvY2VzcyBhbGxvd3MgYnVja2V0cyB0byBtaWdyYXRlIHRoZWlyIGRhdGEgYmV0d2VlbiB2ZXJzaW9ucy5cclxuICpcclxuICogQGV4cG9ydFxyXG4gKiBAYWJzdHJhY3RcclxuICogQGNsYXNzIEJ1Y2tldFxyXG4gKiBAaW1wbGVtZW50cyB7RXZlbnRlZH1cclxuICovXHJcbkBldmVudGVkXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBCdWNrZXQgaW1wbGVtZW50cyBFdmVudGVkIHtcclxuICBwcml2YXRlIF9uYW1lOiBzdHJpbmc7XHJcbiAgcHJpdmF0ZSBfbmFtZXNwYWNlOiBzdHJpbmc7XHJcbiAgcHJpdmF0ZSBfdmVyc2lvbjogbnVtYmVyO1xyXG5cclxuICAvLyBFdmVudGVkIGludGVyZmFjZSBzdHVic1xyXG4gIG9uOiAoZXZlbnQ6IEJVQ0tFVF9FVkVOVFMsIGNhbGxiYWNrOiBGdW5jdGlvbiwgYmluZGluZz86IG9iamVjdCkgPT4gdm9pZDtcclxuICBvZmY6IChldmVudDogQlVDS0VUX0VWRU5UUywgY2FsbGJhY2s6IEZ1bmN0aW9uLCBiaW5kaW5nPzogb2JqZWN0KSA9PiB2b2lkO1xyXG4gIG9uZTogKGV2ZW50OiBCVUNLRVRfRVZFTlRTLCBjYWxsYmFjazogRnVuY3Rpb24sIGJpbmRpbmc/OiBvYmplY3QpID0+IHZvaWQ7XHJcbiAgZW1pdDogKGV2ZW50OiBCVUNLRVRfRVZFTlRTLCAuLi5hcmdzKSA9PiB2b2lkO1xyXG4gIGxpc3RlbmVyczogKGV2ZW50OiBCVUNLRVRfRVZFTlRTKSA9PiBhbnlbXTtcclxuXHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiBgQnVja2V0YC5cclxuICAgKiBcclxuICAgKiBAcGFyYW0ge0J1Y2tldFNldHRpbmdzfSBbc2V0dGluZ3M9e31dIFxyXG4gICAqIFxyXG4gICAqIEBtZW1iZXJPZiBCdWNrZXRcclxuICAgKi9cclxuICBjb25zdHJ1Y3RvcihzZXR0aW5nczogQnVja2V0U2V0dGluZ3MgPSB7fSkge1xyXG4gICAgaWYgKHNldHRpbmdzLnZlcnNpb24gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICBzZXR0aW5ncy52ZXJzaW9uID0gMTtcclxuICAgIH1cclxuXHJcbiAgICBzZXR0aW5ncy5uYW1lc3BhY2UgPSBzZXR0aW5ncy5uYW1lc3BhY2UgfHwgJ29yYml0LWJ1Y2tldCc7XHJcblxyXG4gICAgdGhpcy5fYXBwbHlTZXR0aW5ncyhzZXR0aW5ncyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXRyaWV2ZXMgYW4gaXRlbSBmcm9tIHRoZSBidWNrZXQuXHJcbiAgICogXHJcbiAgICogQGFic3RyYWN0XHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBcclxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxhbnk+fSBcclxuICAgKiBcclxuICAgKiBAbWVtYmVyT2YgQnVja2V0XHJcbiAgICovXHJcbiAgYWJzdHJhY3QgZ2V0SXRlbShrZXk6IHN0cmluZyk6IFByb21pc2U8YW55PjtcclxuXHJcbiAgLyoqXHJcbiAgICogU3RvcmVzIGFuIGl0ZW0gaW4gdGhlIGJ1Y2tldC5cclxuICAgKiBcclxuICAgKiBAYWJzdHJhY3RcclxuICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IFxyXG4gICAqIEBwYXJhbSB7Kn0gdmFsdWUgXHJcbiAgICogQHJldHVybnMge1Byb21pc2U8dm9pZD59IFxyXG4gICAqIFxyXG4gICAqIEBtZW1iZXJPZiBCdWNrZXRcclxuICAgKi9cclxuICBhYnN0cmFjdCBzZXRJdGVtKGtleTogc3RyaW5nLCB2YWx1ZTogYW55KTogUHJvbWlzZTx2b2lkPjtcclxuXHJcbiAgLyoqXHJcbiAgICogUmVtb3ZlcyBhbiBpdGVtIGZyb20gdGhlIGJ1Y2tldC5cclxuICAgKiBcclxuICAgKiBAYWJzdHJhY3RcclxuICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IFxyXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPHZvaWQ+fSBcclxuICAgKiBcclxuICAgKiBAbWVtYmVyT2YgQnVja2V0XHJcbiAgICovXHJcbiAgYWJzdHJhY3QgcmVtb3ZlSXRlbShrZXk6IHN0cmluZyk6IFByb21pc2U8dm9pZD47XHJcblxyXG4gIC8qKlxyXG4gICAqIE5hbWUgdXNlZCBmb3IgdHJhY2tpbmcgYW5kIGRlYnVnZ2luZyBhIGJ1Y2tldCBpbnN0YW5jZS5cclxuICAgKiBcclxuICAgKiBAcmVhZG9ubHlcclxuICAgKiBAdHlwZSB7c3RyaW5nfVxyXG4gICAqIEBtZW1iZXJPZiBCdWNrZXRcclxuICAgKi9cclxuICBnZXQgbmFtZSgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMuX25hbWU7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBUaGUgbmFtZXNwYWNlIHVzZWQgYnkgdGhlIGJ1Y2tldCB3aGVuIGFjY2Vzc2luZyBhbnkgaXRlbXMuXHJcbiAgICogXHJcbiAgICogVGhpcyBpcyB1c2VkIHRvIGRpc3Rpbmd1aXNoIG9uZSBidWNrZXQncyBjb250ZW50cyBmcm9tIGFub3RoZXIuXHJcbiAgICogXHJcbiAgICogQHJlYWRvbmx5XHJcbiAgICogQHR5cGUge3N0cmluZ31cclxuICAgKiBAbWVtYmVyT2YgQnVja2V0XHJcbiAgICovXHJcbiAgZ2V0IG5hbWVzcGFjZSgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMuX25hbWVzcGFjZTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFRoZSBjdXJyZW50IHZlcnNpb24gb2YgdGhlIGJ1Y2tldC5cclxuICAgKiBcclxuICAgKiBUbyBjaGFuZ2UgdmVyc2lvbnMsIGB1cGdyYWRlYCBzaG91bGQgYmUgaW52b2tlZC5cclxuICAgKiBcclxuICAgKiBAcmVhZG9ubHlcclxuICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAqIEBtZW1iZXJPZiBCdWNrZXRcclxuICAgKi9cclxuICBnZXQgdmVyc2lvbigpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIHRoaXMuX3ZlcnNpb247XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBVcGdyYWRlcyBCdWNrZXQgdG8gYSBuZXcgdmVyc2lvbiB3aXRoIG5ldyBzZXR0aW5ncy5cclxuICAgKlxyXG4gICAqIFNldHRpbmdzLCBiZXlvbmQgYHZlcnNpb25gLCBhcmUgYnVja2V0LXNwZWNpZmljLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtCdWNrZXRTZXR0aW5nc30gc2V0dGluZ3MgXHJcbiAgICogQHJldHVybnMge1Byb21pc2U8dm9pZD59IFxyXG4gICAqIEBtZW1iZXJPZiBCdWNrZXRcclxuICAgICovXHJcbiAgdXBncmFkZShzZXR0aW5nczogQnVja2V0U2V0dGluZ3MgPSB7fSk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgaWYgKHNldHRpbmdzLnZlcnNpb24gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICBzZXR0aW5ncy52ZXJzaW9uID0gdGhpcy5fdmVyc2lvbiArIDE7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5fYXBwbHlTZXR0aW5ncyhzZXR0aW5ncylcclxuICAgICAgLnRoZW4oKCkgPT4gdGhpcy5lbWl0KCd1cGdyYWRlJywgdGhpcy5fdmVyc2lvbikpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQXBwbGllcyBzZXR0aW5ncyBwYXNzZWQgZnJvbSBhIGBjb25zdHJ1Y3RvcmAgb3IgYHVwZ3JhZGVgLlxyXG4gICAqIFxyXG4gICAqIEBwYXJhbSB7QnVja2V0U2V0dGluZ3N9IHNldHRpbmdzIFxyXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPHZvaWQ+fSBcclxuICAgKiBAbWVtYmVyT2YgQnVja2V0XHJcbiAgICovXHJcbiAgX2FwcGx5U2V0dGluZ3Moc2V0dGluZ3M6IEJ1Y2tldFNldHRpbmdzKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICBpZiAoc2V0dGluZ3MubmFtZSkge1xyXG4gICAgICB0aGlzLl9uYW1lID0gc2V0dGluZ3MubmFtZTtcclxuICAgIH1cclxuICAgIGlmIChzZXR0aW5ncy5uYW1lc3BhY2UpIHtcclxuICAgICAgdGhpcy5fbmFtZXNwYWNlID0gc2V0dGluZ3MubmFtZXNwYWNlO1xyXG4gICAgfVxyXG4gICAgdGhpcy5fdmVyc2lvbiA9IHNldHRpbmdzLnZlcnNpb247XHJcbiAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgfVxyXG59XHJcbiJdfQ==