import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';

const __dirname = path.resolve();

let mainWindow: BrowserWindow | null = null;
let loadingWindow: BrowserWindow | null = null;

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
      preload: path.join(__dirname, 'preload.js')
    }
  });

  loadingWindow.loadFile(
    path.join(__dirname, 'interfaces/desktop/electron/loading.html')
  );

  return loadingWindow;
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 500,
    height: 650,
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
  });

  return mainWindow;
}

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
    }
  }, 800);
}

app.whenReady().then(() => {
  createLoadingWindow();
  simulateCompilationProgress();

  ipcMain.on('progress-update', (event, data) => {
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
