export let scriptRunsOnTab = new Set([]);

chrome.browserAction.onClicked.addListener(tab => {
  if (!tab.url.includes('chrome://newtab')) {
    if (
      [
        'chrome://',
        'https://chrome.google.com/webstore/',
        'view-source:',
        'file:///'
      ].find(a => tab.url.includes(a))
    ) {
      chrome.tabs.create({
        index: tab.index + 1,
        url: 'chrome://newtab'
      });
    } else {
      if (scriptRunsOnTab.has(tab.id)) {
        chrome.tabs.executeScript({
          code: 'window.dispatchEvent(new CustomEvent("toggleBar"));'
        });
      } else {
        chrome.tabs.executeScript({
          file: 'content/main.js'
        });
        scriptRunsOnTab.add(tab.id);
      }
    }
  }
});
