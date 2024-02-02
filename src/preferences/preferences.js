//Imports
const ElectronPreferences = require("electron-preferences");
const { app } = require("electron");
const path = require("path");

const preferences = new ElectronPreferences({
    browserWindowOverrides: {
        title: "ClipChameleon Preferences",
    },
    css: "public/css/bootstrap.min.css",
    dataStore: path.join(app.getPath("userData"), "preferences.json"),
    defaults: {
        general: {
            focusAccelerator: "CommandOrControl+C",
            historyLength: 20,
            textDisplayLength: 100
        }
    },
    sections: [{
        id: "general",
        label: "General",
        icon: "single-01",
        form: {
            groups: [{
                fields: [
                    {
                        label: "Focus Key Combination",
                        key: "focusAccelerator",
                        type: "accelerator",
                        modifierRequired: true,
                        help: "Type your key combination to focus ClipChameleon"
                    },
                    {
                        label: "History Length",
                        key: "historyLength",
                        type: "number",
                        help: "The number of history items to keep."
                    },
                    {
                        label: "Text Display Length",
                        key: "textDisplayLength",
                        type: "number",
                        help: "The number of characters to display. This does not affect the actual clipboard item."
                    },
                    {
                        key: "savePreferences",
                        type: "button",
                        buttonLabel: "Save Preferences"
                    }
                ]
            }]
        }
    }]
});

module.exports = preferences;