import Vue from 'vue';
import App from '../content/App.vue';

const vueEl = document.createElement('div');
document.body.appendChild(vueEl);

new Vue({
  el: vueEl,
  render: h => h(App)
});

chrome.browserAction.onClicked.addListener(() => {
  window.dispatchEvent(new CustomEvent('toggleBar'));
});
