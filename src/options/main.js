import Vue from 'vue';
import App from './App.vue';

Vue.config.productionTip = true;

document.title =
  chrome.i18n.getMessage('settingsPagePrefix') +
  ' – ' +
  chrome.i18n.getMessage('extensionName');

new Vue({
  render: h => h(App)
}).$mount('#app');
