"use strict";

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
        if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }return c > 3 && r && Object.defineProperty(target, key, r), r;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3JjL2xvZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHNCQUFzQztBQUN0QyxxQkFBMkI7QUFDM0Isd0JBQTZDO0FBRTdDLDBCQUFzRTtBQVF0RSxBQVVHOzs7Ozs7Ozs7OztBQUVIO0FBY0UsaUJBQVksQUFBd0I7QUFBeEIsZ0NBQUE7QUFBQSxzQkFBd0I7O0FBQ2xDLEFBQUksYUFBQyxBQUFLLFFBQUcsQUFBTyxRQUFDLEFBQUksQUFBQztBQUMxQixBQUFJLGFBQUMsQUFBTyxVQUFHLEFBQU8sUUFBQyxBQUFNLEFBQUM7QUFFOUIsQUFBRSxBQUFDLFlBQUMsQUFBSSxLQUFDLEFBQU8sQUFBQyxTQUFDLEFBQUM7QUFDakIsb0JBQU0sT0FBQyxBQUF3QywwQ0FBRSxDQUFDLENBQUMsQUFBSSxLQUFDLEFBQUssQUFBQyxBQUFDLEFBQ2pFO0FBQUM7QUFFRCxBQUFJLGFBQUMsQUFBTSxPQUFDLEFBQU8sUUFBQyxBQUFJLEFBQUMsQUFBQyxBQUM1QjtBQUFDO0FBRUQsMEJBQUksZUFBSTthQUFSO0FBQ0UsQUFBTSxtQkFBQyxBQUFJLEtBQUMsQUFBSyxBQUFDLEFBQ3BCO0FBQUM7O3NCQUFBOztBQUVELDBCQUFJLGVBQU07YUFBVjtBQUNFLEFBQU0sbUJBQUMsQUFBSSxLQUFDLEFBQU8sQUFBQyxBQUN0QjtBQUFDOztzQkFBQTs7QUFFRCwwQkFBSSxlQUFJO2FBQVI7QUFDRSxBQUFNLG1CQUFDLEFBQUksS0FBQyxBQUFLLE1BQUMsQUFBSSxLQUFDLEFBQUssTUFBQyxBQUFNLFNBQUcsQUFBQyxBQUFDLEFBQUMsQUFDM0M7QUFBQzs7c0JBQUE7O0FBRUQsMEJBQUksZUFBTzthQUFYO0FBQ0UsQUFBTSxtQkFBQyxBQUFJLEtBQUMsQUFBSyxBQUFDLEFBQ3BCO0FBQUM7O3NCQUFBOztBQUVELDBCQUFJLGVBQU07YUFBVjtBQUNFLEFBQU0sbUJBQUMsQUFBSSxLQUFDLEFB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QyxBQUFJLEFBQUMsTUFBQyxBQUFDO0FBQ1QsQUFBSSxpQkFBQyxBQUFLLFFBQUcsQUFBSSxBQUFDLEFBQ3BCO0FBQUMsQUFBQyxBQUFJLGVBQUMsQUFBQztBQUNOLEFBQUksaUJBQUMsQUFBSyxRQUFHLEFBQUUsQUFBQyxBQUNsQjtBQUFDLEFBQ0g7QUFBQztBQXJMa0IsQUFBRyxzQkFEdkIsVUFBTyxVQUNhLEFBQUcsQUFzTHZCO0FBQUQsV0FBQztBQXRMRCxBQXNMQztrQkF0TG9CLEFBQUciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhc3NlcnQgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xyXG5pbXBvcnQgT3JiaXQgZnJvbSAnLi9tYWluJztcclxuaW1wb3J0IGV2ZW50ZWQsIHsgRXZlbnRlZCB9IGZyb20gJy4vZXZlbnRlZCc7XHJcbmltcG9ydCB7IEJ1Y2tldCB9IGZyb20gJy4vYnVja2V0JztcclxuaW1wb3J0IHsgTm90TG9nZ2VkRXhjZXB0aW9uLCBPdXRPZlJhbmdlRXhjZXB0aW9uIH0gZnJvbSAnLi9leGNlcHRpb24nO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBMb2dPcHRpb25zIHtcclxuICBuYW1lPzogc3RyaW5nO1xyXG4gIGRhdGE/OiBzdHJpbmdbXTtcclxuICBidWNrZXQ/OiBCdWNrZXQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBMb2dzIHRyYWNrIGEgc2VyaWVzIG9mIHVuaXF1ZSBldmVudHMgdGhhdCBoYXZlIG9jY3VycmVkLiBFYWNoIGV2ZW50IGlzXHJcbiAqIHRyYWNrZWQgYmFzZWQgb24gaXRzIHVuaXF1ZSBpZC4gVGhlIGxvZyBvbmx5IHRyYWNrcyB0aGUgaWRzIGJ1dCBjdXJyZW50bHlcclxuICogZG9lcyBub3QgdHJhY2sgYW55IGRldGFpbHMuXHJcbiAqXHJcbiAqIExvZ3MgY2FuIGF1dG9tYXRpY2FsbHkgYmUgcGVyc2lzdGVkIGJ5IGFzc2lnbmluZyB0aGVtIGEgYnVja2V0LlxyXG4gKiBcclxuICogQGV4cG9ydFxyXG4gKiBAY2xhc3MgTG9nXHJcbiAqIEBpbXBsZW1lbnRzIHtFdmVudGVkfVxyXG4gKi9cclxuQGV2ZW50ZWRcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9nIGltcGxlbWVudHMgRXZlbnRlZCB7XHJcbiAgcHJpdmF0ZSBfbmFtZTogc3RyaW5nO1xyXG4gIHByaXZhdGUgX2J1Y2tldDogQnVja2V0O1xyXG4gIHByaXZhdGUgX2RhdGE6IHN0cmluZ1tdO1xyXG5cclxuICBwdWJsaWMgcmVpZmllZDogUHJvbWlzZTx2b2lkPjtcclxuXHJcbiAgLy8gRXZlbnRlZCBpbnRlcmZhY2Ugc3R1YnNcclxuICBvbjogKGV2ZW50OiBzdHJpbmcsIGNhbGxiYWNrOiAoKSA9PiB2b2lkLCBiaW5kaW5nPzogYW55KSA9PiB2b2lkO1xyXG4gIG9mZjogKGV2ZW50OiBzdHJpbmcsIGNhbGxiYWNrOiAoKSA9PiB2b2lkLCBiaW5kaW5nPzogYW55KSA9PiB2b2lkO1xyXG4gIG9uZTogKGV2ZW50OiBzdHJpbmcsIGNhbGxiYWNrOiAoKSA9PiB2b2lkLCBiaW5kaW5nPzogYW55KSA9PiB2b2lkO1xyXG4gIGVtaXQ6IChldmVudDogc3RyaW5nLCAuLi5hcmdzKSA9PiB2b2lkO1xyXG4gIGxpc3RlbmVyczogKGV2ZW50OiBzdHJpbmcpID0+IGFueVtdO1xyXG5cclxuICBjb25zdHJ1Y3RvcihvcHRpb25zOiBMb2dPcHRpb25zID0ge30pIHtcclxuICAgIHRoaXMuX25hbWUgPSBvcHRpb25zLm5hbWU7XHJcbiAgICB0aGlzLl9idWNrZXQgPSBvcHRpb25zLmJ1Y2tldDtcclxuXHJcbiAgICBpZiAodGhpcy5fYnVja2V0KSB7XHJcbiAgICAgIGFzc2VydCgnTG9nIHJlcXVpcmVzIGEgbmFtZSBpZiBpdCBoYXMgYSBidWNrZXQnLCAhIXRoaXMuX25hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuX3JlaWZ5KG9wdGlvbnMuZGF0YSk7XHJcbiAgfVxyXG5cclxuICBnZXQgbmFtZSgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMuX25hbWU7XHJcbiAgfVxyXG5cclxuICBnZXQgYnVja2V0KCk6IEJ1Y2tldCB7XHJcbiAgICByZXR1cm4gdGhpcy5fYnVja2V0O1xyXG4gIH1cclxuXHJcbiAgZ2V0IGhlYWQoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLl9kYXRhW3RoaXMuX2RhdGEubGVuZ3RoIC0gMV07XHJcbiAgfVxyXG5cclxuICBnZXQgZW50cmllcygpOiBzdHJpbmdbXSB7XHJcbiAgICByZXR1cm4gdGhpcy5fZGF0YTtcclxuICB9XHJcblxyXG4gIGdldCBsZW5ndGgoKTogbnVtYmVyIHtcclxuICAgIHJldHVybiB0aGlzLl9kYXRhLmxlbmd0aDtcclxuICB9XHJcblxyXG4gIGFwcGVuZCguLi5pZHM6IHN0cmluZ1tdKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICByZXR1cm4gdGhpcy5yZWlmaWVkXHJcbiAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseSh0aGlzLl9kYXRhLCBpZHMpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9wZXJzaXN0KCk7XHJcbiAgICAgIH0pXHJcbiAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICB0aGlzLmVtaXQoJ2FwcGVuZCcsIGlkcyk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgYmVmb3JlKGlkOiBzdHJpbmcsIHJlbGF0aXZlUG9zaXRpb246IG51bWJlciA9IDApOiBzdHJpbmdbXSB7XHJcbiAgICBjb25zdCBpbmRleCA9IHRoaXMuX2RhdGEuaW5kZXhPZihpZCk7XHJcbiAgICBpZiAoaW5kZXggPT09IC0xKSB7XHJcbiAgICAgIHRocm93IG5ldyBOb3RMb2dnZWRFeGNlcHRpb24oaWQpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHBvc2l0aW9uID0gaW5kZXggKyByZWxhdGl2ZVBvc2l0aW9uO1xyXG4gICAgaWYgKHBvc2l0aW9uIDwgMCB8fCBwb3NpdGlvbiA+PSB0aGlzLl9kYXRhLmxlbmd0aCkge1xyXG4gICAgICB0aHJvdyBuZXcgT3V0T2ZSYW5nZUV4Y2VwdGlvbihwb3NpdGlvbik7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuX2RhdGEuc2xpY2UoMCwgcG9zaXRpb24pO1xyXG4gIH1cclxuXHJcbiAgYWZ0ZXIoaWQ6IHN0cmluZywgcmVsYXRpdmVQb3NpdGlvbjogbnVtYmVyID0gMCk6IHN0cmluZ1tdIHtcclxuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5fZGF0YS5pbmRleE9mKGlkKTtcclxuICAgIGlmIChpbmRleCA9PT0gLTEpIHtcclxuICAgICAgdGhyb3cgbmV3IE5vdExvZ2dlZEV4Y2VwdGlvbihpZCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcG9zaXRpb24gPSBpbmRleCArIDEgKyByZWxhdGl2ZVBvc2l0aW9uO1xyXG4gICAgaWYgKHBvc2l0aW9uIDwgMCB8fCBwb3NpdGlvbiA+IHRoaXMuX2RhdGEubGVuZ3RoKSB7XHJcbiAgICAgIHRocm93IG5ldyBPdXRPZlJhbmdlRXhjZXB0aW9uKHBvc2l0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5fZGF0YS5zbGljZShwb3NpdGlvbik7XHJcbiAgfVxyXG5cclxuICB0cnVuY2F0ZShpZDogc3RyaW5nLCByZWxhdGl2ZVBvc2l0aW9uOiBudW1iZXIgPSAwKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICBsZXQgcmVtb3ZlZDogc3RyaW5nW107XHJcblxyXG4gICAgcmV0dXJuIHRoaXMucmVpZmllZFxyXG4gICAgICAudGhlbigoKSA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5fZGF0YS5pbmRleE9mKGlkKTtcclxuICAgICAgICBpZiAoaW5kZXggPT09IC0xKSB7XHJcbiAgICAgICAgICB0aHJvdyBuZXcgTm90TG9nZ2VkRXhjZXB0aW9uKGlkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0gaW5kZXggKyByZWxhdGl2ZVBvc2l0aW9uO1xyXG4gICAgICAgIGlmIChwb3NpdGlvbiA8IDAgfHwgcG9zaXRpb24gPiB0aGlzLl9kYXRhLmxlbmd0aCkge1xyXG4gICAgICAgICAgdGhyb3cgbmV3IE91dE9mUmFuZ2VFeGNlcHRpb24ocG9zaXRpb24pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHBvc2l0aW9uID09PSB0aGlzLl9kYXRhLmxlbmd0aCkge1xyXG4gICAgICAgICAgcmVtb3ZlZCA9IHRoaXMuX2RhdGE7XHJcbiAgICAgICAgICB0aGlzLl9kYXRhID0gW107XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJlbW92ZWQgPSB0aGlzLl9kYXRhLnNsaWNlKDAsIHBvc2l0aW9uKTtcclxuICAgICAgICAgIHRoaXMuX2RhdGEgPSB0aGlzLl9kYXRhLnNsaWNlKHBvc2l0aW9uKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl9wZXJzaXN0KCk7XHJcbiAgICAgIH0pXHJcbiAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICB0aGlzLmVtaXQoJ3RydW5jYXRlJywgaWQsIHJlbGF0aXZlUG9zaXRpb24sIHJlbW92ZWQpO1xyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIHJvbGxiYWNrKGlkOiBzdHJpbmcsIHJlbGF0aXZlUG9zaXRpb246IG51bWJlciA9IDApOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIGxldCByZW1vdmVkOiBzdHJpbmdbXTtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5yZWlmaWVkXHJcbiAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuX2RhdGEuaW5kZXhPZihpZCk7XHJcbiAgICAgICAgaWYgKGluZGV4ID09PSAtMSkge1xyXG4gICAgICAgICAgdGhyb3cgbmV3IE5vdExvZ2dlZEV4Y2VwdGlvbihpZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBwb3NpdGlvbiA9IGluZGV4ICsgMSArIHJlbGF0aXZlUG9zaXRpb247XHJcbiAgICAgICAgaWYgKHBvc2l0aW9uIDwgMCB8fCBwb3NpdGlvbiA+IHRoaXMuX2RhdGEubGVuZ3RoKSB7XHJcbiAgICAgICAgICB0aHJvdyBuZXcgT3V0T2ZSYW5nZUV4Y2VwdGlvbihwb3NpdGlvbik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZW1vdmVkID0gdGhpcy5fZGF0YS5zbGljZShwb3NpdGlvbik7XHJcbiAgICAgICAgdGhpcy5fZGF0YSA9IHRoaXMuX2RhdGEuc2xpY2UoMCwgcG9zaXRpb24pO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fcGVyc2lzdCgpO1xyXG4gICAgICB9KVxyXG4gICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5lbWl0KCdyb2xsYmFjaycsIGlkLCByZWxhdGl2ZVBvc2l0aW9uLCByZW1vdmVkKTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBjbGVhcigpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIGxldCBjbGVhcmVkRGF0YTtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5yZWlmaWVkXHJcbiAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICBjbGVhcmVkRGF0YSA9IHRoaXMuX2RhdGE7XHJcbiAgICAgICAgdGhpcy5fZGF0YSA9IFtdO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9wZXJzaXN0KCk7XHJcbiAgICAgIH0pXHJcbiAgICAgIC50aGVuKCgpID0+IHRoaXMuZW1pdCgnY2xlYXInLCBjbGVhcmVkRGF0YSkpO1xyXG4gIH1cclxuXHJcbiAgY29udGFpbnMoaWQ6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuX2RhdGEuaW5kZXhPZihpZCkgPiAtMTtcclxuICB9XHJcblxyXG4gIF9wZXJzaXN0KCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgdGhpcy5lbWl0KCdjaGFuZ2UnKTtcclxuICAgIGlmICh0aGlzLmJ1Y2tldCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5fYnVja2V0LnNldEl0ZW0odGhpcy5uYW1lLCB0aGlzLl9kYXRhKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIF9yZWlmeShkYXRhOiBzdHJpbmdbXSk6IHZvaWQge1xyXG4gICAgaWYgKCFkYXRhICYmIHRoaXMuX2J1Y2tldCkge1xyXG4gICAgICB0aGlzLnJlaWZpZWQgPSB0aGlzLl9idWNrZXQuZ2V0SXRlbSh0aGlzLl9uYW1lKVxyXG4gICAgICAgIC50aGVuKGJ1Y2tldERhdGEgPT4gdGhpcy5faW5pdERhdGEoYnVja2V0RGF0YSkpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5faW5pdERhdGEoZGF0YSk7XHJcbiAgICAgIHRoaXMucmVpZmllZCA9IE9yYml0LlByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgX2luaXREYXRhKGRhdGE6IHN0cmluZ1tdKTogdm9pZCB7XHJcbiAgICBpZiAoZGF0YSkge1xyXG4gICAgICB0aGlzLl9kYXRhID0gZGF0YTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuX2RhdGEgPSBbXTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIl19