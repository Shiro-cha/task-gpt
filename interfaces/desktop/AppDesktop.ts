import type { ExecutorFacade } from "../../application/ExecutorFacade";
import type { MessageFacade } from "../../application/MessageFacade";
import type { IApp } from "../../domains/interfaces/IApp";
import type { IUserIO } from "../../domains/interfaces/IUserIO";
import type { Command } from "../../domains/models/Command";
import type { User } from "../../domains/models/User";

export class AppDesktop implements IApp {
  constructor(
    private readonly messageFacade: MessageFacade,
    private readonly executorFacadeFactory: (command: Command) => ExecutorFacade,
    private readonly userIO: IUserIO,
    private readonly user: User
  ) {}

  async run(): Promise<void> {
    // Implementation for running the desktop application
  }
}