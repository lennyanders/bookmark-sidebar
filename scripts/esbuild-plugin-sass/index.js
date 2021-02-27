import { renderSync } from 'sass';

// typing export default dosn't work =(
/**
 * @type {import('esbuild').Plugin}
 */
const esbuildPluginSass = {
  name: 'esbuild-plugin-sass',
  setup(build) {
    build.onLoad({ filter: /\.s[a|c]ss$/ }, ({ path }) => {
      const { css } = renderSync({ file: path });

      return { loader: 'css', contents: css };
    });
  },
};

export default esbuildPluginSass;
