"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var main_1 = require("./main");
var query_term_1 = require("./query-term");
var utils_1 = require("@orbit/utils");
/**
 * A builder function for creating a Query from its constituent parts.
 *
 * If a `Query` is passed in with an `id` and `expression`, and no replacement
 * `id` or `options` are also passed in, then the `Query` will be returned
 * unchanged.
 *
 * For all other cases, a new `Query` object will be created and returned.
 *
 * Queries will be assigned the specified `queryId` as `id`. If none is
 * specified, a UUID will be generated.
 *
 * @export
 * @param {QueryOrExpression} queryOrExpression
 * @param {object} [queryOptions]
 * @param {string} [queryId]
 * @param {QueryBuilder} [queryBuilder]
 * @returns {Query}
 */
function buildQuery(queryOrExpression, queryOptions, queryId, queryBuilder) {
    if (typeof queryOrExpression === 'function') {
        return buildQuery(queryOrExpression(queryBuilder), queryOptions, queryId);
    } else {
        var query = queryOrExpression;
        var expression = void 0;
        var options = void 0;
        if (utils_1.isObject(query) && query.expression) {
            if (query.id && !queryOptions && !queryId) {
                return query;
            }
            expression = query.expression;
            options = queryOptions || query.options;
        } else {
            if (queryOrExpression instanceof query_term_1.QueryTerm) {
                expression = queryOrExpression.toQueryExpression();
            } else {
                expression = queryOrExpression;
            }
            options = queryOptions;
        }
        var id = queryId || main_1.default.uuid();
        return { expression: expression, options: options, id: id };
    }
}
exports.buildQuery = buildQuery;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzcmMvcXVlcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUJBQTJCO0FBRTNCLDJCQUF5QztBQUV6QyxzQkFBd0M7QUFpQnhDLEFBa0JHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0gsb0JBQTJCLEFBQW9DLG1CQUFFLEFBQXFCLGNBQUUsQUFBZ0IsU0FBRSxBQUEyQixjQUNuSSxBQUFFLEFBQUM7UUFBQyxPQUFPLEFBQWlCLHNCQUFLLEFBQVUsQUFBQyxZQUFDLEFBQUMsQUFDNUMsQUFBTTtlQUFDLEFBQVUsV0FBQyxBQUFpQixrQkFBQyxBQUFZLEFBQUMsZUFBRSxBQUFZLGNBQUUsQUFBTyxBQUFDLEFBQUMsQUFFNUUsQUFBQyxBQUFDLEFBQUk7V0FBQyxBQUFDLEFBQ047WUFBSSxBQUFLLFFBQUcsQUFBMEIsQUFBQyxBQUN2QztZQUFJLEFBQVUsa0JBQWlCLEFBQUMsQUFDaEM7WUFBSSxBQUFPLGVBQVEsQUFBQyxBQUVwQixBQUFFLEFBQUM7WUFBQyxRQUFRLFNBQUMsQUFBSyxBQUFDLFVBQUksQUFBSyxNQUFDLEFBQVUsQUFBQyxZQUFDLEFBQUMsQUFDeEMsQUFBRSxBQUFDO2dCQUFDLEFBQUssTUFBQyxBQUFFLE1BQUksQ0FBQyxBQUFZLGdCQUFJLENBQUMsQUFBTyxBQUFDLFNBQUMsQUFBQyxBQUMxQyxBQUFNO3VCQUFDLEFBQUssQUFBQyxBQUNmLEFBQUM7QUFDRCxBQUFVO3lCQUFHLEFBQUssTUFBQyxBQUFVLEFBQUMsQUFDOUIsQUFBTztzQkFBRyxBQUFZLGdCQUFJLEFBQUssTUFBQyxBQUFPLEFBQUMsQUFDMUMsQUFBQyxBQUFDLEFBQUk7ZUFBQyxBQUFDLEFBQ04sQUFBRSxBQUFDO2dCQUFDLEFBQWlCLDZCQUFZLGFBQVMsQUFBQyxXQUFDLEFBQUMsQUFDM0MsQUFBVTs2QkFBRyxBQUFpQixrQkFBQyxBQUFpQixBQUFFLEFBQUMsQUFDckQsQUFBQyxBQUFDLEFBQUk7bUJBQUMsQUFBQyxBQUNOLEFBQVU7NkJBQUcsQUFBb0MsQUFBQyxBQUNwRCxBQUFDO0FBQ0QsQUFBTztzQkFBRyxBQUFZLEFBQUMsQUFDekIsQUFBQztBQUVEO1lBQUksQUFBRSxLQUFXLEFBQU8sV0FBSSxPQUFLLFFBQUMsQUFBSSxBQUFFLEFBQUMsQUFFekMsQUFBTTtlQUFDLEVBQUUsQUFBVSxZQUFBLFlBQUUsQUFBTyxTQUFBLFNBQUUsQUFBRSxJQUFBLEFBQUUsQUFBQyxBQUNyQyxBQUFDLEFBQ0g7QUFBQzs7QUE1QkQscUJBNEJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE9yYml0IGZyb20gJy4vbWFpbic7XHJcbmltcG9ydCB7IFF1ZXJ5RXhwcmVzc2lvbiB9IGZyb20gJy4vcXVlcnktZXhwcmVzc2lvbic7XHJcbmltcG9ydCB7IFF1ZXJ5VGVybSB9IGZyb20gJy4vcXVlcnktdGVybSc7XHJcbmltcG9ydCBRdWVyeUJ1aWxkZXIgZnJvbSAnLi9xdWVyeS1idWlsZGVyJztcclxuaW1wb3J0IHsgaXNPYmplY3QgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xyXG5cclxuZXhwb3J0IHR5cGUgUXVlcnlCdWlsZGVyRnVuYyA9IChRdWVyeUJ1aWxkZXIpID0+IFF1ZXJ5RXhwcmVzc2lvbjtcclxuZXhwb3J0IHR5cGUgUXVlcnlPckV4cHJlc3Npb24gPSBRdWVyeSB8IFF1ZXJ5RXhwcmVzc2lvbiB8IFF1ZXJ5VGVybSB8IFF1ZXJ5QnVpbGRlckZ1bmM7XHJcblxyXG4vKipcclxuICogUXVlcmllcyBhcmUgdXNlZCB0byBleHRyYWN0IGRhdGEgZnJvbSBhIHNvdXJjZS5cclxuICpcclxuICogQGV4cG9ydFxyXG4gKiBAaW50ZXJmYWNlIFF1ZXJ5XHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIFF1ZXJ5IHtcclxuICBpZDogc3RyaW5nO1xyXG4gIGV4cHJlc3Npb246IFF1ZXJ5RXhwcmVzc2lvbjtcclxuICBvcHRpb25zPzogYW55O1xyXG59XHJcblxyXG4vKipcclxuICogQSBidWlsZGVyIGZ1bmN0aW9uIGZvciBjcmVhdGluZyBhIFF1ZXJ5IGZyb20gaXRzIGNvbnN0aXR1ZW50IHBhcnRzLlxyXG4gKlxyXG4gKiBJZiBhIGBRdWVyeWAgaXMgcGFzc2VkIGluIHdpdGggYW4gYGlkYCBhbmQgYGV4cHJlc3Npb25gLCBhbmQgbm8gcmVwbGFjZW1lbnRcclxuICogYGlkYCBvciBgb3B0aW9uc2AgYXJlIGFsc28gcGFzc2VkIGluLCB0aGVuIHRoZSBgUXVlcnlgIHdpbGwgYmUgcmV0dXJuZWRcclxuICogdW5jaGFuZ2VkLlxyXG4gKlxyXG4gKiBGb3IgYWxsIG90aGVyIGNhc2VzLCBhIG5ldyBgUXVlcnlgIG9iamVjdCB3aWxsIGJlIGNyZWF0ZWQgYW5kIHJldHVybmVkLlxyXG4gKlxyXG4gKiBRdWVyaWVzIHdpbGwgYmUgYXNzaWduZWQgdGhlIHNwZWNpZmllZCBgcXVlcnlJZGAgYXMgYGlkYC4gSWYgbm9uZSBpc1xyXG4gKiBzcGVjaWZpZWQsIGEgVVVJRCB3aWxsIGJlIGdlbmVyYXRlZC5cclxuICpcclxuICogQGV4cG9ydFxyXG4gKiBAcGFyYW0ge1F1ZXJ5T3JFeHByZXNzaW9ufSBxdWVyeU9yRXhwcmVzc2lvblxyXG4gKiBAcGFyYW0ge29iamVjdH0gW3F1ZXJ5T3B0aW9uc11cclxuICogQHBhcmFtIHtzdHJpbmd9IFtxdWVyeUlkXVxyXG4gKiBAcGFyYW0ge1F1ZXJ5QnVpbGRlcn0gW3F1ZXJ5QnVpbGRlcl1cclxuICogQHJldHVybnMge1F1ZXJ5fVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkUXVlcnkocXVlcnlPckV4cHJlc3Npb246IFF1ZXJ5T3JFeHByZXNzaW9uLCBxdWVyeU9wdGlvbnM/OiBvYmplY3QsIHF1ZXJ5SWQ/OiBzdHJpbmcsIHF1ZXJ5QnVpbGRlcj86IFF1ZXJ5QnVpbGRlcik6IFF1ZXJ5IHtcclxuICBpZiAodHlwZW9mIHF1ZXJ5T3JFeHByZXNzaW9uID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICByZXR1cm4gYnVpbGRRdWVyeShxdWVyeU9yRXhwcmVzc2lvbihxdWVyeUJ1aWxkZXIpLCBxdWVyeU9wdGlvbnMsIHF1ZXJ5SWQpO1xyXG5cclxuICB9IGVsc2Uge1xyXG4gICAgbGV0IHF1ZXJ5ID0gcXVlcnlPckV4cHJlc3Npb24gYXMgUXVlcnk7XHJcbiAgICBsZXQgZXhwcmVzc2lvbjogUXVlcnlFeHByZXNzaW9uO1xyXG4gICAgbGV0IG9wdGlvbnM6IG9iamVjdDtcclxuXHJcbiAgICBpZiAoaXNPYmplY3QocXVlcnkpICYmIHF1ZXJ5LmV4cHJlc3Npb24pIHtcclxuICAgICAgaWYgKHF1ZXJ5LmlkICYmICFxdWVyeU9wdGlvbnMgJiYgIXF1ZXJ5SWQpIHtcclxuICAgICAgICByZXR1cm4gcXVlcnk7XHJcbiAgICAgIH1cclxuICAgICAgZXhwcmVzc2lvbiA9IHF1ZXJ5LmV4cHJlc3Npb247XHJcbiAgICAgIG9wdGlvbnMgPSBxdWVyeU9wdGlvbnMgfHwgcXVlcnkub3B0aW9ucztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmIChxdWVyeU9yRXhwcmVzc2lvbiBpbnN0YW5jZW9mIFF1ZXJ5VGVybSkge1xyXG4gICAgICAgIGV4cHJlc3Npb24gPSBxdWVyeU9yRXhwcmVzc2lvbi50b1F1ZXJ5RXhwcmVzc2lvbigpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGV4cHJlc3Npb24gPSBxdWVyeU9yRXhwcmVzc2lvbiBhcyBRdWVyeUV4cHJlc3Npb247XHJcbiAgICAgIH1cclxuICAgICAgb3B0aW9ucyA9IHF1ZXJ5T3B0aW9ucztcclxuICAgIH1cclxuXHJcbiAgICBsZXQgaWQ6IHN0cmluZyA9IHF1ZXJ5SWQgfHwgT3JiaXQudXVpZCgpO1xyXG5cclxuICAgIHJldHVybiB7IGV4cHJlc3Npb24sIG9wdGlvbnMsIGlkIH07XHJcbiAgfVxyXG59XHJcbiJdfQ==