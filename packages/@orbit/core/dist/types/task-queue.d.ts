import { Task, Performer } from './task';
import TaskProcessor from './task-processor';
import { Bucket } from './bucket';
import { Evented } from './evented';
/**
 * Settings for a `TaskQueue`.
 *
 * @export
 * @interface TaskQueueSettings
 */
export interface TaskQueueSettings {
    /**
     * Name used for tracking and debugging a task queue.
     *
     * @type {string}
     * @memberOf TaskQueueSettings
     */
    name?: string;
    /**
     * A bucket in which to persist queue state.
     *
     * @type {Bucket}
     * @memberOf TaskQueueSettings
     */
    bucket?: Bucket;
    /**
     * A flag indicating whether tasks should be processed as soon as they are
     * pushed into a queue. Set to `false` to override the default `true`
     * behavior.
     *
     * @type {boolean}
     * @memberOf TaskQueueSettings
     */
    autoProcess?: boolean;
}
export declare type TASK_QUEUE_EVENTS = 'complete' | 'fail' | 'beforeTask' | 'task' | 'change';
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
export default class TaskQueue implements Evented {
    autoProcess: boolean;
    private _name;
    private _performer;
    private _bucket;
    private _tasks;
    private _processors;
    private _error;
    private _resolution;
    private _resolve;
    private _reject;
    private _reified;
    on: (event: TASK_QUEUE_EVENTS, callback: Function, binding?: object) => void;
    off: (event: TASK_QUEUE_EVENTS, callback: Function, binding?: object) => void;
    one: (event: TASK_QUEUE_EVENTS, callback: Function, binding?: object) => void;
    emit: (event: TASK_QUEUE_EVENTS, ...args) => void;
    listeners: (event: TASK_QUEUE_EVENTS) => any[];
    /**
     * Creates an instance of `TaskQueue`.
     *
     * @param {Performer} target
     * @param {TaskQueueOptions} [options={}]
     *
     * @memberOf TaskQueue
     */
    constructor(target: Performer, settings?: TaskQueueSettings);
    /**
     * Name used for tracking / debugging this queue.
     *
     * @readonly
     * @type {string}
     * @memberOf TaskQueue
     */
    readonly name: string;
    /**
     * The object which will `perform` the tasks in this queue.
     *
     * @readonly
     * @type {Performer}
     * @memberOf TaskQueue
     */
    readonly performer: Performer;
    /**
     * A bucket used to persist the state of this queue.
     *
     * @readonly
     * @type {Bucket}
     * @memberOf TaskQueue
     */
    readonly bucket: Bucket;
    /**
     * The number of tasks in the queue.
     *
     * @readonly
     * @type {number}
     * @memberOf TaskQueue
     */
    readonly length: number;
    /**
     * The tasks in the queue.
     *
     * @readonly
     * @type {Task[]}
     * @memberOf TaskQueue
     */
    readonly entries: Task[];
    /**
     * The current task being processed (if actively processing), or the next
     * task to be processed (if not actively processing).
     *
     * @readonly
     * @type {Task}
     * @memberOf TaskQueue
     */
    readonly current: Task;
    /**
     * The processor wrapper that is processing the current task (or next task,
     * if none are being processed).
     *
     * @readonly
     * @type {TaskProcessor}
     * @memberOf TaskQueue
     */
    readonly currentProcessor: TaskProcessor;
    /**
     * If an error occurs while processing a task, processing will be halted, the
     * `fail` event will be emitted, and this property will reflect the error
     * encountered.
     *
     * @readonly
     * @type {Error}
     * @memberOf TaskQueue
     */
    readonly error: Error;
    /**
     * Is the queue empty?
     *
     * @readonly
     * @type {boolean}
     * @memberOf TaskQueue
     */
    readonly empty: boolean;
    /**
     * Is the queue actively processing a task?
     *
     * @readonly
     * @type {boolean}
     * @memberOf TaskQueue
     */
    readonly processing: boolean;
    /**
     * Resolves when the queue has been fully reified from its associated bucket,
     * if applicable.
     *
     * @readonly
     * @type {Promise<void>}
     * @memberOf TaskQueue
     */
    readonly reified: Promise<void>;
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
    push(task: Task): Promise<void>;
    /**
     * Cancels and re-tries processing the current task.
     *
     * @returns {Promise<void>}
     *
     * @memberOf TaskQueue
     */
    retry(): Promise<void>;
    /**
     * Cancels and discards the current task and proceeds to process the next
     * task.
     *
     * @returns {Promise<void>}
     *
     * @memberOf TaskQueue
     */
    skip(): Promise<void>;
    /**
     * Cancels the current task and completely clears the queue.
     *
     * @returns {Promise<void>}
     *
     * @memberOf TaskQueue
     */
    clear(): Promise<void>;
    /**
     * Cancels the current task and removes it, but does not continue processing.
     *
     * @returns {Promise<Task>}
     *
     * @memberOf TaskQueue
     */
    shift(): Promise<Task>;
    /**
     * Cancels processing the current task and inserts a new task at the beginning
     * of the queue. This new task will be processed next.
     *
     * @param {Task} task
     * @returns {Promise<void>}
     *
     * @memberOf TaskQueue
     */
    unshift(task: Task): Promise<void>;
    /**
     * Processes all the tasks in the queue. Resolves when the queue is empty.
     *
     * @returns {Promise<any>}
     *
     * @memberOf TaskQueue
     */
    process(): Promise<any>;
    private _complete();
    private _fail(task, e);
    private _cancel();
    private _settleEach(resolution);
    private _reify();
    private _persist();
}
