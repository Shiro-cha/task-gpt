import type { ExecutionLog } from "../models/ExecutionLog";

export class FeedbackFacade {

    log: ExecutionLog;
    constructor(log:ExecutionLog) {
    
        this.log = log;
    }
    getFeedback(): string {
        return this.log.feedback;
    }
}