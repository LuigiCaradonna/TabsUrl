// Listens for a message from the backend script
chrome.runtime.onMessage.addListener(
  function (request, sender) {

    if (request.data) {
      init(request.data);
    }
});

// Modal Window
let modal = document.createElement('div');
// Overlay containing all the elements
let overlay = document.createElement('div');

// Initilizes the content of the modal window
function initModal(tabs) {
  modal.setAttribute("id", 'tabsurlModal');
  modal.innerHTML = `
      <span class="tabsurlCloseModal">&times;</span>
  `;

  const modal_footer = document.createElement("div");
  modal_footer.setAttribute("id", 'tabsurlFooter');
  modal_footer.innerHTML = `<button class="tabsurlBtn">Save txt</button>`;

  const table_list = document.createElement("table");
  const table_header_list = document.createElement("thead");
  const table_header_tr_list = document.createElement("tr");
  const table_header_th_list = document.createElement("th");
  const table_body_list = document.createElement("tbody");

  table_list.setAttribute("id", 'tabsurlTable');

  table_header_th_list.innerHTML = `<input type="checkbox">`;
  table_header_tr_list.appendChild(table_header_th_list);
  table_header_list.appendChild(table_header_tr_list);
  table_list.appendChild(table_header_list);
  table_list.appendChild(table_body_list);

  // Loops through the tabs
  for (let tab of tabs) {
    // If the tab has an URL
    if (tab.url != undefined && tab.url != '') {
      const url_row = urlElement(tab.id, tab.url);
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
function urlElement(id, url) {
  const tr = document.createElement("tr");
  const td_check = document.createElement("td");
  const td_title = document.createElement("td");
  const checkbox = document.createElement('input');

  checkbox.setAttribute("type", 'checkbox');
  checkbox.setAttribute("id", id);
  checkbox.setAttribute("class", 'tabsurlSelector');
  checkbox.setAttribute("checked", true);

  td_check.appendChild(checkbox);
  td_title.textContent = url;

  tr.appendChild(td_check);
  tr.appendChild(td_title);

  return tr;
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
    if (e.target.id == 'tabsurlOverlay' || e.target.classList.contains('tabsurlCloseModal')) {
      destroy();
    }
  });
  
}