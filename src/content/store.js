import Vue from 'vue';

const store = Vue.observable({
  barVisible: true,
  port: chrome.runtime.connect({ name: 'bmBar' }),
  bm: { children: [] },
  url: location.href,
  dragBmEl: null,
  dragBmNewParentId: null,
  dragY: null
});

store.port.onMessage.addListener(({ tree }) => {
  if (tree) store.bm = Object.freeze(tree);
});

window.addEventListener('toggleBar', () => {
  store.url = location.href;
  store.barVisible = !store.barVisible;
});

window.addEventListener('hideBar', () => {
  store.barVisible = false;
});

export default store;
