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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3JjL3NvdXJjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHFCQUEyQjtBQUMzQixxQkFNcUI7QUFHckIsOEJBQTJDO0FBRTNDLGtDQUFtRDtBQUNuRCxzQkFBc0M7QUFhdEMsQUFTRzs7Ozs7Ozs7OztBQUVIO0FBa0JFLG9CQUFZLEFBQTZCO0FBQTdCLGlDQUFBO0FBQUEsdUJBQTZCOztBQUN2QyxBQUFJLGFBQUMsQUFBTyxVQUFHLEFBQVEsU0FBQyxBQUFNLEFBQUM7QUFDL0IsQUFBSSxhQUFDLEFBQU8sVUFBRyxBQUFRLFNBQUMsQUFBTSxBQUFDO0FBQy9CLFlBQU0sQUFBSSxPQUFHLEFBQUksS0FBQyxBQUFLLFFBQUcsQUFBUSxTQUFDLEFBQUksQUFBQztBQUN4QyxZQUFNLEFBQU0sU0FBRyxBQUFJLEtBQUMsQUFBTyxVQUFHLEFBQVEsU0FBQyxBQUFNLEFBQUM7QUFDOUMsQUFBSSxhQUFDLEFBQWEsZ0JBQUcsQUFBUSxTQUFDLEFBQVksQUFBQztBQUMzQyxBQUFJLGFBQUMsQUFBaUIsb0JBQUcsQUFBUSxTQUFDLEFBQWdCLEFBQUM7QUFFbkQsQUFBRSxBQUFDLFlBQUMsQUFBTSxBQUFDLFFBQUMsQUFBQztBQUNYLG9CQUFNLE9BQUMsQUFBaUQsbURBQUUsQ0FBQyxDQUFDLEFBQUksQUFBQyxBQUFDLEFBQ3BFO0FBQUM7QUFFRCxBQUFJLGFBQUMsQUFBYSxnQkFBRyxJQUFJLE9BQUcsSUFBQyxFQUFFLEFBQUksTUFBRSxBQUFJLE9BQU0sQUFBSSxPQUFNLFNBQUcsQUFBUyxXQUFFLEFBQU0sUUFBQSxBQUFFLEFBQUMsQUFBQztBQUNqRixBQUFJLGFBQUMsQUFBYSxnQkFBRyxJQUFJLE9BQVMsVUFBQyxBQUFJLE1BQUUsRUFBRSxBQUFJLE1BQUUsQUFBSSxPQUFNLEFBQUksT0FBVyxjQUFHLEFBQVMsV0FBRSxBQUFNLFFBQUEsQUFBRSxBQUFDLEFBQUM7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SSxPQUFFLEFBQVcsYUFBaEMsQUFBa0MsQUFBUyxBQUFDO0FBQUEsQUFBQyxBQUFDLEFBQzlELGlCQUZTLEFBQUk7QUFFWixBQUFDLEFBQUMsQUFDTCxhQVJTLEFBQUs7QUFRYixTQVZJLEFBQVUsRUFVWixPQUFLLFFBQUMsQUFBTyxRQUFDLEFBQU8sQUFBRSxBQUFDLFdBQzFCLEFBQUksS0FBQztBQUFNLG1CQUFBLEFBQVU7QUFBQSxBQUFDLEFBQUMsQUFDNUI7QUFBQztBQUVPLHFCQUFlLGtCQUF2QixVQUF3QixBQUFZLE1BQUUsQUFBUztBQUM3QyxBQUFNLGVBQUMsQUFBSSxLQUFDLEFBQWEsY0FBQyxBQUFJLEtBQUMsRUFBRSxBQUFJLE1BQUEsTUFBRSxBQUFJLE1BQUEsQUFBRSxBQUFDLEFBQUMsQUFDakQ7QUFBQztBQUVPLHFCQUFZLGVBQXBCLFVBQXFCLEFBQVksTUFBRSxBQUFTO0FBQzFDLEFBQU0sZUFBQyxBQUFJLEtBQUMsQUFBVSxXQUFDLEFBQUksS0FBQyxFQUFFLEFBQUksTUFBQSxNQUFFLEFBQUksTUFBQSxBQUFFLEFBQUMsQUFBQyxBQUM5QztBQUFDO0FBN0htQixBQUFNLHlCQUQzQixPQUFPLFVBQ2MsQUFBTSxBQThIM0I7QUFBRCxXQUFDO0FBOUhELEFBOEhDO0FBOUhxQixpQkFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBPcmJpdCBmcm9tICcuL21haW4nO1xyXG5pbXBvcnQge1xyXG4gIGV2ZW50ZWQsIEV2ZW50ZWQsIHNldHRsZUluU2VyaWVzLFxyXG4gIEJ1Y2tldCxcclxuICBUYXNrUXVldWUsXHJcbiAgVGFzaywgUGVyZm9ybWVyLFxyXG4gIExvZ1xyXG59IGZyb20gJ0BvcmJpdC9jb3JlJztcclxuaW1wb3J0IEtleU1hcCBmcm9tICcuL2tleS1tYXAnO1xyXG5pbXBvcnQgU2NoZW1hIGZyb20gJy4vc2NoZW1hJztcclxuaW1wb3J0IFF1ZXJ5QnVpbGRlciBmcm9tICcuL3F1ZXJ5LWJ1aWxkZXInO1xyXG5pbXBvcnQgeyBUcmFuc2Zvcm0gfSBmcm9tICcuL3RyYW5zZm9ybSc7XHJcbmltcG9ydCBUcmFuc2Zvcm1CdWlsZGVyIGZyb20gJy4vdHJhbnNmb3JtLWJ1aWxkZXInO1xyXG5pbXBvcnQgeyBhc3NlcnQgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBTb3VyY2VTZXR0aW5ncyB7XHJcbiAgbmFtZT86IHN0cmluZztcclxuICBzY2hlbWE/OiBTY2hlbWE7XHJcbiAga2V5TWFwPzogS2V5TWFwO1xyXG4gIGJ1Y2tldD86IEJ1Y2tldDtcclxuICBxdWVyeUJ1aWxkZXI/OiBRdWVyeUJ1aWxkZXI7XHJcbiAgdHJhbnNmb3JtQnVpbGRlcj86IFRyYW5zZm9ybUJ1aWxkZXI7XHJcbn1cclxuXHJcbmV4cG9ydCB0eXBlIFNvdXJjZUNsYXNzID0gKG5ldyAoKSA9PiBTb3VyY2UpO1xyXG5cclxuLyoqXHJcbiBCYXNlIGNsYXNzIGZvciBzb3VyY2VzLlxyXG5cclxuIEBjbGFzcyBTb3VyY2VcclxuIEBuYW1lc3BhY2UgT3JiaXRcclxuIEBwYXJhbSB7T2JqZWN0fSBbc2V0dGluZ3NdIC0gc2V0dGluZ3MgZm9yIHNvdXJjZVxyXG4gQHBhcmFtIHtTdHJpbmd9IFtzZXR0aW5ncy5uYW1lXSAtIE5hbWUgZm9yIHNvdXJjZVxyXG4gQHBhcmFtIHtTY2hlbWF9IFtzZXR0aW5ncy5zY2hlbWFdIC0gU2NoZW1hIGZvciBzb3VyY2VcclxuIEBjb25zdHJ1Y3RvclxyXG4gKi9cclxuQGV2ZW50ZWRcclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFNvdXJjZSBpbXBsZW1lbnRzIEV2ZW50ZWQsIFBlcmZvcm1lciB7XHJcbiAgcHJvdGVjdGVkIF9uYW1lOiBzdHJpbmc7XHJcbiAgcHJvdGVjdGVkIF9idWNrZXQ6IEJ1Y2tldDtcclxuICBwcm90ZWN0ZWQgX2tleU1hcDogS2V5TWFwO1xyXG4gIHByb3RlY3RlZCBfc2NoZW1hOiBTY2hlbWE7XHJcbiAgcHJvdGVjdGVkIF90cmFuc2Zvcm1Mb2c6IExvZztcclxuICBwcm90ZWN0ZWQgX3JlcXVlc3RRdWV1ZTogVGFza1F1ZXVlO1xyXG4gIHByb3RlY3RlZCBfc3luY1F1ZXVlOiBUYXNrUXVldWU7XHJcbiAgcHJvdGVjdGVkIF9xdWVyeUJ1aWxkZXI6IFF1ZXJ5QnVpbGRlcjtcclxuICBwcm90ZWN0ZWQgX3RyYW5zZm9ybUJ1aWxkZXI6IFRyYW5zZm9ybUJ1aWxkZXI7XHJcblxyXG4gIC8vIEV2ZW50ZWQgaW50ZXJmYWNlIHN0dWJzXHJcbiAgb246IChldmVudDogc3RyaW5nLCBjYWxsYmFjazogRnVuY3Rpb24sIGJpbmRpbmc/OiBvYmplY3QpID0+IHZvaWQ7XHJcbiAgb2ZmOiAoZXZlbnQ6IHN0cmluZywgY2FsbGJhY2s6IEZ1bmN0aW9uLCBiaW5kaW5nPzogb2JqZWN0KSA9PiB2b2lkO1xyXG4gIG9uZTogKGV2ZW50OiBzdHJpbmcsIGNhbGxiYWNrOiBGdW5jdGlvbiwgYmluZGluZz86IG9iamVjdCkgPT4gdm9pZDtcclxuICBlbWl0OiAoZXZlbnQ6IHN0cmluZywgLi4uYXJncykgPT4gdm9pZDtcclxuICBsaXN0ZW5lcnM6IChldmVudDogc3RyaW5nKSA9PiBhbnlbXTtcclxuXHJcbiAgY29uc3RydWN0b3Ioc2V0dGluZ3M6IFNvdXJjZVNldHRpbmdzID0ge30pIHtcclxuICAgIHRoaXMuX3NjaGVtYSA9IHNldHRpbmdzLnNjaGVtYTtcclxuICAgIHRoaXMuX2tleU1hcCA9IHNldHRpbmdzLmtleU1hcDtcclxuICAgIGNvbnN0IG5hbWUgPSB0aGlzLl9uYW1lID0gc2V0dGluZ3MubmFtZTtcclxuICAgIGNvbnN0IGJ1Y2tldCA9IHRoaXMuX2J1Y2tldCA9IHNldHRpbmdzLmJ1Y2tldDtcclxuICAgIHRoaXMuX3F1ZXJ5QnVpbGRlciA9IHNldHRpbmdzLnF1ZXJ5QnVpbGRlcjtcclxuICAgIHRoaXMuX3RyYW5zZm9ybUJ1aWxkZXIgPSBzZXR0aW5ncy50cmFuc2Zvcm1CdWlsZGVyO1xyXG5cclxuICAgIGlmIChidWNrZXQpIHtcclxuICAgICAgYXNzZXJ0KCdUcmFuc2Zvcm1Mb2cgcmVxdWlyZXMgYSBuYW1lIGlmIGl0IGhhcyBhIGJ1Y2tldCcsICEhbmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5fdHJhbnNmb3JtTG9nID0gbmV3IExvZyh7IG5hbWU6IG5hbWUgPyBgJHtuYW1lfS1sb2dgIDogdW5kZWZpbmVkLCBidWNrZXQgfSk7XHJcbiAgICB0aGlzLl9yZXF1ZXN0UXVldWUgPSBuZXcgVGFza1F1ZXVlKHRoaXMsIHsgbmFtZTogbmFtZSA/IGAke25hbWV9LXJlcXVlc3RzYCA6IHVuZGVmaW5lZCwgYnVja2V0IH0pO1xyXG4gICAgdGhpcy5fc3luY1F1ZXVlID0gbmV3IFRhc2tRdWV1ZSh0aGlzLCB7IG5hbWU6IG5hbWUgPyBgJHtuYW1lfS1zeW5jYCA6IHVuZGVmaW5lZCwgYnVja2V0IH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0IG5hbWUoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLl9uYW1lO1xyXG4gIH1cclxuXHJcbiAgZ2V0IHNjaGVtYSgpOiBTY2hlbWEge1xyXG4gICAgcmV0dXJuIHRoaXMuX3NjaGVtYTtcclxuICB9XHJcblxyXG4gIGdldCBrZXlNYXAoKTogS2V5TWFwIHtcclxuICAgIHJldHVybiB0aGlzLl9rZXlNYXA7XHJcbiAgfVxyXG5cclxuICBnZXQgYnVja2V0KCk6IEJ1Y2tldCB7XHJcbiAgICByZXR1cm4gdGhpcy5fYnVja2V0O1xyXG4gIH1cclxuXHJcbiAgZ2V0IHRyYW5zZm9ybUxvZygpOiBMb2cge1xyXG4gICAgcmV0dXJuIHRoaXMuX3RyYW5zZm9ybUxvZztcclxuICB9XHJcblxyXG4gIGdldCByZXF1ZXN0UXVldWUoKTogVGFza1F1ZXVlIHtcclxuICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0UXVldWU7XHJcbiAgfVxyXG5cclxuICBnZXQgc3luY1F1ZXVlKCk6IFRhc2tRdWV1ZSB7XHJcbiAgICByZXR1cm4gdGhpcy5fc3luY1F1ZXVlO1xyXG4gIH1cclxuXHJcbiAgZ2V0IHF1ZXJ5QnVpbGRlcigpOiBRdWVyeUJ1aWxkZXIge1xyXG4gICAgbGV0IHFiID0gdGhpcy5fcXVlcnlCdWlsZGVyO1xyXG4gICAgaWYgKHFiID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgcWIgPSB0aGlzLl9xdWVyeUJ1aWxkZXIgPSBuZXcgUXVlcnlCdWlsZGVyKCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcWI7XHJcbiAgfVxyXG5cclxuICBnZXQgdHJhbnNmb3JtQnVpbGRlcigpOiBUcmFuc2Zvcm1CdWlsZGVyIHtcclxuICAgIGxldCB0YiA9IHRoaXMuX3RyYW5zZm9ybUJ1aWxkZXI7XHJcbiAgICBpZiAodGIgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICB0YiA9IHRoaXMuX3RyYW5zZm9ybUJ1aWxkZXIgPSBuZXcgVHJhbnNmb3JtQnVpbGRlcih7XHJcbiAgICAgICAgcmVjb3JkSW5pdGlhbGl6ZXI6IHRoaXMuX3NjaGVtYVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIHJldHVybiB0YjtcclxuICB9XHJcblxyXG4gIC8vIFBlcmZvcm1lciBpbnRlcmZhY2VcclxuICBwZXJmb3JtKHRhc2s6IFRhc2spOiBQcm9taXNlPGFueT4ge1xyXG4gICAgbGV0IG1ldGhvZCA9IGBfXyR7dGFzay50eXBlfV9fYDtcclxuICAgIHJldHVybiB0aGlzW21ldGhvZF0uY2FsbCh0aGlzLCB0YXNrLmRhdGEpO1xyXG4gIH07XHJcblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgLy8gUHJpdmF0ZSBtZXRob2RzXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgLyoqXHJcbiAgIE5vdGlmaWVzIGxpc3RlbmVycyB0aGF0IHRoaXMgc291cmNlIGhhcyBiZWVuIHRyYW5zZm9ybWVkIGJ5IGVtaXR0aW5nIHRoZVxyXG4gICBgdHJhbnNmb3JtYCBldmVudC5cclxuXHJcbiAgIFJlc29sdmVzIHdoZW4gYW55IHByb21pc2VzIHJldHVybmVkIHRvIGV2ZW50IGxpc3RlbmVycyBhcmUgcmVzb2x2ZWQuXHJcblxyXG4gICBBbHNvLCBhZGRzIGFuIGVudHJ5IHRvIHRoZSBTb3VyY2UncyBgdHJhbnNmb3JtTG9nYCBmb3IgZWFjaCB0cmFuc2Zvcm0uXHJcblxyXG4gICBAcHJpdmF0ZVxyXG4gICBAbWV0aG9kIF90cmFuc2Zvcm1lZFxyXG4gICBAcGFyYW0ge0FycmF5fSB0cmFuc2Zvcm1zIC0gVHJhbnNmb3JtcyB0aGF0IGhhdmUgb2NjdXJyZWQuXHJcbiAgIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gdHJhbnNmb3Jtcy5cclxuICAqL1xyXG4gIHByaXZhdGUgX3RyYW5zZm9ybWVkKHRyYW5zZm9ybXM6IFRyYW5zZm9ybVtdKTogUHJvbWlzZTxUcmFuc2Zvcm1bXT4ge1xyXG4gICAgcmV0dXJuIHRyYW5zZm9ybXNcclxuICAgICAgLnJlZHVjZSgoY2hhaW4sIHRyYW5zZm9ybSkgPT4ge1xyXG4gICAgICAgIHJldHVybiBjaGFpbi50aGVuKCgpID0+IHtcclxuICAgICAgICAgIGlmICh0aGlzLl90cmFuc2Zvcm1Mb2cuY29udGFpbnModHJhbnNmb3JtLmlkKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgcmV0dXJuIHRoaXMuX3RyYW5zZm9ybUxvZy5hcHBlbmQodHJhbnNmb3JtLmlkKVxyXG4gICAgICAgICAgICAudGhlbigoKSA9PiBzZXR0bGVJblNlcmllcyh0aGlzLCAndHJhbnNmb3JtJywgdHJhbnNmb3JtKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0sIE9yYml0LlByb21pc2UucmVzb2x2ZSgpKVxyXG4gICAgICAudGhlbigoKSA9PiB0cmFuc2Zvcm1zKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgX2VucXVldWVSZXF1ZXN0KHR5cGU6IHN0cmluZywgZGF0YTogYW55KTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICByZXR1cm4gdGhpcy5fcmVxdWVzdFF1ZXVlLnB1c2goeyB0eXBlLCBkYXRhIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBfZW5xdWV1ZVN5bmModHlwZTogc3RyaW5nLCBkYXRhOiBhbnkpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHJldHVybiB0aGlzLl9zeW5jUXVldWUucHVzaCh7IHR5cGUsIGRhdGEgfSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==