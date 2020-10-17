<template>
  <TheBookmarkBar />
  <TheFullScreenFileDrop />
</template>

<script>
  import TheFullScreenFileDrop from './components/TheFullScreenFileDrop';
  import TheBookmarkBar from '../bookmarkBar/App';

  export default {
    components: {
      TheFullScreenFileDrop,
      TheBookmarkBar,
    },
  };
</script>
