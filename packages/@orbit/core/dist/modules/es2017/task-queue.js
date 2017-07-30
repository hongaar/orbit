"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var main_1 = require("./main");
var task_processor_1 = require("./task-processor");
var evented_1 = require("./evented");
var utils_1 = require("@orbit/utils");
/**
 * `TaskQueue` is a FIFO queue of asynchronous tasks that should be
 * performed sequentially.
 *
 * Tasks are added to the queue with `push`. Each task will be processed by
 * calling its `process` method.
 *
 * By default, task queues will be processed automatically, as soon as tasks
 * are pushed to them. This can be overridden by setting the `autoProcess`
 * setting to `false` and calling `process` when you'd like to start
 * processing.
 *
 * @export
 * @class TaskQueue
 * @implements {Evented}
 */
var TaskQueue = (function () {
    /**
     * Creates an instance of `TaskQueue`.
     *
     * @param {Performer} target
     * @param {TaskQueueOptions} [options={}]
     *
     * @memberOf TaskQueue
     */
    function TaskQueue(target, settings) {
        if (settings === void 0) { settings = {}; }
        var _this = this;
        utils_1.assert('TaskQueue requires Orbit.Promise to be defined', main_1.default.Promise);
        this._performer = target;
        this._name = settings.name;
        this._bucket = settings.bucket;
        this.autoProcess = settings.autoProcess === undefined ? true : settings.autoProcess;
        if (this._bucket) {
            utils_1.assert('TaskQueue requires a name if it has a bucket', !!this._name);
        }
        this._reify()
            .then(function () {
            if (_this.length > 0 && _this.autoProcess) {
                _this.process();
            }
        });
    }
    Object.defineProperty(TaskQueue.prototype, "name", {
        /**
         * Name used for tracking / debugging this queue.
         *
         * @readonly
         * @type {string}
         * @memberOf TaskQueue
         */
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TaskQueue.prototype, "performer", {
        /**
         * The object which will `perform` the tasks in this queue.
         *
         * @readonly
         * @type {Performer}
         * @memberOf TaskQueue
         */
        get: function () {
            return this._performer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TaskQueue.prototype, "bucket", {
        /**
         * A bucket used to persist the state of this queue.
         *
         * @readonly
         * @type {Bucket}
         * @memberOf TaskQueue
         */
        get: function () {
            return this._bucket;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TaskQueue.prototype, "length", {
        /**
         * The number of tasks in the queue.
         *
         * @readonly
         * @type {number}
         * @memberOf TaskQueue
         */
        get: function () {
            return this._tasks ? this._tasks.length : 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TaskQueue.prototype, "entries", {
        /**
         * The tasks in the queue.
         *
         * @readonly
         * @type {Task[]}
         * @memberOf TaskQueue
         */
        get: function () {
            return this._tasks;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TaskQueue.prototype, "current", {
        /**
         * The current task being processed (if actively processing), or the next
         * task to be processed (if not actively processing).
         *
         * @readonly
         * @type {Task}
         * @memberOf TaskQueue
         */
        get: function () {
            return this._tasks && this._tasks[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TaskQueue.prototype, "currentProcessor", {
        /**
         * The processor wrapper that is processing the current task (or next task,
         * if none are being processed).
         *
         * @readonly
         * @type {TaskProcessor}
         * @memberOf TaskQueue
         */
        get: function () {
            return this._processors && this._processors[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TaskQueue.prototype, "error", {
        /**
         * If an error occurs while processing a task, processing will be halted, the
         * `fail` event will be emitted, and this property will reflect the error
         * encountered.
         *
         * @readonly
         * @type {Error}
         * @memberOf TaskQueue
         */
        get: function () {
            return this._error;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TaskQueue.prototype, "empty", {
        /**
         * Is the queue empty?
         *
         * @readonly
         * @type {boolean}
         * @memberOf TaskQueue
         */
        get: function () {
            return this.length === 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TaskQueue.prototype, "processing", {
        /**
         * Is the queue actively processing a task?
         *
         * @readonly
         * @type {boolean}
         * @memberOf TaskQueue
         */
        get: function () {
            var processor = this.currentProcessor;
            return processor !== undefined &&
                processor.started &&
                !processor.settled;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TaskQueue.prototype, "reified", {
        /**
         * Resolves when the queue has been fully reified from its associated bucket,
         * if applicable.
         *
         * @readonly
         * @type {Promise<void>}
         * @memberOf TaskQueue
         */
        get: function () {
            return this._reified;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Push a new task onto the end of the queue.
     *
     * If `autoProcess` is enabled, this will automatically trigger processing of
     * the queue.
     *
     * Returns a promise that resolves when the pushed task has been processed.
     *
     * @param {Task} task
     * @returns {Promise<void>}
     *
     * @memberOf TaskQueue
     */
    TaskQueue.prototype.push = function (task) {
        var _this = this;
        var processor = new task_processor_1.default(this._performer, task);
        return this._reified
            .then(function () {
            _this._tasks.push(task);
            _this._processors.push(processor);
            return _this._persist();
        })
            .then(function () {
            if (_this.autoProcess) {
                return _this.process()
                    .then(function () { return processor.settle(); });
            }
            else {
                return processor.settle();
            }
        });
    };
    /**
     * Cancels and re-tries processing the current task.
     *
     * @returns {Promise<void>}
     *
     * @memberOf TaskQueue
     */
    TaskQueue.prototype.retry = function () {
        var _this = this;
        return this._reified
            .then(function () {
            _this._cancel();
            _this.currentProcessor.reset();
            return _this._persist();
        })
            .then(function () { return _this.process(); });
    };
    /**
     * Cancels and discards the current task and proceeds to process the next
     * task.
     *
     * @returns {Promise<void>}
     *
     * @memberOf TaskQueue
     */
    TaskQueue.prototype.skip = function () {
        var _this = this;
        return this._reified
            .then(function () {
            _this._cancel();
            _this._tasks.shift();
            _this._processors.shift();
            return _this._persist();
        })
            .then(function () { return _this.process(); });
    };
    /**
     * Cancels the current task and completely clears the queue.
     *
     * @returns {Promise<void>}
     *
     * @memberOf TaskQueue
     */
    TaskQueue.prototype.clear = function () {
        var _this = this;
        return this._reified
            .then(function () {
            _this._cancel();
            _this._tasks = [];
            _this._processors = [];
            return _this._persist();
        })
            .then(function () { return _this.process(); });
    };
    /**
     * Cancels the current task and removes it, but does not continue processing.
     *
     * @returns {Promise<Task>}
     *
     * @memberOf TaskQueue
     */
    TaskQueue.prototype.shift = function () {
        var _this = this;
        var task;
        return this._reified
            .then(function () {
            _this._cancel();
            task = _this._tasks.shift();
            _this._processors.shift();
            return _this._persist();
        })
            .then(function () { return task; });
    };
    /**
     * Cancels processing the current task and inserts a new task at the beginning
     * of the queue. This new task will be processed next.
     *
     * @param {Task} task
     * @returns {Promise<void>}
     *
     * @memberOf TaskQueue
     */
    TaskQueue.prototype.unshift = function (task) {
        var _this = this;
        return this._reified
            .then(function () {
            _this._cancel();
            _this._tasks.unshift(task);
            _this._processors.unshift(new task_processor_1.default(_this._performer, task));
            return _this._persist();
        });
    };
    /**
     * Processes all the tasks in the queue. Resolves when the queue is empty.
     *
     * @returns {Promise<any>}
     *
     * @memberOf TaskQueue
     */
    TaskQueue.prototype.process = function () {
        var _this = this;
        return this._reified
            .then(function () {
            var resolution = _this._resolution;
            if (!resolution) {
                if (_this._tasks.length === 0) {
                    resolution = main_1.default.Promise.resolve();
                    _this._complete();
                }
                else {
                    _this._error = null;
                    _this._resolution = resolution = new main_1.default.Promise(function (resolve, reject) {
                        _this._resolve = resolve;
                        _this._reject = reject;
                    });
                    _this._settleEach(resolution);
                }
            }
            return resolution;
        });
    };
    TaskQueue.prototype._complete = function () {
        if (this._resolve) {
            this._resolve();
        }
        this._resolve = null;
        this._reject = null;
        this._error = null;
        this._resolution = null;
        this.emit('complete');
    };
    TaskQueue.prototype._fail = function (task, e) {
        if (this._reject) {
            this._reject(e);
        }
        this._resolve = null;
        this._reject = null;
        this._error = e;
        this._resolution = null;
        this.emit('fail', task, e);
    };
    TaskQueue.prototype._cancel = function () {
        this._error = null;
        this._resolution = null;
    };
    TaskQueue.prototype._settleEach = function (resolution) {
        var _this = this;
        if (this._tasks.length === 0) {
            this._complete();
        }
        else {
            var task_1 = this._tasks[0];
            var processor = this._processors[0];
            this.emit('beforeTask', task_1);
            processor.process()
                .then(function (result) {
                if (resolution === _this._resolution) {
                    _this._tasks.shift();
                    _this._processors.shift();
                    _this._persist()
                        .then(function () {
                        _this.emit('task', task_1);
                        _this._settleEach(resolution);
                    });
                }
            })
                .catch(function (e) {
                if (resolution === _this._resolution) {
                    _this._fail(task_1, e);
                }
            });
        }
    };
    TaskQueue.prototype._reify = function () {
        var _this = this;
        this._tasks = [];
        this._processors = [];
        if (this._bucket) {
            this._reified = this._bucket.getItem(this._name)
                .then(function (tasks) {
                if (tasks) {
                    _this._tasks = tasks;
                    _this._processors = tasks.map(function (task) { return new task_processor_1.default(_this._performer, task); });
                }
            });
        }
        else {
            this._reified = main_1.default.Promise.resolve();
        }
        return this._reified;
    };
    TaskQueue.prototype._persist = function () {
        this.emit('change');
        if (this._bucket) {
            return this._bucket.setItem(this._name, this._tasks);
        }
        else {
            return main_1.default.Promise.resolve();
        }
    };
    TaskQueue = __decorate([
        evented_1.default
    ], TaskQueue);
    return TaskQueue;
}());
exports.default = TaskQueue;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFzay1xdWV1ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNyYy90YXNrLXF1ZXVlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsK0JBQTJCO0FBRTNCLG1EQUE2QztBQUU3QyxxQ0FBNkM7QUFDN0Msc0NBQXNDO0FBc0N0Qzs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSDtJQXFCRTs7Ozs7OztPQU9HO0lBQ0gsbUJBQVksTUFBaUIsRUFBRSxRQUFnQztRQUFoQyx5QkFBQSxFQUFBLGFBQWdDO1FBQS9ELGlCQWtCQztRQWpCQyxjQUFNLENBQUMsZ0RBQWdELEVBQUUsY0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRXhFLElBQUksQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQztRQUMzQixJQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUM7UUFDL0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxRQUFRLENBQUMsV0FBVyxLQUFLLFNBQVMsR0FBRyxJQUFJLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQztRQUVwRixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNqQixjQUFNLENBQUMsOENBQThDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN2RSxDQUFDO1FBRUQsSUFBSSxDQUFDLE1BQU0sRUFBRTthQUNWLElBQUksQ0FBQztZQUNKLEVBQUUsQ0FBQyxDQUFDLEtBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLEtBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO2dCQUN4QyxLQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDakIsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQVNELHNCQUFJLDJCQUFJO1FBUFI7Ozs7OztXQU1HO2FBQ0g7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QztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sSUFBSSxDQUFDLFFBQVEsR0FBRyxjQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQzFDLENBQUM7UUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN2QixDQUFDO0lBRU8sNEJBQVEsR0FBaEI7UUFDRSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3BCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN2RCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixNQUFNLENBQUMsY0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNqQyxDQUFDO0lBQ0gsQ0FBQztJQWhha0IsU0FBUztRQUQ3QixpQkFBTztPQUNhLFNBQVMsQ0FpYTdCO0lBQUQsZ0JBQUM7Q0FBQSxBQWphRCxJQWlhQztrQkFqYW9CLFNBQVMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgT3JiaXQgZnJvbSAnLi9tYWluJztcclxuaW1wb3J0IHsgVGFzaywgUGVyZm9ybWVyIH0gZnJvbSAnLi90YXNrJztcclxuaW1wb3J0IFRhc2tQcm9jZXNzb3IgZnJvbSAnLi90YXNrLXByb2Nlc3Nvcic7XHJcbmltcG9ydCB7IEJ1Y2tldCB9IGZyb20gJy4vYnVja2V0JztcclxuaW1wb3J0IGV2ZW50ZWQsIHsgRXZlbnRlZCB9IGZyb20gJy4vZXZlbnRlZCc7XHJcbmltcG9ydCB7IGFzc2VydCB9IGZyb20gJ0BvcmJpdC91dGlscyc7XHJcblxyXG4vKipcclxuICogU2V0dGluZ3MgZm9yIGEgYFRhc2tRdWV1ZWAuXHJcbiAqXHJcbiAqIEBleHBvcnRcclxuICogQGludGVyZmFjZSBUYXNrUXVldWVTZXR0aW5nc1xyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBUYXNrUXVldWVTZXR0aW5ncyB7XHJcbiAgLyoqXHJcbiAgICogTmFtZSB1c2VkIGZvciB0cmFja2luZyBhbmQgZGVidWdnaW5nIGEgdGFzayBxdWV1ZS5cclxuICAgKlxyXG4gICAqIEB0eXBlIHtzdHJpbmd9XHJcbiAgICogQG1lbWJlck9mIFRhc2tRdWV1ZVNldHRpbmdzXHJcbiAgICovXHJcbiAgbmFtZT86IHN0cmluZztcclxuXHJcbiAgLyoqXHJcbiAgICogQSBidWNrZXQgaW4gd2hpY2ggdG8gcGVyc2lzdCBxdWV1ZSBzdGF0ZS5cclxuICAgKlxyXG4gICAqIEB0eXBlIHtCdWNrZXR9XHJcbiAgICogQG1lbWJlck9mIFRhc2tRdWV1ZVNldHRpbmdzXHJcbiAgICovXHJcbiAgYnVja2V0PzogQnVja2V0O1xyXG5cclxuICAvKipcclxuICAgKiBBIGZsYWcgaW5kaWNhdGluZyB3aGV0aGVyIHRhc2tzIHNob3VsZCBiZSBwcm9jZXNzZWQgYXMgc29vbiBhcyB0aGV5IGFyZVxyXG4gICAqIHB1c2hlZCBpbnRvIGEgcXVldWUuIFNldCB0byBgZmFsc2VgIHRvIG92ZXJyaWRlIHRoZSBkZWZhdWx0IGB0cnVlYFxyXG4gICAqIGJlaGF2aW9yLlxyXG4gICAqXHJcbiAgICogQHR5cGUge2Jvb2xlYW59XHJcbiAgICogQG1lbWJlck9mIFRhc2tRdWV1ZVNldHRpbmdzXHJcbiAgICovXHJcbiAgYXV0b1Byb2Nlc3M/OiBib29sZWFuO1xyXG59XHJcblxyXG5leHBvcnQgdHlwZSBUQVNLX1FVRVVFX0VWRU5UUyA9ICdjb21wbGV0ZScgfCAnZmFpbCcgfCAnYmVmb3JlVGFzaycgfCAndGFzaycgfCAnY2hhbmdlJztcclxuXHJcbi8qKlxyXG4gKiBgVGFza1F1ZXVlYCBpcyBhIEZJRk8gcXVldWUgb2YgYXN5bmNocm9ub3VzIHRhc2tzIHRoYXQgc2hvdWxkIGJlXHJcbiAqIHBlcmZvcm1lZCBzZXF1ZW50aWFsbHkuXHJcbiAqXHJcbiAqIFRhc2tzIGFyZSBhZGRlZCB0byB0aGUgcXVldWUgd2l0aCBgcHVzaGAuIEVhY2ggdGFzayB3aWxsIGJlIHByb2Nlc3NlZCBieVxyXG4gKiBjYWxsaW5nIGl0cyBgcHJvY2Vzc2AgbWV0aG9kLlxyXG4gKlxyXG4gKiBCeSBkZWZhdWx0LCB0YXNrIHF1ZXVlcyB3aWxsIGJlIHByb2Nlc3NlZCBhdXRvbWF0aWNhbGx5LCBhcyBzb29uIGFzIHRhc2tzXHJcbiAqIGFyZSBwdXNoZWQgdG8gdGhlbS4gVGhpcyBjYW4gYmUgb3ZlcnJpZGRlbiBieSBzZXR0aW5nIHRoZSBgYXV0b1Byb2Nlc3NgXHJcbiAqIHNldHRpbmcgdG8gYGZhbHNlYCBhbmQgY2FsbGluZyBgcHJvY2Vzc2Agd2hlbiB5b3UnZCBsaWtlIHRvIHN0YXJ0XHJcbiAqIHByb2Nlc3NpbmcuXHJcbiAqXHJcbiAqIEBleHBvcnRcclxuICogQGNsYXNzIFRhc2tRdWV1ZVxyXG4gKiBAaW1wbGVtZW50cyB7RXZlbnRlZH1cclxuICovXHJcbkBldmVudGVkXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRhc2tRdWV1ZSBpbXBsZW1lbnRzIEV2ZW50ZWQge1xyXG4gIHB1YmxpYyBhdXRvUHJvY2VzczogYm9vbGVhbjtcclxuXHJcbiAgcHJpdmF0ZSBfbmFtZTogc3RyaW5nO1xyXG4gIHByaXZhdGUgX3BlcmZvcm1lcjogUGVyZm9ybWVyO1xyXG4gIHByaXZhdGUgX2J1Y2tldDogQnVja2V0O1xyXG4gIHByaXZhdGUgX3Rhc2tzOiBUYXNrW107XHJcbiAgcHJpdmF0ZSBfcHJvY2Vzc29yczogVGFza1Byb2Nlc3NvcltdO1xyXG4gIHByaXZhdGUgX2Vycm9yOiBFcnJvcjtcclxuICBwcml2YXRlIF9yZXNvbHV0aW9uOiBQcm9taXNlPHZvaWQ+O1xyXG4gIHByaXZhdGUgX3Jlc29sdmU6IGFueTtcclxuICBwcml2YXRlIF9yZWplY3Q6IGFueTtcclxuICBwcml2YXRlIF9yZWlmaWVkOiBQcm9taXNlPGFueT47XHJcblxyXG4gIC8vIEV2ZW50ZWQgaW50ZXJmYWNlIHN0dWJzXHJcbiAgb246IChldmVudDogVEFTS19RVUVVRV9FVkVOVFMsIGNhbGxiYWNrOiBGdW5jdGlvbiwgYmluZGluZz86IG9iamVjdCkgPT4gdm9pZDtcclxuICBvZmY6IChldmVudDogVEFTS19RVUVVRV9FVkVOVFMsIGNhbGxiYWNrOiBGdW5jdGlvbiwgYmluZGluZz86IG9iamVjdCkgPT4gdm9pZDtcclxuICBvbmU6IChldmVudDogVEFTS19RVUVVRV9FVkVOVFMsIGNhbGxiYWNrOiBGdW5jdGlvbiwgYmluZGluZz86IG9iamVjdCkgPT4gdm9pZDtcclxuICBlbWl0OiAoZXZlbnQ6IFRBU0tfUVVFVUVfRVZFTlRTLCAuLi5hcmdzKSA9PiB2b2lkO1xyXG4gIGxpc3RlbmVyczogKGV2ZW50OiBUQVNLX1FVRVVFX0VWRU5UUykgPT4gYW55W107XHJcblxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgYFRhc2tRdWV1ZWAuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge1BlcmZvcm1lcn0gdGFyZ2V0XHJcbiAgICogQHBhcmFtIHtUYXNrUXVldWVPcHRpb25zfSBbb3B0aW9ucz17fV1cclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBUYXNrUXVldWVcclxuICAgKi9cclxuICBjb25zdHJ1Y3Rvcih0YXJnZXQ6IFBlcmZvcm1lciwgc2V0dGluZ3M6IFRhc2tRdWV1ZVNldHRpbmdzID0ge30pIHtcclxuICAgIGFzc2VydCgnVGFza1F1ZXVlIHJlcXVpcmVzIE9yYml0LlByb21pc2UgdG8gYmUgZGVmaW5lZCcsIE9yYml0LlByb21pc2UpO1xyXG5cclxuICAgIHRoaXMuX3BlcmZvcm1lciA9IHRhcmdldDtcclxuICAgIHRoaXMuX25hbWUgPSBzZXR0aW5ncy5uYW1lO1xyXG4gICAgdGhpcy5fYnVja2V0ID0gc2V0dGluZ3MuYnVja2V0O1xyXG4gICAgdGhpcy5hdXRvUHJvY2VzcyA9IHNldHRpbmdzLmF1dG9Qcm9jZXNzID09PSB1bmRlZmluZWQgPyB0cnVlIDogc2V0dGluZ3MuYXV0b1Byb2Nlc3M7XHJcblxyXG4gICAgaWYgKHRoaXMuX2J1Y2tldCkge1xyXG4gICAgICBhc3NlcnQoJ1Rhc2tRdWV1ZSByZXF1aXJlcyBhIG5hbWUgaWYgaXQgaGFzIGEgYnVja2V0JywgISF0aGlzLl9uYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLl9yZWlmeSgpXHJcbiAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICBpZiAodGhpcy5sZW5ndGggPiAwICYmIHRoaXMuYXV0b1Byb2Nlc3MpIHtcclxuICAgICAgICAgIHRoaXMucHJvY2VzcygpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBOYW1lIHVzZWQgZm9yIHRyYWNraW5nIC8gZGVidWdnaW5nIHRoaXMgcXVldWUuXHJcbiAgICpcclxuICAgKiBAcmVhZG9ubHlcclxuICAgKiBAdHlwZSB7c3RyaW5nfVxyXG4gICAqIEBtZW1iZXJPZiBUYXNrUXVldWVcclxuICAgKi9cclxuICBnZXQgbmFtZSgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMuX25hbWU7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBUaGUgb2JqZWN0IHdoaWNoIHdpbGwgYHBlcmZvcm1gIHRoZSB0YXNrcyBpbiB0aGlzIHF1ZXVlLlxyXG4gICAqXHJcbiAgICogQHJlYWRvbmx5XHJcbiAgICogQHR5cGUge1BlcmZvcm1lcn1cclxuICAgKiBAbWVtYmVyT2YgVGFza1F1ZXVlXHJcbiAgICovXHJcbiAgZ2V0IHBlcmZvcm1lcigpOiBQZXJmb3JtZXIge1xyXG4gICAgcmV0dXJuIHRoaXMuX3BlcmZvcm1lcjtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEEgYnVja2V0IHVzZWQgdG8gcGVyc2lzdCB0aGUgc3RhdGUgb2YgdGhpcyBxdWV1ZS5cclxuICAgKlxyXG4gICAqIEByZWFkb25seVxyXG4gICAqIEB0eXBlIHtCdWNrZXR9XHJcbiAgICogQG1lbWJlck9mIFRhc2tRdWV1ZVxyXG4gICAqL1xyXG4gIGdldCBidWNrZXQoKTogQnVja2V0IHtcclxuICAgIHJldHVybiB0aGlzLl9idWNrZXQ7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBUaGUgbnVtYmVyIG9mIHRhc2tzIGluIHRoZSBxdWV1ZS5cclxuICAgKlxyXG4gICAqIEByZWFkb25seVxyXG4gICAqIEB0eXBlIHtudW1iZXJ9XHJcbiAgICogQG1lbWJlck9mIFRhc2tRdWV1ZVxyXG4gICAqL1xyXG4gIGdldCBsZW5ndGgoKTogbnVtYmVyIHtcclxuICAgIHJldHVybiB0aGlzLl90YXNrcyA/IHRoaXMuX3Rhc2tzLmxlbmd0aCA6IDA7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBUaGUgdGFza3MgaW4gdGhlIHF1ZXVlLlxyXG4gICAqXHJcbiAgICogQHJlYWRvbmx5XHJcbiAgICogQHR5cGUge1Rhc2tbXX1cclxuICAgKiBAbWVtYmVyT2YgVGFza1F1ZXVlXHJcbiAgICovXHJcbiAgZ2V0IGVudHJpZXMoKTogVGFza1tdIHtcclxuICAgIHJldHVybiB0aGlzLl90YXNrcztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFRoZSBjdXJyZW50IHRhc2sgYmVpbmcgcHJvY2Vzc2VkIChpZiBhY3RpdmVseSBwcm9jZXNzaW5nKSwgb3IgdGhlIG5leHRcclxuICAgKiB0YXNrIHRvIGJlIHByb2Nlc3NlZCAoaWYgbm90IGFjdGl2ZWx5IHByb2Nlc3NpbmcpLlxyXG4gICAqXHJcbiAgICogQHJlYWRvbmx5XHJcbiAgICogQHR5cGUge1Rhc2t9XHJcbiAgICogQG1lbWJlck9mIFRhc2tRdWV1ZVxyXG4gICAqL1xyXG4gIGdldCBjdXJyZW50KCk6IFRhc2sge1xyXG4gICAgcmV0dXJuIHRoaXMuX3Rhc2tzICYmIHRoaXMuX3Rhc2tzWzBdO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVGhlIHByb2Nlc3NvciB3cmFwcGVyIHRoYXQgaXMgcHJvY2Vzc2luZyB0aGUgY3VycmVudCB0YXNrIChvciBuZXh0IHRhc2ssXHJcbiAgICogaWYgbm9uZSBhcmUgYmVpbmcgcHJvY2Vzc2VkKS5cclxuICAgKlxyXG4gICAqIEByZWFkb25seVxyXG4gICAqIEB0eXBlIHtUYXNrUHJvY2Vzc29yfVxyXG4gICAqIEBtZW1iZXJPZiBUYXNrUXVldWVcclxuICAgKi9cclxuICBnZXQgY3VycmVudFByb2Nlc3NvcigpOiBUYXNrUHJvY2Vzc29yIHtcclxuICAgIHJldHVybiB0aGlzLl9wcm9jZXNzb3JzICYmIHRoaXMuX3Byb2Nlc3NvcnNbMF07XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBJZiBhbiBlcnJvciBvY2N1cnMgd2hpbGUgcHJvY2Vzc2luZyBhIHRhc2ssIHByb2Nlc3Npbmcgd2lsbCBiZSBoYWx0ZWQsIHRoZVxyXG4gICAqIGBmYWlsYCBldmVudCB3aWxsIGJlIGVtaXR0ZWQsIGFuZCB0aGlzIHByb3BlcnR5IHdpbGwgcmVmbGVjdCB0aGUgZXJyb3JcclxuICAgKiBlbmNvdW50ZXJlZC5cclxuICAgKlxyXG4gICAqIEByZWFkb25seVxyXG4gICAqIEB0eXBlIHtFcnJvcn1cclxuICAgKiBAbWVtYmVyT2YgVGFza1F1ZXVlXHJcbiAgICovXHJcbiAgZ2V0IGVycm9yKCk6IEVycm9yIHtcclxuICAgIHJldHVybiB0aGlzLl9lcnJvcjtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIElzIHRoZSBxdWV1ZSBlbXB0eT9cclxuICAgKlxyXG4gICAqIEByZWFkb25seVxyXG4gICAqIEB0eXBlIHtib29sZWFufVxyXG4gICAqIEBtZW1iZXJPZiBUYXNrUXVldWVcclxuICAgKi9cclxuICBnZXQgZW1wdHkoKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5sZW5ndGggPT09IDA7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBJcyB0aGUgcXVldWUgYWN0aXZlbHkgcHJvY2Vzc2luZyBhIHRhc2s/XHJcbiAgICpcclxuICAgKiBAcmVhZG9ubHlcclxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cclxuICAgKiBAbWVtYmVyT2YgVGFza1F1ZXVlXHJcbiAgICovXHJcbiAgZ2V0IHByb2Nlc3NpbmcoKTogYm9vbGVhbiB7XHJcbiAgICBjb25zdCBwcm9jZXNzb3IgPSB0aGlzLmN1cnJlbnRQcm9jZXNzb3I7XHJcblxyXG4gICAgcmV0dXJuIHByb2Nlc3NvciAhPT0gdW5kZWZpbmVkICYmXHJcbiAgICAgICAgICAgcHJvY2Vzc29yLnN0YXJ0ZWQgJiZcclxuICAgICAgICAgICAhcHJvY2Vzc29yLnNldHRsZWQ7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXNvbHZlcyB3aGVuIHRoZSBxdWV1ZSBoYXMgYmVlbiBmdWxseSByZWlmaWVkIGZyb20gaXRzIGFzc29jaWF0ZWQgYnVja2V0LFxyXG4gICAqIGlmIGFwcGxpY2FibGUuXHJcbiAgICpcclxuICAgKiBAcmVhZG9ubHlcclxuICAgKiBAdHlwZSB7UHJvbWlzZTx2b2lkPn1cclxuICAgKiBAbWVtYmVyT2YgVGFza1F1ZXVlXHJcbiAgICovXHJcbiAgZ2V0IHJlaWZpZWQoKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICByZXR1cm4gdGhpcy5fcmVpZmllZDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFB1c2ggYSBuZXcgdGFzayBvbnRvIHRoZSBlbmQgb2YgdGhlIHF1ZXVlLlxyXG4gICAqXHJcbiAgICogSWYgYGF1dG9Qcm9jZXNzYCBpcyBlbmFibGVkLCB0aGlzIHdpbGwgYXV0b21hdGljYWxseSB0cmlnZ2VyIHByb2Nlc3Npbmcgb2ZcclxuICAgKiB0aGUgcXVldWUuXHJcbiAgICpcclxuICAgKiBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdoZW4gdGhlIHB1c2hlZCB0YXNrIGhhcyBiZWVuIHByb2Nlc3NlZC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7VGFza30gdGFza1xyXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPHZvaWQ+fVxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIFRhc2tRdWV1ZVxyXG4gICAqL1xyXG4gIHB1c2godGFzazogVGFzayk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgbGV0IHByb2Nlc3NvciA9IG5ldyBUYXNrUHJvY2Vzc29yKHRoaXMuX3BlcmZvcm1lciwgdGFzayk7XHJcbiAgICByZXR1cm4gdGhpcy5fcmVpZmllZFxyXG4gICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5fdGFza3MucHVzaCh0YXNrKTtcclxuICAgICAgICB0aGlzLl9wcm9jZXNzb3JzLnB1c2gocHJvY2Vzc29yKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcGVyc2lzdCgpO1xyXG4gICAgICB9KVxyXG4gICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMuYXV0b1Byb2Nlc3MpIHtcclxuICAgICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3MoKVxyXG4gICAgICAgICAgICAudGhlbigoKSA9PiBwcm9jZXNzb3Iuc2V0dGxlKCkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXR1cm4gcHJvY2Vzc29yLnNldHRsZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDYW5jZWxzIGFuZCByZS10cmllcyBwcm9jZXNzaW5nIHRoZSBjdXJyZW50IHRhc2suXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkPn1cclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBUYXNrUXVldWVcclxuICAgKi9cclxuICByZXRyeSgpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHJldHVybiB0aGlzLl9yZWlmaWVkXHJcbiAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICB0aGlzLl9jYW5jZWwoKTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRQcm9jZXNzb3IucmVzZXQoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcGVyc2lzdCgpO1xyXG4gICAgICB9KVxyXG4gICAgICAudGhlbigoKSA9PiB0aGlzLnByb2Nlc3MoKSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDYW5jZWxzIGFuZCBkaXNjYXJkcyB0aGUgY3VycmVudCB0YXNrIGFuZCBwcm9jZWVkcyB0byBwcm9jZXNzIHRoZSBuZXh0XHJcbiAgICogdGFzay5cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPHZvaWQ+fVxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIFRhc2tRdWV1ZVxyXG4gICAqL1xyXG4gIHNraXAoKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICByZXR1cm4gdGhpcy5fcmVpZmllZFxyXG4gICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5fY2FuY2VsKCk7XHJcbiAgICAgICAgdGhpcy5fdGFza3Muc2hpZnQoKTtcclxuICAgICAgICB0aGlzLl9wcm9jZXNzb3JzLnNoaWZ0KCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BlcnNpc3QoKTtcclxuICAgICAgfSlcclxuICAgICAgLnRoZW4oKCkgPT4gdGhpcy5wcm9jZXNzKCkpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ2FuY2VscyB0aGUgY3VycmVudCB0YXNrIGFuZCBjb21wbGV0ZWx5IGNsZWFycyB0aGUgcXVldWUuXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkPn1cclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBUYXNrUXVldWVcclxuICAgKi9cclxuICBjbGVhcigpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHJldHVybiB0aGlzLl9yZWlmaWVkXHJcbiAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICB0aGlzLl9jYW5jZWwoKTtcclxuICAgICAgICB0aGlzLl90YXNrcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuX3Byb2Nlc3NvcnMgPSBbXTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcGVyc2lzdCgpO1xyXG4gICAgICB9KVxyXG4gICAgICAudGhlbigoKSA9PiB0aGlzLnByb2Nlc3MoKSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDYW5jZWxzIHRoZSBjdXJyZW50IHRhc2sgYW5kIHJlbW92ZXMgaXQsIGJ1dCBkb2VzIG5vdCBjb250aW51ZSBwcm9jZXNzaW5nLlxyXG4gICAqXHJcbiAgICogQHJldHVybnMge1Byb21pc2U8VGFzaz59XHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgVGFza1F1ZXVlXHJcbiAgICovXHJcbiAgc2hpZnQoKTogUHJvbWlzZTxUYXNrPiB7XHJcbiAgICBsZXQgdGFzazogVGFzaztcclxuXHJcbiAgICByZXR1cm4gdGhpcy5fcmVpZmllZFxyXG4gICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5fY2FuY2VsKCk7XHJcbiAgICAgICAgdGFzayA9IHRoaXMuX3Rhc2tzLnNoaWZ0KCk7XHJcbiAgICAgICAgdGhpcy5fcHJvY2Vzc29ycy5zaGlmdCgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9wZXJzaXN0KCk7XHJcbiAgICAgIH0pXHJcbiAgICAgIC50aGVuKCgpID0+IHRhc2spO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ2FuY2VscyBwcm9jZXNzaW5nIHRoZSBjdXJyZW50IHRhc2sgYW5kIGluc2VydHMgYSBuZXcgdGFzayBhdCB0aGUgYmVnaW5uaW5nXHJcbiAgICogb2YgdGhlIHF1ZXVlLiBUaGlzIG5ldyB0YXNrIHdpbGwgYmUgcHJvY2Vzc2VkIG5leHQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge1Rhc2t9IHRhc2tcclxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkPn1cclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBUYXNrUXVldWVcclxuICAgKi9cclxuICB1bnNoaWZ0KHRhc2s6IFRhc2spOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHJldHVybiB0aGlzLl9yZWlmaWVkXHJcbiAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICB0aGlzLl9jYW5jZWwoKTtcclxuICAgICAgICB0aGlzLl90YXNrcy51bnNoaWZ0KHRhc2spO1xyXG4gICAgICAgIHRoaXMuX3Byb2Nlc3NvcnMudW5zaGlmdChuZXcgVGFza1Byb2Nlc3Nvcih0aGlzLl9wZXJmb3JtZXIsIHRhc2spKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcGVyc2lzdCgpO1xyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFByb2Nlc3NlcyBhbGwgdGhlIHRhc2tzIGluIHRoZSBxdWV1ZS4gUmVzb2x2ZXMgd2hlbiB0aGUgcXVldWUgaXMgZW1wdHkuXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxhbnk+fVxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIFRhc2tRdWV1ZVxyXG4gICAqL1xyXG4gIHByb2Nlc3MoKTogUHJvbWlzZTxhbnk+IHtcclxuICAgIHJldHVybiB0aGlzLl9yZWlmaWVkXHJcbiAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICBsZXQgcmVzb2x1dGlvbiA9IHRoaXMuX3Jlc29sdXRpb247XHJcblxyXG4gICAgICAgIGlmICghcmVzb2x1dGlvbikge1xyXG4gICAgICAgICAgaWYgKHRoaXMuX3Rhc2tzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICByZXNvbHV0aW9uID0gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvbXBsZXRlKCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9lcnJvciA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuX3Jlc29sdXRpb24gPSByZXNvbHV0aW9uID0gbmV3IE9yYml0LlByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgIHRoaXMuX3Jlc29sdmUgPSByZXNvbHZlO1xyXG4gICAgICAgICAgICAgIHRoaXMuX3JlamVjdCA9IHJlamVjdDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3NldHRsZUVhY2gocmVzb2x1dGlvbik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcmVzb2x1dGlvbjtcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIF9jb21wbGV0ZSgpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLl9yZXNvbHZlKSB7XHJcbiAgICAgIHRoaXMuX3Jlc29sdmUoKTtcclxuICAgIH1cclxuICAgIHRoaXMuX3Jlc29sdmUgPSBudWxsO1xyXG4gICAgdGhpcy5fcmVqZWN0ID0gbnVsbDtcclxuICAgIHRoaXMuX2Vycm9yID0gbnVsbDtcclxuICAgIHRoaXMuX3Jlc29sdXRpb24gPSBudWxsO1xyXG4gICAgdGhpcy5lbWl0KCdjb21wbGV0ZScpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBfZmFpbCh0YXNrLCBlKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5fcmVqZWN0KSB7XHJcbiAgICAgIHRoaXMuX3JlamVjdChlKTtcclxuICAgIH1cclxuICAgIHRoaXMuX3Jlc29sdmUgPSBudWxsO1xyXG4gICAgdGhpcy5fcmVqZWN0ID0gbnVsbDtcclxuICAgIHRoaXMuX2Vycm9yID0gZTtcclxuICAgIHRoaXMuX3Jlc29sdXRpb24gPSBudWxsO1xyXG4gICAgdGhpcy5lbWl0KCdmYWlsJywgdGFzaywgZSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIF9jYW5jZWwoKTogdm9pZCB7XHJcbiAgICB0aGlzLl9lcnJvciA9IG51bGw7XHJcbiAgICB0aGlzLl9yZXNvbHV0aW9uID0gbnVsbDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgX3NldHRsZUVhY2gocmVzb2x1dGlvbik6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMuX3Rhc2tzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICB0aGlzLl9jb21wbGV0ZSgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbGV0IHRhc2sgPSB0aGlzLl90YXNrc1swXTtcclxuICAgICAgbGV0IHByb2Nlc3NvciA9IHRoaXMuX3Byb2Nlc3NvcnNbMF07XHJcblxyXG4gICAgICB0aGlzLmVtaXQoJ2JlZm9yZVRhc2snLCB0YXNrKTtcclxuXHJcbiAgICAgIHByb2Nlc3Nvci5wcm9jZXNzKClcclxuICAgICAgICAudGhlbigocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICBpZiAocmVzb2x1dGlvbiA9PT0gdGhpcy5fcmVzb2x1dGlvbikge1xyXG4gICAgICAgICAgICB0aGlzLl90YXNrcy5zaGlmdCgpO1xyXG4gICAgICAgICAgICB0aGlzLl9wcm9jZXNzb3JzLnNoaWZ0KCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9wZXJzaXN0KClcclxuICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ3Rhc2snLCB0YXNrKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NldHRsZUVhY2gocmVzb2x1dGlvbik7XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goKGUpID0+IHtcclxuICAgICAgICAgIGlmIChyZXNvbHV0aW9uID09PSB0aGlzLl9yZXNvbHV0aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZhaWwodGFzaywgZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIF9yZWlmeSgpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHRoaXMuX3Rhc2tzID0gW107XHJcbiAgICB0aGlzLl9wcm9jZXNzb3JzID0gW107XHJcblxyXG4gICAgaWYgKHRoaXMuX2J1Y2tldCkge1xyXG4gICAgICB0aGlzLl9yZWlmaWVkID0gdGhpcy5fYnVja2V0LmdldEl0ZW0odGhpcy5fbmFtZSlcclxuICAgICAgICAudGhlbih0YXNrcyA9PiB7XHJcbiAgICAgICAgICBpZiAodGFza3MpIHtcclxuICAgICAgICAgICAgdGhpcy5fdGFza3MgPSB0YXNrcztcclxuICAgICAgICAgICAgdGhpcy5fcHJvY2Vzc29ycyA9IHRhc2tzLm1hcCh0YXNrID0+IG5ldyBUYXNrUHJvY2Vzc29yKHRoaXMuX3BlcmZvcm1lciwgdGFzaykpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5fcmVpZmllZCA9IE9yYml0LlByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLl9yZWlmaWVkO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBfcGVyc2lzdCgpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHRoaXMuZW1pdCgnY2hhbmdlJyk7XHJcbiAgICBpZiAodGhpcy5fYnVja2V0KSB7XHJcbiAgICAgIHJldHVybiB0aGlzLl9idWNrZXQuc2V0SXRlbSh0aGlzLl9uYW1lLCB0aGlzLl90YXNrcyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdfQ==