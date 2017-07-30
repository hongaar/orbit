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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3JjL3NjaGVtYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsQUFBZ0M7QUFDaEMscUJBQTJCO0FBRTNCLHFCQUErQztBQW9FL0MsQUFRRzs7Ozs7Ozs7O0FBRUg7QUFZRSxBQVVHOzs7Ozs7Ozs7OztBQUVILG9CQUFZLEFBQTZCO0FBQTdCLGlDQUFBO0FBQUEsdUJBQTZCOztBQUN2QyxBQUFFLEFBQUMsWUFBQyxBQUFRLFNBQUMsQUFBTyxZQUFLLEFBQVMsQUFBQyxXQUFDLEFBQUM7QUFDbkMsQUFBUSxxQkFBQyxBQUFPLFVBQUcsQUFBQyxBQUFDLEFBQ3ZCO0FBQUM7QUFFRCxBQUFJLGFBQUMsQUFBYyxlQUFDLEFBQVEsQUFBQyxBQUFDLEFBQ2hDO0FBQUM7QUFNRCwwQkFBSSxrQkFBTztBQUpYLEFBR0c7Ozs7YUFDSDtBQUNFLEFBQU0sbUJBQUMsQUFBSSxLQUFDLEFBQVEsQUFBQyxBQUN2QjtBQUFDOztzQkFBQTs7QUFFRCxBQVVHOzs7Ozs7Ozs7OztBQUNILHFCQUFPLFVBQVAsVUFBUSxBQUE2QjtBQUE3QixpQ0FBQTtBQUFBLHVCQUE2Qjs7QUFDbkMsQUFBRSxBQUFDLFlBQUMsQUFBUSxTQUFDLEFBQU8sWUFBSyxBQUFTLEFBQUMsV0FBQyxBQUFDO0FBQ25DLEFBQVEscUJBQUMsQUFBTyxVQUFHLEFBQUksS0FBQyxBQUFRLFdBQUcsQUFBQyxBQUFDLEFBQ3ZDO0FBQUM7QUFDRCxBQUFJLGFBQUMsQUFBYyxlQUFDLEFBQVEsQUFBQyxBQUFDO0FBQzlCLEFBQUksYUFBQyxBQUFJLEtBQUMsQUFBUyxXQUFFLEFBQUksS0FBQyxBQUFRLEFBQUMsQUFBQyxBQUN0QztBQUFDO0FBRUQsQUFLRzs7Ozs7O0FBQ0gscUJBQWMsaUJBQWQsVUFBZSxBQUF3QjtBQUNyQyxBQUFVO0FBQ1YsQUFBSSxhQUFDLEFBQVEsV0FBRyxBQUFRLFNBQUMsQUFBTyxBQUFDO0FBRWpDLEFBQWtCO0FBQ2xCLEFBQUUsQUFBQyxZQUFDLEFBQVEsU0FBQyxBQUFVLEFBQUMsWUFBQyxBQUFDO0FBQ3hCLEFBQUksaUJBQUMsQUFBVSxhQUFHLEFBQVEsU0FBQyxBQUFVLEFBQUMsQUFDeEM7QUFBQztBQUNELEFBQUUsQUFBQyxZQUFDLEFBQVEsU0FBQyxBQUFTLEFBQUMsV0FBQyxBQUFDO0FBQ3ZCLEFBQUksaUJBQUMsQUFBUyxZQUFHLEFBQVEsU0FBQyxBQUFTLEFBQUMsQUFDdEM7QUFBQztBQUNELEFBQUUsQUFBQyxZQUFDLEFBQVEsU0FBQyxBQUFXLEFBQUMsYUFBQyxBQUFDO0FBQ3pCLEFBQUksaUJBQUMsQUFBVyxjQUFHLEFBQVEsU0FBQyxBQUFXLEFBQUMsQUFDMUM7QUFBQztBQUVELEFBQXlCO0FBQ3pCLEFBQUUsQUFBQyxZQUFDLEFBQVEsU0FBQyxBQUFNLEFBQUMsUUFBQyxBQUFDO0FBQ3BCLEFBQUksaUJBQUMsQUFBTSxTQUFHLEFBQVEsU0FBQyxBQUFNLEFBQUMsQUFDaEM7QUFBQyxBQUNIO0FBQUM7QUFFRCxBQUtHOzs7Ozs7QUFDSCxxQkFBVSxhQUFWLFVBQVcsQUFBYTtBQUN0QixBQUFNLGVBQUMsT0FBSyxRQUFDLEFBQUksQUFBRSxBQUFDLEFBQ3RCO0FBQUM7QUFFRCxBQVFHOzs7Ozs7Ozs7QUFDSCxxQkFBUyxZQUFULFVBQVUsQUFBWTtBQUNwQixBQUFNLGVBQUMsQUFBSSxPQUFHLEFBQUcsQUFBQyxBQUNwQjtBQUFDO0FBRUQsQUFRRzs7Ozs7Ozs7O0FBQ0gscUJBQVcsY0FBWCxVQUFZLEFBQVk7QUFDdEIsQUFBRSxBQUFDLFlBQUMsQUFBSSxLQUFDLEFBQVcsWUFBQyxBQUFHLEFBQUMsU0FBSyxBQUFJLEtBQUMsQUFBTSxTQUFHLEFBQUMsQUFBQyxHQUFDLEFBQUM7QUFDOUMsQUFBTSxtQkFBQyxBQUFJLEtBQUMsQUFBTSxPQUFDLEFBQUMsR0FBRSxBQUFJLEtBQUMsQUFBTSxTQUFHLEFBQUMsQUFBQyxBQUFDLEFBQ3pDO0FBQUMsQUFBQyxBQUFJLGVBQUMsQUFBQztBQUNOLEFBQU0sbUJBQUMsQUFBSSxBQUFDLEFBQ2Q7QUFBQyxBQUNIO0FBQUM7QUFFRCxxQkFBZ0IsbUJBQWhCLFVBQWlCLEFBQWM7QUFDN0IsQUFBRSxBQUFDLFlBQUMsQUFBTSxPQUFDLEFBQUUsT0FBSyxBQUFTLEFBQUMsV0FBQyxBQUFDO0FBQzVCLEFBQU0sbUJBQUMsQUFBRSxLQUFHLEFBQUksS0FBQyxBQUFVLFdBQUMsQUFBTSxPQUFDLEFBQUksQUFBQyxBQUFDLEFBQzNDO0FBQUMsQUFDSDtBQUFDO0FBbElrQixBQUFNLHlCQUQxQixPQUFPLFVBQ2EsQUFBTSxBQW1JMUI7QUFBRCxXQUFDO0FBbklELEFBbUlDO2tCQW5Jb0IsQUFBTSIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIHZhbGlkLWpzZG9jICovXHJcbmltcG9ydCBPcmJpdCBmcm9tICcuL21haW4nO1xyXG5pbXBvcnQgeyBhc3NlcnQsIGNsb25lLCBEaWN0IH0gZnJvbSAnQG9yYml0L3V0aWxzJztcclxuaW1wb3J0IHsgZXZlbnRlZCwgRXZlbnRlZCB9IGZyb20gJ0BvcmJpdC9jb3JlJztcclxuaW1wb3J0IHsgUmVjb3JkLCBSZWNvcmRJbml0aWFsaXplciB9IGZyb20gJy4vcmVjb3JkJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQXR0cmlidXRlRGVmaW5pdGlvbiB7XHJcbiAgdHlwZT86IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBSZWxhdGlvbnNoaXBEZWZpbml0aW9uIHtcclxuICB0eXBlOiAnaGFzTWFueScgfCAnaGFzT25lJztcclxuICBtb2RlbD86IHN0cmluZztcclxuICBpbnZlcnNlPzogc3RyaW5nO1xyXG4gIGRlcGVuZGVudD86ICdyZW1vdmUnO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEtleURlZmluaXRpb24ge1xyXG4gIHByaW1hcnlLZXk/OiBib29sZWFuO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIE1vZGVsRGVmaW5pdGlvbiB7XHJcbiAga2V5cz86IERpY3Q8S2V5RGVmaW5pdGlvbj47XHJcbiAgYXR0cmlidXRlcz86IERpY3Q8QXR0cmlidXRlRGVmaW5pdGlvbj47XHJcbiAgcmVsYXRpb25zaGlwcz86IERpY3Q8UmVsYXRpb25zaGlwRGVmaW5pdGlvbj47XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTZXR0aW5ncyB1c2VkIHRvIGluaXRpYWx6ZSBhbmQvb3IgdXBncmFkZSBzY2hlbWFzLlxyXG4gKlxyXG4gKiBAZXhwb3J0XHJcbiAqIEBpbnRlcmZhY2UgU2NoZW1hU2V0dGluZ3NcclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgU2NoZW1hU2V0dGluZ3Mge1xyXG4gIC8qKlxyXG4gICAqIFNjaGVtYSB2ZXJzaW9uLiBEZWZhdWx0cyB0byAxLlxyXG4gICAqXHJcbiAgICogQHR5cGUge251bWJlcn1AbWVtYmVyb2YgU2NoZW1hU2V0dGluZ3NcclxuICAgKi9cclxuICB2ZXJzaW9uPzogbnVtYmVyO1xyXG5cclxuICAvKipcclxuICAgKiBGdW5jdGlvbiB1c2VkIHRvIGdlbmVyYXRlIHJlY29yZCBJRHMuXHJcbiAgICpcclxuICAgKiBAbWVtYmVyb2YgU2NoZW1hU2V0dGluZ3NcclxuICAgKi9cclxuICBnZW5lcmF0ZUlkPzogKG1vZGVsPzogc3RyaW5nKSA9PiBzdHJpbmc7XHJcblxyXG4gIC8qKlxyXG4gICAqIEZ1bmN0aW9uIHVzZWQgdG8gcGx1cmFsaXplIG5hbWVzLlxyXG4gICAqXHJcbiAgICogQG1lbWJlcm9mIFNjaGVtYVNldHRpbmdzXHJcbiAgICovXHJcbiAgcGx1cmFsaXplPzogKHdvcmQ6IHN0cmluZykgPT4gc3RyaW5nO1xyXG5cclxuICAvKipcclxuICAgKiBGdW5jdGlvbiB1c2VkIHRvIHNpbmd1bGFyaXplIG5hbWVzLlxyXG4gICAqXHJcbiAgICogQG1lbWJlcm9mIFNjaGVtYVNldHRpbmdzXHJcbiAgICovXHJcbiAgc2luZ3VsYXJpemU/OiAod29yZDogc3RyaW5nKSA9PiBzdHJpbmc7XHJcblxyXG4gIC8qKlxyXG4gICAqIE1hcCBvZiBtb2RlbCBkZWZpbml0aW9ucy5cclxuICAgKlxyXG4gICAqIEB0eXBlIHtEaWN0PE1vZGVsRGVmaW5pdGlvbj59XHJcbiAgICogQG1lbWJlcm9mIFNjaGVtYVNldHRpbmdzXHJcbiAgICovXHJcbiAgbW9kZWxzPzogRGljdDxNb2RlbERlZmluaXRpb24+O1xyXG59XHJcblxyXG4vKipcclxuICogQSBgU2NoZW1hYCBkZWZpbmVzIHRoZSBtb2RlbHMgYWxsb3dlZCBpbiBhIHNvdXJjZSwgaW5jbHVkaW5nIHRoZWlyIGtleXMsXHJcbiAqIGF0dHJpYnV0ZXMsIGFuZCByZWxhdGlvbnNoaXBzLiBBIHNpbmdsZSBzY2hlbWEgbWF5IGJlIHNoYXJlZCBhY3Jvc3MgbXVsdGlwbGVcclxuICogc291cmNlcy5cclxuICpcclxuICogQGV4cG9ydFxyXG4gKiBAY2xhc3MgU2NoZW1hXHJcbiAqIEBpbXBsZW1lbnRzIHtFdmVudGVkfVxyXG4gKi9cclxuQGV2ZW50ZWRcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2NoZW1hIGltcGxlbWVudHMgRXZlbnRlZCwgUmVjb3JkSW5pdGlhbGl6ZXIge1xyXG4gIG1vZGVsczogRGljdDxNb2RlbERlZmluaXRpb24+O1xyXG5cclxuICBwcml2YXRlIF92ZXJzaW9uOiBudW1iZXI7XHJcblxyXG4gIC8vIEV2ZW50ZWQgaW50ZXJmYWNlIHN0dWJzXHJcbiAgb246IChldmVudDogc3RyaW5nLCBjYWxsYmFjazogKGFueSkgPT4gdm9pZCwgYmluZGluZz86IGFueSkgPT4gdm9pZDtcclxuICBvZmY6IChldmVudDogc3RyaW5nLCBjYWxsYmFjazogKGFueSkgPT4gdm9pZCwgYmluZGluZz86IGFueSkgPT4gdm9pZDtcclxuICBvbmU6IChldmVudDogc3RyaW5nLCBjYWxsYmFjazogKGFueSkgPT4gdm9pZCwgYmluZGluZz86IGFueSkgPT4gdm9pZDtcclxuICBlbWl0OiAoZXZlbnQ6IHN0cmluZywgLi4uYXJncykgPT4gdm9pZDtcclxuICBsaXN0ZW5lcnM6IChldmVudDogc3RyaW5nKSA9PiBhbnlbXTtcclxuXHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlIGEgbmV3IFNjaGVtYS5cclxuICAgKlxyXG4gICAqIEBjb25zdHJ1Y3RvclxyXG4gICAqIEBwYXJhbSB7U2NoZW1hU2V0dGluZ3N9IFtzZXR0aW5ncz17fV0gT3B0aW9uYWwuIENvbmZpZ3VyYXRpb24gc2V0dGluZ3MuXHJcbiAgICogQHBhcmFtIHtJbnRlZ2VyfSAgICAgICAgW3NldHRpbmdzLnZlcnNpb25dICAgICAgIE9wdGlvbmFsLiBTY2hlbWEgdmVyc2lvbi4gRGVmYXVsdHMgdG8gMS5cclxuICAgKiBAcGFyYW0ge09iamVjdH0gICBbc2V0dGluZ3MubW9kZWxzXSAgICAgICAgT3B0aW9uYWwuIFNjaGVtYXMgZm9yIGluZGl2aWR1YWwgbW9kZWxzIHN1cHBvcnRlZCBieSB0aGlzIHNjaGVtYS5cclxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbc2V0dGluZ3MuZ2VuZXJhdGVJZF0gICAgT3B0aW9uYWwuIEZ1bmN0aW9uIHVzZWQgdG8gZ2VuZXJhdGUgSURzLlxyXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IFtzZXR0aW5ncy5wbHVyYWxpemVdICAgICBPcHRpb25hbC4gRnVuY3Rpb24gdXNlZCB0byBwbHVyYWxpemUgbmFtZXMuXHJcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gW3NldHRpbmdzLnNpbmd1bGFyaXplXSAgIE9wdGlvbmFsLiBGdW5jdGlvbiB1c2VkIHRvIHNpbmd1bGFyaXplIG5hbWVzLlxyXG4gICAqL1xyXG5cclxuICBjb25zdHJ1Y3RvcihzZXR0aW5nczogU2NoZW1hU2V0dGluZ3MgPSB7fSkge1xyXG4gICAgaWYgKHNldHRpbmdzLnZlcnNpb24gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICBzZXR0aW5ncy52ZXJzaW9uID0gMTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLl9hcHBseVNldHRpbmdzKHNldHRpbmdzKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFZlcnNpb25cclxuICAgKiBAcmV0dXJuIHtJbnRlZ2VyfSBWZXJzaW9uIG9mIHNjaGVtYS5cclxuICAgKi9cclxuICBnZXQgdmVyc2lvbigpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIHRoaXMuX3ZlcnNpb247XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBVcGdyYWRlcyBTY2hlbWEgdG8gYSBuZXcgdmVyc2lvbiB3aXRoIG5ldyBzZXR0aW5ncy5cclxuICAgKlxyXG4gICAqIEVtaXRzIHRoZSBgdXBncmFkZWAgZXZlbnQgdG8gY3VlIHNvdXJjZXMgdG8gdXBncmFkZSB0aGVpciBkYXRhLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtTY2hlbWFTZXR0aW5nc30gW3NldHRpbmdzPXt9XSAgICAgICAgICBTZXR0aW5ncy5cclxuICAgKiBAcGFyYW0ge0ludGVnZXJ9ICAgICAgICBbc2V0dGluZ3MudmVyc2lvbl0gICAgIE9wdGlvbmFsLiBTY2hlbWEgdmVyc2lvbi4gRGVmYXVsdHMgdG8gdGhlIGN1cnJlbnQgdmVyc2lvbiArIDEuXHJcbiAgICogQHBhcmFtIHtPYmplY3R9ICAgICAgICAgW3NldHRpbmdzLm1vZGVsc10gICAgICBTY2hlbWFzIGZvciBpbmRpdmlkdWFsIG1vZGVscyBzdXBwb3J0ZWQgYnkgdGhpcyBzY2hlbWEuXHJcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gICAgICAgW3NldHRpbmdzLnBsdXJhbGl6ZV0gICBPcHRpb25hbC4gRnVuY3Rpb24gdXNlZCB0byBwbHVyYWxpemUgbmFtZXMuXHJcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gICAgICAgW3NldHRpbmdzLnNpbmd1bGFyaXplXSBPcHRpb25hbC4gRnVuY3Rpb24gdXNlZCB0byBzaW5ndWxhcml6ZSBuYW1lcy5cclxuICAgKi9cclxuICB1cGdyYWRlKHNldHRpbmdzOiBTY2hlbWFTZXR0aW5ncyA9IHt9KTogdm9pZCB7XHJcbiAgICBpZiAoc2V0dGluZ3MudmVyc2lvbiA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHNldHRpbmdzLnZlcnNpb24gPSB0aGlzLl92ZXJzaW9uICsgMTtcclxuICAgIH1cclxuICAgIHRoaXMuX2FwcGx5U2V0dGluZ3Moc2V0dGluZ3MpO1xyXG4gICAgdGhpcy5lbWl0KCd1cGdyYWRlJywgdGhpcy5fdmVyc2lvbik7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZWdpc3RlcnMgYSBjb21wbGV0ZSBzZXQgb2Ygc2V0dGluZ3NcclxuICAgKlxyXG4gICAqIEBwcml2YXRlXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IHNldHRpbmdzIFNldHRpbmdzIHBhc3NlZCBpbnRvIGBjb25zdHJ1Y3RvcmAgb3IgYHVwZ3JhZGVgLlxyXG4gICAqL1xyXG4gIF9hcHBseVNldHRpbmdzKHNldHRpbmdzOiBTY2hlbWFTZXR0aW5ncyk6IHZvaWQge1xyXG4gICAgLy8gVmVyc2lvblxyXG4gICAgdGhpcy5fdmVyc2lvbiA9IHNldHRpbmdzLnZlcnNpb247XHJcblxyXG4gICAgLy8gQWxsb3cgb3ZlcnJpZGVzXHJcbiAgICBpZiAoc2V0dGluZ3MuZ2VuZXJhdGVJZCkge1xyXG4gICAgICB0aGlzLmdlbmVyYXRlSWQgPSBzZXR0aW5ncy5nZW5lcmF0ZUlkO1xyXG4gICAgfVxyXG4gICAgaWYgKHNldHRpbmdzLnBsdXJhbGl6ZSkge1xyXG4gICAgICB0aGlzLnBsdXJhbGl6ZSA9IHNldHRpbmdzLnBsdXJhbGl6ZTtcclxuICAgIH1cclxuICAgIGlmIChzZXR0aW5ncy5zaW5ndWxhcml6ZSkge1xyXG4gICAgICB0aGlzLnNpbmd1bGFyaXplID0gc2V0dGluZ3Muc2luZ3VsYXJpemU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUmVnaXN0ZXIgbW9kZWwgc2NoZW1hc1xyXG4gICAgaWYgKHNldHRpbmdzLm1vZGVscykge1xyXG4gICAgICB0aGlzLm1vZGVscyA9IHNldHRpbmdzLm1vZGVscztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdlbmVyYXRlIGFuIGlkIGZvciBhIGdpdmVuIG1vZGVsIHR5cGUuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge1N0cmluZ30gdHlwZSBPcHRpb25hbC4gVHlwZSBvZiB0aGUgbW9kZWwgZm9yIHdoaWNoIHRoZSBJRCBpcyBiZWluZyBnZW5lcmF0ZWQuXHJcbiAgICogQHJldHVybiB7U3RyaW5nfSBHZW5lcmF0ZWQgbW9kZWwgSURcclxuICAgKi9cclxuICBnZW5lcmF0ZUlkKHR5cGU/OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIE9yYml0LnV1aWQoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEEgbmFpdmUgcGx1cmFsaXphdGlvbiBtZXRob2QuXHJcbiAgICpcclxuICAgKiBPdmVycmlkZSB3aXRoIGEgbW9yZSByb2J1c3QgZ2VuZXJhbCBwdXJwb3NlIGluZmxlY3RvciBvciBwcm92aWRlIGFuXHJcbiAgICogaW5mbGVjdG9yIHRhaWxvcmVkIHRvIHRoZSB2b2NhYnVsYXJseSBvZiB5b3VyIGFwcGxpY2F0aW9uLlxyXG4gICAqXHJcbiAgICogQHBhcmFtICB7U3RyaW5nfSB3b3JkXHJcbiAgICogQHJldHVybiB7U3RyaW5nfSBwbHVyYWwgZm9ybSBvZiBgd29yZGBcclxuICAgKi9cclxuICBwbHVyYWxpemUod29yZDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB3b3JkICsgJ3MnO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQSBuYWl2ZSBzaW5ndWxhcml6YXRpb24gbWV0aG9kLlxyXG4gICAqXHJcbiAgICogT3ZlcnJpZGUgd2l0aCBhIG1vcmUgcm9idXN0IGdlbmVyYWwgcHVycG9zZSBpbmZsZWN0b3Igb3IgcHJvdmlkZSBhblxyXG4gICAqIGluZmxlY3RvciB0YWlsb3JlZCB0byB0aGUgdm9jYWJ1bGFybHkgb2YgeW91ciBhcHBsaWNhdGlvbi5cclxuICAgKlxyXG4gICAqIEBwYXJhbSAge1N0cmluZ30gd29yZFxyXG4gICAqIEByZXR1cm4ge1N0cmluZ30gc2luZ3VsYXIgZm9ybSBvZiBgd29yZGBcclxuICAgKi9cclxuICBzaW5ndWxhcml6ZSh3b3JkOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgaWYgKHdvcmQubGFzdEluZGV4T2YoJ3MnKSA9PT0gd29yZC5sZW5ndGggLSAxKSB7XHJcbiAgICAgIHJldHVybiB3b3JkLnN1YnN0cigwLCB3b3JkLmxlbmd0aCAtIDEpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIHdvcmQ7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpbml0aWFsaXplUmVjb3JkKHJlY29yZDogUmVjb3JkKTogdm9pZCB7XHJcbiAgICBpZiAocmVjb3JkLmlkID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgcmVjb3JkLmlkID0gdGhpcy5nZW5lcmF0ZUlkKHJlY29yZC50eXBlKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIl19