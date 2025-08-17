import type { BrowserWindow } from "electron";
import type { IUserIO } from "../domains/interfaces/IUserIO";
import { AppCLI } from "../interfaces/cli/AppCLI";
import { ConsoleIO } from "../interfaces/cli/ConsoleIO";
import type { CoreDeps } from "./bootstrapCore";
import { DesktopIO } from "../interfaces/desktop/DesktopIO";
import { AppDesktop } from "../interfaces/desktop/AppDesktop";

;

export function createCLIApp(core: CoreDeps) {
  const userIO: IUserIO = new ConsoleIO();
  return new AppCLI(core.messageFacade, core.executorFacadeFactory, userIO, core.user);
}

export function createDesktopApp(core: CoreDeps, mainWindow: BrowserWindow) {
  const userIO: IUserIO = new DesktopIO(mainWindow);
  return new AppDesktop(core.messageFacade, core.executorFacadeFactory, userIO, core.user);
}
