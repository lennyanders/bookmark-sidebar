import { createApp } from 'vue';
import { i18n } from '@shared/utils';
import App from './App.vue';

document.title = i18n('newTab');

createApp(App).mount(document.body);
