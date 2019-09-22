import Vue from 'vue';
import App from './App.vue';
import store from './store';

const bmBar = document.createElement('div');
const shadow = bmBar.attachShadow({ mode: 'closed' });

const style = document.createElement('link');
style.rel = 'stylesheet';
style.href = chrome.runtime.getURL('content/main.css');
const vueEl = document.createElement('div');

shadow.appendChild(style);
shadow.appendChild(vueEl);
document.body.appendChild(bmBar);

style.onload = () =>
  new Vue({
    store,
    el: vueEl,
    render: h => h(App)
  });

document.body.addEventListener('click', () => {
  window.dispatchEvent(new CustomEvent('hideBar'));
});
