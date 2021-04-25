import { postMessage } from '@chrome/runtime/port';
import { $, on } from '@utils/dom';
import { port } from '@port';
import { setSidebarWidth } from '@components/settings/width';
import { showModal } from './showHide';

export const enableSettings = () => {
  /** @type {HTMLFormElement} */
  const modalSettings = $('.js-modal-settings');

  on($('.js-open-settings'), 'click', () => showModal(modalSettings));

  on(modalSettings.elements.reset, 'click', () => postMessage(port, 'resetSettings'));

  /** @type {HTMLSelectElement} */
  const bookmarkSelect = modalSettings.elements.sidebarShwonBookmark;
  on(bookmarkSelect, 'change', () => {
    postMessage(port, 'updateSettings', { sidebarShwonBookmark: bookmarkSelect.value });
  });

  /** @type {HTMLInputElement[] & RadioNodeList} */
  const positionRadios = modalSettings.elements.sidebarPosition;
  positionRadios.forEach((radio) => {
    on(radio, 'change', () => {
      postMessage(port, 'updateSettings', { sidebarPosition: positionRadios.value });
    });
  });

  /** @type {HTMLSelectElement} */
  const themeSelect = modalSettings.elements.theme;
  on(themeSelect, 'change', () => {
    postMessage(port, 'updateSettings', { theme: themeSelect.value });
  });

  /** @type {HTMLInputElement} */
  const widthInput = modalSettings.elements.sidebarWidth;
  on(widthInput, 'input', () => setSidebarWidth(+widthInput.value));
};
