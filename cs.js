// Listens for a message from the backend script
chrome.runtime.onMessage.addListener(
  function (request, sender) {

    if (request.data) {
      init(request.data);
    }
});

// Container for the URLs list
let urls_list = document.createElement('div');
// Modal Window
let modal = document.createElement('div');
// Overlay containing all the elements
let overlay = document.createElement('div');

// Initialize the container for the URL
function initUrlsList() {
  urls_list.setAttribute("class", 'tabsurlUrlsList');
}

// Initilizes the content of the modal window
function initModal(tabs) {
  modal.setAttribute("id", 'tabsurlModal');
  modal.innerHTML = `
      <span id="closeTabsUrlIcon">&times;</span>
  `;

  // Contains the list of the URLs
  let current_tabs = document.createDocumentFragment();

  urls_list.textContent = '';

  // Loops through the tabs
  for (let tab of tabs) {
    // If the tab has an URL
    if (tab.url != undefined && tab.url != '') {
      const url_entry = urlElement(tab.id, tab.url);
      // Adds the p element to the URLs container
      current_tabs.appendChild(url_entry);
    }
  }

  // Adds the URLs to the div
  urls_list.appendChild(current_tabs);
  // Add the div to the modal window
  modal.appendChild(urls_list);
};

// Initilizes the overlay
function initOverlay() {
  overlay.setAttribute("id", 'tabsurlOverlay');
  // Adds the content to the overlay
  overlay.appendChild(modal);
  // Adds the overlay to the page
  document.body.appendChild(overlay);
}

// Removes the overlay from the page
function destroy() {
  overlay.remove();
}

// Builds a URL entry
function urlElement(id, url) {
  // Container for the URL entry
  const url_container = document.createElement('div');
  // Checkbox to select the relative URL
  const checkbox = document.createElement('input');
  // p element to contain a URL
  const tab_url = document.createElement('p');

  // Setup the container
  url_container.setAttribute("class", 'tabsurlContainer');

  // Setup the checkbox, checked by default
  checkbox.setAttribute("type", 'checkbox');
  checkbox.setAttribute("id", id);
  checkbox.setAttribute("class", 'tabsurlSelector');
  checkbox.setAttribute("checked", true);

  // Setup the paragraph containing the URL
  tab_url.setAttribute("class", 'tabsurlTabUrl');
  // Adds the URL to the p element
  tab_url.textContent = url;

  // Add the checkbox and the URL to the container
  url_container.appendChild(checkbox);
  url_container.appendChild(tab_url);

  // return the container
  return url_container;
}

// Initializes all the elements
function init(tabs) {
  
  if(document.getElementById('tabsurlOverlay'))
    document.getElementById('tabsurlOverlay').remove();
  else {
    initUrlsList();
    initModal(tabs);
    initOverlay();
  }

  // Remove the overlay when ESC is pressed
  document.body.addEventListener('keyup',(e)=>{
    if (e.keyCode === 27)
      destroy();
  });

  // Remove the overlay when a click occurs outside of the modal or on the X icon
  document.body.addEventListener("click", (e) => {
    if (e.target.id == 'tabsurlOverlay' || e.target.id == 'closeTabsUrlIcon') {
      destroy();
    }
  });
  
}