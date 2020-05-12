import { createApp } from 'vue';
import App from './App';

const bmBar = document.createElement('div'),
  shadowRoot = bmBar.attachShadow({ mode: 'closed' }),
  vueEl = document.createElement('div');

shadowRoot.append(styles);
shadowRoot.append(vueEl);
document.body.append(bmBar);

createApp(App).mount(vueEl);
