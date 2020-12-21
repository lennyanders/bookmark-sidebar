import { reactive, computed } from 'vue';
import { fuzzy } from 'fast-fuzzy';
import { useClampedRef } from '@use';
import { flattenBms } from '@shared/utils';
import { search } from '@shared/settings';

export const store = reactive({
  barWidth: useClampedRef(280, window.innerWidth),
  url: location.href,
  searchQuery: '',
  searchFocused: false,
  isSearching: computed(() => !!store.searchQuery.trim()),
  searchSortOrder: search.sort.relevance.value,
  searchLocation: search.location.everywhere.value,
  searchFilter: search.filter.none.value,
  flattenedBms: computed(() => flattenBms(store.bm.children)),
  filteredBms: computed(() => {
    const searchQuery = store.searchQuery.trim();
    if (!searchQuery) return store.bm;

    const children = store.flattenedBms
      .filter((bm) => {
        if (store.searchFilter === search.filter.bookmarks.value && !bm.url) return;
        if (store.searchFilter === search.filter.folders.value && bm.url) return;

        let titleScore, urlScore;

        if (store.searchLocation !== search.location.url.value) {
          titleScore = fuzzy(searchQuery, bm.title);
        }
        if (store.searchLocation === search.location.title.value) {
          return titleScore >= 0.8 && (bm.score = titleScore);
        }

        if (store.searchLocation !== search.location.title.value) {
          urlScore = bm.url ? fuzzy(searchQuery, bm.url) : 0;
        }
        if (store.searchLocation === search.location.url.value) {
          return urlScore >= 0.8 && (bm.score = urlScore);
        }

        const score = Math.max(titleScore, urlScore);
        return score >= 0.8 && (bm.score = score);
      })
      .sort((a, b) =>
        ({
          [search.sort.relevance.value]: () => b.score - a.score,
          [search.sort.alphabetical.value]: () => {
            const bTitle = b.title.toUpperCase();
            const aTitle = a.title.toUpperCase();
            return bTitle > aTitle ? -1 : bTitle < aTitle ? 1 : 0;
          },
          [search.sort.created.value]: () => b.dateAdded - a.dateAdded,
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
