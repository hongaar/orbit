"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var main_1 = require("./main");
/**
 * A `TaskProcessor` performs a `Task` by calling `perform()` on its target.
 * This is triggered by calling `process()` on the processor.
 *
 * A processor maintains a promise that represents the eventual state (resolved
 * or rejected) of the task. This promise is created upon construction, and
 * will be returned by calling `settle()`.
 *
 * A task can be re-tried by first calling `reset()` on the processor. This
 * will clear the processor's state and allow `process()` to be invoked again.
 *
 * @export
 * @class TaskProcessor
 */
var TaskProcessor = function () {
    /**
     * Creates an instance of TaskProcessor.
     *
     * @param {Taskable} target Target that performs tasks
     * @param {Task} task Task to be performed
     *
     * @memberOf TaskProcessor
     */
    function TaskProcessor(target, task) {
        this.target = target;
        this.task = task;
        this.reset();
    }
    /**
     * Clears the processor state, allowing for a fresh call to `process()`.
     *
     * @memberOf TaskProcessor
     */
    TaskProcessor.prototype.reset = function () {
        var _this = this;
        this._started = false;
        this._settled = false;
        this._settlement = new main_1.default.Promise(function (resolve, reject) {
            _this._success = function (r) {
                _this._settled = true;
                resolve(r);
            };
            _this._fail = function (e) {
                _this._settled = true;
                reject(e);
            };
        });
    };
    Object.defineProperty(TaskProcessor.prototype, "started", {
        /**
         * Has `process` been invoked?
         *
         * @readonly
         * @type {boolean}
         * @memberOf TaskProcessor
         */
        get: function () {
            return this._started;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TaskProcessor.prototype, "settled", {
        /**
         * Has `process` been invoked and settled?
         *
         * @readonly
         * @type {boolean}
         * @memberOf TaskProcessor
         */
        get: function () {
            return this._settled;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * The eventual result of processing.
     *
     * @returns {Promise<any>}
     *
     * @memberOf TaskProcessor
     */
    TaskProcessor.prototype.settle = function () {
        return this._settlement;
    };
    /**
     * Invokes `perform` on the target.
     *
     * @returns {Promise<any>} The result of processing
     *
     * @memberOf TaskProcessor
     */
    TaskProcessor.prototype.process = function () {
        if (!this._started) {
            this._started = true;
            this.target.perform(this.task).then(this._success, this._fail);
        }
        return this.settle();
    };
    return TaskProcessor;
}();
exports.default = TaskProcessor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFzay1wcm9jZXNzb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzcmMvdGFzay1wcm9jZXNzb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUJBQTJCO0FBRzNCLEFBYUc7Ozs7Ozs7Ozs7Ozs7O0FBQ0gsZ0NBVUUsQUFPRztBQUNIOzs7Ozs7OzsyQkFBWSxBQUFpQixRQUFFLEFBQVUsTUFDdkMsQUFBSTthQUFDLEFBQU0sU0FBRyxBQUFNLEFBQUMsQUFDckIsQUFBSTthQUFDLEFBQUksT0FBRyxBQUFJLEFBQUMsQUFFakIsQUFBSTthQUFDLEFBQUssQUFBRSxBQUFDLEFBQ2YsQUFBQztBQUVELEFBSUc7QUFDSDs7Ozs7NEJBQUssUUFBTCxZQUFBO29CQUNFLEFBQUksQUFhTDthQWJNLEFBQVEsV0FBRyxBQUFLLEFBQUMsQUFDdEIsQUFBSTthQUFDLEFBQVEsV0FBRyxBQUFLLEFBQUMsQUFDdEIsQUFBSTthQUFDLEFBQVcsa0JBQU8sT0FBSyxRQUFDLEFBQU8sUUFBQyxVQUFDLEFBQU8sU0FBRSxBQUFNLFFBQ25ELEFBQUk7a0JBQUMsQUFBUSxXQUFHLFVBQUMsQUFBQyxHQUNoQixBQUFJO3NCQUFDLEFBQVEsV0FBRyxBQUFJLEFBQUMsQUFDckIsQUFBTzt3QkFBQyxBQUFDLEFBQUMsQUFBQyxBQUNiLEFBQUMsQUFBQztBQUVGLEFBQUk7a0JBQUMsQUFBSyxRQUFHLFVBQUMsQUFBQyxHQUNiLEFBQUk7c0JBQUMsQUFBUSxXQUFHLEFBQUksQUFBQyxBQUNyQixBQUFNO3VCQUFDLEFBQUMsQUFBQyxBQUFDLEFBQ1osQUFBQyxBQUFDLEFBQ0o7QUFBQyxBQUFDLEFBQUMsQUFDTDtBQVhxQixBQVdwQjtBQVNEOzBCQUFJLHlCQUFPOzs7Ozs7OzthQUFYLFlBQ0UsQUFBTTttQkFBQyxBQUFJLEtBQUMsQUFBUSxBQUFDLEFBQ3ZCLEFBQUM7OztzQkFBQSxBQVNEO0FBbEJBLEFBTUc7MEJBWUMseUJBQU87Ozs7Ozs7O2FBQVgsWUFDRSxBQUFNO21CQUFDLEFBQUksS0FBQyxBQUFRLEFBQUMsQUFDdkIsQUFBQzs7O3NCQUFBLEFBRUQsQUFNRztBQWpCSCxBQU1HO0FBWUg7Ozs7Ozs7NEJBQU0sU0FBTixZQUNFLEFBQU07ZUFBQyxBQUFJLEtBQUMsQUFBVyxBQUFDLEFBQzFCLEFBQUM7QUFFRCxBQU1HO0FBQ0g7Ozs7Ozs7NEJBQU8sVUFBUCxZQUNFLEFBQUUsQUFBQztZQUFDLENBQUMsQUFBSSxLQUFDLEFBQVEsQUFBQyxVQUFDLEFBQUMsQUFDbkIsQUFBSTtpQkFBQyxBQUFRLFdBQUcsQUFBSSxBQUFDLEFBRXJCLEFBQUk7aUJBQUMsQUFBTSxPQUFDLEFBQU8sUUFBQyxBQUFJLEtBQUMsQUFBSSxBQUFDLE1BQzNCLEFBQUksS0FBQyxBQUFJLEtBQUMsQUFBUSxVQUFFLEFBQUksS0FBQyxBQUFLLEFBQUMsQUFBQyxBQUNyQyxBQUFDO0FBRUQsQUFBTTtlQUFDLEFBQUksS0FBQyxBQUFNLEFBQUUsQUFBQyxBQUN2QixBQUFDO0FBQ0g7V0FoR0EsQUFnR0EsQUFBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBPcmJpdCBmcm9tICcuL21haW4nO1xyXG5pbXBvcnQgeyBUYXNrLCBQZXJmb3JtZXIgfSBmcm9tICcuL3Rhc2snO1xyXG5cclxuLyoqXHJcbiAqIEEgYFRhc2tQcm9jZXNzb3JgIHBlcmZvcm1zIGEgYFRhc2tgIGJ5IGNhbGxpbmcgYHBlcmZvcm0oKWAgb24gaXRzIHRhcmdldC5cclxuICogVGhpcyBpcyB0cmlnZ2VyZWQgYnkgY2FsbGluZyBgcHJvY2VzcygpYCBvbiB0aGUgcHJvY2Vzc29yLlxyXG4gKlxyXG4gKiBBIHByb2Nlc3NvciBtYWludGFpbnMgYSBwcm9taXNlIHRoYXQgcmVwcmVzZW50cyB0aGUgZXZlbnR1YWwgc3RhdGUgKHJlc29sdmVkXHJcbiAqIG9yIHJlamVjdGVkKSBvZiB0aGUgdGFzay4gVGhpcyBwcm9taXNlIGlzIGNyZWF0ZWQgdXBvbiBjb25zdHJ1Y3Rpb24sIGFuZFxyXG4gKiB3aWxsIGJlIHJldHVybmVkIGJ5IGNhbGxpbmcgYHNldHRsZSgpYC5cclxuICogXHJcbiAqIEEgdGFzayBjYW4gYmUgcmUtdHJpZWQgYnkgZmlyc3QgY2FsbGluZyBgcmVzZXQoKWAgb24gdGhlIHByb2Nlc3Nvci4gVGhpc1xyXG4gKiB3aWxsIGNsZWFyIHRoZSBwcm9jZXNzb3IncyBzdGF0ZSBhbmQgYWxsb3cgYHByb2Nlc3MoKWAgdG8gYmUgaW52b2tlZCBhZ2Fpbi5cclxuICpcclxuICogQGV4cG9ydFxyXG4gKiBAY2xhc3MgVGFza1Byb2Nlc3NvclxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGFza1Byb2Nlc3NvciB7XHJcbiAgdGFyZ2V0OiBQZXJmb3JtZXI7XHJcbiAgdGFzazogVGFzaztcclxuXHJcbiAgcHJpdmF0ZSBfc3RhcnRlZDogYm9vbGVhbjtcclxuICBwcml2YXRlIF9zZXR0bGVkOiBib29sZWFuO1xyXG4gIHByaXZhdGUgX3NldHRsZW1lbnQ6IFByb21pc2U8YW55PjtcclxuICBwcml2YXRlIF9zdWNjZXNzOiAocmVzb2x1dGlvbjogYW55KSA9PiB2b2lkO1xyXG4gIHByaXZhdGUgX2ZhaWw6IChlOiBFcnJvcikgPT4gdm9pZDtcclxuICBcclxuICAvKipcclxuICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIFRhc2tQcm9jZXNzb3IuXHJcbiAgICogXHJcbiAgICogQHBhcmFtIHtUYXNrYWJsZX0gdGFyZ2V0IFRhcmdldCB0aGF0IHBlcmZvcm1zIHRhc2tzXHJcbiAgICogQHBhcmFtIHtUYXNrfSB0YXNrIFRhc2sgdG8gYmUgcGVyZm9ybWVkXHJcbiAgICogXHJcbiAgICogQG1lbWJlck9mIFRhc2tQcm9jZXNzb3JcclxuICAgKi9cclxuICBjb25zdHJ1Y3Rvcih0YXJnZXQ6IFBlcmZvcm1lciwgdGFzazogVGFzaykge1xyXG4gICAgdGhpcy50YXJnZXQgPSB0YXJnZXQ7XHJcbiAgICB0aGlzLnRhc2sgPSB0YXNrO1xyXG5cclxuICAgIHRoaXMucmVzZXQoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENsZWFycyB0aGUgcHJvY2Vzc29yIHN0YXRlLCBhbGxvd2luZyBmb3IgYSBmcmVzaCBjYWxsIHRvIGBwcm9jZXNzKClgLlxyXG4gICAqIFxyXG4gICAqIEBtZW1iZXJPZiBUYXNrUHJvY2Vzc29yXHJcbiAgICovXHJcbiAgcmVzZXQoKTogdm9pZCB7XHJcbiAgICB0aGlzLl9zdGFydGVkID0gZmFsc2U7XHJcbiAgICB0aGlzLl9zZXR0bGVkID0gZmFsc2U7XHJcbiAgICB0aGlzLl9zZXR0bGVtZW50ID0gbmV3IE9yYml0LlByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICB0aGlzLl9zdWNjZXNzID0gKHIpID0+IHtcclxuICAgICAgICB0aGlzLl9zZXR0bGVkID0gdHJ1ZTtcclxuICAgICAgICByZXNvbHZlKHIpO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgdGhpcy5fZmFpbCA9IChlKSA9PiB7XHJcbiAgICAgICAgdGhpcy5fc2V0dGxlZCA9IHRydWU7XHJcbiAgICAgICAgcmVqZWN0KGUpO1xyXG4gICAgICB9O1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBIYXMgYHByb2Nlc3NgIGJlZW4gaW52b2tlZD9cclxuICAgKiBcclxuICAgKiBAcmVhZG9ubHlcclxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cclxuICAgKiBAbWVtYmVyT2YgVGFza1Byb2Nlc3NvclxyXG4gICAqL1xyXG4gIGdldCBzdGFydGVkKCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuX3N0YXJ0ZWQ7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBIYXMgYHByb2Nlc3NgIGJlZW4gaW52b2tlZCBhbmQgc2V0dGxlZD9cclxuICAgKiBcclxuICAgKiBAcmVhZG9ubHlcclxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cclxuICAgKiBAbWVtYmVyT2YgVGFza1Byb2Nlc3NvclxyXG4gICAqL1xyXG4gIGdldCBzZXR0bGVkKCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuX3NldHRsZWQ7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBUaGUgZXZlbnR1YWwgcmVzdWx0IG9mIHByb2Nlc3NpbmcuXHJcbiAgICogXHJcbiAgICogQHJldHVybnMge1Byb21pc2U8YW55Pn0gXHJcbiAgICogXHJcbiAgICogQG1lbWJlck9mIFRhc2tQcm9jZXNzb3JcclxuICAgKi9cclxuICBzZXR0bGUoKTogUHJvbWlzZTxhbnk+IHtcclxuICAgIHJldHVybiB0aGlzLl9zZXR0bGVtZW50O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogSW52b2tlcyBgcGVyZm9ybWAgb24gdGhlIHRhcmdldC5cclxuICAgKiBcclxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxhbnk+fSBUaGUgcmVzdWx0IG9mIHByb2Nlc3NpbmdcclxuICAgKiBcclxuICAgKiBAbWVtYmVyT2YgVGFza1Byb2Nlc3NvclxyXG4gICAqL1xyXG4gIHByb2Nlc3MoKTogUHJvbWlzZTxhbnk+IHtcclxuICAgIGlmICghdGhpcy5fc3RhcnRlZCkge1xyXG4gICAgICB0aGlzLl9zdGFydGVkID0gdHJ1ZTtcclxuXHJcbiAgICAgIHRoaXMudGFyZ2V0LnBlcmZvcm0odGhpcy50YXNrKVxyXG4gICAgICAgIC50aGVuKHRoaXMuX3N1Y2Nlc3MsIHRoaXMuX2ZhaWwpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLnNldHRsZSgpO1xyXG4gIH1cclxufVxyXG4iXX0=