/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */
import webpack4 from 'webpack4';
import { defaultBasePluginConfig } from '../../config/PluginConfig';
import restrict, { RestrictedModule } from './restrict';

const stats: webpack4.Stats.ToJsonOutput = {
  _showErrors: false,
  _showWarnings: false,
  errors: [],
  warnings: [],
  assets: [
    {
      name: 'file-1-hash.js',
      size: 80,
      chunks: [1],
      chunkNames: ['file-1'],
      emitted: true,
    },
    {
      name: 'file-2-hash.js',
      size: 80,
      chunks: [1, 2],
      chunkNames: ['file-2'],
      emitted: true,
    },
  ],
  modules: [
    ({
      name: './node_modules/lodash/_getNative.js',
      issuerPath: [
        {
          name: './src/client/entry.jsx',
        },
        {
          name: './src/common/component/some-component.jsx',
        },
      ],
      chunks: [1, 2],
    } as unknown) as webpack4.Stats.FnModules,
    ({
      name: './node_modules/lodash.omitby/index.js',
      issuerPath: [
        {
          name: './src/client/another-entry.js',
        },
        {
          name: './src/common/lib/some-lib.js',
        },
      ],
      chunks: [2],
    } as unknown) as webpack4.Stats.FnModules,
    ({
      name: './node_modules/not-restricted/index.js',
      issuerPath: [
        {
          name: './src/client/another-entry.js',
        },
      ],
      chunks: [1],
    } as unknown) as webpack4.Stats.FnModules,
  ],
};

describe('restrict', () => {
  it('returns the expected restricted files', () => {
    expect(
      restrict(stats, defaultBasePluginConfig.chunkFilename, [
        { search: 'lodash.omitby', responseType: 'error', message: 'no lodash.omitby' },
      ])
    ).toEqual<RestrictedModule[]>([
      {
        filename: './node_modules/lodash.omitby/index.js',
        restriction: {
          message: 'no lodash.omitby',
          responseType: 'error',
          search: 'lodash.omitby',
        },
        chunkNames: ['file-2.js'],
        issuerPath: ['./src/client/another-entry.js', './src/common/lib/some-lib.js'],
      },
    ]);
  });

  it('returns the expected restrict files when using regexp', () => {
    expect(
      restrict(stats, defaultBasePluginConfig.chunkFilename, [
        { search: 'lodash.+', responseType: 'error', message: 'no lodash components' },
      ])
    ).toEqual<RestrictedModule[]>([
      {
        filename: './node_modules/lodash.omitby/index.js',
        restriction: {
          message: 'no lodash components',
          responseType: 'error',
          search: 'lodash.+',
        },
        chunkNames: ['file-2.js'],
        issuerPath: ['./src/client/another-entry.js', './src/common/lib/some-lib.js'],
      },
      {
        filename: './node_modules/lodash/_getNative.js',
        restriction: {
          message: 'no lodash components',
          responseType: 'error',
          search: 'lodash.+',
        },
        chunkNames: ['file-1.js', 'file-2.js'],
        issuerPath: ['./src/client/entry.jsx', './src/common/component/some-component.jsx'],
      },
    ]);
  });

  it('returns unique results (for multi compile)', () => {
    expect(
      restrict(
        {
          _showErrors: false,
          _showWarnings: false,
          errors: [],
          warnings: [],
          children: [stats, stats],
        },
        defaultBasePluginConfig.chunkFilename,
        [{ search: 'lodash.omitby', responseType: 'error', message: 'no lodash.omitby' }]
      )
    ).toEqual<RestrictedModule[]>([
      {
        filename: './node_modules/lodash.omitby/index.js',
        restriction: {
          message: 'no lodash.omitby',
          responseType: 'error',
          search: 'lodash.omitby',
        },
        chunkNames: ['file-2.js'],
        issuerPath: ['./src/client/another-entry.js', './src/common/lib/some-lib.js'],
      },
    ]);
  });
});
