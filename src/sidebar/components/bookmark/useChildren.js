import { watch, ref } from 'vue';

export default (childrenLength) => {
  const childrenVisible = ref(false);

  const hideChildren = (event) => {
    if (!childrenVisible.value) return;

    event.stopPropagation();
    childrenVisible.value = false;
  };

  // open folder when bookmark gets added in focused window
  watch(childrenLength, (newVal, oldVal) => {
    if (document.hasFocus() && newVal > oldVal) childrenVisible.value = true;
  });

  return { childrenVisible, hideChildren };
};
