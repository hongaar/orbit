define('@orbit/local-storage', ['exports'], function (exports) { 'use strict';

Object.defineProperty(exports, "__esModule", { value: true });
var source_1 = require("./source");
exports.default = source_1.default;
var local_storage_1 = require("./lib/local-storage");
exports.supportsLocalStorage = local_storage_1.supportsLocalStorage;

Object.defineProperty(exports, '__esModule', { value: true });

});
