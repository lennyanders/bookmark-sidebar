import { getMessage } from '@chrome/i18n';
import { Positions, Themes } from '@shared/consts/settings';
import { html } from './html';
import { footerHtml } from './footerHtml';
import { getModalHtml } from './getModalHtml';
import styles from '../../styles/main.scss';

/**
 * @param {Object} param
 * @param {string} param.bookmarksHtml
 * @param {chrome.bookmarks.BookmarkTreeNode[]} param.allFolders
 * @param {typeof import('@shared/consts/settings').Defaults} param.settings
 */
export const getSidebarHtml = ({ bookmarksHtml, allFolders, settings }) => html`<style>
    ${styles}
  </style>
  <svg hidden>
    <symbol id="add-icon" viewBox="0 0 24 24">
      <title>${getMessage('addBookmarkTooltip')}</title>
      <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"></path>
    </symbol>
    <symbol id="edit-icon" viewBox="0 0 24 24">
      <title>${getMessage('editBookmark')}</title>
      <path
        d="M14.06 9l.94.94L5.92 19H5v-.92L14.06 9m3.6-6c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29m-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z"
      ></path>
    </symbol>
    <symbol id="folder-icon" viewBox="0 0 24 24">
      <path
        d="M10 4H4c-1.11 0-2 .89-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8l-2-2z"
      ></path>
    </symbol>
    <symbol id="folder-empty-icon" viewBox="0 0 24 24">
      <path
        d="M9.17 6l2 2H20v10H4V6h5.17M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"
      ></path>
    </symbol>
    <symbol id="select-icon" viewBox="0 0 24 24">
      <path
        d="M12 5.83L15.17 9l1.41-1.41L12 3 7.41 7.59 8.83 9 12 5.83zm0 12.34L8.83 15l-1.41 1.41L12 21l4.59-4.59L15.17 15 12 18.17z"
      />
    </symbol>
  </svg>
  <div
    class="sidebar${settings.sidebarPosition === Positions.left &&
    ' sidebar--left'}${settings.theme !== Themes.system && ` sidebar--${settings.theme}`}"
    style="width:${settings.sidebarWidth}px"
    id="b${settings.sidebarShwonBookmark}"
    tabindex="-1"
  >
    <main>${bookmarksHtml}</main>
    ${footerHtml}${getModalHtml({ allFolders, settings })}
    <div class="resizer"></div>
  </div>`;
