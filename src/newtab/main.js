import { browser } from 'webextension-polyfill-ts';
import { dictionaryKeys } from '@dictionary';

document.title = browser.i18n.getMessage(dictionaryKeys.newTab);

if (process.env.NODE_ENV === 'development') {
  browser.runtime.onMessage.addListener((msg) => msg.command === 'reload-tab' && location.reload());
}
