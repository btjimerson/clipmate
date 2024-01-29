//Imports
const electron = require("electron");
const path = require("node:path");
const fs = require("node:fs");
const crypto = require("node:crypto");

//ClipboardStore class definition
class ClipboardStore{

    history = {
        histories: []
    }

    //Constructor
    constructor(opts) {
        const userDataPath = (electron.app || electron.remote.app).getPath("userData");
        this.fileName = path.join(userDataPath, opts.configName + ".json");
        fs.writeFile(this.fileName, "", (err) => {
            console.log("In callback with err: [" + err + "]");
        });
        try {
            this.history = JSON.parse(fs.readFileSync(this.fileName)); 
        } catch (e) {
            console.log("Error parsing json. Probably an empty file.");
        }
    }

    //Gets all of the clipboard history
    getHistory() {
        return this.history;
    }

    //Adds a clipboard item to the history
    addHistoryItem(historyItem) {
        const item = {
            id: crypto.randomUUID,
            createdDate: new Date(),
            clipboard: historyItem
        };
        this.history.histories.push(item);
        fs.writeFileSync(this.fileName, JSON.stringify(this.history));
    }
}

//Export the class
module.exports = ClipboardStore;
