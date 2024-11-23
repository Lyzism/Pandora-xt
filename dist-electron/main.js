import { app, globalShortcut, BrowserWindow, ipcMain } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs")
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
  ipcMain.on("set-transparency", (_, transparency) => {
    if (win) {
      win.setOpacity(transparency);
    }
  });
  ipcMain.handle("get-app-version", () => {
    return app.getVersion();
  });
}
app.whenReady().then(() => {
  createWindow();
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
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.on("window-all-closed", () => {
  globalShortcut.unregisterAll();
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
