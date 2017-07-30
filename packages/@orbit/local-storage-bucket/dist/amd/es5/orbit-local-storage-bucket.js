define('@orbit/local-storage-bucket', ['exports'], function (exports) { 'use strict';

Object.defineProperty(exports, "__esModule", { value: true });
var bucket_1 = require("./bucket");
exports.default = bucket_1.default;
var local_storage_1 = require("./lib/local-storage");
exports.supportsLocalStorage = local_storage_1.supportsLocalStorage;

Object.defineProperty(exports, '__esModule', { value: true });

});
