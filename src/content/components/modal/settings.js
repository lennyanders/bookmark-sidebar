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
    port.postMessage({ type: 'resetSettings' });
  });

  /** @type {HTMLSelectElement} */
  const bookmarkSelect = modalSettings.elements[settingsNames.sidebarShwonBookmark];
  on(bookmarkSelect, 'change', () => {
    port.postMessage({ type: 'updateSettings', sidebarShwonBookmark: bookmarkSelect.value });
  });

  /** @type {HTMLInputElement[] & RadioNodeList} */
  const positionRadios = modalSettings.elements[settingsNames.sidebarPosition];
  positionRadios.forEach((radio) => {
    on(radio, 'change', () => {
      port.postMessage({ type: 'updateSettings', sidebarPosition: positionRadios.value });
    });
  });

  /** @type {HTMLSelectElement} */
  const themeSelect = modalSettings.elements[settingsNames.theme];
  on(themeSelect, 'change', () => {
    port.postMessage({ type: 'updateSettings', theme: themeSelect.value });
  });

  /** @type {HTMLInputElement} */
  const widthInput = modalSettings.elements[settingsNames.sidebarWidth];
  on(widthInput, 'input', () => setSidebarWidth(+widthInput.value));

  /** @type {HTMLInputElement} */
  const newTabCheckbox = modalSettings.elements[settingsNames.useExtensionsNewTabPage];
  on(newTabCheckbox, 'change', () => {
    port.postMessage({ type: 'updateSettings', useExtensionsNewTabPage: newTabCheckbox.checked });
  });
};
