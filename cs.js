chrome.runtime.onMessage.addListener(
  function (request, sender) {

    if (request.data) {
      init(request.data);
    }
});

let tablist;
let modal;
let overlay;

function initModal(tabs) {
  modal.setAttribute("id", 't2tModal');
  modal.style.cssText=`
    background-color: #fefefe;
    margin: 15% auto;
    border: 1px solid #888;
    padding: 20px;
    width: 80%;
  `;
  modal.innerHTML = `
      <span class="close" style="font-size:24px;font-weight:bold;">&times;</span>
      <p>Contenuto modal</p>
  `;

  let currentTabs = document.createDocumentFragment();

  tablist.textContent = '';

  for (let tab of tabs) {
    let tabLink = document.createElement('p');

    tabLink.textContent = tab.url;
    currentTabs.appendChild(tabLink);
  }

  tablist.appendChild(currentTabs);
  modal.appendChild(tablist);
};

function initOverlay() {
  overlay.setAttribute("id", 't2tOverlay');
  overlay.style.cssText=`
    height: 100vh;
    left: 0;
    right: 0;
    top:0;
    position: fixed;
    z-index: 9998;
    background: rgba(0, 0, 0, 0.4);
  `;
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

function destroy() {
  overlay.remove();
}

function init(tabs) {
  
  tablist = document.createElement('div');
  modal = document.createElement('div');
  overlay = document.createElement('div');

  if(document.getElementById('t2tOverlay'))
    document.getElementById('t2tOverlay').remove();
  else {
    initModal(tabs);
    initOverlay();
  }

  document.body.addEventListener('keyup',(e)=>{
    if (e.keyCode === 27)
      destroy();
  });
  
}