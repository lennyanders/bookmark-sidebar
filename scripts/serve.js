import watch from 'node-watch';

import {
  emptyDist,
  copyPublicFiles,
  writeManifest,
  buildBackground,
  buildContent,
  buildNewtab,
} from './shared';

(async () => {
  await emptyDist();

  /** @type {import('esbuild').BuildOptions} */
  const esbuildOptions = {
    sourcemap: 'inline',
    watch: true,
    define: {
      'process.env.NODE_ENV': JSON.stringify('development'),
    },
  };

  await Promise.all([
    buildBackground(esbuildOptions),
    buildContent(esbuildOptions),
    buildNewtab(esbuildOptions),
    copyPublicFiles(),
    writeManifest(),
  ]);

  watch('public', { recursive: true }, copyPublicFiles);
  watch('src/manifest.json', writeManifest);
})();
