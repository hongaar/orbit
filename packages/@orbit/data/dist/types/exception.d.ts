import { Exception } from '@orbit/core';
/**
 * An client-side error occurred while communicating with a remote server.
 *
 * @export
 * @class ClientError
 * @extends {Exception}
 */
export declare class ClientError extends Exception {
    description: string;
    constructor(description: string);
}
/**
 * A server-side error occurred while communicating with a remote server.
 *
 * @export
 * @class ServerError
 * @extends {Exception}
 */
export declare class ServerError extends Exception {
    description: string;
    constructor(description: string);
}
/**
 * A networking error occurred while attempting to communicate with a remote
 * server.
 *
 * @export
 * @class NetworkError
 * @extends {Exception}
 */
export declare class NetworkError extends Exception {
    description: string;
    constructor(description: string);
}
/**
 * A query expression could not be parsed.
 *
 * @export
 * @class QueryExpressionParseError
 * @extends {Exception}
 */
export declare class QueryExpressionParseError extends Exception {
    description: string;
    expression: any;
    constructor(description: string, expression: any);
}
/**
 * A query is invalid for a particular source.
 *
 * @export
 * @class QueryNotAllowed
 * @extends {Exception}
 */
export declare class QueryNotAllowed extends Exception {
    description: string;
    query: any;
    constructor(description: string, query: any);
}
/**
 * A transform is invalid for a particular source.
 *
 * @export
 * @class TransformNotAllowed
 * @extends {Exception}
 */
export declare class TransformNotAllowed extends Exception {
    description: string;
    transform: any;
    constructor(description: string, transform: any);
}
/**
 * An error occured related to the schema.
 *
 * @export
 * @class SchemaError
 */
export declare class SchemaError extends Exception {
    description: string;
    constructor(description: string);
}
/**
 * A model could not be found in the schema.
 *
 * @export
 * @class ModelNotFound
 */
export declare class ModelNotFound extends SchemaError {
    constructor(type: string);
}
/**
 * An error occurred related to a particular record.
 *
 * @export
 * @abstract
 * @class RecordException
 * @extends {Exception}
 */
export declare abstract class RecordException extends Exception {
    description: string;
    type: string;
    id: string;
    relationship: string;
    constructor(description: string, type: string, id: string, relationship?: string);
}
/**
 * A record could not be found.
 *
 * @export
 * @class RecordNotFoundException
 * @extends {RecordException}
 */
export declare class RecordNotFoundException extends RecordException {
    constructor(type: string, id: string);
}
/**
 * A relationship could not be found.
 *
 * @export
 * @class RelationshipNotFoundException
 * @extends {RecordException}
 */
export declare class RelationshipNotFoundException extends RecordException {
    constructor(type: string, id: string, relationship: string);
}
/**
 * The record already exists.
 *
 * @export
 * @class RecordAlreadyExistsException
 * @extends {RecordException}
 */
export declare class RecordAlreadyExistsException extends RecordException {
    constructor(type: string, id: string);
}
