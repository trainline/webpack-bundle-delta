/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */
import webpack from 'webpack';
import resolveAliasRemap, { ResolveAliasRemapSuggestion } from './resolveAliasRemap';

const stats: webpack.Stats.ToJsonOutput = {
  _showErrors: false,
  _showWarnings: false,
  errors: [],
  warnings: [],
  modules: [
    ({
      name: './node_modules/lodash/_getNative.js',
    } as unknown) as webpack.Stats.FnModules,
    ({
      name: './node_modules/lodash.omitby/index.js',
    } as unknown) as webpack.Stats.FnModules,
  ],
};

describe('resolveAliasRemap', () => {
  it('returns the expected alias remap suggestion for lodash.omitby (string alias entry)', () => {
    expect(
      resolveAliasRemap(stats, [
        { searchFor: 'lodash\\.([^/]+)', aliasEntry: 'lodash.$1: lodash/$1' },
      ])
    ).toEqual<ResolveAliasRemapSuggestion[]>([
      {
        name: './node_modules/lodash.omitby/index.js',
        suggestion: 'lodash.omitby: lodash/omitby',
      },
    ]);
  });

  it('returns the expected alias remap suggestion for lodash.omitby (function alias entry)', () => {
    expect(
      resolveAliasRemap(stats, [{ searchFor: 'lodash\\.([^/]+)', aliasEntry: () => 'some-remap' }])
    ).toEqual<ResolveAliasRemapSuggestion[]>([
      {
        name: './node_modules/lodash.omitby/index.js',
        suggestion: 'some-remap',
      },
    ]);
  });

  it('does not return suggestion when aliasEntry string is empty', () => {
    expect(resolveAliasRemap(stats, [{ searchFor: 'lodash\\.([^/]+)', aliasEntry: '' }])).toEqual(
      []
    );
  });

  it('does not return suggestion when aliasEntry function returns empty', () => {
    expect(
      resolveAliasRemap(stats, [{ searchFor: 'lodash\\.([^/]+)', aliasEntry: () => '' }])
    ).toEqual([]);
  });
});
