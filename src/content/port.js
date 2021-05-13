import { browser } from 'webextension-polyfill-ts';

export const port = browser.runtime.connect({ name: 'bookmark-sidebar' });
