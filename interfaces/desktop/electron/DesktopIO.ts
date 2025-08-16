import type { BrowserWindow } from "electron";
import type { IUserIO } from "../../../domains/interfaces/IUserIO";


export class DesktopIO implements IUserIO{
    constructor(private window: BrowserWindow) {}
    question(prompt: string): Promise<string> {
        throw new Error("Method not implemented.");
    }

    print(message: string): void {
    this.window.webContents.send("bot:print", message);
    }

    close(): void {
    this.window.webContents.send("bot:close");
    }
}