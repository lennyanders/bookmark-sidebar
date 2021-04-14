import { getUrl } from '@chrome/runtime';
import { postMessage } from '@chrome/runtime/port';
import { create, query, insertCss, executeScript } from '@chrome/tabs';
import { onClicked } from '@chrome/browserAction';
import { onCommand } from '@chrome/commands';
import { tabToPort } from './middleware';

/** @param {chrome.tabs.Tab} tab */
const insertAndToggleBmBar = async (tab) => {
  if (!tab?.id) return;

  if (tabToPort.has(tab.id)) {
    return postMessage(tabToPort.get(tab.id), 'toggleSidebarVisibility');
  }

  await insertCss({ file: 'fonts/lato.css' });

  const success = await executeScript({ file: 'content.js' });
  if (success !== undefined) return;

  await create({ index: tab.index + 1, url: getUrl('newtab.html') });
};

onClicked(insertAndToggleBmBar);

onCommand('toggle-bm-bar', async () => {
  insertAndToggleBmBar((await query({ active: true, currentWindow: true }))[0]);
});

if (process.env.NODE_ENV === 'development') import('./hot-reload');
