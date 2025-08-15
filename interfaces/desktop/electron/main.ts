import { app, BrowserWindow } from "electron";
import path from "path";
import isDev from "electron-is-dev";

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

let mainWindow: BrowserWindow;

async function waitForServer(url: string) {
  while (true) {
    try {
      const res = await fetch(url);
      if (res.ok) break; 
    } catch {}
    await new Promise(r => setTimeout(r, 100)); 
}
}

async function createWindow() {
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

  if (isDev) await waitForServer(url);
  mainWindow.loadURL(url);
}

app.on("ready", createWindow);
