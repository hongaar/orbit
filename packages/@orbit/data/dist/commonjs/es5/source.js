"use strict";

var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3JjL3NvdXJjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHFCQUEyQjtBQUMzQixxQkFNcUI7QUFHckIsOEJBQTJDO0FBRTNDLGtDQUFtRDtBQUNuRCxzQkFBc0M7QUFjdEMsQUFTRzs7Ozs7Ozs7OztBQUVILHlCQWtCRTtvQkFBWSxBQUE2QixVQUE3QjtpQ0FBQTt1QkFBNkI7QUFBekM7b0JBQ0UsQUFBSSxBQWtCTDthQWxCTSxBQUFPLFVBQUcsQUFBUSxTQUFDLEFBQU0sQUFBQyxBQUMvQixBQUFJO2FBQUMsQUFBTyxVQUFHLEFBQVEsU0FBQyxBQUFNLEFBQUMsQUFDL0I7WUFBTSxBQUFJLE9BQUcsQUFBSSxLQUFDLEFBQUssUUFBRyxBQUFRLFNBQUMsQUFBSSxBQUFDLEFBQ3hDO1lBQU0sQUFBTSxTQUFHLEFBQUksS0FBQyxBQUFPLFVBQUcsQUFBUSxTQUFDLEFBQU0sQUFBQyxBQUM5QyxBQUFJO2FBQUMsQUFBYSxnQkFBRyxBQUFRLFNBQUMsQUFBWSxBQUFDLEFBQzNDLEFBQUk7YUFBQyxBQUFpQixvQkFBRyxBQUFRLFNBQUMsQUFBZ0IsQUFBQyxBQUVuRCxBQUFFLEFBQUM7WUFBQyxBQUFNLEFBQUMsUUFBQyxBQUFDLEFBQ1g7b0JBQU0sT0FBQyxBQUFpRCxtREFBRSxDQUFDLENBQUMsQUFBSSxBQUFDLEFBQUMsQUFDcEUsQUFBQztBQUVELEFBQUk7YUFBQyxBQUFhLGdCQUFHLElBQUksT0FBRyxJQUFDLEVBQUUsQUFBSSxNQUFFLEFBQUksT0FBTSxBQUFJLE9BQU0sU0FBRyxBQUFTLFdBQUUsQUFBTSxRQUFBLEFBQUUsQUFBQyxBQUFDLEFBQ2pGLEFBQUk7YUFBQyxBQUFhLGdCQUFHLElBQUksT0FBUyxVQUFDLEFBQUksTUFBRSxFQUFFLEFBQUksTUFBRSxBQUFJLE9BQU0sQUFBSSxPQUFXLGNBQUcsQUFBUyxXQUFFLEFBQU0sUUFBQSxBQUFFLEFB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IE9yYml0IGZyb20gJy4vbWFpbic7XHJcbmltcG9ydCB7XHJcbiAgZXZlbnRlZCwgRXZlbnRlZCwgc2V0dGxlSW5TZXJpZXMsXHJcbiAgQnVja2V0LFxyXG4gIFRhc2tRdWV1ZSxcclxuICBUYXNrLCBQZXJmb3JtZXIsXHJcbiAgTG9nXHJcbn0gZnJvbSAnQG9yYml0L2NvcmUnO1xyXG5pbXBvcnQgS2V5TWFwIGZyb20gJy4va2V5LW1hcCc7XHJcbmltcG9ydCBTY2hlbWEgZnJvbSAnLi9zY2hlbWEnO1xyXG5pbXBvcnQgUXVlcnlCdWlsZGVyIGZyb20gJy4vcXVlcnktYnVpbGRlcic7XHJcbmltcG9ydCB7IFRyYW5zZm9ybSB9IGZyb20gJy4vdHJhbnNmb3JtJztcclxuaW1wb3J0IFRyYW5zZm9ybUJ1aWxkZXIgZnJvbSAnLi90cmFuc2Zvcm0tYnVpbGRlcic7XHJcbmltcG9ydCB7IGFzc2VydCB9IGZyb20gJ0BvcmJpdC91dGlscyc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFNvdXJjZVNldHRpbmdzIHtcclxuICBuYW1lPzogc3RyaW5nO1xyXG4gIHNjaGVtYT86IFNjaGVtYTtcclxuICBrZXlNYXA/OiBLZXlNYXA7XHJcbiAgYnVja2V0PzogQnVja2V0O1xyXG4gIHF1ZXJ5QnVpbGRlcj86IFF1ZXJ5QnVpbGRlcjtcclxuICB0cmFuc2Zvcm1CdWlsZGVyPzogVHJhbnNmb3JtQnVpbGRlcjtcclxuICBhdXRvVXBncmFkZT86IGJvb2xlYW47XHJcbn1cclxuXHJcbmV4cG9ydCB0eXBlIFNvdXJjZUNsYXNzID0gKG5ldyAoKSA9PiBTb3VyY2UpO1xyXG5cclxuLyoqXHJcbiBCYXNlIGNsYXNzIGZvciBzb3VyY2VzLlxyXG5cclxuIEBjbGFzcyBTb3VyY2VcclxuIEBuYW1lc3BhY2UgT3JiaXRcclxuIEBwYXJhbSB7T2JqZWN0fSBbc2V0dGluZ3NdIC0gc2V0dGluZ3MgZm9yIHNvdXJjZVxyXG4gQHBhcmFtIHtTdHJpbmd9IFtzZXR0aW5ncy5uYW1lXSAtIE5hbWUgZm9yIHNvdXJjZVxyXG4gQHBhcmFtIHtTY2hlbWF9IFtzZXR0aW5ncy5zY2hlbWFdIC0gU2NoZW1hIGZvciBzb3VyY2VcclxuIEBjb25zdHJ1Y3RvclxyXG4gKi9cclxuQGV2ZW50ZWRcclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFNvdXJjZSBpbXBsZW1lbnRzIEV2ZW50ZWQsIFBlcmZvcm1lciB7XHJcbiAgcHJvdGVjdGVkIF9uYW1lOiBzdHJpbmc7XHJcbiAgcHJvdGVjdGVkIF9idWNrZXQ6IEJ1Y2tldDtcclxuICBwcm90ZWN0ZWQgX2tleU1hcDogS2V5TWFwO1xyXG4gIHByb3RlY3RlZCBfc2NoZW1hOiBTY2hlbWE7XHJcbiAgcHJvdGVjdGVkIF90cmFuc2Zvcm1Mb2c6IExvZztcclxuICBwcm90ZWN0ZWQgX3JlcXVlc3RRdWV1ZTogVGFza1F1ZXVlO1xyXG4gIHByb3RlY3RlZCBfc3luY1F1ZXVlOiBUYXNrUXVldWU7XHJcbiAgcHJvdGVjdGVkIF9xdWVyeUJ1aWxkZXI6IFF1ZXJ5QnVpbGRlcjtcclxuICBwcm90ZWN0ZWQgX3RyYW5zZm9ybUJ1aWxkZXI6IFRyYW5zZm9ybUJ1aWxkZXI7XHJcblxyXG4gIC8vIEV2ZW50ZWQgaW50ZXJmYWNlIHN0dWJzXHJcbiAgb246IChldmVudDogc3RyaW5nLCBjYWxsYmFjazogRnVuY3Rpb24sIGJpbmRpbmc/OiBvYmplY3QpID0+IHZvaWQ7XHJcbiAgb2ZmOiAoZXZlbnQ6IHN0cmluZywgY2FsbGJhY2s6IEZ1bmN0aW9uLCBiaW5kaW5nPzogb2JqZWN0KSA9PiB2b2lkO1xyXG4gIG9uZTogKGV2ZW50OiBzdHJpbmcsIGNhbGxiYWNrOiBGdW5jdGlvbiwgYmluZGluZz86IG9iamVjdCkgPT4gdm9pZDtcclxuICBlbWl0OiAoZXZlbnQ6IHN0cmluZywgLi4uYXJncykgPT4gdm9pZDtcclxuICBsaXN0ZW5lcnM6IChldmVudDogc3RyaW5nKSA9PiBhbnlbXTtcclxuXHJcbiAgY29uc3RydWN0b3Ioc2V0dGluZ3M6IFNvdXJjZVNldHRpbmdzID0ge30pIHtcclxuICAgIHRoaXMuX3NjaGVtYSA9IHNldHRpbmdzLnNjaGVtYTtcclxuICAgIHRoaXMuX2tleU1hcCA9IHNldHRpbmdzLmtleU1hcDtcclxuICAgIGNvbnN0IG5hbWUgPSB0aGlzLl9uYW1lID0gc2V0dGluZ3MubmFtZTtcclxuICAgIGNvbnN0IGJ1Y2tldCA9IHRoaXMuX2J1Y2tldCA9IHNldHRpbmdzLmJ1Y2tldDtcclxuICAgIHRoaXMuX3F1ZXJ5QnVpbGRlciA9IHNldHRpbmdzLnF1ZXJ5QnVpbGRlcjtcclxuICAgIHRoaXMuX3RyYW5zZm9ybUJ1aWxkZXIgPSBzZXR0aW5ncy50cmFuc2Zvcm1CdWlsZGVyO1xyXG5cclxuICAgIGlmIChidWNrZXQpIHtcclxuICAgICAgYXNzZXJ0KCdUcmFuc2Zvcm1Mb2cgcmVxdWlyZXMgYSBuYW1lIGlmIGl0IGhhcyBhIGJ1Y2tldCcsICEhbmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5fdHJhbnNmb3JtTG9nID0gbmV3IExvZyh7IG5hbWU6IG5hbWUgPyBgJHtuYW1lfS1sb2dgIDogdW5kZWZpbmVkLCBidWNrZXQgfSk7XHJcbiAgICB0aGlzLl9yZXF1ZXN0UXVldWUgPSBuZXcgVGFza1F1ZXVlKHRoaXMsIHsgbmFtZTogbmFtZSA/IGAke25hbWV9LXJlcXVlc3RzYCA6IHVuZGVmaW5lZCwgYnVja2V0IH0pO1xyXG4gICAgdGhpcy5fc3luY1F1ZXVlID0gbmV3IFRhc2tRdWV1ZSh0aGlzLCB7IG5hbWU6IG5hbWUgPyBgJHtuYW1lfS1zeW5jYCA6IHVuZGVmaW5lZCwgYnVja2V0IH0pO1xyXG5cclxuICAgIGlmICh0aGlzLl9zY2hlbWEgJiYgKHNldHRpbmdzLmF1dG9VcGdyYWRlID09PSB1bmRlZmluZWQgfHwgc2V0dGluZ3MuYXV0b1VwZ3JhZGUpKSB7XHJcbiAgICAgIHRoaXMuX3NjaGVtYS5vbigndXBncmFkZScsICgpID0+IHRoaXMudXBncmFkZSgpKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldCBuYW1lKCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5fbmFtZTtcclxuICB9XHJcblxyXG4gIGdldCBzY2hlbWEoKTogU2NoZW1hIHtcclxuICAgIHJldHVybiB0aGlzLl9zY2hlbWE7XHJcbiAgfVxyXG5cclxuICBnZXQga2V5TWFwKCk6IEtleU1hcCB7XHJcbiAgICByZXR1cm4gdGhpcy5fa2V5TWFwO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGJ1Y2tldCgpOiBCdWNrZXQge1xyXG4gICAgcmV0dXJuIHRoaXMuX2J1Y2tldDtcclxuICB9XHJcblxyXG4gIGdldCB0cmFuc2Zvcm1Mb2coKTogTG9nIHtcclxuICAgIHJldHVybiB0aGlzLl90cmFuc2Zvcm1Mb2c7XHJcbiAgfVxyXG5cclxuICBnZXQgcmVxdWVzdFF1ZXVlKCk6IFRhc2tRdWV1ZSB7XHJcbiAgICByZXR1cm4gdGhpcy5fcmVxdWVzdFF1ZXVlO1xyXG4gIH1cclxuXHJcbiAgZ2V0IHN5bmNRdWV1ZSgpOiBUYXNrUXVldWUge1xyXG4gICAgcmV0dXJuIHRoaXMuX3N5bmNRdWV1ZTtcclxuICB9XHJcblxyXG4gIGdldCBxdWVyeUJ1aWxkZXIoKTogUXVlcnlCdWlsZGVyIHtcclxuICAgIGxldCBxYiA9IHRoaXMuX3F1ZXJ5QnVpbGRlcjtcclxuICAgIGlmIChxYiA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHFiID0gdGhpcy5fcXVlcnlCdWlsZGVyID0gbmV3IFF1ZXJ5QnVpbGRlcigpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHFiO1xyXG4gIH1cclxuXHJcbiAgZ2V0IHRyYW5zZm9ybUJ1aWxkZXIoKTogVHJhbnNmb3JtQnVpbGRlciB7XHJcbiAgICBsZXQgdGIgPSB0aGlzLl90cmFuc2Zvcm1CdWlsZGVyO1xyXG4gICAgaWYgKHRiID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgdGIgPSB0aGlzLl90cmFuc2Zvcm1CdWlsZGVyID0gbmV3IFRyYW5zZm9ybUJ1aWxkZXIoe1xyXG4gICAgICAgIHJlY29yZEluaXRpYWxpemVyOiB0aGlzLl9zY2hlbWFcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGI7XHJcbiAgfVxyXG5cclxuICAvLyBQZXJmb3JtZXIgaW50ZXJmYWNlXHJcbiAgcGVyZm9ybSh0YXNrOiBUYXNrKTogUHJvbWlzZTxhbnk+IHtcclxuICAgIGxldCBtZXRob2QgPSBgX18ke3Rhc2sudHlwZX1fX2A7XHJcbiAgICByZXR1cm4gdGhpc1ttZXRob2RdLmNhbGwodGhpcywgdGFzay5kYXRhKTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBVcGdyYWRlIHNvdXJjZSBhcyBwYXJ0IG9mIGEgc2NoZW1hIHVwZ3JhZGUuXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkPn1cclxuICAgKiBAbWVtYmVyb2YgU291cmNlXHJcbiAgICovXHJcbiAgdXBncmFkZSgpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKTtcclxuICB9XHJcblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgLy8gUHJpdmF0ZSBtZXRob2RzXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgLyoqXHJcbiAgIE5vdGlmaWVzIGxpc3RlbmVycyB0aGF0IHRoaXMgc291cmNlIGhhcyBiZWVuIHRyYW5zZm9ybWVkIGJ5IGVtaXR0aW5nIHRoZVxyXG4gICBgdHJhbnNmb3JtYCBldmVudC5cclxuXHJcbiAgIFJlc29sdmVzIHdoZW4gYW55IHByb21pc2VzIHJldHVybmVkIHRvIGV2ZW50IGxpc3RlbmVycyBhcmUgcmVzb2x2ZWQuXHJcblxyXG4gICBBbHNvLCBhZGRzIGFuIGVudHJ5IHRvIHRoZSBTb3VyY2UncyBgdHJhbnNmb3JtTG9nYCBmb3IgZWFjaCB0cmFuc2Zvcm0uXHJcblxyXG4gICBAcHJpdmF0ZVxyXG4gICBAbWV0aG9kIF90cmFuc2Zvcm1lZFxyXG4gICBAcGFyYW0ge0FycmF5fSB0cmFuc2Zvcm1zIC0gVHJhbnNmb3JtcyB0aGF0IGhhdmUgb2NjdXJyZWQuXHJcbiAgIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gdHJhbnNmb3Jtcy5cclxuICAqL1xyXG4gIHByaXZhdGUgX3RyYW5zZm9ybWVkKHRyYW5zZm9ybXM6IFRyYW5zZm9ybVtdKTogUHJvbWlzZTxUcmFuc2Zvcm1bXT4ge1xyXG4gICAgcmV0dXJuIHRyYW5zZm9ybXNcclxuICAgICAgLnJlZHVjZSgoY2hhaW4sIHRyYW5zZm9ybSkgPT4ge1xyXG4gICAgICAgIHJldHVybiBjaGFpbi50aGVuKCgpID0+IHtcclxuICAgICAgICAgIGlmICh0aGlzLl90cmFuc2Zvcm1Mb2cuY29udGFpbnModHJhbnNmb3JtLmlkKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgcmV0dXJuIHRoaXMuX3RyYW5zZm9ybUxvZy5hcHBlbmQodHJhbnNmb3JtLmlkKVxyXG4gICAgICAgICAgICAudGhlbigoKSA9PiBzZXR0bGVJblNlcmllcyh0aGlzLCAndHJhbnNmb3JtJywgdHJhbnNmb3JtKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0sIE9yYml0LlByb21pc2UucmVzb2x2ZSgpKVxyXG4gICAgICAudGhlbigoKSA9PiB0cmFuc2Zvcm1zKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgX2VucXVldWVSZXF1ZXN0KHR5cGU6IHN0cmluZywgZGF0YTogYW55KTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICByZXR1cm4gdGhpcy5fcmVxdWVzdFF1ZXVlLnB1c2goeyB0eXBlLCBkYXRhIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBfZW5xdWV1ZVN5bmModHlwZTogc3RyaW5nLCBkYXRhOiBhbnkpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHJldHVybiB0aGlzLl9zeW5jUXVldWUucHVzaCh7IHR5cGUsIGRhdGEgfSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==