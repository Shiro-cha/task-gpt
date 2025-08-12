import { appConfig } from "./infrastructures/config/appConfig";
import {  MessageFacade } from "./application/MessageFacade";
import { ExecutorFacade } from "./application/ExecutorFacade";
import { Message } from "./domains/models/Message";
import { User } from "./domains/models/User";
import { Command } from "./domains/models/Command";
import {  GeminiProvider } from "./infrastructures/llm/GeminiProvider";
import {  FetchHttpClient } from "./infrastructures/http/FetchHttpClient";
import type { IUserIO } from "./interfaces/cli/IUserIO";
import { ConsoleIO } from "./interfaces/cli/ConsoleIO";
import { CommandFactory } from "./application/factories/CommandFactory";
import type { IHttpClient } from "./domains/interfaces/IHTTPClient";

class App {
    constructor(
        private readonly messageFacade: MessageFacade,
        private readonly executorFacadeFactory: (command: Command) => ExecutorFacade,
        private readonly userIO: IUserIO,
        private readonly user: User
    ) {}

    async run(): Promise<void> {
        while (true) {
            const userInput = await this.userIO.question("\nEnter your message (or 'exit' to quit): ");
            if (userInput.trim().toLowerCase() === "exit") {
                this.userIO.print("Goodbye!");
                break;
            }
            if (!userInput.trim()) {
                this.userIO.print("Input cannot be empty. Please enter a message.");
                continue;
            }
            try {
                const message = new Message(
                    this.user.id,
                    userInput,
                    new Date(),
                    this.user
                );
                this.messageFacade.setMessage(message);

                const geminiResponse = await this.messageFacade.sendMessage();

                const command = CommandFactory.createFromGeminiResponse(geminiResponse);
                if (command) {
                    const executorFacade = this.executorFacadeFactory(command);
                    await executorFacade.executeCommand();
                } else {
                    this.userIO.print(geminiResponse);
                }
            } catch (err) {
                this.userIO.print(`Error: ${err instanceof Error ? err.message : String(err)}`);
            }
        }
        this.userIO.close();
    }
}


const httpClient: IHttpClient = new FetchHttpClient();
const llmProvider: GeminiProvider = new GeminiProvider(appConfig.gemini.apiUrl, appConfig.gemini.apiKey, httpClient);
const messageFacade: MessageFacade = new MessageFacade(undefined, llmProvider);
const executorFacadeFactory = (command: Command) => new ExecutorFacade(command);
const userIO: IUserIO = new ConsoleIO();
const user = new User("1", "Nomena", "nomena@gmail.com", new Date());

const app = new App(messageFacade, executorFacadeFactory, userIO, user);
await app.run();
