<template>
  <div id="app">
    hey
  </div>
</template>

<script>
  export default {
    components: {}
  };
</script>

<style lang="scss">
  @font-face {
    font-family: 'Lato';
    font-style: normal;
    font-weight: 400;
    src: local('Lato Regular'), local('Lato-Regular'),
      url('~fonts/lato/lato-v16-latin-regular.woff2') format('woff2'),
      url('~fonts/lato/lato-v16-latin-regular.woff') format('woff');
  }

  body {
    margin: 0;
    padding: 24px 20px 30px 20px;
    background-color: #292a2d;
  }

  #app {
    font-family: 'Lato';
    background-color: red;
  }
</style>