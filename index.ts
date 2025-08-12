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

// IUserIO interface for input/output abstraction
interface IUserIO {
    question(prompt: string): Promise<string>;
    print(message: string): void;
    close(): void;
}

// ConsoleIO implementation using readline
class ConsoleIO implements IUserIO {
    private rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    async question(prompt: string): Promise<string> {
        return await this.rl.question(prompt);
    }

    print(message: string): void {
        console.log(message);
    }

    close(): void {
        this.rl.close();
    }
}

// CommandFactory for SRP
class CommandFactory {
    static createFromGeminiResponse(response: string): Command | null {
        if (!GeminiResponseValidator.isCommand(response)) return null;
        try {
            const responseJson = JSON.parse(response);
            if (
                typeof responseJson.command_name !== "string" ||
                !Array.isArray(responseJson.task)
            ) {
                return null;
            }
            return new Command(
                responseJson.command_name,
                responseJson.task.join(" && "),
                new Date(),
                "Pending"
            );
        } catch {
            return null;
        }
    }
}

// App class
class App {
    constructor(
        private readonly messageFacade: IMessageFacade,
        private readonly executorFacadeFactory: (command: Command) => IExecutorFacade,
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

// Dependency creation
const httpClient: IHttpClient = new FetchHttpClient();
const llmProvider: IGeminiProvider = new GeminiProvider(appConfig.gemini.apiUrl, appConfig.gemini.apiKey, httpClient);
const messageFacade: IMessageFacade = new MessageFacade(undefined, llmProvider);
const executorFacadeFactory = (command: Command) => new ExecutorFacade(command);
const userIO: IUserIO = new ConsoleIO();
const user = new User("1", "John Doe", "YV7Gj@example.com", new Date());

const app = new App(messageFacade, executorFacadeFactory, userIO, user);
await app.run();
