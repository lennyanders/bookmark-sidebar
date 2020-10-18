export const scriptRunsOnTab = new Set([]);

const insertAndToggleBmBar = ({ id, index } = {}) => {
  if (!id) return;

  // if bookmarkbar is already inserted
  if (scriptRunsOnTab.has(id)) {
    chrome.tabs.sendMessage(id, { command: 'toggle-bm-bar' });
    return;
  }

  chrome.tabs.insertCSS({ file: 'fonts/lato.css' });
  chrome.tabs.executeScript({ file: 'content/main.js' }, ([success] = []) => {
    if (success) return;

    // if script couldn't be inserted open newtab
    chrome.tabs.create({
      index: index + 1,
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
