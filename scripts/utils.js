import { copyFile, readdir, mkdir } from 'fs/promises';
import { resolve } from 'path';
import { build } from 'esbuild';

/**
 * @param {string} entry
 * @param {string} target
 */
export const copyDir = async (entry, target) => {
  const dir = await readdir(entry, { withFileTypes: true });
  await Promise.all(
    dir.map(async (dirent) => {
      if (dirent.isDirectory()) {
        await copyDir(resolve(entry, dirent.name), resolve(target, dirent.name));
      } else {
        await mkdir(target, { recursive: true });
        await copyFile(resolve(entry, dirent.name), resolve(target, dirent.name));
      }
    }),
  );
};

/**
 * @param  {objects[]} objects
 * @returns {object}
 */
const deepAssign = (...objects) => {
  const returnObject = {};
  for (const object of objects) {
    for (const key in object) {
      if (Object.prototype.toString.call(object[key]) === '[object Object]') {
        returnObject[key] = deepAssign(returnObject[key] || {}, object[key]);
      } else {
        returnObject[key] = object[key];
      }
    }
  }
  return returnObject;
};

/**
 * @callback Builder
 * @param {import('esbuild').BuildOptions} options
 * @returns {Promise<import('esbuild').BuildResult>}
 */

/**
 * @param {import('esbuild').BuildOptions} defaultOptions
 * @returns {Builder}
 */
export const createBuilder = (defaultOptions) => (options) => {
  return build(deepAssign(defaultOptions, options));
};
