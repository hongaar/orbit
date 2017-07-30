"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
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
var JSONAPISource = (function (_super) {
    __extends(JSONAPISource, _super);
    function JSONAPISource(settings) {
        if (settings === void 0) { settings = {}; }
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
            return data_1.default.Promise.resolve()
                .then(function () {
                throw new data_1.TransformNotAllowed("This transform requires " + requests.length + " requests, which exceeds the specified limit of " + _this.maxRequestsPerTransform + " requests per transform.", transform);
            });
        }
        return this._processRequests(requests, transform_requests_1.TransformRequestProcessors)
            .then(function (transforms) {
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
        if (settings === void 0) { settings = {}; }
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
            }
            else {
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
                data_1.default.fetch(url, settings)
                    .catch(function (e) {
                    data_1.default.globals.clearTimeout(timer);
                    if (!timedOut) {
                        return _this.handleFetchError(e)
                            .then(function (response) { return resolve(response); })
                            .catch(function (e) { return reject(e); });
                    }
                })
                    .then(function (response) {
                    data_1.default.globals.clearTimeout(timer);
                    if (!timedOut) {
                        return _this.handleFetchResponse(response)
                            .then(function (response) { return resolve(response); })
                            .catch(function (e) { return reject(e); });
                    }
                });
            });
        }
        else {
            return data_1.default.fetch(url, settings)
                .catch(function (e) { return _this.handleFetchError(e); })
                .then(function (response) { return _this.handleFetchResponse(response); });
        }
    };
    JSONAPISource.prototype.handleFetchResponse = function (response) {
        var _this = this;
        if (response.status === 201) {
            if (this.responseHasContent(response)) {
                return response.json();
            }
            else {
                throw new exceptions_1.InvalidServerResponse("Server responses with a " + response.status + " status should return content with a Content-Type that includes 'application/vnd.api+json'.");
            }
        }
        else if (response.status >= 200 && response.status < 300) {
            if (this.responseHasContent(response)) {
                return response.json();
            }
        }
        else {
            if (this.responseHasContent(response)) {
                return response.json()
                    .then(function (data) { return _this.handleFetchResponseError(response, data); });
            }
            else {
                return this.handleFetchResponseError(response);
            }
        }
        return data_1.default.Promise.resolve();
    };
    JSONAPISource.prototype.handleFetchResponseError = function (response, data) {
        var error;
        if (response.status >= 400 && response.status < 500) {
            error = new data_1.ClientError(response.statusText);
        }
        else {
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
        return this.resourceURL(type, id) +
            '/relationships/' + this.serializer.resourceRelationship(type, relationship);
    };
    JSONAPISource.prototype.relatedResourceURL = function (type, id, relationship) {
        return this.resourceURL(type, id) +
            '/' + this.serializer.resourceRelationship(type, relationship);
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
                return processor(_this, request)
                    .then(function (additionalTransforms) {
                    if (additionalTransforms) {
                        Array.prototype.push.apply(transforms, additionalTransforms);
                    }
                });
            });
        });
        return result.then(function () { return transforms; });
    };
    JSONAPISource = __decorate([
        data_1.pullable,
        data_1.pushable
    ], JSONAPISource);
    return JSONAPISource;
}(data_1.Source));
exports.default = JSONAPISource;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbmFwaS1zb3VyY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzcmMvanNvbmFwaS1zb3VyY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsZ0NBQWdDO0FBQ2hDLG9DQWVxQjtBQUVyQixzQ0FBc0M7QUFDdEMsMkRBQW9GO0FBQ3BGLG1EQUF1RDtBQUN2RCx1REFBbUU7QUFDbkUsK0RBQTRGO0FBQzVGLCtDQUF5RDtBQUV6RCxFQUFFLENBQUMsQ0FBQyxPQUFPLGNBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxLQUFLLFdBQVcsSUFBSSxjQUFLLENBQUMsS0FBSyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFDNUUsY0FBSyxDQUFDLEtBQUssR0FBRyxjQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztBQUNwQyxDQUFDO0FBb0JEOzs7Ozs7Ozs7Ozs7O0dBYUc7QUFHSDtJQUEyQyxpQ0FBTTtJQWMvQyx1QkFBWSxRQUFvQztRQUFwQyx5QkFBQSxFQUFBLGFBQW9DO1FBQWhELGlCQWtCQztRQWpCQyxjQUFNLENBQUMsdUZBQXVGLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNuSCxjQUFNLENBQUMsaURBQWlELEVBQUUsY0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3pFLGNBQU0sQ0FBQywrQ0FBK0MsRUFBRSxjQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFckUsUUFBUSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsSUFBSSxJQUFJLFNBQVMsQ0FBQztRQUUzQyxRQUFBLGtCQUFNLFFBQVEsQ0FBQyxTQUFDO1FBRWhCLEtBQUksQ0FBQyxTQUFTLEdBQWEsUUFBUSxDQUFDLFNBQVMsQ0FBQztRQUM5QyxLQUFJLENBQUMsSUFBSSxHQUFrQixRQUFRLENBQUMsSUFBSSxDQUFDO1FBQ3pDLEtBQUksQ0FBQyxtQkFBbUIsR0FBRyxRQUFRLENBQUMsbUJBQW1CLElB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QUFTLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUV2QyxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztnQkFDbkIsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFJLEVBQUUsT0FBTyxDQUFDO3FCQUM1QixJQUFJLENBQUMsVUFBQSxvQkFBb0I7b0JBQ3hCLEVBQUUsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQzt3QkFDekIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO29CQUMvRCxDQUFDO2dCQUNILENBQUMsQ0FBQyxDQUFDO1lBQ1AsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQU0sT0FBQSxVQUFVLEVBQVYsQ0FBVSxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQTVQa0IsYUFBYTtRQUZqQyxlQUFRO1FBQ1IsZUFBUTtPQUNZLGFBQWEsQ0E2UGpDO0lBQUQsb0JBQUM7Q0FBQSxBQTdQRCxDQUEyQyxhQUFNLEdBNlBoRDtrQkE3UG9CLGFBQWEiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSB2YWxpZC1qc2RvYyAqL1xyXG5pbXBvcnQgT3JiaXQsIHtcclxuICBLZXlNYXAsXHJcbiAgUmVjb3JkT3BlcmF0aW9uLFxyXG4gIFNjaGVtYSxcclxuICBTb3VyY2UsIFNvdXJjZVNldHRpbmdzLFxyXG4gIFF1ZXJ5LCBRdWVyeU9yRXhwcmVzc2lvbixcclxuICBQdWxsYWJsZSwgcHVsbGFibGUsXHJcbiAgUHVzaGFibGUsIHB1c2hhYmxlLFxyXG4gIFRyYW5zZm9ybSxcclxuICBUcmFuc2Zvcm1Pck9wZXJhdGlvbnMsXHJcbiAgY29hbGVzY2VSZWNvcmRPcGVyYXRpb25zLFxyXG4gIFF1ZXJ5Tm90QWxsb3dlZCwgVHJhbnNmb3JtTm90QWxsb3dlZCxcclxuICBDbGllbnRFcnJvcixcclxuICBTZXJ2ZXJFcnJvcixcclxuICBOZXR3b3JrRXJyb3JcclxufSBmcm9tICdAb3JiaXQvZGF0YSc7XHJcbmltcG9ydCB7IExvZyB9IGZyb20gJ0BvcmJpdC9jb3JlJztcclxuaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSAnQG9yYml0L3V0aWxzJztcclxuaW1wb3J0IEpTT05BUElTZXJpYWxpemVyLCB7IEpTT05BUElTZXJpYWxpemVyU2V0dGluZ3MgfSBmcm9tICcuL2pzb25hcGktc2VyaWFsaXplcic7XHJcbmltcG9ydCB7IGVuY29kZVF1ZXJ5UGFyYW1zIH0gZnJvbSAnLi9saWIvcXVlcnktcGFyYW1zJztcclxuaW1wb3J0IHsgUHVsbE9wZXJhdG9yLCBQdWxsT3BlcmF0b3JzIH0gZnJvbSAnLi9saWIvcHVsbC1vcGVyYXRvcnMnO1xyXG5pbXBvcnQgeyBnZXRUcmFuc2Zvcm1SZXF1ZXN0cywgVHJhbnNmb3JtUmVxdWVzdFByb2Nlc3NvcnMgfSBmcm9tICcuL2xpYi90cmFuc2Zvcm0tcmVxdWVzdHMnO1xyXG5pbXBvcnQgeyBJbnZhbGlkU2VydmVyUmVzcG9uc2UgfSBmcm9tICcuL2xpYi9leGNlcHRpb25zJztcclxuXHJcbmlmICh0eXBlb2YgT3JiaXQuZ2xvYmFscy5mZXRjaCAhPT0gJ3VuZGVmaW5lZCcgJiYgT3JiaXQuZmV0Y2ggPT09IHVuZGVmaW5lZCkge1xyXG4gIE9yYml0LmZldGNoID0gT3JiaXQuZ2xvYmFscy5mZXRjaDtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBGZXRjaFNldHRpbmdzIHtcclxuICBoZWFkZXJzPzogb2JqZWN0O1xyXG4gIG1ldGhvZD86IHN0cmluZztcclxuICBqc29uPzogb2JqZWN0O1xyXG4gIGJvZHk/OiBzdHJpbmc7XHJcbiAgcGFyYW1zPzogYW55O1xyXG4gIHRpbWVvdXQ/OiBudW1iZXI7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSlNPTkFQSVNvdXJjZVNldHRpbmdzIGV4dGVuZHMgU291cmNlU2V0dGluZ3Mge1xyXG4gIG1heFJlcXVlc3RzUGVyVHJhbnNmb3JtPzogbnVtYmVyO1xyXG4gIG5hbWVzcGFjZT86IHN0cmluZztcclxuICBob3N0Pzogc3RyaW5nO1xyXG4gIGRlZmF1bHRGZXRjaEhlYWRlcnM/OiBvYmplY3Q7XHJcbiAgZGVmYXVsdEZldGNoVGltZW91dD86IG51bWJlcjtcclxuICBTZXJpYWxpemVyQ2xhc3M/OiAobmV3IChzZXR0aW5nczogSlNPTkFQSVNlcmlhbGl6ZXJTZXR0aW5ncykgPT4gSlNPTkFQSVNlcmlhbGl6ZXIpO1xyXG59XHJcblxyXG4vKipcclxuIFNvdXJjZSBmb3IgYWNjZXNzaW5nIGEgSlNPTiBBUEkgY29tcGxpYW50IFJFU1RmdWwgQVBJIHdpdGggYSBuZXR3b3JrIGZldGNoXHJcbiByZXF1ZXN0LlxyXG5cclxuIElmIGEgc2luZ2xlIHRyYW5zZm9ybSBvciBxdWVyeSByZXF1aXJlcyBtb3JlIHRoYW4gb25lIGZldGNoIHJlcXVlc3QsXHJcbiByZXF1ZXN0cyB3aWxsIGJlIHBlcmZvcm1lZCBzZXF1ZW50aWFsbHkgYW5kIHJlc29sdmVkIHRvZ2V0aGVyLiBGcm9tIHRoZVxyXG4gcGVyc3BlY3RpdmUgb2YgT3JiaXQsIHRoZXNlIG9wZXJhdGlvbnMgd2lsbCBhbGwgc3VjY2VlZCBvciBmYWlsIHRvZ2V0aGVyLiBUaGVcclxuIGBtYXhSZXF1ZXN0c1BlclRyYW5zZm9ybWAgYW5kIGBtYXhSZXF1ZXN0c1BlclF1ZXJ5YCBzZXR0aW5ncyBhbGxvdyBsaW1pdHMgdG8gYmVcclxuIHNldCBvbiB0aGlzIGJlaGF2aW9yLiBUaGVzZSBzZXR0aW5ncyBzaG91bGQgYmUgc2V0IHRvIGAxYCBpZiB5b3VyIGNsaWVudC9zZXJ2ZXJcclxuIGNvbmZpZ3VyYXRpb24gaXMgdW5hYmxlIHRvIHJlc29sdmUgcGFydGlhbGx5IHN1Y2Nlc3NmdWwgdHJhbnNmb3JtcyAvIHF1ZXJpZXMuXHJcblxyXG4gQGNsYXNzIEpTT05BUElTb3VyY2VcclxuIEBleHRlbmRzIFNvdXJjZVxyXG4gKi9cclxuQHB1bGxhYmxlXHJcbkBwdXNoYWJsZVxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBKU09OQVBJU291cmNlIGV4dGVuZHMgU291cmNlIGltcGxlbWVudHMgUHVsbGFibGUsIFB1c2hhYmxlIHtcclxuICBtYXhSZXF1ZXN0c1BlclRyYW5zZm9ybTogbnVtYmVyO1xyXG4gIG5hbWVzcGFjZTogc3RyaW5nO1xyXG4gIGhvc3Q6IHN0cmluZztcclxuICBkZWZhdWx0RmV0Y2hIZWFkZXJzOiBvYmplY3Q7XHJcbiAgZGVmYXVsdEZldGNoVGltZW91dDogbnVtYmVyO1xyXG4gIHNlcmlhbGl6ZXI6IEpTT05BUElTZXJpYWxpemVyO1xyXG5cclxuICAvLyBQdWxsYWJsZSBpbnRlcmZhY2Ugc3R1YnNcclxuICBwdWxsOiAocXVlcnlPckV4cHJlc3Npb246IFF1ZXJ5T3JFeHByZXNzaW9uLCBvcHRpb25zPzogb2JqZWN0LCBpZD86IHN0cmluZykgPT4gUHJvbWlzZTxUcmFuc2Zvcm1bXT47XHJcblxyXG4gIC8vIFB1c2hhYmxlIGludGVyZmFjZSBzdHVic1xyXG4gIHB1c2g6ICh0cmFuc2Zvcm1Pck9wZXJhdGlvbnM6IFRyYW5zZm9ybU9yT3BlcmF0aW9ucywgb3B0aW9ucz86IG9iamVjdCwgaWQ/OiBzdHJpbmcpID0+IFByb21pc2U8VHJhbnNmb3JtW10+O1xyXG5cclxuICBjb25zdHJ1Y3RvcihzZXR0aW5nczogSlNPTkFQSVNvdXJjZVNldHRpbmdzID0ge30pIHtcclxuICAgIGFzc2VydCgnSlNPTkFQSVNvdXJjZVxcJ3MgYHNjaGVtYWAgbXVzdCBiZSBzcGVjaWZpZWQgaW4gYHNldHRpbmdzLnNjaGVtYWAgY29uc3RydWN0b3IgYXJndW1lbnQnLCAhIXNldHRpbmdzLnNjaGVtYSk7XHJcbiAgICBhc3NlcnQoJ0pTT05BUElTb3VyY2UgcmVxdWlyZXMgT3JiaXQuUHJvbWlzZSBiZSBkZWZpbmVkJywgT3JiaXQuUHJvbWlzZSk7XHJcbiAgICBhc3NlcnQoJ0pTT05BUElTb3VyY2UgcmVxdWlyZXMgT3JiaXQuZmV0Y2ggYmUgZGVmaW5lZCcsIE9yYml0LmZldGNoKTtcclxuXHJcbiAgICBzZXR0aW5ncy5uYW1lID0gc2V0dGluZ3MubmFtZSB8fCAnanNvbmFwaSc7XHJcblxyXG4gICAgc3VwZXIoc2V0dGluZ3MpO1xyXG5cclxuICAgIHRoaXMubmFtZXNwYWNlICAgICAgICAgICA9IHNldHRpbmdzLm5hbWVzcGFjZTtcclxuICAgIHRoaXMuaG9zdCAgICAgICAgICAgICAgICA9IHNldHRpbmdzLmhvc3Q7XHJcbiAgICB0aGlzLmRlZmF1bHRGZXRjaEhlYWRlcnMgPSBzZXR0aW5ncy5kZWZhdWx0RmV0Y2hIZWFkZXJzIHx8IHsgQWNjZXB0OiAnYXBwbGljYXRpb24vdm5kLmFwaStqc29uJyB9O1xyXG4gICAgdGhpcy5kZWZhdWx0RmV0Y2hUaW1lb3V0ID0gc2V0dGluZ3MuZGVmYXVsdEZldGNoVGltZW91dCB8fCA1MDAwO1xyXG5cclxuICAgIHRoaXMubWF4UmVxdWVzdHNQZXJUcmFuc2Zvcm0gPSBzZXR0aW5ncy5tYXhSZXF1ZXN0c1BlclRyYW5zZm9ybTtcclxuXHJcbiAgICBjb25zdCBTZXJpYWxpemVyQ2xhc3MgPSBzZXR0aW5ncy5TZXJpYWxpemVyQ2xhc3MgfHwgSlNPTkFQSVNlcmlhbGl6ZXI7XHJcbiAgICB0aGlzLnNlcmlhbGl6ZXIgICAgICAgPSBuZXcgU2VyaWFsaXplckNsYXNzKHsgc2NoZW1hOiBzZXR0aW5ncy5zY2hlbWEsIGtleU1hcDogc2V0dGluZ3Mua2V5TWFwIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAvLyBQdXNoYWJsZSBpbnRlcmZhY2UgaW1wbGVtZW50YXRpb25cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICBfcHVzaCh0cmFuc2Zvcm06IFRyYW5zZm9ybSk6IFByb21pc2U8VHJhbnNmb3JtW10+IHtcclxuICAgIGNvbnN0IHJlcXVlc3RzID0gZ2V0VHJhbnNmb3JtUmVxdWVzdHModGhpcywgdHJhbnNmb3JtKTtcclxuXHJcbiAgICBpZiAodGhpcy5tYXhSZXF1ZXN0c1BlclRyYW5zZm9ybSAmJiByZXF1ZXN0cy5sZW5ndGggPiB0aGlzLm1heFJlcXVlc3RzUGVyVHJhbnNmb3JtKSB7XHJcbiAgICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKVxyXG4gICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgIHRocm93IG5ldyBUcmFuc2Zvcm1Ob3RBbGxvd2VkKFxyXG4gICAgICAgICAgICBgVGhpcyB0cmFuc2Zvcm0gcmVxdWlyZXMgJHtyZXF1ZXN0cy5sZW5ndGh9IHJlcXVlc3RzLCB3aGljaCBleGNlZWRzIHRoZSBzcGVjaWZpZWQgbGltaXQgb2YgJHt0aGlzLm1heFJlcXVlc3RzUGVyVHJhbnNmb3JtfSByZXF1ZXN0cyBwZXIgdHJhbnNmb3JtLmAsXHJcbiAgICAgICAgICAgIHRyYW5zZm9ybSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuX3Byb2Nlc3NSZXF1ZXN0cyhyZXF1ZXN0cywgVHJhbnNmb3JtUmVxdWVzdFByb2Nlc3NvcnMpXHJcbiAgICAgIC50aGVuKHRyYW5zZm9ybXMgPT4ge1xyXG4gICAgICAgIHRyYW5zZm9ybXMudW5zaGlmdCh0cmFuc2Zvcm0pO1xyXG4gICAgICAgIHJldHVybiB0cmFuc2Zvcm1zO1xyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgLy8gUHVsbGFibGUgaW50ZXJmYWNlIGltcGxlbWVudGF0aW9uXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgX3B1bGwocXVlcnk6IFF1ZXJ5KTogUHJvbWlzZTxUcmFuc2Zvcm1bXT4ge1xyXG4gICAgY29uc3Qgb3BlcmF0b3I6IFB1bGxPcGVyYXRvciA9IFB1bGxPcGVyYXRvcnNbcXVlcnkuZXhwcmVzc2lvbi5vcF07XHJcbiAgICBpZiAoIW9wZXJhdG9yKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignSlNPTkFQSVNvdXJjZSBkb2VzIG5vdCBzdXBwb3J0IHRoZSBgJHtxdWVyeS5leHByZXNzaW9uLm9wfWAgb3BlcmF0b3IgZm9yIHF1ZXJpZXMuJyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gb3BlcmF0b3IodGhpcywgcXVlcnkpO1xyXG4gIH1cclxuXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAvLyBQdWJsaWNseSBhY2Nlc3NpYmxlIG1ldGhvZHMgcGFydGljdWxhciB0byBKU09OQVBJU291cmNlXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgZmV0Y2godXJsOiBzdHJpbmcsIHNldHRpbmdzOiBGZXRjaFNldHRpbmdzID0ge30pOiBQcm9taXNlPGFueT4ge1xyXG4gICAgc2V0dGluZ3MuaGVhZGVycyA9IHNldHRpbmdzLmhlYWRlcnMgfHwgdGhpcy5kZWZhdWx0RmV0Y2hIZWFkZXJzO1xyXG5cclxuICAgIGxldCBoZWFkZXJzID0gc2V0dGluZ3MuaGVhZGVycztcclxuICAgIGxldCBtZXRob2QgPSBzZXR0aW5ncy5tZXRob2QgfHwgJ0dFVCc7XHJcblxyXG4gICAgLy8gY29uc29sZS5sb2coJ2ZldGNoJywgdXJsLCBzZXR0aW5ncywgJ3BvbHlmaWxsJywgZmV0Y2gucG9seWZpbGwpO1xyXG5cclxuICAgIGxldCB0aW1lb3V0ID0gc2V0dGluZ3MudGltZW91dCB8fCB0aGlzLmRlZmF1bHRGZXRjaFRpbWVvdXQ7XHJcbiAgICBpZiAoc2V0dGluZ3MudGltZW91dCkge1xyXG4gICAgICBkZWxldGUgc2V0dGluZ3MudGltZW91dDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoc2V0dGluZ3MuanNvbikge1xyXG4gICAgICBhc3NlcnQoJ2Bqc29uYCBhbmQgYGJvZHlgIGNhblxcJ3QgYm90aCBiZSBzZXQgZm9yIGZldGNoIHJlcXVlc3RzLicsICFzZXR0aW5ncy5ib2R5KTtcclxuICAgICAgc2V0dGluZ3MuYm9keSA9IEpTT04uc3RyaW5naWZ5KHNldHRpbmdzLmpzb24pO1xyXG4gICAgICBkZWxldGUgc2V0dGluZ3MuanNvbjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoc2V0dGluZ3MuYm9keSAmJiBtZXRob2QgIT09ICdHRVQnKSB7XHJcbiAgICAgIGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddID0gaGVhZGVyc1snQ29udGVudC1UeXBlJ10gfHwgJ2FwcGxpY2F0aW9uL3ZuZC5hcGkranNvbjsgY2hhcnNldD11dGYtOCc7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHNldHRpbmdzLnBhcmFtcykge1xyXG4gICAgICBpZiAodXJsLmluZGV4T2YoJz8nKSA9PT0gLTEpIHtcclxuICAgICAgICB1cmwgKz0gJz8nO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHVybCArPSAnJic7XHJcbiAgICAgIH1cclxuICAgICAgdXJsICs9IGVuY29kZVF1ZXJ5UGFyYW1zKHNldHRpbmdzLnBhcmFtcyk7XHJcblxyXG4gICAgICBkZWxldGUgc2V0dGluZ3MucGFyYW1zO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aW1lb3V0KSB7XHJcbiAgICAgIHJldHVybiBuZXcgT3JiaXQuUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgbGV0IHRpbWVkT3V0O1xyXG5cclxuICAgICAgICBsZXQgdGltZXIgPSBPcmJpdC5nbG9iYWxzLnNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgdGltZWRPdXQgPSB0cnVlO1xyXG4gICAgICAgICAgcmVqZWN0KG5ldyBOZXR3b3JrRXJyb3IoYE5vIGZldGNoIHJlc3BvbnNlIHdpdGhpbiAke3RpbWVvdXR9bXMuYCkpO1xyXG4gICAgICAgIH0sIHRpbWVvdXQpO1xyXG5cclxuICAgICAgICBPcmJpdC5mZXRjaCh1cmwsIHNldHRpbmdzKVxyXG4gICAgICAgICAgLmNhdGNoKGUgPT4ge1xyXG4gICAgICAgICAgICBPcmJpdC5nbG9iYWxzLmNsZWFyVGltZW91dCh0aW1lcik7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRpbWVkT3V0KSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlRmV0Y2hFcnJvcihlKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gcmVzb2x2ZShyZXNwb25zZSkpXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goZSA9PiByZWplY3QoZSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICBPcmJpdC5nbG9iYWxzLmNsZWFyVGltZW91dCh0aW1lcik7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRpbWVkT3V0KSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlRmV0Y2hSZXNwb25zZShyZXNwb25zZSlcclxuICAgICAgICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHJlc29sdmUocmVzcG9uc2UpKVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGUgPT4gcmVqZWN0KGUpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIE9yYml0LmZldGNoKHVybCwgc2V0dGluZ3MpXHJcbiAgICAgICAgLmNhdGNoKGUgPT4gdGhpcy5oYW5kbGVGZXRjaEVycm9yKGUpKVxyXG4gICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHRoaXMuaGFuZGxlRmV0Y2hSZXNwb25zZShyZXNwb25zZSkpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJvdGVjdGVkIGhhbmRsZUZldGNoUmVzcG9uc2UocmVzcG9uc2U6IGFueSk6IFByb21pc2U8YW55PiB7XHJcbiAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAyMDEpIHtcclxuICAgICAgaWYgKHRoaXMucmVzcG9uc2VIYXNDb250ZW50KHJlc3BvbnNlKSkge1xyXG4gICAgICAgIHJldHVybiByZXNwb25zZS5qc29uKCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEludmFsaWRTZXJ2ZXJSZXNwb25zZShgU2VydmVyIHJlc3BvbnNlcyB3aXRoIGEgJHtyZXNwb25zZS5zdGF0dXN9IHN0YXR1cyBzaG91bGQgcmV0dXJuIGNvbnRlbnQgd2l0aCBhIENvbnRlbnQtVHlwZSB0aGF0IGluY2x1ZGVzICdhcHBsaWNhdGlvbi92bmQuYXBpK2pzb24nLmApO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLnN0YXR1cyA+PSAyMDAgJiYgcmVzcG9uc2Uuc3RhdHVzIDwgMzAwKSB7XHJcbiAgICAgIGlmICh0aGlzLnJlc3BvbnNlSGFzQ29udGVudChyZXNwb25zZSkpIHtcclxuICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAodGhpcy5yZXNwb25zZUhhc0NvbnRlbnQocmVzcG9uc2UpKSB7XHJcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKVxyXG4gICAgICAgICAgLnRoZW4oZGF0YSA9PiB0aGlzLmhhbmRsZUZldGNoUmVzcG9uc2VFcnJvcihyZXNwb25zZSwgZGF0YSkpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmhhbmRsZUZldGNoUmVzcG9uc2VFcnJvcihyZXNwb25zZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKTtcclxuICB9XHJcblxyXG4gIHByb3RlY3RlZCBoYW5kbGVGZXRjaFJlc3BvbnNlRXJyb3IocmVzcG9uc2U6IGFueSwgZGF0YT86IGFueSk6IFByb21pc2U8YW55PiB7XHJcbiAgICBsZXQgZXJyb3I7XHJcbiAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID49IDQwMCAmJiByZXNwb25zZS5zdGF0dXMgPCA1MDApIHtcclxuICAgICAgZXJyb3IgPSBuZXcgQ2xpZW50RXJyb3IocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBlcnJvciA9IG5ldyBTZXJ2ZXJFcnJvcihyZXNwb25zZS5zdGF0dXNUZXh0KTtcclxuICAgIH1cclxuICAgIGVycm9yLnJlc3BvbnNlID0gcmVzcG9uc2U7XHJcbiAgICBlcnJvci5kYXRhID0gZGF0YTtcclxuICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlamVjdChlcnJvcik7XHJcbiAgfVxyXG5cclxuICBwcm90ZWN0ZWQgaGFuZGxlRmV0Y2hFcnJvcihlOiBhbnkpOiBQcm9taXNlPGFueT4ge1xyXG4gICAgbGV0IGVycm9yID0gbmV3IE5ldHdvcmtFcnJvcihlKTtcclxuICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlamVjdChlcnJvcik7XHJcbiAgfVxyXG5cclxuICByZXNwb25zZUhhc0NvbnRlbnQocmVzcG9uc2U6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgbGV0IGNvbnRlbnRUeXBlID0gcmVzcG9uc2UuaGVhZGVycy5nZXQoJ0NvbnRlbnQtVHlwZScpO1xyXG4gICAgcmV0dXJuIGNvbnRlbnRUeXBlICYmIGNvbnRlbnRUeXBlLmluZGV4T2YoJ2FwcGxpY2F0aW9uL3ZuZC5hcGkranNvbicpID4gLTE7XHJcbiAgfVxyXG5cclxuICByZXNvdXJjZU5hbWVzcGFjZSh0eXBlPzogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLm5hbWVzcGFjZTtcclxuICB9XHJcblxyXG4gIHJlc291cmNlSG9zdCh0eXBlPzogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLmhvc3Q7XHJcbiAgfVxyXG5cclxuICByZXNvdXJjZVBhdGgodHlwZTogc3RyaW5nLCBpZD86IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICBsZXQgcGF0aCA9IFt0aGlzLnNlcmlhbGl6ZXIucmVzb3VyY2VUeXBlKHR5cGUpXTtcclxuICAgIGlmIChpZCkge1xyXG4gICAgICBsZXQgcmVzb3VyY2VJZCA9IHRoaXMuc2VyaWFsaXplci5yZXNvdXJjZUlkKHR5cGUsIGlkKTtcclxuICAgICAgaWYgKHJlc291cmNlSWQpIHtcclxuICAgICAgICBwYXRoLnB1c2gocmVzb3VyY2VJZCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBwYXRoLmpvaW4oJy8nKTtcclxuICB9XHJcblxyXG4gIHJlc291cmNlVVJMKHR5cGU6IHN0cmluZywgaWQ/OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgbGV0IGhvc3QgPSB0aGlzLnJlc291cmNlSG9zdCh0eXBlKTtcclxuICAgIGxldCBuYW1lc3BhY2UgPSB0aGlzLnJlc291cmNlTmFtZXNwYWNlKHR5cGUpO1xyXG4gICAgbGV0IHVybDogc3RyaW5nW10gPSBbXTtcclxuXHJcbiAgICBpZiAoaG9zdCkgeyB1cmwucHVzaChob3N0KTsgfVxyXG4gICAgaWYgKG5hbWVzcGFjZSkgeyB1cmwucHVzaChuYW1lc3BhY2UpOyB9XHJcbiAgICB1cmwucHVzaCh0aGlzLnJlc291cmNlUGF0aCh0eXBlLCBpZCkpO1xyXG5cclxuICAgIGlmICghaG9zdCkgeyB1cmwudW5zaGlmdCgnJyk7IH1cclxuXHJcbiAgICByZXR1cm4gdXJsLmpvaW4oJy8nKTtcclxuICB9XHJcblxyXG4gIHJlc291cmNlUmVsYXRpb25zaGlwVVJMKHR5cGU6IHN0cmluZywgaWQ6IHN0cmluZywgcmVsYXRpb25zaGlwOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMucmVzb3VyY2VVUkwodHlwZSwgaWQpICtcclxuICAgICAgICAgICAnL3JlbGF0aW9uc2hpcHMvJyArIHRoaXMuc2VyaWFsaXplci5yZXNvdXJjZVJlbGF0aW9uc2hpcCh0eXBlLCByZWxhdGlvbnNoaXApO1xyXG4gIH1cclxuXHJcbiAgcmVsYXRlZFJlc291cmNlVVJMKHR5cGU6IHN0cmluZywgaWQ6IHN0cmluZywgcmVsYXRpb25zaGlwOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMucmVzb3VyY2VVUkwodHlwZSwgaWQpICtcclxuICAgICAgICAgICAnLycgKyB0aGlzLnNlcmlhbGl6ZXIucmVzb3VyY2VSZWxhdGlvbnNoaXAodHlwZSwgcmVsYXRpb25zaGlwKTtcclxuICB9XHJcblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgLy8gUHJpdmF0ZSBtZXRob2RzXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgcHJvdGVjdGVkIF9wcm9jZXNzUmVxdWVzdHMocmVxdWVzdHMsIHByb2Nlc3NvcnMpOiBQcm9taXNlPFRyYW5zZm9ybVtdPiB7XHJcbiAgICBsZXQgdHJhbnNmb3JtczogVHJhbnNmb3JtW10gPSBbXTtcclxuICAgIGxldCByZXN1bHQ6IFByb21pc2U8dm9pZD4gPSBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKTtcclxuXHJcbiAgICByZXF1ZXN0cy5mb3JFYWNoKHJlcXVlc3QgPT4ge1xyXG4gICAgICBsZXQgcHJvY2Vzc29yID0gcHJvY2Vzc29yc1tyZXF1ZXN0Lm9wXTtcclxuXHJcbiAgICAgIHJlc3VsdCA9IHJlc3VsdC50aGVuKCgpID0+IHtcclxuICAgICAgICByZXR1cm4gcHJvY2Vzc29yKHRoaXMsIHJlcXVlc3QpXHJcbiAgICAgICAgICAudGhlbihhZGRpdGlvbmFsVHJhbnNmb3JtcyA9PiB7XHJcbiAgICAgICAgICAgIGlmIChhZGRpdGlvbmFsVHJhbnNmb3Jtcykge1xyXG4gICAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KHRyYW5zZm9ybXMsIGFkZGl0aW9uYWxUcmFuc2Zvcm1zKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdC50aGVuKCgpID0+IHRyYW5zZm9ybXMpO1xyXG4gIH1cclxufVxyXG4iXX0=