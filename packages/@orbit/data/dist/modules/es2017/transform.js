"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable valid-jsdoc */
var main_1 = require("./main");
var utils_1 = require("@orbit/utils");
/**
 * A builder function for creating a Transform from its constituent parts.
 *
 * If a `Transform` is passed in with an `id` and `operations`, and no
 * replacement `id` or `options` are also passed in, then the `Transform`
 * will be returned unchanged.
 *
 * For all other cases, a new `Transform` object will be created and returned.
 *
 * Transforms will be assigned the specified `transformId` as `id`. If none
 * is specified, a UUID will be generated.
 *
 * @export
 * @param {TransformOrOperations} transformOrOperations
 * @param {object} [transformOptions]
 * @param {string} [transformId] Unique id for this transform (otherwise a UUID will be assigned)
 * @param {TransformBuilder} [transformBuilder]
 * @returns {Transform}
 */
function buildTransform(transformOrOperations, transformOptions, transformId, transformBuilder) {
    if (typeof transformOrOperations === 'function') {
        return buildTransform(transformOrOperations(transformBuilder), transformOptions, transformId);
    }
    else {
        var transform = transformOrOperations;
        var operations = void 0;
        var options = void 0;
        if (utils_1.isObject(transform) && transform.operations) {
            if (transform.id && !transformOptions && !transformId) {
                return transform;
            }
            operations = transform.operations;
            options = transformOptions || transform.options;
        }
        else {
            if (utils_1.isArray(transformOrOperations)) {
                operations = transformOrOperations;
            }
            else {
                operations = [transformOrOperations];
            }
            options = transformOptions;
        }
        var id = transformId || main_1.default.uuid();
        return { operations: operations, options: options, id: id };
    }
}
exports.buildTransform = buildTransform;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3JtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3JjL3RyYW5zZm9ybS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGdDQUFnQztBQUNoQywrQkFBMkI7QUFFM0Isc0NBQTBEO0FBa0IxRDs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBa0JHO0FBQ0gsd0JBQStCLHFCQUE0QyxFQUFFLGdCQUF5QixFQUFFLFdBQW9CLEVBQUUsZ0JBQW1DO0lBQy9KLEVBQUUsQ0FBQyxDQUFDLE9BQU8scUJBQXFCLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQztRQUNoRCxNQUFNLENBQUMsY0FBYyxDQUFDLHFCQUFxQixDQUFDLGdCQUFnQixDQUFDLEVBQUUsZ0JBQWdCLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFFaEcsQ0FBQztJQUFDLElBQUksQ0FBQyxDQUFDO1FBQ04sSUFBSSxTQUFTLEdBQUcscUJBQWtDLENBQUM7UUFDbkQsSUFBSSxVQUFVLFNBQWEsQ0FBQztRQUM1QixJQUFJLE9BQU8sU0FBUSxDQUFDO1FBRXBCLEVBQUUsQ0FBQyxDQUFDLGdCQUFRLENBQUMsU0FBUyxDQUFDLElBQUksU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDaEQsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztnQkFDdEQsTUFBTSxDQUFDLFNBQVMsQ0FBQztZQUNuQixDQUFDO1lBQ0QsVUFBVSxHQUFHLFNBQVMsQ0FBQyxVQUFVLENBQUM7WUFDbEMsT0FBTyxHQUFHLGdCQUFnQixJQUFJLFNBQVMsQ0FBQyxPQUFPLENBQUM7UUFDbEQsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sRUFBRSxDQUFDLENBQUMsZUFBTyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNuQyxVQUFVLEdBQUcscUJBQW9DLENBQUM7WUFDcEQsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLFVBQVUsR0FBRyxDQUFDLHFCQUFrQyxDQUFDLENBQUM7WUFDcEQsQ0FBQztZQUNELE9BQU8sR0FBRyxnQkFBZ0IsQ0FBQztRQUM3QixDQUFDO1FBRUQsSUFBSSxFQUFFLEdBQVcsV0FBVyxJQUFJLGNBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUU3QyxNQUFNLENBQUMsRUFBRSxVQUFVLFlBQUEsRUFBRSxPQUFPLFNBQUEsRUFBRSxFQUFFLElBQUEsRUFBRSxDQUFDO0lBQ3JDLENBQUM7QUFDSCxDQUFDO0FBNUJELHdDQTRCQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIHZhbGlkLWpzZG9jICovXHJcbmltcG9ydCBPcmJpdCBmcm9tICcuL21haW4nO1xyXG5pbXBvcnQgeyBPcGVyYXRpb24gfSBmcm9tICcuL29wZXJhdGlvbic7XHJcbmltcG9ydCB7IGlzT2JqZWN0LCBpc0FycmF5LCB0b0FycmF5IH0gZnJvbSAnQG9yYml0L3V0aWxzJztcclxuaW1wb3J0IFRyYW5zZm9ybUJ1aWxkZXIgZnJvbSAnLi90cmFuc2Zvcm0tYnVpbGRlcic7XHJcblxyXG5leHBvcnQgdHlwZSBUcmFuc2Zvcm1CdWlsZGVyRnVuYyA9IChUcmFuc2Zvcm1CdWlsZGVyKSA9PiBPcGVyYXRpb25bXTtcclxuZXhwb3J0IHR5cGUgVHJhbnNmb3JtT3JPcGVyYXRpb25zID0gVHJhbnNmb3JtIHwgT3BlcmF0aW9uIHwgT3BlcmF0aW9uW10gfCBUcmFuc2Zvcm1CdWlsZGVyRnVuYztcclxuXHJcbi8qKlxyXG4gKiBBIFRyYW5zZm9ybSByZXByZXNlbnRzIGEgc2V0IG9mIG9wZXJhdGlvbnMgdGhhdCBjYW4gbXV0YXRlIGEgc291cmNlLlxyXG4gKlxyXG4gKiBAZXhwb3J0XHJcbiAqIEBpbnRlcmZhY2UgVHJhbnNmb3JtXHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIFRyYW5zZm9ybSB7XHJcbiAgaWQ6IHN0cmluZztcclxuICBvcGVyYXRpb25zOiBPcGVyYXRpb25bXTtcclxuICBvcHRpb25zPzogYW55O1xyXG59XHJcblxyXG4vKipcclxuICogQSBidWlsZGVyIGZ1bmN0aW9uIGZvciBjcmVhdGluZyBhIFRyYW5zZm9ybSBmcm9tIGl0cyBjb25zdGl0dWVudCBwYXJ0cy5cclxuICpcclxuICogSWYgYSBgVHJhbnNmb3JtYCBpcyBwYXNzZWQgaW4gd2l0aCBhbiBgaWRgIGFuZCBgb3BlcmF0aW9uc2AsIGFuZCBub1xyXG4gKiByZXBsYWNlbWVudCBgaWRgIG9yIGBvcHRpb25zYCBhcmUgYWxzbyBwYXNzZWQgaW4sIHRoZW4gdGhlIGBUcmFuc2Zvcm1gXHJcbiAqIHdpbGwgYmUgcmV0dXJuZWQgdW5jaGFuZ2VkLlxyXG4gKlxyXG4gKiBGb3IgYWxsIG90aGVyIGNhc2VzLCBhIG5ldyBgVHJhbnNmb3JtYCBvYmplY3Qgd2lsbCBiZSBjcmVhdGVkIGFuZCByZXR1cm5lZC5cclxuICpcclxuICogVHJhbnNmb3JtcyB3aWxsIGJlIGFzc2lnbmVkIHRoZSBzcGVjaWZpZWQgYHRyYW5zZm9ybUlkYCBhcyBgaWRgLiBJZiBub25lXHJcbiAqIGlzIHNwZWNpZmllZCwgYSBVVUlEIHdpbGwgYmUgZ2VuZXJhdGVkLlxyXG4gKlxyXG4gKiBAZXhwb3J0XHJcbiAqIEBwYXJhbSB7VHJhbnNmb3JtT3JPcGVyYXRpb25zfSB0cmFuc2Zvcm1Pck9wZXJhdGlvbnNcclxuICogQHBhcmFtIHtvYmplY3R9IFt0cmFuc2Zvcm1PcHRpb25zXVxyXG4gKiBAcGFyYW0ge3N0cmluZ30gW3RyYW5zZm9ybUlkXSBVbmlxdWUgaWQgZm9yIHRoaXMgdHJhbnNmb3JtIChvdGhlcndpc2UgYSBVVUlEIHdpbGwgYmUgYXNzaWduZWQpXHJcbiAqIEBwYXJhbSB7VHJhbnNmb3JtQnVpbGRlcn0gW3RyYW5zZm9ybUJ1aWxkZXJdXHJcbiAqIEByZXR1cm5zIHtUcmFuc2Zvcm19XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRUcmFuc2Zvcm0odHJhbnNmb3JtT3JPcGVyYXRpb25zOiBUcmFuc2Zvcm1Pck9wZXJhdGlvbnMsIHRyYW5zZm9ybU9wdGlvbnM/OiBvYmplY3QsIHRyYW5zZm9ybUlkPzogc3RyaW5nLCB0cmFuc2Zvcm1CdWlsZGVyPzogVHJhbnNmb3JtQnVpbGRlcik6IFRyYW5zZm9ybSB7XHJcbiAgaWYgKHR5cGVvZiB0cmFuc2Zvcm1Pck9wZXJhdGlvbnMgPT09ICdmdW5jdGlvbicpIHtcclxuICAgIHJldHVybiBidWlsZFRyYW5zZm9ybSh0cmFuc2Zvcm1Pck9wZXJhdGlvbnModHJhbnNmb3JtQnVpbGRlciksIHRyYW5zZm9ybU9wdGlvbnMsIHRyYW5zZm9ybUlkKTtcclxuXHJcbiAgfSBlbHNlIHtcclxuICAgIGxldCB0cmFuc2Zvcm0gPSB0cmFuc2Zvcm1Pck9wZXJhdGlvbnMgYXMgVHJhbnNmb3JtO1xyXG4gICAgbGV0IG9wZXJhdGlvbnM6IE9wZXJhdGlvbltdO1xyXG4gICAgbGV0IG9wdGlvbnM6IG9iamVjdDtcclxuXHJcbiAgICBpZiAoaXNPYmplY3QodHJhbnNmb3JtKSAmJiB0cmFuc2Zvcm0ub3BlcmF0aW9ucykge1xyXG4gICAgICBpZiAodHJhbnNmb3JtLmlkICYmICF0cmFuc2Zvcm1PcHRpb25zICYmICF0cmFuc2Zvcm1JZCkge1xyXG4gICAgICAgIHJldHVybiB0cmFuc2Zvcm07XHJcbiAgICAgIH1cclxuICAgICAgb3BlcmF0aW9ucyA9IHRyYW5zZm9ybS5vcGVyYXRpb25zO1xyXG4gICAgICBvcHRpb25zID0gdHJhbnNmb3JtT3B0aW9ucyB8fCB0cmFuc2Zvcm0ub3B0aW9ucztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmIChpc0FycmF5KHRyYW5zZm9ybU9yT3BlcmF0aW9ucykpIHtcclxuICAgICAgICBvcGVyYXRpb25zID0gdHJhbnNmb3JtT3JPcGVyYXRpb25zIGFzIE9wZXJhdGlvbltdO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIG9wZXJhdGlvbnMgPSBbdHJhbnNmb3JtT3JPcGVyYXRpb25zIGFzIE9wZXJhdGlvbl07XHJcbiAgICAgIH1cclxuICAgICAgb3B0aW9ucyA9IHRyYW5zZm9ybU9wdGlvbnM7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGlkOiBzdHJpbmcgPSB0cmFuc2Zvcm1JZCB8fCBPcmJpdC51dWlkKCk7XHJcblxyXG4gICAgcmV0dXJuIHsgb3BlcmF0aW9ucywgb3B0aW9ucywgaWQgfTtcclxuICB9XHJcbn1cclxuIl19