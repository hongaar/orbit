"use strict";

var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@orbit/utils");
var main_1 = require("./main");
var evented_1 = require("./evented");
var exception_1 = require("./exception");
/**
 * Logs track a series of unique events that have occurred. Each event is
 * tracked based on its unique id. The log only tracks the ids but currently
 * does not track any details.
 *
 * Logs can automatically be persisted by assigning them a bucket.
 *
 * @export
 * @class Log
 * @implements {Evented}
 */
var Log = function () {
    function Log(options) {
        if (options === void 0) {
            options = {};
        }
        this._name = options.name;
        this._bucket = options.bucket;
        if (this._bucket) {
            utils_1.assert('Log requires a name if it has a bucket', !!this._name);
        }
        this._reify(options.data);
    }
    Object.defineProperty(Log.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Log.prototype, "bucket", {
        get: function () {
            return this._bucket;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Log.prototype, "head", {
        get: function () {
            return this._data[this._data.length - 1];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Log.prototype, "entries", {
        get: function () {
            return this._data;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Log.prototype, "length", {
        get: function () {
            return this._data.length;
        },
        enumerable: true,
        configurable: true
    });
    Log.prototype.append = function () {
        var _this = this;
        var ids = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            ids[_i] = arguments[_i];
        }
        return this.reified.then(function () {
            Array.prototype.push.apply(_this._data, ids);
            return _this._persist();
        }).then(function () {
            _this.emit('append', ids);
        });
    };
    Log.prototype.before = function (id, relativePosition) {
        if (relativePosition === void 0) {
            relativePosition = 0;
        }
        var index = this._data.indexOf(id);
        if (index === -1) {
            throw new exception_1.NotLoggedException(id);
        }
        var position = index + relativePosition;
        if (position < 0 || position >= this._data.length) {
            throw new exception_1.OutOfRangeException(position);
        }
        return this._data.slice(0, position);
    };
    Log.prototype.after = function (id, relativePosition) {
        if (relativePosition === void 0) {
            relativePosition = 0;
        }
        var index = this._data.indexOf(id);
        if (index === -1) {
            throw new exception_1.NotLoggedException(id);
        }
        var position = index + 1 + relativePosition;
        if (position < 0 || position > this._data.length) {
            throw new exception_1.OutOfRangeException(position);
        }
        return this._data.slice(position);
    };
    Log.prototype.truncate = function (id, relativePosition) {
        var _this = this;
        if (relativePosition === void 0) {
            relativePosition = 0;
        }
        var removed;
        return this.reified.then(function () {
            var index = _this._data.indexOf(id);
            if (index === -1) {
                throw new exception_1.NotLoggedException(id);
            }
            var position = index + relativePosition;
            if (position < 0 || position > _this._data.length) {
                throw new exception_1.OutOfRangeException(position);
            }
            if (position === _this._data.length) {
                removed = _this._data;
                _this._data = [];
            } else {
                removed = _this._data.slice(0, position);
                _this._data = _this._data.slice(position);
            }
            return _this._persist();
        }).then(function () {
            _this.emit('truncate', id, relativePosition, removed);
        });
    };
    Log.prototype.rollback = function (id, relativePosition) {
        var _this = this;
        if (relativePosition === void 0) {
            relativePosition = 0;
        }
        var removed;
        return this.reified.then(function () {
            var index = _this._data.indexOf(id);
            if (index === -1) {
                throw new exception_1.NotLoggedException(id);
            }
            var position = index + 1 + relativePosition;
            if (position < 0 || position > _this._data.length) {
                throw new exception_1.OutOfRangeException(position);
            }
            removed = _this._data.slice(position);
            _this._data = _this._data.slice(0, position);
            return _this._persist();
        }).then(function () {
            _this.emit('rollback', id, relativePosition, removed);
        });
    };
    Log.prototype.clear = function () {
        var _this = this;
        var clearedData;
        return this.reified.then(function () {
            clearedData = _this._data;
            _this._data = [];
            return _this._persist();
        }).then(function () {
            return _this.emit('clear', clearedData);
        });
    };
    Log.prototype.contains = function (id) {
        return this._data.indexOf(id) > -1;
    };
    Log.prototype._persist = function () {
        this.emit('change');
        if (this.bucket) {
            return this._bucket.setItem(this.name, this._data);
        } else {
            return main_1.default.Promise.resolve();
        }
    };
    Log.prototype._reify = function (data) {
        var _this = this;
        if (!data && this._bucket) {
            this.reified = this._bucket.getItem(this._name).then(function (bucketData) {
                return _this._initData(bucketData);
            });
        } else {
            this._initData(data);
            this.reified = main_1.default.Promise.resolve();
        }
    };
    Log.prototype._initData = function (data) {
        if (data) {
            this._data = data;
        } else {
            this._data = [];
        }
    };
    Log = __decorate([evented_1.default], Log);
    return Log;
}();
exports.default = Log;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3JjL2xvZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsc0JBQXNDO0FBQ3RDLHFCQUEyQjtBQUMzQix3QkFBNkM7QUFFN0MsMEJBQXNFO0FBUXRFLEFBVUc7Ozs7Ozs7Ozs7O0FBRUg7QUFjRSxpQkFBWSxBQUF3QjtBQUF4QixnQ0FBQTtBQUFBLHNCQUF3Qjs7QUFDbEMsQUFBSSxhQUFDLEFBQUssUUFBRyxBQUFPLFFBQUMsQUFBSSxBQUFDO0FBQzFCLEFBQUksYUFBQyxBQUFPLFVBQUcsQUFBTyxRQUFDLEFBQU0sQUFBQztBQUU5QixBQUFFLEFBQUMsWUFBQyxBQUFJLEtBQUMsQUFBTyxBQUFDLFNBQUMsQUFBQztBQUNqQixvQkFBTSxPQUFDLEFBQXdDLDBDQUFFLENBQUMsQ0FBQyxBQUFJLEtBQUMsQUFBSyxBQUFDLEFBQUMsQUFDakU7QUFBQztBQUVELEFBQUksYUFBQyxBQUFNLE9BQUMsQUFBTyxRQUFDLEFBQUksQUFBQyxBQUFDLEFBQzVCO0FBQUM7QUFFRCwwQkFBSSxlQUFJO2FBQVI7QUFDRSxBQUFNLG1CQUFDLEFBQUksS0FBQyxBQUFLLEFBQUMsQUFDcEI7QUFBQzs7c0JBQUE7O0FBRUQsMEJBQUksZUFBTTthQUFWO0FBQ0UsQUFBTSxtQkFBQyxBQUFJLEtBQUMsQUFBTyxBQUFDLEFBQ3RCO0FBQUM7O3NCQUFBOztBQUVELDBCQUFJLGVBQUk7YUFBUjtBQUNFLEFBQU0sbUJBQUMsQUFBSSxLQUFDLEFBQUssTUFBQyxBQUFJLEtBQUMsQUFBSyxNQUFDLEFBQU0sU0FBRyxBQUFDLEFBQUMsQUFBQyxBQUMzQztBQUFDOztzQkFBQTs7QUFFRCwwQkFBSSxlQUFPO2FBQVg7QUFDRSxBQUFNLG1CQUFDLEFBQUksS0FBQyxBQUFLLEFBQUMsQUFDcEI7QUFBQzs7c0JBQUE7O0FBRUQsMEJBQUksZUFBTTthQUFWO0FBQ0UsQUFBTSxtQkFBQyxBQUFJLEtBQUMsQUFBSyxNQUFDLEFBQU0sQUFBQyxBQUMzQjtBQUFDOztzQkFBQTs7QUFFRCxrQkFBTSxTQUFOO0FBQUEsb0JBU0M7QUFUTSxrQkFBZ0I7YUFBaEIsU0FBZ0IsR0FBaEIsZUFBZ0IsUUFBaEIsQUFBZ0I7QUFBaEIsZ0NBQWdCOztBQUNyQixBQUFNLG9CQUFNLEFBQU8sUUFDaEIsQUFBSSxLQUFDO0FBQ0osQUFBSyxrQkFBQyxBQUFTLFVBQUMsQUFBSSxLQUFDLEFBQUssTUFBQyxBQUFJLE1BQUMsQUFBSyxPQUFFLEFBQUcsQUFBQyxBQUFDO0FBQzVDLEFBQU0sbUJBQUMsQUFBSSxNQUFDLEFBQVEsQUFBRSxBQUFDLEFBQ3pCO0FBQUMsQUFBQyxTQUpHLEFBQUksRUFLUixBQUFJLEtBQUM7QUFDSixBQUFJLGtCQUFDLEFBQUksS0FBQyxBQUFRLFVBQUUsQUFBRyxBQUFDLEFBQUMsQUFDM0I7QUFBQyxBQUFDLEFBQUMsQUFDUDtBQUFDO0FBRUQsa0JBQU0sU0FBTixVQUFPLEFBQVUsSUFBRSxBQUE0QjtBQUE1Qix5Q0FBQTtBQUFBLCtCQUE0Qjs7QUFDN0MsWUFBTSxBQUFLLFFBQUcsQUFBSSxLQUFDLEFBQUssTUFBQyxBQUFPLFFBQUMsQUFBRSxBQUFDLEFBQUM7QUFDckMsQUFBRSxBQUFDLFlBQUMsQUFBSyxVQUFLLENBQUMsQUFBQyxBQUFDLEdBQUMsQUFBQztBQUNqQixrQkFBTSxJQUFJLFlBQWtCLG1CQUFDLEFBQUUsQUFBQyxBQUFDLEFBQ25DO0FBQUM7QUFFRCxZQUFNLEFBQVEsV0FBRyxBQUFLLFFBQUcsQUFBZ0IsQUFBQztBQUMxQyxBQUFFLEFBQUMsWUFBQyxBQUFRLFdBQUcsQUFBQyxLQUFJLEFBQVEsWUFBSSxBQUFJLEtBQUMsQUFBSyxNQUFDLEFBQU0sQUFBQyxRQUFDLEFBQUM7QUFDbEQsa0JBQU0sSUFBSSxZQUFtQixvQkFBQyxBQUFRLEFBQUMsQUFBQyxBQUMxQztBQUFDO0FBRUQsQUFBTSxlQUFDLEFBQUksS0FBQyxBQUFLLE1BQUMsQUFBSyxNQUFDLEFBQUMsR0FBRSxBQUFRLEFBQUMsQUFBQyxBQUN2QztBQUFDO0FBRUQsa0JBQUssUUFBTCxVQUFNLEFBQVUsSUFBRSxBQUE0QjtBQUE1Qix5Q0FBQTtBQUFBLCtCQUE0Qjs7QUFDNUMsWUFBTSxBQUFLLFFBQUcsQUFBSSxLQUFDLEFBQUssTUFBQyxBQUFPLFFBQUMsQUFBRSxBQUFDLEFBQUM7QUFDckMsQUFBRSxBQUFDLFlBQUMsQUFBSyxVQUFLLENBQUMsQUFBQyxBQUFDLEdBQUMsQUFBQztBQUNqQixrQkFBTSxJQUFJLFlBQWtCLG1CQUFDLEFBQUUsQUFBQyxBQUFDLEFBQ25DO0FBQUM7QUFFRCxZQUFNLEFBQVEsV0FBRyxBQUFLLFFBQUcsQUFBQyxJQUFHLEFBQWdCLEFBQUM7QUFDOUMsQUFBRSxBQUFDLFlBQUMsQUFBUSxXQUFHLEFBQUMsS0FBSSxBQUFRLFdBQUcsQUFBSSxLQUFDLEFBQUssTUFBQyxBQUFNLEFBQUMsUUFBQyxBQUFDO0FBQ2pELGtCQUFNLElBQUksWUFBbUIsb0JBQUMsQUFBUSxBQUFDLEFBQUMsQUFDMUM7QUFBQztBQUVELEFBQU0sZUFBQyxBQUFJLEtBQUMsQUFBSyxNQUFDLEFBQUssTUFBQyxBQUFRLEFBQUMsQUFBQyxBQUNwQztBQUFDO0FBRUQsa0JBQVEsV0FBUixVQUFTLEFBQVUsSUFBRSxBQUE0QjtBQUFqRCxvQkE2QkM7QUE3Qm9CLHlDQUFBO0FBQUEsK0JBQTRCOztBQUMvQyxZQUFJLEFBQWlCLEFBQUM7QUFFdEIsQUFBTSxvQkFBTSxBQUFPLFFBQ2hCLEFBQUksS0FBQztBQUVKLGdCQUFNLEFBQUssUUFBRyxBQUFJLE1BQUMsQUFBSyxNQUFDLEFBQU8sUUFBQyxBQUFFLEFBQUMsQUFBQztBQUNyQyxBQUFFLEFBQUMsZ0JBQUMsQUFBSyxVQUFLLENBQUMsQUFBQyxBQUFDLEdBQUMsQUFBQztBQUNqQixzQkFBTSxJQUFJLFlBQWtCLG1CQUFDLEFBQUUsQUFBQyxBQUFDLEFBQ25DO0FBQUM7QUFFRCxnQkFBTSxBQUFRLFdBQUcsQUFBSyxRQUFHLEFBQWdCLEFBQUM7QUFDMUMsQUFBRSxBQUFDLGdCQUFDLEFBQVEsV0FBRyxBQUFDLEtBQUksQUFBUSxXQUFHLEFBQUksTUFBQyxBQUFLLE1BQUMsQUFBTSxBQUFDLFFBQUMsQUFBQztBQUNqRCxzQkFBTSxJQUFJLFlBQW1CLG9CQUFDLEFBQVEsQUFBQyxBQUFDLEFBQzFDO0FBQUM7QUFFRCxBQUFFLEFBQUMsZ0JBQUMsQUFBUSxhQUFLLEFBQUksTUFBQyxBQUFLLE1BQUMsQUFBTSxBQUFDLFFBQUMsQUFBQztBQUNuQyxBQUFPLDBCQUFHLEFBQUksTUFBQyxBQUFLLEFBQUM7QUFDckIsQUFBSSxzQkFBQyxBQUFLLFFBQUcsQUFBRSxBQUFDLEFBQ2xCO0FBQUMsQUFBQyxBQUFJLG1CQUFDLEFBQUM7QUFDTixBQUFPLDBCQUFHLEFBQUksTUFBQyxBQUFLLE1BQUMsQUFBSyxNQUFDLEFBQUMsR0FBRSxBQUFRLEFBQUMsQUFBQztBQUN4QyxBQUFJLHNCQUFDLEFBQUssUUFBRyxBQUFJLE1BQUMsQUFBSyxNQUFDLEFBQUssTUFBQyxBQUFRLEFBQUMsQUFBQyxBQUMxQztBQUFDO0FBRUQsQUFBTSxtQkFBQyxBQUFJLE1BQUMsQUFBUSxBQUFFLEFBQUMsQUFDekI7QUFBQyxBQUFDLFNBdEJHLEFBQUksRUF1QlIsQUFBSSxLQUFDO0FBQ0osQUFBSSxrQkFBQyxBQUFJLEtBQUMsQUFBVSxZQUFFLEFBQUUsSUFBRSxBQUFnQixrQkFBRSxBQUFPLEFBQUMsQUFBQyxBQUN2RDtBQUFDLEFBQUMsQUFBQyxBQUNQO0FBQUM7QUFFRCxrQkFBUSxXQUFSLFVBQVMsQUFBVSxJQUFFLEFBQTRCO0FBQWpELG9CQXVCQztBQXZCb0IseUNBQUE7QUFBQSwrQkFBNEI7O0FBQy9DLFlBQUksQUFBaUIsQUFBQztBQUV0QixBQUFNLG9CQUFNLEFBQU8sUUFDaEIsQUFBSSxLQUFDO0FBQ0osZ0JBQU0sQUFBSyxRQUFHLEFBQUksTUFBQyxBQUFLLE1BQUMsQUFBTyxRQUFDLEFBQUUsQUFBQyxBQUFDO0FBQ3JDLEFBQUUsQUFBQyxnQkFBQyxBQUFLLFVBQUssQ0FBQyxBQUFDLEFBQUMsR0FBQyxBQUFDO0FBQ2pCLHNCQUFNLElBQUksWUFBa0IsbUJBQUMsQUFBRSxBQUFDLEFBQUMsQUFDbkM7QUFBQztBQUVELGdCQUFNLEFBQVEsV0FBRyxBQUFLLFFBQUcsQUFBQyxJQUFHLEFBQWdCLEFBQUM7QUFDOUMsQUFBRSxBQUFDLGdCQUFDLEFBQVEsV0FBRyxBQUFDLEtBQUksQUFBUSxXQUFHLEFBQUksTUFBQyxBQUFLLE1BQUMsQUFBTSxBQUFDLFFBQUMsQUFBQztBQUNqRCxzQkFBTSxJQUFJLFlBQW1CLG9CQUFDLEFBQVEsQUFBQyxBQUFDLEFBQzFDO0FBQUM7QUFFRCxBQUFPLHNCQUFHLEFBQUksTUFBQyxBQUFLLE1BQUMsQUFBSyxNQUFDLEFBQVEsQUFBQyxBQUFDO0FBQ3JDLEFBQUksa0JBQUMsQUFBSyxRQUFHLEFBQUksTUFBQyxBQUFLLE1BQUMsQUFBSyxNQUFDLEFBQUMsR0FBRSxBQUFRLEFBQUMsQUFBQztBQUUzQyxBQUFNLG1CQUFDLEFBQUksTUFBQyxBQUFRLEFBQUUsQUFBQyxBQUN6QjtBQUFDLEFBQUMsU0FoQkcsQUFBSSxFQWlCUixBQUFJLEtBQUM7QUFDSixBQUFJLGtCQUFDLEFBQUksS0FBQyxBQUFVLFlBQUUsQUFBRSxJQUFFLEFBQWdCLGtCQUFFLEFBQU8sQUFBQyxBQUFDLEFBQ3ZEO0FBQUMsQUFBQyxBQUFDLEFBQ1A7QUFBQztBQUVELGtCQUFLLFFBQUw7QUFBQSxvQkFVQztBQVRDLFlBQUksQUFBVyxBQUFDO0FBRWhCLEFBQU0sb0JBQU0sQUFBTyxRQUNoQixBQUFJLEtBQUM7QUFDSixBQUFXLDBCQUFHLEFBQUksTUFBQyxBQUFLLEFBQUM7QUFDekIsQUFBSSxrQkFBQyxBQUFLLFFBQUcsQUFBRSxBQUFDO0FBQ2hCLEFBQU0sbUJBQUMsQUFBSSxNQUFDLEFBQVEsQUFBRSxBQUFDLEFBQ3pCO0FBQUMsQUFBQyxTQUxHLEFBQUksRUFNUixBQUFJLEtBQUM7QUFBTSxtQkFBQSxBQUFJLE1BQUMsQUFBSSxLQUFDLEFBQU8sU0FBakIsQUFBbUIsQUFBVyxBQUFDO0FBQUEsQUFBQyxBQUFDLEFBQ2pEO0FBQUM7QUFFRCxrQkFBUSxXQUFSLFVBQVMsQUFBVTtBQUNqQixBQUFNLGVBQUMsQUFBSSxLQUFDLEFBQUssTUFBQyxBQUFPLFFBQUMsQUFBRSxBQUFDLE1BQUcsQ0FBQyxBQUFDLEFBQUMsQUFDckM7QUFBQztBQUVELGtCQUFRLFdBQVI7QUFDRSxBQUFJLGFBQUMsQUFBSSxLQUFDLEFBQVEsQUFBQyxBQUFDO0FBQ3BCLEFBQUUsQUFBQyxZQUFDLEFBQUksS0FBQyxBQUFNLEFBQUMsUUFBQyxBQUFDO0FBQ2hCLEFBQU0sbUJBQUMsQUFBSSxLQUFDLEFBQU8sUUFBQyxBQUFPLFFBQUMsQUFBSSxLQUFDLEFBQUksTUFBRSxBQUFJLEtBQUMsQUFBSyxBQUFDLEFBQUMsQUFDckQ7QUFBQyxBQUFDLEFBQUksZUFBQyxBQUFDO0FBQ04sQUFBTSxtQkFBQyxPQUFLLFFBQUMsQUFBTyxRQUFDLEFBQU8sQUFBRSxBQUFDLEFBQ2pDO0FBQUMsQUFDSDtBQUFDO0FBRUQsa0JBQU0sU0FBTixVQUFPLEFBQWM7QUFBckIsb0JBUUM7QUFQQyxBQUFFLEFBQUMsWUFBQyxDQUFDLEFBQUksUUFBSSxBQUFJLEtBQUMsQUFBTyxBQUFDLFNBQUMsQUFBQztBQUMxQixBQUFJLGlCQUFDLEFBQU8sZUFBUSxBQUFPLFFBQUMsQUFBTyxRQUFDLEFBQUksS0FBQyxBQUFLLEFBQUMsT0FDNUMsQUFBSSxLQUFDLFVBQUEsQUFBVTtBQUFJLHVCQUFBLEFBQUksTUFBQyxBQUFTLFVBQWQsQUFBZSxBQUFVLEFBQUM7QUFBQSxBQUFDLEFBQUMsQUFDcEQsYUFGaUIsQUFBSTtBQUVwQixBQUFDLEFBQUksZUFBQyxBQUFDO0FBQ04sQUFBSSxpQkFBQyxBQUFTLFVBQUMsQUFBSSxBQUFDLEFBQUM7QUFDckIsQUFBSSxpQkFBQyxBQUFPLFVBQUcsT0FBSyxRQUFDLEFBQU8sUUFBQyxBQUFPLEFBQUUsQUFBQyxBQUN6QztBQUFDLEFBQ0g7QUFBQztBQUVELGtCQUFTLFlBQVQsVUFBVSxBQUFjO0FBQ3RCLEFBQUUsQUFBQyxZQUFDLEFBQUksQUFBQyxNQUFDLEFBQUM7QUFDVCxBQUFJLGlCQUFDLEFBQUssUUFBRyxBQUFJLEFBQUMsQUFDcEI7QUFBQyxBQUFDLEFBQUksZUFBQyxBQUFDO0FBQ04sQUFBSSxpQkFBQyxBQUFLLFFBQUcsQUFBRSxBQUFDLEFBQ2xCO0FBQUMsQUFDSDtBQUFDO0FBckxrQixBQUFHLHNCQUR2QixVQUFPLFVBQ2EsQUFBRyxBQXNMdkI7QUFBRCxXQUFDO0FBdExELEFBc0xDO2tCQXRMb0IsQUFBRyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGFzc2VydCB9IGZyb20gJ0BvcmJpdC91dGlscyc7XHJcbmltcG9ydCBPcmJpdCBmcm9tICcuL21haW4nO1xyXG5pbXBvcnQgZXZlbnRlZCwgeyBFdmVudGVkIH0gZnJvbSAnLi9ldmVudGVkJztcclxuaW1wb3J0IHsgQnVja2V0IH0gZnJvbSAnLi9idWNrZXQnO1xyXG5pbXBvcnQgeyBOb3RMb2dnZWRFeGNlcHRpb24sIE91dE9mUmFuZ2VFeGNlcHRpb24gfSBmcm9tICcuL2V4Y2VwdGlvbic7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIExvZ09wdGlvbnMge1xyXG4gIG5hbWU/OiBzdHJpbmc7XHJcbiAgZGF0YT86IHN0cmluZ1tdO1xyXG4gIGJ1Y2tldD86IEJ1Y2tldDtcclxufVxyXG5cclxuLyoqXHJcbiAqIExvZ3MgdHJhY2sgYSBzZXJpZXMgb2YgdW5pcXVlIGV2ZW50cyB0aGF0IGhhdmUgb2NjdXJyZWQuIEVhY2ggZXZlbnQgaXNcclxuICogdHJhY2tlZCBiYXNlZCBvbiBpdHMgdW5pcXVlIGlkLiBUaGUgbG9nIG9ubHkgdHJhY2tzIHRoZSBpZHMgYnV0IGN1cnJlbnRseVxyXG4gKiBkb2VzIG5vdCB0cmFjayBhbnkgZGV0YWlscy5cclxuICpcclxuICogTG9ncyBjYW4gYXV0b21hdGljYWxseSBiZSBwZXJzaXN0ZWQgYnkgYXNzaWduaW5nIHRoZW0gYSBidWNrZXQuXHJcbiAqIFxyXG4gKiBAZXhwb3J0XHJcbiAqIEBjbGFzcyBMb2dcclxuICogQGltcGxlbWVudHMge0V2ZW50ZWR9XHJcbiAqL1xyXG5AZXZlbnRlZFxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMb2cgaW1wbGVtZW50cyBFdmVudGVkIHtcclxuICBwcml2YXRlIF9uYW1lOiBzdHJpbmc7XHJcbiAgcHJpdmF0ZSBfYnVja2V0OiBCdWNrZXQ7XHJcbiAgcHJpdmF0ZSBfZGF0YTogc3RyaW5nW107XHJcblxyXG4gIHB1YmxpYyByZWlmaWVkOiBQcm9taXNlPHZvaWQ+O1xyXG5cclxuICAvLyBFdmVudGVkIGludGVyZmFjZSBzdHVic1xyXG4gIG9uOiAoZXZlbnQ6IHN0cmluZywgY2FsbGJhY2s6ICgpID0+IHZvaWQsIGJpbmRpbmc/OiBhbnkpID0+IHZvaWQ7XHJcbiAgb2ZmOiAoZXZlbnQ6IHN0cmluZywgY2FsbGJhY2s6ICgpID0+IHZvaWQsIGJpbmRpbmc/OiBhbnkpID0+IHZvaWQ7XHJcbiAgb25lOiAoZXZlbnQ6IHN0cmluZywgY2FsbGJhY2s6ICgpID0+IHZvaWQsIGJpbmRpbmc/OiBhbnkpID0+IHZvaWQ7XHJcbiAgZW1pdDogKGV2ZW50OiBzdHJpbmcsIC4uLmFyZ3MpID0+IHZvaWQ7XHJcbiAgbGlzdGVuZXJzOiAoZXZlbnQ6IHN0cmluZykgPT4gYW55W107XHJcblxyXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM6IExvZ09wdGlvbnMgPSB7fSkge1xyXG4gICAgdGhpcy5fbmFtZSA9IG9wdGlvbnMubmFtZTtcclxuICAgIHRoaXMuX2J1Y2tldCA9IG9wdGlvbnMuYnVja2V0O1xyXG5cclxuICAgIGlmICh0aGlzLl9idWNrZXQpIHtcclxuICAgICAgYXNzZXJ0KCdMb2cgcmVxdWlyZXMgYSBuYW1lIGlmIGl0IGhhcyBhIGJ1Y2tldCcsICEhdGhpcy5fbmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5fcmVpZnkob3B0aW9ucy5kYXRhKTtcclxuICB9XHJcblxyXG4gIGdldCBuYW1lKCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5fbmFtZTtcclxuICB9XHJcblxyXG4gIGdldCBidWNrZXQoKTogQnVja2V0IHtcclxuICAgIHJldHVybiB0aGlzLl9idWNrZXQ7XHJcbiAgfVxyXG5cclxuICBnZXQgaGVhZCgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMuX2RhdGFbdGhpcy5fZGF0YS5sZW5ndGggLSAxXTtcclxuICB9XHJcblxyXG4gIGdldCBlbnRyaWVzKCk6IHN0cmluZ1tdIHtcclxuICAgIHJldHVybiB0aGlzLl9kYXRhO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGxlbmd0aCgpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIHRoaXMuX2RhdGEubGVuZ3RoO1xyXG4gIH1cclxuXHJcbiAgYXBwZW5kKC4uLmlkczogc3RyaW5nW10pOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHJldHVybiB0aGlzLnJlaWZpZWRcclxuICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KHRoaXMuX2RhdGEsIGlkcyk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BlcnNpc3QoKTtcclxuICAgICAgfSlcclxuICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuZW1pdCgnYXBwZW5kJywgaWRzKTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBiZWZvcmUoaWQ6IHN0cmluZywgcmVsYXRpdmVQb3NpdGlvbjogbnVtYmVyID0gMCk6IHN0cmluZ1tdIHtcclxuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5fZGF0YS5pbmRleE9mKGlkKTtcclxuICAgIGlmIChpbmRleCA9PT0gLTEpIHtcclxuICAgICAgdGhyb3cgbmV3IE5vdExvZ2dlZEV4Y2VwdGlvbihpZCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcG9zaXRpb24gPSBpbmRleCArIHJlbGF0aXZlUG9zaXRpb247XHJcbiAgICBpZiAocG9zaXRpb24gPCAwIHx8IHBvc2l0aW9uID49IHRoaXMuX2RhdGEubGVuZ3RoKSB7XHJcbiAgICAgIHRocm93IG5ldyBPdXRPZlJhbmdlRXhjZXB0aW9uKHBvc2l0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5fZGF0YS5zbGljZSgwLCBwb3NpdGlvbik7XHJcbiAgfVxyXG5cclxuICBhZnRlcihpZDogc3RyaW5nLCByZWxhdGl2ZVBvc2l0aW9uOiBudW1iZXIgPSAwKTogc3RyaW5nW10ge1xyXG4gICAgY29uc3QgaW5kZXggPSB0aGlzLl9kYXRhLmluZGV4T2YoaWQpO1xyXG4gICAgaWYgKGluZGV4ID09PSAtMSkge1xyXG4gICAgICB0aHJvdyBuZXcgTm90TG9nZ2VkRXhjZXB0aW9uKGlkKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBwb3NpdGlvbiA9IGluZGV4ICsgMSArIHJlbGF0aXZlUG9zaXRpb247XHJcbiAgICBpZiAocG9zaXRpb24gPCAwIHx8IHBvc2l0aW9uID4gdGhpcy5fZGF0YS5sZW5ndGgpIHtcclxuICAgICAgdGhyb3cgbmV3IE91dE9mUmFuZ2VFeGNlcHRpb24ocG9zaXRpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLl9kYXRhLnNsaWNlKHBvc2l0aW9uKTtcclxuICB9XHJcblxyXG4gIHRydW5jYXRlKGlkOiBzdHJpbmcsIHJlbGF0aXZlUG9zaXRpb246IG51bWJlciA9IDApOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIGxldCByZW1vdmVkOiBzdHJpbmdbXTtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5yZWlmaWVkXHJcbiAgICAgIC50aGVuKCgpID0+IHtcclxuXHJcbiAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLl9kYXRhLmluZGV4T2YoaWQpO1xyXG4gICAgICAgIGlmIChpbmRleCA9PT0gLTEpIHtcclxuICAgICAgICAgIHRocm93IG5ldyBOb3RMb2dnZWRFeGNlcHRpb24oaWQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgcG9zaXRpb24gPSBpbmRleCArIHJlbGF0aXZlUG9zaXRpb247XHJcbiAgICAgICAgaWYgKHBvc2l0aW9uIDwgMCB8fCBwb3NpdGlvbiA+IHRoaXMuX2RhdGEubGVuZ3RoKSB7XHJcbiAgICAgICAgICB0aHJvdyBuZXcgT3V0T2ZSYW5nZUV4Y2VwdGlvbihwb3NpdGlvbik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocG9zaXRpb24gPT09IHRoaXMuX2RhdGEubGVuZ3RoKSB7XHJcbiAgICAgICAgICByZW1vdmVkID0gdGhpcy5fZGF0YTtcclxuICAgICAgICAgIHRoaXMuX2RhdGEgPSBbXTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmVtb3ZlZCA9IHRoaXMuX2RhdGEuc2xpY2UoMCwgcG9zaXRpb24pO1xyXG4gICAgICAgICAgdGhpcy5fZGF0YSA9IHRoaXMuX2RhdGEuc2xpY2UocG9zaXRpb24pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BlcnNpc3QoKTtcclxuICAgICAgfSlcclxuICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuZW1pdCgndHJ1bmNhdGUnLCBpZCwgcmVsYXRpdmVQb3NpdGlvbiwgcmVtb3ZlZCk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcm9sbGJhY2soaWQ6IHN0cmluZywgcmVsYXRpdmVQb3NpdGlvbjogbnVtYmVyID0gMCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgbGV0IHJlbW92ZWQ6IHN0cmluZ1tdO1xyXG5cclxuICAgIHJldHVybiB0aGlzLnJlaWZpZWRcclxuICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5fZGF0YS5pbmRleE9mKGlkKTtcclxuICAgICAgICBpZiAoaW5kZXggPT09IC0xKSB7XHJcbiAgICAgICAgICB0aHJvdyBuZXcgTm90TG9nZ2VkRXhjZXB0aW9uKGlkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0gaW5kZXggKyAxICsgcmVsYXRpdmVQb3NpdGlvbjtcclxuICAgICAgICBpZiAocG9zaXRpb24gPCAwIHx8IHBvc2l0aW9uID4gdGhpcy5fZGF0YS5sZW5ndGgpIHtcclxuICAgICAgICAgIHRocm93IG5ldyBPdXRPZlJhbmdlRXhjZXB0aW9uKHBvc2l0aW9uKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJlbW92ZWQgPSB0aGlzLl9kYXRhLnNsaWNlKHBvc2l0aW9uKTtcclxuICAgICAgICB0aGlzLl9kYXRhID0gdGhpcy5fZGF0YS5zbGljZSgwLCBwb3NpdGlvbik7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl9wZXJzaXN0KCk7XHJcbiAgICAgIH0pXHJcbiAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICB0aGlzLmVtaXQoJ3JvbGxiYWNrJywgaWQsIHJlbGF0aXZlUG9zaXRpb24sIHJlbW92ZWQpO1xyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIGNsZWFyKCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgbGV0IGNsZWFyZWREYXRhO1xyXG5cclxuICAgIHJldHVybiB0aGlzLnJlaWZpZWRcclxuICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgIGNsZWFyZWREYXRhID0gdGhpcy5fZGF0YTtcclxuICAgICAgICB0aGlzLl9kYXRhID0gW107XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BlcnNpc3QoKTtcclxuICAgICAgfSlcclxuICAgICAgLnRoZW4oKCkgPT4gdGhpcy5lbWl0KCdjbGVhcicsIGNsZWFyZWREYXRhKSk7XHJcbiAgfVxyXG5cclxuICBjb250YWlucyhpZDogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5fZGF0YS5pbmRleE9mKGlkKSA+IC0xO1xyXG4gIH1cclxuXHJcbiAgX3BlcnNpc3QoKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICB0aGlzLmVtaXQoJ2NoYW5nZScpO1xyXG4gICAgaWYgKHRoaXMuYnVja2V0KSB7XHJcbiAgICAgIHJldHVybiB0aGlzLl9idWNrZXQuc2V0SXRlbSh0aGlzLm5hbWUsIHRoaXMuX2RhdGEpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIE9yYml0LlByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgX3JlaWZ5KGRhdGE6IHN0cmluZ1tdKTogdm9pZCB7XHJcbiAgICBpZiAoIWRhdGEgJiYgdGhpcy5fYnVja2V0KSB7XHJcbiAgICAgIHRoaXMucmVpZmllZCA9IHRoaXMuX2J1Y2tldC5nZXRJdGVtKHRoaXMuX25hbWUpXHJcbiAgICAgICAgLnRoZW4oYnVja2V0RGF0YSA9PiB0aGlzLl9pbml0RGF0YShidWNrZXREYXRhKSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLl9pbml0RGF0YShkYXRhKTtcclxuICAgICAgdGhpcy5yZWlmaWVkID0gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBfaW5pdERhdGEoZGF0YTogc3RyaW5nW10pOiB2b2lkIHtcclxuICAgIGlmIChkYXRhKSB7XHJcbiAgICAgIHRoaXMuX2RhdGEgPSBkYXRhO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5fZGF0YSA9IFtdO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXX0=