import { createApp } from 'vue';
import App from './App';

const bmBar = document.createElement('div');
bmBar.style.position = 'fixed';
bmBar.style.zIndex = 2147483647;

const shadowRoot = bmBar.attachShadow({ mode: 'closed' });
const vueEl = document.createElement('div');

createApp(App).mount(vueEl);

shadowRoot.append(styles);
shadowRoot.append(vueEl);
document.body.append(bmBar);
