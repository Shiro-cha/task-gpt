import { MessageFacade } from "./application/MessageFacade";
import { FeedbackFacade } from "./application/FeedbackFacade";
import { ExecutorFacade } from "./application/ExecutorFacade";
import { Message } from "./models/Message";
import { User } from "./models/User";
import { Command } from "./models/Command";
import { ExecutionLog } from "./models/ExecutionLog";

const message = new Message("1", "Hello, how are you?", new Date(), new User("1", "John Doe", "YV7Gj@example.com", new Date()));
const messageFacade = new MessageFacade(message);

console.log(messageFacade.sendMessage());
console.log(messageFacade.interpretMessage());

const feedback = "This is a great message!";
const executigLog = new ExecutionLog("1", "Command executed successfully","ls -l",feedback, new Date(), "Success");

const feedbackFacade = new FeedbackFacade(executigLog);
console.log(feedbackFacade.getFeedback());

const command = new Command("This is a list command", message, "ls -l", new Date(), "Pending");
const executorFacade = new ExecutorFacade(command);
console.log(executorFacade.executeCommand());