import { onConnect } from '@chrome/runtime';
import { postMessage, onMessage, onDisconnect } from '@chrome/runtime/port';
import { create, update, move, remove } from '@chrome/bookmarks';
import { set } from '@chrome/storage/sync';
import { Defaults } from '@shared/consts/settings';
import { root } from './data';

/** @type {Map<number, chrome.runtime.Port>} */
export const tabToPort = new Map();

/**
 * @param {string} type
 * @param {Record<string, any} [message]
 */
export const postMessageToAll = (type, message) => {
  tabToPort.forEach((port) => postMessage(port, type, message));
};

const on = {
  createBookmark(options) {
    create(options);
  },
  updateBookmark({ id, title, url }) {
    update(id, { title, url });
  },
  moveBookmark({ id, index, parentId }) {
    move(id, { index, parentId });
  },
  removeBookmark({ id }) {
    remove(id);
  },
  updateSettings(settings) {
    set(settings);
  },
  resetSettings() {
    set(Defaults);
  },
};

onConnect((port) => {
  if (port.name !== 'bookmark-sidebar') return;

  const tabId = port.sender?.tab?.id;
  if (!tabId) return;

  tabToPort.set(tabId, port);

  postMessage(port, 'sidebar', {
    bookmarkSidebarHtml: root.innerHTML,
  });

  for (const key in on) onMessage(port, key, on[key]);

  onDisconnect(port, () => tabToPort.delete(tabId));
});
