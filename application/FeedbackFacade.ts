import type { ExecutionLog } from "../domains/models/ExecutionLog";

export class FeedbackFacade {

    log: ExecutionLog;
    constructor(log:ExecutionLog) {
    
        this.log = log;
    }
    getFeedback(): string {
        return ` Feedback for command ${this.log.commandName} on message ${this.log.messageId}: ${this.log.feedback}`;
    }
}