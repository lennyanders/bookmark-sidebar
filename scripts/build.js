import * as esbuild from 'esbuild';

import {
  deleteDist,
  copyPublicFiles,
  writeManifest,
  buildBackground,
  buildContent,
  buildNewtab,
  afterBuildContent,
} from './shared';

await deleteDist();

await Promise.all([
  buildBackground(esbuild, {
    define: {
      'process.env.NODE_ENV': JSON.stringify('production'),
    },
  }),
  (async () => {
    await buildContent(esbuild, {
      define: {
        'process.env.NODE_ENV': JSON.stringify('production'),
      },
    });
    await afterBuildContent();
  })(),
  buildNewtab(esbuild, {
    define: {
      'process.env.NODE_ENV': JSON.stringify('production'),
    },
  }),
  copyPublicFiles(),
  writeManifest(),
]);
