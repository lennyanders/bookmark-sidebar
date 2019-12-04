export let scriptRunsOnTab = new Set([]);

const createToggleBmBar = tab => {
  tab = Array.isArray(tab) ? tab[0] : tab;

  if (tab.url.includes('chrome://newtab')) return;

  if (
    [
      'chrome://',
      'https://chrome.google.com/webstore/',
      'view-source:',
      'file:///'
    ].some(url => tab.url.includes(url))
  ) {
    return chrome.tabs.create({
      index: tab.index + 1,
      url: 'chrome://newtab?bar=open'
    });
  }

  if (scriptRunsOnTab.has(tab.id)) {
    return chrome.tabs.executeScript({
      code: 'window.dispatchEvent(new CustomEvent("toggleBar"));'
    });
  }

  chrome.tabs.insertCSS({ file: 'fonts/lato.css' });
  chrome.tabs.executeScript({ file: 'content/main.js' });
  scriptRunsOnTab.add(tab.id);
};

chrome.commands.onCommand.addListener(command => {
  if (command !== 'toogle-bm-bar') return;

  chrome.tabs.query({ active: true, currentWindow: true }, createToggleBmBar);
});

chrome.browserAction.onClicked.addListener(createToggleBmBar);
