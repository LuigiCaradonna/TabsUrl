function saveToStorage() {
    console.debug('Clearing the storage');
    // for (const [key, value] of Object.entries( tabsListToSave() ))  {
    //     let key = value.id;
    //     chrome.storage.local.set({key: {title: value.title, url: value.url}});
    // }
    let clearStorage = chrome.storage.local.clear();
    clearStorage.then(() => {
        console.debug('Saving to storage');
        const list = tabsListToSave();
        chrome.storage.local.set(list);
    });
    
}

function openStored() {
    console.debug('Open storage');

    // TODO: insert the code inside a loop through the stored URLs
    let getStorage = chrome.storage.local.get();
    getStorage.then((list) => {
        console.debug('Opening stored');
        notifyBackgroundPage(list);
    });
}

function notifyBackgroundPage(list) {
    browser.runtime.sendMessage({data: list});
}
