//Imports
const { contextBridge, ipcRenderer } = require("electron");

//Add event listener for clipboard update
window.addEventListener("DOMContentLoaded", () => {
    const clipboardHistory = document.getElementById("clipboardHistory");
    ipcRenderer.on("clipboardUpdate", (_event, value) => {
        //Create an HTML list from the clipboard history
        jsonValue = JSON.parse(value);
        let html = "<ul class='list-unstyled'>";
        for (var i = 0; i < jsonValue.histories.length; i++) {
            var historyItem = jsonValue.histories[i];
            html += "<li>";
            html += "<button class=\"btn btn-light btn-sm\" onclick=\"writeToClipboard('";
            html += historyItem.clipboard;
            html += "')\">";
            html += "Copy to clipboard";
            html += "</button>&nbsp;";
            html += historyItem.clipboard;
            html += "</li>";
        }
        html += "</ul>";
        clipboardHistory.innerHTML = html;
    })
});

//Register ipc callbacks
contextBridge.exposeInMainWorld("electronApi", {
    onClipboardUpdate: (callback) => ipcRenderer.on("clipboardUpdate", (_event, value) => callback(value))
});



