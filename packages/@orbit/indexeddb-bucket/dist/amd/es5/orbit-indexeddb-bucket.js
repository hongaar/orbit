define('@orbit/indexeddb-bucket', ['exports'], function (exports) { 'use strict';

Object.defineProperty(exports, "__esModule", { value: true });
var bucket_1 = require("./bucket");
exports.default = bucket_1.default;
var indexeddb_1 = require("./lib/indexeddb");
exports.supportsIndexedDB = indexeddb_1.supportsIndexedDB;

Object.defineProperty(exports, '__esModule', { value: true });

});
