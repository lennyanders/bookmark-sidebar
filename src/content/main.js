import Vue from 'vue';
import App from './App.vue';

// make chrome API usable in templates
Vue.prototype.$chrome = chrome;

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
    render: h => h(App)
  }).$mount(vueEl);

document.body.addEventListener('click', () => {
  window.dispatchEvent(new CustomEvent('hideBar'));
});
