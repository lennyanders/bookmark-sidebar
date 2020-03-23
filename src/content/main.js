import Vue from 'vue';
import App from './App.vue';

const bmBar = document.createElement('div'),
  shadowRoot = bmBar.attachShadow({ mode: 'closed' }),
  vueEl = document.createElement('div');

shadowRoot.append(styles);
shadowRoot.append(vueEl);
document.body.append(bmBar);

new Vue({
  el: vueEl,
  render: h => h(App)
});
