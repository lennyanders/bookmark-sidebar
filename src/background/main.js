import 'chrome-extension-async';

import { scriptRunsOnTab } from './create-toggle-bm-bar';
import { data } from './data';

const userColorScheme = matchMedia('(prefers-color-scheme: dark)').matches
  ? 'dark/'
  : '';

chrome.browserAction.setIcon({
  path: {
    '16': `icons/${userColorScheme}browser-action-16.png`,
    '24': `icons/${userColorScheme}browser-action-24.png`,
    '32': `icons/${userColorScheme}browser-action-32.png`
  }
});

const actions = {
  remove({ id }) {
    chrome.bookmarks.removeTree(id);
  },
  create({ parentId, title, url }) {
    chrome.bookmarks.create({
      parentId,
      title,
      ...(url && { url })
    });
  },
  move({ id, index, parentId }) {
    chrome.bookmarks.move(id, {
      ...(index !== undefined && { index }),
      ...(parentId && { parentId })
    });
  },
  update({ id, title, url }) {
    chrome.bookmarks.update(id, {
      ...(title && { title }),
      ...(url && { url })
    });
  },
  setBarLeft({ barLeft }) {
    chrome.storage.sync.set({ barLeft });
  },
  setShownBm({ id: shownBmId }) {
    chrome.storage.sync.set({ shownBmId });
  },
  setBarWidth({ barWidth }) {
    chrome.storage.sync.set({ barWidth });
  },
  setBarTheme({ barTheme }) {
    chrome.storage.sync.set({ barTheme });
  }
};

export default chrome.runtime.onConnect.addListener(port => {
  console.assert(port.name === 'bmBar');

  port.onMessage.addListener(msg => actions[msg.type]?.(msg));

  const postData = () => port.postMessage(data);
  postData();
  window.addEventListener('treeUpdated', postData);

  port.onDisconnect.addListener(async () => {
    window.removeEventListener('treeUpdated', postData);

    try {
      const [tab] = await chrome.tabs.query({
        lastFocusedWindow: true,
        active: true
      });
      scriptRunsOnTab.delete(tab.id);
    } catch (r) {}
  });
});
