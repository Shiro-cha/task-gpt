import type { Command } from "../models/Command";

export class ExecutorFacade{
    constructor(private command: Command) {}   
    executeCommand(): string {
        return `Command : ${this.command.task}`;
    }
}