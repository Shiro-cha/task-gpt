import type { ILLM } from "../domains/interfaces/ILLM";
import type { Message } from "../domains/models/Message";
import { PromptBuilder } from "./services/PromptBuilder";


export class MessageFacade {
    constructor(private message: Message,private llmProvider: ILLM) {}


        async sendMessage(): Promise<string> {   
        const readyMessage = PromptBuilder.forCommand(this.message);   
        return this.llmProvider.sendMessage(readyMessage);
    
    }
    interpretMessage(): string {
        return `Message interpreted: ${this.message.text}`;
    }
}