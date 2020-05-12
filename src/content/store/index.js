import { reactive, computed } from 'vue';
import { fuzzy } from 'fast-fuzzy';

export const store = reactive({
  barLeft: false,
  barWidth: 320,
  themes: [
    {
      value: 'system',
      text: 'System Oriented'
    },
    {
      value: 'light',
      text: 'light'
    },
    {
      value: 'dark',
      text: 'dark'
    }
  ],
  activeTheme: 'system',
  showOptionsOnRightClick: false,

  url: location.href,

  searchQuery: '',
  searchFocused: false,
  filters: ['-t', '-u', '-b', '-f'],

  bm: {},
  allFolders: [],
  activeBm: '0',

  modalPrevFocus: null,
  modalVisible: false,
  modalType: '',
  modalBm: {},

  dragY: null,
  dragEl: null,
  newBmParentId: null,
  isSearching: computed(() => !!store.searchQuery),
  flattenedBms: computed(() => {
    let children = [];
    JSON.stringify(store.bm.children, (_, nested) => {
      if (nested && nested.title) children.push(nested);
      return nested;
    });
    return children;
  }),
  filteredBms: computed(() => {
    let searchQuery = store.searchQuery;
    if (!searchQuery) return store.bm;

    const activeFilters = store.filters.filter(filter => {
      if (
        searchQuery.indexOf(`${filter} `) === 0 ||
        searchQuery.includes(` ${filter} `) ||
        searchQuery.indexOf(` ${filter}`) ===
          searchQuery.length - filter.length - 1
      ) {
        searchQuery = searchQuery.replace(new RegExp(filter, 'gi'), '');
        return true;
      }
    });
    console.log(activeFilters);

    const res = store.flattenedBms
      .reduce((bms, bm) => {
        const titleScore = fuzzy(searchQuery, bm.title),
          urlScore = bm.url ? fuzzy(searchQuery, bm.url) : 0,
          score = Math.max(titleScore, urlScore);

        if (score < 0.8) return bms;
        bm.score = score;

        if (!activeFilters.includes('-u') && activeFilters.includes('-t')) {
          if (titleScore < 0.8) return bms;
          bm.score = titleScore;
        }
        if (!activeFilters.includes('-t') && activeFilters.includes('-u')) {
          if (urlScore < 0.8) return bms;
          bm.score = urlScore;
        }
        if (!activeFilters.includes('-f') && activeFilters.includes('-b')) {
          if (!bm.url) return bms;
        }
        if (!activeFilters.includes('-b') && activeFilters.includes('-f')) {
          if (bm.url) return bms;
        }
        return [...bms, bm];
      }, [])
      .sort((a, b) => {
        // sort by best match
        return b.score - a.score;
      });

    return { ...store.bm, children: res };
  })
});

export let mutations = {
  stopSearching() {
    store.searchQuery = '';
    store.searchFocused = false;
  },
  setBarWidth(width) {
    if (width < 280 || width > window.screen.width / 2) return;
    store.barWidth = width;
  },

  showModal(type, bm) {
    store.modalPrevFocus =
      document.activeElement
        ?.closest('.bookmark')
        ?.querySelector('.bookmark__link') || document.activeElement;

    store.modalVisible = true;
    store.modalType = type;
    if (bm) store.modalBm = bm;
  },
  hideModal() {
    store.modalVisible = false;
    store.modalPrevFocus?.focus();
  }
};
