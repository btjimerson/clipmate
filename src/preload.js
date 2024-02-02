//Imports
const { contextBridge, ipcRenderer } = require("electron");

// Get preferences
let preferences = ipcRenderer.sendSync("getPreferences");

// Handle the preferences save event
ipcRenderer.on("preferencesUpdated", (_event, newPreferences) => {
    preferences = newPreferences;
    const clipboardHistoryElement = document.getElementById("clipboardHistory");
    ipcRenderer.invoke("getHistory").then((history) => {
        clipboardHistoryElement.innerHTML = createHistoryHtml(history);
    });    
});

//Register ipc functions
contextBridge.exposeInMainWorld("api", {
    showPreferences: () => ipcRenderer.send("showPreferences"),
    clearHistory: () => ipcRenderer.send("clearHistory"),
    getHistory: () => ipcRenderer.invoke("getHistory").then((history) => {return createHistoryHtml(history)}),
    onClipboardUpdated: (callback) => ipcRenderer.on("clipboardUpdated", (_event, value) => callback(createHistoryHtml(value))),
});

//Creates the HTML for the history cards
const createHistoryHtml = (value) => {
    jsonValue = JSON.parse(value);
    let html = `<div class="row row-cols-1 row-cols-md-3 g-4">`;
    if (jsonValue.clipboardItems.length > 0) {
        for (var i = 0; i < jsonValue.clipboardItems.length; i++) {
            //Iterate over clipboard items; create a card for each item
            let clipboardItem = jsonValue.clipboardItems[i];
            html += `<div class="col"><div class="card h-100"><div class="card-body">`;
            html += `<p class="card-text">${cleanText(clipboardItem.clipboard)}</p>`;
            html += `<button class="btn btn-primary btn-sm" onclick="writeToClipboard('${encodeHTML(clipboardItem.clipboard)}')">`;
            html += `Copy to Clipboard</button></div>`;
            html += `<div class="card-footer text-body-secondary">${getElapsedTime(clipboardItem.createdDate)}</div></div></div>`
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
    if (preferences.general.textDisplayLength > 0) {
        str = truncateText(str, preferences.general.textDisplayLength);
    }
    str = encodeHTML(str);
    return str;
}

// Truncates text to a specific length
const truncateText = (str, length) => {
    return str.substring(0, length);
}

// Encodes HTML characters
const encodeHTML = (str) => {
    let buf = [];
    for (var i = str.length - 1; i >= 0; i--) {
      buf.unshift(['&#', str[i].charCodeAt(), ';'].join(''));
    }
    return buf.join('');
}


