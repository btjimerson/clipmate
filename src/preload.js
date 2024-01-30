//Imports
const { contextBridge, ipcRenderer } = require("electron");

//Add event listener for clipboard update
window.addEventListener("DOMContentLoaded", () => {
    const clipboardHistory = document.getElementById("clipboardHistory");
    ipcRenderer.on("clipboardUpdate", (_event, value) => {
        //Create an HTML list from the clipboard history
        jsonValue = JSON.parse(value);
        let html = "";
        for (var i = 0; i < jsonValue.histories.length; i++) {
            var historyItem = jsonValue.histories[i];
            if (i == 0 || i % 3 == 0 ) {
                //Begin new row
                html += "<div class=\"row mb-3\">";
                html += "<div class=\"card-group\">";
            }
            html += "<div class=\"card\" style=\"width: 18rem;\">";
            html += "<div class=\"card-body\">"
            html += "<p class=\"card-text\">"
            html += historyItem.clipboard
            html += "</p>"
            html += "<button class=\"btn btn-primary btn-sm\" onclick=\"writeToClipboard('";
            html += historyItem.clipboard;
            html += "')\">";
            html += "Copy to clipboard";
            html += "</button>";
            html += "</div>";
            html += "<div class=\"card-footer text-body-secondary\">"
            html += getElapsedTime(historyItem.createdDate);
            html += "</div>"
            html += "</div>";
            if (i == 2 || i % 3 == 2 || i == jsonValue.histories.length) {
                // End row
                html += "</div>";
                html += "</div>";
            }
        }
        clipboardHistory.innerHTML = html;
    })
});

//Register ipc callbacks
contextBridge.exposeInMainWorld("electronApi", {
    onClipboardUpdate: (callback) => ipcRenderer.on("clipboardUpdate", (_event, value) => callback(value))
});

//Gets a string representation of elapsed time for created date
function getElapsedTime(createdDate) {
    const elapsedTime = Math.round((Date.now() - new Date(createdDate).getTime()) / 1000);
    let timeUnit;
    let returnTime;
    if (elapsedTime < 60) {
        //Use seconds
        returnTime = elapsedTime
        returnTime == 1 ? timeUnit = " second" : timeUnit = " seconds";
    } else if (elapsedTime >= 60 && elapsedTime < 3600) {
        //Use minutes
        returnTime = Math.round(elapsedTime / 60);
        returnTime == 1 ? timeUnit = " minute" : timeUnit = " minutes";
    } else if (elapsedTime >= 3600 && elapsedTime < 86400) {
        //Use hours
        returnTime = Math.round(elapsedTime / 3600);
        returnTime == 1 ? timeUnit = " hour" : timeUnit = " hours"
    } else {
        //Use days
        returnTime = Math.round(elapsedTime / 86400);
        returnTime == 1 ? timeUnit = " day" : timeUnit = " days";
    }

    return returnTime + timeUnit + " ago";

}



