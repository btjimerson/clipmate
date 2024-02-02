const clearHistoryButton = document.getElementById("clearHistoryButton");
const preferencesButton = document.getElementById("preferencesButton");
const clipboardHistoryElement = document.getElementById("clipboardHistory");

//Handle the clear history request
clearHistoryButton.addEventListener("click", async () => {
    if (window.confirm("Are you sure you want to clear all clipboard history?")) {
        window.api.clearHistory();
    }
});

//Handle the preference request
preferencesButton.addEventListener("click", async () => {
    window.api.showPreferences();
});

//Writes the text argument to the clipboard
function writeToClipboard(text) {
    navigator.clipboard.writeText(text);
};

//Add history items when the window loads
window.addEventListener("load", async() => {
    window.api.getHistory().then((history) => {
        clipboardHistoryElement.innerHTML = history;
    });
});

//Update the clipboard history when there is a clipboard update
window.api.onClipboardUpdated((value) => {
    clipboardHistoryElement.innerHTML = value;
});
