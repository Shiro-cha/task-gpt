import type { Message } from "../domains/models/Message";
import { generateContentWithGemini } from "../utils/gemini";

export class MessageFacade {
    constructor(private message: Message) {}


        async sendMessage(): Promise<string> {      
        return generateContentWithGemini(this.message.text) 
    
    }
    interpretMessage(): string {
        return `Message interpreted: ${this.message.text}`;
    }
}