//Imports
const electron = require("electron/main");
const path = require("node:path");
const ElectronPreferences = require("electron-preferences");

//Create preferences
/*const preferences = new ElectronPreferences({
    config: {
        dataStore: path.resolve(electron.app.getPath("userData"), "preferences.json"),
        debounce: 150
    },
    sections: [
        {
            id: "general",
            label: "General",
            icon: "world",
            form: {
                groups: [
                    {
                        fields: [
                            {
                                label: "Number of history items to keep",
                                key: "number_items",
                                type: "number",
                                help: "The number of items to keep in your history"
                            }
                        ]
                    }
                ]
            },
        },

    ],
    browserWindowOpts: {
        title: "ClipChameleon Preferences",
        width: 800,
        height: 400,
        resizable: true,
        maximizable: false
    }
});

//Export preferences
modules.export = preferences;*/