"use strict";

var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFzay1xdWV1ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNyYy90YXNrLXF1ZXVlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxxQkFBMkI7QUFFM0IsK0JBQTZDO0FBRTdDLHdCQUE2QztBQUM3QyxzQkFBc0M7QUFzQ3RDLEFBZUc7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFSDtBQXFCRSxBQU9HOzs7Ozs7OztBQUNILHVCQUFZLEFBQWlCLFFBQUUsQUFBZ0M7QUFBaEMsaUNBQUE7QUFBQSx1QkFBZ0M7O0FBQS9ELG9CQWtCQztBQWpCQyxnQkFBTSxPQUFDLEFBQWdELGtEQUFFLE9BQUssUUFBQyxBQUFPLEFBQUMsQUFBQztBQUV4RSxBQUFJLGFBQUMsQUFBVSxhQUFHLEFBQU0sQUFBQztBQUN6QixBQUFJLGFBQUMsQUFBSyxRQUFHLEFBQVEsU0FBQyxBQUFJLEFBQUM7QUFDM0IsQUFBSSxhQUFDLEFBQU8sVUFBRyxBQUFRLFNBQUMsQUFBTSxBQUFDO0FBQy9CLEFBQUksYUFBQyxBQUFXLGNBQUcsQUFBUSxTQUFDLEFBQVcsZ0JBQUssQUFBUyxZQUFHLEFBQUksT0FBRyxBQUFRLFNBQUMsQUFBVyxBQUFDO0FBRXBGLEFBQUUsQUFBQyxZQUFDLEFBQUksS0FBQyxBQUFPLEFBQUMsU0FBQyxBQUFDO0FBQ2pCLG9CQUFNLE9BQUMsQUFBOEMsZ0RBQUUsQ0FBQyxDQUFDLEFBQUksS0FBQyxBQUFLLEFBQUMsQUFBQyxBQUN2RTtBQUFDO0FBRUQsQUFBSSxhQUFDLEFBQU0sQUFBRSxTQUNWLEFBQUksS0FBQztBQUNKLEFBQUUsQUFBQyxnQkFBQyxBQUFJLE1BQUMsQUFBTSxTQUFHLEFBQUMsS0FBSSxBQUFJLE1BQUMsQUFBVyxBQUFDLGFBQUMsQUFBQztBQUN4QyxBQUFJLHNCQUFDLEFBQU8sQUFBRSxBQUFDLEFBQ2pCO0FBQUMsQUFDSDtBQUFDLEFBQUMsQUFBQyxBQUNQO0FBQUM7QUFTRCwwQkFBSSxxQkFBSTtBQVBSLEFBTUc7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QyxBQUFJLEFBQUM7QUFBQSxBQUFDLEFBQUMsQUFDakYscUJBRHFCLEFBQUs7QUFDekIsQUFDSDtBQUFDLEFBQUMsQUFBQyxBQUNQLGFBUGtCLEFBQUk7QUFPckIsQUFBQyxBQUFJLGVBQUMsQUFBQztBQUNOLEFBQUksaUJBQUMsQUFBUSxXQUFHLE9BQUssUUFBQyxBQUFPLFFBQUMsQUFBTyxBQUFFLEFBQUMsQUFDMUM7QUFBQztBQUVELEFBQU0sZUFBQyxBQUFJLEtBQUMsQUFBUSxBQUFDLEFBQ3ZCO0FBQUM7QUFFTyx3QkFBUSxXQUFoQjtBQUNFLEFBQUksYUFBQyxBQUFJLEtBQUMsQUFBUSxBQUFDLEFBQUM7QUFDcEIsQUFBRSxBQUFDLFlBQUMsQUFBSSxLQUFDLEFBQU8sQUFBQyxTQUFDLEFBQUM7QUFDakIsQUFBTSxtQkFBQyxBQUFJLEtBQUMsQUFBTyxRQUFDLEFBQU8sUUFBQyxBQUFJLEtBQUMsQUFBSyxPQUFFLEFBQUksS0FBQyxBQUFNLEFBQUMsQUFBQyxBQUN2RDtBQUFDLEFBQUMsQUFBSSxlQUFDLEFBQUM7QUFDTixBQUFNLG1CQUFDLE9BQUssUUFBQyxBQUFPLFFBQUMsQUFBTyxBQUFFLEFBQUMsQUFDakM7QUFBQyxBQUNIO0FBQUM7QUFoYWtCLEFBQVMsNEJBRDdCLFVBQU8sVUFDYSxBQUFTLEFBaWE3QjtBQUFELFdBQUM7QUFqYUQsQUFpYUM7a0JBamFvQixBQUFTIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE9yYml0IGZyb20gJy4vbWFpbic7XHJcbmltcG9ydCB7IFRhc2ssIFBlcmZvcm1lciB9IGZyb20gJy4vdGFzayc7XHJcbmltcG9ydCBUYXNrUHJvY2Vzc29yIGZyb20gJy4vdGFzay1wcm9jZXNzb3InO1xyXG5pbXBvcnQgeyBCdWNrZXQgfSBmcm9tICcuL2J1Y2tldCc7XHJcbmltcG9ydCBldmVudGVkLCB7IEV2ZW50ZWQgfSBmcm9tICcuL2V2ZW50ZWQnO1xyXG5pbXBvcnQgeyBhc3NlcnQgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xyXG5cclxuLyoqXHJcbiAqIFNldHRpbmdzIGZvciBhIGBUYXNrUXVldWVgLlxyXG4gKlxyXG4gKiBAZXhwb3J0XHJcbiAqIEBpbnRlcmZhY2UgVGFza1F1ZXVlU2V0dGluZ3NcclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgVGFza1F1ZXVlU2V0dGluZ3Mge1xyXG4gIC8qKlxyXG4gICAqIE5hbWUgdXNlZCBmb3IgdHJhY2tpbmcgYW5kIGRlYnVnZ2luZyBhIHRhc2sgcXVldWUuXHJcbiAgICpcclxuICAgKiBAdHlwZSB7c3RyaW5nfVxyXG4gICAqIEBtZW1iZXJPZiBUYXNrUXVldWVTZXR0aW5nc1xyXG4gICAqL1xyXG4gIG5hbWU/OiBzdHJpbmc7XHJcblxyXG4gIC8qKlxyXG4gICAqIEEgYnVja2V0IGluIHdoaWNoIHRvIHBlcnNpc3QgcXVldWUgc3RhdGUuXHJcbiAgICpcclxuICAgKiBAdHlwZSB7QnVja2V0fVxyXG4gICAqIEBtZW1iZXJPZiBUYXNrUXVldWVTZXR0aW5nc1xyXG4gICAqL1xyXG4gIGJ1Y2tldD86IEJ1Y2tldDtcclxuXHJcbiAgLyoqXHJcbiAgICogQSBmbGFnIGluZGljYXRpbmcgd2hldGhlciB0YXNrcyBzaG91bGQgYmUgcHJvY2Vzc2VkIGFzIHNvb24gYXMgdGhleSBhcmVcclxuICAgKiBwdXNoZWQgaW50byBhIHF1ZXVlLiBTZXQgdG8gYGZhbHNlYCB0byBvdmVycmlkZSB0aGUgZGVmYXVsdCBgdHJ1ZWBcclxuICAgKiBiZWhhdmlvci5cclxuICAgKlxyXG4gICAqIEB0eXBlIHtib29sZWFufVxyXG4gICAqIEBtZW1iZXJPZiBUYXNrUXVldWVTZXR0aW5nc1xyXG4gICAqL1xyXG4gIGF1dG9Qcm9jZXNzPzogYm9vbGVhbjtcclxufVxyXG5cclxuZXhwb3J0IHR5cGUgVEFTS19RVUVVRV9FVkVOVFMgPSAnY29tcGxldGUnIHwgJ2ZhaWwnIHwgJ2JlZm9yZVRhc2snIHwgJ3Rhc2snIHwgJ2NoYW5nZSc7XHJcblxyXG4vKipcclxuICogYFRhc2tRdWV1ZWAgaXMgYSBGSUZPIHF1ZXVlIG9mIGFzeW5jaHJvbm91cyB0YXNrcyB0aGF0IHNob3VsZCBiZVxyXG4gKiBwZXJmb3JtZWQgc2VxdWVudGlhbGx5LlxyXG4gKlxyXG4gKiBUYXNrcyBhcmUgYWRkZWQgdG8gdGhlIHF1ZXVlIHdpdGggYHB1c2hgLiBFYWNoIHRhc2sgd2lsbCBiZSBwcm9jZXNzZWQgYnlcclxuICogY2FsbGluZyBpdHMgYHByb2Nlc3NgIG1ldGhvZC5cclxuICpcclxuICogQnkgZGVmYXVsdCwgdGFzayBxdWV1ZXMgd2lsbCBiZSBwcm9jZXNzZWQgYXV0b21hdGljYWxseSwgYXMgc29vbiBhcyB0YXNrc1xyXG4gKiBhcmUgcHVzaGVkIHRvIHRoZW0uIFRoaXMgY2FuIGJlIG92ZXJyaWRkZW4gYnkgc2V0dGluZyB0aGUgYGF1dG9Qcm9jZXNzYFxyXG4gKiBzZXR0aW5nIHRvIGBmYWxzZWAgYW5kIGNhbGxpbmcgYHByb2Nlc3NgIHdoZW4geW91J2QgbGlrZSB0byBzdGFydFxyXG4gKiBwcm9jZXNzaW5nLlxyXG4gKlxyXG4gKiBAZXhwb3J0XHJcbiAqIEBjbGFzcyBUYXNrUXVldWVcclxuICogQGltcGxlbWVudHMge0V2ZW50ZWR9XHJcbiAqL1xyXG5AZXZlbnRlZFxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUYXNrUXVldWUgaW1wbGVtZW50cyBFdmVudGVkIHtcclxuICBwdWJsaWMgYXV0b1Byb2Nlc3M6IGJvb2xlYW47XHJcblxyXG4gIHByaXZhdGUgX25hbWU6IHN0cmluZztcclxuICBwcml2YXRlIF9wZXJmb3JtZXI6IFBlcmZvcm1lcjtcclxuICBwcml2YXRlIF9idWNrZXQ6IEJ1Y2tldDtcclxuICBwcml2YXRlIF90YXNrczogVGFza1tdO1xyXG4gIHByaXZhdGUgX3Byb2Nlc3NvcnM6IFRhc2tQcm9jZXNzb3JbXTtcclxuICBwcml2YXRlIF9lcnJvcjogRXJyb3I7XHJcbiAgcHJpdmF0ZSBfcmVzb2x1dGlvbjogUHJvbWlzZTx2b2lkPjtcclxuICBwcml2YXRlIF9yZXNvbHZlOiBhbnk7XHJcbiAgcHJpdmF0ZSBfcmVqZWN0OiBhbnk7XHJcbiAgcHJpdmF0ZSBfcmVpZmllZDogUHJvbWlzZTxhbnk+O1xyXG5cclxuICAvLyBFdmVudGVkIGludGVyZmFjZSBzdHVic1xyXG4gIG9uOiAoZXZlbnQ6IFRBU0tfUVVFVUVfRVZFTlRTLCBjYWxsYmFjazogRnVuY3Rpb24sIGJpbmRpbmc/OiBvYmplY3QpID0+IHZvaWQ7XHJcbiAgb2ZmOiAoZXZlbnQ6IFRBU0tfUVVFVUVfRVZFTlRTLCBjYWxsYmFjazogRnVuY3Rpb24sIGJpbmRpbmc/OiBvYmplY3QpID0+IHZvaWQ7XHJcbiAgb25lOiAoZXZlbnQ6IFRBU0tfUVVFVUVfRVZFTlRTLCBjYWxsYmFjazogRnVuY3Rpb24sIGJpbmRpbmc/OiBvYmplY3QpID0+IHZvaWQ7XHJcbiAgZW1pdDogKGV2ZW50OiBUQVNLX1FVRVVFX0VWRU5UUywgLi4uYXJncykgPT4gdm9pZDtcclxuICBsaXN0ZW5lcnM6IChldmVudDogVEFTS19RVUVVRV9FVkVOVFMpID0+IGFueVtdO1xyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIGBUYXNrUXVldWVgLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtQZXJmb3JtZXJ9IHRhcmdldFxyXG4gICAqIEBwYXJhbSB7VGFza1F1ZXVlT3B0aW9uc30gW29wdGlvbnM9e31dXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgVGFza1F1ZXVlXHJcbiAgICovXHJcbiAgY29uc3RydWN0b3IodGFyZ2V0OiBQZXJmb3JtZXIsIHNldHRpbmdzOiBUYXNrUXVldWVTZXR0aW5ncyA9IHt9KSB7XHJcbiAgICBhc3NlcnQoJ1Rhc2tRdWV1ZSByZXF1aXJlcyBPcmJpdC5Qcm9taXNlIHRvIGJlIGRlZmluZWQnLCBPcmJpdC5Qcm9taXNlKTtcclxuXHJcbiAgICB0aGlzLl9wZXJmb3JtZXIgPSB0YXJnZXQ7XHJcbiAgICB0aGlzLl9uYW1lID0gc2V0dGluZ3MubmFtZTtcclxuICAgIHRoaXMuX2J1Y2tldCA9IHNldHRpbmdzLmJ1Y2tldDtcclxuICAgIHRoaXMuYXV0b1Byb2Nlc3MgPSBzZXR0aW5ncy5hdXRvUHJvY2VzcyA9PT0gdW5kZWZpbmVkID8gdHJ1ZSA6IHNldHRpbmdzLmF1dG9Qcm9jZXNzO1xyXG5cclxuICAgIGlmICh0aGlzLl9idWNrZXQpIHtcclxuICAgICAgYXNzZXJ0KCdUYXNrUXVldWUgcmVxdWlyZXMgYSBuYW1lIGlmIGl0IGhhcyBhIGJ1Y2tldCcsICEhdGhpcy5fbmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5fcmVpZnkoKVxyXG4gICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMubGVuZ3RoID4gMCAmJiB0aGlzLmF1dG9Qcm9jZXNzKSB7XHJcbiAgICAgICAgICB0aGlzLnByb2Nlc3MoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTmFtZSB1c2VkIGZvciB0cmFja2luZyAvIGRlYnVnZ2luZyB0aGlzIHF1ZXVlLlxyXG4gICAqXHJcbiAgICogQHJlYWRvbmx5XHJcbiAgICogQHR5cGUge3N0cmluZ31cclxuICAgKiBAbWVtYmVyT2YgVGFza1F1ZXVlXHJcbiAgICovXHJcbiAgZ2V0IG5hbWUoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLl9uYW1lO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVGhlIG9iamVjdCB3aGljaCB3aWxsIGBwZXJmb3JtYCB0aGUgdGFza3MgaW4gdGhpcyBxdWV1ZS5cclxuICAgKlxyXG4gICAqIEByZWFkb25seVxyXG4gICAqIEB0eXBlIHtQZXJmb3JtZXJ9XHJcbiAgICogQG1lbWJlck9mIFRhc2tRdWV1ZVxyXG4gICAqL1xyXG4gIGdldCBwZXJmb3JtZXIoKTogUGVyZm9ybWVyIHtcclxuICAgIHJldHVybiB0aGlzLl9wZXJmb3JtZXI7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBBIGJ1Y2tldCB1c2VkIHRvIHBlcnNpc3QgdGhlIHN0YXRlIG9mIHRoaXMgcXVldWUuXHJcbiAgICpcclxuICAgKiBAcmVhZG9ubHlcclxuICAgKiBAdHlwZSB7QnVja2V0fVxyXG4gICAqIEBtZW1iZXJPZiBUYXNrUXVldWVcclxuICAgKi9cclxuICBnZXQgYnVja2V0KCk6IEJ1Y2tldCB7XHJcbiAgICByZXR1cm4gdGhpcy5fYnVja2V0O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVGhlIG51bWJlciBvZiB0YXNrcyBpbiB0aGUgcXVldWUuXHJcbiAgICpcclxuICAgKiBAcmVhZG9ubHlcclxuICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAqIEBtZW1iZXJPZiBUYXNrUXVldWVcclxuICAgKi9cclxuICBnZXQgbGVuZ3RoKCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gdGhpcy5fdGFza3MgPyB0aGlzLl90YXNrcy5sZW5ndGggOiAwO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVGhlIHRhc2tzIGluIHRoZSBxdWV1ZS5cclxuICAgKlxyXG4gICAqIEByZWFkb25seVxyXG4gICAqIEB0eXBlIHtUYXNrW119XHJcbiAgICogQG1lbWJlck9mIFRhc2tRdWV1ZVxyXG4gICAqL1xyXG4gIGdldCBlbnRyaWVzKCk6IFRhc2tbXSB7XHJcbiAgICByZXR1cm4gdGhpcy5fdGFza3M7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBUaGUgY3VycmVudCB0YXNrIGJlaW5nIHByb2Nlc3NlZCAoaWYgYWN0aXZlbHkgcHJvY2Vzc2luZyksIG9yIHRoZSBuZXh0XHJcbiAgICogdGFzayB0byBiZSBwcm9jZXNzZWQgKGlmIG5vdCBhY3RpdmVseSBwcm9jZXNzaW5nKS5cclxuICAgKlxyXG4gICAqIEByZWFkb25seVxyXG4gICAqIEB0eXBlIHtUYXNrfVxyXG4gICAqIEBtZW1iZXJPZiBUYXNrUXVldWVcclxuICAgKi9cclxuICBnZXQgY3VycmVudCgpOiBUYXNrIHtcclxuICAgIHJldHVybiB0aGlzLl90YXNrcyAmJiB0aGlzLl90YXNrc1swXTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFRoZSBwcm9jZXNzb3Igd3JhcHBlciB0aGF0IGlzIHByb2Nlc3NpbmcgdGhlIGN1cnJlbnQgdGFzayAob3IgbmV4dCB0YXNrLFxyXG4gICAqIGlmIG5vbmUgYXJlIGJlaW5nIHByb2Nlc3NlZCkuXHJcbiAgICpcclxuICAgKiBAcmVhZG9ubHlcclxuICAgKiBAdHlwZSB7VGFza1Byb2Nlc3Nvcn1cclxuICAgKiBAbWVtYmVyT2YgVGFza1F1ZXVlXHJcbiAgICovXHJcbiAgZ2V0IGN1cnJlbnRQcm9jZXNzb3IoKTogVGFza1Byb2Nlc3NvciB7XHJcbiAgICByZXR1cm4gdGhpcy5fcHJvY2Vzc29ycyAmJiB0aGlzLl9wcm9jZXNzb3JzWzBdO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogSWYgYW4gZXJyb3Igb2NjdXJzIHdoaWxlIHByb2Nlc3NpbmcgYSB0YXNrLCBwcm9jZXNzaW5nIHdpbGwgYmUgaGFsdGVkLCB0aGVcclxuICAgKiBgZmFpbGAgZXZlbnQgd2lsbCBiZSBlbWl0dGVkLCBhbmQgdGhpcyBwcm9wZXJ0eSB3aWxsIHJlZmxlY3QgdGhlIGVycm9yXHJcbiAgICogZW5jb3VudGVyZWQuXHJcbiAgICpcclxuICAgKiBAcmVhZG9ubHlcclxuICAgKiBAdHlwZSB7RXJyb3J9XHJcbiAgICogQG1lbWJlck9mIFRhc2tRdWV1ZVxyXG4gICAqL1xyXG4gIGdldCBlcnJvcigpOiBFcnJvciB7XHJcbiAgICByZXR1cm4gdGhpcy5fZXJyb3I7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBJcyB0aGUgcXVldWUgZW1wdHk/XHJcbiAgICpcclxuICAgKiBAcmVhZG9ubHlcclxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cclxuICAgKiBAbWVtYmVyT2YgVGFza1F1ZXVlXHJcbiAgICovXHJcbiAgZ2V0IGVtcHR5KCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMubGVuZ3RoID09PSAwO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogSXMgdGhlIHF1ZXVlIGFjdGl2ZWx5IHByb2Nlc3NpbmcgYSB0YXNrP1xyXG4gICAqXHJcbiAgICogQHJlYWRvbmx5XHJcbiAgICogQHR5cGUge2Jvb2xlYW59XHJcbiAgICogQG1lbWJlck9mIFRhc2tRdWV1ZVxyXG4gICAqL1xyXG4gIGdldCBwcm9jZXNzaW5nKCk6IGJvb2xlYW4ge1xyXG4gICAgY29uc3QgcHJvY2Vzc29yID0gdGhpcy5jdXJyZW50UHJvY2Vzc29yO1xyXG5cclxuICAgIHJldHVybiBwcm9jZXNzb3IgIT09IHVuZGVmaW5lZCAmJlxyXG4gICAgICAgICAgIHByb2Nlc3Nvci5zdGFydGVkICYmXHJcbiAgICAgICAgICAgIXByb2Nlc3Nvci5zZXR0bGVkO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmVzb2x2ZXMgd2hlbiB0aGUgcXVldWUgaGFzIGJlZW4gZnVsbHkgcmVpZmllZCBmcm9tIGl0cyBhc3NvY2lhdGVkIGJ1Y2tldCxcclxuICAgKiBpZiBhcHBsaWNhYmxlLlxyXG4gICAqXHJcbiAgICogQHJlYWRvbmx5XHJcbiAgICogQHR5cGUge1Byb21pc2U8dm9pZD59XHJcbiAgICogQG1lbWJlck9mIFRhc2tRdWV1ZVxyXG4gICAqL1xyXG4gIGdldCByZWlmaWVkKCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgcmV0dXJuIHRoaXMuX3JlaWZpZWQ7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBQdXNoIGEgbmV3IHRhc2sgb250byB0aGUgZW5kIG9mIHRoZSBxdWV1ZS5cclxuICAgKlxyXG4gICAqIElmIGBhdXRvUHJvY2Vzc2AgaXMgZW5hYmxlZCwgdGhpcyB3aWxsIGF1dG9tYXRpY2FsbHkgdHJpZ2dlciBwcm9jZXNzaW5nIG9mXHJcbiAgICogdGhlIHF1ZXVlLlxyXG4gICAqXHJcbiAgICogUmV0dXJucyBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB3aGVuIHRoZSBwdXNoZWQgdGFzayBoYXMgYmVlbiBwcm9jZXNzZWQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge1Rhc2t9IHRhc2tcclxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkPn1cclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBUYXNrUXVldWVcclxuICAgKi9cclxuICBwdXNoKHRhc2s6IFRhc2spOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIGxldCBwcm9jZXNzb3IgPSBuZXcgVGFza1Byb2Nlc3Nvcih0aGlzLl9wZXJmb3JtZXIsIHRhc2spO1xyXG4gICAgcmV0dXJuIHRoaXMuX3JlaWZpZWRcclxuICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuX3Rhc2tzLnB1c2godGFzayk7XHJcbiAgICAgICAgdGhpcy5fcHJvY2Vzc29ycy5wdXNoKHByb2Nlc3Nvcik7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BlcnNpc3QoKTtcclxuICAgICAgfSlcclxuICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLmF1dG9Qcm9jZXNzKSB7XHJcbiAgICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzKClcclxuICAgICAgICAgICAgLnRoZW4oKCkgPT4gcHJvY2Vzc29yLnNldHRsZSgpKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmV0dXJuIHByb2Nlc3Nvci5zZXR0bGUoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ2FuY2VscyBhbmQgcmUtdHJpZXMgcHJvY2Vzc2luZyB0aGUgY3VycmVudCB0YXNrLlxyXG4gICAqXHJcbiAgICogQHJldHVybnMge1Byb21pc2U8dm9pZD59XHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgVGFza1F1ZXVlXHJcbiAgICovXHJcbiAgcmV0cnkoKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICByZXR1cm4gdGhpcy5fcmVpZmllZFxyXG4gICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5fY2FuY2VsKCk7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50UHJvY2Vzc29yLnJlc2V0KCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BlcnNpc3QoKTtcclxuICAgICAgfSlcclxuICAgICAgLnRoZW4oKCkgPT4gdGhpcy5wcm9jZXNzKCkpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ2FuY2VscyBhbmQgZGlzY2FyZHMgdGhlIGN1cnJlbnQgdGFzayBhbmQgcHJvY2VlZHMgdG8gcHJvY2VzcyB0aGUgbmV4dFxyXG4gICAqIHRhc2suXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkPn1cclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBUYXNrUXVldWVcclxuICAgKi9cclxuICBza2lwKCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgcmV0dXJuIHRoaXMuX3JlaWZpZWRcclxuICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuX2NhbmNlbCgpO1xyXG4gICAgICAgIHRoaXMuX3Rhc2tzLnNoaWZ0KCk7XHJcbiAgICAgICAgdGhpcy5fcHJvY2Vzc29ycy5zaGlmdCgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9wZXJzaXN0KCk7XHJcbiAgICAgIH0pXHJcbiAgICAgIC50aGVuKCgpID0+IHRoaXMucHJvY2VzcygpKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENhbmNlbHMgdGhlIGN1cnJlbnQgdGFzayBhbmQgY29tcGxldGVseSBjbGVhcnMgdGhlIHF1ZXVlLlxyXG4gICAqXHJcbiAgICogQHJldHVybnMge1Byb21pc2U8dm9pZD59XHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgVGFza1F1ZXVlXHJcbiAgICovXHJcbiAgY2xlYXIoKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICByZXR1cm4gdGhpcy5fcmVpZmllZFxyXG4gICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5fY2FuY2VsKCk7XHJcbiAgICAgICAgdGhpcy5fdGFza3MgPSBbXTtcclxuICAgICAgICB0aGlzLl9wcm9jZXNzb3JzID0gW107XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BlcnNpc3QoKTtcclxuICAgICAgfSlcclxuICAgICAgLnRoZW4oKCkgPT4gdGhpcy5wcm9jZXNzKCkpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ2FuY2VscyB0aGUgY3VycmVudCB0YXNrIGFuZCByZW1vdmVzIGl0LCBidXQgZG9lcyBub3QgY29udGludWUgcHJvY2Vzc2luZy5cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPFRhc2s+fVxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIFRhc2tRdWV1ZVxyXG4gICAqL1xyXG4gIHNoaWZ0KCk6IFByb21pc2U8VGFzaz4ge1xyXG4gICAgbGV0IHRhc2s6IFRhc2s7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuX3JlaWZpZWRcclxuICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuX2NhbmNlbCgpO1xyXG4gICAgICAgIHRhc2sgPSB0aGlzLl90YXNrcy5zaGlmdCgpO1xyXG4gICAgICAgIHRoaXMuX3Byb2Nlc3NvcnMuc2hpZnQoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcGVyc2lzdCgpO1xyXG4gICAgICB9KVxyXG4gICAgICAudGhlbigoKSA9PiB0YXNrKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENhbmNlbHMgcHJvY2Vzc2luZyB0aGUgY3VycmVudCB0YXNrIGFuZCBpbnNlcnRzIGEgbmV3IHRhc2sgYXQgdGhlIGJlZ2lubmluZ1xyXG4gICAqIG9mIHRoZSBxdWV1ZS4gVGhpcyBuZXcgdGFzayB3aWxsIGJlIHByb2Nlc3NlZCBuZXh0LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtUYXNrfSB0YXNrXHJcbiAgICogQHJldHVybnMge1Byb21pc2U8dm9pZD59XHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgVGFza1F1ZXVlXHJcbiAgICovXHJcbiAgdW5zaGlmdCh0YXNrOiBUYXNrKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICByZXR1cm4gdGhpcy5fcmVpZmllZFxyXG4gICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5fY2FuY2VsKCk7XHJcbiAgICAgICAgdGhpcy5fdGFza3MudW5zaGlmdCh0YXNrKTtcclxuICAgICAgICB0aGlzLl9wcm9jZXNzb3JzLnVuc2hpZnQobmV3IFRhc2tQcm9jZXNzb3IodGhpcy5fcGVyZm9ybWVyLCB0YXNrKSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BlcnNpc3QoKTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBQcm9jZXNzZXMgYWxsIHRoZSB0YXNrcyBpbiB0aGUgcXVldWUuIFJlc29sdmVzIHdoZW4gdGhlIHF1ZXVlIGlzIGVtcHR5LlxyXG4gICAqXHJcbiAgICogQHJldHVybnMge1Byb21pc2U8YW55Pn1cclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBUYXNrUXVldWVcclxuICAgKi9cclxuICBwcm9jZXNzKCk6IFByb21pc2U8YW55PiB7XHJcbiAgICByZXR1cm4gdGhpcy5fcmVpZmllZFxyXG4gICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgbGV0IHJlc29sdXRpb24gPSB0aGlzLl9yZXNvbHV0aW9uO1xyXG5cclxuICAgICAgICBpZiAoIXJlc29sdXRpb24pIHtcclxuICAgICAgICAgIGlmICh0aGlzLl90YXNrcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgcmVzb2x1dGlvbiA9IE9yYml0LlByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLl9jb21wbGV0ZSgpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fZXJyb3IgPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLl9yZXNvbHV0aW9uID0gcmVzb2x1dGlvbiA9IG5ldyBPcmJpdC5Qcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgICB0aGlzLl9yZXNvbHZlID0gcmVzb2x2ZTtcclxuICAgICAgICAgICAgICB0aGlzLl9yZWplY3QgPSByZWplY3Q7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLl9zZXR0bGVFYWNoKHJlc29sdXRpb24pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc29sdXRpb247XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBfY29tcGxldGUoKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5fcmVzb2x2ZSkge1xyXG4gICAgICB0aGlzLl9yZXNvbHZlKCk7XHJcbiAgICB9XHJcbiAgICB0aGlzLl9yZXNvbHZlID0gbnVsbDtcclxuICAgIHRoaXMuX3JlamVjdCA9IG51bGw7XHJcbiAgICB0aGlzLl9lcnJvciA9IG51bGw7XHJcbiAgICB0aGlzLl9yZXNvbHV0aW9uID0gbnVsbDtcclxuICAgIHRoaXMuZW1pdCgnY29tcGxldGUnKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgX2ZhaWwodGFzaywgZSk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMuX3JlamVjdCkge1xyXG4gICAgICB0aGlzLl9yZWplY3QoZSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLl9yZXNvbHZlID0gbnVsbDtcclxuICAgIHRoaXMuX3JlamVjdCA9IG51bGw7XHJcbiAgICB0aGlzLl9lcnJvciA9IGU7XHJcbiAgICB0aGlzLl9yZXNvbHV0aW9uID0gbnVsbDtcclxuICAgIHRoaXMuZW1pdCgnZmFpbCcsIHRhc2ssIGUpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBfY2FuY2VsKCk6IHZvaWQge1xyXG4gICAgdGhpcy5fZXJyb3IgPSBudWxsO1xyXG4gICAgdGhpcy5fcmVzb2x1dGlvbiA9IG51bGw7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIF9zZXR0bGVFYWNoKHJlc29sdXRpb24pOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLl90YXNrcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgdGhpcy5fY29tcGxldGUoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGxldCB0YXNrID0gdGhpcy5fdGFza3NbMF07XHJcbiAgICAgIGxldCBwcm9jZXNzb3IgPSB0aGlzLl9wcm9jZXNzb3JzWzBdO1xyXG5cclxuICAgICAgdGhpcy5lbWl0KCdiZWZvcmVUYXNrJywgdGFzayk7XHJcblxyXG4gICAgICBwcm9jZXNzb3IucHJvY2VzcygpXHJcbiAgICAgICAgLnRoZW4oKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgaWYgKHJlc29sdXRpb24gPT09IHRoaXMuX3Jlc29sdXRpb24pIHtcclxuICAgICAgICAgICAgdGhpcy5fdGFza3Muc2hpZnQoKTtcclxuICAgICAgICAgICAgdGhpcy5fcHJvY2Vzc29ycy5zaGlmdCgpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fcGVyc2lzdCgpXHJcbiAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KCd0YXNrJywgdGFzayk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zZXR0bGVFYWNoKHJlc29sdXRpb24pO1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKChlKSA9PiB7XHJcbiAgICAgICAgICBpZiAocmVzb2x1dGlvbiA9PT0gdGhpcy5fcmVzb2x1dGlvbikge1xyXG4gICAgICAgICAgICB0aGlzLl9mYWlsKHRhc2ssIGUpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBfcmVpZnkoKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICB0aGlzLl90YXNrcyA9IFtdO1xyXG4gICAgdGhpcy5fcHJvY2Vzc29ycyA9IFtdO1xyXG5cclxuICAgIGlmICh0aGlzLl9idWNrZXQpIHtcclxuICAgICAgdGhpcy5fcmVpZmllZCA9IHRoaXMuX2J1Y2tldC5nZXRJdGVtKHRoaXMuX25hbWUpXHJcbiAgICAgICAgLnRoZW4odGFza3MgPT4ge1xyXG4gICAgICAgICAgaWYgKHRhc2tzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Rhc2tzID0gdGFza3M7XHJcbiAgICAgICAgICAgIHRoaXMuX3Byb2Nlc3NvcnMgPSB0YXNrcy5tYXAodGFzayA9PiBuZXcgVGFza1Byb2Nlc3Nvcih0aGlzLl9wZXJmb3JtZXIsIHRhc2spKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuX3JlaWZpZWQgPSBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5fcmVpZmllZDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgX3BlcnNpc3QoKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICB0aGlzLmVtaXQoJ2NoYW5nZScpO1xyXG4gICAgaWYgKHRoaXMuX2J1Y2tldCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5fYnVja2V0LnNldEl0ZW0odGhpcy5fbmFtZSwgdGhpcy5fdGFza3MpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIE9yYml0LlByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXX0=