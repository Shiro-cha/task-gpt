import type { ILLM } from "../domains/interfaces/ILLM";
import type { Message } from "../domains/models/Message";


export class MessageFacade {
    constructor(private message: Message,private llmProvider: ILLM) {}


        async sendMessage(): Promise<string> {      
        return this.llmProvider.sendMessage(this.message.text);
    
    }
    interpretMessage(): string {
        return `Message interpreted: ${this.message.text}`;
    }
}