import { ipcMain, type BrowserWindow } from "electron";
import type { IUserIO } from "../../../domains/interfaces/IUserIO";

export class DesktopIO implements IUserIO {
    constructor(private window: BrowserWindow) {}

    question(prompt: string): Promise<string> {
        this.window.webContents.send("bot:question", prompt);
        return new Promise((resolve) => {
            const handler = (_event: Electron.IpcMainEvent, input: string) => {
                ipcMain.removeListener("user:input", handler);
                resolve(input);
            };
            ipcMain.on("user:input", handler);
        });
    }

    print(message: string): void {
        this.window.webContents.send("bot:print", message);
    }

    close(): void {
        this.window.webContents.send("bot:close");
    }
}