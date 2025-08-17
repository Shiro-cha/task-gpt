import { app, BrowserWindow, ipcMain, screen } from 'electron';
import path from 'path';

export class ElectronApp {
  private mainWindow: BrowserWindow | null = null;
  private loadingWindow: BrowserWindow | null = null;
  private readonly __dirname = path.resolve();

  constructor(private nextURL: string = 'http://localhost:3000') {}

  private createLoadingWindow() {
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

  private createMainWindow() {
    const { width: screenWidth, height: screenHeight } =
      screen.getPrimaryDisplay().workAreaSize;
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
      if (this.loadingWindow) {
        this.loadingWindow.close();
        this.loadingWindow = null;
      }
      this.mainWindow?.show();
    });

    return this.mainWindow;
  }

  private simulateCompilationProgress() {
    const stages = [
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

  private setupIpc() {
    ipcMain.on('progress-update', (_event, data) => {
      if (this.loadingWindow && !this.loadingWindow.isDestroyed()) {
        this.loadingWindow.webContents.send('progress-update', data);
      }
    });

    ipcMain.on('close-window', () => {
      if (this.mainWindow && !this.mainWindow.isDestroyed()) this.mainWindow.close();
      if (this.loadingWindow && !this.loadingWindow.isDestroyed()) this.loadingWindow.close();
    });
  }

  private run() {
    app.whenReady().then(() => {
      this.createLoadingWindow();
      this.simulateCompilationProgress();
      this.setupIpc();
    });

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') app.quit();
    });

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) this.createMainWindow();
    });
  }

  public onReady(callback: (mainWindow: BrowserWindow | null) => void) {
    this.run();
    const mainWindow = this.mainWindow;
    callback(mainWindow);
  }
}
