define('@orbit/core', ['exports'], function (exports) { 'use strict';

function __export(m) {
    for (var p in m) {
        if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
var main_1 = require("./main");
exports.default = main_1.default;
var task_queue_1 = require("./task-queue");
exports.TaskQueue = task_queue_1.default;
var task_processor_1 = require("./task-processor");
exports.TaskProcessor = task_processor_1.default;
var bucket_1 = require("./bucket");
exports.Bucket = bucket_1.Bucket;
var evented_1 = require("./evented");
exports.evented = evented_1.default;
exports.isEvented = evented_1.isEvented;
exports.settleInSeries = evented_1.settleInSeries;
exports.fulfillInSeries = evented_1.fulfillInSeries;
__export(require("./exception"));
var notifier_1 = require("./notifier");
exports.Notifier = notifier_1.default;
var log_1 = require("./log");
exports.Log = log_1.default;

Object.defineProperty(exports, '__esModule', { value: true });

});
