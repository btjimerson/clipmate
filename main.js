//Imports
const { app, Tray, Menu, nativeImage, BrowserWindow } = require("electron/main");
const path = require("node:path");
const ClipboardStore = require("./src/store/clipboardStore.js");
//const preferences = require("./src/util/preferences.js");

//Create a ClipboardStore object
const clipboardStore = new ClipboardStore({
    configName: "clipboard",
    defaults: {}
});

let window;
let tray;

//Create window function
const createWindow = () => {
    window = new BrowserWindow({
        width: 1200, 
        height: 600,
        icon: path.join(__dirname, 'icons/icon.png'),
        webPreferences: {
            preload: path.join(__dirname, "src/preload.js")
        }
    });
    window.loadFile(path.join(__dirname, "public/index.html"));
}

//Create the window when the app is ready
app.whenReady().then(() => {

    const icon = nativeImage.createFromPath("./icons/chameleon_bw_16x16.png");
    tray = new Tray(icon);
    const contextMenu =  Menu.buildFromTemplate([
        {
            role: "quit",
            accelerator: "Command+Q"
        },
    ])
    tray.setContextMenu(contextMenu);
    tray.setToolTip("ClipChameleon");

    createWindow();

    //Set up the clipboard event listener
    const clipboardListener = require("electron-clipboard-extended");
    clipboardListener.on("text-changed", () => {
        let clipboardItem = clipboardListener.readText();
        clipboardStore.addHistoryItem(clipboardItem);
        window.webContents.send("clipboardUpdate", JSON.stringify(clipboardStore.getHistory()));
    }).startWatching();

    //Make sure there is an open window (applies to Mac)
    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {createWindow()};
    });
});

//Close all windows on close for Windows and Linux
app.on("window-all-closed", () => {
    if (process.platform != "darwin") { app.quit };
});