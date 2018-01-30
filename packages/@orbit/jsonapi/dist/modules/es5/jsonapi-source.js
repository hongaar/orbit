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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbmFwaS1zb3VyY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzcmMvanNvbmFwaS1zb3VyY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLEFBQWdDO0FBQ2hDLHFCQWVxQjtBQUVyQixzQkFBc0M7QUFDdEMsbUNBQW9GO0FBQ3BGLDZCQUF1RDtBQUN2RCwrQkFBbUU7QUFDbkUsbUNBQTRGO0FBQzVGLDJCQUF5RDtBQUV6RCxBQUFFLEFBQUMsSUFBQyxPQUFPLE9BQUssUUFBQyxBQUFPLFFBQUMsQUFBSyxVQUFLLEFBQVcsZUFBSSxPQUFLLFFBQUMsQUFBSyxVQUFLLEFBQVMsQUFBQyxXQUFDLEFBQUM7QUFDNUUsV0FBSyxRQUFDLEFBQUssUUFBRyxPQUFLLFFBQUMsQUFBTyxRQUFDLEFBQUssQUFBQyxBQUNwQztBQUFDO0FBb0JELEFBYUc7Ozs7Ozs7Ozs7Ozs7O0FBR0g7QUFBMkMsNkJBQU07QUFjL0MsMkJBQVksQUFBb0M7QUFBcEMsaUNBQUE7QUFBQSx1QkFBb0M7O0FBQWhELG9CQWtCQztBQWpCQyxnQkFBTSxPQUFDLEFBQXVGLHlGQUFFLENBQUMsQ0FBQyxBQUFRLFNBQUMsQUFBTSxBQUFDLEFBQUM7QUFDbkgsZ0JBQU0sT0FBQyxBQUFpRCxtREFBRSxPQUFLLFFBQUMsQUFBTyxBQUFDLEFBQUM7QUFDekUsZ0JBQU0sT0FBQyxBQUErQyxpREFBRSxPQUFLLFFBQUMsQUFBSyxBQUFDLEFBQUM7QUFFckUsQUFBUSxpQkFBQyxBQUFJLE9BQUcsQUFBUSxTQUFDLEFBQUksUUFBSSxBQUFTLEFBQUM7QUFFM0MsZ0JBQUEsa0JBQU0sQUFBUSxBQUFDLGFBQUM7QUFFaEIsQUFBSSxjQUFDLEFBQVMsWUFBYSxBQUFRLFNBQUMsQUFBUyxBQUFDO0FBQzlDLEFBQUksY0FBQyxBQUFJLE9BQWtCLEFBQVEsU0FBQyxBQUFJLEFBQUM7QUFDekMsQUFBSSxjQUFDLEFBQW1CLHNCQUFHLEFBQVEsU0FBQyxBQUFtQix1QkFBSSxFQUFFLEFBQU0sUUFBRSxBQUEwQixBQUFFLEFBQUM7QUFDbEcsQUFBSSxjQUFDLEFBQW1CLHNCQUFHLEFBQVEsU0FBQyxBQUFtQix1QkFBSSxBQUFJLEFBQUM7QUFFaEUsQUFBSSxjQUFDLEFBQXVCLDBCQUFHLEFBQVEsU0FBQyxBQUF1QixBQUFDO0FBRWhFLFlBQU0sQUFBZSxrQkFBRyxBQUFRLFNBQUMsQUFBZSxtQkFBSSxxQkFBaUIsQUFBQztBQUN0RSxBQUFJLGNBQUMsQUFBVSxhQUFTLElBQUksQUFBZSxnQkFBQyxFQUFFLEFBQU0sUUFBRSxBQUFRLFNBQUMsQUFBTSxRQUFFLEFBQU0sUUFBRSxBQUFRLFNBQUMsQUFBTSxBQUFFLEFBQUMsQUFBQztlQUNwRztBQUFDO0FBRUQsQUFBNkU7QUFDN0UsQUFBb0M7QUFDcEMsQUFBNkU7QUFFN0UsNEJBQUssUUFBTCxVQUFNLEFBQW9CO0FBQTFCLG9CQWlCQztBQWhCQyxZQUFNLEFBQVEsV0FBRyxxQkFBb0IscUJBQUMsQUFBSSxNQUFFLEFBQVMsQUFBQyxBQUFDO0FBRXZELEFBQUUsQUFBQyxZQUFDLEFBQUksS0FBQyxBQUF1QiwyQkFBSSxBQUFRLFNBQUMsQUFBTSxTQUFHLEFBQUksS0FBQyxBQUF1QixBQUFDLHlCQUFDLEFBQUM7QUFDbkYsQUFBTSwwQkFBTSxRQUFDLEFBQU8sUUFBQyxBQUFPLEFBQUUsVUFDM0IsQUFBSSxLQUFDO0FBQ0osc0JBQU0sSUFBSSxPQUFtQixvQkFDM0IsNkJBQTJCLEFBQVEsU0FBQyxBQUFNLDhEQUFtRCxBQUFJLE1BQUMsQUFBdUIsMEJBQTBCLDRCQUNuSixBQUFTLEFBQUMsQUFBQyxBQUNmO0FBQUMsQUFBQyxBQUFDLEFBQ1AsYUFOUztBQU1SO0FBRUQsQUFBTSxvQkFBTSxBQUFnQixpQkFBQyxBQUFRLFVBQUUscUJBQTBCLEFBQUMsNEJBQy9ELEFBQUksS0FBQyxVQUFBLEFBQVU7QUFDZCxBQUFVLHVCQUFDLEFBQU8sUUFBQyxBQUFTLEFBQUMsQUFBQztBQUM5QixBQUFNLG1CQUFDLEFBQVUsQUFBQyxBQUNwQjtBQUFDLEFBQUMsQUFBQyxBQUNQLFNBTFMsQUFBSTtBQUtaO0FBRUQsQUFBNkU7QUFDN0UsQUFBb0M7QUFDcEMsQUFBNkU7QUFFN0UsNEJBQUssUUFBTCxVQUFNLEFBQVk7QUFDaEIsWUFBTSxBQUFRLFdBQWlCLGlCQUFhLGNBQUMsQUFBSyxNQUFDLEFBQVUsV0FBQyxBQUFFLEFBQUMsQUFBQztBQUNsRSxBQUFFLEFBQUMsWUFBQyxDQUFDLEFBQVEsQUFBQyxVQUFDLEFBQUM7QUFDZCxrQkFBTSxJQUFJLEFBQUssTUFBQyxBQUFtRixBQUFDLEFBQUMsQUFDdkc7QUFBQztBQUNELEFBQU0sZUFBQyxBQUFRLFNBQUMsQUFBSSxNQUFFLEFBQUssQUFBQyxBQUFDLEFBQy9CO0FBQUM7QUFFRCxBQUE2RTtBQUM3RSxBQUEwRDtBQUMxRCxBQUE2RTtBQUU3RSw0QkFBSyxRQUFMLFVBQU0sQUFBVyxLQUFFLEFBQTRCO0FBQS9DLG9CQWlFQztBQWpFa0IsaUNBQUE7QUFBQSx1QkFBNEI7O0FBQzdDLEFBQVEsaUJBQUMsQUFBTyxVQUFHLEFBQVEsU0FBQyxBQUFPLFdBQUksQUFBSSxLQUFDLEFBQW1CLEFBQUM7QUFFaEUsWUFBSSxBQUFPLFVBQUcsQUFBUSxTQUFDLEFBQU8sQUFBQztBQUMvQixZQUFJLEFBQU0sU0FBRyxBQUFRLFNBQUMsQUFBTSxVQUFJLEFBQUssQUFBQztBQUV0QyxBQUFtRTtBQUVuRSxZQUFJLEFBQU8sVUFBRyxBQUFRLFNBQUMsQUFBTyxXQUFJLEFBQUksS0FBQyxBQUFtQixBQUFDO0FBQzNELEFBQUUsQUFBQyxZQUFDLEFBQVEsU0FBQyxBQUFPLEFBQUMsU0FBQyxBQUFDO0FBQ3JCLG1CQUFPLEFBQVEsU0FBQyxBQUFPLEFBQUMsQUFDMUI7QUFBQztBQUVELEFBQUUsQUFBQyxZQUFDLEFBQVEsU0FBQyxBQUFJLEFBQUMsTUFBQyxBQUFDO0FBQ2xCLG9CQUFNLE9BQUMsQUFBMEQsNERBQUUsQ0FBQyxBQUFRLFNBQUMsQUFBSSxBQUFDLEFBQUM7QUFDbkYsQUFBUSxxQkFBQyxBQUFJLE9BQUcsQUFBSSxLQUFDLEFBQVMsVUFBQyxBQUFRLFNBQUMsQUFBSSxBQUFDLEFBQUM7QUFDOUMsbUJBQU8sQUFBUSxTQUFDLEFBQUksQUFBQyxBQUN2QjtBQUFDO0FBRUQsQUFBRSxBQUFDLFlBQUMsQUFBUSxTQUFDLEFBQUksUUFBSSxBQUFNLFdBQUssQUFBSyxBQUFDLE9BQUMsQUFBQztBQUN0QyxBQUFPLG9CQUFDLEFBQWMsQUFBQyxrQkFBRyxBQUFPLFFBQUMsQUFBYyxBQUFDLG1CQUFJLEFBQXlDLEFBQUMsQUFDakc7QUFBQztBQUVELEFBQUUsQUFBQyxZQUFDLEFBQVEsU0FBQyxBQUFNLEFBQUMsUUFBQyxBQUFDO0FBQ3BCLEFBQUUsQUFBQyxnQkFBQyxBQUFHLElBQUMsQUFBTyxRQUFDLEFBQUcsQUFBQyxTQUFLLENBQUMsQUFBQyxBQUFDLEdBQUMsQUFBQztBQUM1QixBQUFHLHVCQUFJLEFBQUcsQUFBQyxBQUNiO0FBQUMsQUFBQyxBQUFJLG1CQUFDLEFBQUM7QUFDTixBQUFHLHVCQUFJLEFBQUcsQUFBQyxBQUNiO0FBQUM7QUFDRCxBQUFHLG1CQUFJLGVBQWlCLGtCQUFDLEFBQVEsU0FBQyxBQUFNLEFBQUMsQUFBQztBQUUxQyxtQkFBTyxBQUFRLFNBQUMsQUFBTSxBQUFDLEFBQ3pCO0FBQUM7QUFFRCxBQUFFLEFBQUMsWUFBQyxBQUFPLEFBQUMsU0FBQyxBQUFDO0FBQ1osQUFBTSx1QkFBSyxPQUFLLFFBQUMsQUFBTyxRQUFDLFVBQUMsQUFBTyxTQUFFLEFBQU07QUFDdkMsb0JBQUksQUFBUSxBQUFDO0FBRWIsb0JBQUksQUFBSyxlQUFRLFFBQUMsQUFBTyxRQUFDLEFBQVUsV0FBQztBQUNuQyxBQUFRLCtCQUFHLEFBQUksQUFBQztBQUNoQixBQUFNLDJCQUFDLElBQUksT0FBWSxhQUFDLDhCQUE0QixBQUFPLFVBQUssQUFBQyxBQUFDLEFBQUMsQUFDckU7QUFBQyxpQkFIVyxFQUdULEFBQU8sQUFBQyxBQUFDO0FBRVosdUJBQUssUUFBQyxBQUFLLE1BQUMsQUFBRyxLQUFFLEFBQVEsQUFBQyxVQUN2QixBQUFLLE1BQUMsVUFBQSxBQUFDO0FBQ04sMkJBQUssUUFBQyxBQUFPLFFBQUMsQUFBWSxhQUFDLEFBQUssQUFBQyxBQUFDO0FBRWxDLEFBQUUsQUFBQyx3QkFBQyxDQUFDLEFBQVEsQUFBQyxVQUFDLEFBQUM7QUFDZCxBQUFNLCtCQUFDLEFBQUksTUFBQyxBQUFnQixpQkFBQyxBQUFDLEFBQUMsQUFBQyxBQUNsQztBQUFDLEFBQ0g7QUFBQyxBQUFDLG1CQUNELEFBQUksS0FBQyxVQUFBLEFBQVE7QUFDWiwyQkFBSyxRQUFDLEFBQU8sUUFBQyxBQUFZLGFBQUMsQUFBSyxBQUFDLEFBQUM7QUFFbEMsQUFBRSxBQUFDLHdCQUFDLENBQUMsQUFBUSxBQUFDLFVBQUMsQUFBQztBQUNkLEFBQU0sK0JBQUMsQUFBSSxNQUFDLEFBQW1CLG9CQUFDLEFBQVEsQUFBQyxBQUFDLEFBQzVDO0FBQUMsQUFDSDtBQUFDLEFBQUMsbUJBQ0QsQUFBSSxLQUFDLEFBQU8sU0FBRSxBQUFNLEFBQUMsQUFBQyxBQUMzQjtBQUFDLEFBQUMsQUFBQyxBQUNMLGFBekJTO0FBeUJSLEFBQUMsQUFBSSxlQUFDLEFBQUM7QUFDTixBQUFNLDBCQUFNLFFBQUMsQUFBSyxNQUFDLEFBQUcsS0FBRSxBQUFRLEFBQUMsVUFDOUIsQUFBSyxNQUFDLFVBQUEsQUFBQztBQUFJLHVCQUFBLEFBQUksTUFBQyxBQUFnQixpQkFBckIsQUFBc0IsQUFBQyxBQUFDO0FBQUEsQUFBQyxhQURoQyxFQUVKLEFBQUksS0FBQyxVQUFBLEFBQVE7QUFBSSx1QkFBQSxBQUFJLE1BQUMsQUFBbUIsb0JBQXhCLEFBQXlCLEFBQVEsQUFBQztBQUFBLEFBQUMsQUFBQyxBQUMxRDtBQUFDLEFBQ0g7QUFBQztBQUVTLDRCQUFtQixzQkFBN0IsVUFBOEIsQUFBYTtBQUEzQyxvQkFvQkM7QUFuQkMsQUFBRSxBQUFDLFlBQUMsQUFBUSxTQUFDLEFBQU0sV0FBSyxBQUFHLEFBQUMsS0FBQyxBQUFDO0FBQzVCLEFBQUUsQUFBQyxnQkFBQyxBQUFJLEtBQUMsQUFBa0IsbUJBQUMsQUFBUSxBQUFDLEFBQUMsV0FBQyxBQUFDO0FBQ3RDLEFBQU0sdUJBQUMsQUFBUSxTQUFDLEFBQUksQUFBRSxBQUFDLEFBQ3pCO0FBQUMsQUFBQyxBQUFJLG1CQUFDLEFBQUM7QUFDTixzQkFBTSxJQUFJLGFBQXFCLHNCQUFDLDZCQUEyQixBQUFRLFNBQUMsQUFBTSxTQUE2RixBQUFDLEFBQUMsQUFDM0s7QUFBQyxBQUNIO0FBQUMsQUFBQyxBQUFJLG1CQUFLLEFBQVEsU0FBQyxBQUFNLFVBQUksQUFBRyxPQUFJLEFBQVEsU0FBQyxBQUFNLFNBQUcsQUFBRyxBQUFDLEtBQUMsQUFBQztBQUMzRCxBQUFFLEFBQUMsZ0JBQUMsQUFBSSxLQUFDLEFBQWtCLG1CQUFDLEFBQVEsQUFBQyxBQUFDLFdBQUMsQUFBQztBQUN0QyxBQUFNLHVCQUFDLEFBQVEsU0FBQyxBQUFJLEFBQUUsQUFBQyxBQUN6QjtBQUFDLEFBQ0g7QUFBQyxBQUFDLEFBQUksU0FKQyxBQUFFLEFBQUMsTUFJSCxBQUFDO0FBQ04sQUFBRSxBQUFDLGdCQUFDLEFBQUksS0FBQyxBQUFrQixtQkFBQyxBQUFRLEFBQUMsQUFBQyxXQUFDLEFBQUM7QUFDdEMsQUFBTSxnQ0FBVSxBQUFJLEFBQUUsT0FDbkIsQUFBSSxLQUFDLFVBQUEsQUFBSTtBQUFJLDJCQUFBLEFBQUksTUFBQyxBQUF3Qix5QkFBQyxBQUFRLFVBQXRDLEFBQXdDLEFBQUksQUFBQztBQUFBLEFBQUMsQUFBQyxBQUNqRSxpQkFGUyxBQUFRO0FBRWhCLEFBQUMsQUFBSSxtQkFBQyxBQUFDO0FBQ04sQUFBTSx1QkFBQyxBQUFJLEtBQUMsQUFBd0IseUJBQUMsQUFBUSxBQUFDLEFBQUMsQUFDakQ7QUFBQyxBQUNIO0FBQUM7QUFDRCxBQUFNLGVBQUMsT0FBSyxRQUFDLEFBQU8sUUFBQyxBQUFPLEFBQUUsQUFBQyxBQUNqQztBQUFDO0FBRVMsNEJBQXdCLDJCQUFsQyxVQUFtQyxBQUFhLFVBQUUsQUFBVTtBQUMxRCxZQUFJLEFBQUssQUFBQztBQUNWLEFBQUUsQUFBQyxZQUFDLEFBQVEsU0FBQyxBQUFNLFVBQUksQUFBRyxPQUFJLEFBQVEsU0FBQyxBQUFNLFNBQUcsQUFBRyxBQUFDLEtBQUMsQUFBQztBQUNwRCxBQUFLLG9CQUFHLElBQUksT0FBVyxZQUFDLEFBQVEsU0FBQyxBQUFVLEFBQUMsQUFBQyxBQUMvQztBQUFDLEFBQUMsQUFBSSxlQUFDLEFBQUM7QUFDTixBQUFLLG9CQUFHLElBQUksT0FBVyxZQUFDLEFBQVEsU0FBQyxBQUFVLEFBQUMsQUFBQyxBQUMvQztBQUFDO0FBQ0QsQUFBSyxjQUFDLEFBQVEsV0FBRyxBQUFRLEFBQUM7QUFDMUIsQUFBSyxjQUFDLEFBQUksT0FBRyxBQUFJLEFBQUM7QUFDbEIsQUFBTSxlQUFDLE9BQUssUUFBQyxBQUFPLFFBQUMsQUFBTSxPQUFDLEFBQUssQUFBQyxBQUFDLEFBQ3JDO0FBQUM7QUFFUyw0QkFBZ0IsbUJBQTFCLFVBQTJCLEFBQU07QUFDL0IsWUFBSSxBQUFLLFFBQUcsSUFBSSxPQUFZLGFBQUMsQUFBQyxBQUFDLEFBQUM7QUFDaEMsQUFBTSxlQUFDLE9BQUssUUFBQyxBQUFPLFFBQUMsQUFBTSxPQUFDLEFBQUssQUFBQyxBQUFDLEFBQ3JDO0FBQUM7QUFFRCw0QkFBa0IscUJBQWxCLFVBQW1CLEFBQWE7QUFDOUIsWUFBSSxBQUFXLGNBQUcsQUFBUSxTQUFDLEFBQU8sUUFBQyxBQUFHLElBQUMsQUFBYyxBQUFDLEFBQUM7QUFDdkQsQUFBTSxlQUFDLEFBQVcsZUFBSSxBQUFXLFlBQUMsQUFBTyxRQUFDLEFBQTBCLEFBQUMsOEJBQUcsQ0FBQyxBQUFDLEFBQUMsQUFDN0U7QUFBQztBQUVELDRCQUFpQixvQkFBakIsVUFBa0IsQUFBYTtBQUM3QixBQUFNLGVBQUMsQUFBSSxLQUFDLEFBQVMsQUFBQyxBQUN4QjtBQUFDO0FBRUQsNEJBQVksZUFBWixVQUFhLEFBQWE7QUFDeEIsQUFBTSxlQUFDLEFBQUksS0FBQyxBQUFJLEFBQUMsQUFDbkI7QUFBQztBQUVELDRCQUFZLGVBQVosVUFBYSxBQUFZLE1BQUUsQUFBVztBQUNwQyxZQUFJLEFBQUksT0FBRyxDQUFDLEFBQUksS0FBQyxBQUFVLFdBQUMsQUFBWSxhQUFDLEFBQUksQUFBQyxBQUFDLEFBQUM7QUFDaEQsQUFBRSxBQUFDLFlBQUMsQUFBRSxBQUFDLElBQUMsQUFBQztBQUNQLGdCQUFJLEFBQVUsYUFBRyxBQUFJLEtBQUMsQUFBVSxXQUFDLEFBQVUsV0FBQyxBQUFJLE1BQUUsQUFBRSxBQUFDLEFBQUM7QUFDdEQsQUFBRSxBQUFDLGdCQUFDLEFBQVUsQUFBQyxZQUFDLEFBQUM7QUFDZixBQUFJLHFCQUFDLEFBQUksS0FBQyxBQUFVLEFBQUMsQUFBQyxBQUN4QjtBQUFDLEFBQ0g7QUFBQztBQUNELEFBQU0sZUFBQyxBQUFJLEtBQUMsQUFBSSxLQUFDLEFBQUcsQUFBQyxBQUFDLEFBQ3hCO0FBQUM7QUFFRCw0QkFBVyxjQUFYLFVBQVksQUFBWSxNQUFFLEFBQVc7QUFDbkMsWUFBSSxBQUFJLE9BQUcsQUFBSSxLQUFDLEFBQVksYUFBQyxBQUFJLEFBQUMsQUFBQztBQUNuQyxZQUFJLEFBQVMsWUFBRyxBQUFJLEtBQUMsQUFBaUIsa0JBQUMsQUFBSSxBQUFDLEFBQUM7QUFDN0MsWUFBSSxBQUFHLE1BQWEsQUFBRSxBQUFDO0FBRXZCLEFBQUUsQUFBQyxZQUFDLEFBQUksQUFBQyxNQUFDLEFBQUM7QUFBQyxBQUFHLGdCQUFDLEFBQUksS0FBQyxBQUFJLEFBQUMsQUFBQyxBQUFDO0FBQUM7QUFDN0IsQUFBRSxBQUFDLFlBQUMsQUFBUyxBQUFDLFdBQUMsQUFBQztBQUFDLEFBQUcsZ0JBQUMsQUFBSSxLQUFDLEFBQVMsQUFBQyxBQUFDLEFBQUM7QUFBQztBQUN2QyxBQUFHLFlBQUMsQUFBSSxLQUFDLEFBQUksS0FBQyxBQUFZLGFBQUMsQUFBSSxNQUFFLEFBQUUsQUFBQyxBQUFDLEFBQUM7QUFFdEMsQUFBRSxBQUFDLFlBQUMsQ0FBQyxBQUFJLEFBQUMsTUFBQyxBQUFDO0FBQUMsQUFBRyxnQkFBQyxBQUFPLFFBQUMsQUFBRSxBQUFDLEFBQUMsQUFBQztBQUFDO0FBRS9CLEFBQU0sZUFBQyxBQUFHLElBQUMsQUFBSSxLQUFDLEFBQUcsQUFBQyxBQUFDLEFBQ3ZCO0FBQUM7QUFFRCw0QkFBdUIsMEJBQXZCLFVBQXdCLEFBQVksTUFBRSxBQUFVLElBQUUsQUFBb0I7QUFDcEUsQUFBTSxlQUFDLEFBQUksS0FBQyxBQUFXLFlBQUMsQUFBSSxNQUFFLEFBQUUsQUFBQyxNQUMxQixBQUFpQixvQkFBRyxBQUFJLEtBQUMsQUFBVSxXQUFDLEFBQW9CLHFCQUFDLEFBQUksTUFBRSxBQUFZLEFBQUMsQUFBQyxBQUN0RjtBQUFDO0FBRUQsNEJBQWtCLHFCQUFsQixVQUFtQixBQUFZLE1BQUUsQUFBVSxJQUFFLEFBQW9CO0FBQy9ELEFBQU0sZUFBQyxBQUFJLEtBQUMsQUFBVyxZQUFDLEFBQUksTUFBRSxBQUFFLEFBQUMsTUFDMUIsQUFBRyxNQUFHLEFBQUksS0FBQyxBQUFVLFdBQUMsQUFBb0IscUJBQUMsQUFBSSxNQUFFLEFBQVksQUFBQyxBQUFDLEFBQ3hFO0FBQUM7QUFFRCxBQUE2RTtBQUM3RSxBQUFrQjtBQUNsQixBQUE2RTtBQUVuRSw0QkFBZ0IsbUJBQTFCLFVBQTJCLEFBQVEsVUFBRSxBQUFVO0FBQS9DLG9CQWtCQztBQWpCQyxZQUFJLEFBQVUsYUFBZ0IsQUFBRSxBQUFDO0FBQ2pDLFlBQUksQUFBTSxTQUFrQixPQUFLLFFBQUMsQUFBTyxRQUFDLEFBQU8sQUFBRSxBQUFDO0FBRXBELEFBQVEsaUJBQUMsQUFBTyxRQUFDLFVBQUEsQUFBTztBQUN0QixnQkFBSSxBQUFTLFlBQUcsQUFBVSxXQUFDLEFBQU8sUUFBQyxBQUFFLEFBQUMsQUFBQztBQUV2QyxBQUFNLDRCQUFVLEFBQUksS0FBQztBQUNuQixBQUFNLGlDQUFXLEFBQUksT0FBRSxBQUFPLEFBQUMsU0FDNUIsQUFBSSxLQUFDLFVBQUEsQUFBb0I7QUFDeEIsQUFBRSxBQUFDLHdCQUFDLEFBQW9CLEFBQUMsc0JBQUMsQUFBQztBQUN6QixBQUFLLDhCQUFDLEFBQVMsVUFBQyxBQUFJLEtBQUMsQUFBSyxNQUFDLEFBQVUsWUFBRSxBQUFvQixBQUFDLEFBQUMsQUFDL0Q7QUFBQyxBQUNIO0FBQUMsQUFBQyxBQUFDLEFBQ1AsaUJBTlMsQUFBUztBQU1qQixBQUFDLEFBQUMsQUFDTCxhQVJXLEFBQU07QUFRaEIsQUFBQyxBQUFDO0FBRUgsQUFBTSxzQkFBUSxBQUFJLEtBQUM7QUFBTSxtQkFBQSxBQUFVO0FBQUEsQUFBQyxBQUFDLEFBQ3ZDLFNBRFMsQUFBTTtBQUNkO0FBelBrQixBQUFhLGdDQUZqQyxPQUFRLFVBQ1IsT0FBUSxXQUNZLEFBQWEsQUEwUGpDO0FBQUQsV0FBQztBQTFQRCxBQTBQQyxFQTFQMEMsT0FBTSxBQTBQaEQ7a0JBMVBvQixBQUFhIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgdmFsaWQtanNkb2MgKi9cclxuaW1wb3J0IE9yYml0LCB7XHJcbiAgS2V5TWFwLFxyXG4gIFJlY29yZE9wZXJhdGlvbixcclxuICBTY2hlbWEsXHJcbiAgU291cmNlLCBTb3VyY2VTZXR0aW5ncyxcclxuICBRdWVyeSwgUXVlcnlPckV4cHJlc3Npb24sXHJcbiAgUHVsbGFibGUsIHB1bGxhYmxlLFxyXG4gIFB1c2hhYmxlLCBwdXNoYWJsZSxcclxuICBUcmFuc2Zvcm0sXHJcbiAgVHJhbnNmb3JtT3JPcGVyYXRpb25zLFxyXG4gIGNvYWxlc2NlUmVjb3JkT3BlcmF0aW9ucyxcclxuICBRdWVyeU5vdEFsbG93ZWQsIFRyYW5zZm9ybU5vdEFsbG93ZWQsXHJcbiAgQ2xpZW50RXJyb3IsXHJcbiAgU2VydmVyRXJyb3IsXHJcbiAgTmV0d29ya0Vycm9yXHJcbn0gZnJvbSAnQG9yYml0L2RhdGEnO1xyXG5pbXBvcnQgeyBMb2cgfSBmcm9tICdAb3JiaXQvY29yZSc7XHJcbmltcG9ydCB7IGFzc2VydCB9IGZyb20gJ0BvcmJpdC91dGlscyc7XHJcbmltcG9ydCBKU09OQVBJU2VyaWFsaXplciwgeyBKU09OQVBJU2VyaWFsaXplclNldHRpbmdzIH0gZnJvbSAnLi9qc29uYXBpLXNlcmlhbGl6ZXInO1xyXG5pbXBvcnQgeyBlbmNvZGVRdWVyeVBhcmFtcyB9IGZyb20gJy4vbGliL3F1ZXJ5LXBhcmFtcyc7XHJcbmltcG9ydCB7IFB1bGxPcGVyYXRvciwgUHVsbE9wZXJhdG9ycyB9IGZyb20gJy4vbGliL3B1bGwtb3BlcmF0b3JzJztcclxuaW1wb3J0IHsgZ2V0VHJhbnNmb3JtUmVxdWVzdHMsIFRyYW5zZm9ybVJlcXVlc3RQcm9jZXNzb3JzIH0gZnJvbSAnLi9saWIvdHJhbnNmb3JtLXJlcXVlc3RzJztcclxuaW1wb3J0IHsgSW52YWxpZFNlcnZlclJlc3BvbnNlIH0gZnJvbSAnLi9saWIvZXhjZXB0aW9ucyc7XHJcblxyXG5pZiAodHlwZW9mIE9yYml0Lmdsb2JhbHMuZmV0Y2ggIT09ICd1bmRlZmluZWQnICYmIE9yYml0LmZldGNoID09PSB1bmRlZmluZWQpIHtcclxuICBPcmJpdC5mZXRjaCA9IE9yYml0Lmdsb2JhbHMuZmV0Y2g7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgRmV0Y2hTZXR0aW5ncyB7XHJcbiAgaGVhZGVycz86IG9iamVjdDtcclxuICBtZXRob2Q/OiBzdHJpbmc7XHJcbiAganNvbj86IG9iamVjdDtcclxuICBib2R5Pzogc3RyaW5nO1xyXG4gIHBhcmFtcz86IGFueTtcclxuICB0aW1lb3V0PzogbnVtYmVyO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEpTT05BUElTb3VyY2VTZXR0aW5ncyBleHRlbmRzIFNvdXJjZVNldHRpbmdzIHtcclxuICBtYXhSZXF1ZXN0c1BlclRyYW5zZm9ybT86IG51bWJlcjtcclxuICBuYW1lc3BhY2U/OiBzdHJpbmc7XHJcbiAgaG9zdD86IHN0cmluZztcclxuICBkZWZhdWx0RmV0Y2hIZWFkZXJzPzogb2JqZWN0O1xyXG4gIGRlZmF1bHRGZXRjaFRpbWVvdXQ/OiBudW1iZXI7XHJcbiAgU2VyaWFsaXplckNsYXNzPzogKG5ldyAoc2V0dGluZ3M6IEpTT05BUElTZXJpYWxpemVyU2V0dGluZ3MpID0+IEpTT05BUElTZXJpYWxpemVyKTtcclxufVxyXG5cclxuLyoqXHJcbiBTb3VyY2UgZm9yIGFjY2Vzc2luZyBhIEpTT04gQVBJIGNvbXBsaWFudCBSRVNUZnVsIEFQSSB3aXRoIGEgbmV0d29yayBmZXRjaFxyXG4gcmVxdWVzdC5cclxuXHJcbiBJZiBhIHNpbmdsZSB0cmFuc2Zvcm0gb3IgcXVlcnkgcmVxdWlyZXMgbW9yZSB0aGFuIG9uZSBmZXRjaCByZXF1ZXN0LFxyXG4gcmVxdWVzdHMgd2lsbCBiZSBwZXJmb3JtZWQgc2VxdWVudGlhbGx5IGFuZCByZXNvbHZlZCB0b2dldGhlci4gRnJvbSB0aGVcclxuIHBlcnNwZWN0aXZlIG9mIE9yYml0LCB0aGVzZSBvcGVyYXRpb25zIHdpbGwgYWxsIHN1Y2NlZWQgb3IgZmFpbCB0b2dldGhlci4gVGhlXHJcbiBgbWF4UmVxdWVzdHNQZXJUcmFuc2Zvcm1gIGFuZCBgbWF4UmVxdWVzdHNQZXJRdWVyeWAgc2V0dGluZ3MgYWxsb3cgbGltaXRzIHRvIGJlXHJcbiBzZXQgb24gdGhpcyBiZWhhdmlvci4gVGhlc2Ugc2V0dGluZ3Mgc2hvdWxkIGJlIHNldCB0byBgMWAgaWYgeW91ciBjbGllbnQvc2VydmVyXHJcbiBjb25maWd1cmF0aW9uIGlzIHVuYWJsZSB0byByZXNvbHZlIHBhcnRpYWxseSBzdWNjZXNzZnVsIHRyYW5zZm9ybXMgLyBxdWVyaWVzLlxyXG5cclxuIEBjbGFzcyBKU09OQVBJU291cmNlXHJcbiBAZXh0ZW5kcyBTb3VyY2VcclxuICovXHJcbkBwdWxsYWJsZVxyXG5AcHVzaGFibGVcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSlNPTkFQSVNvdXJjZSBleHRlbmRzIFNvdXJjZSBpbXBsZW1lbnRzIFB1bGxhYmxlLCBQdXNoYWJsZSB7XHJcbiAgbWF4UmVxdWVzdHNQZXJUcmFuc2Zvcm06IG51bWJlcjtcclxuICBuYW1lc3BhY2U6IHN0cmluZztcclxuICBob3N0OiBzdHJpbmc7XHJcbiAgZGVmYXVsdEZldGNoSGVhZGVyczogb2JqZWN0O1xyXG4gIGRlZmF1bHRGZXRjaFRpbWVvdXQ6IG51bWJlcjtcclxuICBzZXJpYWxpemVyOiBKU09OQVBJU2VyaWFsaXplcjtcclxuXHJcbiAgLy8gUHVsbGFibGUgaW50ZXJmYWNlIHN0dWJzXHJcbiAgcHVsbDogKHF1ZXJ5T3JFeHByZXNzaW9uOiBRdWVyeU9yRXhwcmVzc2lvbiwgb3B0aW9ucz86IG9iamVjdCwgaWQ/OiBzdHJpbmcpID0+IFByb21pc2U8VHJhbnNmb3JtW10+O1xyXG5cclxuICAvLyBQdXNoYWJsZSBpbnRlcmZhY2Ugc3R1YnNcclxuICBwdXNoOiAodHJhbnNmb3JtT3JPcGVyYXRpb25zOiBUcmFuc2Zvcm1Pck9wZXJhdGlvbnMsIG9wdGlvbnM/OiBvYmplY3QsIGlkPzogc3RyaW5nKSA9PiBQcm9taXNlPFRyYW5zZm9ybVtdPjtcclxuXHJcbiAgY29uc3RydWN0b3Ioc2V0dGluZ3M6IEpTT05BUElTb3VyY2VTZXR0aW5ncyA9IHt9KSB7XHJcbiAgICBhc3NlcnQoJ0pTT05BUElTb3VyY2VcXCdzIGBzY2hlbWFgIG11c3QgYmUgc3BlY2lmaWVkIGluIGBzZXR0aW5ncy5zY2hlbWFgIGNvbnN0cnVjdG9yIGFyZ3VtZW50JywgISFzZXR0aW5ncy5zY2hlbWEpO1xyXG4gICAgYXNzZXJ0KCdKU09OQVBJU291cmNlIHJlcXVpcmVzIE9yYml0LlByb21pc2UgYmUgZGVmaW5lZCcsIE9yYml0LlByb21pc2UpO1xyXG4gICAgYXNzZXJ0KCdKU09OQVBJU291cmNlIHJlcXVpcmVzIE9yYml0LmZldGNoIGJlIGRlZmluZWQnLCBPcmJpdC5mZXRjaCk7XHJcblxyXG4gICAgc2V0dGluZ3MubmFtZSA9IHNldHRpbmdzLm5hbWUgfHwgJ2pzb25hcGknO1xyXG5cclxuICAgIHN1cGVyKHNldHRpbmdzKTtcclxuXHJcbiAgICB0aGlzLm5hbWVzcGFjZSAgICAgICAgICAgPSBzZXR0aW5ncy5uYW1lc3BhY2U7XHJcbiAgICB0aGlzLmhvc3QgICAgICAgICAgICAgICAgPSBzZXR0aW5ncy5ob3N0O1xyXG4gICAgdGhpcy5kZWZhdWx0RmV0Y2hIZWFkZXJzID0gc2V0dGluZ3MuZGVmYXVsdEZldGNoSGVhZGVycyB8fCB7IEFjY2VwdDogJ2FwcGxpY2F0aW9uL3ZuZC5hcGkranNvbicgfTtcclxuICAgIHRoaXMuZGVmYXVsdEZldGNoVGltZW91dCA9IHNldHRpbmdzLmRlZmF1bHRGZXRjaFRpbWVvdXQgfHwgNTAwMDtcclxuXHJcbiAgICB0aGlzLm1heFJlcXVlc3RzUGVyVHJhbnNmb3JtID0gc2V0dGluZ3MubWF4UmVxdWVzdHNQZXJUcmFuc2Zvcm07XHJcblxyXG4gICAgY29uc3QgU2VyaWFsaXplckNsYXNzID0gc2V0dGluZ3MuU2VyaWFsaXplckNsYXNzIHx8IEpTT05BUElTZXJpYWxpemVyO1xyXG4gICAgdGhpcy5zZXJpYWxpemVyICAgICAgID0gbmV3IFNlcmlhbGl6ZXJDbGFzcyh7IHNjaGVtYTogc2V0dGluZ3Muc2NoZW1hLCBrZXlNYXA6IHNldHRpbmdzLmtleU1hcCB9KTtcclxuICB9XHJcblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgLy8gUHVzaGFibGUgaW50ZXJmYWNlIGltcGxlbWVudGF0aW9uXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgX3B1c2godHJhbnNmb3JtOiBUcmFuc2Zvcm0pOiBQcm9taXNlPFRyYW5zZm9ybVtdPiB7XHJcbiAgICBjb25zdCByZXF1ZXN0cyA9IGdldFRyYW5zZm9ybVJlcXVlc3RzKHRoaXMsIHRyYW5zZm9ybSk7XHJcblxyXG4gICAgaWYgKHRoaXMubWF4UmVxdWVzdHNQZXJUcmFuc2Zvcm0gJiYgcmVxdWVzdHMubGVuZ3RoID4gdGhpcy5tYXhSZXF1ZXN0c1BlclRyYW5zZm9ybSkge1xyXG4gICAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKClcclxuICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICB0aHJvdyBuZXcgVHJhbnNmb3JtTm90QWxsb3dlZChcclxuICAgICAgICAgICAgYFRoaXMgdHJhbnNmb3JtIHJlcXVpcmVzICR7cmVxdWVzdHMubGVuZ3RofSByZXF1ZXN0cywgd2hpY2ggZXhjZWVkcyB0aGUgc3BlY2lmaWVkIGxpbWl0IG9mICR7dGhpcy5tYXhSZXF1ZXN0c1BlclRyYW5zZm9ybX0gcmVxdWVzdHMgcGVyIHRyYW5zZm9ybS5gLFxyXG4gICAgICAgICAgICB0cmFuc2Zvcm0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLl9wcm9jZXNzUmVxdWVzdHMocmVxdWVzdHMsIFRyYW5zZm9ybVJlcXVlc3RQcm9jZXNzb3JzKVxyXG4gICAgICAudGhlbih0cmFuc2Zvcm1zID0+IHtcclxuICAgICAgICB0cmFuc2Zvcm1zLnVuc2hpZnQodHJhbnNmb3JtKTtcclxuICAgICAgICByZXR1cm4gdHJhbnNmb3JtcztcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gIC8vIFB1bGxhYmxlIGludGVyZmFjZSBpbXBsZW1lbnRhdGlvblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIF9wdWxsKHF1ZXJ5OiBRdWVyeSk6IFByb21pc2U8VHJhbnNmb3JtW10+IHtcclxuICAgIGNvbnN0IG9wZXJhdG9yOiBQdWxsT3BlcmF0b3IgPSBQdWxsT3BlcmF0b3JzW3F1ZXJ5LmV4cHJlc3Npb24ub3BdO1xyXG4gICAgaWYgKCFvcGVyYXRvcikge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0pTT05BUElTb3VyY2UgZG9lcyBub3Qgc3VwcG9ydCB0aGUgYCR7cXVlcnkuZXhwcmVzc2lvbi5vcH1gIG9wZXJhdG9yIGZvciBxdWVyaWVzLicpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG9wZXJhdG9yKHRoaXMsIHF1ZXJ5KTtcclxuICB9XHJcblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgLy8gUHVibGljbHkgYWNjZXNzaWJsZSBtZXRob2RzIHBhcnRpY3VsYXIgdG8gSlNPTkFQSVNvdXJjZVxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIGZldGNoKHVybDogc3RyaW5nLCBzZXR0aW5nczogRmV0Y2hTZXR0aW5ncyA9IHt9KTogUHJvbWlzZTxhbnk+IHtcclxuICAgIHNldHRpbmdzLmhlYWRlcnMgPSBzZXR0aW5ncy5oZWFkZXJzIHx8IHRoaXMuZGVmYXVsdEZldGNoSGVhZGVycztcclxuXHJcbiAgICBsZXQgaGVhZGVycyA9IHNldHRpbmdzLmhlYWRlcnM7XHJcbiAgICBsZXQgbWV0aG9kID0gc2V0dGluZ3MubWV0aG9kIHx8ICdHRVQnO1xyXG5cclxuICAgIC8vIGNvbnNvbGUubG9nKCdmZXRjaCcsIHVybCwgc2V0dGluZ3MsICdwb2x5ZmlsbCcsIGZldGNoLnBvbHlmaWxsKTtcclxuXHJcbiAgICBsZXQgdGltZW91dCA9IHNldHRpbmdzLnRpbWVvdXQgfHwgdGhpcy5kZWZhdWx0RmV0Y2hUaW1lb3V0O1xyXG4gICAgaWYgKHNldHRpbmdzLnRpbWVvdXQpIHtcclxuICAgICAgZGVsZXRlIHNldHRpbmdzLnRpbWVvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHNldHRpbmdzLmpzb24pIHtcclxuICAgICAgYXNzZXJ0KCdganNvbmAgYW5kIGBib2R5YCBjYW5cXCd0IGJvdGggYmUgc2V0IGZvciBmZXRjaCByZXF1ZXN0cy4nLCAhc2V0dGluZ3MuYm9keSk7XHJcbiAgICAgIHNldHRpbmdzLmJvZHkgPSBKU09OLnN0cmluZ2lmeShzZXR0aW5ncy5qc29uKTtcclxuICAgICAgZGVsZXRlIHNldHRpbmdzLmpzb247XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHNldHRpbmdzLmJvZHkgJiYgbWV0aG9kICE9PSAnR0VUJykge1xyXG4gICAgICBoZWFkZXJzWydDb250ZW50LVR5cGUnXSA9IGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddIHx8ICdhcHBsaWNhdGlvbi92bmQuYXBpK2pzb247IGNoYXJzZXQ9dXRmLTgnO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChzZXR0aW5ncy5wYXJhbXMpIHtcclxuICAgICAgaWYgKHVybC5pbmRleE9mKCc/JykgPT09IC0xKSB7XHJcbiAgICAgICAgdXJsICs9ICc/JztcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB1cmwgKz0gJyYnO1xyXG4gICAgICB9XHJcbiAgICAgIHVybCArPSBlbmNvZGVRdWVyeVBhcmFtcyhzZXR0aW5ncy5wYXJhbXMpO1xyXG5cclxuICAgICAgZGVsZXRlIHNldHRpbmdzLnBhcmFtcztcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGltZW91dCkge1xyXG4gICAgICByZXR1cm4gbmV3IE9yYml0LlByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgIGxldCB0aW1lZE91dDtcclxuXHJcbiAgICAgICAgbGV0IHRpbWVyID0gT3JiaXQuZ2xvYmFscy5zZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgIHRpbWVkT3V0ID0gdHJ1ZTtcclxuICAgICAgICAgIHJlamVjdChuZXcgTmV0d29ya0Vycm9yKGBObyBmZXRjaCByZXNwb25zZSB3aXRoaW4gJHt0aW1lb3V0fW1zLmApKTtcclxuICAgICAgICB9LCB0aW1lb3V0KTtcclxuXHJcbiAgICAgICAgT3JiaXQuZmV0Y2godXJsLCBzZXR0aW5ncylcclxuICAgICAgICAgIC5jYXRjaChlID0+IHtcclxuICAgICAgICAgICAgT3JiaXQuZ2xvYmFscy5jbGVhclRpbWVvdXQodGltZXIpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCF0aW1lZE91dCkge1xyXG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLmhhbmRsZUZldGNoRXJyb3IoZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIE9yYml0Lmdsb2JhbHMuY2xlYXJUaW1lb3V0KHRpbWVyKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghdGltZWRPdXQpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5oYW5kbGVGZXRjaFJlc3BvbnNlKHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC50aGVuKHJlc29sdmUsIHJlamVjdCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIE9yYml0LmZldGNoKHVybCwgc2V0dGluZ3MpXHJcbiAgICAgICAgLmNhdGNoKGUgPT4gdGhpcy5oYW5kbGVGZXRjaEVycm9yKGUpKVxyXG4gICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHRoaXMuaGFuZGxlRmV0Y2hSZXNwb25zZShyZXNwb25zZSkpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJvdGVjdGVkIGhhbmRsZUZldGNoUmVzcG9uc2UocmVzcG9uc2U6IGFueSk6IFByb21pc2U8YW55PiB7XHJcbiAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAyMDEpIHtcclxuICAgICAgaWYgKHRoaXMucmVzcG9uc2VIYXNDb250ZW50KHJlc3BvbnNlKSkge1xyXG4gICAgICAgIHJldHVybiByZXNwb25zZS5qc29uKCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEludmFsaWRTZXJ2ZXJSZXNwb25zZShgU2VydmVyIHJlc3BvbnNlcyB3aXRoIGEgJHtyZXNwb25zZS5zdGF0dXN9IHN0YXR1cyBzaG91bGQgcmV0dXJuIGNvbnRlbnQgd2l0aCBhIENvbnRlbnQtVHlwZSB0aGF0IGluY2x1ZGVzICdhcHBsaWNhdGlvbi92bmQuYXBpK2pzb24nLmApO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLnN0YXR1cyA+PSAyMDAgJiYgcmVzcG9uc2Uuc3RhdHVzIDwgMzAwKSB7XHJcbiAgICAgIGlmICh0aGlzLnJlc3BvbnNlSGFzQ29udGVudChyZXNwb25zZSkpIHtcclxuICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAodGhpcy5yZXNwb25zZUhhc0NvbnRlbnQocmVzcG9uc2UpKSB7XHJcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKVxyXG4gICAgICAgICAgLnRoZW4oZGF0YSA9PiB0aGlzLmhhbmRsZUZldGNoUmVzcG9uc2VFcnJvcihyZXNwb25zZSwgZGF0YSkpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmhhbmRsZUZldGNoUmVzcG9uc2VFcnJvcihyZXNwb25zZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKTtcclxuICB9XHJcblxyXG4gIHByb3RlY3RlZCBoYW5kbGVGZXRjaFJlc3BvbnNlRXJyb3IocmVzcG9uc2U6IGFueSwgZGF0YT86IGFueSk6IFByb21pc2U8YW55PiB7XHJcbiAgICBsZXQgZXJyb3I7XHJcbiAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID49IDQwMCAmJiByZXNwb25zZS5zdGF0dXMgPCA1MDApIHtcclxuICAgICAgZXJyb3IgPSBuZXcgQ2xpZW50RXJyb3IocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBlcnJvciA9IG5ldyBTZXJ2ZXJFcnJvcihyZXNwb25zZS5zdGF0dXNUZXh0KTtcclxuICAgIH1cclxuICAgIGVycm9yLnJlc3BvbnNlID0gcmVzcG9uc2U7XHJcbiAgICBlcnJvci5kYXRhID0gZGF0YTtcclxuICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlamVjdChlcnJvcik7XHJcbiAgfVxyXG5cclxuICBwcm90ZWN0ZWQgaGFuZGxlRmV0Y2hFcnJvcihlOiBhbnkpOiBQcm9taXNlPGFueT4ge1xyXG4gICAgbGV0IGVycm9yID0gbmV3IE5ldHdvcmtFcnJvcihlKTtcclxuICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlamVjdChlcnJvcik7XHJcbiAgfVxyXG5cclxuICByZXNwb25zZUhhc0NvbnRlbnQocmVzcG9uc2U6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgbGV0IGNvbnRlbnRUeXBlID0gcmVzcG9uc2UuaGVhZGVycy5nZXQoJ0NvbnRlbnQtVHlwZScpO1xyXG4gICAgcmV0dXJuIGNvbnRlbnRUeXBlICYmIGNvbnRlbnRUeXBlLmluZGV4T2YoJ2FwcGxpY2F0aW9uL3ZuZC5hcGkranNvbicpID4gLTE7XHJcbiAgfVxyXG5cclxuICByZXNvdXJjZU5hbWVzcGFjZSh0eXBlPzogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLm5hbWVzcGFjZTtcclxuICB9XHJcblxyXG4gIHJlc291cmNlSG9zdCh0eXBlPzogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLmhvc3Q7XHJcbiAgfVxyXG5cclxuICByZXNvdXJjZVBhdGgodHlwZTogc3RyaW5nLCBpZD86IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICBsZXQgcGF0aCA9IFt0aGlzLnNlcmlhbGl6ZXIucmVzb3VyY2VUeXBlKHR5cGUpXTtcclxuICAgIGlmIChpZCkge1xyXG4gICAgICBsZXQgcmVzb3VyY2VJZCA9IHRoaXMuc2VyaWFsaXplci5yZXNvdXJjZUlkKHR5cGUsIGlkKTtcclxuICAgICAgaWYgKHJlc291cmNlSWQpIHtcclxuICAgICAgICBwYXRoLnB1c2gocmVzb3VyY2VJZCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBwYXRoLmpvaW4oJy8nKTtcclxuICB9XHJcblxyXG4gIHJlc291cmNlVVJMKHR5cGU6IHN0cmluZywgaWQ/OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgbGV0IGhvc3QgPSB0aGlzLnJlc291cmNlSG9zdCh0eXBlKTtcclxuICAgIGxldCBuYW1lc3BhY2UgPSB0aGlzLnJlc291cmNlTmFtZXNwYWNlKHR5cGUpO1xyXG4gICAgbGV0IHVybDogc3RyaW5nW10gPSBbXTtcclxuXHJcbiAgICBpZiAoaG9zdCkgeyB1cmwucHVzaChob3N0KTsgfVxyXG4gICAgaWYgKG5hbWVzcGFjZSkgeyB1cmwucHVzaChuYW1lc3BhY2UpOyB9XHJcbiAgICB1cmwucHVzaCh0aGlzLnJlc291cmNlUGF0aCh0eXBlLCBpZCkpO1xyXG5cclxuICAgIGlmICghaG9zdCkgeyB1cmwudW5zaGlmdCgnJyk7IH1cclxuXHJcbiAgICByZXR1cm4gdXJsLmpvaW4oJy8nKTtcclxuICB9XHJcblxyXG4gIHJlc291cmNlUmVsYXRpb25zaGlwVVJMKHR5cGU6IHN0cmluZywgaWQ6IHN0cmluZywgcmVsYXRpb25zaGlwOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMucmVzb3VyY2VVUkwodHlwZSwgaWQpICtcclxuICAgICAgICAgICAnL3JlbGF0aW9uc2hpcHMvJyArIHRoaXMuc2VyaWFsaXplci5yZXNvdXJjZVJlbGF0aW9uc2hpcCh0eXBlLCByZWxhdGlvbnNoaXApO1xyXG4gIH1cclxuXHJcbiAgcmVsYXRlZFJlc291cmNlVVJMKHR5cGU6IHN0cmluZywgaWQ6IHN0cmluZywgcmVsYXRpb25zaGlwOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMucmVzb3VyY2VVUkwodHlwZSwgaWQpICtcclxuICAgICAgICAgICAnLycgKyB0aGlzLnNlcmlhbGl6ZXIucmVzb3VyY2VSZWxhdGlvbnNoaXAodHlwZSwgcmVsYXRpb25zaGlwKTtcclxuICB9XHJcblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgLy8gUHJpdmF0ZSBtZXRob2RzXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgcHJvdGVjdGVkIF9wcm9jZXNzUmVxdWVzdHMocmVxdWVzdHMsIHByb2Nlc3NvcnMpOiBQcm9taXNlPFRyYW5zZm9ybVtdPiB7XHJcbiAgICBsZXQgdHJhbnNmb3JtczogVHJhbnNmb3JtW10gPSBbXTtcclxuICAgIGxldCByZXN1bHQ6IFByb21pc2U8dm9pZD4gPSBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKTtcclxuXHJcbiAgICByZXF1ZXN0cy5mb3JFYWNoKHJlcXVlc3QgPT4ge1xyXG4gICAgICBsZXQgcHJvY2Vzc29yID0gcHJvY2Vzc29yc1tyZXF1ZXN0Lm9wXTtcclxuXHJcbiAgICAgIHJlc3VsdCA9IHJlc3VsdC50aGVuKCgpID0+IHtcclxuICAgICAgICByZXR1cm4gcHJvY2Vzc29yKHRoaXMsIHJlcXVlc3QpXHJcbiAgICAgICAgICAudGhlbihhZGRpdGlvbmFsVHJhbnNmb3JtcyA9PiB7XHJcbiAgICAgICAgICAgIGlmIChhZGRpdGlvbmFsVHJhbnNmb3Jtcykge1xyXG4gICAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KHRyYW5zZm9ybXMsIGFkZGl0aW9uYWxUcmFuc2Zvcm1zKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdC50aGVuKCgpID0+IHRyYW5zZm9ybXMpO1xyXG4gIH1cclxufVxyXG4iXX0=