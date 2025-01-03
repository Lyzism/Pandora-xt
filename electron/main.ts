import { app, BrowserWindow, globalShortcut, ipcMain, Tray, Menu, nativeImage } from 'electron';
import { spawn } from 'child_process';
import { fileURLToPath } from 'node:url'
import path from 'node:path'

interface ExtendedApp extends Electron.App {
  isQuiting?: boolean;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))

process.env.APP_ROOT = path.join(__dirname, '..')

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null
let tray: Tray | null
let serverProcess: ReturnType<typeof spawn> | null = null;

function startServer() {
  const serverExecutable = path.join(process.resourcesPath, 'server', 'server.exe');
  console.log('Starting server from:', serverExecutable);

  serverProcess = spawn(serverExecutable, [], {
    cwd: path.dirname(serverExecutable),
    env: {
      ...process.env,
      NODE_ENV: 'production',
    },
  });

  if (serverProcess?.stdout) {
    serverProcess.stdout.on('data', (data: Buffer) => {
      console.log(`Server output: ${data.toString()}`);
    });
  }

  if (serverProcess?.stderr) {
    serverProcess.stderr.on('data', (data: Buffer) => {
      console.error(`Server error: ${data.toString()}`);
    });
  }

  serverProcess.on('close', (code: number) => {
    console.log(`Server exited with code ${code}`);
  });

  serverProcess.on('error', (err: Error) => {
    console.error('Failed to start server process:', err.message);
  });
}

function stopServer() {
  if (serverProcess) {
    serverProcess.kill();
    console.log('Server process stopped.');
    serverProcess = null;
  }
}

function createWindow() {
  win = new BrowserWindow({
    width: 800, //optional
    height: 600, //optional
    icon: path.join(process.env.VITE_PUBLIC, 'pandora-icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }

  win.on('close', (event) => {
    if ((app as ExtendedApp).isQuiting) {
      return;
    }
    event.preventDefault();
    win?.hide();
  });

  createTrayIcon();
}

function createTrayIcon() {
  const icon = nativeImage.createFromPath(path.join(process.env.VITE_PUBLIC, 'pandora-icon.ico'));
  
  tray = new Tray(icon);
  
  const contextMenu = Menu.buildFromTemplate([
    { 
      label: 'Open Appication', 
      click: () => {
        win?.show();
      } 
    },
    { type: 'separator' },
    { 
      label: 'Quit', 
      click: () => {
        (app as ExtendedApp).isQuiting = true;
        app.quit();
      } 
    }
  ]);

  tray.setToolTip('Pandora XTS');
  tray.setContextMenu(contextMenu);

  tray.on('double-click', () => {
    win?.show();
  });
}

ipcMain.on('set-transparency', (_, transparency: number) => {
  if (win) {
    const newOpacity = Math.round(transparency * 100) / 100;
    win.setOpacity(newOpacity);
    win.webContents.send('update-transparency', Math.round(newOpacity * 100));
  }
});

ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

app.whenReady().then(() => {
  createWindow();
  startServer();

  globalShortcut.register('Ctrl+=', () => {
    if (win) {
      const currentOpacity = win.getOpacity();
      if (currentOpacity < 1) {
        const newOpacity = Math.min(currentOpacity + 0.1, 1);
        win.setOpacity(newOpacity);
        win.webContents.send('update-transparency', Math.round(newOpacity * 100));
      }
    }
  });
  
  globalShortcut.register('Ctrl+-', () => {
    if (win) {
      const currentOpacity = win.getOpacity();
      if (currentOpacity > 0.1) {
        const newOpacity = Math.max(currentOpacity - 0.1, 0.1);
        win.setOpacity(newOpacity);
        win.webContents.send('update-transparency', Math.round(newOpacity * 100));
      }
    }
  });

  globalShortcut.register('`', () => {
    if (win?.isVisible()) {
      win.hide();
    } else {
      win?.show();
    }
  });
  
  globalShortcut.register('Shift+Esc', () => {
    (app as ExtendedApp).isQuiting = true;
    stopServer();
    app.quit();
  });
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  } else {
    win?.show();
  }
});

app.on('window-all-closed', () => {
  globalShortcut.unregisterAll();
  stopServer();
  if (process.platform !== 'darwin') {
    app.quit()
  }
});