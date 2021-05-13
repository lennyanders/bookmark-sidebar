import { browser, Bookmarks } from 'webextension-polyfill-ts';
import { dictionaryKeys } from '@dictionary';
import { settingsNames, addBookmarkNames, editBookmarkNames } from '@shared/consts/inputNames';
import { html } from './html';
import { positions, themes } from '../../settings';

let inputId = 0;

/**
 * @param {object} param
 * @param {Bookmarks.BookmarkTreeNode[]} param.allFolders
 * @param {typeof import('@shared/consts/settings').Defaults} param.settings
 */
export const getModalHtml = ({ allFolders, settings }) => html`<div class="modal" tabindex="-1">
  <button
    class="modal__close js-close-modal"
    title="${browser.i18n.getMessage(dictionaryKeys.closeModal)}"
  ></button>

  <form class="modal__content js-modal-settings" hidden>
    <h2 class="modal__headline">${browser.i18n.getMessage(dictionaryKeys.settings)}</h2>
    <div class="select">
      <label class="select__label" for="i${inputId}">
        ${browser.i18n.getMessage(dictionaryKeys.displayedFolder)}
      </label>
      <select class="select__el" id="i${inputId}" name="${settingsNames.sidebarShwonBookmark}">
        ${allFolders.map(
          (folder) =>
            html`<option
              value="${folder.id}"
              ${folder.id === settings.sidebarShwonBookmark && ' selected'}
            >
              ${folder.id === '0' ? 'Root' : folder.title}
            </option>`,
        )}
      </select>
      <svg class="select__icon">
        <use href="#select-icon" />
      </svg>
    </div>
    <div class="radio-checkbox">
      <span class="radio-checkbox__label">${browser.i18n.getMessage(dictionaryKeys.position)}</span>
      ${Object.entries(positions).map(
        ([key, value]) => html`<input
            class="radio-checkbox__el"
            id="i${++inputId}"
            type="radio"
            name="${settingsNames.sidebarPosition}"
            value="${key}"
            ${key === settings.sidebarPosition && ' checked'}
          />
          <label class="radio-checkbox__option" for="i${inputId}">${value}</label>`,
      )}
    </div>
    <div class="select">
      <label class="select__label" for="i${++inputId}">
        ${browser.i18n.getMessage(dictionaryKeys.colorTheme)}
      </label>
      <select class="select__el" name="${settingsNames.theme}">
        ${Object.entries(themes).map(
          ([key, value]) =>
            html`<option value="${key}" ${key === settings.theme && ' selected'}>${value}</option>`,
        )}
      </select>
      <svg class="select__icon">
        <use href="#select-icon" />
      </svg>
    </div>
    <div class="input">
      <label class="input__label" for="i${++inputId}">
        ${browser.i18n.getMessage(dictionaryKeys.widthOfSidebar)}
      </label>
      <input
        class="input__el"
        id="i${inputId}"
        type="number"
        name="${settingsNames.sidebarWidth}"
        value="${settings.sidebarWidth}"
        required
      />
    </div>
    <div class="modal__actions">
      <button class="button" type="button" name="${settingsNames.reset}">
        ${browser.i18n.getMessage(dictionaryKeys.reset)}
      </button>
    </div>
  </form>

  <form class="modal__content js-modal-add-bookmark" hidden>
    <h2 class="modal__headline">${browser.i18n.getMessage(dictionaryKeys.addBookmark)}</h2>
    <input type="hidden" name="${addBookmarkNames.parentId}" />
    <div class="input">
      <label class="input__label" for="i${++inputId}"
        >${browser.i18n.getMessage(dictionaryKeys.title)}</label
      >
      <input
        class="input__el"
        id="i${inputId}"
        type="text"
        name="${addBookmarkNames.title}"
        required
      />
    </div>
    <div class="input">
      <label class="input__label" for="i${++inputId}"
        >${browser.i18n.getMessage(dictionaryKeys.url)}</label
      >
      <input
        class="input__el"
        id="i${inputId}"
        type="url"
        name="${addBookmarkNames.url}"
        required
      />
    </div>
    <div class="modal__actions">
      <button class="button js-modal-add-folder" type="button">
        ${browser.i18n.getMessage(dictionaryKeys.addFolder)}
      </button>
      <button class="button" type="submit">
        ${browser.i18n.getMessage(dictionaryKeys.addBookmark)}
      </button>
    </div>
  </form>

  <form class="modal__content js-modal-edit-bookmark" hidden>
    <h2 class="modal__headline">${browser.i18n.getMessage(dictionaryKeys.editBookmark)}</h2>
    <input type="hidden" name="${editBookmarkNames.id}" />
    <div class="input">
      <label class="input__label" for="i${++inputId}"
        >${browser.i18n.getMessage(dictionaryKeys.title)}</label
      >
      <input
        class="input__el"
        id="i${inputId}"
        type="text"
        name="${editBookmarkNames.title}"
        required
      />
    </div>
    <div class="input">
      <label class="input__label" for="i${++inputId}"
        >${browser.i18n.getMessage(dictionaryKeys.url)}</label
      >
      <input
        class="input__el"
        id="i${inputId}"
        type="url"
        name="${editBookmarkNames.url}"
        required
      />
    </div>
    <div class="modal__actions">
      <button class="button js-modal-delete-bookmark" type="button">
        ${browser.i18n.getMessage(dictionaryKeys.delete)}
      </button>
      <button class="button" type="submit">
        ${browser.i18n.getMessage(dictionaryKeys.update)}
      </button>
    </div>
  </form>

  <form class="modal__content js-modal-edit-folder" hidden>
    <h2 class="modal__headline">${browser.i18n.getMessage(dictionaryKeys.editFolder)}</h2>
    <input type="hidden" name="${editBookmarkNames.id}" />
    <div class="input">
      <label class="input__label" for="i${++inputId}"
        >${browser.i18n.getMessage(dictionaryKeys.title)}</label
      >
      <input
        class="input__el"
        id="i${inputId}"
        type="text"
        name="${editBookmarkNames.title}"
        required
      />
    </div>
    <div class="modal__actions">
      <button class="button js-modal-delete-bookmark" type="button">
        ${browser.i18n.getMessage(dictionaryKeys.delete)}
      </button>
      <button class="button" type="submit">
        ${browser.i18n.getMessage(dictionaryKeys.update)}
      </button>
    </div>
  </form>
</div>`;
