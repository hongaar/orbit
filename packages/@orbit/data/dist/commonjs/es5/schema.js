"use strict";

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
var main_1 = require("./main");
var core_1 = require("@orbit/core");
/**
 * A `Schema` defines the models allowed in a source, including their keys,
 * attributes, and relationships. A single schema may be shared across multiple
 * sources.
 *
 * @export
 * @class Schema
 * @implements {Evented}
 */
var Schema = function () {
    /**
     * Create a new Schema.
     *
     * @constructor
     * @param {SchemaSettings} [settings={}] Optional. Configuration settings.
     * @param {Integer}        [settings.version]       Optional. Schema version. Defaults to 1.
     * @param {Object}   [settings.models]        Optional. Schemas for individual models supported by this schema.
     * @param {Function} [settings.generateId]    Optional. Function used to generate IDs.
     * @param {Function} [settings.pluralize]     Optional. Function used to pluralize names.
     * @param {Function} [settings.singularize]   Optional. Function used to singularize names.
     */
    function Schema(settings) {
        if (settings === void 0) {
            settings = {};
        }
        if (settings.version === undefined) {
            settings.version = 1;
        }
        this._applySettings(settings);
    }
    Object.defineProperty(Schema.prototype, "version", {
        /**
         * Version
         * @return {Integer} Version of schema.
         */
        get: function () {
            return this._version;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Upgrades Schema to a new version with new settings.
     *
     * Emits the `upgrade` event to cue sources to upgrade their data.
     *
     * @param {SchemaSettings} [settings={}]          Settings.
     * @param {Integer}        [settings.version]     Optional. Schema version. Defaults to the current version + 1.
     * @param {Object}         [settings.models]      Schemas for individual models supported by this schema.
     * @param {Function}       [settings.pluralize]   Optional. Function used to pluralize names.
     * @param {Function}       [settings.singularize] Optional. Function used to singularize names.
     */
    Schema.prototype.upgrade = function (settings) {
        if (settings === void 0) {
            settings = {};
        }
        if (settings.version === undefined) {
            settings.version = this._version + 1;
        }
        this._applySettings(settings);
        this.emit('upgrade', this._version);
    };
    /**
     * Registers a complete set of settings
     *
     * @private
     * @param {Object} settings Settings passed into `constructor` or `upgrade`.
     */
    Schema.prototype._applySettings = function (settings) {
        // Version
        this._version = settings.version;
        // Allow overrides
        if (settings.generateId) {
            this.generateId = settings.generateId;
        }
        if (settings.pluralize) {
            this.pluralize = settings.pluralize;
        }
        if (settings.singularize) {
            this.singularize = settings.singularize;
        }
        // Register model schemas
        if (settings.models) {
            this.models = settings.models;
        }
    };
    /**
     * Generate an id for a given model type.
     *
     * @param {String} type Optional. Type of the model for which the ID is being generated.
     * @return {String} Generated model ID
     */
    Schema.prototype.generateId = function (type) {
        return main_1.default.uuid();
    };
    /**
     * A naive pluralization method.
     *
     * Override with a more robust general purpose inflector or provide an
     * inflector tailored to the vocabularly of your application.
     *
     * @param  {String} word
     * @return {String} plural form of `word`
     */
    Schema.prototype.pluralize = function (word) {
        return word + 's';
    };
    /**
     * A naive singularization method.
     *
     * Override with a more robust general purpose inflector or provide an
     * inflector tailored to the vocabularly of your application.
     *
     * @param  {String} word
     * @return {String} singular form of `word`
     */
    Schema.prototype.singularize = function (word) {
        if (word.lastIndexOf('s') === word.length - 1) {
            return word.substr(0, word.length - 1);
        } else {
            return word;
        }
    };
    Schema.prototype.initializeRecord = function (record) {
        if (record.id === undefined) {
            record.id = this.generateId(record.type);
        }
    };
    Schema = __decorate([core_1.evented], Schema);
    return Schema;
}();
exports.default = Schema;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3JjL3NjaGVtYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLEFBQWdDO0FBQ2hDLHFCQUEyQjtBQUUzQixxQkFBK0M7QUFvRS9DLEFBUUc7Ozs7Ozs7OztBQUVILHlCQVlFLEFBVUc7QUFFSDs7Ozs7Ozs7Ozs7b0JBQVksQUFBNkIsVUFBN0I7aUNBQUE7dUJBQTZCO0FBQ3ZDLEFBQUUsQUFBQztZQUFDLEFBQVEsU0FBQyxBQUFPLFlBQUssQUFBUyxBQUFDLFdBQUMsQUFBQyxBQUNuQyxBQUFRO3FCQUFDLEFBQU8sVUFBRyxBQUFDLEFBQUMsQUFDdkIsQUFBQztBQUVELEFBQUk7YUFBQyxBQUFjLGVBQUMsQUFBUSxBQUFDLEFBQUMsQUFDaEMsQUFBQztBQU1EOzBCQUFJLGtCQUFPOzs7OzthQUFYLFlBQ0UsQUFBTTttQkFBQyxBQUFJLEtBQUMsQUFBUSxBQUFDLEFBQ3ZCLEFBQUM7OztzQkFBQSxBQUVELEFBVUc7QUFsQkgsQUFHRztBQWdCSDs7Ozs7Ozs7Ozs7cUJBQU8sVUFBUCxVQUFRLEFBQTZCLFVBQTdCO2lDQUFBO3VCQUE2QjtBQUNuQyxBQUFFLEFBQUM7WUFBQyxBQUFRLFNBQUMsQUFBTyxZQUFLLEFBQVMsQUFBQyxXQUFDLEFBQUMsQUFDbkMsQUFBUTtxQkFBQyxBQUFPLFVBQUcsQUFBSSxLQUFDLEFBQVEsV0FBRyxBQUFDLEFBQUMsQUFDdkMsQUFBQztBQUNELEFBQUk7YUFBQyxBQUFjLGVBQUMsQUFBUSxBQUFDLEFBQUMsQUFDOUIsQUFBSTthQUFDLEFBQUksS0FBQyxBQUFTLFdBQUUsQUFBSSxLQUFDLEFBQVEsQUFBQyxBQUFDLEFBQ3RDLEFBQUM7QUFFRCxBQUtHO0FBQ0g7Ozs7OztxQkFBYyxpQkFBZCxVQUFlLEFBQXdCLFVBQ3JDLEFBQVU7QUFDVixBQUFJO2FBQUMsQUFBUSxXQUFHLEFBQVEsU0FBQyxBQUFPLEFBQUMsQUFFakMsQUFBa0I7QUFDbEIsQUFBRSxBQUFDO1lBQUMsQUFBUSxTQUFDLEFBQVUsQUFBQyxZQUFDLEFBQUMsQUFDeEIsQUFBSTtpQkFBQyxBQUFVLGFBQUcsQUFBUSxTQUFDLEFBQVUsQUFBQyxBQUN4QyxBQUFDO0FBQ0QsQUFBRSxBQUFDO1lBQUMsQUFBUSxTQUFDLEFBQVMsQUFBQyxXQUFDLEFBQUMsQUFDdkIsQUFBSTtpQkFBQyxBQUFTLFlBQUcsQUFBUSxTQUFDLEFBQVMsQUFBQyxBQUN0QyxBQUFDO0FBQ0QsQUFBRSxBQUFDO1lBQUMsQUFBUSxTQUFDLEFBQVcsQUFBQyxhQUFDLEFBQUMsQUFDekIsQUFBSTtpQkFBQyxBQUFXLGNBQUcsQUFBUSxTQUFDLEFBQVcsQUFBQyxBQUMxQyxBQUFDO0FBRUQsQUFBeUI7QUFDekIsQUFBRSxBQUFDO1lBQUMsQUFBUSxTQUFDLEFBQU0sQUFBQyxRQUFDLEFBQUMsQUFDcEIsQUFBSTtpQkFBQyxBQUFNLFNBQUcsQUFBUSxTQUFDLEFBQU0sQUFBQyxBQUNoQyxBQUFDLEFBQ0g7QUFBQztBQUVELEFBS0c7QUFDSDs7Ozs7O3FCQUFVLGFBQVYsVUFBVyxBQUFhLE1BQ3RCLEFBQU07ZUFBQyxPQUFLLFFBQUMsQUFBSSxBQUFFLEFBQUMsQUFDdEIsQUFBQztBQUVELEFBUUc7QUFDSDs7Ozs7Ozs7O3FCQUFTLFlBQVQsVUFBVSxBQUFZLE1BQ3BCLEFBQU07ZUFBQyxBQUFJLE9BQUcsQUFBRyxBQUFDLEFBQ3BCLEFBQUM7QUFFRCxBQVFHO0FBQ0g7Ozs7Ozs7OztxQkFBVyxjQUFYLFVBQVksQUFBWSxNQUN0QixBQUFFLEFBQUM7WUFBQyxBQUFJLEtBQUMsQUFBVyxZQUFDLEFBQUcsQUFBQyxTQUFLLEFBQUksS0FBQyxBQUFNLFNBQUcsQUFBQyxBQUFDLEdBQUMsQUFBQyxBQUM5QyxBQUFNO21CQUFDLEFBQUksS0FBQyxBQUFNLE9BQUMsQUFBQyxHQUFFLEFBQUksS0FBQyxBQUFNLFNBQUcsQUFBQyxBQUFDLEFBQUMsQUFDekMsQUFBQyxBQUFDLEFBQUk7ZUFBQyxBQUFDLEFBQ04sQUFBTTttQkFBQyxBQUFJLEFBQUMsQUFDZCxBQUFDLEFBQ0g7QUFBQztBQUVEO3FCQUFnQixtQkFBaEIsVUFBaUIsQUFBYyxRQUM3QixBQUFFLEFBQUM7WUFBQyxBQUFNLE9BQUMsQUFBRSxPQUFLLEFBQVMsQUFBQyxXQUFDLEFBQUMsQUFDNUIsQUFBTTttQkFBQyxBQUFFLEtBQUcsQUFBSSxLQUFDLEFBQVUsV0FBQyxBQUFNLE9BQUMsQUFBSSxBQUFDLEFBQUMsQUFDM0MsQUFBQyxBQUNIO0FBQUM7QUFsSWtCLEFBQU07eUJBRDFCLE9BQU8sVUFDYSxBQUFNLEFBbUkzQixBQUFDO1dBbklELEFBbUlDOztrQkFuSW9CLEFBQU0iLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSB2YWxpZC1qc2RvYyAqL1xyXG5pbXBvcnQgT3JiaXQgZnJvbSAnLi9tYWluJztcclxuaW1wb3J0IHsgYXNzZXJ0LCBjbG9uZSwgRGljdCB9IGZyb20gJ0BvcmJpdC91dGlscyc7XHJcbmltcG9ydCB7IGV2ZW50ZWQsIEV2ZW50ZWQgfSBmcm9tICdAb3JiaXQvY29yZSc7XHJcbmltcG9ydCB7IFJlY29yZCwgUmVjb3JkSW5pdGlhbGl6ZXIgfSBmcm9tICcuL3JlY29yZCc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEF0dHJpYnV0ZURlZmluaXRpb24ge1xyXG4gIHR5cGU/OiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgUmVsYXRpb25zaGlwRGVmaW5pdGlvbiB7XHJcbiAgdHlwZTogJ2hhc01hbnknIHwgJ2hhc09uZSc7XHJcbiAgbW9kZWw/OiBzdHJpbmc7XHJcbiAgaW52ZXJzZT86IHN0cmluZztcclxuICBkZXBlbmRlbnQ/OiAncmVtb3ZlJztcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBLZXlEZWZpbml0aW9uIHtcclxuICBwcmltYXJ5S2V5PzogYm9vbGVhbjtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBNb2RlbERlZmluaXRpb24ge1xyXG4gIGtleXM/OiBEaWN0PEtleURlZmluaXRpb24+O1xyXG4gIGF0dHJpYnV0ZXM/OiBEaWN0PEF0dHJpYnV0ZURlZmluaXRpb24+O1xyXG4gIHJlbGF0aW9uc2hpcHM/OiBEaWN0PFJlbGF0aW9uc2hpcERlZmluaXRpb24+O1xyXG59XHJcblxyXG4vKipcclxuICogU2V0dGluZ3MgdXNlZCB0byBpbml0aWFsemUgYW5kL29yIHVwZ3JhZGUgc2NoZW1hcy5cclxuICpcclxuICogQGV4cG9ydFxyXG4gKiBAaW50ZXJmYWNlIFNjaGVtYVNldHRpbmdzXHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIFNjaGVtYVNldHRpbmdzIHtcclxuICAvKipcclxuICAgKiBTY2hlbWEgdmVyc2lvbi4gRGVmYXVsdHMgdG8gMS5cclxuICAgKlxyXG4gICAqIEB0eXBlIHtudW1iZXJ9QG1lbWJlcm9mIFNjaGVtYVNldHRpbmdzXHJcbiAgICovXHJcbiAgdmVyc2lvbj86IG51bWJlcjtcclxuXHJcbiAgLyoqXHJcbiAgICogRnVuY3Rpb24gdXNlZCB0byBnZW5lcmF0ZSByZWNvcmQgSURzLlxyXG4gICAqXHJcbiAgICogQG1lbWJlcm9mIFNjaGVtYVNldHRpbmdzXHJcbiAgICovXHJcbiAgZ2VuZXJhdGVJZD86IChtb2RlbD86IHN0cmluZykgPT4gc3RyaW5nO1xyXG5cclxuICAvKipcclxuICAgKiBGdW5jdGlvbiB1c2VkIHRvIHBsdXJhbGl6ZSBuYW1lcy5cclxuICAgKlxyXG4gICAqIEBtZW1iZXJvZiBTY2hlbWFTZXR0aW5nc1xyXG4gICAqL1xyXG4gIHBsdXJhbGl6ZT86ICh3b3JkOiBzdHJpbmcpID0+IHN0cmluZztcclxuXHJcbiAgLyoqXHJcbiAgICogRnVuY3Rpb24gdXNlZCB0byBzaW5ndWxhcml6ZSBuYW1lcy5cclxuICAgKlxyXG4gICAqIEBtZW1iZXJvZiBTY2hlbWFTZXR0aW5nc1xyXG4gICAqL1xyXG4gIHNpbmd1bGFyaXplPzogKHdvcmQ6IHN0cmluZykgPT4gc3RyaW5nO1xyXG5cclxuICAvKipcclxuICAgKiBNYXAgb2YgbW9kZWwgZGVmaW5pdGlvbnMuXHJcbiAgICpcclxuICAgKiBAdHlwZSB7RGljdDxNb2RlbERlZmluaXRpb24+fVxyXG4gICAqIEBtZW1iZXJvZiBTY2hlbWFTZXR0aW5nc1xyXG4gICAqL1xyXG4gIG1vZGVscz86IERpY3Q8TW9kZWxEZWZpbml0aW9uPjtcclxufVxyXG5cclxuLyoqXHJcbiAqIEEgYFNjaGVtYWAgZGVmaW5lcyB0aGUgbW9kZWxzIGFsbG93ZWQgaW4gYSBzb3VyY2UsIGluY2x1ZGluZyB0aGVpciBrZXlzLFxyXG4gKiBhdHRyaWJ1dGVzLCBhbmQgcmVsYXRpb25zaGlwcy4gQSBzaW5nbGUgc2NoZW1hIG1heSBiZSBzaGFyZWQgYWNyb3NzIG11bHRpcGxlXHJcbiAqIHNvdXJjZXMuXHJcbiAqXHJcbiAqIEBleHBvcnRcclxuICogQGNsYXNzIFNjaGVtYVxyXG4gKiBAaW1wbGVtZW50cyB7RXZlbnRlZH1cclxuICovXHJcbkBldmVudGVkXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjaGVtYSBpbXBsZW1lbnRzIEV2ZW50ZWQsIFJlY29yZEluaXRpYWxpemVyIHtcclxuICBtb2RlbHM6IERpY3Q8TW9kZWxEZWZpbml0aW9uPjtcclxuXHJcbiAgcHJpdmF0ZSBfdmVyc2lvbjogbnVtYmVyO1xyXG5cclxuICAvLyBFdmVudGVkIGludGVyZmFjZSBzdHVic1xyXG4gIG9uOiAoZXZlbnQ6IHN0cmluZywgY2FsbGJhY2s6IChhbnkpID0+IHZvaWQsIGJpbmRpbmc/OiBhbnkpID0+IHZvaWQ7XHJcbiAgb2ZmOiAoZXZlbnQ6IHN0cmluZywgY2FsbGJhY2s6IChhbnkpID0+IHZvaWQsIGJpbmRpbmc/OiBhbnkpID0+IHZvaWQ7XHJcbiAgb25lOiAoZXZlbnQ6IHN0cmluZywgY2FsbGJhY2s6IChhbnkpID0+IHZvaWQsIGJpbmRpbmc/OiBhbnkpID0+IHZvaWQ7XHJcbiAgZW1pdDogKGV2ZW50OiBzdHJpbmcsIC4uLmFyZ3MpID0+IHZvaWQ7XHJcbiAgbGlzdGVuZXJzOiAoZXZlbnQ6IHN0cmluZykgPT4gYW55W107XHJcblxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZSBhIG5ldyBTY2hlbWEuXHJcbiAgICpcclxuICAgKiBAY29uc3RydWN0b3JcclxuICAgKiBAcGFyYW0ge1NjaGVtYVNldHRpbmdzfSBbc2V0dGluZ3M9e31dIE9wdGlvbmFsLiBDb25maWd1cmF0aW9uIHNldHRpbmdzLlxyXG4gICAqIEBwYXJhbSB7SW50ZWdlcn0gICAgICAgIFtzZXR0aW5ncy52ZXJzaW9uXSAgICAgICBPcHRpb25hbC4gU2NoZW1hIHZlcnNpb24uIERlZmF1bHRzIHRvIDEuXHJcbiAgICogQHBhcmFtIHtPYmplY3R9ICAgW3NldHRpbmdzLm1vZGVsc10gICAgICAgIE9wdGlvbmFsLiBTY2hlbWFzIGZvciBpbmRpdmlkdWFsIG1vZGVscyBzdXBwb3J0ZWQgYnkgdGhpcyBzY2hlbWEuXHJcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gW3NldHRpbmdzLmdlbmVyYXRlSWRdICAgIE9wdGlvbmFsLiBGdW5jdGlvbiB1c2VkIHRvIGdlbmVyYXRlIElEcy5cclxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbc2V0dGluZ3MucGx1cmFsaXplXSAgICAgT3B0aW9uYWwuIEZ1bmN0aW9uIHVzZWQgdG8gcGx1cmFsaXplIG5hbWVzLlxyXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IFtzZXR0aW5ncy5zaW5ndWxhcml6ZV0gICBPcHRpb25hbC4gRnVuY3Rpb24gdXNlZCB0byBzaW5ndWxhcml6ZSBuYW1lcy5cclxuICAgKi9cclxuXHJcbiAgY29uc3RydWN0b3Ioc2V0dGluZ3M6IFNjaGVtYVNldHRpbmdzID0ge30pIHtcclxuICAgIGlmIChzZXR0aW5ncy52ZXJzaW9uID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgc2V0dGluZ3MudmVyc2lvbiA9IDE7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5fYXBwbHlTZXR0aW5ncyhzZXR0aW5ncyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBWZXJzaW9uXHJcbiAgICogQHJldHVybiB7SW50ZWdlcn0gVmVyc2lvbiBvZiBzY2hlbWEuXHJcbiAgICovXHJcbiAgZ2V0IHZlcnNpb24oKTogbnVtYmVyIHtcclxuICAgIHJldHVybiB0aGlzLl92ZXJzaW9uO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVXBncmFkZXMgU2NoZW1hIHRvIGEgbmV3IHZlcnNpb24gd2l0aCBuZXcgc2V0dGluZ3MuXHJcbiAgICpcclxuICAgKiBFbWl0cyB0aGUgYHVwZ3JhZGVgIGV2ZW50IHRvIGN1ZSBzb3VyY2VzIHRvIHVwZ3JhZGUgdGhlaXIgZGF0YS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7U2NoZW1hU2V0dGluZ3N9IFtzZXR0aW5ncz17fV0gICAgICAgICAgU2V0dGluZ3MuXHJcbiAgICogQHBhcmFtIHtJbnRlZ2VyfSAgICAgICAgW3NldHRpbmdzLnZlcnNpb25dICAgICBPcHRpb25hbC4gU2NoZW1hIHZlcnNpb24uIERlZmF1bHRzIHRvIHRoZSBjdXJyZW50IHZlcnNpb24gKyAxLlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSAgICAgICAgIFtzZXR0aW5ncy5tb2RlbHNdICAgICAgU2NoZW1hcyBmb3IgaW5kaXZpZHVhbCBtb2RlbHMgc3VwcG9ydGVkIGJ5IHRoaXMgc2NoZW1hLlxyXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259ICAgICAgIFtzZXR0aW5ncy5wbHVyYWxpemVdICAgT3B0aW9uYWwuIEZ1bmN0aW9uIHVzZWQgdG8gcGx1cmFsaXplIG5hbWVzLlxyXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259ICAgICAgIFtzZXR0aW5ncy5zaW5ndWxhcml6ZV0gT3B0aW9uYWwuIEZ1bmN0aW9uIHVzZWQgdG8gc2luZ3VsYXJpemUgbmFtZXMuXHJcbiAgICovXHJcbiAgdXBncmFkZShzZXR0aW5nczogU2NoZW1hU2V0dGluZ3MgPSB7fSk6IHZvaWQge1xyXG4gICAgaWYgKHNldHRpbmdzLnZlcnNpb24gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICBzZXR0aW5ncy52ZXJzaW9uID0gdGhpcy5fdmVyc2lvbiArIDE7XHJcbiAgICB9XHJcbiAgICB0aGlzLl9hcHBseVNldHRpbmdzKHNldHRpbmdzKTtcclxuICAgIHRoaXMuZW1pdCgndXBncmFkZScsIHRoaXMuX3ZlcnNpb24pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmVnaXN0ZXJzIGEgY29tcGxldGUgc2V0IG9mIHNldHRpbmdzXHJcbiAgICpcclxuICAgKiBAcHJpdmF0ZVxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzZXR0aW5ncyBTZXR0aW5ncyBwYXNzZWQgaW50byBgY29uc3RydWN0b3JgIG9yIGB1cGdyYWRlYC5cclxuICAgKi9cclxuICBfYXBwbHlTZXR0aW5ncyhzZXR0aW5nczogU2NoZW1hU2V0dGluZ3MpOiB2b2lkIHtcclxuICAgIC8vIFZlcnNpb25cclxuICAgIHRoaXMuX3ZlcnNpb24gPSBzZXR0aW5ncy52ZXJzaW9uO1xyXG5cclxuICAgIC8vIEFsbG93IG92ZXJyaWRlc1xyXG4gICAgaWYgKHNldHRpbmdzLmdlbmVyYXRlSWQpIHtcclxuICAgICAgdGhpcy5nZW5lcmF0ZUlkID0gc2V0dGluZ3MuZ2VuZXJhdGVJZDtcclxuICAgIH1cclxuICAgIGlmIChzZXR0aW5ncy5wbHVyYWxpemUpIHtcclxuICAgICAgdGhpcy5wbHVyYWxpemUgPSBzZXR0aW5ncy5wbHVyYWxpemU7XHJcbiAgICB9XHJcbiAgICBpZiAoc2V0dGluZ3Muc2luZ3VsYXJpemUpIHtcclxuICAgICAgdGhpcy5zaW5ndWxhcml6ZSA9IHNldHRpbmdzLnNpbmd1bGFyaXplO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFJlZ2lzdGVyIG1vZGVsIHNjaGVtYXNcclxuICAgIGlmIChzZXR0aW5ncy5tb2RlbHMpIHtcclxuICAgICAgdGhpcy5tb2RlbHMgPSBzZXR0aW5ncy5tb2RlbHM7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZW5lcmF0ZSBhbiBpZCBmb3IgYSBnaXZlbiBtb2RlbCB0eXBlLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgT3B0aW9uYWwuIFR5cGUgb2YgdGhlIG1vZGVsIGZvciB3aGljaCB0aGUgSUQgaXMgYmVpbmcgZ2VuZXJhdGVkLlxyXG4gICAqIEByZXR1cm4ge1N0cmluZ30gR2VuZXJhdGVkIG1vZGVsIElEXHJcbiAgICovXHJcbiAgZ2VuZXJhdGVJZCh0eXBlPzogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIHJldHVybiBPcmJpdC51dWlkKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBBIG5haXZlIHBsdXJhbGl6YXRpb24gbWV0aG9kLlxyXG4gICAqXHJcbiAgICogT3ZlcnJpZGUgd2l0aCBhIG1vcmUgcm9idXN0IGdlbmVyYWwgcHVycG9zZSBpbmZsZWN0b3Igb3IgcHJvdmlkZSBhblxyXG4gICAqIGluZmxlY3RvciB0YWlsb3JlZCB0byB0aGUgdm9jYWJ1bGFybHkgb2YgeW91ciBhcHBsaWNhdGlvbi5cclxuICAgKlxyXG4gICAqIEBwYXJhbSAge1N0cmluZ30gd29yZFxyXG4gICAqIEByZXR1cm4ge1N0cmluZ30gcGx1cmFsIGZvcm0gb2YgYHdvcmRgXHJcbiAgICovXHJcbiAgcGx1cmFsaXplKHdvcmQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gd29yZCArICdzJztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEEgbmFpdmUgc2luZ3VsYXJpemF0aW9uIG1ldGhvZC5cclxuICAgKlxyXG4gICAqIE92ZXJyaWRlIHdpdGggYSBtb3JlIHJvYnVzdCBnZW5lcmFsIHB1cnBvc2UgaW5mbGVjdG9yIG9yIHByb3ZpZGUgYW5cclxuICAgKiBpbmZsZWN0b3IgdGFpbG9yZWQgdG8gdGhlIHZvY2FidWxhcmx5IG9mIHlvdXIgYXBwbGljYXRpb24uXHJcbiAgICpcclxuICAgKiBAcGFyYW0gIHtTdHJpbmd9IHdvcmRcclxuICAgKiBAcmV0dXJuIHtTdHJpbmd9IHNpbmd1bGFyIGZvcm0gb2YgYHdvcmRgXHJcbiAgICovXHJcbiAgc2luZ3VsYXJpemUod29yZDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIGlmICh3b3JkLmxhc3RJbmRleE9mKCdzJykgPT09IHdvcmQubGVuZ3RoIC0gMSkge1xyXG4gICAgICByZXR1cm4gd29yZC5zdWJzdHIoMCwgd29yZC5sZW5ndGggLSAxKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiB3b3JkO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaW5pdGlhbGl6ZVJlY29yZChyZWNvcmQ6IFJlY29yZCk6IHZvaWQge1xyXG4gICAgaWYgKHJlY29yZC5pZCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHJlY29yZC5pZCA9IHRoaXMuZ2VuZXJhdGVJZChyZWNvcmQudHlwZSk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdfQ==