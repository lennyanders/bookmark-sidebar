import { onChanged } from '@chrome/storage';
import { get } from '@chrome/storage/sync';
import { getMessage } from '@chrome/i18n';
import { $ } from '@utils/dom';
import { getFolderUl } from '@shared/bookmark';
import { Positions, Themes, Defaults } from '@shared/consts/settings';
import { postMessageToAll } from './middleware';
import { getBookmarksHtml } from './data/html/getBookmarksHtml';

export const positions = {
  [Positions.left]: getMessage('left'),
  [Positions.right]: getMessage('right'),
};

export const themes = {
  [Themes.system]: getMessage('systemOriented'),
  [Themes.light]: getMessage('light'),
  [Themes.dark]: getMessage('dark'),
};

/**
 * @returns {typeof Defaults}
 */
export const getSettings = async () => {
  return Object.assign({}, Defaults, await get(Object.keys(Defaults)));
};

/** @type {HTMLElement} */
let sidebar;
const getSidebar = () => {
  if (!sidebar) sidebar = $('.sidebar');
  return sidebar;
};
onChanged(async (changes) => {
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
