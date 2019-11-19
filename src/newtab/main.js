import Vue from 'vue';
import App from '../content/App.vue';
import store from '../content/store';

const vueEl = document.createElement('div');
document.body.appendChild(vueEl);

new Vue({
  store,
  el: vueEl,
  render: h => h(App)
});

chrome.browserAction.onClicked.addListener(() => {
  window.dispatchEvent(new CustomEvent('toggleBar'));
});
