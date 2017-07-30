"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var connection_strategy_1 = require("./connection-strategy");
var utils_1 = require("@orbit/utils");
var SyncStrategy = (function (_super) {
    __extends(SyncStrategy, _super);
    function SyncStrategy(options) {
        var _this = this;
        var opts = options;
        utils_1.assert('A `source` must be specified for a SyncStrategy', !!opts.source);
        utils_1.assert('A `target` must be specified for a SyncStrategy', !!opts.target);
        utils_1.assert('`source` should be a Source name specified as a string', typeof opts.source === 'string');
        utils_1.assert('`target` should be a Source name specified as a string', typeof opts.target === 'string');
        opts.on = opts.on || 'transform';
        opts.action = opts.action || 'sync';
        _this = _super.call(this, opts) || this;
        return _this;
    }
    return SyncStrategy;
}(connection_strategy_1.ConnectionStrategy));
exports.SyncStrategy = SyncStrategy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3luYy1zdHJhdGVneS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9zdHJhdGVnaWVzL3N5bmMtc3RyYXRlZ3kudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBRUEsNkRBQXNGO0FBQ3RGLHNDQUFzQztBQW9EdEM7SUFBa0MsZ0NBQWtCO0lBQ2xELHNCQUFZLE9BQTRCO1FBQXhDLGlCQVNDO1FBUkMsSUFBSSxJQUFJLEdBQUcsT0FBb0MsQ0FBQztRQUNoRCxjQUFNLENBQUMsaURBQWlELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN6RSxjQUFNLENBQUMsaURBQWlELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN6RSxjQUFNLENBQUMsd0RBQXdELEVBQUUsT0FBTyxJQUFJLENBQUMsTUFBTSxLQUFLLFFBQVEsQ0FBQyxDQUFDO1FBQ2xHLGNBQU0sQ0FBQyx3REFBd0QsRUFBRSxPQUFPLElBQUksQ0FBQyxNQUFNLEtBQUssUUFBUSxDQUFDLENBQUM7UUFDbEcsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxJQUFJLFdBQVcsQ0FBQztRQUNqQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDO1FBQ3BDLFFBQUEsa0JBQU0sSUFBSSxDQUFDLFNBQUM7O0lBQ2QsQ0FBQztJQUNILG1CQUFDO0FBQUQsQ0FBQyxBQVhELENBQWtDLHdDQUFrQixHQVduRDtBQVhZLG9DQUFZIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENvb3JkaW5hdG9yLCB7IEFjdGl2YXRpb25PcHRpb25zLCBMb2dMZXZlbCB9IGZyb20gJy4uL2Nvb3JkaW5hdG9yJztcclxuaW1wb3J0IHsgU3RyYXRlZ3lPcHRpb25zIH0gZnJvbSAnLi4vc3RyYXRlZ3knO1xyXG5pbXBvcnQgeyBDb25uZWN0aW9uU3RyYXRlZ3ksIENvbm5lY3Rpb25TdHJhdGVneU9wdGlvbnMgfSBmcm9tICcuL2Nvbm5lY3Rpb24tc3RyYXRlZ3knO1xyXG5pbXBvcnQgeyBhc3NlcnQgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xyXG5cclxuZGVjbGFyZSBjb25zdCBjb25zb2xlOiBhbnk7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFN5bmNTdHJhdGVneU9wdGlvbnMgZXh0ZW5kcyBTdHJhdGVneU9wdGlvbnMge1xyXG4gIC8qKlxyXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBzb3VyY2UgdG8gYmUgb2JzZXJ2ZWQuXHJcbiAgICpcclxuICAgKiBAdHlwZSB7c3RyaW5nfVxyXG4gICAqIEBtZW1iZXJPZiBTeW5jU3RyYXRlZ3lPcHRpb25zXHJcbiAgICovXHJcbiAgc291cmNlOiBzdHJpbmc7XHJcblxyXG4gIC8qKlxyXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBzb3VyY2Ugd2hpY2ggd2lsbCBiZSBhY3RlZCB1cG9uLlxyXG4gICAqXHJcbiAgICogQHR5cGUge3N0cmluZ31cclxuICAgKiBAbWVtYmVyT2YgU3luY1N0cmF0ZWd5T3B0aW9uc1xyXG4gICAqL1xyXG4gIHRhcmdldDogc3RyaW5nO1xyXG5cclxuICAvKipcclxuICAgKiBBIGhhbmRsZXIgZm9yIGFueSBlcnJvcnMgdGhyb3duIGFzIGEgcmVzdWx0IG9mIHRoZSBzeW5jIG9wZXJhdGlvbi5cclxuICAgKlxyXG4gICAqIEB0eXBlIHtGdW5jdGlvbn1cclxuICAgKiBAbWVtYmVyT2YgU3luY1N0cmF0ZWd5T3B0aW9uc1xyXG4gICAqL1xyXG4gIGNhdGNoPzogRnVuY3Rpb247XHJcblxyXG4gIC8qKlxyXG4gICAqIEEgZmlsdGVyIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHN5bmMgc2hvdWxkIGJlIHBlcmZvcm1lZC5cclxuICAgKlxyXG4gICAqIGBmaWx0ZXJgIHdpbGwgYmUgaW52b2tlZCBpbiB0aGUgY29udGV4dCBvZiB0aGlzIHN0cmF0ZWd5IChhbmQgdGh1cyB3aWxsXHJcbiAgICogaGF2ZSBhY2Nlc3MgdG8gYm90aCBgdGhpcy5zb3VyY2VgIGFuZCBgdGhpcy50YXJnZXRgKS5cclxuICAgKlxyXG4gICAqIEB0eXBlIHtGdW5jdGlvbn1cclxuICAgKiBAbWVtYmVyT2YgU3luY1N0cmF0ZWd5T3B0aW9uc3NcclxuICAgKi9cclxuICBmaWx0ZXI/OiBGdW5jdGlvbjtcclxuXHJcbiAgLyoqXHJcbiAgICogU2hvdWxkIHJlc29sdXRpb24gb2YgdGhlIHRhcmdldCdzIGBzeW5jYCBibG9jayB0aGUgY29tcGxldGlvbiBvZiB0aGVcclxuICAgKiBzb3VyY2UncyBgdHJhbnNmb3JtYD9cclxuICAgKlxyXG4gICAqIEJ5IGRlZmF1bHQsIGBibG9ja2luZ2AgaXMgZmFsc2UuXHJcbiAgICpcclxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cclxuICAgKiBAbWVtYmVyT2YgU3luY1N0cmF0ZWd5T3B0aW9uc3NcclxuICAgKi9cclxuICBibG9ja2luZz86IGJvb2xlYW47XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBTeW5jU3RyYXRlZ3kgZXh0ZW5kcyBDb25uZWN0aW9uU3RyYXRlZ3kge1xyXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM6IFN5bmNTdHJhdGVneU9wdGlvbnMpIHtcclxuICAgIGxldCBvcHRzID0gb3B0aW9ucyBhcyBDb25uZWN0aW9uU3RyYXRlZ3lPcHRpb25zO1xyXG4gICAgYXNzZXJ0KCdBIGBzb3VyY2VgIG11c3QgYmUgc3BlY2lmaWVkIGZvciBhIFN5bmNTdHJhdGVneScsICEhb3B0cy5zb3VyY2UpO1xyXG4gICAgYXNzZXJ0KCdBIGB0YXJnZXRgIG11c3QgYmUgc3BlY2lmaWVkIGZvciBhIFN5bmNTdHJhdGVneScsICEhb3B0cy50YXJnZXQpO1xyXG4gICAgYXNzZXJ0KCdgc291cmNlYCBzaG91bGQgYmUgYSBTb3VyY2UgbmFtZSBzcGVjaWZpZWQgYXMgYSBzdHJpbmcnLCB0eXBlb2Ygb3B0cy5zb3VyY2UgPT09ICdzdHJpbmcnKTtcclxuICAgIGFzc2VydCgnYHRhcmdldGAgc2hvdWxkIGJlIGEgU291cmNlIG5hbWUgc3BlY2lmaWVkIGFzIGEgc3RyaW5nJywgdHlwZW9mIG9wdHMudGFyZ2V0ID09PSAnc3RyaW5nJyk7XHJcbiAgICBvcHRzLm9uID0gb3B0cy5vbiB8fCAndHJhbnNmb3JtJztcclxuICAgIG9wdHMuYWN0aW9uID0gb3B0cy5hY3Rpb24gfHwgJ3N5bmMnO1xyXG4gICAgc3VwZXIob3B0cyk7XHJcbiAgfVxyXG59XHJcbiJdfQ==