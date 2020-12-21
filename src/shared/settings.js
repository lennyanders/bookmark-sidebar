import { i18n } from '@utils';

export const themes = {
  system: { value: 'system', text: i18n('systemOriented') },
  light: { value: 'light', text: i18n('light') },
  dark: { value: 'dark', text: i18n('dark') },
};

export const defaults = {
  shownBmId: '0',
  barLeft: false,
  barWidth: 320,
  barTheme: themes.system.value,
  editBookmarkOnRightClick: false,
};

export const search = {
  sort: {
    relevance: { value: 'relevance', text: i18n('relevance') },
    alphabetical: { value: 'alphabetical', text: i18n('alphabetical') },
    created: { value: 'created', text: i18n('date') },
  },
  location: {
    everywhere: { value: 'everywhere', text: i18n('everywhere') },
    title: { value: 'title', text: i18n('title') },
    url: { value: 'url', text: i18n('url') },
  },
  filter: {
    none: { value: 'none', text: i18n('none') },
    bookmarks: { value: 'bookmarks', text: i18n('bookmarks') },
    folders: { value: 'folders', text: i18n('folders') },
  },
};
