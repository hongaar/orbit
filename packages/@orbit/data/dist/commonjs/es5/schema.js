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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3JjL3NjaGVtYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLEFBQWdDO0FBQ2hDLHFCQUEyQjtBQUMzQiwwQkFBNEM7QUFFNUMscUJBQStDO0FBb0UvQyxBQVFHOzs7Ozs7Ozs7QUFFSCx5QkFZRSxBQVVHO0FBRUg7Ozs7Ozs7Ozs7O29CQUFZLEFBQTZCLFVBQTdCO2lDQUFBO3VCQUE2QjtBQUN2QyxBQUFFLEFBQUM7WUFBQyxBQUFRLFNBQUMsQUFBTyxZQUFLLEFBQVMsQUFBQyxXQUFDLEFBQUMsQUFDbkMsQUFBUTtxQkFBQyxBQUFPLFVBQUcsQUFBQyxBQUFDLEFBQ3ZCLEFBQUM7QUFFRCxBQUFFLEFBQUM7WUFBQyxBQUFRLFNBQUMsQUFBTSxXQUFLLEFBQVMsQUFBQyxXQUFDLEFBQUMsQUFDbEMsQUFBUTtxQkFBQyxBQUFNLFNBQUcsQUFBRSxBQUFDLEFBQ3ZCLEFBQUM7QUFFRCxBQUFJO2FBQUMsQUFBYyxlQUFDLEFBQVEsQUFBQyxBQUFDLEFBQ2hDLEFBQUM7QUFNRDswQkFBSSxrQkFBTzs7Ozs7YUFBWCxZQUNFLEFBQU07bUJBQUMsQUFBSSxLQUFDLEFBQVEsQUFBQyxBQUN2QixBQUFDOzs7c0JBQUEsQUFFRCxBQVVHO0FBbEJILEFBR0c7QUFnQkg7Ozs7Ozs7Ozs7O3FCQUFPLFVBQVAsVUFBUSxBQUE2QixVQUE3QjtpQ0FBQTt1QkFBNkI7QUFDbkMsQUFBRSxBQUFDO1lBQUMsQUFBUSxTQUFDLEFBQU8sWUFBSyxBQUFTLEFBQUMsV0FBQyxBQUFDLEFBQ25DLEFBQVE7cUJBQUMsQUFBTyxVQUFHLEFBQUksS0FBQyxBQUFRLFdBQUcsQUFBQyxBQUFDLEFBQ3ZDLEFBQUM7QUFDRCxBQUFJO2FBQUMsQUFBYyxlQUFDLEFBQVEsQUFBQyxBQUFDLEFBQzlCLEFBQUk7YUFBQyxBQUFJLEtBQUMsQUFBUyxXQUFFLEFBQUksS0FBQyxBQUFRLEFBQUMsQUFBQyxBQUN0QyxBQUFDO0FBRUQsQUFLRztBQUNIOzs7Ozs7cUJBQWMsaUJBQWQsVUFBZSxBQUF3QixVQUNyQyxBQUFVO0FBQ1YsQUFBSTthQUFDLEFBQVEsV0FBRyxBQUFRLFNBQUMsQUFBTyxBQUFDLEFBRWpDLEFBQWtCO0FBQ2xCLEFBQUUsQUFBQztZQUFDLEFBQVEsU0FBQyxBQUFVLEFBQUMsWUFBQyxBQUFDLEFBQ3hCLEFBQUk7aUJBQUMsQUFBVSxhQUFHLEFBQVEsU0FBQyxBQUFVLEFBQUMsQUFDeEMsQUFBQztBQUNELEFBQUUsQUFBQztZQUFDLEFBQVEsU0FBQyxBQUFTLEFBQUMsV0FBQyxBQUFDLEFBQ3ZCLEFBQUk7aUJBQUMsQUFBUyxZQUFHLEFBQVEsU0FBQyxBQUFTLEFBQUMsQUFDdEMsQUFBQztBQUNELEFBQUUsQUFBQztZQUFDLEFBQVEsU0FBQyxBQUFXLEFBQUMsYUFBQyxBQUFDLEFBQ3pCLEFBQUk7aUJBQUMsQUFBVyxjQUFHLEFBQVEsU0FBQyxBQUFXLEFBQUMsQUFDMUMsQUFBQztBQUVELEFBQXlCO0FBQ3pCLEFBQUUsQUFBQztZQUFDLEFBQVEsU0FBQyxBQUFNLEFBQUMsUUFBQyxBQUFDLEFBQ3BCLEFBQUk7aUJBQUMsQUFBTyxVQUFHLEFBQVEsU0FBQyxBQUFNLEFBQUMsQUFDakMsQUFBQyxBQUNIO0FBQUM7QUFFRCxBQUtHO0FBQ0g7Ozs7OztxQkFBVSxhQUFWLFVBQVcsQUFBYSxNQUN0QixBQUFNO2VBQUMsT0FBSyxRQUFDLEFBQUksQUFBRSxBQUFDLEFBQ3RCLEFBQUM7QUFFRCxBQVFHO0FBQ0g7Ozs7Ozs7OztxQkFBUyxZQUFULFVBQVUsQUFBWSxNQUNwQixBQUFNO2VBQUMsQUFBSSxPQUFHLEFBQUcsQUFBQyxBQUNwQixBQUFDO0FBRUQsQUFRRztBQUNIOzs7Ozs7Ozs7cUJBQVcsY0FBWCxVQUFZLEFBQVksTUFDdEIsQUFBRSxBQUFDO1lBQUMsQUFBSSxLQUFDLEFBQVcsWUFBQyxBQUFHLEFBQUMsU0FBSyxBQUFJLEtBQUMsQUFBTSxTQUFHLEFBQUMsQUFBQyxHQUFDLEFBQUMsQUFDOUMsQUFBTTttQkFBQyxBQUFJLEtBQUMsQUFBTSxPQUFDLEFBQUMsR0FBRSxBQUFJLEtBQUMsQUFBTSxTQUFHLEFBQUMsQUFBQyxBQUFDLEFBQ3pDLEFBQUMsQUFBQyxBQUFJO2VBQUMsQUFBQyxBQUNOLEFBQU07bUJBQUMsQUFBSSxBQUFDLEFBQ2QsQUFBQyxBQUNIO0FBQUM7QUFFRDtxQkFBZ0IsbUJBQWhCLFVBQWlCLEFBQWMsUUFDN0IsQUFBRSxBQUFDO1lBQUMsQUFBTSxPQUFDLEFBQUUsT0FBSyxBQUFTLEFBQUMsV0FBQyxBQUFDLEFBQzVCLEFBQU07bUJBQUMsQUFBRSxLQUFHLEFBQUksS0FBQyxBQUFVLFdBQUMsQUFBTSxPQUFDLEFBQUksQUFBQyxBQUFDLEFBQzNDLEFBQUMsQUFDSDtBQUFDO0FBRUQ7MEJBQUksa0JBQU07YUFBVixZQUNFLEFBQU07bUJBQUMsQUFBSSxLQUFDLEFBQU8sQUFBQyxBQUN0QixBQUFDOzs7c0JBQUEsQUFFRDs7cUJBQVEsV0FBUixVQUFTLEFBQVksTUFDbkI7WUFBSSxBQUFLLFFBQUcsQUFBSSxLQUFDLEFBQU0sT0FBQyxBQUFJLEFBQUMsQUFBQyxBQUM5QixBQUFFLEFBQUM7WUFBQyxBQUFLLEFBQUMsT0FBQyxBQUFDLEFBQ1YsQUFBTTttQkFBQyxBQUFLLEFBQUMsQUFDZixBQUFDLEFBQUMsQUFBSTtlQUFDLEFBQUMsQUFDTjtrQkFBTSxJQUFJLFlBQWEsY0FBQyxBQUFJLEFBQUMsQUFBQyxBQUNoQyxBQUFDLEFBQ0g7QUFBQztBQUVEO3FCQUFZLGVBQVosVUFBYSxBQUFZLE1BQUUsQUFBaUIsV0FDMUM7WUFBSSxBQUFLLFFBQUcsQUFBSSxLQUFDLEFBQVEsU0FBQyxBQUFJLEFBQUMsQUFBQyxBQUNoQyxBQUFFLEFBQUM7WUFBQyxBQUFLLE1BQUMsQUFBVSxjQUFJLEFBQUssTUFBQyxBQUFVLFdBQUMsQUFBUyxBQUFDLEFBQUMsWUFBQyxBQUFDLEFBQ3BELEFBQU07bUJBQUMsQUFBSSxBQUFDLEFBQ2QsQUFBQyxBQUFDLEFBQUk7ZUFBQyxBQUFDLEFBQ04sQUFBTTttQkFBQyxBQUFLLEFBQUMsQUFDZixBQUFDLEFBQ0g7QUFBQztBQUVEO3FCQUFlLGtCQUFmLFVBQWdCLEFBQVksTUFBRSxBQUFvQixjQUNoRDtZQUFJLEFBQUssUUFBRyxBQUFJLEtBQUMsQUFBUSxTQUFDLEFBQUksQUFBQyxBQUFDLEFBQ2hDLEFBQUUsQUFBQztZQUFDLEFBQUssTUFBQyxBQUFhLGlCQUFJLEFBQUssTUFBQyxBQUFhLGNBQUMsQUFBWSxBQUFDLEFBQUMsZUFBQyxBQUFDLEFBQzdELEFBQU07bUJBQUMsQUFBSSxBQUFDLEFBQ2QsQUFBQyxBQUFDLEFBQUk7ZUFBQyxBQUFDLEFBQ04sQUFBTTttQkFBQyxBQUFLLEFBQUMsQUFDZixBQUFDLEFBQ0g7QUFBQztBQXJLa0IsQUFBTTt5QkFEMUIsT0FBTyxVQUNhLEFBQU0sQUFzSzNCLEFBQUM7V0F0S0QsQUFzS0M7O2tCQXRLb0IsQUFBTSIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIHZhbGlkLWpzZG9jICovXHJcbmltcG9ydCBPcmJpdCBmcm9tICcuL21haW4nO1xyXG5pbXBvcnQgeyBNb2RlbE5vdEZvdW5kIH0gZnJvbSAnLi9leGNlcHRpb24nO1xyXG5pbXBvcnQgeyBhc3NlcnQsIGNsb25lLCBEaWN0IH0gZnJvbSAnQG9yYml0L3V0aWxzJztcclxuaW1wb3J0IHsgZXZlbnRlZCwgRXZlbnRlZCB9IGZyb20gJ0BvcmJpdC9jb3JlJztcclxuaW1wb3J0IHsgUmVjb3JkLCBSZWNvcmRJbml0aWFsaXplciB9IGZyb20gJy4vcmVjb3JkJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQXR0cmlidXRlRGVmaW5pdGlvbiB7XHJcbiAgdHlwZT86IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBSZWxhdGlvbnNoaXBEZWZpbml0aW9uIHtcclxuICB0eXBlOiAnaGFzTWFueScgfCAnaGFzT25lJztcclxuICBtb2RlbD86IHN0cmluZztcclxuICBpbnZlcnNlPzogc3RyaW5nO1xyXG4gIGRlcGVuZGVudD86ICdyZW1vdmUnO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEtleURlZmluaXRpb24ge1xyXG4gIHByaW1hcnlLZXk/OiBib29sZWFuO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIE1vZGVsRGVmaW5pdGlvbiB7XHJcbiAga2V5cz86IERpY3Q8S2V5RGVmaW5pdGlvbj47XHJcbiAgYXR0cmlidXRlcz86IERpY3Q8QXR0cmlidXRlRGVmaW5pdGlvbj47XHJcbiAgcmVsYXRpb25zaGlwcz86IERpY3Q8UmVsYXRpb25zaGlwRGVmaW5pdGlvbj47XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTZXR0aW5ncyB1c2VkIHRvIGluaXRpYWx6ZSBhbmQvb3IgdXBncmFkZSBzY2hlbWFzLlxyXG4gKlxyXG4gKiBAZXhwb3J0XHJcbiAqIEBpbnRlcmZhY2UgU2NoZW1hU2V0dGluZ3NcclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgU2NoZW1hU2V0dGluZ3Mge1xyXG4gIC8qKlxyXG4gICAqIFNjaGVtYSB2ZXJzaW9uLiBEZWZhdWx0cyB0byAxLlxyXG4gICAqXHJcbiAgICogQHR5cGUge251bWJlcn1AbWVtYmVyb2YgU2NoZW1hU2V0dGluZ3NcclxuICAgKi9cclxuICB2ZXJzaW9uPzogbnVtYmVyO1xyXG5cclxuICAvKipcclxuICAgKiBGdW5jdGlvbiB1c2VkIHRvIGdlbmVyYXRlIHJlY29yZCBJRHMuXHJcbiAgICpcclxuICAgKiBAbWVtYmVyb2YgU2NoZW1hU2V0dGluZ3NcclxuICAgKi9cclxuICBnZW5lcmF0ZUlkPzogKG1vZGVsPzogc3RyaW5nKSA9PiBzdHJpbmc7XHJcblxyXG4gIC8qKlxyXG4gICAqIEZ1bmN0aW9uIHVzZWQgdG8gcGx1cmFsaXplIG5hbWVzLlxyXG4gICAqXHJcbiAgICogQG1lbWJlcm9mIFNjaGVtYVNldHRpbmdzXHJcbiAgICovXHJcbiAgcGx1cmFsaXplPzogKHdvcmQ6IHN0cmluZykgPT4gc3RyaW5nO1xyXG5cclxuICAvKipcclxuICAgKiBGdW5jdGlvbiB1c2VkIHRvIHNpbmd1bGFyaXplIG5hbWVzLlxyXG4gICAqXHJcbiAgICogQG1lbWJlcm9mIFNjaGVtYVNldHRpbmdzXHJcbiAgICovXHJcbiAgc2luZ3VsYXJpemU/OiAod29yZDogc3RyaW5nKSA9PiBzdHJpbmc7XHJcblxyXG4gIC8qKlxyXG4gICAqIE1hcCBvZiBtb2RlbCBkZWZpbml0aW9ucy5cclxuICAgKlxyXG4gICAqIEB0eXBlIHtEaWN0PE1vZGVsRGVmaW5pdGlvbj59XHJcbiAgICogQG1lbWJlcm9mIFNjaGVtYVNldHRpbmdzXHJcbiAgICovXHJcbiAgbW9kZWxzPzogRGljdDxNb2RlbERlZmluaXRpb24+O1xyXG59XHJcblxyXG4vKipcclxuICogQSBgU2NoZW1hYCBkZWZpbmVzIHRoZSBtb2RlbHMgYWxsb3dlZCBpbiBhIHNvdXJjZSwgaW5jbHVkaW5nIHRoZWlyIGtleXMsXHJcbiAqIGF0dHJpYnV0ZXMsIGFuZCByZWxhdGlvbnNoaXBzLiBBIHNpbmdsZSBzY2hlbWEgbWF5IGJlIHNoYXJlZCBhY3Jvc3MgbXVsdGlwbGVcclxuICogc291cmNlcy5cclxuICpcclxuICogQGV4cG9ydFxyXG4gKiBAY2xhc3MgU2NoZW1hXHJcbiAqIEBpbXBsZW1lbnRzIHtFdmVudGVkfVxyXG4gKi9cclxuQGV2ZW50ZWRcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2NoZW1hIGltcGxlbWVudHMgRXZlbnRlZCwgUmVjb3JkSW5pdGlhbGl6ZXIge1xyXG4gIHByaXZhdGUgX21vZGVsczogRGljdDxNb2RlbERlZmluaXRpb24+O1xyXG5cclxuICBwcml2YXRlIF92ZXJzaW9uOiBudW1iZXI7XHJcblxyXG4gIC8vIEV2ZW50ZWQgaW50ZXJmYWNlIHN0dWJzXHJcbiAgb246IChldmVudDogc3RyaW5nLCBjYWxsYmFjazogKGFueSkgPT4gdm9pZCwgYmluZGluZz86IGFueSkgPT4gdm9pZDtcclxuICBvZmY6IChldmVudDogc3RyaW5nLCBjYWxsYmFjazogKGFueSkgPT4gdm9pZCwgYmluZGluZz86IGFueSkgPT4gdm9pZDtcclxuICBvbmU6IChldmVudDogc3RyaW5nLCBjYWxsYmFjazogKGFueSkgPT4gdm9pZCwgYmluZGluZz86IGFueSkgPT4gdm9pZDtcclxuICBlbWl0OiAoZXZlbnQ6IHN0cmluZywgLi4uYXJncykgPT4gdm9pZDtcclxuICBsaXN0ZW5lcnM6IChldmVudDogc3RyaW5nKSA9PiBhbnlbXTtcclxuXHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlIGEgbmV3IFNjaGVtYS5cclxuICAgKlxyXG4gICAqIEBjb25zdHJ1Y3RvclxyXG4gICAqIEBwYXJhbSB7U2NoZW1hU2V0dGluZ3N9IFtzZXR0aW5ncz17fV0gT3B0aW9uYWwuIENvbmZpZ3VyYXRpb24gc2V0dGluZ3MuXHJcbiAgICogQHBhcmFtIHtJbnRlZ2VyfSAgICAgICAgW3NldHRpbmdzLnZlcnNpb25dICAgICAgIE9wdGlvbmFsLiBTY2hlbWEgdmVyc2lvbi4gRGVmYXVsdHMgdG8gMS5cclxuICAgKiBAcGFyYW0ge09iamVjdH0gICBbc2V0dGluZ3MubW9kZWxzXSAgICAgICAgT3B0aW9uYWwuIFNjaGVtYXMgZm9yIGluZGl2aWR1YWwgbW9kZWxzIHN1cHBvcnRlZCBieSB0aGlzIHNjaGVtYS5cclxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbc2V0dGluZ3MuZ2VuZXJhdGVJZF0gICAgT3B0aW9uYWwuIEZ1bmN0aW9uIHVzZWQgdG8gZ2VuZXJhdGUgSURzLlxyXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IFtzZXR0aW5ncy5wbHVyYWxpemVdICAgICBPcHRpb25hbC4gRnVuY3Rpb24gdXNlZCB0byBwbHVyYWxpemUgbmFtZXMuXHJcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gW3NldHRpbmdzLnNpbmd1bGFyaXplXSAgIE9wdGlvbmFsLiBGdW5jdGlvbiB1c2VkIHRvIHNpbmd1bGFyaXplIG5hbWVzLlxyXG4gICAqL1xyXG5cclxuICBjb25zdHJ1Y3RvcihzZXR0aW5nczogU2NoZW1hU2V0dGluZ3MgPSB7fSkge1xyXG4gICAgaWYgKHNldHRpbmdzLnZlcnNpb24gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICBzZXR0aW5ncy52ZXJzaW9uID0gMTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoc2V0dGluZ3MubW9kZWxzID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgc2V0dGluZ3MubW9kZWxzID0ge307XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5fYXBwbHlTZXR0aW5ncyhzZXR0aW5ncyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBWZXJzaW9uXHJcbiAgICogQHJldHVybiB7SW50ZWdlcn0gVmVyc2lvbiBvZiBzY2hlbWEuXHJcbiAgICovXHJcbiAgZ2V0IHZlcnNpb24oKTogbnVtYmVyIHtcclxuICAgIHJldHVybiB0aGlzLl92ZXJzaW9uO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVXBncmFkZXMgU2NoZW1hIHRvIGEgbmV3IHZlcnNpb24gd2l0aCBuZXcgc2V0dGluZ3MuXHJcbiAgICpcclxuICAgKiBFbWl0cyB0aGUgYHVwZ3JhZGVgIGV2ZW50IHRvIGN1ZSBzb3VyY2VzIHRvIHVwZ3JhZGUgdGhlaXIgZGF0YS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7U2NoZW1hU2V0dGluZ3N9IFtzZXR0aW5ncz17fV0gICAgICAgICAgU2V0dGluZ3MuXHJcbiAgICogQHBhcmFtIHtJbnRlZ2VyfSAgICAgICAgW3NldHRpbmdzLnZlcnNpb25dICAgICBPcHRpb25hbC4gU2NoZW1hIHZlcnNpb24uIERlZmF1bHRzIHRvIHRoZSBjdXJyZW50IHZlcnNpb24gKyAxLlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSAgICAgICAgIFtzZXR0aW5ncy5tb2RlbHNdICAgICAgU2NoZW1hcyBmb3IgaW5kaXZpZHVhbCBtb2RlbHMgc3VwcG9ydGVkIGJ5IHRoaXMgc2NoZW1hLlxyXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259ICAgICAgIFtzZXR0aW5ncy5wbHVyYWxpemVdICAgT3B0aW9uYWwuIEZ1bmN0aW9uIHVzZWQgdG8gcGx1cmFsaXplIG5hbWVzLlxyXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259ICAgICAgIFtzZXR0aW5ncy5zaW5ndWxhcml6ZV0gT3B0aW9uYWwuIEZ1bmN0aW9uIHVzZWQgdG8gc2luZ3VsYXJpemUgbmFtZXMuXHJcbiAgICovXHJcbiAgdXBncmFkZShzZXR0aW5nczogU2NoZW1hU2V0dGluZ3MgPSB7fSk6IHZvaWQge1xyXG4gICAgaWYgKHNldHRpbmdzLnZlcnNpb24gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICBzZXR0aW5ncy52ZXJzaW9uID0gdGhpcy5fdmVyc2lvbiArIDE7XHJcbiAgICB9XHJcbiAgICB0aGlzLl9hcHBseVNldHRpbmdzKHNldHRpbmdzKTtcclxuICAgIHRoaXMuZW1pdCgndXBncmFkZScsIHRoaXMuX3ZlcnNpb24pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmVnaXN0ZXJzIGEgY29tcGxldGUgc2V0IG9mIHNldHRpbmdzXHJcbiAgICpcclxuICAgKiBAcHJpdmF0ZVxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzZXR0aW5ncyBTZXR0aW5ncyBwYXNzZWQgaW50byBgY29uc3RydWN0b3JgIG9yIGB1cGdyYWRlYC5cclxuICAgKi9cclxuICBfYXBwbHlTZXR0aW5ncyhzZXR0aW5nczogU2NoZW1hU2V0dGluZ3MpOiB2b2lkIHtcclxuICAgIC8vIFZlcnNpb25cclxuICAgIHRoaXMuX3ZlcnNpb24gPSBzZXR0aW5ncy52ZXJzaW9uO1xyXG5cclxuICAgIC8vIEFsbG93IG92ZXJyaWRlc1xyXG4gICAgaWYgKHNldHRpbmdzLmdlbmVyYXRlSWQpIHtcclxuICAgICAgdGhpcy5nZW5lcmF0ZUlkID0gc2V0dGluZ3MuZ2VuZXJhdGVJZDtcclxuICAgIH1cclxuICAgIGlmIChzZXR0aW5ncy5wbHVyYWxpemUpIHtcclxuICAgICAgdGhpcy5wbHVyYWxpemUgPSBzZXR0aW5ncy5wbHVyYWxpemU7XHJcbiAgICB9XHJcbiAgICBpZiAoc2V0dGluZ3Muc2luZ3VsYXJpemUpIHtcclxuICAgICAgdGhpcy5zaW5ndWxhcml6ZSA9IHNldHRpbmdzLnNpbmd1bGFyaXplO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFJlZ2lzdGVyIG1vZGVsIHNjaGVtYXNcclxuICAgIGlmIChzZXR0aW5ncy5tb2RlbHMpIHtcclxuICAgICAgdGhpcy5fbW9kZWxzID0gc2V0dGluZ3MubW9kZWxzO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2VuZXJhdGUgYW4gaWQgZm9yIGEgZ2l2ZW4gbW9kZWwgdHlwZS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIE9wdGlvbmFsLiBUeXBlIG9mIHRoZSBtb2RlbCBmb3Igd2hpY2ggdGhlIElEIGlzIGJlaW5nIGdlbmVyYXRlZC5cclxuICAgKiBAcmV0dXJuIHtTdHJpbmd9IEdlbmVyYXRlZCBtb2RlbCBJRFxyXG4gICAqL1xyXG4gIGdlbmVyYXRlSWQodHlwZT86IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gT3JiaXQudXVpZCgpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQSBuYWl2ZSBwbHVyYWxpemF0aW9uIG1ldGhvZC5cclxuICAgKlxyXG4gICAqIE92ZXJyaWRlIHdpdGggYSBtb3JlIHJvYnVzdCBnZW5lcmFsIHB1cnBvc2UgaW5mbGVjdG9yIG9yIHByb3ZpZGUgYW5cclxuICAgKiBpbmZsZWN0b3IgdGFpbG9yZWQgdG8gdGhlIHZvY2FidWxhcmx5IG9mIHlvdXIgYXBwbGljYXRpb24uXHJcbiAgICpcclxuICAgKiBAcGFyYW0gIHtTdHJpbmd9IHdvcmRcclxuICAgKiBAcmV0dXJuIHtTdHJpbmd9IHBsdXJhbCBmb3JtIG9mIGB3b3JkYFxyXG4gICAqL1xyXG4gIHBsdXJhbGl6ZSh3b3JkOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHdvcmQgKyAncyc7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBBIG5haXZlIHNpbmd1bGFyaXphdGlvbiBtZXRob2QuXHJcbiAgICpcclxuICAgKiBPdmVycmlkZSB3aXRoIGEgbW9yZSByb2J1c3QgZ2VuZXJhbCBwdXJwb3NlIGluZmxlY3RvciBvciBwcm92aWRlIGFuXHJcbiAgICogaW5mbGVjdG9yIHRhaWxvcmVkIHRvIHRoZSB2b2NhYnVsYXJseSBvZiB5b3VyIGFwcGxpY2F0aW9uLlxyXG4gICAqXHJcbiAgICogQHBhcmFtICB7U3RyaW5nfSB3b3JkXHJcbiAgICogQHJldHVybiB7U3RyaW5nfSBzaW5ndWxhciBmb3JtIG9mIGB3b3JkYFxyXG4gICAqL1xyXG4gIHNpbmd1bGFyaXplKHdvcmQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICBpZiAod29yZC5sYXN0SW5kZXhPZigncycpID09PSB3b3JkLmxlbmd0aCAtIDEpIHtcclxuICAgICAgcmV0dXJuIHdvcmQuc3Vic3RyKDAsIHdvcmQubGVuZ3RoIC0gMSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gd29yZDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGluaXRpYWxpemVSZWNvcmQocmVjb3JkOiBSZWNvcmQpOiB2b2lkIHtcclxuICAgIGlmIChyZWNvcmQuaWQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICByZWNvcmQuaWQgPSB0aGlzLmdlbmVyYXRlSWQocmVjb3JkLnR5cGUpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0IG1vZGVscygpOiBEaWN0PE1vZGVsRGVmaW5pdGlvbj4ge1xyXG4gICAgcmV0dXJuIHRoaXMuX21vZGVscztcclxuICB9XHJcblxyXG4gIGdldE1vZGVsKHR5cGU6IHN0cmluZyk6IE1vZGVsRGVmaW5pdGlvbiB7XHJcbiAgICBsZXQgbW9kZWwgPSB0aGlzLm1vZGVsc1t0eXBlXTtcclxuICAgIGlmIChtb2RlbCkge1xyXG4gICAgICByZXR1cm4gbW9kZWw7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aHJvdyBuZXcgTW9kZWxOb3RGb3VuZCh0eXBlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGhhc0F0dHJpYnV0ZSh0eXBlOiBzdHJpbmcsIGF0dHJpYnV0ZTogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICBsZXQgbW9kZWwgPSB0aGlzLmdldE1vZGVsKHR5cGUpO1xyXG4gICAgaWYgKG1vZGVsLmF0dHJpYnV0ZXMgJiYgbW9kZWwuYXR0cmlidXRlc1thdHRyaWJ1dGVdKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaGFzUmVsYXRpb25zaGlwKHR5cGU6IHN0cmluZywgcmVsYXRpb25zaGlwOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgIGxldCBtb2RlbCA9IHRoaXMuZ2V0TW9kZWwodHlwZSk7XHJcbiAgICBpZiAobW9kZWwucmVsYXRpb25zaGlwcyAmJiBtb2RlbC5yZWxhdGlvbnNoaXBzW3JlbGF0aW9uc2hpcF0pIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdfQ==