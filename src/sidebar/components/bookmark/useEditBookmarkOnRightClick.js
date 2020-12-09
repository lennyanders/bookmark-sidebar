import { computed } from 'vue';

import { store } from '@store';

export default () => {
  const editBookmarkOnRightClick = computed(
    () => store.editBookmarkOnRightClick,
  );

  return { editBookmarkOnRightClick };
};
