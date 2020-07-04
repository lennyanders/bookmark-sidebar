import { createApp } from 'vue';
import App from '../content/App';

const vueEl = document.createElement('div');
document.body.append(vueEl);

createApp(App).mount(vueEl);

let tabId;
chrome.tabs.query({ active: true, currentWindow: true }, ([{ id }]) => {
  tabId = id;
});
const toggleBmBar = (tabOrTabs) => {
  const tab = tabOrTabs[0] || tabOrTabs;
  if (tab.id !== tabId) return;

  window.dispatchEvent(new CustomEvent('toggleBar'));
};

chrome.commands.onCommand.addListener(async (command) => {
  if (command !== 'toogle-bm-bar') return;
  chrome.tabs.query({ active: true, currentWindow: true }, toggleBmBar);
});

chrome.browserAction.onClicked.addListener(toggleBmBar);
