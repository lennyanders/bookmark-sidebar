export const scriptRunsOnTab = new Set([]);

const insertAndToggleBmBar = (tab) => {
  // if bookmarkbar is already inserted
  if (scriptRunsOnTab.has(tab.id)) {
    chrome.tabs.sendMessage(tab.id, { command: 'toggle-bm-bar' });
    return;
  }

  chrome.tabs.insertCSS({ file: 'fonts/lato.css' });
  chrome.tabs.executeScript({ file: 'content/main.js' }, ([success] = []) => {
    if (success) return;

    // if script couldn't be inserted open newtab
    chrome.tabs.create({
      index: tab.index + 1,
      url: 'chrome://newtab?bar=open',
    });
  });
};

export const enableBmBar = () => {
  chrome.commands.onCommand.addListener((command) => {
    if (command !== 'toggle-bm-bar') return;

    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      insertAndToggleBmBar(tab);
    });
  });

  chrome.browserAction.onClicked.addListener(insertAndToggleBmBar);
};
