import type { ExecutorFacade } from "../../application/ExecutorFacade";
import type { MessageFacade } from "../../application/MessageFacade";
import type { IApp } from "../../domains/interfaces/IApp";
import type { IUserIO } from "../../domains/interfaces/IUserIO";
import type { Command } from "../../domains/models/Command";
import type { User } from "../../domains/models/User";
import { ElectronApp } from "./electron/main";


export class AppDesktop implements IApp {
  constructor(
    private readonly messageFacade: MessageFacade,
    private readonly executorFacadeFactory: (command: Command) => ExecutorFacade,
    private readonly userIO: IUserIO,
    private readonly user: User
  ) {}

  async run(): Promise<void> {
    const electronApp = new ElectronApp();
    await electronApp.run();
  }
}