export class ExecutionLog {
    commandName: string;
    messageId: string;
    task: string;
    feedback: string;
    createdAt: Date;
    status: string;

    constructor(commandName: string, messageId: string, task: string,feedback: string, createdAt: Date, status: string) {
        this.commandName = commandName;
        this.messageId = messageId;
        this.task = task;
        this.feedback = feedback;
        this.createdAt = createdAt;
        this.status = status;
    }
}