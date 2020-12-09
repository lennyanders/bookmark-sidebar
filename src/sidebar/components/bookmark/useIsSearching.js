import { computed } from 'vue';

import { store } from '@store';

export default () => {
  const isSearching = computed(() => store.isSearching);

  return { isSearching };
};
