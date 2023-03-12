let getStorage = browser.storage.local.get();
let clearStorage = browser.storage.local.clear();

browser.storage.onChanged.addListener(updateButtonsState);

// Saves the selected tab into the local storage
function saveToStorage() {
    console.debug('Clearing the storage');
    clearStorage.then(() => {
        console.debug('Saving to storage');
        // Gets the selected tabs' data
        const list = tabsListToSave();
        console.debug(list);
        // Stores the list into the local storage
        browser.storage.local.set(list).then(() => {
            console.debug("Tabs stored!");
        });
    });
}

// Retrieves the info of the stored tabs and tells to the bg script to open them
function openStored() {
    console.debug('Get stored');
    // Get the stored tabs
    getStorage.then(list => {
        console.debug('Opening stored');
        // Notify the bg script to open them
        notifyBackgroundPage(list);
    });
}

// Deletes all the data stored into the local storage
function deleteStored() {
    console.debug('delete stored');
    clearStorage.then(() => {
        console.debug('Storage cleared');
    });
}

// Sends a message, then received by the background script which will open the tabs
function notifyBackgroundPage(list) {
    browser.runtime.sendMessage({action: 'open_stored', data: list});
}
