import Vue from 'vue';
import App from '../content/App';

const vueEl = document.createElement('div');
document.body.append(vueEl);

new Vue({
  el: vueEl,
  render: h => h(App)
});

const toggleBmBar = tabOrTabs => {
  const tab = tabOrTabs[0] || tabOrTabs;
  if (!tab.url.includes('chrome://newtab')) return;

  window.dispatchEvent(new CustomEvent('toggleBar'));
};

chrome.commands.onCommand.addListener(async command => {
  if (command !== 'toogle-bm-bar') return;
  chrome.tabs.query({ active: true, currentWindow: true }, toggleBmBar);
});

chrome.browserAction.onClicked.addListener(toggleBmBar);
