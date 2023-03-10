// Builds a list containing only the selected URLs to save
function tabsListToSave() {
    // Data of the selected tabs to be saved
    let tabs_to_save = {};
    // Text to save into the file
    let content = '';

    let key_int = 0;

    console.debug('tabs selected: ' + tabs_selected);
    // Loop through all the tabs data
    for (const [key, value] of Object.entries(tabs_data_list)) {
        console.debug('tabs_list key: ' + value.id + ': ' + value.title);
        key_int = parseInt(value.id);
        // If the current tab is among the selected ones
        if ( tabs_selected.includes(key_int) ) {
        console.debug('Adding tab: ' + key_int);
        // Add the tab data
        tabs_to_save[key_int] = {id: value.id, title: value.title, url: value.url};
        }
    }

    console.debug('tabs to save: ' + tabs_to_save);

    // Get the string to be saved
    content = buildTextList(tabs_to_save);

    // Return the text to save
    return content;
}

// Builds and returns the string to be saved
function buildTextList(list) {
    let text = '';
    // Build the content of the file to save
    for (const [key, value] of Object.entries(list))  {
        text += value.url + '\n';
    }

    return text;
}

// Saves the given string into a text file
function saveToFile() {
    const content = tabsListToSave();
    const textToBlob = new Blob([content], { type: 'text/plain' });
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
