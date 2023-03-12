// Listens for the click on the extension's button
browser.browserAction.onClicked.addListener(tab => {
  // Gets the open tabs and sends them to the content script through a message
  getCurrentWindowTabs().then((tabs) => {
    browser.tabs.sendMessage( tab.id, {data: tabs});
  });
});

// Returns the open tabs
function getCurrentWindowTabs() {
  return browser.tabs.query({currentWindow: true});
}

browser.runtime.onMessage.addListener(
  function (request, sender) {
    console.debug(request.action);

    // Open the stored tabs
    if (request.action != undefined && request.action == 'open_stored') {
      for (const [key, value] of Object.entries( request.data ))  {
          let url = value.url;
          console.debug(url);
          browser.tabs.create({url: url});
      }
    }
});
