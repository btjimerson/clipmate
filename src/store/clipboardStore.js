//Imports
const { app, electron } = require("electron");
const path = require("node:path");
const fs = require("node:fs");
const crypto = require("node:crypto");

//ClipboardStore class definition
class ClipboardStore {

    /*
    History JSON structure:
      history = {
          histories: [
            item: {
                id: uuid,
                createdDate: Date(),
                clipboard: string
            }
          ]
      }
    */
    history = {
        clipboardItems: []
    }

    historyLength;

    //Constructor
    constructor(opts) {
        //Set the history length preference
        this.historyLength = opts.historyLength;

        //Get file name to save history to
        const userDataPath = app.getPath("userData");
        this.fileName = path.join(userDataPath, opts.configName + ".json");

        //Make sure the configuration file exists
        fs.access(this.fileName, fs.constants.R_OK | fs.constants.W_OK, (err) => {
            console.log(`${this.fileName} ${err ? 'is not writable, creating file' : 'is writeable'}`);
            if (err) fs.writeFile(this.fileName, "", (err) => {
                if (err) throw err;
                console.log(`Created new file ${this.fileName}`);
            })
        });

        //Read existing history entries
        try {
            this.history = JSON.parse(fs.readFileSync(this.fileName)); 
        } catch (e) {
            console.log(`Error parsing history json. ${e}`);
            this.history = {
                clipboardItems: []
            }
        }
    }

    //Gets all of the clipboard history
    getHistory = () => {
        return this.history;
    }

    //Adds a clipboard item to the history
    addClipboardItem = (clipboardItem) => {
        const item = {
            id: crypto.randomUUID,
            createdDate: new Date(),
            clipboard: clipboardItem
        };
        this.history.clipboardItems.unshift(item);
        this.validateAndSaveHistory();
    }

    //Truncates history items in the clipboardItems array if needed
    validateAndSaveHistory = () => {

        //Remove old histories if the array is too long
        if (this.historyLength > 0) {
            while (this.history.clipboardItems.length > this.historyLength) {
                this.history.clipboardItems.pop();
            };
        }
        fs.writeFileSync(this.fileName, JSON.stringify(this.history));

    }

    //Clears recent history
    clearHistory = () => {
        this.history.clipboardItems = [];
        fs.writeFileSync(this.fileName, JSON.stringify(this.history));
        console.log(`Cleared recent history in file ${this.fileName}`);
    }
}

//Export the class
module.exports = ClipboardStore;
