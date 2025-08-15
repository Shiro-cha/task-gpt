import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  sendMessage: (channel: string, data: any) => ipcRenderer.send(channel, data),
  onMessage: (channel: string, callback: (data: any) => void) => {
    ipcRenderer.on(channel, (_, data) => callback(data));
  },
  sendStatus: (status: any) => ipcRenderer.send('compilation-status', status),
  onProgressUpdate: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => ipcRenderer.on('progress-update', callback)
});
