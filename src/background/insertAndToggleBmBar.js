export let scriptRunsOnTab = new Set([]);

const insertAndToggleBmBar = (tabOrTabs) => {
  const tab = tabOrTabs[0] || tabOrTabs;

  // newtab has its own handler
  if (
    tab.url.includes('chrome://newtab') ||
    tab.url.includes('edge://newtab')
  ) {
    return;
  }

  // check if current tab is a url where a content script can't run
  if (
    [
      'chrome://',
      'edge://',
      'https://chrome.google.com/webstore/',
      'https://microsoftedge.microsoft.com/addons/',
      'view-source:',
      'file:///',
    ].some((url) => tab.url.includes(url))
  ) {
    chrome.tabs.create({
      index: tab.index + 1,
      url: 'chrome://newtab?bar=open',
    });
    return;
  }

  // check if bookmarkbar is already inserted
  if (scriptRunsOnTab.has(tab.id)) {
    chrome.tabs.executeScript({
      code: 'window.dispatchEvent(new CustomEvent("toggleBar"));',
    });
    return;
  }

  chrome.tabs.insertCSS({ file: 'fonts/lato.css' });
  chrome.tabs.executeScript({ file: 'content/main.js' });
  scriptRunsOnTab.add(tab.id);
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
