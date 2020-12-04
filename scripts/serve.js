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

const esbuildOptions = {
  sourcemap: 'inline',
  incremental: true,
  define: {
    'process.env.NODE_ENV': JSON.stringify('development'),
  },
};

const [
  { rebuild: rebuildBackground },
  rebuildContent,
  { rebuild: rebuildNewtab },
] = await Promise.all([
  buildBackground(service, esbuildOptions),
  (async () => {
    const { rebuild } = await buildContent(service, esbuildOptions);
    await afterBuildContent();

    return async () => {
      await rebuild();
      await afterBuildContent();
    };
  })(),
  buildNewtab(service, esbuildOptions),
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
