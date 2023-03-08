// Listens for the click on the extension's button
chrome.browserAction.onClicked.addListener(tab => {
  // Gets the open tabs and sends them to the content script through a message
  getCurrentWindowTabs().then((tabs) => {
    chrome.tabs.sendMessage( tab.id, {data: tabs});
  });
});

// Returns the open tabs
function getCurrentWindowTabs() {
  return browser.tabs.query({currentWindow: true});
}