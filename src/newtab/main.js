import '../../public/fonts/lato.css';
import './style.scss';

import { createApp } from 'vue';
import App from '../content/App';

createApp(App).mount(sidebarEl);

chrome.runtime.onMessage.addListener((message) => {
  if (message === 'toggle-bm-bar') {
    window.dispatchEvent(new CustomEvent('toggleBar'));
  }
});
