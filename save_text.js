// Builds and returns the string to be saved
function buildTextList() {
    let text = '';

    // Build the content of the file to save
    for (const [key, value] of Object.entries( tabsListToSave() ))  {
        text += value.url + '\n';
    }

    return text;
}

// Saves the given string into a text file
function saveToFile() {
    // const content = buildTextList();
    const textToBlob = new Blob([buildTextList()], { type: 'text/plain' });
    const sFileName = 'tabsurl.txt';

    let newLink = document.createElement("a");
    newLink.download = sFileName;

    if (window.webkitURL != null) {
        newLink.href = window.webkitURL.createObjectURL(textToBlob);
    }
    else {
        newLink.href = window.URL.createObjectURL(textToBlob);
        newLink.style.display = "none";
        document.body.appendChild(newLink);
    }

    newLink.click();
    newLink.remove();
}
