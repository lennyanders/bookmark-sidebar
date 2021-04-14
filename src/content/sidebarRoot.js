import { $ } from '@utils/dom';

export const root = Object.assign(document.createElement('div'), {
  style: 'position:fixed;display:block;z-index:2147483647',
});

export const shadowRoot = root.attachShadow({ mode: 'closed' });

/** @type {HTMLElement} */
export let sidebar;
export const setSidebar = () => (sidebar = $('.sidebar'));
