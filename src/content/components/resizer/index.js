import { $ } from '@utils/dom';
import { sidebar } from '@sidebar-root';
import { setSidebarWidth } from '@components/settings/width';

export const enableResizer = () => {
  const resizer = $('.resizer');

  /** @param {MouseEvent} param */
  const resize = ({ x }) => {
    setSidebarWidth(sidebar.classList.contains('sidebar--left') ? x : window.innerWidth - x);
  };

  resizer.addEventListener(
    'mousedown',
    () => {
      resizer.style.setProperty('--resizer-scale', '8');
      window.addEventListener('mousemove', resize, { passive: true });

      window.addEventListener(
        'mouseup',
        () => {
          window.removeEventListener('mousemove', resize);
          resizer.style.removeProperty('--resizer-scale');
        },
        { once: true, passive: true },
      );
    },
    { passive: true },
  );
};
