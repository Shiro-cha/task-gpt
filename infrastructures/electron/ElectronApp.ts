const electron = require('electron');
import type { BrowserWindow, IpcMain } from 'electron';
import path from 'path';

type Stage = { status: string; progress: number };

const { app, BrowserWindow, ipcMain, screen } = electron;

export class ElectronApp {
  private mainWindow: BrowserWindow | null = null;
  private loadingWindow: BrowserWindow | null = null;
  private readonly __dirname = path.resolve();

  private ipc: IpcMain = ipcMain;

  constructor(private nextURL: string = 'http://localhost:3000') {}

  private createLoadingWindow(): BrowserWindow {
    this.loadingWindow = new BrowserWindow({
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
        preload: path.join(this.__dirname, 'preload.js'),
      },
    });

    this.loadingWindow.loadFile(
      path.join(this.__dirname, 'interfaces/desktop/electron/loading.html')
    );

    return this.loadingWindow;
  }

  private createMainWindow(): BrowserWindow {
    const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;
    const winWidth = Math.round(screenWidth * 0.35);
    const winHeight = Math.round(screenHeight * 0.9);

    this.mainWindow = new BrowserWindow({
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
        preload: path.join(this.__dirname, 'preload.js'),
      },
    });

    this.mainWindow.loadURL(this.nextURL);

    this.mainWindow.once('ready-to-show', () => {
      this.loadingWindow?.close();
      this.loadingWindow = null;
      this.mainWindow?.show();
    });

    return this.mainWindow;
  }

  private simulateCompilationProgress(): void {
    const stages: Stage[] = [
      { status: 'Initializing assistant...', progress: 10 },
      { status: 'Loading modules...', progress: 30 },
      { status: 'Starting server...', progress: 50 },
      { status: 'Connecting APIs...', progress: 70 },
      { status: 'Finalizing...', progress: 90 },
      { status: 'Ready!', progress: 100 },
    ];

    let currentStage = 0;
    const interval = setInterval(() => {
      if (currentStage < stages.length && this.loadingWindow) {
        this.loadingWindow.webContents.send('progress-update', stages[currentStage]);
        currentStage++;
      } else {
        clearInterval(interval);
        this.createMainWindow();
      }
    }, 800);
  }

  private setupIpc(): void {
    this.ipc.on('progress-update', (_event, data: Stage) => {
      if (this.loadingWindow && !this.loadingWindow.isDestroyed()) {
        this.loadingWindow.webContents.send('progress-update', data);
      }
    });

    this.ipc.on('close-window', () => {
      this.mainWindow?.close();
      this.loadingWindow?.close();
    });
  }

  public run(onMainWindowReady?: (mainWindow: BrowserWindow) => void): void {
  app.whenReady().then(() => {
    this.createLoadingWindow();
    this.simulateCompilationProgress();
    this.setupIpc();

    // Après compilation simulée, on crée la fenêtre principale
    const mainWindow = this.createMainWindow();
    mainWindow.once('ready-to-show', () => {
      this.loadingWindow?.close();
      this.loadingWindow = null;
      mainWindow.show();

      // On appelle le callback si fourni
      if (onMainWindowReady) onMainWindowReady(mainWindow);
    });
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) this.createMainWindow();
  });
}

}
