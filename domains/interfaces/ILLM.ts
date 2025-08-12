export interface ILLM{
    sendMessage(message: string): Promise<string>;
}