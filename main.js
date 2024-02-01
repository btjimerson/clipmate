//Imports
const { app, ipcMain, BrowserWindow } = require("electron/main");
const path = require("node:path");
const ClipboardStore = require("./src/store/clipboardStore.js");

//Create a ClipboardStore object
const clipboardStore = new ClipboardStore({
    configName: "clipboard",
    defaults: {}
});

let window;

//Create window function
const createWindow = () => {
    window = new BrowserWindow({
        width: 1200, 
        height: 600,
        resizable: false,
        icon: path.join(__dirname, 'icons/icon.png'),
        webPreferences: {
            preload: path.join(__dirname, "src/preload.js")
        }
    });

    window.loadFile(path.join(__dirname, "public/index.html"));
}

//Create the window when the app is ready
app.whenReady().then(() => {

    //Create the main window
    createWindow();

    //Set up the clipboard event listener
    const clipboardListener = require("electron-clipboard-extended");
    clipboardListener.on("text-changed", () => {
        let clipboardItem = clipboardListener.readText();
        clipboardStore.addHistoryItem(clipboardItem);
        window.webContents.send("clipboard-update", JSON.stringify(clipboardStore.getHistory()));
    }).startWatching();

    //Handle the clear history event from the renderer
    ipcMain.on("clear-history", (_event) => {
        clipboardStore.clearHistory();
        clipboardListener.writeText("");
        window.webContents.send("clipboard-update", JSON.stringify(clipboardStore.getHistory()));
    });

    //Make sure there is an open window (applies to Mac)
    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {createWindow()};   
    });
});

//Close all windows on close for Windows and Linux
app.on("window-all-closed", () => {
    if (process.platform != "darwin") { app.quit };
});