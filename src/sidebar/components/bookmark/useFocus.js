import { ref, watchEffect, watch } from 'vue';

import { store } from '@store';

export default (props, childrenVisible) => {
  const focusableBmPart = ref(null);

  watchEffect(() => {
    if (props.bm.id === store.activeBm) focusableBmPart.value?.focus();
  });

  if (childrenVisible) {
    watch(childrenVisible, (newVal, oldVal) => {
      if (oldVal && !newVal) store.activeBm = props.bm.id;
    });
  }

  const setActiveBm = () => {
    store.activeBm = props.bm.id;
  };

  return { focusableBmPart, setActiveBm };
};
