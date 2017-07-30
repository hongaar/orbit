/**
 * Base exception class.
 *
 * @export
 * @class Exception
 */
export declare class Exception {
    message: string;
    error: Error;
    stack: string;
    /**
     * Creates an instance of Exception.
     *
     * @param {string} message
     *
     * @memberOf Exception
     */
    constructor(message: string);
}
/**
 * Exception raised when an item does not exist in a log.
 *
 * @export
 * @class NotLoggedException
 * @extends {Exception}
 */
export declare class NotLoggedException extends Exception {
    id: string;
    constructor(id: string);
}
/**
 * Exception raised when a value is outside an allowed range.
 *
 * @export
 * @class OutOfRangeException
 * @extends {Exception}
 */
export declare class OutOfRangeException extends Exception {
    value: number;
    constructor(value: number);
}
