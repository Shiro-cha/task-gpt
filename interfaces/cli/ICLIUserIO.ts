export interface ICLIUserIO {
    question(prompt: string): Promise<string>;
    print(message: string): void;
    close(): void;
}