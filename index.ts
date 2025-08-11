import dotenv from 'dotenv'
dotenv.config()
import { MessageFacade } from "./application/MessageFacade";
import { FeedbackFacade } from "./application/FeedbackFacade";
import { ExecutorFacade } from "./application/ExecutorFacade";
import { Message } from "./models/Message";
import { User } from "./models/User";
import { Command } from "./models/Command";
import { ExecutionLog } from "./models/ExecutionLog";
import { GeminiResponseValidator } from './utils/GeminiResponseValidator';




const message = new Message("1", "Hello, please show all connected users", new Date(), new User("1", "John Doe", "YV7Gj@example.com", new Date()));
const messageFacade = new MessageFacade(message);
const geminiResponse = await messageFacade.sendMessage();
console.log("GEMINI RESPONSE:", geminiResponse);
 if(GeminiResponseValidator.isCommand(geminiResponse)){
    const repsonseJson = JSON.parse(geminiResponse);
    const command = new Command(repsonseJson.command_name, repsonseJson.task.join(" && "), new Date(), "Pending");
    const executorFacade = new ExecutorFacade(command);
    executorFacade.executeCommand()
}

const feedback = "This is a great message!";
const executigLog = new ExecutionLog("1", "Command executed successfully","ls -l",feedback, new Date(), "Success");

const feedbackFacade = new FeedbackFacade(executigLog);
console.log(feedbackFacade.getFeedback());
