define('@orbit/coordinator', ['exports'], function (exports) { 'use strict';

function __export(m) {
    for (var p in m) {
        if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
var coordinator_1 = require("./coordinator");
exports.default = coordinator_1.default;
exports.LogLevel = coordinator_1.LogLevel;
__export(require("./strategy"));
__export(require("./strategies/log-truncation-strategy"));
__export(require("./strategies/event-logging-strategy"));
__export(require("./strategies/connection-strategy"));
__export(require("./strategies/request-strategy"));
__export(require("./strategies/sync-strategy"));

Object.defineProperty(exports, '__esModule', { value: true });

});
