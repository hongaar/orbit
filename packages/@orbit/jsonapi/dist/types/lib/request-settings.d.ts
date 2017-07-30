import { FetchSettings } from '../jsonapi-source';
export interface RequestOptions {
    filter?: any;
    sort?: any;
    page?: any;
    include?: any;
    timeout?: number;
}
export declare function buildFetchSettings(options: RequestOptions, settings?: FetchSettings): FetchSettings;
