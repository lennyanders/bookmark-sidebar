import { $, on, once } from '@utils/dom';
import { sidebar } from '@sidebar-root';
import { setSidebarWidth } from '@components/settings/width';

export const enableResizer = () => {
  const resizer = $('.resizer');

  /** @param {MouseEvent} param */
  const resize = ({ x }) => {
    setSidebarWidth(sidebar.classList.contains('sidebar--left') ? x : window.innerWidth - x);
  };

  on(resizer, 'mousedown', () => {
    resizer.style.setProperty('--resizer-scale', '8');
    const off = on(window, 'mousemove', resize);

    once(window, 'mouseup', () => {
      console.log(1);
      off();
      resizer.style.removeProperty('--resizer-scale');
    });
  });
};
