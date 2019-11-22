<template>
  <div>
    <label for="bla">Choose the folder that you want to display:</label>
    <select id="bla" v-model="shownBm">
      <option v-for="{ title, id } of allFolders" :key="id" :value="id">{{
        title
      }}</option>
    </select>

    <br /><label for="">Should the Sidebar be on the left side?</label>
    <input type="checkbox" id="" v-model="barLeft" />

    <label for="">Set width of Sidebar</label>
    <input type="number" v-model="barWidth" name="" id="" />
  </div>
</template>

<script>
  import { store, mutations } from '../../store/index';
  import { actions } from '../../api/index';

  export default {
    computed: {
      allFolders: () => store.allFolders,
      shownBm: {
        get: () => store.bm.id,
        set(val) {
          actions.updateRootBm(val);
        }
      },
      barLeft: {
        get: () => store.barLeft,
        set(val) {
          mutations.setBarLeft(val);
          actions.saveBarLeft();
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

<style lang="scss" scoped>
  input[type='checkbox'] {
    display: block;
    width: 20px;
    height: 20px;
    background-color: #fff;
  }

  select {
    background-color: #333;
  }
</style>