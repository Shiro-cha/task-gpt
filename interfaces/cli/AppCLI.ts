import type { ExecutorFacade } from "../../application/ExecutorFacade";
import { CommandFactory } from "../../application/factories/CommandFactory";
import type { MessageFacade } from "../../application/MessageFacade";
import type { Command } from "../../domains/models/Command";
import { Message } from "../../domains/models/Message";
import type { User } from "../../domains/models/User";
import type { IUserIO } from "../../domains/interfaces/IUserIO";
import type { IApp } from "../../domains/interfaces/IApp";

export class AppCLI implements IApp {
    constructor(
        private readonly messageFacade: MessageFacade,
        private readonly executorFacadeFactory: (command: Command) => ExecutorFacade,
        private readonly userIO: IUserIO,
        private readonly user: User
    ) {}

    async run(): Promise<void> {
        while (true) {
            const userInput = await this.userIO.question("\n ➜ 🚀 ");
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
                    const commandResponse = await executorFacade.executeCommand();
                    this.userIO.print(commandResponse);
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