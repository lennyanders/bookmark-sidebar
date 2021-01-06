import * as esbuild from 'esbuild';

import {
  emptyDist,
  copyPublicFiles,
  writeManifest,
  buildBackground,
  buildContent,
  buildNewtab,
  inlineContentCss,
} from './shared';

(async () => {
  await emptyDist();

  const esbuildOptions = {
    minify: true,
    define: {
      'process.env.NODE_ENV': JSON.stringify('production'),
    },
  };

  await Promise.all([
    buildBackground(esbuild, esbuildOptions),
    buildContent(esbuild, esbuildOptions).then(inlineContentCss),
    buildNewtab(esbuild, esbuildOptions),
    copyPublicFiles(),
    writeManifest(),
  ]);
})();
