import {
  emptyDist,
  copyPublicFiles,
  writeManifest,
  buildBackground,
  buildContent,
  buildNewtab,
} from './shared.js';

(async () => {
  await emptyDist();

  /** @type {import('esbuild').BuildOptions} */
  const esbuildOptions = {
    // minify: true,
    minifyWhitespace: true,
    // minifyIdentifiers: true, // does not work with webextension-polyfill-ts version 0.25.0
    minifySyntax: true,
    define: {
      'process.env.NODE_ENV': JSON.stringify('production'),
    },
  };

  await Promise.all([
    buildBackground(esbuildOptions),
    buildContent(esbuildOptions),
    buildNewtab(esbuildOptions),
    copyPublicFiles(),
    writeManifest(),
  ]);
})();
