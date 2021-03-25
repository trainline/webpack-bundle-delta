/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */

import {
  FILENAME_JS_MJS_CSS_EXTENSIONS,
  FILENAME_QUERY_REGEXP,
  SupportedExtensions,
} from './constants';
import getNameFromAsset from './getNameFromAsset';
import { Asset, Asset4, Asset5, NormalizedStats, Stats } from '../types';

export interface ChunkNamesExtensionsToSize {
  [chunkName: string]: {
    [extension in SupportedExtensions]: {
      size: number;
      gzSize?: number;
      brSize?: number;
    };
  };
}

const mapChunkNamesExtensionsToSize = (
  normalizedStats: NormalizedStats,
  chunkFilename: string
): ChunkNamesExtensionsToSize => {
  return (normalizedStats.stats as Stats[]).reduce((chunkNamesExtensionsToSize, stats) => {
    const { assets } = stats;
    (assets as Asset[])
      .filter((asset) =>
        FILENAME_JS_MJS_CSS_EXTENSIONS.test(asset.name.replace(FILENAME_QUERY_REGEXP, ''))
      )
      .forEach((asset) => {
        const { name, size } = asset;
        const nameWithoutQuery = name.split('?')[0];
        const extension = nameWithoutQuery.split('.').pop();
        const customName = getNameFromAsset(asset, chunkFilename, false);
        // these are only generated when the ratio is high enough
        let gzAsset: Asset;
        let brAsset: Asset;
        if (normalizedStats.majorVersion === 4) {
          const assets4 = assets as Asset4[];
          gzAsset = assets4.find((a) => a.name.startsWith(`${nameWithoutQuery}.gz`));
          brAsset = assets4.find((a) => a.name.startsWith(`${nameWithoutQuery}.br`));
        } else {
          const asset5 = asset as Asset5;
          gzAsset = Array.isArray(asset5.related)
            ? asset5.related.find((relatedAsset) => relatedAsset.type === 'gzipped')
            : null;
          brAsset = Array.isArray(asset5.related)
            ? asset5.related.find((relatedAsset) => relatedAsset.type === 'brotliCompressed')
            : null;
        }

        // eslint-disable-next-line no-param-reassign
        chunkNamesExtensionsToSize[customName] = {
          ...chunkNamesExtensionsToSize[customName],
          [extension]: {
            size,
            gzSize: gzAsset ? gzAsset.size : null,
            brSize: brAsset ? brAsset.size : null,
          },
        };
      });
    return chunkNamesExtensionsToSize;
  }, {} as ChunkNamesExtensionsToSize);
};

export default mapChunkNamesExtensionsToSize;
