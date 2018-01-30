"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@orbit/utils");
var data_1 = require("@orbit/data");
var request_settings_1 = require("./request-settings");
function deserialize(source, document) {
    var deserialized = source.serializer.deserializeDocument(document);
    var records = utils_1.toArray(deserialized.data);
    if (deserialized.included) {
        Array.prototype.push.apply(records, deserialized.included);
    }
    var operations = records.map(function (record) {
        return {
            op: 'replaceRecord',
            record: record
        };
    });
    return [data_1.buildTransform(operations)];
}
exports.PullOperators = {
    findRecord: function (source, query) {
        var expression = query.expression;
        var record = expression.record;
        var requestOptions = customRequestOptions(source, query);
        var settings = request_settings_1.buildFetchSettings(requestOptions);
        return source.fetch(source.resourceURL(record.type, record.id), settings).then(function (data) {
            return deserialize(source, data);
        });
    },
    findRecords: function (source, query) {
        var expression = query.expression;
        var type = expression.type;
        var requestOptions = {};
        if (expression.filter) {
            requestOptions.filter = buildFilterParam(source, expression.filter);
        }
        if (expression.sort) {
            requestOptions.sort = buildSortParam(source, expression.sort);
        }
        if (expression.page) {
            requestOptions.page = expression.page;
        }
        requestOptions = utils_1.merge(requestOptions, customRequestOptions(source, query));
        var settings = request_settings_1.buildFetchSettings(requestOptions);
        return source.fetch(source.resourceURL(type), settings).then(function (data) {
            return deserialize(source, data);
        });
    },
    findRelatedRecord: function (source, query) {
        var expression = query.expression;
        var record = expression.record,
            relationship = expression.relationship;
        var requestOptions = customRequestOptions(source, query);
        var settings = request_settings_1.buildFetchSettings(requestOptions);
        return source.fetch(source.relatedResourceURL(record.type, record.id, relationship), settings).then(function (data) {
            return deserialize(source, data);
        });
    },
    findRelatedRecords: function (source, query) {
        var expression = query.expression;
        var record = expression.record,
            relationship = expression.relationship;
        var requestOptions = customRequestOptions(source, query);
        var settings = request_settings_1.buildFetchSettings(requestOptions);
        return source.fetch(source.relatedResourceURL(record.type, record.id, relationship), settings).then(function (data) {
            return deserialize(source, data);
        });
    }
};
function customRequestOptions(source, query) {
    var requestOptions = {};
    var queryOptions = utils_1.deepGet(query, ['options', 'sources', source.name]) || {};
    if (queryOptions.include) {
        requestOptions.include = queryOptions.include.join(',');
    }
    if (queryOptions.timeout) {
        requestOptions.timeout = queryOptions.timeout;
    }
    return requestOptions;
}
function buildFilterParam(source, filterSpecifiers) {
    var filters = {};
    filterSpecifiers.forEach(function (filterSpecifier) {
        if (filterSpecifier.kind === 'attribute' && filterSpecifier.op === 'equal') {
            var attributeFilter = filterSpecifier;
            // Note: We don't know the `type` of the attribute here, so passing `null`
            var resourceAttribute = source.serializer.resourceAttribute(null, attributeFilter.attribute);
            filters[resourceAttribute] = attributeFilter.value;
        } else {
            throw new data_1.QueryExpressionParseError('Filter operation ${specifier.op} not recognized for JSONAPISource.', filterSpecifier);
        }
    });
    return filters;
}
function buildSortParam(source, sortSpecifiers) {
    return sortSpecifiers.map(function (sortSpecifier) {
        if (sortSpecifier.kind === 'attribute') {
            var attributeSort = sortSpecifier;
            // Note: We don't know the `type` of the attribute here, so passing `null`
            var resourceAttribute = source.serializer.resourceAttribute(null, attributeSort.attribute);
            return (sortSpecifier.order === 'descending' ? '-' : '') + resourceAttribute;
        }
        throw new data_1.QueryExpressionParseError('Sort specifier ${sortSpecifier.kind} not recognized for JSONAPISource.', sortSpecifier);
    }).join(',');
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVsbC1vcGVyYXRvcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvbGliL3B1bGwtb3BlcmF0b3JzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHNCQUE2RDtBQUM3RCxxQkFjcUI7QUFJckIsaUNBQXdFO0FBRXhFLHFCQUFxQixBQUFxQixRQUFFLEFBQXlCLFVBQ25FO1FBQU0sQUFBWSxlQUFHLEFBQU0sT0FBQyxBQUFVLFdBQUMsQUFBbUIsb0JBQUMsQUFBUSxBQUFDLEFBQUMsQUFDckU7UUFBTSxBQUFPLFVBQUcsUUFBTyxRQUFDLEFBQVksYUFBQyxBQUFJLEFBQUMsQUFBQyxBQUUzQyxBQUFFLEFBQUM7UUFBQyxBQUFZLGFBQUMsQUFBUSxBQUFDLFVBQUMsQUFBQyxBQUMxQixBQUFLO2NBQUMsQUFBUyxVQUFDLEFBQUksS0FBQyxBQUFLLE1BQUMsQUFBTyxTQUFFLEFBQVksYUFBQyxBQUFRLEFBQUMsQUFBQyxBQUM3RCxBQUFDO0FBRUQ7UUFBTSxBQUFVLHFCQUFXLEFBQUcsSUFBQyxVQUFBLEFBQU0sUUFDbkMsQUFBTTs7Z0JBQ0EsQUFBZSxBQUNuQixBQUFNO29CQUZELEFBRUMsQUFDUCxBQUFDLEFBQ0osQUFBQyxBQUFDLEFBQUM7QUFIQyxBQUFFO0FBRmEsQUFBTyxBQU8xQixBQUFNO1dBQUMsQ0FBQyxPQUFjLGVBQUMsQUFBVSxBQUFDLEFBQUMsQUFBQyxBQUN0QyxBQUFDOztBQU1ZLFFBQUEsQUFBYTswQkFDYixBQUFxQixRQUFFLEFBQVksT0FDNUM7WUFBTSxBQUFVLGFBQUcsQUFBSyxNQUFDLEFBQXdCLEFBQUMsQUFDMUM7WUFBQSxvQkFBTSxBQUFnQixBQUU5QjtZQUFNLEFBQWMsaUJBQUcsQUFBb0IscUJBQUMsQUFBTSxRQUFFLEFBQUssQUFBQyxBQUFDLEFBQzNEO1lBQU0sQUFBUSxXQUFHLG1CQUFrQixtQkFBQyxBQUFjLEFBQUMsQUFBQyxBQUVwRCxBQUFNO3NCQUFRLEFBQUssTUFBQyxBQUFN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LEFBQWUsZ0JBQUMsQUFBSyxBQUFDLEFBQ3JELEFBQUMsQUFBQyxBQUFJO2VBQUMsQUFBQyxBQUNOO2tCQUFNLElBQUksT0FBeUIsMEJBQUMsQUFBb0Usc0VBQUUsQUFBZSxBQUFDLEFBQUMsQUFDN0gsQUFBQyxBQUNIO0FBQUMsQUFBQyxBQUFDO0FBRUgsQUFBTTtXQUFDLEFBQU8sQUFBQyxBQUNqQixBQUFDOztBQUVELHdCQUF3QixBQUFxQixRQUFFLEFBQStCLGdCQUM1RSxBQUFNOzBCQUFnQixBQUFHLElBQUMsVUFBQSxBQUFhLGVBQ3JDLEFBQUUsQUFBQztZQUFDLEFBQWEsY0FBQyxBQUFJLFNBQUssQUFBVyxBQUFDLGFBQUMsQUFBQyxBQUN2QztnQkFBTSxBQUFhLGdCQUFHLEFBQXVDLEFBQUMsQUFFOUQsQUFBMEU7QUFDMUU7Z0JBQU0sQUFBaUIsb0JBQUcsQUFBTSxPQUFDLEFBQVUsV0FBQyxBQUFpQixrQkFBQyxBQUFJLE1BQUUsQUFBYSxjQUFDLEFBQVMsQUFBQyxBQUFDLEFBQzdGLEFBQU07bUJBQUMsQ0FBQyxBQUFhLGNBQUMsQUFBSyxVQUFLLEFBQVksZUFBRyxBQUFHLE1BQUcsQUFBRSxBQUFDLE1BQUcsQUFBaUIsQUFBQyxBQUMvRSxBQUFDO0FBQ0Q7Y0FBTSxJQUFJLE9BQXlCLDBCQUFDLEFBQXdFLDBFQUFFLEFBQWEsQUFBQyxBQUFDLEFBQy9ILEFBQUMsQUFBQztBQVRLLEFBQWMsT0FTbEIsQUFBSSxLQUFDLEFBQUcsQUFBQyxBQUFDLEFBQ2YsQUFBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpY3QsIHRvQXJyYXksIG1lcmdlLCBkZWVwR2V0IH0gZnJvbSAnQG9yYml0L3V0aWxzJztcclxuaW1wb3J0IHtcclxuICBRdWVyeSxcclxuICBRdWVyeUV4cHJlc3Npb24sXHJcbiAgUXVlcnlFeHByZXNzaW9uUGFyc2VFcnJvcixcclxuICBUcmFuc2Zvcm0sXHJcbiAgRmluZFJlY29yZCxcclxuICBGaW5kUmVjb3JkcyxcclxuICBGaW5kUmVsYXRlZFJlY29yZCxcclxuICBGaW5kUmVsYXRlZFJlY29yZHMsXHJcbiAgRmlsdGVyU3BlY2lmaWVyLFxyXG4gIFNvcnRTcGVjaWZpZXIsXHJcbiAgQXR0cmlidXRlRmlsdGVyU3BlY2lmaWVyLFxyXG4gIEF0dHJpYnV0ZVNvcnRTcGVjaWZpZXIsXHJcbiAgYnVpbGRUcmFuc2Zvcm1cclxufSBmcm9tICdAb3JiaXQvZGF0YSc7XHJcbmltcG9ydCBKU09OQVBJU291cmNlIGZyb20gJy4uL2pzb25hcGktc291cmNlJztcclxuaW1wb3J0IHsgRGVzZXJpYWxpemVkRG9jdW1lbnQgfSBmcm9tICcuLi9qc29uYXBpLXNlcmlhbGl6ZXInO1xyXG5pbXBvcnQgeyBKU09OQVBJRG9jdW1lbnQgfSBmcm9tICcuLi9qc29uYXBpLWRvY3VtZW50JztcclxuaW1wb3J0IHsgUmVxdWVzdE9wdGlvbnMsIGJ1aWxkRmV0Y2hTZXR0aW5ncyB9IGZyb20gJy4vcmVxdWVzdC1zZXR0aW5ncyc7XHJcblxyXG5mdW5jdGlvbiBkZXNlcmlhbGl6ZShzb3VyY2U6IEpTT05BUElTb3VyY2UsIGRvY3VtZW50OiBKU09OQVBJRG9jdW1lbnQpOiBUcmFuc2Zvcm1bXSB7XHJcbiAgY29uc3QgZGVzZXJpYWxpemVkID0gc291cmNlLnNlcmlhbGl6ZXIuZGVzZXJpYWxpemVEb2N1bWVudChkb2N1bWVudCk7XHJcbiAgY29uc3QgcmVjb3JkcyA9IHRvQXJyYXkoZGVzZXJpYWxpemVkLmRhdGEpO1xyXG5cclxuICBpZiAoZGVzZXJpYWxpemVkLmluY2x1ZGVkKSB7XHJcbiAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShyZWNvcmRzLCBkZXNlcmlhbGl6ZWQuaW5jbHVkZWQpO1xyXG4gIH1cclxuXHJcbiAgY29uc3Qgb3BlcmF0aW9ucyA9IHJlY29yZHMubWFwKHJlY29yZCA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBvcDogJ3JlcGxhY2VSZWNvcmQnLFxyXG4gICAgICByZWNvcmRcclxuICAgIH07XHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiBbYnVpbGRUcmFuc2Zvcm0ob3BlcmF0aW9ucyldO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFB1bGxPcGVyYXRvciB7XHJcbiAgKHNvdXJjZTogSlNPTkFQSVNvdXJjZSwgcXVlcnk6IFF1ZXJ5KTogYW55O1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgUHVsbE9wZXJhdG9yczogRGljdDxQdWxsT3BlcmF0b3I+ID0ge1xyXG4gIGZpbmRSZWNvcmQoc291cmNlOiBKU09OQVBJU291cmNlLCBxdWVyeTogUXVlcnkpIHtcclxuICAgIGNvbnN0IGV4cHJlc3Npb24gPSBxdWVyeS5leHByZXNzaW9uIGFzIEZpbmRSZWNvcmQ7XHJcbiAgICBjb25zdCB7IHJlY29yZCB9ID0gZXhwcmVzc2lvbjtcclxuXHJcbiAgICBjb25zdCByZXF1ZXN0T3B0aW9ucyA9IGN1c3RvbVJlcXVlc3RPcHRpb25zKHNvdXJjZSwgcXVlcnkpO1xyXG4gICAgY29uc3Qgc2V0dGluZ3MgPSBidWlsZEZldGNoU2V0dGluZ3MocmVxdWVzdE9wdGlvbnMpO1xyXG5cclxuICAgIHJldHVybiBzb3VyY2UuZmV0Y2goc291cmNlLnJlc291cmNlVVJMKHJlY29yZC50eXBlLCByZWNvcmQuaWQpLCBzZXR0aW5ncylcclxuICAgICAgLnRoZW4oZGF0YSA9PiBkZXNlcmlhbGl6ZShzb3VyY2UsIGRhdGEpKTtcclxuICB9LFxyXG5cclxuICBmaW5kUmVjb3Jkcyhzb3VyY2U6IEpTT05BUElTb3VyY2UsIHF1ZXJ5OiBRdWVyeSkge1xyXG4gICAgY29uc3QgZXhwcmVzc2lvbiA9IHF1ZXJ5LmV4cHJlc3Npb24gYXMgRmluZFJlY29yZHM7XHJcbiAgICBjb25zdCB7IHR5cGUgfSA9IGV4cHJlc3Npb247XHJcblxyXG4gICAgbGV0IHJlcXVlc3RPcHRpb25zOiBSZXF1ZXN0T3B0aW9ucyA9IHt9O1xyXG5cclxuICAgIGlmIChleHByZXNzaW9uLmZpbHRlcikge1xyXG4gICAgICByZXF1ZXN0T3B0aW9ucy5maWx0ZXIgPSBidWlsZEZpbHRlclBhcmFtKHNvdXJjZSwgZXhwcmVzc2lvbi5maWx0ZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChleHByZXNzaW9uLnNvcnQpIHtcclxuICAgICAgcmVxdWVzdE9wdGlvbnMuc29ydCA9IGJ1aWxkU29ydFBhcmFtKHNvdXJjZSwgZXhwcmVzc2lvbi5zb3J0KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZXhwcmVzc2lvbi5wYWdlKSB7XHJcbiAgICAgIHJlcXVlc3RPcHRpb25zLnBhZ2UgPSBleHByZXNzaW9uLnBhZ2U7XHJcbiAgICB9XHJcblxyXG4gICAgcmVxdWVzdE9wdGlvbnMgPSBtZXJnZShcclxuICAgICAgcmVxdWVzdE9wdGlvbnMsXHJcbiAgICAgIGN1c3RvbVJlcXVlc3RPcHRpb25zKHNvdXJjZSwgcXVlcnkpKTtcclxuXHJcbiAgICBjb25zdCBzZXR0aW5ncyA9IGJ1aWxkRmV0Y2hTZXR0aW5ncyhyZXF1ZXN0T3B0aW9ucyk7XHJcblxyXG4gICAgcmV0dXJuIHNvdXJjZS5mZXRjaChzb3VyY2UucmVzb3VyY2VVUkwodHlwZSksIHNldHRpbmdzKVxyXG4gICAgICAudGhlbihkYXRhID0+IGRlc2VyaWFsaXplKHNvdXJjZSwgZGF0YSkpO1xyXG4gIH0sXHJcblxyXG4gIGZpbmRSZWxhdGVkUmVjb3JkKHNvdXJjZTogSlNPTkFQSVNvdXJjZSwgcXVlcnk6IFF1ZXJ5KSB7XHJcbiAgICBjb25zdCBleHByZXNzaW9uID0gcXVlcnkuZXhwcmVzc2lvbiBhcyBGaW5kUmVsYXRlZFJlY29yZDtcclxuICAgIGNvbnN0IHsgcmVjb3JkLCByZWxhdGlvbnNoaXAgfSA9IGV4cHJlc3Npb247XHJcblxyXG4gICAgY29uc3QgcmVxdWVzdE9wdGlvbnMgPSBjdXN0b21SZXF1ZXN0T3B0aW9ucyhzb3VyY2UsIHF1ZXJ5KTtcclxuICAgIGNvbnN0IHNldHRpbmdzID0gYnVpbGRGZXRjaFNldHRpbmdzKHJlcXVlc3RPcHRpb25zKTtcclxuXHJcbiAgICByZXR1cm4gc291cmNlLmZldGNoKHNvdXJjZS5yZWxhdGVkUmVzb3VyY2VVUkwocmVjb3JkLnR5cGUsIHJlY29yZC5pZCwgcmVsYXRpb25zaGlwKSwgc2V0dGluZ3MpXHJcbiAgICAgIC50aGVuKGRhdGEgPT4gZGVzZXJpYWxpemUoc291cmNlLCBkYXRhKSk7XHJcbiAgfSxcclxuXHJcbiAgZmluZFJlbGF0ZWRSZWNvcmRzKHNvdXJjZTogSlNPTkFQSVNvdXJjZSwgcXVlcnk6IFF1ZXJ5KSB7XHJcbiAgICBjb25zdCBleHByZXNzaW9uID0gcXVlcnkuZXhwcmVzc2lvbiBhcyBGaW5kUmVsYXRlZFJlY29yZHM7XHJcbiAgICBjb25zdCB7IHJlY29yZCwgcmVsYXRpb25zaGlwIH0gPSBleHByZXNzaW9uO1xyXG5cclxuICAgIGxldCByZXF1ZXN0T3B0aW9ucyA9IGN1c3RvbVJlcXVlc3RPcHRpb25zKHNvdXJjZSwgcXVlcnkpO1xyXG5cclxuICAgIGNvbnN0IHNldHRpbmdzID0gYnVpbGRGZXRjaFNldHRpbmdzKHJlcXVlc3RPcHRpb25zKTtcclxuXHJcbiAgICByZXR1cm4gc291cmNlLmZldGNoKHNvdXJjZS5yZWxhdGVkUmVzb3VyY2VVUkwocmVjb3JkLnR5cGUsIHJlY29yZC5pZCwgcmVsYXRpb25zaGlwKSwgc2V0dGluZ3MpXHJcbiAgICAgIC50aGVuKGRhdGEgPT4gZGVzZXJpYWxpemUoc291cmNlLCBkYXRhKSk7XHJcbiAgfVxyXG59O1xyXG5cclxuZnVuY3Rpb24gY3VzdG9tUmVxdWVzdE9wdGlvbnMoc291cmNlOiBKU09OQVBJU291cmNlLCBxdWVyeTogUXVlcnkpOiBSZXF1ZXN0T3B0aW9ucyB7XHJcbiAgY29uc3QgcmVxdWVzdE9wdGlvbnM6IFJlcXVlc3RPcHRpb25zID0ge307XHJcblxyXG4gIGNvbnN0IHF1ZXJ5T3B0aW9ucyA9IGRlZXBHZXQocXVlcnksIFsnb3B0aW9ucycsICdzb3VyY2VzJywgc291cmNlLm5hbWVdKSB8fCB7fTtcclxuXHJcbiAgaWYgKHF1ZXJ5T3B0aW9ucy5pbmNsdWRlKSB7XHJcbiAgICByZXF1ZXN0T3B0aW9ucy5pbmNsdWRlID0gcXVlcnlPcHRpb25zLmluY2x1ZGUuam9pbignLCcpO1xyXG4gIH1cclxuXHJcbiAgaWYgKHF1ZXJ5T3B0aW9ucy50aW1lb3V0KSB7XHJcbiAgICByZXF1ZXN0T3B0aW9ucy50aW1lb3V0ID0gcXVlcnlPcHRpb25zLnRpbWVvdXQ7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gcmVxdWVzdE9wdGlvbnM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGJ1aWxkRmlsdGVyUGFyYW0oc291cmNlOiBKU09OQVBJU291cmNlLCBmaWx0ZXJTcGVjaWZpZXJzOiBGaWx0ZXJTcGVjaWZpZXJbXSkge1xyXG4gIGNvbnN0IGZpbHRlcnMgPSB7fTtcclxuXHJcbiAgZmlsdGVyU3BlY2lmaWVycy5mb3JFYWNoKGZpbHRlclNwZWNpZmllciA9PiB7XHJcbiAgICBpZiAoZmlsdGVyU3BlY2lmaWVyLmtpbmQgPT09ICdhdHRyaWJ1dGUnICYmIGZpbHRlclNwZWNpZmllci5vcCA9PT0gJ2VxdWFsJykge1xyXG4gICAgICBjb25zdCBhdHRyaWJ1dGVGaWx0ZXIgPSBmaWx0ZXJTcGVjaWZpZXIgYXMgQXR0cmlidXRlRmlsdGVyU3BlY2lmaWVyO1xyXG5cclxuICAgICAgLy8gTm90ZTogV2UgZG9uJ3Qga25vdyB0aGUgYHR5cGVgIG9mIHRoZSBhdHRyaWJ1dGUgaGVyZSwgc28gcGFzc2luZyBgbnVsbGBcclxuICAgICAgY29uc3QgcmVzb3VyY2VBdHRyaWJ1dGUgPSBzb3VyY2Uuc2VyaWFsaXplci5yZXNvdXJjZUF0dHJpYnV0ZShudWxsLCBhdHRyaWJ1dGVGaWx0ZXIuYXR0cmlidXRlKTtcclxuICAgICAgZmlsdGVyc1tyZXNvdXJjZUF0dHJpYnV0ZV0gPSBhdHRyaWJ1dGVGaWx0ZXIudmFsdWU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aHJvdyBuZXcgUXVlcnlFeHByZXNzaW9uUGFyc2VFcnJvcignRmlsdGVyIG9wZXJhdGlvbiAke3NwZWNpZmllci5vcH0gbm90IHJlY29nbml6ZWQgZm9yIEpTT05BUElTb3VyY2UuJywgZmlsdGVyU3BlY2lmaWVyKTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgcmV0dXJuIGZpbHRlcnM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGJ1aWxkU29ydFBhcmFtKHNvdXJjZTogSlNPTkFQSVNvdXJjZSwgc29ydFNwZWNpZmllcnM6IFNvcnRTcGVjaWZpZXJbXSkge1xyXG4gIHJldHVybiBzb3J0U3BlY2lmaWVycy5tYXAoc29ydFNwZWNpZmllciA9PiB7XHJcbiAgICBpZiAoc29ydFNwZWNpZmllci5raW5kID09PSAnYXR0cmlidXRlJykge1xyXG4gICAgICBjb25zdCBhdHRyaWJ1dGVTb3J0ID0gc29ydFNwZWNpZmllciBhcyBBdHRyaWJ1dGVTb3J0U3BlY2lmaWVyO1xyXG5cclxuICAgICAgLy8gTm90ZTogV2UgZG9uJ3Qga25vdyB0aGUgYHR5cGVgIG9mIHRoZSBhdHRyaWJ1dGUgaGVyZSwgc28gcGFzc2luZyBgbnVsbGBcclxuICAgICAgY29uc3QgcmVzb3VyY2VBdHRyaWJ1dGUgPSBzb3VyY2Uuc2VyaWFsaXplci5yZXNvdXJjZUF0dHJpYnV0ZShudWxsLCBhdHRyaWJ1dGVTb3J0LmF0dHJpYnV0ZSk7XHJcbiAgICAgIHJldHVybiAoc29ydFNwZWNpZmllci5vcmRlciA9PT0gJ2Rlc2NlbmRpbmcnID8gJy0nIDogJycpICsgcmVzb3VyY2VBdHRyaWJ1dGU7XHJcbiAgICB9XHJcbiAgICB0aHJvdyBuZXcgUXVlcnlFeHByZXNzaW9uUGFyc2VFcnJvcignU29ydCBzcGVjaWZpZXIgJHtzb3J0U3BlY2lmaWVyLmtpbmR9IG5vdCByZWNvZ25pemVkIGZvciBKU09OQVBJU291cmNlLicsIHNvcnRTcGVjaWZpZXIpO1xyXG4gIH0pLmpvaW4oJywnKTtcclxufVxyXG4iXX0=