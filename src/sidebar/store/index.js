import { reactive, computed } from 'vue';
import { fuzzy } from 'fast-fuzzy';
import { useClampedRef } from '@use';
import { flattenBms } from '@shared/utils';

export const store = reactive({
  barWidth: useClampedRef(280, window.innerWidth),
  url: location.href,
  searchQuery: '',
  searchFocused: false,
  isSearching: computed(() => !!store.searchQuery.trim()),
  searchSortOrder: 'relevance',
  searchLocation: 'everywhere',
  searchFilter: 'none',
  flattenedBms: computed(() => flattenBms(store.bm.children)),
  filteredBms: computed(() => {
    const searchQuery = store.searchQuery.trim();
    if (!searchQuery) return store.bm;

    const children = store.flattenedBms
      .filter((bm) => {
        if (store.searchFilter === 'bookmarks' && !bm.url) return;
        if (store.searchFilter === 'folders' && bm.url) return;

        let titleScore, urlScore;

        if (store.searchLocation !== 'url') titleScore = fuzzy(searchQuery, bm.title);
        if (store.searchLocation === 'title') return titleScore >= 0.8 && (bm.score = titleScore);

        if (store.searchLocation !== 'title') urlScore = bm.url ? fuzzy(searchQuery, bm.url) : 0;
        if (store.searchLocation === 'url') return urlScore >= 0.8 && (bm.score = urlScore);

        const score = Math.max(titleScore, urlScore);
        return score >= 0.8 && (bm.score = score);
      })
      .sort((a, b) =>
        ({
          alphabetical: () => {
            const bTitle = b.title.toUpperCase();
            const aTitle = a.title.toUpperCase();
            return bTitle > aTitle ? -1 : bTitle < aTitle ? 1 : 0;
          },
          created: () => b.dateAdded - a.dateAdded,
          relevance: () => b.score - a.score,
        }[store.searchSortOrder]()),
      );

    return { ...store.bm, children };
  }),
});

export const mutations = {
  stopSearching() {
    store.searchQuery = '';
    store.searchFocused = false;
  },
};
