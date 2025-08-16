export interface IUserIO {
    print(message: string): void; 
    question(prompt: string): Promise<string>;
    close(): void;                
}
