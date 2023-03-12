// Overlay containing the modal window
const overlay = document.createElement('div');

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
