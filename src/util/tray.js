//Imports
const { Tray, Menu } = require("electron/main");
const path = require("path");

//TrayGenerator class
class TrayGenerator {
    tray;
    mainWindow;

    //Constructor
    constructor(mainWindow) {
        this.tray = null;
        this.mainWindow = mainWindow;
    }

    //Toggles window visibility
    toggleWindow = () => {
        if (this.mainWindow.isVisibile()) {
            this.mainWindow.hide();
        } else {
            this.mainWindow.show();
            this.mainWindow.focus();
        }
    }

    //Builds the right click menu
    rightClickMenu = () => {
        const menu = [
            {
                role: "quit",
                accelerator: "Command+Q"
            },
            {
                type: "separator"
            },
            {
                label: "Toggle Window",
                
            }
        ];
        this.tray.popUpContextMenu(Menu.buildFromTemplate(menu));
    }

    //Creates the tray
    tray = () => {
        this.tray = new Tray(path.join(__dirname, "./icons/icon_32x32.png"));
        this.tray.setIgnoreDoubleClickEvents(true);
        this.tray.on("click", this.toggleWindow());
        this.tray.on("right-click", this.rightClickMenu());
    }
}

//Export the class
module.exports = TrayGenerator;