import { createApp, h } from 'vue';
import TheBookmarkBar from '../bookmarkBar/App';

const bmBar = document.createElement('div');
bmBar.style.position = 'fixed';
bmBar.style.zIndex = 2147483647;

const shadowRoot = bmBar.attachShadow({ mode: 'closed' });

const NOOP = () => {};
shadowRoot.removeAttribute = NOOP;
shadowRoot.setAttribute = NOOP;

createApp(() => [h('style', styles), h(TheBookmarkBar)]).mount(shadowRoot);

document.body.append(bmBar);
