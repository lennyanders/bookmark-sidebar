export let scriptRunsOnTab = new Set([]);

const insertAndToggleBmBar = tabOrTabs => {
  const tab = tabOrTabs[0] || tabOrTabs;

  // newtab has its own handler
  if (tab.url.includes('chrome://newtab')) return;

  // check if current tab is a url where a content script can't run
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

  // check if bookmarkbar is already inserted
  if (scriptRunsOnTab.has(tab.id)) {
    return chrome.tabs.executeScript({
      code: 'window.dispatchEvent(new CustomEvent("toggleBar"));'
    });
  }

  chrome.tabs.insertCSS({ file: 'fonts/lato.css' });
  chrome.tabs.executeScript({ file: 'content/main.js' });
  scriptRunsOnTab.add(tab.id);
};

export const enableBmBar = () => {
  chrome.commands.onCommand.addListener(command => {
    if (command !== 'toogle-bm-bar') return;

    chrome.tabs.query(
      { active: true, currentWindow: true },
      insertAndToggleBmBar
    );
  });

  chrome.browserAction.onClicked.addListener(insertAndToggleBmBar);
};
