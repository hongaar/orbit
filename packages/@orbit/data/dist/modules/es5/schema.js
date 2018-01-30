"use strict";

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
var main_1 = require("./main");
var exception_1 = require("./exception");
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
        if (settings.models === undefined) {
            settings.models = {};
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
            this._models = settings.models;
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
    Object.defineProperty(Schema.prototype, "models", {
        get: function () {
            return this._models;
        },
        enumerable: true,
        configurable: true
    });
    Schema.prototype.getModel = function (type) {
        var model = this.models[type];
        if (model) {
            return model;
        } else {
            throw new exception_1.ModelNotFound(type);
        }
    };
    Schema.prototype.hasAttribute = function (type, attribute) {
        var model = this.getModel(type);
        if (model.attributes && model.attributes[attribute]) {
            return true;
        } else {
            return false;
        }
    };
    Schema.prototype.hasRelationship = function (type, relationship) {
        var model = this.getModel(type);
        if (model.relationships && model.relationships[relationship]) {
            return true;
        } else {
            return false;
        }
    };
    Schema = __decorate([core_1.evented], Schema);
    return Schema;
}();
exports.default = Schema;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3JjL3NjaGVtYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLEFBQWdDO0FBQ2hDLHFCQUEyQjtBQUMzQiwwQkFBNEM7QUFFNUMscUJBQStDO0FBb0UvQyxBQVFHOzs7Ozs7Ozs7QUFFSDtBQVlFLEFBVUc7Ozs7Ozs7Ozs7O0FBRUgsb0JBQVksQUFBNkI7QUFBN0IsaUNBQUE7QUFBQSx1QkFBNkI7O0FBQ3ZDLEFBQUUsQUFBQyxZQUFDLEFBQVEsU0FBQyxBQUFPLFlBQUssQUFBUyxBQUFDLFdBQUMsQUFBQztBQUNuQyxBQUFRLHFCQUFDLEFBQU8sVUFBRyxBQUFDLEFBQUMsQUFDdkI7QUFBQztBQUVELEFBQUUsQUFBQyxZQUFDLEFBQVEsU0FBQyxBQUFNLFdBQUssQUFBUyxBQUFDLFdBQUMsQUFBQztBQUNsQyxBQUFRLHFCQUFDLEFBQU0sU0FBRyxBQUFFLEFBQUMsQUFDdkI7QUFBQztBQUVELEFBQUksYUFBQyxBQUFjLGVBQUMsQUFBUSxBQUFDLEFBQUMsQUFDaEM7QUFBQztBQU1ELDBCQUFJLGtCQUFPO0FBSlgsQUFHRzs7OzthQUNIO0FBQ0UsQUFBTSxtQkFBQyxBQUFJLEtBQUMsQUFBUSxBQUFDLEFBQ3ZCO0FBQUM7O3NCQUFBOztBQUVELEFBVUc7Ozs7Ozs7Ozs7O0FBQ0gscUJBQU8sVUFBUCxVQUFRLEFBQTZCO0FBQTdCLGlDQUFBO0FBQUEsdUJBQTZCOztBQUNuQyxBQUFFLEFBQUMsWUFBQyxBQUFRLFNBQUMsQUFBTyxZQUFLLEFBQVMsQUFBQyxXQUFDLEFBQUM7QUFDbkMsQUFBUSxxQkFBQyxBQUFPLFVBQUcsQUFBSSxLQUFDLEFBQVEsV0FBRyxBQUFDLEFBQUMsQUFDdkM7QUFBQztBQUNELEFBQUksYUFBQyxBQUFjLGVBQUMsQUFBUSxBQUFDLEFBQUM7QUFDOUIsQUFBSSxhQUFDLEFBQUksS0FBQyxBQUFTLFdBQUUsQUFBSSxLQUFDLEFBQVEsQUFB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QUFBQztBQUNOLEFBQU0sbUJBQUMsQUFBSyxBQUFDLEFBQ2Y7QUFBQyxBQUNIO0FBQUM7QUFFRCxxQkFBZSxrQkFBZixVQUFnQixBQUFZLE1BQUUsQUFBb0I7QUFDaEQsWUFBSSxBQUFLLFFBQUcsQUFBSSxLQUFDLEFBQVEsU0FBQyxBQUFJLEFBQUMsQUFBQztBQUNoQyxBQUFFLEFBQUMsWUFBQyxBQUFLLE1BQUMsQUFBYSxpQkFBSSxBQUFLLE1BQUMsQUFBYSxjQUFDLEFBQVksQUFBQyxBQUFDLGVBQUMsQUFBQztBQUM3RCxBQUFNLG1CQUFDLEFBQUksQUFBQyxBQUNkO0FBQUMsQUFBQyxBQUFJLGVBQUMsQUFBQztBQUNOLEFBQU0sbUJBQUMsQUFBSyxBQUFDLEFBQ2Y7QUFBQyxBQUNIO0FBQUM7QUFyS2tCLEFBQU0seUJBRDFCLE9BQU8sVUFDYSxBQUFNLEFBc0sxQjtBQUFELFdBQUM7QUF0S0QsQUFzS0M7a0JBdEtvQixBQUFNIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgdmFsaWQtanNkb2MgKi9cclxuaW1wb3J0IE9yYml0IGZyb20gJy4vbWFpbic7XHJcbmltcG9ydCB7IE1vZGVsTm90Rm91bmQgfSBmcm9tICcuL2V4Y2VwdGlvbic7XHJcbmltcG9ydCB7IGFzc2VydCwgY2xvbmUsIERpY3QgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xyXG5pbXBvcnQgeyBldmVudGVkLCBFdmVudGVkIH0gZnJvbSAnQG9yYml0L2NvcmUnO1xyXG5pbXBvcnQgeyBSZWNvcmQsIFJlY29yZEluaXRpYWxpemVyIH0gZnJvbSAnLi9yZWNvcmQnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBBdHRyaWJ1dGVEZWZpbml0aW9uIHtcclxuICB0eXBlPzogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFJlbGF0aW9uc2hpcERlZmluaXRpb24ge1xyXG4gIHR5cGU6ICdoYXNNYW55JyB8ICdoYXNPbmUnO1xyXG4gIG1vZGVsPzogc3RyaW5nO1xyXG4gIGludmVyc2U/OiBzdHJpbmc7XHJcbiAgZGVwZW5kZW50PzogJ3JlbW92ZSc7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgS2V5RGVmaW5pdGlvbiB7XHJcbiAgcHJpbWFyeUtleT86IGJvb2xlYW47XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgTW9kZWxEZWZpbml0aW9uIHtcclxuICBrZXlzPzogRGljdDxLZXlEZWZpbml0aW9uPjtcclxuICBhdHRyaWJ1dGVzPzogRGljdDxBdHRyaWJ1dGVEZWZpbml0aW9uPjtcclxuICByZWxhdGlvbnNoaXBzPzogRGljdDxSZWxhdGlvbnNoaXBEZWZpbml0aW9uPjtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNldHRpbmdzIHVzZWQgdG8gaW5pdGlhbHplIGFuZC9vciB1cGdyYWRlIHNjaGVtYXMuXHJcbiAqXHJcbiAqIEBleHBvcnRcclxuICogQGludGVyZmFjZSBTY2hlbWFTZXR0aW5nc1xyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBTY2hlbWFTZXR0aW5ncyB7XHJcbiAgLyoqXHJcbiAgICogU2NoZW1hIHZlcnNpb24uIERlZmF1bHRzIHRvIDEuXHJcbiAgICpcclxuICAgKiBAdHlwZSB7bnVtYmVyfUBtZW1iZXJvZiBTY2hlbWFTZXR0aW5nc1xyXG4gICAqL1xyXG4gIHZlcnNpb24/OiBudW1iZXI7XHJcblxyXG4gIC8qKlxyXG4gICAqIEZ1bmN0aW9uIHVzZWQgdG8gZ2VuZXJhdGUgcmVjb3JkIElEcy5cclxuICAgKlxyXG4gICAqIEBtZW1iZXJvZiBTY2hlbWFTZXR0aW5nc1xyXG4gICAqL1xyXG4gIGdlbmVyYXRlSWQ/OiAobW9kZWw/OiBzdHJpbmcpID0+IHN0cmluZztcclxuXHJcbiAgLyoqXHJcbiAgICogRnVuY3Rpb24gdXNlZCB0byBwbHVyYWxpemUgbmFtZXMuXHJcbiAgICpcclxuICAgKiBAbWVtYmVyb2YgU2NoZW1hU2V0dGluZ3NcclxuICAgKi9cclxuICBwbHVyYWxpemU/OiAod29yZDogc3RyaW5nKSA9PiBzdHJpbmc7XHJcblxyXG4gIC8qKlxyXG4gICAqIEZ1bmN0aW9uIHVzZWQgdG8gc2luZ3VsYXJpemUgbmFtZXMuXHJcbiAgICpcclxuICAgKiBAbWVtYmVyb2YgU2NoZW1hU2V0dGluZ3NcclxuICAgKi9cclxuICBzaW5ndWxhcml6ZT86ICh3b3JkOiBzdHJpbmcpID0+IHN0cmluZztcclxuXHJcbiAgLyoqXHJcbiAgICogTWFwIG9mIG1vZGVsIGRlZmluaXRpb25zLlxyXG4gICAqXHJcbiAgICogQHR5cGUge0RpY3Q8TW9kZWxEZWZpbml0aW9uPn1cclxuICAgKiBAbWVtYmVyb2YgU2NoZW1hU2V0dGluZ3NcclxuICAgKi9cclxuICBtb2RlbHM/OiBEaWN0PE1vZGVsRGVmaW5pdGlvbj47XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBIGBTY2hlbWFgIGRlZmluZXMgdGhlIG1vZGVscyBhbGxvd2VkIGluIGEgc291cmNlLCBpbmNsdWRpbmcgdGhlaXIga2V5cyxcclxuICogYXR0cmlidXRlcywgYW5kIHJlbGF0aW9uc2hpcHMuIEEgc2luZ2xlIHNjaGVtYSBtYXkgYmUgc2hhcmVkIGFjcm9zcyBtdWx0aXBsZVxyXG4gKiBzb3VyY2VzLlxyXG4gKlxyXG4gKiBAZXhwb3J0XHJcbiAqIEBjbGFzcyBTY2hlbWFcclxuICogQGltcGxlbWVudHMge0V2ZW50ZWR9XHJcbiAqL1xyXG5AZXZlbnRlZFxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY2hlbWEgaW1wbGVtZW50cyBFdmVudGVkLCBSZWNvcmRJbml0aWFsaXplciB7XHJcbiAgcHJpdmF0ZSBfbW9kZWxzOiBEaWN0PE1vZGVsRGVmaW5pdGlvbj47XHJcblxyXG4gIHByaXZhdGUgX3ZlcnNpb246IG51bWJlcjtcclxuXHJcbiAgLy8gRXZlbnRlZCBpbnRlcmZhY2Ugc3R1YnNcclxuICBvbjogKGV2ZW50OiBzdHJpbmcsIGNhbGxiYWNrOiAoYW55KSA9PiB2b2lkLCBiaW5kaW5nPzogYW55KSA9PiB2b2lkO1xyXG4gIG9mZjogKGV2ZW50OiBzdHJpbmcsIGNhbGxiYWNrOiAoYW55KSA9PiB2b2lkLCBiaW5kaW5nPzogYW55KSA9PiB2b2lkO1xyXG4gIG9uZTogKGV2ZW50OiBzdHJpbmcsIGNhbGxiYWNrOiAoYW55KSA9PiB2b2lkLCBiaW5kaW5nPzogYW55KSA9PiB2b2lkO1xyXG4gIGVtaXQ6IChldmVudDogc3RyaW5nLCAuLi5hcmdzKSA9PiB2b2lkO1xyXG4gIGxpc3RlbmVyczogKGV2ZW50OiBzdHJpbmcpID0+IGFueVtdO1xyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGUgYSBuZXcgU2NoZW1hLlxyXG4gICAqXHJcbiAgICogQGNvbnN0cnVjdG9yXHJcbiAgICogQHBhcmFtIHtTY2hlbWFTZXR0aW5nc30gW3NldHRpbmdzPXt9XSBPcHRpb25hbC4gQ29uZmlndXJhdGlvbiBzZXR0aW5ncy5cclxuICAgKiBAcGFyYW0ge0ludGVnZXJ9ICAgICAgICBbc2V0dGluZ3MudmVyc2lvbl0gICAgICAgT3B0aW9uYWwuIFNjaGVtYSB2ZXJzaW9uLiBEZWZhdWx0cyB0byAxLlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSAgIFtzZXR0aW5ncy5tb2RlbHNdICAgICAgICBPcHRpb25hbC4gU2NoZW1hcyBmb3IgaW5kaXZpZHVhbCBtb2RlbHMgc3VwcG9ydGVkIGJ5IHRoaXMgc2NoZW1hLlxyXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IFtzZXR0aW5ncy5nZW5lcmF0ZUlkXSAgICBPcHRpb25hbC4gRnVuY3Rpb24gdXNlZCB0byBnZW5lcmF0ZSBJRHMuXHJcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gW3NldHRpbmdzLnBsdXJhbGl6ZV0gICAgIE9wdGlvbmFsLiBGdW5jdGlvbiB1c2VkIHRvIHBsdXJhbGl6ZSBuYW1lcy5cclxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbc2V0dGluZ3Muc2luZ3VsYXJpemVdICAgT3B0aW9uYWwuIEZ1bmN0aW9uIHVzZWQgdG8gc2luZ3VsYXJpemUgbmFtZXMuXHJcbiAgICovXHJcblxyXG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzOiBTY2hlbWFTZXR0aW5ncyA9IHt9KSB7XHJcbiAgICBpZiAoc2V0dGluZ3MudmVyc2lvbiA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHNldHRpbmdzLnZlcnNpb24gPSAxO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChzZXR0aW5ncy5tb2RlbHMgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICBzZXR0aW5ncy5tb2RlbHMgPSB7fTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLl9hcHBseVNldHRpbmdzKHNldHRpbmdzKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFZlcnNpb25cclxuICAgKiBAcmV0dXJuIHtJbnRlZ2VyfSBWZXJzaW9uIG9mIHNjaGVtYS5cclxuICAgKi9cclxuICBnZXQgdmVyc2lvbigpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIHRoaXMuX3ZlcnNpb247XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBVcGdyYWRlcyBTY2hlbWEgdG8gYSBuZXcgdmVyc2lvbiB3aXRoIG5ldyBzZXR0aW5ncy5cclxuICAgKlxyXG4gICAqIEVtaXRzIHRoZSBgdXBncmFkZWAgZXZlbnQgdG8gY3VlIHNvdXJjZXMgdG8gdXBncmFkZSB0aGVpciBkYXRhLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtTY2hlbWFTZXR0aW5nc30gW3NldHRpbmdzPXt9XSAgICAgICAgICBTZXR0aW5ncy5cclxuICAgKiBAcGFyYW0ge0ludGVnZXJ9ICAgICAgICBbc2V0dGluZ3MudmVyc2lvbl0gICAgIE9wdGlvbmFsLiBTY2hlbWEgdmVyc2lvbi4gRGVmYXVsdHMgdG8gdGhlIGN1cnJlbnQgdmVyc2lvbiArIDEuXHJcbiAgICogQHBhcmFtIHtPYmplY3R9ICAgICAgICAgW3NldHRpbmdzLm1vZGVsc10gICAgICBTY2hlbWFzIGZvciBpbmRpdmlkdWFsIG1vZGVscyBzdXBwb3J0ZWQgYnkgdGhpcyBzY2hlbWEuXHJcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gICAgICAgW3NldHRpbmdzLnBsdXJhbGl6ZV0gICBPcHRpb25hbC4gRnVuY3Rpb24gdXNlZCB0byBwbHVyYWxpemUgbmFtZXMuXHJcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gICAgICAgW3NldHRpbmdzLnNpbmd1bGFyaXplXSBPcHRpb25hbC4gRnVuY3Rpb24gdXNlZCB0byBzaW5ndWxhcml6ZSBuYW1lcy5cclxuICAgKi9cclxuICB1cGdyYWRlKHNldHRpbmdzOiBTY2hlbWFTZXR0aW5ncyA9IHt9KTogdm9pZCB7XHJcbiAgICBpZiAoc2V0dGluZ3MudmVyc2lvbiA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHNldHRpbmdzLnZlcnNpb24gPSB0aGlzLl92ZXJzaW9uICsgMTtcclxuICAgIH1cclxuICAgIHRoaXMuX2FwcGx5U2V0dGluZ3Moc2V0dGluZ3MpO1xyXG4gICAgdGhpcy5lbWl0KCd1cGdyYWRlJywgdGhpcy5fdmVyc2lvbik7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZWdpc3RlcnMgYSBjb21wbGV0ZSBzZXQgb2Ygc2V0dGluZ3NcclxuICAgKlxyXG4gICAqIEBwcml2YXRlXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IHNldHRpbmdzIFNldHRpbmdzIHBhc3NlZCBpbnRvIGBjb25zdHJ1Y3RvcmAgb3IgYHVwZ3JhZGVgLlxyXG4gICAqL1xyXG4gIF9hcHBseVNldHRpbmdzKHNldHRpbmdzOiBTY2hlbWFTZXR0aW5ncyk6IHZvaWQge1xyXG4gICAgLy8gVmVyc2lvblxyXG4gICAgdGhpcy5fdmVyc2lvbiA9IHNldHRpbmdzLnZlcnNpb247XHJcblxyXG4gICAgLy8gQWxsb3cgb3ZlcnJpZGVzXHJcbiAgICBpZiAoc2V0dGluZ3MuZ2VuZXJhdGVJZCkge1xyXG4gICAgICB0aGlzLmdlbmVyYXRlSWQgPSBzZXR0aW5ncy5nZW5lcmF0ZUlkO1xyXG4gICAgfVxyXG4gICAgaWYgKHNldHRpbmdzLnBsdXJhbGl6ZSkge1xyXG4gICAgICB0aGlzLnBsdXJhbGl6ZSA9IHNldHRpbmdzLnBsdXJhbGl6ZTtcclxuICAgIH1cclxuICAgIGlmIChzZXR0aW5ncy5zaW5ndWxhcml6ZSkge1xyXG4gICAgICB0aGlzLnNpbmd1bGFyaXplID0gc2V0dGluZ3Muc2luZ3VsYXJpemU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUmVnaXN0ZXIgbW9kZWwgc2NoZW1hc1xyXG4gICAgaWYgKHNldHRpbmdzLm1vZGVscykge1xyXG4gICAgICB0aGlzLl9tb2RlbHMgPSBzZXR0aW5ncy5tb2RlbHM7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZW5lcmF0ZSBhbiBpZCBmb3IgYSBnaXZlbiBtb2RlbCB0eXBlLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgT3B0aW9uYWwuIFR5cGUgb2YgdGhlIG1vZGVsIGZvciB3aGljaCB0aGUgSUQgaXMgYmVpbmcgZ2VuZXJhdGVkLlxyXG4gICAqIEByZXR1cm4ge1N0cmluZ30gR2VuZXJhdGVkIG1vZGVsIElEXHJcbiAgICovXHJcbiAgZ2VuZXJhdGVJZCh0eXBlPzogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIHJldHVybiBPcmJpdC51dWlkKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBBIG5haXZlIHBsdXJhbGl6YXRpb24gbWV0aG9kLlxyXG4gICAqXHJcbiAgICogT3ZlcnJpZGUgd2l0aCBhIG1vcmUgcm9idXN0IGdlbmVyYWwgcHVycG9zZSBpbmZsZWN0b3Igb3IgcHJvdmlkZSBhblxyXG4gICAqIGluZmxlY3RvciB0YWlsb3JlZCB0byB0aGUgdm9jYWJ1bGFybHkgb2YgeW91ciBhcHBsaWNhdGlvbi5cclxuICAgKlxyXG4gICAqIEBwYXJhbSAge1N0cmluZ30gd29yZFxyXG4gICAqIEByZXR1cm4ge1N0cmluZ30gcGx1cmFsIGZvcm0gb2YgYHdvcmRgXHJcbiAgICovXHJcbiAgcGx1cmFsaXplKHdvcmQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gd29yZCArICdzJztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEEgbmFpdmUgc2luZ3VsYXJpemF0aW9uIG1ldGhvZC5cclxuICAgKlxyXG4gICAqIE92ZXJyaWRlIHdpdGggYSBtb3JlIHJvYnVzdCBnZW5lcmFsIHB1cnBvc2UgaW5mbGVjdG9yIG9yIHByb3ZpZGUgYW5cclxuICAgKiBpbmZsZWN0b3IgdGFpbG9yZWQgdG8gdGhlIHZvY2FidWxhcmx5IG9mIHlvdXIgYXBwbGljYXRpb24uXHJcbiAgICpcclxuICAgKiBAcGFyYW0gIHtTdHJpbmd9IHdvcmRcclxuICAgKiBAcmV0dXJuIHtTdHJpbmd9IHNpbmd1bGFyIGZvcm0gb2YgYHdvcmRgXHJcbiAgICovXHJcbiAgc2luZ3VsYXJpemUod29yZDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIGlmICh3b3JkLmxhc3RJbmRleE9mKCdzJykgPT09IHdvcmQubGVuZ3RoIC0gMSkge1xyXG4gICAgICByZXR1cm4gd29yZC5zdWJzdHIoMCwgd29yZC5sZW5ndGggLSAxKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiB3b3JkO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaW5pdGlhbGl6ZVJlY29yZChyZWNvcmQ6IFJlY29yZCk6IHZvaWQge1xyXG4gICAgaWYgKHJlY29yZC5pZCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHJlY29yZC5pZCA9IHRoaXMuZ2VuZXJhdGVJZChyZWNvcmQudHlwZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXQgbW9kZWxzKCk6IERpY3Q8TW9kZWxEZWZpbml0aW9uPiB7XHJcbiAgICByZXR1cm4gdGhpcy5fbW9kZWxzO1xyXG4gIH1cclxuXHJcbiAgZ2V0TW9kZWwodHlwZTogc3RyaW5nKTogTW9kZWxEZWZpbml0aW9uIHtcclxuICAgIGxldCBtb2RlbCA9IHRoaXMubW9kZWxzW3R5cGVdO1xyXG4gICAgaWYgKG1vZGVsKSB7XHJcbiAgICAgIHJldHVybiBtb2RlbDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRocm93IG5ldyBNb2RlbE5vdEZvdW5kKHR5cGUpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaGFzQXR0cmlidXRlKHR5cGU6IHN0cmluZywgYXR0cmlidXRlOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgIGxldCBtb2RlbCA9IHRoaXMuZ2V0TW9kZWwodHlwZSk7XHJcbiAgICBpZiAobW9kZWwuYXR0cmlidXRlcyAmJiBtb2RlbC5hdHRyaWJ1dGVzW2F0dHJpYnV0ZV0pIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBoYXNSZWxhdGlvbnNoaXAodHlwZTogc3RyaW5nLCByZWxhdGlvbnNoaXA6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgbGV0IG1vZGVsID0gdGhpcy5nZXRNb2RlbCh0eXBlKTtcclxuICAgIGlmIChtb2RlbC5yZWxhdGlvbnNoaXBzICYmIG1vZGVsLnJlbGF0aW9uc2hpcHNbcmVsYXRpb25zaGlwXSkge1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIl19