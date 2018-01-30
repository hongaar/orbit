"use strict";

var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3JjL3NjaGVtYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsQUFBZ0M7QUFDaEMscUJBQTJCO0FBQzNCLDBCQUE0QztBQUU1QyxxQkFBK0M7QUFvRS9DLEFBUUc7Ozs7Ozs7OztBQUVIO0FBWUUsQUFVRzs7Ozs7Ozs7Ozs7QUFFSCxvQkFBWSxBQUE2QjtBQUE3QixpQ0FBQTtBQUFBLHVCQUE2Qjs7QUFDdkMsQUFBRSxBQUFDLFlBQUMsQUFBUSxTQUFDLEFBQU8sWUFBSyxBQUFTLEFBQUMsV0FBQyxBQUFDO0FBQ25DLEFBQVEscUJBQUMsQUFBTyxVQUFHLEFBQUMsQUFBQyxBQUN2QjtBQUFDO0FBRUQsQUFBRSxBQUFDLFlBQUMsQUFBUSxTQUFDLEFBQU0sV0FBSyxBQUFTLEFBQUMsV0FBQyxBQUFDO0FBQ2xDLEFBQVEscUJBQUMsQUFBTSxTQUFHLEFBQUUsQUFBQyxBQUN2QjtBQUFDO0FBRUQsQUFBSSxhQUFDLEFBQWMsZUFBQyxBQUFRLEFBQUMsQUFBQyxBQUNoQztBQUFDO0FBTUQsMEJBQUksa0JBQU87QUFKWCxBQUdHOzs7O2FBQ0g7QUFDRSxBQUFNLG1CQUFDLEFBQUksS0FBQyxBQUFRLEFBQUMsQUFDdkI7QUFBQzs7c0JBQUE7O0FBRUQsQUFVRzs7Ozs7Ozs7Ozs7QUFDSCxxQkFBTyxVQUFQLFVBQVEsQUFBNkI7QUFBN0IsaUNBQUE7QUFBQSx1QkFBNkI7O0FBQ25DLEFBQUUsQUFBQyxZQUFDLEFBQVEsU0FBQyxBQUFPLFlBQUssQUFBUyxBQUFDLFdBQUMsQUFBQztBQUNuQyxBQUFRLHFCQUFDLEFBQU8sVUFBRyxBQUFJLEtBQUMsQUFBUSxXQUFHLEFBQUMsQUFBQyxBQUN2QztBQUFDO0FBQ0QsQUFBSSxhQUFDLEFBQWMsZUFBQyxBQUFRLEFBQUMsQUFBQztBQUM5QixBQUFJLGFBQUMsQUFBSSxLQUFDLEFBQVMsV0FBRSxBQUFJLEtBQUMsQUFBUSxBQUFD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QUFDO0FBQ04sQUFBTSxtQkFBQyxBQUFLLEFBQUMsQUFDZjtBQUFDLEFBQ0g7QUFBQztBQUVELHFCQUFlLGtCQUFmLFVBQWdCLEFBQVksTUFBRSxBQUFvQjtBQUNoRCxZQUFJLEFBQUssUUFBRyxBQUFJLEtBQUMsQUFBUSxTQUFDLEFBQUksQUFBQyxBQUFDO0FBQ2hDLEFBQUUsQUFBQyxZQUFDLEFBQUssTUFBQyxBQUFhLGlCQUFJLEFBQUssTUFBQyxBQUFhLGNBQUMsQUFBWSxBQUFDLEFBQUMsZUFBQyxBQUFDO0FBQzdELEFBQU0sbUJBQUMsQUFBSSxBQUFDLEFBQ2Q7QUFBQyxBQUFDLEFBQUksZUFBQyxBQUFDO0FBQ04sQUFBTSxtQkFBQyxBQUFLLEFBQUMsQUFDZjtBQUFDLEFBQ0g7QUFBQztBQXJLa0IsQUFBTSx5QkFEMUIsT0FBTyxVQUNhLEFBQU0sQUFzSzFCO0FBQUQsV0FBQztBQXRLRCxBQXNLQztrQkF0S29CLEFBQU0iLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSB2YWxpZC1qc2RvYyAqL1xyXG5pbXBvcnQgT3JiaXQgZnJvbSAnLi9tYWluJztcclxuaW1wb3J0IHsgTW9kZWxOb3RGb3VuZCB9IGZyb20gJy4vZXhjZXB0aW9uJztcclxuaW1wb3J0IHsgYXNzZXJ0LCBjbG9uZSwgRGljdCB9IGZyb20gJ0BvcmJpdC91dGlscyc7XHJcbmltcG9ydCB7IGV2ZW50ZWQsIEV2ZW50ZWQgfSBmcm9tICdAb3JiaXQvY29yZSc7XHJcbmltcG9ydCB7IFJlY29yZCwgUmVjb3JkSW5pdGlhbGl6ZXIgfSBmcm9tICcuL3JlY29yZCc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEF0dHJpYnV0ZURlZmluaXRpb24ge1xyXG4gIHR5cGU/OiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgUmVsYXRpb25zaGlwRGVmaW5pdGlvbiB7XHJcbiAgdHlwZTogJ2hhc01hbnknIHwgJ2hhc09uZSc7XHJcbiAgbW9kZWw/OiBzdHJpbmc7XHJcbiAgaW52ZXJzZT86IHN0cmluZztcclxuICBkZXBlbmRlbnQ/OiAncmVtb3ZlJztcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBLZXlEZWZpbml0aW9uIHtcclxuICBwcmltYXJ5S2V5PzogYm9vbGVhbjtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBNb2RlbERlZmluaXRpb24ge1xyXG4gIGtleXM/OiBEaWN0PEtleURlZmluaXRpb24+O1xyXG4gIGF0dHJpYnV0ZXM/OiBEaWN0PEF0dHJpYnV0ZURlZmluaXRpb24+O1xyXG4gIHJlbGF0aW9uc2hpcHM/OiBEaWN0PFJlbGF0aW9uc2hpcERlZmluaXRpb24+O1xyXG59XHJcblxyXG4vKipcclxuICogU2V0dGluZ3MgdXNlZCB0byBpbml0aWFsemUgYW5kL29yIHVwZ3JhZGUgc2NoZW1hcy5cclxuICpcclxuICogQGV4cG9ydFxyXG4gKiBAaW50ZXJmYWNlIFNjaGVtYVNldHRpbmdzXHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIFNjaGVtYVNldHRpbmdzIHtcclxuICAvKipcclxuICAgKiBTY2hlbWEgdmVyc2lvbi4gRGVmYXVsdHMgdG8gMS5cclxuICAgKlxyXG4gICAqIEB0eXBlIHtudW1iZXJ9QG1lbWJlcm9mIFNjaGVtYVNldHRpbmdzXHJcbiAgICovXHJcbiAgdmVyc2lvbj86IG51bWJlcjtcclxuXHJcbiAgLyoqXHJcbiAgICogRnVuY3Rpb24gdXNlZCB0byBnZW5lcmF0ZSByZWNvcmQgSURzLlxyXG4gICAqXHJcbiAgICogQG1lbWJlcm9mIFNjaGVtYVNldHRpbmdzXHJcbiAgICovXHJcbiAgZ2VuZXJhdGVJZD86IChtb2RlbD86IHN0cmluZykgPT4gc3RyaW5nO1xyXG5cclxuICAvKipcclxuICAgKiBGdW5jdGlvbiB1c2VkIHRvIHBsdXJhbGl6ZSBuYW1lcy5cclxuICAgKlxyXG4gICAqIEBtZW1iZXJvZiBTY2hlbWFTZXR0aW5nc1xyXG4gICAqL1xyXG4gIHBsdXJhbGl6ZT86ICh3b3JkOiBzdHJpbmcpID0+IHN0cmluZztcclxuXHJcbiAgLyoqXHJcbiAgICogRnVuY3Rpb24gdXNlZCB0byBzaW5ndWxhcml6ZSBuYW1lcy5cclxuICAgKlxyXG4gICAqIEBtZW1iZXJvZiBTY2hlbWFTZXR0aW5nc1xyXG4gICAqL1xyXG4gIHNpbmd1bGFyaXplPzogKHdvcmQ6IHN0cmluZykgPT4gc3RyaW5nO1xyXG5cclxuICAvKipcclxuICAgKiBNYXAgb2YgbW9kZWwgZGVmaW5pdGlvbnMuXHJcbiAgICpcclxuICAgKiBAdHlwZSB7RGljdDxNb2RlbERlZmluaXRpb24+fVxyXG4gICAqIEBtZW1iZXJvZiBTY2hlbWFTZXR0aW5nc1xyXG4gICAqL1xyXG4gIG1vZGVscz86IERpY3Q8TW9kZWxEZWZpbml0aW9uPjtcclxufVxyXG5cclxuLyoqXHJcbiAqIEEgYFNjaGVtYWAgZGVmaW5lcyB0aGUgbW9kZWxzIGFsbG93ZWQgaW4gYSBzb3VyY2UsIGluY2x1ZGluZyB0aGVpciBrZXlzLFxyXG4gKiBhdHRyaWJ1dGVzLCBhbmQgcmVsYXRpb25zaGlwcy4gQSBzaW5nbGUgc2NoZW1hIG1heSBiZSBzaGFyZWQgYWNyb3NzIG11bHRpcGxlXHJcbiAqIHNvdXJjZXMuXHJcbiAqXHJcbiAqIEBleHBvcnRcclxuICogQGNsYXNzIFNjaGVtYVxyXG4gKiBAaW1wbGVtZW50cyB7RXZlbnRlZH1cclxuICovXHJcbkBldmVudGVkXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjaGVtYSBpbXBsZW1lbnRzIEV2ZW50ZWQsIFJlY29yZEluaXRpYWxpemVyIHtcclxuICBwcml2YXRlIF9tb2RlbHM6IERpY3Q8TW9kZWxEZWZpbml0aW9uPjtcclxuXHJcbiAgcHJpdmF0ZSBfdmVyc2lvbjogbnVtYmVyO1xyXG5cclxuICAvLyBFdmVudGVkIGludGVyZmFjZSBzdHVic1xyXG4gIG9uOiAoZXZlbnQ6IHN0cmluZywgY2FsbGJhY2s6IChhbnkpID0+IHZvaWQsIGJpbmRpbmc/OiBhbnkpID0+IHZvaWQ7XHJcbiAgb2ZmOiAoZXZlbnQ6IHN0cmluZywgY2FsbGJhY2s6IChhbnkpID0+IHZvaWQsIGJpbmRpbmc/OiBhbnkpID0+IHZvaWQ7XHJcbiAgb25lOiAoZXZlbnQ6IHN0cmluZywgY2FsbGJhY2s6IChhbnkpID0+IHZvaWQsIGJpbmRpbmc/OiBhbnkpID0+IHZvaWQ7XHJcbiAgZW1pdDogKGV2ZW50OiBzdHJpbmcsIC4uLmFyZ3MpID0+IHZvaWQ7XHJcbiAgbGlzdGVuZXJzOiAoZXZlbnQ6IHN0cmluZykgPT4gYW55W107XHJcblxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZSBhIG5ldyBTY2hlbWEuXHJcbiAgICpcclxuICAgKiBAY29uc3RydWN0b3JcclxuICAgKiBAcGFyYW0ge1NjaGVtYVNldHRpbmdzfSBbc2V0dGluZ3M9e31dIE9wdGlvbmFsLiBDb25maWd1cmF0aW9uIHNldHRpbmdzLlxyXG4gICAqIEBwYXJhbSB7SW50ZWdlcn0gICAgICAgIFtzZXR0aW5ncy52ZXJzaW9uXSAgICAgICBPcHRpb25hbC4gU2NoZW1hIHZlcnNpb24uIERlZmF1bHRzIHRvIDEuXHJcbiAgICogQHBhcmFtIHtPYmplY3R9ICAgW3NldHRpbmdzLm1vZGVsc10gICAgICAgIE9wdGlvbmFsLiBTY2hlbWFzIGZvciBpbmRpdmlkdWFsIG1vZGVscyBzdXBwb3J0ZWQgYnkgdGhpcyBzY2hlbWEuXHJcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gW3NldHRpbmdzLmdlbmVyYXRlSWRdICAgIE9wdGlvbmFsLiBGdW5jdGlvbiB1c2VkIHRvIGdlbmVyYXRlIElEcy5cclxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbc2V0dGluZ3MucGx1cmFsaXplXSAgICAgT3B0aW9uYWwuIEZ1bmN0aW9uIHVzZWQgdG8gcGx1cmFsaXplIG5hbWVzLlxyXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IFtzZXR0aW5ncy5zaW5ndWxhcml6ZV0gICBPcHRpb25hbC4gRnVuY3Rpb24gdXNlZCB0byBzaW5ndWxhcml6ZSBuYW1lcy5cclxuICAgKi9cclxuXHJcbiAgY29uc3RydWN0b3Ioc2V0dGluZ3M6IFNjaGVtYVNldHRpbmdzID0ge30pIHtcclxuICAgIGlmIChzZXR0aW5ncy52ZXJzaW9uID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgc2V0dGluZ3MudmVyc2lvbiA9IDE7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHNldHRpbmdzLm1vZGVscyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHNldHRpbmdzLm1vZGVscyA9IHt9O1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuX2FwcGx5U2V0dGluZ3Moc2V0dGluZ3MpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVmVyc2lvblxyXG4gICAqIEByZXR1cm4ge0ludGVnZXJ9IFZlcnNpb24gb2Ygc2NoZW1hLlxyXG4gICAqL1xyXG4gIGdldCB2ZXJzaW9uKCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gdGhpcy5fdmVyc2lvbjtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFVwZ3JhZGVzIFNjaGVtYSB0byBhIG5ldyB2ZXJzaW9uIHdpdGggbmV3IHNldHRpbmdzLlxyXG4gICAqXHJcbiAgICogRW1pdHMgdGhlIGB1cGdyYWRlYCBldmVudCB0byBjdWUgc291cmNlcyB0byB1cGdyYWRlIHRoZWlyIGRhdGEuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge1NjaGVtYVNldHRpbmdzfSBbc2V0dGluZ3M9e31dICAgICAgICAgIFNldHRpbmdzLlxyXG4gICAqIEBwYXJhbSB7SW50ZWdlcn0gICAgICAgIFtzZXR0aW5ncy52ZXJzaW9uXSAgICAgT3B0aW9uYWwuIFNjaGVtYSB2ZXJzaW9uLiBEZWZhdWx0cyB0byB0aGUgY3VycmVudCB2ZXJzaW9uICsgMS5cclxuICAgKiBAcGFyYW0ge09iamVjdH0gICAgICAgICBbc2V0dGluZ3MubW9kZWxzXSAgICAgIFNjaGVtYXMgZm9yIGluZGl2aWR1YWwgbW9kZWxzIHN1cHBvcnRlZCBieSB0aGlzIHNjaGVtYS5cclxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSAgICAgICBbc2V0dGluZ3MucGx1cmFsaXplXSAgIE9wdGlvbmFsLiBGdW5jdGlvbiB1c2VkIHRvIHBsdXJhbGl6ZSBuYW1lcy5cclxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSAgICAgICBbc2V0dGluZ3Muc2luZ3VsYXJpemVdIE9wdGlvbmFsLiBGdW5jdGlvbiB1c2VkIHRvIHNpbmd1bGFyaXplIG5hbWVzLlxyXG4gICAqL1xyXG4gIHVwZ3JhZGUoc2V0dGluZ3M6IFNjaGVtYVNldHRpbmdzID0ge30pOiB2b2lkIHtcclxuICAgIGlmIChzZXR0aW5ncy52ZXJzaW9uID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgc2V0dGluZ3MudmVyc2lvbiA9IHRoaXMuX3ZlcnNpb24gKyAxO1xyXG4gICAgfVxyXG4gICAgdGhpcy5fYXBwbHlTZXR0aW5ncyhzZXR0aW5ncyk7XHJcbiAgICB0aGlzLmVtaXQoJ3VwZ3JhZGUnLCB0aGlzLl92ZXJzaW9uKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlZ2lzdGVycyBhIGNvbXBsZXRlIHNldCBvZiBzZXR0aW5nc1xyXG4gICAqXHJcbiAgICogQHByaXZhdGVcclxuICAgKiBAcGFyYW0ge09iamVjdH0gc2V0dGluZ3MgU2V0dGluZ3MgcGFzc2VkIGludG8gYGNvbnN0cnVjdG9yYCBvciBgdXBncmFkZWAuXHJcbiAgICovXHJcbiAgX2FwcGx5U2V0dGluZ3Moc2V0dGluZ3M6IFNjaGVtYVNldHRpbmdzKTogdm9pZCB7XHJcbiAgICAvLyBWZXJzaW9uXHJcbiAgICB0aGlzLl92ZXJzaW9uID0gc2V0dGluZ3MudmVyc2lvbjtcclxuXHJcbiAgICAvLyBBbGxvdyBvdmVycmlkZXNcclxuICAgIGlmIChzZXR0aW5ncy5nZW5lcmF0ZUlkKSB7XHJcbiAgICAgIHRoaXMuZ2VuZXJhdGVJZCA9IHNldHRpbmdzLmdlbmVyYXRlSWQ7XHJcbiAgICB9XHJcbiAgICBpZiAoc2V0dGluZ3MucGx1cmFsaXplKSB7XHJcbiAgICAgIHRoaXMucGx1cmFsaXplID0gc2V0dGluZ3MucGx1cmFsaXplO1xyXG4gICAgfVxyXG4gICAgaWYgKHNldHRpbmdzLnNpbmd1bGFyaXplKSB7XHJcbiAgICAgIHRoaXMuc2luZ3VsYXJpemUgPSBzZXR0aW5ncy5zaW5ndWxhcml6ZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBSZWdpc3RlciBtb2RlbCBzY2hlbWFzXHJcbiAgICBpZiAoc2V0dGluZ3MubW9kZWxzKSB7XHJcbiAgICAgIHRoaXMuX21vZGVscyA9IHNldHRpbmdzLm1vZGVscztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdlbmVyYXRlIGFuIGlkIGZvciBhIGdpdmVuIG1vZGVsIHR5cGUuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge1N0cmluZ30gdHlwZSBPcHRpb25hbC4gVHlwZSBvZiB0aGUgbW9kZWwgZm9yIHdoaWNoIHRoZSBJRCBpcyBiZWluZyBnZW5lcmF0ZWQuXHJcbiAgICogQHJldHVybiB7U3RyaW5nfSBHZW5lcmF0ZWQgbW9kZWwgSURcclxuICAgKi9cclxuICBnZW5lcmF0ZUlkKHR5cGU/OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIE9yYml0LnV1aWQoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEEgbmFpdmUgcGx1cmFsaXphdGlvbiBtZXRob2QuXHJcbiAgICpcclxuICAgKiBPdmVycmlkZSB3aXRoIGEgbW9yZSByb2J1c3QgZ2VuZXJhbCBwdXJwb3NlIGluZmxlY3RvciBvciBwcm92aWRlIGFuXHJcbiAgICogaW5mbGVjdG9yIHRhaWxvcmVkIHRvIHRoZSB2b2NhYnVsYXJseSBvZiB5b3VyIGFwcGxpY2F0aW9uLlxyXG4gICAqXHJcbiAgICogQHBhcmFtICB7U3RyaW5nfSB3b3JkXHJcbiAgICogQHJldHVybiB7U3RyaW5nfSBwbHVyYWwgZm9ybSBvZiBgd29yZGBcclxuICAgKi9cclxuICBwbHVyYWxpemUod29yZDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB3b3JkICsgJ3MnO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQSBuYWl2ZSBzaW5ndWxhcml6YXRpb24gbWV0aG9kLlxyXG4gICAqXHJcbiAgICogT3ZlcnJpZGUgd2l0aCBhIG1vcmUgcm9idXN0IGdlbmVyYWwgcHVycG9zZSBpbmZsZWN0b3Igb3IgcHJvdmlkZSBhblxyXG4gICAqIGluZmxlY3RvciB0YWlsb3JlZCB0byB0aGUgdm9jYWJ1bGFybHkgb2YgeW91ciBhcHBsaWNhdGlvbi5cclxuICAgKlxyXG4gICAqIEBwYXJhbSAge1N0cmluZ30gd29yZFxyXG4gICAqIEByZXR1cm4ge1N0cmluZ30gc2luZ3VsYXIgZm9ybSBvZiBgd29yZGBcclxuICAgKi9cclxuICBzaW5ndWxhcml6ZSh3b3JkOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgaWYgKHdvcmQubGFzdEluZGV4T2YoJ3MnKSA9PT0gd29yZC5sZW5ndGggLSAxKSB7XHJcbiAgICAgIHJldHVybiB3b3JkLnN1YnN0cigwLCB3b3JkLmxlbmd0aCAtIDEpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIHdvcmQ7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpbml0aWFsaXplUmVjb3JkKHJlY29yZDogUmVjb3JkKTogdm9pZCB7XHJcbiAgICBpZiAocmVjb3JkLmlkID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgcmVjb3JkLmlkID0gdGhpcy5nZW5lcmF0ZUlkKHJlY29yZC50eXBlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldCBtb2RlbHMoKTogRGljdDxNb2RlbERlZmluaXRpb24+IHtcclxuICAgIHJldHVybiB0aGlzLl9tb2RlbHM7XHJcbiAgfVxyXG5cclxuICBnZXRNb2RlbCh0eXBlOiBzdHJpbmcpOiBNb2RlbERlZmluaXRpb24ge1xyXG4gICAgbGV0IG1vZGVsID0gdGhpcy5tb2RlbHNbdHlwZV07XHJcbiAgICBpZiAobW9kZWwpIHtcclxuICAgICAgcmV0dXJuIG1vZGVsO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhyb3cgbmV3IE1vZGVsTm90Rm91bmQodHlwZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBoYXNBdHRyaWJ1dGUodHlwZTogc3RyaW5nLCBhdHRyaWJ1dGU6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgbGV0IG1vZGVsID0gdGhpcy5nZXRNb2RlbCh0eXBlKTtcclxuICAgIGlmIChtb2RlbC5hdHRyaWJ1dGVzICYmIG1vZGVsLmF0dHJpYnV0ZXNbYXR0cmlidXRlXSkge1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGhhc1JlbGF0aW9uc2hpcCh0eXBlOiBzdHJpbmcsIHJlbGF0aW9uc2hpcDogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICBsZXQgbW9kZWwgPSB0aGlzLmdldE1vZGVsKHR5cGUpO1xyXG4gICAgaWYgKG1vZGVsLnJlbGF0aW9uc2hpcHMgJiYgbW9kZWwucmVsYXRpb25zaGlwc1tyZWxhdGlvbnNoaXBdKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXX0=