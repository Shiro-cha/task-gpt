import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';

let mainWindow: BrowserWindow | null = null;
let loadingWindow: BrowserWindow | null = null;

function createLoadingWindow() {
  loadingWindow = new BrowserWindow({
    width: 600,
    height: 400,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  loadingWindow.loadFile('loading.html');
  return loadingWindow;
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
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
    { status: 'Resolving dependencies...', progress: 10 },
    { status: 'Building modules...', progress: 25 },
    { status: 'Optimizing dependencies...', progress: 40 },
    { status: 'Starting Turbopack...', progress: 60 },
    { status: 'Compiling components...', progress: 80 },
    { status: 'Finalizing compilation...', progress: 95 },
    { status: 'Ready! Launching app...', progress: 100 }
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
  }, 1000);
}

app.whenReady().then(() => {
  const loadingWin = createLoadingWindow();
  simulateCompilationProgress();

  ipcMain.on('compilation-status', (event, status) => {
    if (loadingWin && !loadingWin.isDestroyed()) {
      loadingWin.webContents.send('progress-update', status);
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});