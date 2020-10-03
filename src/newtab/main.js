import '../../public/fonts/lato.css';
import './style.scss';

import { createApp } from 'vue';
import App from '../content/App';

createApp(App).mount(sidebarEl);

const toggleBmBar = () => {
  if (!document.hasFocus()) return;

  window.dispatchEvent(new CustomEvent('toggleBar'));
};

chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'toogle-bm-bar') toggleBmBar();
});

chrome.browserAction.onClicked.addListener(toggleBmBar);
