// Listens for a message from the backend script
chrome.runtime.onMessage.addListener(
  function (request, sender) {

    if (request.data) {
      init(request.data);
    }
});

// This will contain the data of the open tabs
let tabs_data_list = [];
// This will contain the checkboxes' ids of the selected URLs
let tabs_selected = [];

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

  // Building the table containing the tabs list
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
      // Insert the tab's data into the list
      tabs_data_list.push({id: tab.id, title: tab.title, url: tab.url});
      // Add the tab's id to the selected urls (all the urls are selected by default)
      tabs_selected.push(tab.id);
      // Create the table row for this tab
      const url_row = urlElement(tab.id, tab.title);
      // Adds the table row to the URLs table
      table_body_list.appendChild(url_row);
    }
  }

  console.log(tabs_selected);

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
function removeOverlay() {
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
function tabsListToSave() {
  // Data of the selected tabs to be saved
  let tabs_to_save = {};
  // Text to save into the file
  let content = '';

  let key_int = 0;

  console.log('tabs selected: ' + tabs_selected);
  // Loop through all the tabs data
  for (const [key, value] of Object.entries(tabs_data_list)) {
    console.log('tabs_list key: ' + value.id + ': ' + value.title);
    key_int = parseInt(value.id);
    // If the current tab is among the selected ones
    if ( tabs_selected.includes(key_int) ) {
      console.log('Adding tab: ' + key_int);
      // Add the tab data
      tabs_to_save[key_int] = {id: value.id, title: value.title, url: value.url};
    }
  }

  console.log('tabs to save: ' + tabs_to_save);

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

// Initializes all the elements
function init(tabs) {
  // Remove the overlay if exists
  if(document.getElementById('tabsurlOverlay'))
    document.getElementById('tabsurlOverlay').remove();
  
  initModal(tabs);
  initOverlay();

  // Remove the overlay when the ESC key is pressed
  document.body.addEventListener('keyup',(e) => {
    if (e.key === 'Escape')
      removeOverlay();
  });

  // Mouse click event listener
  document.body.addEventListener("click", (e) => {
    // Remove the overlay when a click occurs outside of the modal or on the close icon
    if (e.target.id == 'tabsurlOverlay' || e.target.classList.contains('tabsurlCloseModal')) {
      removeOverlay();
    }
    else if (e.target.classList.contains('tabsurlSelector')) {
      // Get the checkbox
      const cb = document.getElementById(e.target.id);
      // If the checkbox has been found
      if (cb) {
        // Add or remove the id from the list of the selected URLs according to the checkbox status
        if (cb.checked == true) {
          console.log('Add id: ' + e.target.id);
          tabs_selected.push(parseInt(e.target.id));
          console.log(tabs_selected);
        }
        else {
          console.log('Remove id: ' + e.target.id);
          const index = tabs_selected.indexOf(parseInt(e.target.id));
          if (index > -1) { // only splice array when item is found
            tabs_selected.splice(index, 1); // 2nd parameter means remove one item only
          }
          console.log(tabs_selected);
        }
      }
    }
    else if (e.target.id == 'tabsurlSaveTxt') {
      saveToFile();
    }
  }); 
}
