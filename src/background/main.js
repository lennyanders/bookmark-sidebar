import { browser, Tabs } from 'webextension-polyfill-ts';
import { tabToPort } from './middleware';

/** @param {Tabs.Tab} tab */
const insertAndToggleBmBar = async (tab) => {
  if (!tab?.id) return;

  if (tabToPort.has(tab.id)) {
    return tabToPort.get(tab.id).postMessage({ type: 'toggleSidebarVisibility' });
  }

  try {
    await browser.tabs.insertCSS({ file: 'fonts/lato.css' });
    await browser.tabs.executeScript({ file: 'content.js' });
  } catch (ex) {
    await browser.tabs.create({ index: tab.index + 1, url: browser.runtime.getURL('newtab.html') });
  }
};

browser.browserAction.onClicked.addListener(insertAndToggleBmBar);

browser.commands.onCommand.addListener(async (command) => {
  if (command !== 'toggle-bm-bar') return;

  insertAndToggleBmBar((await browser.tabs.query({ active: true, currentWindow: true }))[0]);
});

if (process.env.NODE_ENV === 'development') import('./hot-reload');
