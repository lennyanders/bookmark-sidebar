<template>
  <div>
    <BaseSelect
      v-model="shownBm"
      :options="allFolders"
      text="Choose the folder that you want to display:"
    />

    <BaseCheckbox
      v-model="barLeft"
      text="Should the Sidebar be on the left side?"
    />

    <BaseCheckbox
      v-model="showOptionsOnRightClick"
      text="Open boomark options on right click?"
    />

    <BaseRadio
      v-model="activeTheme"
      :options="themes"
      text="Choose your preferred color theme"
    />

    <BaseInput v-model="barWidth" text="Set width of Sidebar" type="number" />
  </div>
</template>

<script>
  import BaseInput from '../form/BaseInput';
  import BaseSelect from '../form/BaseSelect';
  import BaseCheckbox from '../form/BaseCheckbox';
  import BaseRadio from '../form/BaseRadio';

  import { store, mutations } from '../../store/index';
  import { actions } from '../../api/index';

  export default {
    components: {
      BaseInput,
      BaseSelect,
      BaseCheckbox,
      BaseRadio
    },
    data() {
      return {
        themes: store.themes
      };
    },
    computed: {
      allFolders: () =>
        store.allFolders.map(folder => {
          folder.value = folder.id;
          folder.text = folder.title;
          return folder;
        }),
      shownBm: {
        get: () => store.bm.id,
        set(val) {
          actions.updateRootBm(val);
        }
      },
      barLeft: {
        get: () => store.barLeft,
        set(val) {
          store.barLeft = val;
          actions.saveBarLeft();
        }
      },
      showOptionsOnRightClick: {
        get: () => store.showOptionsOnRightClick,
        set(val) {
          store.showOptionsOnRightClick = val;
          actions.saveShowOptionsOnRightClick(val);
        }
      },
      activeTheme: {
        get: () => store.activeTheme,
        set(val) {
          store.activeTheme = val;
          actions.saveActiveTheme();
        }
      },
      barWidth: {
        get: () => store.barWidth,
        set(val) {
          mutations.setBarWidth(val);
          actions.saveBarWidth();
        }
      }
    }
  };
</script>