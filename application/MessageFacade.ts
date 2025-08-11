import type { Message } from "../models/Message";

export class MessageFacade {
    constructor(private message: Message) {}


    sendMessage(): string {       
        return `Message sent: ${this.message.text}`;
    }
    interpretMessage(): string {
        return `Message interpreted: ${this.message.text}`;
    }
}