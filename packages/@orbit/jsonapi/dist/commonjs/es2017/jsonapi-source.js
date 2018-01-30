"use strict";

var __extends = undefined && undefined.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
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
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbmFwaS1zb3VyY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzcmMvanNvbmFwaS1zb3VyY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsQUFBZ0M7QUFDaEMscUJBZXFCO0FBRXJCLHNCQUFzQztBQUN0QyxtQ0FBb0Y7QUFDcEYsNkJBQXVEO0FBQ3ZELCtCQUFtRTtBQUNuRSxtQ0FBNEY7QUFDNUYsMkJBQXlEO0FBRXpELEFBQUUsQUFBQyxJQUFDLE9BQU8sT0FBSyxRQUFDLEFBQU8sUUFBQyxBQUFLLFVBQUssQUFBVyxlQUFJLE9BQUssUUFBQyxBQUFLLFVBQUssQUFBUyxBQUFDLFdBQUMsQUFBQztBQUM1RSxXQUFLLFFBQUMsQUFBSyxRQUFHLE9BQUssUUFBQyxBQUFPLFFBQUMsQUFBSyxBQUFDLEFBQ3BDO0FBQUM7QUFvQkQsQUFhRzs7Ozs7Ozs7Ozs7Ozs7QUFHSDtBQUEyQyw2QkFBTTtBQWMvQywyQkFBWSxBQUFvQztBQUFwQyxpQ0FBQTtBQUFBLHVCQUFvQzs7QUFBaEQsb0JBa0JDO0FBakJDLGdCQUFNLE9BQUMsQUFBdUYseUZBQUUsQ0FBQyxDQUFDLEFBQVEsU0FBQyxBQUFNLEFBQUMsQUFBQztBQUNuSCxnQkFBTSxPQUFDLEFBQWlELG1EQUFFLE9BQUssUUFBQyxBQUFPLEFBQUMsQUFBQztBQUN6RSxnQkFBTSxPQUFDLEFBQStDLGlEQUFFLE9BQUssUUFBQyxBQUFLLEFBQUMsQUFBQztBQUVyRSxBQUFRLGlCQUFDLEFBQUksT0FBRyxBQUFRLFNBQUMsQUFBSSxRQUFJLEFBQVMsQUFBQztBQUUzQyxnQkFBQSxrQkFBTSxBQUFRLEFBQUMsYUFBQztBQUVoQixBQUFJLGNBQUMsQUFBUyxZQUFhLEFBQVEsU0FBQyxBQUFTLEFBQUM7QUFDOUMsQUFBSSxjQUFDLEFBQUksT0FBa0IsQUFBUSxTQUFDLEFBQUksQUFBQztBQUN6QyxBQUFJLGNBQUMsQUFBbUIsc0JBQUcsQUFBUSxT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LE1BQUMsQUFBVSxZQUFFLEFBQW9CLEFBQUMsQUFBQyxBQUMvRDtBQUFDLEFBQ0g7QUFBQyxBQUFDLEFBQUMsQUFDUCxpQkFOUyxBQUFTO0FBTWpCLEFBQUMsQUFBQyxBQUNMLGFBUlcsQUFBTTtBQVFoQixBQUFDLEFBQUM7QUFFSCxBQUFNLHNCQUFRLEFBQUksS0FBQztBQUFNLG1CQUFBLEFBQVU7QUFBQSxBQUFDLEFBQUMsQUFDdkMsU0FEUyxBQUFNO0FBQ2Q7QUF6UGtCLEFBQWEsZ0NBRmpDLE9BQVEsVUFDUixPQUFRLFdBQ1ksQUFBYSxBQTBQakM7QUFBRCxXQUFDO0FBMVBELEFBMFBDLEVBMVAwQyxPQUFNLEFBMFBoRDtrQkExUG9CLEFBQWEiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSB2YWxpZC1qc2RvYyAqL1xyXG5pbXBvcnQgT3JiaXQsIHtcclxuICBLZXlNYXAsXHJcbiAgUmVjb3JkT3BlcmF0aW9uLFxyXG4gIFNjaGVtYSxcclxuICBTb3VyY2UsIFNvdXJjZVNldHRpbmdzLFxyXG4gIFF1ZXJ5LCBRdWVyeU9yRXhwcmVzc2lvbixcclxuICBQdWxsYWJsZSwgcHVsbGFibGUsXHJcbiAgUHVzaGFibGUsIHB1c2hhYmxlLFxyXG4gIFRyYW5zZm9ybSxcclxuICBUcmFuc2Zvcm1Pck9wZXJhdGlvbnMsXHJcbiAgY29hbGVzY2VSZWNvcmRPcGVyYXRpb25zLFxyXG4gIFF1ZXJ5Tm90QWxsb3dlZCwgVHJhbnNmb3JtTm90QWxsb3dlZCxcclxuICBDbGllbnRFcnJvcixcclxuICBTZXJ2ZXJFcnJvcixcclxuICBOZXR3b3JrRXJyb3JcclxufSBmcm9tICdAb3JiaXQvZGF0YSc7XHJcbmltcG9ydCB7IExvZyB9IGZyb20gJ0BvcmJpdC9jb3JlJztcclxuaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSAnQG9yYml0L3V0aWxzJztcclxuaW1wb3J0IEpTT05BUElTZXJpYWxpemVyLCB7IEpTT05BUElTZXJpYWxpemVyU2V0dGluZ3MgfSBmcm9tICcuL2pzb25hcGktc2VyaWFsaXplcic7XHJcbmltcG9ydCB7IGVuY29kZVF1ZXJ5UGFyYW1zIH0gZnJvbSAnLi9saWIvcXVlcnktcGFyYW1zJztcclxuaW1wb3J0IHsgUHVsbE9wZXJhdG9yLCBQdWxsT3BlcmF0b3JzIH0gZnJvbSAnLi9saWIvcHVsbC1vcGVyYXRvcnMnO1xyXG5pbXBvcnQgeyBnZXRUcmFuc2Zvcm1SZXF1ZXN0cywgVHJhbnNmb3JtUmVxdWVzdFByb2Nlc3NvcnMgfSBmcm9tICcuL2xpYi90cmFuc2Zvcm0tcmVxdWVzdHMnO1xyXG5pbXBvcnQgeyBJbnZhbGlkU2VydmVyUmVzcG9uc2UgfSBmcm9tICcuL2xpYi9leGNlcHRpb25zJztcclxuXHJcbmlmICh0eXBlb2YgT3JiaXQuZ2xvYmFscy5mZXRjaCAhPT0gJ3VuZGVmaW5lZCcgJiYgT3JiaXQuZmV0Y2ggPT09IHVuZGVmaW5lZCkge1xyXG4gIE9yYml0LmZldGNoID0gT3JiaXQuZ2xvYmFscy5mZXRjaDtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBGZXRjaFNldHRpbmdzIHtcclxuICBoZWFkZXJzPzogb2JqZWN0O1xyXG4gIG1ldGhvZD86IHN0cmluZztcclxuICBqc29uPzogb2JqZWN0O1xyXG4gIGJvZHk/OiBzdHJpbmc7XHJcbiAgcGFyYW1zPzogYW55O1xyXG4gIHRpbWVvdXQ/OiBudW1iZXI7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSlNPTkFQSVNvdXJjZVNldHRpbmdzIGV4dGVuZHMgU291cmNlU2V0dGluZ3Mge1xyXG4gIG1heFJlcXVlc3RzUGVyVHJhbnNmb3JtPzogbnVtYmVyO1xyXG4gIG5hbWVzcGFjZT86IHN0cmluZztcclxuICBob3N0Pzogc3RyaW5nO1xyXG4gIGRlZmF1bHRGZXRjaEhlYWRlcnM/OiBvYmplY3Q7XHJcbiAgZGVmYXVsdEZldGNoVGltZW91dD86IG51bWJlcjtcclxuICBTZXJpYWxpemVyQ2xhc3M/OiAobmV3IChzZXR0aW5nczogSlNPTkFQSVNlcmlhbGl6ZXJTZXR0aW5ncykgPT4gSlNPTkFQSVNlcmlhbGl6ZXIpO1xyXG59XHJcblxyXG4vKipcclxuIFNvdXJjZSBmb3IgYWNjZXNzaW5nIGEgSlNPTiBBUEkgY29tcGxpYW50IFJFU1RmdWwgQVBJIHdpdGggYSBuZXR3b3JrIGZldGNoXHJcbiByZXF1ZXN0LlxyXG5cclxuIElmIGEgc2luZ2xlIHRyYW5zZm9ybSBvciBxdWVyeSByZXF1aXJlcyBtb3JlIHRoYW4gb25lIGZldGNoIHJlcXVlc3QsXHJcbiByZXF1ZXN0cyB3aWxsIGJlIHBlcmZvcm1lZCBzZXF1ZW50aWFsbHkgYW5kIHJlc29sdmVkIHRvZ2V0aGVyLiBGcm9tIHRoZVxyXG4gcGVyc3BlY3RpdmUgb2YgT3JiaXQsIHRoZXNlIG9wZXJhdGlvbnMgd2lsbCBhbGwgc3VjY2VlZCBvciBmYWlsIHRvZ2V0aGVyLiBUaGVcclxuIGBtYXhSZXF1ZXN0c1BlclRyYW5zZm9ybWAgYW5kIGBtYXhSZXF1ZXN0c1BlclF1ZXJ5YCBzZXR0aW5ncyBhbGxvdyBsaW1pdHMgdG8gYmVcclxuIHNldCBvbiB0aGlzIGJlaGF2aW9yLiBUaGVzZSBzZXR0aW5ncyBzaG91bGQgYmUgc2V0IHRvIGAxYCBpZiB5b3VyIGNsaWVudC9zZXJ2ZXJcclxuIGNvbmZpZ3VyYXRpb24gaXMgdW5hYmxlIHRvIHJlc29sdmUgcGFydGlhbGx5IHN1Y2Nlc3NmdWwgdHJhbnNmb3JtcyAvIHF1ZXJpZXMuXHJcblxyXG4gQGNsYXNzIEpTT05BUElTb3VyY2VcclxuIEBleHRlbmRzIFNvdXJjZVxyXG4gKi9cclxuQHB1bGxhYmxlXHJcbkBwdXNoYWJsZVxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBKU09OQVBJU291cmNlIGV4dGVuZHMgU291cmNlIGltcGxlbWVudHMgUHVsbGFibGUsIFB1c2hhYmxlIHtcclxuICBtYXhSZXF1ZXN0c1BlclRyYW5zZm9ybTogbnVtYmVyO1xyXG4gIG5hbWVzcGFjZTogc3RyaW5nO1xyXG4gIGhvc3Q6IHN0cmluZztcclxuICBkZWZhdWx0RmV0Y2hIZWFkZXJzOiBvYmplY3Q7XHJcbiAgZGVmYXVsdEZldGNoVGltZW91dDogbnVtYmVyO1xyXG4gIHNlcmlhbGl6ZXI6IEpTT05BUElTZXJpYWxpemVyO1xyXG5cclxuICAvLyBQdWxsYWJsZSBpbnRlcmZhY2Ugc3R1YnNcclxuICBwdWxsOiAocXVlcnlPckV4cHJlc3Npb246IFF1ZXJ5T3JFeHByZXNzaW9uLCBvcHRpb25zPzogb2JqZWN0LCBpZD86IHN0cmluZykgPT4gUHJvbWlzZTxUcmFuc2Zvcm1bXT47XHJcblxyXG4gIC8vIFB1c2hhYmxlIGludGVyZmFjZSBzdHVic1xyXG4gIHB1c2g6ICh0cmFuc2Zvcm1Pck9wZXJhdGlvbnM6IFRyYW5zZm9ybU9yT3BlcmF0aW9ucywgb3B0aW9ucz86IG9iamVjdCwgaWQ/OiBzdHJpbmcpID0+IFByb21pc2U8VHJhbnNmb3JtW10+O1xyXG5cclxuICBjb25zdHJ1Y3RvcihzZXR0aW5nczogSlNPTkFQSVNvdXJjZVNldHRpbmdzID0ge30pIHtcclxuICAgIGFzc2VydCgnSlNPTkFQSVNvdXJjZVxcJ3MgYHNjaGVtYWAgbXVzdCBiZSBzcGVjaWZpZWQgaW4gYHNldHRpbmdzLnNjaGVtYWAgY29uc3RydWN0b3IgYXJndW1lbnQnLCAhIXNldHRpbmdzLnNjaGVtYSk7XHJcbiAgICBhc3NlcnQoJ0pTT05BUElTb3VyY2UgcmVxdWlyZXMgT3JiaXQuUHJvbWlzZSBiZSBkZWZpbmVkJywgT3JiaXQuUHJvbWlzZSk7XHJcbiAgICBhc3NlcnQoJ0pTT05BUElTb3VyY2UgcmVxdWlyZXMgT3JiaXQuZmV0Y2ggYmUgZGVmaW5lZCcsIE9yYml0LmZldGNoKTtcclxuXHJcbiAgICBzZXR0aW5ncy5uYW1lID0gc2V0dGluZ3MubmFtZSB8fCAnanNvbmFwaSc7XHJcblxyXG4gICAgc3VwZXIoc2V0dGluZ3MpO1xyXG5cclxuICAgIHRoaXMubmFtZXNwYWNlICAgICAgICAgICA9IHNldHRpbmdzLm5hbWVzcGFjZTtcclxuICAgIHRoaXMuaG9zdCAgICAgICAgICAgICAgICA9IHNldHRpbmdzLmhvc3Q7XHJcbiAgICB0aGlzLmRlZmF1bHRGZXRjaEhlYWRlcnMgPSBzZXR0aW5ncy5kZWZhdWx0RmV0Y2hIZWFkZXJzIHx8IHsgQWNjZXB0OiAnYXBwbGljYXRpb24vdm5kLmFwaStqc29uJyB9O1xyXG4gICAgdGhpcy5kZWZhdWx0RmV0Y2hUaW1lb3V0ID0gc2V0dGluZ3MuZGVmYXVsdEZldGNoVGltZW91dCB8fCA1MDAwO1xyXG5cclxuICAgIHRoaXMubWF4UmVxdWVzdHNQZXJUcmFuc2Zvcm0gPSBzZXR0aW5ncy5tYXhSZXF1ZXN0c1BlclRyYW5zZm9ybTtcclxuXHJcbiAgICBjb25zdCBTZXJpYWxpemVyQ2xhc3MgPSBzZXR0aW5ncy5TZXJpYWxpemVyQ2xhc3MgfHwgSlNPTkFQSVNlcmlhbGl6ZXI7XHJcbiAgICB0aGlzLnNlcmlhbGl6ZXIgICAgICAgPSBuZXcgU2VyaWFsaXplckNsYXNzKHsgc2NoZW1hOiBzZXR0aW5ncy5zY2hlbWEsIGtleU1hcDogc2V0dGluZ3Mua2V5TWFwIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAvLyBQdXNoYWJsZSBpbnRlcmZhY2UgaW1wbGVtZW50YXRpb25cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICBfcHVzaCh0cmFuc2Zvcm06IFRyYW5zZm9ybSk6IFByb21pc2U8VHJhbnNmb3JtW10+IHtcclxuICAgIGNvbnN0IHJlcXVlc3RzID0gZ2V0VHJhbnNmb3JtUmVxdWVzdHModGhpcywgdHJhbnNmb3JtKTtcclxuXHJcbiAgICBpZiAodGhpcy5tYXhSZXF1ZXN0c1BlclRyYW5zZm9ybSAmJiByZXF1ZXN0cy5sZW5ndGggPiB0aGlzLm1heFJlcXVlc3RzUGVyVHJhbnNmb3JtKSB7XHJcbiAgICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKVxyXG4gICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgIHRocm93IG5ldyBUcmFuc2Zvcm1Ob3RBbGxvd2VkKFxyXG4gICAgICAgICAgICBgVGhpcyB0cmFuc2Zvcm0gcmVxdWlyZXMgJHtyZXF1ZXN0cy5sZW5ndGh9IHJlcXVlc3RzLCB3aGljaCBleGNlZWRzIHRoZSBzcGVjaWZpZWQgbGltaXQgb2YgJHt0aGlzLm1heFJlcXVlc3RzUGVyVHJhbnNmb3JtfSByZXF1ZXN0cyBwZXIgdHJhbnNmb3JtLmAsXHJcbiAgICAgICAgICAgIHRyYW5zZm9ybSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuX3Byb2Nlc3NSZXF1ZXN0cyhyZXF1ZXN0cywgVHJhbnNmb3JtUmVxdWVzdFByb2Nlc3NvcnMpXHJcbiAgICAgIC50aGVuKHRyYW5zZm9ybXMgPT4ge1xyXG4gICAgICAgIHRyYW5zZm9ybXMudW5zaGlmdCh0cmFuc2Zvcm0pO1xyXG4gICAgICAgIHJldHVybiB0cmFuc2Zvcm1zO1xyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgLy8gUHVsbGFibGUgaW50ZXJmYWNlIGltcGxlbWVudGF0aW9uXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgX3B1bGwocXVlcnk6IFF1ZXJ5KTogUHJvbWlzZTxUcmFuc2Zvcm1bXT4ge1xyXG4gICAgY29uc3Qgb3BlcmF0b3I6IFB1bGxPcGVyYXRvciA9IFB1bGxPcGVyYXRvcnNbcXVlcnkuZXhwcmVzc2lvbi5vcF07XHJcbiAgICBpZiAoIW9wZXJhdG9yKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignSlNPTkFQSVNvdXJjZSBkb2VzIG5vdCBzdXBwb3J0IHRoZSBgJHtxdWVyeS5leHByZXNzaW9uLm9wfWAgb3BlcmF0b3IgZm9yIHF1ZXJpZXMuJyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gb3BlcmF0b3IodGhpcywgcXVlcnkpO1xyXG4gIH1cclxuXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAvLyBQdWJsaWNseSBhY2Nlc3NpYmxlIG1ldGhvZHMgcGFydGljdWxhciB0byBKU09OQVBJU291cmNlXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgZmV0Y2godXJsOiBzdHJpbmcsIHNldHRpbmdzOiBGZXRjaFNldHRpbmdzID0ge30pOiBQcm9taXNlPGFueT4ge1xyXG4gICAgc2V0dGluZ3MuaGVhZGVycyA9IHNldHRpbmdzLmhlYWRlcnMgfHwgdGhpcy5kZWZhdWx0RmV0Y2hIZWFkZXJzO1xyXG5cclxuICAgIGxldCBoZWFkZXJzID0gc2V0dGluZ3MuaGVhZGVycztcclxuICAgIGxldCBtZXRob2QgPSBzZXR0aW5ncy5tZXRob2QgfHwgJ0dFVCc7XHJcblxyXG4gICAgLy8gY29uc29sZS5sb2coJ2ZldGNoJywgdXJsLCBzZXR0aW5ncywgJ3BvbHlmaWxsJywgZmV0Y2gucG9seWZpbGwpO1xyXG5cclxuICAgIGxldCB0aW1lb3V0ID0gc2V0dGluZ3MudGltZW91dCB8fCB0aGlzLmRlZmF1bHRGZXRjaFRpbWVvdXQ7XHJcbiAgICBpZiAoc2V0dGluZ3MudGltZW91dCkge1xyXG4gICAgICBkZWxldGUgc2V0dGluZ3MudGltZW91dDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoc2V0dGluZ3MuanNvbikge1xyXG4gICAgICBhc3NlcnQoJ2Bqc29uYCBhbmQgYGJvZHlgIGNhblxcJ3QgYm90aCBiZSBzZXQgZm9yIGZldGNoIHJlcXVlc3RzLicsICFzZXR0aW5ncy5ib2R5KTtcclxuICAgICAgc2V0dGluZ3MuYm9keSA9IEpTT04uc3RyaW5naWZ5KHNldHRpbmdzLmpzb24pO1xyXG4gICAgICBkZWxldGUgc2V0dGluZ3MuanNvbjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoc2V0dGluZ3MuYm9keSAmJiBtZXRob2QgIT09ICdHRVQnKSB7XHJcbiAgICAgIGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddID0gaGVhZGVyc1snQ29udGVudC1UeXBlJ10gfHwgJ2FwcGxpY2F0aW9uL3ZuZC5hcGkranNvbjsgY2hhcnNldD11dGYtOCc7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHNldHRpbmdzLnBhcmFtcykge1xyXG4gICAgICBpZiAodXJsLmluZGV4T2YoJz8nKSA9PT0gLTEpIHtcclxuICAgICAgICB1cmwgKz0gJz8nO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHVybCArPSAnJic7XHJcbiAgICAgIH1cclxuICAgICAgdXJsICs9IGVuY29kZVF1ZXJ5UGFyYW1zKHNldHRpbmdzLnBhcmFtcyk7XHJcblxyXG4gICAgICBkZWxldGUgc2V0dGluZ3MucGFyYW1zO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aW1lb3V0KSB7XHJcbiAgICAgIHJldHVybiBuZXcgT3JiaXQuUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgbGV0IHRpbWVkT3V0O1xyXG5cclxuICAgICAgICBsZXQgdGltZXIgPSBPcmJpdC5nbG9iYWxzLnNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgdGltZWRPdXQgPSB0cnVlO1xyXG4gICAgICAgICAgcmVqZWN0KG5ldyBOZXR3b3JrRXJyb3IoYE5vIGZldGNoIHJlc3BvbnNlIHdpdGhpbiAke3RpbWVvdXR9bXMuYCkpO1xyXG4gICAgICAgIH0sIHRpbWVvdXQpO1xyXG5cclxuICAgICAgICBPcmJpdC5mZXRjaCh1cmwsIHNldHRpbmdzKVxyXG4gICAgICAgICAgLmNhdGNoKGUgPT4ge1xyXG4gICAgICAgICAgICBPcmJpdC5nbG9iYWxzLmNsZWFyVGltZW91dCh0aW1lcik7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRpbWVkT3V0KSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlRmV0Y2hFcnJvcihlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgT3JiaXQuZ2xvYmFscy5jbGVhclRpbWVvdXQodGltZXIpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCF0aW1lZE91dCkge1xyXG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLmhhbmRsZUZldGNoUmVzcG9uc2UocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gT3JiaXQuZmV0Y2godXJsLCBzZXR0aW5ncylcclxuICAgICAgICAuY2F0Y2goZSA9PiB0aGlzLmhhbmRsZUZldGNoRXJyb3IoZSkpXHJcbiAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gdGhpcy5oYW5kbGVGZXRjaFJlc3BvbnNlKHJlc3BvbnNlKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcm90ZWN0ZWQgaGFuZGxlRmV0Y2hSZXNwb25zZShyZXNwb25zZTogYW55KTogUHJvbWlzZTxhbnk+IHtcclxuICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDIwMSkge1xyXG4gICAgICBpZiAodGhpcy5yZXNwb25zZUhhc0NvbnRlbnQocmVzcG9uc2UpKSB7XHJcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aHJvdyBuZXcgSW52YWxpZFNlcnZlclJlc3BvbnNlKGBTZXJ2ZXIgcmVzcG9uc2VzIHdpdGggYSAke3Jlc3BvbnNlLnN0YXR1c30gc3RhdHVzIHNob3VsZCByZXR1cm4gY29udGVudCB3aXRoIGEgQ29udGVudC1UeXBlIHRoYXQgaW5jbHVkZXMgJ2FwcGxpY2F0aW9uL3ZuZC5hcGkranNvbicuYCk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAocmVzcG9uc2Uuc3RhdHVzID49IDIwMCAmJiByZXNwb25zZS5zdGF0dXMgPCAzMDApIHtcclxuICAgICAgaWYgKHRoaXMucmVzcG9uc2VIYXNDb250ZW50KHJlc3BvbnNlKSkge1xyXG4gICAgICAgIHJldHVybiByZXNwb25zZS5qc29uKCk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmICh0aGlzLnJlc3BvbnNlSGFzQ29udGVudChyZXNwb25zZSkpIHtcclxuICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpXHJcbiAgICAgICAgICAudGhlbihkYXRhID0+IHRoaXMuaGFuZGxlRmV0Y2hSZXNwb25zZUVycm9yKHJlc3BvbnNlLCBkYXRhKSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlRmV0Y2hSZXNwb25zZUVycm9yKHJlc3BvbnNlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIE9yYml0LlByb21pc2UucmVzb2x2ZSgpO1xyXG4gIH1cclxuXHJcbiAgcHJvdGVjdGVkIGhhbmRsZUZldGNoUmVzcG9uc2VFcnJvcihyZXNwb25zZTogYW55LCBkYXRhPzogYW55KTogUHJvbWlzZTxhbnk+IHtcclxuICAgIGxldCBlcnJvcjtcclxuICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPj0gNDAwICYmIHJlc3BvbnNlLnN0YXR1cyA8IDUwMCkge1xyXG4gICAgICBlcnJvciA9IG5ldyBDbGllbnRFcnJvcihyZXNwb25zZS5zdGF0dXNUZXh0KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGVycm9yID0gbmV3IFNlcnZlckVycm9yKHJlc3BvbnNlLnN0YXR1c1RleHQpO1xyXG4gICAgfVxyXG4gICAgZXJyb3IucmVzcG9uc2UgPSByZXNwb25zZTtcclxuICAgIGVycm9yLmRhdGEgPSBkYXRhO1xyXG4gICAgcmV0dXJuIE9yYml0LlByb21pc2UucmVqZWN0KGVycm9yKTtcclxuICB9XHJcblxyXG4gIHByb3RlY3RlZCBoYW5kbGVGZXRjaEVycm9yKGU6IGFueSk6IFByb21pc2U8YW55PiB7XHJcbiAgICBsZXQgZXJyb3IgPSBuZXcgTmV0d29ya0Vycm9yKGUpO1xyXG4gICAgcmV0dXJuIE9yYml0LlByb21pc2UucmVqZWN0KGVycm9yKTtcclxuICB9XHJcblxyXG4gIHJlc3BvbnNlSGFzQ29udGVudChyZXNwb25zZTogYW55KTogYm9vbGVhbiB7XHJcbiAgICBsZXQgY29udGVudFR5cGUgPSByZXNwb25zZS5oZWFkZXJzLmdldCgnQ29udGVudC1UeXBlJyk7XHJcbiAgICByZXR1cm4gY29udGVudFR5cGUgJiYgY29udGVudFR5cGUuaW5kZXhPZignYXBwbGljYXRpb24vdm5kLmFwaStqc29uJykgPiAtMTtcclxuICB9XHJcblxyXG4gIHJlc291cmNlTmFtZXNwYWNlKHR5cGU/OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMubmFtZXNwYWNlO1xyXG4gIH1cclxuXHJcbiAgcmVzb3VyY2VIb3N0KHR5cGU/OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMuaG9zdDtcclxuICB9XHJcblxyXG4gIHJlc291cmNlUGF0aCh0eXBlOiBzdHJpbmcsIGlkPzogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIGxldCBwYXRoID0gW3RoaXMuc2VyaWFsaXplci5yZXNvdXJjZVR5cGUodHlwZSldO1xyXG4gICAgaWYgKGlkKSB7XHJcbiAgICAgIGxldCByZXNvdXJjZUlkID0gdGhpcy5zZXJpYWxpemVyLnJlc291cmNlSWQodHlwZSwgaWQpO1xyXG4gICAgICBpZiAocmVzb3VyY2VJZCkge1xyXG4gICAgICAgIHBhdGgucHVzaChyZXNvdXJjZUlkKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHBhdGguam9pbignLycpO1xyXG4gIH1cclxuXHJcbiAgcmVzb3VyY2VVUkwodHlwZTogc3RyaW5nLCBpZD86IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICBsZXQgaG9zdCA9IHRoaXMucmVzb3VyY2VIb3N0KHR5cGUpO1xyXG4gICAgbGV0IG5hbWVzcGFjZSA9IHRoaXMucmVzb3VyY2VOYW1lc3BhY2UodHlwZSk7XHJcbiAgICBsZXQgdXJsOiBzdHJpbmdbXSA9IFtdO1xyXG5cclxuICAgIGlmIChob3N0KSB7IHVybC5wdXNoKGhvc3QpOyB9XHJcbiAgICBpZiAobmFtZXNwYWNlKSB7IHVybC5wdXNoKG5hbWVzcGFjZSk7IH1cclxuICAgIHVybC5wdXNoKHRoaXMucmVzb3VyY2VQYXRoKHR5cGUsIGlkKSk7XHJcblxyXG4gICAgaWYgKCFob3N0KSB7IHVybC51bnNoaWZ0KCcnKTsgfVxyXG5cclxuICAgIHJldHVybiB1cmwuam9pbignLycpO1xyXG4gIH1cclxuXHJcbiAgcmVzb3VyY2VSZWxhdGlvbnNoaXBVUkwodHlwZTogc3RyaW5nLCBpZDogc3RyaW5nLCByZWxhdGlvbnNoaXA6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVVSTCh0eXBlLCBpZCkgK1xyXG4gICAgICAgICAgICcvcmVsYXRpb25zaGlwcy8nICsgdGhpcy5zZXJpYWxpemVyLnJlc291cmNlUmVsYXRpb25zaGlwKHR5cGUsIHJlbGF0aW9uc2hpcCk7XHJcbiAgfVxyXG5cclxuICByZWxhdGVkUmVzb3VyY2VVUkwodHlwZTogc3RyaW5nLCBpZDogc3RyaW5nLCByZWxhdGlvbnNoaXA6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVVSTCh0eXBlLCBpZCkgK1xyXG4gICAgICAgICAgICcvJyArIHRoaXMuc2VyaWFsaXplci5yZXNvdXJjZVJlbGF0aW9uc2hpcCh0eXBlLCByZWxhdGlvbnNoaXApO1xyXG4gIH1cclxuXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAvLyBQcml2YXRlIG1ldGhvZHNcclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICBwcm90ZWN0ZWQgX3Byb2Nlc3NSZXF1ZXN0cyhyZXF1ZXN0cywgcHJvY2Vzc29ycyk6IFByb21pc2U8VHJhbnNmb3JtW10+IHtcclxuICAgIGxldCB0cmFuc2Zvcm1zOiBUcmFuc2Zvcm1bXSA9IFtdO1xyXG4gICAgbGV0IHJlc3VsdDogUHJvbWlzZTx2b2lkPiA9IE9yYml0LlByb21pc2UucmVzb2x2ZSgpO1xyXG5cclxuICAgIHJlcXVlc3RzLmZvckVhY2gocmVxdWVzdCA9PiB7XHJcbiAgICAgIGxldCBwcm9jZXNzb3IgPSBwcm9jZXNzb3JzW3JlcXVlc3Qub3BdO1xyXG5cclxuICAgICAgcmVzdWx0ID0gcmVzdWx0LnRoZW4oKCkgPT4ge1xyXG4gICAgICAgIHJldHVybiBwcm9jZXNzb3IodGhpcywgcmVxdWVzdClcclxuICAgICAgICAgIC50aGVuKGFkZGl0aW9uYWxUcmFuc2Zvcm1zID0+IHtcclxuICAgICAgICAgICAgaWYgKGFkZGl0aW9uYWxUcmFuc2Zvcm1zKSB7XHJcbiAgICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkodHJhbnNmb3JtcywgYWRkaXRpb25hbFRyYW5zZm9ybXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gcmVzdWx0LnRoZW4oKCkgPT4gdHJhbnNmb3Jtcyk7XHJcbiAgfVxyXG59XHJcbiJdfQ==