//Writes the text argument to the clipboard
function writeToClipboard(text) {
    navigator.clipboard.writeText(text);
}

//Handle the clear history request
function clearHistory() {
    if (window.confirm("Are you sure you want to clear all clipboard history?")) {
        window.electronApi.clearHistory();
    }
}
