import { postMessage } from '@chrome/runtime/port';
import { shadowRoot } from '@sidebar-root';
import { port } from '@port';
import { setSidebarWidth } from '@components/settings/width';
import { showModal } from './showHide';

export const enableSettings = () => {
  /** @type {HTMLFormElement} */
  const modalSettings = shadowRoot.querySelector('.js-modal-settings');

  shadowRoot
    .querySelector('.js-open-settings')
    .addEventListener('click', () => showModal(modalSettings), { passive: true });

  modalSettings.elements.reset.addEventListener('click', () => postMessage(port, 'resetSettings'), {
    passive: true,
  });

  /** @type {HTMLSelectElement} */
  const bookmarkSelect = modalSettings.elements.sidebarShwonBookmark;
  bookmarkSelect.addEventListener(
    'change',
    () => postMessage(port, 'updateSettings', { sidebarShwonBookmark: bookmarkSelect.value }),
    { passive: true },
  );

  /** @type {HTMLInputElement[] & RadioNodeList} */
  const positionRadios = modalSettings.elements.sidebarPosition;
  positionRadios.forEach((radio) => {
    radio.addEventListener(
      'change',
      () => postMessage(port, 'updateSettings', { sidebarPosition: positionRadios.value }),
      { passive: true },
    );
  });

  /** @type {HTMLSelectElement} */
  const themeSelect = modalSettings.elements.theme;
  themeSelect.addEventListener(
    'change',
    () => postMessage(port, 'updateSettings', { theme: themeSelect.value }),
    { passive: true },
  );

  /** @type {HTMLInputElement} */
  const widthInput = modalSettings.elements.sidebarWidth;
  widthInput.addEventListener('input', () => setSidebarWidth(+widthInput.value), { passive: true });
};
