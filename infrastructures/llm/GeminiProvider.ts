import type { ILLM } from "../../domains/interfaces/ILLM";

interface IHttpClient {
    post(url: string, body: any, headers?: Record<string, string>): Promise<string>;
}

class FetchHttpClient implements IHttpClient {
    async post(url: string, body: any, headers: Record<string, string> = {}): Promise<string> {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.statusText}`);
        }

        return response.text();
    }
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