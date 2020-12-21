import { i18n } from '@utils';

export const defaults = {
  shownBmId: '0',
  barLeft: false,
  barWidth: 320,
  barTheme: 'system',
  editBookmarkOnRightClick: false,
};

export const themes = [
  { value: 'system', text: i18n('systemOriented') },
  { value: 'light', text: i18n('light') },
  { value: 'dark', text: i18n('dark') },
];

export const search = {
  sort: [
    { value: 'relevance', text: i18n('relevance') },
    { value: 'alphabetical', text: i18n('alphabetical') },
    { value: 'created', text: i18n('date') },
  ],
  location: [
    { value: 'everywhere', text: i18n('everywhere') },
    { value: 'title', text: i18n('title') },
    { value: 'url', text: i18n('url') },
  ],
  filter: [
    { value: 'none', text: i18n('none') },
    { value: 'bookmarks', text: i18n('bookmarks') },
    { value: 'folders', text: i18n('folders') },
  ],
};
