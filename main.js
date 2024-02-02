//Imports
const { app, ipcMain, nativeImage, globalShortcut, BrowserWindow, Menu, Tray } = require("electron");
const path = require("path");
const ClipboardStore = require("./src/store/clipboardStore.js");
const preferences = require("./src/preferences/preferences.js");

//Create a ClipboardStore object
const clipboardStore = new ClipboardStore({
    configName: "clipboard",
    historyLength: preferences.value("general.historyLength"),
    defaults: {}
});

let mainWindow;
let tray;

//Update preferences
preferences.on("save", (newPreferences) =>{
    //Update the length of clipboard history
    clipboardStore.historyLength = newPreferences.general.historyLength;
    clipboardStore.validateAndSaveHistory();
});

//Create main window function
const createMainWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1200, 
        height: 600,
        resizable: false,
        icon: path.join(__dirname, 'icons/icon.png'),
        webPreferences: {
            preload: path.join(__dirname, "src/preload.js")
        }
    });

    mainWindow.loadFile(path.join(__dirname, "public/index.html"));
}

//Create tray function
const createTray = () => {
    const trayIcon = nativeImage.createFromPath(path.resolve(app.getAppPath(), "icons/chameleon_bw_transparent_16x16.png"));
    tray = new Tray(trayIcon);
    const contextMenu = Menu.buildFromTemplate([
        {
            label: "Close Window",
            role: "close",
            accelerator: "CommandOrControl+Q"
        }
    ]);
    tray.setContextMenu(contextMenu);
}

//Save the user preferences and close the window
//Note that preferences are automatically saved so we don't
//really need to save them here
preferences.on("click", (key) => {
    if (key === "savePreferences") {
        preferences.save();
        preferences.close();
    } else if (key === "restoreDefaults") {
        preferences.resetToDefaults();
        preferences.close();
    }
});

//App is ready, create everything
app.whenReady().then(() => {

    //Create the main window
    createMainWindow();

    //Register shortcut preference to focus the main window
    globalShortcut.register(preferences.value("general.focusShortcut"), () => {
        mainWindow.focus();
    });      
    
    //Create the tray
    //createTray();

    //Get the initial history
    ipcMain.handle("getHistory", async (_event) => {
        return JSON.stringify(clipboardStore.getHistory());
    });

    //Set up the clipboard event listener
    const clipboardListener = require("electron-clipboard-extended");
    clipboardListener.on("text-changed", () => {
        let clipboardItem = clipboardListener.readText();
        clipboardStore.addClipboardItem(clipboardItem);
        try {
            mainWindow.webContents.send("clipboardUpdated", JSON.stringify(clipboardStore.getHistory()));
        } catch (err) {
            console.log(`Error sending clipboard update: ${err}`);
        }
    }).startWatching();

    //Handle the clear history event from the renderer
    ipcMain.on("clearHistory", (_event) => {
        clipboardStore.clearHistory();
        clipboardListener.writeText("");
        try {
            mainWindow.webContents.send("clipboardUpdated", JSON.stringify(clipboardStore.getHistory()));
        } catch (err) {
            console.log(`Error sending clipboard update: ${err}`);
        }
    });

});

//Close all windows on close for Windows and Linux
app.on("window-all-closed", () => {
    if (process.platform != "darwin") { app.quit };
});

//Make sure there is an open window (applies to Mac)
app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {createMainWindow()};   
});