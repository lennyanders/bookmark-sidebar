import Vue from 'vue';
import App from '../content/App';

const vueEl = document.createElement('div');
document.body.append(vueEl);

new Vue({
  el: vueEl,
  render: h => h(App)
});

chrome.browserAction.onClicked.addListener(() => {
  window.dispatchEvent(new CustomEvent('toggleBar'));
});
