//Imports
const { app, ipcMain, BrowserWindow, dialog } = require("electron");
const path = require("path");
const ClipboardStore = require("./src/store/clipboardStore.js");
const preferences = require("./src/preferences/preferences.js");

//Create a ClipboardStore object
const clipboardStore = new ClipboardStore({
    configName: "clipboard",
    defaults: {}
});

let mainWindow;

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

//Save the user preferences and close the window
//Note that preferences are automatically saved so we don't
//really need to save them here
preferences.on("click", (key) => {
    if (key === "savePreferences") {
        console.log(`Saving preferences to ${preferences.dataStore}`);
        preferences.save();
        preferences.close();
    }
});

//App is ready, create everything
app.whenReady().then(() => {

    //Create the main window
    createMainWindow();         

    //Get the initial history
    ipcMain.handle("getHistory", async (_event) => {
        return JSON.stringify(clipboardStore.getHistory());
    });

    //Set up the clipboard event listener
    const clipboardListener = require("electron-clipboard-extended");
    clipboardListener.on("text-changed", () => {
        let clipboardItem = clipboardListener.readText();
        clipboardStore.addHistoryItem(clipboardItem);
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