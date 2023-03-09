// Listens for a message from the backend script
chrome.runtime.onMessage.addListener(
  function (request, sender) {

    if (request.data) {
      init(request.data);
    }
});

// This will contain the data of the open tabs
let urls_list = {};
// This will contain the checkboxes' ids of the selected URLs
let urls_selected = [];
// This will contain the data of the selected tabs to be saved
let urls_to_save = {};

// Modal Window
let modal = document.createElement('div');
// Overlay containing all the elements
let overlay = document.createElement('div');

// Initilizes the content of the modal window
function initModal(tabs) {
  modal.setAttribute("id", 'tabsurlModal');
  modal.innerHTML = `<span class="tabsurlCloseModal">&times;</span>`;

  const modal_footer = document.createElement("div");
  modal_footer.setAttribute("id", 'tabsurlFooter');
  modal_footer.innerHTML = `<button id="tabsurlSaveTxt" class="tabsurlBtn">Save txt</button>`;

  const table_list = document.createElement("table");
  const table_header_list = document.createElement("thead");
  const table_header_tr_list = document.createElement("tr");
  const table_header_th_list = document.createElement("th");
  const table_body_list = document.createElement("tbody");

  table_list.setAttribute("id", 'tabsurlTable');

  table_header_th_list.setAttribute("colspan", 2);
  table_header_th_list.innerHTML = `<input type="checkbox" checked="checked">`;
  table_header_tr_list.appendChild(table_header_th_list);
  table_header_list.appendChild(table_header_tr_list);
  table_list.appendChild(table_header_list);
  table_list.appendChild(table_body_list);

  // Loops through the tabs
  for (let tab of tabs) {
    // If the tab has an URL
    if (tab.url != undefined && tab.url != '') {
      // Insert the tab's data into the urls list
      urls_list[tab.id] = {title: tab.title, url: tab.url};
      // Add the tab's id to the selected urls (all the urls are selected by default)
      urls_selected.push(tab.id);
      // Create the table row for this tab
      const url_row = urlElement(tab.id, tab.title);
      // Adds the table row to the URLs table
      table_body_list.appendChild(url_row);
    }
  }

  // Add table to the modal window
  modal.appendChild(table_list);
  // Add footer to the modal window
  modal.appendChild(modal_footer);
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

// Builds a table row
function urlElement(id, title) {
  const tr = document.createElement("tr");
  const td_check = document.createElement("td");
  const td_title = document.createElement("td");
  const checkbox = document.createElement('input');

  // Setup the checkbox, checked by default
  checkbox.setAttribute("type", 'checkbox');
  checkbox.setAttribute("id", id);
  // Class used with the click listener
  checkbox.setAttribute("class", 'tabsurlSelector');
  checkbox.setAttribute("checked", true);

  td_check.appendChild(checkbox);
  td_title.textContent = title;

  tr.appendChild(td_check);
  tr.appendChild(td_title);

  return tr;
}

// Builds a list containing only the selected URLs to save
function buildUrlListSave() {
  // Clear the object
  urls_to_save = {};
  // Text to save into the file
  let content = '';

  // Loop through all the tabs data
  for (const [key, value] of Object.entries(urls_list)) {
    // If the current tab is among the selected ones
    if ( urls_selected.includes(parseInt(key)) ) {
      // Add the tab data
      urls_to_save[key] = urls_list[key];
    }
  }

  // Build the content of the file to save
  for (const [key, value] of Object.entries(urls_to_save))  {
    content += value.url + '\n';
  }

  // Save to file
  saveToFile(content);
}

function saveToFile(content) {
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

// Initializes all the elements
function init(tabs) {
  // Remove the overlay if exists
  if(document.getElementById('tabsurlOverlay'))
    document.getElementById('tabsurlOverlay').remove();
  
  initModal(tabs);
  initOverlay();

  // Remove the overlay when ESC is pressed
  document.body.addEventListener('keyup',(e)=>{
    if (e.keyCode === 27)
      destroy();
  });

  // Mouse click event listener
  document.body.addEventListener("click", (e) => {
    // Remove the overlay when a click occurs outside of the modal or on the close icon
    if (e.target.id == 'tabsurlOverlay' || e.target.classList.contains('tabsurlCloseModal')) {
      destroy();
    }
    else if (e.target.classList.contains('tabsurlSelector')) {
      // Get the checkbox
      const cb = document.getElementById(e.target.id);
      // If the checkbox has been found
      if (cb)
        // Add or remove the id from the list of the selected URLs according to the checkbox status
        cb.checked == true ? urls_selected.push(e.target.id) : urls_selected.pop(e.target.id);
    }
    else if (e.target.id == 'tabsurlSaveTxt') {
      buildUrlListSave();
    }
  });
  
}