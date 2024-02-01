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
        fs.access(this.fileName, fs.constants.R_OK | fs.constants.W_OK, (err) => {
            console.log(`${this.fileName} ${err ? 'is not writable, creating file' : 'is writeable'}`);
            if (err) fs.writeFile(this.fileName, "", (err) => {
                if (err) throw err;
                console.log(`Created new file ${this.fileName}`);
            })
        });
        try {
            this.history = JSON.parse(fs.readFileSync(this.fileName)); 
        } catch (e) {
            console.log(`Error parsing history json. ${e}`);
            this.history = {
                histories: []
            }
        }
    }

    //Gets all of the clipboard history
    getHistory = () => {
        return this.history;
    }

    //Adds a clipboard item to the history
    addHistoryItem = (historyItem) => {
        const item = {
            id: crypto.randomUUID,
            createdDate: new Date(),
            clipboard: historyItem
        };
        this.history.histories.push(item);
        fs.writeFileSync(this.fileName, JSON.stringify(this.history));
    }

    //Clears recent history
    clearHistory = () =>{
        this.history.histories = [];
        fs.writeFileSync(this.fileName, JSON.stringify(this.history));
        console.log(`Cleared recent history in file ${this.fileName}`);
    }
}

//Export the class
module.exports = ClipboardStore;
