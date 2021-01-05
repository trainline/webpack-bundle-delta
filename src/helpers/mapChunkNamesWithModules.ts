/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */

import { FILENAME_JS_MJS_EXTENSIONS, FILENAME_QUERY_REGEXP, Stats4 } from './constants';
import extractStats, { ExtractedStats4 } from './extractStats';

export interface ChunkModule {
  file: string;
  size: number;
  moduleCount: number;
}

export interface ChunkNamesToModules {
  [assetName: string]: ChunkModule[];
}

const mapChunkNamesWithModules = (compilationStats: Stats4): ChunkNamesToModules => {
  const mapped = (extractStats(compilationStats) as ExtractedStats4).stats.reduce(
    (chunkNamesToModules, stats) => {
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
    },
    {} as ChunkNamesToModules
  );

  if (Object.keys(mapped).length) {
    return mapped;
  }

  return null;
};

export default mapChunkNamesWithModules;
