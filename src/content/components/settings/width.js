import { postMessage } from '@chrome/runtime/port';
import { sidebar } from '@sidebar-root';
import { port } from '@port';

let widthTimeout;
/** @param {number} newWidth */
export const setSidebarWidth = (newWidth) => {
  if (newWidth > window.innerWidth) newWidth = window.innerWidth;
  else if (newWidth < 200) newWidth = 200;

  sidebar.style.width = `${newWidth}px`;

  clearTimeout(widthTimeout);
  widthTimeout = setTimeout(() => {
    postMessage(port, 'updateSettings', { sidebarWidth: newWidth });
  }, 250);
};
