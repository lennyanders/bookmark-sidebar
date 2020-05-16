import { markRaw } from 'vue';

import ModalEditBm from '../modal/ModalEditBm';

import { mutations } from '../../store/index';

export default props => {
  const contextmenu = e => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;

    e.preventDefault();
    mutations.showModal(markRaw(ModalEditBm), { bm: props.bm });
  };

  return { contextmenu };
};
