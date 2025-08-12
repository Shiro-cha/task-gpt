import type { ILLM } from "../../domains/interfaces/ILLM";
import { FetchHttpClient } from "../http/FetchHttpClient";

interface IHttpClient {
    post(url: string, body: any, headers?: Record<string, string>): Promise<string>;
}


export class GeminiProvider implements ILLM {
    private readonly apiUrl: string;
    private readonly httpClient: IHttpClient;

    constructor(apiUrl: string, httpClient: IHttpClient = new FetchHttpClient()) {
        this.apiUrl = apiUrl;
        this.httpClient = httpClient;
    }

    async sendMessage(message: string): Promise<string> {
        return this.httpClient.post(this.apiUrl, { message });
    }
}