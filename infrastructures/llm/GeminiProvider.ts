import type { ILLM } from "../../domains/interfaces/ILLM";
import { FetchHttpClient } from "../http/FetchHttpClient";

interface IHttpClient {
    post(url: string, body: any, headers?: Record<string, string>): Promise<string>;
}


export class GeminiProvider implements ILLM {
    private readonly apiUrl: string;
    private readonly apiKey: string;
    private readonly httpClient: IHttpClient;

    constructor(apiUrl: string,apikey:string, httpClient: IHttpClient = new FetchHttpClient()) {
        this.apiUrl = apiUrl;
        this.apiKey = apikey;
        this.httpClient = httpClient;
    }

    async sendMessage(message: string): Promise<string> {
        return this.httpClient.post(this.getUrlWithApiKey(), { message });
    }
    getUrlWithApiKey(): string {
        return `${this.apiUrl}?key=${this.apiKey}`;
    }
}