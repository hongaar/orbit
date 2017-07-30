define('@orbit/data', ['exports'], function (exports) { 'use strict';

function __export(m) {
    for (var p in m) {
        if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
var main_1 = require("./main");
exports.default = main_1.default;
__export(require("./exception"));
var key_map_1 = require("./key-map");
exports.KeyMap = key_map_1.default;
__export(require("./operation"));
var query_builder_1 = require("./query-builder");
exports.QueryBuilder = query_builder_1.default;
__export(require("./query-term"));
__export(require("./query"));
__export(require("./record"));
var schema_1 = require("./schema");
exports.Schema = schema_1.default;
__export(require("./source"));
__export(require("./transform"));
var transform_builder_1 = require("./transform-builder");
exports.TransformBuilder = transform_builder_1.default;
var pullable_1 = require("./source-interfaces/pullable");
exports.pullable = pullable_1.default;
exports.isPullable = pullable_1.isPullable;
var pushable_1 = require("./source-interfaces/pushable");
exports.pushable = pushable_1.default;
exports.isPushable = pushable_1.isPushable;
var queryable_1 = require("./source-interfaces/queryable");
exports.queryable = queryable_1.default;
exports.isQueryable = queryable_1.isQueryable;
var syncable_1 = require("./source-interfaces/syncable");
exports.syncable = syncable_1.default;
exports.isSyncable = syncable_1.isSyncable;
var updatable_1 = require("./source-interfaces/updatable");
exports.updatable = updatable_1.default;
exports.isUpdatable = updatable_1.isUpdatable;

Object.defineProperty(exports, '__esModule', { value: true });

});
