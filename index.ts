import { MessageFacade } from "./application/MessageFacade";
import { FeedbackFacade } from "./application/FeedbackFacade";
import { ExecutorFacade } from "./application/ExecutorFacade";
import { Message } from "./models/Message";
import { User } from "./models/User";
import { Command } from "./models/Command";

const message = new Message("1", "Hello, how are you?", new Date(), new User("1", "John Doe", "YV7Gj@example.com", new Date()));
const messageFacade = new MessageFacade(message);

console.log(messageFacade.sendMessage());
console.log(messageFacade.interpretMessage());

const feedback = "This is a great message!";

const feedbackFacade = new FeedbackFacade(feedback);
console.log(feedbackFacade.getFeedback());

const command = new Command("Sample Command", message, "ls -l", new Date(), "Pending");
const executorFacade = new ExecutorFacade(command);
console.log(executorFacade.executeCommand());