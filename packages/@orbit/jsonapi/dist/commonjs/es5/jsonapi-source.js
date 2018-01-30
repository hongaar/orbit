"use strict";

var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
            }
        }
    }return target;
};

function _defaults(obj, defaults) {
    var keys = Object.getOwnPropertyNames(defaults);for (var i = 0; i < keys.length; i++) {
        var key = keys[i];var value = Object.getOwnPropertyDescriptor(defaults, key);if (value && value.configurable && obj[key] === undefined) {
            Object.defineProperty(obj, key, value);
        }
    }return obj;
}

var __extends = undefined && undefined.__extends || function () {
    var extendStatics = Object.setPrototypeOf || _extends({}, []) instanceof Array && function (d, b) {
        _defaults(d, b);
    } || function (d, b) {
        for (var p in b) {
            if (b.hasOwnProperty(p)) d[p] = b[p];
        }
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
        if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable valid-jsdoc */
var data_1 = require("@orbit/data");
var utils_1 = require("@orbit/utils");
var jsonapi_serializer_1 = require("./jsonapi-serializer");
var query_params_1 = require("./lib/query-params");
var pull_operators_1 = require("./lib/pull-operators");
var transform_requests_1 = require("./lib/transform-requests");
var exceptions_1 = require("./lib/exceptions");
if (typeof data_1.default.globals.fetch !== 'undefined' && data_1.default.fetch === undefined) {
    data_1.default.fetch = data_1.default.globals.fetch;
}
/**
 Source for accessing a JSON API compliant RESTful API with a network fetch
 request.

 If a single transform or query requires more than one fetch request,
 requests will be performed sequentially and resolved together. From the
 perspective of Orbit, these operations will all succeed or fail together. The
 `maxRequestsPerTransform` and `maxRequestsPerQuery` settings allow limits to be
 set on this behavior. These settings should be set to `1` if your client/server
 configuration is unable to resolve partially successful transforms / queries.

 @class JSONAPISource
 @extends Source
 */
var JSONAPISource = function (_super) {
    __extends(JSONAPISource, _super);
    function JSONAPISource(settings) {
        if (settings === void 0) {
            settings = {};
        }
        var _this = this;
        utils_1.assert('JSONAPISource\'s `schema` must be specified in `settings.schema` constructor argument', !!settings.schema);
        utils_1.assert('JSONAPISource requires Orbit.Promise be defined', data_1.default.Promise);
        utils_1.assert('JSONAPISource requires Orbit.fetch be defined', data_1.default.fetch);
        settings.name = settings.name || 'jsonapi';
        _this = _super.call(this, settings) || this;
        _this.namespace = settings.namespace;
        _this.host = settings.host;
        _this.defaultFetchHeaders = settings.defaultFetchHeaders || { Accept: 'application/vnd.api+json' };
        _this.defaultFetchTimeout = settings.defaultFetchTimeout || 5000;
        _this.maxRequestsPerTransform = settings.maxRequestsPerTransform;
        var SerializerClass = settings.SerializerClass || jsonapi_serializer_1.default;
        _this.serializer = new SerializerClass({ schema: settings.schema, keyMap: settings.keyMap });
        return _this;
    }
    /////////////////////////////////////////////////////////////////////////////
    // Pushable interface implementation
    /////////////////////////////////////////////////////////////////////////////
    JSONAPISource.prototype._push = function (transform) {
        var _this = this;
        var requests = transform_requests_1.getTransformRequests(this, transform);
        if (this.maxRequestsPerTransform && requests.length > this.maxRequestsPerTransform) {
            return data_1.default.Promise.resolve().then(function () {
                throw new data_1.TransformNotAllowed("This transform requires " + requests.length + " requests, which exceeds the specified limit of " + _this.maxRequestsPerTransform + " requests per transform.", transform);
            });
        }
        return this._processRequests(requests, transform_requests_1.TransformRequestProcessors).then(function (transforms) {
            transforms.unshift(transform);
            return transforms;
        });
    };
    /////////////////////////////////////////////////////////////////////////////
    // Pullable interface implementation
    /////////////////////////////////////////////////////////////////////////////
    JSONAPISource.prototype._pull = function (query) {
        var operator = pull_operators_1.PullOperators[query.expression.op];
        if (!operator) {
            throw new Error('JSONAPISource does not support the `${query.expression.op}` operator for queries.');
        }
        return operator(this, query);
    };
    /////////////////////////////////////////////////////////////////////////////
    // Publicly accessible methods particular to JSONAPISource
    /////////////////////////////////////////////////////////////////////////////
    JSONAPISource.prototype.fetch = function (url, settings) {
        var _this = this;
        if (settings === void 0) {
            settings = {};
        }
        settings.headers = settings.headers || this.defaultFetchHeaders;
        var headers = settings.headers;
        var method = settings.method || 'GET';
        // console.log('fetch', url, settings, 'polyfill', fetch.polyfill);
        var timeout = settings.timeout || this.defaultFetchTimeout;
        if (settings.timeout) {
            delete settings.timeout;
        }
        if (settings.json) {
            utils_1.assert('`json` and `body` can\'t both be set for fetch requests.', !settings.body);
            settings.body = JSON.stringify(settings.json);
            delete settings.json;
        }
        if (settings.body && method !== 'GET') {
            headers['Content-Type'] = headers['Content-Type'] || 'application/vnd.api+json; charset=utf-8';
        }
        if (settings.params) {
            if (url.indexOf('?') === -1) {
                url += '?';
            } else {
                url += '&';
            }
            url += query_params_1.encodeQueryParams(settings.params);
            delete settings.params;
        }
        if (timeout) {
            return new data_1.default.Promise(function (resolve, reject) {
                var timedOut;
                var timer = data_1.default.globals.setTimeout(function () {
                    timedOut = true;
                    reject(new data_1.NetworkError("No fetch response within " + timeout + "ms."));
                }, timeout);
                data_1.default.fetch(url, settings).catch(function (e) {
                    data_1.default.globals.clearTimeout(timer);
                    if (!timedOut) {
                        return _this.handleFetchError(e);
                    }
                }).then(function (response) {
                    data_1.default.globals.clearTimeout(timer);
                    if (!timedOut) {
                        return _this.handleFetchResponse(response);
                    }
                }).then(resolve, reject);
            });
        } else {
            return data_1.default.fetch(url, settings).catch(function (e) {
                return _this.handleFetchError(e);
            }).then(function (response) {
                return _this.handleFetchResponse(response);
            });
        }
    };
    JSONAPISource.prototype.handleFetchResponse = function (response) {
        var _this = this;
        if (response.status === 201) {
            if (this.responseHasContent(response)) {
                return response.json();
            } else {
                throw new exceptions_1.InvalidServerResponse("Server responses with a " + response.status + " status should return content with a Content-Type that includes 'application/vnd.api+json'.");
            }
        } else if (response.status >= 200 && response.status < 300) {
            if (this.responseHasContent(response)) {
                return response.json();
            }
        } else {
            if (this.responseHasContent(response)) {
                return response.json().then(function (data) {
                    return _this.handleFetchResponseError(response, data);
                });
            } else {
                return this.handleFetchResponseError(response);
            }
        }
        return data_1.default.Promise.resolve();
    };
    JSONAPISource.prototype.handleFetchResponseError = function (response, data) {
        var error;
        if (response.status >= 400 && response.status < 500) {
            error = new data_1.ClientError(response.statusText);
        } else {
            error = new data_1.ServerError(response.statusText);
        }
        error.response = response;
        error.data = data;
        return data_1.default.Promise.reject(error);
    };
    JSONAPISource.prototype.handleFetchError = function (e) {
        var error = new data_1.NetworkError(e);
        return data_1.default.Promise.reject(error);
    };
    JSONAPISource.prototype.responseHasContent = function (response) {
        var contentType = response.headers.get('Content-Type');
        return contentType && contentType.indexOf('application/vnd.api+json') > -1;
    };
    JSONAPISource.prototype.resourceNamespace = function (type) {
        return this.namespace;
    };
    JSONAPISource.prototype.resourceHost = function (type) {
        return this.host;
    };
    JSONAPISource.prototype.resourcePath = function (type, id) {
        var path = [this.serializer.resourceType(type)];
        if (id) {
            var resourceId = this.serializer.resourceId(type, id);
            if (resourceId) {
                path.push(resourceId);
            }
        }
        return path.join('/');
    };
    JSONAPISource.prototype.resourceURL = function (type, id) {
        var host = this.resourceHost(type);
        var namespace = this.resourceNamespace(type);
        var url = [];
        if (host) {
            url.push(host);
        }
        if (namespace) {
            url.push(namespace);
        }
        url.push(this.resourcePath(type, id));
        if (!host) {
            url.unshift('');
        }
        return url.join('/');
    };
    JSONAPISource.prototype.resourceRelationshipURL = function (type, id, relationship) {
        return this.resourceURL(type, id) + '/relationships/' + this.serializer.resourceRelationship(type, relationship);
    };
    JSONAPISource.prototype.relatedResourceURL = function (type, id, relationship) {
        return this.resourceURL(type, id) + '/' + this.serializer.resourceRelationship(type, relationship);
    };
    /////////////////////////////////////////////////////////////////////////////
    // Private methods
    /////////////////////////////////////////////////////////////////////////////
    JSONAPISource.prototype._processRequests = function (requests, processors) {
        var _this = this;
        var transforms = [];
        var result = data_1.default.Promise.resolve();
        requests.forEach(function (request) {
            var processor = processors[request.op];
            result = result.then(function () {
                return processor(_this, request).then(function (additionalTransforms) {
                    if (additionalTransforms) {
                        Array.prototype.push.apply(transforms, additionalTransforms);
                    }
                });
            });
        });
        return result.then(function () {
            return transforms;
        });
    };
    JSONAPISource = __decorate([data_1.pullable, data_1.pushable], JSONAPISource);
    return JSONAPISource;
}(data_1.Source);
exports.default = JSONAPISource;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbmFwaS1zb3VyY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzcmMvanNvbmFwaS1zb3VyY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsQUFBZ0M7QUFDaEMscUJBZXFCO0FBRXJCLHNCQUFzQztBQUN0QyxtQ0FBb0Y7QUFDcEYsNkJBQXVEO0FBQ3ZELCtCQUFtRTtBQUNuRSxtQ0FBNEY7QUFDNUYsMkJBQXlEO0FBRXpELEFBQUUsQUFBQyxJQUFDLE9BQU8sT0FBSyxRQUFDLEFBQU8sUUFBQyxBQUFLLFVBQUssQUFBVyxlQUFJLE9BQUssUUFBQyxBQUFLLFVBQUssQUFBUyxBQUFDLFdBQUMsQUFBQyxBQUM1RTtXQUFLLFFBQUMsQUFBSyxRQUFHLE9BQUssUUFBQyxBQUFPLFFBQUMsQUFBSyxBQUFDLEFBQ3BDLEFBQUM7O0FBb0JELEFBYUc7Ozs7Ozs7Ozs7Ozs7O0FBR0gsc0NBQTJDOzZCQUFNLEFBYy9DOzJCQUFZLEFBQW9DLFVBQXBDO2lDQUFBO3VCQUFvQztBQUFoRDtvQkFrQkMsQUFqQkM7Z0JBQU0sT0FBQyxBQUF1Rix5RkFBRSxDQUFDLENBQUMsQUFBUSxTQUFDLEFBQU0sQUFBQyxBQUFDLEFBQ25IO2dCQUFNLE9BQUMsQUFBaUQsbURBQUUsT0FBSyxRQUFDLEFBQU8sQUFBQyxBQUFDLEFBQ3pFO2dCQUFNLE9BQUMsQUFBK0MsaURBQUUsT0FBSyxRQUFDLEFBQUssQUFBQyxBQUFDLEFBRXJFLEFBQVE7aUJBQUMsQUFBSSxPQUFHLEFBQVEsU0FBQyxBQUFJLFFBQUksQUFBUyxBQUFDLEFBRTNDO2dCQUFBLGtCQUFNLEFBQVEsQUFBQyxhQUFDLEFBRWhCLEFBQUk7Y0FBQyxBQUFTLFlBQWEsQUFBUSxTQUFDLEFBQVMsQUFBQyxBQUM5QyxBQUFJO2NBQUMsQUFBSSxPQUFrQixBQUFRLFNBQUMsQUFBSSxBQUFDLEFBQ3pDLEFBQUk7Y0FBQyxB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QyxBQUFVLFlBQUUsQUFBb0IsQUFBQyxBQUFDLEFBQy9ELEFBQUMsQUFDSDtBQUFDLEFBQUMsQUFBQyxBQUNQO0FBTlMsQUFBUyxBQU1qQixBQUFDLEFBQUMsQUFDTDtBQVJXLEFBQU0sQUFRaEIsQUFBQyxBQUFDO0FBRUgsQUFBTTtzQkFBUSxBQUFJLEtBQUMsWUFBTTttQkFBQSxBQUFVLEFBQUMsQUFBQyxBQUN2QztBQURTLEFBQU0sQUFDZDtBQXpQa0IsQUFBYTtnQ0FGakMsT0FBUSxVQUNSLE9BQVEsV0FDWSxBQUFhLEFBMFBqQyxBQUFEO1dBQUMsQUExUEQsQUEwUEM7RUExUDBDLE9BQU0sQUEwUGhEO2tCQTFQb0IsQUFBYSIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIHZhbGlkLWpzZG9jICovXHJcbmltcG9ydCBPcmJpdCwge1xyXG4gIEtleU1hcCxcclxuICBSZWNvcmRPcGVyYXRpb24sXHJcbiAgU2NoZW1hLFxyXG4gIFNvdXJjZSwgU291cmNlU2V0dGluZ3MsXHJcbiAgUXVlcnksIFF1ZXJ5T3JFeHByZXNzaW9uLFxyXG4gIFB1bGxhYmxlLCBwdWxsYWJsZSxcclxuICBQdXNoYWJsZSwgcHVzaGFibGUsXHJcbiAgVHJhbnNmb3JtLFxyXG4gIFRyYW5zZm9ybU9yT3BlcmF0aW9ucyxcclxuICBjb2FsZXNjZVJlY29yZE9wZXJhdGlvbnMsXHJcbiAgUXVlcnlOb3RBbGxvd2VkLCBUcmFuc2Zvcm1Ob3RBbGxvd2VkLFxyXG4gIENsaWVudEVycm9yLFxyXG4gIFNlcnZlckVycm9yLFxyXG4gIE5ldHdvcmtFcnJvclxyXG59IGZyb20gJ0BvcmJpdC9kYXRhJztcclxuaW1wb3J0IHsgTG9nIH0gZnJvbSAnQG9yYml0L2NvcmUnO1xyXG5pbXBvcnQgeyBhc3NlcnQgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xyXG5pbXBvcnQgSlNPTkFQSVNlcmlhbGl6ZXIsIHsgSlNPTkFQSVNlcmlhbGl6ZXJTZXR0aW5ncyB9IGZyb20gJy4vanNvbmFwaS1zZXJpYWxpemVyJztcclxuaW1wb3J0IHsgZW5jb2RlUXVlcnlQYXJhbXMgfSBmcm9tICcuL2xpYi9xdWVyeS1wYXJhbXMnO1xyXG5pbXBvcnQgeyBQdWxsT3BlcmF0b3IsIFB1bGxPcGVyYXRvcnMgfSBmcm9tICcuL2xpYi9wdWxsLW9wZXJhdG9ycyc7XHJcbmltcG9ydCB7IGdldFRyYW5zZm9ybVJlcXVlc3RzLCBUcmFuc2Zvcm1SZXF1ZXN0UHJvY2Vzc29ycyB9IGZyb20gJy4vbGliL3RyYW5zZm9ybS1yZXF1ZXN0cyc7XHJcbmltcG9ydCB7IEludmFsaWRTZXJ2ZXJSZXNwb25zZSB9IGZyb20gJy4vbGliL2V4Y2VwdGlvbnMnO1xyXG5cclxuaWYgKHR5cGVvZiBPcmJpdC5nbG9iYWxzLmZldGNoICE9PSAndW5kZWZpbmVkJyAmJiBPcmJpdC5mZXRjaCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgT3JiaXQuZmV0Y2ggPSBPcmJpdC5nbG9iYWxzLmZldGNoO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEZldGNoU2V0dGluZ3Mge1xyXG4gIGhlYWRlcnM/OiBvYmplY3Q7XHJcbiAgbWV0aG9kPzogc3RyaW5nO1xyXG4gIGpzb24/OiBvYmplY3Q7XHJcbiAgYm9keT86IHN0cmluZztcclxuICBwYXJhbXM/OiBhbnk7XHJcbiAgdGltZW91dD86IG51bWJlcjtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBKU09OQVBJU291cmNlU2V0dGluZ3MgZXh0ZW5kcyBTb3VyY2VTZXR0aW5ncyB7XHJcbiAgbWF4UmVxdWVzdHNQZXJUcmFuc2Zvcm0/OiBudW1iZXI7XHJcbiAgbmFtZXNwYWNlPzogc3RyaW5nO1xyXG4gIGhvc3Q/OiBzdHJpbmc7XHJcbiAgZGVmYXVsdEZldGNoSGVhZGVycz86IG9iamVjdDtcclxuICBkZWZhdWx0RmV0Y2hUaW1lb3V0PzogbnVtYmVyO1xyXG4gIFNlcmlhbGl6ZXJDbGFzcz86IChuZXcgKHNldHRpbmdzOiBKU09OQVBJU2VyaWFsaXplclNldHRpbmdzKSA9PiBKU09OQVBJU2VyaWFsaXplcik7XHJcbn1cclxuXHJcbi8qKlxyXG4gU291cmNlIGZvciBhY2Nlc3NpbmcgYSBKU09OIEFQSSBjb21wbGlhbnQgUkVTVGZ1bCBBUEkgd2l0aCBhIG5ldHdvcmsgZmV0Y2hcclxuIHJlcXVlc3QuXHJcblxyXG4gSWYgYSBzaW5nbGUgdHJhbnNmb3JtIG9yIHF1ZXJ5IHJlcXVpcmVzIG1vcmUgdGhhbiBvbmUgZmV0Y2ggcmVxdWVzdCxcclxuIHJlcXVlc3RzIHdpbGwgYmUgcGVyZm9ybWVkIHNlcXVlbnRpYWxseSBhbmQgcmVzb2x2ZWQgdG9nZXRoZXIuIEZyb20gdGhlXHJcbiBwZXJzcGVjdGl2ZSBvZiBPcmJpdCwgdGhlc2Ugb3BlcmF0aW9ucyB3aWxsIGFsbCBzdWNjZWVkIG9yIGZhaWwgdG9nZXRoZXIuIFRoZVxyXG4gYG1heFJlcXVlc3RzUGVyVHJhbnNmb3JtYCBhbmQgYG1heFJlcXVlc3RzUGVyUXVlcnlgIHNldHRpbmdzIGFsbG93IGxpbWl0cyB0byBiZVxyXG4gc2V0IG9uIHRoaXMgYmVoYXZpb3IuIFRoZXNlIHNldHRpbmdzIHNob3VsZCBiZSBzZXQgdG8gYDFgIGlmIHlvdXIgY2xpZW50L3NlcnZlclxyXG4gY29uZmlndXJhdGlvbiBpcyB1bmFibGUgdG8gcmVzb2x2ZSBwYXJ0aWFsbHkgc3VjY2Vzc2Z1bCB0cmFuc2Zvcm1zIC8gcXVlcmllcy5cclxuXHJcbiBAY2xhc3MgSlNPTkFQSVNvdXJjZVxyXG4gQGV4dGVuZHMgU291cmNlXHJcbiAqL1xyXG5AcHVsbGFibGVcclxuQHB1c2hhYmxlXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEpTT05BUElTb3VyY2UgZXh0ZW5kcyBTb3VyY2UgaW1wbGVtZW50cyBQdWxsYWJsZSwgUHVzaGFibGUge1xyXG4gIG1heFJlcXVlc3RzUGVyVHJhbnNmb3JtOiBudW1iZXI7XHJcbiAgbmFtZXNwYWNlOiBzdHJpbmc7XHJcbiAgaG9zdDogc3RyaW5nO1xyXG4gIGRlZmF1bHRGZXRjaEhlYWRlcnM6IG9iamVjdDtcclxuICBkZWZhdWx0RmV0Y2hUaW1lb3V0OiBudW1iZXI7XHJcbiAgc2VyaWFsaXplcjogSlNPTkFQSVNlcmlhbGl6ZXI7XHJcblxyXG4gIC8vIFB1bGxhYmxlIGludGVyZmFjZSBzdHVic1xyXG4gIHB1bGw6IChxdWVyeU9yRXhwcmVzc2lvbjogUXVlcnlPckV4cHJlc3Npb24sIG9wdGlvbnM/OiBvYmplY3QsIGlkPzogc3RyaW5nKSA9PiBQcm9taXNlPFRyYW5zZm9ybVtdPjtcclxuXHJcbiAgLy8gUHVzaGFibGUgaW50ZXJmYWNlIHN0dWJzXHJcbiAgcHVzaDogKHRyYW5zZm9ybU9yT3BlcmF0aW9uczogVHJhbnNmb3JtT3JPcGVyYXRpb25zLCBvcHRpb25zPzogb2JqZWN0LCBpZD86IHN0cmluZykgPT4gUHJvbWlzZTxUcmFuc2Zvcm1bXT47XHJcblxyXG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzOiBKU09OQVBJU291cmNlU2V0dGluZ3MgPSB7fSkge1xyXG4gICAgYXNzZXJ0KCdKU09OQVBJU291cmNlXFwncyBgc2NoZW1hYCBtdXN0IGJlIHNwZWNpZmllZCBpbiBgc2V0dGluZ3Muc2NoZW1hYCBjb25zdHJ1Y3RvciBhcmd1bWVudCcsICEhc2V0dGluZ3Muc2NoZW1hKTtcclxuICAgIGFzc2VydCgnSlNPTkFQSVNvdXJjZSByZXF1aXJlcyBPcmJpdC5Qcm9taXNlIGJlIGRlZmluZWQnLCBPcmJpdC5Qcm9taXNlKTtcclxuICAgIGFzc2VydCgnSlNPTkFQSVNvdXJjZSByZXF1aXJlcyBPcmJpdC5mZXRjaCBiZSBkZWZpbmVkJywgT3JiaXQuZmV0Y2gpO1xyXG5cclxuICAgIHNldHRpbmdzLm5hbWUgPSBzZXR0aW5ncy5uYW1lIHx8ICdqc29uYXBpJztcclxuXHJcbiAgICBzdXBlcihzZXR0aW5ncyk7XHJcblxyXG4gICAgdGhpcy5uYW1lc3BhY2UgICAgICAgICAgID0gc2V0dGluZ3MubmFtZXNwYWNlO1xyXG4gICAgdGhpcy5ob3N0ICAgICAgICAgICAgICAgID0gc2V0dGluZ3MuaG9zdDtcclxuICAgIHRoaXMuZGVmYXVsdEZldGNoSGVhZGVycyA9IHNldHRpbmdzLmRlZmF1bHRGZXRjaEhlYWRlcnMgfHwgeyBBY2NlcHQ6ICdhcHBsaWNhdGlvbi92bmQuYXBpK2pzb24nIH07XHJcbiAgICB0aGlzLmRlZmF1bHRGZXRjaFRpbWVvdXQgPSBzZXR0aW5ncy5kZWZhdWx0RmV0Y2hUaW1lb3V0IHx8IDUwMDA7XHJcblxyXG4gICAgdGhpcy5tYXhSZXF1ZXN0c1BlclRyYW5zZm9ybSA9IHNldHRpbmdzLm1heFJlcXVlc3RzUGVyVHJhbnNmb3JtO1xyXG5cclxuICAgIGNvbnN0IFNlcmlhbGl6ZXJDbGFzcyA9IHNldHRpbmdzLlNlcmlhbGl6ZXJDbGFzcyB8fCBKU09OQVBJU2VyaWFsaXplcjtcclxuICAgIHRoaXMuc2VyaWFsaXplciAgICAgICA9IG5ldyBTZXJpYWxpemVyQ2xhc3MoeyBzY2hlbWE6IHNldHRpbmdzLnNjaGVtYSwga2V5TWFwOiBzZXR0aW5ncy5rZXlNYXAgfSk7XHJcbiAgfVxyXG5cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gIC8vIFB1c2hhYmxlIGludGVyZmFjZSBpbXBsZW1lbnRhdGlvblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIF9wdXNoKHRyYW5zZm9ybTogVHJhbnNmb3JtKTogUHJvbWlzZTxUcmFuc2Zvcm1bXT4ge1xyXG4gICAgY29uc3QgcmVxdWVzdHMgPSBnZXRUcmFuc2Zvcm1SZXF1ZXN0cyh0aGlzLCB0cmFuc2Zvcm0pO1xyXG5cclxuICAgIGlmICh0aGlzLm1heFJlcXVlc3RzUGVyVHJhbnNmb3JtICYmIHJlcXVlc3RzLmxlbmd0aCA+IHRoaXMubWF4UmVxdWVzdHNQZXJUcmFuc2Zvcm0pIHtcclxuICAgICAgcmV0dXJuIE9yYml0LlByb21pc2UucmVzb2x2ZSgpXHJcbiAgICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgdGhyb3cgbmV3IFRyYW5zZm9ybU5vdEFsbG93ZWQoXHJcbiAgICAgICAgICAgIGBUaGlzIHRyYW5zZm9ybSByZXF1aXJlcyAke3JlcXVlc3RzLmxlbmd0aH0gcmVxdWVzdHMsIHdoaWNoIGV4Y2VlZHMgdGhlIHNwZWNpZmllZCBsaW1pdCBvZiAke3RoaXMubWF4UmVxdWVzdHNQZXJUcmFuc2Zvcm19IHJlcXVlc3RzIHBlciB0cmFuc2Zvcm0uYCxcclxuICAgICAgICAgICAgdHJhbnNmb3JtKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5fcHJvY2Vzc1JlcXVlc3RzKHJlcXVlc3RzLCBUcmFuc2Zvcm1SZXF1ZXN0UHJvY2Vzc29ycylcclxuICAgICAgLnRoZW4odHJhbnNmb3JtcyA9PiB7XHJcbiAgICAgICAgdHJhbnNmb3Jtcy51bnNoaWZ0KHRyYW5zZm9ybSk7XHJcbiAgICAgICAgcmV0dXJuIHRyYW5zZm9ybXM7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAvLyBQdWxsYWJsZSBpbnRlcmZhY2UgaW1wbGVtZW50YXRpb25cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICBfcHVsbChxdWVyeTogUXVlcnkpOiBQcm9taXNlPFRyYW5zZm9ybVtdPiB7XHJcbiAgICBjb25zdCBvcGVyYXRvcjogUHVsbE9wZXJhdG9yID0gUHVsbE9wZXJhdG9yc1txdWVyeS5leHByZXNzaW9uLm9wXTtcclxuICAgIGlmICghb3BlcmF0b3IpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdKU09OQVBJU291cmNlIGRvZXMgbm90IHN1cHBvcnQgdGhlIGAke3F1ZXJ5LmV4cHJlc3Npb24ub3B9YCBvcGVyYXRvciBmb3IgcXVlcmllcy4nKTtcclxuICAgIH1cclxuICAgIHJldHVybiBvcGVyYXRvcih0aGlzLCBxdWVyeSk7XHJcbiAgfVxyXG5cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gIC8vIFB1YmxpY2x5IGFjY2Vzc2libGUgbWV0aG9kcyBwYXJ0aWN1bGFyIHRvIEpTT05BUElTb3VyY2VcclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICBmZXRjaCh1cmw6IHN0cmluZywgc2V0dGluZ3M6IEZldGNoU2V0dGluZ3MgPSB7fSk6IFByb21pc2U8YW55PiB7XHJcbiAgICBzZXR0aW5ncy5oZWFkZXJzID0gc2V0dGluZ3MuaGVhZGVycyB8fCB0aGlzLmRlZmF1bHRGZXRjaEhlYWRlcnM7XHJcblxyXG4gICAgbGV0IGhlYWRlcnMgPSBzZXR0aW5ncy5oZWFkZXJzO1xyXG4gICAgbGV0IG1ldGhvZCA9IHNldHRpbmdzLm1ldGhvZCB8fCAnR0VUJztcclxuXHJcbiAgICAvLyBjb25zb2xlLmxvZygnZmV0Y2gnLCB1cmwsIHNldHRpbmdzLCAncG9seWZpbGwnLCBmZXRjaC5wb2x5ZmlsbCk7XHJcblxyXG4gICAgbGV0IHRpbWVvdXQgPSBzZXR0aW5ncy50aW1lb3V0IHx8IHRoaXMuZGVmYXVsdEZldGNoVGltZW91dDtcclxuICAgIGlmIChzZXR0aW5ncy50aW1lb3V0KSB7XHJcbiAgICAgIGRlbGV0ZSBzZXR0aW5ncy50aW1lb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChzZXR0aW5ncy5qc29uKSB7XHJcbiAgICAgIGFzc2VydCgnYGpzb25gIGFuZCBgYm9keWAgY2FuXFwndCBib3RoIGJlIHNldCBmb3IgZmV0Y2ggcmVxdWVzdHMuJywgIXNldHRpbmdzLmJvZHkpO1xyXG4gICAgICBzZXR0aW5ncy5ib2R5ID0gSlNPTi5zdHJpbmdpZnkoc2V0dGluZ3MuanNvbik7XHJcbiAgICAgIGRlbGV0ZSBzZXR0aW5ncy5qc29uO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChzZXR0aW5ncy5ib2R5ICYmIG1ldGhvZCAhPT0gJ0dFVCcpIHtcclxuICAgICAgaGVhZGVyc1snQ29udGVudC1UeXBlJ10gPSBoZWFkZXJzWydDb250ZW50LVR5cGUnXSB8fCAnYXBwbGljYXRpb24vdm5kLmFwaStqc29uOyBjaGFyc2V0PXV0Zi04JztcclxuICAgIH1cclxuXHJcbiAgICBpZiAoc2V0dGluZ3MucGFyYW1zKSB7XHJcbiAgICAgIGlmICh1cmwuaW5kZXhPZignPycpID09PSAtMSkge1xyXG4gICAgICAgIHVybCArPSAnPyc7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdXJsICs9ICcmJztcclxuICAgICAgfVxyXG4gICAgICB1cmwgKz0gZW5jb2RlUXVlcnlQYXJhbXMoc2V0dGluZ3MucGFyYW1zKTtcclxuXHJcbiAgICAgIGRlbGV0ZSBzZXR0aW5ncy5wYXJhbXM7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRpbWVvdXQpIHtcclxuICAgICAgcmV0dXJuIG5ldyBPcmJpdC5Qcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICBsZXQgdGltZWRPdXQ7XHJcblxyXG4gICAgICAgIGxldCB0aW1lciA9IE9yYml0Lmdsb2JhbHMuc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICB0aW1lZE91dCA9IHRydWU7XHJcbiAgICAgICAgICByZWplY3QobmV3IE5ldHdvcmtFcnJvcihgTm8gZmV0Y2ggcmVzcG9uc2Ugd2l0aGluICR7dGltZW91dH1tcy5gKSk7XHJcbiAgICAgICAgfSwgdGltZW91dCk7XHJcblxyXG4gICAgICAgIE9yYml0LmZldGNoKHVybCwgc2V0dGluZ3MpXHJcbiAgICAgICAgICAuY2F0Y2goZSA9PiB7XHJcbiAgICAgICAgICAgIE9yYml0Lmdsb2JhbHMuY2xlYXJUaW1lb3V0KHRpbWVyKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghdGltZWRPdXQpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5oYW5kbGVGZXRjaEVycm9yKGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICBPcmJpdC5nbG9iYWxzLmNsZWFyVGltZW91dCh0aW1lcik7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRpbWVkT3V0KSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlRmV0Y2hSZXNwb25zZShyZXNwb25zZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAudGhlbihyZXNvbHZlLCByZWplY3QpO1xyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBPcmJpdC5mZXRjaCh1cmwsIHNldHRpbmdzKVxyXG4gICAgICAgIC5jYXRjaChlID0+IHRoaXMuaGFuZGxlRmV0Y2hFcnJvcihlKSlcclxuICAgICAgICAudGhlbihyZXNwb25zZSA9PiB0aGlzLmhhbmRsZUZldGNoUmVzcG9uc2UocmVzcG9uc2UpKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByb3RlY3RlZCBoYW5kbGVGZXRjaFJlc3BvbnNlKHJlc3BvbnNlOiBhbnkpOiBQcm9taXNlPGFueT4ge1xyXG4gICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAxKSB7XHJcbiAgICAgIGlmICh0aGlzLnJlc3BvbnNlSGFzQ29udGVudChyZXNwb25zZSkpIHtcclxuICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRocm93IG5ldyBJbnZhbGlkU2VydmVyUmVzcG9uc2UoYFNlcnZlciByZXNwb25zZXMgd2l0aCBhICR7cmVzcG9uc2Uuc3RhdHVzfSBzdGF0dXMgc2hvdWxkIHJldHVybiBjb250ZW50IHdpdGggYSBDb250ZW50LVR5cGUgdGhhdCBpbmNsdWRlcyAnYXBwbGljYXRpb24vdm5kLmFwaStqc29uJy5gKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChyZXNwb25zZS5zdGF0dXMgPj0gMjAwICYmIHJlc3BvbnNlLnN0YXR1cyA8IDMwMCkge1xyXG4gICAgICBpZiAodGhpcy5yZXNwb25zZUhhc0NvbnRlbnQocmVzcG9uc2UpKSB7XHJcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKHRoaXMucmVzcG9uc2VIYXNDb250ZW50KHJlc3BvbnNlKSkge1xyXG4gICAgICAgIHJldHVybiByZXNwb25zZS5qc29uKClcclxuICAgICAgICAgIC50aGVuKGRhdGEgPT4gdGhpcy5oYW5kbGVGZXRjaFJlc3BvbnNlRXJyb3IocmVzcG9uc2UsIGRhdGEpKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5oYW5kbGVGZXRjaFJlc3BvbnNlRXJyb3IocmVzcG9uc2UpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgfVxyXG5cclxuICBwcm90ZWN0ZWQgaGFuZGxlRmV0Y2hSZXNwb25zZUVycm9yKHJlc3BvbnNlOiBhbnksIGRhdGE/OiBhbnkpOiBQcm9taXNlPGFueT4ge1xyXG4gICAgbGV0IGVycm9yO1xyXG4gICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA+PSA0MDAgJiYgcmVzcG9uc2Uuc3RhdHVzIDwgNTAwKSB7XHJcbiAgICAgIGVycm9yID0gbmV3IENsaWVudEVycm9yKHJlc3BvbnNlLnN0YXR1c1RleHQpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZXJyb3IgPSBuZXcgU2VydmVyRXJyb3IocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XHJcbiAgICB9XHJcbiAgICBlcnJvci5yZXNwb25zZSA9IHJlc3BvbnNlO1xyXG4gICAgZXJyb3IuZGF0YSA9IGRhdGE7XHJcbiAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZWplY3QoZXJyb3IpO1xyXG4gIH1cclxuXHJcbiAgcHJvdGVjdGVkIGhhbmRsZUZldGNoRXJyb3IoZTogYW55KTogUHJvbWlzZTxhbnk+IHtcclxuICAgIGxldCBlcnJvciA9IG5ldyBOZXR3b3JrRXJyb3IoZSk7XHJcbiAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZWplY3QoZXJyb3IpO1xyXG4gIH1cclxuXHJcbiAgcmVzcG9uc2VIYXNDb250ZW50KHJlc3BvbnNlOiBhbnkpOiBib29sZWFuIHtcclxuICAgIGxldCBjb250ZW50VHlwZSA9IHJlc3BvbnNlLmhlYWRlcnMuZ2V0KCdDb250ZW50LVR5cGUnKTtcclxuICAgIHJldHVybiBjb250ZW50VHlwZSAmJiBjb250ZW50VHlwZS5pbmRleE9mKCdhcHBsaWNhdGlvbi92bmQuYXBpK2pzb24nKSA+IC0xO1xyXG4gIH1cclxuXHJcbiAgcmVzb3VyY2VOYW1lc3BhY2UodHlwZT86IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5uYW1lc3BhY2U7XHJcbiAgfVxyXG5cclxuICByZXNvdXJjZUhvc3QodHlwZT86IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5ob3N0O1xyXG4gIH1cclxuXHJcbiAgcmVzb3VyY2VQYXRoKHR5cGU6IHN0cmluZywgaWQ/OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgbGV0IHBhdGggPSBbdGhpcy5zZXJpYWxpemVyLnJlc291cmNlVHlwZSh0eXBlKV07XHJcbiAgICBpZiAoaWQpIHtcclxuICAgICAgbGV0IHJlc291cmNlSWQgPSB0aGlzLnNlcmlhbGl6ZXIucmVzb3VyY2VJZCh0eXBlLCBpZCk7XHJcbiAgICAgIGlmIChyZXNvdXJjZUlkKSB7XHJcbiAgICAgICAgcGF0aC5wdXNoKHJlc291cmNlSWQpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcGF0aC5qb2luKCcvJyk7XHJcbiAgfVxyXG5cclxuICByZXNvdXJjZVVSTCh0eXBlOiBzdHJpbmcsIGlkPzogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIGxldCBob3N0ID0gdGhpcy5yZXNvdXJjZUhvc3QodHlwZSk7XHJcbiAgICBsZXQgbmFtZXNwYWNlID0gdGhpcy5yZXNvdXJjZU5hbWVzcGFjZSh0eXBlKTtcclxuICAgIGxldCB1cmw6IHN0cmluZ1tdID0gW107XHJcblxyXG4gICAgaWYgKGhvc3QpIHsgdXJsLnB1c2goaG9zdCk7IH1cclxuICAgIGlmIChuYW1lc3BhY2UpIHsgdXJsLnB1c2gobmFtZXNwYWNlKTsgfVxyXG4gICAgdXJsLnB1c2godGhpcy5yZXNvdXJjZVBhdGgodHlwZSwgaWQpKTtcclxuXHJcbiAgICBpZiAoIWhvc3QpIHsgdXJsLnVuc2hpZnQoJycpOyB9XHJcblxyXG4gICAgcmV0dXJuIHVybC5qb2luKCcvJyk7XHJcbiAgfVxyXG5cclxuICByZXNvdXJjZVJlbGF0aW9uc2hpcFVSTCh0eXBlOiBzdHJpbmcsIGlkOiBzdHJpbmcsIHJlbGF0aW9uc2hpcDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLnJlc291cmNlVVJMKHR5cGUsIGlkKSArXHJcbiAgICAgICAgICAgJy9yZWxhdGlvbnNoaXBzLycgKyB0aGlzLnNlcmlhbGl6ZXIucmVzb3VyY2VSZWxhdGlvbnNoaXAodHlwZSwgcmVsYXRpb25zaGlwKTtcclxuICB9XHJcblxyXG4gIHJlbGF0ZWRSZXNvdXJjZVVSTCh0eXBlOiBzdHJpbmcsIGlkOiBzdHJpbmcsIHJlbGF0aW9uc2hpcDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLnJlc291cmNlVVJMKHR5cGUsIGlkKSArXHJcbiAgICAgICAgICAgJy8nICsgdGhpcy5zZXJpYWxpemVyLnJlc291cmNlUmVsYXRpb25zaGlwKHR5cGUsIHJlbGF0aW9uc2hpcCk7XHJcbiAgfVxyXG5cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gIC8vIFByaXZhdGUgbWV0aG9kc1xyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIHByb3RlY3RlZCBfcHJvY2Vzc1JlcXVlc3RzKHJlcXVlc3RzLCBwcm9jZXNzb3JzKTogUHJvbWlzZTxUcmFuc2Zvcm1bXT4ge1xyXG4gICAgbGV0IHRyYW5zZm9ybXM6IFRyYW5zZm9ybVtdID0gW107XHJcbiAgICBsZXQgcmVzdWx0OiBQcm9taXNlPHZvaWQ+ID0gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCk7XHJcblxyXG4gICAgcmVxdWVzdHMuZm9yRWFjaChyZXF1ZXN0ID0+IHtcclxuICAgICAgbGV0IHByb2Nlc3NvciA9IHByb2Nlc3NvcnNbcmVxdWVzdC5vcF07XHJcblxyXG4gICAgICByZXN1bHQgPSByZXN1bHQudGhlbigoKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHByb2Nlc3Nvcih0aGlzLCByZXF1ZXN0KVxyXG4gICAgICAgICAgLnRoZW4oYWRkaXRpb25hbFRyYW5zZm9ybXMgPT4ge1xyXG4gICAgICAgICAgICBpZiAoYWRkaXRpb25hbFRyYW5zZm9ybXMpIHtcclxuICAgICAgICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseSh0cmFuc2Zvcm1zLCBhZGRpdGlvbmFsVHJhbnNmb3Jtcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiByZXN1bHQudGhlbigoKSA9PiB0cmFuc2Zvcm1zKTtcclxuICB9XHJcbn1cclxuIl19