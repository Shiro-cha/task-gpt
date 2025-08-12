export interface IHttpClient {
    post(url: string, body: any, headers?: Record<string, string>): Promise<string>;
}