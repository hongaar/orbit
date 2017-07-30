import { Source, SourceSettings, Query, QueryOrExpression, Pullable, Pushable, Transform, TransformOrOperations } from '@orbit/data';
import JSONAPISerializer, { JSONAPISerializerSettings } from './jsonapi-serializer';
export interface FetchSettings {
    headers?: object;
    method?: string;
    json?: object;
    body?: string;
    params?: any;
    timeout?: number;
}
export interface JSONAPISourceSettings extends SourceSettings {
    maxRequestsPerTransform?: number;
    namespace?: string;
    host?: string;
    defaultFetchHeaders?: object;
    defaultFetchTimeout?: number;
    SerializerClass?: (new (settings: JSONAPISerializerSettings) => JSONAPISerializer);
}
/**
 Source for accessing a JSON API compliant RESTful API with a network fetch
 request.

 If a single transform or query requires more than one fetch request,
 requests will be performed sequentially and resolved together. From the
 perspective of Orbit, these operations will all succeed or fail together. The
 `maxRequestsPerTransform` and `maxRequestsPerQuery` settings allow limits to be
 set on this behavior. These settings should be set to `1` if your client/server
 configuration is unable to resolve partially successful transforms / queries.

 @class JSONAPISource
 @extends Source
 */
export default class JSONAPISource extends Source implements Pullable, Pushable {
    maxRequestsPerTransform: number;
    namespace: string;
    host: string;
    defaultFetchHeaders: object;
    defaultFetchTimeout: number;
    serializer: JSONAPISerializer;
    pull: (queryOrExpression: QueryOrExpression, options?: object, id?: string) => Promise<Transform[]>;
    push: (transformOrOperations: TransformOrOperations, options?: object, id?: string) => Promise<Transform[]>;
    constructor(settings?: JSONAPISourceSettings);
    _push(transform: Transform): Promise<Transform[]>;
    _pull(query: Query): Promise<Transform[]>;
    fetch(url: string, settings?: FetchSettings): Promise<any>;
    protected handleFetchResponse(response: any): Promise<any>;
    protected handleFetchResponseError(response: any, data?: any): Promise<any>;
    protected handleFetchError(e: any): Promise<any>;
    responseHasContent(response: any): boolean;
    resourceNamespace(type?: string): string;
    resourceHost(type?: string): string;
    resourcePath(type: string, id?: string): string;
    resourceURL(type: string, id?: string): string;
    resourceRelationshipURL(type: string, id: string, relationship: string): string;
    relatedResourceURL(type: string, id: string, relationship: string): string;
    protected _processRequests(requests: any, processors: any): Promise<Transform[]>;
}
