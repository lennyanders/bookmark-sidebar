import { browser } from 'webextension-polyfill-ts';
import { dictionaryKeys } from '@dictionary';
import { $ } from '@utils/dom';
import { getFolderUl } from '@shared/bookmark';
import { Positions, Themes, Defaults } from '@shared/consts/settings';
import { postMessageToAll } from './middleware';
import { getBookmarksHtml } from './data/html/getBookmarksHtml';

export const positions = {
  [Positions.left]: browser.i18n.getMessage(dictionaryKeys.left),
  [Positions.right]: browser.i18n.getMessage(dictionaryKeys.right),
};

export const themes = {
  [Themes.system]: browser.i18n.getMessage(dictionaryKeys.systemOriented),
  [Themes.light]: browser.i18n.getMessage(dictionaryKeys.light),
  [Themes.dark]: browser.i18n.getMessage(dictionaryKeys.dark),
};

/**
 * @returns {typeof Defaults}
 */
export const getSettings = async () => {
  return Object.assign({}, Defaults, await browser.storage.sync.get(Object.keys(Defaults)));
};

/** @type {HTMLElement} */
let sidebar;
const getSidebar = () => {
  if (!sidebar) sidebar = $('.sidebar');
  return sidebar;
};
browser.storage.onChanged.addListener(async (changes) => {
  /** @type {HTMLFormElement} */
  const modalSettings = $('.js-modal-settings');
  const settingsChanged = {};

  if (changes.theme) {
    const sidebar = getSidebar();
    const { oldValue, newValue } = changes.theme;
    if (oldValue !== Themes.system) sidebar.classList.remove(`sidebar--${oldValue}`);
    if (newValue !== Themes.system) sidebar.classList.add(`sidebar--${newValue}`);

    modalSettings.elements.theme.childNodes.forEach((option) => {
      if (option.value !== newValue) option.removeAttribute('selected');
      else option.setAttribute('selected', '');
    });

    settingsChanged.theme = changes.theme;
  }

  if (changes.sidebarPosition) {
    const newValue = changes.sidebarPosition.newValue;
    getSidebar().classList.toggle('sidebar--left', newValue === Positions.left);

    modalSettings.elements.sidebarPosition.forEach((radio) => {
      if (radio.value !== newValue) radio.removeAttribute('checked');
      else radio.setAttribute('checked', '');
    });

    settingsChanged.sidebarPosition = newValue;
  }

  if (changes.sidebarWidth) {
    const newValue = changes.sidebarWidth.newValue;
    getSidebar().style.width = `${newValue}px`;
    modalSettings.elements.sidebarWidth.setAttribute('value', newValue);

    settingsChanged.sidebarWidth = newValue;
  }

  if (changes.sidebarShwonBookmark) {
    const main = $('main');
    const newValue = changes.sidebarShwonBookmark.newValue;
    const children = getFolderUl(newValue);
    if (children?.hasChildNodes()) {
      children.removeAttribute('class');
      children.hidden = false;
      main.innerHTML = '';
      main.append(children);
    } else {
      settingsChanged.bookmarksHtml = await getBookmarksHtml(newValue);
      main.innerHTML = settingsChanged.bookmarksHtml;
    }
    getSidebar().id = `b${newValue}`;
    // update modal
    modalSettings.elements.sidebarShwonBookmark.childNodes.forEach((option) => {
      if (option.value !== newValue) option.removeAttribute('selected');
      else option.setAttribute('selected', '');
    });
    settingsChanged.sidebarShwonBookmark = newValue;
  }

  postMessageToAll('settingsChanged', settingsChanged);
});
