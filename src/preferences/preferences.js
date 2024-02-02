//Imports
const ElectronPreferences = require("electron-preferences");
const { app } = require("electron");
const path = require("path");

//User preferences
const preferences = new ElectronPreferences({
    config: {
        debounce: 10000,
    },
    browserWindowOverrides: {
        title: "ClipChameleon Preferences",
    },
    css: "public/css/bootstrap.min.css",
    dataStore: path.join(app.getPath("userData"), "preferences.json"),
    defaults: {
        general: {
            focusShortcut: "Alt+CmdOrCtrl+C",
            historyLength: 200,
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
                        label: "Window Focus Shortcut",
                        key: "focusShortcut",
                        type: "accelerator",
                        modifierRequired: true,
                        help: "Type your key combination to focus ClipChameleon. Requires restart to take effect!"
                    },
                    {
                        label: "History Length",
                        key: "historyLength",
                        type: "number",
                        help: "The number of clipboard items to keep. Use 0 to keep an infinite history (not recommended)"
                    },
                    {
                        label: "Text Display Length",
                        key: "textDisplayLength",
                        type: "number",
                        help: "The number of characters to display. Use 0 to disable text truncation. This does not affect the actual clipboard item."
                    },
                    {
                        key: "savePreferences",
                        type: "button",
                        buttonLabel: "Save Preferences"
                    },
                    {
                        key: "restoreDefaults",
                        type: "button",
                        buttonLabel: "Restore Defaults"
                    }
                ]
            }]
        }
    }]
});

//Export preferences
module.exports = preferences;