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

// Initializes all the elements
function init(tabs) {
  // Remove the overlay if exists
  if(document.getElementById('tabsurlOverlay'))
    document.getElementById('tabsurlOverlay').remove();
  
  initTableList();
  initModal(tabs);
  initOverlay();

  // Remove the overlay when the ESC key is pressed
  document.body.addEventListener('keyup', (e) => {
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
          console.debug('Add id: ' + e.target.id);
          tabs_selected.push(parseInt(e.target.id));
          console.debug(tabs_selected);
        }
        else {
          console.debug('Remove id: ' + e.target.id);
          const index = tabs_selected.indexOf(parseInt(e.target.id));
          if (index > -1) { // only splice array when item is found
            tabs_selected.splice(index, 1); // 2nd parameter means remove one item only
          }
          console.debug(tabs_selected);
        }
      }
    }
    else if (e.target.id == 'tabsurlSaveTxt') {
      saveToFile();
    }
  }); 
}
