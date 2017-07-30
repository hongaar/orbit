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
var TaskQueue = function () {
    /**
     * Creates an instance of `TaskQueue`.
     *
     * @param {Performer} target
     * @param {TaskQueueOptions} [options={}]
     *
     * @memberOf TaskQueue
     */
    function TaskQueue(target, settings) {
        if (settings === void 0) {
            settings = {};
        }
        var _this = this;
        utils_1.assert('TaskQueue requires Orbit.Promise to be defined', main_1.default.Promise);
        this._performer = target;
        this._name = settings.name;
        this._bucket = settings.bucket;
        this.autoProcess = settings.autoProcess === undefined ? true : settings.autoProcess;
        if (this._bucket) {
            utils_1.assert('TaskQueue requires a name if it has a bucket', !!this._name);
        }
        this._reify().then(function () {
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
            return processor !== undefined && processor.started && !processor.settled;
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
        return this._reified.then(function () {
            _this._tasks.push(task);
            _this._processors.push(processor);
            return _this._persist();
        }).then(function () {
            if (_this.autoProcess) {
                return _this.process().then(function () {
                    return processor.settle();
                });
            } else {
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
        return this._reified.then(function () {
            _this._cancel();
            _this.currentProcessor.reset();
            return _this._persist();
        }).then(function () {
            return _this.process();
        });
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
        return this._reified.then(function () {
            _this._cancel();
            _this._tasks.shift();
            _this._processors.shift();
            return _this._persist();
        }).then(function () {
            return _this.process();
        });
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
        return this._reified.then(function () {
            _this._cancel();
            _this._tasks = [];
            _this._processors = [];
            return _this._persist();
        }).then(function () {
            return _this.process();
        });
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
        return this._reified.then(function () {
            _this._cancel();
            task = _this._tasks.shift();
            _this._processors.shift();
            return _this._persist();
        }).then(function () {
            return task;
        });
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
        return this._reified.then(function () {
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
        return this._reified.then(function () {
            var resolution = _this._resolution;
            if (!resolution) {
                if (_this._tasks.length === 0) {
                    resolution = main_1.default.Promise.resolve();
                    _this._complete();
                } else {
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
        } else {
            var task_1 = this._tasks[0];
            var processor = this._processors[0];
            this.emit('beforeTask', task_1);
            processor.process().then(function (result) {
                if (resolution === _this._resolution) {
                    _this._tasks.shift();
                    _this._processors.shift();
                    _this._persist().then(function () {
                        _this.emit('task', task_1);
                        _this._settleEach(resolution);
                    });
                }
            }).catch(function (e) {
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
            this._reified = this._bucket.getItem(this._name).then(function (tasks) {
                if (tasks) {
                    _this._tasks = tasks;
                    _this._processors = tasks.map(function (task) {
                        return new task_processor_1.default(_this._performer, task);
                    });
                }
            });
        } else {
            this._reified = main_1.default.Promise.resolve();
        }
        return this._reified;
    };
    TaskQueue.prototype._persist = function () {
        this.emit('change');
        if (this._bucket) {
            return this._bucket.setItem(this._name, this._tasks);
        } else {
            return main_1.default.Promise.resolve();
        }
    };
    TaskQueue = __decorate([evented_1.default], TaskQueue);
    return TaskQueue;
}();
exports.default = TaskQueue;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFzay1xdWV1ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNyYy90YXNrLXF1ZXVlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEscUJBQTJCO0FBRTNCLCtCQUE2QztBQUU3Qyx3QkFBNkM7QUFDN0Msc0JBQXNDO0FBc0N0QyxBQWVHOzs7Ozs7Ozs7Ozs7Ozs7O0FBRUg7QUFxQkUsQUFPRzs7Ozs7Ozs7QUFDSCx1QkFBWSxBQUFpQixRQUFFLEFBQWdDO0FBQWhDLGlDQUFBO0FBQUEsdUJBQWdDOztBQUEvRCxvQkFrQkM7QUFqQkMsZ0JBQU0sT0FBQyxBQUFnRCxrREFBRSxPQUFLLFFBQUMsQUFBTyxBQUFDLEFBQUM7QUFFeEUsQUFBSSxhQUFDLEFBQVUsYUFBRyxBQUFNLEFBQUM7QUFDekIsQUFBSSxhQUFDLEFBQUssUUFBRyxBQUFRLFNBQUMsQUFBSSxBQUFDO0FBQzNCLEFBQUksYUFBQyxBQUFPLFVBQUcsQUFBUSxTQUFDLEFBQU0sQUFBQztBQUMvQixBQUFJLGFBQUMsQUFBVyxjQUFHLEFBQVEsU0FBQyxBQUFXLGdCQUFLLEFBQVMsWUFBRyxBQUFJLE9BQUcsQUFBUSxTQUFDLEFBQVcsQUFBQztBQUVwRixBQUFFLEFBQUMsWUFBQyxBQUFJLEtBQUMsQUFBTyxBQUFDLFNBQUMsQUFBQztBQUNqQixvQkFBTSxPQUFDLEFBQThDLGdEQUFFLENBQUMsQ0FBQyxBQUFJLEtBQUMsQUFBSyxBQUFDLEFBQUMsQUFDdkU7QUFBQztBQUVELEFBQUksYUFBQyxBQUFNLEFBQUUsU0FDVixBQUFJLEtBQUM7QUFDSixBQUFFLEFBQUMsZ0JBQUMsQUFBSSxNQUFDLEFBQU0sU0FBRyxBQUFDLEtBQUksQUFBSSxNQUFDLEFBQVcsQUFBQyxhQUFDLEFBQUM7QUFDeEMsQUFBSSxzQkFBQyxBQUFPLEFBQUUsQUFBQyxBQUNqQjtBQUFDLEFBQ0g7QUFBQyxBQUFDLEFBQUMsQUFDUDtBQUFDO0FBU0QsMEJBQUkscUJBQUk7QUFQUixBQU1H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bUMsQUFBSSxBQUFDO0FBQUEsQUFBQyxBQUFDLEFBQ2pGLHFCQURxQixBQUFLO0FBQ3pCLEFBQ0g7QUFBQyxBQUFDLEFBQUMsQUFDUCxhQVBrQixBQUFJO0FBT3JCLEFBQUMsQUFBSSxlQUFDLEFBQUM7QUFDTixBQUFJLGlCQUFDLEFBQVEsV0FBRyxPQUFLLFFBQUMsQUFBTyxRQUFDLEFBQU8sQUFBRSxBQUFDLEFBQzFDO0FBQUM7QUFFRCxBQUFNLGVBQUMsQUFBSSxLQUFDLEFBQVEsQUFBQyxBQUN2QjtBQUFDO0FBRU8sd0JBQVEsV0FBaEI7QUFDRSxBQUFJLGFBQUMsQUFBSSxLQUFDLEFBQVEsQUFBQyxBQUFDO0FBQ3BCLEFBQUUsQUFBQyxZQUFDLEFBQUksS0FBQyxBQUFPLEFBQUMsU0FBQyxBQUFDO0FBQ2pCLEFBQU0sbUJBQUMsQUFBSSxLQUFDLEFBQU8sUUFBQyxBQUFPLFFBQUMsQUFBSSxLQUFDLEFBQUssT0FBRSxBQUFJLEtBQUMsQUFBTSxBQUFDLEFBQUMsQUFDdkQ7QUFBQyxBQUFDLEFBQUksZUFBQyxBQUFDO0FBQ04sQUFBTSxtQkFBQyxPQUFLLFFBQUMsQUFBTyxRQUFDLEFBQU8sQUFBRSxBQUFDLEFBQ2pDO0FBQUMsQUFDSDtBQUFDO0FBaGFrQixBQUFTLDRCQUQ3QixVQUFPLFVBQ2EsQUFBUyxBQWlhN0I7QUFBRCxXQUFDO0FBamFELEFBaWFDO2tCQWphb0IsQUFBUyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBPcmJpdCBmcm9tICcuL21haW4nO1xyXG5pbXBvcnQgeyBUYXNrLCBQZXJmb3JtZXIgfSBmcm9tICcuL3Rhc2snO1xyXG5pbXBvcnQgVGFza1Byb2Nlc3NvciBmcm9tICcuL3Rhc2stcHJvY2Vzc29yJztcclxuaW1wb3J0IHsgQnVja2V0IH0gZnJvbSAnLi9idWNrZXQnO1xyXG5pbXBvcnQgZXZlbnRlZCwgeyBFdmVudGVkIH0gZnJvbSAnLi9ldmVudGVkJztcclxuaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSAnQG9yYml0L3V0aWxzJztcclxuXHJcbi8qKlxyXG4gKiBTZXR0aW5ncyBmb3IgYSBgVGFza1F1ZXVlYC5cclxuICpcclxuICogQGV4cG9ydFxyXG4gKiBAaW50ZXJmYWNlIFRhc2tRdWV1ZVNldHRpbmdzXHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIFRhc2tRdWV1ZVNldHRpbmdzIHtcclxuICAvKipcclxuICAgKiBOYW1lIHVzZWQgZm9yIHRyYWNraW5nIGFuZCBkZWJ1Z2dpbmcgYSB0YXNrIHF1ZXVlLlxyXG4gICAqXHJcbiAgICogQHR5cGUge3N0cmluZ31cclxuICAgKiBAbWVtYmVyT2YgVGFza1F1ZXVlU2V0dGluZ3NcclxuICAgKi9cclxuICBuYW1lPzogc3RyaW5nO1xyXG5cclxuICAvKipcclxuICAgKiBBIGJ1Y2tldCBpbiB3aGljaCB0byBwZXJzaXN0IHF1ZXVlIHN0YXRlLlxyXG4gICAqXHJcbiAgICogQHR5cGUge0J1Y2tldH1cclxuICAgKiBAbWVtYmVyT2YgVGFza1F1ZXVlU2V0dGluZ3NcclxuICAgKi9cclxuICBidWNrZXQ/OiBCdWNrZXQ7XHJcblxyXG4gIC8qKlxyXG4gICAqIEEgZmxhZyBpbmRpY2F0aW5nIHdoZXRoZXIgdGFza3Mgc2hvdWxkIGJlIHByb2Nlc3NlZCBhcyBzb29uIGFzIHRoZXkgYXJlXHJcbiAgICogcHVzaGVkIGludG8gYSBxdWV1ZS4gU2V0IHRvIGBmYWxzZWAgdG8gb3ZlcnJpZGUgdGhlIGRlZmF1bHQgYHRydWVgXHJcbiAgICogYmVoYXZpb3IuXHJcbiAgICpcclxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cclxuICAgKiBAbWVtYmVyT2YgVGFza1F1ZXVlU2V0dGluZ3NcclxuICAgKi9cclxuICBhdXRvUHJvY2Vzcz86IGJvb2xlYW47XHJcbn1cclxuXHJcbmV4cG9ydCB0eXBlIFRBU0tfUVVFVUVfRVZFTlRTID0gJ2NvbXBsZXRlJyB8ICdmYWlsJyB8ICdiZWZvcmVUYXNrJyB8ICd0YXNrJyB8ICdjaGFuZ2UnO1xyXG5cclxuLyoqXHJcbiAqIGBUYXNrUXVldWVgIGlzIGEgRklGTyBxdWV1ZSBvZiBhc3luY2hyb25vdXMgdGFza3MgdGhhdCBzaG91bGQgYmVcclxuICogcGVyZm9ybWVkIHNlcXVlbnRpYWxseS5cclxuICpcclxuICogVGFza3MgYXJlIGFkZGVkIHRvIHRoZSBxdWV1ZSB3aXRoIGBwdXNoYC4gRWFjaCB0YXNrIHdpbGwgYmUgcHJvY2Vzc2VkIGJ5XHJcbiAqIGNhbGxpbmcgaXRzIGBwcm9jZXNzYCBtZXRob2QuXHJcbiAqXHJcbiAqIEJ5IGRlZmF1bHQsIHRhc2sgcXVldWVzIHdpbGwgYmUgcHJvY2Vzc2VkIGF1dG9tYXRpY2FsbHksIGFzIHNvb24gYXMgdGFza3NcclxuICogYXJlIHB1c2hlZCB0byB0aGVtLiBUaGlzIGNhbiBiZSBvdmVycmlkZGVuIGJ5IHNldHRpbmcgdGhlIGBhdXRvUHJvY2Vzc2BcclxuICogc2V0dGluZyB0byBgZmFsc2VgIGFuZCBjYWxsaW5nIGBwcm9jZXNzYCB3aGVuIHlvdSdkIGxpa2UgdG8gc3RhcnRcclxuICogcHJvY2Vzc2luZy5cclxuICpcclxuICogQGV4cG9ydFxyXG4gKiBAY2xhc3MgVGFza1F1ZXVlXHJcbiAqIEBpbXBsZW1lbnRzIHtFdmVudGVkfVxyXG4gKi9cclxuQGV2ZW50ZWRcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGFza1F1ZXVlIGltcGxlbWVudHMgRXZlbnRlZCB7XHJcbiAgcHVibGljIGF1dG9Qcm9jZXNzOiBib29sZWFuO1xyXG5cclxuICBwcml2YXRlIF9uYW1lOiBzdHJpbmc7XHJcbiAgcHJpdmF0ZSBfcGVyZm9ybWVyOiBQZXJmb3JtZXI7XHJcbiAgcHJpdmF0ZSBfYnVja2V0OiBCdWNrZXQ7XHJcbiAgcHJpdmF0ZSBfdGFza3M6IFRhc2tbXTtcclxuICBwcml2YXRlIF9wcm9jZXNzb3JzOiBUYXNrUHJvY2Vzc29yW107XHJcbiAgcHJpdmF0ZSBfZXJyb3I6IEVycm9yO1xyXG4gIHByaXZhdGUgX3Jlc29sdXRpb246IFByb21pc2U8dm9pZD47XHJcbiAgcHJpdmF0ZSBfcmVzb2x2ZTogYW55O1xyXG4gIHByaXZhdGUgX3JlamVjdDogYW55O1xyXG4gIHByaXZhdGUgX3JlaWZpZWQ6IFByb21pc2U8YW55PjtcclxuXHJcbiAgLy8gRXZlbnRlZCBpbnRlcmZhY2Ugc3R1YnNcclxuICBvbjogKGV2ZW50OiBUQVNLX1FVRVVFX0VWRU5UUywgY2FsbGJhY2s6IEZ1bmN0aW9uLCBiaW5kaW5nPzogb2JqZWN0KSA9PiB2b2lkO1xyXG4gIG9mZjogKGV2ZW50OiBUQVNLX1FVRVVFX0VWRU5UUywgY2FsbGJhY2s6IEZ1bmN0aW9uLCBiaW5kaW5nPzogb2JqZWN0KSA9PiB2b2lkO1xyXG4gIG9uZTogKGV2ZW50OiBUQVNLX1FVRVVFX0VWRU5UUywgY2FsbGJhY2s6IEZ1bmN0aW9uLCBiaW5kaW5nPzogb2JqZWN0KSA9PiB2b2lkO1xyXG4gIGVtaXQ6IChldmVudDogVEFTS19RVUVVRV9FVkVOVFMsIC4uLmFyZ3MpID0+IHZvaWQ7XHJcbiAgbGlzdGVuZXJzOiAoZXZlbnQ6IFRBU0tfUVVFVUVfRVZFTlRTKSA9PiBhbnlbXTtcclxuXHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiBgVGFza1F1ZXVlYC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7UGVyZm9ybWVyfSB0YXJnZXRcclxuICAgKiBAcGFyYW0ge1Rhc2tRdWV1ZU9wdGlvbnN9IFtvcHRpb25zPXt9XVxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIFRhc2tRdWV1ZVxyXG4gICAqL1xyXG4gIGNvbnN0cnVjdG9yKHRhcmdldDogUGVyZm9ybWVyLCBzZXR0aW5nczogVGFza1F1ZXVlU2V0dGluZ3MgPSB7fSkge1xyXG4gICAgYXNzZXJ0KCdUYXNrUXVldWUgcmVxdWlyZXMgT3JiaXQuUHJvbWlzZSB0byBiZSBkZWZpbmVkJywgT3JiaXQuUHJvbWlzZSk7XHJcblxyXG4gICAgdGhpcy5fcGVyZm9ybWVyID0gdGFyZ2V0O1xyXG4gICAgdGhpcy5fbmFtZSA9IHNldHRpbmdzLm5hbWU7XHJcbiAgICB0aGlzLl9idWNrZXQgPSBzZXR0aW5ncy5idWNrZXQ7XHJcbiAgICB0aGlzLmF1dG9Qcm9jZXNzID0gc2V0dGluZ3MuYXV0b1Byb2Nlc3MgPT09IHVuZGVmaW5lZCA/IHRydWUgOiBzZXR0aW5ncy5hdXRvUHJvY2VzcztcclxuXHJcbiAgICBpZiAodGhpcy5fYnVja2V0KSB7XHJcbiAgICAgIGFzc2VydCgnVGFza1F1ZXVlIHJlcXVpcmVzIGEgbmFtZSBpZiBpdCBoYXMgYSBidWNrZXQnLCAhIXRoaXMuX25hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuX3JlaWZ5KClcclxuICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLmxlbmd0aCA+IDAgJiYgdGhpcy5hdXRvUHJvY2Vzcykge1xyXG4gICAgICAgICAgdGhpcy5wcm9jZXNzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE5hbWUgdXNlZCBmb3IgdHJhY2tpbmcgLyBkZWJ1Z2dpbmcgdGhpcyBxdWV1ZS5cclxuICAgKlxyXG4gICAqIEByZWFkb25seVxyXG4gICAqIEB0eXBlIHtzdHJpbmd9XHJcbiAgICogQG1lbWJlck9mIFRhc2tRdWV1ZVxyXG4gICAqL1xyXG4gIGdldCBuYW1lKCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5fbmFtZTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFRoZSBvYmplY3Qgd2hpY2ggd2lsbCBgcGVyZm9ybWAgdGhlIHRhc2tzIGluIHRoaXMgcXVldWUuXHJcbiAgICpcclxuICAgKiBAcmVhZG9ubHlcclxuICAgKiBAdHlwZSB7UGVyZm9ybWVyfVxyXG4gICAqIEBtZW1iZXJPZiBUYXNrUXVldWVcclxuICAgKi9cclxuICBnZXQgcGVyZm9ybWVyKCk6IFBlcmZvcm1lciB7XHJcbiAgICByZXR1cm4gdGhpcy5fcGVyZm9ybWVyO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQSBidWNrZXQgdXNlZCB0byBwZXJzaXN0IHRoZSBzdGF0ZSBvZiB0aGlzIHF1ZXVlLlxyXG4gICAqXHJcbiAgICogQHJlYWRvbmx5XHJcbiAgICogQHR5cGUge0J1Y2tldH1cclxuICAgKiBAbWVtYmVyT2YgVGFza1F1ZXVlXHJcbiAgICovXHJcbiAgZ2V0IGJ1Y2tldCgpOiBCdWNrZXQge1xyXG4gICAgcmV0dXJuIHRoaXMuX2J1Y2tldDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFRoZSBudW1iZXIgb2YgdGFza3MgaW4gdGhlIHF1ZXVlLlxyXG4gICAqXHJcbiAgICogQHJlYWRvbmx5XHJcbiAgICogQHR5cGUge251bWJlcn1cclxuICAgKiBAbWVtYmVyT2YgVGFza1F1ZXVlXHJcbiAgICovXHJcbiAgZ2V0IGxlbmd0aCgpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIHRoaXMuX3Rhc2tzID8gdGhpcy5fdGFza3MubGVuZ3RoIDogMDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFRoZSB0YXNrcyBpbiB0aGUgcXVldWUuXHJcbiAgICpcclxuICAgKiBAcmVhZG9ubHlcclxuICAgKiBAdHlwZSB7VGFza1tdfVxyXG4gICAqIEBtZW1iZXJPZiBUYXNrUXVldWVcclxuICAgKi9cclxuICBnZXQgZW50cmllcygpOiBUYXNrW10ge1xyXG4gICAgcmV0dXJuIHRoaXMuX3Rhc2tzO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVGhlIGN1cnJlbnQgdGFzayBiZWluZyBwcm9jZXNzZWQgKGlmIGFjdGl2ZWx5IHByb2Nlc3NpbmcpLCBvciB0aGUgbmV4dFxyXG4gICAqIHRhc2sgdG8gYmUgcHJvY2Vzc2VkIChpZiBub3QgYWN0aXZlbHkgcHJvY2Vzc2luZykuXHJcbiAgICpcclxuICAgKiBAcmVhZG9ubHlcclxuICAgKiBAdHlwZSB7VGFza31cclxuICAgKiBAbWVtYmVyT2YgVGFza1F1ZXVlXHJcbiAgICovXHJcbiAgZ2V0IGN1cnJlbnQoKTogVGFzayB7XHJcbiAgICByZXR1cm4gdGhpcy5fdGFza3MgJiYgdGhpcy5fdGFza3NbMF07XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBUaGUgcHJvY2Vzc29yIHdyYXBwZXIgdGhhdCBpcyBwcm9jZXNzaW5nIHRoZSBjdXJyZW50IHRhc2sgKG9yIG5leHQgdGFzayxcclxuICAgKiBpZiBub25lIGFyZSBiZWluZyBwcm9jZXNzZWQpLlxyXG4gICAqXHJcbiAgICogQHJlYWRvbmx5XHJcbiAgICogQHR5cGUge1Rhc2tQcm9jZXNzb3J9XHJcbiAgICogQG1lbWJlck9mIFRhc2tRdWV1ZVxyXG4gICAqL1xyXG4gIGdldCBjdXJyZW50UHJvY2Vzc29yKCk6IFRhc2tQcm9jZXNzb3Ige1xyXG4gICAgcmV0dXJuIHRoaXMuX3Byb2Nlc3NvcnMgJiYgdGhpcy5fcHJvY2Vzc29yc1swXTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIElmIGFuIGVycm9yIG9jY3VycyB3aGlsZSBwcm9jZXNzaW5nIGEgdGFzaywgcHJvY2Vzc2luZyB3aWxsIGJlIGhhbHRlZCwgdGhlXHJcbiAgICogYGZhaWxgIGV2ZW50IHdpbGwgYmUgZW1pdHRlZCwgYW5kIHRoaXMgcHJvcGVydHkgd2lsbCByZWZsZWN0IHRoZSBlcnJvclxyXG4gICAqIGVuY291bnRlcmVkLlxyXG4gICAqXHJcbiAgICogQHJlYWRvbmx5XHJcbiAgICogQHR5cGUge0Vycm9yfVxyXG4gICAqIEBtZW1iZXJPZiBUYXNrUXVldWVcclxuICAgKi9cclxuICBnZXQgZXJyb3IoKTogRXJyb3Ige1xyXG4gICAgcmV0dXJuIHRoaXMuX2Vycm9yO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogSXMgdGhlIHF1ZXVlIGVtcHR5P1xyXG4gICAqXHJcbiAgICogQHJlYWRvbmx5XHJcbiAgICogQHR5cGUge2Jvb2xlYW59XHJcbiAgICogQG1lbWJlck9mIFRhc2tRdWV1ZVxyXG4gICAqL1xyXG4gIGdldCBlbXB0eSgpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLmxlbmd0aCA9PT0gMDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIElzIHRoZSBxdWV1ZSBhY3RpdmVseSBwcm9jZXNzaW5nIGEgdGFzaz9cclxuICAgKlxyXG4gICAqIEByZWFkb25seVxyXG4gICAqIEB0eXBlIHtib29sZWFufVxyXG4gICAqIEBtZW1iZXJPZiBUYXNrUXVldWVcclxuICAgKi9cclxuICBnZXQgcHJvY2Vzc2luZygpOiBib29sZWFuIHtcclxuICAgIGNvbnN0IHByb2Nlc3NvciA9IHRoaXMuY3VycmVudFByb2Nlc3NvcjtcclxuXHJcbiAgICByZXR1cm4gcHJvY2Vzc29yICE9PSB1bmRlZmluZWQgJiZcclxuICAgICAgICAgICBwcm9jZXNzb3Iuc3RhcnRlZCAmJlxyXG4gICAgICAgICAgICFwcm9jZXNzb3Iuc2V0dGxlZDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlc29sdmVzIHdoZW4gdGhlIHF1ZXVlIGhhcyBiZWVuIGZ1bGx5IHJlaWZpZWQgZnJvbSBpdHMgYXNzb2NpYXRlZCBidWNrZXQsXHJcbiAgICogaWYgYXBwbGljYWJsZS5cclxuICAgKlxyXG4gICAqIEByZWFkb25seVxyXG4gICAqIEB0eXBlIHtQcm9taXNlPHZvaWQ+fVxyXG4gICAqIEBtZW1iZXJPZiBUYXNrUXVldWVcclxuICAgKi9cclxuICBnZXQgcmVpZmllZCgpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHJldHVybiB0aGlzLl9yZWlmaWVkO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUHVzaCBhIG5ldyB0YXNrIG9udG8gdGhlIGVuZCBvZiB0aGUgcXVldWUuXHJcbiAgICpcclxuICAgKiBJZiBgYXV0b1Byb2Nlc3NgIGlzIGVuYWJsZWQsIHRoaXMgd2lsbCBhdXRvbWF0aWNhbGx5IHRyaWdnZXIgcHJvY2Vzc2luZyBvZlxyXG4gICAqIHRoZSBxdWV1ZS5cclxuICAgKlxyXG4gICAqIFJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2hlbiB0aGUgcHVzaGVkIHRhc2sgaGFzIGJlZW4gcHJvY2Vzc2VkLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtUYXNrfSB0YXNrXHJcbiAgICogQHJldHVybnMge1Byb21pc2U8dm9pZD59XHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgVGFza1F1ZXVlXHJcbiAgICovXHJcbiAgcHVzaCh0YXNrOiBUYXNrKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICBsZXQgcHJvY2Vzc29yID0gbmV3IFRhc2tQcm9jZXNzb3IodGhpcy5fcGVyZm9ybWVyLCB0YXNrKTtcclxuICAgIHJldHVybiB0aGlzLl9yZWlmaWVkXHJcbiAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICB0aGlzLl90YXNrcy5wdXNoKHRhc2spO1xyXG4gICAgICAgIHRoaXMuX3Byb2Nlc3NvcnMucHVzaChwcm9jZXNzb3IpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9wZXJzaXN0KCk7XHJcbiAgICAgIH0pXHJcbiAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICBpZiAodGhpcy5hdXRvUHJvY2Vzcykge1xyXG4gICAgICAgICAgcmV0dXJuIHRoaXMucHJvY2VzcygpXHJcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHByb2Nlc3Nvci5zZXR0bGUoKSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJldHVybiBwcm9jZXNzb3Iuc2V0dGxlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENhbmNlbHMgYW5kIHJlLXRyaWVzIHByb2Nlc3NpbmcgdGhlIGN1cnJlbnQgdGFzay5cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPHZvaWQ+fVxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIFRhc2tRdWV1ZVxyXG4gICAqL1xyXG4gIHJldHJ5KCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgcmV0dXJuIHRoaXMuX3JlaWZpZWRcclxuICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuX2NhbmNlbCgpO1xyXG4gICAgICAgIHRoaXMuY3VycmVudFByb2Nlc3Nvci5yZXNldCgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9wZXJzaXN0KCk7XHJcbiAgICAgIH0pXHJcbiAgICAgIC50aGVuKCgpID0+IHRoaXMucHJvY2VzcygpKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENhbmNlbHMgYW5kIGRpc2NhcmRzIHRoZSBjdXJyZW50IHRhc2sgYW5kIHByb2NlZWRzIHRvIHByb2Nlc3MgdGhlIG5leHRcclxuICAgKiB0YXNrLlxyXG4gICAqXHJcbiAgICogQHJldHVybnMge1Byb21pc2U8dm9pZD59XHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgVGFza1F1ZXVlXHJcbiAgICovXHJcbiAgc2tpcCgpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHJldHVybiB0aGlzLl9yZWlmaWVkXHJcbiAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICB0aGlzLl9jYW5jZWwoKTtcclxuICAgICAgICB0aGlzLl90YXNrcy5zaGlmdCgpO1xyXG4gICAgICAgIHRoaXMuX3Byb2Nlc3NvcnMuc2hpZnQoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcGVyc2lzdCgpO1xyXG4gICAgICB9KVxyXG4gICAgICAudGhlbigoKSA9PiB0aGlzLnByb2Nlc3MoKSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDYW5jZWxzIHRoZSBjdXJyZW50IHRhc2sgYW5kIGNvbXBsZXRlbHkgY2xlYXJzIHRoZSBxdWV1ZS5cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPHZvaWQ+fVxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIFRhc2tRdWV1ZVxyXG4gICAqL1xyXG4gIGNsZWFyKCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgcmV0dXJuIHRoaXMuX3JlaWZpZWRcclxuICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuX2NhbmNlbCgpO1xyXG4gICAgICAgIHRoaXMuX3Rhc2tzID0gW107XHJcbiAgICAgICAgdGhpcy5fcHJvY2Vzc29ycyA9IFtdO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9wZXJzaXN0KCk7XHJcbiAgICAgIH0pXHJcbiAgICAgIC50aGVuKCgpID0+IHRoaXMucHJvY2VzcygpKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENhbmNlbHMgdGhlIGN1cnJlbnQgdGFzayBhbmQgcmVtb3ZlcyBpdCwgYnV0IGRvZXMgbm90IGNvbnRpbnVlIHByb2Nlc3NpbmcuXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxUYXNrPn1cclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBUYXNrUXVldWVcclxuICAgKi9cclxuICBzaGlmdCgpOiBQcm9taXNlPFRhc2s+IHtcclxuICAgIGxldCB0YXNrOiBUYXNrO1xyXG5cclxuICAgIHJldHVybiB0aGlzLl9yZWlmaWVkXHJcbiAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICB0aGlzLl9jYW5jZWwoKTtcclxuICAgICAgICB0YXNrID0gdGhpcy5fdGFza3Muc2hpZnQoKTtcclxuICAgICAgICB0aGlzLl9wcm9jZXNzb3JzLnNoaWZ0KCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BlcnNpc3QoKTtcclxuICAgICAgfSlcclxuICAgICAgLnRoZW4oKCkgPT4gdGFzayk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDYW5jZWxzIHByb2Nlc3NpbmcgdGhlIGN1cnJlbnQgdGFzayBhbmQgaW5zZXJ0cyBhIG5ldyB0YXNrIGF0IHRoZSBiZWdpbm5pbmdcclxuICAgKiBvZiB0aGUgcXVldWUuIFRoaXMgbmV3IHRhc2sgd2lsbCBiZSBwcm9jZXNzZWQgbmV4dC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7VGFza30gdGFza1xyXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPHZvaWQ+fVxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIFRhc2tRdWV1ZVxyXG4gICAqL1xyXG4gIHVuc2hpZnQodGFzazogVGFzayk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgcmV0dXJuIHRoaXMuX3JlaWZpZWRcclxuICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuX2NhbmNlbCgpO1xyXG4gICAgICAgIHRoaXMuX3Rhc2tzLnVuc2hpZnQodGFzayk7XHJcbiAgICAgICAgdGhpcy5fcHJvY2Vzc29ycy51bnNoaWZ0KG5ldyBUYXNrUHJvY2Vzc29yKHRoaXMuX3BlcmZvcm1lciwgdGFzaykpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9wZXJzaXN0KCk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUHJvY2Vzc2VzIGFsbCB0aGUgdGFza3MgaW4gdGhlIHF1ZXVlLiBSZXNvbHZlcyB3aGVuIHRoZSBxdWV1ZSBpcyBlbXB0eS5cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPGFueT59XHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgVGFza1F1ZXVlXHJcbiAgICovXHJcbiAgcHJvY2VzcygpOiBQcm9taXNlPGFueT4ge1xyXG4gICAgcmV0dXJuIHRoaXMuX3JlaWZpZWRcclxuICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgIGxldCByZXNvbHV0aW9uID0gdGhpcy5fcmVzb2x1dGlvbjtcclxuXHJcbiAgICAgICAgaWYgKCFyZXNvbHV0aW9uKSB7XHJcbiAgICAgICAgICBpZiAodGhpcy5fdGFza3MubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHJlc29sdXRpb24gPSBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKTtcclxuICAgICAgICAgICAgdGhpcy5fY29tcGxldGUoKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2Vycm9yID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5fcmVzb2x1dGlvbiA9IHJlc29sdXRpb24gPSBuZXcgT3JiaXQuUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgdGhpcy5fcmVzb2x2ZSA9IHJlc29sdmU7XHJcbiAgICAgICAgICAgICAgdGhpcy5fcmVqZWN0ID0gcmVqZWN0O1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5fc2V0dGxlRWFjaChyZXNvbHV0aW9uKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiByZXNvbHV0aW9uO1xyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgX2NvbXBsZXRlKCk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMuX3Jlc29sdmUpIHtcclxuICAgICAgdGhpcy5fcmVzb2x2ZSgpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5fcmVzb2x2ZSA9IG51bGw7XHJcbiAgICB0aGlzLl9yZWplY3QgPSBudWxsO1xyXG4gICAgdGhpcy5fZXJyb3IgPSBudWxsO1xyXG4gICAgdGhpcy5fcmVzb2x1dGlvbiA9IG51bGw7XHJcbiAgICB0aGlzLmVtaXQoJ2NvbXBsZXRlJyk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIF9mYWlsKHRhc2ssIGUpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLl9yZWplY3QpIHtcclxuICAgICAgdGhpcy5fcmVqZWN0KGUpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5fcmVzb2x2ZSA9IG51bGw7XHJcbiAgICB0aGlzLl9yZWplY3QgPSBudWxsO1xyXG4gICAgdGhpcy5fZXJyb3IgPSBlO1xyXG4gICAgdGhpcy5fcmVzb2x1dGlvbiA9IG51bGw7XHJcbiAgICB0aGlzLmVtaXQoJ2ZhaWwnLCB0YXNrLCBlKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgX2NhbmNlbCgpOiB2b2lkIHtcclxuICAgIHRoaXMuX2Vycm9yID0gbnVsbDtcclxuICAgIHRoaXMuX3Jlc29sdXRpb24gPSBudWxsO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBfc2V0dGxlRWFjaChyZXNvbHV0aW9uKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5fdGFza3MubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIHRoaXMuX2NvbXBsZXRlKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBsZXQgdGFzayA9IHRoaXMuX3Rhc2tzWzBdO1xyXG4gICAgICBsZXQgcHJvY2Vzc29yID0gdGhpcy5fcHJvY2Vzc29yc1swXTtcclxuXHJcbiAgICAgIHRoaXMuZW1pdCgnYmVmb3JlVGFzaycsIHRhc2spO1xyXG5cclxuICAgICAgcHJvY2Vzc29yLnByb2Nlc3MoKVxyXG4gICAgICAgIC50aGVuKChyZXN1bHQpID0+IHtcclxuICAgICAgICAgIGlmIChyZXNvbHV0aW9uID09PSB0aGlzLl9yZXNvbHV0aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Rhc2tzLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3Byb2Nlc3NvcnMuc2hpZnQoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX3BlcnNpc3QoKVxyXG4gICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgndGFzaycsIHRhc2spO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2V0dGxlRWFjaChyZXNvbHV0aW9uKTtcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaCgoZSkgPT4ge1xyXG4gICAgICAgICAgaWYgKHJlc29sdXRpb24gPT09IHRoaXMuX3Jlc29sdXRpb24pIHtcclxuICAgICAgICAgICAgdGhpcy5fZmFpbCh0YXNrLCBlKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgX3JlaWZ5KCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgdGhpcy5fdGFza3MgPSBbXTtcclxuICAgIHRoaXMuX3Byb2Nlc3NvcnMgPSBbXTtcclxuXHJcbiAgICBpZiAodGhpcy5fYnVja2V0KSB7XHJcbiAgICAgIHRoaXMuX3JlaWZpZWQgPSB0aGlzLl9idWNrZXQuZ2V0SXRlbSh0aGlzLl9uYW1lKVxyXG4gICAgICAgIC50aGVuKHRhc2tzID0+IHtcclxuICAgICAgICAgIGlmICh0YXNrcykge1xyXG4gICAgICAgICAgICB0aGlzLl90YXNrcyA9IHRhc2tzO1xyXG4gICAgICAgICAgICB0aGlzLl9wcm9jZXNzb3JzID0gdGFza3MubWFwKHRhc2sgPT4gbmV3IFRhc2tQcm9jZXNzb3IodGhpcy5fcGVyZm9ybWVyLCB0YXNrKSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLl9yZWlmaWVkID0gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuX3JlaWZpZWQ7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIF9wZXJzaXN0KCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgdGhpcy5lbWl0KCdjaGFuZ2UnKTtcclxuICAgIGlmICh0aGlzLl9idWNrZXQpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuX2J1Y2tldC5zZXRJdGVtKHRoaXMuX25hbWUsIHRoaXMuX3Rhc2tzKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIl19