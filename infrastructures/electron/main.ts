import { app, BrowserWindow, ipcMain, screen } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { runner } from './runner.ts';




let mainWindow: BrowserWindow | null = null;
let loadingWindow: BrowserWindow | null = null;

// ==================== Fonctions "DesktopIO" intégrées ====================

function print(message: string): void {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send("bot:print", message);
  }
}

function question(prompt: string): Promise<string> {
  if (!mainWindow || mainWindow.isDestroyed()) {
    return Promise.reject(new Error("Main window is not ready"));
  }

  mainWindow.webContents.send("bot:question", prompt);

  return new Promise((resolve) => {
    const handler = (_event: Electron.IpcMainEvent, input: string) => {
      ipcMain.removeListener("user:input", handler);
      resolve(input);
    };
    ipcMain.on("user:input", handler);
  });
}

// ==================== Fenêtres ====================

function createLoadingWindow() {
  loadingWindow = new BrowserWindow({
    width: 400,
    height: 300,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    movable: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'interfaces/desktop/electron/preload.js')
    }
  });

  loadingWindow.loadFile(path.join(__dirname, 'interfaces/desktop/electron/loading.html'));
  return loadingWindow;
}

function createMainWindow() {
  const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;
  const winWidth = Math.round(screenWidth * 0.35);
  const winHeight = Math.round(screenHeight * 0.90);

  mainWindow = new BrowserWindow({
    width: winWidth,
    height: winHeight,
    minWidth: 400,
    minHeight: 500,
    show: false,
    frame: true,
    alwaysOnTop: true,
    resizable: false,
    movable: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadURL('http://localhost:3000');

  mainWindow.once('ready-to-show', () => {
    if (loadingWindow) {
      loadingWindow.close();
      loadingWindow = null;
    }
    mainWindow?.show();

    // Exemple d'utilisation directe
    print("Bienvenue dans l'assistant !");
    question("Comment veux-tu commencer ?").then(answer => {
      print(`Tu as répondu : ${answer}`);
    });
  });

  return mainWindow;
}

// ==================== Progression et IPC ====================

function simulateCompilationProgress() {
  const stages = [
    { status: 'Initializing assistant...', progress: 10 },
    { status: 'Loading modules...', progress: 30 },
    { status: 'Starting server...', progress: 50 },
    { status: 'Connecting APIs...', progress: 70 },
    { status: 'Finalizing...', progress: 90 },
    { status: 'Ready!', progress: 100 }
  ];

  let currentStage = 0;

  const interval = setInterval(() => {
    if (currentStage < stages.length && loadingWindow) {
      loadingWindow.webContents.send('progress-update', stages[currentStage]);
      currentStage++;
    } else {
      clearInterval(interval);
      createMainWindow();
      runner(print, question);
    }
  }, 800);
}

// ==================== App ready ====================

app.whenReady().then(() => {
  createLoadingWindow();
  simulateCompilationProgress();
  

  ipcMain.on('progress-update', (_event, data) => {
    if (loadingWindow && !loadingWindow.isDestroyed()) {
      loadingWindow.webContents.send('progress-update', data);
    }
  });

  ipcMain.on('close-window', () => {
    if (mainWindow && !mainWindow.isDestroyed()) mainWindow.close();
    if (loadingWindow && !loadingWindow.isDestroyed()) loadingWindow.close();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
});
