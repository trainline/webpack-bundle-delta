/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */
import { Stats4, Stats5 } from './constants';
import extractStats, { ExtractedStats4, ExtractedStats5 } from './extractStats';

const baseStats: Stats5 = {
  version: '5.9.0',
};

const asset: Stats5['assets'][0] = {
  type: 'asset',
  name: 'main.js',
  size: 10000,
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
};

const statsWithAssets: Stats5 = {
  ...baseStats,
  assets: [asset],
};

const statsWithAssetsAndChildren: Stats5 = {
  ...baseStats,
  assets: [asset],
  children: [
    {
      ...baseStats,
      assets: [
        {
          ...asset,
          name: 'child.js',
          size: 1000,
        },
      ],
    },
  ],
};

const base4Stats: Stats4 = {
  version: '4.44.0',
  _showErrors: false,
  _showWarnings: false,
  errors: [],
  warnings: [],
};

const stats4Asset: Stats4['assets'][0] = {
  name: 'main.js',
  size: 10000,
  chunks: [],
  chunkNames: [],
  emitted: true,
};

const stats4WithAssets: Stats4 = {
  ...base4Stats,
  assets: [stats4Asset],
};

const stats4WithAssetsAndChildren: Stats4 = {
  ...base4Stats,
  assets: [stats4Asset],
  children: [
    {
      ...base4Stats,
      assets: [
        {
          ...stats4Asset,
          name: 'child.js',
          size: 1000,
        },
      ],
    },
  ],
};

describe('extractStats', () => {
  describe('webpack v5', () => {
    it('returns stats (single compile - no assets, no children)', () => {
      expect(extractStats(baseStats)).toEqual<ExtractedStats5>({
        majorVersion: 5,
        stats: [baseStats],
        original: baseStats,
      });
    });

    it('returns stats (single compile - assets, no children, no version)', () => {
      const noVersionStats = {
        ...statsWithAssets,
      } as Stats5;
      delete noVersionStats.version;

      expect(extractStats(noVersionStats)).toEqual<ExtractedStats5>({
        majorVersion: 5,
        stats: [noVersionStats],
        original: noVersionStats,
      });
    });

    it('returns stats (single compile - assets, no children)', () => {
      expect(extractStats(statsWithAssets)).toEqual<ExtractedStats5>({
        majorVersion: 5,
        stats: [statsWithAssets],
        original: statsWithAssets,
      });
    });

    it('returns stats (single compile - assets, children', () => {
      expect(extractStats(statsWithAssetsAndChildren)).toEqual<ExtractedStats5>({
        majorVersion: 5,
        stats: [statsWithAssetsAndChildren],
        original: statsWithAssetsAndChildren,
      });
    });

    it('returns stats (multi compile)', () => {
      const children = [statsWithAssets, statsWithAssetsAndChildren];
      const multiCompileStats: Stats5 = {
        ...baseStats,
        children,
      };

      expect(extractStats(multiCompileStats)).toEqual<ExtractedStats5>({
        majorVersion: 5,
        stats: children,
        original: multiCompileStats,
      });
    });

    it('returns stats (parallel-webpack --profile --json flags)', () => {
      const children = [statsWithAssets, statsWithAssetsAndChildren];

      expect(extractStats(children)).toEqual<ExtractedStats5>({
        majorVersion: 5,
        stats: children,
        original: children as unknown,
      });
    });
  });

  describe('webpack v4', () => {
    it('returns stats (single compile - no assets, no children)', () => {
      expect(extractStats(base4Stats)).toEqual<ExtractedStats4>({
        majorVersion: 4,
        stats: [base4Stats],
        original: base4Stats,
      });
    });

    it('returns stats (single compile - assets, no children, no version)', () => {
      const noVersionStats = {
        ...stats4WithAssets,
      } as Stats4;
      delete noVersionStats.version;

      expect(extractStats(noVersionStats)).toEqual<ExtractedStats4>({
        majorVersion: 4,
        stats: [noVersionStats],
        original: noVersionStats,
      });
    });

    it('returns stats (single compile - assets, no children)', () => {
      expect(extractStats(stats4WithAssets)).toEqual<ExtractedStats4>({
        majorVersion: 4,
        stats: [stats4WithAssets],
        original: stats4WithAssets,
      });
    });

    it('returns stats (single compile - assets, children', () => {
      expect(extractStats(stats4WithAssetsAndChildren)).toEqual<ExtractedStats4>({
        majorVersion: 4,
        stats: [stats4WithAssetsAndChildren],
        original: stats4WithAssetsAndChildren,
      });
    });

    it('returns stats (multi compile)', () => {
      const children = [stats4WithAssets, stats4WithAssetsAndChildren];
      const multiCompileStats: Stats4 = {
        ...base4Stats,
        children,
      };

      expect(extractStats(multiCompileStats)).toEqual<ExtractedStats4>({
        majorVersion: 4,
        stats: children,
        original: multiCompileStats,
      });
    });

    it('returns stats (parallel-webpack --profile --json flags)', () => {
      const children = [stats4WithAssets, stats4WithAssetsAndChildren];

      expect(extractStats(children)).toEqual<ExtractedStats4>({
        majorVersion: 4,
        stats: children,
        original: children as unknown,
      });
    });
  });
});
