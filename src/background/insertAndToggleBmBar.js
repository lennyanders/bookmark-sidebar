export const scriptRunsOnTab = new Set([]);

const insertAndToggleBmBar = (tabOrTabs) => {
  const tab = tabOrTabs[0] || tabOrTabs;

  // newtab has its own handler
  if (
    ['chrome://newtab', 'edge://newtab'].some((url) => tab.url.startsWith(url))
  ) {
    return;
  }

  // if bookmarkbar is already inserted
  if (scriptRunsOnTab.has(tab.id)) {
    chrome.tabs.executeScript({
      code: 'window.dispatchEvent(new CustomEvent("toggleBar"));',
    });
    return;
  }

  chrome.tabs.insertCSS({ file: 'fonts/lato.css' });
  chrome.tabs.executeScript({ file: 'content/main.js' }, ([success] = []) => {
    if (success) {
      scriptRunsOnTab.add(tab.id);
      return;
    }
    // if script couldn't be inserted open newtab
    chrome.tabs.create({
      index: tab.index + 1,
      url: 'chrome://newtab?bar=open',
    });
  });
};

export const enableBmBar = () => {
  chrome.commands.onCommand.addListener((command) => {
    if (command !== 'toogle-bm-bar') return;

    chrome.tabs.query(
      { active: true, currentWindow: true },
      insertAndToggleBmBar,
    );
  });

  chrome.browserAction.onClicked.addListener(insertAndToggleBmBar);
};
