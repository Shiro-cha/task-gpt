import { appConfig } from "./infrastructures/config/appConfig";
import { MessageFacade } from "./application/MessageFacade";
import { FeedbackFacade } from "./application/FeedbackFacade";
import { ExecutorFacade } from "./application/ExecutorFacade";
import { Message } from "./domains/models/Message";
import { User } from "./domains/models/User";
import { Command } from "./domains/models/Command";
import { ExecutionLog } from "./domains/models/ExecutionLog";
import { GeminiResponseValidator } from "./utils/GeminiResponseValidator";
import readline from "node:readline/promises";
import { GeminiProvider } from "./infrastructures/llm/GeminiProvider";
import { FetchHttpClient } from "./infrastructures/http/FetchHttpClient";


const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

async function mainLoop() {
	while (true) {
		const userInput = await rl.question("\nEnter your message (or 'exit' to quit): ");

		if (userInput.trim().toLowerCase() === "exit") {
			console.log("Goodbye!");
			break;
		}

		try {
			const message = new Message(
				"1",
				userInput,
				new Date(),
				new User("1", "John Doe", "YV7Gj@example.com", new Date())
			);
            const llmProvider = new GeminiProvider(appConfig.gemini.apiUrl,appConfig.gemini.apiKey, new FetchHttpClient());
			const messageFacade = new MessageFacade(message,llmProvider);
			const geminiResponse = await messageFacade.sendMessage();

			if (GeminiResponseValidator.isCommand(geminiResponse)) {
				const responseJson = JSON.parse(geminiResponse);
				const command = new Command(
					responseJson.command_name,
					responseJson.task.join(" && "),
					new Date(),
					"Pending"
				);
				const executorFacade = new ExecutorFacade(command);
				await executorFacade.executeCommand();
			} else {
				console.log(geminiResponse);
			}

	
			// const feedback = "This is a great message!";
			// const executingLog = new ExecutionLog(
			// 	"1",
			// 	"Command executed successfully",
			// 	"ls -l",
			// 	feedback,
			// 	new Date(),
			// 	"Success"
			// );
			// const feedbackFacade = new FeedbackFacade(executingLog);
			// console.log(feedbackFacade.getFeedback());
		} catch (err) {
			console.error("Error:", err);
		}
	}
	rl.close();
}


await mainLoop();
