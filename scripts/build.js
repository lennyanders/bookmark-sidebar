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
    minify: true,
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
