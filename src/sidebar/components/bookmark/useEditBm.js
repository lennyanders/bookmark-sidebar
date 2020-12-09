import ModalEditBm from '@components/modal/ModalEditBm.vue';

import { markRaw } from 'vue';
import { mutations } from '@store';

export default (props) => {
  const contextmenu = (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;

    event.preventDefault();
    mutations.showModal(markRaw(ModalEditBm), { bm: props.bm });
  };

  return { contextmenu };
};