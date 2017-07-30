"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

var __extends = this && this.__extends || function () {
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
var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
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
                        return _this.handleFetchError(e).then(function (response) {
                            return resolve(response);
                        }).catch(function (e) {
                            return reject(e);
                        });
                    }
                }).then(function (response) {
                    data_1.default.globals.clearTimeout(timer);
                    if (!timedOut) {
                        return _this.handleFetchResponse(response).then(function (response) {
                            return resolve(response);
                        }).catch(function (e) {
                            return reject(e);
                        });
                    }
                });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbmFwaS1zb3VyY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzcmMvanNvbmFwaS1zb3VyY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLEFBQWdDO0FBQ2hDLHFCQWVxQjtBQUVyQixzQkFBc0M7QUFDdEMsbUNBQW9GO0FBQ3BGLDZCQUF1RDtBQUN2RCwrQkFBbUU7QUFDbkUsbUNBQTRGO0FBQzVGLDJCQUF5RDtBQUV6RCxBQUFFLEFBQUMsSUFBQyxPQUFPLE9BQUssUUFBQyxBQUFPLFFBQUMsQUFBSyxVQUFLLEFBQVcsZUFBSSxPQUFLLFFBQUMsQUFBSyxVQUFLLEFBQVMsQUFBQyxXQUFDLEFBQUM7QUFDNUUsV0FBSyxRQUFDLEFBQUssUUFBRyxPQUFLLFFBQUMsQUFBTyxRQUFDLEFBQUssQUFBQyxBQUNwQztBQUFDO0FBb0JELEFBYUc7Ozs7Ozs7Ozs7Ozs7O0FBR0g7QUFBMkMsNkJBQU07QUFjL0MsMkJBQVksQUFBb0M7QUFBcEMsaUNBQUE7QUFBQSx1QkFBb0M7O0FBQWhELG9CQWtCQztBQWpCQyxnQkFBTSxPQUFDLEFBQXVGLHlGQUFFLENBQUMsQ0FBQyxBQUFRLFNBQUMsQUFBTSxBQUFDLEFBQUM7QUFDbkgsZ0JBQU0sT0FBQyxBQUFpRCxtREFBRSxPQUFLLFFBQUMsQUFBTyxBQUFDLEFBQUM7QUFDekUsZ0JBQU0sT0FBQyxBQUErQyxpREFBRSxPQUFLLFFBQUMsQUFBSyxBQUFDLEFBQUM7QUFFckUsQUFBUSxpQkFBQyxBQUFJLE9BQUcsQUFBUSxTQUFDLEFBQUksUUFBSSxBQUFTLEFBQUM7QUFFM0MsZ0JBQUEsa0JBQU0sQUFBUSxBQUFDLGFBQUM7QUFFaEIsQUFBSSxjQUFDLEFBQVMsWUFBYSxBQUFRLFNBQUMsQUFBUyxBQUFDO0FBQzlDLEFBQUksY0FBQyxBQUFJLE9BQWtCLEFBQVEsU0FBQyxBQUFJLEFBQUM7QUFDekMsQUFBSSxjQUFDLEFBQW1CLHNCQUFH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LGlCQUFDLEFBQU8sUUFBQyxVQUFBLEFBQU87QUFDdEIsZ0JBQUksQUFBUyxZQUFHLEFBQVUsV0FBQyxBQUFPLFFBQUMsQUFBRSxBQUFDLEFBQUM7QUFFdkMsQUFBTSw0QkFBVSxBQUFJLEtBQUM7QUFDbkIsQUFBTSxpQ0FBVyxBQUFJLE9BQUUsQUFBTyxBQUFDLFNBQzVCLEFBQUksS0FBQyxVQUFBLEFBQW9CO0FBQ3hCLEFBQUUsQUFBQyx3QkFBQyxBQUFvQixBQUFDLHNCQUFDLEFBQUM7QUFDekIsQUFBSyw4QkFBQyxBQUFTLFVBQUMsQUFBSSxLQUFDLEFBQUssTUFBQyxBQUFVLFlBQUUsQUFBb0IsQUFBQyxBQUFDLEFBQy9EO0FBQUMsQUFDSDtBQUFDLEFBQUMsQUFBQyxBQUNQLGlCQU5TLEFBQVM7QUFNakIsQUFBQyxBQUFDLEFBQ0wsYUFSVyxBQUFNO0FBUWhCLEFBQUMsQUFBQztBQUVILEFBQU0sc0JBQVEsQUFBSSxLQUFDO0FBQU0sbUJBQUEsQUFBVTtBQUFBLEFBQUMsQUFBQyxBQUN2QyxTQURTLEFBQU07QUFDZDtBQTVQa0IsQUFBYSxnQ0FGakMsT0FBUSxVQUNSLE9BQVEsV0FDWSxBQUFhLEFBNlBqQztBQUFELFdBQUM7QUE3UEQsQUE2UEMsRUE3UDBDLE9BQU0sQUE2UGhEO2tCQTdQb0IsQUFBYSIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIHZhbGlkLWpzZG9jICovXHJcbmltcG9ydCBPcmJpdCwge1xyXG4gIEtleU1hcCxcclxuICBSZWNvcmRPcGVyYXRpb24sXHJcbiAgU2NoZW1hLFxyXG4gIFNvdXJjZSwgU291cmNlU2V0dGluZ3MsXHJcbiAgUXVlcnksIFF1ZXJ5T3JFeHByZXNzaW9uLFxyXG4gIFB1bGxhYmxlLCBwdWxsYWJsZSxcclxuICBQdXNoYWJsZSwgcHVzaGFibGUsXHJcbiAgVHJhbnNmb3JtLFxyXG4gIFRyYW5zZm9ybU9yT3BlcmF0aW9ucyxcclxuICBjb2FsZXNjZVJlY29yZE9wZXJhdGlvbnMsXHJcbiAgUXVlcnlOb3RBbGxvd2VkLCBUcmFuc2Zvcm1Ob3RBbGxvd2VkLFxyXG4gIENsaWVudEVycm9yLFxyXG4gIFNlcnZlckVycm9yLFxyXG4gIE5ldHdvcmtFcnJvclxyXG59IGZyb20gJ0BvcmJpdC9kYXRhJztcclxuaW1wb3J0IHsgTG9nIH0gZnJvbSAnQG9yYml0L2NvcmUnO1xyXG5pbXBvcnQgeyBhc3NlcnQgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xyXG5pbXBvcnQgSlNPTkFQSVNlcmlhbGl6ZXIsIHsgSlNPTkFQSVNlcmlhbGl6ZXJTZXR0aW5ncyB9IGZyb20gJy4vanNvbmFwaS1zZXJpYWxpemVyJztcclxuaW1wb3J0IHsgZW5jb2RlUXVlcnlQYXJhbXMgfSBmcm9tICcuL2xpYi9xdWVyeS1wYXJhbXMnO1xyXG5pbXBvcnQgeyBQdWxsT3BlcmF0b3IsIFB1bGxPcGVyYXRvcnMgfSBmcm9tICcuL2xpYi9wdWxsLW9wZXJhdG9ycyc7XHJcbmltcG9ydCB7IGdldFRyYW5zZm9ybVJlcXVlc3RzLCBUcmFuc2Zvcm1SZXF1ZXN0UHJvY2Vzc29ycyB9IGZyb20gJy4vbGliL3RyYW5zZm9ybS1yZXF1ZXN0cyc7XHJcbmltcG9ydCB7IEludmFsaWRTZXJ2ZXJSZXNwb25zZSB9IGZyb20gJy4vbGliL2V4Y2VwdGlvbnMnO1xyXG5cclxuaWYgKHR5cGVvZiBPcmJpdC5nbG9iYWxzLmZldGNoICE9PSAndW5kZWZpbmVkJyAmJiBPcmJpdC5mZXRjaCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgT3JiaXQuZmV0Y2ggPSBPcmJpdC5nbG9iYWxzLmZldGNoO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEZldGNoU2V0dGluZ3Mge1xyXG4gIGhlYWRlcnM/OiBvYmplY3Q7XHJcbiAgbWV0aG9kPzogc3RyaW5nO1xyXG4gIGpzb24/OiBvYmplY3Q7XHJcbiAgYm9keT86IHN0cmluZztcclxuICBwYXJhbXM/OiBhbnk7XHJcbiAgdGltZW91dD86IG51bWJlcjtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBKU09OQVBJU291cmNlU2V0dGluZ3MgZXh0ZW5kcyBTb3VyY2VTZXR0aW5ncyB7XHJcbiAgbWF4UmVxdWVzdHNQZXJUcmFuc2Zvcm0/OiBudW1iZXI7XHJcbiAgbmFtZXNwYWNlPzogc3RyaW5nO1xyXG4gIGhvc3Q/OiBzdHJpbmc7XHJcbiAgZGVmYXVsdEZldGNoSGVhZGVycz86IG9iamVjdDtcclxuICBkZWZhdWx0RmV0Y2hUaW1lb3V0PzogbnVtYmVyO1xyXG4gIFNlcmlhbGl6ZXJDbGFzcz86IChuZXcgKHNldHRpbmdzOiBKU09OQVBJU2VyaWFsaXplclNldHRpbmdzKSA9PiBKU09OQVBJU2VyaWFsaXplcik7XHJcbn1cclxuXHJcbi8qKlxyXG4gU291cmNlIGZvciBhY2Nlc3NpbmcgYSBKU09OIEFQSSBjb21wbGlhbnQgUkVTVGZ1bCBBUEkgd2l0aCBhIG5ldHdvcmsgZmV0Y2hcclxuIHJlcXVlc3QuXHJcblxyXG4gSWYgYSBzaW5nbGUgdHJhbnNmb3JtIG9yIHF1ZXJ5IHJlcXVpcmVzIG1vcmUgdGhhbiBvbmUgZmV0Y2ggcmVxdWVzdCxcclxuIHJlcXVlc3RzIHdpbGwgYmUgcGVyZm9ybWVkIHNlcXVlbnRpYWxseSBhbmQgcmVzb2x2ZWQgdG9nZXRoZXIuIEZyb20gdGhlXHJcbiBwZXJzcGVjdGl2ZSBvZiBPcmJpdCwgdGhlc2Ugb3BlcmF0aW9ucyB3aWxsIGFsbCBzdWNjZWVkIG9yIGZhaWwgdG9nZXRoZXIuIFRoZVxyXG4gYG1heFJlcXVlc3RzUGVyVHJhbnNmb3JtYCBhbmQgYG1heFJlcXVlc3RzUGVyUXVlcnlgIHNldHRpbmdzIGFsbG93IGxpbWl0cyB0byBiZVxyXG4gc2V0IG9uIHRoaXMgYmVoYXZpb3IuIFRoZXNlIHNldHRpbmdzIHNob3VsZCBiZSBzZXQgdG8gYDFgIGlmIHlvdXIgY2xpZW50L3NlcnZlclxyXG4gY29uZmlndXJhdGlvbiBpcyB1bmFibGUgdG8gcmVzb2x2ZSBwYXJ0aWFsbHkgc3VjY2Vzc2Z1bCB0cmFuc2Zvcm1zIC8gcXVlcmllcy5cclxuXHJcbiBAY2xhc3MgSlNPTkFQSVNvdXJjZVxyXG4gQGV4dGVuZHMgU291cmNlXHJcbiAqL1xyXG5AcHVsbGFibGVcclxuQHB1c2hhYmxlXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEpTT05BUElTb3VyY2UgZXh0ZW5kcyBTb3VyY2UgaW1wbGVtZW50cyBQdWxsYWJsZSwgUHVzaGFibGUge1xyXG4gIG1heFJlcXVlc3RzUGVyVHJhbnNmb3JtOiBudW1iZXI7XHJcbiAgbmFtZXNwYWNlOiBzdHJpbmc7XHJcbiAgaG9zdDogc3RyaW5nO1xyXG4gIGRlZmF1bHRGZXRjaEhlYWRlcnM6IG9iamVjdDtcclxuICBkZWZhdWx0RmV0Y2hUaW1lb3V0OiBudW1iZXI7XHJcbiAgc2VyaWFsaXplcjogSlNPTkFQSVNlcmlhbGl6ZXI7XHJcblxyXG4gIC8vIFB1bGxhYmxlIGludGVyZmFjZSBzdHVic1xyXG4gIHB1bGw6IChxdWVyeU9yRXhwcmVzc2lvbjogUXVlcnlPckV4cHJlc3Npb24sIG9wdGlvbnM/OiBvYmplY3QsIGlkPzogc3RyaW5nKSA9PiBQcm9taXNlPFRyYW5zZm9ybVtdPjtcclxuXHJcbiAgLy8gUHVzaGFibGUgaW50ZXJmYWNlIHN0dWJzXHJcbiAgcHVzaDogKHRyYW5zZm9ybU9yT3BlcmF0aW9uczogVHJhbnNmb3JtT3JPcGVyYXRpb25zLCBvcHRpb25zPzogb2JqZWN0LCBpZD86IHN0cmluZykgPT4gUHJvbWlzZTxUcmFuc2Zvcm1bXT47XHJcblxyXG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzOiBKU09OQVBJU291cmNlU2V0dGluZ3MgPSB7fSkge1xyXG4gICAgYXNzZXJ0KCdKU09OQVBJU291cmNlXFwncyBgc2NoZW1hYCBtdXN0IGJlIHNwZWNpZmllZCBpbiBgc2V0dGluZ3Muc2NoZW1hYCBjb25zdHJ1Y3RvciBhcmd1bWVudCcsICEhc2V0dGluZ3Muc2NoZW1hKTtcclxuICAgIGFzc2VydCgnSlNPTkFQSVNvdXJjZSByZXF1aXJlcyBPcmJpdC5Qcm9taXNlIGJlIGRlZmluZWQnLCBPcmJpdC5Qcm9taXNlKTtcclxuICAgIGFzc2VydCgnSlNPTkFQSVNvdXJjZSByZXF1aXJlcyBPcmJpdC5mZXRjaCBiZSBkZWZpbmVkJywgT3JiaXQuZmV0Y2gpO1xyXG5cclxuICAgIHNldHRpbmdzLm5hbWUgPSBzZXR0aW5ncy5uYW1lIHx8ICdqc29uYXBpJztcclxuXHJcbiAgICBzdXBlcihzZXR0aW5ncyk7XHJcblxyXG4gICAgdGhpcy5uYW1lc3BhY2UgICAgICAgICAgID0gc2V0dGluZ3MubmFtZXNwYWNlO1xyXG4gICAgdGhpcy5ob3N0ICAgICAgICAgICAgICAgID0gc2V0dGluZ3MuaG9zdDtcclxuICAgIHRoaXMuZGVmYXVsdEZldGNoSGVhZGVycyA9IHNldHRpbmdzLmRlZmF1bHRGZXRjaEhlYWRlcnMgfHwgeyBBY2NlcHQ6ICdhcHBsaWNhdGlvbi92bmQuYXBpK2pzb24nIH07XHJcbiAgICB0aGlzLmRlZmF1bHRGZXRjaFRpbWVvdXQgPSBzZXR0aW5ncy5kZWZhdWx0RmV0Y2hUaW1lb3V0IHx8IDUwMDA7XHJcblxyXG4gICAgdGhpcy5tYXhSZXF1ZXN0c1BlclRyYW5zZm9ybSA9IHNldHRpbmdzLm1heFJlcXVlc3RzUGVyVHJhbnNmb3JtO1xyXG5cclxuICAgIGNvbnN0IFNlcmlhbGl6ZXJDbGFzcyA9IHNldHRpbmdzLlNlcmlhbGl6ZXJDbGFzcyB8fCBKU09OQVBJU2VyaWFsaXplcjtcclxuICAgIHRoaXMuc2VyaWFsaXplciAgICAgICA9IG5ldyBTZXJpYWxpemVyQ2xhc3MoeyBzY2hlbWE6IHNldHRpbmdzLnNjaGVtYSwga2V5TWFwOiBzZXR0aW5ncy5rZXlNYXAgfSk7XHJcbiAgfVxyXG5cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gIC8vIFB1c2hhYmxlIGludGVyZmFjZSBpbXBsZW1lbnRhdGlvblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIF9wdXNoKHRyYW5zZm9ybTogVHJhbnNmb3JtKTogUHJvbWlzZTxUcmFuc2Zvcm1bXT4ge1xyXG4gICAgY29uc3QgcmVxdWVzdHMgPSBnZXRUcmFuc2Zvcm1SZXF1ZXN0cyh0aGlzLCB0cmFuc2Zvcm0pO1xyXG5cclxuICAgIGlmICh0aGlzLm1heFJlcXVlc3RzUGVyVHJhbnNmb3JtICYmIHJlcXVlc3RzLmxlbmd0aCA+IHRoaXMubWF4UmVxdWVzdHNQZXJUcmFuc2Zvcm0pIHtcclxuICAgICAgcmV0dXJuIE9yYml0LlByb21pc2UucmVzb2x2ZSgpXHJcbiAgICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgdGhyb3cgbmV3IFRyYW5zZm9ybU5vdEFsbG93ZWQoXHJcbiAgICAgICAgICAgIGBUaGlzIHRyYW5zZm9ybSByZXF1aXJlcyAke3JlcXVlc3RzLmxlbmd0aH0gcmVxdWVzdHMsIHdoaWNoIGV4Y2VlZHMgdGhlIHNwZWNpZmllZCBsaW1pdCBvZiAke3RoaXMubWF4UmVxdWVzdHNQZXJUcmFuc2Zvcm19IHJlcXVlc3RzIHBlciB0cmFuc2Zvcm0uYCxcclxuICAgICAgICAgICAgdHJhbnNmb3JtKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5fcHJvY2Vzc1JlcXVlc3RzKHJlcXVlc3RzLCBUcmFuc2Zvcm1SZXF1ZXN0UHJvY2Vzc29ycylcclxuICAgICAgLnRoZW4odHJhbnNmb3JtcyA9PiB7XHJcbiAgICAgICAgdHJhbnNmb3Jtcy51bnNoaWZ0KHRyYW5zZm9ybSk7XHJcbiAgICAgICAgcmV0dXJuIHRyYW5zZm9ybXM7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAvLyBQdWxsYWJsZSBpbnRlcmZhY2UgaW1wbGVtZW50YXRpb25cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICBfcHVsbChxdWVyeTogUXVlcnkpOiBQcm9taXNlPFRyYW5zZm9ybVtdPiB7XHJcbiAgICBjb25zdCBvcGVyYXRvcjogUHVsbE9wZXJhdG9yID0gUHVsbE9wZXJhdG9yc1txdWVyeS5leHByZXNzaW9uLm9wXTtcclxuICAgIGlmICghb3BlcmF0b3IpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdKU09OQVBJU291cmNlIGRvZXMgbm90IHN1cHBvcnQgdGhlIGAke3F1ZXJ5LmV4cHJlc3Npb24ub3B9YCBvcGVyYXRvciBmb3IgcXVlcmllcy4nKTtcclxuICAgIH1cclxuICAgIHJldHVybiBvcGVyYXRvcih0aGlzLCBxdWVyeSk7XHJcbiAgfVxyXG5cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gIC8vIFB1YmxpY2x5IGFjY2Vzc2libGUgbWV0aG9kcyBwYXJ0aWN1bGFyIHRvIEpTT05BUElTb3VyY2VcclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICBmZXRjaCh1cmw6IHN0cmluZywgc2V0dGluZ3M6IEZldGNoU2V0dGluZ3MgPSB7fSk6IFByb21pc2U8YW55PiB7XHJcbiAgICBzZXR0aW5ncy5oZWFkZXJzID0gc2V0dGluZ3MuaGVhZGVycyB8fCB0aGlzLmRlZmF1bHRGZXRjaEhlYWRlcnM7XHJcblxyXG4gICAgbGV0IGhlYWRlcnMgPSBzZXR0aW5ncy5oZWFkZXJzO1xyXG4gICAgbGV0IG1ldGhvZCA9IHNldHRpbmdzLm1ldGhvZCB8fCAnR0VUJztcclxuXHJcbiAgICAvLyBjb25zb2xlLmxvZygnZmV0Y2gnLCB1cmwsIHNldHRpbmdzLCAncG9seWZpbGwnLCBmZXRjaC5wb2x5ZmlsbCk7XHJcblxyXG4gICAgbGV0IHRpbWVvdXQgPSBzZXR0aW5ncy50aW1lb3V0IHx8IHRoaXMuZGVmYXVsdEZldGNoVGltZW91dDtcclxuICAgIGlmIChzZXR0aW5ncy50aW1lb3V0KSB7XHJcbiAgICAgIGRlbGV0ZSBzZXR0aW5ncy50aW1lb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChzZXR0aW5ncy5qc29uKSB7XHJcbiAgICAgIGFzc2VydCgnYGpzb25gIGFuZCBgYm9keWAgY2FuXFwndCBib3RoIGJlIHNldCBmb3IgZmV0Y2ggcmVxdWVzdHMuJywgIXNldHRpbmdzLmJvZHkpO1xyXG4gICAgICBzZXR0aW5ncy5ib2R5ID0gSlNPTi5zdHJpbmdpZnkoc2V0dGluZ3MuanNvbik7XHJcbiAgICAgIGRlbGV0ZSBzZXR0aW5ncy5qc29uO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChzZXR0aW5ncy5ib2R5ICYmIG1ldGhvZCAhPT0gJ0dFVCcpIHtcclxuICAgICAgaGVhZGVyc1snQ29udGVudC1UeXBlJ10gPSBoZWFkZXJzWydDb250ZW50LVR5cGUnXSB8fCAnYXBwbGljYXRpb24vdm5kLmFwaStqc29uOyBjaGFyc2V0PXV0Zi04JztcclxuICAgIH1cclxuXHJcbiAgICBpZiAoc2V0dGluZ3MucGFyYW1zKSB7XHJcbiAgICAgIGlmICh1cmwuaW5kZXhPZignPycpID09PSAtMSkge1xyXG4gICAgICAgIHVybCArPSAnPyc7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdXJsICs9ICcmJztcclxuICAgICAgfVxyXG4gICAgICB1cmwgKz0gZW5jb2RlUXVlcnlQYXJhbXMoc2V0dGluZ3MucGFyYW1zKTtcclxuXHJcbiAgICAgIGRlbGV0ZSBzZXR0aW5ncy5wYXJhbXM7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRpbWVvdXQpIHtcclxuICAgICAgcmV0dXJuIG5ldyBPcmJpdC5Qcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICBsZXQgdGltZWRPdXQ7XHJcblxyXG4gICAgICAgIGxldCB0aW1lciA9IE9yYml0Lmdsb2JhbHMuc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICB0aW1lZE91dCA9IHRydWU7XHJcbiAgICAgICAgICByZWplY3QobmV3IE5ldHdvcmtFcnJvcihgTm8gZmV0Y2ggcmVzcG9uc2Ugd2l0aGluICR7dGltZW91dH1tcy5gKSk7XHJcbiAgICAgICAgfSwgdGltZW91dCk7XHJcblxyXG4gICAgICAgIE9yYml0LmZldGNoKHVybCwgc2V0dGluZ3MpXHJcbiAgICAgICAgICAuY2F0Y2goZSA9PiB7XHJcbiAgICAgICAgICAgIE9yYml0Lmdsb2JhbHMuY2xlYXJUaW1lb3V0KHRpbWVyKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghdGltZWRPdXQpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5oYW5kbGVGZXRjaEVycm9yKGUpXHJcbiAgICAgICAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiByZXNvbHZlKHJlc3BvbnNlKSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaChlID0+IHJlamVjdChlKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIE9yYml0Lmdsb2JhbHMuY2xlYXJUaW1lb3V0KHRpbWVyKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghdGltZWRPdXQpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5oYW5kbGVGZXRjaFJlc3BvbnNlKHJlc3BvbnNlKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gcmVzb2x2ZShyZXNwb25zZSkpXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goZSA9PiByZWplY3QoZSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gT3JiaXQuZmV0Y2godXJsLCBzZXR0aW5ncylcclxuICAgICAgICAuY2F0Y2goZSA9PiB0aGlzLmhhbmRsZUZldGNoRXJyb3IoZSkpXHJcbiAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gdGhpcy5oYW5kbGVGZXRjaFJlc3BvbnNlKHJlc3BvbnNlKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcm90ZWN0ZWQgaGFuZGxlRmV0Y2hSZXNwb25zZShyZXNwb25zZTogYW55KTogUHJvbWlzZTxhbnk+IHtcclxuICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDIwMSkge1xyXG4gICAgICBpZiAodGhpcy5yZXNwb25zZUhhc0NvbnRlbnQocmVzcG9uc2UpKSB7XHJcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aHJvdyBuZXcgSW52YWxpZFNlcnZlclJlc3BvbnNlKGBTZXJ2ZXIgcmVzcG9uc2VzIHdpdGggYSAke3Jlc3BvbnNlLnN0YXR1c30gc3RhdHVzIHNob3VsZCByZXR1cm4gY29udGVudCB3aXRoIGEgQ29udGVudC1UeXBlIHRoYXQgaW5jbHVkZXMgJ2FwcGxpY2F0aW9uL3ZuZC5hcGkranNvbicuYCk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAocmVzcG9uc2Uuc3RhdHVzID49IDIwMCAmJiByZXNwb25zZS5zdGF0dXMgPCAzMDApIHtcclxuICAgICAgaWYgKHRoaXMucmVzcG9uc2VIYXNDb250ZW50KHJlc3BvbnNlKSkge1xyXG4gICAgICAgIHJldHVybiByZXNwb25zZS5qc29uKCk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmICh0aGlzLnJlc3BvbnNlSGFzQ29udGVudChyZXNwb25zZSkpIHtcclxuICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpXHJcbiAgICAgICAgICAudGhlbihkYXRhID0+IHRoaXMuaGFuZGxlRmV0Y2hSZXNwb25zZUVycm9yKHJlc3BvbnNlLCBkYXRhKSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlRmV0Y2hSZXNwb25zZUVycm9yKHJlc3BvbnNlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIE9yYml0LlByb21pc2UucmVzb2x2ZSgpO1xyXG4gIH1cclxuXHJcbiAgcHJvdGVjdGVkIGhhbmRsZUZldGNoUmVzcG9uc2VFcnJvcihyZXNwb25zZTogYW55LCBkYXRhPzogYW55KTogUHJvbWlzZTxhbnk+IHtcclxuICAgIGxldCBlcnJvcjtcclxuICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPj0gNDAwICYmIHJlc3BvbnNlLnN0YXR1cyA8IDUwMCkge1xyXG4gICAgICBlcnJvciA9IG5ldyBDbGllbnRFcnJvcihyZXNwb25zZS5zdGF0dXNUZXh0KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGVycm9yID0gbmV3IFNlcnZlckVycm9yKHJlc3BvbnNlLnN0YXR1c1RleHQpO1xyXG4gICAgfVxyXG4gICAgZXJyb3IucmVzcG9uc2UgPSByZXNwb25zZTtcclxuICAgIGVycm9yLmRhdGEgPSBkYXRhO1xyXG4gICAgcmV0dXJuIE9yYml0LlByb21pc2UucmVqZWN0KGVycm9yKTtcclxuICB9XHJcblxyXG4gIHByb3RlY3RlZCBoYW5kbGVGZXRjaEVycm9yKGU6IGFueSk6IFByb21pc2U8YW55PiB7XHJcbiAgICBsZXQgZXJyb3IgPSBuZXcgTmV0d29ya0Vycm9yKGUpO1xyXG4gICAgcmV0dXJuIE9yYml0LlByb21pc2UucmVqZWN0KGVycm9yKTtcclxuICB9XHJcblxyXG4gIHJlc3BvbnNlSGFzQ29udGVudChyZXNwb25zZTogYW55KTogYm9vbGVhbiB7XHJcbiAgICBsZXQgY29udGVudFR5cGUgPSByZXNwb25zZS5oZWFkZXJzLmdldCgnQ29udGVudC1UeXBlJyk7XHJcbiAgICByZXR1cm4gY29udGVudFR5cGUgJiYgY29udGVudFR5cGUuaW5kZXhPZignYXBwbGljYXRpb24vdm5kLmFwaStqc29uJykgPiAtMTtcclxuICB9XHJcblxyXG4gIHJlc291cmNlTmFtZXNwYWNlKHR5cGU/OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMubmFtZXNwYWNlO1xyXG4gIH1cclxuXHJcbiAgcmVzb3VyY2VIb3N0KHR5cGU/OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMuaG9zdDtcclxuICB9XHJcblxyXG4gIHJlc291cmNlUGF0aCh0eXBlOiBzdHJpbmcsIGlkPzogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIGxldCBwYXRoID0gW3RoaXMuc2VyaWFsaXplci5yZXNvdXJjZVR5cGUodHlwZSldO1xyXG4gICAgaWYgKGlkKSB7XHJcbiAgICAgIGxldCByZXNvdXJjZUlkID0gdGhpcy5zZXJpYWxpemVyLnJlc291cmNlSWQodHlwZSwgaWQpO1xyXG4gICAgICBpZiAocmVzb3VyY2VJZCkge1xyXG4gICAgICAgIHBhdGgucHVzaChyZXNvdXJjZUlkKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHBhdGguam9pbignLycpO1xyXG4gIH1cclxuXHJcbiAgcmVzb3VyY2VVUkwodHlwZTogc3RyaW5nLCBpZD86IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICBsZXQgaG9zdCA9IHRoaXMucmVzb3VyY2VIb3N0KHR5cGUpO1xyXG4gICAgbGV0IG5hbWVzcGFjZSA9IHRoaXMucmVzb3VyY2VOYW1lc3BhY2UodHlwZSk7XHJcbiAgICBsZXQgdXJsOiBzdHJpbmdbXSA9IFtdO1xyXG5cclxuICAgIGlmIChob3N0KSB7IHVybC5wdXNoKGhvc3QpOyB9XHJcbiAgICBpZiAobmFtZXNwYWNlKSB7IHVybC5wdXNoKG5hbWVzcGFjZSk7IH1cclxuICAgIHVybC5wdXNoKHRoaXMucmVzb3VyY2VQYXRoKHR5cGUsIGlkKSk7XHJcblxyXG4gICAgaWYgKCFob3N0KSB7IHVybC51bnNoaWZ0KCcnKTsgfVxyXG5cclxuICAgIHJldHVybiB1cmwuam9pbignLycpO1xyXG4gIH1cclxuXHJcbiAgcmVzb3VyY2VSZWxhdGlvbnNoaXBVUkwodHlwZTogc3RyaW5nLCBpZDogc3RyaW5nLCByZWxhdGlvbnNoaXA6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVVSTCh0eXBlLCBpZCkgK1xyXG4gICAgICAgICAgICcvcmVsYXRpb25zaGlwcy8nICsgdGhpcy5zZXJpYWxpemVyLnJlc291cmNlUmVsYXRpb25zaGlwKHR5cGUsIHJlbGF0aW9uc2hpcCk7XHJcbiAgfVxyXG5cclxuICByZWxhdGVkUmVzb3VyY2VVUkwodHlwZTogc3RyaW5nLCBpZDogc3RyaW5nLCByZWxhdGlvbnNoaXA6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVVSTCh0eXBlLCBpZCkgK1xyXG4gICAgICAgICAgICcvJyArIHRoaXMuc2VyaWFsaXplci5yZXNvdXJjZVJlbGF0aW9uc2hpcCh0eXBlLCByZWxhdGlvbnNoaXApO1xyXG4gIH1cclxuXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAvLyBQcml2YXRlIG1ldGhvZHNcclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICBwcm90ZWN0ZWQgX3Byb2Nlc3NSZXF1ZXN0cyhyZXF1ZXN0cywgcHJvY2Vzc29ycyk6IFByb21pc2U8VHJhbnNmb3JtW10+IHtcclxuICAgIGxldCB0cmFuc2Zvcm1zOiBUcmFuc2Zvcm1bXSA9IFtdO1xyXG4gICAgbGV0IHJlc3VsdDogUHJvbWlzZTx2b2lkPiA9IE9yYml0LlByb21pc2UucmVzb2x2ZSgpO1xyXG5cclxuICAgIHJlcXVlc3RzLmZvckVhY2gocmVxdWVzdCA9PiB7XHJcbiAgICAgIGxldCBwcm9jZXNzb3IgPSBwcm9jZXNzb3JzW3JlcXVlc3Qub3BdO1xyXG5cclxuICAgICAgcmVzdWx0ID0gcmVzdWx0LnRoZW4oKCkgPT4ge1xyXG4gICAgICAgIHJldHVybiBwcm9jZXNzb3IodGhpcywgcmVxdWVzdClcclxuICAgICAgICAgIC50aGVuKGFkZGl0aW9uYWxUcmFuc2Zvcm1zID0+IHtcclxuICAgICAgICAgICAgaWYgKGFkZGl0aW9uYWxUcmFuc2Zvcm1zKSB7XHJcbiAgICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkodHJhbnNmb3JtcywgYWRkaXRpb25hbFRyYW5zZm9ybXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gcmVzdWx0LnRoZW4oKCkgPT4gdHJhbnNmb3Jtcyk7XHJcbiAgfVxyXG59XHJcbiJdfQ==