import { browser, Runtime } from 'webextension-polyfill-ts';
import { Defaults } from '@shared/consts/settings';
import { root } from './data';

/** @type {Map<number, Runtime.Port>} */
export const tabToPort = new Map();

/**
 * @param {string} type
 * @param {Record<string, any} [message]
 */
export const postMessageToAll = (type, message) => {
  tabToPort.forEach((port) => port.postMessage({ type, ...message }));
};

const on = {
  createBookmark(options) {
    browser.bookmarks.create(options);
  },
  updateBookmark({ id, title, url }) {
    browser.bookmarks.update(id, { title, url });
  },
  moveBookmark({ id, index, parentId }) {
    browser.bookmarks.move(id, { index, parentId });
  },
  removeBookmark({ id }) {
    browser.bookmarks.remove(id);
  },
  updateSettings(settings) {
    browser.storage.sync.set(settings);
  },
  resetSettings() {
    browser.storage.sync.set(Defaults);
  },
};

browser.runtime.onConnect.addListener((port) => {
  if (port.name !== 'bookmark-sidebar') return;

  const tabId = port.sender?.tab?.id;
  if (!tabId) return;

  tabToPort.set(tabId, port);

  port.postMessage({ type: 'sidebar', bookmarkSidebarHtml: root.innerHTML });

  port.onMessage.addListener((msg) => on[msg.type]?.(delete msg.type && msg));

  port.onDisconnect.addListener(() => tabToPort.delete(tabId));
});
