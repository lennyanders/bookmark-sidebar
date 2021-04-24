import { getMessage } from '@chrome/i18n';
import { dictionaryKeys } from '@dictionary';
import { html } from './html';

export const deletedBookmarkToastHtml = html` <div class="toast">
  <svg class="toast__circle toast__icon" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" fill="none" stroke-width="2" stroke="currentcolor"></circle>
  </svg>
  <span class="toast__message">${getMessage(dictionaryKeys.deltedBookmark)}</span>
  <button class="toast__undo" type="button">${getMessage(dictionaryKeys.undo)}</button>
  <button class="toast__close" type="button">
    <svg class="toast__icon" viewBox="0 0 24 24">
      <path
        d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
      />
    </svg>
  </button>
</div>`;
