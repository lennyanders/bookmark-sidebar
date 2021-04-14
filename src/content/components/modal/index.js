import { enableSettings } from './settings';
import { enableAddBookmark } from './addBookmark';
import { enableEditBookmark } from './editBookmark';

export const enableModal = () => {
  enableSettings();
  enableAddBookmark();
  enableEditBookmark();
};
