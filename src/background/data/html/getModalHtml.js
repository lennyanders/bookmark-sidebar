import { getMessage } from '@chrome/i18n';
import { dictionaryKeys } from '@dictionary';
import { html } from './html';
import { positions, themes } from '../../settings';

let inputId = 0;

/**
 * @param param
 * @param {chrome.bookmarks.BookmarkTreeNode[]} param.allFolders
 * @param {typeof import('@shared/consts/settings').Defaults} param.settings
 */
export const getModalHtml = ({ allFolders, settings }) => html`<div class="modal " tabindex="-1">
  <button
    class="modal__close js-close-modal"
    title="${getMessage(dictionaryKeys.closeModal)}"
  ></button>

  <form class="modal__content js-modal-settings" hidden>
    <h2 class="modal__headline">${getMessage(dictionaryKeys.settings)}</h2>
    <div class="select">
      <label class="select__label" for="i${inputId}">
        ${getMessage(dictionaryKeys.displayedFolder)}
      </label>
      <select class="select__el" id="i${inputId}" name="sidebarShwonBookmark">
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
      <span class="radio-checkbox__label">${getMessage(dictionaryKeys.position)}</span>
      ${Object.entries(positions).map(
        ([key, value]) => html`<input
            class="radio-checkbox__el"
            id="i${++inputId}"
            type="radio"
            name="sidebarPosition"
            value="${key}"
            ${key === settings.sidebarPosition && ' checked'}
          />
          <label class="radio-checkbox__option" for="i${inputId}">${value}</label>`,
      )}
    </div>
    <div class="select">
      <label class="select__label" for="i${++inputId}">
        ${getMessage(dictionaryKeys.colorTheme)}
      </label>
      <select class="select__el" name="theme">
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
        ${getMessage(dictionaryKeys.widthOfSidebar)}
      </label>
      <input
        class="input__el"
        id="i${inputId}"
        type="number"
        name="sidebarWidth"
        value="${settings.sidebarWidth}"
        required
      />
    </div>
    <div class="modal__actions">
      <button class="button" type="button" name="reset">${getMessage(dictionaryKeys.reset)}</button>
    </div>
  </form>

  <form class="modal__content js-modal-add-bookmark" hidden>
    <h2 class="modal__headline">${getMessage(dictionaryKeys.addBookmark)}</h2>
    <input type="hidden" name="parentId" />
    <div class="input">
      <label class="input__label" for="i${++inputId}">${getMessage(dictionaryKeys.title)}</label>
      <input class="input__el" id="i${inputId}" type="text" name="title" required />
    </div>
    <div class="input">
      <label class="input__label" for="i${++inputId}">${getMessage(dictionaryKeys.url)}</label>
      <input class="input__el" id="i${inputId}" type="url" name="url" required />
    </div>
    <div class="modal__actions">
      <button class="button js-modal-add-folder" type="button">
        ${getMessage(dictionaryKeys.addFolder)}
      </button>
      <button class="button" type="submit">${getMessage(dictionaryKeys.addBookmark)}</button>
    </div>
  </form>

  <form class="modal__content js-modal-edit-bookmark" hidden>
    <h2 class="modal__headline">${getMessage(dictionaryKeys.editBookmark)}</h2>
    <input type="hidden" name="id" />
    <div class="input">
      <label class="input__label" for="i${++inputId}">${getMessage(dictionaryKeys.title)}</label>
      <input class="input__el" id="i${inputId}" type="text" name="title" required />
    </div>
    <div class="input">
      <label class="input__label" for="i${++inputId}">${getMessage(dictionaryKeys.url)}</label>
      <input class="input__el" id="i${inputId}" type="url" name="url" required />
    </div>
    <div class="modal__actions">
      <button class="button js-modal-delete-bookmark" type="button">
        ${getMessage(dictionaryKeys.delete)}
      </button>
      <button class="button" type="submit">${getMessage(dictionaryKeys.update)}</button>
    </div>
  </form>

  <form class="modal__content js-modal-edit-folder" hidden>
    <h2 class="modal__headline">${getMessage(dictionaryKeys.editFolder)}</h2>
    <input type="hidden" name="id" />
    <div class="input">
      <label class="input__label" for="i${++inputId}">${getMessage(dictionaryKeys.title)}</label>
      <input class="input__el" id="i${inputId}" type="text" name="title" required />
    </div>
    <div class="modal__actions">
      <button class="button js-modal-delete-bookmark" type="button">
        ${getMessage(dictionaryKeys.delete)}
      </button>
      <button class="button" type="submit">${getMessage(dictionaryKeys.update)}</button>
    </div>
  </form>
</div>`;
