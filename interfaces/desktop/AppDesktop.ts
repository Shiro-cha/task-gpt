// src/interfaces/desktop/AppDesktop.ts
import type { ExecutorFacade } from "../../application/ExecutorFacade";
import { CommandFactory } from "../../application/factories/CommandFactory";
import type { MessageFacade } from "../../application/MessageFacade";
import type { Command } from "../../domains/models/Command";
import { Message } from "../../domains/models/Message";
import type { User } from "../../domains/models/User";
import type { IUserIO } from "../../domains/interfaces/IUserIO";
import type { IApp } from "../../domains/interfaces/IApp";

export class AppDesktop implements IApp {
  constructor(
    private readonly messageFacade: MessageFacade,
    private readonly executorFacadeFactory: (command: Command) => ExecutorFacade,
    private readonly userIO: IUserIO,
    private readonly user: User
  ) {}

  async run(): Promise<void> {
    let running = true;

    while (running) {
      const userInput = await this.userIO.question("\n ➜ 🚀 ");
      if (userInput.trim().toLowerCase() === "exit") {
        this.userIO.print("Goodbye!");
        running = false;
        continue;
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
        this.userIO.print(
          `Error: ${err instanceof Error ? err.message : String(err)}`
        );
      }
    }

    this.userIO.close();
  }
}
