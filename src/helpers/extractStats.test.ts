/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */
import webpack4 from 'webpack4';
import extractStats from './extractStats';

const baseStats: webpack4.Stats.ToJsonOutput = {
  _showErrors: false,
  _showWarnings: false,
  errors: [],
  warnings: [],
};

const statsWithAssets: webpack4.Stats.ToJsonOutput = {
  ...baseStats,
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

const statsWithAssetsAndChildren: webpack4.Stats.ToJsonOutput = {
  ...baseStats,
  assets: [
    {
      name: '3b1c17aaa00d5f277227fae592484408.jpg',
      size: 9705,
      chunks: [],
      chunkNames: [],
      emitted: true,
    },
  ],
  children: [],
};

describe('extractStats', () => {
  it('returns stats (single compile - no assets, no children)', () => {
    expect(extractStats(baseStats)).toEqual([baseStats]);
  });

  it('returns stats (single compile - assets, no children)', () => {
    expect(extractStats(statsWithAssets)).toEqual([statsWithAssets]);
  });

  it('returns stats (single compile - assets, children', () => {
    expect(extractStats(statsWithAssetsAndChildren)).toEqual([statsWithAssetsAndChildren]);
  });

  it('returns stats (multi compile)', () => {
    const children = [statsWithAssets, statsWithAssetsAndChildren];
    const multiCompileStats: webpack4.Stats.ToJsonOutput = {
      ...baseStats,
      children,
    };

    expect(extractStats(multiCompileStats)).toEqual(children);
  });

  it('returns stats (parallel-webpack --profile --json flags)', () => {
    const children = [statsWithAssets, statsWithAssetsAndChildren];

    expect(extractStats(children)).toEqual(children);
  });
});
