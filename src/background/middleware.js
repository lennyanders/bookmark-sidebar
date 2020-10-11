import { watch } from '@vue-reactivity/watch';

import { scriptRunsOnTab } from './insertAndToggleBmBar';
import { data } from './data';

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
  seteditBookmarkOnRightClick({ editBookmarkOnRightClick }) {
    chrome.storage.sync.set({ editBookmarkOnRightClick });
  },
};

export const startMiddleware = () => {
  chrome.runtime.onConnect.addListener((port) => {
    if (port.name !== 'bmBar') return;

    let tabId;
    chrome.tabs.query({ active: true, currentWindow: true }, ([{ id }]) => {
      tabId = id;
      scriptRunsOnTab.add(tabId);
    });

    port.onMessage.addListener((msg) => actions[msg.type]?.(msg));

    port.postMessage(data);

    const stopWatch = watch(
      [
        () => data.bm,
        () => data.allFolders,
        () => data.barLeft,
        () => data.barWidth,
        () => data.barTheme,
        () => data.editBookmarkOnRightClick,
      ],
      (
        [bm, allFolders, barLeft, barWidth, barTheme, editBookmarkOnRightClick],
        [
          oldBm,
          oldAllFolders,
          oldBarLeft,
          oldBarWidth,
          oldbarTheme,
          oldEditBookmarkOnRightClick,
        ],
      ) => {
        port.postMessage({
          ...(bm !== oldBm && { bm }),
          ...(allFolders !== oldAllFolders && { allFolders }),
          ...(barLeft !== oldBarLeft && { barLeft }),
          ...(barWidth !== oldBarWidth && { barWidth }),
          ...(barTheme !== oldbarTheme && { barTheme }),
          ...(editBookmarkOnRightClick !== oldEditBookmarkOnRightClick && {
            editBookmarkOnRightClick,
          }),
        });
      },
    );

    port.onDisconnect.addListener(async () => {
      stopWatch();
      scriptRunsOnTab.delete(tabId);
    });
  });
};
