import type { ILLM } from "../domains/interfaces/ILLM";
import type { Message } from "../domains/models/Message";
import { PromptBuilder } from "./services/PromptBuilder";


export class MessageFacade {
    constructor(private message: Message,private llmProvider: ILLM) {}


        async sendMessage(): Promise<string> {   
        const readyMessage = PromptBuilder.forCommand(this.message);   
        const resultMessage = this.llmProvider.sendMessage(readyMessage);
        return this.cleanJson(await resultMessage);
    
    }
    interpretMessage(): string {
        return `Message interpreted: ${this.message.text}`;
    }
    cleanJson(s: string) {
    s = s.replace(/```(\w+)?/g, "").trim()
    const m = s.match(/\{[\s\S]*\}/)
    return m ? m[0] : s
    }
}