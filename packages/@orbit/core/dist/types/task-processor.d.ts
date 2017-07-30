import { Task, Performer } from './task';
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
export default class TaskProcessor {
    target: Performer;
    task: Task;
    private _started;
    private _settled;
    private _settlement;
    private _success;
    private _fail;
    /**
     * Creates an instance of TaskProcessor.
     *
     * @param {Taskable} target Target that performs tasks
     * @param {Task} task Task to be performed
     *
     * @memberOf TaskProcessor
     */
    constructor(target: Performer, task: Task);
    /**
     * Clears the processor state, allowing for a fresh call to `process()`.
     *
     * @memberOf TaskProcessor
     */
    reset(): void;
    /**
     * Has `process` been invoked?
     *
     * @readonly
     * @type {boolean}
     * @memberOf TaskProcessor
     */
    readonly started: boolean;
    /**
     * Has `process` been invoked and settled?
     *
     * @readonly
     * @type {boolean}
     * @memberOf TaskProcessor
     */
    readonly settled: boolean;
    /**
     * The eventual result of processing.
     *
     * @returns {Promise<any>}
     *
     * @memberOf TaskProcessor
     */
    settle(): Promise<any>;
    /**
     * Invokes `perform` on the target.
     *
     * @returns {Promise<any>} The result of processing
     *
     * @memberOf TaskProcessor
     */
    process(): Promise<any>;
}
