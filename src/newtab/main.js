import { onMessage } from '@chrome/runtime';
import { getMessage } from '@chrome/i18n';
import { dictionaryKeys } from '@dictionary';

document.title = getMessage(dictionaryKeys.newTab);

if (process.env.NODE_ENV === 'development') {
  onMessage(({ command }) => command === 'reload-tab' && location.reload());
}
