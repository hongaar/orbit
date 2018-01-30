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
var core_1 = require("@orbit/core");
var query_builder_1 = require("./query-builder");
var transform_builder_1 = require("./transform-builder");
var utils_1 = require("@orbit/utils");
/**
 Base class for sources.

 @class Source
 @namespace Orbit
 @param {Object} [settings] - settings for source
 @param {String} [settings.name] - Name for source
 @param {Schema} [settings.schema] - Schema for source
 @constructor
 */
var Source = function () {
    function Source(settings) {
        if (settings === void 0) {
            settings = {};
        }
        var _this = this;
        this._schema = settings.schema;
        this._keyMap = settings.keyMap;
        var name = this._name = settings.name;
        var bucket = this._bucket = settings.bucket;
        this._queryBuilder = settings.queryBuilder;
        this._transformBuilder = settings.transformBuilder;
        if (bucket) {
            utils_1.assert('TransformLog requires a name if it has a bucket', !!name);
        }
        this._transformLog = new core_1.Log({ name: name ? name + "-log" : undefined, bucket: bucket });
        this._requestQueue = new core_1.TaskQueue(this, { name: name ? name + "-requests" : undefined, bucket: bucket });
        this._syncQueue = new core_1.TaskQueue(this, { name: name ? name + "-sync" : undefined, bucket: bucket });
        if (this._schema && (settings.autoUpgrade === undefined || settings.autoUpgrade)) {
            this._schema.on('upgrade', function () {
                return _this.upgrade();
            });
        }
    }
    Object.defineProperty(Source.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Source.prototype, "schema", {
        get: function () {
            return this._schema;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Source.prototype, "keyMap", {
        get: function () {
            return this._keyMap;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Source.prototype, "bucket", {
        get: function () {
            return this._bucket;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Source.prototype, "transformLog", {
        get: function () {
            return this._transformLog;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Source.prototype, "requestQueue", {
        get: function () {
            return this._requestQueue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Source.prototype, "syncQueue", {
        get: function () {
            return this._syncQueue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Source.prototype, "queryBuilder", {
        get: function () {
            var qb = this._queryBuilder;
            if (qb === undefined) {
                qb = this._queryBuilder = new query_builder_1.default();
            }
            return qb;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Source.prototype, "transformBuilder", {
        get: function () {
            var tb = this._transformBuilder;
            if (tb === undefined) {
                tb = this._transformBuilder = new transform_builder_1.default({
                    recordInitializer: this._schema
                });
            }
            return tb;
        },
        enumerable: true,
        configurable: true
    });
    // Performer interface
    Source.prototype.perform = function (task) {
        var method = "__" + task.type + "__";
        return this[method].call(this, task.data);
    };
    ;
    /**
     * Upgrade source as part of a schema upgrade.
     *
     * @returns {Promise<void>}
     * @memberof Source
     */
    Source.prototype.upgrade = function () {
        return main_1.default.Promise.resolve();
    };
    /////////////////////////////////////////////////////////////////////////////
    // Private methods
    /////////////////////////////////////////////////////////////////////////////
    /**
     Notifies listeners that this source has been transformed by emitting the
     `transform` event.
        Resolves when any promises returned to event listeners are resolved.
        Also, adds an entry to the Source's `transformLog` for each transform.
        @private
     @method _transformed
     @param {Array} transforms - Transforms that have occurred.
     @returns {Promise} Promise that resolves to transforms.
    */
    Source.prototype._transformed = function (transforms) {
        var _this = this;
        return transforms.reduce(function (chain, transform) {
            return chain.then(function () {
                if (_this._transformLog.contains(transform.id)) {
                    return main_1.default.Promise.resolve();
                }
                return _this._transformLog.append(transform.id).then(function () {
                    return core_1.settleInSeries(_this, 'transform', transform);
                });
            });
        }, main_1.default.Promise.resolve()).then(function () {
            return transforms;
        });
    };
    Source.prototype._enqueueRequest = function (type, data) {
        return this._requestQueue.push({ type: type, data: data });
    };
    Source.prototype._enqueueSync = function (type, data) {
        return this._syncQueue.push({ type: type, data: data });
    };
    Source = __decorate([core_1.evented], Source);
    return Source;
}();
exports.Source = Source;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3JjL3NvdXJjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEscUJBQTJCO0FBQzNCLHFCQU1xQjtBQUdyQiw4QkFBMkM7QUFFM0Msa0NBQW1EO0FBQ25ELHNCQUFzQztBQWN0QyxBQVNHOzs7Ozs7Ozs7O0FBRUg7QUFrQkUsb0JBQVksQUFBNkI7QUFBN0IsaUNBQUE7QUFBQSx1QkFBNkI7O0FBQXpDLG9CQW1CQztBQWxCQyxBQUFJLGFBQUMsQUFBTyxVQUFHLEFBQVEsU0FBQyxBQUFNLEFBQUM7QUFDL0IsQUFBSSxhQUFDLEFBQU8sVUFBRyxBQUFRLFNBQUMsQUFBTSxBQUFDO0FBQy9CLFlBQU0sQUFBSSxPQUFHLEFBQUksS0FBQyxBQUFLLFFBQUcsQUFBUSxTQUFDLEFBQUksQUFBQztBQUN4QyxZQUFNLEFBQU0sU0FBRyxBQUFJLEtBQUMsQUFBTyxVQUFHLEFBQVEsU0FBQyxBQUFNLEFBQUM7QUFDOUMsQUFBSSxhQUFDLEFBQWEsZ0JBQUcsQUFBUSxTQUFDLEFBQVksQUFBQztBQUMzQyxBQUFJLGFBQUMsQUFBaUIsb0JBQUcsQUFBUSxTQUFDLEFBQWdCLEFBQUM7QUFFbkQsQUFBRSxBQUFDLFlBQUMsQUFBTSxBQUFDLFFBQUMsQUFBQztBQUNYLG9CQUFNLE9BQUMsQUFBaUQsbURBQUUsQ0FBQyxDQUFDLEFBQUksQUFBQyxBQUFDLEFBQ3BFO0FBQUM7QUFFRCxBQUFJLGFBQUMsQUFBYSxnQkFBRyxJQUFJLE9BQUcsSUFBQyxFQUFFLEFBQUksTUFBRSxBQUFJLE9BQU0sQUFBSSxPQUFNLFNBQUcsQUFBUyxXQUFFLEFBQU0sUUFBQSxBQUFFLEFBQUMsQUFBQztBQUNqRixBQUFJLGFBQUMsQUFBYSxnQkFBRyxJQUFJLE9BQVMsVUFBQyxBQUFJLE1BQUUsRUFBRSxBQUFJLE1BQUUsQUFBSSxPQUFNLEFBQUksT0FBVyxjQUFHLEFBQVMsV0FBRSxBQUFNLFFBQUEsQUFB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b250ZW50IjpbImltcG9ydCBPcmJpdCBmcm9tICcuL21haW4nO1xyXG5pbXBvcnQge1xyXG4gIGV2ZW50ZWQsIEV2ZW50ZWQsIHNldHRsZUluU2VyaWVzLFxyXG4gIEJ1Y2tldCxcclxuICBUYXNrUXVldWUsXHJcbiAgVGFzaywgUGVyZm9ybWVyLFxyXG4gIExvZ1xyXG59IGZyb20gJ0BvcmJpdC9jb3JlJztcclxuaW1wb3J0IEtleU1hcCBmcm9tICcuL2tleS1tYXAnO1xyXG5pbXBvcnQgU2NoZW1hIGZyb20gJy4vc2NoZW1hJztcclxuaW1wb3J0IFF1ZXJ5QnVpbGRlciBmcm9tICcuL3F1ZXJ5LWJ1aWxkZXInO1xyXG5pbXBvcnQgeyBUcmFuc2Zvcm0gfSBmcm9tICcuL3RyYW5zZm9ybSc7XHJcbmltcG9ydCBUcmFuc2Zvcm1CdWlsZGVyIGZyb20gJy4vdHJhbnNmb3JtLWJ1aWxkZXInO1xyXG5pbXBvcnQgeyBhc3NlcnQgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBTb3VyY2VTZXR0aW5ncyB7XHJcbiAgbmFtZT86IHN0cmluZztcclxuICBzY2hlbWE/OiBTY2hlbWE7XHJcbiAga2V5TWFwPzogS2V5TWFwO1xyXG4gIGJ1Y2tldD86IEJ1Y2tldDtcclxuICBxdWVyeUJ1aWxkZXI/OiBRdWVyeUJ1aWxkZXI7XHJcbiAgdHJhbnNmb3JtQnVpbGRlcj86IFRyYW5zZm9ybUJ1aWxkZXI7XHJcbiAgYXV0b1VwZ3JhZGU/OiBib29sZWFuO1xyXG59XHJcblxyXG5leHBvcnQgdHlwZSBTb3VyY2VDbGFzcyA9IChuZXcgKCkgPT4gU291cmNlKTtcclxuXHJcbi8qKlxyXG4gQmFzZSBjbGFzcyBmb3Igc291cmNlcy5cclxuXHJcbiBAY2xhc3MgU291cmNlXHJcbiBAbmFtZXNwYWNlIE9yYml0XHJcbiBAcGFyYW0ge09iamVjdH0gW3NldHRpbmdzXSAtIHNldHRpbmdzIGZvciBzb3VyY2VcclxuIEBwYXJhbSB7U3RyaW5nfSBbc2V0dGluZ3MubmFtZV0gLSBOYW1lIGZvciBzb3VyY2VcclxuIEBwYXJhbSB7U2NoZW1hfSBbc2V0dGluZ3Muc2NoZW1hXSAtIFNjaGVtYSBmb3Igc291cmNlXHJcbiBAY29uc3RydWN0b3JcclxuICovXHJcbkBldmVudGVkXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBTb3VyY2UgaW1wbGVtZW50cyBFdmVudGVkLCBQZXJmb3JtZXIge1xyXG4gIHByb3RlY3RlZCBfbmFtZTogc3RyaW5nO1xyXG4gIHByb3RlY3RlZCBfYnVja2V0OiBCdWNrZXQ7XHJcbiAgcHJvdGVjdGVkIF9rZXlNYXA6IEtleU1hcDtcclxuICBwcm90ZWN0ZWQgX3NjaGVtYTogU2NoZW1hO1xyXG4gIHByb3RlY3RlZCBfdHJhbnNmb3JtTG9nOiBMb2c7XHJcbiAgcHJvdGVjdGVkIF9yZXF1ZXN0UXVldWU6IFRhc2tRdWV1ZTtcclxuICBwcm90ZWN0ZWQgX3N5bmNRdWV1ZTogVGFza1F1ZXVlO1xyXG4gIHByb3RlY3RlZCBfcXVlcnlCdWlsZGVyOiBRdWVyeUJ1aWxkZXI7XHJcbiAgcHJvdGVjdGVkIF90cmFuc2Zvcm1CdWlsZGVyOiBUcmFuc2Zvcm1CdWlsZGVyO1xyXG5cclxuICAvLyBFdmVudGVkIGludGVyZmFjZSBzdHVic1xyXG4gIG9uOiAoZXZlbnQ6IHN0cmluZywgY2FsbGJhY2s6IEZ1bmN0aW9uLCBiaW5kaW5nPzogb2JqZWN0KSA9PiB2b2lkO1xyXG4gIG9mZjogKGV2ZW50OiBzdHJpbmcsIGNhbGxiYWNrOiBGdW5jdGlvbiwgYmluZGluZz86IG9iamVjdCkgPT4gdm9pZDtcclxuICBvbmU6IChldmVudDogc3RyaW5nLCBjYWxsYmFjazogRnVuY3Rpb24sIGJpbmRpbmc/OiBvYmplY3QpID0+IHZvaWQ7XHJcbiAgZW1pdDogKGV2ZW50OiBzdHJpbmcsIC4uLmFyZ3MpID0+IHZvaWQ7XHJcbiAgbGlzdGVuZXJzOiAoZXZlbnQ6IHN0cmluZykgPT4gYW55W107XHJcblxyXG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzOiBTb3VyY2VTZXR0aW5ncyA9IHt9KSB7XHJcbiAgICB0aGlzLl9zY2hlbWEgPSBzZXR0aW5ncy5zY2hlbWE7XHJcbiAgICB0aGlzLl9rZXlNYXAgPSBzZXR0aW5ncy5rZXlNYXA7XHJcbiAgICBjb25zdCBuYW1lID0gdGhpcy5fbmFtZSA9IHNldHRpbmdzLm5hbWU7XHJcbiAgICBjb25zdCBidWNrZXQgPSB0aGlzLl9idWNrZXQgPSBzZXR0aW5ncy5idWNrZXQ7XHJcbiAgICB0aGlzLl9xdWVyeUJ1aWxkZXIgPSBzZXR0aW5ncy5xdWVyeUJ1aWxkZXI7XHJcbiAgICB0aGlzLl90cmFuc2Zvcm1CdWlsZGVyID0gc2V0dGluZ3MudHJhbnNmb3JtQnVpbGRlcjtcclxuXHJcbiAgICBpZiAoYnVja2V0KSB7XHJcbiAgICAgIGFzc2VydCgnVHJhbnNmb3JtTG9nIHJlcXVpcmVzIGEgbmFtZSBpZiBpdCBoYXMgYSBidWNrZXQnLCAhIW5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuX3RyYW5zZm9ybUxvZyA9IG5ldyBMb2coeyBuYW1lOiBuYW1lID8gYCR7bmFtZX0tbG9nYCA6IHVuZGVmaW5lZCwgYnVja2V0IH0pO1xyXG4gICAgdGhpcy5fcmVxdWVzdFF1ZXVlID0gbmV3IFRhc2tRdWV1ZSh0aGlzLCB7IG5hbWU6IG5hbWUgPyBgJHtuYW1lfS1yZXF1ZXN0c2AgOiB1bmRlZmluZWQsIGJ1Y2tldCB9KTtcclxuICAgIHRoaXMuX3N5bmNRdWV1ZSA9IG5ldyBUYXNrUXVldWUodGhpcywgeyBuYW1lOiBuYW1lID8gYCR7bmFtZX0tc3luY2AgOiB1bmRlZmluZWQsIGJ1Y2tldCB9KTtcclxuXHJcbiAgICBpZiAodGhpcy5fc2NoZW1hICYmIChzZXR0aW5ncy5hdXRvVXBncmFkZSA9PT0gdW5kZWZpbmVkIHx8IHNldHRpbmdzLmF1dG9VcGdyYWRlKSkge1xyXG4gICAgICB0aGlzLl9zY2hlbWEub24oJ3VwZ3JhZGUnLCAoKSA9PiB0aGlzLnVwZ3JhZGUoKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXQgbmFtZSgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMuX25hbWU7XHJcbiAgfVxyXG5cclxuICBnZXQgc2NoZW1hKCk6IFNjaGVtYSB7XHJcbiAgICByZXR1cm4gdGhpcy5fc2NoZW1hO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGtleU1hcCgpOiBLZXlNYXAge1xyXG4gICAgcmV0dXJuIHRoaXMuX2tleU1hcDtcclxuICB9XHJcblxyXG4gIGdldCBidWNrZXQoKTogQnVja2V0IHtcclxuICAgIHJldHVybiB0aGlzLl9idWNrZXQ7XHJcbiAgfVxyXG5cclxuICBnZXQgdHJhbnNmb3JtTG9nKCk6IExvZyB7XHJcbiAgICByZXR1cm4gdGhpcy5fdHJhbnNmb3JtTG9nO1xyXG4gIH1cclxuXHJcbiAgZ2V0IHJlcXVlc3RRdWV1ZSgpOiBUYXNrUXVldWUge1xyXG4gICAgcmV0dXJuIHRoaXMuX3JlcXVlc3RRdWV1ZTtcclxuICB9XHJcblxyXG4gIGdldCBzeW5jUXVldWUoKTogVGFza1F1ZXVlIHtcclxuICAgIHJldHVybiB0aGlzLl9zeW5jUXVldWU7XHJcbiAgfVxyXG5cclxuICBnZXQgcXVlcnlCdWlsZGVyKCk6IFF1ZXJ5QnVpbGRlciB7XHJcbiAgICBsZXQgcWIgPSB0aGlzLl9xdWVyeUJ1aWxkZXI7XHJcbiAgICBpZiAocWIgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICBxYiA9IHRoaXMuX3F1ZXJ5QnVpbGRlciA9IG5ldyBRdWVyeUJ1aWxkZXIoKTtcclxuICAgIH1cclxuICAgIHJldHVybiBxYjtcclxuICB9XHJcblxyXG4gIGdldCB0cmFuc2Zvcm1CdWlsZGVyKCk6IFRyYW5zZm9ybUJ1aWxkZXIge1xyXG4gICAgbGV0IHRiID0gdGhpcy5fdHJhbnNmb3JtQnVpbGRlcjtcclxuICAgIGlmICh0YiA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHRiID0gdGhpcy5fdHJhbnNmb3JtQnVpbGRlciA9IG5ldyBUcmFuc2Zvcm1CdWlsZGVyKHtcclxuICAgICAgICByZWNvcmRJbml0aWFsaXplcjogdGhpcy5fc2NoZW1hXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRiO1xyXG4gIH1cclxuXHJcbiAgLy8gUGVyZm9ybWVyIGludGVyZmFjZVxyXG4gIHBlcmZvcm0odGFzazogVGFzayk6IFByb21pc2U8YW55PiB7XHJcbiAgICBsZXQgbWV0aG9kID0gYF9fJHt0YXNrLnR5cGV9X19gO1xyXG4gICAgcmV0dXJuIHRoaXNbbWV0aG9kXS5jYWxsKHRoaXMsIHRhc2suZGF0YSk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogVXBncmFkZSBzb3VyY2UgYXMgcGFydCBvZiBhIHNjaGVtYSB1cGdyYWRlLlxyXG4gICAqXHJcbiAgICogQHJldHVybnMge1Byb21pc2U8dm9pZD59XHJcbiAgICogQG1lbWJlcm9mIFNvdXJjZVxyXG4gICAqL1xyXG4gIHVwZ3JhZGUoKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgfVxyXG5cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gIC8vIFByaXZhdGUgbWV0aG9kc1xyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIC8qKlxyXG4gICBOb3RpZmllcyBsaXN0ZW5lcnMgdGhhdCB0aGlzIHNvdXJjZSBoYXMgYmVlbiB0cmFuc2Zvcm1lZCBieSBlbWl0dGluZyB0aGVcclxuICAgYHRyYW5zZm9ybWAgZXZlbnQuXHJcblxyXG4gICBSZXNvbHZlcyB3aGVuIGFueSBwcm9taXNlcyByZXR1cm5lZCB0byBldmVudCBsaXN0ZW5lcnMgYXJlIHJlc29sdmVkLlxyXG5cclxuICAgQWxzbywgYWRkcyBhbiBlbnRyeSB0byB0aGUgU291cmNlJ3MgYHRyYW5zZm9ybUxvZ2AgZm9yIGVhY2ggdHJhbnNmb3JtLlxyXG5cclxuICAgQHByaXZhdGVcclxuICAgQG1ldGhvZCBfdHJhbnNmb3JtZWRcclxuICAgQHBhcmFtIHtBcnJheX0gdHJhbnNmb3JtcyAtIFRyYW5zZm9ybXMgdGhhdCBoYXZlIG9jY3VycmVkLlxyXG4gICBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIHRyYW5zZm9ybXMuXHJcbiAgKi9cclxuICBwcml2YXRlIF90cmFuc2Zvcm1lZCh0cmFuc2Zvcm1zOiBUcmFuc2Zvcm1bXSk6IFByb21pc2U8VHJhbnNmb3JtW10+IHtcclxuICAgIHJldHVybiB0cmFuc2Zvcm1zXHJcbiAgICAgIC5yZWR1Y2UoKGNoYWluLCB0cmFuc2Zvcm0pID0+IHtcclxuICAgICAgICByZXR1cm4gY2hhaW4udGhlbigoKSA9PiB7XHJcbiAgICAgICAgICBpZiAodGhpcy5fdHJhbnNmb3JtTG9nLmNvbnRhaW5zKHRyYW5zZm9ybS5pZCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIE9yYml0LlByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHJldHVybiB0aGlzLl90cmFuc2Zvcm1Mb2cuYXBwZW5kKHRyYW5zZm9ybS5pZClcclxuICAgICAgICAgICAgLnRoZW4oKCkgPT4gc2V0dGxlSW5TZXJpZXModGhpcywgJ3RyYW5zZm9ybScsIHRyYW5zZm9ybSkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9LCBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKSlcclxuICAgICAgLnRoZW4oKCkgPT4gdHJhbnNmb3Jtcyk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIF9lbnF1ZXVlUmVxdWVzdCh0eXBlOiBzdHJpbmcsIGRhdGE6IGFueSk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgcmV0dXJuIHRoaXMuX3JlcXVlc3RRdWV1ZS5wdXNoKHsgdHlwZSwgZGF0YSB9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgX2VucXVldWVTeW5jKHR5cGU6IHN0cmluZywgZGF0YTogYW55KTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICByZXR1cm4gdGhpcy5fc3luY1F1ZXVlLnB1c2goeyB0eXBlLCBkYXRhIH0pO1xyXG4gIH1cclxufVxyXG4iXX0=