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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3JjL3NvdXJjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHFCQUEyQjtBQUMzQixxQkFNcUI7QUFHckIsOEJBQTJDO0FBRTNDLGtDQUFtRDtBQUNuRCxzQkFBc0M7QUFjdEMsQUFTRzs7Ozs7Ozs7OztBQUVIO0FBa0JFLG9CQUFZLEFBQTZCO0FBQTdCLGlDQUFBO0FBQUEsdUJBQTZCOztBQUF6QyxvQkFtQkM7QUFsQkMsQUFBSSxhQUFDLEFBQU8sVUFBRyxBQUFRLFNBQUMsQUFBTSxBQUFDO0FBQy9CLEFBQUksYUFBQyxBQUFPLFVBQUcsQUFBUSxTQUFDLEFBQU0sQUFBQztBQUMvQixZQUFNLEFBQUksT0FBRyxBQUFJLEtBQUMsQUFBSyxRQUFHLEFBQVEsU0FBQyxBQUFJLEFBQUM7QUFDeEMsWUFBTSxBQUFNLFNBQUcsQUFBSSxLQUFDLEFBQU8sVUFBRyxBQUFRLFNBQUMsQUFBTSxBQUFDO0FBQzlDLEFBQUksYUFBQyxBQUFhLGdCQUFHLEFBQVEsU0FBQyxBQUFZLEFBQUM7QUFDM0MsQUFBSSxhQUFDLEFBQWlCLG9CQUFHLEFBQVEsU0FBQyxBQUFnQixBQUFDO0FBRW5ELEFBQUUsQUFBQyxZQUFDLEFBQU0sQUFBQyxRQUFDLEFBQUM7QUFDWCxvQkFBTSxPQUFDLEFBQWlELG1EQUFFLENBQUMsQ0FBQyxBQUFJLEFBQUMsQUFBQyxBQUNwRTtBQUFDO0FBRUQsQUFBSSxhQUFDLEFBQWEsZ0JBQUcsSUFBSSxPQUFHLElBQUMsRUFBRSxBQUFJLE1BQUUsQUFBSSxPQUFNLEFBQUksT0FBTSxTQUFHLEFBQVMsV0FBRSxBQUFNLFFBQUEsQUFBRSxBQUFDLEFBQUM7QUFDakYsQUFBSSxhQUFDLEFBQWEsZ0JBQUcsSUFBSSxPQUFTLFVBQUMsQUFBSSxNQUFFLEVBQUUsQUFBSSxNQUFFLEFBQUksT0FBTSxBQUFJLE9BQVcsY0FBRyxBQUFTLFdBQUUsQUFBTSxRQUFBLEFB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Q29udGVudCI6WyJpbXBvcnQgT3JiaXQgZnJvbSAnLi9tYWluJztcclxuaW1wb3J0IHtcclxuICBldmVudGVkLCBFdmVudGVkLCBzZXR0bGVJblNlcmllcyxcclxuICBCdWNrZXQsXHJcbiAgVGFza1F1ZXVlLFxyXG4gIFRhc2ssIFBlcmZvcm1lcixcclxuICBMb2dcclxufSBmcm9tICdAb3JiaXQvY29yZSc7XHJcbmltcG9ydCBLZXlNYXAgZnJvbSAnLi9rZXktbWFwJztcclxuaW1wb3J0IFNjaGVtYSBmcm9tICcuL3NjaGVtYSc7XHJcbmltcG9ydCBRdWVyeUJ1aWxkZXIgZnJvbSAnLi9xdWVyeS1idWlsZGVyJztcclxuaW1wb3J0IHsgVHJhbnNmb3JtIH0gZnJvbSAnLi90cmFuc2Zvcm0nO1xyXG5pbXBvcnQgVHJhbnNmb3JtQnVpbGRlciBmcm9tICcuL3RyYW5zZm9ybS1idWlsZGVyJztcclxuaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSAnQG9yYml0L3V0aWxzJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgU291cmNlU2V0dGluZ3Mge1xyXG4gIG5hbWU/OiBzdHJpbmc7XHJcbiAgc2NoZW1hPzogU2NoZW1hO1xyXG4gIGtleU1hcD86IEtleU1hcDtcclxuICBidWNrZXQ/OiBCdWNrZXQ7XHJcbiAgcXVlcnlCdWlsZGVyPzogUXVlcnlCdWlsZGVyO1xyXG4gIHRyYW5zZm9ybUJ1aWxkZXI/OiBUcmFuc2Zvcm1CdWlsZGVyO1xyXG4gIGF1dG9VcGdyYWRlPzogYm9vbGVhbjtcclxufVxyXG5cclxuZXhwb3J0IHR5cGUgU291cmNlQ2xhc3MgPSAobmV3ICgpID0+IFNvdXJjZSk7XHJcblxyXG4vKipcclxuIEJhc2UgY2xhc3MgZm9yIHNvdXJjZXMuXHJcblxyXG4gQGNsYXNzIFNvdXJjZVxyXG4gQG5hbWVzcGFjZSBPcmJpdFxyXG4gQHBhcmFtIHtPYmplY3R9IFtzZXR0aW5nc10gLSBzZXR0aW5ncyBmb3Igc291cmNlXHJcbiBAcGFyYW0ge1N0cmluZ30gW3NldHRpbmdzLm5hbWVdIC0gTmFtZSBmb3Igc291cmNlXHJcbiBAcGFyYW0ge1NjaGVtYX0gW3NldHRpbmdzLnNjaGVtYV0gLSBTY2hlbWEgZm9yIHNvdXJjZVxyXG4gQGNvbnN0cnVjdG9yXHJcbiAqL1xyXG5AZXZlbnRlZFxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgU291cmNlIGltcGxlbWVudHMgRXZlbnRlZCwgUGVyZm9ybWVyIHtcclxuICBwcm90ZWN0ZWQgX25hbWU6IHN0cmluZztcclxuICBwcm90ZWN0ZWQgX2J1Y2tldDogQnVja2V0O1xyXG4gIHByb3RlY3RlZCBfa2V5TWFwOiBLZXlNYXA7XHJcbiAgcHJvdGVjdGVkIF9zY2hlbWE6IFNjaGVtYTtcclxuICBwcm90ZWN0ZWQgX3RyYW5zZm9ybUxvZzogTG9nO1xyXG4gIHByb3RlY3RlZCBfcmVxdWVzdFF1ZXVlOiBUYXNrUXVldWU7XHJcbiAgcHJvdGVjdGVkIF9zeW5jUXVldWU6IFRhc2tRdWV1ZTtcclxuICBwcm90ZWN0ZWQgX3F1ZXJ5QnVpbGRlcjogUXVlcnlCdWlsZGVyO1xyXG4gIHByb3RlY3RlZCBfdHJhbnNmb3JtQnVpbGRlcjogVHJhbnNmb3JtQnVpbGRlcjtcclxuXHJcbiAgLy8gRXZlbnRlZCBpbnRlcmZhY2Ugc3R1YnNcclxuICBvbjogKGV2ZW50OiBzdHJpbmcsIGNhbGxiYWNrOiBGdW5jdGlvbiwgYmluZGluZz86IG9iamVjdCkgPT4gdm9pZDtcclxuICBvZmY6IChldmVudDogc3RyaW5nLCBjYWxsYmFjazogRnVuY3Rpb24sIGJpbmRpbmc/OiBvYmplY3QpID0+IHZvaWQ7XHJcbiAgb25lOiAoZXZlbnQ6IHN0cmluZywgY2FsbGJhY2s6IEZ1bmN0aW9uLCBiaW5kaW5nPzogb2JqZWN0KSA9PiB2b2lkO1xyXG4gIGVtaXQ6IChldmVudDogc3RyaW5nLCAuLi5hcmdzKSA9PiB2b2lkO1xyXG4gIGxpc3RlbmVyczogKGV2ZW50OiBzdHJpbmcpID0+IGFueVtdO1xyXG5cclxuICBjb25zdHJ1Y3RvcihzZXR0aW5nczogU291cmNlU2V0dGluZ3MgPSB7fSkge1xyXG4gICAgdGhpcy5fc2NoZW1hID0gc2V0dGluZ3Muc2NoZW1hO1xyXG4gICAgdGhpcy5fa2V5TWFwID0gc2V0dGluZ3Mua2V5TWFwO1xyXG4gICAgY29uc3QgbmFtZSA9IHRoaXMuX25hbWUgPSBzZXR0aW5ncy5uYW1lO1xyXG4gICAgY29uc3QgYnVja2V0ID0gdGhpcy5fYnVja2V0ID0gc2V0dGluZ3MuYnVja2V0O1xyXG4gICAgdGhpcy5fcXVlcnlCdWlsZGVyID0gc2V0dGluZ3MucXVlcnlCdWlsZGVyO1xyXG4gICAgdGhpcy5fdHJhbnNmb3JtQnVpbGRlciA9IHNldHRpbmdzLnRyYW5zZm9ybUJ1aWxkZXI7XHJcblxyXG4gICAgaWYgKGJ1Y2tldCkge1xyXG4gICAgICBhc3NlcnQoJ1RyYW5zZm9ybUxvZyByZXF1aXJlcyBhIG5hbWUgaWYgaXQgaGFzIGEgYnVja2V0JywgISFuYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLl90cmFuc2Zvcm1Mb2cgPSBuZXcgTG9nKHsgbmFtZTogbmFtZSA/IGAke25hbWV9LWxvZ2AgOiB1bmRlZmluZWQsIGJ1Y2tldCB9KTtcclxuICAgIHRoaXMuX3JlcXVlc3RRdWV1ZSA9IG5ldyBUYXNrUXVldWUodGhpcywgeyBuYW1lOiBuYW1lID8gYCR7bmFtZX0tcmVxdWVzdHNgIDogdW5kZWZpbmVkLCBidWNrZXQgfSk7XHJcbiAgICB0aGlzLl9zeW5jUXVldWUgPSBuZXcgVGFza1F1ZXVlKHRoaXMsIHsgbmFtZTogbmFtZSA/IGAke25hbWV9LXN5bmNgIDogdW5kZWZpbmVkLCBidWNrZXQgfSk7XHJcblxyXG4gICAgaWYgKHRoaXMuX3NjaGVtYSAmJiAoc2V0dGluZ3MuYXV0b1VwZ3JhZGUgPT09IHVuZGVmaW5lZCB8fCBzZXR0aW5ncy5hdXRvVXBncmFkZSkpIHtcclxuICAgICAgdGhpcy5fc2NoZW1hLm9uKCd1cGdyYWRlJywgKCkgPT4gdGhpcy51cGdyYWRlKCkpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0IG5hbWUoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLl9uYW1lO1xyXG4gIH1cclxuXHJcbiAgZ2V0IHNjaGVtYSgpOiBTY2hlbWEge1xyXG4gICAgcmV0dXJuIHRoaXMuX3NjaGVtYTtcclxuICB9XHJcblxyXG4gIGdldCBrZXlNYXAoKTogS2V5TWFwIHtcclxuICAgIHJldHVybiB0aGlzLl9rZXlNYXA7XHJcbiAgfVxyXG5cclxuICBnZXQgYnVja2V0KCk6IEJ1Y2tldCB7XHJcbiAgICByZXR1cm4gdGhpcy5fYnVja2V0O1xyXG4gIH1cclxuXHJcbiAgZ2V0IHRyYW5zZm9ybUxvZygpOiBMb2cge1xyXG4gICAgcmV0dXJuIHRoaXMuX3RyYW5zZm9ybUxvZztcclxuICB9XHJcblxyXG4gIGdldCByZXF1ZXN0UXVldWUoKTogVGFza1F1ZXVlIHtcclxuICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0UXVldWU7XHJcbiAgfVxyXG5cclxuICBnZXQgc3luY1F1ZXVlKCk6IFRhc2tRdWV1ZSB7XHJcbiAgICByZXR1cm4gdGhpcy5fc3luY1F1ZXVlO1xyXG4gIH1cclxuXHJcbiAgZ2V0IHF1ZXJ5QnVpbGRlcigpOiBRdWVyeUJ1aWxkZXIge1xyXG4gICAgbGV0IHFiID0gdGhpcy5fcXVlcnlCdWlsZGVyO1xyXG4gICAgaWYgKHFiID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgcWIgPSB0aGlzLl9xdWVyeUJ1aWxkZXIgPSBuZXcgUXVlcnlCdWlsZGVyKCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcWI7XHJcbiAgfVxyXG5cclxuICBnZXQgdHJhbnNmb3JtQnVpbGRlcigpOiBUcmFuc2Zvcm1CdWlsZGVyIHtcclxuICAgIGxldCB0YiA9IHRoaXMuX3RyYW5zZm9ybUJ1aWxkZXI7XHJcbiAgICBpZiAodGIgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICB0YiA9IHRoaXMuX3RyYW5zZm9ybUJ1aWxkZXIgPSBuZXcgVHJhbnNmb3JtQnVpbGRlcih7XHJcbiAgICAgICAgcmVjb3JkSW5pdGlhbGl6ZXI6IHRoaXMuX3NjaGVtYVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIHJldHVybiB0YjtcclxuICB9XHJcblxyXG4gIC8vIFBlcmZvcm1lciBpbnRlcmZhY2VcclxuICBwZXJmb3JtKHRhc2s6IFRhc2spOiBQcm9taXNlPGFueT4ge1xyXG4gICAgbGV0IG1ldGhvZCA9IGBfXyR7dGFzay50eXBlfV9fYDtcclxuICAgIHJldHVybiB0aGlzW21ldGhvZF0uY2FsbCh0aGlzLCB0YXNrLmRhdGEpO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIFVwZ3JhZGUgc291cmNlIGFzIHBhcnQgb2YgYSBzY2hlbWEgdXBncmFkZS5cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPHZvaWQ+fVxyXG4gICAqIEBtZW1iZXJvZiBTb3VyY2VcclxuICAgKi9cclxuICB1cGdyYWRlKCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgcmV0dXJuIE9yYml0LlByb21pc2UucmVzb2x2ZSgpO1xyXG4gIH1cclxuXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAvLyBQcml2YXRlIG1ldGhvZHNcclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAvKipcclxuICAgTm90aWZpZXMgbGlzdGVuZXJzIHRoYXQgdGhpcyBzb3VyY2UgaGFzIGJlZW4gdHJhbnNmb3JtZWQgYnkgZW1pdHRpbmcgdGhlXHJcbiAgIGB0cmFuc2Zvcm1gIGV2ZW50LlxyXG5cclxuICAgUmVzb2x2ZXMgd2hlbiBhbnkgcHJvbWlzZXMgcmV0dXJuZWQgdG8gZXZlbnQgbGlzdGVuZXJzIGFyZSByZXNvbHZlZC5cclxuXHJcbiAgIEFsc28sIGFkZHMgYW4gZW50cnkgdG8gdGhlIFNvdXJjZSdzIGB0cmFuc2Zvcm1Mb2dgIGZvciBlYWNoIHRyYW5zZm9ybS5cclxuXHJcbiAgIEBwcml2YXRlXHJcbiAgIEBtZXRob2QgX3RyYW5zZm9ybWVkXHJcbiAgIEBwYXJhbSB7QXJyYXl9IHRyYW5zZm9ybXMgLSBUcmFuc2Zvcm1zIHRoYXQgaGF2ZSBvY2N1cnJlZC5cclxuICAgQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdGhhdCByZXNvbHZlcyB0byB0cmFuc2Zvcm1zLlxyXG4gICovXHJcbiAgcHJpdmF0ZSBfdHJhbnNmb3JtZWQodHJhbnNmb3JtczogVHJhbnNmb3JtW10pOiBQcm9taXNlPFRyYW5zZm9ybVtdPiB7XHJcbiAgICByZXR1cm4gdHJhbnNmb3Jtc1xyXG4gICAgICAucmVkdWNlKChjaGFpbiwgdHJhbnNmb3JtKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGNoYWluLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgaWYgKHRoaXMuX3RyYW5zZm9ybUxvZy5jb250YWlucyh0cmFuc2Zvcm0uaWQpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICByZXR1cm4gdGhpcy5fdHJhbnNmb3JtTG9nLmFwcGVuZCh0cmFuc2Zvcm0uaWQpXHJcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHNldHRsZUluU2VyaWVzKHRoaXMsICd0cmFuc2Zvcm0nLCB0cmFuc2Zvcm0pKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSwgT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCkpXHJcbiAgICAgIC50aGVuKCgpID0+IHRyYW5zZm9ybXMpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBfZW5xdWV1ZVJlcXVlc3QodHlwZTogc3RyaW5nLCBkYXRhOiBhbnkpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0UXVldWUucHVzaCh7IHR5cGUsIGRhdGEgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIF9lbnF1ZXVlU3luYyh0eXBlOiBzdHJpbmcsIGRhdGE6IGFueSk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgcmV0dXJuIHRoaXMuX3N5bmNRdWV1ZS5wdXNoKHsgdHlwZSwgZGF0YSB9KTtcclxuICB9XHJcbn1cclxuIl19