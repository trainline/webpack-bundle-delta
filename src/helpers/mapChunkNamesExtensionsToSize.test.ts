/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */
import webpack4 from 'webpack4';
import { defaultBasePluginConfig } from '../config/PluginConfig';

import mapChunkNamesExtensionsToSize from './mapChunkNamesExtensionsToSize';

describe('mapChunkNamesExtensionsToSize', () => {
  it('maps js/css/mjs (but not the .map files)', () => {
    const stats: webpack4.Stats.ToJsonOutput = {
      _showErrors: false,
      _showWarnings: false,
      errors: [],
      warnings: [],
      assets: [
        {
          name: 'sgpTrainTimesPage-784f294928e1a77ed6c4.js',
          size: 653190,
          chunks: [61],
          chunkNames: ['sgpTrainTimesPage'],
          emitted: true,
        },
        {
          name: 'sgpTrainTimesPage-784f294928e1a77ed6c4.js.br',
          size: 134674,
          chunks: [],
          chunkNames: [],
          emitted: true,
        },
        {
          name: 'sgpTrainTimesPage-784f294928e1a77ed6c4.js.gz',
          size: 174867,
          chunks: [],
          chunkNames: [],
          emitted: true,
        },
        {
          name: 'sgpTrainTimesPage-784f294928e1a77ed6c4.js.map',
          size: 1994525,
          chunks: [61],
          chunkNames: ['sgpTrainTimesPage'],
          emitted: true,
        },
        {
          name: 'sgpTrainTimesPage.f8f2d0c60ba75f897b63.css',
          size: 296997,
          chunks: [61],
          chunkNames: ['sgpTrainTimesPage'],
          emitted: true,
        },
        {
          name: 'sgpTrainTimesPage.f8f2d0c60ba75f897b63.css.br',
          size: 37028,
          chunks: [],
          chunkNames: [],
          emitted: true,
        },
        {
          name: 'sgpTrainTimesPage.f8f2d0c60ba75f897b63.css.gz',
          size: 45562,
          chunks: [],
          chunkNames: [],
          emitted: true,
        },
        {
          name: 'sgpTrainTimesPage.f8f2d0c60ba75f897b63.css.map',
          size: 354867,
          chunks: [61],
          chunkNames: ['sgpTrainTimesPage'],
          emitted: true,
        },
      ],
    };

    expect(mapChunkNamesExtensionsToSize(stats, defaultBasePluginConfig.chunkFilename)).toEqual({
      sgpTrainTimesPage: {
        css: {
          brSize: 37028,
          gzSize: 45562,
          size: 296997,
        },
        js: {
          brSize: 134674,
          gzSize: 174867,
          size: 653190,
        },
      },
    });
  });

  it('returns null when brolti is not defined', () => {
    const stats: webpack4.Stats.ToJsonOutput = {
      _showErrors: false,
      _showWarnings: false,
      errors: [],
      warnings: [],
      assets: [
        {
          name: 'sgpTrainTimesPage-784f294928e1a77ed6c4.js',
          size: 653190,
          chunks: [61],
          chunkNames: ['sgpTrainTimesPage'],
          emitted: true,
        },
      ],
    };

    expect(
      mapChunkNamesExtensionsToSize(stats, defaultBasePluginConfig.chunkFilename).sgpTrainTimesPage
        .js
    ).toHaveProperty('brSize', null);
  });

  it('returns null when gzip is not defined', () => {
    const stats: webpack4.Stats.ToJsonOutput = {
      _showErrors: false,
      _showWarnings: false,
      errors: [],
      warnings: [],
      assets: [
        {
          name: 'sgpTrainTimesPage-784f294928e1a77ed6c4.js',
          size: 653190,
          chunks: [61],
          chunkNames: ['sgpTrainTimesPage'],
          emitted: true,
        },
      ],
    };

    expect(
      mapChunkNamesExtensionsToSize(stats, defaultBasePluginConfig.chunkFilename).sgpTrainTimesPage
        .js
    ).toHaveProperty('gzSize', null);
  });

  it('does not map image', () => {
    const stats: webpack4.Stats.ToJsonOutput = {
      _showErrors: false,
      _showWarnings: false,
      errors: [],
      warnings: [],
      assets: [
        {
          name: '3b1c17aaa00d5f277227fae592484408.jpg',
          size: 9705,
          chunks: [],
          chunkNames: [],
          emitted: true,
        },
      ],
    };

    expect(mapChunkNamesExtensionsToSize(stats, defaultBasePluginConfig.chunkFilename)).toEqual({});
  });
});
