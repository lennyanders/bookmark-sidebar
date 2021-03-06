import { browser } from 'webextension-polyfill-ts';
import { dictionaryKeys } from '@dictionary';
import { html } from './html';

export const footerHtml = html`<footer class="footer">
  <button class="footer__icon js-open-settings">
    <svg viewBox="0 0 24 24">
      <title>${browser.i18n.getMessage(dictionaryKeys.openSettings)}</title>
      <path
        d="M3 17v2h6v-2H3M3 5v2h10V5H3m10 16v-2h8v-2h-8v-2h-2v6h2M7 9v2H3v2h4v2h2V9H7m14 4v-2H11v2h10m-6-4h2V7h4V5h-4V3h-2v6z"
      />
    </svg>
  </button>
  <input
    class="footer__search js-searchbar"
    type="text"
    placeholder="${browser.i18n.getMessage(dictionaryKeys.searchPlaceholder)}"
  />
  <button class="footer__icon js-add-bookmark">
    <svg>
      <use href="#add-icon" />
    </svg>
  </button>
</footer>`;
