import { dirname } from 'path';
import sass from 'sass';

/** @type {import('esbuild').Plugin} */
const plugin = {
  name: 'esbuild-plugin-sass',
  setup(build) {
    const outputStyle = build.initialOptions.watch ? 'expanded' : 'compressed';

    build.onLoad({ filter: /\.s[a|c]ss$/ }, ({ path }) => {
      const { css, stats } = sass.renderSync({ file: path, outputStyle });

      return {
        loader: 'text',
        contents: css,
        watchFiles: stats.includedFiles,
        watchDirs: stats.includedFiles.map((filePath) => dirname(filePath)),
      };
    });
  },
};

export default plugin;
