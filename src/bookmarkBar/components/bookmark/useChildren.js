import { watch, watchEffect, ref } from 'vue';

export default (props) => {
  const childrenVisible = ref(false);

  const hideChildren = (e) => {
    if (!childrenVisible.value) return;
    e.stopPropagation();
    childrenVisible.value = false;
  };

  watchEffect(() => {
    props.bm.childrenVisible = childrenVisible.value;
  });

  watch(
    () => props.bm.children.length,
    (newVal, oldVal) => {
      if (document.hasFocus() && newVal > oldVal) {
        childrenVisible.value = true;
      }
    },
  );

  return { childrenVisible, hideChildren };
};
