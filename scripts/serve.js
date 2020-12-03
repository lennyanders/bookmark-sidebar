import { startService } from 'esbuild';
import watch from 'node-watch';

import {
  deleteDist,
  copyPublicFiles,
  writeManifest,
  buildBackground,
  buildContent,
  buildNewtab,
  afterBuildContent,
} from './shared';

const [service] = await Promise.all([startService(), deleteDist()]);

const [
  { rebuild: rebuildBackground },
  rebuildContent,
  { rebuild: rebuildNewtab },
] = await Promise.all([
  buildBackground(service, {
    sourcemap: 'inline',
    incremental: true,
    define: {
      'process.env.NODE_ENV': JSON.stringify('development'),
    },
  }),
  (async () => {
    const { rebuild } = await buildContent(service, {
      sourcemap: 'inline',
      incremental: true,
      define: {
        'process.env.NODE_ENV': JSON.stringify('development'),
      },
    });
    await afterBuildContent();

    return async () => {
      await rebuild();
      await afterBuildContent();
    };
  })(),
  buildNewtab(service, {
    sourcemap: 'inline',
    incremental: true,
    define: {
      'process.env.NODE_ENV': JSON.stringify('development'),
    },
  }),
  copyPublicFiles(),
  writeManifest(),
]);

await Promise.all([
  watch('src/background', { recursive: true }, rebuildBackground),
  watch(
    ['src/content', 'src/bookmark-bar'],
    { recursive: true },
    rebuildContent,
  ),
  watch(['src/newtab', 'src/bookmark-bar'], { recursive: true }, rebuildNewtab),
  watch('public', { recursive: true }, copyPublicFiles),
  watch('src/manifest.json', writeManifest),
]);
