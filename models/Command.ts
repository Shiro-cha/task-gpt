import type { Message } from "./Message";

export class Command {
    name:string;
    task:string;
    createdAt: Date;
    status: string;

    constructor(name: string, task: string, createdAt: Date, status: string) {
        this.name = name;
        this.task = task;
        this.createdAt = createdAt;
        this.status = status;
    }
    
}