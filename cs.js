// Listens for a message from the backend script
chrome.runtime.onMessage.addListener(
  function (request, sender) {

    if (request.data) {
      init(request.data);
    }
});

// Container for the URLs list
let tablist = document.createElement('div');
// Modal Window
let modal = document.createElement('div');
// Overlay containing all the elements
let overlay = document.createElement('div');

// Initilizes the content of the modal window
function initModal(tabs) {
  modal.setAttribute("id", 'tabsurlModal');
  modal.style.cssText=`
    background-color: #fefefe;
    margin: 15% auto;
    border: 1px solid #888;
    padding: 20px;
    width: 80%;
  `;
  modal.innerHTML = `
      <span id="closeTabsUrlIcon" class="close" style="font-size:24px;font-weight:bold;cursor:pointer">&times;</span>
  `;

  // Contains the list of the URLs
  let currentTabs = document.createDocumentFragment();

  tablist.textContent = '';

  // Loops through the tabs
  for (let tab of tabs) {
    // p element to contain a URL
    let tabLink = document.createElement('p');

    // Adds the URL to the p element
    tabLink.textContent = tab.url;
    // Adds the p element to the URLs container
    currentTabs.appendChild(tabLink);
  }

  // Adds the URLs to the div
  tablist.appendChild(currentTabs);
  // Add the div to the modal window
  modal.appendChild(tablist);
};

// Initilizes the overlay
function initOverlay() {
  overlay.setAttribute("id", 'tabsurlOverlay');
  overlay.style.cssText=`
    height: 100vh;
    left: 0;
    right: 0;
    top:0;
    position: fixed;
    z-index: 9998;
    background: rgba(0, 0, 0, 0.4);
  `;
  // Adds the content to the overlay
  overlay.appendChild(modal);
  // Adds the overlay to the page
  document.body.appendChild(overlay);
}

// Removes the overlay from the page
function destroy() {
  overlay.remove();
}

// Initializes all the elements
function init(tabs) {
  
  if(document.getElementById('tabsurlOverlay'))
    document.getElementById('tabsurlOverlay').remove();
  else {
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