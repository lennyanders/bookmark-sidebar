import { createApp, h } from 'vue';
import TheBookmarkBar from '@sidebar/App.vue';

const bmBar = Object.assign(document.createElement('div'), {
  style: 'position:fixed;display:block;z-index:2147483647',
});

const shadowRoot = bmBar.attachShadow({ mode: 'closed' });

const NOOP = () => {};
shadowRoot.removeAttribute = NOOP;
shadowRoot.setAttribute = NOOP;

createApp(() => [h('style', window.styles), h(TheBookmarkBar)]).mount(
  shadowRoot,
);

document.body.append(bmBar);
