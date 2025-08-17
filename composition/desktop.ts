import { bootstrapCore } from "./bootstrapCore";
import { createDesktopApp } from "./appFactory";
import type { BrowserWindow } from "electron";
import { ElectronApp } from "../infrastructures/electron/ElectronApp";

async function main() {
  const core = bootstrapCore();
  const electronApp = new ElectronApp("http://localhost:3000");

  electronApp.onReady((mainWindow: BrowserWindow | null) => {
    if (mainWindow) {
      const app = createDesktopApp(core, mainWindow);
      app.run();
    } else {
      console.error("Main window is null. Cannot start desktop app.");
    }
  });
}

main();
