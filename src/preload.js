//Imports
const { contextBridge, ipcRenderer } = require("electron");

//Add event listener for clipboard update
window.addEventListener("DOMContentLoaded", () => {
    const clipboardHistory = document.getElementById("clipboardHistory");
    ipcRenderer.on("clipboard-update", (_event, value) => {        
        clipboardHistory.innerHTML = createHistoryHtml(value);
    })
});

//Register ipc callbacks
contextBridge.exposeInMainWorld("electronApi", {
    clearHistory: () => ipcRenderer.send("clear-history"),
    onClipboardUpdate: (callback) => ipcRenderer.on("clipboard-update", (_event, value) => callback(value)),
});

//Creates the HTML for the history cards
const createHistoryHtml = (value) => {
    jsonValue = JSON.parse(value);
    let html = `<div class="row row-cols-1 row-cols-md-3 g-4">`;
    if (jsonValue.histories.length > 0) {
        for (var i = 0; i < jsonValue.histories.length; i++) {
            // Still iterating over history items; create a card for each item
            let historyItem = jsonValue.histories[i];
            html += `<div class="col"><div class="card h-100"><div class="card-body">`;
            html += `<p class="card-text">${cleanText(historyItem.clipboard)}</p>`;
            html += `<button class="btn btn-primary btn-sm" onclick="writeToClipboard('${historyItem.clipboard}')">`;
            html += `Copy to Clipboard</button></div>`;
            html += `<div class="card-footer text-body-secondary">${getElapsedTime(historyItem.createdDate)}</div></div></div>`
        }
    } else {
        html += `<div class="col">Clipboard history is empty.</div>`
    }
    html += `</div>`;
    return html;
}

//Gets a string representation of elapsed time for created date
const getElapsedTime = (createdDate) => {
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

// Cleans up text for display
const cleanText = (str) => {
    str = truncateText(str, 100);
    str = encodeHTML(str);
    return str;
}

// Truncates text to a specific length
const truncateText = (str, length) => {
    return str.substring(0, length - 1);
}

// Encodes HTML characters
const encodeHTML = (str) => {
    let buf = [];
    for (var i = str.length - 1; i >= 0; i--) {
      buf.unshift(['&#', str[i].charCodeAt(), ';'].join(''));
    }
    return buf.join('');
}


