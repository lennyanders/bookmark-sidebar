import { computed } from 'vue';

import { store } from '../../store/index';

export default () => {
  const editBookmarkOnRightClick = computed(
    () => store.editBookmarkOnRightClick
  );

  return { editBookmarkOnRightClick };
};
