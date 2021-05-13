import { postMessage } from '@chrome/runtime/port';
import { $, on } from '@utils/dom';
import { settingsNames } from '@shared/consts/inputNames';
import { port } from '@port';
import { setSidebarWidth } from '@components/settings/width';
import { showModal } from './showHide';

export const enableSettings = () => {
  /** @type {HTMLFormElement} */
  const modalSettings = $('.js-modal-settings');

  on($('.js-open-settings'), 'click', () => showModal(modalSettings));

  on(modalSettings.elements[settingsNames.reset], 'click', () => {
    postMessage(port, 'resetSettings');
  });

  /** @type {HTMLSelectElement} */
  const bookmarkSelect = modalSettings.elements[settingsNames.sidebarShwonBookmark];
  on(bookmarkSelect, 'change', () => {
    postMessage(port, 'updateSettings', { sidebarShwonBookmark: bookmarkSelect.value });
  });

  /** @type {HTMLInputElement[] & RadioNodeList} */
  const positionRadios = modalSettings.elements[settingsNames.sidebarPosition];
  positionRadios.forEach((radio) => {
    on(radio, 'change', () => {
      postMessage(port, 'updateSettings', { sidebarPosition: positionRadios.value });
    });
  });

  /** @type {HTMLSelectElement} */
  const themeSelect = modalSettings.elements[settingsNames.theme];
  on(themeSelect, 'change', () => {
    postMessage(port, 'updateSettings', { theme: themeSelect.value });
  });

  /** @type {HTMLInputElement} */
  const widthInput = modalSettings.elements[settingsNames.sidebarWidth];
  on(widthInput, 'input', () => setSidebarWidth(+widthInput.value));
};
