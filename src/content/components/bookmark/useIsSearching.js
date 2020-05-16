import { computed } from 'vue';

import { store } from '../../store/index';

export default () => {
  const isSearching = computed(() => store.isSearching);

  return { isSearching };
};
