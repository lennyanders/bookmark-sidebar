import Vue from 'vue';
import { fuzzy } from 'fast-fuzzy';

export const store = new Vue({
  data() {
    return {
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

      modalVisible: false,
      modalType: '',
      modalBm: {},

      dragY: null,
      dragEl: null,
      newBmParentId: null
    };
  },
  computed: {
    isSearching() {
      return !!this.searchQuery;
    },
    flattenedBms() {
      let children = [];
      JSON.stringify(this.bm.children, (_, nested) => {
        if (nested && nested.title) children.push(nested);
        return nested;
      });
      return children;
    },
    filteredBms() {
      let searchQuery = this.searchQuery;
      if (!searchQuery) return this.bm;

      const activeFilters = this.filters.filter(filter => {
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

      const res = this.flattenedBms
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

      return { ...this.bm, children: res };
    }
  },
  methods: {
    stopSearching() {
      this.searchQuery = '';
      this.searchFocused = false;
    },
    setBarWidth(width) {
      if (width < 280 || width > window.screen.width / 2) return;
      this.barWidth = width;
    },

    walkActiveBmBy(delta) {
      this.activeBm = findBm(this.activeBm, delta)?.id;
    },

    showModal(type, bm) {
      this.modalVisible = true;
      this.modalType = type;
      if (bm) this.modalBm = bm;
    },
    hideModal() {
      this.modalVisible = false;
    }
  }
});

export let mutations = {};
for (const method in store.$options.methods) {
  mutations[method] = store.$options.methods[method].bind(store);
}

const findBm = (
  id,
  delta = 0,
  includeChildren = true,
  bms = store.filteredBms.children
) => {
  for (let i = 0; i < bms.length; i++) {
    if (bms[i].id === id) {
      if (delta > 0) {
        // select first children when children are open
        if (
          includeChildren &&
          bms[i].childrenVisible &&
          bms[i].children.length
        ) {
          return bms[i].children[0];
        }
        const res = bms[i + delta];
        if (res) return res;

        const res2 = findBm(bms[i].parentId, 1, false);
        if (res2) return res2;
      }

      if (delta < 0) {
        const res = bms[i + delta];
        if (res) return res;

        const res2 = findBm(bms[i].parentId, 0);
        if (res2) return res2;
      }

      return bms[i];
    }
    if (bms[i].children) {
      const res = findBm(id, delta, includeChildren, bms[i].children);
      if (res) return res;
    }
  }
};
