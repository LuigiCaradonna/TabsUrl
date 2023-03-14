// Modal Window containing the interface
const modal = document.createElement('div');
const table_container = document.createElement('div');
const modal_header = document.createElement("div");
const modal_footer = document.createElement("div");
const saveTxtBtn = document.createElement('button');
const saveStorageBtn = document.createElement('button');
const getStoredBtn = document.createElement('button');
const delStoredBtn = document.createElement('button');
const git_link = document.createElement("div");
const git_logo = browser.runtime.getURL("icons/git-logo.png");

// Initilizes the content of the modal window
function initModal(tabs) {
  modal.setAttribute("id", 'tabsurlModal');
  
  modal_header.setAttribute("id", 'tabsurlModalHeader');
  modal_header.innerHTML = `<span class="tabsurlCloseModal">Close </span><span class="tabsurlCloseModalTimes">&times;</span>`;

  modal_footer.setAttribute("id", 'tabsurlModalFooter');
  
  saveTxtBtn.setAttribute("id", 'tabsurlSaveTxt');
  saveTxtBtn.setAttribute("class", 'tabsurlBtn');
  saveTxtBtn.textContent = 'Save text';

  saveStorageBtn.setAttribute("id", 'tabsurlSaveStorage');
  saveStorageBtn.setAttribute("class", 'tabsurlBtn');
  saveStorageBtn.textContent = 'Store Tabs';
  
  getStoredBtn.setAttribute("id", 'tabsurlOpenStored');
  getStoredBtn.setAttribute("class", 'tabsurlBtn');
  getStoredBtn.classList.add("class", 'tabsurlGBtn');
  getStoredBtn.textContent = 'Open stored';
  
  delStoredBtn.setAttribute("id", 'tabsurlDeleteStored');
  delStoredBtn.setAttribute("class", 'tabsurlBtn');
  delStoredBtn.classList.add("class", 'tabsurlDBtn');
  delStoredBtn.textContent = 'Delete stored';

  git_link.setAttribute("id", 'git_link');
  git_link.innerHTML = `
    <a href="https://github.com/LuigiCaradonna/TabsUrl" title="Github repo" target="_blank">
      <img src="` + git_logo + `" alt="Github logo" />
    </a>
  `;

  modal_footer.appendChild(saveTxtBtn);
  modal_footer.appendChild(saveStorageBtn);
  modal_footer.appendChild(getStoredBtn);
  modal_footer.appendChild(delStoredBtn);
  modal_footer.appendChild(git_link);

  // Loops through all the open tabs
  for (let tab of tabs) {
    // If the page shown inside the tab has a URL
    if (tab.url != undefined && tab.url != '' && tab.url.startsWith('http')) {
      // Insert the tab's data into the list
      tabs_data_list.push({id: tab.id, title: tab.title, url: tab.url});
      // Add the tab's id to the selected urls (all the urls are selected by default)
      tabs_selected.push(tab.id);
      // Create the table row for this tab
      urlRowElement(tab.id, tab.title);
    }
  }

  table_container.setAttribute("id", 'tabsurlTCont');

  // Add header to the modal window
  modal.appendChild(modal_header);
  // Add table to the modal window
  table_container.appendChild(table_list);
  // Add table to the modal window
  modal.appendChild(table_container);
  // Add footer to the modal window
  modal.appendChild(modal_footer);
  
  updateButtonsState();
};

// Reads the local storage and sets the store and delete buttons enabled/disablad
function updateButtonsState() {
  // Get the data from the storage
  browser.storage.local.get().then(updated_list => {
    // If no tabs are stored
    if (Object.keys(updated_list).length === 0) {
      // Set the button to open the stored tabs as disabled
      getStoredBtn.setAttribute("disabled", '');
      // Set the button to delete the storage as disabled
      delStoredBtn.setAttribute("disabled", '');
    }
    else {
      // Set the button to open the stored tabs as enabled
      getStoredBtn.removeAttribute("disabled");
      // Set the button to delete the storage as enabled
      delStoredBtn.removeAttribute("disabled");
    }
  });
}

function removeModal() {
  while(modal.firstChild) 
    modal.removeChild(modal.firstChild);
  modal.remove();
}