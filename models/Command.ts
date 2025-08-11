import type { Message } from "./Message";

export class Command {
    name:string;
    message:Message;
    task:string;
    createdAt: Date;
    status: string;

    constructor(name: string, message: Message, task: string, createdAt: Date, status: string) {
        this.name = name;
        this.message = message;
        this.task = task;
        this.createdAt = createdAt;
        this.status = status;
    }
    
}