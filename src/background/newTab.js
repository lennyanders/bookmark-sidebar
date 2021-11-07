import { browser, Tabs } from 'webextension-polyfill-ts';

/** @param {Tabs.Tab} tab */
const useExtensionsNewTabPage = async (tab) => {
  if (!tab.pendingUrl?.endsWith('://newtab/')) return;

  await browser.tabs.update(tab.id, { url: browser.runtime.getURL('newtab.html') });
};

/** @param {Boolean} set */
export const setNewTab = async (set) => {
  if (set) browser.tabs.onCreated.addListener(useExtensionsNewTabPage);
  else browser.tabs.onCreated.removeListener(useExtensionsNewTabPage);
};
