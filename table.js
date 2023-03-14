// Container for the list of tabs
const table_list = document.createElement("table");
const table_header_list = document.createElement("thead");
const table_header_tr_list = document.createElement("tr");
const table_header_th_list = document.createElement("th");
const table_body_list = document.createElement("tbody");

// Builds the table containing the tabs list
function initTableList() {
    table_list.setAttribute("id", 'tabsurlTable');
    table_list.appendChild(table_body_list);
}

// Builds a row and adds it to the table
function urlRowElement(id, title) {
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

    table_body_list.appendChild(tr);
}

function removeTable() {
    // Empty the table content
    while(table_body_list.firstChild) 
        table_body_list.removeChild(table_body_list.firstChild);
    
    table_list.remove();
}