import Vue from 'vue';
import App from './App.vue';
import store from './store';

const bmBar = document.createElement('div'),
  shadowRoot = bmBar.attachShadow({ mode: 'closed' }),
  vueEl = document.createElement('div');

console.clear();
shadowRoot.append(vueEl);
document.body.append(bmBar);

new Vue({
  store,
  shadowRoot,
  el: vueEl,
  render: h => h(App)
});
