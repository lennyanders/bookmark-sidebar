import { getBaseUrl } from '@utils';
import { html } from './html';
import { faviconDataUrls } from '../../favicon';

/**
 * @param {import('webextension-polyfill-ts').Bookmarks.BookmarkTreeNode} bookmark
 * @returns {string}
 */
export const getBookmarkHtml = (bookmark) => {
  const isFolder = !bookmark.url;
  const titleHtml = html`<span class="bookmark__title">${bookmark.title}</span>`;

  return html`<li class="bookmark" id="b${bookmark.id}">
    <div class="bookmark__content">
      ${!isFolder
        ? html`<a
            class="bookmark__link"
            href="${bookmark.url}"
            title="${bookmark.title} | ${bookmark.url}"
          >
            <img
              class="bookmark__icon"
              alt=""
              src="${faviconDataUrls.get(getBaseUrl(bookmark.url))}"
            />
            ${titleHtml}
          </a>`
        : html`<button class="bookmark__link js-toggle-folder-children" title="${bookmark.title}">
              <svg class="bookmark__icon">
                <use href="#folder${!bookmark.children?.length && '-empty'}-icon" />
              </svg>
              ${titleHtml}
            </button>
            ${bookmark.id !== '0' &&
            html`<button class="bookmark__option js-add-bookmark">
              <svg class="bookmark__icon">
                <use href="#add-icon" />
              </svg>
            </button>`}`}
      ${['1', '2', '3'].every((id) => id !== bookmark.id) &&
      html`<button class="bookmark__option js-edit-${isFolder ? 'folder' : 'bookmark'}">
        <svg class="bookmark__icon">
          <use href="#edit-icon" />
        </svg>
      </button>`}
    </div>
    ${isFolder &&
    html`<ul class="bookmark__children" hidden>
      ${bookmark.children?.map(getBookmarkHtml)}
    </ul>`}
  </li>`;
};
