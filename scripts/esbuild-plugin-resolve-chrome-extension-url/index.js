import * as esbuild from 'esbuild';

// typing export default dosn't work =(
/**
 * @return {esbuild.Plugin}
 */
const esbuildPluginResolveChromeExtensionUrl = {
  name: 'esbuild-plugin-resolve-chrome-extension-url',
  setup(build) {
    build.onResolve({ filter: /^chrome-extension:\/\/__MSG_@@extension_id__\// }, ({ path }) => ({
      path,
      external: true,
    }));
  },
};

export default esbuildPluginResolveChromeExtensionUrl;
