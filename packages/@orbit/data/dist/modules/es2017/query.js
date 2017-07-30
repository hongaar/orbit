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
    }
    else {
        var query = queryOrExpression;
        var expression = void 0;
        var options = void 0;
        if (utils_1.isObject(query) && query.expression) {
            if (query.id && !queryOptions && !queryId) {
                return query;
            }
            expression = query.expression;
            options = queryOptions || query.options;
        }
        else {
            if (queryOrExpression instanceof query_term_1.QueryTerm) {
                expression = queryOrExpression.toQueryExpression();
            }
            else {
                expression = queryOrExpression;
            }
            options = queryOptions;
        }
        var id = queryId || main_1.default.uuid();
        return { expression: expression, options: options, id: id };
    }
}
exports.buildQuery = buildQuery;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzcmMvcXVlcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBMkI7QUFFM0IsMkNBQXlDO0FBRXpDLHNDQUF3QztBQWlCeEM7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQWtCRztBQUNILG9CQUEyQixpQkFBb0MsRUFBRSxZQUFxQixFQUFFLE9BQWdCLEVBQUUsWUFBMkI7SUFDbkksRUFBRSxDQUFDLENBQUMsT0FBTyxpQkFBaUIsS0FBSyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQzVDLE1BQU0sQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUMsWUFBWSxDQUFDLEVBQUUsWUFBWSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBRTVFLENBQUM7SUFBQyxJQUFJLENBQUMsQ0FBQztRQUNOLElBQUksS0FBSyxHQUFHLGlCQUEwQixDQUFDO1FBQ3ZDLElBQUksVUFBVSxTQUFpQixDQUFDO1FBQ2hDLElBQUksT0FBTyxTQUFRLENBQUM7UUFFcEIsRUFBRSxDQUFDLENBQUMsZ0JBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUN4QyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxJQUFJLENBQUMsWUFBWSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDMUMsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUNmLENBQUM7WUFDRCxVQUFVLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQztZQUM5QixPQUFPLEdBQUcsWUFBWSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUM7UUFDMUMsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sRUFBRSxDQUFDLENBQUMsaUJBQWlCLFlBQVksc0JBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQzNDLFVBQVUsR0FBRyxpQkFBaUIsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1lBQ3JELENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixVQUFVLEdBQUcsaUJBQW9DLENBQUM7WUFDcEQsQ0FBQztZQUNELE9BQU8sR0FBRyxZQUFZLENBQUM7UUFDekIsQ0FBQztRQUVELElBQUksRUFBRSxHQUFXLE9BQU8sSUFBSSxjQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFekMsTUFBTSxDQUFDLEVBQUUsVUFBVSxZQUFBLEVBQUUsT0FBTyxTQUFBLEVBQUUsRUFBRSxJQUFBLEVBQUUsQ0FBQztJQUNyQyxDQUFDO0FBQ0gsQ0FBQztBQTVCRCxnQ0E0QkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgT3JiaXQgZnJvbSAnLi9tYWluJztcclxuaW1wb3J0IHsgUXVlcnlFeHByZXNzaW9uIH0gZnJvbSAnLi9xdWVyeS1leHByZXNzaW9uJztcclxuaW1wb3J0IHsgUXVlcnlUZXJtIH0gZnJvbSAnLi9xdWVyeS10ZXJtJztcclxuaW1wb3J0IFF1ZXJ5QnVpbGRlciBmcm9tICcuL3F1ZXJ5LWJ1aWxkZXInO1xyXG5pbXBvcnQgeyBpc09iamVjdCB9IGZyb20gJ0BvcmJpdC91dGlscyc7XHJcblxyXG5leHBvcnQgdHlwZSBRdWVyeUJ1aWxkZXJGdW5jID0gKFF1ZXJ5QnVpbGRlcikgPT4gUXVlcnlFeHByZXNzaW9uO1xyXG5leHBvcnQgdHlwZSBRdWVyeU9yRXhwcmVzc2lvbiA9IFF1ZXJ5IHwgUXVlcnlFeHByZXNzaW9uIHwgUXVlcnlUZXJtIHwgUXVlcnlCdWlsZGVyRnVuYztcclxuXHJcbi8qKlxyXG4gKiBRdWVyaWVzIGFyZSB1c2VkIHRvIGV4dHJhY3QgZGF0YSBmcm9tIGEgc291cmNlLlxyXG4gKlxyXG4gKiBAZXhwb3J0XHJcbiAqIEBpbnRlcmZhY2UgUXVlcnlcclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgUXVlcnkge1xyXG4gIGlkOiBzdHJpbmc7XHJcbiAgZXhwcmVzc2lvbjogUXVlcnlFeHByZXNzaW9uO1xyXG4gIG9wdGlvbnM/OiBhbnk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBIGJ1aWxkZXIgZnVuY3Rpb24gZm9yIGNyZWF0aW5nIGEgUXVlcnkgZnJvbSBpdHMgY29uc3RpdHVlbnQgcGFydHMuXHJcbiAqXHJcbiAqIElmIGEgYFF1ZXJ5YCBpcyBwYXNzZWQgaW4gd2l0aCBhbiBgaWRgIGFuZCBgZXhwcmVzc2lvbmAsIGFuZCBubyByZXBsYWNlbWVudFxyXG4gKiBgaWRgIG9yIGBvcHRpb25zYCBhcmUgYWxzbyBwYXNzZWQgaW4sIHRoZW4gdGhlIGBRdWVyeWAgd2lsbCBiZSByZXR1cm5lZFxyXG4gKiB1bmNoYW5nZWQuXHJcbiAqXHJcbiAqIEZvciBhbGwgb3RoZXIgY2FzZXMsIGEgbmV3IGBRdWVyeWAgb2JqZWN0IHdpbGwgYmUgY3JlYXRlZCBhbmQgcmV0dXJuZWQuXHJcbiAqXHJcbiAqIFF1ZXJpZXMgd2lsbCBiZSBhc3NpZ25lZCB0aGUgc3BlY2lmaWVkIGBxdWVyeUlkYCBhcyBgaWRgLiBJZiBub25lIGlzXHJcbiAqIHNwZWNpZmllZCwgYSBVVUlEIHdpbGwgYmUgZ2VuZXJhdGVkLlxyXG4gKlxyXG4gKiBAZXhwb3J0XHJcbiAqIEBwYXJhbSB7UXVlcnlPckV4cHJlc3Npb259IHF1ZXJ5T3JFeHByZXNzaW9uXHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBbcXVlcnlPcHRpb25zXVxyXG4gKiBAcGFyYW0ge3N0cmluZ30gW3F1ZXJ5SWRdXHJcbiAqIEBwYXJhbSB7UXVlcnlCdWlsZGVyfSBbcXVlcnlCdWlsZGVyXVxyXG4gKiBAcmV0dXJucyB7UXVlcnl9XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRRdWVyeShxdWVyeU9yRXhwcmVzc2lvbjogUXVlcnlPckV4cHJlc3Npb24sIHF1ZXJ5T3B0aW9ucz86IG9iamVjdCwgcXVlcnlJZD86IHN0cmluZywgcXVlcnlCdWlsZGVyPzogUXVlcnlCdWlsZGVyKTogUXVlcnkge1xyXG4gIGlmICh0eXBlb2YgcXVlcnlPckV4cHJlc3Npb24gPT09ICdmdW5jdGlvbicpIHtcclxuICAgIHJldHVybiBidWlsZFF1ZXJ5KHF1ZXJ5T3JFeHByZXNzaW9uKHF1ZXJ5QnVpbGRlciksIHF1ZXJ5T3B0aW9ucywgcXVlcnlJZCk7XHJcblxyXG4gIH0gZWxzZSB7XHJcbiAgICBsZXQgcXVlcnkgPSBxdWVyeU9yRXhwcmVzc2lvbiBhcyBRdWVyeTtcclxuICAgIGxldCBleHByZXNzaW9uOiBRdWVyeUV4cHJlc3Npb247XHJcbiAgICBsZXQgb3B0aW9uczogb2JqZWN0O1xyXG5cclxuICAgIGlmIChpc09iamVjdChxdWVyeSkgJiYgcXVlcnkuZXhwcmVzc2lvbikge1xyXG4gICAgICBpZiAocXVlcnkuaWQgJiYgIXF1ZXJ5T3B0aW9ucyAmJiAhcXVlcnlJZCkge1xyXG4gICAgICAgIHJldHVybiBxdWVyeTtcclxuICAgICAgfVxyXG4gICAgICBleHByZXNzaW9uID0gcXVlcnkuZXhwcmVzc2lvbjtcclxuICAgICAgb3B0aW9ucyA9IHF1ZXJ5T3B0aW9ucyB8fCBxdWVyeS5vcHRpb25zO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKHF1ZXJ5T3JFeHByZXNzaW9uIGluc3RhbmNlb2YgUXVlcnlUZXJtKSB7XHJcbiAgICAgICAgZXhwcmVzc2lvbiA9IHF1ZXJ5T3JFeHByZXNzaW9uLnRvUXVlcnlFeHByZXNzaW9uKCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZXhwcmVzc2lvbiA9IHF1ZXJ5T3JFeHByZXNzaW9uIGFzIFF1ZXJ5RXhwcmVzc2lvbjtcclxuICAgICAgfVxyXG4gICAgICBvcHRpb25zID0gcXVlcnlPcHRpb25zO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBpZDogc3RyaW5nID0gcXVlcnlJZCB8fCBPcmJpdC51dWlkKCk7XHJcblxyXG4gICAgcmV0dXJuIHsgZXhwcmVzc2lvbiwgb3B0aW9ucywgaWQgfTtcclxuICB9XHJcbn1cclxuIl19