/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */
import { defaultBasePluginConfig } from '../config/PluginConfig';
import getNameFromAsset, { Asset } from './getNameFromAsset';

const baseAsset = {
  name: '',
  size: 1608,
  chunks: [0],
  chunkNames: [],
  info: { immutable: true, minimized: true, size: 1608 },
  emitted: true,
} as typeof Asset;

describe('getNameFromAsset()', () => {
  it('returns name based on specified single chunkName', () => {
    const asset = {
      ...baseAsset,
      chunkNames: ['main'],
    } as typeof Asset;

    expect(getNameFromAsset(asset)).toBe('main');
  });

  it('returns name based on specified multiple chunkNames', () => {
    const asset = {
      ...baseAsset,
      chunkNames: ['main', 'another'],
    } as typeof Asset;

    expect(getNameFromAsset(asset)).toBe('main+another');
  });

  describe('when no chunkNames have been specified', () => {
    it('returns name based on "name" using default chunkFilename config', () => {
      const asset = {
        ...baseAsset,
        name: 'main.js',
      } as typeof Asset;

      expect(getNameFromAsset(asset, defaultBasePluginConfig.chunkFilename)).toBe('main');
    });

    it('returns name based on "name" using default chunkFilename config with extensions enabled', () => {
      const asset = {
        ...baseAsset,
        name: 'main.js',
      } as typeof Asset;

      expect(getNameFromAsset(asset, defaultBasePluginConfig.chunkFilename, true)).toBe('main.js');
    });

    it('returns custom "name" leaving in "hash"', () => {
      const chunkFilename = '[id]-[hash].[ext]';
      const asset = {
        ...baseAsset,
        name: 'main-012abc345def.mjs',
      } as typeof Asset;

      expect(getNameFromAsset(asset, chunkFilename)).toBe('main-[hash]');
    });

    it('returns custom "name" leaving in "hash" with extensions enabled', () => {
      const chunkFilename = '[id]-[hash].[ext]';
      const asset = {
        ...baseAsset,
        name: 'main-012abc345def.mjs',
      } as typeof Asset;

      expect(getNameFromAsset(asset, chunkFilename, true)).toBe('main-[hash].mjs');
    });

    it('returns custom "name" leaving in "hash" (matching chunkFilename from create-react-app)', () => {
      const chunkFilename = 'static/js/[name].[contenthash:8].js';
      const asset = {
        ...baseAsset,
        name: 'static/js/main.11111111.js',
      } as typeof Asset;

      expect(getNameFromAsset(asset, chunkFilename)).toBe('static/js/main.[contenthash:8]');
    });

    it('returns custom "name" leaving in "hash" (matching chunkFilename from create-react-app) with extensions enabled', () => {
      const chunkFilename = 'static/js/[name].[contenthash:8].js';
      const asset = {
        ...baseAsset,
        name: 'static/js/main.11111111.js',
      } as typeof Asset;

      expect(getNameFromAsset(asset, chunkFilename, true)).toBe(
        'static/js/main.[contenthash:8].js'
      );
    });

    it('returns original "name" when the chunkFilename does not match', () => {
      const chunkFilename = 'static/js/[name].[contenthash:8].js';
      const asset = {
        ...baseAsset,
        name: 'static/css/main.11111111.css',
      } as typeof Asset;

      expect(getNameFromAsset(asset, chunkFilename)).toBe('static/css/main.11111111');
    });

    it('returns original "name" when the chunkFilename does not match with extensions enabled', () => {
      const chunkFilename = 'static/js/[name].[contenthash:8].js';
      const asset = {
        ...baseAsset,
        name: 'static/css/main.11111111.css',
      } as typeof Asset;

      expect(getNameFromAsset(asset, chunkFilename, true)).toBe('static/css/main.11111111.css');
    });
  });
});
