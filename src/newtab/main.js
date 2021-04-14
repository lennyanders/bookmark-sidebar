import { onMessage } from '@chrome/runtime';
import { getMessage } from '@chrome/i18n';

document.title = getMessage('newTab');

if (process.env.NODE_ENV === 'development') {
  onMessage(({ command }) => command === 'reload-tab' && location.reload());
}
