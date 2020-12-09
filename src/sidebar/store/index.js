import { reactive, computed } from 'vue';
import { fuzzy } from 'fast-fuzzy';
import { useClampedRef } from '../use';

export const store = reactive({
  barLeft: false,
  barWidth: useClampedRef(300, 280, window.innerWidth),
  themes: [
    {
      value: 'system',
      text: 'System Oriented',
    },
    {
      value: 'light',
      text: 'light',
    },
    {
      value: 'dark',
      text: 'dark',
    },
  ],
  activeTheme: 'system',
  editBookmarkOnRightClick: false,

  url: location.href,

  searchQuery: '',
  searchFocused: false,

  bm: {},
  allFolders: [],
  activeBm: '0',

  modalPrevFocus: null,
  modalVisible: false,
  modalComponent: null,
  modalComponentProps: null,

  isSearching: computed(() => !!store.searchQuery.trim()),
  flattenedBms: computed(() => {
    let children = [];
    JSON.stringify(store.bm.children, (_, nested) => {
      if (nested?.title) children.push(nested);
      return nested;
    });
    return children;
  }),
  filteredBms: computed(() => {
    let searchQuery = store.searchQuery.trim();
    if (!searchQuery) return store.bm;

    const filters = ['-t', '-u', '-b', '-f'].filter((filter) => {
      if (searchQuery.startsWith(`${filter} `)) {
        searchQuery = searchQuery.slice(3);
        return true;
      } else if (searchQuery.includes(` ${filter} `)) {
        searchQuery = searchQuery.replace(new RegExp(` ${filter} `, 'g'), ' ');
        return true;
      } else if (searchQuery.endsWith(` ${filter}`)) {
        searchQuery = searchQuery.slice(0, -3);
        return true;
      }
    });

    const res = store.flattenedBms
      .filter((bm) => {
        const onlyFolder = !filters.includes('-b') && filters.includes('-f');
        const onlyBookmark = !filters.includes('-f') && filters.includes('-b');
        if ((onlyBookmark && !bm.url) || (onlyFolder && bm.url)) return;

        const filterTitle = !filters.includes('-u') || filters.includes('-t');
        let titleScore;
        if (filterTitle) {
          titleScore = fuzzy(searchQuery, bm.title);
          if (!filters.includes('-u') && filters.includes('-t')) {
            return titleScore >= 0.8 && (bm.score = titleScore);
          }
        }

        const urlScore = bm.url ? fuzzy(searchQuery, bm.url) : 0;
        if (!filterTitle) return urlScore >= 0.8 && (bm.score = urlScore);

        const score = Math.max(titleScore, urlScore);
        return score >= 0.8 && (bm.score = score);
      })
      .sort((a, b) => b.score - a.score);

    return { ...store.bm, children: res };
  }),
});

export const mutations = {
  stopSearching() {
    store.searchQuery = '';
    store.searchFocused = false;
  },
  showModal(component, componentProps) {
    store.modalPrevFocus =
      document.activeElement
        ?.closest('.bookmark')
        ?.querySelector('.bookmark__link') || document.activeElement;

    store.modalVisible = true;
    store.modalComponent = component;
    store.modalComponentProps = componentProps;
  },
  hideModal() {
    store.modalVisible = false;
    store.modalComponent = null;
    store.modalComponentProps = null;

    store.modalPrevFocus?.focus();
  },
};
