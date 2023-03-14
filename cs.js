// Listens for a message from the backend script
browser.runtime.onMessage.addListener(
  function (request, sender) {
    if (request.data) {
      init(request.data);
    }
});

// This will contain the data of the open tabs
let tabs_data_list = [];
// This will contain the checkboxes' ids of the selected URLs
let tabs_selected = [];

// Initializes all the elements
function init(tabs) {
  // Remove the overlay if exists
  if(document.getElementById('tabsurlOverlay'))
    document.getElementById('tabsurlOverlay').remove();

  initTableList();
  initModal(tabs);
  initOverlay();
}

// Builds and returns an object containing only the data of the selected tabs to save
function tabsListToSave() {
  // Data of the selected tabs to be saved
  let tabs_to_save = {};

  let key_int = 0;

  // Loop through all the tabs data
  for (const [key, value] of Object.entries(tabs_data_list)) {
      key_int = parseInt(value.id);
      // If the current tab is among the selected ones
      if ( tabs_selected.includes(key_int) ) {
          // Add the tab data to be saved
          tabs_to_save[key_int] = {id: value.id, title: value.title, url: value.url};
      }
  }

  // Return the data of the tabs to save
  return tabs_to_save;
}

function destroy() {
  removeTable();
  removeModal();
  removeOverlay();
}

// Remove the overlay when the ESC key is pressed
document.body.addEventListener('keyup', (e) => {
  if (e.key === 'Escape')
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
    if (cb) {
      // Add or remove the id from the list of the selected URLs according to the checkbox status
      if (cb.checked == true) {
        tabs_selected.push(parseInt(e.target.id));
      }
      else {
        const index = tabs_selected.indexOf(parseInt(e.target.id));
        if (index > -1) { // only splice array when item is found
          tabs_selected.splice(index, 1); // 2nd parameter means remove one item only
        }
      }
    }
  }
  else if (e.target.id == 'tabsurlSaveTxt') {
    saveToFile();
  }
  else if (e.target.id == 'tabsurlSaveStorage') {
    saveToStorage();
  }
  else if (e.target.id == 'tabsurlOpenStored') {
    openStored();
  }
  else if (e.target.id == 'tabsurlDeleteStored') {
    deleteStored();
  }
});
