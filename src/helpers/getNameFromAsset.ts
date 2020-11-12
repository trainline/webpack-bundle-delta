/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */
// eslint-disable-next-line import/no-extraneous-dependencies
import webpack from 'webpack';
import { escapeRegExp } from 'lodash';
import { defaultBasePluginConfig } from '../config/PluginConfig';

export const Asset = ({ assets: [{}] } as webpack.Stats.ToJsonOutput).assets[0];

const getNameFromAsset = (
  asset: typeof Asset,
  chunkFilename = defaultBasePluginConfig.chunkFilename,
  withExtension = false
): string => {
  const { name, chunkNames } = asset;
  const nameWithoutQuery = name.split('?')[0];
  const extension = withExtension ? `.${nameWithoutQuery.split('.').pop()}` : '';

  if (chunkNames && chunkNames.length) {
    return `${chunkNames.join('+')}${extension}`;
  }

  const chunkReplacement = escapeRegExp(chunkFilename);
  const chunkTokens = Array.from(chunkReplacement.matchAll(/(\\\[.+?\\\])/g));
  const chunkSearch = chunkTokens.reduce(
    (search, [token]) => search.replace(token, '(.+?)'),
    chunkReplacement
  );
  const nameGroups = new RegExp(`^${chunkSearch}$`).exec(name);

  if (nameGroups) {
    const deterministicName = chunkTokens.reduce((result, [token], index) => {
      if (token.includes('hash')) {
        // eslint-disable-next-line no-param-reassign
        result = result.replace(nameGroups[index + 1], token.replace(/\\+/g, ''));
      }

      return result;
    }, name);

    return !withExtension
      ? deterministicName.substr(0, deterministicName.lastIndexOf('.'))
      : deterministicName;
  }

  return !withExtension ? name.substr(0, name.lastIndexOf('.')) : name;
};

export default getNameFromAsset;
