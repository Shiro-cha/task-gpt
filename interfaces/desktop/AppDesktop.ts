import { BrowserWindow } from "electron";
import type { ExecutorFacade } from "../../application/ExecutorFacade";
import type { MessageFacade } from "../../application/MessageFacade";
import type { IApp } from "../../domains/interfaces/IApp";
import type { IUserIO } from "../../domains/interfaces/IUserIO";
import type { Command } from "../../domains/models/Command";
import type { User } from "../../domains/models/User";
import { ElectronApp } from "./electron/ElectronApp";
import { DesktopIO } from "./DesktopIO";


export class AppDesktop implements IApp {
  constructor(
    private readonly messageFacade: MessageFacade,
    private readonly executorFacadeFactory: (command: Command) => ExecutorFacade,
    private readonly userIO: DesktopIO,
    private readonly user: User
  ) {}

  async run(): Promise<void> {
    this.userIO.question("Welcome to Echo! Type 'exit' to quit.");
    this.userIO.print("Starting Echo...");
    const electronApp = new ElectronApp();
    await electronApp.run();
  }
}