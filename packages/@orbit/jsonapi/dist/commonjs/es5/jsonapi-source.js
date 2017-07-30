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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbmFwaS1zb3VyY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzcmMvanNvbmFwaS1zb3VyY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsQUFBZ0M7QUFDaEMscUJBZXFCO0FBRXJCLHNCQUFzQztBQUN0QyxtQ0FBb0Y7QUFDcEYsNkJBQXVEO0FBQ3ZELCtCQUFtRTtBQUNuRSxtQ0FBNEY7QUFDNUYsMkJBQXlEO0FBRXpELEFBQUUsQUFBQyxJQUFDLE9BQU8sT0FBSyxRQUFDLEFBQU8sUUFBQyxBQUFLLFVBQUssQUFBVyxlQUFJLE9BQUssUUFBQyxBQUFLLFVBQUssQUFBUyxBQUFDLFdBQUMsQUFBQyxBQUM1RTtXQUFLLFFBQUMsQUFBSyxRQUFHLE9BQUssUUFBQyxBQUFPLFFBQUMsQUFBSyxBQUFDLEFBQ3BDLEFBQUM7O0FBb0JELEFBYUc7Ozs7Ozs7Ozs7Ozs7O0FBR0gsc0NBQTJDOzZCQUFNLEFBYy9DOzJCQUFZLEFBQW9DLFVBQXBDO2lDQUFBO3VCQUFvQztBQUFoRDtvQkFrQkMsQUFqQkM7Z0JBQU0sT0FBQyxBQUF1Rix5RkFBRSxDQUFDLENBQUMsQUFBUSxTQUFDLEFBQU0sQUFBQyxBQUFDLEFBQ25IO2dCQUFNLE9BQUMsQUFBaUQsbURBQUUsT0FBSyxRQUFDLEFBQU8sQUFBQyxBQUFDLEFBQ3pFO2dCQUFNLE9BQUMsQUFBK0MsaURBQUUsT0FBSyxRQUFDLEFBQUssQUFBQyxBQUFDLEFBRXJFLEFBQVE7aUJBQUMsQUFBSSxPQUFHLEFBQVEsU0FBQyxBQUFJLFFBQUksQUFBUyxBQUFDLEFBRTNDO2dCQUFBLGtCQUFNLEFBQVEsQUFBQyxhQUFDLEFBRWhCLEFBQUk7Y0FBQyxBQUFTLFlBQWEsQUFBUSxTQUFDLEFBQVMsQUFBQyxBQUM5QyxBQUFJO2NBQUMsQUFBSSxPQUFrQixBQUFRLFNBQUMsQUFBSSxBQUFDLEFBQ3pDLEFBQUk7Y0FBQyxBQUFtQixzQkFBRyxBQUFRLFNBQUMsQUFBbUIsdUJBQUksRUFBRSxBQUFNLFFBQUUsQUFBMEIsQUFBRSxBQUFDLEFBQ2xHLEFBQUk7Y0FBQyxBQUFtQixzQkFBRyxBQUFRLFNBQUMsQUFBbUIsdUJBQUksQUFBSSxBQUFDLEFBRWhFLEFBQUk7Y0FBQyxBQUF1QiwwQkFBRyxBQUFRLFNBQUMsQUFBdUIsQUFBQyxBQUVoRTtZQUFNLEFBQWUsa0JBQUcsQUFBUSxTQUFDLEFBQWUsbUJBQUkscUJBQWlCLEFBQUMsQUFDdEUsQUFBSTtjQUFDLEFBQVUsYUFBUyxJQUFJLEFBQWUsZ0JBQUMsRUFBRSxBQUFNLFFBQUUsQUFBUSxTQUFDLEFBQU0sUUFBRSxBQUFNLFFBQUUsQUFBUSxTQUFDLEFBQU0sQUFBRSxBQUFDLEFBQUM7ZUFDcEcsQUFBQztBQUVELEFBQTZFO0FBQzdFLEFBQW9DO0FBQ3BDLEFBQTZFO0FBRTdFOzRCQUFLLFFBQUwsVUFBTSxBQUFvQixXQUExQjtvQkFpQkMsQUFoQkM7WUFBTSxBQUFRLFdBQUcscUJBQW9CLHFCQUFDLEFBQUksTUFBRSxBQUFTLEFBQUMsQUFBQyxBQUV2RCxBQUFFLEFBQUM7WUFBQyxBQUFJLEtBQUMsQUFBdUIsMkJBQUksQUFBUSxTQUFDLEFBQU0sU0FBRyxBQUFJLEtBQUMsQUFBdUIsQUFBQyx5QkFBQyxBQUFDLEFBQ25GLEFBQU07MEJBQU0sUUFBQyxBQUFPLFFBQUMsQUFBTyxBQUFFLFVBQzNCLEFBQUksS0FBQyxZQUNKO3NCQUFNLElBQUksT0FBbUIsb0JBQzNCLDZCQUEyQixBQUFRLFNBQUMsQUFBTSw4REFBbUQsQUFBSSxNQUFDLEFBQXVCLDBCQUEwQiw0QkFDbkosQUFBUyxBQUFDLEFBQUMsQUFDZixBQUFDLEFBQUMsQUFBQyxBQUNQO0FBTlMsQUFNUjtBQUVELEFBQU07b0JBQU0sQUFBZ0IsaUJBQUMsQUFBUSxVQUFFLHFCQUEwQixBQUFDLDRCQUMvRCxBQUFJLEtBQUMsVUFBQSxBQUFVLFlBQ2QsQUFBVTt1QkFBQyxBQUFPLFFBQUMsQUFBUyxBQUFDLEFBQUMsQUFDOUIsQUFBTTttQkFBQyxBQUFVLEFBQUMsQUFDcEIsQUFBQyxBQUFDLEFBQUMsQUFDUDtBQUxTLEFBQUksQUFLWjtBQUVELEFBQTZFO0FBQzdFLEFBQW9DO0FBQ3BDLEFBQTZFO0FBRTdFOzRCQUFLLFFBQUwsVUFBTSxBQUFZLE9BQ2hCO1lBQU0sQUFBUSxXQUFpQixpQkFBYSxjQUFDLEFBQUssTUFBQyxBQUFVLFdBQUMsQUFBRSxBQUFDLEFBQUMsQUFDbEUsQUFBRSxBQUFDO1lBQUMsQ0FBQyxBQUFRLEFBQUMsVUFBQyxBQUFDLEFBQ2Q7a0JBQU0sSUFBSSxBQUFLLE1BQUMsQUFBbUYsQUFBQyxBQUFDLEFBQ3ZHLEFBQUM7QUFDRCxBQUFNO2VBQUMsQUFBUSxTQUFDLEFBQUksTUFBRSxBQUFLLEFBQUMsQUFBQyxBQUMvQixBQUFDO0FBRUQsQUFBNkU7QUFDN0UsQUFBMEQ7QUFDMUQsQUFBNkU7QUFFN0U7NEJBQUssUUFBTCxVQUFNLEFBQVcsS0FBRSxBQUE0QixVQUEvQztvQkFvRUMsQUFwRWtCO2lDQUFBO3VCQUE0QjtBQUM3QyxBQUFRO2lCQUFDLEFBQU8sVUFBRyxBQUFRLFNBQUMsQUFBTyxXQUFJLEFBQUksS0FBQyxBQUFtQixBQUFDLEFBRWhFO1lBQUksQUFBTyxVQUFHLEFBQVEsU0FBQyxBQUFPLEFBQUMsQUFDL0I7WUFBSSxBQUFNLFNBQUcsQUFBUSxTQUFDLEFBQU0sVUFBSSxBQUFLLEFBQUMsQUFFdEMsQUFBbUU7QUFFbkU7WUFBSSxBQUFPLFVBQUcsQUFBUSxTQUFDLEFBQU8sV0FBSSxBQUFJLEtBQUMsQUFBbUIsQUFBQyxBQUMzRCxBQUFFLEFBQUM7WUFBQyxBQUFRLFNBQUMsQUFBTyxBQUFDLFNBQUMsQUFBQyxBQUNyQjttQkFBTyxBQUFRLFNBQUMsQUFBTyxBQUFDLEFBQzFCLEFBQUM7QUFFRCxBQUFFLEFBQUM7WUFBQyxBQUFRLFNBQUMsQUFBSSxBQUFDLE1BQUMsQUFBQyxBQUNsQjtvQkFBTSxPQUFDLEFBQTBELDREQUFFLENBQUMsQUFBUSxTQUFDLEFBQUksQUFBQyxBQUFDLEFBQ25GLEFBQVE7cUJBQUMsQUFBSSxPQUFHLEFBQUksS0FBQyxBQUFTLFVBQUMsQUFBUSxTQUFDLEFBQUksQUFBQyxBQUFDLEFBQzlDO21CQUFPLEFBQVEsU0FBQyxBQUFJLEFBQUMsQUFDdkIsQUFBQztBQUVELEFBQUUsQUFBQztZQUFDLEFBQVEsU0FBQyxBQUFJLFFBQUksQUFBTSxXQUFLLEFBQUssQUFBQyxPQUFDLEFBQUMsQUFDdEMsQUFBTztvQkFBQyxBQUFjLEFBQUMsa0JBQUcsQUFBTyxRQUFDLEFBQWMsQUFBQyxtQkFBSSxBQUF5QyxBQUFDLEFBQ2pHLEFBQUM7QUFFRCxBQUFFLEFBQUM7WUFBQyxBQUFRLFNBQUMsQUFBTSxBQUFDLFFBQUMsQUFBQyxBQUNwQixBQUFFLEFBQUM7Z0JBQUMsQUFBRyxJQUFDLEFBQU8sUUFBQyxBQUFHLEFBQUMsU0FBSyxDQUFDLEFBQUMsQUFBQyxHQUFDLEFBQUMsQUFDNUIsQUFBRzt1QkFBSSxBQUFHLEFBQUMsQUFDYixBQUFDLEFBQUMsQUFBSTttQkFBQyxBQUFDLEFBQ04sQUFBRzt1QkFBSSxBQUFHLEFBQUMsQUFDYixBQUFDO0FBQ0QsQUFBRzttQkFBSSxlQUFpQixrQkFBQyxBQUFRLFNBQUMsQUFBTSxBQUFDLEFBQUMsQUFFMUM7bUJBQU8sQUFBUSxTQUFDLEFBQU0sQUFBQyxBQUN6QixBQUFDO0FBRUQsQUFBRSxBQUFDO1lBQUMsQUFBTyxBQUFDLFNBQUMsQUFBQyxBQUNaLEFBQU07dUJBQUssT0FBSyxRQUFDLEFBQU8sUUFBQyxVQUFDLEFBQU8sU0FBRSxBQUFNLFFBQ3ZDO29CQUFJLEFBQVEsQUFBQyxBQUViO29CQUFJLEFBQUssZUFBUSxRQUFDLEFBQU8sUUFBQyxBQUFVLFdBQUMsWUFDbkMsQUFBUTsrQkFBRyxBQUFJLEFBQUMsQUFDaEIsQUFBTTsyQkFBQyxJQUFJLE9BQVksYUFBQyw4QkFBNEIsQUFBTyxVQUFLLEFBQUMsQUFBQyxBQUFDLEFBQ3JFLEFBQUM7QUFIVyxtQkFHVCxBQUFPLEFBQUMsQUFBQyxBQUVaO3VCQUFLLFFBQUMsQUFBSyxNQUFDLEFBQUcsS0FBRSxBQUFRLEFBQUMsVUFDdkIsQUFBSyxNQUFDLFVBQUEsQUFBQyxHQUNOOzJCQUFLLFFBQUMsQUFBTyxRQUFDLEFBQVksYUFBQyxBQUFLLEFBQUMsQUFBQyxBQUVsQyxBQUFFLEFBQUM7d0JBQUMsQ0FBQyxBQUFRLEFBQUMsVUFBQyxBQUFDLEFBQ2QsQUFBTTtxQ0FBTSxBQUFnQixpQkFBQyxBQUFDLEFBQUMsR0FDNUIsQUFBSSxLQUFDLFVBQUEsQUFBUSxVQUFJO21DQUFBLEFBQU8sUUFBUCxBQUFRLEFBQVEsQUFBQyxBQUFDO0FBRC9CLEFBQUksMkJBRVIsQUFBSyxNQUFDLFVBQUEsQUFBQyxHQUFJO21DQUFBLEFBQU0sT0FBTixBQUFPLEFBQUMsQUFBQyxBQUFDLEFBQUMsQUFDM0I7QUFBQyxBQUNIO0FBQUMsQUFBQzttQkFDRCxBQUFJLEtBQUMsVUFBQSxBQUFRLFVBQ1o7MkJBQUssUUFBQyxBQUFPLFFBQUMsQUFBWSxhQUFDLEFBQUssQUFBQyxBQUFDLEFBRWxDLEFBQUUsQUFBQzt3QkFBQyxDQUFDLEFBQVEsQUFBQyxVQUFDLEFBQUMsQUFDZCxBQUFNO3FDQUFNLEFBQW1CLG9CQUFDLEFBQVEsQUFBQyxVQUN0QyxBQUFJLEtBQUMsVUFBQSxBQUFRLFVBQUk7bUNBQUEsQUFBTyxRQUFQLEFBQVEsQUFBUSxBQUFDLEFBQUM7QUFEL0IsQUFBSSwyQkFFUixBQUFLLE1BQUMsVUFBQSxBQUFDLEdBQUk7bUNBQUEsQUFBTSxPQUFOLEFBQU8sQUFBQyxBQUFDLEFBQUMsQUFBQyxBQUMzQjtBQUFDLEFBQ0g7QUFBQyxBQUFDLEFBQUMsQUFDUDtBQUFDLEFBQUMsQUFBQyxBQUNMO0FBNUJTLEFBNEJSLEFBQUMsQUFBSTtlQUFDLEFBQUMsQUFDTixBQUFNOzBCQUFNLFFBQUMsQUFBSyxNQUFDLEFBQUcsS0FBRSxBQUFRLEFBQUMsVUFDOUIsQUFBSyxNQUFDLFVBQUEsQUFBQyxHQUFJO3VCQUFBLEFBQUksTUFBQyxBQUFnQixpQkFBckIsQUFBc0IsQUFBQyxBQUFDLEFBQUM7QUFEaEMsZUFFSixBQUFJLEtBQUMsVUFBQSxBQUFRLFVBQUk7dUJBQUEsQUFBSSxNQUFDLEFBQW1CLG9CQUF4QixBQUF5QixBQUFRLEFBQUMsQUFBQyxBQUFDLEFBQzFEO0FBQUMsQUFDSDtBQUFDO0FBRVM7NEJBQW1CLHNCQUE3QixVQUE4QixBQUFhLFVBQTNDO29CQW9CQyxBQW5CQyxBQUFFLEFBQUM7WUFBQyxBQUFRLFNBQUMsQUFBTSxXQUFLLEFBQUcsQUFBQyxLQUFDLEFBQUMsQUFDNUIsQUFBRSxBQUFDO2dCQUFDLEFBQUksS0FBQyxBQUFrQixtQkFBQyxBQUFRLEFBQUMsQUFBQyxXQUFDLEFBQUMsQUFDdEMsQUFBTTt1QkFBQyxBQUFRLFNBQUMsQUFBSSxBQUFFLEFBQUMsQUFDekIsQUFBQyxBQUFDLEFBQUk7bUJBQUMsQUFBQyxBQUNOO3NCQUFNLElBQUksYUFBcUIsc0JBQUMsNkJBQTJCLEFBQVEsU0FBQyxBQUFNLFNBQTZGLEFBQUMsQUFBQyxBQUMzSyxBQUFDLEFBQ0g7QUFBQyxBQUFDLEFBQUk7bUJBQUssQUFBUSxTQUFDLEFBQU0sVUFBSSxBQUFHLE9BQUksQUFBUSxTQUFDLEFBQU0sU0FBRyxBQUFHLEFBQUMsS0FBQyxBQUFDLEFBQzNELEFBQUUsQUFBQztnQkFBQyxBQUFJLEtBQUMsQUFBa0IsbUJBQUMsQUFBUSxBQUFDLEFBQUMsV0FBQyxBQUFDLEFBQ3RDLEFBQU07dUJBQUMsQUFBUSxTQUFDLEFBQUksQUFBRSxBQUFDLEFBQ3pCLEFBQUMsQUFDSDtBQUFDLEFBQUMsQUFBSTtBQUpDLEFBQUUsQUFBQyxlQUlILEFBQUMsQUFDTixBQUFFLEFBQUM7Z0JBQUMsQUFBSSxLQUFDLEFBQWtCLG1CQUFDLEFBQVEsQUFBQyxBQUFDLFdBQUMsQUFBQyxBQUN0QyxBQUFNO2dDQUFVLEFBQUksQUFBRSxPQUNuQixBQUFJLEtBQUMsVUFBQSxBQUFJLE1BQUk7MkJBQUEsQUFBSSxNQUFDLEFBQXdCLHlCQUFDLEFBQVEsVUFBdEMsQUFBd0MsQUFBSSxBQUFDLEFBQUMsQUFBQyxBQUNqRTtBQUZTLEFBQVEsQUFFaEIsQUFBQyxBQUFJO21CQUFDLEFBQUMsQUFDTixBQUFNO3VCQUFDLEFBQUksS0FBQyxBQUF3Qix5QkFBQyxBQUFRLEFBQUMsQUFBQyxBQUNqRCxBQUFDLEFBQ0g7QUFBQztBQUNELEFBQU07ZUFBQyxPQUFLLFFBQUMsQUFBTyxRQUFDLEFBQU8sQUFBRSxBQUFDLEFBQ2pDLEFBQUM7QUFFUzs0QkFBd0IsMkJBQWxDLFVBQW1DLEFBQWEsVUFBRSxBQUFVLE1BQzFEO1lBQUksQUFBSyxBQUFDLEFBQ1YsQUFBRSxBQUFDO1lBQUMsQUFBUSxTQUFDLEFBQU0sVUFBSSxBQUFHLE9BQUksQUFBUSxTQUFDLEFBQU0sU0FBRyxBQUFHLEFBQUMsS0FBQyxBQUFDLEFBQ3BELEFBQUs7b0JBQUcsSUFBSSxPQUFXLFlBQUMsQUFBUSxTQUFDLEFBQVUsQUFBQyxBQUFDLEFBQy9DLEFBQUMsQUFBQyxBQUFJO2VBQUMsQUFBQyxBQUNOLEFBQUs7b0JBQUcsSUFBSSxPQUFXLFlBQUMsQUFBUSxTQUFDLEFBQVUsQUFBQyxBQUFDLEFBQy9DLEFBQUM7QUFDRCxBQUFLO2NBQUMsQUFBUSxXQUFHLEFBQVEsQUFBQyxBQUMxQixBQUFLO2NBQUMsQUFBSSxPQUFHLEFBQUksQUFBQyxBQUNsQixBQUFNO2VBQUMsT0FBSyxRQUFDLEFBQU8sUUFBQyxBQUFNLE9BQUMsQUFBSyxBQUFDLEFBQUMsQUFDckMsQUFBQztBQUVTOzRCQUFnQixtQkFBMUIsVUFBMkIsQUFBTSxHQUMvQjtZQUFJLEFBQUssUUFBRyxJQUFJLE9BQVksYUFBQyxBQUFDLEFBQUMsQUFBQyxBQUNoQyxBQUFNO2VBQUMsT0FBSyxRQUFDLEFBQU8sUUFBQyxBQUFNLE9BQUMsQUFBSyxBQUFDLEFBQUMsQUFDckMsQUFBQztBQUVEOzRCQUFrQixxQkFBbEIsVUFBbUIsQUFBYSxVQUM5QjtZQUFJLEFBQVcsY0FBRyxBQUFRLFNBQUMsQUFBTyxRQUFDLEFBQUcsSUFBQyxBQUFjLEFBQUMsQUFBQyxBQUN2RCxBQUFNO2VBQUMsQUFBVyxlQUFJLEFBQVcsWUFBQyxBQUFPLFFBQUMsQUFBMEIsQUFBQyw4QkFBRyxDQUFDLEFBQUMsQUFBQyxBQUM3RSxBQUFDO0FBRUQ7NEJBQWlCLG9CQUFqQixVQUFrQixBQUFhLE1BQzdCLEFBQU07ZUFBQyxBQUFJLEtBQUMsQUFBUyxBQUFDLEFBQ3hCLEFBQUM7QUFFRDs0QkFBWSxlQUFaLFVBQWEsQUFBYSxNQUN4QixBQUFNO2VBQUMsQUFBSSxLQUFDLEFBQUksQUFBQyxBQUNuQixBQUFDO0FBRUQ7NEJBQVksZUFBWixVQUFhLEFBQVksTUFBRSxBQUFXLElBQ3BDO1lBQUksQUFBSSxPQUFHLENBQUMsQUFBSSxLQUFDLEFBQVUsV0FBQyxBQUFZLGFBQUMsQUFBSSxBQUFDLEFBQUMsQUFBQyxBQUNoRCxBQUFFLEFBQUM7WUFBQyxBQUFFLEFBQUMsSUFBQyxBQUFDLEFBQ1A7Z0JBQUksQUFBVSxhQUFHLEFBQUksS0FBQyxBQUFVLFdBQUMsQUFBVSxXQUFDLEFBQUksTUFBRSxBQUFFLEFBQUMsQUFBQyxBQUN0RCxBQUFFLEFBQUM7Z0JBQUMsQUFBVSxBQUFDLFlBQUMsQUFBQyxBQUNmLEFBQUk7cUJBQUMsQUFBSSxLQUFDLEFBQVUsQUFBQyxBQUFDLEFBQ3hCLEFBQUMsQUFDSDtBQUFDO0FBQ0QsQUFBTTtlQUFDLEFBQUksS0FBQyxBQUFJLEtBQUMsQUFBRyxBQUFDLEFBQUMsQUFDeEIsQUFBQztBQUVEOzRCQUFXLGNBQVgsVUFBWSxBQUFZLE1BQUUsQUFBVyxJQUNuQztZQUFJLEFBQUksT0FBRyxBQUFJLEtBQUMsQUFBWSxhQUFDLEFBQUksQUFBQyxBQUFDLEFBQ25DO1lBQUksQUFBUyxZQUFHLEFBQUksS0FBQyxBQUFpQixrQkFBQyxBQUFJLEFBQUMsQUFBQyxBQUM3QztZQUFJLEFBQUcsTUFBYSxBQUFFLEFBQUMsQUFFdkIsQUFBRSxBQUFDO1lBQUMsQUFBSSxBQUFDLE1BQUMsQUFBQyxBQUFDLEFBQUc7Z0JBQUMsQUFBSSxLQUFDLEFBQUksQUFBQyxBQUFDLEFBQUMsQUFBQztBQUM3QixBQUFFLEFBQUM7WUFBQyxBQUFTLEFBQUMsV0FBQyxBQUFDLEFBQUMsQUFBRztnQkFBQyxBQUFJLEtBQUMsQUFBUyxBQUFDLEFBQUMsQUFBQyxBQUFDO0FBQ3ZDLEFBQUc7WUFBQyxBQUFJLEtBQUMsQUFBSSxLQUFDLEFBQVksYUFBQyxBQUFJLE1BQUUsQUFBRSxBQUFDLEFBQUMsQUFBQyxBQUV0QyxBQUFFLEFBQUM7WUFBQyxDQUFDLEFBQUksQUFBQyxNQUFDLEFBQUMsQUFBQyxBQUFHO2dCQUFDLEFBQU8sUUFBQyxBQUFFLEFBQUMsQUFBQyxBQUFDLEFBQUM7QUFFL0IsQUFBTTtlQUFDLEFBQUcsSUFBQyxBQUFJLEtBQUMsQUFBRyxBQUFDLEFBQUMsQUFDdkIsQUFBQztBQUVEOzRCQUF1QiwwQkFBdkIsVUFBd0IsQUFBWSxNQUFFLEFBQVUsSUFBRSxBQUFvQixjQUNwRSxBQUFNO2VBQUMsQUFBSSxLQUFDLEFBQVcsWUFBQyxBQUFJLE1BQUUsQUFBRSxBQUFDLE1BQzFCLEFBQWlCLG9CQUFHLEFBQUksS0FBQyxBQUFVLFdBQUMsQUFBb0IscUJBQUMsQUFBSSxNQUFFLEFBQVksQUFBQyxBQUFDLEFBQ3RGLEFBQUM7QUFFRDs0QkFBa0IscUJBQWxCLFVBQW1CLEFBQVksTUFBRSxBQUFVLElBQUUsQUFBb0IsY0FDL0QsQUFBTTtlQUFDLEFBQUksS0FBQyxBQUFXLFlBQUMsQUFBSSxNQUFFLEFBQUUsQUFBQyxNQUMxQixBQUFHLE1BQUcsQUFBSSxLQUFDLEFBQVUsV0FBQyxBQUFvQixxQkFBQyxBQUFJLE1BQUUsQUFBWSxBQUFDLEFBQUMsQUFDeEUsQUFBQztBQUVELEFBQTZFO0FBQzdFLEFBQWtCO0FBQ2xCLEFBQTZFO0FBRW5FOzRCQUFnQixtQkFBMUIsVUFBMkIsQUFBUSxVQUFFLEFBQVUsWUFBL0M7b0JBa0JDLEFBakJDO1lBQUksQUFBVSxhQUFnQixBQUFFLEFBQUMsQUFDakM7WUFBSSxBQUFNLFNBQWtCLE9BQUssUUFBQyxBQUFPLFFBQUMsQUFBTyxBQUFFLEFBQUMsQUFFcEQsQUFBUTtpQkFBQyxBQUFPLFFBQUMsVUFBQSxBQUFPLFNBQ3RCO2dCQUFJLEFBQVMsWUFBRyxBQUFVLFdBQUMsQUFBTyxRQUFDLEFBQUUsQUFBQyxBQUFDLEFBRXZDLEFBQU07NEJBQVUsQUFBSSxLQUFDLFlBQ25CLEFBQU07aUNBQVcsQUFBSSxPQUFFLEFBQU8sQUFBQyxTQUM1QixBQUFJLEtBQUMsVUFBQSxBQUFvQixzQkFDeEIsQUFBRSxBQUFDO3dCQUFDLEFBQW9CLEFBQUMsc0JBQUMsQUFBQyxBQUN6QixBQUFLOzhCQUFDLEFBQVMsVUFBQyxBQUFJLEtBQUMsQUFBSyxNQUFDLEFBQVUsWUFBRSxBQUFvQixBQUFDLEFBQUMsQUFDL0QsQUFBQyxBQUNIO0FBQUMsQUFBQyxBQUFDLEFBQ1A7QUFOUyxBQUFTLEFBTWpCLEFBQUMsQUFBQyxBQUNMO0FBUlcsQUFBTSxBQVFoQixBQUFDLEFBQUM7QUFFSCxBQUFNO3NCQUFRLEFBQUksS0FBQyxZQUFNO21CQUFBLEFBQVUsQUFBQyxBQUFDLEFBQ3ZDO0FBRFMsQUFBTSxBQUNkO0FBNVBrQixBQUFhO2dDQUZqQyxPQUFRLFVBQ1IsT0FBUSxXQUNZLEFBQWEsQUE2UGpDLEFBQUQ7V0FBQyxBQTdQRCxBQTZQQztFQTdQMEMsT0FBTSxBQTZQaEQ7a0JBN1BvQixBQUFhIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgdmFsaWQtanNkb2MgKi9cclxuaW1wb3J0IE9yYml0LCB7XHJcbiAgS2V5TWFwLFxyXG4gIFJlY29yZE9wZXJhdGlvbixcclxuICBTY2hlbWEsXHJcbiAgU291cmNlLCBTb3VyY2VTZXR0aW5ncyxcclxuICBRdWVyeSwgUXVlcnlPckV4cHJlc3Npb24sXHJcbiAgUHVsbGFibGUsIHB1bGxhYmxlLFxyXG4gIFB1c2hhYmxlLCBwdXNoYWJsZSxcclxuICBUcmFuc2Zvcm0sXHJcbiAgVHJhbnNmb3JtT3JPcGVyYXRpb25zLFxyXG4gIGNvYWxlc2NlUmVjb3JkT3BlcmF0aW9ucyxcclxuICBRdWVyeU5vdEFsbG93ZWQsIFRyYW5zZm9ybU5vdEFsbG93ZWQsXHJcbiAgQ2xpZW50RXJyb3IsXHJcbiAgU2VydmVyRXJyb3IsXHJcbiAgTmV0d29ya0Vycm9yXHJcbn0gZnJvbSAnQG9yYml0L2RhdGEnO1xyXG5pbXBvcnQgeyBMb2cgfSBmcm9tICdAb3JiaXQvY29yZSc7XHJcbmltcG9ydCB7IGFzc2VydCB9IGZyb20gJ0BvcmJpdC91dGlscyc7XHJcbmltcG9ydCBKU09OQVBJU2VyaWFsaXplciwgeyBKU09OQVBJU2VyaWFsaXplclNldHRpbmdzIH0gZnJvbSAnLi9qc29uYXBpLXNlcmlhbGl6ZXInO1xyXG5pbXBvcnQgeyBlbmNvZGVRdWVyeVBhcmFtcyB9IGZyb20gJy4vbGliL3F1ZXJ5LXBhcmFtcyc7XHJcbmltcG9ydCB7IFB1bGxPcGVyYXRvciwgUHVsbE9wZXJhdG9ycyB9IGZyb20gJy4vbGliL3B1bGwtb3BlcmF0b3JzJztcclxuaW1wb3J0IHsgZ2V0VHJhbnNmb3JtUmVxdWVzdHMsIFRyYW5zZm9ybVJlcXVlc3RQcm9jZXNzb3JzIH0gZnJvbSAnLi9saWIvdHJhbnNmb3JtLXJlcXVlc3RzJztcclxuaW1wb3J0IHsgSW52YWxpZFNlcnZlclJlc3BvbnNlIH0gZnJvbSAnLi9saWIvZXhjZXB0aW9ucyc7XHJcblxyXG5pZiAodHlwZW9mIE9yYml0Lmdsb2JhbHMuZmV0Y2ggIT09ICd1bmRlZmluZWQnICYmIE9yYml0LmZldGNoID09PSB1bmRlZmluZWQpIHtcclxuICBPcmJpdC5mZXRjaCA9IE9yYml0Lmdsb2JhbHMuZmV0Y2g7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgRmV0Y2hTZXR0aW5ncyB7XHJcbiAgaGVhZGVycz86IG9iamVjdDtcclxuICBtZXRob2Q/OiBzdHJpbmc7XHJcbiAganNvbj86IG9iamVjdDtcclxuICBib2R5Pzogc3RyaW5nO1xyXG4gIHBhcmFtcz86IGFueTtcclxuICB0aW1lb3V0PzogbnVtYmVyO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEpTT05BUElTb3VyY2VTZXR0aW5ncyBleHRlbmRzIFNvdXJjZVNldHRpbmdzIHtcclxuICBtYXhSZXF1ZXN0c1BlclRyYW5zZm9ybT86IG51bWJlcjtcclxuICBuYW1lc3BhY2U/OiBzdHJpbmc7XHJcbiAgaG9zdD86IHN0cmluZztcclxuICBkZWZhdWx0RmV0Y2hIZWFkZXJzPzogb2JqZWN0O1xyXG4gIGRlZmF1bHRGZXRjaFRpbWVvdXQ/OiBudW1iZXI7XHJcbiAgU2VyaWFsaXplckNsYXNzPzogKG5ldyAoc2V0dGluZ3M6IEpTT05BUElTZXJpYWxpemVyU2V0dGluZ3MpID0+IEpTT05BUElTZXJpYWxpemVyKTtcclxufVxyXG5cclxuLyoqXHJcbiBTb3VyY2UgZm9yIGFjY2Vzc2luZyBhIEpTT04gQVBJIGNvbXBsaWFudCBSRVNUZnVsIEFQSSB3aXRoIGEgbmV0d29yayBmZXRjaFxyXG4gcmVxdWVzdC5cclxuXHJcbiBJZiBhIHNpbmdsZSB0cmFuc2Zvcm0gb3IgcXVlcnkgcmVxdWlyZXMgbW9yZSB0aGFuIG9uZSBmZXRjaCByZXF1ZXN0LFxyXG4gcmVxdWVzdHMgd2lsbCBiZSBwZXJmb3JtZWQgc2VxdWVudGlhbGx5IGFuZCByZXNvbHZlZCB0b2dldGhlci4gRnJvbSB0aGVcclxuIHBlcnNwZWN0aXZlIG9mIE9yYml0LCB0aGVzZSBvcGVyYXRpb25zIHdpbGwgYWxsIHN1Y2NlZWQgb3IgZmFpbCB0b2dldGhlci4gVGhlXHJcbiBgbWF4UmVxdWVzdHNQZXJUcmFuc2Zvcm1gIGFuZCBgbWF4UmVxdWVzdHNQZXJRdWVyeWAgc2V0dGluZ3MgYWxsb3cgbGltaXRzIHRvIGJlXHJcbiBzZXQgb24gdGhpcyBiZWhhdmlvci4gVGhlc2Ugc2V0dGluZ3Mgc2hvdWxkIGJlIHNldCB0byBgMWAgaWYgeW91ciBjbGllbnQvc2VydmVyXHJcbiBjb25maWd1cmF0aW9uIGlzIHVuYWJsZSB0byByZXNvbHZlIHBhcnRpYWxseSBzdWNjZXNzZnVsIHRyYW5zZm9ybXMgLyBxdWVyaWVzLlxyXG5cclxuIEBjbGFzcyBKU09OQVBJU291cmNlXHJcbiBAZXh0ZW5kcyBTb3VyY2VcclxuICovXHJcbkBwdWxsYWJsZVxyXG5AcHVzaGFibGVcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSlNPTkFQSVNvdXJjZSBleHRlbmRzIFNvdXJjZSBpbXBsZW1lbnRzIFB1bGxhYmxlLCBQdXNoYWJsZSB7XHJcbiAgbWF4UmVxdWVzdHNQZXJUcmFuc2Zvcm06IG51bWJlcjtcclxuICBuYW1lc3BhY2U6IHN0cmluZztcclxuICBob3N0OiBzdHJpbmc7XHJcbiAgZGVmYXVsdEZldGNoSGVhZGVyczogb2JqZWN0O1xyXG4gIGRlZmF1bHRGZXRjaFRpbWVvdXQ6IG51bWJlcjtcclxuICBzZXJpYWxpemVyOiBKU09OQVBJU2VyaWFsaXplcjtcclxuXHJcbiAgLy8gUHVsbGFibGUgaW50ZXJmYWNlIHN0dWJzXHJcbiAgcHVsbDogKHF1ZXJ5T3JFeHByZXNzaW9uOiBRdWVyeU9yRXhwcmVzc2lvbiwgb3B0aW9ucz86IG9iamVjdCwgaWQ/OiBzdHJpbmcpID0+IFByb21pc2U8VHJhbnNmb3JtW10+O1xyXG5cclxuICAvLyBQdXNoYWJsZSBpbnRlcmZhY2Ugc3R1YnNcclxuICBwdXNoOiAodHJhbnNmb3JtT3JPcGVyYXRpb25zOiBUcmFuc2Zvcm1Pck9wZXJhdGlvbnMsIG9wdGlvbnM/OiBvYmplY3QsIGlkPzogc3RyaW5nKSA9PiBQcm9taXNlPFRyYW5zZm9ybVtdPjtcclxuXHJcbiAgY29uc3RydWN0b3Ioc2V0dGluZ3M6IEpTT05BUElTb3VyY2VTZXR0aW5ncyA9IHt9KSB7XHJcbiAgICBhc3NlcnQoJ0pTT05BUElTb3VyY2VcXCdzIGBzY2hlbWFgIG11c3QgYmUgc3BlY2lmaWVkIGluIGBzZXR0aW5ncy5zY2hlbWFgIGNvbnN0cnVjdG9yIGFyZ3VtZW50JywgISFzZXR0aW5ncy5zY2hlbWEpO1xyXG4gICAgYXNzZXJ0KCdKU09OQVBJU291cmNlIHJlcXVpcmVzIE9yYml0LlByb21pc2UgYmUgZGVmaW5lZCcsIE9yYml0LlByb21pc2UpO1xyXG4gICAgYXNzZXJ0KCdKU09OQVBJU291cmNlIHJlcXVpcmVzIE9yYml0LmZldGNoIGJlIGRlZmluZWQnLCBPcmJpdC5mZXRjaCk7XHJcblxyXG4gICAgc2V0dGluZ3MubmFtZSA9IHNldHRpbmdzLm5hbWUgfHwgJ2pzb25hcGknO1xyXG5cclxuICAgIHN1cGVyKHNldHRpbmdzKTtcclxuXHJcbiAgICB0aGlzLm5hbWVzcGFjZSAgICAgICAgICAgPSBzZXR0aW5ncy5uYW1lc3BhY2U7XHJcbiAgICB0aGlzLmhvc3QgICAgICAgICAgICAgICAgPSBzZXR0aW5ncy5ob3N0O1xyXG4gICAgdGhpcy5kZWZhdWx0RmV0Y2hIZWFkZXJzID0gc2V0dGluZ3MuZGVmYXVsdEZldGNoSGVhZGVycyB8fCB7IEFjY2VwdDogJ2FwcGxpY2F0aW9uL3ZuZC5hcGkranNvbicgfTtcclxuICAgIHRoaXMuZGVmYXVsdEZldGNoVGltZW91dCA9IHNldHRpbmdzLmRlZmF1bHRGZXRjaFRpbWVvdXQgfHwgNTAwMDtcclxuXHJcbiAgICB0aGlzLm1heFJlcXVlc3RzUGVyVHJhbnNmb3JtID0gc2V0dGluZ3MubWF4UmVxdWVzdHNQZXJUcmFuc2Zvcm07XHJcblxyXG4gICAgY29uc3QgU2VyaWFsaXplckNsYXNzID0gc2V0dGluZ3MuU2VyaWFsaXplckNsYXNzIHx8IEpTT05BUElTZXJpYWxpemVyO1xyXG4gICAgdGhpcy5zZXJpYWxpemVyICAgICAgID0gbmV3IFNlcmlhbGl6ZXJDbGFzcyh7IHNjaGVtYTogc2V0dGluZ3Muc2NoZW1hLCBrZXlNYXA6IHNldHRpbmdzLmtleU1hcCB9KTtcclxuICB9XHJcblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgLy8gUHVzaGFibGUgaW50ZXJmYWNlIGltcGxlbWVudGF0aW9uXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgX3B1c2godHJhbnNmb3JtOiBUcmFuc2Zvcm0pOiBQcm9taXNlPFRyYW5zZm9ybVtdPiB7XHJcbiAgICBjb25zdCByZXF1ZXN0cyA9IGdldFRyYW5zZm9ybVJlcXVlc3RzKHRoaXMsIHRyYW5zZm9ybSk7XHJcblxyXG4gICAgaWYgKHRoaXMubWF4UmVxdWVzdHNQZXJUcmFuc2Zvcm0gJiYgcmVxdWVzdHMubGVuZ3RoID4gdGhpcy5tYXhSZXF1ZXN0c1BlclRyYW5zZm9ybSkge1xyXG4gICAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKClcclxuICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICB0aHJvdyBuZXcgVHJhbnNmb3JtTm90QWxsb3dlZChcclxuICAgICAgICAgICAgYFRoaXMgdHJhbnNmb3JtIHJlcXVpcmVzICR7cmVxdWVzdHMubGVuZ3RofSByZXF1ZXN0cywgd2hpY2ggZXhjZWVkcyB0aGUgc3BlY2lmaWVkIGxpbWl0IG9mICR7dGhpcy5tYXhSZXF1ZXN0c1BlclRyYW5zZm9ybX0gcmVxdWVzdHMgcGVyIHRyYW5zZm9ybS5gLFxyXG4gICAgICAgICAgICB0cmFuc2Zvcm0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLl9wcm9jZXNzUmVxdWVzdHMocmVxdWVzdHMsIFRyYW5zZm9ybVJlcXVlc3RQcm9jZXNzb3JzKVxyXG4gICAgICAudGhlbih0cmFuc2Zvcm1zID0+IHtcclxuICAgICAgICB0cmFuc2Zvcm1zLnVuc2hpZnQodHJhbnNmb3JtKTtcclxuICAgICAgICByZXR1cm4gdHJhbnNmb3JtcztcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gIC8vIFB1bGxhYmxlIGludGVyZmFjZSBpbXBsZW1lbnRhdGlvblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIF9wdWxsKHF1ZXJ5OiBRdWVyeSk6IFByb21pc2U8VHJhbnNmb3JtW10+IHtcclxuICAgIGNvbnN0IG9wZXJhdG9yOiBQdWxsT3BlcmF0b3IgPSBQdWxsT3BlcmF0b3JzW3F1ZXJ5LmV4cHJlc3Npb24ub3BdO1xyXG4gICAgaWYgKCFvcGVyYXRvcikge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0pTT05BUElTb3VyY2UgZG9lcyBub3Qgc3VwcG9ydCB0aGUgYCR7cXVlcnkuZXhwcmVzc2lvbi5vcH1gIG9wZXJhdG9yIGZvciBxdWVyaWVzLicpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG9wZXJhdG9yKHRoaXMsIHF1ZXJ5KTtcclxuICB9XHJcblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgLy8gUHVibGljbHkgYWNjZXNzaWJsZSBtZXRob2RzIHBhcnRpY3VsYXIgdG8gSlNPTkFQSVNvdXJjZVxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIGZldGNoKHVybDogc3RyaW5nLCBzZXR0aW5nczogRmV0Y2hTZXR0aW5ncyA9IHt9KTogUHJvbWlzZTxhbnk+IHtcclxuICAgIHNldHRpbmdzLmhlYWRlcnMgPSBzZXR0aW5ncy5oZWFkZXJzIHx8IHRoaXMuZGVmYXVsdEZldGNoSGVhZGVycztcclxuXHJcbiAgICBsZXQgaGVhZGVycyA9IHNldHRpbmdzLmhlYWRlcnM7XHJcbiAgICBsZXQgbWV0aG9kID0gc2V0dGluZ3MubWV0aG9kIHx8ICdHRVQnO1xyXG5cclxuICAgIC8vIGNvbnNvbGUubG9nKCdmZXRjaCcsIHVybCwgc2V0dGluZ3MsICdwb2x5ZmlsbCcsIGZldGNoLnBvbHlmaWxsKTtcclxuXHJcbiAgICBsZXQgdGltZW91dCA9IHNldHRpbmdzLnRpbWVvdXQgfHwgdGhpcy5kZWZhdWx0RmV0Y2hUaW1lb3V0O1xyXG4gICAgaWYgKHNldHRpbmdzLnRpbWVvdXQpIHtcclxuICAgICAgZGVsZXRlIHNldHRpbmdzLnRpbWVvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHNldHRpbmdzLmpzb24pIHtcclxuICAgICAgYXNzZXJ0KCdganNvbmAgYW5kIGBib2R5YCBjYW5cXCd0IGJvdGggYmUgc2V0IGZvciBmZXRjaCByZXF1ZXN0cy4nLCAhc2V0dGluZ3MuYm9keSk7XHJcbiAgICAgIHNldHRpbmdzLmJvZHkgPSBKU09OLnN0cmluZ2lmeShzZXR0aW5ncy5qc29uKTtcclxuICAgICAgZGVsZXRlIHNldHRpbmdzLmpzb247XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHNldHRpbmdzLmJvZHkgJiYgbWV0aG9kICE9PSAnR0VUJykge1xyXG4gICAgICBoZWFkZXJzWydDb250ZW50LVR5cGUnXSA9IGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddIHx8ICdhcHBsaWNhdGlvbi92bmQuYXBpK2pzb247IGNoYXJzZXQ9dXRmLTgnO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChzZXR0aW5ncy5wYXJhbXMpIHtcclxuICAgICAgaWYgKHVybC5pbmRleE9mKCc/JykgPT09IC0xKSB7XHJcbiAgICAgICAgdXJsICs9ICc/JztcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB1cmwgKz0gJyYnO1xyXG4gICAgICB9XHJcbiAgICAgIHVybCArPSBlbmNvZGVRdWVyeVBhcmFtcyhzZXR0aW5ncy5wYXJhbXMpO1xyXG5cclxuICAgICAgZGVsZXRlIHNldHRpbmdzLnBhcmFtcztcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGltZW91dCkge1xyXG4gICAgICByZXR1cm4gbmV3IE9yYml0LlByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgIGxldCB0aW1lZE91dDtcclxuXHJcbiAgICAgICAgbGV0IHRpbWVyID0gT3JiaXQuZ2xvYmFscy5zZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgIHRpbWVkT3V0ID0gdHJ1ZTtcclxuICAgICAgICAgIHJlamVjdChuZXcgTmV0d29ya0Vycm9yKGBObyBmZXRjaCByZXNwb25zZSB3aXRoaW4gJHt0aW1lb3V0fW1zLmApKTtcclxuICAgICAgICB9LCB0aW1lb3V0KTtcclxuXHJcbiAgICAgICAgT3JiaXQuZmV0Y2godXJsLCBzZXR0aW5ncylcclxuICAgICAgICAgIC5jYXRjaChlID0+IHtcclxuICAgICAgICAgICAgT3JiaXQuZ2xvYmFscy5jbGVhclRpbWVvdXQodGltZXIpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCF0aW1lZE91dCkge1xyXG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLmhhbmRsZUZldGNoRXJyb3IoZSlcclxuICAgICAgICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHJlc29sdmUocmVzcG9uc2UpKVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGUgPT4gcmVqZWN0KGUpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgT3JiaXQuZ2xvYmFscy5jbGVhclRpbWVvdXQodGltZXIpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCF0aW1lZE91dCkge1xyXG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLmhhbmRsZUZldGNoUmVzcG9uc2UocmVzcG9uc2UpXHJcbiAgICAgICAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiByZXNvbHZlKHJlc3BvbnNlKSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaChlID0+IHJlamVjdChlKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBPcmJpdC5mZXRjaCh1cmwsIHNldHRpbmdzKVxyXG4gICAgICAgIC5jYXRjaChlID0+IHRoaXMuaGFuZGxlRmV0Y2hFcnJvcihlKSlcclxuICAgICAgICAudGhlbihyZXNwb25zZSA9PiB0aGlzLmhhbmRsZUZldGNoUmVzcG9uc2UocmVzcG9uc2UpKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByb3RlY3RlZCBoYW5kbGVGZXRjaFJlc3BvbnNlKHJlc3BvbnNlOiBhbnkpOiBQcm9taXNlPGFueT4ge1xyXG4gICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAxKSB7XHJcbiAgICAgIGlmICh0aGlzLnJlc3BvbnNlSGFzQ29udGVudChyZXNwb25zZSkpIHtcclxuICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRocm93IG5ldyBJbnZhbGlkU2VydmVyUmVzcG9uc2UoYFNlcnZlciByZXNwb25zZXMgd2l0aCBhICR7cmVzcG9uc2Uuc3RhdHVzfSBzdGF0dXMgc2hvdWxkIHJldHVybiBjb250ZW50IHdpdGggYSBDb250ZW50LVR5cGUgdGhhdCBpbmNsdWRlcyAnYXBwbGljYXRpb24vdm5kLmFwaStqc29uJy5gKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChyZXNwb25zZS5zdGF0dXMgPj0gMjAwICYmIHJlc3BvbnNlLnN0YXR1cyA8IDMwMCkge1xyXG4gICAgICBpZiAodGhpcy5yZXNwb25zZUhhc0NvbnRlbnQocmVzcG9uc2UpKSB7XHJcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKHRoaXMucmVzcG9uc2VIYXNDb250ZW50KHJlc3BvbnNlKSkge1xyXG4gICAgICAgIHJldHVybiByZXNwb25zZS5qc29uKClcclxuICAgICAgICAgIC50aGVuKGRhdGEgPT4gdGhpcy5oYW5kbGVGZXRjaFJlc3BvbnNlRXJyb3IocmVzcG9uc2UsIGRhdGEpKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5oYW5kbGVGZXRjaFJlc3BvbnNlRXJyb3IocmVzcG9uc2UpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgfVxyXG5cclxuICBwcm90ZWN0ZWQgaGFuZGxlRmV0Y2hSZXNwb25zZUVycm9yKHJlc3BvbnNlOiBhbnksIGRhdGE/OiBhbnkpOiBQcm9taXNlPGFueT4ge1xyXG4gICAgbGV0IGVycm9yO1xyXG4gICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA+PSA0MDAgJiYgcmVzcG9uc2Uuc3RhdHVzIDwgNTAwKSB7XHJcbiAgICAgIGVycm9yID0gbmV3IENsaWVudEVycm9yKHJlc3BvbnNlLnN0YXR1c1RleHQpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZXJyb3IgPSBuZXcgU2VydmVyRXJyb3IocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XHJcbiAgICB9XHJcbiAgICBlcnJvci5yZXNwb25zZSA9IHJlc3BvbnNlO1xyXG4gICAgZXJyb3IuZGF0YSA9IGRhdGE7XHJcbiAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZWplY3QoZXJyb3IpO1xyXG4gIH1cclxuXHJcbiAgcHJvdGVjdGVkIGhhbmRsZUZldGNoRXJyb3IoZTogYW55KTogUHJvbWlzZTxhbnk+IHtcclxuICAgIGxldCBlcnJvciA9IG5ldyBOZXR3b3JrRXJyb3IoZSk7XHJcbiAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZWplY3QoZXJyb3IpO1xyXG4gIH1cclxuXHJcbiAgcmVzcG9uc2VIYXNDb250ZW50KHJlc3BvbnNlOiBhbnkpOiBib29sZWFuIHtcclxuICAgIGxldCBjb250ZW50VHlwZSA9IHJlc3BvbnNlLmhlYWRlcnMuZ2V0KCdDb250ZW50LVR5cGUnKTtcclxuICAgIHJldHVybiBjb250ZW50VHlwZSAmJiBjb250ZW50VHlwZS5pbmRleE9mKCdhcHBsaWNhdGlvbi92bmQuYXBpK2pzb24nKSA+IC0xO1xyXG4gIH1cclxuXHJcbiAgcmVzb3VyY2VOYW1lc3BhY2UodHlwZT86IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5uYW1lc3BhY2U7XHJcbiAgfVxyXG5cclxuICByZXNvdXJjZUhvc3QodHlwZT86IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5ob3N0O1xyXG4gIH1cclxuXHJcbiAgcmVzb3VyY2VQYXRoKHR5cGU6IHN0cmluZywgaWQ/OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgbGV0IHBhdGggPSBbdGhpcy5zZXJpYWxpemVyLnJlc291cmNlVHlwZSh0eXBlKV07XHJcbiAgICBpZiAoaWQpIHtcclxuICAgICAgbGV0IHJlc291cmNlSWQgPSB0aGlzLnNlcmlhbGl6ZXIucmVzb3VyY2VJZCh0eXBlLCBpZCk7XHJcbiAgICAgIGlmIChyZXNvdXJjZUlkKSB7XHJcbiAgICAgICAgcGF0aC5wdXNoKHJlc291cmNlSWQpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcGF0aC5qb2luKCcvJyk7XHJcbiAgfVxyXG5cclxuICByZXNvdXJjZVVSTCh0eXBlOiBzdHJpbmcsIGlkPzogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIGxldCBob3N0ID0gdGhpcy5yZXNvdXJjZUhvc3QodHlwZSk7XHJcbiAgICBsZXQgbmFtZXNwYWNlID0gdGhpcy5yZXNvdXJjZU5hbWVzcGFjZSh0eXBlKTtcclxuICAgIGxldCB1cmw6IHN0cmluZ1tdID0gW107XHJcblxyXG4gICAgaWYgKGhvc3QpIHsgdXJsLnB1c2goaG9zdCk7IH1cclxuICAgIGlmIChuYW1lc3BhY2UpIHsgdXJsLnB1c2gobmFtZXNwYWNlKTsgfVxyXG4gICAgdXJsLnB1c2godGhpcy5yZXNvdXJjZVBhdGgodHlwZSwgaWQpKTtcclxuXHJcbiAgICBpZiAoIWhvc3QpIHsgdXJsLnVuc2hpZnQoJycpOyB9XHJcblxyXG4gICAgcmV0dXJuIHVybC5qb2luKCcvJyk7XHJcbiAgfVxyXG5cclxuICByZXNvdXJjZVJlbGF0aW9uc2hpcFVSTCh0eXBlOiBzdHJpbmcsIGlkOiBzdHJpbmcsIHJlbGF0aW9uc2hpcDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLnJlc291cmNlVVJMKHR5cGUsIGlkKSArXHJcbiAgICAgICAgICAgJy9yZWxhdGlvbnNoaXBzLycgKyB0aGlzLnNlcmlhbGl6ZXIucmVzb3VyY2VSZWxhdGlvbnNoaXAodHlwZSwgcmVsYXRpb25zaGlwKTtcclxuICB9XHJcblxyXG4gIHJlbGF0ZWRSZXNvdXJjZVVSTCh0eXBlOiBzdHJpbmcsIGlkOiBzdHJpbmcsIHJlbGF0aW9uc2hpcDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLnJlc291cmNlVVJMKHR5cGUsIGlkKSArXHJcbiAgICAgICAgICAgJy8nICsgdGhpcy5zZXJpYWxpemVyLnJlc291cmNlUmVsYXRpb25zaGlwKHR5cGUsIHJlbGF0aW9uc2hpcCk7XHJcbiAgfVxyXG5cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gIC8vIFByaXZhdGUgbWV0aG9kc1xyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIHByb3RlY3RlZCBfcHJvY2Vzc1JlcXVlc3RzKHJlcXVlc3RzLCBwcm9jZXNzb3JzKTogUHJvbWlzZTxUcmFuc2Zvcm1bXT4ge1xyXG4gICAgbGV0IHRyYW5zZm9ybXM6IFRyYW5zZm9ybVtdID0gW107XHJcbiAgICBsZXQgcmVzdWx0OiBQcm9taXNlPHZvaWQ+ID0gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCk7XHJcblxyXG4gICAgcmVxdWVzdHMuZm9yRWFjaChyZXF1ZXN0ID0+IHtcclxuICAgICAgbGV0IHByb2Nlc3NvciA9IHByb2Nlc3NvcnNbcmVxdWVzdC5vcF07XHJcblxyXG4gICAgICByZXN1bHQgPSByZXN1bHQudGhlbigoKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHByb2Nlc3Nvcih0aGlzLCByZXF1ZXN0KVxyXG4gICAgICAgICAgLnRoZW4oYWRkaXRpb25hbFRyYW5zZm9ybXMgPT4ge1xyXG4gICAgICAgICAgICBpZiAoYWRkaXRpb25hbFRyYW5zZm9ybXMpIHtcclxuICAgICAgICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseSh0cmFuc2Zvcm1zLCBhZGRpdGlvbmFsVHJhbnNmb3Jtcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiByZXN1bHQudGhlbigoKSA9PiB0cmFuc2Zvcm1zKTtcclxuICB9XHJcbn1cclxuIl19