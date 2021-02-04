/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */
import { defaultBasePluginConfig } from '../config/PluginConfig';
import { Stats4, Stats5 } from './constants';
import extractStats from './extractStats';

import mapChunkNamesExtensionsToSize from './mapChunkNamesExtensionsToSize';

describe('mapChunkNamesExtensionsToSize', () => {
  describe('webpack v5', () => {
    it('maps js/css/mjs (but not the .map files)', () => {
      const extractedStats = extractStats({
        assets: [
          {
            type: 'asset',
            name: 'sgpTrainTimesPage-5fd3bc7f80aa9a623024.js',
            size: 697628,
            chunkNames: ['sgpTrainTimesPage'],
            chunkIdHints: [],
            auxiliaryChunkNames: [],
            auxiliaryChunkIdHints: [],
            emitted: false,
            comparedForEmit: false,
            cached: true,
            info: {
              immutable: true,
              contenthash: '5fd3bc7f80aa9a623024',
              javascriptModule: false,
              minimized: true,
              related: {
                license: 'sgpTrainTimesPage-5fd3bc7f80aa9a623024.js.LICENSE.txt',
                sourceMap: 'sgpTrainTimesPage-5fd3bc7f80aa9a623024.js.map',
                gzipped: 'sgpTrainTimesPage-5fd3bc7f80aa9a623024.js.gz',
                brotliCompressed: 'sgpTrainTimesPage-5fd3bc7f80aa9a623024.js.br',
              },
            },
            filteredRelated: 0,
            related: [
              {
                type: 'sourceMap',
                name: 'sgpTrainTimesPage-5fd3bc7f80aa9a623024.js.map',
                size: 2006828,
                chunkNames: [],
                chunkIdHints: [],
                auxiliaryChunkNames: ['sgpTrainTimesPage'],
                auxiliaryChunkIdHints: [],
                emitted: false,
                comparedForEmit: false,
                cached: true,
                info: {
                  development: true,
                },
                chunks: [],
                auxiliaryChunks: [9789],
                isOverSizeLimit: false,
              },
              {
                type: 'gzipped',
                name: 'sgpTrainTimesPage-5fd3bc7f80aa9a623024.js.gz',
                size: 175985,
                chunkNames: [],
                chunkIdHints: [],
                auxiliaryChunkNames: [],
                auxiliaryChunkIdHints: [],
                emitted: false,
                comparedForEmit: false,
                cached: true,
                info: {
                  compressed: true,
                  immutable: true,
                },
                related: {},
                chunks: [],
                auxiliaryChunks: [],
                isOverSizeLimit: false,
              },
              {
                type: 'brotliCompressed',
                name: 'sgpTrainTimesPage-5fd3bc7f80aa9a623024.js.br',
                size: 140119,
                chunkNames: [],
                chunkIdHints: [],
                auxiliaryChunkNames: [],
                auxiliaryChunkIdHints: [],
                emitted: false,
                comparedForEmit: false,
                cached: true,
                info: {
                  compressed: true,
                  immutable: true,
                },
                related: {},
                chunks: [],
                auxiliaryChunks: [],
                isOverSizeLimit: false,
              },
              {
                type: 'license',
                name: 'sgpTrainTimesPage-5fd3bc7f80aa9a623024.js.LICENSE.txt',
                size: 1201,
                chunkNames: [],
                chunkIdHints: [],
                auxiliaryChunkNames: [],
                auxiliaryChunkIdHints: [],
                emitted: false,
                comparedForEmit: false,
                cached: true,
                info: {},
                related: {},
                chunks: [],
                auxiliaryChunks: [],
                isOverSizeLimit: false,
              },
            ],
            chunks: [9789],
            auxiliaryChunks: [],
            isOverSizeLimit: false,
          },
          {
            type: 'asset',
            name: 'sgpTrainTimesPage.b0c58d10bba703efd363.css',
            size: 295788,
            chunkNames: ['sgpTrainTimesPage'],
            chunkIdHints: [],
            auxiliaryChunkNames: [],
            auxiliaryChunkIdHints: [],
            emitted: false,
            comparedForEmit: false,
            cached: true,
            info: {
              immutable: true,
              contenthash: 'b0c58d10bba703efd363',
              related: {
                sourceMap: 'sgpTrainTimesPage.b0c58d10bba703efd363.css.map',
                gzipped: 'sgpTrainTimesPage.b0c58d10bba703efd363.css.gz',
                brotliCompressed: 'sgpTrainTimesPage.b0c58d10bba703efd363.css.br',
              },
            },
            filteredRelated: 0,
            related: [
              {
                type: 'sourceMap',
                name: 'sgpTrainTimesPage.b0c58d10bba703efd363.css.map',
                size: 437990,
                chunkNames: [],
                chunkIdHints: [],
                auxiliaryChunkNames: ['sgpTrainTimesPage'],
                auxiliaryChunkIdHints: [],
                emitted: false,
                comparedForEmit: false,
                cached: true,
                info: {
                  development: true,
                },
                related: {},
                chunks: [],
                auxiliaryChunks: [9789],
                isOverSizeLimit: false,
              },
              {
                type: 'gzipped',
                name: 'sgpTrainTimesPage.b0c58d10bba703efd363.css.gz',
                size: 45646,
                chunkNames: [],
                chunkIdHints: [],
                auxiliaryChunkNames: [],
                auxiliaryChunkIdHints: [],
                emitted: false,
                comparedForEmit: false,
                cached: true,
                info: {
                  compressed: true,
                  immutable: true,
                },
                related: {},
                chunks: [],
                auxiliaryChunks: [],
                isOverSizeLimit: false,
              },
              {
                type: 'brotliCompressed',
                name: 'sgpTrainTimesPage.b0c58d10bba703efd363.css.br',
                size: 37267,
                chunkNames: [],
                chunkIdHints: [],
                auxiliaryChunkNames: [],
                auxiliaryChunkIdHints: [],
                emitted: false,
                comparedForEmit: false,
                cached: true,
                info: {
                  compressed: true,
                  immutable: true,
                },
                related: {},
                chunks: [],
                auxiliaryChunks: [],
                isOverSizeLimit: false,
              },
            ],
            chunks: [9789],
            auxiliaryChunks: [],
            isOverSizeLimit: false,
          },
        ],
      } as Stats5);

      expect(
        mapChunkNamesExtensionsToSize(extractedStats, defaultBasePluginConfig.chunkFilename)
      ).toEqual({
        sgpTrainTimesPage: {
          css: {
            brSize: 37267,
            gzSize: 45646,
            size: 295788,
          },
          js: {
            brSize: 140119,
            gzSize: 175985,
            size: 697628,
          },
        },
      });
    });

    it('returns null when brolti is not defined', () => {
      const extractedStats = extractStats({
        assets: [
          {
            type: 'asset',
            name: 'sgpTrainTimesPage-5fd3bc7f80aa9a623024.js',
            size: 697628,
            chunkNames: ['sgpTrainTimesPage'],
            chunkIdHints: [],
            auxiliaryChunkNames: [],
            auxiliaryChunkIdHints: [],
            emitted: false,
            comparedForEmit: false,
            cached: true,
            info: {
              immutable: true,
              contenthash: '5fd3bc7f80aa9a623024',
              javascriptModule: false,
              minimized: true,
              related: {
                gzipped: 'sgpTrainTimesPage-5fd3bc7f80aa9a623024.js.gz',
              },
            },
            filteredRelated: 0,
            related: [],
            chunks: [9789],
            auxiliaryChunks: [],
            isOverSizeLimit: false,
          },
        ],
      } as Stats5);

      expect(
        mapChunkNamesExtensionsToSize(extractedStats, defaultBasePluginConfig.chunkFilename)
          .sgpTrainTimesPage.js
      ).toHaveProperty('brSize', null);
    });

    it('returns null when gzip is not defined', () => {
      const extractedStats = extractStats({
        assets: [
          {
            type: 'asset',
            name: 'sgpTrainTimesPage-5fd3bc7f80aa9a623024.js',
            size: 697628,
            chunkNames: ['sgpTrainTimesPage'],
            chunkIdHints: [],
            auxiliaryChunkNames: [],
            auxiliaryChunkIdHints: [],
            emitted: false,
            comparedForEmit: false,
            cached: true,
            info: {
              immutable: true,
              contenthash: '5fd3bc7f80aa9a623024',
              javascriptModule: false,
              minimized: true,
              related: {
                license: 'sgpTrainTimesPage-5fd3bc7f80aa9a623024.js.LICENSE.txt',
                sourceMap: 'sgpTrainTimesPage-5fd3bc7f80aa9a623024.js.map',
                gzipped: 'sgpTrainTimesPage-5fd3bc7f80aa9a623024.js.gz',
                brotliCompressed: 'sgpTrainTimesPage-5fd3bc7f80aa9a623024.js.br',
              },
            },
            filteredRelated: 0,
            related: [],
            chunks: [9789],
            auxiliaryChunks: [],
            isOverSizeLimit: false,
          },
        ],
      } as Stats5);

      expect(
        mapChunkNamesExtensionsToSize(extractedStats, defaultBasePluginConfig.chunkFilename)
          .sgpTrainTimesPage.js
      ).toHaveProperty('gzSize', null);
    });

    it('does not map image', () => {
      const extractedStats = extractStats({
        assets: [
          {
            type: 'asset',
            name: '537a564a96318309f3b965b7dc553e33.jpg',
            size: 175731,
            chunkNames: [],
            chunkIdHints: [],
            auxiliaryChunkNames: ['backgrounds'],
            auxiliaryChunkIdHints: [],
            emitted: false,
            comparedForEmit: false,
            cached: true,
            info: {},
            related: {},
            chunks: [],
            auxiliaryChunks: [4231],
            isOverSizeLimit: false,
          },
        ],
      } as Stats5);

      expect(
        mapChunkNamesExtensionsToSize(extractedStats, defaultBasePluginConfig.chunkFilename)
      ).toEqual({});
    });
  });

  describe('webpack v4', () => {
    it('maps js/css/mjs (but not the .map files)', () => {
      const extractedStats = extractStats({
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
      } as Stats4);

      expect(
        mapChunkNamesExtensionsToSize(extractedStats, defaultBasePluginConfig.chunkFilename)
      ).toEqual({
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
      const extractedStats = extractStats({
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
      } as Stats4);

      expect(
        mapChunkNamesExtensionsToSize(extractedStats, defaultBasePluginConfig.chunkFilename)
          .sgpTrainTimesPage.js
      ).toHaveProperty('brSize', null);
    });

    it('returns null when gzip is not defined', () => {
      const extractedStats = extractStats({
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
      } as Stats4);

      expect(
        mapChunkNamesExtensionsToSize(extractedStats, defaultBasePluginConfig.chunkFilename)
          .sgpTrainTimesPage.js
      ).toHaveProperty('gzSize', null);
    });

    it('does not map image', () => {
      const extractedStats = extractStats({
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
      } as Stats4);

      expect(
        mapChunkNamesExtensionsToSize(extractedStats, defaultBasePluginConfig.chunkFilename)
      ).toEqual({});
    });
  });
});
