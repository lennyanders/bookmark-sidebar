import { normalize } from 'path';
import { startService } from 'esbuild';
import watch from 'node-watch';

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
  const [service] = await Promise.all([startService(), emptyDist()]);

  /** @type {import('esbuild').BuildOptions} */
  const esbuildOptions = {
    sourcemap: 'inline',
    incremental: true,
    watch: true,
    define: {
      'process.env.NODE_ENV': JSON.stringify('development'),
    },
  };

  watch('dist', (event, name) => {
    if (event === 'update' && name === normalize('dist/content.css')) {
      inlineContentCss();
    }
  });

  await Promise.all([
    buildBackground(service, esbuildOptions),
    buildContent(service, esbuildOptions),
    buildNewtab(service, esbuildOptions),
    copyPublicFiles(),
    writeManifest(),
  ]);

  watch('public', { recursive: true }, copyPublicFiles);
  watch('src/manifest.json', writeManifest);
})();
