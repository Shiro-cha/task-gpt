import { appConfig } from "./infrastructures/config/appConfig";
import { IMessageFacade, MessageFacade } from "./application/MessageFacade";
import { IExecutorFacade, ExecutorFacade } from "./application/ExecutorFacade";
import { Message } from "./domains/models/Message";
import { User } from "./domains/models/User";
import { Command } from "./domains/models/Command";
import { GeminiResponseValidator } from "./utils/GeminiResponseValidator";
import readline from "node:readline/promises";
import { IGeminiProvider, GeminiProvider } from "./infrastructures/llm/GeminiProvider";
import { IHttpClient, FetchHttpClient } from "./infrastructures/http/FetchHttpClient";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

class App {
    private messageFacade: IMessageFacade;
    private executorFacadeFactory: (command: Command) => IExecutorFacade;

    constructor(messageFacade: IMessageFacade, executorFacadeFactory: (command: Command) => IExecutorFacade) {
        this.messageFacade = messageFacade;
        this.executorFacadeFactory = executorFacadeFactory;
    }

    async run() {
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
                this.messageFacade.setMessage(message);

                const geminiResponse = await this.messageFacade.sendMessage();

                if (GeminiResponseValidator.isCommand(geminiResponse)) {
                    const responseJson = JSON.parse(geminiResponse);
                    const command = new Command(
                        responseJson.command_name,
                        responseJson.task.join(" && "),
                        new Date(),
                        "Pending"
                    );
                    const executorFacade = this.executorFacadeFactory(command);
                    await executorFacade.executeCommand();
                } else {
                    console.log(geminiResponse);
                }
            } catch (err) {
                console.error("Error:", err);
            }
        }
        rl.close();
    }
}

// Dependency creation
const httpClient: IHttpClient = new FetchHttpClient();
const llmProvider: IGeminiProvider = new GeminiProvider(appConfig.gemini.apiUrl, appConfig.gemini.apiKey, httpClient);
const messageFacade: IMessageFacade = new MessageFacade(undefined, llmProvider);
const executorFacadeFactory = (command: Command) => new ExecutorFacade(command);

const app = new App(messageFacade, executorFacadeFactory);
await app.run();
