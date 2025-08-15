import { app, BrowserWindow } from "electron";
import path from "path";
import isDev from "electron-is-dev";

let mainWindow: BrowserWindow;
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);


function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const url = isDev
    ? "http://localhost:3000"
    : `file://${path.join(__dirname, "renderer/out/index.html")}`;

  mainWindow.loadURL(url);
}

app.on("ready", createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
