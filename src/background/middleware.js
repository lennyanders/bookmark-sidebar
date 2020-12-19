import { watchEffect } from '@vue-reactivity/watch';

import { scriptRunsOnTab } from './insertAndToggleBmBar';
import { data } from './data';
import { defaults } from '@shared/settings.json';

const actions = {
  remove({ id }) {
    chrome.bookmarks.removeTree(id);
  },
  create({ parentId, title, url }) {
    chrome.bookmarks.create({
      parentId,
      title,
      ...(url && { url }),
    });
  },
  async move({ id, index, parentId }) {
    try {
      await chrome.bookmarks.move(id, {
        ...(index !== undefined && { index }),
        ...(parentId && { parentId }),
      });
    } catch (err) {}
  },
  update({ id, title, url }) {
    chrome.bookmarks.update(id, {
      ...(title && { title }),
      ...(url && { url }),
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
  },
  setEditBookmarkOnRightClick({ editBookmarkOnRightClick }) {
    chrome.storage.sync.set({ editBookmarkOnRightClick });
  },
  reset() {
    chrome.storage.sync.set(defaults);
  },
};

export const startMiddleware = () => {
  chrome.runtime.onConnect.addListener((port) => {
    if (port.name !== 'bmBar') return;

    scriptRunsOnTab.add(port.sender.tab.id);

    port.onMessage.addListener((msg) => actions[msg.type]?.(msg));

    const stopWatch = watchEffect(() => port.postMessage(data));

    port.onDisconnect.addListener(() => {
      stopWatch();
      scriptRunsOnTab.delete(port.sender.tab.id);
    });
  });
};
