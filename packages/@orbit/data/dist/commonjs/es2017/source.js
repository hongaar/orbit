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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3JjL3NvdXJjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEscUJBQTJCO0FBQzNCLHFCQU1xQjtBQUdyQiw4QkFBMkM7QUFFM0Msa0NBQW1EO0FBQ25ELHNCQUFzQztBQWF0QyxBQVNHOzs7Ozs7Ozs7O0FBRUg7QUFrQkUsb0JBQVksQUFBNkI7QUFBN0IsaUNBQUE7QUFBQSx1QkFBNkI7O0FBQ3ZDLEFBQUksYUFBQyxBQUFPLFVBQUcsQUFBUSxTQUFDLEFBQU0sQUFBQztBQUMvQixBQUFJLGFBQUMsQUFBTyxVQUFHLEFBQVEsU0FBQyxBQUFNLEFBQUM7QUFDL0IsWUFBTSxBQUFJLE9BQUcsQUFBSSxLQUFDLEFBQUssUUFBRyxBQUFRLFNBQUMsQUFBSSxBQUFDO0FBQ3hDLFlBQU0sQUFBTSxTQUFHLEFBQUksS0FBQyxBQUFPLFVBQUcsQUFBUSxTQUFDLEFBQU0sQUFBQztBQUM5QyxBQUFJLGFBQUMsQUFBYSxnQkFBRyxBQUFRLFNBQUMsQUFBWSxBQUFDO0FBQzNDLEFBQUksYUFBQyxBQUFpQixvQkFBRyxBQUFRLFNBQUMsQUFBZ0IsQUFBQztBQUVuRCxBQUFFLEFBQUMsWUFBQyxBQUFNLEFBQUMsUUFBQyxBQUFDO0FBQ1gsb0JBQU0sT0FBQyxBQUFpRCxtREFBRSxDQUFDLENBQUMsQUFBSSxBQUFDLEFBQUMsQUFDcEU7QUFBQztBQUVELEFBQUksYUFBQyxBQUFhLGdCQUFHLElBQUksT0FBRyxJQUFDLEVBQUUsQUFBSSxNQUFFLEFBQUksT0FBTSxBQUFJLE9BQU0sU0FBRyxBQUFTLFdBQUUsQUFBTSxRQUFBLEFBQUUsQUFBQyxBQUFDO0FBQ2pGLEFBQUksYUFBQyxBQUFhLGdCQUFHLElBQUksT0FBUyxVQUFDLEFBQUksTUFBRSxFQUFFLEFBQUksTUFBRSxBQUFJLE9BQU0sQUFBSSxPQUFXLGNBQUcsQUFBUyxXQUFFLEFBQU0sUUFBQSxBQUFFLEFBQUMsQUFBQztB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LE9BQUUsQUFBVyxhQUFoQyxBQUFrQyxBQUFTLEFBQUM7QUFBQSxBQUFDLEFBQUMsQUFDOUQsaUJBRlMsQUFBSTtBQUVaLEFBQUMsQUFBQyxBQUNMLGFBUlMsQUFBSztBQVFiLFNBVkksQUFBVSxFQVVaLE9BQUssUUFBQyxBQUFPLFFBQUMsQUFBTyxBQUFFLEFBQUMsV0FDMUIsQUFBSSxLQUFDO0FBQU0sbUJBQUEsQUFBVTtBQUFBLEFBQUMsQUFBQyxBQUM1QjtBQUFDO0FBRU8scUJBQWUsa0JBQXZCLFVBQXdCLEFBQVksTUFBRSxBQUFTO0FBQzdDLEFBQU0sZUFBQyxBQUFJLEtBQUMsQUFBYSxjQUFDLEFBQUksS0FBQyxFQUFFLEFBQUksTUFBQSxNQUFFLEFBQUksTUFBQSxBQUFFLEFBQUMsQUFBQyxBQUNqRDtBQUFDO0FBRU8scUJBQVksZUFBcEIsVUFBcUIsQUFBWSxNQUFFLEFBQVM7QUFDMUMsQUFBTSxlQUFDLEFBQUksS0FBQyxBQUFVLFdBQUMsQUFBSSxLQUFDLEVBQUUsQUFBSSxNQUFBLE1BQUUsQUFBSSxNQUFBLEFBQUUsQUFBQyxBQUFDLEFBQzlDO0FBQUM7QUE3SG1CLEFBQU0seUJBRDNCLE9BQU8sVUFDYyxBQUFNLEFBOEgzQjtBQUFELFdBQUM7QUE5SEQsQUE4SEM7QUE5SHFCLGlCQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE9yYml0IGZyb20gJy4vbWFpbic7XHJcbmltcG9ydCB7XHJcbiAgZXZlbnRlZCwgRXZlbnRlZCwgc2V0dGxlSW5TZXJpZXMsXHJcbiAgQnVja2V0LFxyXG4gIFRhc2tRdWV1ZSxcclxuICBUYXNrLCBQZXJmb3JtZXIsXHJcbiAgTG9nXHJcbn0gZnJvbSAnQG9yYml0L2NvcmUnO1xyXG5pbXBvcnQgS2V5TWFwIGZyb20gJy4va2V5LW1hcCc7XHJcbmltcG9ydCBTY2hlbWEgZnJvbSAnLi9zY2hlbWEnO1xyXG5pbXBvcnQgUXVlcnlCdWlsZGVyIGZyb20gJy4vcXVlcnktYnVpbGRlcic7XHJcbmltcG9ydCB7IFRyYW5zZm9ybSB9IGZyb20gJy4vdHJhbnNmb3JtJztcclxuaW1wb3J0IFRyYW5zZm9ybUJ1aWxkZXIgZnJvbSAnLi90cmFuc2Zvcm0tYnVpbGRlcic7XHJcbmltcG9ydCB7IGFzc2VydCB9IGZyb20gJ0BvcmJpdC91dGlscyc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFNvdXJjZVNldHRpbmdzIHtcclxuICBuYW1lPzogc3RyaW5nO1xyXG4gIHNjaGVtYT86IFNjaGVtYTtcclxuICBrZXlNYXA/OiBLZXlNYXA7XHJcbiAgYnVja2V0PzogQnVja2V0O1xyXG4gIHF1ZXJ5QnVpbGRlcj86IFF1ZXJ5QnVpbGRlcjtcclxuICB0cmFuc2Zvcm1CdWlsZGVyPzogVHJhbnNmb3JtQnVpbGRlcjtcclxufVxyXG5cclxuZXhwb3J0IHR5cGUgU291cmNlQ2xhc3MgPSAobmV3ICgpID0+IFNvdXJjZSk7XHJcblxyXG4vKipcclxuIEJhc2UgY2xhc3MgZm9yIHNvdXJjZXMuXHJcblxyXG4gQGNsYXNzIFNvdXJjZVxyXG4gQG5hbWVzcGFjZSBPcmJpdFxyXG4gQHBhcmFtIHtPYmplY3R9IFtzZXR0aW5nc10gLSBzZXR0aW5ncyBmb3Igc291cmNlXHJcbiBAcGFyYW0ge1N0cmluZ30gW3NldHRpbmdzLm5hbWVdIC0gTmFtZSBmb3Igc291cmNlXHJcbiBAcGFyYW0ge1NjaGVtYX0gW3NldHRpbmdzLnNjaGVtYV0gLSBTY2hlbWEgZm9yIHNvdXJjZVxyXG4gQGNvbnN0cnVjdG9yXHJcbiAqL1xyXG5AZXZlbnRlZFxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgU291cmNlIGltcGxlbWVudHMgRXZlbnRlZCwgUGVyZm9ybWVyIHtcclxuICBwcm90ZWN0ZWQgX25hbWU6IHN0cmluZztcclxuICBwcm90ZWN0ZWQgX2J1Y2tldDogQnVja2V0O1xyXG4gIHByb3RlY3RlZCBfa2V5TWFwOiBLZXlNYXA7XHJcbiAgcHJvdGVjdGVkIF9zY2hlbWE6IFNjaGVtYTtcclxuICBwcm90ZWN0ZWQgX3RyYW5zZm9ybUxvZzogTG9nO1xyXG4gIHByb3RlY3RlZCBfcmVxdWVzdFF1ZXVlOiBUYXNrUXVldWU7XHJcbiAgcHJvdGVjdGVkIF9zeW5jUXVldWU6IFRhc2tRdWV1ZTtcclxuICBwcm90ZWN0ZWQgX3F1ZXJ5QnVpbGRlcjogUXVlcnlCdWlsZGVyO1xyXG4gIHByb3RlY3RlZCBfdHJhbnNmb3JtQnVpbGRlcjogVHJhbnNmb3JtQnVpbGRlcjtcclxuXHJcbiAgLy8gRXZlbnRlZCBpbnRlcmZhY2Ugc3R1YnNcclxuICBvbjogKGV2ZW50OiBzdHJpbmcsIGNhbGxiYWNrOiBGdW5jdGlvbiwgYmluZGluZz86IG9iamVjdCkgPT4gdm9pZDtcclxuICBvZmY6IChldmVudDogc3RyaW5nLCBjYWxsYmFjazogRnVuY3Rpb24sIGJpbmRpbmc/OiBvYmplY3QpID0+IHZvaWQ7XHJcbiAgb25lOiAoZXZlbnQ6IHN0cmluZywgY2FsbGJhY2s6IEZ1bmN0aW9uLCBiaW5kaW5nPzogb2JqZWN0KSA9PiB2b2lkO1xyXG4gIGVtaXQ6IChldmVudDogc3RyaW5nLCAuLi5hcmdzKSA9PiB2b2lkO1xyXG4gIGxpc3RlbmVyczogKGV2ZW50OiBzdHJpbmcpID0+IGFueVtdO1xyXG5cclxuICBjb25zdHJ1Y3RvcihzZXR0aW5nczogU291cmNlU2V0dGluZ3MgPSB7fSkge1xyXG4gICAgdGhpcy5fc2NoZW1hID0gc2V0dGluZ3Muc2NoZW1hO1xyXG4gICAgdGhpcy5fa2V5TWFwID0gc2V0dGluZ3Mua2V5TWFwO1xyXG4gICAgY29uc3QgbmFtZSA9IHRoaXMuX25hbWUgPSBzZXR0aW5ncy5uYW1lO1xyXG4gICAgY29uc3QgYnVja2V0ID0gdGhpcy5fYnVja2V0ID0gc2V0dGluZ3MuYnVja2V0O1xyXG4gICAgdGhpcy5fcXVlcnlCdWlsZGVyID0gc2V0dGluZ3MucXVlcnlCdWlsZGVyO1xyXG4gICAgdGhpcy5fdHJhbnNmb3JtQnVpbGRlciA9IHNldHRpbmdzLnRyYW5zZm9ybUJ1aWxkZXI7XHJcblxyXG4gICAgaWYgKGJ1Y2tldCkge1xyXG4gICAgICBhc3NlcnQoJ1RyYW5zZm9ybUxvZyByZXF1aXJlcyBhIG5hbWUgaWYgaXQgaGFzIGEgYnVja2V0JywgISFuYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLl90cmFuc2Zvcm1Mb2cgPSBuZXcgTG9nKHsgbmFtZTogbmFtZSA/IGAke25hbWV9LWxvZ2AgOiB1bmRlZmluZWQsIGJ1Y2tldCB9KTtcclxuICAgIHRoaXMuX3JlcXVlc3RRdWV1ZSA9IG5ldyBUYXNrUXVldWUodGhpcywgeyBuYW1lOiBuYW1lID8gYCR7bmFtZX0tcmVxdWVzdHNgIDogdW5kZWZpbmVkLCBidWNrZXQgfSk7XHJcbiAgICB0aGlzLl9zeW5jUXVldWUgPSBuZXcgVGFza1F1ZXVlKHRoaXMsIHsgbmFtZTogbmFtZSA/IGAke25hbWV9LXN5bmNgIDogdW5kZWZpbmVkLCBidWNrZXQgfSk7XHJcbiAgfVxyXG5cclxuICBnZXQgbmFtZSgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMuX25hbWU7XHJcbiAgfVxyXG5cclxuICBnZXQgc2NoZW1hKCk6IFNjaGVtYSB7XHJcbiAgICByZXR1cm4gdGhpcy5fc2NoZW1hO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGtleU1hcCgpOiBLZXlNYXAge1xyXG4gICAgcmV0dXJuIHRoaXMuX2tleU1hcDtcclxuICB9XHJcblxyXG4gIGdldCBidWNrZXQoKTogQnVja2V0IHtcclxuICAgIHJldHVybiB0aGlzLl9idWNrZXQ7XHJcbiAgfVxyXG5cclxuICBnZXQgdHJhbnNmb3JtTG9nKCk6IExvZyB7XHJcbiAgICByZXR1cm4gdGhpcy5fdHJhbnNmb3JtTG9nO1xyXG4gIH1cclxuXHJcbiAgZ2V0IHJlcXVlc3RRdWV1ZSgpOiBUYXNrUXVldWUge1xyXG4gICAgcmV0dXJuIHRoaXMuX3JlcXVlc3RRdWV1ZTtcclxuICB9XHJcblxyXG4gIGdldCBzeW5jUXVldWUoKTogVGFza1F1ZXVlIHtcclxuICAgIHJldHVybiB0aGlzLl9zeW5jUXVldWU7XHJcbiAgfVxyXG5cclxuICBnZXQgcXVlcnlCdWlsZGVyKCk6IFF1ZXJ5QnVpbGRlciB7XHJcbiAgICBsZXQgcWIgPSB0aGlzLl9xdWVyeUJ1aWxkZXI7XHJcbiAgICBpZiAocWIgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICBxYiA9IHRoaXMuX3F1ZXJ5QnVpbGRlciA9IG5ldyBRdWVyeUJ1aWxkZXIoKTtcclxuICAgIH1cclxuICAgIHJldHVybiBxYjtcclxuICB9XHJcblxyXG4gIGdldCB0cmFuc2Zvcm1CdWlsZGVyKCk6IFRyYW5zZm9ybUJ1aWxkZXIge1xyXG4gICAgbGV0IHRiID0gdGhpcy5fdHJhbnNmb3JtQnVpbGRlcjtcclxuICAgIGlmICh0YiA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHRiID0gdGhpcy5fdHJhbnNmb3JtQnVpbGRlciA9IG5ldyBUcmFuc2Zvcm1CdWlsZGVyKHtcclxuICAgICAgICByZWNvcmRJbml0aWFsaXplcjogdGhpcy5fc2NoZW1hXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRiO1xyXG4gIH1cclxuXHJcbiAgLy8gUGVyZm9ybWVyIGludGVyZmFjZVxyXG4gIHBlcmZvcm0odGFzazogVGFzayk6IFByb21pc2U8YW55PiB7XHJcbiAgICBsZXQgbWV0aG9kID0gYF9fJHt0YXNrLnR5cGV9X19gO1xyXG4gICAgcmV0dXJuIHRoaXNbbWV0aG9kXS5jYWxsKHRoaXMsIHRhc2suZGF0YSk7XHJcbiAgfTtcclxuXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAvLyBQcml2YXRlIG1ldGhvZHNcclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAvKipcclxuICAgTm90aWZpZXMgbGlzdGVuZXJzIHRoYXQgdGhpcyBzb3VyY2UgaGFzIGJlZW4gdHJhbnNmb3JtZWQgYnkgZW1pdHRpbmcgdGhlXHJcbiAgIGB0cmFuc2Zvcm1gIGV2ZW50LlxyXG5cclxuICAgUmVzb2x2ZXMgd2hlbiBhbnkgcHJvbWlzZXMgcmV0dXJuZWQgdG8gZXZlbnQgbGlzdGVuZXJzIGFyZSByZXNvbHZlZC5cclxuXHJcbiAgIEFsc28sIGFkZHMgYW4gZW50cnkgdG8gdGhlIFNvdXJjZSdzIGB0cmFuc2Zvcm1Mb2dgIGZvciBlYWNoIHRyYW5zZm9ybS5cclxuXHJcbiAgIEBwcml2YXRlXHJcbiAgIEBtZXRob2QgX3RyYW5zZm9ybWVkXHJcbiAgIEBwYXJhbSB7QXJyYXl9IHRyYW5zZm9ybXMgLSBUcmFuc2Zvcm1zIHRoYXQgaGF2ZSBvY2N1cnJlZC5cclxuICAgQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdGhhdCByZXNvbHZlcyB0byB0cmFuc2Zvcm1zLlxyXG4gICovXHJcbiAgcHJpdmF0ZSBfdHJhbnNmb3JtZWQodHJhbnNmb3JtczogVHJhbnNmb3JtW10pOiBQcm9taXNlPFRyYW5zZm9ybVtdPiB7XHJcbiAgICByZXR1cm4gdHJhbnNmb3Jtc1xyXG4gICAgICAucmVkdWNlKChjaGFpbiwgdHJhbnNmb3JtKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGNoYWluLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgaWYgKHRoaXMuX3RyYW5zZm9ybUxvZy5jb250YWlucyh0cmFuc2Zvcm0uaWQpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICByZXR1cm4gdGhpcy5fdHJhbnNmb3JtTG9nLmFwcGVuZCh0cmFuc2Zvcm0uaWQpXHJcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHNldHRsZUluU2VyaWVzKHRoaXMsICd0cmFuc2Zvcm0nLCB0cmFuc2Zvcm0pKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSwgT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCkpXHJcbiAgICAgIC50aGVuKCgpID0+IHRyYW5zZm9ybXMpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBfZW5xdWV1ZVJlcXVlc3QodHlwZTogc3RyaW5nLCBkYXRhOiBhbnkpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0UXVldWUucHVzaCh7IHR5cGUsIGRhdGEgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIF9lbnF1ZXVlU3luYyh0eXBlOiBzdHJpbmcsIGRhdGE6IGFueSk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgcmV0dXJuIHRoaXMuX3N5bmNRdWV1ZS5wdXNoKHsgdHlwZSwgZGF0YSB9KTtcclxuICB9XHJcbn1cclxuIl19