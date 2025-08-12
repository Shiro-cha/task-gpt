import type { IHttpClient } from "../../domains/interfaces/IHTTPClient";

export class FetchHttpClient implements IHttpClient {
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