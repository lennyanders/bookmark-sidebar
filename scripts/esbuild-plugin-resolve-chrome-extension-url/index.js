/** @type {import('esbuild').Plugin} */
const plugin = {
  name: 'esbuild-plugin-resolve-chrome-extension-url',
  setup(build) {
    build.onResolve({ filter: /^chrome-extension:\/\/__MSG_@@extension_id__\// }, ({ path }) => ({
      path,
      external: true,
    }));
  },
};

export default plugin;
