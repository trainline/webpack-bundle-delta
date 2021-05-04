/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */

import { isEqual } from 'lodash';
import { Restriction } from './config';
import getNameFromAsset from '../../helpers/getNameFromAsset';
import { Asset, NormalizedStats, Module, Stats } from '../../types';

const FILENAME_EXTENSIONS = /\.(js|mjs)$/iu;

export interface RestrictedModule {
  filename: string;
  restriction: Restriction;
  chunkNames: string[];
  issuerPath: string[];
}

const restrict = (
  normalizedStats: NormalizedStats,
  chunkFilename: string,
  restrictions: Restriction[]
): RestrictedModule[] => {
  const restrictedModules = (normalizedStats.stats as Stats[]).reduce((result, stats) => {
    const module = (stats.modules as Module[])
      .map(({ name, chunks, issuerPath }) => {
        const restriction = restrictions.find(({ search }) => new RegExp(search).test(name));
        if (restriction) {
          const usageAssets = (stats.assets as Asset[])
            ?.filter(
              ({ name: assetName, chunks: assetChunks }) =>
                FILENAME_EXTENSIONS.test(assetName) &&
                assetChunks.some((assetChunk) => chunks.includes(assetChunk))
            )
            .map((asset) => getNameFromAsset(asset, chunkFilename, true));

          return {
            filename: name,
            restriction,
            chunkNames: usageAssets,
            // davidhouweling: for some reason I couldn't cast it to "Module['issuerPath']"
            // so casting to unknown first, then just trick TS for individual cast
            issuerPath: (issuerPath as unknown[])?.map((ip: Module['issuerPath'][0]) => ip.name),
          } as RestrictedModule;
        }
        return null;
      })
      .filter((m) => !!m);
    return result.concat(module);
  }, [] as RestrictedModule[]);

  const uniqueRestrictedModules = restrictedModules.reduce((result, restrictedModule) => {
    const existingIndex = result.findIndex(
      ({ filename, restriction }) =>
        restrictedModule.filename === filename && isEqual(restriction, restrictedModule.restriction)
    );
    if (existingIndex >= 0) {
      // eslint-disable-next-line no-param-reassign
      result[existingIndex].chunkNames = Array.from(
        new Set([...result[existingIndex].chunkNames, ...restrictedModule.chunkNames])
      );
    } else {
      result.push(restrictedModule);
    }

    return result;
  }, [] as RestrictedModule[]);

  return uniqueRestrictedModules.sort((a, b) => {
    const responseTypeOrder = {
      error: 1,
      warn: 2,
      info: 3,
    };
    const aResponseType = a.restriction.responseType;
    const bResponseType = b.restriction.responseType;
    if (responseTypeOrder[aResponseType] < responseTypeOrder[bResponseType]) {
      return -1;
    }
    if (responseTypeOrder[aResponseType] > responseTypeOrder[bResponseType]) {
      return 1;
    }
    if (a.filename < b.filename) {
      return -1;
    }
    if (a.filename > b.filename) {
      return 1;
    }
    return 0;
  });
};

export default restrict;
