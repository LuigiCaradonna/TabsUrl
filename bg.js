chrome.browserAction.onClicked.addListener(tab => {
  getCurrentWindowTabs().then((tabs) => {
    chrome.tabs.sendMessage( tab.id, {data: tabs});
  });
});

function getCurrentWindowTabs() {
  return browser.tabs.query({currentWindow: true});
}