export class FeedbackFacade {
    feedback: string;
    constructor(feedback: string) {
        this.feedback = feedback;
    }
    getFeedback(): string {
        return this.feedback;
    }
}