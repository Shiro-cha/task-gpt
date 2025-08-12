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
        const response = await this.httpClient.post(this.getUrlWithApiKey(), this.buildHttpBody(message));
        return this.getResponseText(response);
    }
    getUrlWithApiKey(): string {
        return `${this.apiUrl}?key=${this.apiKey}`;
    }
    buildHttpBody(message: string): any {
        return {
        contents: [
          {
            parts: [
              {
                text: message,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 200,
        }
      }
    }
    getResponseText(response: string): string {
        const jsonResponse = JSON.parse(response);
        if (jsonResponse && jsonResponse.candidates && jsonResponse.candidates.length > 0) {
            return jsonResponse.candidates[0].content.parts[0].text;
        }
        throw new Error("Invalid response format");
    }
}