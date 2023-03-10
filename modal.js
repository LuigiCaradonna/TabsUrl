// Modal Window containing the interface
const modal = document.createElement('div');

// Initilizes the content of the modal window
function initModal(tabs) {
    modal.setAttribute("id", 'tabsurlModal');
    modal.innerHTML = `<span class="tabsurlCloseModal">&times;</span>`;
  
    const modal_footer = document.createElement("div");
    modal_footer.setAttribute("id", 'tabsurlFooter');
    modal_footer.innerHTML = `<button id="tabsurlSaveTxt" class="tabsurlBtn">Save txt</button>`;
    
    // Loops through the tabs
    for (let tab of tabs) {
      // If the tab has a URL
      if (tab.url != undefined && tab.url != '') {
        // Insert the tab's data into the list
        tabs_data_list.push({id: tab.id, title: tab.title, url: tab.url});
        // Add the tab's id to the selected urls (all the urls are selected by default)
        tabs_selected.push(tab.id);
        // Create the table row for this tab
        urlRowElement(tab.id, tab.title);
      }
    }
  
    console.debug(tabs_selected);
  
    // Add table to the modal window
    modal.appendChild(table_list);
    // Add footer to the modal window
    modal.appendChild(modal_footer);
  };
  