import { copyFile, readdir, mkdir } from 'fs/promises';
import { resolve } from 'path';
import * as esbuild from 'esbuild';

export const copyDir = async (entry, target) => {
  const dir = await readdir(entry, { withFileTypes: true });
  await Promise.all(
    dir.map(async (dirent) => {
      if (dirent.isDirectory()) {
        await copyDir(
          resolve(entry, dirent.name),
          resolve(target, dirent.name),
        );
      } else {
        await mkdir(target, { recursive: true });
        await copyFile(
          resolve(entry, dirent.name),
          resolve(target, dirent.name),
        );
      }
    }),
  );
};

const deepAssign = (obj1, obj2) => {
  if (!obj1) return {};
  if (!obj2) return obj1;

  for (const key in obj2) {
    if (Object.prototype.toString.call(obj2[key]) === '[object Object]') {
      obj1[key] = deepAssign(obj1[key] || {}, obj2[key]);
    } else {
      obj1[key] = obj2[key];
    }
  }
  return obj1;
};

/**
 * @callback Builder
 * @param {esbuild|esbuild.Service} esbuildOrEsbuildService
 * @param {esbuild.BuildOptions} options
 * @returns {Promise<esbuild.BuildResult>}
 */

/**
 * @param {esbuild.BuildOptions} defaultOptions
 * @returns {Builder}
 */
export const createBuilder = (defaultOptions) => (
  esbuildOrEsbuildService,
  options,
) => esbuildOrEsbuildService.build(deepAssign(defaultOptions, options));
