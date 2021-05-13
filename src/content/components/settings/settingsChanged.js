import { Positions, Themes } from '@shared/consts/settings';
import { $ } from '@utils/dom';
import { enableDragAndDrop } from '@components/bookmark/dragAndDrop';
import { sidebar } from '@sidebar-root';

export const settingsChanged = (changes) => {
  /** @type {HTMLFormElement} */
  const modalSettings = $('.js-modal-settings');

  if (changes.sidebarShwonBookmark) {
    const main = $('main');
    if (changes.bookmarksHtml) {
      main.innerHTML = changes.bookmarksHtml;
      enableDragAndDrop();
    } else {
      const children = $(`#b${changes.sidebarShwonBookmark} ul`);
      if (children) {
        children.removeAttribute('class');
        children.hidden = false;
        main.innerHTML = '';
        main.append(children);
      }
    }
    sidebar.id = `b${changes.sidebarShwonBookmark}`;
    modalSettings.elements.sidebarShwonBookmark.value = changes.sidebarShwonBookmark;
  }

  if (changes.sidebarPosition) {
    sidebar.classList.toggle('sidebar--left', changes.sidebarPosition === Positions.left);
    modalSettings.elements.sidebarPosition.value = changes.sidebarPosition;
  }

  if (changes.theme) {
    const { oldValue, newValue } = changes.theme;
    if (oldValue !== Themes.system) sidebar.classList.remove(`sidebar--${oldValue}`);
    if (newValue !== Themes.system) sidebar.classList.add(`sidebar--${newValue}`);
    modalSettings.elements.theme.value = newValue;
  }

  if (changes.sidebarWidth) {
    sidebar.style.width = `${changes.sidebarWidth}px`;
    modalSettings.elements.sidebarWidth.value = changes.sidebarWidth;
  }
};
