import { ipcMain, app, globalShortcut, BrowserWindow, nativeImage, Tray, Menu } from "electron";
import { spawn } from "child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
let tray;
let serverProcess = null;
function startServer() {
  const serverExecutable = path.join(process.resourcesPath, "server", "server.exe");
  console.log("Starting server from:", serverExecutable);
  serverProcess = spawn(serverExecutable, [], {
    cwd: path.dirname(serverExecutable),
    env: {
      ...process.env,
      NODE_ENV: "production"
    }
  });
  if (serverProcess == null ? void 0 : serverProcess.stdout) {
    serverProcess.stdout.on("data", (data) => {
      console.log(`Server output: ${data.toString()}`);
    });
  }
  if (serverProcess == null ? void 0 : serverProcess.stderr) {
    serverProcess.stderr.on("data", (data) => {
      console.error(`Server error: ${data.toString()}`);
    });
  }
  serverProcess.on("close", (code) => {
    console.log(`Server exited with code ${code}`);
  });
  serverProcess.on("error", (err) => {
    console.error("Failed to start server process:", err.message);
  });
}
function stopServer() {
  if (serverProcess) {
    serverProcess.kill();
    console.log("Server process stopped.");
    serverProcess = null;
  }
}
function createWindow() {
  win = new BrowserWindow({
    width: 800,
    //optional
    height: 600,
    //optional
    icon: path.join(process.env.VITE_PUBLIC, "pandora-icon.ico"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      nodeIntegration: false,
      contextIsolation: true
    }
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
  win.on("close", (event) => {
    if (app.isQuiting) {
      return;
    }
    event.preventDefault();
    win == null ? void 0 : win.hide();
  });
  createTrayIcon();
}
function createTrayIcon() {
  const icon = nativeImage.createFromPath(path.join(process.env.VITE_PUBLIC, "pandora-icon.ico"));
  tray = new Tray(icon);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Open Appication",
      click: () => {
        win == null ? void 0 : win.show();
      }
    },
    { type: "separator" },
    {
      label: "Quit",
      click: () => {
        app.isQuiting = true;
        app.quit();
      }
    }
  ]);
  tray.setToolTip("Pandora XTS");
  tray.setContextMenu(contextMenu);
  tray.on("double-click", () => {
    win == null ? void 0 : win.show();
  });
}
ipcMain.on("set-transparency", (_, transparency) => {
  if (win) {
    win.setOpacity(transparency / 100);
  }
});
ipcMain.handle("get-app-version", () => {
  return app.getVersion();
});
app.whenReady().then(() => {
  createWindow();
  startServer();
  globalShortcut.register("Ctrl+=", () => {
    if (win) {
      const currentOpacity = win.getOpacity();
      if (currentOpacity < 1) {
        const newOpacity = Math.min(currentOpacity + 0.1, 1);
        win.setOpacity(newOpacity);
        win.webContents.send("update-transparency", newOpacity * 100);
      }
    }
  });
  globalShortcut.register("Ctrl+-", () => {
    if (win) {
      const currentOpacity = win.getOpacity();
      if (currentOpacity > 0.1) {
        const newOpacity = Math.max(currentOpacity - 0.1, 0.1);
        win.setOpacity(newOpacity);
        win.webContents.send("update-transparency", newOpacity * 100);
      }
    }
  });
  globalShortcut.register("`", () => {
    if (win == null ? void 0 : win.isVisible()) {
      win.hide();
    } else {
      win == null ? void 0 : win.show();
    }
  });
  globalShortcut.register("Shift+Esc", () => {
    app.isQuiting = true;
    stopServer();
    app.quit();
  });
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  } else {
    win == null ? void 0 : win.show();
  }
});
app.on("window-all-closed", () => {
  globalShortcut.unregisterAll();
  stopServer();
  if (process.platform !== "darwin") {
    app.quit();
  }
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
