import type { ILLM } from "../domains/interfaces/ILLM";
import type { Message } from "../domains/models/Message";
import { PromptBuilder } from "./services/PromptBuilder";


export class MessageFacade {
    constructor(private message: Message|undefined,private llmProvider: ILLM) {}


        async sendMessage(): Promise<string> {   
        if (!this.message) {
            throw new Error("Message is undefined.");
        }
        const readyMessage = PromptBuilder.forCommand(this.message);   
        const resultMessage = this.llmProvider.sendMessage(readyMessage);
        return this.cleanJson(await resultMessage);
    
    }
    interpretMessage(): string {
        if (!this.message) {
            throw new Error("Message is undefined.");
        }
        return `Message interpreted: ${this.message.text}`;
    }
    setMessage(message: Message): void {
        this.message = message;
    }
    cleanJson(s: string) {
    s = s.replace(/```(\w+)?/g, "").trim()
    const m = s.match(/\{[\s\S]*\}/)
    return m ? m[0] : s
    }
}