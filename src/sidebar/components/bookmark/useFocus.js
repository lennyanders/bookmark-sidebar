import { ref, watchEffect, watch } from 'vue';

import { store } from '@store';

export default (bmId, childrenVisible) => {
  const focusableBmPart = ref(null);

  watchEffect(() => {
    if (bmId.value === store.activeBm) focusableBmPart.value?.focus();
  });

  const setActiveBm = () => (store.activeBm = bmId.value);

  // mark current bm as active when folder gets closed
  if (childrenVisible) {
    watch(childrenVisible, (newVal, oldVal) => {
      if (oldVal && !newVal) setActiveBm();
    });
  }

  return { focusableBmPart, setActiveBm };
};
