/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */

// eslint-disable-next-line import/no-extraneous-dependencies
import webpack4 from 'webpack4';
import { FILENAME_JS_MJS_EXTENSIONS, FILENAME_QUERY_REGEXP } from './constants';
import extractStats from './extractStats';

export interface ChunkModule {
  file: string;
  size: number;
  moduleCount: number;
}

export interface ChunkNamesToModules {
  [assetName: string]: ChunkModule[];
}

const mapChunkNamesWithModules = (
  compilationStats: webpack4.Stats.ToJsonOutput
): ChunkNamesToModules => {
  const mapped = extractStats(compilationStats).reduce((chunkNamesToModules, stats) => {
    const { assets, modules } = stats;
    if (!assets || !assets.length || !modules || !modules.length) {
      return chunkNamesToModules;
    }
    assets
      .filter((asset) =>
        FILENAME_JS_MJS_EXTENSIONS.test(asset.name.replace(FILENAME_QUERY_REGEXP, ''))
      )
      .forEach((asset) => {
        const assetModules = modules
          .filter((module) => module.chunks.some((chunk) => asset.chunks.includes(chunk)))
          .map((module) => {
            const [file, moduleCountText] = module.name.split(' + ');
            const moduleCount = moduleCountText ? parseInt(moduleCountText.split(' ')[0], 10) : 0;
            return {
              file,
              size: module.size,
              moduleCount,
            } as ChunkModule;
          })
          .sort((a, b) => {
            if (a.size > b.size) {
              return -1;
            }
            if (a.size < b.size) {
              return 1;
            }
            if (a.file < b.file) {
              return -1;
            }
            return 1;
          });

        // eslint-disable-next-line no-param-reassign
        chunkNamesToModules[
          `${asset.chunkNames[0]}.${asset.name.endsWith('.mjs') ? 'mjs' : 'js'}`
        ] = assetModules;
      });
    return chunkNamesToModules;
  }, {} as ChunkNamesToModules);

  if (Object.keys(mapped).length) {
    return mapped;
  }

  return null;
};

export default mapChunkNamesWithModules;
