import type { BrowserWindow } from "electron";
import type { IUserIO } from "../../../domains/interfaces/IUserIO";


export class DesktopIO implements IUserIO{
    constructor(private window: BrowserWindow) {}

  print(message: string): void {
    this.window.webContents.send("bot:print", message);
  }

  close(): void {
    this.window.webContents.send("bot:close");
  }
}